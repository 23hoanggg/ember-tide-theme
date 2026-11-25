// CSS cho Markdown preview của VS Code: preview tô code bằng highlight.js với bảng màu riêng (vs2015/vs),
// không theo theme. Extension đóng góp file này qua "markdown.previewStyles"; mỗi theme chỉ áp khi đang được chọn
// (webview gắn data-vscode-theme-id / data-vscode-theme-name = tên theme lên <body>), theme khác không bị ảnh hưởng.
const sel = (P) => [`body[data-vscode-theme-id="${P.name}"]`, `body[data-vscode-theme-name="${P.name}"]`];

export function markdownPreviewCss(variants) {
  const out = ["/* Ember Tide — màu code trong Markdown preview. Sinh bởi `npm run build` — đừng sửa tay. */"];
  for (const P of variants) {
    const s = P.syntax, ui = P.ui, it = P.noItalic ? "normal" : "italic";
    const rules = [
      [["keyword", "meta-keyword", "template-tag", "doctag", "selector-pseudo"], s.keyword],
      [["title", "title.function_", "section", "link"], s.func],
      [["type", "class", "title.class_", "title.class_.inherited__", "selector-class", "selector-id"], s.type],
      [["built_in", "builtin-name"], s.typeBuiltin],
      [["number", "literal", "symbol", "bullet", "variable.constant_"], s.number],
      [["string", "meta-string", "meta .hljs-string"], s.string],
      [["regexp"], s.regex],
      [["char.escape_"], s.escape],
      [["attr", "attribute", "property"], s.property],
      [["meta", "selector-attr"], s.attribute],
      [["variable", "template-variable"], s.variable],
      [["name", "selector-tag"], s.tag],
      [["tag"], s.punctuation],
      [["operator"], s.operator],
      [["punctuation"], s.punctuation],
      [["subst", "formula", "function"], ui.fg],
    ];
    const pre = sel(P);
    const css = (classes, decl) => `${pre.flatMap((b) => classes.map((c) => `${b} .hljs-${c.replace(/\./g, ".")}`)).join(",\n")} { ${decl} }`;
    out.push(`\n/* ${P.name} */`);
    for (const [classes, color] of rules) out.push(css(classes, `color: ${color};`));
    out.push(css(["params"], `color: ${s.parameter}; font-style: ${it};`));
    out.push(css(["variable.language_"], `color: ${s.special}; font-style: ${it};`));
    out.push(css(["comment", "quote"], `color: ${s.comment}; font-style: ${it};`));
    out.push(css(["emphasis"], `font-style: ${it};`));
    out.push(css(["strong"], `color: ${s.number}; font-weight: normal;`)); // không in đậm (luật của theme)
    out.push(css(["addition"], `color: ${ui.green};`));
    out.push(css(["deletion"], `color: ${ui.red};`));
  }
  return out.join("\n") + "\n";
}
