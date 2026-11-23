# Changelog

## 1.1.0

- **Brighter, livelier look.** The background and UI grays are far less blue (background chroma halved: `#171D28` → `#1A1D22`),
  and plain text is more neutral, so syntax colors pop instead of being tinted by the canvas.
- **Variables** are more vivid and a little brighter (`#EDA898` → `#FFAA92`) — they're the most common text in code — while staying
  clearly apart from parameters and numbers. **Properties** are more vivid (`#72D4C9` → `#5ED7CB`).
- Tab/panel borders and the gray ANSI terminal colors follow the more neutral background.
- Comments, punctuation and secondary text follow the more neutral background; all contrast and color-separation checks still pass.

## 1.0.1 (not released separately — included in 1.1.0)

- **Zed semantic tokens:** the optional rule now references a theme style instead of hex colors (Zed's built-in rules
  already map decorators, namespaces, parameters… to theme styles). If you pasted the 1.0.0 rules into `settings.json`,
  replace them with the single rule in the README.
- Zed: added the `type.parameter`, `type.definition`, `function.macro` and `function.decorator` styles that Zed's built-in
  semantic rules look up (generic `T` is italic like in VS Code). VS Code colors are unchanged.
- The VS Code package now ships only the files users need.
- Quality: `npm test` audits the built theme (contrast after blending translucent colors onto their real backgrounds,
  syntax inside selections, diff tints, badges, git colors on selected rows…) and pins the published colors.

## 1.0.0

First public release.

- **VS Code** (also VSCodium, Cursor, Windsurf) and **Zed** themes generated from a single palette, so both editors look the same.
- **Terminal palettes** for Ptyxis, GNOME Terminal, Konsole, Windows Terminal, iTerm2, Ghostty, Kitty, Alacritty and WezTerm.
- Syntax colors tuned across 35+ languages and file types (incl. Prisma, Protobuf, SQL dialects, logs, CSV via Rainbow CSV);
  every syntax color ≥ 7:1 contrast, comments ≥ 4.5:1 even on the highlighted line, and no two roles closer than ΔE2000 10.
- Semantic highlighting matched to TextMate colors; TypeScript parameter properties (`private readonly x`) colored as properties.
- Distinct hues for editor states: selection (blue), search (amber, current match ember), symbol occurrences (teal), hover (lavender).
- Symbol icons in suggestions/outline use the same colors as the code they represent.
