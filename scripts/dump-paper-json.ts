/**
 * 把某一套真题导出成 JSON —— 用来跟原始 PDF 逐字比对。
 *
 * 用法：tsx scripts/dump-paper-json.ts 2025-12-set1 > .tmp/import/paper.json
 */
import { PAPERS } from "../src/lib/papers";

const id = process.argv[2];
if (!id) {
  console.error("用法：tsx scripts/dump-paper-json.ts <paperId>");
  process.exit(1);
}

const paper = PAPERS.find((p) => p.id === id);
if (!paper) {
  console.error(`没有这套卷子：${id}`);
  console.error(`库里有：${PAPERS.map((p) => p.id).join(", ")}`);
  process.exit(1);
}

console.log(JSON.stringify(paper, null, 2));
