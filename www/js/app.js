// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-material', 'ngCookies', 'ngCordova', 'starter.controllers', 'starter.services','starter.hrService', 'starter.message', 'starter.notificationHub', 'starter.security', 'starter.Aop', 'ionMdInput', 'ion-floating-menu', 'ionic.rating', 'monospaced.elastic', 'angularMoment', 'starter.directives', 'lokijs'])
.run(function ($http, $timeout, $ionicPlatform, $rootScope, $state, $cordovaPushV5, $cordovaNetwork, $ionicPopup, $cordovaToast, serverConfig) {

    
    window.localStorage.setItem('appVersion', '0.0.1');


   // var idbAdapter = new LokiIndexedAdapter('finance');
    var db= $rootScope.db = new loki('cache.db',{
                autosave: true,
                autosaveInterval: 1000,
                //adapter: idbAdapter
    });

    var db = $rootScope.db
    db.loadDatabase({}, function () {
        var messages = db.getCollection('messages')
        if (!messages) {
            console.log('%c there is nocollection in database', 'background: #222; color: #bada55')
            messages = db.addCollection('messages')
            messages.insert({title:'this is first message in module'})

        }

        var messages = db.getCollection('messages')
        if (!messages) {
            console.log('there is nocollection in dabase')
            messages = db.addCollection('messages')
            messages.insert({ title: 'this is first message in module' })

        }

    })
    
    $rootScope.offlineMessage = 'شما به اینترنت وصل نیستید';



    var authToken = window.localStorage.getItem('authToken')
    if (authToken == 'undefined') {
        $state.go('login');
        event.preventDefault();
    }
    $ionicPlatform.ready(function () {

        $http.get(serverConfig.serverUrl+'/api/account/version').success(function (res, status) {

            var appVersion = window.localStorage.getItem('appVersion');
            var serverVersion = res.result.version;

            if (serverVersion > appVersion) {
                $rootScope.$emit('newVersionAvailabe')
            }
        })

        $rootScope.$on('newVersionAvailabe', function () {
            console.log('new app version for download');
            //http://localhost:6634/Home/Download?fileName=erm-android.apk
            //alert using toast or something else to notify user new version download
            $ionicPopup.alert({
                //title: 'به روز رسانی',
                template: 'این نسخه نیاز به ارتقا دارد، لطفا سریعا اقدام نمایید',
                okText: 'باشه'
            });

    //        $cordovaToast
    //.show('نسخه جدید نرم افزار موجود ات جهت به روز رسانی کلیک کنید', 'long', 'center')
    //.then(function (success) {
    //    // success
    //    console.log('click to download new app version')
    //}, function (error) {
    //    // error
    //});
        })



        $rootScope.$on('someThingWrong', function () {
            // subscribed to error code greater than 400

            if ($state.current.name == 'login') {

                $ionicPopup.alert({
                    title: 'خطا',
                    template: '<p style="text-align:center"> رمز ورد یا کلمه کاربری اشتباه می باشد</p>',
                    okText: 'باشه'

                }).then(function (res) {

                })
            }
            else {

                $ionicPopup.alert({
                    title: 'خطا',
                    template: '<p style="text-align:center"> یه اشکالی تو برنامه  پیش اومد . لطفا مجددا سعی  کنید</p>',
                    okText: 'باشه'

                }).then(function (res) {

                })
            }
        })

        $rootScope.$on('connectionErr', function () {
            // subscribed to error code greater than 400

           
                $ionicPopup.alert({
                    title: 'خطا',
                    template: '<p style="text-align:center"> یه اشکالی در ارتباط با سرور پیش اومد . لطفا مجددا سعی  کنید</p>',
                    okText: 'باشه'

                }).then(function (res) {

                })
          
        })
        

        $rootScope.$on('apiOffline', function () {
            $ionicPopup.alert({
                title: 'خطا',
                template: '<p style="text-align:center"> یه اشکالی در ارتباط با سرور پیش اومد . لطفا مجددا سعی  کنید</p>',
                okText: 'باشه'

            }).then(function (res) {

            })
            event.preventDefault();
        });

        $rootScope.$on('403', function () {
            $ionicPopup.alert({
                title: 'خطا',
                template: '<p style="text-align:center">رمز ورود یا کلمه کاربری اشتباه است </p>',
                okText: 'باشه'

            }).then(function (res) {
            })

        })


        


        var type = $cordovaNetwork.getNetwork()
        var isOnline = $cordovaNetwork.isOnline()
        var isOffline = $cordovaNetwork.isOffline()
        if (isOnline == true) {
            $rootScope.$emit('onlineNetwork')
        }
        if (isOffline == true) {
            $rootScope.$emit('offlineNetwork')
        }
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $rootScope.$emit('onlineNetwork')
            $rootScope.isOnline = true;
        })
        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $rootScope.$emit('offlineNetwork')
            $rootScope.isOnline = false;
        })
        $rootScope.$on('logout', function (event, data) {
            push.unregister(function () {
                console.log('success');
            }, function () {
                console.log('error');
            });
        })
        $rootScope.$on('login', function (event, data) {
        })
       
        var options = {
            android: {
                senderID: "763986669211"
            }
            , ios: {
                alert: "true"
                , badge: "true"
                , sound: "true"
            }
            , windows: {}
        };
        // initialize
        $cordovaPushV5.initialize(options).then(function () {
            // start listening for new notifications
            $cordovaPushV5.onNotification();
            // start listening for errors
            $cordovaPushV5.onError();
            // register to get registrationId
            $cordovaPushV5.register().then(function (registrationId) {
                // save `registrationId` somewhere;
                window.localStorage.setItem("appToken", registrationId)
            })
        });
        // triggered every time notification received
        $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            if (data.additionalData.IsRecivedFromManager) {
                if ($state.current.name == 'employeeConversations') {
                    $state.reload();
                }


                window.localStorage.setItem("recviedFrommanager", true)
                return;
            } else if (data.additionalData.IsSentToManager) {
                //$state.go('tab.managerInboxMessage', {
                //    messageId: data.additionalData.MessageId
                //})
            } else {
                $state.go('tab.Message')
            }
        });
        // triggered every time error occurs
        $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
            // e.message
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, nextParams, fromState) {
            if (window.localStorage.getItem('authToken') == undefined) {
                if (toState.name != 'login' && toState.name != 'signup' && toState.name != 'token' && toState.name != 'setPassword') {
                    console.log('redirected to login page')
                    //to prevent the transition from happening.
                    event.preventDefault();
                    $state.go('login');
                }
            }
        })
        if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $compileProvider, $ionicConfigProvider) {
    //$ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ftp|blob):|data:image\//);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab'
        , abstract: true
        , templateUrl: 'templates/tabs.html'
        , controller: 'tabCtrl'
        })
    // Each tab has its own nav history stack:
    .state('tab.home', {
       
         url: '/home'
        , views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html'
                , controller: 'HomeCtrl'
            }
        }
    })
    .state('tab.category', {
        cache: true
            , url: '/category'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-category.html'
                    , controller: 'CategoryCtrl'
                }
            }
    })
        .state('tab.serviceType', {
            cache: true
            , url: '/category/:categoryId/serviceType'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/serviceType.html'
                    , controller: 'ServiceTypeCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
        })
    .state('tab.generalService', {
        cache: true
            , url: '/x/serviceType/:serviceTypeId/generalService/'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/generalService.html'
                    , controller: 'generalServiceCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
        .state('tab.generalServiceDetail', {
            url: '/generalServiceDetail/:generalServiceId'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/generalServiceDetail.html'
                    , controller: 'generalServiceDetailCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
        })
    .state('tab.flightService', {
        cache: true
            , url: 'x/category/serviceType/:serviceTypeId/flightService'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/flightService.html'
                    , controller: 'flightServiceCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
        .state('tab.flightServiceDetail', {
            url: '/flightServiceDetail/:flightServiceId'
            , views: {
                'tab-dash': {
                    templateUrl: 'templates/flightServiceDetail.html'
                    , controller: 'flightServiceDetailCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
        })
    .state('tab.Message', {
        cache: true
            , url: '/messages'
            , views: {
                'tab-messages': {
                    templateUrl: 'templates/tab-messages.html'
                    , controller: 'MessageCtrl'
                }
                , 'menuContent': {
                    templateUrl: 'templates/tab-message-menu.html'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
    .state('tab.MessageDetail', {
        url: '/messageDetail/:messageId'
            , views: {
                'tab-messages': {
                    templateUrl: 'templates/messageDetail.html'
                    , controller: 'MessageDetailCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
    .state('tab.groups', {
        cache: false
            , url: '/groups'
            , views: {
                'tab-group': {
                    templateUrl: 'templates/tab-groups.html'
                    , controller: 'GroupCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
    .state('tab.employeeMessages', {
            cache: true
            , url: '/employeeMessages'
            , views: {
                'tab-group': {
                    templateUrl: 'templates/employeeMessages.html'
                    , controller: 'EmployeeMessagesCtrl'
                }
            }
            , params: {
                groupsId: []
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
    .state('tab.employeeFavMessages', {
            cache:false,
            url: '/employeeFavMessages',
            views: {
                'tab-favorite': {
                    templateUrl: 'templates/employeeFavMessages.html'
                    , controller: 'EmployeeFavMessagesCtrl'
                }
            },
            resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
        })
   
    .state('tab.Registration', {
        cache: true
            , url: '/registrations'
            , views: {
                'tab-registration': {
                    templateUrl: 'templates/tab-registration.html'
                    , controller: 'RegistrationCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })
    .state('tab.FlightRegistrationDetail', {
        url: '/flightRegistrationDetail/:flightServiceId'
            , views: {
                'tab-registration': {
                    templateUrl: 'templates/flightServiceRegistrationDetail.html'
                    , controller: 'flightServiceDetailCtrl'
                }
            }
            , resolve: {
                "check": function ($location) {
                    var authToken = window.localStorage.getItem('authToken')
                    if (authToken == 'undefined') {
                        $location.path('/login'); //redirect user to home.
                        event.preventDefault();
                        return;
                    }
                }
            }
    })

    .state('tab.GeneralServiceRegistrationDetail', {
        url: '/generalServiceRegistrationDetail/:generalServiceId'
        , views: {
            'tab-registration': {
                templateUrl: 'templates/generalServiceRegistrationDetail.html'
                , controller: 'generalServiceDetailCtrl'
            }
        }
        , resolve: {
            "check": function ($location) {
                var authToken = window.localStorage.getItem('authToken')
                if (authToken == 'undefined') {
                    $location.path('/login'); //redirect user to home.
                    event.preventDefault();
                    return;
                }
            }
        }
    })
    .state('tab.employeeSentMessages', {
        url: '/employeeSentMessages'
        , views: {
            'tab-employeeSentMessages': {
                templateUrl: 'templates/employeeSentMessages.html'
                , controller: 'employeeSentMessagesCtrl'
            }
        }
    })
    .state('tab.employeeSentMessage', {
        url: '/employeeSentMessage/:messageId'
        , views: {
            'tab-employeeSentMessages': {
                templateUrl: 'templates/employeeSentMessage.html'
                , controller: 'employeeSentMessageCtrl'
            }
        }
    })
    .state('tab.employeeInboxMessages', {
        url: '/employeeInboxMessages'
        , views: {
            'tab-employeeInboxMessages': {
                templateUrl: 'templates/employeeInboxMessages.html'
                , controller: 'employeeInboxMessagesCtrl'
            }
        }
    })
    .state('tab.employeeInboxMessage', {
        url: '/employeeInboxMessage/:messageId'
        , views: {
            'tab-employeeInboxMessages': {
                templateUrl: 'templates/employeeInboxMessage.html'
                , controller: 'employeeInboxMessageCtrl'
            }
        }
    })
    .state('tab.employeeConversations', {
        url: '/employeeConversations'
        , views: {
            'tab-employee-contact': {
                templateUrl: 'templates/employeeConversations.html'
                , controller: 'employeeConversationsCtrl'
            }
        }
        , resolve: {
            "check": function ($location) {
                var authToken = window.localStorage.getItem('authToken')
                if (authToken == 'undefined') {
                    $location.path('/login'); //redirect user to home.
                    event.preventDefault();
                    return;
                }
            }
        }

    })
    .state('tab.managerConversationsBrief', {
        url: '/managerConversationsBrief'
        , views: {
            'tab-manager-contact': {
                templateUrl: 'templates/managerConversationsBrief.html'
                , controller: 'managerConversationsBriefCtrl'
            }
        }
        , resolve: {
            "check": function ($location) {
                var authToken = window.localStorage.getItem('authToken')
                if (authToken == 'undefined') {
                    $location.path('/login'); //redirect user to home.
                    event.preventDefault();
                    return;
                }
            }
        }
        , cache: false
    })
    .state('tab.managerConversationsByEmployee', {
            url: '/managerConversationsByEmployee'
            , params: { myParam: null }
        , views: {
            'tab-manager-contact': {
                templateUrl: 'templates/managerConversationsByEmployee.html'
                , controller: 'managerConversationsByEmployeeCtrl'
            }
        }
        })
    .state('sendMessageToManager', {
        url: '/sendMessageToManager'
        , templateUrl: 'templates/sendMessageToManager.html'
        , controller: 'sendMessageToManagerCtrl'
    })
    .state('tab.managerSentMessages', {
        url: '/managerSentMessages'
        , views: {
            'tab-managerSentMessages': {
                templateUrl: 'templates/managerSentMessages.html'
                , controller: 'managerSentMessagesCtrl'
            }
        }
    })
    .state('tab.managerSentMessage', {
        url: '/managerSentMessage/:messageId'
        , views: {
            'tab-managerSentMessages': {
                templateUrl: 'templates/managerSentMessage.html'
                , controller: 'managerSentMessageCtrl'
            }
        }
    })
    .state('tab.managerInboxMessages', {
        url: '/managerInboxMessages'
        , views: {
            'tab-managerInboxMessages': {
                templateUrl: 'templates/managerInboxMessages.html'
                , controller: 'managerInboxMessagesCtrl'
            }
        }
    })
    .state('tab.managerInboxMessage', {
        url: '/managerInboxMessage/:messageId'
        , views: {
            'tab-managerInboxMessages': {
                templateUrl: 'templates/managerInboxMessage.html'
                , controller: 'managerInboxMessageCtrl'
            }
        }
    })
    .state('tab.replytoEmployeeMessage', {
        url: '/replytoEmployeeMessage/:messageId'
        , views: {
            'tab-sendMessageToManager': {
                templateUrl: 'templates/sendMessageToManager.html'
                , controller: 'sendMessageToManagerCtrl'
            }
        }
    })
    .state('login', {
        url: '/login'
        , templateUrl: 'templates/account_login.html'
        , controller: 'loginCtrl'
    ,
    })
    .state('signup', {
        url: '/signup'
        , templateUrl: 'templates/account_signup.html'
        , controller: 'signupCtrl'
    })
    .state('token', {
        url: '/token'
        , templateUrl: 'templates/account_token.html'
        , controller: 'tokenCtrl'
    })
    .state('setPassword', {
        url: '/setPassword'
        , templateUrl: 'templates/account_setPassword.html'
        , controller: 'setPasswordCtrl'
    })
    .state('splash', {
        url: '/splash'
        , templateUrl: 'templates/splash.html'
        , controller: 'splashCtrl'
    })
    .state('error', {
        url: '/error'
        , templateUrl: 'templates/error.html'
        , controller: 'errorCtrl'
    ,
    })

    .state('userProfile', {
        url: '/userProfile'
        ,templateUrl: 'templates/userProfile'
        ,controller:'userProfileCtrl'
    })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/splash');
    //Send Security token To Server / Broadcast unathorized message on rootScope  
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('AuthInspector')
})
// fitlers
.filter('nl2br', ['$filter',
  function ($filter) {
      return function (data) {
          if (!data) return data;
          return data.replace(/\n\r?/g, '<br />');
      };
  }
]);
