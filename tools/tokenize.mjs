// Tô màu file bằng grammar TextMate thật của VS Code (đã cài trên máy) + một theme VS Code (JSON).
// tokenize(theme, file) → [[ [text, "#RRGGBB", fontStyle], ... ] mỗi dòng ]
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import tm from "vscode-textmate";
import onig from "vscode-oniguruma";

const here = path.dirname(new URL(import.meta.url).pathname);
await onig.loadWASM(fs.readFileSync(path.join(here, "node_modules/vscode-oniguruma/release/onig.wasm")).buffer);

const dirs = ["/usr/share/code/resources/app/extensions", path.join(os.homedir(), ".vscode/extensions")].filter(fs.existsSync);
const scopeToFile = {}, langToScope = {}, extToScope = {};
for (const d of dirs)
  for (const e of fs.readdirSync(d)) {
    let p;
    try { p = JSON.parse(fs.readFileSync(path.join(d, e, "package.json"), "utf8")); } catch { continue; }
    const c = p.contributes || {};
    for (const g of c.grammars || []) {
      if (!g.scopeName || !g.path) continue;
      scopeToFile[g.scopeName] ??= path.join(d, e, g.path);
      if (g.language && (!langToScope[g.language] || /embedded/.test(langToScope[g.language]))) langToScope[g.language] = g.scopeName;
    }
    for (const l of c.languages || []) for (const x of l.extensions || []) (extToScope[x.toLowerCase()] ??= () => langToScope[l.id]);
  }

export async function tokenize(theme, file) {
  const settings = [
    { settings: { foreground: theme.colors["editor.foreground"], background: theme.colors["editor.background"] } },
    ...theme.tokenColors.map((r) => ({ scope: r.scope, settings: r.settings })),
  ];
  const reg = new tm.Registry({
    onigLib: Promise.resolve({ createOnigScanner: (s) => new onig.OnigScanner(s), createOnigString: (s) => new onig.OnigString(s) }),
    loadGrammar: async (sc) => (scopeToFile[sc] ? tm.parseRawGrammar(fs.readFileSync(scopeToFile[sc], "utf8"), scopeToFile[sc]) : null),
  });
  reg.setTheme({ name: "t", settings });
  const cmap = reg.getColorMap();
  const g = await reg.loadGrammar(extToScope[path.extname(file)]?.());
  let st = tm.INITIAL;
  return fs.readFileSync(file, "utf8").replace(/\n$/, "").split("\n").map((line) => {
    const r = g.tokenizeLine2(line, st);
    st = r.ruleStack;
    const t = r.tokens, out = [];
    for (let i = 0; i < t.length; i += 2) out.push([line.slice(t[i], i + 2 < t.length ? t[i + 2] : line.length), cmap[(t[i + 1] >>> 15) & 0x1ff], (t[i + 1] >>> 11) & 0xf]);
    return out;
  });
}

// Đọc theme mặc định của VS Code (JSONC, có "include")
export function loadBuiltinTheme(file) {
  const dir = "/usr/share/code/resources/app/extensions/theme-defaults/themes/";
  const jsonc = (s) => {
    let o = "", i = 0, str = false;
    while (i < s.length) {
      const c = s[i];
      if (str) { o += c; if (c === "\\") { o += s[i + 1]; i += 2; continue; } if (c === '"') str = false; i++; continue; }
      if (c === '"') { str = true; o += c; i++; continue; }
      if (c === "/" && s[i + 1] === "/") { while (i < s.length && s[i] !== "\n") i++; continue; }
      if (c === "/" && s[i + 1] === "*") { i = s.indexOf("*/", i) + 2; continue; }
      o += c; i++;
    }
    return JSON.parse(o.replace(/,(\s*[}\]])/g, "$1"));
  };
  const t = jsonc(fs.readFileSync(dir + file, "utf8"));
  const base = t.include ? loadBuiltinTheme(t.include.replace("./", "")) : { colors: {}, tokenColors: [] };
  return { colors: { ...base.colors, ...t.colors }, tokenColors: [...base.tokenColors, ...(t.tokenColors || [])] };
}
