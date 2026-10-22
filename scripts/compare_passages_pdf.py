"""真题 PDF ↔ App 阅读原文 / 词库 / 写作翻译 逐段比对。

PDF 文字层是 OCR 产物，会有 fbcus / fbr / agenfs 这类噪声，
所以按**词**比：App 的词只要能在 PDF 词表里找到 85% 相似度的词就算命中。
一段文字的覆盖率低于 95% 才报出来人工看。
"""
from __future__ import annotations

import json
import re
import sys
from difflib import SequenceMatcher

WORD = re.compile(r"[a-z0-9]+(?:'[a-z]+)?")


def toks(s: str) -> list[str]:
    return WORD.findall((s or "").lower())


def build_index(pdf_tokens: list[str]) -> dict[str, list[str]]:
    idx: dict[str, list[str]] = {}
    for t in set(pdf_tokens):
        idx.setdefault(t[0], []).append(t)
    return idx


def covered(text: str, idx: dict[str, list[str]]) -> tuple[float, list[str]]:
    bad: list[str] = []
    hit = 0
    for t in toks(text):
        cands = idx.get(t[0], [])
        ok = False
        for c in cands:
            if c == t or abs(len(c) - len(t)) <= 2 and SequenceMatcher(None, c, t).ratio() >= 0.85:
                ok = True
                break
        if ok:
            hit += 1
        else:
            bad.append(t)
    total = len(toks(text))
    return (hit / total if total else 1.0), bad


def main() -> int:
    paper_id = sys.argv[1]
    pdf_txt_path = sys.argv[2]
    app = json.load(open(f".tmp/import/app-{paper_id}.json", encoding="utf-8"))
    pdf = open(pdf_txt_path, encoding="utf-8").read()
    idx = build_index(toks(pdf))

    problems: list[str] = []
    total = 0

    def check(label: str, text: str) -> None:
        nonlocal total
        total += 1
        rate, bad = covered(text, idx)
        if rate < 0.95:
            problems.append(f"{label} 覆盖率 {rate:.1%}，缺：{' '.join(bad[:14])}")

    # 阅读原文
    for sec in app["readingSections"]:
        for i, p in enumerate(sec.get("paragraphs") or []):
            label = p.get("label") or f"{sec['id']}#{i}"
            check(f"{sec['id']} 段落 {label}", p["en"])

    # 选词填空的词库
    for sec in app["readingSections"]:
        for o in sec.get("options") or []:
            check(f"{sec['id']} 词库 {o['key']}", o["en"])

    # 写作题干 / 翻译原文
    check("写作题干", app["writing"]["prompt"])
    check("翻译原文", app["translation"]["zh"])

    print(f"比对了 {total} 段")
    if problems:
        print(f"\n{len(problems)} 段要人工看：")
        for p in problems:
            print(" -", p)
    else:
        print("全部落在 PDF 上")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
