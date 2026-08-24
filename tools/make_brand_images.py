"""
Crave for Cake — brand image builder
------------------------------------
Takes your real logo artwork and prepares the versions the website needs:

  assets/images/logo-original.png   an untouched copy of your artwork
  assets/images/logo.png            the badge on a transparent background
                                    (used in the footer)
  assets/images/logo-mark.png       the badge with the chef hat only, no words
                                    (used in the navbar beside the brand name)
  assets/images/favicon.png         the small browser-tab icon

Run from the site folder:
    python tools/make_brand_images.py

If you ever get a new logo file, point SOURCE at it and run this again.
This script only touches the logo files — it will never overwrite your
cake photographs.
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFilter

SOURCE = r"C:\Users\asmaq\Documents\Cake\Cream Beige Modern Cake and Bakery Logo.png"

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
IMG = os.path.join(ROOT, "assets", "images")


def cutout(im, tol=26):
    """Make the flat background transparent.

    Only background that touches the edge of the picture is removed, so the
    white lettering *inside* the badge stays solid — a plain colour-distance
    threshold would eat it, because cream and white are close together.
    """
    im = im.convert("RGB")
    w, h = im.size
    bg = im.getpixel((0, 0))

    diff = ImageChops.difference(im, Image.new("RGB", (w, h), bg)).convert("L")
    shape = diff.point(lambda v: 255 if v > tol else 0)      # 0 = looks like background

    # keep only the background that is connected to the border
    flood = shape.copy()
    for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if flood.getpixel(xy) == 0:
            ImageDraw.floodfill(flood, xy, 128, thresh=0)

    alpha = flood.point(lambda v: 0 if v == 128 else 255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))       # soften the edge
    alpha = alpha.point(lambda v: 0 if v < 40 else (255 if v > 215 else v))

    out = im.convert("RGBA")
    out.putalpha(alpha)
    return out, alpha


def badge_colour(im, alpha):
    """The most common opaque colour — the brown of the badge."""
    counts = {}
    w, h = im.size
    for y in range(0, h, 3):
        for x in range(0, w, 3):
            if alpha.getpixel((x, y)) > 240:
                p = im.convert("RGB").getpixel((x, y))
                if min(p) < 200:                              # ignore the white parts
                    counts[p] = counts.get(p, 0) + 1
    return max(counts, key=counts.get) if counts else (123, 91, 63)


def drop_specks(mask, min_frac=0.04):
    """Remove tiny isolated dots, keep every real stroke.

    The hat is drawn as several separate strokes, so keeping only the single
    largest blob would throw most of it away. Instead anything at least
    min_frac of the biggest blob survives; a one or two pixel speck does not.
    A single speck is enough to stretch the bounding box and push the hat
    off centre.
    """
    w, h = mask.size
    px = mask.load()
    seen = bytearray(w * h)
    blobs = []

    for sy in range(h):
        for sx in range(w):
            if px[sx, sy] < 128 or seen[sy * w + sx]:
                continue
            stack, blob = [(sx, sy)], []
            seen[sy * w + sx] = 1
            while stack:
                x, y = stack.pop()
                blob.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] \
                            and px[nx, ny] >= 128:
                        seen[ny * w + nx] = 1
                        stack.append((nx, ny))
            blobs.append(blob)

    out = Image.new("L", (w, h), 0)
    if not blobs:
        return out
    keep = max(len(b) for b in blobs) * min_frac
    op = out.load()
    for blob in blobs:
        if len(blob) >= keep:
            for x, y in blob:
                op[x, y] = 255
    return out


def hat_only(im, alpha, brown):
    """Rebuild the badge with just the chef hat, centred — no lettering."""
    rgb = im.convert("RGB")
    w, h = im.size

    # solid badge in the brand brown, using the badge silhouette
    mark = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mark.paste(Image.new("RGBA", (w, h), brown + (255,)), (0, 0), alpha)

    # every white mark inside the badge: the hat, then the two lines of text
    white = Image.new("L", (w, h), 0)
    wd = white.load()
    src = rgb.load()
    al = alpha.load()
    rows = [0] * h
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            if al[x, y] > 200 and min(r, g, b) > 185:
                wd[x, y] = 255
                rows[y] += 1

    # The hat is the topmost band. Walk down from the first white row and stop
    # at the blank gap above the lettering — that keeps the wordmark out.
    top = next((y for y, n in enumerate(rows) if n > 0), None)
    if top is None:
        return mark
    bottom = top
    while bottom + 1 < h and rows[bottom + 1] > 0:
        bottom += 1
    for y in range(bottom + 1, h):                # erase everything below the hat
        for x in range(w):
            wd[x, y] = 0

    white = drop_specks(white)
    box = white.getbbox()
    if not box:
        return mark

    hat = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    hat.putalpha(white)
    hat = hat.crop(box)

    # scale it up and drop it in the middle of the badge itself — the badge is
    # not necessarily centred on the canvas, so measure it rather than assume
    target = int(min(w, h) * 0.44)
    s = target / max(hat.width, hat.height)
    hat = hat.resize((max(1, int(hat.width * s)), max(1, int(hat.height * s))), Image.LANCZOS)

    bx0, by0, bx1, by1 = alpha.getbbox()
    cx, cy = (bx0 + bx1) // 2, (by0 + by1) // 2
    mark.alpha_composite(hat, (cx - hat.width // 2, cy - hat.height // 2))
    return mark


if __name__ == "__main__":
    if not os.path.exists(SOURCE):
        raise SystemExit("Logo artwork not found:\n  %s\nEdit SOURCE at the top "
                         "of this file to point at your logo." % SOURCE)

    os.makedirs(IMG, exist_ok=True)
    original = Image.open(SOURCE)
    original.save(os.path.join(IMG, "logo-original.png"), "PNG")
    print("   assets/images/logo-original.png   %dx%d" % original.size)

    logo, alpha = cutout(original)
    logo.save(os.path.join(IMG, "logo.png"), "PNG")
    print("   assets/images/logo.png            %dx%d, background removed" % logo.size)

    brown = badge_colour(original, alpha)
    mark = hat_only(original, alpha, brown)
    mark.save(os.path.join(IMG, "logo-mark.png"), "PNG")
    print("   assets/images/logo-mark.png       %dx%d, brand brown %s" % (mark.size + (brown,)))

    mark.resize((64, 64), Image.LANCZOS).save(os.path.join(IMG, "favicon.png"), "PNG")
    print("   assets/images/favicon.png         64x64")
    print("Done.")
