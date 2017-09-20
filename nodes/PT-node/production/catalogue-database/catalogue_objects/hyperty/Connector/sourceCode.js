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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var logDisabled_ = true;
var deprecationWarnings_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  disableWarnings: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  deprecated: function(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function(window) {
    var navigator = window && window.navigator;

    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    // Firefox.
    if (navigator.mozGetUserMedia) {
      result.browser = 'firefox';
      result.version = this.extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if (window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = this.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
      } else { // Safari (in an unpublished version) or unknown webkit-based.
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.browser = 'safari';
          result.version = this.extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        } else { // unknown webkit-based browser.
          result.browser = 'Unsupported webkit-based browser ' +
              'with GUM support but no WebRTC support.';
          return result;
        }
      }
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.browser = 'edge';
      result.version = this.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari, with webkitGetUserMedia removed.
      result.browser = 'safari';
      result.version = this.extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  },

  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

  shimCreateObjectURL: function(window) {
    var URL = window && window.URL;

    if (!(typeof window === 'object' && window.HTMLMediaElement &&
          'srcObject' in window.HTMLMediaElement.prototype)) {
      // Only shim CreateObjectURL using srcObject if srcObject exists.
      return undefined;
    }

    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    var streams = new Map(), newId = 0;

    URL.createObjectURL = function(stream) {
      if ('getTracks' in stream) {
        var url = 'polyblob:' + (++newId);
        streams.set(url, stream);
        utils.deprecated('URL.createObjectURL(stream)',
            'elem.srcObject = stream');
        return url;
      }
      return nativeCreateObjectURL(stream);
    };
    URL.revokeObjectURL = function(url) {
      nativeRevokeObjectURL(url);
      streams.delete(url);
    };

    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
                                              'src');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
      get: function() {
        return dsc.get.apply(this);
      },
      set: function(url) {
        this.srcObject = streams.get(url) || null;
        return dsc.set.apply(this, [url]);
      }
    });

    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
    window.HTMLMediaElement.prototype.setAttribute = function() {
      if (arguments.length === 2 &&
          ('' + arguments[0]).toLowerCase() === 'src') {
        this.srcObject = streams.get(arguments[1]) || null;
      }
      return nativeSetAttribute.apply(this, arguments);
    };
  }
};

// Export.
module.exports = {
  log: utils.log,
  deprecated: utils.deprecated,
  disableLog: utils.disableLog,
  disableWarnings: utils.disableWarnings,
  extractVersion: utils.extractVersion,
  shimCreateObjectURL: utils.shimCreateObjectURL,
  detectBrowser: utils.detectBrowser.bind(utils)
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
* Licensed under the Apache License, Version 2.0 (the ''License");
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

// dataObjectReporter.data = {
//    status : "connected",
//    owner : "hyperty://example.com/alicehy",
//    peer : "connection://example.com/alice/bob27012016",
//    ownerPeer : {
//          connectionDescription: {
//             sdp: 's4dfaf1sa3f1asd5f4sdafa',
//             type: 'offer'
//          },
//          iceCandidates: [{
//              type: 'candidate',
//              candidate: event.candidate.candidate,
//              sdpMid: event.candidate.sdpMid,
//              sdpMLineIndex: event.candidate.sdpMLineIndex
//            },
//            {
//              type: 'candidate',
//              candidate: event.candidate.candidate,
//              sdpMid: event.candidate.sdpMid,
//              sdpMLineIndex: event.candidate.sdpMLineIndex
//            },
//            .....
//        ]
//      }
//  }

var connection = exports.connection = {
  name: '',
  scheme: '',
  status: '',
  owner: '',
  connectionDescription: {},
  iceCandidates: []
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

/* jshint undef: true */

// Service Framework


// Utils


// Internals


exports.default = activate;

var _IdentityManager = __webpack_require__(3);

var _IdentityManager2 = _interopRequireDefault(_IdentityManager);

var _Discovery = __webpack_require__(4);

var _Discovery2 = _interopRequireDefault(_Discovery);

var _Syncher = __webpack_require__(5);

var _utils = __webpack_require__(6);

var _ConnectionController = __webpack_require__(7);

var _ConnectionController2 = _interopRequireDefault(_ConnectionController);

var _connection = __webpack_require__(1);

var _Search = __webpack_require__(20);

var _Search2 = _interopRequireDefault(_Search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */
var Connector = function () {

  /**
  * Create a new Hyperty Connector
  * @param  {Syncher} syncher - Syncher provided from the runtime core
  */
  function Connector(hypertyURL, bus, configuration) {
    var _this2 = this;

    _classCallCheck(this, Connector);

    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    var _this = this;
    _this._hypertyURL = hypertyURL;
    _this._bus = bus;
    _this._configuration = configuration;
    _this._domain = (0, _utils.divideURL)(hypertyURL).domain;

    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Connection';

    _this._controllers = {};
    _this.connectionObject = _connection.connection;

    var discovery = new _Discovery2.default(hypertyURL, configuration.runtimeURL, bus);
    var identityManager = new _IdentityManager2.default(hypertyURL, configuration.runtimeURL, bus);

    _this.discovery = discovery;
    _this.identityManager = identityManager;

    _this.search = new _Search2.default(discovery, identityManager);

    console.log('Discover: ', discovery);
    console.log('Identity Manager: ', identityManager);

    var syncher = new _Syncher.Syncher(hypertyURL, bus, configuration);

    syncher.onNotification(function (event) {

      var _this = _this2;

      console.log('On Notification: ', event);

      if (event.type === 'create') {
        console.info('------------ Acknowledges the Reporter - Create ------------ \n');
        event.ack(200);

        if (_this._controllers[event.from]) {
          _this._autoSubscribe(event);
        } else {

          _this._autoAccept(event);
        }

        console.info('------------------------ End Create ---------------------- \n');
      }

      if (event.type === 'delete') {
        console.info('------------ Acknowledges the Reporter - Delete ------------ \n');
        event.ack(200);

        console.log(_this._controllers);
        if (_this._controllers) {
          Object.keys(_this._controllers).forEach(function (controller) {
            _this._controllers[controller].deleteEvent = event;
            //delete _this._controllers[controller];

            console.log('Controllers:', _this._controllers);
          });
        }

        console.info('------------------------ End Create ---------------------- \n');
      }
    });

    _this._syncher = syncher;
  }

  // callback when connection Controllers are disconnected

  _createClass(Connector, [{
    key: '_removeController',
    value: function _removeController(controllers, controller) {
      var _this = this;

      if (controllers) {
        delete controllers[controller];

        console.log('[Connector] removed controller for ', controller);
      }
    }
  }, {
    key: '_autoSubscribe',
    value: function _autoSubscribe(event) {
      var _this = this;
      var syncher = _this._syncher;

      console.info('---------------- Syncher Subscribe (Auto Subscribe) ---------------- \n');
      console.info('Subscribe URL Object ', event);
      syncher.subscribe(_this._objectDescURL, event.url).then(function (dataObjectObserver) {
        console.info('1. Return Subscribe Data Object Observer', dataObjectObserver);
        _this._controllers[event.from].dataObjectObserver = dataObjectObserver;
      }).catch(function (reason) {
        console.error(reason);
      });
    }
  }, {
    key: '_autoAccept',
    value: function _autoAccept(event) {
      var _this = this;
      var syncher = _this._syncher;

      console.info('---------------- Syncher Subscribe (Auto Accept) ---------------- \n');
      console.info('Subscribe URL Object ', event);
      syncher.subscribe(_this._objectDescURL, event.url).then(function (dataObjectObserver) {
        console.info('1. Return Subscribe Data Object Observer', dataObjectObserver);

        var connectionController = new _ConnectionController2.default(syncher, _this._domain, _this._configuration, _this._removeController, _this, event.from);
        connectionController.connectionEvent = event;
        connectionController.dataObjectObserver = dataObjectObserver;

        if (Object.keys(_this._controllers).length > 0) {
          // check if there an ongoing call
          ongoingCall = true;
        }

        _this._controllers[event.from] = connectionController;

        var identity = event.identity;

        var ongoingCall = void 0;

        if (!identity) {
          identity = {};
          identity.userProfile = {
            avatar: "https://www.mybloggerguides.com/wp-content/uploads/2016/01/anonymous_avatar.png",
            cn: 'anonymous',
            userURL: 'anonymous',
            username: "anonymous"
          };
        }

        if (ongoingCall) {
          // ongoing call lets decline we busy
          connectionController.decline(486, 'Busy Here');
        } else if (_this._onInvitation) {
          // TODO: user object with {identity: event.identity, assertedIdentity: assertedIdentity}
          _this._onInvitation(connectionController, identity.userProfile);
        }

        console.info('------------------------ END ---------------------- \n');
      }).catch(function (reason) {
        console.error(reason);
      });
    }

    /**
     * This function is used to create a new connection providing the identifier of the user to be notified.
     * @param  {URL.UserURL}        userURL      user to be invited that is identified with reTHINK User URL.
     * @param  {MediaStream}        stream       WebRTC local MediaStream retrieved by the Application
     * @param  {string}             name         is a string to identify the connection.
     * @return {<Promise>ConnectionController}   A ConnectionController object as a Promise.
     */

  }, {
    key: 'connect',
    value: function connect(userURL, stream, name, domain) {
      // TODO: Pass argument options as a stream, because is specific of implementation;
      // TODO: CHange the hypertyURL for a list of URLS
      var _this = this;
      var syncher = _this._syncher;
      var scheme = ['connection'];
      var resource = ['audio', 'video'];

      console.log('connecting: ', userURL);

      return new Promise(function (resolve, reject) {

        var connectionController = void 0;
        var selectedHyperty = void 0;
        console.info('------------------------ Syncher Create ----------------------  \n');

        _this.search.myIdentity().then(function (identity) {

          console.log('connector searching: ', [userURL], 'at domain ', [domain]);
          console.log('identity: ', identity, _this.connectionObject);

          return _this.search.users([userURL], [domain], scheme, resource);
        }).then(function (hypertiesIDs) {

          // Only support one to one connection;*/
          selectedHyperty = hypertiesIDs[0].hypertyID;
          console.info('Only support communication one to one, selected hyperty: ', selectedHyperty);

          var connectionName = 'Connection';
          if (name) {
            connectionName = name;
          }

          // Initial data
          _this.connectionObject.name = connectionName;
          _this.connectionObject.scheme = 'connection';
          _this.connectionObject.owner = _this._hypertyURL;
          _this.connectionObject.peer = selectedHyperty;
          _this.connectionObject.status = '';

          return syncher.create(_this._objectDescURL, [selectedHyperty], _this.connectionObject, false, false, name, {}, { resources: ['audio', 'video'] });
        }).catch(function (reason) {
          console.error(reason);
          reject(reason);
        }).then(function (dataObjectReporter) {
          console.info('1. Return Create Data Object Reporter', dataObjectReporter);

          connectionController = new _ConnectionController2.default(syncher, _this._domain, _this._configuration, _this._removeController, _this, selectedHyperty);
          connectionController.mediaStream = stream;
          connectionController.dataObjectReporter = dataObjectReporter;

          _this._controllers[selectedHyperty] = connectionController;

          resolve(connectionController);
          console.info('--------------------------- END --------------------------- \n');
        }).catch(function (reason) {
          console.error(reason);
          reject(reason);
        });
      });
    }

    /**
     * This function is used to handle notifications about incoming requests to create a new connection.
     * @param  {Function} callback
     * @return {event}
     */

  }, {
    key: 'onInvitation',
    value: function onInvitation(callback) {
      var _this = this;
      _this._onInvitation = callback;
    }
  }]);

  return Connector;
}();

/**
 * Function will activate the hyperty on the runtime
 * @param  {URL.URL} hypertyURL   url which identifies the hyperty
 * @param  {MiniBus} bus          Minibus used to make the communication between hyperty and runtime;
 * @param  {object} configuration configuration
 */


function activate(hypertyURL, bus, configuration) {

  return {
    name: 'Connector',
    instance: new Connector(hypertyURL, bus, configuration)
  };
}
module.exports = exports['default'];

/***/ }),
/* 3 */
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


!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define("IdentityManager",[],e):"object"==typeof exports?exports.IdentityManager=e():(t[""]=t[""]||{},t[""].IdentityManager=e())}(this,function(){return function(t){function __webpack_require__(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}var e={};return __webpack_require__.m=t,__webpack_require__.c=e,__webpack_require__.i=function(t){return t},__webpack_require__.d=function(t,e,n){__webpack_require__.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},__webpack_require__.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=138)}([function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){t.exports=!n(11)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(30)("wks"),o=n(23),i=n(1).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},function(t,e,n){var r=n(5),o=n(25),i=n(21),u=Object.defineProperty;e.f=n(2)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(6);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var r=n(4),o=n(15);t.exports=n(2)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){var r=n(1),o=n(0),i=n(14),u=n(7),c=function(t,e,n){var a,s,f,l=t&c.F,p=t&c.G,d=t&c.S,v=t&c.P,_=t&c.B,h=t&c.W,y=p?o:o[e]||(o[e]={}),m=y.prototype,x=p?r:d?r[e]:(r[e]||{}).prototype;p&&(n=e);for(a in n)(s=!l&&x&&void 0!==x[a])&&a in y||(f=s?x[a]:n[a],y[a]=p&&"function"!=typeof x[a]?n[a]:_&&s?i(f,r):h&&x[a]==f?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(f):v&&"function"==typeof f?i(Function.call,f):f,v&&((y.virtual||(y.virtual={}))[a]=f,t&c.R&&m&&!m[a]&&u(m,a,f)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,e,n){"use strict";e.__esModule=!0;var r=n(33),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(t,e,n){return e&&defineProperties(t.prototype,e),n&&defineProperties(t,n),t}}()},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var r=n(56),o=n(24);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(19);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){t.exports={}},function(t,e,n){var r=n(6),o=n(1).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(44),o=n(29);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(6);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var r=n(4).f,o=n(12),i=n(3)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){t.exports=!n(2)&&!n(11)(function(){return 7!=Object.defineProperty(n(17)("div"),"a",{get:function(){return 7}}).a})},function(t,e){t.exports=!0},function(t,e,n){var r=n(30)("keys"),o=n(23);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(1),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},,function(t,e,n){var r=n(24);t.exports=function(t){return Object(r(t))}},function(t,e,n){t.exports={default:n(36),__esModule:!0}},,,function(t,e,n){n(38);var r=n(0).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(5),o=n(65),i=n(29),u=n(27)("IE_PROTO"),c=function(){},a=function(){var t,e=n(17)("iframe"),r=i.length;for(e.style.display="none",n(42).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;r--;)delete a.prototype[i[r]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(c.prototype=r(t),n=new c,c.prototype=null,n[u]=t):n=a(),void 0===e?n:o(n,e)}},function(t,e,n){var r=n(9);r(r.S+r.F*!n(2),"Object",{defineProperty:n(4).f})},function(t,e,n){"use strict";var r=n(26),o=n(9),i=n(46),u=n(7),c=n(12),a=n(16),s=n(63),f=n(22),l=n(43),p=n(3)("iterator"),d=!([].keys&&"next"in[].keys()),v=function(){return this};t.exports=function(t,e,n,_,h,y,m){s(n,e,_);var x,g,b,w=function(t){if(!d&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},O=e+" Iterator",j="values"==h,R=!1,P=t.prototype,M=P[p]||P["@@iterator"]||h&&P[h],U=M||w(h),k=h?j?w("entries"):U:void 0,A="Array"==e?P.entries||M:M;if(A&&(b=l(A.call(new t)))!==Object.prototype&&(f(b,O,!0),r||c(b,p)||u(b,p,v)),j&&M&&"values"!==M.name&&(R=!0,U=function(){return M.call(this)}),r&&!m||!d&&!R&&P[p]||u(P,p,U),a[e]=U,a[O]=v,h)if(x={values:j?U:w("values"),keys:y?U:w("keys"),entries:k},m)for(g in x)g in P||i(P,g,x[g]);else o(o.P+o.F*(d||R),e,x);return x}},function(t,e,n){t.exports={default:n(53),__esModule:!0}},,function(t,e,n){t.exports=n(1).document&&document.documentElement},function(t,e,n){var r=n(12),o=n(32),i=n(27)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){var r=n(12),o=n(13),i=n(62)(!1),u=n(27)("IE_PROTO");t.exports=function(t,e){var n,c=o(t),a=0,s=[];for(n in c)n!=u&&r(c,n)&&s.push(n);for(;e.length>a;)r(c,n=e[a++])&&(~i(s,n)||s.push(n));return s}},function(t,e,n){var r=n(9),o=n(0),i=n(11);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},function(t,e,n){t.exports=n(7)},function(t,e,n){var r=n(28),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},,,function(t,e,n){"use strict";var r=n(67)(!0);n(39)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){n(70);for(var r=n(1),o=n(7),i=n(16),u=n(3)("toStringTag"),c=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],a=0;a<5;a++){var s=c[a],f=r[s],l=f&&f.prototype;l&&!l[u]&&o(l,u,s),i[s]=i.Array}},,function(t,e,n){var r=n(0),o=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e){},function(t,e,n){var r=n(20),o=n(3)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(c=r(e))&&"function"==typeof e.callee?"Arguments":c}},function(t,e,n){var r=n(20);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},,,function(t,e,n){t.exports={default:n(81),__esModule:!0}},,function(t,e){t.exports=function(){}},function(t,e,n){var r=n(13),o=n(47),i=n(69);t.exports=function(t){return function(e,n,u){var c,a=r(e),s=o(a.length),f=i(u,s);if(t&&n!=n){for(;s>f;)if((c=a[f++])!=c)return!0}else for(;s>f;f++)if((t||f in a)&&a[f]===n)return t||f||0;return!t&&-1}}},function(t,e,n){"use strict";var r=n(37),o=n(15),i=n(22),u={};n(7)(u,n(3)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var r=n(4),o=n(5),i=n(18);t.exports=n(2)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),c=u.length,a=0;c>a;)r.f(t,n=u[a++],e[n]);return t}},,function(t,e,n){var r=n(28),o=n(24);t.exports=function(t){return function(e,n){var i,u,c=String(o(e)),a=r(n),s=c.length;return a<0||a>=s?t?"":void 0:(i=c.charCodeAt(a),i<55296||i>56319||a+1===s||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536)}}},function(t,e,n){var r,o,i,u=n(14),c=n(89),a=n(42),s=n(17),f=n(1),l=f.process,p=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,_=0,h={},y=function(){var t=+this;if(h.hasOwnProperty(t)){var e=h[t];delete h[t],e()}},m=function(t){y.call(t.data)};p&&d||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return h[++_]=function(){c("function"==typeof t?t:Function(t),e)},r(_),_},d=function(t){delete h[t]},"process"==n(20)(l)?r=function(t){l.nextTick(u(y,t,1))}:v?(o=new v,i=o.port2,o.port1.onmessage=m,r=u(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",m,!1)):r="onreadystatechange"in s("script")?function(t){a.appendChild(s("script")).onreadystatechange=function(){a.removeChild(this),y.call(t)}}:function(t){setTimeout(u(y,t,1),0)}),t.exports={set:p,clear:d}},function(t,e,n){var r=n(28),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},function(t,e,n){"use strict";var r=n(61),o=n(64),i=n(16),u=n(13);t.exports=n(39)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function divideURL(t){function recurse(t){var e=/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;return t.replace(e,"$1,$3,$4").split(",")}if(!t)throw Error("URL is needed to split");var e=recurse(t);if(e[0]===t&&!e[0].includes("@")){var n={type:"",domain:t,identity:""};return console.error("[DivideURL] DivideURL don't support url without scheme. Please review your url address",t),n}if(e[0]===t&&e[0].includes("@")){e=recurse((e[0]===t?"smtp":e[0])+"://"+e[0])}return e[1].includes("@")&&(e[2]=e[0]+"://"+e[1],e[1]=e[1].substr(e[1].indexOf("@")+1)),{type:e[0],domain:e[1],identity:e[2]}}function divideEmail(t){var e=t.indexOf("@");return{username:t.substring(0,e),domain:t.substring(e+1,t.length)}}function emptyObject(t){return!((0,u.default)(t).length>0)}function deepClone(t){if(t)return JSON.parse((0,o.default)(t))}function getUserURLFromEmail(t){var e=t.indexOf("@");return"user://"+t.substring(e+1,t.length)+"/"+t.substring(0,e)}function getUserEmailFromURL(t){var e=divideURL(t);return e.identity.replace("/","")+"@"+e.domain}function convertToUserURL(t){if("user://"===t.substring(0,7)){var e=divideURL(t);if(e.domain&&e.identity)return t;throw"userURL with wrong format"}return getUserURLFromEmail(t)}function checkAttribute(t){var e=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,n=[],r=[];if(null==t.match(e))r=t.split(".");else{for(var o=void 0;null!==(o=e.exec(t));)o.index===e.lastIndex&&e.lastIndex++,o.forEach(function(t,e){0===e&&n.push(t)});var i=void 0;n.forEach(function(e){i=t.replace(e,"*+*"),r=i.split(".").map(function(t){return"*+*"===t?e:t})})}return console.log("[ServiceFramework.Utils.checkAttribute]",r),r}function parseAttributes(t){var e=/([0-9a-zA-Z][-\w]*):\/\//g;if(t.includes("://")){var n=t.split(e)[0],r=n.split("."),o=t.replace(n,"");if(t.includes("identity")){var i=o.split("identity.");console.log("array2 "+i),o=i[0].slice(".",-1),i=i[1].split("."),r.push(o,"identity"),r=r.concat(i)}else r.push(o);return r.filter(Boolean)}return t.split(".")}Object.defineProperty(e,"__esModule",{value:!0});var r=n(40),o=_interopRequireDefault(r),i=n(59),u=_interopRequireDefault(i);e.divideURL=divideURL,e.divideEmail=divideEmail,e.emptyObject=emptyObject,e.deepClone=deepClone,e.getUserURLFromEmail=getUserURLFromEmail,e.getUserEmailFromURL=getUserEmailFromURL,e.convertToUserURL=convertToUserURL,e.checkAttribute=checkAttribute,e.parseAttributes=parseAttributes},function(t,e,n){t.exports={default:n(83),__esModule:!0}},,function(t,e,n){var r=n(55),o=n(3)("iterator"),i=n(16);t.exports=n(0).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},,,,,,,function(t,e,n){n(103),t.exports=n(0).Object.keys},,function(t,e,n){n(54),n(50),n(51),n(105),t.exports=n(0).Promise},,,function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},,function(t,e,n){var r=n(14),o=n(92),i=n(90),u=n(5),c=n(47),a=n(74),s={},f={},e=t.exports=function(t,e,n,l,p){var d,v,_,h,y=p?function(){return t}:a(t),m=r(n,l,e?2:1),x=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(i(y)){for(d=c(t.length);d>x;x++)if((h=e?m(u(v=t[x])[0],v[1]):m(t[x]))===s||h===f)return h}else for(_=y.call(t);!(v=_.next()).done;)if((h=o(_,m,v.value,e))===s||h===f)return h};e.BREAK=s,e.RETURN=f},function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var r=n(16),o=n(3)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},,function(t,e,n){var r=n(5);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},function(t,e,n){var r=n(3)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},,function(t,e,n){var r=n(1),o=n(68).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,c=r.Promise,a="process"==n(20)(u);t.exports=function(){var t,e,n,s=function(){var r,o;for(a&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};if(a)n=function(){u.nextTick(s)};else if(i){var f=!0,l=document.createTextNode("");new i(s).observe(l,{characterData:!0}),n=function(){l.data=f=!f}}else if(c&&c.resolve){var p=c.resolve();n=function(){p.then(s)}}else n=function(){o.call(r,s)};return function(r){var o={fn:r,next:void 0};e&&(e.next=o),t||(t=o,n()),e=o}}},,function(t,e,n){var r=n(7);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},,function(t,e,n){"use strict";var r=n(1),o=n(0),i=n(4),u=n(2),c=n(3)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[c]&&i.f(e,c,{configurable:!0,get:function(){return this}})}},function(t,e,n){var r=n(5),o=n(19),i=n(3)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||void 0==(n=r(u)[i])?e:o(n)}},,,function(t,e,n){var r=n(32),o=n(18);n(45)("keys",function(){return function(t){return o(r(t))}})},,function(t,e,n){"use strict";var r,o,i,u=n(26),c=n(1),a=n(14),s=n(55),f=n(9),l=n(6),p=n(19),d=n(86),v=n(88),_=n(100),h=n(68).set,y=n(95)(),m=c.TypeError,x=c.process,g=c.Promise,x=c.process,b="process"==s(x),w=function(){},O=!!function(){try{var t=g.resolve(1),e=(t.constructor={})[n(3)("species")]=function(t){t(w,w)};return(b||"function"==typeof PromiseRejectionEvent)&&t.then(w)instanceof e}catch(t){}}(),j=function(t,e){return t===e||t===g&&e===i},R=function(t){var e;return!(!l(t)||"function"!=typeof(e=t.then))&&e},P=function(t){return j(g,t)?new M(t):new o(t)},M=o=function(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw m("Bad Promise constructor");e=t,n=r}),this.resolve=p(e),this.reject=p(n)},U=function(t){try{t()}catch(t){return{error:t}}},k=function(t,e){if(!t._n){t._n=!0;var n=t._c;y(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u=o?e.ok:e.fail,c=e.resolve,a=e.reject,s=e.domain;try{u?(o||(2==t._h&&S(t),t._h=1),!0===u?n=r:(s&&s.enter(),n=u(r),s&&s.exit()),n===e.promise?a(m("Promise-chain cycle")):(i=R(n))?i.call(n,c,a):c(n)):a(r)}catch(t){a(t)}}(n[i++]);t._c=[],t._n=!1,e&&!t._h&&A(t)})}},A=function(t){h.call(c,function(){var e,n,r,o=t._v;if(E(t)&&(e=U(function(){b?x.emit("unhandledRejection",o,t):(n=c.onunhandledrejection)?n({promise:t,reason:o}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",o)}),t._h=b||E(t)?2:1),t._a=void 0,e)throw e.error})},E=function(t){if(1==t._h)return!1;for(var e,n=t._a||t._c,r=0;n.length>r;)if(e=n[r++],e.fail||!E(e.promise))return!1;return!0},S=function(t){h.call(c,function(){var e;b?x.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})})},L=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),k(e,!0))},T=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw m("Promise can't be resolved itself");(e=R(t))?y(function(){var r={_w:n,_d:!1};try{e.call(t,a(T,r,1),a(L,r,1))}catch(t){L.call(r,t)}}):(n._v=t,n._s=1,k(n,!1))}catch(t){L.call({_w:n,_d:!1},t)}}};O||(g=function(t){d(this,g,"Promise","_h"),p(t),r.call(this);try{t(a(T,this,1),a(L,this,1))}catch(t){L.call(this,t)}},r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=n(97)(g.prototype,{then:function(t,e){var n=P(_(this,g));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=b?x.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&k(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),M=function(){var t=new r;this.promise=t,this.resolve=a(T,t,1),this.reject=a(L,t,1)}),f(f.G+f.W+f.F*!O,{Promise:g}),n(22)(g,"Promise"),n(99)("Promise"),i=n(0).Promise,f(f.S+f.F*!O,"Promise",{reject:function(t){var e=P(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(u||!O),"Promise",{resolve:function(t){if(t instanceof g&&j(t.constructor,this))return t;var e=P(this);return(0,e.resolve)(t),e.promise}}),f(f.S+f.F*!(O&&n(93)(function(t){g.all(t).catch(w)})),"Promise",{all:function(t){var e=this,n=P(e),r=n.resolve,o=n.reject,i=U(function(){var n=[],i=0,u=1;v(t,!1,function(t){var c=i++,a=!1;n.push(void 0),u++,e.resolve(t).then(function(t){a||(a=!0,n[c]=t,--u||r(n))},o)}),--u||r(n)});return i&&o(i.error),n.promise},race:function(t){var e=this,n=P(e),r=n.reject,o=U(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o&&r(o.error),n.promise}})},,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(72),o=_interopRequireDefault(r),i=n(8),u=_interopRequireDefault(i),c=n(10),a=_interopRequireDefault(c),s=n(71),f=function(){function IdentityManager(t,e,n){(0,u.default)(this,IdentityManager);var r=this;r.messageBus=n,r.domain=(0,s.divideURL)(t).domain,r.hypertyURL=t,r.runtimeURL=e}return(0,a.default)(IdentityManager,[{key:"discoverUserRegistered",value:function(t,e){var n=this,r=void 0,i=t||".";r=e||n.hypertyURL;var u={type:"read",from:r,to:n.runtimeURL+"/registry/",body:{resource:i,criteria:r}};return new o.default(function(t,e){n.messageBus.postMessage(u,function(n){var r=n.body.resource;r&&200===n.body.code?t(r):e("code: "+n.body.code+" No user was found")})})}}]),IdentityManager}();e.default=f,t.exports=e.default},,,,,,,,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(129),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=o.default,t.exports=e.default}])});

/***/ }),
/* 4 */
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


!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define("Discovery",[],t):"object"==typeof exports?exports.Discovery=t():(e[""]=e[""]||{},e[""].Discovery=t())}(this,function(){return function(e){function __webpack_require__(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}var t={};return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.i=function(e){return e},__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=136)}([function(e,t){var r=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},function(e,t){var r=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(e,t,r){e.exports=!r(11)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,r){var n=r(30)("wks"),o=r(23),i=r(1).Symbol,s="function"==typeof i;(e.exports=function(e){return n[e]||(n[e]=s&&i[e]||(s?i:o)("Symbol."+e))}).store=n},function(e,t,r){var n=r(5),o=r(25),i=r(21),s=Object.defineProperty;t.f=r(2)?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return s(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},function(e,t,r){var n=r(6);e.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t,r){var n=r(4),o=r(15);e.exports=r(2)?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},function(e,t,r){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t,r){var n=r(1),o=r(0),i=r(14),s=r(7),c=function(e,t,r){var u,a,f,d=e&c.F,l=e&c.G,v=e&c.S,y=e&c.P,p=e&c.B,b=e&c.W,h=l?o:o[t]||(o[t]={}),_=h.prototype,m=l?n:v?n[t]:(n[t]||{}).prototype;l&&(r=t);for(u in r)(a=!d&&m&&void 0!==m[u])&&u in h||(f=a?m[u]:r[u],h[u]=l&&"function"!=typeof m[u]?r[u]:p&&a?i(f,n):b&&m[u]==f?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):y&&"function"==typeof f?i(Function.call,f):f,y&&((h.virtual||(h.virtual={}))[u]=f,e&c.R&&_&&!_[u]&&s(_,u,f)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,e.exports=c},function(e,t,r){"use strict";t.__esModule=!0;var n=r(33),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,o.default)(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}()},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var r={}.hasOwnProperty;e.exports=function(e,t){return r.call(e,t)}},function(e,t,r){var n=r(56),o=r(24);e.exports=function(e){return n(o(e))}},function(e,t,r){var n=r(19);e.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t){e.exports={}},function(e,t,r){var n=r(6),o=r(1).document,i=n(o)&&n(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},function(e,t,r){var n=r(44),o=r(29);e.exports=Object.keys||function(e){return n(e,o)}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t){var r={}.toString;e.exports=function(e){return r.call(e).slice(8,-1)}},function(e,t,r){var n=r(6);e.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},function(e,t,r){var n=r(4).f,o=r(12),i=r(3)("toStringTag");e.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},function(e,t){var r=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++r+n).toString(36))}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t,r){e.exports=!r(2)&&!r(11)(function(){return 7!=Object.defineProperty(r(17)("div"),"a",{get:function(){return 7}}).a})},function(e,t){e.exports=!0},function(e,t,r){var n=r(30)("keys"),o=r(23);e.exports=function(e){return n[e]||(n[e]=o(e))}},function(e,t){var r=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:r)(e)}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,t,r){var n=r(1),o=n["__core-js_shared__"]||(n["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},,function(e,t,r){var n=r(24);e.exports=function(e){return Object(n(e))}},function(e,t,r){e.exports={default:r(36),__esModule:!0}},,,function(e,t,r){r(38);var n=r(0).Object;e.exports=function(e,t,r){return n.defineProperty(e,t,r)}},function(e,t,r){var n=r(5),o=r(65),i=r(29),s=r(27)("IE_PROTO"),c=function(){},u=function(){var e,t=r(17)("iframe"),n=i.length;for(t.style.display="none",r(42).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),u=e.F;n--;)delete u.prototype[i[n]];return u()};e.exports=Object.create||function(e,t){var r;return null!==e?(c.prototype=n(e),r=new c,c.prototype=null,r[s]=e):r=u(),void 0===t?r:o(r,t)}},function(e,t,r){var n=r(9);n(n.S+n.F*!r(2),"Object",{defineProperty:r(4).f})},function(e,t,r){"use strict";var n=r(26),o=r(9),i=r(46),s=r(7),c=r(12),u=r(16),a=r(63),f=r(22),d=r(43),l=r(3)("iterator"),v=!([].keys&&"next"in[].keys()),y=function(){return this};e.exports=function(e,t,r,p,b,h,_){a(r,t,p);var m,g,O,U=function(e){if(!v&&e in w)return w[e];switch(e){case"keys":case"values":return function(){return new r(this,e)}}return function(){return new r(this,e)}},R=t+" Iterator",D="values"==b,L=!1,w=e.prototype,j=w[l]||w["@@iterator"]||b&&w[b],x=j||U(b),P=b?D?U("entries"):x:void 0,k="Array"==t?w.entries||j:j;if(k&&(O=d(k.call(new e)))!==Object.prototype&&(f(O,R,!0),n||c(O,l)||s(O,l,y)),D&&j&&"values"!==j.name&&(L=!0,x=function(){return j.call(this)}),n&&!_||!v&&!L&&w[l]||s(w,l,x),u[t]=x,u[R]=y,b)if(m={values:D?x:U("values"),keys:h?x:U("keys"),entries:P},_)for(g in m)g in w||i(w,g,m[g]);else o(o.P+o.F*(v||L),t,m);return m}},function(e,t,r){e.exports={default:r(53),__esModule:!0}},,function(e,t,r){e.exports=r(1).document&&document.documentElement},function(e,t,r){var n=r(12),o=r(32),i=r(27)("IE_PROTO"),s=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},function(e,t,r){var n=r(12),o=r(13),i=r(62)(!1),s=r(27)("IE_PROTO");e.exports=function(e,t){var r,c=o(e),u=0,a=[];for(r in c)r!=s&&n(c,r)&&a.push(r);for(;t.length>u;)n(c,r=t[u++])&&(~i(a,r)||a.push(r));return a}},function(e,t,r){var n=r(9),o=r(0),i=r(11);e.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],s={};s[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",s)}},function(e,t,r){e.exports=r(7)},function(e,t,r){var n=r(28),o=Math.min;e.exports=function(e){return e>0?o(n(e),9007199254740991):0}},,,function(e,t,r){"use strict";var n=r(67)(!0);r(39)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},function(e,t,r){r(70);for(var n=r(1),o=r(7),i=r(16),s=r(3)("toStringTag"),c=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],u=0;u<5;u++){var a=c[u],f=n[a],d=f&&f.prototype;d&&!d[s]&&o(d,s,a),i[a]=i.Array}},,function(e,t,r){var n=r(0),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){return o.stringify.apply(o,arguments)}},function(e,t){},function(e,t,r){var n=r(20),o=r(3)("toStringTag"),i="Arguments"==n(function(){return arguments}()),s=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,r,c;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=s(t=Object(e),o))?r:i?n(t):"Object"==(c=n(t))&&"function"==typeof t.callee?"Arguments":c}},function(e,t,r){var n=r(20);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},,,function(e,t,r){e.exports={default:r(81),__esModule:!0}},,function(e,t){e.exports=function(){}},function(e,t,r){var n=r(13),o=r(47),i=r(69);e.exports=function(e){return function(t,r,s){var c,u=n(t),a=o(u.length),f=i(s,a);if(e&&r!=r){for(;a>f;)if((c=u[f++])!=c)return!0}else for(;a>f;f++)if((e||f in u)&&u[f]===r)return e||f||0;return!e&&-1}}},function(e,t,r){"use strict";var n=r(37),o=r(15),i=r(22),s={};r(7)(s,r(3)("iterator"),function(){return this}),e.exports=function(e,t,r){e.prototype=n(s,{next:o(1,r)}),i(e,t+" Iterator")}},function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},function(e,t,r){var n=r(4),o=r(5),i=r(18);e.exports=r(2)?Object.defineProperties:function(e,t){o(e);for(var r,s=i(t),c=s.length,u=0;c>u;)n.f(e,r=s[u++],t[r]);return e}},,function(e,t,r){var n=r(28),o=r(24);e.exports=function(e){return function(t,r){var i,s,c=String(o(t)),u=n(r),a=c.length;return u<0||u>=a?e?"":void 0:(i=c.charCodeAt(u),i<55296||i>56319||u+1===a||(s=c.charCodeAt(u+1))<56320||s>57343?e?c.charAt(u):i:e?c.slice(u,u+2):s-56320+(i-55296<<10)+65536)}}},function(e,t,r){var n,o,i,s=r(14),c=r(89),u=r(42),a=r(17),f=r(1),d=f.process,l=f.setImmediate,v=f.clearImmediate,y=f.MessageChannel,p=0,b={},h=function(){var e=+this;if(b.hasOwnProperty(e)){var t=b[e];delete b[e],t()}},_=function(e){h.call(e.data)};l&&v||(l=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return b[++p]=function(){c("function"==typeof e?e:Function(e),t)},n(p),p},v=function(e){delete b[e]},"process"==r(20)(d)?n=function(e){d.nextTick(s(h,e,1))}:y?(o=new y,i=o.port2,o.port1.onmessage=_,n=s(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",_,!1)):n="onreadystatechange"in a("script")?function(e){u.appendChild(a("script")).onreadystatechange=function(){u.removeChild(this),h.call(e)}}:function(e){setTimeout(s(h,e,1),0)}),e.exports={set:l,clear:v}},function(e,t,r){var n=r(28),o=Math.max,i=Math.min;e.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},function(e,t,r){"use strict";var n=r(61),o=r(64),i=r(16),s=r(13);e.exports=r(39)(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function divideURL(e){function recurse(e){var t=/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;return e.replace(t,"$1,$3,$4").split(",")}if(!e)throw Error("URL is needed to split");var t=recurse(e);if(t[0]===e&&!t[0].includes("@")){var r={type:"",domain:e,identity:""};return console.error("[DivideURL] DivideURL don't support url without scheme. Please review your url address",e),r}if(t[0]===e&&t[0].includes("@")){t=recurse((t[0]===e?"smtp":t[0])+"://"+t[0])}return t[1].includes("@")&&(t[2]=t[0]+"://"+t[1],t[1]=t[1].substr(t[1].indexOf("@")+1)),{type:t[0],domain:t[1],identity:t[2]}}function divideEmail(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function emptyObject(e){return!((0,s.default)(e).length>0)}function deepClone(e){if(e)return JSON.parse((0,o.default)(e))}function getUserURLFromEmail(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function getUserEmailFromURL(e){var t=divideURL(e);return t.identity.replace("/","")+"@"+t.domain}function convertToUserURL(e){if("user://"===e.substring(0,7)){var t=divideURL(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return getUserURLFromEmail(e)}function checkAttribute(e){var t=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,r=[],n=[];if(null==e.match(t))n=e.split(".");else{for(var o=void 0;null!==(o=t.exec(e));)o.index===t.lastIndex&&t.lastIndex++,o.forEach(function(e,t){0===t&&r.push(e)});var i=void 0;r.forEach(function(t){i=e.replace(t,"*+*"),n=i.split(".").map(function(e){return"*+*"===e?t:e})})}return console.log("[ServiceFramework.Utils.checkAttribute]",n),n}function parseAttributes(e){var t=/([0-9a-zA-Z][-\w]*):\/\//g;if(e.includes("://")){var r=e.split(t)[0],n=r.split("."),o=e.replace(r,"");if(e.includes("identity")){var i=o.split("identity.");console.log("array2 "+i),o=i[0].slice(".",-1),i=i[1].split("."),n.push(o,"identity"),n=n.concat(i)}else n.push(o);return n.filter(Boolean)}return e.split(".")}Object.defineProperty(t,"__esModule",{value:!0});var n=r(40),o=_interopRequireDefault(n),i=r(59),s=_interopRequireDefault(i);t.divideURL=divideURL,t.divideEmail=divideEmail,t.emptyObject=emptyObject,t.deepClone=deepClone,t.getUserURLFromEmail=getUserURLFromEmail,t.getUserEmailFromURL=getUserEmailFromURL,t.convertToUserURL=convertToUserURL,t.checkAttribute=checkAttribute,t.parseAttributes=parseAttributes},function(e,t,r){e.exports={default:r(83),__esModule:!0}},,function(e,t,r){var n=r(55),o=r(3)("iterator"),i=r(16);e.exports=r(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},,,,,,,function(e,t,r){r(103),e.exports=r(0).Object.keys},,function(e,t,r){r(54),r(50),r(51),r(105),e.exports=r(0).Promise},,,function(e,t){e.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},,function(e,t,r){var n=r(14),o=r(92),i=r(90),s=r(5),c=r(47),u=r(74),a={},f={},t=e.exports=function(e,t,r,d,l){var v,y,p,b,h=l?function(){return e}:u(e),_=n(r,d,t?2:1),m=0;if("function"!=typeof h)throw TypeError(e+" is not iterable!");if(i(h)){for(v=c(e.length);v>m;m++)if((b=t?_(s(y=e[m])[0],y[1]):_(e[m]))===a||b===f)return b}else for(p=h.call(e);!(y=p.next()).done;)if((b=o(p,_,y.value,t))===a||b===f)return b};t.BREAK=a,t.RETURN=f},function(e,t){e.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},function(e,t,r){var n=r(16),o=r(3)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},,function(e,t,r){var n=r(5);e.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(t){var i=e.return;throw void 0!==i&&n(i.call(e)),t}}},function(e,t,r){var n=r(3)("iterator"),o=!1;try{var i=[7][n]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],s=i[n]();s.next=function(){return{done:r=!0}},i[n]=function(){return s},e(i)}catch(e){}return r}},,function(e,t,r){var n=r(1),o=r(68).set,i=n.MutationObserver||n.WebKitMutationObserver,s=n.process,c=n.Promise,u="process"==r(20)(s);e.exports=function(){var e,t,r,a=function(){var n,o;for(u&&(n=s.domain)&&n.exit();e;){o=e.fn,e=e.next;try{o()}catch(n){throw e?r():t=void 0,n}}t=void 0,n&&n.enter()};if(u)r=function(){s.nextTick(a)};else if(i){var f=!0,d=document.createTextNode("");new i(a).observe(d,{characterData:!0}),r=function(){d.data=f=!f}}else if(c&&c.resolve){var l=c.resolve();r=function(){l.then(a)}}else r=function(){o.call(n,a)};return function(n){var o={fn:n,next:void 0};t&&(t.next=o),e||(e=o,r()),t=o}}},,function(e,t,r){var n=r(7);e.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},,function(e,t,r){"use strict";var n=r(1),o=r(0),i=r(4),s=r(2),c=r(3)("species");e.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];s&&t&&!t[c]&&i.f(t,c,{configurable:!0,get:function(){return this}})}},function(e,t,r){var n=r(5),o=r(19),i=r(3)("species");e.exports=function(e,t){var r,s=n(e).constructor;return void 0===s||void 0==(r=n(s)[i])?t:o(r)}},,,function(e,t,r){var n=r(32),o=r(18);r(45)("keys",function(){return function(e){return o(n(e))}})},,function(e,t,r){"use strict";var n,o,i,s=r(26),c=r(1),u=r(14),a=r(55),f=r(9),d=r(6),l=r(19),v=r(86),y=r(88),p=r(100),b=r(68).set,h=r(95)(),_=c.TypeError,m=c.process,g=c.Promise,m=c.process,O="process"==a(m),U=function(){},R=!!function(){try{var e=g.resolve(1),t=(e.constructor={})[r(3)("species")]=function(e){e(U,U)};return(O||"function"==typeof PromiseRejectionEvent)&&e.then(U)instanceof t}catch(e){}}(),D=function(e,t){return e===t||e===g&&t===i},L=function(e){var t;return!(!d(e)||"function"!=typeof(t=e.then))&&t},w=function(e){return D(g,e)?new j(e):new o(e)},j=o=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw _("Bad Promise constructor");t=e,r=n}),this.resolve=l(t),this.reject=l(r)},x=function(e){try{e()}catch(e){return{error:e}}},P=function(e,t){if(!e._n){e._n=!0;var r=e._c;h(function(){for(var n=e._v,o=1==e._s,i=0;r.length>i;)!function(t){var r,i,s=o?t.ok:t.fail,c=t.resolve,u=t.reject,a=t.domain;try{s?(o||(2==e._h&&E(e),e._h=1),!0===s?r=n:(a&&a.enter(),r=s(n),a&&a.exit()),r===t.promise?u(_("Promise-chain cycle")):(i=L(r))?i.call(r,c,u):c(r)):u(n)}catch(e){u(e)}}(r[i++]);e._c=[],e._n=!1,t&&!e._h&&k(e)})}},k=function(e){b.call(c,function(){var t,r,n,o=e._v;if(M(e)&&(t=x(function(){O?m.emit("unhandledRejection",o,e):(r=c.onunhandledrejection)?r({promise:e,reason:o}):(n=c.console)&&n.error&&n.error("Unhandled promise rejection",o)}),e._h=O||M(e)?2:1),e._a=void 0,t)throw t.error})},M=function(e){if(1==e._h)return!1;for(var t,r=e._a||e._c,n=0;r.length>n;)if(t=r[n++],t.fail||!M(t.promise))return!1;return!0},E=function(e){b.call(c,function(){var t;O?m.emit("rejectionHandled",e):(t=c.onrejectionhandled)&&t({promise:e,reason:e._v})})},S=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,t._v=e,t._s=2,t._a||(t._a=t._c.slice()),P(t,!0))},A=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;try{if(r===e)throw _("Promise can't be resolved itself");(t=L(e))?h(function(){var n={_w:r,_d:!1};try{t.call(e,u(A,n,1),u(S,n,1))}catch(e){S.call(n,e)}}):(r._v=e,r._s=1,P(r,!1))}catch(e){S.call({_w:r,_d:!1},e)}}};R||(g=function(e){v(this,g,"Promise","_h"),l(e),n.call(this);try{e(u(A,this,1),u(S,this,1))}catch(e){S.call(this,e)}},n=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},n.prototype=r(97)(g.prototype,{then:function(e,t){var r=w(p(this,g));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=O?m.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&P(this,!1),r.promise},catch:function(e){return this.then(void 0,e)}}),j=function(){var e=new n;this.promise=e,this.resolve=u(A,e,1),this.reject=u(S,e,1)}),f(f.G+f.W+f.F*!R,{Promise:g}),r(22)(g,"Promise"),r(99)("Promise"),i=r(0).Promise,f(f.S+f.F*!R,"Promise",{reject:function(e){var t=w(this);return(0,t.reject)(e),t.promise}}),f(f.S+f.F*(s||!R),"Promise",{resolve:function(e){if(e instanceof g&&D(e.constructor,this))return e;var t=w(this);return(0,t.resolve)(e),t.promise}}),f(f.S+f.F*!(R&&r(93)(function(e){g.all(e).catch(U)})),"Promise",{all:function(e){var t=this,r=w(t),n=r.resolve,o=r.reject,i=x(function(){var r=[],i=0,s=1;y(e,!1,function(e){var c=i++,u=!1;r.push(void 0),s++,t.resolve(e).then(function(e){u||(u=!0,r[c]=e,--s||n(r))},o)}),--s||n(r)});return i&&o(i.error),r.promise},race:function(e){var t=this,r=w(t),n=r.reject,o=x(function(){y(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o&&n(o.error),r.promise}})},,,,,,,,,,,,,,,,,,,,,,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(72),o=_interopRequireDefault(n),i=r(8),s=_interopRequireDefault(i),c=r(10),u=_interopRequireDefault(c),a=r(71),f=r(144),d=_interopRequireDefault(f),l=function(){function Discovery(e,t,r){(0,s.default)(this,Discovery);var n=this;n.messageBus=r,n.runtimeURL=t,n.domain=(0,a.divideURL)(e).domain,n.discoveryURL=e}return(0,u.default)(Discovery,[{key:"_isLegacyUser",value:function(e){return!(!e.includes(":")||e.includes("user://"))}},{key:"discoverHypertiesPerUserProfileData",value:function(e,t,r){var n=this,i=[],s={type:"read",from:n.discoveryURL,to:n.runtimeURL+"/discovery/",body:{resource:"/hyperty/userprofile/"+e}};return(t||r)&&(s.body.criteria={resources:r,dataSchemes:t}),new o.default(function(t,r){n._isLegacyUser(e)?t({hypertyID:e}):n.messageBus.postMessage(s,function(e){200===e.body.code?(e.body.value.map(function(e){e.hypertyID!=n.discoveryURL&&i.push(e)}),0===i.length?r("No Hyperty was found"):(console.log("Reply log: ",i),t(i))):(console.log("Error Log: ",e.body.description),r(e.body.description))})})}},{key:"discoverHypertiesPerUserProfileDataDO",value:function(e,t,r){var n=this,i=arguments;return new o.default(function(e,t){n.discoverHypertiesPerUserProfileData.apply(n,i).then(function(t){e(n._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjectsPerUserProfileData",value:function(e,t,r){var n=this,i={type:"read",from:n.discoveryURL,to:n.runtimeURL+"/discovery/",body:{resource:"/dataObject/userprofile/"+e}};return(t||r)&&(i.body.criteria={resources:r,dataSchemes:t}),new o.default(function(t,r){n._isLegacyUser(e)?t({hypertyID:e}):n.messageBus.postMessage(i,function(e){200===e.body.code?(console.log("Reply log: ",e.body.value),t(e.body.value)):(console.log("Error Log: ",e.body.description),r(e.body.description))})})}},{key:"discoverDataObjectsPerUserProfileDataDO",value:function(e,t,r){var n=this,i=arguments;return new o.default(function(e,t){n.discoverDataObjectsPerUserProfileData.apply(n,i).then(function(t){return e(n._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverHypertiesPerGUID",value:function(e,t,r){var n=this,i=[],s={type:"read",from:n.discoveryURL,to:n.runtimeURL+"/discovery/",body:{resource:"/hyperty/guid/"+e}};return(t||r)&&(s.body.criteria={resources:r,dataSchemes:t}),new o.default(function(e,t){n.messageBus.postMessage(s,function(r){200===r.body.code?(r.body.value.map(function(e){e.hypertyID!=n.discoveryURL&&i.push(e)}),0===i.length?t("No Hyperty was found"):(console.log("Reply log: ",i),e(i))):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverHypertiesPerGUIDDO",value:function(e,t,r){var n=this,i=arguments;return new o.default(function(e,t){n.discoverHypertiesPerGUID.apply(n,i).then(function(t){e(n._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjectsPerGUID",value:function(e,t,r){var n=this,i={type:"read",from:n.discoveryURL,to:n.runtimeURL+"/discovery/",body:{resource:"/dataObject/guid/"+e}};return(t||r)&&(i.body.criteria={resources:r,dataSchemes:t}),new o.default(function(e,t){n.messageBus.postMessage(i,function(r){200===r.body.code?(console.log("Reply log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverDataObjectsPerGUIDDO",value:function(e,t,r){var n=this,i=arguments;return new o.default(function(e,t){n.discoverDataObjectsPerGUID.apply(n,i).then(function(t){return e(n._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverHyperties",value:function(e,t,r,n){var i=this,s=void 0,c=[];s=n||i.domain;var u={type:"read",from:i.discoveryURL,to:i.runtimeURL+"/discovery/",body:{resource:"/hyperty/user/"+e}};return u.body.criteria=t||r?{resources:r,dataSchemes:t,domain:s}:{domain:s},new o.default(function(t,r){i._isLegacyUser(e)?t({hypertyID:e}):i.messageBus.postMessage(u,function(e){200===e.body.code||500===e.body.code?(e.body.value.map(function(e){e.hypertyID!=i.discoveryURL&&c.push(e)}),0===c.length?r("No Hyperty was found"):(console.log("Reply log: ",c),t(c))):(console.log("Error Log: ",e.body.description),r(e.body.description))})})}},{key:"discoverHypertiesDO",value:function(e,t,r,n){var i=this,s=arguments;return new o.default(function(e,t){i.discoverHyperties.apply(i,s).then(function(t){e(i._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjects",value:function(e,t,r,n){var i=this,s=void 0;s=n||i.domain;var c={type:"read",from:i.discoveryURL,to:i.runtimeURL+"/discovery/",body:{resource:"/dataObject/user/"+e}};return c.body.criteria=t||r?{resources:r,dataSchemes:t,domain:s}:{domain:s},new o.default(function(e,t){i.messageBus.postMessage(c,function(r){200===r.body.code?(console.log("Reply Value Log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverDataObjectsDO",value:function(e,t,r,n){var i=this,s=arguments;return new o.default(function(e,t){i.discoverDataObjects.apply(i,s).then(function(t){return e(i._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverHypertyPerURL",value:function(e,t){var r=this,n=void 0;n=t||r.domain;var i={type:"read",from:r.discoveryURL,to:r.runtimeURL+"/discovery/",body:{resource:"/hyperty/url/"+e,criteria:{domain:n}}};return new o.default(function(e,t){r.messageBus.postMessage(i,function(r){200===r.body.code?(console.log("Reply Value Log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverHypertyPerURLDO",value:function(e,t){var r=this,n=arguments;return new o.default(function(e,t){r.discoverHypertyPerURL.apply(r,n).then(function(t){return e(new d.default(t,r.runtimeURL,r.discoveryURL,r.messageBus))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjectPerURL",value:function(e,t){var r=this,n=void 0;n=t||r.domain;var i={type:"read",from:r.discoveryURL,to:r.runtimeURL+"/discovery/",body:{resource:"/dataObject/url/"+e,criteria:{domain:n}}};return new o.default(function(e,t){r.messageBus.postMessage(i,function(r){200===r.body.code?(console.log("Reply Value Log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverDataObjectPerURLDO",value:function(e,t){var r=this,n=arguments;return new o.default(function(e,t){r.discoverDataObjectPerURL.apply(r,n).then(function(t){return e(new d.default(t,r.runtimeURL,r.discoveryURL,r.messageBus))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjectsPerName",value:function(e,t,r,n){var i=this,s=void 0;s=n||i.domain;var c={type:"read",from:i.discoveryURL,to:i.runtimeURL+"/discovery/",body:{resource:"/dataObject/name/"+e}};return c.body.criteria=t||r?{resources:r,dataSchemes:t,domain:s}:{domain:s},new o.default(function(e,t){i.messageBus.postMessage(c,function(r){200===r.body.code?(console.log("Reply Value Log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverDataObjectsPerNameDO",value:function(e,t,r,n){var i=this,s=arguments;return new o.default(function(e,t){i.discoverDataObjectsPerName.apply(i,s).then(function(t){return e(i._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"discoverDataObjectsPerReporter",value:function(e,t,r,n){var i=this,s=void 0;s=n||i.domain;var c={type:"read",from:i.discoveryURL,to:i.runtimeURL+"/discovery/",body:{resource:"/dataObject/reporter/"+e}};return c.body.criteria=t||r?{resources:r,dataSchemes:t,domain:s}:{domain:s},new o.default(function(e,t){i.messageBus.postMessage(c,function(r){200===r.body.code?(console.log("Reply Value Log: ",r.body.value),e(r.body.value)):(console.log("Error Log: ",r.body.description),t(r.body.description))})})}},{key:"discoverDataObjectsPerReporterDO",value:function(e,t,r,n){var i=this,s=arguments;return new o.default(function(e,t){i.discoverDataObjectsPerReporter.apply(i,s).then(function(t){return e(i._convertToDiscoveredObject(t))}).catch(function(e){return t(e)})})}},{key:"_convertToDiscoveredObject",value:function(e){var t=this;return e.map(function(e){return new d.default(e,t.runtimeURL,t.discoveryURL,t.messageBus)})}},{key:"discoverDataObject",value:function(e,t,r,n){var i=this,s=void 0;s=n||i.domain;var c={type:"read",from:i.discoveryURL,to:"domain://registry."+s,body:{resource:e,criteria:{resources:r,dataSchemes:t}}};return new o.default(function(e,t){i.messageBus.postMessage(c,function(r){if(console.log("[Discovery]",r),r.body.code>299)return t(r.body.description||r.body.desc);var n=r.body.value;e(n||{})})})}},{key:"discoverHyperty",value:function(e,t,r,n){var i=this,s=void 0,c=(0,a.convertToUserURL)(e);return s=n||i.domain,new o.default(function(o,u){if(console.log("[Discovery.discoverHyperty] ACTIVE DOMAIN -> ",s,"user->",e,"schema->",t,"resources->",r,"domain->",n),e.includes(":")&&!e.includes("user://")){console.log("[Discovery.discoverHyperty] "+e+" is legacy domain");return o({userID:e,hypertyID:e,schema:t,resources:r})}var a={type:"read",from:i.discoveryURL,to:"domain://registry."+s,body:{resource:c,criteria:{resources:r,dataSchemes:t}}};console.info("[Discovery] msg to send->",a),i.messageBus.postMessage(a,function(e){console.info("[Discovery] ON discoverHyperty->",e);var t=e.body.value;t?o(t):u("No Hyperty was found")})})}},{key:"discoverHypertyPerUser",value:function(e,t){var r=this,n=void 0;return new o.default(function(o,i){if(e.includes(":")&&!e.includes("user://")){console.log("[Discovery.discoverHyperty] "+e+"is legacy domain");return o({id:e,hypertyURL:e,descriptor:"unknown"})}n=t||r.domain;var s="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),c={type:"read",from:r.discoveryURL,to:"domain://registry."+n,body:{resource:s}};console.info("[Discovery] Message: ",c,n,s),r.messageBus.postMessage(c,function(t){console.info("[Discovery] message reply",t);var r=void 0,n=void 0,s=void 0,c=t.body.value;for(r in c)if(void 0!==c[r].lastModified)if(void 0===n)n=new Date(c[r].lastModified),s=r;else{var u=new Date(c[r].lastModified);n.getTime()<u.getTime()&&(n=u,s=r)}console.info("[Discovery] Last Hyperty: ",s,n);var a=s;if(void 0===a)return i("User Hyperty not found");var f={id:e,descriptor:c[a].descriptor,hypertyURL:a};console.info("[Discovery] ===> hypertyDiscovery messageBundle: ",f),o(f)})})}},{key:"discoverHypertiesPerUser",value:function(e,t){var r=this,n=void 0;return console.log("on Function->",e),new o.default(function(o,i){if(e.includes(":")&&!e.includes("user://")){console.log("[Discovery.discoverHyperty] is legacy domain");var s={userID:e,hypertyID:e,schema:schema,resources:resources};return o(s)}n=t||r.domain;var c="user://"+e.substring(e.indexOf("@")+1,e.length)+"/"+e.substring(0,e.indexOf("@")),u={type:"read",from:r.discoveryURL,to:"domain://registry."+n,body:{resource:c}};console.log("[Discovery] Message discoverHypertiesPerUser: ",u,n,c),r.messageBus.postMessage(u,function(e){console.info("[Discovery] discoverHypertiesPerUser reply",e);var t=e.body.value;if(!t)return i("User Hyperty not found");o(t)})})}},{key:"resumeDiscoveries",value:function(){var e=this;return console.log("[Discovery] resumeDiscoveries"),new o.default(function(t,r){var n={type:"read",from:e.discoveryURL,to:e.runtimeURL+"/subscriptions",body:{resource:e.discoveryURL}};e.messageBus.postMessage(n,function(r){console.log("[Discovery.resumeDiscoveries] reply: ",r);var n=[];if(200===r.body.code){r.body.value.forEach(function(t){var r=t.split("/registration")[0];({}).url=r,console.log("[Discovery.resumeDiscoveries] adding listener to: ",r),r.includes("hyperty://")?n.push(e.discoverHypertyPerURLDO(r)):n.push(e.discoverDataObjectPerURLDO(r))}),o.default.all(n).then(function(e){t(e)})}else t([])})})}}]),Discovery}();t.default=l,e.exports=t.default},,,,,,,,,function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(127),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=o.default,e.exports=t.default},,,,,,,,function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(59),o=_interopRequireDefault(n),i=r(72),s=_interopRequireDefault(i),c=r(8),u=_interopRequireDefault(c),a=r(10),f=_interopRequireDefault(a),d=r(71),l=function(){function DiscoveredObject(e,t,r,n){(0,u.default)(this,DiscoveredObject),this._data=e,this._registryObjectURL=e.hypertyID||e.url,this._runtimeURL=t,this._domain=(0,d.divideURL)(t).domain,this._discoveredObjectURL=r,this._messageBus=n,this._subscriptionSet=!1,this._subscribers={live:{},disconnected:{}}}return(0,f.default)(DiscoveredObject,[{key:"data",get:function(){return this._data}}]),(0,f.default)(DiscoveredObject,[{key:"onLive",value:function(e,t){var r=this;return new s.default(function(n,o){r._subscriptionSet?(r._subscribers.live[e]=t,n()):r._subscribe().then(function(){r._subscribers.live[e]=t,n()}).catch(function(e){return o(e)})})}},{key:"onDisconnected",value:function(e,t){var r=this;return new s.default(function(n,o){r._subscriptionSet?(r._subscribers.disconnected[e]=t,n()):r._subscribe().then(function(){r._subscribers.disconnected[e]=t,n()}).catch(function(e){return o(e)})})}},{key:"_subscribe",value:function(){var e=this,t={type:"subscribe",from:this._discoveredObjectURL,to:this._runtimeURL+"/subscriptions",body:{resources:[this._registryObjectURL+"/registration"]}};return new s.default(function(r,n){e._messageBus.postMessage(t,function(t){console.log("[DiscoveredObject.subscribe] "+e._registryObjectURL+" rcved reply ",t),200===t.body.code?(e._generateListener(e._registryObjectURL+"/registration"),e._subscriptionSet=!0,r()):(console.error("Error subscribing ",e._registryObjectURL),n("Error subscribing "+e._registryObjectURL))})})}},{key:"_generateListener",value:function(e){var t=this;this._messageBus.addListener(e,function(e){console.log("[DiscoveredObject.notification] "+t._registryObjectURL+": ",e),t._processNotification(e)})}},{key:"_processNotification",value:function(e){var t=this,r=e.body.value;(0,o.default)(this._subscribers[r]).forEach(function(e){return t._subscribers[r][e]()})}},{key:"_unsubscribe",value:function(){var e=this,t={type:"unsubscribe",from:this._discoveredObjectURL,to:this._runtimeURL+"/subscriptions",body:{resource:this._registryObjectURL+"/registration"}};return new s.default(function(r,n){e._messageBus.postMessage(t,function(t){console.log("[DiscoveredObject.unsubscribe] "+e._registryObjectURL+" rcved reply ",t),200===t.body.code?r():(console.error("Error unsubscribing ",e._registryObjectURL),n("Error unsubscribing "+e._registryObjectURL))})})}},{key:"unsubscribeLive",value:function(e,t){var r=this;return new s.default(function(t,n){e in r._subscribers.live?(delete r._subscribers.live[e],r._areSubscriptionsEmpty()?r._unsubscribe().then(function(){return t()}).catch(function(e){return n(e)}):t()):n(e+" doesn't subscribe onLive for "+r._registryObjectURL)})}},{key:"unsubscribeDisconnected",value:function(e,t){var r=this;return new s.default(function(t,n){e in r._subscribers.disconnected?(delete r._subscribers.disconnected[e],r._areSubscriptionsEmpty()?r._unsubscribe().then(function(){return t()}).catch(function(e){return n(e)}):t()):n(e+" doesn't subscribe onDisconnected for "+r._registryObjectURL)})}},{key:"_areSubscriptionsEmpty",value:function(){return 0===(0,o.default)(this._subscribers.live).length&&0===(0,o.default)(this._subscribers.disconnected).length}}]),DiscoveredObject}();t.default=l,e.exports=t.default}])});

/***/ }),
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

/* jshint undef: true */
/* globals RTCPeerConnection */
/* globals RTCSessionDescription */
/* globals RTCIceCandidate */

__webpack_require__(8);

var _connection = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectionController = function () {
  function ConnectionController(syncher, domain, configuration, clean, connector, remoteHyperty) {
    _classCallCheck(this, ConnectionController);

    if (!syncher) throw new Error('The syncher is a needed parameter');
    if (!domain) throw new Error('The domain is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    var _this = this;

    _this.mode = 'offer';
    _this._connector = connector;
    _this._remoteHyperty = remoteHyperty;

    // Private
    _this._syncher = syncher;
    _this._configuration = configuration;
    _this._domain = domain;
    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Connection';
    _this._clean = clean;

    // Prepare the PeerConnection
    var peerConnection = new RTCPeerConnection(_this._configuration);

    peerConnection.addEventListener('signalingstatechange', function (event) {

      console.info('[Connector.ConnectionController ]signalingstatechange', event.currentTarget.signalingState);

      if (event.currentTarget.signalingState === 'have-local-offer') {
        console.info('[Connector.ConnectionController ]signalingstatechange - have-local-offer: ', event.currentTarget.signalingState);
      }

      if (event.currentTarget.signalingState === 'have-remote-offer') {
        console.info('[Connector.ConnectionController ]signalingstatechange - have-remote-offer: ', event.currentTarget.signalingState);
        _this.mode = 'answer';
      }
    });

    peerConnection.addEventListener('iceconnectionstatechange', function (event) {
      console.info('[Connector.ConnectionController ]iceconnectionstatechange', event.currentTarget.iceConnectionState, _this.dataObjectReporter);
      var data = _this.dataObjectReporter.data;
      if (data.hasOwnProperty('status')) {
        data.status = event.currentTarget.iceConnectionState;
      }
    });

    peerConnection.addEventListener('icecandidate', function (event) {

      console.info('[Connector.ConnectionController ]icecandidate changes', event.candidate, _this.dataObjectReporter);

      if (!event.candidate) return;

      var icecandidate = {
        type: 'candidate',
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      };

      var data = _this.dataObjectReporter.data;

      console.log('[Connector.ConnectionController] - push iceCandidates: ', data, data.iceCandidates);

      // new model
      data.iceCandidates.push(icecandidate);

      /*
       if (_this.mode === 'offer') {
        data.ownerPeer.iceCandidates.push(icecandidate);
      } else {
        data.Peer.iceCandidates.push(icecandidate);
      }*/
    });

    // Add stream to PeerConnection
    peerConnection.addEventListener('addstream', function (event) {
      console.info('[Connector.ConnectionController ]Add Stream: ', event);

      if (_this._onAddStream) _this._onAddStream(event);
    });

    peerConnection.onremovestream = function (event) {
      console.info('[Connector.ConnectionController ]Stream removed: ', event);
    };

    _this.peerConnection = peerConnection;
  }

  _createClass(ConnectionController, [{
    key: '_removeMediaStream',
    value: function _removeMediaStream() {
      var _this = this;
      console.log(_this.mediaStream, _this.peerConnection);

      if (_this.mediaStream && _this.peerConnection) {

        var tracks = _this.mediaStream.getTracks();

        tracks.forEach(function (track) {
          track.stop();
        });
      }

      if (_this.peerConnection) {
        /*_this.peerConnection.removeStream(_this.mediaStream);
        _this.peerConnection.close();*/
        _this.peerConnection = null;
      }
    }
  }, {
    key: '_changePeerInformation',
    value: function _changePeerInformation(dataObjectObserver) {
      var _this = this;
      var data = dataObjectObserver.data;
      var isOwner = data.hasOwnProperty('ownerPeer');

      // New model
      var peerData = dataObjectObserver.data;
      // let peerData = isOwner ? data.ownerPeer : data.Peer;

      console.info('[Connector.ConnectionController ]Peer Data:', JSON.stringify(peerData));

      if (peerData.hasOwnProperty('connectionDescription')) {
        _this._processPeerInformation(peerData.connectionDescription);
      }

      if (peerData.hasOwnProperty('iceCandidates')) {

        console.log('Process Peer data: ', peerData);

        peerData.iceCandidates.forEach(function (ice) {
          _this._processPeerInformation(ice);
        });
      }

      dataObjectObserver.onChange('*', function (event) {
        console.info('[Connector.ConnectionController ]Observer on change message: ', event);
        _this._processPeerInformation(event.data);
      });
    }
  }, {
    key: '_processPeerInformation',
    value: function _processPeerInformation(data) {
      var _this = this;

      console.info('[Connector.ConnectionController processPeerInformation ]', JSON.stringify(data));

      if (data.type === 'offer' || data.type === 'answer') {
        console.info('[Connector.ConnectionController processPeerInformation]Process Connection Description: ', data.sdp);
        _this.peerConnection.setRemoteDescription(new RTCSessionDescription(data), _this._remoteDescriptionSuccess, _this._remoteDescriptionError);
      }

      if (data.type === 'candidate') {
        console.info('[Connector.ConnectionController ]Process Ice Candidate: ', data);
        _this.peerConnection.addIceCandidate(new RTCIceCandidate({ candidate: data.candidate }), _this._remoteDescriptionSuccess, _this._remoteDescriptionError);
      }
    }
  }, {
    key: '_remoteDescriptionSuccess',
    value: function _remoteDescriptionSuccess() {
      console.info('[Connector.ConnectionController ]remote success');
    }
  }, {
    key: '_remoteDescriptionError',
    value: function _remoteDescriptionError(error) {
      console.error('error: ', error);
    }
  }, {
    key: '_createOffer',
    value: function _createOffer() {
      var _this = this;

      _this.peerConnection.createOffer(function (description) {
        _this._onLocalSessionCreated(description);
      }, _this._infoError);
    }
  }, {
    key: '_createAnswer',
    value: function _createAnswer() {
      var _this = this;

      _this.peerConnection.createAnswer(function (description) {
        _this._onLocalSessionCreated(description);
      }, _this._infoError);
    }
  }, {
    key: '_onLocalSessionCreated',
    value: function _onLocalSessionCreated(description) {

      var _this = this;

      _this.peerConnection.setLocalDescription(description, function () {

        var data = _this.dataObjectReporter.data;

        var sdpConnection = {
          sdp: description.sdp,
          type: description.type
        };

        // new model
        data.connectionDescription = sdpConnection;

        /*      if (_this.mode === 'offer') {
                data.ownerPeer.connectionDescription = sdpConnection;
              } else {
                data.Peer.connectionDescription = sdpConnection;
              }*/
      }, _this._infoError);
    }
  }, {
    key: '_infoError',
    value: function _infoError(err) {
      console.error(err.toString(), err);
    }

    /**
     * This function is used to receive all changes did to dataObjectObjserver.
     * @param  {Function} callback callback function
     * @return {ChangeEvent}       properties and type of changes;
     */

    // onChange(callback) {
    //   let _this = this;
    //   _this._onChange = callback;
    // }

    /**
     * This function is used to handle the peer stream
     * @return {MediaStream}           WebRTC remote MediaStream retrieved by the Application
     */

  }, {
    key: 'onAddStream',
    value: function onAddStream(callback) {
      var _this = this;
      _this._onAddStream = callback;
    }

    /**
     * This function is used to receive requests to close an existing connection instance.
     * @param  {Function} callback callback function to handle with the disconnect
     * @return {DeleteEvent}       the DeleteEvent fired by the Syncher when the Connection is closed.
     */

  }, {
    key: 'onDisconnect',
    value: function onDisconnect(callback) {
      var _this = this;
      _this._onDisconnect = callback;
    }

    /**
     * This function is used to accept an incoming connection request received by connection.onInvitation().
     * @param  {MediaStream}         stream     WebRTC local MediaStream retrieved by the Application
     * @return {<Promise> boolean}              It returns, as a Promise, true in case the connection is successfully accepted, false otherwise.
     */

  }, {
    key: 'accept',
    value: function accept(stream) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        var syncher = _this._syncher;
        var remoteData = _this.dataObjectObserver.data;
        var remotePeer = remoteData.owner;

        _this.connectionObject = _connection.connection;
        console.log('[ConnectionController - Accept] - Remote Peer Information: ', remoteData);

        _this.connectionObject.name = remoteData.name;
        _this.connectionObject.scheme = 'connection';
        _this.connectionObject.owner = remoteData.owner;
        _this.connectionObject.peer = remoteData.peer;
        _this.connectionObject.status = '';

        try {
          console.info('[Connector.ConnectionController ]------------------------ Syncher Create ---------------------- \n');

          syncher.create(_this._objectDescURL, [remotePeer], _this.connectionObject, false, false, remoteData.name, {}, { resources: ['audio', 'video'] }).then(function (dataObjectReporter) {
            console.info('[Connector.ConnectionController ]2. Return the Data Object Reporter ', dataObjectReporter);

            _this.mediaStream = stream;
            _this.dataObjectReporter = dataObjectReporter;
            resolve(true);
          }).catch(function (reason) {
            console.error(reason);
            reject(false);
          });
        } catch (e) {
          reject('error accepting connection');
        }
      });
    }

    /**
     * This function is used to decline an incoming connection request received by connection.onInvitation().
     * @param  {int} reason               Integer decline reason that is compliant with RFC7231. If not present 400 is used. (optional)
     * @return {<Promise> boolean}        It returns, as a Promise, true in case the connection is successfully declined, false otherwise.
     */

  }, {
    key: 'decline',
    value: function decline(reason) {

      // TODO: Optimize this process

      var _this = this;
      var declineReason = 400;
      if (reason) declineReason = reason;

      return new Promise(function (resolve, reject) {

        try {
          //  _this.connectionEvent.ack(declineReason);
          _this.disconnect().then(function () {
            resolve(true);
          });
        } catch (e) {
          console.error(e);
          reject(false);
        }
      });
    }

    /**
     * This function is used to close an existing connection instance.
     * @return {<Promise> boolean} It returns as a Promise true if successfully disconnected or false otherwise.
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      // TODO: Optimize this process

      var _this = this;

      return new Promise(function (resolve, reject) {

        try {

          var data = void 0;
          if (_this.dataObjectReporter) {
            data = _this.dataObjectReporter;
            data.delete();
          }

          if (_this.dataObjectObserver) {
            data = _this.dataObjectObserver;
            data.delete();
          }

          _this._removeMediaStream();
          _this._clean(_this._connector._controllers, _this._remoteHyperty);

          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Disable Microfone
     * @param  {boolean} value status of microfone
     * @return {boolean}
     */

  }, {
    key: 'disableAudio',
    value: function disableAudio(value) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        try {
          var localStream = _this.peerConnection.getLocalStreams()[0];
          var audioTrack = localStream.getAudioTracks()[0];

          if (!value) {
            audioTrack.enabled = audioTrack.enabled ? false : true;
          } else {
            audioTrack.enabled = value;
          }

          resolve(audioTrack.enabled);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Disable video
     * @param  {boolean} value status of video
     * @return {boolean}
     */

  }, {
    key: 'disableVideo',
    value: function disableVideo(value) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        try {
          var localStream = _this.peerConnection.getLocalStreams()[0];
          var videoTrack = localStream ? localStream.getVideoTracks()[0] : null;

          if (videoTrack) {
            if (!value) {
              videoTrack.enabled = videoTrack.enabled ? false : true;
            } else {
              videoTrack.enabled = value;
            }

            resolve(videoTrack.enabled);
          } else {
            reject('not ready yet');
          }
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: 'mute',
    value: function mute(value) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        try {
          var remoteStream = _this.peerConnection.getRemoteStreams()[0];
          var audioTrack = remoteStream.getAudioTracks()[0];

          if (!value) {
            audioTrack.enabled = audioTrack.enabled ? false : true;
          } else {
            audioTrack.enabled = value;
          }

          resolve(audioTrack.enabled);
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: 'mediaStream',
    set: function set(mediaStream) {
      if (!mediaStream) throw new Error('The mediaStream is a needed parameter');

      var _this = this;
      console.info('[Connector.ConnectionController ]set stream: ', mediaStream);
      _this._mediaStream = mediaStream;
      _this.peerConnection.addStream(mediaStream);
    },
    get: function get() {
      var _this = this;
      return _this._mediaStream;
    }

    /**
    * Set the dataObject in the controller
    * @param {ConnectionDataObject} dataObject - have all information about the syncher object;
    */

  }, {
    key: 'dataObjectReporter',
    set: function set(dataObjectReporter) {
      if (!dataObjectReporter) throw new Error('The Data Object Reporter is a needed parameter');

      var _this = this;
      console.info('[Connector.ConnectionController ]set data object reporter: ', dataObjectReporter);
      _this._dataObjectReporter = dataObjectReporter;

      dataObjectReporter.onSubscription(function (event) {
        if (event.type === 'subscribe') event.accept();else {
          //to handle reject from remote peer
          _this._removeMediaStream();
          if (_this._onDisconnect) _this._onDisconnect(event);
          _this._clean(_this._connector._controllers, _this._remoteHyperty);
        }
      });

      if (_this.mode === 'offer') {
        _this._createOffer();
      } else {
        _this._createAnswer();
      }
    }

    /**
    * return the dataObject in the controller
    * @return {ConnectionDataObject} dataObject
    */
    ,
    get: function get() {
      var _this = this;
      return _this._dataObjectReporter;
    }

    /**
    * Set the dataObject in the controller
    * @param {ConnectionDataObject} dataObject - have all information about the syncher object;
    */

  }, {
    key: 'dataObjectObserver',
    set: function set(dataObjectObserver) {
      if (!dataObjectObserver) throw new Error('The Data Object Observer is a needed parameter');

      var _this = this;

      console.info('[Connector.ConnectionController ]set data object observer: ', dataObjectObserver);
      _this._dataObjectObserver = dataObjectObserver;
      _this._changePeerInformation(dataObjectObserver);
    }

    /**
    * return the dataObject in the controller
    * @return {ConnectionDataObject} dataObject
    */
    ,
    get: function get() {
      var _this = this;
      return _this._dataObjectObserver;
    }

    /**
     * Set the connection event to accept or reject
     * @param  {CreateEvent} event Event with actions to accept or reject the connection
     */

  }, {
    key: 'connectionEvent',
    set: function set(event) {
      var _this = this;
      _this._connectionEvent = event;
    }

    /**
     * Get the connection event to accept or reject
     * @return {CreateEvent}
     */
    ,
    get: function get() {
      var _this = this;
      return _this._connectionEvent;
    }
  }, {
    key: 'deleteEvent',
    set: function set(event) {
      var _this = this;
      _this._deleteEvent = event;

      _this._removeMediaStream();
      if (_this._onDisconnect) _this._onDisconnect(event);
      _this._clean(_this._connector._controllers, _this._remoteHyperty);
    },
    get: function get() {
      var _this = this;
      return _this._deleteEvent;
    }
  }]);

  return ConnectionController;
}();

exports.default = ConnectionController;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



var adapterFactory = __webpack_require__(10);
module.exports = adapterFactory({window: global.window});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



// Shimming starts here.
module.exports = function(dependencies, opts) {
  var window = dependencies && dependencies.window;

  var options = {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true,
  };

  for (var key in opts) {
    if (hasOwnProperty.call(opts, key)) {
      options[key] = opts[key];
    }
  }

  // Utils.
  var utils = __webpack_require__(0);
  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);

  // Export to the adapter global object visible in the browser.
  var adapter = {
    browserDetails: browserDetails,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  };

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = __webpack_require__(11) || null;
  var edgeShim = __webpack_require__(13) || null;
  var firefoxShim = __webpack_require__(17) || null;
  var safariShim = __webpack_require__(19) || null;

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;

      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      utils.shimCreateObjectURL(window);
      chromeShim.shimSourceObject(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrackRemoveTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;

      firefoxShim.shimGetUserMedia(window);
      utils.shimCreateObjectURL(window);
      firefoxShim.shimSourceObject(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = edgeShim;

      edgeShim.shimGetUserMedia(window);
      utils.shimCreateObjectURL(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;
      // shim window.URL.createObjectURL Safari (technical preview)
      utils.shimCreateObjectURL(window);
      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimGetUserMedia(window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(0);
var logging = utils.log;

var chromeShim = {
  shimMediaStream: function(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
          }
          this.addEventListener('track', this._ontrack = f);
        }
      });
      var origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
        var pc = this;
        if (!pc._ontrackpoly) {
          pc._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track.id === te.track.id;
                });
              } else {
                receiver = {track: te.track};
              }

              var event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track.id === track.id;
                });
              } else {
                receiver = {track: track};
              }
              var event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
          };
          pc.addEventListener('addstream', pc._ontrackpoly);
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    }
  },

  shimGetSendersWithDtmf: function(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in window.RTCPeerConnection.prototype) &&
        'createDTMFSender' in window.RTCPeerConnection.prototype) {
      var shimSenderWithDtmf = function(pc, track) {
        return {
          track: track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };

      // augment addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function() {
          this._senders = this._senders || [];
          return this._senders.slice(); // return a copy of the internal state.
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
          var pc = this;
          var sender = origAddTrack.apply(pc, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(pc, track);
            pc._senders.push(sender);
          }
          return sender;
        };

        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
        window.RTCPeerConnection.prototype.removeTrack = function(sender) {
          var pc = this;
          origRemoveTrack.apply(pc, arguments);
          var idx = pc._senders.indexOf(sender);
          if (idx !== -1) {
            pc._senders.splice(idx, 1);
          }
        };
      }
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origAddStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          pc._senders.push(shimSenderWithDtmf(pc, track));
        });
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);

        stream.getTracks().forEach(function(track) {
          var sender = pc._senders.find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
          }
        });
      };
    } else if (typeof window === 'object' && window.RTCPeerConnection &&
               'getSenders' in window.RTCPeerConnection.prototype &&
               'createDTMFSender' in window.RTCPeerConnection.prototype &&
               window.RTCRtpSender &&
               !('dtmf' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function() {
        var pc = this;
        var senders = origGetSenders.apply(pc, []);
        senders.forEach(function(sender) {
          sender._pc = pc;
        });
        return senders;
      };

      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  },

  shimSourceObject: function(window) {
    var URL = window && window.URL;

    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return undefined;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimAddTrackRemoveTrack: function(window) {
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack) {
      return;
    }

    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype
        .getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var self = this;
      var nativeStreams = origGetLocalStreams.apply(this);
      self._reverseStreams = self._reverseStreams || {};
      return nativeStreams.map(function(stream) {
        return self._reverseStreams[stream.id];
      });
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      stream.getTracks().forEach(function(track) {
        var alreadyExists = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
              'InvalidAccessError');
        }
      });
      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!pc._reverseStreams[stream.id]) {
        var newStream = new window.MediaStream(stream.getTracks());
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(pc, [stream]);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);
      delete pc._reverseStreams[(pc._streams[stream.id] ?
          pc._streams[stream.id].id : stream.id)];
      delete pc._streams[stream.id];
    };

    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      var streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(function(t) {
            return t === track;
          })) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      var alreadyExists = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};
      var oldStream = pc._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);
        pc.dispatchEvent(new Event('negotiationneeded'));
      } else {
        var newStream = new window.MediaStream([track]);
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        pc.addStream(newStream);
      }
      return pc.getSenders().find(function(s) {
        return s.track === track;
      });
    };

    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      var isLocal = sender._pc === pc;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      pc._streams = pc._streams || {};
      var stream;
      Object.keys(pc._streams).forEach(function(streamid) {
        var hasTrack = pc._streams[streamid].getTracks().find(function(track) {
          return sender.track === track;
        });
        if (hasTrack) {
          stream = pc._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          pc.removeStream(stream);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        pc.dispatchEvent(new Event('negotiationneeded'));
      }
    };
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        // Translate iceTransportPolicy to iceTransports,
        // see https://code.google.com/p/webrtc/issues/detail?id=4869
        // this was fixed in M56 along with unprefixing RTCPeerConnection.
        logging('PeerConnection');
        if (pcConfig && pcConfig.iceTransportPolicy) {
          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
        }

        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.webkitRTCPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if (window.webkitRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.webkitRTCPeerConnection.generateCertificate;
          }
        });
      }
    } else {
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') &&
                server.hasOwnProperty('url')) {
              utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }

    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(selector,
        successCallback, errorCallback) {
      var self = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }

      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 ||
          typeof arguments[0] !== 'function')) {
        return origGetStats.apply(this, []);
      }

      var fixChromeStats_ = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map(function(key) {
          return [key, stats[key]];
        }));
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function(response) {
          args[1](makeMapStats(fixChromeStats_(response)));
        };

        return origGetStats.apply(this, [successCallbackWrapper_,
          arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        origGetStats.apply(self, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
      }).then(successCallback, errorCallback);
    };

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = window.RTCPeerConnection.prototype[method];
            window.RTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var self = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(self, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // promise support for createOffer and createAnswer. Available (without
    // bugs) since M52: crbug/619289
    if (browserDetails.version < 52) {
      ['createOffer', 'createAnswer'].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function() {
          var self = this;
          if (arguments.length < 1 || (arguments.length === 1 &&
              typeof arguments[0] === 'object')) {
            var opts = arguments.length === 1 ? arguments[0] : undefined;
            return new Promise(function(resolve, reject) {
              nativeMethod.apply(self, [resolve, reject, opts]);
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
};


// Expose public methods.
module.exports = {
  shimMediaStream: chromeShim.shimMediaStream,
  shimOnTrack: chromeShim.shimOnTrack,
  shimAddTrackRemoveTrack: chromeShim.shimAddTrackRemoveTrack,
  shimGetSendersWithDtmf: chromeShim.shimGetSendersWithDtmf,
  shimSourceObject: chromeShim.shimSourceObject,
  shimPeerConnection: chromeShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(12)
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(0);
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;

  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      var remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      var getSupportedFacingModeLies = browserDetails.version < 61;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function(d) {
              return matches.some(function(match) {
                return d.label.toLowerCase().indexOf(match) !== -1;
              });
            });
            if (!dev && devices.length && matches.indexOf('back') !== -1) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        InvalidStateError: 'NotReadableError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotReadableError',
        MediaDeviceKillSwitchOn: 'NotReadableError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        onError(shimError_(e));
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return window.MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                kind: kinds[device.kind],
                deviceId: device.id,
                groupId: ''};
            }));
          });
        });
      },
      getSupportedConstraints: function() {
        return {
          deviceId: true, echoCancellation: true, facingMode: true,
          frameRate: true, height: true, width: true
        };
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);
var shimRTCPeerConnection = __webpack_require__(14);

module.exports = {
  shimGetUserMedia: __webpack_require__(16),
  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(
            window.MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
          set: function(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }

    // ORTC defines the DTMF sender a bit different.
    // https://github.com/w3c/ortc/issues/714
    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = new window.RTCDtmfSender(this);
            } else if (this.track.kind === 'video') {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }

    window.RTCPeerConnection =
        shimRTCPeerConnection(window, browserDetails.version);
  },
  shimReplaceTrack: function(window) {
    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
    if (window.RTCRtpSender &&
        !('replaceTrack' in window.RTCRtpSender.prototype)) {
      window.RTCRtpSender.prototype.replaceTrack =
          window.RTCRtpSender.prototype.setTrack;
    }
  }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(15);

// sort tracks such that they follow an a-v-a-v...
// pattern.
function sortTracks(tracks) {
  var audioTracks = tracks.filter(function(track) {
    return track.kind === 'audio';
  });
  var videoTracks = tracks.filter(function(track) {
    return track.kind === 'video';
  });
  tracks = [];
  while (audioTracks.length || videoTracks.length) {
    if (audioTracks.length) {
      tracks.push(audioTracks.shift());
    }
    if (videoTracks.length) {
      tracks.push(videoTracks.shift());
    }
  }
  return tracks;
}

// Edge does not like
// 1) stun:
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
    return false;
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

module.exports = function(window, edgeVersion) {
  var RTCPeerConnection = function(config) {
    var self = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          self[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.needNegotiation = false;

    this.onicecandidate = null;
    this.onaddstream = null;
    this.ontrack = null;
    this.onremovestream = null;
    this.onsignalingstatechange = null;
    this.oniceconnectionstatechange = null;
    this.onicegatheringstatechange = null;
    this.onnegotiationneeded = null;
    this.ondatachannel = null;
    this.canTrickleIceCandidates = null;

    this.localStreams = [];
    this.remoteStreams = [];
    this.getLocalStreams = function() {
      return self.localStreams;
    };
    this.getRemoteStreams = function() {
      return self.remoteStreams;
    };

    this.localDescription = new window.RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.remoteDescription = new window.RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';

    this.iceOptions = {
      gatherPolicy: 'all',
      iceServers: []
    };
    if (config && config.iceTransportPolicy) {
      switch (config.iceTransportPolicy) {
        case 'all':
        case 'relay':
          this.iceOptions.gatherPolicy = config.iceTransportPolicy;
          break;
        default:
          // don't set iceTransportPolicy.
          break;
      }
    }
    this.usingBundle = config && config.bundlePolicy === 'max-bundle';

    if (config && config.iceServers) {
      this.iceOptions.iceServers = filterIceServers(config.iceServers,
          edgeVersion);
    }
    this._config = config || {};

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    // since the iceGatherer is currently created in createOffer but we
    // must not emit candidates until after setLocalDescription we buffer
    // them in this array.
    this._localIceCandidatesBuffer = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this.dispatchEvent(event);
    if (this.onicegatheringstatechange !== null) {
      this.onicegatheringstatechange(event);
    }
  };

  RTCPeerConnection.prototype._emitBufferedCandidates = function() {
    var self = this;
    var sections = SDPUtils.splitSections(self.localDescription.sdp);
    // FIXME: need to apply ice candidates in a way which is async but
    // in-order
    this._localIceCandidatesBuffer.forEach(function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      if (end) {
        for (var j = 1; j < sections.length; j++) {
          if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
            sections[j] += 'a=end-of-candidates\r\n';
          }
        }
      } else {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
      }
      self.localDescription.sdp = sections.join('');
      self.dispatchEvent(event);
      if (self.onicecandidate !== null) {
        self.onicecandidate(event);
      }
      if (!event.candidate && self.iceGatheringState !== 'complete') {
        var complete = self.transceivers.every(function(transceiver) {
          return transceiver.iceGatherer &&
              transceiver.iceGatherer.state === 'completed';
        });
        if (complete && self.iceGatheringStateChange !== 'complete') {
          self.iceGatheringState = 'complete';
          self._emitGatheringStateChange();
        }
      }
    });
    this._localIceCandidatesBuffer = [];
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  // internal helper to create a transceiver object.
  // (whih is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    this.transceivers.push(transceiver);
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);

    this._maybeFireNegotiationNeeded();
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var self = this;
    if (edgeVersion >= 15025) {
      this.localStreams.push(stream);
      stream.getTracks().forEach(function(track) {
        self.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        self.addTrack(track, clonedStream);
      });
      this.localStreams.push(clonedStream);
    }
    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var idx = this.localStreams.indexOf(stream);
    if (idx > -1) {
      this.localStreams.splice(idx, 1);
      this._maybeFireNegotiationNeeded();
    }
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };

  // Create ICE gatherer and hook it up.
  RTCPeerConnection.prototype._createIceGatherer = function(mid,
      sdpMLineIndex) {
    var self = this;
    var iceGatherer = new window.RTCIceGatherer(self.iceOptions);
    iceGatherer.onlocalcandidate = function(evt) {
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      var end = !cand || Object.keys(cand).length === 0;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === undefined) {
          iceGatherer.state = 'completed';
        }
      } else {
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        event.candidate.candidate = SDPUtils.writeCandidate(cand);
      }

      // update local description.
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=end-of-candidates\r\n';
      }
      self.localDescription.sdp = sections.join('');
      var transceivers = self._pendingOffer ? self._pendingOffer :
          self.transceivers;
      var complete = transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      // Emit candidate if localDescription is set.
      // Also emits null candidate when all gatherers are complete.
      switch (self.iceGatheringState) {
        case 'new':
          if (!end) {
            self._localIceCandidatesBuffer.push(event);
          }
          if (end && complete) {
            self._localIceCandidatesBuffer.push(
                new Event('icecandidate'));
          }
          break;
        case 'gathering':
          self._emitBufferedCandidates();
          if (!end) {
            self.dispatchEvent(event);
            if (self.onicecandidate !== null) {
              self.onicecandidate(event);
            }
          }
          if (complete) {
            self.dispatchEvent(new Event('icecandidate'));
            if (self.onicecandidate !== null) {
              self.onicecandidate(new Event('icecandidate'));
            }
            self.iceGatheringState = 'complete';
            self._emitGatheringStateChange();
          }
          break;
        case 'complete':
          // should not happen... currently!
          break;
        default: // no-op.
          break;
      }
    };
    return iceGatherer;
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var self = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      self._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      self._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      self._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      params.encodings = transceiver.recvEncodingParameters;
      params.rtcp = {
        cname: transceiver.rtcpParameters.cname,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var self = this;

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, this.signalingState)) {
      var e = new Error('Can not set local ' + description.type +
          ' in state ' + this.signalingState);
      e.name = 'InvalidStateError';
      if (arguments.length > 2 && typeof arguments[2] === 'function') {
        window.setTimeout(arguments[2], 0, e);
      }
      return Promise.reject(e);
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // FIXME: What was the purpose of this empty if statement?
      // if (!this._pendingOffer) {
      // } else {
      if (this._pendingOffer) {
        // VERY limited support for SDP munging. Limited to:
        // * changing the order of codecs
        sections = SDPUtils.splitSections(description.sdp);
        sessionpart = sections.shift();
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var caps = SDPUtils.parseRtpParameters(mediaSection);
          self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
        });
        this.transceivers = this._pendingOffer;
        delete this._pendingOffer;
      }
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(self.remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = self.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        var rejected = SDPUtils.isRejected(mediaSection);

        if (!rejected && !transceiver.isDatachannel) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!self.usingBundle || sdpMLineIndex === 0) {
            iceTransport.start(iceGatherer, remoteIceParameters,
                isIceLite ? 'controlling' : 'controlled');
            dtlsTransport.start(remoteDtlsParameters);
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          self._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    this.localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    switch (description.type) {
      case 'offer':
        this._updateSignalingState('have-local-offer');
        break;
      case 'answer':
        this._updateSignalingState('stable');
        break;
      default:
        throw new TypeError('unsupported type "' + description.type +
            '"');
    }

    // If a success callback was provided, emit ICE candidates after it
    // has been executed. Otherwise, emit callback after the Promise is
    // resolved.
    var hasCallback = arguments.length > 1 &&
      typeof arguments[1] === 'function';
    if (hasCallback) {
      var cb = arguments[1];
      window.setTimeout(function() {
        cb();
        if (self.iceGatheringState === 'new') {
          self.iceGatheringState = 'gathering';
          self._emitGatheringStateChange();
        }
        self._emitBufferedCandidates();
      }, 0);
    }
    var p = Promise.resolve();
    p.then(function() {
      if (!hasCallback) {
        if (self.iceGatheringState === 'new') {
          self.iceGatheringState = 'gathering';
          self._emitGatheringStateChange();
        }
        // Usually candidates will be emitted earlier.
        window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
      }
    });
    return p;
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var self = this;

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, this.signalingState)) {
      var e = new Error('Can not set remote ' + description.type +
          ' in state ' + this.signalingState);
      e.name = 'InvalidStateError';
      if (arguments.length > 2 && typeof arguments[2] === 'function') {
        window.setTimeout(arguments[2], 0, e);
      }
      return Promise.reject(e);
    }

    var streams = {};
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    this.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      this.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      this.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      var rejected = SDPUtils.isRejected(mediaSection);
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (kind === 'application' && protocol === 'DTLS/SCTP') {
        self.transceivers[sdpMLineIndex] = {
          mid: mid,
          isDatachannel: true
        };
        return;
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === '1' || cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          self.transceivers[sdpMLineIndex]) {
        self._disposeIceAndDtlsTransports(sdpMLineIndex);
        self.transceivers[sdpMLineIndex].iceGatherer =
            self.transceivers[0].iceGatherer;
        self.transceivers[sdpMLineIndex].iceTransport =
            self.transceivers[0].iceTransport;
        self.transceivers[sdpMLineIndex].dtlsTransport =
            self.transceivers[0].dtlsTransport;
        if (self.transceivers[sdpMLineIndex].rtpSender) {
          self.transceivers[sdpMLineIndex].rtpSender.setTransport(
              self.transceivers[0].dtlsTransport);
        }
        if (self.transceivers[sdpMLineIndex].rtpReceiver) {
          self.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              self.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = self.transceivers[sdpMLineIndex] ||
            self._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = usingBundle && sdpMLineIndex > 0 ?
              self.transceivers[0].iceGatherer :
              self._createIceGatherer(mid, sdpMLineIndex);
        }

        if (isComplete && cands.length &&
            (!usingBundle || sdpMLineIndex === 0)) {
          transceiver.iceTransport.setRemoteCandidates(cands);
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        if (direction === 'sendrecv' || direction === 'sendonly') {
          rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport,
              kind);

          track = rtpReceiver.track;
          // FIXME: does not work with Plan B.
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
              Object.defineProperty(streams[remoteMsid.stream], 'id', {
                get: function() {
                  return remoteMsid.stream;
                }
              });
            }
            Object.defineProperty(track, 'id', {
              get: function() {
                return remoteMsid.track;
              }
            });
            streams[remoteMsid.stream].addTrack(track);
            receiverList.push([track, rtpReceiver,
              streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            streams.default.addTrack(track);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        self._transceive(self.transceivers[sdpMLineIndex],
            false,
            direction === 'sendrecv' || direction === 'sendonly');
      } else if (description.type === 'answer' && !rejected) {
        transceiver = self.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        self.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        self.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        self.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (!usingBundle || sdpMLineIndex === 0) {
          if ((isIceLite || isComplete) && cands.length) {
            iceTransport.setRemoteCandidates(cands);
          }
          iceTransport.start(iceGatherer, remoteIceParameters,
              'controlling');
          dtlsTransport.start(remoteDtlsParameters);
        }

        self._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            streams[remoteMsid.stream].addTrack(track);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            streams.default.addTrack(track);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    this.remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    switch (description.type) {
      case 'offer':
        this._updateSignalingState('have-remote-offer');
        break;
      case 'answer':
        this._updateSignalingState('stable');
        break;
      default:
        throw new TypeError('unsupported type "' + description.type +
            '"');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        self.remoteStreams.push(stream);
        var event = new Event('addstream');
        event.stream = stream;
        self.dispatchEvent(event);
        if (self.onaddstream !== null) {
          window.setTimeout(function() {
            self.onaddstream(event);
          }, 0);
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          var trackEvent = new Event('track');
          trackEvent.track = track;
          trackEvent.receiver = receiver;
          trackEvent.streams = [stream];
          self.dispatchEvent(trackEvent);
          if (self.ontrack !== null) {
            window.setTimeout(function() {
              self.ontrack(trackEvent);
            }, 0);
          }
        });
      }
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(self && self.transceivers)) {
        return;
      }
      self.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    if (arguments.length > 1 && typeof arguments[1] === 'function') {
      window.setTimeout(arguments[1], 0);
    }
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this.dispatchEvent(event);
    if (this.onsignalingstatechange !== null) {
      this.onsignalingstatechange(event);
    }
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var self = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (self.needNegotiation === false) {
        return;
      }
      self.needNegotiation = false;
      var event = new Event('negotiationneeded');
      self.dispatchEvent(event);
      if (self.onnegotiationneeded !== null) {
        self.onnegotiationneeded(event);
      }
    }, 0);
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var self = this;
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      states[transceiver.iceTransport.state]++;
      states[transceiver.dtlsTransport.state]++;
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0 || states.checking > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0 || states.completed > 0) {
      newState = 'connected';
    }

    if (newState !== self.iceConnectionState) {
      self.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this.dispatchEvent(event);
      if (this.oniceconnectionstatechange !== null) {
        this.oniceconnectionstatechange(event);
      }
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var self = this;
    if (this._pendingOffer) {
      throw new Error('createOffer called while there is a pending offer.');
    }
    var offerOptions;
    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
      offerOptions = arguments[0];
    } else if (arguments.length === 3) {
      offerOptions = arguments[2];
    }

    var numAudioTracks = this.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = this.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    this.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        this._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        this._createTransceiver('video');
        numVideoTracks--;
      }
    }
    // reorder tracks
    var transceivers = sortTracks(this.transceivers);

    var sdp = SDPUtils.writeSessionBoilerplate(this._sdpSessionId);
    transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = self.usingBundle && sdpMLineIndex > 0 ?
            transceivers[0].iceGatherer :
            self._createIceGatherer(mid, sdpMLineIndex);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video') {
          sendEncodingParameters[0].rtx = {
            ssrc: (2 * sdpMLineIndex + 1) * 1001 + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
          transceiver.dtlsTransport,
          kind
        );
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (this._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += SDPUtils.writeMediaSection(transceiver,
          transceiver.localCapabilities, 'offer', transceiver.stream);
      sdp += 'a=rtcp-rsize\r\n';
    });

    this._pendingOffer = transceivers;
    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var sdp = SDPUtils.writeSessionBoilerplate(this._sdpSessionId);
    if (this.usingBundle) {
      sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    this.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (transceiver.isDatachannel) {
        sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
            'c=IN IP4 0.0.0.0\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video') {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: (2 * sdpMLineIndex + 2) * 1001 + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    if (!candidate) {
      for (var j = 0; j < this.transceivers.length; j++) {
        this.transceivers[j].iceTransport.addRemoteCandidate({});
        if (this.usingBundle) {
          return Promise.resolve();
        }
      }
    } else {
      var mLineIndex = candidate.sdpMLineIndex;
      if (candidate.sdpMid) {
        for (var i = 0; i < this.transceivers.length; i++) {
          if (this.transceivers[i].mid === candidate.sdpMid) {
            mLineIndex = i;
            break;
          }
        }
      }
      var transceiver = this.transceivers[mLineIndex];
      if (transceiver) {
        var cand = Object.keys(candidate.candidate).length > 0 ?
            SDPUtils.parseCandidate(candidate.candidate) : {};
        // Ignore Chrome's invalid candidates since Edge does not like them.
        if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
          return Promise.resolve();
        }
        // Ignore RTCP candidates, we assume RTCP-MUX.
        if (cand.component &&
            !(cand.component === '1' || cand.component === 1)) {
          return Promise.resolve();
        }
        transceiver.iceTransport.addRemoteCandidate(cand);

        // update the remoteDescription.
        var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
        sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
            : 'a=end-of-candidates') + '\r\n';
        this.remoteDescription.sdp = sections.join('');
      }
    }
    if (arguments.length > 1 && typeof arguments[1] === 'function') {
      window.setTimeout(arguments[1], 0);
    }
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.getStats = function() {
    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
        'dtlsTransport'].forEach(function(method) {
          if (transceiver[method]) {
            promises.push(transceiver[method].getStats());
          }
        });
    });
    var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
        arguments[1];
    var fixStatsType = function(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    };
    return new Promise(function(resolve) {
      // shim getStats with maplike support
      var results = new Map();
      Promise.all(promises).then(function(res) {
        res.forEach(function(result) {
          Object.keys(result).forEach(function(id) {
            result[id].type = fixStatsType(result[id]);
            results.set(id, result[id]);
          });
        });
        if (cb) {
          window.setTimeout(cb, 0, results);
        }
        resolve(results);
      });
    });
  };
  return RTCPeerConnection;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

// Expose public methods.
module.exports = SDPUtils;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


// Expose public methods.
module.exports = function(window) {
  var navigator = window && window.navigator;

  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);

var firefoxShim = {
  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function(window) {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (window.mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(
      selector,
      onSucc,
      onErr
    ) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          if (browserDetails.version < 48) {
            stats = makeMapStats(stats);
          }
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  }
};

// Expose public methods.
module.exports = {
  shimOnTrack: firefoxShim.shimOnTrack,
  shimSourceObject: firefoxShim.shimSourceObject,
  shimPeerConnection: firefoxShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(18)
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  var shimError_ = function(e) {
    return {
      name: {
        InternalError: 'NotReadableError',
        NotSupportedError: 'TypeError',
        PermissionDeniedError: 'NotAllowedError',
        SecurityError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    utils.deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

var utils = __webpack_require__(0);

var safariShim = {
  // TODO: DrAlex, should be here, double check against LayoutTests

  // TODO: once the back-end for the mac port is done, add.
  // TODO: check for webkitGTK+
  // shimPeerConnection: function() { },

  shimLocalStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams = function() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getStreamById = function(id) {
        var result = null;
        if (this._localStreams) {
          this._localStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        if (this._remoteStreams) {
          this._remoteStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        return result;
      };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (this._localStreams.indexOf(stream) === -1) {
          this._localStreams.push(stream);
        }
        var self = this;
        stream.getTracks().forEach(function(track) {
          _addTrack.call(self, track, stream);
        });
      };

      window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (this._localStreams.indexOf(stream) === -1) {
            this._localStreams.push(stream);
          }
        }
        _addTrack.call(this, track, stream);
      };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        var index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        var self = this;
        var tracks = stream.getTracks();
        this.getSenders().forEach(function(sender) {
          if (tracks.indexOf(sender.track) !== -1) {
            self.removeTrack(sender);
          }
        });
      };
    }
  },
  shimRemoteStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get: function() {
          return this._onaddstream;
        },
        set: function(f) {
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
            this.removeEventListener('track', this._onaddstreampoly);
          }
          this.addEventListener('addstream', this._onaddstream = f);
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            var stream = e.streams[0];
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.indexOf(stream) >= 0) {
              return;
            }
            this._remoteStreams.push(stream);
            var event = new Event('addstream');
            event.stream = e.streams[0];
            this.dispatchEvent(event);
          }.bind(this));
        }
      });
    }
  },
  shimCallbacksAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    var prototype = window.RTCPeerConnection.prototype;
    var createOffer = prototype.createOffer;
    var createAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;

    prototype.createOffer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    prototype.createAnswer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    var withCallback = function(description, successCallback, failureCallback) {
      var promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;

    withCallback = function(description, successCallback, failureCallback) {
      var promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;

    withCallback = function(candidate, successCallback, failureCallback) {
      var promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  },
  shimGetUserMedia: function(window) {
    var navigator = window && window.navigator;

    if (!navigator.getUserMedia) {
      if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }
  },
  shimRTCIceServerUrls: function(window) {
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
};

// Expose public methods.
module.exports = {
  shimCallbacksAPI: safariShim.shimCallbacksAPI,
  shimLocalStreamsAPI: safariShim.shimLocalStreamsAPI,
  shimRemoteStreamsAPI: safariShim.shimRemoteStreamsAPI,
  shimGetUserMedia: safariShim.shimGetUserMedia,
  shimRTCIceServerUrls: safariShim.shimRTCIceServerUrls
  // TODO
  // shimPeerConnection: safariShim.shimPeerConnection
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Search = function () {
  function Search(discovery, identityManager) {
    _classCallCheck(this, Search);

    if (!discovery) throw new Error('The discovery component is a needed parameter');
    if (!identityManager) throw new Error('The identityManager component is a needed parameter');

    var _this = this;

    _this.discovery = discovery;
    _this.identityManager = identityManager;
  }

  _createClass(Search, [{
    key: 'myIdentity',
    value: function myIdentity() {
      var _this = this;

      return new Promise(function (resolve, reject) {

        _this.identityManager.discoverUserRegistered().then(function (result) {
          resolve(result);
        }).catch(function (reason) {
          reject(reason);
        });
      });
    }
  }, {
    key: 'hyperties',
    value: function hyperties(users, schemes, resources) {
      var globalFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    }
    //TODO: reuse users or the other way around

    /**
     * List of usersURL to search
     * @param  {array<URL.userURL>}  users List of UserUR, like this format user://<ipddomain>/<user-identifier>
     * @return {Promise}
     */

  }, {
    key: 'users',
    value: function users(usersURLs, providedDomains, schemes, resources) {
      var globalFlag = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


      if (!usersURLs) throw new Error('You need to provide a list of users');
      if (!providedDomains) throw new Error('You need to provide a list of domains');
      if (!resources) throw new Error('You need to provide a list of resources');
      if (!schemes) throw new Error('You need to provide a list of schemes');

      var _this = this;

      return new Promise(function (resolve, reject) {

        console.info('[Search] Users: ', usersURLs, usersURLs.length);
        console.info('[Search] Domains: ', providedDomains, providedDomains.length);
        if (usersURLs.length === 0) {
          console.info('Don\'t have users to discovery');
          resolve(usersURLs);
        } else {
          var getUsers = [];

          usersURLs.forEach(function (userURL, index) {
            var currentDomain = providedDomains[index];
            console.info('[Search] Search user ' + userURL + ' for provided domain:', currentDomain);
            if (!globalFlag) {
              getUsers.push(_this.discovery.discoverHyperties(userURL, schemes, resources, currentDomain));
            } else {
              getUsers.push(_this.discovery.discoverHypertiesPerUserProfileData(userURL, schemes, resources));
            }
          });

          console.info('Requests promises: ', getUsers);

          Promise.all(getUsers.map(function (promise) {
            return promise.then(function (hyperty) {
              return hyperty;
            }, function (error) {
              return error;
            });
          })).then(function (hyperties) {

            console.info('[Search] Hyperties from new Discovery', hyperties);
            var result = hyperties.map(function (hyperty) {

              if (hyperty.hasOwnProperty('hypertyID')) return hyperty;
              var recent = Object.keys(hyperty).reduceRight(function (a, b) {
                var hypertyDate = new Date(hyperty[b].lastModified);
                var hypertyDateP = new Date(hyperty[a].lastModified);
                if (hypertyDateP.getTime() < hypertyDate.getTime()) {
                  return b;
                }
                return a;
              });

              return hyperty[recent];
            });

            var clean = result.filter(function (hyperty) {
              return hyperty.hasOwnProperty('hypertyID');
            });

            console.log('Requests result: ', clean);

            hyperties.forEach(function (entry) {
              if (entry !== 'No Hyperty was found') {
                return resolve(clean);
              }
            });

            reject('No Hyperty was found');
          }).catch(function (reason) {
            console.error(reason);
            resolve(usersURLs);
          });
        }
      });
    }
  }]);

  return Search;
}();

exports.default = Search;
module.exports = exports['default'];

/***/ })
/******/ ]);
});