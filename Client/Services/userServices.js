(function () {
    var app = angular.module("chatapp");

    app.service("getService", function ($http) {
        return $http.get("http://localhost:5064/chat_app/getUsers").then(function (response) {
            return response.data;
        }).catch(err => console.log("link is not available "));
    });

    /*app.service("login",function($http){
        return $http.post("http://localhost:5064/chat_app/getUsers",{"":"","":""}).then(function (response) {
            return response.data;
        }).catch(err => console.log("link is not available "));
    })*/
})();