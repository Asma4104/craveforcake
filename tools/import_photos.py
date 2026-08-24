"""
Crave for Cake — photo importer + enhancer
------------------------------------------
Takes the real cake photographs, cleans them up (white balance, brightness,
contrast, colour, sharpening), crops them to the exact sizes the website
layout expects, and saves them over the placeholder files.

Run from the site folder:
    python tools/import_photos.py

The gallery is simply EVERY photo in the source folder, so adding or deleting
a picture there and running this again is all it takes to update it.

To change which photo a product or occasion uses, edit its file name in the
MAP section near the bottom and run this again.
"""
import os, glob
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageStat, ImageDraw

SRC  = r"C:\Users\asmaq\Documents\Cake imges"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
IMG  = os.path.join(ROOT, "assets", "images")

FILES = sorted(glob.glob(os.path.join(SRC, "*.jpeg")) + glob.glob(os.path.join(SRC, "*.jpg")))


NL = chr(10)


def stem(path):
    return os.path.splitext(os.path.basename(path))[0]


def photo(name):
    """Find a source photo by its file name (without the extension).

    Photos are looked up by NAME, never by position in the folder — adding or
    deleting a picture used to shift every following one and silently put the
    wrong cake on the wrong product.
    """
    for f in FILES:
        if stem(f) == name:
            return f
    raise SystemExit("Photo not found in %s:  %s" % (SRC, name))


# --------------------------------------------------------------- enhancing
def white_balance(im, strength=0.75):
    """Pull the warm indoor cast out of phone photos.

    The correction is measured ONLY from bright, near-neutral pixels — icing,
    plates, tablecloths. Sampling the whole frame would read a hot pink
    backdrop as a colour cast and turn a white cake green.
    """
    small = im.resize((160, max(1, int(160 * im.height / im.width))), Image.BILINEAR)
    px = list(small.getdata())

    # candidates: bright and not strongly coloured
    lit = [p for p in px if (p[0] + p[1] + p[2]) / 3 > 120 and (max(p) - min(p)) < 46]
    if len(lit) < len(px) * 0.04:               # nothing neutral to lock on to
        return im

    lit.sort(key=lambda p: -(p[0] + p[1] + p[2]))
    lit = lit[:max(30, len(lit) // 3)]          # the brightest of them
    means = [sum(c) / len(lit) for c in zip(*lit)]
    target = sum(means) / 3.0

    lut = []
    for m in means:
        f = 1.0 if m < 1 else target / m
        f = 1.0 + (f - 1.0) * strength
        f = max(0.88, min(1.14, f))
        lut += [min(255, int(i * f + 0.5)) for i in range(256)]
    return im.point(lut)


def enhance(im):
    """A light touch-up only.

    The aim is a photo that still looks like the cake in the room — the
    correction lifts a dull or yellow phone shot, it does not brighten the
    picture into a catalogue render. Every step is deliberately small and the
    result is blended back over the original at the end.
    """
    im = ImageOps.exif_transpose(im).convert("RGB")
    orig = im.copy()

    im = white_balance(im, strength=0.55)

    # only rescue genuinely dark shots, and never by much
    lum = ImageStat.Stat(im.convert("L")).mean[0]
    if 0 < lum < 118:
        im = ImageEnhance.Brightness(im).enhance(min(1.07, 118.0 / lum))

    im = ImageEnhance.Contrast(im).enhance(1.03)

    # a whisper of colour, scaled back on photos that are already vivid
    small = im.resize((80, 80), Image.BILINEAR)
    chroma = sum(max(p) - min(p) for p in small.getdata()) / 6400.0
    im = ImageEnhance.Color(im).enhance(max(1.0, min(1.07, 1.18 - chroma / 110.0)))

    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=42, threshold=4))

    # keep 70% of the correction — this is the dial to turn if it ever looks
    # over-processed again (1.0 = full effect, 0.0 = the untouched photo)
    return Image.blend(orig, im, 0.70)


def crop_to(im, w, h, bias=0.44):
    """Centre crop to the target ratio, biased slightly above centre so the
    cake stays in frame, then resize."""
    tr, sr = w / h, im.width / im.height
    if sr > tr:                                  # too wide → trim the sides
        nw = int(im.height * tr)
        x = (im.width - nw) // 2
        im = im.crop((x, 0, x + nw, im.height))
    else:                                        # too tall → trim top/bottom
        nh = int(im.width / tr)
        y = int((im.height - nh) * bias)
        im = im.crop((0, y, im.width, y + nh))
    return im.resize((w, h), Image.LANCZOS)


def energy_map(im, size=170):
    """Where the interesting stuff is.

    Floor tiles, plain walls and the empty part of a cake board are smooth and
    washed out; a cake has edges, texture and colour. Combining an edge map
    with the saturation channel finds the cake reliably without any model.
    """
    small = im.resize((size, max(1, int(size * im.height / im.width))), Image.BILINEAR)

    edges = small.convert("L").filter(ImageFilter.FIND_EDGES)
    edges = edges.filter(ImageFilter.GaussianBlur(1.6))
    sat = small.convert("HSV").split()[1].filter(ImageFilter.GaussianBlur(1.6))

    e, s = edges.load(), sat.load()
    w, h = small.size
    grid = [[0.65 * e[x, y] + 0.35 * s[x, y] for x in range(w)] for y in range(h)]

    # ignore the outermost ring — FIND_EDGES lights up the frame itself
    for y in range(h):
        for x in range(w):
            if x < 2 or y < 2 or x > w - 3 or y > h - 3:
                grid[y][x] = 0.0
    return grid, w, h


def subject_box(grid, gw, gh, keep=0.90):
    """The rectangle holding `keep` of the picture's energy — i.e. the cake.

    Trimmed one row/column at a time, always taking the emptiest edge first,
    so blank floor and bare board come off before anything on the cake does.
    """
    cols = [sum(grid[y][x] for y in range(gh)) for x in range(gw)]
    rows = [sum(grid[y][x] for x in range(gw)) for y in range(gh)]
    total = sum(cols) or 1.0
    budget = total * (1.0 - keep) / 2.0

    def trim(vals):
        lo, hi, spent = 0, len(vals) - 1, 0.0
        while lo < hi:
            take_lo = vals[lo] <= vals[hi]
            v = vals[lo] if take_lo else vals[hi]
            if spent + v > budget:
                break
            spent += v
            if take_lo:
                lo += 1
            else:
                hi -= 1
        return lo, hi

    x0, x1 = trim(cols)
    y0, y1 = trim(rows)
    return x0, y0, x1 + 1, y1 + 1


def smart_crop(im, tw, th, pad=0.10, keep=0.90):
    """Crop to the target ratio around the cake rather than the frame centre.

    The window is sized to *contain* the subject, so a tall cake (a doll cake,
    a cake with a topper) gets a wider crop instead of losing its head, while a
    small cake sitting in the middle of a big floor gets pulled in tight.
    `pad` is the breathing room left around the subject.
    """
    grid, gw, gh = energy_map(im)
    gx0, gy0, gx1, gy1 = subject_box(grid, gw, gh, keep)

    # subject box back in real pixels, plus padding
    sx, sy = im.width / gw, im.height / gh
    bx0, by0 = gx0 * sx, gy0 * sy
    bx1, by1 = gx1 * sx, gy1 * sy
    bw, bh = max(1.0, bx1 - bx0), max(1.0, by1 - by0)
    cx, cy = bx0 + bw / 2, by0 + bh / 2
    bw *= (1 + pad * 2)
    bh *= (1 + pad * 2)

    # grow to the target ratio — never crop the subject to make it fit
    tr = tw / th
    if bw / bh < tr:
        bw = bh * tr
    else:
        bh = bw / tr

    # keep the output at full resolution, and inside the photo
    if bw < tw or bh < th:
        k = max(tw / bw, th / bh)
        bw, bh = bw * k, bh * k
    if bw > im.width or bh > im.height:
        k = min(im.width / bw, im.height / bh)
        bw, bh = bw * k, bh * k

    x0 = max(0, min(im.width - bw, cx - bw / 2))
    y0 = max(0, min(im.height - bh, cy - bh / 2))
    return im.crop((int(x0), int(y0), int(x0 + bw), int(y0 + bh))) \
             .resize((tw, th), Image.LANCZOS)


def save_hero(name, rel="hero.jpg", w=1600, h=1000, centre=0.68):
    """Compose the wide hero banner.

    A tall phone photo cropped to 16:10 loses most of the cake, so instead the
    whole photo is laid over a blurred, enlarged copy of itself and positioned
    to one side. The cake stays complete, and the empty side is where the
    heading sits.  centre = 0.68 puts the cake right of middle.
    """
    shot = enhance(Image.open(photo(name)))

    bg = crop_to(shot.copy(), w, h, 0.5)
    bg = bg.filter(ImageFilter.GaussianBlur(38))
    bg = ImageEnhance.Brightness(bg).enhance(0.94)

    s = h / shot.height
    fg = shot.resize((int(shot.width * s), h), Image.LANCZOS)
    x = int(w * centre - fg.width / 2)
    x = max(0, min(w - fg.width, x))

    # feather the vertical edges so the sharp photo melts into the blur
    feather = max(1, int(fg.width * 0.22))
    mask = Image.new("L", fg.size, 255)
    md = ImageDraw.Draw(mask)
    for i in range(feather):
        v = int(255 * (i / feather) ** 0.85)
        md.line([(i, 0), (i, fg.height)], fill=v)
        md.line([(fg.width - 1 - i, 0), (fg.width - 1 - i, fg.height)], fill=v)
    bg.paste(fg, (x, 0), mask)

    out = os.path.join(IMG, *rel.split("/"))
    bg.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    print("  %-38s  <- %s (composed)" % (rel, name))


def save(name, rel, w=None, h=None, pad=0.10, q=86):
    """name = source photo file name, without the extension.

    pad is the breathing room left around the cake: lower = tighter crop.
    """
    im = enhance(Image.open(photo(name)))
    if w and h:
        im = smart_crop(im, w, h, pad)
    else:                                        # gallery: fixed width, free height
        im = smart_crop(im, 900, 1150, pad) if im.height / im.width > 1.28 \
            else im.resize((900, int(900 * im.height / im.width)), Image.LANCZOS)
    out = os.path.join(IMG, *rel.split("/"))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, "JPEG", quality=q, optimize=True, progressive=True)
    print("  %-38s  <- %s" % (rel, name))


# ------------------------------------------------------------------- MAP
# Which photograph goes where. Photos are named by their file name in
#   the source folder
# so you can add, remove or rename pictures in that folder without breaking
# anything else. The gallery simply takes every photo in the folder.

HERO_PHOTO   = "WhatsApp Image 2026-08-23 at 6.02.50 AM"
ABOUT_PHOTO  = "WhatsApp Image 2026-08-23 at 6.02.34 AM"
BANNER_PHOTO = "WhatsApp Image 2026-08-23 at 6.02.45 AM (2)"

PRODUCT_PAD = {}   # per-item crop tightness, e.g. {"chocolate-cake": 0.04}

PRODUCTS = {                       # 800 x 800 square
    "custom-cake":          "WhatsApp Image 2026-08-23 at 6.02.43 AM (1)",
    "white-frosting-cake":  "WhatsApp Image 2026-08-23 at 6.02.47 AM",
    "colour-frosting-cake": "WhatsApp Image 2026-08-23 at 6.02.46 AM (1)",
    "black-forest-cake":    "WhatsApp Image 2026-08-23 at 6.02.30 AM",
    "pineapple-cake":       "WhatsApp Image 2026-08-23 at 6.02.48 AM (1)",
    "red-velvet-cake":      "WhatsApp Image 2026-08-23 at 6.02.48 AM (2)",
    "tea-marble-cake":      "WhatsApp Image 2026-08-23 at 6.02.51 AM (1)",
    "chocolate-cake":       "WhatsApp Image 2026-08-23 at 6.02.49 AM (1)",
    "nutella-cake":         "WhatsApp Image 2026-08-23 at 6.02.45 AM (1)",
    "brownie-box":          "WhatsApp Image 2026-08-23 at 6.02.45 AM",
    "cupcake-box":          "WhatsApp Image 2026-08-23 at 6.02.52 AM",
}

OCCASIONS = {                      # 800 x 1000
    "birthdays":       "WhatsApp Image 2026-08-23 at 6.02.42 AM (1)",
    "anniversaries":   "WhatsApp Image 2026-08-23 at 6.02.50 AM (1)",
    "weddings":        "WhatsApp Image 2026-08-23 at 6.02.42 AM",
    "celebrations":    "WhatsApp Image 2026-08-23 at 6.02.33 AM",
    "special-moments": "WhatsApp Image 2026-08-23 at 6.02.44 AM (1)",
}

INSTAGRAM = [                      # 600 x 600
    "WhatsApp Image 2026-08-23 at 6.02.50 AM (3)",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM (2)",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM",
    "WhatsApp Image 2026-08-23 at 6.02.47 AM (2)",
    "WhatsApp Image 2026-08-23 at 6.02.32 AM (1)",
    "WhatsApp Image 2026-08-23 at 6.02.30 AM (1)",
]

# Gallery = every photo in the folder. Anything not listed here is a cake.
CATEGORY = {
    "WhatsApp Image 2026-08-23 at 6.02.31 AM (2)": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.31 AM": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.32 AM": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM (2)": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.43 AM (1)": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM (1)": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.46 AM": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM (2)": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM": "custom",
    "WhatsApp Image 2026-08-23 at 6.02.34 AM (1)": "brownies",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM (2)": "brownies",
    "WhatsApp Image 2026-08-23 at 6.02.45 AM": "brownies",
    "WhatsApp Image 2026-08-23 at 6.02.49 AM": "brownies",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM (2)": "brownies",
    "WhatsApp Image 2026-08-23 at 6.02.47 AM (1)": "cupcakes",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM (1)": "cupcakes",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM": "cupcakes",
}

CAPTION = {
    "WhatsApp Image 2026-08-23 at 6.02.30 AM (1)": "Father's Day cake",
    "WhatsApp Image 2026-08-23 at 6.02.30 AM": "Chocolate cake, freshly cut",
    "WhatsApp Image 2026-08-23 at 6.02.31 AM (1)": "Chocolate birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.31 AM (2)": "Independence Day cake",
    "WhatsApp Image 2026-08-23 at 6.02.31 AM": "Photo-print cake",
    "WhatsApp Image 2026-08-23 at 6.02.32 AM (1)": "Chocolate and cream cake",
    "WhatsApp Image 2026-08-23 at 6.02.32 AM": "Independence Day cake",
    "WhatsApp Image 2026-08-23 at 6.02.33 AM (1)": "Tea cake, sliced",
    "WhatsApp Image 2026-08-23 at 6.02.33 AM": "Graduation cake",
    "WhatsApp Image 2026-08-23 at 6.02.34 AM (1)": "Brownie box with chocolate drizzle",
    "WhatsApp Image 2026-08-23 at 6.02.34 AM": "Rose gold drip cake",
    "WhatsApp Image 2026-08-23 at 6.02.35 AM": "Eighteenth birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.41 AM": "Welcome cake",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM (1)": "Third birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM (2)": "Islamic themed cake",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM (3)": "Birthday cake with piped lettering",
    "WhatsApp Image 2026-08-23 at 6.02.42 AM": "Bride-to-be cake",
    "WhatsApp Image 2026-08-23 at 6.02.43 AM (1)": "Doll cake in piped rosettes",
    "WhatsApp Image 2026-08-23 at 6.02.43 AM": "White frosting with a handwritten message",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM (1)": "Umrah Mubarak cake",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM (2)": "A tray of fresh brownies",
    "WhatsApp Image 2026-08-23 at 6.02.44 AM": "Chocolate rosette drip cake",
    "WhatsApp Image 2026-08-23 at 6.02.45 AM (1)": "Nutella cake with chocolate bars",
    "WhatsApp Image 2026-08-23 at 6.02.45 AM (2)": "Mocha rosette cake",
    "WhatsApp Image 2026-08-23 at 6.02.45 AM": "Fudgy brownie squares",
    "WhatsApp Image 2026-08-23 at 6.02.46 AM (1)": "Pink butterfly cake",
    "WhatsApp Image 2026-08-23 at 6.02.46 AM": "Islamic themed cake",
    "WhatsApp Image 2026-08-23 at 6.02.47 AM (1)": "Butterfly cake with cupcakes",
    "WhatsApp Image 2026-08-23 at 6.02.47 AM (2)": "Twenty-first birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.47 AM": "White cake with sugar roses",
    "WhatsApp Image 2026-08-23 at 6.02.48 AM (1)": "Pineapple cake",
    "WhatsApp Image 2026-08-23 at 6.02.48 AM (2)": "Red velvet, freshly cut",
    "WhatsApp Image 2026-08-23 at 6.02.48 AM": "Chocolate anniversary cake",
    "WhatsApp Image 2026-08-23 at 6.02.49 AM (1)": "Chocolate swirl cake",
    "WhatsApp Image 2026-08-23 at 6.02.49 AM (2)": "Cream cake, freshly cut",
    "WhatsApp Image 2026-08-23 at 6.02.49 AM": "Brownie, cut into slices",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM (1)": "Anniversary cake",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM (2)": "Second birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM (3)": "Purple butterfly cake",
    "WhatsApp Image 2026-08-23 at 6.02.50 AM": "Character birthday cake",
    "WhatsApp Image 2026-08-23 at 6.02.51 AM (1)": "Marble loaf cake",
    "WhatsApp Image 2026-08-23 at 6.02.51 AM (2)": "Marble cake, sliced",
    "WhatsApp Image 2026-08-23 at 6.02.51 AM": "Cocoa-dusted cream cake",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM (1)": "Red velvet cupcakes and brownies",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM (2)": "Brownie box",
    "WhatsApp Image 2026-08-23 at 6.02.52 AM": "Hand-piped cupcakes",
}


if __name__ == "__main__":
    print("Found %d source photographs." % len(FILES))

    print(NL + "Hero + page images")
    save_hero(HERO_PHOTO)
    save(ABOUT_PHOTO, "about.jpg", 900, 1100, pad=0.16)
    save(BANNER_PHOTO, "menu-banner.jpg", 1600, 700, pad=0.20)

    print(NL + "Products")
    for slug, name in PRODUCTS.items():
        save(name, "products/%s.jpg" % slug, 800, 800, pad=PRODUCT_PAD.get(slug, 0.10))

    print(NL + "Occasions")
    for slug, name in OCCASIONS.items():
        save(name, "occasions/%s.jpg" % slug, 800, 1000, pad=0.16)

    print(NL + "Gallery - every photo in the folder")
    counters, entries = {}, []
    for f in FILES:
        name = stem(f)
        cat = CATEGORY.get(name, "cakes")
        counters[cat] = counters.get(cat, 0) + 1
        rel = "gallery/%s-%02d.jpg" % (cat, counters[cat])
        save(name, rel)
        entries.append((rel, cat, CAPTION.get(name, "Crave for Cake")))

    print(NL + "Instagram")
    for i, name in enumerate(INSTAGRAM, 1):
        save(name, "instagram/post-%02d.jpg" % i, 600, 600, pad=0.10)

    # write the matching list for js/data.js so the two can never drift apart
    order, mixed = ["cakes", "custom", "brownies", "cupcakes"], []
    buckets = {c: [e for e in entries if e[1] == c] for c in order}
    while any(buckets.values()):                       # interleave the categories
        for c in order:
            if buckets[c]:
                mixed.append(buckets[c].pop(0))
    width = max(len(e[0]) for e in mixed) + 22
    lines = ['    { image: %-*s category: %-11s caption: %s },'
             % (width, '"assets/images/%s",' % rel, '"%s",' % cat, '"%s"' % cap.replace('"', "'"))
             for rel, cat, cap in mixed]
    snippet = os.path.join(ROOT, "tools", "_gallery_snippet.js")
    with open(snippet, "w", encoding="utf-8") as fh:
        fh.write("  gallery: [" + chr(10))
        fh.write(chr(10).join(lines).rstrip(",") + chr(10) + "  ]," + chr(10))
    print(chr(10) + "  -> tools/_gallery_snippet.js  (%d entries)" % len(mixed))
    print("Done.")
