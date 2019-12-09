// login register
const express = require("express");
const router = express.Router();
const passport = require("passport");
const Profiles = require("../../models/Profiles")
const jwt_decode = require("jwt-decode");

//
// 
// app.all('*', (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     req.method == "OPTIONS" ? res.sned(200) : next()
// })

// $route GET api/profiles/test
//  @desc 返回得请求得json数据
// @access public
router.get("/test",(req,res) => {
    res.json({msg:"Profiles接口测试成功！"})
})

// 
// $route POST api/profiles/regiter
//  @desc 返回得请求得json数据
router.post("/list",(req,res) => {
    res.json('list接口测试')
})

// $route POST api/profiles/add
//  @desc 新增信息接口
//  @access Private
router.post("/add",passport.authenticate('jwt',{session: false}),(req,res) => {
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    const decoded = jwt_decode(req.headers.authorization)
    profileFields.userId = decoded.id;
    new Profiles(profileFields).save().then(profile => {
        res.json(profile)
    })
})

// $route POST api/profiles/list
//  @desc 列表接口
//  @access Private 
router.get("/list",passport.authenticate('jwt',{session: false}),(req,res) => {
    const decoded = jwt_decode(req.headers.authorization)
    // console.log(decoded)
    // console.log(decoded.identity)
    Profiles.find()
            .then(profiles => {
                if (!profiles) {
                    res.status(404).json("没有任何内容！")
                }
                // return res.json(profiles)
                // 此处增加判断，将用户与数据对应，最高权限者可以查看所有数据
                const userId = {}
                if (decoded.identity != 'admin'){
                     userId.userId = decoded.id
                }
                
                Profiles.paginate(userId, {
                        page: req.query.page,
                        limit: req.query.limit,
                        sort:{ status:0,is_top: -1 }
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
                );

                // 
            })
            .catch(err => {
                console.log(err)
            })

})

// $route GET api/profiles/:id
//  @desc  单条数据接口
//  @access Private 
router.get("/:id",passport.authenticate('jwt',{session: false}),(req,res) => {
    Profiles.findOne({_id: req.params.id})
            .then(profiles => {
                if (!profiles) {
                    res.status(404).json("没有任何内容！")
                }
                return res.json(profiles)
            })
            .catch(err => {
                console.log(err)
            })
})

// $route POST api/profiles/edit/:id
//  @desc 编辑信息接口
//  @access Private
router.post("/edit/:id",passport.authenticate('jwt',{session: false}),(req,res) => {
    const profileFields = {};
    console.log(req.body)
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    console.log(profileFields)
    Profiles.findOneAndUpdate({_id: req.params.id},{$set:profileFields})
            .then(profiles => {
                res.json('更新成功！')
            })
    
})

// $route GET api/profiles/del/:id
//  @desc  删除数据接口
//  @access Private 
// params 取值 ？id之后
router.get("/del/:id",passport.authenticate('jwt',{session: false}),(req,res) => {
    Profiles.findByIdAndDelete({_id: req.params.id})
            .then(profiles => {
                return res.json(profiles)
            })
            .catch(err => {
                console.log(err)
            })
})

// 如何删除多个？



module.exports = router;
