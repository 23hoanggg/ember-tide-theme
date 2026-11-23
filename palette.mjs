// Ember Tide — điểm gom các biến thể.
//   palettes/dark.mjs        Ember Tide (phát hành)
//   private/palettes/*.mjs   biến thể cục bộ (publish: false) — chỉ có trên máy chủ dự án, thư mục bị gitignore.
// Sửa màu trong các file bảng màu rồi chạy `npm run build`.
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
import dark from "./palettes/dark.mjs";

// Bảng màu Dark xuất trực tiếp để các script cũ (kiểm tra, preview) vẫn dùng được
export { ui, syntax, accents, ansi } from "./palettes/dark.mjs";

// Thêm alpha (00–FF) vào mã hex
export const alpha = (hex, a) => hex + a;

// Nạp biến thể cục bộ nếu có (không bắt buộc — repo công khai chạy được khi thiếu)
const privateDir = join(fileURLToPath(new URL(".", import.meta.url)), "private", "palettes");
const local = [];
if (existsSync(privateDir)) {
  for (const f of readdirSync(privateDir).filter((f) => f.endsWith(".mjs")).sort()) {
    const P = (await import(pathToFileURL(join(privateDir, f)).href)).default;
    if (P?.publish) throw new Error(`${f}: biến thể trong private/ phải có publish: false`);
    if (P) local.push(P);
  }
}

export { dark };
export const variants = [dark, ...local];
// Phát hành (Marketplace, kho Zed, terminals/ trong repo) chỉ gồm biến thể publish: true.
// Biến thể cục bộ chỉ build vào dist/local/ (không vào git) và cài bằng `npm run install:local`.
export const publicVariants = variants.filter((v) => v.publish);
export const localVariants = variants.filter((v) => !v.publish);
