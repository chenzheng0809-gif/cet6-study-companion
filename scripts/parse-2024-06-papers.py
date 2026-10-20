#!/usr/bin/env python3
"""
把 2024-06 真题 PDF 的抽取文本解析成结构化 JSON。

输入是 extract-2024-06-pdf.py 抽出来的纯文本，输出是每套一份 JSON。

为什么用锚点定位：
  这份卷面的段落分界在 PDF 里既不靠空行也不靠字号（版式上 Directions 结束处
  没有空行，段内反而有空行），靠猜会切错。所以每份卷子的内容块用「开头几个
  真实单词」定位 —— 这些锚点是我逐页读过 PDF 抄下来的原文开头，不是编的。
  定位之后全部靠断言校验（10 个空、词库 15 个、段落数、题量），
  任何一处切错都会直接报错退出，不会静默产出错数据。

卷面上的听力题只有 A–D 选项，没有题干 —— 这是 2024 年起六级卷面的真实版式，
题干只在录音里念出来。所以听力题干由 transcribe-listening.py 的转写提供，
这里只负责选项、阅读原文、写作与翻译。
"""
import json
import os
import re
import sys

TEXT_DIR = "/tmp/cet6-2024-06"

# 每份卷子各内容块的开头锚点（来自 PDF 原文）
ANCHORS = {
    1: {
        "bank_passage": "remarkable how different genres of music",
        "matching_title": "The Curious Case of the Tree That Owns Itself",
        "translation": "中国的传统婚礼习俗历史悠久",
    },
    2: {
        "bank_passage": "The Sun Is Also a Star is a truly lovely story",
        "matching_title": "These are the habits to avoid if you want to make a behavior change",
        "translation": "中国盛产竹子",
    },
    3: {
        "bank_passage": "A rainbow is a multi-colored, arc-shaped phenomenon",
        "matching_title": "Blame your worthless workdays on meeting recovery syndrome",
        "translation": "扇子自古以来就深受中国人喜爱",
    },
}

# 各套卷子的听力分段（题号来自卷面 "Questions N to M"）
LISTENING_GROUPS = [(1, 4), (5, 8), (9, 11), (12, 15), (16, 18), (19, 21), (22, 25)]
# 听力三段的卷面 Section 归属：A 对话 / B 短文 / C 讲座
LISTENING_SECTIONS = ["A", "A", "B", "B", "C", "C", "C"]

PAGE_SEP = re.compile(r"^=+ PAGE \d+ =+$", re.M)


def load_lines(setno: int) -> list[str]:
    with open(os.path.join(TEXT_DIR, f"paper-set{setno}.txt")) as fh:
        raw = fh.read()
    raw = PAGE_SEP.sub("", raw)
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in raw.split("\n")]
    # 去掉纯页码行
    return [l for l in lines if not re.fullmatch(r"\d{1,3}", l)]


def join_lines(lines: list[str]) -> str:
    return re.sub(r"\s+", " ", " ".join(l for l in lines if l)).strip()


def join_paragraphs(lines: list[str]) -> str:
    """
    保留真段落。

    这份卷面的段落分界既不靠字号也不可靠地靠空行 —— 版式里段内偶尔有假空行。
    判定规则：空行处，前一句以句末标点收尾、后一句首字母大写，才算真段落分界。
    """
    out: list[str] = []
    buf: list[str] = []
    pending_break = False
    for raw in lines:
        line = raw.strip()
        if not line:
            pending_break = True
            continue
        if pending_break and buf:
            prev = buf[-1]
            if prev[-1:] in ".!?\u201d" and line[:1].isupper():
                out.append(" ".join(buf))
                buf = []
        pending_break = False
        buf.append(line)
    if buf:
        out.append(" ".join(buf))
    return "\n\n".join(out)


def find_part(lines: list[str], key: str) -> int:
    """找 Part 起始行号。PDF 里罗马数字前后可能有空格，不写死字符。"""
    for i, l in enumerate(lines):
        if re.search(rf"^Part\s*[ⅠⅡⅢⅣI V]*\s*{key}", l):
            return i
    raise ValueError(f"找不到 Part {key}")


def find_anchor(lines: list[str], anchor: str, start: int = 0) -> int:
    for i in range(start, len(lines)):
        if anchor in lines[i]:
            return i
    raise ValueError(f"找不到锚点 {anchor!r}")


# ----------------------------------------------------------------- 听力选项

# 选项标记。双栏排版下 "A) xxx.C) yyy" 之间可能没有空格，
# 所以只要求字母前不是另一个字母。
OPT_RE = re.compile(r"(?<![A-Za-z])([A-D])\)")


def parse_options(block: str) -> dict[str, str]:
    """
    抽 A/B/C/D。

    卷面是双栏排版，抽取顺序会是 A、C、B、D，所以按字母标记解析而不是按出现顺序。
    """
    found: dict[str, str] = {}
    marks = list(OPT_RE.finditer(block))
    for i, m in enumerate(marks):
        key = m.group(1)
        if key in found:
            continue
        end = marks[i + 1].start() if i + 1 < len(marks) else len(block)
        text = re.sub(r"\s+", " ", block[m.end() : end]).strip()
        if text:
            found[key] = text
    return found


def parse_listening(lines: list[str]) -> list[dict]:
    """
    官方第三套真题不提供听力：卷面写着「由于多题多卷，官方第三套真题的听力试题
    与第二套真题的一致，只是选项顺序不同，因此，本套试卷不再提供听力部分」。
    所以这一套返回空列表，不硬造一套听力出来。
    """
    try:
        start = find_part(lines, "Listening Comprehension")
    except ValueError:
        return []
    end = find_part(lines, "Reading Comprehension")
    body = lines[start:end]

    # 卷面里根本没有听力题（官方第三套），就返回空，不硬造
    if not any("Questions 1 to 4 are based on" in l for l in body):
        return []

    groups: list[dict] = []
    for idx, (lo, hi) in enumerate(LISTENING_GROUPS):
        header = f"Questions {lo} to {hi} are based on"
        try:
            h = next(i for i, l in enumerate(body) if header in l)
        except StopIteration:
            raise ValueError(f"找不到 {header}")
        # 下一组的 header，或 Part 边界
        limit = len(body)
        if idx + 1 < len(LISTENING_GROUPS):
            nlo, nhi = LISTENING_GROUPS[idx + 1]
            for i in range(h + 1, len(body)):
                if f"Questions {nlo} to {nhi} are based on" in body[i]:
                    limit = i
                    break
        seg = body[h + 1 : limit]

        questions = []
        i = 0
        while i < len(seg):
            m = re.match(r"^(\d+)\.(.*)$", seg[i])
            if not m:
                i += 1
                continue
            n = int(m.group(1))
            if not (lo <= n <= hi):
                i += 1
                continue
            buf = [m.group(2)]
            i += 1
            while i < len(seg) and not re.match(r"^\d+\.", seg[i]):
                buf.append(seg[i])
                i += 1
            questions.append({"n": n, "options": parse_options(join_lines(buf))})
        groups.append(
            {
                "lo": lo,
                "hi": hi,
                "section": LISTENING_SECTIONS[idx],
                "questions": questions,
            }
        )
    return groups


# ------------------------------------------------------------------- 阅读

def parse_bank(lines: list[str]) -> list[dict]:
    """词库是三栏排版：'A) alleviate F) inhibiting K) mandatory' 一行三组。"""
    bank: list[dict] = []
    for line in lines:
        for key, word in re.findall(r"([A-O])\)\s+([A-Za-z']+)", line):
            bank.append({"key": key, "word": word})
    bank.sort(key=lambda b: b["key"])
    return bank


def parse_reading(lines: list[str], anchors: dict) -> dict:
    start = find_part(lines, "Reading Comprehension")
    end = find_part(lines, "Translation")
    body = lines[start:end]

    sec_a = find_anchor(body, anchors["bank_passage"])
    sec_b = find_anchor(body, anchors["matching_title"])
    sec_c = next(i for i, l in enumerate(body) if l.strip() == "Section C")

    # ---- Section A：选词填空 ----
    a_lines = body[sec_a:sec_b]
    # 词库在 Section A 末尾：从后往前找第一行以 "X) word" 开头的连续块
    bank_start = None
    for i in range(len(a_lines) - 1, -1, -1):
        if re.match(r"^[A-O]\)\s+[A-Za-z']+", a_lines[i]):
            bank_start = i
        elif bank_start is not None:
            break
    assert bank_start is not None, "找不到词库"
    bank = parse_bank(a_lines[bank_start:])
    passage_lines = a_lines[:bank_start]

    passage_text = join_paragraphs(passage_lines)

    def blankify(m: re.Match) -> str:
        n = int(m.group(1))
        return f"{{{{{n}}}}}"

    passage_text = re.sub(r"(?<![\d])(\d{2})(?![\d])", blankify, passage_text)

    # ---- Section B：长篇匹配 ----
    b_lines = body[sec_b:sec_c]
    paragraphs: list[dict] = []
    statements: list[dict] = []
    buf: list[str] = []
    label = None
    # 陈述句（36–45）常常跨两行，后半句要接回同一条陈述，
    # 不能掉进最后一个段落的正文里 —— 否则题干被截断、段落被污染。
    current: dict | None = None
    for line in b_lines[1:]:
        pm = re.match(r"^([A-O])\)\s*(.*)$", line)
        sm = re.match(r"^(\d{2})\.\s+(.*)$", line)
        if pm and not sm:
            if label is not None:
                paragraphs.append({"label": label, "text": join_lines(buf)})
            label = pm.group(1)
            buf = [pm.group(2)]
            current = None
            continue
        if sm:
            current = {"n": int(sm.group(1)), "text": sm.group(2).strip()}
            statements.append(current)
            continue
        if current is not None:
            current["text"] = join_lines([current["text"], line])
            continue
        if label is not None:
            buf.append(line)
    if label is not None:
        paragraphs.append({"label": label, "text": join_lines(buf)})

    # ---- Section C：仔细阅读 ----
    c_lines = body[sec_c:]
    details: list[dict] = []
    i = 0
    while i < len(c_lines):
        stripped = c_lines[i].strip()
        if stripped.startswith("Passage "):
            title = stripped
            i += 1
            qm = None
            while i < len(c_lines):
                m = re.match(
                    r"^Questions (\d+) to (\d+) are based on the following passage\.?$",
                    c_lines[i].strip(),
                )
                if m:
                    qm = (int(m.group(1)), int(m.group(2)))
                    i += 1
                    break
                i += 1
            if qm is None:
                raise ValueError(f"{title} 找不到题号行")
            pbuf: list[str] = []
            while i < len(c_lines) and not re.match(r"^\d{2}\.\s", c_lines[i].strip()):
                pbuf.append(c_lines[i])
                i += 1
            questions = []
            while i < len(c_lines):
                m = re.match(r"^(\d{2})\.\s+(.*)$", c_lines[i].strip())
                if not m or not (qm[0] <= int(m.group(1)) <= qm[1]):
                    break
                n = int(m.group(1))
                buf2 = [m.group(2)]
                i += 1
                while i < len(c_lines) and not re.match(
                    r"^(\d{2}\.\s|Passage |Section |Part )", c_lines[i].strip()
                ):
                    buf2.append(c_lines[i])
                    i += 1
                block2 = join_lines(buf2)
                options = parse_options(block2)
                # 题干 = 第一个选项标记之前的那一段
                first = OPT_RE.search(block2)
                stem = block2[: first.start()].strip() if first else block2
                questions.append({"n": n, "stem": stem, "options": options})
            details.append(
                {
                    "title": title,
                    "lo": qm[0],
                    "hi": qm[1],
                    "passage": join_paragraphs(pbuf),
                    "questions": questions,
                }
            )
            continue
        i += 1

    return {
        "bank": {"passage": passage_text, "words": bank},
        "matching": {
            "title": anchors["matching_title"],
            "paragraphs": paragraphs,
            "statements": statements,
        },
        "detail": details,
    }


# ------------------------------------------------------------- 写作 / 翻译

def parse_writing(lines: list[str]) -> dict:
    start = find_part(lines, "Writing")
    end = find_part(lines, "Listening Comprehension")
    block = join_lines(lines[start:end])
    m = re.search(r"sentence\s+[“\"]([^”\"]+)[”\"]", block)
    if not m:
        raise ValueError("找不到写作首句")
    return {"prompt": m.group(1).strip()}


def parse_translation(lines: list[str], anchor: str) -> str:
    start = find_part(lines, "Translation")
    body = lines[start:]
    i = find_anchor(body, anchor)
    return join_lines(body[i:])


# ------------------------------------------------------------------- 校验

def validate(setno: int, data: dict) -> None:
    n_listen = sum(len(g["questions"]) for g in data["listening"])
    if setno == 3:
        # 官方第三套不提供听力（见 parse_listening 的说明）
        assert n_listen == 0, f"set{setno} 不该有听力题"
    else:
        assert n_listen == 25, f"set{setno} 听力题数 {n_listen}"
    for g in data["listening"]:
        assert len(g["questions"]) == g["hi"] - g["lo"] + 1
        for q in g["questions"]:
            assert set(q["options"]) == {"A", "B", "C", "D"}, f"set{setno} Q{q['n']} 选项不全"
            assert all(len(v) > 3 for v in q["options"].values())

    bank = data["reading"]["bank"]
    assert len(bank["words"]) == 15, f"set{setno} 词库 {len(bank['words'])}"
    assert [b["key"] for b in bank["words"]] == list("ABCDEFGHIJKLMNO")
    blanks = sorted(int(m) for m in re.findall(r"\{\{(\d+)\}\}", bank["passage"]))
    assert blanks == list(range(26, 36)), f"set{setno} 空格 {blanks}"

    matching = data["reading"]["matching"]
    assert len(matching["statements"]) == 10
    assert [s["n"] for s in matching["statements"]] == list(range(36, 46))
    labels = [p["label"] for p in matching["paragraphs"]]
    assert labels == [chr(ord("A") + i) for i in range(len(labels))], labels
    assert all(len(p["text"]) > 100 for p in matching["paragraphs"])

    detail = data["reading"]["detail"]
    assert len(detail) == 2
    for d in detail:
        assert len(d["questions"]) == d["hi"] - d["lo"] + 1
        assert len(d["passage"]) > 800
        for q in d["questions"]:
            assert set(q["options"]) == {"A", "B", "C", "D"}, f"set{setno} Q{q['n']} 选项不全"

    assert len(data["writing"]["prompt"]) > 40
    assert len(data["translation"]["zh"]) > 150


def main() -> None:
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "/tmp/cet6-2024-06/parsed"
    os.makedirs(out_dir, exist_ok=True)
    for setno in (1, 2, 3):
        lines = load_lines(setno)
        anchors = ANCHORS[setno]
        data = {
            "set": setno,
            "listening": parse_listening(lines),
            "reading": parse_reading(lines, anchors),
            "writing": parse_writing(lines),
            "translation": {"zh": parse_translation(lines, anchors["translation"])},
        }
        validate(setno, data)
        path = os.path.join(out_dir, f"set{setno}.json")
        with open(path, "w") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
        m = data["reading"]["matching"]
        print(
            f"set{setno}: 听力 25 题 / {len(data['listening'])} 段 · "
            f"词库 15 · 长篇匹配 {len(m['paragraphs'])} 段 + 10 陈述 · "
            f"仔细阅读 {sum(len(d['questions']) for d in data['reading']['detail'])} 题 · "
            f"翻译 {len(data['translation']['zh'])} 字 ✓"
        )


if __name__ == "__main__":
    main()
