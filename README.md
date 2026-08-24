# Crave for Cake — website

*Made With Love, Baked To Crave*

A complete, responsive bakery website. Plain HTML, CSS and JavaScript — no build
step, no framework, no installation. Open `index.html` in a browser and it runs.

---

## Your menu, as it is on the site

Taken from your printed menu card. Edit these in `js/data.js`.

| Item | Category | Price | Shown as |
|---|---|---|---|
| Custom Cake | Custom Cakes | — | Price on request · priced by design |
| White Frosting Cake | Signature Cakes | 1000 | Rs. 1,000 · per pound |
| Colour Frosting Cake | Signature Cakes | 1100 | Rs. 1,100 · per pound |
| Black Forest Cake | Signature Cakes | 1100 | Rs. 1,100 · per pound |
| Pineapple Cake | Signature Cakes | 1100 | Rs. 1,100 · per pound |
| Red Velvet Cake | Signature Cakes | 1500 | Rs. 1,500 · per pound |
| Tea / Marble Cake | Signature Cakes | 650 | Rs. 650 · per pound |
| Chocolate Cake | Chocolate Cakes | 1300 | Rs. 1,300 · per pound |
| Nutella Cake | Chocolate Cakes | 1500 | Rs. 1,500 · per pound |
| Brownies | Brownies | 900 | Rs. 900 · for 6 pieces |
| Cupcakes | Cupcakes | 850 | Rs. 850 · for 6 pieces |

The note *"All cake prices are for 1 pound. Customised cake charges will be
different."* sits above the prices on the home page and the menu page.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, best sellers, why choose us, occasions, reviews, Instagram |
| `menu.html` | Full menu with category filters |
| `gallery.html` | Masonry gallery with filters and lightbox |
| `about.html` | About us |
| `order.html` | Order form + Order via WhatsApp |
| `contact.html` | Contact details and contact form |

Product details open in a popup from any product card, on the home page and the
menu page. The floating WhatsApp button appears on every page.

---

## The one file you edit: `js/data.js`

**All content lives in `js/data.js`.** Text, prices, image paths, reviews,
delivery areas, hours, WhatsApp number — everything. Change it there and every
page updates. You never need to touch the HTML or CSS to update content.

Open it in Notepad, VS Code, or any text editor.

### 1. Your WhatsApp number

```js
contact: {
  whatsapp: "923001234567",          // digits only, country code, no + or spaces
  whatsappDisplay: "+92 300 1234567" // how it's shown on screen
}
```

This one value powers the floating button, the footer, the contact page, the
product popup and the "Order via WhatsApp" button on the order form.

### 2. Phone, email, Instagram, delivery areas, hours

All in the same `contact` block. Instagram, the delivery area (Karachi) and
the ordering terms are already real — only phone, WhatsApp, email and the
business hours are still placeholders.

The ordering terms show on the Contact page and above the order form:

```js
orderTerms: [
  "Please place your order 2 to 3 days in advance.",
  "50% advance payment confirms your order.",
  "Delivery charges apply according to your area."
],
```

### 3. Prices and product text

Each product in the `products` list looks like this:

```js
{
  id: "red-velvet-cake",           // don't change once set
  name: "Red Velvet Cake",
  category: "signature-cakes",
  price: 1500,                     // just the number — 0 shows "Price on request"
  unit: "per pound",               // the small line under the price
  image: "assets/images/products/red-velvet-cake.jpg",
  short: "One line, shown on the card.",
  description: "Longer text, shown on the product details popup.",
  sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
  flavors: ["Red Velvet"],
  bestSeller: true                 // true = also appears on the home page
}
```

To add a product, copy an existing block, change the values, give it a new `id`.
To remove one, delete the block.

### 4. Customer reviews

The 14 reviews on the site are **real** — taken from your "Reviews ❤️"
Instagram highlight and your WhatsApp screenshots. `reviewsAreSamples` is set
to `false`, so no sample tags or notices appear.

No customer names were visible in the screenshots, so each review is labelled
with what it was for ("Mickey Mouse birthday cake", "Nutella brownies"). When
you have a customer's permission to use their name, just change the `name`
value for that review.

The home page shows the first 6 with a **"Show all 14 reviews"** button. To
change how many appear first, edit:

```js
reviewsOnHome: 6,
```

Set it to a number larger than the review count to always show them all.

To add a new review, copy an existing block:

```js
{ name: "Chocolate cake", meta: "via WhatsApp", rating: 5,
  text: "What the customer wrote." },
```

### 5. The menu note

The line printed at the top of your menu card is shown above the prices on both
the home page and the menu page:

```js
currency: "Rs.",
menuNote: "All cake prices are for 1 pound. Customised cake charges will be different.",
```

---

## Your logo

Your logo appears in the navbar, the footer and the browser tab:

All of these are built from your real artwork —
`Documents\Cake\Cream Beige Modern Cake and Bakery Logo.png`.

| File | Where it is used |
|---|---|
| `assets/images/logo.png` | the full badge with the cream background removed, shown in the footer |
| `assets/images/logo-mark.png` | the badge with the chef hat only, no words — shown in the navbar next to the brand name |
| `assets/images/favicon.png` | the small icon on the browser tab |
| `assets/images/logo-original.png` | an untouched copy of your artwork, kept for reference |

The navbar needs a version without the lettering, because the words are
unreadable at 44 pixels. That one is generated: the badge is refilled in the
brand brown and the chef hat is lifted out and re-centred.

**If you ever change your logo**, put the new file anywhere, open
`tools/make_brand_images.py`, change the `SOURCE` line at the top, and run:

```
python tools/make_brand_images.py
```

The wording next to the badge in the navbar comes from `js/data.js`:

```js
brand: {
  name: "Crave for Cake",
  sub:  "Home Bakery",
  ...
}
```

---

## The photographs

Every photo on the site is one of your own, imported from your
`Documents\Cake imges` folder and cleaned up automatically — white balance
corrected, brightened, contrast and colour lifted, sharpened, then cropped to
the exact size each part of the layout needs.

| Where | Count |
|---|---|
| Menu / product cards | 11 |
| Gallery | every photo in your source folder |
| Occasions | 5 |
| Instagram row | 6 |
| Hero + About | 2 |

### Changing which photo goes where

Open `tools/import_photos.py`. Near the bottom there is a simple map:

```python
PRODUCTS = {
    "red-velvet-cake":  "WhatsApp Image 2026-08-23 at 6.02.48 AM (2)",
    "chocolate-cake":   "WhatsApp Image 2026-08-23 at 6.02.49 AM (1)",
}
```

Each value is the **file name** of a photo in your source folder, without the
`.jpeg` on the end. Put a different file name in, then run:

```
python tools/import_photos.py
```

`tools/make_brand_images.py` rebuilds only the logo files — it will never
overwrite your photographs.

### Swapping one photo by hand

**The easy way:** save your photo with the **same file name** over the existing
one. Nothing else to change.

**The other way:** put your photo anywhere in `assets/images/` and update the
path in `js/data.js`.

### Updating the gallery

The gallery is **every photo in** `Documents\Cake imges`. Add or delete
pictures there, then run:

```
python tools/import_photos.py
```

and the gallery rebuilds to match. Photos are matched by **file name**, not by
their position in the folder, so deleting one no longer shifts every other
picture onto the wrong product.

A photo counts as a cake unless it is listed in `CATEGORY` in that script,
where you can mark it `brownies`, `cupcakes` or `custom`.

### How the cropping works

`tools/import_photos.py` crops each photo around the cake rather than around
the middle of the frame. It finds the cake by looking for edges and colour —
floor tiles, plain walls and bare cake board are smooth and washed out, a cake
is not — then sizes the crop to *contain* what it found. That is why a tall
cake with a topper keeps its top instead of being cut off, while a small cake
sitting on a big floor gets pulled in close.

If one photo needs a nudge, add it to `PRODUCT_PAD` in that file and run the
script again. A smaller number crops in tighter:

```python
PRODUCT_PAD = { "chocolate-cake": 0.04 }
```

The eleven product photos are named after the items on your menu:
`custom-cake.jpg`, `white-frosting-cake.jpg`, `colour-frosting-cake.jpg`,
`black-forest-cake.jpg`, `pineapple-cake.jpg`, `red-velvet-cake.jpg`,
`tea-marble-cake.jpg`, `chocolate-cake.jpg`, `nutella-cake.jpg`,
`brownie-box.jpg`, `cupcake-box.jpg`.

### Keep these sizes so the layout stays even

| Folder | Size | Ratio |
|---|---|---|
| `assets/images/logo.png` | 500 × 500 | 1:1 square, transparent |
| `assets/images/logo-mark.png` | 500 × 500 | 1:1 square, transparent |
| `assets/images/hero.jpg` | 1600 × 1000 | 16:10 |
| `assets/images/about.jpg` | 900 × 1100 | 4:5 |
| `assets/images/menu-banner.jpg` | 1600 × 700 | — |
| `assets/images/products/` | 800 × 800 | 1:1 square |
| `assets/images/occasions/` | 800 × 1000 | 4:5 |
| `assets/images/gallery/` | 800 × 1000 or 800 × 800 | 4:5 or 1:1 |
| `assets/images/instagram/` | 600 × 600 | 1:1 square |

Product images **must** be square — the cards crop to a square and a non-square
photo will lose its edges. Save as JPG, roughly 150–400 KB each.

---

## What is still a placeholder

| Item | Status |
|---|---|
| Menu items and prices | ✅ **real** — taken from your printed menu card |
| Instagram link (`@cravefor_cake`) | ✅ **real** |
| Delivery area + ordering terms | ✅ **real** — Karachi only, 2–3 days notice, 50% advance |
| All photographs | ✅ **real** — your own cake photos, enhanced |
| Logo | ✅ **real** — built from your own artwork |
| WhatsApp number, phone, email | ❌ placeholder |
| Web3Forms key (emails you the orders) | ❌ not set — forms fall back to WhatsApp |
| Business hours | ✅ **real** — every day, 10:00 AM – 10:00 PM |
| Customer reviews | ✅ **real** — 14 reviews from your Instagram highlight and WhatsApp |

Everything else is finished and ready to go live.

---

## Forms — getting orders by email

Both the order form and the contact form can email you. This is set up and
tested; it just needs one key, because a static website cannot send email on
its own.

**Two minutes, one time:**

1. Go to **https://web3forms.com**
2. Type the email address where you want orders to arrive
3. They email you an **access key** — a long code
4. Open `js/data.js` and paste it between the quotes:

```js
formAccessKey: "paste-your-key-here",
```

That is all. Every order and message then lands in your inbox, with all the
details laid out. It is free, and there is no server or hosting to pay for.

**What happens if you never add the key:** nothing breaks. Both forms fall
back to WhatsApp — they hand the filled-in details to WhatsApp so the customer
can send them to you there.

**If sending ever fails** (bad key, customer offline), the form says so, keeps
everything the customer typed, and offers the WhatsApp button instead. An
order is never silently lost.

---

## Putting it online

The site is static, so it works on any host. Free options: Netlify (drag the
folder onto their dashboard), GitHub Pages, or Cloudflare Pages. Or upload the
whole folder to any cPanel `public_html` directory.

---

## Design notes

- **Colours** — cream, beige, soft brown, blush pink, white. Set once at the top
  of `css/style.css` under `:root`. Change a value there and it changes site-wide.
- **Fonts** — Fraunces for headings, Jost for body text, loaded from Google Fonts.
- **The scalloped edge** between sections is piped buttercream — the brand's
  signature detail. It also frames every placeholder image.
- Animations are subtle: a slow hero zoom, fade-ups on scroll, lifts on hover.
  Anyone with "reduce motion" turned on gets a still version automatically.
