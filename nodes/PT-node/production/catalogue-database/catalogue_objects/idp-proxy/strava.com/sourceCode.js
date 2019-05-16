!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("activate",[],n):"object"==typeof exports?exports.activate=n():e.activate=n()}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=0)}([function(e,n,o){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,n,o){return{name:"StravaIdpProxyProtoStub",instance:new f(e,n,o)}};var t=o(1),r=o(2),s=o(3);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,n){return!n||"object"!==i(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):n}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,n){return(u=Object.setPrototypeOf||function(e,n){return e.__proto__=n,e})(e,n)}var f=function(e){function n(e,o,s){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),s.domain="strava.com",s.idpUrl="domain-idp://strava.com",s.idpProxy=t.a,s.apiInfo=r.a,s.accessTokenAuthorisationEndpoint=r.b,s.accessTokenEndpoint=r.c,s.refreshAccessTokenEndpoint=r.f,s.accessTokenInput=r.d,s.revokeAccessTokenEndpoint=r.g,s.authorisationEndpoint=r.e,c(this,a(n).call(this,e,o,s))}return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),n&&u(e,n)}(n,s["a"]),n}()},function(e,n,o){"use strict";o.d(n,"a",function(){return k});var t,r,s,i,c,a,u,f;function l(e,n){n=n.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var o=new RegExp("[\\#&?]"+n+"=([^&#]*)").exec(e);return null===o?"":o[1]}function p(e,n){var o=new XMLHttpRequest;return"withCredentials"in o?o.open(e,n,!0):"undefined"!=typeof XDomainRequest?(o=new XDomainRequest).open(e,n):o=null,new Promise(function(e,n){o?(o.onreadystatechange=function(t){if(console.log("[OAUTH2.sendHTTPRequest] response ",t),4===o.readyState)if(200===o.status){var r=JSON.parse(o.responseText);e(r)}else 400===o.status?n("There was an error processing the token"):401===o.status?n("Not Authorised"):n("something else other than 200 was returned")},o.send()):n("CORS not supported")})}var d=function(e,n,o){return new Promise(function(r,s){p("GET",t(o)).then(function(t){console.log("[OAUTH2.generateAssertion] obtained user profile ",t);var s=btoa(JSON.stringify({tokenID:o.access_token,tokenIDJSON:t,publicKey:e}));console.log("[OAUTH2.generateAssertion] atob assertion:",atob(s));var c={assertion:s,idp:{domain:i,protocol:"OAUTH2"},expires:n,userProfile:t};console.log("[OAUTH2.generateAssertion] returning: ",JSON.stringify(c)),r(c)})})},h=function(e){var n=l(e,"expires_in");return n?n+=Math.floor(Date.now()/1e3):n=31536e5+Math.floor(Date.now()/1e3),n},g=function(e,n,o,t,r){var s={domain:i,resources:e,accessToken:n,expires:o,input:t};return r&&(s.refresh=r),s},k={validateAssertion:function(e,n,o){return console.info("[OAUTH2.validateAssertion] assertion: ",atob(n)),t=e.userInfoEndpoint,i=e.domain,new Promise(function(o,t){var r=atob(n),s=JSON.parse(r);p("GET",e.validateAssertionEndpoint({access_token:s.tokenID,input:s.tokenIDJSON})).then(function(n){JSON.stringify(n)===JSON.stringify(s.tokenIDJSON)?o({identity:e.convertUserProfile(n).id,contents:s.publicKey}):t("invalid")}).catch(function(e){t(e)})})},generateAssertion:function(e,n,o,c){console.log("[OAUTH2.generateAssertion:config]",e),console.log("[OAUTH2.generateAssertion:contents]",n),console.log("[OAUTH2.generateAssertion:origin]",o),console.log("[OAUTH2.generateAssertion:hint]",c),t=e.userInfoEndpoint,r=e.tokenEndpoint,s=e.authorisationEndpoint,i=e.domain;return new Promise(function(e,o){if(c){var t=l(c,"expires_in");t?t+=Math.floor(Date.now()/1e3):t=31536e5+Math.floor(Date.now()/1e3);var i=l(c,"access_token");e(i?d(n,t,{access_token:i}):function(e,n,o){return new Promise(function(t,s){var i=l(o,"code");i||s("[OAUTH2.generateAssertionWithCode] code not returned by the authentication: ",o),p("POST",r(i)).then(function(o){o.hasOwnProperty("access_token")?t(d(e,n,o)):s("[OAUTH2.generateAssertionWithCode] access token not returned in the exchange code result: ",o)},function(e){s(e)})})}(n,t,c))}else o({name:"IdPLoginError",loginUrl:s(n)})},function(e){reject(e)})},getAccessTokenAuthorisationEndpoint:function(e,n){console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:config]",e),console.log("[OAUTH2.getAccessTokenAuthorisationEndpoint:resources]",n),a=e.accessTokenAuthorisationEndpoint;return new Promise(function(e,o){e(a(n))},function(e){reject(e)})},getAccessToken:function(e,n,o){console.log("[OAUTH2.getAccessToken:config]",e),console.log("[OAUTH2.getAccessToken:login]",o),c=e.accessTokenEndpoint,i=e.domain;return new Promise(function(e,t){var r=h(o),s=l(o,"access_token");e(s?g(n,s,r,o):function(e,n){return new Promise(function(o,t){var r=l(n,"code");r||t("[OAUTH2.getAccessTokenWithCodeToken] code not returned by the login result: ",n),p("POST",c(r,e)).then(function(n){if(console.info("[OAUTH2.getAccessTokenWithCodeToken] HTTP response: ",n),n.hasOwnProperty("access_token")){var r=h(n),s=!!n.hasOwnProperty("refresh_token")&&n.refresh_token;o(g(e,n.access_token,r,n,s))}else t("[OAUTH2.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ",n)},function(e){t(e)})})}(n,o))},function(e){reject(e)})},refreshAccessToken:function(e,n){console.log("[OAUTH2.refreshAccessToken:config]",e),console.log("[OAUTH2.refreshAccessToken:outdated token]",n),u=e.refreshAccessTokenEndpoint,i=e.domain;return new Promise(function(e,o){var t=n.refresh;t||o("[OAUTH2.refreshAccessToken] refresh token not available in the access token",n),p("POST",u(t)).then(function(r){if(console.info("[OAUTH2.refreshAccessToken] response: ",r),r.hasOwnProperty("access_token")){var s=function(e){var n=!!e.hasOwnProperty("expires_in")&&e.expires_in;return n?n+=Math.floor(Date.now()/1e3):n=31536e5+Math.floor(Date.now()/1e3),Number(n)}(r);e(g(n.resources,r.access_token,s,r,t))}else o("[OAUTH2.refreshAccessToken] new access token not returned in the response: ",r)},function(e){o(e)})},function(e){reject(e)})},revokeAccessToken:function(e,n){console.log("[OAUTH2.revokeAccessToken:config]",e),console.log("[OAUTH2.revokeAccessToken: token]",n),f=e.revokeAccessTokenEndpoint,i=e.domain;return new Promise(function(e,o){n.refresh||o("[OAUTH2.revokeAccessToken] refresh token not available in the access token",n),p("POST",f(n.accessToken)).then(function(n){console.info("[OAUTH2.revokeAccessToken] response: ",n),e(!0)},function(e){o(e)})},function(e){reject(e)})}}},function(e,n,o){"use strict";o.d(n,"a",function(){return i}),n.e=function(e){var n=i.authorisationEndpoint+"redirect_uri="+s+"&response_type="+i.type+"&client_id="+i.clientID+"&scope="+i.scope+"&state="+e;return console.log("[StravaInfo.authorisationEndpoint] ",n),n},n.c=function(e,n){return i.tokenEndpoint+"client_id="+i.clientID+"&code="+e+"&grant_type=authorization_code&client_secret="+i.secret+"&redirect_uri="+s},n.f=function(e){return i.tokenEndpoint+"client_id="+i.clientID+"&refresh_token="+e+"&grant_type=refresh_token&client_secret="+i.secret},n.g=function(e){return i.revokeEndpoint+"&token="+e},n.b=function(e){var n=i.authorisationEndpoint+"redirect_uri="+s+"&response_type="+i.type+"&client_id="+i.clientID+"&scope="+i.scope+"&state="+e;return console.log("[StravaInfo.accessTokenAuthorisationEndpoint] ",n),n},n.d=function(e){return{info:e}};var t,r,s=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:"");location.hostname.indexOf("alticelabs.com")>-1?(t="31748",r="521567cbdf0e4f7ab17ad7cce536022bd8cccf87"):(t="24124",r="ff4848fd0f605db8fe46f8080ac2fc185045b79e");var i={clientID:t,authorisationEndpoint:"https://www.strava.com/api/v3/oauth/authorize?",tokenEndpoint:"https://www.strava.com/oauth/token?",revokeEndpoint:"https://www.strava.com/oauth/deauthorize?",type:"code",scope:"read_all,activity:read_all",domain:"strava.com",secret:r}},function(e,n,o){"use strict";function t(e,n){for(var o=0;o<n.length;o++){var t=n[o];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}var r,s,i,c=function(){function e(n,o,t){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e);var c=this;c.runtimeProtoStubURL=n,c.messageBus=o,c.config=t,r=t.idpProxy,s=t.convertUserProfile,i=t.accessTokenInput,console.log("[AbstractIdpProxy] constructor"),c.messageBus.addListener("*",function(e){e.to===t.idpUrl&&c.requestToIdp(e)}),c._sendStatus("created")}return function(e,n,o){n&&t(e.prototype,n),o&&t(e,o)}(e,[{key:"requestToIdp",value:function(e){var n=this,o=e.body.params;switch(console.info("[AbstractIdpProxyProtoStub] receiving request: ",e),e.body.method){case"generateAssertion":r.generateAssertion(n.config,o.contents,o.origin,o.usernameHint).then(function(o){o.userProfile=s(o.userProfile),n.replyMessage(e,o)},function(o){n.replyMessage(e,o,401)});break;case"validateAssertion":r.validateAssertion(n.config,o.assertion,o.origin).then(function(o){n.replyMessage(e,o)},function(o){n.replyMessage(e,o)});break;case"refreshAssertion":r.refreshAssertion(o.identity).then(function(o){n.replyMessage(e,o)},function(o){n.replyMessage(e,o,value,401)});break;case"getAccessTokenAuthorisationEndpoint":r.getAccessTokenAuthorisationEndpoint(n.config,o.resources).then(function(o){n.replyMessage(e,o)},function(o){n.replyMessage(e,o,401)});break;case"getAccessToken":r.getAccessToken(n.config,o.resources,o.login).then(function(o){console.info("OIDC.getAccessToken result: ",o),o.input=i(o.input),n.replyMessage(e,o)},function(o){n.replyMessage(e,o,401)});break;case"refreshAccessToken":r.refreshAccessToken(n.config,o.token).then(function(o){console.info("OIDC.refreshAccessToken result: ",o),n.replyMessage(e,o)},function(o){n.replyMessage(e,o,401)});break;case"revokeAccessToken":r.revokeAccessToken(n.config,o.token).then(function(o){console.info("OIDC.revokeAccessToken result: ",o),n.replyMessage(e,o)},function(o){n.replyMessage(e,o,401)})}}},{key:"replyMessage",value:function(e,n){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:200,t={id:e.id,type:"response",to:e.from,from:e.to,body:{code:o}};o<300?t.body.value=n:t.body.description=n,console.log("[AbstractIdpProxyProtoStub.replyMessage] ",t),this.messageBus.postMessage(t)}},{key:"_sendStatus",value:function(e,n){console.log("[AbstractIdpProxyProtoStub.sendStatus] ",e),this._state=e;var o={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};n&&(o.body.desc=n),this.messageBus.postMessage(o)}}]),e}();n.a=c}]).default});