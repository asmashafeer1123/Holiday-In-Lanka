# Holiday in Lanka

**Elevating Lankan tourism.** Holiday in Lanka is a final year project: a mobile-first Sri Lanka trip planner for first-time and independent travellers. It builds realistic, monsoon-aware itineraries, highlights hidden parts of the island, and shows the best time to visit each region.

Built with **Node.js + Express** on the server and plain **HTML, CSS and JavaScript** in the browser, so there is no framework or build step to learn.

---

## 1. What is included

| Area | Where |
| --- | --- |
| Home page: all sections, from the hero to the footer | `public/index.html` |
| Styles (colours, fonts, layout) | `public/css/styles.css` |
| Browser behaviour (menu, form, month picker, placeholders) | `public/js/main.js` |
| Web server and API | `server.js` |
| Itinerary generator (seasons, travel times, costs) | `lib/itinerary.js` |
| Destinations and monsoon data | `data/destinations.js` |
| Automated tests | `tests/itinerary.test.js` |
| Your images and videos go here | `public/assets/images/`, `public/assets/videos/` |

### Homepage sections, in order
1. Hero with a soundless background video (falls back to an image placeholder)
2. Experiences (featured experience tiles)
3. Why Holiday in Lanka (4 cards)
4. How it works (3 steps with a flow diagram)
5. Plan My Trip form: **a working itinerary generator**
6. Destinations: **"Best time to visit" month picker** and hidden gem cards
7. Popular Sri Lanka routes
8. Trusted stays and experiences
9. Transport made simple
10. Travel support and safety
11. Why Sri Lanka: **video testimonials**, traveller reviews and stats
12. FAQ, About, final call to action, footer (newsletter, language selector, social links)

### API endpoints
- `GET /api/destinations`: destination and season data
- `POST /api/itinerary`: returns a day-by-day plan, travel times, weather notes and cost estimate
- `POST /api/newsletter`: saves an email to `data/subscribers.json`

### How the itinerary generator works (useful for your report)
1. It finds the month in the middle of the trip and checks each destination's season (`best`, `good` or `wet`). Sri Lanka has two monsoons: the southwest monsoon (May to September) and the northeast monsoon (December to February).
2. It scores each destination on season, matching interests and must-see places. Lesser-known places get a small bonus, to spread tourism around the island.
3. It picks destinations that are close to each other, then orders them as a route starting from the airport.
4. Travel time = straight-line distance x road factor / typical speed for the terrain (hill roads are slower), plus a 20% buffer and 15 minutes for rest stops.
5. Costs = daily cost per budget level x nights x travellers, plus transport per hour of travel.

---

## 2. Set up on your computer (step by step)

### Step 1: Install the tools
1. **Node.js**: download the **LTS** version from https://nodejs.org and install it.
2. **VS Code**: download from https://code.visualstudio.com.
3. **Git**: https://git-scm.com (only needed if you do not have it yet).

To check that Node is installed, open a terminal and run:
```bash
node -v
npm -v
```
Both should print a version number (Node 18 or newer).

### Step 2: Get the project
```bash
git clone https://github.com/asmashafeer1123/Holiday-In-Lanka.git
cd Holiday-In-Lanka
git checkout claude/holiday-lanka-tourism-site-9st31r
```

### Step 3: Open it in VS Code
- Run `code .` in the project folder, **or** open VS Code and choose **File > Open Folder**.
- Open the built-in terminal with **Terminal > New Terminal** (shortcut: `` Ctrl + ` ``).

Recommended VS Code extensions (open the Extensions tab with `Ctrl+Shift+X`):
- **Prettier**: tidies your code when you save
- **ESLint**: highlights JavaScript mistakes
- **Auto Rename Tag**: renames matching HTML tags together
- **WebP Converter** or any image tool, if you want to convert images inside VS Code

### Step 4: Install and run
In the VS Code terminal:
```bash
npm install      # downloads Express (only needed once)
npm run dev      # starts the site and restarts it every time you save a file
```
Open **http://localhost:3000** in your browser. To stop the server, click in the terminal and press `Ctrl + C`.

Other commands:
```bash
npm start        # run without auto-restart (use this for deployment)
npm test         # run the itinerary tests
```

> Important: open the site through `http://localhost:3000`, not by double-clicking `index.html`. The trip planner and the "Best time to visit" widget need the Node server.

### Step 5: Test on your phone
With the server running, find your computer's local IP address (`ipconfig` on Windows, `ifconfig` on Mac). Then, on a phone connected to the same Wi-Fi, open `http://YOUR-IP:3000`. You can also press `F12` in Chrome and click the phone icon to preview mobile sizes.

---

## 3. Adding your images and videos

**For a placeholder-by-placeholder guide with line numbers, see [PLACEHOLDERS.md](PLACEHOLDERS.md).**

Every placeholder is labelled on the page (for example `[IMAGE PLACEHOLDER: Sigiriya sunrise]`) and marked in the code with a `<!-- TODO: Replace ... -->` comment.

### The easy way: drop in files with the right names
The site checks for each file automatically. **Save a file with the exact name listed below and refresh the page.** The placeholder is replaced with no code changes needed. To find any placeholder's file name, search `index.html` for `data-src=` or `data-video=` (`Ctrl+F` in VS Code).

#### Videos (`public/assets/videos/`)
| File | Where it appears |
| --- | --- |
| `hero.mp4` (optional extra: `hero.webm`) | Hero background video (autoplays, muted, loops) |
| `testimonial-1.mp4` | Testimonial video 1 (Emma: train to Ella) |
| `testimonial-2.mp4` | Testimonial video 2 (Lukas and Mia: wildlife) |
| `testimonial-3.mp4` | Testimonial video 3 (Priya: hospitality) |

#### Images (`public/assets/images/`)
| File | Where it appears |
| --- | --- |
| `hero-poster.webp` | First frame shown while the hero video loads |
| `hero-fallback.webp` | Hero image if there is no video |
| `exp-train.webp`, `exp-leopard.webp`, `exp-whale.webp`, `exp-culture.webp`, `exp-wellness.webp`, `exp-surf.webp`, `exp-village.webp` | Experiences tiles |
| `step-1.webp`, `step-2.webp`, `step-3.webp` | How it works graphics |
| `dest-tangalle.webp`, `dest-sinharaja.webp`, `dest-haputale.webp`, `dest-knuckles.webp`, `dest-ritigala.webp`, `dest-wilpattu.webp` | Hidden gem cards |
| `route-south-coast.webp`, `route-cultural-triangle.webp`, `route-hill-country.webp`, `route-east-coast.webp` | Popular routes |
| `stay-1.webp` to `stay-8.webp` | Stays and experiences cards (in page order) |
| `transport.webp` | Transport section |
| `testimonial-1-poster.webp` to `testimonial-3-poster.webp` | Cover image for each testimonial video |
| `traveller-1.webp` to `traveller-3.webp` | Traveller portraits (square, at least 200x200) |
| `about.webp` | About section |
| `final-cta.webp` | Final banner (sunset beach or tea hills) |
| `og-share.webp` | Social media share preview (1200x630) |

### Preparing the hero video
The hero should be **short (10 to 20 seconds), soundless and small (ideally under 5 MB)** so the page loads quickly.

1. Edit your clips into a highlights reel: beaches, tea country, wildlife, cultural sites. Free editors: CapCut, DaVinci Resolve, Clipchamp.
2. Export at 1920x1080 (or 1280x720 for a smaller file), with **no audio track**.
3. Compress it. With **HandBrake** (free), choose the "Web > Creator 1080p" preset and tick "No audio". With **ffmpeg**:
   ```bash
   ffmpeg -i my-reel.mp4 -an -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:-2" -movflags +faststart hero.mp4
   ffmpeg -i hero.mp4 -ss 00:00:01 -vframes 1 hero-poster.jpg
   ```
4. Save `hero.mp4` in `public/assets/videos/` and the poster frame (converted to WebP) as `public/assets/images/hero-poster.webp`.

Free stock footage, if you do not have your own: Pexels Videos, Pixabay and Coverr (search "Sri Lanka"). Check each licence and credit the creators in your report.

The hero video always plays muted, and visitors get a pause button (an accessibility requirement). If a visitor's device is set to "reduce motion", the video starts paused.

### Preparing images (WebP)
WebP images are much smaller than JPG or PNG, which makes the site faster and helps SEO.
- Online: https://squoosh.app (drag in a photo, choose WebP, quality around 75).
- Command line: `cwebp -q 75 photo.jpg -o exp-train.webp`
- Suggested widths: 1920px for the hero and banners, 1200px for large tiles, 800px for cards.

### Prefer to edit the HTML directly?
You can also replace a placeholder by hand. For example, change:
```html
<!-- TODO: Replace with real image: public/assets/images/route-south-coast.webp -->
<div class="ph ph-card" role="img" aria-label="Galle Fort lighthouse beside the ocean" data-src="/assets/images/route-south-coast.webp">
  <span class="ph-label">[IMAGE PLACEHOLDER: Classic South Coast - Galle Fort]</span>
</div>
```
to:
```html
<div class="ph ph-card is-loaded">
  <img src="/assets/images/route-south-coast.webp" alt="Galle Fort lighthouse beside the ocean" loading="lazy" width="800" height="600">
</div>
```
Always keep a meaningful `alt` text. It is important for accessibility and SEO.

---

## 4. Customising

- **Colours and fonts**: change the variables at the top of `public/css/styles.css` (`--seagreen`, `--sand`, `--ocean`, `--gold` and so on). The fonts are Cormorant Garamond (headings) and Jost (body), loaded from Google Fonts in `index.html`.
- **Destinations and seasons**: edit `data/destinations.js`. Add a destination with its coordinates, interests, `best` and `wet` months and activities, and both the trip planner and the "Best time to visit" widget pick it up automatically. Set `hidden: true` to show it as a hidden gem.
- **Prices**: `DAILY_COST` and `TRANSPORT_RATE` in `lib/itinerary.js`.
- **Contact details, social links, domain**: search `index.html` for `TODO`.

## 5. SEO and accessibility checklist (already built in)
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`), one `h1`, ordered headings
- Meta title and description targeting "Sri Lanka trip planner", "Sri Lanka itinerary", "independent travel Sri Lanka", "Sri Lanka travel planning without agent", "monsoon-aware Sri Lanka travel"
- JSON-LD schema: `TravelAgency`, `TouristAttraction` and `FAQPage`
- Lazy loading for images and videos, long-term caching for media, WebP file names
- Skip link, visible keyboard focus, ARIA labels, a keyboard-operable month picker (arrow keys), `aria-live` itinerary results, pause control on the hero video, reduced-motion support, colour contrast meeting WCAG AA for text

Check your work with **Lighthouse**: in Chrome press `F12`, open the Lighthouse tab and click "Analyze page load".

## 6. Putting it online (optional)
The site is a standard Node app, so it can be hosted for free on **Render** (https://render.com):
1. Push your code to GitHub.
2. In Render, create a **New Web Service** and connect the repository.
3. Build command `npm install`, start command `npm start`.

Railway and Fly.io work the same way. Note that the newsletter list is stored in a file, which free hosts reset. For a real launch, connect a database or a mailing service such as Mailchimp.

## 7. Ideas for further development
- User accounts so travellers can save itineraries
- Live train schedules (Sri Lanka Railways) and real booking integrations
- An admin page for adding verified providers
- Sinhala and Tamil translations (the language selector is already in the footer)
- A live weather API to show current conditions on each destination
