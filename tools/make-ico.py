# Builds site/static/favicon.ico (16/32/48) from the PNGs written by tools/make-icons.mjs. Needs Pillow.
from pathlib import Path
from PIL import Image

static = Path(__file__).resolve().parent.parent / "site" / "static"
sizes = [16, 32, 48]
imgs = [Image.open(static / f"ico-{s}.png").convert("RGBA") for s in sizes]
imgs[-1].save(static / "favicon.ico", sizes=[(s, s) for s in sizes], append_images=imgs[:-1])
for s in sizes:
    (static / f"ico-{s}.png").unlink()
print("wrote favicon.ico")

# Share image as a small JPEG (WhatsApp skips preview images that are too heavy); config uses share-blue.jpg.
share = static / "img" / "share-blue.png"
if share.exists():
    Image.open(share).convert("RGB").save(static / "img" / "share-blue.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print("wrote img/share-blue.jpg")
