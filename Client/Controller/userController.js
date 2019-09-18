(function () {
    var app = angular.module("chatapp");

    app.controller("Controller", Main);

    function Main(httpService) {
        var self = this;
        this.editMode = true;
        this.successMode = undefined;
        this.errorMode = undefined;
        this.username = "";
        this.password = "";
        this.textArea="";
        httpService.getService()
            .then((response) => {
                if (response.status)
                    self.details = response.data;
                else
                    self.details = response.error;
            });

        this.changeMode = () => {
            self.editMode = !self.editMode;
            this.successMode=undefined;
            this.errorMode=undefined;
        }

        this.signin = function (name, password) {
            var user = { username: name, password: password }
            httpService.postLoginService(user).then(function (response) {
                console.log(response.status)
                if (response.status) {
                    console.log(response)
                    self.logindetails = response.data
                    self.successMode = response.message;
                }
                else {
                    self.errorMode = response.error;
                }
            });
            self.username = ""
            self.password = ""
            self.editMode = true;
        }
        this.register = function (username, firstname, lastname, email, password, confirmPassword) {
            var user = {
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
            httpService.register(user)
                .then(function (response) {
                    if (response.status) {
                        self.successRegister = response.message;
                        self.username = ""
                        self.firstname = ""
                        self.lastname = ""
                        self.email = ""
                        self.password = ""
                        self.confirmPassword = ""
                    }
                    else{
                        self.errorMode=response.error;
                    }
                });
            this.username = ""
            this.password = ""
            this.editMode = true;
        }
        this.chatHistory = (index) => {
            this.textArea="Helloworld"
        }
        this.send = () => {

        }
    }
})();