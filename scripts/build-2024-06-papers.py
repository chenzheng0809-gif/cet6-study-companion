#!/usr/bin/env python3
"""
把 2024-06 三套真题的解析结果生成成 src/lib/papers/ 下的 TS 数据文件。

输入：
  /tmp/cet6-2024-06/parsed/set{N}.json        真题 PDF 解析（选项、阅读原文、写作题面、翻译原文）
  /tmp/cet6-2024-06/parsed/key-set{N}.json     答案速查解析（答案、写作范文、翻译参考译文）
  /tmp/cet6-2024-06/parsed/transcripts.json    听力转写（原文句子、录音里念出的题干）
  /tmp/cet6-2024-06/parsed/anno-set{N}.json    逐题解析与原文依据句
  /tmp/cet6-2024-06/audio/set{N}-timing.json   答题停顿检测（单元窗口）
  /tmp/cet6-2024-06/audio/set{N}-start.json    第一段对话的起点

生成：
  src/lib/papers/2024-06-set{N}.listening.ts
  src/lib/papers/2024-06-set{N}.reading.ts
  src/lib/papers/2024-06-set{N}.writing.ts

每一条写进去的内容都要能在上面这些文件里找到出处：
选项来自真题 PDF、答案来自答案速查、听力原文来自录音转写、
解析与依据句由人工依据原文撰写（生成前会逐条校验依据句确实是原文子串）。
"""
import json
import os
import re
import sys

PARSED = "/tmp/cet6-2024-06/parsed"
AUDIO = "/tmp/cet6-2024-06/audio"
OUT = "/Users/chen/Documents/minimax/src/lib/papers"

LISTENING_GROUPS = [(1, 4), (5, 8), (9, 11), (12, 15), (16, 18), (19, 21), (22, 25)]
LISTENING_SECTIONS = ["A", "A", "B", "B", "C", "C", "C"]
UNIT_IDS = ["l-c1", "l-c2", "l-b1", "l-b2", "l-r1", "l-r2", "l-r3"]
UNIT_LABELS = [
    "Conversation One",
    "Conversation Two",
    "Passage One",
    "Passage Two",
    "Recording One",
    "Recording Two",
    "Recording Three",
]
UNIT_PREFIX = ["c1", "c2", "b1", "b2", "r1", "r2", "r3"]

# 各段的中文标题：按录音/原文的实际内容写的，不是从别处抄的
UNIT_LABELS_ZH = {
    1: [
        "对话一 · 一桩要划掉中东市场的赞助合同",
        "对话二 · 丹佛天文台与一颗回归的彗星",
        "短文一 · 超加工食品该不该被提醒",
        "短文二 · 限制为什么能逼出创造力",
        "讲座一 · 应对冲突的五种风格",
        "讲座二 · 给 150 万个物种做基因图谱",
        "讲座三 · 哥白尼革命之后的世界观",
    ],
    2: [
        "对话一 · 一台果汁机和厨房小家电",
        "对话二 · 村长眼中的村庄改造",
        "短文一 · 能弯曲、爬行、跳跃的微型机器人",
        "短文二 · 能马拉松式睡觉的人",
        "讲座一 · 童年的体罚记忆与信念改变",
        "讲座二 · 美国母亲节与「母亲」这个词",
        "讲座三 · 室内空气与绿植到底有多大用",
    ],
}

SECTION_LABELS_ZH = {
    1: {
        "r-a": "选词填空 · 古典音乐与大脑",
        "r-b": "长篇阅读 · 那棵拥有自己的树",
        "r-c1": "仔细阅读 · 没人愿意出手相助的时候",
        "r-c2": "仔细阅读 · 核能：环保派与实用派的分歧",
    },
    2: {
        "r-a": "选词填空 · 读一本小说的感受",
        "r-b": "长篇阅读 · 想改掉坏习惯，别做这些",
        "r-c1": "仔细阅读 · 真人秀如何固化美国梦",
        "r-c2": "仔细阅读 ·「没有工作，我不知道我是谁」",
    },
    3: {
        "r-a": "选词填空 · 彩虹是怎么形成的",
        "r-b": "长篇阅读 · 别把宝贵时间耗在无效会议上",
        "r-c1": "仔细阅读 · 讽刺：敌意披着幽默的外衣",
        "r-c2": "仔细阅读 · 变异性与学习",
    },
}

# 词库的词性与词义：按每个词在原文里的实际用法标注（不是解析册原文，解析册不存在）
BANK_POS_ZH = {
    1: {
        "A": ("v.", "减轻；缓解"),
        "B": ("n.", "清晰；明确"),
        "C": ("adj.", "认知的"),
        "D": ("n.", "作曲家（复数）"),
        "E": ("v.", "伤害；损害"),
        "F": ("adj.", "起抑制作用的"),
        "G": ("n.", "审问；盘问"),
        "H": ("adv.", "本质上；内在地"),
        "I": ("v.", "释放；松开"),
        "J": ("adj.", "雄伟的；庄严的"),
        "K": ("adj.", "强制的；义务的"),
        "L": ("v.", "恢复；康复"),
        "M": ("adv.", "显著地"),
        "N": ("adj.", "舒缓的；令人平静的"),
        "O": ("n.", "病房；病区"),
    },
    2: {
        "A": ("v.", "喜爱；很看重"),
        "B": ("v.", "评估；估价"),
        "C": ("n.", "攻击；袭击"),
        "D": ("n.", "化学；化学反应"),
        "E": ("n.", "巧合"),
        "F": ("n.", "裂缝；裂痕"),
        "G": ("v.", "被驱逐出境"),
        "H": ("v.", "驳回；不予考虑"),
        "I": ("adv.", "非法地"),
        "J": ("adj.", "失去的；沉浸其中的"),
        "K": ("adv.", "永远地；持续地"),
        "L": ("v.", "规定；开处方"),
        "M": ("adj.", "精明的"),
        "N": ("adj.", "怀疑的"),
        "O": ("v.", "努力；力争"),
    },
    3: {
        "A": ("v.", "弹回；反弹"),
        "B": ("adv.", "完全地"),
        "C": ("n.", "色散；分散"),
        "D": ("adj.", "古怪的；异乎寻常的"),
        "E": ("adj.", "悬挂的"),
        "F": ("adj.", "光的；视觉的"),
        "G": ("v.", "起源于；发端于"),
        "H": ("v.", "察觉；感知"),
        "I": ("v.", "渗透；弥漫"),
        "J": ("v.", "思考；斟酌"),
        "K": ("adj.", "在前的；先行的"),
        "L": ("adv.", "鲁莽地；不顾后果地"),
        "M": ("n.", "关系"),
        "N": ("n.", "光谱；范围"),
        "O": ("v.", "位于；立着"),
    },
}

# 写作审题：依据卷面 Directions 与答案速查里的参考范文结构写的
WRITING_BRIEF = {
    1: "题目要求以「There is a growing awareness of the importance of digital literacy and skills in today's world.」这句原话开篇，写一篇 150–200 词的短文。两件事必须做到：一是开头那句一字不改地抄下来，二是全篇写满 150 词、不超过 200 词。参考范文走的是「先亮明观点 → 分两层论证（学生 / 职场）→ 收尾回到学习、工作与生活」的路子：先说数字素养对谁都重要，再用「For one thing / For another / Moreover」把理由铺开，最后用 To sum up 收口。",
    2: "题目要求以「Nowadays more and more college students have come to realize social practice and academic learning are equally important.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先摆出两种立场 → 表明自己站哪边 → 用 Firstly / Secondly / Lastly 分三层论证 → All in all 收尾」的路子。",
    3: "题目要求以「Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先接住题面 → On the one hand / On the other hand 两面论证（动机与自律 / 适应力与批判性思维）→ To sum up 收尾」的路子。",
}

# ----------------------------------------------------------------- 小工具


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def ts(s: str) -> str:
    """写成 TS 字符串字面量：长文本用反引号保留换行，短文本用双引号。"""
    if "\n" in s:
        return "`" + s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"
    return json.dumps(s, ensure_ascii=False)


def load(name: str):
    with open(os.path.join(PARSED, name)) as fh:
        return json.load(fh)


def fail(msg: str) -> None:
    raise SystemExit(f"生成中止：{msg}")


# --------------------------------------------------------------- 听力部分

MARKER_RE = re.compile(r"(?i)^(conversation|passage|recording)\s*(one|two|three|1|2|3)\b[.:]?\s*")


def content_sentences(sentences: list[dict]) -> list[dict]:
    """
    从转写里取出「这一段的正文」。

    转写里还有 Section 的 Directions、「Questions N to M are based on ...」的
    播报，以及各题题干 —— 那些不属于这一段的原文，只取正文。
    """
    start = 0
    for i, s in enumerate(sentences):
        text = s["en"].strip()
        if re.match(r"(?i)^section\b", text):
            continue
        if MARKER_RE.match(text):
            start = i
            break
    end = len(sentences)
    for i in range(start, len(sentences)):
        if "are based on the" in sentences[i]["en"]:
            end = i
            break
    out = []
    for s in sentences[start:end]:
        text = s["en"]
        m = MARKER_RE.match(text.strip())
        if m:
            rest = text.strip()[m.end() :].strip()
            if not rest:
                continue
            text = rest
        out.append({**s, "en": text})
    return out


def build_listening(setno: int, paper: dict, key: dict, anno: dict, transcripts: dict, timing: dict, start_sec: float):
    pauses = timing["pauses"]
    groups = []
    idx = 0
    for count in [hi - lo + 1 for lo, hi in LISTENING_GROUPS]:
        groups.append(pauses[idx : idx + count])
        idx += count
    if idx != len(pauses):
        fail(f"set{setno} 停顿数 {len(pauses)} 与题量不符")

    units = []
    questions = []
    for gi, (lo, hi) in enumerate(LISTENING_GROUPS):
        uid = UNIT_IDS[gi]
        prefix = UNIT_PREFIX[gi]
        g = groups[gi]
        window_start = start_sec if gi == 0 else groups[gi - 1][-1]["endSec"]
        window_end = g[0]["startSec"]
        stems_end = g[-1]["endSec"]

        tr_unit = transcripts[f"unit{gi + 1}"]
        sentences = content_sentences(tr_unit["sentences"])
        # 讲座/讲话是独白，统一记成 N（旁白）
        if LISTENING_SECTIONS[gi] == "C":
            sentences = [{**s, "speaker": "N"} for s in sentences]

        stems = {int(k): v for k, v in tr_unit["stems"].items()}
        # 依据句 → 定位句（marks）
        # 注意：这里的句子 id 要用本文件新生成的（prefix-序号），
        # 不能用转写文件里的原 id —— 两套编号不一样，marks 会全部落空。
        marks_by_index: dict[int, list[int]] = {}
        for q in range(lo, hi + 1):
            a = anno["listening"][str(q)]
            ev = norm(a["evidence"])
            hit = None
            for i, sent in enumerate(sentences):
                if ev and ev in norm(sent["en"]):
                    hit = i
                    break
            if hit is None:
                fail(f"set{setno} Q{q} 的依据句在转写里找不到：{a['evidence'][:70]}")
            marks_by_index.setdefault(hit, []).append(q)

        transcript = []
        for i, sent in enumerate(sentences):
            marks = marks_by_index.get(i)
            transcript.append(
                {
                    "id": f"{prefix}-{i + 1}",
                    "speaker": sent.get("speaker"),
                    "en": sent["en"],
                    **({"marks": sorted(marks)} if marks else {}),
                }
            )

        units.append(
            {
                "id": uid,
                "label": UNIT_LABELS[gi],
                "labelZh": UNIT_LABELS_ZH[setno][gi],
                "section": LISTENING_SECTIONS[gi],
                "questionRange": [lo, hi],
                "window": {"startSec": window_start, "endSec": window_end},
                "stemsWindow": {
                    "startSec": window_end,
                    "endSec": stems_end,
                    "questions": list(range(lo + 1, hi + 1)),
                },
                "transcript": transcript,
            }
        )

        for q in paper["listening"][gi]["questions"]:
            n = q["n"]
            a = anno["listening"][str(n)]
            questions.append(
                {
                    "n": n,
                    "unitId": uid,
                    "stem": stems.get(n, ""),
                    "options": [
                        {"key": k, "en": q["options"][k]}
                        for k in ("A", "B", "C", "D")
                    ],
                    "answer": key[str(n)],
                    "evidence": a["evidence"],
                    "explain": a["explain"],
                }
            )

    # 题干必须来自录音；录音里念过的每一题都要有题干
    for q in questions:
        if not q["stem"]:
            fail(f"set{setno} 听力 Q{q['n']} 在录音里没找到题干")
    return units, questions


# --------------------------------------------------------------- 阅读部分


def build_reading(setno: int, paper: dict, key: dict, anno: dict):
    reading = paper["reading"]
    sections = []
    questions = []

    # ---- Section A 选词填空 ----
    bank_words = []
    for w in reading["bank"]["words"]:
        pos, zh = BANK_POS_ZH[setno][w["key"]]
        bank_words.append({"key": w["key"], "word": w["word"], "pos": pos, "zh": zh})
    sections.append(
        {
            "id": "r-a",
            "label": "Section A",
            "labelZh": SECTION_LABELS_ZH[setno]["r-a"],
            "kind": "bank",
            "questionRange": [26, 35],
            "paragraphs": [{"label": "", "en": reading["bank"]["passage"]}],
            "bank": bank_words,
        }
    )
    for n in range(26, 36):
        a = anno["reading"][str(n)]
        questions.append(
            {
                "n": n,
                "unitId": "r-a",
                "stem": "{{%d}}" % n,
                "options": [],
                "answer": key[str(n)],
                "evidence": a["evidence"],
                "explain": a["explain"],
            }
        )

    # ---- Section B 长篇匹配 ----
    matching = reading["matching"]
    sections.append(
        {
            "id": "r-b",
            "label": "Section B",
            "labelZh": SECTION_LABELS_ZH[setno]["r-b"],
            "kind": "matching",
            "questionRange": [36, 45],
            "paragraphs": [{"label": p["label"], "en": p["text"]} for p in matching["paragraphs"]],
        }
    )
    for st in matching["statements"]:
        n = st["n"]
        a = anno["reading"][str(n)]
        questions.append(
            {
                "n": n,
                "unitId": "r-b",
                "stem": st["text"],
                "options": [],
                "answer": key[str(n)],
                "evidence": a["evidence"],
                "explain": a["explain"],
            }
        )

    # ---- Section C 仔细阅读 ----
    for i, det in enumerate(reading["detail"]):
        sid = f"r-c{i + 1}"
        sections.append(
            {
                "id": sid,
                "label": det["title"],
                "labelZh": SECTION_LABELS_ZH[setno][sid],
                "kind": "detail",
                "questionRange": [det["lo"], det["hi"]],
                "paragraphs": [{"label": "", "en": det["passage"]}],
            }
        )
        for q in det["questions"]:
            n = q["n"]
            a = anno["reading"][str(n)]
            questions.append(
                {
                    "n": n,
                    "unitId": sid,
                    "stem": q["stem"],
                    "options": [{"key": k, "en": q["options"][k]} for k in ("A", "B", "C", "D")],
                    "answer": key[str(n)],
                    "evidence": a["evidence"],
                    "explain": a["explain"],
                }
            )

    return sections, questions


# ------------------------------------------------------- 依据句必须是原文

def check_evidence(setno: int, paper: dict, anno: dict, transcripts: dict, key: dict) -> list[str]:
    errs: list[str] = []
    reading = paper["reading"]
    # 听力：依据句必须在转写里
    unit_of = {}
    for gi, (lo, hi) in enumerate(LISTENING_GROUPS):
        for n in range(lo, hi + 1):
            unit_of[n] = f"unit{gi + 1}"
    for n in range(1, 26):
        if n not in anno.get("listening", {}):
            continue
        ev = norm(anno["listening"][str(n)]["evidence"])
        pool = [s["en"] for s in transcripts[unit_of[n]]["sentences"]]
        if not any(ev in norm(p) for p in pool):
            errs.append(f"set{setno} 听力 Q{n} 依据句不在转写里")
    bank = norm(reading["bank"]["passage"])
    for n in range(26, 36):
        a = anno["reading"].get(str(n))
        if not a:
            errs.append(f"set{setno} 选词填空 Q{n} 缺解析")
            continue
        if norm(a["evidence"]) not in bank:
            errs.append(f"set{setno} 选词填空 Q{n} 依据句不在原文里")
        if "语法判断" not in a["explain"] or "语义判断" not in a["explain"]:
            errs.append(f"set{setno} 选词填空 Q{n} 解析缺 语法判断/语义判断 两段")
    paras = {p["label"]: norm(p["text"]) for p in reading["matching"]["paragraphs"]}
    for st in reading["matching"]["statements"]:
        n = st["n"]
        a = anno["reading"].get(str(n))
        if not a:
            errs.append(f"set{setno} 长篇匹配 Q{n} 缺解析")
            continue
        lbl = key[str(n)]
        if norm(a["evidence"]) not in paras.get(lbl, ""):
            errs.append(f"set{setno} 长篇匹配 Q{n} 依据句不在答案段落 {lbl} 里")
    for det in reading["detail"]:
        text = norm(det["passage"])
        for q in det["questions"]:
            n = q["n"]
            a = anno["reading"].get(str(n))
            if not a:
                errs.append(f"set{setno} 仔细阅读 Q{n} 缺解析")
                continue
            if norm(a["evidence"]) not in text:
                errs.append(f"set{setno} 仔细阅读 Q{n} 依据句不在原文里")
    return errs


# ------------------------------------------------------------------- 输出


def ts_object(obj, indent: str) -> str:
    """把 dict/list 写成 TS 字面量（字符串用 ts() 处理）。"""
    pad = indent
    inner = indent + "  "
    if isinstance(obj, dict):
        if not obj:
            return "{}"
        items = []
        for k, v in obj.items():
            key = k if re.fullmatch(r"[A-Za-z_$][\w$]*", k) else json.dumps(k)
            items.append(f"{inner}{key}: {ts_object(v, inner)},")
        return "{\n" + "\n".join(items) + f"\n{pad}}}"
    if isinstance(obj, list):
        if not obj:
            return "[]"
        if all(isinstance(x, (str, int, float, bool)) or x is None for x in obj):
            return "[" + ", ".join(ts(x) if isinstance(x, str) else json.dumps(x) for x in obj) + "]"
        items = [f"{inner}{ts_object(x, inner)}," for x in obj]
        return "[\n" + "\n".join(items) + f"\n{pad}]"
    if isinstance(obj, str):
        return ts(obj)
    return json.dumps(obj, ensure_ascii=False)


def write(path: str, content: str) -> None:
    with open(path, "w") as fh:
        fh.write(content)
    print(f"  写出 {os.path.relpath(path, '/Users/chen/Documents/minimax')}（{len(content)} 字节）")


def main() -> None:
    setnos = [int(x) for x in (sys.argv[1:] or ["1", "2", "3"])]
    all_transcripts = load("transcripts.json")

    for setno in setnos:
        paper = load(f"set{setno}.json")
        key_raw = load(f"key-set{setno}.json")
        key = key_raw["answers"]
        anno = load(f"anno-set{setno}.json")
        transcripts = all_transcripts.get(f"set{setno}", {})

        errs = check_evidence(setno, paper, anno, transcripts, key)
        if errs:
            for e in errs[:20]:
                print(f"  ✗ {e}")
            fail(f"set{setno} 依据句校验没过 {len(errs)} 条")

        print(f"set{setno} 依据句校验通过 ✓")

        # ---------------- 听力 ----------------
        if paper["listening"]:
            timing = json.load(open(os.path.join(AUDIO, f"set{setno}-timing.json")))
            start_info = json.load(open(os.path.join(AUDIO, f"set{setno}-start.json")))
            units, lq = build_listening(
                setno, paper, key, anno, transcripts, timing, start_info["startSec"]
            )
            header = f"""import type {{ ListeningUnit, Question }} from "./types";

/**
 * 2024 年 06 月六级 · 第 {setno} 套 · Part II Listening Comprehension
 *
 * 选项来自《2024年06月大学英语六级考试真题（第{setno}套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第{setno}套）》PDF（用户提供）。
 *
 * 卷面不印听力题干 —— 2024 年起六级听力只印 A–D 选项，题干只在录音里念出来。
 * 所以这里的 stem 全部取自录音转写，是录音里真实读过的那句话。
 *
 * 听力原文是录音的机器转写（listen_audio），可能有极少数识别误差；
 * 单元窗口来自对同一段 MP3 的静音能量分析，答题停顿固定在 13.3–13.8 秒，
 * 全卷检出 25 个，与卷面 25 道题一一对应。
 */
"""
            body = "\nexport const LISTENING_UNITS: ListeningUnit[] = " + ts_object(units, "") + ";\n"
            body += "\nexport const LISTENING_QUESTIONS: Question[] = " + ts_object(lq, "") + ";\n"
            write(os.path.join(OUT, f"2024-06-set{setno}.listening.ts"), header + body)

        # ---------------- 阅读 ----------------
        sections, rq = build_reading(setno, paper, key, anno)
        header = f"""import type {{ Question, ReadingSection }} from "./types";

/**
 * 2024 年 06 月六级 · 第 {setno} 套 · Part III Reading Comprehension
 *
 * 原文、题干、选项来自《2024年06月大学英语六级考试真题（第{setno}套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第{setno}套）》PDF（用户提供）。
 *
 * 这一套没有解析册：逐题解析与原文依据句由本项目依据真题原文撰写，
 * 每条依据句都逐字取自上面的原文，不是别处的措辞。
 * 中文标题也是按原文内容写的，不是从别处抄的。
 */
"""
        body = "\nexport const READING_SECTIONS: ReadingSection[] = " + ts_object(sections, "") + ";\n"
        body += "\nexport const READING_QUESTIONS: Question[] = " + ts_object(rq, "") + ";\n"
        write(os.path.join(OUT, f"2024-06-set{setno}.reading.ts"), header + body)

        # ---------------- 写作 / 翻译 ----------------
        header = f"""import type {{ TranslationTask, WritingTask }} from "./types";

/**
 * 2024 年 06 月六级 · 第 {setno} 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第{setno}套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写，
 * 不含「译点精析」「范文点评」这类解析册才有的内容 —— 没有就不写。
 */
"""
        writing = {
            "prompt": paper["writing"]["prompt"],
            "minWords": 150,
            "maxWords": 200,
            "brief": WRITING_BRIEF[setno],
            "sampleEssay": key_raw["essay"],
        }
        translation = {"zh": paper["translation"]["zh"], "reference": key_raw["reference"]}
        body = "\nexport const WRITING: WritingTask = " + ts_object(writing, "") + ";\n"
        body += "\nexport const TRANSLATION: TranslationTask = " + ts_object(translation, "") + ";\n"
        write(os.path.join(OUT, f"2024-06-set{setno}.writing.ts"), header + body)


if __name__ == "__main__":
    main()
