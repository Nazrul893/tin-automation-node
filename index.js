const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/tin-check', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Login Page
        await page.goto('https://secure.incometax.gov.bd/Registration/Login', {
            waitUntil: 'networkidle2'
        });

        await page.type('#UserName', username);
        await page.type('#Password', password);
        await Promise.all([
            page.click('#btnLogin'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        // Go to TIN Certificate page
        await page.goto('https://secure.incometax.gov.bd/ViewCertiifcate', {
            waitUntil: 'networkidle2'
        });

        const content = await page.content();
        await browser.close();

        // Return raw HTML for now (you can extract specific info later)
        res.send(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Automation failed' });
    }
});

app.get('/', (req, res) => {
    res.send('TIN Automation Node Service is Running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
