angular.module('citiesApp')
.service('aboutService',[ '$http', function ($http) {
  let serverUrl = 'localhost:3000/' 
  this.showRandomPOI = function () {
    return $http.get("http://"+serverUrl + "Users/PopularPOI");
}
}])
.controller('aboutController', ['$scope','$location', '$http', 'aboutService','localStorageModel', function ($scope,$location, $http, aboutService,localStorageModel) {

  aboutService.showRandomPOI()
    .then(function (response) {
        var length=response.data.poi.length-1
        var index= Math.floor(Math.random() * Math.floor(length))
        var index2=Math.floor(Math.random() * Math.floor(length))
        var index3=Math.floor(Math.random() * Math.floor(length))
        while(index2==index)
            index2=Math.floor(Math.random() * Math.floor(length))
        while(index2==index||index==index3||index2==index3)
            index3=Math.floor(Math.random() * Math.floor(length))
       
        $scope.name1= response.data.poi[index].POI_Name;
        $scope.name2= response.data.poi[index2].POI_Name;
        $scope.name3= response.data.poi[index3].POI_Name;
        $scope.url1 = response.data.poi[index].POI_Picture;
        $scope.url2 = response.data.poi[index2].POI_Picture;
        $scope.url3 = response.data.poi[index3].POI_Picture;
    },
    function (response) {
        //Second function handles error
        self.showRandomPOI.content = "Something went wrong with Register";   
    });
  }]);