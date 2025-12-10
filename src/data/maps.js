/**
 * Maps Configuration - 46 Maps with path coordinates and special mechanics
 * Extracted from the original monolith (lines 499-745)
 */

export const MAPS = {
    garden: {
        name: "Garden",
        bgColor: "#6ab04c",
        sceneryType: "forest",
        paths: [[
            { x: 0.06, y: 0.25 }, { x: 0.2, y: 0.25 }, { x: 0.2, y: 0.7 },
            { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.3 },
            { x: 0.8, y: 0.75 }, { x: 0.94, y: 0.75 }
        ]],
        waterZones: []
    },

    rainforest: {
        name: "Rainforest",
        bgColor: "#1a472a",
        sceneryType: "jungle",
        paths: [[
            { x: 0.05, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.4 },
            { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.2 }, { x: 0.7, y: 0.2 },
            { x: 0.7, y: 0.6 }, { x: 0.95, y: 0.6 }
        ]],
        waterZones: [[
            { x: 0, y: 0.45 }, { x: 1, y: 0.45 },
            { x: 1, y: 0.65 }, { x: 0, y: 0.65 }
        ]]
    },

    red_bridge: {
        name: "Red Bridge",
        bgColor: "#0f172a",
        sceneryType: "bridge",
        paths: [[
            { x: 0, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: [
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0.42 }, { x: 0, y: 0.42 }],
            [{ x: 0, y: 0.58 }, { x: 1, y: 0.58 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
        ]
    },

    city: {
        name: "City",
        bgColor: "#334155",
        sceneryType: "city",
        paths: [[
            { x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 }, { x: 0.3, y: 0.9 },
            { x: 0.3, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 },
            { x: 0.7, y: 0.9 }, { x: 0.7, y: 0.1 }, { x: 0.9, y: 0.1 },
            { x: 0.9, y: 0.9 }
        ]],
        waterZones: []
    },

    crossing_roads: {
        name: "Crossing Roads",
        bgColor: "#1e293b",
        sceneryType: "city",
        paths: [
            [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }],
            [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }]
        ],
        waterZones: []
    },

    volcano: {
        name: "Classic Volcano",
        bgColor: "#2a0a0a",
        sceneryType: "volcano",
        paths: [[
            { x: 0.5, y: 0 }, { x: 0.1, y: 0.2 }, { x: 0.1, y: 0.8 },
            { x: 0.9, y: 0.8 }, { x: 0.9, y: 0.2 }, { x: 0.5, y: 0 }
        ]],
        waterZones: [[
            { x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 },
            { x: 0.7, y: 0.7 }, { x: 0.3, y: 0.7 }
        ]]
    },

    cursed: {
        name: "Cursed Path",
        bgColor: "#2e1065",
        sceneryType: "magic",
        paths: [
            [{ x: 0, y: 0.5 }, { x: 0.4, y: 0.5 }],
            [{ x: 0.6, y: 0.5 }, { x: 1, y: 0.5 }]
        ],
        waterZones: [[
            { x: 0.4, y: 0 }, { x: 0.6, y: 0 },
            { x: 0.6, y: 1 }, { x: 0.4, y: 1 }
        ]],
        isCursed: true
    },

    graveyard: {
        name: "Graveyard",
        bgColor: "#020617",
        sceneryType: "castle",
        paths: [[
            { x: 0.1, y: 0.2 }, { x: 0.9, y: 0.2 }, { x: 0.9, y: 0.5 },
            { x: 0.1, y: 0.5 }, { x: 0.1, y: 0.8 }, { x: 0.9, y: 0.8 }
        ]],
        waterZones: [],
        isGraveyard: true
    },

    the_loop: {
        name: "The Loop",
        bgColor: "#312e81",
        sceneryType: "circles",
        paths: [[
            { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
            { x: 0.9, y: 0.9 }, { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.2 },
            { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.3, y: 0.8 },
            { x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.7, y: 0.7 },
            { x: 0.5, y: 0.5 }
        ]],
        waterZones: []
    },

    castle_doors: {
        name: "Castle Doors",
        bgColor: "#1c1917",
        sceneryType: "castle",
        paths: [
            [{ x: 0, y: 0.3 }, { x: 0.4, y: 0.3 }, { x: 0.4, y: 0.5 }, { x: 0.8, y: 0.5 }],
            [{ x: 0, y: 0.7 }, { x: 0.4, y: 0.7 }, { x: 0.4, y: 0.5 }, { x: 0.8, y: 0.5 }]
        ],
        waterZones: []
    },

    watersprouts: {
        name: "Water Sprouts",
        bgColor: "#0e7490",
        sceneryType: "ocean",
        paths: [[
            { x: 0.1, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.8 },
            { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.2 }, { x: 0.9, y: 0.2 },
            { x: 0.9, y: 0.9 }
        ]],
        waterZones: [[
            { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 0, y: 1 }
        ]]
    },

    rainbow_heights: {
        name: "Rainbow Heights",
        bgColor: "#fdf4ff",
        sceneryType: "rainbow",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.2, y: 0.2 }, { x: 0.4, y: 0.8 },
            { x: 0.6, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 1, y: 0.5 }
        ]],
        waterZones: []
    },

    stump: {
        name: "The Stump",
        bgColor: "#3e2723",
        sceneryType: "forest",
        paths: [[
            { x: 0.1, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.4 },
            { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.6 }, { x: 0.6, y: 0.6 },
            { x: 0.6, y: 0.4 }, { x: 0.7, y: 0.4 }, { x: 0.7, y: 0.8 },
            { x: 0.9, y: 0.8 }
        ]],
        waterZones: [[
            { x: 0.7, y: 0 }, { x: 1, y: 0 },
            { x: 0.3, y: 1 }, { x: 0, y: 1 }
        ]],
        specialFeature: { type: "stump", x: 0.5, y: 0.5, radius: 30 }
    },

    enchanted: {
        name: "Enchanted Grove",
        bgColor: "#115e59",
        sceneryType: "magic",
        paths: [
            [
                { x: 0.5, y: 0.05 }, { x: 0.5, y: 0.35 }, { x: 0.3, y: 0.5 },
                { x: 0.3, y: 0.7 }, { x: 0.5, y: 0.85 }, { x: 0.2, y: 0.85 },
                { x: 0.1, y: 0.95 }
            ],
            [
                { x: 0.5, y: 0.05 }, { x: 0.5, y: 0.35 }, { x: 0.7, y: 0.5 },
                { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.85 }, { x: 0.8, y: 0.85 },
                { x: 0.9, y: 0.95 }
            ]
        ],
        waterZones: [
            [{ x: 0.05, y: 0.1 }, { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.3 }, { x: 0.05, y: 0.3 }],
            [{ x: 0.8, y: 0.1 }, { x: 0.95, y: 0.1 }, { x: 0.95, y: 0.3 }, { x: 0.8, y: 0.3 }]
        ]
    },

    treeparadise: {
        name: "Tree Paradise",
        bgColor: "#14532d",
        sceneryType: "dense_forest",
        paths: [[
            { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.2 }, { x: 0.3, y: 0.2 },
            { x: 0.3, y: 0.8 }, { x: 0.5, y: 0.8 }, { x: 0.5, y: 0.2 },
            { x: 0.7, y: 0.2 }, { x: 0.7, y: 0.8 }, { x: 0.9, y: 0.8 },
            { x: 0.9, y: 0.1 }
        ]],
        waterZones: []
    },

    light_paradise: {
        name: "Light Paradise",
        bgColor: "#e0f2fe",
        sceneryType: "paradise",
        paths: [[
            { x: 0.5, y: 1 }, { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.2 },
            { x: 0.8, y: 0.2 }, { x: 0.5, y: 0.5 }
        ]],
        waterZones: []
    },

    four_circles: {
        name: "The 4 Circles",
        bgColor: "#84cc16",
        sceneryType: "circles",
        paths: [
            [
                { x: 0, y: 0.25 }, { x: 0.25, y: 0.25 }, { x: 0.25, y: 0.1 },
                { x: 0.1, y: 0.1 }, { x: 0.1, y: 0.4 }, { x: 0.25, y: 0.4 },
                { x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 },
                { x: 0.75, y: 0.9 }, { x: 0.9, y: 0.9 }, { x: 0.9, y: 0.6 },
                { x: 0.75, y: 0.6 }, { x: 0.75, y: 0.75 }
            ],
            [
                { x: 1, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.1 },
                { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.4 }, { x: 0.75, y: 0.4 },
                { x: 0.75, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.25, y: 0.75 },
                { x: 0.25, y: 0.9 }, { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.6 },
                { x: 0.25, y: 0.6 }, { x: 0.25, y: 0.75 }
            ]
        ],
        waterZones: []
    },

    staggered: {
        name: "Staggered",
        bgColor: "#475569",
        sceneryType: "rocky",
        paths: [[
            { x: 0, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.6 },
            { x: 0.4, y: 0.6 }, { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 },
            { x: 0.6, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0 }
        ]],
        waterZones: []
    },

    dark_castle: {
        name: "Dark Castle",
        bgColor: "#1c1917",
        sceneryType: "castle",
        paths: [[
            { x: 0.5, y: 1 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.8 },
            { x: 0.2, y: 0.6 }, { x: 0.8, y: 0.6 }, { x: 0.8, y: 0.4 },
            { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.1 }
        ]],
        waterZones: [
            [{ x: 0, y: 0.82 }, { x: 0.45, y: 0.82 }, { x: 0.45, y: 1 }, { x: 0, y: 1 }],
            [{ x: 0.55, y: 0.82 }, { x: 1, y: 0.82 }, { x: 1, y: 1 }, { x: 0.55, y: 1 }]
        ]
    },

    spiral: {
        name: "The Spiral",
        bgColor: "#312e81",
        sceneryType: "magic",
        paths: [[
            { x: 0, y: 0 }, { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.9 },
            { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.2 }, { x: 0.8, y: 0.2 },
            { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.3 },
            { x: 0.7, y: 0.3 }, { x: 0.7, y: 0.7 }, { x: 0.3, y: 0.7 },
            { x: 0.3, y: 0.4 }, { x: 0.5, y: 0.5 }
        ]],
        waterZones: []
    },

    covered_garden: {
        name: "Covered Garden",
        bgColor: "#064e3b",
        sceneryType: "forest",
        paths: [[
            { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
            { x: 0.9, y: 0.9 }, { x: 0.5, y: 0.9 }, { x: 0.5, y: 0.5 }
        ]],
        waterZones: [],
        isCovered: true
    },

    glass_layer: {
        name: "Glass Layer",
        bgColor: "#0891b2",
        sceneryType: "ocean",
        paths: [[
            { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }
        ]],
        waterZones: [[
            { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 0, y: 1 }
        ]],
        isGlassFloor: true
    },

    // === NEW MAPS (20 maps) ===

    desert_oasis: {
        name: "Desert Oasis",
        bgColor: "#eab308",
        sceneryType: "desert",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.2 },
            { x: 0.7, y: 0.2 }, { x: 0.7, y: 0.8 }, { x: 0.3, y: 0.8 },
            { x: 0.3, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: [[
            { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 },
            { x: 0.6, y: 0.6 }, { x: 0.4, y: 0.6 }
        ]]
    },

    frozen_tundra: {
        name: "Frozen Tundra",
        bgColor: "#eff6ff",
        sceneryType: "rocky",
        paths: [[
            { x: 0, y: 0 }, { x: 0.2, y: 0 }, { x: 0.2, y: 1 },
            { x: 0.4, y: 1 }, { x: 0.4, y: 0 }, { x: 0.6, y: 0 },
            { x: 0.6, y: 1 }, { x: 0.8, y: 1 }, { x: 0.8, y: 0 },
            { x: 1, y: 0 }
        ]],
        waterZones: []
    },

    lava_lake: {
        name: "Lava Lake",
        bgColor: "#7f1d1d",
        sceneryType: "volcano",
        paths: [[
            { x: 0.5, y: 0 }, { x: 0.5, y: 0.2 }, { x: 0.2, y: 0.2 },
            { x: 0.2, y: 0.8 }, { x: 0.8, y: 0.8 }, { x: 0.8, y: 0.2 },
            { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.5 }
        ]],
        waterZones: [[
            { x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 },
            { x: 0.7, y: 0.7 }, { x: 0.3, y: 0.7 }
        ]]
    },

    space_station: {
        name: "Space Station",
        bgColor: "#0f172a",
        sceneryType: "city",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.2 },
            { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 },
            { x: 0.2, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: []
    },

    cloud_kingdom: {
        name: "Cloud Kingdom",
        bgColor: "#bae6fd",
        sceneryType: "cloud",
        paths: [[
            { x: 0, y: 0.8 }, { x: 0.2, y: 0.2 }, { x: 0.4, y: 0.8 },
            { x: 0.6, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 1, y: 0.2 }
        ]],
        waterZones: []
    },

    circuit_board: {
        name: "Circuit Board",
        bgColor: "#064e3b",
        sceneryType: "city",
        paths: [[
            { x: 0, y: 0.1 }, { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.3 },
            { x: 0.1, y: 0.3 }, { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 },
            { x: 0.9, y: 0.7 }, { x: 0.1, y: 0.7 }, { x: 0.1, y: 0.9 },
            { x: 1, y: 0.9 }
        ]],
        waterZones: []
    },

    candy_land: {
        name: "Candy Land",
        bgColor: "#fce7f3",
        sceneryType: "rainbow",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.2 },
            { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 }, { x: 0.7, y: 0.8 },
            { x: 0.7, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: []
    },

    haunted_swamp: {
        name: "Haunted Swamp",
        bgColor: "#3f3f46",
        sceneryType: "dense_forest",
        paths: [[
            { x: 0, y: 0.2 }, { x: 0.2, y: 0.8 }, { x: 0.4, y: 0.2 },
            { x: 0.6, y: 0.8 }, { x: 0.8, y: 0.2 }, { x: 1, y: 0.8 }
        ]],
        waterZones: [[
            { x: 0, y: 0.4 }, { x: 1, y: 0.4 },
            { x: 1, y: 0.6 }, { x: 0, y: 0.6 }
        ]]
    },

    the_maze: {
        name: "The Maze",
        bgColor: "#334155",
        sceneryType: "city",
        paths: [[
            { x: 0, y: 0 }, { x: 0.1, y: 0 }, { x: 0.1, y: 0.9 },
            { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.1 }, { x: 0.3, y: 0.1 },
            { x: 0.3, y: 0.9 }, { x: 0.4, y: 0.9 }, { x: 0.4, y: 0.1 },
            { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 }, { x: 0.6, y: 0.9 },
            { x: 0.6, y: 0.1 }, { x: 0.7, y: 0.1 }, { x: 0.7, y: 0.9 },
            { x: 0.8, y: 0.9 }, { x: 0.8, y: 0.1 }, { x: 0.9, y: 0.1 },
            { x: 0.9, y: 0.9 }, { x: 1, y: 0.9 }
        ]],
        waterZones: []
    },

    double_cross: {
        name: "Double Cross",
        bgColor: "#475569",
        sceneryType: "city",
        paths: [
            [{ x: 0, y: 0 }, { x: 1, y: 1 }],
            [{ x: 0, y: 1 }, { x: 1, y: 0 }]
        ],
        waterZones: []
    },

    island_hopping: {
        name: "Island Hopping",
        bgColor: "#0e7490",
        sceneryType: "ocean",
        paths: [[
            { x: 0, y: 0.2 }, { x: 0.2, y: 0.2 }, { x: 0.2, y: 0.8 },
            { x: 0.5, y: 0.8 }, { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.2 },
            { x: 0.8, y: 0.8 }, { x: 1, y: 0.8 }
        ]],
        waterZones: [[
            { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 0, y: 1 }
        ]]
    },

    the_canyon: {
        name: "The Canyon",
        bgColor: "#78350f",
        sceneryType: "rocky",
        paths: [[
            { x: 0.5, y: 0 }, { x: 0.5, y: 1 }
        ]],
        waterZones: [
            [{ x: 0, y: 0 }, { x: 0.4, y: 0 }, { x: 0.4, y: 1 }, { x: 0, y: 1 }],
            [{ x: 0.6, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0.6, y: 1 }]
        ]
    },

    zen_garden: {
        name: "Zen Garden",
        bgColor: "#f5f5f4",
        sceneryType: "rocky",
        paths: [[
            { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.5 }, { x: 0.5, y: 0.9 },
            { x: 0.1, y: 0.5 }, { x: 0.5, y: 0.1 }
        ]],
        waterZones: []
    },

    industrial: {
        name: "Industrial",
        bgColor: "#52525b",
        sceneryType: "city",
        paths: [[
            { x: 0, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: [
            [{ x: 0, y: 0.2 }, { x: 1, y: 0.2 }, { x: 1, y: 0.3 }, { x: 0, y: 0.3 }],
            [{ x: 0, y: 0.7 }, { x: 1, y: 0.7 }, { x: 1, y: 0.8 }, { x: 0, y: 0.8 }]
        ]
    },

    crystal_cavern: {
        name: "Crystal Cavern",
        bgColor: "#312e81",
        sceneryType: "magic",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.2, y: 0.2 }, { x: 0.4, y: 0.5 },
            { x: 0.6, y: 0.8 }, { x: 0.8, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: []
    },

    beehive: {
        name: "Beehive",
        bgColor: "#fef08a",
        sceneryType: "honey",
        paths: [[
            { x: 0.1, y: 0.5 }, { x: 0.2, y: 0.3 }, { x: 0.3, y: 0.5 },
            { x: 0.4, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.6, y: 0.3 },
            { x: 0.7, y: 0.5 }, { x: 0.8, y: 0.7 }, { x: 0.9, y: 0.5 }
        ]],
        waterZones: []
    },

    the_void: {
        name: "The Void",
        bgColor: "#000000",
        sceneryType: "magic",
        paths: [[
            { x: 0, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.2 },
            { x: 0.7, y: 0.2 }, { x: 0.7, y: 0.5 }, { x: 1, y: 0.5 }
        ]],
        waterZones: [[
            { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 1, y: 1 }, { x: 0, y: 1 }
        ]]
    },

    snake_pit: {
        name: "Snake Pit",
        bgColor: "#365314",
        sceneryType: "jungle",
        paths: [[
            { x: 0.5, y: 0 }, { x: 0.6, y: 0.1 }, { x: 0.4, y: 0.2 },
            { x: 0.6, y: 0.3 }, { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.5 },
            { x: 0.4, y: 0.6 }, { x: 0.6, y: 0.7 }, { x: 0.4, y: 0.8 },
            { x: 0.5, y: 1 }
        ]],
        waterZones: []
    },

    pyramid: {
        name: "Pyramid",
        bgColor: "#ca8a04",
        sceneryType: "desert",
        paths: [[
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 },
            { x: 0, y: 1 }, { x: 0, y: 0.2 }, { x: 0.8, y: 0.2 },
            { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.4 },
            { x: 0.5, y: 0.5 }
        ]],
        waterZones: []
    },

    checkered: {
        name: "Checkered",
        bgColor: "#171717",
        sceneryType: "city",
        paths: [[
            { x: 0, y: 0 }, { x: 1, y: 1 }
        ]],
        waterZones: []
    }
};
