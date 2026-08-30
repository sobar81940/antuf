/**
 * One-off maintenance script.
 *
 * Mongoose 8 types make `mongoose.models.X || mongoose.model(...)` resolve to a
 * union of `Model<...>` overloads, which TypeScript reports as
 * "This expression is not callable" (TS2349) at every `Model.find()` call site.
 *
 * This script appends an explicit `as mongoose.Model<any>` assertion to the
 * default export of every schema file under `models/`, which is the pattern the
 * rest of the codebase (untyped route handlers) already assumes.
 *
 * Usage: node scripts/fix-model-exports.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MODELS_DIR = new URL("../models/", import.meta.url).pathname;

// `mongoose.models.Foo || mongoose.model("Foo", FooSchema)` or a bare
// `mongoose.model("Foo", FooSchema)` export.
const EXPORT_PATTERN =
  /export default\s+((?:mongoose\.models\.\w+\s*\|\|\s*)?mongoose\.model\([^()]*\))\s*;/;

let changed = 0;

for (const fileName of readdirSync(MODELS_DIR)) {
  if (!fileName.endsWith(".ts")) continue;

  const filePath = join(MODELS_DIR, fileName);
  const source = readFileSync(filePath, "utf8");

  if (source.includes("as mongoose.Model<any>")) continue;

  const match = source.match(EXPORT_PATTERN);
  if (!match) {
    console.warn(`skipped (no plain default export found): ${fileName}`);
    continue;
  }

  const replacement = `export default (${match[1]}) as mongoose.Model<any>;`;
  writeFileSync(filePath, source.replace(EXPORT_PATTERN, replacement), "utf8");
  changed += 1;
  console.log(`updated: ${fileName}`);
}

console.log(`\n${changed} model file(s) updated.`);
