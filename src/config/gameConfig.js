import Phaser from 'phaser';
import MainMenuScene from '../scenes/MainMenuScene.js';
import GameScene from '../scenes/GameScene.js';
import GameOverScene from '../scenes/GameOverScene.js';
import RoomCompleteScene from '../scenes/RoomCompleteScene.js';

export const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        MainMenuScene,
        GameScene,
        GameOverScene,
        RoomCompleteScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
