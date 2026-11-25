// Build theme cho VS Code, Zed và terminal từ palettes/*.mjs
//   node build.mjs  -> phần CÔNG KHAI (phát hành): themes/, zed/, extras/, terminals/  (chỉ biến thể publish: true)
//                   -> phần CỤC BỘ (chỉ máy chủ dự án): dist/local/  (biến thể trong private/ — không vào git)
// Cài: xem install.mjs (`npm run install:all` công khai, `npm run install:local` cục bộ).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { publicVariants, localVariants } from "./palette.mjs";
import { zedTheme, zedLocalTheme, zedSemanticRules } from "./src/zed.mjs";
import { vscodeThemes } from "./src/vscode.mjs";
import { terminalFiles } from "./src/terminals.mjs";

const write = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");
};
const isPublic = (P) => publicVariants.includes(P);
const themeFile = (P) => `themes/ember-tide${P.id === "dark" ? "" : "-" + P.id}-color-theme.json`;

// ---------- CÔNG KHAI ----------
for (const { P, theme } of vscodeThemes.filter(({ P }) => isPublic(P))) write(themeFile(P), theme);
write("zed/themes/ember-tide.json", zedTheme); // thư mục extension Zed (kho Zed build từ đây)
// Rule semantic token cho settings.json của Zed — để NGOÀI zed/ (Zed extension chỉ được chứa file Zed dùng)
write("extras/zed-semantic-token-rules.json", zedSemanticRules);
// Terminal không có chữ nghiêng → bỏ các bản No Italic (trùng màu)
for (const [file, content] of terminalFiles(publicVariants.filter((v) => !v.noItalic))) write("terminals/" + file, content);
console.log(`✔ công khai: ${publicVariants.map((v) => v.name).join(", ")} → themes/, zed/, extras/, terminals/`);

// ---------- CỤC BỘ (dist/local, không vào git) ----------
if (localVariants.length) {
  const L = "dist/local";
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  // Extension VS Code riêng, publisher "hoang" → không đụng tới bản Marketplace whythohh.ember-tide-theme
  const local = vscodeThemes.filter(({ P }) => !isPublic(P));
  for (const { P, theme } of local) write(`${L}/vscode/${themeFile(P)}`, theme);
  write(`${L}/vscode/package.json`, {
    name: "ember-tide-local",
    displayName: `${local.map(({ P }) => P.name.replace("Ember Tide ", "")).join(" & ").replace(/^/, "Ember Tide ")} (local)`,
    description: "Private Ember Tide variants for this machine only — not published.",
    version: pkg.version,
    publisher: "hoang",
    private: true,
    license: "MIT",
    icon: "images/icon.png",
    engines: pkg.engines,
    categories: ["Themes"],
    contributes: {
      themes: local.map(({ P }) => ({ label: P.name, uiTheme: P.type === "light" ? "vs" : "vs-dark", path: "./" + themeFile(P) })),
    },
  });
  write(`${L}/vscode/README.md`, `# Ember Tide — local variants\n\n${local.map(({ P }) => "- " + P.name).join("\n")}\n\nBuilt from \`palettes/\` for this machine only. Not published.\n`);
  copyFileSync("LICENSE", `${L}/vscode/LICENSE`);
  mkdirSync(`${L}/vscode/images`, { recursive: true });
  copyFileSync("images/icon.png", `${L}/vscode/images/icon.png`);
  write(`${L}/zed/ember-tide-local.json`, zedLocalTheme);
  for (const [file, content] of terminalFiles(localVariants.filter((v) => !v.noItalic))) write(`${L}/terminals/${file}`, content);
  console.log(`✔ cục bộ:   ${localVariants.map((v) => v.name).join(", ")} → ${L}/ (vscode, zed, terminals)`);
}
