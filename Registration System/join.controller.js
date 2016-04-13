'use strict';
angular.module('ApenDesigns')
        .controller('JoinController', ['$scope', '$rootScope', '$state', 'LoginAuth', '$timeout', function ($scope, $rootScope, $state, LoginAuth, $timeout) {
                $scope.api = {
                    'username': false,
                    'email': false
                };
                $scope.user = {
                    'password': '',
                    'password1': ''
                };
                $scope.$watch("user.password1", function (newValue, oldValue) {
                    if (newValue == $scope.user.password) {
                        $scope.isMatch = false;
                    } else {
                        $scope.isMatch = true;
                    }
                });
                $scope.join = function () {
                    $scope.danger = false;
                    console.log($scope.captcha.challenge, $scope.captcha.response);
                    $scope.api.username = false;
                    $scope.api.email = false;
                    var data = {
                        "username": $scope.user.username,
                        "email": $scope.user.email,
                        "password": $scope.user.password,
                        "rePassword": $scope.user.password1
                    }
                    $scope.dataLoading = true;
//                    
                    LoginAuth.verifyCaptcha($scope.captcha.challenge, $scope.captcha.response).then(
                            function (response) {
                                console.log('Successfully Logged IN', response);
                                if (response.data.indexOf('true') !== -1) {
                                    LoginAuth.join(data).then(
                                            function (data) {
                                                console.log('Successfully Logged IN', data);
                                                if (data.data.status == 200)
                                                {
                                                    $scope.success = "Thank you for joining APEN Designs. Please activate your account via the link we have sent you.";
                                                    $scope.dataLoading = false;
                                                } else if (data.data.status == 400) {
                                                    if (data.data.data.hasOwnProperty('username')) {
                                                        $scope.api.username = true;
                                                    }
                                                    if (data.data.data.hasOwnProperty('email')) {
                                                        $scope.api.email = true;
                                                    }
                                                    $scope.dataLoading = false;
                                                }
                                            },
                                            function (data) {
                                                console.log('Failed with LogIN');
                                                $state.go('join');
                                            }
                                    );
                                } else if (response.data.indexOf('false') !== -1) {
                                    $scope.dataLoading = false;
                                    $scope.danger = 'Incorrect Captcha.';
                                    Recaptcha.reload();
                                }
                            },
                            function (data) {
                                console.log('Failed with LogIN');
                            }
                    );
                };
                $scope.hideSuccessAlert = function () {
                    $scope.success = false;
                };
                $scope.hideDangerAlert = function () {
                    $scope.danger = false;
                };
                $scope.checkEmailExists = function () {
                    var email = {
                        'email': $scope.user.email
                    };
                    LoginAuth.checkEmailExists(email).then(function (data) {
                        if (data.data.status == 200) {
                            $scope.api.email = true;
                        } else {
                            $scope.api.email = false;
                        }
                    });
                };
                $scope.checkUserNameExists = function () {
                    var username = {
                        'username': $scope.user.username
                    }
                    LoginAuth.checkUserNameExists(username).then(function (data) {
                        if (data.data.status == 200) {
                            $scope.api.username = true;
                        } else {
                            $scope.api.username = false;
                        }
                    });
                }
            }]);




