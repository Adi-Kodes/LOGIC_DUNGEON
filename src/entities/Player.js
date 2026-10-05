import Phaser from 'phaser';
import { createPixelTexture } from '../utils/PixelArt.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const palette = {
            'x': 0x111111, // outline
            'a': 0xb0c4de, // light armor
            'm': 0x778899, // mid armor
            'd': 0x2f4f4f, // dark armor
            'c': 0x8b0000, // dark red cloak
            'r': 0xdc143c, // bright red cloak
            's': 0xe0ffff, // sword
            'w': 0xffe4c4, // skin
            'g': 0x483d8b  // magical rim
        };
        const spriteData = [
            "......xxxx......",
            ".....xaawax.....",
            ".....xammax.....",
            "...xxxmmmmxxx...",
            "..xccraaaarccx..",
            ".xcccxaamaxcccx.",
            ".xcc.xddddx.scx.",
            ".xc..xmmmmx.scx.",
            ".....xddddx.scx.",
            "....xx.xx.xxscx.",
            "....xdx..xdxxsx.",
            "....xdx..xdx.x..",
            "....xxx..xxx....",
            "................"
        ];
        createPixelTexture(scene, 'playerTexture', palette, spriteData, 3);
        
        super(scene, x, y, 'playerTexture');
        
        // Add subtle magical light under player
        this.light = scene.add.graphics();
        this.light.fillStyle(0x6688ff, 0.15);
        this.light.fillCircle(0, 0, 30);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDepth(10); // ensure player is above the light

        this.speed = 250;
        
        // Health
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.isInvulnerable = false;
        
        // Input keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Interaction key (for bulbs, future objects)
        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        this.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.setVelocityX(this.speed);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.setVelocityY(this.speed);
        }

        // Normalize velocity so diagonal movement isn't faster
        if (this.body.velocity.length() > 0) {
            this.body.velocity.normalize().scale(this.speed);
        }

        // Keep light attached to player
        this.light.x = this.x;
        this.light.y = this.y;
    }

    takeDamage() {
        if (this.isInvulnerable) return false;

        this.health -= 1;
        this.isInvulnerable = true;

        // Visual feedback
        this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            yoyo: true,
            repeat: 5,
            duration: 100,
            onComplete: () => {
                this.alpha = 1;
                this.isInvulnerable = false;
            }
        });
        
        return true;
    }
}
