# Ember Tide for terminals

Same background, text, cursor, selection and 16 ANSI colors as the integrated terminal in VS Code and Zed.
Files in this folder are generated from [`palette.mjs`](../palette.mjs) by `npm run build` — don't edit them by hand.

| Terminal | OS | File | How to install |
|---|---|---|---|
| **Ptyxis** (GNOME, Fedora default) | Linux | [`ptyxis/ember-tide.palette`](ptyxis/ember-tide.palette) | Copy to `~/.local/share/org.gnome.Ptyxis/palettes/` (or run `node install.mjs terminal`), then *Preferences → Palette → Ember Tide* |
| **GNOME Terminal** | Linux | [`gnome-terminal/ember-tide.sh`](gnome-terminal/ember-tide.sh) | `bash ember-tide.sh` — applies to the default profile |
| **Konsole** (KDE) | Linux | [`konsole/EmberTide.colorscheme`](konsole/EmberTide.colorscheme) | Copy to `~/.local/share/konsole/`, then *Edit Profile → Appearance → Ember Tide* |
| **Windows Terminal** | Windows | [`windows-terminal/ember-tide.json`](windows-terminal/ember-tide.json) | *Settings → Open JSON file*, paste the object into `"schemes": [ … ]`, then set `"colorScheme": "Ember Tide"` on a profile |
| **iTerm2** | macOS | [`iterm2/Ember Tide.itermcolors`](iterm2/Ember%20Tide.itermcolors) | Double-click the file, then *Settings → Profiles → Colors → Color Presets → Ember Tide* |
| **Ghostty** | macOS, Linux | [`ghostty/ember-tide`](ghostty/ember-tide) | Copy to `~/.config/ghostty/themes/ember-tide`, add `theme = ember-tide` to the config |
| **Kitty** | macOS, Linux | [`kitty/ember-tide.conf`](kitty/ember-tide.conf) | Copy to `~/.config/kitty/themes/`, add `include themes/ember-tide.conf` to `kitty.conf` |
| **Alacritty** | all | [`alacritty/ember-tide.toml`](alacritty/ember-tide.toml) | Copy next to `alacritty.toml`, add `import = ["ember-tide.toml"]` (≥ 0.14: `[general] import = [...]`) |
| **WezTerm** | all | [`wezterm/ember-tide.toml`](wezterm/ember-tide.toml) | Copy to `~/.config/wezterm/colors/`, set `config.color_scheme = "Ember Tide"` |

Recommended font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (or its Nerd Font version for icons in prompts).
