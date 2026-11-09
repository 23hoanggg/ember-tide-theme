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
- `whythohh` → ID publisher (tạo ở Bước 2), trong **`package.json`**.

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
   *ID* là chuỗi viết thường, không dấu, ví dụ `hoang-dev`, và không đổi được về sau. Điền ID này vào `whythohh`.
2. **Tạo Personal Access Token (PAT):**
   - Vào <https://dev.azure.com>, tạo một organization bất kỳ nếu chưa có.
   - Vào *User settings* (góc trên phải) → *Personal access tokens* → *New Token*.
   - Organization: **All accessible organizations**. Scopes: *Custom defined* → *Show all scopes* → **Marketplace → Manage**.
   - Copy token và cất kỹ, vì nó chỉ hiện một lần.
3. **Đăng nhập và phát hành:**
   ```sh
   npx @vscode/vsce login whythohh   # dán PAT khi được hỏi
   npm run publish:vscode
   ```
4. Chờ khoảng 5–10 phút để Marketplace duyệt tự động, rồi tìm "Ember Tide" trong VS Code.

## Bước 3 — Open VSX (cho VSCodium / Cursor / Windsurf)

1. Đăng nhập <https://open-vsx.org> bằng GitHub.
2. Vào *Settings* → liên kết tài khoản **Eclipse** (tạo mới nếu chưa có) → ký **Publisher Agreement**.
3. Vào *Settings → Access Tokens* → *Generate New Token*.
4. Phát hành:
   ```sh
   npx ovsx create-namespace whythohh -p <OPEN_VSX_TOKEN>   # chỉ lần đầu
   npm run publish:ovsx -- -p <OPEN_VSX_TOKEN>
   ```

## Bước 4 — Zed Extensions

Zed không có trang upload: bạn mở một Pull Request vào [`zed-industries/extensions`](https://github.com/zed-industries/extensions).
Quy định chính (https://zed.dev/docs/extensions/publishing/prerequisites): ID kết thúc bằng `-theme`, extension chỉ chứa file
Zed dùng (`zed/` = `extension.toml` + `themes/` + `LICENSE`), license nằm **trong** `zed/`, submodule dùng URL **HTTPS**,
mỗi PR chỉ một extension, trả lời review trong 3 tuần.

0. **Thử trong Zed trước** (bắt buộc): Command Palette → `zed: install dev extension` → chọn thư mục `zed/` của repo này.
1. Fork https://github.com/zed-industries/extensions về tài khoản cá nhân (không phải organization), rồi:
   ```sh
   git clone --depth 1 git@github.com:23hoanggg/extensions.git zed-extensions   # không cần tải 1500+ submodule khác
   cd zed-extensions
   git submodule add https://github.com/23hoanggg/ember-tide-theme.git extensions/ember-tide-theme
   ```
2. Thêm vào `extensions.toml` (đúng vị trí theo thứ tự chữ cái — hoặc chạy `pnpm install && pnpm sort-extensions`):
   ```toml
   [ember-tide-theme]
   submodule = "extensions/ember-tide-theme"
   path = "zed"
   version = "1.0.0"
   ```
3. Commit, push lên fork, rồi mở PR "Add Ember Tide theme" vào `zed-industries/extensions:main`.
4. Merge xong là theme hiện trong `zed: extensions`. Khi đó xoá file cài tay `~/.config/zed/themes/ember-tide.json`.

---

## Phát hành bản cập nhật

1. Sửa màu trong `palette.mjs` → `npm run build`, rồi kiểm tra trên máy bằng `npm run install:all`.
2. Tăng phiên bản ở **cả** `package.json` và `zed/extension.toml` (vd `1.0.0` → `1.1.0`), rồi thêm mục `## 1.1.0` vào `CHANGELOG.md`.
3. `npm run check` → commit → `git push`.
4. `npm run publish:vscode` và `npm run publish:ovsx -- -p <token>`.
5. Zed: trong bản fork `zed-extensions`, chạy `git submodule update --remote extensions/ember-tide-theme`, sửa `version` trong `extensions.toml` cho khớp `zed/extension.toml`, rồi mở PR mới.

Quy ước phiên bản: chỉnh màu nhỏ thì tăng số cuối (`1.0.1`), thêm hoặc đổi nhiều màu thì tăng số giữa (`1.1.0`).
