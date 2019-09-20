(function () {
    var app = angular.module("chatApp");

    app.service("httpService",function ($http,$location) {
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
        this.forgotPassword=(email)=>{
            return $http.post("http://localhost:5064/chat_app/forgotPassword",email).then(function(response){
                return response.data
        },function(error){
            return error.data;
        })
        }
    });
})();