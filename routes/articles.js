/**
 * Created by Dankuer on 2016/7/31.
 */
var express = require('express');
var router = express.Router();
var auth=require('../middle');
var markdown=require('markdown').markdown;
/* GET users listing. */
router.get('/add',auth.checkLogin, function(req, res, next) {
    res.render('articles/add',{title:'增加文章'})
});
router.post('/add', function(req, res, next) {
    var article=req.body;
    article.user=req.session.user._id;
    article.content=markdown.toHTML(article.content);
    Model('Article').create(article,function(err,doc){
        if(err){
            req.flash('error','增加文章失败！');
            res.redirect('back');
        }else{

            req.flash('success','增加文章成功！');
            res.redirect('/');
        }
    });
});
router.get('/list',function(req,res){
    Model('Article').find().populate('user').exec(function(err,docs){
        res.render('articles/list',{title:'文章列表',articles:docs});
    });
});
router.get('/detail/:id',function(req,res){
    Model('Article').findById(req.params.id,function(err,doc){
        res.render('articles/detail',{title:'文章详情',article:doc});
    })
});
router.get('/delete/:id',function(req,res){
    Model('Article').findById(req.params.id,function(err,doc){
        if(doc){
            if(req.session.user._id==doc.user){
                //确认是自己发的文章才可以删除
                Model('Article').remove({_id:req.params.id},function(err,result){
                    if(err){
                        //删除失败
                        req.flash('error','删除失败！');

                    }else{
                        //删除成功
                        req.flash('success','删除成功！');
                    }
                    res.redirect('/');
                });
            }
        }
    })

})
module.exports = router;
