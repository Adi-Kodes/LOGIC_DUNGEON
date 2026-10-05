import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, height / 2 - 100, 'LOGIC DUNGEON', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const startButton = this.add.text(width / 2, height / 2 + 50, 'START GAME', {
            fontSize: '32px',
            fill: '#0f0',
            fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerover', () => {
            startButton.setFill('#ff0');
        });

        startButton.on('pointerout', () => {
            startButton.setFill('#0f0');
        });

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
