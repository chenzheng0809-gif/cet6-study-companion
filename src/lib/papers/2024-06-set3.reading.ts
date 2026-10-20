import type { Question, ReadingSection } from "./types";

/**
 * 2024 年 06 月六级 · 第 3 套 · Part III Reading Comprehension
 *
 * 原文、题干、选项来自《2024年06月大学英语六级考试真题（第3套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第3套）》PDF（用户提供）。
 *
 * 这一套没有解析册：逐题解析与原文依据句由本项目依据真题原文撰写，
 * 每条依据句都逐字取自上面的原文，不是别处的措辞。
 * 中文标题也是按原文内容写的，不是从别处抄的。
 */

export const READING_SECTIONS: ReadingSection[] = [
  {
    id: "r-a",
    label: "Section A",
    labelZh: "选词填空 · 彩虹是怎么形成的",
    kind: "bank",
    questionRange: [26, 35],
    paragraphs: [
      {
        label: "",
        en: "A rainbow is a multi-colored, arc-shaped phenomenon that can appear in the sky. The colors of a rainbow are produced by the reflection and {{26}} of light through water droplets (小滴) present in the atmosphere. An observer may {{27}} a rainbow to be located either near or far away, but this phenomenon is not actually located at any specific spot. Instead, the appearance of a rainbow depends entirely upon the position of the observer in {{28}} to the direction of light. In essence, a rainbow is an {{29}} illusion. Rainbows present a {{30}} made up of seven colors in a specific order. In fact, school children in many English-speaking countries are taught to remember the name “Roy G. Biv” as an aid for remembering the colors of a rainbow and their order. “Roy G. Biv” {{31}} for: red, orange, yellow, green, blue, indigo, and violet. The outer edge of the rainbow arc is red, while the inner edge is violet. A rainbow is formed when light (generally sunlight) passes through water droplets {{32}} in the atmosphere. The light waves change direction as they pass through the water droplets, resulting in two processes: reflection and refraction (折射). When light reflects off a water droplet, it simply {{33}} back in the opposite direction from where it {{34}} . When light refracts, it takes a different direction. Some individuals refer to refracted light as “bent light waves.” A rainbow is formed because white light enters the water droplet, where it bends in several different directions. When these bent light waves reach the other side of the water droplet, they reflect back out of the droplet instead of {{35}} passing through the water. Since the white light is separated inside of the water, the refracted light appears as separate colors to the human eye.",
      },
    ],
    bank: [
      {
        key: "A",
        word: "bounces",
        pos: "v.",
        zh: "弹回；反弹",
      },
      {
        key: "B",
        word: "completely",
        pos: "adv.",
        zh: "完全地",
      },
      {
        key: "C",
        word: "dispersion",
        pos: "n.",
        zh: "色散；分散",
      },
      {
        key: "D",
        word: "eccentric",
        pos: "adj.",
        zh: "古怪的；异乎寻常的",
      },
      {
        key: "E",
        word: "hanging",
        pos: "adj.",
        zh: "悬挂的",
      },
      {
        key: "F",
        word: "optical",
        pos: "adj.",
        zh: "光的；视觉的",
      },
      {
        key: "G",
        word: "originates",
        pos: "v.",
        zh: "起源于；发端于",
      },
      {
        key: "H",
        word: "perceive",
        pos: "v.",
        zh: "察觉；感知",
      },
      {
        key: "I",
        word: "permeates",
        pos: "v.",
        zh: "渗透；弥漫",
      },
      {
        key: "J",
        word: "ponder",
        pos: "v.",
        zh: "思考；斟酌",
      },
      {
        key: "K",
        word: "preceding",
        pos: "adj.",
        zh: "在前的；先行的",
      },
      {
        key: "L",
        word: "recklessly",
        pos: "adv.",
        zh: "鲁莽地；不顾后果地",
      },
      {
        key: "M",
        word: "relation",
        pos: "n.",
        zh: "关系",
      },
      {
        key: "N",
        word: "spectrum",
        pos: "n.",
        zh: "光谱；范围",
      },
      {
        key: "O",
        word: "stands",
        pos: "v.",
        zh: "位于；立着",
      },
    ],
  },
  {
    id: "r-b",
    label: "Section B",
    labelZh: "长篇阅读 · 别把宝贵时间耗在无效会议上",
    kind: "matching",
    questionRange: [36, 45],
    paragraphs: [
      {
        label: "A",
        en: "Phyllis Hartman knows what it’s like to make one’s way through the depths of office meeting hell. Managers at one of her former human resources jobs arranged so many meetings that attendees would fall asleep at the table or intentionally arrive late. With hours of her day blocked up with unnecessary meetings, she was often forced to make up her work during overtime. “I was actually working more hours than I probably would have needed to get the work done,” says Hartman, who is founder and president of PGHR Consulting in Pittsburgh, Pennsylvania.",
      },
      {
        label: "B",
        en: "She isn’t alone in her frustration. Between 11 million and 55 million meetings are held each day in the United States, costing most organisations between 7% and 15% of their personnel budgets. Every week, employees spend about six hours in meetings, while the average manager meets for a staggering 23 hours.",
      },
      {
        label: "C",
        en: "And though experts agree that traditional meetings are essential for making certain decisions and developing strategy, some employees view them as one of the most unnecessary parts of the workday. The result is not only hundreds of billions of wasted “ dollars, but an annoyance of what organisational psychologists call meeting recovery syndrome (MRS)”: time spent cooling off and regaining focus after a useless meeting. If you run to the office kitchen to get some relief with colleagues after a frustrating meeting, you’re likely experiencing meeting recovery syndrome.",
      },
      {
        label: "D",
        en: "Meeting recovery syndrome is a concept that should be familiar to almost anyone who has held a formal job. It isn’t ground-breaking to say workers feel fatigued after a meeting, but only in recent decades have scientists deemed the condition worthy of further investigation. With its links to organisational efficiency and employee wellbeing, MRS has attracted the attention of psychologists aware of the need to understand its precise causes and cures.",
      },
      {
        label: "E",
        en: "Today, in so far as researchers can hypothesise, MRS is most easily understood as a slow renewal of finite mental and physical resources. When an employee sits through an ineffective meeting their brain power is essentially being drained away. Meetings drain vitality if they last too long, fail to engage employees or turn into one-sided lectures. The conservation of resources theory, originally proposed in 1989 by Dr. Stevan Hobfoll, states that psychological stress occurs when a person’s resources are threatened or lost. When resources are low, a person will shift into defence to conserve their remaining supply. In the case of office meetings, where some of employees’ most valuable resources are their focus, alertness and motivation, this can mean an abrupt halt in productivity as they take time to recover.",
      },
      {
        label: "F",
        en: "As humans, when we transition from one task to another on the job—say from sitting in a meeting to doing normal work—it takes an effortful cognitive switch. We must detach ourselves from the previous task and expend significant mental energy to move on. If we are already drained to dangerous levels, then making the mental switch to the next thing is extra tough. It’s common to see people cyber-loafing after a frustrating meeting, going and getting coffee, interrupting a colleague and telling them about the meeting, and so on.",
      },
      {
        label: "G",
        en: "Each person’s ability to recover from horrible meetings is different. Some can bounce back quickly, while others carry their fatigue until the end of the workday. Yet while no formal MRS studies are currently underway, one can loosely speculate on the length of an average employee’s lag time. Switching tasks in a non-MRS condition takes about 10 to 15 minutes. With MRS, it may take as long as 45 minutes on average. It’s even worse when a worker has several meetings that are separated by 30 minutes. “Not enough time to transition in a non-MRS situation to get anything done, and in an MRS situation, not quite enough time to recover for the next meeting,” says researcher Joseph Allen. “Then, add the compounding of back-to-back bad meetings and we may have an epidemic on our hands.”",
      },
      {
        label: "H",
        en: "In an effort to combat the side effects of MRS, Allen, along with researcher Joseph Mroz and colleagues at the University of Nebraska-Omaha, published a study detailing the best ways to avoid common traps, including a concise checklist of do’s and don’ts applicable to any workplace. Drawing from around 200 papers to compile their comprehensive list, Mroz and his team may now hold a remedy to the largely undefined problem of MRS.",
      },
      {
        label: "I",
        en: "Mroz says a good place to start is asking ourselves if our meetings are even necessary in the first place. If all that’s on the agenda is a quick catch-up, or some non-urgent information sharing, it may better suit the group to send around an email instead. “The second thing I would always recommend is keep the meeting as small as possible,” says Mroz. “If they don’t actually have some kind of immediate input, then they can follow up later. They don’t need to be sitting in this hour-long meeting.” Less time in meetings would ultimately lead to more employee engagement in the meetings they do attend, which experts agree is a proven remedy for MRS.",
      },
      {
        label: "J",
        en: "Employees also feel taxed when they are invited together to meetings that don’t inspire participation, says Cliff Scott, professor of organisational science. It takes precious time for them to vent their emotions, complain and try to regain focus after a pointless meeting— one of the main traps of MRS. Over time as employees find themselves tied up in more and more unnecessary meetings—and thus dealing with increasing lag times from MRS—the waste of workday hours can feel insulting.",
      },
      {
        label: "K",
        en: "Despite the relative scarcity of research behind the subject, Hartman has taught herself many of the same tricks suggested in Mroz’s study, and has come a long way since her days of being stuck with unnecessary meetings. The people she invites to meetings today include not just the essential employees, but also representatives from every department that might have a stake in the issue at hand. Managers like her, who seek input even from non-experts to shape their decisions, can find greater support and cooperation from their workforce, she says.",
      },
      {
        label: "L",
        en: "If an organisation were to apply all 22 suggestions from Mroz and Allen’s findings, the most noticeable difference would be a stark decrease in the total number of meetings on the schedule, Mroz says. Less time in meetings would ultimately lead to increased productivity, which is the ultimate objective of convening a meeting. While none of the counter-MRS ideas have been tested empirically yet, Allen says one trick with promise is for employees to identify things that quickly change their mood from negative to positive. As simple as it sounds, finding a personal happy place, going there and then coming straight back to work might be key to facilitating recovery.",
      },
      {
        label: "M",
        en: "Leaders should see also themselves as “stewards of everyone else’s valuable time”, adds Steven Rogelberg, author of The Surprising Science of Meetings. Having the skills to foresee potential traps and treat employees’ endurance with care allows leaders to provide effective short-term deterrents to MRS.",
      },
      {
        label: "N",
        en: "Most important, however, is for organisations to awaken to the concept of meetings being flexible, says Allen. By reshaping the way they prioritise employees’ time, companies can eliminate the very sources of MRS in their tracks.",
      },
    ],
  },
  {
    id: "r-c1",
    label: "Passage One",
    labelZh: "仔细阅读 · 讽刺：敌意披着幽默的外衣",
    kind: "detail",
    questionRange: [46, 50],
    paragraphs: [
      {
        label: "",
        en: "Sarcasm and jazz have something surprisingly in common: You know them when you hear them. Sarcasm is mostly understood through tone of voice, which is used to portray the opposite of the literal words. For example, when someone says, “Well, that’s exactly what I need right now,” their tone can tell you it’s not what they need at all. Most frequently, sarcasm highlights an irritation or is, quite simply, mean. If you want to be happier and improve your relationships, cut out sarcasm. Why? Because sarcasm is actually hostility disguised as humor. Despite smiling outwardly, many people who receive sarcastic comments feel put down and often think the sarcastic person is rude, or contemptible. Indeed, it’s not surprising that the origin of the word sarcasm derives from the Greek word “sarkazein” which literally means “to tear or strip the flesh off.” Hence, it’s no wonder that sarcasm is often preceded by the word “cutting” and that it hurts. What’s more, since actions strongly determine thoughts and feelings, when a person consistently acts sarcastically it may only serve to heighten their underlying hostility and insecurity. After all, when you come right down to it, sarcasm can be used as a subtle form of bullying—and most bullies are angry, insecure, or cowardly. Alternatively, when a person stops voicing negative comments, especially sarcastic ones, they may soon start to feel happier and more self-confident. Also, other people in their life benefit even more because they no longer have to hear the emotionally hurtful language of sarcasm. Now, I’m not saying all sarcasm is bad. It may just be better used sparingly—like a potent spice in cooking. Too much of the spice, and the dish will be overwhelmed by it. Similarly, an occasional dash of sarcastic wit can spice up a chat and add an element of humor to it. But a big or steady serving of sarcasm will overwhelm the emotional flavor of any conversation and can taste very bitter to its recipient. So, tone down the sarcasm and work on clever wit instead, which is usually without any hostility and thus more appreciated by those you’re communicating with. In essence, sarcasm is easy while true, harmless wit takes talent. Thus, the main difference between wit and sarcasm is that, as already stated, sarcasm is often hostility disguised as humor. It can be intended to hurt and is often bitter and biting. Witty statements are usually in response to someone’s unhelpful remarks or behaviors, and the intent is to untangle and clarify the issue by emphasizing its absurdities. Sarcastic statements are expressed in a cutting manner; witty remarks are delivered with undisguised and harmless humor.",
      },
    ],
  },
  {
    id: "r-c2",
    label: "Passage Two",
    labelZh: "仔细阅读 · 变异性与学习",
    kind: "detail",
    questionRange: [51, 55],
    paragraphs: [
      {
        label: "",
        en: `Variability is crucially important for learning new skills. Consider learning how to serve in tennis. Should you always practise serving from the exactly same location on the court, aiming at the same spot? Although practising in more variable conditions will be slower at first, it will likely make you a better tennis player in the end. This is because variability leads to better generalisation of what is learned. This principle is found in many domains, including speech perception and learning categories. For instance, infants will struggle to learn the category “dog” if they are only exposed to Chihuahuas, instead of many different kinds of dogs. “There are over ten different names for this basic principle,” says Limor Raviv, the senior investigator of a recent study. “Learning from less variable input is often fast, but may fail to generalise to new stimuli.” To identify key patterns and understand the underlying principles of variability effects, Raviv and her colleagues reviewed over 150 studies on variability and generalisation across fields, including computer science, linguistics, categorisation, visual perception and formal education. The researchers discovered that, across studies, the term variability can refer to at least four different kinds of variability, such as set size and scheduling. “These four kinds of variability have never been directly compared—which means that we currently don’t know which is most effective for learning,” says Raviv. The impact of variability depends on whether it is relevant to the task or not. But according to the ‘Mr. Miyagi principle’, practising seemingly unrelated skills may actually benefit learning of other skills.

But why does variability impact learning and generalisation? One theory is that more variable input can highlight which aspects of a task are relevant and which are not. Another theory is that greater variability leads to broader generalisations. This is because variability will represent the real world better, including atypical (非典型的) examples. A third reason has to do with the way memory works: when training is variable, learners are forced to actively reconstruct their memories. “ Understanding the impact of variability is important for literally every aspect of our daily life. Beyond affecting the way we learn language, motor skills, and categories, it even has an impact on our social lives,” explains Raviv. “For example, face recognition is affected by whether people grew up in a small community or in a larger community. Exposure to fewer faces during childhood is associated with diminished face memory.” “ We hope this work will spark people’ s curiosity and generate more work on the topic,” “ concludes Raviv.Our paper raises a lot of open questions. Can we find similar effects of variability beyond the brain, for instance, in the immune system?”`,
      },
    ],
  },
];

export const READING_QUESTIONS: Question[] = [
  {
    n: 26,
    unitId: "r-a",
    stem: "{{26}}",
    options: [],
    answer: "C",
    evidence: "The colors of a rainbow are produced by the reflection and {{26}} of light through water droplets (小滴) present in the atmosphere.",
    explain: "语法判断：空格位于介词 and 之后，与 reflection 并列作宾语，需填表示物理过程的名词。语义判断：彩虹的七色来自白光在水滴中的反射与色散，填 dispersion（色散）即 the reflection and dispersion of light。干扰项 permeates（渗透）是动词，不能与 reflection 并列；eccentric（离心的）无关。",
  },
  {
    n: 27,
    unitId: "r-a",
    stem: "{{27}}",
    options: [],
    answer: "H",
    evidence: "An observer may {{27}} a rainbow to be located either near or far away, but this phenomenon is not actually located at any specific spot.",
    explain: "语法判断：空格在情态动词 may 之后作谓语，需要动词原形，主语是 An observer。语义判断：彩虹其实并不在任何具体位置，只是观察者会觉得它或近或远，填 perceive（感知、认为）准确。干扰项 ponder（沉思）指主动思考，与这一认知判断不符；recklessly（鲁莽地）是副词，不能作谓语。",
  },
  {
    n: 28,
    unitId: "r-a",
    stem: "{{28}}",
    options: [],
    answer: "M",
    evidence: "Instead, the appearance of a rainbow depends entirely upon the position of the observer in {{28}} to the direction of light.",
    explain: "语法判断：空格位于固定介词短语 in ___ to 之中，介词之后需填名词作介词宾语。语义判断：彩虹的外观完全取决于观察者相对于光线方向的位置，填 relation（关系）构成 in relation to（相对于）。干扰项 spectrum（光谱）指颜色的集合，与位置无关；eccentric（离心的）语义与「相对于光线方向」相反。",
  },
  {
    n: 29,
    unitId: "r-a",
    stem: "{{29}}",
    options: [],
    answer: "F",
    evidence: "In essence, a rainbow is an {{29}} illusion.",
    explain: "语法判断：空格在冠词 an 与名词 illusion 之间作定语，需填以元音音素开头的形容词。语义判断：前文说彩虹并不真实存在于任何具体位置，填 optical（视觉的）构成 optical illusion（视错觉），与「只是一种视觉现象」呼应。干扰项 preceding（先前的）、eccentric（离心的）都不能与 illusion 搭配。",
  },
  {
    n: 30,
    unitId: "r-a",
    stem: "{{30}}",
    options: [],
    answer: "N",
    evidence: "Rainbows present a {{30}} made up of seven colors in a specific order.",
    explain: "语法判断：空格在冠词 a 之后、过去分词 made up 之前作表语，需填可数名词单数。语义判断：彩虹呈现的是由七种颜色按特定顺序组成的光谱，填 spectrum（光谱）与首句 multi-colored 及后文七色顺序一致。干扰项 permeates、ponder 均为动词，不能作 a 的表语；eccentric（离心的）与颜色无关。",
  },
  {
    n: 31,
    unitId: "r-a",
    stem: "{{31}}",
    options: [],
    answer: "O",
    evidence: "“Roy G. Biv” {{31}} for: red, orange, yellow, green, blue, indigo, and violet.",
    explain: "语法判断：空格在主语“Roy G. Biv”（第三人称单数）之后、介词 for 之前作谓语，需要动词。语义判断：后面列出七个颜色的首字母缩写，说明 stand for（代表）正是这套记忆法的含义，填 stands 与之对应。干扰项中只有 stands 能与 for 构成该固定搭配，ponder、originates 等均不成立。",
  },
  {
    n: 32,
    unitId: "r-a",
    stem: "{{32}}",
    options: [],
    answer: "E",
    evidence: "A rainbow is formed when light (generally sunlight) passes through water droplets {{32}} in the atmosphere.",
    explain: "语法判断：空格位于名词短语 water droplets 之后作后置定语，需要现在分词。语义判断：雨滴是悬浮在大气中的，填 hanging（悬挂的）构成 water droplets hanging in the atmosphere，符合实际状态。干扰项 recklessly（鲁莽地）是副词、preceding（先前的）是形容词，都不能作此处后置定语。",
  },
  {
    n: 33,
    unitId: "r-a",
    stem: "{{33}}",
    options: [],
    answer: "A",
    evidence: "When light reflects off a water droplet, it simply {{33}} back in the opposite direction from where it {{34}} .",
    explain: "语法判断：空格在副词 simply 之后作谓语，需要动词原形；bounce back 为固定搭配。语义判断：光遇到水滴发生反射时朝来路相反的方向弹回，填 bounces（弹回）与后文「在另一侧反射而出」吻合。干扰项 permeates（渗透）表示逐渐渗入，不符合光被反射的方向性；recklessly 词性不合。",
  },
  {
    n: 34,
    unitId: "r-a",
    stem: "{{34}}",
    options: [],
    answer: "G",
    evidence: "When light reflects off a water droplet, it simply {{33}} back in the opposite direction from where it {{34}} .",
    explain: "语法判断：空格在介词短语 from where 之后作谓语，需要动词原形，主语是 it（光）。语义判断：前句说光反射后弹回原处，暗示光先从某处发出，填 originates（源于）正好衔接这一因果关系。干扰项 preceding（先前的）无「发出」之意；recklessly（鲁莽地）是副词，不能作谓语。",
  },
  {
    n: 35,
    unitId: "r-a",
    stem: "{{35}}",
    options: [],
    answer: "B",
    evidence: "When these bent light waves reach the other side of the water droplet, they reflect back out of the droplet instead of {{35}} passing through the water.",
    explain: "语法判断：空格在动名词 passing 之前作状语，需填副词修饰动作的彻底程度。语义判断：instead of completely passing through the water 表示光到达水滴另一侧即反射而出、并未完全穿透水滴，填 completely（完全地）与 instead of 形成对比。干扰项 recklessly（鲁莽地）带贬义，不合科学描述；hanging（悬挂的）语态不通。",
  },
  {
    n: 36,
    unitId: "r-b",
    stem: "Although employees are said to be fatigued by meetings, the condition has not been considered worthy of further research until recently.",
    options: [],
    answer: "D",
    evidence: "It isn’t ground-breaking to say workers feel fatigued after a meeting, but only in recent decades have scientists deemed the condition worthy of further investigation.",
    explain: "题干关键信息 employees are said to be fatigued 与 not considered worthy of further research until recently 定位到 D 段。D 段第二句指出，工人在会后疲惫并非新鲜事，只是近几十年科学家才认为它值得研究。题干是同义转述。B 段只讲会议数量与成本，H 段讲应对办法，均未涉及研究受重视的时间点。",
  },
  {
    n: 37,
    unitId: "r-b",
    stem: "Mroz and his team compiled a list of what to do and what not to do to remedy the problem of MRS.",
    options: [],
    answer: "H",
    evidence: "In an effort to combat the side effects of MRS, Allen, along with researcher Joseph Mroz and colleagues at the University of Nebraska-Omaha, published a study detailing the best ways to avoid common traps, including a concise checklist of do’s and don’ts applicable to any workplace.",
    explain: "题干关键信息 Mroz and his team compiled a list of what to do and what not to do 定位到 H 段。H 段首句提到，Allen 与 Mroz 等人发表了一项研究，详细说明如何避开常见陷阱，其中包括一份「该做与不该做」的简明清单。题干是同义转述。I 段提出的是具体建议，N 段讲会议制度的灵活性，都不是「汇编清单」，故排除。",
  },
  {
    n: 38,
    unitId: "r-b",
    stem: "Companies can get rid of the root cause of MRS if they give priority to workers’ time.",
    options: [],
    answer: "N",
    evidence: "By reshaping the way they prioritise employees’ time, companies can eliminate the very sources of MRS in their tracks.",
    explain: "题干关键信息 get rid of the root cause of MRS 与 give priority to workers’ time 定位到 N 段。N 段第二句指出，重新调整企业安排员工时间的方式，公司可从根本上消除 MRS 的源头。题干是同义转述，root cause 即 the very sources of MRS。D、E 两段都未给出根治办法。",
  },
  {
    n: 39,
    unitId: "r-b",
    stem: "If workers are exhausted to a dangerous degree, it is extremely hard for them to transition to the next task.",
    options: [],
    answer: "F",
    evidence: "If we are already drained to dangerous levels, then making the mental switch to the next thing is extra tough.",
    explain: "题干关键信息 exhausted to a dangerous degree 与 extremely hard to transition 定位到 F 段。F 段第三句指出，若已被消耗到危险程度，再切换到下一件事就格外困难。题干是同义转述：drained 对应 exhausted，mental switch 对应 transition。E 段讲消耗机制，G 段讲恢复时长，均非「切换任务」的难度。",
  },
  {
    n: 40,
    unitId: "r-b",
    stem: "Employees in America spend a lot of time attending meetings while the number of hours managers meet is several times more.",
    options: [],
    answer: "B",
    evidence: "Every week, employees spend about six hours in meetings, while the average manager meets for a staggering 23 hours.",
    explain: "题干关键信息 employees spend a lot of time in meetings 与 managers meet is several times more 定位到 B 段。B 段第三句指出，员工每周要开六小时的会，而普通管理者每周高达 23 小时，两者相差数倍。题干是同义转述。A 段只讲 Hartman 个人受会议困扰，D 段讨论 MRS 概念，均未给出工时数据。",
  },
  {
    n: 41,
    unitId: "r-b",
    stem: "Phyllis Hartman has learned by herself many of the ways Mroz suggested in his study and made remarkable success in freeing herself from unnecessary meetings.",
    options: [],
    answer: "K",
    evidence: "Despite the relative scarcity of research behind the subject, Hartman has taught herself many of the same tricks suggested in Mroz’s study, and has come a long way since her days of being stuck with unnecessary meetings.",
    explain: "题干关键信息 Hartman has taught herself the same tricks Mroz suggested 与 freeing herself from unnecessary meetings 定位到 K 段。K 段首句提到，Hartman 已自学了 Mroz 研究中提出的许多同样技巧，且比过去深陷无谓会议时走了很远。题干是同义转述。A、L 两段都不是「自学技巧」。",
  },
  {
    n: 42,
    unitId: "r-b",
    stem: "When meetings continue too long or don’t engage employees, they deplete vitality.",
    options: [],
    answer: "E",
    evidence: "Meetings drain vitality if they last too long, fail to engage employees or turn into one-sided lectures.",
    explain: "题干关键信息 meetings continue too long or don’t engage employees 与 deplete vitality 定位到 E 段。E 段第三句指出，会议若持续太久、无法让员工参与，或变成单方面宣讲，就会消耗掉人的活力。题干是同义转述，last too long 即 continue too long。G、I 两段都不是原因。",
  },
  {
    n: 43,
    unitId: "r-b",
    stem: "When the time of meetings is reduced, employees will be more engaged in the meetings they do participate in.",
    options: [],
    answer: "I",
    evidence: "Less time in meetings would ultimately lead to more employee engagement in the meetings they do attend, which experts agree is a proven remedy for MRS.",
    explain: "题干关键信息 when the time of meetings is reduced 与 employees will be more engaged 定位到 I 段。I 段最后一句指出，减少会议时间最终会提高员工在他们实际参加的会议中的参与度，而专家认为这正是缓解 MRS 的可靠办法。题干是对原文的同义转述。H 段讲研究的汇编，L 段讲全面落实建议后会议数量锐减，都未直接谈参与度提升，故排除。",
  },
  {
    n: 44,
    unitId: "r-b",
    stem: "Some employees consider meetings one of the most dispensable parts of the workday.",
    options: [],
    answer: "C",
    evidence: "And though experts agree that traditional meetings are essential for making certain decisions and developing strategy, some employees view them as one of the most unnecessary parts of the workday.",
    explain: "题干关键信息 some employees consider meetings one of the most dispensable parts of the workday 定位到 C 段。C 段首句指出，尽管专家认为传统会议对决策和战略必不可少，但有些员工认为它们是工作日中最没必要的一部分。题干是同义转述，dispensable 即 unnecessary。B、E 两段均未涉及员工态度。",
  },
  {
    n: 45,
    unitId: "r-b",
    stem: "According to Mroz, if all his suggestions were applied, a very obvious change would be a steep decrease in the number of meetings scheduled.",
    options: [],
    answer: "L",
    evidence: "If an organisation were to apply all 22 suggestions from Mroz and Allen’s findings, the most noticeable difference would be a stark decrease in the total number of meetings on the schedule, Mroz says.",
    explain: "题干关键信息 according to Mroz 与 if all his suggestions were applied 定位到 L 段。L 段首句指出，若把 22 条建议全部落实，最明显的变化将是会议总数的急剧减少。题干是同义转述，a very obvious change 即 the most noticeable difference。I 段未提全面落实建议的效果。",
  },
  {
    n: 46,
    unitId: "r-c1",
    stem: "Why does the author say sarcasm and jazz have something surprisingly in common?",
    options: [
      {
        key: "A",
        en: "Both are recognized when heard.",
      },
      {
        key: "B",
        en: "Both have exactly the same tone.",
      },
      {
        key: "C",
        en: "Both mean the opposite of what they appear to.",
      },
      {
        key: "D",
        en: "Both have hidden in them an evident irritation.",
      },
    ],
    answer: "A",
    evidence: "Sarcasm and jazz have something surprisingly in common: You know them when you hear them.",
    explain: "选项 A「两者都是一听到就能辨认出来」与原文首句「Sarcasm and jazz have something surprisingly in common: You know them when you hear them.」完全对应，故正确。B 项说两者语气完全相同，原文只说讽刺靠语气传达，属过度推断；C 项把讽刺「与字面相反」的特征套给爵士乐；D 项的「恼怒」只是讽刺的特点，故排除。",
  },
  {
    n: 47,
    unitId: "r-c1",
    stem: "How do many people feel when they hear sarcastic comments?",
    options: [
      {
        key: "A",
        en: "They feel hostile towards the sarcastic person.",
      },
      {
        key: "B",
        en: "They feel belittled and disrespected.",
      },
      {
        key: "C",
        en: "They feel a strong urge to retaliate.",
      },
      {
        key: "D",
        en: "They feel incapable of disguising their irritation.",
      },
    ],
    answer: "B",
    evidence: "Despite smiling outwardly, many people who receive sarcastic comments feel put down and often think the sarcastic person is rude, or contemptible.",
    explain: "选项 B「感到被贬低、被轻视」与原文「feel put down and often think the sarcastic person is rude, or contemptible.」对应，feel put down 即被贬低，rude or contemptible 即不尊重，故正确。A 项的「敌意」属于讽刺者自身；C 项「报复」原文未提；D 项与听者无关，故排除。",
  },
  {
    n: 48,
    unitId: "r-c1",
    stem: "What happens when a person consistently acts sarcastically?",
    options: [
      {
        key: "A",
        en: "They feel their dignity greatly heightened.",
      },
      {
        key: "B",
        en: "They feel increasingly insecure and hostile.",
      },
      {
        key: "C",
        en: "They endure hostility under the disguise of humor.",
      },
      {
        key: "D",
        en: "They taste bitterness even in pleasant interactions.",
      },
    ],
    answer: "B",
    evidence: "What’s more, since actions strongly determine thoughts and feelings, when a person consistently acts sarcastically it may only serve to heighten their underlying hostility and insecurity.",
    explain: "选项 B「他们会感到越来越不安全、更加充满敌意」与原文「it may only serve to heighten their underlying hostility and insecurity.」一致，heighten 对应 increasingly，故正确。A 项与原文相反；C 项「在幽默外衣下忍受敌意」说的是听者，原文指敌意被伪装成幽默；D 项讲听者的味觉感受，非说话者状态，故排除。",
  },
  {
    n: 49,
    unitId: "r-c1",
    stem: "What does the author say about people quitting sarcastic comments?",
    options: [
      {
        key: "A",
        en: "It makes others happier and more self-confident.",
      },
      {
        key: "B",
        en: "It restrains them from being irritating and bullying.",
      },
      {
        key: "C",
        en: "It benefits not only themselves but also those around them.",
      },
      {
        key: "D",
        en: "It shields them from negative comments and outright hostility.",
      },
    ],
    answer: "C",
    evidence: "Also, other people in their life benefit even more because they no longer have to hear the emotionally hurtful language of sarcasm.",
    explain: "选项 C「不仅自己受益，身边人也受益」与原文两句呼应：说话者停止说反话后「feel happier and more self-confident」，而「other people in their life benefit even more」，故选 C。A 项只覆盖说话者自身；B 项说讽刺能约束行为，原文只讲讽刺常被用作霸凌的隐蔽形式；D 项无中生有，故排除。",
  },
  {
    n: 50,
    unitId: "r-c1",
    stem: "What is the chief difference between a speaker’s wit and sarcasm?",
    options: [
      {
        key: "A",
        en: "Their clarity.",
      },
      {
        key: "B",
        en: "Their appreciation.",
      },
      {
        key: "C",
        en: "Their emphasis.",
      },
      {
        key: "D",
        en: "Their intention.",
      },
    ],
    answer: "D",
    evidence: "Witty statements are usually in response to someone’s unhelpful remarks or behaviors, and the intent is to untangle and clarify the issue by emphasizing its absurdities.",
    explain: "选项 D「意图」与原文的对比呼应：讽刺「can be intended to hurt」，而机智的回应「the intent is to untangle and clarify the issue」，一个意图伤人、一个意图厘清问题，故正确。A 项「清晰度」是机智言谈的特点；B 项「是否受欣赏」并非两者的分界；C 项「强调」两者皆有，属以偏概全，故排除。",
  },
  {
    n: 51,
    unitId: "r-c2",
    stem: "What does the passage say about infants learning the category “dog” if they are exposed to Chihuahuas only?",
    options: [
      {
        key: "A",
        en: "They will encounter some degree of difficulty.",
      },
      {
        key: "B",
        en: "They will try to categorise other objects first.",
      },
      {
        key: "C",
        en: "They will prefer Chihuahuas to other dog species.",
      },
      {
        key: "D",
        en: "They will imagine Chihuahuas in various conditions.",
      },
    ],
    answer: "A",
    evidence: "For instance, infants will struggle to learn the category “dog” if they are only exposed to Chihuahuas, instead of many different kinds of dogs.",
    explain: "选项 A「他们会遇到一定的困难」与原文「infants will struggle to learn the category “dog” if they are only exposed to Chihuahuas」对应，struggle to learn 即遇到困难，故选 A。B 项「先给其他物体归类」原文未提；C 项「更偏爱吉娃娃」与原文相反；D 项无中生有，故排除。",
  },
  {
    n: 52,
    unitId: "r-c2",
    stem: "What does Raviv say about the four different kinds of variability?",
    options: [
      {
        key: "A",
        en: "Which of them is most relevant to the task at hand is to be confirmed.",
      },
      {
        key: "B",
        en: "Why they have an impact on learning is far from being understood.",
      },
      {
        key: "C",
        en: "Why they have never been directly compared remains a mystery.",
      },
      {
        key: "D",
        en: "Which of them is most conducive to learning is yet to be identified.",
      },
    ],
    answer: "D",
    evidence: "“These four kinds of variability have never been directly compared—which means that we currently don’t know which is most effective for learning,” says Raviv.",
    explain: "选项 D「哪一种最有助于学习尚待确定」与原文「we currently don’t know which is most effective for learning」对应，never been directly compared 即 yet to be identified，故选 D。A 项把「尚未比较」曲解为「哪种更相关待确认」；B、C 两项把「暂不明确」说成「谜团」，语气不符，故排除。",
  },
  {
    n: 53,
    unitId: "r-c2",
    stem: "How does one of the theories explain the importance of variability for learning new skills?",
    options: [
      {
        key: "A",
        en: "Learners regard variable training as typical of what happens in the real world.",
      },
      {
        key: "B",
        en: "Learners receiving variable training are compelled to reorganise their memories.",
      },
      {
        key: "C",
        en: "Learners pay attention to the relevant aspects of a task and ignore those irrelevant.",
      },
      {
        key: "D",
        en: "Learners focus on related skills instead of wasting time and effort on unrelated ones.",
      },
    ],
    answer: "B",
    evidence: "One theory is that more variable input can highlight which aspects of a task are relevant and which are not.",
    explain: "选项 C「关注任务中相关的方面、忽略不相关的方面」与原文「highlight which aspects of a task are relevant and which are not.」一致，highlight 相关的、排除不相关的，故正确。B 项「被迫重建记忆」是 variability 起作用的第三个原因，非注意力表现；A 项原文未提；D 项与原文相反，故排除。",
  },
  {
    n: 54,
    unitId: "r-c2",
    stem: "What does the passage say about face recognition?",
    options: [
      {
        key: "A",
        en: "People growing up in a small community may find it easy to remember familiar faces.",
      },
      {
        key: "B",
        en: "Face recognition has a significant impact on literally every aspect of our social lives.",
      },
      {
        key: "C",
        en: "People growing up in a large community can readily recognise any individual faces.",
      },
      {
        key: "D",
        en: "The size of the community people grow up in impacts their face recognition ability.",
      },
    ],
    answer: "D",
    evidence: "For example, face recognition is affected by whether people grew up in a small community or in a larger community.",
    explain: "选项 D「社区规模影响面孔识别能力」与原文「face recognition is affected by whether people grew up in a small community or in a larger community.」完全对应，故正确。A 项只描述小社区中的一种表现，过于片面；B 项把影响范围缩到面孔识别；C 项与原文「接触面孔少会削弱面孔记忆」相反，故排除。",
  },
  {
    n: 55,
    unitId: "r-c2",
    stem: "What does Raviv hope to do with their research work?",
    options: [
      {
        key: "A",
        en: "Highlight which aspects of a task are relevant and which are not to learning a skill.",
      },
      {
        key: "B",
        en: "Use the principle of variability in teaching seemingly unrelated skills in education.",
      },
      {
        key: "C",
        en: "Arouse people’s interest in variability and stimulate more research on the topic.",
      },
      {
        key: "D",
        en: "Apply the principle of variability to such fields of study as the immune system.",
      },
    ],
    answer: "C",
    evidence: "We hope this work will spark people’ s curiosity and generate more work on the topic",
    explain: "选项 C「激起兴趣、推动更多研究」与原文「spark people’s curiosity and generate more work」对应，spark curiosity 即 arouse interest，generate more work 即 stimulate research，故正确。A 项是解释 variability 作用的一个理论，非展望；B、D 两项都不是文中的主张，故排除。",
  },
];
