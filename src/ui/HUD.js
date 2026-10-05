export default class HUD {
    constructor(scene) {
        this.scene = scene;
        const width = scene.cameras.main.width;

        // Container to keep UI fixed to screen
        this.container = scene.add.container(0, 0);
        this.container.setScrollFactor(0); // This makes it a UI overlay!

        // Background for readability (pixel RPG style)
        const bg = scene.add.graphics();
        bg.fillStyle(0x0a0a0e, 0.85);
        bg.fillRect(0, 0, width, 80);
        bg.lineStyle(2, 0x443355, 1);
        bg.strokeRect(0, 0, width, 80);
        this.container.add(bg);

        // Dungeon Level Text
        this.levelText = scene.add.text(20, 15, 'DUNGEON 1\n────────────────', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        });
        this.container.add(this.levelText);

        // Objective Text
        this.objectiveText = scene.add.text(width / 2, 15, 'OBJECTIVE\nActivate both seals', {
            fontSize: '14px',
            fill: '#dddddd',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5, 0);
        this.container.add(this.objectiveText);

        // Health Text
        this.healthText = scene.add.text(width - 20, 15, '', {
            fontSize: '16px',
            fill: '#ff3355',
            fontFamily: 'monospace'
        }).setOrigin(1, 0);
        this.container.add(this.healthText);

        // Bulb state display (Phase 2A)
        this.bulbStateText = scene.add.text(20, 50, '', {
            fontSize: '14px',
            fill: '#ffaa00',
            fontFamily: 'monospace'
        });
        this.container.add(this.bulbStateText);

        // Interaction hint
        this.interactHint = scene.add.text(width / 2, 55, '', {
            fontSize: '12px',
            fill: '#88ff88',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5, 0);
        this.container.add(this.interactHint);
    }

    updateHealth(health) {
        let hearts = '';
        for (let i = 0; i < health; i++) {
            hearts += '♥ ';
        }
        this.healthText.setText('HEALTH ' + hearts);
    }

    /**
     * Update the bulb state display.
     * @param {Array<{variable: string, value: boolean}>} bulbStates
     */
    updateBulbStates(bulbStates) {
        if (!bulbStates || bulbStates.length === 0) {
            this.bulbStateText.setText('');
            return;
        }
        const parts = bulbStates.map(b => `${b.variable}: ${b.value ? 'TRUE' : 'FALSE'}`);
        this.bulbStateText.setText(parts.join('   '));
    }

    /**
     * Show or hide the interaction hint near a bulb.
     * @param {string} text
     */
    setInteractHint(text) {
        this.interactHint.setText(text);
    }
}
