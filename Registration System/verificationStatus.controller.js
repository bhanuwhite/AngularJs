'use strict';
angular.module('ApenDesigns')
        .controller('verificationStatusController', ['$scope','$state','$stateParams', 'LoginAuth',function ($scope,$state, $stateParams, LoginAuth) {
                console.log($stateParams.token,'token from url');
                var token ={token:$stateParams.token};
               LoginAuth.getEmailVerified(token).then(function(data){
                   console.log(data,'response data');
                  if(data.data.status == 200){
                      $scope.activate = true;
                  }else if(data.data.status == 400){
                      $scope.notActivate = true;
                  }
               }, function (response) {
                    console.log(response);
                });
            }]);





