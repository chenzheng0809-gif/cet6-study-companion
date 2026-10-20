#!/usr/bin/env python3
"""
按已检测出的答题停顿把听力音频切成「一段单元」一个文件。

切分点来自 scripts/analyze-2024-06-audio.py 的停顿检测结果：
每一段单元 = 原文 → 题号播报 → 各题题干 → 答题停顿，
所以切点落在「上一段最后一个停顿的结束」和「本段第一个停顿的开始」。

用法：
    python3 scripts/slice-listening.py <wav> <timing.json> <outdir> [起始秒]
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

# 每段单元的题数（与卷面 "Questions N to M" 一致）
UNIT_QUESTION_COUNTS = [4, 4, 3, 4, 3, 3, 4]


def slice_wav(src: str, dst: str, start: float, end: float) -> None:
    with wave.open(src, "rb") as w:
        params = w.getparams()
        sr = params.framerate
        w.setpos(int(start * sr))
        frames = w.readframes(int((end - start) * sr))
    with wave.open(dst, "wb") as out:
        out.setparams(params)
        out.writeframes(frames)


def main() -> None:
    wav, timing_json, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(outdir, exist_ok=True)

    timing = json.load(open(timing_json))
    pauses = timing["pauses"]

    # 按卷面的每段题数把停顿分组
    groups = []
    idx = 0
    for count in UNIT_QUESTION_COUNTS:
        groups.append(pauses[idx : idx + count])
        idx += count
    if idx != len(pauses):
        raise SystemExit(f"停顿数 {len(pauses)} 与卷面题数 {idx} 不符")

    # 每段的边界：start = 上一段最后一个停顿的结束（第一段从 0 开始）
    #               end   = 本段最后一个停顿的结束
    starts = [0.0]
    for g in groups[:-1]:
        starts.append(g[-1]["endSec"])

    for i, g in enumerate(groups):
        end = g[-1]["endSec"]
        raw = os.path.join(outdir, f"unit{i + 1}-raw.wav")
        slice_wav(wav, raw, starts[i], end)
        # 转成 16k 单声道再上传：转写只要人声，体积小一个数量级
        light = os.path.join(outdir, f"unit{i + 1}.wav")
        subprocess.run(
            ["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", raw, light],
            check=True,
        )
        os.remove(raw)
        print(
            f"unit{i + 1}: {starts[i]:.2f} -> {end:.2f} "
            f"({end - starts[i]:.1f}s, {os.path.getsize(light) // 1024}KB)"
        )


if __name__ == "__main__":
    main()
