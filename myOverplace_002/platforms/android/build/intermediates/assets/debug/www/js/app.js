angular.module("starter",["ionic","starter.controllers","chat.controllers","news.controllers","convalide.controllers","notifiche.controllers","starter.services","chat.services","news.services","convalide.services","notifiche.services","ngCordova","pusher-angular","monospaced.elastic","afkl.lazyImage","unsavedChanges","hmac"]).run(["$rootScope","$ionicPlatform","$ionicHistory","$ionicPopup","$cordovaNetwork","$state","$location",function(e,t,a,i,n){var l=["tab.chat-detail","tab.convalide-detail","tab.notifiche-detail","tab.news-create","tab.news-detail","tab.news-edit"],o=["tab.chat","tab.convalide","tab.notifiche","tab.news","tab.news","tab.news-detail|tab.news"];t.ready(function(){window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleLightContent(),window.MobileAccessibility&&window.MobileAccessibility.usePreferredTextZoom(!1),window.localStorage.network=n.isOnline()?"online":"offline",window.runningBg=0,document.addEventListener("pause",function(){window.runningBg=1},!1),document.addEventListener("resume",function(){window.runningBg=0},!1)}),t.registerBackButtonAction(function(e){var t=(a.viewHistory(),a.currentView()),n=a.backView(),r=!1,s=l.indexOf(t.stateName);if(-1!==s){var c=o[s];if(-1!=c.indexOf("|")){var d=c.split("|");-1!=d.indexOf(n.stateName)?a.goBack():r=!0}else o[s]==n.stateName?a.goBack():r=!0}else r=!0;if(r){var u=i.confirm({title:"Chiusura app",template:"Sei sicuro di voler uscire?",okText:"OK",cancelText:"Annulla"});u.then(function(e){e&&ionic.Platform.exitApp()})}return e.preventDefault(),!1},101)}]).config(["$stateProvider","$urlRouterProvider","unsavedWarningsConfigProvider",function(e,t,a){e.state("notifiche",{url:"/notifiche",templateUrl:"templates/tab-notifiche.html",controller:"NotificheCtrl"}).state("notifiche-detail",{url:"/notifiche/:id",templateUrl:"templates/notifiche-detail.html",controller:"NotificheDetailCtrl"}).state("chat",{url:"/chat",templateUrl:"templates/tab-chat.html",controller:"ChatCtrl"}).state("chat-detail",{url:"/chat/:channelReference",templateUrl:"templates/chat-detail.html",controller:"ChatDetailCtrl"}).state("convalide",{url:"/convalide",templateUrl:"templates/tab-convalide.html",controller:"ConvalideCtrl"}).state("convalide-detail",{url:"/convalide/:type/:id",templateUrl:"templates/convalide-detail.html",controller:"ConvalideDetailCtrl"}).state("news",{url:"/news",templateUrl:"templates/tab-news.html",controller:"NewsCtrl",resolve:{initial:["News",function(e){return e.getList()}]}}).state("news-create",{url:"/news/create",templateUrl:"templates/news/create.html",controller:"NewsOperationCtrl"}).state("news-detail",{url:"/news/:id",templateUrl:"templates/news-detail.html",controller:"NewsDetailCtrl"}).state("news-edit",{url:"/news/:id/edit",templateUrl:"templates/news/edit.html",controller:"NewsOperationCtrl"}).state("impostazioni",{url:"/impostazioni",templateUrl:"templates/tab-impostazioni.html",controller:"ImpostazioniCtrl",cache:!1}).state("login",{url:"/login",templateUrl:"templates/login.html",controller:"LoginCtrl"}),a.logEnabled=!1,a.useTranslateService=!1,a.routeEvent=["$stateChangeStart"],a.navigateMessage="I dati non salvati andranno persi. Continuare?";var i=window.localStorage.getItem("id_scheda"),n=window.localStorage.getItem("regId");null!==i&&null!==n?t.otherwise("/impostazioni"):(window.localStorage.clear(),t.otherwise("/login"))}]).directive("constantfocus",["$timeout","$ionicScrollDelegate",function(e,t){return{restrict:"A",link:function(a,i){i[0].addEventListener("focusout",function(){i[0].focus()}),i[0].addEventListener("focus",function(){function a(i){e(function(){t.scrollBottom()},30),window.removeEventListener(i,a,i)}window.addEventListener("native.keyboardshow",a,"native.keyboardshow"),window.addEventListener("native.keyboardhide",a,"native.keyboardhide")})}}}]).directive("formValidateAfter",function(){function e(e,t,a,i){var n="form-validate";i.validate=!1,t.bind("focus",function(){i.validate&&i.$invalid?(t.addClass(n),e.$apply(function(){i.validate=!0})):(t.removeClass(n),e.$apply(function(){i.validate=!1}))}).bind("blur",function(){t.addClass(n),e.$apply(function(){i.validate=!0})})}return{restrict:"A",require:"ngModel",link:e}});