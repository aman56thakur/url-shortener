const shortid = require('shortid');
const Link = require('../models/links')

const getshortUrl = async (origUrl, callback) => {
    const isExisting = await Link.findOne({
        origUrl
    })
    if (isExisting) return callback(undefined, {
        newUrl: process.env.BASE_URL + isExisting.short_id
    })
    else {
        const user = new Link({
            origUrl,
            short_id: shortid.generate()
        })
        await user.save()

        const newUrl = process.env.BASE_URL + user.short_id
        callback(undefined, {
            newUrl
        })
    }
}

module.exports = getshortUrl