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
// Last build: Thu Jun 09 2016 12:28:16 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.HypertyDiscovery=e()}}(function(){return function e(t,r,n){function o(s,c){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!c&&u)return u(s,!0);if(i)return i(s,!0);var a=new Error("Cannot find module '"+s+"'");throw a.code="MODULE_NOT_FOUND",a}var f=r[s]={exports:{}};t[s][0].call(f.exports,function(e){var r=t[s][1][e];return o(r?r:e)},f,f.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":7}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":8}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":9}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":10}],5:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],6:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/define-property"),i=n(o);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":2}],7:[function(e,t,r){var n=e("../../modules/$.core");t.exports=function(e){return(n.JSON&&n.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},{"../../modules/$.core":16}],8:[function(e,t,r){var n=e("../../modules/$");t.exports=function(e,t,r){return n.setDesc(e,t,r)}},{"../../modules/$":38}],9:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/$.core").Object.keys},{"../../modules/$.core":16,"../../modules/es6.object.keys":62}],10:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.promise"),t.exports=e("../modules/$.core").Promise},{"../modules/$.core":16,"../modules/es6.object.to-string":63,"../modules/es6.promise":64,"../modules/es6.string.iterator":65,"../modules/web.dom.iterable":66}],11:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],12:[function(e,t,r){t.exports=function(){}},{}],13:[function(e,t,r){var n=e("./$.is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./$.is-object":31}],14:[function(e,t,r){var n=e("./$.cof"),o=e("./$.wks")("toStringTag"),i="Arguments"==n(function(){return arguments}());t.exports=function(e){var t,r,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=(t=Object(e))[o])?r:i?n(t):"Object"==(s=n(t))&&"function"==typeof t.callee?"Arguments":s}},{"./$.cof":15,"./$.wks":59}],15:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],16:[function(e,t,r){var n=t.exports={version:"1.2.6"};"number"==typeof __e&&(__e=n)},{}],17:[function(e,t,r){var n=e("./$.a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./$.a-function":11}],18:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],19:[function(e,t,r){t.exports=!e("./$.fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./$.fails":22}],20:[function(e,t,r){var n=e("./$.is-object"),o=e("./$.global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./$.global":24,"./$.is-object":31}],21:[function(e,t,r){var n=e("./$.global"),o=e("./$.core"),i=e("./$.ctx"),s="prototype",c=function(e,t,r){var u,a,f,l=e&c.F,d=e&c.G,p=e&c.S,$=e&c.P,v=e&c.B,y=e&c.W,h=d?o:o[t]||(o[t]={}),b=d?n:p?n[t]:(n[t]||{})[s];d&&(r=t);for(u in r)a=!l&&b&&u in b,a&&u in h||(f=a?b[u]:r[u],h[u]=d&&"function"!=typeof b[u]?r[u]:v&&a?i(f,n):y&&b[u]==f?function(e){var t=function(t){return this instanceof e?new e(t):e(t)};return t[s]=e[s],t}(f):$&&"function"==typeof f?i(Function.call,f):f,$&&((h[s]||(h[s]={}))[u]=f))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,t.exports=c},{"./$.core":16,"./$.ctx":17,"./$.global":24}],22:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],23:[function(e,t,r){var n=e("./$.ctx"),o=e("./$.iter-call"),i=e("./$.is-array-iter"),s=e("./$.an-object"),c=e("./$.to-length"),u=e("./core.get-iterator-method");t.exports=function(e,t,r,a){var f,l,d,p=u(e),$=n(r,a,t?2:1),v=0;if("function"!=typeof p)throw TypeError(e+" is not iterable!");if(i(p))for(f=c(e.length);f>v;v++)t?$(s(l=e[v])[0],l[1]):$(e[v]);else for(d=p.call(e);!(l=d.next()).done;)o(d,$,l.value,t)}},{"./$.an-object":13,"./$.ctx":17,"./$.is-array-iter":30,"./$.iter-call":32,"./$.to-length":56,"./core.get-iterator-method":60}],24:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],25:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],26:[function(e,t,r){var n=e("./$"),o=e("./$.property-desc");t.exports=e("./$.descriptors")?function(e,t,r){return n.setDesc(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./$":38,"./$.descriptors":19,"./$.property-desc":42}],27:[function(e,t,r){t.exports=e("./$.global").document&&document.documentElement},{"./$.global":24}],28:[function(e,t,r){t.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},{}],29:[function(e,t,r){var n=e("./$.cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./$.cof":15}],30:[function(e,t,r){var n=e("./$.iterators"),o=e("./$.wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./$.iterators":37,"./$.wks":59}],31:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],32:[function(e,t,r){var n=e("./$.an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(i){var s=e["return"];throw void 0!==s&&n(s.call(e)),i}}},{"./$.an-object":13}],33:[function(e,t,r){"use strict";var n=e("./$"),o=e("./$.property-desc"),i=e("./$.set-to-string-tag"),s={};e("./$.hide")(s,e("./$.wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n.create(s,{next:o(1,r)}),i(e,t+" Iterator")}},{"./$":38,"./$.hide":26,"./$.property-desc":42,"./$.set-to-string-tag":48,"./$.wks":59}],34:[function(e,t,r){"use strict";var n=e("./$.library"),o=e("./$.export"),i=e("./$.redefine"),s=e("./$.hide"),c=e("./$.has"),u=e("./$.iterators"),a=e("./$.iter-create"),f=e("./$.set-to-string-tag"),l=e("./$").getProto,d=e("./$.wks")("iterator"),p=!([].keys&&"next"in[].keys()),$="@@iterator",v="keys",y="values",h=function(){return this};t.exports=function(e,t,r,b,m,g,x){a(r,t,b);var j,w,_=function(e){if(!p&&e in P)return P[e];switch(e){case v:return function(){return new r(this,e)};case y:return function(){return new r(this,e)}}return function(){return new r(this,e)}},k=t+" Iterator",O=m==y,M=!1,P=e.prototype,S=P[d]||P[$]||m&&P[m],E=S||_(m);if(S){var U=l(E.call(new e));f(U,k,!0),!n&&c(P,$)&&s(U,d,h),O&&S.name!==y&&(M=!0,E=function(){return S.call(this)})}if(n&&!x||!p&&!M&&P[d]||s(P,d,E),u[t]=E,u[k]=h,m)if(j={values:O?E:_(y),keys:g?E:_(v),entries:O?_("entries"):E},x)for(w in j)w in P||i(P,w,j[w]);else o(o.P+o.F*(p||M),t,j);return j}},{"./$":38,"./$.export":21,"./$.has":25,"./$.hide":26,"./$.iter-create":33,"./$.iterators":37,"./$.library":39,"./$.redefine":44,"./$.set-to-string-tag":48,"./$.wks":59}],35:[function(e,t,r){var n=e("./$.wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(s){}t.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){r=!0},i[n]=function(){return s},e(i)}catch(c){}return r}},{"./$.wks":59}],36:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],37:[function(e,t,r){t.exports={}},{}],38:[function(e,t,r){var n=Object;t.exports={create:n.create,getProto:n.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:n.getOwnPropertyDescriptor,setDesc:n.defineProperty,setDescs:n.defineProperties,getKeys:n.keys,getNames:n.getOwnPropertyNames,getSymbols:n.getOwnPropertySymbols,each:[].forEach}},{}],39:[function(e,t,r){t.exports=!0},{}],40:[function(e,t,r){var n,o,i,s=e("./$.global"),c=e("./$.task").set,u=s.MutationObserver||s.WebKitMutationObserver,a=s.process,f=s.Promise,l="process"==e("./$.cof")(a),d=function(){var e,t,r;for(l&&(e=a.domain)&&(a.domain=null,e.exit());n;)t=n.domain,r=n.fn,t&&t.enter(),r(),t&&t.exit(),n=n.next;o=void 0,e&&e.enter()};if(l)i=function(){a.nextTick(d)};else if(u){var p=1,$=document.createTextNode("");new u(d).observe($,{characterData:!0}),i=function(){$.data=p=-p}}else i=f&&f.resolve?function(){f.resolve().then(d)}:function(){c.call(s,d)};t.exports=function(e){var t={fn:e,next:void 0,domain:l&&a.domain};o&&(o.next=t),n||(n=t,i()),o=t}},{"./$.cof":15,"./$.global":24,"./$.task":53}],41:[function(e,t,r){var n=e("./$.export"),o=e("./$.core"),i=e("./$.fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},{"./$.core":16,"./$.export":21,"./$.fails":22}],42:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],43:[function(e,t,r){var n=e("./$.redefine");t.exports=function(e,t){for(var r in t)n(e,r,t[r]);return e}},{"./$.redefine":44}],44:[function(e,t,r){t.exports=e("./$.hide")},{"./$.hide":26}],45:[function(e,t,r){t.exports=Object.is||function(e,t){return e===t?0!==e||1/e===1/t:e!=e&&t!=t}},{}],46:[function(e,t,r){var n=e("./$").getDesc,o=e("./$.is-object"),i=e("./$.an-object"),s=function(e,t){if(i(e),!o(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,o){try{o=e("./$.ctx")(Function.call,n(Object.prototype,"__proto__").set,2),o(t,[]),r=!(t instanceof Array)}catch(i){r=!0}return function(e,t){return s(e,t),r?e.__proto__=t:o(e,t),e}}({},!1):void 0),check:s}},{"./$":38,"./$.an-object":13,"./$.ctx":17,"./$.is-object":31}],47:[function(e,t,r){"use strict";var n=e("./$.core"),o=e("./$"),i=e("./$.descriptors"),s=e("./$.wks")("species");t.exports=function(e){var t=n[e];i&&t&&!t[s]&&o.setDesc(t,s,{configurable:!0,get:function(){return this}})}},{"./$":38,"./$.core":16,"./$.descriptors":19,"./$.wks":59}],48:[function(e,t,r){var n=e("./$").setDesc,o=e("./$.has"),i=e("./$.wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./$":38,"./$.has":25,"./$.wks":59}],49:[function(e,t,r){var n=e("./$.global"),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./$.global":24}],50:[function(e,t,r){var n=e("./$.an-object"),o=e("./$.a-function"),i=e("./$.wks")("species");t.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},{"./$.a-function":11,"./$.an-object":13,"./$.wks":59}],51:[function(e,t,r){t.exports=function(e,t,r){if(!(e instanceof t))throw TypeError(r+": use the 'new' operator!");return e}},{}],52:[function(e,t,r){var n=e("./$.to-integer"),o=e("./$.defined");t.exports=function(e){return function(t,r){var i,s,c=String(o(t)),u=n(r),a=c.length;return 0>u||u>=a?e?"":void 0:(i=c.charCodeAt(u),55296>i||i>56319||u+1===a||(s=c.charCodeAt(u+1))<56320||s>57343?e?c.charAt(u):i:e?c.slice(u,u+2):(i-55296<<10)+(s-56320)+65536)}}},{"./$.defined":18,"./$.to-integer":54}],53:[function(e,t,r){var n,o,i,s=e("./$.ctx"),c=e("./$.invoke"),u=e("./$.html"),a=e("./$.dom-create"),f=e("./$.global"),l=f.process,d=f.setImmediate,p=f.clearImmediate,$=f.MessageChannel,v=0,y={},h="onreadystatechange",b=function(){var e=+this;if(y.hasOwnProperty(e)){var t=y[e];delete y[e],t()}},m=function(e){b.call(e.data)};d&&p||(d=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return y[++v]=function(){c("function"==typeof e?e:Function(e),t)},n(v),v},p=function(e){delete y[e]},"process"==e("./$.cof")(l)?n=function(e){l.nextTick(s(b,e,1))}:$?(o=new $,i=o.port2,o.port1.onmessage=m,n=s(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",m,!1)):n=h in a("script")?function(e){u.appendChild(a("script"))[h]=function(){u.removeChild(this),b.call(e)}}:function(e){setTimeout(s(b,e,1),0)}),t.exports={set:d,clear:p}},{"./$.cof":15,"./$.ctx":17,"./$.dom-create":20,"./$.global":24,"./$.html":27,"./$.invoke":28}],54:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],55:[function(e,t,r){var n=e("./$.iobject"),o=e("./$.defined");t.exports=function(e){return n(o(e))}},{"./$.defined":18,"./$.iobject":29}],56:[function(e,t,r){var n=e("./$.to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./$.to-integer":54}],57:[function(e,t,r){var n=e("./$.defined");t.exports=function(e){return Object(n(e))}},{"./$.defined":18}],58:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],59:[function(e,t,r){var n=e("./$.shared")("wks"),o=e("./$.uid"),i=e("./$.global").Symbol;t.exports=function(e){return n[e]||(n[e]=i&&i[e]||(i||o)("Symbol."+e))}},{"./$.global":24,"./$.shared":49,"./$.uid":58}],60:[function(e,t,r){var n=e("./$.classof"),o=e("./$.wks")("iterator"),i=e("./$.iterators");t.exports=e("./$.core").getIteratorMethod=function(e){return void 0!=e?e[o]||e["@@iterator"]||i[n(e)]:void 0}},{"./$.classof":14,"./$.core":16,"./$.iterators":37,"./$.wks":59}],61:[function(e,t,r){"use strict";var n=e("./$.add-to-unscopables"),o=e("./$.iter-step"),i=e("./$.iterators"),s=e("./$.to-iobject");t.exports=e("./$.iter-define")(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./$.add-to-unscopables":12,"./$.iter-define":34,"./$.iter-step":36,"./$.iterators":37,"./$.to-iobject":55}],62:[function(e,t,r){var n=e("./$.to-object");e("./$.object-sap")("keys",function(e){return function(t){return e(n(t))}})},{"./$.object-sap":41,"./$.to-object":57}],63:[function(e,t,r){},{}],64:[function(e,t,r){"use strict";var n,o=e("./$"),i=e("./$.library"),s=e("./$.global"),c=e("./$.ctx"),u=e("./$.classof"),a=e("./$.export"),f=e("./$.is-object"),l=e("./$.an-object"),d=e("./$.a-function"),p=e("./$.strict-new"),$=e("./$.for-of"),v=e("./$.set-proto").set,y=e("./$.same-value"),h=e("./$.wks")("species"),b=e("./$.species-constructor"),m=e("./$.microtask"),g="Promise",x=s.process,j="process"==u(x),w=s[g],_=function(e){var t=new w(function(){});return e&&(t.constructor=Object),w.resolve(t)===t},k=function(){function t(e){var r=new w(e);return v(r,t.prototype),r}var r=!1;try{if(r=w&&w.resolve&&_(),v(t,w),t.prototype=o.create(w.prototype,{constructor:{value:t}}),t.resolve(5).then(function(){})instanceof t||(r=!1),r&&e("./$.descriptors")){var n=!1;w.resolve(o.setDesc({},"then",{get:function(){n=!0}})),r=n}}catch(i){r=!1}return r}(),O=function(e,t){return i&&e===w&&t===n?!0:y(e,t)},M=function(e){var t=l(e)[h];return void 0!=t?t:e},P=function(e){var t;return f(e)&&"function"==typeof(t=e.then)?t:!1},S=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n}),this.resolve=d(t),this.reject=d(r)},E=function(e){try{e()}catch(t){return{error:t}}},U=function(e,t){if(!e.n){e.n=!0;var r=e.c;m(function(){for(var n=e.v,o=1==e.s,i=0,c=function(t){var r,i,s=o?t.ok:t.fail,c=t.resolve,u=t.reject;try{s?(o||(e.h=!0),r=s===!0?n:s(n),r===t.promise?u(TypeError("Promise-chain cycle")):(i=P(r))?i.call(r,c,u):c(r)):u(n)}catch(a){u(a)}};r.length>i;)c(r[i++]);r.length=0,e.n=!1,t&&setTimeout(function(){var t,r,o=e.p;T(o)&&(j?x.emit("unhandledRejection",n,o):(t=s.onunhandledrejection)?t({promise:o,reason:n}):(r=s.console)&&r.error&&r.error("Unhandled promise rejection",n)),e.a=void 0},1)})}},T=function(e){var t,r=e._d,n=r.a||r.c,o=0;if(r.h)return!1;for(;n.length>o;)if(t=n[o++],t.fail||!T(t.promise))return!1;return!0},D=function(e){var t=this;t.d||(t.d=!0,t=t.r||t,t.v=e,t.s=2,t.a=t.c.slice(),U(t,!0))},A=function(e){var t,r=this;if(!r.d){r.d=!0,r=r.r||r;try{if(r.p===e)throw TypeError("Promise can't be resolved itself");(t=P(e))?m(function(){var n={r:r,d:!1};try{t.call(e,c(A,n,1),c(D,n,1))}catch(o){D.call(n,o)}}):(r.v=e,r.s=1,U(r,!1))}catch(n){D.call({r:r,d:!1},n)}}};k||(w=function(e){d(e);var t=this._d={p:p(this,w,g),c:[],a:void 0,s:0,d:!1,v:void 0,h:!1,n:!1};try{e(c(A,t,1),c(D,t,1))}catch(r){D.call(t,r)}},e("./$.redefine-all")(w.prototype,{then:function(e,t){var r=new S(b(this,w)),n=r.promise,o=this._d;return r.ok="function"==typeof e?e:!0,r.fail="function"==typeof t&&t,o.c.push(r),o.a&&o.a.push(r),o.s&&U(o,!1),n},"catch":function(e){return this.then(void 0,e)}})),a(a.G+a.W+a.F*!k,{Promise:w}),e("./$.set-to-string-tag")(w,g),e("./$.set-species")(g),n=e("./$.core")[g],a(a.S+a.F*!k,g,{reject:function(e){var t=new S(this),r=t.reject;return r(e),t.promise}}),a(a.S+a.F*(!k||_(!0)),g,{resolve:function(e){if(e instanceof w&&O(e.constructor,this))return e;var t=new S(this),r=t.resolve;return r(e),t.promise}}),a(a.S+a.F*!(k&&e("./$.iter-detect")(function(e){w.all(e)["catch"](function(){})})),g,{all:function(e){var t=M(this),r=new S(t),n=r.resolve,i=r.reject,s=[],c=E(function(){$(e,!1,s.push,s);var r=s.length,c=Array(r);r?o.each.call(s,function(e,o){var s=!1;t.resolve(e).then(function(e){s||(s=!0,c[o]=e,--r||n(c))},i)}):n(c)});return c&&i(c.error),r.promise},race:function(e){var t=M(this),r=new S(t),n=r.reject,o=E(function(){$(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./$":38,"./$.a-function":11,"./$.an-object":13,"./$.classof":14,"./$.core":16,"./$.ctx":17,"./$.descriptors":19,"./$.export":21,"./$.for-of":23,"./$.global":24,"./$.is-object":31,"./$.iter-detect":35,"./$.library":39,"./$.microtask":40,"./$.redefine-all":43,"./$.same-value":45,"./$.set-proto":46,"./$.set-species":47,"./$.set-to-string-tag":48,"./$.species-constructor":50,"./$.strict-new":51,"./$.wks":59}],65:[function(e,t,r){"use strict";var n=e("./$.string-at")(!0);e("./$.iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./$.iter-define":34,"./$.string-at":52}],66:[function(e,t,r){e("./es6.array.iterator");var n=e("./$.iterators");n.NodeList=n.HTMLCollection=n.Array},{"./$.iterators":37,"./es6.array.iterator":61}],67:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("./hyperty-discovery/HypertyDiscovery"),i=n(o);r["default"]=i["default"],t.exports=r["default"]},{"./hyperty-discovery/HypertyDiscovery":68}],68:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),c=n(s),u=e("babel-runtime/helpers/createClass"),a=n(u),f=e("../utils/utils"),l=function(){function e(t,r){(0,c["default"])(this,e);var n=this;n.messageBus=r,n.domain=(0,f.divideURL)(t).domain,n.discoveryURL=t}return(0,a["default"])(e,[{key:"discoverDataObjectPerName",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:"dataObject://"+e}};return new i["default"](function(e,t){r.messageBus.postMessage(o,function(r){var n=r.body.value.url;n?e(n):t("DataObject name does not exist")})})}},{key:"discoverHypertyPerUser",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),s={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:o}};return console.log("Message: ",s,n,o),new i["default"](function(t,n){r.messageBus.postMessage(s,function(r){console.log("message reply",r);var o=void 0,i=void 0,s=void 0,c=r.body.value;for(o in c)if(void 0!==c[o].lastModified)if(void 0===i)i=new Date(c[o].lastModified),s=o;else{var u=new Date(c[o].lastModified);i.getTime()<u.getTime()&&(i=u,s=o)}console.log("Last Hyperty: ",s,i);var a=s;if(void 0===a)return n("User Hyperty not found");var f={id:e,descriptor:c[a].descriptor,hypertyURL:a};console.log("===> hypertyDiscovery messageBundle: ",f),t(f)})})}},{key:"discoverHypertiesPerUser",value:function(e,t){var r=this,n=void 0;n=t?t:r.domain;var o="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),s={type:"read",from:r.discoveryURL,to:"domain://registry."+n+"/",body:{resource:o}};return console.log("Message discoverHypertiesPerUser: ",s,n,o),new i["default"](function(e,t){r.messageBus.postMessage(s,function(r){console.log("discoverHypertiesPerUser reply",r);var n=r.body.value;return n?void e(n):t("User Hyperty not found")})})}}]),e}();r["default"]=l,t.exports=r["default"]},{"../utils/utils":69,"babel-runtime/core-js/promise":4,"babel-runtime/helpers/classCallCheck":5,"babel-runtime/helpers/createClass":6}],69:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=e.replace(t,r).split(",");n[0]===e&&(n[0]="https",n[1]=e);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function s(e){return!((0,$["default"])(e).length>0)}function c(e){return e?JSON.parse((0,d["default"])(e)):void 0}function u(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function a(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function f(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return u(e)}Object.defineProperty(r,"__esModule",{value:!0});var l=e("babel-runtime/core-js/json/stringify"),d=n(l),p=e("babel-runtime/core-js/object/keys"),$=n(p);r.divideURL=o,r.divideEmail=i,r.emptyObject=s,r.deepClone=c,r.getUserURLFromEmail=u,r.getUserEmailFromURL=a,r.convertToUserURL=f},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":3}]},{},[67])(67)});


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
// Last build: Thu Jun 09 2016 12:28:16 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.IdentityManager=e()}}(function(){return function e(t,r,n){function o(s,c){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!c&&u)return u(s,!0);if(i)return i(s,!0);var a=new Error("Cannot find module '"+s+"'");throw a.code="MODULE_NOT_FOUND",a}var f=r[s]={exports:{}};t[s][0].call(f.exports,function(e){var r=t[s][1][e];return o(r?r:e)},f,f.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":7}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":8}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":9}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":10}],5:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],6:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/define-property"),i=n(o);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":2}],7:[function(e,t,r){var n=e("../../modules/$.core");t.exports=function(e){return(n.JSON&&n.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},{"../../modules/$.core":16}],8:[function(e,t,r){var n=e("../../modules/$");t.exports=function(e,t,r){return n.setDesc(e,t,r)}},{"../../modules/$":38}],9:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/$.core").Object.keys},{"../../modules/$.core":16,"../../modules/es6.object.keys":62}],10:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.promise"),t.exports=e("../modules/$.core").Promise},{"../modules/$.core":16,"../modules/es6.object.to-string":63,"../modules/es6.promise":64,"../modules/es6.string.iterator":65,"../modules/web.dom.iterable":66}],11:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],12:[function(e,t,r){t.exports=function(){}},{}],13:[function(e,t,r){var n=e("./$.is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./$.is-object":31}],14:[function(e,t,r){var n=e("./$.cof"),o=e("./$.wks")("toStringTag"),i="Arguments"==n(function(){return arguments}());t.exports=function(e){var t,r,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=(t=Object(e))[o])?r:i?n(t):"Object"==(s=n(t))&&"function"==typeof t.callee?"Arguments":s}},{"./$.cof":15,"./$.wks":59}],15:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],16:[function(e,t,r){var n=t.exports={version:"1.2.6"};"number"==typeof __e&&(__e=n)},{}],17:[function(e,t,r){var n=e("./$.a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./$.a-function":11}],18:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],19:[function(e,t,r){t.exports=!e("./$.fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./$.fails":22}],20:[function(e,t,r){var n=e("./$.is-object"),o=e("./$.global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./$.global":24,"./$.is-object":31}],21:[function(e,t,r){var n=e("./$.global"),o=e("./$.core"),i=e("./$.ctx"),s="prototype",c=function(e,t,r){var u,a,f,l=e&c.F,p=e&c.G,d=e&c.S,$=e&c.P,v=e&c.B,h=e&c.W,y=p?o:o[t]||(o[t]={}),b=p?n:d?n[t]:(n[t]||{})[s];p&&(r=t);for(u in r)a=!l&&b&&u in b,a&&u in y||(f=a?b[u]:r[u],y[u]=p&&"function"!=typeof b[u]?r[u]:v&&a?i(f,n):h&&b[u]==f?function(e){var t=function(t){return this instanceof e?new e(t):e(t)};return t[s]=e[s],t}(f):$&&"function"==typeof f?i(Function.call,f):f,$&&((y[s]||(y[s]={}))[u]=f))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,t.exports=c},{"./$.core":16,"./$.ctx":17,"./$.global":24}],22:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],23:[function(e,t,r){var n=e("./$.ctx"),o=e("./$.iter-call"),i=e("./$.is-array-iter"),s=e("./$.an-object"),c=e("./$.to-length"),u=e("./core.get-iterator-method");t.exports=function(e,t,r,a){var f,l,p,d=u(e),$=n(r,a,t?2:1),v=0;if("function"!=typeof d)throw TypeError(e+" is not iterable!");if(i(d))for(f=c(e.length);f>v;v++)t?$(s(l=e[v])[0],l[1]):$(e[v]);else for(p=d.call(e);!(l=p.next()).done;)o(p,$,l.value,t)}},{"./$.an-object":13,"./$.ctx":17,"./$.is-array-iter":30,"./$.iter-call":32,"./$.to-length":56,"./core.get-iterator-method":60}],24:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],25:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],26:[function(e,t,r){var n=e("./$"),o=e("./$.property-desc");t.exports=e("./$.descriptors")?function(e,t,r){return n.setDesc(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./$":38,"./$.descriptors":19,"./$.property-desc":42}],27:[function(e,t,r){t.exports=e("./$.global").document&&document.documentElement},{"./$.global":24}],28:[function(e,t,r){t.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},{}],29:[function(e,t,r){var n=e("./$.cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./$.cof":15}],30:[function(e,t,r){var n=e("./$.iterators"),o=e("./$.wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./$.iterators":37,"./$.wks":59}],31:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],32:[function(e,t,r){var n=e("./$.an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(i){var s=e["return"];throw void 0!==s&&n(s.call(e)),i}}},{"./$.an-object":13}],33:[function(e,t,r){"use strict";var n=e("./$"),o=e("./$.property-desc"),i=e("./$.set-to-string-tag"),s={};e("./$.hide")(s,e("./$.wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n.create(s,{next:o(1,r)}),i(e,t+" Iterator")}},{"./$":38,"./$.hide":26,"./$.property-desc":42,"./$.set-to-string-tag":48,"./$.wks":59}],34:[function(e,t,r){"use strict";var n=e("./$.library"),o=e("./$.export"),i=e("./$.redefine"),s=e("./$.hide"),c=e("./$.has"),u=e("./$.iterators"),a=e("./$.iter-create"),f=e("./$.set-to-string-tag"),l=e("./$").getProto,p=e("./$.wks")("iterator"),d=!([].keys&&"next"in[].keys()),$="@@iterator",v="keys",h="values",y=function(){return this};t.exports=function(e,t,r,b,m,g,x){a(r,t,b);var j,w,_=function(e){if(!d&&e in S)return S[e];switch(e){case v:return function(){return new r(this,e)};case h:return function(){return new r(this,e)}}return function(){return new r(this,e)}},k=t+" Iterator",O=m==h,M=!1,S=e.prototype,E=S[p]||S[$]||m&&S[m],P=E||_(m);if(E){var T=l(P.call(new e));f(T,k,!0),!n&&c(S,$)&&s(T,p,y),O&&E.name!==h&&(M=!0,P=function(){return E.call(this)})}if(n&&!x||!d&&!M&&S[p]||s(S,p,P),u[t]=P,u[k]=y,m)if(j={values:O?P:_(h),keys:g?P:_(v),entries:O?_("entries"):P},x)for(w in j)w in S||i(S,w,j[w]);else o(o.P+o.F*(d||M),t,j);return j}},{"./$":38,"./$.export":21,"./$.has":25,"./$.hide":26,"./$.iter-create":33,"./$.iterators":37,"./$.library":39,"./$.redefine":44,"./$.set-to-string-tag":48,"./$.wks":59}],35:[function(e,t,r){var n=e("./$.wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(s){}t.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){r=!0},i[n]=function(){return s},e(i)}catch(c){}return r}},{"./$.wks":59}],36:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],37:[function(e,t,r){t.exports={}},{}],38:[function(e,t,r){var n=Object;t.exports={create:n.create,getProto:n.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:n.getOwnPropertyDescriptor,setDesc:n.defineProperty,setDescs:n.defineProperties,getKeys:n.keys,getNames:n.getOwnPropertyNames,getSymbols:n.getOwnPropertySymbols,each:[].forEach}},{}],39:[function(e,t,r){t.exports=!0},{}],40:[function(e,t,r){var n,o,i,s=e("./$.global"),c=e("./$.task").set,u=s.MutationObserver||s.WebKitMutationObserver,a=s.process,f=s.Promise,l="process"==e("./$.cof")(a),p=function(){var e,t,r;for(l&&(e=a.domain)&&(a.domain=null,e.exit());n;)t=n.domain,r=n.fn,t&&t.enter(),r(),t&&t.exit(),n=n.next;o=void 0,e&&e.enter()};if(l)i=function(){a.nextTick(p)};else if(u){var d=1,$=document.createTextNode("");new u(p).observe($,{characterData:!0}),i=function(){$.data=d=-d}}else i=f&&f.resolve?function(){f.resolve().then(p)}:function(){c.call(s,p)};t.exports=function(e){var t={fn:e,next:void 0,domain:l&&a.domain};o&&(o.next=t),n||(n=t,i()),o=t}},{"./$.cof":15,"./$.global":24,"./$.task":53}],41:[function(e,t,r){var n=e("./$.export"),o=e("./$.core"),i=e("./$.fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},{"./$.core":16,"./$.export":21,"./$.fails":22}],42:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],43:[function(e,t,r){var n=e("./$.redefine");t.exports=function(e,t){for(var r in t)n(e,r,t[r]);return e}},{"./$.redefine":44}],44:[function(e,t,r){t.exports=e("./$.hide")},{"./$.hide":26}],45:[function(e,t,r){t.exports=Object.is||function(e,t){return e===t?0!==e||1/e===1/t:e!=e&&t!=t}},{}],46:[function(e,t,r){var n=e("./$").getDesc,o=e("./$.is-object"),i=e("./$.an-object"),s=function(e,t){if(i(e),!o(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,o){try{o=e("./$.ctx")(Function.call,n(Object.prototype,"__proto__").set,2),o(t,[]),r=!(t instanceof Array)}catch(i){r=!0}return function(e,t){return s(e,t),r?e.__proto__=t:o(e,t),e}}({},!1):void 0),check:s}},{"./$":38,"./$.an-object":13,"./$.ctx":17,"./$.is-object":31}],47:[function(e,t,r){"use strict";var n=e("./$.core"),o=e("./$"),i=e("./$.descriptors"),s=e("./$.wks")("species");t.exports=function(e){var t=n[e];i&&t&&!t[s]&&o.setDesc(t,s,{configurable:!0,get:function(){return this}})}},{"./$":38,"./$.core":16,"./$.descriptors":19,"./$.wks":59}],48:[function(e,t,r){var n=e("./$").setDesc,o=e("./$.has"),i=e("./$.wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./$":38,"./$.has":25,"./$.wks":59}],49:[function(e,t,r){var n=e("./$.global"),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./$.global":24}],50:[function(e,t,r){var n=e("./$.an-object"),o=e("./$.a-function"),i=e("./$.wks")("species");t.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},{"./$.a-function":11,"./$.an-object":13,"./$.wks":59}],51:[function(e,t,r){t.exports=function(e,t,r){if(!(e instanceof t))throw TypeError(r+": use the 'new' operator!");return e}},{}],52:[function(e,t,r){var n=e("./$.to-integer"),o=e("./$.defined");t.exports=function(e){return function(t,r){var i,s,c=String(o(t)),u=n(r),a=c.length;return 0>u||u>=a?e?"":void 0:(i=c.charCodeAt(u),55296>i||i>56319||u+1===a||(s=c.charCodeAt(u+1))<56320||s>57343?e?c.charAt(u):i:e?c.slice(u,u+2):(i-55296<<10)+(s-56320)+65536)}}},{"./$.defined":18,"./$.to-integer":54}],53:[function(e,t,r){var n,o,i,s=e("./$.ctx"),c=e("./$.invoke"),u=e("./$.html"),a=e("./$.dom-create"),f=e("./$.global"),l=f.process,p=f.setImmediate,d=f.clearImmediate,$=f.MessageChannel,v=0,h={},y="onreadystatechange",b=function(){var e=+this;if(h.hasOwnProperty(e)){var t=h[e];delete h[e],t()}},m=function(e){b.call(e.data)};p&&d||(p=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return h[++v]=function(){c("function"==typeof e?e:Function(e),t)},n(v),v},d=function(e){delete h[e]},"process"==e("./$.cof")(l)?n=function(e){l.nextTick(s(b,e,1))}:$?(o=new $,i=o.port2,o.port1.onmessage=m,n=s(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",m,!1)):n=y in a("script")?function(e){u.appendChild(a("script"))[y]=function(){u.removeChild(this),b.call(e)}}:function(e){setTimeout(s(b,e,1),0)}),t.exports={set:p,clear:d}},{"./$.cof":15,"./$.ctx":17,"./$.dom-create":20,"./$.global":24,"./$.html":27,"./$.invoke":28}],54:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],55:[function(e,t,r){var n=e("./$.iobject"),o=e("./$.defined");t.exports=function(e){return n(o(e))}},{"./$.defined":18,"./$.iobject":29}],56:[function(e,t,r){var n=e("./$.to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./$.to-integer":54}],57:[function(e,t,r){var n=e("./$.defined");t.exports=function(e){return Object(n(e))}},{"./$.defined":18}],58:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],59:[function(e,t,r){var n=e("./$.shared")("wks"),o=e("./$.uid"),i=e("./$.global").Symbol;t.exports=function(e){return n[e]||(n[e]=i&&i[e]||(i||o)("Symbol."+e))}},{"./$.global":24,"./$.shared":49,"./$.uid":58}],60:[function(e,t,r){var n=e("./$.classof"),o=e("./$.wks")("iterator"),i=e("./$.iterators");t.exports=e("./$.core").getIteratorMethod=function(e){return void 0!=e?e[o]||e["@@iterator"]||i[n(e)]:void 0}},{"./$.classof":14,"./$.core":16,"./$.iterators":37,"./$.wks":59}],61:[function(e,t,r){"use strict";var n=e("./$.add-to-unscopables"),o=e("./$.iter-step"),i=e("./$.iterators"),s=e("./$.to-iobject");t.exports=e("./$.iter-define")(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./$.add-to-unscopables":12,"./$.iter-define":34,"./$.iter-step":36,"./$.iterators":37,"./$.to-iobject":55}],62:[function(e,t,r){var n=e("./$.to-object");e("./$.object-sap")("keys",function(e){return function(t){return e(n(t))}})},{"./$.object-sap":41,"./$.to-object":57}],63:[function(e,t,r){},{}],64:[function(e,t,r){"use strict";var n,o=e("./$"),i=e("./$.library"),s=e("./$.global"),c=e("./$.ctx"),u=e("./$.classof"),a=e("./$.export"),f=e("./$.is-object"),l=e("./$.an-object"),p=e("./$.a-function"),d=e("./$.strict-new"),$=e("./$.for-of"),v=e("./$.set-proto").set,h=e("./$.same-value"),y=e("./$.wks")("species"),b=e("./$.species-constructor"),m=e("./$.microtask"),g="Promise",x=s.process,j="process"==u(x),w=s[g],_=function(e){var t=new w(function(){});return e&&(t.constructor=Object),w.resolve(t)===t},k=function(){function t(e){var r=new w(e);return v(r,t.prototype),r}var r=!1;try{if(r=w&&w.resolve&&_(),v(t,w),t.prototype=o.create(w.prototype,{constructor:{value:t}}),t.resolve(5).then(function(){})instanceof t||(r=!1),r&&e("./$.descriptors")){var n=!1;w.resolve(o.setDesc({},"then",{get:function(){n=!0}})),r=n}}catch(i){r=!1}return r}(),O=function(e,t){return i&&e===w&&t===n?!0:h(e,t)},M=function(e){var t=l(e)[y];return void 0!=t?t:e},S=function(e){var t;return f(e)&&"function"==typeof(t=e.then)?t:!1},E=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n}),this.resolve=p(t),this.reject=p(r)},P=function(e){try{e()}catch(t){return{error:t}}},T=function(e,t){if(!e.n){e.n=!0;var r=e.c;m(function(){for(var n=e.v,o=1==e.s,i=0,c=function(t){var r,i,s=o?t.ok:t.fail,c=t.resolve,u=t.reject;try{s?(o||(e.h=!0),r=s===!0?n:s(n),r===t.promise?u(TypeError("Promise-chain cycle")):(i=S(r))?i.call(r,c,u):c(r)):u(n)}catch(a){u(a)}};r.length>i;)c(r[i++]);r.length=0,e.n=!1,t&&setTimeout(function(){var t,r,o=e.p;U(o)&&(j?x.emit("unhandledRejection",n,o):(t=s.onunhandledrejection)?t({promise:o,reason:n}):(r=s.console)&&r.error&&r.error("Unhandled promise rejection",n)),e.a=void 0},1)})}},U=function(e){var t,r=e._d,n=r.a||r.c,o=0;if(r.h)return!1;for(;n.length>o;)if(t=n[o++],t.fail||!U(t.promise))return!1;return!0},A=function(e){var t=this;t.d||(t.d=!0,t=t.r||t,t.v=e,t.s=2,t.a=t.c.slice(),T(t,!0))},C=function(e){var t,r=this;if(!r.d){r.d=!0,r=r.r||r;try{if(r.p===e)throw TypeError("Promise can't be resolved itself");(t=S(e))?m(function(){var n={r:r,d:!1};try{t.call(e,c(C,n,1),c(A,n,1))}catch(o){A.call(n,o)}}):(r.v=e,r.s=1,T(r,!1))}catch(n){A.call({r:r,d:!1},n)}}};k||(w=function(e){p(e);var t=this._d={p:d(this,w,g),c:[],a:void 0,s:0,d:!1,v:void 0,h:!1,n:!1};try{e(c(C,t,1),c(A,t,1))}catch(r){A.call(t,r)}},e("./$.redefine-all")(w.prototype,{then:function(e,t){var r=new E(b(this,w)),n=r.promise,o=this._d;return r.ok="function"==typeof e?e:!0,r.fail="function"==typeof t&&t,o.c.push(r),o.a&&o.a.push(r),o.s&&T(o,!1),n},"catch":function(e){return this.then(void 0,e)}})),a(a.G+a.W+a.F*!k,{Promise:w}),e("./$.set-to-string-tag")(w,g),e("./$.set-species")(g),n=e("./$.core")[g],a(a.S+a.F*!k,g,{reject:function(e){var t=new E(this),r=t.reject;return r(e),t.promise}}),a(a.S+a.F*(!k||_(!0)),g,{resolve:function(e){if(e instanceof w&&O(e.constructor,this))return e;var t=new E(this),r=t.resolve;return r(e),t.promise}}),a(a.S+a.F*!(k&&e("./$.iter-detect")(function(e){w.all(e)["catch"](function(){})})),g,{all:function(e){var t=M(this),r=new E(t),n=r.resolve,i=r.reject,s=[],c=P(function(){$(e,!1,s.push,s);var r=s.length,c=Array(r);r?o.each.call(s,function(e,o){var s=!1;t.resolve(e).then(function(e){s||(s=!0,c[o]=e,--r||n(c))},i)}):n(c)});return c&&i(c.error),r.promise},race:function(e){var t=M(this),r=new E(t),n=r.reject,o=P(function(){$(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./$":38,"./$.a-function":11,"./$.an-object":13,"./$.classof":14,"./$.core":16,"./$.ctx":17,"./$.descriptors":19,"./$.export":21,"./$.for-of":23,"./$.global":24,"./$.is-object":31,"./$.iter-detect":35,"./$.library":39,"./$.microtask":40,"./$.redefine-all":43,"./$.same-value":45,"./$.set-proto":46,"./$.set-species":47,"./$.set-to-string-tag":48,"./$.species-constructor":50,"./$.strict-new":51,"./$.wks":59}],65:[function(e,t,r){"use strict";var n=e("./$.string-at")(!0);e("./$.iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./$.iter-define":34,"./$.string-at":52}],66:[function(e,t,r){e("./es6.array.iterator");var n=e("./$.iterators");n.NodeList=n.HTMLCollection=n.Array},{"./$.iterators":37,"./es6.array.iterator":61}],67:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),c=n(s),u=e("babel-runtime/helpers/createClass"),a=n(u),f=e("../utils/utils"),l=function(){function e(t,r,n){(0,c["default"])(this,e);var o=this;o.messageBus=n,o.domain=(0,f.divideURL)(t).domain,o.hypertyURL=t,o.runtimeURL=r}return(0,a["default"])(e,[{key:"discoverUserRegistered",value:function(e,t){var r=this,n=void 0,o=e?e:".";n=t?t:r.hypertyURL;var s={type:"read",from:n,to:r.runtimeURL+"/registry/",body:{resource:o,criteria:n}};return new i["default"](function(e,t){r.messageBus.postMessage(s,function(r){var n=r.body.resource;n?e(n):t("No user was not found")})})}}]),e}();r["default"]=l,t.exports=r["default"]},{"../utils/utils":68,"babel-runtime/core-js/promise":4,"babel-runtime/helpers/classCallCheck":5,"babel-runtime/helpers/createClass":6}],68:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=e.replace(t,r).split(",");n[0]===e&&(n[0]="https",n[1]=e);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function s(e){return!((0,$["default"])(e).length>0)}function c(e){return e?JSON.parse((0,p["default"])(e)):void 0}function u(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function a(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function f(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return u(e)}Object.defineProperty(r,"__esModule",{value:!0});var l=e("babel-runtime/core-js/json/stringify"),p=n(l),d=e("babel-runtime/core-js/object/keys"),$=n(d);r.divideURL=o,r.divideEmail=i,r.emptyObject=s,r.deepClone=c,r.getUserURLFromEmail=u,r.getUserEmailFromURL=a,r.convertToUserURL=f},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":3}]},{},[67])(67)});


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
// Last build: Thu Jun 09 2016 12:28:24 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Syncher=e()}}(function(){return function e(t,r,n){function o(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var l=r[s]={exports:{}};t[s][0].call(l.exports,function(e){var r=t[s][1][e];return o(r?r:e)},l,l.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,t,r){Object.observe&&!Array.observe&&function(e,t){"use strict";var r=e.getNotifier,n="performChange",o="_original",i="splice",s={push:function c(e){var t=arguments,s=c[o].apply(this,t);return r(this)[n](i,function(){return{index:s-t.length,addedCount:t.length,removed:[]}}),s},unshift:function u(e){var t=arguments,s=u[o].apply(this,t);return r(this)[n](i,function(){return{index:0,addedCount:t.length,removed:[]}}),s},pop:function l(){var e=this.length,t=l[o].call(this);return this.length!==e&&r(this)[n](i,function(){return{index:this.length,addedCount:0,removed:[t]}},this),t},shift:function f(){var e=this.length,t=f[o].call(this);return this.length!==e&&r(this)[n](i,function(){return{index:0,addedCount:0,removed:[t]}},this),t},splice:function d(e,t){var s=arguments,a=d[o].apply(this,s);return(a.length||s.length>2)&&r(this)[n](i,function(){return{index:e,addedCount:s.length-2,removed:a}},this),a}};for(var a in s)s[a][o]=t.prototype[a],t.prototype[a]=s[a];t.observe=function(t,r){return e.observe(t,r,["add","update","delete",i])},t.unobserve=e.unobserve}(Object,Array)},{}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":17}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/create"),__esModule:!0}},{"core-js/library/fn/object/create":18}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":19}],5:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/get-own-property-descriptor"),__esModule:!0}},{"core-js/library/fn/object/get-own-property-descriptor":20}],6:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/get-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/get-prototype-of":21}],7:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":22}],8:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/set-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/set-prototype-of":23}],9:[function(e,t,r){t.exports={"default":e("core-js/library/fn/promise"),__esModule:!0}},{"core-js/library/fn/promise":24}],10:[function(e,t,r){t.exports={"default":e("core-js/library/fn/symbol"),__esModule:!0}},{"core-js/library/fn/symbol":25}],11:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],12:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../core-js/object/define-property"),i=n(o);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i["default"])(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()},{"../core-js/object/define-property":4}],13:[function(e,t,r){"use strict";var n=e("babel-runtime/core-js/object/get-own-property-descriptor")["default"];r["default"]=function(e,t,r){for(var o=!0;o;){var i=e,s=t,a=r;o=!1,null===i&&(i=Function.prototype);var c=n(i,s);if(void 0!==c){if("value"in c)return c.value;var u=c.get;if(void 0===u)return;return u.call(a)}var l=Object.getPrototypeOf(i);if(null===l)return;e=l,t=s,r=a,o=!0,c=l=void 0}},r.__esModule=!0},{"babel-runtime/core-js/object/get-own-property-descriptor":5}],14:[function(e,t,r){"use strict";var n=e("babel-runtime/core-js/object/create")["default"],o=e("babel-runtime/core-js/object/set-prototype-of")["default"];r["default"]=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=n(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(o?o(e,t):e.__proto__=t)},r.__esModule=!0},{"babel-runtime/core-js/object/create":3,"babel-runtime/core-js/object/set-prototype-of":8}],15:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var o=e("../helpers/typeof"),i=n(o);r["default"]=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==("undefined"==typeof t?"undefined":(0,i["default"])(t))&&"function"!=typeof t?e:t}},{"../helpers/typeof":16}],16:[function(e,t,r){"use strict";var n=e("babel-runtime/core-js/symbol")["default"];r["default"]=function(e){return e&&e.constructor===n?"symbol":typeof e},r.__esModule=!0},{"babel-runtime/core-js/symbol":10}],17:[function(e,t,r){var n=e("../../modules/$.core");t.exports=function(e){return(n.JSON&&n.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},{"../../modules/$.core":31}],18:[function(e,t,r){var n=e("../../modules/$");t.exports=function(e,t){return n.create(e,t)}},{"../../modules/$":56}],19:[function(e,t,r){var n=e("../../modules/$");t.exports=function(e,t,r){return n.setDesc(e,t,r)}},{"../../modules/$":56}],20:[function(e,t,r){var n=e("../../modules/$");e("../../modules/es6.object.get-own-property-descriptor"),t.exports=function(e,t){return n.getDesc(e,t)}},{"../../modules/$":56,"../../modules/es6.object.get-own-property-descriptor":81}],21:[function(e,t,r){e("../../modules/es6.object.get-prototype-of"),t.exports=e("../../modules/$.core").Object.getPrototypeOf},{"../../modules/$.core":31,"../../modules/es6.object.get-prototype-of":82}],22:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/$.core").Object.keys},{"../../modules/$.core":31,"../../modules/es6.object.keys":83}],23:[function(e,t,r){e("../../modules/es6.object.set-prototype-of"),t.exports=e("../../modules/$.core").Object.setPrototypeOf},{"../../modules/$.core":31,"../../modules/es6.object.set-prototype-of":84}],24:[function(e,t,r){e("../modules/es6.object.to-string"),e("../modules/es6.string.iterator"),e("../modules/web.dom.iterable"),e("../modules/es6.promise"),t.exports=e("../modules/$.core").Promise},{"../modules/$.core":31,"../modules/es6.object.to-string":85,"../modules/es6.promise":86,"../modules/es6.string.iterator":87,"../modules/web.dom.iterable":89}],25:[function(e,t,r){e("../../modules/es6.symbol"),e("../../modules/es6.object.to-string"),t.exports=e("../../modules/$.core").Symbol},{"../../modules/$.core":31,"../../modules/es6.object.to-string":85,"../../modules/es6.symbol":88}],26:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],27:[function(e,t,r){t.exports=function(){}},{}],28:[function(e,t,r){var n=e("./$.is-object");t.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},{"./$.is-object":49}],29:[function(e,t,r){var n=e("./$.cof"),o=e("./$.wks")("toStringTag"),i="Arguments"==n(function(){return arguments}());t.exports=function(e){var t,r,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=(t=Object(e))[o])?r:i?n(t):"Object"==(s=n(t))&&"function"==typeof t.callee?"Arguments":s}},{"./$.cof":30,"./$.wks":78}],30:[function(e,t,r){var n={}.toString;t.exports=function(e){return n.call(e).slice(8,-1)}},{}],31:[function(e,t,r){var n=t.exports={version:"1.2.6"};"number"==typeof __e&&(__e=n)},{}],32:[function(e,t,r){var n=e("./$.a-function");t.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},{"./$.a-function":26}],33:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],34:[function(e,t,r){t.exports=!e("./$.fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./$.fails":38}],35:[function(e,t,r){var n=e("./$.is-object"),o=e("./$.global").document,i=n(o)&&n(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./$.global":41,"./$.is-object":49}],36:[function(e,t,r){var n=e("./$");t.exports=function(e){var t=n.getKeys(e),r=n.getSymbols;if(r)for(var o,i=r(e),s=n.isEnum,a=0;i.length>a;)s.call(e,o=i[a++])&&t.push(o);return t}},{"./$":56}],37:[function(e,t,r){var n=e("./$.global"),o=e("./$.core"),i=e("./$.ctx"),s="prototype",a=function(e,t,r){var c,u,l,f=e&a.F,d=e&a.G,p=e&a.S,b=e&a.P,h=e&a.B,y=e&a.W,v=d?o:o[t]||(o[t]={}),_=d?n:p?n[t]:(n[t]||{})[s];d&&(r=t);for(c in r)u=!f&&_&&c in _,u&&c in v||(l=u?_[c]:r[c],v[c]=d&&"function"!=typeof _[c]?r[c]:h&&u?i(l,n):y&&_[c]==l?function(e){var t=function(t){return this instanceof e?new e(t):e(t)};return t[s]=e[s],t}(l):b&&"function"==typeof l?i(Function.call,l):l,b&&((v[s]||(v[s]={}))[c]=l))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,t.exports=a},{"./$.core":31,"./$.ctx":32,"./$.global":41}],38:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],39:[function(e,t,r){var n=e("./$.ctx"),o=e("./$.iter-call"),i=e("./$.is-array-iter"),s=e("./$.an-object"),a=e("./$.to-length"),c=e("./core.get-iterator-method");t.exports=function(e,t,r,u){var l,f,d,p=c(e),b=n(r,u,t?2:1),h=0;if("function"!=typeof p)throw TypeError(e+" is not iterable!");if(i(p))for(l=a(e.length);l>h;h++)t?b(s(f=e[h])[0],f[1]):b(e[h]);else for(d=p.call(e);!(f=d.next()).done;)o(d,b,f.value,t)}},{"./$.an-object":28,"./$.ctx":32,"./$.is-array-iter":47,"./$.iter-call":50,"./$.to-length":75,"./core.get-iterator-method":79}],40:[function(e,t,r){var n=e("./$.to-iobject"),o=e("./$").getNames,i={}.toString,s="object"==typeof window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return o(e)}catch(t){return s.slice()}};t.exports.get=function(e){return s&&"[object Window]"==i.call(e)?a(e):o(n(e))}},{"./$":56,"./$.to-iobject":74}],41:[function(e,t,r){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],42:[function(e,t,r){var n={}.hasOwnProperty;t.exports=function(e,t){return n.call(e,t)}},{}],43:[function(e,t,r){var n=e("./$"),o=e("./$.property-desc");t.exports=e("./$.descriptors")?function(e,t,r){return n.setDesc(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},{"./$":56,"./$.descriptors":34,"./$.property-desc":61}],44:[function(e,t,r){t.exports=e("./$.global").document&&document.documentElement},{"./$.global":41}],45:[function(e,t,r){t.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},{}],46:[function(e,t,r){var n=e("./$.cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},{"./$.cof":30}],47:[function(e,t,r){var n=e("./$.iterators"),o=e("./$.wks")("iterator"),i=Array.prototype;t.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},{"./$.iterators":55,"./$.wks":78}],48:[function(e,t,r){var n=e("./$.cof");t.exports=Array.isArray||function(e){return"Array"==n(e)}},{"./$.cof":30}],49:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],50:[function(e,t,r){var n=e("./$.an-object");t.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(i){var s=e["return"];throw void 0!==s&&n(s.call(e)),i}}},{"./$.an-object":28}],51:[function(e,t,r){"use strict";var n=e("./$"),o=e("./$.property-desc"),i=e("./$.set-to-string-tag"),s={};e("./$.hide")(s,e("./$.wks")("iterator"),function(){return this}),t.exports=function(e,t,r){e.prototype=n.create(s,{next:o(1,r)}),i(e,t+" Iterator")}},{"./$":56,"./$.hide":43,"./$.property-desc":61,"./$.set-to-string-tag":67,"./$.wks":78}],52:[function(e,t,r){"use strict";var n=e("./$.library"),o=e("./$.export"),i=e("./$.redefine"),s=e("./$.hide"),a=e("./$.has"),c=e("./$.iterators"),u=e("./$.iter-create"),l=e("./$.set-to-string-tag"),f=e("./$").getProto,d=e("./$.wks")("iterator"),p=!([].keys&&"next"in[].keys()),b="@@iterator",h="keys",y="values",v=function(){return this};t.exports=function(e,t,r,_,g,m,j){u(r,t,_);var $,w,O=function(e){if(!p&&e in E)return E[e];switch(e){case h:return function(){return new r(this,e)};case y:return function(){return new r(this,e)}}return function(){return new r(this,e)}},k=t+" Iterator",x=g==y,C=!1,E=e.prototype,S=E[d]||E[b]||g&&E[g],T=S||O(g);if(S){var R=f(T.call(new e));l(R,k,!0),!n&&a(E,b)&&s(R,d,v),x&&S.name!==y&&(C=!0,T=function(){return S.call(this)})}if(n&&!j||!p&&!C&&E[d]||s(E,d,T),c[t]=T,c[k]=v,g)if($={values:x?T:O(y),keys:m?T:O(h),entries:x?O("entries"):T},j)for(w in $)w in E||i(E,w,$[w]);else o(o.P+o.F*(p||C),t,$);return $}},{"./$":56,"./$.export":37,"./$.has":42,"./$.hide":43,"./$.iter-create":51,"./$.iterators":55,"./$.library":58,"./$.redefine":63,"./$.set-to-string-tag":67,"./$.wks":78}],53:[function(e,t,r){var n=e("./$.wks")("iterator"),o=!1;try{var i=[7][n]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(s){}t.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){r=!0},i[n]=function(){return s},e(i)}catch(a){}return r}},{"./$.wks":78}],54:[function(e,t,r){t.exports=function(e,t){return{value:t,done:!!e}}},{}],55:[function(e,t,r){t.exports={}},{}],56:[function(e,t,r){var n=Object;t.exports={create:n.create,getProto:n.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:n.getOwnPropertyDescriptor,setDesc:n.defineProperty,setDescs:n.defineProperties,getKeys:n.keys,getNames:n.getOwnPropertyNames,getSymbols:n.getOwnPropertySymbols,each:[].forEach}},{}],57:[function(e,t,r){var n=e("./$"),o=e("./$.to-iobject");t.exports=function(e,t){for(var r,i=o(e),s=n.getKeys(i),a=s.length,c=0;a>c;)if(i[r=s[c++]]===t)return r}},{"./$":56,"./$.to-iobject":74}],58:[function(e,t,r){t.exports=!0},{}],59:[function(e,t,r){var n,o,i,s=e("./$.global"),a=e("./$.task").set,c=s.MutationObserver||s.WebKitMutationObserver,u=s.process,l=s.Promise,f="process"==e("./$.cof")(u),d=function(){var e,t,r;for(f&&(e=u.domain)&&(u.domain=null,e.exit());n;)t=n.domain,r=n.fn,t&&t.enter(),r(),t&&t.exit(),n=n.next;o=void 0,e&&e.enter()};if(f)i=function(){u.nextTick(d)};else if(c){var p=1,b=document.createTextNode("");new c(d).observe(b,{characterData:!0}),i=function(){b.data=p=-p}}else i=l&&l.resolve?function(){l.resolve().then(d)}:function(){a.call(s,d)};t.exports=function(e){var t={fn:e,next:void 0,domain:f&&u.domain};o&&(o.next=t),n||(n=t,i()),o=t}},{"./$.cof":30,"./$.global":41,"./$.task":72}],60:[function(e,t,r){var n=e("./$.export"),o=e("./$.core"),i=e("./$.fails");t.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},{"./$.core":31,"./$.export":37,"./$.fails":38}],61:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],62:[function(e,t,r){var n=e("./$.redefine");t.exports=function(e,t){for(var r in t)n(e,r,t[r]);return e}},{"./$.redefine":63}],63:[function(e,t,r){t.exports=e("./$.hide")},{"./$.hide":43}],64:[function(e,t,r){t.exports=Object.is||function(e,t){return e===t?0!==e||1/e===1/t:e!=e&&t!=t}},{}],65:[function(e,t,r){var n=e("./$").getDesc,o=e("./$.is-object"),i=e("./$.an-object"),s=function(e,t){if(i(e),!o(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,o){try{o=e("./$.ctx")(Function.call,n(Object.prototype,"__proto__").set,2),o(t,[]),r=!(t instanceof Array)}catch(i){r=!0}return function(e,t){return s(e,t),r?e.__proto__=t:o(e,t),e}}({},!1):void 0),check:s}},{"./$":56,"./$.an-object":28,"./$.ctx":32,"./$.is-object":49}],66:[function(e,t,r){"use strict";var n=e("./$.core"),o=e("./$"),i=e("./$.descriptors"),s=e("./$.wks")("species");t.exports=function(e){var t=n[e];i&&t&&!t[s]&&o.setDesc(t,s,{configurable:!0,get:function(){return this}})}},{"./$":56,"./$.core":31,"./$.descriptors":34,"./$.wks":78}],67:[function(e,t,r){var n=e("./$").setDesc,o=e("./$.has"),i=e("./$.wks")("toStringTag");t.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},{"./$":56,"./$.has":42,"./$.wks":78}],68:[function(e,t,r){var n=e("./$.global"),o="__core-js_shared__",i=n[o]||(n[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./$.global":41}],69:[function(e,t,r){var n=e("./$.an-object"),o=e("./$.a-function"),i=e("./$.wks")("species");t.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},{"./$.a-function":26,"./$.an-object":28,"./$.wks":78}],70:[function(e,t,r){t.exports=function(e,t,r){if(!(e instanceof t))throw TypeError(r+": use the 'new' operator!");return e}},{}],71:[function(e,t,r){var n=e("./$.to-integer"),o=e("./$.defined");t.exports=function(e){return function(t,r){var i,s,a=String(o(t)),c=n(r),u=a.length;return 0>c||c>=u?e?"":void 0:(i=a.charCodeAt(c),55296>i||i>56319||c+1===u||(s=a.charCodeAt(c+1))<56320||s>57343?e?a.charAt(c):i:e?a.slice(c,c+2):(i-55296<<10)+(s-56320)+65536)}}},{"./$.defined":33,"./$.to-integer":73}],72:[function(e,t,r){var n,o,i,s=e("./$.ctx"),a=e("./$.invoke"),c=e("./$.html"),u=e("./$.dom-create"),l=e("./$.global"),f=l.process,d=l.setImmediate,p=l.clearImmediate,b=l.MessageChannel,h=0,y={},v="onreadystatechange",_=function(){var e=+this;if(y.hasOwnProperty(e)){var t=y[e];delete y[e],t()}},g=function(e){_.call(e.data)};d&&p||(d=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return y[++h]=function(){a("function"==typeof e?e:Function(e),t)},n(h),h},p=function(e){delete y[e]},"process"==e("./$.cof")(f)?n=function(e){f.nextTick(s(_,e,1))}:b?(o=new b,i=o.port2,o.port1.onmessage=g,n=s(i.postMessage,i,1)):l.addEventListener&&"function"==typeof postMessage&&!l.importScripts?(n=function(e){l.postMessage(e+"","*")},l.addEventListener("message",g,!1)):n=v in u("script")?function(e){c.appendChild(u("script"))[v]=function(){c.removeChild(this),_.call(e)}}:function(e){setTimeout(s(_,e,1),0)}),t.exports={set:d,clear:p}},{"./$.cof":30,"./$.ctx":32,"./$.dom-create":35,"./$.global":41,"./$.html":44,"./$.invoke":45}],73:[function(e,t,r){var n=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:n)(e)}},{}],74:[function(e,t,r){var n=e("./$.iobject"),o=e("./$.defined");t.exports=function(e){return n(o(e))}},{"./$.defined":33,"./$.iobject":46}],75:[function(e,t,r){var n=e("./$.to-integer"),o=Math.min;t.exports=function(e){return e>0?o(n(e),9007199254740991):0}},{"./$.to-integer":73}],76:[function(e,t,r){var n=e("./$.defined");t.exports=function(e){return Object(n(e))}},{"./$.defined":33}],77:[function(e,t,r){var n=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+o).toString(36))}},{}],78:[function(e,t,r){var n=e("./$.shared")("wks"),o=e("./$.uid"),i=e("./$.global").Symbol;t.exports=function(e){return n[e]||(n[e]=i&&i[e]||(i||o)("Symbol."+e))}},{"./$.global":41,"./$.shared":68,"./$.uid":77}],79:[function(e,t,r){var n=e("./$.classof"),o=e("./$.wks")("iterator"),i=e("./$.iterators");t.exports=e("./$.core").getIteratorMethod=function(e){return void 0!=e?e[o]||e["@@iterator"]||i[n(e)]:void 0}},{"./$.classof":29,"./$.core":31,"./$.iterators":55,"./$.wks":78}],80:[function(e,t,r){"use strict";var n=e("./$.add-to-unscopables"),o=e("./$.iter-step"),i=e("./$.iterators"),s=e("./$.to-iobject");t.exports=e("./$.iter-define")(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./$.add-to-unscopables":27,"./$.iter-define":52,"./$.iter-step":54,"./$.iterators":55,"./$.to-iobject":74}],81:[function(e,t,r){var n=e("./$.to-iobject");e("./$.object-sap")("getOwnPropertyDescriptor",function(e){return function(t,r){return e(n(t),r)}})},{"./$.object-sap":60,"./$.to-iobject":74}],82:[function(e,t,r){var n=e("./$.to-object");e("./$.object-sap")("getPrototypeOf",function(e){return function(t){return e(n(t))}})},{"./$.object-sap":60,"./$.to-object":76}],83:[function(e,t,r){var n=e("./$.to-object");e("./$.object-sap")("keys",function(e){return function(t){return e(n(t))}})},{"./$.object-sap":60,"./$.to-object":76}],84:[function(e,t,r){var n=e("./$.export");n(n.S,"Object",{setPrototypeOf:e("./$.set-proto").set})},{"./$.export":37,"./$.set-proto":65}],85:[function(e,t,r){},{}],86:[function(e,t,r){"use strict";var n,o=e("./$"),i=e("./$.library"),s=e("./$.global"),a=e("./$.ctx"),c=e("./$.classof"),u=e("./$.export"),l=e("./$.is-object"),f=e("./$.an-object"),d=e("./$.a-function"),p=e("./$.strict-new"),b=e("./$.for-of"),h=e("./$.set-proto").set,y=e("./$.same-value"),v=e("./$.wks")("species"),_=e("./$.species-constructor"),g=e("./$.microtask"),m="Promise",j=s.process,$="process"==c(j),w=s[m],O=function(e){var t=new w(function(){});return e&&(t.constructor=Object),w.resolve(t)===t},k=function(){function t(e){var r=new w(e);return h(r,t.prototype),r}var r=!1;try{if(r=w&&w.resolve&&O(),h(t,w),t.prototype=o.create(w.prototype,{constructor:{value:t}}),t.resolve(5).then(function(){})instanceof t||(r=!1),r&&e("./$.descriptors")){var n=!1;w.resolve(o.setDesc({},"then",{get:function(){n=!0}})),r=n}}catch(i){r=!1}return r}(),x=function(e,t){return i&&e===w&&t===n?!0:y(e,t)},C=function(e){var t=f(e)[v];return void 0!=t?t:e},E=function(e){var t;return l(e)&&"function"==typeof(t=e.then)?t:!1},S=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n}),this.resolve=d(t),this.reject=d(r)},T=function(e){try{e()}catch(t){return{error:t}}},R=function(e,t){if(!e.n){e.n=!0;var r=e.c;g(function(){for(var n=e.v,o=1==e.s,i=0,a=function(t){var r,i,s=o?t.ok:t.fail,a=t.resolve,c=t.reject;try{s?(o||(e.h=!0),r=s===!0?n:s(n),r===t.promise?c(TypeError("Promise-chain cycle")):(i=E(r))?i.call(r,a,c):a(r)):c(n)}catch(u){c(u)}};r.length>i;)a(r[i++]);r.length=0,e.n=!1,t&&setTimeout(function(){var t,r,o=e.p;M(o)&&($?j.emit("unhandledRejection",n,o):(t=s.onunhandledrejection)?t({promise:o,reason:n}):(r=s.console)&&r.error&&r.error("Unhandled promise rejection",n)),e.a=void 0},1)})}},M=function(e){var t,r=e._d,n=r.a||r.c,o=0;if(r.h)return!1;for(;n.length>o;)if(t=n[o++],t.fail||!M(t.promise))return!1;return!0},D=function(e){var t=this;t.d||(t.d=!0,t=t.r||t,t.v=e,t.s=2,t.a=t.c.slice(),R(t,!0))},N=function(e){var t,r=this;if(!r.d){r.d=!0,r=r.r||r;try{if(r.p===e)throw TypeError("Promise can't be resolved itself");(t=E(e))?g(function(){var n={r:r,d:!1};try{t.call(e,a(N,n,1),a(D,n,1))}catch(o){D.call(n,o)}}):(r.v=e,r.s=1,R(r,!1))}catch(n){D.call({r:r,d:!1},n)}}};k||(w=function(e){d(e);var t=this._d={p:p(this,w,m),c:[],a:void 0,s:0,d:!1,v:void 0,h:!1,n:!1};try{e(a(N,t,1),a(D,t,1))}catch(r){D.call(t,r)}},e("./$.redefine-all")(w.prototype,{then:function(e,t){var r=new S(_(this,w)),n=r.promise,o=this._d;return r.ok="function"==typeof e?e:!0,r.fail="function"==typeof t&&t,o.c.push(r),o.a&&o.a.push(r),o.s&&R(o,!1),n},"catch":function(e){return this.then(void 0,e)}})),u(u.G+u.W+u.F*!k,{Promise:w}),e("./$.set-to-string-tag")(w,m),e("./$.set-species")(m),n=e("./$.core")[m],u(u.S+u.F*!k,m,{reject:function(e){var t=new S(this),r=t.reject;return r(e),t.promise}}),u(u.S+u.F*(!k||O(!0)),m,{resolve:function(e){if(e instanceof w&&x(e.constructor,this))return e;var t=new S(this),r=t.resolve;return r(e),t.promise}}),u(u.S+u.F*!(k&&e("./$.iter-detect")(function(e){w.all(e)["catch"](function(){})})),m,{all:function(e){var t=C(this),r=new S(t),n=r.resolve,i=r.reject,s=[],a=T(function(){b(e,!1,s.push,s);var r=s.length,a=Array(r);r?o.each.call(s,function(e,o){var s=!1;t.resolve(e).then(function(e){s||(s=!0,a[o]=e,--r||n(a))},i)}):n(a)});return a&&i(a.error),r.promise},race:function(e){var t=C(this),r=new S(t),n=r.reject,o=T(function(){b(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},{"./$":56,"./$.a-function":26,"./$.an-object":28,"./$.classof":29,"./$.core":31,"./$.ctx":32,"./$.descriptors":34,"./$.export":37,"./$.for-of":39,"./$.global":41,"./$.is-object":49,"./$.iter-detect":53,"./$.library":58,"./$.microtask":59,"./$.redefine-all":62,"./$.same-value":64,"./$.set-proto":65,"./$.set-species":66,"./$.set-to-string-tag":67,"./$.species-constructor":69,"./$.strict-new":70,"./$.wks":78}],87:[function(e,t,r){"use strict";var n=e("./$.string-at")(!0);e("./$.iter-define")(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},{"./$.iter-define":52,"./$.string-at":71}],88:[function(e,t,r){"use strict";var n=e("./$"),o=e("./$.global"),i=e("./$.has"),s=e("./$.descriptors"),a=e("./$.export"),c=e("./$.redefine"),u=e("./$.fails"),l=e("./$.shared"),f=e("./$.set-to-string-tag"),d=e("./$.uid"),p=e("./$.wks"),b=e("./$.keyof"),h=e("./$.get-names"),y=e("./$.enum-keys"),v=e("./$.is-array"),_=e("./$.an-object"),g=e("./$.to-iobject"),m=e("./$.property-desc"),j=n.getDesc,$=n.setDesc,w=n.create,O=h.get,k=o.Symbol,x=o.JSON,C=x&&x.stringify,E=!1,S=p("_hidden"),T=n.isEnum,R=l("symbol-registry"),M=l("symbols"),D="function"==typeof k,N=Object.prototype,P=s&&u(function(){return 7!=w($({},"a",{get:function(){return $(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=j(N,t);n&&delete N[t],$(e,t,r),n&&e!==N&&$(N,t,n)}:$,A=function(e){var t=M[e]=w(k.prototype);return t._k=e,s&&E&&P(N,e,{configurable:!0,set:function(t){i(this,S)&&i(this[S],e)&&(this[S][e]=!1),P(this,e,m(1,t))}}),t},L=function(e){return"symbol"==typeof e},F=function(e,t,r){return r&&i(M,t)?(r.enumerable?(i(e,S)&&e[S][t]&&(e[S][t]=!1),r=w(r,{enumerable:m(0,!1)})):(i(e,S)||$(e,S,m(1,{})),e[S][t]=!0),P(e,t,r)):$(e,t,r)},I=function(e,t){_(e);for(var r,n=y(t=g(t)),o=0,i=n.length;i>o;)F(e,r=n[o++],t[r]);return e},V=function(e,t){return void 0===t?w(e):I(w(e),t)},U=function(e){var t=T.call(this,e);return t||!i(this,e)||!i(M,e)||i(this,S)&&this[S][e]?t:!0},z=function(e,t){var r=j(e=g(e),t);return!r||!i(M,t)||i(e,S)&&e[S][t]||(r.enumerable=!0),r},H=function(e){for(var t,r=O(g(e)),n=[],o=0;r.length>o;)i(M,t=r[o++])||t==S||n.push(t);return n},B=function(e){for(var t,r=O(g(e)),n=[],o=0;r.length>o;)i(M,t=r[o++])&&n.push(M[t]);return n},J=function(e){if(void 0!==e&&!L(e)){for(var t,r,n=[e],o=1,i=arguments;i.length>o;)n.push(i[o++]);return t=n[1],"function"==typeof t&&(r=t),!r&&v(t)||(t=function(e,t){return r&&(t=r.call(this,e,t)),L(t)?void 0:t}),n[1]=t,C.apply(x,n)}},W=u(function(){var e=k();return"[null]"!=C([e])||"{}"!=C({a:e})||"{}"!=C(Object(e))});D||(k=function(){if(L(this))throw TypeError("Symbol is not a constructor");return A(d(arguments.length>0?arguments[0]:void 0))},c(k.prototype,"toString",function(){return this._k}),L=function(e){return e instanceof k},n.create=V,n.isEnum=U,n.getDesc=z,n.setDesc=F,n.setDescs=I,n.getNames=h.get=H,n.getSymbols=B,s&&!e("./$.library")&&c(N,"propertyIsEnumerable",U,!0));var Y={"for":function(e){return i(R,e+="")?R[e]:R[e]=k(e)},keyFor:function(e){return b(R,e)},useSetter:function(){E=!0},useSimple:function(){E=!1}};n.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),function(e){var t=p(e);Y[e]=D?t:A(t)}),E=!0,a(a.G+a.W,{Symbol:k}),a(a.S,"Symbol",Y),a(a.S+a.F*!D,"Object",{create:V,defineProperty:F,defineProperties:I,getOwnPropertyDescriptor:z,getOwnPropertyNames:H,getOwnPropertySymbols:B}),x&&a(a.S+a.F*(!D||W),"JSON",{stringify:J}),f(k,"Symbol"),f(Math,"Math",!0),f(o.JSON,"JSON",!0)},{"./$":56,"./$.an-object":28,"./$.descriptors":34,"./$.enum-keys":36,"./$.export":37,"./$.fails":38,"./$.get-names":40,"./$.global":41,"./$.has":42,"./$.is-array":48,"./$.keyof":57,"./$.library":58,"./$.property-desc":61,"./$.redefine":63,"./$.set-to-string-tag":67,"./$.shared":68,"./$.to-iobject":74,"./$.uid":77,"./$.wks":78}],89:[function(e,t,r){e("./es6.array.iterator");var n=e("./$.iterators");n.NodeList=n.HTMLCollection=n.Array},{"./$.iterators":55,"./es6.array.iterator":80}],90:[function(e,t,r){window.MutationObserver=window.MutationObserver||window.WebKitMutationObserver||function(e){function t(e){this.g=[],this.k=e}function r(e){!function r(){var n=e.takeRecords();n.length&&e.k(n,e),e.f=setTimeout(r,t._period)}()}function n(t){var r,n={type:null,target:null,addedNodes:[],removedNodes:[],previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null};for(r in t)n[r]!==e&&t[r]!==e&&(n[r]=t[r]);return n}function o(e,t){var r=a(e,t);return function(n){var o,c=n.length;t.a&&r.a&&i(n,e,r.a,t.d),(t.b||t.e)&&(o=s(n,e,r,t)),(o||n.length!==c)&&(r=a(e,t))}}function i(t,r,o,i){for(var s,a,c={},u=r.attributes,l=u.length;l--;)s=u[l],a=s.name,i&&i[a]===e||(s.value!==o[a]&&t.push(n({type:"attributes",target:r,attributeName:a,oldValue:o[a],attributeNamespace:s.namespaceURI})),c[a]=!0);for(a in o)c[a]||t.push(n({target:r,type:"attributes",attributeName:a,oldValue:o[a]}))}function s(t,r,o,s){function a(e,r,o,a,c){var l=e.length-1;c=-~((l-c)/2);for(var f,d,p;p=e.pop();)f=o[p.h],d=a[p.i],s.b&&c&&Math.abs(p.h-p.i)>=l&&(t.push(n({type:"childList",target:r,addedNodes:[f],removedNodes:[f],nextSibling:f.nextSibling,previousSibling:f.previousSibling})),c--),s.a&&d.a&&i(t,f,d.a,s.d),s.c&&3===f.nodeType&&f.nodeValue!==d.c&&t.push(n({type:"characterData",target:f})),s.e&&u(f,d)}function u(r,o){for(var d,p,b,h,y,v=r.childNodes,_=o.b,g=v.length,m=_?_.length:0,j=0,$=0,w=0;g>$||m>w;)h=v[$],y=(b=_[w])&&b.j,h===y?(s.a&&b.a&&i(t,h,b.a,s.d),s.c&&b.c!==e&&h.nodeValue!==b.c&&t.push(n({type:"characterData",target:h})),p&&a(p,r,v,_,j),s.e&&(h.childNodes.length||b.b&&b.b.length)&&u(h,b),$++,w++):(l=!0,d||(d={},p=[]),h&&(d[b=c(h)]||(d[b]=!0,-1===(b=f(_,h,w,"j"))?s.b&&(t.push(n({type:"childList",target:r,addedNodes:[h],nextSibling:h.nextSibling,previousSibling:h.previousSibling})),j++):p.push({h:$,i:b})),$++),y&&y!==v[$]&&(d[b=c(y)]||(d[b]=!0,-1===(b=f(v,y,$))?s.b&&(t.push(n({type:"childList",target:o.j,removedNodes:[y],nextSibling:_[w+1],previousSibling:_[w-1]})),j--):p.push({h:b,i:w})),w++));p&&a(p,r,v,_,j)}var l;return u(r,o),l}function a(e,t){var r=!0;return function n(e){var o={j:e};return!t.c||3!==e.nodeType&&8!==e.nodeType?(t.a&&r&&1===e.nodeType&&(o.a=l(e.attributes,function(e,r){return t.d&&!t.d[r.name]||(e[r.name]=r.value),e})),r&&(t.b||t.c||t.a&&t.e)&&(o.b=u(e.childNodes,n)),r=t.e):o.c=e.nodeValue,o}(e)}function c(e){try{return e.id||(e.mo_id=e.mo_id||d++)}catch(t){try{return e.nodeValue}catch(r){return d++}}}function u(e,t){for(var r=[],n=0;n<e.length;n++)r[n]=t(e[n],n,e);return r}function l(e,t){for(var r={},n=0;n<e.length;n++)r=t(r,e[n],n,e);return r}function f(e,t,r,n){for(;r<e.length;r++)if((n?e[r][n]:e[r])===t)return r;return-1}t._period=30,t.prototype={observe:function(e,t){for(var n={a:!!(t.attributes||t.attributeFilter||t.attributeOldValue),b:!!t.childList,e:!!t.subtree,c:!(!t.characterData&&!t.characterDataOldValue)},i=this.g,s=0;s<i.length;s++)i[s].m===e&&i.splice(s,1);t.attributeFilter&&(n.d=l(t.attributeFilter,function(e,t){
return e[t]=!0,e})),i.push({m:e,l:o(e,n)}),this.f||r(this)},takeRecords:function(){for(var e=[],t=this.g,r=0;r<t.length;r++)t[r].l(e);return e},disconnect:function(){this.g=[],clearTimeout(this.f),this.f=null}};var d=1;return t}(void 0)},{}],91:[function(e,t,r){Object.observe||function(e,t,r,n){"use strict";var o,i,s=["add","update","delete","reconfigure","setPrototype","preventExtensions"],a=t.isArray||function(e){return function(t){return"[object Array]"===e.call(t)}}(e.prototype.toString),c=t.prototype.indexOf?t.indexOf||function(e,r,n){return t.prototype.indexOf.call(e,r,n)}:function(e,t,r){for(var n=r||0;n<e.length;n++)if(e[n]===t)return n;return-1},u=r.Map!==n&&Map.prototype.forEach?function(){return new Map}:function(){var e=[],t=[];return{size:0,has:function(t){return c(e,t)>-1},get:function(r){return t[c(e,r)]},set:function(r,n){var o=c(e,r);-1===o?(e.push(r),t.push(n),this.size++):t[o]=n},"delete":function(r){var n=c(e,r);n>-1&&(e.splice(n,1),t.splice(n,1),this.size--)},forEach:function(r){for(var n=0;n<e.length;n++)r.call(arguments[1],t[n],e[n],this)}}},l=e.getOwnPropertyNames?function(){var t=e.getOwnPropertyNames;try{arguments.callee}catch(r){var n=(t(c).join(" ")+" ").replace(/prototype |length |name /g,"").slice(0,-1).split(" ");n.length&&(t=function(t){var r=e.getOwnPropertyNames(t);if("function"==typeof t)for(var o,i=0;i<n.length;)(o=c(r,n[i++]))>-1&&r.splice(o,1);return r})}return t}():function(t){var r,n,o=[];if("hasOwnProperty"in t)for(r in t)t.hasOwnProperty(r)&&o.push(r);else{n=e.hasOwnProperty;for(r in t)n.call(t,r)&&o.push(r)}return a(t)&&o.push("length"),o},f=e.getPrototypeOf,d=e.defineProperties&&e.getOwnPropertyDescriptor,p=r.requestAnimationFrame||r.webkitRequestAnimationFrame||function(){var e=+new Date,t=e;return function(r){return setTimeout(function(){r((t=+new Date)-e)},17)}}(),b=function(e,t,r){var n=o.get(e);n?(y(n,e),m(e,n,t,r)):(n=h(e),m(e,n,t,r),1===o.size&&p(v))},h=function(t,r){var n,i=l(t),s=[],a=0,r={handlers:u(),frozen:e.isFrozen?e.isFrozen(t):!1,extensible:e.isExtensible?e.isExtensible(t):!0,proto:f&&f(t),properties:i,values:s,notifier:g(t,r)};if(d)for(n=r.descriptors=[];a<i.length;)n[a]=d(t,i[a]),s[a]=t[i[a++]];else for(;a<i.length;)s[a]=t[i[a++]];return o.set(t,r),r},y=function(){var t=d?function(e,t,r,n,o){var i=t.properties[r],s=e[i],a=t.values[r],c=t.descriptors[r];"value"in o&&(a===s?0===a&&1/a!==1/s:a===a||s===s)&&(j(e,t,{name:i,type:"update",object:e,oldValue:a},n),t.values[r]=s),!c.configurable||o.configurable&&o.writable===c.writable&&o.enumerable===c.enumerable&&o.get===c.get&&o.set===c.set||(j(e,t,{name:i,type:"reconfigure",object:e,oldValue:a},n),t.descriptors[r]=o)}:function(e,t,r,n){var o=t.properties[r],i=e[o],s=t.values[r];(s===i?0===s&&1/s!==1/i:s===s||i===i)&&(j(e,t,{name:o,type:"update",object:e,oldValue:s},n),t.values[r]=i)},r=d?function(e,r,n,o,i){for(var s,a=r.length;n&&a--;)null!==r[a]&&(s=d(e,r[a]),n--,s?t(e,o,a,i,s):(j(e,o,{name:r[a],type:"delete",object:e,oldValue:o.values[a]},i),o.properties.splice(a,1),o.values.splice(a,1),o.descriptors.splice(a,1)))}:function(e,t,r,n,o){for(var i=t.length;r&&i--;)null!==t[i]&&(j(e,n,{name:t[i],type:"delete",object:e,oldValue:n.values[i]},o),n.properties.splice(i,1),n.values.splice(i,1),r--)};return function(n,o,i){if(n.handlers.size&&!n.frozen){var s,a,u,p,b,h,y,v,_=n.values,g=n.descriptors,m=0;if(n.extensible)if(s=n.properties.slice(),a=s.length,u=l(o),g){for(;m<u.length;)b=u[m++],p=c(s,b),v=d(o,b),-1===p?(j(o,n,{name:b,type:"add",object:o},i),n.properties.push(b),_.push(o[b]),g.push(v)):(s[p]=null,a--,t(o,n,p,i,v));r(o,s,a,n,i),e.isExtensible(o)||(n.extensible=!1,j(o,n,{type:"preventExtensions",object:o},i),n.frozen=e.isFrozen(o))}else{for(;m<u.length;)b=u[m++],p=c(s,b),h=o[b],-1===p?(j(o,n,{name:b,type:"add",object:o},i),n.properties.push(b),_.push(h)):(s[p]=null,a--,t(o,n,p,i));r(o,s,a,n,i)}else if(!n.frozen){for(;m<s.length;m++)b=s[m],t(o,n,m,i,d(o,b));e.isFrozen(o)&&(n.frozen=!0)}f&&(y=f(o),y!==n.proto&&(j(o,n,{type:"setPrototype",name:"__proto__",object:o,oldValue:n.proto}),n.proto=y))}}}(),v=function(){o.size&&(o.forEach(y),i.forEach(_),p(v))},_=function(e,t){var r=e.changeRecords;r.length&&(e.changeRecords=[],t(r))},g=function(e,t){return arguments.length<2&&(t=o.get(e)),t&&t.notifier||{notify:function(t){t.type;var r=o.get(e);if(r){var n,i={object:e};for(n in t)"object"!==n&&(i[n]=t[n]);j(e,r,i)}},performChange:function(t,r){if("string"!=typeof t)throw new TypeError("Invalid non-string changeType");if("function"!=typeof r)throw new TypeError("Cannot perform non-function");var i,s,a=o.get(e),c=arguments[2],u=c===n?r():r.call(c);if(a&&y(a,e,t),a&&u&&"object"==typeof u){s={object:e,type:t};for(i in u)"object"!==i&&"type"!==i&&(s[i]=u[i]);j(e,a,s)}}}},m=function(e,t,r,n){var o=i.get(r);o||i.set(r,o={observed:u(),changeRecords:[]}),o.observed.set(e,{acceptList:n.slice(),data:t}),t.handlers.set(r,o)},j=function(e,t,r,n){t.handlers.forEach(function(t){var o=t.observed.get(e).acceptList;("string"!=typeof n||-1===c(o,n))&&c(o,r.type)>-1&&t.changeRecords.push(r)})};o=u(),i=u(),e.observe=function(t,r,o){if(!t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.observe cannot observe non-object");if("function"!=typeof r)throw new TypeError("Object.observe cannot deliver to non-function");if(e.isFrozen&&e.isFrozen(r))throw new TypeError("Object.observe cannot deliver to a frozen function object");if(o===n)o=s;else if(!o||"object"!=typeof o)throw new TypeError("Third argument to Object.observe must be an array of strings.");return b(t,r,o),t},e.unobserve=function(e,t){if(null===e||"object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object.unobserve cannot unobserve non-object");if("function"!=typeof t)throw new TypeError("Object.unobserve cannot deliver to non-function");var r,n=i.get(t);return n&&(r=n.observed.get(e))&&(n.observed.forEach(function(e,t){y(e.data,t)}),p(function(){_(n,t)}),1===n.observed.size&&n.observed.has(e)?i["delete"](t):n.observed["delete"](e),1===r.data.handlers.size?o["delete"](e):r.data.handlers["delete"](t)),e},e.getNotifier=function(t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object.getNotifier cannot getNotifier non-object");return e.isFrozen&&e.isFrozen(t)?null:g(t)},e.deliverChangeRecords=function(e){if("function"!=typeof e)throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");var t=i.get(e);t&&(t.observed.forEach(function(e,t){y(e.data,t)}),_(t,e))}}(Object,Array,this)},{}],92:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0}),r.DataObjectObserver=r.DataObjectReporter=r.Syncher=void 0,e("mutationobserver-shim"),e("object.observe"),e("array.observe");var o=e("./syncher/Syncher"),i=n(o),s=e("./syncher/DataObjectReporter"),a=n(s),c=e("./syncher/DataObjectObserver"),u=n(c);r.Syncher=i["default"],r.DataObjectReporter=a["default"],r.DataObjectObserver=u["default"]},{"./syncher/DataObjectObserver":95,"./syncher/DataObjectReporter":96,"./syncher/Syncher":99,"array.observe":1,"mutationobserver-shim":90,"object.observe":91}],93:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/core-js/object/keys"),a=n(s),c=e("babel-runtime/helpers/classCallCheck"),u=n(c),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("./SyncObject"),p=n(d),b=e("./DataObjectChild"),h=n(b),y=e("../utils/utils.js"),v=function(){function e(t,r,n,o,i,s){(0,u["default"])(this,e);var a=this;a._syncher=t,a._url=r,a._schema=n,a._status=o,a._syncObj=new p["default"](i),a._childrens=s,a._version=0,a._childId=0,a._childrenObjects={},a._childrenListeners=[],a._owner=t._owner,a._bus=t._bus}return(0,f["default"])(e,[{key:"_allocateListeners",value:function(){var e=this,t=this,r=t._url+"/children/";t._childrens&&t._childrens.forEach(function(n){var o=r+n,i=t._bus.addListener(o,function(r){if(r.from!==e._owner)switch(console.log("DataObject-Children-RCV: ",r),r.type){case"create":t._onChildCreate(r);break;case"delete":console.log(r);break;default:t._changeChildren(r)}});t._childrenListeners.push(i)})}},{key:"_releaseListeners",value:function(){var e=this;e._childrenListeners.forEach(function(e){e.remove()}),(0,a["default"])(e._childrenObjects).forEach(function(t){e._childrenObjects[t]._releaseListeners()})}},{key:"pause",value:function(){throw"Not implemented"}},{key:"resume",value:function(){throw"Not implemented"}},{key:"stop",value:function(){throw"Not implemented"}},{key:"addChild",value:function(e,t){var r=this;r._childId++;var n=r._owner+"#"+r._childId,o=r._url+"/children/"+e,s={type:"create",from:r._owner,to:o,body:{resource:n,value:t}};return new i["default"](function(e){var i=r._bus.postMessage(s);console.log("create-reporter-child( "+r._owner+" ): ",s);var a=new h["default"](r,n,t,r._owner,i);a.onChange(function(e){r._onChange(e,{path:o,childId:n})}),r._childrenObjects[n]=a,e(a)})}},{key:"onAddChild",value:function(e){this._onAddChildrenHandler=e}},{key:"_onChildCreate",value:function(e){var t=this,r=e.body.resource;console.log("create-observer-child( "+t._owner+" ): ",e);var n=new h["default"](t,r,e.body.value);t._childrenObjects[r]=n,setTimeout(function(){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,source:t._owner}})});var o={type:e.type,from:e.from,url:e.to,value:e.body.value,childId:r,identity:e.body.identity};t._onAddChildrenHandler&&(console.log("ADD-CHILDREN-EVENT: ",o),t._onAddChildrenHandler(o))}},{key:"_onChange",value:function(e,t){var r=this;if(r._version++,"on"===r._status){var n={type:"update",from:r._url,to:r._url+"/changes",body:{version:r._version,source:r._owner,attribute:e.field}};e.oType===d.ObjectType.OBJECT?e.cType!==d.ChangeType.REMOVE&&(n.body.value=e.data):(n.body.attributeType=e.oType,n.body.value=e.data,e.cType!==d.ChangeType.UPDATE&&(n.body.operation=e.cType)),t&&(n.to=t.path,n.body.resource=t.childId),r._bus.postMessage(n)}}},{key:"_changeObject",value:function(e,t){var r=this;if(r._version+1===t.body.version){r._version++;var n=t.body.attribute,o=(0,y.deepClone)(t.body.value),i=e.findBefore(n);if(t.body.attributeType===d.ObjectType.ARRAY)if(t.body.operation===d.ChangeType.ADD){var s=i.obj,a=i.last;Array.prototype.splice.apply(s,[a,0].concat(o))}else if(t.body.operation===d.ChangeType.REMOVE){var c=i.obj,u=i.last;c.splice(u,o)}else i.obj[i.last]=o;else t.body.value?i.obj[i.last]=o:delete i.obj[i.last]}else console.log("UNSYNCHRONIZED VERSION: (data => "+r._version+", msg => "+t.body.version+")")}},{key:"_changeChildren",value:function(e){var t=this;console.log("Change children: ",t._owner,e);var r=e.body.resource,n=t._childrenObjects[r];n?t._changeObject(n._syncObj,e):console.log("No children found for: ",r)}},{key:"url",get:function(){return this._url}},{key:"schema",get:function(){return this._schema}},{key:"status",get:function(){return this._status}},{key:"data",get:function(){return this._syncObj.data}},{key:"childrens",get:function(){return this._childrenObjects}}]),e}();r["default"]=v,t.exports=r["default"]},{"../utils/utils.js":100,"./DataObjectChild":94,"./SyncObject":98,"babel-runtime/core-js/object/keys":7,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],94:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),c=e("./SyncObject"),u=n(c),l=function(){function e(t,r,n,o,s){(0,i["default"])(this,e);var a=this;a._parent=t,a._childId=r,a._owner=o,a._msgId=s,a._syncObj=new u["default"](n),a._bus=t._bus,a._allocateListeners()}return(0,a["default"])(e,[{key:"_allocateListeners",value:function(){var e=this;e._owner&&(e._listener=e._bus.addListener(e._owner,function(t){"response"===t.type&&t.id===e._msgId&&(console.log("DataObjectChild.onResponse:",t),e._onResponse(t))}))}},{key:"_releaseListeners",value:function(){var e=this;e._listener&&e._listener.remove()}},{key:"delete",value:function(){var e=this;delete e._parent._children[e._childId],e._releaseListeners()}},{key:"onChange",value:function(e){this._syncObj.observe(function(t){e(t)})}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.body.source,code:e.body.code};t._onResponseHandler&&t._onResponseHandler(r)}},{key:"childId",get:function(){return this._childId}},{key:"data",get:function(){return this._syncObj.data}}]),e}();r["default"]=l,t.exports=r["default"]},{"./SyncObject":98,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],95:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),a=n(s),c=e("babel-runtime/helpers/classCallCheck"),u=n(c),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("babel-runtime/helpers/possibleConstructorReturn"),p=n(d),b=e("babel-runtime/helpers/get"),h=n(b),y=e("babel-runtime/helpers/inherits"),v=n(y),_=e("./DataObject"),g=n(_),m=e("./DataObjectChild"),j=n(m),$={ANY:"any",START:"start",EXACT:"exact"},w=function(e){function t(e,r,n,o,s,c,l){(0,u["default"])(this,t);var f=(0,p["default"])(this,(0,a["default"])(t).call(this,e,r,n,o,s.data,c)),d=f;return d._version=l,d._filters={},d._syncObj.observe(function(e){d._onFilter(e)}),(0,i["default"])(s.childrens).forEach(function(e){var t=s.childrens[e];d._childrenObjects[e]=new j["default"](d,e,t)}),d._allocateListeners(),f}return(0,v["default"])(t,e),(0,f["default"])(t,[{key:"_allocateListeners",value:function(){(0,h["default"])((0,a["default"])(t.prototype),"_allocateListeners",this).call(this);var e=this;e._changeListener=e._bus.addListener(e._url+"/changes",function(t){"update"===t.type&&(console.log("DataObjectObserver-"+e._url+"-RCV: ",t),e._changeObject(e._syncObj,t))})}},{key:"_releaseListeners",value:function(){(0,h["default"])((0,a["default"])(t.prototype),"_releaseListeners",this).call(this);var e=this;e._changeListener.remove()}},{key:"delete",value:function(){var e=this;e._releaseListeners(),delete e._syncher._observers[e._url]}},{key:"unsubscribe",value:function(){var e=this,t={type:"unsubscribe",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectObserver-UNSUBSCRIBE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._observers[e._url])})}},{key:"onChange",value:function(e,t){var r=e,n={type:$.EXACT,callback:t},o=e.indexOf("*");o===e.length-1&&(0===o?n.type=$.ANY:(n.type=$.START,r=e.substr(0,e.length-1))),this._filters[r]=n}},{key:"_onFilter",value:function(e){var t=this;(0,i["default"])(t._filters).forEach(function(r){var n=t._filters[r];n.type===$.ANY?n.callback(e):n.type===$.START?0===e.field.indexOf(r)&&n.callback(e):n.type===$.EXACT&&e.field===r&&n.callback(e)})}}]),t}(g["default"]);r["default"]=w,t.exports=r["default"]},{"./DataObject":93,"./DataObjectChild":94,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/get":13,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],96:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/core-js/object/get-prototype-of"),a=n(s),c=e("babel-runtime/helpers/classCallCheck"),u=n(c),l=e("babel-runtime/helpers/createClass"),f=n(l),d=e("babel-runtime/helpers/possibleConstructorReturn"),p=n(d),b=e("babel-runtime/helpers/get"),h=n(b),y=e("babel-runtime/helpers/inherits"),v=n(y),_=e("./DataObject"),g=n(_),m=e("../utils/utils.js"),j=function(e){function t(e,r,n,o,i,s){(0,u["default"])(this,t);var c=(0,p["default"])(this,(0,a["default"])(t).call(this,e,r,n,o,i,s)),l=c;return l._subscriptions={},l._syncObj.observe(function(e){console.log("DataObjectReporter-"+r+"-SEND: ",e),l._onChange(e)}),l._allocateListeners(),c}return(0,v["default"])(t,e),(0,f["default"])(t,[{key:"_allocateListeners",value:function(){(0,h["default"])((0,a["default"])(t.prototype),"_allocateListeners",this).call(this);var e=this;e._objectListener=e._bus.addListener(e._url,function(t){switch(console.log("DataObject-"+e._url+"-RCV: ",t),t.type){case"response":e._onResponse(t);break;case"read":e._onRead(t)}})}},{key:"_releaseListeners",value:function(){(0,h["default"])((0,a["default"])(t.prototype),"_releaseListeners",this).call(this);var e=this;e._objectListener.remove()}},{key:"inviteObservers",value:function(e){var t=this,r={type:"create",from:t._syncher._owner,to:t._syncher._subURL,body:{resource:t._url,schema:t._schema,value:t._syncObj.data,authorise:e}};t._bus.postMessage(r)}},{key:"delete",value:function(){var e=this,t={type:"delete",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectReporter-DELETE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._reporters[e._url])})}},{key:"onSubscription",value:function(e){this._onSubscriptionHandler=e}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"onRead",value:function(e){this._onReadHandler=e}},{key:"_onForward",value:function(e){var t=this;switch(console.log("DataObjectReporter-RCV: ",e),e.body.type){case"subscribe":t._onSubscribe(e);break;case"unsubscribe":t._onUnSubscribe(e)}}},{key:"_onSubscribe",value:function(e){var t=this,r=e.body.from,n={type:e.body.type,url:r,identity:e.body.identity,accept:function(){var n={url:r,status:"on"};t._subscriptions[r]=n;var o={};return(0,i["default"])(t._childrenObjects).forEach(function(e){var r=t._childrenObjects[e].data;o[e]=(0,m.deepClone)(r)}),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,schema:t._schema,version:t._version,value:{data:(0,m.deepClone)(t.data),childrens:o}}}),n},reject:function(r){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:403,desc:r}})}};t._onSubscriptionHandler&&(console.log("SUBSCRIPTION-EVENT: ",n),t._onSubscriptionHandler(n))}},{key:"_onUnSubscribe",value:function(e){var t=this,r=e.body.from,n=t._subscriptions[r];delete t._subscriptions[r];var o={type:e.body.type,url:r,object:n};t._onSubscriptionHandler&&(console.log("UN-SUBSCRIPTION-EVENT: ",o),t._onSubscriptionHandler(o))}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.from,code:e.body.code};t._onResponseHandler&&(console.log("RESPONSE-EVENT: ",r),t._onResponseHandler(r))}},{key:"_onRead",value:function(e){var t=this,r={type:e.type,url:e.from,accept:function(){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,value:(0,m.deepClone)(t.data)}})},reject:function(r){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:401,desc:r}})}};t._onReadHandler&&(console.log("READ-EVENT: ",r),t._onReadHandler(r))}},{key:"subscriptions",get:function(){return this._subscriptions}}]),t}(g["default"]);r["default"]=j,t.exports=r["default"]},{"../utils/utils.js":100,"./DataObject":93,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/get":13,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],97:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=n(o),s=e("babel-runtime/helpers/createClass"),a=n(s),c=function(){function e(t,r,n,o){(0,i["default"])(this,e);var s=this;s._owner=t,s._url=r,s._bus=n,s._children=o,s._changes=[],s._allocateListeners()}return(0,a["default"])(e,[{key:"_allocateListeners",value:function(){var e=this;e._listener=e._bus.addListener(e._url,function(t){console.log("DataProvisional-"+e._url+"-RCV: ",t),e._changes.push(t)})}},{key:"_releaseListeners",value:function(){var e=this;e._listener.remove()}},{key:"apply",value:function(e){var t=this;t._changes.forEach(function(t){e._changeObject(e._syncObj,t)})}},{key:"children",get:function(){return this._children}}]),e}();r["default"]=c,t.exports=r["default"]},{"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],98:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0}),r.ObjectType=r.ChangeType=void 0;var o=e("babel-runtime/core-js/object/keys"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),a=n(s),c=e("babel-runtime/helpers/createClass"),u=n(c),l=e("../utils/utils.js"),f=function(){function e(t){(0,a["default"])(this,e);var r=this;r._observers=[],r._filters={},t?r._data=(0,l.deepClone)(t):r._data={},r._internalObserve(new d,r._data)}return(0,u["default"])(e,[{key:"observe",value:function(e){this._observers.push(e)}},{key:"find",value:function(e){var t=e.split(".");return this._findWithSplit(t)}},{key:"findBefore",value:function(e){var t={},r=e.split(".");return t.last=r.pop(),t.obj=this._findWithSplit(r),t}},{key:"_findWithSplit",value:function(e){var t=this._data;return e.forEach(function(e){t=t[e]}),t}},{key:"_fireEvent",value:function(e){this._observers.forEach(function(t){t(e)})}},{key:"_isObservable",value:function(e){return e.constructor===Object||e.constructor===Array}},{key:"_internalObserve",value:function(e,t){var r=this;if(r._isObservable(t)){var n=function(t){r._onChanges(e,t)};if(t.constructor===Object){Object.observe(t,n);for(var o in t)r._isObservable(t[o])&&r._internalObserve(e["new"](o),t[o])}else if(t.constructor===Array){Array.observe(t,n);for(var i in t)if(r._isObservable(t[i])){var s=e["new"](new p(t[i],i));r._internalObserve(s,t[i])}}}}},{key:"_onChanges",value:function(e,t){var r=this;for(var n in t){var o=t[n].object,i=void 0;if(o.constructor===Object&&(i=h.OBJECT),o.constructor===Array&&(i=h.ARRAY),"splice"===t[n].type)!function(){var s=t[n].index,a=e["new"](""+s),c=a.toString(),u=t[n].removed.length;if(0!==u){var f=t[n].removed;f.forEach(function(t,n){r._isObservable(t)&&e.removeIndex(s+n)}),r._fireEvent({cType:b.REMOVE,oType:i,field:c,data:u})}var d=t[n].addedCount;if(0!==d){var h=o.slice(s,s+d);h.forEach(function(t,n){if(r._isObservable(t)){var o=e["new"](new p(t,s+n));r._internalObserve(o,t)}}),r._fireEvent({cType:b.ADD,oType:i,field:c,data:(0,l.deepClone)(h)})}s!==o.length-1&&e.reIndexFrom(o)}();else{var s=e["new"](t[n].name),a=s.toString();if(-1!==a.indexOf("Symbol"))continue;var c=o[t[n].name];"update"===t[n].type&&this._fireEvent({cType:b.UPDATE,oType:i,field:a,data:(0,l.deepClone)(c)}),"add"===t[n].type&&(this._internalObserve(s,c),this._fireEvent({cType:b.ADD,oType:i,field:a,data:(0,l.deepClone)(c)})),"delete"===t[n].type&&this._fireEvent({cType:b.REMOVE,oType:i,field:a})}}}},{key:"data",get:function(){return this._data}}]),e}(),d=function(){function e(){(0,a["default"])(this,e),this._path=[],this._observables={}}return(0,u["default"])(e,[{key:"removeIndex",value:function(e){delete this._observables[e]}},{key:"reIndexFrom",value:function(e){var t=this;(0,i["default"])(this._observables).forEach(function(r){var n=t._observables[r],o=e.indexOf(n.obj);n.idx!=o&&(n.idx=o,delete t._observables[r],t._observables[o]=n)})}},{key:"new",value:function(e){e.constructor==p&&(this._observables[e.idx]=e);var t=this.clone();return t._path.push(e),t}},{key:"clone",value:function(){var t=new e;return this._path.forEach(function(e){t._path.push(e)}),t}},{key:"toString",value:function(){var e="";return this._path.forEach(function(t,r){0===r?e=t.toString():e+="."+t.toString()}),e}}]),e}(),p=function(){function e(t,r){(0,a["default"])(this,e),this.obj=t,this.idx=r}return(0,u["default"])(e,[{key:"toString",value:function(){return this.idx.toString()}}]),e}(),b=r.ChangeType={UPDATE:"update",ADD:"add",REMOVE:"remove"},h=r.ObjectType={OBJECT:"object",ARRAY:"array"};r["default"]=f},{"../utils/utils.js":100,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],99:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var o=e("babel-runtime/core-js/promise"),i=n(o),s=e("babel-runtime/helpers/classCallCheck"),a=n(s),c=e("babel-runtime/helpers/createClass"),u=n(c),l=e("./DataObjectReporter"),f=n(l),d=e("./DataObjectObserver"),p=n(d),b=e("./DataProvisional"),h=n(b),y=function(){function e(t,r,n){(0,a["default"])(this,e);var o=this;o._owner=t,o._bus=r,o._subURL=n.runtimeURL+"/sm",o._reporters={},o._observers={},o._provisionals={},r.addListener(t,function(e){if(e.from!==t)switch(console.log("Syncher-RCV: ",e),e.type){case"forward":o._onForward(e);break;case"create":o._onRemoteCreate(e);break;case"delete":o._onRemoteDelete(e)}})}return(0,u["default"])(e,[{key:"create",value:function(e,t,r){var n=this;r.reporter=n._owner,r.schema=e;var o={type:"create",from:n._owner,to:n._subURL,body:{schema:e,value:r,authorise:t}};return new i["default"](function(t,i){n._bus.postMessage(o,function(o){if(console.log("create-response: ",o),200===o.body.code){var s=o.body.resource,a=new f["default"](n,s,e,"on",r,o.body.childrenResources);n._reporters[s]=a,t(a)}else i(o.body.desc)})})}},{key:"subscribe",value:function(e,t){var r=this,n={type:"subscribe",from:r._owner,to:r._subURL,body:{schema:e,resource:t}};return new i["default"](function(o,i){r._bus.postMessage(n,function(n){console.log("subscribe-response: ",n);var s=r._provisionals[t];if(delete r._provisionals[t],s&&s._releaseListeners(),n.body.code<200)s=new h["default"](r._owner,t,r._bus,n.body.childrenResources),r._provisionals[t]=s;else if(200===n.body.code){var a=new p["default"](r,t,e,"on",n.body.value,s.children,n.body.version);r._observers[t]=a,o(a),s.apply(a)}else i(n.body.desc)})})}},{key:"read",value:function(e){var t=this,r={type:"read",from:t._owner,to:e};return new i["default"](function(e,n){t._bus.postMessage(r,function(t){console.log("read-response: ",t),200===t.body.code?e(t.body.value):n(t.body.desc)})})}},{key:"onNotification",value:function(e){this._onNotificationHandler=e}},{key:"_onForward",value:function(e){var t=this,r=t._reporters[e.body.to];r._onForward(e)}},{key:"_onRemoteCreate",value:function(e){var t=this,r=e.from.slice(0,-13),n={type:e.type,from:e.body.source,url:r,schema:e.body.schema,value:e.body.value,identity:e.body.identity,ack:function(r){var n=200;r&&(n=r),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:n}})}};t._onNotificationHandler&&(console.log("NOTIFICATION-EVENT: ",n),t._onNotificationHandler(n))}},{key:"_onRemoteDelete",value:function(e){var t=this,r=e.body.resource,n=t._observers[r];if(n){var o={type:e.type,url:r,identity:e.body.identity,ack:function(r){var o=200;r&&(o=r),200===o&&n["delete"](),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:o,source:t._owner}})}};t._onNotificationHandler&&(console.log("NOTIFICATION-EVENT: ",o),t._onNotificationHandler(o))}else t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:404,source:t._owner}})}},{key:"owner",get:function(){return this._owner}},{key:"reporters",get:function(){return this._reporters}},{key:"observers",get:function(){return this._observers}}]),e}();r["default"]=y,t.exports=r["default"]},{"./DataObjectObserver":95,"./DataObjectReporter":96,"./DataProvisional":97,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],100:[function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",n=e.replace(t,r).split(",");n[0]===e&&(n[0]="https",n[1]=e);var o={type:n[0],domain:n[1],identity:n[2]};return o}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function s(e){return!((0,b["default"])(e).length>0)}function a(e){return e?JSON.parse((0,d["default"])(e)):void 0}function c(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function u(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function l(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return c(e)}Object.defineProperty(r,"__esModule",{value:!0});var f=e("babel-runtime/core-js/json/stringify"),d=n(f),p=e("babel-runtime/core-js/object/keys"),b=n(p);r.divideURL=o,r.divideEmail=i,r.emptyObject=s,r.deepClone=a,r.getUserURLFromEmail=c,r.getUserEmailFromURL=u,r.convertToUserURL=l},{"babel-runtime/core-js/json/stringify":2,"babel-runtime/core-js/object/keys":7}]},{},[92])(92)});


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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = activate;

var _IdentityManager = require('service-framework/dist/IdentityManager');

var _IdentityManager2 = _interopRequireDefault(_IdentityManager);

var _HypertyDiscovery = require('service-framework/dist/HypertyDiscovery');

var _HypertyDiscovery2 = _interopRequireDefault(_HypertyDiscovery);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _Syncher = require('service-framework/dist/Syncher');

var _notificationsTrigger = require('../notifications/notifications-trigger');

var _notificationsTrigger2 = _interopRequireDefault(_notificationsTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SurveyObserver = {
    _resolveIdentity: function _resolveIdentity() {
        var _this = this;

        return new Promise(function (resolve) {
            if (_this.identity) {
                resolve(_this.identity);
            } else {
                _this.identityManagerService.discoverUserRegistered('.', _this.hypertyURL).then(function (identity) {
                    _this.identity = identity;
                    resolve(identity);
                });
            }
        });
    },
    onRequest: function onRequest(callback) {
        var _this2 = this;

        this.syncher.onNotification(function (event) {
            if (event.schema === _this2.objectDescURL) {
                (function () {
                    var identity = void 0;
                    _this2._resolveIdentity().then(function (id) {
                        return identity = id;
                    }).then(function () {
                        return _this2.syncher.subscribe(_this2.objectDescURL, event.url);
                    }).then(function (dataObject) {
                        console.log('trigger');
                        _this2.notifications.trigger([{ email: identity.username, domain: _this2.domain }], { type: 'NEW_SURVEY', payload: { id: dataObject.url } });
                        callback({
                            answer: function answer(_answer) {
                                dataObject.addChild('chatmessages', { response: _answer });
                            },
                            data: dataObject.data.survey
                        });
                    });
                })();
            }
        });
    }
};

var SurveyObserverFactory = function SurveyObserverFactory(hypertyURL, bus, config) {
    var uri = new _urijs2.default(hypertyURL);
    var syncher = new _Syncher.Syncher(hypertyURL, bus, config);
    var hypertyDiscovery = new _HypertyDiscovery2.default(hypertyURL, bus);
    var notifications = (0, _notificationsTrigger2.default)(uri.hostname(), syncher, hypertyDiscovery);
    var identityManager = new _IdentityManager2.default(hypertyURL, config.runtimeURL, bus);
    return Object.assign(Object.create(SurveyObserver), {
        syncher: syncher,
        objectDescURL: 'hyperty-catalogue://catalogue.' + uri.hostname() + '/.well-known/dataschema/Communication',
        hypertyURL: hypertyURL,
        notifications: notifications,
        identityManagerService: identityManager
    });
};

function activate(hypertyURL, bus, config) {
    return {
        name: 'SurveyObserver',
        instance: SurveyObserverFactory(hypertyURL, bus, config)
    };
}
module.exports = exports['default'];

},{"../notifications/notifications-trigger":8,"service-framework/dist/HypertyDiscovery":1,"service-framework/dist/IdentityManager":2,"service-framework/dist/Syncher":3,"urijs":6}]},{},[9])(9)
});