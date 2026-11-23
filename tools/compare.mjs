// So sánh "cường độ màu" thực tế giữa các theme, tính theo diện tích ký tự trên code mẫu.
//   node tools/compare.mjs                  (Dark Modern vs Ember Tide vs các biến thể)
import fs from "node:fs";
import path from "node:path";
import { tokenize, loadBuiltinTheme } from "./tokenize.mjs";
import { oklch, contrast } from "../scripts/lib/color.mjs";
import { vscodeThemes } from "../src/vscode.mjs";

const here = path.dirname(new URL(import.meta.url).pathname);
const samples = fs.readdirSync(path.join(here, "samples")).map((f) => path.join(here, "samples", f));
const themes = [["VS Code Dark Modern", loadBuiltinTheme("dark_modern.json")], ...vscodeThemes.filter(({ P }) => P.type === "dark").map(({ P, theme }) => [P.name, theme])];
if (process.env.EXTRA) for (const f of process.env.EXTRA.split(",")) themes.push([path.basename(f), JSON.parse(fs.readFileSync(f, "utf8"))]);

export async function measure(theme) {
  const bg = theme.colors["editor.background"];
  let n = 0, L = 0, C = 0, cr = 0, colored = 0;
  for (const f of samples)
    for (const line of await tokenize(theme, f))
      for (const [text, color] of line) {
        const k = text.replace(/\s/g, "").length;
        if (!k) continue;
        const [l, c] = oklch(color);
        n += k; L += l * k; C += c * k; cr += contrast(color, bg) * k;
        if (c > 0.05) colored += k;
      }
  const [bl, bc] = oklch(bg);
  return { bg, bgL: bl, bgC: bc, L: L / n, C: C / n, contrast: cr / n, colored: colored / n };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("theme".padEnd(22), "nền".padEnd(8), "nền L/C".padEnd(12), "chữ L TB", "chữ C TB", "tương phản TB", "% chữ có màu");
  for (const [name, theme] of themes) {
    const m = await measure(theme);
    console.log(name.padEnd(22), m.bg.padEnd(8), `${m.bgL.toFixed(3)}/${m.bgC.toFixed(3)}`.padEnd(12), m.L.toFixed(3).padEnd(8), m.C.toFixed(3).padEnd(8), (m.contrast.toFixed(1) + ":1").padEnd(13), (m.colored * 100).toFixed(0) + "%");
  }
}
