const { userModel } = require("../model/user")
const authRouter = require("express").Router()
const jwt = require("jsonwebtoken")

authRouter.post("/register", async(req, res, next) => {
    try {
        const {name, password, email} = req.body
        const existUser = await userModel.findOne({email})
        if(existUser) throw {message: "user already exists"}
        const newUser = new userModel({
            name,
            email,
            password
        })
        await newUser.save()
        return res.json({
            message: "new user created"
        })
    } catch (error) {
        next(error)
    }
})
authRouter.post("/login", async(req, res, next) => {
    try {
        const {password, email} = req.body
        const existUser = await userModel.findOne({email}, {__v: 0})
        if(!existUser) throw {message: "user not found"}
        if(existUser.password !== password) throw {message: "password dosen't match"}
        delete password
        jwt.sign({email, id: existUser._id, name: existUser.name}, "secretKey", (err, token) => {
            if(!err) return res.json({token})
                return res.json({error: err.message})
        })
    } catch (error) {
        next(error)
    }
})

module.exports = {
    authRouter
}