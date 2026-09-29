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
| `robots.txt`, `sitemap.xml` | Search engine crawling and page list |

### Shared assets

All pages load `assets.min.css`. Every page except the homepage loads
`assets.min.js`; the homepage loads `assets.js` directly so its hero slide
controls stay in sync with the latest source.

`assets.css` and `assets.js` are the files to edit. After changing them,
regenerate the matching `.min` file and bump the `?v=` query string on the
`<link>` / `<script>` tags so browsers fetch the new version.

### Languages

The site is currently English-only: the EN / አማርኛ switch is in the markup but
hidden with CSS (`.langswitch{display:none}` in `assets.css`). Amharic strings
are kept in `assets.js` (`I18N.am`) so the toggle can be re-enabled; the
visitor's choice is remembered in `localStorage`.

### Editing pages

The HTML pages are maintained by hand. The site header and footer are repeated
in each page, so change them in every HTML file.

## Preview locally

```
python -m http.server 8000
```

then open <http://localhost:8000>. (Or just open `index.html` — only the Google
Maps embed on the contact page needs a connection.)
