'use strict';
angular.module('lifeLogger')
    .factory('Config', function(LIFELOGGER_API_URL) {
        return {
            baseUrl: function(url) {
                return LIFELOGGER_API_URL + url;
            }
        };
    });
