#!/usr/bin/env -S npx tsx
/**
 * 把一套卷子的「逐题题干区间」和「题干文字」导出来，给核对脚本用。
 *
 * 用法：npx tsx scripts/dump-question-stems.ts <paperId> > /tmp/stems.json
 */
import { PAPERS } from "../src/lib/papers/index";

const paperId = process.argv[2];
const paper = PAPERS.find((p) => p.id === paperId);
if (!paper) {
  console.error(`找不到这套卷子：${paperId}`);
  process.exit(1);
}

const units = paper.listeningUnits
  .filter((u) => (u.questionWindows ?? []).length > 0)
  .map((u) => ({ id: u.id, qw: u.questionWindows ?? [] }));

const questions = paper.questions.map((q) => ({ n: q.n, stem: q.stem }));

console.log(JSON.stringify({ paperId, units, questions }, null, 2));
