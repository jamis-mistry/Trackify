const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        page.on('console', msg => console.log('LOG:', msg.text()));
        page.on('pageerror', err => console.log('ERROR:', err.message));

        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });

        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', 'admin@123');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ timeout: 10000 }).catch(() => { });
        await new Promise(r => setTimeout(r, 1000));

        await page.goto('http://localhost:5173/admin/complaints');
        await new Promise(r => setTimeout(r, 3000));

        const html = await page.evaluate(() => document.body.innerHTML);
        if (html.includes('No complaints found')) {
            console.log('UI state: blank empty state');
        } else if (html.includes('ComplaintCard') || html.includes('Priority')) {
            console.log('UI state: cards rendered successfully');
        } else {
            console.log('UI state: entirely missing cards. Grid might be blank.');
        }

        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error('CRASH>>', e.message);
        process.exit(1);
    }
})();
