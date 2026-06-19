export const validateOrder = (req, res, next) => {
  const { gameName, steamPriceInr, customerPrice } = req.body;

  if (!gameName || gameName.trim() === '') {
    return res.status(400).json({ error: 'Game name is required' });
  }

  if (!steamPriceInr || isNaN(steamPriceInr) || steamPriceInr <= 0) {
    return res.status(400).json({ error: 'Invalid steam price' });
  }

  if (!customerPrice || isNaN(customerPrice) || customerPrice <= 0) {
    return res.status(400).json({ error: 'Invalid customer price' });
  }

  next();
};

export const validateAuth = (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  next();
};
