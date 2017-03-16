(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.activate = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Distribution file for HypertyDiscovery.js 
// version: 0.3.0
// Last build: Wed Jun 29 2016 18:18:31 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.HypertyDiscovery=e()}}(function(){return function e(t,r,n){function o(c,s){if(!r[c]){if(!t[c]){var u="function"==typeof require&&require;if(!s&&u)return u(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var f=r[c]={exports:{}};t[c][0].call(f.exports,function(e){var r=t[c][1][e];return o(r?r:e)},f,f.exports,e,t,r,n)}return r[c].exports}for(var i="function"==typeof require&&require,c=0;c<n.length;c++)o(n[c]);return o}({1:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":7}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":8}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":9}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":10}],5:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],6:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/define-property"),i=n(o);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":2}],7:[function(e,t,r){var n=e("../../modules/_core"),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(e){return o.stringify.apply(o,arguments)}},{"../../modules/_core":18}],8:[function(e,t,r){e("../../modules/es6.object.define-property");var n=e("../../modules/_core").Object;t.exports=function(e,t,r){return n.defineProperty(e,t,r)}},{"../../modules/_core":18,"../../modules/es6.object.define-property":74}],9:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/_core").Object.keys},{"../../modules/_core":18,"../../modules/es6.object.keys":75}],10:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.promise"),t.exports=e("../modules/_core").Promise},{"../modules/_core":18,"../modules/es6.object.to-string":76,"../modules/es6.promise":77,"../modules/es6.string.iterator":78,"../modules/web.dom.iterable":79}],11:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],12:[function(e,t,r){t.exports=function(){}},{}],13:[function(e,t,r){t.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},{}],14:[function(e,t,r){var n=e("./_is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./_is-object":35}],15:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_to-length"),i=e("./_to-index");t.exports=function(e){return function(t,r,c){var s,u=n(t),a=o(u.length),f=i(c,a);if(e&&r!=r){for(;a>f;)if(s=u[f++],s!=s)return!0}else for(;a>f;f++)if((e||f in u)&&u[f]===r)return e||f||0;return!e&&-1}}},{"./_to-index":64,"./_to-iobject":66,"./_to-length":67}],16:[function(e,t,r){var n=e("./_cof"),o=e("./_wks")("toStringTag"),i="Arguments"==n(function(){return arguments}()),c=function(e,t){try{return e[t]}catch(r){}};t.exports=function(e){var t,r,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=c(t=Object(e),o))?r:i?n(t):"Object"==(s=n(t))&&"function"==typeof t.callee?"Arguments":s}},{"./_cof":17,"./_wks":71}],17:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],18:[function(e,t,r){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},{}],19:[function(e,t,r){var n=e("./_a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./_a-function":11}],20:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],21:[function(e,t,r){t.exports=!e("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":25}],22:[function(e,t,r){var n=e("./_is-object"),o=e("./_global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./_global":27,"./_is-object":35}],23:[function(e,t,r){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],24:[function(e,t,r){var n=e("./_global"),o=e("./_core"),i=e("./_ctx"),c=e("./_hide"),s="prototype",u=function(e,t,r){var a,f,_,l=e&u.F,d=e&u.G,p=e&u.S,v=e&u.P,y=e&u.B,h=e&u.W,b=d?o:o[t]||(o[t]={}),m=b[s],g=d?n:p?n[t]:(n[t]||{})[s];d&&(r=t);for(a in r)f=!l&&g&&void 0!==g[a],f&&a in b||(_=f?g[a]:r[a],b[a]=d&&"function"!=typeof g[a]?r[a]:y&&f?i(_,n):h&&g[a]==_?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t[s]=e[s],t}(_):v&&"function"==typeof _?i(Function.call,_):_,v&&((b.virtual||(b.virtual={}))[a]=_,e&u.R&&m&&!m[a]&&c(m,a,_)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],26:[function(e,t,r){var n=e("./_ctx"),o=e("./_iter-call"),i=e("./_is-array-iter"),c=e("./_an-object"),s=e("./_to-length"),u=e("./core.get-iterator-method"),a={},f={},r=t.exports=function(e,t,r,_,l){var d,p,v,y,h=l?function(){return e}:u(e),b=n(r,_,t?2:1),m=0;if("function"!=typeof h)throw TypeError(e+" is not iterable!");if(i(h)){for(d=s(e.length);d>m;m++)if(y=t?b(c(p=e[m])[0],p[1]):b(e[m]),y===a||y===f)return y}else for(v=h.call(e);!(p=v.next()).done;)if(y=o(v,b,p.value,t),y===a||y===f)return y};r.BREAK=a,r.RETURN=f},{"./_an-object":14,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":36,"./_to-length":67,"./core.get-iterator-method":72}],27:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],28:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],29:[function(e,t,r){var n=e("./_object-dp"),o=e("./_property-desc");t.exports=e("./_descriptors")?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./_descriptors":21,"./_object-dp":45,"./_property-desc":53}],30:[function(e,t,r){t.exports=e("./_global").document&&document.documentElement},{"./_global":27}],31:[function(e,t,r){t.exports=!e("./_descriptors")&&!e("./_fails")(function(){return 7!=Object.defineProperty(e("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(e,t,r){t.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},{}],33:[function(e,t,r){var n=e("./_cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./_cof":17}],34:[function(e,t,r){var n=e("./_iterators"),o=e("./_wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./_iterators":41,"./_wks":71}],35:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],36:[function(e,t,r){var n=e("./_an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(i){var c=e["return"];throw void 0!==c&&n(c.call(e)),i}}},{"./_an-object":14}],37:[function(e,t,r){"use strict";var n=e("./_object-create"),o=e("./_property-desc"),i=e("./_set-to-string-tag"),c={};e("./_hide")(c,e("./_wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n(c,{next:o(1,r)}),i(e,t+" Iterator")}},{"./_hide":29,"./_object-create":44,"./_property-desc":53,"./_set-to-string-tag":58,"./_wks":71}],38:[function(e,t,r){"use strict";var n=e("./_library"),o=e("./_export"),i=e("./_redefine"),c=e("./_hide"),s=e("./_has"),u=e("./_iterators"),a=e("./_iter-create"),f=e("./_set-to-string-tag"),_=e("./_object-gpo"),l=e("./_wks")("iterator"),d=!([].keys&&"next"in[].keys()),p="@@iterator",v="keys",y="values",h=function(){return this};t.exports=function(e,t,r,b,m,g,j){a(r,t,b);var x,w,k,O=function(e){if(!d&&e in E)return E[e];switch(e){case v:return function(){return new r(this,e)};case y:return function(){return new r(this,e)}}return function(){return new r(this,e)}},M=t+" Iterator",P=m==y,S=!1,E=e.prototype,U=E[l]||E[p]||m&&E[m],T=U||O(m),R=m?P?O("entries"):T:void 0,L="Array"==t?E.entries||U:U;if(L&&(k=_(L.call(new e)),k!==Object.prototype&&(f(k,M,!0),n||s(k,l)||c(k,l,h))),P&&U&&U.name!==y&&(S=!0,T=function(){return U.call(this)}),n&&!j||!d&&!S&&E[l]||c(E,l,T),u[t]=T,u[M]=h,m)if(x={values:P?T:O(y),keys:g?T:O(v),entries:R},j)for(w in x)w in E||i(E,w,x[w]);else o(o.P+o.F*(d||S),t,x);return x}},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":37,"./_iterators":41,"./_library":42,"./_object-gpo":48,"./_redefine":55,"./_set-to-string-tag":58,"./_wks":71}],39:[function(e,t,r){var n=e("./_wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(c){}t.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],c=i[n]();c.next=function(){return{done:r=!0}},i[n]=function(){return c},e(i)}catch(s){}return r}},{"./_wks":71}],40:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],41:[function(e,t,r){t.exports={}},{}],42:[function(e,t,r){t.exports=!0},{}],43:[function(e,t,r){var n=e("./_global"),o=e("./_task").set,i=n.MutationObserver||n.WebKitMutationObserver,c=n.process,s=n.Promise,u="process"==e("./_cof")(c);t.exports=function(){var e,t,r,a=function(){var n,o;for(u&&(n=c.domain)&&n.exit();e;){o=e.fn,e=e.next;try{o()}catch(i){throw e?r():t=void 0,i}}t=void 0,n&&n.enter()};if(u)r=function(){c.nextTick(a)};else if(i){var f=!0,_=document.createTextNode("");new i(a).observe(_,{characterData:!0}),r=function(){_.data=f=!f}}else if(s&&s.resolve){var l=s.resolve();r=function(){l.then(a)}}else r=function(){o.call(n,a)};return function(n){var o={fn:n,next:void 0};t&&(t.next=o),e||(e=o,r()),t=o}}},{"./_cof":17,"./_global":27,"./_task":63}],44:[function(e,t,r){var n=e("./_an-object"),o=e("./_object-dps"),i=e("./_enum-bug-keys"),c=e("./_shared-key")("IE_PROTO"),s=function(){},u="prototype",a=function(){var t,r=e("./_dom-create")("iframe"),n=i.length,o=">";for(r.style.display="none",e("./_html").appendChild(r),r.src="javascript:",t=r.contentWindow.document,t.open(),t.write("<script>document.F=Object</script"+o),t.close(),a=t.F;n--;)delete a[u][i[n]];return a()};t.exports=Object.create||function(e,t){var r;return null!==e?(s[u]=n(e),r=new s,s[u]=null,r[c]=e):r=a(),void 0===t?r:o(r,t)}},{"./_an-object":14,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":46,"./_shared-key":59}],45:[function(e,t,r){var n=e("./_an-object"),o=e("./_ie8-dom-define"),i=e("./_to-primitive"),c=Object.defineProperty;r.f=e("./_descriptors")?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return c(e,t,r)}catch(s){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},{"./_an-object":14,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":69}],46:[function(e,t,r){var n=e("./_object-dp"),o=e("./_an-object"),i=e("./_object-keys");t.exports=e("./_descriptors")?Object.defineProperties:function(e,t){o(e);for(var r,c=i(t),s=c.length,u=0;s>u;)n.f(e,r=c[u++],t[r]);return e}},{"./_an-object":14,"./_descriptors":21,"./_object-dp":45,"./_object-keys":50}],47:[function(e,t,r){var n=e("./_object-pie"),o=e("./_property-desc"),i=e("./_to-iobject"),c=e("./_to-primitive"),s=e("./_has"),u=e("./_ie8-dom-define"),a=Object.getOwnPropertyDescriptor;r.f=e("./_descriptors")?a:function(e,t){if(e=i(e),t=c(t,!0),u)try{return a(e,t)}catch(r){}if(s(e,t))return o(!n.f.call(e,t),e[t])}},{"./_descriptors":21,"./_has":28,"./_ie8-dom-define":31,"./_object-pie":51,"./_property-desc":53,"./_to-iobject":66,"./_to-primitive":69}],48:[function(e,t,r){var n=e("./_has"),o=e("./_to-object"),i=e("./_shared-key")("IE_PROTO"),c=Object.prototype;t.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?c:null}},{"./_has":28,"./_shared-key":59,"./_to-object":68}],49:[function(e,t,r){var n=e("./_has"),o=e("./_to-iobject"),i=e("./_array-includes")(!1),c=e("./_shared-key")("IE_PROTO");t.exports=function(e,t){var r,s=o(e),u=0,a=[];for(r in s)r!=c&&n(s,r)&&a.push(r);for(;t.length>u;)n(s,r=t[u++])&&(~i(a,r)||a.push(r));return a}},{"./_array-includes":15,"./_has":28,"./_shared-key":59,"./_to-iobject":66}],50:[function(e,t,r){var n=e("./_object-keys-internal"),o=e("./_enum-bug-keys");t.exports=Object.keys||function(e){return n(e,o)}},{"./_enum-bug-keys":23,"./_object-keys-internal":49}],51:[function(e,t,r){r.f={}.propertyIsEnumerable},{}],52:[function(e,t,r){var n=e("./_export"),o=e("./_core"),i=e("./_fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],c={};c[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",c)}},{"./_core":18,"./_export":24,"./_fails":25}],53:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],54:[function(e,t,r){var n=e("./_hide");t.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},{"./_hide":29}],55:[function(e,t,r){t.exports=e("./_hide")},{"./_hide":29}],56:[function(e,t,r){var n=e("./_is-object"),o=e("./_an-object"),i=function(e,t){if(o(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,n){try{n=e("./_ctx")(Function.call,e("./_object-gopd").f(Object.prototype,"__proto__").set,2),n(t,[]),r=!(t instanceof Array)}catch(o){r=!0}return function(e,t){return i(e,t),r?e.__proto__=t:n(e,t),e}}({},!1):void 0),check:i}},{"./_an-object":14,"./_ctx":19,"./_is-object":35,"./_object-gopd":47}],57:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_core"),i=e("./_object-dp"),c=e("./_descriptors"),s=e("./_wks")("species");t.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];c&&t&&!t[s]&&i.f(t,s,{configurable:!0,get:function(){return this}})}},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":45,"./_wks":71}],58:[function(e,t,r){var n=e("./_object-dp").f,o=e("./_has"),i=e("./_wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./_has":28,"./_object-dp":45,"./_wks":71}],59:[function(e,t,r){var n=e("./_shared")("keys"),o=e("./_uid");t.exports=function(e){return n[e]||(n[e]=o(e))}},{"./_shared":60,"./_uid":70}],60:[function(e,t,r){var n=e("./_global"),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./_global":27}],61:[function(e,t,r){var n=e("./_an-object"),o=e("./_a-function"),i=e("./_wks")("species");t.exports=function(e,t){var r,c=n(e).constructor;return void 0===c||void 0==(r=n(c)[i])?t:o(r)}},{"./_a-function":11,"./_an-object":14,"./_wks":71}],62:[function(e,t,r){var n=e("./_to-integer"),o=e("./_defined");t.exports=function(e){return function(t,r){var i,c,s=String(o(t)),u=n(r),a=s.length;return u<0||u>=a?e?"":void 0:(i=s.charCodeAt(u),i<55296||i>56319||u+1===a||(c=s.charCodeAt(u+1))<56320||c>57343?e?s.charAt(u):i:e?s.slice(u,u+2):(i-55296<<10)+(c-56320)+65536)}}},{"./_defined":20,"./_to-integer":65}],63:[function(e,t,r){var n,o,i,c=e("./_ctx"),s=e("./_invoke"),u=e("./_html"),a=e("./_dom-create"),f=e("./_global"),_=f.process,l=f.setImmediate,d=f.clearImmediate,p=f.MessageChannel,v=0,y={},h="onreadystatechange",b=function(){var e=+this;if(y.hasOwnProperty(e)){var t=y[e];delete y[e],t()}},m=function(e){b.call(e.data)};l&&d||(l=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return y[++v]=function(){s("function"==typeof e?e:Function(e),t)},n(v),v},d=function(e){delete y[e]},"process"==e("./_cof")(_)?n=function(e){_.nextTick(c(b,e,1))}:p?(o=new p,i=o.port2,o.port1.onmessage=m,n=c(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",m,!1)):n=h in a("script")?function(e){u.appendChild(a("script"))[h]=function(){u.removeChild(this),b.call(e)}}:function(e){setTimeout(c(b,e,1),0)}),t.exports={set:l,clear:d}},{"./_cof":17,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],64:[function(e,t,r){var n=e("./_to-integer"),o=Math.max,i=Math.min;t.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},{"./_to-integer":65}],65:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],66:[function(e,t,r){var n=e("./_iobject"),o=e("./_defined");t.exports=function(e){return n(o(e))}},{"./_defined":20,"./_iobject":33}],67:[function(e,t,r){var n=e("./_to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./_to-integer":65}],68:[function(e,t,r){var n=e("./_defined");t.exports=function(e){return Object(n(e))}},{"./_defined":20}],69:[function(e,t,r){var n=e("./_is-object");t.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":35}],70:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],71:[function(e,t,r){var n=e("./_shared")("wks"),o=e("./_uid"),i=e("./_global").Symbol,c="function"==typeof i,s=t.exports=function(e){return n[e]||(n[e]=c&&i[e]||(c?i:o)("Symbol."+e))};s.store=n},{"./_global":27,"./_shared":60,"./_uid":70}],72:[function(e,t,r){var n=e("./_classof"),o=e("./_wks")("iterator"),i=e("./_iterators");t.exports=e("./_core").getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},{"./_classof":16,"./_core":18,"./_iterators":41,"./_wks":71}],73:[function(e,t,r){"use strict";var n=e("./_add-to-unscopables"),o=e("./_iter-step"),i=e("./_iterators"),c=e("./_to-iobject");t.exports=e("./_iter-define")(Array,"Array",function(e,t){this._t=c(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./_add-to-unscopables":12,"./_iter-define":38,"./_iter-step":40,"./_iterators":41,"./_to-iobject":66}],74:[function(e,t,r){var n=e("./_export");n(n.S+n.F*!e("./_descriptors"),"Object",{defineProperty:e("./_object-dp").f})},{"./_descriptors":21,"./_export":24,"./_object-dp":45}],75:[function(e,t,r){var n=e("./_to-object"),o=e("./_object-keys");e("./_object-sap")("keys",function(){return function(e){return o(n(e))}})},{"./_object-keys":50,"./_object-sap":52,"./_to-object":68}],76:[function(e,t,r){},{}],77:[function(e,t,r){"use strict";var n,o,i,c=e("./_library"),s=e("./_global"),u=e("./_ctx"),a=e("./_classof"),f=e("./_export"),_=e("./_is-object"),l=(e("./_an-object"),e("./_a-function")),d=e("./_an-instance"),p=e("./_for-of"),v=(e("./_set-proto").set,e("./_species-constructor")),y=e("./_task").set,h=e("./_microtask")(),b="Promise",m=s.TypeError,g=s.process,j=s[b],g=s.process,x="process"==a(g),w=function(){},k=!!function(){try{var t=j.resolve(1),r=(t.constructor={})[e("./_wks")("species")]=function(e){e(w,w)};return(x||"function"==typeof PromiseRejectionEvent)&&t.then(w)instanceof r}catch(n){}}(),O=function(e,t){return e===t||e===j&&t===i},M=function(e){var t;return!(!_(e)||"function"!=typeof(t=e.then))&&t},P=function(e){return O(j,e)?new S(e):new o(e)},S=o=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw m("Bad Promise constructor");t=e,r=n}),this.resolve=l(t),this.reject=l(r)},E=function(e){try{e()}catch(t){return{error:t}}},U=function(e,t){if(!e._n){e._n=!0;var r=e._c;h(function(){for(var n=e._v,o=1==e._s,i=0,c=function(t){var r,i,c=o?t.ok:t.fail,s=t.resolve,u=t.reject,a=t.domain;try{c?(o||(2==e._h&&L(e),e._h=1),c===!0?r=n:(a&&a.enter(),r=c(n),a&&a.exit()),r===t.promise?u(m("Promise-chain cycle")):(i=M(r))?i.call(r,s,u):s(r)):u(n)}catch(f){u(f)}};r.length>i;)c(r[i++]);e._c=[],e._n=!1,t&&!e._h&&T(e)})}},T=function(e){y.call(s,function(){var t,r,n,o=e._v;if(R(e)&&(t=E(function(){x?g.emit("unhandledRejection",o,e):(r=s.onunhandledrejection)?r({promise:e,reason:o}):(n=s.console)&&n.error&&n.error("Unhandled promise rejection",o)}),e._h=x||R(e)?2:1),e._a=void 0,t)throw t.error})},R=function(e){if(1==e._h)return!1;for(var t,r=e._a||e._c,n=0;r.length>n;)if(t=r[n++],t.fail||!R(t.promise))return!1;return!0},L=function(e){y.call(s,function(){var t;x?g.emit("rejectionHandled",e):(t=s.onrejectionhandled)&&t({promise:e,reason:e._v})})},A=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,t._v=e,t._s=2,t._a||(t._a=t._c.slice()),U(t,!0))},C=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===e)throw m("Promise can't be resolved itself");(t=M(e))?h(function(){var n={_w:r,_d:!1};try{t.call(e,u(C,n,1),u(A,n,1))}catch(o){A.call(n,o)}}):(r._v=e,r._s=1,U(r,!1))}catch(n){A.call({_w:r,_d:!1},n)}}};k||(j=function(e){d(this,j,b,"_h"),l(e),n.call(this);try{e(u(C,this,1),u(A,this,1))}catch(t){A.call(this,t)}},n=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},n.prototype=e("./_redefine-all")(j.prototype,{then:function(e,t){var r=P(v(this,j));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=x?g.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&U(this,!1),r.promise},"catch":function(e){return this.then(void 0,e)}}),S=function(){var e=new n;this.promise=e,this.resolve=u(C,e,1),this.reject=u(A,e,1)}),f(f.G+f.W+f.F*!k,{Promise:j}),e("./_set-to-string-tag")(j,b),e("./_set-species")(b),i=e("./_core")[b],f(f.S+f.F*!k,b,{reject:function(e){var t=P(this),r=t.reject;return r(e),t.promise}}),f(f.S+f.F*(c||!k),b,{resolve:function(e){if(e instanceof j&&O(e.constructor,this))return e;var t=P(this),r=t.resolve;return r(e),t.promise}}),f(f.S+f.F*!(k&&e("./_iter-detect")(function(e){j.all(e)["catch"](w)})),b,{all:function(e){var t=this,r=P(t),n=r.resolve,o=r.reject,i=E(function(){var r=[],i=0,c=1;p(e,!1,function(e){var s=i++,u=!1;r.push(void 0),c++,t.resolve(e).then(function(e){u||(u=!0,r[s]=e,--c||n(r))},o)}),--c||n(r)});return i&&o(i.error),r.promise},race:function(e){var t=this,r=P(t),n=r.reject,o=E(function(){p(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./_a-function":11,"./_an-instance":13,"./_an-object":14,"./_classof":16,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":35,"./_iter-detect":39,"./_library":42,"./_microtask":43,"./_redefine-all":54,"./_set-proto":56,"./_set-species":57,"./_set-to-string-tag":58,"./_species-constructor":61,"./_task":63,"./_wks":71}],78:[function(e,t,r){"use strict";var n=e("./_string-at")(!0);e("./_iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./_iter-define":38,"./_string-at":62}],79:[function(e,t,r){e("./es6.array.iterator");for(var n=e("./_global"),o=e("./_hide"),i=e("./_iterators"),c=e("./_wks")("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],u=0;u<5;u++){var a=s[u],f=n[a],_=f&&f.prototype;_&&!_[c]&&o(_,c,a),i[a]=i.Array}},{"./_global":27,"./_hide":29,"./_iterators":41,"./_wks":71,"./es6.array.iterator":73}],80:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("./hyperty-discovery/HypertyDiscovery"),i=n(o);r["default"]=i["default"],t.exports=r["default"]},{"./hyperty-discovery/HypertyDiscovery":81}],81:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),c=e("babel-runtime/helpers/classCallCheck"),s=n(c),u=e("babel-runtime/helpers/createClass"),a=n(u),f=e("../utils/utils"),_=function(){function e(t,r){(0,s["default"])(this,e);var n=this;n.messageBus=r,n.domain=(0,f.divideURL)(t).domain,n.discoveryURL=t}return(0,a["default"])(e,[{key:"discoverDataObjectPerName",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:"dataObject://"+e}};return new i["default"](function(e,t){r.messageBus.postMessage(o,function(r){var n=r.body.value.url;n?e(n):t("DataObject name does not exist")})})}},{key:"discoverHypertyPerUser",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),c={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:o}};return console.log("Message: ",c,n,o),new i["default"](function(t,n){r.messageBus.postMessage(c,function(r){console.log("message reply",r);var o=void 0,i=void 0,c=void 0,s=r.body.value;for(o in s)if(void 0!==s[o].lastModified)if(void 0===i)i=new Date(s[o].lastModified),c=o;else{var u=new Date(s[o].lastModified);i.getTime()<u.getTime()&&(i=u,c=o)}console.log("Last Hyperty: ",c,i);var a=c;if(void 0===a)return n("User Hyperty not found");var f={id:e,descriptor:s[a].descriptor,hypertyURL:a};console.log("===> hypertyDiscovery messageBundle: ",f),t(f)})})}},{key:"discoverHypertiesPerUser",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),c={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:o}};return console.log("Message discoverHypertiesPerUser: ",c,n,o),new i["default"](function(e,t){r.messageBus.postMessage(c,function(r){console.log("discoverHypertiesPerUser reply",r);var n=r.body.value;return n?void e(n):t("User Hyperty not found")})})}}]),e}();r["default"]=_,t.exports=r["default"]},{"../utils/utils":82,"babel-runtime/core-js/promise":4,"babel-runtime/helpers/classCallCheck":5,"babel-runtime/helpers/createClass":6}],82:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=e.replace(t,r).split(",");n[0]===e&&(n[0]="https",n[1]=e);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function c(e){return!((0,p["default"])(e).length>0)}function s(e){if(e)return JSON.parse((0,l["default"])(e))}function u(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function a(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function f(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return u(e)}Object.defineProperty(r,"__esModule",{value:!0});var _=e("babel-runtime/core-js/json/stringify"),l=n(_),d=e("babel-runtime/core-js/object/keys"),p=n(d);r.divideURL=o,r.divideEmail=i,r.emptyObject=c,r.deepClone=s,r.getUserURLFromEmail=u,r.getUserEmailFromURL=a,r.convertToUserURL=f},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":3}]},{},[80])(80)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Distribution file for IdentityManager.js 
// version: 0.3.0
// Last build: Wed Jun 29 2016 18:18:30 GMT+0100 (WEST)

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.IdentityManager=t()}}(function(){return function t(e,r,n){function o(c,s){if(!r[c]){if(!e[c]){var u="function"==typeof require&&require;if(!s&&u)return u(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var f=r[c]={exports:{}};e[c][0].call(f.exports,function(t){var r=e[c][1][t];return o(r?r:t)},f,f.exports,t,e,r,n)}return r[c].exports}for(var i="function"==typeof require&&require,c=0;c<n.length;c++)o(n[c]);return o}({1:[function(t,e,r){e.exports={"default":t("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":7}],2:[function(t,e,r){e.exports={"default":t("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":8}],3:[function(t,e,r){e.exports={"default":t("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":9}],4:[function(t,e,r){e.exports={"default":t("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":10}],5:[function(t,e,r){"use strict";r.__esModule=!0,r["default"]=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},{}],6:[function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}r.__esModule=!0;var o=t("../core-js/object/define-property"),i=n(o);r["default"]=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}()},{"../core-js/object/define-property":2}],7:[function(t,e,r){var n=t("../../modules/_core"),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(t){return o.stringify.apply(o,arguments)}},{"../../modules/_core":18}],8:[function(t,e,r){t("../../modules/es6.object.define-property");var n=t("../../modules/_core").Object;e.exports=function(t,e,r){return n.defineProperty(t,e,r)}},{"../../modules/_core":18,"../../modules/es6.object.define-property":74}],9:[function(t,e,r){t("../../modules/es6.object.keys"),e.exports=t("../../modules/_core").Object.keys},{"../../modules/_core":18,"../../modules/es6.object.keys":75}],10:[function(t,e,r){t("../modules/es6.object.to-string"),t("../modules/es6.string.iterator"),t("../modules/web.dom.iterable"),t("../modules/es6.promise"),e.exports=t("../modules/_core").Promise},{"../modules/_core":18,"../modules/es6.object.to-string":76,"../modules/es6.promise":77,"../modules/es6.string.iterator":78,"../modules/web.dom.iterable":79}],11:[function(t,e,r){e.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},{}],12:[function(t,e,r){e.exports=function(){}},{}],13:[function(t,e,r){e.exports=function(t,e,r,n){if(!(t instanceof e)||void 0!==n&&n in t)throw TypeError(r+": incorrect invocation!");return t}},{}],14:[function(t,e,r){var n=t("./_is-object");e.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},{"./_is-object":35}],15:[function(t,e,r){var n=t("./_to-iobject"),o=t("./_to-length"),i=t("./_to-index");e.exports=function(t){return function(e,r,c){var s,u=n(e),a=o(u.length),f=i(c,a);if(t&&r!=r){for(;a>f;)if(s=u[f++],s!=s)return!0}else for(;a>f;f++)if((t||f in u)&&u[f]===r)return t||f||0;return!t&&-1}}},{"./_to-index":64,"./_to-iobject":66,"./_to-length":67}],16:[function(t,e,r){var n=t("./_cof"),o=t("./_wks")("toStringTag"),i="Arguments"==n(function(){return arguments}()),c=function(t,e){try{return t[e]}catch(r){}};e.exports=function(t){var e,r,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=c(e=Object(t),o))?r:i?n(e):"Object"==(s=n(e))&&"function"==typeof e.callee?"Arguments":s}},{"./_cof":17,"./_wks":71}],17:[function(t,e,r){var n={}.toString;e.exports=function(t){return n.call(t).slice(8,-1)}},{}],18:[function(t,e,r){var n=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},{}],19:[function(t,e,r){var n=t("./_a-function");e.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},{"./_a-function":11}],20:[function(t,e,r){e.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},{}],21:[function(t,e,r){e.exports=!t("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":25}],22:[function(t,e,r){var n=t("./_is-object"),o=t("./_global").document,i=n(o)&&n(o.createElement);e.exports=function(t){return i?o.createElement(t):{}}},{"./_global":27,"./_is-object":35}],23:[function(t,e,r){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],24:[function(t,e,r){var n=t("./_global"),o=t("./_core"),i=t("./_ctx"),c=t("./_hide"),s="prototype",u=function(t,e,r){var a,f,_,l=t&u.F,p=t&u.G,d=t&u.S,h=t&u.P,v=t&u.B,b=t&u.W,y=p?o:o[e]||(o[e]={}),m=y[s],j=p?n:d?n[e]:(n[e]||{})[s];p&&(r=e);for(a in r)f=!l&&j&&void 0!==j[a],f&&a in y||(_=f?j[a]:r[a],y[a]=p&&"function"!=typeof j[a]?r[a]:v&&f?i(_,n):b&&j[a]==_?function(t){var e=function(e,r,n){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,r)}return new t(e,r,n)}return t.apply(this,arguments)};return e[s]=t[s],e}(_):h&&"function"==typeof _?i(Function.call,_):_,h&&((y.virtual||(y.virtual={}))[a]=_,t&u.R&&m&&!m[a]&&c(m,a,_)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,e.exports=u},{"./_core":18,"./_ctx":19,"./_global":27,"./_hide":29}],25:[function(t,e,r){e.exports=function(t){try{return!!t()}catch(e){return!0}}},{}],26:[function(t,e,r){var n=t("./_ctx"),o=t("./_iter-call"),i=t("./_is-array-iter"),c=t("./_an-object"),s=t("./_to-length"),u=t("./core.get-iterator-method"),a={},f={},r=e.exports=function(t,e,r,_,l){var p,d,h,v,b=l?function(){return t}:u(t),y=n(r,_,e?2:1),m=0;if("function"!=typeof b)throw TypeError(t+" is not iterable!");if(i(b)){for(p=s(t.length);p>m;m++)if(v=e?y(c(d=t[m])[0],d[1]):y(t[m]),v===a||v===f)return v}else for(h=b.call(t);!(d=h.next()).done;)if(v=o(h,y,d.value,e),v===a||v===f)return v};r.BREAK=a,r.RETURN=f},{"./_an-object":14,"./_ctx":19,"./_is-array-iter":34,"./_iter-call":36,"./_to-length":67,"./core.get-iterator-method":72}],27:[function(t,e,r){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],28:[function(t,e,r){var n={}.hasOwnProperty;e.exports=function(t,e){return n.call(t,e)}},{}],29:[function(t,e,r){var n=t("./_object-dp"),o=t("./_property-desc");e.exports=t("./_descriptors")?function(t,e,r){return n.f(t,e,o(1,r))}:function(t,e,r){return t[e]=r,t}},{"./_descriptors":21,"./_object-dp":45,"./_property-desc":53}],30:[function(t,e,r){e.exports=t("./_global").document&&document.documentElement},{"./_global":27}],31:[function(t,e,r){e.exports=!t("./_descriptors")&&!t("./_fails")(function(){return 7!=Object.defineProperty(t("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":21,"./_dom-create":22,"./_fails":25}],32:[function(t,e,r){e.exports=function(t,e,r){var n=void 0===r;switch(e.length){case 0:return n?t():t.call(r);case 1:return n?t(e[0]):t.call(r,e[0]);case 2:return n?t(e[0],e[1]):t.call(r,e[0],e[1]);case 3:return n?t(e[0],e[1],e[2]):t.call(r,e[0],e[1],e[2]);case 4:return n?t(e[0],e[1],e[2],e[3]):t.call(r,e[0],e[1],e[2],e[3])}return t.apply(r,e)}},{}],33:[function(t,e,r){var n=t("./_cof");e.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)}},{"./_cof":17}],34:[function(t,e,r){var n=t("./_iterators"),o=t("./_wks")("iterator"),i=Array.prototype;e.exports=function(t){return void 0!==t&&(n.Array===t||i[o]===t)}},{"./_iterators":41,"./_wks":71}],35:[function(t,e,r){e.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},{}],36:[function(t,e,r){var n=t("./_an-object");e.exports=function(t,e,r,o){try{return o?e(n(r)[0],r[1]):e(r)}catch(i){var c=t["return"];throw void 0!==c&&n(c.call(t)),i}}},{"./_an-object":14}],37:[function(t,e,r){"use strict";var n=t("./_object-create"),o=t("./_property-desc"),i=t("./_set-to-string-tag"),c={};t("./_hide")(c,t("./_wks")("iterator"),function(){return this}),e.exports=function(t,e,r){t.prototype=n(c,{next:o(1,r)}),i(t,e+" Iterator")}},{"./_hide":29,"./_object-create":44,"./_property-desc":53,"./_set-to-string-tag":58,"./_wks":71}],38:[function(t,e,r){"use strict";var n=t("./_library"),o=t("./_export"),i=t("./_redefine"),c=t("./_hide"),s=t("./_has"),u=t("./_iterators"),a=t("./_iter-create"),f=t("./_set-to-string-tag"),_=t("./_object-gpo"),l=t("./_wks")("iterator"),p=!([].keys&&"next"in[].keys()),d="@@iterator",h="keys",v="values",b=function(){return this};e.exports=function(t,e,r,y,m,j,g){a(r,e,y);var x,w,k,O=function(t){if(!p&&t in P)return P[t];switch(t){case h:return function(){return new r(this,t)};case v:return function(){return new r(this,t)}}return function(){return new r(this,t)}},M=e+" Iterator",S=m==v,E=!1,P=t.prototype,T=P[l]||P[d]||m&&P[m],R=T||O(m),U=m?S?O("entries"):R:void 0,A="Array"==e?P.entries||T:T;if(A&&(k=_(A.call(new t)),k!==Object.prototype&&(f(k,M,!0),n||s(k,l)||c(k,l,b))),S&&T&&T.name!==v&&(E=!0,R=function(){return T.call(this)}),n&&!g||!p&&!E&&P[l]||c(P,l,R),u[e]=R,u[M]=b,m)if(x={values:S?R:O(v),keys:j?R:O(h),entries:U},g)for(w in x)w in P||i(P,w,x[w]);else o(o.P+o.F*(p||E),e,x);return x}},{"./_export":24,"./_has":28,"./_hide":29,"./_iter-create":37,"./_iterators":41,"./_library":42,"./_object-gpo":48,"./_redefine":55,"./_set-to-string-tag":58,"./_wks":71}],39:[function(t,e,r){var n=t("./_wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(c){}e.exports=function(t,e){if(!e&&!o)return!1;var r=!1;try{var i=[7],c=i[n]();c.next=function(){return{done:r=!0}},i[n]=function(){return c},t(i)}catch(s){}return r}},{"./_wks":71}],40:[function(t,e,r){e.exports=function(t,e){return{value:e,done:!!t}}},{}],41:[function(t,e,r){e.exports={}},{}],42:[function(t,e,r){e.exports=!0},{}],43:[function(t,e,r){var n=t("./_global"),o=t("./_task").set,i=n.MutationObserver||n.WebKitMutationObserver,c=n.process,s=n.Promise,u="process"==t("./_cof")(c);e.exports=function(){var t,e,r,a=function(){var n,o;for(u&&(n=c.domain)&&n.exit();t;){o=t.fn,t=t.next;try{o()}catch(i){throw t?r():e=void 0,i}}e=void 0,n&&n.enter()};if(u)r=function(){c.nextTick(a)};else if(i){var f=!0,_=document.createTextNode("");new i(a).observe(_,{characterData:!0}),r=function(){_.data=f=!f}}else if(s&&s.resolve){var l=s.resolve();r=function(){l.then(a)}}else r=function(){o.call(n,a)};return function(n){var o={fn:n,next:void 0};e&&(e.next=o),t||(t=o,r()),e=o}}},{"./_cof":17,"./_global":27,"./_task":63}],44:[function(t,e,r){var n=t("./_an-object"),o=t("./_object-dps"),i=t("./_enum-bug-keys"),c=t("./_shared-key")("IE_PROTO"),s=function(){},u="prototype",a=function(){var e,r=t("./_dom-create")("iframe"),n=i.length,o=">";for(r.style.display="none",t("./_html").appendChild(r),r.src="javascript:",e=r.contentWindow.document,e.open(),e.write("<script>document.F=Object</script"+o),e.close(),a=e.F;n--;)delete a[u][i[n]];return a()};e.exports=Object.create||function(t,e){var r;return null!==t?(s[u]=n(t),r=new s,s[u]=null,r[c]=t):r=a(),void 0===e?r:o(r,e)}},{"./_an-object":14,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":30,"./_object-dps":46,"./_shared-key":59}],45:[function(t,e,r){var n=t("./_an-object"),o=t("./_ie8-dom-define"),i=t("./_to-primitive"),c=Object.defineProperty;r.f=t("./_descriptors")?Object.defineProperty:function(t,e,r){if(n(t),e=i(e,!0),n(r),o)try{return c(t,e,r)}catch(s){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[e]=r.value),t}},{"./_an-object":14,"./_descriptors":21,"./_ie8-dom-define":31,"./_to-primitive":69}],46:[function(t,e,r){var n=t("./_object-dp"),o=t("./_an-object"),i=t("./_object-keys");e.exports=t("./_descriptors")?Object.defineProperties:function(t,e){o(t);for(var r,c=i(e),s=c.length,u=0;s>u;)n.f(t,r=c[u++],e[r]);return t}},{"./_an-object":14,"./_descriptors":21,"./_object-dp":45,"./_object-keys":50}],47:[function(t,e,r){var n=t("./_object-pie"),o=t("./_property-desc"),i=t("./_to-iobject"),c=t("./_to-primitive"),s=t("./_has"),u=t("./_ie8-dom-define"),a=Object.getOwnPropertyDescriptor;r.f=t("./_descriptors")?a:function(t,e){if(t=i(t),e=c(e,!0),u)try{return a(t,e)}catch(r){}if(s(t,e))return o(!n.f.call(t,e),t[e])}},{"./_descriptors":21,"./_has":28,"./_ie8-dom-define":31,"./_object-pie":51,"./_property-desc":53,"./_to-iobject":66,"./_to-primitive":69}],48:[function(t,e,r){var n=t("./_has"),o=t("./_to-object"),i=t("./_shared-key")("IE_PROTO"),c=Object.prototype;e.exports=Object.getPrototypeOf||function(t){return t=o(t),n(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?c:null}},{"./_has":28,"./_shared-key":59,"./_to-object":68}],49:[function(t,e,r){var n=t("./_has"),o=t("./_to-iobject"),i=t("./_array-includes")(!1),c=t("./_shared-key")("IE_PROTO");e.exports=function(t,e){var r,s=o(t),u=0,a=[];for(r in s)r!=c&&n(s,r)&&a.push(r);for(;e.length>u;)n(s,r=e[u++])&&(~i(a,r)||a.push(r));return a}},{"./_array-includes":15,"./_has":28,"./_shared-key":59,"./_to-iobject":66}],50:[function(t,e,r){var n=t("./_object-keys-internal"),o=t("./_enum-bug-keys");e.exports=Object.keys||function(t){return n(t,o)}},{"./_enum-bug-keys":23,"./_object-keys-internal":49}],51:[function(t,e,r){r.f={}.propertyIsEnumerable},{}],52:[function(t,e,r){var n=t("./_export"),o=t("./_core"),i=t("./_fails");e.exports=function(t,e){var r=(o.Object||{})[t]||Object[t],c={};c[t]=e(r),n(n.S+n.F*i(function(){r(1)}),"Object",c)}},{"./_core":18,"./_export":24,"./_fails":25}],53:[function(t,e,r){e.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},{}],54:[function(t,e,r){var n=t("./_hide");e.exports=function(t,e,r){for(var o in e)r&&t[o]?t[o]=e[o]:n(t,o,e[o]);return t}},{"./_hide":29}],55:[function(t,e,r){e.exports=t("./_hide")},{"./_hide":29}],56:[function(t,e,r){var n=t("./_is-object"),o=t("./_an-object"),i=function(t,e){if(o(t),!n(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,r,n){try{n=t("./_ctx")(Function.call,t("./_object-gopd").f(Object.prototype,"__proto__").set,2),n(e,[]),r=!(e instanceof Array)}catch(o){r=!0}return function(t,e){return i(t,e),r?t.__proto__=e:n(t,e),t}}({},!1):void 0),check:i}},{"./_an-object":14,"./_ctx":19,"./_is-object":35,"./_object-gopd":47}],57:[function(t,e,r){"use strict";var n=t("./_global"),o=t("./_core"),i=t("./_object-dp"),c=t("./_descriptors"),s=t("./_wks")("species");e.exports=function(t){var e="function"==typeof o[t]?o[t]:n[t];c&&e&&!e[s]&&i.f(e,s,{configurable:!0,get:function(){return this}})}},{"./_core":18,"./_descriptors":21,"./_global":27,"./_object-dp":45,"./_wks":71}],58:[function(t,e,r){var n=t("./_object-dp").f,o=t("./_has"),i=t("./_wks")("toStringTag");e.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,i)&&n(t,i,{configurable:!0,value:e})}},{"./_has":28,"./_object-dp":45,"./_wks":71}],59:[function(t,e,r){var n=t("./_shared")("keys"),o=t("./_uid");e.exports=function(t){return n[t]||(n[t]=o(t))}},{"./_shared":60,"./_uid":70}],60:[function(t,e,r){var n=t("./_global"),o="__core-js_shared__",i=n[o]||(n[o]={});e.exports=function(t){return i[t]||(i[t]={})}},{"./_global":27}],61:[function(t,e,r){var n=t("./_an-object"),o=t("./_a-function"),i=t("./_wks")("species");e.exports=function(t,e){var r,c=n(t).constructor;return void 0===c||void 0==(r=n(c)[i])?e:o(r)}},{"./_a-function":11,"./_an-object":14,"./_wks":71}],62:[function(t,e,r){var n=t("./_to-integer"),o=t("./_defined");e.exports=function(t){return function(e,r){var i,c,s=String(o(e)),u=n(r),a=s.length;return u<0||u>=a?t?"":void 0:(i=s.charCodeAt(u),i<55296||i>56319||u+1===a||(c=s.charCodeAt(u+1))<56320||c>57343?t?s.charAt(u):i:t?s.slice(u,u+2):(i-55296<<10)+(c-56320)+65536)}}},{"./_defined":20,"./_to-integer":65}],63:[function(t,e,r){var n,o,i,c=t("./_ctx"),s=t("./_invoke"),u=t("./_html"),a=t("./_dom-create"),f=t("./_global"),_=f.process,l=f.setImmediate,p=f.clearImmediate,d=f.MessageChannel,h=0,v={},b="onreadystatechange",y=function(){var t=+this;if(v.hasOwnProperty(t)){var e=v[t];delete v[t],e()}},m=function(t){y.call(t.data)};l&&p||(l=function(t){for(var e=[],r=1;arguments.length>r;)e.push(arguments[r++]);return v[++h]=function(){s("function"==typeof t?t:Function(t),e)},n(h),h},p=function(t){delete v[t]},"process"==t("./_cof")(_)?n=function(t){_.nextTick(c(y,t,1))}:d?(o=new d,i=o.port2,o.port1.onmessage=m,n=c(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(t){f.postMessage(t+"","*")},f.addEventListener("message",m,!1)):n=b in a("script")?function(t){u.appendChild(a("script"))[b]=function(){u.removeChild(this),y.call(t)}}:function(t){setTimeout(c(y,t,1),0)}),e.exports={set:l,clear:p}},{"./_cof":17,"./_ctx":19,"./_dom-create":22,"./_global":27,"./_html":30,"./_invoke":32}],64:[function(t,e,r){var n=t("./_to-integer"),o=Math.max,i=Math.min;e.exports=function(t,e){return t=n(t),t<0?o(t+e,0):i(t,e)}},{"./_to-integer":65}],65:[function(t,e,r){var n=Math.ceil,o=Math.floor;e.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},{}],66:[function(t,e,r){var n=t("./_iobject"),o=t("./_defined");e.exports=function(t){return n(o(t))}},{"./_defined":20,"./_iobject":33}],67:[function(t,e,r){var n=t("./_to-integer"),o=Math.min;e.exports=function(t){return t>0?o(n(t),9007199254740991):0}},{"./_to-integer":65}],68:[function(t,e,r){var n=t("./_defined");e.exports=function(t){return Object(n(t))}},{"./_defined":20}],69:[function(t,e,r){var n=t("./_is-object");e.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":35}],70:[function(t,e,r){var n=0,o=Math.random();e.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+o).toString(36))}},{}],71:[function(t,e,r){var n=t("./_shared")("wks"),o=t("./_uid"),i=t("./_global").Symbol,c="function"==typeof i,s=e.exports=function(t){return n[t]||(n[t]=c&&i[t]||(c?i:o)("Symbol."+t))};s.store=n},{"./_global":27,"./_shared":60,"./_uid":70}],72:[function(t,e,r){var n=t("./_classof"),o=t("./_wks")("iterator"),i=t("./_iterators");e.exports=t("./_core").getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[n(t)]}},{"./_classof":16,"./_core":18,"./_iterators":41,"./_wks":71}],73:[function(t,e,r){"use strict";var n=t("./_add-to-unscopables"),o=t("./_iter-step"),i=t("./_iterators"),c=t("./_to-iobject");e.exports=t("./_iter-define")(Array,"Array",function(t,e){this._t=c(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,r):"values"==e?o(0,t[r]):o(0,[r,t[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./_add-to-unscopables":12,"./_iter-define":38,"./_iter-step":40,"./_iterators":41,"./_to-iobject":66}],74:[function(t,e,r){var n=t("./_export");n(n.S+n.F*!t("./_descriptors"),"Object",{defineProperty:t("./_object-dp").f})},{"./_descriptors":21,"./_export":24,"./_object-dp":45}],75:[function(t,e,r){var n=t("./_to-object"),o=t("./_object-keys");t("./_object-sap")("keys",function(){return function(t){return o(n(t))}})},{"./_object-keys":50,"./_object-sap":52,"./_to-object":68}],76:[function(t,e,r){},{}],77:[function(t,e,r){"use strict";var n,o,i,c=t("./_library"),s=t("./_global"),u=t("./_ctx"),a=t("./_classof"),f=t("./_export"),_=t("./_is-object"),l=(t("./_an-object"),t("./_a-function")),p=t("./_an-instance"),d=t("./_for-of"),h=(t("./_set-proto").set,t("./_species-constructor")),v=t("./_task").set,b=t("./_microtask")(),y="Promise",m=s.TypeError,j=s.process,g=s[y],j=s.process,x="process"==a(j),w=function(){},k=!!function(){try{var e=g.resolve(1),r=(e.constructor={})[t("./_wks")("species")]=function(t){t(w,w)};return(x||"function"==typeof PromiseRejectionEvent)&&e.then(w)instanceof r}catch(n){}}(),O=function(t,e){return t===e||t===g&&e===i},M=function(t){var e;return!(!_(t)||"function"!=typeof(e=t.then))&&e},S=function(t){return O(g,t)?new E(t):new o(t)},E=o=function(t){var e,r;this.promise=new t(function(t,n){if(void 0!==e||void 0!==r)throw m("Bad Promise constructor");e=t,r=n}),this.resolve=l(e),this.reject=l(r)},P=function(t){try{t()}catch(e){return{error:e}}},T=function(t,e){if(!t._n){t._n=!0;var r=t._c;b(function(){for(var n=t._v,o=1==t._s,i=0,c=function(e){var r,i,c=o?e.ok:e.fail,s=e.resolve,u=e.reject,a=e.domain;try{c?(o||(2==t._h&&A(t),t._h=1),c===!0?r=n:(a&&a.enter(),r=c(n),a&&a.exit()),r===e.promise?u(m("Promise-chain cycle")):(i=M(r))?i.call(r,s,u):s(r)):u(n)}catch(f){u(f)}};r.length>i;)c(r[i++]);t._c=[],t._n=!1,e&&!t._h&&R(t)})}},R=function(t){v.call(s,function(){var e,r,n,o=t._v;if(U(t)&&(e=P(function(){x?j.emit("unhandledRejection",o,t):(r=s.onunhandledrejection)?r({promise:t,reason:o}):(n=s.console)&&n.error&&n.error("Unhandled promise rejection",o)}),t._h=x||U(t)?2:1),t._a=void 0,e)throw e.error})},U=function(t){if(1==t._h)return!1;for(var e,r=t._a||t._c,n=0;r.length>n;)if(e=r[n++],e.fail||!U(e.promise))return!1;return!0},A=function(t){v.call(s,function(){var e;x?j.emit("rejectionHandled",t):(e=s.onrejectionhandled)&&e({promise:t,reason:t._v})})},L=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),T(e,!0))},C=function(t){var e,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===t)throw m("Promise can't be resolved itself");(e=M(t))?b(function(){var n={_w:r,_d:!1};try{e.call(t,u(C,n,1),u(L,n,1))}catch(o){L.call(n,o)}}):(r._v=t,r._s=1,T(r,!1))}catch(n){L.call({_w:r,_d:!1},n)}}};k||(g=function(t){p(this,g,y,"_h"),l(t),n.call(this);try{t(u(C,this,1),u(L,this,1))}catch(e){L.call(this,e)}},n=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},n.prototype=t("./_redefine-all")(g.prototype,{then:function(t,e){var r=S(h(this,g));return r.ok="function"!=typeof t||t,r.fail="function"==typeof e&&e,r.domain=x?j.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&T(this,!1),r.promise},"catch":function(t){return this.then(void 0,t)}}),E=function(){var t=new n;this.promise=t,this.resolve=u(C,t,1),this.reject=u(L,t,1)}),f(f.G+f.W+f.F*!k,{Promise:g}),t("./_set-to-string-tag")(g,y),t("./_set-species")(y),i=t("./_core")[y],f(f.S+f.F*!k,y,{reject:function(t){var e=S(this),r=e.reject;return r(t),e.promise}}),f(f.S+f.F*(c||!k),y,{resolve:function(t){if(t instanceof g&&O(t.constructor,this))return t;var e=S(this),r=e.resolve;return r(t),e.promise}}),f(f.S+f.F*!(k&&t("./_iter-detect")(function(t){g.all(t)["catch"](w)})),y,{all:function(t){var e=this,r=S(e),n=r.resolve,o=r.reject,i=P(function(){var r=[],i=0,c=1;d(t,!1,function(t){var s=i++,u=!1;r.push(void 0),c++,e.resolve(t).then(function(t){u||(u=!0,r[s]=t,--c||n(r))},o)}),--c||n(r)});return i&&o(i.error),r.promise},race:function(t){var e=this,r=S(e),n=r.reject,o=P(function(){d(t,!1,function(t){e.resolve(t).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./_a-function":11,"./_an-instance":13,"./_an-object":14,"./_classof":16,"./_core":18,"./_ctx":19,"./_export":24,"./_for-of":26,"./_global":27,"./_is-object":35,"./_iter-detect":39,"./_library":42,"./_microtask":43,"./_redefine-all":54,"./_set-proto":56,"./_set-species":57,"./_set-to-string-tag":58,"./_species-constructor":61,"./_task":63,"./_wks":71}],78:[function(t,e,r){"use strict";var n=t("./_string-at")(!0);t("./_iter-define")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,r=this._i;return r>=e.length?{value:void 0,done:!0}:(t=n(e,r),this._i+=t.length,{value:t,done:!1})})},{"./_iter-define":38,"./_string-at":62}],79:[function(t,e,r){t("./es6.array.iterator");for(var n=t("./_global"),o=t("./_hide"),i=t("./_iterators"),c=t("./_wks")("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],u=0;u<5;u++){var a=s[u],f=n[a],_=f&&f.prototype;_&&!_[c]&&o(_,c,a),i[a]=i.Array}},{"./_global":27,"./_hide":29,"./_iterators":41,"./_wks":71,"./es6.array.iterator":73}],80:[function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(r,"__esModule",{value:!0});var o=t("babel-runtime/core-js/promise"),i=n(o),c=t("babel-runtime/helpers/classCallCheck"),s=n(c),u=t("babel-runtime/helpers/createClass"),a=n(u),f=t("../utils/utils"),_=function(){function t(e,r,n){(0,s["default"])(this,t);var o=this;o.messageBus=n,o.domain=(0,f.divideURL)(e).domain,o.hypertyURL=e,o.runtimeURL=r}return(0,a["default"])(t,[{key:"discoverUserRegistered",value:function(t,e){var r=this,n=void 0,o=t?t:".";n=e?e:r.hypertyURL;var c={type:"read",from:n,to:r.runtimeURL+"/registry/",body:{resource:o,criteria:n}};return new i["default"](function(t,e){r.messageBus.postMessage(c,function(r){var n=r.body.resource;n?t(n):e("No user was not found")})})}}]),t}();r["default"]=_,e.exports=r["default"]},{"../utils/utils":81,"babel-runtime/core-js/promise":4,"babel-runtime/helpers/classCallCheck":5,"babel-runtime/helpers/createClass":6}],81:[function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t){if(!t)throw Error("URL is needed to split");var e=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=t.replace(e,r).split(",");n[0]===t&&(n[0]="https",n[1]=t);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(t){var e=t.indexOf("@"),r={username:t.substring(0,e),domain:t.substring(e+1,t.length)};return r}function c(t){return!((0,d["default"])(t).length>0)}function s(t){if(t)return JSON.parse((0,l["default"])(t))}function u(t){var e=t.indexOf("@");return"user://"+t.substring(e+1,t.length)+"/"+t.substring(0,e)}function a(t){var e=o(t);return e.identity.replace("/","")+"@"+e.domain}function f(t){if("user://"===t.substring(0,7)){var e=o(t);if(e.domain&&e.identity)return t;throw"userURL with wrong format"}return u(t)}Object.defineProperty(r,"__esModule",{value:!0});var _=t("babel-runtime/core-js/json/stringify"),l=n(_),p=t("babel-runtime/core-js/object/keys"),d=n(p);r.divideURL=o,r.divideEmail=i,r.emptyObject=c,r.deepClone=s,r.getUserURLFromEmail=u,r.getUserEmailFromURL=a,r.convertToUserURL=f},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":3}]},{},[80])(80)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Distribution file for Syncher.js 
// version: 0.3.0
// Last build: Wed Jun 29 2016 18:18:39 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Syncher=e()}}(function(){return function e(t,r,n){function o(s,c){if(!r[s]){if(!t[s]){var a="function"==typeof require&&require;if(!c&&a)return a(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var l=r[s]={exports:{}};t[s][0].call(l.exports,function(e){var r=t[s][1][e];return o(r?r:e)},l,l.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,t,r){Object.observe&&!Array.observe&&function(e,t){"use strict";var r=e.getNotifier,n="performChange",o="_original",i="splice",s={push:function a(e){var t=arguments,s=a[o].apply(this,t);return r(this)[n](i,function(){return{index:s-t.length,addedCount:t.length,removed:[]}}),s},unshift:function u(e){var t=arguments,s=u[o].apply(this,t);return r(this)[n](i,function(){return{index:0,addedCount:t.length,removed:[]}}),s},pop:function l(){var e=this.length,t=l[o].call(this);return this.length!==e&&r(this)[n](i,function(){return{index:this.length,addedCount:0,removed:[t]}},this),t},shift:function f(){var e=this.length,t=f[o].call(this);return this.length!==e&&r(this)[n](i,function(){return{index:0,addedCount:0,removed:[t]}},this),t},splice:function d(e,t){var s=arguments,c=d[o].apply(this,s);return(c.length||s.length>2)&&r(this)[n](i,function(){return{index:e,addedCount:s.length-2,removed:c}},this),c}};for(var c in s)s[c][o]=t.prototype[c],t.prototype[c]=s[c];t.observe=function(t,r){return e.observe(t,r,["add","update","delete",i])},t.unobserve=e.unobserve}(Object,Array)},{}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":18}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/create"),__esModule:!0}},{"core-js/library/fn/object/create":19}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":20}],5:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/get-own-property-descriptor"),__esModule:!0}},{"core-js/library/fn/object/get-own-property-descriptor":21}],6:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/get-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/get-prototype-of":22}],7:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":23}],8:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/set-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/set-prototype-of":24}],9:[function(e,t,r){t.exports={"default":e("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":25}],10:[function(e,t,r){t.exports={"default":e("core-js/library/fn/symbol"),__esModule:!0}},{"core-js/library/fn/symbol":26}],11:[function(e,t,r){t.exports={"default":e("core-js/library/fn/symbol/iterator"),__esModule:!0}},{"core-js/library/fn/symbol/iterator":27}],12:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],13:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/define-property"),i=n(o);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":4}],14:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/get-prototype-of"),i=n(o),s=e("../core-js/object/get-own-property-descriptor"),c=n(s);r["default"]=function a(e,t,r){null===e&&(e=Function.prototype);var n=(0,c["default"])(e,t);if(void 0===n){var o=(0,i["default"])(e);return null===o?void 0:a(o,t,r)}if("value"in n)return n.value;var s=n.get;if(void 0!==s)return s.call(r)}},{"../core-js/object/get-own-property-descriptor":5,"../core-js/object/get-prototype-of":6}],15:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/set-prototype-of"),i=n(o),s=e("../core-js/object/create"),c=n(s),a=e("../helpers/typeof"),u=n(a);r["default"]=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+("undefined"==typeof t?"undefined":(0,u["default"])(t)));e.prototype=(0,c["default"])(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(i["default"]?(0,i["default"])(e,t):e.__proto__=t)}},{"../core-js/object/create":3,"../core-js/object/set-prototype-of":8,"../helpers/typeof":17}],16:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../helpers/typeof"),i=n(o);r["default"]=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==("undefined"==typeof t?"undefined":(0,i["default"])(t))&&"function"!=typeof t?e:t}},{"../helpers/typeof":17}],17:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/symbol/iterator"),i=n(o),s=e("../core-js/symbol"),c=n(s),a="function"==typeof c["default"]&&"symbol"==typeof i["default"]?function(e){return typeof e}:function(e){return e&&"function"==typeof c["default"]&&e.constructor===c["default"]?"symbol":typeof e};r["default"]="function"==typeof c["default"]&&"symbol"===a(i["default"])?function(e){return"undefined"==typeof e?"undefined":a(e)}:function(e){return e&&"function"==typeof c["default"]&&e.constructor===c["default"]?"symbol":"undefined"==typeof e?"undefined":a(e)}},{"../core-js/symbol":10,"../core-js/symbol/iterator":11}],18:[function(e,t,r){var n=e("../../modules/_core"),o=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(e){return o.stringify.apply(o,arguments)}},{"../../modules/_core":35}],19:[function(e,t,r){e("../../modules/es6.object.create");var n=e("../../modules/_core").Object;t.exports=function(e,t){return n.create(e,t)}},{"../../modules/_core":35,"../../modules/es6.object.create":100}],20:[function(e,t,r){e("../../modules/es6.object.define-property");var n=e("../../modules/_core").Object;t.exports=function(e,t,r){return n.defineProperty(e,t,r)}},{"../../modules/_core":35,"../../modules/es6.object.define-property":101}],21:[function(e,t,r){e("../../modules/es6.object.get-own-property-descriptor");var n=e("../../modules/_core").Object;t.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}},{"../../modules/_core":35,"../../modules/es6.object.get-own-property-descriptor":102}],22:[function(e,t,r){e("../../modules/es6.object.get-prototype-of"),t.exports=e("../../modules/_core").Object.getPrototypeOf},{"../../modules/_core":35,"../../modules/es6.object.get-prototype-of":103}],23:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/_core").Object.keys},{"../../modules/_core":35,"../../modules/es6.object.keys":104}],24:[function(e,t,r){e("../../modules/es6.object.set-prototype-of"),t.exports=e("../../modules/_core").Object.setPrototypeOf},{"../../modules/_core":35,"../../modules/es6.object.set-prototype-of":105}],25:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.promise"),t.exports=e("../modules/_core").Promise},{"../modules/_core":35,"../modules/es6.object.to-string":106,"../modules/es6.promise":107,"../modules/es6.string.iterator":108,"../modules/web.dom.iterable":112}],26:[function(e,t,r){e("../../modules/es6.symbol"),e("../../modules/es6.object.to-string"),e("../../modules/es7.symbol.async-iterator"),e("../../modules/es7.symbol.observable"),t.exports=e("../../modules/_core").Symbol},{"../../modules/_core":35,"../../modules/es6.object.to-string":106,"../../modules/es6.symbol":109,"../../modules/es7.symbol.async-iterator":110,"../../modules/es7.symbol.observable":111}],27:[function(e,t,r){e("../../modules/es6.string.iterator"),e("../../modules/web.dom.iterable"),t.exports=e("../../modules/_wks-ext").f("iterator")},{"../../modules/_wks-ext":96,"../../modules/es6.string.iterator":108,"../../modules/web.dom.iterable":112}],28:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],29:[function(e,t,r){t.exports=function(){}},{}],30:[function(e,t,r){t.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},{}],31:[function(e,t,r){var n=e("./_is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./_is-object":54}],32:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_to-length"),i=e("./_to-index");t.exports=function(e){return function(t,r,s){var c,a=n(t),u=o(a.length),l=i(s,u);if(e&&r!=r){for(;u>l;)if(c=a[l++],c!=c)return!0}else for(;u>l;l++)if((e||l in a)&&a[l]===r)return e||l||0;return!e&&-1}}},{"./_to-index":88,"./_to-iobject":90,"./_to-length":91}],33:[function(e,t,r){var n=e("./_cof"),o=e("./_wks")("toStringTag"),i="Arguments"==n(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(r){}};t.exports=function(e){var t,r,c;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=s(t=Object(e),o))?r:i?n(t):"Object"==(c=n(t))&&"function"==typeof t.callee?"Arguments":c}},{"./_cof":34,"./_wks":97}],34:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],35:[function(e,t,r){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},{}],36:[function(e,t,r){var n=e("./_a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./_a-function":28}],37:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],38:[function(e,t,r){t.exports=!e("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":43}],39:[function(e,t,r){var n=e("./_is-object"),o=e("./_global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./_global":45,"./_is-object":54}],40:[function(e,t,r){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],41:[function(e,t,r){var n=e("./_object-keys"),o=e("./_object-gops"),i=e("./_object-pie");t.exports=function(e){var t=n(e),r=o.f;if(r)for(var s,c=r(e),a=i.f,u=0;c.length>u;)a.call(e,s=c[u++])&&t.push(s);return t}},{"./_object-gops":71,"./_object-keys":74,"./_object-pie":75}],42:[function(e,t,r){var n=e("./_global"),o=e("./_core"),i=e("./_ctx"),s=e("./_hide"),c="prototype",a=function(e,t,r){var u,l,f,d=e&a.F,p=e&a.G,_=e&a.S,b=e&a.P,h=e&a.B,y=e&a.W,v=p?o:o[t]||(o[t]={}),j=v[c],g=p?n:_?n[t]:(n[t]||{})[c];p&&(r=t);for(u in r)l=!d&&g&&void 0!==g[u],l&&u in v||(f=l?g[u]:r[u],v[u]=p&&"function"!=typeof g[u]?r[u]:h&&l?i(f,n):y&&g[u]==f?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t[c]=e[c],t}(f):b&&"function"==typeof f?i(Function.call,f):f,b&&((v.virtual||(v.virtual={}))[u]=f,e&a.R&&j&&!j[u]&&s(j,u,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},{"./_core":35,"./_ctx":36,"./_global":45,"./_hide":47}],43:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],44:[function(e,t,r){var n=e("./_ctx"),o=e("./_iter-call"),i=e("./_is-array-iter"),s=e("./_an-object"),c=e("./_to-length"),a=e("./core.get-iterator-method"),u={},l={},r=t.exports=function(e,t,r,f,d){var p,_,b,h,y=d?function(){return e}:a(e),v=n(r,f,t?2:1),j=0;if("function"!=typeof y)throw TypeError(e+" is not iterable!");if(i(y)){for(p=c(e.length);p>j;j++)if(h=t?v(s(_=e[j])[0],_[1]):v(e[j]),h===u||h===l)return h}else for(b=y.call(e);!(_=b.next()).done;)if(h=o(b,v,_.value,t),h===u||h===l)return h};r.BREAK=u,r.RETURN=l},{"./_an-object":31,"./_ctx":36,"./_is-array-iter":52,"./_iter-call":55,"./_to-length":91,"./core.get-iterator-method":98}],45:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],46:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],47:[function(e,t,r){var n=e("./_object-dp"),o=e("./_property-desc");t.exports=e("./_descriptors")?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./_descriptors":38,"./_object-dp":66,"./_property-desc":77}],48:[function(e,t,r){t.exports=e("./_global").document&&document.documentElement},{"./_global":45}],49:[function(e,t,r){t.exports=!e("./_descriptors")&&!e("./_fails")(function(){return 7!=Object.defineProperty(e("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":38,"./_dom-create":39,"./_fails":43}],50:[function(e,t,r){t.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},{}],51:[function(e,t,r){var n=e("./_cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./_cof":34}],52:[function(e,t,r){var n=e("./_iterators"),o=e("./_wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./_iterators":60,"./_wks":97}],53:[function(e,t,r){var n=e("./_cof");t.exports=Array.isArray||function(e){return"Array"==n(e)}},{"./_cof":34}],54:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],55:[function(e,t,r){var n=e("./_an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(i){var s=e["return"];throw void 0!==s&&n(s.call(e)),i}}},{"./_an-object":31}],56:[function(e,t,r){"use strict";var n=e("./_object-create"),o=e("./_property-desc"),i=e("./_set-to-string-tag"),s={};e("./_hide")(s,e("./_wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n(s,{next:o(1,r)}),i(e,t+" Iterator")}},{"./_hide":47,"./_object-create":65,"./_property-desc":77,"./_set-to-string-tag":82,"./_wks":97}],57:[function(e,t,r){"use strict";var n=e("./_library"),o=e("./_export"),i=e("./_redefine"),s=e("./_hide"),c=e("./_has"),a=e("./_iterators"),u=e("./_iter-create"),l=e("./_set-to-string-tag"),f=e("./_object-gpo"),d=e("./_wks")("iterator"),p=!([].keys&&"next"in[].keys()),_="@@iterator",b="keys",h="values",y=function(){return this};t.exports=function(e,t,r,v,j,g,m){u(r,t,v);var w,O,k,x=function(e){if(!p&&e in T)return T[e];switch(e){case b:return function(){return new r(this,e)};case h:return function(){return new r(this,e)}}return function(){return new r(this,e)}},C=t+" Iterator",E=j==h,S=!1,T=e.prototype,R=T[d]||T[_]||j&&T[j],M=R||x(j),N=j?E?x("entries"):M:void 0,P="Array"==t?T.entries||R:R;if(P&&(k=f(P.call(new e)),k!==Object.prototype&&(l(k,C,!0),n||c(k,d)||s(k,d,y))),E&&R&&R.name!==h&&(S=!0,M=function(){return R.call(this)}),n&&!m||!p&&!S&&T[d]||s(T,d,M),a[t]=M,a[C]=y,j)if(w={values:E?M:x(h),keys:g?M:x(b),entries:N},m)for(O in w)O in T||i(T,O,w[O]);else o(o.P+o.F*(p||S),t,w);return w}},{"./_export":42,"./_has":46,"./_hide":47,"./_iter-create":56,"./_iterators":60,"./_library":62,"./_object-gpo":72,"./_redefine":79,"./_set-to-string-tag":82,"./_wks":97}],58:[function(e,t,r){var n=e("./_wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(s){}t.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){return{done:r=!0}},i[n]=function(){return s},e(i)}catch(c){}return r}},{"./_wks":97}],59:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],60:[function(e,t,r){t.exports={}},{}],61:[function(e,t,r){var n=e("./_object-keys"),o=e("./_to-iobject");t.exports=function(e,t){for(var r,i=o(e),s=n(i),c=s.length,a=0;c>a;)if(i[r=s[a++]]===t)return r}},{"./_object-keys":74,"./_to-iobject":90}],62:[function(e,t,r){t.exports=!0},{}],63:[function(e,t,r){var n=e("./_uid")("meta"),o=e("./_is-object"),i=e("./_has"),s=e("./_object-dp").f,c=0,a=Object.isExtensible||function(){return!0},u=!e("./_fails")(function(){return a(Object.preventExtensions({}))}),l=function(e){s(e,n,{value:{i:"O"+ ++c,w:{}}})},f=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,n)){if(!a(e))return"F";if(!t)return"E";l(e)}return e[n].i},d=function(e,t){if(!i(e,n)){if(!a(e))return!0;if(!t)return!1;l(e)}return e[n].w},p=function(e){return u&&_.NEED&&a(e)&&!i(e,n)&&l(e),e},_=t.exports={KEY:n,NEED:!1,fastKey:f,getWeak:d,onFreeze:p}},{"./_fails":43,"./_has":46,"./_is-object":54,"./_object-dp":66,"./_uid":94}],64:[function(e,t,r){var n=e("./_global"),o=e("./_task").set,i=n.MutationObserver||n.WebKitMutationObserver,s=n.process,c=n.Promise,a="process"==e("./_cof")(s);t.exports=function(){var e,t,r,u=function(){var n,o;for(a&&(n=s.domain)&&n.exit();e;){o=e.fn,e=e.next;try{o()}catch(i){throw e?r():t=void 0,i}}t=void 0,n&&n.enter()};if(a)r=function(){s.nextTick(u)};else if(i){var l=!0,f=document.createTextNode("");new i(u).observe(f,{characterData:!0}),r=function(){f.data=l=!l}}else if(c&&c.resolve){var d=c.resolve();r=function(){d.then(u)}}else r=function(){o.call(n,u)};return function(n){var o={fn:n,next:void 0};t&&(t.next=o),e||(e=o,r()),t=o}}},{"./_cof":34,"./_global":45,"./_task":87}],65:[function(e,t,r){var n=e("./_an-object"),o=e("./_object-dps"),i=e("./_enum-bug-keys"),s=e("./_shared-key")("IE_PROTO"),c=function(){},a="prototype",u=function(){var t,r=e("./_dom-create")("iframe"),n=i.length,o=">";for(r.style.display="none",e("./_html").appendChild(r),r.src="javascript:",t=r.contentWindow.document,t.open(),t.write("<script>document.F=Object</script"+o),t.close(),u=t.F;n--;)delete u[a][i[n]];return u()};t.exports=Object.create||function(e,t){var r;return null!==e?(c[a]=n(e),r=new c,c[a]=null,r[s]=e):r=u(),void 0===t?r:o(r,t)}},{"./_an-object":31,"./_dom-create":39,"./_enum-bug-keys":40,"./_html":48,"./_object-dps":67,"./_shared-key":83}],66:[function(e,t,r){var n=e("./_an-object"),o=e("./_ie8-dom-define"),i=e("./_to-primitive"),s=Object.defineProperty;r.f=e("./_descriptors")?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return s(e,t,r)}catch(c){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},{"./_an-object":31,"./_descriptors":38,"./_ie8-dom-define":49,"./_to-primitive":93}],67:[function(e,t,r){var n=e("./_object-dp"),o=e("./_an-object"),i=e("./_object-keys");t.exports=e("./_descriptors")?Object.defineProperties:function(e,t){o(e);for(var r,s=i(t),c=s.length,a=0;c>a;)n.f(e,r=s[a++],t[r]);return e}},{"./_an-object":31,"./_descriptors":38,"./_object-dp":66,"./_object-keys":74}],68:[function(e,t,r){var n=e("./_object-pie"),o=e("./_property-desc"),i=e("./_to-iobject"),s=e("./_to-primitive"),c=e("./_has"),a=e("./_ie8-dom-define"),u=Object.getOwnPropertyDescriptor;r.f=e("./_descriptors")?u:function(e,t){if(e=i(e),t=s(t,!0),a)try{return u(e,t)}catch(r){}if(c(e,t))return o(!n.f.call(e,t),e[t])}},{"./_descriptors":38,"./_has":46,"./_ie8-dom-define":49,"./_object-pie":75,"./_property-desc":77,"./_to-iobject":90,"./_to-primitive":93}],69:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_object-gopn").f,i={}.toString,s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(e){try{return o(e)}catch(t){return s.slice()}};t.exports.f=function(e){return s&&"[object Window]"==i.call(e)?c(e):o(n(e))}},{"./_object-gopn":70,"./_to-iobject":90}],70:[function(e,t,r){var n=e("./_object-keys-internal"),o=e("./_enum-bug-keys").concat("length","prototype");r.f=Object.getOwnPropertyNames||function(e){return n(e,o)}},{"./_enum-bug-keys":40,"./_object-keys-internal":73}],71:[function(e,t,r){r.f=Object.getOwnPropertySymbols},{}],72:[function(e,t,r){var n=e("./_has"),o=e("./_to-object"),i=e("./_shared-key")("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},{"./_has":46,"./_shared-key":83,"./_to-object":92}],73:[function(e,t,r){var n=e("./_has"),o=e("./_to-iobject"),i=e("./_array-includes")(!1),s=e("./_shared-key")("IE_PROTO");t.exports=function(e,t){var r,c=o(e),a=0,u=[];for(r in c)r!=s&&n(c,r)&&u.push(r);for(;t.length>a;)n(c,r=t[a++])&&(~i(u,r)||u.push(r));return u}},{"./_array-includes":32,"./_has":46,"./_shared-key":83,"./_to-iobject":90}],74:[function(e,t,r){var n=e("./_object-keys-internal"),o=e("./_enum-bug-keys");t.exports=Object.keys||function(e){return n(e,o)}},{"./_enum-bug-keys":40,"./_object-keys-internal":73}],75:[function(e,t,r){r.f={}.propertyIsEnumerable},{}],76:[function(e,t,r){var n=e("./_export"),o=e("./_core"),i=e("./_fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},{"./_core":35,"./_export":42,"./_fails":43}],77:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],78:[function(e,t,r){var n=e("./_hide");t.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},{"./_hide":47}],79:[function(e,t,r){t.exports=e("./_hide")},{"./_hide":47}],80:[function(e,t,r){var n=e("./_is-object"),o=e("./_an-object"),i=function(e,t){if(o(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,n){try{n=e("./_ctx")(Function.call,e("./_object-gopd").f(Object.prototype,"__proto__").set,2),n(t,[]),r=!(t instanceof Array)}catch(o){r=!0}return function(e,t){return i(e,t),r?e.__proto__=t:n(e,t),e}}({},!1):void 0),check:i}},{"./_an-object":31,"./_ctx":36,"./_is-object":54,"./_object-gopd":68}],81:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_core"),i=e("./_object-dp"),s=e("./_descriptors"),c=e("./_wks")("species");t.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];s&&t&&!t[c]&&i.f(t,c,{configurable:!0,get:function(){return this}})}},{"./_core":35,"./_descriptors":38,"./_global":45,"./_object-dp":66,"./_wks":97}],82:[function(e,t,r){var n=e("./_object-dp").f,o=e("./_has"),i=e("./_wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./_has":46,"./_object-dp":66,"./_wks":97}],83:[function(e,t,r){var n=e("./_shared")("keys"),o=e("./_uid");t.exports=function(e){return n[e]||(n[e]=o(e))}},{"./_shared":84,"./_uid":94}],84:[function(e,t,r){var n=e("./_global"),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./_global":45}],85:[function(e,t,r){var n=e("./_an-object"),o=e("./_a-function"),i=e("./_wks")("species");t.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},{"./_a-function":28,"./_an-object":31,"./_wks":97}],86:[function(e,t,r){var n=e("./_to-integer"),o=e("./_defined");t.exports=function(e){return function(t,r){var i,s,c=String(o(t)),a=n(r),u=c.length;return a<0||a>=u?e?"":void 0:(i=c.charCodeAt(a),i<55296||i>56319||a+1===u||(s=c.charCodeAt(a+1))<56320||s>57343?e?c.charAt(a):i:e?c.slice(a,a+2):(i-55296<<10)+(s-56320)+65536)}}},{"./_defined":37,"./_to-integer":89}],87:[function(e,t,r){var n,o,i,s=e("./_ctx"),c=e("./_invoke"),a=e("./_html"),u=e("./_dom-create"),l=e("./_global"),f=l.process,d=l.setImmediate,p=l.clearImmediate,_=l.MessageChannel,b=0,h={},y="onreadystatechange",v=function(){var e=+this;if(h.hasOwnProperty(e)){var t=h[e];delete h[e],t()}},j=function(e){v.call(e.data)};d&&p||(d=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return h[++b]=function(){c("function"==typeof e?e:Function(e),t)},n(b),b},p=function(e){delete h[e]},"process"==e("./_cof")(f)?n=function(e){f.nextTick(s(v,e,1))}:_?(o=new _,i=o.port2,o.port1.onmessage=j,n=s(i.postMessage,i,1)):l.addEventListener&&"function"==typeof postMessage&&!l.importScripts?(n=function(e){l.postMessage(e+"","*")},l.addEventListener("message",j,!1)):n=y in u("script")?function(e){a.appendChild(u("script"))[y]=function(){a.removeChild(this),v.call(e)}}:function(e){setTimeout(s(v,e,1),0)}),t.exports={set:d,clear:p}},{"./_cof":34,"./_ctx":36,"./_dom-create":39,"./_global":45,"./_html":48,"./_invoke":50}],88:[function(e,t,r){var n=e("./_to-integer"),o=Math.max,i=Math.min;t.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},{"./_to-integer":89}],89:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],90:[function(e,t,r){var n=e("./_iobject"),o=e("./_defined");t.exports=function(e){return n(o(e))}},{"./_defined":37,"./_iobject":51}],91:[function(e,t,r){var n=e("./_to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./_to-integer":89}],92:[function(e,t,r){var n=e("./_defined");t.exports=function(e){return Object(n(e))}},{"./_defined":37}],93:[function(e,t,r){var n=e("./_is-object");t.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":54}],94:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],95:[function(e,t,r){var n=e("./_global"),o=e("./_core"),i=e("./_library"),s=e("./_wks-ext"),c=e("./_object-dp").f;t.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||c(t,e,{value:s.f(e)})}},{"./_core":35,"./_global":45,"./_library":62,"./_object-dp":66,"./_wks-ext":96}],96:[function(e,t,r){r.f=e("./_wks")},{"./_wks":97}],97:[function(e,t,r){var n=e("./_shared")("wks"),o=e("./_uid"),i=e("./_global").Symbol,s="function"==typeof i,c=t.exports=function(e){return n[e]||(n[e]=s&&i[e]||(s?i:o)("Symbol."+e))};c.store=n},{"./_global":45,"./_shared":84,"./_uid":94}],98:[function(e,t,r){var n=e("./_classof"),o=e("./_wks")("iterator"),i=e("./_iterators");t.exports=e("./_core").getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},{"./_classof":33,"./_core":35,"./_iterators":60,"./_wks":97}],99:[function(e,t,r){"use strict";var n=e("./_add-to-unscopables"),o=e("./_iter-step"),i=e("./_iterators"),s=e("./_to-iobject");t.exports=e("./_iter-define")(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./_add-to-unscopables":29,"./_iter-define":57,"./_iter-step":59,"./_iterators":60,"./_to-iobject":90}],100:[function(e,t,r){var n=e("./_export");n(n.S,"Object",{create:e("./_object-create")})},{"./_export":42,"./_object-create":65}],101:[function(e,t,r){var n=e("./_export");n(n.S+n.F*!e("./_descriptors"),"Object",{defineProperty:e("./_object-dp").f})},{"./_descriptors":38,"./_export":42,"./_object-dp":66}],102:[function(e,t,r){var n=e("./_to-iobject"),o=e("./_object-gopd").f;e("./_object-sap")("getOwnPropertyDescriptor",function(){return function(e,t){return o(n(e),t)}})},{"./_object-gopd":68,"./_object-sap":76,"./_to-iobject":90}],103:[function(e,t,r){var n=e("./_to-object"),o=e("./_object-gpo");e("./_object-sap")("getPrototypeOf",function(){return function(e){return o(n(e))}})},{"./_object-gpo":72,"./_object-sap":76,"./_to-object":92}],104:[function(e,t,r){var n=e("./_to-object"),o=e("./_object-keys");e("./_object-sap")("keys",function(){return function(e){return o(n(e))}})},{"./_object-keys":74,"./_object-sap":76,"./_to-object":92}],105:[function(e,t,r){var n=e("./_export");n(n.S,"Object",{setPrototypeOf:e("./_set-proto").set})},{"./_export":42,"./_set-proto":80}],106:[function(e,t,r){},{}],107:[function(e,t,r){"use strict";var n,o,i,s=e("./_library"),c=e("./_global"),a=e("./_ctx"),u=e("./_classof"),l=e("./_export"),f=e("./_is-object"),d=(e("./_an-object"),e("./_a-function")),p=e("./_an-instance"),_=e("./_for-of"),b=(e("./_set-proto").set,e("./_species-constructor")),h=e("./_task").set,y=e("./_microtask")(),v="Promise",j=c.TypeError,g=c.process,m=c[v],g=c.process,w="process"==u(g),O=function(){},k=!!function(){try{var t=m.resolve(1),r=(t.constructor={})[e("./_wks")("species")]=function(e){e(O,O)};return(w||"function"==typeof PromiseRejectionEvent)&&t.then(O)instanceof r}catch(n){}}(),x=function(e,t){return e===t||e===m&&t===i},C=function(e){var t;return!(!f(e)||"function"!=typeof(t=e.then))&&t},E=function(e){return x(m,e)?new S(e):new o(e)},S=o=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw j("Bad Promise constructor");t=e,r=n}),this.resolve=d(t),this.reject=d(r)},T=function(e){try{e()}catch(t){return{error:t}}},R=function(e,t){if(!e._n){e._n=!0;var r=e._c;y(function(){for(var n=e._v,o=1==e._s,i=0,s=function(t){var r,i,s=o?t.ok:t.fail,c=t.resolve,a=t.reject,u=t.domain;try{s?(o||(2==e._h&&P(e),e._h=1),s===!0?r=n:(u&&u.enter(),r=s(n),u&&u.exit()),r===t.promise?a(j("Promise-chain cycle")):(i=C(r))?i.call(r,c,a):c(r)):a(n)}catch(l){a(l)}};r.length>i;)s(r[i++]);e._c=[],e._n=!1,t&&!e._h&&M(e)})}},M=function(e){h.call(c,function(){var t,r,n,o=e._v;if(N(e)&&(t=T(function(){w?g.emit("unhandledRejection",o,e):(r=c.onunhandledrejection)?r({promise:e,reason:o}):(n=c.console)&&n.error&&n.error("Unhandled promise rejection",o)}),e._h=w||N(e)?2:1),e._a=void 0,t)throw t.error})},N=function(e){if(1==e._h)return!1;for(var t,r=e._a||e._c,n=0;r.length>n;)if(t=r[n++],t.fail||!N(t.promise))return!1;return!0},P=function(e){h.call(c,function(){var t;w?g.emit("rejectionHandled",e):(t=c.onrejectionhandled)&&t({promise:e,reason:e._v})})},D=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,t._v=e,t._s=2,t._a||(t._a=t._c.slice()),R(t,!0))},L=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===e)throw j("Promise can't be resolved itself");(t=C(e))?y(function(){var n={_w:r,_d:!1};try{t.call(e,a(L,n,1),a(D,n,1))}catch(o){D.call(n,o)}}):(r._v=e,r._s=1,R(r,!1))}catch(n){D.call({_w:r,_d:!1},n)}}};k||(m=function(e){p(this,m,v,"_h"),d(e),n.call(this);try{e(a(L,this,1),a(D,this,1))}catch(t){D.call(this,t)}},n=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},n.prototype=e("./_redefine-all")(m.prototype,{then:function(e,t){var r=E(b(this,m));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=w?g.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&R(this,!1),r.promise},"catch":function(e){return this.then(void 0,e)}}),S=function(){var e=new n;this.promise=e,this.resolve=a(L,e,1),this.reject=a(D,e,1)}),l(l.G+l.W+l.F*!k,{Promise:m}),e("./_set-to-string-tag")(m,v),e("./_set-species")(v),i=e("./_core")[v],l(l.S+l.F*!k,v,{reject:function(e){var t=E(this),r=t.reject;return r(e),
t.promise}}),l(l.S+l.F*(s||!k),v,{resolve:function(e){if(e instanceof m&&x(e.constructor,this))return e;var t=E(this),r=t.resolve;return r(e),t.promise}}),l(l.S+l.F*!(k&&e("./_iter-detect")(function(e){m.all(e)["catch"](O)})),v,{all:function(e){var t=this,r=E(t),n=r.resolve,o=r.reject,i=T(function(){var r=[],i=0,s=1;_(e,!1,function(e){var c=i++,a=!1;r.push(void 0),s++,t.resolve(e).then(function(e){a||(a=!0,r[c]=e,--s||n(r))},o)}),--s||n(r)});return i&&o(i.error),r.promise},race:function(e){var t=this,r=E(t),n=r.reject,o=T(function(){_(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./_a-function":28,"./_an-instance":30,"./_an-object":31,"./_classof":33,"./_core":35,"./_ctx":36,"./_export":42,"./_for-of":44,"./_global":45,"./_is-object":54,"./_iter-detect":58,"./_library":62,"./_microtask":64,"./_redefine-all":78,"./_set-proto":80,"./_set-species":81,"./_set-to-string-tag":82,"./_species-constructor":85,"./_task":87,"./_wks":97}],108:[function(e,t,r){"use strict";var n=e("./_string-at")(!0);e("./_iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./_iter-define":57,"./_string-at":86}],109:[function(e,t,r){"use strict";var n=e("./_global"),o=e("./_has"),i=e("./_descriptors"),s=e("./_export"),c=e("./_redefine"),a=e("./_meta").KEY,u=e("./_fails"),l=e("./_shared"),f=e("./_set-to-string-tag"),d=e("./_uid"),p=e("./_wks"),_=e("./_wks-ext"),b=e("./_wks-define"),h=e("./_keyof"),y=e("./_enum-keys"),v=e("./_is-array"),j=e("./_an-object"),g=e("./_to-iobject"),m=e("./_to-primitive"),w=e("./_property-desc"),O=e("./_object-create"),k=e("./_object-gopn-ext"),x=e("./_object-gopd"),C=e("./_object-dp"),E=e("./_object-keys"),S=x.f,T=C.f,R=k.f,M=n.Symbol,N=n.JSON,P=N&&N.stringify,D="prototype",L=p("_hidden"),A=p("toPrimitive"),F={}.propertyIsEnumerable,I=l("symbol-registry"),U=l("symbols"),V=l("op-symbols"),z=Object[D],H="function"==typeof M,B=n.QObject,W=!B||!B[D]||!B[D].findChild,J=i&&u(function(){return 7!=O(T({},"a",{get:function(){return T(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=S(z,t);n&&delete z[t],T(e,t,r),n&&e!==z&&T(z,t,n)}:T,Y=function(e){var t=U[e]=O(M[D]);return t._k=e,t},q=H&&"symbol"==typeof M.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof M},K=function(e,t,r){return e===z&&K(V,t,r),j(e),t=m(t,!0),j(r),o(U,t)?(r.enumerable?(o(e,L)&&e[L][t]&&(e[L][t]=!1),r=O(r,{enumerable:w(0,!1)})):(o(e,L)||T(e,L,w(1,{})),e[L][t]=!0),J(e,t,r)):T(e,t,r)},G=function(e,t){j(e);for(var r,n=y(t=g(t)),o=0,i=n.length;i>o;)K(e,r=n[o++],t[r]);return e},Z=function(e,t){return void 0===t?O(e):G(O(e),t)},X=function(e){var t=F.call(this,e=m(e,!0));return!(this===z&&o(U,e)&&!o(V,e))&&(!(t||!o(this,e)||!o(U,e)||o(this,L)&&this[L][e])||t)},$=function(e,t){if(e=g(e),t=m(t,!0),e!==z||!o(U,t)||o(V,t)){var r=S(e,t);return!r||!o(U,t)||o(e,L)&&e[L][t]||(r.enumerable=!0),r}},Q=function(e){for(var t,r=R(g(e)),n=[],i=0;r.length>i;)o(U,t=r[i++])||t==L||t==a||n.push(t);return n},ee=function(e){for(var t,r=e===z,n=R(r?V:g(e)),i=[],s=0;n.length>s;)!o(U,t=n[s++])||r&&!o(z,t)||i.push(U[t]);return i};H||(M=function(){if(this instanceof M)throw TypeError("Symbol is not a constructor!");var e=d(arguments.length>0?arguments[0]:void 0),t=function(r){this===z&&t.call(V,r),o(this,L)&&o(this[L],e)&&(this[L][e]=!1),J(this,e,w(1,r))};return i&&W&&J(z,e,{configurable:!0,set:t}),Y(e)},c(M[D],"toString",function(){return this._k}),x.f=$,C.f=K,e("./_object-gopn").f=k.f=Q,e("./_object-pie").f=X,e("./_object-gops").f=ee,i&&!e("./_library")&&c(z,"propertyIsEnumerable",X,!0),_.f=function(e){return Y(p(e))}),s(s.G+s.W+s.F*!H,{Symbol:M});for(var te="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),re=0;te.length>re;)p(te[re++]);for(var te=E(p.store),re=0;te.length>re;)b(te[re++]);s(s.S+s.F*!H,"Symbol",{"for":function(e){return o(I,e+="")?I[e]:I[e]=M(e)},keyFor:function(e){if(q(e))return h(I,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){W=!0},useSimple:function(){W=!1}}),s(s.S+s.F*!H,"Object",{create:Z,defineProperty:K,defineProperties:G,getOwnPropertyDescriptor:$,getOwnPropertyNames:Q,getOwnPropertySymbols:ee}),N&&s(s.S+s.F*(!H||u(function(){var e=M();return"[null]"!=P([e])||"{}"!=P({a:e})||"{}"!=P(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!q(e)){for(var t,r,n=[e],o=1;arguments.length>o;)n.push(arguments[o++]);return t=n[1],"function"==typeof t&&(r=t),!r&&v(t)||(t=function(e,t){if(r&&(t=r.call(this,e,t)),!q(t))return t}),n[1]=t,P.apply(N,n)}}}),M[D][A]||e("./_hide")(M[D],A,M[D].valueOf),f(M,"Symbol"),f(Math,"Math",!0),f(n.JSON,"JSON",!0)},{"./_an-object":31,"./_descriptors":38,"./_enum-keys":41,"./_export":42,"./_fails":43,"./_global":45,"./_has":46,"./_hide":47,"./_is-array":53,"./_keyof":61,"./_library":62,"./_meta":63,"./_object-create":65,"./_object-dp":66,"./_object-gopd":68,"./_object-gopn":70,"./_object-gopn-ext":69,"./_object-gops":71,"./_object-keys":74,"./_object-pie":75,"./_property-desc":77,"./_redefine":79,"./_set-to-string-tag":82,"./_shared":84,"./_to-iobject":90,"./_to-primitive":93,"./_uid":94,"./_wks":97,"./_wks-define":95,"./_wks-ext":96}],110:[function(e,t,r){e("./_wks-define")("asyncIterator")},{"./_wks-define":95}],111:[function(e,t,r){e("./_wks-define")("observable")},{"./_wks-define":95}],112:[function(e,t,r){e("./es6.array.iterator");for(var n=e("./_global"),o=e("./_hide"),i=e("./_iterators"),s=e("./_wks")("toStringTag"),c=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],a=0;a<5;a++){var u=c[a],l=n[u],f=l&&l.prototype;f&&!f[s]&&o(f,s,u),i[u]=i.Array}},{"./_global":45,"./_hide":47,"./_iterators":60,"./_wks":97,"./es6.array.iterator":99}],113:[function(e,t,r){window.MutationObserver=window.MutationObserver||window.WebKitMutationObserver||function(e){function t(e){this.g=[],this.k=e}function r(e){!function r(){var n=e.takeRecords();n.length&&e.k(n,e),e.f=setTimeout(r,t._period)}()}function n(t){var r,n={type:null,target:null,addedNodes:[],removedNodes:[],previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null};for(r in t)n[r]!==e&&t[r]!==e&&(n[r]=t[r]);return n}function o(e,t){var r=c(e,t);return function(n){var o,a=n.length;t.a&&r.a&&i(n,e,r.a,t.d),(t.b||t.e)&&(o=s(n,e,r,t)),(o||n.length!==a)&&(r=c(e,t))}}function i(t,r,o,i){for(var s,c,a={},u=r.attributes,l=u.length;l--;)s=u[l],c=s.name,i&&i[c]===e||(s.value!==o[c]&&t.push(n({type:"attributes",target:r,attributeName:c,oldValue:o[c],attributeNamespace:s.namespaceURI})),a[c]=!0);for(c in o)a[c]||t.push(n({target:r,type:"attributes",attributeName:c,oldValue:o[c]}))}function s(t,r,o,s){function c(e,r,o,c,a){var l=e.length-1;a=-~((l-a)/2);for(var f,d,p;p=e.pop();)f=o[p.h],d=c[p.i],s.b&&a&&Math.abs(p.h-p.i)>=l&&(t.push(n({type:"childList",target:r,addedNodes:[f],removedNodes:[f],nextSibling:f.nextSibling,previousSibling:f.previousSibling})),a--),s.a&&d.a&&i(t,f,d.a,s.d),s.c&&3===f.nodeType&&f.nodeValue!==d.c&&t.push(n({type:"characterData",target:f})),s.e&&u(f,d)}function u(r,o){for(var d,p,_,b,h,y=r.childNodes,v=o.b,j=y.length,g=v?v.length:0,m=0,w=0,O=0;w<j||O<g;)b=y[w],h=(_=v[O])&&_.j,b===h?(s.a&&_.a&&i(t,b,_.a,s.d),s.c&&_.c!==e&&b.nodeValue!==_.c&&t.push(n({type:"characterData",target:b})),p&&c(p,r,y,v,m),s.e&&(b.childNodes.length||_.b&&_.b.length)&&u(b,_),w++,O++):(l=!0,d||(d={},p=[]),b&&(d[_=a(b)]||(d[_]=!0,-1===(_=f(v,b,O,"j"))?s.b&&(t.push(n({type:"childList",target:r,addedNodes:[b],nextSibling:b.nextSibling,previousSibling:b.previousSibling})),m++):p.push({h:w,i:_})),w++),h&&h!==y[w]&&(d[_=a(h)]||(d[_]=!0,-1===(_=f(y,h,w))?s.b&&(t.push(n({type:"childList",target:o.j,removedNodes:[h],nextSibling:v[O+1],previousSibling:v[O-1]})),m--):p.push({h:_,i:O})),O++));p&&c(p,r,y,v,m)}var l;return u(r,o),l}function c(e,t){var r=!0;return function n(e){var o={j:e};return!t.c||3!==e.nodeType&&8!==e.nodeType?(t.a&&r&&1===e.nodeType&&(o.a=l(e.attributes,function(e,r){return t.d&&!t.d[r.name]||(e[r.name]=r.value),e})),r&&(t.b||t.c||t.a&&t.e)&&(o.b=u(e.childNodes,n)),r=t.e):o.c=e.nodeValue,o}(e)}function a(e){try{return e.id||(e.mo_id=e.mo_id||d++)}catch(t){try{return e.nodeValue}catch(r){return d++}}}function u(e,t){for(var r=[],n=0;n<e.length;n++)r[n]=t(e[n],n,e);return r}function l(e,t){for(var r={},n=0;n<e.length;n++)r=t(r,e[n],n,e);return r}function f(e,t,r,n){for(;r<e.length;r++)if((n?e[r][n]:e[r])===t)return r;return-1}t._period=30,t.prototype={observe:function(e,t){for(var n={a:!!(t.attributes||t.attributeFilter||t.attributeOldValue),b:!!t.childList,e:!!t.subtree,c:!(!t.characterData&&!t.characterDataOldValue)},i=this.g,s=0;s<i.length;s++)i[s].m===e&&i.splice(s,1);t.attributeFilter&&(n.d=l(t.attributeFilter,function(e,t){return e[t]=!0,e})),i.push({m:e,l:o(e,n)}),this.f||r(this)},takeRecords:function(){for(var e=[],t=this.g,r=0;r<t.length;r++)t[r].l(e);return e},disconnect:function(){this.g=[],clearTimeout(this.f),this.f=null}};var d=1;return t}(void 0)},{}],114:[function(e,t,r){Object.observe||function(e,t,r,n){"use strict";var o,i,s=["add","update","delete","reconfigure","setPrototype","preventExtensions"],c=t.isArray||function(e){return function(t){return"[object Array]"===e.call(t)}}(e.prototype.toString),a=t.prototype.indexOf?t.indexOf||function(e,r,n){return t.prototype.indexOf.call(e,r,n)}:function(e,t,r){for(var n=r||0;n<e.length;n++)if(e[n]===t)return n;return-1},u=r.Map!==n&&Map.prototype.forEach?function(){return new Map}:function(){var e=[],t=[];return{size:0,has:function(t){return a(e,t)>-1},get:function(r){return t[a(e,r)]},set:function(r,n){var o=a(e,r);o===-1?(e.push(r),t.push(n),this.size++):t[o]=n},"delete":function(r){var n=a(e,r);n>-1&&(e.splice(n,1),t.splice(n,1),this.size--)},forEach:function(r){for(var n=0;n<e.length;n++)r.call(arguments[1],t[n],e[n],this)}}},l=e.getOwnPropertyNames?function(){var t=e.getOwnPropertyNames;try{arguments.callee}catch(r){var n=(t(a).join(" ")+" ").replace(/prototype |length |name /g,"").slice(0,-1).split(" ");n.length&&(t=function(t){var r=e.getOwnPropertyNames(t);if("function"==typeof t)for(var o,i=0;i<n.length;)(o=a(r,n[i++]))>-1&&r.splice(o,1);return r})}return t}():function(t){var r,n,o=[];if("hasOwnProperty"in t)for(r in t)t.hasOwnProperty(r)&&o.push(r);else{n=e.hasOwnProperty;for(r in t)n.call(t,r)&&o.push(r)}return c(t)&&o.push("length"),o},f=e.getPrototypeOf,d=e.defineProperties&&e.getOwnPropertyDescriptor,p=r.requestAnimationFrame||r.webkitRequestAnimationFrame||function(){var e=+new Date,t=e;return function(r){return setTimeout(function(){r((t=+new Date)-e)},17)}}(),_=function(e,t,r){var n=o.get(e);n?(h(n,e),g(e,n,t,r)):(n=b(e),g(e,n,t,r),1===o.size&&p(y))},b=function(t,r){var n,i=l(t),s=[],c=0,r={handlers:u(),frozen:!!e.isFrozen&&e.isFrozen(t),extensible:!e.isExtensible||e.isExtensible(t),proto:f&&f(t),properties:i,values:s,notifier:j(t,r)};if(d)for(n=r.descriptors=[];c<i.length;)n[c]=d(t,i[c]),s[c]=t[i[c++]];else for(;c<i.length;)s[c]=t[i[c++]];return o.set(t,r),r},h=function(){var t=d?function(e,t,r,n,o){var i=t.properties[r],s=e[i],c=t.values[r],a=t.descriptors[r];"value"in o&&(c===s?0===c&&1/c!==1/s:c===c||s===s)&&(m(e,t,{name:i,type:"update",object:e,oldValue:c},n),t.values[r]=s),!a.configurable||o.configurable&&o.writable===a.writable&&o.enumerable===a.enumerable&&o.get===a.get&&o.set===a.set||(m(e,t,{name:i,type:"reconfigure",object:e,oldValue:c},n),t.descriptors[r]=o)}:function(e,t,r,n){var o=t.properties[r],i=e[o],s=t.values[r];(s===i?0===s&&1/s!==1/i:s===s||i===i)&&(m(e,t,{name:o,type:"update",object:e,oldValue:s},n),t.values[r]=i)},r=d?function(e,r,n,o,i){for(var s,c=r.length;n&&c--;)null!==r[c]&&(s=d(e,r[c]),n--,s?t(e,o,c,i,s):(m(e,o,{name:r[c],type:"delete",object:e,oldValue:o.values[c]},i),o.properties.splice(c,1),o.values.splice(c,1),o.descriptors.splice(c,1)))}:function(e,t,r,n,o){for(var i=t.length;r&&i--;)null!==t[i]&&(m(e,n,{name:t[i],type:"delete",object:e,oldValue:n.values[i]},o),n.properties.splice(i,1),n.values.splice(i,1),r--)};return function(n,o,i){if(n.handlers.size&&!n.frozen){var s,c,u,p,_,b,h,y,v=n.values,j=n.descriptors,g=0;if(n.extensible)if(s=n.properties.slice(),c=s.length,u=l(o),j){for(;g<u.length;)_=u[g++],p=a(s,_),y=d(o,_),p===-1?(m(o,n,{name:_,type:"add",object:o},i),n.properties.push(_),v.push(o[_]),j.push(y)):(s[p]=null,c--,t(o,n,p,i,y));r(o,s,c,n,i),e.isExtensible(o)||(n.extensible=!1,m(o,n,{type:"preventExtensions",object:o},i),n.frozen=e.isFrozen(o))}else{for(;g<u.length;)_=u[g++],p=a(s,_),b=o[_],p===-1?(m(o,n,{name:_,type:"add",object:o},i),n.properties.push(_),v.push(b)):(s[p]=null,c--,t(o,n,p,i));r(o,s,c,n,i)}else if(!n.frozen){for(;g<s.length;g++)_=s[g],t(o,n,g,i,d(o,_));e.isFrozen(o)&&(n.frozen=!0)}f&&(h=f(o),h!==n.proto&&(m(o,n,{type:"setPrototype",name:"__proto__",object:o,oldValue:n.proto}),n.proto=h))}}}(),y=function(){o.size&&(o.forEach(h),i.forEach(v),p(y))},v=function(e,t){var r=e.changeRecords;r.length&&(e.changeRecords=[],t(r))},j=function(e,t){return arguments.length<2&&(t=o.get(e)),t&&t.notifier||{notify:function(t){t.type;var r=o.get(e);if(r){var n,i={object:e};for(n in t)"object"!==n&&(i[n]=t[n]);m(e,r,i)}},performChange:function(t,r){if("string"!=typeof t)throw new TypeError("Invalid non-string changeType");if("function"!=typeof r)throw new TypeError("Cannot perform non-function");var i,s,c=o.get(e),a=arguments[2],u=a===n?r():r.call(a);if(c&&h(c,e,t),c&&u&&"object"==typeof u){s={object:e,type:t};for(i in u)"object"!==i&&"type"!==i&&(s[i]=u[i]);m(e,c,s)}}}},g=function(e,t,r,n){var o=i.get(r);o||i.set(r,o={observed:u(),changeRecords:[]}),o.observed.set(e,{acceptList:n.slice(),data:t}),t.handlers.set(r,o)},m=function(e,t,r,n){t.handlers.forEach(function(t){var o=t.observed.get(e).acceptList;("string"!=typeof n||a(o,n)===-1)&&a(o,r.type)>-1&&t.changeRecords.push(r)})};o=u(),i=u(),e.observe=function(t,r,o){if(!t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.observe cannot observe non-object");if("function"!=typeof r)throw new TypeError("Object.observe cannot deliver to non-function");if(e.isFrozen&&e.isFrozen(r))throw new TypeError("Object.observe cannot deliver to a frozen function object");if(o===n)o=s;else if(!o||"object"!=typeof o)throw new TypeError("Third argument to Object.observe must be an array of strings.");return _(t,r,o),t},e.unobserve=function(e,t){if(null===e||"object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object.unobserve cannot unobserve non-object");if("function"!=typeof t)throw new TypeError("Object.unobserve cannot deliver to non-function");var r,n=i.get(t);return n&&(r=n.observed.get(e))&&(n.observed.forEach(function(e,t){h(e.data,t)}),p(function(){v(n,t)}),1===n.observed.size&&n.observed.has(e)?i["delete"](t):n.observed["delete"](e),1===r.data.handlers.size?o["delete"](e):r.data.handlers["delete"](t)),e},e.getNotifier=function(t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.getNotifier cannot getNotifier non-object");return e.isFrozen&&e.isFrozen(t)?null:j(t)},e.deliverChangeRecords=function(e){if("function"!=typeof e)throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");var t=i.get(e);t&&(t.observed.forEach(function(e,t){h(e.data,t)}),v(t,e))}}(Object,Array,this)},{}],115:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0}),r.DataObjectObserver=r.DataObjectReporter=r.Syncher=void 0,e("mutationobserver-shim"),e("object.observe"),e("array.observe");var o=e("./syncher/Syncher"),i=n(o),s=e("./syncher/DataObjectReporter"),c=n(s),a=e("./syncher/DataObjectObserver"),u=n(a);r.Syncher=i["default"],r.DataObjectReporter=c["default"],r.DataObjectObserver=u["default"]},{"./syncher/DataObjectObserver":118,"./syncher/DataObjectReporter":119,"./syncher/Syncher":122,"array.observe":1,"mutationobserver-shim":113,"object.observe":114}],116:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/core-js/object/keys"),c=n(s),a=e("babel-runtime/helpers/classCallCheck"),u=n(a),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("./SyncObject"),p=n(d),_=e("./DataObjectChild"),b=n(_),h=e("../utils/utils.js"),y=function(){function e(t,r,n,o,i,s){(0,u["default"])(this,e);var c=this;c._syncher=t,c._url=r,c._schema=n,c._status=o,c._syncObj=new p["default"](i),c._childrens=s,c._version=0,c._childId=0,c._childrenObjects={},c._childrenListeners=[],c._owner=t._owner,c._bus=t._bus}return(0,f["default"])(e,[{key:"_allocateListeners",value:function(){var e=this,t=this,r=t._url+"/children/";t._childrens&&t._childrens.forEach(function(n){var o=r+n,i=t._bus.addListener(o,function(r){if(r.from!==e._owner)switch(console.log("DataObject-Children-RCV: ",r),r.type){case"create":t._onChildCreate(r);break;case"delete":console.log(r);break;default:t._changeChildren(r)}});t._childrenListeners.push(i)})}},{key:"_releaseListeners",value:function(){var e=this;e._childrenListeners.forEach(function(e){e.remove()}),(0,c["default"])(e._childrenObjects).forEach(function(t){e._childrenObjects[t]._releaseListeners()})}},{key:"pause",value:function(){throw"Not implemented"}},{key:"resume",value:function(){throw"Not implemented"}},{key:"stop",value:function(){throw"Not implemented"}},{key:"addChild",value:function(e,t){var r=this;r._childId++;var n=r._owner+"#"+r._childId,o=r._url+"/children/"+e,s={type:"create",from:r._owner,to:o,body:{resource:n,value:t}};return new i["default"](function(e){var i=r._bus.postMessage(s);console.log("create-reporter-child( "+r._owner+" ): ",s);var c=new b["default"](r,n,t,r._owner,i);c.onChange(function(e){r._onChange(e,{path:o,childId:n})}),r._childrenObjects[n]=c,e(c)})}},{key:"onAddChild",value:function(e){this._onAddChildrenHandler=e}},{key:"_onChildCreate",value:function(e){var t=this,r=e.body.resource;console.log("create-observer-child( "+t._owner+" ): ",e);var n=new b["default"](t,r,e.body.value);t._childrenObjects[r]=n,setTimeout(function(){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,source:t._owner}})});var o={type:e.type,from:e.from,url:e.to,value:e.body.value,childId:r,identity:e.body.identity};t._onAddChildrenHandler&&(console.log("ADD-CHILDREN-EVENT: ",o),t._onAddChildrenHandler(o))}},{key:"_onChange",value:function(e,t){var r=this;if(r._version++,"on"===r._status){var n={type:"update",from:r._url,to:r._url+"/changes",body:{version:r._version,source:r._owner,attribute:e.field}};e.oType===d.ObjectType.OBJECT?e.cType!==d.ChangeType.REMOVE&&(n.body.value=e.data):(n.body.attributeType=e.oType,n.body.value=e.data,e.cType!==d.ChangeType.UPDATE&&(n.body.operation=e.cType)),t&&(n.to=t.path,n.body.resource=t.childId),r._bus.postMessage(n)}}},{key:"_changeObject",value:function(e,t){var r=this;if(r._version+1===t.body.version){r._version++;var n=t.body.attribute,o=(0,h.deepClone)(t.body.value),i=e.findBefore(n);if(t.body.attributeType===d.ObjectType.ARRAY)if(t.body.operation===d.ChangeType.ADD){var s=i.obj,c=i.last;Array.prototype.splice.apply(s,[c,0].concat(o))}else if(t.body.operation===d.ChangeType.REMOVE){var a=i.obj,u=i.last;a.splice(u,o)}else i.obj[i.last]=o;else t.body.value?i.obj[i.last]=o:delete i.obj[i.last]}else console.log("UNSYNCHRONIZED VERSION: (data => "+r._version+", msg => "+t.body.version+")")}},{key:"_changeChildren",value:function(e){var t=this;console.log("Change children: ",t._owner,e);var r=e.body.resource,n=t._childrenObjects[r];n?t._changeObject(n._syncObj,e):console.log("No children found for: ",r)}},{key:"url",get:function(){return this._url}},{key:"schema",get:function(){return this._schema}},{key:"status",get:function(){return this._status}},{key:"data",get:function(){return this._syncObj.data}},{key:"childrens",get:function(){return this._childrenObjects}}]),e}();r["default"]=y,t.exports=r["default"]},{"../utils/utils.js":123,"./DataObjectChild":117,"./SyncObject":121,"babel-runtime/core-js/object/keys":7,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13}],117:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),c=n(s),a=e("./SyncObject"),u=n(a),l=function(){function e(t,r,n,o,s){(0,i["default"])(this,e);var c=this;c._parent=t,c._childId=r,c._owner=o,c._msgId=s,c._syncObj=new u["default"](n),c._bus=t._bus,c._allocateListeners()}return(0,c["default"])(e,[{key:"_allocateListeners",value:function(){var e=this;e._owner&&(e._listener=e._bus.addListener(e._owner,function(t){"response"===t.type&&t.id===e._msgId&&(console.log("DataObjectChild.onResponse:",t),e._onResponse(t))}))}},{key:"_releaseListeners",value:function(){var e=this;e._listener&&e._listener.remove()}},{key:"delete",value:function(){var e=this;delete e._parent._children[e._childId],e._releaseListeners()}},{key:"onChange",value:function(e){this._syncObj.observe(function(t){e(t)})}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.body.source,code:e.body.code};t._onResponseHandler&&t._onResponseHandler(r)}},{key:"childId",get:function(){return this._childId}},{key:"data",get:function(){return this._syncObj.data}}]),e}();r["default"]=l,t.exports=r["default"]},{"./SyncObject":121,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13}],118:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),c=n(s),a=e("babel-runtime/helpers/classCallCheck"),u=n(a),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("babel-runtime/helpers/possibleConstructorReturn"),p=n(d),_=e("babel-runtime/helpers/get"),b=n(_),h=e("babel-runtime/helpers/inherits"),y=n(h),v=e("./DataObject"),j=n(v),g=e("./DataObjectChild"),m=n(g),w={ANY:"any",START:"start",EXACT:"exact"},O=function(e){function t(e,r,n,o,s,a,l){(0,u["default"])(this,t);var f=(0,p["default"])(this,(0,c["default"])(t).call(this,e,r,n,o,s.data,a)),d=f;return d._version=l,d._filters={},d._syncObj.observe(function(e){d._onFilter(e)}),(0,i["default"])(s.childrens).forEach(function(e){var t=s.childrens[e];d._childrenObjects[e]=new m["default"](d,e,t)}),d._allocateListeners(),f}return(0,y["default"])(t,e),(0,f["default"])(t,[{key:"_allocateListeners",value:function(){(0,b["default"])((0,c["default"])(t.prototype),"_allocateListeners",this).call(this);var e=this;e._changeListener=e._bus.addListener(e._url+"/changes",function(t){"update"===t.type&&(console.log("DataObjectObserver-"+e._url+"-RCV: ",t),e._changeObject(e._syncObj,t))})}},{key:"_releaseListeners",value:function(){(0,b["default"])((0,c["default"])(t.prototype),"_releaseListeners",this).call(this);var e=this;e._changeListener.remove()}},{key:"delete",value:function(){var e=this;e._releaseListeners(),delete e._syncher._observers[e._url]}},{key:"unsubscribe",value:function(){var e=this,t={type:"unsubscribe",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectObserver-UNSUBSCRIBE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._observers[e._url])})}},{key:"onChange",value:function(e,t){var r=e,n={type:w.EXACT,callback:t},o=e.indexOf("*");o===e.length-1&&(0===o?n.type=w.ANY:(n.type=w.START,r=e.substr(0,e.length-1))),this._filters[r]=n}},{key:"_onFilter",value:function(e){var t=this;(0,i["default"])(t._filters).forEach(function(r){var n=t._filters[r];n.type===w.ANY?n.callback(e):n.type===w.START?0===e.field.indexOf(r)&&n.callback(e):n.type===w.EXACT&&e.field===r&&n.callback(e)})}}]),t}(j["default"]);r["default"]=O,t.exports=r["default"]},{"./DataObject":116,"./DataObjectChild":117,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/possibleConstructorReturn":16}],119:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),c=n(s),a=e("babel-runtime/helpers/classCallCheck"),u=n(a),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("babel-runtime/helpers/possibleConstructorReturn"),p=n(d),_=e("babel-runtime/helpers/get"),b=n(_),h=e("babel-runtime/helpers/inherits"),y=n(h),v=e("./DataObject"),j=n(v),g=e("../utils/utils.js"),m=function(e){function t(e,r,n,o,i,s){(0,u["default"])(this,t);var a=(0,p["default"])(this,(0,c["default"])(t).call(this,e,r,n,o,i,s)),l=a;return l._subscriptions={},l._syncObj.observe(function(e){console.log("DataObjectReporter-"+r+"-SEND: ",e),l._onChange(e)}),l._allocateListeners(),a}return(0,y["default"])(t,e),(0,f["default"])(t,[{key:"_allocateListeners",value:function(){(0,b["default"])((0,c["default"])(t.prototype),"_allocateListeners",this).call(this);var e=this;e._objectListener=e._bus.addListener(e._url,function(t){switch(console.log("DataObject-"+e._url+"-RCV: ",t),t.type){case"response":e._onResponse(t);break;case"read":e._onRead(t)}})}},{key:"_releaseListeners",value:function(){(0,b["default"])((0,c["default"])(t.prototype),"_releaseListeners",this).call(this);var e=this;e._objectListener.remove()}},{key:"inviteObservers",value:function(e){var t=this,r={type:"create",from:t._syncher._owner,to:t._syncher._subURL,body:{resource:t._url,schema:t._schema,value:t._syncObj.data,authorise:e}};t._bus.postMessage(r)}},{key:"delete",value:function(){var e=this,t={type:"delete",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectReporter-DELETE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._reporters[e._url])})}},{key:"onSubscription",value:function(e){this._onSubscriptionHandler=e}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"onRead",value:function(e){this._onReadHandler=e}},{key:"_onForward",value:function(e){var t=this;switch(console.log("DataObjectReporter-RCV: ",e),e.body.type){case"subscribe":t._onSubscribe(e);break;case"unsubscribe":t._onUnSubscribe(e)}}},{key:"_onSubscribe",value:function(e){var t=this,r=e.body.from,n={type:e.body.type,url:r,identity:e.body.identity,accept:function(){var n={url:r,status:"on"};t._subscriptions[r]=n;var o={};return(0,i["default"])(t._childrenObjects).forEach(function(e){var r=t._childrenObjects[e].data;o[e]=(0,g.deepClone)(r)}),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,schema:t._schema,version:t._version,value:{data:(0,g.deepClone)(t.data),childrens:o}}}),n},reject:function(r){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:403,desc:r}})}};t._onSubscriptionHandler&&(console.log("SUBSCRIPTION-EVENT: ",n),t._onSubscriptionHandler(n))}},{key:"_onUnSubscribe",value:function(e){var t=this,r=e.body.from,n=t._subscriptions[r];delete t._subscriptions[r];var o={type:e.body.type,url:r,object:n};t._onSubscriptionHandler&&(console.log("UN-SUBSCRIPTION-EVENT: ",o),t._onSubscriptionHandler(o))}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.from,code:e.body.code};t._onResponseHandler&&(console.log("RESPONSE-EVENT: ",r),t._onResponseHandler(r))}},{key:"_onRead",value:function(e){var t=this,r={type:e.type,url:e.from,accept:function(){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,value:(0,g.deepClone)(t.data)}})},reject:function(r){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:401,desc:r}})}};t._onReadHandler&&(console.log("READ-EVENT: ",r),t._onReadHandler(r))}},{key:"subscriptions",get:function(){return this._subscriptions}}]),t}(j["default"]);r["default"]=m,t.exports=r["default"]},{"../utils/utils.js":123,"./DataObject":116,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13,"babel-runtime/helpers/get":14,"babel-runtime/helpers/inherits":15,"babel-runtime/helpers/possibleConstructorReturn":16}],120:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),c=n(s),a=function(){function e(t,r,n,o){(0,i["default"])(this,e);var s=this;s._owner=t,s._url=r,s._bus=n,s._children=o,s._changes=[],s._allocateListeners()}return(0,c["default"])(e,[{key:"_allocateListeners",value:function(){var e=this;e._listener=e._bus.addListener(e._url,function(t){console.log("DataProvisional-"+e._url+"-RCV: ",t),e._changes.push(t)})}},{key:"_releaseListeners",value:function(){var e=this;e._listener.remove()}},{key:"apply",value:function(e){var t=this;t._changes.forEach(function(t){e._changeObject(e._syncObj,t)})}},{key:"children",get:function(){return this._children}}]),e}();r["default"]=a,t.exports=r["default"]},{"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13}],121:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0}),r.ObjectType=r.ChangeType=void 0;var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),c=n(s),a=e("babel-runtime/helpers/createClass"),u=n(a),l=e("../utils/utils.js"),f=function(){function e(t){(0,c["default"])(this,e);var r=this;r._observers=[],r._filters={},t?r._data=(0,l.deepClone)(t):r._data={},r._internalObserve(new d,r._data)}return(0,u["default"])(e,[{key:"observe",value:function(e){this._observers.push(e)}},{key:"find",value:function(e){var t=e.split(".");return this._findWithSplit(t)}},{key:"findBefore",value:function(e){var t={},r=e.split(".");return t.last=r.pop(),t.obj=this._findWithSplit(r),t}},{key:"_findWithSplit",value:function(e){var t=this._data;return e.forEach(function(e){t=t[e]}),t}},{key:"_fireEvent",value:function(e){this._observers.forEach(function(t){t(e)})}},{key:"_isObservable",value:function(e){return e.constructor===Object||e.constructor===Array}},{key:"_internalObserve",value:function(e,t){var r=this;if(r._isObservable(t)){var n=function(t){r._onChanges(e,t)};if(t.constructor===Object){Object.observe(t,n);for(var o in t)r._isObservable(t[o])&&r._internalObserve(e["new"](o),t[o])}else if(t.constructor===Array){Array.observe(t,n);for(var i in t)if(r._isObservable(t[i])){var s=e["new"](new p(t[i],i));r._internalObserve(s,t[i])}}}}},{key:"_onChanges",value:function(e,t){var r=this;for(var n in t){var o=t[n].object,i=void 0;if(o.constructor===Object&&(i=b.OBJECT),o.constructor===Array&&(i=b.ARRAY),"splice"===t[n].type)!function(){var s=t[n].index,c=e["new"](""+s),a=c.toString(),u=t[n].removed.length;if(0!==u){var f=t[n].removed;f.forEach(function(t,n){r._isObservable(t)&&e.removeIndex(s+n)}),r._fireEvent({cType:_.REMOVE,oType:i,field:a,data:u})}var d=t[n].addedCount;if(0!==d){var b=o.slice(s,s+d);b.forEach(function(t,n){if(r._isObservable(t)){var o=e["new"](new p(t,s+n));r._internalObserve(o,t)}}),r._fireEvent({cType:_.ADD,oType:i,field:a,data:(0,l.deepClone)(b)})}s!==o.length-1&&e.reIndexFrom(o)}();else{var s=e["new"](t[n].name),c=s.toString();if(c.indexOf("Symbol")!==-1)continue;var a=o[t[n].name];"update"===t[n].type&&this._fireEvent({cType:_.UPDATE,oType:i,field:c,data:(0,l.deepClone)(a)}),"add"===t[n].type&&(this._internalObserve(s,a),
this._fireEvent({cType:_.ADD,oType:i,field:c,data:(0,l.deepClone)(a)})),"delete"===t[n].type&&this._fireEvent({cType:_.REMOVE,oType:i,field:c})}}}},{key:"data",get:function(){return this._data}}]),e}(),d=function(){function e(){(0,c["default"])(this,e),this._path=[],this._observables={}}return(0,u["default"])(e,[{key:"removeIndex",value:function(e){delete this._observables[e]}},{key:"reIndexFrom",value:function(e){var t=this;(0,i["default"])(this._observables).forEach(function(r){var n=t._observables[r],o=e.indexOf(n.obj);n.idx!=o&&(n.idx=o,delete t._observables[r],t._observables[o]=n)})}},{key:"new",value:function(e){e.constructor==p&&(this._observables[e.idx]=e);var t=this.clone();return t._path.push(e),t}},{key:"clone",value:function(){var t=new e;return this._path.forEach(function(e){t._path.push(e)}),t}},{key:"toString",value:function(){var e="";return this._path.forEach(function(t,r){0===r?e=t.toString():e+="."+t.toString()}),e}}]),e}(),p=function(){function e(t,r){(0,c["default"])(this,e),this.obj=t,this.idx=r}return(0,u["default"])(e,[{key:"toString",value:function(){return this.idx.toString()}}]),e}(),_=r.ChangeType={UPDATE:"update",ADD:"add",REMOVE:"remove"},b=r.ObjectType={OBJECT:"object",ARRAY:"array"};r["default"]=f},{"../utils/utils.js":123,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13}],122:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),c=n(s),a=e("babel-runtime/helpers/createClass"),u=n(a),l=e("./DataObjectReporter"),f=n(l),d=e("./DataObjectObserver"),p=n(d),_=e("./DataProvisional"),b=n(_),h=function(){function e(t,r,n){(0,c["default"])(this,e);var o=this;o._owner=t,o._bus=r,o._subURL=n.runtimeURL+"/sm",o._reporters={},o._observers={},o._provisionals={},r.addListener(t,function(e){if(e.from!==t)switch(console.log("Syncher-RCV: ",e),e.type){case"forward":o._onForward(e);break;case"create":o._onRemoteCreate(e);break;case"delete":o._onRemoteDelete(e)}})}return(0,u["default"])(e,[{key:"create",value:function(e,t,r){var n=this;r.reporter=n._owner,r.schema=e;var o={type:"create",from:n._owner,to:n._subURL,body:{schema:e,value:r,authorise:t}};return new i["default"](function(t,i){n._bus.postMessage(o,function(o){if(console.log("create-response: ",o),200===o.body.code){var s=o.body.resource,c=new f["default"](n,s,e,"on",r,o.body.childrenResources);n._reporters[s]=c,t(c)}else i(o.body.desc)})})}},{key:"subscribe",value:function(e,t){var r=this,n={type:"subscribe",from:r._owner,to:r._subURL,body:{schema:e,resource:t}};return new i["default"](function(o,i){r._bus.postMessage(n,function(n){console.log("subscribe-response: ",n);var s=r._provisionals[t];if(delete r._provisionals[t],s&&s._releaseListeners(),n.body.code<200)s=new b["default"](r._owner,t,r._bus,n.body.childrenResources),r._provisionals[t]=s;else if(200===n.body.code){var c=new p["default"](r,t,e,"on",n.body.value,s.children,n.body.version);r._observers[t]=c,o(c),s.apply(c)}else i(n.body.desc)})})}},{key:"read",value:function(e){var t=this,r={type:"read",from:t._owner,to:e};return new i["default"](function(e,n){t._bus.postMessage(r,function(t){console.log("read-response: ",t),200===t.body.code?e(t.body.value):n(t.body.desc)})})}},{key:"onNotification",value:function(e){this._onNotificationHandler=e}},{key:"_onForward",value:function(e){var t=this,r=t._reporters[e.body.to];r._onForward(e)}},{key:"_onRemoteCreate",value:function(e){var t=this,r=e.from.slice(0,-13),n={type:e.type,from:e.body.source,url:r,schema:e.body.schema,value:e.body.value,identity:e.body.identity,ack:function(r){var n=200;r&&(n=r),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:n}})}};t._onNotificationHandler&&(console.log("NOTIFICATION-EVENT: ",n),t._onNotificationHandler(n))}},{key:"_onRemoteDelete",value:function(e){var t=this,r=e.body.resource,n=t._observers[r];if(n){var o={type:e.type,url:r,identity:e.body.identity,ack:function(r){var o=200;r&&(o=r),200===o&&n["delete"](),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:o,source:t._owner}})}};t._onNotificationHandler&&(console.log("NOTIFICATION-EVENT: ",o),t._onNotificationHandler(o))}else t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:404,source:t._owner}})}},{key:"owner",get:function(){return this._owner}},{key:"reporters",get:function(){return this._reporters}},{key:"observers",get:function(){return this._observers}}]),e}();r["default"]=h,t.exports=r["default"]},{"./DataObjectObserver":118,"./DataObjectReporter":119,"./DataProvisional":120,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/classCallCheck":12,"babel-runtime/helpers/createClass":13}],123:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=e.replace(t,r).split(",");n[0]===e&&(n[0]="https",n[1]=e);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function s(e){return!((0,_["default"])(e).length>0)}function c(e){if(e)return JSON.parse((0,d["default"])(e))}function a(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function u(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function l(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return a(e)}Object.defineProperty(r,"__esModule",{value:!0});var f=e("babel-runtime/core-js/json/stringify"),d=n(f),p=e("babel-runtime/core-js/object/keys"),_=n(p);r.divideURL=o,r.divideEmail=i,r.emptyObject=s,r.deepClone=c,r.getUserURLFromEmail=a,r.getUserEmailFromURL=u,r.convertToUserURL=l},{"babel-runtime/core-js/json/stringify":2,"babel-runtime/core-js/object/keys":7}]},{},[115])(115)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.18.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.IPv6 = factory(root);
  }
}(this, function (root) {
  'use strict';

  /*
  var _in = "fe80:0000:0000:0000:0204:61ff:fe9d:f156";
  var _out = IPv6.best(_in);
  var _expected = "fe80::204:61ff:fe9d:f156";

  console.log(_in, _out, _expected, _out === _expected);
  */

  // save current IPv6 variable, if any
  var _IPv6 = root && root.IPv6;

  function bestPresentation(address) {
    // based on:
    // Javascript to test an IPv6 address for proper format, and to
    // present the "best text representation" according to IETF Draft RFC at
    // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
    // 8 Feb 2010 Rich Brown, Dartware, LLC
    // Please feel free to use this code as long as you provide a link to
    // http://www.intermapper.com
    // http://intermapper.com/support/tools/IPV6-Validator.aspx
    // http://download.dartware.com/thirdparty/ipv6validator.js

    var _address = address.toLowerCase();
    var segments = _address.split(':');
    var length = segments.length;
    var total = 8;

    // trim colons (:: or ::a:b:c… or …a:b:c::)
    if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
      // must have been ::
      // remove first two items
      segments.shift();
      segments.shift();
    } else if (segments[0] === '' && segments[1] === '') {
      // must have been ::xxxx
      // remove the first item
      segments.shift();
    } else if (segments[length - 1] === '' && segments[length - 2] === '') {
      // must have been xxxx::
      segments.pop();
    }

    length = segments.length;

    // adjust total segments for IPv4 trailer
    if (segments[length - 1].indexOf('.') !== -1) {
      // found a "." which means IPv4
      total = 7;
    }

    // fill empty segments them with "0000"
    var pos;
    for (pos = 0; pos < length; pos++) {
      if (segments[pos] === '') {
        break;
      }
    }

    if (pos < total) {
      segments.splice(pos, 1, '0000');
      while (segments.length < total) {
        segments.splice(pos, 0, '0000');
      }
    }

    // strip leading zeros
    var _segments;
    for (var i = 0; i < total; i++) {
      _segments = segments[i].split('');
      for (var j = 0; j < 3 ; j++) {
        if (_segments[0] === '0' && _segments.length > 1) {
          _segments.splice(0,1);
        } else {
          break;
        }
      }

      segments[i] = _segments.join('');
    }

    // find longest sequence of zeroes and coalesce them into one segment
    var best = -1;
    var _best = 0;
    var _current = 0;
    var current = -1;
    var inzeroes = false;
    // i; already declared

    for (i = 0; i < total; i++) {
      if (inzeroes) {
        if (segments[i] === '0') {
          _current += 1;
        } else {
          inzeroes = false;
          if (_current > _best) {
            best = current;
            _best = _current;
          }
        }
      } else {
        if (segments[i] === '0') {
          inzeroes = true;
          current = i;
          _current = 1;
        }
      }
    }

    if (_current > _best) {
      best = current;
      _best = _current;
    }

    if (_best > 1) {
      segments.splice(best, _best, '');
    }

    length = segments.length;

    // assemble remaining segments
    var result = '';
    if (segments[0] === '')  {
      result = ':';
    }

    for (i = 0; i < length; i++) {
      result += segments[i];
      if (i === length - 1) {
        break;
      }

      result += ':';
    }

    if (segments[length - 1] === '') {
      result += ':';
    }

    return result;
  }

  function noConflict() {
    /*jshint validthis: true */
    if (root.IPv6 === this) {
      root.IPv6 = _IPv6;
    }
  
    return this;
  }

  return {
    best: bestPresentation,
    noConflict: noConflict
  };
}));

},{}],5:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.18.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.SecondLevelDomains = factory(root);
  }
}(this, function (root) {
  'use strict';

  // save current SecondLevelDomains variable, if any
  var _SecondLevelDomains = root && root.SecondLevelDomains;

  var SLD = {
    // list of known Second Level Domains
    // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
    // ----
    // publicsuffix.org is more current and actually used by a couple of browsers internally.
    // downside is it also contains domains like "dyndns.org" - which is fine for the security
    // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
    // ----
    list: {
      'ac':' com gov mil net org ',
      'ae':' ac co gov mil name net org pro sch ',
      'af':' com edu gov net org ',
      'al':' com edu gov mil net org ',
      'ao':' co ed gv it og pb ',
      'ar':' com edu gob gov int mil net org tur ',
      'at':' ac co gv or ',
      'au':' asn com csiro edu gov id net org ',
      'ba':' co com edu gov mil net org rs unbi unmo unsa untz unze ',
      'bb':' biz co com edu gov info net org store tv ',
      'bh':' biz cc com edu gov info net org ',
      'bn':' com edu gov net org ',
      'bo':' com edu gob gov int mil net org tv ',
      'br':' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
      'bs':' com edu gov net org ',
      'bz':' du et om ov rg ',
      'ca':' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
      'ck':' biz co edu gen gov info net org ',
      'cn':' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
      'co':' com edu gov mil net nom org ',
      'cr':' ac c co ed fi go or sa ',
      'cy':' ac biz com ekloges gov ltd name net org parliament press pro tm ',
      'do':' art com edu gob gov mil net org sld web ',
      'dz':' art asso com edu gov net org pol ',
      'ec':' com edu fin gov info med mil net org pro ',
      'eg':' com edu eun gov mil name net org sci ',
      'er':' com edu gov ind mil net org rochest w ',
      'es':' com edu gob nom org ',
      'et':' biz com edu gov info name net org ',
      'fj':' ac biz com info mil name net org pro ',
      'fk':' ac co gov net nom org ',
      'fr':' asso com f gouv nom prd presse tm ',
      'gg':' co net org ',
      'gh':' com edu gov mil org ',
      'gn':' ac com gov net org ',
      'gr':' com edu gov mil net org ',
      'gt':' com edu gob ind mil net org ',
      'gu':' com edu gov net org ',
      'hk':' com edu gov idv net org ',
      'hu':' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
      'id':' ac co go mil net or sch web ',
      'il':' ac co gov idf k12 muni net org ',
      'in':' ac co edu ernet firm gen gov i ind mil net nic org res ',
      'iq':' com edu gov i mil net org ',
      'ir':' ac co dnssec gov i id net org sch ',
      'it':' edu gov ',
      'je':' co net org ',
      'jo':' com edu gov mil name net org sch ',
      'jp':' ac ad co ed go gr lg ne or ',
      'ke':' ac co go info me mobi ne or sc ',
      'kh':' com edu gov mil net org per ',
      'ki':' biz com de edu gov info mob net org tel ',
      'km':' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
      'kn':' edu gov net org ',
      'kr':' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
      'kw':' com edu gov net org ',
      'ky':' com edu gov net org ',
      'kz':' com edu gov mil net org ',
      'lb':' com edu gov net org ',
      'lk':' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
      'lr':' com edu gov net org ',
      'lv':' asn com conf edu gov id mil net org ',
      'ly':' com edu gov id med net org plc sch ',
      'ma':' ac co gov m net org press ',
      'mc':' asso tm ',
      'me':' ac co edu gov its net org priv ',
      'mg':' com edu gov mil nom org prd tm ',
      'mk':' com edu gov inf name net org pro ',
      'ml':' com edu gov net org presse ',
      'mn':' edu gov org ',
      'mo':' com edu gov net org ',
      'mt':' com edu gov net org ',
      'mv':' aero biz com coop edu gov info int mil museum name net org pro ',
      'mw':' ac co com coop edu gov int museum net org ',
      'mx':' com edu gob net org ',
      'my':' com edu gov mil name net org sch ',
      'nf':' arts com firm info net other per rec store web ',
      'ng':' biz com edu gov mil mobi name net org sch ',
      'ni':' ac co com edu gob mil net nom org ',
      'np':' com edu gov mil net org ',
      'nr':' biz com edu gov info net org ',
      'om':' ac biz co com edu gov med mil museum net org pro sch ',
      'pe':' com edu gob mil net nom org sld ',
      'ph':' com edu gov i mil net ngo org ',
      'pk':' biz com edu fam gob gok gon gop gos gov net org web ',
      'pl':' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
      'pr':' ac biz com edu est gov info isla name net org pro prof ',
      'ps':' com edu gov net org plo sec ',
      'pw':' belau co ed go ne or ',
      'ro':' arts com firm info nom nt org rec store tm www ',
      'rs':' ac co edu gov in org ',
      'sb':' com edu gov net org ',
      'sc':' com edu gov net org ',
      'sh':' co com edu gov net nom org ',
      'sl':' com edu gov net org ',
      'st':' co com consulado edu embaixada gov mil net org principe saotome store ',
      'sv':' com edu gob org red ',
      'sz':' ac co org ',
      'tr':' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
      'tt':' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
      'tw':' club com ebiz edu game gov idv mil net org ',
      'mu':' ac co com gov net or org ',
      'mz':' ac co edu gov org ',
      'na':' co com ',
      'nz':' ac co cri geek gen govt health iwi maori mil net org parliament school ',
      'pa':' abo ac com edu gob ing med net nom org sld ',
      'pt':' com edu gov int net nome org publ ',
      'py':' com edu gov mil net org ',
      'qa':' com edu gov mil net org ',
      're':' asso com nom ',
      'ru':' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
      'rw':' ac co com edu gouv gov int mil net ',
      'sa':' com edu gov med net org pub sch ',
      'sd':' com edu gov info med net org tv ',
      'se':' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
      'sg':' com edu gov idn net org per ',
      'sn':' art com edu gouv org perso univ ',
      'sy':' com edu gov mil net news org ',
      'th':' ac co go in mi net or ',
      'tj':' ac biz co com edu go gov info int mil name net nic org test web ',
      'tn':' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
      'tz':' ac co go ne or ',
      'ua':' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
      'ug':' ac co go ne or org sc ',
      'uk':' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
      'us':' dni fed isa kids nsn ',
      'uy':' com edu gub mil net org ',
      've':' co com edu gob info mil net org web ',
      'vi':' co com k12 net org ',
      'vn':' ac biz com edu gov health info int name net org pro ',
      'ye':' co com gov ltd me net org plc ',
      'yu':' ac co edu gov org ',
      'za':' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
      'zm':' ac co com edu gov net org sch '
    },
    // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
    // in both performance and memory footprint. No initialization required.
    // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
    // Following methods use lastIndexOf() rather than array.split() in order
    // to avoid any memory allocations.
    has: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') >= 0;
    },
    is: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset >= 0) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
    },
    get: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return null;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return null;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return null;
      }
      if (sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') < 0) {
        return null;
      }
      return domain.slice(sldOffset+1);
    },
    noConflict: function(){
      if (root.SecondLevelDomains === this) {
        root.SecondLevelDomains = _SecondLevelDomains;
      }
      return this;
    }
  };

  return SLD;
}));

},{}],6:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.18.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

  function URI(url, base) {
    var _urlSupplied = arguments.length >= 1;
    var _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }

        return new URI(url);
      }

      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.18.1';

  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      var _match = lookup && lookup[data[i]] !== undefined
        || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */
      if (_match) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    }

    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  function trimSlashes(text) {
    var trim_expression = /^\/+|\/+$/g;
    return text.replace(trim_expression, '');
  }

  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URI.escapeQuerySpace = true;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  };
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // map DOM Elements to their URI attribute
  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };
  URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };
  URI.decodeQuery = function(string, escapeQuerySpace) {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };
  // generate encode/decode path functions
  var _parts = {'encode':'encode', 'decode':'decode'};
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
    return function(string) {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      var actualCodingFunc;
      if (!_innerCodingFuncName) {
        actualCodingFunc = URI[_codingFuncName];
      } else {
        actualCodingFunc = function(string) {
          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
        };
      }

      var segments = (string + '').split(_sep);

      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  };

  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/');

    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
      if (parts.port === '/') {
        parts.port = null;
      }
    } else {
      var firstColon = string.indexOf(':');
      var firstSlash = string.indexOf('/');
      var nextColon = string.indexOf(':', firstColon + 1);
      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };
  URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string' || items[name] === null) {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);
    }

    if (parts.password) {
      t += ':' + URI.encode(parts.password);
    }

    if (t) {
      t += '@';
    }

    return t;
  };
  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = '';
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function(data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if (name.test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && value.test(data[name])) {
            data[name] = undefined;
          } else {
            data[name] = filterArrayValues(data[name], value);
          }
        } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
    }
  };
  URI.hasQuery = function(data, name, value, withinArray) {
    switch (getType(name)) {
      case 'String':
        // Nothing to do here
        break;

      case 'RegExp':
        for (var key in data) {
          if (hasOwn.call(data, key)) {
            if (name.test(key) && (value === undefined || URI.hasQuery(data, key, value))) {
              return true;
            }
          }
        }

        return false;

      case 'Object':
        for (var _key in name) {
          if (hasOwn.call(name, _key)) {
            if (!URI.hasQuery(data, _key, name[_key])) {
              return false;
            }
          }
        }

        return true;

      default:
        throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data; // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  URI.joinPaths = function() {
    var input = [];
    var segments = [];
    var nonEmptySegments = 0;

    for (var i = 0; i < arguments.length; i++) {
      var url = new URI(arguments[i]);
      input.push(url);
      var _segments = url.segment();
      for (var s = 0; s < _segments.length; s++) {
        if (typeof _segments[s] === 'string') {
          segments.push(_segments[s]);
        }

        if (_segments[s]) {
          nonEmptySegments++;
        }
      }
    }

    if (!segments.length || !nonEmptySegments) {
      return new URI('');
    }

    var uri = new URI('').segment(segments);

    if (input[0].path() === '' || input[0].path().slice(0, 1) === '/') {
      uri.path('/' + uri.path());
    }

    return uri.normalize();
  };

  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function(string, callback, options) {
    options || (options = {});
    var _start = options.start || URI.findUri.start;
    var _end = options.end || URI.findUri.end;
    var _trim = options.trim || URI.findUri.trim;
    var _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      var match = _start.exec(string);
      if (!match) {
        break;
      }

      var start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');
      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  };

  // noConflict
  URI.noConflict = function(removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function() {
    return new URI(this);
  };

  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };


  function generateSimpleAccessor(_part){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URI.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
      }
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  };

  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      var res = URI.parseHost(v, x);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.origin = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var protocol = this.protocol();
      var authority = this.authority();
      if (!authority) {
        return '';
      }

      return (protocol ? protocol + '://' : '') + this.authority();
    } else {
      var origin = URI(v);
      this
        .protocol(origin.protocol())
        .authority(origin.authority())
        .build(!build);
      return this;
    }
  };
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      var res = URI.parseHost(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      var res = URI.parseAuthority(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var t = URI.buildUserinfo(this._parts);
      return t ? t.substring(0, t.length -1) : t;
    } else {
      if (v[v.length-1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URI.decodePath(res) : res;

    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos+1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos+1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (var i=0, l=v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length -1].length) {
            segments.pop();
          }

          segments.push(trimSlashes(v[i]));
        }
      } else if (v || typeof v === 'string') {
        v = trimSlashes(v);
        if (segments[segments.length -1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length -1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = trimSlashes(v);
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };
  p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.encode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizePath = function(build) {
    var _path = this._parts.path;
    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URI.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    _path = URI.recodePath(_path);

    var _was_relative;
    var _leadingParents = '';
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // handle relative files (as opposed to directories)
    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    }

    // resolve parents
    while (true) {
      _parent = _path.search(/\/\.\.(\/|$)/);
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (p = properties[i]); i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URI.commonPath(relativePath, basePath);

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
}));

},{"./IPv6":4,"./SecondLevelDomains":5,"./punycode":7}],7:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.0 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.3.2',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = activate;

var _HypertyDiscovery = require('service-framework/dist/HypertyDiscovery');

var _HypertyDiscovery2 = _interopRequireDefault(_HypertyDiscovery);

var _IdentityManager = require('service-framework/dist/IdentityManager');

var _IdentityManager2 = _interopRequireDefault(_IdentityManager);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _Syncher = require('service-framework/dist/Syncher');

var _GroupChat = require('./GroupChat');

var _GroupChat2 = _interopRequireDefault(_GroupChat);

var _notificationsTrigger = require('../notifications/notifications-trigger');

var _notificationsTrigger2 = _interopRequireDefault(_notificationsTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Communication = function Communication(name, participants) {
    _classCallCheck(this, Communication);

    this.startingTime = Date.now();
    this.lastModified = Date.now();
    this.status = "pending";
    this.resources = [];
    this.children = [];
    this.name = name;
    this.participants = participants;
};

var GroupChatHyperty = {
    _getHyFor: function _getHyFor(participants) {
        var _this = this;

        return Promise.all(participants.map(function (p) {
            return _this.hypertyDiscoveryService.discoverHypertiesPerUser(p.email, p.domain).then(function (hyperties) {
                console.log('jyper', hyperties);
                var target = Object.keys(hyperties).map(function (key) {
                    return { key: key, resource: hyperties[key].resources[0], dataScheme: hyperties[key].dataSchemes[0], lastModified: hyperties[key].lastModified };
                }).filter(function (desc) {
                    return desc.resource === 'chat' && desc.dataScheme === 'comm';
                }).sort(function (a, b) {
                    return new Date(a.lastModified) < new Date(b.lastModified) ? 1 : -1;
                }).shift();

                if (!target) throw new Error("Chat Hyperty not found", p);

                return target.key;
            });
        }));
    },
    _createSyncher: function _createSyncher(name, hyperties) {
        return this.syncher.create(this.objectDescURL, hyperties, new Communication(name, hyperties.concat([this.hypertyURL])));
    },
    _resolveIdentity: function _resolveIdentity() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            if (_this2.identity) {
                resolve(_this2.identity);
            } else {
                _this2.identityManagerService.discoverUserRegistered('.', _this2.hypertyURL).then(function (identity) {
                    _this2.identity = identity;
                    resolve(identity);
                });
            }
        });
    },
    create: function create(name, participants) {
        var _this3 = this;

        var identity = undefined;
        return this._resolveIdentity().then(function (id) {
            return identity = id;
        }).then(function () {
            return _this3._getHyFor(participants);
        }).then(function (hyperties) {
            return _this3._createSyncher(name, hyperties);
        }).then(function (dataObjectReporter) {
            console.log('creating group chat', dataObjectReporter);
            dataObjectReporter.onSubscription(function (event) {
                return event.accept();
            });
            return (0, _GroupChat2.default)(dataObjectReporter, _this3._position.data, identity);
        });
    },
    onInvite: function onInvite(callback) {
        var _this4 = this;

        this.syncher.onNotification(function (event) {
            console.log('onNotification');
            if (event.schema.endsWith(_this4.locationDS)) {
                _this4.syncher.subscribe(_this4.locationDescURL, event.url).then(function (dataObject) {
                    _this4._position = dataObject;
                });
            } else if (event.schema.endsWith(_this4.groupChatDS)) {
                (function () {
                    var identity = undefined;
                    _this4._resolveIdentity().then(function (id) {
                        return identity = id;
                    }).then(function () {
                        return _this4.syncher.subscribe(_this4.objectDescURL, event.url);
                    }).then(function (dataObject) {
                        console.log('creating group chat on invite', dataObject);
                        _this4.notifications.trigger([{ email: identity.username, domain: _this4.domain }], { type: 'NEW_CHAT', payload: { id: dataObject.url, name: dataObject.data.name } });
                        return callback((0, _GroupChat2.default)(dataObject, _this4._position.data, identity));
                    });
                })();
            }
        });
    }
};

var groupChatFactory = function groupChatFactory(hypertyURL, bus, config) {
    var syncher = new _Syncher.Syncher(hypertyURL, bus, config);
    var hypertyDiscovery = new _HypertyDiscovery2.default(hypertyURL, bus);
    var identityManager = new _IdentityManager2.default(hypertyURL, config.runtimeURL, bus);
    var uri = new _urijs2.default(hypertyURL);
    var notifications = (0, _notificationsTrigger2.default)(uri.hostname(), syncher, hypertyDiscovery);
    var groupChatDS = 'Communication';
    var locationDS = 'Context';

    return Object.assign(Object.create(GroupChatHyperty), {
        _position: { data: { values: {} } },
        syncher: syncher,
        hypertyDiscoveryService: hypertyDiscovery,
        identityManagerService: identityManager,
        objectDescURL: 'hyperty-catalogue://catalogue.' + uri.hostname() + '/.well-known/dataschema/' + groupChatDS,
        locationDescURL: 'hyperty-catalogue://catalogue.' + uri.hostname() + '/.well-known/dataschema/' + locationDS,
        hypertyURL: hypertyURL,
        notifications: notifications,
        domain: uri.hostname(),
        groupChatDS: groupChatDS,
        locationDS: locationDS
    });
};

function activate(hypertyURL, bus, config) {
    return {
        name: 'GroupChat',
        instance: groupChatFactory(hypertyURL, bus, config)
    };
}
module.exports = exports['default'];

},{"../notifications/notifications-trigger":11,"./GroupChat":9,"service-framework/dist/HypertyDiscovery":1,"service-framework/dist/IdentityManager":2,"service-framework/dist/Syncher":3,"urijs":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (dataObject, position, identity) {
    return Object.assign(Object.create(GroupChat), {
        id: dataObject.url,
        _dataObject: dataObject,
        name: dataObject.data.name,
        startingTime: dataObject.data.startingTime,
        messages: [],
        position: position,
        participants: dataObject.data.participants,
        identity: identity
    });
};

var _GroupChatMessage = require('./GroupChatMessage');

var _GroupChatMessage2 = _interopRequireDefault(_GroupChatMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GroupChat = {
    sendMessage: function sendMessage(message, distance) {
        var _this = this;

        return this._dataObject.addChild('chatmessages', { message: message, distance: distance, position: this.position, startingTime: Date.now() }).then(function (child) {
            console.log('message sended', child);
            _this.messages.push((0, _GroupChatMessage2.default)(child, true, _this.identity));
            return _this.messages[_this.messages.length - 1];
        });
    },
    onMessage: function onMessage(callback) {
        var _this2 = this;

        this._dataObject.onAddChild(function (child) {
            console.log('message received', child);
            var childData = child.data ? child.data : child.value;

            if (childData.distance && _this2._distance(_this2._mapPosition(_this2.position.values), _this2._mapPosition(childData.position.values), 'K') > childData.distance) return;
            _this2.messages.push((0, _GroupChatMessage2.default)(child, false, child.identity.userProfile));
            callback(_this2.messages[_this2.messages.length - 1]);
        });
    },
    getContext: function getContext() {
        return this.messages[this.messages.length - 1] ? this.messages[this.messages.length - 1].text : '';
    },
    _mapPosition: function _mapPosition(values) {
        var position = {};

        values.forEach(function (value) {
            return position[value.name] = value.value;
        });
        return position;
    },
    _distance: function _distance(origin, destination, unit) {
        var radlat1 = Math.PI * origin.latitude / 180;
        var radlat2 = Math.PI * destination.latitude / 180;
        var theta = origin.longitude - destination.longitude;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }
};

module.exports = exports['default'];

},{"./GroupChatMessage":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (dataObjectChild, isMe, identity) {
    return Object.assign(Object.create(GroupChatMessage), {
        _dataObjectChild: dataObjectChild,
        isMe: isMe,
        text: dataObjectChild.data ? dataObjectChild.data.message : dataObjectChild.value.message,
        startingTime: dataObjectChild.data ? dataObjectChild.data.startingTime : dataObjectChild.value.startingTime,
        identity: identity
    });
};

var GroupChatMessage = {
    elapsedMinutes: function elapsedMinutes() {
        return Math.round((Date.now() - this.startingTime) % 86400000 % 3600000 / 60000);
    }
};

module.exports = exports['default'];

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var NotificationsTriggerObject = {
    _getHyFor: function _getHyFor(identities) {
        var _this = this;

        return Promise.all(identities.map(function (p) {
            return _this._discoveryService.discoverHypertiesPerUser(p.email, p.domain).then(function (hyperties) {
                return Object.keys(hyperties).map(function (key) {
                    return { key: key, descriptor: hyperties[key].descriptor, lastModified: hyperties[key].lastModified };
                }).filter(function (desc) {
                    return desc.descriptor.endsWith('NotificationsObserver');
                }).sort(function (a, b) {
                    return new Date(a.lastModified) < new Date(b.lastModified) ? 1 : -1;
                }).shift().key;
            });
        }));
    },
    trigger: function trigger(recipients, notification) {
        var _this2 = this;

        return this._getHyFor(recipients).then(function (hypertyURLs) {
            return _this2._syncher.create(_this2._objectDescURL, hypertyURLs, {}).then(function (reporter) {
                reporter.onSubscription(function (event) {
                    return event.accept();
                });
                setTimeout(function () {
                    return reporter.addChild('chatmessages', notification).then(function (child) {
                        console.log('notification sended', notification);
                        return child;
                    });
                }, 2000);
            });
        });
    }
};

var NotificationsTrigger = function NotificationsTrigger(domain, syncher, discoveryService) {
    return Object.assign({
        _syncher: syncher,

        _discoveryService: discoveryService,

        _objectDescURL: 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/Communication'
    }, NotificationsTriggerObject);
};

exports.default = NotificationsTrigger;
module.exports = exports['default'];

},{}]},{},[8])(8)
});
