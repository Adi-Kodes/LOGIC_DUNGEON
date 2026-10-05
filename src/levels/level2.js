/**
 * Level 2 — The Elemental Forge
 *
 * 3-variable puzzle: (P ∨ Q) ∧ ¬R
 *
 * Layout:
 *   P = Flame Rune (top-left area)
 *   Q = Frost Rune (center-right area)
 *   R = Shadow Rune (bottom-left area, must stay OFF)
 */

export const level2Data = {
    width: 1200,
    height: 900,

    intro: {
        levelNumber: 2,
        title: 'THE ELEMENTAL FORGE',
        story: 'The Elemental Forge accepts the warmth of Flame or the\ncold of Frost, but the Shadow Rune must remain dormant.',
        objective: 'Activate Flame or Frost. Keep Shadow dormant.'
    },

    playerSpawn: { x: 150, y: 150 },

    exitArea: { x: 1050, y: 740, width: 80, height: 80 },

    enemies: [
        { x: 500, y: 500 },
        { x: 700, y: 350 }
    ],

    bulbs: [
        { variable: 'P', name: 'Flame Rune', x: 250, y: 300, initialValue: false },
        { variable: 'Q', name: 'Frost Rune', x: 700, y: 550, initialValue: false },
        { variable: 'R', name: 'Shadow Rune', x: 250, y: 650, initialValue: false }
    ],

    submitAltar: { x: 500, y: 780 },

    gate: { x: 1000, y: 740, width: 50, height: 100 },

    puzzleId: 'elemental_forge_02',

    walls: [
        // Top wall
        { x: 0, y: 0, width: 1200, height: 30 },
        // Bottom wall
        { x: 0, y: 870, width: 1200, height: 30 },
        // Left wall
        { x: 0, y: 0, width: 30, height: 900 },
        // Right wall
        { x: 1170, y: 0, width: 30, height: 900 },

        // Divider creating corridor to gate
        { x: 900, y: 0, width: 30, height: 600 },
        // Lower divider with gap for gate
        { x: 900, y: 700, width: 30, height: 200 },

        // Obstacles
        { x: 400, y: 250, width: 180, height: 30 },
        { x: 400, y: 500, width: 180, height: 30 }
    ]
};
