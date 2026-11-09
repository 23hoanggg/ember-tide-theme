// Nguồn màu duy nhất cho Ember Tide — cả Zed lẫn VS Code đều build từ file này.
// Sửa màu ở đây rồi chạy `npm run build`.

export const ui = {
  // Nền: từ tối nhất (khung) tới sáng nhất (phần tử đang active)
  bgDeep: "#111721", // title bar, tab bar, status bar, activity bar
  bgPanel: "#141A24", // sidebar, panel
  bg: "#171D28", // editor
  bgFloat: "#1B222F", // popup, hover, widget nổi
  bgLine: "#1C2433", // dòng hiện tại
  bgInput: "#1E2735", // ô input, element nền
  bgTabBar: "#111721", // dải tab — cùng tông xanh đêm với title bar, không bị đen lạc màu
  bgTab: "#1F2A3B", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
  bgHover: "#222D3D",
  bgSelected: "#2B3A4E",
  bgActive: "#35465D",
  bgInfo: "#1E293B",

  border: "#2A3546",
  borderSoft: "#202A38",
  borderTide: "#2E4560", // viền tab — xanh thủy triều trầm

  fg: "#DCE3EE",
  fgSoft: "#C3CDDC",
  fgBright: "#F0F4FA",
  fgMuted: "#8592A8",
  fgDim: "#5F6E86",
  fgActiveLineNr: "#A9B6C9",

  indent: "#293548",
  indentActive: "#526782",
  invisible: "#3A4860",

  accent: "#70C7FF",
  ember: "#F7A26C", // than hồng — điểm nhấn tab đang mở
  focus: "#79CFC8",
  glow: "#70C7FF2E", // nền sáng mờ khi hover nút X / icon button

  // Trạng thái
  green: "#A9D77B",
  yellow: "#E8B96F",
  red: "#FF7F9F",
  coral: "#E99A82",
  ignored: "#69778D",
  bgGreen: "#1F2A1E",
  bgYellow: "#2A261E",
  bgRed: "#2E1F24",
  bgCoral: "#2E2320",
};

// Màu cú pháp. Tất cả đều ≥ 7:1 trên nền editor (comment ≥ 4.5:1).
export const syntax = {
  comment: "#808EA6",
  commentDoc: "#93A3BA",

  keyword: "#D29BFF", // tím
  func: "#70C7FF", // xanh trời
  property: "#72D4C9", // xanh ngọc
  type: "#F2CC78", // vàng
  typeBuiltin: "#B3B1FF", // tím lavender — string, number, bool…
  namespace: "#EBD39B", // vàng kem — module, namespace
  number: "#F9AA6B", // cam — số, hằng, boolean
  attribute: "#FF9E64", // cam đậm — decorator, attribute, @id của Prisma
  string: "#ACE08F", // xanh lá
  regex: "#F5A3D6", // hồng
  escape: "#F2CC78",
  variable: "#EDA898", // san hô nhạt
  parameter: "#F2B880", // đào, in nghiêng
  special: "#F08C86", // this, self, super — in nghiêng
  tag: "#FF829B", // tag HTML/JSX
  operator: "#9FD3E6", // toán tử ký hiệu
  punctuation: "#9AA8BD", // dấu ; , . — chìm hơn chữ để code dễ đọc
  bracket: "#B7C3D4",
  ghost: "#5F6D84", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác
export const accents = ["#70C7FF", "#FF9DDE", "#FFD270", "#79CFC8", "#FF9E64", "#B6E3A1"];

export const ansi = {
  black: "#273142",
  red: "#FF7F9F",
  green: "#A9D77B",
  yellow: "#E8B96F",
  blue: "#5CAFEB",
  magenta: "#D7A0F7",
  cyan: "#79CFC8",
  white: "#C5D0E0",
  brightBlack: "#748197",
  brightRed: "#FF9DB4",
  brightGreen: "#C0E69E",
  brightYellow: "#FFD69A",
  brightBlue: "#70C7FF",
  brightMagenta: "#E3B8FF",
  brightCyan: "#A4E2DC",
  brightWhite: "#F0F4FA",
  dimBlack: "#1C2433",
  dimRed: "#B85A72",
  dimGreen: "#7A9C59",
  dimYellow: "#A88650",
  dimBlue: "#427EAA",
  dimMagenta: "#9B73B3",
  dimCyan: "#57958F",
  dimWhite: "#8E97A6",
};

// Thêm alpha (00–FF) vào mã hex
export const alpha = (hex, a) => hex + a;
