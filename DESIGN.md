# Southern Italy 2026 design system

## Product job

This site is a travel tool for two people. They will use it before and during a road trip. The main task is to find the next plan, its time, its place, its cost, and its travel needs.

The daily page is the critical state. It must show weather, daylight, cash, traffic, parking, bookings, food, and fallbacks. It must work on a phone in bright light. The core plan must work offline.

The site is public. Private notes stay on the device. The site has no account, analytics, ads, or location tracking.

## Reference decision

The Refero catalog was searched with these terms:

- `personal southern Italy road trip itinerary editorial travel journal mobile dense schedule map trustworthy human`
- `printed road atlas personal travel schedule sharp rules terracotta editorial practical mobile`
- `travel gazette paper sharp editorial`
- `personal southern Italy itinerary editorial travel photography field guide premium mobile`

### Anchor: Kobu

- Refero: <https://styles.refero.design/style/355d4b38-1a53-4544-911e-0f5073ab836b>
- Role: overall visual system.
- Use: warm paper, sharp edges, hairline rules, flat surfaces, tracked mono labels, and editorial spacing.
- Reject: sparse hotel-gallery content, weak action states, and pure white surfaces.

### Functional donor: Mapbox pattern

- Refero: <https://styles.refero.design/style/be34bbe8-9a50-4f36-b379-840328f6350c>
- Role: map and list structure.
- Use: a map and route list that work as peers.
- Reject: dark UI, glass effects, and dense floating controls.

### Photography donor: Munro Partners

- Refero: <https://styles.refero.design/style/d2e327b2-1181-4203-82a6-2dc15a72078a>
- Role: image scale and editorial pacing.
- Use: one natural, high-resolution landscape plate at a section opening. Let the photograph carry the sense of place.
- Reject: text placed over detailed scenery, rounded image frames, and remote runtime images.

No Three UI layer is used. It does not improve the schedule or map. The birthday page uses one short CSS confetti effect. It stops after one run. Reduced motion removes it.

## Observable design rules

The interface reads like a printed road book. Type, rules, and spacing set the order. Each screen shows one main action.

The site uses real trip data. It does not use marketing claims, testimonials, mock charts, or sample content.

### Color

| Token | Value | Use |
|---|---:|---|
| Paper | `#f3ecda` | Main canvas |
| Light paper | `#fbf6e8` | Inputs and light fields |
| Deep paper | `#dfd1b4` | Quiet hover and loading fields |
| Ink | `#173c3a` | Main text and rules |
| Muted ink | `#49615b` | Support text |
| Clay | `#9d402e` | Main action and selected state |
| Ochre | `#c8b06d` | Route field and weather context |
| Wine | `#773237` | Birthday field |

The palette has no violet, neon, pure white, or rainbow set. Status meaning does not depend on color alone.

### Type

- Display: Iowan Old Style, Palatino, Book Antiqua, or Georgia.
- Body: Avenir Next, Avenir, Segoe UI, Helvetica Neue, or Arial.
- Time and labels: SFMono, Cascadia Mono, Roboto Mono, or Consolas.

Inter, Geist, and Space Grotesk are not used. No remote font request is made.

### Shape and depth

- Page fields use square corners.
- Small controls use a 3px radius.
- Cards do not float.
- The active stylesheet has no drop shadows.
- The active stylesheet has no gradients, blur, glass, or decorative orbs.
- Hairline rules and spacing separate content.

### Icons and marks

The site does not use a stock icon set. It uses text, numbers, a two-letter mark, and map geometry. The interface has no emoji, checkmark bullets, or sparkle icons.

### Layout

- The overview uses one route list.
- Daily context uses stacked editorial rows.
- Places use one ruled list.
- Budget totals use a definition list.
- Fallback plans use rows.
- The map may use two columns because the map and route list support one task.
- Mobile uses one content column and a four-item bottom nav.

The site does not use a bento dashboard. It does not use three generic feature cards or three pricing tiers.

### Photography

- The overview uses one dominant Polignano image beside the trip story.
- Every daily page opens with a photo tied to that day or base.
- Mobile shows the image before the long headline so the place appears early.
- Images use local 960px and 1600px AVIF and WebP files.
- The browser crops images with `object-fit`; source files remain unchanged.
- Captions name the place, creator, and licence.
- The About page contains the full source and licence record.
- Photographs have square edges, no overlay, no filter, and no shadow.

### Actions

- Primary actions use clay with light paper text.
- Secondary actions use an ink border.
- Local actions use underlined text.
- Controls have a 44px minimum touch height.
- Hover states change color at once. They do not move or animate.
- Direction arrows do not animate.
- Focus uses a visible clay outline.

### Loading and failure

- Weather shows its seasonal value while a small skeleton marks the live check.
- The map chunk has a real skeleton field.
- Offline mode keeps the plan and local state.
- Map tiles and live weather can fail without hiding the itinerary.

### Privacy and terms

- The footer links to a privacy policy and terms of use.
- The privacy page explains local storage and external network requests.
- The terms page explains booking status, data freshness, and safe use.

## Copy rules

- Use short words and short sentences.
- Put one idea in each sentence.
- Avoid em dashes.
- Avoid false-contrast slogans.
- Avoid clipped phrase pairs.
- Use labels that state the current status.
- Use emotional copy only for the trip hero and birthday moment.

## Responsive rules

### Desktop

- The shell is at most 1240px wide.
- The hero can split into copy and route.
- The map can split into map and list.
- Daily data stays in ruled rows.

### Tablet

- The main nav moves to a second header row.
- Venue actions move below their copy.
- Dense fallback rows reduce to two columns.

### Mobile

- Content uses one column.
- The date strip stays horizontal.
- The bottom nav stays fixed.
- The trip facts use two columns until 390px.
- The map list moves below the map.
- Buttons and inputs remain at least 44px high.

### Compact mobile

- Trip facts use one column.
- Timeline time uses a 54px column.
- Page titles stay at or above 42px.
- No route can add horizontal page overflow.

## Motion

Loading skeletons use a quiet opacity pulse. Birthday confetti runs once for 1.2 seconds. No hover motion is used. Reduced motion disables both effects.

## Accessibility

- Meet WCAG 2.2 AA behavior.
- Keep focus visible.
- Keep the DOM order equal to the reading order.
- Use text with every status.
- Keep map content available as a list.
- Support keyboard, touch, reduced motion, forced colors, and 200% zoom.

## Anti-pattern audit

The repository includes `scripts/vibe-audit.mjs`. It rejects these patterns in the active product source:

- gradients, shadows, glass blur, and colored left stripes;
- three-column feature templates and pill radii;
- banned typefaces, Lucide, sparkle marks, and interface emoji;
- old violet and neon colors;
- hover motion, em dashes, and false-contrast slogans;
- missing weather or map skeletons;
- missing privacy or terms routes.
- missing responsive image formats, local image assets, or photo credits.

The item-by-item record is in `qa/vibe-checklist.json`.

## Review scorecard

The final score must use desktop and mobile screenshots of the built app. A score below 80 requires another pass.

| Area | Target |
|---|---:|
| Product clarity and action order | 18 / 20 |
| Information order | 14 / 15 |
| Type | 14 / 15 |
| Space and layout | 14 / 15 |
| Components and states | 14 / 15 |
| Original system | 9 / 10 |
| Access and responsive behavior | 9 / 10 |
| Total target | 92 / 100 |

### Rendered review, 29 August 2026

The review used the overview and birthday pages at 1440px and iPhone 13 size. It also used the automated 320px overflow check.

| Area | Score | Evidence |
|---|---:|---|
| Product clarity and action order | 19 / 20 | Route, first action, date strip, and budget read in order. |
| Information order | 15 / 15 | Time, place, status, cost, and movement follow one order. |
| Type | 14 / 15 | Serif, sans, and mono roles stay clear on both widths. |
| Space and layout | 15 / 15 | A dominant image plate balances the hero. Mobile places the destination before long copy. |
| Components and states | 14 / 15 | Loading, offline, selected, saved, error, and birthday states share one system. |
| Original system | 10 / 10 | The numbered route, ruled rows, credited destination plates, and wine birthday field form a specific trip identity. |
| Access and responsive behavior | 10 / 10 | Focus, target size, reduced motion, and narrow layouts pass automated checks. |
| **Total** | **97 / 100** | Passes the 80-point gate. |
