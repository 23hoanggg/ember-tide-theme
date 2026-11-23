// Vẽ lại ảnh preview cho README (bản phát hành):  node tools/previews.mjs
import path from "node:path"; import fs from "node:fs"; import os from "node:os"; import { execFileSync } from "node:child_process";
import { dark } from "../palette.mjs"; import { vscodeThemeFor } from "../src/vscode.mjs"; import { tokenize } from "./tokenize.mjs";
const here = path.dirname(new URL(import.meta.url).pathname), root = path.join(here, "..");
const theme = vscodeThemeFor(dark);
const shots = [
  { sample: "pdf.service.ts", out: "images/preview-typescript.png", from: 10, to: 32, active: 9, tabs: ["pdf.service.ts", "pdf.module.ts", "app.module.ts"], crumbs: ["src", "pdf", "pdf.service.ts", "PdfService", "create"] },
  { sample: "pipeline.py", out: "images/preview-python.png", from: 0, to: 22, active: 21, tabs: ["pipeline.py", "settings.toml"], crumbs: ["tools", "pipeline.py", "parse"] },
];
for (const s of shots) {
  const spec = path.join(os.tmpdir(), `ember-preview-${path.basename(s.out)}.json`);
  const tokens = (await tokenize(theme, path.join(here, "samples", s.sample))).slice(s.from, s.to);
  fs.writeFileSync(spec, JSON.stringify({ title: "Ember Tide", ui: dark.ui, tokens, tabs: s.tabs, crumbs: s.crumbs, active: s.active }));
  execFileSync("python3", [path.join(here, "render-window.py"), spec, path.join(root, s.out)]);
  fs.rmSync(spec);
  console.log("✔", s.out);
}
