const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');
  //res.send('Auth middleware');
  if (!token) {
    return res.status(401).json({ msg: 'No token : Auth denied (1)' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSeceret'));

    req.user = decoded; //Aways remember this mistake you made here
    //res.status(200).json({ msg: req.user.id });
    //res.json(decoded.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
