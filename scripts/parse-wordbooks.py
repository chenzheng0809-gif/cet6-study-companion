"""
把《六级核心词汇》上下册解析成结构化数据。

两册的数据形态完全不同，不能塞进同一个模型：

- 上册（80 页）：`Unit N 主题` 下的**词条**。一个词条头部是
  "词 + 一个或多个「词性. [音标] 释义」行"，再跟着 派生词 / 近义词 /
  反义词 / 词组 / 拓展词 几个列表行。103 个词条，跨 10 个 Unit。
- 下册（16 页）：`专题 N：名称`，**三种版式**：
  1. 专题 1  用 `#原因#` 分组，条目带 ①…编号
  2. 专题 2  用 `①观点词（动词）【认为】` 分组，条目是不编号的等号链
  3. 专题 3  无分组，扁平列出 `confused = perplexed = puzzled adj.困惑的`
  4. 专题 4/5 编号清单 `1. linguistic ability(语言能力)`

只解析这些高置信度的部分。右栏那些展开的 派生词/近义词/词组 详解和
【例】真题例句的译文在双栏排版里会串行，逐句对齐不可靠 —— **宁可不导，
也不导错位的释义**（和项目里"不伪造时间戳"是同一条底线）。
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

UPPER = Path(".cache/uploads/vocab-upper.txt")
LOWER = Path(".cache/uploads/vocab-lower.txt")
OUT = Path(".cache/uploads/wordbooks.json")
# 黄色高亮由 scripts/extract-highlights.py 从 PDF 注解里抽出来，不是文本层的属性
HL_JSON = Path(".cache/uploads/highlights.json")

PAGE_MARK = "\x00PAGE:"
UNIT_RE = re.compile(r"^Unit\s+(\d+)\s+(.+?)\s*$")
TOPIC_RE = re.compile(r"^专题\s*(\d+)\s*[：:]\s*(.+?)\s*$")

# PDF 字体把部分简体字塞成了「CJK 部首补充区」里的变体字，
# NFKC 能修康熙部首（U+2Fxx），修不了这一区，只能显式映射。
RADICAL_FIX = {
    "⻅": "见",
    "⻛": "风",
    "⻜": "飞",
    "⺠": "民",
    "⻓": "长",
}

CIRCLED_DIGITS = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"

# 上册
POSES = r"n|v|vt|vi|adj|adv|prep|pron|conj|num|art|int|abbr"
POS_RE = re.compile(rf"^({POSES})\.\s*(?:\[([^\]]*)\])?\s*(.+?)\s*$")
WORD_RE = re.compile(r"^[A-Za-z][A-Za-z\-'’\. ]{1,40}$")
LIST_KEYS = {
    "派生词": "derivatives",
    "近义词": "synonyms",
    "反义词": "antonyms",
    "词组": "phrases",
    "拓展词": "extensions",
}
LIST_RE = re.compile(r"^(派生词|近义词|反义词|词组|拓展词)\s*[：:]\s*(.*)$")
SECTION_KEYS = {
    "派生词": "derivatives",
    "近义词": "synonyms",
    "反义词": "antonyms",
    "词组": "phrases",
    "拓展词": "extensions",
}

# 下册
GROUP_HASH_RE = re.compile(r"^#(.+?)#\s*$")
GROUP_NUM_RE = re.compile(r"^([①②③④⑤⑥⑦⑧⑨⑩])\s*(.+?)\s*$")
GROUP_TAIL_RE = re.compile(r"^(.*?)[（(]([^）)]*)[）)]\s*(?:【([^】]*)】)?\s*$")
TERM_ZH_RE = re.compile(r"^(.*?)[（(]([^）)]*)[）)]\s*$")
LIST_ITEM_RE = re.compile(r"^(\d+)[.、]\s*(.+?)\s*$")
POS_SCAN_RE = re.compile(rf"(?:^|\s)({POSES})\.\s*")
ENGLISH_RUN_RE = re.compile(r"[A-Za-z][A-Za-z\-'’\.]*(?:\s+[A-Za-z][A-Za-z\-'’\.]*)*")


def normalize(text: str) -> str:
    # NFKC 会把带圈数字 ①②③ 兼容分解成阿拉伯数字，而它们正是专题 1/2 的
    # 条目编号。先用私有区哨兵保护，NFKC 之后再还原。
    for i, ch in enumerate(CIRCLED_DIGITS):
        text = text.replace(ch, f"\ue000{i}\ue001")
    text = unicodedata.normalize("NFKC", text)
    for i, ch in enumerate(CIRCLED_DIGITS):
        text = text.replace(f"\ue000{i}\ue001", ch)
    for bad, good in RADICAL_FIX.items():
        text = text.replace(bad, good)
    return text



# 单元简介：**书里没有这段文字**，是本应用按该 Unit 的实际词条写的导读。
# 写在这里而不是前端，是为了让「这是我们写的、不是原书内容」这件事只有一个事实来源。
UNIT_INTROS = {
    "商业经济": "经济、商业与金融类文本的高频词。仔细阅读和翻译里常见，先把「熟词僻义」那几个吃透。",
    "学校教育": "教育、校园与学习类话题。写作和翻译的万能素材，抽象名词多，注意搭配。",
    "科技创新": "科技、人工智能与科研类。这一单元的词在听力里出现频率最高，音频常以新闻形式出现。",
    "自然环境": "环境、气候与生态类。翻译题的高频命题区，动词（mitigate / degrade）比名词更值得记。",
    "医疗健康": "医学、公共卫生与心理健康类。术语多但搭配固定，按词组整条记比按单词记省力。",
    "职场就业": "求职、职场与劳动话题。写作议类的常用论据来源，也最容易在听力数字题里出现。",
    "文化习俗": "文化、传统与价值观类。翻译里容易考文化专有名词，注意一词多译。",
    "社会民生": "社会现象、城市生活与公共议题。仔细阅读的常客，形容词多，注意褒贬色彩。",
    "科普研究": "科学研究方法与结论表达。学术词汇集中，练的时候顺便记住「 hedged claim 」这类语气。",
    "政治法律": "政治、法律与公共政策类。词最抽象，也最容易误读成想当然的意思。",
}


def load(path: Path) -> list[str]:
    lines: list[str] = []
    for raw in normalize(path.read_text(encoding="utf-8")).splitlines():
        m = re.match(r"^<<<PAGE (\d+)>>>$", raw.strip())
        if m:
            lines.append(f"{PAGE_MARK}{m.group(1)}")
            continue
        lines.append(raw.rstrip())
    return lines


# ------------------------------------------------------------------ 黄色高亮

# 结构标签本身就是靠高亮标出来的，但前端会把它们渲染成分组标题，
# 再当普通文字标一遍就成了重复高亮，直接剔掉。
HL_SKIP = {
    "派生词", "近义词", "反义词", "词组", "拓展词", "形近词",
    "派生词：", "近义词：", "反义词：", "词组：", "拓展词：", "形近词：",
}

_MEANINGFUL = re.compile(r"[A-Za-z\u4e00-\u9fff]")


def load_highlights() -> dict[str, dict[int, list[str]]]:
    """`{书名: {页码: [高亮文字, ...]}}`。文字走和正文同一套 normalize，
    否则 `，` / `“` 这类 NFKC 会改的字符对不上。"""
    if not HL_JSON.exists():
        print(f"⚠️ 找不到 {HL_JSON}，先跑 python3 scripts/extract-highlights.py")
        return {}
    raw = json.loads(HL_JSON.read_text(encoding="utf-8"))
    out: dict[str, dict[int, list[str]]] = {}
    for book, runs in raw.items():
        pages: dict[int, list[str]] = {}
        for r in runs:
            text = normalize(r["text"]).strip()
            if text and len(text) >= 2 and text not in HL_SKIP and _MEANINGFUL.search(text):
                pages.setdefault(r["page"], []).append(text)
        out[book] = pages
    return out


def page_index(lines: list[str]) -> list[int]:
    """每个下标属于第几页，页码从 `load()` 插的 PAGE_MARK 顺延。"""
    page = 0
    out: list[int] = []
    for line in lines:
        if line.startswith(PAGE_MARK):
            page = int(line[len(PAGE_MARK) :])
        out.append(page)
    return out


def _candidates(pages: list[int], hl: dict[int, list[str]] | None) -> list[str]:
    if not hl:
        return []
    seen: set[str] = set()
    for p in pages:
        for text in hl.get(p, ()):
            if text not in seen:
                seen.add(text)
    return list(seen)


_TINY_WORD = re.compile(r"^[A-Za-z']{1,2}$")


def _find_spans(text: str, cand: str) -> list[tuple[int, int]]:
    """在 text 里找 cand，认词边界，并吸到完整的词上。

    两条规则都是冲着「宁可漏标也别标错位」去的：

    1. 候选是字母开头/结尾时，两侧必须是词边界。不加这条，书上一处
       独立标注的 `on` 会命中 `innovati`+`on` 里的 `on`。
    2. 原书的矩形有时压在词中间（高亮从 `the` 的 e 开始）。这种半词命中
       往两边吸到完整词，还原成作者真正想标的那段。
    """
    if _TINY_WORD.match(cand):
        return []                      # on / in / a 这种，认不准，不标
    lo = r"(?<![A-Za-z'])" if cand[0].isascii() and cand[0].isalpha() else ""
    hi = r"(?![A-Za-z'])" if cand[-1].isascii() and cand[-1].isalpha() else ""
    if lo or hi:
        hits = [(m.start(), m.end()) for m in re.finditer(lo + re.escape(cand) + hi, text)]
        if hits:
            return hits
    at = text.find(cand)
    if at < 0:
        return []
    end = at + len(cand)
    if cand[0].isascii() and cand[0].isalpha():
        while at > 0 and text[at - 1].isascii() and text[at - 1].isalpha():
            at -= 1
    if cand[-1].isascii() and cand[-1].isalpha():
        while end < len(text) and text[end].isascii() and text[end].isalpha():
            end += 1
    return [(at, end)]


def mark_text(text: str, pages: list[int], hl: dict[int, list[str]] | None) -> list[dict] | None:
    """把正文里确实被高亮覆盖的片段切出来。

    只有「页码对得上 + 在这段文字里只出现一次」才敢标 —— 出现两次说明这段
    文字和某个高亮撞了但对不上号，宁可漏标也不标错位置。

    返回 `[{text, mark?}]`；一个都没命中就返回 None，字段整个不写。
    """
    if not text or not pages:
        return None
    spans: list[list[int]] = []
    for cand in _candidates(pages, hl):
        hits = _find_spans(text, cand)
        if len(hits) != 1:
            continue
        spans.append(list(hits[0]))
    if not spans:
        return None
    spans.sort()
    merged: list[list[int]] = []
    for start, end in spans:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    segs: list[dict] = []
    pos = 0
    for start, end in merged:
        if start > pos:
            segs.append({"text": text[pos:start]})
        segs.append({"text": text[start:end], "mark": True})
        pos = end
    if pos < len(text):
        segs.append({"text": text[pos:]})
    return segs


def mark_term(term: dict, pages: list[int], hl: dict[int, list[str]] | None) -> bool:
    """下册同义链里，判断这个词本身是不是书上重点标出来的那个。

    书上的标法是整个 `claim(声称)` 连括号一起标，所以这里认
    `高亮 == 词` 或 `高亮以词开头且紧跟 (（[：空格` 两种。
    """
    if not hl:
        return False
    name = (term.get("term") or "").strip()
    if not name:
        return False
    low = name.lower()
    for cand in _candidates(pages, hl):
        c = cand.strip()
        if c.lower() == low:
            return True
        if c.lower().startswith(low) and c[len(name) :][:1] in "(（[：= \t":
            return True
    return False


def split_items(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"[，,、]", text) if p.strip()]


def clean_term(term: str) -> str:
    """剥掉列表项尾部可能带的音标，如 `literacy ['lɪt(ə)rəsɪ]`。"""
    term = term.strip()
    m = re.match(r"^(.+?)\s*\[[^\]]*\]$", term)
    return m.group(1).strip() if m else term


def strip_trailing_term(text: str) -> tuple[str, str]:
    """把一段文字尾部的英文词拆出来（`成⻅ stereotypical` → `成⻅` + `stereotypical`）。"""
    text = text.strip()
    m = re.match(r"^(.*?)([A-Za-z][A-Za-z\-'’\.]*(?:\s+[A-Za-z][A-Za-z\-'’\.]*)*)\s*$", text)
    if m and m.group(1).strip():
        return m.group(1).strip(), m.group(2).strip()
    return text, ""


def is_list_continuation(lines: list[str], j: int) -> bool:
    """这一行是不是 `派生词/近义词/词组` 列表的换行续接？

    排版截断时上一行会明确断在逗号上：`... uneconomic ，` + `socioeconomic`。

    这里只认这一种确凿信号。曾经放宽到「本行是裸英文就算续行」，结果把右栏
    例句里的 paycheck 吃进了 restore 的派生词 —— 那是双栏排版串进来的内容。
    少收一两个词组可以接受，收错释义不行。
    """
    return lines[j - 1].rstrip().endswith(("，", ",", "、"))


# ---------------------------------------------------------------- 上册


# ------------------------------------------------- 上册第二遍：【例】真题例句

EX_HEAD_RE = re.compile(r"^【例\s*(\d+)?\s*】\s*(.+?)\s*$")
SOURCE_RE = re.compile(r"^(\d{4})\s*年\s*(.+?)\s*$")
PAGE_NO_RE = re.compile(r"^-?\s*\d{1,3}\s*-?\s*$")
SECTION_RE = re.compile(r"^(派生词|近义词|反义词|词组|拓展词)\s*[：:]\s*$")
TRANSLATION_RE = re.compile(r"^译文\s*[：:]\s*(.*)$")
ARTICLE_RE = re.compile(r"^文章\s*[：:]\s*(.*)$")
QUESTION_RE = re.compile(r"^题目\s*[：:]\s*(.*)$")
OPTION_RE = re.compile(r"^([A-D])\s*[）)]\s*(.*)$")
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
DETAIL_PHONETIC_RE = re.compile(r"^(.+?)\s*\[([^\]]*)\]\s*(.*)$")
DETAIL_PHRASE_RE = re.compile(r"^([A-Za-z][A-Za-z\-'’\.\s]*?)\s*([\u4e00-\u9fff].*)$")
SENTENCE_END = ("。", "！", "？", "”", "」", "』", "…")


def extract_senses(text: str) -> list[dict]:
    """`n.货币` / `n.文盲 adj.文盲的，不识字的` → 若干条词性释义。"""
    text = text.strip()
    if not text:
        return []
    marks = [(m.start(1), m.end(), m.group(1)) for m in POS_SCAN_RE.finditer(" " + text)]
    if not marks:
        return [{"pos": "", "meaning": text}]
    senses: list[dict] = []
    for idx, (_start, end, pos) in enumerate(marks):
        stop = marks[idx + 1][0] if idx + 1 < len(marks) else len(text) + 1
        chunk = text[end - 1 : stop - 1] if stop <= len(text) else text[end - 1 :]
        meaning, extra = strip_trailing_term(chunk.strip())
        if not meaning and extra:
            meaning = extra
        if meaning:
            senses.append({"pos": pos + ".", "meaning": meaning})
    return senses


def parse_detail_line(line: str) -> dict | None:
    """右栏详解行：`economic [iːkə'nɒmɪk] adj.经济的` 或 `emerging economy 新兴的经济体`。"""
    m = DETAIL_PHONETIC_RE.match(line)
    if m:
        term, phonetic, rest = (g.strip() for g in m.groups())
        if term and WORD_RE.match(term + " "):
            return {"term": term, "phonetic": phonetic, "senses": extract_senses(rest)}
    m = DETAIL_PHRASE_RE.match(line)
    if m:
        term, zh = m.group(1).strip(), m.group(2).strip()
        if term:
            return {"term": term, "phonetic": "", "senses": [{"pos": "", "meaning": zh}]}
    return None


def collect_block(lines: list[str], start: int, end: int) -> dict:
    """把一个【例】块的非空行解析成 {source, sentence, translation, article, question, options, sections}。"""
    body = [l.strip() for l in lines[start:end] if l.strip()]
    out: dict = {
        "source": "",
        "sentence": "",
        "translation": "",
        "translationComplete": True,
        "article": "",
        "question": "",
        "options": [],
        "sections": {},
    }
    if not body:
        return out

    i = 0
    m_src = SOURCE_RE.match(body[0])
    if m_src and not WORD_RE.match(body[0]):
        out["source"] = body[0]
        i = 1

    # 文章 + 题目 + 选项（精读原文型）
    if i < len(body) and ARTICLE_RE.match(body[i]):
        # 第一行的正文在「文章：」后面，别连同前缀一起丢掉
        art: list[str] = [ARTICLE_RE.match(body[i]).group(1)]
        i += 1
        while i < len(body) and not QUESTION_RE.match(body[i]):
            if OPTION_RE.match(body[i]):
                break
            art.append(body[i])
            i += 1
        out["article"] = " ".join(art)
        if i < len(body):
            mq = QUESTION_RE.match(body[i])
            if mq:
                out["question"] = mq.group(1).strip()
                i += 1
            while i < len(body):
                mo = OPTION_RE.match(body[i])
                if not mo:
                    break
                out["options"].append({"label": mo.group(1), "text": mo.group(2).strip()})
                i += 1

    # 英文例句（到「译文：」为止）
    if not out["article"]:
        sent: list[str] = []
        while i < len(body) and not TRANSLATION_RE.match(body[i]):
            if QUESTION_RE.match(body[i]) or OPTION_RE.match(body[i]):
                break
            sent.append(body[i])
            i += 1
        out["sentence"] = tidy(" ".join(sent))

    # 译文 + 右栏详解
    tail = body[i:]
    if tail and TRANSLATION_RE.match(tail[0]):
        out["translation"] = tidy(TRANSLATION_RE.match(tail[0]).group(1))
        tail = tail[1:]

    sections: dict[str, list[dict]] = {}
    current: str | None = None
    leftover: list[str] = []
    for line in tail:
        ms = SECTION_RE.match(line)
        if ms:
            current = ms.group(1)
            sections.setdefault(current, [])
            continue
        detail = parse_detail_line(line) if current else None
        if detail:
            sections[current].append(detail)
        elif current:
            leftover.append(line)
        else:
            leftover.append(line)

    # 译文在双栏里被截断时，续行紧跟在译文行之后，右栏的分组头和详解行要跳过去。
    # 两种排版都覆盖得到：续行在右栏之前（crisis 的「问题。」）或之后（economy 的「民经济。」）。
    out["translationComplete"] = True
    if out["translation"] and not out["translation"].endswith(SENTENCE_END):
        overflow = ""
        for line in tail:
            if SECTION_RE.match(line):
                continue
            if parse_detail_line(line):
                continue
            overflow = line
            break
        merged = tidy(out["translation"] + overflow) if overflow else ""
        if merged and merged.endswith(SENTENCE_END):
            out["translation"] = merged
        else:
            # 拼不完整就不给。与其给半句、或者接上别的栏的尾巴，不如不显示译文。
            out["translationComplete"] = False

    out["sections"] = sections
    return out


def parse_upper(lines: list[str], hl: dict[int, list[str]] | None = None) -> list[dict]:
    words: list[dict] = []
    unit_no: int | None = None
    unit_name: str | None = None
    page_at = page_index(lines)
    i, n = 0, len(lines)

    while i < n:
        line = lines[i].strip()

        mu = UNIT_RE.match(line)
        if mu:
            unit_no, unit_name = int(mu.group(1)), mu.group(2).strip()
            i += 1
            continue

        if not line or line.startswith(PAGE_MARK):
            i += 1
            continue

        if WORD_RE.match(line) and i + 1 < n and POS_RE.match(lines[i + 1].strip()):
            senses: list[dict] = []
            j = i + 1
            while j < n:
                pm = POS_RE.match(lines[j].strip())
                if not pm:
                    break
                pos, phonetic, meaning = pm.groups()
                senses.append(
                    {
                        "pos": pos + ".",
                        "phonetic": (phonetic or "").strip(),
                        "meaning": meaning.strip(),
                        "_pages": [page_at[j]],
                    }
                )
                j += 1

            entry = {
                "word": re.sub(r"\s+", " ", line).strip(),
                "senses": senses,
                "unitNo": unit_no,
                "unitName": unit_name,
                "derivatives": [],
                "synonyms": [],
                "antonyms": [],
                "phrases": [],
                "extensions": [],
                "examples": [],
            }

            # 词表往后收。这里不能一遇到杂行就 break —— 版面会把右栏内容
            # 和页码、上一页的尾巴插进来（restore 的派生词和近义词就跨了分页），
            # 所以跳过少量杂行继续找，但遇到真正的下一个词条/例句/新 Unit 必须停。
            last_key: str | None = None
            detail_key: str | None = None
            stray = 0
            while j < n:
                cur = lines[j].strip()
                if not cur or cur.startswith(PAGE_MARK) or PAGE_NO_RE.match(cur):
                    j += 1
                    continue
                if EX_HEAD_RE.match(cur) or UNIT_RE.match(cur):
                    break
                if WORD_RE.match(cur) and j + 1 < n and POS_RE.match(lines[j + 1].strip()):
                    break
                lm = LIST_RE.match(cur)
                if lm:
                    key = LIST_KEYS[lm.group(1)]
                    content = lm.group(2).strip()
                    if content:
                        # 头部那行：光秃秃的词表
                        last_key = key
                        detail_key = None
                        entry[key].extend(clean_term(x) for x in split_items(content))
                    else:
                        # 表头空着 + 下面逐行详解（`近义词：` / `revive [rɪˈvaɪv] v.恢复；复苏`）。
                        # 没有例句块的词条（如 restore）只能从这里拿到带音标和中文的那份。
                        detail_key = key
                        last_key = None
                    stray = 0
                    j += 1
                    continue
                if detail_key:
                    detail = parse_detail_line(cur)
                    if detail:
                        detail["_pages"] = [page_at[j]]
                        entry[detail_key].append(detail)
                        stray = 0
                        j += 1
                        continue
                if last_key and lines[j - 1].rstrip().endswith(("，", ",", "、")):
                    entry[last_key].extend(clean_term(x) for x in split_items(cur))
                    stray = 0
                    j += 1
                    continue
                stray += 1
                if stray > 3:
                    break
                j += 1

            if entry["unitNo"] is not None and entry["senses"]:
                entry["examples"] = []
                words.append(entry)
            i = j
            continue

        # 【例】块：挂在它前面最近的词条上。块尾就是右栏详解，
        # 详解里的近义词/词组带音标和中文，比头部那行光秃秃的词表更完整，用它覆盖。
        mex = EX_HEAD_RE.match(line)
        if mex and words:
            end = i + 1
            while end < n:
                nxt = lines[end].strip()
                if EX_HEAD_RE.match(nxt) or UNIT_RE.match(nxt):
                    break
                if nxt and WORD_RE.match(nxt) and end + 1 < n and POS_RE.match(lines[end + 1].strip()):
                    break
                end += 1
            block = collect_block(lines, i + 1, end)
            target = words[-1]
            target["examples"].append(
                {
                    "headword": mex.group(2).strip(),
                    "source": block["source"],
                    "sentence": block["sentence"],
                    "translation": block["translation"] if block["translationComplete"] else "",
                    "translationComplete": block["translationComplete"],
                    "article": block["article"],
                    "question": block["question"],
                    "options": block["options"],
                    "_pages": sorted({p for p in page_at[i + 1 : end] if p}),
                }
            )
            for label, items in block["sections"].items():
                if not items:
                    continue
                target[SECTION_KEYS[label]] = items
            i = end
            continue

        i += 1

    for w in words:
        for field in ("derivatives", "synonyms", "antonyms", "phrases", "extensions"):
            w.setdefault(field, [])

    return words


# ---------------------------------------------------------------- 下册

def make_item(terms: list[str], senses: list[dict], zhs: dict[str, str] | None = None,
              pages: list[int] | None = None) -> dict:
    out = {
        "terms": [{"term": t, "zh": (zhs or {}).get(t, "")} for t in terms if t],
        "senses": senses,
        "meaning": "",
        "examples": [],
    }
    out["_pages"] = list(pages or [])
    return out


def parse_flat_line(line: str, pages: list[int] | None = None) -> dict | None:
    """专题 3：`confused = perplexed = puzzled adj.困惑的` / `stereotype n.成见 stereotypical adj.成见的`"""
    marks = [(m.start(1), m.end(), m.group(1)) for m in POS_SCAN_RE.finditer(line)]
    terms: list[str] = []
    senses: list[dict] = []

    if not marks:
        chain = [t.strip() for t in line.split("=") if t.strip()]
        return make_item(chain, [], pages=pages) if chain else None
    head = line[: marks[0][0]]
    terms.extend(t.strip() for t in head.split("=") if t.strip())

    for idx, (_start, end, pos) in enumerate(marks):
        stop = marks[idx + 1][0] if idx + 1 < len(marks) else len(line)
        chunk = line[end:stop]
        meaning, extra_term = strip_trailing_term(chunk)
        if extra_term:
            terms.append(extra_term)
        if meaning:
            senses.append({"pos": pos + ".", "meaning": meaning, "_pages": list(pages or [])})

    return make_item(terms, senses, pages=pages)


def chain_complete(chain: list[str]) -> bool:
    """一条等号链读完没有。

    行尾形态就是断句信号：结尾是 `=` 说明还有下一个选项；结尾是 `)`（注记写完）
    说明这条链结束了。夹在中间的两种都要继续攒 —— 排版经常在链中间换行：

    - `... = be accountable`  + `for(对…负责) = be liable for(对…负责)`
    - `... = outcome(影响,`    + `结果)`
    """
    text = " ".join(chain).rstrip()
    if text.endswith("="):
        return False
    return text.endswith((")", "）", "】", "]"))


def parse_chain_block(block: list[str], pages: list[int] | None = None) -> list[dict]:
    """专题 1/2：一段可能跨行的等号链。

    书的注记有两种写法：专题 1 写在链尾（`a = b = c（因此）`，是整条链的意思），
    专题 2 逐词写（`think(认为) = believe(相信)`）。只有链尾一个词带注时，
    把它提为整条链的 meaning，别挂到最后一个词头上误导人。
    """
    text = re.sub(r"\s+", " ", " ".join(block)).strip()
    parts: list[dict] = []
    for part in (p.strip() for p in text.split("=")):
        if not part:
            continue
        mz = TERM_ZH_RE.match(part)
        if mz and mz.group(1).strip():
            parts.append({"term": mz.group(1).strip(), "zh": mz.group(2).strip()})
        else:
            parts.append({"term": part, "zh": ""})

    if not parts:
        return []

    meaning = ""
    glossed = [p for p in parts if p["zh"]]
    if len(parts) > 1 and len(glossed) == 1:
        meaning = glossed[0]["zh"]
        parts = [{**p, "zh": ""} for p in parts]

    return [{"terms": parts, "senses": [], "meaning": meaning, "examples": [],
             "_pages": list(pages or [])}]


def find_item(topic: dict | None, headword: str) -> dict | None:
    """按【例】行里的词形回找它属于哪条同义替换。"""
    if topic is None:
        return None
    target = headword.lower().strip()
    for group in topic["groups"]:
        for item in group["items"]:
            for term in item["terms"]:
                if term["term"].lower().strip() == target:
                    return item
    for group in topic["groups"]:
        for item in group["items"]:
            for term in item["terms"]:
                if target.startswith(term["term"].lower().strip() + " ") or term["term"].lower().startswith(target + " "):
                    return item
    return None


def parse_lower(lines: list[str], hl: dict[int, list[str]] | None = None) -> list[dict]:
    topics: list[dict] = []
    cur_topic: dict | None = None
    cur_group: dict | None = None
    chain: list[str] = []
    chain_pages: list[int] = []
    page_at = page_index(lines)

    def flush_chain() -> None:
        nonlocal chain, chain_pages
        if cur_group is not None and chain:
            cur_group["items"].extend(parse_chain_block(chain, sorted(set(chain_pages))))
        chain = []
        chain_pages = []

    def ensure_group() -> dict | None:
        """专题 3/4/5 没有显式分组头，条目挂在话题自带的默认分组下。"""
        nonlocal cur_group
        if cur_topic is None:
            return None
        if cur_group is None:
            cur_group = {
                "groupName": cur_topic["topicName"],
                "groupLabel": "",
                "meaning": "",
                "items": [],
            }
            cur_topic["groups"].append(cur_group)
        return cur_group

    mode = ""          # chains / flat / list，每个专题进入时按首行判定一次
    in_note = False    # `注1：…` / `注2：…` 是补充说明，不是同义替换
    lines_idx = 0
    while lines_idx < len(lines):
        li = lines_idx
        raw = lines[li]
        lines_idx = li + 1
        line = raw.strip()
        if not line or line.startswith(PAGE_MARK):
            flush_chain()
            in_note = False
            continue

        mt = TOPIC_RE.match(line)
        if mt:
            flush_chain()
            cur_topic = {
                "topicNo": int(mt.group(1)),
                "topicName": mt.group(2).strip(),
                "groups": [],
            }
            topics.append(cur_topic)
            cur_group = None
            mode = ""
            in_note = False
            continue

        if cur_topic is None:
            continue

        # 【例】块：按词形挂回它所属的那条同义替换
        mex = EX_HEAD_RE.match(line)
        if mex:
            flush_chain()
            end = li + 1
            while end < len(lines):
                nxt = lines[end].strip()
                if EX_HEAD_RE.match(nxt) or TOPIC_RE.match(nxt) or GROUP_HASH_RE.match(nxt):
                    break
                if GROUP_NUM_RE.match(nxt) and "【" in nxt:
                    break
                # 下册的例句块后面紧跟着的往往还是同义链。例句里不会出现等号，
                # 所以拿它当边界，否则最后一条例句会把后面整段内容吞掉。
                if "=" in nxt or SECTION_RE.match(nxt):
                    break
                end += 1
                if end - li > 26:
                    break
            block = collect_block(lines, li + 1, end)
            head = mex.group(2).strip()
            holder = find_item(cur_topic, head)
            if holder is not None:
                holder.setdefault("examples", []).append(
                    {
                        "headword": head,
                        "source": "",
                        "sentence": block["sentence"],
                        "translation": block["translation"] if block["translationComplete"] else "",
                        "translationComplete": block["translationComplete"],
                        "article": block["article"],
                        "question": block["question"],
                        "options": block["options"],
                        "_pages": sorted({p for p in page_at[li + 1 : end] if p}),
                    }
                )
            lines_idx = end
            continue

        mg = GROUP_NUM_RE.match(line)

        # 分组头：`#原因#` 或 `①观点词（动词）【认为】`
        # 必须排在 `注` 判断之前 —— 专题 1 里 `注：` 和下一个 `#结果#` 之间没有空行，
        # 不在这里复位的话，整个结果组都会被当成注释跳过。
        mh = GROUP_HASH_RE.match(line)
        if mh:
            flush_chain()
            in_note = False
            mode = mode or "chains"
            cur_group = {"groupName": mh.group(1).strip(), "groupLabel": "", "meaning": "", "items": []}
            cur_topic["groups"].append(cur_group)
            continue
        if mg and "【" in line and "=" not in line:
            flush_chain()
            in_note = False
            mode = mode or "chains"
            tail = GROUP_TAIL_RE.match(mg.group(2).strip())
            cur_group = {
                "groupName": tail.group(1).strip() if tail else mg.group(2).strip(),
                "groupLabel": tail.group(2).strip() if tail else "",
                "meaning": (tail.group(3).strip() if tail and tail.group(3) else ""),
                "items": [],
            }
            cur_topic["groups"].append(cur_group)
            continue

        if line.startswith("注"):
            flush_chain()
            in_note = True
            continue
        if in_note:
            continue

        # 版式判定：只在进入专题后的第一条内容行上做一次
        if not mode:
            mode = "list" if LIST_ITEM_RE.match(line) else "flat"

        # --- 编号清单（专题 4/5）：`1. linguistic ability(语言能力)`
        if mode == "list":
            mli = LIST_ITEM_RE.match(line)
            if mli:
                group = ensure_group()
                body = mli.group(2).strip()
                mz = TERM_ZH_RE.match(body)
                if mz:
                    group["items"].append(
                        {
                            "terms": [{"term": mz.group(1).strip(), "zh": mz.group(2).strip()}],
                            "senses": [],
                            "meaning": "",
                            "examples": [],
                            "_pages": [page_at[li]],
                        }
                    )
                else:
                    group["items"].append(make_item([body], [], pages=[page_at[li]]))
                continue
            continue

        # --- 扁平同义链（专题 3）：`confused = perplexed = puzzled adj.困惑的`
        if mode == "flat":
            item = parse_flat_line(line, [page_at[li]])
            if item:
                ensure_group()["items"].append(item)
            continue

        # --- 等号链（专题 1/2）
        if mg:                      # 带圈数字条目号，重新起一条链
            flush_chain()
            chain = [mg.group(2).strip()]
            chain_pages = [page_at[li]]
            if chain_complete(chain):
                flush_chain()
            continue

        if "=" in line:
            chain.append(line.lstrip("= ").strip())
            chain_pages.append(page_at[li])
            if chain_complete(chain):
                flush_chain()
            continue

        if chain and not chain_complete(chain):
            chain.append(line)      # 双栏换行把一条链（含注记）拆到了两行
            chain_pages.append(page_at[li])
            flush_chain()
            continue

        flush_chain()

    flush_chain()

    for t in topics:
        if not t["groups"]:
            t["groups"].append(
                {"groupName": t["topicName"], "groupLabel": "", "meaning": "", "items": []}
            )

    return topics


CJK_RANGE = "\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef\u3000-\u303f"


def tidy(text: str) -> str:
    """收掉排版在中文之间塞的空格：`刺激/导 致` → `刺激/导致`。

    只删两个汉字之间的空格，中英混排（`critical adj.批判的`）保持原样。
    """
    text = re.sub(r"\s+", " ", text or "").strip()
    prev = None
    while prev != text:
        prev = text
        text = re.sub(rf"(?<=[{CJK_RANGE}]) +(?=[{CJK_RANGE}])", "", text)
    return text


def scrub_detail(item: dict) -> dict:
    out = {
        "term": tidy(item.get("term", "")),
        "phonetic": tidy(item.get("phonetic", "")),
        "senses": [{"pos": x.get("pos", ""), "meaning": tidy(x.get("meaning", ""))} for x in item.get("senses", [])],
    }
    return out


HL_SUFFIXES = ("HL",)


def apply_highlight(out: dict, key: str, text: str, pages, hl) -> None:
    """给 out[key] 配一个 out[key + "HL"] 的分段版本（有命中才写）。"""
    segs = mark_text(text, pages or [], hl)
    if segs:
        out[key + "HL"] = segs


def _scrub_senses(senses: list[dict], hl) -> None:
    for s in senses:
        s["meaning"] = tidy(s.get("meaning", ""))
        apply_highlight(s, "meaning", s["meaning"], s.pop("_pages", None), hl)


def _scrub_examples(examples: list[dict], hl) -> None:
    for ex in examples:
        pages = ex.pop("_pages", None)
        for field in ("headword", "source", "sentence", "translation", "article", "question"):
            ex[field] = tidy(ex.get(field, ""))
            apply_highlight(ex, field, ex[field], pages, hl)
        for opt in ex.get("options", []):
            opt["text"] = tidy(opt.get("text", ""))
            apply_highlight(opt, "text", opt["text"], pages, hl)


def scrub(payload: dict, hl: dict[str, dict[int, list[str]]] | None = None) -> dict:
    """把树里所有中文释义统一 tidy 一段、标上黄色高亮，并归一化详解条目的形状。

    高亮必须在这里标、而不是解析时标：`tidy()` 会改字符串（收掉中文之间的空格），
    先标后 tidy 的话偏移就全错了。
    """
    hl = hl or {}
    up = hl.get("vocab-upper", {})
    lo = hl.get("vocab-lower", {})

    for w in payload["units"]:
        _scrub_senses(w["senses"], up)
        for key in ("derivatives", "synonyms", "antonyms", "phrases", "extensions"):
            # 头部那行是光秃秃的词表（字符串），右栏详解是带音标和中文的条目。
            # 统一成 DetailItem，缺的就留空 —— 前端不用为两种形状写分支。
            shaped = []
            for x in w.get(key, []):
                if isinstance(x, str):
                    shaped.append({"term": clean_term(tidy(x)), "phonetic": "", "senses": [], "_pages": None})
                else:
                    d = scrub_detail(x)
                    d["_pages"] = x.get("_pages")
                    shaped.append(d)
            # 去重并丢掉空词
            # 同一条词表里可能有「光词表」和「带音标中文的详解」两份，同词保留更全的
            merged: dict[str, dict] = {}
            for item in shaped:
                if not item["term"]:
                    continue
                k2 = item["term"].lower()
                prev = merged.get(k2)
                if prev is None:
                    merged[k2] = item
                    continue
                if len(item["senses"]) > len(prev["senses"]) or (
                    item["senses"] == prev["senses"] and len(item["phonetic"]) > len(prev["phonetic"])
                ):
                    merged[k2] = item
            w[key] = list(merged.values())
            for item in w[key]:
                pages = item.pop("_pages", None)
                apply_highlight(item, "term", item["term"], pages, up)
                _scrub_senses(item["senses"], up)
        w["word"] = tidy(w["word"])
        w["unitName"] = tidy(w["unitName"] or "")
        _scrub_examples(w.get("examples", []), up)
        w["unitIntro"] = tidy(w.get("unitIntro", "") or UNIT_INTROS.get(w["unitName"], ""))

    for t in payload["topics"]:
        t["topicName"] = tidy(t["topicName"])
        for g in t["groups"]:
            g["groupName"] = tidy(g["groupName"])
            g["groupLabel"] = tidy(g.get("groupLabel", ""))
            g["meaning"] = tidy(g.get("meaning", ""))
            for it in g["items"]:
                pages = it.pop("_pages", None)
                it["meaning"] = tidy(it.get("meaning", ""))
                apply_highlight(it, "meaning", it["meaning"], pages, lo)
                for term in it["terms"]:
                    term["term"] = tidy(term["term"])
                    term["zh"] = tidy(term["zh"])
                    if mark_term(term, pages or [], lo):
                        term["mark"] = True
                _scrub_senses(it.get("senses", []), lo)
                _scrub_examples(it.get("examples", []), lo)
    return payload


def emit_ts(payload: dict, path: Path) -> None:
    """把数据写成 TS 模块。类型和数据放一起，`wordbooks.ts` 再包一层查询助手，
    这样不会出现 data ↔ types 的循环引用。"""
    def arr(items: list) -> str:
        rows = ",\n".join("  " + json.dumps(x, ensure_ascii=False) for x in items)
        return "[\n" + rows + "\n]"

    body = f"""/**
 * 自动生成，**请勿手改**。
 *
 * 数据来源：用户提供的《六级核心词汇》上册 / 下册原件（PDF）。
 * 重新生成：python3 scripts/extract-highlights.py && python3 scripts/parse-wordbooks.py
 *
 * 上册 = {len(payload['units'])} 个词条，按 Unit 主题分组，含真题例句与双语词表。
 * 下册 = {len(payload['topics'])} 个专题的同义替换 / 短语。
 *
 * `unitIntro` 是本应用写的导读，**原书没有这段文字**，别当成书里的内容。
 *
 * `*HL` 字段是原书的**黄色高亮标注**（PDF 里的 /Highlight 注解），切成了
 * 分段数组。约定：拼回 `segments.map(s => s.text).join("")` 必须等于同名
 * 的纯文本字段；`mark` 为 true 的片段是书上标黄的部分。
 * 一个高亮都没命中时字段整个不写。
 */

/** 带高亮的富文本片段 */
export interface Marked {{
  text: string;
  mark?: true;
}}

export interface WordSense {{
  pos: string;
  phonetic: string;
  meaning: string;
  meaningHL?: Marked[];
}}

/** 右栏详解条目：近义词 / 派生词 / 词组，都带音标和中文 */
export interface DetailItem {{
  term: string;
  phonetic: string;
  senses: {{ pos: string; meaning: string; meaningHL?: Marked[] }}[];
  termHL?: Marked[];
}}

/** 真题例句 */
export interface WordExample {{
  headword: string;
  /** 原书标注的出处，如 `2023 年六级仔细阅读`；空串表示原书没标 */
  source: string;
  sentence: string;
  /** 拼不完整的译文会被丢掉，这里记下来，界面上就不用假装有 */
  translation: string;
  translationComplete: boolean;
  /** 下册那种「文章 + 题目 + 选项」形态 */
  article: string;
  question: string;
  options: {{ label: string; text: string; textHL?: Marked[] }}[];
  sentenceHL?: Marked[];
  translationHL?: Marked[];
  articleHL?: Marked[];
  questionHL?: Marked[];
  headwordHL?: Marked[];
  sourceHL?: Marked[];
}}

export interface WordbookEntry {{
  word: string;
  senses: WordSense[];
  unitNo: number;
  unitName: string;
  unitIntro: string;
  derivatives: DetailItem[];
  synonyms: DetailItem[];
  antonyms: DetailItem[];
  phrases: DetailItem[];
  extensions: DetailItem[];
  examples: WordExample[];
}}

export interface SynonymTerm {{
  term: string;
  zh: string;
  /** 原书把整个 `claim(声称)` 标黄了 —— 这一条就是书上认的同义替换重点 */
  mark?: true;
}}

export interface SynonymItem {{
  terms: SynonymTerm[];
  senses: {{ pos: string; meaning: string; meaningHL?: Marked[] }}[];
  /** 整条链的意思（书上把注记写在链尾时）*/
  meaning: string;
  /** 原书给这条表达配的真题例句 */
  examples: WordExample[];
  meaningHL?: Marked[];
}}

export interface WordbookGroup {{
  groupName: string;
  groupLabel: string;
  meaning: string;
  items: SynonymItem[];
}}

export interface WordbookTopic {{
  topicNo: number;
  topicName: string;
  groups: WordbookGroup[];
}}

export const WORDBOOK_UNITS: WordbookEntry[] = {arr(payload['units'])};

export const WORDBOOK_TOPICS: WordbookTopic[] = {arr(payload['topics'])};
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body, encoding="utf-8")


def main() -> int:
    hl = load_highlights()
    payload = scrub(
        {
            "source": {
                "upper": "六级核心词汇 · 上册",
                "lower": "六级核心词汇 · 下册",
            },
            "units": parse_upper(load(UPPER), hl.get("vocab-upper")),
            "topics": parse_lower(load(LOWER), hl.get("vocab-lower")),
        },
        hl,
    )
    upper, lower = payload["units"], payload["topics"]

    def hl_count(node) -> int:
        if isinstance(node, dict):
            return sum(1 for k, v in node.items() if k.endswith("HL") and v) + sum(hl_count(v) for v in node.values())
        if isinstance(node, list):
            return sum(hl_count(v) for v in node)
        return 0

    marked_terms = sum(
        1
        for t in lower
        for g in t["groups"]
        for it in g["items"]
        for term in it["terms"]
        if term.get("mark")
    )
    hl_ex = sum(
        1
        for w in upper
        for ex in w.get("examples", [])
        if ex.get("sentenceHL")
    ) + sum(
        1
        for t in lower
        for g in t["groups"]
        for it in g["items"]
        for ex in it.get("examples", [])
        if ex.get("sentenceHL")
    )
    print(
        f"高亮：{sum(hl_count(payload['units']) + hl_count(payload['topics']) for _ in [0])} 段标注，"
        f"{marked_terms} 个同义替换重点词，{hl_ex} 条例句带高亮"
    )

    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    emit_ts(payload, Path("src/lib/wordbooks.data.ts"))

    print(f"上册：{len(upper)} 个词条")
    by_unit: dict[int, int] = {}
    for w in upper:
        by_unit[w["unitNo"]] = by_unit.get(w["unitNo"], 0) + 1
    for k in sorted(by_unit):
        name = next(w["unitName"] for w in upper if w["unitNo"] == k)
        print(f"  Unit {k:>2} {name:<6} {by_unit[k]:>2} 词")
    print(f"  多词性词条：{sum(1 for w in upper if len(w['senses']) > 1)}")
    for field, label in [
        ("synonyms", "近义词"), ("antonyms", "反义词"), ("phrases", "词组"),
        ("derivatives", "派生词"), ("extensions", "拓展词"),
    ]:
        print(f"  带{label}：{sum(1 for w in upper if w[field])}")

    print(f"\n下册：{len(lower)} 个专题")
    for t in lower:
        cnt = sum(len(g["items"]) for g in t["groups"])
        print(f"  专题 {t['topicNo']} {t['topicName']:<6} {len(t['groups'])} 组 / {cnt} 条")
        for g in t["groups"]:
            label = f"（{g['groupLabel']}）" if g["groupLabel"] else ""
            mean = f"【{g['meaning']}】" if g["meaning"] else ""
            print(f"      · {g['groupName']}{label}{mean}: {len(g['items'])} 条")

    leftover = [
        (t["topicNo"], g["groupName"])
        for t in lower for g in t["groups"] if not g["items"]
    ]
    if leftover:
        print(f"\n⚠️ 空分组（解析未覆盖）：{leftover}")

    print(f"\n写出 → {OUT}")
    print("写出 → src/lib/wordbooks.data.ts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
