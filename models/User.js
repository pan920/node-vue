const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const UserSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
     identity: { // 角色类别
         type: String,
         required: true
     },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model("users",UserSchema)