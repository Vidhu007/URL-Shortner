

const express = require('express')
const app = express()
const mongoose = require('mongoose')
// import the model here
const ShortURL = require('./models/url')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
	const allData = await ShortURL.find()
	res.render('index', { shortUrls: allData })
	// hum index file ko shortUrls de rahe hain
	// We pass variables as the second argument, which we can then access in the EJS file. 
})

// after user pressed "Shrink"
app.post('/short', async (req, res) => {
	// Grab the fullUrl parameter from the req.body
	const fullUrl = req.body.fullUrl
	console.log('URL requested: ', fullUrl)

	// insert and wait for the record to be inserted using the model
	const record = new ShortURL({
		full: fullUrl
	})

	// baaki short: aur count: mein default values chali jaayngi automatically

	await record.save()
	// save to the database

	res.redirect('/')
	// after saving redirect to the main site with updated table of short and long url with count
})

// after user opens a short url
app.get('/:shortid', async (req, res) => {
	// grab the :shortid param
	const shortid = req.params.shortid

	// perform the mongoose call to find the long URL
	const rec = await ShortURL.findOne({ short: shortid })

	// if null, set status to 404 (res.sendStatus(404))
	if (!rec) return res.sendStatus(404)

	// if not null, increment the click count in database
	rec.clicks++
	await rec.save()

	// redirect the user to original link
	res.redirect(rec.full)
})

// Setup your mongodb connection here
mongoose.connect('mongodb://localhost/shortURL', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async () => {
	// Wait for mongodb connection before server starts

	// URLs for testing purpose
	// await ShortURL.create({ full: 'http://google.com', short: 'wow' })
	// await ShortURL.create({ full: 'http://codedamn.com' })

	app.listen(process.env.PUBLIC_PORT || 3000, () => {
		console.log('Server started')
	})
})
