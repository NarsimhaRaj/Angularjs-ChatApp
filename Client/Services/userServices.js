(function () {
    var app = angular.module("chatapp");

    app.service("httpService", function ($http) {
        this.getService = () => {
            return $http.get("http://localhost:5064/chat_app/getUsers").then(function (response) {
                return response.data;
            },
            function(error){
                return error.data;
            });
        }
        this.postLoginService = (user) => {
            return $http.post("http://localhost:5064/chat_app/login", user).then(function (response) {
                return response.data;
            },function(error){
                return error.data;
            });

        }
        this.register=(user)=>{
            return $http.post("http://localhost:5064/chat_app/register", user).then(function (response) {
                return response.data;
            },function(error){
                return error.data;
            });
        }
    });
})();