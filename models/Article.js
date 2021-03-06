const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

// create schema 列表字段
const ArticleSchema = new Schema({
    type: {
        type: String
    },
    title: {
        type:String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    describe: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
     status: {
         type: String,
         required: true
     },
    is_top: {
        type: Boolean,
        required: true
    },
    publish_time: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true 
    }
})
ArticleSchema.plugin(mongoosePaginate)
module.exports = Article = mongoose.model("crticle", ArticleSchema)