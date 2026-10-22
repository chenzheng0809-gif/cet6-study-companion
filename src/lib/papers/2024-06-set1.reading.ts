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
    translation: [
      {
        label: "",
        zh: "不同风格的音乐能唤起各不相同的感受、情绪和回忆，这一点相当惊人。研究表明，音乐可以在手术前减轻压力和焦虑，而每个人都会被自己独一无二的人生配乐所吸引。\n\n如果你想[26]压力，不妨试试古典音乐。古典音乐的声音会产生一种抚慰人心的效果，让大脑中[27]带来愉悦的多巴胺（dopamine）释放出来，而多巴胺有助于控制注意力、学习和情绪反应。它还可以调低身体的应激反应，从而带来整体上更愉快的心情。事实证明，愉快的心情能让一个人的思维[28]。尽管有巴赫、贝多芬和亨德尔等许多伟大的古典音乐[29]，但这些艺术家的音乐似乎都不具备莫扎特音乐那样的健康功效。据研究者说，听莫扎特可以增强脑波活动并改善[30]功能。另一项研究发现，莫扎特音乐独特的特点会激活大脑中负责高级心智功能的区域。即使是产科[31]也用莫扎特音乐帮助新生儿适应母腹之外的生活。研究发现，听古典音乐能[32]降低人的血压。研究者相信，古典音乐抚慰人心的声音也许能帮助你的心脏从压力中[33]。古典音乐也可以是帮助睡眠困难者的好工具。一项研究发现，睡眠有困难的学生在听古典音乐时睡得更好。无论你是否经常听古典音乐，不妨[34]从一天中抽点时间听一听你觉得[35]的音乐。你会惊讶于它让你感觉有多好，以及它可能给健康带来的积极变化。",
      },
    ],
    notes: [
      { en: "spark", zh: "激发；引起（感受、情绪、回忆）" },
      { en: "life soundtrack", zh: "人生配乐" },
      { en: "calming effect", zh: "抚慰、镇静的效果" },
      { en: "pleasure-inducing dopamine", zh: "带来愉悦的多巴胺" },
      { en: "stress response", zh: "应激反应" },
      { en: "distinctive features", zh: "独特的风格特征" },
      { en: "high-level mental functions", zh: "高级心智功能" },
      { en: "take time out of your day", zh: "从一天中抽出时间" },
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
    translation: [
      {
        label: "A",
        zh: "在美国佐治亚州雅典市，有一处颇为奇特的当地地标——一棵大白橡，几乎所有人都说它拥有自己。正因如此，它被视为世界上最著名的树之一。那么，这棵树是怎么拥有自己以及它周围的那片土地的呢？",
      },
      {
        label: "B",
        zh: "据说在 19 世纪某个时候，一位名叫威廉·杰克逊上校的佐治亚人喜欢上了这棵树，并设法保护它免遭任何危险。至于他为什么这么爱它，这个故事最早有据可查的记载，是 1890 年 8 月 12 日《雅典周报》头版上一篇匿名文章。文章写道：「杰克逊上校从童年起就看着这棵树长大，几乎像爱一个人那样爱它。它繁茂的树叶和粗壮的枝干常常为他遮住大雨；他也曾多次从最高的枝头取下那些羽翼歌手的鸟蛋。他看着它成长，待到耄耋之年，看见这棵以巍峨身姿伫立的树，他痛心地想到，自己身后它将落入那些可能毁掉它的人手中。」",
      },
      {
        label: "C",
        zh: "为此，杰克逊以一份契约的方式，把这棵树及其周围一小块土地的所有权转让给了树本身。契约写道：「W·H·杰克逊出于他对上述那棵树的深厚感情，以及他希望看到它得到保护的强烈心愿，已将上述橡树的全部自身以及它四周八英尺以内的所有土地转让予该橡树。」",
      },
      {
        label: "D",
        zh: "久而久之，这棵树成了某种旅游景点，名叫「拥有自己的树」。然而到了 20 世纪初，这棵树开始显出缓慢死亡的迹象，而人们对此几乎无能为力。时间老人最终总会找上我们所有人，哪怕是地球那些往往长寿、高大而枝繁叶茂的看管者也一样。终于，在 1942 年 10 月 9 日，这棵三十多米高、树龄两到四百年的树据说因一场严重的风暴而倒下，或者是因为它早已死去、树根腐烂所致。",
      },
      {
        label: "E",
        zh: "大约四年后，少女园艺俱乐部（这棵树不幸去世前一直由它们照料）的成员找到了一棵小树，它是用从原树上取来的坚果培育出来的。于是，1946 年 10 月 9 日，在佐治亚大学农学院罗伊·鲍登教授的指导下，这棵小树被移栽到了它祖先当年站立的地方。几个月后，举行了一场正式仪式，出席的正是雅典市市长罗伯特·L·麦克沃特，以此纪念这一时刻。",
      },
      {
        label: "F",
        zh: "这棵新树被称为「拥有自己的树之子」，人们认为，既然它是原树的继承人，自然就继承了那块它所站立的土地。当然，众所周知还有几十棵其他树也是原树的后代，因为人们从原树上取走坚果拿到别处栽种是必然的事。不过迄今为止，原树的这些「其他子女」没有一棵向法院提出请求，要求分得那块土地的一份额，看起来一切都好。无论如何，「拥有自己的树之子」今天依然矗立在那里，只是人们常常干脆又把它称作「拥有自己的树」。",
      },
      {
        label: "G",
        zh: "这一切把我们引回到一个问题：杰克逊当初究竟是否真的在法律上把这棵树的所有权给了树本身，以及这样一份契约在法律上是否具有约束力。",
      },
      {
        label: "H",
        zh: "首先，事实是杰克逊一生中只在雅典住过大约三年，从 1829 年到 1832 年，那时他 43 岁——这多少否定了他「因为小时候常在树下度过时光、看着它长大才爱上这棵树」的想法，以及他「担心自己死后这棵树会怎样」的说法。此外，对雅典土地权属记录的一次广泛检索似乎并不能证明杰克逊曾拥有树所在的土地。",
      },
      {
        label: "I",
        zh: "那三年里，他的确就住在这棵树紧邻的一大片土地上，但那块地是否归他所有并不清楚。无论如何，1832 年，一块四英亩的地被出售给了大学教授马尔特斯·A·沃德，其中既包括树所在的那块地，也包括杰克逊居住的邻地等。在这笔交易中，沃德须支付给杰克逊 1,200 美元（按今天约合 31,000 美元），这笔钱或是为了买下这块地产本身，或仅仅是对杰克逊在这块地上所作改建的补偿。归根结底，不论他是否真的拥有那块邻地、还是仅仅因为据称在大学任职而被允许使用，他肯定从未拥有树生长的那块地——而这正是当前话题中最要紧的一点。",
      },
      {
        label: "J",
        zh: "沃德教授买下那块地之后，杰克逊和家人又在几英里外买下了一块 655 英亩的地，并搬了过去。十年后的 1844 年，杰克逊似乎陷入了财务困难，他那块小庄园被克拉克县警长办公室查封并拍卖，用以清偿抵押贷款。因此，假如他当年确实在雅典市区拥有一些土地，包括树所在的那块地，他大概也会把它卖掉筹钱，或者以别的方式让它被一并收走。",
      },
      {
        label: "K",
        zh: "而且不管那里的情况如何，杰克逊本该知道，要让这棵树真正安享未来，就得为那块立契转让的土地缴纳房产税。然而没有任何账目或记录显示曾设立过信托之类的安排来促成这件事。",
      },
      {
        label: "L",
        zh: "除此之外，也没有任何确凿证据表明这样一份契约曾经存在过——尽管雅典的契约记录可以追溯到杰克逊 1876 年去世前许多年，而且据那位自称见过它的原始匿名新闻记者说，这份契约本该在 1890 年就存于档案之中。",
      },
      {
        label: "M",
        zh: "从以上种种你可以想见，很少有人会采信故事的这一面。那么，这一切究竟是怎么来的呢？",
      },
      {
        label: "N",
        zh: "人们推测，这一切是《雅典周报》那位匿名作者在上述 1890 年头版文章《赠予它自己》中凭想象编造的——顺便说一句，文中有好几处内容倒是一眼就更容易被证明是假的。至于作者为什么要这样做，有人推测，也许这不过是 19 世纪版的一个博眼球的思维实验：把这样一个没有意识的有生命之物赠予自己，究竟在法律上是否可行。",
      },
      {
        label: "O",
        zh: "不管怎样，「拥有自己的树」下一次有据可查的记载要等到 1901 年，出自同一份报纸《雅典周报》的百年纪念特刊。这一次刊载的又一篇报道，显然只是照抄大约十年前发表的那篇原文，只略微换了些措辞。下一篇报道见于 1906 年，仍在《雅典周报》，同样明显是照抄最初那篇报道，只略微改动了措辞——这大概相当于 19 世纪时代的转发，而读者早已忘了原文。",
      },
    ],
    notes: [
      { en: "endeavored to protect it", zh: "设法保护它" },
      { en: "the earliest documented account", zh: "最早有据可查的记载" },
      { en: "luxuriant leaves and sturdy limbs", zh: "繁茂的树叶与粗壮的枝干" },
      { en: "transferred by means of a deed", zh: "以契约方式转让" },
      { en: "for and in consideration of", zh: "作为……的对价；鉴于" },
      { en: "signs of its slow death", zh: "缓慢死亡的迹象" },
      { en: "tended to the tree", zh: "照料这棵树" },
      { en: "transplanted to the location of its ancestor", zh: "被移栽到其祖先所在的地点" },
      { en: "petitioned the courts", zh: "向法院提出申请" },
      { en: "legally binding", zh: "在法律上有约束力" },
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
    translation: [
      {
        label: "",
        zh: "员工分得清对与错，这是无可争辩的。那么，为什么看到有人在职场中表现出有风险的行为时，不会有更多员工出面制止呢？影响人们是否出手的因素有好几个。首先，他们得能看出一场危险局面开始成形。其次，公司的文化得让他们觉得自己开口是安全的。第三，他们得具备把话说得有效而有力的沟通能力。这并不单单是职场的问题；在工作之外，它也日益成为一个问题。人们每天在街上目睹种种事情，却选择袖手旁观。这就是所谓的旁观者效应——目击某件事的人越多，那群人里就越不可能有人去帮助受害者。其背后的心理学被称为责任分散。基本上，人群越大，越多的人会假定别人会来料理这件事——这意味着在需要的关键时刻，没有人会真正出手相助或采取行动。这种群体心态强烈到足以让人逃避自己明知应负的责任。但在职场中不出手制止安全隐患的，并不只是前线员工，主管同样也有不出手的时候。当一群员工看到不安全行为在领导层得不到处理，就形成了「这类事就该这么办」的先例，从而为所有人定下了安全文化。尽管工作人员被鼓励在看到违规操作时出手，但这种情况实际发生的比例不到一半。恐惧才是人们不出手的最终原因：既怕受罚，也怕一出手就得干更多的活。过去那些没有成功的尝试是另一个有力的促成因素，解释人们为何不出手——他们往往倾向于今后把这一行动推给别人。在许多工作场所，必须指定胜任的工作人员，他们工作的一部分就是在工人没有使用适当设备或条件不安全时出面制止，出现危险时也必须让工作停下来。主管同样扮演关键角色。即使不要求配备胜任人员，主管也需要一整套技能，既能识别并消除职场危害，也能在团队内部建立一种支持出手干预与坦诚沟通的安全氛围。\n\n除了胜任的工作人员和主管之外，还必须教育组织内的每一个人：一旦目睹可能的不安全行为，他们就有义务出面制止，无论你是指定的胜任人员、主管还是一线员工。",
      },
    ],
    notes: [
      { en: "at-risk behavior", zh: "有风险的行为" },
      { en: "a risky situation beginning to unfold", zh: "危险局面开始成形" },
      { en: "bystander effect", zh: "旁观者效应" },
      { en: "diffusion of responsibility", zh: "责任分散" },
      { en: "evade their known responsibilities", zh: "逃避自己明知应负的责任" },
      { en: "creates the precedent", zh: "形成先例" },
      { en: "safety culture", zh: "安全文化" },
      { en: "fear of penalty", zh: "对受罚的害怕" },
      { en: "defer that action to someone else", zh: "把这一行动推给别人" },
      { en: "competent workers", zh: "胜任的工作人员" },
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
    translation: [
      {
        label: "",
        zh: "「环境保护主义者」这个词可以指不同的事情。它过去指的是那些设法保护野生生物和自然生态系统的人。到了 21 世纪，这个词已经演变为要涵盖应对人为造成的气候变化这一需要。这两种环境主义取向之间的区别，正是科学界在核能问题上出现分裂的原因。一方是纯粹派，他们认为核能不值得冒险，气候危机的唯一解决方案是可再生能源。另一方同意可再生能源至关重要，但指出社会需要有一定规模的电力供应，才能在太阳不升、风不吹的时候满足消费者的基本需求。相比石油、天然气和煤炭，核能清洁得多，因此是一个自然的选择，在水力发电能力有限的地方尤其如此。曾参与撰写联合国政府间气候变化专门委员会报告的 Leon Clarke 并非盲目支持核能，但他说，如果我们真要实现碳中和，核能是一个值得拥有的选项。他说：「这一切的核心在于，你认为我们究竟在多大程度上能真正用 100% 的可再生能源实现气候目标。」「如果你不相信我们能做到，而你在乎气候，你就不得不去考虑核能之类的东西。」全球百分之百使用可再生能源是否可行，同样存在争议。像佛蒙特州伯灵顿这样的城市，多年来一直是「百分之百可再生」的。但这些城市往往人口不多，偶尔仍依赖化石燃料能源，而且手边就有相当可观的可再生能源资源。与此同时，那些能够靠可再生能源运行的国家，通常得归功于非凡的水力发电能力。德国是一个大型工业化国家推进绿色能源的最佳案例。2011 年，Angela Merkel 总理宣布了 Energiewende（能源转型），即在逐步增加可再生能源的同时淘汰核能与煤炭。2010 年以来，风力和太阳能发电量增长超过 400%，2019 年可再生能源提供了该国 46% 的电力。但近年来进展已经停滞。可再生能源的不稳定，不仅意味着夜里常常发不出电，也意味着白天太阳能和风能可能压垮电网，迫使电力公司付钱请用户用电。落后的电网基础设施难以把这些过剩的绿色电力从德国北部输送到其工业化南部，这意味着许多工厂仍靠煤炭和天然气运行。在一些地方，政治上的极限也已触到，民众以激烈的抗议反对新建风力涡轮机。结果是，德国自 2010 年以来温室气体排放下降了约 11.5%，慢于欧盟 13.5% 的平均水平。",
      },
    ],
    notes: [
      { en: "environmentalist", zh: "环境保护主义者" },
      { en: "human-made climate change", zh: "人为造成的气候变化" },
      { en: "purists", zh: "纯粹派；坚定不妥协者" },
      { en: "hydroelectric capacity", zh: "水力发电能力" },
      { en: "carbon neutrality", zh: "碳中和" },
      { en: "universal 100% renewability", zh: "全球百分之百使用可再生能源" },
      { en: "fossil fuel energy", zh: "化石燃料能源" },
      { en: "phase out nuclear and coal while phasing in renewables", zh: "在逐步增加可再生能源的同时淘汰核能与煤炭" },
      { en: "overwhelm the grid", zh: "使电网超载" },
      { en: "greenhouse gas emissions", zh: "温室气体排放" },
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
    stemZh: "据说杰克逊为了保护那棵橡树不被毁掉，把橡树的所有权转给了它自己。",
    options: [],
    answer: "C",
    evidence: "Towards this end, Jackson transferred by means of a deed ownership of the tree and a little land around it to the tree itself.",
    explain: "题干说杰克逊把橡树的所有权转给了树自己，对应 C 段开头一句，讲他以契约方式把树及周围一小块土地的所有权转给树本身，该段接着还引用了契约原文。A 段只是设问，E、F 段讲后代树，都不涉及转让所有权这一动作。",
  },
  {
    n: 37,
    unitId: "r-b",
    stem: "No proof has been found from an extensive search that Jackson had ever owned the land where the oak tree grew.",
    stemZh: "经过广泛查证，并未发现杰克逊曾拥有橡树生长之地块的任何证据。",
    options: [],
    answer: "H",
    evidence: "Further, an extensive search of land ownership records in Athens does not seem to indicate Jackson ever owned the land the tree sits on.",
    explain: "题干说经过广泛查证仍找不到杰克逊拥有那块土地的证据，对应 H 段一句，讲对土地权属记录的广泛检索无法证明他拥有树所在地块。H 段开头还先推翻了他从小在此长大的说法，两处相扣，都指向题干。",
  },
  {
    n: 38,
    unitId: "r-b",
    stem: "When it was raining heavily, Jackson often took shelter under a big tree that is said to own itself.",
    stemZh: "大雨下得很大的时候，杰克逊常常到那棵据说拥有自己的大树下避雨。",
    options: [],
    answer: "B",
    evidence: "Its luxuriant leaves and sturdy limbs had often protected him from the heavy rains, and out of its highest branches he had many a time gotten the eggs of the feathered singers.",
    explain: "题干说下雨时杰克逊常躲在那棵自己拥有自己的大树下，对应 B 段所引一八九〇年《Athens Weekly Banner》文中一句，讲枝叶常为他遮雨，即树下避雨的细节正出自这段最早记载。C 段讲契约、D 段讲树的倒下，都对不上；G 段提出的是另一个疑问。",
  },
  {
    n: 39,
    unitId: "r-b",
    stem: "There is no evidence that Jackson had made arrangements to pay property taxes for the land on which the oak tree sat.",
    stemZh: "没有证据表明杰克逊曾安排为橡树所在地的土地缴纳房产税。",
    options: [],
    answer: "K",
    evidence: "Yet no account or record indicates any trust or the like was set up to facilitate this.",
    explain: "题干说没有证据表明杰克逊为树所在地块安排过房产税，对应 K 段末句，讲没有任何账目或记录显示设立过信托之类的安排。K 段首句先点明那块地要真正保住就必须缴税，两句合起来正好否定了题干的说法。",
  },
  {
    n: 40,
    unitId: "r-b",
    stem: "Professor Ward paid Jackson over one thousand dollars when purchasing a piece of land from him.",
    stemZh: "沃德教授从杰克逊手中买下一块地时，付给了他一千多美元。",
    options: [],
    answer: "I",
    evidence: "In the transaction, Ward was required to pay Jackson a sum of $1,200 (about $31,000 today), either for the property itself or simply in compensation for improvements Jackson had made on the lot.",
    explain: "题干说沃德教授买地时付给杰克逊一千多美元，对应 I 段一句，讲这笔交易中沃德须付给杰克逊一千二百美元，正合题干所说的一千多美元。该句还说明这笔钱可能是买地款，也可能是补偿他在空地上的改建。",
  },
  {
    n: 41,
    unitId: "r-b",
    stem: "It is said the tree that owned itself fell in a heavy windstorm.",
    stemZh: "据说那棵拥有自己的树倒于一场大风之中。",
    options: [],
    answer: "D",
    evidence: "Finally, on October 9, 1942, the over 30 meter tall and 200-400 year old tree fell, rumor has it, as a result of a severe windstorm and/or via having previously died and its roots rotted.",
    explain: "题干说那棵自己拥有自己的树据传倒于一场大风，对应 D 段末句，讲这棵三十多米高的古树据传因严重风暴而倒下，其中 rumor has it 正好对应题干的“据说”，severe windstorm 对应大风。E、F 段讲的都是后代树；C 段只写最初的契约，都不是倒树这件事。",
  },
  {
    n: 42,
    unitId: "r-b",
    stem: "The story of the oak tree is suspected to have been invented as a thought exercise.",
    stemZh: "有人怀疑这棵橡树的故事是被当作一次思维练习编造出来的。",
    options: [],
    answer: "N",
    evidence: "As to why the author would do this, it’s speculated perhaps it was a 19th century version of a click-bait thought exercise on whether it would be legal for someone to deed such a non-conscious living thing to itself or not.",
    explain: "题干说这个故事可能是被当作思维练习编出来的，对应 N 段末句，讲有人推测这只是十九世纪版的博眼球思维实验，讨论把无意识的生命赠予自己是否合法。L 段只说找不到契约的硬证据，并没有点破这一猜想。",
  },
  {
    n: 43,
    unitId: "r-b",
    stem: "Jackson’s little plantation was auctioned off to settle his debt in the mid-19th century.",
    stemZh: "杰克逊的小庄园在十九世纪中期被拍卖以清偿他的债务。",
    options: [],
    answer: "J",
    evidence: "Ten years later, in 1844, Jackson seemed to have come into financial difficulties and had his little plantation seized by the Clarke County Sheriff’s office and auctioned off to settle the mortgage.",
    explain: "题干说杰克逊的小庄园在十九世纪中期被拍卖抵债，对应 J 段一句，讲他陷入财务困难，庄园被郡警长办公室查封并拍卖以清偿抵押贷款，时间与事件都与题干吻合。I 段讲的是更早那次土地买卖，不是拍卖。",
  },
  {
    n: 44,
    unitId: "r-b",
    stem: "An official ceremony was held to celebrate the transplanting of a small tree to where its ancestor had stood.",
    stemZh: "为庆祝一棵小树被移栽到其祖先当年站立之处，举行了一场正式仪式。",
    options: [],
    answer: "E",
    evidence: "A couple of months later, an official ceremony was held featuring none other than the Mayor of Athens, Robert L McWhorter, to commemorate the occasion.",
    explain: "题干说为小树移栽回祖先旧址举行了正式仪式，对应 E 段末句，讲几个月后举行了由雅典市长亲临的纪念仪式，隆重程度正合“正式仪式”。E 段上文正是小树取自原树的坚果、被移植到祖先当年站立之处。",
  },
  {
    n: 45,
    unitId: "r-b",
    stem: "The story of the Tree That Owns Itself appeared in the local paper several times, with slight alterations in wording.",
    stemZh: "「拥有自己的树」的故事在当地报纸上出现过多次，只是措辞略有改动。",
    options: [],
    answer: "O",
    evidence: "The next account was in 1906, again in the Athens Weekly Banner, again very clearly copying the original account, only slightly reworded, the 19th century equivalent of re-posts when the audience has forgotten about the original.",
    explain: "题干说这个故事在当地报纸上多次出现、只是措辞略有改动，对应 O 段末句，讲一九〇六年该报又刊一篇，几乎照抄原报道只略换措辞。O 段首句还提到一九〇一年的百年纪念版已属转载，两句合起来正合题干的多次出现。",
  },
  {
    n: 46,
    unitId: "r-c1",
    stem: "What is one of the factors contributing to failure of intervention in face of risky behavior in the workplace?",
    stemZh: "面对职场中的危险行为而未能出手制止，成因之一是什么？",
    options: [
      {
        key: "A",
        en: "Slack supervision style.",
        zh: "监管松弛的管理风格。",
      },
      {
        key: "B",
        en: "Unfavorable workplace culture.",
        zh: "不利的工作场所文化。",
      },
      {
        key: "C",
        en: "Unforeseeable risk.",
        zh: "不可预见的风险。",
      },
      {
        key: "D",
        en: "Blocked communication.",
        zh: "沟通受阻。",
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
    stemZh: "作者所说的「责任分散」（第 3 段第 4 行）是什么意思？",
    options: [
      {
        key: "A",
        en: "The more people are around, the more they need to worry about their personal safety.",
        zh: "周围人越多，他们就越需要担心自身安全。",
      },
      {
        key: "B",
        en: "The more people who witness an event, the less likely anyone will venture to participate.",
        zh: "目击某件事的人越多，就越没人愿意参与其中。",
      },
      {
        key: "C",
        en: "The more people idling around on the street, the more likely they need taking care of.",
        zh: "在街上闲逛的人越多，就越需要有人去照料。",
      },
      {
        key: "D",
        en: "The more people are around, the less chance someone will step forward to intervene.",
        zh: "周围人越多，就越少有人挺身而出干预。",
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
    stemZh: "当职场上的不安全行为得不到领导层处理时，会发生什么？",
    options: [
      {
        key: "A",
        en: "No one will intervene when they see similar behaviors.",
        zh: "再遇到类似行为时没人会出手干预。",
      },
      {
        key: "B",
        en: "Everyone will see it as the easiest way to deal with crisis.",
        zh: "人人都会把它看作处理危机的最省事的办法。",
      },
      {
        key: "C",
        en: "Workers have to take extra caution executing their duties.",
        zh: "工人执行任务时不得不格外小心。",
      },
      {
        key: "D",
        en: "Workers are left to take care of the emergency themselves.",
        zh: "工人只能自己处理这种突发状况。",
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
    stemZh: "工人看到违规操作却不作为的根本原因是什么？",
    options: [
      {
        key: "A",
        en: "Preference of deferring the action to others.",
        zh: "倾向于把这一行动推给别人。",
      },
      {
        key: "B",
        en: "Anticipation of leadership intervention.",
        zh: "预期领导层会出面干预。",
      },
      {
        key: "C",
        en: "Fear of being isolated by coworkers.",
        zh: "害怕被同事孤立。",
      },
      {
        key: "D",
        en: "Fear of having to do more work.",
        zh: "害怕一干预就得干更多的活。",
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
    stemZh: "确保职场安全的关键是什么？",
    options: [
      {
        key: "A",
        en: "Workers be trained to operate their equipment properly.",
        zh: "工人接受培训、正确操作设备。",
      },
      {
        key: "B",
        en: "Workers exhibiting at-risk behavior be strictly disciplined.",
        zh: "对有风险行为的工人严加惩戒。",
      },
      {
        key: "C",
        en: "Supervisors create a safety environment for timely intervention.",
        zh: "主管营造有利于及时干预的安全氛围。",
      },
      {
        key: "D",
        en: "Supervisors conduct effective communication with frontline workers.",
        zh: "主管与一线工人进行有效沟通。",
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
    stemZh: "科学界在核能问题上出现分歧的原因是什么？",
    options: [
      {
        key: "A",
        en: "Attention to combating human-made climate change.",
        zh: "对应对人为造成的气候变化的关注。",
      },
      {
        key: "B",
        en: "Emphasis on protecting wildlife and natural ecosystems.",
        zh: "强调保护野生生物和自然生态系统。",
      },
      {
        key: "C",
        en: "Evolution of the term ‘green energy’ over the last century.",
        zh: "过去一个世纪里「绿色能源」一词的演变。",
      },
      {
        key: "D",
        en: "Adherence to different interpretations of environmentalism.",
        zh: "各自坚持对环境主义的不同理解。",
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
    stemZh: "纯粹派的对立者提出了什么解决能源短缺的办法？",
    options: [
      {
        key: "A",
        en: "Relying on renewables firmly and exclusively.",
        zh: "坚定而完全地依赖可再生能源。",
      },
      {
        key: "B",
        en: "Using fossil fuel and green energy alternately.",
        zh: "交替使用化石燃料与绿色能源。",
      },
      {
        key: "C",
        en: "Opting for nuclear energy when necessary.",
        zh: "必要时选择核能。",
      },
      {
        key: "D",
        en: "Limiting people’s non-basic consumption.",
        zh: "限制人们的非基本消费。",
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
    stemZh: "作者以伯灵顿等城市为例，是想说明什么？",
    options: [
      {
        key: "A",
        en: "It is controversial whether the goal of the whole world’s exclusive dependence on renewables is attainable.",
        zh: "全世界完全依赖可再生能源这一目标能否实现，存在争议。",
      },
      {
        key: "B",
        en: "It is contentious whether cities with large populations have renewable resources at their immediate disposal.",
        zh: "人口众多的城市是否坐拥可再生能源资源，存在争议。",
      },
      {
        key: "C",
        en: "It is arguable whether cities that manage to run off renewables have sustainable hydroelectric capabilities.",
        zh: "那些成功实现可再生能源运行的城市是否具备可持续的水力发电能力，尚有争议。",
      },
      {
        key: "D",
        en: "It is debatable whether traditional fossil fuel energy can be done away with entirely throughout the world.",
        zh: "传统化石能源能否在全球范围内彻底退出，尚有争议。",
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
    stemZh: "关于德国的可再生能源，我们了解到了什么？",
    options: [
      {
        key: "A",
        en: "It has increased its wind and solar power generation four times over the last two decades.",
        zh: "它在过去二十年里把风力和太阳能发电量提高到原来的四倍。",
      },
      {
        key: "B",
        en: "It represents a good example of a major industrialized country promoting green energy.",
        zh: "它是推动绿色能源的大型工业化国家的一个好例子。",
      },
      {
        key: "C",
        en: "It relies on renewable energy to generate more than half of its electricity.",
        zh: "它依靠可再生能源发出超过一半的电力。",
      },
      {
        key: "D",
        en: "It has succeeded in reaching the goal of energy transition set by Merkel.",
        zh: "它成功实现了默克尔设定的能源转型目标。",
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
    stemZh: "德国近年的进展陷入停滞，可能的原因之一是什么？",
    options: [
      {
        key: "A",
        en: "Its grid infrastructure’s capacity has fallen behind its development of green energy.",
        zh: "它的电网基础设施容量已落后于绿色能源的发展。",
      },
      {
        key: "B",
        en: "Its overabundance of green energy has forced power plants to suspend operation during daytime.",
        zh: "绿色能源过剩迫使发电厂在白天暂停运行。",
      },
      {
        key: "C",
        en: "Its industrial south is used to running factories on conventional energy supplies.",
        zh: "它南部的工业地区习惯用传统能源供应来运行工厂。",
      },
      {
        key: "D",
        en: "Its renewable energy supplies are unstable both at night and during the day.",
        zh: "它的可再生能源供应在夜间和白天都不稳定。",
      },
    ],
    answer: "A",
    evidence: "Lagging grid infrastructure struggles to transport this overabundance of green energy from Germany’s north to its industrial south, meaning many factories still run on coal and gas.",
    explain: "选 A。原文说 Lagging grid infrastructure struggles to transport this overabundance of green energy，即电网建设落后，送不过去北部的过剩绿电，正是电网能力落后于绿电发展，A 正确。B“过剩迫使电厂白天停机”曲解，原文说白天电量过剩时电力公司反而付钱请用户用电；C、D 与原文所述不符，属于无中生有。",
  },
];
