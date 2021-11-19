const jwt = require('jsonwebtoken');
const KEY = "HSNDKAJZRIWKNARHSKXH";

module.exports = (req, res, next) => {
  console.log(req.headers.authorization);

  const token = req.headers.authorization.split(' ')[1];

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, KEY);
    
/*     const email = decodedToken.email; 
    console.log(email);  */

    console.log(token);
    console.log(decodedToken);
    next();

    // if (req.body.userId && req.body.userId !== userId) {
    //   throw 'Invalid user ID';
    // } else {
    //   next();
    // }
  } catch {
    res.status(401).json({
      error: "Invalid request!"
    });
  }
};