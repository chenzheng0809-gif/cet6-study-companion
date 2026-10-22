#!/usr/bin/env python3
"""
核对「重听本题」播的到底是不是这一题的题干。

把每个题干的区间单独转写一遍，跟数据里存的那句题干对照 ——
对得上，说明「重听本题」播的就是这道题；对不上，就是串题了。

用法：
    # 第一步：把数据里的题干区间和题干文字导出来
    npx tsx scripts/dump-question-stems.ts <paperId> > /tmp/stems.json
    # 第二步：逐题转写核对
    python3 scripts/verify-question-stems.py <mp3> /tmp/stems.json
"""
import importlib.util
import json
import os
import sys

spec = importlib.util.spec_from_file_location(
    "mw", os.path.join(os.path.dirname(os.path.abspath(__file__)), "measure-question-windows.py")
)
mw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mw)


def norm(t: str) -> str:
    """只留字母数字和空格，用来对转写和卷面措辞的差异。"""
    return "".join(ch.lower() for ch in t if ch.isalnum() or ch.isspace()).split()


def main() -> None:
    mp3, dump = sys.argv[1], sys.argv[2]
    with open(dump) as fh:
        data = json.load(fh)

    os.makedirs("/tmp/cet6-qwin-stem", exist_ok=True)
    small = "/tmp/cet6-qwin-stem/probe.wav"
    wav = "/tmp/cet6-qwin-stem/" + os.path.basename(mp3).rsplit(".", 1)[0] + ".wav"
    if not os.path.exists(wav):
        mw.to_wav(mp3, wav)

    stems = {q["n"]: q["stem"] for q in data["questions"]}
    bad = 0
    total = 0
    for unit in data["units"]:
        for w in unit["qw"]:
            total += 1
            text = mw.asr_range(wav, small, w["startSec"], w["endSec"])
            heard = " ".join(norm(text))
            want = " ".join(norm(stems.get(w["n"], "")))
            # 转写和卷面措辞可能有出入，只要关键词对得上就算这一题
            key = [w for w in want if len(w) > 4]
            hit = sum(1 for k in key if k in heard)
            ok = bool(want) and (hit >= max(1, len(key) // 2))
            if not ok:
                bad += 1
            print(f"Q{w['n']:>2} {w['startSec']:>8.2f}–{w['endSec']:>8.2f}  {'OK ' if ok else '对不上'}")
            print(f"     卷面: {stems.get(w['n'], '')}")
            print(f"     听到: {text.strip()[:200]}")
    print(f"\n{total} 道题，{total - bad} 道对得上，{bad} 道对不上")
    raise SystemExit(1 if bad else 0)


if __name__ == "__main__":
    main()
