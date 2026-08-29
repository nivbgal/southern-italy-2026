# Southern Italy 2026 — Design System

## Product job

Southern Italy 2026 is a private-feeling but publicly hosted travel companion for two people moving between Naples, Polignano a Mare, Lecce, Matera, and Naples again. Its primary job is to answer, in a few seconds on a phone, “what are we doing next, when do we leave, how do we get there, and what will it cost?” Its secondary job is to make the trip feel celebratory and editorial rather than administrative.

The critical state is a full day with weather, sunrise and sunset, driving, traffic, parking, cash, bookings, meals, fallback choices, and a long timed itinerary. Practical information must remain legible in glare, usable with one hand, and available offline. The experience is read-mostly; checklists, spending, favorites, and booking states are device-local enhancements.

## Reference decision

Catalog searches:

- `mobile travel itinerary couple warm editorial timeline map budget bookings Mediterranean practical navigation`
- `travel planning app day itinerary schedule timeline map mobile utility dense tabs`
- `monochrome travel gazette warm parchment mobile itinerary`

### Anchor — Kobu

- Refero: <https://styles.refero.design/style/355d4b38-1a53-4544-911e-0f5073ab836b>
- Role: overall travel-gazette grammar.
- Borrow: parchment canvas, printed-label metadata, hairline structure, image-led editorial pacing, flat surfaces, restrained elevation.
- Reject: the absence of strong actions, zero-radius controls, sparse portfolio density, and photography as the only source of color. An active itinerary needs obvious navigation, state, and touch affordances.

### Functional and color donor — Going™

- Refero: <https://styles.refero.design/style/3461e90e-35d2-4269-9f11-cbe935f0a3a2>
- Role: mobile travel utility, action hierarchy, and chromatic system.
- Borrow: deep lagoon text, warm parchment canvas, electric iris primary action, mint information bands, generous touch controls, compact status pills.
- Reject: large marketing headlines, repeated conversion CTAs, testimonial/product-card language, and universal 24px cards.

### Expressive layer decision

No Three UI or WebGL layer is used. It does not improve navigation, mapping, or schedule comprehension enough to justify its loading, thermal, accessibility, and fallback costs. A finite DOM/CSS birthday reveal is the sole expressive moment: it runs once, lasts under 1.4 seconds, does not block controls, and becomes static when reduced motion is requested.

### Selection score

| Criterion | Kobu | Going™ |
|---|---:|---:|
| Product fit | 5 | 5 |
| Density fit | 3 | 4 |
| Audience fit | 5 | 5 |
| Content fit | 5 | 4 |
| Distinctiveness | 5 | 4 |
| Adaptability | 4 | 5 |
| **Total / 30** | **27** | **27** |

Kobu is the anchor because its content is actually travel editorial. Going™ is subordinate and fills the action, mobile, and state gaps.

## North star

**A sun-warmed road book with the decisiveness of a station departure board.**

The parchment and serif display voice make the trip feel collected and memorable. Deep lagoon ink, tabular time, strict rules, and a single iris action make it immediately useful. Mint is a calm field for context—not a decoration sprayed across every card.

## Color system

| Token | Value | Role |
|---|---|---|
| `--paper` | `#fffef0` | Main canvas; never clinical white |
| `--paper-strong` | `#fffdf7` | Raised reading surfaces |
| `--paper-muted` | `#f5f1de` | Quiet inset rows and inactive controls |
| `--lagoon` | `#004449` | Primary text, icons, filled dark surfaces |
| `--lagoon-soft` | `#2f676a` | Secondary text |
| `--lagoon-faint` | `#6d8582` | Tertiary metadata; never essential body copy |
| `--iris` | `#483cff` | One primary action or selected state per context |
| `--iris-dark` | `#3528db` | Iris hover/pressed state |
| `--mint` | `#d7ffc2` | Weather, context, and positive planning bands |
| `--mint-soft` | `#eaffdf` | Quiet contextual surface |
| `--ink-rule` | `rgba(0, 68, 73, 0.22)` | Structural hairlines |
| `--ink-rule-strong` | `rgba(0, 68, 73, 0.52)` | Emphasized boundary |
| `--success` | `#166347` | Confirmed/success state only |
| `--warning` | `#835400` | Caution, traffic, deadline |
| `--danger` | `#a23832` | Error/cancellation risk |

Rules:

- Deep lagoon replaces black for running type.
- Electric iris means “act” or “selected,” not general decoration.
- Mint classifies calm contextual information; it must not impersonate success.
- Status never relies on color alone; pair color with an icon and label.
- Photographs may provide warm Mediterranean color, but text must sit on an opaque or high-contrast surface rather than a gradient overlay.

## Typography

No remote font request is permitted. Use platform fonts with a travel-editorial character:

- Display: `Iowan Old Style`, `Palatino Linotype`, `Book Antiqua`, `Georgia`, serif.
- Interface/body: `Avenir Next`, `Avenir`, `Segoe UI`, `Helvetica Neue`, Arial, sans-serif.
- Metadata/time: `SFMono-Regular`, `Cascadia Mono`, `Roboto Mono`, Consolas, monospace.

| Role | Size | Line height | Weight | Tracking |
|---|---:|---:|---:|---:|
| Hero display | `clamp(2.7rem, 8vw, 6.4rem)` | `0.93` | 500 | `-0.045em` |
| Page title | `clamp(2.1rem, 5vw, 4.5rem)` | `0.98` | 500 | `-0.035em` |
| Section title | `clamp(1.55rem, 3vw, 2.35rem)` | `1.08` | 500 | `-0.025em` |
| Card title | `1.05–1.3rem` | `1.2` | 650 | `-0.012em` |
| Body | `1rem` | `1.55` | 450 | normal |
| Small body | `0.875rem` | `1.45` | 500 | normal |
| Label/eyebrow | `0.7–0.75rem` | `1.25` | 700 | `0.12–0.16em` |
| Time/price | `0.75–0.9rem` | `1.25` | 650 | `0.02–0.08em` |

Use tabular numerals for times, durations, prices, and budget values. Display serif is for destinations, dates, and narrative emphasis—not buttons, dense metadata, or form controls.

## Spacing and layout

- Base unit: 4px.
- Common gaps: 8, 12, 16, 24, 32, 48, 64, 88px.
- Maximum reading shell: 1240px.
- Narrow narrative measure: 680px / about 68 characters.
- Desktop section rhythm: 64–88px.
- Mobile section rhythm: 36–56px.
- Page gutters: `clamp(16px, 4vw, 48px)`.

The desktop layout may split itinerary and utility context 7:5. Mobile always returns to one linear decision order: day title → immediate status → next action → timeline → supporting context.

## Shape, border, and elevation

- Hairline: 1px lagoon at 14–22% opacity.
- Strong divider: 1px lagoon at 45–55% opacity.
- Structural cards: 20–24px radius only when the surface groups related behavior.
- Compact controls and insets: 10–14px radius.
- Buttons and state chips: full pill.
- Photographs: 18–24px radius when contained; zero radius when full-bleed.
- Elevation: one paper-lift shadow, maximum `0 18px 50px rgba(0, 68, 73, 0.10)`.

Timeline rows, venue lists, and booking rows should usually use rules and whitespace instead of separate floating cards. Avoid universal card grids.

## Action hierarchy

- Primary: electric iris filled pill, one per decision context.
- Secondary: parchment fill with lagoon border.
- Tertiary: text/ghost action with an underline or directional arrow.
- Destructive: danger-colored border/text; require explicit confirmation.
- Disabled: lower contrast and no shadow/transform; preserve readable label.

Every interactive target is at least 44×44px. Hover is supplementary; focus, active, disabled, loading, error, and success states must work without it.

## Core components

### Shell and navigation

- Sticky opaque parchment header with hairline bottom rule.
- Brand uses a small mono journey label plus serif title.
- Desktop top navigation is horizontal; mobile uses a fixed bottom navigation with safe-area padding.
- Date strip scrolls horizontally and never wraps. The selected date uses iris; “today” may add a small ring but not a second competing fill.

### Day and timeline

- Day header combines a serif date/title with compact weather, cash, car, and daylight facts.
- Timeline time is a mono column; events align to one lagoon line with small category nodes.
- Timeline detail expands beneath the title. It does not open a modal for ordinary information.
- Current/next item may use mint; selected or actionable item may use an iris rule. Do not fill every timeline item.

### Context cards

- Weather: mint field, large temperature, explicit `Forecast`/`Typical`/`Cached` label.
- Cash: paper surface with large tabular recommended amount and a short reason.
- Drive: pale warning-tinted rule/field, departure and traffic first, duration second.
- Venue: image or numbered mark, name/rating/reviews, then maps/reservation actions.
- Booking: table-like rows with state icon, deadline, party price, and action.
- Budget: one main total, segmented but accessible progress meter, then category rows.
- Map: map and place list are peers; map failure never hides addresses or Google Maps actions.

### Birthday state

- Electric iris may temporarily occupy a larger field because the birthday is a deliberate brand moment.
- Confetti is sparse mint/paper/iris geometry, rendered with DOM elements, `pointer-events: none`, and one finite animation.
- The itinerary remains visible immediately; motion must not gate content or change layout.

## Responsive behavior

### ≥ 1040px

- 1240px shell.
- Header brand, navigation, and trip status on one row.
- Two-column hero/day layouts where supporting data benefits from proximity.
- Timeline time column 96–112px.
- Map uses approximately 3:2 split.

### 720–1039px

- Header becomes two rows; navigation remains horizontally scrollable.
- Two-column utility grids may remain if each column retains 280px.
- Map stacks above list.

### < 720px

- One column.
- Fixed bottom navigation appears; body receives safe-area bottom padding.
- Date strip touches page edges with internal gutter padding.
- Timeline becomes a 72px time column plus content.
- Secondary button pairs stack if labels would wrap.
- Table-like rows become labeled blocks.
- Non-critical editorial imagery moves below immediate day status.

### < 390px

- Page gutter 14–16px.
- Hero display reduces but never below 2.45rem.
- Timeline time column reduces to 60px.
- Chips keep 44px height and scroll rather than compress.

## States and accessibility

- `:focus-visible` uses a 3px iris ring with a 3px offset.
- Skip link appears on focus.
- Loading uses a quiet opacity pulse; no continuously sweeping page-wide shimmer.
- Error and offline states keep the planned itinerary visible and explain only the unavailable enhancement.
- Empty states state what is missing and offer the next valid action.
- External links indicate they open another service when context is not obvious.
- Use semantic headings, lists, time elements, meters/progress, and buttons.
- Icon-only controls need accessible names.
- Minimum body contrast is lagoon/lagoon-soft on parchment; tertiary text is not used below 14px for essential information.
- Support `prefers-reduced-motion`, `prefers-reduced-transparency`, forced colors, zoom to 200%, and keyboard-only use.

## Motion

- Default control transitions: 140–180ms, ease-out, limited to color, border, opacity, and small transforms.
- Navigation selection: no more than a 1px–2px translate.
- Birthday reveal: one 700ms panel reveal plus one 1100–1350ms confetti fall; no repeat.
- Loading pulse may repeat only while data is genuinely pending.
- Reduced motion removes transforms and animations, not information or emphasis.

## Imagery

- Use licensed or original Southern Italy photography.
- Prefer tactile details—stone, water, food, streets, hands—over generic aerial collages.
- One strong image per major destination is enough.
- Use intrinsic dimensions, responsive sources, lazy loading below the fold, and an opaque fallback color.
- Do not hotlink Google or accommodation imagery.

## Explicit do / do not

Do:

- Make the next time-sensitive decision visible before atmospheric copy.
- Use deep lagoon for nearly all text and electric iris sparingly.
- Let type, rules, and whitespace establish hierarchy.
- Keep prices, traffic, and forecast provenance visible.
- Preserve the complete text experience when maps, weather, or motion fail.

Do not:

- Add gradients, glass panels, excessive shadows, or decorative blobs.
- Put every fact in a pill or every section in a card.
- Use mint as a generic success color or iris as decoration.
- Animate the route, map, or background continuously.
- hide public-repository content and call it private.
- shrink controls below 44px to save space.

## CSS class contract

The durable stylesheet exposes:

- Shell: `.app-shell`, `.site-header`, `.brand`, `.top-nav`, `.page-shell`, `.page-section`, `.bottom-nav`.
- Editorial: `.eyebrow`, `.display-title`, `.section-title`, `.lede`, `.hero-panel`, `.hero-copy`, `.hero-aside`.
- Navigation: `.date-strip`, `.date-chip`, `.tab-list`, `.tab`.
- Itinerary: `.route-grid`, `.day-card`, `.day-header`, `.day-meta`, `.timeline`, `.timeline-item`, `.timeline-time`, `.timeline-body`, `.timeline-title`, `.timeline-detail`.
- Utility: `.weather-card`, `.cash-card`, `.drive-card`, `.venue-card`, `.booking-card`, `.budget-card`, `.budget-meter`, `.map-shell`, `.map-panel`, `.map-list`.
- Actions/states: `.button`, `.badge`, `.offline-banner`, `.state-panel`, `.skeleton`, `.toast`, `.skip-link`, `.sr-only`.
- Birthday: `.birthday-card`, `.birthday-confetti`, `.confetti-piece`, `.is-celebrating`.

## Refero scorecard gate

The final rendered interface must be scored after desktop and mobile screenshots exist. Target:

| Area | Target | Evidence required |
|---|---:|---|
| Product clarity/action hierarchy | 18/20 | next event and primary action visible without scrolling |
| Information hierarchy | 14/15 | time, transport, price, and booking scan in that order |
| Typography | 13/15 | disciplined serif/sans/mono roles at mobile and desktop |
| Spacing/layout | 13/15 | intentional grouping at 390px and 1440px |
| Components/states | 14/15 | loading, offline, error, selected, disabled, birthday |
| Distinctive/original system | 9/10 | identifiable lagoon/paper road-book language without cloning |
| Accessibility/responsive | 9/10 | focus, 44px targets, reduced motion, no 320px overflow |
| **Target** | **90/100** | minimum passing score remains 80/100 |

Any serious accessibility or task-completion failure blocks acceptance regardless of numeric score.

### Rendered review — 29 August 2026

Reviewed at 1280px desktop and 390px mobile on the overview and birthday-day states, plus automated 1440px desktop, 768px tablet, and 320px overflow/accessibility checks.

| Area | Score | Evidence |
|---|---:|---|
| Product clarity/action hierarchy | 19/20 | route, first-day action, day selector, budget state, and birthday action read in order |
| Information hierarchy | 14/15 | dates, status, title, base, and cash scan consistently; dense birthday details remain long by design |
| Typography | 14/15 | serif destination voice, sans reading copy, and mono operational data stay distinct at both sizes |
| Spacing/layout | 14/15 | desktop editorial pacing compresses into a clean one-column mobile road book without 320px overflow |
| Components/states | 14/15 | itinerary, venue, weather, drive, cash, budget, booking, map fallback, offline, and birthday states share one grammar |
| Distinctive/original system | 9/10 | lagoon-on-parchment road-book language is recognizable without reproducing either donor composition |
| Accessibility/responsive | 10/10 | 44px controls, visible focus, reduced motion/transparency, forced colors, and zero serious/critical axe findings |
| **Total** | **94/100** | passes the 80/100 Refero gate |

Intentional deviations from the references: stronger operational density than Kobu, fewer marketing pills than Going™, more visible status color, and a finite birthday field as the only large iris moment.
