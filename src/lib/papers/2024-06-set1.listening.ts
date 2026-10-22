import type { ListeningUnit, Question } from "./types";

/**
 * 2024 年 06 月六级 · 第 1 套 · Part II Listening Comprehension
 *
 * 选项来自《2024年06月大学英语六级考试真题（第1套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第1套）》PDF（用户提供）。
 *
 * 卷面不印听力题干 —— 2024 年起六级听力只印 A–D 选项，题干只在录音里念出来。
 * 所以这里的 stem 全部取自录音转写，是录音里真实读过的那句话。
 *
 * 听力原文是录音的机器转写（listen_audio），可能有极少数识别误差；
 * 单元窗口来自对同一段 MP3 的静音能量分析，答题停顿固定在 13.3–13.8 秒，
 * 全卷检出 25 个，与卷面 25 道题一一对应。
 *
 * questionWindows 是每一道题的题干在录音里的起止时刻：
 * 起点取上一段答题停顿的结束（第 1 题取 "Question N." 那一段的起点，由转写定位），
 * 终点取这道题后面那段答题停顿的开始。每道题都单独转写校验过 ——
 * 必须念出本题题号、且不能念出别的题号，才写进数据。
 * 测量脚本：scripts/measure-question-windows.py
 */

export const LISTENING_UNITS: ListeningUnit[] = [
  {
    id: "l-c1",
    label: "Conversation One",
    labelZh: "对话一 · 一桩要划掉中东市场的赞助合同",
    section: "A",
    questionRange: [1, 4],
    window: {
      startSec: 53.1,
      endSec: 169.44,
    },
    stemsWindow: {
      startSec: 169.44,
      endSec: 238.14,
      questions: [2, 3, 4],
    },
    questionWindows: [
      { n: 1, startSec: 166.06, endSec: 169.44 },
      { n: 2, startSec: 183.08, endSec: 187.38 },
      { n: 3, startSec: 201.32, endSec: 207.26 },
      { n: 4, startSec: 220.36, endSec: 224.56 },
    ],
    transcript: [
      {
        id: "c1-1",
        speaker: "W",
        en: "Thank you for meeting with me, Stephen, at such short notice.",
      },
      {
        id: "c1-2",
        speaker: "M",
        en: "Not a problem, Margaret.",
      },
      {
        id: "c1-3",
        speaker: "M",
        en: "Now, please give me some good news.",
      },
      {
        id: "c1-4",
        speaker: "M",
        en: "Have you agreed to my last proposal?",
      },
      {
        id: "c1-5",
        speaker: "W",
        en: "I have indeed, and I wish to sign the agreement, pending one small change to be made to the contract.",
        marks: [1],
      },
      {
        id: "c1-6",
        speaker: "M",
        en: "Margaret, we have been through this for almost a year now, back and forth making alterations.",
      },
      {
        id: "c1-7",
        speaker: "M",
        en: "Are you sure you want to make a sponsorship deal for your client or not?",
      },
      {
        id: "c1-8",
        speaker: "M",
        en: "I ask this because, frankly, some people at my end are running out of patience.",
        marks: [2],
      },
      {
        id: "c1-9",
        speaker: "W",
        en: "I understand your concerns, but as I'm sure you understand, we hold our clients' best interests to be of the utmost concern.",
      },
      {
        id: "c1-10",
        speaker: "W",
        en: "We therefore comb through the fine details of all contracts.",
      },
      {
        id: "c1-11",
        speaker: "W",
        en: "Rest assured, we all appreciate your firm's patience.",
      },
      {
        id: "c1-12",
        speaker: "M",
        en: "Okay, fine.",
      },
      {
        id: "c1-13",
        speaker: "M",
        en: "So what changes do you wish to make?",
      },
      {
        id: "c1-14",
        speaker: "W",
        en: "Essentially, we would like the new deal to exclude the Middle East.",
      },
      {
        id: "c1-15",
        speaker: "W",
        en: "That's all.",
      },
      {
        id: "c1-16",
        speaker: "M",
        en: "The Middle East.",
      },
      {
        id: "c1-17",
        speaker: "M",
        en: "Why?",
      },
      {
        id: "c1-18",
        speaker: "W",
        en: "My client has a couple of other prospective marketing deals from companies in the Middle East.",
      },
      {
        id: "c1-19",
        speaker: "W",
        en: "Those offers, should they materialize, would exclusively employ my client's image in the Middle East only.",
      },
      {
        id: "c1-20",
        speaker: "W",
        en: "Therefore, in order to avoid any conflict, we would need to ensure that both marketing campaigns do not overlap geographically.",
        marks: [3],
      },
      {
        id: "c1-21",
        speaker: "M",
        en: "What business sector in the Middle East are we talking about here?",
      },
      {
        id: "c1-22",
        speaker: "W",
        en: "Real estate.",
      },
      {
        id: "c1-23",
        speaker: "M",
        en: "Well, that should be okay then.",
      },
      {
        id: "c1-24",
        speaker: "M",
        en: "So long as the product is very different from our food and beverage market, there should be no conflict of interest.",
      },
      {
        id: "c1-25",
        speaker: "M",
        en: "Nevertheless, I will have to run this through my people.",
      },
      {
        id: "c1-26",
        speaker: "M",
        en: "I don't foresee any problem though.",
      },
      {
        id: "c1-27",
        speaker: "M",
        en: "The Middle East is a negligible market for us.",
        marks: [4],
      },
      {
        id: "c1-28",
        speaker: "M",
        en: "But I still need to check this with a couple of departments.",
      },
    ],
    notes: [
      { en: "pending one small change", zh: "以合同做一处小改动为前提" },
      { en: "the utmost concern", zh: "最为关切的事" },
      { en: "comb through", zh: "逐一仔细审查" },
      { en: "prospective", zh: "潜在的；有可能实现的" },
      { en: "overlap geographically", zh: "在地理区域上重叠" },
      { en: "conflict of interest", zh: "利益冲突" },
      { en: "negligible", zh: "微不足道的；可忽略不计的" },
    ],
  },
  {
    id: "l-c2",
    label: "Conversation Two",
    labelZh: "对话二 · 丹佛天文台与一颗回归的彗星",
    section: "A",
    questionRange: [5, 8],
    window: {
      startSec: 238.14,
      endSec: 370.34,
    },
    stemsWindow: {
      startSec: 370.34,
      endSec: 444.24,
      questions: [6, 7, 8],
    },
    questionWindows: [
      { n: 5, startSec: 364.04, endSec: 370.34 },
      { n: 6, startSec: 383.88, endSec: 389.08 },
      { n: 7, startSec: 402.82, endSec: 408.8 },
      { n: 8, startSec: 422.44, endSec: 430.6 },
    ],
    transcript: [
      {
        id: "c2-1",
        speaker: "M",
        en: "Next, we have a special science-related news story.",
      },
      {
        id: "c2-2",
        speaker: "M",
        en: "Paula Hancock is at the Denver Observatory.",
      },
      {
        id: "c2-3",
        speaker: "M",
        en: "Paula, what is the big story over there?",
      },
      {
        id: "c2-4",
        speaker: "W",
        en: "Hi, John.",
      },
      {
        id: "c2-5",
        speaker: "W",
        en: "Yes, all the astronomers on site here are very excited.",
        marks: [5],
      },
      {
        id: "c2-6",
        speaker: "W",
        en: "In fact, space enthusiasts all across North America and the rest of the Northern Hemisphere will be congregating on mountaintops tonight to watch the night sky.",
      },
      {
        id: "c2-7",
        speaker: "M",
        en: "Why?",
      },
      {
        id: "c2-8",
        speaker: "M",
        en: "What's the big event?",
      },
      {
        id: "c2-9",
        speaker: "M",
        en: "Is there an eclipse happening soon?",
      },
      {
        id: "c2-10",
        speaker: "W",
        en: "Tonight, the Earth will come into close proximity with the Oppenheimer comet.",
      },
      {
        id: "c2-11",
        speaker: "W",
        en: "It is the closest our planet has been to such a phenomenon in over 100 years.",
        marks: [6],
      },
      {
        id: "c2-12",
        speaker: "W",
        en: "For this reason, it is expected that thousands of people will gaze up at the sky tonight in order to see this formidable object.",
      },
      {
        id: "c2-13",
        speaker: "M",
        en: "How far away is this comet?",
      },
      {
        id: "c2-14",
        speaker: "M",
        en: "Will people be able to see it with the naked eye?",
      },
      {
        id: "c2-15",
        speaker: "W",
        en: "The Oppenheimer comet will still be millions of miles away on the edge of our galaxy, but, nevertheless, this is a relatively close distance, close enough for people to observe in good detail through a telescope.",
      },
      {
        id: "c2-16",
        speaker: "W",
        en: "People will only see a blur without one.",
        marks: [7],
      },
      {
        id: "c2-17",
        speaker: "W",
        en: "However, that does not mean one needs professional equipment.",
      },
      {
        id: "c2-18",
        speaker: "W",
        en: "Even the most ordinary of telescopes should be conducive for people to observe and wonder at this flying object.",
      },
      {
        id: "c2-19",
        speaker: "M",
        en: "Many of our viewers will be wondering how they too can take part in this once-in-a-lifetime event.",
      },
      {
        id: "c2-20",
        speaker: "M",
        en: "Where will this comet be in the sky?",
      },
      {
        id: "c2-21",
        speaker: "M",
        en: "How can people find it?",
      },
      {
        id: "c2-22",
        speaker: "W",
        en: "The comet will be almost exactly due north, at 60 degrees above the equator.",
      },
      {
        id: "c2-23",
        speaker: "W",
        en: "However, finding the comet is, indeed, very tricky, and scientists here have told me there are plenty of phone apps that will facilitate this.",
        marks: [8],
      },
      {
        id: "c2-24",
        speaker: "M",
        en: "How fantastic.",
      },
      {
        id: "c2-25",
        speaker: "M",
        en: "Thank you, Paula, for the information.",
      },
    ],
    notes: [
      { en: "congregating", zh: "聚集；云集" },
      { en: "come into close proximity", zh: "（与……）极为接近" },
      { en: "the naked eye", zh: "肉眼" },
      { en: "formidable", zh: "令人敬畏的；气势逼人的" },
      { en: "conducive", zh: "有助于……的；有利于……的" },
      { en: "due north", zh: "正北方向" },
      { en: "facilitate", zh: "使便利；帮助（某人）更容易做到某事" },
    ],
  },
  {
    id: "l-b1",
    label: "Passage One",
    labelZh: "短文一 · 超加工食品该不该被提醒",
    section: "B",
    questionRange: [9, 11],
    window: {
      startSec: 444.24,
      endSec: 618.82,
    },
    stemsWindow: {
      startSec: 618.82,
      endSec: 674.22,
      questions: [10, 11],
    },
    questionWindows: [
      { n: 9, startSec: 614.1, endSec: 618.82 },
      { n: 10, startSec: 632.5, endSec: 638.82 },
      { n: 11, startSec: 653.54, endSec: 660.3 },
    ],
    transcript: [
      {
        id: "b1-1",
        speaker: "W",
        en: "Dietary guidelines form the basis for nutrition advice and regulations around the world.",
      },
      {
        id: "b1-2",
        speaker: "W",
        en: "While there is strong scientific consensus around most existing guidelines, one question has recently stirred debate.",
      },
      {
        id: "b1-3",
        speaker: "W",
        en: "Should consumers be warned to avoid ultra-processed foods?",
        marks: [9],
      },
      {
        id: "b1-4",
        speaker: "W",
        en: "Two papers published today in the American Journal of Clinical Nutrition outline the case for and against using the concept of ultra-processed foods to help inform dietary guidelines beyond conventional food classification systems.",
      },
      {
        id: "b1-5",
        speaker: "W",
        en: "The authors, Carlos Monteiro of the University of Sao Paulo, and Arne Astrup of Novo Nordisk Foundation, will discuss the issue in a live virtual debate, August 14th, during Nutrition 2024 Live Online.",
      },
      {
        id: "b1-6",
        speaker: "W",
        en: "The debate centers around a system developed by Monteiro and colleagues that classifies foods by their degree of industrial processing, ranging from unprocessed to ultra-processed.",
        marks: [10],
      },
      {
        id: "b1-7",
        speaker: "W",
        en: "The system defines ultra-processed foods as those made using sequences of processes that extract substances from foods and alter them with chemicals in order to formulate the final product.",
      },
      {
        id: "b1-8",
        speaker: "W",
        en: "Ultra-processed foods are characteristically designed to be cheap, tasty, and convenient.",
      },
      {
        id: "b1-9",
        speaker: "W",
        en: "Examples include soft drinks and candy, packaged snacks and pastries, ready-to-heat products, and reconstituted meat products.",
      },
      {
        id: "b1-10",
        speaker: "W",
        en: "Studies have linked consumption of ultra-processed foods, which are often high in salt, sugar, and fat, with weight gain and an increased risk of chronic diseases, even after adjusting for the amount of salt, sugar, and fat in the diet.",
        marks: [11],
      },
      {
        id: "b1-11",
        speaker: "W",
        en: "While the mechanisms behind these associations are not fully understood, Monteiro argues that the existing evidence is sufficient to justify discouraging consumption of ultra-processed foods in dietary recommendations and government policies.",
      },
    ],
    notes: [
      { en: "stirred debate", zh: "引发争论" },
      { en: "outline the case for and against", zh: "列出正反两方面的理由" },
      { en: "degree of industrial processing", zh: "工业加工程度" },
      { en: "sequences of processes", zh: "一系列加工工序" },
      { en: "reconstituted meat products", zh: "复原肉制品" },
      { en: "chronic diseases", zh: "慢性病" },
      { en: "justify discouraging", zh: "为劝阻……提供依据" },
    ],
  },
  {
    id: "l-b2",
    label: "Passage Two",
    labelZh: "短文二 · 限制为什么能逼出创造力",
    section: "B",
    questionRange: [12, 15],
    window: {
      startSec: 674.22,
      endSec: 809.5,
    },
    stemsWindow: {
      startSec: 809.5,
      endSec: 879.3,
      questions: [13, 14, 15],
    },
    questionWindows: [
      { n: 12, startSec: 803.72, endSec: 809.5 },
      { n: 13, startSec: 823.26, endSec: 827.2 },
      { n: 14, startSec: 840.74, endSec: 846.76 },
      { n: 15, startSec: 860.44, endSec: 865.32 },
    ],
    transcript: [
      {
        id: "b2-1",
        speaker: "M",
        en: "Believe it or not, human creativity benefits from constraints.",
      },
      {
        id: "b2-2",
        speaker: "M",
        en: "According to psychologists, when you have less to work with, you actually begin to see the world differently.",
        marks: [12],
      },
      {
        id: "b2-3",
        speaker: "M",
        en: "With constraints, you dedicate your mental energy to acting more resourcefully.",
      },
      {
        id: "b2-4",
        speaker: "M",
        en: "When challenged, you figure out new ways to be better.",
      },
      {
        id: "b2-5",
        speaker: "M",
        en: "The most successful creative people know that constraints give their minds the impetus to leap higher.",
      },
      {
        id: "b2-6",
        speaker: "M",
        en: "People who invent new products are not limited by what they don't have or can't do.",
      },
      {
        id: "b2-7",
        speaker: "M",
        en: "They leverage their limitations to push themselves even further.",
      },
      {
        id: "b2-8",
        speaker: "M",
        en: "Many products and services are created because the founders saw a limitation in what they use.",
      },
      {
        id: "b2-9",
        speaker: "M",
        en: "They created innovation based on what was not working for them at the moment.",
      },
      {
        id: "b2-10",
        speaker: "M",
        en: "Innovation is a creative person's response to limitation.",
        marks: [13],
      },
      {
        id: "b2-11",
        speaker: "M",
        en: "In a 2015 study, which examined how thinking about scarcity or abundance influences how creatively people use their resources, Ravi Mehta at the University of Illinois and Meng Zhu at Johns Hopkins University found that people simply have no incentive to use what's available to them in novel ways.",
        marks: [14],
      },
      {
        id: "b2-12",
        speaker: "M",
        en: "When people face scarcity, they give themselves the freedom to use resources in less conventional ways because they have to.",
      },
      {
        id: "b2-13",
        speaker: "M",
        en: "Obstacles can broaden your perspective and open up your thinking processes.",
      },
      {
        id: "b2-14",
        speaker: "M",
        en: "Consistent constraints help you improve at connecting unrelated ideas and concepts.",
      },
      {
        id: "b2-15",
        speaker: "M",
        en: "Marissa Mayer, former vice president for search products and user experience at Google, once wrote in a publication on Bloomberg, \"Constraints shape and focus problems and provide clear challenges to overcome.",
      },
      {
        id: "b2-16",
        speaker: "M",
        en: "Creativity thrives best when constrained.\"",
        marks: [15],
      },
    ],
    notes: [
      { en: "benefits from constraints", zh: "从限制中获益" },
      { en: "resourcefully", zh: "灵活地；机智地" },
      { en: "impetus", zh: "推动力；促进因素" },
      { en: "leverage their limitations", zh: "利用自身的局限" },
      { en: "scarcity or abundance", zh: "稀缺还是富足" },
      { en: "broaden your perspective", zh: "拓宽你的视野" },
      { en: "thrives best", zh: "最能发挥作用；效果最好" },
    ],
  },
  {
    id: "l-r1",
    label: "Recording One",
    labelZh: "讲座一 · 应对冲突的五种风格",
    section: "C",
    questionRange: [16, 18],
    window: {
      startSec: 879.3,
      endSec: 1088.96,
    },
    stemsWindow: {
      startSec: 1088.96,
      endSec: 1142.86,
      questions: [17, 18],
    },
    questionWindows: [
      { n: 16, startSec: 1082.56, endSec: 1088.96 },
      { n: 17, startSec: 1102.78, endSec: 1108.02 },
      { n: 18, startSec: 1121.9, endSec: 1129.02 },
    ],
    transcript: [
      {
        id: "r1-1",
        speaker: "N",
        en: "Different people use different strategies for managing conflicts.",
      },
      {
        id: "r1-2",
        speaker: "N",
        en: "These strategies are learned in childhood.",
      },
      {
        id: "r1-3",
        speaker: "N",
        en: "Usually, we are not aware of how we act in conflict situations.",
      },
      {
        id: "r1-4",
        speaker: "N",
        en: "We just do whatever seems to come naturally.",
      },
      {
        id: "r1-5",
        speaker: "N",
        en: "But, we do have a personal strategy, and because it is learned, we can always change it by learning new and more effective ways of managing conflicts.",
        marks: [16],
      },
      {
        id: "r1-6",
        speaker: "N",
        en: "When you get involved in a conflict, there are two major concerns you have to take into account: achieving your personal goals, and keeping a good relationship with the other person.",
      },
      {
        id: "r1-7",
        speaker: "N",
        en: "How important your personal goals are, and how important the relationship is to you, affect how you act in a conflict.",
        marks: [17],
      },
      {
        id: "r1-8",
        speaker: "N",
        en: "Given these two concerns, five styles of managing conflicts can be identified.",
      },
      {
        id: "r1-9",
        speaker: "N",
        en: "One, the turtle.",
      },
      {
        id: "r1-10",
        speaker: "N",
        en: "Turtles withdraw into their shells to avoid conflicts.",
      },
      {
        id: "r1-11",
        speaker: "N",
        en: "They give up their personal goals and relationships.",
      },
      {
        id: "r1-12",
        speaker: "N",
        en: "They believe it is easier to withdraw from a conflict than to face it.",
      },
      {
        id: "r1-13",
        speaker: "N",
        en: "Two, the shark.",
      },
      {
        id: "r1-14",
        speaker: "N",
        en: "Sharks try to overpower opponents by forcing them to accept their solution to the conflict.",
      },
      {
        id: "r1-15",
        speaker: "N",
        en: "They seek to achieve their goals at all costs.",
      },
      {
        id: "r1-16",
        speaker: "N",
        en: "Sharks assume that conflicts are settled by one person winning and one person losing.",
      },
      {
        id: "r1-17",
        speaker: "N",
        en: "Winning gives sharks a sense of pride and achievement.",
      },
      {
        id: "r1-18",
        speaker: "N",
        en: "Losing gives them a sense of weakness, inadequacy, and failure.",
      },
      {
        id: "r1-19",
        speaker: "N",
        en: "Three, the teddy bear.",
      },
      {
        id: "r1-20",
        speaker: "N",
        en: "Teddy bears want to be accepted and liked by other people.",
      },
      {
        id: "r1-21",
        speaker: "N",
        en: "They think that conflict should be avoided in favor of harmony, and believe that conflicts cannot be discussed without damaging relationships.",
      },
      {
        id: "r1-22",
        speaker: "N",
        en: "They give up their goals to preserve the relationship.",
      },
      {
        id: "r1-23",
        speaker: "N",
        en: "Four, the fox.",
      },
      {
        id: "r1-24",
        speaker: "N",
        en: "Foxes are moderately concerned with their own goals and about their relationships with other people.",
      },
      {
        id: "r1-25",
        speaker: "N",
        en: "They give up part of their goals and persuade the other person in a conflict to give up part of his goals.",
      },
      {
        id: "r1-26",
        speaker: "N",
        en: "They seek a solution to conflicts where both sides gain something.",
      },
      {
        id: "r1-27",
        speaker: "N",
        en: "Five, the owl.",
      },
      {
        id: "r1-28",
        speaker: "N",
        en: "Owls view conflicts as problems to be solved.",
        marks: [18],
      },
      {
        id: "r1-29",
        speaker: "N",
        en: "They see conflicts as improving relationships by reducing tension between two people.",
      },
      {
        id: "r1-30",
        speaker: "N",
        en: "They try to begin a discussion that identifies the conflict as a problem.",
      },
      {
        id: "r1-31",
        speaker: "N",
        en: "By seeking solutions that satisfy both themselves and the other person, owls maintain the relationship.",
      },
      {
        id: "r1-32",
        speaker: "N",
        en: "Owls are not satisfied until a solution is found that achieves their own goals and the other person's goals, and they are not satisfied until the tensions and negative feelings have been fully resolved.",
      },
    ],
    notes: [
      { en: "strategies for managing conflicts", zh: "处理冲突的策略" },
      { en: "achieving your personal goals", zh: "实现自己的个人目标" },
      { en: "keeping a good relationship", zh: "与对方保持良好关系" },
      { en: "withdraw into their shells", zh: "缩回自己的壳里（回避冲突）" },
      { en: "at all costs", zh: "不惜一切代价" },
      { en: "both sides gain something", zh: "双方都能有所收获" },
      { en: "negative feelings have been fully resolved", zh: "负面情绪被彻底化解" },
    ],
  },
  {
    id: "l-r2",
    label: "Recording Two",
    labelZh: "讲座二 · 给 150 万个物种做基因图谱",
    section: "C",
    questionRange: [19, 21],
    window: {
      startSec: 1142.86,
      endSec: 1332.26,
    },
    stemsWindow: {
      startSec: 1332.26,
      endSec: 1386.4,
      questions: [20, 21],
    },
    questionWindows: [
      { n: 19, startSec: 1325.84, endSec: 1332.26 },
      { n: 20, startSec: 1346.06, endSec: 1350.42 },
      { n: 21, startSec: 1364.3, endSec: 1372.64 },
    ],
    transcript: [
      {
        id: "r2-1",
        speaker: "N",
        en: "The genetic code of all 1.5 million known species of animals and plants living on Earth will be mapped to help save species from extinction and boost human health.",
        marks: [19],
      },
      {
        id: "r2-2",
        speaker: "N",
        en: "Scientists hope that cracking the genetic code of plants and animals could help uncover new treatments for infectious diseases, slow aging, improve crops in agriculture, and create new biomaterials.",
      },
      {
        id: "r2-3",
        speaker: "N",
        en: "In Britain, organizations including the Natural History Museum, the Royal Botanic Gardens at Kew, and the Wellcome Sanger Institute have joined forces to sequence Britain's 66,000 species of animals and plants.",
      },
      {
        id: "r2-4",
        speaker: "N",
        en: "Dubbed the Darwin Tree of Life project, it is expected to take 10 years and cost 100 million pounds.",
      },
      {
        id: "r2-5",
        speaker: "N",
        en: "Once completed, all the information will be publicly available to researchers.",
      },
      {
        id: "r2-6",
        speaker: "N",
        en: "Many scientists believe that Earth has now entered the sixth mass extinction, with humans creating a toxic mix of habitat loss, pollution, and climate change, which has already led to the loss of at least 77 species of mammals and 140 types of birds since 1500.",
        marks: [20],
      },
      {
        id: "r2-7",
        speaker: "N",
        en: "It is the biggest loss of species since the dinosaurs were wiped out 66 million years ago.",
      },
      {
        id: "r2-8",
        speaker: "N",
        en: "Scientists say that sequencing every species will revolutionize the understanding of biology and evolution, bolster efforts to conserve, as well as protect and restore biodiversity.",
      },
      {
        id: "r2-9",
        speaker: "N",
        en: "Dr.",
      },
      {
        id: "r2-10",
        speaker: "N",
        en: "Tim Littlewood, head of Life Sciences Department at the Natural History Museum, said, \"Whether you are interested in food or disease, the history of how every organism on the planet has adapted to its environment is recorded in its genetic makeup.",
      },
      {
        id: "r2-11",
        speaker: "N",
        en: "How you then harness that is dependent on your ability to understand it.",
      },
      {
        id: "r2-12",
        speaker: "N",
        en: "We will be using modern methods to get a really good window on the present and the past.",
      },
      {
        id: "r2-13",
        speaker: "N",
        en: "And of course, a window on the past gives you a prospective model on the future.\" Sir Jim Smith, director of science at Wellcome, said, \"Try as I might, I can't think of a more exciting, more relevant, more timely, or more internationally inspirational project.",
        marks: [21],
      },
      {
        id: "r2-14",
        speaker: "N",
        en: "Since 1970, humanity has wiped out 60% of animal populations.",
      },
      {
        id: "r2-15",
        speaker: "N",
        en: "About 23,000 of 80,000 species surveyed are approaching extinction.",
      },
      {
        id: "r2-16",
        speaker: "N",
        en: "We are in the midst of the sixth great extinction event of life on our planet, which not only threatens wildlife species, but also imperils the global food supply.",
      },
      {
        id: "r2-17",
        speaker: "N",
        en: "As scientists, we all realize we desperately need to catalog life on our fragile planet now.",
      },
      {
        id: "r2-18",
        speaker: "N",
        en: "I think we're making history.\"",
      },
    ],
    notes: [
      { en: "cracking the genetic code", zh: "破解遗传密码" },
      { en: "biomaterials", zh: "生物材料" },
      { en: "joined forces to sequence", zh: "携手为……测序" },
      { en: "sixth mass extinction", zh: "第六次物种大灭绝" },
      { en: "habitat loss", zh: "栖息地丧失" },
      { en: "bolster efforts to conserve", zh: "加强保护的努力" },
      { en: "harness", zh: "驾驭；利用" },
      { en: "prospective model on the future", zh: "对未来的前瞻性模型" },
    ],
  },
  {
    id: "l-r3",
    label: "Recording Three",
    labelZh: "讲座三 · 哥白尼革命之后的世界观",
    section: "C",
    questionRange: [22, 25],
    window: {
      startSec: 1386.4,
      endSec: 1570.68,
    },
    stemsWindow: {
      startSec: 1570.68,
      endSec: 1647.54,
      questions: [23, 24, 25],
    },
    questionWindows: [
      { n: 22, startSec: 1565.22, endSec: 1570.68 },
      { n: 23, startSec: 1584.12, endSec: 1593.04 },
      { n: 24, startSec: 1606.44, endSec: 1613.24 },
      { n: 25, startSec: 1626.66, endSec: 1634.14 },
    ],
    transcript: [
      {
        id: "r3-1",
        speaker: "N",
        en: "John Donne, the English poet, wrote in the 17th century: \"No man is an island, entire of itself.",
      },
      {
        id: "r3-2",
        speaker: "N",
        en: "Every man is a piece of the continent, a part of the main.\"",
      },
      {
        id: "r3-3",
        speaker: "N",
        en: "Now, a British academic has claimed that human individuality is indeed just an illusion, because societies are far more interconnected at a mental, physical, and cultural level than people realize.",
        marks: [22],
      },
      {
        id: "r3-4",
        speaker: "N",
        en: "In his new book, The Self Delusion, Professor Tom Oliver, a researcher in the Ecology and Evolution Group at the University of Reading, argues there is no such thing as self, and not even our bodies are truly us.",
      },
      {
        id: "r3-5",
        speaker: "N",
        en: "Just as Copernicus realized the Earth is not the center of the universe, Professor Oliver said society urgently needs a Copernican-like revolution to understand people are not detached beings, but rather part of one connected identity.",
      },
      {
        id: "r3-6",
        speaker: "N",
        en: "\"A significant milestone in the cultural evolution of human minds was the acceptance that the Earth is not the center of the universe—the so-called Copernican revolution,\" he writes.",
      },
      {
        id: "r3-7",
        speaker: "N",
        en: "\"However, we have one more big myth to dispose of: that we exist as independent selves at the center of a subjective universe.",
        marks: [23],
      },
      {
        id: "r3-8",
        speaker: "N",
        en: "You may feel as if you are an independent individual, acting autonomously in the world; that you have an unchanging inner self that persists throughout your lifetime, acting as a central anchor point with the world changing around you.",
      },
      {
        id: "r3-9",
        speaker: "N",
        en: "This is the illusion I seek to tackle.",
      },
      {
        id: "r3-10",
        speaker: "N",
        en: "We are intimately connected to the world around us.\"",
      },
      {
        id: "r3-11",
        speaker: "N",
        en: "Professor Oliver argues there are around 37 trillion cells in the body, but most have a lifespan of just a few days or weeks.",
        marks: [24],
      },
      {
        id: "r3-12",
        speaker: "N",
        en: "So, the material \"us\" is constantly changing.",
      },
      {
        id: "r3-13",
        speaker: "N",
        en: "In fact, there is no part of your body that has existed for more than 10 years.",
      },
      {
        id: "r3-14",
        speaker: "N",
        en: "Since our bodies are essentially made anew every few weeks, the material in them alone is clearly insufficient to explain the persistent thread of an identity.",
      },
      {
        id: "r3-15",
        speaker: "N",
        en: "Professor Oliver claims that individualism is actually bad for society, and only by realizing we are part of a bigger entity can we solve pressing environmental and societal problems.",
        marks: [25],
      },
      {
        id: "r3-16",
        speaker: "N",
        en: "\"Through selfish overconsumption, we are destroying the natural world and using non-renewable resources at an accelerating rate.",
      },
      {
        id: "r3-17",
        speaker: "N",
        en: "We are at a critical crossroads as a species where we must rapidly reform our mindsets and behavior to act in less selfish ways,\" he said.",
      },
      {
        id: "r3-18",
        speaker: "N",
        en: "\"So, let's open our eyes to the hidden connections all around us.\"",
      },
    ],
    notes: [
      { en: "just an illusion", zh: "不过是一种幻觉" },
      { en: "Copernican-like revolution", zh: "类似哥白尼的革命" },
      { en: "a significant milestone in the cultural evolution", zh: "人类心智文化演进中的一个重要里程碑" },
      { en: "one more big myth to dispose of", zh: "还有一个大迷思需要摒弃" },
      { en: "a central anchor point", zh: "一个核心的锚点" },
      { en: "the persistent thread of an identity", zh: "身份延续的那条线索" },
      { en: "overconsumption", zh: "过度消费" },
      { en: "a critical crossroads", zh: "一个关键的十字路口" },
    ],
  },
];

export const LISTENING_QUESTIONS: Question[] = [
  {
    n: 1,
    unitId: "l-c1",
    stem: "What does the woman say she will do?",
    stemZh: "女士说她将会做什么？",
    options: [
      {
        key: "A",
        en: "Reply to the man’s last proposal within a short time.",
        zh: "在短时间内回复男士上一次的提案。",
      },
      {
        key: "B",
        en: "Sign the agreement if one small change is made to it.",
        zh: "如果协议做一处小改动就把它签下来。",
      },
      {
        key: "C",
        en: "Make a sponsorship deal for her client at the meeting.",
        zh: "在会上为她的客户谈成一笔赞助交易。",
      },
      {
        key: "D",
        en: "Give the man some good news regarding the contract.",
        zh: "就合同的事给男士一些好消息。",
      },
    ],
    answer: "B",
    evidence: "I have indeed, and I wish to sign the agreement, pending one small change to be made to the contract.",
    explain: "女士明确说“pending one small change to be made to the contract”，即合同只改一处小地方她就愿意签字，与 B 对应。A 说“短时间内回复”不对，女士当场已答复；C 是男士抛出的疑问（是否为客户做赞助交易），不是女士要做的事；D 是男士要她给点好消息，主客颠倒。",
  },
  {
    n: 2,
    unitId: "l-c1",
    stem: "What does the man say about some people he represents?",
    stemZh: "男士如何评价他所代表的某些人？",
    options: [
      {
        key: "A",
        en: "They are becoming impatient.",
        zh: "他们正变得不耐烦。",
      },
      {
        key: "B",
        en: "They are afraid time is running out.",
        zh: "他们担心时间快不够用了。",
      },
      {
        key: "C",
        en: "They are used to making alterations.",
        zh: "他们习惯于反复作出修改。",
      },
      {
        key: "D",
        en: "They are concerned about the details.",
        zh: "他们很在意其中的细节。",
      },
    ],
    answer: "A",
    evidence: "I ask this because, frankly, some people at my end are running out of patience.",
    explain: "男士说“some people at my end are running out of patience”，即他这一方的人正在失去耐心，正是 A“变得不耐烦”。B“担心时间不够”把“耐心用完”曲解成“时间用完”；C“习惯于修改”指双方来回改合同将近一年，与这些人不耐烦无关；D“关心细节”是女士一方逐条核对合同的做法，主客也搞错了。",
  },
  {
    n: 3,
    unitId: "l-c1",
    stem: "What reason does the woman give for the new deal to exclude the Middle East?",
    stemZh: "女士为新合同排除中东给出了什么理由？",
    options: [
      {
        key: "A",
        en: "To prevent geographical discrimination.",
        zh: "为了避免地域歧视。",
      },
      {
        key: "B",
        en: "To tap the food and beverage market.",
        zh: "为了开拓食品饮料市场。",
      },
      {
        key: "C",
        en: "To avoid any conflict of interest.",
        zh: "为了避免任何利益冲突。",
      },
      {
        key: "D",
        en: "To reduce unfair competition.",
        zh: "为了减少不公平竞争。",
      },
    ],
    answer: "C",
    evidence: "Therefore, in order to avoid any conflict, we would need to ensure that both marketing campaigns do not overlap geographically.",
    explain: "女士给的理由是“in order to avoid any conflict”，并补充两场营销不能在同一地区重叠，即避免利益冲突，选 C。A“防止地域歧视”曲解了“不重叠”，原文讲的是营销活动不能在同一地区重叠，并非歧视；B“开拓食品饮料市场”无中生有；D“减少不公平竞争”原文根本没提竞争。",
  },
  {
    n: 4,
    unitId: "l-c1",
    stem: "What does the man say about the Middle East?",
    stemZh: "男士对中东说了什么？",
    options: [
      {
        key: "A",
        en: "It is a potential market for food and beverage.",
        zh: "中东是食品饮料行业一个有潜力的市场。",
      },
      {
        key: "B",
        en: "It is very attractive for real estate developers.",
        zh: "中东对房地产开发商很有吸引力。",
      },
      {
        key: "C",
        en: "It is a negligible market for his company.",
        zh: "中东对他的公司而言是个微不足道的市场。",
      },
      {
        key: "D",
        en: "It is very different from other markets.",
        zh: "中东与其他市场很不一样。",
      },
    ],
    answer: "C",
    evidence: "The Middle East is a negligible market for us.",
    explain: "男士说“The Middle East is a negligible market for us.”，即中东对他们公司而言微不足道，选 C。A 说成“潜在市场”，与 negligible 的意思正好相反；B“对地产开发商有吸引力”是把女士客户所在的行业挪用到男士公司；D“与其他市场很不一样”原文并无此比较，属于无中生有。",
  },
  {
    n: 5,
    unitId: "l-c2",
    stem: "What does the woman say about all the astronomers at the Denver Observatory?",
    stemZh: "女士说丹佛天文台的所有天文学家怎么样？",
    options: [
      {
        key: "A",
        en: "They are thrilled by a rare astronomic phenomenon.",
        zh: "他们为一个罕见的天文现象而激动不已。",
      },
      {
        key: "B",
        en: "They are celebrating a big event on mountain tops.",
        zh: "他们正在山顶上庆祝一场盛大的活动。",
      },
      {
        key: "C",
        en: "They are enthusiastic about big science-related stories.",
        zh: "他们热衷于重大的科学类新闻。",
      },
      {
        key: "D",
        en: "They are joined by astronomers all across North America.",
        zh: "全北美的天文学家都加入了他们。",
      },
    ],
    answer: "A",
    evidence: "Yes, all the astronomers on site here are very excited.",
    explain: "女士说“all the astronomers on site here are very excited”，激动之处在于今晚地球将极近距离掠过奥本海默彗星，这是百余年来最接近的一次，与 A“因罕见天文现象而兴奋”一致。B、D 把全北美聚集到山顶的人当成天文学家，原文说的是太空爱好者；C“热衷重大科学新闻”无中生有。",
  },
  {
    n: 6,
    unitId: "l-c2",
    stem: "What do we learn from the conversation about the Oppenheimer comet?",
    stemZh: "从对话中我们了解到奥本海默彗星的什么情况？",
    options: [
      {
        key: "A",
        en: "It will be the most formidable of its kind in over a century.",
        zh: "它将是一百多年来同类中最令人敬畏的一个。",
      },
      {
        key: "B",
        en: "It will come closest to Earth in more than one hundred years.",
        zh: "它将在一百多年来最接近地球一次。",
      },
      {
        key: "C",
        en: "It will eclipse many other such events in human history.",
        zh: "它将使人类历史上许多类似事件相形见绌。",
      },
      {
        key: "D",
        en: "It will be seen most clearly from Denver’s mountain tops.",
        zh: "从丹佛的山顶上看得最清楚。",
      },
    ],
    answer: "B",
    evidence: "It is the closest our planet has been to such a phenomenon in over 100 years.",
    explain: "女士说这是“the closest our planet has been to such a phenomenon in over 100 years”，即地球一百多年来离该现象最近的一次，与 B 的“一百多年”一致。A 偷换了 formidable 的意思，原文形容人们看到的这天体很震撼，并非同类中最强；C 无中生有；D 与“几乎正北、赤道以上六十度”的方位描述不符。",
  },
  {
    n: 7,
    unitId: "l-c2",
    stem: "What does the woman say people will only see in the sky without a telescope?",
    stemZh: "女士说不用望远镜，人们在天空中只能看到什么？",
    options: [
      {
        key: "A",
        en: "A blur.",
        zh: "一团模糊的影像。",
      },
      {
        key: "B",
        en: "Stars.",
        zh: "星星。",
      },
      {
        key: "C",
        en: "The edge of our galaxy.",
        zh: "我们银河系的边缘。",
      },
      {
        key: "D",
        en: "An ordinary flying object.",
        zh: "一个普普通通的飞行物。",
      },
    ],
    answer: "A",
    evidence: "People will only see a blur without one.",
    explain: "女士说“People will only see a blur without one.”，没有望远镜只能看到一团模糊，正是 A。B“银河边缘”是彗星所在的位置，不是肉眼所见之物；C“星星”无中生有；D“普通飞行物”曲解了原文的 this flying object，那个飞行物指的就是彗星本身，选项偷换了修饰语，意思正好相反。",
  },
  {
    n: 8,
    unitId: "l-c2",
    stem: "What do scientists at the Denver Observatory advise amateurs do to facilitate their observation?",
    stemZh: "丹佛天文台的科学家建议业余观测者做什么以便观测？",
    options: [
      {
        key: "A",
        en: "Use professional equipment.",
        zh: "使用专业设备。",
      },
      {
        key: "B",
        en: "Climb to the nearby heights.",
        zh: "爬到附近的高处去。",
      },
      {
        key: "C",
        en: "Fix their eyes due north.",
        zh: "把视线固定在正北方向。",
      },
      {
        key: "D",
        en: "Make use of phone apps.",
        zh: "利用手机应用程序。",
      },
    ],
    answer: "D",
    evidence: "However, finding the comet is, indeed, very tricky, and scientists here have told me there are plenty of phone apps that will facilitate this.",
    explain: "女士转述科学家的话，说有“plenty of phone apps that will facilitate this”，即用手机 App 帮观测者找到彗星，选 D。A“使用专业设备”与原文相左，原文明说不需要专业设备；B“爬到附近高处”是爱好者上山顶聚集；C“视线固定正北”讲的是彗星位置，不是观测办法。",
  },
  {
    n: 9,
    unitId: "l-b1",
    stem: "What question is said to have recently stirred debate?",
    stemZh: "据说最近引发争论的是哪个问题？",
    options: [
      {
        key: "A",
        en: "Whether consumers should be warned against ultra-processed foods.",
        zh: "是否应当提醒消费者少吃超加工食品。",
      },
      {
        key: "B",
        en: "Whether there is sufficient scientific consensus on dietary guidelines.",
        zh: "膳食指南是否已有充分的科学共识。",
      },
      {
        key: "C",
        en: "Whether guidelines can form the basis for nutrition advice to consumers.",
        zh: "指南能否成为面向消费者的营养建议依据。",
      },
      {
        key: "D",
        en: "Whether food scientists will agree on the concept of ultra-processed foods.",
        zh: "食品科学家是否会对超加工食品这一概念达成一致。",
      },
    ],
    answer: "A",
    evidence: "Should consumers be warned to avoid ultra-processed foods?",
    explain: "录音说“one question has recently stirred debate”，紧接着提的正是“Should consumers be warned to avoid ultra-processed foods?”，即是否该提醒消费者少吃超加工食品，选 A。B 错在原文说现有指南已有 strong scientific consensus，恰恰不是争议点；C“指南能否作为营养建议依据”只是开头的背景句；D“科学家会不会达成一致”则是无中生有，文中没有这种争议。",
  },
  {
    n: 10,
    unitId: "l-b1",
    stem: "How does the system developed by Monteiro and colleagues classify foods?",
    stemZh: "Monteiro 及其同事开发的体系如何给食物分类？",
    options: [
      {
        key: "A",
        en: "By the labor cost for the final products.",
        zh: "按最终产品的人工成本。",
      },
      {
        key: "B",
        en: "By the degree of industrial processing.",
        zh: "按工业加工程度。",
      },
      {
        key: "C",
        en: "By the extent of chemical alteration.",
        zh: "按化学改变的程度。",
      },
      {
        key: "D",
        en: "By the convention of classification.",
        zh: "按分类的惯例。",
      },
    ],
    answer: "B",
    evidence: "The debate centers around a system developed by Monteiro and colleagues that classifies foods by their degree of industrial processing, ranging from unprocessed to ultra-processed.",
    explain: "原文说这套体系“classifies foods by their degree of industrial processing”，即按工业加工程度从未加工到超加工分级，选 B。A“按最终产品的人工成本”无中生有；C“按化学改变程度”张冠李戴，那句讲的是超加工食品的定义，不是分类标准；D“按分类惯例”原文没有，属于凭空杜撰。",
  },
  {
    n: 11,
    unitId: "l-b1",
    stem: "What is consumption of ultra-processed foods linked with according to studies?",
    stemZh: "研究认为，食用超加工食品与什么有关？",
    options: [
      {
        key: "A",
        en: "Increased consumers’ expenses.",
        zh: "消费者支出增加。",
      },
      {
        key: "B",
        en: "Greater risk of chronic diseases.",
        zh: "慢性病风险上升。",
      },
      {
        key: "C",
        en: "People’s misunderstanding of nutrition.",
        zh: "人们对营养的误解。",
      },
      {
        key: "D",
        en: "Children’s dislike for unprocessed foods.",
        zh: "孩子对未加工食品的厌恶。",
      },
    ],
    answer: "B",
    evidence: "Studies have linked consumption of ultra-processed foods, which are often high in salt, sugar, and fat, with weight gain and an increased risk of chronic diseases, even after adjusting for the amount of salt, sugar, and fat in the diet.",
    explain: "原文说研究已把超加工食品的摄入与“an increased risk of chronic diseases”联系起来，即慢性病风险升高，选 B。A“消费者开支增加”无中生有；C“人们对营养的误解”原文没提；D“孩子不喜欢未加工食品”也无依据。原文还强调即使调整盐糖脂摄入量，这种关联依然存在。",
  },
  {
    n: 12,
    unitId: "l-b2",
    stem: "What do psychologists say people do when they are short of resources?",
    stemZh: "心理学家说人们在资源匮乏时会做什么？",
    options: [
      {
        key: "A",
        en: "They begin to think of the benefits of constraints.",
        zh: "他们开始想到限制带来的好处。",
      },
      {
        key: "B",
        en: "They try to seek solutions from creative people.",
        zh: "他们设法向有创意的人寻求解决办法。",
      },
      {
        key: "C",
        en: "They try hard to maximize their mental energy.",
        zh: "他们努力把自己的精神能量用到最大。",
      },
      {
        key: "D",
        en: "They begin to see the world in a different way.",
        zh: "他们开始用不同的眼光看世界。",
      },
    ],
    answer: "D",
    evidence: "According to psychologists, when you have less to work with, you actually begin to see the world differently.",
    explain: "心理学家说资源匮乏时“you actually begin to see the world differently”，即开始用不同的眼光看世界，选 D。A“开始想到约束的好处”、B“向有创意的人求助”均无中生有；C“尽力最大化心理能量”与原文相反，原文是“把精力投入更灵活的行动”，两者方向完全相反。",
  },
  {
    n: 13,
    unitId: "l-b2",
    stem: "What does the passage say about innovation?",
    stemZh: "短文对创新是怎么说的？",
    options: [
      {
        key: "A",
        en: "It is characteristic of all creative people.",
        zh: "它是所有有创造力的人的共同特征。",
      },
      {
        key: "B",
        en: "It is essential to pushing society forward.",
        zh: "它是推动社会前进所必需的。",
      },
      {
        key: "C",
        en: "It is a creative person’s response to limitation.",
        zh: "创新是创造者对限制的回应。",
      },
      {
        key: "D",
        en: "It is an impetus to socio-economic development.",
        zh: "它是社会经济发展的推动力。",
      },
    ],
    answer: "C",
    evidence: "Innovation is a creative person's response to limitation.",
    explain: "原文一句点明“Innovation is a creative person's response to limitation.”，创新是创造者对限制的回应，选 C。A“所有创造者的共同特征”以偏概全，原文谈的是创新如何产生，并非人人共有；B“推动社会前进的必要条件”、D“社会经济发展的推动力”原文都没有提，属于无中生有。",
  },
  {
    n: 14,
    unitId: "l-b2",
    stem: "What did a 2015 study by Ravi Mehta and Meng Zhu find?",
    stemZh: "Ravi Mehta 与 Meng Zhu 2015 年的研究发现了什么？",
    options: [
      {
        key: "A",
        en: "Scarcity or abundance of resources has little impact on people’s creativity.",
        zh: "资源的稀缺或富足对人的创造力影响很小。",
      },
      {
        key: "B",
        en: "Innovative people are not constrained in connecting unrelated concepts.",
        zh: "有创新的人不受限制地连接不相关的概念。",
      },
      {
        key: "C",
        en: "People have no incentive to use available resources in new ways.",
        zh: "人们没有动机用新的方式利用手边已有的资源。",
      },
      {
        key: "D",
        en: "Creative people tend to consume more available resources.",
        zh: "有创造力的人往往会消耗更多可获得的资源。",
      },
    ],
    answer: "C",
    evidence: "In a 2015 study, which examined how thinking about scarcity or abundance influences how creatively people use their resources, Ravi Mehta at the University of Illinois and Meng Zhu at Johns Hopkins University found that people simply have no incentive to use what's available to them in novel ways.",
    explain: "原文引述该研究，称人们“simply have no incentive to use what's available to them in novel ways”，即没有动机用新方式使用手边已有的资源，选 C。A 与原文相反，稀缺反而迫使人们更富创意；B“创新者不受限制地连接无关概念”曲解了下一句；D“创造者消耗更多资源”同样无中生有，文中并未讨论消耗。",
  },
  {
    n: 15,
    unitId: "l-b2",
    stem: "What did Marissa Mayer once write concerning creativity?",
    stemZh: "Marissa Mayer 曾就创造力写过什么？",
    options: [
      {
        key: "A",
        en: "It is key to a company’s survival.",
        zh: "它是公司生存的关键。",
      },
      {
        key: "B",
        en: "It shapes and focuses problems.",
        zh: "它塑造问题并让问题聚焦。",
      },
      {
        key: "C",
        en: "It is essential to meeting challenges.",
        zh: "它是应对挑战所必需的。",
      },
      {
        key: "D",
        en: "It thrives best when constrained.",
        zh: "越是受到约束，它越能发挥得最好。",
      },
    ],
    answer: "D",
    evidence: "Creativity thrives best when constrained.\"",
    explain: "Mayer 原话的后半句就是“Creativity thrives best when constrained.”，创造力在受约束时最见成效，选 D。A“公司生存的关键”无中生有；B“它塑造并聚焦问题”偷换主语，原文说“Constraints shape and focus problems”，是约束在塑造问题；C 同样把约束的作用安到了创造力头上，二者都属偷换概念，把修饰对象换了。",
  },
  {
    n: 16,
    unitId: "l-r1",
    stem: "Why does the speaker say strategies for managing conflicts can always be changed?",
    stemZh: "讲者为什么说处理冲突的策略总是可以改变的？",
    options: [
      {
        key: "A",
        en: "Because they are learned.",
        zh: "因为它们是后天学来的。",
      },
      {
        key: "B",
        en: "Because they come naturally.",
        zh: "因为它们是自然产生的。",
      },
      {
        key: "C",
        en: "Because they have to be properly personalized.",
        zh: "因为它们必须加以个性化。",
      },
      {
        key: "D",
        en: "Because there can be more effective strategies.",
        zh: "因为还可以有更有效的策略。",
      },
    ],
    answer: "A",
    evidence: "But, we do have a personal strategy, and because it is learned, we can always change it by learning new and more effective ways of managing conflicts.",
    explain: "讲者说冲突策略是后天学来的，“because it is learned, we can always change it”，所以才谈得上改进，选 A。B“因为它们天生而来”与 learned 正好相反；C“必须个性化”无中生有；D“因为可以有更有效的策略”是改变之后的结果，不是可以改变的原因，属于因果倒置，把结果当成了原因。",
  },
  {
    n: 17,
    unitId: "l-r1",
    stem: "What is said to affect the way one acts in a conflict?",
    stemZh: "据说是什么影响一个人在冲突中的行为方式？",
    options: [
      {
        key: "A",
        en: "The extent of difference and of similarity between the two sides.",
        zh: "双方之间的差异与相似程度。",
      },
      {
        key: "B",
        en: "The knowledge of the specific expectation the other side holds.",
        zh: "对对方具体期待的知情程度。",
      },
      {
        key: "C",
        en: "The importance of one’s goals and of the relationship.",
        zh: "个人目标与关系的重要性。",
      },
      {
        key: "D",
        en: "The approaches one adopts to conflict management.",
        zh: "一个人所采取的冲突处理方式。",
      },
    ],
    answer: "C",
    evidence: "How important your personal goals are, and how important the relationship is to you, affect how you act in a conflict.",
    explain: "原文说个人目标的重要性和关系的重要性“affect how you act in a conflict”，两者共同影响冲突中的行为，选 C。A“双方差异与相似程度”无中生有；B“对对方期待的了解”原文没提；D“自己采取的冲突管理方式”是后文要讲的五种风格，不是影响因素。",
  },
  {
    n: 18,
    unitId: "l-r1",
    stem: "Of the five styles the speaker discusses, which views conflicts as problems to be solved?",
    stemZh: "讲者讨论的五种风格中，哪一种把冲突看作有待解决的问题？",
    options: [
      {
        key: "A",
        en: "The fox.",
        zh: "狐狸。",
      },
      {
        key: "B",
        en: "The owl.",
        zh: "猫头鹰。",
      },
      {
        key: "C",
        en: "The shark.",
        zh: "鲨鱼。",
      },
      {
        key: "D",
        en: "The turtle.",
        zh: "乌龟。",
      },
    ],
    answer: "B",
    evidence: "Owls view conflicts as problems to be solved.",
    explain: "五种风格里只有猫头鹰“Owls view conflicts as problems to be solved.”，只有它把冲突当作待解决的问题，选 B。A 狐狸是双方各让一步、谋求双赢；C 鲨鱼要压倒对方、不惜代价；D 乌龟干脆躲进壳里回避冲突，三者都与“待解决的问题”这一说法不符，题干问的是把冲突当成问题来解决的这种风格。",
  },
  {
    n: 19,
    unitId: "l-r2",
    stem: "What do scientists hope to do by cracking the genetic code of plants and animals?",
    stemZh: "科学家希望通过破解动植物的遗传密码做到什么？",
    options: [
      {
        key: "A",
        en: "Help save species from extinction and boost human health.",
        zh: "帮助物种免于灭绝并促进人类健康。",
      },
      {
        key: "B",
        en: "Understand how plants and animals perished over the past.",
        zh: "弄清过去的动植物是如何消亡的。",
      },
      {
        key: "C",
        en: "Help gather information publicly available to researchers.",
        zh: "帮助汇集可以向研究者公开的信息。",
      },
      {
        key: "D",
        en: "Find out the cause of extinction of Britain’s 66,000 species.",
        zh: "查明英国六万六千个物种灭绝的原因。",
      },
    ],
    answer: "A",
    evidence: "The genetic code of all 1.5 million known species of animals and plants living on Earth will be mapped to help save species from extinction and boost human health.",
    explain: "开头即说绘制所有物种的遗传密码图谱是为了“help save species from extinction and boost human health”，选 A。B“弄清动植物过去如何灭绝”无中生有；C“收集公开信息”是项目完成后的结果，不是目的；D“查明英国六万六千个物种灭绝的原因”把物种总数当成了灭绝数。",
  },
  {
    n: 20,
    unitId: "l-r2",
    stem: "What do many scientists believe with regard to Earth?",
    stemZh: "许多科学家对地球有何看法？",
    options: [
      {
        key: "A",
        en: "It was once dominated by dinosaurs.",
        zh: "它曾由恐龙主宰。",
      },
      {
        key: "B",
        en: "It has entered the sixth mass extinction.",
        zh: "它已进入第六次大灭绝。",
      },
      {
        key: "C",
        en: "Its prospects depend on future human behaviour.",
        zh: "它的前景取决于人类未来的行为。",
      },
      {
        key: "D",
        en: "Its climate change is aggravated by humans.",
        zh: "它的气候变化被人类加剧了。",
      },
    ],
    answer: "B",
    evidence: "Many scientists believe that Earth has now entered the sixth mass extinction, with humans creating a toxic mix of habitat loss, pollution, and climate change, which has already led to the loss of at least 77 species of mammals and 140 types of birds since 1500.",
    explain: "原文说“Many scientists believe that Earth has now entered the sixth mass extinction”，即许多科学家认为地球已进入第六次大灭绝，选 B。A“曾由恐龙统治”张冠李戴，原文说的是自恐龙灭绝以来物种损失最大；C“取决于人类未来的行为”原文没有；D“人类加剧气候变化”只是原因之一，代替不了主旨判断。",
  },
  {
    n: 21,
    unitId: "l-r2",
    stem: "How does Sir Jim Smith, director of science at Wellcome, describe the Darwin Tree of Life project?",
    stemZh: "Wellcome 科学总监 Jim Smith 爵士如何描述「达尔文生命之树」项目？",
    options: [
      {
        key: "A",
        en: "It dwarfs all other efforts to conserve, protect and restore biodiversity on earth.",
        zh: "它让地球上其他所有保护、保育和恢复生物多样性的努力都相形见绌。",
      },
      {
        key: "B",
        en: "It is costly to get started and requires the joint efforts of thousands of scientists.",
        zh: "它启动成本高昂，需要数千名科学家通力合作。",
      },
      {
        key: "C",
        en: "It can help to bring back the large numbers of plants and animals that have gone extinct.",
        zh: "它能让大量已经灭绝的动植物重新出现。",
      },
      {
        key: "D",
        en: "It is the most exciting, most relevant, most timely and most internationally inspirational.",
        zh: "它是最令人激动、最切题、最及时、最具国际启发性的项目。",
      },
    ],
    answer: "D",
    evidence: "Sir Jim Smith, director of science at Wellcome, said, \"Try as I might, I can't think of a more exciting, more relevant, more timely, or more internationally inspirational project.",
    explain: "Smith 说想不到比它“a more exciting, more relevant, more timely, or more internationally inspirational project”更的项目，即最令人激动、最切题、最及时、最具国际启发性，选 D。A“凌驾于一切保护努力之上”无中生有；B“需数千科学家通力合作”说的是项目本身的情况而非他的评价；C“让灭绝动物复活”原文并没有这个承诺。",
  },
  {
    n: 22,
    unitId: "l-r3",
    stem: "What is indeed just an illusion according to Professor Tom Oliver?",
    stemZh: "在 Tom Oliver 教授看来，什么其实只是一种幻觉？",
    options: [
      {
        key: "A",
        en: "Cultural identity.",
        zh: "文化认同。",
      },
      {
        key: "B",
        en: "Social evolution.",
        zh: "社会进化。",
      },
      {
        key: "C",
        en: "The Copernican revolution.",
        zh: "哥白尼革命。",
      },
      {
        key: "D",
        en: "Human individuality.",
        zh: "人类的个体性。",
      },
    ],
    answer: "D",
    evidence: "Now, a British academic has claimed that human individuality is indeed just an illusion, because societies are far more interconnected at a mental, physical, and cultural level than people realize.",
    explain: "原文说“human individuality is indeed just an illusion”，人类的个体性不过是一种幻觉，选 D。A“文化认同”、B“社会进化”无中生有；C“哥白尼革命”张冠李戴，那是作者用来类比的、需要一场类似哥白尼的思想变革，而不是被否定的那个幻觉本身，属于概念偷换。",
  },
  {
    n: 23,
    unitId: "l-r3",
    stem: "What does Professor Tom Oliver think of the idea that we exist as independent selves at the center of a subjective universe?",
    stemZh: "Tom Oliver 教授如何看待「我们作为独立的自我存在于主观宇宙中心」这一观念？",
    options: [
      {
        key: "A",
        en: "It is a delusion to be disposed of.",
        zh: "这是应当被抛弃的谬见。",
      },
      {
        key: "B",
        en: "It is prevalent even among academics.",
        zh: "即使在学者当中也很流行。",
      },
      {
        key: "C",
        en: "It is a myth spread by John Donne’s poem.",
        zh: "这是约翰·多恩的诗所散布的迷思。",
      },
      {
        key: "D",
        en: "It is rooted in the mindset of the 17th century.",
        zh: "它根植于十七世纪的思维观念。",
      },
    ],
    answer: "A",
    evidence: "However, we have one more big myth to dispose of: that we exist as independent selves at the center of a subjective universe.",
    explain: "作者说还有一个“one more big myth to dispose of”，即我们是以自己为中心、独立存在于主观宇宙中，这观念该被抛弃，选 A。B“约翰·多恩的诗所散布的迷思”张冠李戴，诗只是开篇引语；C“学者中也流行”原文没有；D“根植于十七世纪”也不成立，恰恰相反。",
  },
  {
    n: 24,
    unitId: "l-r3",
    stem: "Why does Professor Tom Oliver claim that the material \"us\" is constantly changing?",
    stemZh: "Tom Oliver 教授为什么声称物质层面的「我们」在不断变化？",
    options: [
      {
        key: "A",
        en: "He believes in Copernican philosophical doctrines about the universe.",
        zh: "他信奉关于宇宙的哥白尼哲学学说。",
      },
      {
        key: "B",
        en: "He has gained ample scientific evidence at the University of Reading.",
        zh: "他在雷丁大学获得了大量科学证据。",
      },
      {
        key: "C",
        en: "He has found that our inner self and material self are interconnected.",
        zh: "他发现内在自我与物质自我是相互联结的。",
      },
      {
        key: "D",
        en: "He contends most of our body cells can only live a few days or weeks.",
        zh: "他主张我们体内大多数细胞只能存活几天或几周。",
      },
    ],
    answer: "D",
    evidence: "Professor Oliver argues there are around 37 trillion cells in the body, but most have a lifespan of just a few days or weeks.",
    explain: "原文说多数细胞“most have a lifespan of just a few days or weeks”，所以物质层面的“我们”不断更替，选 D。A“信奉哥白尼宇宙观”是作者的类比；B“在雷丁大学获得大量科学证据”无中生有；C“内在自我与物质自我相互联结”与原文相反，作者认为单靠物质不足以解释持久的身份。",
  },
  {
    n: 25,
    unitId: "l-r3",
    stem: "How can we solve pressing environmental and societal problems according to Professor Tom Oliver?",
    stemZh: "按照 Tom Oliver 教授的说法，我们如何解决紧迫的环境和社会问题？",
    options: [
      {
        key: "A",
        en: "By coming to see how disruptive such problems have got to be.",
        zh: "通过看清这类问题已经变得多么具有破坏性。",
      },
      {
        key: "B",
        en: "By realising that we all can do our own bit in such endeavours.",
        zh: "通过意识到我们在这类事业中都能尽自己的一份力。",
      },
      {
        key: "C",
        en: "By becoming aware that we are part of a bigger world.",
        zh: "通过意识到自己是一个更大整体的一部分。",
      },
      {
        key: "D",
        en: "By making joint efforts resolutely and persistently.",
        zh: "通过坚决而持久地共同努力。",
      },
    ],
    answer: "C",
    evidence: "Professor Oliver claims that individualism is actually bad for society, and only by realizing we are part of a bigger entity can we solve pressing environmental and societal problems.",
    explain: "原文说“only by realizing we are part of a bigger entity can we solve pressing environmental and societal problems”，即只有意识到自己属于更大的整体才能解决环境与社会问题，选 C。A“看清问题有多严重”、B“人人尽自己的一份力”均无中生有；D“坚决持久地共同努力”原文没提共同努力，只说要转变自私的心态与行为。",
  },
];
