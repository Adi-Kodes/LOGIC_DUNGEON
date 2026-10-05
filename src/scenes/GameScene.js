import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import BooleanBulb from '../entities/BooleanBulb.js';
import HUD from '../ui/HUD.js';
import PuzzlePanel from '../ui/PuzzlePanel.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import CameraSystem from '../systems/CameraSystem.js';
import LevelIntroSystem from '../systems/LevelIntroSystem.js';
import LogicEvaluator from '../logic/LogicEvaluator.js';
import { getPuzzle } from '../puzzles/puzzleData.js';
import { level1Data } from '../levels/level1.js';
import { level2Data } from '../levels/level2.js';
import { createPixelTexture } from '../utils/PixelArt.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.levelIndex = data.level || 1;
        if (this.levelIndex === 1) {
            this.levelData = level1Data;
        } else if (this.levelIndex === 2) {
            this.levelData = level2Data;
        } else {
            this.levelData = level1Data; // Default fallback
        }
    }

    create() {
        // Setup world bounds
        this.physics.world.setBounds(0, 0, this.levelData.width, this.levelData.height);

        // Pixel Art Textures
        const floorPalette = { 'b': 0x181820, 'd': 0x111118, 'l': 0x22222a, 'p': 0x2d1b3d };
        const floorData = [
            "bbbbbbbbbbbbbbbl",
            "bddddddddddddddb",
            "bdlbbbbbbbblbbdb",
            "bldbbbbbbbbdlbdb",
            "bbddddpdddddbbdb",
            "bbbbbpbpbbbbbbdb",
            "bbblbbblbbbbbbdb",
            "bblblblblbbbbbdb",
            "bbblbbblbbbbbbdb",
            "bbbbbpbpbbbbbbdb",
            "bldbbdpbbbbdlbdb",
            "bdlbbbbbbbblbbdb",
            "bddddddddddddddb",
            "bbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbb",
            "lbbbbbbbbbbbbbbb"
        ];
        createPixelTexture(this, 'floorTile', floorPalette, floorData, 4);

        const wallPalette = { 'x': 0x111111, 'd': 0x1c1c24, 'm': 0x2a2a35, 'l': 0x383846 };
        const wallData = [
            "llllllllllllllll",
            "lmmmmmmmmmmmmmmx",
            "lmmmmmmmmmmmmmmx",
            "lmmmmmmmmmdmmmmx",
            "lmmmmmmmmmmmmmmx",
            "lmmmmmdmmmmmmmmx",
            "lmmmmmmmmmmmmmmx",
            "lxxxxxxxxxxxxxxx",
            "mmmdmmmxmmdmmmmm",
            "mmmmmmmxmmmmmmmm",
            "mmmmmmmxmmmmdmmm",
            "dmmmmmmxmmmmmmmm",
            "mmmmmmmxmmmmmmmm",
            "mmmmmmmxmmmmmmmm",
            "mmmmmmmxmmmmmmmm",
            "xxxxxxxxxxxxxxxx"
        ];
        createPixelTexture(this, 'wallTile', wallPalette, wallData, 4);

        // Background (ancient stone floor tile)
        this.add.tileSprite(0, 0, this.levelData.width, this.levelData.height, 'floorTile').setOrigin(0);

        // Build Walls
        this.walls = this.physics.add.staticGroup();
        this.levelData.walls.forEach(wall => {
            // Invisible physics body
            const w = this.add.rectangle(wall.x + wall.width / 2, wall.y + wall.height / 2, wall.width, wall.height, 0x000000, 0);
            this.physics.add.existing(w, true);
            this.walls.add(w);

            // Visual wall using tileSprite to tile the stone brick texture
            this.add.tileSprite(wall.x, wall.y, wall.width, wall.height, 'wallTile').setOrigin(0);
        });

        // ── Puzzle Setup ──────────────────────────────────
        this.puzzleSolved = false;
        this.currentPuzzle = null;

        if (this.levelData.puzzleId) {
            this.currentPuzzle = getPuzzle(this.levelData.puzzleId);
        }

        // ── Gate (blocks exit until puzzle solved) ────────
        this.gate = null;
        this.gateLabel = null;
        if (this.levelData.gate) {
            const gd = this.levelData.gate;
            // Visual gate block (invisible physics base)
            this.gate = this.add.rectangle(
                gd.x + gd.width / 2, gd.y + gd.height / 2,
                gd.width, gd.height,
                0x000000, 0 
            );
            this.physics.add.existing(this.gate, true); // static body
            this.walls.add(this.gate); // treat as wall so player collides

            // Gate Frame Texture
            const gateFramePalette = {
                'x': 0x050505, 'd': 0x1a1a24, 'm': 0x2b2b36, 'l': 0x3c3c4a, 's': 0x151515
            };
            const gateFrameData = [
                "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "xllllllldddddxxdddddlllllllldddx",
                "xmmmmmmxxddddxxddddxxmmmmmmxdddx",
                "xmmmmmmxxddddxxddddxxmmmmmmxdddx",
                "xddddddxxmmmmxxmmmmxxddddddxmmmx",
                "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "xlllldx..................xlllddx",
                "xmmmmmx..................xmmmmdx",
                "xdddddx..................xdddddx",
                "xxxxxxx..................xxxxxxx",
                "xlllldx..................xlllddx",
                "xmmmmmx..................xmmmmdx",
                "xdddddx..................xdddddx",
                "xxxxxxx..................xxxxxxx",
                "xlllldx..................xlllddx",
                "xmmmmmx..................xmmmmdx",
                "xdddddx..................xdddddx",
                "xxxxxxx..................xxxxxxx",
                "xlllldx..................xlllddx",
                "xmmmmmx..................xmmmmdx",
                "xdddddx..................xdddddx",
                "xxxxxxx..................xxxxxxx",
                "xlllldx..................xlllddx",
                "xmmmmmx..................xmmmmdx",
                "xdddddx..................xdddddx",
                "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "xmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmx",
                "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "xddddddddddddddddddddddddddddddx",
                "xmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmx",
                "xllllllllllllllllllllllllllllllx",
                "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            ];
            createPixelTexture(this, 'gateFrameTile', gateFramePalette, gateFrameData, 4);

            // Gate Door Texture
            const gateDoorPalette = {
                'x': 0x0a0a0a, 'i': 0x2a2a2a, 'w': 0x3d2314, 'd': 0x2b170b
            };
            const gateDoorData = [
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xiixiixiixiixiixiix.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xiixiixiixiixiixiix.......",
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xiixiixiixiixiixiix.......",
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xwwdxwwdxwwdxwwdxwx.......",
                ".......xxxxxxxxxxxxxxxxxx.......",
                ".......xiixiixiixiixiixiix.......",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................"
            ];
            createPixelTexture(this, 'gateDoorTile', gateDoorPalette, gateDoorData, 4);

            // Gate Lock Texture (Sun + Moon)
            const lockPalette = {
                'x': 0x111111, 's': 0x444455, 'm': 0x777788,
                'y': 0xffaa00, 'p': 0xaa00ff, 'g': 0xffffff
            };
            const lockData = [
                "......xxxx......",
                "....xxmmmmxx....",
                "...xsxssssxsx...",
                "..xmsxxxxxxsmx..",
                ".xmsx.yyyy.xsmx.",
                ".xsx.ygygyy.xsx.",
                "xmsx.yyxxyy.xsmx",
                "xmsx.yxxgxp.xsmx",
                "xmsx.yxxgxp.xsmx",
                "xmsx.ppxxpp.xsmx",
                ".xsx.pgpgpp.xsx.",
                ".xmsx.pppp.xsmx.",
                "..xmsxxxxxxsmx..",
                "...xsxssssxsx...",
                "....xxmmmmxx....",
                "......xxxx......"
            ];
            createPixelTexture(this, 'gateLockTile', lockPalette, lockData, 3);

            const centerX = gd.x + gd.width / 2;
            const centerY = gd.y + gd.height / 2;

            // Render Door first (so it's behind the frame)
            this.gateDoor = this.add.sprite(centerX, centerY, 'gateDoorTile');
            
            // Render Frame
            this.gateFrame = this.add.sprite(centerX, centerY, 'gateFrameTile');

            // Render Lock
            this.gateLock = this.add.sprite(centerX, centerY - 10, 'gateLockTile');

            // Magical pulse effect
            this.gateGlow = this.add.pointlight(centerX, centerY - 10, 0xaa00ff, 40, 0.3, 0.05);

            this.gate.visuals = [this.gateDoor, this.gateFrame, this.gateLock, this.gateGlow];

            // Gate label
            this.gateLabel = this.add.text(
                gd.x + gd.width / 2, gd.y - 15,
                'LOCKED', {
                    fontSize: '12px',
                    fill: '#aa66ff',
                    fontFamily: 'monospace',
                    align: 'center'
                }
            ).setOrigin(0.5);
        }

        // ── Torches ───────────────────────────────────────
        const torchPalette = { 'x': 0x111111, 'w': 0x4a2e15, 'o': 0xff6600, 'y': 0xffcc00, 'r': 0xff0000 };
        const torchData = [
            "..xyyx..",
            ".xyyyyx.",
            ".xoyyox.",
            ".xooyox.",
            "..xrox..",
            "..xwwx..",
            "..xwwx..",
            "...xx..."
        ];
        createPixelTexture(this, 'torchTile', torchPalette, torchData, 3);
        
        // Add torches symmetrically
        this.add.sprite(200, 150, 'torchTile');
        this.add.sprite(600, 150, 'torchTile');
        this.add.sprite(400, 400, 'torchTile');

        // ── Exit area (behind the gate) ───────────────────
        this.exitArea = this.add.rectangle(
            this.levelData.exitArea.x + this.levelData.exitArea.width / 2,
            this.levelData.exitArea.y + this.levelData.exitArea.height / 2,
            this.levelData.exitArea.width,
            this.levelData.exitArea.height,
            0x00ff00,
            0.3
        );
        this.physics.add.existing(this.exitArea, true);

        // Exit label
        this.add.text(
            this.levelData.exitArea.x + this.levelData.exitArea.width / 2,
            this.levelData.exitArea.y - 12,
            'EXIT', {
                fontSize: '12px',
                fill: '#00ff00',
                fontFamily: 'monospace',
                align: 'center'
            }
        ).setOrigin(0.5);

        // ── Submit Altar ──────────────────────────────────
        this.submitAltar = null;
        this.submitLabel = null;
        if (this.levelData.submitAltar) {
            const sa = this.levelData.submitAltar;

            const altarPalette = { 'x': 0x050505, 's': 0x22222a, 'm': 0x333340, 'p': 0x6600cc, 'l': 0xaa44ff, 'w': 0xffaaff };
            const altarData = [
                "......xxxx......",
                "....xxmmmmxx....",
                "...xmmmmmmmmx...",
                "..xmmmmmmmmmmx..",
                ".xmmmsmppmsmmmx.",
                ".xmmsppppppsmms.",
                "xxmsppwllwppsmxx",
                "xmmspwllllwpsmmx",
                "xmmspwllllwpsmmx",
                "xxmsppwllwppsmxx",
                ".xmmsppppppsmms.",
                ".xmmmsmppmsmmmx.",
                "..xmmmmmmmmmmx..",
                "...xmmmmmmmmx...",
                "....xxmmmmxx....",
                "......xxxx......"
            ];
            createPixelTexture(this, 'altarTile', altarPalette, altarData, 3);

            // Visual: a small altar/pedestal
            const altarGfx = this.add.sprite(sa.x, sa.y, 'altarTile');

            // Physics body for overlap detection
            this.submitAltar = this.add.rectangle(sa.x, sa.y, 44, 44);
            this.submitAltar.setAlpha(0); // invisible — visuals are the sprite
            this.physics.add.existing(this.submitAltar, true);

            this.submitLabel = this.add.text(
                sa.x, sa.y - 35,
                '[ E ] SUBMIT', {
                    fontSize: '11px',
                    fill: '#cc99ff',
                    fontFamily: 'monospace',
                    align: 'center'
                }
            ).setOrigin(0.5);
            this.submitLabel.setAlpha(0); // hidden until player is near
        }

        // Player
        this.player = new Player(this, this.levelData.playerSpawn.x, this.levelData.playerSpawn.y);

        // Enemies
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.levelData.enemies.forEach(e => {
            const enemy = new Enemy(this, e.x, e.y);
            enemy.setTarget(this.player);
            this.enemies.add(enemy);
        });

        // Boolean Bulbs (Phase 2A)
        this.bulbs = [];
        if (this.levelData.bulbs) {
            this.levelData.bulbs.forEach(b => {
                const bulb = new BooleanBulb(this, b.x, b.y, b.variable, b.initialValue, b.name);
                this.bulbs.push(bulb);
            });
        }
        this.interactionRange = 60; // px — how close the player must be to interact

        // HUD (Overlay)
        this.hud = new HUD(this);
        this.hud.updateHealth(this.player.health);
        this._syncBulbHUD();

        // Puzzle Panel (challenge display)
        this.puzzlePanel = null;
        if (this.currentPuzzle) {
            this.puzzlePanel = new PuzzlePanel(this, this.currentPuzzle);
            this._syncPuzzlePanel();
        }

        // Systems
        this.collisionSystem = new CollisionSystem(this, this.player, this.enemies, this.walls);
        this.cameraSystem = new CameraSystem(this, this.player, this.levelData.width, this.levelData.height);

        // Exit Collision
        this.physics.add.overlap(this.player, this.exitArea, this.reachExit, null, this);

        // Run Level Intro
        this.isIntroPlaying = false;
        if (this.levelData.intro) {
            this.isIntroPlaying = true;
            this.hud.container.setAlpha(0);
            if (this.puzzlePanel) this.puzzlePanel.container.setAlpha(0);
            
            const introSystem = new LevelIntroSystem(this, this.levelData.intro, () => {
                this.isIntroPlaying = false;
                this.tweens.add({
                    targets: this.puzzlePanel ? [this.hud.container, this.puzzlePanel.container] : this.hud.container,
                    alpha: 1, duration: 500
                });
            });
            introSystem.start();
        }
    }

    update(time, delta) {
        if (this.isIntroPlaying) return; // Freeze gameplay during intro
        if (!this.player.active) return;
        
        this.player.update();
        this.hud.updateHealth(this.player.health);

        // Bulb interaction (Phase 2A)
        this._handleBulbInteraction();

        // Submit altar interaction
        this._handleSubmitInteraction();

        if (this.player.health <= 0) {
            this.scene.start('GameOverScene');
            return;
        }
    }

    /** Check proximity to bulbs and handle E-key toggle. */
    _handleBulbInteraction() {
        let nearestBulb = null;
        let nearestDist = Infinity;

        for (const bulb of this.bulbs) {
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                bulb.x, bulb.y
            );
            if (dist < this.interactionRange && dist < nearestDist) {
                nearestDist = dist;
                nearestBulb = bulb;
            }
        }

        // Also check if player is near submit altar (to avoid conflicting hints)
        const nearSubmit = this._isNearSubmitAltar();

        if (nearestBulb && !nearSubmit) {
            this.hud.setInteractHint(`[E] Toggle ${nearestBulb.getVariable()}`);
            if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
                nearestBulb.toggle();
                this._syncBulbHUD();
                this._syncPuzzlePanel();
            }
        } else if (!nearSubmit) {
            this.hud.setInteractHint('');
        }
    }

    /** Check proximity to submit altar and handle E-key submit. */
    _handleSubmitInteraction() {
        if (!this.submitAltar || !this.currentPuzzle || this.puzzleSolved) {
            if (this.submitLabel) this.submitLabel.setAlpha(0);
            return;
        }

        const dist = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.submitAltar.x, this.submitAltar.y
        );

        if (dist < this.interactionRange) {
            this.submitLabel.setAlpha(1);
            this.hud.setInteractHint('[E] SUBMIT ANSWER');

            if (Phaser.Input.Keyboard.JustDown(this.player.interactKey)) {
                this._submitAnswer();
            }
        } else {
            this.submitLabel.setAlpha(0);
        }
    }

    /** @returns {boolean} true if the player is within interaction range of the submit altar */
    _isNearSubmitAltar() {
        if (!this.submitAltar) return false;
        const dist = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.submitAltar.x, this.submitAltar.y
        );
        return dist < this.interactionRange;
    }

    /** Evaluate the current bulb states against the puzzle. */
    _submitAnswer() {
        // Gather current bulb states
        const bulbStates = {};
        for (const bulb of this.bulbs) {
            bulbStates[bulb.getVariable()] = bulb.getState();
        }

        // Evaluate
        const { result, explanation } = LogicEvaluator.evaluate(this.currentPuzzle, bulbStates);

        // Show feedback on the puzzle panel
        if (this.puzzlePanel) {
            this.puzzlePanel.showFeedback(result, explanation);
        }

        if (result) {
            this.puzzleSolved = true;
            this._unlockGate();
        }
    }

    /** Unlock the gate — remove its physics body so the player can pass. */
    _unlockGate() {
        if (!this.gate) return;

        // 1. Lock glow brightens and rotates
        this.tweens.add({
            targets: this.gateLock,
            angle: 180,
            scale: 1.2,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                // 2. Lock breaks/fades, gate slides up
                const targets = [this.gateLock];
                if (this.gateGlow) targets.push(this.gateGlow);
                
                this.tweens.add({
                    targets: targets,
                    alpha: 0,
                    scale: 2,
                    duration: 300,
                    onComplete: () => {
                        this.gateLock.setVisible(false);
                        if (this.gateGlow) this.gateGlow.setVisible(false);
                    }
                });

                this.tweens.add({
                    targets: this.gateDoor,
                    y: '-=64',
                    alpha: 0,
                    duration: 600,
                    ease: 'Power2',
                    onComplete: () => {
                        this.gate.body.enable = false;
                        this.gate.setVisible(false);
                        this.gateDoor.setVisible(false);
                    }
                });
            }
        });

        // Update gate label
        if (this.gateLabel) {
            this.gateLabel.setText('🔓 OPEN');
            this.gateLabel.setFill('#00ff88');
        }

        // Hide submit altar label since puzzle is done
        if (this.submitLabel) {
            this.submitLabel.setText('✓ SOLVED');
            this.submitLabel.setFill('#00ff88');
            this.submitLabel.setAlpha(1);
        }

        // Update HUD hint
        this.hud.setInteractHint('');
    }

    /** Push current bulb states to the HUD display. */
    _syncBulbHUD() {
        const states = this.bulbs.map(b => ({
            variable: b.getVariable(),
            value: b.getState()
        }));
        this.hud.updateBulbStates(states);
    }

    /** Push current bulb states to the puzzle panel. */
    _syncPuzzlePanel() {
        if (!this.puzzlePanel) return;
        const bulbStates = {};
        for (const bulb of this.bulbs) {
            bulbStates[bulb.getVariable()] = bulb.getState();
        }
        this.puzzlePanel.updateStates(bulbStates);
    }

    reachExit() {
        this.scene.start('RoomCompleteScene', { level: this.levelIndex });
    }
}
