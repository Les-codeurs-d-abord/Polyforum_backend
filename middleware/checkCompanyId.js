const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Invalid token." });
      } else {
        if (decoded.role && decoded.role == "ENTREPRISE") {
          if (req.params.companyProfileId == decoded.companyProfileId) {
            next();
          } else {
            res.status(401).json({ error: "Unauthorized" });
          }
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      }
    });
  } catch {
    res.status(401).json({
      error: "Invalid request.",
    });
  }
};
