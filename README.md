# Support Space — A Zendesk RPG

**A retro-style RPG where you battle through Zendesk configuration bosses by answering quiz questions about setting up Zendesk for the first time.** Themed around the 1999 movie *Office Space* — expect Lumbergh-style boss encounters, TPS report references, "PC LOAD LETTER" error messages, and Milton's missing stapler.

A full playthrough takes approximately **10 minutes**.

![Support Space Screenshot](public/assets/screenshots/title-screen.png)

---

## About

Support Space transforms Zendesk product knowledge into an epic RPG adventure. New Zendesk employees battle through 3 levels of increasingly difficult bosses — from Org Structure and Workflow basics to Channels and Going Live. Each boss tests your knowledge with multiple-choice questions drawn from a bank of 400+ questions across 10 topic areas.

Think Pokemon meets Zendesk Admin training — a fun, educational way to learn how to configure Zendesk!

## Features

- **400+ Quiz Questions** — Covering groups, triggers, automations, Help Center, messaging, voice, and more
- **3 Levels, 15 Bosses** — 12 mini-bosses and 3 big bosses across Team & Workflow, Channels, and Going Live
- **Office Space Theme** — Battle the TPS Report Overlord, The Channel Surfer, and Bill Lumbergh himself
- **Retro RPG Gameplay** — Pokemon-inspired overworld exploration and turn-based quiz combat
- **Shared Leaderboard** — Compete with colleagues worldwide via Firebase (top 25 scores)
- **Streak Bonuses** — Earn "Pieces of Flair" for consecutive correct answers
- **Learn From Mistakes** — Every wrong answer links to the relevant Zendesk Help Center article
- **Pixel Art Aesthetic** — Retro visuals with smooth animations and chiptune music
- **Mute Toggle** — Full audio control from the toolbar

## Game Rules

### Battle Mechanics
- **Lives**: 3 (represented as red Swingline staplers)
- **Player HP**: 100 per battle
- **Wrong Answer Penalty**: -25 HP (mini-boss), -30 HP (big boss)
- **Timer**: 15 seconds per question — enemies attack if you don't answer in time
- **Pause**: Press P or the Coffee Break button to pause the timer

### Mini-Boss Battles (Coworker Confrontation)
- **Questions per battle**: 5 (3 easy, 1 medium, 1 hard)
- **Boss HP**: 100
- **Damage per correct answer**: Easy = 20, Medium = 25, Hard = 35

### Big Boss Battles (Boss Encounter)
- **Questions per battle**: 8 (2 easy, 3 medium, 3 hard)
- **Boss HP**: 200
- **Damage per correct answer**: Easy = 15, Medium = 25, Hard = 40
- Questions drawn from all topics within the level (no repeats from mini-boss battles)

### XP & Scoring
- **XP per correct answer**: Easy = 10, Medium = 20, Hard = 30
- **Streak Bonus (3x)**: "Flair Bonus!" +10 XP
- **Streak Bonus (5x)**: "37 Pieces of Flair!" +25 XP

### Performance Ratings
- **90%+ accuracy**: Gold — "You've been promoted to Senior Admin."
- **70-89% accuracy**: Silver — "Looks like someone has a case of the Mondays."
- **Below 70% accuracy**: Bronze — "I believe you have my stapler."

## Level Progression

### Level 1: Team & Workflow
| Boss | Type | Topics |
|------|------|--------|
| Org Structure | Mini | Groups, User fields, Organizations |
| Brand & Config | Mini | Brand, Business schedule, Custom fields |
| Workflow | Mini | Routing, Triggers, Automations, Views, Macros |
| Adding Agents | Mini | Agent roles, Invitations, Permissions |
| **The TPS Report Overlord** | **Big** | All Team & Workflow topics |

### Level 2: Channels
| Boss | Type | Topics |
|------|------|--------|
| Help Center | Mini | Knowledge base, Articles, Sections |
| Messaging | Mini | Web widget, Messaging channels, Bots |
| Voice | Mini | Talk setup, Phone numbers, IVR |
| **The Channel Surfer** | **Big** | All Channels topics |

### Level 3: Going Live
| Boss | Type | Topics |
|------|------|--------|
| Training Agents | Mini | Agent onboarding, Training resources |
| External Email Forwarding | Mini | Email forwarding, SPF/DNS |
| Configure Voice Channel | Mini | Voice activation, Number porting |
| Activate Help Center | Mini | HC activation, Theming |
| Set Up Messaging Channel | Mini | Messaging activation, Widget config |
| **Bill Lumbergh** | **Big** | All Going Live topics |

## Leaderboard

The shared leaderboard uses Firebase Firestore for real-time persistence:
- Top 25 scores ranked by XP
- Displays: Rank, Player name, XP, Accuracy %, Battles won/total
- Gold/Silver/Bronze highlighting for top 3
- Scores submitted automatically at end of game or on reset
- Multiple entries allowed per player (each session is separate)

## Tech Stack

- **Game Engine**: [Phaser 3.90](https://phaser.io) — HTML5 game framework
- **Build Tool**: [Vite](https://vitejs.dev/) — Frontend build tooling
- **Database**: [Firebase Firestore](https://firebase.google.com/) — Leaderboard persistence
- **Audio**: Web Audio API — Chiptune music and sound effects
- **Language**: JavaScript (ES modules)

## Development

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/brianmy-zendesk/zendesk-rpg.git
cd zendesk-rpg

# Install dependencies
npm install
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Launch development server |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |

### Project Structure

```
zendesk-rpg/
├── public/
│   └── assets/
│       ├── audio/           # Music and sound effects
│       ├── backgrounds/     # Battle scene backgrounds
│       └── sprites/         # Character and item spritesheets
├── src/
│   ├── scenes/
│   │   ├── BootScene.js     # Asset loading
│   │   ├── TitleScene.js    # Title screen and name input
│   │   ├── OverworldScene.js # Free-roaming map with boss nodes
│   │   ├── DialogueScene.js  # NPC dialogue system
│   │   ├── BattleScene.js    # Quiz combat
│   │   ├── SummaryScene.js   # Post-battle results
│   │   └── EndGameScene.js   # Final stats and performance rating
│   ├── GameState.js          # Level config, boss data, NPC dialogue
│   ├── SoundManager.js       # Web Audio API music and SFX
│   ├── firebase.js           # Firebase configuration
│   ├── leaderboard.js        # Leaderboard submit/fetch with caching
│   └── main.js               # Phaser init, toolbar, modals
├── index.html                # Game shell, toolbar, modals, mobile gate
├── zendesk_boss_question_bank.json  # 200 quiz questions
├── PRD.md                    # Product requirements document
└── package.json
```

### Development Workflow

1. Run `npm run dev` to start the dev server
2. Edit files in `src/` — Vite will hot-reload automatically
3. Test changes in your browser
4. Run `npm run build` to create a production build

## Content

### Question Bank
All 439 questions are stored in `zendesk_boss_question_bank.json` with:
- Question text and 3 answer options
- Correct answer
- Difficulty tier (easy, medium, hard)
- XP value (10, 20, or 30)
- Link to relevant Zendesk Help Center article
- Boss and topic assignments

### Office Space References

| Element | Reference |
|---------|-----------|
| Final Boss | Bill Lumbergh — "Yeah, if you could go ahead and configure that, that'd be great." |
| Boss 1 | The TPS Report Overlord — demands TPS reports (ticket configuration) |
| Boss 2 | The Channel Surfer — controls all communication channels |
| Wrong Answers | "PC LOAD LETTER" error flash |
| Lives | Red Swingline staplers |
| Streak Bonus | "Pieces of Flair" |
| NPC | Milton — mumbles about his missing stapler |
| Golden Stapler | Milton's lost stapler — revealed in final dialogue and victory screen |
| Victory | "I could set the building on fire" celebration |
| Game Over | "You have been relocated to the basement" |

## Credits

### Created By
**Brian My** — Game design, development, and Zendesk content

### Built With
- [Phaser](https://phaser.io) — Game engine
- [Firebase](https://firebase.google.com/) — Leaderboard database
- [Vite](https://vitejs.dev/) — Build tool

### Art Assets
Pixel art sourced from the Legacy Collection asset pack, including:
- tiny-rpg-town-files (hero, NPC, town tileset)
- grotto_escape_pack (enemies, items, health meter)
- Various environment backgrounds (country, mist forest, night town, caverns)

## License

Game code and implementation. All rights reserved.

Zendesk is a registered trademark of Zendesk, Inc. This game is an internal training tool and is not an official Zendesk product.
