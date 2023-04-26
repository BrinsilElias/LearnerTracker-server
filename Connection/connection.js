const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.MongoDB_URI,{useNewUrlParser: true})
.then(()=>{
    console.log('MongoDB Coneection Established')
})
.catch((err)=>{
    console.log('Error in Connection : ' + err)
})