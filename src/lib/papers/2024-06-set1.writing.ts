import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 1 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第1套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写；
 * 范文点评、表达升级、译点精析同样由本项目依据参考范文与参考译文本身撰写，
 * 不是别处的解析册里的内容 —— 没有来源的东西一律不写。
 */

export const WRITING: WritingTask = {
  prompt: "There is a growing awareness of the importance of digital literacy and skills in today’s world.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「There is a growing awareness of the importance of digital literacy and skills in today's world.」这句原话开篇，写一篇 150–200 词的短文。两件事必须做到：一是开头那句一字不改地抄下来，二是全篇写满 150 词、不超过 200 词。参考范文走的是「先亮明观点 → 分两层论证（学生 / 职场）→ 收尾回到学习、工作与生活」的路子：先说数字素养对谁都重要，再用「For one thing / For another / Moreover」把理由铺开，最后用 To sum up 收口。",
  sampleEssay: "There is a growing awareness of the importance of digital literacy and skills in today’s world. In today’s rapidly evolving digital world, I fully agree that digital literacy and skills are very important to everyone. For one thing, it is obvious that digital literacy is crucial for students. There are a large number of learning resources available online, such as great theses and excellent courses from prestigious universities. Students can draw on these rich resources to learn more knowledge and expand their horizons. For another, there is no denying that digital skills play an essential role in the workplace. We need to be proficient in using search engines to get more information and enhance our productivity with application software. Moreover, we cannot live a better life without digital literacy and skills. They can help a lot when it comes to getting around, shopping, socializing, and so on. To sum up, digital literacy and skills are of great importance to our study, work, and daily life. We should try our best to improve our digital literacy and skills to navigate the digital world.",
  sampleTranslation: "当今世界，人们越来越意识到数字素养与数字技能的重要性。在当今这个飞速变化的数字世界里，我完全同意数字素养和数字技能对每个人都非常重要。一方面，数字素养对学生来说显然至关重要。网上有大量可供获取的学习资源，例如名牌大学的优秀论文和课程。学生可以利用这些丰富资源学到更多知识，开阔眼界。另一方面，数字技能在职场中发挥着不可或缺的作用，这是不可否认的。我们需要熟练使用搜索引擎获取更多信息，并借助应用软件提高工作效率。此外，数字素养和数字技能能让我们的日常生活方便许多；说到出行、购物、社交等事，它们都能帮上大忙。总而言之，数字素养和数字技能对我们的学习、工作和日常生活都非常重要。我们应该尽力提升自己的数字素养和数字技能，以便在数字世界中畅行。",
  comments: [
    "首句照抄题面之后，第二句「In today’s rapidly evolving digital world, I fully agree that digital literacy and skills are very important to everyone」与首句的「the importance of digital literacy and skills in today’s world」几乎同义重复，白白占用了一个句子；把第二句删掉，首句之后直接接 For one thing，论证会紧凑得多。",
    "「such as great theses and excellent courses from prestigious universities」这一处举例有问题：thesis 是「论文、学位论文」，「great theses」既口语化又和后面的 courses 不同类；改成「such as research papers and online courses from leading universities」，例证既准确又具体。",
    "「We need to be proficient in using search engines to get more information and enhance our productivity with application software」把两个并列动作硬塞进一个句子，「enhance our productivity with application software」也偏生硬；拆成「We need to be proficient in using search engines to find information efficiently and in using office software to boost our productivity」，读起来更顺。",
    "「Moreover, we cannot live a better life without digital literacy and skills」用的是 cannot … without 的绝对否定，「live a better life」也不是地道搭配；换成「Moreover, digital literacy and skills make our daily life much more convenient」，语气更自然，也与前面 For one thing / For another 的论证层次一致。",
    "结尾「We should try our best to improve our digital literacy and skills to navigate the digital world」只停在个人努力这一层，没有回扣上一句的「study, work, and daily life」；改成「Only by improving them can we study, work and live better in the digital age」，三个层面一次收拢，结尾更有力。",
  ],
  notes: [
    { en: "There is a growing awareness of", zh: "人们对……的意识日益增强" },
    { en: "For one thing", zh: "一方面（两点式论证的引出语）" },
    { en: "draw on", zh: "利用、动用（资源、信息）" },
    { en: "expand their horizons", zh: "开阔眼界" },
    { en: "there is no denying that", zh: "不可否认，" },
    { en: "play an essential role in", zh: "在……中起关键作用" },
    { en: "when it comes to", zh: "谈到……的时候" },
    { en: "To sum up", zh: "总而言之" },
  ],
};

export const TRANSLATION: TranslationTask = {
  zh: "中国的传统婚礼习俗历史悠久，从周朝开始就逐渐形成了一套完整的婚礼仪式，有些一 直沿用至今。如今的中式婚礼习俗已有很大变化，但婚礼庆典仍然十分隆重。婚礼场地经过 精心装饰，以象征喜庆（jubilance）的红色为主色调，摆放着许多祝愿新人幸福的物件。在 婚礼上，新人要拜天地（bow to Heaven and Earth），拜父母和相互对拜，然后设宴招待宾 客，并向宾客敬酒致谢。今天，许多年轻人依然钟情于传统的中式婚礼，体验独特而美好的 中国式浪漫。",
  reference: "Traditional wedding customs in China have a long history, and since the Zhou Dynasty a complete set of wedding rituals has gradually developed, some of which are still in use today. Nowadays, Chinese wedding customs have changed a lot, but the ceremony is still very grand. The wedding venue is carefully decorated, with the main color of red, a symbol of jubilance, and many objects are placed to wish the couple happiness. At the wedding, the couple will bow to Heaven and Earth, to their parents and to each other, and then hold a banquet to entertain the guests and toast the guests to express their gratitude. Today, many young people still prefer the traditional Chinese wedding, to experience the unique and beautiful Chinese romance.",
  points: [
    "第一句：「中国的传统婚礼习俗历史悠久」译为 Traditional wedding customs in China have a long history，用该名词短语作主语、把 in China 保留为范围状语；「从周朝开始就逐渐形成了一套完整的婚礼仪式」译为 since the Zhou Dynasty a complete set of wedding rituals has gradually developed，「从……开始」处理为 since 介词短语，「逐渐形成」处理为现在完成时 has gradually developed，突出这一过程一直延续到今天。",
    "第一句末：「有些一直沿用至今」译为 some of which are still in use today。这里没有另起一句，而是用 which 引导定语从句承接前面的 a complete set of wedding rituals；are still in use 用现在时的被动语态，保留「沿用」的被动意味，today 单独提到句末以示强调。",
    "第二句：「如今的中式婚礼习俗已有很大变化」译为 Nowadays, Chinese wedding customs have changed a lot，「已有很大变化」用现在完成时 have changed a lot 而不是一般过去时，以体现对现在的影响；「但婚礼庆典仍然十分隆重」译为 but the ceremony is still very grand，but 承接转折，still 保留「仍然」的意味。",
    "第三句：「以象征喜庆（jubilance）的红色为主色调」译为 with the main color of red, a symbol of jubilance。中文的「以……为……」处理成英文的前置介词短语 with…，而「象征喜庆的红色」处理成同位语 a symbol of jubilance 后置修饰 red，避免了中文式的「红色是象征喜庆的」长定语。",
    "第四句：「拜天地，拜父母和相互对拜」译为 bow to Heaven and Earth, to their parents and to each other，三个「拜」的对象用 to + 宾语并列，后两个 to 之后省略了宾语以避免重复；「设宴招待宾客，并向宾客敬酒致谢」译为 hold a banquet to entertain the guests and toast the guests to express their gratitude，两个动作各配一个不定式 to 分别交代目的。",
    "末句：「许多年轻人依然钟情于传统的中式婚礼，体验独特而美好的中国式浪漫」译为 many young people still prefer the traditional Chinese wedding, to experience the unique and beautiful Chinese romance，「钟情于」用 prefer，「体验……」这一目的用 to experience 不定式挂在主语之后，「中国式浪漫」处理为 the unique and beautiful Chinese romance，形容词与名词分列。",
  ],
  notes: [
    { en: "traditional wedding customs", zh: "传统婚礼习俗" },
    { en: "a complete set of wedding rituals", zh: "一套完整的婚礼仪式" },
    { en: "still in use today", zh: "至今仍在沿用" },
    { en: "changed a lot", zh: "变化很大" },
    { en: "very grand", zh: "十分隆重" },
    { en: "carefully decorated", zh: "精心装饰" },
    { en: "the main color of red", zh: "以红色为主色调" },
    { en: "a symbol of jubilance", zh: "象征喜庆" },
    { en: "wish the couple happiness", zh: "祝愿新人幸福" },
    { en: "bow to Heaven and Earth", zh: "拜天地" },
    { en: "hold a banquet to entertain the guests", zh: "设宴招待宾客" },
    { en: "toast the guests to express their gratitude", zh: "向宾客敬酒致谢" },
    { en: "still prefer", zh: "依然钟情于" },
    { en: "Chinese romance", zh: "中国式浪漫" },
  ],
};
