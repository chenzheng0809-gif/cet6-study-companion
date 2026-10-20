#!/usr/bin/env python3
"""
把 2024-06「答案速查」PDF 解析成结构化 JSON。

答案速查的内容：
  - 写作参考范文
  - 听力答案 1–25
  - 阅读答案 26–55
  - 翻译参考译文

答案表在 PDF 里是「一��题号 + 一行字母」两张表，排成上下两组。
解析方式：找到一行全是题号，紧接着的一行全是字母，就配成一段。

用法：
    python3 scripts/parse-2024-06-keys.py /tmp/cet6-2024-06
"""
import json
import os
import re
import sys

PAGE_SEP = re.compile(r"^=+ PAGE \d+ =+$", re.M)


def load_lines(setno: int) -> list[str]:
    path = f"/tmp/cet6-2024-06/key-set{setno}.txt"
    with open(path) as fh:
        raw = fh.read()
    raw = PAGE_SEP.sub("", raw)
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in raw.split("\n")]
    return [l for l in lines if l and not re.fullmatch(r"\d{1,3}", l)]


def decode_run(s: str, start: int) -> list[int] | None:
    """
    把连写的题号串拆成连续整数。

    第 2 套的答案速查里题号是连写的（"12345678910111213"），
    靠「必须是 start, start+1, ... 的连续序列」来唯一切分。
    """
    out: list[int] = []

    def rec(pos: int, cur: int) -> bool:
        if pos == len(s):
            return True
        for w in (1, 2, 3):
            cand = s[pos : pos + w]
            if not cand.isdigit():
                break
            if int(cand) != cur:
                continue
            out.append(cur)
            if rec(pos + w, cur + 1):
                return True
            out.pop()
        return False

    return out if rec(0, start) else None


def parse_answers(lines: list[str]) -> dict[int, str]:
    """
    题号行 + 字母行 成对出现，配成题号→答案。

    题号可能有空格（"1 2 3 ..."）也可能连写（"12345678910111213"），
    两种都按「连续题号序列」解。
    """
    answers: dict[int, str] = {}
    i = 0
    while i < len(lines) - 1:
        nums_raw = lines[i].split()
        letters_raw = lines[i + 1].split()
        if not nums_raw or not letters_raw:
            i += 1
            continue
        joined_letters = "".join(letters_raw)
        if not re.fullmatch(r"[A-O]+", joined_letters):
            i += 1
            continue

        if all(re.fullmatch(r"\d{1,2}", x) for x in nums_raw):
            nums: list[int] | None = [int(x) for x in nums_raw]
        else:
            joined = "".join(nums_raw)
            nums = None
            for start in range(1, 56):
                cand = decode_run(joined, start)
                if cand:
                    nums = cand
                    break

        if nums and len(nums) == len(joined_letters):
            for n, a in zip(nums, joined_letters):
                answers[n] = a
            i += 2
            continue
        i += 1
    return answers


def slice_between(lines: list[str], start_pat: str, end_pat: str) -> list[str]:
    s = next(i for i, l in enumerate(lines) if re.search(start_pat, l))
    e = next((i for i, l in enumerate(lines) if i > s and re.search(end_pat, l)), len(lines))
    return lines[s + 1 : e]


def main() -> None:
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "/tmp/cet6-2024-06/parsed"
    os.makedirs(out_dir, exist_ok=True)
    for setno in (1, 2, 3):
        lines = load_lines(setno)
        answers = parse_answers(lines)

        # 写作范文：从「参考范文：」到「Part Ⅱ/ⅡListening」之前
        essay_lines = slice_between(lines, r"参考范文", r"Listening Comprehension")
        essay = re.sub(r"\s+", " ", " ".join(essay_lines)).strip()

        # 翻译参考译文：从「参考译文：」到文末
        trans_lines = slice_between(lines, r"参考译文", r"^\s*$")
        reference = re.sub(r"\s+", " ", " ".join(trans_lines)).strip()

        data = {"set": setno, "answers": answers, "essay": essay, "reference": reference}
        with open(os.path.join(out_dir, f"key-set{setno}.json"), "w") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
        print(
            f"set{setno}: 答案 {len(answers)} 题 ({min(answers)}–{max(answers)}) · "
            f"范文 {len(essay)} 字符 · 参考译文 {len(reference)} 字符"
        )


if __name__ == "__main__":
    main()
