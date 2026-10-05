/**
 * LogicEvaluator — expression-based evaluator for propositional logic.
 *
 * Supports: AND, OR, NOT, XOR, IMPLIES (→), BICONDITIONAL (↔)
 *
 * Expressions are defined as nested objects (AST nodes):
 *   { op: 'AND', left: ..., right: ... }
 *   { op: 'NOT', operand: ... }
 *   { op: 'VAR', name: 'P' }
 *
 * Usage:
 *   const result = LogicEvaluator.evaluate(puzzle, { P: true, Q: false, R: true });
 *   // result → { result: boolean, explanation: string, steps: [...] }
 */
const LogicEvaluator = {

    /**
     * Evaluate a puzzle expression against variable assignments.
     * @param {object} puzzle - must have { expression, variables }
     * @param {object} bulbStates - e.g. { P: true, Q: false, R: true }
     * @returns {{ result: boolean, explanation: string, steps: string[] }}
     */
    evaluate(puzzle, bulbStates) {
        // Normalise bulbStates to plain object of booleans
        const vars = {};
        for (const v of puzzle.variables) {
            if (bulbStates instanceof Map) {
                vars[v] = !!bulbStates.get(v);
            } else {
                vars[v] = !!bulbStates[v];
            }
        }

        // Legacy support: if puzzle uses simple 'operation' string
        if (puzzle.operation && !puzzle.expression) {
            return this._evaluateLegacy(puzzle, vars);
        }

        const steps = [];
        const result = this._eval(puzzle.expression, vars, steps);

        // Build explanation
        const varLines = puzzle.variables.map(v =>
            `${v} = ${vars[v] ? 'TRUE' : 'FALSE'}`
        ).join('\n');

        const stepsText = steps.map((s, i) =>
            `Step ${i + 1}: ${s}`
        ).join('\n');

        let explanation;
        if (result) {
            explanation = `${varLines}\n\n${stepsText}\n\nRESULT: TRUE\n${puzzle.successMessage || 'Correct! The gate opens.'}`;
        } else {
            explanation = `${varLines}\n\n${stepsText}\n\nRESULT: FALSE\n${puzzle.failMessage || 'The condition is not satisfied.'}`;
        }

        return { result, explanation, steps };
    },

    /**
     * Recursively evaluate an expression AST node.
     * Records each intermediate step in the steps array.
     */
    _eval(node, vars, steps) {
        if (!node) return false;

        switch (node.op) {
            case 'VAR': {
                return !!vars[node.name];
            }

            case 'NOT': {
                const val = this._eval(node.operand, vars, steps);
                const result = !val;
                steps.push(`¬${this._nodeStr(node.operand, vars)} = ${this._boolStr(result)}`);
                return result;
            }

            case 'AND': {
                const left = this._eval(node.left, vars, steps);
                const right = this._eval(node.right, vars, steps);
                const result = left && right;
                steps.push(`${this._boolStr(left)} ∧ ${this._boolStr(right)} = ${this._boolStr(result)}`);
                return result;
            }

            case 'OR': {
                const left = this._eval(node.left, vars, steps);
                const right = this._eval(node.right, vars, steps);
                const result = left || right;
                steps.push(`${this._boolStr(left)} ∨ ${this._boolStr(right)} = ${this._boolStr(result)}`);
                return result;
            }

            case 'XOR': {
                const left = this._eval(node.left, vars, steps);
                const right = this._eval(node.right, vars, steps);
                const result = left !== right;
                steps.push(`${this._boolStr(left)} ⊕ ${this._boolStr(right)} = ${this._boolStr(result)}`);
                return result;
            }

            case 'IMPLIES': {
                const left = this._eval(node.left, vars, steps);
                const right = this._eval(node.right, vars, steps);
                const result = !left || right;
                steps.push(`${this._boolStr(left)} → ${this._boolStr(right)} = ${this._boolStr(result)}`);
                return result;
            }

            case 'BICONDITIONAL': {
                const left = this._eval(node.left, vars, steps);
                const right = this._eval(node.right, vars, steps);
                const result = left === right;
                steps.push(`${this._boolStr(left)} ↔ ${this._boolStr(right)} = ${this._boolStr(result)}`);
                return result;
            }

            default:
                steps.push(`Unknown operation: ${node.op}`);
                return false;
        }
    },

    /** Convert boolean to display string */
    _boolStr(val) {
        return val ? 'TRUE' : 'FALSE';
    },

    /** Get a short string representation of a node for step display */
    _nodeStr(node, vars) {
        if (node.op === 'VAR') return node.name;
        if (node.op === 'NOT') return `¬${this._nodeStr(node.operand, vars)}`;
        return '(...)';
    },

    /**
     * Generate a complete truth table for an expression.
     * @param {object} puzzle - must have { expression, variables }
     * @returns {Array<{assignment: object, result: boolean}>}
     */
    generateTruthTable(puzzle) {
        const { variables, expression } = puzzle;
        const rows = [];
        const n = variables.length;
        const total = Math.pow(2, n);

        for (let i = 0; i < total; i++) {
            const assignment = {};
            for (let j = 0; j < n; j++) {
                assignment[variables[j]] = !!(i & (1 << (n - 1 - j)));
            }
            const steps = [];
            const result = this._eval(expression, assignment, steps);
            rows.push({ assignment, result });
        }

        return rows;
    },

    /**
     * Legacy evaluator for puzzles using simple 'operation' field.
     * Preserves backward compat with Level 1 AND puzzle.
     */
    _evaluateLegacy(puzzle, vars) {
        const { variables, operation } = puzzle;
        const values = variables.map(v => vars[v]);

        switch (operation) {
            case 'AND': {
                const result = values.every(v => v === true);
                let explanation;
                if (result) {
                    explanation = `Correct! Both seals are active.\nLogical condition: P ∧ Q = TRUE`;
                } else {
                    const falseVars = variables.filter((v, i) => !values[i]);
                    explanation = `AND requires ALL conditions to be TRUE.\n${falseVars.join(', ')} ${falseVars.length === 1 ? 'is' : 'are'} still FALSE.`;
                }
                return { result, explanation, steps: [] };
            }

            case 'OR': {
                const result = values.some(v => v === true);
                let explanation;
                if (result) {
                    explanation = `Correct! At least one rune is awakened.\nLogical condition: P ∨ Q = TRUE\nThe ancient passage opens.`;
                } else {
                    explanation = `Not enough power.\nActivate at least one rune.`;
                }
                return { result, explanation, steps: [] };
            }

            default:
                return { result: false, explanation: `Unknown operation: ${operation}`, steps: [] };
        }
    }
};

export default LogicEvaluator;
