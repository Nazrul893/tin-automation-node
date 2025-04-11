const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/get-tin-info', async (req, res) => {
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
        await page.goto('https://secure.incometax.gov.bd/Registration/Login');

        await page.type('#userId', username);
        await page.type('#password', password);
        await page.click('#btnLogin');
        await page.waitForNavigation();

        await page.goto('https://secure.incometax.gov.bd/ViewCertiifcate');

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
