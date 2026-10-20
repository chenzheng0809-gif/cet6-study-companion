#!/usr/bin/env python3
"""
把切片流水线产出的整卷 WAV 编成浏览器能播的 MP3。

为什么不用 afconvert：这台机器上 `afconvert -f MPG3 -d .mp3` 直接报
ExtAudioFileSetProperty ('cfmt') failed ('fmt?')，编不出 MP3。
改用 lameenc（libmp3lame 的 Python 绑定），直接按 LAME 的参数编。

为什么必须重编：2024-06 的原始录音是 32 kHz / 96 kbps 的 MPEG-1 Layer III，
Chrome 播不动（同一页面换成 2025-12 那份 44.1 kHz / 192 kbps 的就正常）。
2024-06 的 WAV 本身是好的（afconvert 从原 MP3 解出来，macOS 能整段解码），
所以问题出在 MP3 这层的采样率/码率组合上。

用法：
    python3 scripts/encode-listening-mp3.py <in.wav> <out.mp3> [--rate 44100] [--br 128]
"""
import argparse
import sys
import wave

import numpy as np

sys.path.insert(0, "/tmp/pylibs")
import lameenc  # noqa: E402


def read_wav(path: str) -> tuple[np.ndarray, int, int]:
    with wave.open(path, "rb") as w:
        params = w.getparams()
        if params.nchannels != 2 or params.sampwidth != 2:
            raise SystemExit(f"只处理 16bit 双声道 WAV：{path} -> {params}")
        frames = w.readframes(params.nframes)
    pcm = np.frombuffer(frames, dtype="<i2")
    return pcm.reshape(-1, 2), params.framerate, params.nframes


def resample(pcm: np.ndarray, src_rate: int, dst_rate: int) -> np.ndarray:
    """线性重采样 —— 只用于对照实验，音质不是重点。"""
    if src_rate == dst_rate:
        return pcm
    n_src = pcm.shape[0]
    n_dst = int(round(n_src * dst_rate / src_rate))
    idx = np.linspace(0, n_src - 1, n_dst)
    left = np.interp(idx, np.arange(n_src), pcm[:, 0])
    right = np.interp(idx, np.arange(n_src), pcm[:, 1])
    return np.stack([left, right], axis=1).astype("<i2")


def encode(pcm: np.ndarray, rate: int, bitrate: int, out_path: str) -> None:
    enc = lameenc.Encoder()
    enc.set_bit_rate(bitrate)
    enc.set_in_sample_rate(rate)
    enc.set_channels(2)
    enc.set_quality(2)  # 2 = high quality, 0 = best

    chunk = rate * 10  # 一次编 10 秒，别把整卷塞进内存
    out = bytearray()
    for start in range(0, pcm.shape[0], chunk):
        block = pcm[start : start + chunk]
        out += enc.encode(block.tobytes())
    out += enc.flush()

    with open(out_path, "wb") as f:
        f.write(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--rate", type=int, default=44100)
    ap.add_argument("--br", type=int, default=128)
    args = ap.parse_args()

    pcm, rate, nframes = read_wav(args.src)
    dur = nframes / rate
    print(f"{args.src}: {rate} Hz / {dur:.2f}s")
    if args.rate != rate:
        pcm = resample(pcm, rate, args.rate)
        print(f"  重采样到 {args.rate} Hz")
    encode(pcm, args.rate, args.br, args.dst)
    print(f"  -> {args.dst} ({args.rate} Hz / {args.br} kbps)")


if __name__ == "__main__":
    main()
