/**
 * Game Constants - Implementation-specific values
 * These are technical/UI constants that don't affect game balance.
 * Game balance values (enemy stats, tower costs, etc.) are in balance.json
 */

// === Spawn & Wave System ===
export const SPAWN_DELAY_FRAMES = 40; // Delay between enemy spawns (frames)
export const WAVE_BONUS_MONEY = 20; // Money bonus per wave completion

// === UI & Animation ===
export const COIN_FLY_SPEED = 15; // Speed of coin animation to HUD
export const COIN_BOUNCE_DELAY = 30; // Frames before coin flies to UI
export const COIN_COLLECT_DISTANCE = 20; // Pixel distance to "collect" coin
export const COIN_MAX_VISUAL = 5; // Max visual coins per enemy (rest combined)

export const FLOATING_TEXT_RISE_SPEED = 1; // Pixels per frame
export const FLOATING_TEXT_FADE_RATE = 0.02; // Alpha reduction per frame

export const PARTICLE_FADE_RATE = 0.02; // Alpha reduction per frame

export const EVENT_BANNER_DURATION = 4000; // milliseconds

// === Placement & Collision ===
export const PLACEMENT_MARGINS = {
    x: 20,      // Minimum distance from left/right edge
    top: 80,    // Minimum distance from top (HUD)
    bottom: 100 // Minimum distance from bottom (Tower Panel)
};

export const TOWER_COLLISION_RADIUS = 40; // Minimum distance between towers
export const TRAP_COLLISION_RADIUS = 25;  // Minimum distance for traps
export const PATH_COLLISION_RADIUS = 35;  // Distance from path for scenery
export const TOWER_PATH_MIN_DISTANCE = 40; // Minimum distance from path for towers
export const TRAP_PATH_MAX_DISTANCE = 35;  // Maximum distance from path for traps (must be ON path)

// === Towers & Combat ===
export const PARAGON_MERGE_COUNT = 3; // Number of towers needed to create Paragon
export const PARAGON_MIN_WAVE = 10;   // Minimum wave to unlock Paragon merge
export const UPGRADE_COST_MULTIPLIER = 0.75; // Upgrade cost = base cost × this × level
export const SELL_VALUE_MULTIPLIER = 0.7;    // Sell value = total investment × this
export const UPGRADE_DAMAGE_MULTIPLIER = 1.4; // Damage increase per upgrade
export const UPGRADE_RANGE_MULTIPLIER = 1.1;  // Range increase per upgrade

export const PARAGON_DAMAGE_MULTIPLIER = 5;   // Damage multiplier for Paragon
export const PARAGON_RANGE_MULTIPLIER = 1.5;  // Range multiplier for Paragon
export const PARAGON_COOLDOWN_MULTIPLIER = 0.5; // Cooldown multiplier for Paragon

export const NINJA_FIRE_UNLOCK_LEVEL = 5; // Level at which Ninja gains fire effect

export const HERO_LIMIT = 1; // Maximum number of hero towers

// === Barracks & Soldiers ===
export const BARRACKS_SOLDIER_COUNT = 3; // Number of soldiers per barracks
export const SOLDIER_BASE_HP = 60;
export const SOLDIER_HP_PER_LEVEL = 20;
export const SOLDIER_BASE_DAMAGE = 2;
export const SOLDIER_DAMAGE_PER_LEVEL = 1;
export const SOLDIER_COMBAT_RATE = 30; // Frames between combat ticks
export const SOLDIER_DAMAGE_TAKEN = 2; // Damage soldier takes per combat tick
export const SOLDIER_MOVE_SPEED = 1.5;
export const SOLDIER_RETURN_SPEED = 1.0;
export const SOLDIER_REGEN_RATE = 60; // Frames between regen ticks
export const SOLDIER_REGEN_AMOUNT = 5;

// === Status Effects ===
export const FREEZE_DURATION = 60;  // frames
export const FREEZE_SLOW_MULTIPLIER = 0.5; // Speed reduction
export const BURN_DURATION = 120;   // frames
export const BURN_DAMAGE = 5;       // Damage per tick
export const BURN_TICK_RATE = 15;   // Frames between burn ticks
export const VOID_DURATION = 60;    // frames (complete stop)
export const SPEED_BUFF_DURATION = 120; // frames
export const SPEED_BUFF_MULTIPLIER = 1.5;

// === Enemy Mechanics ===
export const TROLL_REGEN_RATE = 60; // Frames between regen ticks
export const TROLL_REGEN_PERCENT = 0.02; // 2% of max HP per tick

export const HEALER_COOLDOWN = 60; // frames
export const HEALER_HEAL_AMOUNT = 50;
export const HEALER_RANGE = 150;

export const WIZARD_COOLDOWN = 180; // frames
export const WIZARD_BUFF_COUNT = 3; // Max allies to buff
export const WIZARD_RANGE = 150;

export const ARMOR_DAMAGE_REDUCTION = 0.2; // 80% damage reduction
export const REINFORCED_NINJA_DAMAGE = 1; // Damage when resisted

// === Bank Income ===
export const BANK_INCOME_AMOUNT = 20;

// === Map-Specific ===
export const STUMP_RANGE_MULTIPLIER = 2.0; // Range bonus on The Stump special spot
export const STUMP_RADIUS = 35; // Radius of stump special area

export const GLASS_FLOOR_MIN_LEVEL = 5; // Towers below this level can crack
export const GLASS_FLOOR_MIN_WAVE = 10; // Glass breaking starts at this wave
export const GLASS_FLOOR_CRACK_CHANCE = 0.5; // 50% chance per tower

// === Scenery Generation ===
export const SCENERY_COUNT = {
    default: 60,
    dense_forest: 150,
    circles: 20,
    castle: 40,
    city: 50,
    volcano: 45,
    bridge: 15,
    rainbow: 30,
    desert: 40,
    honey: 50
};

export const SCENERY_PATH_SAFE_DISTANCE = 60; // Pixels from path
export const SCENERY_STUMP_SAFE_DISTANCE = 50; // Pixels from stump

// === Lives & Damage ===
export const STARTING_LIVES = 20;
export const EMPEROR_LIVES_DAMAGE = 1000;
export const KING_LIVES_DAMAGE = 100;
export const BOSS_LIVES_DAMAGE = 20; // boss, dark_knight, tank
export const BASIC_LIVES_DAMAGE = 1;

// === Persistence ===
export const SAVE_KEY = 'garden_td_save_v1';

// === Canvas & Rendering ===
export const TOWER_CLICK_RADIUS = 20; // Pixel radius for clicking towers
export const MOUSE_PREVIEW_ALPHA = {
    valid: 0.1,
    invalid: 0.1
};
export const MOUSE_PREVIEW_STROKE_ALPHA = {
    valid: 0.3,
    invalid: 0.3
};

// === Path Rendering ===
export const PATH_WIDTH = {
    outer: 48,
    inner: 40,
    dashed: 35
};
export const PATH_OCEAN_WIDTH = {
    outer: 48,
    inner: 40
};

export const START_POINT_RADIUS = 25;
export const END_POINT_RADIUS = 25;
export const END_POINT_OCEAN_RADIUS = 30;
export const END_POINT_MAGIC_RADIUS = 30;

// === Health Bar ===
export const ENEMY_HEALTHBAR_WIDTH = 20;
export const ENEMY_HEALTHBAR_HEIGHT = 4;
export const ENEMY_HEALTHBAR_OFFSET = 8;

export const SOLDIER_HEALTHBAR_WIDTH = 10;
export const SOLDIER_HEALTHBAR_HEIGHT = 2;
export const SOLDIER_HEALTHBAR_OFFSET = 10;

// === Difficulty Settings (overridden by balance.json at runtime) ===
export const DEFAULT_DIFFICULTY = 'medium';

// === Game Loop ===
export const GAME_SPEED_NORMAL = 1;
export const GAME_SPEED_FAST = 3;

// === Wave Progression ===
export const WAVE_BASE_COUNT = 5;
export const WAVE_GROWTH_RATE = 2; // Enemies per wave = BASE + (wave * RATE)
export const WAVE_HP_MULTIPLIER = 0.2; // +20% HP per wave

export const GRAVEYARD_HP_MULTIPLIER = 1.15; // +15% HP on Graveyard map
export const GRAVEYARD_SPEED_MULTIPLIER = 1.15; // +15% speed on Graveyard map

// === Gold Progression ===
export const META_GOLD_BASE = 50;
export const META_GOLD_PER_WAVE = 10;
