var app = angular.module("chatApp", ["ngRoute"]);
app.config(["$routeProvider",function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'Templates/login.html',
            controller: 'mainController as ctrl'
        })
        .when('/register', {
            templateUrl: 'Templates/register.html',
            controller: 'mainController as ctrl'
        })
        .when('/chat', {
            templateUrl: 'Templates/chat.html',
            controller: 'mainController as ctrl'
        }).when('/forgotPassword',{
            templateUrl: 'Templates/forgotPassword.html',
            controller: 'mainController as ctrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
