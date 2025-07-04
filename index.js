const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const { lat, lon, message } = req.body;

  if (!lat || !lon) {
    return res.status(400).send("Missing coordinates.");
  }

  const text = message || `📍 Driver Location:\nhttps://maps.google.com/?q=${lat},${lon}`;

  try {
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const response = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });

    const data = await response.json();
    console.log("✅ Telegram response:", data);
    res.send("Message sent!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Error sending message.");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));