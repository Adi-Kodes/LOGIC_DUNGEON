export default class CollisionSystem {
    constructor(scene, player, enemies, walls) {
        this.scene = scene;
        this.player = player;
        this.enemies = enemies;
        this.walls = walls;

        this.setupCollisions();
    }

    setupCollisions() {
        // Player and walls
        this.scene.physics.add.collider(this.player, this.walls);
        // Enemies and walls
        this.scene.physics.add.collider(this.enemies, this.walls);
        // Player and enemies overlap (damage)
        this.scene.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!player.isInvulnerable) {
            const damaged = player.takeDamage();
            if (damaged) {
                // Update HUD immediately through an event or direct call. 
                // We'll let the GameScene check health in its update loop or handle it here if passed.
            }
        }
    }
}
