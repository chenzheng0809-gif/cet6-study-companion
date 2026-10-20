import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 1 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第1套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写，
 * 不含「译点精析」「范文点评」这类解析册才有的内容 —— 没有就不写。
 */

export const WRITING: WritingTask = {
  prompt: "There is a growing awareness of the importance of digital literacy and skills in today’s world.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「There is a growing awareness of the importance of digital literacy and skills in today's world.」这句原话开篇，写一篇 150–200 词的短文。两件事必须做到：一是开头那句一字不改地抄下来，二是全篇写满 150 词、不超过 200 词。参考范文走的是「先亮明观点 → 分两层论证（学生 / 职场）→ 收尾回到学习、工作与生活」的路子：先说数字素养对谁都重要，再用「For one thing / For another / Moreover」把理由铺开，最后用 To sum up 收口。",
  sampleEssay: "There is a growing awareness of the importance of digital literacy and skills in today’s world. In today’s rapidly evolving digital world, I fully agree that digital literacy and skills are very important to everyone. For one thing, it is obvious that digital literacy is crucial for students. There are a large number of learning resources available online, such as great theses and excellent courses from prestigious universities. Students can draw on these rich resources to learn more knowledge and expand their horizons. For another, there is no denying that digital skills play an essential role in the workplace. We need to be proficient in using search engines to get more information and enhance our productivity with application software. Moreover, we cannot live a better life without digital literacy and skills. They can help a lot when it comes to getting around, shopping, socializing, and so on. To sum up, digital literacy and skills are of great importance to our study, work, and daily life. We should try our best to improve our digital literacy and skills to navigate the digital world.",
};

export const TRANSLATION: TranslationTask = {
  zh: "中国的传统婚礼习俗历史悠久，从周朝开始就逐渐形成了一套完整的婚礼仪式，有些一 直沿用至今。如今的中式婚礼习俗已有很大变化，但婚礼庆典仍然十分隆重。婚礼场地经过 精心装饰，以象征喜庆（jubilance）的红色为主色调，摆放着许多祝愿新人幸福的物件。在 婚礼上，新人要拜天地（bow to Heaven and Earth），拜父母和相互对拜，然后设宴招待宾 客，并向宾客敬酒致谢。今天，许多年轻人依然钟情于传统的中式婚礼，体验独特而美好的 中国式浪漫。",
  reference: "Traditional wedding customs in China have a long history, and since the Zhou Dynasty a complete set of wedding rituals has gradually developed, some of which are still in use today. Nowadays, Chinese wedding customs have changed a lot, but the ceremony is still very grand. The wedding venue is carefully decorated, with the main color of red, a symbol of jubilance, and many objects are placed to wish the couple happiness. At the wedding, the couple will bow to Heaven and Earth, to their parents and to each other, and then hold a banquet to entertain the guests and toast the guests to express their gratitude. Today, many young people still prefer the traditional Chinese wedding, to experience the unique and beautiful Chinese romance.",
};
