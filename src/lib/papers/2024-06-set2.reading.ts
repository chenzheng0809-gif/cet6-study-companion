import type { Question, ReadingSection } from "./types";

/**
 * 2024 年 06 月六级 · 第 2 套 · Part III Reading Comprehension
 *
 * 原文、题干、选项来自《2024年06月大学英语六级考试真题（第2套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第2套）》PDF（用户提供）。
 *
 * 这一套没有解析册：逐题解析与原文依据句由本项目依据真题原文撰写，
 * 每条依据句都逐字取自上面的原文，不是别处的措辞。
 * 中文标题也是按原文内容写的，不是从别处抄的。
 */

export const READING_SECTIONS: ReadingSection[] = [
  {
    id: "r-a",
    label: "Section A",
    labelZh: "选词填空 · 读一本小说的感受",
    kind: "bank",
    questionRange: [26, 35],
    paragraphs: [
      {
        label: "",
        en: "The Sun Is Also a Star is a truly lovely story of love, romance, fate, and destiny. Natasha is a Jamaican-born immigrant living {{26}} in America, not by choice exactly. Her parents brought her over and created the situation she {{27}} to be out of. Daniel is an American born of Korean immigrants. He believes in true love, fate, and all that other nonsense that Natasha {{28}} through scientific reasoning. Daniel and Natasha meet by {{29}} on the streets of New York on the day that she is to be {{30}} . She doesn’t tell him that but does allow him to keep her company while he tries to get her to fall in love with him over the course of the day. Natasha is me. I found her so similar to myself. She’s scientifically-minded, practical, somewhat cynical, and always {{31}} . Her obsession with the universe through a scientific lens is infectious and I {{32}} Daniel seeing that too. Daniel is charming and passionate and has a way with words that even {{33}} Natasha’s tough outer shell.By the end of the book I fell in love with both of them. I used to find romance stories to always be cheap or laughable. I think now I can see the value in escaping into a story of pure optimism. I got {{34}} in The Sun Is Also a Star and finished it cover to cover in a weekend. I couldn’t wait to get to what I hoped would be a happy ending. It’s nice every once in a while to give in to magic. It doesn’t have to be a hard fantasy novel with actual spells, it can be the magic found between two people who just have that special something. That {{35}} that causes them to react and spark when they’re near each other.",
      },
    ],
    bank: [
      {
        key: "A",
        word: "adore",
        pos: "v.",
        zh: "喜爱；很看重",
      },
      {
        key: "B",
        word: "appraise",
        pos: "v.",
        zh: "评估；估价",
      },
      {
        key: "C",
        word: "assaults",
        pos: "n.",
        zh: "攻击；袭击",
      },
      {
        key: "D",
        word: "chemistry",
        pos: "n.",
        zh: "化学；化学反应",
      },
      {
        key: "E",
        word: "coincidence",
        pos: "n.",
        zh: "巧合",
      },
      {
        key: "F",
        word: "cracks",
        pos: "n.",
        zh: "裂缝；裂痕",
      },
      {
        key: "G",
        word: "deported",
        pos: "v.",
        zh: "被驱逐出境",
      },
      {
        key: "H",
        word: "dismisses",
        pos: "v.",
        zh: "驳回；不予考虑",
      },
      {
        key: "I",
        word: "illegally",
        pos: "adv.",
        zh: "非法地",
      },
      {
        key: "J",
        word: "lost",
        pos: "adj.",
        zh: "失去的；沉浸其中的",
      },
      {
        key: "K",
        word: "perpetually",
        pos: "adv.",
        zh: "永远地；持续地",
      },
      {
        key: "L",
        word: "prescribed",
        pos: "v.",
        zh: "规定；开处方",
      },
      {
        key: "M",
        word: "shrewd",
        pos: "adj.",
        zh: "精明的",
      },
      {
        key: "N",
        word: "skeptical",
        pos: "adj.",
        zh: "怀疑的",
      },
      {
        key: "O",
        word: "strives",
        pos: "v.",
        zh: "努力；力争",
      },
    ],
  },
  {
    id: "r-b",
    label: "Section B",
    labelZh: "长篇阅读 · 想改掉坏习惯，别做这些",
    kind: "matching",
    questionRange: [36, 45],
    paragraphs: [
      {
        label: "A",
        en: "According to recent research, behavioral change involves physical changes in the brain. In the past decade, researchers have shown that when it comes to the duration of making a new behavior a deep-rooted habit there is not a simple answer. Even for the most productive and disciplined among us, undoing something that has become an automatic part of who we are takes more than an overnight effort. Once we’ve successfully made that change, we then have to make other adjustments to our lives to ensure that we continue to maintain it, which is often a whole other challenge in itself.",
      },
      {
        label: "B",
        en: "At its core, success in changing and maintaining a behavior rarely occurs without the introduction of some sort of system. When there isn’t the right framework in place, we face a greater likelihood of derailing our hard-earned progress. To ensure success in changing and maintaining a behavior, we should stay away from some detrimental habits.",
      },
      {
        label: "C",
        en: "The first one to avoid is relying on willpower. Think about the last time you vowed to resist a temptation. Perhaps you didn’t want to check your phone every 15 minutes, or you were determined not to reach for a chocolate bar at 3 p.m. Think about how difficult it must have been not to glance at your phone when it was within reach, or not to walk to the vending machine when your afternoon slump hit.",
      },
      {
        label: "D",
        en: "The research on whether we have finite or infinite willpower is inconclusive, but experts do generally agree that you can’t change and sustain a habit if you rely on your willpower alone. The old military saying “You never rise to the occasion, you only sink to the level of training” also applies to behavior change. The idea is simple—you repeat something so many times that it becomes automatic.",
      },
      {
        label: "E",
        en: "Think about what else you can change about your surrounding that makes it easier for you to perform this change on a daily basis. This is called your “cue.” Basically, it’s a trigger to perform that particular habit. If you don’t want to reach for a sugary treat at 3 p.m., have a box of herbal tea ready at your desk. When 3 p.m. comes around, that’s your cue to pour yourself a cup of hot water and drink that tea, instead of walking to the vending machine.",
      },
      {
        label: "F",
        en: "The second one to avoid is focusing on negative goals. Sometimes, it’s not your process that lets you down, but the habit that you want to change in the first place. For starters, not eating chocolate to beat your afternoon slump is a harder goal than swapping chocolate for herbal tea when you reach the designated time. Your brain wants to find routines that have succeeded in the past and allow you to repeat those actions again in the future without having to think about them explicitly. However, this habit-learning system isn’t so effective when it comes to learning not to do something. That’s why rather than giving up something, think about introducing something in its place. Focus on actions you are going to take that will ultimately conflict with the behaviors you want to stop. When your attention is on doing something new, you give your habit system a chance to operate.",
      },
      {
        label: "G",
        en: "The third one to avoid is using the same strategies in different circumstances. Because we are creatures of habit, it’s natural to assume that when we do manage to adopt and sustain a desirable behavior, that same strategy will work when we want to make another behavior change. But that’s not always the case. Sometimes, the system that got you to change one behavior might not work for another.",
      },
      {
        label: "H",
        en: "Sometimes we become accustomed to relying on our guts when it comes to decision- making. This serves us well in certain situations, but can hinder us in others especially when we need to consider metrics and data, rather than letting our instinct override everything. For example, if you want to stop checking your email first thing in the morning, you might decide to substitute another activity in its place. But if you want to stop indulging in video games, simply deciding you will go for a run might not be as effective. You might need to introduce another reinforcement, such as meeting a friend and booking an exercise class together.",
      },
      {
        label: "I",
        en: "The fourth one to avoid is not forgiving ourselves for slipping up. Of course, even the best- laid plans fail sometimes. You might have stuck to your screen-free nighttime routine for five days, and then a big project landed on your desk and you found yourself in bed with your laptop before you went to sleep. Or you prepared meals on Sunday and stuck to eating healthy dinners at home, but by Friday you found yourself so exhausted and opted to order greasy takeout. Life happens and even if your behavior change is small, every single day can prove pretty inflexible, and at some point your luck may run out, even if just for a day. The perfectionist in you might be screaming to abandon your goals altogether, but try to see it in the bigger picture. Just because you might have temporarily strayed off course doesn’t mean you can’t start afresh the next day.",
      },
      {
        label: "J",
        en: "The final one to avoid is discounting small progress. There’s a habit that many perfectionists tend to fall into when they try to establish a behavior change. They focus too much on the big goal and don’t take the time to celebrate the small progress they make in the process. Your brain responds to rewards. The basal ganglia, the brain region linked to our performance of habits, is most active at the beginning of a behavior, when the habit is cued, and at the end, when it’s rewarded. Say your goal is to run five miles three times a week, and this week you ran one mile on Monday, Wednesday, and Friday. Rather than focusing on how far you’ve gone toward your goal, think about how you can reward yourself for the progress you’ve made. It doesn’t have to be big or expensive; it can be something as simple as making your favorite fruit juice after your run. Whatever your reward, it has to be more than just the activity itself to get you going.",
      },
      {
        label: "K",
        en: "Initiating a new behavior usually seems like the hardest part of the process of change. However, people often fail to adequately prepare for maintaining it. One of the reasons for this is because we mistakenly believe the strategies we used to initiate the change will be equally effective in helping us continue the change. But they won’t. Where changing a strongly deep-rooted habit requires changing our belief about that habit that penetrates deeply into our lives, continually manifesting that wisdom requires that we maintain a positive outlook. If our mood is low, the wisdom to behave differently seems to disappear and we go back to eating more and exercising less. The key, then, to maintaining new behaviors is to be happy! Which is why it’s so hard to maintain new behaviors.",
      },
      {
        label: "L",
        en: "Remember, overcoming the behavioral inertia that prevents us from implementing new changes, like eating a healthy diet or exercising, can benefit us in the long run and can improve our physical and mental health. No one was born with habits. They were all learned, and can all, therefore, be unlearned. The question is: how badly do you really want to change?",
      },
    ],
  },
  {
    id: "r-c1",
    label: "Passage One",
    labelZh: "仔细阅读 · 真人秀如何固化美国梦",
    kind: "detail",
    questionRange: [46, 50],
    paragraphs: [
      {
        label: "",
        en: "The “American Dream” promises that in the Land of Opportunity, any individual can climb the economic ladder and prosper through hard work and ambition alone. And yet, young Americans today are struggling to earn more than their parents did at the same age, and upward mobility in the US actually compares unfavourably to that of other industrialised nations. So why does the idea of the American Dream persist? A new study in the American Journal of Political Science identifies one factor that has been overlooked: the influence of reality TV. Reality shows have come to dominate US television over the past 20 years, notes Eunji Kim from Vanderbilt University. And the overwhelming majority of these have a “rags-to- riches” storyline: they feature ordinary Americans who work hard to achieve great economic success. And while these programmes are regularly among the most-watched shows, news broadcasts—which paint a more realistic view of the economic hardship faced by millions of Americans—get a much smaller proportion of the viewership. — Rags-to-riches stories are ubiquitous (无处不在的) on TVbut does watching these programmes actually convince people that economic mobility is easily attainable? To find out, Kim’s team had participants watch a 5-minute clip from a reality show with a rags-to-riches storyline. Control participants watched a clip from a reality show that didn’t have a rags-to- riches story. After watching the shows, participants rated how much they agreed with four statements relating to the American Dream. The results showed that those who’d watched a rags-to-riches clip did indeed have a significantly greater belief in the American Dream. Interestingly, when participants were separated by party affiliation, this effect was significant among Republicans but not Democrats, suggesting that the kind of messages implicit in these TV shows may play into people’s existing socioeconomic beliefs. Kim also conducted a survey of 3,000 US residents. They also rated the extent to which they believed success in life is related to various internal factors (such as ambition) and external factors (such as family wealth). Finally, they read a list of TV programmes and indicated which they regularly watched. Participants who were heavy viewers of rags-to-riches programmes or frequent viewers had a stronger belief in the American Dream than those who never watched such shows. Kim concludes that “rags-to-riches entertainment media are an important cultural force that promotes and perpetuates beliefs in upward mobility”. And here’s the problem: if people mistakenly believe that hard work is all that is needed for individuals to make a better life for themselves, they may be less supportive of policies that could actually combat inequality. “ In this era of choice, entertainment media are what captures hearts and minds,” Kim writes. “Its political consequences are anything but trivial”.",
      },
    ],
  },
  {
    id: "r-c2",
    label: "Passage Two",
    labelZh: "仔细阅读 ·「没有工作，我不知道我是谁」",
    kind: "detail",
    questionRange: [51, 55],
    paragraphs: [
      {
        label: "",
        en: "When someone asks us ‘what do you do?’ we nearly always reply with our occupation. Work, for many of us, is much more than a job. It is the defining aspect of our identity. For many of us it is through our job that we can define ourselves. “ Without my job I don’t know who I am,” is a sentence that has been uttered on more than a handful of occasions from my office chair. Indeed, it can be one of the most challenging aspects I work on with clients who have lost or been forced into changing their jobs. This loss provokes an identity crisis much greater than the loss of the job itself. One of the things I have come to understand, however, is that our identity is much more complex than we recognise at first glance. If we take the time to reflect we might recognise that as well as our work we can also identify as a friend, a spouse, a son or daughter, a parent, a member of a sports team or religious community. We may recognise that we feel and act differently in these roles and relationships than we do at work. The passive daughter becomes an assertive leader at work. Furthermore, our identities at work are not static. They change over time. I myself have been a shop assistant, a waitress, a student, a graduate, and a clinical psychologist. At each stage my ability to adapt to and develop my career identity has been crucial to my wellbeing. Whilst we like to eliminate uncertainty in our lives at some level we have to manage uncertainty, especially in today’s volatile and ever-shifting job market. How we see ourselves is central to the issue of our identity. When we tell ourselves “I’m good at starting projects but not so great at seeing them through” it can become part of our belief system. But if you have the unfortunate experience of an enforced job change you will need to examine those beliefs to see how grounded in reality they are. You will be required to ask yourself how helpful these beliefs are and consider personal change. We can change our beliefs, behaviours and emotional experience at any time through experimentation, practice and conscious self-discipline. In an age where career progression may lead us into new sectors it is ever more important to challenge our sense of self and explore whether you can create a new experience of your identity by changing the beliefs you hold about yourself in order to expand your career options. Ultimately it is you who define who you are. You are only your job if you let it be so.",
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
    answer: "I",
    evidence: "Natasha is a Jamaican-born immigrant living {{26}} in America, not by choice exactly.",
    explain: "语法判断：空格位于动名词 living 之后、介词 in America 之前，需要填入一个副词修饰 living。语义判断：前文说 Natasha 是牙买加出生、被父母强行带来的移民，not by choice exactly 暗示她的居留并非出于本意，illegally（非法地）与这一暗示呼应。干扰项：perpetually（永远地）只表时间，prescribed（规定的）词性与语义都不合。",
  },
  {
    n: 27,
    unitId: "r-a",
    stem: "{{27}}",
    options: [],
    answer: "O",
    evidence: "Her parents brought her over and created the situation she {{27}} to be out of.",
    explain: "语法判断：that 从句 she ___ to be out of 缺谓语，主语 she 是第三人称单数，故填第三人称单数动词，且要能接 to be out of。语义判断：前文说父母带来她并「制造了这个局面」，她得努力摆脱，strives to be out of（努力摆脱这一局面）搭配得当。干扰项：appraise（评估）语义无关，prescribe（规定）接不了 to be out of。",
  },
  {
    n: 28,
    unitId: "r-a",
    stem: "{{28}}",
    options: [],
    answer: "H",
    evidence: "He believes in true love, fate, and all that other nonsense that Natasha {{28}} through scientific reasoning.",
    explain: "语法判断：空格是定语从句 that Natasha ___ through scientific reasoning 的谓语，要第三人称单数动词。语义判断：Daniel 相信真爱命运，all that other nonsense 与之一脉相承，dismisses（不予理睬）即用科学推理否定它们。干扰项：adore（崇拜）与 nonsense 矛盾，cracks 接 through 不成搭配。",
  },
  {
    n: 29,
    unitId: "r-a",
    stem: "{{29}}",
    options: [],
    answer: "E",
    evidence: "Daniel and Natasha meet by {{29}} on the streets of New York on the day that she is to be {{30}} .",
    explain: "语法判断：空格位于介词 by 之后作其宾语，需填一个名词，其后接地点状语。语义判断：Daniel 是美国人、Natasha 是牙买加移民，两人素不相识却在纽约街头相遇，且当天她即将被遣送，by coincidence（碰巧、巧合）最贴切。干扰项：chemistry（化学反应）说的是两人相爱的火花，语义不符；shrewd（精明的）是形容词，词性不合。",
  },
  {
    n: 30,
    unitId: "r-a",
    stem: "{{30}}",
    options: [],
    answer: "G",
    evidence: "Daniel and Natasha meet by {{29}} on the streets of New York on the day that she is to be {{30}} .",
    explain: "语法判断：空格位于 is to be 之后，需填过去分词构成被动语态（is to be deported＝即将被遣送）。语义判断：上文说她是被父母强行带来的移民，not by choice exactly 点出她的身份是被动的，因此当天她「即将被遣送出境」，deported 正好呼应她想摆脱的处境。干扰项：illegally（非法地）是副词，填进去无法与 be 构成被动结构。",
  },
  {
    n: 31,
    unitId: "r-a",
    stem: "{{31}}",
    options: [],
    answer: "N",
    evidence: "She’s scientifically-minded, practical, somewhat cynical, and always {{31}} .",
    explain: "语法判断：空格紧跟 always 之后作表语，需填形容词；空格后已到句末，不能再接名词。语义判断：本句用并列形容词刻画 Natasha——科学的、务实的、有点愤世嫉俗的——always skeptical（总是持怀疑态度）与 scientific-minded、cynical 互相印证。干扰项：shrewd（精明的）语义相反，appraise（评估）需作动词用。",
  },
  {
    n: 32,
    unitId: "r-a",
    stem: "{{32}}",
    options: [],
    answer: "A",
    evidence: "Her obsession with the universe through a scientific lens is infectious and I {{32}} Daniel seeing that too.",
    explain: "语法判断：空格位于主语 I 与宾语 Daniel 之间作谓语，且结构是「动词+宾语+宾补」，必须填及物动词。语义判断：前句说她对宇宙的痴迷「是有感染力的」，作者借此表示自己也「喜欢上了」Daniel，adore（非常喜欢）承接这种被感染的情感递进。干扰项：appraise（评估）语气过冷，dismisses（不予理睬）与感染力相矛盾。",
  },
  {
    n: 33,
    unitId: "r-a",
    stem: "{{33}}",
    options: [],
    answer: "F",
    evidence: "Daniel is charming and passionate and has a way with words that even {{33}} Natasha’s tough outer shell.",
    explain: "语法判断：空格位于 that 引导的定语从句中作宾语，需填动词，even 提示动作出乎意料。语义判断：前文说 Natasha 表面强硬、有点愤世嫉俗，而 Daniel 很会说话，cracks（使裂开、破防）与 tough outer shell 正面呼应，即连她坚硬的外壳都被撬开了。干扰项：dismisses（不理睬）语义不合，chemistry 是名词不能带宾语。",
  },
  {
    n: 34,
    unitId: "r-a",
    stem: "{{34}}",
    options: [],
    answer: "J",
    evidence: "I got {{34}} in The Sun Is Also a Star and finished it cover to cover in a weekend.",
    explain: "语法判断：空格位于 get 之后、介词 in 之前作宾语，且 get lost 是固定搭配，需填名词或名词化的动名词。语义判断：后文说他「一个周末就从头读到尾」，还「等不及想知道结局」，说明读得极为投入、忘了自我，get lost（沉浸其中）正合此意。干扰项：adore（崇拜）需要 more 一类修饰语，appraise（评估）语义不符。",
  },
  {
    n: 35,
    unitId: "r-a",
    stem: "{{35}}",
    options: [],
    answer: "D",
    evidence: "That {{35}} that causes them to react and spark when they’re near each other.",
    explain: "语法判断：空格位于指示代词 That 之后、that 引导的定语从句之前作主语，需填名词，其谓语是 causes。语义判断：前文说「这可以是两个人之间找到的那种特殊的东西」，后文用 react and spark（产生反应、迸出火花）作比喻，正是 chemistry（化学反应）的直观写法，一语双关。干扰项：coincidence（巧合）只解释偶然相遇，cracks（裂缝）语义不通。",
  },
  {
    n: 36,
    unitId: "r-b",
    stem: "There is general consensus among experts that willpower alone cannot guarantee one’s success in changing and maintaining a habit.",
    options: [],
    answer: "D",
    evidence: "The research on whether we have finite or infinite willpower is inconclusive, but experts do generally agree that you can’t change and sustain a habit if you rely on your willpower alone.",
    explain: "题干关键信息 general consensus among experts 与 willpower alone cannot guarantee one's success in changing and maintaining a habit 定位到 D 段。D 段首句说：对意志力有限与否的研究尚无定论，但专家普遍同意，如果只靠意志力，你无法改变并维持一个习惯。题干与原文逐一对应，故选 D。",
  },
  {
    n: 37,
    unitId: "r-b",
    stem: "One need not abandon their goals completely just because they missed their target temporarily; they can start anew.",
    options: [],
    answer: "I",
    evidence: "The fourth one to avoid is not forgiving ourselves for slipping up.",
    explain: "题干关键信息 need not abandon their goals completely 与 they can start anew 定位到 I 段。I 段开篇说「第四个要避免的就是不原谅自己偶尔的失误」，随后指出「暂时偏离轨道并不意味着你第二天不能重新开始」，正与题干对应，故选 I。",
  },
  {
    n: 38,
    unitId: "r-b",
    stem: "Research shows it is quite another challenge to maintain a behavioral change after you have initiated it.",
    options: [],
    answer: "A",
    evidence: "According to recent research, behavioral change involves physical changes in the brain.",
    explain: "题干关键信息 maintain a behavioral change after you have initiated it 定位到 A 段。A 段首句提到「近期研究显示行为改变涉及大脑的生理变化」，接着说即使成功做出改变，「还得再为维持它做各种调整，而这本身又是另一重挑战」，与题干同义，故选 A。",
  },
  {
    n: 39,
    unitId: "r-b",
    stem: "It is wrong to assume the strategies we use to start a change of behavior will work equally well in helping maintain it.",
    options: [],
    answer: "K",
    evidence: "Initiating a new behavior usually seems like the hardest part of the process of change.",
    explain: "题干关键信息 it is wrong to assume the strategies we use to start a change of behavior will work equally well in helping maintain it 定位到 K 段。K 段说人们「误以为用来启动改变的策略在维持阶段同样有效」，随后用 But 转折指出「事实并非如此」，故选 K。",
  },
  {
    n: 40,
    unitId: "r-b",
    stem: "Sometimes, it may not be successful to simply substitute one activity with another to effect a change of habit; you may need extra reinforcement.",
    options: [],
    answer: "H",
    evidence: "Sometimes we become accustomed to relying on our guts when it comes to decision- making.",
    explain: "题干关键信息 simply substitute one activity with another 与 you may need extra reinforcement 定位到 H 段。H 段以「想戒掉晨起查邮件」为例，指出换成另一项活动可能不够有效，「你可能需要引入另一种强化手段」，如约朋友、预订健身课，与题干同义，故选 H。",
  },
  {
    n: 41,
    unitId: "r-b",
    stem: "One should introduce something new to replace an old habit instead of simply kicking it.",
    options: [],
    answer: "F",
    evidence: "The second one to avoid is focusing on negative goals.",
    explain: "题干关键信息 introduce something new to replace an old habit instead of simply kicking it 定位到 F 段。F 段说不要只盯着消极目标，「与其放弃某样东西，不如引入别的东西来替代它」，把注意力放在将要去做的新行动上，与题干完全对应，故选 F。",
  },
  {
    n: 42,
    unitId: "r-b",
    stem: "Perfectionists focus too much on their big target and neglect celebrating the small gains they make in the process.",
    options: [],
    answer: "J",
    evidence: "The final one to avoid is discounting small progress.",
    explain: "题干关键信息 Perfectionists focus too much on their big target 与 neglect celebrating the small gains 定位到 J 段。J 段开篇即说「最后一个要避免的就是低估小的进展」，段中指出完美主义者「过度关注大目标，却没花时间庆祝过程中取得的微小进步」，与题干同义，故选 J。",
  },
  {
    n: 43,
    unitId: "r-b",
    stem: "It is of great benefit to us in the long term to conquer the inertia that stops us from making behavioral changes.",
    options: [],
    answer: "L",
    evidence: "Remember, overcoming the behavioral inertia that prevents us from implementing new changes, like eating a healthy diet or exercising, can benefit us in the long run and can improve our physical and mental health.",
    explain: "题干关键信息 of great benefit to us in the long term 与 conquer the inertia that stops us from making behavioral changes 定位到 L 段。L 段首句说「克服那些阻碍我们做出新改变的行为惯性，从长远看对我们有益，还能改善身心健康」，与题干同义，故选 L。",
  },
  {
    n: 44,
    unitId: "r-b",
    stem: "The strategy that successfully changed one of your behaviors may not work for some other behavior of yours.",
    options: [],
    answer: "G",
    evidence: "The third one to avoid is using the same strategies in different circumstances.",
    explain: "题干关键信息 the strategy that successfully changed one of your behaviors may not work for some other behavior of yours 定位到 G 段。G 段说「第三个要避免的就是在不同情境下照搬同样的策略」，并指出「让你改变一种行为的那套系统，对另一种行为可能就不管用了」，与题干同义，故选 G。",
  },
  {
    n: 45,
    unitId: "r-b",
    stem: "Without a happy mood, it seems that our wisdom to adopt a different behavior vanishes.",
    options: [],
    answer: "K",
    evidence: "Initiating a new behavior usually seems like the hardest part of the process of change.",
    explain: "题干关键信息 without a happy mood 与 our wisdom to adopt a different behavior vanishes 定位到 K 段（与第 39 题同一段）。K 段结尾说「维持新行为的关键就是保持快乐」，因为「情绪低落时，那种以不同方式行事的智慧似乎就消失了，我们又回到吃得多、动得少的状态」，与题干同义，故选 K。",
  },
  {
    n: 46,
    unitId: "r-c1",
    stem: "What do we learn from the passage about young Americans of today?",
    options: [
      {
        key: "A",
        en: "They have greater ambitions than their parents.",
      },
      {
        key: "B",
        en: "They find it difficult to achieve upward mobility.",
      },
      {
        key: "C",
        en: "They have overtaken their parents in terms of earnings.",
      },
      {
        key: "D",
        en: "They envy the opportunities in other industrialised nations.",
      },
    ],
    answer: "B",
    evidence: "And yet, young Americans today are struggling to earn more than their parents did at the same age, and upward mobility in the US actually compares unfavourably to that of other industrialised nations.",
    explain: "首段说「如今年轻美国人连赚到比父母同龄时更多的钱都很吃力，美国的向上流动性与其他工业化国家相比也不占优势」，对应 B。C 与原文相反——原文说他们难以超过父母；A、D 原文未提，属于无中生有。",
  },
  {
    n: 47,
    unitId: "r-c1",
    stem: "What does Kim’s team find about reality TV shows in America?",
    options: [
      {
        key: "A",
        en: "They reinterpret the essence of the popular rags-to-riches culture.",
      },
      {
        key: "B",
        en: "They urge people to achieve economic success through hard work.",
      },
      {
        key: "C",
        en: "They help strengthen people’s conviction in the American Dream.",
      },
      {
        key: "D",
        en: "They feature ordinary Americans striving for social recognition.",
      },
    ],
    answer: "C",
    evidence: "The results showed that those who’d watched a rags-to-riches clip did indeed have a significantly greater belief in the American Dream.",
    explain: "实验结果表明「看过白手起家片段的参与者对美国梦的信念显著增强」，对应 C。B 只是这类节目的剧情（靠努力获得成功），不是研究发现的认知效果；A、D 原文均未作此结论。",
  },
  {
    n: 48,
    unitId: "r-c1",
    stem: "What does the author say about news broadcasts in America?",
    options: [
      {
        key: "A",
        en: "They attract far fewer viewers than reality TV.",
      },
      {
        key: "B",
        en: "They are bent on reporting the dark side of life.",
      },
      {
        key: "C",
        en: "They stand in striking contrast with reality TV.",
      },
      {
        key: "D",
        en: "They focus on Americans’ economic hardships.",
      },
    ],
    answer: "A",
    evidence: "And while these programmes are regularly among the most-watched shows, news broadcasts—which paint a more realistic view of the economic hardship faced by millions of Americans—get a much smaller proportion of the viewership.",
    explain: "原文说这些真人秀「常在最受欢迎的节目之列，而新闻广播——它们呈现出数百万美国人经济困境的更真实面貌——只分到小得多的收视份额」，对应 A（新闻广播的收视份额远低于真人秀）。B、C 原文未作此评价；D 偷换重点——原文说的是「呈现出更真实的困境面貌」，并非「聚焦」经济困境。",
  },
  {
    n: 49,
    unitId: "r-c1",
    stem: "What can we infer from the passage about Republicans in general?",
    options: [
      {
        key: "A",
        en: "They believe strongly in the American Dream.",
      },
      {
        key: "B",
        en: "They strive to climb the socio-economic ladder.",
      },
      {
        key: "C",
        en: "They have a very strong affiliation with their party.",
      },
      {
        key: "D",
        en: "They tend to watch more rags-to-riches TV shows.",
      },
    ],
    answer: "A",
    evidence: "Interestingly, when participants were separated by party affiliation, this effect was significant among Republicans but not Democrats, suggesting that the kind of messages implicit in these TV shows may play into people’s existing socioeconomic beliefs.",
    explain: "原文说按党派划分时，这一效应「在共和党人身上显著而在民主党人身上不显著」，说明这类节目的信息「可能迎合人们既有的社会经济信念」，故可推出共和党人更相信美国梦，A 正确。B、C、D 原文均无依据。",
  },
  {
    n: 50,
    unitId: "r-c1",
    stem: "What is stated about people who believe in upward mobility?",
    options: [
      {
        key: "A",
        en: "They are likely to blame the government for their plight.",
      },
      {
        key: "B",
        en: "They regard political consequences as anything but trivial.",
      },
      {
        key: "C",
        en: "They respect individuals striving to climb the social ladder.",
      },
      {
        key: "D",
        en: "They are less likely to approve of policies to fight inequality",
      },
    ],
    answer: "D",
    evidence: "And here’s the problem: if people mistakenly believe that hard work is all that is needed for individuals to make a better life for themselves, they may be less supportive of policies that could actually combat inequality.",
    explain: "结尾说「问题在于：如果人们误以为只要努力就足以让个人过上更好的生活，他们对真正能对抗不平等的政策就会支持得更少」，对应 D。A、B、C 原文均未提及，且 B 把作者对后果的判断套到了民众身上。",
  },
  {
    n: 51,
    unitId: "r-c2",
    stem: "What do we learn from the passage about one’s loss of a job?",
    options: [
      {
        key: "A",
        en: "It compels them to visit a clinical psychologist.",
      },
      {
        key: "B",
        en: "It offers them a chance to play different roles.",
      },
      {
        key: "C",
        en: "It renders them puzzled about who they are.",
      },
      {
        key: "D",
        en: "It forces them to redefine their life’s goals.",
      },
    ],
    answer: "C",
    evidence: "This loss provokes an identity crisis much greater than the loss of the job itself.",
    explain: "原文说「这种失去引发的是一场远比失业本身更大的身份危机」，对应 C。B 错在方向——扮演不同角色是作者说的「还可以有别的身份」，不是失业带来的；A、D 原文未提。",
  },
  {
    n: 52,
    unitId: "r-c2",
    stem: "What has the author come to understand about our identity?",
    options: [
      {
        key: "A",
        en: "It is crucial to our emotional wellbeing.",
      },
      {
        key: "B",
        en: "It plays a big role in many facets of life.",
      },
      {
        key: "C",
        en: "It reflects our changing status in society.",
      },
      {
        key: "D",
        en: "It is more complicated than it appears.",
      },
    ],
    answer: "D",
    evidence: "One of the things I have come to understand, however, is that our identity is much more complex than we recognise at first glance.",
    explain: "原文明确说「我逐渐认识到，我们的身份远比乍看之下复杂得多」，对应 D；全文随后列举朋友、配偶、父母、球队、宗教社群等身份加以佐证。A、B 是文中谈工作的其他说法，不是该句结论；C 讲的是社会地位，与身份定义无关。",
  },
  {
    n: 53,
    unitId: "r-c2",
    stem: "What does the passage say about our identities at work?",
    options: [
      {
        key: "A",
        en: "They are essential to our self-esteem.",
      },
      {
        key: "B",
        en: "They evolve with the passage of time.",
      },
      {
        key: "C",
        en: "They overrule all other self-perceptions.",
      },
      {
        key: "D",
        en: "They are key to understanding ourselves.",
      },
    ],
    answer: "B",
    evidence: "They change over time.",
    explain: "作者先说工作身份「不是一成不变的」，紧接着一句「它们会随时间改变」，正是 B「随时间演变」的同义改写；作者随后还列举自己当过店员、服务员、学生、毕业生、临床心理学家的经历。A、C、D 原文均无依据。",
  },
  {
    n: 54,
    unitId: "r-c2",
    stem: "What do we have to do in today’s ever-changing job market?",
    options: [
      {
        key: "A",
        en: "Strive to develop our social identity.",
      },
      {
        key: "B",
        en: "Prepare for different career paths.",
      },
      {
        key: "C",
        en: "Try to be assertive at all times.",
      },
      {
        key: "D",
        en: "Learn to manage uncertainty.",
      },
    ],
    answer: "D",
    evidence: "Whilst we like to eliminate uncertainty in our lives at some level we have to manage uncertainty, especially in today’s volatile and ever-shifting job market.",
    explain: "原文说「我们总想在一定程度上消除生活里的不确定性，但在今天这个动荡多变的市场里，我们其实必须学会管理不确定性」，对应 D。A、B、C 分别对应文中 social identity、career identity 与 assertive leader 等说法，但都不是该句答案。",
  },
  {
    n: 55,
    unitId: "r-c2",
    stem: "What should we do to expand our career options?",
    options: [
      {
        key: "A",
        en: "Alter our perceptions of ourselves.",
      },
      {
        key: "B",
        en: "Compare various job opportunities.",
      },
      {
        key: "C",
        en: "Look into newly emerging sectors.",
      },
      {
        key: "D",
        en: "Exercise self-discipline consciously.",
      },
    ],
    answer: "A",
    evidence: "In an age where career progression may lead us into new sectors it is ever more important to challenge our sense of self and explore whether you can create a new experience of your identity by changing the beliefs you hold about yourself in order to expand your career options.",
    explain: "结尾说「要扩大职业选择，就要去挑战对自己的看法，通过改变你对自己的信念来创造新的身份体验」，对应 A。C 只是前提条件（可能把我们带进新行业），B、D 原文未提。",
  },
];
