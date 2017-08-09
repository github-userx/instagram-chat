module.exports = function(app) {
	app.filter('reverse', function() {
		return function(items) {
			return items.slice().reverse();
		};
	});

	app.controller("ThreadController", function(user, $http, $scope, $stateParams, $rootScope) {
		$scope.thread = [];

		var oldLast;

		$scope.$watch('thread', function() {
			if(oldLast == undefined || oldLast != $scope.thread[0]){
				oldLast = $scope.thread[0]

				$(".scroll-container").animate({ scrollTop: $(".scroll-container").prop("scrollHeight") }, "slow");
				setTimeout(() => {
					$(".scroll-container").animate({ scrollTop: $(".scroll-container").prop("scrollHeight") }, "slow");
				}, 500);
			}
		});

		setTimeout(() => {
			$scope.loaded = true;
		}, 500);

		$scope.cursor = null;

		$scope.getName = function(id){
			return $rootScope.users[id].fullName || $rootScope.users[id].username || "unknown";
		}

		$scope.getPhoto = function(id){
			return $rootScope.users[id].picture;
		}

		$scope.loadMore = function(){
			if($scope.loaded && !$scope.end){
				$scope.loaded = false;

				$http.get("/instagram/messagess/"+$stateParams.id+"/"+$scope.cursor).then(function(data){
					$scope.thread = $scope.thread.concat(data.data.messagess);

					if($scope.cursor == data.data.cursor){
						$scope.end = true;
					}

					$scope.cursor = data.data.cursor;
					$scope.loaded = true;
				})
			}
		}

		user.checkStatus().then(function() {
			if(user.isAuthenticated()){
				$http.get("/instagram/messagess/"+$stateParams.id).then(function(data){
					$scope.thread = data.data.messagess;

					$scope.cursor = data.data.cursor;
					console.log($scope.thread);
				})
			}
		});
	});
}

