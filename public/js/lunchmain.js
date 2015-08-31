var app = angular.module('lunchMain', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('starto', {
			url:'/starto',
			templateUrl:'/addorder',
			controller : 'lunchFunction',
			resolve: {
				infoPromise: ['joiner', function(joiner){
					joiner.getAllInfo()
				}]
			}

		})
		.state('getdetail',{
			url:'/getdetail',
			templateUrl:'/getdetail',
			controller : 'detailctrl',
			resolve: {
				infoPromise: ['joiner', function(joiner){
					joiner.getAllInfo()
				}]
			}
		})
}])

app.controller('detailctrl', ['$scope', 'joiner', function($scope, joiner){
	$scope.usersInfo = joiner.usersInfo

	$scope.$watch(
		function() { return joiner.usersInfo}, 
		function(newv, old){
			if (newv != old) {
				$scope.usersInfo = newv
			};
	    });
	$scope.ctmd = function(m, index){
		joiner.addmoney(m, index)
	}
	$scope.clearToZero = function(index) {
		joiner.update(index)
	}
}])


app.controller('lunchFunction', ['$scope', '$http', 'lunchorder', 'joiner', function($scope, $http, lunchorder, joiner){
	$scope.usersInfo = joiner.usersInfo
    $scope.items = [];
	$scope.addjoiner = function(){
		$scope.items.push({
			name:"",
			money: 0
		})
	}

	$scope.removejoiner = function(index){
		$scope.items.splice(index, 1)
	}

	$scope.setvalueforinput = function(index, name){
		$scope.items[index].name = name
	}

	$scope.postOrder = function(){
		lunchorder.create($scope.items);
	}
}])

app.factory('joiner', ['$http', '$state', function($http, $state){
	var jj = {};
	jj.usersInfo = [];
	jj.getAllInfo = function(){
		return $http.get('/i/gAllInfo').success(function(data){
			jj.usersInfo = [];
			angular.copy(data, jj.usersInfo);
		})
	}

	jj.addmoney = function(m, index) {
		$http.post('/addmoney', {amoney:Number(m), jo: jj.usersInfo[index]}).success(function(data){
			console.log(data)
			jj.usersInfo[index] = data
		})
	}
	jj.update = function(index) {
		$http.post('/clean', jj.usersInfo[index]).success(function(data){
			jj.usersInfo[index] = data
		})
	}
	return jj
}])

app.factory('lunchorder', ['$http', '$state', function($http, $state){
	var order = {};

	order.create = function(joinerdetails){
		$http.post('/postOrder', joinerdetails).then(function(data){
			$state.go('getdetail')
		})
	}

	return order
}])