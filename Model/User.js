const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        email: String,
        password: String,
        course: String,
        project: String,
        role: String
    }
)

const userModel = mongoose.model(
    "Users", userSchema
)

module.exports = {userModel}