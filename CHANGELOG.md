# Changelog

## 1.2.0 (unreleased)

- **Semantic highlighting matches the syntax colors.** With a language server running, these tokens no longer switch
  to a different color than the theme gives them without one:
  - Rust: `true`/`false` and `const`/`static` items are orange like other constants (were purple / coral), `Self` is
    blue italic like `self`, and format specifiers (`{}`, `{:?}`) use the escape color.
  - Java: annotations (`@Override`) are mint like other attributes (were yellow).
  - C#: delegates are yellow types (were blue), `const` fields are orange, events use the property color.
  - Go: `true`, `false`, `nil`, `iota` are orange (were blue-violet); `%s`/`%d` in format strings use the escape color.
  - Python (Pylance): built-in types `int`, `str`, `list`… are lavender (were yellow); `None`/`True` stay orange.
  - C++: concepts (`std::integral`) are yellow types.
- **Zed:**
  - Rust macros (`println!`) and C function-like macros are mint like in VS Code (were blue); JSX/TSX, Astro, Svelte and
    Vue components are yellow (were pink); Python keyword arguments are coral italic; Python `int`/`str` are lavender.
  - Regex tokens from language servers are pink (were string green); docstrings and modifiers such as `override`/`final`
    from language servers are now colored (were left plain); doc comments and `~~strikethrough~~` are styled.
  - Vim and Helix mode colors in the status bar: normal blue, insert green, visual violet, replace red; yank flash is amber.
  - Two more optional semantic rules (Rust built-in types, format specifiers) — see the README.
- **VS Code UI:** keys that still used VS Code's built-in Dark+ colors now follow the palette: source control graph
  (base/remote refs, hover additions/deletions), Chat/Agents progress icon and thinking shimmer, IME composition underline,
  offline status bar item, debug value-changed highlight, moved-code borders in diffs, extension rating stars, Welcome titles.
- Test coverage highlights and Next Edit Suggestions get clearly visible green/red tints (they were derived from the faint
  diff colors and almost invisible).
- Marketplace banner color matches the current background.

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
