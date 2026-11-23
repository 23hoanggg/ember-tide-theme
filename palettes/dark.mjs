// Ember Tide (Dark) — bảng màu phát hành. Biến thể cục bộ (nếu có) nằm trong private/palettes/.
// Sửa màu ở đây rồi chạy `npm run build`.

export const ui = {
  // Nền: từ tối nhất (khung) tới sáng nhất (phần tử đang active)
  bgDeep: "#14171B", // title bar, tab bar, status bar, activity bar
  bgPanel: "#171A1E", // sidebar, panel
  bg: "#1A1D22", // editor
  bgFloat: "#1F2228", // popup, hover, widget nổi
  bgLine: "#272B33", // dòng hiện tại — đủ rõ để thấy ngay con trỏ đang ở đâu
  bgInput: "#23272D", // ô input, element nền
  bgTabBar: "#14171B",
  bgTabHover: "#1C2026", // hover tab thường: nằm giữa dải tab và tab active // dải tab — cùng tông xanh đêm với title bar, không bị đen lạc màu
  bgTab: "#282D35", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
  bgHover: "#282D34",
  bgSelected: "#333A43",
  bgActive: "#3E4650",
  bgInfo: "#242931",

  border: "#30353C",
  borderSoft: "#252A30",
  borderTide: "#374555", // viền tab — xanh thủy triều trầm

  fg: "#DFE3E8",
  fgSoft: "#C8CDD4",
  fgBright: "#F2F4F7",
  fgMuted: "#8E96A3",
  fgDim: "#656E7C",
  fgActiveLineNr: "#F7A26C", // số dòng hiện tại = ember, cùng điểm nhấn với tab đang mở

  indent: "#333C48", // đường thụt lề trong editor
  indentActive: "#526782",
  treeGuide: "#404A58", // đường kẻ thư mục ở sidebar — rõ hơn trên nền panel
  treeGuideActive: "#5F7591",
  selection: "#2A4263", // vùng bôi đen — màu đặc, đồng đều trên mọi dòng
  selectionInactive: "#233650",
  listSelected: "#2C4767",
  // Mỗi loại highlight một sắc riêng: chọn = xanh dương, tìm kiếm = hổ phách, cùng biến = ngọc
  findMatch: "#55402F", // kết quả tìm đang chọn (đặc, kèm viền ember)
  button: "#2F6E9E",
  buttonHover: "#367AAD", // dòng được chọn trong cây thư mục, ánh xanh thủy triều
  invisible: "#404856",

  accent: "#70C7FF",
  ember: "#F7A26C", // than hồng — điểm nhấn tab đang mở
  focus: "#79CFC8",
  glow: "#70C7FF2E", // nền sáng mờ khi hover nút X / icon button
  overlay: "#FFFFFF", // màu phủ cho thanh cuộn/minimap (bản sáng dùng đen)
  shadow: "#000000",

  // Trạng thái
  green: "#A9D77B",
  yellow: "#E8B96F",
  red: "#FF7F9F",
  coral: "#E99A82",
  ignored: "#6E7784",
  bgGreen: "#1F2A1E",
  bgYellow: "#2A261E",
  bgRed: "#2E1F24",
  bgCoral: "#2E2320",
};

// Màu cú pháp. Tất cả đều ≥ 7:1 trên nền editor (comment ≥ 4.5:1).
export const syntax = {
  comment: "#8B94A2",
  commentDoc: "#99A3B0",

  keyword: "#D29BFF", // tím
  func: "#70C7FF", // xanh trời rực — chủ dự án chọn giữ (2026-11-23); với mù màu đỏ–lục gần keyword/typeBuiltin (xem CVD_ADVISORY)
  property: "#5ED7CB", // xanh ngọc
  type: "#F2CC78", // vàng
  typeBuiltin: "#B3B1FF", // tím lavender — string, number, bool…
  namespace: "#BDAA67", // vàng ô liu — module, namespace (React., std::, fmt.): cùng họ vàng với type nhưng trầm hơn → `React.SubmitEvent` đọc liền một cụm
  number: "#FF9F5E", // cam — số, hằng, boolean
  attribute: "#8EE0B5", // xanh bạc hà — decorator, attribute, @id của Prisma (tách khỏi cụm cam)
  string: "#ACE08F", // xanh lá
  regex: "#F7AEE6", // hồng — regex
  escape: "#F2CC78",
  variable: "#FFAA92", // san hô — rực hơn bản 1.0 (C .085→.106) và sáng hơn (L .79→.815); vẫn tách parameter/number ΔE ≥ 11.3
  parameter: "#FF8689", // đỏ san hô, in nghiêng — nổi rõ, tách khỏi type vàng, variable san hô nhạt (không nghiêng)
  special: "#8AB3FF", // xanh phớt tím, ĐẬM + nghiêng — this, self, super: từ khoá quan trọng, dễ bắt mắt khi đọc
  tag: "#FF8FB0", // hồng đỏ — tag HTML/JSX
  operator: "#8CBECB", // cyan xám — toán tử: dịu hơn keyword, chỉ sáng hơn dấu câu một chút (là "chất keo", không tranh chú ý)
  punctuation: "#9FA8B4", // dấu ; , . — chìm hơn chữ để code dễ đọc
  bracket: "#BBC3CD",
  ghost: "#646D7B", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác
export const accents = ["#70C7FF", "#FF9DDE", "#FFD270", "#79CFC8", "#FF9E64", "#B6E3A1"];

export const ansi = {
  black: "#4B515C", // đủ thấy trên nền tối (prompt/log hay in chữ màu black)
  red: "#FF7F9F",
  green: "#A9D77B",
  yellow: "#E8B96F",
  blue: "#5CAFEB",
  magenta: "#D7A0F7",
  cyan: "#79CFC8",
  white: "#CACFD7",
  brightBlack: "#7A818C",
  brightRed: "#FF9DB4",
  brightGreen: "#C0E69E",
  brightYellow: "#FFD69A",
  brightBlue: "#70C7FF",
  brightMagenta: "#E3B8FF",
  brightCyan: "#A4E2DC",
  brightWhite: "#F2F4F7",
  dimBlack: "#3D424B",
  dimRed: "#B85A72",
  dimGreen: "#7A9C59",
  dimYellow: "#A88650",
  dimBlue: "#427EAA",
  dimMagenta: "#9B73B3",
  dimCyan: "#57958F",
  dimWhite: "#92979E",
};

export default { id: "dark", name: "Ember Tide", type: "dark", publish: true, ui, syntax, accents, ansi };
