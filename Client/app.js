var app=angular.module("chatapp",[ngRoute]);
app.config('$routeProvider',function($routeProvider){
    $routeProvider.when('/',{templateUrl:"/"})
});