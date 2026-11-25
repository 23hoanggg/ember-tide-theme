// Test tự động cho Ember Tide — chạy: npm test
// Kiểm tra bảng màu (cấu trúc + chất lượng), đầu ra VS Code / Zed / terminal, và bản Dark không bị đổi ngoài ý muốn.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { variants, dark, publicVariants, localVariants } from "../palette.mjs";
import { vscodeThemes, vscodeThemeFor } from "../src/vscode.mjs";
import { zedTheme, zedLocalTheme, zedSemanticRules, zedStyleFor } from "../src/zed.mjs";
import { terminalFiles, terminalFilesFor } from "../src/terminals.mjs";
import { report, CVD_ADVISORY } from "../scripts/palette-report.mjs";

const HEX = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;
const keysOf = (o) => Object.keys(o).sort();

// Mã băm màu bản Dark. Chỉ cập nhật khi CỐ Ý đổi màu bản Dark.
// 2026-11-25: chủ dự án chọn quay về đúng màu bản 1.0.0 (Marketplace, build từ commit 546aec5) — bỏ thay đổi màu của 1.1.0/1.2.0.
// 1.4.0 = bảng màu 1.0.0 cân độ sáng APCA (2026-11-25) + sửa scope sau QA 1.0.0. Chỉ cập nhật khi CỐ Ý đổi màu.
// Băm trên JSON đã chuẩn hoá chữ hoa hex, để đổi hoa/thường không làm test đỏ.
const DARK_VSCODE_SHA256 = "26d86b3cbdc2a9be63e154afe0b664351356555093f7c2355c892bc5d26523f7";
// sha256 của khối "colors" (màu giao diện) bản Dark
const DARK_VSCODE_COLORS_SHA256 = "abbaf9a1dfa88eb3d923c066f55500ff219f55faded06d713b708917482b475c";
const norm = (o) => JSON.stringify(o).replace(/#[0-9a-fA-F]{6,8}/g, (m) => m.toUpperCase());
const sha = (s) => createHash("sha256").update(s).digest("hex");

// Biến thể cục bộ (private/palettes, bị gitignore) là tuỳ chọn: test chạy được cả khi không có (CI, máy người khác).
const HAS_LOCAL = localVariants.length > 0;

test("biến thể: Dark đứng đầu, id/tên không trùng", () => {
  assert.equal(variants[0], dark);
  assert.equal(new Set(variants.map((v) => v.id)).size, variants.length, "trùng id");
  assert.equal(new Set(variants.map((v) => v.name)).size, variants.length, "trùng tên");
  for (const P of variants) assert.ok(["dark", "light"].includes(P.type), `${P.id}: type`);
});

const PUBLIC_IDS = ["dark", "noitalic", "light", "light-noitalic", "graphite", "graphite-noitalic", "neon", "neon-noitalic"];
test("phát hành đúng 8 theme (4 bản + No Italic); biến thể thử nghiệm nằm trong private/ và dist/local (không vào git)", () => {
  assert.deepEqual(publicVariants.map((v) => v.id), PUBLIC_IDS);
  // mỗi bản No Italic có đúng một bản gốc cùng màu
  for (const P of publicVariants.filter((v) => v.noItalic)) {
    const base = publicVariants.find((v) => !v.noItalic && v.name === P.name.replace(" No Italic", ""));
    assert.ok(base, `thiếu bản gốc của ${P.name}`);
    assert.deepEqual([P.ui, P.syntax, P.ansi], [base.ui, base.syntax, base.ansi]);
  }
  // package.json khai báo đúng 8 theme, đúng file
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.deepEqual(pkg.contributes.themes.map((t) => t.label), publicVariants.map((v) => v.name));
  for (const t of pkg.contributes.themes) assert.ok(existsSync(t.path), `thiếu ${t.path}`);
  const gi = readFileSync(".gitignore", "utf8");
  assert.match(gi, /^dist\/$/m, "dist/ phải nằm trong .gitignore");
  assert.match(gi, /^private\/$/m, "private/ phải nằm trong .gitignore");
});

// Chặn rò rỉ: không file nào được git theo dõi nằm trong private/ hay nhắc tên/id biến thể cục bộ
test("không rò rỉ biến thể cục bộ vào file git theo dõi", (t) => {
  const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
  assert.deepEqual(tracked.filter((f) => f.startsWith("private/") || f.startsWith("dist/")), [], "file riêng tư bị git theo dõi");
  assert.deepEqual(tracked.filter((f) => f.startsWith("palettes/")).sort(), PUBLIC_IDS.map((id) => `palettes/${id === "noitalic" ? "dark-noitalic" : id}.mjs`).sort(), "palettes/ chỉ được có bản phát hành");
  if (!HAS_LOCAL) return t.skip("không có biến thể cục bộ trên máy này");
  const needles = localVariants.flatMap((P) => [P.name, `ember-tide-${P.id}`]);
  const leaks = [];
  for (const f of tracked) {
    if (/\.(png|jpg|ico|vsix)$/.test(f) || !existsSync(f)) continue;
    const s = readFileSync(f, "utf8");
    for (const n of needles) if (s.includes(n)) leaks.push(`${f}: "${n}"`);
  }
  assert.deepEqual(leaks, []);
});

for (const P of variants) {
  test(`[${P.id}] đủ khoá như bản Dark và mọi màu là hex hợp lệ`, () => {
    for (const part of ["syntax", "ansi"]) assert.deepEqual(keysOf(P[part]), keysOf(dark[part]), `${part} thiếu/thừa khoá`);
    const optional = new Set(["onAccent", "onBadge"]);
    const missing = Object.keys(dark.ui).filter((k) => !(k in P.ui) && !optional.has(k));
    assert.deepEqual(missing, [], "ui thiếu khoá");
    assert.equal(P.accents.length, 6, "cần 6 màu ngoặc");
    const NOT_COLOR = new Set(["textAlpha", "shadowAlpha"]); // khoá tuỳ chọn không phải màu (độ trong của chữ)
    for (const [k, v] of [...Object.entries(P.ui).filter(([k]) => !NOT_COLOR.has(k)), ...Object.entries(P.syntax), ...Object.entries(P.ansi), ...P.accents.map((c, i) => [`accent${i}`, c])])
      assert.match(v, HEX, `${P.id}: ${k} = ${v} không phải hex`);
    if ("textAlpha" in P.ui) assert.match(P.ui.textAlpha, /^([0-9A-Fa-f]{2})?$/, "textAlpha phải rỗng hoặc 2 chữ số hex");
  });

  test(`[${P.id}] đạt mọi ngưỡng chất lượng màu (palette-report)`, () => {
    const r = report(P);
    const msg = r.failed.map((c) => `  ✘ [${c.group}] ${c.name}: ${c.value.toFixed(2)}${c.unit} (cần ≥ ${c.min})`).join("\n");
    assert.equal(r.failed.length, 0, `${r.failed.length}/${r.checks.length} chỉ số trượt:\n${msg}`);
  });
}

test("Mù màu (CVD): bản phát hành bắt buộc đạt; biến thể cục bộ chỉ cảnh báo", () => {
  const r = report(dark);
  const core = r.checks.filter((c) => c.group === "mù màu (CVD)");
  assert.ok(core.length >= 36, "thiếu kiểm tra CVD");
  // Ngoại lệ đã biết chỉ gồm đúng 3 cặp của màu hàm (chủ dự án chọn giữ #70C7FF) — không được lặng lẽ nới thêm
  assert.deepEqual([...CVD_ADVISORY].sort(), ["deutan:func|typeBuiltin", "deutan:keyword|func", "protan:func|typeBuiltin"]);
  assert.deepEqual(core.filter((c) => !c.ok).map((c) => c.name), []);
  for (const P of localVariants) assert.ok(report(P).checks.filter((c) => c.group === "mù màu (CVD)").every((c) => c.ok || c.advisory));
});

test("VS Code: mọi biến thể hợp lệ; extension phát hành chỉ có Dark, biến thể cục bộ chỉ ở extension riêng", () => {
  const base = keysOf(vscodeThemes[0].theme.colors);
  for (const { P, theme } of vscodeThemes) {
    assert.equal(theme.type, P.type);
    assert.equal(theme.name, P.name);
    assert.deepEqual(keysOf(theme.colors), base, `${P.id}: tập key màu UI khác Dark`);
    for (const [k, v] of Object.entries(theme.colors)) assert.match(v, HEX, `${P.id}: ${k}`);
    for (const r of theme.tokenColors) if (r.settings.foreground) assert.match(r.settings.foreground, HEX, `${P.id}: ${r.name}`);
    assert.ok(!theme.tokenColors.some((r) => /bold/.test(r.settings.fontStyle || "")), "không dùng chữ đậm");
  }
  const check = (pkgPath, root, list) => {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    assert.deepEqual(pkg.contributes.themes.map((t) => t.label), list.map((P) => P.name), `${pkgPath}: danh sách theme`);
    for (const P of list) {
      const entry = pkg.contributes.themes.find((t) => t.label === P.name);
      assert.equal(entry.uiTheme, P.type === "light" ? "vs" : "vs-dark");
      const file = join(root, entry.path);
      assert.ok(existsSync(file), `thiếu ${file} — chạy npm run build`);
      const built = vscodeThemes.find((x) => x.P === P).theme;
      assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), JSON.parse(JSON.stringify(built)), `${file} chưa build lại`);
    }
    return pkg;
  };
  check("package.json", ".", publicVariants);
  if (HAS_LOCAL) {
    const local = check("dist/local/vscode/package.json", "dist/local/vscode", localVariants);
    assert.equal(local.publisher, "hoang", "extension cục bộ phải khác publisher Marketplace");
    assert.equal(local.name, "ember-tide-local");
  }
  for (const P of localVariants) assert.ok(!existsSync(`themes/ember-tide-${P.id}-color-theme.json`), `${P.id} không được nằm trong themes/ (sẽ bị phát hành)`);
});

test("VS Code: mọi key màu UI tồn tại trong VS Code đã cài (bỏ qua nếu không có VS Code)", (t) => {
  const bundle = "/usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.js";
  if (!existsSync(bundle)) return t.skip("không tìm thấy VS Code trên máy");
  const js = readFileSync(bundle, "utf8");
  const ext = new Set();
  for (const d of ["/usr/share/code/resources/app/extensions", join(homedir(), ".vscode/extensions")]) {
    if (!existsSync(d)) continue;
    for (const e of readdirSync(d)) {
      try {
        for (const c of JSON.parse(readFileSync(join(d, e, "package.json"), "utf8")).contributes?.colors || []) ext.add(c.id);
      } catch {}
    }
  }
  const unknown = Object.keys(vscodeThemes[0].theme.colors).filter((k) => !js.includes(`"${k}"`) && !ext.has(k));
  assert.deepEqual(unknown, []);
});

test("VS Code: bản Dark giữ nguyên màu đã ghim", () => {
  assert.equal(sha(norm(vscodeThemes[0].theme)), DARK_VSCODE_SHA256, "màu bản Dark đã thay đổi — nếu cố ý, cập nhật DARK_VSCODE_SHA256");
  assert.equal(sha(JSON.stringify(JSON.parse(readFileSync("themes/ember-tide-color-theme.json", "utf8")).colors)), DARK_VSCODE_COLORS_SHA256, "màu giao diện bản Dark đã thay đổi (chưa build lại?)");
});

test("package.json: galleryBanner.color = ui.bgDeep của bản Dark", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(pkg.galleryBanner.color.toUpperCase(), dark.ui.bgDeep.toUpperCase());
});

test("Zed: file phát hành chỉ có Dark, biến thể cục bộ ở file riêng; đúng appearance và kiểu dữ liệu", () => {
  const sets = [[zedTheme, "zed/themes/ember-tide.json", publicVariants]];
  if (HAS_LOCAL) sets.push([zedLocalTheme, "dist/local/zed/ember-tide-local.json", localVariants]);
  for (const [obj, file, list] of sets) {
    assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), JSON.parse(JSON.stringify(obj)), `${file} chưa build lại`);
    assert.deepEqual(obj.themes.map((t) => t.name), list.map((P) => P.name));
  }
  const all = [...zedTheme.themes, ...zedLocalTheme.themes];
  const base = keysOf(all[0].style);
  for (const th of all) {
    const P = variants.find((v) => v.name === th.name);
    assert.equal(th.appearance, P.type);
    assert.deepEqual(keysOf(th.style), base, `${th.name}: tập key khác Dark`);
    for (const [k, v] of Object.entries(th.style)) if (typeof v === "string" && k !== "background.appearance") assert.match(v, HEX, `${th.name}: ${k}`);
    for (const [k, v] of Object.entries(th.style.syntax)) {
      assert.match(v.color, HEX, `${th.name}: syntax.${k}`);
      assert.ok(v.font_weight === null || Number.isInteger(v.font_weight), `${th.name}: syntax.${k}.font_weight phải là số hoặc null`);
      assert.ok(["normal", "italic"].includes(v.font_style), `${th.name}: syntax.${k}.font_style`);
    }
  }
});

// Rule semantic cho settings.json của Zed (extras/) như bản 1.0.0: ghi mã màu của bản Dark, mỗi màu là một vai trò cú pháp
test("Zed: rule semantic dùng đúng màu vai trò của bản Dark", () => {
  const roles = new Set(Object.values(dark.syntax));
  assert.deepEqual(JSON.parse(readFileSync("extras/zed-semantic-token-rules.json", "utf8")), JSON.parse(JSON.stringify(zedSemanticRules)), "extras/ chưa build lại");
  for (const r of zedSemanticRules) {
    assert.match(r.foreground_color, HEX, JSON.stringify(r));
    assert.ok(roles.has(r.foreground_color), `${JSON.stringify(r)}: màu không thuộc dark.syntax`);
  }
});

test("Terminal: 9 file cho mỗi bản phát hành (No Italic dùng chung màu) trong terminals/, biến thể thử nghiệm trong dist/local", () => {
  const term = (l) => l.filter((v) => !v.noItalic);
  for (const [list, dir, n] of [[term(publicVariants), "terminals", 9 * 4], [term(localVariants), "dist/local/terminals", 9 * term(localVariants).length]]) {
    const files = terminalFiles(list);
    assert.equal(files.length, n);
    assert.equal(new Set(files.map(([p]) => p)).size, n, "trùng tên file");
    for (const [path, content] of files) {
      const p = join(dir, path);
      assert.ok(existsSync(p), `thiếu ${p} — chạy npm run build`);
      assert.equal(readFileSync(p, "utf8"), content, `${p} chưa build lại`);
    }
  }
  for (const P of variants) {
    const byName = Object.fromEntries(terminalFilesFor(P).map(([p, c]) => [p.split("/")[0], c]));
    const wt = JSON.parse(byName["windows-terminal"]);
    assert.equal(wt.name, P.name);
    assert.equal(wt.background, P.ui.bg);
    assert.match(byName.iterm2, /<plist version="1.0">[\s\S]*<\/plist>\s*$/);
    assert.equal((byName.iterm2.match(/<key>Ansi \d+ Color<\/key>/g) || []).length, 16);
    assert.equal((byName.ptyxis.match(/^Color\d+=#[0-9A-F]{6}$/gm) || []).length, 32);
    assert.equal((byName.ghostty.match(/^palette = \d+=#[0-9A-F]{6}$/gm) || []).length, 16);
  }
});

test("Phiên bản khớp giữa package.json và zed/extension.toml", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const zed = readFileSync("zed/extension.toml", "utf8").match(/^version\s*=\s*"([^"]+)"/m)?.[1];
  assert.equal(zed, pkg.version);
});

// Mã băm theme Zed Dark — đúng bản 1.0.0 (2026-11-25: quay về màu 1.0.0 theo chủ dự án)
const DARK_ZED_SHA256 = "1765ce1a8a9ba41bcd50f5ec9f87e5b7185b2e8538712648ea3da1b2b00098cc";
test("Zed: bản Dark giữ nguyên màu đã ghim", () => {
  assert.equal(sha(norm(zedTheme.themes[0])), DARK_ZED_SHA256, "theme Zed Dark đã thay đổi — nếu cố ý, cập nhật DARK_ZED_SHA256");
});

// Gói VSIX chỉ được chứa đúng các file cần cho người dùng (không lộ ghi chú nội bộ, test, bảng màu nguồn)
test("VSIX: .vscodeignore chỉ để lọt đúng các file cần thiết", async () => {
  const toRe = (g) => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");
  const ignore = readFileSync(".vscodeignore", "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map(toRe);
  // Quét file THẬT trên đĩa (vsce đóng gói cả file không theo dõi bởi git, vd private/, dist/) — không dùng git ls-files
  const ignored = (f) => ignore.some((re) => re.test(f));
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir || ".", { withFileTypes: true })) {
      const f = dir ? `${dir}/${e.name}` : e.name;
      if (e.name === ".git" || e.name === "node_modules") continue; // vsce luôn bỏ .git; node_modules loại bởi --no-dependencies + .vscodeignore
      if (e.isDirectory()) { if (!ignored(f + "/x")) walk(f); } else if (!ignored(f)) files.push(f);
    }
  };
  walk("");
  const included = files.filter((f) => !f.startsWith(".")).sort();
  const expected = ["CHANGELOG.md", "LICENSE", "README.md", "images/icon.png", "package.json", ...readdirSync("themes").map((f) => "themes/" + f)].sort();
  assert.equal(readdirSync("themes").length, 8);
  assert.deepEqual(included, expected);
});

// README (công khai) chỉ mô tả biến thể phát hành; bảng màu phải khớp palettes
test("README: bảng màu khớp bản phát hành và không nhắc biến thể cục bộ", () => {
  const readme = readFileSync("README.md", "utf8");
  for (const P of localVariants) assert.ok(!readme.includes(P.name), `README không được nhắc ${P.name} (chỉ dùng trên máy)`);
  for (const k of ["keyword", "func", "property", "type", "typeBuiltin", "namespace", "number", "attribute", "string", "variable", "parameter", "special", "comment"]) {
    const row = readme.split("\n").find((l) => l.startsWith("| ") && publicVariants.every((P) => l.includes("`" + P.syntax[k] + "`")));
    assert.ok(row, `README thiếu dòng bảng màu cho ${k}`);
  }
});

test("noItalic: biến thể không in nghiêng không còn chữ nghiêng ở VS Code và Zed, màu giữ nguyên", () => {
  const P = { ...dark, noItalic: true };
  const t = vscodeThemeFor(P), base = vscodeThemeFor(dark);
  assert.ok(t.tokenColors.every((r) => !/italic/.test(r.settings.fontStyle ?? "")));
  assert.ok(Object.values(t.semanticTokenColors).every((v) => typeof v !== "object" || !v.italic));
  assert.deepEqual(t.tokenColors.map((r) => r.settings.foreground), base.tokenColors.map((r) => r.settings.foreground));
  assert.ok(base.tokenColors.some((r) => /italic/.test(r.settings.fontStyle ?? "")), "bản thường vẫn có nghiêng");
  assert.ok(Object.values(zedStyleFor(P).syntax).every((v) => v.font_style !== "italic"));
});
