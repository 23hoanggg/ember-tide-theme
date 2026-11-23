// Báo cáo chất lượng bảng màu cho một biến thể: độ tương phản, khoảng cách màu giữa các vai trò, trạng thái UI.
// Dùng:  node scripts/palette-report.mjs dark       (id biến thể; bỏ trống = tất cả)
// Test tự động (test/*.test.mjs) gọi hàm report() để kiểm tra ngưỡng.
import { variants } from "../palette.mjs";
import { vscodeThemeFor } from "../src/vscode.mjs";
import { contrast, de2000, blend } from "./lib/color.mjs";

// Vai trò cú pháp "chính" — phải đủ tương phản và tách nhau rõ
export const CODE_ROLES = ["keyword", "func", "property", "type", "typeBuiltin", "namespace", "number", "attribute", "string", "regex", "variable", "parameter", "special", "tag", "operator"];
// Họ màu chìm (comment, dấu câu…) — cố ý gần nhau, không cần tách
const MUTED = ["comment", "commentDoc", "punctuation", "bracket", "ghost", "escape"];

export function thresholds(P) {
  const light = P.type === "light";
  return {
    code: light ? 4.5 : 7, // màu cú pháp trên nền editor
    codeOnLine: light ? 4.5 : 5.9, // ... trên dòng con trỏ
    comment: 4.5, // comment trên nền & dòng con trỏ
    roleDistance: 10, // ΔE2000 tối thiểu giữa hai vai trò cú pháp
  };
}

export function report(P) {
  const { ui, syntax: s, ansi } = P;
  const th = thresholds(P);
  const checks = [];
  const add = (group, name, value, min, unit = ":1") => checks.push({ group, name, value, min, unit, ok: value >= min - 1e-9 });

  // 1. Màu cú pháp
  for (const k of CODE_ROLES) {
    add("cú pháp", `${k} trên nền`, contrast(s[k], ui.bg), th.code);
    add("cú pháp", `${k} trên dòng con trỏ`, contrast(s[k], ui.bgLine), th.codeOnLine);
  }
  for (const k of ["punctuation", "bracket"]) add("cú pháp", `${k} trên nền`, contrast(s[k], ui.bg), 4.5);
  add("cú pháp", "comment trên nền", contrast(s.comment, ui.bg), th.comment);
  add("cú pháp", "comment trên dòng con trỏ", contrast(s.comment, ui.bgLine), th.comment);
  add("cú pháp", "commentDoc trên nền", contrast(s.commentDoc, ui.bg), th.comment);
  // comment phải chìm hơn chữ thường (thứ bậc)
  add("cú pháp", "chữ thường sáng hơn comment (tỉ lệ)", contrast(ui.fg, ui.bg) / contrast(s.comment, ui.bg), 1.3, "×");

  // 2. Khoảng cách giữa các vai trò
  let minPair = [Infinity, "", ""];
  for (let i = 0; i < CODE_ROLES.length; i++)
    for (let j = i + 1; j < CODE_ROLES.length; j++) {
      const d = de2000(s[CODE_ROLES[i]], s[CODE_ROLES[j]]);
      if (d < minPair[0]) minPair = [d, CODE_ROLES[i], CODE_ROLES[j]];
    }
  add("tách màu", `cặp gần nhất: ${minPair[1]} ↔ ${minPair[2]}`, minPair[0], th.roleDistance, " ΔE");
  add("tách màu", "chữ thường ↔ variable", de2000(ui.fg, s.variable), 10, " ΔE");
  add("tách màu", "chữ thường ↔ namespace", de2000(ui.fg, s.namespace), 10, " ΔE");

  // 3. Chữ giao diện
  add("giao diện", "chữ thường trên nền", contrast(ui.fg, ui.bg), 7);
  for (const [n, b] of [["nền", ui.bg], ["sidebar", ui.bgPanel], ["tab active/breadcrumb", ui.bgTab], ["popup", ui.bgFloat], ["dải tab", ui.bgTabBar]])
    add("giao diện", `chữ phụ trên ${n}`, contrast(ui.fgMuted, b), 4.5);
  add("giao diện", "chữ phụ trên mục đang chọn", contrast(ui.fgMuted, ui.listSelected), 3);
  add("giao diện", "chữ sáng trên mục đang chọn", contrast(ui.fgBright, ui.listSelected), 7);
  add("giao diện", "số dòng thường", contrast(ui.fgDim, ui.bg), 3);
  add("giao diện", "số dòng hiện tại trên dòng con trỏ", contrast(ui.fgActiveLineNr, ui.bgLine), 4.5);
  add("giao diện", "chữ nút chính", contrast(ui.onAccent ?? ui.fgBright, ui.button), 4.5);
  add("giao diện", "chữ trên badge", contrast(ui.onBadge ?? ui.bgDeep, ui.accent), 4.5);
  add("giao diện", "link trên nền", contrast(ui.accent, ui.bg), 4.5);

  // 4. Trạng thái editor (nền có alpha được trộn lên nền editor)
  const sel = blend(ui.selection + "E6", ui.bg);
  add("trạng thái", "vùng chọn ↔ nền", de2000(sel, ui.bg), 8, " ΔE");
  add("trạng thái", "vùng chọn ↔ dòng con trỏ", de2000(sel, ui.bgLine), 6, " ΔE");
  add("trạng thái", "chữ trên vùng chọn", contrast(ui.fg, sel), 4.5);
  add("trạng thái", "comment trên vùng chọn", contrast(s.comment, sel), 3);
  add("trạng thái", "dòng con trỏ ↔ nền", de2000(ui.bgLine, ui.bg), 3, " ΔE");
  add("trạng thái", "chữ trên kết quả tìm đang chọn", contrast(ui.fg, ui.findMatch), 4.5);
  add("trạng thái", "kết quả tìm ↔ nền", de2000(ui.findMatch, ui.bg), 12, " ΔE");
  add("trạng thái", "mục đang chọn ↔ sidebar", de2000(ui.listSelected, ui.bgPanel), 8, " ΔE");
  add("trạng thái", "tab active ↔ dải tab", de2000(ui.bgTab, ui.bgTabBar), 3, " ΔE");
  add("trạng thái", "viền tab ↔ dải tab", de2000(ui.borderTide, ui.bgTabBar), 5, " ΔE");

  // 5. Terminal: 16 màu ANSI trên nền (bỏ màu cố ý hoà vào nền: black/dim trên nền tối, white trên nền sáng)
  const skip = P.type === "light" ? ["white", "brightWhite", "dimWhite"] : ["black", "dimBlack"];
  for (const [k, v] of Object.entries(ansi)) {
    if (skip.includes(k)) continue;
    add("terminal", `ANSI ${k}`, contrast(v, ui.bg), k.startsWith("dim") ? 2 : k === "brightBlack" || k === "black" ? 3 : 3.5);
  }
  // 6. Theme VS Code ĐÃ BUILD: trộn màu có alpha lên đúng nền thật rồi mới đo (bắt lỗi generator vốn viết cho nền tối)
  const C = vscodeThemeFor(P).colors;
  const on = (key, base) => blend(C[key], base); // màu key (có thể có alpha) trộn lên nền base
  const ed = C["editor.background"], sb = C["statusBar.background"];
  add("theme đã build", "chữ status bar khi debug", contrast(C["statusBar.debuggingForeground"], on("statusBar.debuggingBackground", sb)), 4.5);
  for (const e of ["error", "warning", "info", "hint"]) {
    const bgMsg = on(`errorLens.${e}MessageBackground`, ed);
    add("theme đã build", `Error Lens: chữ ${e}`, contrast(blend(C[`errorLens.${e}Foreground`], bgMsg), bgMsg), 4.4); // = mức bản Dark đã phát hành
  }
  add("theme đã build", "icon activity bar không active", contrast(on("activityBar.inactiveForeground", C["activityBar.background"]), C["activityBar.background"]), 3);
  const selBg = on("editor.selectionBackground", ed);
  for (const k of CODE_ROLES) add("theme đã build", `${k} trong vùng chọn`, contrast(s[k], selBg), 4.4);
  for (const [n, line, text] of [["thêm", "diffEditor.insertedLineBackground", "diffEditor.insertedTextBackground"], ["xoá", "diffEditor.removedLineBackground", "diffEditor.removedTextBackground"]]) {
    const l = on(line, ed);
    add("theme đã build", `diff: dòng ${n} ↔ nền`, de2000(l, ed), 6.5, " ΔE");
    add("theme đã build", `diff: chữ ${n} ↔ dòng ${n}`, de2000(blend(C[text], l), l), 7, " ΔE");
    add("theme đã build", `diff: comment trên chữ ${n}`, contrast(s.comment, blend(C[text], l)), 3.5);
  }
  const merge = on("merge.currentContentBackground", ed);
  add("theme đã build", "merge: vùng current ↔ nền", de2000(merge, ed), 6.5, " ΔE");
  add("theme đã build", "hover trong danh sách ↔ sidebar", de2000(on("list.hoverBackground", C["sideBar.background"]), C["sideBar.background"]), 4, " ΔE");
  add("theme đã build", "ghost text (gợi ý AI)", contrast(on("editorGhostText.foreground", ed), ed), 3);
  add("theme đã build", "link khi hover", contrast(C["textLink.activeForeground"], ed), 4.5);
  for (const e of ["error", "warning"]) add("theme đã build", `status bar: chữ ${e}`, contrast(C[`statusBarItem.${e}Foreground`], on(`statusBarItem.${e}Background`, sb)), 4.5);
  for (const [k, bgk] of [["activityBarBadge", "activityBarBadge"], ["activityWarningBadge", "activityWarningBadge"], ["activityErrorBadge", "activityErrorBadge"]])
    add("theme đã build", `chữ trên ${k}`, contrast(C[`${k}.foreground`], C[`${bgk}.background`]), 4.5);
  const listSel = on("list.activeSelectionBackground", C["sideBar.background"]);
  add("theme đã build", "git modified trên mục đang chọn", contrast(C["gitDecoration.modifiedResourceForeground"], listSel), 4.5);
  add("theme đã build", "git added trên mục đang chọn", contrast(C["gitDecoration.addedResourceForeground"], listSel), 4.5);
  add("theme đã build", "git deleted trên mục đang chọn", contrast(C["gitDecoration.deletedResourceForeground"], listSel), 3.9);
  add("theme đã build", "giá trị inline khi debug", contrast(on("editor.inlineValuesForeground", ed), ed), 4);
  add("theme đã build", "chữ nút khi hover", contrast(C["button.foreground"], C["button.hoverBackground"]), 4.1);
  add("theme đã build", "nút ↔ nút khi hover (thấy được phản hồi)", de2000(C["button.background"], C["button.hoverBackground"]), 3.5, " ΔE");
  if (P.type === "light") {
    add("terminal", "ANSI white (bản sáng: vẫn phải thấy được)", contrast(ansi.white, ui.bg), 2.5);
    add("terminal", "ANSI brightWhite (bản sáng)", contrast(ansi.brightWhite, ui.bg), 1.5);
  }
  return { variant: P.id, checks, failed: checks.filter((c) => !c.ok) };
}

// CLI:  node scripts/palette-report.mjs [id biến thể] [--all]   (thoát mã 1 nếu có chỉ số trượt)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const want = args.find((a) => !a.startsWith("--"));
  const all = args.includes("--all");
  let failedTotal = 0;
  if (want && !variants.some((v) => v.id === want)) {
    console.error(`Không có biến thể "${want}". Chọn: ${variants.map((v) => v.id).join(", ")}`);
    process.exit(2);
  }
  for (const P of variants.filter((v) => !want || v.id === want)) {
    const r = report(P);
    failedTotal += r.failed.length;
    console.log(`\n=== ${P.name} (${P.type}) — ${r.checks.length - r.failed.length}/${r.checks.length} đạt`);
    for (const c of all ? r.checks : r.failed)
      console.log(`  ${c.ok ? "✔" : "✘"} [${c.group}] ${c.name}: ${c.value.toFixed(2)}${c.unit} (cần ≥ ${c.min})`);
  }
  if (failedTotal) process.exitCode = 1;
}
