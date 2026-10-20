#!/usr/bin/env python3
"""
把 listen_audio 的转写结果解析成「句子 + 说话人 + 录音里念出的题干」。

转写格式（实测）：
  N: College English Test, Band 6, Part 2, Listening Comprehension, Section A, Directions.
  In this section, you will hear two long conversations. ...
  W: Thank you for meeting with me, Stephen, at such short notice.
  M: Not a problem, Margaret. ...
  N: Questions 1 to 4 are based on the conversation you have just heard.
  Question 1. What does the woman say she will do?
  Question 2. ...

卷面上听力题不印题干，题干只在录音里念出来 —— 所以听力题的 stem 就取自这里，
是录音里真实读过的话，不是另编的。

用法：
    python3 scripts/parse-2024-06-transcripts.py /tmp/cet6-2024-06/asr <out.json>
"""
import glob
import json
import os
import re
import sys

# 说话人标记：实测两种写法都出现过 —— "<W> ..." 和 "W: ..."
SPEAKER_RE = re.compile(r"(?:^|(?<=\s))(?:<([MWN])>|([MWN]):)\s*")

# 题号：有时写数字，有时写英文单词（"Question five:"）
WORD_NUMBERS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7,
    "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
    "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20, "twenty-one": 21, "twenty-two": 22,
    "twenty-three": 23, "twenty-four": 24, "twenty-five": 25,
}
QUESTION_RE = re.compile(
    r"Question\s+(\d{1,2}|twenty-five|twenty-four|twenty-three|twenty-two|twenty-one|"
    r"nineteen|eighteen|seventeen|sixteen|fifteen|fourteen|thirteen|twelve|eleven|ten|"
    r"nine|eight|seven|six|five|four|three|two|one)\s*[.:]?\s*"
)


def question_number(token: str) -> int:
    if token.isdigit():
        return int(token)
    return WORD_NUMBERS[token]


def split_turns(text: str) -> list[tuple[str | None, str]]:
    """按说话人标记切成一段段（说话人, 文本）。"""
    marks = list(SPEAKER_RE.finditer(text))
    if not marks:
        return [(None, text.strip())]
    turns = []
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
        chunk = text[m.end() : end].strip()
        if chunk:
            turns.append((m.group(1) or m.group(2), chunk))
    return turns


def split_sentences(text: str) -> list[str]:
    """按句末标点切句；英文缩写（Mr. U.S. e.g.）会误切，但只影响切句粒度。"""
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    parts = re.split(r"(?<=[.?!])\s+(?=[A-Z0-9\"'(])", text)
    return [p.strip() for p in parts if p.strip()]


def extract_stems(text: str) -> dict[int, str]:
    """
    抽录音里念出的题干。

    形如 "Question 1. What does the woman say she will do?" 一口气念完，
    所以从 "Question N" 往后取到下一个 "Question" 或段末为止。
    """
    stems: dict[int, str] = {}
    matches = list(QUESTION_RE.finditer(text))
    for i, m in enumerate(matches):
        n = question_number(m.group(1))
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        stem = text[m.end() : end].strip()
        # 题干后面常常紧跟着下一个说话人的标记（"…after the introduction? N:"），
        # 那个标记不是题干的一部分，剥掉。
        stem = re.sub(r"\s*[MWN]:\s*$", "", stem).strip()
        stem = re.sub(r"\s+", " ", stem)
        if stem:
            stems[n] = stem
    return stems


def main() -> None:
    asr_dir = sys.argv[1]
    out_path = sys.argv[2]
    result = {}
    for set_dir in sorted(glob.glob(os.path.join(asr_dir, "set*"))):
        setno = int(os.path.basename(set_dir)[3:])
        units = {}
        for path in sorted(glob.glob(os.path.join(set_dir, "unit*.json"))):
            uid = os.path.basename(path)[:-5]
            data = json.load(open(path))
            text = data.get("transcription", "")
            sentences = []
            for speaker, chunk in split_turns(text):
                for sent in split_sentences(chunk):
                    sentences.append(
                        {
                            "id": f"{uid}-{len(sentences) + 1}",
                            "speaker": speaker,
                            "en": sent,
                        }
                    )
            units[uid] = {
                "sentences": sentences,
                "stems": extract_stems(text),
            }
        result[f"set{setno}"] = units
    with open(out_path, "w") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
    for setno, units in result.items():
        total = sum(len(u["sentences"]) for u in units.values())
        stems = sum(len(u["stems"]) for u in units.values())
        print(f"{setno}: {len(units)} 段 · {total} 句 · {stems} 个录音题干")


if __name__ == "__main__":
    main()
