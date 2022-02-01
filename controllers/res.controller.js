const path = require('path');

// Get a file
exports.getFile = async (req, res) => {
  console.log("Get File");
  let filePath = path.join(__dirname, "../data/", req.params.folder, "/", req.params.file);

  return res.sendFile(filePath, function (err) {
    if (err) {
      console.log(err);
      return res.status(err.status).end();
    } else {
      console.log('Sent:', filePath);
    }
  });
};