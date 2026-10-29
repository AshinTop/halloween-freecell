# Embedding Haunted FreeCell

The live Cloudflare entry point is https://halloween-freecell.crazy3d.org/. For another host, serve the repository root as a static HTTP(S) directory. It includes all artwork, audio synthesis and game logic, with no CDN, server, login or third-party game iframe.

## Automatic viewport layout

Compact layout activates inside an iframe, in a top-level viewport no taller than 700 px, or with `?embed=1`. It fills the actual game viewport and recalculates on resize and device rotation. The large manor introduction and footer make room for the eight columns, four free cells, four foundations, game modes, records and controls.

The free-cell and foundation row stays above the columns; undo, hint and new deal stay below them. Card height and the exposed part of each stacked card are calculated from the available space. Rank and suit appear together on the visible top line. Exposed height is measured against the visible rank-and-suit line and never falls below 18 px, so longer columns use a **local vertical scroll area within the tableau** instead of clipping cards or shrinking the whole page. All cards remain reachable; they need not be visible simultaneously. Hints scroll their selected source card into view. When the scroll notice appears, use its up/down arrows, the mouse wheel, or a touch swipe in a column gap or over a non-movable card. Movable cards reserve their touch gesture for dragging; a dragged stack also scrolls automatically near the tableau’s top or bottom edge.

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
    src="https://halloween-freecell.crazy3d.org/"
    title="Haunted FreeCell"
    style="position:absolute;inset:0;width:100%;height:100%;border:0"
    scrolling="no"
    allow="fullscreen; clipboard-write; web-share"
    allowfullscreen
  ></iframe>
</div>
```

The integration owner verified a 654 px desktop game area, a mobile `100dvh` game area and a separate 50 px host toolbar. If the toolbar is in the same screen, the host should allocate the remaining height to the game with flex layout or `calc(100dvh - 50px)`, also subtracting any other visible host navigation. The child game cannot change parent page height. In fullscreen, a `100dvh` game area is appropriate when host controls are hidden or overlaid.

## Automatic endgame collection

After a successful user move, a copied position is checked for a complete foundation-only route. Collection starts only when that simulated route reaches all four Kings. A partial route never causes ordinary cards to be moved automatically. The initial authored endgames still require the player to free the blocking cards.

The **Finish automatically / Stop** row appears only when a complete finish is possible or collection is running. Playback moves one card at a time at approximately 130 ms per card and no more than four seconds overall. Reduced-motion mode omits the flying card animation. The table is inert while collecting; Undo, Stop and restart remain available. Every card increments the move count through the normal move engine.

One Undo restores the pre-collection checkpoint, without automatically resuming it. Stop leaves the cards already collected in place; the player can use Finish automatically to resume or Undo to restore the batch. Restart, mode changes, language/help changes, resizing, page hiding, window blur and pagehide cancel playback. Each queued callback checks the run identity and expected state, preventing a stale callback from altering a replacement deal. A saved finishable position shows the Finish automatically button on load.

## Controls, validation and limits

Drag a card or legal ordered run onto a glowing destination, or tap the card and then its destination. Mouse, pen and touch use Pointer Events with a small movement threshold. The lifted stack follows the pointer, and drops go through the same rules and capacity checks as click-to-place. Releasing outside a legal target, cancelling the pointer, changing the deal/language, resizing, hiding the page, or pressing Esc cancels the gesture without moving cards. A completed drag suppresses its compatibility click, so one gesture cannot also perform a second tap action. A double-click or quick double-tap on an exposed single card attempts its foundation. The quick action tracks the card's identity across visual updates, so replacing rendered elements does not cancel the gesture. Illegal moves never change the game. Keyboard shortcuts are U for undo, H for a legal hint and Esc to clear selection.

The release owner verified a complete 12-move rescue of puzzle 1 using real click interactions, and separately verified the quick-foundation gesture after moving its blocking king into a free cell. Implementation viewport targets are 1152 × 654, 960 × 600, 390 × 650, 390 × 844 and 844 × 390 CSS pixels. Real-browser checks passed at 1160 × 654, 390 × 794 and 390 × 650 without document overflow. At 844 × 340, the tableau used a 103 px viewport for 192 px of content; the release owner scrolled to a bottom card and moved it into a free cell while fixed controls stayed visible. This intentionally supports local scrolling, not simultaneous visibility of all 52 cards.

Eight columns necessarily use small cards in narrow portrait windows. The rank-and-suit corner and local scrolling preserve access; host fullscreen or landscape provides more room. Extremely small frames, browser zoom and enlarged system text may require fullscreen. The local scroll region is keyboard focusable as well as touch-scrollable. Dragging and tap-to-place are both supported. The new drag regression checks include complete puzzle solutions, rejected destinations, capacity limits, stale releases after cancellation, and multiple-pointer isolation; browser and physical-device checks remain separate. Not every browser and viewport combination has been tested.

`?puzzle=1` through `?puzzle=3` selects a rescue endgame; `?deal=12345` selects a reproducible classic deal. For a top-level compact test, use `?embed=1&puzzle=1`. Puzzle solutions are verified by engine tests; hints suggest a legal move without promising a winning continuation. Local saves belong to the game origin/browser and can be unavailable under restrictive iframe storage policy. Clipboard and native share depend on browser support and permission, with visible result text as the fallback.
