angular.module('citiesApp')
.service('POIPServices',[ '$http', function ($http) {

    this.poiName  = 'London Eye'

    let serverUrl = 'localhost:3000/' 

    this.getPOI = function () {
        return $http.get("http://"+serverUrl + "Users/POIName/"+this.poiName);
    }

}])
.controller('pageController', ['$scope','$location', '$http','POIPServices','localStorageModel', function ($scope,$location, $http, POIPServices, localStorageModel) {

self= this



POIPServices.getPOI()
.then(function (response) {
    $scope.POIName = POIPServices.poiName;
    $scope.POIPicture =  response.data.poi[0].POI_Picture
    $scope.Description = response.data.poi[0].Description
    $scope.NumOfViews = response.data.poi[0].Num_Of_Views
    $scope.Rank = response.data.poi[0].Rank_Per
    $scope.Review1 = response.data.poi[0].Review_Desc_1
    $scope.Review2 = response.data.poi[0].Review_Desc_2
    $scope.Review1Date =self.splitDate( response.data.poi[0].Review_Date_1)
    $scope.Review2Date =self.splitDate( response.data.poi[0].Review_Date_2)
  console.log(response)
},
function (response) {
    console.log(response) 
});

self.splitDate=  function(string){
    var array = string.split('T');
    var fullhour = array[1].split('Z')[0]
    var hourParts = fullhour.split(':')
    var date = array[0] + ' ' + hourParts[0] + ':' + hourParts[1];
    return date
}

}]);