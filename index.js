const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("TIN Automation Node Server is Running...");
});

// Example endpoint: automate TIN certificate view
app.post("/get-tin-info", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Go to login page
    await page.goto("https://secure.incometax.gov.bd/Registration/Login");

    // Type username and password
    await page.type("#UserName", username);
    await page.type("#Password", password);

    // Click Login
    await Promise.all([
      page.click("#btnSubmit"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // Navigate to Certificate page
    await page.goto("https://secure.incometax.gov.bd/ViewCertiifcate");

    // Wait and take screenshot (optional)
    await page.waitForTimeout(2000);
    const screenshot = await page.screenshot({ encoding: "base64" });

    await browser.close();

    res.json({
      message: "TIN info retrieved successfully",
      screenshot: screenshot,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Automation failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
