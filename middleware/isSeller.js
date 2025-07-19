module.exports = (req, res, next) => {
  if (req.session && req.session.role === 'seller') {
    next();
  } else {
    res.status(403).send('Access denied. Seller only.');
  }
};
