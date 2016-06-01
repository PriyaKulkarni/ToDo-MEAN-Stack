var app = angular.module("appTodo", []);

app.controller("mainCtrl", function($scope, $http){
	$scope.formData = {};
	$scope.newItem = {};

	$scope.doneFilter = { done : true };
	$scope.notDoneFilter = { done : false };

	$http.get('/api/todos')
		.success(function(data){
			$scope.todos = data;
		});

	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function(data){
				$scope.todos = data;
				$scope.formData = {};
			});
	};

	$scope.updateTodo = function(id) {
		$http.put('/api/todos/'+id , $scope.newItem)
			.success(function(data) {
				$scope.todos = data;
				$scope.newItem = {};
			});
	};

	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
        	});
	};
});