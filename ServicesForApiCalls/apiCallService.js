(function (angular, _, moment) {
    'use strict';

    angular.module('lifeLogger')
            .factory('VideoService', videoService);

    videoService.$inject = [
        '$q',
        '$http',
        '$interval',
        '$timeout',
        'Config',
        'VideoFilteringService',
        'OAuthToken'
    ];

    function videoService(
            $q,
            $http,
            $interval,
            $timeout,
            Config,
            VideoFilteringService,
            OAuthToken) {

        var _videoCache = _videoCache || [];

        var VideoService = {
            get: function (videoId) {
                var video = {};
                return $q(function (resolve,
                        reject) {
                    $http.get(Config.baseUrl('videos/' + videoId))
                            .success(function (response) {
                                video = response;
                                video.created = moment(video.created, 'x');
                                video.end = moment(video.end, 'x');
                                // Get the map data for the video
                                $http.get(Config.baseUrl('videos/map/' + video.id))
                                        .success(function (response) {
                                            if (response !== null) {
                                                video.gmap = response;
                                            }
                                            resolve(video);
                                        });
                                return;
                            }, function (status) {

                                reject(status);
                                return;
                            });
                });
            },
            getLiveStream: function (videoId) {
                var video;
                return $q(function (resolve, reject) {
                    $http.get(Config.baseUrl('livestream/' + videoId))
                            .success(function (response) {
                                resolve(response);
                            }).error(function (error) {
                                reject(error);
                            });
                });
            },
            getLiveCoordinates: function (videoId) {
                var video;
                return $q(function (resolve, reject) {
                    $http.get(Config.baseUrl('livestream/coordinates/' + videoId))
                            .success(function (response) {
                                resolve(response);
                            }).error(function (error) {
                                reject(error);
                            });
                });
            },
            getOne: function (videoId) {
                var video;
                return $q(function (resolve,
                        reject) {
                    $http.get(Config.baseUrl('videos/' + videoId))
                            .success(function (response) {
                                video = response;
                                video.created = moment(video.created, 'x');
                                video.end = moment(video.end, 'x');
                                resolve(video);
                                return;
                            });
                });
            },
            uploadThumbnailToTwitter: function (videoId) {
                return $q(function (resolve,
                        reject) {
                    $http.get(Config.baseUrl('social_media/tw/img/' + videoId))
                            .success(function (response) {
                                resolve(response);
                            })
                            .error(function (error) {
                                reject(error);
                            });
                });
            },
            uploadToYoutube: function (videoId, accessToken) {
                return $q(function (resolve,
                        reject) {
                    $http.post(Config.baseUrl('social_media/gl/upload'), {
                        video_key: videoId,
                        access_token: accessToken
                    })
                            .success(function (response) {
                                resolve(response);
                            })
                            .error(function (error) {
                                reject(error);
                            })
                });
            },
            checkYoutubeUploadStatus: function (shareKey) {
                return $q(function (resolve, reject) {
                    $http.get(Config.baseUrl('social_media/gl/status/' + shareKey))
                            .success(function (response) {
                                resolve(response);
                            })
                            .error(function (error) {
                                reject(error);
                            })
                });
            },
            getMapData: function (videoId) {
                return $http.get(Config.baseUrl('videos/map/' + videoId));
            },
            reloadVideos: function () {
                var $this = this,
                        def = $q.defer();

                if (OAuthToken.token) {
                    $http.get(Config.baseUrl('videos'))
                            .success(function (response) {
                                var filteredResponse = _.filter(response, function (video) {
                                    video.others = false;
                                    return video.statusId !== 4;
                                });
                                filteredResponse.sort($this.date_sort_desc);
                                _videoCache = $this.formatDates(filteredResponse);
                                def.resolve(_videoCache);
                            }).error(function () {
                        console.log('error with reloading');
                        def.reject('error');
                    });
                }
                else {
                    $timeout.cancel($this.relInterval);
                    def.reject('error');
                }

                return def.promise;
            },
            getAll: function () {
                var $this = this;
                var videos = [];
                var def = $q.defer();
                if (videos.length === 0) {
                    $http.get(Config.baseUrl('videos'))
                            .success(function (response) {
                                var responseFiltered = _.filter(response, function (video) {
                                    video.others = false;
                                    return video.statusId !== 4;
                                });
                                responseFiltered.sort($this.date_sort_desc);
                                _videoCache = $this.formatDates(responseFiltered);
                                def.resolve(_videoCache);
                            });
                } else {
                    def.resolve(videos);
                }
                return  def.promise;
            },
            updateVisibility: function (videoId, visibility) {
                return $http.post(Config.baseUrl('videos/visibility'), {
                    videoKey: videoId,
                    privacyStatus: visibility
                });
            },
            persist: function (video) {
                return $http.post(Config.baseUrl('videos/update'), {
                    id: video.id,
                    // TODO: is this method intended to persist other
                    // properties? If the answer is yes, probably the following
                    // code should be refactored, since it is only updating
                    // specific (and hardcoded) properties in the cache
                    title: video.title,
                    description: video.description
                }).then(function onPersistSuccess(response) {
                    var persistedVideo = response.data;
//                    var videoToUpdate = _.find(_videoCache, {id: video.id});
//                    console.log(videoToUpdate);
//                    videoToUpdate.title = persistedVideo.title;
//                    videoToUpdate.description = persistedVideo.description;
                    return persistedVideo;
                }, function onPersistError(response) {
                    console.error('Something bad happened during video persist: ', JSON.stringify(response));
                    throw new Error('Something bad happened during video persist.');
                }).then(function () {
                    return video;
                });
            },
            delete: function (videoId) {
                return $q(function (resolve, reject) {
                    if (!videoId) {
                        console.error('No video ID passed to VideoService.delete');
                        reject(videoId);
                        return;
                    }

                    $http.get(Config.baseUrl('videos/delete/' + videoId))
                            .success(function (response) {
                                _.remove(_videoCache, function (vid) {
                                    return vid.id === videoId;
                                });
                                return response;
                            })
                            .error(function (response) {
                                reject(response);
                                return response;
                            });

                    resolve(videoId);
                    return videoId;
                });
            },
            updateInfo: function (videoId) {
                console.log('Inside Update function');
                $http.post(Config.baseUrl('videos/update'), {
                    'id': videoId,
                    'title': 'new title',
                    'description': 'new description'
                })
                        .success(function (response) {
                            console.log(response);
                        })
                        .error(function (status) {
                            console.log(status);
                        });
            },
            getVideosInfo: function () {
                return $http.get(Config.baseUrl('users/info'));
            }
            

        };

        return (VideoService);
    }

})(window.angular, window._, window.moment);
