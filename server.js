const port = 8080
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')

const app = express()
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

require('./Connection/connection.js')
const { learnerModel } = require('./Model/Learner.js')
const { userModel } = require('./Model/User.js')


app.get('/', (req, res) => {
    res.json("Server is working")
})

app.post('/login', async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    let user = await userModel.findOne({"email": email})
    if(user && password == user.password) {
        const userData = {
            "id": user._id,
            "name": user.name,  
            "role": user.role
        }
        jwt.sign({email: user.email, id: user._id}, "learnertracker", {expiresIn: "1d"}, (error, token) => {
            if(error){
                res.json({status: "Token not Generated"})
            }else{
                res.json({status: "Authentication Successful", userData: userData, token: token})
            }
        })
    }else{
        res.json("Authentication Failed")
    }
})

app.get('/learnersdata', async (req, res) => {
    let data = await learnerModel.find()
    res.json(data)
})

app.get('/thusersdata', async (req, res) => {
    let data = await userModel.find({"role": "training head"})
    res.json(data)
})

app.get('/pousersdata', async (req, res) => {
    let data = await userModel.find({"role": "placement officer"})
    res.json(data)
})

app.get('/datastat', async (req, res) => {
    let thCount = await userModel.countDocuments({"role": "training head"})
    let poCount = await userModel.countDocuments({"role": "placement officer"})
    let learnerCount = await learnerModel.countDocuments()
    let qualifiedCount = await learnerModel.countDocuments({"status": "qualified"})
    let placedCount = await learnerModel.countDocuments({"placement": "placed"})
    res.json(
        {"training head": thCount, 
        "placement officer": poCount, 
        "learners": learnerCount, 
        "qualified": qualifiedCount,
        "placed": placedCount
    })
})

app.listen(port, () => {
    console.log(`app running on port http://localhost:${port}`)
}) 