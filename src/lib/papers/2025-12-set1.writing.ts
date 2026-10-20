import type { TranslationTask, WritingTask } from "./types";

/**
 * 2025 年 12 月六级 · 第一套 · Part I Writing / Part IV Translation
 * 审题、参考范文、点评、范文译文、参考译文与译点精析均来自解析 PDF。
 */

export const WRITING: WritingTask = {
  prompt:
    'Living in an increasingly competitive world, college students should better prepare themselves to confront various challenges.',
  minWords: 150,
  maxWords: 200,
  brief:
    "题目要求考生写一篇以「身处竞争日益激烈的世界，大学生应做好更充分的准备，以应对各类挑战。」为开头的作文，考生可以通过发表评论、举例予以叙述。根据题目提示，写作可以采取以下布局：开头段以给定句子引出话题，描述现象；中间段针对该情况提出准备方向（如专业能力提升、心态塑造等），可搭配具体例子以增强说服力；结尾总结升华。",
  sampleEssay: `Living in an increasingly competitive world, college students should better prepare themselves to confront various challenges. Whether it is the fierce job competition, the demand for creative thinking in academic research, or the pressure of adapting to rapid social changes, these challenges require practical and comprehensive preparations to navigate successfully.

First and foremost, mastering professional expertise is the foundation. College students should attach importance to not only their courses but also practical applications. Secondly, developing basic practical skills can improve competitiveness. Skills like computer operation, English communication, and time management are useful in almost any job. Finally, keeping a positive attitude is very important. When facing difficulties such as failing exams or being rejected in job hunting, students should not give up easily. Instead, they should learn from failures and keep trying.

In conclusion, by solidifying professional foundations, learning practical skills, and nurturing a tough mentality, college students can not only cope with current challenges but also lay a solid foundation for long-term career development in the competitive environment.`,
  sampleTranslation: `身处竞争日益激烈的世界，大学生应做好更充分的准备，以应对各类挑战。无论是激烈的就业竞争、学术研究对创新思维的要求，还是适应社会快速变化的压力，这些挑战都需要切实且全面的准备才能成功应对。

首当其冲的是，精通专业知识是基础。大学生不仅要重视课程学习，还要重视实践应用。其次，培养基本的实用技能会提升竞争力。计算机操作、英语沟通和时间管理等技能，在几乎所有工作中都能用得上。最后，保持积极的心态也非常重要。面对如考试失利或求职被拒这样的困难时，学生们不应轻易放弃。相反，他们应该从失败中学习，继续努力。

总之，通过夯实专业基础，学习实用技能，培养强大的心态，大学生不仅能应对当下的挑战，还能在竞争环境中为长期的职业发展奠定坚实基础。`,
  comments: [
    "以给定句子引出「大学生应做好充分的准备以应对各类挑战」的话题，并列举各种挑战。",
    "从三个方面展开说明需要做好哪些准备，分别用 First and foremost、Secondly 和 Finally 引出。",
    "结尾总结三大准备方向，呼应开头的竞争背景，立意完整，收束有力。",
  ],
  notes: [
    { en: "foremost", pos: "adv.", zh: "首先；最重要地" },
    { en: "expertise", pos: "n.", zh: "专业知识；专门知识" },
    { en: "attach importance to", zh: "重视" },
    { en: "solidify", pos: "v.", zh: "夯实；巩固" },
    { en: "nurture", pos: "v.", zh: "培育；养成" },
    { en: "mentality", pos: "n.", zh: "心态；心气" },
  ],
};

export const TRANSLATION: TranslationTask = {
  zh: `尊老是中华民族的传统美德，深深植根于中国人的思想和行为中，是人们普遍遵守的行为规范和社会准则。在当今的中国，这种美德得到广泛传承。社会各界积极营造敬老助老的社会氛围。为老年人提供便利服务已成为社会共识，例如社区专门开设长者食堂，公共场所配置优先座位。政府还出台了一系列政策，为老年人的权益提供有力保障。尊老是社会和谐与发展的重要基石，有助于培育良好的社会氛围，推动整个社会文明进步。`,
  reference: `Respecting the elderly is a traditional virtue of the Chinese nation, deeply rooted in the thoughts and actions of Chinese people, acting as a widely observed behavioral norm and social principle. In contemporary China, this virtue continues to be widely passed down. All sectors of society actively foster a social atmosphere of valuing and supporting the elderly. Providing convenient services for older adults has become a societal consensus — for instance, communities have established dedicated senior canteens, and priority seating is available in public spaces. The government has also implemented a series of policies to provide strong safeguards for the rights and interests of the elderly. Respecting the elderly serves as a crucial cornerstone for social harmony and development, contributing to the cultivation of a positive social atmosphere and promoting social progress and civilization.`,
  points: [
    "第一句：本句包含三个并列的语义层次。将「尊老」处理为动名词短语 Respecting the elderly 作主语。后两个层次「深深植根于……」和「是……规范和准则」在逻辑上表示伴随或结果，故分别译为过去分词短语 deeply rooted in… 和现在分词短语 acting as… 作状语，使句子结构紧凑、逻辑关系清晰。",
    "第二句：时间 + 地点状语「在当今的中国」译为 In contemporary China。「得到广泛传承」略含持续状态，采用 continues to be passed down 现在时的被动语态进行翻译，准确传达出「传承」这一动态和持续的过程。",
    "第三句：「社会各界」译为 All sectors of society。在「营造……的社会氛围」中，「敬老助老的」是「氛围」的具体内容，译文使用后置定语 of valuing and supporting the elderly 进行修饰，使表达具体、地道。",
    "第四句：主句主语「为老年人提供便利服务」译为动名词短语 Providing convenient services for older adults。「已成为社会共识」译为 has become a societal consensus。举例部分用破折号引出，两个例子用 and 连接，其中「配置优先座位」译为 priority seating is available（优先座可用），更符合英文表达习惯。",
    "第五句：「出台了一系列政策」译为 has implemented a series of policies。「为……提供有力保障」表示目的，译为不定式短语 to provide strong safeguards for… 作目的状语。「权益」固定译为 rights and interests。",
    "第六句：本句为总结句，包含主干和两个并列的后续作用。将主干「尊老是……重要基石」处理为 Respecting the elderly serves as a crucial cornerstone for…。后半部分「有助于培育……，推动……」是「尊老」带来的积极影响，译为现在分词短语 contributing to…and promoting… 作结果状语。「社会文明进步」译为常用搭配 social progress and civilization。",
  ],
  notes: [
    { en: "traditional virtue", zh: "传统美德" },
    { en: "be deeply rooted in", zh: "深深植根于" },
    { en: "widely observed", zh: "普遍遵守的" },
    { en: "behavioral norm", zh: "行为规范" },
    { en: "social principle", zh: "社会准则" },
    { en: "pass down", zh: "传承" },
    { en: "all sectors of society", zh: "社会各界" },
    { en: "foster a social atmosphere", zh: "营造社会氛围" },
    { en: "provide convenient services", zh: "提供便利服务" },
    { en: "societal consensus", zh: "社会共识" },
    { en: "dedicated", zh: "专门的" },
    { en: "priority seating", zh: "优先座位" },
    { en: "implement policies", zh: "出台政策" },
    { en: "rights and interests", zh: "权益" },
    { en: "strong safeguards", zh: "有力保障" },
    { en: "cornerstone", zh: "基石" },
  ],
};
