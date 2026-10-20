/**
 * 生词本写入路径的确定性校验。
 *
 * 为什么单独跑这个：浏览器里点按钮验证过不了 —— 元素坐标在多次查询之间对不上，
 * 点击经常落到固定底栏上（点「收进生词本」实际点中了 PLAN 导航）。
 * 与其跟一个不可信的点击较劲，不如把真正要保证的那条链路
 * ——词库词条 → 落库 → 重复收不新增 → 不顶掉真题出处 —— 用内存 IndexedDB 跑一遍。
 *
 * 跑法：npx tsx scripts/verify-vocab-store.ts
 */

import "fake-indexeddb/auto";

import { db } from "../src/lib/db";
import { addVocabEntry, addWordbookEntry, getVocabEntries, reviewVocabEntry } from "../src/lib/repo";
import { WORDBOOK_UNITS } from "../src/lib/wordbooks";

let checks = 0;
let failures = 0;

function assert(condition: boolean, label: string): void {
  checks += 1;
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${label}`);
  }
}

function section(title: string): void {
  console.log(`\n${title}`);
}

async function main(): Promise<void> {
  const economy = WORDBOOK_UNITS.find((w) => w.word === "economy");
  const restore = WORDBOOK_UNITS.find((w) => w.word === "restore");
  assert(Boolean(economy), "词库里应能取到 economy");
  assert(Boolean(restore), "词库里应能取到 restore");
  if (!economy || !restore) return;

  /* --------------------------------------------------- 1. 词库词条能落库 */

  section("1. 词库词条收进生词本");
  const added = await addWordbookEntry(economy);
  checks += 1;
  if (added.word !== "economy") {
    failures += 1;
    console.error("  ✗ 词形写错");
  } else {
    console.log("  ✓ 词形写入正确");
  }
  assert(added.sourceKind === "wordbook", "来源应标为 wordbook");
  assert(added.sourcePaperId === "", "词库来源不该带卷子 id");
  assert(
    added.sourceLabel === "核心词汇 · Unit 1 商业经济",
    `出处文字应为可读说明，实际「${added.sourceLabel}」`,
  );
  assert(added.meaning === "n.经济,经济体;节约", `释义应预填自词条，实际「${added.meaning}」`);
  assert(added.reviewCount === 0, "新收的词复习次数应为 0");
  assert(!added.sourceQuestionNo, "词库来源不应有题号");

  const rows = await getVocabEntries();
  assert(rows.length === 1, `库里应只有 1 条，实际 ${rows.length}`);
  assert(rows[0].sourceKind === "wordbook", "读回来时来源仍是 wordbook");

  /* --------------------------------------------------- 2. 重复收只合并 */

  section("2. 同一个词再收一次只合并，不新增");
  await reviewVocabEntry(added.id);
  const again = await addWordbookEntry(economy);
  assert(again.id === added.id, "重复收应复用原条目 id");
  assert(again.reviewCount === 1, "重复收不能清零复习次数");
  assert(again.createdAt === added.createdAt, "重复收不能改写首次记录时间");
  assert((await getVocabEntries()).length === 1, "重复收后仍然只有 1 条");

  /* --------------------------------- 3. 词库释义不能覆盖学生写的释义 */

  section("3. 词库收词不覆盖学生自己写的释义");
  await db.vocab.update(added.id, { meaning: "我自己写的：市场经济" });
  const kept = await addWordbookEntry(economy);
  assert(kept.meaning === "我自己写的：市场经济", "学生写的释义必须保留");
  assert(kept.reviewCount === 1, "复习次数仍然保留");

  /* --------------------------------------- 4. 词库不能顶掉真题出处 */

  section("4. 真题记过的词再从词库收，出处不能被改写");
  const fresh = await addVocabEntry({
    word: "restore",
    meaning: "我自己从听力里记的",
    sourcePaperId: "2025-12-set1",
    sourceQuestionNo: 3,
    sourceLabel: "2025 年 12 月 · 第一套 · 第 3 题",
  });
  assert(fresh.sourceKind === "paper", "真题来源缺省应是 paper");
  const fromBook = await addWordbookEntry(restore);
  assert(fromBook.id === fresh.id, "同一个词不应新开一条");
  assert(fromBook.sourceKind === "paper", "出处不能被词库改写");
  assert(fromBook.sourceQuestionNo === 3, "题号不能被词库顶掉");
  assert(fromBook.meaning === "我自己从听力里记的", "学生自己记的释义不能被词库覆盖");

  /* --------------------------------------------------- 5. 词库无释义 */

  section("5. 词库条目没释义时存空，而不是塞一堆 undefined");
  const noSense = WORDBOOK_UNITS.find((w) => w.word === "target");
  assert(Boolean(noSense), "词库里应能取到 target");
  if (noSense) {
    const one = await addWordbookEntry(noSense);
    assert(typeof one.meaning === "string" && one.meaning.length > 0, "多词性词条也要给出释义");
  }

  /* --------------------------------------------------------------- 收尾 */

  const finalRows = await getVocabEntries();
  assert(finalRows.every((r) => r.sourceKind === "paper" || r.sourceKind === "wordbook"), "来源只能是这两个值");
  assert(
    finalRows.every((r) => typeof r.reviewCount === "number" && r.reviewCount >= 0),
    "复习次数必须是非负数字",
  );

  console.log(
    failures === 0
      ? `\n✅ 词库写入校验：${checks} 项全部通过\n`
      : `\n❌ 词库写入校验：${failures}/${checks} 项未通过\n`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
