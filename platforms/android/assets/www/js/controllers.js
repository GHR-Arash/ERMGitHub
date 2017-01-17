/*property
    $broadcast, ServiceId, Vote, alert, authenticate, categoryId, categoryList,
    categoryName, controller, doRefresh, error, finally, generalServiceId,
    generalServiceList, get, getCategoryList, getCategoryServiceTypeList,
    getGeneralServiceList, getGeneralServiceLists, getItem, go, goToDetail,
    goToServiceType, goToState, hide, id, isFlightServiceType, isInProgress,
    isManager, items, localStorage, log, logout, max, message, module, okText,
    post, put, rate, rating, result, serverUrl, serviceTypeId, serviceTypeList,
    serviceTypeName, show, showAlert, success, template, then, title, vote,
    voteToServiceInput
*/
angular.module('starter.controllers', [])

.controller('tabCtrl', function ($scope, $state, $http, $q,$ionicSideMenuDelegate, userManager, serverConfig) {

    $scope.isManager = function () {
        var isManager = window.localStorage.getItem('isManager');
        if (isManager == 'true') {
            return true;
            $state.refresh()
        }
        else {
            return false
            $state.refresh()
        }

    }
    //check if the user exist else it will redirect to login 
    $scope.authenticate = function () {

        userManager.authenticate();
    }

    $scope.goToState = function (state) {
        $state.go(state);
    }

    /** @description clear the user session from server and local variable that holds information about user.
     */
    $scope.logout = function () {
        $http.post(serverConfig.serverUrl + "/api/account/logout").then(function (res) {
            console.log('methode is successed')
            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('isManager');
            window.localStorage.removeItem('userFullName');
            $ionicSideMenuDelegate.toggleLeft();
            $state.go('login');
        }, function () { })
    }
})
 .controller('splashCtrl', function ($rootScope, $scope, $state, $ionicPopup, $http, userManager, serverConfig) {

     //check if user is already authenticated if false then he will be redirected to login page




     $scope.showAlert = function (message) {
         $ionicPopup.alert({
             title: 'خطا',
             template: '<p style="text-align:center">' + message + '</p>',
             okText: 'باشه'

         }).then(function (res) {

         });
     };

     if ($rootScope.isOnline == false) {
         $scope.showAlert($rootScope.offlineMessage);
         return;
     }


     var result = userManager.authenticate();
     console.log('this is splash screen');

     if (result == true) {


         $rootScope.userFullName = window.localStorage.getItem('userFullName');

         if (window.localStorage.getItem('shouldChangePassword') && window.localStorage.getItem('shouldChangePassword') == 'true') {
             $state.go('setPassword');
             return;
         }

         $state.go('tab.home');
     }


     //check if the user exist else it will redirect to login 
     $scope.authenticate = function () {




         $http.get(serverConfig.serverUrl + '/api/account/validation').success(function (res, status) {

             if (status == '200') {

                 //check if the user need to change password
                 if (window.localStorage.getItem('shouldChangePassword') && window.localStorage.getItem('shouldChangePassword') == 'true') {
                     $state.go('setPassword');
                     return;
                 }

                 $state.go('tab.home');
             }

         }).error(function (data, status) {
             console.log(status)
         })
         .finally(function () {


         })




     }

     //$scope.authenticate();


 })

.controller('HomeCtrl', function ($scope, $state, $http, userManager, serverConfig, $ionicPopup, $cordovaFileTransfer) {

    // Please don't delete this part.

    // #region Way 1

    //document.addEventListener('deviceready', function () {

    //    var url = "http://192.168.1.201:6634/Home/Download?fileName=erm-android.apk";
    //    //var targetPath = cordova.file.dataDirectory + "erm-android.apk";
    //    //file:///storage/emulated/0/Downloads/erm-android.apk
    //    var targetPath = "file:///storage/emulated/0/Downloads/erm-android.apk";
    //    $ionicPopup.alert({
    //        template: targetPath
    //    });
    //    var trustHosts = true;
    //    var options = {};

    //    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
    //      .then(function (result) {
    //          // Success!
    //      }, function (err) {
    //          // Error
    //      }, function (progress) {
    //          $timeout(function () {
    //              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
    //          });
    //      });

    //}, false);

    // #endregion

    // #region Way 2

    //window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fs) {
    //    fs.root.getFile("erm-android.apk", { create: true, exclusive: false },
    //      function (entry) {
    //          var fileTransfer = new FileTransfer();
    //          fileTransfer.download(
    //                  "file:///storage/emulated/0/Downloads/erm-android.apk", // the filesystem uri you mentioned                  
    //                  "http://192.168.1.201:6634/Home/Download?fileName=erm-android.apk",
    //                  function (entry) {
    //                      // do what you want with the entry here
    //                      //console.log("download complete: " + entry.fullPath);
    //                      $ionicPopup.alert({
    //                          template: "download complete: "
    //                      });
    //                      window.requestFileSystem(LocalFileSystem.TEMPORARY, 1000000000, gotFS, fail);
    //                  },
    //                  function (error) {
    //                      $ionicPopup.alert({
    //                          template: "download error: "
    //                      });
    //                      console.log("error source " + error.source);
    //                      console.log("error target " + error.target);
    //                      console.log("error code " + error.code + "Cheeeese");
    //                  },
    //                  false,
    //                  null
    //          );
    //      }, function () {
    //          alert("file create error");
    //      });
    //}, null);

    // #endregion

    // #region Way 3

    //document.addEventListener("deviceready", init, false);

    ////The directory to store data
    //var store;

    ////Used for status updates
    //var $status;

    ////URL of our asset
    //var assetURL = "http://192.168.1.201:6634/Home/Download?fileName=erm-android.apk";

    ////File name of our important data file we didn't ship with the app
    //var fileName = "erm-android.apk";

    //function init() {

    //    $status = document.querySelector("#status");

    //    $status.innerHTML = "Checking for data file.";

    //    store = cordova.file.dataDirectory;

    //    //Check for the file. 
    //    window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

    //}

    //function downloadAsset() {
    //    var fileTransfer = new FileTransfer();
    //    console.log("About to start transfer");
    //    fileTransfer.download(assetURL, store + fileName,
    //        function (entry) {
    //            console.log("Success!");
    //            appStart();
    //        },
    //        function (err) {
    //            console.log("Error");
    //            console.dir(err);
    //        });
    //}

    ////I'm only called when the file exists or has been downloaded.
    //function appStart() {
    //    $status.innerHTML = "App ready!";
    //}

    // #endregion

    // #region Way 4

    //document.addEventListener('deviceready', downloadFile);

    //function downloadFile() {

    //    var fileTransfer = new FileTransfer();
    //    var uri = encodeURI("http://192.168.1.201:6634/Home/Download?fileName=erm-android.apk");
    //    var fileURL = "///storage/emulated/0/Download/erm-android.apk";

    //    fileTransfer.download(
    //       uri, fileURL, function (entry) {
    //           //console.log("download complete: " + entry.toURL());
    //           $ionicPopup.alert({
    //               template: "download complete: "
    //           });
    //       },

    //       function (error) {
    //           $ionicPopup.alert({
    //               template: "download error source "
    //           });
    //           console.log("download error source " + error.source);
    //           console.log("download error target " + error.target);
    //           console.log("download error code" + error.code);
    //       },

    //       false, {
    //           headers: {
    //               "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    //           }
    //       }
    //    );
    //}

    // #endregion


    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 500,
        //pagination: false,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
        console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
        // note: the indexes are 0-based
        $scope.activeIndex = data.activeIndex;
        $scope.previousIndex = data.previousIndex;
    });


    var isLoadedImage = false;
    var isLoadedQuote = false;
    $scope.isInProgress = true;

    $scope.getQuote = function () {

        $http.post(serverConfig.serverUrl + '/api/services/app/Quote/GetTodayQuote').success(function (res, status) {
            isLoadedQuote = true;

            if (isLoadedImage && isLoadedQuote) {
                $scope.isInProgress = false;
            }

            if (status == '200') {
                if (res.result)
                    $scope.message = res.result;
            }

        }).error(function (data, status) {
            console.log(status)
        }).finally(function () {
            if (isLoadedImage && isLoadedQuote) {
                $scope.isInProgress = false;
            }
        })


    }
    $scope.getSlide = function () {

        $http.post(serverConfig.serverUrl + '/api/services/app/SlideShow/GetImageList', { onlySlides: true }).success(function (res, status) {

            isLoadedImage = true;


            if (isLoadedImage && isLoadedQuote) {
                $scope.isInProgress = false;
            }

            $scope.getSlideInProgress = false;
            if (status == '200') {
                if (res.result)
                    $scope.slide = res.result.items
            }

        }).error(function (data, status) {
            console.log(status)
        }).finally(function () {
            if (isLoadedImage && isLoadedQuote) {
                $scope.isInProgress = false;
            }
        })


    }

    $scope.getQuote();
    $scope.getSlide();

})

.controller('CategoryCtrl', function ($rootScope, $scope, $cookies, $state, $ionicPopup, hrServiceRepository, userManager) {

    //$scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
    //    AuthService.logout();
    //    $state.go('login');
    //    var alertPopup = $ionicPopup.alert({
    //        title: 'Session Lost!',
    //        template: 'Sorry, You have to login again.'
    //    });
    //});

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    $scope.logout = function () {
        userManager.logout();
    }

    $scope.goToServiceType = function (category) {
        console.log("goToServiceType");
        $cookies.put("categoryName", category.title)
        $state.go('tab.serviceType', { categoryId: category.id })
    }



    $scope.getCategoryList = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        hrServiceRepository.getCategoryList().success(function (result) {

            if (result) {

                if (result.result) {
                    $scope.categoryList = result.result.items
                }
            }
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        })
            .finally(function () {
                // Stop the ion-refresher from spinning
                $scope.isInProgress = false;
                $scope.isRefreshing = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    $scope.getCategoryList();

    $scope.showAlert = function (title, message) {
        $ionicPopup.alert({
            title: title,
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {

        });
    };


    $scope.doRefresh = function () {
        console.log('doing refresh');
        $scope.isRefreshing = true;

        if ($rootScope.isOnline == false) {
            $scope.showAlert('خطا', $rootScope.offlineMessage)
            return;
        }

        $scope.getCategoryList();
    }

})
.controller('ServiceTypeCtrl', function ($rootScope, $scope, $cookies, $stateParams, $state, $ionicPopup, hrServiceRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    var categoryId = $stateParams.categoryId;

    $scope.logout = function () {
        userManager.logout();
    }

    $scope.categoryName = $cookies.get("categoryName");

    $scope.goToState = function (serviceType) {
        $cookies.put("serviceTypeName", serviceType.title)

        if (serviceType.isFlightServiceType == true) {
            $state.go("tab.flightService", { serviceTypeId: serviceType.id })
        }
        else {
            $state.go("tab.generalService", { serviceTypeId: serviceType.id })
        }
    }

    $scope.getCategoryServiceTypeList = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        hrServiceRepository.getCategoryServiceTypeList(categoryId).success(function (result) {



            if (result != null) {
                $scope.serviceTypeList = result.result.items;
            }
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.getCategoryServiceTypeList();

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: 'ثبت نظر',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in vote to service ');
        });
    };

    $scope.doRefresh = function () {
        console.log('doing refresh');
        $scope.isRefreshing = true;

        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }

        $scope.getCategoryServiceTypeList();
    }


})

.controller('generalServiceCtrl', function ($rootScope, $scope, $cookies, $state, $stateParams, $ionicPopup, hrServiceRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.logout = function () {
        userManager.logout();
    }


    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    var serviceTypeId = $stateParams.serviceTypeId;

    $scope.serviceTypeName = $cookies.get("serviceTypeName");


    $scope.goToDetail = function (generalService) {
        $cookies.put("serviceName", generalService.title)
        $state.go("tab.generalServiceDetail", { generalServiceId: generalService.id })
    }


    $scope.getGeneralServiceList = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        hrServiceRepository.getGeneralServiceList(serviceTypeId).success(function (result) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            if (result) {

                $scope.generalServiceList = result.result.items
            }
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.getGeneralServiceList();

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: 'خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in vote to service ');
        });
    };

    $scope.doRefresh = function () {
        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }

        console.log('doing refresh');
        $scope.isRefreshing = true;
        $scope.getGeneralServiceList();
    }

})
.controller('generalServiceDetailCtrl', function ($rootScope, $scope, $cookies, $stateParams, $http, $ionicModal, $ionicPopup, $ionicLoading, hrServiceRepository, userManager, serverConfig) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    //#region vote
    $scope.showAlert = function (title, message) {
        $ionicPopup.alert({
            title: title,
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in vote to service ');
        });
    };

    $scope.rating = {};
    $scope.rating.rate = 1;
    $scope.rating.max = 5;



    $scope.vote = function () {
        $scope.voteToServiceInput = {
            ServiceId: $stateParams.generalServiceId,
            Vote: $scope.rating.rate

        }

        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/VoteToService', $scope.voteToServiceInput).success(function (res, status) {
            $ionicLoading.hide();
            if (status == '500') {
                if (res.error.message)
                    $scope.showAlert('خطا', res.error.message);
            }

            if (status == '200') {
                $scope.showAlert('ثبت نظر', 'نظر شما ثبت شد ');
            }

            $scope.showVoteButton = false;




        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })

    }
    //#endregion



    $scope.logout = function () {
        userManager.logout();
    }

    $scope.isInProgress = true;

    var generalServiceId = $stateParams.generalServiceId;
    $scope.serviceName = $cookies.get("serviceName");


    //because it may take time to resolve user registration , i initially hide the button;
    $scope.generalService = { registration: [] }

    $scope.showModal = function () {
        $ionicPopup.alert({
            title: 'ثبت نام',
            template: '<span>ثبت نام شما انجام شد </span>',
            okText: 'باشه'

        }).then(function (res) {
            $scope.doRefresh();
        });
    }

    // Close the modal
    $scope.closeModal = function () {

        $scope.getGeneralServiceDetail();
        $scope.modal.hide();
        $scope.modal.remove()
    };


    $scope.showVoteButton = true;
    $scope.getGeneralServiceDetail = function () {
        $scope.isInProgress = true;
        hrServiceRepository.getGeneralServiceDetail(generalServiceId).success(function (result) {
            $scope.isInProgress = false;
            if (result) {
                $scope.generalService = result.result;
                if ($scope.generalService.alreadyVoted) {
                    $scope.showVoteButton = $scope.generalService.AlreadyVoted;
                }
            }
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.getGeneralServiceDetail();

    $scope.doRefresh = function () {

        if ($rootScope.isOnline == false) {
            $scope.showAlert('خطا', $rootScope.offlineMessage)
            return;
        }


        $scope.getGeneralServiceDetail();
    }


    $scope.registerForService = function (generalServiceId) {
        $scope.isInProgress = true;
        hrServiceRepository.registerForService(generalServiceId).success(function () {
            $scope.isInProgress = false;
            $scope.showModal()
            // $scope.openModal();
        }).error(function (err) {
            $scope.isInProgress = false;
        }).finally(function () {
            $scope.isInProgress = false;
        })
    }

})


.controller('flightServiceCtrl', function ($rootScope, $scope, $state, $cookies, $stateParams, hrServiceRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();
    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    $scope.logout = function () {
        userManager.logout();
    }


    var serviceTypeId = $stateParams.serviceTypeId;
    $scope.serviceTypeName = $cookies.get("serviceTypeName");

    $scope.goToDetail = function (flightService) {
        $cookies.put("serviceName", flightService.title)
        $state.go("tab.flightServiceDetail", { flightServiceId: flightService.id })
    }


    $scope.getFlightServiceList = function () {
        $scope.isInProgress = !$scope.isRefreshing;

        hrServiceRepository.getFlightServiceList(serviceTypeId).success(function (result) {

            if (result) {

                $scope.flightServiceList = result.result.items
            }
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }
    $scope.getFlightServiceList();


    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: 'خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in vote to service ');
        });
    };

    $scope.doRefresh = function () {
        console.log('doing refresh');
        $scope.isRefreshing = true;

        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }


        $scope.getFlightServiceList();
    }




})
.controller('flightServiceDetailCtrl', function ($rootScope, $scope, $cookies, $stateParams, $ionicModal, $ionicPopup, $ionicLoading, hrServiceRepository, userManager, serverConfig) {


    $scope.logout = function () {
        userManager.logout();
    }

    //#region vote
    $scope.showAlert = function (title, message) {
        $ionicPopup.alert({
            title: title,
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in vote to service ');
        });
    };

    $scope.rating = {};
    $scope.rating.rate = 1;
    $scope.rating.max = 5;


    $scope.vote = function () {

        $scope.voteToServiceInput = {
            ServiceId: $stateParams.flightServiceId,
            Vote: $scope.rating.rate

        }
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/VoteToService', $scope.voteToServiceInput).success(function (res, status) {
            $ionicLoading.hide();
            if (status == '500') {
                if (res.error.message)
                    $scope.showAlert('خطا', res.error.message);
            }

            if (status == '200') {
                $scope.showAlert('ثبت نظر', 'نظر شما ثبت شد ');
            }
            $scope.showVoteButton = false;

        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })
    }
    //#endregion

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.isInProgress = true;

    var flightServiceId = $stateParams.flightServiceId;
    $scope.serviceName = $cookies.get("serviceName")

    ////modal Definitation
    //$ionicModal.fromTemplateUrl('templates/registration-modal.html', {
    //    scope: $scope,
    //    animation: 'slide-in-up'
    //}).then(function (modal) {
    //    $scope.modal = modal;

    //});
    //$scope.openModal = function () {
    //    $scope.modal.show();
    //};
    //$scope.closeModal = function () {
    //    $scope.modal.hide();
    //};


    $scope.showVoteButton = true;

    $scope.getFlightServiceDetail = function () {
        $scope.isInProgress = true;
        hrServiceRepository.getFlightServiceDetail(flightServiceId).success(function (result) {
            $scope.isInProgress = false;
            if (result) {
                $scope.flightService = result.result;

                if ($scope.flightService.alreadyVoted) {
                    $scope.showVoteButton = $scope.flightService.AlreadyVoted;
                }
            }
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.getFlightServiceDetail();

    $scope.showModal = function () {
        $ionicPopup.alert({
            title: 'ثبت نام',
            template: '<span>ثبت نام شما انجام شد </span>',
            okText: 'باشه'

        }).then(function (res) {
            $scope.doRefresh();
        });
    }

    $scope.doRefresh = function () {
        if ($rootScope.isOnline == false) {
            $scope.showAlert('خطا', $rootScope.offlineMessage)
            return;
        }


        $scope.getFlightServiceDetail();
    }

    $scope.registerForService = function (flightServiceId) {
        $scope.isInProgress = true;

        hrServiceRepository.registerForService(flightServiceId).success(function () {
            $scope.showModal();
            $scope.isInprogress = false;
            $scope.DidregisterForService = true;
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
})

.controller('RegistrationCtrl', function ($scope, $state, hrServiceRepository, userManager) {


    $scope.logout = function () {
        userManager.logout();
    }
    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    //check if the user exist else it will redirect to login 
    userManager.authenticate();



    $scope.getRegistrationList = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        hrServiceRepository.getRegistrationList().success(function (result) {
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            if (result) {
                $scope.registeredServiceList = result.result.items;
            }
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.goToDetail = function (registration) {
        if (registration.isFlightTypeService) {
            $state.go("tab.FlightRegistrationDetail", { flightServiceId: registration.serviceId })
        }
        else {
            $state.go("tab.GeneralServiceRegistrationDetail", { generalServiceId: registration.serviceId })
        };
    }
    $scope.getRegistrationList()
    $scope.doRefresh = function () {
        $scope.isRefreshing = true;
        $scope.getRegistrationList();
    }


})
.controller('RegistrationDetailCtrl', function ($scope, registrationRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.logout = function () {
        userManager.logout();
    }


})

.controller('MessageCtrl', function ($rootScope, $scope, $ionicPopup, messageRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in message page');
        });
    };

    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    $scope.logout = function () {
        userManager.logout();
    }


    $scope.getMessageList = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        messageRepository.getMessageList().success(function (data) {

            if (data) {

                $scope.messageList = data.result.items;
                $scope.serviceTypes = _.groupBy($scope.messageList, 'serviceTypeId');


            }
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }




    $scope.getMessageList();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getMessageList();
    }



})
.controller('MessageDetailCtrl', function ($rootScope, $scope, $ionicPopup, $stateParams, messageRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.logout = function () {
        userManager.logout();
    }


    $scope.messageTitle = "";
    var messageId = $stateParams.messageId;

    $scope.isInProgress = true;







    $scope.readMessage = function () {

        messageRepository.readMessage(messageId).success(function (result) {

            if (result) {

                $scope.message = result.result;
                $scope.image = result.result.bulkMessage.image;
            }


        }).finally(function () {
            $scope.isInProgress = false;
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.readMessage();

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in message page');
        });
    };


    $scope.doRefresh = function () {


        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }

        $scope.readMessage();
    }


})

.controller('GroupCtrl', function ($rootScope, $state, $cookies, $scope, $ionicPopup, notificationHubRepository, userManager) {

    //check if the user exist else it will redirect to login 
    userManager.authenticate();

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in message page');
        });
    };

    $scope.isInProgress = true;
    $scope.isRefreshing = false;

    $scope.logout = function () {
        userManager.logout();
    }


    $scope.getGroups = function () {
        $scope.isInProgress = !$scope.isRefreshing;
        notificationHubRepository.getGroups().then(function (data) {

            if (data) {
                $scope.groups = data
            }
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
    //var input = { groupsId: new [group.id]};
    //var input = { groupsId: [2] };
    $scope.goToEmployeeMessages = function (group) {
        $cookies.put("groupName", group.title)
        //$state.go('tab.employeeMessages', { groupsId: [group.id] });
        $state.go('tab.employeeMessages', { groupsId: [{ id: group.id }] });
    }


    $scope.getGroups();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getMessageList();
    }



})
.controller('EmployeeMessagesCtrl', function ($rootScope, $cookies, $stateParams, $scope,
    $ionicPopup, Loki, notificationHubRepository, userManager, $ionicModal, $ionicLoading) {

    //var idbAdapter = new LokiIndexedAdapter('cache');
    var db = new Loki('groupCache.db', {
        autosave: true
        , autosaveInterval: 1000
        //,adapter: idbAdapter
    });
    var favMessages;
    $scope.favMessagesIds;

    db.loadDatabase({}, function () {
        favMessages = db.getCollection('favMessages');
        if (favMessages != null)
            $scope.favMessagesIds = _.pluck(favMessages.data, 'id');
    });

    $scope.getEmployeeMessagesInput = {
        pageSize: 5,
        currentPage: 0,
        orderBy: 'creationTime',
        sort: 'desc',
        groupsId: []
    };
    $scope.groupName = $cookies.get("groupName");

    // #region show picture

    $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
        $scope.gridModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    })
    $scope.openModal = function (message) {
        //$ionicLoading.show({
        //    template: 'Loading...'
        //});
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        notificationHubRepository.getMessageImage(message.id).then(function (data) {

            if (data) {

                $scope.imgUrl = data;
                $scope.description = message.mainMessage;
            }
        })
        .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            //$scope.isRefreshing = false;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });

        $scope.inspectionItem = message;
        $scope.gridModal.show();
    }
    $scope.closeModal = function () {
        $scope.gridModal.hide();
        $scope.imgUrl = "";
    }

    $scope.getEmployeeMessages = function () {

        $scope.getEmployeeMessagesInput.groupsId = $stateParams.groupsId;

        if ($scope.isRefreshing) {
            $scope.getEmployeeMessagesInput.currentPage = 1;
        }



        notificationHubRepository.getEmployeeMessages($scope.getEmployeeMessagesInput).then(function (data) {
            if ($scope.isRefreshing) {
                $scope.messages = [];// for avoiding duplicate data
            }
            if (data) {
                $scope.messages = _.union($scope.messages, data.data.result.items);
                //$scope.messages = data.result.items;

                favMessages = db.getCollection('favMessages');
                if (favMessages!=null)
                    $scope.favMessagesIds = _.pluck(favMessages.data, 'id')

                $scope.totalCount = data.data.result.totalCount;
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }
        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.addMessageToFavorite = function (message) {







        if (!favMessages)
            favMessages = db.addCollection('favMessages')

        //TODO:rename tmp to something meaningful
        var tmp = favMessages.find({ 'id': message.id })
        if (tmp.length == 0) {

            favMessages.insert(message)
            db.saveDatabase();
            favMessages = db.getCollection('favMessages')
            $scope.favMessagesIds = _.pluck(favMessages.data, 'id')

        }

        else {
            //item is already in fav messages
        }

    }

    $scope.removeMessageFromFavorite = function (message) {



        var tmp = favMessages.findOne({ 'id': message.id });
        favMessages.remove(tmp);
        db.saveDatabase();

        favMessages = db.getCollection('favMessages');
        $scope.favMessagesIds = _.pluck(favMessages.data, 'id')
        favMessages = db.getCollection('favMessages');


    }

    $scope.isFavMessage = function (messageId) {



        if (!favMessages) {
            return false
        }
        else if (_.contains($scope.favMessagesIds, messageId)) {
            return true
        }
        else {
            return false
        }

    }


    // #endregion

    // #region paging setting

    $scope.moreDataCanBeLoaded = function () {



        var curPage = $scope.getEmployeeMessagesInput.currentPage;
        var pageSize = $scope.getEmployeeMessagesInput.pageSize;

        if (curPage * pageSize > $scope.totalCount)
            return false;
        return true;
    }

    $scope.loadMore = function () {

        if ($scope.isRefreshing) return;

        $scope.getEmployeeMessagesInput.currentPage += 1;
        //alert('current page: ' + $scope.getEmployeeMessagesInput.currentPage);
        $scope.getEmployeeMessages();

    };

    $scope.$on('$stateChangeSuccess', function () {
        //$scope.loadMore();
    });

    // #endregion

    //check if the user exist else it will redirect to login 
    userManager.authenticate();
    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in message page');
        });
    };
    //$scope.isInProgress = true;
    $scope.isRefreshing = false;
    $scope.logout = function () {
        userManager.logout();
    }
    $scope.doRefresh = function () {
        $scope.isRefreshing = true;
        console.log('doing refresh')
        $scope.getEmployeeMessages();
    }



})

.controller('EmployeeFavMessagesCtrl', function ($ionicHistory, $rootScope, $stateParams, $scope,
    $ionicPopup, Loki, notificationHubRepository, userManager, $ionicModal, $ionicLoading) {

    $scope.isInProgress = true;
    //var idbAdapter = new LokiIndexedAdapter('cache');
    var db = new Loki('groupCache.db', {
        autosave: true
        , autosaveInterval: 1000
        //,adapter: idbAdapter
    });

    db.loadDatabase({}, function () {
        var favMessages = db.getCollection('favMessages');
        if (favMessages != null)
            $scope.messages = favMessages.data;
    });


    $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
        $scope.gridModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    })
    $scope.openModal = function (message) {
        //$ionicLoading.show({
        //    template: 'Loading...'
        //});
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        notificationHubRepository.getMessageImage(message.id).then(function (data) {

            if (data) {
                $ionicLoading.hide();
                $scope.imgUrl = data;
                $scope.description = message.mainMessage;
            }
        });

        $scope.inspectionItem = message;
        $scope.gridModal.show();
    }
    $scope.closeModal = function () {
        $scope.gridModal.hide();
        $scope.imgUrl = "";
    }

    $scope.removeMessageFromFavorite = function (message) {

        //TODO:rename tmp to something meaningful

        //var idbAdapter = new LokiIndexedAdapter('cache');
        var db = new Loki('groupCache.db', {
            autosave: true
            , autosaveInterval: 1000
            //,adapter: idbAdapter
        });

        db.loadDatabase({}, function () {
            var favMessages = db.getCollection('favMessages');
            var tmp = favMessages.findOne({ 'id': message.id });
            favMessages.remove(tmp);
            db.saveDatabase();
            $scope.getEmployeeFavMessages();
        });

    }




    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in message page');
        });
    };

    //$scope.isInProgress = true;
    $scope.isRefreshing = false;

    $scope.logout = function () {
        userManager.logout();
    }

    $scope.getEmployeeFavMessages = function () {

        //var idbAdapter = new LokiIndexedAdapter('cache');
        var db = new Loki('groupCache.db', {
            autosave: true
            , autosaveInterval: 1000
            //,adapter: idbAdapter
        });

        db.loadDatabase({}, function () {
            var tmp = db.getCollection('favMessages');
            if (tmp != null) {
                $scope.messages = tmp.data;
            }
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    }


    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getEmployeeFavMessages();
    }

    $scope.getEmployeeFavMessages();

})

.controller('loginCtrl', function ($rootScope, $scope, $state, $ionicPopup, $ionicLoading, $cordovaNetwork, userManager) {

    $scope.loginModel = { userName: '', password: '' }

    $scope.login = function () {

        if ($rootScope.isOnline == false) {

            $scope.showModal($rootScope.offlineMessage);
            return;
        }


        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        var username = $scope.loginModel.userName;
        var password = $scope.loginModel.password;
        var appToken = window.localStorage.getItem("appToken");

        $rootScope.$on('someThingWrong', function () {
            $ionicLoading.hide();
        });

        $rootScope.$on('connectionErr', function () {
            $ionicLoading.hide();
        });


        userManager.login(username, password, appToken).success(function (result, status) {
            $ionicLoading.hide();

            //wrong user name and password 
            //login failed
            //TODO:chnage the status code returned from server
            if (status == '500') {

                //show modal Error
                var message = 'گذرواژه یا رمز عبور اشتباه است '
                $scope.showModal(message);
                return;

            }


            //login Success
            if (result) {
                if (result.result) {

                    //1-store the Authentication Token
                    //TODO:window.localStorage is not mockable .change it to angular service for Testability . 
                    $scope.authenticatonToke = result.result.authenticatonToke;
                    window.localStorage.setItem('authToken', $scope.authenticatonToke);

                    //2-store use role 
                    window.localStorage.setItem('isManager', result.result.isManager);

                    //3-set FullName
                    window.localStorage.setItem('userFullName', result.result.userFullName)
                    $rootScope.userFullName = result.result.userFullName

                    //4-remove Flags from local storage
                    window.localStorage.removeItem('shouldChangePassword');

                    //5-emit event login / used to request new app token , app.run is subscribed to this event
                    $rootScope.$emit('login', []);

                    //5-Go To Start Page
                    $state.go('tab.home');

                }
            } else {
                return;
            }
        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function (res) {
            $ionicLoading.hide();
        })
    }

    $scope.logout = function () {
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("isManager");


        $rootScope.$emit('logout', []);

        push.unregister(function () {
            console.log('success');
        }, function () {
            console.log('error');
        });




    }

    $scope.signup = function () {
        $state.go("signup")
    }

    $scope.showModal = function (message) {
        $ionicPopup.alert({
            title: 'خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'
        }).then(function (res) {

        });
    }


})

.controller('signupCtrl', function ($rootScope, $scope, $state, $http, $ionicLoading, $ionicPopup, userManager, serverConfig) {

    $scope.loginModel = {
        mobileNumber: ''
    }
    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in siognup page ');
        });
    };
    $scope.signup = function () {

        if ($rootScope.isOnline == false) {

            $scope.showAlert('شما به اینترنت وصل نیستید ');
            return;
        }

        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.post(serverConfig.serverUrl + '/api/account/registration', $scope.loginModel).success(function (result, status) {
            $ionicLoading.hide();




            if (result.error && result.error.code == '404') {
                $ionicLoading.hide();
                $scope.showAlert('شماره تلفن در سیستم ثبت نشده است ');
                return;
            }


            if (status == '200') {
                $ionicLoading.hide();
                window.localStorage.setItem("mobileNumber", $scope.loginModel.mobileNumber),
                $state.go('token')
            }


        }).finally(function (err) {
            $ionicLoading.hide();
        })

        //$http
    }

})

.controller('tokenCtrl', function ($rootScope, $scope, $state, $http, $ionicLoading, $ionicPopup, serverConfig) {

    $scope.confirmTokenInput = {
        mobileNumber: window.localStorage.getItem("mobileNumber"),
        AppToken: window.localStorage.getItem("appToken")

        //RegistrationToken is bind to input in view 
        //RegistrationToken: ''
    }
    console.log($scope.confirmTokenInput.registrationToken);
    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in token page ');
        });
    };
    $scope.confirmToken = function () {

        if ($rootScope.isOnline == false) {

            $scope.showAlert('شما به اینترنت وصل نیستید ');
            return;
        }







        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.post(serverConfig.serverUrl + '/api/account/ConfirmRegistrationToken', $scope.confirmTokenInput).success(function (result, status) {
            $ionicLoading.hide();

            if (result.error && result.error.code == '302') {
                $ionicLoading.hide();
                $scope.showAlert('کد وارد شده صحیح نمی باشد ');
                return;
            }


            if (status == 200) {
                window.localStorage.setItem('authToken', result.result.authenticatonToke)
                window.localStorage.setItem('isManager', result.result.isManager);
                window.localStorage.setItem('userFullName', result.result.userFullName)
                $rootScope.userFullName = result.result.userFullName;
                window.localStorage.setItem('shouldChangePassword', true)
                $state.go("setPassword");
            }

        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })

    }

})

.controller('setPasswordCtrl', function ($ionicHistory, $rootScope, $scope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, serverConfig) {

    $scope.userFullName = $rootScope.userFullName
    $scope.setPasswordInput = {
        NewPassword: '',
        ConfirmPassword: ''

    }

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: '!خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {
            console.log('alert shown in token page ');
        });
    };

    $scope.setPassword = function () {
        if ($rootScope.isOnline == false) {
            $scope.showAlert('شما به اینترنت وصل نیستید ');
            return;
        }

        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.put(serverConfig.serverUrl + '/api/account/updateCurrentUserPassword', $scope.setPasswordInput).success(function (result, status) {
            if (status == 200) {
                $ionicLoading.hide();
                window.localStorage.setItem('authToken', result.result)
                if (window.localStorage.getItem('shouldChangePassword')) {
                    window.localStorage.removeItem('shouldChangePassword', true)
                    $state.go('tab.home')
                }
                else {
                    $scope.showAlert('گذرواژه با موفقیت تغییر کرد');
                }
            }

        }).error(function () {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    }
})


.controller('errorCtrl', function ($scope, $state, $ionicHistory) {

    $scope.goBack = function () {
        console.log('back function is running')
        $ionicHistory.goBack();
    }

})


.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

//#region contactEmployee

.controller('contactEmployeeCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {

    console.log('contactEmployeeCtrl')
    console.log('current state is ' + $state.current)

})

.controller('managerInboxMessagesCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {

    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null
    }

    $scope.getManagerInboxMessages = function () {
        $scope.isInProgress = true;


        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerInboxMesssages', $scope.queryString).success(function (res) {
            $scope.messageList = res.result.items;
            $scope.isInProgress = false;
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.getManagerInboxMessages();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getManagerInboxMessages();
    }

    $scope.goToDetail = function (messageid) {

        console.log('detal view')
        $state.go('tab.managerInboxMessage', { messageId: messageid })
    }

})

.controller('managerInboxMessageCtrl', function ($scope, $state, $stateParams, $http, $ionicLoading, $ionicPopup, serverConfig) {
    var messageId = $stateParams.messageId;
    $scope.getManagerInboxMessageById = function (messageId) {

        $scope.isInProgress = true;
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerInboxMessageById', { id: messageId }).success(function (res) {
            $scope.isInProgress = false;
            $scope.message = res.result

        }).error(function (err) {
            $scope.isInProgress = false;
        }).finally(function (err) {
            $scope.isInProgress = false;
        })


    }

    $scope.getManagerInboxMessageById(messageId);

    $scope.reply = function () {
        $scope.showReply = true;
    }

    $scope.messageReply = {
        InReplyTo: messageId
    }

    $scope.showAlert = function () {
        $ionicPopup.alert({
            title: 'ارسال پیام',
            template: '<p style="text-align:center">پاسخ شما ارسال شد </p>',
            okText: 'باشه'
        }).then(function (res) {
            console.log('alert shown in reply to Employee');
        });
    };

    $scope.replyToEmployeeMessage = function () {
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/replyToEmployeeMessage', $scope.messageReply).success(function () {
            $ionicLoading.hide();
            $scope.showReply = false;
            $scope.showAlert();

        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })
    }
})

.controller('managerSentMessagesCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {

    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null
    }

    $scope.getManagerSentMessages = function () {
        $scope.isInProgress = true;


        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerSentMessages', $scope.queryString).success(function (res) {
            $scope.messageList = res.result.items;
            $scope.isInProgress = false;
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.getManagerSentMessages();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getManagerSentMessages();
    }

    $scope.goToDetail = function (messageid) {

        console.log('detal view')
        $state.go('tab.managerSentMessage', { messageId: messageid })
    }

})

.controller('managerSentMessageCtrl', function ($scope, $state, $stateParams, $http, $ionicLoading, serverConfig) {
    var messageId = $stateParams.messageId;
    $scope.getManagerSentMessageById = function (messageId) {

        $scope.isInProgress = true;
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerSentMessageById', { id: messageId }).success(function (res) {
            $scope.isInProgress = false;
            $scope.message = res.result

        }).error(function (err) {
            $scope.isInProgress = false;
        }).finally(function (err) {
            $scope.isInProgress = false;
        })


    }

    $scope.getManagerSentMessageById(messageId);

})

.controller('replyToEmployeeCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {

    //inbox
    //get
})

//#endregion


//#region contactManager

.controller('contactManagerCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {
    console.log('contactManagerCtrl')
    console.log('current state is ' + $state.current)

    $scope.changeState = function () {
        $state.go('tab.contactManagerSent')

    }
    //get
})

.controller('employeeInboxMessagesCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {

    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null
    }

    $scope.GetEmployeeInboxMessages = function () {
        $scope.isInProgress = true;


        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetEmployeeInboxMessages', $scope.queryString).success(function (res) {
            $scope.messageList = res.result.items;
            $scope.isInProgress = false;
        }).finally(function () {
            $scope.isInProgress = false;
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.GetEmployeeInboxMessages();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.GetEmployeeInboxMessages();
    }

    $scope.goToDetail = function (messageid) {

        console.log('detal view')
        $state.go('tab.employeeInboxMessage', { messageId: messageid })
    }
})



.controller('employeeInboxMessageCtrl', function ($scope, $state, $http, $ionicLoading, $stateParams, serverConfig) {

    var messageId = $stateParams.messageId;
    $scope.getEmployeeInboxMessageById = function (messageId) {

        $scope.isInProgress = true;
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetEmployeeInboxMessageById', { id: messageId }).success(function (res) {
            $scope.isInProgress = false;
            $scope.message = res.result

        }).error(function (err) {
            scope.isInProgress = false;
        }).finall(function () {
            scope.isInProgress = false;
        })


    }

    $scope.getEmployeeInboxMessageById(messageId);
})

.controller('employeeSentMessagesCtrl', function ($scope, $state, $http, $ionicLoading, serverConfig) {


    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null
    }

    $scope.getEmployeeSentMessages = function () {
        $scope.isInProgress = true;


        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetEmployeeSentMessages', $scope.queryString).success(function (res) {
            $scope.messageList = res.result.items;
            $scope.isInProgress = false;
        }).error(function (err) {
            $scope.isInProgress = false;
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            $scope.isInProgress = false;
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.getEmployeeSentMessages();

    $scope.doRefresh = function () {
        console.log('doing refresh')
        $scope.getEmployeeSentMessages();
    }

    $scope.goToDetail = function (messageid) {

        console.log('detal view')
        $state.go('tab.employeeSentMessage', { messageId: messageid })
    }

})

.controller('employeeSentMessageCtrl', function ($scope, $state, $stateParams, $http, $ionicLoading, serverConfig) {

    var messageId = $stateParams.messageId;
    $scope.getEmployeeSentMessageById = function (messageId) {

        $scope.isInProgress = true;
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetEmployeeSentMessageById', { id: messageId }).success(function (res) {
            $scope.isInProgress = false;
            $scope.message = res.result

        }).error(function (err) {
            $scope.isInProgress = false;
        }).finally(function () {
            $scope.isInProgress = false;
        })


    }

    $scope.getEmployeeSentMessageById(messageId);

})

.controller('sendMessageToManagerCtrl', function ($scope, $state, $http, $ionicPopup, $ionicLoading, serverConfig, $ionicHistory) {

    //public string Title { get; set; }
    //public string ShortMessage { get; set; }
    //public string MainMessage { get; set; }

    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    }

    $scope.message = {
        //title:'',
        //shortMesage:'',
        //mainMessage:''
    }

    $scope.showAlert = function () {
        $ionicPopup.alert({
            title: 'ارسال پیام',
            template: '<p style="text-align:center">پیام شما به مدیریت ارسال شد</p>',
            okText: 'باشه'
        }).then(function (res) {
            console.log('alert shown in contact manager');
        });
    };

    $scope.sendMessageToManager = function () {
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' })
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/SendMessageToManager', $scope.message).success(function () {
            $ionicLoading.hide();
            $scope.showAlert();
            $scope.message = {};
        }).error(function (err) {
            $ionicLoading.hide();
        }).finally(function () {
            $ionicLoading.hide();
        })
    }

})

.controller('employeeConversationsCtrl',
  function ($scope, $http, serverConfig, $rootScope, $state, $stateParams,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval, $ionicHistory, $ionicLoading) {

      $scope.queryString = {
          PageSize: null,
          CurrentPage: null,
          Sort: null,
          OrderBy: null
      }

      $scope.goBack = function () {
          $ionicHistory.goBack();
      }

      // mock acquiring data via $stateParams
      $scope.toUser = {
          _id: '534b8e5aaa5e7afc1b23e69b',
          pic: 'img/manager.png',
          username: 'مدیر'
      }

      // this could be on $rootScope rather than in $stateParams
      $scope.user = {
          _id: '534b8fb2aa5e7afc1b23e69c',
          pic: 'img/user.png',
          username: $rootScope.userFullName
      };

      $scope.input = {
          message: localStorage['userMessage-' + $scope.toUser._id] || ''
      };

      var messageCheckTimer;

      var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
      var footerBar; // gets set in $ionicView.enter
      var scroller;
      var txtInput; // ^^^

      $scope.$on('$ionicView.enter', function () {
          console.log('UserMessages $ionicView.enter');

          getMessages();

          $timeout(function () {
              footerBar = document.body.querySelector('#userMessagesView .bar-footer');
              scroller = document.body.querySelector('#userMessagesView .scroll-content');
              txtInput = angular.element(footerBar.querySelector('textarea'));
          }, 0);

          messageCheckTimer = $interval(function () {
              // here you could check for new messages if your app doesn't use push notifications or user disabled them
          }, 20000);
      });

      $scope.$on('$ionicView.leave', function () {
          console.log('leaving UserMessages view, destroying interval');
          // Make sure that the interval is destroyed
          if (angular.isDefined(messageCheckTimer)) {
              $interval.cancel(messageCheckTimer);
              messageCheckTimer = undefined;
          }
      });

      $scope.$on('$ionicView.beforeLeave', function () {
          if (!$scope.input.message || $scope.input.message === '') {
              localStorage.removeItem('userMessage-' + $scope.toUser._id);
          }
      });

      function getMessages() {


          $scope.isInProgress = !$scope.isRefreshing;
          //$scope.doneLoading = false;


          $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetEmployeeConversations', $scope.queryString).success(function (res, status) {
              if (status == 500) {
                  $scope.showAlert(' یه اشکالی پیش اومده لطفا دوباره سعی کنید')
                  return;
              }
              $scope.doneLoading = true;
              $scope.messages = res.result.items;

              for (var i = 0; i < $scope.messages.length; i++) {
                  $scope.messages[i].date = $scope.messages[i].creationTime;
                  $scope.messages[i].text = $scope.messages[i].message;
              }

              $scope.isInProgress = false;
              $scope.isRefreshing = false;

              $timeout(function () {
                  viewScroll.scrollBottom();
              }, 0);

          }).error(function () {
              scope.showAlert(' یه اشکالی پیش اومده لطفا دوباره سعی کنید')
          })
              .finally(function () {
                  // Stop the ion-refresher from spinning
                  $scope.isInProgress = false;
                  $scope.isInProgress = false;
                  $scope.$broadcast('scroll.refreshComplete');
              });


      }

      $scope.$watch('input.message', function (newValue, oldValue) {
          console.log('input.message $watch, newValue ' + newValue);
          if (!newValue) newValue = '';
          localStorage['userMessage-' + $scope.toUser._id] = newValue;
      });

      $scope.sendMessage = function (sendMessageForm) {

          if ($rootScope.isOnline == false) {
              $scope.showAlert($rootScope.offlineMessage);
              return;
          }


          $scope.newMessage = {};

          $scope.newMessage.MainMessage = $scope.input.message;

          var message = {
              toId: $scope.toUser._id,
              text: $scope.input.message
          };

          // if you do a web service call this will be needed as well as before the viewScroll calls
          // you can't see the effect of this in the browser it needs to be used on a real device
          // for some reason the one time blur event is not firing in the browser but does on devices
          keepKeyboardOpen();

          //MockService.sendMessage(message).then(function(data) {
          $scope.input.message = '';

          message._id = new Date().getTime(); // :~)
          message.date = new Date();
          message.username = $scope.user.username;
          message.userId = $scope.user._id;
          message.pic = $scope.user.picture;


          $http.post(serverConfig.serverUrl + '/api/services/app/hrService/SendMessageToManager', $scope.newMessage).success(function (res, status) {
              //$ionicLoading.hide();
              if (status == 500) {
                  $scope.showAlert('یه اشکالی پیش اومد . پیام شما به مدیر ارسال نشد . لطفا دوباره ارسال کنید')
              }

              message.isSentMessage = true;
              $scope.messages.push(message);

              $timeout(function () {
                  keepKeyboardOpen();
                  viewScroll.scrollBottom(true);
              }, 0);

              $scope.newMessage = {};
          }).error(function (err) {

          });

      };



      $scope.doRefresh = function () {
          if ($rootScope.isOnline == false) {
              $scope.showAlert($rootScope.offlineMessage);
              return;
          }

          $scope.isRefreshing = true;
          getMessages();
      }

      // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
      function keepKeyboardOpen() {
          console.log('keepKeyboardOpen');
          txtInput.one('blur', function () {
              console.log('textarea blur, focus back on it');
              txtInput[0].focus();
          });
      }

      $scope.onMessageHold = function (e, itemIndex, message) {
          console.log('onMessageHold');
          console.log('message: ' + JSON.stringify(message, null, 2));
          $ionicActionSheet.show({
              buttons: [{
                  text: 'Copy Text'
              }, {
                  text: 'Delete Message'
              }],
              buttonClicked: function (index) {
                  switch (index) {
                      case 0: // Copy Text
                          //cordova.plugins.clipboard.copy(message.text);

                          break;
                      case 1: // Delete
                          // no server side secrets here :~)
                          $scope.messages.splice(itemIndex, 1);
                          $timeout(function () {
                              viewScroll.resize();
                          }, 0);

                          break;
                  }

                  return true;
              }
          });
      };

      // this prob seems weird here but I have reasons for this in my app, secret!
      $scope.viewProfile = function (msg) {
          if (msg.userId === $scope.user._id) {
              // go to your profile
          } else {
              // go to other users profile
          }
      };

      // I emit this event from the monospaced.elastic directive, read line 480
      $scope.$on('taResize', function (e, ta) {
          console.log('taResize');
          if (!ta) return;

          var taHeight = ta[0].offsetHeight;
          console.log('taHeight: ' + taHeight);

          if (!footerBar) return;

          var newFooterHeight = taHeight + 10;
          newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

          footerBar.style.height = newFooterHeight + 'px';
          scroller.style.bottom = newFooterHeight + 'px';
      });

      $scope.onProfilePicError = function (ele) {
          this.ele.src = ''; // set a fallback
      }

  })

.controller('managerConversationsBriefCtrl', function ($rootScope, $scope, $state, $http, $ionicLoading, $ionicPopup, serverConfig, $ionicHistory) {

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: 'خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {

        });
    };


    $scope.isRefreshing = false;
    $scope.goBack = function () {
        $ionicHistory.goBack();
    }

    console.log('managerConversationsBriefCtrl Controller')
    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null
    }

    var profileColors = ['#F06292', '#00BCD4', '#FF8A80', '#80CBC4', '#DCE775', '#FFA726', '#A1887F'];

    $scope.GetManagerConversationsBrief = function () {

        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }
        $scope.isInProgress = true;
        $scope.isInProgress = !$scope.isRefreshing;




        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerConversationsBrief', $scope.queryString).success(function (res) {

            if (res.error == null && !res.errno) {
                $scope.conversations = res.result.items;

                for (var i = 0; i < $scope.conversations.length; i++) {
                    $scope.conversations[i].firstLetter = getFirstLetter($scope.conversations[i].employeeFullName);
                    $scope.conversations[i].profileColor = profileColors[Math.floor(Math.random() * profileColors.length)];
                }
            }

            else {
                $scope.showAlert('شرمنده . یه اشکالی پیش اومده . دوباره سعی کن ')
            }

            $scope.isInProgress = false;
            $scope.isRefreshing = false;
        }).error(function (err) {

            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        }).finally(function () {
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.GetManagerConversationsBrief();

    $scope.doRefresh = function () {
        if ($rootScope.isOnline == false) {
            $scope.message($rootScope.offlineMessage)
            return;
        }

        console.log('doing refresh');
        $scope.isRefreshing = true;
        $scope.GetManagerConversationsBrief();
    }

    var getFirstLetter = function (fullName) {

        return fullName.charAt(0);
    }

    $scope.goToState = function (state, message) {

        // TODO: 
        //message.totalUnreadMessage = 0;

        $state.go(state, { myParam: { employeeId: message.employeeId, employeeFullName: message.employeeFullName } });
    }


})

.controller('managerConversationsByEmployeeCtrl', function ($scope, $http, serverConfig, $rootScope, $state, $stateParams,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval, $ionicHistory, $ionicLoading) {

    $scope.showAlert = function (message) {
        $ionicPopup.alert({
            title: 'خطا',
            template: '<p style="text-align:center">' + message + '</p>',
            okText: 'باشه'

        }).then(function (res) {

        });
    };



    $scope.isRefreshing = false;


    console.log('managerConversationsByuEmployee');
    if ($stateParams.myParam) {
        var employeeId = $stateParams.myParam.employeeId;
        var employeeFullName = $stateParams.myParam.employeeFullName;
    }

    $scope.queryString = {
        PageSize: null,
        CurrentPage: null,
        Sort: null,
        OrderBy: null,
        EmployeeId: employeeId
    }

    $scope.goBack = function () {
        $ionicHistory.goBack();
    }

    $scope.getManagerConversationsByEmployeeId = function () {
        $scope.isInProgress = !$scope.isRefreshing;


        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerConversationByEmployeeId', $scope.queryString).success(function (res) {
            $scope.conversations = res.result.items;
            $scope.isInProgress = false;
            $scope.isRefreshing = false;

        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isRefreshing = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    //$scope.getManagerConversationsByEmployeeId();

    $scope.doRefresh = function () {
        if ($rootScope.isOnline == false) {
            $scope.showAlert($rootScope.offlineMessage)
            return;
        }
        console.log('doing refresh');
        $scope.isRefreshing = true;
        $scope.getManagerConversationsByEmployeeId();
    }

    $scope.employeeReply = {
        EmployeeId: employeeId
    }

    //$scope.replyToEmployeeMessage = function () {
    //    $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
    //    $http.post(serverConfig.serverUrl + '/api/services/app/hrService/replyToEmployeeMessage', $scope.employeeReply).success(function () {
    //        $ionicLoading.hide();
    //        $scope.showReply = false;
    //        $scope.showAlert();

    //    })
    //}






    // mock acquiring data via $stateParams
    $scope.toUser = {
        _id: '534b8e5aaa5e7afc1b23e69b',
        pic: 'img/manager.png',
        username: employeeFullName
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
        _id: '534b8fb2aa5e7afc1b23e69c',
        pic: 'img/user.png',
        username: $rootScope.userFullName
    };

    $scope.input = {
        message: localStorage['userMessage-' + $scope.toUser._id] || ''
    };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function () {
        console.log('UserMessages $ionicView.enter');

        getMessages();

        $timeout(function () {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll-content');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        messageCheckTimer = $interval(function () {
            // here you could check for new messages if your app doesn't use push notifications or user disabled them
        }, 20000);
    });

    $scope.$on('$ionicView.leave', function () {
        console.log('leaving UserMessages view, destroying interval');
        // Make sure that the interval is destroyed
        if (angular.isDefined(messageCheckTimer)) {
            $interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        if (!$scope.input.message || $scope.input.message === '') {
            localStorage.removeItem('userMessage-' + $scope.toUser._id);
        }
    });

    function getMessages() {


        $scope.isInProgress = true;

        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/GetManagerConversationByEmployeeId', $scope.queryString).success(function (res) {
            $scope.conversations = res.result.items;
            for (var i = 0; i < $scope.conversations.length; i++) {
                $scope.conversations[i].date = $scope.conversations[i].creationTime;
                $scope.conversations[i].text = $scope.conversations[i].message;
            }
            $scope.isInProgress = false;

            $timeout(function () {
                viewScroll.scrollBottom();
            }, 0);

        }).finally(function () {
            // Stop the ion-refresher from spinning
            $scope.isInProgress = false;
            $scope.isInProgress = false;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }

    $scope.$watch('input.message', function (newValue, oldValue) {
        console.log('input.message $watch, newValue ' + newValue);
        if (!newValue) newValue = '';
        localStorage['userMessage-' + $scope.toUser._id] = newValue;
    });

    $scope.sendMessage = function (sendMessageForm) {

        if ($rootScope.isOnline == false) {
            $scope.showAlert('خطا', $rootScope.offlineMessage);
            return;
        }


        //$scope.employeeReply = {};

        $scope.employeeReply.MainMessage = $scope.input.message;

        var message = {
            toId: $scope.toUser._id,
            text: $scope.input.message
        };

        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        keepKeyboardOpen();

        //MockService.sendMessage(message).then(function(data) {
        $scope.input.message = '';

        message._id = new Date().getTime(); // :~)
        message.date = new Date();
        message.username = $scope.user.username;
        message.userId = $scope.user._id;
        message.pic = $scope.user.picture;

        message.employeeId = employeeId;
        message.mainMessage = message.text;
        message.shortMessage = message.text;
        message.title = "";

        //$ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        $http.post(serverConfig.serverUrl + '/api/services/app/hrService/replyToEmployeeMessage', message).success(function () {
            $ionicLoading.hide();
            message.isRecivedFromManager = true;
            $scope.conversations.push(message);

            $timeout(function () {
                keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);

            $scope.employeeReply = {};

            $scope.showReply = false;

        }).error(function (err) {

        })

    };



    $scope.doRefresh = function () {
        getMessages();
    }

    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
        console.log('keepKeyboardOpen');
        txtInput.one('blur', function () {
            console.log('textarea blur, focus back on it');
            txtInput[0].focus();
        });
    }

    $scope.onMessageHold = function (e, itemIndex, message) {
        console.log('onMessageHold');
        console.log('message: ' + JSON.stringify(message, null, 2));
        $ionicActionSheet.show({
            buttons: [{
                text: 'Copy Text'
            }, {
                text: 'Delete Message'
            }],
            buttonClicked: function (index) {
                switch (index) {
                    case 0: // Copy Text
                        //cordova.plugins.clipboard.copy(message.text);

                        break;
                    case 1: // Delete
                        // no server side secrets here :~)
                        $scope.messages.splice(itemIndex, 1);
                        $timeout(function () {
                            viewScroll.resize();
                        }, 0);

                        break;
                }

                return true;
            }
        });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function (msg) {
        if (msg.userId === $scope.user._id) {
            // go to your profile
        } else {
            // go to other users profile
        }
    };

    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function (e, ta) {
        console.log('taResize');
        if (!ta) return;

        var taHeight = ta[0].offsetHeight;
        console.log('taHeight: ' + taHeight);

        if (!footerBar) return;

        var newFooterHeight = taHeight + 10;
        newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

        footerBar.style.height = newFooterHeight + 'px';
        scroller.style.bottom = newFooterHeight + 'px';
    });

    $scope.onProfilePicError = function (ele) {
        this.ele.src = ''; // set a fallback
    }


})




//#endregion

// configure moment relative time
moment.locale('fa', {
    relativeTime: {
        future: "در %s",
        past: "%s پیش",
        s: "%d ثانیه",
        m: "یک دقیقه",
        mm: "%d دقیقه",
        h: "یک ساعت",
        hh: "%d ساعت",
        d: "یک روز",
        dd: "%d روز",
        M: "یک ماه",
        MM: "%d ماه",
        y: "یک سال",
        yy: "%d سال"
    }
})










