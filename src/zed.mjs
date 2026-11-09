import { ui, syntax as s, accents, ansi, alpha } from "../palette.mjs";

// Zed: font_weight là số 100–900 hoặc null (= giữ mặc định). Theme không dùng in đậm — chỉ phân biệt bằng màu và đứng/nghiêng.
const st = (color, font_style = "normal", font_weight = null) => ({ color, font_style, font_weight });
const italic = (color) => st(color, "italic");

const syntaxStyles = {
  // Comment
  comment: italic(s.comment),
  "comment.doc": italic(s.commentDoc),
  hint: italic(s.comment),
  predictive: italic(s.ghost),

  // Keyword
  keyword: st(s.keyword),
  "keyword.control": st(s.keyword),
  "keyword.operator": st(s.keyword),
  preproc: st(s.keyword),
  include: st(s.keyword),
  conditional: st(s.keyword),
  repeat: st(s.keyword),
  exception: st(s.keyword),
  storageclass: st(s.keyword),
  define: st(s.keyword),

  // Hàm
  function: st(s.func),
  "function.method": st(s.func),
  "function.builtin": st(s.func),
  method: st(s.func),
  constructor: st(s.type),
  macro: st(s.attribute),

  // Kiểu dữ liệu
  type: st(s.type),
  "type.class": st(s.type),
  "type.interface": st(s.type),
  "type.builtin": st(s.typeBuiltin),
  "type.primitive": st(s.typeBuiltin),
  enum: st(s.type),
  concept: st(s.type),
  namespace: st(s.namespace),
  module: st(s.namespace),

  // Biến & thuộc tính
  variable: st(s.variable),
  "variable.member": st(s.property),
  "variable.parameter": italic(s.parameter),
  parameter: italic(s.parameter),
  "variable.special": italic(s.special), // this, self, super
  "variable.builtin": italic(s.special),
  property: st(s.property),
  field: st(s.property),
  label: st(s.attribute),
  lifetime: italic(s.attribute),

  // Hằng & số
  constant: st(s.number),
  "constant.builtin": st(s.number),
  "constant.numeric": st(s.number),
  number: st(s.number),
  float: st(s.number),
  boolean: st(s.number),
  enumMember: st(s.number),
  variant: st(s.number),

  // Chuỗi
  string: st(s.string),
  "string.escape": st(s.escape),
  escape: st(s.escape),
  "string.regex": st(s.regex),
  "string.special": st(s.property),
  "string.special.symbol": st(s.property),
  symbol: st(s.property),
  special: st(s.property),
  character: st(s.string),
  "character.special": st(s.escape),

  // Toán tử & dấu câu
  operator: st(s.operator),
  punctuation: st(s.punctuation),
  "punctuation.bracket": st(s.bracket),
  "punctuation.delimiter": st(s.punctuation),
  delimiter: st(s.punctuation),
  "punctuation.special": st(s.keyword),
  "punctuation.list_marker": st(s.number),
  "punctuation.markup": st(s.number),

  // Tag / HTML / CSS
  tag: st(s.tag),
  "tag.attribute": italic(s.attribute),
  "tag.delimiter": st(s.punctuation),
  "tag.doctype": st(s.keyword),
  attribute: st(s.attribute),
  selector: st(s.tag),
  "selector.pseudo": st(s.keyword),

  // Markdown
  title: st(s.func),
  emphasis: italic(s.keyword),
  "emphasis.strong": st(s.number),
  "text.literal": st(s.string),
  link_text: st(s.keyword),
  link_uri: st(s.property),
  "markup.heading": st(s.func),
  "markup.bold": st(s.number),
  "markup.italic": italic(s.keyword),
  "markup.strikethrough": st(s.comment),
  "markup.link": st(s.keyword),
  "markup.link.url": st(s.property),
  "markup.raw": st(s.string),
  "markup.quote": italic(s.commentDoc),
  "markup.list": st(s.number),
  "text.title": st(s.func),
  "text.uri": st(s.property),
  "text.reference": st(s.keyword),
  "text.emphasis": italic(s.keyword),
  "text.strong": st(s.number),

  // Diff
  "diff.plus": st(ui.green),
  "diff.minus": st(ui.red),
  "diff.delta": st(ui.yellow),

  embedded: st(ui.fg),
  primary: st(ui.fg),
};

const status = (name, color, bg) => ({
  [name]: color,
  [`${name}.background`]: bg,
  [`${name}.border`]: alpha(color, "55"),
});

const style = {
  background: ui.bg,
  "background.appearance": "opaque",
  border: ui.borderTide, // Zed dùng màu này cho viền tab (và các viền chính)
  "border.variant": ui.borderSoft,
  "border.focused": ui.focus,
  "border.selected": ui.accent,
  "border.disabled": ui.borderSoft,
  "border.transparent": "#00000000",
  "surface.background": ui.bgPanel,
  "elevated_surface.background": ui.bgFloat,
  "drop_target.background": alpha(ui.accent, "22"),

  text: ui.fg,
  "text.muted": ui.fgMuted,
  "text.placeholder": ui.fgMuted,
  "text.disabled": ui.fgDim,
  "text.accent": ui.accent,
  "link_text.hover": ui.accent,

  icon: ui.fgSoft,
  "icon.muted": ui.fgMuted,
  "icon.disabled": ui.fgDim,
  "icon.placeholder": ui.fgMuted,
  "icon.accent": ui.accent,

  "element.background": ui.bgInput,
  "element.hover": ui.bgHover,
  "element.selected": ui.listSelected,
  "element.active": ui.bgSelected,
  "element.disabled": ui.bgFloat,
  "ghost_element.background": "#00000000",
  "ghost_element.hover": ui.glow,
  "ghost_element.selected": ui.listSelected, // dòng được chọn trong project panel
  "ghost_element.active": ui.bgActive,
  "ghost_element.disabled": ui.bgFloat,

  ...status("hint", ui.accent, ui.bgInfo),
  ...status("info", ui.accent, ui.bgInfo),
  ...status("warning", ui.yellow, ui.bgYellow),
  ...status("error", ui.red, ui.bgRed),
  ...status("success", ui.green, ui.bgGreen),
  ...status("created", ui.green, ui.bgGreen),
  ...status("modified", ui.yellow, ui.bgYellow),
  ...status("deleted", ui.red, ui.bgRed),
  ...status("conflict", ui.coral, ui.bgCoral),
  ...status("renamed", ui.accent, ui.bgInfo),
  ...status("predictive", s.ghost, ui.bgInfo),
  ignored: ui.ignored,
  "ignored.background": ui.bgFloat,
  "ignored.border": ui.border,
  hidden: ui.fgDim,
  "hidden.background": ui.bgFloat,
  "hidden.border": ui.border,
  unreachable: ui.fgMuted,
  "unreachable.background": ui.bgFloat,
  "unreachable.border": ui.border,

  "version_control.added": ui.green,
  "version_control.modified": ui.yellow,
  "version_control.deleted": ui.red,
  "version_control.conflict": ui.coral,
  "version_control.renamed": ui.accent,
  "version_control.ignored": ui.ignored,
  // Diff & conflict — cùng giá trị với VS Code (diffEditor.*, merge.*)
  "version_control.word_added": alpha(ui.green, "1E"),
  "version_control.word_deleted": alpha(ui.red, "1E"),
  "version_control.conflict_marker.ours": alpha(ui.green, "1A"),
  "version_control.conflict_marker.theirs": alpha(ui.accent, "1A"),
  "editor.diff_hunk.added.background": alpha(ui.green, "14"),
  "editor.diff_hunk.added.hollow_background": alpha(ui.green, "0A"),
  "editor.diff_hunk.added.hollow_border": alpha(ui.green, "55"),
  "editor.diff_hunk.deleted.background": alpha(ui.red, "14"),
  "editor.diff_hunk.deleted.hollow_background": alpha(ui.red, "0A"),
  "editor.diff_hunk.deleted.hollow_border": alpha(ui.red, "55"),

  "title_bar.background": ui.bgDeep,
  "title_bar.inactive_background": ui.bgDeep,
  "status_bar.background": ui.bgDeep,
  "tab_bar.background": ui.bgTabBar,
  "tab.inactive_background": ui.bgTabBar,
  "tab.active_background": ui.bgTab,
  "toolbar.background": ui.bg, // cùng nền editor để thanh breadcrumb không thành một dải dày
  "panel.background": ui.bgPanel,
  "panel.focused_border": ui.focus,
  "panel.indent_guide": ui.treeGuide,
  "panel.indent_guide_active": ui.treeGuideActive,
  "panel.indent_guide_hover": ui.fgMuted,
  "pane.focused_border": ui.focus,
  "pane_group.border": ui.border,

  "scrollbar.thumb.background": "#ffffff22",
  "scrollbar.thumb.hover_background": "#ffffff44",
  "scrollbar.thumb.border": "#00000000",
  "scrollbar.track.background": "#00000000",
  "scrollbar.track.border": "#00000000",

  "editor.background": ui.bg,
  "editor.foreground": ui.fg,
  "editor.gutter.background": ui.bg,
  "editor.subheader.background": ui.bgFloat,
  "editor.active_line.background": ui.bgLine,
  "editor.highlighted_line.background": alpha(ui.accent, "12"), // = range highlight VS Code
  "editor.line_number": ui.fgDim,
  "editor.active_line_number": ui.fgActiveLineNr,
  "editor.invisible": ui.invisible,
  "editor.wrap_guide": ui.indent,
  "editor.active_wrap_guide": ui.invisible,
  "editor.indent_guide": ui.indent,
  "editor.indent_guide_active": ui.indentActive,
  "editor.document_highlight.read_background": alpha(ui.focus, "33"), // = word highlight VS Code
  "editor.document_highlight.write_background": alpha(ui.focus, "40"),
  "editor.document_highlight.bracket_background": alpha(ui.accent, "2E"), // Zed không có viền ngoặc → nền xanh mờ
  "search.match_background": alpha(ui.yellow, "33"), // = find match VS Code (hổ phách)
  "search.active_match_background": ui.findMatch, // kết quả đang chọn: nâu ember, như VS Code
  "editor.debugger_active_line.background": alpha(ui.green, "22"),
  "editor.code_lens.foreground": ui.fgMuted,
  "editor.hover_line_number": ui.fgSoft,
  "element.selection_background": alpha(ui.selection, "E6"), // bôi đen trong ô input
  "drop_target.border": ui.accent,
  "panel.overlay_background": ui.bgFloat,
  "panel.overlay_hover": ui.bgHover,
  "debugger.accent": ui.red, // breakpoint
  "scrollbar.thumb.active_background": "#ffffff55",
  "minimap.thumb.background": alpha(ui.accent, "1F"), // = minimapSlider VS Code
  "minimap.thumb.hover_background": alpha(ui.accent, "2E"),
  "minimap.thumb.active_background": alpha(ui.accent, "40"),
  "minimap.thumb.border": "#00000000",

  "terminal.background": ui.bg,
  "terminal.ansi.background": ui.bg,
  "terminal.foreground": ui.fg,
  "terminal.bright_foreground": ui.fgBright,
  "terminal.dim_foreground": ui.fgMuted,
  ...Object.fromEntries(
    Object.entries(ansi).map(([k, v]) => [
      "terminal.ansi." + k.replace(/^(bright|dim)([A-Z])/, (_, p, c) => `${p}_${c.toLowerCase()}`),
      v,
    ]),
  ),

  accents, // Zed dùng accents để tô ngoặc theo cấp (colorize_brackets)
  // Người dùng chính (index 0) dùng màu vùng chọn đặc như VS Code; cộng tác viên giữ màu riêng
  players: accents.map((c, i) => ({ cursor: c, background: c, selection: i === 0 ? alpha(ui.selection, "E6") : alpha(c, "33") })),
  syntax: Object.fromEntries(Object.entries(syntaxStyles).sort(([a], [b]) => a.localeCompare(b))),
};

export const zedTheme = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "Ember Tide",
  author: "Hoang",
  themes: [{ name: "Ember Tide", appearance: "dark", style }],
};

// Rule semantic token cho settings.json của Zed — giữ đồng bộ với theme
export const zedSemanticRules = [
  { token_type: "decorator", foreground_color: s.attribute },
  { token_type: "function", token_modifiers: ["decorator"], foreground_color: s.attribute },
  { token_type: "method", token_modifiers: ["decorator"], foreground_color: s.attribute },
  { token_type: "namespace", foreground_color: s.namespace },
  // parameter property (`private readonly prisma`) = thuộc tính của class → cùng màu với this.prisma
  { token_type: "parameter", token_modifiers: ["readonly"], foreground_color: s.property, font_style: "normal" },
  { token_type: "parameter", foreground_color: s.parameter, font_style: "italic" },
  { token_type: "typeParameter", foreground_color: s.type, font_style: "italic" }, // = VS Code: generic T nghiêng
  { token_type: "variable", token_modifiers: ["defaultLibrary"], foreground_color: s.special },
  { token_type: "variable", foreground_color: s.variable },
  { token_type: "property", foreground_color: s.property },
  { token_type: "field", foreground_color: s.property },
  { token_type: "function", foreground_color: s.func },
  { token_type: "method", foreground_color: s.func },
];
