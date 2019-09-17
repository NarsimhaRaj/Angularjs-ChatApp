(function(){
    var app=angular.module("chatapp");

    app.service("service1",function($http){
        $http.get("http://localhost:3000/chat_app/login").then(function(response){
            return response.data;
        });
    });
})();