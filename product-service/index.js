const express = require("express")
const app = express()
const {productRouter} = require("./handler/product")
require("dotenv").config()
const {PORT} = process.env
require("./config/mongoose.config")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/product", productRouter)

app.use((req, res, next) => {
    return res.json({error: "NotFound"})
})
app.use((error, req, res, next) => {
    return res.json({error: error.message})
})
app.listen(PORT, () => {
    console.log(`product-service running on port: ${PORT}`);
})