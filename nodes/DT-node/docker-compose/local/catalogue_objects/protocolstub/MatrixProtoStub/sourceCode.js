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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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
	    var _this = this;

	    _classCallCheck(this, MatrixProtoStub);

	    this._runtimeProtoStubURL = runtimeProtoStubURL;
	    this._runtimeURL = configuration.runtimeURL;
	    this._configuration = configuration;
	    this._bus = miniBus;
	    this._identity = null;
	    this._ws = null;
	    this._bus.addListener('*', function (msg) {
	      _this._assumeOpen = true;
	      _this._sendWSMsg(msg);
	    });
	    this._assumeOpen = false;
	  }

	  /**
	   * Connect the protocol stub to the back-end server.
	   * @param  {IDToken} identity identity .. this can be either an idtoken,
	   *         or a username/password combination to authenticate against the Matrix HS
	   */


	  _createClass(MatrixProtoStub, [{
	    key: "connect",
	    value: function connect(identity) {
	      var _this2 = this;

	      this._identity = identity;
	      this._assumeOpen = true;

	      return new Promise(function (resolve, reject) {

	        if (_this2._ws && _this2._ws.readyState === 1) {
	          resolve(_this2._ws);
	          return;
	        }

	        // create socket to the MN
	        _this2._ws = new WebSocket(_this2._configuration.messagingnode + "?runtimeURL=" + encodeURIComponent(_this2._runtimeURL));
	        _this2._ws.onmessage = function (m) {
	          _this2._onWSMessage(m);
	        };
	        _this2._ws.onclose = function () {
	          _this2._onWSClose();
	        };
	        _this2._ws.onerror = function () {
	          _this2._onWSError();
	        };

	        _this2._ws.onopen = function () {
	          _this2._onWSOpen();
	          // resolve if not rejected
	          resolve();
	        };
	      });
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
	      var _this3 = this;

	      if (this._filter(msg)) {
	        if (this._assumeOpen) this.connect().then(function () {
	          _this3._ws.send(JSON.stringify(msg));
	        });
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

	      this._bus.postMessage(msg);
	    }
	  }, {
	    key: "_onWSOpen",
	    value: function _onWSOpen() {
	      this._sendStatus("connected");
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
	      this._deliver(JSON.parse(msg.data));
	      // this._bus.postMessage(JSON.parse(msg.data));
	    }
	  }, {
	    key: "_onWSClose",
	    value: function _onWSClose() {
	      //console.log("+[MatrixProtoStub] [_onWSClose] websocket closed");
	      this._sendStatus("disconnected");
	    }
	  }, {
	    key: "_onWSError",
	    value: function _onWSError(err) {
	      // console.log("+[MatrixProtoStub] [_onWSError] websocket error: " + err);
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

/***/ }
/******/ ])
});
;