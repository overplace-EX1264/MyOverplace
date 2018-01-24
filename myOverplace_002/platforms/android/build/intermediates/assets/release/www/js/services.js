angular.module("starter.services",[]).constant("ApiConfig",{wsKey:void 0!==window.localStorage.restPass?window.localStorage.restPass:"mypassword",ovpEndpoint:"http://api.overplace.com/rest/application/"}).constant("Cache",{convalideCache:[],convalideCacheAll:[],convalideCacheId:{},convalideRemovedCache:[],notificheCache:[],notificheCacheId:{},notificheCacheRead:{}}).factory("NavBadges",["$http",function(){var e={};return e.badges={notifiche:0,convalide:0,chat:0},e.setBadges=function(o,n){e.badges[o]=window.localStorage["nr_"+o]=n},e.getBadges=function(){return e.badges},e}]).factory("Auth",["$http","$q","$cordovaFileTransfer","ApiConfig","PushState","Chats","Cache",function(e,o,n,i,t,a,c){var r=this;return this.clearLocalStorage=function(){window.localStorage.clear()},{login:function(a,c){var r=o.defer(),d={username:a,password:c};return d[i.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:i.ovpEndpoint+"login",params:d,cache:!1}).success(function(e){var o=e.filename,i=o.split("/").pop(),a=cordova.file.dataDirectory+i,c=!0,d={};e.filepath=a,n.download(o,a,d,c).then(function(){t.register(e).then(function(){return r.resolve(e)},function(){return r.reject()})},function(){return r.reject()})}).error(function(){return r.reject()})},logout:function(){var e=o.defer();return t.unregister().then(function(o){return r.clearLocalStorage(),a.unsubscribeChannels(),c.convalideCache=[],c.convalideCacheAll=[],c.convalideCacheId={},c.convalideRemovedCache=[],c.notificheCache=[],c.notificheCacheId={},c.notificheCacheRead={},e.resolve(o)},function(){return e.reject()})},storeAuthInfo:function(e){window.localStorage.id_scheda=e.id_scheda,window.localStorage.user=JSON.stringify(e),window.localStorage.enablePushNotifications=!0,window.localStorage.chatAvailable="1"==e.chat?!0:!1}}}]).factory("PushState",["$http","$q","$cordovaPush","$cordovaDevice","ApiConfig",function(e,o,n,i,t){var a=this,c=null,r=null,d=null;return ionic.Platform.isAndroid()?c={senderID:"751872435382"}:ionic.Platform.isIOS()&&(c={badge:"true",sound:"true",alert:"true"}),this.storeDeviceToken=function(n){d=window.localStorage.id_scheda,r=window.localStorage.regId;var a=o.defer(),c={regid:r,uuid:i.getUUID(),so_type:i.getPlatform()};return c[t.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:t.ovpEndpoint+"reg/"+d+"/"+n+"/fields",params:c,cache:!1}).success(function(e){return a.resolve(e)}).error(function(){return a.reject()})},{register:function(e){var i=o.defer();return d=e.id_scheda,n.register(c).then(function(e){return ionic.Platform.isIOS()&&(r=e,window.localStorage.regId=r,a.storeDeviceToken("registration")),i.resolve(e)},function(){return i.reject()})},unregister:function(){var e=o.defer();return a.storeDeviceToken("unregistration").then(function(o){return e.resolve(o)},function(){return e.reject()})},handleAndroid:function(e){var n=o.defer();return r=e.regid,window.localStorage.regId=r,d=window.localStorage.id_scheda,a.storeDeviceToken("registration").then(function(e){return n.resolve(e)},function(){return n.reject()})},handleIOS:function(){return null},serverNotificationsCallback:function(){var o={regid:window.localStorage.regId},n=t.ovpEndpoint+"notification/cb/"+window.localStorage.id_scheda+"/fields";o[t.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:n,params:o,cache:!1}).success(function(){}).error(function(){}).then(function(){})},toggleChat:function(e){var n=o.defer();r=window.localStorage.regId;var i=e===!0?"enable_chat":"disable_chat";return a.storeDeviceToken(i).then(function(e){return n.resolve(e)},function(){return n.reject()})},getFromRifId:function(n){var i=o.defer(),c={refId:n},r=t.ovpEndpoint+"notification/get/"+window.localStorage.id_scheda+"/fields";return c[t.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:r,params:c,cache:!1}).success(function(e){return a.reference=e,i.resolve(e)}).error(function(){return i.reject()})},getReference:function(){return a.reference}}}]).factory("Convalide",["$http","$q","$cordovaToast","ApiConfig","NavBadges","Cache",function(e,o,n,i,t,a){var c=this;return this.getAll=function(){var n=o.defer();a.convalideCache=[],a.convalideCacheAll=[],a.convalideCacheId={};var t={},c=i.ovpEndpoint+"convalide/"+window.localStorage.id_scheda+"/fields";return t[i.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:c,params:t,cache:!1}).success(function(e){for(var o=[],i=[],t=[],c=[],r=void 0!==window.localStorage.convalideRemoved&&window.localStorage.convalideRemoved.length>0&&JSON.parse(window.localStorage.convalideRemoved).length>0?JSON.parse(window.localStorage.convalideRemoved):[],d=e.length,l=0;d>l;l++){a.convalideCacheId[e[l].id]=e[l];var h=r.length>0&&-1!=r.indexOf(e[l].id)?!1:!0;"checkin"==e[l].type&&(0==e[l].stato?(h&&t.push(e[l]),o.push(e[l])):(h&&c.push(e[l]),i.push(e[l]))),"prenotazione"==e[l].type&&(1==e[l].stato?(h&&t.push(e[l]),o.push(e[l])):(h&&c.push(e[l]),i.push(e[l])))}return a.convalideCache={pending:t,approved:c},a.convalideCacheAll={pending:o,approved:i},n.resolve(a.convalideCache)}).error(function(){return n.reject()})},{refreshList:function(){var e=o.defer();return c.getAll().then(function(o){return t.setBadges("convalide",a.convalideCache.pending.length),e.resolve(o.data)},function(){return e.reject()})},count:function(){t.setBadges("convalide",a.convalideCache.pending.length)},getList:function(){return void 0!==a.convalideCache.pending||void 0!==a.convalideCache.approved?a.convalideCache:this.refreshList()},getTotalCount:function(){var e=void 0!==a.convalideCacheAll.pending&&void 0!==a.convalideCacheAll.approved?a.convalideCacheAll.pending.length+a.convalideCacheAll.approved.length:0;return e},resync:function(){if(void 0!==window.localStorage.convalideRemoved&&window.localStorage.convalideRemoved.length>0&&JSON.parse(window.localStorage.convalideRemoved).length>0){window.localStorage.convalideRemoved=[];var e=JSON.stringify(a.convalideCacheAll);a.convalideCache=JSON.parse(e),t.setBadges("convalide",a.convalideCache.pending.length)}},remove:function(e,o){a.convalideCache[o].splice(a.convalideCache[o].indexOf(e),1);var n=void 0!==window.localStorage.convalideRemoved&&window.localStorage.convalideRemoved.length>0&&JSON.parse(window.localStorage.convalideRemoved).length>0?JSON.parse(window.localStorage.convalideRemoved):[];-1==n.indexOf(e.id)&&(n.push(e.id),window.localStorage.convalideRemoved=JSON.stringify(n)),this.count()},move:function(c,r){var d=o.defer(),l=r?"accept":"reject",h=i.ovpEndpoint+"convalide/"+window.localStorage.id_scheda+"/"+c.type+"/"+l+"/"+c.id+"/fields",s=[];return s[i.wsKey]="JSON_CALLBACK",e({method:"JSONP",url:h,params:s,cache:!1}).success(function(e){return a.convalideCache.pending.splice(a.convalideCache.pending.indexOf(c),1),a.convalideCacheAll.pending.splice(a.convalideCacheAll.pending.indexOf(c),1),c.stato=e.stato,a.convalideCache.approved.unshift(c),a.convalideCacheAll.approved.unshift(c),t.setBadges("convalide",a.convalideCache.pending.length),n.show(e.data,"long","bottom"),d.resolve()}).error(function(e){return n.show(e.data,"long","bottom"),d.reject()})},addConvalida:function(){return this.refreshList()}}}]).factory("Notifiche",["$http","$q","NavBadges","Cache",function(e,o,n,i){return i.notificheCache=void 0!==window.localStorage.notifiche&&JSON.parse(window.localStorage.notifiche).length>0?JSON.parse(window.localStorage.notifiche):[],i.notificheCacheId=void 0!==window.localStorage.notificheId&&Object.keys(JSON.parse(window.localStorage.notificheId)).length>0?JSON.parse(window.localStorage.notificheId):{},i.notificheCacheRead=void 0!==window.localStorage.notificheRead&&Object.keys(JSON.parse(window.localStorage.notificheRead)).length>0?JSON.parse(window.localStorage.notificheRead):{},n.setBadges("notifiche",Object.keys(i.notificheCacheRead).length),{getList:function(){var e=i.notificheCache;return e.reverse(),e},get:function(e){var o=i.notificheCacheId[e];if(0!=i.notificheCacheRead.hasOwnProperty(e)){for(var t in i.notificheCache)if(i.notificheCache[t].id==e){i.notificheCache[t].isRead=!0,delete i.notificheCacheRead[e];break}window.localStorage.notificheRead=JSON.stringify(i.notificheCacheRead),window.localStorage.notifiche=JSON.stringify(i.notificheCache),n.setBadges("notifiche",Object.keys(i.notificheCacheRead).length)}return o},addNotifica:function(e){for(var o in e){var t=e[o].customData,a={id:t.id,type:t.type,titolo:t.titolo,testo:t.testo,isRead:!1};0==i.notificheCacheId.hasOwnProperty(t.id)&&(i.notificheCache.unshift(a),i.notificheCacheId[t.id]=t,i.notificheCacheRead[t.id]=!0)}window.localStorage.notifiche=JSON.stringify(i.notificheCache),window.localStorage.notificheId=JSON.stringify(i.notificheCacheId),window.localStorage.notificheRead=JSON.stringify(i.notificheCacheRead),n.setBadges("notifiche",Object.keys(i.notificheCacheRead).length)},remove:function(e){var o=e.id;0!=i.notificheCacheRead.hasOwnProperty(o)&&(delete i.notificheCacheRead[o],window.localStorage.notificheRead=JSON.stringify(i.notificheCacheRead),n.setBadges("notifiche",Object.keys(i.notificheCacheRead).length)),i.notificheCache.splice(i.notificheCache.indexOf(e),1),window.localStorage.notifiche=JSON.stringify(i.notificheCache)}}}]);