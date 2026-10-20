#!/usr/bin/env python3
"""
从 2024-06 真题 PDF 抽文本，保留段落空行。

pdfplumber 的 extract_text() 会把行与行之间的空行吃掉，而这份卷面的段落分界
恰恰靠空行标记（Directions 结束、原文开始、原文结束、词库开始）。
所以这里改成自己按字符坐标聚行：空行就是段落分界。

用法：
    python3 scripts/extract-2024-06-pdf.py <pdf> <out.txt>
"""
import re
import sys

import pdfplumber


def page_lines(page) -> list[str]:
    """把一页拆成行，保留空行。"""
    buckets: dict[int, list] = {}
    for c in page.chars:
        buckets.setdefault(round(c["top"]), []).append(c)
    out: list[str] = []
    for top in sorted(buckets):
        chars = sorted(buckets[top], key=lambda c: c["x0"])
        out.append("".join(c["text"] for c in chars))
    return out


def clean(lines: list[str]) -> list[str]:
    """行内空白归一；页码行单独处理。"""
    out = []
    for line in lines:
        line = re.sub(r"[ \t]+", " ", line).rstrip()
        out.append(line)
    return out


def main() -> None:
    src, dst = sys.argv[1], sys.argv[2]
    with pdfplumber.open(src) as pdf:
        chunks = []
        for i, page in enumerate(pdf.pages, 1):
            chunks.append(f"\n\n========== PAGE {i} ==========\n")
            chunks.append("\n".join(clean(page_lines(page))))
    with open(dst, "w") as fh:
        fh.write("".join(chunks))
    print(f"{dst}: {len(chunks) // 2} pages")


if __name__ == "__main__":
    main()
