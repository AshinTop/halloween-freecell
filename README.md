# Haunted FreeCell · 鬼屋纸牌

For a fixed-height host game window, see [EMBEDDING.md](./EMBEDDING.md). Embedded pages automatically use a compact card table with local scrolling for long columns.

A complete, buildless FreeCell game for the Halloween collection at **freecell-game.top**. The original manor, character-card artwork and interface belong to the **Midnight Candy Club** series.

## Play

Serve this directory with any static HTTP server:

```sh
python3 -m http.server 4174
```

Open `http://localhost:4174`. No build, package download, external iframe, API key or CDN is needed. JavaScript modules require HTTP rather than opening `index.html` directly as a local file.

## Rules and controls

- All 52 cards are dealt face up into eight columns (four columns of seven, four of six).
- Tableau columns build down in alternating colors; any card can begin an empty column.
- Each of the four free cells holds one card.
- Foundations build upward, Ace to King in the same suit. Foundation cards may move back to a column or free cell.
- Ordered runs can move only when the free cells and empty columns provide sufficient temporary capacity. An empty destination column is excluded from that capacity.
- Tap/click a card or ordered run, then its destination. Double-click an exposed single card to attempt its foundation.
- **U:** undo. **H:** suggest a legal move. **Esc:** clear the selection.

Undo restores prior card positions and move count for the current page session. Hints are legal suggestions, **not** a solved-game oracle or guarantee of victory. Current play, time, hint count, language, sound and puzzle records are stored locally when browser storage is available. A new deal may not be solvable; no guarantee is made for all random deals.

## Lantern Rescue

Three authored endgames use the same FreeCell rules:

1. **The west tower:** use temporary spaces to uncover queens.
2. **The moonlight ball:** plan four waiting places before moving the guests.
3. **The last candle:** all columns begin occupied; open space with the free cells.

Each puzzle has a complete legal solution included in `puzzleSolution()` and verified by tests. The displayed move target is a friendly par, not a proven minimum. Finishing each suit lights a tower; completing all four celebrates the manor's awakening.

## Files

- `engine.js`: pure FreeCell rules, seeded deals, move generation and verified puzzles.
- `app.js`: touch/click interface, original card faces, localization, local persistence and synthesized sound.
- `index.html`, `style.css`, `icon.svg`: manor artwork and responsive presentation.
- `tests/engine.test.js`: rule and endgame validation.

## Verify

```sh
npm test
```

Tests cover unique full-deck dealing, alternating runs, sequence-move capacity, foundation order and reversibility, legality of suggested moves, state preservation on rejected actions, and every step of each puzzle's complete solution. Browser visual and touch review is tracked separately by the release owner.

## Links and integration

`?puzzle=1` to `?puzzle=3` opens a puzzle. `?deal=12345` opens the same seeded classic deal. Sharing includes the actual result, time and hint usage when complete; in-progress sharing identifies the deal without claiming a win.

Publish the repository root as static files or embed its served page in the existing site. This implementation is self-contained and does not modify or depend on the source of the existing `game.freecell-game.top` game. Progress is local to each browser; no online rankings or cross-device account system are included.

## 制作说明

本作是独立制作的经典 FreeCell 与万圣节残局集。纸牌保留清楚的牌点和红黑花色，J/Q/K 分别以原创黑猫、女巫、南瓜王呈现。四种花色的收齐进度与庄园四塔相连。灯笼救援以可验证的短残局带来新的目标和教学体验，经典模式保留原有规则。
