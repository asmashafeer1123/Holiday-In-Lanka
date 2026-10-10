# Placeholder Guide: Adding Your Images and Videos

This guide lists **every placeholder** on the Holiday in Lanka homepage, in the order you see them while scrolling. For each one it gives the file name to use, the kind of photo or video that fits, the recommended size, and the nearby text you may want to edit.

All placeholders are in **`public/index.html`**. Line numbers are approximate: in VS Code, press `Ctrl + G` and type the line number, or press `Ctrl + F` and search for the file name.

---

## How replacing works (read this first)

Each placeholder is a labelled box like this:

```html
<!-- TODO: Replace with real image: public/assets/images/exp-train.webp -->
<div class="ph" role="img" aria-label="Blue train crossing the Nine Arch Bridge in Ella tea country" data-src="/assets/images/exp-train.webp">
  <span class="ph-label">[IMAGE PLACEHOLDER: Hill country train crossing Nine Arch Bridge]</span>
</div>
```

| Part | What it does | Do you need to edit it? |
| --- | --- | --- |
| `data-src="..."` (images) or `data-video="..."` (videos) | The file the site looks for | Only if you use a different file name |
| `aria-label="..."` | Becomes the image's **alt text** (read aloud by screen readers and used by Google) | Yes, if your photo shows something different |
| `[IMAGE PLACEHOLDER: ...]` | The label you see now. It hides itself once your file loads | No |

### Method 1: just add the file (recommended)
1. Prepare your photo (see "Preparing files" at the end).
2. Save it in **`public/assets/images/`** (videos go in **`public/assets/videos/`**) with the **exact file name** from the tables below.
3. Refresh http://localhost:3000. The photo replaces the placeholder automatically.

### Method 2: use your own file name
Keep your photo's name (for example `my-galle-photo.webp`) and change the path in `data-src`:
```html
data-src="/assets/images/my-galle-photo.webp"
```

### Method 3: write a normal `<img>` tag (optional)
If your report needs to show a plain HTML image tag, replace the whole `<div class="ph" ...> ... </div>` with:
```html
<div class="ph ph-card is-loaded">
  <img src="/assets/images/route-south-coast.webp" alt="Galle Fort lighthouse beside the ocean" loading="lazy" width="800" height="600">
</div>
```
Keep the outer `<div>` with its classes (`ph`, plus `ph-card` or similar) so the size and rounded corners stay the same, and add `is-loaded`.

> File names are **case-sensitive** once the site is online: `Exp-Train.WEBP` is not the same file as `exp-train.webp`. Use lowercase names to be safe.

---

## 1. Header logo (line ~140)

At the moment the logo is the letters "HL" in a green square.

```html
<span class="logo-mark" aria-hidden="true">HL</span>
<span class="logo-text">Holiday <em>in</em> Lanka</span>
```
To use a logo image, save it as `public/assets/images/logo.svg` (or `.png`) and replace those two lines with:
```html
<img src="/assets/images/logo.svg" alt="Holiday in Lanka" height="40">
```
Do the same in the footer (line ~899). For a light version of the logo on the dark footer, use a white logo file such as `logo-white.svg`.

---

## 2. Hero video and image (lines ~170-195)

| File | Folder | What to use | Size |
| --- | --- | --- | --- |
| `hero.mp4` | `videos/` | 10-20 second, **soundless** cinematic reel: beaches, tea country, wildlife, cultural sites | 1920x1080, under 5 MB |
| `hero.webm` (optional) | `videos/` | The same reel in WebM format (smaller file in Chrome) | 1920x1080 |
| `hero-poster.webp` | `images/` | A still frame from the video, shown while the video loads | 1920x1080 |
| `hero-fallback.webp` | `images/` | Backup photo if there is no video: palm-fringed beach or tea hills | 1920x1080 |

**Code (line ~182):**
```html
<video class="hero-video" id="hero-video" autoplay muted loop playsinline preload="metadata"
       poster="/assets/images/hero-poster.webp" aria-hidden="true" tabindex="-1">
  <source src="/assets/videos/hero.webm" type="video/webm">
  <source src="/assets/videos/hero.mp4" type="video/mp4">
</video>
```
- Using a different file name? Change `hero.mp4` in the `src` line.
- Only have an MP4? That is fine. Leave the `.webm` line in place: the browser skips it and plays the MP4.
- `muted`, `autoplay`, `loop` and `playsinline` must stay. Browsers block autoplaying videos that have sound, and phones need `playsinline`.

**Hero text you may want to edit (lines ~197-215):** the headline (`<h1>`), the subheadline (`hero-sub`), and the three trust badges.

---

## 3. Experiences section (lines ~228-300)

| Line | File | Photo to use | Size | Title on the tile |
| --- | --- | --- | --- | --- |
| ~230 | `exp-train.webp` | Blue train on the Nine Arch Bridge, Ella | 1200x1200 (large tile) | The world's most scenic train ride |
| ~241 | `exp-leopard.webp` | Leopard in Yala | 800x800 | Leopard and elephant safaris |
| ~251 | `exp-whale.webp` | Blue whale tail off Mirissa | 800x800 | Blue whale watching |
| ~261 | `exp-culture.webp` | Stupa in Anuradhapura, or Sigiriya | 800x800 | Ancient cities and sacred temples |
| ~271 | `exp-wellness.webp` | Ayurveda or spa scene | 800x800 | Ayurveda and slow living |
| ~281 | `exp-surf.webp` | Surfer at Arugam Bay | 1200x600 (wide tile) | Surf breaks and empty beaches |
| ~291 | `exp-village.webp` | Village cooking with clay pots | 1200x600 (wide tile) | Cook rice and curry with a village family |

Text appears on top of these photos, so choose images where the **bottom part is fairly simple**, without busy detail. A dark gradient is added automatically to keep the text readable.

To change a tile's title, edit the `<h3>` and the small tag (`<p class="experience-tag">`) just below each placeholder.

---

## 4. How it works: step graphics (lines ~345-380)

| Line | File | What to use | Size |
| --- | --- | --- | --- |
| ~349 | `step-1.webp` | Illustration: a traveller filling in trip details | 800x500 |
| ~360 | `step-2.webp` | Illustration: a route on a map of Sri Lanka | 800x500 |
| ~371 | `step-3.webp` | Illustration: a booking confirmation or support badge | 800x500 |

These are optional. If you leave them out, the line icons that are already there look tidy. Free illustrations: unDraw (undraw.co, where you can set the colour to `#1e7a66`) or Storyset.

---

## 5. Destinations: hidden gem cards (built by JavaScript)

These cards **are not in `index.html`**. They are created from `data/destinations.js` for every place marked `hidden: true`, and each one looks for `dest-<id>.webp`.

| File | Place | Photo idea |
| --- | --- | --- |
| `dest-tangalle.webp` | Tangalle | Empty golden beach or turtle at night |
| `dest-sinharaja.webp` | Sinharaja Rainforest | Rainforest canopy or endemic bird |
| `dest-haputale.webp` | Haputale | Lipton's Seat view over tea estates |
| `dest-knuckles.webp` | Knuckles Range | Misty mountain ridges, Meemure village |
| `dest-ritigala.webp` | Ritigala | Stone ruins in the jungle |
| `dest-wilpattu.webp` | Wilpattu | Leopard or natural lake (villu) |

Size: **800x600**. To change which places appear, or their text, edit `summary` and `hidden` in `data/destinations.js`. The first 6 places with `hidden: true` are shown.

---

## 6. Popular routes (lines ~500-600)

| Line | File | Photo to use | Size |
| --- | --- | --- | --- |
| ~504 | `route-south-coast.webp` | Galle Fort lighthouse | 800x600 |
| ~530 | `route-cultural-triangle.webp` | Sigiriya Lion Rock at sunrise | 800x600 |
| ~556 | `route-hill-country.webp` | Tea pickers on a green hillside | 800x600 |
| ~582 | `route-east-coast.webp` | Nilaveli or Trincomalee beach | 800x600 |

**Text to edit on each card:** the duration, ideal season and starting price (inside `<dl class="meta-list">`), the highlights line, and the day list inside "View itinerary" (`<ol>`).

---

## 7. Trusted stays and experiences (lines ~615-700)

| Line | File | Placeholder name on the card | Size |
| --- | --- | --- | --- |
| ~621 | `stay-1.webp` | Ramparts Villa, Galle Fort | 800x600 |
| ~631 | `stay-2.webp` | Tea Hill Homestay, Ella | 800x600 |
| ~641 | `stay-3.webp` | Dawn Leopard Safari, Yala | 800x600 |
| ~651 | `stay-4.webp` | Lion Rock Eco Lodge, Sigiriya | 800x600 |
| ~661 | `stay-5.webp` | Kandyan Cooking Class | 800x600 |
| ~671 | `stay-6.webp` | Palm Shore Cabanas, Tangalle | 800x600 |
| ~681 | `stay-7.webp` | Beginner Surf Lesson, Arugam Bay | 800x600 |
| ~691 | `stay-8.webp` | Planter's Bungalow, Nuwara Eliya | 800x600 |

These names, prices and ratings are **made up**. For each card, edit:
- the category badge (`Hotel`, `Guesthouse` or `Experience`)
- the name (`<h3>`) and location (`<p class="location">`)
- the price (`<strong>USD 140</strong>`) and rating (both the visible number **and** `aria-label="Rated 4.9 out of 5"`)
- the pop-up text: the `data-title` and `data-body` attributes on the "View details" button

If you use real businesses, ask their permission to show their name and photos.

---

## 8. Transport (line ~719)

| File | Photo to use | Size |
| --- | --- | --- |
| `transport.webp` | Train through tea country, or a tuk-tuk on a coastal road | 1200x900 |

---

## 9. Video testimonials (lines ~770-795)

| Line | Video file | Cover image | Caption to edit |
| --- | --- | --- | --- |
| ~777 | `testimonial-1.mp4` | `testimonial-1-poster.webp` | Emma, United Kingdom: The hill country by train |
| ~784 | `testimonial-2.mp4` | `testimonial-2-poster.webp` | Lukas and Mia, Germany: Leopards, elephants and whales |
| ~791 | `testimonial-3.mp4` | `testimonial-3-poster.webp` | Priya, Australia: The warmest welcome in Asia |

- Videos go in `public/assets/videos/`, cover images in `public/assets/images/`.
- **Vertical video (phone-style, 9:16 or 3:4) fits best.** Keep each one 20-60 seconds and under 15 MB.
- Unlike the hero, these videos **keep their sound** and show play controls, so visitors choose when to play them.
- Edit the person's name and caption in the `<figcaption>` under each video.
- Ideas if you are filming for your project: ask friends, family or tourists you meet (with written permission) "What surprised you most about Sri Lanka?" and "Why should someone visit?"

**Optional: add subtitles** (good for accessibility and marks). Create a file such as `testimonial-1.vtt`:
```
WEBVTT

00:00.000 --> 00:04.000
The train ride to Ella was the highlight of my trip.
```
Then, in `public/js/main.js`, find the `loadMedia` function and add these lines after `video.src = el.dataset.video;`:
```js
var track = document.createElement('track');
track.kind = 'captions'; track.srclang = 'en'; track.label = 'English';
track.src = el.dataset.video.replace('.mp4', '.vtt');
video.appendChild(track);
```

---

## 10. Traveller photos (lines ~800-825)

| Line | File | Who | Size |
| --- | --- | --- | --- |
| ~804 | `traveller-1.webp` | Sarah M., Canada | 200x200, square |
| ~812 | `traveller-2.webp` | Daniel K., Netherlands | 200x200, square |
| ~820 | `traveller-3.webp` | Aiko T., Japan | 200x200, square |

These are shown as circles, so crop them square with the face in the centre. Edit the name, country and the quote (`<blockquote>`) to match real reviews. Only use real people's photos and words **with their permission**.

**Stats row (line ~828):** `10,000+`, `500+` and `4.8/5` are placeholders. If you change a number, update both the visible text and `data-count` (used for the counting animation):
```html
<strong data-count="250" data-suffix="+">250+</strong>
```

---

## 11. About section (line ~868)

| File | Photo to use | Size |
| --- | --- | --- |
| `about.webp` | You or your team, local partners, or a meaningful Sri Lankan scene | 1200x900 |

Edit the two paragraphs next to it to describe your project.

---

## 12. Final banner (line ~883)

| File | Photo to use | Size |
| --- | --- | --- |
| `final-cta.webp` | Sunset beach or tea hills, preferably a calm, wide photo | 1920x900 |

The headline sits in the middle, over a dark overlay, so a photo with a simple centre works best.

---

## 13. Share image and other details

| What | Where | Edit |
| --- | --- | --- |
| Social share image | line ~18, `og:image` | Save `og-share.webp` (1200x630) in `images/` |
| Website address | line ~11, `canonical`, and inside the JSON-LD block | Replace `holidayinlanka.example` with your real domain |
| Phone and email | footer (~line 920) and JSON-LD (~line 40) | Your real contact details |
| Social media links | footer, `href="#"` | Your Instagram, Facebook and YouTube URLs |

Tip: search `index.html` for `TODO` (`Ctrl + F`) to jump to every spot that still needs editing.

---

## Preparing files

### Images: convert to WebP
WebP files are 25-35% smaller than JPG, which makes the site faster and scores better in Lighthouse.
1. Go to **https://squoosh.app**.
2. Drag in your photo.
3. On the right, choose **WebP** and set quality to about **75**.
4. Under "Resize", set the width from the tables above.
5. Download, rename the file to the name in the table, and save it in `public/assets/images/`.

Free photo sources: Unsplash, Pexels and Pixabay (search "Sri Lanka"). Note each photographer's name and credit them in your report.

### Videos: compress and remove the sound (hero)
**HandBrake** (free, https://handbrake.fr):
1. Open your video.
2. Choose the preset **Web > Creator 1080p60** (or "Fast 1080p30").
3. **Audio** tab: remove all audio tracks (hero video only).
4. Video tab: set Quality (RF) to about 26-28.
5. Tick **"Web Optimized"** on the Summary tab.
6. Save as `hero.mp4`.

**ffmpeg** (command line):
```bash
# Hero: no sound, compressed, web-optimised
ffmpeg -i my-reel.mp4 -an -c:v libx264 -crf 28 -preset slow -vf "scale=1920:-2" -movflags +faststart hero.mp4

# Grab a poster frame at 1 second
ffmpeg -i hero.mp4 -ss 00:00:01 -vframes 1 hero-poster.jpg

# Testimonial: keep the sound, vertical 720px wide
ffmpeg -i interview.mp4 -c:v libx264 -crf 26 -vf "scale=720:-2" -c:a aac -b:a 96k -movflags +faststart testimonial-1.mp4
```
Then convert `hero-poster.jpg` to WebP with Squoosh.

Free video sources: Pexels Videos, Pixabay Videos and Coverr.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| The placeholder label is still showing | Check the file name and folder exactly (lowercase, `.webp` and not `.webp.jpg`). Windows may hide extensions: in File Explorer, tick **View > File name extensions**. |
| Nothing changes after adding a file | Hard refresh with `Ctrl + Shift + R`, and make sure `npm run dev` is running. |
| The hero video does not play | It must be `.mp4` (H.264). Phones block autoplay if the video has sound, so remove the audio. Check the "reduce motion" setting on your device: if it is on, the video starts paused (by design). |
| The page is slow | The image files are too large. Resize them to the sizes above and use WebP. |
| The photo is cropped badly | Images fill their box (`object-fit: cover`). Crop your photo to the suggested shape before uploading, with the subject in the centre. |
