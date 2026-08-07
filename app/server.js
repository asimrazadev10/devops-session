const express = require('express');
const app = express();

app.set('trust proxy', true); // if behind a reverse proxy

app.get('/', async (req, res) => {
  const ip = req.ip;

  try {
    const lambdaRes = await fetch(
      `https://vfomlqpkcfvtxxqcukwbzbqite0pjmhz.lambda-url.ap-southeast-1.on.aws/?ip=${encodeURIComponent(ip)}`
    );

    if (!lambdaRes.ok) {
      throw new Error(`Lambda returned ${lambdaRes.status}`);
    }

    // If your Lambda returns JSON:
    const data = await lambdaRes.json();

    res.send(`
      <!doctype html>
      <meta charset="utf-8">
      <title>IP Information</title>
      <style>
        body { font:16px system-ui; max-width:800px; margin:40px auto; padding:20px; }
        pre { background:#f5f5f5; padding:16px; border-radius:8px; }
      </style>

      <h2>Your IP</h2>
      <p><code>${ip}</code></p>

      <h2>Your IP Address Details</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send(`Error calling Lambda: ${err.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on :${port}`));
