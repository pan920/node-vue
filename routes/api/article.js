// login register
const express = require("express");
const router = express.Router();
const passport = require("passport");
const Article = require("../../models/Article")
const jwt_decode = require("jwt-decode");
const multer = require("multer");
//
// $route GET api/article/test
//  @desc 返回得请求得json数据
// @access public
router.get("/test",(req,res) => {
    res.json({msg:"article接口测试成功！"})
})

// $route POST api/article/add
//  @desc 新增新闻接口
//  @access Private
router.post("/add",passport.authenticate('jwt',{session: false}),(req,res) => {
    const articleFields = {};
    if (req.body.type) articleFields.type = req.body.type;
    if (req.body.title) articleFields.title = req.body.title;
    if (req.body.file) articleFields.file = req.body.file;
    if (req.body.describe) articleFields.describe = req.body.describe;
    if (req.body.content) articleFields.content = req.body.content;
    if (req.body.status) articleFields.status = req.body.status;
    if (req.body.is_top) articleFields.is_top = req.body.is_top;
    if (req.body.publish_time) articleFields.publish_time = req.body.publish_time;
    const decoded = jwt_decode(req.headers.authorization)
    articleFields.userId = decoded.id;
    articleFields.author = decoded.name;
    new Article(articleFields).save().then(article => {
        res.json(article)
    })
})

// $route POST api/article/list
//  @desc 新闻列表接口
//  @access Private 
router.post("/list",passport.authenticate('jwt',{session:false}),(req,res) => {
    const decoded = jwt_decode(req.headers.authorization)
    Article.find()
           .then(article => {
               if(!article){
                   res.status(200).json("暂时没有文章！")
               }
               // 此处增加判断，将用户与数据对应，最高权限者可以查看所有数据
               const userId = {}
               if (decoded.identity != 'admin') {
                   userId.userId = decoded.id
               }

               Article.paginate(userId, {
                   page: req.query.page,
                   limit: req.query.limit
               },
               (error, result) => {
                   if (error) {
                       res.end("列表接口报错！");
                       return;
                   }

                   res.send({
                       page_count: result.limit,
                       page_num: result.page,
                       total_num: result.total,
                       result: result
                   });
               }
               )
           })
           .catch(err => {
                console.log(err)
           })
})
// $route POST api/article/edit/:id
//  @desc 编辑信息接口
//  @access Private
router.post("/edit/:id",passport.authenticate('jwt',{session: false}),(req,res) => {
    const articleFields = {};
    if (req.body.type) articleFields.type = req.body.type;
    if (req.body.title) articleFields.title = req.body.title;
    if (req.body.file) articleFields.file = req.body.file;
    if (req.body.describe) articleFields.describe = req.body.describe;
    if (req.body.content) articleFields.content = req.body.content;
    if (req.body.status) articleFields.status = req.body.status;
    if (req.body.is_top) articleFields.is_top = req.body.is_top;
    if (req.body.publish_time) articleFields.publish_time = req.body.publish_time;
    Article.findOneAndUpdate({_id: req.params.id},{$set:articleFields})
            .then(article => {
                res.json('更新成功！')
            })
    
})

// $route GET api/article/:id
//  @desc  数据详情接口
//  @access Private 
router.get("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Article.findOne({
            _id: req.params.id
        })
        .then(article => {
            if (!article) {
                res.status(404).json("没有任何内容！")
            }
            return res.json(article)
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router;
