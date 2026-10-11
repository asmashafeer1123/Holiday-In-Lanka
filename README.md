# Holiday-In-Lanka
Elevating Lankan Tourism

## LankaSky — domestic airline website prototype

A static, four-page prototype for a fictional Sri Lankan domestic airline, styled in purple and white
with **Carla Sans** set as the typeface across the whole site.

Open `index.html` in a browser — no build step or server needed.

| Nav widget       | Page                | What it shows |
|------------------|---------------------|---------------|
| Book             | `index.html`        | Hero banner, flight search widget with mock results, popular routes, promo |
| Destinations     | `destinations.html` | All seven destinations with filters (beaches, culture, nature) |
| Flight Status    | `status.html`       | Search by flight number or route, live-style departures board and tracker |
| Help & Contact   | `contact.html`      | Contact form, contact details, FAQ |

- Styles: `assets/css/styles.css` (colour tokens at the top under `:root`)
- Behaviour + mock data: `assets/js/main.js`

**Font note:** Carla Sans isn't available on Google Fonts, so the font stack is
`"Carla Sans", "Karla", …`. If Carla Sans is installed on the viewer's machine (or you add its
`@font-face` files to `assets/`), it's used everywhere; otherwise the similar Karla is loaded as a fallback.
