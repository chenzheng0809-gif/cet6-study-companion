#!/usr/bin/env python3
"""
测出每一道听力题「题干」的起止时间。

为什么要测：
  做题界面按考场规矩不显示题干，所以「再听一遍第 3 题那道题」这件事，
  界面上一直没有入口。要做，就得知道每道题的题干在音频的哪一段。

怎么测（全部来自真实音频，不猜）：
  1. 静音能量分析找出答题停顿（13～15 秒的整段沉默）。
     每道题后面都有这样一个停顿 —— 停顿的起点 = 这道题题干播完的时刻。
  2. 第 2 题往后，题干起点就是上一个停顿的终点 —— 同样是实测的静音边界。
  3. 每段的第一题，题干起点在原文之后（录音里先念
     "Questions 1 to 4 are based on…" 再念 "Question 1."），
     靠逐段转写从后往前找 —— 找到第一个念出 "Question N" 的那一段，
     它的起点就是这道题题干的起点。
  4. 每道题都单独转写一遍做校验：这一段里必须念出这道题的题号，
     而且不能念出别的题号。校验不过就不写进数据。

用法：
    python3 scripts/measure-question-windows.py <mp3> <out.json> \
        --groups 4,4,3,4,3,3,4 --units l-c1,l-c2,l-b1,l-b2,l-r1,l-r2,l-r3
"""
import argparse
import importlib.util
import json
import os
import re
import subprocess
import sys
import time
import wave

import numpy as np

TOOL = "connector__matrix__listen_audio"
TMP = "/tmp/cet6-qwin"

# 录音里念的题号：有的卷念数字，有的卷念英文单词
NUM_WORDS = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven",
    8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
    14: "fourteen", 15: "fifteen", 16: "sixteen", 17: "seventeen",
    18: "eighteen", 19: "nineteen", 20: "twenty", 21: "twenty one",
    22: "twenty two", 23: "twenty three", 24: "twenty four", 25: "twenty five",
}


def marker_re(n: int) -> re.Pattern:
    """「Question 5」/「Question five」/「Question twenty-two」。

    但不能匹配 "Questions 1 to 4"（那是公告，不是题号标记）。
    转写出来的英文数词可能带连字符（twenty-two），也可能写成 "twenty 2"，
    这几种都得认，否则会漏掉每一段的第 22 题往后。
    """
    word = NUM_WORDS.get(n)
    if not word:
        return re.compile(rf"\bquestion\s+{n}\b", re.I)
    parts = word.split(" ")
    variants = {parts[0]} if len(parts) == 1 else set()
    if len(parts) > 1:
        head, tail = parts[0], parts[-1]
        variants.add(rf"{head}[-\s]?{tail}")  # twenty two / twenty-two
        variants.add(rf"{head}[-\s]?{n % 10}")  # twenty 2
        variants.add(rf"{head}\s+{n}")  # twenty 22
    alt = "|".join(sorted(variants))
    return re.compile(rf"\bquestion\s+(?:{n}|{alt})\b", re.I)


def load_analysis_module():
    """复用 analyze-2024-06-audio.py 的静音分析，不另抄一份。"""
    here = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(here, "analyze-2024-06-audio.py")
    spec = importlib.util.spec_from_file_location("cet6_audio_analysis", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def to_wav(mp3: str, wav: str) -> None:
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@44100", mp3, wav], check=True)


def slice_wav(src: str, dst: str, start: float, end: float) -> None:
    with wave.open(src, "rb") as w:
        params = w.getparams()
        sr = params.framerate
        w.setpos(int(start * sr))
        frames = w.readframes(max(0, int((end - start) * sr)))
    with wave.open(dst, "wb") as out:
        out.setparams(params)
        out.writeframes(frames)


def transcribe(path: str) -> str:
    """上传 → 转写。上传和转写都会偶发失败，都得重试。"""
    url = ""
    for attempt in range(4):
        proc = subprocess.run(
            ["mcode-tools", "upload_temp_url", path], capture_output=True, text=True
        )
        try:
            url = json.loads(proc.stdout)["temp_url"]
            break
        except Exception:
            print(f"    上传失败，重试：{(proc.stderr or proc.stdout).strip()[:100]}")
            time.sleep(5 * (attempt + 1))
    if not url:
        return ""
    args_path = path + ".args.json"
    with open(args_path, "w") as fh:
        json.dump({"audio_info": {"url": url, "mime_type": "audio/wav"}}, fh)
    out = ""
    for attempt in range(4):
        proc = subprocess.run(
            ["mcode-tools", "connector", "call", TOOL, "--args-file", args_path],
            capture_output=True,
            text=True,
        )
        if proc.returncode == 0:
            out = proc.stdout
            break
        print(f"    转写失败，重试：{proc.stderr.strip()[:100]}")
        time.sleep(5 * (attempt + 1))
    if os.path.exists(args_path):
        os.remove(args_path)
    return json.loads(out).get("transcription", "") if out else ""


def asr_range(wav: str, small: str, start: float, end: float) -> str:
    """截一段 → 压成 16k 单声道 → 转写。

    转写失败（网络不通）时返回空串 —— 调用方必须把它当成「没测到」，
    绝不能当成「这段里没有题号」，否则会写进去一个错的起点。
    """
    raw = small + ".raw.wav"
    slice_wav(wav, raw, start, end)
    subprocess.run(
        ["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", raw, small], check=True
    )
    return transcribe(small)


def speech_segments(wav: str, analysis) -> list:
    """语音段：连续有声段，间隙小于 MERGE_GAP 的合并。与 analyze 脚本同一套参数。"""
    rms, sr, duration = analysis.frames(wav)
    db = 20 * np.log10(rms)
    voiced = db > analysis.THRESHOLD_DB
    segments = []
    i = 0
    n = len(voiced)
    while i < n:
        if voiced[i]:
            j = i
            while j < n:
                if voiced[j]:
                    j += 1
                    continue
                k = j
                while k < n and not voiced[k]:
                    k += 1
                if (k - j) * analysis.HOP <= analysis.MERGE_GAP:
                    j = k
                else:
                    break
            segments.append((round(i * analysis.HOP, 2), round(j * analysis.HOP, 2)))
            i = j
        else:
            i += 1
    return segments, duration


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp3")
    ap.add_argument("out")
    ap.add_argument("--groups", required=True, help="每段的题数，如 4,4,3,4,3,3,4")
    ap.add_argument("--units", required=True, help="段 id，如 l-c1,l-c2,...")
    ap.add_argument(
        "--resume",
        action="store_true",
        help="已有输出文件里校验通过的题不再重测（网络不稳时少跑几遍）",
    )
    ap.add_argument(
        "--tmp",
        default=TMP,
        help="临时目录（切片和探针放这儿），多份卷子并行时各用各的",
    )
    args = ap.parse_args()

    groups = [int(x) for x in args.groups.split(",")]
    unit_ids = args.units.split(",")
    assert len(groups) == len(unit_ids), "groups 与 units 数量要对得上"

    os.makedirs(args.tmp, exist_ok=True)
    wav = os.path.join(args.tmp, os.path.basename(args.mp3).rsplit(".", 1)[0] + ".wav")
    if not os.path.exists(wav):
        to_wav(args.mp3, wav)

    analysis = load_analysis_module()
    speech, duration = speech_segments(wav, analysis)
    silences = [(a[1], b[0]) for a, b in zip(speech, speech[1:])]
    pauses = [
        (round(s, 2), round(e, 2))
        for s, e in silences
        if analysis.PAUSE_MIN <= (e - s) <= analysis.PAUSE_MAX
    ]
    print(f"{os.path.basename(args.mp3)}  时长 {duration:.1f}s  语音段 {len(speech)}  停顿 {len(pauses)}")
    assert len(pauses) == sum(groups), f"停顿数 {len(pauses)} 与题数 {sum(groups)} 对不上"

    small = os.path.join(args.tmp, "probe.wav")
    out_units = []
    qno = 1
    pause_at = 0

    # 续跑：上一遍已经校验通过的题直接沿用
    done: dict[str, dict[int, dict]] = {}
    if args.resume and os.path.exists(args.out):
        with open(args.out) as fh:
            for u in json.load(fh).get("units", []):
                done[u["unitId"]] = {q["n"]: q for q in u["questions"] if q.get("verified")}
        kept = sum(len(v) for v in done.values())
        print(f"续跑：沿用 {kept} 道已校验的题")

    def save() -> None:
        """每测完一段就落盘 —— 中途断网不用从头再来。"""
        with open(args.out, "w") as fh:
            json.dump(
                {"mp3": os.path.basename(args.mp3), "units": out_units},
                fh,
                ensure_ascii=False,
                indent=2,
            )

    for unit_id, count in zip(unit_ids, groups):
        unit_pauses = pauses[pause_at : pause_at + count]
        pause_at += count
        print(f"\n=== {unit_id} ===")
        questions = []

        for k, (p_start, p_end) in enumerate(unit_pauses):
            n_q = qno
            qno += 1

            cached = done.get(unit_id, {}).get(n_q)
            if cached:
                questions.append(cached)
                print(f"  第 {n_q} 题 {cached['startSec']:.2f} – {cached['endSec']:.2f} 沿用")
                continue

            # 题干起点：第 2 题往后 = 上一个停顿的终点
            stem_start = unit_pauses[k - 1][1] if k > 0 else None

            if stem_start is None:
                # 本段第一题：从后往前找第一个念出题号的那一段
                head = [s for s in speech if s[0] < p_start and s[1] > p_start - 30]
                for s, e in reversed(head):
                    text = asr_range(wav, small, s, e)
                    if not text.strip():
                        # 网络不通，不是「这段里没有题号」—— 停下来，别写进去一个错的起点
                        raise SystemExit(
                            f"第 {n_q} 题定位失败：转写没返回内容（多半是网络不通）。"
                            f"等网络恢复后用 --resume 接着跑。"
                        )
                    if marker_re(n_q).search(text):
                        stem_start = s
                        print(f"  第 {n_q} 题起点 {s}s ←「{text.strip()[:40]}」")
                        break
                if stem_start is None:
                    # 后面几题的起点跟这道题无关（就是上一个停顿的终点），继续往下测
                    print(f"  !! 第 {n_q} 题找不到题号，这一段不写进数据")
                    continue

            # 校验：这一段里必须念出这道题的题号，且不能有别的题号
            text = asr_range(wav, small, stem_start, p_start)
            if not text.strip():
                raise SystemExit(
                    f"第 {n_q} 题校验失败：转写没返回内容（多半是网络不通）。"
                    f"等网络恢复后用 --resume 接着跑。"
                )
            ok_self = bool(marker_re(n_q).search(text))
            others = [
                m
                for m in range(max(1, n_q - count), n_q + count)
                if m != n_q and marker_re(m).search(text)
            ]
            verified = ok_self and not others
            print(
                f"  第 {n_q} 题  {stem_start:.2f} – {p_start:.2f}  "
                f"{'OK' if verified else '校验不过'}"
            )
            questions.append(
                {
                    "n": n_q,
                    "startSec": round(stem_start, 2),
                    "endSec": round(p_start, 2),
                    "verified": verified,
                    "asr": text.strip()[:200],
                }
            )

        out_units.append({"unitId": unit_id, "questions": questions})
        save()

    save()

    total = sum(len(u["questions"]) for u in out_units)
    passed = sum(1 for u in out_units for q in u["questions"] if q["verified"])
    print(f"\n{total} 道题的题干区间，{passed} 道通过校验")


if __name__ == "__main__":
    main()
