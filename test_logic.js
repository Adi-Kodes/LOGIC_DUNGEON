import { getPuzzle } from './src/puzzles/puzzleData.js';
import LogicEvaluator from './src/logic/LogicEvaluator.js';

const p1 = getPuzzle('and_gate_01');
const p2 = getPuzzle('or_gate_02');

console.log("=== PUZZLE 1 (AND) ===");
const cases1 = [
    { P: false, Q: false },
    { P: true, Q: false },
    { P: false, Q: true },
    { P: true, Q: true }
];

for (const c of cases1) {
    const res = LogicEvaluator.evaluate(p1, c);
    console.log(`P=${c.P}, Q=${c.Q} -> ${res.result ? 'SUCCESS' : 'FAIL'} (${res.explanation.split('\n')[0]})`);
}

console.log("\n=== PUZZLE 2 (OR) ===");
const cases2 = [
    { P: false, Q: false },
    { P: true, Q: false },
    { P: false, Q: true },
    { P: true, Q: true }
];

for (const c of cases2) {
    const res = LogicEvaluator.evaluate(p2, c);
    console.log(`P=${c.P}, Q=${c.Q} -> ${res.result ? 'SUCCESS' : 'FAIL'} (${res.explanation.split('\n')[0]})`);
}
