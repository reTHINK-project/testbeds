(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("activate", [], factory);
	else if(typeof exports === 'object')
		exports["activate"] = factory();
	else
		root["activate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = activate;

var _Syncher = __webpack_require__(1);

var _utils = __webpack_require__(2);

var _EventEmitter2 = __webpack_require__(3);

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint undef: true */

/**
* Hello World Observer
* @author Paulo Chainho [paulo-g-chainho@telecom.pt]
* @version 0.1.0
*/
var HelloWorldObserver = function (_EventEmitter) {
  _inherits(HelloWorldObserver, _EventEmitter);

  /**
  * Create a new HelloWorldObserver
  * @param  {Syncher} syncher - Syncher provided from the runtime core
  */
  function HelloWorldObserver(hypertyURL, bus, configuration) {
    _classCallCheck(this, HelloWorldObserver);

    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    var _this2 = _possibleConstructorReturn(this, (HelloWorldObserver.__proto__ || Object.getPrototypeOf(HelloWorldObserver)).call(this));

    var _this = _this2;
    var domain = (0, _utils.divideURL)(hypertyURL).domain;
    _this._domain = domain;

    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/HelloWorldDataSchema';

    var syncher = new _Syncher.Syncher(hypertyURL, bus, configuration);
    syncher.onNotification(function (event) {
      _this._onNotification(event);
    });

    syncher.resumeObservers({}).then(function (resumedObservers) {

      if (!resumedObservers) return;
      // lets now observe any changes done in Hello World Object
      console.log('[hyperty syncher resume] - dataObject', resumedObservers);

      Object.values(resumedObservers).forEach(function (helloObjtObserver) {
        _this._changes(helloObjtObserver);
      });
    }).catch(function (reason) {
      console.log('[hyperty syncher resume] - ', reason);
    });

    _this._syncher = syncher;
    return _this2;
  }

  _createClass(HelloWorldObserver, [{
    key: '_onNotification',
    value: function _onNotification(event) {

      var _this = this;

      console.info('Event Received: ', event);

      _this.trigger('invitation', event.identity);

      // Acknowledge reporter about the Invitation was received
      event.ack();

      // Subscribe Hello World Object
      _this._syncher.subscribe(_this._objectDescURL, event.url, true, false).then(function (helloObjtObserver) {

        // Hello World Object was subscribed
        console.info(helloObjtObserver);

        // lets now observe any changes done in Hello World Object
        console.log('[hyperty syncher subscribe] - dataObject', helloObjtObserver);

        _this._changes(helloObjtObserver);
      }).catch(function (reason) {
        console.error(reason);
      });
    }
  }, {
    key: '_changes',
    value: function _changes(dataObject) {
      var _this3 = this;

      console.log('[hyperty syncher] - dataObject', dataObject);

      // lets notify the App the subscription was accepted with the mnost updated version of Hello World Object
      this.trigger('hello', dataObject.data);

      dataObject.onChange('*', function (event) {

        // Hello World Object was changed
        console.info('message received:', event);

        if (event.field === 'hello') {
          // lets notify the App about the change
          _this3.trigger('hello', dataObject.data);
        }
      });
    }
  }]);

  return HelloWorldObserver;
}(_EventEmitter3.default);

function activate(hypertyURL, bus, configuration) {

  return {
    name: 'HelloWorldObserver',
    instance: new HelloWorldObserver(hypertyURL, bus, configuration)
  };
}
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// version: 0.7.1
// date: Tue Jul 25 2017 09:06:17 GMT+0100 (WEST)
// licence: 
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


!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define("Syncher",[],t):"object"==typeof exports?exports.Syncher=t():(e[""]=e[""]||{},e[""].Syncher=t())}(this,function(){return function(e){function __webpack_require__(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}var t={};return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.i=function(e){return e},__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=142)}([function(e,t){var r=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},function(e,t){var r=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(e,t,r){e.exports=!r(11)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,r){var n=r(30)("wks"),o=r(23),i=r(1).Symbol,s="function"==typeof i;(e.exports=function(e){return n[e]||(n[e]=s&&i[e]||(s?i:o)("Symbol."+e))}).store=n},function(e,t,r){var n=r(5),o=r(25),i=r(21),s=Object.defineProperty;t.f=r(2)?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return s(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},function(e,t,r){var n=r(6);e.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t,r){var n=r(4),o=r(15);e.exports=r(2)?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},function(e,t,r){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t,r){var n=r(1),o=r(0),i=r(14),s=r(7),a=function(e,t,r){var u,c,l,f=e&a.F,d=e&a.G,p=e&a.S,_=e&a.P,b=e&a.B,y=e&a.W,h=d?o:o[t]||(o[t]={}),v=h.prototype,m=d?n:p?n[t]:(n[t]||{}).prototype;d&&(r=t);for(u in r)(c=!f&&m&&void 0!==m[u])&&u in h||(l=c?m[u]:r[u],h[u]=d&&"function"!=typeof m[u]?r[u]:b&&c?i(l,n):y&&m[u]==l?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(l):_&&"function"==typeof l?i(Function.call,l):l,_&&((h.virtual||(h.virtual={}))[u]=l,e&a.R&&v&&!v[u]&&s(v,u,l)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,e.exports=a},function(e,t,r){"use strict";t.__esModule=!0;var n=r(33),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,o.default)(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}()},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var r={}.hasOwnProperty;e.exports=function(e,t){return r.call(e,t)}},function(e,t,r){var n=r(56),o=r(24);e.exports=function(e){return n(o(e))}},function(e,t,r){var n=r(19);e.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t){e.exports={}},function(e,t,r){var n=r(6),o=r(1).document,i=n(o)&&n(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},function(e,t,r){var n=r(44),o=r(29);e.exports=Object.keys||function(e){return n(e,o)}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t){var r={}.toString;e.exports=function(e){return r.call(e).slice(8,-1)}},function(e,t,r){var n=r(6);e.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},function(e,t,r){var n=r(4).f,o=r(12),i=r(3)("toStringTag");e.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},function(e,t){var r=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++r+n).toString(36))}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t,r){e.exports=!r(2)&&!r(11)(function(){return 7!=Object.defineProperty(r(17)("div"),"a",{get:function(){return 7}}).a})},function(e,t){e.exports=!0},function(e,t,r){var n=r(30)("keys"),o=r(23);e.exports=function(e){return n[e]||(n[e]=o(e))}},function(e,t){var r=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:r)(e)}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,t,r){var n=r(1),o=n["__core-js_shared__"]||(n["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},function(e,t,r){e.exports={default:r(80),__esModule:!0}},function(e,t,r){var n=r(24);e.exports=function(e){return Object(n(e))}},function(e,t,r){e.exports={default:r(36),__esModule:!0}},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(76),o=_interopRequireDefault(n),i=r(75),s=_interopRequireDefault(i),a=r(60),u=_interopRequireDefault(a);t.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,u.default)(t)));e.prototype=(0,s.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(o.default?(0,o.default)(e,t):e.__proto__=t)}},function(e,t,r){"use strict";t.__esModule=!0;var n=r(60),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}},function(e,t,r){r(38);var n=r(0).Object;e.exports=function(e,t,r){return n.defineProperty(e,t,r)}},function(e,t,r){var n=r(5),o=r(65),i=r(29),s=r(27)("IE_PROTO"),a=function(){},u=function(){var e,t=r(17)("iframe"),n=i.length;for(t.style.display="none",r(42).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),u=e.F;n--;)delete u.prototype[i[n]];return u()};e.exports=Object.create||function(e,t){var r;return null!==e?(a.prototype=n(e),r=new a,a.prototype=null,r[s]=e):r=u(),void 0===t?r:o(r,t)}},function(e,t,r){var n=r(9);n(n.S+n.F*!r(2),"Object",{defineProperty:r(4).f})},function(e,t,r){"use strict";var n=r(26),o=r(9),i=r(46),s=r(7),a=r(12),u=r(16),c=r(63),l=r(22),f=r(43),d=r(3)("iterator"),p=!([].keys&&"next"in[].keys()),_=function(){return this};e.exports=function(e,t,r,b,y,h,v){c(r,t,b);var m,g,O,j=function(e){if(!p&&e in k)return k[e];switch(e){case"keys":case"values":return function(){return new r(this,e)}}return function(){return new r(this,e)}},w=t+" Iterator",R="values"==y,D=!1,k=e.prototype,x=k[d]||k["@@iterator"]||y&&k[y],E=x||j(y),S=y?R?j("entries"):E:void 0,M="Array"==t?k.entries||x:x;if(M&&(O=f(M.call(new e)))!==Object.prototype&&(l(O,w,!0),n||a(O,d)||s(O,d,_)),R&&x&&"values"!==x.name&&(D=!0,E=function(){return x.call(this)}),n&&!v||!p&&!D&&k[d]||s(k,d,E),u[t]=E,u[w]=_,y)if(m={values:R?E:j("values"),keys:h?E:j("keys"),entries:S},v)for(g in m)g in k||i(k,g,m[g]);else o(o.P+o.F*(p||D),t,m);return m}},function(e,t,r){e.exports={default:r(53),__esModule:!0}},function(e,t){t.f={}.propertyIsEnumerable},function(e,t,r){e.exports=r(1).document&&document.documentElement},function(e,t,r){var n=r(12),o=r(32),i=r(27)("IE_PROTO"),s=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},function(e,t,r){var n=r(12),o=r(13),i=r(62)(!1),s=r(27)("IE_PROTO");e.exports=function(e,t){var r,a=o(e),u=0,c=[];for(r in a)r!=s&&n(a,r)&&c.push(r);for(;t.length>u;)n(a,r=t[u++])&&(~i(c,r)||c.push(r));return c}},function(e,t,r){var n=r(9),o=r(0),i=r(11);e.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},function(e,t,r){e.exports=r(7)},function(e,t,r){var n=r(28),o=Math.min;e.exports=function(e){return e>0?o(n(e),9007199254740991):0}},function(e,t,r){var n=r(1),o=r(0),i=r(26),s=r(49),a=r(4).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||a(t,e,{value:s.f(e)})}},function(e,t,r){t.f=r(3)},function(e,t,r){"use strict";var n=r(67)(!0);r(39)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},function(e,t,r){r(70);for(var n=r(1),o=r(7),i=r(16),s=r(3)("toStringTag"),a=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],u=0;u<5;u++){var c=a[u],l=n[c],f=l&&l.prototype;f&&!f[s]&&o(f,s,c),i[c]=i.Array}},,function(e,t,r){var n=r(0),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){return o.stringify.apply(o,arguments)}},function(e,t){},function(e,t,r){var n=r(20),o=r(3)("toStringTag"),i="Arguments"==n(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,r,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=s(t=Object(e),o))?r:i?n(t):"Object"==(a=n(t))&&"function"==typeof t.callee?"Arguments":a}},function(e,t,r){var n=r(20);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},function(e,t,r){var n=r(41),o=r(15),i=r(13),s=r(21),a=r(12),u=r(25),c=Object.getOwnPropertyDescriptor;t.f=r(2)?c:function(e,t){if(e=i(e),t=s(t,!0),u)try{return c(e,t)}catch(e){}if(a(e,t))return o(!n.f.call(e,t),e[t])}},function(e,t){t.f=Object.getOwnPropertySymbols},function(e,t,r){e.exports={default:r(81),__esModule:!0}},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(78),o=_interopRequireDefault(n),i=r(77),s=_interopRequireDefault(i),a="function"==typeof s.default&&"symbol"==typeof o.default?function(e){return typeof e}:function(e){return e&&"function"==typeof s.default&&e.constructor===s.default&&e!==s.default.prototype?"symbol":typeof e};t.default="function"==typeof s.default&&"symbol"===a(o.default)?function(e){return void 0===e?"undefined":a(e)}:function(e){return e&&"function"==typeof s.default&&e.constructor===s.default&&e!==s.default.prototype?"symbol":void 0===e?"undefined":a(e)}},function(e,t){e.exports=function(){}},function(e,t,r){var n=r(13),o=r(47),i=r(69);e.exports=function(e){return function(t,r,s){var a,u=n(t),c=o(u.length),l=i(s,c);if(e&&r!=r){for(;c>l;)if((a=u[l++])!=a)return!0}else for(;c>l;l++)if((e||l in u)&&u[l]===r)return e||l||0;return!e&&-1}}},function(e,t,r){"use strict";var n=r(37),o=r(15),i=r(22),s={};r(7)(s,r(3)("iterator"),function(){return this}),e.exports=function(e,t,r){e.prototype=n(s,{next:o(1,r)}),i(e,t+" Iterator")}},function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},function(e,t,r){var n=r(4),o=r(5),i=r(18);e.exports=r(2)?Object.defineProperties:function(e,t){o(e);for(var r,s=i(t),a=s.length,u=0;a>u;)n.f(e,r=s[u++],t[r]);return e}},function(e,t,r){var n=r(44),o=r(29).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,o)}},function(e,t,r){var n=r(28),o=r(24);e.exports=function(e){return function(t,r){var i,s,a=String(o(t)),u=n(r),c=a.length;return u<0||u>=c?e?"":void 0:(i=a.charCodeAt(u),i<55296||i>56319||u+1===c||(s=a.charCodeAt(u+1))<56320||s>57343?e?a.charAt(u):i:e?a.slice(u,u+2):s-56320+(i-55296<<10)+65536)}}},function(e,t,r){var n,o,i,s=r(14),a=r(89),u=r(42),c=r(17),l=r(1),f=l.process,d=l.setImmediate,p=l.clearImmediate,_=l.MessageChannel,b=0,y={},h=function(){var e=+this;if(y.hasOwnProperty(e)){var t=y[e];delete y[e],t()}},v=function(e){h.call(e.data)};d&&p||(d=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return y[++b]=function(){a("function"==typeof e?e:Function(e),t)},n(b),b},p=function(e){delete y[e]},"process"==r(20)(f)?n=function(e){f.nextTick(s(h,e,1))}:_?(o=new _,i=o.port2,o.port1.onmessage=v,n=s(i.postMessage,i,1)):l.addEventListener&&"function"==typeof postMessage&&!l.importScripts?(n=function(e){l.postMessage(e+"","*")},l.addEventListener("message",v,!1)):n="onreadystatechange"in c("script")?function(e){u.appendChild(c("script")).onreadystatechange=function(){u.removeChild(this),h.call(e)}}:function(e){setTimeout(s(h,e,1),0)}),e.exports={set:d,clear:p}},function(e,t,r){var n=r(28),o=Math.max,i=Math.min;e.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},function(e,t,r){"use strict";var n=r(61),o=r(64),i=r(16),s=r(13);e.exports=r(39)(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function divideURL(e){function recurse(e){var t=/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;return e.replace(t,"$1,$3,$4").split(",")}if(!e)throw Error("URL is needed to split");var t=recurse(e);if(t[0]===e&&!t[0].includes("@")){var r={type:"",domain:e,identity:""};return console.error("[DivideURL] DivideURL don't support url without scheme. Please review your url address",e),r}if(t[0]===e&&t[0].includes("@")){t=recurse((t[0]===e?"smtp":t[0])+"://"+t[0])}return t[1].includes("@")&&(t[2]=t[0]+"://"+t[1],t[1]=t[1].substr(t[1].indexOf("@")+1)),{type:t[0],domain:t[1],identity:t[2]}}function divideEmail(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function emptyObject(e){return!((0,s.default)(e).length>0)}function deepClone(e){if(e)return JSON.parse((0,o.default)(e))}function getUserURLFromEmail(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function getUserEmailFromURL(e){var t=divideURL(e);return t.identity.replace("/","")+"@"+t.domain}function convertToUserURL(e){if("user://"===e.substring(0,7)){var t=divideURL(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return getUserURLFromEmail(e)}function checkAttribute(e){var t=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,r=[],n=[];if(null==e.match(t))n=e.split(".");else{for(var o=void 0;null!==(o=t.exec(e));)o.index===t.lastIndex&&t.lastIndex++,o.forEach(function(e,t){0===t&&r.push(e)});var i=void 0;r.forEach(function(t){i=e.replace(t,"*+*"),n=i.split(".").map(function(e){return"*+*"===e?t:e})})}return console.log("[ServiceFramework.Utils.checkAttribute]",n),n}function parseAttributes(e){var t=/([0-9a-zA-Z][-\w]*):\/\//g;if(e.includes("://")){var r=e.split(t)[0],n=r.split("."),o=e.replace(r,"");if(e.includes("identity")){var i=o.split("identity.");console.log("array2 "+i),o=i[0].slice(".",-1),i=i[1].split("."),n.push(o,"identity"),n=n.concat(i)}else n.push(o);return n.filter(Boolean)}return e.split(".")}Object.defineProperty(t,"__esModule",{value:!0});var n=r(40),o=_interopRequireDefault(n),i=r(59),s=_interopRequireDefault(i);t.divideURL=divideURL,t.divideEmail=divideEmail,t.emptyObject=emptyObject,t.deepClone=deepClone,t.getUserURLFromEmail=getUserURLFromEmail,t.getUserEmailFromURL=getUserEmailFromURL,t.convertToUserURL=convertToUserURL,t.checkAttribute=checkAttribute,t.parseAttributes=parseAttributes},function(e,t,r){e.exports={default:r(83),__esModule:!0}},function(e,t,r){var n=r(23)("meta"),o=r(6),i=r(12),s=r(4).f,a=0,u=Object.isExtensible||function(){return!0},c=!r(11)(function(){return u(Object.preventExtensions({}))}),l=function(e){s(e,n,{value:{i:"O"+ ++a,w:{}}})},f=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,n)){if(!u(e))return"F";if(!t)return"E";l(e)}return e[n].i},d=function(e,t){if(!i(e,n)){if(!u(e))return!0;if(!t)return!1;l(e)}return e[n].w},p=function(e){return c&&_.NEED&&u(e)&&!i(e,n)&&l(e),e},_=e.exports={KEY:n,NEED:!1,fastKey:f,getWeak:d,onFreeze:p}},function(e,t,r){var n=r(55),o=r(3)("iterator"),i=r(16);e.exports=r(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},function(e,t,r){e.exports={default:r(79),__esModule:!0}},function(e,t,r){e.exports={default:r(82),__esModule:!0}},function(e,t,r){e.exports={default:r(84),__esModule:!0}},function(e,t,r){e.exports={default:r(85),__esModule:!0}},function(e,t,r){r(101);var n=r(0).Object;e.exports=function(e,t){return n.create(e,t)}},function(e,t,r){r(102),e.exports=r(0).Object.getPrototypeOf},function(e,t,r){r(103),e.exports=r(0).Object.keys},function(e,t,r){r(104),e.exports=r(0).Object.setPrototypeOf},function(e,t,r){r(54),r(50),r(51),r(105),e.exports=r(0).Promise},function(e,t,r){r(106),r(54),r(107),r(108),e.exports=r(0).Symbol},function(e,t,r){r(50),r(51),e.exports=r(49).f("iterator")},function(e,t){e.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},function(e,t,r){var n=r(18),o=r(58),i=r(41);e.exports=function(e){var t=n(e),r=o.f;if(r)for(var s,a=r(e),u=i.f,c=0;a.length>c;)u.call(e,s=a[c++])&&t.push(s);return t}},function(e,t,r){var n=r(14),o=r(92),i=r(90),s=r(5),a=r(47),u=r(74),c={},l={},t=e.exports=function(e,t,r,f,d){var p,_,b,y,h=d?function(){return e}:u(e),v=n(r,f,t?2:1),m=0;if("function"!=typeof h)throw TypeError(e+" is not iterable!");if(i(h)){for(p=a(e.length);p>m;m++)if((y=t?v(s(_=e[m])[0],_[1]):v(e[m]))===c||y===l)return y}else for(b=h.call(e);!(_=b.next()).done;)if((y=o(b,v,_.value,t))===c||y===l)return y};t.BREAK=c,t.RETURN=l},function(e,t){e.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},function(e,t,r){var n=r(16),o=r(3)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},function(e,t,r){var n=r(20);e.exports=Array.isArray||function(e){return"Array"==n(e)}},function(e,t,r){var n=r(5);e.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(t){var i=e.return;throw void 0!==i&&n(i.call(e)),t}}},function(e,t,r){var n=r(3)("iterator"),o=!1;try{var i=[7][n]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){return{done:r=!0}},i[n]=function(){return s},e(i)}catch(e){}return r}},function(e,t,r){var n=r(18),o=r(13);e.exports=function(e,t){for(var r,i=o(e),s=n(i),a=s.length,u=0;a>u;)if(i[r=s[u++]]===t)return r}},function(e,t,r){var n=r(1),o=r(68).set,i=n.MutationObserver||n.WebKitMutationObserver,s=n.process,a=n.Promise,u="process"==r(20)(s);e.exports=function(){var e,t,r,c=function(){var n,o;for(u&&(n=s.domain)&&n.exit();e;){o=e.fn,e=e.next;try{o()}catch(n){throw e?r():t=void 0,n}}t=void 0,n&&n.enter()};if(u)r=function(){s.nextTick(c)};else if(i){var l=!0,f=document.createTextNode("");new i(c).observe(f,{characterData:!0}),r=function(){f.data=l=!l}}else if(a&&a.resolve){var d=a.resolve();r=function(){d.then(c)}}else r=function(){o.call(n,c)};return function(n){var o={fn:n,next:void 0};t&&(t.next=o),e||(e=o,r()),t=o}}},function(e,t,r){var n=r(13),o=r(66).f,i={}.toString,s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return o(e)}catch(e){return s.slice()}};e.exports.f=function(e){return s&&"[object Window]"==i.call(e)?a(e):o(n(e))}},function(e,t,r){var n=r(7);e.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},function(e,t,r){var n=r(6),o=r(5),i=function(e,t){if(o(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,n){try{n=r(14)(Function.call,r(57).f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,r){return i(e,r),t?e.__proto__=r:n(e,r),e}}({},!1):void 0),check:i}},function(e,t,r){"use strict";var n=r(1),o=r(0),i=r(4),s=r(2),a=r(3)("species");e.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];s&&t&&!t[a]&&i.f(t,a,{configurable:!0,get:function(){return this}})}},function(e,t,r){var n=r(5),o=r(19),i=r(3)("species");e.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},function(e,t,r){var n=r(9);n(n.S,"Object",{create:r(37)})},function(e,t,r){var n=r(32),o=r(43);r(45)("getPrototypeOf",function(){return function(e){return o(n(e))}})},function(e,t,r){var n=r(32),o=r(18);r(45)("keys",function(){return function(e){return o(n(e))}})},function(e,t,r){var n=r(9);n(n.S,"Object",{setPrototypeOf:r(98).set})},function(e,t,r){"use strict";var n,o,i,s=r(26),a=r(1),u=r(14),c=r(55),l=r(9),f=r(6),d=r(19),p=r(86),_=r(88),b=r(100),y=r(68).set,h=r(95)(),v=a.TypeError,m=a.process,g=a.Promise,m=a.process,O="process"==c(m),j=function(){},w=!!function(){try{var e=g.resolve(1),t=(e.constructor={})[r(3)("species")]=function(e){e(j,j)};return(O||"function"==typeof PromiseRejectionEvent)&&e.then(j)instanceof t}catch(e){}}(),R=function(e,t){return e===t||e===g&&t===i},D=function(e){var t;return!(!f(e)||"function"!=typeof(t=e.then))&&t},k=function(e){return R(g,e)?new x(e):new o(e)},x=o=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw v("Bad Promise constructor");t=e,r=n}),this.resolve=d(t),this.reject=d(r)},E=function(e){try{e()}catch(e){return{error:e}}},S=function(e,t){if(!e._n){e._n=!0;var r=e._c;h(function(){for(var n=e._v,o=1==e._s,i=0;r.length>i;)!function(t){var r,i,s=o?t.ok:t.fail,a=t.resolve,u=t.reject,c=t.domain;try{s?(o||(2==e._h&&C(e),e._h=1),!0===s?r=n:(c&&c.enter(),r=s(n),c&&c.exit()),r===t.promise?u(v("Promise-chain cycle")):(i=D(r))?i.call(r,a,u):a(r)):u(n)}catch(e){u(e)}}(r[i++]);e._c=[],e._n=!1,t&&!e._h&&M(e)})}},M=function(e){y.call(a,function(){var t,r,n,o=e._v;if(P(e)&&(t=E(function(){O?m.emit("unhandledRejection",o,e):(r=a.onunhandledrejection)?r({promise:e,reason:o}):(n=a.console)&&n.error&&n.error("Unhandled promise rejection",o)}),e._h=O||P(e)?2:1),e._a=void 0,t)throw t.error})},P=function(e){if(1==e._h)return!1;for(var t,r=e._a||e._c,n=0;r.length>n;)if(t=r[n++],t.fail||!P(t.promise))return!1;return!0},C=function(e){y.call(a,function(){var t;O?m.emit("rejectionHandled",e):(t=a.onrejectionhandled)&&t({promise:e,reason:e._v})})},A=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,t._v=e,t._s=2,t._a||(t._a=t._c.slice()),S(t,!0))},L=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===e)throw v("Promise can't be resolved itself");(t=D(e))?h(function(){var n={_w:r,_d:!1};try{t.call(e,u(L,n,1),u(A,n,1))}catch(e){A.call(n,e)}}):(r._v=e,r._s=1,S(r,!1))}catch(e){A.call({_w:r,_d:!1},e)}}};w||(g=function(e){p(this,g,"Promise","_h"),d(e),n.call(this);try{e(u(L,this,1),u(A,this,1))}catch(e){A.call(this,e)}},n=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},n.prototype=r(97)(g.prototype,{then:function(e,t){var r=k(b(this,g));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=O?m.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&S(this,!1),r.promise},catch:function(e){return this.then(void 0,e)}}),x=function(){var e=new n;this.promise=e,this.resolve=u(L,e,1),this.reject=u(A,e,1)}),l(l.G+l.W+l.F*!w,{Promise:g}),r(22)(g,"Promise"),r(99)("Promise"),i=r(0).Promise,l(l.S+l.F*!w,"Promise",{reject:function(e){var t=k(this);return(0,t.reject)(e),t.promise}}),l(l.S+l.F*(s||!w),"Promise",{resolve:function(e){if(e instanceof g&&R(e.constructor,this))return e;var t=k(this);return(0,t.resolve)(e),t.promise}}),l(l.S+l.F*!(w&&r(93)(function(e){g.all(e).catch(j)})),"Promise",{all:function(e){var t=this,r=k(t),n=r.resolve,o=r.reject,i=E(function(){var r=[],i=0,s=1;_(e,!1,function(e){var a=i++,u=!1;r.push(void 0),s++,t.resolve(e).then(function(e){u||(u=!0,r[a]=e,--s||n(r))},o)}),--s||n(r)});return i&&o(i.error),r.promise},race:function(e){var t=this,r=k(t),n=r.reject,o=E(function(){_(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},function(e,t,r){"use strict";var n=r(1),o=r(12),i=r(2),s=r(9),a=r(46),u=r(73).KEY,c=r(11),l=r(30),f=r(22),d=r(23),p=r(3),_=r(49),b=r(48),y=r(94),h=r(87),v=r(91),m=r(5),g=r(13),O=r(21),j=r(15),w=r(37),R=r(96),D=r(57),k=r(4),x=r(18),E=D.f,S=k.f,M=R.f,P=n.Symbol,C=n.JSON,A=C&&C.stringify,L=p("_hidden"),T=p("toPrimitive"),q={}.propertyIsEnumerable,U=l("symbol-registry"),N=l("symbols"),I=l("op-symbols"),F=Object.prototype,V="function"==typeof P,H=n.QObject,z=!H||!H.prototype||!H.prototype.findChild,B=i&&c(function(){return 7!=w(S({},"a",{get:function(){return S(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=E(F,t);n&&delete F[t],S(e,t,r),n&&e!==F&&S(F,t,n)}:S,Z=function(e){var t=N[e]=w(P.prototype);return t._k=e,t},J=V&&"symbol"==typeof P.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof P},W=function(e,t,r){return e===F&&W(I,t,r),m(e),t=O(t,!0),m(r),o(N,t)?(r.enumerable?(o(e,L)&&e[L][t]&&(e[L][t]=!1),r=w(r,{enumerable:j(0,!1)})):(o(e,L)||S(e,L,j(1,{})),e[L][t]=!0),B(e,t,r)):S(e,t,r)},Y=function(e,t){m(e);for(var r,n=h(t=g(t)),o=0,i=n.length;i>o;)W(e,r=n[o++],t[r]);return e},K=function(e,t){return void 0===t?w(e):Y(w(e),t)},G=function(e){var t=q.call(this,e=O(e,!0));return!(this===F&&o(N,e)&&!o(I,e))&&(!(t||!o(this,e)||!o(N,e)||o(this,L)&&this[L][e])||t)},X=function(e,t){if(e=g(e),t=O(t,!0),e!==F||!o(N,t)||o(I,t)){var r=E(e,t);return!r||!o(N,t)||o(e,L)&&e[L][t]||(r.enumerable=!0),r}},$=function(e){for(var t,r=M(g(e)),n=[],i=0;r.length>i;)o(N,t=r[i++])||t==L||t==u||n.push(t);return n},Q=function(e){for(var t,r=e===F,n=M(r?I:g(e)),i=[],s=0;n.length>s;)!o(N,t=n[s++])||r&&!o(F,t)||i.push(N[t]);return i};V||(P=function(){if(this instanceof P)throw TypeError("Symbol is not a constructor!");var e=d(arguments.length>0?arguments[0]:void 0),t=function(r){this===F&&t.call(I,r),o(this,L)&&o(this[L],e)&&(this[L][e]=!1),B(this,e,j(1,r))};return i&&z&&B(F,e,{configurable:!0,set:t}),Z(e)},a(P.prototype,"toString",function(){return this._k}),D.f=X,k.f=W,r(66).f=R.f=$,r(41).f=G,r(58).f=Q,i&&!r(26)&&a(F,"propertyIsEnumerable",G,!0),_.f=function(e){return Z(p(e))}),s(s.G+s.W+s.F*!V,{Symbol:P});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)p(ee[te++]);for(var ee=x(p.store),te=0;ee.length>te;)b(ee[te++]);s(s.S+s.F*!V,"Symbol",{for:function(e){return o(U,e+="")?U[e]:U[e]=P(e)},keyFor:function(e){if(J(e))return y(U,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){z=!0},useSimple:function(){z=!1}}),s(s.S+s.F*!V,"Object",{create:K,defineProperty:W,defineProperties:Y,getOwnPropertyDescriptor:X,getOwnPropertyNames:$,getOwnPropertySymbols:Q}),C&&s(s.S+s.F*(!V||c(function(){var e=P();return"[null]"!=A([e])||"{}"!=A({a:e})||"{}"!=A(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!J(e)){for(var t,r,n=[e],o=1;arguments.length>o;)n.push(arguments[o++]);return t=n[1],"function"==typeof t&&(r=t),!r&&v(t)||(t=function(e,t){if(r&&(t=r.call(this,e,t)),!J(t))return t}),n[1]=t,A.apply(C,n)}}}),P.prototype[T]||r(7)(P.prototype,T,P.prototype.valueOf),f(P,"Symbol"),f(Math,"Math",!0),f(n.JSON,"JSON",!0)},function(e,t,r){r(48)("asyncIterator")},function(e,t,r){r(48)("observable")},,,,,,,,,,function(e,t,r){e.exports={default:r(159),__esModule:!0}},function(e,t){!function(){"use strict";function Observer(e,t,r,n,o,i){function deliver(e,n){if(deliver.delay=n,!deliver.pause&&a.changeset.length>0){if(!e){var o=a.changeset.filter(function(e){return!r||r.indexOf(e.type)>=0});o.length>0&&t(o)}a.changeset=[]}}var s,a=this;return deliver.pause=o,deliver.delay=i,a.get=function(e,t){return"__observer__"===t?a:"unobserve"===t?function(){return Object.unobserve(e),e}:"deliver"===t?deliver:e[t]},a.target=e,a.changeset=[],a.target.__observerCallbacks__||(Object.defineProperty(e,"__observerCallbacks__",{enumerable:!1,configurable:!0,writable:!1,value:[]}),Object.defineProperty(e,"__observers__",{enumerable:!1,configurable:!0,writable:!1,value:[]})),a.target.__observerCallbacks__.push(t),a.target.__observers__.push(this),s=new Proxy(e,a),deliver(!1,i),s}Object.observe||"function"!=typeof Proxy||(Observer.prototype.deliver=function(){return this.get(null,"deliver")},Observer.prototype.set=function(e,t,r){var n=e[t],o=void 0===n?"add":"update";if(e[t]=r,e.__observers__.indexOf(this)>=0&&(!this.acceptlist||this.acceptlist.indexOf(o)>=0)){var i={object:e,name:t,type:o},s=0===this.changeset.length,a=this.deliver();"update"===o&&(i.oldValue=n),this.changeset.push(i),s&&a(!1,"number"==typeof a.delay?a.delay:10)}return!0},Observer.prototype.deleteProperty=function(e,t){var r=e[t];if(delete e[t],e.__observers__.indexOf(this)>=0&&!this.acceptlist||this.acceptlist.indexOf("delete")>=0){var n={object:e,name:t,type:"delete",oldValue:r},o=0===this.changeset.length,i=this.deliver();this.changeset.push(n),o&&i(!1,"number"==typeof i.delay?i.delay:10)}return!0},Observer.prototype.defineProperty=function(e,t,r){if(Object.defineProperty(e,t,r),e.__observers__.indexOf(this)>=0&&!this.acceptlist||this.acceptlist.indexOf("reconfigure")>=0){var n={object:e,name:t,type:"reconfigure"},o=0===this.changeset.length,i=this.deliver();this.changeset.push(n),o&&i(!1,"number"==typeof i.delay?i.delay:10)}return!0},Observer.prototype.setPrototypeOf=function(e,t){var r=Object.getPrototypeOf(e);if(Object.setPrototypeOf(e,t),e.__observers__.indexOf(this)>=0&&!this.acceptlist||this.acceptlist.indexOf("setPrototype")>=0){var n={object:e,name:"__proto__",type:"setPrototype",oldValue:r},o=0===this.changeset.length,i=this.deliver();this.changeset.push(n),o&&i(!1,"number"==typeof i.delay?i.delay:10)}return!0},Observer.prototype.preventExtensions=function(e){if(Object.preventExtensions(e),e.__observers__.indexOf(this)>=0&&!this.acceptlist||this.acceptlist.indexOf("preventExtensions")>=0){var t={object:e,type:"preventExtensions"},r=0===this.changeset.length,n=this.deliver();this.changeset.push(t),r&&n(!1,"number"==typeof n.delay?n.delay:10)}return!0},Object.observe=function(e,t,r,n,o,i){return new Observer(e,t,r,n,o,i)},Object.unobserve=function(e,t){if(e.__observerCallbacks__){if(!t)return e.__observerCallbacks__.splice(0,e.__observerCallbacks__.length),void e.__observers__.splice(0,e.__observers__.length);e.__observerCallbacks__.forEach(function(r,n){t===r&&(e.__observerCallbacks__.splice(n,1),delete e.__observers__[n].callback,e.__observers__.splice(n,1))})}},Array.observe=function(e,t,r,n,o,i){if(!(e instanceof Array||Array.isArray(e)))throw new TypeError("First argument to Array.observer is not an Array");r=r||["add","update","delete","splice"];var s=new Proxy(e,{get:function(t,n){return"unobserve"===n?function(e){return e?Object.unobserve(t,e):t.unobserve()}:"splice"===n?function(n,o){if("number"!=typeof n||"number"!=typeof o)throw new TypeError("First two arguments to Array splice are not number, number");var i=this.slice(n,n+o),s=arguments.length>1?arguments.length-2:0,u={object:e,type:"splice",index:n,removed:i,addedCount:s};if(t.splice.apply(t,arguments),r.indexOf("splice")>=0){var n=0===a.__observer__.changeset.length,c=a.__observer__.deliver();a.__observer__.changeset.push(u),n&&c(!1,"number"==typeof c.delay?c.delay:10)}}:"push"===n?function(e){return this.splice(this.length,0,e)}:"pop"===n?function(){return this.splice(this.length-1,1)}:"unshift"===n?function(e){return this.splice(0,0,e)}:"shift"===n?function(){return this.splice(0,1)}:t[n]}}),a=Object.observe(s,function(e){var n=e.filter(function(e){return"length"!==e.name&&"add"!==e.name&&(!r||r.indexOf(e.type)>=0)});n.length>0&&t(n)},r,n,o,i);return a},Array.unobserve=function(e,t){return e.unobserve(t)}),Object.deepObserve=function(e,t,r){function reobserve(e,r){Object.keys(e).forEach(function(o){if(("object"===n(e[o])||"array"===n(e[o]))&&!e[o].hasOwnProperty("__observers__")){var i=r.slice(0);i.push(o),e[o]=Object.deepObserve(e[o],t,i)}})}r=r||[];var n=function(e){return{}.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase()};return reobserve(e,r),Object.observe(e,function(e){function recurse(e,t,r,o,i){if(o instanceof Object){Object.keys(o).forEach(function(s){if(!r||r[s]!==o[s]){var a=r&&void 0!==r[s]?r[s]:void 0,u=void 0===a?"add":"update",c=i+"."+s;n.push({name:e,object:t,type:u,oldValue:a,newValue:o[s],keypath:c}),recurse(e,t,a,o[s],c)}})}else if(r instanceof Object){var s=Object.keys(r);s.forEach(function(s){var a=null===o?"update":"delete",u=i+"."+s;n.push({name:e,object:t,type:a,oldValue:r[s],newValue:o,keypath:u}),recurse(e,t,r[s],void 0,u)})}}var n=[];e.forEach(function(e){var t=(r.length>0?r.join(".")+".":"")+e.name;"update"!==e.type&&"add"!==e.type||reobserve(e.object,r),n.push({name:e.name,object:e.object,type:e.type,oldValue:e.oldValue,newValue:e.object[e.name],keypath:t}),recurse(e.name,e.object,e.oldValue,e.object[e.name],t)}),t(n)})}}()},,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(72),o=_interopRequireDefault(n),i=r(59),s=_interopRequireDefault(i),a=r(118),u=_interopRequireDefault(a),c=r(31),l=_interopRequireDefault(c),f=r(8),d=_interopRequireDefault(f),p=r(10),_=_interopRequireDefault(p),b=r(35),y=_interopRequireDefault(b),h=r(125),v=_interopRequireDefault(h),m=r(34),g=_interopRequireDefault(m),O=r(71),j=r(123),w=_interopRequireDefault(j),R={ANY:"any",START:"start",EXACT:"exact"},D=function(e){function DataObjectObserver(e){(0,d.default)(this,DataObjectObserver);var t=(0,y.default)(this,(DataObjectObserver.__proto__||(0,l.default)(DataObjectObserver)).call(this,e)),r=t;return r._version=e.version,r._filters={},r._syncObj.observe(function(e){r._onFilter(e)}),r._allocateListeners(),t}return(0,g.default)(DataObjectObserver,e),(0,_.default)(DataObjectObserver,[{key:"sync",value:function(){var e=this;console.info("[DataObjectObserver_sync] synchronising "),e._syncher.read(e._metadata.url).then(function(t){console.info("[DataObjectObserver_sync] value to sync: ",t),(0,u.default)(e.data,(0,O.deepClone)(t.data)),e._version=t.version,e._metadata.lastModified=t.lastModified}).catch(function(e){console.info("[DataObjectObserver_sync] sync failed: ",e)})}},{key:"_allocateListeners",value:function(){(0,v.default)(DataObjectObserver.prototype.__proto__||(0,l.default)(DataObjectObserver.prototype),"_allocateListeners",this).call(this);var e=this;e._changeListener=e._bus.addListener(e._url+"/changes",function(t){"update"===t.type&&(console.log("DataObjectObserver-"+e._url+"-RCV: ",t),e._changeObject(e._syncObj,t))})}},{key:"_releaseListeners",value:function(){(0,v.default)(DataObjectObserver.prototype.__proto__||(0,l.default)(DataObjectObserver.prototype),"_releaseListeners",this).call(this),this._changeListener.remove()}},{key:"delete",value:function(){var e=this;e.unsubscribe(),e._releaseListeners(),delete e._syncher._observers[e._url]}},{key:"unsubscribe",value:function(){var e=this,t={type:"unsubscribe",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectObserver-UNSUBSCRIBE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._observers[e._url])})}},{key:"onChange",value:function(e,t){var r=e,n={type:R.EXACT,callback:t},o=e.indexOf("*");o===e.length-1&&(0===o?n.type=R.ANY:(n.type=R.START,r=e.substr(0,e.length-1))),this._filters[r]=n}},{key:"_onFilter",value:function(e){var t=this;(0,s.default)(t._filters).forEach(function(r){var n=t._filters[r];n.type===R.ANY?n.callback(e):n.type===R.START?0===e.field.indexOf(r)&&n.callback(e):n.type===R.EXACT&&e.field===r&&n.callback(e)})}},{key:"onDisconnected",value:function(e){var t=this;return new o.default(function(r,n){t._subscribeRegistration().then(function(){t._onDisconnected=e,r()}).catch(function(e){return n(e)})})}},{key:"_subscribeRegistration",value:function(){var e=this,t={type:"subscribe",from:this._owner,to:this._syncher._runtimeUrl+"/subscriptions",body:{resources:[this._url+"/registration"]}};return new o.default(function(r,n){e._bus.postMessage(t,function(t){console.log("[DataObjectObserver._subscribeRegistration] "+e._url+" rcved reply ",t),200===t.body.code?(e._generateListener(e._url+"/registration"),r()):(console.error("Error subscribing registration status for ",e._url),n("Error subscribing registration status for "+e._url))})})}},{key:"_generateListener",value:function(e){var t=this;t._bus.addListener(e,function(e){console.log("[DataObjectObserver.registrationNotification] "+t._url+": ",e),e.body.value&&"disconnected"===e.body.value&&t._onDisconnected&&(console.log("[DataObjectObserver] "+t._url+": was disconnected ",e),t._onDisconnected())})}}]),DataObjectObserver}(w.default);t.default=D,e.exports=t.default},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(59),o=_interopRequireDefault(n),i=r(31),s=_interopRequireDefault(i),a=r(8),u=_interopRequireDefault(a),c=r(10),l=_interopRequireDefault(c),f=r(35),d=_interopRequireDefault(f),p=r(125),_=_interopRequireDefault(p),b=r(34),y=_interopRequireDefault(b),h=r(123),v=_interopRequireDefault(h),m=r(71),g=function(e){function DataObjectReporter(e){(0,u.default)(this,DataObjectReporter);var t=(0,d.default)(this,(DataObjectReporter.__proto__||(0,s.default)(DataObjectReporter)).call(this,e)),r=t;return r._subscriptions={},r._syncObj.observe(function(e){console.log("[Syncher.DataObjectReporter] "+r.url+" publish change: ",e),r._onChange(e)}),r._allocateListeners(),r._invitations=[],t}return(0,y.default)(DataObjectReporter,e),(0,l.default)(DataObjectReporter,[{key:"_allocateListeners",value:function(){(0,_.default)(DataObjectReporter.prototype.__proto__||(0,s.default)(DataObjectReporter.prototype),"_allocateListeners",this).call(this);var e=this;e._objectListener=e._bus.addListener(e._url,function(t){switch(console.log("[Syncher.DataObjectReporter] listener "+e._url+" Received: ",t),t.type){case"response":e._onResponse(t);break;case"read":e._onRead(t)}})}},{key:"_releaseListeners",value:function(){(0,_.default)(DataObjectReporter.prototype.__proto__||(0,s.default)(DataObjectReporter.prototype),"_releaseListeners",this).call(this),this._objectListener.remove()}},{key:"inviteObservers",value:function(e){var t=this,r=[];if(e.forEach(function(e){t._invitations[e]||(r.push(e),t._invitations[e]=e)}),r.length>0){console.log("[Syncher.DataObjectReporter] InviteObservers ",r,t._metadata);var n={type:"create",from:t._syncher._owner,to:t._syncher._subURL,body:{resume:!1,resource:t._url,schema:t._schema,value:t._metadata,authorise:r}};t._bus.postMessage(n)}}},{key:"delete",value:function(){var e=this,t={type:"delete",from:e._owner,to:e._syncher._subURL,body:{resource:e._url}};e._bus.postMessage(t,function(t){console.log("DataObjectReporter-DELETE: ",t),200===t.body.code&&(e._releaseListeners(),delete e._syncher._reporters[e._url],e._syncObj={})})}},{key:"onSubscription",value:function(e){this._onSubscriptionHandler=e}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"onRead",value:function(e){this._onReadHandler=e}},{key:"_onForward",value:function(e){var t=this;switch(console.log("DataObjectReporter-RCV: ",e),e.body.type){case"subscribe":t._onSubscribe(e);break;case"unsubscribe":t._onUnSubscribe(e)}}},{key:"_onSubscribe",value:function(e){var t=this,r=this,n=e.body.from,o=(0,m.divideURL)(n),i=o.domain;console.log("[DataObjectReporter._onSubscribe]",e,i,o);var s={type:e.body.type,url:n,domain:i,identity:e.body.identity,accept:function(){var o={url:n,status:"live"};r._subscriptions[n]=o,r.metadata.subscriptions&&r.metadata.subscriptions.push(o.url);var i=r._metadata;i.data=(0,m.deepClone)(r.data),i.version=r._version;var s={id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,schema:r._schema,value:i}};return e.body.hasOwnProperty("mutualAuthentication")&&!e.body.mutualAuthentication&&(s.body.mutualAuthentication=t._mutualAuthentication,t._mutualAuthentication=e.body.mutualAuthentication),r._bus.postMessage(s),o},reject:function(t){r._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:403,desc:t}})}};r._onSubscriptionHandler&&(console.log("SUBSCRIPTION-EVENT: ",s),r._onSubscriptionHandler(s))}},{key:"_onUnSubscribe",value:function(e){var t=this,r=e.body.from,n=(0,m.divideURL)(r),o=n.domain;console.log("[DataObjectReporter._onUnSubscribe]",e,o,n),delete t._subscriptions[r],delete t._invitations[r];var i={type:e.body.type,url:r,domain:o,identity:e.body.identity};t._onSubscriptionHandler&&(console.log("UN-SUBSCRIPTION-EVENT: ",i),t._onSubscriptionHandler(i))}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.from,code:e.body.code};t._onResponseHandler&&(console.log("RESPONSE-EVENT: ",r),t._onResponseHandler(r))}},{key:"_onRead",value:function(e){var t=this,r=(0,m.deepClone)(t.metadata);r.data=(0,m.deepClone)(t.data),r.version=t._version;var n={id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,value:r}},i={type:e.type,url:e.from,accept:function(){t._bus.postMessage(n)},reject:function(r){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:401,desc:r}})}},s=[];t.metadata.subscriptions?s=t.metadata.subscriptions:t._subscriptions&&(s=(0,o.default)(t._subscriptions).map(function(e){return t._subscriptions[e].url})),-1!=s.indexOf(e.from)?t._bus.postMessage(n):t._onReadHandler&&(console.log("READ-EVENT: ",i),t._onReadHandler(i))}},{key:"subscriptions",get:function(){return this._subscriptions}}]),DataObjectReporter}(v.default);t.default=g,e.exports=t.default},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(72),o=_interopRequireDefault(n),i=r(59),s=_interopRequireDefault(i),a=r(118),u=_interopRequireDefault(a),c=r(8),l=_interopRequireDefault(c),f=r(10),d=_interopRequireDefault(f),p=r(124),_=_interopRequireDefault(p),b=r(149),y=_interopRequireDefault(b),h=r(71),v=function(){function DataObject(e){function throwMandatoryParmMissingError(e){throw"[DataObject] "+e+" mandatory parameter is missing"}(0,l.default)(this,DataObject);var t=this;e.syncher?t._syncher=e.syncher:throwMandatoryParmMissingError("syncher"),e.url?t._url=e.url:throwMandatoryParmMissingError("url"),e.created?t._created=e.created:throwMandatoryParmMissingError("created"),e.reporter?t._reporter=e.reporter:throwMandatoryParmMissingError("reporter"),e.runtime?t._runtime=e.runtime:throwMandatoryParmMissingError("runtime"),e.schema?t._schema=e.schema:throwMandatoryParmMissingError("schema"),e.name?t._name=e.name:throwMandatoryParmMissingError("name"),t._status=e.status,e.data?t._syncObj=new _.default(e.data):t._syncObj=new _.default({}),t._childrens=e.childrens,t._mutualAuthentication=e.mutual,t._version=0,t._childId=0,t._childrenListeners=[],t._resumed=e.resume,e.resume&&(t._version=e.version),t._owner=e.syncher._owner,t._bus=e.syncher._bus,e.description&&(t._description=e.description),e.tags&&(t._tags=e.tags),e.resources&&(t._resources=e.resources),e.observerStorage&&(t._observerStorage=e.observerStorage),e.publicObservation&&(t._publicObservation=e.publicObservation),t._metadata=(0,u.default)(e),t._metadata.lastModified=t._metadata.created,delete t._metadata.data,delete t._metadata.syncher,delete t._metadata.authorise}return(0,d.default)(DataObject,[{key:"_getLastChildId",value:function(){var e=this,t=0,r=e._owner+"#"+t;return(0,s.default)(e._childrens).filter(function(t){e._childrens[t].childId>r&&(r=e._childrens[t].childId)}),t=Number(r.split("#")[1])}},{key:"_allocateListeners",value:function(){var e=this,t=this,r=t._url+"/children/";console.log("[Data Object - AllocateListeners] - ",t._childrens),t._childrens&&t._childrens.forEach(function(n){var o=r+n,i=t._bus.addListener(o,function(r){if(r.from!==e._owner)switch(console.log("DataObject-Children-RCV: ",r),r.type){case"create":t._onChildCreate(r);break;case"delete":console.log(r);break;default:t._changeChildren(r)}});t._childrenListeners.push(i)})}},{key:"_releaseListeners",value:function(){var e=this;e._childrenListeners.forEach(function(e){e.remove()}),e._childrenObjects&&(0,s.default)(e._childrenObjects).forEach(function(t){e._childrenObjects[t]._releaseListeners()})}},{key:"resumeChildrens",value:function(e){var t=this,r=this,n=this._owner+"#"+this._childId;e&&!r._childrenObjects&&(r._childrenObjects={}),(0,s.default)(e).forEach(function(o){var i=e[o];(0,s.default)(i).forEach(function(e){var s=i[e].value;console.log("[DataObject.resumeChildrens] new DataObjectChild: ",o,i,s),s.parentObject=r,s.parent=r._url,r._childrenObjects[e]=new y.default(s),r._childrenObjects[e].identity=i[e].identity,e>n&&(n=e),console.log("[DataObjectReporter.resumeChildrens] - resumed: ",t._childrenObjects[e])})}),this._childId=Number(n.split("#")[1])}},{key:"pause",value:function(){throw"Not implemented"}},{key:"resume",value:function(){throw"Not implemented"}},{key:"stop",value:function(){throw"Not implemented"}},{key:"addChild",value:function(e,t,r,n){var i=this;return new o.default(function(o){var s=(0,u.default)({},n);i._childId++,s.url=i._owner+"#"+i._childId;var a=i._url+"/children/"+e;s.parentObject=i,s.data=t,s.reporter=i._owner,s.created=(new Date).toISOString(),s.runtime=i._runtime,s.schema=i._schema,s.parent=i.url;var c=new y.default(s),l=c.metadata;l.data=t;var f={type:"create",from:i._owner,to:a,body:{resource:s.url,value:l}};r&&(c.identity=r,f.body.identity=r),i._mutualAuthentication||(f.body.mutualAuthentication=i._mutualAuthentication);var d=i._bus.postMessage(f);console.log("[DataObject.addChild] added ",c,d,l),c.onChange(function(e){i._onChange(e,{path:a,childId:s.url})}),i._childrenObjects||(i._childrenObjects={}),i._childrenObjects[s.url]=c,o(c)})}},{key:"onAddChild",value:function(e){this._onAddChildrenHandler=e}},{key:"_onChildCreate",value:function(e){var t=this,r=(0,h.deepClone)(e.body.value);r.parentObject=t,console.log("[DataObject._onChildCreate] receivedBy "+t._owner+" : ",e);var n=new y.default(r);n.identity=e.body.identity,t._childrenObjects||(t._childrenObjects={}),t._childrenObjects[r.url]=n,setTimeout(function(){t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,source:t._owner}})});var o={type:e.type,from:e.from,url:e.to,value:e.body.value.data,childId:r.url,identity:e.body.identity};t._onAddChildrenHandler&&(console.log("ADD-CHILDREN-EVENT: ",o),t._onAddChildrenHandler(o))}},{key:"_onChange",value:function(e,t){var r=this;if(r._metadata.lastModified=(new Date).toISOString(),r._version++,"live"===r._status){var n={type:"update",from:r._url,to:r._url+"/changes",body:{version:r._version,source:r._owner,attribute:e.field,lastModified:r._metadata.lastModified}};console.log("[DataObject - _onChange] - ",e,t,n),e.oType===p.ObjectType.OBJECT?e.cType!==p.ChangeType.REMOVE&&(n.body.value=e.data):(n.body.attributeType=e.oType,n.body.value=e.data,e.cType!==p.ChangeType.UPDATE&&(n.body.operation=e.cType)),t&&(n.to=t.path,n.body.resource=t.childId),r._mutualAuthentication||(n.body.mutualAuthentication=r._mutualAuthentication),r._bus.postMessage(n)}}},{key:"_changeObject",value:function(e,t){var r=this;if(r._version+1<=t.body.version){r._version=t.body.version;var n=t.body.attribute,o=(0,h.deepClone)(t.body.value),i=e.findBefore(n);if(t.body.lastModified?r._metadata.lastModified=t.body.lastModified:r._metadata.lastModified=(new Date).toISOString(),t.body.attributeType===p.ObjectType.ARRAY)if(t.body.operation===p.ChangeType.ADD){var s=i.obj,a=i.last;Array.prototype.splice.apply(s,[a,0].concat(o))}else if(t.body.operation===p.ChangeType.REMOVE){var u=i.obj,c=i.last;u.splice(c,o)}else i.obj[i.last]=o;else t.body.value?i.obj[i.last]=o:delete i.obj[i.last]}else console.log("UNSYNCHRONIZED VERSION: (data => "+r._version+", msg => "+t.body.version+")")}},{key:"_changeChildren",value:function(e){var t=this;console.log("Change children: ",t._owner,e);var r=e.body.resource,n=t._childrenObjects[r];n?t._changeObject(n._syncObj,e):console.log("No children found for: ",r)}},{key:"metadata",get:function(){return this._metadata}},{key:"url",get:function(){return this._url}},{key:"schema",get:function(){return this._schema}},{key:"status",get:function(){return this._status}},{key:"data",get:function(){return this._syncObj.data}},{key:"childrens",get:function(){return this._childrenObjects}}]),DataObject}();t.default=v,e.exports=t.default},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.ObjectType=t.ChangeType=void 0;var n=r(8),o=_interopRequireDefault(n),i=r(10),s=_interopRequireDefault(i);r(119);var a=r(71),u=function(){function SyncObject(e){(0,o.default)(this,SyncObject);var t=this;t._observers=[],t._filters={},this._data=e||{},this._internalObserve(this._data)}return(0,s.default)(SyncObject,[{key:"observe",value:function(e){this._observers.push(e)}},{key:"find",value:function(e){var t=(0,a.parseAttributes)(e);return this._findWithSplit(t)}},{key:"findBefore",value:function(e){var t={},r=(0,a.parseAttributes)(e);return t.last=r.pop(),t.obj=this._findWithSplit(r),t}},{key:"_findWithSplit",value:function(e){var t=this._data;return e.forEach(function(e){t=t[e]}),t}},{key:"_internalObserve",value:function(e){var t=this,r=function(e){e.every(function(e){t._onChanges(e)})};this._data=Object.deepObserve(e,r)}},{key:"_fireEvent",value:function(e){this._observers.forEach(function(t){t(e)})}},{key:"_onChanges",value:function(e){var t=e.object,r=void 0;t.constructor===Object&&(r=l.OBJECT),t.constructor===Array&&(r=l.ARRAY);var n=e.keypath,o=t[e.name];"update"!==e.type||n.includes(".length")||this._fireEvent({cType:c.UPDATE,oType:r,field:n,data:o}),"add"===e.type&&this._fireEvent({cType:c.ADD,oType:r,field:n,data:o}),"delete"===e.type&&this._fireEvent({cType:c.REMOVE,oType:r,field:n})}},{key:"data",get:function(){return this._data}}]),SyncObject}(),c=t.ChangeType={UPDATE:"update",ADD:"add",REMOVE:"remove"},l=t.ObjectType={OBJECT:"object",ARRAY:"array"};t.default=u},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(31),o=_interopRequireDefault(n),i=r(154),s=_interopRequireDefault(i);t.default=function get(e,t,r){null===e&&(e=Function.prototype);var n=(0,s.default)(e,t);if(void 0===n){var i=(0,o.default)(e);return null===i?void 0:get(i,t,r)}if("value"in n)return n.value;var a=n.get;if(void 0!==a)return a.call(r)}},,,,,,,,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(72),o=_interopRequireDefault(n),i=r(118),s=_interopRequireDefault(i),a=r(8),u=_interopRequireDefault(a),c=r(10),l=_interopRequireDefault(c),f=r(71),d=r(122),p=_interopRequireDefault(d),_=r(121),b=_interopRequireDefault(_),y=r(150),h=_interopRequireDefault(y),v=function(){function Syncher(e,t,r){(0,u.default)(this,Syncher);var n=this;n._owner=e,n._bus=t,n._subURL=r.runtimeURL+"/sm",n._runtimeUrl=r.runtimeURL,n._reporters={},n._observers={},n._provisionals={},t.addListener(e,function(t){if(t.from!==e)switch(console.info("[Syncher] Syncher-RCV: ",t,n),t.type){case"forward":n._onForward(t);break;case"create":n._onRemoteCreate(t);break;case"delete":n._onRemoteDelete(t);break;case"execute":n._onExecute(t)}})}return(0,l.default)(Syncher,[{key:"create",value:function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"no name",a=arguments[6],u=arguments[7];if(!e)throw Error("[Syncher - Create] - You need specify the data object schema");if(!t)throw Error("[Syncher - Create] -The observers should be defined");var c=this,l=(0,s.default)({},u);return l.p2p=o,l.store=n,l.schema=e,l.authorise=t,l.data=r?(0,f.deepClone)(r):{},l.name=0===i.length?"no name":i,l.reporter=c._owner,l.resume=!1,u?(l.mutual=!u.mutual||u.mutual,l.name=u.name?u.name:l.name):l.mutual=!0,a&&(l.identity=a),console.log("[syncher - create] - create Reporter - createInput: ",l),c._create(l)}},{key:"resumeReporters",value:function(e){var t=this;return console.log("[syncher - create] - resume Reporter - criteria: ",e),(0,s.default)(e,{resume:!0}),t._resumeCreate(e)}},{key:"subscribe",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],i=arguments[5],a=this,u={};return u.p2p=n,u.store=r,u.schema=e,u.resource=t,i&&(u.identity=i),u.mutual=o,console.log("[syncher - subscribe] - subscribe criteria: ",u),(0,s.default)(u,{resume:!1}),a._subscribe(u)}},{key:"resumeObservers",value:function(e){var t=this,r=e||{};return(0,s.default)(r,{resume:!0}),t._resumeSubscribe(r)}},{key:"read",value:function(e){var t=this,r={type:"read",from:t._owner,to:e};return new o.default(function(e,n){t._bus.postMessage(r,function(t){console.log("read-response: ",t),200===t.body.code?e(t.body.value):n(t.body.desc)})})}},{key:"onNotification",value:function(e){this._onNotificationHandler=e}},{key:"onClose",value:function(e){this._onClose=e}},{key:"_create",value:function(e){var t=this;return new o.default(function(r,n){var o=(0,s.default)({},e),i=e.resume;o.created=(new Date).toISOString(),o.runtime=t._runtimeUrl;var a=(0,f.deepClone)(o);delete a.p2p,delete a.store,delete a.observers,delete a.identity;var u={type:"create",from:t._owner,to:t._subURL,body:{resume:i,value:a}};u.body.schema=o.schema,o.p2p&&(u.body.p2p=o.p2p),o.store&&(u.body.store=o.store),o.identity&&(u.body.identity=o.identity),console.log("[syncher._create]: ",o,u),t._bus.postMessage(u,function(i){if(console.log("[syncher - create] - create-response: ",i),200===i.body.code){o.url=i.body.resource,o.status="live",o.syncher=t,o.childrens=i.body.childrenResources;var s=t._reporters[o.url];s||(s=new p.default(o),t._reporters[o.url]=s,s.inviteObservers(e.authorise)),r(s)}else n(i.body.desc)})})}},{key:"_resumeCreate",value:function(e){var t=this,r=this;return new o.default(function(n,o){var i=e.resume,s={type:"create",from:r._owner,to:r._subURL,body:{resume:i}};console.log("[syncher - create]: ",e,s),e&&(s.body.value=e,s.body.value.reporter=r._owner),e.p2p&&(s.body.p2p=e.p2p),e.store&&(s.body.store=e.store),e.observers&&(s.body.authorise=e.observers),e.identity&&(s.body.identity=e.identity),console.log("[syncher._resumeCreate] - resume message: ",s),r._bus.postMessage(s,function(e){if(console.log("[syncher._resumeCreate] - create-resumed-response: ",e),200===e.body.code){var i=e.body.value;for(var s in i){var a=i[s];a.data=(0,f.deepClone)(a.data)||{},a.childrenObjects&&(a.childrenObjects=(0,f.deepClone)(a.childrenObjects)),a.mutual=!1,a.resume=!0,a.status="live",a.syncher=r,console.log("[syncher._resumeCreate] - create-resumed-dataObjectReporter",a);var u=new p.default(a);a.childrenObjects&&u.resumeChildrens(a.childrenObjects),r._reporters[a.url]=u}n(r._reporters),t._onReportersResume&&t._onReportersResume(t._reporters)}else 404===e.body.code?n({}):o(e.body.desc)})})}},{key:"_subscribe",value:function(e){var t=this;return new o.default(function(r,n){var o={type:"subscribe",from:t._owner,to:t._subURL,body:{}};e&&(e.hasOwnProperty("p2p")&&(o.body.p2p=e.p2p),e.hasOwnProperty("store")&&(o.body.store=e.store),e.hasOwnProperty("schema")&&(o.body.schema=e.schema),e.hasOwnProperty("identity")&&(o.body.identity=e.identity),e.hasOwnProperty("resource")&&(o.body.resource=e.resource)),o.body.resume=e.resume,e.hasOwnProperty("mutual")&&(o.body.mutualAuthentication=e.mutual),console.log("[syncher_subscribe] - subscribe message: ",e,o),t._bus.postMessage(o,function(o){console.log("[syncher] - subscribe-response: ",o);var i=o.body.resource,s=t._provisionals[i];if(delete t._provisionals[i],s&&s._releaseListeners(),o.body.code<200)console.log("[syncher] - new DataProvisional: ",o.body.childrenResources,i),s=new h.default(t._owner,i,t._bus,o.body.childrenResources),t._provisionals[i]=s;else if(200===o.body.code){console.log("[syncher] - new Data Object Observer: ",o,t._provisionals);var a=o.body.value;a.syncher=t,a.p2p=e.p2p,a.store=e.store,a.identity=e.identity,a.resume=!1,a.mutual=e.mutual;var u=t._observers[i];u?u.sync():(u=new b.default(a),t._observers[i]=u),console.log("[syncher] - new Data Object Observer already exist: ",u),r(u),s&&s.apply(u)}else n(o.body.desc)})})}},{key:"_resumeSubscribe",value:function(e){var t=this,r=this;return new o.default(function(n,o){var i={type:"subscribe",from:r._owner,to:r._subURL,body:{}};e&&(e.hasOwnProperty("p2p")&&(i.body.p2p=e.p2p),e.hasOwnProperty("store")&&(i.body.store=e.store),e.hasOwnProperty("schema")&&(i.body.schema=e.schema),e.hasOwnProperty("identity")&&(i.body.identity=e.identity),e.hasOwnProperty("resource")&&(i.body.resource=e.url)),i.body.resume=e.resume;var s=e.mutual;e.hasOwnProperty("mutual")&&(i.body.mutualAuthentication=s),console.log("[syncher] - subscribe message: ",e,i),r._bus.postMessage(i,function(e){console.log("[syncher] - subscribe-resumed-response: ",e);var i=e.body.resource,s=r._provisionals[i];if(delete r._provisionals[i],s&&s._releaseListeners(),e.body.code<200)console.log("[syncher] - resume new DataProvisional: ",e,i),s=new h.default(r._owner,i,r._bus,e.body.childrenResources),r._provisionals[i]=s;else if(200===e.body.code){var a=e.body.value;for(var u in a){var c=a[u];console.log("[syncher] - Resume Object Observer: ",e,c,r._provisionals),c.childrenObjects&&(c.childrenObjects=(0,f.deepClone)(c.childrenObjects)),c.data=(0,f.deepClone)(c.data)||{},c.resume=!0,c.syncher=r,console.log("[syncher._resumeSubscribe] - create new dataObject: ",c);var l=new b.default(c);c.childrenObjects&&l.resumeChildrens(c.childrenObjects),console.log("[syncher._resumeSubscribe] - new dataObject",l),r._observers[l.url]=l,r._provisionals[l.url]&&r._provisionals[l.url].apply(l)}n(r._observers),t._onObserversResume&&t._onObserversResume(r._observers)}else 404===e.body.code?n({}):o(e.body.desc)})})}},{key:"_onForward",value:function(e){this._reporters[e.body.to]._onForward(e)}},{key:"_onRemoteCreate",value:function(e){var t=this,r=e.from.slice(0,-13),n=(0,f.divideURL)(r),o=n.domain,i={type:e.type,from:e.body.source,url:r,domain:o,schema:e.body.schema,value:e.body.value,identity:e.body.identity,ack:function(r){var n=200;r&&(n=r),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:n}})}};t._onNotificationHandler&&(console.info("[Syncher] NOTIFICATION-EVENT: ",i),t._onNotificationHandler(i))}},{key:"_onRemoteDelete",value:function(e){var t=this,r=e.body.resource,n=t._observers[r],o={from:t.owner,to:t._subURL,id:e.id,type:"unsubscribe",body:{resource:e.body.resource}};if(t._bus.postMessage(o),delete t._observers[r],n){var i={type:e.type,url:r,identity:e.body.identity,ack:function(r){var o=200;r&&(o=r),200===o&&n.delete(),t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:o,source:t._owner}})}};t._onNotificationHandler&&(console.log("NOTIFICATION-EVENT: ",i),t._onNotificationHandler(i))}else t._bus.postMessage({id:e.id,type:"response",from:e.to,to:e.from,body:{code:404,source:t._owner}})}},{key:"_onExecute",value:function(e){var t=this,r={id:e.id,type:"response",from:e.to,to:e.from,body:{code:200}};if((e.from===t._runtimeUrl+"/registry/"||e.from===t._runtimeUrl+"/registry")&&e.body&&e.body.method&&"close"===e.body.method&&t._onClose){var n={type:"close",ack:function(e){e&&(r.body.code=e),t._bus.postMessage(r)}};console.info("[Syncher] Close-EVENT: ",n),t._onClose(n)}else t._bus.postMessage(r)}},{key:"onReportersResume",value:function(e){this._onReportersResume=e}},{key:"onObserversResume",value:function(e){this._onObserversResume=e}},{key:"owner",get:function(){return this._owner}},{key:"reporters",get:function(){return this._reporters}},{key:"observers",get:function(){return this._observers}}]),Syncher}();t.default=v,e.exports=t.default},,,,,,,,,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.DataObjectObserver=t.DataObjectReporter=t.Syncher=void 0;var n=r(133),o=_interopRequireDefault(n),i=r(122),s=_interopRequireDefault(i),a=r(121),u=_interopRequireDefault(a);t.Syncher=o.default,t.DataObjectReporter=s.default,t.DataObjectObserver=u.default},,,,,,,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(8),o=_interopRequireDefault(n),i=r(10),s=_interopRequireDefault(i),a=r(124),u=_interopRequireDefault(a),c=function(){function DataObjectChild(e){function throwMandatoryParmMissingError(e){throw"[DataObjectChild] "+e+" mandatory parameter is missing"}(0,o.default)(this,DataObjectChild);var t=this;e.parent?t._parent=e.parent:throwMandatoryParmMissingError("parent"),e.url?t._url=e.url:throwMandatoryParmMissingError("url"),e.created?t._created=e.created:throwMandatoryParmMissingError("created"),e.reporter?t._reporter=e.reporter:throwMandatoryParmMissingError("reporter"),e.runtime?t._runtime=e.runtime:throwMandatoryParmMissingError("runtime"),e.schema?t._schema=e.schema:throwMandatoryParmMissingError("schema"),e.parentObject?t._parentObject=e.parentObject:throwMandatoryParmMissingError("parentObject"),e.name&&(t._name=e.name),e.description&&(t._description=e.description),e.tags&&(t._tags=e.tags),e.resources&&(t._resources=e.resources),e.observerStorage&&(t._observerStorage=e.observerStorage),e.publicObservation&&(t._publicObservation=e.publicObservation),e.data?t._syncObj=new u.default(e.data):t._syncObj=new u.default({}),console.log("[DataObjectChild -  Constructor] - ",t._syncObj),t._bus=t._parentObject._bus,t._owner=t._parentObject._owner,t._allocateListeners(),t._metadata=e,delete t._metadata.parentObject}return(0,s.default)(DataObjectChild,[{key:"_allocateListeners",value:function(){var e=this;e._reporter===e._owner&&(e._listener=e._bus.addListener(e._reporter,function(t){"response"===t.type&&t.id===e._msgId&&(console.log("DataObjectChild.onResponse:",t),e._onResponse(t))}))}},{key:"_releaseListeners",value:function(){var e=this;e._listener&&e._listener.remove()}},{key:"delete",value:function(){this._releaseListeners()}},{key:"onChange",value:function(e){this._syncObj.observe(function(t){console.log("[DataObjectChild - observer] - ",t),e(t)})}},{key:"onResponse",value:function(e){this._onResponseHandler=e}},{key:"_onResponse",value:function(e){var t=this,r={type:e.type,url:e.body.source,code:e.body.code};t._onResponseHandler&&t._onResponseHandler(r)}},{key:"metadata",get:function(){return this._metadata}},{key:"childId",get:function(){return this._childId}},{key:"data",get:function(){return this._syncObj.data}},{key:"identity",set:function(e){this._identity=e},get:function(){return this._identity}}]),DataObjectChild}();t.default=c,e.exports=t.default},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(8),o=_interopRequireDefault(n),i=r(10),s=_interopRequireDefault(i),a=function(){function DataProvisional(e,t,r,n){(0,o.default)(this,DataProvisional);var i=this;i._owner=e,i._url=t,i._bus=r,i._children=n,i._changes=[],i._allocateListeners()}return(0,s.default)(DataProvisional,[{key:"_allocateListeners",value:function(){var e=this;e._listener=e._bus.addListener(e._url,function(t){console.log("DataProvisional-"+e._url+"-RCV: ",t),e._changes.push(t)})}},{key:"_releaseListeners",value:function(){this._listener.remove()}},{key:"apply",value:function(e){this._changes.forEach(function(t){e._changeObject(e._syncObj,t)})}},{key:"children",get:function(){return this._children}}]),DataProvisional}();t.default=a,e.exports=t.default},,,,function(e,t,r){e.exports={default:r(161),__esModule:!0}},,,,,function(e,t,r){r(165),e.exports=r(0).Object.assign},,function(e,t,r){r(167);var n=r(0).Object;e.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}},function(e,t,r){"use strict";var n=r(18),o=r(58),i=r(41),s=r(32),a=r(56),u=Object.assign;e.exports=!u||r(11)(function(){var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach(function(e){t[e]=e}),7!=u({},e)[r]||Object.keys(u({},t)).join("")!=n})?function(e,t){for(var r=s(e),u=arguments.length,c=1,l=o.f,f=i.f;u>c;)for(var d,p=a(arguments[c++]),_=l?n(p).concat(l(p)):n(p),b=_.length,y=0;b>y;)f.call(p,d=_[y++])&&(r[d]=p[d]);return r}:u},,,function(e,t,r){var n=r(9);n(n.S+n.F,"Object",{assign:r(162)})},,function(e,t,r){var n=r(13),o=r(57).f;r(45)("getOwnPropertyDescriptor",function(){return function(e,t){return o(n(e),t)}})}])});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.divideURL = divideURL;
exports.deepClone = deepClone;
exports.getUserMedia = getUserMedia;
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

// jshint browser:true, jquery: true
// jshint varstmt: true
/* global Handlebars */

/**
 * Support module with some functions will be useful
 * @module utils
 */

/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */

/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
function divideURL(url) {

  if (!url) throw Error('URL is needed to split');

  function recurse(value) {
    var regex = /([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
    var subst = '$1,$3,$4';
    var parts = value.replace(regex, subst).split(',');
    return parts;
  }

  var parts = recurse(url);

  // If the url has no scheme
  if (parts[0] === url && !parts[0].includes('@')) {

    var _result = {
      type: "",
      domain: url,
      identity: ""
    };

    console.error('[DivideURL] DivideURL don\'t support url without scheme. Please review your url address', url);

    return _result;
  }

  // check if the url has the scheme and includes an @
  if (parts[0] === url && parts[0].includes('@')) {
    var scheme = parts[0] === url ? 'smtp' : parts[0];
    parts = recurse(scheme + '://' + parts[0]);
  }

  // if the domain includes an @, divide it to domain and identity respectively
  if (parts[1].includes('@')) {
    parts[2] = parts[0] + '://' + parts[1];
    parts[1] = parts[1].substr(parts[1].indexOf('@') + 1);
  } /*else if (parts[2].includes('/')) {
    parts[2] = parts[2].substr(parts[2].lastIndexOf('/')+1);
    }*/

  var result = {
    type: parts[0],
    domain: parts[1],
    identity: parts[2]
  };

  return result;
}

/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
function deepClone(obj) {
  //TODO: simple but inefficient JSON deep clone...
  if (obj) return JSON.parse(JSON.stringify(obj));
}

/**
 * Get WebRTC API resources
 * @param  {object}     options Object containing the information that resources will be used (camera, mic, resolution, etc);
 * @return {Promise}
 */
function getUserMedia(constraints) {

  return new Promise(function (resolve, reject) {

    navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
      resolve(mediaStream);
    }).catch(function (reason) {
      reject(reason);
    });
  });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/**
 * EventEmitter
 * All classes which extends this, can have addEventListener and trigger events;
 */
var EventEmitter = function () {

    /**
     * Initializes the EventEmitter
     */
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        // set up listener holder
        this.__eventListeners = {};
    }

    /**
     * addEventListener listen for an eventType
     * @param  {string}         eventType - listening for this type of event
     * @param  {Function}       cb        - callback function will be executed when the event it is invoked
     */


    _createClass(EventEmitter, [{
        key: "addEventListener",
        value: function addEventListener(eventType, cb) {
            // add callback to the list of callbacks for this type
            // if the list doesn't exist yet, create it with the callback as member
            if (cb != undefined) {
                if (!this.__eventListeners[eventType]) this.__eventListeners[eventType] = [cb];else this.__eventListeners[eventType].push(cb);
            }
        }

        /**
         * Invoke the eventType
         * @param  {string} eventType - event will be invoked
         * @param  {object} params - parameters will be passed to the addEventListener
         */

    }, {
        key: "trigger",
        value: function trigger(eventType, params) {
            // check if there are callbacks for this type
            var callbacks = this.__eventListeners[eventType];
            if (callbacks) {
                callbacks.forEach(function (cb) {
                    // catch errors to make sure every callback is being called
                    try {
                        cb(params);
                    } catch (e) {
                        console.warn("calling listener " + cb.name + " for event type " + eventType + " with parameters '" + params + "' resulted in an error!", e);
                    }
                });
            }
        }
    }]);

    return EventEmitter;
}();

exports.default = EventEmitter;
module.exports = exports["default"];

/***/ })
/******/ ]);
});