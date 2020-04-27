const express = require('express')
const hbs = require('hbs')
const path = require('path')
const dns = require('dns')
require('../db/mongoose')
const shortener = require('./utils/shortener')
const Link = require('./models/links')

const app = express()
const port = process.env.PORT

// Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const templateDirectory = path.join(__dirname, '../templates/views')
const partialsDirectory = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', templateDirectory)
hbs.registerPartials(partialsDirectory)

//Setup directory to serve
app.use(express.static(publicDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title: 'URL Shortener',
        name: 'Aman Thakur'
    })
})

// Create a new URL
app.post('/new', async (req, res) => {

    // Check if URL was provided
    const orgUrl = req.query.orgUrl
    if (!orgUrl) {
        return res.status(400).send({
            error: 'Please provide original URL'
        })
    }

    // Validate the provided URL
    let originalUrl
    try {
        originalUrl = new URL(orgUrl);
    } catch (err) {
        return res.status(400).send({
            error: 'Invalid URL'
        });
    }

    await dns.lookup(originalUrl.hostname, (err) => {
        if (err) {
            return res.status(404).send({
                error: 'Address not found'
            });
        };
    });

    // Get shortened URL
    await shortener(orgUrl, (error, shortUrl) => {
        if (error) return res.send({
            error
        })
        res.send(shortUrl)
    })
})

// Redirect to original URL
app.get('/*', async (req, res) => {
    const exists = await Link.findOne({
        short_id: req.params[0]
    })
    if (exists) res.redirect(exists.origUrl)
    else {
        res.render('404', {
            errorType: 'Page not found',
        })
    }
})

// Page not found
app.get('*', (req, res) => {
    res.render('404', {
        errorType: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up and running on port', port)
})