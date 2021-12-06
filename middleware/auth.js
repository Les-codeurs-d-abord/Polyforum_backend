const jwt = require('jsonwebtoken');
const KEY = "HSNDKAJZRIWKNARHSKXH";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
/*     const decodedToken = jwt.verify(token, KEY); */
    
    jwt.verify(token, KEY, (err, decoded) => {
      if(err) {
        res.status(401).json({
          error: "Invalid request!"
        });
      }
      else {
        console.log(decoded);
        next();
      }
    });

  } catch {
    res.status(401).json({
      error: "Invalid request!"
    });
  }
};