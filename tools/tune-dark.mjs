// Thử chỉnh bản Dark trong bộ nhớ: giảm độ ngả xanh của các màu xám (giữ L và H), tuỳ chọn nâng chroma vai trò cú pháp.
// Dùng: import { tuned } from "./tune-dark.mjs"  hoặc  node tools/tune-dark.mjs  (in báo cáo)
import { dark } from "../palette.mjs";
import { oklch, fromOklch } from "../scripts/lib/color.mjs";

// Các nhóm đã áp dụng ở v1.1.0 (ghi lại để tham khảo). palettes/dark.mjs ĐÃ chứa kết quả —
// đừng áp lại lên palette hiện tại (sẽ giảm chroma lần thứ hai). Mặc định tuned() không đổi gì.
export const GROUPS_V110 = {
  ladder: [["bgDeep", "bgPanel", "bg", "bgFloat", "bgLine", "bgInput", "bgTabBar", "bgTabHover", "bgTab", "bgHover", "bgSelected", "bgActive", "bgInfo", "border", "borderSoft"], 0.45],
  text: [["fg", "fgSoft", "fgBright"], 0.5],
  muted: [["fgMuted", "fgDim", "indent", "treeGuide", "invisible", "ignored"], 0.6],
  syntaxMuted: [["comment", "commentDoc", "punctuation", "bracket", "ghost"], 0.6],
};
export const scaleC = (hex, k) => { const [L, C, H] = oklch(hex); return fromOklch(L, C * k, H); };

export function tuned({ groups = {}, boost = {} } = {}) {
  const ui = { ...dark.ui }, syntax = { ...dark.syntax };
  for (const [keys, k] of Object.values(groups)) for (const key of keys) {
    if (key in ui) ui[key] = scaleC(ui[key], k);
    else if (key in syntax) syntax[key] = scaleC(syntax[key], k);
  }
  for (const [k, v] of Object.entries(boost)) syntax[k] = v; // ghi đè màu cú pháp cụ thể
  return { ...dark, ui, syntax };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { report } = await import("../scripts/palette-report.mjs");
  const P = tuned(); // thử: tuned({ groups: { ladder: [["bg"], 0.8] } })
  const r = report(P);
  console.log(`Dark (nền đã chỉnh): ${r.checks.length - r.failed.length}/${r.checks.length} đạt`);
  for (const c of r.failed) console.log(`  ✘ [${c.group}] ${c.name}: ${c.value.toFixed(2)}${c.unit} (cần ≥ ${c.min})`);
  for (const k of ["bgDeep", "bgPanel", "bg", "bgLine", "bgTab", "fg", "fgMuted", "fgDim"]) console.log(`  ${k.padEnd(9)} ${dark.ui[k]} → ${P.ui[k]}  C ${oklch(dark.ui[k])[1].toFixed(3)} → ${oklch(P.ui[k])[1].toFixed(3)}`);
  for (const k of ["comment", "punctuation"]) console.log(`  ${k.padEnd(9)} ${dark.syntax[k]} → ${P.syntax[k]}`);
}
