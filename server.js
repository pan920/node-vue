const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// 分页设置
const expressPaginate = require("express-paginate");
app.use(expressPaginate.middleware(10, 50));
// 使用users
const users = require("./routes/api/users")
const profiles = require("./routes/api/profiles")
const article = require("./routes/api/article")
const banner = require("./routes/api/banner")

// 使用body-parder 中间件
app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

//DB connect
const db = require("./config/keys").mongoURI;

// passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);

//connect to mongodb
mongoose.connect(db)
        .then(()=> console.log('连接成功'))
        .catch(err=> console.log("报错了："+err)) 

app.get("/",(req,res)=>{
    res.send('hellow world')
})
// 使用routes 
app.use("/api/users",users);
app.use("/api/profiles", profiles);
app.use("/api/article", article);
app.use("/api/banner", banner);

// 访问图片文件夹
app.use(express.static('uploads'));
app.get('/uploads/*', function (req, res) {
    res.sendFile(__dirname + "/" + req.url);
    // console.log("img:" + req.url);
})
// 
const port = process.env.PORT || 5000;
app.listen(port,() => {
    console.log(`server running on port ${port}`)
})

// 忽略

// npm install nodemon -g 全局安装nodemon 自动更新，不用重启node服务
// npm install jsonwebtoken 安装jwt设置token验证

// 前后端连载 安装 concurrently （将多个终端绑定在一起）
