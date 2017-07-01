
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        index: { unique: true }
        // required: true
    },
    link: {
        type: String,
        index: { unique: true }
    },
    pic: {
        type: String,
        index: { unique: true }
    },
    savedNews: {
        type: Boolean
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;