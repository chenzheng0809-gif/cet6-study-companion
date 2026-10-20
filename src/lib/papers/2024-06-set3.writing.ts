import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 3 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第3套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写，
 * 不含「译点精析」「范文点评」这类解析册才有的内容 —— 没有就不写。
 */

export const WRITING: WritingTask = {
  prompt: "Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先接住题面 → On the one hand / On the other hand 两面论证（动机与自律 / 适应力与批判性思维）→ To sum up 收尾」的路子。",
  sampleEssay: "Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development. In today’s rapidly changing world, only when we are active in learning independently can we keep pace with the times. On the one hand, independent learning allows us to explore our interests and passions at our own pace. This enhances our motivation to learn. It also encourages self-discipline and time management skills, both of which are essential to our personal development. On the other hand, independent learning is the key to developing adaptability. In this ever-changing society, we often face unforeseen challenges. Independent learning enables us to find proper solutions in time, which plays a key role on our road to success. Furthermore, independent learning is crucial for fostering critical thinking. Independent learners can question, evaluate, and assimilate information effectively. This not only enhances our understanding of novel things but also promotes our creativity and innovation ability. To sum up, there is no doubt that independent learning ability plays a crucial role in our personal development. It equips us with the strong ability to adapt to the complex modern life. Part Ⅲ Reading Comprehension 26 27 28 29 30 31 32 33 34 35 36 37 38 C H M F N O E A G B D H N 39 40 41 42 43 44 45 46 47 48 49 50 51 F B K E I C L A B B C D A 52 53 54 55 D B D C Part Ⅳ Translation 参考译文： Fans have been cherished by the Chinese people since ancient times, yet now they are no longer merely tools for relieving summer heat; instead, they are increasingly admired as works of art. Many fans feature elegant shapes, fine craftsmanship, and are painted with intricate designs of landscapes, flowers, birds, and figures, holding high artistic value. Many renowned Chinese painters and calligraphers delight in inscribing poems and painting pictures on fans, showing their artistic taste. Fans are frequently presented as gifts, conveying delightful blessings and heartfelt emotions. Today, the practical utility of fans has significantly diminished, yet as a cultural icon and a form of art, they continue to play an important role in traditional Chinese culture.",
};

export const TRANSLATION: TranslationTask = {
  zh: "扇子自古以来就深受中国人喜爱，但现在已不只是消暑纳凉的工具，而更多地作为艺术 品供人欣赏。许多扇子造型优美、做工精良，并绘有山水、花鸟、人物等精美图案，具有很 高的艺术价值。中国许多著名画家和书法家喜欢在扇子上作诗绘画，展示其艺术品味。扇子 常作为礼物赠予他人，表达美好的祝福和真挚的情感。如今，扇子的实用功能已大为减弱， 但作为一种文化符号和艺术形式，扇子仍然在中国传统文化中扮演着重要角色。",
  reference: "Fans have been cherished by the Chinese people since ancient times, yet now they are no longer merely tools for relieving summer heat; instead, they are increasingly admired as works of art. Many fans feature elegant shapes, fine craftsmanship, and are painted with intricate designs of landscapes, flowers, birds, and figures, holding high artistic value. Many renowned Chinese painters and calligraphers delight in inscribing poems and painting pictures on fans, showing their artistic taste. Fans are frequently presented as gifts, conveying delightful blessings and heartfelt emotions. Today, the practical utility of fans has significantly diminished, yet as a cultural icon and a form of art, they continue to play an important role in traditional Chinese culture.",
};
