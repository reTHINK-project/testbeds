!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("activate",[],r):"object"==typeof exports?exports.activate=r():e.activate=r()}("undefined"!=typeof self?self:this,function(){return function(e){var r={};function n(t){if(r[t])return r[t].exports;var o=r[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=r,n.d=function(e,r,t){n.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},n.p="",n(n.s=0)}([function(e,r,n){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=function(){function e(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(r,n,t){return n&&e(r.prototype,n),t&&e(r,t),r}}();r.default=function(e,r,n,t){return{name:"GroupChatManager",instance:new o(e,r,n,t)}};var o=function(){function e(r,n,t,o){!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e);var a=this;a._factory=o,a._syncher=o.createSyncher(r,n,t),a._manager=o.createChatManager(r,n,t,a._syncher),a.discovery=a._manager.discovery,a.identityManager=a._manager.identityManager,a.search=a._manager.search,a._domain=a._manager._domain,a._myUrl=r,a._runtimeURL=t.runtimeURL,a._bus=n,a._syncher.onNotification(function(e){console.log("[GroupChatManager] onNotification:",e),a.processNotification(e)}),a._resumeReporters(),a._resumeObservers()}return t(e,[{key:"_getRegisteredUser",value:function(){var e=this;return new Promise(function(r,n){e._manager.currentIdentity?r(e._manager.currentIdentity):e._manager.identityManager.discoverUserRegistered().then(function(e){console.log("[GroupChatManager] GET MY IDENTITY:",e),r(e)}).catch(function(e){console.error("[GroupChatManager] ERROR:",e),n(e)})})}},{key:"_resumeReporters",value:function(){var e=this,r=this;r._syncher.resumeReporters({store:!0}).then(function(n){var t=Object.keys(n);t.length>0&&r._getRegisteredUser().then(function(o){t.forEach(function(t){console.log("[GroupChatManager.resumeReporter]: ",t);var a=r._factory.createChatController(r._syncher,r.discovery,r._domain,r.search,o,r._manager);a.dataObjectReporter=n[t],e._manager._reportersControllers[t]=a,r._resumeInterworking(a.dataObjectReporter),console.log("[GroupChatManager] chatController invitationsHandler: ",a.invitationsHandler),a.invitationsHandler.resumeDiscoveries(r._manager.discovery,a.dataObjectReporter)}),r._onResumeReporter&&r._onResumeReporter(e._manager._reportersControllers)})}).catch(function(e){console.info("[GroupChatManager.resumeReporters] :",e)})}},{key:"_resumeObservers",value:function(){var e=this,r=this;r._syncher.resumeObservers({store:!0}).then(function(n){console.log("[GroupChatManager] resuming observers : ",n,r,r._onResume);var t=Object.keys(n);t.length>0&&r._getRegisteredUser().then(function(o){t.forEach(function(t){console.log("[GroupChatManager].syncher.resumeObserver: ",t);var a=n[t],i=r._factory.createChatController(r._syncher,r._manager.discovery,r._domain,r.search,o,r._manager);i.dataObjectObserver=a,e._manager._observersControllers[t]=i;var s=r._factory.createRegistrationStatus(a.url,r._runtimeURL,r._myUrl,r._bus);!function e(r,n,t){var o=t;r.sync().then(function(t){t||o.onLive(n,function(){o.unsubscribeLive(n),e(r,n,o)})})}(a,r._myUrl,s)}),r._onResumeObserver&&r._onResumeObserver(e._manager._observersControllers)})}).catch(function(e){console.info("[GroupChatManager] Resume Observer | ",e)})}},{key:"_resumeInterworking",value:function(e){var r=this;if(e.data.participants){var n=e.data.participants,t=e.url,o=e.schema;console.log("[GroupChatManager._resumeInterworking for] ",n),Object.keys(n).forEach(function(a){var i=n[a].identity.userProfile.userURL.split("://");if("user"!==i[0]){console.log("[GroupChatManager._resumeInterworking for] ",a),i=i[0]+"://"+i[1].split("/")[1];var s={type:"create",from:r._myUrl,to:i,body:{resource:t,schema:o,value:e.metadata}};r._bus.postMessage(s,function(){})}})}}},{key:"create",value:function(e,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this._manager.create(e,r,n)}},{key:"onInvitation",value:function(e){return this._manager.onInvitation(e)}},{key:"onResumeReporter",value:function(e){this._onResumeReporter=e}},{key:"onResumeObserver",value:function(e){this._onResumeObserver=e}},{key:"join",value:function(e){return this._manager.join(e)}},{key:"myIdentity",value:function(e){return console.log("[GroupChatManager.myIdentity] ",e),this._manager.myIdentity(e)}},{key:"processNotification",value:function(e){return this._manager.processNotification(e)}},{key:"onInvitation",value:function(e){return this._manager.onInvitation(e)}}]),e}()}]).default});