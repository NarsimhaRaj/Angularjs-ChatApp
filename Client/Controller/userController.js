(function () {
    var app = angular.module("chatapp");

    app.controller("Controller1", loginController);

    function loginController(getService) {
        getService.then((data) => { this.details = data; });
    }
})();