
// shortid is a library which creates unique short identifier
const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
	full: {
		type: String,
		required: true
	},
	short: {
		type: String,
		required: true,
		default: shortId.generate
	},
	clicks: {
		type: Number,
		required: true,
		default: 0
	}
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)
// it takes 2 paramer - pehla the name of the model and doosra the schema