// login register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // 对密码进行加密
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const app = express()
const passport = require("passport");
const jwt_decode = require("jwt-decode");

const User = require("../../models/User")
const Profiles = require("../../models/Profiles")
app.all('*', (req, res) => {
    res.header("Access-Control-Allow-Origin","*")
    req.method == "OPTIONS" ? res.sned(200) :next()
})

// $route GET api/users/test
//  @desc 返回得请求得json数据
// @access public
router.get("/test",(req,res) => {
    res.json({msg:"接口测试成功！"})
})

// 
// $route POST api/users/regiter
//  @desc 返回得请求得json数据
// 注册
router.post("/register",(req,res) => {
    // console.log('88')
   
    // console.log(req.body)
    // 查询数据库中是否拥有邮箱
    User.findOne({email:req.body.email})
        .then((user) => {
            if(user){
                return res.status(400).json("邮箱已被注册！")
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password:req.body.password,
                    identity: req.body.identity
                })

                bcrypt.genSalt(10, function(err,salt) {
                    bcrypt.hash(newUser.password, salt, function(err,hash) {
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                    })
                })
            }
        })
})

// $route POST api/users/login
//  @desc 返回token jwt passport
// @access public 登陆
router.post("/login",(req,res) =>{
    const email = req.body.email;
    // return res.send(email)
    const password = req.body.password;
    // 查询数据库
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json("用户不存在！");
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if(isMatch){
                        //   res.json({msg:'验证成功'})
                        // 返回token
                        // jwt.sign("规则","加密名字","过期时间","箭头函数")
                        const rule = {id:user.id,name:user.name,identity:user.identity}
                        jwt.sign(rule, keys.secretOrKey, {expiresIn:3600}, (err,token)=>{
                            if (err) throw err
                            res.json({
                                success:true,
                                token:"Bearer "+token
                            })
                        })
                      }else{
                          return res.status(400).json("密码错误！")
                        //   return res.json({
                        //     code: 400,
                        //     message:"密码错误！"
                        //   })
                      }
                  })
        })
})

// $route GET api/users/current
//  @desc return current user
// @access Private
// npm install passport 
router.get("/current", passport.authenticate("jwt",{session:false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

// $route POST api/users/edit
//  @desc 用户资料修改
// @access Private
router.get("/edit/:id", passport.authenticate("jwt",{session:false}), (req, res) => {
    User.findOne({
            _id: req.params.id
        })
        .then(user => {

        })
})

// $route GET api/users/user-list
//  @desc 用户列表
// @access Private
router.get("/user-list", passport.authenticate("jwt",{session:false}), (req, res) => {
    const decoded = jwt_decode(req.headers.authorization)
    User.find()
        .then(user => {
            if (!user) {
                res.status(200).json("暂时没有用户！")
            }
            // 此处增加判断，将用户与数据对应，最高权限者可以查看所有数据
            const userId = {}
            if (decoded.identity != 'admin') {
                res.status(400).json("无接口权限！")
            }

            User.paginate(userId, {
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

// 数据统计模块
// $route GET api/users/getNum
// @desc return 数据统计
// @access Private
router.get("/getNum", passport.authenticate("jwt",{session:false}), (req, res) => {
    // 用户总数
    User.count()
        .then(user => {
        // 列表条数
        Profiles.count()
                .then(files => {
                return res.json({
                    userNum: user,
                    filesNum: files
                })
            })
    })
    
   
})

// 特殊查询
router.get("/diff",passport.authenticate("jwt",{session:false}),(req,res) => {
    
})

module.exports = router;
