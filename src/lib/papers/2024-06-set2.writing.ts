import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 2 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第2套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写，
 * 不含「译点精析」「范文点评」这类解析册才有的内容 —— 没有就不写。
 */

export const WRITING: WritingTask = {
  prompt: "Nowadays more and more college students have come to realize social practice and academic learning are equally important.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「Nowadays more and more college students have come to realize social practice and academic learning are equally important.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先摆出两种立场 → 表明自己站哪边 → 用 Firstly / Secondly / Lastly 分三层论证 → All in all 收尾」的路子。",
  sampleEssay: "Nowadays more and more college students have come to realize social practice and academic learning are equally important. Some people hold the view that social practice plays an indispensable role in education, while others believe that it is not necessary for everyone to be involved in social activities. For me, I agree with the former. Firstly, social practice can help complement academic learn ing. Through social practice, students can not only apply what they have learned in real-life situations, enhancing their understanding, but also get inspiration, which is useful for their academic learning. Secondly, social practice is beneficial to fosteringteamwork, which is of great importance for the future job. Social practice exposes students to cooperation with different people. It is conceivable that only when students cooperate can they finish the task. Lastly, social practice makes students face different challenges. It encourages them to think critically and creatively to find solutions. This not only enriches their learning experience but also prepares them for their future roles in society. All in all, knowledge and action should go hand in hand. Social practice and academic learning are of equal importance, which is the key to producing well-rounded individuals.",
};

export const TRANSLATION: TranslationTask = {
  zh: "中国盛产竹子，是最早开发利用竹资源的国家。竹子在中国分布广泛，品种丰富。竹子 实用性强，用于生产和生活的许多方面，如筷子、桌椅的制作和桥梁、房屋的建造。中国人 爱竹，自古以来就有无数文人以竹为主题，创作了绚丽多彩的文学和绘画作品。竹子主干 （stem）笔直，象征正直的品格。竹子具有强大的生命力和适应能力，无论环境多么恶劣， 都能够顽强生存，因而寓意坚韧不拔的精神。几千年来，竹子一直被视为中华民族品格的象 征。",
  reference: "China is rich in bamboo and is the first country to exploit and utilize bamboo resources. Bamboo is extensively distributed and diverse in variety within China. Bamboo is highly versatile and is used in various aspects of production and daily life, such as the making of chopsticks, tables, and chairs, as well as the construction of bridges and houses. The Chinese have a deep affection for bamboo, and since ancient times, numerous scholars have created colorful literature and paintings on the theme of bamboo. The stem of bamboo is straight, symbolizing integrity. Bamboo exhibits remarkable vitality and adaptability, able to survive toughly no matter how harsh the environment is, thus embodying the spirit of unwavering perseverance. For thousands of years, bamboo has been esteemed as a representation of the character of the Chinese nation.",
};
