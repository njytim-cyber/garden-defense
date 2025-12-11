# Balance Data Schema

**Version:** 2.0.0

*Auto-generated from `src/data/balance.json`*

---

## Player Configuration

**Starting Lives:** 20

### Difficulties

| Difficulty | Starting Money | Speed Multiplier |
|------------|----------------|------------------|
| easy | 150 | 1x |
| medium | 100 | 1x |
| hard | 100 | 1.1x |

## Towers

| ID | Name | Cost | Range | Damage | Cooldown | Special |
|----|------|------|-------|--------|----------|----------|
| `basic` | Turret | 50 | 120 | 20 | 40 | - |
| `barracks` | Barracks | 150 | 80 | 5 | 180 | Barracks |
| `sniper` | Sniper | 120 | 250 | 100 | 120 | - |
| `rapid` | Blaster | 200 | 110 | 12 | 5 | - |
| `fire` | Inferno | 250 | 100 | 15 | 30 | burn |
| `ice` | Glacial | 150 | 130 | 10 | 45 | freeze |
| `hero` | Guardian | 1500 | 180 | 250 | 35 | shock, Hero |
| `paladin` | Paladin | 1200 | 150 | 300 | 50 | burn, Hero |
| `ninja` | Ninja | 175 | 140 | 18 | 15 | 🔒 Locked |
| `void` | Void | 500 | 150 | 40 | 80 | void, Amphibious |
| `cannon` | Cannon Ship | 350 | 200 | 80 | 60 | explosive, Water Only |
| `submarine` | Submarine | 600 | 220 | 60 | 20 | Water Only, 🔒 Locked |
| `spike` | Spike Trap | 25 | 25 | 40 | 50 | Trap, 🔒 Locked |
| `poison` | Prince Poison | 100 | 20 | 99999 | 0 | Trap, 🔒 Locked |
| `bank` | Bank | 1000 | 0 | 0 | 180 | income, 🔒 Locked |

## Enemies

| ID | Name | Base Health | Base Speed | Bounty | Type | Radius |
|----|------|-------------|------------|--------|------|--------|
| `guard` | Guard | 80 | 1.4 | 15 | basic | 11 |
| `basic` | Scout | 50 | 1.8 | 10 | basic | 10 |
| `goblin` | Goblin | 40 | 1.6 | 8 | basic | 9 |
| `skeleton` | Skeleton | 30 | 1.2 | 5 | basic | 9 |
| `bat` | Bat | 25 | 2.8 | 8 | basic | 7 |
| `orc` | Orc | 120 | 1.1 | 18 | basic | 13 |
| `bandit` | Bandit | 90 | 1.8 | 20 | basic | 11 |
| `ghost` | Ghost | 80 | 0.8 | 25 | stealth | 12 |
| `viking` | Viking | 200 | 1.2 | 35 | basic | 14 |
| `samurai` | Samurai | 180 | 1.9 | 40 | basic | 12 |
| `drone` | Drone | 60 | 3 | 30 | basic | 8 |
| `troll` | Troll | 600 | 0.7 | 80 | heavy | 20 |
| `ent` | Ent | 800 | 0.5 | 100 | heavy | 22 |
| `gargoyle` | Gargoyle | 350 | 1.3 | 60 | armored | 16 |
| `sorcerer` | Sorcerer | 250 | 0.9 | 70 | basic | 15 |
| `shade` | Shade | 200 | 2 | 80 | stealth | 12 |
| `slime` | Slime | 500 | 0.6 | 50 | heavy | 18 |
| `yeti` | Yeti | 1000 | 0.8 | 120 | heavy | 24 |
| `magma_golem` | Magma Golem | 1500 | 0.5 | 200 | armored | 25 |
| `cyborg` | Cyborg | 900 | 1.6 | 150 | armored | 16 |
| `dark_knight` | Dark Knight | 2000 | 0.9 | 300 | armored | 22 |
| `tank` | Tank | 3500 | 0.4 | 500 | armored | 28 |
| `sneak` | Sneak | 70 | 2.5 | 25 | stealth | 12 |
| `knight` | Knight | 150 | 1 | 20 | armored | 12 |
| `assassin` | Assassin | 120 | 2.2 | 60 | stealth | 12 |
| `healer` | Healer | 100 | 1.2 | 40 | support | 14 |
| `wizard` | Wizard | 300 | 0.8 | 80 | support | 18 |
| `mech` | Mech | 400 | 0.4 | 100 | heavy | 16 |
| `mech-rider` | Mech Rider | 500 | 0.4 | 100 | heavy | 18 |
| `reinforced_mech` | H. Mech | 800 | 0.3 | 150 | armored | 20 |
| `reinforced_ninja` | Dark Ninja | 1200 | 1.5 | 200 | boss | 16 |
| `boss` | The Boss | 2000 | 0.5 | 500 | boss | 25 |
| `prince` | Prince | 10000 | 0.6 | 1000 | boss | 30 |
| `king` | The King | 50000 | 0.3 | 2000 | boss | 35 |
| `emperor` | Emperor | 1000000 | 0.2 | 10000 | boss | 40 |

## Wave Configuration

**Base Count:** 5

**Growth Rate:** 2

**Health Multiplier per Wave:** 0.2

**Base Bonus:** 20

**Meta Gold Base:** 50

**Meta Gold per Wave:** 10

### Spawn Rules by Wave Range

#### Waves 1-10

| Enemy | Weight |
|-------|--------|
| bat | 0.1 |
| skeleton | 0.2 |
| goblin | 0.3 |
| basic | 0.5 |
| guard | 1 |

#### Waves 11-25

| Enemy | Weight |
|-------|--------|
| bandit | 0.1 |
| orc | 0.2 |
| wizard | 0.3 |
| reinforced_mech | 0.4 |
| knight | 1 |

#### Waves 26-40

| Enemy | Weight |
|-------|--------|
| troll | 0.1 |
| drone | 0.2 |
| samurai | 0.3 |
| viking | 0.4 |
| ghost | 1 |

#### Waves 41-60

| Enemy | Weight |
|-------|--------|
| slime | 0.1 |
| shade | 0.2 |
| sorcerer | 0.3 |
| gargoyle | 0.4 |
| ent | 1 |

#### Waves 61plus

| Enemy | Weight |
|-------|--------|
| tank | 0.05 |
| dark_knight | 0.1 |
| cyborg | 0.2 |
| magma_golem | 0.3 |
| yeti | 1 |

### Boss Waves

| Wave | Boss |
|------|------|
| Wave 10 | prince |
| Wave 50 | king |
| Wave 100 | emperor |

---

*Last updated: 2025-12-10T23:30:38.156Z*
