var express = require('express');
var fs = require('fs');
var router = express.Router();
var ip = require('ip');
var multer = require('multer');

var storage = multer.diskStorage({ 
  destination: function(req, file, cb) {
    cb(null, 'public/files/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {

  var files = fs.readdirSync(__dirname + '/../public/files');
  var ipAddress = ip.address()
  res.render('index', {
    files: files,
    ip: ipAddress
  });

});

router.get('/public/files/:filename', function (req, res) {
  var filepath = __dirname + '/../public/files/' + req.params.filename;

  var file = fs.createReadStream(filepath);
  var stat = fs.statSync(filepath);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
  file.pipe(res);
});

router.post('/', upload.single('pdfupload'), function(req, res) {
  res.send("File upload successfully.");
})

module.exports = router;