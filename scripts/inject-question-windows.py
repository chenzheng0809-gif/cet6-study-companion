#!/usr/bin/env python3
"""
把实测出来的「逐题题干区间」写进听力数据文件。

来源只能是 scripts/measure-question-windows.py 的输出 —— 那是从真实录音里
量出来的（静音边界 + 逐段转写定位 + 逐题校验），不是估的。

只接受 verified 的题：念不出本题题号、或者念出了别的题号的区间不入库。
"""
import argparse
import json
import re
import sys


def ts_block(windows: list[dict], indent: str = "    ") -> str:
    lines = [f"{indent}questionWindows: ["]
    for w in windows:
        lines.append(
            f"{indent}  {{ n: {w['n']}, startSec: {w['startSec']}, endSec: {w['endSec']} }},"
        )
    lines.append(f"{indent}],")
    return "\n".join(lines)


def insert_after_stems(text: str, unit_id: str, block: str) -> str:
    """在指定单元的 stemsWindow 块后面插入。"""
    unit_re = re.compile(rf'(id: "{re.escape(unit_id)}",)')
    m = unit_re.search(text)
    if not m:
        raise SystemExit(f"找不到单元 {unit_id}")

    sw = text.find("stemsWindow: {", m.end())
    if sw == -1:
        raise SystemExit(f"{unit_id} 没有 stemsWindow 块")

    # 找 stemsWindow 块自己的结束位置（花括号配平）
    depth = 0
    i = text.index("{", sw)
    j = i
    while True:
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                break
        j += 1
    # 块后面跟着逗号，插在逗号之后 —— 后面的换行和缩进原样留着
    k = j + 1
    if k < len(text) and text[k] == ",":
        k += 1
    return text[:k] + "\n" + block + text[k:]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("measured")
    ap.add_argument("tsfile")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    with open(args.measured) as fh:
        measured = json.load(fh)

    with open(args.tsfile) as fh:
        text = fh.read()

    if "questionWindows" in text:
        print("文件里已经有 questionWindows，先撤销再注入", file=sys.stderr)
        raise SystemExit(1)

    for unit in measured["units"]:
        windows = [q for q in unit["questions"] if q.get("verified")]
        if not windows:
            print(f"  {unit['unitId']} 没有通过校验的题，跳过")
            continue
        text = insert_after_stems(text, unit["unitId"], ts_block(windows))
        print(f"  {unit['unitId']} 写入 {len(windows)} 道题")

    if args.dry_run:
        print("（dry-run，没有写文件）")
        return
    with open(args.tsfile, "w") as fh:
        fh.write(text)
    print(f"已写入 {args.tsfile}")


if __name__ == "__main__":
    main()
