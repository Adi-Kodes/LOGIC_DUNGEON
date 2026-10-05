import Phaser from 'phaser';

/**
 * PuzzlePanel — an in-world UI panel that displays the current logic challenge.
 *
 * Shows:
 *   - Puzzle title
 *   - Challenge question
 *   - Current variable states (reads from bulb states)
 *   - Feedback after submission (correct / incorrect)
 *
 * The panel is rendered as a Phaser container fixed to the camera (scrollFactor 0)
 * and positioned on the left side of the screen.
 */
export default class PuzzlePanel {
    constructor(scene, puzzle) {
        this.scene = scene;
        this.puzzle = puzzle;

        this._feedbackTimer = null;

        const cam = scene.cameras.main;
        const panelX = 10; // TOP-LEFT
        const panelY = 90; // Just below the HUD

        this.container = scene.add.container(panelX, panelY);
        this.container.setScrollFactor(0);
        this.container.setDepth(100);

        // Panel background
        this.bg = scene.add.graphics();
        this._drawBackground(300, 160);
        this.container.add(this.bg);

        // Title
        this.titleText = scene.add.text(10, 8, puzzle.title.toUpperCase(), {
            fontSize: '13px',
            fill: '#d4af37', // Gold/Magical
            fontFamily: 'monospace',
            fontStyle: 'bold'
        });
        this.container.add(this.titleText);

        // Separator line
        const sep = scene.add.graphics();
        sep.lineStyle(1, 0x666666, 0.5);
        sep.moveTo(10, 24);
        sep.lineTo(290, 24);
        sep.strokePath();
        this.container.add(sep);

        // Question text
        this.questionText = scene.add.text(10, 30, puzzle.question, {
            fontSize: '11px',
            fill: '#cccccc',
            fontFamily: 'monospace',
            wordWrap: { width: 280 },
            lineSpacing: 2
        });
        this.container.add(this.questionText);

        // Calculate dynamic Y for states
        const statesY = 30 + this.questionText.height + 8;

        // Variable states display
        this.statesText = scene.add.text(10, statesY, '', {
            fontSize: '11px',
            fill: '#ffffff',
            fontFamily: 'monospace',
            lineSpacing: 2
        });
        this.container.add(this.statesText);

        // Feedback text (shown after submission)
        this.feedbackText = scene.add.text(10, statesY + 30, '', {
            fontSize: '11px',
            fill: '#88ff88',
            fontFamily: 'monospace',
            wordWrap: { width: 280 },
            lineSpacing: 2
        });
        this.container.add(this.feedbackText);
        
        // Initial resize based on dynamic heights
        this._resizePanel();
    }

    _resizePanel() {
        const totalHeight = Math.max(120, this.feedbackText.y + this.feedbackText.height + 10);
        this._drawBackground(300, totalHeight);
    }

    _drawBackground(width, height) {
        this.bg.clear();
        // Dark magical stone base - 75% opacity for see-through
        this.bg.fillStyle(0x111115, 0.75);
        this.bg.fillRect(0, 0, width, height);
        
        // Outer thin border
        this.bg.lineStyle(2, 0x22222a, 0.8);
        this.bg.strokeRect(1, 1, width - 2, height - 2);
        
        // Inner pixel border
        this.bg.lineStyle(1, 0x663388, 0.6);
        this.bg.strokeRect(4, 4, width - 8, height - 8);
    }

    updateStates(bulbStates) {
        const lines = this.puzzle.variables.map(v => {
            const val = bulbStates[v];
            const display = val ? 'ON' : 'OFF';
            return `${v}: ${display}`;
        });
        this.statesText.setText('Current:\n' + lines.join('\n'));
        this.feedbackText.setY(this.statesText.y + this.statesText.height + 8);
        this._resizePanel();
    }

    showFeedback(correct, explanation) {
        if (this._feedbackTimer) {
            this._feedbackTimer.remove();
            this._feedbackTimer = null;
        }

        if (correct) {
            this.feedbackText.setFill('#00ff88');
            // Hide the question text when successful to make it even more compact
            this.questionText.setAlpha(0);
            this.statesText.setAlpha(0);
            this.feedbackText.setY(30);
            this.feedbackText.setText(explanation);
        } else {
            this.feedbackText.setFill('#ff6666');
            this.feedbackText.setText(explanation);
        }

        this._resizePanel();

        // Clear incorrect feedback after 5 seconds
        if (!correct) {
            this._feedbackTimer = this.scene.time.delayedCall(5000, () => {
                this.feedbackText.setText('');
                this._resizePanel();
            });
        }
    }
}
