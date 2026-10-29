[English](README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [日本語](README.ja.md)

# Haunted FreeCell — Halloween Solitaire with Lantern Rescue Puzzles

🕯️ The manor is quiet, the Kings are pumpkins, and four dark towers need a little patience. **Haunted FreeCell** is a complete 52-card solitaire game with Halloween character cards, real drag-and-drop, and three small Lantern Rescue endgames. Make room, uncover the next card, and let the light in.

**[Play online](https://halloween-freecell.crazy3d.org/)** · [Explore all 12 Halloween games](https://github.com/AshinTop/halloween-games) · [⭐ Star this repository](https://github.com/AshinTop/halloween-freecell)

README translations cover five languages. The **game interface currently supports English and Simplified Chinese only**.

![Haunted FreeCell showing eight card columns, four free cells, four foundations, and Halloween character cards](docs/images/gameplay.jpg)

## What makes it special

- Traditional **52-card FreeCell**: eight columns, four one-card free cells, four suit foundations, and legal multi-card capacity.
- Drag a card or ordered run with mouse or touch, or select it and then its destination. Illegal drops and cancelled drags preserve the position.
- **Three verified Lantern Rescue puzzles**, seeded Classic deals, unlimited session undo, and immediate legal-move hints.
- Original cat Jacks, witch Queens, pumpkin Kings, optional synthesized sound, and towers that light as suits are completed.
- **Proven endgame collection** moves the remaining cards home automatically, with Stop and one-step batch Undo.

## How to play

Build each foundation upward from **Ace to King in the same suit**. Build columns downward in alternating red and black; any card may start an empty column. A free cell holds one card. An ordered run can move only if temporary space supports it: `(empty free cells + 1) × 2^(usable empty columns)`. An empty destination column is excluded from that count. Foundation cards may move back when the move is legal.

Lantern Rescue uses the same rules in three authored positions: **The West Tower**, **The Moonlight Ball**, and **The Last Candle**. Each has a tested complete solution. Their displayed move targets are friendly pars, not mathematical minimum claims.

### Automatic collection, with a way back

After a successful manual move, a separate copy of the position must prove that **every remaining card can finish using foundation moves alone**. A partial route never triggers collection. Once proven, cards collect one by one and each still counts as a move. Animation timing allows up to 130 ms per card, shortening long batches to a nominal four seconds; reduced motion removes the flight.

**Stop** or **Esc** pauses at the current position. One **Undo** restores the position and move count before the whole automatic batch, without immediately collecting again. **Finish automatically** resumes when wanted; a saved ready-to-finish position also offers that button. Ordinary midgame undo does not disable later collection. Changing deals, restarting, opening help, changing language, resizing, hiding the page, or leaving its window cancels the active sequence safely.

## Controls

| Action | Input |
| --- | --- |
| Move a card or legal run | Drag and release, or select then click/tap the destination |
| Try an exposed card on its foundation | Double-click or double-tap |
| Undo / hint | **U** / **H**, or the corresponding buttons |
| Stop collection / cancel a drag | **Esc**; collection also has a Stop button |
| Resume a proven finish | **Finish automatically** |
| Scroll long columns | Scroll arrows, wheel, swipe a gap or non-movable card; drag near an edge to auto-scroll |

## A little strategy

Keep a free cell available when possible: temporary space is also the capacity that lets a long run travel. Before moving a King, look for the Queen it may be covering. The automatic finish deliberately waits until no more tableau planning is required; it will not solve that planning for you.

## Progress and challenge links

The current deal, time, hint count, preferences, and puzzle bests are saved locally when allowed. Undo history is session-only, and there is no cross-device account sync. Share [deal 12345](https://halloween-freecell.crazy3d.org/?deal=12345) or [Lantern Rescue 1](https://halloween-freecell.crazy3d.org/?puzzle=1); puzzle values 2 and 3 select the other endgames. Sharing includes actual results and falls back to visible copyable text.

## Screenshots and video

![Haunted FreeCell compact table with accessible free cells, foundations, card columns, and tools](docs/images/mobile.jpg)

Actual game screenshot from a compact browser iframe; this demonstrates the small-window layout, not a physical-phone test.

[Video player and transcript](https://halloween-freecell.crazy3d.org/intro.html) · [Download the MP4](docs/media/intro.mp4)

The **24-second silent introduction** combines actual screenshots and captions. It is a visual tour, not continuous gameplay footage or an audio demonstration.

## Frequently asked questions

### Do hints guarantee a winning deal?

No. They suggest an immediate legal move, not a full solution. All three rescue puzzles have verified solutions; arbitrary Classic deals are not promised solvable.

### Can I drag any stack into an empty column?

No. It must descend in alternating colors, and available free cells and usable empty columns must support the transfer.

### Does Undo rewind the clock or remove a best record?

No. It restores positions and move counts, including a whole automatic batch when applicable. Elapsed time, requested hints, and already earned best records are not erased.

## Run locally and embed

Serve the repository root over HTTP:

```sh
python3 -m http.server 4173
```

Open **http://localhost:4173/**. No build or dependencies are needed. Use HTTP: `file://` can block JavaScript modules.

Run the included Node checks:

```sh
npm test
```

The Node suites check complete decks, capacity, reversible foundations, puzzle solutions, drag/drop and edge scrolling, cancelled gestures, full-win proof, Stop, batch Undo, reduced motion, and stale callback rejection. They complement live browser review.

```html
<iframe src="https://halloween-freecell.crazy3d.org/?embed=1"
  title="Haunted FreeCell"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

The desktop baseline is **1160×654 CSS pixels**. Short players scroll the tableau internally, leaving free cells, foundations, and tools available. Scroll arrows and drag-edge scrolling help reach long columns without making every exposed card tiny.

See [EMBEDDING.md](EMBEDDING.md) for sizing, storage, input focus, and permissions. Measure available iframe height after the host toolbar.

## More little Halloween adventures

- **[Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-tripeaks) — Build adjacent-rank card chains across eight rescue deals.
- **[Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-pumpkin-shift) — Slide numbered tiles through 12 rooms with limited Moon Glides.
- **[Haunted Hearts](https://halloween-love-game.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-love-game) — Help two ghosts share doors, paths, and a lantern.
- **[Pumpkin 2048](https://halloween-2048.crazy3d.org/)** · [Source](https://github.com/AshinTop/halloween-2048) — Merge numbered pumpkins and solve positional Lantern Trials.

## Credits and support

Created for **AshinTop** and **Midnight Candy Club** with human-directed, AI-assisted design, programming, and review. Artwork and synthesized sounds are original to this project. The game needs no remote account; hosting may independently add scripts or request logs.

Enjoyed playing? **[Leave a GitHub Star](https://github.com/AshinTop/halloween-freecell)**. For bug reports, include browser, iframe size, challenge link, and reproduction steps.
