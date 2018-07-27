angular.module('citiesApp')
.service('HomeServices',[ '$http', function ($http) {


}])


.controller('HomeController', ['$scope','$location', '$http','$window','POIPServices', 'HomeServices','localStorageModel', function ($scope,$location, $http,$window,POIPServices, HomeServices, localStorageModel) {


    self = this;   
    let serverUrl = 'localhost:3000/'
    $scope.fav = localStorageModel.getLocalStorage("favorites")
    let token;

    self.setToken= function(){
        self.token = localStorageModel.getLocalStorage("token");

    }

    self.setToken();

    $scope.saveFavAtLocalStorage= function (fav) {
        localStorageModel.updateLocalStorage("favorites",fav)
    }

    $http.get("http://"+serverUrl + "POI/GetUser2PopularPOI?token="+ self.token)
     .then(function (response) {
         $scope.recordsPop = response.data.poi
    }, function (response) {
        console.log(response)
    });

   $http.get("http://"+serverUrl + "POI/RecentSavedPOI?token="+ self.token)
   .then(function (response) {
    if(response.data=="FALSE"){
        $scope.isEmpty = true
        $scope.massage1 ="You did not save any point of interest yet"
    }
       $scope.recordsSav = response.data.poi
  }, function (response) {
      console.log(response)
  });


  var modal = document.getElementById('poiModal');
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
 
self.openPOI = function (poiName) {
  modal.style.display = "block";
  POIPServices.poiName = poiName
  self.getPOI();
 }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }


 self.getPOI = function(){
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
        $scope.Category= response.data.poi[0].Category_Name
    console.log(response)
    },
    function (response) {
        console.log(response) 
    });
 }

self.splitDate=  function(string){
    var array = string.split('T');
    var fullhour = array[1].split('Z')[0]
    var hourParts = fullhour.split(':')
    var date = array[0] + ' ' + hourParts[0] + ':' + hourParts[1];
    return date
}

$scope.ifFav=  function(){
    if($scope.fav!=undefined){
        for(var i=0;i<$scope.fav.length;i++)
        {
            if($scope.fav[i].POI_Name== $scope.POIName)
                return true
        }
        if($scope.fav.length==0)
        {
            $scope.fav=[]
        }
    }
    if($scope.fav==undefined||$scope.fav==null)
          $scope.fav=[]
    return false
}

$scope.AddRemove = function () {
    var name= $scope.POIName
    if($scope.ifFav(name)==true)
         $scope.RemoveFromFav(name)
    else
         $scope.AddToFav(name)

 $scope.saveFavAtLocalStorage($scope.fav) 
 }

 $scope.RemoveFromFav = function (name) {
    for(var i=0;i< $scope.fav .length;i++){
        if($scope.fav[i].POI_Name===name) {  $scope.fav.splice(i,1);  }
  }
  var counetr=$scope.indxCtrl.getFavCounter()
  $scope.indxCtrl.updateFavNum(counetr-1)
}

$scope.AddToFav = function (name) {
    
    let poi =  {POI_Name:  $scope.POIName ,Rank_Per: $scope.Rank, Category_Name:$scope.Category  ,  POI_Picture:   $scope.POIPicture,rank: 0 };
    $scope.fav.push(poi)
    var counetr=$scope.indxCtrl.getFavCounter()
    $scope.indxCtrl.updateFavNum(counetr+1)
}

}]);
