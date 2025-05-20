const { Schema, model } = require("mongoose")

const Order = new Schema({
    products: [{
        _id: String
    }],
    userEmail: String,
    totalPrice: Number,
}, {timestamps: true})

const orderModel = model("order", Order)
module.exports = {
    orderModel
}