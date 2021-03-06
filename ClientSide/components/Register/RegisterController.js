

angular.module('citiesApp')
// .service('myService', function () { this.set = function() {return "hello"} })
.service('RegisterServices',[ '$http', function ($http) {

   
    let serverUrl = 'localhost:3000/'
    
    this.signUp = function (user) {
        return $http.post("http://"+serverUrl + "Users/Register", user);
    }

    this.getAllCategories = function () {
        return $http.get("http://"+serverUrl + "Users/AllCategories");
    }
    this.showRandomPOI = function () {
        return $http.get("http://"+serverUrl + "Users/PopularPOI");
    }
}])


.controller('RegisterController', ['$scope','$location', '$http', 'RegisterServices','POIPServices','localStorageModel', function ($scope,$location, $http, RegisterServices,POIPServices, localStorageModel) {


    self = this;   
    let serverUrl = 'localhost:3000/'
    let token;
    let userName;

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                self.findCountries(this);
            }
        };
        xmlhttp.open("GET", "./components/Register/countries.xml", true);
        xmlhttp.send();

        self.findCountries = function (xmlToRead) {
            var xml = xmlToRead.responseXML;
            var answer = [];
            var CountryXml = xml.getElementsByTagName("Country");
            var i;
            for (i = 0; i < CountryXml.length; i++) {
                var json = {
                    "Name": CountryXml[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()
                }
                answer.push(json);
            }
            $scope.countries = answer;
            console.log($scope.countries)
        }

    
    $http.get("http://"+serverUrl + "Users/AllCategories").then((response) => {
        console.log(response.data)
        $scope.categories1 = response.data;
        $scope.categories2 = response.data;
        $scope.categories3 = response.data;
        $scope.show = false;
    });

    self.signUp = function () {
       
        let user = {
            userName: self.userName,
            password: self.password,
            firstName: self.firstName,
            lastName: self.lastName,
            city: self.city,
            country: self.chosen_country,
            email: self.email,
            questionAns: self.questionAns,
            questionID: self.question,
            isAdmin: 0,
            favCatego1: self.favCatego1,
            favCatego2: self.favCatego2,
            favCatego3: self.favCatego3
        };
        RegisterServices.signUp(user)
            .then(function (response) {
                $scope.userNameError=null
                console.log(user)
                console.log(response)
                if( response.data =="Please Choose Another User Name"){
                    $scope.userNameError = response.data;
                }
                else{
                    self.token = response.data.token
                    self.userName = user.userName
                    $scope.indxCtrl.upDateUser(user.userName, false);
                    self.addTokenToLocalStorage();
                    $scope.indxCtrl.updateFavNum(0);
                    $scope.show =true;
                }
            }, function (response) {
                //Second function handles error
                self.signUp.content = "Something went wrong with Register";
            });
    }


    self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage("token", self.token)
        localStorageModel.addLocalStorage("userName",  self.userName)
    }

    RegisterServices.showRandomPOI()
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
   
    var isCategory1 = false;
    var isCategory2 = false;
    //set Categories2 & Categories3 by the first chosen category
    self.setCategories1 = function(categoryName){
        let tempCategories =[];
        let i;
        for( i=0; i<$scope.categories2.length; i++){
            if($scope.categories2[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories2[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        isCategory1 = true
        $scope.categories2=tempCategories;
        tempCategories =[];
        for( i=0; i<$scope.categories3.length; i++){
            if($scope.categories3[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories3[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        $scope.categories3=tempCategories;
    }

    self.setCategories2 = function(categoryName){
        let tempCategories =[];
        let i;
        for( i=0; i<$scope.categories1.length; i++){
            if($scope.categories1[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories1[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        isCategory2 = true
        $scope.categories1=tempCategories;
        tempCategories =[];
        for( i=0; i<$scope.categories3.length; i++){
            if($scope.categories3[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories3[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        $scope.categories3=tempCategories;
    }

    self.setCategories3 = function(categoryName){
        let tempCategories =[];
        let i;
        for( i=0; i<$scope.categories2.length; i++){
            if($scope.categories2[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories2[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        $scope.categories2=tempCategories;
        tempCategories =[];
        for( i=0; i<$scope.categories1.length; i++){
            if($scope.categories1[i].Category_Name!=categoryName){
            var category = {
                "Category_Name": $scope.categories1[i].Category_Name
            }
            tempCategories.push(category)
        }
        }
        $scope.categories1=tempCategories;
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






