var mongoose = require('mongoose')

var LunchSchema = new mongoose.Schema({
	time : {type:Date, default: Date.Now},
	joiner : [{type: mongoose.Schema.Types.ObjectId, ref : 'Joiner'}]
})

mongoose.model('Lunch', LunchSchema);