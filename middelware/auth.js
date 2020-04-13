const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token'); // Set this x-auth-token in header value and set the token next to it to pass a token
  //res.send('Auth middleware');
  if (!token) {
    return res.status(401).json({ msg: 'No token : Auth denied (1)' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSeceret')); // Decodes the jwt here this line.

    req.user = decoded; //Aways remember this mistake you made here
    //res.status(200).json({ msg: req.user.id });
    //res.json(decoded.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
