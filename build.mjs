// Build theme cho Zed và VS Code từ palette.mjs
//   node build.mjs           -> ghi file vào dist/ và themes/
//   (cài đặt: xem install.mjs — chạy được cả trên Windows)
import { mkdirSync, writeFileSync } from "node:fs";
import { zedTheme, zedSemanticRules } from "./src/zed.mjs";
import { vscodeTheme } from "./src/vscode.mjs";
import { terminalFiles } from "./src/terminals.mjs";
import { dirname } from "node:path";

const write = (path, data) => {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log("✔", path);
};

mkdirSync("themes", { recursive: true });
mkdirSync("dist/zed", { recursive: true });
mkdirSync("zed/themes", { recursive: true });

write("themes/ember-tide-color-theme.json", vscodeTheme);
write("dist/zed/ember-tide.json", zedTheme);
write("zed/themes/ember-tide.json", zedTheme); // thư mục extension Zed (để đăng lên Zed Extensions)
mkdirSync("extras", { recursive: true });
// Rule semantic token cho settings.json của Zed — để NGOÀI zed/ (Zed extension chỉ được chứa file Zed dùng)
write("extras/zed-semantic-token-rules.json", zedSemanticRules);

// Bảng màu cho terminal (Ptyxis, Windows Terminal, iTerm2, Alacritty, Kitty, Ghostty, WezTerm, Konsole, GNOME Terminal)
for (const [file, content] of terminalFiles()) {
  const path = "terminals/" + file;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
console.log("✔ terminals/ (" + terminalFiles().length + " terminal)");

