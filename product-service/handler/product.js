const { isAuthenticated } = require("../../isAuthenticated")
const { pushToQueue, createQueue } = require("../config/rabbitmq")
const { productModel } = require("../model/product")
const productRouter = require("express").Router()

productRouter.post("/create", async(req,res, next) => {
    try {
        const {name, desc, price} = req.body
        const newProduct = new productModel({name, desc, price})
        await newProduct.save()
        return res.json({
            message: "new product created", product: newProduct
        })
    } catch (error) {
        next(error)
    }
})
productRouter.post("/buy", isAuthenticated, async(req, res, next) => {
    try {
        const {productIDs = []} = req.body
        const products = await productModel.find({_id: {$in: productIDs}})
        const {email} = req.user
        await pushToQueue("ORDER", {products, userEmail: email})
        const channel = await createQueue("PRODUCT")
        channel.consume("PRODUCT", msg => {
            console.log(JSON.parse(msg.content.toString()));
        })
        return res.json({
            message: "your order was recieved"
        })
    } catch (error) {
        next(error)
    }
})

module.exports = {
    productRouter
}