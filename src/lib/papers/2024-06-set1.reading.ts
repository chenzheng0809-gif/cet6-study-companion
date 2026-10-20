import type { Question, ReadingSection } from "./types";

/**
 * 2024 年 06 月六级 · 第 1 套 · Part III Reading Comprehension
 *
 * 原文、题干、选项来自《2024年06月大学英语六级考试真题（第1套）》PDF（用户提供）。
 * 答案来自《2024年06月六级考试真题答案速查（第1套）》PDF（用户提供）。
 *
 * 这一套没有解析册：逐题解析与原文依据句由本项目依据真题原文撰写，
 * 每条依据句都逐字取自上面的原文，不是别处的措辞。
 * 中文标题也是按原文内容写的，不是从别处抄的。
 */

export const READING_SECTIONS: ReadingSection[] = [
  {
    id: "r-a",
    label: "Section A",
    labelZh: "选词填空 · 古典音乐与大脑",
    kind: "bank",
    questionRange: [26, 35],
    paragraphs: [
      {
        label: "",
        en: `It’s quite remarkable how different genres of music can spark unique feelings, emotions, and memories. Studies have shown that music can reduce stress and anxiety before surgeries and we are all attracted toward our own unique life soundtrack.

If you’re looking to {{26}} stress, you might want to give classical music a try. The sounds of classical music produce a calming effect letting {{27}} pleasure-inducing dopamine (多巴胺) in the brain that helps control attention, learning and emotional responses. It can also turn down the body’s stress response, resulting in an overall happier mood. It turns out a pleasant mood can lead to {{28}} in a person’s thinking. Although there are many great {{29}} of classical music like Bach, Beethoven and Handel, none of these artists’ music seems to have the same health effects as Mozart’s does. According to researchers, listening to Mozart can increase brain wave activity and improve {{30}} function. Another study found that the distinctive features of Mozart’s music trigger parts of the brain that are responsible for high-level mental functions. Even maternity {{31}} use Mozart to help newborn babies adapt to life outside of the mother’s belly. It has been found that listening to classical music {{32}} reduces a person’s blood pressure. Researchers believe that the calming sounds of classical music may help your heart {{33}} from stress. Classical music can also be a great tool to help people who have trouble sleeping. One study found that students who had trouble sleeping slept better while they were listening to classical music. Whether classical music is something that you listen to on a regular basis or not, it wouldn’t {{34}} to take time out of your day to listen to music that you find {{35}} . You will be surprised at how good it makes you feel and the potentially positive change in your health.`,
      },
    ],
    bank: [
      {
        key: "A",
        word: "alleviate",
        pos: "v.",
        zh: "减轻；缓解",
      },
      {
        key: "B",
        word: "clarity",
        pos: "n.",
        zh: "清晰；明确",
      },
      {
        key: "C",
        word: "cognitive",
        pos: "adj.",
        zh: "认知的",
      },
      {
        key: "D",
        word: "composers",
        pos: "n.",
        zh: "作曲家（复数）",
      },
      {
        key: "E",
        word: "hurt",
        pos: "v.",
        zh: "伤害；损害",
      },
      {
        key: "F",
        word: "inhibiting",
        pos: "adj.",
        zh: "起抑制作用的",
      },
      {
        key: "G",
        word: "interrogation",
        pos: "n.",
        zh: "审问；盘问",
      },
      {
        key: "H",
        word: "intrinsically",
        pos: "adv.",
        zh: "本质上；内在地",
      },
      {
        key: "I",
        word: "loose",
        pos: "v.",
        zh: "释放；松开",
      },
      {
        key: "J",
        word: "majestic",
        pos: "adj.",
        zh: "雄伟的；庄严的",
      },
      {
        key: "K",
        word: "mandatory",
        pos: "adj.",
        zh: "强制的；义务的",
      },
      {
        key: "L",
        word: "recover",
        pos: "v.",
        zh: "恢复；康复",
      },
      {
        key: "M",
        word: "significantly",
        pos: "adv.",
        zh: "显著地",
      },
      {
        key: "N",
        word: "soothing",
        pos: "adj.",
        zh: "舒缓的；令人平静的",
      },
      {
        key: "O",
        word: "wards",
        pos: "n.",
        zh: "病房；病区",
      },
    ],
  },
  {
    id: "r-b",
    label: "Section B",
    labelZh: "长篇阅读 · 那棵拥有自己的树",
    kind: "matching",
    questionRange: [36, 45],
    paragraphs: [
      {
        label: "A",
        en: "In the city of Athens, Georgia, there exists a rather curious local landmark—a large white oak that is almost universally stated to own itself. Because of this, it is considered one of the most famous trees in the world. So how did this tree come to own itself and the land around it?",
      },
      {
        label: "B",
        en: "Sometime in the 19th century a Georgian called Colonel William Jackson reportedly took a liking to the said tree and endeavored to protect it from any danger. As to why he loved it so, the earliest documented account of this story is an anonymously written front page article in the Athens Weekly Banner published on August 12, 1890. It states, “Col. Jackson had watched the tree grow from his childhood, and grew to love it almost as he would a human. Its luxuriant leaves and sturdy limbs had often protected him from the heavy rains, and out of its highest branches he had many a time gotten the eggs of the feathered singers. He watched its growth, and when reaching a ripe old age he saw the tree standing in its magnificent proportions, he was pained to think that after his death it would fall into the hands of those who might destroy it.”",
      },
      {
        label: "C",
        en: "Towards this end, Jackson transferred by means of a deed ownership of the tree and a little land around it to the tree itself. The deed read, “W. H. Jackson for and in consideration of the great affection which he bears the said tree, and his great desire to see it protected has conveyed unto the said oak tree entire possession of itself and of all land within eight feet of it on all sides.”",
      },
      {
        label: "D",
        en: "In time, the tree came to be something of a tourist attraction, known as The Tree That Owns Itself. However, in the early 20th century, the tree started showing signs of its slow death, with little that could be done about it. Father time comes for us all eventually, even our often long lived, tall and leafy fellow custodians (看管者) of Earth. Finally, on October 9, 1942, the over 30 meter tall and 200-400 year old tree fell, rumor has it, as a result of a severe windstorm and/or via having previously died and its roots rotted.",
      },
      {
        label: "E",
        en: "About four years later, members of the Junior Ladies Garden Club (who’d tended to the tree before its unfortunate death) tracked down a small tree grown from a nut taken from the original tree. And so it was that on October 9, 1946, under the direction of Professor Roy Bowden of the College of Agriculture at the University of Georgia, this little tree was transplanted to the location of its ancestor. A couple of months later, an official ceremony was held featuring none other than the Mayor of Athens, Robert L McWhorter, to commemorate the occasion.",
      },
      {
        label: "F",
        en: "This new tree became known as The Son of the Tree That Owns Itself and it was assumed that, as the original tree’s heir, it naturally inherited the land it stood on. Of course, there are many dozens of other trees known to exist descending from the original, as people taking a nut from it to grow elsewhere was a certainty. That said, to date, none of the original tree’s other children have petitioned the courts for their share of the land, so it seems all good. In any event, The Son of the Tree That Owns Itself still stands today, though often referred to simply as The Tree That Owns Itself.",
      },
      {
        label: "G",
        en: "This all brings us around to whether Jackson ever actually gave legal ownership of the tree to itself in the first place and whether such a deed is legally binding.",
      },
      {
        label: "H",
        en: "Well, to begin with, it turns out Jackson only spent about three years of his life in Athens, starting at the age of 43 from 1829 to 1832, sort of dismissing the idea that he loved the tree from spending time under it as a child and watching it grow, and then worrying about what would happen to it after he died. Further, an extensive search of land ownership records in Athens does not seem to indicate Jackson ever owned the land the tree sits on.",
      },
      {
        label: "I",
        en: "He did live on a lot of land directly next to it for those three years, but whether he owned that land or not isn’t clear. Whatever the case, in 1832 a four acre parcel, which included the land the tree was on and the neighboring land Jackson lived on, among others, was sold to University professor Malthus A Ward. In the transaction, Ward was required to pay Jackson a sum of $1,200 (about $31,000 today), either for the property itself or simply in compensation for improvements Jackson had made on the lot. In the end, whether he ever owned the neighboring lot or was simply allowed to use it while he allegedly worked at the University, he definitely never owned the lot the tree grew on, which is the most important bit for the topic at hand.",
      },
      {
        label: "J",
        en: "After Professor Ward purchased the land, Jackson and his family purchased a 655 acre parcel a few miles away and moved there. Ten years later, in 1844, Jackson seemed to have come into financial difficulties and had his little plantation seized by the Clarke County Sheriff’s office and auctioned off to settle the mortgage. Thus, had he owned some land in Athens itself, including the land the tree sat on, presumably he would have sold it to raise funds or otherwise had it taken as well.",
      },
      {
        label: "K",
        en: "And whatever the case there, Jackson would have known property taxes needed to be paid on the deeded land for the tree to be truly secure in its future. Yet no account or record indicates any trust or the like was set up to facilitate this.",
      },
      {
        label: "L",
        en: "On top of all this, there is no hard evidence such a deed ever existed, despite the fact that deed records in Athens go back many decades before Jackson’s death in 1876 and that it was supposed to have existed in 1890 in the archives according to the original anonymous news reporter who claims to have seen it.",
      },
      {
        label: "M",
        en: "As you might imagine from all of this, few give credit to this side of the story. So how did all of this come about then?",
      },
      {
        label: "N",
        en: "It is speculated to have been invented by the imagination of the said anonymous author at the Athens Weekly Banner in the aforementioned 1890 front page article titled “Deeded to Itself”, which by the way contained several elements that are much more easily proved to be false. As to why the author would do this, it’s speculated perhaps it was a 19th century version of a click-bait thought exercise on whether it would be legal for someone to deed such a non-conscious living thing to itself or not.",
      },
      {
        label: "O",
        en: "Whatever the case, the next known instance of the Tree That Owns Itself being mentioned wasn’t until 1901 in the Centennial Edition of that same paper, the Athens Weekly Banner. This featured another account very clearly just copying the original article published about a decade before, only slightly reworded. The next account was in 1906, again in the Athens Weekly Banner, again very clearly copying the original account, only slightly reworded, the 19th century equivalent of re-posts when the audience has forgotten about the original.",
      },
    ],
  },
  {
    id: "r-c1",
    label: "Passage One",
    labelZh: "仔细阅读 · 没人愿意出手相助的时候",
    kind: "detail",
    questionRange: [46, 50],
    paragraphs: [
      {
        label: "",
        en: `It is irrefutable that employees know the difference between right and wrong. So why don’t more employees intervene when they see someone exhibiting at-risk behavior in the workplace? There are a number of factors that influence whether people intervene. First, they need to be able to see a risky situation beginning to unfold. Second, the company’s culture needs to make them feel safe to speak up. And third, they need to have the communication skills to say something effectively. This is not strictly a workplace problem; it’s a growing problem off the job too. Every day people witness things on the street and choose to stand idly by. This is known as the bystander effect—the more people who witness an event, the less likely anyone in that group is to help the victim. The psychology behind this is called diffusion of responsibility. Basically, the larger the crowd, the more people assume that someone else will take care of it—meaning no one effectively intervenes or acts in a moment of need. This crowd mentality is strong enough for people to evade their known responsibilities. But it’s not only frontline workers who don’t make safety interventions in the workplace. There are also instances where supervisors do not intervene either. When a group of employees sees unsafe behavior not being addressed at a leadership level it creates the precedent that this is how these situations should be addressed, thus defining the safety culture for everyone. Despite the fact that workers are encouraged to intervene when they observe unsafe operations, this happens less than half of the time. Fear is the ultimate factor in not intervening. There is a fear of penalty, a fear that they’ll have to do more work if they intervene. Unsuccessful attempts in the past are another strong contributing factor to why people don’t intervene—they tend to prefer to defer that action to someone else for all future situations. On many worksites, competent workers must be appointed. Part of their job is to intervene when workers perform a task without the proper equipment or if the conditions are unsafe. Competent workers are also required to stop work from continuing when there’s a danger. Supervisors also play a critical role. Even if a competent person isn’t required, supervisors need a broad set of skills to not only identify and alleviate workplace hazards but also build a safety climate within their team that supports intervening and open communication among them.

Beyond competent workers and supervisors, it’s important to educate everyone within the organization that they are obliged to intervene if they witness a possible unsafe act, whether you’re a designated competent person, a supervisor or a frontline worker.`,
      },
    ],
  },
  {
    id: "r-c2",
    label: "Passage Two",
    labelZh: "仔细阅读 · 核能：环保派与实用派的分歧",
    kind: "detail",
    questionRange: [51, 55],
    paragraphs: [
      {
        label: "",
        en: "The term “environmentalist” can mean different things. It used to refer to people trying to protect wildlife and natural ecosystems. In the 21st century, the term has evolved to capture the need to combat human-made climate change. The distinction between these two strands of environmentalism is the cause of a split within the scientific community about nuclear energy. On one side are purists who believe nuclear power isn’t worth the risk and the exclusive solution to the climate crisis is renewable energy. The opposing side agrees that renewables are crucial, but says society needs an amount of power available to meet consumers’ basic demands when the sun isn’t shining and the wind isn’t blowing. Nuclear energy, being far cleaner than oil, gas and coal, is a natural option, especially where hydroelectric capacity is limited. Leon Clarke, who helped author reports for the UN’s Intergovernmental Panel on Climate Change, isn’t an uncritical supporter of nuclear energy, but says it’s a valuable option to have if we’re serious about reaching carbon neutrality. “Core to all of this is the degree to which you think we can actually meet climate goals with 100% renewables,” he said. “If you don’t believe we can do it, and you care about the climate, you are forced to think about something like nuclear.” The achievability of universal 100% renewability is similarly contentious. Cities such as Burlington, Vermont, have been “100% renewable” for years. But these cities often have small populations, occasionally still rely on fossil fuel energy and have significant renewable resources at their immediate disposal. Meanwhile, countries that manage to run off renewables typically do so thanks to extraordinary hydroelectric capabilities. Germany stands as the best case study for a large, industrialized country pushing into green energy. Chancellor Angela Merkel in 2011 announced Energiewende, an energy transition that would phase out nuclear and coal while phasing in renewables. Wind and solar power generation has increased over 400% since 2010, and renewables provided 46% of the country’s electricity in 2019. But progress has halted in recent years. The instability of renewables doesn’t just mean energy is often not produced at night, but also that solar and wind can overwhelm the grid during the day, forcing utilities to pay customers to use their electricity. Lagging grid infrastructure struggles to transport this overabundance of green energy from Germany’s north to its industrial south, meaning many factories still run on coal and gas. The political limit has also been reached in some places, with citizens meeting the construction of new wind turbines with loud protests. The result is that Germany’s greenhouse gas emissions have fallen by around 11.5% since 2010—slower than the EU average of 13.5%.",
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
    answer: "A",
    evidence: "If you’re looking to {{26}} stress, you might want to give classical music a try.",
    explain: "语法判断：空格在 looking to ... stress 结构中，to 是不定式符号，空格须填动词原形作其宾语；alleviate 是及物动词，可直接带宾语 stress，语法与搭配都成立。语义判断：上句说音乐能 reduce stress and anxiety，此处讲想减轻压力，故填 alleviate（减轻）。干扰项 recover（恢复）须与 from 搭配；inhibiting、clarity 词性不合。",
  },
  {
    n: 27,
    unitId: "r-a",
    stem: "{{27}}",
    options: [],
    answer: "I",
    evidence: "The sounds of classical music produce a calming effect letting {{27}} pleasure-inducing dopamine (多巴胺) in the brain that helps control attention, learning and emotional responses.",
    explain: "语法判断：空格夹在 let 与宾语之间，是 let 的宾语补足位置；loose 在此作动词，与 let 构成固定搭配 let loose（释放、放开）。语义判断：音乐让人放松，从而把带来愉悦的多巴胺释放出来，填 loose。干扰项 inhibiting（抑制）与释放相反；alleviate、recover 不能与 dopamine 搭配；其余多为形容词或名词，位置也不对。",
  },
  {
    n: 28,
    unitId: "r-a",
    stem: "{{28}}",
    options: [],
    answer: "B",
    evidence: "It turns out a pleasant mood can lead to {{28}} in a person’s thinking.",
    explain: "语法判断：lead to 后面接名词作宾语，空格必须填名词；clarity 是名词（清晰），cognitive、soothing 都是形容词，不能放在介词 to 之后。语义判断：前文说音乐让人情绪稳定、心情愉悦，好心情让思维更清晰，故填 clarity。干扰项 intrinsically 是副词；loose 虽是名词却与思维搭配不通。",
  },
  {
    n: 29,
    unitId: "r-a",
    stem: "{{29}}",
    options: [],
    answer: "D",
    evidence: "Although there are many great {{29}} of classical music like Bach, Beethoven and Handel, none of these artists’ music seems to have the same health effects as Mozart’s does.",
    explain: "语法判断：空格位于 many great ... of classical music 之间，many 与 great 之后要接可数名词的复数形式作 of 的宾语，composers（作曲家们）正是复数名词，词性与句法都对得上。语义判断：空格后面列举的 Bach、Beethoven、Handel 三位都是作曲家，后文也称这些人为 these artists，可见此处指的正是一群音乐家，故填 composers。干扰项 majestic、soothing 都是形容词，填进去语法就不成立；clarity、interrogation 虽为名词，却与音乐家毫无关系，语义完全不通。",
  },
  {
    n: 30,
    unitId: "r-a",
    stem: "{{30}}",
    options: [],
    answer: "C",
    evidence: "According to researchers, listening to Mozart can increase brain wave activity and improve {{30}} function.",
    explain: "语法判断：空格修饰其后的名词 function，需要形容词作定语；cognitive（认知的）是形容词，位置正确。语义判断：前文说莫扎特音乐能激活负责高级心智功能的脑区，所以此处指认知功能，填 cognitive。干扰项 clarity 是名词；majestic 语义不符；soothing 指身体放松，不是思维功能。",
  },
  {
    n: 31,
    unitId: "r-a",
    stem: "{{31}}",
    options: [],
    answer: "O",
    evidence: "Even maternity {{31}} use Mozart to help newborn babies adapt to life outside of the mother’s belly.",
    explain: "语法判断：空格与 maternity 构成名词短语，maternity 之后接表示场所的名词复数作定语，wards（病房）符合。语义判断：产科病房用莫扎特音乐帮助新生儿适应宫外生活，填 wards。干扰项 interrogation（审讯）语义完全不符；majestic、loose 词性或位置不对；clarity 与 maternity 搭配不出此意。",
  },
  {
    n: 32,
    unitId: "r-a",
    stem: "{{32}}",
    options: [],
    answer: "M",
    evidence: "It has been found that listening to classical music {{32}} reduces a person’s blood pressure.",
    explain: "语法判断：空格修饰动词 reduces，需要副词；significantly（显著地）是副词，可置于动词前。语义判断：前文讲降低应激反应、带来更好情绪，此处说研究发现听古典音乐能降低血压，加 significantly 才能表达显著降低。干扰项 intrinsically（内在地）语义不合；clarity、recover 词性位置不对；hurt 意为伤害。",
  },
  {
    n: 33,
    unitId: "r-a",
    stem: "{{33}}",
    options: [],
    answer: "L",
    evidence: "Researchers believe that the calming sounds of classical music may help your heart {{33}} from stress.",
    explain: "语法判断：空格在 help your heart ... from stress 中，填动词原形作 help 的宾语补足；recover（恢复）与 from 构成固定搭配 recover from stress，语法语义都成立。语义判断：平静的音乐帮助心脏从压力中恢复过来，填 recover。干扰项 alleviate（减轻）后面不能接 from；soothing、majestic 是形容词；hurt 意为伤害，与原文相反。",
  },
  {
    n: 34,
    unitId: "r-a",
    stem: "{{34}}",
    options: [],
    answer: "E",
    evidence: "Whether classical music is something that you listen to on a regular basis or not, it wouldn’t {{34}} to take time out of your day to listen to music that you find {{35}} .",
    explain: "语法判断：空格在 wouldn’t 与 to take time out 之间，wouldn’t 后接动词原形；hurt 的原形与过去式同形，此处取动词原形 hurt（做了也无妨）。语义判断：it wouldn't hurt to do sth 意为不妨、做了也不吃亏，整句是在劝人抽点时间听听音乐。干扰项 alleviate 虽也是动词但搭配不成句；clarity、mandatory 词性不合。",
  },
  {
    n: 35,
    unitId: "r-a",
    stem: "{{35}}",
    options: [],
    answer: "N",
    evidence: "Whether classical music is something that you listen to on a regular basis or not, it wouldn’t {{34}} to take time out of your day to listen to music that you find {{35}} .",
    explain: "语法判断：空格在 find ... 之后作宾语补足语，需要形容词；soothing（令人舒缓的）是形容词，位置正确。语义判断：全文反复讲古典音乐让人平静、助眠，让你觉得舒缓的音乐正是文章推荐的对象，填 soothing。干扰项 majestic（庄严的）虽也是形容词但语义不符；clarity 是名词、intrinsically 是副词。",
  },
  {
    n: 36,
    unitId: "r-b",
    stem: "Jackson was said to have transferred his ownership of the oak tree to itself in order to protect it from being destroyed.",
    options: [],
    answer: "C",
    evidence: "Towards this end, Jackson transferred by means of a deed ownership of the tree and a little land around it to the tree itself.",
    explain: "题干说杰克逊把橡树的所有权转给了树自己，对应 C 段开头一句，讲他以契约方式把树及周围一小块土地的所有权转给树本身，该段接着还引用了契约原文。A 段只是设问，E、F 段讲后代树，都不涉及转让所有权这一动作。",
  },
  {
    n: 37,
    unitId: "r-b",
    stem: "No proof has been found from an extensive search that Jackson had ever owned the land where the oak tree grew.",
    options: [],
    answer: "H",
    evidence: "Further, an extensive search of land ownership records in Athens does not seem to indicate Jackson ever owned the land the tree sits on.",
    explain: "题干说经过广泛查证仍找不到杰克逊拥有那块土地的证据，对应 H 段一句，讲对土地权属记录的广泛检索无法证明他拥有树所在地块。H 段开头还先推翻了他从小在此长大的说法，两处相扣，都指向题干。",
  },
  {
    n: 38,
    unitId: "r-b",
    stem: "When it was raining heavily, Jackson often took shelter under a big tree that is said to own itself.",
    options: [],
    answer: "B",
    evidence: "Its luxuriant leaves and sturdy limbs had often protected him from the heavy rains, and out of its highest branches he had many a time gotten the eggs of the feathered singers.",
    explain: "题干说下雨时杰克逊常躲在那棵自己拥有自己的大树下，对应 B 段所引一八九〇年《Athens Weekly Banner》文中一句，讲枝叶常为他遮雨，即树下避雨的细节正出自这段最早记载。C 段讲契约、D 段讲树的倒下，都对不上；G 段提出的是另一个疑问。",
  },
  {
    n: 39,
    unitId: "r-b",
    stem: "There is no evidence that Jackson had made arrangements to pay property taxes for the land on which the oak tree sat.",
    options: [],
    answer: "K",
    evidence: "Yet no account or record indicates any trust or the like was set up to facilitate this.",
    explain: "题干说没有证据表明杰克逊为树所在地块安排过房产税，对应 K 段末句，讲没有任何账目或记录显示设立过信托之类的安排。K 段首句先点明那块地要真正保住就必须缴税，两句合起来正好否定了题干的说法。",
  },
  {
    n: 40,
    unitId: "r-b",
    stem: "Professor Ward paid Jackson over one thousand dollars when purchasing a piece of land from him.",
    options: [],
    answer: "I",
    evidence: "In the transaction, Ward was required to pay Jackson a sum of $1,200 (about $31,000 today), either for the property itself or simply in compensation for improvements Jackson had made on the lot.",
    explain: "题干说沃德教授买地时付给杰克逊一千多美元，对应 I 段一句，讲这笔交易中沃德须付给杰克逊一千二百美元，正合题干所说的一千多美元。该句还说明这笔钱可能是买地款，也可能是补偿他在空地上的改建。",
  },
  {
    n: 41,
    unitId: "r-b",
    stem: "It is said the tree that owned itself fell in a heavy windstorm.",
    options: [],
    answer: "D",
    evidence: "Finally, on October 9, 1942, the over 30 meter tall and 200-400 year old tree fell, rumor has it, as a result of a severe windstorm and/or via having previously died and its roots rotted.",
    explain: "题干说那棵自己拥有自己的树据传倒于一场大风，对应 D 段末句，讲这棵三十多米高的古树据传因严重风暴而倒下，其中 rumor has it 正好对应题干的“据说”，severe windstorm 对应大风。E、F 段讲的都是后代树；C 段只写最初的契约，都不是倒树这件事。",
  },
  {
    n: 42,
    unitId: "r-b",
    stem: "The story of the oak tree is suspected to have been invented as a thought exercise.",
    options: [],
    answer: "N",
    evidence: "As to why the author would do this, it’s speculated perhaps it was a 19th century version of a click-bait thought exercise on whether it would be legal for someone to deed such a non-conscious living thing to itself or not.",
    explain: "题干说这个故事可能是被当作思维练习编出来的，对应 N 段末句，讲有人推测这只是十九世纪版的博眼球思维实验，讨论把无意识的生命赠予自己是否合法。L 段只说找不到契约的硬证据，并没有点破这一猜想。",
  },
  {
    n: 43,
    unitId: "r-b",
    stem: "Jackson’s little plantation was auctioned off to settle his debt in the mid-19th century.",
    options: [],
    answer: "J",
    evidence: "Ten years later, in 1844, Jackson seemed to have come into financial difficulties and had his little plantation seized by the Clarke County Sheriff’s office and auctioned off to settle the mortgage.",
    explain: "题干说杰克逊的小庄园在十九世纪中期被拍卖抵债，对应 J 段一句，讲他陷入财务困难，庄园被郡警长办公室查封并拍卖以清偿抵押贷款，时间与事件都与题干吻合。I 段讲的是更早那次土地买卖，不是拍卖。",
  },
  {
    n: 44,
    unitId: "r-b",
    stem: "An official ceremony was held to celebrate the transplanting of a small tree to where its ancestor had stood.",
    options: [],
    answer: "E",
    evidence: "A couple of months later, an official ceremony was held featuring none other than the Mayor of Athens, Robert L McWhorter, to commemorate the occasion.",
    explain: "题干说为小树移栽回祖先旧址举行了正式仪式，对应 E 段末句，讲几个月后举行了由雅典市长亲临的纪念仪式，隆重程度正合“正式仪式”。E 段上文正是小树取自原树的坚果、被移植到祖先当年站立之处。",
  },
  {
    n: 45,
    unitId: "r-b",
    stem: "The story of the Tree That Owns Itself appeared in the local paper several times, with slight alterations in wording.",
    options: [],
    answer: "O",
    evidence: "The next account was in 1906, again in the Athens Weekly Banner, again very clearly copying the original account, only slightly reworded, the 19th century equivalent of re-posts when the audience has forgotten about the original.",
    explain: "题干说这个故事在当地报纸上多次出现、只是措辞略有改动，对应 O 段末句，讲一九〇六年该报又刊一篇，几乎照抄原报道只略换措辞。O 段首句还提到一九〇一年的百年纪念版已属转载，两句合起来正合题干的多次出现。",
  },
  {
    n: 46,
    unitId: "r-c1",
    stem: "What is one of the factors contributing to failure of intervention in face of risky behavior in the workplace?",
    options: [
      {
        key: "A",
        en: "Slack supervision style.",
      },
      {
        key: "B",
        en: "Unfavorable workplace culture.",
      },
      {
        key: "C",
        en: "Unforeseeable risk.",
      },
      {
        key: "D",
        en: "Blocked communication.",
      },
    ],
    answer: "B",
    evidence: "Second, the company’s culture needs to make them feel safe to speak up.",
    explain: "选 B。原文列出影响员工是否出手的第二个前提是公司文化，要让员工 feel safe to speak up，文化环境一旦不利，员工自然不敢开口，正对应不利的工作场所文化。A“监管松散”对应的是领导层不制止会形成先例那一句；C“不可预见的风险”原文没有；D“沟通受阻”也不对。",
  },
  {
    n: 47,
    unitId: "r-c1",
    stem: "What does the author mean by “diffusion of responsibility” (Line 4, Para. 3)?",
    options: [
      {
        key: "A",
        en: "The more people are around, the more they need to worry about their personal safety.",
      },
      {
        key: "B",
        en: "The more people who witness an event, the less likely anyone will venture to participate.",
      },
      {
        key: "C",
        en: "The more people idling around on the street, the more likely they need taking care of.",
      },
      {
        key: "D",
        en: "The more people are around, the less chance someone will step forward to intervene.",
      },
    ],
    answer: "D",
    evidence: "This is known as the bystander effect—the more people who witness an event, the less likely anyone in that group is to help the victim.",
    explain: "选 D。原文讲旁观者效应，the more people who witness an event, the less likely anyone in that group is to help the victim，即旁观的人越多就越少有人出手相助；紧接着又说 no one effectively intervenes，正对应 D 所说的周围人越多越少有人挺身干预。B 换成 participate（参与），把出手相助、干预弱化成泛泛的参加，没有落到原文的措辞上；A、C 是原文没有的推论，属于无中生有。",
  },
  {
    n: 48,
    unitId: "r-c1",
    stem: "What happens when unsafe behavior at the workplace is not addressed by the leaders?",
    options: [
      {
        key: "A",
        en: "No one will intervene when they see similar behaviors.",
      },
      {
        key: "B",
        en: "Everyone will see it as the easiest way to deal with crisis.",
      },
      {
        key: "C",
        en: "Workers have to take extra caution executing their duties.",
      },
      {
        key: "D",
        en: "Workers are left to take care of the emergency themselves.",
      },
    ],
    answer: "A",
    evidence: "When a group of employees sees unsafe behavior not being addressed at a leadership level it creates the precedent that this is how these situations should be addressed, thus defining the safety culture for everyone.",
    explain: "选 A。原文说当员工群体看到不安全行为在领导层得不到处理，就形成这类事就该这么办的先例，从而为所有人定下安全文化，于是再遇类似情形也没人干预，正对应 A。B“人人觉得这是处理危机的最省事办法”、C“工人执行任务要格外小心”原文都没有；D 把先例效应曲解成落单负责。",
  },
  {
    n: 49,
    unitId: "r-c1",
    stem: "What is the ultimate reason workers won’t act when they see unsafe operations?",
    options: [
      {
        key: "A",
        en: "Preference of deferring the action to others.",
      },
      {
        key: "B",
        en: "Anticipation of leadership intervention.",
      },
      {
        key: "C",
        en: "Fear of being isolated by coworkers.",
      },
      {
        key: "D",
        en: "Fear of having to do more work.",
      },
    ],
    answer: "D",
    evidence: "There is a fear of penalty, a fear that they’ll have to do more work if they intervene.",
    explain: "选 D。原文点名 fear 是关键，讲怕受罚，也怕一干预就得多干活，D 正是后一条。A“倾向于把行动推给别人”是文中另说的次要原因，即过去尝试失败以后都推给别人，并非最终因素；B“预期领导会干预”、C“怕被同事孤立”原文均无。",
  },
  {
    n: 50,
    unitId: "r-c1",
    stem: "What is critical to ensuring workplace safety?",
    options: [
      {
        key: "A",
        en: "Workers be trained to operate their equipment properly.",
      },
      {
        key: "B",
        en: "Workers exhibiting at-risk behavior be strictly disciplined.",
      },
      {
        key: "C",
        en: "Supervisors create a safety environment for timely intervention.",
      },
      {
        key: "D",
        en: "Supervisors conduct effective communication with frontline workers.",
      },
    ],
    answer: "C",
    evidence: "Even if a competent person isn’t required, supervisors need a broad set of skills to not only identify and alleviate workplace hazards but also build a safety climate within their team that supports intervening and open communication among them.",
    explain: "选 C。原文说主管需要一整套技能，既能识别和消除职场危害，又能 build a safety climate within their team that supports intervening and open communication，即营造支持干预与坦诚沟通的团队安全氛围，与 C 一致。A“培训工人正确操作设备”、B“严惩有风险行为的工人”原文都没有；D 只抓住开放沟通这一半，漏掉安全氛围。",
  },
  {
    n: 51,
    unitId: "r-c2",
    stem: "What accounts for the divide within the scientific community about nuclear energy?",
    options: [
      {
        key: "A",
        en: "Attention to combating human-made climate change.",
      },
      {
        key: "B",
        en: "Emphasis on protecting wildlife and natural ecosystems.",
      },
      {
        key: "C",
        en: "Evolution of the term ‘green energy’ over the last century.",
      },
      {
        key: "D",
        en: "Adherence to different interpretations of environmentalism.",
      },
    ],
    answer: "D",
    evidence: "The distinction between these two strands of environmentalism is the cause of a split within the scientific community about nuclear energy.",
    explain: "选 D。原文说环境主义两种含义之间的分歧正是科学界在核能问题上出现分裂的原因，对应 D，即各方坚持各自不同的环境主义理解。A、B 只描述了环境主义者一词的两种含义本身，属以偏概全；C“绿色能源一词的演变”原文根本没有。",
  },
  {
    n: 52,
    unitId: "r-c2",
    stem: "What is the solution to energy shortage proposed by purists’ opponents?",
    options: [
      {
        key: "A",
        en: "Relying on renewables firmly and exclusively.",
      },
      {
        key: "B",
        en: "Using fossil fuel and green energy alternately.",
      },
      {
        key: "C",
        en: "Opting for nuclear energy when necessary.",
      },
      {
        key: "D",
        en: "Limiting people’s non-basic consumption.",
      },
    ],
    answer: "C",
    evidence: "If you don’t believe we can do it, and you care about the climate, you are forced to think about something like nuclear.",
    explain: "选 C。原文说支持方认为除可再生能源外，还需在无风无光时供得上电，Leon Clarke 也说 If you don’t believe we can do it… you are forced to think about something like nuclear，即必须兑现气候目标时不得不考虑核电，正对应 C。A“完全只用可再生能源”是另一派主张；B“化石燃料与绿能交替”、D“限制非基本消费”原文没提。",
  },
  {
    n: 53,
    unitId: "r-c2",
    stem: "What point does the author want to make with cities like Burlington as an example?",
    options: [
      {
        key: "A",
        en: "It is controversial whether the goal of the whole world’s exclusive dependence on renewables is attainable.",
      },
      {
        key: "B",
        en: "It is contentious whether cities with large populations have renewable resources at their immediate disposal.",
      },
      {
        key: "C",
        en: "It is arguable whether cities that manage to run off renewables have sustainable hydroelectric capabilities.",
      },
      {
        key: "D",
        en: "It is debatable whether traditional fossil fuel energy can be done away with entirely throughout the world.",
      },
    ],
    answer: "A",
    evidence: "The achievability of universal 100% renewability is similarly contentious.",
    explain: "选 A。原文一句点题，讲全球百分之百可再生是否可行同样存在争议，与 A 一致。B 把小城市换成大城市，与原文 small populations 相反；C 把靠丰富水电的国家歪成城市自身的水电能力；D 化石能源能否彻底退出，原文没有提出这一疑问。",
  },
  {
    n: 54,
    unitId: "r-c2",
    stem: "What do we learn about Germany regarding renewable energy?",
    options: [
      {
        key: "A",
        en: "It has increased its wind and solar power generation four times over the last two decades.",
      },
      {
        key: "B",
        en: "It represents a good example of a major industrialized country promoting green energy.",
      },
      {
        key: "C",
        en: "It relies on renewable energy to generate more than half of its electricity.",
      },
      {
        key: "D",
        en: "It has succeeded in reaching the goal of energy transition set by Merkel.",
      },
    ],
    answer: "B",
    evidence: "Germany stands as the best case study for a large, industrialized country pushing into green energy.",
    explain: "选 B。原文写 Germany stands as the best case study for a large, industrialized country pushing into green energy，即德国是推动绿色能源的大型工业化国家的最佳案例，与 B 完全对应。A“近二十年增长四倍”与原文 increased over 400% since 2010 不符，起点和倍数都不同；C“超过一半”与原文的 46% 矛盾，差一点点也没到一半；D 与 progress has halted 相反，德国转型已停滞。",
  },
  {
    n: 55,
    unitId: "r-c2",
    stem: "What may be one of the reasons for Germany’s progress having halted in recent years?",
    options: [
      {
        key: "A",
        en: "Its grid infrastructure’s capacity has fallen behind its development of green energy.",
      },
      {
        key: "B",
        en: "Its overabundance of green energy has forced power plants to suspend operation during daytime.",
      },
      {
        key: "C",
        en: "Its industrial south is used to running factories on conventional energy supplies.",
      },
      {
        key: "D",
        en: "Its renewable energy supplies are unstable both at night and during the day.",
      },
    ],
    answer: "A",
    evidence: "Lagging grid infrastructure struggles to transport this overabundance of green energy from Germany’s north to its industrial south, meaning many factories still run on coal and gas.",
    explain: "选 A。原文说 Lagging grid infrastructure struggles to transport this overabundance of green energy，即电网建设落后，送不过去北部的过剩绿电，正是电网能力落后于绿电发展，A 正确。B“过剩迫使电厂白天停机”曲解，原文说白天电量过剩时电力公司反而付钱请用户用电；C、D 与原文所述不符，属于无中生有。",
  },
];
