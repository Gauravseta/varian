angular.module('mainApp')
        .factory('articleDataService',function($http){
                        var obj = this;

                        // Can also be hardcoded to return from json file
                        obj.getAllArticles = function(){
                           return $http.get('http://starlord.hackerearth.com/hackernews');
                        }

                        return obj;
                    });