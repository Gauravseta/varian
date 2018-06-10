angular.module('mainApp',['ui.bootstrap','angularMoment'])
        .controller('mainController',function($scope,moment,articleDataService){
            $scope.title = "Hacker News";
            $scope.currentPage = 1;
	        $scope.itemsPerPage=7;
	        $scope.maxSize = 3;
            var db;
            var request;
            var DB_NAME = "Articles";
            var STORE_NAME = "articles";
            var WRITE_MODE = "readwrite"
            $scope.searchResults = [];

            // Calculating the time past
            $scope.calculateTime = function(articleTime){
                return moment(articleTime,"MM/DD/YYYY HH:mm").fromNow();
            }

            // search the text entered and autocomplete
            $scope.searchArticle = function(txt){
                $scope.searchResults = [];
                if((txt.trim() !== '')){
                    var objectStore = getObjectStore(STORE_NAME,WRITE_MODE);
                    objectStore.openCursor().onsuccess = function(event){
                        var cursor = event.target.result;
                        if(cursor){
                            if(cursor.value.title.indexOf(txt) > -1){ //if found add to results
                                $scope.searchResults.push(cursor.value);
                            }
                            cursor.continue();
                        } else {
                            //Reached end of the array.Reflect the changes
                            $scope.$apply();
                        }
                    };
                }
            }

            //util to get the Store Object
            function getObjectStore(store_name, mode) {
                var tx = db.transaction(store_name, mode);
                return tx.objectStore(store_name);
            }

            //util to open indexedDB
            function openDB(){
                request = window.indexedDB.open(DB_NAME);

                request.onerror = function(event){

                }

                //if history clear or site loaded first time, create Object Store
                 request.onupgradeneeded = function(event){
                    db = event.target.result;
                    var objectStore = db.createObjectStore(STORE_NAME,{ keyPath: "id"});
                    objectStore.createIndex('title', 'title', { unique: true });
                } 

                request.onsuccess = function(event){
                     db = event.target.result;
                     //Fill the store
                     addInititalDataInStore();

                }
            }

            function addInititalDataInStore(){
                var objectStore = getObjectStore(STORE_NAME,WRITE_MODE);
                var req = objectStore.count();
                req.onsuccess = function(evt){
                    var count = evt.target.result;
                    if(!(count > 0)){
                        insertArray($scope.articles)
                    }

                }
            }

            function insertArray(arr){
                var tempArr = new Array();
                var objectStore = getObjectStore(STORE_NAME,WRITE_MODE);
                arr.forEach(function(d){
                    var req = objectStore.add(d);
                    req.onsuccess = function(){

                    }

                    req.onerror = function(){

                    }
                });
            }

            function init(){
                articleDataService.getAllArticles().then(function(success){
                    $scope.articles = success.data.slice(1);
                    $scope.totalArticles = $scope.articles.length;
                    //Fill the DB once all complete data is fetched
                    openDB();
                })
            }
            init();
        });