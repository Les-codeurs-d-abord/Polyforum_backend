const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if(err) {
        return res.status(401).json({
          error: "Invalid token."
        });
      }
      else {
        next();
      }
    });

  } catch {
    return res.status(401).json({
      error: "Invalid request."
    });
  }
};