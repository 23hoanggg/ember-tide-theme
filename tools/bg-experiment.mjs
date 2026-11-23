// Thử nghiệm: giữ nguyên màu chữ Ember Tide, chỉ giảm độ ngả xanh (chroma) của dải nền. So với Dark Modern.
//   node tools/bg-experiment.mjs <out.png>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { dark } from "../palette.mjs";
import { vscodeThemeFor } from "../src/vscode.mjs";
import { tokenize, loadBuiltinTheme } from "./tokenize.mjs";
import { oklch, fromOklch, contrast } from "../scripts/lib/color.mjs";

const here = path.dirname(new URL(import.meta.url).pathname);
const sample = path.join(here, "samples/pdf.service.ts");
const LADDER = ["bgDeep", "bgPanel", "bg", "bgFloat", "bgLine", "bgInput", "bgTabBar", "bgTabHover", "bgTab", "bgHover", "bgActive", "bgInfo", "border", "borderSoft"];
const desat = (hex, k) => { const [L, C, H] = oklch(hex); return fromOklch(L, C * k, H); };
export const withBg = (k, fg) => {
  const ui = { ...dark.ui };
  for (const key of LADDER) ui[key] = desat(dark.ui[key], k);
  if (fg) Object.assign(ui, fg);
  return { ...dark, ui };
};
const range = (toks) => toks.slice(10, 33);
const panels = [];
const dm = loadBuiltinTheme("dark_modern.json"), c = dm.colors;
panels.push({ title: "VS Code Dark Modern (tham chiếu)", tokens: range(await tokenize(dm, sample)), active: 9,
  ui: { bg: c["editor.background"], bgDeep: c["titleBar.activeBackground"], bgPanel: c["sideBar.background"], bgLine: "#2A2A2A", fg: c["editor.foreground"], fgMuted: "#9D9D9D", fgSoft: "#CCCCCC", fgBright: "#FFFFFF", fgDim: "#6E7681", fgActiveLineNr: "#CCCCCC", listSelected: "#37373D" } });
for (const [title, P] of [
  ["Ember Tide hiện tại — nền ngả xanh (chroma nền 0.023)", dark],
  ["Thử A — nền ngả xanh nhẹ (chroma ×0.45)", withBg(0.45)],
  ["Thử B — nền gần trung tính (chroma ×0.2) + chữ thường trung tính", withBg(0.2, { fg: "#E2E4E8", fgSoft: "#CDD1D7" })],
]) {
  const theme = vscodeThemeFor(P);
  panels.push({ title: `${title}  ·  nền ${P.ui.bg}`, tokens: range(await tokenize(theme, sample)), active: 9, ui: P.ui });
}
const spec = path.join(path.dirname(process.argv[2]), "bg-spec.json");
fs.writeFileSync(spec, JSON.stringify({ panels, width: 820 }));
execFileSync("python3", [path.join(here, "render.py"), spec, process.argv[2]]);
for (const p of panels.slice(1)) console.log(p.title.split("  ·")[0].padEnd(70), "nền", p.ui.bg, "| L/C", oklch(p.ui.bg).map((x) => x.toFixed(3)).slice(0, 2).join("/"));
