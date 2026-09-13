const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

const validTokens = new Map();

function createToken(username) {
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  validTokens.set(token, username);
  return token;
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const fallbackToken = req.query.token || '';
  const effectiveToken = token || fallbackToken;

  if (!effectiveToken || !validTokens.has(effectiveToken)) {
    return res.status(401).json({ error: 'Login required.' });
  }

  const username = validTokens.get(effectiveToken);
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.status(401).json({ error: 'Invalid session.' });
  }

  req.user = { username: user.username, role: user.role || 'user' };
  next();
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = createToken(username);
    return res.json({ token, user: { username: user.username, role: user.role || 'user' } });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed.', details: err.message });
  }
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    const created = await User.create({ username, password, role: 'user' });
    const token = createToken(created.username);
    return res.status(201).json({ token, user: { username: created.username, role: created.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed.', details: err.message });
  }
});

router.post('/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    validTokens.delete(token);
  }

  return res.json({ message: 'Logged out.' });
});

module.exports = router;
module.exports.authenticate = authenticate;
