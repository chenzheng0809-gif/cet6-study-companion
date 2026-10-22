import type { TranslationTask, WritingTask } from "./types";

/**
 * 2024 年 06 月六级 · 第 2 套 · Part I Writing / Part IV Translation
 *
 * 题面（写作首句、翻译中文原文）来自真题 PDF（用户提供）。
 * 参考范文与参考译文来自《2024年06月六级考试真题答案速查（第2套）》PDF（用户提供）。
 *
 * 这一套没有解析册：审题说明、范文点评、范文译文、译点精析与难词译法，
 * 都由本项目依据卷面 Directions、参考范文与参考译文本身撰写，不是别处的解析。
 */

export const WRITING: WritingTask = {
  prompt: "Nowadays more and more college students have come to realize social practice and academic learning are equally important.",
  minWords: 150,
  maxWords: 200,
  brief: "题目要求以「Nowadays more and more college students have come to realize social practice and academic learning are equally important.」这句原话开篇，写一篇 150–200 词的短文。开头那句要一字不改地抄下来，字数控制在 150–200 词之间。参考范文走的是「先摆出两种立场 → 表明自己站哪边 → 用 Firstly / Secondly / Lastly 分三层论证 → All in all 收尾」的路子。",
  sampleEssay: "Nowadays more and more college students have come to realize social practice and academic learning are equally important. Some people hold the view that social practice plays an indispensable role in education, while others believe that it is not necessary for everyone to be involved in social activities. For me, I agree with the former. Firstly, social practice can help complement academic learn ing. Through social practice, students can not only apply what they have learned in real-life situations, enhancing their understanding, but also get inspiration, which is useful for their academic learning. Secondly, social practice is beneficial to fosteringteamwork, which is of great importance for the future job. Social practice exposes students to cooperation with different people. It is conceivable that only when students cooperate can they finish the task. Lastly, social practice makes students face different challenges. It encourages them to think critically and creatively to find solutions. This not only enriches their learning experience but also prepares them for their future roles in society. All in all, knowledge and action should go hand in hand. Social practice and academic learning are of equal importance, which is the key to producing well-rounded individuals.",
  sampleTranslation: `如今，越来越多的大学生已经意识到，社会实践与学术学习同等重要。有人认为，社会实践在教育中扮演着不可或缺的角色；也有人相信，并非每个人都需要参与社会活动。对我而言，我赞同前一种观点。首先，社会实践有助于补充课堂学习。通过社会实践，学生不仅能把所学运用到现实场景中、加深理解，还能从中获得启发，这对他们的学业学习大有裨益。其次，社会实践有助于培养团队合作能力，而团队合作对未来工作而言极其重要。社会实践让学生有机会与不同的人合作。可以设想，唯有彼此协作，学生才能完成任务。最后，社会实践让学生面对各种挑战，促使他们批判性地、创造性地思考解决办法。这不仅丰富了他们的学习经历，也让他们为日后在社会中的角色做好准备。

总而言之，知识与行动应当相辅相成。社会实践与学术学习同等重要，而这正是培养全面发展的人的关键。`,
  comments: [
    "开头三句就把「两方观点 + 自己站边」交代清楚了：Some people hold the view that… while others believe that… 是标准的对举句式，紧跟的 For me, I agree with the former 只用五个词就锁定立场，这个骨架可以直接套用到别的观点类作文上。",
    "三个论点用 Firstly / Secondly / Lastly 平行标号，每段都是「论点句 + 展开句」两段式：先说 social practice can help complement academic learning，再用 real-life situations 展开；先说 beneficial to fostering teamwork，再用 exposes students to cooperation with different people 展开；先说 makes students face different challenges，再用 think critically and creatively to find solutions 展开。三层之间不重叠。",
    "有一处措辞值得再改：which is of great importance for the future job 里的 for the future job 很生硬，改成 which is of great importance for their future jobs 更合语法也更自然。",
    "结尾的 All in all, knowledge and action should go hand in hand 收得住，但紧接着的 which is the key to producing well-rounded individuals 与前一句「两者同等重要」的意思重复了一遍；把这半句改成对「全面发展」的进一步展开，结尾会更利落。",
    "「社会实践能培养合作能力」这一层目前只有一句抽象的 It is conceivable that only when students cooperate can they finish the task，缺少具体场景；补一句真实经历（例如一次小组志愿活动）会让第二个论点比现在更有说服力。",
  ],
  notes: [
    { en: "indispensable role", zh: "不可或缺的作用（play an indispensable role in… ＝在……中起不可或缺的作用）" },
    { en: "complement", zh: "补足；与……相辅相成（complement academic learning ＝与课堂学习互相补充）" },
    { en: "real-life situations", zh: "真实场景；现实情境" },
    { en: "beneficial to", zh: "对……有益（beneficial to fostering teamwork ＝有助于培养团队合作能力）" },
    { en: "of great importance", zh: "极其重要" },
    { en: "think critically and creatively", zh: "批判性地、创造性地思考" },
    { en: "go hand in hand", zh: "相辅相成；齐头并进" },
    { en: "well-rounded individuals", zh: "全面发展的人" },
  ],
};

export const TRANSLATION: TranslationTask = {
  zh: "中国盛产竹子，是最早开发利用竹资源的国家。竹子在中国分布广泛，品种丰富。竹子 实用性强，用于生产和生活的许多方面，如筷子、桌椅的制作和桥梁、房屋的建造。中国人 爱竹，自古以来就有无数文人以竹为主题，创作了绚丽多彩的文学和绘画作品。竹子主干 （stem）笔直，象征正直的品格。竹子具有强大的生命力和适应能力，无论环境多么恶劣， 都能够顽强生存，因而寓意坚韧不拔的精神。几千年来，竹子一直被视为中华民族品格的象 征。",
  reference: "China is rich in bamboo and is the first country to exploit and utilize bamboo resources. Bamboo is extensively distributed and diverse in variety within China. Bamboo is highly versatile and is used in various aspects of production and daily life, such as the making of chopsticks, tables, and chairs, as well as the construction of bridges and houses. The Chinese have a deep affection for bamboo, and since ancient times, numerous scholars have created colorful literature and paintings on the theme of bamboo. The stem of bamboo is straight, symbolizing integrity. Bamboo exhibits remarkable vitality and adaptability, able to survive toughly no matter how harsh the environment is, thus embodying the spirit of unwavering perseverance. For thousands of years, bamboo has been esteemed as a representation of the character of the Chinese nation.",
  points: [
    "第一句：「盛产竹子」译为 be rich in bamboo，「是最早开发利用竹资源的国家」译为 is the first country to exploit and utilize bamboo resources。中文「开发利用」是一个动宾结构，英文拆成 exploit and utilize 两个并列动词去对应，避免堆砌名词化结构。",
    "第二句：「分布广泛」译为 is extensively distributed，「品种丰富」译为 is diverse in variety，两个分句合成一个并列谓语；地点「在中国」处理为句末的 within China 回指，不必再单独起一个介词短语。",
    "第三句：「实用性强」译为 is highly versatile，「用于生产和生活的许多方面」译为 is used in various aspects of production and daily life。中文顿号式的举例由 such as 引出，「筷子、桌椅的制作」用 the making of chopsticks, tables, and chairs 三个并列名词统摄，「桥梁、房屋的建造」则用 as well as the construction of bridges and houses 补足另一类用途。",
    "第四句：「中国人爱竹」把主语「中国人」处理为复数 the Chinese，「爱」用名词短语 a deep affection 承接；「自古以来就有无数文人以竹为主题」译为 and since ancient times, numerous scholars have created…，时间状语后置并用逗号与前一分句隔开。",
    "第五句：这是全文最短的一句，主干「主干笔直」译为 The stem of bamboo is straight，「象征正直的品格」没有另起一句，而是用现在分词短语 symbolizing integrity 作结果状语；中文原文里给主干加的注释「（stem）」在英文中直接以 stem 一词对应。",
    "第六、七句：「无论环境多么恶劣」译为 no matter how harsh the environment is 后置；「因而寓意坚韧不拔的精神」译为 thus embodying the spirit of unwavering perseverance，用 thus 加现在分词短语把因果化为结果状语；末句「一直被视为中华民族品格的象征」译为 has been esteemed as a representation of the character of the Chinese nation，现在完成被动表延续至今的状态。",
  ],
  notes: [
    { en: "exploit and utilize", zh: "开发利用（explore 开发与 utilize 利用并列，对应中文一个「开发利用」）" },
    { en: "extensively distributed", zh: "分布广泛" },
    { en: "diverse in variety", zh: "品种丰富" },
    { en: "highly versatile", zh: "实用性强；用途广泛" },
    { en: "the making of chopsticks", zh: "筷子的制作" },
    { en: "the construction of bridges and houses", zh: "桥梁和房屋的建造" },
    { en: "have a deep affection for", zh: "爱竹；对……怀有深厚的感情" },
    { en: "on the theme of bamboo", zh: "以竹为题" },
    { en: "symbolizing integrity", zh: "象征正直的品格（现在分词短语作结果状语）" },
    { en: "remarkable vitality", zh: "强大的生命力" },
    { en: "adaptability", zh: "适应能力" },
    { en: "survive toughly", zh: "顽强生存" },
    { en: "unwavering perseverance", zh: "坚韧不拔" },
    { en: "has been esteemed as", zh: "一直被尊为；被视为（现在完成被动，表示延续至今）" },
  ],
};
