const { Schema, model } = require("mongoose")

const Product = new Schema({
    name: String,
    desc: String,
    price: Number,
}, {timestamps: true})

const productModel = model("product", Product)
module.exports = {
    productModel
}