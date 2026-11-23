// Đo & vẽ: Dark Modern vs Ember Tide hiện tại vs Ember Tide đã chỉnh (nền + variable/property)
import path from "node:path"; import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { dark } from "../palette.mjs"; import { vscodeThemeFor } from "../src/vscode.mjs";
import { tuned } from "./tune-dark.mjs"; import { measure } from "./compare.mjs"; import { tokenize, loadBuiltinTheme } from "./tokenize.mjs";
const here = path.dirname(new URL(import.meta.url).pathname);
const dm = loadBuiltinTheme("dark_modern.json"), P = tuned(); // thử nghiệm: truyền groups/boost vào tuned()
const rows = [["VS Code Dark Modern", dm], ["Ember Tide (palette hiện tại)", vscodeThemeFor(dark)], ["Ember Tide (thử nghiệm)", vscodeThemeFor(P)]];
for (const [n, t] of rows) { const m = await measure(t); console.log(n.padEnd(22), m.bg, `nền C ${m.bgC.toFixed(3)}`, `| chữ L ${m.L.toFixed(3)} C ${m.C.toFixed(3)} ${m.contrast.toFixed(1)}:1 | có màu ${(m.colored * 100).toFixed(0)}%`); }
if (process.argv[2]) {
  const sample = path.join(here, "samples/pdf.service.ts"), c = dm.colors;
  const panels = [{ title: "VS Code Dark Modern", tokens: (await tokenize(dm, sample)).slice(10, 33), active: 9,
    ui: { bg: c["editor.background"], bgDeep: c["titleBar.activeBackground"], bgPanel: c["sideBar.background"], bgLine: "#2A2A2A", fgMuted: "#9D9D9D", fgSoft: "#CCCCCC", fgBright: "#FFFFFF", fgDim: "#6E7681", fgActiveLineNr: "#CCCCCC", listSelected: "#37373D" } }];
  for (const [title, PP] of [["Ember Tide hiện tại", dark], ["Ember Tide (thử nghiệm)", P]])
    panels.push({ title, tokens: (await tokenize(vscodeThemeFor(PP), sample)).slice(10, 33), active: 9, ui: PP.ui });
  const spec = process.argv[2] + ".json"; fs.writeFileSync(spec, JSON.stringify({ panels, width: 820 }));
  execFileSync("python3", [path.join(here, "render.py"), spec, process.argv[2]]);
}
