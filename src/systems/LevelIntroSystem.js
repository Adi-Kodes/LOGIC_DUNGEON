import Phaser from 'phaser';

export default class LevelIntroSystem {
    constructor(scene, introData, onComplete) {
        this.scene = scene;
        this.introData = introData;
        this.onComplete = onComplete;
        
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.container = scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(2000); // Topmost

        // Black overlay
        this.overlay = scene.add.graphics();
        this.overlay.fillStyle(0x000000, 1);
        this.overlay.fillRect(0, 0, width, height);
        this.container.add(this.overlay);

        // Texts
        this.levelText = scene.add.text(centerX, centerY - 60, `LEVEL ${introData.levelNumber || ''}`, {
            fontSize: '20px', fill: '#888888', fontFamily: 'monospace'
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(this.levelText);

        this.titleText = scene.add.text(centerX, centerY - 20, introData.title || '', {
            fontSize: '32px', fill: '#d4af37', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(this.titleText);

        this.storyText = scene.add.text(centerX, centerY + 30, introData.story || '', {
            fontSize: '14px', fill: '#cccccc', fontFamily: 'monospace', align: 'center', wordWrap: { width: 600 }
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(this.storyText);

        this.objectiveText = scene.add.text(centerX, height - 100, `OBJECTIVE: ${introData.objective || ''}`, {
            fontSize: '18px', fill: '#88ff88', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(this.objectiveText);
    }

    start() {
        if (!this.introData) {
            if (this.onComplete) this.onComplete();
            return;
        }

        const t = this.scene.tweens;

        t.add({
            targets: [this.levelText, this.titleText],
            alpha: 1, duration: 600,
            onComplete: () => {
                t.add({
                    targets: this.storyText,
                    alpha: 1, duration: 600,
                    onComplete: () => {
                        // Reveal dungeon slightly
                        t.add({
                            targets: this.overlay,
                            alpha: 0.65, duration: 600,
                            onComplete: () => {
                                t.add({
                                    targets: this.objectiveText,
                                    alpha: 1, duration: 600,
                                    onComplete: () => {
                                        this.scene.time.delayedCall(1500, () => {
                                            t.add({
                                                targets: this.container,
                                                alpha: 0, duration: 800,
                                                onComplete: () => {
                                                    this.container.destroy();
                                                    if (this.onComplete) this.onComplete();
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}
