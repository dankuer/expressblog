var express = require('express');
var router = express.Router();
var util=require('../util');
var auth=require('../middle')
/* GET users listing. */
router.get('/login',auth.checkNotLogin,function(req, res, next) {
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
                req.flash('success','登陆成功');
                res.redirect('/');
            }else{
                req.flash('error','登陆失败');
                res.redirect('/user/reg')
            }
        }
    })
});
router.get('/logout',auth.checkLogin,function(req,res,next){
    req.session.user=null;
    req.flash('success','退出成功');
    return res.redirect('/users/login');
})
router.get('/reg', auth.checkNotLogin,function(req, res, next) {
  res.render('users/reg',{title:'注册'});
});
router.post('/reg',function(req,res,next){
    //提交注册表单
    var user=req.body;
    console.log('received reg user '+JSON.stringify(user));
    if(user.password!=user.repassword){
        //向session中写入一个消息
        req.flash('error','两次密码输入不一致！');

        return res.redirect('back');
    }
    //对用户密码进行加密
    user.password=util.md5(user.password);
    //获取头像
    user.avatar='https://secure.gravatar.com/avatar/'+util.md5(user.email)+'?s=16';
    Model('User').create(user,function(err,doc){

        //向数据库保存用户
        if(err){
            return res.redirect('back');
        }else{
            //console.log('保存成功');
            req.session.user=doc;
            req.flash('success','注册成功！');
            return res.redirect('/');
        }
    })
});
module.exports = router;
