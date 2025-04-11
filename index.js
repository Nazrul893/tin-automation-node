const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome', // Render এর জন্য দরকার
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://secure.incometax.gov.bd/Registration/Login');

    await page.type('#userId', username);
    await page.type('#password', password);
    await page.click('#loginButton');

    await page.waitForNavigation();
    const currentURL = page.url();

    if (currentURL.includes('TINHome')) {
      await page.goto('https://secure.incometax.gov.bd/ViewCertiifcate');

      const data = await page.evaluate(() => {
        const cert = document.querySelector('#certificate');
        return cert ? cert.innerText : 'Certificate not found';
      });

      await browser.close();
      return res.json({ success: true, data });
    } else {
      await browser.close();
      return res.status(401).json({ error: 'Invalid credentials or login failed' });
    }

  } catch (error) {
    return res.status(500).json({
      error: 'Automation failed',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('TIN Automation Node Server is Running on port', PORT);
});
