// Build theme cho Zed và VS Code từ palette.mjs
//   node build.mjs           -> ghi file vào dist/ và themes/
//   (cài đặt: xem install.mjs — chạy được cả trên Windows)
import { mkdirSync, writeFileSync } from "node:fs";
import { zedTheme, zedSemanticRules } from "./src/zed.mjs";
import { vscodeTheme } from "./src/vscode.mjs";

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
write("dist/zed/semantic_token_rules.json", zedSemanticRules);
write("zed/semantic_token_rules.json", zedSemanticRules);

