# Haunted FreeCell — Halloween Solitaire & Lantern Rescue Puzzles

**Make room. Let the light in.** Haunted FreeCell turns a classic solitaire table into a moonlit manor, with readable Halloween character cards and four towers that illuminate as you complete the foundations. Play a full 52-card deal or solve one of three short Lantern Rescue endgames.

[**GitHub Pages deployment target**](https://ashintop.github.io/halloween-freecell/) · [Watch the visual introduction](docs/media/intro.mp4) · [Rules and controls](#how-to-play-freecell) · [Embed the game](#embed-haunted-freecell)

**Deployment status:** GitHub Pages is not live yet. The `ashintop.github.io` links in this document are intended deployment addresses. Use the local-run instructions until the hosted game has been published and verified.

[Video player and transcript (deployment target)](https://ashintop.github.io/halloween-freecell/intro.html) · [Captioned MP4 file](docs/media/intro.mp4). The 24-second silent introduction uses actual game screenshots; it is not a live gameplay recording.

[![Haunted FreeCell gameplay with eight tableau columns, four free cells, four suit foundations, and original Halloween cards](docs/images/gameplay.jpg)](docs/media/intro.mp4)

Enjoy the manor or want to revisit the source? **[Star Haunted FreeCell on GitHub](https://github.com/AshinTop/halloween-freecell)**. If you report a problem, include the deal or puzzle number and the move you were attempting.

## A classic game with a small Halloween story

The core game remains FreeCell: use temporary space wisely, uncover useful cards, and send every suit from Ace to King. The seasonal layer adds original black-cat Jacks, witch Queens, pumpkin Kings, a manor illustration, and a focused endgame collection.

- **A complete 52-card FreeCell implementation:** eight tableau columns, four free cells, and four suit foundations.
- **Legal multi-card moves:** ordered runs move only when available free cells and empty columns provide sufficient temporary capacity.
- **Reversible foundations:** foundation cards may return to the tableau or a free cell when that move is legal.
- **Three verified Lantern Rescue puzzles:** compact endgames built around making space and restoring the four towers.
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
| Select a card or ordered run | Click or tap its first card |
| Complete a move | Click or tap the destination column, free cell, or foundation |
| Try a single card on its foundation | Double-click or double-tap an exposed card |
| Undo | **U** or Undo |
| Suggest a legal move | **H** or A Little Hint |
| Clear the selection | **Esc** |
| Change language, sound, or open help | Header buttons |

The interface uses **select, then destination**. It does not require dragging a stack across a small screen. In short embedded windows, long tableau columns scroll within the card area; free cells, foundations, and main tools stay available.

## Share a deal or a puzzle

- [Classic deal 12345](https://ashintop.github.io/halloween-freecell/?deal=12345)
- [Lantern Rescue 1](https://ashintop.github.io/halloween-freecell/?puzzle=1)
- [Lantern Rescue 2](https://ashintop.github.io/halloween-freecell/?puzzle=2)
- [Lantern Rescue 3](https://ashintop.github.io/halloween-freecell/?puzzle=3)

Sharing a completed game includes its moves, elapsed time, and hint count. Sharing in progress identifies the deal without claiming a win. Device sharing is used when available; otherwise the game attempts clipboard copying and displays text if that is unavailable.

## Frequently asked questions

### Is this real FreeCell or only a themed card layout?

It is a playable rules implementation with full-deck validation, legal destinations, sequence capacity, foundations, reversible moves, and a win condition. The Halloween cards and tower progress are visual additions.

### Can I move any stack to an empty column?

No. The cards must form a descending, alternating-color sequence, and your temporary spaces must support the transfer. The empty destination is not counted as extra working space.

### Do hints guarantee a win?

No. Hints suggest an immediate legal move. They do not search for a full winning solution. All three authored Lantern Rescue puzzles have tested solutions; that guarantee is not extended to every shuffled classic deal.

### What does Undo restore?

Card locations and move count return to their previous state. Undo history lasts for the current page session. It does not rewind elapsed real time or erase that you requested a hint.

### Does it save between visits?

When local storage is available, the game restores the current position and local records. Data is specific to the browser and site origin. There is no account or cross-device synchronization. Blocked storage does not prevent playing.

### Is the layout suitable for phones?

Cards can be selected by touch, and the embedded layout adapts to constrained windows. Very short windows use local tableau scrolling rather than shrinking every exposed card into an unreadable strip. See [EMBEDDING.md](EMBEDDING.md); browser viewport checks are distinct from physical-device certification.

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
```

The eight checks cover unique full-deck deals, sequence capacity, foundation order and reversibility, legal hints, rejected-move preservation, all three endgame solutions, and defensive startup parsing. These rule checks complement, rather than replace, browser interaction review.

## Compact-player walkthrough

![Haunted FreeCell in a compact host iframe, retaining the tableau, free cells, foundations and tools](docs/images/mobile.jpg)

Select a card first, then select its destination. Free cells and suit foundations remain available while long columns can scroll inside the tableau. You do not have to drag a stack across the small player.

*Actual interface captured in a browser iframe sized for the host player. This is a compact-window illustration, not a physical-phone test.*

## Embed Haunted FreeCell

```html
<iframe
  src="https://ashintop.github.io/halloween-freecell/?embed=1"
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
- `app.js` — selection controls, responsive layout, original card rendering, localization, storage, and sound.
- `index.html`, `style.css`, `icon.svg` — the manor interface and artwork.
- `tests/` — engine and startup regression checks.

This repository is self-contained. It does not require or modify the code of the existing `game.freecell-game.top` player.

## Continue the Halloween collection

- **[Trick-or-Treat TriPeaks](https://github.com/AshinTop/halloween-tripeaks)** — adjacent-rank card chains, Moon Bridges, and eight rescue deals.
- **[Pumpkin Shift](https://github.com/AshinTop/halloween-pumpkin-shift)** — 12 numbered sliding puzzles with limited line moves.
- **[Haunted Hearts](https://github.com/AshinTop/halloween-love-game)** — two ghosts share doors, pressure plates, and a lantern.
- **[Pumpkin 2048](https://github.com/AshinTop/halloween-2048)** — classic number merging plus positional Lantern Trials.

## Credits

Created for **AshinTop** and **Midnight Candy Club**, with AI-assisted design, coding, and review. The manor, Halloween character faces, interface art, and synthesized sounds were produced for this project. It is an independent FreeCell implementation and does not imply endorsement by another solitaire publisher. No analytics, payments, remote rankings, or account service is included.
