import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    // Wait a little for Phaser to initialize
    await new Promise(r => setTimeout(r, 2000));

    console.log('Simulating click to start GameScene...');
    // We assume the game is loaded on the main menu, and clicking in the center starts the game.
    // Let's click the START GAME button which is in the center of the screen
    await page.mouse.click(640, 360 + 50);

    // Wait for scene transition
    await new Promise(r => setTimeout(r, 1000));

    console.log('Simulating WASD input (holding W)...');
    await page.keyboard.down('w');
    await new Promise(r => setTimeout(r, 1000)); // Move up for 1 second
    await page.keyboard.up('w');
    
    console.log('Simulating Arrow keys (holding Right)...');
    await page.keyboard.down('ArrowRight');
    await new Promise(r => setTimeout(r, 1000));
    await page.keyboard.up('ArrowRight');

    console.log('Waiting 3 seconds for enemies to potentially catch up...');
    await new Promise(r => setTimeout(r, 3000));

    console.log('Closing browser...');
    await browser.close();
    console.log('Test complete. Check output for any BROWSER ERROR or BROWSER CONSOLE messages.');
})();
