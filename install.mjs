// Cài Ember Tide trên máy này — chạy được trên Linux, macOS và Windows (cần Node.js ≥ 18).
//   node install.mjs                 -> VS Code + Zed + terminal
//   node install.mjs vscode          -> VS Code (và VSCodium / Cursor / Windsurf nếu có)
//   node install.mjs zed             -> Zed
//   node install.mjs terminal        -> bảng màu Ptyxis (Linux); các terminal khác xem terminals/README.md
import { execSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", shell: true, ...opts });
const targets = process.argv.slice(2);
const want = (name) => targets.length === 0 || targets.includes(name);
const has = (cli) => {
  try {
    execSync(`${cli} --version`, { stdio: "ignore", shell: true });
    return true;
  } catch {
    return false;
  }
};

run("node build.mjs");

if (want("vscode")) {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const vsix = resolve("dist", `ember-tide-theme-${pkg.version}.vsix`);
  mkdirSync("dist", { recursive: true });
  // Chưa điền publisher thật (bản chưa phát hành) → đóng gói từ bản sao tạm với publisher "hoang"
  let cwd = ".";
  if (/PUBLISHER_ID|GITHUB_USER/.test(JSON.stringify(pkg))) {
    cwd = mkdtempSync(join(tmpdir(), "ember-tide-"));
    for (const f of ["README.md", "CHANGELOG.md", "LICENSE", ".vscodeignore", "themes", "images"]) cpSync(f, join(cwd, f), { recursive: true });
    const local = { ...pkg, publisher: "hoang" };
    delete local.repository; delete local.bugs; delete local.homepage;
    writeFileSync(join(cwd, "package.json"), JSON.stringify(local, null, 2));
    console.log("ℹ package.json còn placeholder → đóng gói bản cài trên máy (publisher: hoang)");
  }
  // Bản cài trên máy chưa có repo → giữ nguyên link tương đối trong README (bản phát hành có repo nên vsce tự đổi sang link GitHub)
  const localFlags = cwd === "." ? "" : " --allow-missing-repository --no-rewrite-relative-links";
  run(`npx --yes @vscode/vsce package --no-dependencies${localFlags} --out "${vsix}"`, { cwd });
  if (cwd !== ".") rmSync(cwd, { recursive: true, force: true });

  const found = ["code", "code-insiders", "codium", "cursor", "windsurf"].filter(has);
  if (found.length === 0) console.warn(`⚠ Không thấy lệnh 'code'. Mở VS Code → Extensions → '...' → Install from VSIX → chọn ${vsix}`);
  for (const cli of found) run(`${cli} --install-extension "${vsix}" --force`);
}

if (want("zed")) {
  const dir =
    platform() === "win32"
      ? join(process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"), "Zed", "themes")
      : join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "zed", "themes");
  mkdirSync(dir, { recursive: true });
  copyFileSync(join("zed", "themes", "ember-tide.json"), join(dir, "ember-tide.json"));
  console.log(`✔ đã cài theme Zed: ${join(dir, "ember-tide.json")}`);
  console.log("ℹ Màu semantic (LSP) cho Zed: dán zed/semantic_token_rules.json vào settings.json → global_lsp_settings.semantic_token_rules (xem README)");
}

if (want("terminal")) {
  if (platform() === "linux") {
    const data = process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share");
    const dir = join(data, "org.gnome.Ptyxis", "palettes");
    mkdirSync(dir, { recursive: true });
    copyFileSync(join("terminals", "ptyxis", "ember-tide.palette"), join(dir, "ember-tide.palette"));
    console.log(`✔ đã cài bảng màu Ptyxis: ${dir} → Ptyxis › Preferences › chọn "Ember Tide"`);
  }
  console.log("ℹ Terminal khác (Windows Terminal, iTerm2, Kitty, Ghostty, Alacritty, WezTerm, Konsole): xem terminals/README.md");
}
