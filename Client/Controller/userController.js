(function () {
    var app = angular.module("chatApp");

    app.controller("mainController", Main);

    var socket=io.connect("http://localhost:5064");

    app.value("sender","");
    
    var sender="";

    function Main($location, httpService) {
        var self = this;
        this.editMode = true;
        this.successMode = undefined;
        this.errorMode = undefined;
        this.username = "";
        this.password = "";
        this.textArea = "";
        this.username ="";
        this.flag=false;
        httpService.getService()
            .then((response) => {
                if (response.status)
                    self.details = response.data;
                else
                    self.details = response.error;
            });

        this.changeMode = () => {
            self.editMode = !self.editMode;
            this.successMode = undefined;
            this.errorMode = undefined;
        }

        this.singin = function (name, password) {
            sender=name;
            this.user = { username: name, password: password }
            httpService.postLoginService(this.user).then(function (response) {
                if (response.status) {
                    self.username=name;
                    self.successMode=response.message;
                    alert(response.message);
                    $location.path("/chat");
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
                        self.successMode = response.message;
                        self.username = ""
                        self.firstname = ""
                        self.lastname = ""
                        self.email = ""
                        self.password = ""
                        self.confirmPassword = ""
                        alert(response.message);
                        $location.path("/login");
                    }
                    else {
                        
                        self.errorMode = response.errors;
                    }
                });
            this.username = ""
            this.password = ""
            //  this.editMode = true;
        }
        this.forgotPassword=function(email){
            httpService.forgotPassword({email:email}).then((response)=>{
                if(response.status)
                    self.successMode=response.message;
                else    
                    self.errorMode=response.errors;
            })
        }
        this.redirectToRegister = function () {
            $location.path("/register");
        }
        this.redirectToForgotPassword=function(){
            $location.path('/forgotPassword');
        }
        this.chatHistory = (receiver,index) => {
            this.flag=true;
            this.receiver=receiver;
        }
        this.send = (message) => {
            var chatData={sender:sender,receiver:this.receiver,message:message}
            socket.emit("chat",chatData);
        }
        socket.on('chat',function(response){
            document.getElementById('chatWindow').innerHTML=response.message.messages;
            console.log(response);
        })
    }
})();