# KI Construction Materials Importer — Website

Marketing website for **KI Construction Materials Importer**, Addis Ababa, Ethiopia —
importer, exporter and distributor of construction and industrial machinery.
Built by Velora Software.

## Live site

Served with GitHub Pages from the `main` branch (repository root).

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
| `contact.html` | Contact |
| `assets.css` | Shared styles (loaded once, cached across pages) |
| `assets.js` | Shared behaviour: mobile menu, EN / አማርኛ language toggle, footer year |
| `img/` | Compressed images |

### Languages

English is authored directly in the page markup. Amharic strings live in
`assets.js` (`I18N.am`) and are swapped in by the header toggle; the visitor's
choice is remembered in `localStorage`.

### Regenerating the pages

The HTML pages and `img/` are produced by an internal build script that
compresses source photos and assembles the shared header/footer. `assets.css`
and `assets.js` are edited by hand.

## Preview locally

```
python -m http.server 8000
```

then open <http://localhost:8000>. (Or just open `index.html` — only the Google
Maps embed on the contact page needs a connection.)
