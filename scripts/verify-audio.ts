/**
 * 音频文件完整性校验
 *
 * 为什么要有这个脚本：第二十二轮踩过一次很隐蔽的坑 ——
 * 2024-06 的听力 MP3 带了一个 4KB 的 ID3v2 标签，标签里 TPE1/TPE2 两个文本框
 * 声明成 ISO-8859-1，实际塞的是 GBK 字节。macOS 的 afconvert 能解码，
 * Chrome 却一收到媒体请求就中止，界面上的进度条永远停在 0:53。
 *
 * 这类问题肉眼看不出来、单元测试也测不到，只有真的让浏览器播一次才知道。
 * 所以这里把「浏览器能不能播」能机械判断的部分全部钉死：
 *
 *   1. 文件在不在 public/ 下；
 *   2. ID3 标签结构完整、不越界；
 *   3. 文本框声明的编码和实际字节对得上（声明 ISO-8859-1 就必须是 ASCII）；
 *   4. MPEG 帧链完整：一帧接一帧能走到文件尾，中间不能断；
 *   5. 算出来的真实时长盖得住数据里最后一个题段的结束时间 ——
 *      数据说这段在 1647.54 秒结束，文件就得至少有这么长。
 *
 * Run with: npm run verify:audio
 */
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { PAPERS, unitAudioRange } from "../src/lib/papers";

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string) {
  if (ok) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
}

/* ------------------------------------------------------------ ID3v2 */

interface Id3Frame {
  id: string;
  body: Buffer;
}

/** 读 ID3v2 标签里的所有帧；没有标签就返回空数组 */
function readId3Frames(buf: Buffer): { frames: Id3Frame[]; tagEnd: number; version: number } {
  if (buf.length < 10 || buf.toString("latin1", 0, 3) !== "ID3") {
    return { frames: [], tagEnd: 0, version: 0 };
  }
  const major = buf[3];
  // 标签大小是 syncsafe 的四字节：每字节只有低 7 位有效
  const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
  const tagEnd = 10 + size;
  const frames: Id3Frame[] = [];

  let p = 10;
  while (p + 10 <= tagEnd) {
    const id = buf.toString("latin1", p, p + 4);
    if (!/^[A-Z0-9]{4}$/.test(id)) break; // 填充区到此为止
    let frameSize: number;
    if (major <= 2) {
      // v2.2：3 字节帧名 + 3 字节长度，这里只处理 v2.3/v2.4
      frameSize = buf.readUIntBE(p + 4, 4);
    } else if (major === 4) {
      frameSize = ((buf[p + 4] & 0x7f) << 21) | ((buf[p + 5] & 0x7f) << 14) | ((buf[p + 6] & 0x7f) << 7) | (buf[p + 7] & 0x7f);
    } else {
      frameSize = buf.readUIntBE(p + 4, 4);
    }
    if (frameSize <= 0 || p + 10 + frameSize > buf.length) break;
    frames.push({ id, body: buf.subarray(p + 10, p + 10 + frameSize) });
    p += 10 + frameSize;
  }
  return { frames, tagEnd, version: major };
}

/** 文本框声明的编码，字节必须真的符合那个编码 */
function textEncodingOk(body: Buffer): { ok: boolean; why: string } {
  if (body.length === 0) return { ok: false, why: "空文本框" };
  const enc = body[0];
  const payload = body.subarray(1);
  if (enc === 0) {
    // ISO-8859-1：这里只放 ASCII。多出来的非 ASCII 字节就是拿别的编码冒充，
    // 浏览器解不动 —— 第二十二轮那批文件就是这么坏的。
    for (const b of payload) {
      if (b > 0x7f) return { ok: false, why: `声明 ISO-8859-1 但含非 ASCII 字节 0x${b.toString(16)}` };
    }
    return { ok: true, why: "" };
  }
  if (enc === 3) {
    const text = payload.toString("utf8");
    if (Buffer.from(text, "utf8").compare(payload) !== 0) {
      return { ok: false, why: "声明 UTF-8 但不是合法 UTF-8" };
    }
    return { ok: true, why: "" };
  }
  if (enc === 1 || enc === 2) {
    if (payload.length % 2 !== 0) return { ok: false, why: "声明 UTF-16 但字节数是奇数" };
    return { ok: true, why: "" };
  }
  return { ok: false, why: `未知的文本编码 ${enc}` };
}

/* ------------------------------------------------------------ MPEG 帧 */

// MPEG-1 Layer III 的码率表（kbps），索引即帧头的码率位
const BITRATE_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
// MPEG-2 / 2.5 Layer III 的码率表（kbps）
const BITRATE_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
// 采样率：索引 3 = MPEG-1，2 = MPEG-2，0 = MPEG-2.5
const SAMPLE_RATES: Record<number, number[]> = {
  3: [44100, 48000, 32000, 0],
  2: [22050, 24000, 16000, 0],
  0: [11025, 12000, 8000, 0],
};

interface FrameWalk {
  frames: number;
  sampleRate: number;
  durationSec: number;
  /** 最后一帧结束的位置到文件尾之间剩下的字节 */
  trailing: number;
  trailingIsId3v1: boolean;
  broken: string;
}

/** 一帧接一帧地走完整��� MP3；任何一步对不上就记下来 */
function walkFrames(buf: Buffer, start: number): FrameWalk {
  const out: FrameWalk = {
    frames: 0,
    sampleRate: 0,
    durationSec: 0,
    trailing: 0,
    trailingIsId3v1: false,
    broken: "",
  };
  let p = start;
  while (p + 4 <= buf.length) {
    const h = buf[p];
    if (h !== 0xff || (buf[p + 1] & 0xe0) !== 0xe0) {
      // 音频后面允许跟一个 128 字节的 ID3v1 标签（"TAG" 开头），那是结尾，不是断链
      const rest = buf.length - p;
      if (rest === 128 && buf.toString("latin1", p, p + 3) === "TAG") break;
      out.broken = `第 ${out.frames} 帧处失去同步（偏移 ${p}）`;
      break;
    }
    const versionId = (buf[p + 1] >> 3) & 0x03;
    const layer = (buf[p + 1] >> 1) & 0x03;
    if (layer !== 1) {
      out.broken = `第 ${out.frames} 帧不是 Layer III（偏移 ${p}）`;
      break;
    }
    const bitrateIndex = (buf[p + 2] >> 4) & 0x0f;
    const rateIndex = (buf[p + 2] >> 2) & 0x03;
    const padding = (buf[p + 2] >> 1) & 0x01;
    const isV1 = versionId === 3;
    const bitrate = (isV1 ? BITRATE_V1 : BITRATE_V2)[bitrateIndex] * 1000;
    const sampleRate = SAMPLE_RATES[versionId]?.[rateIndex] ?? 0;
    if (!bitrate || !sampleRate) {
      out.broken = `第 ${out.frames} 帧的码率/采样率不合法（偏移 ${p}）`;
      break;
    }
    const frameLength = isV1
      ? Math.floor((144 * bitrate) / sampleRate) + padding
      : Math.floor((72 * bitrate) / sampleRate) + padding;
    if (out.sampleRate === 0) out.sampleRate = sampleRate;
    p += frameLength;
    out.frames += 1;
  }
  out.durationSec = (out.frames * 1152) / (out.sampleRate || 1);
  out.trailing = buf.length - p;
  out.trailingIsId3v1 = out.trailing === 128 && buf.toString("latin1", p, p + 3) === "TAG";
  return out;
}

/* ------------------------------------------------------------ 主流程 */

for (const paper of PAPERS) {
  const timing = paper.timing;
  if (!timing) continue; // 官方第三套没有听力，不该有音频
  const rel = timing.audioPath.replace(/^\//, "");
  const path = join(process.cwd(), "public", rel);

  check(`${paper.id} 音频文件存在`, statSync(path, { throwIfNoEntry: false }) !== undefined, path);

  const buf = readFileSync(path);
  const { frames, tagEnd, version } = readId3Frames(buf);
  check(`${paper.id} ID3 标签不越界`, tagEnd <= buf.length, `tagEnd ${tagEnd} > ${buf.length}`);
  if (version > 0) {
    check(`${paper.id} ID3 标签在文件头`, tagEnd > 0, `版本 ${version}`);
  }
  for (const frame of frames) {
    if (frame.id.startsWith("T")) {
      const { ok, why } = textEncodingOk(frame.body);
      check(`${paper.id} ID3 文本框 ${frame.id} 编码自洽`, ok, why);
    } else if (frame.id === "COMM" && frame.body.length >= 4) {
      const { ok, why } = textEncodingOk(Buffer.concat([frame.body.subarray(0, 1), frame.body.subarray(4)]));
      check(`${paper.id} ID3 COMM 编码自洽`, ok, why);
    }
  }

  const walk = walkFrames(buf, tagEnd);
  check(`${paper.id} MP3 帧链完整`, walk.broken === "", walk.broken);
  check(`${paper.id} MP3 帧数 > 1000`, walk.frames > 1000, `${walk.frames} 帧`);
  check(
    `${paper.id} 文件尾只有 ID3v1 或什么都没有`,
    walk.trailing === 0 || walk.trailingIsId3v1,
    `剩 ${walk.trailing} 字节`,
  );

  // 数据里的最后一个题段结束时间，必须落在这个文件的真实时长之内
  const lastEnd = Math.max(
    ...paper.listeningUnits.map((u) => {
      const r = unitAudioRange(u);
      return r.endSec;
    }),
  );
  check(
    `${paper.id} 音频真实时长盖得住最后一个题段`,
    walk.durationSec >= lastEnd,
    `文件 ${walk.durationSec.toFixed(2)}s < 需要的 ${lastEnd}s`,
  );
  check(
    `${paper.id} durationSec 与文件真实时长一致`,
    Math.abs(timing.durationSec - walk.durationSec) <= 1.5,
    `标 ${timing.durationSec}s，实测 ${walk.durationSec.toFixed(2)}s`,
  );
}

if (failures.length > 0) {
  console.error(`\n❌ 音频文件校验失败 ${failures.length} 项：`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\n音频文件校验：${passed} 项通过，0 项失败`);
console.log("全部通过 ✓");
