// Ember Tide Neon — cùng bản sắc & vai trò màu với Dark, nền chàm đêm sâu hơn, màu cú pháp rực hơn (chroma OKLCH cao hơn).
// Sửa màu ở đây rồi chạy `npm run build`. Kiểm tra: `node scripts/palette-report.mjs neon`.

export const ui = {
  // Nền: từ tối nhất (khung) tới sáng nhất (phần tử đang active)
  bgDeep: "#07091B", // title bar, tab bar, status bar, activity bar — đêm chàm sâu nhất
  bgPanel: "#090C1F", // sidebar, panel
  bg: "#0C0F23", // editor — chàm đêm, tối hơn Dark nhưng không đen tuyền
  bgFloat: "#11152D", // popup, hover, widget nổi
  bgLine: "#181B3C", // dòng hiện tại — ánh chàm tím, đủ rõ để thấy con trỏ
  bgInput: "#141932", // ô input, element nền
  bgTabBar: "#07091B", // dải tab — cùng tông với title bar
  bgTabHover: "#0E122B", // hover tab thường: giữa dải tab và tab active
  bgTab: "#181F42", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
  bgHover: "#1A1F3C",
  bgSelected: "#232A50",
  bgActive: "#2E3664",
  bgInfo: "#0C1C39",

  border: "#232947",
  borderSoft: "#181C33",
  borderTide: "#114C71", // viền tab — xanh điện trầm, ánh neon nhẹ

  fg: "#D8DCEC",
  fgSoft: "#C6CDE3",
  fgBright: "#F2F5FE",
  fgMuted: "#909ABB",
  fgDim: "#61698F",
  fgActiveLineNr: "#FE8959", // số dòng hiện tại = ember neon, cùng điểm nhấn với tab đang mở
  indent: "#252B49", // đường thụt lề trong editor
  indentActive: "#4E5785",
  treeGuide: "#353D62", // đường kẻ thư mục ở sidebar
  treeGuideActive: "#606B9D",
  selection: "#1C3872", // vùng bôi đen — xanh chàm đặc, đồng đều trên mọi dòng
  selectionInactive: "#1A305A",
  listSelected: "#02405E", // dòng được chọn trong cây thư mục, ánh xanh thủy triều điện
  // Mỗi loại highlight một sắc riêng: chọn = xanh chàm, tìm kiếm = hổ phách, list = thủy triều
  findMatch: "#5C3419", // kết quả tìm đang chọn (đặc, kèm viền ember)
  button: "#166EB9",
  buttonHover: "#1A5C9E",
  invisible: "#373D5D",
  accent: "#5ED0FF", // xanh điện — link, focus, badge
  ember: "#FE8959", // than hồng neon — điểm nhấn tab đang mở
  focus: "#38DEDA", // viền focus — xanh ngọc điện
  glow: "#5ED0FF45", // nền sáng mờ khi hover nút X / icon button — ánh neon đậm hơn Dark
  overlay: "#FFFFFF", // màu phủ cho thanh cuộn/minimap
  shadow: "#000000",

  // Trạng thái
  green: "#98E36B",
  yellow: "#FABB41",
  red: "#FE6C8F",
  coral: "#FC8E72",
  ignored: "#6A7392",
  bgGreen: "#122612",
  bgYellow: "#281F0B",
  bgRed: "#31131D",
  bgCoral: "#311913",
};

// Màu cú pháp. Tất cả đều ≥ 7:1 trên nền editor (comment ≥ 4.5:1).
export const syntax = {
  comment: "#8896B9", // xám đá phớt chàm — chìm rõ so với chữ thường
  commentDoc: "#91A2C5",
  keyword: "#E387FF", // tím neon
  func: "#33BDFE", // xanh trời điện
  property: "#0FDAC8", // xanh ngọc
  type: "#F2BC20", // vàng
  typeBuiltin: "#B69EFF", // tím lavender — string, number, bool…
  namespace: "#C2AA3C", // vàng ô liu — cùng họ vàng với type nhưng trầm hơn → `React.SubmitEvent` đọc liền một cụm
  number: "#FF904C", // cam neon — số, hằng, boolean
  attribute: "#2DDC96", // xanh bạc hà — decorator, attribute
  string: "#80D857", // xanh lá
  regex: "#FF9CE0", // hồng — regex
  escape: "#F1BC1E",
  variable: "#FFA18D", // san hô nhạt
  parameter: "#FF8088", // đỏ san hô, in nghiêng
  special: "#88ABFE", // xanh phớt tím, đậm + nghiêng — this, self, super
  tag: "#FF7CAB", // hồng đỏ — tag HTML/JSX
  operator: "#75B7C4", // cyan xám — dịu, là "chất keo" không tranh chú ý
  punctuation: "#9AA5C2", // dấu ; , . — chìm hơn chữ
  bracket: "#AFB7CF",
  ghost: "#5E698B", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác — bản neon rực hơn
export const accents = ["#6BCEFF", "#FD88D9", "#FDCA3A", "#3ADFD7", "#FE904D", "#96EA83"];

export const ansi = {
  black: "#424B6B", // đủ thấy trên nền tối
  red: "#FE6C8F",
  green: "#92E466",
  yellow: "#FBC044",
  blue: "#3BA6F5",
  magenta: "#D780FC",
  cyan: "#2AD7D7",
  white: "#CAD0E5",
  brightBlack: "#757F9F",
  brightRed: "#FE98AB",
  brightGreen: "#ACF688",
  brightYellow: "#FFDD96",
  brightBlue: "#72C8FE",
  brightMagenta: "#E4A9FF",
  brightCyan: "#74EEEE",
  brightWhite: "#F2F5FE",
  dimBlack: "#353C55",
  dimRed: "#C14D69",
  dimGreen: "#69A549",
  dimYellow: "#B48B39",
  dimBlue: "#297AB6",
  dimMagenta: "#A161BD",
  dimCyan: "#229C9C",
  dimWhite: "#9198AB",
};

export default { id: "neon", name: "Ember Tide Neon", type: "dark", publish: true, ui, syntax, accents, ansi };
