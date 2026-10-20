# Reference bar: hawaiilife.com + mercury.com (captured Oct 20, 2026, 9:16 AM HST)
Screenshots: shots/ref-hawaiilife-{desktop,mobile}.png, shots/ref-mercury-{desktop,mobile}.png. Values measured with getComputedStyle at 1440×900.

| # | Mechanism | Hawaii Life | Mercury | Our target (checkable) |
|---|---|---|---|---|
| 1 | Headline-to-body size ratio | H1 60px / body 15px = **4.0** | H1 49px / body 16px = **3.1** | H1 ≥ 64px / body 17px (≥ 3.7) on desktop; ≥ 40px on 390px mobile |
| 2 | One accent color, used sparingly above the fold | Cyan only on "Buy" + search button | Indigo only on "Open account" (×2) | Gold on ≤ 3 things above the fold: primary CTA, one italic headline word, eyebrow. Everything else white/navy |
| 3 | Photo-led, full-bleed hero with readable scrim | Edge-to-edge coastal aerial, ~64% of viewport | Full-viewport landscape, soft dark fade behind text | Full-bleed Diamond Head photo ≥ 90% of viewport height; gradient scrim keeps text contrast ≥ 4.5:1 |
| 4 | Restraint above the fold (few elements, lots of air) | Logo, 5 nav items, H1, 3 tabs, 1 input, phone | Logo, 5 nav items, H1, 2-line sub, 1 input + 2 buttons | ≤ 6 nav items; H1 ≤ 3 lines; sub ≤ 2 lines; 1 primary + 1 secondary CTA; text column ≤ 620px wide |
| 5 | Direct contact visible without scrolling | "Call or text … 800-370-3848" in the hero | n/a (signup) | Phone in the nav pill and under the CTAs; sticky Call/Text/Book bar on mobile |
| 6 | Pill shapes + compliance line in the hero | Square inputs (older) | 32px pill buttons; FDIC disclaimer pill at the hero's bottom edge | 999px pill buttons and nav; licensing line (NMLS/DRE) visible in the hero |
| 7 | Motion timing | Hovers 0.2s (197 elements) | Hovers 0.3s (110), some 0.15s | Hovers 0.25–0.35s; scroll reveals ≤ 0.9s; only the hero image moves slowly (18s); prefers-reduced-motion respected |

## Refero
I tried to pull references from Refero (refero_search_styles) on Oct 20, 9:17 AM HST. It returned `NO_SUBSCRIPTION` ("subscription is not active or has expired"), so this bar uses no Refero references.

## Self-check of shots/home-*.png against the bar
1. H1 is 72px (clamp) over a 17–19px sub, ratio ≈ 3.8–4.2. Mobile H1 is 40px. ✔
2. Gold appears above the fold only on the eyebrow, the italic phrase and the primary pill CTA (plus the nav phone pill on desktop). ✔/borderline. The Loan Factory widget brings its own orange/blue, which can't be changed without editing the widget.
3. Full-bleed Diamond Head sunset photo with a left-weighted scrim on desktop. On mobile it's a 390px photo band that fades to ink. ✔
4. 8 nav links (the bar says ≤ 6) is a miss. All other limits are met: H1 is 3 lines, 1 primary + 1 secondary CTA, the text column is 620px. ✗ on nav count.
5. The phone number is in the nav pill and the hero line, and mobile has the sticky Call/Text/Book bar. ✔
6. Pills are used throughout, and the NMLS/DRE line sits in the hero. ✔
7. Hovers run .25–.35s, reveals .9s, the hero Ken Burns effect 18s, and prefers-reduced-motion is respected. ✔
