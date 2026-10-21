#!/usr/bin/env python3
"""
剥掉 MP3 文件头里的 ID3v2 标签 —— 只剥标签，不重编音频。

为什么需要这个：
  2024-06 两套听力的原始录音，文件头带一段 ID3v2 标签，
  里面的 TPE1/TPE2 用 ISO-8859-1 声明编码，实际塞的是 GBK 字节。
  macOS 的解码器能猜出来，Chrome 收到媒体请求直接 ERR_ABORTED 放弃播放 ——
  同一段音频在两个浏览器上一个能播一个不能。

为什么不重编：
  重编等于在学生自己的原始录音上再叠一层有损编码，音质就变了，
  录音里的时间点也不再是原件的。剥掉标签就够：
  剥完解出来的 PCM 与原始录音逐字节相同，音频一帧没动。

用法：
    python3 scripts/strip-id3.py <in.mp3> <out.mp3>
"""
import sys


def id3v2_size(path: str) -> int:
    """返回 ID3v2 标签的总长度（含 10 字节头）；没有标签返回 0。"""
    with open(path, "rb") as fh:
        header = fh.read(10)
        if len(header) < 10 or header[:3] != b"ID3":
            return 0
        # 大小用 4 个 syncsafe 字节存，每字节只用了 7 位
        size = 0
        for byte in header[6:10]:
            size = (size << 7) | (byte & 0x7F)
        # 标签后面可能还有 128 字节的扩展头
        flags = header[5]
        if flags & 0x10:
            ext = fh.read(4)
            if len(ext) == 4:
                ext_size = 0
                for byte in ext:
                    ext_size = (ext_size << 7) | (byte & 0x7F)
                size += ext_size
        return 10 + size


def strip(src: str, dst: str) -> int:
    size = id3v2_size(src)
    with open(src, "rb") as fin, open(dst, "wb") as fout:
        if size:
            fin.seek(size)
        while True:
            chunk = fin.read(1 << 20)
            if not chunk:
                break
            fout.write(chunk)
    return size


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(1)
    src, dst = sys.argv[1], sys.argv[2]
    size = strip(src, dst)
    print(f"{src} → {dst}：剥掉 {size} 字节的 ID3v2 标签，音频帧一帧没改")


if __name__ == "__main__":
    main()
