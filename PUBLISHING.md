# Hướng dẫn phát hành Ember Tide

Theme sẽ có mặt ở 3 nơi:

| Nơi | Ai dùng | Tài khoản cần có |
|---|---|---|
| **VS Code Marketplace** | VS Code (cả Windows, Settings Sync tự cài) | Microsoft + Azure DevOps |
| **Open VSX** | VSCodium, Cursor, Windsurf, Gitpod… | Eclipse + GitHub |
| **Zed Extensions** | Zed | GitHub |

Trước mỗi lần phát hành chạy `npm run check`. Lệnh này báo lỗi nếu còn placeholder, phiên bản bị lệch hoặc thiếu file.

---

## Bước 0 — Điền thông tin của bạn (làm 1 lần)

Thay 2 placeholder:

- ~~`23hoanggg`~~ → đã điền `23hoanggg`.
- `PUBLISHER_ID` → ID publisher (tạo ở Bước 2), trong **`package.json`**.

> Đổi publisher thì ID extension sẽ thành `<publisher>.ember-tide-theme`. Bản bạn tự cài lúc trước
> (`hoang.ember-tide-theme`) là một extension khác. Hãy gỡ nó đi sau khi cài bản từ Marketplace:
> `code --uninstall-extension hoang.ember-tide-theme`

## Bước 1 — Đưa code lên GitHub

1. Vào <https://github.com/new>, tạo repo **public** tên `ember-tide-theme`. Đừng tick tạo README.
2. Push lên:
   ```sh
   git remote add origin git@github.com:23hoanggg/ember-tide-theme.git
   git push -u origin main
   ```

Repo phải là public, vì Marketplace lấy ảnh preview trong README từ GitHub, còn Zed build theme trực tiếp từ repo.

## Bước 2 — VS Code Marketplace

1. **Tạo publisher:** vào <https://marketplace.visualstudio.com/manage>, đăng nhập bằng tài khoản Microsoft → *Create publisher*.
   *ID* là chuỗi viết thường, không dấu, ví dụ `hoang-dev`, và không đổi được về sau. Điền ID này vào `PUBLISHER_ID`.
2. **Tạo Personal Access Token (PAT):**
   - Vào <https://dev.azure.com>, tạo một organization bất kỳ nếu chưa có.
   - Vào *User settings* (góc trên phải) → *Personal access tokens* → *New Token*.
   - Organization: **All accessible organizations**. Scopes: *Custom defined* → *Show all scopes* → **Marketplace → Manage**.
   - Copy token và cất kỹ, vì nó chỉ hiện một lần.
3. **Đăng nhập và phát hành:**
   ```sh
   npx @vscode/vsce login PUBLISHER_ID   # dán PAT khi được hỏi
   npm run publish:vscode
   ```
4. Chờ khoảng 5–10 phút để Marketplace duyệt tự động, rồi tìm "Ember Tide" trong VS Code.

## Bước 3 — Open VSX (cho VSCodium / Cursor / Windsurf)

1. Đăng nhập <https://open-vsx.org> bằng GitHub.
2. Vào *Settings* → liên kết tài khoản **Eclipse** (tạo mới nếu chưa có) → ký **Publisher Agreement**.
3. Vào *Settings → Access Tokens* → *Generate New Token*.
4. Phát hành:
   ```sh
   npx ovsx create-namespace PUBLISHER_ID -p <OPEN_VSX_TOKEN>   # chỉ lần đầu
   npm run publish:ovsx -- -p <OPEN_VSX_TOKEN>
   ```

## Bước 4 — Zed Extensions

Zed không có trang upload. Bạn mở một Pull Request vào repo [`zed-industries/extensions`](https://github.com/zed-industries/extensions):

1. Fork repo đó về GitHub của bạn, rồi clone bản fork:
   ```sh
   git clone https://github.com/23hoanggg/extensions.git zed-extensions
   cd zed-extensions
   git submodule add https://github.com/23hoanggg/ember-tide-theme.git extensions/ember-tide
   ```
2. Thêm vào cuối file `extensions.toml`:
   ```toml
   [ember-tide]
   submodule = "extensions/ember-tide"
   path = "zed"
   version = "1.0.0"
   ```
   `path = "zed"` báo cho Zed biết extension nằm trong thư mục `zed/` của repo, gồm `extension.toml`, `themes/` và `LICENSE`.
3. Sắp xếp file theo yêu cầu của repo (cần cài `pnpm`), rồi commit và push:
   ```sh
   pnpm install && pnpm sort-extensions
   git add . && git commit -m "Add Ember Tide theme" && git push
   ```
4. Mở Pull Request từ bản fork. Đội Zed review, thường vài ngày. Merge xong là theme hiện trong `zed: extensions`.

---

## Phát hành bản cập nhật

1. Sửa màu trong `palette.mjs` → `npm run build`, rồi kiểm tra trên máy bằng `npm run install:all`.
2. Tăng phiên bản ở **cả** `package.json` và `zed/extension.toml` (vd `1.0.0` → `1.1.0`), rồi thêm mục `## 1.1.0` vào `CHANGELOG.md`.
3. `npm run check` → commit → `git push`.
4. `npm run publish:vscode` và `npm run publish:ovsx -- -p <token>`.
5. Zed: trong bản fork `zed-extensions`, chạy `git submodule update --remote extensions/ember-tide`, sửa `version` trong `extensions.toml`, rồi mở PR mới.

Quy ước phiên bản: chỉnh màu nhỏ thì tăng số cuối (`1.0.1`), thêm hoặc đổi nhiều màu thì tăng số giữa (`1.1.0`).
