angular.module('citiesApp')
.service('LogInServices',[ '$http', function ($http) {

    let serverUrl = 'localhost:3000/'  
    this.LogIn = function (user) {
        return  $http.post("http://"+serverUrl + "Users/LogIn", user);
    }

    this.set = function (t) {
        $http.defaults.headers.common[ 'x-access-token' ] = t
    }
   
    this.showRandomPOI = function () {
        return $http.get("http://"+serverUrl + "Users/PopularPOI");
    }

    this.FavPOI = function (token) {
        return $http.get("http://"+serverUrl + "POI/GetUsersAllFavPOI?token="+token)  }

    this.getUserFavOrder=function(token){
        return $http.get("http://"+serverUrl + "POI/UserOrder?token="+token)
        }

}])

.controller('LogInController', ['$scope','$location', '$http', 'LogInServices','setHeadersToken','POIPServices','localStorageModel', function ($scope,$location, $http, LogInServices,setHeadersToken,POIPServices, localStorageModel) {


    self = this;
    

    self.directToPOI = function () {
        $location.path('/poi')
    }

    let serverUrl = 'localhost:3000/'
    let token=""
    let _userName=""

    self.LogIn = function () {
        let user = {
            userName: self.userName,
            password: self.password
        };
        LogInServices.LogIn(user)
            .then(function (response) {
                 if(response.data.success){
                     console.log(response)
                        self._userName = user.userName
                        self.token = response.data.token                       
                        $scope.indxCtrl.upDateUser(user.userName, false);
                        self.addTokenToLocalStorage();
                        self.FavPOI();
                        $scope.show = true              
                  }
                  else{
                      $scope.massage = "User name or password not found - Please try again"
                  }
            }, function (response) {

                self.LogIn.content = "Something went wrong with LogIn";
            });
           
    }

    self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage("token", self.token)
        localStorageModel.addLocalStorage("userName",  self._userName)
      setHeadersToken.set(self.token)
    }

    self.FavPOI = function () {   
        LogInServices.FavPOI(self.token)     
        .then(function (response) {
            $scope.fav=response.data.poi        
        })
        .then(function (response) {
            LogInServices.getUserFavOrder(self.token)     
            .then(function (response2) {
                $scope.rank=response2.data.poi                         
            })
            .then(function (response) {
                $scope.unit=[]
                console.log($scope.rank.length)
                for(var i=0;i<$scope.fav.length;i++) 
                {
                for(var j=0;j<$scope.rank.length;j++)
                    {         
                    if( $scope.fav[i].POI_Name=== $scope.rank[j].POI_Name)
                        $scope.unit.push({POI_Name: $scope.fav[i].POI_Name,Rank_Per:$scope.fav[i].Rank_Per, Category_Name:$scope.fav[i].Category_Name  ,  POI_Picture: $scope.fav[i].POI_Picture,rank: $scope.rank[j].POI_Order })
                    }
                }               
                $scope.records= $scope.unit
                localStorageModel.updateLocalStorage("favorites",$scope.records)
                let numOfPOI =  $scope.records.length;
                $scope.indxCtrl.updateFavNum(numOfPOI);  
                console.log(localStorageModel.getLocalStorage("favoritesNum"))
          
            }    
        )}
        );
    }


    LogInServices.showRandomPOI()
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


