import Phaser from 'phaser';
import { createPixelTexture } from '../utils/PixelArt.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const palette = {
            'x': 0x0a0a0a,
            'd': 0x1a1a1a,
            'm': 0x3a3a3a,
            'f': 0xffdd00, // bright fire
            'o': 0xff6600, // orange fire
            'r': 0xcc1100, // dark red
            'w': 0xffffff  // weapon glow
        };
        const spriteData = [
            "......roor......",
            ".....rfofr......",
            "....xrooorx.....",
            "...xxxdmdxxx....",
            "..xddxmmmxddx...",
            ".xdddxdmdxdddx.",
            ".xdd..xdx..xwx.",
            ".xd...xmx..xwx.",
            "......xdx..xwx.",
            ".....xx.xx.xwx.",
            ".....xdxxdxxwx.",
            ".....xdxxdx.x..",
            ".....xxx.xx.....",
            "................"
        ];
        createPixelTexture(scene, 'enemyTexture', palette, spriteData, 3);
        
        super(scene, x, y, 'enemyTexture');

        // Add subtle magical light under enemy
        this.light = scene.add.graphics();
        this.light.fillStyle(0xff6600, 0.15);
        this.light.fillCircle(0, 0, 35);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(9);

        this.setCollideWorldBounds(true);
        this.speed = 120;
        this.detectionRange = 400;
        
        this.target = null;
    }

    setTarget(player) {
        this.target = player;
    }

    update() {
        if (!this.target) return;

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

        if (distance < this.detectionRange) {
            this.scene.physics.moveToObject(this, this.target, this.speed);
        } else {
            this.setVelocity(0);
        }

        // Keep light attached to enemy
        this.light.x = this.x;
        this.light.y = this.y;
    }
}
