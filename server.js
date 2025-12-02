// server.js
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- VAPID KEYS (generate once) ----------
const publicVapidKey  = 'BO6CF_EsrvJ98tyw7OSCcKQUcnmbUROJEY9eoQhEOAqso404iGg9B7HaLyYAQfilhMFaLtoFNT9q9BLpWCIonBM';
const privateVapidKey = 'bCuZbdtdGH9CFDckdW4Glwl8G46LcqzDcIXIwwNhH4w';
webpush.setVapidDetails('atraveleral@gmail.com', publicVapidKey, privateVapidKey);

// Store subscriptions in memory (use DB in production)
const subs = {};

/* ---------- API ---------- */
app.post('/api/subscribe', (req, res) => {
  const sub = req.body;
  subs[sub.endpoint] = sub;
  console.log('Subscribed:', sub.endpoint);
  res.status(201).json({});
});

app.post('/api/push', (req, res) => {
  const {sub, title, body} = req.body;
  const payload = JSON.stringify({title, body});
  webpush.sendNotification(sub, payload)
    .then(() => res.status(200).json({}))
    .catch(err => {
      console.error('Push error:', err);
      res.status(500).json({});
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));