const mongoose = require('mongoose');
const mongoURI ='mongodb://localhost:27017/chitchat'

const connectToMongo= async ()=>{
    await mongoose.connect(mongoURI)
    console.log('Connected successfully')
}

module.exports = connectToMongo;