var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'AWS Example App',
    desc: 'Please select a photo',
    viewName: 'index'
  });
});

module.exports = router;
