# Embedding Haunted FreeCell

Serve the repository root as a static HTTP(S) directory. It includes all artwork, audio synthesis and game logic, with no CDN, server, login or third-party game iframe.

## Automatic viewport layout

Compact layout activates inside an iframe, in a top-level viewport no taller than 700 px, or with `?embed=1`. It fills the actual game viewport and recalculates on resize and device rotation. The large manor introduction and footer make room for the eight columns, four free cells, four foundations, game modes, records and controls.

The free-cell and foundation row stays above the columns; undo, hint and new deal stay below them. Card height and the exposed part of each stacked card are calculated from the available space. Rank and suit appear together on the visible top line. Exposed height never falls below 18 px, so longer columns use a **local vertical scroll area within the tableau** instead of clipping cards or shrinking the whole page. All cards remain reachable; they need not be visible simultaneously. Hints scroll their selected source card into view. On touchscreens, swipe within the card columns when the scroll notice is shown.

At widths of at least 620 px and heights of at most 450 px, the header, reserved-card row and controls become shorter for landscape play. Help and result content may scroll internally when needed. The document has no whole-page scrolling in compact mode; `scrolling="no"` on the host iframe does not prevent the tableau's internal scrolling.

## Suggested host configuration

Use the existing host's metadata flags:

```js
{
  mobile: false,
  auto_mobile: false
}
```

These are recommendations for the host, not changes performed by this repository. FreeCell already handles portrait and landscape sizes; an extra portrait wrapper or automatic scaling layer would reduce usable card space.

Example for the host's desktop game area:

```html
<div style="position:relative;width:100%;height:654px;overflow:hidden">
  <iframe
    src="https://YOUR-GAME-HOST/index.html"
    title="Haunted FreeCell"
    style="position:absolute;inset:0;width:100%;height:100%;border:0"
    scrolling="no"
    allow="fullscreen; clipboard-write; web-share"
    allowfullscreen
  ></iframe>
</div>
```

The integration owner verified a 654 px desktop game area, a mobile `100dvh` game area and a separate 50 px host toolbar. If the toolbar is in the same screen, the host should allocate the remaining height to the game with flex layout or `calc(100dvh - 50px)`, also subtracting any other visible host navigation. The child game cannot change parent page height. In fullscreen, a `100dvh` game area is appropriate when host controls are hidden or overlaid.

## Controls, validation and limits

Tap a card or ordered run, then its destination. A double-click or quick double-tap on an exposed single card attempts its foundation. The quick action tracks the card's identity across visual updates, so replacing rendered elements does not cancel the gesture. Illegal moves never change the game. Keyboard shortcuts are U for undo, H for a legal hint and Esc to clear selection.

The release owner verified a complete 12-move rescue of puzzle 1 using real click interactions, and separately verified the quick-foundation gesture after moving its blocking king into a free cell. Implementation viewport targets are 1152 × 654, 960 × 600, 390 × 650, 390 × 844 and 844 × 390 CSS pixels. Real-browser checks passed at 1160 × 654, 390 × 794 and 390 × 650 without document overflow. At 844 × 340, the tableau used a 103 px viewport for 192 px of content; the release owner scrolled to a bottom card and moved it into a free cell while fixed controls stayed visible. This intentionally supports local scrolling, not simultaneous visibility of all 52 cards.

Eight columns necessarily use small cards in narrow portrait windows. The rank-and-suit corner and local scrolling preserve access; host fullscreen or landscape provides more room. Extremely small frames, browser zoom and enlarged system text may require fullscreen. The local scroll region is keyboard focusable as well as touch-scrollable. No drag gesture is required to move cards. Not every browser and viewport combination has been tested.

`?puzzle=1` through `?puzzle=3` selects a rescue endgame; `?deal=12345` selects a reproducible classic deal. For a top-level compact test, use `?embed=1&puzzle=1`. Puzzle solutions are verified by engine tests; hints suggest a legal move without promising a winning continuation. Local saves belong to the game origin/browser and can be unavailable under restrictive iframe storage policy. Clipboard and native share depend on browser support and permission, with visible result text as the fallback.
