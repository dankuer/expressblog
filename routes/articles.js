/**
 * Created by Dankuer on 2016/7/31.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res, next) {
    res.render('articles/add',{title:'增加文章'})
});

module.exports = router;
