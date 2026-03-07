const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let errs = [];
        page.on('pageerror', err => errs.push('PAGE-ERROR: ' + err.message));
        page.on('console', msg => {
            if (msg.type() === 'error') errs.push('LOG-ERROR: ' + msg.text());
        });

        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });

        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', 'admin@123');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ timeout: 10000 }).catch(() => { });
        await new Promise(r => setTimeout(r, 1000));

        errs = []; // clear login errors

        await page.goto('http://localhost:5173/admin/complaints');
        await new Promise(r => setTimeout(r, 4000));

        console.log('--- ERRORS ENCOUNTERED ---');
        console.log(errs.join('\n'));
        console.log('--- HTML CHECK ---');
        const count = await page.evaluate(() => document.querySelectorAll('.group.relative').length);
        console.log('Cards found:', count);

        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error('ERROR>>', e.message);
        process.exit(1);
    }
})();
