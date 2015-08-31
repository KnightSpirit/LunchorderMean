var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Lunch = mongoose.model('Lunch')
var Joiner = mongoose.model('Joiner')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:name', function(req, res, next) {
  res.render(req.params.name);
});

router.get('/i/gAllInfo', function(req, res, next){
	Joiner.find({}, function(err, joiners){
		res.json(joiners)
	})
})

router.post('/clean', function(req, res, next){
	var joiner = req.body
	Joiner.findOne({name: joiner.name}, function(err, j){
		if (err) {return};
		j.clean()
		res.json(j)
	})
})

router.post('/addmoney', function(req, res, next){
	var joiner = req.body
	Joiner.findOne({name: joiner.jo.name}, function(err, j){
		if (err) {return};
		j.addmoney(joiner.amoney)
		res.json(j)
	})
})

router.post('/postOrder', function(req, res, next){
	var joiners = req.body;
	var lunch = new Lunch();
	lunch.save(function(err, lunch){
		if (err) {console.log(err)};
	})
	var index = 0;
	for (var i = 0; i < joiners.length; i++) {
		Joiner.find({name: joiners[i].name}, function(err, joiner){
			if (joiner.length != 0) { 
				var one = joiner[0];
				one.calcbanlance(Number(joiners[index++].money))
				return
			};
			var j = new Joiner(joiners[index])
			j.order = lunch
			j.money = 0 - Number(joiners[index].money)
			j.save(function(err, j){
				if (err) { console.log(err); }
			})
			index++;
		})
	};
	res.json({n:2})
})
module.exports = router;
