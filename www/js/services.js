angular.module('starter.services', [])
angular.module('starter')
    .constant("serverConfig", {
        "serverUrl": "http://hr-panel.pogc.ir"
        //http://erm.raykam.ir
        //http://localhost:6634
        //http://192.168.1.203:6634
        //http://hr-panel.pogc.ir
    })
angular.module('starter')
    .filter('jalaliDate', function () {
        return function (inputDate, format) {
            if (inputDate == null) return;
            var date = moment(inputDate);
            return date.format(format);
        }
    })
angular.module('starter.hrService', [])
    .factory('hrServiceRepository', ['$http', 'serverConfig', function ($http, serverConfig) {
        // Might use a resource here that returns a JSON array
        var baseUrl = serverConfig.serverUrl + '/api/services/app/hrService/';
        return {
            getCategoryList: function () {
                return $http.post(baseUrl + 'getEmployeeCategoryList')
            }
            , getCategoryServiceTypeList: function (categoryId) {
                return $http.post(baseUrl + 'getEmployeeCategoryServiceTypeList', {
                    id: categoryId
                })
            }
            , getGeneralServiceList: function (serviceTypeId) {
                return $http.post(baseUrl + 'getEmployeeServiceTypeHrServiceList', {
                    id: serviceTypeId
                })
            }
            , getFlightServiceList: function (serviceTypeId) {
                return $http.post(baseUrl + 'GetEmployeeFlightServiceList', {
                    id: serviceTypeId
                })
            }
            , getGeneralServiceDetail: function (serviceId) {
                return $http.post(baseUrl + 'getEmployeeGeneralServiceDetail', {
                    id: serviceId
                })
            }
            , getFlightServiceDetail: function (serviceId) {
                return $http.post(baseUrl + 'getEmployeeFlightServiceDetail', {
                    id: serviceId
                })
            }
            , registerForService: function (serviceId) {
                return $http.post(baseUrl + 'registerForService', {
                    id: serviceId
                })
            }
            , getEmployeeMessageList: function () {
                return $http.post(baseUrl + 'getEmployeeMessageList')
            }
            , getRegistrationList: function () {
                return $http.post(baseUrl + 'getEmployeeRegistrationList')
            }
        };
    }]);
angular.module('starter.message', [])
    .factory('messageRepository', ['$http', 'serverConfig', function ($http, serverConfig) {
        var baseUrl = serverConfig.serverUrl + '/api/services/app/hrService/';
        return {
            getMessageList: function () {
                //Id is Required in ServerSide , I Dont know Why it Is Not Required When Sending Request from Web App .
                return $http.post(baseUrl + 'getEmployeeMessageList', {
                    id: '00000000-0000-0000-0000-000000000000'
                })
            }
            , readMessage: function (messageId) {
                return $http.post(baseUrl + 'readMessage', {
                    id: messageId
                })
            }
        }
    }]);
angular.module('starter.notificationHub', [])
    .factory('notificationHubRepository', ['$rootScope', '$q', '$http', '$cordovaFile', 'Loki', 'serverConfig', function ($rootScope, $q, $http,$cordovaFile, Loki, serverConfig) {
        var baseUrl = serverConfig.serverUrl + '/api/services/app/notificationHub/';


       // var idbAdapter = new LokiIndexedAdapter('cache');
        var db = new Loki('groupCache.db', {
            autosave: true
            , autosaveInterval: 1000
            //, adapter: idbAdapter
        });
        var groups;

        db.loadDatabase({}, function () {
            groups = db.getCollection('groups')
        });


        return {
            getGroups: function () {
                return ($q(function (resolve, reject) {
                    db.loadDatabase({
                    }, function () {
                         groups = db.getCollection('groups')

                         if ($rootScope.isOnline == false) {
                             console.log('')
                        
                           
                            if (!groups) {
                                groups = db.addCollection('groups')
                                $http.post(baseUrl + 'getGroups').then(function (res) {

                                    for (var i = 0; i < res.data.result.items.length; i++) {
                                        console.log(i)
                                        var item = res.data.result.items[i]

                                        groups.insert(res.data.result.items[i])
                                    }
                                })

                                groups = db.getCollection('groups')
                            }

                            else {
                                //else mean if group collection exist.

                            }
                    
                         }

                         else {

                                
                             if (!groups) {
                                 groups = db.addCollection('groups')
                             }

                             else {
                                   groups.chain().remove();
                             }
                             

                             return $http.post(baseUrl + 'getGroups').then(function (res) {
                               
                                 

                                for (var i = 0; i < res.data.result.items.length; i++) {
                                    console.log(i)
                                    var item = res.data.result.items[i]
                                    
                                    groups.insert(res.data.result.items[i])
                                   
                                    
                                }
                                db.saveDatabase();
                                groups = db.getCollection('groups');

                                return resolve(groups.data);
                            })

                        }
                    return resolve(groups.data);
                    })

                })


            )
            }





            , getEmployeeMessages: function (input) {
                return $http.post(baseUrl + 'getEmployeeMessages', input)
            }
            , getMessageImage: function (messageId) {
                return ($q(function (resolve, reject) {
                    var imageName = messageId + '.jpeg'
                    var image=null;
                    return  $cordovaFile.checkFile(cordova.file.dataDirectory, imageName)
                        .then(function (success) {
                            // success

                            // READ
                            console.log(success);

                            return $cordovaFile.readAsBinaryString(cordova.file.dataDirectory, success.name)
                              .then(function (resx) {
                                  // success
                                  image = resx
                                  return resolve(image)
                              }, function (errorx) {
                                  // error
                                  console.log(errorx)
                              });


                            

                        }, function (error) {
                            // error
                            return $http.post(baseUrl + 'getMessageImage', {
                                id: messageId
                            }).then(function (res) {
                                image = res.data.result.image;
                                $cordovaFile.writeFile(cordova.file.dataDirectory, imageName, image, true)
                                    .then(function (success) {
                                        console.log('file created')
                                        return resolve(image);
                                    }, function (error) {
                                        console.log('could not create file')
                                        return resolve(image)
                                    });
                            })
                           
                        });
                   

                   file.then(function (data) {
                       console.log(data)
                       console.log(file)
                       
                   })
                   
                   return resolve(image)
                }))
       
            }
        }
    }])

angular.module('starter.security', [])
    .factory('userManager', ['$http', '$state', 'serverConfig', function ($http, $state, serverConfig) {
        var baseUrl = serverConfig.serverUrl + '/api/account/';
        return {
            login: function (userName, password, appToken) {
                return $http.post(baseUrl + 'authentication', {
                    UsernameOrEmailAddress: userName
                    , password: password
                    , AppToken: appToken
                })
            }
            , logout: function () {
                window.localStorage.removeItem("authToken")
                $http.post(baseUrl + 'logout')
                $state.go('login');
                return
            }
            , authenticate: function () {
                if (window.localStorage.getItem('authToken') == undefined) {
                    event.preventDefault();
                    $state.go('login');
                    return false
                } else {
                    return true;
                }
            }
        ,
        }
    }
    ])
angular.module('starter.Aop', [])
    .factory('AuthInspector', ['$rootScope', '$q', '$injector', function AuthInspector($rootScope, $q, $injector) {
        var service = {
            request: function (config) {
                var authToken = window.localStorage.getItem('authToken')
                config.headers.Authorization = 'Bearer ' + authToken;
                return config
            }
            , responseError: function (response) {
                //'401' means user is not authenticated 
                var statusCode = Number(response.status)
                if (response.status == '401') {
                    //can not use $state directly here , you get circular dependency error
                    event.preventDefault()
                    $injector.get('$state').transitionTo('login');
                    return $q.reject(response);
                    //we can also broadcastg event  and listen to event on controller
                    //$rootScope.$broadcast('unathorized');
                }
                //'401' means loginfailed 
                if (response.status == '403') {

                    return $q.reject(response);
                    //we can also broadcastg event  and listen to event on controller
                    $rootScope.$broadcast('403');
                }


                if (statusCode >= 400 && statusCode < 500) {
                    $rootScope.$emit('connectionErr')
                    return $q.reject(response);
                }

                if (statusCode >= 500) {
                    $rootScope.$emit('someThingWrong')
                    return $q.reject(response);
                }
                if (response.status <= 0) {
                    $rootScope.$emit('apiOffline')
                    return $q.reject(response);
                }
                return response
            }
        };
        return service;
    }]);