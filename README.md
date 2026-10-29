# Haunted FreeCell — Halloween Solitaire & Lantern Rescue Puzzles

**Make room. Let the light in.** Haunted FreeCell turns a classic solitaire table into a moonlit manor, with readable Halloween character cards and four towers that illuminate as you complete the foundations. Play a full 52-card deal or solve one of three short Lantern Rescue endgames.

[**Play online**](https://halloween-freecell.crazy3d.org/) · [Watch the visual introduction](docs/media/intro.mp4) · [Rules and controls](#how-to-play-freecell) · [Embed the game](#embed-haunted-freecell)

**Live deployment:** Play on Cloudflare using the link above. The site is deployed from this GitHub repository. Hosting scripts and request logging may be added by Cloudflare independently of the game code.

[Video player and transcript](https://halloween-freecell.crazy3d.org/intro.html) · [Captioned MP4 file](docs/media/intro.mp4). The 24-second silent introduction uses actual game screenshots; it is not a live gameplay recording.

[![Haunted FreeCell gameplay with eight tableau columns, four free cells, four suit foundations, and original Halloween cards](docs/images/gameplay.jpg)](docs/media/intro.mp4)

Enjoy the manor or want to revisit the source? **[Star Haunted FreeCell on GitHub](https://github.com/AshinTop/halloween-freecell)**. If you report a problem, include the deal or puzzle number and the move you were attempting.

## A classic game with a small Halloween story

The core game remains FreeCell: use temporary space wisely, uncover useful cards, and send every suit from Ace to King. The seasonal layer adds original black-cat Jacks, witch Queens, pumpkin Kings, a manor illustration, and a focused endgame collection.

- **A complete 52-card FreeCell implementation:** eight tableau columns, four free cells, and four suit foundations.
- **Mouse and touch drag-and-drop:** move a single card or a legal run with a lifted stack preview and glowing destinations; click-to-place remains available.
- **Legal multi-card moves:** ordered runs move only when available free cells and empty columns provide sufficient temporary capacity.
- **Reversible foundations:** foundation cards may return to the tableau or a free cell when that move is legal.
- **Three verified Lantern Rescue puzzles:** compact endgames built around making space and restoring the four towers.
- **Automatic endgame collection:** after a move, the game verifies that every remaining card can reach its foundation, then visibly collects the complete winning sequence. Stop and a single batch Undo keep you in control.
- **Unlimited session undo and legal-move hints:** experiment without losing the previous position.
- **Seeded classic deals:** share a deal number so someone else can start with the same layout.
- **Local save and records:** keep the current state, time, hint count, preferences, and puzzle bests in the same browser.
- **English and Simplified Chinese**, original SVG cards, user-triggered synthesized sound, and compact iframe layouts.

Created for [FreeCell Game](https://freecell-game.top) as part of the Midnight Candy Club collection, the game is also a self-contained static application.

## How to play FreeCell

1. **Move all cards to the foundations.** Each suit builds upward from Ace through King.
2. **Build tableau columns downward in alternating colors.** A red 7 can go onto a black 8, for example. Any card can start an empty column.
3. **Use the four free cells as temporary spaces.** Each holds one card.
4. **Move a run only when you have enough temporary capacity.** The run must already be descending and alternate red and black.

For sequence moves, capacity is `(empty free cells + 1) × 2^(usable empty columns)`. An empty destination column is excluded from the usable-column count. This prevents a visually tidy run from moving through spaces the position does not actually provide.

You win when all four foundations reach King. A legal hint is not a proof that the whole deal can be solved; some shuffled deals may be unsolvable.

## Lantern Rescue: three smaller challenges

| Puzzle | What it teaches |
| --- | --- |
| **The West Tower** | Use temporary spaces to uncover waiting Queens. |
| **The Moonlight Ball** | Plan the four waiting places before moving the guests. |
| **The Last Candle** | Open useful space when every tableau column begins occupied. |

Every puzzle has a complete legal solution in `puzzleSolution()` and automated validation of every move. The displayed target is a friendly par, not a claim of the mathematical minimum. The same FreeCell rules apply in both modes.

## Controls

| Action | Input |
| --- | --- |
| Drag a card or ordered run | Press its first card, drag to a legal destination, and release |
| Select a card or ordered run | Click or tap its first card |
| Complete a move | Click or tap the destination column, free cell, or foundation |
| Try a single card on its foundation | Double-click or double-tap an exposed card |
| Finish a proven endgame | Starts automatically after a move; use **Finish automatically** to resume after Stop or Undo |
| Stop automatic collection | **Stop** or **Esc** |
| Undo | **U** or Undo; an automatic collection is restored as one batch |
| Suggest a legal move | **H** or A Little Hint |
| Cancel a drag or clear the selection | **Esc** |
| Scroll a short tableau | Scroll arrows, mouse wheel, or swipe a gap / non-movable card; dragging near its top or bottom edge also scrolls |
| Change language, sound, or open help | Header buttons |

Use **drag-and-drop** or **select, then destination**, whichever feels more comfortable. A drag starts after a small movement threshold, so a normal tap still selects. Legal destinations glow, and an invalid drop or cancelled gesture leaves every card in place. Only descending, alternating-color runs can be dragged, and the same FreeCell capacity rules apply. In short embedded windows, long tableau columns scroll within the card area; visible scroll arrows and edge auto-scroll keep covered cards reachable while free cells, foundations, and main tools stay available.

## Automatic endgame collection

After each successful drag, click-to-place move, or quick foundation move, the game checks whether **all remaining cards can finish using only legal foundation moves**. It runs that proof on a separate copy of the position. A partial route does not trigger collection: if even one card still needs another tableau or free-cell move, you keep playing normally.

When the full route is clear, the remaining cards fly home one at a time and every collected card counts as a normal move. The animation uses about 130 ms per card, capped at four seconds for the whole sequence. Reduced-motion preferences remove the flying animation while keeping completion asynchronous.

**Stop** pauses at the current position. **Undo** restores the position before that automatic collection began, including its move count; it does not immediately collect the cards again. Use **Finish automatically** when you want to resume. A saved position that is already ready to finish also shows that button. Ordinary midgame Undo does not disable automatic collection later in the deal.

Switching deals, restarting, opening help, changing language, resizing, hiding the page, or leaving its window cancels any in-progress collection. Queued callbacks from that run cannot move cards in a different deal. The four-King puzzle still requires you to create the free space yourself before automatic collection becomes possible.

## Share a deal or a puzzle

- [Classic deal 12345](https://halloween-freecell.crazy3d.org/?deal=12345)
- [Lantern Rescue 1](https://halloween-freecell.crazy3d.org/?puzzle=1)
- [Lantern Rescue 2](https://halloween-freecell.crazy3d.org/?puzzle=2)
- [Lantern Rescue 3](https://halloween-freecell.crazy3d.org/?puzzle=3)

Sharing a completed game includes its moves, elapsed time, and hint count. Sharing in progress identifies the deal without claiming a win. Device sharing is used when available; otherwise the game attempts clipboard copying and displays text if that is unavailable.

## Frequently asked questions

### Is this real FreeCell or only a themed card layout?

It is a playable rules implementation with full-deck validation, legal destinations, sequence capacity, foundations, reversible moves, and a win condition. The Halloween cards and tower progress are visual additions.

### Can I move any stack to an empty column?

No. The cards must form a descending, alternating-color sequence, and your temporary spaces must support the transfer. The empty destination is not counted as extra working space.

### Do hints guarantee a win?

No. Hints suggest an immediate legal move. They do not search for a full winning solution. All three authored Lantern Rescue puzzles have tested solutions; that guarantee is not extended to every shuffled classic deal.

### What does Undo restore?

A manual move restores its previous position and move count. An automatic collection has one checkpoint, so one Undo restores the position before the whole collection began, even if you stopped it partway through. Undo history lasts for the current page session. It does not rewind elapsed real time, erase requested hints, or delete a previously earned best record.

### Does it save between visits?

When local storage is available, the game restores the current position and local records. Data is specific to the browser and site origin. There is no account or cross-device synchronization. Blocked storage does not prevent playing.

### Is the layout suitable for phones?

Cards can be dragged or selected by touch, and the embedded layout adapts to constrained windows. Very short windows use local tableau scrolling rather than shrinking every exposed card into an unreadable strip. See [EMBEDDING.md](EMBEDDING.md); browser viewport checks are distinct from physical-device certification.

## Run locally and test

Serve the repository root over HTTP:

```sh
python3 -m http.server 4174
```

Open [http://localhost:4174](http://localhost:4174). No build, dependency installation, API key, or CDN is required. JavaScript modules may not load when the page is opened directly through `file://`.

Run the automated checks:

```sh
npm test
```

Or inspect each suite separately:

```sh
node tests/engine.test.js
node tests/startup.test.js
node tests/drag.test.js
node tests/auto-finish.test.js
```

The regression checks cover unique full-deck deals, sequence capacity, foundation order and reversibility, legal hints, rejected-move preservation, all three endgame solutions, defensive startup parsing, and the mouse/touch gesture lifecycle. Drag tests exercise legal and rejected drops, ordered-run capacity, interrupted gestures, multi-pointer isolation, touch capture transfer, accidental-click suppression, edge scrolling, and complete rescue solutions through the drag controller. Endgame tests verify the full-win proof, card conservation, accurate counts, cancellation and stale timers, the 52-card bound, reduced motion, and the actual app hooks for automatic start, Stop, whole-batch Undo, and restart. These rule checks complement, rather than replace, browser interaction review.

## Compact-player walkthrough

![Haunted FreeCell in a compact host iframe, retaining the tableau, free cells, foundations and tools](docs/images/mobile.jpg)

Drag a card or ordered run to a glowing destination, or select the card and then its destination. Free cells and suit foundations remain available while long columns scroll inside the tableau. Short tables provide scroll arrows, and holding a dragged stack near the tableau’s top or bottom edge scrolls the columns.

*Actual interface captured in a browser iframe sized for the host player. This is a compact-window illustration, not a physical-phone test.*

## Embed Haunted FreeCell

```html
<iframe
  src="https://halloween-freecell.crazy3d.org/?embed=1"
  title="Haunted FreeCell — Halloween solitaire"
  width="100%"
  height="654"
  scrolling="no"
  allow="fullscreen"
  style="display:block;border:0"
></iframe>
```

The game automatically chooses a compact view when embedded. Give the iframe its usable player area after subtracting any host toolbar. The game does not access the parent document. See [EMBEDDING.md](EMBEDDING.md) for the 1160×654 desktop baseline and smaller-window guidance.

## Source guide

- `engine.js` — pure FreeCell rules, deterministic dealing, legal-move generation, and puzzle solutions.
- `startup.js` — safe preference parsing and bounded puzzle identifiers.
- `auto-finish.js` — cloned-position endgame proof and cancellable sequential collection.
- `drag.js` — pointer gesture lifecycle, movement threshold, cancellation, compatibility-click guard, and edge-scroll calculation.
- `app.js` — drag and selection controls, responsive layout, original card rendering, localization, storage, and sound.
- `index.html`, `style.css`, `icon.svg` — the manor interface and artwork.
- `tests/` — engine, startup, drag/drop, and automatic endgame regression checks.

This repository is self-contained. It does not require or modify the code of the existing `game.freecell-game.top` player.

## Continue the Halloween collection

- **[Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-tripeaks) — adjacent-rank card chains, Moon Bridges, and eight rescue deals.
- **[Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-pumpkin-shift) — 12 numbered sliding puzzles with limited line moves.
- **[Haunted Hearts](https://halloween-love-game.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-love-game) — two ghosts share doors, pressure plates, and a lantern.
- **[Pumpkin 2048](https://halloween-2048.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-2048) — classic number merging plus positional Lantern Trials.

## Credits

Created for **AshinTop** and **Midnight Candy Club**, with AI-assisted design, coding, and review. The manor, Halloween character faces, interface art, and synthesized sounds were produced for this project. It is an independent FreeCell implementation and does not imply endorsement by another solitaire publisher. The game code includes no analytics, payments, remote rankings, or account service. The hosting provider may add its own scripts or request logging independently.
