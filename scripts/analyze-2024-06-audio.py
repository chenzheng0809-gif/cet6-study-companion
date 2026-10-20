#!/usr/bin/env python3
"""
2024-06 真题听力音频的单元边界分析。

沿用 2025-12-set1 的做法：六级听力每题后有约 13.5 秒的答题停顿，
这些停顿的起点/终点就是单元边界。脚本只做真实能量分析，不写死任何数值。

用法：
    python3 scripts/analyze-2024-06-audio.py <mp3> <out.json>
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

# 参数与 2025-12 的分析保持一致，可在命令行覆盖
HOP = 0.02          # 帧移 20ms
THRESHOLD_DB = -46  # 静音阈值 dBFS
MERGE_GAP = 0.3     # 小于 0.3s 的间隙合并
PAUSE_MIN = 12.0    # 答题停顿下限
PAUSE_MAX = 16.0    # 答题停顿上限


def to_wav(mp3: str, wav: str) -> None:
    subprocess.run(
        ["afconvert", "-f", "WAVE", "-d", "LEI16@44100", mp3, wav],
        check=True,
    )


def frames(wav_path: str):
    with wave.open(wav_path, "rb") as w:
        n = w.getnframes()
        sr = w.getframerate()
        ch = w.getnchannels()
        raw = w.readframes(n)
    data = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    if ch > 1:
        data = data.reshape(-1, ch).mean(axis=1)
    data /= 32768.0
    hop = int(sr * HOP)
    count = len(data) // hop
    trimmed = data[: count * hop].reshape(count, hop)
    rms = np.sqrt((trimmed ** 2).mean(axis=1) + 1e-12)
    return rms, sr, len(data) / sr


def main() -> None:
    mp3 = sys.argv[1]
    out = sys.argv[2]
    wav = mp3.rsplit(".", 1)[0] + ".wav"
    if not os.path.exists(wav):
        to_wav(mp3, wav)

    rms, sr, duration = frames(wav)
    db = 20 * np.log10(rms)
    voiced = db > THRESHOLD_DB

    # 语音区间：连续 voiced 段，间隙小于 MERGE_GAP 的合并
    speech = []
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
                if (k - j) * HOP <= MERGE_GAP:
                    j = k
                else:
                    break
            speech.append((i * HOP, j * HOP))
            i = j
        else:
            i += 1

    # 静音区间 = 相邻语音段之间的空档
    silences = []
    for a, b in zip(speech, speech[1:]):
        silences.append((a[1], b[0]))

    pauses = [
        {"startSec": round(s, 2), "endSec": round(e, 2), "durSec": round(e - s, 2)}
        for s, e in silences
        if PAUSE_MIN <= (e - s) <= PAUSE_MAX
    ]

    result = {
        "mp3": os.path.basename(mp3),
        "durationSec": round(duration, 2),
        "sampleRate": sr,
        "thresholdDb": THRESHOLD_DB,
        "speechSegments": [[round(a, 2), round(b, 2)] for a, b in speech],
        "pauses": pauses,
        "pauseCount": len(pauses),
        "speechRatio": round(
            sum(b - a for a, b in speech) / duration, 4
        ),
    }
    with open(out, "w") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)

    print(f"{os.path.basename(mp3)}  时长 {duration:.1f}s")
    print(f"  语音段 {len(speech)}  答题停顿 {len(pauses)} 个")
    print(f"  语音占比 {result['speechRatio']:.1%}")
    for p in pauses:
        print(
            f"    {p['startSec']:8.2f} -> {p['endSec']:8.2f}  ({p['durSec']:.2f}s)"
        )


if __name__ == "__main__":
    main()
