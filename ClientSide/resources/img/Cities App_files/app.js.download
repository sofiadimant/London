let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        template: '<h1>This is the default route</h1>'
    })
        .when('/', {
            templateUrl: 'components/LogIn/LogIn.html',
            controller : 'LogInController as LogInCtrl'  
        })    
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/Register', {
            templateUrl: 'components/Register/Register.html',
            controller : 'RegisterController as RegisterCtrl'
        })
        .when('/Home', {
            templateUrl: 'components/Home/Home.html',
            controller : 'HomeController as HomeCtrl'
        })
        .when('/RestorePassword', {
            templateUrl: 'components/RestorePassword/RestorePassword.html',
            controller : 'RestorePasswordController as RPassCtrl'
        })
        .when('/Page', {
            templateUrl: 'components/POIPage/POIPage.html',
            controller : 'pageController as pageCtrl'
        })
        .when('/POI', {
            templateUrl: 'components/POI/POI.html',
            controller : 'POIController as POICtrl'
        })
        .when('/Favorites', {
            templateUrl: 'components/FavPOI/FavPOI.html',
            controller : 'FavController as FavCtrl'
        })
        
        
}])
.service('setHeadersToken',[ '$http', function ($http) {
   
    this.userName = ''
    this.gest = true

    this.set = function (t) {
        $http.defaults.headers.common[ 'x-access-token' ] = t
    }

}])










