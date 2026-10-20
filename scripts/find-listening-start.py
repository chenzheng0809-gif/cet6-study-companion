#!/usr/bin/env python3
"""
找出第一段听力里「Section A 的 Directions 读完、对话正式开始」的时间点。

为什么要找这个点：
  2025.12 那套的单元窗口是从对话开始的（35.66s），Directions 不算进任何一段。
  2024.06 这两套如果把开头 50 多秒的 Directions 也算进第一段，学生一按播放
  先听到一整段念 Directions。这个边界得实测，不能猜。

做法是二分法 + 累计转写：
  取 [0, t] 这一整段去转写，看对话的第一句（marker）有没有出现。
  出现了说明 t 已经越过边界，没出现说明还在念 Directions。
  二分到 0.5 秒 —— 用累计区间而不是滑动小窗口，不会漏掉只有一瞬间的标记。

用法：
    python3 scripts/find-listening-start.py <wav> <marker> <out.json>
"""
import json
import os
import subprocess
import sys
import wave

TOOL = "connector__matrix__listen_audio"


def slice_wav(src: str, dst: str, start: float, end: float) -> None:
    with wave.open(src, "rb") as w:
        params = w.getparams()
        sr = params.framerate
        w.setpos(int(start * sr))
        frames = w.readframes(int((end - start) * sr))
    with wave.open(dst, "wb") as out:
        out.setparams(params)
        out.writeframes(frames)


def transcribe(path: str) -> str:
    url = json.loads(
        subprocess.run(
            ["mcode-tools", "upload_temp_url", path], capture_output=True, text=True
        ).stdout
    )["temp_url"]
    args_path = path + ".args.json"
    with open(args_path, "w") as fh:
        json.dump({"audio_info": {"url": url, "mime_type": "audio/wav"}}, fh)
    for _ in range(4):
        proc = subprocess.run(
            ["mcode-tools", "connector", "call", TOOL, "--args-file", args_path],
            capture_output=True,
            text=True,
        )
        if proc.returncode == 0:
            out = proc.stdout
            os.remove(args_path)
            return json.loads(out).get("transcription", "")
    os.remove(args_path)
    return ""


def main() -> None:
    wav, marker, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    tmp = "/tmp/cet6-2024-06/audio/_probe.wav"
    small = tmp + ".16.wav"
    needle = marker.lower()

    def reached(t: float) -> bool:
        """转写 [0, t]，看对话第一句出现了没有。"""
        slice_wav(wav, tmp, 0, t)
        subprocess.run(
            ["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1", tmp, small],
            check=True,
        )
        return needle in transcribe(small).lower()

    hi = float(sys.argv[4]) if len(sys.argv) > 4 else 170.0
    if not reached(hi):
        raise SystemExit(f"{hi}s 内没找到 {marker!r}")
    lo = 0.0
    while hi - lo > 0.5:
        mid = (lo + hi) / 2
        if reached(mid):
            hi = mid
        else:
            lo = mid
    start = round(hi, 1)
    print(f"对话开始 ≈ {start}s（区间 {lo:.1f}–{hi:.1f}）")
    with open(out_path, "w") as fh:
        json.dump({"marker": marker, "startSec": start}, fh, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
