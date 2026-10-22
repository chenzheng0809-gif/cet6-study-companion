import type { Question, ReadingSection } from "./types";

/**
 * 2025 年 12 月六级 · 第一套 · Part III Reading Comprehension
 * 原文来自真题 PDF，全文译文与逐题解析来自解析 PDF。
 *
 * `titleEn` 是题目标题的英文版，跟同一行 `labelZh` 一一对应 ——
 * 是那份中文标题的翻译，不是另编的标题。界面上显示的是 `titleEn`。
 */

export const READING_SECTIONS: ReadingSection[] = [
  {
    id: "r-a",
    label: "Section A",
    labelZh: "选词填空 · 40 岁后开始运动还来得及吗",
    kind: "bank",
    questionRange: [26, 35],
    paragraphs: [
      {
        label: "",
        en: `By now, it is generally accepted that regular exercise comes with an assortment of health benefits for people who maintain the habit over time. But is it {{26}} too late to start?

New research looked at people who increased their exercise levels after their 40s beyond levels they had when they were younger and those individuals showed declines in their risk of early {{27}} which were similar to those of people who exercised consistently throughout their lives. This was a {{28}} of 32% to 35% compared to people who did not exercise. Those who began exercising in middle age also saw reductions in their incidence of {{29}} diseases, such as heart disease and cancer, which were similar to the steady exercisers.

So why bother exercising consistently throughout your life? The authors of the study {{30}} that some might interpret the study's findings to mean that they can delay starting an exercise program but this would be a mistake. There are other benefits, both mental and physical, to staying consistently active that we should not {{31}}. These real health benefits include better {{32}} functioning and lowered risk of gaining weight. The latter is {{33}} important given the global obesity epidemic. In addition, experts assert that starting younger is better because, if you make a habit of exercising when you are young, you are more likely to keep up those {{34}} later in life. It is ideal, then, for people to start exercising when they are children or {{35}}. and it is good to maintain an active lifestyle at all times regardless of your age. However, this study does indicate that, if you have not been active, you can still benefit if you start becoming active in your 40s and 50s.`,
      },
    ],
    translation: [
      {
        label: "",
        zh: `时至今日，人们普遍认为，长期保持规律锻炼习惯的人有各种健康益处。但是不是[26]在任何时候开始运动都为时过晚呢？

一项新研究观察了那些在 40 岁之后将运动水平提升至超过年轻时水平的人群。这些人早[27]逝风险的下降幅度，与那些一生都坚持运动的人相似。与不运动的人相比，这一[28]下降幅度达到 32% 至 35%。那些中年才开始运动的人，其[29]慢性疾病（如心脏病和癌症）的发病率也有所下降，降幅与长期坚持运动者相近。

那么，为何还要费心终生坚持运动呢？该研究的作[30]者承认，有些人可能会将研究结果解读为可以推迟开始运动计划，但这将是一个错误。长期坚持运动还有我们不应[31]忽视的其他身心益处。这些实实在在的健康益处包括更好的[32]认知功能以及更低的增重风险。鉴于全球肥胖流行病，后者[33]尤为重要。此外，专家断言，越早开始（锻炼）越好，因为如果你在年轻时就养成运动的习惯，你更有可能在日后保持这些习惯[34]模式。因此，最理想的情况是人们从儿童或[35]青少年时期就开始锻炼，无论年龄多大，始终保持积极的生活方式都是有益的。然而，这项研究确实表明，如果你之前一直不怎么锻炼，在四五十岁时开始动起来，你仍然可以获益。`,
      },
    ],
    bank: [
      { key: "A", word: "adolescents", pos: "n.", zh: "青少年" },
      { key: "B", word: "arbitrarily", pos: "adv.", zh: "任意地；武断地" },
      { key: "C", word: "chronic", pos: "adj.", zh: "慢性的" },
      { key: "D", word: "cognitive", pos: "adj.", zh: "认知的" },
      { key: "E", word: "concede", pos: "v.", zh: "承认" },
      { key: "F", word: "disregard", pos: "v.", zh: "忽视；不理；漠视" },
      { key: "G", word: "drop", pos: "n.", zh: "下降；减小；降低" },
      { key: "H", word: "ever", pos: "adv.", zh: "在任何时候；究竟，到底" },
      { key: "I", word: "maneuver", pos: "n.", zh: "策略；花招" },
      { key: "J", word: "mortality", pos: "n.", zh: "死亡率" },
      { key: "K", word: "particularly", pos: "adv.", zh: "尤其，特别" },
      { key: "L", word: "patterns", pos: "n.", zh: "模式" },
      { key: "M", word: "refute", pos: "v.", zh: "驳斥" },
      { key: "N", word: "stereotype", pos: "n.", zh: "刻板印象" },
      { key: "O", word: "vocal", pos: "adj.", zh: "大声的；畅所欲言的" },
    ],
    notes: [
      { en: "assortment", zh: "各种；混合" },
      { en: "incidence", zh: "发病率；发生率" },
      { en: "bother", zh: "费心；操心" },
      { en: "obesity epidemic", zh: "肥胖流行病" },
      { en: "keep up", zh: "保持（习惯）" },
    ],
  },
  {
    id: "r-b",
    label: "Section B",
    labelZh: "长篇阅读 · 餐厅雇机器人，厨师该担心吗",
    kind: "matching",
    questionRange: [36, 45],
    paragraphs: [
      { label: "A", en: `Like most chefs, Flippy is not afraid of hard work. Since last summer, that has meant 11am until 7pm shifts at Caliburger in Pasadena, California, as well as short assignments at Chick-N-Tots at Dodger Stadium in Los Angeles. These are long hours of repetitive work, where the boss demands absolute consistency. But you won't hear Flippy complain or say anything, in fact. For Flippy is a robot — a cloud-connected mechanical arm with 3D thermal scanners for eyes — that can flip burgers or fry 80 baskets of food an hour, monitor that food and even clean up afterwards.` },
      { label: "B", en: `Flippy was created by Miso Robotics, part of the Cali Group, which is described by its CEO, John Miller, as: "A technology company that happens to sell cheeseburgers." Cali creates new machines that it road-tests in its Caliburger restaurants across the world, into which Flippy will be deployed this year. And Flippy is not alone. Also in California, Bear Robotics has developed a self-guiding robot, Penny, which has so far served 40,000 diners.` },
      { label: "C", en: `Ten years ago, robot-chefs and waiters were pure science fiction. Today, they are a reality, and at prices that make them a plausible investment. From May, Penny will be shipped on a subscription basis that offers "an immediate return," says Bear Robotics chief operating officer, Juan Higueros. Flippy will cost a reported $60,000 to $100,000. Fully automated burger restaurants managed with minimal human oversight — where customers order at screens, pay electronically and eat food cooked and delivered by robots — are now a possibility.` },
      { label: "D", en: `The technology exists, it just needs knitting together cost-effectively and in a way diners buy into. In an industry keen to slash labour costs and increase profits, further automation seems inevitable. After an eight-month test at Kang Nam Tofu House in California, Bear Robotics credited Penny with driving a 28% increase in sales. Meanwhile, in US trials, the self-ordering screens that McDonald's is currently installing at its 1,300 UK restaurants yielded a reported 30% rise in order values.` },
      { label: "E", en: `Personalisation is seen as key to the appeal of this technology, alongside its ability to reliably push so-called "upsells" (meal deals, extras, larger drinks) to customers. Soon when you log into a restaurant app, it will be able to use your data and purchasing history to recommend dishes to you — factoring in everything from the weather to, if you are ordering at a screen that can read your face, your mood.` },
      { label: "F", en: `"Right now people compromise on choice. We're presented with a one-size-fits-all menu. Ultimately, technology can allow us to make personal choices. You love spicy food and chicken? Here's the dish people like you mostly order," says Tom Weaver, CEO at the hospitality tech company Flyt. He talks enthusiastically about the Helsinki pop-up Take-In, a full-service restaurant where diners ordered dishes in from various delivery services. 'For the first time in a few hundred years, digital is allowing us to create new versions of restaurants.'` },
      { label: "G", en: `If high-street fast food is automation-ready, its impact on high-end restaurants is likely to be subtler and slower. "It'll probably be a very long time before we see a five-star robot-chef," says Noel Sharkey, professor of AI and robotics at the University of Sheffield. "Apart from the AI creativity gap, great cooking involves a subtle understanding of ingredients and delicate cooking that would be enormously challenging for robots. Placing fragile foods on plates would be incredibly slow."` },
      { label: "H", en: `Currently, robots have limited functionality. A human needs to load Penny with plates that diners lift off themselves. At the robot-powered US pizza-delivery company Zume, the more difficult jobs, such as topping pizzas, are still done by humans. But Moley, which will launch soon, offers an idea of the sophistication to come. Modelled on the movements of a MasterChef contest winner, Tim Anderson, its robotic arms are fixed over a stove and programmed to prepare dishes from raw ingredients. It is designed for domestic use, but a commercial version is planned that opens up the possibility of restaurant kitchens automating even highly technically challenging tasks.` },
      { label: "I", en: `For now, the kitchen technology that QSR Automations supplies to Mitchells & Butlers' pubs or KFC is less glamorous. Rather than having a chef shouting out diners' orders, the QSR system automatically distributes those orders across screens. The kitchen screens then tell chefs when to start cooking each dish, so that your plate of fish, chips and peas comes together at the right time.` },
      { label: "J", en: `The restaurant industry is currently suffering a severe shortage of skilled chefs — a deficit of 11,000, according to the skills agency People 1st. "Automation systems designed to make the process more idiot-proof are trying to bridge that gap," says Stefan Chomka, the editor of Restaurant magazine.` },
      { label: "K", en: `In terms of simplifying or enhancing the customer experience, online restaurant booking has been the easily-won success of the internet age. Automated at-table ordering and payment is seen as the next landmark. Until then, early adopters, such as the Manchester bar owner Andy Smith, who uses the Ordoo app at his venue on Oldham Street, may well experience growing but "lower than expected" acceptance.` },
      { label: "L", en: `Embarrassing failures in restaurant tech frequently hit the headlines. The TGI Fridays drone that injured a Brooklyn Daily photographer; US burger chain Shake Shack having to retreat from plans for entirely cashless ordering sites. But, says Chomka, such technology could miss the mark if it only offers "solutions to problems that don't really exist". "Payments being automatic" could be useful, he adds. But, in an expensive restaurant, how quick do you need dinner to be?` },
      { label: "M", en: `That attachment to the human art of hospitality will be heartening for staff who see automation as a threat to jobs. "Unite is concerned that without safeguards, any benefits will bypass workers in low-paying jobs, such as waiters," says the union's London regional officer, Dave Turnbull. "We're urging Members of Parliament to ensure automation does not just benefit a wealthy few like previous industrial revolutions."` },
      { label: "N", en: `The industry principle is that automation will allow it to redeploy staff more effectively. Jobs will change, if not immediately decrease in number. "Self-order screens mean more demand for people front-of-house. Last year, we recruited 1,000 new managers," says McDonald's COO, Jason Clark. Caliburger has a programme to retrain staff as robot engineers or "chef techs".` },
      { label: "O", en: `But ultimately the chance to reduce overheads (管理费用) by employing fewer people or at lower rates will be what attracts big brands to technology. Invariably, over the next 10 years, jobs will go in conventional bricks-built restaurants, not least because automation will boost their rapidly growing rival: delivery. Companies such as Domino and Just Eat have both experimented with robot and drone delivery, which is already legal in Reykjavik, Iceland. "Robot food deliveries are the future," says Noel Sharkey. "Small, 4mph ground robots are safe and will work 24 hours a day."` },
      { label: "P", en: `Combined with machine learning of anticipated order volumes and the minute-by-minute cooking data generated by systems such as QSR, that robot fleet could deliver almost instantly. "Restaurants will prepare food ahead of orders coming in," predicts Just Eat's director of engineering, Daniel Richardson. "I'll be able to say 'Let's have pizza to my family, my intelligent assistant will hear and 10 minutes later the food will be at my door,'" No one is putting an exact date on it yet. But in the dining room and on your doorstep, the robots are coming.` },
    ],
    translation: [
      { label: "A", zh: `[40] 像大多数厨师一样，Flippy 并不辛苦。自去年夏天起，它每天上午 11 点到晚上 7 点在加利福尼亚州帕萨迪纳的 Caliburger 餐厅工作，偶尔还去洛杉矶道奇体育场 Chick-N-Tots 餐厅做短期「外派」工作。这些都是耗时长久的重复性工作，老板要求绝对一致的品质。[40] 但事实上你不会听到 Flippy 抱怨或说话，因为 Flippy 是一台机器人——一只与云端连接的机械臂，用 3D 热感扫描仪当眼睛——可以翻煎汉堡或者一小时炸 80 篮食物，监控火候，甚至事后还能自己打扫。` },
      { label: "B", zh: `Flippy 由 Miso 机器人公司研发，该公司隶属于 Cali 集团，Cali 集团的首席执行官约翰·米勒将该公司描述为：「一家恰好在卖芝士汉堡的技术公司。」Cali 集团研发新机器，并在世界各地的 Caliburger 餐厅进行实地测试，今年 Flippy 将在这些门店被投入使用。Flippy 并非孤例。同样在加利福尼亚州，Bear 机器人公司研发了一款名为 Penny 的自动导航机器人，目前已服务过 4 万名食客。` },
      { label: "C", zh: `十年前，机器人厨师和服务员还纯属科幻小说中的情节。如今，它们已成为现实，而且它们的价格也使其成为一项可行的投资。Bear 机器人公司的首席运营官胡安·希格罗斯表示，从五月起，Penny 机器人将采用订阅制运送服务，此举可带来「即时的回报」。据报道，Flippy 的售价在 6 万至 10 万美元之间。[36] 几乎无需人工监管、完全自动化的汉堡餐厅——顾客在屏幕上下单、电子支付，吃出机器人烹饪并递送的食物——如今已成为可能。` },
      { label: "D", zh: `技术已经存在，只是需要以经济高效的方式整合起来，并且要让顾客接受。[38] 在一个急于削减人工成本和提高利润的行业，进一步的自动化似乎不可避免。在加利福尼亚州的 Kang Nam Tofu House 进行了八个月的测试后，Bear 机器人公司称 Penny 使其销售额增长了 28%。与此同时，在美国试点中，麦当劳目前在其英国 1300 家门店安装的自助点餐屏据报使订单金额提高了 30%。` },
      { label: "E", zh: `个性化被视为这项技术吸引人的关键，此外它还能可靠地向顾客推销所谓的「加购」（套餐、附加值、大杯饮料）。很快，当你登录一家餐厅的应用程序时，它就能利用你的数据和消费记录为你推荐菜品——从天气到你的心情（如果你是在能识别人脸的屏幕上点餐的话），所有因素都会被考虑在内。` },
      { label: "F", zh: `「眼下，人们在选择上妥协。我们面对的是千篇一律的菜单。最终，技术可以让我们做出个性化的选择。你喜欢辛辣食物和鸡肉吗？这是与你类似的人最常点的菜，」酒店科技公司 Flyt 的首席执行官汤姆·韦弗说道。他兴致勃勃地谈到了赫尔辛基的快闪餐厅 Take-In，Take-In 是一家提供全方位服务的餐厅，食客可以从各种外卖服务中点餐。[41]「几百年来第一次，数字化让我们得以创造餐厅的新形态。」` },
      { label: "G", zh: `[45] 如果说街头快餐已准备好迎接自动化，那么其对高端餐厅的影响可能会更微妙、更缓慢。谢菲尔德大学人工智能与机器人学教授诺埃尔·沙基说道：「我们可能要很久之后才会看到五星级的机器人厨师。除了人的创造力差距之外，出色的烹饪还需对食材的细腻理解与精致烹调，这对机器人来说极具挑战性。将易碎的食物摆放到盘子里也会极其缓慢。」` },
      { label: "H", zh: `目前，机器人的功能还比较有限。Penny 需要人工把盘子装到其托盘上，再由顾客自行取走。[37] 在美国的机器人比萨递送公司 Zume，难度更大的工作，比如给比萨饼加配料，仍由人类完成。但即将推出的机器人 Moley 则让人们得以一窥未来的精细程度：它模仿《厨艺大师》节目冠军蒂姆·安德森的动作，其机械臂固定在炉灶上方，可按程序用食材制作完成一道道菜。它最初是为家庭使用设计的，但商用版已在规划中，使餐厅厨房有望把高技术难度的环节也自动化。` },
      { label: "I", zh: `目前，QSR 自动化公司为 Mitchells & Butlers 旗下酒吧或肯德基提供的厨房技术并不那么引人注目。不再由厨师大声喊出顾客的订单，QSR 系统会自动将订单分配到各个屏幕。厨房屏幕会告诉厨师何时开始烹饪哪一道菜，这样你点的鱼、炸薯条和豌豆就能同时上餐。` },
      { label: "J", zh: `[43] 当前，餐饮业正面临技术精湛的厨师严重短缺的问题——据技能机构 People 1st 统计，缺口达 11000 人。「旨在让流程更易操作的自动化系统正试图填补这一空缺。」《餐厅》杂志编辑斯特凡·乔姆卡说道。` },
      { label: "K", zh: `就简化或提升顾客体验而言，在线预定餐厅是互联网时代轻易易举就能取得的成功。而餐桌边自动点餐和支付则被视为下一个里程碑。在此之前，像曼彻斯特酒吧老板安迪·史密斯这样的早期采用者，在其位于老哈姆街 33 号的酒吧使用 Ordoo 应用程序时，很可能会经历一种接受度虽在提升，但「不及预期」的局面。` },
      { label: "L", zh: `[39] 餐饮科技的尴尬失败案例常常登上头条。TGI Fridays 的无人机曾撞伤《布鲁克林日报》的一名摄影师；美国汉堡连锁店 Shake Shack 也不得不放弃完全无现金点餐的计划。不过，乔姆卡表示，如果这类技术只是提供「解决那些根本不存在的问题的方案」，那可能就偏离了目标。他还补充道，「自动支付」或许有用，但在花费高的餐厅，「你需要晚餐多快上桌呢？」` },
      { label: "M", zh: `[42] 对于那些将自动化视为失业威胁的员工来说，这种对人类待客之道的依恋令人振奋。联合工会担心，如果没有保障措施，任何好处都会绕过像服务员这类低收入岗位的劳动者，该工会伦敦地区官员戴夫·特恩布尔说，「我们正在敦促议员们确保自动化不会像之前的工业革命那样只让少数富人受益。」` },
      { label: "N", zh: `该行业的原则是，自动化将使企业能够更有效地重新调配员工。工作岗位即便不会立即减少，也会发生变化。麦当劳首席运营官杰森·克拉克说：「自助点餐屏幕意味着对前台员工的需求增加。去年，我们新招聘了 1000 名经理。」Caliburger 餐厅有一个计划，将员工重新培训为机器人工程师或「厨师技师」。` },
      { label: "O", zh: `但最终，通过减少员工数量或降低工资来降低管理费用的机会，将是吸引大品牌采用技术。[44] 在接下来的十年里，传统实体餐厅的工作岗位必然会减少，尤其是因为自动化会促进其快速增长竞争对手——外卖业务的发展。像达美乐和 Just Eat 这样的公司都已尝试过使用机器人和无人机送货，这种做法在冰岛的雷克雅未克已经合法。诺埃尔·沙基说道：「机器人送餐是未来的趋势。小型、时速 4 英里的地面机器人安全可靠，而且可以全天候工作。」` },
      { label: "P", zh: `凭借（基于机器学习的）订单预测能力以及 QSR 等系统生成的实时烹饪数据，这支机器人队伍几乎可以实现即时配送。Just Eat 的工程总监丹尼尔·理查森预测：「餐厅会提前准备好食物，等订单进来。我将可以对我的家人说『咱们吃比萨吧』，我的智能助手就会听到，十分钟后食物就会送到我家门口。」目前还没有人对此给出确切的日期。但在餐厅和你家门口，机器人都即将登场。` },
    ],
    notes: [
      { en: "in fact", zh: "事实上" },
      { en: "road-test", zh: "实地测试" },
      { en: "oversight", zh: "监管； oversight" },
      { en: "upsell", zh: "加购" },
      { en: "compromise on choice", zh: "在选择上妥协" },
      { en: "idiot-proof", zh: "万无一失的" },
      { en: "bricks-built", zh: "实体砖砌的" },
      { en: "overheads", zh: "管理费用" },
    ],
  },
  {
    id: "r-c1",
    label: "Section C · Passage One",
    labelZh: "仔细阅读 · 友谊与个人成功",
    kind: "detail",
    questionRange: [46, 50],
    paragraphs: [
      {
        label: "",
        en: `Many see friendships as a comfort blanket: a shoulder to cry on, a reliable soul to confide in. However, more often than not, in our eagerness to seek individual success, we lose friends along the way and that has become part of the process.

The chaos and never-ending turmoil that accompanies everyday life is an aggressive obstacle in the pursuit of stable friendships. As students, we use this excuse to shrug off losing people who we once thought to be loved ones.

Instead of viewing our lives as a race, where everyone is on their own path to some form of success, we must relearn to value the connections we make along the track. We must reevaluate the harm of radical, individual freedom.

Radical individualism elevates the freedom of the individual over the collective. It argues, for instance, that universal healthcare, an example of collectivism, threatened the dream of many Americans.

Many of us have fallen victim to an individualistic culture. Society tends to celebrate personal achievement and commend it based on the assumption that winning or succeeding is a consequence of working harder than the next person.

As a society, we idolize the concept of "losing friends on the road to success." I remember hearing in high school, "Don't worry about losing friendships, just focus on study and getting into college. That's all that will matter in the long run," a sentiment that is not unique to my experience. It's preached in many success stories, and it's embedded in the way we see growth. Motivational speakers will push their audience to be complacent to the inevitable end of losing friends. Spend too much time with friends? You're losing time better utilized on your achievements. Invest time in your relationships? Invest time in your work instead.

This constant need to succeed has blinded us from seeing through the whirlwind of change that accompanies our everyday lives. We are expected to tangibly succeed, earn awards, get higher positions, earn better grades. In order to succeed, we lose friends, and that has sadly become normalized.

We cannot be complacent with losing friendships because they are our anchors.

Yes, pursue success. Challenge yourself. Push limits. But contrary to all the self-proclaimed success experts, doing it alone does not make you more successful or any better than someone who achieved it with the help of others.

Put effort into fostering healthy relationships, and maintaining them through your busy schedule that seems like it leaves no time for anyone else. Although we may be living in a society that treasures the independent pursuit of achievement, having people to support and love you on the way is far more important than any end result.`,
      },
    ],
    translation: [
      {
        label: "",
        zh: `许多人将友谊视为一条安抚毯：一个可以倚靠哭诉的肩膀，一个能够倾诉衷肠的可靠灵魂。[46] 然而，我们在急于追求个人成功的路上，往往会失去朋友，这已然成为成功路上的一部分。

日常生活中所伴随的混乱与无尽的纷扰，是追求稳定友谊过程中的一大障碍。作为学生，我们常以此为借口，对失去曾经视为挚爱的人表现得满不在乎。

我们不应将人生视作一场赛跑，每个人都独自奔向某种形式的成功，相反，我们必须重新学会珍视人生道路上结下的情谊。[47] 我们必须重新审视极端个人自由所带来的危害。

极端个人主义将个体自由凌驾于集体之上。例如，它声称，全民医疗保健这种集体主义的做法威胁到了许多美国人的梦想。

我们中的许多人都已成为个人主义文化的受害者。社会倾向于颂扬个人成就，并基于这样一种假设——获胜或成功是比别人更努力工作的结果——来称赞个人成就。[48]

作为一个社会，我们崇尚「成功路上难免失友」的观念。我记得高中时就听过这样的话：「别担心失去友谊，只要专心学习，考上大学就行。从长远来看，这才是最重要的。」这种观点并非我独有。许多成功故事都在宣扬这种观点，它也深深植根于我们对成长的认知之中。励志演讲者会鼓动听众，让他们对失去朋友这一不可避免的结果感到满不在乎。花太多时间和朋友相处？那你就是在浪费本该用于取得成就的时间。[49] 花时间经营人际关系？不如把时间花在工作上。

这种对成功的执念，让我们无法看透伴随日常生活的瞬息万变。我们被期望取得实实在在的成功——赢得奖项，晋升职位，取得更好的成绩。为了成功，我们失去了朋友，而令人悲哀的是，这种现象已经成了常态。

[50] 我们不能对失去友谊这件事无动于衷，因为友谊是我们的精神支柱。

诚然，我们要追求成功，挑战自我，突破极限。但与那些自封的成功学专家所言相反，孤军奋战并不会让你比那些在他人帮助下取得成功的人更成功，也不会让你更优秀。

要努力培养健康的人际关系，即使在看似无暇顾及他人的忙碌日程中也要努力维系它们。尽管我们也许身处一个崇尚独立追求成就的社会，[50] 但在追求成功的道路上，有人支持你、爱你，这远比任何最终结果都重要。`,
      },
    ],
    notes: [
      { en: "confide", zh: "吐露（或倾诉）秘密" },
      { en: "eagerness", zh: "渴望；热切，急切" },
      { en: "turmoil", zh: "纷乱；混乱；动荡" },
      { en: "aggressive", zh: "好斗的；声势浩大的" },
      { en: "obstacle", zh: "障碍；阻碍" },
      { en: "shrug off", zh: "对……满不在乎" },
      { en: "radical", zh: "激进的；极端的" },
      { en: "individualism", zh: "个人主义" },
      { en: "elevate", zh: "提高，提升（地位）" },
      { en: "collectivism", zh: "集体主义" },
      { en: "commend", zh: "赞扬，称赞，表扬" },
      { en: "assumption", zh: "假定，假设" },
      { en: "idolize", zh: "崇拜；热爱" },
      { en: "sentiment", zh: "（基于情感的）观点，看法；情绪" },
      { en: "embed", zh: "使（情感、观点）深深植入" },
      { en: "motivational", zh: "励志的；激励人心的" },
      { en: "complacent", zh: "自满的；满不在乎的" },
      { en: "whirlwind", zh: "旋风，旋流" },
      { en: "tangibly", zh: "有形地；实际地" },
      { en: "normalize", zh: "（使）正常化，常规化" },
      { en: "anchor", zh: "锚；精神支柱" },
      { en: "self-proclaimed", zh: "自称的，自封的" },
      { en: "comfort blanket", zh: "安慰毯" },
    ],
  },
  {
    id: "r-c2",
    label: "Section C · Passage Two",
    labelZh: "仔细阅读 · 追求公平",
    kind: "detail",
    questionRange: [51, 55],
    paragraphs: [
      {
        label: "",
        en: `During his acceptance speech for the Nobel Peace Prize, Martin Luther King Jr. said, "I believe that unarmed truth and unconditional love will have the final word in reality."

More than five decades later, our society is still struggling to separate truth from fantasy, fact from fiction. From disputes over the climate change to debates about how slavery is taught, America is at a crossroads. And the battle for equity is at the heart of these vital conversations.

Study after study shows that inequity has had appalling consequences. A 2020 report by Citi indicated that "Black students could have increased their lifetime incomes $90-$113 billion" if equity issues related to higher education had been adequately addressed over the past two decades.

This statistic represents a flood of issues we've failed to confront as a nation. It also highlights one truth: We're missing out on valuable opportunities to bridge the differences that divide us. However, by honoring King's legacy, we can get our country back on the path toward true equity.

Students — and adults for that matter — simply cannot understand the conflicts we have today without understanding what caused them in the first place. That means we have a responsibility to help them make connections between U.S. history and current events. It also means giving them the tools they need to address inequity and bias in their own lives. Adherence to these principles, along with a commitment to truthful dialogue, can help every student better appreciate how far we've come and more clearly see the roads we have yet to travel.

With more truthful analysis of the need for more qualified, diverse educators, we can improve our recruiting, training, and retention strategies for schools across the country.

Unfortunately, our deeply rooted divisions are delaying these advancements. A recent survey found that 77 percent of Americans believe the nation is "more divided than ever before". But reports of increased polarization shouldn't persuade us to look away from one another. Instead, they should compel us to address our shared issues head-on.

We are not, as some would suggest, living in a "post-racial society." We simply cannot afford to keep our heads buried in the sand when it comes to racial inequity. Unless we get honest about intolerance, bias, and how these social diseases impact the ways we treat one another, injustice will continue to haunt us. But our children and our grandchildren deserve better.

On this Martin Luther King Day and beyond, let's commit to working together to disrupt the status quo. Let's continue to build a better, more inclusive nation; and in the words of Martin Luther King Jr., "A society at peace with itself, a society that can live with its conscience."`,
      },
    ],
    translation: [
      {
        label: "",
        zh: `马丁·路德·金在诺贝尔和平奖的获奖演说中曾言：「我相信，无需武力加持的真理和无条件的爱，终将在现实中占据主导地位。」

五十余载光阴流转，我们的社会却仍在为辨别虚实、厘清事实而挣扎。[51] 从围绕气候变化的争论，到关于奴隶制教学方式的分歧，美国正站在十字路口上。而对公平的追求，正是这些关键议题的核心所在。

诸多研究均表明，不公平现象已造成触目惊心的后果。花旗银行 2020 年的一份报告指出，倘若过去二十年来高等教育领域的公平问题得到妥善解决，[52]「黑人学生的终身收入本可以增加 900 亿至 1130 亿美元」。

这一数据背后，是我们整个国家始终未能正视的一系列问题。它也揭示了一个真相：我们正错失弥合分歧的宝贵机遇。[53] 不过，只要传承马丁·路德·金的精神遗产，我们便能让国家重新踏上通往真正公平的道路。

学生们——其实成年人也一样——若不先理解引发我们当下种种冲突的根源，就根本无法真正理清这些冲突。这意味着我们有责任帮助他们在美国历史与当下时事之间建立联系。这也意味着要赋予他们必要的工具，以便在各自的生活中应对不公平与偏见。坚守这些原则，再加上对真诚对话的承诺，就能帮助每一个学生更好地体认我们已走了多远，并更清晰地看到前方尚待跋涉的道路。

若能更如实地剖析对更多合格且多元的教育者的需求，我们便能改善面向全国学校的招募、培训与留任策略。

令人遗憾的是，我们根深蒂固的分裂正在拖延这些进步的步伐。[54] 近期一项调查发现，77% 的美国人认为美国「正处于前所未有的分裂状态」。但两极分化的加剧，不应成为我们彼此疏远的理由。相反，它们应迫使我们直面共同的问题。

我们并非如某些人所言，生活在一个「后种族社会」。[55] 面对种族不公，我们绝不能继续把头埋进沙里。除非我们诚实面对不容忍、偏见，以及这些社会疾病如何影响我们彼此相待的方式，否则不义将继续缠身。但我们的子孙后代值得更好的未来。

值此马丁·路德·金纪念日，以及此后的每一个日子，让我们承诺携手努力，打破僵化的现状。让我们继续建设一个更美好、更具包容性的国家；正如马丁·路德·金所言：「一个内部和睦共处，且能恪守良知的社会。」`,
      },
    ],
    notes: [
      { en: "acceptance speech", zh: "获奖演讲" },
      { en: "unarmed truth", zh: "无需武力加持的真理" },
      { en: "unconditional love", zh: "无条件的爱" },
      { en: "equity", zh: "公平；公正" },
      { en: "appalling", zh: "骇人的；可怕的" },
      { en: "confront", zh: "面对；正视" },
      { en: "miss out on", zh: "错过" },
      { en: "bridge the differences", zh: "弥合分歧" },
      { en: "legacy", zh: "遗产" },
      { en: "adherence", zh: "坚持；遵守" },
      { en: "polarization", zh: "两极分化" },
      { en: "compel", zh: "强迫，迫使" },
      { en: "head-on", zh: "正面地" },
      { en: "post-racial society", zh: "后种族社会" },
      { en: "bury one's head in the sand", zh: "逃避现实，视而不见" },
      { en: "intolerance", zh: "不容忍" },
      { en: "haunt", zh: "困扰；萦绕" },
      { en: "status quo", zh: "现状" },
      { en: "inclusive", zh: "包容的" },
      { en: "conscience", zh: "良知" },
    ],
  },
];

export const READING_QUESTIONS: Question[] = [
  {
    n: 26,
    unitId: "r-a",
    stem: "{{26}}",
    options: [],
    answer: "H",
    explain: "语法判断：空格位于 is it ______ too late to start 结构中，too late 之前应填入一个副词，用来修饰整个短语 too late，加强疑问语气。语义判断：首句指出长期规律锻炼有益健康，本句以 But 转折，提出疑问「但是不是开始运动太晚了呢？」填入 ever 能精准表达这种对「曾经/会不会有一个太晚的时候」的强调。",
  },
  {
    n: 27,
    unitId: "r-a",
    stem: "{{27}}",
    options: [],
    answer: "J",
    explain: "语法判断：空格位于形容词 early 之后，作介词 of 的宾语，需要填入一个名词。语义判断：本研究关注运动对健康最根本的影响指标。risk of early mortality 意为「早逝风险」，是流行病学和公共卫生研究中的核心评价指标，与后文降低百分比的数据直接关联。",
  },
  {
    n: 28,
    unitId: "r-a",
    stem: "{{28}}",
    options: [],
    answer: "G",
    explain: "语法判断：空格位于不定冠词 a 之后、介词 of 之前，需要填入一个可数名词的单数，作句子的表语。语义判断：句子主语 This 指代前文的「风险下降」这一事实。a drop of 32% to 35% 意为「下降了 32% 到 35%」，用 drop 来描述风险降低的幅度，准确且符合数据表达习惯。",
  },
  {
    n: 29,
    unitId: "r-a",
    stem: "{{29}}",
    options: [],
    answer: "C",
    explain: "语法判断：空格位于名词 diseases 之前，介词 of 之后，需要填入一个形容词作定语。语义判断：后文所举例子 heart disease and cancer（心脏病和癌症）均为典型的病程长、发展慢、难以彻底治愈的疾病。chronic diseases 是医学上描述此类疾病的固定术语，与 acute（急性的）相对。",
  },
  {
    n: 30,
    unitId: "r-a",
    stem: "{{30}}",
    options: [],
    answer: "E",
    explain: "语法判断：空格所在句为主谓宾结构，The authors 为主语，后接 that 引导的宾语从句，因此空格需要一个动词作谓语。语义判断：作者在阐述研究发现的同时，预见了公众可能产生的误解（认为可以推迟开始运动的时间）。使用 concede 表示作者先承认存在这种可能的错误解读，进而对其进行纠正和警告，体现了论证的严谨性。",
  },
  {
    n: 31,
    unitId: "r-a",
    stem: "{{31}}",
    options: [],
    answer: "F",
    explain: "语法判断：空格位于情态动词 should not 之后，需要填入一个动词原形。语义判断：前句指出延迟开始运动是错误解读，本句解释原因：坚持运动还有不应被忽视的其他身心益处。disregard 比 ignore 语气稍强，含有「故意漠视、不予考虑」之意，更强调这些益处的重要性不容忽略。",
  },
  {
    n: 32,
    unitId: "r-a",
    stem: "{{32}}",
    options: [],
    answer: "D",
    explain: "语法判断：空格位于名词 functioning 之前，需要填入一个形容词作定语。语义判断：该句列举坚持运动带来的具体健康益处。「更好的认知功能」是经过大量科学研究证实的、与长期规律运动密切相关的关键益处之一，与后文的「降低增重风险」构成身心两个维度的好处。",
  },
  {
    n: 33,
    unitId: "r-a",
    stem: "{{33}}",
    options: [],
    answer: "K",
    explain: "语法判断：空格位于系动词 is 和形容词 important 之间，需要填入一个副词来修饰 important。语义判断：控制体重的重要性在「全球肥胖流行病」这一特定且严峻的背景下被凸显出来。particularly 准确地表达了在此特定背景下控制体重的重要性。",
  },
  {
    n: 34,
    unitId: "r-a",
    stem: "{{34}}",
    options: [],
    answer: "L",
    explain: "语法判断：空格位于指示代词 those 之后，需要填入一个复数名词。语义判断：前文提到「年轻时养成运动的习惯」，那么你更有可能在日后保持这些行为模式或习惯。patterns 在这里比 habits 含义更广，涵盖了规律运动这种行为所形成的生活模式，与 keep up（保持）搭配恰当。",
  },
  {
    n: 35,
    unitId: "r-a",
    stem: "{{35}}",
    options: [],
    answer: "A",
    explain: "语法判断：空格位于选择性连词 or 之后，与 children 并列，需要填入一个表示人生阶段的名词。语义判断：when they are children or adolescents 意为「当他们还是儿童或青少年时」。从儿童期到青少年期是建立终生习惯的关键阶段，adolescents 与 children 在年龄上顺承，共同覆盖了「从小开始」这一理想情况的完整早期阶段。",
  },
  {
    n: 36,
    unitId: "r-b",
    stem: "It is now possible to fully automate a burger restaurant with little human supervision.",
    answer: "C",
    evidence: "Fully automated burger restaurants managed with minimal human oversight — where customers order at screens, pay electronically and eat food cooked and delivered by robots — are now a possibility.",
    explain: "题干关键信息 fully automate a burger restaurant 和 little human supervision 可将答案线索定位到 C 段。C 段最后一句提到，几乎无需人工监管、完全自动化的汉堡餐厅——顾客在屏幕上下单、电子支付，吃出机器人烹饪并递送的食物——如今已成为可能。fully automate a burger restaurant 对应原文的 Fully automated burger restaurants；with little human supervision 对应 managed with minimal human oversight，故 C 正确。",
  },
  {
    n: 37,
    unitId: "r-b",
    stem: "At a robot-powered US company, complicated tasks still have to be performed by humans.",
    options: [],
    answer: "H",
    evidence: "At the robot-powered US pizza-delivery company Zume, the more difficult jobs, such as topping pizzas, are still done by humans.",
    explain: "题干关键信息 a robot-powered US company 和 complicated tasks still have to be performed by humans 定位到 H 段。H 段第三句提到，在美国的机器人比萨递送公司 Zume，难度更大的工作，比如给比萨饼加配料，仍由人类完成。题干是对原文的同义转述。a robot-powered US company 对应原文 the robot-powered US pizza-delivery company Zume；complicated tasks still have to be performed by humans 对应 the more difficult jobs…are still done by humans。",
  },
  {
    n: 38,
    unitId: "r-b",
    stem: "More automation appears to be a certainty in industries eager to cut labour costs and raise profits.",
    options: [],
    answer: "D",
    evidence: "In an industry keen to slash labour costs and increase profits, further automation seems inevitable.",
    explain: "题干关键信息 More automation 和 eager to cut labour costs and raise profits 定位到 D 段。D 段第二句提到，在一个急于削减人工成本和提高利润的行业，进一步的自动化似乎不可避免。题干是对原文的同义转述。More automation appears to be a certainty 对应 further automation seems inevitable；eager to cut labour costs and raise profits 对应 an industry keen to slash labour costs and increase profits。",
  },
  {
    n: 39,
    unitId: "r-b",
    stem: "There are often front-page reports of failures in technological innovation of the restaurant industry.",
    options: [],
    answer: "L",
    evidence: "Embarrassing failures in restaurant tech frequently hit the headlines.",
    explain: "题干关键信息 front-page reports of failures 定位到 L 段。L 段首句提到，餐饮科技的尴尬失败案例常常登上头条。题干是对原文的同义转述。front-page reports of failures 对应 failures…frequently hit the headlines。",
  },
  {
    n: 40,
    unitId: "r-b",
    stem: "Robot-chef Flippy does not fear laborious work, nor does it make any complaints.",
    options: [],
    answer: "A",
    explain: "题干关键信息 Flippy does not fear laborious work 和 nor does it make any complaints 定位到 A 段。A 段首句指出，像大多数厨师一样，Flippy 并不辛苦。接着第四句指出，你不会听到 Flippy 抱怨或说话。题干是对原文的同义概括。does not fear laborious work 对应 is not afraid of hard work；nor does it make any complaints 对应 you won't hear Flippy complain or say anything。",
  },
  {
    n: 41,
    unitId: "r-b",
    stem: "Digital technology makes it possible for businesses to innovate restaurant models.",
    options: [],
    answer: "F",
    explain: "题干关键信息 Digital technology 和 innovate restaurant models 定位到 F 段。F 段最后一句引用酒店科技公司 Flyt 的首席执行官汤姆·韦弗的话指出，几百年来第一次，数字化让我们得以创造餐厅的新形态。题干是对原文的同义转述。digital 是原文重现；makes it possible for businesses to innovate restaurant models 对应原文的 allowing us to create new versions of restaurants。",
  },
  {
    n: 42,
    unitId: "r-b",
    stem: "Fondness for human warmth in catering to customers will give hope to employees who are afraid of losing jobs to robots.",
    options: [],
    answer: "M",
    explain: "题干关键信息 Fondness for human warmth in catering to customers 和 give hope to employees who are afraid of losing jobs 定位到 M 段。M 段首句提到，对于那些将自动化视为失业威胁的员工来说，这种对人类待客之道的依恋令人振奋。题干是对原文的同义转述。Fondness for human warmth in catering to customers 对应原文的 attachment to the human art of hospitality；will give hope to employees who are afraid of losing jobs to robots 对应 will be heartening for staff who see automation as a threat to jobs。",
  },
  {
    n: 43,
    unitId: "r-b",
    stem: "There is an acute shortage of experienced chefs in the catering industry and automated cooking is expected to fill the gap.",
    options: [],
    answer: "J",
    explain: "题干关键信息 an acute shortage of experienced chefs 和 automated cooking is expected to fill the gap 定位到 J 段。J 段指出，当前，餐饮业正面临技术精湛的厨师严重短缺的问题——据技能机构 People 1st 统计，缺口达 11000 人。「旨在让流程更易操作的自动化系统正试图填补这一空缺。」《餐厅》杂志编辑斯特凡·乔姆卡说道。题干是对原文的同义概括。",
  },
  {
    n: 44,
    unitId: "r-b",
    stem: "Over the coming decade, many jobs in traditional restaurants will disappear due to robot delivery.",
    options: [],
    answer: "O",
    explain: "题干关键信息 Over the coming decade 和 jobs…disappear due to robot delivery 定位到 O 段。O 段第二句指出，在接下来的十年里，传统实体餐厅的工作岗位必然会减少，尤其是因为自动化会促进其快速增长竞争对手——外卖业务的发展。题干是对原文的同义转述。many jobs in traditional restaurants will disappear 对应原文的 jobs will go in conventional bricks-built restaurants。",
  },
  {
    n: 45,
    unitId: "r-b",
    stem: "According to an expert in AI and robotics, it may be quite some time before a master robot-chef appears.",
    options: [],
    answer: "G",
    evidence: "It'll probably be a very long time before we see a five-star robot-chef, says Noel Sharkey, professor of AI and robotics at the University of Sheffield.",
    explain: "由题干关键信息 an expert in AI and robotics 和 quite some time before a master robot-chef appears 定位到 G 段。G 段前两句提到，如果说街头快餐已准备好迎接自动化，那么其对高端餐厅的影响可能会更微妙、更缓慢。谢菲尔德大学人工智能与机器人学教授诺埃尔·沙基说道：「我们可能要很久之后才会看到五星级的机器人厨师。」由此可知，题干是对原文的同义转述。",
  },
  {
    n: 46,
    unitId: "r-c1",
    stem: "What often happens when people are eager to pursue individual success?",
    stemZh: "当人们急于追求个人成功时，常常会发生什么？",
    options: [
      { key: "A", en: "They lack a shoulder to cry on.", zh: "他们缺少可以倚靠哭诉的肩膀。" },
      { key: "B", en: "They have no soul to confide in.", zh: "他们没有能够倾诉衷肠的灵魂。" },
      { key: "C", en: "They cannot find reliable friends.", zh: "他们找不到可靠的朋友。" },
      { key: "D", en: "They ignore their ties with friends.", zh: "他们忽视与朋友的联系。" },
    ],
    answer: "D",
    explain: "根据题干信息词 are eager to pursue individual success 可将答案线索定位至第一段。第一段第二句提到，我们急于追求个人成功的路上，往往会失去朋友。由果推因，人们之所以会失去朋友，是因为在急于追求个人成功的过程中，忽视了与朋友的联系，与朋友渐行渐远，进而失去他们，D 项与此描述相符，故为正确答案。A、B、C 三项描述的是一种「没有朋友」的状态，而文章描述的是在追求成功的过程中，从「有朋友」到「失去朋友」的动态变化，这三项与文章内容不符，故排除。",
  },
  {
    n: 47,
    unitId: "r-c1",
    stem: "What does the author advise people to do in their pursuit of radical individualism?",
    stemZh: "对于追求极端个人主义，作者建议人们做什么？",
    options: [
      { key: "A", en: "Reexamine its detrimental effects.", zh: "重新审视其有害影响。" },
      { key: "B", en: "Shrug off the loss of their loved ones.", zh: "对失去挚爱之人满不在乎。" },
      { key: "C", en: "Avoid the chaos and turmoil involved.", zh: "避免其中涉及的混乱和纷扰。" },
      { key: "D", en: "Remove aggressive obstacles in the way.", zh: "清除（前进）道路上的巨大障碍。" },
    ],
    answer: "A",
    explain: "对于追求极端个人主义，作者在第三段最后一句建议人们，必须重新审视极端个人自由所带来的危害。A 项 Reexamine its detrimental effects 是对原文中 reevaluate the harm 的同义转述，故为正确答案。B 项是作者所批判的社会现象，且与题干所问无关；C 项和 D 项是利用原文中出现过的单词（chaos、turmoil、aggressive obstacle）设置的干扰项，并不是作者的建议，故排除。",
  },
  {
    n: 48,
    unitId: "r-c1",
    stem: "What is American society's assumption of personal achievement?",
    stemZh: "美国社会对于个人成就的假设是什么？",
    options: [
      { key: "A", en: "It is to be duly celebrated and highly commended.", zh: "它理应得到颂扬和高度称赞。" },
      { key: "B", en: "It is a sure way to fulfill a person's dream.", zh: "它是实现个人梦想的可靠途径。" },
      { key: "C", en: "It revolves around an individualistic culture.", zh: "它围绕着个人主义文化展开。" },
      { key: "D", en: "It reflects a person's exceptional endeavor.", zh: "它反映了一个人非凡的努力。" },
    ],
    answer: "D",
    explain: "根据题干信息词 assumption of personal achievement 可将答案线索定位至第五段。第五段第二句提到，这一 assumption（假设），并通过 that 引导的同位语从句对句其进行了解释，即 that winning or succeeding is a consequence of working harder than the next person（获胜或成功是比别人更努力的结果），D 项符合此描述，故为正确答案。A 项是描述对个人成就颂扬和称赞的社会行为，而非假设；B 项原文未提及；C 项是个人成就产生的文化背景，而非假设，故排除。",
  },
  {
    n: 49,
    unitId: "r-c1",
    stem: "What is preached in many success stories?",
    stemZh: "许多成功故事宣扬什么观点？",
    options: [
      { key: "A", en: "Attaching importance to academic gains on the road to success.", zh: "在追求成功的道路上重视学业收获。" },
      { key: "B", en: "Investing one's time in work instead of connecting with friends.", zh: "把时间花在工作上，而不是与朋友交往上。" },
      { key: "C", en: "Trying to strengthen friendships in one's pursuit of personal success.", zh: "在追求个人成功时尽力巩固友谊。" },
      { key: "D", en: "Excelling in academic performance to get into a prestigious college.", zh: "在学业上出类拔萃，以考入一所名牌大学。" },
    ],
    answer: "B",
    explain: "根据题干信息词 preached in many success stories 可将答案线索定位至第六段。第六段第三句提到，It's preached in many success stories，分析上下文可知，it 指代第二句中所提到的 a sentiment（一种观点），即「别担心失去友谊，只要专心学习，考上大学就行。从长远来看，这才是最重要的。」该观点同时与第一句所提到的 the concept（观念）「成功路上难免失去朋友」相对应，两者都认为成功比友谊更重要，人们应将更多时间花在学业或工作上。此外，该段最后四句通过一问一答的形式再次阐释了这一观点，其中最后两句提到，花时间经营人际关系？不如把时间花在工作上。B 项是对这两句话的同义转述，故为正确答案。A 项和 D 项仅为具体例子，且都只提到了学业，未提到友谊，不能完整概括文中观点，故排除。C 项与文章所宣扬的观点相悖，故排除。",
  },
  {
    n: 50,
    unitId: "r-c1",
    stem: "What can we infer from the passage regarding the pursuit of success?",
    stemZh: "关于对成功的追求，我们可以从文章中推断出什么？",
    options: [
      { key: "A", en: "No one can succeed without pushing limits.", zh: "不突破极限，没人能取得成功。" },
      { key: "B", en: "No one can afford to neglect close friends.", zh: "没有人能承受得起忽视挚友的代价。" },
      { key: "C", en: "Collectivism is superior to individualism.", zh: "集体主义优于个人主义。" },
      { key: "D", en: "Success experts often lead people to ruin.", zh: "成功学专家往往把人引向毁灭。" },
    ],
    answer: "B",
    explain: "通读全文可知，原文旨在强调人们在追求成功时不要以牺牲友谊为代价的观点。其中，第八段提到，我们不能对失去友谊这件事无动于衷，因为友谊是我们的精神支柱；最后一段提到，在追求成功的道路上，有人支持你、爱你，这远比任何最终结果都重要。由此可以看出，友谊在追求成功的路上至关重要，不容忽视，否则会付出代价，B 项与原文表述相符，故为正确答案。原文只是提到要突破极限，但并未提及突破极限是成功的必要条件，故排除 A 项。原文只是批到了极端个人自由所带来的危害，以此来强调个人在追求成功时不要忽视集体（朋友）的支持，但并未得出「集体主义优于个人主义」的结论，故排除 C 项。原文只是提到一些成功学专家会鼓动人们接受失去朋友，但并未提到他们往往会把人引向毁灭，D 项属于过度推断，故排除。",
  },
  {
    n: 51,
    unitId: "r-c2",
    stem: "What does the author think about today's America?",
    stemZh: "作者如何看待今天的美国？",
    options: [
      { key: "A", en: "It is struggling to transform fiction into reality.", zh: "美国正竭力将虚构转化为现实。" },
      { key: "B", en: "It has been the focus of many vital conversations.", zh: "美国已成为许多关键议题的焦点。" },
      { key: "C", en: "It still has a long way to go before equity can be truly realized.", zh: "美国要真正实现公平，仍任重道远。" },
      { key: "D", en: "It has got to a point where people disagree on nearly every issue.", zh: "美国已进入几乎所有问题都存在分歧的境地。" },
    ],
    answer: "C",
    explain: "根据题干信息词 today's America 可将答案线索定位至第二、三段。第二段首句提到「我们的社会却仍在为辨别虚实、厘清事实而挣扎」，并指出「美国正站在十字路口上」，而「对公平的追求，正是这些关键议题的核心所在」。第三段进一步通过数据说明不公平现象带来的严重后果。这些都暗示公平的真正实现任重道远，故 C 正确。A 是对原文 struggling to separate truth from fantasy 的曲解；B 是现象描述，而不是作者的核心观点；D 说法过于绝对，故排除。",
  },
  {
    n: 52,
    unitId: "r-c2",
    stem: "What do we learn from the passage about black students in the past 20 years?",
    stemZh: "从文章中我们了解到过去二十年里有关黑人学生的什么信息？",
    options: [
      { key: "A", en: "They have been unfairly treated regarding higher education.", zh: "他们在高等教育方面受到了不公正对待。" },
      { key: "B", en: "They have been battling hard to address equity issues.", zh: "他们一直在努力抗争以解决公平问题。" },
      { key: "C", en: "They have boosted their lifetime incomes by billions of dollars.", zh: "他们的终身收入增加了数十亿美元。" },
      { key: "D", en: "They have come to see the consequences of racial discrimination.", zh: "他们开始意识到种族歧视带来的后果。" },
    ],
    answer: "A",
    explain: "根据题干信息词 black students in the past 20 years 可将答案线索定位至第三段。第三段提到花旗银行 2020 年的一份报告指出，若过去二十年来高等教育领域的公平问题得到妥善解决，「黑人学生的终身收入本可以增加 900 亿至 1130 亿美元」。这反向说明他们因不公平而遭受了巨大的经济损失。A 项是这一数据隐含的核心事实，故为正确答案。B 项文中未提及；C 项与原文虚拟语气（could have increased）矛盾；D 项并非文中直接说明的内容，故排除。",
  },
  {
    n: 53,
    unitId: "r-c2",
    stem: "How can Americans bridge the differences that divide them?",
    stemZh: "美国人如何弥合他们之间的分歧？",
    options: [
      { key: "A", en: "By dealing with the thorny issues confronting them.", zh: "通过解决他们面临的棘手问题。" },
      { key: "B", en: "By seizing every chance to enhance racial harmony.", zh: "通过抓住每一个促进种族和谐的机会。" },
      { key: "C", en: "By continuing to pursue Martin Luther King Jr.'s cause.", zh: "通过继续追寻马丁·路德·金的事业。" },
      { key: "D", en: "By striving to identify exceedingly valuable opportunities.", zh: "通过努力找到极其宝贵的机遇。" },
    ],
    answer: "C",
    explain: "根据题干信息词 bridge the differences 可将答案线索定位至四、五段。第四段末尾指出「只要传承马丁·路德·金的精神遗产，我们便能让国家重新踏上通往真正公平的道路」。第五段进一步阐述了如何通过理解历史、真诚对话来实现这一目标。全文也以继承马丁·路德·金的精神为行动号召。C 项准确概括了这一途径，故为正确答案。A 项过于宽泛，未表明「如何」处理；B 项在文中没有提及；D 项是对原文 missing out on valuable opportunities 的误解，故排除。",
  },
  {
    n: 54,
    unitId: "r-c2",
    stem: "How do most Americans view America as a nation according to a recent survey?",
    stemZh: "根据近期的一项调查，大多数美国人如何看待美国这个国家？",
    options: [
      { key: "A", en: "It is compelled to address its historical social issues.", zh: "美国被迫解决其历史社会问题。" },
      { key: "B", en: "It is delaying advancements toward racial equality.", zh: "美国在推进种族平等等进程中不断拖延。" },
      { key: "C", en: "It has kept itself from polarization.", zh: "美国避免了自身的两极分化。" },
      { key: "D", en: "It has become increasingly split.", zh: "美国的分裂程度日益加剧。" },
    ],
    answer: "D",
    explain: "根据题干信息词 most Americans 和 a recent survey 可将答案线索定位至第七段。第七段明确提到：「近期一项调查发现，77% 的美国人认为，美国『正处于前所未有的分裂状态』。」这直接对应选项 D，故该选项为正确答案。选项 A 是作者观点，而不是调查的结果；选项 B 是作者对现象的分析，也不是调查的结果；选项 C 与调查结果完全相反，故排除。",
  },
  {
    n: 55,
    unitId: "r-c2",
    stem: "What does the author suggest Americans do?",
    stemZh: "作者建议美国人做什么？",
    options: [
      { key: "A", en: "Ensure the wellbeing of their children and grandchildren.", zh: "保障子孙后代的福祉。" },
      { key: "B", en: "Make joint efforts to tackle the nation's equity issues.", zh: "共同努力解决美国的公平问题。" },
      { key: "C", en: "Restrain their intolerance and discrimination.", zh: "抑制他们的不容忍与歧视。" },
      { key: "D", en: "Restore social order for a harmonious nation.", zh: "恢复社会秩序，建设一个和谐国家。" },
    ],
    answer: "B",
    explain: "根据题干信息词 the author suggest Americans do 及「题文同序」原则可将答案线索定位至最后两段。倒数第二段第二句提到，面对种族不公，我们绝不能继续把头埋进沙里。同时，最后一段也提到「让我们承诺携手努力，打破僵化的现状」。这是在号召集体行动来解决美国的公平问题。选项 B 是对这两段的合理概括，故为正确答案。选项 A 是目标，而非具体行动建议；选项 C 是行动的一部分，但不够全面；选项 D 中的「建设一个和谐国家」只是作者想要实现的愿景，并非重点行动建议，故排除。",
  },
];
