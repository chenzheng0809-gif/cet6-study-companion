"""真题 PDF ↔ App 数据 比对（抗 OCR 噪声）。

真题 PDF 的文字层本身是 OCR 过的，带噪声（fbcus / fbr / agenfs / tom），
逐字 diff 全是假差异。这里只抓**要紧的**那一类缺陷：

    app 的选项 A，到底对应 PDF 上的 A 吗？

按题号切块后逐字母做模糊对齐（difflib），如果 app 的 A 跟 PDF 的 B 更像，
那就是选项跟字母真对错位了 —— 学生在 App 里选 B，卷面上却是另一个意思。
其余字符级差异一律当作 OCR 噪声放过。

用法：python3 scripts/compare-paper-pdf.py <paperId> <paper.txt>
"""
from __future__ import annotations

import json
import re
import sys
from difflib import SequenceMatcher

# 题号行：1. / 26. / 55. —— 后面必须跟着内容
Q_HEAD = re.compile(r"^(\d{1,2})\s*[.、]\s*(.*)$")
# 选项：字母 + 右括号 + 空格 + 真正的文字（排除 "marked A), B), C)" 这种）
# 必须开 MULTILINE，否则 $ 只匹配整块末尾，行尾的 D 选项会整个丢掉
OPT = re.compile(
    r"(?:^|\s)([ABCD])\)\s+([A-Za-z][^\n]*?)(?=\s+[ABCD]\)\s+[A-Za-z]|$)",
    re.MULTILINE,
)
# 章节切换标记：碰到就断块
BREAK = re.compile(
    r"^(Part\s|Section\s|Directions|Word\s|Bank\b|Questions\s+\d+\s+to|大学英语六级|"
    r"Answer\s+Sheet|[A-O]\)\s+.*bank)",
    re.IGNORECASE,
)


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (s or "").lower())


def sim(a: str, b: str) -> float:
    na, nb = norm(a), norm(b)
    if not na or not nb:
        return 0.0
    return SequenceMatcher(None, na, nb).ratio()


def parse_blocks(text: str) -> dict[int, dict[str, str]]:
    """切出 {题号: {A/B/C/D: 选项文本}}。"""
    lines = [l.rstrip() for l in text.splitlines()]
    heads: list[tuple[int, int]] = []  # (行号, 题号)
    for i, line in enumerate(lines):
        s = line.strip()
        if BREAK.match(s):
            continue
        m = Q_HEAD.match(s)
        if m and int(m.group(1)) <= 60:
            heads.append((i, int(m.group(1))))

    out: dict[int, dict[str, str]] = {}
    for idx, (start, qn) in enumerate(heads):
        end = heads[idx + 1][0] if idx + 1 < len(heads) else len(lines)
        chunk_lines: list[str] = []
        for l in lines[start:end]:
            s = l.strip()
            if BREAK.match(s):
                break
            chunk_lines.append(s)
        chunk = "\n".join(chunk_lines)
        opts: dict[str, str] = {}
        for k, v in OPT.findall(chunk):
            opts[k] = v.strip().rstrip(",")
        if opts:
            out[qn] = opts
    return out


def main() -> int:
    paper_id = sys.argv[1]
    pdf_txt_path = sys.argv[2]
    app = json.load(open(f".tmp/import/app-{paper_id}.json", encoding="utf-8"))
    text = open(pdf_txt_path, encoding="utf-8").read()

    pdfq = parse_blocks(text)

    problems: list[str] = []
    checked = 0
    for q in app["questions"]:
        n = q["n"]
        opts = {o["key"]: o["en"] for o in (q.get("options") or [])}
        if not opts:
            continue
        p = pdfq.get(n)
        if not p:
            problems.append(f"Q{n} 真题 PDF 里没抽出选项")
            continue
        for k, txt in opts.items():
            cand = p.get(k)
            if cand is None:
                problems.append(f"Q{n} 选项 {k} 在 PDF 里没找到")
                continue
            checked += 1
            s = sim(txt, cand)
            if s >= 0.86:
                continue
            best_other = max(
                ((kk, sim(txt, vv)) for kk, vv in p.items() if kk != k),
                key=lambda x: x[1],
                default=("", 0.0),
            )
            tag = "【疑似错位】" if best_other[1] > s + 0.05 else ""
            problems.append(
                f"Q{n} 选项 {k} 相似度 {s:.2f}{tag}\n"
                f"    app : {txt}\n"
                f"    pdf{k}: {cand}"
                + (f"\n    更像 pdf{best_other[0]} ({best_other[1]:.2f})" if best_other[0] else "")
            )

    print(f"比对了 {checked} 个选项")
    if problems:
        print(f"\n{len(problems)} 处要人工看：")
        for p in problems:
            print(" -", p)
    else:
        print("全部对得上")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
