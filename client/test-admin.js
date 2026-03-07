import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });

        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', 'admin@123');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ timeout: 10000 }).catch(() => { });
        await new Promise(r => setTimeout(r, 1000));

        await page.goto('http://localhost:5173/admin/complaints');
        await new Promise(r => setTimeout(r, 4000));

        await browser.close();
        console.log('Done');
        process.exit(0);
    } catch (e) {
        console.error('ERROR>>', e.message);
        process.exit(1);
    }
})();
