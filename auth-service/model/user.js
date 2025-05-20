const { Schema, model } = require("mongoose")

const User = new Schema({
    name: String,
    email: String,
    password: String,
}, {timestamps: true})

const userModel = model("user", User)
module.exports = {
    userModel
}