#!/usr/bin/env python3
"""抽出两册 PDF 里的黄色高亮，输出 {page, x0, x1, top, bottom, text}。

PDF 里高亮不是文本属性，是 /Highlight 注解（颜色 1 1 0）用 /QuadPoints
标出一块矩形区域。要拿到「哪些文字被高亮」，只能把矩形坐标和文字层
的字符包围盒对齐 —— pdfplumber 给字符级 bbox，pypdf 给注解坐标。

单独跑一次，产物给 parse-wordbooks.py 用：
    python3 scripts/extract-highlights.py
"""
from __future__ import annotations

import json
import pathlib
import sys

import pdfplumber
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parent.parent
UPLOADS = ROOT / ".cache" / "uploads"
OUT = ROOT / ".cache" / "uploads" / "highlights.json"

YELLOW = (1.0, 1.0, 0.0)
# Word 画的矩形两侧会留一点余量，用包含关系筛字符；按「中心点落在框内」筛
# 会把前一个单词的尾巴吃进来（`institutiona` 的 l 混进 `innovation`）。
PAD = 1.2
# 上下同理：正文行高约 18pt，字符高约 12pt，框比字符高一点属正常。
VPAD = 2.0


def quads_of(annot) -> list[tuple[float, float, float, float]]:
    """QuadPoints -> 一组 (x0, y0, x1, y1)，y 是 PDF 自下向上的坐标。"""
    q = annot.get("/QuadPoints")
    if not q:
        return []
    q = [float(v) for v in q]
    out = []
    for i in range(0, len(q) - 7, 8):
        b = q[i : i + 8]
        xs = (b[0], b[2], b[4], b[6])
        ys = (b[1], b[3], b[5], b[7])
        out.append((min(xs), min(ys), max(xs), max(ys)))
    return out


def chars_in(page, rect):
    """被这个矩形罩住的字符，按行内从左到右排好。

    只收「基本整个落在框里」的字符 —— 半个字、跨行的都不要。
    """
    top = page.height - rect[3]
    bottom = page.height - rect[1]
    picked = []
    for ch in page.chars:
        if ch["x0"] < rect[0] - PAD or ch["x1"] > rect[2] + PAD:
            continue
        if ch["top"] < top - VPAD or ch["bottom"] > bottom + VPAD:
            continue
        picked.append(ch)
    picked.sort(key=lambda c: (round(c["top"] / 2.0), c["x0"]))
    return picked


def run_text(name: str) -> list[dict]:
    pdf = pdfplumber.open(UPLOADS / f"{name}.pdf")
    reader = PdfReader(UPLOADS / f"{name}.pdf")
    out: list[dict] = []
    for pi, page in enumerate(pdf.pages):
        for ref in reader.pages[pi].get("/Annots") or []:
            annot = ref.get_object()
            if str(annot.get("/Subtype")) != "/Highlight":
                continue
            color = tuple(round(float(v), 2) for v in (annot.get("/C") or []))
            if color != YELLOW:
                continue
            for rect in quads_of(annot):
                chars = chars_in(page, rect)
                text = "".join(c["text"] for c in chars).strip()
                if not text:
                    continue
                out.append(
                    {
                        "page": pi + 1,
                        "x0": round(rect[0], 1),
                        "x1": round(rect[2], 1),
                        "top": round(page.height - rect[3], 1),
                        "bottom": round(page.height - rect[1], 1),
                        "text": text,
                    }
                )
    pdf.close()
    return out


def main() -> int:
    result = {}
    for name in ("vocab-upper", "vocab-lower"):
        runs = run_text(name)
        result[name] = runs
        print(f"{name}: {len(runs)} 处黄色高亮")
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"-> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
