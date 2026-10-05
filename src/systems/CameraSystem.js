export default class CameraSystem {
    constructor(scene, player, mapWidth, mapHeight) {
        this.scene = scene;
        this.player = player;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.setupCamera();
    }

    setupCamera() {
        const camera = this.scene.cameras.main;
        camera.setBounds(0, 0, this.mapWidth, this.mapHeight);
        camera.startFollow(this.player, true, 0.09, 0.09);
        camera.setZoom(1);
    }
}
