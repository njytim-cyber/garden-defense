# Import Guide - Defenders of the Realm React Architecture

## Data Imports

### Game Balance Data
```javascript
// Import entire balance data
import BALANCE_DATA from './data/balance.json';

// Access specific sections
const enemies = BALANCE_DATA.enemies;
const towers = BALANCE_DATA.towers;
const waves = BALANCE_DATA.waves;
const difficulties = BALANCE_DATA.player.difficulties;
```

### Maps Configuration
```javascript
// Import all maps
import { MAPS } from './data/maps';

// Access specific map
const gardenMap = MAPS.garden;
const pathWaypoints = MAPS.garden.paths;
```

### Game Constants
```javascript
// Import all constants
import * as GameConstants from './constants/GameConstants';

// Access specific constants
import { 
  SPAWN_DELAY_FRAMES,
  TOWER_COLLISION_RADIUS,
  PARAGON_MERGE_COUNT,
  FREEZE_DURATION
} from './constants/GameConstants';
```

## Utility Imports

### Game Logic
```javascript
import {
  isValidPlacement,
  calculateDamage,
  generateWaveComposition,
  getUpgradeCost,
  getSellValue,
  pointToSegmentDistance,
  isPointInWater
} from './utils/gameLogic';
```

### Persistence
```javascript
import { saveGame, loadGame, clearSave } from './utils/persistence';
```

## View Component Imports

```javascript
import MainMenuView from './views/MainMenuView';
import MapSelectionView from './views/MapSelectionView';
import DifficultySelectionView from './views/DifficultySelectionView';
import ShopView from './views/ShopView';
import CompendiumView from './views/CompendiumView';
```

## Common Patterns

### Accessing Enemy Data
```javascript
import BALANCE_DATA from './data/balance.json';

// Get specific enemy
const guardStats = BALANCE_DATA.enemies.guard;
const bossStats = BALANCE_DATA.enemies.boss;

// Iterate all enemies
Object.keys(BALANCE_DATA.enemies).forEach(key => {
  const enemy = BALANCE_DATA.enemies[key];
  console.log(enemy.name, enemy.baseHealth);
});
```

### Accessing Tower Data
```javascript
import BALANCE_DATA from './data/balance.json';

// Get specific tower
const basicTower = BALANCE_DATA.towers.basic;
const heroTower = BALANCE_DATA.towers.hero;

// Filter shop items
const shopItems = Object.entries(BALANCE_DATA.towers)
  .filter(([_, tower]) => tower.shopPrice)
  .map(([key, tower]) => ({ ...tower, key }));
```

### Using Maps
```javascript
import { MAPS } from './data/maps';

// Get map list
const mapKeys = Object.keys(MAPS);
const mapEntries = Object.entries(MAPS);

// Convert path waypoints to canvas coordinates
const paths = MAPS.garden.paths;
paths.forEach(path => {
  path.forEach(waypoint => {
    const canvasX = waypoint.x * canvasWidth;
    const canvasY = waypoint.y * canvasHeight;
  });
});
```

### Using Game Constants
```javascript
import { 
  PLACEMENT_MARGINS,
  TOWER_COLLISION_RADIUS,
  PARAGON_MERGE_COUNT
} from './constants/GameConstants';

// Validate tower placement
if (x < PLACEMENT_MARGINS.x || x > canvasWidth - PLACEMENT_MARGINS.x) {
  // Too close to edge
}

// Check tower collision
const distance = Math.hypot(tower1.x - tower2.x, tower1.y - tower2.y);
if (distance < TOWER_COLLISION_RADIUS) {
  // Towers overlap
}

// Check paragon merge
if (selectedTowers.length === PARAGON_MERGE_COUNT && wave >= PARAGON_MIN_WAVE) {
  // Can create Paragon
}
```

## Architecture Rules

1. **NEVER hardcode numeric values** - Always import from `balance.json` or `GameConstants.js`
2. **Data-driven approach** - Game logic should read from data files, not have inline values
3. **Separation of concerns** - Views are pure UI, logic goes in Containers/Utils
4. **Type safety** - Use PropTypes for all View components

## File Locations Reference

| Type | Location | Example |
|------|----------|---------|
| Game Balance | `src/data/balance.json` | Enemy stats, tower stats |
| Maps | `src/data/maps.js` | Path coordinates |
| Constants | `src/constants/GameConstants.js` | Spawn delays, margins |
| Game Logic | `src/utils/gameLogic.js` | Placement validation |
| Persistence | `src/utils/persistence.js` | Save/load |
| Views | `src/views/*.jsx` | UI components |
| Containers | `src/containers/*.jsx` | Planned |

## Migration Notes

If migrating code from the original monolith (`archive/index.html.monolith`):

1. **Replace hardcoded numbers** with constants or balance data
2. **Extract UI** into View components
3. **Extract logic** into utility functions or Containers
4. **Use React state** instead of global variables
5. **Use props** instead of direct DOM manipulation
