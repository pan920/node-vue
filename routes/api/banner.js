// login register
const express = require("express");
const router = express.Router();
const passport = require("passport");
const Banner = require("../../models/Banner")
const jwt_decode = require("jwt-decode");
const multer = require("multer");
//
// $route GET api/article/test
//  @desc 返回得请求得json数据
// @access public
router.get("/test",(req,res) => {
    res.json({msg:"Banner接口测试成功！"})
})

// $route POST api/banner/add
//  @desc 新增banner接口
//  @access Private
router.post("/add",passport.authenticate('jwt',{session: false}),(req,res) => {
    const bannerFields = {};
    if (req.body.type) bannerFields.type = req.body.type;
    if (req.body.file) bannerFields.file = req.body.file;
    if (req.body.describe) bannerFields.describe = req.body.describe;
    if (req.body.status) bannerFields.status = req.body.status;
    if (req.body.is_top) bannerFields.is_top = req.body.is_top;
    if (req.body.publish_time) bannerFields.publish_time = req.body.publish_time;
    const decoded = jwt_decode(req.headers.authorization)
    bannerFields.userId = decoded.id;
    bannerFields.author = decoded.name;
    new Banner(bannerFields).save().then(banner => {
        res.json(banner)
    })
})

// $route POST api/banner/list
//  @desc banner列表接口
//  @access Private 
router.post("/list",passport.authenticate('jwt',{session:false}),(req,res) => {
    const decoded = jwt_decode(req.headers.authorization)
    Banner.find()
           .then(banner => {
               if (!banner) {
                   res.status(200).json("暂时没有banner！")
               }
               // 此处增加判断，将用户与数据对应，最高权限者可以查看所有数据
               const userId = {}
               if (decoded.identity != 'admin') {
                   userId.userId = decoded.id
               }

               Banner.paginate(userId, {
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
// $route POST api/banner/edit/:id
//  @desc 编辑banner接口
//  @access Private
router.post("/edit/:id",passport.authenticate('jwt',{session: false}),(req,res) => {
    const bannerFields = {};
    if (req.body.type) bannerFields.type = req.body.type;
    if (req.body.file) bannerFields.file = req.body.file;
    if (req.body.describe) bannerFields.describe = req.body.describe;
    if (req.body.status) bannerFields.status = req.body.status;
    if (req.body.is_top) bannerFields.is_top = req.body.is_top;
    if (req.body.publish_time) bannerFields.publish_time = req.body.publish_time;
    Banner.findOneAndUpdate({_id: req.params.id},{$set:bannerFields})
            .then(banner => {
                res.json('更新成功！')
            })
    
})

// $route GET api/banner/:id
//  @desc  数据详情接口
//  @access Private 
router.get("/:id", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Banner.findOne({
            _id: req.params.id
        })
        .then(banner => {
            if (!banner) {
                res.status(404).json("没有任何内容！")
            }
            return res.json(banner)
        })
        .catch(err => {
            console.log(err)
        })
})

// 图片上传接口
// var upload = multer({ dest: 'uploads/'}) // 文件储存路径
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})
var upload = multer({ storage: storage })

router.post('/upload', upload.any(), function(req, res, next) {
    let file = req.files.path;
    console.log(req)
    console.log(file)
    res.json({
        pic_url: req.files.path
    });
});

module.exports = router;
