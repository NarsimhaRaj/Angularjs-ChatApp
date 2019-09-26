var app = angular.module("chatApp", ["ngRoute"]);
app.config(["$routeProvider", function ($routeProvider) {
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
            controller: 'mainController'
        }).when('/forgotPassword', {
            templateUrl: 'Templates/forgotPassword.html',
            controller: 'mainController as ctrl'
        }).when('/resetPassword/:token', {
            templateUrl: 'Templates/resetPassword.html',
            controller: "mainController as ctrl",
            resolve: {
                result: function ($route) {
                    token = $route.current.params.token;
                    if (token)
                        return true;
                    return false;
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
