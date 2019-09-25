(function () {
    var app = angular.module("chatApp");

    app.controller("mainController", Main);

    var socket = io.connect("http://localhost:5064");

    app.value("sender", "");
    /**
     * @description : Main controller has functions as login,forgot
     * @param {$scope} , Controller Scope varibale
     * @param {$location}  , location used to redirect to given path
     * @param {httpService}  , calls $http services on being called
     */
    var senderEmail=null;
    var receiverEmail=null;
    function Main($scope, $location, httpService) {
        var self = this;
        this.successMode = undefined;
        this.errorMode = undefined;
        this.flag = false;
        httpService.getService()
            .then((response) => {
                if (response.status)
                    self.details = response.data.filter((friendsId) => {
                        return senderEmail != friendsId.email;
                    });
                else
                    self.details = response.error;
            });

        /**
         * @description: this singin function takes email and password as arguments and  calls sigin in function in httpServices 
         * @param {email}, email of registered user  
         * @param {password}, registered user password
         */
        this.signin = function (email, password) {
            senderEmail=email;
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
                        this.successMode = response.message;
                        self.username = ""; self.firstname = ""
                        self.lastname = ""; self.email = ""
                        self.password = ""; self.confirmPassword = ""
                        alert(response.message);
                        $location.path("/login");
                    }
                    else {

                        this.errorMode = response.errors;
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
            receiverEmail = receiver;
            $scope.fetch();
        }
        // $scope.messagesPacket = null;
        $scope.fetch = () => {
            httpService.fetchConversation({ sender: senderEmail, receiver: receiverEmail })
                .then((response) => {
                    if (response.status)
                        $scope.messagesPacket = response.data.conversations;
                    else
                        $scope.messagesPacket = response.error;
                })
        }

        /**
         * @description:on clicking send button on client side and emits an event at server side, sends chat data object containing 
         * sender, receiver and message  
         * @param {message}, message from sender
         */
        this.send = (message) => {
            if (message != "" || message != null || message != undefined) {
                var chatData = { sender: senderEmail, receiver: receiverEmail, message: message }
                socket.emit('sending', chatData);
            }
            else {
                alert("Please enter some text ");
            }
        }

        socket.on('receiving', function (response) {
            // $scope.$apply(() => {
            //     $scope.messagesPacket = response.conversations;
            // })
            $scope.fetch();
        })

        //redirect to register page on clicking register button
        this.redirectToRegister = function () {
            $location.path("/register");
        }
        this.redirectToForgotPass = function () {
            $location.path("/forgotPassword");
        }

        /**
         * @description : align messages right side if messages are from sender 
         * @param {userId}, userId is message sent person's id
         */
        this.alignMessageRight = (userId) => {
            return userId == senderEmail ? true : false;
        }

    }
})();