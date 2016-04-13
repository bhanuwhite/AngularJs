'use strict';

angular.module('ApenDesigns')
        .controller('SigninController', ['$scope', '$rootScope', '$state', 'LoginAuth', function ($scope, $rootScope, $state, LoginAuth) {
                $scope.email = '';
                $scope.password = '';
                $scope.user = {
                    email: false,
                    password: false
                };
                $scope.resendmail = false;
                $scope.login = function () {
                    $scope.dataLoading = true;
                    $scope.danger = false;
                    $scope.user.email = false;
                    $scope.user.password = false;
                    LoginAuth.login($scope.email, $scope.password).then(
                            function (response) {
                                console.log('Successfully Logged IN', response);
                                if (response.data.status == 200)
                                {
                                    var data = {
                                        mode: 'info'
                                    }
                                    LoginAuth.setActiveClass(data).then(function (res) {
                                        console.log('Success', res);
                                        $state.go('account');
                                    }, function (res) {
                                        console.log('Error', res);
                                    });
                                }
                                else if (response.data.status == 400) {
                                    console.log('error', response.data.data.hasOwnProperty('error'));
                                    $scope.dataLoading = false;
                                    if (response.data.data.hasOwnProperty('error')) {
                                        $scope.resendmail = false;
                                        $scope.danger = response.data.data.error;
                                    }
                                    if (response.data.data.hasOwnProperty('email')) {
                                        $scope.resendmail = false;
                                        $scope.danger = "Incorrect email or password";
                                    }
                                    if (response.data.data.hasOwnProperty('verifyMail')) {
                                        $scope.danger = response.data.data.verifyMail;
                                        $scope.resendmail = true;
                                    }
                                }
                            },
                            /* error */
                                    function (status) {
                                        console.log('Failed with LogIN');
                                        $state.go('signin');
                                    }
                            );
                        };
                $scope.hideDangerAlert = function () {
                    $scope.danger = false;
                    $scope.maxLimitError = false;
                };
                $scope.resendLink = function () {
                    $scope.danger = 'Please Wait we are sending mail.....';
                    $scope.resendmail = false;
                    var data = {email: $scope.email};
                    LoginAuth.resendEmail(data).then(function (response) {
                        $scope.danger = 'Sending mail success. Please check Your mail!';
                        $scope.resendmail = false;
                    });
                };
            }]);




