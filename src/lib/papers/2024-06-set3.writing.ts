import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 3 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第3套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明由本项目依据卷面 Directions 与参考范文的结构撰写；
 * 范文译文、点评、表达升级、译点精析与难词译法，同样由本项目依据参考范文与参考译文撰写。
 */

export const WRITING: WritingTask = {
  prompt: "Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先接住题面 → On the one hand / On the other hand 两面论证（动机与自律 / 适应力与批判性思维）→ To sum up 收尾」的路子。",
  sampleEssay: "Nowadays, cultivating independent learning ability is becoming increasingly crucial for personal development. In today’s rapidly changing world, only when we are active in learning independently can we keep pace with the times. On the one hand, independent learning allows us to explore our interests and passions at our own pace. This enhances our motivation to learn. It also encourages self-discipline and time management skills, both of which are essential to our personal development. On the other hand, independent learning is the key to developing adaptability. In this ever-changing society, we often face unforeseen challenges. Independent learning enables us to find proper solutions in time, which plays a key role on our road to success. Furthermore, independent learning is crucial for fostering critical thinking. Independent learners can question, evaluate, and assimilate information effectively. This not only enhances our understanding of novel things but also promotes our creativity and innovation ability. To sum up, there is no doubt that independent learning ability plays a crucial role in our personal development. It equips us with the strong ability to adapt to the complex modern life.",
  sampleTranslation: `如今，培养自主学习能力对个人发展而言变得愈发重要。在当今这个快速变化的世界里，只有主动地进行自主学习，我们才能跟上时代的步伐。

一方面，自主学习让我们能够按照自己的节奏去探索自己的兴趣与热情。这增强了我们学习的动力。它还促使我们培养自律能力和时间管理技能，而这两者对个人发展都至关重要。

另一方面，自主学习是培养适应能力的关键。在这个不断变化的社会里，我们常常要面对意料之外的挑战。自主学习使我们能够及时找到恰当的解决办法，这对我们的成功之路起着关键作用。

此外，自主学习对培养批判性思维至关重要。独立的学习者能够有效地质疑、评估并吸收信息。这不仅加深了我们对新事物的理解，也促进了我们的创造力与创新能力。

总之，毫无疑问，自主学习能力在个人发展中发挥着关键作用。它使我们具备在错综复杂的现代生活中生存下去的能力。`,
  comments: [
    "开篇一字不改地照抄题面，随后用 \"In today’s rapidly changing world, only when we are active in learning independently can we keep pace with the times.\" 这一倒装句把题面里抽象的 independent learning 落到「跟得上时代」的具体语境上，话题引入干净利落。",
    "\"On the one hand\" 一段的两句收尾 \"This enhances our motivation to learn.\" 与 \"which plays a key role on our road to success\" 都停在 \"enhance\"、\"play a key role\" 这类笼统说法上，缺少落地的例子。可以在 motivation 那句后面补半句 \"such as ploughing through a difficult textbook chapter on our own\"，让 \"motivation\" 有具体的支撑。",
    "\"It also encourages self-discipline and time management skills, both of which are essential to our personal development.\" 用 which 引导非限定定语从句一口气带过两个并列成分，句式漂亮；但 personal development 与题面首句完全重复，可换成 \"essential for our long-term progress\" 避免用词撞车。",
    "\"This not only enhances our understanding of novel things but also promotes our creativity and innovation ability.\" 里的 \"innovation ability\" 搭配生硬，ability 前用 innovation 作定语很别扭；改成 \"our capacity for creative and innovative thinking\" 更地道，也和前半句 \"question, evaluate, and assimilate information\" 的三个动词在语气上更一致。",
    "结尾 \"It equips us with the strong ability to adapt to the complex modern life.\" 中 equip sb with sth 的搭配用对了，但 \"the strong ability\" 的冠词多余（ability 作可数名词时前面一般不加定冠词），去掉 the 即可；同时 \"the complex modern life\" 偏抽象，可具体化为 \"a fast-changing modern life\"。",
  ],
  notes: [
    { en: "keep pace with the times", zh: "跟上时代的步伐（也说 stay abreast of the times）" },
    { en: "self-discipline", zh: "自律" },
    { en: "the key to developing adaptability", zh: "培养适应能力的钥匙（the key to + 名词/动名词）" },
    { en: "find proper solutions in time", zh: "及时找到恰当的解决办法" },
    { en: "fostering critical thinking", zh: "培养批判性思维" },
    { en: "assimilate information", zh: "吸收并消化信息" },
    { en: "plays a crucial role in", zh: "在……中发挥关键作用" },
    { en: "equips us with", zh: "使我们具备……（equip sb with sth）" },
  ],
};

export const TRANSLATION: TranslationTask = {
  zh: "扇子自古以来就深受中国人喜爱，但现在已不只是消暑纳凉的工具，而更多地作为艺术 品供人欣赏。许多扇子造型优美、做工精良，并绘有山水、花鸟、人物等精美图案，具有很 高的艺术价值。中国许多著名画家和书法家喜欢在扇子上作诗绘画，展示其艺术品味。扇子 常作为礼物赠予他人，表达美好的祝福和真挚的情感。如今，扇子的实用功能已大为减弱， 但作为一种文化符号和艺术形式，扇子仍然在中国传统文化中扮演着重要角色。",
  reference: "Fans have been cherished by the Chinese people since ancient times, yet now they are no longer merely tools for relieving summer heat; instead, they are increasingly admired as works of art. Many fans feature elegant shapes, fine craftsmanship, and are painted with intricate designs of landscapes, flowers, birds, and figures, holding high artistic value. Many renowned Chinese painters and calligraphers delight in inscribing poems and painting pictures on fans, showing their artistic taste. Fans are frequently presented as gifts, conveying delightful blessings and heartfelt emotions. Today, the practical utility of fans has significantly diminished, yet as a cultural icon and a form of art, they continue to play an important role in traditional Chinese culture.",
  points: [
    "第一句：「扇子自古以来就深受中国人喜爱」译为 Fans have been cherished by the Chinese people since ancient times。「深受……喜爱」不直译成 deeply loved，而用被动语态 have been cherished（一直被人珍爱），更合英文行文；「自古以来」用 since ancient times 置于句末。接下来「但现在已不只是消暑纳凉的工具，而更多地作为艺术品供人欣赏」译为 yet now they are no longer merely tools for relieving summer heat; instead, they are increasingly admired as works of art：中文「不只是……而更多地……」这一层递进，用 no longer merely…instead… 的对照结构承接，more 地对应 increasingly；「供人欣赏」不写成 for people to appreciate，而改为被动的 are increasingly admired。分号把转折与递进两层意思断开。",
    "第二句：「许多扇子造型优美、做工精良，并绘有山水、花鸟、人物等精美图案，具有很高的艺术价值」译为 Many fans feature elegant shapes, fine craftsmanship, and are painted with intricate designs of landscapes, flowers, birds, and figures, holding high artistic value。三个并列谓语 feature / (are) painted / holding 共用主语 Many fans。「造型优美、做工精良」不逐字译成「形状优雅、工艺精良」，而名词化为 elegant shapes, fine craftsmanship 作 feature 的宾语；「绘有……图案」用被动语态 are painted with（被绘有），不用主动的 have…；「山水、花鸟、人物」四个并列意象展开为 landscapes, flowers, birds, and figures，并列四项时前置逗号。末尾「具有很高的艺术价值」不另起主语，而用现在分词短语 holding high artistic value 作结果状语，说明这是前面三个谓语的必然结果。",
    "第三句：「中国许多著名画家和书法家喜欢在扇子上作诗绘画，展示其艺术品味」译为 Many renowned Chinese painters and calligraphers delight in inscribing poems and painting pictures on fans, showing their artistic taste。「著名」→ renowned；「喜欢」不用 like 而用 delight in（对……感到高兴），语气比 like 更贴切；「作诗绘画」拆成两个并列动名词 inscribing poems and painting pictures；「在扇子上」作地点状语放在两个动名词之后；「展示其艺术品味」用现在分词 showing their artistic taste 作伴随状语，主语与前面保持一致，不需要另加代词。",
    "第四句：「扇子常作为礼物赠予他人，表达美好的祝福和真挚的情感」译为 Fans are frequently presented as gifts, conveying delightful blessings and heartfelt emotions。「赠予他人」用被动语态 are frequently presented as gifts，中文的施事「他人」在英文里不必译出，改以 as gifts 点明身份；「表达……」用现在分词 conveying… 作结果状语承接；「美好的祝福」→ delightful blessings，「真挚的情感」→ heartfelt emotions，两个形容词都后置修饰名词。",
    "第五句：「如今，扇子的实用功能已大为减弱，但作为一种文化符号和艺术形式，扇子仍然在中国传统文化中扮演着重要角色」译为 Today, the practical utility of fans has significantly diminished, yet as a cultural icon and a form of art, they continue to play an important role in traditional Chinese culture。「实用功能」→ practical utility（utility 侧重功用，比 function 更贴切）；「已大为减弱」→ has significantly diminished，用现在完成时体现变化的延续。转折用 yet 承接，把「作为一种文化符号和艺术形式」提前作方式状语 as a cultural icon and a form of art，最后以 they continue to play an important role in… 收尾；「在中国传统文化中」放在 play an important role 之后作范围状语，符合英文习惯；「文化符号」→ cultural icon。",
  ],
  notes: [
    { en: "cherished", zh: "被珍爱、备受珍视（用被动 have been cherished）" },
    { en: "relieving summer heat", zh: "消暑纳凉" },
    { en: "works of art", zh: "艺术品" },
    { en: "feature", zh: "以……为特色；具有……（此处作谓语，宾语是自身的特征）" },
    { en: "fine craftsmanship", zh: "做工精良" },
    { en: "intricate designs", zh: "精细的图案" },
    { en: "holding high artistic value", zh: "具有很高的艺术价值（现在分词作结果状语）" },
    { en: "renowned", zh: "著名的" },
    { en: "calligraphers", zh: "书法家" },
    { en: "delight in", zh: "乐于；喜爱（比 like 更地道）" },
    { en: "presented as gifts", zh: "作为礼物赠予（被动语态，施事「他人」省略）" },
    { en: "heartfelt emotions", zh: "真挚的情感" },
    { en: "practical utility", zh: "实用功能（utility 侧重功用）" },
    { en: "significantly diminished", zh: "已大为减弱" },
  ],
};
