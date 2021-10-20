var mongoose = require("mongoose");

var bookschema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    mrp: Number,
    state: String,
    city: String,
    dist: String,
    phoneno: Number,
    email: String,
    instname: String,
    date: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("book",bookschema);