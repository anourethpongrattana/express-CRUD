const { Schema, model } = require("mongoose")

const articleSchema = new Schema( {
    title: {
        type: String,
        unique: true,
        required: true,
        minLength: [5, "Title is too small"]

    },
    text: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Article = model("Article", articleSchema)
module.exports = Article