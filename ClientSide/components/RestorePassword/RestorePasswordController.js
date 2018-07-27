angular.module('citiesApp')
.service('RestorePassService',[ '$http', function ($http) {
    let serverUrl = 'localhost:3000/'  
    this.getQuestion = function (username) {
      
        return $http.get("http://"+serverUrl + "Users/QuestionIdByUserName/"+username);       
    }

    this.getPassword = function (userDetails) {
        console.log(userDetails)
        return $http.post("http://"+serverUrl + "Users/RestorePassword/",userDetails);  
    }

    this.showRandomPOI = function () {
        return $http.get("http://"+serverUrl + "Users/PopularPOI");
    }
}])


.controller('RestorePasswordController', ['$scope','$location', '$http', 'RestorePassService','POIPServices', 'localStorageModel', function ($scope,$location, $http, RestorePassService, POIPServices, localStorageModel) {
    self= this;

    $scope.getQuestion = function() {
        name=$scope.name
        $scope.show = false;
        $scope.showPass = false;
        if($scope.name==null){
            $scope.msg1 = "Please Enter User Name";
            return
        }        
        RestorePassService.getQuestion(name)    
        .then(function (response) {
            console.log(response)
            if(response.data==="catch")
            {
                $scope.msg1 = "Wrong User Name";
                return
            }
            $scope.msg = response.data[0].question;
            $scope.show = true;
           // $scop.question = response.data.question;
        }, function (response) {
            //Second function handles error
            self.RestorePassword.content = "Something went wrong with RestorePass";
        });
    };
 
    $scope.getPassword = function() {
        ans=$scope.answer 
        name=$scope.name
        console.log(ans)   
        let userDetails = {
            userName: name,
            questionAns: ans
        };
        
        RestorePassService.getPassword(userDetails)    
        .then(function (response) {
          
            console.log(response.data)
            if(!response.data==="Wrong Password")
            {
                $scope.showWrongPass=true
                $scope.Wrongpassword=response.data
            }
            else{
                $scope.showPass=true
                $scope.password="YOUR PASSWORD IS: "+response.data
            }
        }, function (response) {
            //Second function handles error
            self.RestorePassword.content = "Something went wrong with RestorePass";
        });
    };


    RestorePassService.showRandomPOI()
    .then(function (response) {
        $scope.indxCtrl.userName = "gest"
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