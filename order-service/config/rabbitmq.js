const amqp = require("amqplib");
const { orderModel } = require("../model/order");

let channel;
const connectToChannel = async() => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        return (await connection.createChannel())
    } catch (error) {
        console.log("couldn't connect to rabbitMQ server");
    }
}
const returnChannel = async() => {   
    if(!channel) {
        channel = await connectToChannel()
    }
    return channel
}
const createQueue = async(queueName) => {
    const channel = await returnChannel()
    await channel.assertQueue(queueName)
    return channel
}
const pushToQueue = async(queueName, data) => {
    try {
         await returnChannel()
        channel.assertQueue(queueName)
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log(error.message);
    }
}
const createOrderWithQueue = async(queueName) => {
    await createQueue(queueName)
    channel.consume(queueName, async msg => {
        if(msg.content) {
            const {products, userEmail} = JSON.parse(msg.content.toString())
            const newOrder = new orderModel({products, userEmail, totalPrice: (products.map(p => +p.price)).reduce((prev, curr) => prev + curr, 0)})
            await newOrder.save()
            channel.ack(msg)
            pushToQueue("PRODUCT", newOrder)
        }
    })
}

module.exports = {
    connectToChannel,
    returnChannel,
    pushToQueue,
    createOrderWithQueue,
    createQueue
}