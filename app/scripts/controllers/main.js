'use strict';
 
(function(){
	var app = angular.module('portfolio', ['duScroll', 'angular-parallax', 'ngAnimate']);
	
	app.controller('ProjectsController', function ($scope, $http, $log, $document) {
		
		var projectsLoad = function(){
			$http.get('data/projects_summary.json')
				.then(onProjectComplete, onError);	
		};
		
		var onProjectComplete = function(response){
			$scope.projects = response.data.projects;
		};
		
		var onError = function(){
	    	$scope.error = 'Could fetch projects, please reload to try again.';
		};
		
		$scope.projectDetailsLoad = function(project){
			$scope.currentProject = project;
			$http.get('data/project_details.json')
				.then(onProjectDetailsComplete, onError);	
		};
		
		var onProjectDetailsComplete = function(response){
			$scope.projectDetails = response.data[$scope.currentProject];
			$scope.singleProjectView = true;
			
			$scope.ProjectImages = $scope.projectDetails.images;
			
			scrollToPosition('portfolio');
		};
		
		$scope.returnToProjects = function(){
			$scope.singleProjectView = false;
			scrollToPosition('portfolio');
		};
		
		var scrollToPosition = function(div){
			var duration = 1000,
				padding = 100,
			
				singleProjectElement = angular.element(document.getElementById(div));
				
		    $document.scrollToElement(singleProjectElement, padding, duration);
		};
		
		$scope.currentProject = null;
		$scope.singleProjectView = false;
		$scope.ProjectImages = null;
		
		projectsLoad();
	});
	
}());