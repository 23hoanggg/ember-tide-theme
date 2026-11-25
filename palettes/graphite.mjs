// Ember Tide Graphite — như Ember Tide (Dark) nhưng nền xám trung tính, cùng tông nền dark mặc định của trình duyệt
// (Firefox #1C1B22) để chuyển qua lại giữa editor và trang tài liệu đỡ chói. Cú pháp như Dark nhưng dịu hơn, cân độ sáng theo APCA.

export const ui = {
  // Nền: từ tối nhất (khung) tới sáng nhất (phần tử đang active)
  bgDeep: "#16151B", // title bar, tab bar, status bar, activity bar
  bgPanel: "#17161C", // sidebar, panel
  bg: "#1C1B22", // editor
  bgFloat: "#212027", // popup, hover, widget nổi
  bgLine: "#2A2930", // dòng hiện tại — đủ rõ để thấy ngay con trỏ đang ở đâu
  bgInput: "#26252C", // ô input, element nền
  bgTabBar: "#16151B",
  bgTabHover: "#1F1E25", // hover tab thường: nằm giữa dải tab và tab active // dải tab — cùng tông xanh đêm với title bar, không bị đen lạc màu
  bgTab: "#2C2B32", // tab đang mở + hàng breadcrumb/toolbar ngay dưới (liền một khối)
  bgHover: "#2B2A32",
  bgSelected: "#38373F",
  bgActive: "#44434B",
  bgInfo: "#28272E",

  border: "#33323A",
  borderSoft: "#28272F",
  borderTide: "#394552", // viền tab — xanh thủy triều trầm

  fg: "#D6D6D9",
  fgSoft: "#CCCBD1",
  fgBright: "#EAE9EE",
  onAccent: "#F0F4FA",
  fgMuted: "#95949D",
  fgDim: "#6D6C75",
  fgActiveLineNr: "#F7A26C", // số dòng hiện tại = ember, cùng điểm nhấn với tab đang mở

  indent: "#3A3941", // đường thụt lề trong editor
  indentActive: "#64636C",
  treeGuide: "#48474F", // đường kẻ thư mục ở sidebar — rõ hơn trên nền panel
  treeGuideActive: "#72717A",
  selection: "#354254", // vùng bôi đen — màu đặc, đồng đều trên mọi dòng
  selectionInactive: "#2D3643",
  listSelected: "#384758",
  // Mỗi loại highlight một sắc riêng: chọn = xanh dương, tìm kiếm = hổ phách, cùng biến = ngọc
  findMatch: "#55402F", // kết quả tìm đang chọn (đặc, kèm viền ember)
  button: "#2F6E9E",
  buttonHover: "#367AAD", // dòng được chọn trong cây thư mục, ánh xanh thủy triều
  invisible: "#47454E",

  accent: "#70C7FF",
  ember: "#F7A26C", // than hồng — điểm nhấn tab đang mở
  focus: "#79CFC8",
  glow: "#70C7FF2E", // nền sáng mờ khi hover nút X / icon button

  // Trạng thái
  green: "#A9D77B",
  yellow: "#E8B96F",
  red: "#FF7F9F",
  coral: "#E99A82",
  ignored: "#76757E",
  bgGreen: "#1F2A1E",
  bgYellow: "#2A261E",
  bgRed: "#2E1F24",
  bgCoral: "#2E2320",
};

// Màu cú pháp. Tất cả đều ≥ 7:1 trên nền editor (comment ≥ 4.5:1).
export const syntax = {
  comment: "#939BA5",
  commentDoc: "#9EA5B1",

  keyword: "#D09DFA", // tím
  func: "#70C7FF", // xanh trời
  property: "#6BC0B6", // xanh ngọc
  type: "#E0BC6A", // vàng
  typeBuiltin: "#ACABF5", // tím lavender — string, number, bool…
  namespace: "#C2C46E", // vàng ô liu — module, namespace (React., std::, fmt.): cùng họ vàng với type nhưng trầm hơn → `React.SubmitEvent` đọc liền một cụm
  number: "#F39D64", // cam — số, hằng, boolean
  attribute: "#82CBA4", // xanh bạc hà — decorator, attribute, @id của Prisma (tách khỏi cụm cam)
  string: "#9AC880", // xanh lá
  regex: "#D1A5C5", // hồng — regex
  escape: "#D8B66C",
  variable: "#E0A394", // san hô nhạt
  parameter: "#FF9295", // đỏ san hô, in nghiêng — nổi rõ, tách khỏi type vàng, variable san hô nhạt (không nghiêng)
  special: "#8AB3FF", // xanh phớt tím, ĐẬM + nghiêng — this, self, super: từ khoá quan trọng, dễ bắt mắt khi đọc
  tag: "#FF9ABB", // hồng đỏ — tag HTML/JSX
  operator: "#89B6C2", // cyan xám — toán tử: dịu hơn keyword, chỉ sáng hơn dấu câu một chút (là "chất keo", không tranh chú ý)
  punctuation: "#A1A8B2", // dấu ; , . — chìm hơn chữ để code dễ đọc
  bracket: "#B3B7BF",
  ghost: "#666D77", // gợi ý AI / inline completion
};

// Màu ngoặc lồng nhau (6 cấp) và màu con trỏ cho người cộng tác
export const accents = ["#65B1E2", "#E48DC7", "#E4BC66", "#6BB7B1", "#EB9562", "#A3CB91"];

export const ansi = {
  black: "#515058", // đủ thấy trên nền tối (prompt/log hay in chữ màu black)
  red: "#F786A1",
  green: "#ADD585",
  yellow: "#E4BA7B",
  blue: "#68AEE3",
  magenta: "#D4A4F0",
  cyan: "#83CDC7",
  white: "#CFCED4",
  brightBlack: "#807F88",
  brightRed: "#F6A3B6",
  brightGreen: "#C4E4A7",
  brightYellow: "#FAD7A5",
  brightBlue: "#7EC6F5",
  brightMagenta: "#E0BBF8",
  brightCyan: "#ACE0DB",
  brightWhite: "#EAE9EE",
  dimBlack: "#424148",
  dimRed: "#B25F73",
  dimGreen: "#7D9B60",
  dimYellow: "#A58758",
  dimBlue: "#4A7EA4",
  dimMagenta: "#9976AE",
  dimCyan: "#5E948E",
  dimWhite: "#96969B",
};

export default { id: "graphite", name: "Ember Tide Graphite", type: "dark", publish: true, ui, syntax, accents, ansi };
