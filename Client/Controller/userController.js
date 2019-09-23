(function () {
    var app = angular.module("chatApp");

    app.controller("mainController", Main);

    var socket = io.connect("http://localhost:5064");

    app.value("sender", "");

    var sender = null;
    /**
     * @description : Main controller has functions as login,forgot
     * @param {$scope} , Controller Scope varibale
     * @param {$location}  , location used to redirect to given path
     * @param {httpService}  , calls $http services on being called
     */
    function Main($scope, $location, httpService) {
        var self = this;
        this.successMode = undefined;
        this.errorMode = undefined;
        this.flag = false;
        httpService.getService()
            .then((response) => {
                if (response.status)
                    self.details = response.data.filter((friendsId) => {
                        return sender != friendsId.email;
                    });
                else
                    self.details = response.error;
            });

        /**
         * @description: this singin function takes email and password as arguments and  calls sigin in function in httpServices 
         * @param {email}, email of registered user  
         * @param {password}, registered user password
         */
        this.singin = function (email, password) {
            sender = email;
            this.user = { email: email, password: password }
            httpService.postLoginService(this.user).then(function (response) {
                if (response.status) {
                    self.successMode = response.message;
                    alert(response.message);
                    $location.path("/chat");
                }
                else {
                    self.errorMode = response.error;
                }
            });
            self.username = ""
            self.password = ""
        }
        /**
         * @description : creates a User object with details mensioned sends data to sever using $http services
         * if data valid response comes registerd successfully if not error comes 
         */
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
                        self.username = ""; self.firstname = ""
                        self.lastname = ""; self.email = ""
                        self.password = ""; self.confirmPassword = ""
                        alert(response.message);
                        $location.path("/login");
                    }
                    else {

                        self.errorMode = response.errors;
                    }
                });
        }
        /**
         * @description : takes email as an argument and calls forgotPassword function in UserServices 
         * if response status is true from server mail has been sent to given email if user is a client
         */
        this.forgotPassword = function (email) {
            httpService.forgotPassword({ email: email }).then((response) => {
                if (response.status)
                    self.successMode = response.message;
                else
                    self.errorMode = response.errors;
            })
        }

        /**
         * @description : takes 2 arguments from input text given by user, passes them with token param to reset 
         * password http service function
         * @param {password}, password input element value;
         * @param {confirmPassword}, confirm password input element value 
         */
        this.resetPassword = function (password, confirmPassword) {
            httpService.resetPassword(token, { password: password, confirmPassword: confirmPassword })
                .then((response) => {
                    if (response.status) {
                        this.successMode = response.message;
                        alert(response.message)
                    }
                    else {
                        this.errorMode = response.error;
                        alert(response.error);
                    }
                })
        }

        /**
         * @description : friends chat History will be shown on clicking on friends in contact details
         * @param {receiver}, particular receiver email to whom sender wants to sent
         */
        this.chatHistory = (receiver) => {
            this.flag = true;
            this.receiver = receiver;
            $scope.fetch();
        }

        /**
         * @description:on clicking send button on client side and emits an event at server side, sends chat data object containing 
         * sender, receiver and message  
         * @param {message}, message from sender
         */
        this.send = (message) => {
            if (message != "" || message != null || message != undefined) {
                var chatData = { sender: sender, receiver: this.receiver, message: message }
                socket.emit('sending', chatData);
            }
            else {
                alert("Please enter some text ");
            }
        }

        socket.on('receiving', function (responseMessage) {
            $scope.fetch();
        })

        /**
         * @description : fetch chat Conversation between sender and receiver
         */
        $scope.fetch = () => {
            console.log(sender + " " + this.receiver);
            httpService.fetchConversation({ sender: sender, receiver: this.receiver })
                .then((response) => {
                    if (response.status)
                        this.messagesPacket = response.message.conversations;
                    else
                        this.messagesPacket = response.error;
                });
        }



        //redirect to register page on clicking register button
        this.redirectToRegister = function () {
            $location.path("/register");
        }

        /**
         * @description : align messages right side if messages are from sender 
         * @param {userId}, userId is message sent person's id
         */
        this.alignMessageRight = (userId) => {
            return userId == sender ? true : false;
        }

    }
})();