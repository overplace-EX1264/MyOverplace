angular.module("starter.controllers",[]).run(["$ionicPlatform","$cordovaPush",function(o,t){var i=null;ionic.Platform.isAndroid()?i={senderID:"751872435382"}:ionic.Platform.isIOS()&&(i={badge:"true",sound:"true",alert:"true"});var e=window.localStorage.getItem("id_scheda");null!==e&&o.ready(function(){t.register(i).then(function(o){ionic.Platform.isIOS()&&(regId=o,window.localStorage.regId=regId)},function(){alert("Errore di connessione")})})}]).controller("AppCtrl",["$rootScope","$scope","$timeout","$state","$ionicLoading","$cordovaNetwork","$cordovaLocalNotification","$cordovaMedia","$cordovaVibration","$cordovaToast","$ionicHistory","Auth","PushState","Chats","Convalide","Notifiche","News","NavBadges",function(o,t,i,e,a,n,r,c,s,l,d,h,u,f,g,v,w,b){var m=!1,p=["tab.chat-detail","tab.convalide-detail","tab.notifiche-detail","tab.news-create","tab.news-detail","tab.news-edit"];o.$on("$ionicView.beforeEnter",function(){o.hideTabs=~p.indexOf(e.current.name)});var $=window.localStorage.getItem("id_scheda");null!==$&&(g.getList(),f.init(),f.all().then(function(t){o.NRchats=t})),o.$watch("NRchats",function(o){var t=0;for(var i in o)o[i].toRead&&("#/chat/"+o[i].channelReference!==window.location.hash?t++:o[i].toRead=!1);b.setBadges("chat",t)},function(){}),o.$on("$cordovaLocalNotification:click",function(){e.go("tab.chat")}),o.$on("$cordovaNetwork:online",function(){window.localStorage.network="online",f.init(),f.all(),o.$broadcast("reInitChat")}),o.$on("$cordovaNetwork:offline",function(){window.localStorage.network="offline",l.show("Nessuna connessione dati","short","bottom")}),t.notifications=[],t.$on("$cordovaPush:notificationReceived",function(o,t){d.viewHistory(),d.currentView();if(ionic.Platform.isAndroid())if("registered"==t.event)u.handleAndroid(t).then(function(){a.hide(),"tab.impostazioni"!==e.current.name&&(m||e.go("tab.impostazioni",{},{reload:!0}))},function(){a.hide(),h.clearLocalStorage()});else if("message"==t.event){var n="";if(void 0!==t.payload.custom.idRif?u.getFromRifId(t.payload.custom.idRif).then(function(o){o=u.getReference(),void 0!==o.chats&&t.foreground===!1&&(f.addChat(o.chats),""==n&&(n="tab.chat")),void 0!==o.convalide&&(g.getList(),g.addConvalida(o.convalide),""==n&&(n="tab.convalide")),void 0!==o.notifiche&&(v.addNotifica(o.notifiche),""==n&&(n="tab.notifiche")),u.serverNotificationsCallback()}):(void 0!==t.payload.custom.chats&&t.foreground===!1&&(f.addChat(t.payload.custom.chats),""==n&&(n="tab.chat")),void 0!==t.payload.custom.convalide&&(g.getList(),g.addConvalida(t.payload.custom.convalide),""==n&&(n="tab.convalide")),void 0!==t.payload.custom.notifiche&&(v.addNotifica(t.payload.custom.notifiche),""==n&&(n="tab.notifiche")),u.serverNotificationsCallback()),t.foreground){if(t.payload.sound){var r=c.newMedia(cordova.file.applicationDirectory+"www/sound/notification.mp3");r.setVolume(.3),r.play()}t.payload.vibrate&&s.vibrate(500)}e.current.name!==n&&""!==n&&(m=!0,i(function(){e.go(n)},1e3))}else l.show("error"==t.event?t.msg+" Push notification error event":"Push notification handler - Unprocessed Event");else ionic.Platform.isIOS()&&(u.handleIOS(t),a.hide())})}]).controller("MenuCtrl",["$scope","NavBadges",function(o,t){o.badges=t.getBadges()}]).controller("ImpostazioniCtrl",["$scope","$state","$ionicLoading","$cordovaNetwork","$cordovaToast","Auth","PushState","Chats","$ionicHistory",function(o,t,i,e,a,n,r,c,s){var l=JSON.parse(window.localStorage.user);o.titolo=l.titolo_scheda,o.username=l.nome_utente,o.filename=l.filepath,o.chat_disabled="0"==l.chat?!0:!1,o.settings={enablePushNotifications:"true"===window.localStorage.enablePushNotifications?!0:!1,chatAvailable:"false"===window.localStorage.chatAvailable?!1:!0},o.chatAvailableChange=function(){r.toggleChat(o.settings.chatAvailable).then(function(){window.localStorage.chatAvailable=o.settings.chatAvailable;var t=o.settings.chatAvailable===!0?"Chat attivata":"Chat disattivata";a.show(t,"short","bottom"),o.settings.chatAvailable===!1?c.breakChat():(c.init(),c.all(),s.clearCache(),s.clearHistory())},function(){a.show("Errore cambio stato Chat","short","bottom")})},o.pushNotificationChange=function(){if(o.settings.enablePushNotifications){var t={id_scheda:window.localStorage.id_scheda};r.register(t).then(function(){o.settings.enablePushNotifications=!0,a.show("Notifiche attivate","short","bottom")},function(){o.settings.enablePushNotifications=!1,a.show("Errore attivazione notifiche","short","bottom")})}else r.unregister().then(function(){o.settings.enablePushNotifications=!1,a.show("Notifiche disattivate","short","bottom")},function(){o.settings.enablePushNotifications=!0,a.show("Errore disattivazione notifiche","short","bottom")});window.localStorage.enablePushNotifications=o.settings.enablePushNotifications},o.logout_disabled="online"==window.localStorage.network?!1:!0,o.$watch(function(){return window.localStorage.network},function(t,i){void 0!==t&&t!=i&&(o.logout_disabled="online"==t?!1:!0)}),o.logout=function(){return e.isOffline()?(a.show("Nessuna connessione dati","short","bottom"),!1):(i.show({template:"<ion-spinner></ion-spinner>",noBackdrop:!1}),void n.logout().then(function(){i.hide(),t.go("login"),s.clearCache(),s.clearHistory()},function(){i.hide()}))}}]).controller("LoginCtrl",["$scope","$rootScope","$ionicLoading","$cordovaNetwork","$cordovaToast","Auth","Convalide","Chats","NavBadges",function(o,t,i,e,a,n,r,c){o.credentials={username:"",password:""},o.auth_error=null,o.submitted=!1,o.login_disabled=!1,o.$watch(function(){return window.localStorage.network},function(t,i){void 0!==t&&t!=i&&(o.login_disabled="online"==t?!1:!0)}),o.login=function(){if(o.loginForm.$valid){if(cordova.plugins.Keyboard.isVisible&&cordova.plugins.Keyboard.close(),window.localStorage.network=e.isOnline()?"online":"offline",e.isOffline())return a.show("Nessuna connessione dati","short","bottom"),!1;i.show({template:"<ion-spinner></ion-spinner>",noBackdrop:!1}),n.login(o.credentials.username,o.credentials.password).then(function(i){o.auth_error=!1,n.storeAuthInfo(i.data),r.refreshList(),c.init(),c.all().then(function(o){t.NRchats=o})},function(){o.auth_error=!0,i.hide(),a.show("Indirizzo email o password errati","short","center")})}else o.login_form.submitted=!0}}]);