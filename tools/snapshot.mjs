// Golden snapshot: tô màu mọi file trong tools/samples bằng grammar VS Code thật + theme đã build,
// rồi so với test/golden/<file>.txt (mỗi dòng nguồn = một mảng JSON các run [text, "#HEX", fontStyle]).
//   node tools/snapshot.mjs            → so sánh, in file lệch (exit 1 nếu lệch)
//   node tools/snapshot.mjs --update   → ghi lại golden
//   node tools/snapshot.mjs --audit    → in token rơi về màu mặc định (editor.foreground) kèm scope, để rà soát
// fontStyle: bit 1 = italic, 2 = bold, 4 = underline, 8 = strikethrough (theo vscode-textmate).
import fs from "node:fs";
import path from "node:path";
import { tokenize, scopeFor, hasGrammar } from "./tokenize.mjs";

const here = path.dirname(new URL(import.meta.url).pathname), root = path.join(here, "..");
export const SAMPLES = path.join(here, "samples"), GOLDEN = path.join(root, "test", "golden");
export const THEME = path.join(root, "themes", "ember-tide-color-theme.json");

export const loadTheme = (file = THEME) => JSON.parse(fs.readFileSync(file, "utf8"));

// Danh sách mẫu: [{ file, scope }] — scope = null nếu máy không có grammar cho file đó.
export function samples() {
  return fs.readdirSync(SAMPLES).filter((f) => fs.statSync(path.join(SAMPLES, f)).isFile()).sort().map((file) => {
    const scope = scopeFor(path.join(SAMPLES, file));
    return { file, scope: hasGrammar(scope) ? scope : null };
  });
}

export async function render(theme, file) {
  const lines = await tokenize(theme, path.join(SAMPLES, file));
  return `# ${file}\n` + lines.map((runs) => JSON.stringify(runs)).join("\n") + "\n";
}

export const goldenPath = (file) => path.join(GOLDEN, file.replace(/^\./, "_dot") + ".txt");

async function main(args) {
  const theme = loadTheme();
  if (args.includes("--audit")) return audit(theme);
  const update = args.includes("--update");
  fs.mkdirSync(GOLDEN, { recursive: true });
  let bad = 0;
  for (const { file, scope } of samples()) {
    if (!scope) { console.log(`- ${file}: không có grammar, bỏ qua`); continue; }
    const out = await render(theme, file), gp = goldenPath(file);
    if (update) { fs.writeFileSync(gp, out); console.log(`✔ ${path.relative(root, gp)}  (${scope})`); continue; }
    const old = fs.existsSync(gp) ? fs.readFileSync(gp, "utf8") : null;
    if (old !== out) { bad++; console.log(`✘ ${file}: ${old === null ? "chưa có golden" : "lệch golden"}`); }
  }
  if (!update) { console.log(bad ? `${bad} file lệch — chạy với --update nếu thay đổi là cố ý` : "golden khớp"); process.exitCode = bad ? 1 : 0; }
}

// Token có chữ/số nhưng vẫn mang màu editor.foreground → in kèm scope trong cùng để rà soát.
async function audit(theme) {
  const fg = theme.colors["editor.foreground"].toUpperCase();
  for (const { file, scope } of samples()) {
    if (!scope) continue;
    const lines = await tokenize(theme, path.join(SAMPLES, file), { scopes: true });
    const hits = [];
    lines.forEach((runs, i) => {
      for (const [text, color, , scopes] of runs)
        if (color.toUpperCase() === fg && /[A-Za-z0-9_$@]/.test(text)) hits.push(`  ${String(i + 1).padStart(3)}  ${JSON.stringify(text.trim()).padEnd(28)} ${scopes.slice(1).join(" > ") || scopes[0]}`);
    });
    console.log(`## ${file} (${scope}) — ${hits.length} token màu mặc định`);
    if (hits.length) console.log(hits.join("\n"));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) await main(process.argv.slice(2));
