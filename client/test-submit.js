import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });

        await page.type('input[type="email"]', 'u@gmail.com');
        await page.type('input[type="password"]', 'user@123'); // Adjust based on common patterns
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ timeout: 10000 }).catch(() => { });
        await new Promise(r => setTimeout(r, 1000));

        await page.goto('http://localhost:5173/user/create');
        await page.waitForSelector('input[placeholder*="summary"]', { timeout: 5000 });

        await page.type('input[placeholder*="summary"]', 'Puppeteer Title Test');
        await page.type('textarea', 'Puppeteer description more than 10 chars');

        let apiError = null;
        page.on('response', async response => {
            if (response.url().includes('/api/complaints') && response.request().method() === 'POST') {
                console.log('API Status:', response.status());
                try {
                    apiError = await response.text();
                    console.log('API Response text:', apiError);
                } catch (e) { }
            }
        });

        await page.click('button[type="submit"]');

        await page.waitForFunction(() => {
            const text = document.body.innerText;
            return text.includes('Failed:') || text.includes('successfully') || text.includes('Failed to submit complaint');
        }, { timeout: 8000 });

        const html = await page.evaluate(() => document.body.innerText);
        const match = html.match(/(Failed:[^\n]*|successfully[^\n]*|Failed to submit complaint[^\n]*)/i);
        console.log('RESULT>>', match ? match[0] : 'No match found');

        await browser.close();
        process.exit(apiError ? 1 : 0);
    } catch (e) {
        console.error('ERROR>>', e.message);
        process.exit(1);
    }
})();
