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

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
 * ProtoStub Interface
 */
var MatrixProtoStub = function () {

  /**
   * Initialise the protocol stub including as input parameters its allocated
   * component runtime url, the runtime BUS postMessage function to be invoked
   * on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
   * @param  {URL.runtimeProtoStubURL}                            runtimeProtoStubURL runtimeProtoSubURL
   * @param  {Message.Message}                           busPostMessage     configuration
   * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
   */
  function MatrixProtoStub(runtimeProtoStubURL, miniBus, configuration) {
    var _this2 = this;

    _classCallCheck(this, MatrixProtoStub);

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._runtimeURL = configuration.runtimeURL;
    this._configuration = configuration;
    this._bus = miniBus;
    this._identity = null;
    this._ws = null;
    this._bus.addListener('*', function (msg) {
      _this2._assumeOpen = true;
      _this2._sendWSMsg(msg);
    });
    this._assumeOpen = false;
    this._sendStatus("created");
  }

  /**
   * Connect the protocol stub to the back-end server.
   * @param  {IDToken} identity identity .. this can be either an idtoken,
   *         or a username/password combination to authenticate against the Matrix HS
   */


  _createClass(MatrixProtoStub, [{
    key: "connect",
    value: function connect(identity) {
      var _this3 = this;

      this._identity = identity;
      this._assumeOpen = true;

      return new Promise(function (resolve, reject) {

        if (_this3._ws && _this3._ws.readyState === 1) {
          resolve(_this3._ws);
          return;
        }

        // connect if not initialized or in CLOSED state
        if (!_this3._ws || _this3._ws.readyState === 3) {
          _this3._sendStatus("in-progress");
          // create socket to the MN
          _this3._ws = new WebSocket(_this3._configuration.messagingnode + "?runtimeURL=" + encodeURIComponent(_this3._runtimeURL));
          _this3._ws.onmessage = function (m) {
            _this3._onWSMessage(m);
          };
          _this3._ws.onclose = function () {
            _this3._onWSClose();
          };
          _this3._ws.onerror = function () {
            _this3._onWSError();
          };
          _this3._ws.onopen = function () {
            _this3._waitReady(function () {
              _this3._onWSOpen();
              resolve();
            });
          };
        } else if (_this3._ws.readyState === 0) {
          // CONNECTING --> wait for CONNECTED
          _this3._waitReady(function () {
            resolve();
          });
        }
      });
    }
  }, {
    key: "_waitReady",
    value: function _waitReady(callback) {
      var _this = this;
      if (this._ws.readyState === 1) {
        callback();
      } else {
        setTimeout(function () {
          _this._waitReady(callback);
        });
      }
    }

    /**
     * To disconnect the protocol stub.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      // send disconnect command to MN to indicate that resources for this runtimeURL can be cleaned up
      // the close of the websocket will be initiated from server side
      this._sendWSMsg({
        cmd: "disconnect",
        data: {
          runtimeURL: this._runtimeURL
        }
      });
      this._assumeOpen = false;
    }

    /**
     * Filter method that should be used for every messages in direction: Protostub -> MessageNode
     * @param  {Message} msg Original message from the MessageBus
     * @return {boolean} true if it's to be deliver in the MessageNode
     */

  }, {
    key: "_filter",
    value: function _filter(msg) {
      if (msg.body && msg.body.via === this._runtimeProtoStubURL) return false;
      return true;
    }
  }, {
    key: "_sendWSMsg",
    value: function _sendWSMsg(msg) {
      var _this4 = this;

      console.log("+[MatrixProtoStub] [_sendWSMsg] ", msg);
      if (this._filter(msg)) {
        if (this._assumeOpen) {
          this.connect().then(function () {
            // 2017-03-08: adding via header also to outgoing messages
            msg.body.via = _this4._runtimeProtoStubURL;
            _this4._ws.send(JSON.stringify(msg));
          });
        }
      }
    }
  }, {
    key: "_sendStatus",
    value: function _sendStatus(value, reason) {
      var msg = {
        type: 'update',
        from: this._runtimeProtoStubURL,
        to: this._runtimeProtoStubURL + '/status',
        body: {
          value: value
        }
      };
      if (reason) {
        msg.body.desc = reason;
      }
      console.log("+[MatrixProtoStub] [_sendStatus]", msg);
      this._bus.postMessage(msg);
    }
  }, {
    key: "_onWSOpen",
    value: function _onWSOpen() {
      this._sendStatus("live");
    }

    /**
     * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
     * @param  {Message} msg Original message from the MessageNode
     */

  }, {
    key: "_deliver",
    value: function _deliver(msg) {
      if (!msg.body) msg.body = {};

      msg.body.via = this._runtimeProtoStubURL;
      this._bus.postMessage(msg);
    }

    // parse msg and forward it locally to miniBus

  }, {
    key: "_onWSMessage",
    value: function _onWSMessage(msg) {
      // 2017-03-08: filter also incoming messages for via header
      if (this._filter(msg)) {
        this._deliver(JSON.parse(msg.data));
      }
    }
  }, {
    key: "_onWSClose",
    value: function _onWSClose() {
      console.log("+[MatrixProtoStub] [_onWSClose] websocket closed");
      this._sendStatus("disconnected");
    }
  }, {
    key: "_onWSError",
    value: function _onWSError(err) {
      console.log("+[MatrixProtoStub] [_onWSError] websocket error: " + err);
      this._sendStatus("failed", err);
    }
  }]);

  return MatrixProtoStub;
}();

function activate(url, bus, config) {
  return {
    name: 'MatrixProtoStub',
    instance: new MatrixProtoStub(url, bus, config)
  };
}
module.exports = exports["default"];

/***/ })
/******/ ]);
});