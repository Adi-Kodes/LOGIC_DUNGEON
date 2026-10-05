import Phaser from 'phaser';

export default class RoomCompleteScene extends Phaser.Scene {
    constructor() {
        super('RoomCompleteScene');
    }

    init(data) {
        this.level = data.level || 1;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, height / 2 - 100, 'ROOM COMPLETE', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const isLastLevel = this.level >= 2;
        const buttonText = isLastLevel ? 'MAIN MENU' : 'NEXT ROOM';

        const returnButton = this.add.text(width / 2, height / 2 + 50, buttonText, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5).setInteractive();

        returnButton.on('pointerover', () => {
            returnButton.setFill('#0f0');
        });

        returnButton.on('pointerout', () => {
            returnButton.setFill('#ffffff');
        });

        returnButton.on('pointerdown', () => {
            if (isLastLevel) {
                this.scene.start('MainMenuScene');
            } else {
                this.scene.start('GameScene', { level: this.level + 1 });
            }
        });
    }
}
