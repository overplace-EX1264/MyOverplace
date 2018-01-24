angular.module("starter.controllers",[]).run(["$ionicPlatform","$cordovaPush",function(o,e){var t=null;ionic.Platform.isAndroid()?t={senderID:"751872435382"}:ionic.Platform.isIOS()&&(t={badge:"true",sound:"true",alert:"true"});var n=window.localStorage.getItem("id_scheda");null!==n&&o.ready(function(){e.register(t).then(function(o){ionic.Platform.isIOS()&&(regId=o,window.localStorage.regId=regId)},function(){alert("Errore di connessione")})})}]).controller("AppCtrl",["$rootScope","$scope","$timeout","$state","$ionicLoading","$cordovaNetwork","$cordovaLocalNotification","$cordovaMedia","$cordovaVibration","$cordovaToast","$ionicHistory","Auth","PushState","Chats","Convalide","Notifiche","NavBadges",function(o,e,t,n,i,a,c,r,l,s,d,h,u,f,v,g,m){var w=["tab.chat-detail","tab.convalide-detail","tab.notifiche-detail"],p=!1;o.$on("$ionicView.beforeEnter",function(){o.hideTabs=~w.indexOf(n.current.name)});var b=window.localStorage.getItem("id_scheda");null!==b&&(v.getList(),f.init(),f.all().then(function(e){o.NRchats=e})),o.$watch("NRchats",function(o){var e=0;for(var t in o)o[t].toRead&&("#/tab/chat/"+o[t].channelReference!==window.location.hash?e++:o[t].toRead=!1);m.setBadges("chat",e)},function(){});var w=["tab.chat-detail","tab.convalide-detail","tab.notifiche-detail"];o.$on("$ionicView.beforeEnter",function(){o.hideTabs=~w.indexOf(n.current.name)}),o.$on("$cordovaLocalNotification:click",function(){n.go("tab.chat")}),o.$on("$cordovaNetwork:online",function(){window.localStorage.network="online",f.init(),f.all(),o.$broadcast("reInitChat")}),o.$on("$cordovaNetwork:offline",function(){window.localStorage.network="offline",s.show("Nessuna connessione dati","short","bottom")}),e.notifications=[],e.$on("$cordovaPush:notificationReceived",function(o,e){d.viewHistory(),d.currentView();if(ionic.Platform.isAndroid())if("registered"==e.event)u.handleAndroid(e).then(function(){i.hide(),"tab.impostazioni"!==n.current.name&&(p||n.go("tab.impostazioni",{},{reload:!0}))},function(){i.hide(),h.clearLocalStorage()});else if("message"==e.event){var a="";if(void 0!==e.payload.custom.idRif?u.getFromRifId(e.payload.custom.idRif).then(function(o){o=u.getReference(),void 0!==o.chats&&e.foreground===!1&&(f.addChat(o.chats),""==a&&(a="tab.chat")),void 0!==o.convalide&&(v.getList(),v.addConvalida(o.convalide),""==a&&(a="tab.convalide")),void 0!==o.notifiche&&(g.addNotifica(o.notifiche),""==a&&(a="tab.notifiche")),u.serverNotificationsCallback()}):(void 0!==e.payload.custom.chats&&e.foreground===!1&&(f.addChat(e.payload.custom.chats),""==a&&(a="tab.chat")),void 0!==e.payload.custom.convalide&&(v.getList(),v.addConvalida(e.payload.custom.convalide),""==a&&(a="tab.convalide")),void 0!==e.payload.custom.notifiche&&(g.addNotifica(e.payload.custom.notifiche),""==a&&(a="tab.notifiche")),u.serverNotificationsCallback()),e.foreground){if(e.payload.sound){var c=r.newMedia(cordova.file.applicationDirectory+"www/sound/notification.mp3");c.setVolume(.3),c.play()}e.payload.vibrate&&l.vibrate(500)}n.current.name!==a&&""!==a&&(p=!0,t(function(){n.go(a)},1e3))}else s.show("error"==e.event?e.msg+" Push notification error event":"Push notification handler - Unprocessed Event");else ionic.Platform.isIOS()&&(u.handleIOS(e),i.hide())})}]).controller("TabsCtrl",["$scope","NavBadges",function(o,e){o.badges=e.getBadges()}]).controller("ChatCtrl",["$scope","$rootScope","Chats","$ionicLoading",function(o,e,t,n){var i=JSON.parse(window.localStorage.user);n.show({content:"Loading Data",animation:"fade-in",showBackdrop:!1,maxWidth:200}),t.all().then(function(o){n.hide(),e.chats=o}),o.Loading=!0,o.$watch(o.chats,function(){o.Loading=!1}),o.moduloChat="1"===i.chat?"true":"false",o.minusCounter=function(o){t.minusCounter(o)},o.remove=function(o){t.minusCounter(o.channelReference),t.remove(o)},o.call=function(){window.location.href="tel:0742677099"}}]).controller("ChatDetailCtrl",["$scope","$stateParams","$ionicScrollDelegate","$timeout","$state","$cordovaToast","Chats",function(o,e,t,n,i,a,c){o.myResponse="",o.currentChannel="","tab.chat-detail"==i.current.name&&void 0!==e.channelReference&&(o.currentChannel=e.channelReference),o.talk=c.get(e.channelReference),o.chatName=c.getName(e.channelReference),n(function(){t.scrollBottom()},1),o.sendResponse=function(t){if(""!==o.myResponse){o.myResponse="";var n=JSON.parse(window.localStorage.user),i={nickname:n.nickname,text:t,avatar:"//www.overplace.com/avatar/"+n.avatar};c.sendResponse(i,e.channelReference)}},o.remove=function(o){c.remove(o),c.minusCounter(o.channelReference)},o.$on("newMessage",function(e,n){"tab.chat-detail"==i.current.name&&n==o.currentChannel&&(c.minusCounter(n),c.resetPending(o.currentChannel),t.scrollBottom(!0))}),o.$on("chatClosed",function(e,t){"tab.chat-detail"==i.current.name&&t==o.currentChannel&&(a.show("Chat interrotta","short","bottom"),c.minusCounter(t))})}]).controller("ConvalideCtrl",["$scope","$ionicPopup","Convalide","Cache","$timeout",function(o,e,t,n,i){o.showDelete=!1,o.disableResync=void 0!==window.localStorage.convalideRemoved&&window.localStorage.convalideRemoved.length>0&&JSON.parse(window.localStorage.convalideRemoved).length>0?!1:!0,o.convalide_list=t.getList(),o.convalide_count=t.getTotalCount(),o.refresh=function(){t.refreshList().then(function(){o.convalide_list=n.convalideCache,o.convalide_count=t.getTotalCount(),o.$broadcast("scroll.refreshComplete")},function(){alert("Errore nel recupero delle convalide!"),o.$broadcast("scroll.refreshComplete")})},o.remove=function(e,n){t.remove(e,n),o.disableResync=!1},o.resync=function(){e.confirm({title:"Ripristina notifiche",template:"Sei sicuro di voler ripristinare tutte le notifiche nascoste?",okText:"OK",cancelText:"Annulla"}).then(function(e){e&&(t.resync(),o.convalide_list=n.convalideCache,o.convalide_count=t.getTotalCount(),o.disableResync=!0)})},o.$watch(function(){return n.convalideCache},function(e,t){void 0!==e&&e!=t&&(o.convalide_list=e,i(function(){o.$digest()}))})}]).controller("ConvalideDetailCtrl",["$scope","$stateParams","$ionicHistory","$ionicPopup","$ionicLoading","Convalide","Cache",function(o,e,t,n,i,a,c){function r(o,e,c,r){n.confirm({title:c,template:r,okText:"OK",cancelText:"Annulla"}).then(function(n){n&&(i.show({template:"<ion-spinner></ion-spinner>",noBackdrop:!1}),a.move(o,e).then(function(){i.hide(),t.goBack()},function(){i.hide(),t.goBack()}))})}o.convalida=c.convalideCacheId[e.id],o.convalida_checkin=function(o){r(o,!0,"Promozione","Sei sicuro di voler convalidare la promozione?")},o.accetta_prenotazione=function(o){r(o,!0,"Prenotazione","Sei sicuro di voler accettare la prenotazione?")},o.rifiuta_prenotazione=function(o){r(o,!1,"Prenotazione","Sei sicuro di voler rifiutare la prenotazione?")}}]).controller("NotificheCtrl",["$scope","Notifiche",function(o,e){o.notifiche_list=e.getList(),o.remove=function(o){e.remove(o)}}]).controller("NotificheDetailCtrl",["$scope","$stateParams","Notifiche",function(o,e,t){o.notifica=t.get(e.id)}]).controller("ImpostazioniCtrl",["$scope","$state","$ionicLoading","$cordovaNetwork","$cordovaToast","Auth","PushState","Chats","$ionicHistory",function(o,e,t,n,i,a,c,r,l){var s=JSON.parse(window.localStorage.user);o.titolo=s.titolo_scheda,o.username=s.nome_utente,o.filename=s.filepath,o.chat_disabled="0"==s.chat?!0:!1,o.settings={enablePushNotifications:"true"===window.localStorage.enablePushNotifications?!0:!1,chatAvailable:"false"===window.localStorage.chatAvailable?!1:!0},o.chatAvailableChange=function(){c.toggleChat(o.settings.chatAvailable).then(function(){window.localStorage.chatAvailable=o.settings.chatAvailable;var e=o.settings.chatAvailable===!0?"Chat attivata":"Chat disattivata";i.show(e,"short","bottom"),o.settings.chatAvailable===!1?r.breakChat():(r.init(),r.all(),l.clearCache(),l.clearHistory())},function(){i.show("Errore cambio stato Chat","short","bottom")})},o.pushNotificationChange=function(){if(o.settings.enablePushNotifications){var e={id_scheda:window.localStorage.id_scheda};c.register(e).then(function(){o.settings.enablePushNotifications=!0,i.show("Notifiche attivate","short","bottom")},function(){o.settings.enablePushNotifications=!1,i.show("Errore attivazione notifiche","short","bottom")})}else c.unregister().then(function(){o.settings.enablePushNotifications=!1,i.show("Notifiche disattivate","short","bottom")},function(){o.settings.enablePushNotifications=!0,i.show("Errore disattivazione notifiche","short","bottom")});window.localStorage.enablePushNotifications=o.settings.enablePushNotifications},o.logout_disabled="online"==window.localStorage.network?!1:!0,o.$watch(function(){return window.localStorage.network},function(e,t){void 0!==e&&e!=t&&(o.logout_disabled="online"==e?!1:!0)}),o.logout=function(){return n.isOffline()?(i.show("Nessuna connessione dati","short","bottom"),!1):(t.show({template:"<ion-spinner></ion-spinner>",noBackdrop:!1}),void a.logout().then(function(){t.hide(),e.go("login"),l.clearCache(),l.clearHistory()},function(){t.hide()}))}}]).controller("LoginCtrl",["$scope","$rootScope","$ionicLoading","$cordovaNetwork","$cordovaToast","Auth","Convalide","Chats","NavBadges",function(o,e,t,n,i,a,c,r){o.credentials={username:"",password:""},o.auth_error=null,o.submitted=!1,o.login_disabled=!1,o.$watch(function(){return window.localStorage.network},function(e,t){void 0!==e&&e!=t&&(o.login_disabled="online"==e?!1:!0)}),o.login=function(){if(o.loginForm.$valid){if(cordova.plugins.Keyboard.isVisible&&cordova.plugins.Keyboard.close(),window.localStorage.network=n.isOnline()?"online":"offline",n.isOffline())return i.show("Nessuna connessione dati","short","bottom"),!1;t.show({template:"<ion-spinner></ion-spinner>",noBackdrop:!1}),a.login(o.credentials.username,o.credentials.password).then(function(t){o.auth_error=!1,a.storeAuthInfo(t.data),c.refreshList(),r.init(),r.all().then(function(o){e.NRchats=o})},function(){o.auth_error=!0,t.hide(),i.show("Indirizzo email o password errati","short","center")})}else o.login_form.submitted=!0}}]);