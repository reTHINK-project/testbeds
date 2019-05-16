!function(e,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define("activate",[],o):"object"==typeof exports?exports.activate=o():e.activate=o()}("undefined"!=typeof self?self:this,function(){return function(e){var o={};function n(t){if(o[t])return o[t].exports;var s=o[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=e,n.c=o,n.d=function(e,o,t){n.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(o,"a",o),o},n.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},n.p="",n(n.s=0)}([function(e,o,n){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default=function(e,o,n){return{name:"GoogleIdpProxyProtoStub",instance:new l(e,o,n)}};var t=n(1),s=n(2),r=n(3),i=n(4);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,o){return!o||"object"!==c(o)&&"function"!=typeof o?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):o}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,o){return(f=Object.setPrototypeOf||function(e,o){return e.__proto__=o,e})(e,o)}var l=function(e){function o(e,n,i){return function(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}(this,o),i.domain="google.com",i.idpUrl="domain-idp://google.com",i.idpProxy=t.a,i.idpInfo=s.f,i.apiInfo=s.e,i.accessTokenAuthorisationEndpoint=s.a,i.accessTokenEndpoint=s.b,i.refreshAccessTokenEndpoint=s.h,i.revokeAccessTokenEndpoint=s.i,i.accessTokenInput=s.c,i.authorisationEndpoint=s.d,i.convertUserProfile=r.a,i.mapping=s.g,a(this,u(o).call(this,e,n,i))}return function(e,o){if("function"!=typeof o&&null!==o)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(o&&o.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),o&&f(e,o)}(o,i["a"]),o}()},function(e,o,n){"use strict";n.d(o,"a",function(){return h});var t,s,r,i,c,a={},u=0,f=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:""),l=function(e){var o=!!e.hasOwnProperty("expires_in")&&e.expires_in;return o?o+=Math.floor(Date.now()/1e3):o=31536e5+Math.floor(Date.now()/1e3),Number(o)};function p(e,o){o=o.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n=new RegExp("[\\#&?]"+o+"=([^&#]*)").exec(e);return null!==n&&n[1]}function g(e,o){var n=new XMLHttpRequest;return"withCredentials"in n?n.open(e,o,!0):"undefined"!=typeof XDomainRequest?(n=new XDomainRequest).open(e,o):n=null,new Promise(function(e,o){n?(n.onreadystatechange=function(t){if(4===n.readyState)if(200===n.status){var s=JSON.parse(n.responseText);e(s)}else 400===n.status?o("There was an error processing the token"):o("something else other than 200 was returned")},n.send()):o("CORS not supported")})}var d=function(e,o,n,t,s){var i={domain:r,resources:e,accessToken:o,expires:n,input:t};return s&&(i.refresh=s),i},h={validateAssertion:function(e,o,n){console.info("[OIDC.validateAssertionProxy] assertion: ",atob(o));var t=atob(o),s=JSON.parse(t).tokenID.split(".");JSON.parse(atob(s[1]));return new Promise(function(n,t){var s=e.idpInfo,r=atob(o),i=JSON.parse(r);g("GET",s.tokenInfo+i.tokenID).then(function(e){JSON.stringify(e)===JSON.stringify(i.tokenIDJSON)?n({identity:i.tokenIDJSON.email,contents:i.tokenIDJSON}):t("invalid")}).catch(function(e){t(e)})})},refreshAssertion:function(e){return console.log("OIDC.refreshAssertion:oldIdentity",e),new Promise(function(o,n){o(e)})},generateAssertion:function(e,o,n,t){console.log("[OIDC.generateAssertion:contents]",o),console.log("[OIDC.generateAssertion:origin]",n),console.log("[OIDC.generateAssertion:hint]",t);var s=e.idpInfo;return new Promise(function(e,n){if(t){var r=p(t,"access_token"),i=p(t,"id_token");p(t,"code");g("GET",s.userinfo+r).then(function(o){console.log("[OIDC.generateAssertion] obtained infoToken ",o),g("GET",s.tokenInfo+i).then(function(n){console.log("[OIDC.generateAssertion] obtained idToken ",n);var t={assertion:btoa(JSON.stringify({tokenID:i,tokenIDJSON:n})),idp:{domain:s.domain,protocol:"OIDC"},expires:n.exp,userProfile:o,refresh:!0};a[u]=t,++u,console.log("[OIDC.generateAssertion] returning: ",JSON.stringify(t)),e(t)},function(e){n(e)})},function(e){n(e)})}else{var c=s.authorisationEndpoint+"redirect_uri="+f+"&prompt=consent&response_type="+s.type+"&client_id="+s.clientID+"&scope="+s.scope+"&access_type="+s.accessType+"&nonce="+o+"&state="+s.state;console.log("[OIDC.generateAssertion] NO_HINT: rejecting with requestUrl ",c),n({name:"IdPLoginError",loginUrl:c})}})},getAccessTokenAuthorisationEndpoint:function(e,o){console.log("[OIDC.getAccessTokenAuthorisationEndpoint:config]",e),console.log("[OIDC.getAccessTokenAuthorisationEndpoint:resources]",o),i=e.accessTokenAuthorisationEndpoint;var n=e.mapping;return new Promise(function(e,t){e(i(n(o)))},function(e){reject(e)})},getAccessToken:function(e,o,n){console.log("[OIDC.getAccessToken:config]",e),console.log("[OIDC.getAccessToken:login]",n),t=e.accessTokenEndpoint,r=e.domain;return new Promise(function(e,s){var r=function(e){var o=p(e,"expires_in");return o?o+=Math.floor(Date.now()/1e3):o=31536e5+Math.floor(Date.now()/1e3),Number(o)}(n),i=p(n,"access_token");e(i?d(o,i,r,n):function(e,o){return new Promise(function(n,s){var r=p(o,"code");r||s("[OIDC.getAccessTokenWithCodeToken] code not include in the url: ",o),g("POST",t(r)).then(function(o){if(console.info("[OIDC.getAccessTokenWithCodeToken] response: ",o),o.hasOwnProperty("access_token")){var t=l(o),r=!!o.hasOwnProperty("refresh_token")&&o.refresh_token;n(d(e,o.access_token,t,o,r))}else s("[OIDC.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ",o)},function(e){s(e)})})}(o,n))},function(e){reject(e)})},refreshAccessToken:function(e,o){console.log("[OIDC.refreshAccessToken:config]",e),console.log("[OIDC.refreshAccessToken:outdated token]",o),s=e.refreshAccessTokenEndpoint,r=e.domain;return new Promise(function(e,n){var t=o.refresh;t||n("[OIDC.refreshAccessToken] refresh token not available in the access token",o),g("POST",s(t)).then(function(s){if(console.info("[OIDC.refreshAccessToken] response: ",s),s.hasOwnProperty("access_token")){var r=l(s);e(d(o.resources,s.access_token,r,s,t))}else n("[OIDC.refreshAccessToken] new access token not returned in the response: ",s)},function(e){n(e)})},function(e){reject(e)})},revokeAccessToken:function(e,o){console.log("[OIDC.revokeAccessToken:config]",e),console.log("[OIDC.revokeAccessToken: token]",o),c=e.revokeAccessTokenEndpoint,r=e.domain;return new Promise(function(e,n){o.refresh||n("[OIDC.revokeAccessToken] refresh token not available in the access token",o),g("POST",c(o.accessToken)).then(function(o){console.info("[OIDC.revokeAccessToken] response: ",o),e(!0)},function(e){n(e)})},function(e){reject(e)})}}},function(e,o,n){"use strict";n.d(o,"f",function(){return s}),n.d(o,"e",function(){return r}),o.b=function(e){return r.tokenEndpoint+"client_id="+r.clientID+"&code="+e+"&grant_type=authorization_code&access_type=offline&client_secret="+r.secret+"&redirect_uri="+t},o.h=function(e){return r.tokenEndpoint+"client_id="+r.clientID+"&refresh_token="+e+"&grant_type=refresh_token&client_secret="+r.secret},o.i=function(e){return r.revokeEndpoint+"&token="+e},o.g=function(e){if(!e)return"fitness.location.read%20https://www.googleapis.com/auth/fitness.activity.read";switch(e){case"user_activity_context":default:return"fitness.location.read%20https://www.googleapis.com/auth/fitness.activity.read"}},o.a=function(e){var o=r.authorisationEndpoint+"redirect_uri="+t+"&response_type="+r.type+"&client_id="+r.clientID+"&scope=https://www.googleapis.com/auth/"+e+"&access_type="+r.accessType+"&state="+r.state;return console.log("[GoogleInfo.accessTokenAuthorisationEndpoint] ",o),o},o.d=function(e){var o=r.authorisationEndpoint+"redirect_uri="+t+"&response_type="+r.type+"&client_id="+r.clientID+"&scope="+r.scope+"&access_type="+r.accessType+"&state="+e;return console.log("[GoogleInfo.authorisationEndpoint] ",o),o},o.c=function(e){return{info:e}};var t=location.protocol+"//"+location.hostname+(""!==location.port?":"+location.port:""),s={clientID:"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com",issuer:"https://accounts.google.com",tokenEndpoint:"https://www.googleapis.com/oauth2/v4/token?",jwksUri:"https://www.googleapis.com/oauth2/v3/certs?",authorisationEndpoint:"https://accounts.google.com/o/oauth2/auth?",userinfo:"https://www.googleapis.com/oauth2/v3/userinfo?access_token=",tokenInfo:"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",accessType:"online",type:"token id_token",scope:"openid%20email%20profile",state:"state",domain:"google.com"},r={clientID:"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com",issuer:"https://accounts.google.com",tokenEndpoint:"https://www.googleapis.com/oauth2/v4/token?",revokeEndpoint:"https://accounts.google.com/o/oauth2/revoke?",jwksUri:"https://www.googleapis.com/oauth2/v3/certs?",authorisationEndpoint:"https://accounts.google.com/o/oauth2/auth?",userinfo:"https://www.googleapis.com/oauth2/v3/userinfo?access_token=",tokenInfo:"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",accessType:"offline",type:"code",scope:"https://www.googleapis.com/auth/fitness.location.read",state:"state",domain:"google.com",grant_type:"authorization_code",secret:"Xx4rKucb5ZYTaXlcZX9HLfZW"}},function(e,o,n){"use strict";o.a=function(e){e.userURL="user://google.com/"+e.email,e.hasOwnProperty("preferred_username")||(e.preferred_username=e.email.split("@")[0]);return e}},function(e,o,n){"use strict";function t(e,o){for(var n=0;n<o.length;n++){var t=o[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}var s,r,i,c=function(){function e(o,n,t){!function(e,o){if(!(e instanceof o))throw new TypeError("Cannot call a class as a function")}(this,e);var c=this;c.runtimeProtoStubURL=o,c.messageBus=n,c.config=t,s=t.idpProxy,r=t.convertUserProfile,i=t.accessTokenInput,console.log("[AbstractIdpProxy] constructor"),c.messageBus.addListener("*",function(e){e.to===t.idpUrl&&c.requestToIdp(e)}),c._sendStatus("created")}return function(e,o,n){o&&t(e.prototype,o),n&&t(e,n)}(e,[{key:"requestToIdp",value:function(e){var o=this,n=e.body.params;switch(console.info("[AbstractIdpProxyProtoStub] receiving request: ",e),e.body.method){case"generateAssertion":s.generateAssertion(o.config,n.contents,n.origin,n.usernameHint).then(function(n){n.userProfile=r(n.userProfile),o.replyMessage(e,n)},function(n){o.replyMessage(e,n,401)});break;case"validateAssertion":s.validateAssertion(o.config,n.assertion,n.origin).then(function(n){o.replyMessage(e,n)},function(n){o.replyMessage(e,n)});break;case"refreshAssertion":s.refreshAssertion(n.identity).then(function(n){o.replyMessage(e,n)},function(n){o.replyMessage(e,n,value,401)});break;case"getAccessTokenAuthorisationEndpoint":s.getAccessTokenAuthorisationEndpoint(o.config,n.resources).then(function(n){o.replyMessage(e,n)},function(n){o.replyMessage(e,n,401)});break;case"getAccessToken":s.getAccessToken(o.config,n.resources,n.login).then(function(n){console.info("OIDC.getAccessToken result: ",n),n.input=i(n.input),o.replyMessage(e,n)},function(n){o.replyMessage(e,n,401)});break;case"refreshAccessToken":s.refreshAccessToken(o.config,n.token).then(function(n){console.info("OIDC.refreshAccessToken result: ",n),o.replyMessage(e,n)},function(n){o.replyMessage(e,n,401)});break;case"revokeAccessToken":s.revokeAccessToken(o.config,n.token).then(function(n){console.info("OIDC.revokeAccessToken result: ",n),o.replyMessage(e,n)},function(n){o.replyMessage(e,n,401)})}}},{key:"replyMessage",value:function(e,o){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:200,t={id:e.id,type:"response",to:e.from,from:e.to,body:{code:n}};n<300?t.body.value=o:t.body.description=o,console.log("[AbstractIdpProxyProtoStub.replyMessage] ",t),this.messageBus.postMessage(t)}},{key:"_sendStatus",value:function(e,o){console.log("[AbstractIdpProxyProtoStub.sendStatus] ",e),this._state=e;var n={type:"update",from:this.runtimeProtoStubURL,to:this.runtimeProtoStubURL+"/status",body:{value:e}};o&&(n.body.desc=o),this.messageBus.postMessage(n)}}]),e}();o.a=c}]).default});