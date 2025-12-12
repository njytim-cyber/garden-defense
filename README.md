# ⚔️ Defenders of the Realm

A modern tower defense game built with React 19 and Vite 7, refactored from a 2260-line monolithic HTML file into a clean, data-driven architecture.

## 🎮 Game Features

- **46 Unique Maps** - From classic gardens to space stations
- **35 Enemy Types** - Scouts, bosses, stealthy assassins, armored knights
- **14 Tower Types** - Turrets, snipers, heroes, water ships, traps
- **Persistent Shop System** - Unlock towers with earned gold
- **3 Difficulty Levels** - Easy, Medium, Hard
- **Compendium** - Full wiki for all enemies and towers

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite 7.2
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Persistence**: LocalStorage
- **Testing**: Vitest + Playwright
- **Desktop**: Tauri 2.0 (future)
- **Mobile**: Capacitor 6 (future)

## 📁 Project Structure

```
garden-defense/
├── src/
│   ├── views/              # Pure UI components
│   │   ├── MainMenuView.jsx
│   │   ├── MapSelectionView.jsx
│   │   ├── DifficultySelectionView.jsx
│   │   ├── ShopView.jsx
│   │   └── CompendiumView.jsx
│   ├── containers/         # Game logic (planned)
│   ├── data/               # Game balance configuration
│   │   ├── balance.json    # Enemy/tower stats, wave rules
│   │   └── maps.js         # 46 map configurations
│   ├── constants/
│   │   └── GameConstants.js # Implementation constants
│   ├── utils/              # Helper functions
│   │   ├── gameLogic.js    # Pure game logic
│   │   └── persistence.js  # Save/load system
│   ├── App.jsx             # Main router
│   └── index.css           # Game styles + animations
├── archive/
│   └── index.html.monolith # Original 2260-line HTML file
├── vite.config.js
└── package.json
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server (Vite 7)
npm run dev

# Open http://localhost:5173/

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## 🎯 Current Status

✅ **Completed (UI Layer - 60%)**:
- All menu navigation (Main Menu → Maps → Difficulty)
- Shop system with persistent unlocks
- Compendium with enemy/tower stats
- Data extraction to `balance.json` and `maps.js`
- Clean View/Data separation

⏸️ **Planned (Game Engine - 40%)**:
- Canvas rendering for gameplay
- Game loop with ECS architecture
- Tower placement and combat
- Wave spawning and progression
- See `walkthrough.md` for details

## 📐 Architecture Principles

### Data-Driven Design
- All game balance values stored in `src/data/balance.json`
- Implementation constants in `src/constants/GameConstants.js`
- NEVER hardcode numeric values for game logic

### Container/View Separation
- **Views**: Pure UI components (props in, events out)
- **Containers**: Game logic, state management, ECS (planned)
- **Utils**: Reusable pure functions

### File Organization
```javascript
// Data imports
import BALANCE_DATA from './data/balance.json';
import { MAPS } from './data/maps';
import * from './constants/GameConstants';

// Logic imports
import { isValidPlacement, calculateDamage } from './utils/gameLogic';
import { saveGame, loadGame } from './utils/persistence';
```

## 🗺️ Map Types

- **Classic**: Garden, Rainforest, Forest Paradise
- **Challenge**: The Loop, The Maze, The Spiral
- **Water**: Red Bridge, Water Sprouts, Island Hopping
- **Special**: Cursed Path (portals), Graveyard (blood moon), Glass Layer (fragile floor)
- **Themed**: Volcano, Castle, City, Rainbow Heights, Space Station

## 🏪 Shop Items

Purchasable with persistent gold:
- 🥷 **Ninja** (300G) - Detects stealth, gains fire at level 5
- 🌊 **Submarine** (500G) - High fire rate water unit
- ⚙️ **Spike Trap** (100G) - Consumable path trap
- ☠️ **Prince Poison** (250G) - Instant-kill trap for Prince boss
- 🏦 **Bank** (1000G) - Generates $20 every 3 seconds

## 🎮 How to Play (Current State)

1. **Main Menu** → Click "PLAY GAME"
2. **Map Selection** → Choose from 46 maps
3. **Difficulty** → Easy ($150), Medium ($100), Hard ($100 + faster enemies)
4. **Game** → _Canvas gameplay not yet implemented_

**Working Features**:
- ✅ Navigate all menus
- ✅ Purchase shop items (persistent)
- ✅ View compendium
- ✅ Select maps and difficulty

## 🔧 Monolith Refactoring

This project was refactored from a single 2260-line `index.html` file:

**Before**: All game logic, rendering, data, and UI in one file
**After**: Clean separation into Views, Data, Utils, Constants

**See**: `archive/index.html.monolith` for the original file

## 🧪 Testing

Currently focused on manual testing of UI flows. Unit tests for game logic planned.

## 📝 License

MIT

---

**Built with ❤️ using modern web technologies**
