"""从真题 PDF 生成「卷面快照」。

真题 PDF 是唯一事实来源，但它不在仓库里（体积大 + 有版权），
所以把卷面上该卷的**题干与选项原文**抽成一份快照存进仓库，
让 scripts/verify-papers.ts 每次都拿 App 数据跟它对一遍。

这道闸门挡住的是哪一种回归：
选项被「顺手改写」成读起来更顺的英文 —— 语义没错，但学生看到的
不是卷面上的那句话，做题时对不上原文（2025-12 Q16 的 B 就是这么坏的：
把卷面的 "Airlines cannot find its owner without an ID tag on it."
改写成了 "The bag lacks an identity tag, and the airline cannot find its owner."）。

用法：
  python3 scripts/build-paper-manifest.py <paperId> <真题PDF路径> [输出路径]

输出里带源 PDF 的 sha256 —— 换一份 PDF 就得重新生成快照。
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from compare_paper_pdf import parse_blocks  # noqa: E402

import pdfplumber  # noqa: E402

OUT_DIR = Path(__file__).resolve().parents[1] / "src" / "lib" / "papers" / "manifests"

"""
真题 PDF 的文字层是 OCR 产物，有错字。卷面**印刷**原文才是对的，
所以下面这张表把 PDF 文字层认错的地方改回印刷原文。
每条都记了「PDF 认成了什么」和「卷面印的是什么」。

源 PDF 一换，这些 `pdf` 值就对不上了 —— 脚本会直接报错，
逼着人重新核对，而不是默默放过一个新的错误。
"""
OCR_FIXES: dict[str, dict[str, str]] = {
    "1.A": {
        "pdf": "He has distinguished himself in foreigns ervice.",
        "text": "He has distinguished himself in foreign service.",
        "reason": "PDF 文字层在 foreign service 中间多断了一次",
    },
    "1.B": {
        "pdf": "He is his.country's ambassador to Winopia.",
        "text": "He is his country's ambassador to Winopia.",
        "reason": "PDF 文字层把撇号认成了点号",
    },
    "3.B": {
        "pdf": "It is a prerequisite to get Some practice in diplomacy.",
        "text": "It is a prerequisite to get some practice in diplomacy.",
        "reason": "句中小写 some 被 PDF 文字层认成了大写",
    },
    "6.A": {
        "pdf": "The board members! insufficient support.",
        "text": "The board members' insufficient support.",
        "reason": "PDF 文字层把撇号认成了感叹号",
    },
    "15.A": {
        "pdf": "People's intense fbcus on convenience.",
        "text": "People's intense focus on convenience.",
        "reason": "PDF 文字层 OCR 错字：fbcus → focus",
    },
    "16.D": {
        "pdf": "Its owner has forgot to pick it up from the baggage claim.",
        "text": "Its owner has forgotten to pick it up from the baggage claim.",
        "reason": "PDF 文字层 OCR 漏字母：forgot → forgotten",
    },
    "17.A": {
        "pdf": "Its tag may get tom off on the conveyor belt.",
        "text": "Its tag may get torn off on the conveyor belt.",
        "reason": "PDF 文字层 OCR 错字：tom → torn",
    },
    "18.C": {
        "pdf": "Get the airline agenfs phone number before boarding.",
        "text": "Get the airline agent's phone number before boarding.",
        "reason": "PDF 文字层 OCR 错字：agenfs → agent's",
    },
    "25.D": {
        "pdf": "Opportunities fbr income.",
        "text": "Opportunities for income.",
        "reason": "PDF 文字层把 fi 连字拆成了 fbr",
    },
    "51.B": {
        "pdf": "It has been the fbcus of many vital conversations.",
        "text": "It has been the focus of many vital conversations.",
        "reason": "PDF 文字层 OCR 错字：fbcus → focus",
    },
}


def main() -> int:
    paper_id = sys.argv[1]
    pdf_path = sys.argv[2]
    out_path = Path(sys.argv[3]) if len(sys.argv) > 3 else OUT_DIR / f"{paper_id}.json"

    raw = Path(pdf_path).read_bytes()
    sha = hashlib.sha256(raw).hexdigest()

    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join((pg.extract_text() or "") for pg in pdf.pages)

    blocks = parse_blocks(text)
    # 快照只留卷面上真的印着选项的题（听力 1-25、仔细阅读 46-55 之类）
    options: dict[str, dict[str, str]] = {}
    pdf_raw: dict[str, dict[str, str]] = {}
    for n, opts in blocks.items():
        picked = {k: v.strip().rstrip(",") for k, v in opts.items() if k in "ABCD"}
        if len(picked) == 4:
            options[str(n)] = picked
            pdf_raw[str(n)] = dict(picked)

    # 把 PDF 文字层的 OCR 错字改回印刷原文
    fixes_used: list[dict[str, str]] = []
    for key, fix in OCR_FIXES.items():
        n, letter = key.split(".")
        seen = pdf_raw.get(n, {}).get(letter)
        if seen is None:
            raise SystemExit(
                f"PDF 里找不到 {key}（现在是 {seen!r}）。源 PDF 变了，OCR 修正表要重新核对。"
            )
        if seen != fix["pdf"]:
            raise SystemExit(
                f"{key} 的 PDF 文字层现在是 {seen!r}，修正表里记的是 {fix['pdf']!r}。"
                "源 PDF 变了，OCR 修正表要重新核对。"
            )
        options[n][letter] = fix["text"]
        fixes_used.append(
            {"key": key, "pdf": fix["pdf"], "text": fix["text"], "reason": fix["reason"]}
        )

    manifest = {
        "paperId": paper_id,
        "source": {
            "file": Path(pdf_path).name,
            "sha256": sha,
            "note": "卷面原文快照。改了源 PDF 就得重新生成，否则闸门会一直报差异。",
        },
        "ocrFixes": fixes_used,
        "options": options,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"写了 {out_path}（{len(options)} 道题的卷面选项）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
