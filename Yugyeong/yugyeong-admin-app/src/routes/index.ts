import express, { Request, Response, Router } from "express";
const router: Router = express.Router();


/* GET main page. */
router.get('/', function(req, res, next) {
  res.redirect('/main');
});

router.get('/main', function(req, res, next) {
  res.render('main');
});

export default router;
