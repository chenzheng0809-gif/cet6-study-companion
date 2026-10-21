"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getReadingSection, readingKindTitle } from "@/lib/papers";
import { POS_ORDER, markedCount, samePosSiblings, splitExplain } from "@/lib/papers/bank";
import { partLimitSec, unitsOfPart } from "@/lib/papers/exam-clock";
import type { Paper, ReadingSection } from "@/lib/papers/types";
import { Collapsible, LockedPanel, PartSessionBar } from "@/components/paper/exam-shell";
import { CompactOption, QuestionBlock, sectionOptions } from "@/components/paper/parts";
import { TappableText } from "@/components/paper/tappable-text";
import { VocabSheet, type VocabSeed } from "@/components/paper/vocab-sheet";
import { usePaperAttempt } from "@/components/paper/use-attempt";

/**
 * 一个阅读题段的全部内容：计时条 + 原文 + 作答 + 交卷后才解锁的译文与解析。
 *
 * 和听力一样独立成组件：深链 /papers/{paperId}/reading/{sectionId} 与真题页的
 * 左右滑动共用这一份，沉浸锁不会因为入口不同而走样。外层容器负责 px-5 的留白。
 *
 * 三类题段的作答形态完全不同，这里按 kind 分开处理：
 *
 * - **bank（选词填空）**：题就是原文里那些空。点一下空格选中，再点词库里的
 *   选项填进去。不再往下摆十张每张带十五个选项的题卡 —— 那是十乘十五个按钮。
 * - **matching（长篇阅读）**：题干选段落标签 A–P，答案在原文里找。
 * - **detail（仔细阅读）**：常规四选一。
 *
 * 记生词统一走「在原文里点那个词」，不再每题挂一个按钮。
 */
export function ReadingSectionSegment({
  paper,
  section,
  headingLevel = 2,
  showSiblings = true,
}: {
  paper: Paper;
  section: ReadingSection;
  /** 深链页传 1，滑动浏览里嵌在 Part 里传 2 */
  headingLevel?: 1 | 2;
  /** 滑动浏览里已经有 chip 行做跳转，不用再塞一份"其他题段" */
  showSiblings?: boolean;
}) {
  const { answers, revealed, sessionOf, isSubmitted, setAnswer, clearAnswer, placeAnswer, markPos, posMarks, revealMany, startSession, submitSession, finishUnit, reset } =
    usePaperAttempt(paper.id);
  const [vocabSeed, setVocabSeed] = useState<VocabSeed | null>(null);
  /** 选词填空：当前选中的是哪一个空，等着被词库里的选项填上 */
  const [activeBlank, setActiveBlank] = useState<number | null>(null);
  /** 选词填空：当前正在自己标词性的那个备选词（null = 没在标） */
  const [marking, setMarking] = useState<string | null>(null);

  const questions = useMemo(
    () =>
      paper.questions.filter(
        (q) => q.n >= section.questionRange[0] && q.n <= section.questionRange[1],
      ),
    [paper, section],
  );

  const Title = headingLevel === 1 ? "h1" : "h2";
  const session = sessionOf("reading");
  const submitted = isSubmitted("reading");
  const questionNos = questions.map((q) => q.n);
  const answeredCount = questions.filter((q) => answers[q.n]).length;
  const correct = questions.filter((q) => answers[q.n] && answers[q.n] === q.answer).length;
  const options = sectionOptions(section);
  const others = showSiblings
    ? unitsOfPart(paper, "reading").filter((id) => id !== section.id)
    : [];

  const isBank = section.kind === "bank";

  const answerKeyOf = useMemo(() => {
    const m = new Map<number, string>();
    for (const q of questions) m.set(q.n, q.answer);
    return m;
  }, [questions]);

  const wordOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of section.bank ?? []) m.set(b.key, b.word);
    return m;
  }, [section.bank]);

  /** 词库里某个键的词性（解析册那份，交卷后才用得上） */
  const posOfKey = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of section.bank ?? []) if (b.pos) m.set(b.key, b.pos);
    return m;
  }, [section.bank]);

  /** 词库：做题时一个都不藏，全部摆在眼前 */
  const bank = section.bank ?? [];

  /** 这个词库选项现在占着第几个空 */
  const blankOfKey = useMemo(() => {
    const m = new Map<string, number>();
    for (const [n, key] of Object.entries(answers)) {
      if (wordOf.has(key)) m.set(key, Number(n));
    }
    return m;
  }, [answers, wordOf]);

  const submit = async () => {
    await submitSession("reading");
    /* 这一段练完了 —— 真题推荐靠这个换到下一段 / 下一套 */
    await finishUnit(section.id);
    await revealMany(questionNos);
  };

  const restart = async () => {
    await reset();
    window.location.reload();
  };

  /** 在原文里点到哪个词，就收哪个词 —— 学生挑的，不是系统猜的。 */
  const openWord = (word: string) =>
    setVocabSeed({
      word,
      sourcePaperId: paper.id,
      sourceLabel: `${paper.titleEn} · ${readingKindTitle(section.kind)}`,
      sourceHref: `/papers/${paper.id}/reading/${section.id}`,
    });

  const blankState = (n: number): "empty" | "active" | "filled" | "right" | "wrong" => {
    const picked = answers[n];
    if (revealed.includes(n)) {
      if (!picked) return "empty";
      return picked === answerKeyOf.get(n) ? "right" : "wrong";
    }
    if (activeBlank === n) return "active";
    return picked ? "filled" : "empty";
  };

  /** 点空格：空的就选中，已经填了的点一下就删掉（顺手也能重新选）。 */
  const tapBlank = (n: number) => {
    if (submitted) return;
    if (answers[n]) void clearAnswer(n);
    setActiveBlank(n);
  };

  /** 点词库选项：填进当前选中的空。同一个选项只能用一次，占着别处就先挪走。 */
  const tapBank = (key: string) => {
    if (submitted || activeBlank === null) return;
    void placeAnswer(activeBlank, key);
    setActiveBlank(null);
  };

  /** 正在标词性的那个备选词 */
  const markingWord = marking ? bank.find((b) => b.key === marking) : undefined;

  /** 点一个词性：标上，或者取消（再点一次同样的词性就是取消）。 */
  const toggleMark = (key: string, pos: string) => {
    if (submitted) return;
    void markPos(key, posMarks[key] === pos ? null : pos);
  };

  return (
    <>
      <div className="pt-[max(16px,env(safe-area-inset-top))]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-fg-muted">{section.label}</p>
            <Title className="mt-1 text-section font-black tracking-[-0.02em]">
              {readingKindTitle(section.kind)}
            </Title>
          </div>
          {submitted ? (
            <span className="num shrink-0 rounded-pill bg-primary px-2.5 py-1 text-caption font-black shadow-hard-sm">
              {correct}/{questions.length}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-2">
        <PartSessionBar
          part="reading"
          session={session}
          answered={answeredCount}
          total={questions.length}
          onStart={() => startSession("reading", partLimitSec("reading"))}
          onSubmit={submit}
          onRestart={restart}
        />

        {/*
          原文做题时必须一直看得见，所以不折叠；
          但要压住高度、让它内部滚动，页面就不会被一整篇文章顶下去。
        */}
        <article className="rounded-card bg-surface p-4 shadow-hard-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow text-fg-muted">
              PASSAGE · 第 {section.questionRange[0]}–{section.questionRange[1]} 题
            </p>
            {isBank ? (
              <span className="num shrink-0 rounded-pill bg-surface-2 px-2.5 py-1 text-eyebrow font-black text-fg-muted">
                已填 {answeredCount}/{questions.length}
              </span>
            ) : (
              <span className="rounded-pill bg-surface-2 px-2.5 py-1 text-eyebrow font-bold text-fg-muted">
                可上下滑动
              </span>
            )}
          </div>

          <div className="scroll-fade mt-3 max-h-[38vh] overflow-y-auto overscroll-contain pr-1 text-body leading-[1.75]">
            <div className="grid gap-3">
              {(section.paragraphs ?? []).map((p, i) => (
                <div key={`${p.label}-${i}`} className="flex gap-3">
                  {p.label ? (
                    <span className="num mt-px grid size-6 shrink-0 place-items-center rounded-pill bg-fg text-eyebrow font-black text-bg">
                      {p.label}
                    </span>
                  ) : null}
                  <p className="min-w-0 flex-1">
                    <PassageText
                      text={p.en}
                      onWord={openWord}
                      renderBlank={(n) => (
                        <BlankSlot
                          n={n}
                          state={blankState(n)}
                          picked={answers[n]}
                          answerKey={answerKeyOf.get(n)}
                          wordOf={wordOf}
                          onTap={() => tapBlank(n)}
                        />
                      )}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {isBank && section.bank ? (
            <div className="mt-3 rounded-row bg-surface-2 p-3">
              <p className="eyebrow text-fg-muted">WORD BANK · 只能用一次</p>

              {/*
                做题时**不给**词性。
                题面上一旦写好 n. / v.，「先标词性」这一步就白给了 —— 那等于
                把答案的分布直接递到学生手里。所以这里只给一支笔：学生自己给
                每个备选词标词性，标的是他自己的判断。交卷后解析再把解析册的
                词性摆出来，两个一对比，才知道自己标对没有。

                上一轮那排按词性的分布按钮（n. ×6 / v. ×3 …）因此删掉：
                那些数字来自答案键，本身就是泄题。
              */}
              {submitted ? (
                <p className="mt-2 text-caption text-fg-muted">
                  交卷了，每个词的词性都标在这儿。
                </p>
              ) : markingWord ? (
                <div className="mt-2 rounded-row bg-surface p-3">
                  <p className="text-caption text-fg-muted">
                    给 {markingWord.key}. {markingWord.word} 标词性
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {POS_ORDER.map((p) => (
                      <button
                        key={p}
                        type="button"
                        data-pos-option={p}
                        onClick={() => toggleMark(markingWord.key, p)}
                        className={cn(
                          "tap num rounded-pill px-2.5 py-1 text-caption font-black",
                          posMarks[markingWord.key] === p
                            ? "bg-primary text-primary-fg"
                            : "bg-surface-2 text-fg-muted",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-caption text-fg-muted">
                  先自己标词性：点词后面的小圆圈。已标 {markedCount(bank, posMarks)}/{bank.length}。
                </p>
              )}

              <p className="mt-2 text-caption text-fg-muted">
                {submitted
                  ? "已交卷。"
                  : activeBlank === null
                    ? "点原文里的空格，再点下面的词。"
                    : `正在填第 ${activeBlank} 空，点一个词放进去。`}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {bank.map((b) => {
                  const at = blankOfKey.get(b.key);
                  const filledHere = at !== undefined;
                  const right =
                    submitted && filledHere && answers[at] === answerKeyOf.get(at);
                  // 做题时显示学生自己标的；交卷后换成解析册的词性
                  const mark = submitted ? posOfKey.get(b.key) : posMarks[b.key];
                  return (
                    <span key={b.key} className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        data-bank={b.key}
                        onClick={() => tapBank(b.key)}
                        disabled={submitted}
                        className={cn(
                          "tap num inline-flex items-baseline gap-1.5 rounded-pill px-2.5 py-1 text-caption font-bold",
                          right
                            ? "bg-mint text-mint-fg"
                            : submitted && filledHere
                              ? "bg-coral text-coral-fg"
                              : filledHere
                                ? "bg-primary-soft text-fg"
                                : "bg-surface text-fg",
                        )}
                      >
                        <span>
                          {b.key}. {b.word}
                        </span>
                        {filledHere ? <span className="opacity-70">· {at}</span> : null}
                      </button>
                      {/* 标词性的小圆圈：空着 = 还没标，标了就是学生自己写的判断 */}
                      <button
                        type="button"
                        data-mark={b.key}
                        aria-label={`给 ${b.key} ${b.word} 标词性`}
                        onClick={() => setMarking(marking === b.key ? null : b.key)}
                        disabled={submitted}
                        className={cn(
                          "tap num grid size-6 shrink-0 place-items-center rounded-pill text-eyebrow font-black",
                          mark ? "bg-marker text-marker-fg" : "bg-surface text-fg-muted",
                        )}
                      >
                        {mark ?? (
                          <span className="block size-2 rounded-full border-2 border-current" />
                        )}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}
        </article>

        {isBank ? (
          submitted ? (
            <div className="mt-3 grid gap-2">
              {/*
                解析按选词填空公认的三步给：**词性 → 语法 → 语境**。
                第 1 步的词性和「同词性还有谁」是从 bank[].pos 算出来的；
                第 2、3 步是把解析册本来就有的「语法判断 / 语义判断」两段拆开，
                这里一个字都没新编。
                另外把学生自己标的词性摆出来对一下 —— 做题时给的是学生的判断，
                交卷后才揭晓正确答案的词性，两个一比才知道标对没有。
              */}
              {questions.map((q) => {
                const picked = answers[q.n];
                const right = picked === q.answer;
                const { grammar, context } = splitExplain(q.explain ?? "");
                const answerPos = posOfKey.get(q.answer);
                const pickedPos = picked ? posOfKey.get(picked) : undefined;
                const siblings = samePosSiblings(section, q.answer);
                // 选出来的词和正确答案词性一样，说明第一步过了，卡在后面两步 ——
                // 这句话只比较两个真实词性，推不出来就不说；答对了更不能说「错在后面两步」。
                const posMatched = Boolean(
                  !right && picked && pickedPos && answerPos && pickedPos === answerPos,
                );
                // 学生自己给正确答案那个词标的词性，跟解析册对一下
                const myMark = posMarks[q.answer];
                const markNote = !myMark
                  ? ""
                  : myMark === answerPos
                    ? `你自己标的也是 ${myMark}，对上了。`
                    : `你自己标的是 ${myMark}，这个词是 ${answerPos}。`;
                return (
                  <div key={q.n} className="rounded-card bg-surface p-4 shadow-hard-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "num rounded-pill px-2 py-0.5 text-caption font-black",
                          right ? "bg-mint text-mint-fg" : "bg-coral text-coral-fg",
                        )}
                      >
                        {q.n}
                      </span>
                      <span className="num text-caption font-black">
                        {q.answer}. {wordOf.get(q.answer) ?? ""}
                      </span>
                      {answerPos ? (
                        <span className="num rounded-pill bg-primary-soft px-2 py-0.5 text-eyebrow font-black">
                          {answerPos}
                        </span>
                      ) : null}
                      {!right ? (
                        <span className="text-caption text-fg-muted">
                          你填 {picked ? `${picked}. ${wordOf.get(picked) ?? ""}` : "空着"}
                        </span>
                      ) : null}
                    </div>

                    {posMatched ? (
                      <p className="mt-2 text-caption font-bold text-fg-muted">
                        你选的 {picked}. {wordOf.get(picked) ?? ""} 是 {pickedPos} —— 词性这步没错，错在后面两步。
                      </p>
                    ) : null}

                    <ol className="mt-3 grid gap-2.5">
                      <BankStep
                        index={1}
                        label="词性"
                        body={
                          answerPos
                            ? `${answerPos}。同词性的备选还有 ${
                                siblings.length
                                  ? siblings.map((b) => `${b.key} ${b.word}`).join(" / ")
                                  : "没有别的"
                              }，${siblings.length ? "要在这几个里挑" : "这一类只它一个"}。${markNote}`
                            : ""
                        }
                      />
                      <BankStep index={2} label="语法" body={grammar} />
                      <BankStep index={3} label="语境" body={context} />
                    </ol>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3">
              <LockedPanel title="译文和解析还没解锁" onSubmit={submit} />
            </div>
          )
        ) : (
          <div className="mt-3 grid gap-3">
            {questions.map((q) =>
              section.kind === "detail" ? (
                <QuestionBlock
                  key={q.n}
                  q={q}
                  answer={answers[q.n]}
                  revealed={revealed.includes(q.n)}
                  onAnswer={(key) => setAnswer(q.n, key)}
                  onReveal={() => revealMany([q.n])}
                  options={q.options ?? []}
                  lockReveal={!submitted}
                  hideChinese={!submitted}
                />
              ) : (
                <CompactQuestion
                  key={q.n}
                  n={q.n}
                  stem={q.stem}
                  answerKey={q.answer}
                  explain={q.explain}
                  evidence={q.evidence}
                  picked={answers[q.n]}
                  revealed={revealed.includes(q.n)}
                  lockReveal={!submitted}
                  options={options}
                  onPick={(key) => setAnswer(q.n, key)}
                  onReveal={() => revealMany([q.n])}
                />
              ),
            )}
          </div>
        )}

        {!submitted ? null : isBank ? null : (
          <>
            {section.translation?.length ? (
              <Collapsible
                className="mt-4"
                title="全文参考译文"
                hint={`${section.translation.length} 段`}
              >
                <div className="grid gap-2">
                  {section.translation.map((t, i) => (
                    <div key={`${t.label ?? "t"}-${i}`} className="flex gap-3">
                      {t.label ? (
                        <span className="num mt-px grid size-6 shrink-0 place-items-center rounded-pill bg-lavender text-eyebrow font-black text-on-accent">
                          {t.label}
                        </span>
                      ) : null}
                      <p className="min-w-0 flex-1 text-label leading-relaxed text-fg-muted">{t.zh}</p>
                    </div>
                  ))}
                </div>
              </Collapsible>
            ) : null}

            {section.notes?.length ? (
              <Collapsible className="mt-3" title="重难点词" hint={`${section.notes.length} 个`}>
                <dl className="grid gap-1.5">
                  {section.notes.map((n) => (
                    <div key={n.en} className="flex flex-wrap gap-x-2 text-label">
                      <dt className="font-bold">{n.en}</dt>
                      <dd className="text-fg-muted">{n.zh}</dd>
                    </div>
                  ))}
                </dl>
              </Collapsible>
            ) : null}

            {others.length ? (
              <Collapsible className="mt-3" title="这一 Part 的其他题段" hint="共用同一个 40 分钟" dense>
                <div className="grid gap-1.5">
                  {others.map((id) => {
                    const s = getReadingSection(paper, id);
                    if (!s) return null;
                    return (
                      <a
                        key={id}
                        href={`/papers/${paper.id}/reading/${id}`}
                        className="tap flex items-center gap-2 rounded-row bg-surface px-3 py-2.5"
                      >
                        <span className="num shrink-0 rounded-pill bg-fg px-2 py-0.5 text-eyebrow font-black text-bg">
                          {s.questionRange[0]}–{s.questionRange[1]}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-label font-bold">
                          {readingKindTitle(s.kind)}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </Collapsible>
            ) : null}

            <p className="num mt-4 text-center text-caption text-fg-subtle">
              答对 {correct}/{questions.length} · 已看解析{" "}
              {revealed.filter((n) => questionNos.includes(n)).length}/{questions.length}
            </p>
          </>
        )}

        <div className="h-6" />
      </div>

      <VocabSheet seed={vocabSeed} open={Boolean(vocabSeed)} onClose={() => setVocabSeed(null)} />
    </>
  );
}

/* ------------------------------------------------------------------ 原文 */

/**
 * 原文里的一个空（选词填空）。
 *
 * 空本身就是题面：点它选中，填进去以后显示「26 ever」，
 * 再点一下就删掉、可以换一个。交卷后按对错上色。
 */
function BlankSlot({
  n,
  state,
  picked,
  answerKey,
  wordOf,
  onTap,
}: {
  n: number;
  state: "empty" | "active" | "filled" | "right" | "wrong";
  picked?: string;
  answerKey?: string;
  wordOf: Map<string, string>;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`第 ${n} 空`}
      className={cn(
        "num mx-0.5 inline-block rounded-pill px-2 py-0.5 align-baseline text-caption font-black",
        state === "right" && "bg-mint text-mint-fg",
        state === "wrong" && "bg-coral text-coral-fg",
        state === "active" && "bg-primary text-primary-fg",
        state === "filled" && "bg-primary-soft text-fg",
        state === "empty" && "border-2 border-dashed border-fg/30 bg-surface-2 text-fg-subtle",
      )}
    >
      {n}{" "}
      {state === "right" || state === "filled" || state === "active"
        ? (picked ?? "____")
        : state === "wrong"
          ? `${picked ?? "?"}/${wordOf.get(answerKey ?? "") ?? answerKey}`
          : "____"}
    </button>
  );
}

/** 解析里的三步之一：词性 → 语法 → 语境。正文为空就整条不显示，不留空壳。 */
function BankStep({ index, label, body }: { index: number; label: string; body: string }) {
  if (!body.trim()) return null;
  return (
    <li className="flex gap-2.5">
      <span className="num mt-px grid size-5 shrink-0 place-items-center rounded-pill bg-fg text-eyebrow font-black text-bg">
        {index}
      </span>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-fg-muted">{label}</p>
        <p className="mt-0.5 text-caption leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

/** 原文 = 可点选的词 + 选词填空的空，两种东西混排在同一段里。 */
function PassageText({
  text,
  onWord,
  renderBlank,
}: {
  text: string;
  onWord: (word: string) => void;
  renderBlank: (n: number) => ReactNode;
}) {
  return (
    <>
      {text.split(/(\{\{\d+\}\})/g).map((part, i) => {
        const m = part.match(/^\{\{(\d+)\}\}$/);
        if (!m) return <TappableText key={i} text={part} onWord={onWord} />;
        return <span key={i}>{renderBlank(Number(m[1]))}</span>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ parts */

function CompactQuestion({
  n,
  stem,
  answerKey,
  explain,
  evidence,
  picked,
  revealed,
  lockReveal,
  options,
  onPick,
  onReveal,
}: {
  n: number;
  stem: string;
  answerKey: string;
  explain: string;
  evidence?: string;
  picked?: string;
  revealed: boolean;
  lockReveal: boolean;
  options: { key: string; en?: string; zh?: string }[];
  onPick: (key: string) => void;
  onReveal: () => void;
}) {
  return (
    <div className="rounded-card bg-surface p-4 shadow-hard-sm">
      <div className="flex items-start gap-3">
        <span className="num grid size-8 shrink-0 place-items-center rounded-pill bg-fg text-caption font-black text-bg">
          {n}
        </span>
        <p className="min-w-0 flex-1 text-body leading-relaxed font-bold">{stem}</p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {options.map((o) => {
          const isAnswer = o.key === answerKey;
          const isPicked = picked === o.key;
          const state: "idle" | "picked" | "right" | "wrong" = !revealed
            ? isPicked
              ? "picked"
              : "idle"
            : isAnswer
              ? "right"
              : isPicked
                ? "wrong"
                : "idle";
          return (
            <CompactOption
              key={o.key}
              label={o.key}
              sub={o.en}
              state={state}
              onPick={() => onPick(o.key)}
            />
          );
        })}
      </div>

      {!revealed && !lockReveal ? (
        <button
          type="button"
          onClick={onReveal}
          className="tap mt-3 w-full rounded-btn border-2 border-dashed border-fg/25 bg-surface-2 py-2.5 text-label font-bold"
        >
          看解析
        </button>
      ) : revealed ? (
        <div className="mt-3 rounded-row bg-surface-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-fg px-3 py-1 text-caption font-black text-bg">
              正确答案 {answerKey}
            </span>
            {picked === answerKey ? (
              <span className="rounded-pill bg-mint px-3 py-1 text-caption font-bold">你答对了</span>
            ) : picked ? (
              <span className="rounded-pill bg-coral px-3 py-1 text-caption font-bold">你选了 {picked}</span>
            ) : null}
          </div>
          {evidence ? (
            <p className="mt-3 border-l-4 border-fg pl-3 text-label leading-relaxed text-fg-muted">
              {evidence}
            </p>
          ) : null}
          <p className="mt-3 text-label leading-relaxed">{explain}</p>
        </div>
      ) : null}
    </div>
  );
}
