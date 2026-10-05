/**
 * Level 1 — The AND Gate
 *
 * A contained puzzle room where the player must set P and Q to TRUE
 * to unlock the exit gate.
 *
 * Layout sketch:
 *
 *       ┌──────────────────────────────────────────┐
 *       │                                          │
 *       │    [PLAYER]                              │
 *       │                                          │
 *       │                                          │
 *       │    [P BULB]         [Q BULB]             │
 *       │                                          │
 *       │                                          │
 *       │              [ENEMY]                     │
 *       │                                          │
 *       │                                          │
 *       │    [SUBMIT ALTAR]           [GATE/EXIT]  │
 *       │                                          │
 *       └──────────────────────────────────────────┘
 */

export const level1Data = {
    width: 1200,
    height: 900,

    intro: {
        levelNumber: 1,
        title: "THE ANCIENT GATE",
        story: "Two magical seals protect the ancient gate.",
        objective: "Awaken both the Sun Seal and Moon Seal."
    },

    playerSpawn: { x: 150, y: 150 },

    // The exit is behind the gate — player cannot reach it until gate opens
    exitArea: { x: 1050, y: 740, width: 80, height: 80 },

    enemies: [
        { x: 600, y: 550 }
    ],

    // Only P and Q for the AND puzzle (R is not needed for this puzzle)
    bulbs: [
        { variable: 'P', x: 250, y: 420, initialValue: false },
        { variable: 'Q', x: 700, y: 420, initialValue: false }
    ],

    // Submit altar — the player walks here and presses E to submit
    submitAltar: { x: 250, y: 740 },

    // Gate — blocks exit until puzzle is solved
    gate: { x: 1000, y: 740, width: 50, height: 100 },

    // The puzzle for this level
    puzzleId: 'and_gate_01',

    walls: [
        // Top wall
        { x: 0, y: 0, width: 1200, height: 30 },
        // Bottom wall
        { x: 0, y: 870, width: 1200, height: 30 },
        // Left wall
        { x: 0, y: 0, width: 30, height: 900 },
        // Right wall
        { x: 1170, y: 0, width: 30, height: 900 },

        // Internal walls to create some structure
        // Divider creating a corridor to the gate area
        { x: 900, y: 0, width: 30, height: 600 },
        // Lower divider with gap for gate
        { x: 900, y: 700, width: 30, height: 200 }
    ]
};
