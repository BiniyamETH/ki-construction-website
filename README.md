# KI Construction Materials Importer — Website

Marketing website for **KI Construction Materials Importer**, Addis Ababa, Ethiopia —
importer, exporter and distributor of construction and industrial machinery.
Built by Velora Software.

## Live site

<https://kiconstruction.site> — served with GitHub Pages from the `main` branch
(repository root). The custom domain is set in `CNAME`.

## Structure

Plain static HTML/CSS/JS — no framework, no build step required to serve.

| Path | |
|---|---|
| `index.html` | Home |
| `products.html` | Products overview |
| `product-generating-sets.html` | Generating sets & power equipment |
| `product-hydraulic-breakers.html` | Hydraulic breakers & attachments |
| `product-pumps.html` | Pumps & solar pumps |
| `product-construction-machinery.html` | Construction machinery |
| `product-electro-mechanical.html` | Electro-mechanical |
| `about.html` | About |
| `achievements.html` | Achievements |
| `careers.html` | Careers |
| `quote.html` | Request a quotation |
| `contact.html` | Contact |
| `assets.css` / `assets.min.css` | Shared styles — source and the minified copy every page loads |
| `assets.js` / `assets.min.js` | Shared behaviour: mobile menu, hero slides, language strings, footer year — source and minified copy |
| `home-refresh.css` | Homepage-only layout and product interactions, using the shared navy/blue palette |
| `home-experience.js` | Featured equipment filters, gallery controls, and section reveals |
| `img/` | Compressed images |
| `404.html` | Page not found |
| `robots.txt`, `sitemap.xml` | Search engine crawling and page list |
| `llms.txt` | Plain-text company summary for AI assistants (ChatGPT, Claude, Perplexity) |

### Shared assets

All pages load `assets.min.css` and `assets.min.js`.

`assets.css` and `assets.js` are the files to edit. After changing them,
regenerate the matching `.min` file and bump the `?v=` query string on the
`<link>` / `<script>` tags so browsers fetch the new version:

```
npx terser assets.js -c -m -o assets.min.js
npx clean-css-cli -O1 assets.css -o assets.min.css
```

### Images

Pages use WebP images (`img/*.webp`). The `.jpg` originals are kept for
social-media previews (`og:image`) and old links. Keep photos at most 800px
wide (hero photos 1280px) and compress them before adding them.

`404.html` is the "page not found" page GitHub Pages serves for unknown URLs.

### Languages

The site is currently English-only: the EN / አማርኛ switch is in the markup but
hidden with CSS (`.langswitch{display:none}` in `assets.css`). Amharic strings
are kept in `assets.js` (`I18N.am`) so the toggle can be re-enabled; the
visitor's choice is remembered in `localStorage`.

### Editing pages

The HTML pages are maintained by hand. Link between pages without the `.html`
extension (`href="about"`), and keep each page's canonical URL and its
`sitemap.xml` entry in the same form. The site header and footer are repeated
in each page, so change them in every HTML file.

## Search engines & SEO

The site is registered in Google Search Console and Bing Webmaster Tools
(domain property `kiconstruction.site`, sitemap `sitemap.xml` submitted to both).

**AI search** (ChatGPT, Claude, Perplexity, Gemini)

- `llms.txt` — plain-text company summary with links to every product page.
  Update it when products, brands, phones or the address change.
- `robots.txt` — explicitly allows AI crawlers (OAI-SearchBot, GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended and others) and Bingbot.
- `index.html` — `Organization` JSON-LD with founding date, founder, brands
  and product types.

**Product-page keywords** — each product page targets buyer searches
(suggested keywords, not volume-verified):

| Page | Target searches |
|---|---|
| `product-generating-sets` | generator price in Ethiopia, diesel generator suppliers, Perkins generators Addis Ababa |
| `product-pumps` | water pump price in Ethiopia, solar water pumps in Ethiopia |
| `product-hydraulic-breakers` | hydraulic breaker suppliers in Ethiopia |
| `product-construction-machinery` | construction machinery, spare parts, concrete mixer price in Ethiopia |
| `product-electro-mechanical` | industrial valves suppliers in Ethiopia |

Each of these pages has a keyword-led `<title>` and meta/`og` description, a
visible "Prices & questions" section and matching `FAQPage` JSON-LD in the
`<head>`. No prices are published: answers explain what a price depends on and
invite a quote. If you change a question or answer, change it in both places.

**After changing a page**

1. Update that page's `<lastmod>` date in `sitemap.xml`.
2. In Search Console, use *URL inspection* → *Request indexing* for the page.
   (In Nov 2026 four product pages were "Discovered – currently not indexed"
   until indexing was requested.)

## Preview locally

```
npx serve .
```

then open the address it prints. Internal links use clean URLs without `.html`
(`/about`, `/products`, …) to match the canonical tags and `sitemap.xml`;
GitHub Pages and `serve` resolve them to the `.html` files, but
`python -m http.server` and opening files directly do not.
