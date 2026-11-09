// Kiểm tra trước khi phát hành: chạy `npm run check`
import { existsSync, readFileSync } from "node:fs";

const errors = [];
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const zedToml = readFileSync("zed/extension.toml", "utf8");

for (const [file, text] of [["package.json", JSON.stringify(pkg)], ["zed/extension.toml", zedToml]]) {
  for (const ph of ["PUBLISHER_ID", "GITHUB_USER"]) {
    if (text.includes(ph)) errors.push(`${file}: còn placeholder ${ph}`);
  }
}

const zedVersion = zedToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (zedVersion !== pkg.version) errors.push(`Phiên bản lệch: package.json ${pkg.version} ≠ zed/extension.toml ${zedVersion}`);

const changelog = readFileSync("CHANGELOG.md", "utf8");
if (!changelog.includes(`## ${pkg.version}`)) errors.push(`CHANGELOG.md chưa có mục ## ${pkg.version}`);

for (const f of [pkg.icon, "LICENSE", "zed/LICENSE", "themes/ember-tide-color-theme.json", "zed/themes/ember-tide.json"]) {
  if (!existsSync(f)) errors.push(`Thiếu file ${f}`);
}

try {
  const zed = JSON.parse(readFileSync("zed/themes/ember-tide.json", "utf8"));
  if (!zed.themes?.length) errors.push("zed/themes/ember-tide.json không có theme nào");
  JSON.parse(readFileSync("themes/ember-tide-color-theme.json", "utf8"));
} catch (e) {
  errors.push("Theme JSON lỗi: " + e.message);
}

if (errors.length) {
  console.error("✘ Chưa sẵn sàng phát hành:\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log(`✔ Sẵn sàng phát hành v${pkg.version}`);
