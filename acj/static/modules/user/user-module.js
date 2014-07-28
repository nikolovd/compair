// TODO
// Insert short explanation of what this module does, for this module, it'd be:
// An example/template of how to create functionally isolated modules in
// Angular for organizing code.

// Isolate this module's creation by putting it in an anonymous function
(function() {

var module = angular.module('ubc.ctlt.acj.user', ['ngResource']);

/***** Providers *****/
module.factory('UserResource', function($resource) {
	var ret = $resource('/api/users/:id', {id: '@id'},
		{
			'getUserCourses':
			{
				method: 'GET',
				url: '/api/users/:id/courses'
			}
		}
	);
	ret.MODEL = "Users";
	return ret;
});
module.factory('UserTypeResource', function($resource) {
	var ret = $resource('/api/usertypes/:id', {id: '@id'});
	ret.MODEL = "UserTypesForSystem";
	return ret;
});


/***** Controllers *****/
// TODO declare controllers here, e.g.:
module.controller("UserCreateController",
	function($scope, $log, $routeParams, UserResource, AuthenticationService, Authorize, UserTypeResource, Toaster)
	{
		$scope.usertypes = {};
		$scope.user = {};
		UserTypeResource.query(
			function (ret)
			{
				$scope.usertypes = ret;
				$scope.user.usertypesforsystem_id = $scope.usertypes[0].id;
			},
			function (ret)
			{
				Toaster.reqerror("Unable to retrieve the user types", ret);
			}
		);
		$scope.userSubmit = function () {
			$scope.submitted = true;
			UserResource.save({},$scope.user).$promise.then(
				function (ret)
				{
					$scope.submitted = false;
					Toaster.success("New User Created!",
						'"' + ret.displayname + '"' +'should now have access.');
				},
				function (ret)
				{
					$scope.submitted = false;
					if (ret.status == '409') {
						Toaster.error(ret.data.error);
					} else {
						Toaster.reqerror("Unable to create new user.", ret);
					}
				}
			);
		};
	}
);

// End anonymous function
})();
