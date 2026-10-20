/**
 * 单词与例句发音。走浏览器自带的 Web Speech API，不打包任何音频文件 ——
 * 103 个词条各存一段 mp3 既占体积又难维护。
 *
 * 这里面真正决定「听着正不正」的不是 rate/pitch，而是**挑对音色**。
 * getVoices() 返回的列表里混着 macOS 的 novelty 音色（Zarvox、Bubbles、
 * Organ 那种）、各种老式机器音色，以及不同语言包，挑第一个就朗读会经常挑到
 * 最差的那个。所以下面做的是打分排序，不是 find 第一个。
 *
 * 还有一条不能越过的线：整套发音留在本机，不接任何在线 TTS ——
 * 「数据只保存在这台设备上」是产品的底线，不是标语。
 *
 * 已知限制：iOS Safari 的 speechSynthesis 要在用户手势里首次触发才出声，
 * 所以只能由点击「🔊」按钮调用，不能在页面加载时自动播。
 */

export type SpeechAccent = "en-GB" | "en-US";

const ACCENT_KEY = "cet6.accent";

/**
 * 默认跟词库音标走 —— 这本词库标的是英式（ɪ'kɒnəmɪ、'prɒfɪt、ˈsemɪnɑː(r)），
 * 点朗读听到的却要是美音，学生会直接对不上。
 * 六级**听力真题音频**本身是美音，那条链路走的是真实 mp3，不受影响。
 */
let accent: SpeechAccent = readStoredAccent();

function readStoredAccent(): SpeechAccent {
  if (typeof window === "undefined") return "en-GB";
  const stored = window.localStorage.getItem(ACCENT_KEY);
  return stored === "en-US" ? "en-US" : "en-GB";
}

export function setSpeechAccent(next: SpeechAccent): void {
  accent = next;
  try {
    window.localStorage.setItem(ACCENT_KEY, next);
  } catch {
    /* 无痕模式下写不进去也不影响这次会话 */
  }
  stopSpeaking();
  emit();
}

export function getSpeechAccent(): SpeechAccent {
  return accent;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/* --------------------------------------------------------------- 音色优选 */

/**
 * 宁可不出声也别用的音色。
 *
 * 这些是 macOS 自带的「拟人」/「怪声」彩蛋音色和早年的机器 TTS：
 * 念单词时它们会把重音和音节拉出奇怪的调子，听着像故障而不是发音。
 */
const JUNK_VOICE =
  /zarvox|bubbles|boing|booey|cellos|organ|superstar|trinoids|wobble|bells|bahh|bad news|good news|junior|grandma|grandpa|kathy|ralph|deranged|doctor|sandy|shelley|albert|ring ring|\bfred\b|\breed\b|\bfl(o|o)\b|compact|eloquence|espeak|festival|pico|whisper|junior|organ|devanagari/i;

/** 公认读得自然、发音准确的音色，按系统分。名字匹配就优先。 */
const GOOD_VOICE =
  /samantha|alex\b|ava\b|allison|evan\b|nathan\b|tom\b|nicky|aaron\b|susan\b|serena|daniel\b|oliver\b|kate\b|martha\b|fiona|moira|aria\b|jenny\b|guy\b|christopher|michelle|steffan|libby|maisie|rya?n\b|sonia|thomas|google (us|uk) english/i;

function voiceScore(v: SpeechSynthesisVoice): number {
  const name = v.name ?? "";
  if (JUNK_VOICE.test(name)) return -1;
  let score = 0;
  if (GOOD_VOICE.test(name)) score += 100;
  // macOS 的 Enhanced / Siri 音色素来就比老音色稳
  if (/enhanced|premium|siri|natural|neural/i.test(name)) score += 40;
  // 本地音色不联网、也不受服务端音色下架影响
  if (v.localService) score += 20;
  // 网络音色（Chrome 的 Google xxx）音质通常更好，但偶发不可用，排后面兜底
  if (/google/i.test(name)) score += 15;
  return score;
}

function langMatches(v: SpeechSynthesisVoice, want: SpeechAccent): boolean {
  const wantRegion = want === "en-GB" ? "gb" : "us";
  const lang = (v.lang ?? "").toLowerCase().replace(/_/g, "-");
  return lang.includes(`-${wantRegion}`);
}

/** 语音列表异步加载，首次 getVoices() 常是空的，所以缓存 + 监听变更。 */
let cachedVoices: SpeechSynthesisVoice[] = [];
let listBound = false;

function refreshVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

function bindVoiceList(): void {
  if (listBound || !speechSupported()) return;
  listBound = true;
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    refreshVoices();
    // 系统装了新语音包之后当前音色可能变了，订阅者要跟着更新
    emit();
  });
}

/**
 * 按当前口音挑一个最像样的音色。
 *
 * 顺序是：同口音里评分最高的 → 同口音里任意能用的 → 同语言任意口音。
 * 最后两级是兜底，宁可口音差一点也别没声音。
 */
export function pickVoice(want: SpeechAccent = accent): SpeechSynthesisVoice | null {
  bindVoiceList();
  const voices = cachedVoices.length > 0 ? cachedVoices : refreshVoices();
  if (voices.length === 0) return null;

  const pool = voices.filter((v) => /^en/i.test(v.lang ?? ""));
  if (pool.length === 0) return null;

  const ranked = (candidates: SpeechSynthesisVoice[]) =>
    candidates
      .map((v) => ({ v, score: voiceScore(v) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score);

  const sameAccent = ranked(pool.filter((v) => langMatches(v, want)));
  if (sameAccent.length > 0) return sameAccent[0].v;

  const anyEnglish = ranked(pool);
  return anyEnglish.length > 0 ? anyEnglish[0].v : null;
}

/** 当前实际会用到的音色名。设置里显示出来，「听着怪」时能直接定位到是谁在念。 */
export function currentVoiceName(want: SpeechAccent = accent): string {
  return pickVoice(want)?.name ?? "（系统没装英文语音）";
}

/* ------------------------------------------------- 外部状态订阅（水合安全） */

/**
 * 口音和音色都是「问浏览器要」的值：服务端渲染时根本没有 window 和
 * speechSynthesis，所以不能用 useState + useEffect 去读 —— 那样首帧会不一致，
 * 而且在 effect 里同步 setState 正是这套代码明令禁止的写法。
 *
 * useSyncExternalStore 就是为这种「外部可变源」准备的：getServerSnapshot 给
 * 服务端一份固定值，客户端挂载后自动换成真值，中间不会闪烁也不会水合报错。
 */

export interface SpeechInfo {
  accent: SpeechAccent;
  voiceName: string;
}

const SERVER_INFO: SpeechInfo = { accent: "en-GB", voiceName: "…" };

let cachedInfo: SpeechInfo | null = null;
const listeners = new Set<() => void>();

function buildInfo(): SpeechInfo {
  return { accent, voiceName: currentVoiceName() };
}

function emit(): void {
  const next = buildInfo();
  // 引用必须复用：getSnapshot 每次返回新对象会让 React 以为一直在变
  if (cachedInfo && cachedInfo.accent === next.accent && cachedInfo.voiceName === next.voiceName) {
    return;
  }
  cachedInfo = next;
  for (const listener of listeners) listener();
}

function subscribeSpeech(listener: () => void): () => void {
  bindVoiceList();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSpeechSnapshot(): SpeechInfo {
  if (!cachedInfo) cachedInfo = buildInfo();
  return cachedInfo;
}

function getServerSpeechSnapshot(): SpeechInfo {
  return SERVER_INFO;
}

/** 服务端渲染用的固定值，别在别处再抄一份。 */
export const SERVER_SPEECH_INFO = SERVER_INFO;

export function subscribeSpeechState(listener: () => void): () => void {
  return subscribeSpeech(listener);
}

export function getSpeechSnapshotCached(): SpeechInfo {
  return getSpeechSnapshot();
}

export function getServerSpeechSnapshotCached(): SpeechInfo {
  return getServerSpeechSnapshot();
}

/* ------------------------------------------------------------------ 朗读 */

/**
 * 朗读一段英文。返回是否真的发出了声音。
 *
 * 语速比默认值慢一点：背单词是要听清每个音节，不是练听力语速。
 * 例句也走这里，但长句会自动再慢一点。
 */
export function speak(text: string): boolean {
  if (!speechSupported() || !text.trim()) return false;
  const synth = window.speechSynthesis;
  const clean = text.trim();
  const voice = pickVoice();

  const utter = () => {
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = voice?.lang ?? accent;
      // 长句慢一点，逗号句号处也停一停，跟读时不至于糊成一片
      u.rate = clean.length > 40 ? 0.82 : 0.9;
      u.pitch = 1;
      if (voice) u.voice = voice;
      synth.speak(u);
    } catch {
      /* 系统语音引擎抽风就当没出声，不打断界面 */
    }
  };

  // Chrome 上 cancel() 紧接着 speak() 有已知的静默失败：引擎还没从上一次
  // 取消里恢复过来，这一句就被吞了，人听着就是「按了没反应」。
  // 让出一个事件循环再念，实测能稳定出声。
  try {
    synth.cancel();
    window.setTimeout(utter, 60);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
