(function(){
    var app=angular.module("chatapp");
    app.controller("Controller1",loginController);

    function loginController(service1){
        this.token=service1.then(function(data){return data;});
    }
})();