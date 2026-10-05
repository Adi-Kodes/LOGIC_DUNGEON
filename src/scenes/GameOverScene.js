import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const restartButton = this.add.text(width / 2, height / 2 + 50, 'RESTART', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerover', () => {
            restartButton.setFill('#0f0');
        });

        restartButton.on('pointerout', () => {
            restartButton.setFill('#ffffff');
        });

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
