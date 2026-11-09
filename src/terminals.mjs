// Bảng màu Ember Tide cho các terminal — cùng màu với terminal tích hợp trong VS Code và Zed.
import { ui, ansi } from "../palette.mjs";

const NAME = "Ember Tide";
const t = {
  background: ui.bg,
  foreground: ui.fg,
  cursor: ui.accent,
  cursorText: ui.bg,
  selectionBackground: ui.selection,
  selectionForeground: ui.fgBright,
};
// Thứ tự chuẩn 16 màu ANSI: 0–7 thường, 8–15 sáng
const order = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const normal = order.map((k) => ansi[k]);
const bright = order.map((k) => ansi["bright" + k[0].toUpperCase() + k.slice(1)]);
const all16 = [...normal, ...bright];

const hex = (h) => h.toUpperCase();
const header = (c) => `${c} ${NAME} — sinh tự động từ palette.mjs, đừng sửa tay\n`;

// GNOME Ptyxis (terminal mặc định của Fedora / GNOME mới)
const ptyxis = () => {
  const section = (name) =>
    [
      `[${name}]`,
      `Foreground=${hex(t.foreground)}`,
      `Background=${hex(t.background)}`,
      ...all16.map((c, i) => `Color${i}=${hex(c)}`),
      "",
      `BellForeground=${hex(t.background)}`,
      `BellBackground=${hex(ansi.yellow)}`,
      `RemoteForeground=${hex(t.foreground)}`,
      `RemoteBackground=${hex(ui.button)}`,
      `SuperuserForeground=${hex(t.background)}`,
      `SuperuserBackground=${hex(ansi.red)}`,
      "",
    ].join("\n");
  // Theme tối: dùng cùng bảng màu cho cả [Light] và [Dark] để Ptyxis luôn hiển thị như nhau
  return `${header("#")}[Palette]\nName=${NAME}\n\n${section("Light")}\n${section("Dark")}`;
};

// Windows Terminal: dán object này vào mảng "schemes" trong settings.json
const windowsTerminal = () => {
  const names = ["black", "red", "green", "yellow", "blue", "purple", "cyan", "white"];
  const o = { name: NAME, background: t.background, foreground: t.foreground, cursorColor: t.cursor, selectionBackground: t.selectionBackground };
  names.forEach((n, i) => (o[n] = normal[i]));
  names.forEach((n, i) => (o["bright" + n[0].toUpperCase() + n.slice(1)] = bright[i]));
  return JSON.stringify(o, null, 2) + "\n";
};

// iTerm2 (macOS): mở file .itermcolors là import
const iterm2 = () => {
  const comp = (h) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    return `\t<dict>\n\t\t<key>Alpha Component</key><real>1</real>\n\t\t<key>Blue Component</key><real>${b.toFixed(6)}</real>\n\t\t<key>Color Space</key><string>sRGB</string>\n\t\t<key>Green Component</key><real>${g.toFixed(6)}</real>\n\t\t<key>Red Component</key><real>${r.toFixed(6)}</real>\n\t</dict>`;
  };
  const entries = [
    ...all16.map((c, i) => [`Ansi ${i} Color`, c]),
    ["Background Color", t.background],
    ["Foreground Color", t.foreground],
    ["Bold Color", t.foreground],
    ["Cursor Color", t.cursor],
    ["Cursor Text Color", t.cursorText],
    ["Selection Color", t.selectionBackground],
    ["Selected Text Color", t.selectionForeground],
    ["Link Color", ui.accent],
  ];
  const body = entries.map(([k, c]) => `\t<key>${k}</key>\n${comp(c)}`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<!-- ${NAME} — sinh tự động từ palette.mjs -->\n<plist version="1.0">\n<dict>\n${body}\n</dict>\n</plist>\n`;
};

// Alacritty (TOML, ≥ 0.13)
const alacritty = () => {
  const block = (name, arr) => `[colors.${name}]\n` + order.map((k, i) => `${k} = "${hex(arr[i])}"`).join("\n") + "\n";
  return `${header("#")}[colors.primary]\nbackground = "${hex(t.background)}"\nforeground = "${hex(t.foreground)}"\n\n[colors.cursor]\ncursor = "${hex(t.cursor)}"\ntext = "${hex(t.cursorText)}"\n\n[colors.selection]\nbackground = "${hex(t.selectionBackground)}"\ntext = "${hex(t.selectionForeground)}"\n\n${block("normal", normal)}\n${block("bright", bright)}`;
};

// Kitty
const kitty = () =>
  `${header("#")}background ${hex(t.background)}\nforeground ${hex(t.foreground)}\ncursor ${hex(t.cursor)}\ncursor_text_color ${hex(t.cursorText)}\nselection_background ${hex(t.selectionBackground)}\nselection_foreground ${hex(t.selectionForeground)}\nurl_color ${hex(ui.accent)}\nactive_border_color ${hex(ui.accent)}\ninactive_border_color ${hex(ui.border)}\nactive_tab_background ${hex(ui.bgTab)}\nactive_tab_foreground ${hex(ui.fgBright)}\ninactive_tab_background ${hex(ui.bgTabBar)}\ninactive_tab_foreground ${hex(ui.fgMuted)}\n\n` +
  all16.map((c, i) => `color${i} ${hex(c)}`).join("\n") + "\n";

// Ghostty
const ghostty = () =>
  `${header("#")}background = ${hex(t.background)}\nforeground = ${hex(t.foreground)}\ncursor-color = ${hex(t.cursor)}\ncursor-text = ${hex(t.cursorText)}\nselection-background = ${hex(t.selectionBackground)}\nselection-foreground = ${hex(t.selectionForeground)}\n` +
  all16.map((c, i) => `palette = ${i}=${hex(c)}`).join("\n") + "\n";

// WezTerm (thư mục colors/)
const wezterm = () =>
  `${header("#")}[colors]\nbackground = "${hex(t.background)}"\nforeground = "${hex(t.foreground)}"\ncursor_bg = "${hex(t.cursor)}"\ncursor_fg = "${hex(t.cursorText)}"\ncursor_border = "${hex(t.cursor)}"\nselection_bg = "${hex(t.selectionBackground)}"\nselection_fg = "${hex(t.selectionForeground)}"\nansi = [${normal.map((c) => `"${hex(c)}"`).join(", ")}]\nbrights = [${bright.map((c) => `"${hex(c)}"`).join(", ")}]\n\n[metadata]\nname = "${NAME}"\n`;

// Konsole (KDE)
const konsole = () => {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
  const lines = [`${header("#").trim()}`, "[General]", `Description=${NAME}`, "Opacity=1", ""];
  lines.push("[Background]", `Color=${rgb(t.background)}`, "", "[BackgroundIntense]", `Color=${rgb(t.background)}`, "");
  lines.push("[Foreground]", `Color=${rgb(t.foreground)}`, "", "[ForegroundIntense]", `Color=${rgb(ui.fgBright)}`, "");
  normal.forEach((c, i) => lines.push(`[Color${i}]`, `Color=${rgb(c)}`, "", `[Color${i}Intense]`, `Color=${rgb(bright[i])}`, ""));
  return lines.join("\n");
};

// GNOME Terminal (bản cũ): script đặt bảng màu cho profile mặc định qua gsettings
const gnomeTerminal = () => {
  const pal = "[" + all16.map((c) => `'${hex(c)}'`).join(", ") + "]";
  return `#!/usr/bin/env bash
# ${NAME} cho GNOME Terminal — áp vào profile mặc định. Sinh tự động từ palette.mjs.
set -euo pipefail
id=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
p="org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$id/"
gsettings set "$p" use-theme-colors false
gsettings set "$p" background-color '${hex(t.background)}'
gsettings set "$p" foreground-color '${hex(t.foreground)}'
gsettings set "$p" cursor-colors-set true
gsettings set "$p" cursor-background-color '${hex(t.cursor)}'
gsettings set "$p" cursor-foreground-color '${hex(t.cursorText)}'
gsettings set "$p" highlight-colors-set true
gsettings set "$p" highlight-background-color '${hex(t.selectionBackground)}'
gsettings set "$p" highlight-foreground-color '${hex(t.selectionForeground)}'
gsettings set "$p" palette "${pal}"
echo "✔ Đã áp ${NAME} cho profile GNOME Terminal mặc định"
`;
};

// [đường dẫn trong thư mục terminals/, nội dung]
export const terminalFiles = () => [
  ["ptyxis/ember-tide.palette", ptyxis()],
  ["windows-terminal/ember-tide.json", windowsTerminal()],
  ["iterm2/Ember Tide.itermcolors", iterm2()],
  ["alacritty/ember-tide.toml", alacritty()],
  ["kitty/ember-tide.conf", kitty()],
  ["ghostty/ember-tide", ghostty()],
  ["wezterm/ember-tide.toml", wezterm()],
  ["konsole/EmberTide.colorscheme", konsole()],
  ["gnome-terminal/ember-tide.sh", gnomeTerminal()],
];
