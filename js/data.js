/* ============================================================================
   Crave for Cake — SITE CONTENT
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT to update the website content.
   Nothing here affects the design. Change the text, prices and image paths
   and every page updates automatically.

   IMAGE SIZES (keep these ratios so the layout never breaks):
     logo ..................  500 x  500  (square, transparent PNG)
     hero .................. 1600 x 1000  (16:10)
     about ..................  900 x 1100  (4:5)
     menu banner ........... 1600 x  700
     product images .........  800 x  800  (1:1  — square)
     occasion images ........  800 x 1000  (4:5)
     gallery images .........  900 wide (height follows the photo)
     instagram images .......  600 x  600  (1:1  — square)

   TO SWAP IN YOUR OWN PHOTOS: drop your JPGs into assets/images/... using the
   SAME file names, or just change the path below. Both work.
   ========================================================================== */

const SITE = {

  /* ---------------------------------------------------------------- BRAND
     logo      → the full badge logo (used in the footer + page headers)
     logoMark  → badge with the chef hat only, no words (used in the navbar)
     Both are built from your real logo artwork by tools/make_brand_images.py.
     If you get a new logo, point SOURCE in that script at it and run it again.
  ----------------------------------------------------------------------- */
  brand: {
    name: "Crave for Cake",
    sub: "Home Bakery",
    tagline: "Made With Love, Baked To Crave",
    footerLine: "Sweet moments start here.",
    copyright: "© 2026 Crave for Cake. All Rights Reserved.",
    logo: "assets/images/logo.png",
    logoMark: "assets/images/logo-mark.png",
    footerNote: ""
  },

  /* ------------------------------------------------------------- CONTACT
     Everything here is real — phone, WhatsApp, email, Instagram, delivery
     area, ordering terms and business hours.
     whatsapp  → digits only, with country code, no + and no spaces.
                 Pakistan example: 923001234567
  ----------------------------------------------------------------------- */
  contact: {
    whatsapp: "923012240718",              // real
    whatsappDisplay: "+92 301 2240718",    // real
    phone: "923012240718",                 // real
    phoneDisplay: "+92 301 2240718",       // real
    email: "craveforcake16@gmail.com",     // real
    instagramHandle: "@cravefor_cake",     // real
    instagramUrl: "https://www.instagram.com/cravefor_cake/",   // real
    deliveryAreas: ["Karachi"],            // real — you deliver in Khi only
    deliveryNote: "We deliver within Karachi only. Delivery charges are applied according to your area.",

    /* how ordering works — shown on the Contact page and above the order form */
    orderTerms: [
      "Please place your order 2 to 3 days in advance.",
      "50% advance payment confirms your order.",
      "Delivery charges apply according to your area."
    ],

    hours: [                               // real — open 7 days, no weekly off
      { days: "Every day", time: "10:00 AM – 10:00 PM" }
    ]
  },

  /* ============================== ORDER + CONTACT FORM → YOUR EMAIL ======
     Both forms can email you every order and message. No server or hosting
     needed — it works on a plain static site like this one.

     HOW TO SWITCH IT ON (one time, about two minutes):
       1. go to  https://web3forms.com
       2. type in the email address where you want orders to arrive
       3. they email you an "access key" — a long code
       4. paste that code between the quotes below and save this file

     Until a key is pasted here, both forms fall back to WhatsApp: they hand
     the filled-in details to WhatsApp instead of emailing them.
  ======================================================================== */
  formAccessKey: "8dfb5555-b150-4a40-87c6-d18849727b49",   // Web3Forms key — orders + messages arrive by email

  /* ----------------------------------------------------------------- HERO */
  hero: {
    image: "assets/images/hero.jpg",
    heading: "Made With Love, Baked To Crave",
    text: "Delicious cakes and desserts, freshly made for your sweetest moments."
  },

  aboutImage: "assets/images/about.jpg",
  menuBanner: "assets/images/menu-banner.jpg",

  /* ----------------------------------------------------- MENU CATEGORIES */
  categories: [
    { id: "custom-cakes",    name: "Custom Cakes" },
    { id: "signature-cakes", name: "Signature Cakes" },
    { id: "chocolate-cakes", name: "Chocolate Cakes" },
    { id: "brownies",        name: "Brownies" },
    { id: "cupcakes",        name: "Cupcakes" }
  ],

  /* --------------------------------------------------------------- PRICES
     currency  → shown before every price
     menuNote  → the line printed on your menu card, shown above the prices
  ----------------------------------------------------------------------- */
  currency: "Rs.",
  menuNote: "All cake prices are for 1 pound. Customised cake charges will be different.",

  /* ------------------------------------------------------------- PRODUCTS
     id          unique, lowercase, no spaces
     category    must match a category id above
     price       number, or 0 to show "Price on request"
     unit        printed under the price, e.g. "per pound"
     bestSeller  true → also shows in the Best Sellers row on the home page
     sizes       shown on the product details page
     flavors     shown on the product details page
     custom      true → the form also asks for design / theme
  ----------------------------------------------------------------------- */
  products: [
    {
      id: "custom-cake",
      name: "Custom Cake",
      category: "custom-cakes",
      price: 0,
      unit: "priced by design",
      image: "assets/images/products/custom-cake.jpg",
      short: "Designed around your theme, colours and celebration.",
      description: "A cake made to your brief. Tell us the occasion, the flavour, the colours and the look you have in mind, and we bake and decorate it to match. Customised cake charges are different from the standard menu prices — share your idea and we'll confirm the price for you.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb", "Other (mention below)"],
      flavors: ["White Frosting", "Colour Frosting", "Chocolate", "Nutella", "Pineapple", "Black Forest", "Red Velvet", "Tea / Marble"],
      custom: true,
      bestSeller: true
    },
    {
      id: "white-frosting-cake",
      name: "White Frosting Cake",
      category: "signature-cakes",
      price: 1000,
      unit: "per pound",
      image: "assets/images/products/white-frosting-cake.jpg",
      short: "Soft sponge finished in smooth white frosting.",
      description: "Our classic white frosting cake — soft sponge under a clean, smooth finish. Simple, elegant and easy to dress up with a message on top.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Vanilla", "Chocolate"],
      bestSeller: false
    },
    {
      id: "colour-frosting-cake",
      name: "Colour Frosting Cake",
      category: "signature-cakes",
      price: 1100,
      unit: "per pound",
      image: "assets/images/products/colour-frosting-cake.jpg",
      short: "The same soft sponge, finished in the colour you choose.",
      description: "Choose your frosting colour and we finish the cake to match your theme — perfect when the cake needs to sit with a colour scheme.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Vanilla", "Chocolate"],
      bestSeller: false
    },
    {
      id: "black-forest-cake",
      name: "Black Forest Cake",
      category: "signature-cakes",
      price: 1100,
      unit: "per pound",
      image: "assets/images/products/black-forest-cake.jpg",
      short: "Chocolate sponge, cream and cherries.",
      description: "The classic — layers of chocolate sponge with cream and cherries. A safe favourite for a table full of different tastes.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Black Forest"],
      bestSeller: false
    },
    {
      id: "pineapple-cake",
      name: "Pineapple Cake",
      category: "signature-cakes",
      price: 1100,
      unit: "per pound",
      image: "assets/images/products/pineapple-cake.jpg",
      short: "Light, fresh and not too sweet.",
      description: "Soft sponge layered with cream and pineapple. Light on the palate, which makes it a good choice after a heavy meal.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Pineapple"],
      bestSeller: false
    },
    {
      id: "red-velvet-cake",
      name: "Red Velvet Cake",
      category: "signature-cakes",
      price: 1500,
      unit: "per pound",
      image: "assets/images/products/red-velvet-cake.jpg",
      short: "Deep red sponge with a smooth cream cheese finish.",
      description: "Red velvet sponge with a smooth cream finish — rich without being heavy, and always the first slice to go.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Red Velvet"],
      bestSeller: true
    },
    {
      id: "tea-marble-cake",
      name: "Tea / Marble Cake",
      category: "signature-cakes",
      price: 650,
      unit: "per pound",
      image: "assets/images/products/tea-marble-cake.jpg",
      short: "A simple loaf cake for everyday tea.",
      description: "Plain tea cake or marble — no frosting, just a soft, buttery loaf. Made for chai, guests dropping in, and the ordinary days.",
      sizes: ["1 lb", "2 lb"],
      flavors: ["Tea (plain)", "Marble"],
      bestSeller: false
    },
    {
      id: "chocolate-cake",
      name: "Chocolate Cake",
      category: "chocolate-cakes",
      price: 1300,
      unit: "per pound",
      image: "assets/images/products/chocolate-cake.jpg",
      short: "Rich chocolate sponge, chocolate all the way through.",
      description: "Chocolate sponge with a chocolate finish — the one to order when the table wants chocolate and nothing else will do.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Chocolate"],
      bestSeller: true
    },
    {
      id: "nutella-cake",
      name: "Nutella Cake",
      category: "chocolate-cakes",
      price: 1500,
      unit: "per pound",
      image: "assets/images/products/nutella-cake.jpg",
      short: "Chocolate sponge layered with Nutella.",
      description: "Chocolate sponge layered and finished with Nutella. Rich, indulgent and worth the extra.",
      sizes: ["1 lb", "2 lb", "3 lb", "4 lb"],
      flavors: ["Nutella"],
      bestSeller: true
    },
    {
      id: "brownie-box",
      name: "Brownies",
      category: "brownies",
      price: 900,
      unit: "for 6 pieces",
      image: "assets/images/products/brownie-box.jpg",
      short: "Fudgy chocolate brownies, six to a box.",
      description: "Dense, fudgy chocolate brownies with a soft centre, boxed by the half dozen. Good for gifting, good for keeping.",
      sizes: ["6 pieces", "12 pieces"],
      flavors: ["Chocolate", "Chocolate with walnuts"],
      bestSeller: true
    },
    {
      id: "cupcake-box",
      name: "Cupcakes",
      category: "cupcakes",
      price: 850,
      unit: "for 6 pieces",
      image: "assets/images/products/cupcake-box.jpg",
      short: "Hand-piped cupcakes, six to a box.",
      description: "Soft cupcakes finished with hand-piped frosting, six to a box. Tell us the colour and we'll pipe them to suit your occasion.",
      sizes: ["6 pieces", "12 pieces"],
      flavors: ["Vanilla", "Chocolate", "Red Velvet"],
      bestSeller: true
    }
  ],

  /* --------------------------------------------------- WHY CHOOSE US CARDS */
  features: [
    { icon: "🎂", title: "Freshly Baked",       text: "Every order is baked to order — never made in advance, never sitting on a shelf." },
    { icon: "❤️", title: "Made With Love",      text: "A home bakery. Small batches, made by hand, with the care you'd bake with at home." },
    { icon: "✨", title: "Custom Designs",      text: "Bring us a theme, a colour or a photo, and we'll design the cake around it." },
    { icon: "🍫", title: "Quality Ingredients", text: "Real butter, real chocolate, real cream. It's the part you can taste." }
  ],

  /* ------------------------------------------------------------ OCCASIONS */
  occasions: [
    { title: "Birthdays",       text: "Candles, colours and a message on top.", image: "assets/images/occasions/birthdays.jpg" },
    { title: "Anniversaries",   text: "Quietly elegant cakes for the two of you.", image: "assets/images/occasions/anniversaries.jpg" },
    { title: "Weddings",        text: "Tiered cakes designed around your day.", image: "assets/images/occasions/weddings.jpg" },
    { title: "Celebrations",    text: "Graduations, promotions, new beginnings.", image: "assets/images/occasions/celebrations.jpg" },
    { title: "Special Moments", text: "The small days worth marking too.", image: "assets/images/occasions/special-moments.jpg" }
  ],

  /* -------------------------------------------------------------- GALLERY
     category must be one of: cakes | brownies | cupcakes | custom
  ----------------------------------------------------------------------- */
  gallery: [
    { image: "assets/images/gallery/cakes-01.jpg",         category: "cakes",    caption: "Father's Day cake" },
    { image: "assets/images/gallery/custom-01.jpg",        category: "custom",   caption: "Independence Day cake" },
    { image: "assets/images/gallery/brownies-01.jpg",      category: "brownies", caption: "Brownie box with chocolate drizzle" },
    { image: "assets/images/gallery/cupcakes-01.jpg",      category: "cupcakes", caption: "Butterfly cake with cupcakes" },
    { image: "assets/images/gallery/cakes-02.jpg",         category: "cakes",    caption: "Chocolate cake, freshly cut" },
    { image: "assets/images/gallery/custom-02.jpg",        category: "custom",   caption: "Photo-print cake" },
    { image: "assets/images/gallery/brownies-02.jpg",      category: "brownies", caption: "A tray of fresh brownies" },
    { image: "assets/images/gallery/cupcakes-02.jpg",      category: "cupcakes", caption: "Red velvet cupcakes and brownies" },
    { image: "assets/images/gallery/cakes-03.jpg",         category: "cakes",    caption: "Chocolate birthday cake" },
    { image: "assets/images/gallery/custom-03.jpg",        category: "custom",   caption: "Independence Day cake" },
    { image: "assets/images/gallery/brownies-03.jpg",      category: "brownies", caption: "Fudgy brownie squares" },
    { image: "assets/images/gallery/cupcakes-03.jpg",      category: "cupcakes", caption: "Hand-piped cupcakes" },
    { image: "assets/images/gallery/cakes-04.jpg",         category: "cakes",    caption: "Chocolate and cream cake" },
    { image: "assets/images/gallery/custom-04.jpg",        category: "custom",   caption: "Islamic themed cake" },
    { image: "assets/images/gallery/brownies-04.jpg",      category: "brownies", caption: "Brownie, cut into slices" },
    { image: "assets/images/gallery/cakes-05.jpg",         category: "cakes",    caption: "Tea cake, sliced" },
    { image: "assets/images/gallery/custom-05.jpg",        category: "custom",   caption: "Bride-to-be cake" },
    { image: "assets/images/gallery/brownies-05.jpg",      category: "brownies", caption: "Brownie box" },
    { image: "assets/images/gallery/cakes-06.jpg",         category: "cakes",    caption: "Graduation cake" },
    { image: "assets/images/gallery/custom-06.jpg",        category: "custom",   caption: "Doll cake in piped rosettes" },
    { image: "assets/images/gallery/cakes-07.jpg",         category: "cakes",    caption: "Rose gold drip cake" },
    { image: "assets/images/gallery/custom-07.jpg",        category: "custom",   caption: "Umrah Mubarak cake" },
    { image: "assets/images/gallery/cakes-08.jpg",         category: "cakes",    caption: "Eighteenth birthday cake" },
    { image: "assets/images/gallery/custom-08.jpg",        category: "custom",   caption: "Islamic themed cake" },
    { image: "assets/images/gallery/cakes-09.jpg",         category: "cakes",    caption: "Welcome cake" },
    { image: "assets/images/gallery/custom-09.jpg",        category: "custom",   caption: "Second birthday cake" },
    { image: "assets/images/gallery/cakes-10.jpg",         category: "cakes",    caption: "Third birthday cake" },
    { image: "assets/images/gallery/custom-10.jpg",        category: "custom",   caption: "Character birthday cake" },
    { image: "assets/images/gallery/cakes-11.jpg",         category: "cakes",    caption: "Birthday cake with piped lettering" },
    { image: "assets/images/gallery/cakes-12.jpg",         category: "cakes",    caption: "White frosting with a handwritten message" },
    { image: "assets/images/gallery/cakes-13.jpg",         category: "cakes",    caption: "Chocolate rosette drip cake" },
    { image: "assets/images/gallery/cakes-14.jpg",         category: "cakes",    caption: "Nutella cake with chocolate bars" },
    { image: "assets/images/gallery/cakes-15.jpg",         category: "cakes",    caption: "Mocha rosette cake" },
    { image: "assets/images/gallery/cakes-16.jpg",         category: "cakes",    caption: "Pink butterfly cake" },
    { image: "assets/images/gallery/cakes-17.jpg",         category: "cakes",    caption: "Twenty-first birthday cake" },
    { image: "assets/images/gallery/cakes-18.jpg",         category: "cakes",    caption: "White cake with sugar roses" },
    { image: "assets/images/gallery/cakes-19.jpg",         category: "cakes",    caption: "Pineapple cake" },
    { image: "assets/images/gallery/cakes-20.jpg",         category: "cakes",    caption: "Red velvet, freshly cut" },
    { image: "assets/images/gallery/cakes-21.jpg",         category: "cakes",    caption: "Chocolate anniversary cake" },
    { image: "assets/images/gallery/cakes-22.jpg",         category: "cakes",    caption: "Chocolate swirl cake" },
    { image: "assets/images/gallery/cakes-23.jpg",         category: "cakes",    caption: "Cream cake, freshly cut" },
    { image: "assets/images/gallery/cakes-24.jpg",         category: "cakes",    caption: "Anniversary cake" },
    { image: "assets/images/gallery/cakes-25.jpg",         category: "cakes",    caption: "Purple butterfly cake" },
    { image: "assets/images/gallery/cakes-26.jpg",         category: "cakes",    caption: "Marble loaf cake" },
    { image: "assets/images/gallery/cakes-27.jpg",         category: "cakes",    caption: "Marble cake, sliced" },
    { image: "assets/images/gallery/cakes-28.jpg",         category: "cakes",    caption: "Cocoa-dusted cream cake" }
  ],

  /* ------------------------------------------------------------ INSTAGRAM */
  instagram: [
    "assets/images/instagram/post-01.jpg",
    "assets/images/instagram/post-02.jpg",
    "assets/images/instagram/post-03.jpg",
    "assets/images/instagram/post-04.jpg",
    "assets/images/instagram/post-05.jpg",
    "assets/images/instagram/post-06.jpg"
  ],

  /* ================================================================ REVIEWS
     These are your REAL customer reviews, taken from the "Reviews ❤️"
     highlight on Instagram and from WhatsApp.

     No customer names were visible in the screenshots, so each review is
     labelled with what it was for instead. When you have permission to use
     a customer's name, just replace the `name` value — nothing else changes.

     reviewsAreSamples is now false, so the "sample" tags and the notice
     above the section are gone and these show as genuine testimonials.
  ======================================================================== */
  reviewsAreSamples: false,

  /* how many to show before the "Show all reviews" button appears */
  reviewsOnHome: 6,

  reviews: [
    { name: "Chocolate beads cake", meta: "via WhatsApp", rating: 5,
      text: "Yarr cakee was 10/10. Like lga hi nh k ghr mai bnayaa hayyy, esa lgra tha Delizia ka cake khaa raheee hounnn. And the chocolate beads part wasss the bestttttt. Bhttt yummy, bht zyada tastyy cake thaaa. Thankeiuu ❤️" },

    { name: "Mickey Mouse birthday cake", meta: "via Instagram", rating: 5,
      text: "Thankyou @cravefor_cake for amazing cake ❤️😍 It was yummiest 🤤" },

    { name: "Nutella brownies", meta: "via WhatsApp", rating: 5,
      text: "Your homemade brownies, it was so delicious. Experiment with Nutella flavor bht achaa lgaa.. I'd love to place another order. ❤️" },

    { name: "Dessert order", meta: "via WhatsApp", rating: 5,
      text: "The packing, the taste, everything was more than expected. Everything was so balanced 🤍 Can't wait to order more from you!! ❤️" },

    { name: "Mustafa Turns Two cake", meta: "via Instagram", rating: 5,
      text: "@cravefor_cake You really know how to make someone feel special with your baking ❤️" },

    { name: "Birthday cake", meta: "via WhatsApp", rating: 5,
      text: "Thankyou so much 💕 Cake bhut acha tha. Soft tha. Bhut mazey ka tha ❤️ Thankyou so much. Allah apko kamyabi de 💕" },

    { name: "Chocolate cake", meta: "via WhatsApp", rating: 4,
      text: "The 2nd yummiest cakee of the year — 1st tou anniversary wala thaa. Bhttt mazee kaaa, bhtt bhtt bhttt. The chocolate 🍫 the amount of chocolate 🥹 like chocolate heaven." },

    { name: "Doll cake", meta: "via Instagram", rating: 5,
      text: "And as always @cravefor_cake surprises us on our special occasions ✨🎀" },

    { name: "Umrah Mubarak cake", meta: "via WhatsApp", rating: 5,
      text: "MashaAllah cake bohut acha tha and taste bhi acha tha. Thank you Crave for Cake 🍰" },

    { name: "Celebration cake", meta: "via Instagram", rating: 5,
      text: "Cake bht acha tha, subko bht pasand aya or taste bhi bht acha tha ❤️ Thank you 😊" },

    { name: "Decorated cake", meta: "via Instagram", rating: 5,
      text: "Taste was so good and the decoration of the cake was also perfect ❤️❤️" },

    { name: "Independence Day cake", meta: "via WhatsApp", rating: 5,
      text: "Mashallah bhot bhot acha test hai and good job 👍" },

    { name: "Two cakes", meta: "via WhatsApp", rating: 5,
      text: "Best best 🤍 Both cakes were vry good." },

    { name: "Cake order", meta: "via WhatsApp", rating: 5,
      text: "Mashallah bahut achcha tha. Thank you so much." }
  ],

  /* -------------------------------------------------------------- ABOUT US */
  about: {
    eyebrow: "About us",
    heading: "Cakes worth craving, made for the days you'll remember",
    body: [
      "Crave for Cake is a home bakery. We make fresh cakes, brownies and cupcakes for birthdays, anniversaries, weddings and the ordinary days that deserve something sweet.",
      "Everything is baked to order in small batches. Nothing is made ahead and left waiting — when you place an order, that's when we start baking. It's a slower way to work, and it's the reason our cakes taste the way they do.",
      "We also design custom cakes. Bring us a colour, a theme, a photo or just a rough idea of what you're imagining, and we'll build the cake around it."
    ],
    points: [
      { title: "Baked to order",    text: "Nothing is pre-made. Your cake is baked for your date." },
      { title: "Designed with you", text: "Custom flavours, sizes, colours, themes and messages." },
      { title: "Made by hand",      text: "Small batches, hand-piped detail, finished one at a time." }
    ]
  }
};

/* Order form dropdown options — edit freely.
   These match the flavours and sizes on the printed menu. */
const ORDER_OPTIONS = {
  flavors: ["White Frosting", "Colour Frosting", "Chocolate", "Nutella", "Pineapple",
            "Black Forest", "Red Velvet", "Tea / Marble", "Other (mention below)"],
  sizes:   ["1 lb", "1.5 lb", "2 lb", "3 lb", "4 lb",
            "6 pieces", "12 pieces", "Other (mention below)"]
};
