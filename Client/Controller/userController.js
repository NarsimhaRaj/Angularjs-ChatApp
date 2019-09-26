(function () {
    var app = angular.module("chatApp");

    app.controller("mainController", Main);

    var socket = io.connect("http://localhost:5064");

    /**
     * @description : Main controller has functions as login,forgot
     * @param {$scope} , Controller Scope varibale
     * @param {$location}  , location used to redirect to given path
     * @param {httpService}  , calls $http services on being called
     */
    var senderEmail = null;
    var receiverEmail = null;
    function Main($scope, $location, httpService) {
        var self = this;
        $scope.flag = true;
        httpService.getService()
            .then((response) => {
                if (response.status)
                    $scope.details = response.data.filter((friendsId) => {
                        return senderEmail != friendsId.email;
                    });
                else
                    $scope.details = response.error;
            });

        /**
         * @description: this singin function takes email and password as arguments and  calls sigin in function in httpServices 
         * @param {email}, email of registered user  
         * @param {password}, registered user password
         */
        this.signin = function (email, password) {
            senderEmail = email;
            this.user = { email: email, password: password }
            httpService.postLoginService(this.user).then(function (response) {
                if (response.status) {
                    self.snackbar = response.message;
                    $location.path("/chat");
                }
                else {
                    self.snackbar = response.error;
                }
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

            });
            self.username = ""
            self.password = ""
        }
        /**
         * @description : creates a User object with details mensioned sends data to sever using $http services
         * if data valid response comes registerd successfully if not error comes 
         */
        this.register = function () {
            var user = {
                username: this.username,
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword
            }
            httpService.register(user)
                .then(function (response) {
                    if (response.status) {
                        this.snackbar = response.message;
                        self.username = ""; self.firstname = ""
                        self.lastname = ""; self.email = ""
                        self.password = ""; self.confirmPassword = ""
                        $location.path("/login");
                    }
                    else {

                        this.snackbar = response.errors;
                    }
                    var x = document.getElementById("snackbar");
                    x.className = "show";
                    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                });
        }
        /**
         * @description : takes email as an argument and calls forgotPassword function in UserServices 
         * if response status is true from server mail has been sent to given email if user is a client
         */
        this.forgotPassword = function (email) {
            httpService.forgotPassword({ email: email }).then((response) => {
                if (response.status)
                    self.snackbar = response.message;
                else
                    self.snackbar = response.errors;
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
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
                        this.snackbar = response.message;
                        // alert(response.message)
                    }
                    else {
                        this.snackbar = response.error;
                        // alert(response.error);
                    }
                    var x = document.getElementById("snackbar");
                    x.className = "show";
                    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                })
        }

        /**
         * @description : friends chat History will be shown on clicking on friends in contact details
         * @param {receiver}, particular receiver email to whom sender wants to sent
         */
        $scope.chatHistory = (receiver) => {
            $scope.flag = true;
            receiverEmail = receiver;
            var chatData = { sender: senderEmail, receiver: receiverEmail, message: "" }
            socket.emit('sending', chatData);
        }
        // $scope.messagesPacket = null;
        // $scope.fetch = () => {
        //     httpService.fetchConversation({ sender: senderEmail, receiver: receiverEmail })
        //         .then((response) => {
        //             if (response.status)
        //                 $scope.messagesPacket = response.data.conversations;
        //             else
        //                 $scope.messagesPacket = response.error;
        //         })
        // }

        /**
         * @description:on clicking send button on client side and emits an event at server side, sends chat data object containing 
         * sender, receiver and message  
         * @param {message}, message from sender
         */
        $scope.send = (message) => {
            if (message != "" || message.trim() != "") {
                var chatData = { sender: senderEmail, receiver: receiverEmail, message: message }
                socket.emit('sending', chatData);
            }
            else {
                alert("Please enter some text ");
            }
        }

        socket.on('receiving', function (response) {
            console.log('1')
            $scope.$apply(() => {
                $scope.messagesPacket = response.conversations;
            })
            // $scope.fetch();
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
        $scope.alignMessageRight = (userId) => {
            return userId == senderEmail ? true : false;
        }

    }
})();