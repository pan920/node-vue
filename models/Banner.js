const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

// create schema 列表字段
const BannerSchema = new Schema({
    file: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    describe: {
        type: String
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
BannerSchema.plugin(mongoosePaginate)
module.exports = Banner = mongoose.model("banner", BannerSchema)