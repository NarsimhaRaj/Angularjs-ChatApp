(function () {
    var app = angular.module("chatApp");

    /**
     * @description : calls constructor with $http services, whose url's are server side routes 
    */
    app.service("httpService",function ($http) {
        /**
         * @description : uses http get method, which gets all the registered users if no error resolves, otherwise rejects(error response)
         */
          this.getService = () => {
            return $http.get("http://localhost:5064/chat_app/getUsers").then(function (response) {
                return response.data;
            },
            function(error){
                return error.data;
            });
        }
        /**
         * @description : uses http post service, verifies user at server side and gets response if no error resolves, otherwise rejects(error response)
         * @param {user}, user is an object contains email,password
         */
          this.postLoginService = (user) => {
            return $http.post("http://localhost:5064/chat_app/login", user).then(function (response) {
                return response.data;
            },function(error){
                return error.data;
            });

        }
        /**
         * @description : uses http post service, store all the details in mongo if no error in details, if not, receives error response with status
         * codes that will be rejected 
         * @param {user}, object with details like username, firstname, lastname, email, password, confirmpassword
         */
          this.register=(user)=>{
            return $http.post("http://localhost:5064/chat_app/register", user).then(function (response) {
                return response.data;
            },function(error){
                return error.data;
            });
        }
        /**
         * @description : uses http post service, sends email in request body and access it server side, if registered, an email sent for resetting 
         * password
         * @param {email}, registered user email
         */
        this.forgotPassword=(email)=>{
            return $http.post("http://localhost:5064/chat_app/forgotPassword",email).then(function(response){
                return response.data
        },function(error){
            return error.data;
        })
        }
        /**
         * @description : uses http post service, To fetch whole conversation between sender and receiver, if no conversion sends an error 
         * response saying no messages to show 
         * @chatData : it's a object containing sender, receiver details 
         */
        this.fetchConversation=(chatData)=>{
            return $http.post("http://localhost:5064/chat_app/fetchConversation",chatData).then(function(response){
                return response.data
        },function(error){
            console.log(error.data)
            return error.data;
        })
        }
        /**
         * @description : uses http post service, sends token as route parameter and password, confirm Password as request body
         * @param {token}, token is jwt token taken from route params
         * @param {passwordChangeData}, it's a object contains password and confirmpassword as properties
         */
        this.resetPassword=(token,passwordChangeData)=>{
            return $http({
                method: 'post',
                headers : {
                    "Content-Type":"application/json",
                    "authentication":token
                },
                url: "http://localhost:5064/chat_app/resetPassword",
                data : passwordChangeData
            }).then(function(response){
                return response.data;
            },function(error){
                return error.data;
            })
        }

    });
})();