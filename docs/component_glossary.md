# Component Glossary

**Last Updated:** 2025-12-10  
**Total Components:** 11

---

## Views (Pure UI Components)

### MainMenuView
**Path:** `src/views/MainMenuView.jsx`  
**Purpose:** Main menu screen with play button  
**Key Props:**
- `onPlayClick: Function` - Navigate to map selection

### MapSelectionView
**Path:** `src/views/MapSelectionView.jsx`  
**Purpose:** Grid of 46 selectable maps  
**Key Props:**
- `onMapSelect: Function` - Map selection callback
- `onBack: Function` - Return to menu

### DifficultySelectionView
**Path:** `src/views/DifficultySelectionView.jsx`  
**Purpose:** Choose Easy/Medium/Hard difficulty  
**Key Props:**
- `onDifficultySelect: Function` - Difficulty choice callback
- `onBack: Function` - Return to maps

### ShopView
**Path:** `src/views/ShopView.jsx`  
**Purpose:** Purchase tower unlocks and consumables  
**Key Props:**
- `items: Array` - Shop inventory
- `metaMoney: Number` - Persistent currency
- `ownedTowers: Array` - Unlocked towers
- `onPurchase: Function` - Buy callback
- `onBack: Function`

### CompendiumView
**Path:** `src/views/CompendiumView.jsx`  
**Purpose:** Game wiki showing enemy/tower stats  
**Key Props:**
- `onBack: Function`

### WaveHUDView
**Path:** `src/views/WaveHUDView.jsx`  
**Purpose:** Top game HUD (lives, money, wave control)  
**Key Props:**
- `lives: Number`
- `money: Number`
- `waveNumber: Number`
- `isWaveActive: Boolean`
- `onWaveControlClick: Function`

### TowerPanelView
**Path:** `src/views/TowerPanelView.jsx`  
**Purpose:** Bottom tower selection panel  
**Key Props:**
- `towers: Object` - Available towers
- `selectedTowerType: String`
- `money: Number`
- `onTowerSelect: Function`
- `onMenuClick: Function`

### GameCanvasView
**Path:** `src/views/GameCanvasView.jsx`  
**Purpose:** Canvas wrapper for game rendering  
**Key Props:**
- `width: Number` - Canvas width
- `height: Number` - Canvas height
- `onCanvasReady: Function` - Canvas/context callback
- `onMouseMove: Function`
- `onClick: Function`

### UpgradePanelView
**Path:** `src/views/UpgradePanelView.jsx`  
**Purpose:** Tower upgrade/sell modal  
**Key Props:**
- `tower: Object` - Selected tower
- `onUpgrade: Function`
- `onSell: Function`
- `onClose: Function`
- `canAffordUpgrade: Boolean`
- `onParagonMode: Function` - Enter paragon selection

### ParagonMergeView
**Path:** `src/views/ParagonMergeView.jsx`  
**Purpose:** Multi-tower selection UI for paragon merging  
**Key Props:**
- `selectedTowers: Array` - Currently selected towers (max 3)
- `onMerge: Function` - Merge to paragon callback
- `onCancel: Function` - Exit paragon mode

---

## Containers (Game Logic)

### GameEngineContainer
**Path:** `src/containers/GameEngineContainer.jsx`  
**Purpose:** Core game loop with ECS architecture  
**Key Props:**
- `mapKey: String` - Selected map ID
- `difficulty: String` - Difficulty level
- `towers: Object` - Available towers from shop
- `onMenuClick: Function`
- `onGameOver: Function`

**Features:**
- 60fps game loop (requestAnimationFrame)
- Entity management (towers, enemies, projectiles, soldiers)
- Tower placement validation
- Combat system (damage, projectiles, status effects)
- Barracks soldier spawning
- Trap activation
- Paragon tower merging
- Wave progression

---

## Router

### App
**Path:** `src/App.jsx`  
**Purpose:** Main application router and state manager  
**Screens:** menu, maps, difficulty, shop, compendium, game  
**State:** persistent money, tower unlocks, screen navigation
