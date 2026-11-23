// Golden snapshot tô màu: mỗi file trong tools/samples được tokenize bằng grammar VS Code thật + theme đã build,
// so với test/golden/<file>.txt. Cần tools/node_modules và VS Code cài sẵn (/usr/share/code) — thiếu thì bỏ qua.
// Cố ý đổi màu? Chạy: npm run build && node tools/snapshot.mjs --update
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const READY = existsSync("tools/node_modules/vscode-textmate") && existsSync("tools/node_modules/vscode-oniguruma")
  && existsSync("/usr/share/code/resources/app/extensions") && existsSync("themes/ember-tide-color-theme.json");

test("golden snapshot tô màu các ngôn ngữ mẫu", async (t) => {
  if (!READY) return t.skip("thiếu tools/node_modules, VS Code grammars hoặc theme đã build");
  const { samples, render, loadTheme, goldenPath } = await import("../tools/snapshot.mjs");
  const theme = loadTheme();
  for (const { file, scope } of samples()) {
    await t.test(file, async (st) => {
      if (!scope) return st.skip("máy này không có grammar cho file này");
      const gp = goldenPath(file);
      if (!existsSync(gp)) return st.skip("chưa có golden — chạy node tools/snapshot.mjs --update");
      const want = readFileSync(gp, "utf8").split("\n"), got = (await render(theme, file)).split("\n");
      const diff = [];
      for (let i = 0; i < Math.max(want.length, got.length) && diff.length < 5; i++)
        if (want[i] !== got[i]) diff.push(`dòng ${i}:\n  golden: ${want[i]}\n  hiện tại: ${got[i]}`);
      assert.equal(diff.length, 0, `${file} lệch golden (node tools/snapshot.mjs --update nếu cố ý):\n${diff.join("\n")}`);
    });
  }
});
