# Syntrix Systems Inc. Website

A complete, responsive 5-page website built with plain HTML5, CSS3 and vanilla JavaScript. No build step, no frameworks, no installs.

## Run it

**Locally:** unzip the folder and double-click `index.html`. It opens in any modern browser.
For a more realistic preview you can run a tiny local server from inside this folder:

    python3 -m http.server 8000      # then open http://localhost:8000

**Online:** upload the entire folder contents to any static host (cPanel/public_html, Netlify, Vercel, Cloudflare Pages, GitHub Pages). Keep the folder structure unchanged.

## Folder structure

    index.html  about.html  services.html  portfolio.html  contact.html
    robots.txt  sitemap.xml
    assets/
      css/style.css            All styling. Brand colours are variables at the top (--orange, --ink).
      js/config.js             YOUR SETTINGS: phone, email, WhatsApp, social links, form endpoint.
      js/main.js               Menu, animations, counters, portfolio filter, form logic.
      images/brand/            Logo files, favicon, social-share image.
      images/services/         One illustration per service (SVG, also used in the portfolio).

## Things to update (in this order)

1. **Social links** - open `assets/js/config.js` and paste your URLs into `social`. Icons appear automatically on the Contact page and footer. Empty ones stay hidden.
2. **Contact form delivery** - by default the form opens the visitor's email app (and the WhatsApp button sends the same details to your WhatsApp). To receive submissions directly in your inbox, create a free form endpoint (Formspree, Getform or Web3Forms) and paste its URL into `formEndpoint` in `config.js`.
3. **Domain name** - the pages, `sitemap.xml` and `robots.txt` use `https://www.syntrixsystemsinc.com`. Search and replace it if your domain is different.
4. **Sample content** - the portfolio projects, testimonials and the numbers (150+ projects, 80+ clients, 98%) are realistic SAMPLES. Replace them with your real work and real client feedback before launch. Edit the text directly in the HTML files, or change the counter values in the `data-count="..."` attributes.
5. **Photos** - the site uses custom illustrations so every image always loads. To use photos, put your own (or licensed stock) images in `assets/images/` and change the `src` of the images in `services.html`, `portfolio.html` and `index.html`.
6. **Map** - the contact page shows an OpenStreetMap view of Bahawalpur. Replace the iframe `src` with a Google Maps embed of your exact office if you prefer.

## Fonts

Headings use Poppins and body text uses Inter (both widely used on business websites), loaded from Google Fonts. If a visitor is offline, the site falls back to system fonts and remains fully readable. To self-host, download the fonts, place them in `assets/fonts/` and replace the Google Fonts `<link>` with `@font-face` rules.

## Features

- Fully responsive (phone, tablet, laptop, desktop) with a mobile menu
- Scroll-triggered reveal animations, animated counters, hover effects, smooth scrolling
- Respects "reduce motion" settings; keyboard accessible with visible focus and a skip link
- Portfolio filter by service, "Get a Quote" buttons that pre-select the service in the form
- Floating WhatsApp button, back-to-top button, SEO meta tags, Open Graph tags, JSON-LD business data
- No external JavaScript libraries, so pages load fast
