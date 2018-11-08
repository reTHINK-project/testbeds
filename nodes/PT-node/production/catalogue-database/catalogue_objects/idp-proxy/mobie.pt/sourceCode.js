!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("activate",[],n):"object"==typeof exports?exports.activate=n():e.activate=n()}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,n,t){return{name:"MobieIdpProxyProtoStub",instance:new s(e,n,t)}};var o=t(1),r=t(2),i=function(e){return e&&e.__esModule?e:{default:e}}(t(3));var s=function(e){function n(e,t,i){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),i.domain="mobie.pt",i.idpUrl="domain-idp://mobie.pt",i.idpProxy=o.IdpProxy,i.apiInfo=r.mobieAPIInfo,i.accessTokenAuthorisationEndpoint=r.accessTokenAuthorisationEndpoint,i.accessTokenEndpoint=r.accessTokenEndpoint,i.refreshAccessTokenEndpoint=r.refreshAccessTokenEndpoint,i.accessTokenInput=r.accessTokenInput,i.authorisationEndpoint=r.authorisationEndpoint,function(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e,t,i))}return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}(n,i.default),n}()},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=void 0,r=void 0,i=void 0,s=void 0,c=void 0,a=void 0;function u(e,n){n=n.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\#&?]"+n+"=([^&#]*)").exec(e);return null===t?"":t[1]}function f(e,n){var t=new XMLHttpRequest;return"withCredentials"in t?t.open(e,n,!0):"undefined"!=typeof XDomainRequest?(t=new XDomainRequest).open(e,n):t=null,new Promise(function(e,n){t?(t.onreadystatechange=function(o){if(4===t.readyState)if(200===t.status){var r=JSON.parse(t.responseText);e(r)}else 400===t.status?n("There was an error processing the token"):n("something else other than 200 was returned")},t.send()):n("CORS not supported")})}var p=function(e,n,t){return new Promise(function(r,i){f("GET",o(t)).then(function(o){console.log("[OAUTH2.generateAssertion] obtained user profile ",o);var i=btoa(JSON.stringify({tokenID:t.access_token,tokenIDJSON:o,publicKey:e}));console.log("[OAUTH2.generateAssertion] atob assertion:",atob(i));var c={assertion:i,idp:{domain:s,protocol:"OAUTH2"},expires:n,userProfile:o};console.log("[OAUTH2.generateAssertion] returning: ",JSON.stringify(c)),r(c)})})},l=n.getExpires=function(e){var n=u(e,"expires_in");return n?n+=Math.floor(Date.now()/1e3):n=31536e5+Math.floor(Date.now()/1e3),n},d=function(e,n,t,o,r){var i={domain:s,resources:e,accessToken:n,expires:t,input:o};return r&&(i.refresh=r),i};n.IdpProxy={validateAssertion:function(e,n,t){return console.info("[OAUTH2.validateAssertion] assertion: ",atob(n)),o=e.userInfoEndpoint,s=e.domain,new Promise(function(t,o){var r=atob(n),i=JSON.parse(r);f("GET",e.validateAssertionEndpoint({access_token:i.tokenID,input:i.tokenIDJSON})).then(function(n){JSON.stringify(n)===JSON.stringify(i.tokenIDJSON)?t({identity:e.convertUserProfile(n).id,contents:i.publicKey}):o("invalid")}).catch(function(e){o(e)})})},generateAssertion:function(e,n,t,c){console.log("[OAUTH2.generateAssertion:config]",e),console.log("[OAUTH2.generateAssertion:contents]",n),console.log("[OAUTH2.generateAssertion:origin]",t),console.log("[OAUTH2.generateAssertion:hint]",c),o=e.userInfoEndpoint,r=e.tokenEndpoint,i=e.authorisationEndpoint,s=e.domain;return new Promise(function(e,t){if(c){var o=u(c,"expires_in");o?o+=Math.floor(Date.now()/1e3):o=31536e5+Math.floor(Date.now()/1e3);var s=u(c,"access_token");e(s?p(n,o,{access_token:s}):function(e,n,t){return new Promise(function(o,i){var s=u(t,"code");s||i("[OAUTH2.generateAssertionWithCode] code not returned by the authentication: ",t),f("POST",r(s)).then(function(t){t.hasOwnProperty("access_token")?o(p(e,n,t)):i("[OAUTH2.generateAssertionWithCode] access token not returned in the exchange code result: ",t)},function(e){i(e)})})}(n,o,c))}else t({name:"IdPLoginError",loginUrl:i(n)})},function(e){reject(e)})},getAccessTokenAuthorisationEndpoint:function(e,n){console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:config]",e),console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:resources]",n),a=e.accessTokenAuthorisationEndpoint;return new Promise(function(e,t){e(a(n))},function(e){reject(e)})},getAccessToken:function(e,n,t){console.log("[OAUTH2.getAccessToken:config]",e),console.log("[OAUTH2.getAccessToken:login]",t),c=e.accessTokenEndpoint,s=e.domain;return new Promise(function(e,o){var r=l(t),i=u(t,"access_token");e(i?d(n,i,r,t):function(e,n){return new Promise(function(t,o){var r=u(n,"code");r||o("[OAUTH2.getAccessTokenWithCodeToken] code not returned by the login result: ",n),f("POST",c(r,e)).then(function(n){if(n.hasOwnProperty("access_token")){var r=l(n);t(d(e,n.access_token,r,n))}else o("[OAUTH2.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ",n)},function(e){o(e)})})}(n,t))},function(e){reject(e)})}}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.authorisationEndpoint=function(e){var n=r.authorisationEndpoint+"redirect_uri="+o+"&response_type="+r.type+"&client_id="+r.clientID+"&state="+e+"&BU=MOBI.E";return console.log("[MobieInfo.authorisationEndpoint] ",n),n},n.accessTokenEndpoint=function(e,n){return r.tokenEndpoint+"client_id="+r.clientID+"&code="+e+"&grant_type=authorization_code&user_id="+n+"&client_secret="+r.secret+"&redirect_uri="+o},n.refreshAccessTokenEndpoint=function(e){return r.tokenEndpoint+"client_id="+r.clientID+"&refresh_token="+e+"&grant_type=refresh_token&client_secret="+r.secret},n.revokeAccessTokenEndpoint=function(e){return r.revokeEndpoint+"&token="+e},n.accessTokenAuthorisationEndpoint=function(e){var n=r.authorisationEndpoint+"redirect_uri="+o+"&response_type="+r.type+"&client_id="+r.clientID+"&state="+e+"&BU=MOBI.E";return console.log("[MobieInfo.accessTokenAuthorisationEndpoint] ",n),n},n.accessTokenInput=function(e){return{info:e}};var o=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:""),r=n.mobieAPIInfo={clientID:"DSMSHARCITIES",authorisationEndpoint:"http://sc.ceiia.pagekite.me/dsmauth?",tokenEndpoint:"http://sc.ceiia.pagekite.me/dsmauth/token/?",revokeEndpoint:"https://sharingcities.mobinteli.com/dsmauth/revoke?",type:"code",domain:"mobie.pt",secret:"secretKey"}},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}();var r=void 0,i=void 0,s=void 0,c=function(){function e(n,t,o){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e);var c=this;c.runtimeProtoStubURL=n,c.messageBus=t,c.config=o,r=o.idpProxy,i=o.convertUserProfile,s=o.accessTokenInput,console.log("[AbstractIdpProxy] constructor"),c.messageBus.addListener("*",function(e){e.to===o.idpUrl&&c.requestToIdp(e)}),c._sendStatus("created")}return o(e,[{key:"requestToIdp",value:function(e){var n=this,t=e.body.params;switch(console.info("[AbstractIdpProxyProtoStub] receiving request: ",e),e.body.method){case"generateAssertion":r.generateAssertion(n.config,t.contents,t.origin,t.usernameHint).then(function(t){t.userProfile=i(t.userProfile),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"validateAssertion":r.validateAssertion(n.config,t.assertion,t.origin).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t)});break;case"refreshAssertion":r.refreshAssertion(t.identity).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t,value,401)});break;case"getAccessTokenAuthorisationEndpoint":r.getAccessTokenAuthorisationEndpoint(n.config,t.resources).then(function(t){n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"getAccessToken":r.getAccessToken(n.config,t.resources,t.login).then(function(t){console.info("OIDC.getAccessToken result: ",t),t.input=s(t.input),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)});break;case"refreshAccessToken":r.refreshAccessToken(n.config,t.token).then(function(t){console.info("OIDC.refreshAccessToken result: ",t),n.replyMessage(e,t)},function(t){n.replyMessage(e,t,401)})}}},{key:"replyMessage",value:function(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:200,o={id:e.id,type:"response",to:e.from,from:e.to,body:{code:t}};t<300?o.body.value=n:o.body.description=n,console.log("[AbstractIdpProxyProtoStub.replyMessage] ",o),this.messageBus.postMessage(o)}},{key:"_sendStatus",value:function(e,n){console.log("[AbstractIdpProxyProtoStub.sendStatus] ",e),this._state=e;var t={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};n&&(t.body.desc=n),this.messageBus.postMessage(t)}}]),e}();n.default=c}]).default});