const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    origUrl: {
        type: String,
        required: true
    },
    short_id: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

const Link = mongoose.model('Link', userSchema)
module.exports = Link