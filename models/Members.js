var mongoose = require('mongoose')

var MemberSchema = new mongoose.Schema({
	name : String,
	money : {type : Number, default : 0},
	order : [{type: mongoose.Schema.Types.ObjectId, ref : 'Lunch'}]
})

MemberSchema.methods.calcbanlance = function(m){
	this.money -= m;
	this.save();
}

MemberSchema.methods.clean = function(){
	this.money = 0;
	this.save();
}

MemberSchema.methods.addmoney = function(m){
	this.money += m;
	this.save();
}

mongoose.model('Joiner', MemberSchema)