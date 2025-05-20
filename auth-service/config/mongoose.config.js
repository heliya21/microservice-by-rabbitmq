const { default: mongoose } = require("mongoose")

const DB_URL = "mongodb://localhost:27017/auth-service"
mongoose.connect(DB_URL)
.then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log("error:", err)
})
