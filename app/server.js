const express = require('express');
const app = express();

// Request log to stdout. On the VPS, pm2/systemd/journald captures stdout,
// so that IS your log file + rotation — no logging library needed.
// ponytail: swap for morgan/pino only if you need structured/JSON logs.
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.url} -> ${res.statusCode}`);
  });
  next();
});

// Direct-to-internet: req.ip is the real TCP peer, so no `trust proxy`.
// ponytail: the IP is the socket address (always a valid IP string), not a
// user-supplied header, so no escaping needed. Add `trust proxy` + escaping
// if you ever put nginx/Cloudflare in front.
app.get('/', (req, res) => {
  res.send(`<!doctype html><meta charset=utf-8><title>Your IP</title>
<style>body{font:16px system-ui;display:grid;place-content:center;height:100vh;margin:0;text-align:center}
code{font-size:2rem}</style>
<p>Your IP address is</p><code>${req.ip}</code>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
