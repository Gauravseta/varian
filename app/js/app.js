angular.module('mainApp',['ui.bootstrap','angularMoment'])
        .controller('mainController',function($scope,moment,articleDataService){
            $scope.title = "Hacker News";

            $scope.currentPage = 1;
	        $scope.itemsPerPage=7;
	        $scope.maxSize = 3;

            $scope.calculateTime = function(articleTime){
                return moment(articleTime,"MM/DD/YYYY HH:mm").fromNow();
            }

            function init(){
                articleDataService.getAllArticles().then(function(success){
                    console.log(success);
                    $scope.articles = success.data.slice(1);
                    $scope.totalArticles = $scope.articles.length;
                })
            }
            init();
        });