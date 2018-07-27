angular.module('citiesApp')
.service('FavService',[ '$http', function ($http) {
    let serverUrl = 'localhost:3000/'

    this.FavPOI = function (token) {
         return $http.get("http://"+serverUrl + "POI/GetUsersAllFavPOI?token="+token)  }
     
    this.remove = function (name,token) {
        let user ={
            POI_Name:name  }       
        return $http.post("http://"+serverUrl + "POI/RemovePOIFromUserFav?token="+token,user) }
    
    this.getUserFavOrder=function(token){
        return $http.get("http://"+serverUrl + "POI/getUserRanks?token="+token)
      }
  
    this.addReview = function (review,token) {      
        return $http.post("http://"+serverUrl + "POI/POIReview?token="+token,review) }
    
    this.POIRank = function (rank,token) {      
        return $http.post("http://"+serverUrl + "POI/POIRank?token="+token,rank) }

    this.SetFavPOIOrderByUser = function (sort,token) {      
        return $http.post("http://"+serverUrl + "POI/SetFavPOIOrderByUser?token="+token,sort) }

    this.AddPOIToUserFavorites = function (poi,token) {      
        let toInsert={poiName:poi}
        return $http.post("http://"+serverUrl + "POI/AddPOIToUserFavorites?token="+token,toInsert) }
    
}])

.controller('FavController', ['$scope','$location', '$http','FavService','POIPServices', 'localStorageModel', function ($scope,$location, $http,FavService, POIPServices, localStorageModel) {
    $noFav=true
    $scope.showRank=true

    let serverUrl = 'localhost:3000/'
    $scope.changeFilter=true
    $scope.buttonName="Order By Rank"

    self.setToken= function(){
        self.token = localStorageModel.getLocalStorage("token");
    }
    self.setToken();

    $scope.first=0;
    $scope.sortBy = 'rank';

     
    $scope.saveFavAtLocalStorage= function (fav) {
        localStorageModel.updateLocalStorage("favorites",fav)
    }
    $scope.getLocalStorage=function(){
        let fav = localStorageModel.getLocalStorage("favorites")
        return fav
    }

 /*----------------------------Personal Sort + save at db--------------------------------*/
    $scope.SortByUser = function (sort) {
        if(sort.POI_Name==undefined||sort.rank== undefined){
            $scope.warnning="please insert rank and point"
            return
        }       
        personalSort= $scope.records
        for(var i=0;i<personalSort.length;i++)
        {
             if(personalSort[i].POI_Name===sort.POI_Name)
             {
                 poi=personalSort[i]
                 personalSort.splice(i,1); 
             }
        }
         var rank=sort.rank
         personalSort.push({ POI_Name:poi.POI_Name,Category_Name:poi.Category_Name,Rank_Per:poi.Rank_Per  ,POI_Picture:poi.POI_Picture,rank:rank})
         $scope.records=personalSort
         $scope.warnning="Rank is Set"
         var sort = {POI_Array:[{POI_Name:poi.POI_Name,Order: rank}]};
         FavService.SetFavPOIOrderByUser(sort,self.token)
         .then(function (response) {
           console.log(response) })
        }
 /*----------------Remove from local storage----------------------*/
    $scope.POIToRemove=[]
    $scope.remove = function (name) {
        for(var i=0;i< $scope.records.length;i++){
            if($scope.records[i].POI_Name===name)
            {          
                $scope.records.splice(i,1); 
            }
      }
      if($scope.records.length===0){
           $scope.saveFavAtLocalStorage("empty") 
           $scope.noFav=true
      }
     else
           $scope.saveFavAtLocalStorage($scope.records)  
     var counetr=$scope.indxCtrl.getFavCounter()
     $scope.indxCtrl.updateFavNum(counetr-1)
    }
    
/*--------------------update changes at records at db------------*/
    $scope.SaveChanges = function () {
        FavService.FavPOI(self.token)
        .then(function (response) {
        if(response.data=='FALSE')
        {
            for(var i=0;i< $scope.records.length;i++){               
                FavService.AddPOIToUserFavorites($scope.records[i].POI_Name,self.token)
                .then(function (response) {
                    console.log(response)
                })                                
              }
              return
        }
        var poiArr=response.data.poi
        for(var i=0;i< $scope.records.length;i++){
            if(!$scope.ChackIfExistInArr(poiArr,  $scope.records[i].POI_Name))
                {
                    FavService.AddPOIToUserFavorites($scope.records[i].POI_Name,self.token)
                    .then(function (response) {})
                }              
          }
          for(var i=0;i< poiArr.length;i++){
            if(!$scope.ChackIfExistInArr($scope.records, poiArr[i].POI_Name))
            {
                FavService.remove(poiArr[i].POI_Name,self.token)
                    .then(function (response) {})
            }
          }    
       })
    }
    $scope.ChackIfExistInArr=function(poiArr,name){
        for(var i=0;i< poiArr.length;i++)
        {
            if(poiArr[i].POI_Name==name)
                return true           
        }
        return false
    }
/*-----------------------Add Review---------------------------------*/
$scope.review
    $scope.AddReview = function () {  
     var answer={POI_Review:$scope.review,POI_Name: $scope.ReviewPoiName}  
     if(answer.POI_Review!=undefined&&answer.POI_Review!="" ){
             FavService.addReview(answer, self.token)      
               .then(function (response) { 
                $scope.addReviewResult="Review Add Succefully"
                console.log(response)
            })
        }
     else
         $scope.addReviewResult="Review Empty"
    }
    $scope.rank=[1,2,3,4,5]
/*-----------------------Add Rank---------------------------------*/
    $scope.AddRank = function () {
        console.log("dsfasd")
        var toSend={POI_Name: $scope.ReviewPoiName,POI_Rank: $scope.selectedRank }
        FavService.POIRank(toSend, self.token)  
        .then(function (response) { 
            console.log(response)
            $scope.RankViewResult="Rank Added Succefully"
            $scope.UpdateRankInLoaclStorage(response.data);
        })
    }

    $scope.UpdateRankInLoaclStorage = function (rank) {
        for(var i=0;i<$scope.records.length;i++)
        {
            if($scope.records[i].POI_Name== $scope.ReviewPoiName)
                 $scope.records[i].Rank_Per=rank[0].Rank_Per
        }
        $scope.saveFavAtLocalStorage($scope.records)
    }
/*----------------modal----------------------*/
    var modal1 = document.getElementById('myModal1');
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
   $scope.click = function (poiName) {
    $scope.RankViewResult=""
    $scope.addReviewResult=""
    $scope.selectedRank=""
    $scope.review=""
    modal1.style.display = "block";
    $scope.ReviewPoiName=poiName
   }
    span.onclick = function() {
        modal1.style.display = "none";
      
    }
    window.onclick = function(event) {
        if (event.target == modal1) {
            modal1.style.display = "none";
        }
    }

/*-----------------------------main-----------------------------*/
    $scope.NumOfPOI=[]
    if($scope.getLocalStorage()!==null){
        ans=$scope.getLocalStorage()  
        if(ans=="empty"||ans.length==0){
              $scope.noFav=true
            }
      else{         
          $scope.records=$scope.getLocalStorage()
          $scope.noFav=false
          for(var i=0;i<$scope.records.length;i++)
          {
              $scope.NumOfPOI[i]=i
          }
          if( $scope.records.length>1)
               $scope.showSort=true
          else
              $scope.showSort=false
      }
    }
    else{
             $scope.noFav=true
         }
    /*-----------------------------POI MODAL FUNCTIONS-----------------------------*/
    
    var modal = document.getElementById('poiModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    
    $scope.openPOI = function (poiName) {
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

    $scope.ifFav=  function(){
        if($scope.records!=undefined){
            for(var i=0;i<$scope.records.length;i++)
            {
                if($scope.records[i].POI_Name== $scope.POIName)
                    return true
            }
            if($scope.records.length==0)
            {
                $scope.records=[]
            }
        }
        if($scope.records==undefined||$scope.records==null)
              $scope.records=[]
        return false
    }
    
    $scope.AddRemove = function () {
        var name= $scope.POIName
        if($scope.ifFav(name)==true)
             $scope.remove(name)
        else
             $scope.AddToFav(name)
     }
    
    
    $scope.AddToFav = function (name) {    
        let poi =  {POI_Name:  $scope.POIName ,Rank_Per: $scope.Rank, Category_Name:$scope.Category  ,  POI_Picture:   $scope.POIPicture,rank: 0 };
        $scope.records.push(poi)
        var counetr=$scope.indxCtrl.getFavCounter()
        $scope.indxCtrl.updateFavNum(counetr+1)
        $scope.saveFavAtLocalStorage($scope.records) 
    }
 
}]);