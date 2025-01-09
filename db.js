const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/inotebook"

const connecttomongo = () =>{
    mongoose.connect(mongoURI).
    then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch(()=>{
        console.error('Error connecting to MongoDB:', error);
    })
}

module.exports = connecttomongo;