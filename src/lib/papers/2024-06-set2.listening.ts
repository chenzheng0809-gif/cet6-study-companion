import type { ListeningUnit, Question } from "./types";

/**
 * 2024 年 06 月六级 · 第 2 套 · Part II Listening Comprehension
 *
 * 选项来自《2024年06月大学英语六级考试真题（第2套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第2套）》PDF（用户提供）。
 *
 * 卷面不印听力题干 —— 2024 年起六级听力只印 A–D 选项，题干只在录音里念出来。
 * 所以这里的 stem 全部取自录音转写，是录音里真实读过的那句话。
 *
 * 听力原文是录音的机器转写（listen_audio），可能有极少数识别误差；
 * 单元窗口来自对同一段 MP3 的静音能量分析，答题停顿固定在 13.3–13.8 秒，
 * 全卷检出 25 个，与卷面 25 道题一一对应。
 */

export const LISTENING_UNITS: ListeningUnit[] = [
  {
    id: "l-c1",
    label: "Conversation One",
    labelZh: "对话一 · 一台果汁机和厨房小家电",
    section: "A",
    questionRange: [1, 4],
    window: {
      startSec: 52.5,
      endSec: 172.66,
    },
    stemsWindow: {
      startSec: 172.66,
      endSec: 239.24,
      questions: [2, 3, 4],
    },
    questionWindows: [
      { n: 1, startSec: 168.06, endSec: 172.66 },
      { n: 2, startSec: 186.0, endSec: 190.04 },
      { n: 3, startSec: 203.3, endSec: 207.54 },
      { n: 4, startSec: 220.78, endSec: 225.76 },
    ],
    transcript: [
      {
        id: "c1-1",
        speaker: "M",
        en: "I've just bought a new blender.",
      },
      {
        id: "c1-2",
        speaker: "W",
        en: "What's that?",
      },
      {
        id: "c1-3",
        speaker: "M",
        en: "A blender, you know, a machine that blends food.",
      },
      {
        id: "c1-4",
        speaker: "W",
        en: "Ah, yes, of course, the electric kitchen appliance.",
      },
      {
        id: "c1-5",
        speaker: "M",
        en: "Exactly.",
      },
      {
        id: "c1-6",
        speaker: "M",
        en: "This one is state of the art.",
      },
      {
        id: "c1-7",
        speaker: "M",
        en: "I've been meaning to buy one for a while, and I did thorough research on which specific model to get.",
      },
      {
        id: "c1-8",
        speaker: "M",
        en: "I read through maybe hundreds of online user reviews.",
        marks: [1],
      },
      {
        id: "c1-9",
        speaker: "M",
        en: "Anyway, it's amazing.",
      },
      {
        id: "c1-10",
        speaker: "W",
        en: "Really?",
      },
      {
        id: "c1-11",
        speaker: "W",
        en: "What could be so special about it?",
      },
      {
        id: "c1-12",
        speaker: "W",
        en: "I mean, it's just a blender.",
      },
      {
        id: "c1-13",
        speaker: "M",
        en: "Well, basically, it's just a very good one.",
      },
      {
        id: "c1-14",
        speaker: "M",
        en: "It feels heavy and sturdy and well made.",
      },
      {
        id: "c1-15",
        speaker: "M",
        en: "It also has lots of power, and can easily cut and crush practically anything.",
      },
      {
        id: "c1-16",
        speaker: "M",
        en: "This way, the soups and juices I make come out really fine and smooth, with no lumpy bits.",
      },
      {
        id: "c1-17",
        speaker: "W",
        en: "Mm, I see.",
      },
      {
        id: "c1-18",
        speaker: "W",
        en: "I've never thought of getting one myself.",
        marks: [2],
      },
      {
        id: "c1-19",
        speaker: "W",
        en: "It sounds like the kind of thing that, for me personally, I would rarely use.",
      },
      {
        id: "c1-20",
        speaker: "M",
        en: "I've never had one before, and now that I do, I use it all the time.",
      },
      {
        id: "c1-21",
        speaker: "M",
        en: "I make a fresh fruit juice in the morning.",
        marks: [3],
      },
      {
        id: "c1-22",
        speaker: "M",
        en: "Maybe not every morning, but three or four times a week, and it feels fantastic.",
      },
      {
        id: "c1-23",
        speaker: "M",
        en: "It's a really healthy habit.",
      },
      {
        id: "c1-24",
        speaker: "W",
        en: "I can imagine that must feel quite satisfying.",
      },
      {
        id: "c1-25",
        speaker: "W",
        en: "I can picture you getting all creative in the kitchen, and trying out a multitude of different ingredients.",
      },
      {
        id: "c1-26",
        speaker: "W",
        en: "And it's obviously going to be healthier than buying packaged juice from a supermarket.",
      },
      {
        id: "c1-27",
        speaker: "M",
        en: "It's so much healthier, it's not even close.",
      },
      {
        id: "c1-28",
        speaker: "M",
        en: "Did you know that store-bought juice is like 10% sugar?",
        marks: [4],
      },
      {
        id: "c1-29",
        speaker: "W",
        en: "Right.",
      },
      {
        id: "c1-30",
        speaker: "W",
        en: "So then, you bought it for the health benefits?",
      },
      {
        id: "c1-31",
        speaker: "M",
        en: "Mostly, yes.",
      },
      {
        id: "c1-32",
        speaker: "M",
        en: "Basically, it allows me to have a more varied diet with a far wider assortment of nutrients.",
      },
      {
        id: "c1-33",
        speaker: "M",
        en: "Because it's not only fruit in my morning juices, you see.",
      },
      {
        id: "c1-34",
        speaker: "M",
        en: "I can also throw in vegetables, nuts, yogurts, cereals, anything that tickles my fancy.",
      },
    ],
    notes: [
      { en: "state of the art", zh: "最先进的技术" },
      { en: "thorough research", zh: "详尽的调研" },
      { en: "sturdy", zh: "结实的；坚固的" },
      { en: "lumpy bits", zh: "结块的小颗粒" },
      { en: "multitude", zh: "大量；众多" },
      { en: "tickles my fancy", zh: "合我的口味；吊起我的胃口" },
      { en: "packaged juice", zh: "包装成品果汁" },
      { en: "assortment of nutrients", zh: "种类繁多的营养成分" },
    ],
  },
  {
    id: "l-c2",
    label: "Conversation Two",
    labelZh: "对话二 · 村长眼中的村庄改造",
    section: "A",
    questionRange: [5, 8],
    window: {
      startSec: 239.24,
      endSec: 370.66,
    },
    stemsWindow: {
      startSec: 370.66,
      endSec: 440.6,
      questions: [6, 7, 8],
    },
    questionWindows: [
      { n: 5, startSec: 365.2, endSec: 370.66 },
      { n: 6, startSec: 384.12, endSec: 388.18 },
      { n: 7, startSec: 401.74, endSec: 408.76 },
      { n: 8, startSec: 422.34, endSec: 426.96 },
    ],
    transcript: [
      {
        id: "c2-1",
        speaker: "W",
        en: "Today we have a very interesting guest, Mr.",
      },
      {
        id: "c2-2",
        speaker: "W",
        en: "Thomas Benjamin Grimm, the mayor of Birkton, is here to talk about his job and responsibilities overseeing this charming village.",
      },
      {
        id: "c2-3",
        speaker: "W",
        en: "Mr.",
      },
      {
        id: "c2-4",
        speaker: "W",
        en: "Grimm, thank you for being here.",
      },
      {
        id: "c2-5",
        speaker: "M",
        en: "Thank you for having me.",
      },
      {
        id: "c2-6",
        speaker: "W",
        en: "I'd like to start by stating the obvious.",
      },
      {
        id: "c2-7",
        speaker: "W",
        en: "Birkton has become one of the most popular tourist destinations in the country, and this has happened under your watch.",
      },
      {
        id: "c2-8",
        speaker: "W",
        en: "Just how did you achieve this?",
      },
      {
        id: "c2-9",
        speaker: "M",
        en: "The achievement belongs to all the residents of Birkton.",
      },
      {
        id: "c2-10",
        speaker: "M",
        en: "It was a shared effort where everybody pitched in for the communal good.",
      },
      {
        id: "c2-11",
        speaker: "W",
        en: "But how did this change happen?",
        marks: [5],
      },
      {
        id: "c2-12",
        speaker: "W",
        en: "In about 10 years, Birkton has gone from a relatively unheard of, sleepy village to a must-see destination.",
        marks: [6],
      },
      {
        id: "c2-13",
        speaker: "M",
        en: "Yes, the change has truly been remarkable.",
      },
      {
        id: "c2-14",
        speaker: "M",
        en: "Birkton was always fortunate to be endowed with such a beautiful natural allure.",
      },
      {
        id: "c2-15",
        speaker: "M",
        en: "The Endbury Hills above the village remain untouched by human development, and the Sonora Valley just below it is equally stunning.",
      },
      {
        id: "c2-16",
        speaker: "M",
        en: "The transformation commenced in a town hall meeting in Spring 2008, over 10 years ago now, when an overwhelming majority of neighbors voted in favor of Motion 836.",
      },
      {
        id: "c2-17",
        speaker: "M",
        en: "This legislative proposal essentially set out to harmonize the aesthetic appearance of all the houses in Birkton.",
        marks: [7],
      },
      {
        id: "c2-18",
        speaker: "M",
        en: "The idea was that if all the properties looked a certain way, with shared design features, then the village as a whole would look more beautiful.",
      },
      {
        id: "c2-19",
        speaker: "M",
        en: "And it worked.",
      },
      {
        id: "c2-20",
        speaker: "W",
        en: "It certainly did.",
      },
      {
        id: "c2-21",
        speaker: "W",
        en: "I'm looking now at a before and after photo, and the change is truly remarkable.",
      },
      {
        id: "c2-22",
        speaker: "W",
        en: "It's hard to believe it's the same place.",
      },
      {
        id: "c2-23",
        speaker: "W",
        en: "And how do the neighbors feel now?",
      },
      {
        id: "c2-24",
        speaker: "M",
        en: "Great pride, I would say.",
      },
      {
        id: "c2-25",
        speaker: "W",
        en: "But what about the multitudes of visitors now crowding the streets?",
      },
      {
        id: "c2-26",
        speaker: "W",
        en: "Is everyone happy about that?",
      },
      {
        id: "c2-27",
        speaker: "M",
        en: "The tourists we receive are a blessing as they have completely revitalized our local economy.",
        marks: [8],
      },
      {
        id: "c2-28",
        speaker: "M",
        en: "Every visitor is warmly welcome.",
      },
    ],
    notes: [
      { en: "unheard of", zh: "默默无闻的；鲜为人知的" },
      { en: "communal good", zh: "公共利益" },
      { en: "natural allure", zh: "自然之美" },
      { en: "commenced", zh: "开始；发起" },
      { en: "legislative proposal", zh: "立法提案" },
      { en: "aesthetic appearance", zh: "外观美感" },
      { en: "revitalized", zh: "使复兴；振兴" },
      { en: "multitudes of visitors", zh: "大批游客" },
    ],
  },
  {
    id: "l-b1",
    label: "Passage One",
    labelZh: "短文一 · 能弯曲、爬行、跳跃的微型机器人",
    section: "B",
    questionRange: [9, 11],
    window: {
      startSec: 440.6,
      endSec: 592.84,
    },
    stemsWindow: {
      startSec: 592.84,
      endSec: 642.68,
      questions: [10, 11],
    },
    questionWindows: [
      { n: 9, startSec: 586.9, endSec: 592.84 },
      { n: 10, startSec: 606.34, endSec: 610.78 },
      { n: 11, startSec: 624.28, endSec: 629.24 },
    ],
    transcript: [
      {
        id: "b1-1",
        speaker: "M",
        en: "Researchers in the US have created a remote-controlled robot that is so small it can walk on the top of a US penny.",
      },
      {
        id: "b1-2",
        speaker: "M",
        en: "In research published in the journal Science Robotics, a team at Northwestern University said the crab-like robot is 0.5 millimeters wide.",
      },
      {
        id: "b1-3",
        speaker: "M",
        en: "Researchers described it as the smallest ever remote-controlled walking robot.",
        marks: [9],
      },
      {
        id: "b1-4",
        speaker: "M",
        en: "The tiny robot can bend, twist, crawl, walk, turn, and even jump without the use of complex hardware or special power.",
      },
      {
        id: "b1-5",
        speaker: "M",
        en: "The engineers said this is because the robot is powered by the elastic property of its body.",
        marks: [10],
      },
      {
        id: "b1-6",
        speaker: "M",
        en: "To construct the robot, the researchers used a shape-memory alloy material that transforms to its remembered shape when heated.",
      },
      {
        id: "b1-7",
        speaker: "M",
        en: "Using a laser, the team is able to heat the robot at specific parts of its body, causing it to change shape.",
      },
      {
        id: "b1-8",
        speaker: "M",
        en: "As the robot deforms and goes back to its original shape, it creates movement from one place to another.",
      },
      {
        id: "b1-9",
        speaker: "M",
        en: "Because these structures are so tiny, the rate of cooling is very fast, project lead Professor John A.",
      },
      {
        id: "b1-10",
        speaker: "M",
        en: "Rogers said.",
      },
      {
        id: "b1-11",
        speaker: "M",
        en: "In fact, reducing the sizes of these robots allows them to run faster.",
      },
      {
        id: "b1-12",
        speaker: "M",
        en: "While the research is still in the exploratory phase, the team believes that technology could lead to micro-sized robots that can perform practical tasks in tightly confined spaces.",
        marks: [11],
      },
      {
        id: "b1-13",
        speaker: "M",
        en: "\"You might imagine micro-robots as agents to repair or assemble small structures or machines in industry, or as surgical assistants to clear clogged arteries, to stop internal bleeding, or to eliminate cancerous tumors, all in minimally invasive procedures,\" Rogers said.",
      },
    ],
    notes: [
      { en: "remote-controlled", zh: "遥控的" },
      { en: "shape-memory alloy", zh: "形状记忆合金" },
      { en: "elastic property", zh: "弹性性能" },
      { en: "exploratory phase", zh: "探索阶段" },
      { en: "micro-sized robots", zh: "微型机器人" },
      { en: "tightly confined spaces", zh: "极其狭窄受限的空间" },
      { en: "minimally invasive procedures", zh: "微创手术" },
      { en: "surgical assistants", zh: "外科手术助手" },
    ],
  },
  {
    id: "l-b2",
    label: "Passage Two",
    labelZh: "短文二 · 能马拉松式睡觉的人",
    section: "B",
    questionRange: [12, 15],
    window: {
      startSec: 642.68,
      endSec: 756.48,
    },
    stemsWindow: {
      startSec: 756.48,
      endSec: 827.24,
      questions: [13, 14, 15],
    },
    questionWindows: [
      { n: 12, startSec: 751.24, endSec: 756.48 },
      { n: 13, startSec: 770.22, endSec: 775.18 },
      { n: 14, startSec: 788.64, endSec: 793.84 },
      { n: 15, startSec: 807.44, endSec: 813.68 },
    ],
    transcript: [
      {
        id: "b2-1",
        speaker: "W",
        en: "I don't want to boast or anything, but I have always considered myself something of an elite sleeper.",
      },
      {
        id: "b2-2",
        speaker: "W",
        en: "Given the opportunity, I will sleep for marathon stretches, and can doze through the most extreme situations.",
      },
      {
        id: "b2-3",
        speaker: "W",
        en: "On one very rough ferry crossing on the route to the Isles of Scilly, for example, my traveling companion spent the entire three-hour ride throwing up in the bathroom, while I dozed happily on a plastic chair.",
        marks: [12],
      },
      {
        id: "b2-4",
        speaker: "W",
        en: "Unfortunately, it has come to my attention that I am not an elite sleeper after all.",
      },
      {
        id: "b2-5",
        speaker: "W",
        en: "It seems I am just lazy.",
      },
      {
        id: "b2-6",
        speaker: "W",
        en: "Because elite sleepers are defined as the approximately 3% of the population who are biologically programmed to need less sleep than the rest of us.",
        marks: [13],
      },
      {
        id: "b2-7",
        speaker: "W",
        en: "According to a study that came out in March, elite sleepers have rare genetic changes, which means they can sleep fewer hours than mere mortals without any risk of cognitive decline.",
      },
      {
        id: "b2-8",
        speaker: "W",
        en: "It may not be possible to change your own genes, but can you train yourself to need less sleep?",
        marks: [14],
      },
      {
        id: "b2-9",
        speaker: "W",
        en: "Is there a non-biological way to reach elite sleeper status?",
      },
      {
        id: "b2-10",
        speaker: "W",
        en: "I have spent the past year trying to answer that question.",
      },
      {
        id: "b2-11",
        speaker: "W",
        en: "Not for fun, I should add, but because having a baby has severely disrupted my sleep, for which I still have a great passion.",
      },
      {
        id: "b2-12",
        speaker: "W",
        en: "For a while, I assumed I'd be forced to become one of those people who jump out of bed at the crack of dawn.",
      },
      {
        id: "b2-13",
        speaker: "W",
        en: "After a year of tough scientific study, however, I have discovered being forced to get up early in the morning is very different from being an early bird.",
        marks: [15],
      },
    ],
    notes: [
      { en: "elite sleeper", zh: "睡眠精英" },
      { en: "marathon stretches", zh: "马拉松式的长时间" },
      { en: "doze through", zh: "熬过；挺过" },
      { en: "biologically programmed", zh: "由生理机制决定的" },
      { en: "cognitive decline", zh: "认知能力衰退" },
      { en: "mere mortals", zh: "凡人" },
      { en: "at the crack of dawn", zh: "黎明破晓时分" },
      { en: "early bird", zh: "早起族" },
    ],
  },
  {
    id: "l-r1",
    label: "Recording One",
    labelZh: "讲座一 · 童年的体罚记忆与信念改变",
    section: "C",
    questionRange: [16, 18],
    window: {
      startSec: 827.24,
      endSec: 1026.38,
    },
    stemsWindow: {
      startSec: 1026.38,
      endSec: 1078.52,
      questions: [17, 18],
    },
    questionWindows: [
      { n: 16, startSec: 1019.36, endSec: 1026.38 },
      { n: 17, startSec: 1039.88, endSec: 1046.66 },
      { n: 18, startSec: 1060.14, endSec: 1064.92 },
    ],
    transcript: [
      {
        id: "r1-1",
        speaker: "N",
        en: "If you read an article about a controversial issue, do you think you'd realize if it had changed your beliefs?",
      },
      {
        id: "r1-2",
        speaker: "N",
        en: "No one knows your own mind like you do.",
      },
      {
        id: "r1-3",
        speaker: "N",
        en: "It seems obvious that you would know if your beliefs had shifted.",
      },
      {
        id: "r1-4",
        speaker: "N",
        en: "And yet, a new paper in the Quarterly Journal of Experimental Psychology suggests that we actually have very poor awareness of our own belief change, meaning that we will tend to underestimate how much we've been swayed by a convincing article.",
        marks: [16],
      },
      {
        id: "r1-5",
        speaker: "N",
        en: "The researchers recruited over 200 undergraduates across two studies and focused on their beliefs about whether physical punishment of kids is an effective form of discipline.",
      },
      {
        id: "r1-6",
        speaker: "N",
        en: "The students reported their initial beliefs about whether physical punishment is an effective way to discipline a child on a scale from 1 (completely disbelieve) to 9 (completely believe).",
      },
      {
        id: "r1-7",
        speaker: "N",
        en: "Several weeks later, they were given one of two research-based texts to read.",
      },
      {
        id: "r1-8",
        speaker: "N",
        en: "Each was several pages long and either presented the arguments and data in favor of physical punishment or against it.",
      },
      {
        id: "r1-9",
        speaker: "N",
        en: "After this, the students answered some questions to test their comprehension and memory of the text.",
      },
      {
        id: "r1-10",
        speaker: "N",
        en: "Then, the students again scored their belief in whether physical punishment is effective or not.",
      },
      {
        id: "r1-11",
        speaker: "N",
        en: "Finally, the researchers asked them to recall what their belief had been at the start of the study.",
      },
      {
        id: "r1-12",
        speaker: "N",
        en: "The students' belief about physical punishment changed when they read a text that argued against their own initial position.",
        marks: [17],
      },
      {
        id: "r1-13",
        speaker: "N",
        en: "Crucially, the memory of their initial belief was shifted in the direction of their new belief.",
      },
      {
        id: "r1-14",
        speaker: "N",
        en: "In fact, their memory was closer to their current belief than their original belief.",
      },
      {
        id: "r1-15",
        speaker: "N",
        en: "The more their belief had changed, the larger this memory bias tended to be, suggesting the students were relying on their current belief to deduce their initial belief.",
      },
      {
        id: "r1-16",
        speaker: "N",
        en: "The memory bias was unrelated to the measures of how well they'd understood or recalled the text, suggesting these factors didn't play a role in memory of initial belief or awareness of belief change.",
      },
      {
        id: "r1-17",
        speaker: "N",
        en: "The researchers concede that this research was about changes to mostly moderate beliefs.",
      },
      {
        id: "r1-18",
        speaker: "N",
        en: "It's likely the findings would be different in the context of changes to extreme or deeply held beliefs.",
        marks: [18],
      },
      {
        id: "r1-19",
        speaker: "N",
        en: "However, our beliefs on most topics are in the moderate range, and as we go about our daily lives reading informative material, these intriguing findings suggest we are mostly ignorant of how what we just read has updated and altered our own position.",
      },
    ],
    notes: [
      { en: "controversial issue", zh: "有争议的话题" },
      { en: "poor awareness", zh: "糟糕的觉察力" },
      { en: "underestimate", zh: "低估" },
      { en: "physical punishment", zh: "体罚" },
      { en: "memory bias", zh: "记忆偏差" },
      { en: "concede", zh: "承认" },
      { en: "deeply held beliefs", zh: "根深蒂固的信念" },
      { en: "updated and altered", zh: "更新并改变" },
    ],
  },
  {
    id: "l-r2",
    label: "Recording Two",
    labelZh: "讲座二 · 美国母亲节与「母亲」这个词",
    section: "C",
    questionRange: [19, 21],
    window: {
      startSec: 1078.52,
      endSec: 1253.66,
    },
    stemsWindow: {
      startSec: 1253.66,
      endSec: 1306.74,
      questions: [20, 21],
    },
    questionWindows: [
      { n: 19, startSec: 1247.74, endSec: 1253.66 },
      { n: 20, startSec: 1267.1, endSec: 1273.52 },
      { n: 21, startSec: 1287.04, endSec: 1292.96 },
    ],
    transcript: [
      {
        id: "r2-1",
        speaker: "N",
        en: "As the American population grows, so does the number of American moms.",
      },
      {
        id: "r2-2",
        speaker: "N",
        en: "But, more than a century after Mother's Day became an official holiday, even as that number increases, the share of the American population who are mothers is at the lowest point in a quarter century.",
      },
      {
        id: "r2-3",
        speaker: "N",
        en: "It's frequently noted that fertility rates are falling sharply in richer countries, but the less observed consequence of this trend is that a decline in births can also mean a decline in motherhood in general.",
      },
      {
        id: "r2-4",
        speaker: "N",
        en: "According to my analysis of data from the Census Bureau, the decline of American motherhood is real, occurring very quickly, and may continue for some time yet.",
        marks: [19],
      },
      {
        id: "r2-5",
        speaker: "N",
        en: "Not only are moms making up less of the population, but their characteristics are changing, too, and in a way that might be linked to their proportional decline.",
      },
      {
        id: "r2-6",
        speaker: "N",
        en: "Moms today tend to be older than in the past.",
      },
      {
        id: "r2-7",
        speaker: "N",
        en: "Just looking at recent years, the change in age-specific birth rates has been drastic.",
      },
      {
        id: "r2-8",
        speaker: "N",
        en: "In just the past few years, the peak childbearing age range for American women has advanced from that of 25 to 29 to that of 30 to 34.",
      },
      {
        id: "r2-9",
        speaker: "N",
        en: "Meanwhile, childbearing among women under 20 has fallen by half or more, while childbearing among women 35 and older is rising.",
      },
      {
        id: "r2-10",
        speaker: "N",
        en: "One positive consequence of this age shift is that a larger proportion of new mothers are economically prepared to raise children.",
        marks: [20],
      },
      {
        id: "r2-11",
        speaker: "N",
        en: "Less positively, however, many women find that, as they age, they can't have as many kids as they would like.",
      },
      {
        id: "r2-12",
        speaker: "N",
        en: "Plus, having children later in life can increase the risk of health complications.",
      },
      {
        id: "r2-13",
        speaker: "N",
        en: "These finer points aside, one major consequence of the older moms trend is that fewer years of a woman's life are spent as a mother.",
      },
      {
        id: "r2-14",
        speaker: "N",
        en: "This means that, at any given time, a larger share of women, and thus of the whole population, will report not having children in government surveys.",
      },
      {
        id: "r2-15",
        speaker: "N",
        en: "In other words, later motherhood means less motherhood.",
      },
      {
        id: "r2-16",
        speaker: "N",
        en: "Even as motherhood rates decline, Mother's Day, of course, will endure.",
      },
      {
        id: "r2-17",
        speaker: "N",
        en: "In fact, despite the demographic shift, retail spending on the holiday appears to be rising.",
      },
      {
        id: "r2-18",
        speaker: "N",
        en: "It is hard to say if Mother's Day spending is rising more than one would expect, given that the American population keeps growing, but one factor might be that the proportion of women who are the mothers of adult children is rising, and those adult children may spend more generously when it comes to celebrating the moms they no longer live with.",
        marks: [21],
      },
    ],
    notes: [
      { en: "fertility rates", zh: "生育率" },
      { en: "proportional decline", zh: "占比上的下降" },
      { en: "age-specific birth rates", zh: "分年龄段的生育率" },
      { en: "childbearing age range", zh: "生育年龄区间" },
      { en: "health complications", zh: "健康问题；并发症" },
      { en: "retail spending", zh: "零售消费" },
      { en: "demographic shift", zh: "人口结构变化" },
      { en: "spend more generously", zh: "花得更大方" },
    ],
  },
  {
    id: "l-r3",
    label: "Recording Three",
    labelZh: "讲座三 · 室内空气与绿植到底有多大用",
    section: "C",
    questionRange: [22, 25],
    window: {
      startSec: 1306.74,
      endSec: 1483.42,
    },
    stemsWindow: {
      startSec: 1483.42,
      endSec: 1559.54,
      questions: [23, 24, 25],
    },
    questionWindows: [
      { n: 22, startSec: 1477.06, endSec: 1483.42 },
      { n: 23, startSec: 1496.84, endSec: 1504.04 },
      { n: 24, startSec: 1517.6, endSec: 1524.42 },
      { n: 25, startSec: 1537.98, endSec: 1546.1 },
    ],
    transcript: [
      {
        id: "r3-1",
        speaker: "N",
        en: "Since NASA published a paper in 1989 claiming that houseplants can soak up pollution and toxic chemicals, businesses and homeowners have increasingly invested in greenery to help clean their air.",
        marks: [22],
      },
      {
        id: "r3-2",
        speaker: "N",
        en: "But a new analysis suggests it could actually take more than 1,000 plants per square meter to gain a benefit any greater than simply opening a couple of windows.",
      },
      {
        id: "r3-3",
        speaker: "N",
        en: "The problem lies in the fact that NASA conducted their tests in sealed containers that do not simulate the conditions in most people's homes or offices.",
        marks: [23],
      },
      {
        id: "r3-4",
        speaker: "N",
        en: "The space agency was primary concerned about keeping the air fresh for astronauts cut off in biospheres or space stations and helping to combat sick building syndrome, which had become a problem due to the super-insulated and energy-efficient offices of the late 1970s.",
      },
      {
        id: "r3-5",
        speaker: "N",
        en: "By the early 1980s, workers regularly complained of skin rashes, sleepiness, headaches, and allergies as they breathed in toxic chemicals from paints and plastics.",
      },
      {
        id: "r3-6",
        speaker: "N",
        en: "NASA found that certain plants could remove chemicals from the air and even today garden centers recommend the plants for air-cleaning properties.",
      },
      {
        id: "r3-7",
        speaker: "N",
        en: "However, a new evaluation of dozens of studies spanning 30 years found that houseplants in a normal environment have little impact.",
      },
      {
        id: "r3-8",
        speaker: "N",
        en: "In fact, natural ventilation is far better at cleaning the air.",
        marks: [24],
      },
      {
        id: "r3-9",
        speaker: "N",
        en: "The researchers also calculated the clean air delivery rate for plants in the studies they analyzed and found that the rate at which plants disperse the compounds was well below the usual rate of air exchange in a normal building, caused by the movement of people, coming and going, opening doors and windows.",
      },
      {
        id: "r3-10",
        speaker: "N",
        en: "Many of the studies did show a reduction in the concentration of volatile organic compounds over time, which is likely why people have seized on them to praise the air-purifying virtues of plants.",
      },
      {
        id: "r3-11",
        speaker: "N",
        en: "But the researchers' calculations showed it would take 10 to 1,000 plants per square meter of floor space to compete with the air cleaning capacity of a building's air-handling system, or even just a couple of open windows in a house.",
      },
      {
        id: "r3-12",
        speaker: "N",
        en: "In contrast, NASA's sealed experiment recommended one pot plant per 100 square feet.",
      },
      {
        id: "r3-13",
        speaker: "N",
        en: "This is certainly an example of how scientific findings can be misleading or misinterpreted over time.",
      },
      {
        id: "r3-14",
        speaker: "N",
        en: "But it's also a great example of how scientific research should continually re-examine and question findings to get closer to the ground truth of understanding what's actually happening.",
        marks: [25],
      },
    ],
    notes: [
      { en: "soak up pollution", zh: "吸收污染物" },
      { en: "sealed containers", zh: "密封容器" },
      { en: "sick building syndrome", zh: "「病态建筑综合征」" },
      { en: "super-insulated", zh: "高度保温的" },
      { en: "volatile organic compounds", zh: "挥发性有机化合物" },
      { en: "clean air delivery rate", zh: "洁净空气输送率" },
      { en: "natural ventilation", zh: "自然通风" },
      { en: "ground truth", zh: "事实真相" },
    ],
  },
];

export const LISTENING_QUESTIONS: Question[] = [
  {
    n: 1,
    unitId: "l-c1",
    stem: "What does the man say he did before buying the blender?",
    stemZh: "男士说他在购买这台果汁机之前做了什么？",
    options: [
      {
        key: "A",
        en: "Read numerous comments users put online.",
        zh: "阅读了用户在网上发布的大量评论。",
      },
      {
        key: "B",
        en: "Blended all his food without using a machine.",
        zh: "不用机器就把所有食物都打碎了。",
      },
      {
        key: "C",
        en: "Searched for the state-of-the-art models of blenders.",
        zh: "查找了最先进型号的果汁机。",
      },
      {
        key: "D",
        en: "Did thorough research on the price of kitchen appliances.",
        zh: "对厨房电器的价格做了详尽调研。",
      },
    ],
    answer: "A",
    evidence: "I read through maybe hundreds of online user reviews.",
    explain: "录音中男士说买之前「读了几百条网上用户评论」，对应 A。B 把原文的「用机器」说成「不用机器」，与原文相反；C 只对应 state of the art 半句，属以偏概全；D 偷换概念——原文说他研究的是买哪个型号，不是价格。",
  },
  {
    n: 2,
    unitId: "l-c1",
    stem: "What does the woman say she has never thought of doing?",
    stemZh: "女士说她从来没想过做什么？",
    options: [
      {
        key: "A",
        en: "Eating any blended food.",
        zh: "吃任何打碎过的食物。",
      },
      {
        key: "B",
        en: "Buying a blender herself.",
        zh: "自己买一台果汁机。",
      },
      {
        key: "C",
        en: "Using machines to do her cooking.",
        zh: "用机器来做饭。",
      },
      {
        key: "D",
        en: "Making soups and juices for herself.",
        zh: "自己给自己做汤和果汁。",
      },
    ],
    answer: "B",
    evidence: "I've never thought of getting one myself.",
    explain: "女士明确说「我从没想过自己也买一个」，对应 B。A、C、D 三项她都没有说过「从没想过」；D 尤其相反——说「做汤和果汁」的是男士自己，女士只是说自己很少用它。",
  },
  {
    n: 3,
    unitId: "l-c1",
    stem: "What does the man say is a really healthy habit?",
    stemZh: "男士说什么才是真正健康的习惯？",
    options: [
      {
        key: "A",
        en: "Cooking every meal creatively in the kitchen.",
        zh: "在厨房里别出心裁地做每一顿饭。",
      },
      {
        key: "B",
        en: "Paying due attention to his personal hygiene.",
        zh: "充分注意自己的个人卫生。",
      },
      {
        key: "C",
        en: "Eating breakfast punctually every morning.",
        zh: "每天准时吃早餐。",
      },
      {
        key: "D",
        en: "Making his own fresh fruit juice regularly.",
        zh: "经常自己榨新鲜果汁。",
      },
    ],
    answer: "D",
    evidence: "I make a fresh fruit juice in the morning.",
    explain: "男士说「我早上会榨一杯新鲜果汁」，紧接着说这「是个非常健康的习惯」，对应 D。A 是女士对男士的想象（getting all creative in the kitchen）；C 错在 punctually every morning——他补充说「不是每天，大概一周三四次」；B 无中生有。",
  },
  {
    n: 4,
    unitId: "l-c1",
    stem: "What do we learn about store-bought juice from the conversation?",
    stemZh: "从对话中我们了解到商店买的果汁怎么样？",
    options: [
      {
        key: "A",
        en: "One-tenth of it is sugar.",
        zh: "其中十分之一是糖。",
      },
      {
        key: "B",
        en: "It looks healthy and attractive.",
        zh: "看起来健康又有吸引力。",
      },
      {
        key: "C",
        en: "One’s fancy may be tickled by it.",
        zh: "能迎合人的口味。",
      },
      {
        key: "D",
        en: "It contains an assortment of nutrients.",
        zh: "含有各种各样的营养成分。",
      },
    ],
    answer: "A",
    evidence: "Did you know that store-bought juice is like 10% sugar?",
    explain: "男士直接问「你知道商店买的果汁大概有 10% 是糖吗」，对应 A。D 说的是他自己果汁「营养种类更丰富」，与商店买的无关；C 讲的是他往果汁里加蔬菜坚果等 anything that tickles my fancy；B 原文未提。",
  },
  {
    n: 5,
    unitId: "l-c2",
    stem: "What is the question the woman asked Mr. Grimm after the introduction?",
    stemZh: "介绍结束后，女士向格林先生提了什么问题？",
    options: [
      {
        key: "A",
        en: "How he has made himself popular as the mayor of Berkton.",
        zh: "他作为伯克顿市长是如何让自己受欢迎的。",
      },
      {
        key: "B",
        en: "How the residents will turn Berkton into a tourist attraction.",
        zh: "居民将如何把伯克顿变成旅游胜地。",
      },
      {
        key: "C",
        en: "How charming he himself considers the village of Berkton to be.",
        zh: "他自己觉得伯克顿这个村子有多迷人。",
      },
      {
        key: "D",
        en: "How he has led people of Berkton to change the village radically.",
        zh: "他如何带领伯克顿的村民彻底改变了村庄。",
      },
    ],
    answer: "D",
    evidence: "But how did this change happen?",
    explain: "男士先说成绩归于全体居民，女士随即追问 But how did this change happen?（即小镇如何从默默无闻变成必去之地），问的正是他如何带领村民改造小镇，对应 D（后文他讲 2008 年镇民大会通过 836 号议案）。A 与他撇清个人功劳的说法相反；B、C 都不是她问的内容。",
  },
  {
    n: 6,
    unitId: "l-c2",
    stem: "What do we learn about Birkton of 10 years ago?",
    stemZh: "从对话中我们了解到十年前的伯克顿是什么样的？",
    options: [
      {
        key: "A",
        en: "It was developed only to a limited extent.",
        zh: "它的开发程度相当有限。",
      },
      {
        key: "B",
        en: "It was totally isolated as a sleepy village.",
        zh: "它是一个与世隔绝的沉睡小村。",
      },
      {
        key: "C",
        en: "It was relatively unknown to the outside.",
        zh: "它相对不为外界所知。",
      },
      {
        key: "D",
        en: "It was endowed with rare natural resources.",
        zh: "它拥有罕见的自然资源。",
      },
    ],
    answer: "C",
    evidence: "In about 10 years, Birkton has gone from a relatively unheard of, sleepy village to a must-see destination.",
    explain: "原文说十年前 Birkton 是「一个相对不为人知（relatively unheard of）的小村」，对应 C。B 添了「完全与世隔绝」，原文只说相对不知名，属程度偷换；A 无中生有；D 恰恰相反——正是自然风光使它成为必去景点，是现在的优势。",
  },
  {
    n: 7,
    unitId: "l-c2",
    stem: "What resulted from the passing of the legislative proposal, Motion 836?",
    stemZh: "836 号议案通过后带来了什么结果？",
    options: [
      {
        key: "A",
        en: "The people in Berkton were in a harmonious atmosphere.",
        zh: "伯克顿的人们处在融洽的氛围中。",
      },
      {
        key: "B",
        en: "The majority of residents lived in harmony with their neighbors.",
        zh: "大多数居民与邻居和睦相处。",
      },
      {
        key: "C",
        en: "The majority of residents enjoyed cosy housing conditions.",
        zh: "大多数居民享用了舒适的居住条件。",
      },
      {
        key: "D",
        en: "All the houses in Berkton looked aesthetically similar.",
        zh: "伯克顿的所有房屋在外观上都很相似。",
      },
    ],
    answer: "D",
    evidence: "This legislative proposal essentially set out to harmonize the aesthetic appearance of all the houses in Birkton.",
    explain: "836 号议案的内容是「统一 Birkton 所有房屋的美学外观」，对应 D。B 偷换概念——把「房屋外观统一」换成「居民彼此和睦」；A、C 都套用和谐温馨的字眼，原文谈的是房子，不是人际关系，也不是居住条件。",
  },
  {
    n: 8,
    unitId: "l-c2",
    stem: "Why does the man say the tourists are a blessing to Birkton?",
    stemZh: "男士说游客为什么是伯克顿的福音？",
    options: [
      {
        key: "A",
        en: "They have helped boost the local economy.",
        zh: "他们助推了当地经济。",
      },
      {
        key: "B",
        en: "They have made the residents unusually proud.",
        zh: "他们让居民感到格外自豪。",
      },
      {
        key: "C",
        en: "They have contributed considerably to its popularity.",
        zh: "他们为小镇的走红做出了很大贡献。",
      },
      {
        key: "D",
        en: "They have brought happiness to everyone in the village.",
        zh: "他们给村里的每个人都带来了幸福。",
      },
    ],
    answer: "A",
    evidence: "The tourists we receive are a blessing as they have completely revitalized our local economy.",
    explain: "男士说游客「彻底振兴了我们的当地经济」，对应 A。B 说的骄傲出自邻居们的那段话，与游客无关；C 颠倒了因果——是游客让小镇更热门，不是游客促成其流行；D 原文没有提给全村带来幸福。",
  },
  {
    n: 9,
    unitId: "l-b1",
    stem: "What does the passage say about a team of researchers at Northwestern University?",
    stemZh: "短文讲的是西北大学一个研究团队的什么事？",
    options: [
      {
        key: "A",
        en: "They have created the smallest remote-controlled walking robot in the world.",
        zh: "他们造出了世界上最小的遥控步行机器人。",
      },
      {
        key: "B",
        en: "They are going to publish their research findings in the journal Science Robotics.",
        zh: "他们将在《科学·机器人学》杂志上发表研究结果。",
      },
      {
        key: "C",
        en: "They are the first to build a robot that can bend, crawl, walk, turn and even jump.",
        zh: "他们率先造出了能弯曲、爬行、行走、转向甚至跳跃的机器人。",
      },
      {
        key: "D",
        en: "They are engaged in research on a remote-controlled robot which uses special power.",
        zh: "他们在研究一种使用特殊动力的遥控机器人。",
      },
    ],
    answer: "A",
    evidence: "Researchers described it as the smallest ever remote-controlled walking robot.",
    explain: "原文称该机器人是「有史以来最小的遥控步行机器人」，对应 A。B 时态错误——研究已经 published，不是将要发表；C 中「首创」原文未提，原文只说这台机器能弯曲、爬行、跳跃；D 与原文相反，它不用特殊动力，靠的是身体弹性。",
  },
  {
    n: 10,
    unitId: "l-b1",
    stem: "What did the researchers say about the robot they created?",
    stemZh: "研究人员是怎么描述他们造出的这台机器人的？",
    options: [
      {
        key: "A",
        en: "It changes its shape by complex hardware.",
        zh: "它靠复杂的硬件改变形状。",
      },
      {
        key: "B",
        en: "It is operated by a special type of tiny motor.",
        zh: "它由一种特殊的小马达驱动。",
      },
      {
        key: "C",
        en: "It moves from one place to another by memory.",
        zh: "它靠记忆从一个地方移动到另一个地方。",
      },
      {
        key: "D",
        en: "It is powered by the elastic property of its body.",
        zh: "它靠身体的弹性性能获得动力。",
      },
    ],
    answer: "D",
    evidence: "The engineers said this is because the robot is powered by the elastic property of its body.",
    explain: "工程师明确说机器人「靠身体的弹性性能获得动力」，对应 D。A 与原文相反——原文说不用 complex hardware；B 是原文没有的微型马达；C 混淆了形状记忆合金的「记忆形状」与驱动方式。",
  },
  {
    n: 11,
    unitId: "l-b1",
    stem: "What do the researchers expect their robots to do in the future?",
    stemZh: "研究人员期望他们的机器人在未来能做什么？",
    options: [
      {
        key: "A",
        en: "Replace humans in exploratory tasks.",
        zh: "在探索性任务中取代人类。",
      },
      {
        key: "B",
        en: "Perform tasks in tightly confined spaces.",
        zh: "在非常狭窄受限的空间里执行任务。",
      },
      {
        key: "C",
        en: "Explore the structure of clogged arteries.",
        zh: "探索堵塞动脉的结构。",
      },
      {
        key: "D",
        en: "Assist surgeons in highly complex surgery.",
        zh: "在高难度手术中协助外科医生。",
      },
    ],
    answer: "B",
    evidence: "While the research is still in the exploratory phase, the team believes that technology could lead to micro-sized robots that can perform practical tasks in tightly confined spaces.",
    explain: "原文说未来微型机器人「能在非常狭窄受限的空间里完成实际任务」，对应 B。A 无中生有；C 错在「探索血管结构」——原文说的是疏通堵塞的动脉；D 错在 highly complex surgery，原文说的是微创手术。",
  },
  {
    n: 12,
    unitId: "l-b2",
    stem: "What does the speaker say she did on her ride to the Isles of Scilly?",
    stemZh: "演讲者说她在去锡利群岛的航程中做了什么？",
    options: [
      {
        key: "A",
        en: "She threw up in the bathroom.",
        zh: "她在洗手间里呕吐。",
      },
      {
        key: "B",
        en: "She slept during the entire ride.",
        zh: "整趟航程她都在睡觉。",
      },
      {
        key: "C",
        en: "She dozed off for a few minutes.",
        zh: "她打了个盹儿，只睡了几分钟。",
      },
      {
        key: "D",
        en: "She boasted of her marathon race.",
        zh: "她夸耀自己跑马拉松的本事。",
      },
    ],
    answer: "B",
    evidence: "On one very rough ferry crossing on the route to the Isles of Scilly, for example, my traveling companion spent the entire three-hour ride throwing up in the bathroom, while I dozed happily on a plastic chair.",
    explain: "演讲者说同行的伙伴整趟三小时都在厕所呕吐，而「我」靠在塑料椅上开心地打盹（dozed happily），对应 B。A 把同伴的行为安到了「我」身上；C 错在「几分钟」，原文是整段航程都在打盹；D 无中生有。",
  },
  {
    n: 13,
    unitId: "l-b2",
    stem: "What do we learn from the passage about elite sleepers?",
    stemZh: "短文让我们了解了精英睡眠者的什么特点？",
    options: [
      {
        key: "A",
        en: "They are mostly immune to cognitive impairment.",
        zh: "他们大多不受认知损伤的影响。",
      },
      {
        key: "B",
        en: "They can sleep soundly during a rough ride at sea.",
        zh: "在海上颠簸的航程中他们也能睡得很沉。",
      },
      {
        key: "C",
        en: "They are genetically determined to need less sleep.",
        zh: "他们由基因决定，睡得比别人少。",
      },
      {
        key: "D",
        en: "They constitute about 13 percent of the population.",
        zh: "他们约占人口的 13%。",
      },
    ],
    answer: "C",
    evidence: "Because elite sleepers are defined as the approximately 3% of the population who are biologically programmed to need less sleep than the rest of us.",
    explain: "原文把精英睡眠者定义为「约 3% 在生理上只需比常人更少睡眠的人」，对应 C。D 数字错——原文是 3% 不是 13%；A 与原文矛盾——原文说他们 without any risk of cognitive decline；B 是演讲者自嘲的做法，不是定义。",
  },
  {
    n: 14,
    unitId: "l-b2",
    stem: "What has the speaker been trying to find out over the past year?",
    stemZh: "过去一年里，演讲者一直在试图弄清什么？",
    options: [
      {
        key: "A",
        en: "Whether there is a way to reach elite status.",
        zh: "有没有办法达到精英身份。",
      },
      {
        key: "B",
        en: "Whether it is possible to modify one’s genes.",
        zh: "是否有可能改变自己的基因。",
      },
      {
        key: "C",
        en: "Whether having a baby impacts one’s passion.",
        zh: "生个孩子会不会影响自己的热情。",
      },
      {
        key: "D",
        en: "Whether one can train themselves to sleep less.",
        zh: "能否训练自己少睡一些。",
      },
    ],
    answer: "D",
    evidence: "It may not be possible to change your own genes, but can you train yourself to need less sleep?",
    explain: "原文直接抛出这个问题：「基因或许改不了，但你能训练自己少睡吗？」对应 D。A 太笼统，不是「到达精英身份」而是「能否训练自己减少睡眠」；B 是原文否定的说法；C 与主题无关。",
  },
  {
    n: 15,
    unitId: "l-b2",
    stem: "What has the speaker discovered after a year of tough scientific study?",
    stemZh: "经过一年艰苦的科学研究，演讲者发现了什么？",
    options: [
      {
        key: "A",
        en: "It is in fact quite possible to nurture a passion for sleep.",
        zh: "事实上完全有可能培养出对睡觉的热情。",
      },
      {
        key: "B",
        en: "Babies can severely disrupt their parents’ sleep patterns.",
        zh: "婴儿会严重打乱父母的睡眠规律。",
      },
      {
        key: "C",
        en: "Being forced to rise early differs from being an early bird.",
        zh: "被迫早起与成为早起族是不同的。",
      },
      {
        key: "D",
        en: "New parents are forced to jump out of bed at the crack of dawn.",
        zh: "新手父母被迫在天刚亮时就跳下床。",
      },
    ],
    answer: "C",
    evidence: "After a year of tough scientific study, however, I have discovered being forced to get up early in the morning is very different from being an early bird.",
    explain: "原文「经过一年艰难的科学研究，我发现被迫早起与成为早起族是很不一样的」，对应 C。D 是转折前被推翻的假设（assumed I'd be forced...），A、B 只是背景交代，不是「发现」。",
  },
  {
    n: 16,
    unitId: "l-r1",
    stem: "What does a new paper in the Quarterly Journal of Experimental Psychology suggest?",
    stemZh: "《实验心理学季刊》上的一篇新论文提出了什么？",
    options: [
      {
        key: "A",
        en: "We have poor awareness of how many controversial issues are being debated.",
        zh: "我们对有多少争议性话题正在被讨论知之甚少。",
      },
      {
        key: "B",
        en: "No one knows better than yourself what you are thinking about at the moment.",
        zh: "没有人比你更了解自己此刻在想什么。",
      },
      {
        key: "C",
        en: "No one can change your opinions more than those who speak in a convincing tone.",
        zh: "没有人能比那些语气很有说服力的人更能改变你的观点。",
      },
      {
        key: "D",
        en: "We are likely to underestimate how much we can be swayed by a convincing article.",
        zh: "我们很可能低估了自己会被一篇有说服力的文章左右的程度。",
      },
    ],
    answer: "D",
    evidence: "And yet, a new paper in the Quarterly Journal of Experimental Psychology suggests that we actually have very poor awareness of our own belief change, meaning that we will tend to underestimate how much we've been swayed by a convincing article.",
    explain: "原文说我们对自己信念的变化「觉察力很差」，会「低估自己被一篇有说服力的文章影响了多少」，对应 D。B 是开头那句被驳斥的常识；A 偷换对象——不是不了解有多少争议在讨论；C 原文没有讲。",
  },
  {
    n: 17,
    unitId: "l-r1",
    stem: "What happened when the students read a text that argued against their own initial position?",
    stemZh: "当学生读到与自己最初立场相悖的材料时，发生了什么？",
    options: [
      {
        key: "A",
        en: "Their belief about physical punishment changed.",
        zh: "他们对体罚的看法发生了改变。",
      },
      {
        key: "B",
        en: "Their memory pushed them toward a current belief.",
        zh: "他们的记忆把他们推向当前的信念。",
      },
      {
        key: "C",
        en: "The memory of their initial belief came back to them.",
        zh: "他们对最初信念的记忆又回来了。",
      },
      {
        key: "D",
        en: "Their experiences of physical punishment haunted them.",
        zh: "他们被自己挨过体罚的经历所困扰。",
      },
    ],
    answer: "A",
    evidence: "The students' belief about physical punishment changed when they read a text that argued against their own initial position.",
    explain: "原文说学生读了与自己初始立场相反的材料后，「对体罚的信念发生了改变」，对应 A。B 讲的是「对初始信念的记忆被扭曲」这一后续环节，方向也说反了；C、D 原文未提。",
  },
  {
    n: 18,
    unitId: "l-r1",
    stem: "What did the researchers concede concerning their findings?",
    stemZh: "研究者在自己的研究结论上承认了什么？",
    options: [
      {
        key: "A",
        en: "They apparently have little to do with moderate beliefs.",
        zh: "这些发现显然与中等程度的信念关系不大。",
      },
      {
        key: "B",
        en: "They don’t reflect the changes of view on physical punishment.",
        zh: "它们并没有反映对体罚看法的变化。",
      },
      {
        key: "C",
        en: "They may not apply to changes to extreme or deeply held beliefs.",
        zh: "它们可能不适用于极端或根深蒂固的信念变化。",
      },
      {
        key: "D",
        en: "They are unlikely to alter people’s position without more evidence.",
        zh: "没有更多证据，它们不太可能改变人们的立场。",
      },
    ],
    answer: "C",
    evidence: "It's likely the findings would be different in the context of changes to extreme or deeply held beliefs.",
    explain: "研究者承认本研究针对的「主要是中等程度的信念变化」，因此「在极端或根深蒂固的信念变化中，结果可能不同」，对应 C。A 与原文相反——研究恰恰是关于中等程度信念的；B、D 原文均未提及。",
  },
  {
    n: 19,
    unitId: "l-r2",
    stem: "What does the speaker conclude from her analysis of the Census Bureau's data?",
    stemZh: "演讲者从自己对人口普查局数据的分析中得出了什么结论？",
    options: [
      {
        key: "A",
        en: "American moms have been increasingly inclined to live alone.",
        zh: "美国妈妈越来越倾向于独居。",
      },
      {
        key: "B",
        en: "The American population has been on the rise in the past 25 years.",
        zh: "美国人口在过去 25 年里一直在上升。",
      },
      {
        key: "C",
        en: "American motherhood has actually been on the decline.",
        zh: "美国的母职实际上在减少。",
      },
      {
        key: "D",
        en: "The fertility rates in America have in fact been falling sharply.",
        zh: "美国的生育率事实上在急剧下降。",
      },
    ],
    answer: "C",
    evidence: "According to my analysis of data from the Census Bureau, the decline of American motherhood is real, occurring very quickly, and may continue for some time yet.",
    explain: "演讲者说「根据我对人口普查局数据的分析，美国母职的下降是真实的」，对应 C。D 是她提到的普遍趋势（fertility rates are falling sharply in richer countries），不是她的结论；B 讲的是人口总数而非母职；A 无中生有。",
  },
  {
    n: 20,
    unitId: "l-r2",
    stem: "What does the speaker say is a positive consequence of the age shift in childbearing?",
    stemZh: "演讲者说生育年龄结构变化的一个正面后果是什么？",
    options: [
      {
        key: "A",
        en: "More new mothers tend to take greater care of their children.",
        zh: "更多新妈妈倾向于更用心地照顾孩子。",
      },
      {
        key: "B",
        en: "More new mothers are economically able to raise children.",
        zh: "更多新妈妈在经济上有能力抚养孩子。",
      },
      {
        key: "C",
        en: "A larger proportion of women take pride in their children.",
        zh: "更大比例的女性为自己的孩子感到骄傲。",
      },
      {
        key: "D",
        en: "A larger proportion of women really enjoy motherhood.",
        zh: "更大比例的女性真正享受做母亲。",
      },
    ],
    answer: "B",
    evidence: "One positive consequence of this age shift is that a larger proportion of new mothers are economically prepared to raise children.",
    explain: "原文说「这一年龄结构变化的一个正面后果是，比例更大的新妈妈在经济上已准备好养育孩子」，对应 B。A、C、D 都是原文没有涉及的评价性说法，文中只从经济准备度和健康风险两面谈。",
  },
  {
    n: 21,
    unitId: "l-r2",
    stem: "What might be one explanation for the rise in retail spending on Mother's Day?",
    stemZh: "母亲节零售消费上升的一个可能解释是什么？",
    options: [
      {
        key: "A",
        en: "The meaning of motherhood has changed considerably.",
        zh: "母职的含义发生了很大的变化。",
      },
      {
        key: "B",
        en: "More and more mothers go shopping to treat themselves.",
        zh: "越来越多母亲通过购物来犒劳自己。",
      },
      {
        key: "C",
        en: "More mothers have adult children celebrating the holiday.",
        zh: "更多母亲有已成年、会在这个节日里庆祝他们的孩子。",
      },
      {
        key: "D",
        en: "The number of American mothers has been growing steadily.",
        zh: "美国母亲的数量一直在稳步增长。",
      },
    ],
    answer: "C",
    evidence: "It is hard to say if Mother's Day spending is rising more than one would expect, given that the American population keeps growing, but one factor might be that the proportion of women who are the mothers of adult children is rising, and those adult children may spend more generously when it comes to celebrating the moms they no longer live with.",
    explain: "原文给出的可能解释之一是「当母亲的比例在上升，这些成年子女在庆祝母亲节时可能更慷慨」，对应 C。D 与原文相反——母职比例恰恰在下降；A、B 原文未提；题干问的是「一种」解释，原文也只说 one factor might be。",
  },
  {
    n: 22,
    unitId: "l-r3",
    stem: "What does NASA's 1989 paper claim houseplants can do?",
    stemZh: "NASA 1989 年的论文声称室内植物能做什么？",
    options: [
      {
        key: "A",
        en: "Add to indoor toxic pollutants.",
        zh: "增加室内的有毒污染物。",
      },
      {
        key: "B",
        en: "Absorb poisonous chemicals.",
        zh: "吸收有毒的化学物质。",
      },
      {
        key: "C",
        en: "Beautify the home environment.",
        zh: "美化家居环境。",
      },
      {
        key: "D",
        en: "Soak up surrounding moisture.",
        zh: "吸收周围的湿气。",
      },
    ],
    answer: "B",
    evidence: "Since NASA published a paper in 1989 claiming that houseplants can soak up pollution and toxic chemicals, businesses and homeowners have increasingly invested in greenery to help clean their air.",
    explain: "原文说 NASA 1989 年的论文声称室内植物「能吸收（soak up）污染和有毒化学物质」，对应 B。A 与原文相反；C 是大家买绿植的附带好处，论文没这么说；D 无中生有。",
  },
  {
    n: 23,
    unitId: "l-r3",
    stem: "What is said to be the problem with NASA's study reported in its 1989 paper?",
    stemZh: "NASA 1989 年论文所报告的那项研究存在什么问题？",
    options: [
      {
        key: "A",
        en: "NASA did experiments in sealed containers resembling the super-insulated offices of 1970s.",
        zh: "NASA 在密封容器中做实验，模拟 20 世纪 70 年代的高保温写字楼。",
      },
      {
        key: "B",
        en: "It was based on experiments under conditions unlike those in most homes or offices.",
        zh: "它所依据的实验条件与大多数家庭或办公室不同。",
      },
      {
        key: "C",
        en: "NASA conducted tests in outer space whose environment is different from ours.",
        zh: "NASA 在与我们环境不同的外层空间里做测试。",
      },
      {
        key: "D",
        en: "It drew its conclusion without any contrastive data from other experiments.",
        zh: "它在没有其他实验作对比数据的情况下就得出了结论。",
      },
    ],
    answer: "B",
    evidence: "The problem lies in the fact that NASA conducted their tests in sealed containers that do not simulate the conditions in most people's homes or offices.",
    explain: "原文指出问题在于「NASA 的实验是在密封容器中进行的，无法模拟大多数家庭或办公室的条件」，对应 B。A 说的是 NASA 当年的应用背景（宇航员、节能写字楼），不是问题所在；C 错在不是外太空；D 无中生有。",
  },
  {
    n: 24,
    unitId: "l-r3",
    stem: "What is the finding of a new evaluation of dozens of studies spanning 30 years?",
    stemZh: "一项针对横跨 30 年的数十项研究的新评估，其发现是什么？",
    options: [
      {
        key: "A",
        en: "Natural ventilation proves much more efficient for cleaning the air than house plants.",
        zh: "事实证明自然通风净化空气的效率远高于室内植物。",
      },
      {
        key: "B",
        en: "House plants disperse chemical compounds more quickly with people moving around.",
        zh: "有人来回走动时，室内植物分散化合物的速度更快。",
      },
      {
        key: "C",
        en: "Natural ventilation turns out to be most effective with doors and windows wide open.",
        zh: "事实证明门窗大开时自然通风最有效。",
      },
      {
        key: "D",
        en: "House plants in a normal environment rarely have any adverse impact on the air.",
        zh: "普通环境中的室内植物很少对空气产生不利影响。",
      },
    ],
    answer: "A",
    evidence: "In fact, natural ventilation is far better at cleaning the air.",
    explain: "原文说「事实上，自然通风在净化空气方面远好于植物」，对应 A。B 恰恰相反——植物分散化合物的速率 well below 正常换气速率；C 添了「门窗大开」这一限定；D 把结论落在植物身上，且 adverse 与原文的 little impact 不符。",
  },
  {
    n: 25,
    unitId: "l-r3",
    stem: "What does NASA's sealed experiment recommendation exemplify in scientists' pursuit of truth?",
    stemZh: "NASA 密封实验的建议在科学家追求真理的过程中说明了什么？",
    options: [
      {
        key: "A",
        en: "The root cause for misinterpretations of scientific findings.",
        zh: "科学发现被误读的根源。",
      },
      {
        key: "B",
        en: "The difficulty in understanding what’s actually happening.",
        zh: "弄清实际发生之事的困难。",
      },
      {
        key: "C",
        en: "The steps to be taken in arriving at any conclusion with certainty.",
        zh: "要得出任何确定的结论需要走的步骤。",
      },
      {
        key: "D",
        en: "The necessity of continually re-examining and challenging findings.",
        zh: "不断重新审视、质疑既有发现的必要性。",
      },
    ],
    answer: "D",
    evidence: "But it's also a great example of how scientific research should continually re-examine and question findings to get closer to the ground truth of understanding what's actually happening.",
    explain: "原文说 NASA 密封实验的建议「是科学研究应不断重新审视、质疑既有发现以接近事实真相的绝佳例证」，对应 D。A 顺序颠倒——误读是结果；B 只是后半句的修饰；C 原文没有。",
  },
];
