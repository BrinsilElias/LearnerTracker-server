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

// Login Authentication
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

// Retrieiving Learners Data
app.get('/learnersdata', async (req, res) => {
    let data = await learnerModel.find()
    res.json(data)
})

// Retrieiving Training Head Data
app.get('/thusersdata', async (req, res) => {
    let data = await userModel.find({"role": "training head"})
    res.json(data)
})

// Retrieiving Placement Officer Data
app.get('/pousersdata', async (req, res) => {
    let data = await userModel.find({"role": "placement officer"})
    res.json(data)
})

// Retrieiving Data Stats
app.get('/datastat', async (req, res) => {
    let thCount = await userModel.countDocuments({"role": "training head"})
    let poCount = await userModel.countDocuments({"role": "placement officer"})
    let learnerCount = await learnerModel.countDocuments()
    let qualifiedCount = await learnerModel.countDocuments({"status": "qualified"})
    let placedCount = await learnerModel.countDocuments({"placement": "placed"})
    try {
        let decoded = await jwt.verify(req.query.token, "learnertracker")
        if(decoded && decoded.email){
            res.json(
                {"traininghead": thCount, 
                "placementofficer": poCount, 
                "learners": learnerCount, 
                "qualified": qualifiedCount,
                "placed": placedCount
            })
        }else{
            res.json({status: "Unauthorized Access"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

// Add learners data
app.post('/learner/add', async (req, res) => {
    const data = new learnerModel(req.body)
    try {
        let decoded = await jwt.verify(req.body.token, "learnertracker")
        if(decoded && decoded.email){
            data.save()
            res.json({status: "Data Saved"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

// Add users data
app.post('/user/add', async (req, res) => {
    const data = new userModel(req.body) 
    try {
        let decoded = await jwt.verify(req.body.token, "learnertracker")
        if(decoded && decoded.email){
            data.save()
            res.json({status: "Data Saved"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

// Edit learners data
app.post('/:id/learner/edit', async (req, res) => {
    const id = req.params.id
    try {
        let decoded = await jwt.verify(req.body.token, "learnertracker")
        if(decoded && decoded.email){
            let data = await learnerModel.findOneAndUpdate({"_id": id}, req.body)
            res.json({status: "Data Edited"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

// Edit learners data
app.post('/:id/user/edit', async (req, res) => {
    const id = req.params.id
    try {
        let decoded = await jwt.verify(req.body.token, "learnertracker")
        if(decoded && decoded.email){
            let data = await userModel.findOneAndUpdate({"_id": id}, req.body)
            res.json({status: "Data Edited"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

// Delete data
app.post('/:role/:id/delete', async (req, res) => {
    const id = req.params.id
    const role = req.params.role
    try {
        let decoded = await jwt.verify(req.body.token, "learnertracker")
        if(decoded && decoded.email){
            if(role === 'training head' || role === 'placement officer'){
                const data = await userModel.findByIdAndDelete(id)
            }else{
                const data = await learnerModel.findByIdAndDelete(id)
            }
            res.json({status: "Data Deleted"})
        }
    } catch (err) {
        res.json({status: "Unauthorized Access"})
    }
})

app.listen(port, () => {
    console.log(`app running on port http://localhost:${port}`)
})