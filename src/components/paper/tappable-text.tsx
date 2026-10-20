"use client";

import { Fragment } from "react";

/**
 * 可点选的原文：点单个词就把它收进生词本。
 *
 * 取代原来挂在每道题底下的「记生词」按钮。那套做法有三个毛病：
 *
 * 1. **选词是系统挑的，不是学生挑的。** 候选词靠 `wordsOf()` 的长度阈值 +
 *    虚词黑名单猜出来，选出来的多半不是「我刚才不认识的那个」。
 *    在原文里点哪个词，收的就是哪个词 —— 这才是学生的真实判断。
 * 2. **候选词来自选项，不是来自原文。** 听力那条链路把
 *    `(q.options ?? []).flatMap(o => wordsOf(o.en))` 喂给按钮，
 *    也就是说记的是选项里的词，不是原文里读到的词。
 * 3. **每题一个按钮。** 一篇 16 段的匹配题就是 16 个「记生词」入口，
 *    原文上方摆一片按钮，反倒把原文挤走了。
 *
 * 词做成了真正的 `<button>`：键盘能 Tab 到、回车能存，不靠模拟点击。
 * 代价是长文里 tab 停点很多，这是「每个词都能存」必然的代价。
 * 可点性用极淡的点线下划线表示，按下去才上荧光黄 —— 不然整篇加粗底会没法读。
 */
export function TappableText({
  text,
  onWord,
  className,
}: {
  text: string;
  onWord: (word: string) => void;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split(/(\s+)/).map((chunk, i) =>
        chunk.length === 0 ? null : (
          <Fragment key={i}>
            {chunk.split(/([A-Za-z][A-Za-z'’-]*)/).map((piece, j) =>
              /^[A-Za-z]/.test(piece) ? (
                <button
                  key={j}
                  type="button"
                  onClick={() => onWord(piece)}
                  className="tap rounded-[2px] underline decoration-dotted decoration-1 underline-offset-[3px] decoration-fg-subtle/70 hover:bg-marker/70 hover:text-marker-fg active:bg-marker active:text-marker-fg"
                >
                  {piece}
                </button>
              ) : (
                <Fragment key={j}>{piece}</Fragment>
              ),
            )}
          </Fragment>
        ),
      )}
    </span>
  );
}
