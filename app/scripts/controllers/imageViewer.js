'use strict';
 
(function(){

	var imageInit = function(){
		return {
			controller : function($scope, $log, $window){
				
				var w = angular.element($window);	
				
				this.win = w;			
				
				this.resize = function(){
					
					$scope.activeImage = angular.element.find('img.active');
					
					if($scope.activeImage.length !== 0){
						
						var imageSize = getImageSize($scope.activeImage[0]),
							winSize = getWinSize();
							
						setMargin(imageSize, winSize);
					}
				};
				
				$scope.activeImage = null;

				var getImageSize = function(elem){
					return { imageWidth :elem.offsetWidth, imageHeight: elem.offsetHeight };
				};
				
				var getWinSize = function(){
					return { winWidth : w[0].innerWidth, winHeight : w[0].innerHeight };
				};
				
				var setMargin = function(imageSize, winSize){
					var left = (winSize.winWidth - imageSize.imageWidth)/2;
					var top = (winSize.winHeight - imageSize.imageHeight)/2;					
					$scope.activeImage[0].style.left = left + 'px';	
					$scope.activeImage[0].style.top = top + 'px';	
				};
				
				this.selectedImageIndex = null;
				this.gallery = null;
				this.totalImages = null;
				
				this.displayGallery = function(state){
					if(state){
						this.gallery.fadeIn('fast');
					}
					else{
						this.gallery.fadeOut('fast');
					}
				};
				
				this.displaySelectedImage = function(){
				
					if(this.imageGalleryLength() !== 1){
						if(this.selectedImageIndex > (this.imageGalleryLength() - 1)){
							this.selectedImageIndex = 0;
						}
						else if(this.selectedImageIndex < 0){
							this.selectedImageIndex = this.imageGalleryLength() - 1;
						}
						this.gallery.find('nav').show();
					}
					else{
						this.gallery.find('nav').hide();
					}
				
					var selectedImage = this.gallery.find('li').eq(this.selectedImageIndex).find('img');					
					selectedImage.addClass('active').fadeIn('fast');
				};
				
				this.unselectImage = function(){
					var images = this.gallery.find('li').find('img');
					images.removeClass('active').hide();	
				};	
				
				this.imageGalleryLength = function(){
					return this.gallery.find('img').length;
				};	
			},
					
		};
	};

	var imageViewer = function(){
		return {
			require : '^imageInit',
			scope : {
				images : '='
			},
			templateUrl : 'views/gallery.html',
			link : function($scope, element, attrs, imageInit){
				
				imageInit.gallery = element;
			
				imageInit.win.bind('resize', function(){
					imageInit.resize();
				});
				
				element.find('#galleryLightbox').bind('click', function(){
					imageInit.displayGallery(false);
					imageInit.unselectImage();
				});
				
				element.find('#prevGalleryImage').bind('click', function(){
					navigateGallery(imageInit.selectedImageIndex - 1);
				});
				
				element.find('#nextGalleryImage').bind('click', function(){
					navigateGallery(imageInit.selectedImageIndex + 1);
				});
				
				element.find('#closeGallery').bind('click', function(){
					imageInit.displayGallery(false);
					imageInit.unselectImage();
				});
				
				var navigateGallery = function(direction){
					imageInit.selectedImageIndex = direction;
					imageInit.unselectImage();
					imageInit.displaySelectedImage();
					imageInit.resize();					
				};
			}
		};
	};
	
	var imageSelector = function(){
		return {
			require:'^imageInit',
			link:function($scope, element, attrs, imageInit){
				element.bind('click', function(){
				
					imageInit.selectedImageIndex = parseInt(element[0].dataset.index);
				
					imageInit.displayGallery(true);
					imageInit.displaySelectedImage();
					imageInit.resize();
				});
			}
		};	
	};
	
	
	angular.module('portfolio')
		.directive('imageInit', imageInit)
		.directive('imageViewer', imageViewer)
		.directive('imageSelector', imageSelector);
	
}());

/*
(function(){

	var imageViewer = function(){
		return {
			template : '<ul><li ng-repeat="image in projectDetails.images"><img src="{{image}}"/></li></ul>'	
		};
	};
	
	angular.module('portfolio')
		.directive('imageViewer', imageViewer);
	
}());
*/