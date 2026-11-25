// Ember Tide Light — bản sáng. Cùng bản sắc và cùng ánh xạ vai trò → sắc độ với Dark,
// nhưng các màu được hạ sáng/đậm hơn để đọc tốt trên nền giấy ấm.
// Sửa màu ở đây rồi chạy `npm run build`. Kiểm tra: `node scripts/palette-report.mjs light`.

export const ui = {
  // Nền giấy ấm: từ đậm nhất (khung) tới sáng nhất (popup). Không dùng trắng tinh để tránh chói.
  bgDeep: "#ECE6DC", // title bar, tab bar, status bar, activity bar
  bgPanel: "#F3EEE6", // sidebar, panel
  bg: "#FAF7F1", // editor — giấy ngà
  bgFloat: "#FFFDF9", // popup, hover, widget nổi — sáng nhất, nổi lên trên editor
  bgLine: "#F0EADF", // dòng hiện tại — ấm, đậm hơn nền một bậc, khác hẳn vùng chọn xanh
  bgInput: "#FFFDF9", // ô input, element nền
  bgTabBar: "#ECE6DC", // dải tab — cùng tông với title bar
  bgTabHover: "#F4EFE7", // hover tab thường: nằm giữa dải tab và tab active
  bgTab: "#FCFAF6", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
  bgHover: "#E3DCCF", // hover trong danh sách — thấy rõ trên sidebar
  bgSelected: "#DCE5EC",
  bgActive: "#CBD8E3",
  bgInfo: "#E4EDF4",

  border: "#DCD4C7",
  borderSoft: "#E6E0D5",
  borderTide: "#A7C0D3", // viền tab — xanh thủy triều nhạt

  fg: "#373E4C",
  fgSoft: "#404A5A",
  fgBright: "#141922", // chữ đậm nhất (trên nền sáng "bright" = tương phản cao nhất)
  fgMuted: "#5D6676",
  fgDim: "#757B85", // số dòng, icon không active (≥ 3:1 trên thanh activity)
  fgActiveLineNr: "#AF4B00", // số dòng hiện tại = ember (đậm hơn để đọc được trên nền sáng)

  indent: "#E2DBCF", // đường thụt lề trong editor
  indentActive: "#B5AC9E",
  treeGuide: "#D2C9BB", // đường kẻ thư mục ở sidebar
  treeGuideActive: "#A0968A",
  selection: "#D6E6F7", // vùng bôi đen — xanh dương nhạt: chữ cú pháp trong vùng chọn ≥ 4.4:1
  selectionInactive: "#E3ECF5",
  listSelected: "#D6E7EF", // dòng được chọn trong cây thư mục, ánh thủy triều — màu git trên nó ≥ 4.5:1
  // Mỗi loại highlight một sắc riêng: chọn = xanh dương, tìm kiếm = hổ phách, cùng biến = ngọc
  findMatch: "#F6CF92", // kết quả tìm đang chọn (đặc, kèm viền ember)
  button: "#1E679A",
  buttonHover: "#185A88",
  invisible: "#CEC6B8",

  accent: "#0068A2",
  ember: "#D2621F", // than hồng — điểm nhấn tab đang mở (viền trên)
  focus: "#1F6E69", // viền focus, link khi hover, Error Lens hint (đủ tương phản trên nền sáng)
  glow: "#0068A21F", // nền mờ khi hover nút X / icon button
  overlay: "#000000", // màu phủ cho thanh cuộn/minimap
  shadow: "#000000",
  onAccent: "#FFFFFF", // chữ trên nút / nền màu đặc
  onBadge: "#FFFFFF", // chữ trên badge (nền accent/yellow/red đậm)

  // Trạng thái
  green: "#3A7019",
  yellow: "#8C5A00",
  red: "#BF2F4E",
  coral: "#A84E36",
  ignored: "#968F85",
  bgGreen: "#E4EFDA",
  bgYellow: "#FAF0DE",
  bgRed: "#FBE7EA",
  bgCoral: "#F7E4DC",
  // Khoá riêng cho nền sáng (bộ sinh dùng giá trị mặc định khi bản tối không khai báo)
  onDebug: "#6B4500", // chữ status bar khi đang debug (nền hổ phách nhạt)
  textAlpha: "", // chữ Error Lens / inline value để đặc: alpha trên nền sáng kéo chữ về phía trắng
  diffAddedLine: "#6BBF4A1A", // nền dòng được thêm khi xem diff
  diffAddedText: "#6BBF4A33", // nền phần chữ thay đổi trong dòng thêm
  diffRemovedLine: "#E8788E22",
  diffRemovedText: "#E8788E33",
  shadowAlpha: "29", // bóng đổ nhẹ như Light+ của VS Code (nền tối dùng 4D)
};

// Màu cú pháp. Tất cả ≥ 5:1 trên nền editor (comment ≥ 5:1) và ≥ 4.5:1 trên dòng hiện tại.
export const syntax = {
  comment: "#616B77", // xám đá — chìm hơn chữ thường rõ rệt
  commentDoc: "#576A7B",

  keyword: "#803DA8", // tím
  func: "#0068A2", // xanh trời đậm
  property: "#00716F", // xanh ngọc
  type: "#8A5A00", // vàng hổ phách
  typeBuiltin: "#666098", // tím lavender — string, number, bool…
  namespace: "#615729", // vàng ô liu — trầm và tối hơn type → `React.SubmitEvent` đọc liền một cụm
  number: "#A54A00", // cam — số, hằng, boolean
  attribute: "#117449", // xanh bạc hà — decorator, attribute
  string: "#3D6F16", // xanh lá
  regex: "#934D85", // hồng — regex
  escape: "#8C5C00",
  variable: "#975646", // san hô trầm
  parameter: "#A82A34", // đỏ san hô, in nghiêng
  special: "#3952A7", // xanh phớt tím, ĐẬM + nghiêng — this, self, super
  tag: "#AA3A5D", // hồng đỏ — tag HTML/JSX
  operator: "#4B6E77", // cyan xám — dịu hơn keyword, chỉ nổi hơn dấu câu một chút
  punctuation: "#636B79", // dấu ; , . — chìm
  bracket: "#596371",
  ghost: "#8E877F", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác
export const accents = ["#0068A2", "#B03F96", "#946500", "#00807A", "#BD5516", "#4C8828"];

export const ansi = {
  black: "#2A313E", // màu chữ chính
  red: "#BF2F4E",
  green: "#3E7A1C",
  yellow: "#966200",
  blue: "#1D63B5",
  magenta: "#8B43AA",
  cyan: "#0F7C77",
  white: "#9C968C", // xám nhạt (trên nền sáng "white" gần như hoà vào nền)
  brightBlack: "#6D7685",
  brightRed: "#D4405C",
  brightGreen: "#4D8C2A",
  brightYellow: "#A97500",
  brightBlue: "#2E78CC",
  brightMagenta: "#A057BF",
  brightCyan: "#20918B",
  brightWhite: "#B5AFA6",
  dimBlack: "#5A6272",
  dimRed: "#CD7586",
  dimGreen: "#7C9D63",
  dimYellow: "#B6965A",
  dimBlue: "#6C93C5",
  dimMagenta: "#AC86C0",
  dimCyan: "#67A6A1",
  dimWhite: "#DAD3C7",
};

export default { id: "light", name: "Ember Tide Light", type: "light", publish: true, ui, syntax, accents, ansi };
