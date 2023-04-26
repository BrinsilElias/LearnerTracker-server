const mongoose = require('mongoose')

const learnerSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        course: String,
        project: String,
        batch: String,
        status: String,
        placement: String,
    }
)

const learnerModel = mongoose.model(
    "Learners", learnerSchema
)

module.exports = {learnerModel}