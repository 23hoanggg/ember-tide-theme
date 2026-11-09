// Cài Ember Tide cho VS Code và/hoặc Zed — chạy được trên Linux, macOS và Windows.
//   node install.mjs            -> cài cả hai
//   node install.mjs vscode     -> chỉ VS Code
//   node install.mjs zed        -> chỉ Zed
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";

const run = (cmd) => execSync(cmd, { stdio: "inherit", shell: true });
const targets = process.argv.slice(2);
const want = (name) => targets.length === 0 || targets.includes(name);

run("node build.mjs");

if (want("vscode")) {
  const { version } = JSON.parse(readFileSync("package.json", "utf8"));
  const vsix = join("dist", `ember-tide-theme-${version}.vsix`);
  run(`npx --yes @vscode/vsce package --no-dependencies --out "${vsix}"`);

  // Cài vào mọi bản VS Code tìm thấy (Stable, Insiders, VSCodium, Cursor)
  const clis = ["code", "code-insiders", "codium", "cursor"];
  const has = (cli) => {
    try {
      execSync(`${cli} --version`, { stdio: "ignore", shell: true });
      return true;
    } catch {
      return false;
    }
  };
  const found = clis.filter(has);
  if (found.length === 0) {
    console.warn(
      `⚠ Không tìm thấy lệnh 'code'. Mở VS Code → Extensions → '...' → Install from VSIX → chọn ${vsix}`,
    );
  }
  for (const cli of found) run(`${cli} --install-extension "${vsix}" --force`);
}

if (want("zed")) {
  // Thư mục theme của Zed theo từng hệ điều hành
  const dir =
    platform() === "win32"
      ? join(process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"), "Zed", "themes")
      : join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "zed", "themes");
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "ember-tide.json");
  copyFileSync(join("dist", "zed", "ember-tide.json"), target);
  console.log(`✔ đã cài theme Zed: ${target}`);
  if (!existsSync(join(dir, ".."))) console.warn("⚠ Chưa thấy cấu hình Zed — mở Zed một lần rồi chạy lại.");
}
