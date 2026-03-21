# Product Requirements Document: Zendesk RPG — "Support Land"

> *"You're a new Zendesk admin and must defeat chaos in Support Land."*

## Overview

Support Land is a retro 2D Pokemon-style RPG built for the web (desktop only) using Phaser.js. New Zendesk employees battle through a series of Zendesk configuration "bosses" by answering quiz questions about setting up Zendesk for the first time. The game is themed around the 1999 movie *Office Space* — expect Lumbergh-style boss encounters, TPS report references, "PC LOAD LETTER" error messages on wrong answers, red Swingline stapler power-ups, and Milton-esque mumbling NPCs.

A full playthrough takes approximately **10 minutes**.

---

## Target Audience

New Zendesk employees learning the platform. Future expansion may include new Zendesk customers configuring their instance for the first time.

---

## Game Structure

The game is **linear** — the player progresses from boss to boss along a path. There are **3 levels**, each ending with a **Big Boss** battle. Within each level, the player must defeat **mini-bosses** before facing the Big Boss.

### Level 1: Team & Workflow (4 mini-bosses + 1 big boss)
| Boss | Type | Topics | Questions Available |
|------|------|--------|-------------------|
| Org Structure | Mini | Groups, User fields, Organizations, Org fields | 22 (8 easy, 9 med, 5 hard) |
| Brand & Config | Mini | Brand, Business schedule, Custom ticket fields | 22 (7 easy, 8 med, 7 hard) |
| Workflow | Mini | Routing, Triggers, Automations, Views, Macros | 28 (9 easy, 10 med, 9 hard) |
| Adding Agents | Mini | Agent roles, Invitations, Permissions | 18 (7 easy, 6 med, 5 hard) |
| **The TPS Report Overlord** | **Big** | All Team & Workflow topics (mixed) | Pool from all 90 |

### Level 2: Channels (3 mini-bosses + 1 big boss)
| Boss | Type | Topics | Questions Available |
|------|------|--------|-------------------|
| Help Center | Mini | Knowledge base setup, Articles, Sections | 20 (8 easy, 7 med, 5 hard) |
| Messaging | Mini | Web widget, Messaging channels, Bots | 20 (8 easy, 7 med, 5 hard) |
| Voice | Mini | Talk setup, Phone numbers, IVR | 20 (8 easy, 7 med, 5 hard) |
| **The Channel Surfer** | **Big** | All Channels topics (mixed) | Pool from all 60 |

### Level 3: Going Live (5 mini-bosses + 1 big boss)
| Boss | Type | Topics | Questions Available |
|------|------|--------|-------------------|
| Training Agents | Mini | Agent onboarding, Training resources | 13 (5 easy, 5 med, 3 hard) |
| External Email Forwarding | Mini | Email forwarding, SPF/DNS | 11 (4 easy, 4 med, 3 hard) |
| Configure Voice Channel | Mini | Voice activation, Number porting | 9 (3 easy, 3 med, 3 hard) |
| Activate Help Center | Mini | HC activation, Theming | 8 (3 easy, 3 med, 2 hard) |
| Set Up Messaging Channel | Mini | Messaging activation, Widget config | 9 (3 easy, 3 med, 3 hard) |
| **Bill Lumbergh** | **Big** | All Going Live topics (mixed) | Pool from all 50 |

---

## Battle Mechanics

### Quiz Combat
- Each battle presents the player with a series of multiple-choice questions (3 answer options each).
- **Correct answer** = player deals damage to the boss. XP earned: Easy (10), Medium (20), Hard (30).
- **Wrong answer** = boss deals damage to the player. A "PC LOAD LETTER" error flash appears. The correct answer is revealed along with a link to the relevant Zendesk Help Center article.
- Questions are drawn from `zendesk_boss_question_bank.json`, filtered by the boss's assigned `mini_boss` or `big_boss` value.

### Mini-Boss Battles
- **Questions per battle:** 5
- **Difficulty mix:** 3 easy, 1 medium, 1 hard (randomly selected from the boss's pool)
- **Boss HP:** 100
- **Damage dealt per correct answer:** Easy = 20, Medium = 25, Hard = 35

### Big Boss Battles
- **Questions per battle:** 8
- **Difficulty mix:** 2 easy, 3 medium, 3 hard (randomly selected from the level's full pool)
- **Boss HP:** 200
- **Damage dealt per correct answer:** Easy = 15, Medium = 25, Hard = 40
- Questions are drawn from across ALL mini-boss topics within that level (not repeating questions already seen in mini-boss battles)

### Player Health & Lives
- Player starts with **3 lives** (represented as red Swingline staplers).
- Player has **100 HP** per battle.
- Damage taken per wrong answer: Mini-boss = 25 HP, Big Boss = 30 HP.
- If HP reaches 0, the player loses a life and must retry the current boss.
- If all 3 lives are lost, the game ends with a final summary screen.

---

## Scoring & Summary

### Running Score
- Displayed in the HUD at all times.
- Score = cumulative XP earned from correct answers across all battles.

### Post-Battle Summary
Shown after every battle (win or lose):
- Questions answered correctly / total
- XP earned this battle
- Running total XP
- List of missed questions with links to Zendesk Help Center articles
- "Yeah, if you could go ahead and read those articles, that'd be great." (Lumbergh quote)

### End-of-Game Summary
Shown when the player defeats all 3 big bosses OR loses all lives:
- Final score / total possible XP
- Accuracy percentage
- Battles won / total
- All missed questions with Help Center links
- Performance rating:
  - 90%+ correct: "You've been promoted to Senior Admin."
  - 70-89%: "Looks like someone has a case of the Mondays."
  - Below 70%: "I believe you have my stapler."

---

## Office Space Theming

| Element | Office Space Reference |
|---------|----------------------|
| Big Boss 3 (final) | **Bill Lumbergh** — "Yeah, if you could go ahead and configure that, that'd be great." |
| Big Boss 1 | **The TPS Report Overlord** — demands TPS reports (ticket configuration) |
| Big Boss 2 | **The Channel Surfer** — controls all communication channels |
| Wrong answer flash | "PC LOAD LETTER" error message |
| Lives indicator | Red Swingline staplers |
| Power-up / bonus | "Pieces of Flair" — streak bonus for consecutive correct answers |
| NPC dialogue | Milton-style mumbling about "my desk" and "burning the building down" |
| Victory screen | "I could set the building on fire" celebration |
| Game over screen | "You have been relocated to the basement" |
| Background music vibe | Corporate elevator muzak (retro chiptune style) |

### Streak Bonus: Pieces of Flair
- 3 correct answers in a row = "Flair Bonus!" +10 XP
- 5 correct answers in a row = "37 Pieces of Flair!" +25 XP

---

## Tech Stack

- **Framework:** Phaser.js 3 (web-based, desktop only)
- **Language:** JavaScript/TypeScript
- **Build tool:** Vite
- **Question data:** `zendesk_boss_question_bank.json` (200 questions, loaded at runtime)
- **Target resolution:** 800x600 pixels
- **Browser support:** Chrome, Firefox, Safari, Edge (latest versions)

---

## Pixel Art Assets

All assets sourced from `Legacy Collection/Assets/`.

### Primary Assets (direct fit)

| Asset | Path | Usage |
|-------|------|-------|
| Hero spritesheet | `Packs/tiny-rpg-town-files/Environments/Town/spritesheets/hero.png` | Player character (overworld walk animations) |
| NPC spritesheet | `Packs/tiny-rpg-town-files/Environments/Town/spritesheets/npc.png` | NPCs, Milton-style characters |
| Town tileset | `Packs/tiny-rpg-town-files/Environments/Town/tileset/tileset.png` | Overworld map tiles (buildings, paths, water, trees) |
| Town example | `Packs/tiny-rpg-town-files/Environments/Town/tileset/example.png` | Reference for map assembly |
| Grass tile 1 | `Packs/tiny-rpg-town-files/Environments/Town/tileset/grass-tile.png` | Overworld ground / encounter zones |
| Grass tile 2 | `Packs/tiny-rpg-town-files/Environments/Town/tileset/grass-tile-2.png` | Overworld ground variation |
| Grass tile 3 | `Packs/tiny-rpg-town-files/Environments/Town/tileset/grass-tile-3.png` | Overworld ground variation |
| Enemy sprites | `Packs/grotto_escape_pack/Base pack/Spritesheets/enemies.png` | Mini-boss battle sprites |
| Item icons | `Packs/grotto_escape_pack/Base pack/Spritesheets/items.png` | Collectible items, flair icons |
| Health meter | `Packs/grotto_escape_pack/Base pack/Spritesheets/meter.png` | HP bar in battle UI |
| Player (grotto) | `Packs/grotto_escape_pack/Base pack/Spritesheets/player.png` | Alternative player sprite / battle stance |
| Cave tiles | `Packs/grotto_escape_pack/Base pack/Spritesheets/tiles.png` | Dungeon/cave area tiles |
| Crystal anim | `Packs/grotto_escape_pack/Base pack/anims/crystal.gif` | Reward/pickup animation |
| Powerup anim | `Packs/grotto_escape_pack/Base pack/anims/powerup.gif` | Streak bonus animation |

### Battle Backgrounds

| Asset | Path | Usage |
|-------|------|-------|
| Country landscape | `Environments/country-platform-files/country-platform-preview.png` | Level 1 battle background |
| Mist forest | `Environments/mist-forest-background/mist-forest-background-preview.png` | Level 2 battle background |
| Night town | `Environments/night-town-background-files/night-town-background-previewx1.png` | Level 3 battle background |
| Caverns background | `Environments/caverns-files-web/layers/background.png` | Big Boss battle background |
| Caverns tiles | `Environments/caverns-files-web/layers/tiles.png` | Big Boss battle foreground |

### Assets NOT Used (wrong genre/perspective)

- `Packs/SpaceShipShooter/` — Sci-fi shooter, wrong genre
- `Environments/parallax-industrial-web/` — Industrial, wrong aesthetic
- `Environments/space_background_pack/` — Space, not RPG
- `Environments/bulkhead-walls/` — Sci-fi corridors
- `Misc/Explosions pack/` — Shooter explosions
- `Environments/grunge-tileset-files-web/` — Side-view platformer
- `Environments/Urban-landscape-files/` — Modern cityscape
- `Environments/Rocky Beach environment/` — Side-view platformer
- `Environments/Mountain Dusk/` — Side-scrolling parallax
- `Environments/parallax_forest_pack web/` — Side-scrolling parallax

### Assets to Create or Source

| Asset | Description |
|-------|-------------|
| Big Boss sprites (x3) | TPS Report Overlord, Channel Surfer, Bill Lumbergh — pixel art boss portraits |
| Red Swingline stapler | Lives indicator icon |
| Pieces of Flair | Streak bonus icon |
| Battle UI frame | Text box borders, menu chrome for quiz interface |
| Pixel font | Retro monospace font for dialogue and UI |
| TPS Report icon | Recurring motif / collectible |
| "PC LOAD LETTER" popup | Wrong-answer error overlay |

---

## Milestones

### Milestone 1: The Cubicle (Core Battle Loop)
**Goal:** A single playable battle against one mini-boss with full quiz mechanics.

**Deliverables:**
- Phaser.js project scaffolded with Vite
- Title screen with "Press Start" and Office Space-themed intro text
- Single battle scene against the **Org Structure** mini-boss
- Quiz UI: question text, 3 answer buttons, HP bars for player and boss
- Correct answer: boss takes damage, XP awarded, hit animation
- Wrong answer: player takes damage, "PC LOAD LETTER" flash, correct answer + article link shown
- Health meter using `meter.png` asset
- Enemy sprite from `enemies.png`
- Country landscape as battle background
- Post-battle summary screen (questions right/wrong, XP earned, missed question links)
- Running score display in HUD
- Background music (chiptune loop) and sound effects (hit, wrong answer, victory)
- Lives display (3 staplers — placeholder art OK)

**Playable experience:** Player launches the game, sees the title screen, enters a battle, answers 5 questions, sees a battle summary. ~2 minutes of gameplay.

---

### Milestone 2: Level 1 Complete (Linear Progression + Big Boss)
**Goal:** Full Level 1 playable end-to-end with all 4 mini-bosses and the Big Boss.

**Deliverables:**
- Linear overworld map connecting boss encounters (using `tileset.png`, `grass-tile` assets, `hero.png` for player movement)
- NPC encounters between battles with Milton-style dialogue (using `npc.png`)
- All 4 Level 1 mini-bosses playable: Org Structure, Brand & Config, Workflow, Adding Agents
- Big Boss battle: **The TPS Report Overlord** (8 questions, mixed difficulty, higher HP)
- Difficulty scaling: mini-boss question mix (3E/1M/1H) vs big boss (2E/3M/3H)
- Question deduplication (big boss doesn't repeat mini-boss questions)
- Streak bonus system: "Pieces of Flair" at 3x and 5x streaks
- Life system: 3 lives (red staplers), lose a life when HP hits 0, retry current boss
- Game over screen when all lives lost ("You have been relocated to the basement")
- Level complete screen after defeating the Big Boss
- Sound effects for streaks, level complete, game over

**Playable experience:** Player walks through the Level 1 overworld, battles 4 mini-bosses and 1 big boss, talks to NPCs, manages lives. ~4 minutes of gameplay.

---

### Milestone 3: Full Game (All 3 Levels + End Game)
**Goal:** Complete 10-minute experience with all content, polish, and end-of-game summary.

**Deliverables:**
- Level 2: Channels — 3 mini-bosses (Help Center, Messaging, Voice) + **The Channel Surfer** big boss
  - Mist forest battle background
- Level 3: Going Live — 5 mini-bosses (Training, Email, Voice Config, HC Activation, Messaging Setup) + **Bill Lumbergh** final boss
  - Night town battle background
  - Caverns background for final boss
- Unique overworld maps per level with distinct themes
- Level transition scenes with Office Space quotes
- End-of-game summary screen:
  - Final score / total possible XP
  - Accuracy percentage
  - Battles won / total
  - All missed questions with Help Center links
  - Performance rating (Senior Admin / Case of the Mondays / I believe you have my stapler)
- Victory screen: "I could set the building on fire" celebration
- All 200 questions from `zendesk_boss_question_bank.json` integrated
- Polish: screen transitions, battle animations, particle effects for streaks
- Full background music track (chiptune corporate elevator muzak)
- Distinct sound effects per boss type

**Playable experience:** Full 10-minute game from title screen through all 3 levels to the final summary. Player battles 12 mini-bosses and 3 big bosses across the complete Zendesk setup journey.

---

## Question Data Reference

**Source file:** `zendesk_boss_question_bank.json`

**Schema:**
```json
{
  "id": 1,
  "big_boss": "Team & Workflow",
  "mini_boss": "Org structure",
  "topic": "Groups",
  "difficulty": "easy",
  "xp_value": 10,
  "question": "What is a Zendesk group mainly used for?",
  "answers": ["Organizing agents", "Storing macros", "Publishing articles"],
  "correct_answer": "Organizing agents",
  "article_url": "https://support.zendesk.com/hc/en-us/articles/..."
}
```

**Totals:** 200 questions | 3 big bosses | 10 mini-bosses | 3 difficulty tiers (easy/medium/hard) | XP values: 10/20/30
