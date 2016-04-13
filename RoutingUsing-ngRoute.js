'use strict';

angular.module('ApenDesigns')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', 'reCAPTCHAProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, reCAPTCHAProvider) {
                $stateProvider
                        .state('landing', {
                            url: '/',
                            templateUrl: 'views/app/modules/landing/landing.html',
                            controller: 'LandingController'
                        })
                        .state('404', {
                            url: '/404',
                            templateUrl: 'views/app/404.html'
                        })
                        .state('signin', {
                            url: '/login',
                            templateUrl: 'views/app/modules/signin/signin.html',
                            controller: 'SigninController'
                        })
                        .state('join', {
                            url: '/join',
                            templateUrl: 'views/app/modules/join/join.html',
                            controller: 'JoinController'
                        })
                        .state('dashboard', {
                            abstract: true,
                            url: '/dashboard',
                            templateUrl: 'views/app/modules/dashboard/navigation.html',
                            authenticate: true
                        })
                        .state('dashboard.myinfographics', {
                            url: '/myinfographics',
                            templateUrl: 'views/app/modules/dashboard/profile/my.infographics.html',
                            controller: 'MyInfographicsController',
                            authenticate: true
                        })
                        .state('dashboard.modules', {
                            url: '/modules/:infographicId',
                            templateUrl: 'views/app/modules/dashboard/profile/list.module.html',
                            controller: 'ListModuleController',
                            authenticate: true
                        })
                        .state('infographic', {
                            url: '/infographic/:infographicId',
                            templateUrl: 'views/app/modules/dashboard/profile/infographic.public.html',
                            controller: 'InfographicPublicController',
                            authenticate: true
                        })
                        .state('account', {
                            url: '/account',
                            templateUrl: 'views/app/modules/account/account.html',
                            controller: 'AccountController',
                            authenticate: true
                        })
                        .state('leftsidepreview', {
                            url: '/info_preview/:infoId',
                            templateUrl: 'views/app/modules/dashboard/sidebarview/preview.view.html',
                            controller: 'LeftSideNavPreviewController'
                        });
                $urlRouterProvider.when('', '/');
                $urlRouterProvider.otherwise('/404');

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
                //angular-reCaptcha: site key
                reCAPTCHAProvider.setPublicKey('6LdlrwwTAAAAAFIzKbAnDeifUvGmEngx3JVk-WEF');
                //angular-reCaptcha: custom theme
                reCAPTCHAProvider.setOptions({
                    theme: 'custom',
                    custom_theme_widget: 'recaptcha_widget'
                });
            }]);