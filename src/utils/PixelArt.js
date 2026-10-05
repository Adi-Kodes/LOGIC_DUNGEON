export function createPixelTexture(scene, key, palette, pixelData, scale = 4) {
    if (scene.textures.exists(key)) return;
    
    const width = pixelData[0].length;
    const height = pixelData.length;
    
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const char = pixelData[y][x];
            if (char !== '.' && char !== ' ') {
                const color = palette[char];
                if (color !== undefined) {
                    g.fillStyle(color, 1);
                    g.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
    }
    
    g.generateTexture(key, width * scale, height * scale);
}
