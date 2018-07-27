

angular.module('citiesApp')
.service('POIService',[ '$http', function ($http) {
    let serverUrl = 'localhost:3000/'
    this.getPOI = function () {
        return $http.get("http://"+serverUrl + "Users/GetAllPOI");
    }
    this.getAllCategories = function () {
        return $http.get("http://"+serverUrl + "Users/AllCategories");
    }
    this.serachPOI = function (name) {
        return $http.get("http://"+serverUrl + "Users/POIName/"+name);
    }
}])

.controller('POIController', ['$scope','$location', '$http', 'POIService','POIPServices', 'localStorageModel', function ($scope,$location, $http, POIService,POIPServices,localStorageModel) {
    self=this
    $scope.Guest=true
    $scope.showWarning=false
 
    if($scope.indxCtrl.isGuest()==false)
    {
        $scope.Guest=false
    }
    self.setToken= function(){
        self.token = localStorageModel.getLocalStorage("token");
    }

    $scope.getFvoritesFromLocalStorage=function(){
        let fav = localStorageModel.getLocalStorage("favorites")
        return fav
    }

    POIService.getPOI() 
    .then(function (response) {
        $scope.records=response.data.poi
       }, function (response) {
    });

    $scope.ifFav = function (name) 
    {  
        if($scope.FAV==undefined)
        {
            $scope.FAV=[]
            return false
        }
        for(var i=0;i< $scope.FAV.length;i++)
        {
            if($scope.FAV[i].POI_Name==name)
                return true
        }
        return false
    }

    POIService.getAllCategories()
    .then(function(response){
        $scope.categories=response.data
        console.log(response.data)
      },function (response) {
    });
    $scope.show=true
    $scope.showCancelBtn=true

    $scope.serachPOI = function () {
        POIService.serachPOI($scope.searchPOI)
        .then(function(response){
            if(response.data!="catch"){
              $scope.showWarning=false
              $scope.show=false
              $scope.showSecces=true
              $scope.showCancelBtn=true
              $scope.SearchPoi=response.data.poi[0]
                Console.log($scope.SearchPoi)
            }
            else{
              $scope.showSecces=false
              $scope.showWarning=true
            }  
        },function (response) {
    });
    }

    $scope.setShowAll = function(){
        $scope.show = !$scope.show;
        $scope.showSecces=false
        $scope.showWarning=false
    }
  
    $scope.selectedItemChanged = function () {
        $scope.showCancelBtn=false
    }
    $scope.cancelFilter = function () {
        $scope.changeFilter=false
        $scope.selectedCat=""
        $scope.showCancelBtn=true
    }
    $scope.POIToRemove=[]

    $scope.saveFavAtLocalStorage= function (fav) {
        localStorageModel.updateLocalStorage("favorites",fav)
    }
   
   
    $scope.AddRemove = function (name) {
        if($scope.ifFav(name)==true)
             $scope.RemoveFromFav(name)
        else
             $scope.AddToFav(name)

     $scope.saveFavAtLocalStorage($scope.FAV)  
    }

    $scope.RemoveFromFav = function (name) {
        for(var i=0;i<   $scope.FAV.length;i++){
            if($scope.FAV[i].POI_Name===name) {  $scope.FAV.splice(i,1);  }
      }
      var counetr=$scope.indxCtrl.getFavCounter()
      $scope.indxCtrl.updateFavNum(counetr-1)
    }


   $scope.AddToFav = function (name) {
        for(var i=0;i<$scope.records.length;i++)
        {
            if($scope.records[i].POI_Name==name)
              {
                let poi =  {POI_Name: $scope.records[i].POI_Name,Rank_Per:$scope.records[i].Rank_Per, Category_Name:$scope.records[i].Category_Name  ,  POI_Picture: $scope.records[i].POI_Picture,rank: 0 };
                $scope.FAV.push(poi)
              }
        }
        var counetr=$scope.indxCtrl.getFavCounter()
        $scope.indxCtrl.updateFavNum(counetr+1)
    }

    self.setToken();

    if($scope.indxCtrl.isGuest()==false){
        var ans=$scope.getFvoritesFromLocalStorage()
        if(ans=="empty"||ans==null){
            $scope.FAV=[]
        }
        else
            $scope.FAV=$scope.getFvoritesFromLocalStorage()
    }

    ///---------------------------POI MODAL FUNCTIONS FROM HERE---------------------------//

var modal = document.getElementById('poiModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


self.openPOI = function (poiName) {
    POIPServices.poiName = poiName
    modal.style.display = "block";   
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

}]);

