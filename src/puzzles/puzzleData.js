/**
 * Puzzle definitions for Logic Dungeon.
 *
 * Each puzzle uses an expression tree (AST) for dynamic evaluation.
 * Node types:
 *   { op: 'VAR', name: 'P' }
 *   { op: 'NOT', operand: node }
 *   { op: 'AND'|'OR'|'XOR'|'IMPLIES'|'BICONDITIONAL', left: node, right: node }
 */

// Helper constructors for readability
const V = (name) => ({ op: 'VAR', name });
const NOT = (operand) => ({ op: 'NOT', operand });
const AND = (left, right) => ({ op: 'AND', left, right });
const OR = (left, right) => ({ op: 'OR', left, right });
const XOR = (left, right) => ({ op: 'XOR', left, right });
const IMPLIES = (left, right) => ({ op: 'IMPLIES', left, right });
const BICOND = (left, right) => ({ op: 'BICONDITIONAL', left, right });

export const puzzles = {

    // ── LEVEL 1: Tutorial AND ────────────────────────────
    and_gate_01: {
        id: 'and_gate_01',
        title: 'The Ancient Gate',
        question: 'Both seals must be awakened to open the gate.',
        expressionLabel: 'P ∧ Q',
        variables: ['P', 'Q'],
        operation: 'AND', // Legacy field for backward compat
        variableNames: { P: 'Sun Seal', Q: 'Moon Seal' },
        successMessage: 'Correct! Both seals are active.',
        failMessage: 'AND requires ALL conditions to be TRUE.',
        hints: [
            'Both seals must be activated.',
            'P AND Q means both must be TRUE.'
        ]
    },

    // ── LEVEL 2: (P ∨ Q) ∧ ¬R ───────────────────────────
    elemental_forge_02: {
        id: 'elemental_forge_02',
        title: 'The Elemental Forge',
        question: 'The forge accepts warmth or cold,\nbut the Shadow Rune must stay dormant.',
        expressionLabel: '(P ∨ Q) ∧ ¬R',
        variables: ['P', 'Q', 'R'],
        expression: AND(OR(V('P'), V('Q')), NOT(V('R'))),
        variableNames: { P: 'Flame Rune', Q: 'Frost Rune', R: 'Shadow Rune' },
        successMessage: 'Correct! The forge ignites.',
        failMessage: 'The forge remains cold.',
        hints: [
            'Break it into two parts: (P ∨ Q) and ¬R.',
            'At least one of Flame or Frost must be ON.',
            '¬R means Shadow must be OFF.'
        ]
    },

    // ── LEVEL 3: (P → Q) ∧ ¬R ───────────────────────────
    oath_guardian_03: {
        id: 'oath_guardian_03',
        title: 'The Oath of the Guardian',
        question: 'The Guardian Key demands the Sacred Bell.\nThe Shadow Curse must remain absent.',
        expressionLabel: '(P → Q) ∧ ¬R',
        variables: ['P', 'Q', 'R'],
        expression: AND(IMPLIES(V('P'), V('Q')), NOT(V('R'))),
        variableNames: { P: 'Guardian Key', Q: 'Sacred Bell', R: 'Shadow Curse' },
        successMessage: 'The oath is fulfilled.',
        failMessage: 'The oath is broken.',
        hints: [
            'P → Q is FALSE only when P is TRUE and Q is FALSE.',
            'If the Key is active, the Bell must also be active.',
            'The Shadow Curse must remain OFF.'
        ]
    },

    // ── LEVEL 4: (P ↔ Q) ∧ ¬R ───────────────────────────
    mirror_sanctum_04: {
        id: 'mirror_sanctum_04',
        title: 'The Mirror Sanctum',
        question: 'The Moon Seal and Crystal Heart must\nshare the same state. The Shadow Mark\nmust remain absent.',
        expressionLabel: '(P ↔ Q) ∧ ¬R',
        variables: ['P', 'Q', 'R'],
        expression: AND(BICOND(V('P'), V('Q')), NOT(V('R'))),
        variableNames: { P: 'Moon Seal', Q: 'Crystal Heart', R: 'Shadow Mark' },
        successMessage: 'The mirrors align. The sanctum opens.',
        failMessage: 'The mirrors reject your offering.',
        hints: [
            'P ↔ Q means both must have the SAME value.',
            'Either both ON or both OFF satisfies P ↔ Q.',
            'The Shadow Mark must remain OFF.'
        ]
    },

    // ── LEVEL 5: (P ⊕ Q) ∨ (¬P ∧ R) ────────────────────
    three_way_trial_05: {
        id: 'three_way_trial_05',
        title: 'The Three-Way Trial',
        question: 'Exactly one of Flame or Frost must burn,\nunless the Flame is dormant and Thunder\nstrikes.',
        expressionLabel: '(P ⊕ Q) ∨ (¬P ∧ R)',
        variables: ['P', 'Q', 'R'],
        expression: OR(XOR(V('P'), V('Q')), AND(NOT(V('P')), V('R'))),
        variableNames: { P: 'Flame Rune', Q: 'Frost Rune', R: 'Thunder Rune' },
        successMessage: 'The trial is passed.',
        failMessage: 'The trial rejects you.',
        hints: [
            'P ⊕ Q means EXACTLY ONE must be TRUE.',
            '¬P ∧ R means Flame OFF and Thunder ON.',
            'The whole expression uses OR between the two parts.'
        ]
    },

    // ── LEVEL 6: (P ∧ (Q → ¬R)) ↔ (¬P ∨ (Q ∧ ¬R)) ────
    archon_seal_06: {
        id: 'archon_seal_06',
        title: "The Archon's Seal",
        question: 'The seal evaluates a deep equivalence\nbetween two ancient conditions.',
        expressionLabel: '(P ∧ (Q → ¬R)) ↔ (¬P ∨ (Q ∧ ¬R))',
        variables: ['P', 'Q', 'R'],
        expression: BICOND(
            AND(V('P'), IMPLIES(V('Q'), NOT(V('R')))),
            OR(NOT(V('P')), AND(V('Q'), NOT(V('R'))))
        ),
        variableNames: { P: 'Ancient Key', Q: 'Guardian Rune', R: 'Shadow Curse' },
        successMessage: "The Archon's seal shatters.",
        failMessage: 'The seal holds firm.',
        hints: [
            'Break it into left and right sides of ↔.',
            'Left: P ∧ (Q → ¬R). Right: ¬P ∨ (Q ∧ ¬R).',
            'Both sides must have the SAME truth value.'
        ]
    },

    // ── FINAL: ((P ∧ ¬Q) → R) ↔ ((P ⊕ R) ∨ Q) ─────────
    final_challenge_07: {
        id: 'final_challenge_07',
        title: 'The Final Convergence',
        question: 'All forces must align in perfect\nlogical harmony to break the\nfinal seal.',
        expressionLabel: '((P ∧ ¬Q) → R) ↔ ((P ⊕ R) ∨ Q)',
        variables: ['P', 'Q', 'R'],
        expression: BICOND(
            IMPLIES(AND(V('P'), NOT(V('Q'))), V('R')),
            OR(XOR(V('P'), V('R')), V('Q'))
        ),
        variableNames: { P: 'Flame Rune', Q: 'Frost Rune', R: 'Thunder Rune' },
        successMessage: 'The dungeon is conquered.',
        failMessage: 'The convergence fails.',
        hints: [
            'Left side: (P ∧ ¬Q) → R',
            'Right side: (P ⊕ R) ∨ Q',
            'Both sides must evaluate to the same value (↔).'
        ]
    }
};

/**
 * Get a puzzle by its ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getPuzzle(id) {
    return puzzles[id] || null;
}
