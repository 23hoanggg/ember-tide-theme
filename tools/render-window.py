# Vẽ ảnh preview kiểu cửa sổ editor đầy đủ (title bar, activity bar, tab, breadcrumb, số dòng, dòng hiện tại).
# python3 tools/render-window.py <spec.json> <out.png>
#   spec = {"title", "ui": {...}, "tokens": [[[text,color,style],...],...], "tabs": [...], "crumbs": [...], "active": n}
import json, sys
from PIL import Image, ImageDraw, ImageFont
sp = json.load(open(sys.argv[1])); out = sys.argv[2]
ui, lines = sp["ui"], sp["tokens"]
F = "/home/hoang-fedora/.local/share/fonts/JetBrainsMonoNerdFont-"; SC = 2; FS = 15 * SC; LH = int(15 * 1.6 * SC)
mono = {i: ImageFont.truetype(F + n, FS) for i, n in [(0, "Regular.ttf"), (1, "Italic.ttf"), (2, "Bold.ttf"), (3, "BoldItalic.ttf")]}
uif = ImageFont.truetype("/usr/share/fonts/google-noto-vf/NotoSans[wght].ttf", 13 * SC)
ab = 48 * SC; gx = ab + 56 * SC
longest = max(sum(mono[st & 3].getlength(t) for t, _, st in l) for l in lines)
W = int(gx + longest + 40 * SC)                       # đủ rộng cho dòng dài nhất — không cắt chữ
tb, th, bh = 34 * SC, 36 * SC, 26 * SC
H = int(tb + th + bh + 10 * SC + LH * len(lines) + 16 * SC)
im = Image.new("RGB", (W, H), ui["bg"]); d = ImageDraw.Draw(im)
d.rectangle([0, 0, W, tb], fill=ui["bgDeep"])
for i, c in enumerate(["#FF5F57", "#FEBC2E", "#28C840"]): d.ellipse([16*SC + i*20*SC, tb/2 - 6*SC, 28*SC + i*20*SC, tb/2 + 6*SC], fill=c)
d.text((W/2, tb/2), sp["title"], font=uif, fill=ui["fgMuted"], anchor="mm"); d.line([0, tb, W, tb], fill=ui["borderSoft"], width=SC)
d.rectangle([0, tb + SC, ab, H], fill=ui["bgDeep"])
for i in range(4):
    y = tb + 22*SC + i * 46*SC; col = ui["fg"] if i == 0 else ui["fgDim"]
    d.rounded_rectangle([ab/2 - 10*SC, y, ab/2 + 10*SC, y + 20*SC], radius=4*SC, outline=col, width=2*SC)
d.rectangle([0, tb + 18*SC, 2*SC, tb + 46*SC], fill=ui["accent"])
y0 = tb + SC; d.rectangle([ab, y0, W, y0 + th], fill=ui["bgTabBar"]); x = ab
for j, t in enumerate(sp["tabs"]):
    tw = uif.getlength(t) + 40 * SC; act = j == 0
    if act: d.rectangle([x, y0, x + tw, y0 + th], fill=ui["bgTab"]); d.rectangle([x, y0, x + tw, y0 + 2*SC], fill=ui["ember"])
    d.text((x + 20*SC, y0 + th/2), t, font=uif, fill=ui["fgBright"] if act else ui["fgMuted"], anchor="lm")
    x += tw; d.line([x, y0, x, y0 + th], fill=ui["borderTide"], width=SC)
d.line([x, y0 + th - SC, W, y0 + th - SC], fill=ui["borderTide"], width=SC)
by = y0 + th; d.rectangle([ab, by, W, by + bh], fill=ui["bgTab"])
d.text((ab + 16*SC, by + bh/2), "  ›  ".join(sp["crumbs"]), font=uif, fill=ui["fgMuted"], anchor="lm")
ey = by + bh + 10*SC
for n, line in enumerate(lines, 1):
    y = ey + (n - 1) * LH
    if n == sp.get("active"): d.rectangle([ab, y, W, y + LH], fill=ui["bgLine"])
    d.text((gx - 18*SC, y + LH/2), str(n), font=mono[0], fill=ui["fgActiveLineNr"] if n == sp.get("active") else ui["fgDim"], anchor="rm")
    cx = gx
    for text, color, st in line:
        f = mono[st & 3]; d.text((cx, y + LH/2), text, font=f, fill=color, anchor="lm"); cx += f.getlength(text)
    if n == sp.get("active"): d.rectangle([cx, y + 4*SC, cx + 2*SC, y + LH - 4*SC], fill=ui["accent"])
im.resize((W // SC, H // SC), Image.LANCZOS).save(out, optimize=True)
