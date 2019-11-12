const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

// create schema 列表字段
const ProfileSchema = new Schema({
    type: {
        type: String
    },
    describe: {
        type: String
    },
    income: {
        type: String,
        required: true
    },
    expend: {
        type: String,
        required: true
    },
    cash: {
        type: String,
        required: true
    },
     remark: {
         type: String
     },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true 
    }
})
ProfileSchema.plugin(mongoosePaginate)
module.exports = Profile = mongoose.model("profile", ProfileSchema)