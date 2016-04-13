'use strict';
angular.module('lifeLogger')
        .directive('previousPage', function ($window) {
                return {
                    restrict: 'E',
                    templateUrl: '<a href="#" class="btn btn-back">
                                    <i class="fa fa-chevron-left"></i>
                                    <span>Back</span>
                                </a>',
                    link: function (scope, element, attrs) {
                        element.on('click', function () {
                            $window.history.back();
                        });
                    }
                }
            });