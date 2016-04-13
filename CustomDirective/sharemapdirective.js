'use strict';
angular.module('lifeLogger')
        .directive('sharemap', ['$timeout', 'GmapService', function ($timeout, GmapService) {
                return {
                    restrict: 'E',
                    templateUrl: 'app/components/videos/share.map.html',
                    scope: {
                        video: '=',
                        model: '=',
                        nonUserVideo: '=nonuservideo',
                        toggleTool: '=toggletool'
                    },
                    compile: function (element, attributes) {
                        return {
                            pre: function (scope, element, attributes, controller, transcludeFn) {
                                if (scope.video.gmap && scope.video.gmap.length !== 0) {
                                    scope.isHaveCoords = true;
                                    GmapService.init(scope.video.gmap, document.getElementById('right-map-canvas'), scope.video);
                                } else {
                                    scope.isHaveCoords = false;
                                }
                            },
                            post: function (scope, element, attributes, controller, transcludeFn) {
                                if (scope.model.isLiveVideo) {
                                    angular.element(document).ready(function () {
                                        window.flowplayer3.$f("flowplayer-live", "/flowplayer/flowplayer-3.2.16.swf", {
                                            clip: {
                                                url: scope.video.url,
                                                live: true,
                                                provider: 'influxis'
                                            },
                                            plugins: {
                                                influxis: {
                                                    url: "//releases.flowplayer.org/flowplayer.rtmp/flowplayer.rtmp-3.2.13.swf",
                                                    netConnectionUrl: 'rtmp://54.148.46.11/live'
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    },
                    controller: function ($scope, $http, Config, $rootScope, $window, VideoService) {
                        $timeout(function () {
                            if (!$scope.model.isLiveVideo) {
                                angular.element(document).ready(function () {
                                    var mapData = $scope.video.gmap;
                                    $window.player = angular.element('#flowplayer');


                                    $window.player.flowplayer({
                                        cuepoints: $scope.isHaveCoords && GmapService.getCuePointsByMapData(mapData),
                                        key: '$423987114027190',
                                        logo: '/img/logo_244x45.png',
                                        swf: '/flowplayer/flowplayer-3.2.16.swf',
                                        embed: false
                                    });
                                    $scope.isHaveCoords && $window.player.on("cuepoint", function (e, api, cuepoint) {
                                        $window.gmapApi = api;
                                        GmapService.reDrawMarker(mapData[GmapService.getIndexByCuePoint(mapData, cuepoint.time, api)], $scope.video);
                                    });
                                    if (!$rootScope.isSharedVideo) {
                                        $window.player.one("progress", function (e, api, time) {
                                            $http.post(Config.baseUrl('users/log'), {
                                                method: "PLAY_BUTTON_PRESSED",
                                                message: $scope.video.id
                                            });
                                        });
                                    }

                                    $scope.isHaveCoords && $window.player.on("seek", function (e, api) {
                                        GmapService.reDrawMarker(mapData[GmapService.getIndexByCuePoint(mapData, arguments[2], api)], $scope.video);
                                    });

                                    GmapService.player = $window.player.flowplayer();

                                });
                            }
                        }, 1);

                        $scope.toggle = "video";
                        $scope.toggleTool = true;

                        $scope.toggleMapWithVideo = function (tab) {
                            if (tab === 'map' && $scope.video.gmap && $scope.video.gmap.length !== 0) {
                                $scope.toggle = tab;
                                var rightThumbnailHeight = angular.element('#right-map-canvas').height();
                                angular.element('.video-container').css('height', rightThumbnailHeight + 'px');
                                GmapService.init($scope.video.gmap, document.getElementById('map-canvas'), $scope.video);
                                if (GmapService.player.video.time !== 0)
                                    GmapService.reDrawMarker($scope.video.gmap[GmapService.getIndexByCuePoint($scope.video.gmap, GmapService.player.video.time, $window.gmapApi)], $scope.video);
                                $scope.isHaveCoords && $window.player.on("cuepoint", function (e, api, cuepoint) {
                                    GmapService.reDrawMarker($scope.video.gmap[GmapService.getIndexByCuePoint($scope.video.gmap, cuepoint.time, api)], $scope.video);
                                });
                            } else if (tab === 'video') {
                                $scope.toggle = tab;
                                angular.element('.video-container').css('height', $scope.toolHeight + 'px');
                                if ($scope.toggleTool) {
                                    GmapService.init($scope.video.gmap, document.getElementById('right-map-canvas'), $scope.video);
                                    if (GmapService.player.video.time !== 0)
                                        GmapService.reDrawMarker($scope.video.gmap[GmapService.getIndexByCuePoint($scope.video.gmap, GmapService.player.video.time, $window.gmapApi)], $scope.video);
                                    $scope.isHaveCoords && $window.player.on("cuepoint", function (e, api, cuepoint) {
                                        GmapService.reDrawMarker($scope.video.gmap[GmapService.getIndexByCuePoint($scope.video.gmap, cuepoint.time, api)], $scope.video);
                                    });
                                }
                            }
                        };

                        $scope.clickTag = function (tag) {
                            var fp = flowplayer(0);
                            fp.seek(tag.position);
                        };

                        $scope.clickFace = function (face) {
                            var fp = flowplayer(0);
                            fp.seek(face.position);
                        };

                        
                    }
                }
            }]);
