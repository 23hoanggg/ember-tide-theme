# Changelog

## 1.3.0

- **Back to the original 1.0.0 colors.** 1.2.0 changed many colors at once and did not feel as stable in use, so
  1.3.0 restores exactly what 1.0.0 shipped: the VS Code theme, the Zed theme, the optional Zed semantic token rules
  in `extras/` and the terminal palettes. If you liked 1.0.0, nothing changes for you; if you were on 1.2.0, the
  night-blue background and the original variable/property tones are back.

## 1.2.0

- **Colorblind checks.** `npm test` now simulates color-vision deficiency (deuteranopia/protanopia/tritanopia) and
  requires the roles that sit side by side (property, type, variable, namespace…) to stay ≥ ΔE2000 6 apart. Function
  blue vs keyword violet / built-in-type lavender is reported as a known exception under red–green deficiency: making
  functions pass needs a lighter, paler blue, and the vivid sky blue was kept. No syntax color changed for this.
- **Same meaning, same color across languages** (TextMate):
  - JavaScript/TypeScript: `const` bindings are coral like other variables (they were orange until the language server
    loaded). In Zed, UPPER_CASE constants stay orange.
  - Markdown: list item text is plain again (the whole item was orange); only the bullet/number is colored.
  - C/C++: `#define` bodies and `#ifdef` arguments are no longer violet; macro names are mint like Rust macros.
    `uint8_t`, `std::size_t` are built-in types (were violet); overloaded `operator()` is a function; `[[nodiscard]]` is mint.
  - Go: the `type` keyword is violet (was lavender) and `error`, `byte`, `rune` are built-in types (`error` was violet).
  - Java: `String[]` is a type (was violet); doc tags and the ternary `? :` follow the shared styles.
  - String interpolation: only the delimiters (`${ }`, `{ }`, `#{ }`, `$`) take the keyword color, the expression keeps its
    own colors — Python f-string variables are no longer gold, C# `{ }` and SCSS `#{ }` match JS. Rust format placeholders
    (`"{n:.2}"`, `{:?}`) use the escape color like `%s`.
  - Decorators/attributes are mint everywhere: Swift `@MainActor`, PHP `#[Attribute]`, PowerShell `[CmdletBinding()]`,
    C++ `[[nodiscard]]`, Lua `::label::`. (C# `[Serializable]` stays gold: its grammar gives no attribute scope.)
  - Doc-comment tags (`@param`, `@brief`, `---@field`…) are violet italic in every language.
  - Fields/properties: Lua `self.items`, JS private `#field`, TS type-literal members, Swift `.count`, C# events use
    the property color; C# local declarations use the variable color; Ruby `@@class_var` matches `@ivar`; Ruby hash keys agree.
  - Rust `Some`/`None` and PHP `PHP_EOL` are orange like other constants; Swift `import Foundation` is a namespace;
    regex anchors `^ $` are pink; JS BigInt suffix `n` and CSS keyframe offsets (`from`, `50%`, `to`) are orange like numbers.
  - Python built-in exceptions (`Exception`, `ValueError`) are lavender like `int`/`str`, so TextMate and Pylance agree.
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
