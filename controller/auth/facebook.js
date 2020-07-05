const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  get: (req, res) => {
    console.log('req user~~~', req.user);
    const token = jwt.sign(
      {
        data: req.user
      },
      process.env.JWT_KEY,
      { expiresIn: 60000 }
    );

    console.log('token...', token);
    res.cookie('jwt', token);
    res.json({ token });
  }
};
