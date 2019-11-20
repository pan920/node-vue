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
    describe: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
     exam: {
         type: Boolean,
         required: true
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
ArticleSchema.plugin(mongoosePaginate)
module.exports = Article = mongoose.model("crticle", ArticleSchema)