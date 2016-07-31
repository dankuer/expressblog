var express = require('express');
var router = express.Router();
var util=require('../util');
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('users/login',{title:'登录'});
});
router.post('/login', function(req, res, next) {
    var user=req.body;
    user.password=util.md5(user.password);
    Model('User').findOne(user,function(err,doc){
        if(err){
            return res.redirect('back');
        }else{
            if(doc){
                req.session.user=doc;
            }else{
                res.redirect('/user/reg')
            }
        }
    })
});
router.get('/logout',function(req,res,next){
    req.session.user=null;
    return res.redirect('/user/login');
})
router.get('/reg', function(req, res, next) {
  res.render('users/reg',{title:'注册'});
});
router.post('/reg',function(req,res,next){
    //提交注册表单
    var user=req.body;
    console.log('received reg user '+JSON.stringify(user));
    if(user.password!=user.repassword){
        return res.redirect('back');
    }
    Model('User').create(user,function(err,doc){
        //对用户密码进行加密
        user.password=util.md5(user.password);
        //获取头像
        user.avatar='https://secure.gravatar.com/avatar/'+util.md5(user.email)+'?s=32';
        //向数据库保存用户
        if(err){
            return res.redirect('back');
        }else{
            
            req.session.user=doc;
            return res.redirect('/');
        }
    })
})
module.exports = router;
