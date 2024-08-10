var express = require('express');
var router = express.Router();

/* GET main page. */
router.get('/', function(req, res, next) {
  res.redirect('/main');
});

router.get('/main', function(req, res, next) {
  res.render('main');
});

module.exports = router;
