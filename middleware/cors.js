module.exports = (req, res, next) => {
  console.log("CORS ADDED");

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // res.header('Access-Control-Allow-Methods', '*');
  next();
};