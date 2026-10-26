# CDS Cricket Landing Page — Video Reference Requirements

## Objective

Recreate the landing page visible on the laptop screen in the reference video as closely as possible. Use CDS Premier Cricket League branding and the existing website content throughout. The reference supplies the visual design and animation direction.

## Reference

- Video: `C:\Users\HP\Downloads\WhatsApp Video 2026-10-23 at 11.18.18 AM.mp4`
- Project: `D:\cricket\circket`
- Main page: `src/pages/Home.jsx`
- Styles: `src/pages/Home.css`
- Animated scene: `src/pages/ScrollCricketScene.jsx`
- Scroll/ball timeline: `src/pages/photorealMotion.js`
- Website sections: `src/pages/HomeContent.jsx`
- Existing website content: `src/pages/homeContentData.js`

## Required visual design

- Dark navy stadium with bright floodlights.
- Large white italic headings and lime-green buttons.
- Realistic human cricketer in cricket equipment; avoid cartoon or geometric characters.
- Preserve the existing CDS logo, Yamunanagar details, tournament information, daily slots, stadium photos, gallery, local highlights, registration links and footer.

## Required scroll sequence

1. Show a close-up cricket ball with a soft cream/golden smoke wake behind it.
2. Reveal the realistic batsman holding the bat with both hands.
3. Move the bat and body together through backlift, downswing and contact. A broad golden sweep follows the bat.
4. Start the outgoing ball flight only after the bat makes contact. Show an impact burst and SIX text.
5. Follow the ball on a curved path with flowing luminous trails.
6. Reveal the final CDS registration headline and continue into the website sections.

The hero remains pinned while this sequence progresses. Scrolling down advances the action; scrolling up reverses it. Motion should be smooth and continuous, without position jumps, detached bats or overlapping limbs.

## Ball smoke before the shot

- Smoke must originate immediately behind the ball.
- It stretches towards the lower-left and disperses behind the ball.
- Use thin translucent cream/champagne wisps, feathery edges, small eddies and fine dust.
- Keep a narrow brighter center near the ball and a loose fading tail.
- Give the vapor subtle continuous movement even when scrolling stops.
- Avoid a straight white line, thick opaque cloud, rope-like curls or flame effect.

## Priority correction: ball trail after the shot

The latest screenshot identifies the outgoing trajectory trails as the main remaining mismatch.

### Current issue

The outgoing ball has thin solid mint lines and a thin orange arc. These look like drawn trajectory guides rather than the flowing luminous effect in the video.

### Required result

- Keep the outgoing curved ball flight.
- Replace the thin mint lines with broad, soft, flowing mint/white light ribbons.
- Give each ribbon a bright inner core, translucent edges and visible glow.
- Let the ribbons gently twist and diverge behind the ball, then converge at the ball.
- Fade the trailing ends smoothly rather than ending them abruptly.
- Recreate the warm golden curved accent visible in the reference, with soft glow rather than a bare wire-like line.
- Tie trail growth and ball movement to the same scroll timeline.
- Preserve continuity from the actual contact point; the ball must not teleport to a separate flight origin.
- Check forward and reverse scrolling, slow wheel movement and larger scroll steps.

## Current implementation

- CDS content and branding have been restored in the cinematic layout.
- The cricketer uses 12 generated photographic poses in a transparent sprite atlas.
- The ball, impact effects, swing arc and outgoing trajectory are rendered with Three.js.
- The delivery smoke uses a transparent generated texture with shader-driven flow and dust.
- Scroll progress has easing to reduce abrupt changes.

## Known limitations

- The current human animation is a 12-pose recreation, not continuous original footage or the original rigged character.
- The outgoing flight still uses thin line/tube geometry and needs the flowing glow treatment described above.
- The original website/source assets are unavailable; only the recorded video was provided.
- An exact 100% match has not been achieved and should not be claimed.

## Relevant assets

- `public/image/crickt-photoreal-batting-atlas.png`
- `public/image/crickt-reference-smoke.png`
- `public/image/crickt-empty-stadium.png`
- Associated `.prompt.txt` files document generated image prompts.

## Validation

```powershell
npx eslint src/pages/Home.jsx src/pages/HomeContent.jsx src/pages/homeContentData.js src/pages/ScrollCricketScene.jsx src/pages/photorealMotion.js
node --test src/pages/__tests__/photorealMotion.test.js
npm run build
```

Also visually compare the delivery smoke, hand/bat movement, contact burst and outgoing flight with the reference. Passing tests alone does not establish a visual match.
