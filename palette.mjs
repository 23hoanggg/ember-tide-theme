// Nguồn màu duy nhất cho Ember Tide — cả Zed lẫn VS Code đều build từ file này.
// Sửa màu ở đây rồi chạy `npm run build`.

export const ui = {
  // Nền: từ tối nhất (khung) tới sáng nhất (phần tử đang active)
  bgDeep: "#111721", // title bar, tab bar, status bar, activity bar
  bgPanel: "#141A24", // sidebar, panel
  bg: "#171D28", // editor
  bgFloat: "#1B222F", // popup, hover, widget nổi
  bgLine: "#212B3D", // dòng hiện tại — đủ rõ để thấy ngay con trỏ đang ở đâu
  bgInput: "#1E2735", // ô input, element nền
  bgTabBar: "#111721",
  bgTabHover: "#18202D", // hover tab thường: nằm giữa dải tab và tab active // dải tab — cùng tông xanh đêm với title bar, không bị đen lạc màu
  bgTab: "#212D40", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
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
  fgMuted: "#8996AC",
  fgDim: "#5F6E86",
  fgActiveLineNr: "#F7A26C", // số dòng hiện tại = ember, cùng điểm nhấn với tab đang mở

  indent: "#2E3C51", // đường thụt lề trong editor
  indentActive: "#526782",
  treeGuide: "#3A4A61", // đường kẻ thư mục ở sidebar — rõ hơn trên nền panel
  treeGuideActive: "#5F7591",
  selection: "#2A4263", // vùng bôi đen — màu đặc, đồng đều trên mọi dòng
  selectionInactive: "#233650",
  listSelected: "#2C4767",
  // Mỗi loại highlight một sắc riêng: chọn = xanh dương, tìm kiếm = hổ phách, cùng biến = ngọc
  findMatch: "#55402F", // kết quả tìm đang chọn (đặc, kèm viền ember)
  button: "#2F6E9E",
  buttonHover: "#367AAD", // dòng được chọn trong cây thư mục, ánh xanh thủy triều
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
  comment: "#8694AC",
  commentDoc: "#93A3BA",

  keyword: "#D29BFF", // tím
  func: "#70C7FF", // xanh trời
  property: "#72D4C9", // xanh ngọc
  type: "#F2CC78", // vàng
  typeBuiltin: "#B3B1FF", // tím lavender — string, number, bool…
  namespace: "#BDAA67", // vàng ô liu — module, namespace (React., std::, fmt.): cùng họ vàng với type nhưng trầm hơn → `React.SubmitEvent` đọc liền một cụm
  number: "#FF9F5E", // cam — số, hằng, boolean
  attribute: "#8EE0B5", // xanh bạc hà — decorator, attribute, @id của Prisma (tách khỏi cụm cam)
  string: "#ACE08F", // xanh lá
  regex: "#F7AEE6", // hồng — regex
  escape: "#F2CC78",
  variable: "#EDA898", // san hô nhạt
  parameter: "#FF8689", // đỏ san hô, in nghiêng — nổi rõ, tách khỏi type vàng, variable san hô nhạt (không nghiêng)
  special: "#8AB3FF", // xanh phớt tím, ĐẬM + nghiêng — this, self, super: từ khoá quan trọng, dễ bắt mắt khi đọc
  tag: "#FF8FB0", // hồng đỏ — tag HTML/JSX
  operator: "#8CBECB", // cyan xám — toán tử: dịu hơn keyword, chỉ sáng hơn dấu câu một chút (là "chất keo", không tranh chú ý)
  punctuation: "#9AA8BD", // dấu ; , . — chìm hơn chữ để code dễ đọc
  bracket: "#B7C3D4",
  ghost: "#5F6D84", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác
export const accents = ["#70C7FF", "#FF9DDE", "#FFD270", "#79CFC8", "#FF9E64", "#B6E3A1"];

export const ansi = {
  black: "#465166", // đủ thấy trên nền tối (prompt/log hay in chữ màu black)
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
  dimBlack: "#384254",
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
