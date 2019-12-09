const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
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
UserSchema.plugin(mongoosePaginate)
module.exports = User = mongoose.model("users",UserSchema)