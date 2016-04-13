var app = angular.module("MansysApp", [
    'ui.router',
    'ui.bootstrap',
    'ngTouch',
    'ngAnimate',
    'ngSanitize',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ngStorage',
    'ngLoadingSpinner'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('myInterceptor');
        $urlRouterProvider.otherwise("/");
        $stateProvider
                .state('login', {
                    url: "/",
                    templateUrl:"login.html",
                    controller: "LoginController"
                })
                .state('template', {
                    templateUrl: "templates/template.html"
                })
                 .state('template.companyPage',{
                    url: "/companyPage",
                    views: 
                            {
                                'mansysForm':
                                {
                                    templateUrl: "templates/main.html",
                                    controller: "MainController"
                                }
                            }
                })
                .state('template.bank', {
                    url: "/view-bank",
                    views:
                            {
                                'mansysForm':
                                        {
                                            templateUrl: "templates/main.html",
                                            controller: "MainController"
                                        }
                            }
                })
                .state('template.notifyparties', {
                    url: "/view-notify-parties",
                    views:
                            {
                                'mansysForm':
                                        {
                                            templateUrl: "templates/main.html",
                                            controller: "MainController"
                                        }
                            }
                })
                .state('template.seller', {
                    url: "/view-seller",
                    views:
                            {
                                'mansysForm':
                                        {
                                            templateUrl: "templates/main.html",
                                            controller: "MainController"
                                        }
                            }
                })
                .state('template.new', {
                    url: "/seller/new",
                 views:                                    
                {   
                    'mansysForm':
                    {
                        'mansysForm':
                                {
                                    templateUrl: "templates/main.html",
                                    controller: "MainController"
                                }
                    }
                 }
                })
                .state('template.forwarders', {
                    url: "/view-forward",
                    views:
                            {
                                'mansysForm':
                                        {
                                            templateUrl: "templates/main.html",
                                            controller: "MainController"
                                        }
                            }
                });
    }]);