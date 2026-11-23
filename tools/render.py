# Vẽ ảnh editor giả lập từ token đã tô màu.
# python3 tools/render.py <spec.json> <out.png>
#   spec = {"panels": [{"title":..., "ui": {...}, "tokens": [[[text,color,style],...],...], "active": 9}], "width": 760}
import json, sys
from PIL import Image, ImageDraw, ImageFont
spec = json.load(open(sys.argv[1])); out = sys.argv[2]
F = "/home/hoang-fedora/.local/share/fonts/JetBrainsMonoNerdFont-"; SC = 2; FS = 14 * SC; LH = int(14 * 1.55 * SC)
mono = {i: ImageFont.truetype(F + n, FS) for i, n in [(0, "Regular.ttf"), (1, "Italic.ttf"), (2, "Bold.ttf"), (3, "BoldItalic.ttf")]}
uif = ImageFont.truetype("/usr/share/fonts/google-noto-vf/NotoSans[wght].ttf", 12 * SC)
W = spec.get("width", 760) * SC
imgs = []
for p in spec["panels"]:
    ui, toks = p["ui"], p["tokens"]
    tb = 26 * SC; sbw = 150 * SC; H = tb + 14 * SC + LH * len(toks) + 10 * SC
    im = Image.new("RGB", (W, H), ui["bg"]); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, tb], fill=ui["bgDeep"]); d.text((10 * SC, tb / 2), p["title"], font=uif, fill=ui["fgMuted"], anchor="lm")
    d.rectangle([0, tb, sbw, H], fill=ui["bgPanel"])
    for i, name in enumerate(["src", "  pdf", "    pdf.service.ts", "    pdf.module.ts", "  app.module.ts", "package.json"]):
        y = tb + 10 * SC + i * 20 * SC
        if i == 2: d.rectangle([0, y - 3 * SC, sbw, y + 15 * SC], fill=ui["listSelected"])
        d.text((10 * SC, y + 6 * SC), name, font=uif, fill=ui["fgBright"] if i == 2 else ui["fgSoft"], anchor="lm")
    gx = sbw + 44 * SC
    for n, line in enumerate(toks, 1):
        y = tb + 10 * SC + (n - 1) * LH
        if n == p.get("active"): d.rectangle([sbw, y, W, y + LH], fill=ui["bgLine"])
        d.text((gx - 12 * SC, y + LH / 2), str(n), font=mono[0], fill=ui["fgActiveLineNr"] if n == p.get("active") else ui["fgDim"], anchor="rm")
        x = gx
        for text, color, st in line:
            f = mono[st & 3]; d.text((x, y + LH / 2), text, font=f, fill=color, anchor="lm"); x += f.getlength(text)
    imgs.append(im)
H = sum(i.height for i in imgs) + 6 * SC * (len(imgs) - 1)
outim = Image.new("RGB", (W, H), "#000000"); y = 0
for i in imgs: outim.paste(i, (0, y)); y += i.height + 6 * SC
outim.resize((W // SC, H // SC), Image.LANCZOS).save(out)
