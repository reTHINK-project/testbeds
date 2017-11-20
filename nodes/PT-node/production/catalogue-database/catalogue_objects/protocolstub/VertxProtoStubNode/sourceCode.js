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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(19)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const safeBuffer = __webpack_require__(0);
const Limiter = __webpack_require__(20);
const zlib = __webpack_require__(21);

const bufferUtil = __webpack_require__(3);

const Buffer = safeBuffer.Buffer;

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const EMPTY_BLOCK = Buffer.from([0x00]);

const kWriteInProgress = Symbol('write-in-progress');
const kPendingClose = Symbol('pending-close');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');
const kOwner = Symbol('owner');

// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's
// an issue.
let zlibLimiter;

/**
 * Per-message Deflate implementation.
 */
class PerMessageDeflate {
  constructor (options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold = this._options.threshold !== undefined
      ? this._options.threshold
      : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency = this._options.concurrencyLimit !== undefined
        ? this._options.concurrencyLimit
        : 10;
      zlibLimiter = new Limiter({ concurrency });
    }
  }

  static get extensionName () {
    return 'permessage-deflate';
  }

  /**
   * Create extension parameters offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer () {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept extension offer.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @public
   */
  accept (paramsList) {
    paramsList = this.normalizeParams(paramsList);

    var params;
    if (this._isServer) {
      params = this.acceptAsServer(paramsList);
    } else {
      params = this.acceptAsClient(paramsList);
    }

    this.params = params;
    return params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup () {
    if (this._inflate) {
      if (this._inflate[kWriteInProgress]) {
        this._inflate[kPendingClose] = true;
      } else {
        this._inflate.close();
        this._inflate = null;
      }
    }
    if (this._deflate) {
      if (this._deflate[kWriteInProgress]) {
        this._deflate[kPendingClose] = true;
      } else {
        this._deflate.close();
        this._deflate = null;
      }
    }
  }

  /**
   * Accept extension offer from client.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer (paramsList) {
    const accepted = {};
    const result = paramsList.some((params) => {
      if (
        (this._options.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (this._options.serverMaxWindowBits === false &&
          params.server_max_window_bits) ||
        (typeof this._options.serverMaxWindowBits === 'number' &&
          typeof params.server_max_window_bits === 'number' &&
          this._options.serverMaxWindowBits > params.server_max_window_bits) ||
        (typeof this._options.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return;
      }

      if (
        this._options.serverNoContextTakeover ||
        params.server_no_context_takeover
      ) {
        accepted.server_no_context_takeover = true;
      }
      if (
        this._options.clientNoContextTakeover ||
        (this._options.clientNoContextTakeover !== false &&
          params.client_no_context_takeover)
      ) {
        accepted.client_no_context_takeover = true;
      }
      if (typeof this._options.serverMaxWindowBits === 'number') {
        accepted.server_max_window_bits = this._options.serverMaxWindowBits;
      } else if (typeof params.server_max_window_bits === 'number') {
        accepted.server_max_window_bits = params.server_max_window_bits;
      }
      if (typeof this._options.clientMaxWindowBits === 'number') {
        accepted.client_max_window_bits = this._options.clientMaxWindowBits;
      } else if (
        this._options.clientMaxWindowBits !== false &&
        typeof params.client_max_window_bits === 'number'
      ) {
        accepted.client_max_window_bits = params.client_max_window_bits;
      }
      return true;
    });

    if (!result) throw new Error("Doesn't support the offered configuration");

    return accepted;
  }

  /**
   * Accept extension response from server.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient (paramsList) {
    const params = paramsList[0];

    if (this._options.clientNoContextTakeover != null) {
      if (
        this._options.clientNoContextTakeover === false &&
        params.client_no_context_takeover
      ) {
        throw new Error('Invalid value for "client_no_context_takeover"');
      }
    }
    if (this._options.clientMaxWindowBits != null) {
      if (
        this._options.clientMaxWindowBits === false &&
        params.client_max_window_bits
      ) {
        throw new Error('Invalid value for "client_max_window_bits"');
      }
      if (
        typeof this._options.clientMaxWindowBits === 'number' &&
        (!params.client_max_window_bits ||
          params.client_max_window_bits > this._options.clientMaxWindowBits)
      ) {
        throw new Error('Invalid value for "client_max_window_bits"');
      }
    }

    return params;
  }

  /**
   * Normalize extensions parameters.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Array} Normalized extensions parameters
   * @private
   */
  normalizeParams (paramsList) {
    return paramsList.map((params) => {
      Object.keys(params).forEach((key) => {
        var value = params[key];
        if (value.length > 1) {
          throw new Error(`Multiple extension parameters for ${key}`);
        }

        value = value[0];

        switch (key) {
          case 'server_no_context_takeover':
          case 'client_no_context_takeover':
            if (value !== true) {
              throw new Error(`invalid extension parameter value for ${key} (${value})`);
            }
            params[key] = true;
            break;
          case 'server_max_window_bits':
          case 'client_max_window_bits':
            if (typeof value === 'string') {
              value = parseInt(value, 10);
              if (
                Number.isNaN(value) ||
                value < zlib.Z_MIN_WINDOWBITS ||
                value > zlib.Z_MAX_WINDOWBITS
              ) {
                throw new Error(`invalid extension parameter value for ${key} (${value})`);
              }
            }
            if (!this._isServer && value === true) {
              throw new Error(`Missing extension parameter value for ${key}`);
            }
            params[key] = value;
            break;
          default:
            throw new Error(`Not defined extension parameter (${key})`);
        }
      });
      return params;
    });
  }

  /**
   * Decompress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress (data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._inflate = zlib.createInflateRaw({ windowBits });
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate[kOwner] = this;
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;
    this._inflate[kWriteInProgress] = true;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._inflate[kPendingClose]
      ) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kWriteInProgress] = false;
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress (data, fin, callback) {
    if (!data || data.length === 0) {
      process.nextTick(callback, null, EMPTY_BLOCK);
      return;
    }

    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        memLevel: this._options.memLevel,
        level: this._options.level,
        flush: zlib.Z_SYNC_FLUSH,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // `zlib.DeflateRaw` emits an `'error'` event only when an attempt to use
      // it is made after it has already been closed. This cannot happen here,
      // so we only add a listener for the `'data'` event.
      //
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kWriteInProgress] = true;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      var data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._deflate[kPendingClose]
      ) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kWriteInProgress] = false;
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData (chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData (chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kOwner]._maxPayload < 1 ||
    this[kTotalLength] <= this[kOwner]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new Error('max payload size exceeded');
  this[kError].closeCode = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError (err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kOwner]._inflate = null;
  this[kCallback](err);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(0);

const Buffer = safeBuffer.Buffer;

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
const concat = (list, totalLength) => {
  const target = Buffer.allocUnsafe(totalLength);
  var offset = 0;

  for (var i = 0; i < list.length; i++) {
    const buf = list[i];
    buf.copy(target, offset);
    offset += buf.length;
  }

  return target;
};

try {
  const bufferUtil = __webpack_require__(22);

  module.exports = Object.assign({ concat }, bufferUtil.BufferUtil || bufferUtil);
} catch (e) /* istanbul ignore next */ {
  /**
   * Masks a buffer using the given mask.
   *
   * @param {Buffer} source The buffer to mask
   * @param {Buffer} mask The mask to use
   * @param {Buffer} output The buffer where to store the result
   * @param {Number} offset The offset at which to start writing
   * @param {Number} length The number of bytes to mask.
   * @public
   */
  const mask = (source, mask, output, offset, length) => {
    for (var i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
  };

  /**
   * Unmasks a buffer using the given mask.
   *
   * @param {Buffer} buffer The buffer to unmask
   * @param {Buffer} mask The mask to use
   * @public
   */
  const unmask = (buffer, mask) => {
    // Required until https://github.com/nodejs/node/issues/9006 is resolved.
    const length = buffer.length;
    for (var i = 0; i < length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  };

  module.exports = { concat, mask, unmask };
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const safeBuffer = __webpack_require__(0);

const Buffer = safeBuffer.Buffer;

exports.BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
exports.GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
exports.EMPTY_BUFFER = Buffer.alloc(0);
exports.NOOP = () => {};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const EventEmitter = __webpack_require__(6);
const crypto = __webpack_require__(2);
const Ultron = __webpack_require__(7);
const https = __webpack_require__(18);
const http = __webpack_require__(8);
const url = __webpack_require__(9);

const PerMessageDeflate = __webpack_require__(1);
const EventTarget = __webpack_require__(26);
const Extensions = __webpack_require__(12);
const constants = __webpack_require__(4);
const Receiver = __webpack_require__(13);
const Sender = __webpack_require__(15);

const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000; // Allow 30 seconds to terminate the connection cleanly.

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {String} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor (address, protocols, options) {
    super();

    if (!protocols) {
      protocols = [];
    } else if (typeof protocols === 'string') {
      protocols = [protocols];
    } else if (!Array.isArray(protocols)) {
      options = protocols;
      protocols = [];
    }

    this.readyState = WebSocket.CONNECTING;
    this.bytesReceived = 0;
    this.extensions = {};
    this.protocol = '';

    this._binaryType = constants.BINARY_TYPES[0];
    this._finalize = this.finalize.bind(this);
    this._finalizeCalled = false;
    this._closeMessage = null;
    this._closeTimer = null;
    this._closeCode = null;
    this._receiver = null;
    this._sender = null;
    this._socket = null;
    this._ultron = null;

    if (Array.isArray(address)) {
      initAsServerClient.call(this, address[0], address[1], options);
    } else {
      initAsClient.call(this, address, protocols, options);
    }
  }

  get CONNECTING () { return WebSocket.CONNECTING; }
  get CLOSING () { return WebSocket.CLOSING; }
  get CLOSED () { return WebSocket.CLOSED; }
  get OPEN () { return WebSocket.OPEN; }

  /**
   * @type {Number}
   */
  get bufferedAmount () {
    var amount = 0;

    if (this._socket) {
      amount = this._socket.bufferSize + this._sender._bufferedBytes;
    }
    return amount;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the required
   * default "blob" type (instead we define a custom "nodebuffer" type).
   *
   * @type {String}
   */
  get binaryType () {
    return this._binaryType;
  }

  set binaryType (type) {
    if (constants.BINARY_TYPES.indexOf(type) < 0) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @private
   */
  setSocket (socket, head) {
    socket.setTimeout(0);
    socket.setNoDelay();

    this._receiver = new Receiver(this.extensions, this._maxPayload, this.binaryType);
    this._sender = new Sender(socket, this.extensions);
    this._ultron = new Ultron(socket);
    this._socket = socket;

    // socket cleanup handlers
    this._ultron.on('close', this._finalize);
    this._ultron.on('error', this._finalize);
    this._ultron.on('end', this._finalize);

    // ensure that the head is added to the receiver
    if (head.length > 0) socket.unshift(head);

    // subsequent packets are pushed to the receiver
    this._ultron.on('data', (data) => {
      this.bytesReceived += data.length;
      this._receiver.add(data);
    });

    // receiver event handlers
    this._receiver.onmessage = (data) => this.emit('message', data);
    this._receiver.onping = (data) => {
      this.pong(data, !this._isServer, true);
      this.emit('ping', data);
    };
    this._receiver.onpong = (data) => this.emit('pong', data);
    this._receiver.onclose = (code, reason) => {
      this._closeMessage = reason;
      this._closeCode = code;
      this.close(code, reason);
    };
    this._receiver.onerror = (error, code) => {
      // close the connection when the receiver reports a HyBi error code
      this.close(code, '');
      this.emit('error', error);
    };

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Clean up and release internal resources.
   *
   * @param {(Boolean|Error)} Indicates whether or not an error occurred
   * @private
   */
  finalize (error) {
    if (this._finalizeCalled) return;

    this.readyState = WebSocket.CLOSING;
    this._finalizeCalled = true;

    clearTimeout(this._closeTimer);
    this._closeTimer = null;

    //
    // If the connection was closed abnormally (with an error), or if the close
    // control frame was malformed or not received then the close code must be
    // 1006.
    //
    if (error) this._closeCode = 1006;

    if (this._socket) {
      this._ultron.destroy();
      this._socket.on('error', function onerror () {
        this.destroy();
      });

      if (!error) this._socket.end();
      else this._socket.destroy();

      this._receiver.cleanup(() => this.emitClose());

      this._receiver = null;
      this._sender = null;
      this._socket = null;
      this._ultron = null;
    } else {
      this.emitClose();
    }
  }

  /**
   * Emit the `close` event.
   *
   * @private
   */
  emitClose () {
    this.readyState = WebSocket.CLOSED;
    this.emit('close', this._closeCode || 1006, this._closeMessage || '');

    if (this.extensions[PerMessageDeflate.extensionName]) {
      this.extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this.extensions = null;

    this.removeAllListeners();
    this.on('error', constants.NOOP); // Catch all errors after this.
  }

  /**
   * Pause the socket stream.
   *
   * @public
   */
  pause () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.pause();
  }

  /**
   * Resume the socket stream
   *
   * @public
   */
  resume () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.resume();
  }

  /**
   * Start a closing handshake.
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close (code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeCode && this._socket) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      if (err) this.emit('error', err);

      if (this._socket) {
        if (this._closeCode) this._socket.end();
        //
        // Ensure that the connection is cleaned up even when the closing
        // handshake fails.
        //
        clearTimeout(this._closeTimer);
        this._closeTimer = setTimeout(this._finalize, closeTimeout, true);
      }
    });
  }

  /**
   * Send a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  ping (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  pong (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send (data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (this.readyState !== WebSocket.OPEN) {
      if (cb) cb(new Error('not opened'));
      else throw new Error('not opened');
      return;
    }

    if (typeof data === 'number') data = data.toString();

    const opts = Object.assign({
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true
    }, options);

    if (!this.extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || constants.EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate () {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    this.finalize(true);
  }
}

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get () {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set (listener) {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = EventTarget.addEventListener;
WebSocket.prototype.removeEventListener = EventTarget.removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket server client.
 *
 * @param {http.IncomingMessage} req The request object
 * @param {net.Socket} socket The network socket between the server and client
 * @param {Buffer} head The first packet of the upgraded stream
 * @param {Object} options WebSocket attributes
 * @param {Number} options.protocolVersion The WebSocket protocol version
 * @param {Object} options.extensions The negotiated extensions
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {String} options.protocol The chosen subprotocol
 * @private
 */
function initAsServerClient (socket, head, options) {
  this.protocolVersion = options.protocolVersion;
  this._maxPayload = options.maxPayload;
  this.extensions = options.extensions;
  this.protocol = options.protocol;

  this._isServer = true;

  this.setSocket(socket, head);
}

/**
 * Initialize a WebSocket client.
 *
 * @param {String} address The URL to which to connect
 * @param {String[]} protocols The list of subprotocols
 * @param {Object} options Connection options
 * @param {String} options.protocol Value of the `Sec-WebSocket-Protocol` header
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the handshake request
 * @param {String} options.localAddress Local interface to bind for network connections
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version` header
 * @param {Object} options.headers An object containing request headers
 * @param {String} options.origin Value of the `Origin` or `Sec-WebSocket-Origin` header
 * @param {http.Agent} options.agent Use the specified Agent
 * @param {String} options.host Value of the `Host` header
 * @param {Number} options.family IP address family to use during hostname lookup (4 or 6).
 * @param {Function} options.checkServerIdentity A function to validate the server hostname
 * @param {Boolean} options.rejectUnauthorized Verify or not the server certificate
 * @param {String} options.passphrase The passphrase for the private key or pfx
 * @param {String} options.ciphers The ciphers to use or exclude
 * @param {String} options.ecdhCurve The curves for ECDH key agreement to use or exclude
 * @param {(String|String[]|Buffer|Buffer[])} options.cert The certificate key
 * @param {(String|String[]|Buffer|Buffer[])} options.key The private key
 * @param {(String|Buffer)} options.pfx The private key, certificate, and CA certs
 * @param {(String|String[]|Buffer|Buffer[])} options.ca Trusted certificates
 * @private
 */
function initAsClient (address, protocols, options) {
  options = Object.assign({
    protocolVersion: protocolVersions[1],
    protocol: protocols.join(','),
    perMessageDeflate: true,
    handshakeTimeout: null,
    localAddress: null,
    headers: null,
    family: null,
    origin: null,
    agent: null,
    host: null,

    //
    // SSL options.
    //
    checkServerIdentity: null,
    rejectUnauthorized: null,
    passphrase: null,
    ciphers: null,
    ecdhCurve: null,
    cert: null,
    key: null,
    pfx: null,
    ca: null
  }, options);

  if (protocolVersions.indexOf(options.protocolVersion) === -1) {
    throw new Error(
      `unsupported protocol version: ${options.protocolVersion} ` +
      `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  this.protocolVersion = options.protocolVersion;
  this._isServer = false;
  this.url = address;

  const serverUrl = url.parse(address);
  const isUnixSocket = serverUrl.protocol === 'ws+unix:';

  if (!serverUrl.host && (!isUnixSocket || !serverUrl.path)) {
    throw new Error('invalid url');
  }

  const isSecure = serverUrl.protocol === 'wss:' || serverUrl.protocol === 'https:';
  const key = crypto.randomBytes(16).toString('base64');
  const httpObj = isSecure ? https : http;

  //
  // Prepare extensions.
  //
  const extensionsOffer = {};
  var perMessageDeflate;

  if (options.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      options.perMessageDeflate !== true ? options.perMessageDeflate : {},
      false
    );
    extensionsOffer[PerMessageDeflate.extensionName] = perMessageDeflate.offer();
  }

  const requestOptions = {
    port: serverUrl.port || (isSecure ? 443 : 80),
    host: serverUrl.hostname,
    path: '/',
    headers: {
      'Sec-WebSocket-Version': options.protocolVersion,
      'Sec-WebSocket-Key': key,
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  if (options.headers) Object.assign(requestOptions.headers, options.headers);
  if (Object.keys(extensionsOffer).length) {
    requestOptions.headers['Sec-WebSocket-Extensions'] = Extensions.format(extensionsOffer);
  }
  if (options.protocol) {
    requestOptions.headers['Sec-WebSocket-Protocol'] = options.protocol;
  }
  if (options.origin) {
    if (options.protocolVersion < 13) {
      requestOptions.headers['Sec-WebSocket-Origin'] = options.origin;
    } else {
      requestOptions.headers.Origin = options.origin;
    }
  }
  if (options.host) requestOptions.headers.Host = options.host;
  if (serverUrl.auth) requestOptions.auth = serverUrl.auth;

  if (options.localAddress) requestOptions.localAddress = options.localAddress;
  if (options.family) requestOptions.family = options.family;

  if (isUnixSocket) {
    const parts = serverUrl.path.split(':');

    requestOptions.socketPath = parts[0];
    requestOptions.path = parts[1];
  } else if (serverUrl.path) {
    //
    // Make sure that path starts with `/`.
    //
    if (serverUrl.path.charAt(0) !== '/') {
      requestOptions.path = `/${serverUrl.path}`;
    } else {
      requestOptions.path = serverUrl.path;
    }
  }

  var agent = options.agent;

  //
  // A custom agent is required for these options.
  //
  if (
    options.rejectUnauthorized != null ||
    options.checkServerIdentity ||
    options.passphrase ||
    options.ciphers ||
    options.ecdhCurve ||
    options.cert ||
    options.key ||
    options.pfx ||
    options.ca
  ) {
    if (options.passphrase) requestOptions.passphrase = options.passphrase;
    if (options.ciphers) requestOptions.ciphers = options.ciphers;
    if (options.ecdhCurve) requestOptions.ecdhCurve = options.ecdhCurve;
    if (options.cert) requestOptions.cert = options.cert;
    if (options.key) requestOptions.key = options.key;
    if (options.pfx) requestOptions.pfx = options.pfx;
    if (options.ca) requestOptions.ca = options.ca;
    if (options.checkServerIdentity) {
      requestOptions.checkServerIdentity = options.checkServerIdentity;
    }
    if (options.rejectUnauthorized != null) {
      requestOptions.rejectUnauthorized = options.rejectUnauthorized;
    }

    if (!agent) agent = new httpObj.Agent(requestOptions);
  }

  if (agent) requestOptions.agent = agent;

  this._req = httpObj.get(requestOptions);

  if (options.handshakeTimeout) {
    this._req.setTimeout(options.handshakeTimeout, () => {
      this._req.abort();
      this.emit('error', new Error('opening handshake has timed out'));
      this.finalize(true);
    });
  }

  this._req.on('error', (error) => {
    if (this._req.aborted) return;

    this._req = null;
    this.emit('error', error);
    this.finalize(true);
  });

  this._req.on('response', (res) => {
    if (!this.emit('unexpected-response', this._req, res)) {
      this._req.abort();
      this.emit('error', new Error(`unexpected server response (${res.statusCode})`));
      this.finalize(true);
    }
  });

  this._req.on('upgrade', (res, socket, head) => {
    this.emit('headers', res.headers, res);

    //
    // The user may have closed the connection from a listener of the `headers`
    // event.
    //
    if (this.readyState !== WebSocket.CONNECTING) return;

    this._req = null;

    const digest = crypto.createHash('sha1')
      .update(key + constants.GUID, 'binary')
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      socket.destroy();
      this.emit('error', new Error('invalid server key'));
      return this.finalize(true);
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (options.protocol || '').split(/, */);
    var protError;

    if (!options.protocol && serverProt) {
      protError = 'server sent a subprotocol even though none requested';
    } else if (options.protocol && !serverProt) {
      protError = 'server sent no subprotocol even though requested';
    } else if (serverProt && protList.indexOf(serverProt) === -1) {
      protError = 'server responded with an invalid protocol';
    }

    if (protError) {
      socket.destroy();
      this.emit('error', new Error(protError));
      return this.finalize(true);
    }

    if (serverProt) this.protocol = serverProt;

    const serverExtensions = Extensions.parse(res.headers['sec-websocket-extensions']);

    if (perMessageDeflate && serverExtensions[PerMessageDeflate.extensionName]) {
      try {
        perMessageDeflate.accept(serverExtensions[PerMessageDeflate.extensionName]);
      } catch (err) {
        socket.destroy();
        this.emit('error', new Error('invalid extension parameter'));
        return this.finalize(true);
      }

      this.extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
    }

    this.setSocket(socket, head);
  });
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * An auto incrementing id which we can use to create "unique" Ultron instances
 * so we can track the event emitters that are added through the Ultron
 * interface.
 *
 * @type {Number}
 * @private
 */
var id = 0;

/**
 * Ultron is high-intelligence robot. It gathers intelligence so it can start improving
 * upon his rudimentary design. It will learn from your EventEmitting patterns
 * and exterminate them.
 *
 * @constructor
 * @param {EventEmitter} ee EventEmitter instance we need to wrap.
 * @api public
 */
function Ultron(ee) {
  if (!(this instanceof Ultron)) return new Ultron(ee);

  this.id = id++;
  this.ee = ee;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.on = function on(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.on(event, fn, context);

  return this;
};
/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.once = function once(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.once(event, fn, context);

  return this;
};

/**
 * Remove the listeners we assigned for the given event.
 *
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.remove = function remove() {
  var args = arguments
    , ee = this.ee
    , event;

  //
  // When no event names are provided we assume that we need to clear all the
  // events that were assigned through us.
  //
  if (args.length === 1 && 'string' === typeof args[0]) {
    args = args[0].split(/[, ]+/);
  } else if (!args.length) {
    if (ee.eventNames) {
      args = ee.eventNames();
    } else if (ee._events) {
      args = [];

      for (event in ee._events) {
        if (has.call(ee._events, event)) args.push(event);
      }

      if (Object.getOwnPropertySymbols) {
        args = args.concat(Object.getOwnPropertySymbols(ee._events));
      }
    }
  }

  for (var i = 0; i < args.length; i++) {
    var listeners = ee.listeners(args[i]);

    for (var j = 0; j < listeners.length; j++) {
      event = listeners[j];

      //
      // Once listeners have a `listener` property that stores the real listener
      // in the EventEmitter that ships with Node.js.
      //
      if (event.listener) {
        if (event.listener.__ultron !== this.id) continue;
        delete event.listener.__ultron;
      } else {
        if (event.__ultron !== this.id) continue;
        delete event.__ultron;
      }

      ee.removeListener(args[i], event);
    }
  }

  return this;
};

/**
 * Destroy the Ultron instance, remove all listeners and release all references.
 *
 * @returns {Boolean}
 * @api public
 */
Ultron.prototype.destroy = function destroy() {
  if (!this.ee) return false;

  this.remove();
  this.ee = null;

  return true;
};

//
// Expose the module.
//
module.exports = Ultron;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__filename) {
/**
 * Module dependencies.
 */

var fs = __webpack_require__(23)
  , path = __webpack_require__(24)
  , join = path.join
  , dirname = path.dirname
  , exists = ((fs.accessSync && function (path) { try { fs.accessSync(path); } catch (e) { return false; } return true; })
      || fs.existsSync || path.existsSync)
  , defaults = {
        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
      , platform: process.platform
      , arch: process.arch
      , version: process.versions.node
      , bindings: 'bindings.node'
      , try: [
          // node-gyp's linked version in the "build" dir
          [ 'module_root', 'build', 'bindings' ]
          // node-waf and gyp_addon (a.k.a node-gyp)
        , [ 'module_root', 'build', 'Debug', 'bindings' ]
        , [ 'module_root', 'build', 'Release', 'bindings' ]
          // Debug files, for development (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Debug', 'bindings' ]
        , [ 'module_root', 'Debug', 'bindings' ]
          // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        , [ 'module_root', 'out', 'Release', 'bindings' ]
        , [ 'module_root', 'Release', 'bindings' ]
          // Legacy from node-waf, node <= 0.4.x
        , [ 'module_root', 'build', 'default', 'bindings' ]
          // Production "Release" buildtype binary (meh...)
        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
        ]
    }

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings (opts) {

  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts }
  } else if (!opts) {
    opts = {}
  }

  // maps `defaults` onto `opts` object
  Object.keys(defaults).map(function(i) {
    if (!(i in opts)) opts[i] = defaults[i];
  });

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName())
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node'
  }

  var tries = []
    , i = 0
    , l = opts.try.length
    , n
    , b
    , err

  for (; i<l; i++) {
    n = join.apply(null, opts.try[i].map(function (p) {
      return opts[p] || p
    }))
    tries.push(n)
    try {
      b = opts.path ? /*require.resolve*/(!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())) : !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())
      if (!opts.path) {
        b.path = n
      }
      return b
    } catch (e) {
      if (!/not find/i.test(e.message)) {
        throw e
      }
    }
  }

  err = new Error('Could not locate the bindings file. Tried:\n'
    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
  err.tries = tries
  throw err
}
module.exports = exports = bindings


/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName (calling_file) {
  var origPST = Error.prepareStackTrace
    , origSTL = Error.stackTraceLimit
    , dummy = {}
    , fileName

  Error.stackTraceLimit = 10

  Error.prepareStackTrace = function (e, st) {
    for (var i=0, l=st.length; i<l; i++) {
      fileName = st[i].getFileName()
      if (fileName !== __filename) {
        if (calling_file) {
            if (fileName !== calling_file) {
              return
            }
        } else {
          return
        }
      }
    }
  }

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy)
  dummy.stack

  // cleanup
  Error.prepareStackTrace = origPST
  Error.stackTraceLimit = origSTL

  return fileName
}

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot (file) {
  var dir = dirname(file)
    , prev
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd()
    }
    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir
    }
    if (prev === dir) {
      // Got to the top
      throw new Error('Could not find module root given file: "' + file
                    + '". Do you have a `package.json` file? ')
    }
    // Try the parent dir next
    prev = dir
    dir = join(dir, '..')
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, "/index.js"))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 11;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Parse the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} value field value of the header
 * @return {Object} The parsed object
 * @public
 */
const parse = (value) => {
  value = value || '';

  const extensions = {};

  value.split(',').forEach((v) => {
    const params = v.split(';');
    const token = params.shift().trim();

    if (extensions[token] === undefined) {
      extensions[token] = [];
    } else if (!extensions.hasOwnProperty(token)) {
      return;
    }

    const parsedParams = {};

    params.forEach((param) => {
      const parts = param.trim().split('=');
      const key = parts[0];
      var value = parts[1];

      if (value === undefined) {
        value = true;
      } else {
        // unquote value
        if (value[0] === '"') {
          value = value.slice(1);
        }
        if (value[value.length - 1] === '"') {
          value = value.slice(0, value.length - 1);
        }
      }

      if (parsedParams[key] === undefined) {
        parsedParams[key] = [value];
      } else if (parsedParams.hasOwnProperty(key)) {
        parsedParams[key].push(value);
      }
    });

    extensions[token].push(parsedParams);
  });

  return extensions;
};

/**
 * Serialize a parsed `Sec-WebSocket-Extensions` header to a string.
 *
 * @param {Object} value The object to format
 * @return {String} A string representing the given value
 * @public
 */
const format = (value) => {
  return Object.keys(value).map((token) => {
    var paramsList = value[token];
    if (!Array.isArray(paramsList)) paramsList = [paramsList];
    return paramsList.map((params) => {
      return [token].concat(Object.keys(params).map((k) => {
        var p = params[k];
        if (!Array.isArray(p)) p = [p];
        return p.map((v) => v === true ? k : `${k}=${v}`).join('; ');
      })).join('; ');
    }).join(', ');
  }).join(', ');
};

module.exports = { format, parse };


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(0);

const PerMessageDeflate = __webpack_require__(1);
const isValidUTF8 = __webpack_require__(27);
const bufferUtil = __webpack_require__(3);
const ErrorCodes = __webpack_require__(14);
const constants = __webpack_require__(4);

const Buffer = safeBuffer.Buffer;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 */
class Receiver {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   * @param {String} binaryType The type for binary data
   */
  constructor (extensions, maxPayload, binaryType) {
    this._binaryType = binaryType || constants.BINARY_TYPES[0];
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._mask = null;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._cleanupCallback = null;
    this._hadError = false;
    this._dead = false;
    this._loop = false;

    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.onping = null;
    this.onpong = null;

    this._state = GET_INFO;
  }

  /**
   * Consumes bytes from the available buffered data.
   *
   * @param {Number} bytes The number of bytes to consume
   * @return {Buffer} Consumed bytes
   * @private
   */
  readBuffer (bytes) {
    var offset = 0;
    var dst;
    var l;

    this._bufferedBytes -= bytes;

    if (bytes === this._buffers[0].length) return this._buffers.shift();

    if (bytes < this._buffers[0].length) {
      dst = this._buffers[0].slice(0, bytes);
      this._buffers[0] = this._buffers[0].slice(bytes);
      return dst;
    }

    dst = Buffer.allocUnsafe(bytes);

    while (bytes > 0) {
      l = this._buffers[0].length;

      if (bytes >= l) {
        this._buffers[0].copy(dst, offset);
        offset += l;
        this._buffers.shift();
      } else {
        this._buffers[0].copy(dst, offset, 0, bytes);
        this._buffers[0] = this._buffers[0].slice(bytes);
      }

      bytes -= l;
    }

    return dst;
  }

  /**
   * Checks if the number of buffered bytes is bigger or equal than `n` and
   * calls `cleanup` if necessary.
   *
   * @param {Number} n The number of bytes to check against
   * @return {Boolean} `true` if `bufferedBytes >= n`, else `false`
   * @private
   */
  hasBufferedBytes (n) {
    if (this._bufferedBytes >= n) return true;

    this._loop = false;
    if (this._dead) this.cleanup(this._cleanupCallback);
    return false;
  }

  /**
   * Adds new data to the parser.
   *
   * @public
   */
  add (data) {
    if (this._dead) return;

    this._bufferedBytes += data.length;
    this._buffers.push(data);
    this.startLoop();
  }

  /**
   * Starts the parsing loop.
   *
   * @private
   */
  startLoop () {
    this._loop = true;

    while (this._loop) {
      switch (this._state) {
        case GET_INFO:
          this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          this.getData();
          break;
        default: // `INFLATING`
          this._loop = false;
      }
    }
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @private
   */
  getInfo () {
    if (!this.hasBufferedBytes(2)) return;

    const buf = this.readBuffer(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this.error(new Error('RSV2 and RSV3 must be clear'), 1002);
      return;
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this.error(new Error('RSV1 must be clear'), 1002);
      return;
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (!this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      } else {
        this._opcode = this._fragmented;
      }
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this.error(new Error('FIN must be set'), 1002);
        return;
      }

      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (this._payloadLength > 0x7d) {
        this.error(new Error('invalid payload length'), 1002);
        return;
      }
    } else {
      this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
      return;
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;

    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @private
   */
  getPayloadLength16 () {
    if (!this.hasBufferedBytes(2)) return;

    this._payloadLength = this.readBuffer(2).readUInt16BE(0, true);
    this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @private
   */
  getPayloadLength64 () {
    if (!this.hasBufferedBytes(8)) return;

    const buf = this.readBuffer(8);
    const num = buf.readUInt32BE(0, true);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this.error(new Error('max payload size exceeded'), 1009);
      return;
    }

    this._payloadLength = (num * Math.pow(2, 32)) + buf.readUInt32BE(4, true);
    this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @private
   */
  haveLength () {
    if (this._opcode < 0x08 && this.maxPayloadExceeded(this._payloadLength)) {
      return;
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask () {
    if (!this.hasBufferedBytes(4)) return;

    this._mask = this.readBuffer(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @private
   */
  getData () {
    var data = constants.EMPTY_BUFFER;

    if (this._payloadLength) {
      if (!this.hasBufferedBytes(this._payloadLength)) return;

      data = this.readBuffer(this._payloadLength);
      if (this._masked) bufferUtil.unmask(data, this._mask);
    }

    if (this._opcode > 0x07) {
      this.controlMessage(data);
    } else if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data);
    } else if (this.pushFragment(data)) {
      this.dataMessage();
    }
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @private
   */
  decompress (data) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) {
        this.error(err, err.closeCode === 1009 ? 1009 : 1007);
        return;
      }

      if (this.pushFragment(buf)) this.dataMessage();
      this.startLoop();
    });
  }

  /**
   * Handles a data message.
   *
   * @private
   */
  dataMessage () {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        var data;

        if (this._binaryType === 'nodebuffer') {
          data = toBuffer(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(toBuffer(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.onmessage(data);
      } else {
        const buf = toBuffer(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onmessage(buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @private
   */
  controlMessage (data) {
    if (this._opcode === 0x08) {
      if (data.length === 0) {
        this.onclose(1000, '');
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      } else if (data.length === 1) {
        this.error(new Error('invalid payload length'), 1002);
      } else {
        const code = data.readUInt16BE(0, true);

        if (!ErrorCodes.isValidErrorCode(code)) {
          this.error(new Error(`invalid status code: ${code}`), 1002);
          return;
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onclose(code, buf.toString());
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      }

      return;
    }

    if (this._opcode === 0x09) this.onping(data);
    else this.onpong(data);

    this._state = GET_INFO;
  }

  /**
   * Handles an error.
   *
   * @param {Error} err The error
   * @param {Number} code Close code
   * @private
   */
  error (err, code) {
    this.onerror(err, code);
    this._hadError = true;
    this._loop = false;
    this.cleanup(this._cleanupCallback);
  }

  /**
   * Checks payload size, disconnects socket when it exceeds `maxPayload`.
   *
   * @param {Number} length Payload length
   * @private
   */
  maxPayloadExceeded (length) {
    if (length === 0 || this._maxPayload < 1) return false;

    const fullLength = this._totalPayloadLength + length;

    if (fullLength <= this._maxPayload) {
      this._totalPayloadLength = fullLength;
      return false;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return true;
  }

  /**
   * Appends a fragment in the fragments array after checking that the sum of
   * fragment lengths does not exceed `maxPayload`.
   *
   * @param {Buffer} fragment The fragment to add
   * @return {Boolean} `true` if `maxPayload` is not exceeded, else `false`
   * @private
   */
  pushFragment (fragment) {
    if (fragment.length === 0) return true;

    const totalLength = this._messageLength + fragment.length;

    if (this._maxPayload < 1 || totalLength <= this._maxPayload) {
      this._messageLength = totalLength;
      this._fragments.push(fragment);
      return true;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return false;
  }

  /**
   * Releases resources used by the receiver.
   *
   * @param {Function} cb Callback
   * @public
   */
  cleanup (cb) {
    this._dead = true;

    if (!this._hadError && (this._loop || this._state === INFLATING)) {
      this._cleanupCallback = cb;
    } else {
      this._extensions = null;
      this._fragments = null;
      this._buffers = null;
      this._mask = null;

      this._cleanupCallback = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;
      this.onping = null;
      this.onpong = null;

      if (cb) cb();
    }
  }
}

module.exports = Receiver;

/**
 * Makes a buffer from a list of fragments.
 *
 * @param {Buffer[]} fragments The list of fragments composing the message
 * @param {Number} messageLength The length of the message
 * @return {Buffer}
 * @private
 */
function toBuffer (fragments, messageLength) {
  if (fragments.length === 1) return fragments[0];
  if (fragments.length > 1) return bufferUtil.concat(fragments, messageLength);
  return constants.EMPTY_BUFFER;
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 */
function toArrayBuffer (buf) {
  if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



module.exports = {
  isValidErrorCode: function (code) {
    return (code >= 1000 && code <= 1013 && code !== 1004 && code !== 1005 && code !== 1006) ||
      (code >= 3000 && code <= 4999);
  },
  1000: 'normal',
  1001: 'going away',
  1002: 'protocol error',
  1003: 'unsupported data',
  1004: 'reserved',
  1005: 'reserved for extensions',
  1006: 'reserved for extensions',
  1007: 'inconsistent or invalid data',
  1008: 'policy violation',
  1009: 'message too big',
  1010: 'extension handshake missing',
  1011: 'an unexpected condition prevented the request from being fulfilled',
  1012: 'service restart',
  1013: 'try again later'
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(0);
const crypto = __webpack_require__(2);

const PerMessageDeflate = __webpack_require__(1);
const bufferUtil = __webpack_require__(3);
const ErrorCodes = __webpack_require__(14);

const Buffer = safeBuffer.Buffer;

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor (socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame (data, options) {
    const merge = data.length < 1024 || (options.mask && options.readOnly);
    var offset = options.mask ? 6 : 2;
    var payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2, true);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2, true);
      target.writeUInt32BE(data.length, 6, true);
    }

    if (!options.mask) {
      target[1] = payloadLength;
      if (merge) {
        data.copy(target, offset);
        return [target];
      }

      return [target, data];
    }

    const mask = crypto.randomBytes(4);

    target[1] = payloadLength | 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      bufferUtil.mask(data, mask, target, offset, data.length);
      return [target];
    }

    bufferUtil.mask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close (code, data, mask, cb) {
    if (code !== undefined && (typeof code !== 'number' || !ErrorCodes.isValidErrorCode(code))) {
      throw new Error('first argument must be a valid error code number');
    }

    const buf = Buffer.allocUnsafe(2 + (data ? Buffer.byteLength(data) : 0));

    buf.writeUInt16BE(code || 1000, 0, true);
    if (buf.length > 2) buf.write(data, 2);

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose (data, mask, cb) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x08,
      mask,
      readOnly: false
    }), cb);
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  ping (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPing, data, mask, readOnly]);
    } else {
      this.doPing(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPing (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x09,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  pong (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPong, data, mask, readOnly]);
    } else {
      this.doPong(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPong (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x0a,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send (data, options, cb) {
    var opcode = options.binary ? 2 : 1;
    var rsv1 = options.compress;
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = data.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(Sender.frame(data, {
        fin: options.fin,
        rsv1: false,
        opcode,
        mask: options.mask,
        readOnly
      }), cb);
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch (data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this._deflating = false;
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue () {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      params[0].apply(this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue (params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame (list, cb) {
    if (list.length === 2) {
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer (view) {
  const buf = Buffer.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}


/***/ }),
/* 16 */
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

exports.default = activate;

var _ws = __webpack_require__(17);

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertxProtoStub = function () {
  /* private
    _continuousOpen: boolean
     _runtimeProtoStubURL: string
    _bus: MiniBus
    _msgCallback: (Message) => void
    _config: { url, runtimeURL }
     _sock: (WebSocket | SockJS)
    _reOpen: boolean
  */

  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {VertxProtoStub}
   */
  function VertxProtoStub(runtimeProtoStubURL, bus, config) {
    var _this2 = this;

    _classCallCheck(this, VertxProtoStub);

    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    if (!config.url) throw new Error('The config.url is a needed parameter');
    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');

    var _this = this;

    this._id = 0;
    this._continuousOpen = true;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._runtimeSessionURL = config.runtimeURL;
    this._reOpen = false;

    bus.addListener('*', function (msg) {
      console.log('[VertxProtoStub] outgoing message: ', msg);
      _this._open(function () {
        if (_this._filter(msg)) {
          if (!msg.body) {
            msg.body = {};
          }
          msg.body.via = _this2._runtimeProtoStubURL;
          console.log('[VertxProtoStub: ProtoStub -> MN]', msg);
          _this._sock.send(JSON.stringify(msg));
        }
      });
    });

    _this._sendStatus('created');
  }

  /**
   * Get the configuration for this ProtoStub
   * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   */


  _createClass(VertxProtoStub, [{
    key: 'connect',


    /**
     * Try to open the connection to the MessageNode. Connection is auto managed, there is no need to call this explicitly.
     * However, if "disconnect()" is called, it's necessary to call this to enable connections again.
     * A status message is sent to "runtimeProtoStubURL/status", containing the value "connected" if successful, or "disconnected" if some error occurs.
     */
    value: function connect() {
      var _this = this;

      _this._continuousOpen = true;
      _this._open(function () {});
    }

    /**
     * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless "connect()" is called.
     * A status message is sent to "runtimeProtoStubURL/status" with value "disconnected".
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      _this._continuousOpen = false;
      if (_this._sock) {
        _this._sendClose();
      }
    }

    //todo: add documentation

  }, {
    key: '_sendOpen',
    value: function _sendOpen(callback) {
      var _this = this;

      this._sendStatus('in-progress');

      _this._id++;
      var msg = {
        id: _this._id, type: 'open', from: _this._runtimeSessionURL, to: 'mn:/session'
      };

      if (_this._reOpen) {
        msg.type = 're-open';
      }

      //register and wait for open reply...
      var hasResponse = false;
      _this._sessionCallback = function (reply) {
        if (reply.type === 'response' & reply.id === msg.id) {
          hasResponse = true;
          if (reply.body.code === 200) {
            if (reply.body.runtimeToken) {
              //setup runtimeSession
              _this._reOpen = true;
              _this._runtimeSessionURL = _this._config.runtimeURL + '/' + reply.body.runtimeToken;
            }

            _this._sendStatus('live');
            callback();
          } else {
            _this._sendStatus('failed', reply.body.desc);
          }
        }
      };

      _this._sock.send(JSON.stringify(msg));
      setTimeout(function () {
        if (!hasResponse) {
          //no response after x seconds...
          _this._sendStatus('disconnected', 'Timeout from mn:/session');
        }
      }, 3000);
    }
  }, {
    key: '_sendClose',
    value: function _sendClose() {
      var _this = this;

      _this._id++;
      var msg = {
        id: _this._id, type: 'close', from: _this._runtimeSessionURL, to: 'mn:/session'
      };

      //invalidate runtimeSession
      _this._reOpen = false;
      _this._runtimeSessionURL = _this._config._runtimeURL;

      _this._sock.send(JSON.stringify(msg));
    }
  }, {
    key: '_sendStatus',
    value: function _sendStatus(value, reason) {
      var _this = this;

      console.log('[VertxProtostub status changed] to ', value);

      _this._state = value;

      var msg = {
        type: 'update',
        from: _this._runtimeProtoStubURL,
        to: _this._runtimeProtoStubURL + '/status',
        body: {
          value: value
        }
      };

      if (reason) {
        msg.body.desc = reason;
      }

      _this._bus.postMessage(msg);
    }
  }, {
    key: '_waitReady',
    value: function _waitReady(callback) {
      var _this = this;

      if (_this._sock.readyState === 1) {
        callback();
      } else {
        setTimeout(function () {
          _this._waitReady(callback);
        });
      }
    }
  }, {
    key: '_filter',
    value: function _filter(msg) {
      if (msg.body && msg.body.via === this._runtimeProtoStubURL) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: '_deliver',
    value: function _deliver(msg) {
      if (!msg.body) msg.body = {};

      msg.body.via = this._runtimeProtoStubURL;
      console.log('[VertxProtoStub: MN -> ProtoStub]', msg);
      this._bus.postMessage(msg);
    }

    // add documentation

  }, {
    key: '_open',
    value: function _open(callback) {
      var _this = this;

      if (!this._continuousOpen) {
        //TODO: send status (sent message error - disconnected)
        return;
      }

      if (!_this._sock) {
        if (_this._config.url.substring(0, 2) === 'ws') {
          _this._sock = new _ws2.default(_this._config.url);
        } else {
          _this._sock = new SockJS(_this._config.url);
        }

        _this._sock.onopen = function () {
          _this._sendOpen(function () {
            callback();
          });
        };

        _this._sock.onmessage = function (e) {
          var msg = JSON.parse(e.data);
          console.log('[VertxProtoStub: MN -> SOCKET ON MESSAGE]', msg);
          if (msg.from === 'mn:/session') {
            if (_this._sessionCallback) {
              _this._sessionCallback(msg);
            }
          } else {
            if (_this._filter(msg)) {
              _this._deliver(msg);
            }
          }
        };

        _this._sock.onclose = function (event) {
          var reason = void 0;

          //See https://tools.ietf.org/html/rfc6455#section-7.4
          if (event.code === 1000) {
            reason = 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
          } else if (event.code === 1001) {
            reason = 'An endpoint is \'going away\', such as a server going down or a browser having navigated away from a page.';
          } else if (event.code === 1002) {
            reason = 'An endpoint is terminating the connection due to a protocol error';
          } else if (event.code === 1003) {
            reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
          } else if (event.code === 1004) {
            reason = 'Reserved. The specific meaning might be defined in the future.';
          } else if (event.code === 1005) {
            reason = 'No status code was actually present.';
          } else if (event.code === 1006) {
            reason = 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
          } else if (event.code === 1007) {
            reason = 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
          } else if (event.code === 1008) {
            reason = 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
          } else if (event.code === 1009) {
            reason = 'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
          } else if (event.code === 1010) {
            reason = 'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' + event.reason;
          } else if (event.code === 1011) {
            reason = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
          } else if (event.code === 1015) {
            reason = 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
          } else {
            reason = 'Unknown reason';
          }

          delete _this._sock;
          _this._sendStatus('disconnected', reason);
        };
      } else {
        _this._waitReady(callback);
      }
    }
  }, {
    key: 'config',
    get: function get() {
      return this._config;
    }
  }, {
    key: 'runtimeSession',
    get: function get() {
      return this._runtimeSessionURL;
    }
  }]);

  return VertxProtoStub;
}();

function activate(url, bus, config) {
  return {
    name: 'VertxProtoStub',
    instance: new VertxProtoStub(url, bus, config)
  };
}

/**
* Callback used to send messages
* @callback PostMessage
* @param {Message} msg - Message to send
*/

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const WebSocket = __webpack_require__(5);

WebSocket.Server = __webpack_require__(30);
WebSocket.Receiver = __webpack_require__(13);
WebSocket.Sender = __webpack_require__(15);

module.exports = WebSocket;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Queue(options) {
  if (!(this instanceof Queue)) {
    return new Queue(options);
  }

  options = options || {};
  this.concurrency = options.concurrency || Infinity;
  this.pending = 0;
  this.jobs = [];
  this.cbs = [];
  this._done = done.bind(this);
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
];

arrayAddMethods.forEach(function(method) {
  Queue.prototype[method] = function() {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments);
    this._run();
    return methodResult;
  };
});

Object.defineProperty(Queue.prototype, 'length', {
  get: function() {
    return this.pending + this.jobs.length;
  }
});

Queue.prototype._run = function() {
  if (this.pending === this.concurrency) {
    return;
  }
  if (this.jobs.length) {
    var job = this.jobs.shift();
    this.pending++;
    job(this._done);
    this._run();
  }

  if (this.pending === 0) {
    while (this.cbs.length !== 0) {
      var cb = this.cbs.pop();
      process.nextTick(cb);
    }
  }
};

Queue.prototype.onDone = function(cb) {
  if (typeof cb === 'function') {
    this.cbs.push(cb);
    this._run();
  }
};

function done() {
  this.pending--;
  this._run();
}

module.exports = Queue;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


try {
  module.exports = __webpack_require__(10)('bufferutil');
} catch (e) {
  module.exports = __webpack_require__(25);
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * bufferutil: WebSocket buffer utils
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
const mask = (source, mask, output, offset, length) => {
  for (var i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
};

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
const unmask = (buffer, mask) => {
  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
  const length = buffer.length;
  for (var i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
};

module.exports = { mask, unmask };


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor (type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (code, reason, target) {
    super('close', target);

    this.wasClean = code === undefined || code === 1000 || (code >= 3000 && code <= 4999);
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (target) {
    super('open', target);
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener (method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage (data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose (code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError (event) {
      event.type = 'error';
      event.target = this;
      listener.call(this, event);
    }

    function onOpen () {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener (method, listener) {
    const listeners = this.listeners(method);

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



try {
  const isValidUTF8 = __webpack_require__(28);

  module.exports = typeof isValidUTF8 === 'object'
    ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
    : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  module.exports = () => true;
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


try {
  module.exports = __webpack_require__(10)('validation');
} catch (e) {
  module.exports = __webpack_require__(29);
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * UTF-8 validate: UTF-8 validation for WebSockets.
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
const isValidUTF8 = (buf) => {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError('First argument needs to be a buffer');
  }

  var len = buf.length;
  var i = 0;

  while (i < len) {
    if (buf[i] < 0x80) {  // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0  // overlong
      ) {
        return false;
      } else {
        i += 2;
      }
    } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong
        buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0     // surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      } else {
        i += 3;
      }
    } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong
        buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF
      ) {
        return false;
      } else {
        i += 4;
      }
    } else {
      return false;
    }
  }

  return true;
};

module.exports = isValidUTF8;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(0);
const EventEmitter = __webpack_require__(6);
const crypto = __webpack_require__(2);
const Ultron = __webpack_require__(7);
const http = __webpack_require__(8);
const url = __webpack_require__(9);

const PerMessageDeflate = __webpack_require__(1);
const Extensions = __webpack_require__(12);
const constants = __webpack_require__(4);
const WebSocket = __webpack_require__(5);

const Buffer = safeBuffer.Buffer;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient An hook to reject connections
   * @param {Function} options.handleProtocols An hook to handle protocols
   * @param {String} options.path Accept only connections matching this path
   * @param {Boolean} options.noServer Enable no server mode
   * @param {Boolean} options.clientTracking Specifies whether or not to track clients
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Function} callback A listener for the `listening` event
   */
  constructor (options, callback) {
    super();

    options = Object.assign({
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null
    }, options);

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError('missing or invalid options');
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.allowHalfOpen = false;
      this._server.listen(options.port, options.host, options.backlog, callback);
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      this._ultron = new Ultron(this._server);
      this._ultron.on('listening', () => this.emit('listening'));
      this._ultron.on('error', (err) => this.emit('error', err));
      this._ultron.on('upgrade', (req, socket, head) => {
        this.handleUpgrade(req, socket, head, (client) => {
          this.emit('connection', client, req);
        });
      });
    }

    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close (cb) {
    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._ultron.destroy();
      this._ultron = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) return server.close(cb);
    }

    if (cb) cb();
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle (req) {
    if (this.options.path && url.parse(req.url).pathname !== this.options.path) {
      return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade (req, socket, head, cb) {
    socket.on('error', socketError);

    const version = +req.headers['sec-websocket-version'];

    if (
      req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortConnection(socket, 400);
    }

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);

    //
    // Optionally call external protocol selection handler.
    //
    if (this.options.handleProtocols) {
      protocol = this.options.handleProtocols(protocol, req);
      if (protocol === false) return abortConnection(socket, 401);
    } else {
      protocol = protocol[0];
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin: req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message) => {
          if (!verified) return abortConnection(socket, code || 401, message);

          this.completeUpgrade(protocol, version, req, socket, head, cb);
        });
        return;
      } else if (!this.options.verifyClient(info)) {
        return abortConnection(socket, 401);
      }
    }

    this.completeUpgrade(protocol, version, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} protocol The chosen subprotocol
   * @param {Number} version The WebSocket protocol version
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade (protocol, version, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    const key = crypto.createHash('sha1')
      .update(req.headers['sec-websocket-key'] + constants.GUID, 'binary')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    if (protocol) headers.push(`Sec-WebSocket-Protocol: ${protocol}`);

    const offer = Extensions.parse(req.headers['sec-websocket-extensions']);
    var extensions;

    try {
      extensions = acceptExtensions(this.options, offer);
    } catch (err) {
      return abortConnection(socket, 400);
    }

    const props = Object.keys(extensions);

    if (props.length) {
      const serverExtensions = props.reduce((obj, key) => {
        obj[key] = [extensions[key].params];
        return obj;
      }, {});

      headers.push(`Sec-WebSocket-Extensions: ${Extensions.format(serverExtensions)}`);
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('', '').join('\r\n'));

    const client = new WebSocket([socket, head], null, {
      maxPayload: this.options.maxPayload,
      protocolVersion: version,
      extensions,
      protocol
    });

    if (this.clients) {
      this.clients.add(client);
      client.on('close', () => this.clients.delete(client));
    }

    socket.removeListener('error', socketError);
    cb(client);
  }
}

module.exports = WebSocketServer;

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketError () {
  this.destroy();
}

/**
 * Accept WebSocket extensions.
 *
 * @param {Object} options The `WebSocketServer` configuration options
 * @param {Object} offer The parsed value of the `sec-websocket-extensions` header
 * @return {Object} Accepted extensions
 * @private
 */
function acceptExtensions (options, offer) {
  const pmd = options.perMessageDeflate;
  const extensions = {};

  if (pmd && offer[PerMessageDeflate.extensionName]) {
    const perMessageDeflate = new PerMessageDeflate(
      pmd !== true ? pmd : {},
      true,
      options.maxPayload
    );

    perMessageDeflate.accept(offer[PerMessageDeflate.extensionName]);
    extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
  }

  return extensions;
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @private
 */
function abortConnection (socket, code, message) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      'Connection: close\r\n' +
      'Content-type: text/html\r\n' +
      `Content-Length: ${Buffer.byteLength(message)}\r\n` +
      '\r\n' +
      message
    );
  }

  socket.removeListener('error', socketError);
  socket.destroy();
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzOTQ3MTNmYjY2NjQ4OGQ0YTEwZCIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvc2FmZS1idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9QZXJNZXNzYWdlRGVmbGF0ZS5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0J1ZmZlclV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9Db25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9XZWJTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXZlbnRzXCIiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3VsdHJvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL2JpbmRpbmdzL2JpbmRpbmdzLmpzIiwid2VicGFjazovLy8uLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy9iaW5kaW5ncyIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0V4dGVuc2lvbnMuanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9SZWNlaXZlci5qcyIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0Vycm9yQ29kZXMuanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9TZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvVmVydHhQcm90b1N0dWJOb2RlLnBzLmpzIiwid2VicGFjazovLy8uLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJ1ZmZlclwiIiwid2VicGFjazovLy8uLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy9hc3luYy1saW1pdGVyL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInpsaWJcIiIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvYnVmZmVydXRpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvYnVmZmVydXRpbC9mYWxsYmFjay5qcyIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0V2ZW50VGFyZ2V0LmpzIiwid2VicGFjazovLy8uLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9saWIvVmFsaWRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvdXRmLTgtdmFsaWRhdGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3V0Zi04LXZhbGlkYXRlL2ZhbGxiYWNrLmpzIiwid2VicGFjazovLy8uLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9saWIvV2ViU29ja2V0U2VydmVyLmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwiVmVydHhQcm90b1N0dWIiLCJydW50aW1lUHJvdG9TdHViVVJMIiwiYnVzIiwiY29uZmlnIiwiRXJyb3IiLCJ1cmwiLCJydW50aW1lVVJMIiwiX3RoaXMiLCJfaWQiLCJfY29udGludW91c09wZW4iLCJfcnVudGltZVByb3RvU3R1YlVSTCIsIl9idXMiLCJfY29uZmlnIiwiX3J1bnRpbWVTZXNzaW9uVVJMIiwiX3JlT3BlbiIsImFkZExpc3RlbmVyIiwibXNnIiwiY29uc29sZSIsImxvZyIsIl9vcGVuIiwiX2ZpbHRlciIsImJvZHkiLCJ2aWEiLCJfc29jayIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiX3NlbmRTdGF0dXMiLCJfc2VuZENsb3NlIiwiY2FsbGJhY2siLCJpZCIsInR5cGUiLCJmcm9tIiwidG8iLCJoYXNSZXNwb25zZSIsIl9zZXNzaW9uQ2FsbGJhY2siLCJyZXBseSIsImNvZGUiLCJydW50aW1lVG9rZW4iLCJkZXNjIiwic2V0VGltZW91dCIsIl9ydW50aW1lVVJMIiwidmFsdWUiLCJyZWFzb24iLCJfc3RhdGUiLCJwb3N0TWVzc2FnZSIsInJlYWR5U3RhdGUiLCJfd2FpdFJlYWR5Iiwic3Vic3RyaW5nIiwiU29ja0pTIiwib25vcGVuIiwiX3NlbmRPcGVuIiwib25tZXNzYWdlIiwiZSIsInBhcnNlIiwiZGF0YSIsIl9kZWxpdmVyIiwib25jbG9zZSIsImV2ZW50IiwibmFtZSIsImluc3RhbmNlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFO0FBQ2YsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEVBQUU7QUFDZixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRTtBQUNmLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdELGFBQWE7QUFDN0Q7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGdEQUFnRCxhQUFhO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsOENBQThDLGFBQWE7QUFDM0Q7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0EsdURBQXVELEtBQUs7QUFDNUQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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Q2xDLGFBQWEsV0FBVztBQUN4QixhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixJQUFJO0FBQ25DOztBQUVBLDBEQUEwRCxTQUFTOztBQUVuRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSTs7QUFFWCxnREFBZ0Qsb0NBQW9DO0FBQ3BGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFdBQVc7QUFDdEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsS0FBSyxHQUFHLHdCQUF3QjtBQUNsRDtBQUNBO0FBQ0EseUJBQXlCLDJCQUEyQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVmVydHhQcm90b1N0dWJOb2RlLnBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJhY3RpdmF0ZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhY3RpdmF0ZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhY3RpdmF0ZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzk0NzEzZmI2NjY0ODhkNGExMGQiLCIvKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbnZhciBCdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbi8vIGFsdGVybmF0aXZlIHRvIHVzaW5nIE9iamVjdC5rZXlzIGZvciBvbGQgYnJvd3NlcnNcbmZ1bmN0aW9uIGNvcHlQcm9wcyAoc3JjLCBkc3QpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGRzdFtrZXldID0gc3JjW2tleV1cbiAgfVxufVxuaWYgKEJ1ZmZlci5mcm9tICYmIEJ1ZmZlci5hbGxvYyAmJiBCdWZmZXIuYWxsb2NVbnNhZmUgJiYgQnVmZmVyLmFsbG9jVW5zYWZlU2xvdykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGJ1ZmZlclxufSBlbHNlIHtcbiAgLy8gQ29weSBwcm9wZXJ0aWVzIGZyb20gcmVxdWlyZSgnYnVmZmVyJylcbiAgY29weVByb3BzKGJ1ZmZlciwgZXhwb3J0cylcbiAgZXhwb3J0cy5CdWZmZXIgPSBTYWZlQnVmZmVyXG59XG5cbmZ1bmN0aW9uIFNhZmVCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIENvcHkgc3RhdGljIG1ldGhvZHMgZnJvbSBCdWZmZXJcbmNvcHlQcm9wcyhCdWZmZXIsIFNhZmVCdWZmZXIpXG5cblNhZmVCdWZmZXIuZnJvbSA9IGZ1bmN0aW9uIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuU2FmZUJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgdmFyIGJ1ZiA9IEJ1ZmZlcihzaXplKVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1Zi5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWYuZmlsbChmaWxsKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuZmlsbCgwKVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuU2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gQnVmZmVyKHNpemUpXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBidWZmZXIuU2xvd0J1ZmZlcihzaXplKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvc2FmZS1idWZmZXIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzYWZlQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKTtcbmNvbnN0IExpbWl0ZXIgPSByZXF1aXJlKCdhc3luYy1saW1pdGVyJyk7XG5jb25zdCB6bGliID0gcmVxdWlyZSgnemxpYicpO1xuXG5jb25zdCBidWZmZXJVdGlsID0gcmVxdWlyZSgnLi9CdWZmZXJVdGlsJyk7XG5cbmNvbnN0IEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyO1xuXG5jb25zdCBUUkFJTEVSID0gQnVmZmVyLmZyb20oWzB4MDAsIDB4MDAsIDB4ZmYsIDB4ZmZdKTtcbmNvbnN0IEVNUFRZX0JMT0NLID0gQnVmZmVyLmZyb20oWzB4MDBdKTtcblxuY29uc3Qga1dyaXRlSW5Qcm9ncmVzcyA9IFN5bWJvbCgnd3JpdGUtaW4tcHJvZ3Jlc3MnKTtcbmNvbnN0IGtQZW5kaW5nQ2xvc2UgPSBTeW1ib2woJ3BlbmRpbmctY2xvc2UnKTtcbmNvbnN0IGtUb3RhbExlbmd0aCA9IFN5bWJvbCgndG90YWwtbGVuZ3RoJyk7XG5jb25zdCBrQ2FsbGJhY2sgPSBTeW1ib2woJ2NhbGxiYWNrJyk7XG5jb25zdCBrQnVmZmVycyA9IFN5bWJvbCgnYnVmZmVycycpO1xuY29uc3Qga0Vycm9yID0gU3ltYm9sKCdlcnJvcicpO1xuY29uc3Qga093bmVyID0gU3ltYm9sKCdvd25lcicpO1xuXG4vLyBXZSBsaW1pdCB6bGliIGNvbmN1cnJlbmN5LCB3aGljaCBwcmV2ZW50cyBzZXZlcmUgbWVtb3J5IGZyYWdtZW50YXRpb25cbi8vIGFzIGRvY3VtZW50ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2lzc3Vlcy84ODcxI2lzc3VlY29tbWVudC0yNTA5MTU5MTNcbi8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vd2Vic29ja2V0cy93cy9pc3N1ZXMvMTIwMlxuLy9cbi8vIEludGVudGlvbmFsbHkgZ2xvYmFsOyBpdCdzIHRoZSBnbG9iYWwgdGhyZWFkIHBvb2wgdGhhdCdzXG4vLyBhbiBpc3N1ZS5cbmxldCB6bGliTGltaXRlcjtcblxuLyoqXG4gKiBQZXItbWVzc2FnZSBEZWZsYXRlIGltcGxlbWVudGF0aW9uLlxuICovXG5jbGFzcyBQZXJNZXNzYWdlRGVmbGF0ZSB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zLCBpc1NlcnZlciwgbWF4UGF5bG9hZCkge1xuICAgIHRoaXMuX21heFBheWxvYWQgPSBtYXhQYXlsb2FkIHwgMDtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl90aHJlc2hvbGQgPSB0aGlzLl9vcHRpb25zLnRocmVzaG9sZCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHRoaXMuX29wdGlvbnMudGhyZXNob2xkXG4gICAgICA6IDEwMjQ7XG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhIWlzU2VydmVyO1xuICAgIHRoaXMuX2RlZmxhdGUgPSBudWxsO1xuICAgIHRoaXMuX2luZmxhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuXG4gICAgaWYgKCF6bGliTGltaXRlcikge1xuICAgICAgY29uc3QgY29uY3VycmVuY3kgPSB0aGlzLl9vcHRpb25zLmNvbmN1cnJlbmN5TGltaXQgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMuX29wdGlvbnMuY29uY3VycmVuY3lMaW1pdFxuICAgICAgICA6IDEwO1xuICAgICAgemxpYkxpbWl0ZXIgPSBuZXcgTGltaXRlcih7IGNvbmN1cnJlbmN5IH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgZXh0ZW5zaW9uTmFtZSAoKSB7XG4gICAgcmV0dXJuICdwZXJtZXNzYWdlLWRlZmxhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBleHRlbnNpb24gcGFyYW1ldGVycyBvZmZlci5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBFeHRlbnNpb24gcGFyYW1ldGVyc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBvZmZlciAoKSB7XG4gICAgY29uc3QgcGFyYW1zID0ge307XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zZXJ2ZXJOb0NvbnRleHRUYWtlb3Zlcikge1xuICAgICAgcGFyYW1zLnNlcnZlcl9ub19jb250ZXh0X3Rha2VvdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuY2xpZW50Tm9Db250ZXh0VGFrZW92ZXIpIHtcbiAgICAgIHBhcmFtcy5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlciA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vcHRpb25zLnNlcnZlck1heFdpbmRvd0JpdHMpIHtcbiAgICAgIHBhcmFtcy5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzID0gdGhpcy5fb3B0aW9ucy5zZXJ2ZXJNYXhXaW5kb3dCaXRzO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5jbGllbnRNYXhXaW5kb3dCaXRzKSB7XG4gICAgICBwYXJhbXMuY2xpZW50X21heF93aW5kb3dfYml0cyA9IHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyA9PSBudWxsKSB7XG4gICAgICBwYXJhbXMuY2xpZW50X21heF93aW5kb3dfYml0cyA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHQgZXh0ZW5zaW9uIG9mZmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNMaXN0IEV4dGVuc2lvbiBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge09iamVjdH0gQWNjZXB0ZWQgY29uZmlndXJhdGlvblxuICAgKiBAcHVibGljXG4gICAqL1xuICBhY2NlcHQgKHBhcmFtc0xpc3QpIHtcbiAgICBwYXJhbXNMaXN0ID0gdGhpcy5ub3JtYWxpemVQYXJhbXMocGFyYW1zTGlzdCk7XG5cbiAgICB2YXIgcGFyYW1zO1xuICAgIGlmICh0aGlzLl9pc1NlcnZlcikge1xuICAgICAgcGFyYW1zID0gdGhpcy5hY2NlcHRBc1NlcnZlcihwYXJhbXNMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zID0gdGhpcy5hY2NlcHRBc0NsaWVudChwYXJhbXNMaXN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIGFsbCByZXNvdXJjZXMgdXNlZCBieSB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhbnVwICgpIHtcbiAgICBpZiAodGhpcy5faW5mbGF0ZSkge1xuICAgICAgaWYgKHRoaXMuX2luZmxhdGVba1dyaXRlSW5Qcm9ncmVzc10pIHtcbiAgICAgICAgdGhpcy5faW5mbGF0ZVtrUGVuZGluZ0Nsb3NlXSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbmZsYXRlLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX2luZmxhdGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fZGVmbGF0ZSkge1xuICAgICAgaWYgKHRoaXMuX2RlZmxhdGVba1dyaXRlSW5Qcm9ncmVzc10pIHtcbiAgICAgICAgdGhpcy5fZGVmbGF0ZVtrUGVuZGluZ0Nsb3NlXSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZWZsYXRlLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX2RlZmxhdGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHQgZXh0ZW5zaW9uIG9mZmVyIGZyb20gY2xpZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNMaXN0IEV4dGVuc2lvbiBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge09iamVjdH0gQWNjZXB0ZWQgY29uZmlndXJhdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYWNjZXB0QXNTZXJ2ZXIgKHBhcmFtc0xpc3QpIHtcbiAgICBjb25zdCBhY2NlcHRlZCA9IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcmFtc0xpc3Quc29tZSgocGFyYW1zKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLl9vcHRpb25zLnNlcnZlck5vQ29udGV4dFRha2VvdmVyID09PSBmYWxzZSAmJlxuICAgICAgICAgIHBhcmFtcy5zZXJ2ZXJfbm9fY29udGV4dF90YWtlb3ZlcikgfHxcbiAgICAgICAgKHRoaXMuX29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0cyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICBwYXJhbXMuc2VydmVyX21heF93aW5kb3dfYml0cykgfHxcbiAgICAgICAgKHR5cGVvZiB0aGlzLl9vcHRpb25zLnNlcnZlck1heFdpbmRvd0JpdHMgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgdHlwZW9mIHBhcmFtcy5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgIHRoaXMuX29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0cyA+IHBhcmFtcy5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzKSB8fFxuICAgICAgICAodHlwZW9mIHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgICAhcGFyYW1zLmNsaWVudF9tYXhfd2luZG93X2JpdHMpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX29wdGlvbnMuc2VydmVyTm9Db250ZXh0VGFrZW92ZXIgfHxcbiAgICAgICAgcGFyYW1zLnNlcnZlcl9ub19jb250ZXh0X3Rha2VvdmVyXG4gICAgICApIHtcbiAgICAgICAgYWNjZXB0ZWQuc2VydmVyX25vX2NvbnRleHRfdGFrZW92ZXIgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9vcHRpb25zLmNsaWVudE5vQ29udGV4dFRha2VvdmVyIHx8XG4gICAgICAgICh0aGlzLl9vcHRpb25zLmNsaWVudE5vQ29udGV4dFRha2VvdmVyICE9PSBmYWxzZSAmJlxuICAgICAgICAgIHBhcmFtcy5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlcilcbiAgICAgICkge1xuICAgICAgICBhY2NlcHRlZC5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlciA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYWNjZXB0ZWQuc2VydmVyX21heF93aW5kb3dfYml0cyA9IHRoaXMuX29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0cztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhcmFtcy5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzID09PSAnbnVtYmVyJykge1xuICAgICAgICBhY2NlcHRlZC5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzID0gcGFyYW1zLnNlcnZlcl9tYXhfd2luZG93X2JpdHM7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYWNjZXB0ZWQuY2xpZW50X21heF93aW5kb3dfYml0cyA9IHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cztcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyAhPT0gZmFsc2UgJiZcbiAgICAgICAgdHlwZW9mIHBhcmFtcy5jbGllbnRfbWF4X3dpbmRvd19iaXRzID09PSAnbnVtYmVyJ1xuICAgICAgKSB7XG4gICAgICAgIGFjY2VwdGVkLmNsaWVudF9tYXhfd2luZG93X2JpdHMgPSBwYXJhbXMuY2xpZW50X21heF93aW5kb3dfYml0cztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgaWYgKCFyZXN1bHQpIHRocm93IG5ldyBFcnJvcihcIkRvZXNuJ3Qgc3VwcG9ydCB0aGUgb2ZmZXJlZCBjb25maWd1cmF0aW9uXCIpO1xuXG4gICAgcmV0dXJuIGFjY2VwdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdCBleHRlbnNpb24gcmVzcG9uc2UgZnJvbSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc0xpc3QgRXh0ZW5zaW9uIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7T2JqZWN0fSBBY2NlcHRlZCBjb25maWd1cmF0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhY2NlcHRBc0NsaWVudCAocGFyYW1zTGlzdCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHBhcmFtc0xpc3RbMF07XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5jbGllbnROb0NvbnRleHRUYWtlb3ZlciAhPSBudWxsKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX29wdGlvbnMuY2xpZW50Tm9Db250ZXh0VGFrZW92ZXIgPT09IGZhbHNlICYmXG4gICAgICAgIHBhcmFtcy5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlclxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgXCJjbGllbnRfbm9fY29udGV4dF90YWtlb3ZlclwiJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHMgIT0gbnVsbCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHMgPT09IGZhbHNlICYmXG4gICAgICAgIHBhcmFtcy5jbGllbnRfbWF4X3dpbmRvd19iaXRzXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBcImNsaWVudF9tYXhfd2luZG93X2JpdHNcIicpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgdGhpcy5fb3B0aW9ucy5jbGllbnRNYXhXaW5kb3dCaXRzID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAoIXBhcmFtcy5jbGllbnRfbWF4X3dpbmRvd19iaXRzIHx8XG4gICAgICAgICAgcGFyYW1zLmNsaWVudF9tYXhfd2luZG93X2JpdHMgPiB0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHMpXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBcImNsaWVudF9tYXhfd2luZG93X2JpdHNcIicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplIGV4dGVuc2lvbnMgcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gcGFyYW1zTGlzdCBFeHRlbnNpb24gcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gTm9ybWFsaXplZCBleHRlbnNpb25zIHBhcmFtZXRlcnNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG5vcm1hbGl6ZVBhcmFtcyAocGFyYW1zTGlzdCkge1xuICAgIHJldHVybiBwYXJhbXNMaXN0Lm1hcCgocGFyYW1zKSA9PiB7XG4gICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbXNba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIGV4dGVuc2lvbiBwYXJhbWV0ZXJzIGZvciAke2tleX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdmFsdWVbMF07XG5cbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdzZXJ2ZXJfbm9fY29udGV4dF90YWtlb3Zlcic6XG4gICAgICAgICAgY2FzZSAnY2xpZW50X25vX2NvbnRleHRfdGFrZW92ZXInOlxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBleHRlbnNpb24gcGFyYW1ldGVyIHZhbHVlIGZvciAke2tleX0gKCR7dmFsdWV9KWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zW2tleV0gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2VydmVyX21heF93aW5kb3dfYml0cyc6XG4gICAgICAgICAgY2FzZSAnY2xpZW50X21heF93aW5kb3dfYml0cyc6XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBOdW1iZXIuaXNOYU4odmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPCB6bGliLlpfTUlOX1dJTkRPV0JJVFMgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA+IHpsaWIuWl9NQVhfV0lORE9XQklUU1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgZXh0ZW5zaW9uIHBhcmFtZXRlciB2YWx1ZSBmb3IgJHtrZXl9ICgke3ZhbHVlfSlgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1NlcnZlciAmJiB2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZXh0ZW5zaW9uIHBhcmFtZXRlciB2YWx1ZSBmb3IgJHtrZXl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGRlZmluZWQgZXh0ZW5zaW9uIHBhcmFtZXRlciAoJHtrZXl9KWApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjb21wcmVzcyBkYXRhLiBDb25jdXJyZW5jeSBsaW1pdGVkIGJ5IGFzeW5jLWxpbWl0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIENvbXByZXNzZWQgZGF0YVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZpbiBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdGhpcyBpcyB0aGUgbGFzdCBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBkZWNvbXByZXNzIChkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgemxpYkxpbWl0ZXIucHVzaCgoZG9uZSkgPT4ge1xuICAgICAgdGhpcy5fZGVjb21wcmVzcyhkYXRhLCBmaW4sIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgICBkb25lKCk7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXByZXNzIGRhdGEuIENvbmN1cnJlbmN5IGxpbWl0ZWQgYnkgYXN5bmMtbGltaXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgRGF0YSB0byBjb21wcmVzc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZpbiBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdGhpcyBpcyB0aGUgbGFzdCBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjb21wcmVzcyAoZGF0YSwgZmluLCBjYWxsYmFjaykge1xuICAgIHpsaWJMaW1pdGVyLnB1c2goKGRvbmUpID0+IHtcbiAgICAgIHRoaXMuX2NvbXByZXNzKGRhdGEsIGZpbiwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjb21wcmVzcyBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YSBDb21wcmVzc2VkIGRhdGFcbiAgICogQHBhcmFtIHtCb29sZWFufSBmaW4gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgdGhlIGxhc3QgZnJhZ21lbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2tcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWNvbXByZXNzIChkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9pc1NlcnZlciA/ICdjbGllbnQnIDogJ3NlcnZlcic7XG5cbiAgICBpZiAoIXRoaXMuX2luZmxhdGUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2VuZHBvaW50fV9tYXhfd2luZG93X2JpdHNgO1xuICAgICAgY29uc3Qgd2luZG93Qml0cyA9IHR5cGVvZiB0aGlzLnBhcmFtc1trZXldICE9PSAnbnVtYmVyJ1xuICAgICAgICA/IHpsaWIuWl9ERUZBVUxUX1dJTkRPV0JJVFNcbiAgICAgICAgOiB0aGlzLnBhcmFtc1trZXldO1xuXG4gICAgICB0aGlzLl9pbmZsYXRlID0gemxpYi5jcmVhdGVJbmZsYXRlUmF3KHsgd2luZG93Qml0cyB9KTtcbiAgICAgIHRoaXMuX2luZmxhdGVba1RvdGFsTGVuZ3RoXSA9IDA7XG4gICAgICB0aGlzLl9pbmZsYXRlW2tCdWZmZXJzXSA9IFtdO1xuICAgICAgdGhpcy5faW5mbGF0ZVtrT3duZXJdID0gdGhpcztcbiAgICAgIHRoaXMuX2luZmxhdGUub24oJ2Vycm9yJywgaW5mbGF0ZU9uRXJyb3IpO1xuICAgICAgdGhpcy5faW5mbGF0ZS5vbignZGF0YScsIGluZmxhdGVPbkRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuX2luZmxhdGVba0NhbGxiYWNrXSA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX2luZmxhdGVba1dyaXRlSW5Qcm9ncmVzc10gPSB0cnVlO1xuXG4gICAgdGhpcy5faW5mbGF0ZS53cml0ZShkYXRhKTtcbiAgICBpZiAoZmluKSB0aGlzLl9pbmZsYXRlLndyaXRlKFRSQUlMRVIpO1xuXG4gICAgdGhpcy5faW5mbGF0ZS5mbHVzaCgoKSA9PiB7XG4gICAgICBjb25zdCBlcnIgPSB0aGlzLl9pbmZsYXRlW2tFcnJvcl07XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5faW5mbGF0ZS5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9pbmZsYXRlID0gbnVsbDtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRhID0gYnVmZmVyVXRpbC5jb25jYXQoXG4gICAgICAgIHRoaXMuX2luZmxhdGVba0J1ZmZlcnNdLFxuICAgICAgICB0aGlzLl9pbmZsYXRlW2tUb3RhbExlbmd0aF1cbiAgICAgICk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgKGZpbiAmJiB0aGlzLnBhcmFtc1tgJHtlbmRwb2ludH1fbm9fY29udGV4dF90YWtlb3ZlcmBdKSB8fFxuICAgICAgICB0aGlzLl9pbmZsYXRlW2tQZW5kaW5nQ2xvc2VdXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5faW5mbGF0ZS5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9pbmZsYXRlID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luZmxhdGVba1dyaXRlSW5Qcm9ncmVzc10gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5mbGF0ZVtrVG90YWxMZW5ndGhdID0gMDtcbiAgICAgICAgdGhpcy5faW5mbGF0ZVtrQnVmZmVyc10gPSBbXTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHJlc3MgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgRGF0YSB0byBjb21wcmVzc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZpbiBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdGhpcyBpcyB0aGUgbGFzdCBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbXByZXNzIChkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrLCBudWxsLCBFTVBUWV9CTE9DSyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9pc1NlcnZlciA/ICdzZXJ2ZXInIDogJ2NsaWVudCc7XG5cbiAgICBpZiAoIXRoaXMuX2RlZmxhdGUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2VuZHBvaW50fV9tYXhfd2luZG93X2JpdHNgO1xuICAgICAgY29uc3Qgd2luZG93Qml0cyA9IHR5cGVvZiB0aGlzLnBhcmFtc1trZXldICE9PSAnbnVtYmVyJ1xuICAgICAgICA/IHpsaWIuWl9ERUZBVUxUX1dJTkRPV0JJVFNcbiAgICAgICAgOiB0aGlzLnBhcmFtc1trZXldO1xuXG4gICAgICB0aGlzLl9kZWZsYXRlID0gemxpYi5jcmVhdGVEZWZsYXRlUmF3KHtcbiAgICAgICAgbWVtTGV2ZWw6IHRoaXMuX29wdGlvbnMubWVtTGV2ZWwsXG4gICAgICAgIGxldmVsOiB0aGlzLl9vcHRpb25zLmxldmVsLFxuICAgICAgICBmbHVzaDogemxpYi5aX1NZTkNfRkxVU0gsXG4gICAgICAgIHdpbmRvd0JpdHNcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9kZWZsYXRlW2tUb3RhbExlbmd0aF0gPSAwO1xuICAgICAgdGhpcy5fZGVmbGF0ZVtrQnVmZmVyc10gPSBbXTtcblxuICAgICAgLy9cbiAgICAgIC8vIGB6bGliLkRlZmxhdGVSYXdgIGVtaXRzIGFuIGAnZXJyb3InYCBldmVudCBvbmx5IHdoZW4gYW4gYXR0ZW1wdCB0byB1c2VcbiAgICAgIC8vIGl0IGlzIG1hZGUgYWZ0ZXIgaXQgaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQuIFRoaXMgY2Fubm90IGhhcHBlbiBoZXJlLFxuICAgICAgLy8gc28gd2Ugb25seSBhZGQgYSBsaXN0ZW5lciBmb3IgdGhlIGAnZGF0YSdgIGV2ZW50LlxuICAgICAgLy9cbiAgICAgIHRoaXMuX2RlZmxhdGUub24oJ2RhdGEnLCBkZWZsYXRlT25EYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZWZsYXRlW2tXcml0ZUluUHJvZ3Jlc3NdID0gdHJ1ZTtcblxuICAgIHRoaXMuX2RlZmxhdGUud3JpdGUoZGF0YSk7XG4gICAgdGhpcy5fZGVmbGF0ZS5mbHVzaCh6bGliLlpfU1lOQ19GTFVTSCwgKCkgPT4ge1xuICAgICAgdmFyIGRhdGEgPSBidWZmZXJVdGlsLmNvbmNhdChcbiAgICAgICAgdGhpcy5fZGVmbGF0ZVtrQnVmZmVyc10sXG4gICAgICAgIHRoaXMuX2RlZmxhdGVba1RvdGFsTGVuZ3RoXVxuICAgICAgKTtcblxuICAgICAgaWYgKGZpbikgZGF0YSA9IGRhdGEuc2xpY2UoMCwgZGF0YS5sZW5ndGggLSA0KTtcblxuICAgICAgaWYgKFxuICAgICAgICAoZmluICYmIHRoaXMucGFyYW1zW2Ake2VuZHBvaW50fV9ub19jb250ZXh0X3Rha2VvdmVyYF0pIHx8XG4gICAgICAgIHRoaXMuX2RlZmxhdGVba1BlbmRpbmdDbG9zZV1cbiAgICAgICkge1xuICAgICAgICB0aGlzLl9kZWZsYXRlLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX2RlZmxhdGUgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGVmbGF0ZVtrV3JpdGVJblByb2dyZXNzXSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kZWZsYXRlW2tUb3RhbExlbmd0aF0gPSAwO1xuICAgICAgICB0aGlzLl9kZWZsYXRlW2tCdWZmZXJzXSA9IFtdO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlck1lc3NhZ2VEZWZsYXRlO1xuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYHpsaWIuRGVmbGF0ZVJhd2Agc3RyZWFtIGAnZGF0YSdgIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyfSBjaHVuayBBIGNodW5rIG9mIGRhdGFcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGRlZmxhdGVPbkRhdGEgKGNodW5rKSB7XG4gIHRoaXNba0J1ZmZlcnNdLnB1c2goY2h1bmspO1xuICB0aGlzW2tUb3RhbExlbmd0aF0gKz0gY2h1bmsubGVuZ3RoO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYHpsaWIuSW5mbGF0ZVJhd2Agc3RyZWFtIGAnZGF0YSdgIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyfSBjaHVuayBBIGNodW5rIG9mIGRhdGFcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGluZmxhdGVPbkRhdGEgKGNodW5rKSB7XG4gIHRoaXNba1RvdGFsTGVuZ3RoXSArPSBjaHVuay5sZW5ndGg7XG5cbiAgaWYgKFxuICAgIHRoaXNba093bmVyXS5fbWF4UGF5bG9hZCA8IDEgfHxcbiAgICB0aGlzW2tUb3RhbExlbmd0aF0gPD0gdGhpc1trT3duZXJdLl9tYXhQYXlsb2FkXG4gICkge1xuICAgIHRoaXNba0J1ZmZlcnNdLnB1c2goY2h1bmspO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXNba0Vycm9yXSA9IG5ldyBFcnJvcignbWF4IHBheWxvYWQgc2l6ZSBleGNlZWRlZCcpO1xuICB0aGlzW2tFcnJvcl0uY2xvc2VDb2RlID0gMTAwOTtcbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcignZGF0YScsIGluZmxhdGVPbkRhdGEpO1xuICB0aGlzLnJlc2V0KCk7XG59XG5cbi8qKlxuICogVGhlIGxpc3RlbmVyIG9mIHRoZSBgemxpYi5JbmZsYXRlUmF3YCBzdHJlYW0gYCdlcnJvcidgIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBUaGUgZW1pdHRlZCBlcnJvclxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaW5mbGF0ZU9uRXJyb3IgKGVycikge1xuICAvL1xuICAvLyBUaGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgYFpsaWIjY2xvc2UoKWAgYXMgdGhlIGhhbmRsZSBpcyBhdXRvbWF0aWNhbGx5XG4gIC8vIGNsb3NlZCB3aGVuIGFuIGVycm9yIGlzIGVtaXR0ZWQuXG4gIC8vXG4gIHRoaXNba093bmVyXS5faW5mbGF0ZSA9IG51bGw7XG4gIHRoaXNba0NhbGxiYWNrXShlcnIpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL1Blck1lc3NhZ2VEZWZsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNyeXB0b1wiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogd3M6IGEgbm9kZS5qcyB3ZWJzb2NrZXQgY2xpZW50XG4gKiBDb3B5cmlnaHQoYykgMjAxMSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2FmZUJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJyk7XG5cbmNvbnN0IEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyO1xuXG4vKipcbiAqIE1lcmdlcyBhbiBhcnJheSBvZiBidWZmZXJzIGludG8gYSBuZXcgYnVmZmVyLlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyW119IGxpc3QgVGhlIGFycmF5IG9mIGJ1ZmZlcnMgdG8gY29uY2F0XG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxMZW5ndGggVGhlIHRvdGFsIGxlbmd0aCBvZiBidWZmZXJzIGluIHRoZSBsaXN0XG4gKiBAcmV0dXJuIHtCdWZmZXJ9IFRoZSByZXN1bHRpbmcgYnVmZmVyXG4gKiBAcHVibGljXG4gKi9cbmNvbnN0IGNvbmNhdCA9IChsaXN0LCB0b3RhbExlbmd0aCkgPT4ge1xuICBjb25zdCB0YXJnZXQgPSBCdWZmZXIuYWxsb2NVbnNhZmUodG90YWxMZW5ndGgpO1xuICB2YXIgb2Zmc2V0ID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBidWYgPSBsaXN0W2ldO1xuICAgIGJ1Zi5jb3B5KHRhcmdldCwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgKz0gYnVmLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG50cnkge1xuICBjb25zdCBidWZmZXJVdGlsID0gcmVxdWlyZSgnYnVmZmVydXRpbCcpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbih7IGNvbmNhdCB9LCBidWZmZXJVdGlsLkJ1ZmZlclV0aWwgfHwgYnVmZmVyVXRpbCk7XG59IGNhdGNoIChlKSAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyB7XG4gIC8qKlxuICAgKiBNYXNrcyBhIGJ1ZmZlciB1c2luZyB0aGUgZ2l2ZW4gbWFzay5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IHNvdXJjZSBUaGUgYnVmZmVyIHRvIG1hc2tcbiAgICogQHBhcmFtIHtCdWZmZXJ9IG1hc2sgVGhlIG1hc2sgdG8gdXNlXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBvdXRwdXQgVGhlIGJ1ZmZlciB3aGVyZSB0byBzdG9yZSB0aGUgcmVzdWx0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgVGhlIG9mZnNldCBhdCB3aGljaCB0byBzdGFydCB3cml0aW5nXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIG51bWJlciBvZiBieXRlcyB0byBtYXNrLlxuICAgKiBAcHVibGljXG4gICAqL1xuICBjb25zdCBtYXNrID0gKHNvdXJjZSwgbWFzaywgb3V0cHV0LCBvZmZzZXQsIGxlbmd0aCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIG91dHB1dFtvZmZzZXQgKyBpXSA9IHNvdXJjZVtpXSBeIG1hc2tbaSAmIDNdO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5tYXNrcyBhIGJ1ZmZlciB1c2luZyB0aGUgZ2l2ZW4gbWFzay5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIHVubWFza1xuICAgKiBAcGFyYW0ge0J1ZmZlcn0gbWFzayBUaGUgbWFzayB0byB1c2VcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY29uc3QgdW5tYXNrID0gKGJ1ZmZlciwgbWFzaykgPT4ge1xuICAgIC8vIFJlcXVpcmVkIHVudGlsIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvOTAwNiBpcyByZXNvbHZlZC5cbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZmZlcltpXSBePSBtYXNrW2kgJiAzXTtcbiAgICB9XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB7IGNvbmNhdCwgbWFzaywgdW5tYXNrIH07XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9saWIvQnVmZmVyVXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHNhZmVCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpO1xuXG5jb25zdCBCdWZmZXIgPSBzYWZlQnVmZmVyLkJ1ZmZlcjtcblxuZXhwb3J0cy5CSU5BUllfVFlQRVMgPSBbJ25vZGVidWZmZXInLCAnYXJyYXlidWZmZXInLCAnZnJhZ21lbnRzJ107XG5leHBvcnRzLkdVSUQgPSAnMjU4RUFGQTUtRTkxNC00N0RBLTk1Q0EtQzVBQjBEQzg1QjExJztcbmV4cG9ydHMuRU1QVFlfQlVGRkVSID0gQnVmZmVyLmFsbG9jKDApO1xuZXhwb3J0cy5OT09QID0gKCkgPT4ge307XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9saWIvQ29uc3RhbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogd3M6IGEgbm9kZS5qcyB3ZWJzb2NrZXQgY2xpZW50XG4gKiBDb3B5cmlnaHQoYykgMjAxMSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbmNvbnN0IFVsdHJvbiA9IHJlcXVpcmUoJ3VsdHJvbicpO1xuY29uc3QgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpO1xuY29uc3QgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpO1xuXG5jb25zdCBQZXJNZXNzYWdlRGVmbGF0ZSA9IHJlcXVpcmUoJy4vUGVyTWVzc2FnZURlZmxhdGUnKTtcbmNvbnN0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi9FdmVudFRhcmdldCcpO1xuY29uc3QgRXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vRXh0ZW5zaW9ucycpO1xuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db25zdGFudHMnKTtcbmNvbnN0IFJlY2VpdmVyID0gcmVxdWlyZSgnLi9SZWNlaXZlcicpO1xuY29uc3QgU2VuZGVyID0gcmVxdWlyZSgnLi9TZW5kZXInKTtcblxuY29uc3QgcHJvdG9jb2xWZXJzaW9ucyA9IFs4LCAxM107XG5jb25zdCBjbG9zZVRpbWVvdXQgPSAzMCAqIDEwMDA7IC8vIEFsbG93IDMwIHNlY29uZHMgdG8gdGVybWluYXRlIHRoZSBjb25uZWN0aW9uIGNsZWFubHkuXG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgV2ViU29ja2V0LlxuICpcbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICovXG5jbGFzcyBXZWJTb2NrZXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBXZWJTb2NrZXRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBUaGUgVVJMIHRvIHdoaWNoIHRvIGNvbm5lY3RcbiAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdKX0gcHJvdG9jb2xzIFRoZSBzdWJwcm90b2NvbHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ29ubmVjdGlvbiBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoYWRkcmVzcywgcHJvdG9jb2xzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghcHJvdG9jb2xzKSB7XG4gICAgICBwcm90b2NvbHMgPSBbXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm90b2NvbHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcm90b2NvbHMgPSBbcHJvdG9jb2xzXTtcbiAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KHByb3RvY29scykpIHtcbiAgICAgIG9wdGlvbnMgPSBwcm90b2NvbHM7XG4gICAgICBwcm90b2NvbHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBXZWJTb2NrZXQuQ09OTkVDVElORztcbiAgICB0aGlzLmJ5dGVzUmVjZWl2ZWQgPSAwO1xuICAgIHRoaXMuZXh0ZW5zaW9ucyA9IHt9O1xuICAgIHRoaXMucHJvdG9jb2wgPSAnJztcblxuICAgIHRoaXMuX2JpbmFyeVR5cGUgPSBjb25zdGFudHMuQklOQVJZX1RZUEVTWzBdO1xuICAgIHRoaXMuX2ZpbmFsaXplID0gdGhpcy5maW5hbGl6ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2ZpbmFsaXplQ2FsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fY2xvc2VNZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLl9jbG9zZVRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9jbG9zZUNvZGUgPSBudWxsO1xuICAgIHRoaXMuX3JlY2VpdmVyID0gbnVsbDtcbiAgICB0aGlzLl9zZW5kZXIgPSBudWxsO1xuICAgIHRoaXMuX3NvY2tldCA9IG51bGw7XG4gICAgdGhpcy5fdWx0cm9uID0gbnVsbDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGFkZHJlc3MpKSB7XG4gICAgICBpbml0QXNTZXJ2ZXJDbGllbnQuY2FsbCh0aGlzLCBhZGRyZXNzWzBdLCBhZGRyZXNzWzFdLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdEFzQ2xpZW50LmNhbGwodGhpcywgYWRkcmVzcywgcHJvdG9jb2xzLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBnZXQgQ09OTkVDVElORyAoKSB7IHJldHVybiBXZWJTb2NrZXQuQ09OTkVDVElORzsgfVxuICBnZXQgQ0xPU0lORyAoKSB7IHJldHVybiBXZWJTb2NrZXQuQ0xPU0lORzsgfVxuICBnZXQgQ0xPU0VEICgpIHsgcmV0dXJuIFdlYlNvY2tldC5DTE9TRUQ7IH1cbiAgZ2V0IE9QRU4gKCkgeyByZXR1cm4gV2ViU29ja2V0Lk9QRU47IH1cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBidWZmZXJlZEFtb3VudCAoKSB7XG4gICAgdmFyIGFtb3VudCA9IDA7XG5cbiAgICBpZiAodGhpcy5fc29ja2V0KSB7XG4gICAgICBhbW91bnQgPSB0aGlzLl9zb2NrZXQuYnVmZmVyU2l6ZSArIHRoaXMuX3NlbmRlci5fYnVmZmVyZWRCeXRlcztcbiAgICB9XG4gICAgcmV0dXJuIGFtb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGRldmlhdGVzIGZyb20gdGhlIFdIQVRXRyBpbnRlcmZhY2Ugc2luY2Ugd3MgZG9lc24ndCBzdXBwb3J0IHRoZSByZXF1aXJlZFxuICAgKiBkZWZhdWx0IFwiYmxvYlwiIHR5cGUgKGluc3RlYWQgd2UgZGVmaW5lIGEgY3VzdG9tIFwibm9kZWJ1ZmZlclwiIHR5cGUpLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IGJpbmFyeVR5cGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9iaW5hcnlUeXBlO1xuICB9XG5cbiAgc2V0IGJpbmFyeVR5cGUgKHR5cGUpIHtcbiAgICBpZiAoY29uc3RhbnRzLkJJTkFSWV9UWVBFUy5pbmRleE9mKHR5cGUpIDwgMCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fYmluYXJ5VHlwZSA9IHR5cGU7XG5cbiAgICAvL1xuICAgIC8vIEFsbG93IHRvIGNoYW5nZSBgYmluYXJ5VHlwZWAgb24gdGhlIGZseS5cbiAgICAvL1xuICAgIGlmICh0aGlzLl9yZWNlaXZlcikgdGhpcy5fcmVjZWl2ZXIuX2JpbmFyeVR5cGUgPSB0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCB0aGUgc29ja2V0IGFuZCB0aGUgaW50ZXJuYWwgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge25ldC5Tb2NrZXR9IHNvY2tldCBUaGUgbmV0d29yayBzb2NrZXQgYmV0d2VlbiB0aGUgc2VydmVyIGFuZCBjbGllbnRcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGhlYWQgVGhlIGZpcnN0IHBhY2tldCBvZiB0aGUgdXBncmFkZWQgc3RyZWFtXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRTb2NrZXQgKHNvY2tldCwgaGVhZCkge1xuICAgIHNvY2tldC5zZXRUaW1lb3V0KDApO1xuICAgIHNvY2tldC5zZXROb0RlbGF5KCk7XG5cbiAgICB0aGlzLl9yZWNlaXZlciA9IG5ldyBSZWNlaXZlcih0aGlzLmV4dGVuc2lvbnMsIHRoaXMuX21heFBheWxvYWQsIHRoaXMuYmluYXJ5VHlwZSk7XG4gICAgdGhpcy5fc2VuZGVyID0gbmV3IFNlbmRlcihzb2NrZXQsIHRoaXMuZXh0ZW5zaW9ucyk7XG4gICAgdGhpcy5fdWx0cm9uID0gbmV3IFVsdHJvbihzb2NrZXQpO1xuICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcblxuICAgIC8vIHNvY2tldCBjbGVhbnVwIGhhbmRsZXJzXG4gICAgdGhpcy5fdWx0cm9uLm9uKCdjbG9zZScsIHRoaXMuX2ZpbmFsaXplKTtcbiAgICB0aGlzLl91bHRyb24ub24oJ2Vycm9yJywgdGhpcy5fZmluYWxpemUpO1xuICAgIHRoaXMuX3VsdHJvbi5vbignZW5kJywgdGhpcy5fZmluYWxpemUpO1xuXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlIGhlYWQgaXMgYWRkZWQgdG8gdGhlIHJlY2VpdmVyXG4gICAgaWYgKGhlYWQubGVuZ3RoID4gMCkgc29ja2V0LnVuc2hpZnQoaGVhZCk7XG5cbiAgICAvLyBzdWJzZXF1ZW50IHBhY2tldHMgYXJlIHB1c2hlZCB0byB0aGUgcmVjZWl2ZXJcbiAgICB0aGlzLl91bHRyb24ub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5ieXRlc1JlY2VpdmVkICs9IGRhdGEubGVuZ3RoO1xuICAgICAgdGhpcy5fcmVjZWl2ZXIuYWRkKGRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gcmVjZWl2ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLl9yZWNlaXZlci5vbm1lc3NhZ2UgPSAoZGF0YSkgPT4gdGhpcy5lbWl0KCdtZXNzYWdlJywgZGF0YSk7XG4gICAgdGhpcy5fcmVjZWl2ZXIub25waW5nID0gKGRhdGEpID0+IHtcbiAgICAgIHRoaXMucG9uZyhkYXRhLCAhdGhpcy5faXNTZXJ2ZXIsIHRydWUpO1xuICAgICAgdGhpcy5lbWl0KCdwaW5nJywgZGF0YSk7XG4gICAgfTtcbiAgICB0aGlzLl9yZWNlaXZlci5vbnBvbmcgPSAoZGF0YSkgPT4gdGhpcy5lbWl0KCdwb25nJywgZGF0YSk7XG4gICAgdGhpcy5fcmVjZWl2ZXIub25jbG9zZSA9IChjb2RlLCByZWFzb24pID0+IHtcbiAgICAgIHRoaXMuX2Nsb3NlTWVzc2FnZSA9IHJlYXNvbjtcbiAgICAgIHRoaXMuX2Nsb3NlQ29kZSA9IGNvZGU7XG4gICAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbik7XG4gICAgfTtcbiAgICB0aGlzLl9yZWNlaXZlci5vbmVycm9yID0gKGVycm9yLCBjb2RlKSA9PiB7XG4gICAgICAvLyBjbG9zZSB0aGUgY29ubmVjdGlvbiB3aGVuIHRoZSByZWNlaXZlciByZXBvcnRzIGEgSHlCaSBlcnJvciBjb2RlXG4gICAgICB0aGlzLmNsb3NlKGNvZGUsICcnKTtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgfTtcblxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5PUEVOO1xuICAgIHRoaXMuZW1pdCgnb3BlbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFuIHVwIGFuZCByZWxlYXNlIGludGVybmFsIHJlc291cmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHsoQm9vbGVhbnxFcnJvcil9IEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhbiBlcnJvciBvY2N1cnJlZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZmluYWxpemUgKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuX2ZpbmFsaXplQ2FsbGVkKSByZXR1cm47XG5cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBXZWJTb2NrZXQuQ0xPU0lORztcbiAgICB0aGlzLl9maW5hbGl6ZUNhbGxlZCA9IHRydWU7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VUaW1lcik7XG4gICAgdGhpcy5fY2xvc2VUaW1lciA9IG51bGw7XG5cbiAgICAvL1xuICAgIC8vIElmIHRoZSBjb25uZWN0aW9uIHdhcyBjbG9zZWQgYWJub3JtYWxseSAod2l0aCBhbiBlcnJvciksIG9yIGlmIHRoZSBjbG9zZVxuICAgIC8vIGNvbnRyb2wgZnJhbWUgd2FzIG1hbGZvcm1lZCBvciBub3QgcmVjZWl2ZWQgdGhlbiB0aGUgY2xvc2UgY29kZSBtdXN0IGJlXG4gICAgLy8gMTAwNi5cbiAgICAvL1xuICAgIGlmIChlcnJvcikgdGhpcy5fY2xvc2VDb2RlID0gMTAwNjtcblxuICAgIGlmICh0aGlzLl9zb2NrZXQpIHtcbiAgICAgIHRoaXMuX3VsdHJvbi5kZXN0cm95KCk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ2Vycm9yJywgZnVuY3Rpb24gb25lcnJvciAoKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICghZXJyb3IpIHRoaXMuX3NvY2tldC5lbmQoKTtcbiAgICAgIGVsc2UgdGhpcy5fc29ja2V0LmRlc3Ryb3koKTtcblxuICAgICAgdGhpcy5fcmVjZWl2ZXIuY2xlYW51cCgoKSA9PiB0aGlzLmVtaXRDbG9zZSgpKTtcblxuICAgICAgdGhpcy5fcmVjZWl2ZXIgPSBudWxsO1xuICAgICAgdGhpcy5fc2VuZGVyID0gbnVsbDtcbiAgICAgIHRoaXMuX3NvY2tldCA9IG51bGw7XG4gICAgICB0aGlzLl91bHRyb24gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXRDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBgY2xvc2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdENsb3NlICgpIHtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBXZWJTb2NrZXQuQ0xPU0VEO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnLCB0aGlzLl9jbG9zZUNvZGUgfHwgMTAwNiwgdGhpcy5fY2xvc2VNZXNzYWdlIHx8ICcnKTtcblxuICAgIGlmICh0aGlzLmV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIHRoaXMuZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXS5jbGVhbnVwKCk7XG4gICAgfVxuXG4gICAgdGhpcy5leHRlbnNpb25zID0gbnVsbDtcblxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5vbignZXJyb3InLCBjb25zdGFudHMuTk9PUCk7IC8vIENhdGNoIGFsbCBlcnJvcnMgYWZ0ZXIgdGhpcy5cbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZSB0aGUgc29ja2V0IHN0cmVhbS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcGF1c2UgKCkge1xuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSB0aHJvdyBuZXcgRXJyb3IoJ25vdCBvcGVuZWQnKTtcblxuICAgIHRoaXMuX3NvY2tldC5wYXVzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3VtZSB0aGUgc29ja2V0IHN0cmVhbVxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICByZXN1bWUgKCkge1xuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSB0aHJvdyBuZXcgRXJyb3IoJ25vdCBvcGVuZWQnKTtcblxuICAgIHRoaXMuX3NvY2tldC5yZXN1bWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhIGNsb3NpbmcgaGFuZHNoYWtlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gY29kZSBTdGF0dXMgY29kZSBleHBsYWluaW5nIHdoeSB0aGUgY29ubmVjdGlvbiBpcyBjbG9zaW5nXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBjb25uZWN0aW9uIGlzIGNsb3NpbmdcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xvc2UgKGNvZGUsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuQ0xPU0VEKSByZXR1cm47XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIGlmICh0aGlzLl9yZXEgJiYgIXRoaXMuX3JlcS5hYm9ydGVkKSB7XG4gICAgICAgIHRoaXMuX3JlcS5hYm9ydCgpO1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdjbG9zZWQgYmVmb3JlIHRoZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkJykpO1xuICAgICAgICB0aGlzLmZpbmFsaXplKHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5DTE9TSU5HKSB7XG4gICAgICBpZiAodGhpcy5fY2xvc2VDb2RlICYmIHRoaXMuX3NvY2tldCkgdGhpcy5fc29ja2V0LmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5DTE9TSU5HO1xuICAgIHRoaXMuX3NlbmRlci5jbG9zZShjb2RlLCBkYXRhLCAhdGhpcy5faXNTZXJ2ZXIsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuXG4gICAgICBpZiAodGhpcy5fc29ja2V0KSB7XG4gICAgICAgIGlmICh0aGlzLl9jbG9zZUNvZGUpIHRoaXMuX3NvY2tldC5lbmQoKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGNvbm5lY3Rpb24gaXMgY2xlYW5lZCB1cCBldmVuIHdoZW4gdGhlIGNsb3NpbmdcbiAgICAgICAgLy8gaGFuZHNoYWtlIGZhaWxzLlxuICAgICAgICAvL1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VUaW1lcik7XG4gICAgICAgIHRoaXMuX2Nsb3NlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuX2ZpbmFsaXplLCBjbG9zZVRpbWVvdXQsIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBwaW5nIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gbWFzayBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtCb29sZWFufSBmYWlsU2lsZW50bHkgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIHRocm93IGlmIGByZWFkeVN0YXRlYCBpc24ndCBgT1BFTmBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcGluZyAoZGF0YSwgbWFzaywgZmFpbFNpbGVudGx5KSB7XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgIGlmIChmYWlsU2lsZW50bHkpIHJldHVybjtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm90IG9wZW5lZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicpIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgaWYgKG1hc2sgPT09IHVuZGVmaW5lZCkgbWFzayA9ICF0aGlzLl9pc1NlcnZlcjtcbiAgICB0aGlzLl9zZW5kZXIucGluZyhkYXRhIHx8IGNvbnN0YW50cy5FTVBUWV9CVUZGRVIsIG1hc2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBwb25nIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gbWFzayBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtCb29sZWFufSBmYWlsU2lsZW50bHkgSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIHRocm93IGlmIGByZWFkeVN0YXRlYCBpc24ndCBgT1BFTmBcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcG9uZyAoZGF0YSwgbWFzaywgZmFpbFNpbGVudGx5KSB7XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgIGlmIChmYWlsU2lsZW50bHkpIHJldHVybjtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm90IG9wZW5lZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicpIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgaWYgKG1hc2sgPT09IHVuZGVmaW5lZCkgbWFzayA9ICF0aGlzLl9pc1NlcnZlcjtcbiAgICB0aGlzLl9zZW5kZXIucG9uZyhkYXRhIHx8IGNvbnN0YW50cy5FTVBUWV9CVUZGRVIsIG1hc2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBkYXRhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5jb21wcmVzcyBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gY29tcHJlc3MgYGRhdGFgXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5iaW5hcnkgU3BlY2lmaWVzIHdoZXRoZXIgYGRhdGFgIGlzIGJpbmFyeSBvciB0ZXh0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5maW4gU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGZyYWdtZW50IGlzIHRoZSBsYXN0IG9uZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMubWFzayBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2sgd2hpY2ggaXMgZXhlY3V0ZWQgd2hlbiBkYXRhIGlzIHdyaXR0ZW4gb3V0XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNlbmQgKGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0Lk9QRU4pIHtcbiAgICAgIGlmIChjYikgY2IobmV3IEVycm9yKCdub3Qgb3BlbmVkJykpO1xuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ25vdCBvcGVuZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInKSBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYmluYXJ5OiB0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycsXG4gICAgICBtYXNrOiAhdGhpcy5faXNTZXJ2ZXIsXG4gICAgICBjb21wcmVzczogdHJ1ZSxcbiAgICAgIGZpbjogdHJ1ZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLmV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIG9wdHMuY29tcHJlc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZW5kZXIuc2VuZChkYXRhIHx8IGNvbnN0YW50cy5FTVBUWV9CVUZGRVIsIG9wdHMsIGNiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JjaWJseSBjbG9zZSB0aGUgY29ubmVjdGlvbi5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgdGVybWluYXRlICgpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuQ0xPU0VEKSByZXR1cm47XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIGlmICh0aGlzLl9yZXEgJiYgIXRoaXMuX3JlcS5hYm9ydGVkKSB7XG4gICAgICAgIHRoaXMuX3JlcS5hYm9ydCgpO1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdjbG9zZWQgYmVmb3JlIHRoZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkJykpO1xuICAgICAgICB0aGlzLmZpbmFsaXplKHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemUodHJ1ZSk7XG4gIH1cbn1cblxuV2ViU29ja2V0LkNPTk5FQ1RJTkcgPSAwO1xuV2ViU29ja2V0Lk9QRU4gPSAxO1xuV2ViU29ja2V0LkNMT1NJTkcgPSAyO1xuV2ViU29ja2V0LkNMT1NFRCA9IDM7XG5cbi8vXG4vLyBBZGQgdGhlIGBvbm9wZW5gLCBgb25lcnJvcmAsIGBvbmNsb3NlYCwgYW5kIGBvbm1lc3NhZ2VgIGF0dHJpYnV0ZXMuXG4vLyBTZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvY29tbXMuaHRtbCN0aGUtd2Vic29ja2V0LWludGVyZmFjZVxuLy9cblsnb3BlbicsICdlcnJvcicsICdjbG9zZScsICdtZXNzYWdlJ10uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXZWJTb2NrZXQucHJvdG90eXBlLCBgb24ke21ldGhvZH1gLCB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBsaXN0ZW5lciBvZiB0aGUgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHsoRnVuY3Rpb258dW5kZWZpbmVkKX0gVGhlIGV2ZW50IGxpc3RlbmVyIG9yIGB1bmRlZmluZWRgXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCAoKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyhtZXRob2QpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS5fbGlzdGVuZXIpIHJldHVybiBsaXN0ZW5lcnNbaV0uX2xpc3RlbmVyO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWRkIGEgbGlzdGVuZXIgZm9yIHRoZSBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIFRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc2V0IChsaXN0ZW5lcikge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMobWV0aG9kKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFJlbW92ZSBvbmx5IHRoZSBsaXN0ZW5lcnMgYWRkZWQgdmlhIGBhZGRFdmVudExpc3RlbmVyYC5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS5fbGlzdGVuZXIpIHRoaXMucmVtb3ZlTGlzdGVuZXIobWV0aG9kLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG1ldGhvZCwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuV2ViU29ja2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcjtcbldlYlNvY2tldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IEV2ZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBXZWJTb2NrZXQgc2VydmVyIGNsaWVudC5cbiAqXG4gKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXEgVGhlIHJlcXVlc3Qgb2JqZWN0XG4gKiBAcGFyYW0ge25ldC5Tb2NrZXR9IHNvY2tldCBUaGUgbmV0d29yayBzb2NrZXQgYmV0d2VlbiB0aGUgc2VydmVyIGFuZCBjbGllbnRcbiAqIEBwYXJhbSB7QnVmZmVyfSBoZWFkIFRoZSBmaXJzdCBwYWNrZXQgb2YgdGhlIHVwZ3JhZGVkIHN0cmVhbVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgV2ViU29ja2V0IGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnByb3RvY29sVmVyc2lvbiBUaGUgV2ViU29ja2V0IHByb3RvY29sIHZlcnNpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmV4dGVuc2lvbnMgVGhlIG5lZ290aWF0ZWQgZXh0ZW5zaW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4UGF5bG9hZCBUaGUgbWF4aW11bSBhbGxvd2VkIG1lc3NhZ2Ugc2l6ZVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucHJvdG9jb2wgVGhlIGNob3NlbiBzdWJwcm90b2NvbFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaW5pdEFzU2VydmVyQ2xpZW50IChzb2NrZXQsIGhlYWQsIG9wdGlvbnMpIHtcbiAgdGhpcy5wcm90b2NvbFZlcnNpb24gPSBvcHRpb25zLnByb3RvY29sVmVyc2lvbjtcbiAgdGhpcy5fbWF4UGF5bG9hZCA9IG9wdGlvbnMubWF4UGF5bG9hZDtcbiAgdGhpcy5leHRlbnNpb25zID0gb3B0aW9ucy5leHRlbnNpb25zO1xuICB0aGlzLnByb3RvY29sID0gb3B0aW9ucy5wcm90b2NvbDtcblxuICB0aGlzLl9pc1NlcnZlciA9IHRydWU7XG5cbiAgdGhpcy5zZXRTb2NrZXQoc29ja2V0LCBoZWFkKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGEgV2ViU29ja2V0IGNsaWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBUaGUgVVJMIHRvIHdoaWNoIHRvIGNvbm5lY3RcbiAqIEBwYXJhbSB7U3RyaW5nW119IHByb3RvY29scyBUaGUgbGlzdCBvZiBzdWJwcm90b2NvbHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIENvbm5lY3Rpb24gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucHJvdG9jb2wgVmFsdWUgb2YgdGhlIGBTZWMtV2ViU29ja2V0LVByb3RvY29sYCBoZWFkZXJcbiAqIEBwYXJhbSB7KEJvb2xlYW58T2JqZWN0KX0gb3B0aW9ucy5wZXJNZXNzYWdlRGVmbGF0ZSBFbmFibGUvZGlzYWJsZSBwZXJtZXNzYWdlLWRlZmxhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmhhbmRzaGFrZVRpbWVvdXQgVGltZW91dCBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSBoYW5kc2hha2UgcmVxdWVzdFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubG9jYWxBZGRyZXNzIExvY2FsIGludGVyZmFjZSB0byBiaW5kIGZvciBuZXR3b3JrIGNvbm5lY3Rpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wcm90b2NvbFZlcnNpb24gVmFsdWUgb2YgdGhlIGBTZWMtV2ViU29ja2V0LVZlcnNpb25gIGhlYWRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuaGVhZGVycyBBbiBvYmplY3QgY29udGFpbmluZyByZXF1ZXN0IGhlYWRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLm9yaWdpbiBWYWx1ZSBvZiB0aGUgYE9yaWdpbmAgb3IgYFNlYy1XZWJTb2NrZXQtT3JpZ2luYCBoZWFkZXJcbiAqIEBwYXJhbSB7aHR0cC5BZ2VudH0gb3B0aW9ucy5hZ2VudCBVc2UgdGhlIHNwZWNpZmllZCBBZ2VudFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuaG9zdCBWYWx1ZSBvZiB0aGUgYEhvc3RgIGhlYWRlclxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZmFtaWx5IElQIGFkZHJlc3MgZmFtaWx5IHRvIHVzZSBkdXJpbmcgaG9zdG5hbWUgbG9va3VwICg0IG9yIDYpLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5jaGVja1NlcnZlcklkZW50aXR5IEEgZnVuY3Rpb24gdG8gdmFsaWRhdGUgdGhlIHNlcnZlciBob3N0bmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCBWZXJpZnkgb3Igbm90IHRoZSBzZXJ2ZXIgY2VydGlmaWNhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnBhc3NwaHJhc2UgVGhlIHBhc3NwaHJhc2UgZm9yIHRoZSBwcml2YXRlIGtleSBvciBwZnhcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmNpcGhlcnMgVGhlIGNpcGhlcnMgdG8gdXNlIG9yIGV4Y2x1ZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmVjZGhDdXJ2ZSBUaGUgY3VydmVzIGZvciBFQ0RIIGtleSBhZ3JlZW1lbnQgdG8gdXNlIG9yIGV4Y2x1ZGVcbiAqIEBwYXJhbSB7KFN0cmluZ3xTdHJpbmdbXXxCdWZmZXJ8QnVmZmVyW10pfSBvcHRpb25zLmNlcnQgVGhlIGNlcnRpZmljYXRlIGtleVxuICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfEJ1ZmZlcnxCdWZmZXJbXSl9IG9wdGlvbnMua2V5IFRoZSBwcml2YXRlIGtleVxuICogQHBhcmFtIHsoU3RyaW5nfEJ1ZmZlcil9IG9wdGlvbnMucGZ4IFRoZSBwcml2YXRlIGtleSwgY2VydGlmaWNhdGUsIGFuZCBDQSBjZXJ0c1xuICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdfEJ1ZmZlcnxCdWZmZXJbXSl9IG9wdGlvbnMuY2EgVHJ1c3RlZCBjZXJ0aWZpY2F0ZXNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGluaXRBc0NsaWVudCAoYWRkcmVzcywgcHJvdG9jb2xzLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwcm90b2NvbFZlcnNpb246IHByb3RvY29sVmVyc2lvbnNbMV0sXG4gICAgcHJvdG9jb2w6IHByb3RvY29scy5qb2luKCcsJyksXG4gICAgcGVyTWVzc2FnZURlZmxhdGU6IHRydWUsXG4gICAgaGFuZHNoYWtlVGltZW91dDogbnVsbCxcbiAgICBsb2NhbEFkZHJlc3M6IG51bGwsXG4gICAgaGVhZGVyczogbnVsbCxcbiAgICBmYW1pbHk6IG51bGwsXG4gICAgb3JpZ2luOiBudWxsLFxuICAgIGFnZW50OiBudWxsLFxuICAgIGhvc3Q6IG51bGwsXG5cbiAgICAvL1xuICAgIC8vIFNTTCBvcHRpb25zLlxuICAgIC8vXG4gICAgY2hlY2tTZXJ2ZXJJZGVudGl0eTogbnVsbCxcbiAgICByZWplY3RVbmF1dGhvcml6ZWQ6IG51bGwsXG4gICAgcGFzc3BocmFzZTogbnVsbCxcbiAgICBjaXBoZXJzOiBudWxsLFxuICAgIGVjZGhDdXJ2ZTogbnVsbCxcbiAgICBjZXJ0OiBudWxsLFxuICAgIGtleTogbnVsbCxcbiAgICBwZng6IG51bGwsXG4gICAgY2E6IG51bGxcbiAgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKHByb3RvY29sVmVyc2lvbnMuaW5kZXhPZihvcHRpb25zLnByb3RvY29sVmVyc2lvbikgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYHVuc3VwcG9ydGVkIHByb3RvY29sIHZlcnNpb246ICR7b3B0aW9ucy5wcm90b2NvbFZlcnNpb259IGAgK1xuICAgICAgYChzdXBwb3J0ZWQgdmVyc2lvbnM6ICR7cHJvdG9jb2xWZXJzaW9ucy5qb2luKCcsICcpfSlgXG4gICAgKTtcbiAgfVxuXG4gIHRoaXMucHJvdG9jb2xWZXJzaW9uID0gb3B0aW9ucy5wcm90b2NvbFZlcnNpb247XG4gIHRoaXMuX2lzU2VydmVyID0gZmFsc2U7XG4gIHRoaXMudXJsID0gYWRkcmVzcztcblxuICBjb25zdCBzZXJ2ZXJVcmwgPSB1cmwucGFyc2UoYWRkcmVzcyk7XG4gIGNvbnN0IGlzVW5peFNvY2tldCA9IHNlcnZlclVybC5wcm90b2NvbCA9PT0gJ3dzK3VuaXg6JztcblxuICBpZiAoIXNlcnZlclVybC5ob3N0ICYmICghaXNVbml4U29ja2V0IHx8ICFzZXJ2ZXJVcmwucGF0aCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdXJsJyk7XG4gIH1cblxuICBjb25zdCBpc1NlY3VyZSA9IHNlcnZlclVybC5wcm90b2NvbCA9PT0gJ3dzczonIHx8IHNlcnZlclVybC5wcm90b2NvbCA9PT0gJ2h0dHBzOic7XG4gIGNvbnN0IGtleSA9IGNyeXB0by5yYW5kb21CeXRlcygxNikudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICBjb25zdCBodHRwT2JqID0gaXNTZWN1cmUgPyBodHRwcyA6IGh0dHA7XG5cbiAgLy9cbiAgLy8gUHJlcGFyZSBleHRlbnNpb25zLlxuICAvL1xuICBjb25zdCBleHRlbnNpb25zT2ZmZXIgPSB7fTtcbiAgdmFyIHBlck1lc3NhZ2VEZWZsYXRlO1xuXG4gIGlmIChvcHRpb25zLnBlck1lc3NhZ2VEZWZsYXRlKSB7XG4gICAgcGVyTWVzc2FnZURlZmxhdGUgPSBuZXcgUGVyTWVzc2FnZURlZmxhdGUoXG4gICAgICBvcHRpb25zLnBlck1lc3NhZ2VEZWZsYXRlICE9PSB0cnVlID8gb3B0aW9ucy5wZXJNZXNzYWdlRGVmbGF0ZSA6IHt9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIGV4dGVuc2lvbnNPZmZlcltQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXSA9IHBlck1lc3NhZ2VEZWZsYXRlLm9mZmVyKCk7XG4gIH1cblxuICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICBwb3J0OiBzZXJ2ZXJVcmwucG9ydCB8fCAoaXNTZWN1cmUgPyA0NDMgOiA4MCksXG4gICAgaG9zdDogc2VydmVyVXJsLmhvc3RuYW1lLFxuICAgIHBhdGg6ICcvJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnU2VjLVdlYlNvY2tldC1WZXJzaW9uJzogb3B0aW9ucy5wcm90b2NvbFZlcnNpb24sXG4gICAgICAnU2VjLVdlYlNvY2tldC1LZXknOiBrZXksXG4gICAgICAnQ29ubmVjdGlvbic6ICdVcGdyYWRlJyxcbiAgICAgICdVcGdyYWRlJzogJ3dlYnNvY2tldCdcbiAgICB9XG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuaGVhZGVycykgT2JqZWN0LmFzc2lnbihyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLCBvcHRpb25zLmhlYWRlcnMpO1xuICBpZiAoT2JqZWN0LmtleXMoZXh0ZW5zaW9uc09mZmVyKS5sZW5ndGgpIHtcbiAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnMnXSA9IEV4dGVuc2lvbnMuZm9ybWF0KGV4dGVuc2lvbnNPZmZlcik7XG4gIH1cbiAgaWYgKG9wdGlvbnMucHJvdG9jb2wpIHtcbiAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWMtV2ViU29ja2V0LVByb3RvY29sJ10gPSBvcHRpb25zLnByb3RvY29sO1xuICB9XG4gIGlmIChvcHRpb25zLm9yaWdpbikge1xuICAgIGlmIChvcHRpb25zLnByb3RvY29sVmVyc2lvbiA8IDEzKSB7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydTZWMtV2ViU29ja2V0LU9yaWdpbiddID0gb3B0aW9ucy5vcmlnaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMuT3JpZ2luID0gb3B0aW9ucy5vcmlnaW47XG4gICAgfVxuICB9XG4gIGlmIChvcHRpb25zLmhvc3QpIHJlcXVlc3RPcHRpb25zLmhlYWRlcnMuSG9zdCA9IG9wdGlvbnMuaG9zdDtcbiAgaWYgKHNlcnZlclVybC5hdXRoKSByZXF1ZXN0T3B0aW9ucy5hdXRoID0gc2VydmVyVXJsLmF1dGg7XG5cbiAgaWYgKG9wdGlvbnMubG9jYWxBZGRyZXNzKSByZXF1ZXN0T3B0aW9ucy5sb2NhbEFkZHJlc3MgPSBvcHRpb25zLmxvY2FsQWRkcmVzcztcbiAgaWYgKG9wdGlvbnMuZmFtaWx5KSByZXF1ZXN0T3B0aW9ucy5mYW1pbHkgPSBvcHRpb25zLmZhbWlseTtcblxuICBpZiAoaXNVbml4U29ja2V0KSB7XG4gICAgY29uc3QgcGFydHMgPSBzZXJ2ZXJVcmwucGF0aC5zcGxpdCgnOicpO1xuXG4gICAgcmVxdWVzdE9wdGlvbnMuc29ja2V0UGF0aCA9IHBhcnRzWzBdO1xuICAgIHJlcXVlc3RPcHRpb25zLnBhdGggPSBwYXJ0c1sxXTtcbiAgfSBlbHNlIGlmIChzZXJ2ZXJVcmwucGF0aCkge1xuICAgIC8vXG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgcGF0aCBzdGFydHMgd2l0aCBgL2AuXG4gICAgLy9cbiAgICBpZiAoc2VydmVyVXJsLnBhdGguY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLnBhdGggPSBgLyR7c2VydmVyVXJsLnBhdGh9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdE9wdGlvbnMucGF0aCA9IHNlcnZlclVybC5wYXRoO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhZ2VudCA9IG9wdGlvbnMuYWdlbnQ7XG5cbiAgLy9cbiAgLy8gQSBjdXN0b20gYWdlbnQgaXMgcmVxdWlyZWQgZm9yIHRoZXNlIG9wdGlvbnMuXG4gIC8vXG4gIGlmIChcbiAgICBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCAhPSBudWxsIHx8XG4gICAgb3B0aW9ucy5jaGVja1NlcnZlcklkZW50aXR5IHx8XG4gICAgb3B0aW9ucy5wYXNzcGhyYXNlIHx8XG4gICAgb3B0aW9ucy5jaXBoZXJzIHx8XG4gICAgb3B0aW9ucy5lY2RoQ3VydmUgfHxcbiAgICBvcHRpb25zLmNlcnQgfHxcbiAgICBvcHRpb25zLmtleSB8fFxuICAgIG9wdGlvbnMucGZ4IHx8XG4gICAgb3B0aW9ucy5jYVxuICApIHtcbiAgICBpZiAob3B0aW9ucy5wYXNzcGhyYXNlKSByZXF1ZXN0T3B0aW9ucy5wYXNzcGhyYXNlID0gb3B0aW9ucy5wYXNzcGhyYXNlO1xuICAgIGlmIChvcHRpb25zLmNpcGhlcnMpIHJlcXVlc3RPcHRpb25zLmNpcGhlcnMgPSBvcHRpb25zLmNpcGhlcnM7XG4gICAgaWYgKG9wdGlvbnMuZWNkaEN1cnZlKSByZXF1ZXN0T3B0aW9ucy5lY2RoQ3VydmUgPSBvcHRpb25zLmVjZGhDdXJ2ZTtcbiAgICBpZiAob3B0aW9ucy5jZXJ0KSByZXF1ZXN0T3B0aW9ucy5jZXJ0ID0gb3B0aW9ucy5jZXJ0O1xuICAgIGlmIChvcHRpb25zLmtleSkgcmVxdWVzdE9wdGlvbnMua2V5ID0gb3B0aW9ucy5rZXk7XG4gICAgaWYgKG9wdGlvbnMucGZ4KSByZXF1ZXN0T3B0aW9ucy5wZnggPSBvcHRpb25zLnBmeDtcbiAgICBpZiAob3B0aW9ucy5jYSkgcmVxdWVzdE9wdGlvbnMuY2EgPSBvcHRpb25zLmNhO1xuICAgIGlmIChvcHRpb25zLmNoZWNrU2VydmVySWRlbnRpdHkpIHtcbiAgICAgIHJlcXVlc3RPcHRpb25zLmNoZWNrU2VydmVySWRlbnRpdHkgPSBvcHRpb25zLmNoZWNrU2VydmVySWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCAhPSBudWxsKSB7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5yZWplY3RVbmF1dGhvcml6ZWQgPSBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZDtcbiAgICB9XG5cbiAgICBpZiAoIWFnZW50KSBhZ2VudCA9IG5ldyBodHRwT2JqLkFnZW50KHJlcXVlc3RPcHRpb25zKTtcbiAgfVxuXG4gIGlmIChhZ2VudCkgcmVxdWVzdE9wdGlvbnMuYWdlbnQgPSBhZ2VudDtcblxuICB0aGlzLl9yZXEgPSBodHRwT2JqLmdldChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgaWYgKG9wdGlvbnMuaGFuZHNoYWtlVGltZW91dCkge1xuICAgIHRoaXMuX3JlcS5zZXRUaW1lb3V0KG9wdGlvbnMuaGFuZHNoYWtlVGltZW91dCwgKCkgPT4ge1xuICAgICAgdGhpcy5fcmVxLmFib3J0KCk7XG4gICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdvcGVuaW5nIGhhbmRzaGFrZSBoYXMgdGltZWQgb3V0JykpO1xuICAgICAgdGhpcy5maW5hbGl6ZSh0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuX3JlcS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICBpZiAodGhpcy5fcmVxLmFib3J0ZWQpIHJldHVybjtcblxuICAgIHRoaXMuX3JlcSA9IG51bGw7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICB0aGlzLmZpbmFsaXplKHRydWUpO1xuICB9KTtcblxuICB0aGlzLl9yZXEub24oJ3Jlc3BvbnNlJywgKHJlcykgPT4ge1xuICAgIGlmICghdGhpcy5lbWl0KCd1bmV4cGVjdGVkLXJlc3BvbnNlJywgdGhpcy5fcmVxLCByZXMpKSB7XG4gICAgICB0aGlzLl9yZXEuYWJvcnQoKTtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlICgke3Jlcy5zdGF0dXNDb2RlfSlgKSk7XG4gICAgICB0aGlzLmZpbmFsaXplKHRydWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5fcmVxLm9uKCd1cGdyYWRlJywgKHJlcywgc29ja2V0LCBoZWFkKSA9PiB7XG4gICAgdGhpcy5lbWl0KCdoZWFkZXJzJywgcmVzLmhlYWRlcnMsIHJlcyk7XG5cbiAgICAvL1xuICAgIC8vIFRoZSB1c2VyIG1heSBoYXZlIGNsb3NlZCB0aGUgY29ubmVjdGlvbiBmcm9tIGEgbGlzdGVuZXIgb2YgdGhlIGBoZWFkZXJzYFxuICAgIC8vIGV2ZW50LlxuICAgIC8vXG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHJldHVybjtcblxuICAgIHRoaXMuX3JlcSA9IG51bGw7XG5cbiAgICBjb25zdCBkaWdlc3QgPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpXG4gICAgICAudXBkYXRlKGtleSArIGNvbnN0YW50cy5HVUlELCAnYmluYXJ5JylcbiAgICAgIC5kaWdlc3QoJ2Jhc2U2NCcpO1xuXG4gICAgaWYgKHJlcy5oZWFkZXJzWydzZWMtd2Vic29ja2V0LWFjY2VwdCddICE9PSBkaWdlc3QpIHtcbiAgICAgIHNvY2tldC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdpbnZhbGlkIHNlcnZlciBrZXknKSk7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZSh0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXJ2ZXJQcm90ID0gcmVzLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQtcHJvdG9jb2wnXTtcbiAgICBjb25zdCBwcm90TGlzdCA9IChvcHRpb25zLnByb3RvY29sIHx8ICcnKS5zcGxpdCgvLCAqLyk7XG4gICAgdmFyIHByb3RFcnJvcjtcblxuICAgIGlmICghb3B0aW9ucy5wcm90b2NvbCAmJiBzZXJ2ZXJQcm90KSB7XG4gICAgICBwcm90RXJyb3IgPSAnc2VydmVyIHNlbnQgYSBzdWJwcm90b2NvbCBldmVuIHRob3VnaCBub25lIHJlcXVlc3RlZCc7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnByb3RvY29sICYmICFzZXJ2ZXJQcm90KSB7XG4gICAgICBwcm90RXJyb3IgPSAnc2VydmVyIHNlbnQgbm8gc3VicHJvdG9jb2wgZXZlbiB0aG91Z2ggcmVxdWVzdGVkJztcbiAgICB9IGVsc2UgaWYgKHNlcnZlclByb3QgJiYgcHJvdExpc3QuaW5kZXhPZihzZXJ2ZXJQcm90KSA9PT0gLTEpIHtcbiAgICAgIHByb3RFcnJvciA9ICdzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggYW4gaW52YWxpZCBwcm90b2NvbCc7XG4gICAgfVxuXG4gICAgaWYgKHByb3RFcnJvcikge1xuICAgICAgc29ja2V0LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IocHJvdEVycm9yKSk7XG4gICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZSh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoc2VydmVyUHJvdCkgdGhpcy5wcm90b2NvbCA9IHNlcnZlclByb3Q7XG5cbiAgICBjb25zdCBzZXJ2ZXJFeHRlbnNpb25zID0gRXh0ZW5zaW9ucy5wYXJzZShyZXMuaGVhZGVyc1snc2VjLXdlYnNvY2tldC1leHRlbnNpb25zJ10pO1xuXG4gICAgaWYgKHBlck1lc3NhZ2VEZWZsYXRlICYmIHNlcnZlckV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBlck1lc3NhZ2VEZWZsYXRlLmFjY2VwdChzZXJ2ZXJFeHRlbnNpb25zW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzb2NrZXQuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdpbnZhbGlkIGV4dGVuc2lvbiBwYXJhbWV0ZXInKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKHRydWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0gPSBwZXJNZXNzYWdlRGVmbGF0ZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFNvY2tldChzb2NrZXQsIGhlYWQpO1xuICB9KTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9XZWJTb2NrZXQuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXZlbnRzXCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBbiBhdXRvIGluY3JlbWVudGluZyBpZCB3aGljaCB3ZSBjYW4gdXNlIHRvIGNyZWF0ZSBcInVuaXF1ZVwiIFVsdHJvbiBpbnN0YW5jZXNcbiAqIHNvIHdlIGNhbiB0cmFjayB0aGUgZXZlbnQgZW1pdHRlcnMgdGhhdCBhcmUgYWRkZWQgdGhyb3VnaCB0aGUgVWx0cm9uXG4gKiBpbnRlcmZhY2UuXG4gKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBpZCA9IDA7XG5cbi8qKlxuICogVWx0cm9uIGlzIGhpZ2gtaW50ZWxsaWdlbmNlIHJvYm90LiBJdCBnYXRoZXJzIGludGVsbGlnZW5jZSBzbyBpdCBjYW4gc3RhcnQgaW1wcm92aW5nXG4gKiB1cG9uIGhpcyBydWRpbWVudGFyeSBkZXNpZ24uIEl0IHdpbGwgbGVhcm4gZnJvbSB5b3VyIEV2ZW50RW1pdHRpbmcgcGF0dGVybnNcbiAqIGFuZCBleHRlcm1pbmF0ZSB0aGVtLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVlIEV2ZW50RW1pdHRlciBpbnN0YW5jZSB3ZSBuZWVkIHRvIHdyYXAuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBVbHRyb24oZWUpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVsdHJvbikpIHJldHVybiBuZXcgVWx0cm9uKGVlKTtcblxuICB0aGlzLmlkID0gaWQrKztcbiAgdGhpcy5lZSA9IGVlO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IEV2ZW50TGlzdGVuZXIgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Z1bmN0b259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7VWx0cm9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuVWx0cm9uLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICBmbi5fX3VsdHJvbiA9IHRoaXMuaWQ7XG4gIHRoaXMuZWUub24oZXZlbnQsIGZuLCBjb250ZXh0KTtcblxuICByZXR1cm4gdGhpcztcbn07XG4vKipcbiAqIEFkZCBhbiBFdmVudExpc3RlbmVyIHRoYXQncyBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7VWx0cm9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuVWx0cm9uLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgZm4uX191bHRyb24gPSB0aGlzLmlkO1xuICB0aGlzLmVlLm9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgd2UgYXNzaWduZWQgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcmV0dXJucyB7VWx0cm9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuVWx0cm9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzXG4gICAgLCBlZSA9IHRoaXMuZWVcbiAgICAsIGV2ZW50O1xuXG4gIC8vXG4gIC8vIFdoZW4gbm8gZXZlbnQgbmFtZXMgYXJlIHByb3ZpZGVkIHdlIGFzc3VtZSB0aGF0IHdlIG5lZWQgdG8gY2xlYXIgYWxsIHRoZVxuICAvLyBldmVudHMgdGhhdCB3ZXJlIGFzc2lnbmVkIHRocm91Z2ggdXMuXG4gIC8vXG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICBhcmdzID0gYXJnc1swXS5zcGxpdCgvWywgXSsvKTtcbiAgfSBlbHNlIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICBpZiAoZWUuZXZlbnROYW1lcykge1xuICAgICAgYXJncyA9IGVlLmV2ZW50TmFtZXMoKTtcbiAgICB9IGVsc2UgaWYgKGVlLl9ldmVudHMpIHtcbiAgICAgIGFyZ3MgPSBbXTtcblxuICAgICAgZm9yIChldmVudCBpbiBlZS5fZXZlbnRzKSB7XG4gICAgICAgIGlmIChoYXMuY2FsbChlZS5fZXZlbnRzLCBldmVudCkpIGFyZ3MucHVzaChldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGVlLl9ldmVudHMpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGlzdGVuZXJzID0gZWUubGlzdGVuZXJzKGFyZ3NbaV0pO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBsaXN0ZW5lcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGV2ZW50ID0gbGlzdGVuZXJzW2pdO1xuXG4gICAgICAvL1xuICAgICAgLy8gT25jZSBsaXN0ZW5lcnMgaGF2ZSBhIGBsaXN0ZW5lcmAgcHJvcGVydHkgdGhhdCBzdG9yZXMgdGhlIHJlYWwgbGlzdGVuZXJcbiAgICAgIC8vIGluIHRoZSBFdmVudEVtaXR0ZXIgdGhhdCBzaGlwcyB3aXRoIE5vZGUuanMuXG4gICAgICAvL1xuICAgICAgaWYgKGV2ZW50Lmxpc3RlbmVyKSB7XG4gICAgICAgIGlmIChldmVudC5saXN0ZW5lci5fX3VsdHJvbiAhPT0gdGhpcy5pZCkgY29udGludWU7XG4gICAgICAgIGRlbGV0ZSBldmVudC5saXN0ZW5lci5fX3VsdHJvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChldmVudC5fX3VsdHJvbiAhPT0gdGhpcy5pZCkgY29udGludWU7XG4gICAgICAgIGRlbGV0ZSBldmVudC5fX3VsdHJvbjtcbiAgICAgIH1cblxuICAgICAgZWUucmVtb3ZlTGlzdGVuZXIoYXJnc1tpXSwgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEZXN0cm95IHRoZSBVbHRyb24gaW5zdGFuY2UsIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGFuZCByZWxlYXNlIGFsbCByZWZlcmVuY2VzLlxuICpcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuVWx0cm9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgaWYgKCF0aGlzLmVlKSByZXR1cm4gZmFsc2U7XG5cbiAgdGhpcy5yZW1vdmUoKTtcbiAgdGhpcy5lZSA9IG51bGw7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xubW9kdWxlLmV4cG9ydHMgPSBVbHRyb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy91bHRyb24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImh0dHBcIlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1cmxcIlxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXG4gICwgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAsIGpvaW4gPSBwYXRoLmpvaW5cbiAgLCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lXG4gICwgZXhpc3RzID0gKChmcy5hY2Nlc3NTeW5jICYmIGZ1bmN0aW9uIChwYXRoKSB7IHRyeSB7IGZzLmFjY2Vzc1N5bmMocGF0aCk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IHJldHVybiB0cnVlOyB9KVxuICAgICAgfHwgZnMuZXhpc3RzU3luYyB8fCBwYXRoLmV4aXN0c1N5bmMpXG4gICwgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFycm93OiBwcm9jZXNzLmVudi5OT0RFX0JJTkRJTkdTX0FSUk9XIHx8ICcg4oaSICdcbiAgICAgICwgY29tcGlsZWQ6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQ09NUElMRURfRElSIHx8ICdjb21waWxlZCdcbiAgICAgICwgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm1cbiAgICAgICwgYXJjaDogcHJvY2Vzcy5hcmNoXG4gICAgICAsIHZlcnNpb246IHByb2Nlc3MudmVyc2lvbnMubm9kZVxuICAgICAgLCBiaW5kaW5nczogJ2JpbmRpbmdzLm5vZGUnXG4gICAgICAsIHRyeTogW1xuICAgICAgICAgIC8vIG5vZGUtZ3lwJ3MgbGlua2VkIHZlcnNpb24gaW4gdGhlIFwiYnVpbGRcIiBkaXJcbiAgICAgICAgICBbICdtb2R1bGVfcm9vdCcsICdidWlsZCcsICdiaW5kaW5ncycgXVxuICAgICAgICAgIC8vIG5vZGUtd2FmIGFuZCBneXBfYWRkb24gKGEuay5hIG5vZGUtZ3lwKVxuICAgICAgICAsIFsgJ21vZHVsZV9yb290JywgJ2J1aWxkJywgJ0RlYnVnJywgJ2JpbmRpbmdzJyBdXG4gICAgICAgICwgWyAnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnUmVsZWFzZScsICdiaW5kaW5ncycgXVxuICAgICAgICAgIC8vIERlYnVnIGZpbGVzLCBmb3IgZGV2ZWxvcG1lbnQgKGxlZ2FjeSBiZWhhdmlvciwgcmVtb3ZlIGZvciBub2RlIHYwLjkpXG4gICAgICAgICwgWyAnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ0RlYnVnJywgJ2JpbmRpbmdzJyBdXG4gICAgICAgICwgWyAnbW9kdWxlX3Jvb3QnLCAnRGVidWcnLCAnYmluZGluZ3MnIF1cbiAgICAgICAgICAvLyBSZWxlYXNlIGZpbGVzLCBidXQgbWFudWFsbHkgY29tcGlsZWQgKGxlZ2FjeSBiZWhhdmlvciwgcmVtb3ZlIGZvciBub2RlIHYwLjkpXG4gICAgICAgICwgWyAnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnIF1cbiAgICAgICAgLCBbICdtb2R1bGVfcm9vdCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJyBdXG4gICAgICAgICAgLy8gTGVnYWN5IGZyb20gbm9kZS13YWYsIG5vZGUgPD0gMC40LnhcbiAgICAgICAgLCBbICdtb2R1bGVfcm9vdCcsICdidWlsZCcsICdkZWZhdWx0JywgJ2JpbmRpbmdzJyBdXG4gICAgICAgICAgLy8gUHJvZHVjdGlvbiBcIlJlbGVhc2VcIiBidWlsZHR5cGUgYmluYXJ5IChtZWguLi4pXG4gICAgICAgICwgWyAnbW9kdWxlX3Jvb3QnLCAnY29tcGlsZWQnLCAndmVyc2lvbicsICdwbGF0Zm9ybScsICdhcmNoJywgJ2JpbmRpbmdzJyBdXG4gICAgICAgIF1cbiAgICB9XG5cbi8qKlxuICogVGhlIG1haW4gYGJpbmRpbmdzKClgIGZ1bmN0aW9uIGxvYWRzIHRoZSBjb21waWxlZCBiaW5kaW5ncyBmb3IgYSBnaXZlbiBtb2R1bGUuXG4gKiBJdCB1c2VzIFY4J3MgRXJyb3IgQVBJIHRvIGRldGVybWluZSB0aGUgcGFyZW50IGZpbGVuYW1lIHRoYXQgdGhpcyBmdW5jdGlvbiBpc1xuICogYmVpbmcgaW52b2tlZCBmcm9tLCB3aGljaCBpcyB0aGVuIHVzZWQgdG8gZmluZCB0aGUgcm9vdCBkaXJlY3RvcnkuXG4gKi9cblxuZnVuY3Rpb24gYmluZGluZ3MgKG9wdHMpIHtcblxuICAvLyBBcmd1bWVudCBzdXJnZXJ5XG4gIGlmICh0eXBlb2Ygb3B0cyA9PSAnc3RyaW5nJykge1xuICAgIG9wdHMgPSB7IGJpbmRpbmdzOiBvcHRzIH1cbiAgfSBlbHNlIGlmICghb3B0cykge1xuICAgIG9wdHMgPSB7fVxuICB9XG5cbiAgLy8gbWFwcyBgZGVmYXVsdHNgIG9udG8gYG9wdHNgIG9iamVjdFxuICBPYmplY3Qua2V5cyhkZWZhdWx0cykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICBpZiAoIShpIGluIG9wdHMpKSBvcHRzW2ldID0gZGVmYXVsdHNbaV07XG4gIH0pO1xuXG4gIC8vIEdldCB0aGUgbW9kdWxlIHJvb3RcbiAgaWYgKCFvcHRzLm1vZHVsZV9yb290KSB7XG4gICAgb3B0cy5tb2R1bGVfcm9vdCA9IGV4cG9ydHMuZ2V0Um9vdChleHBvcnRzLmdldEZpbGVOYW1lKCkpXG4gIH1cblxuICAvLyBFbnN1cmUgdGhlIGdpdmVuIGJpbmRpbmdzIG5hbWUgZW5kcyB3aXRoIC5ub2RlXG4gIGlmIChwYXRoLmV4dG5hbWUob3B0cy5iaW5kaW5ncykgIT0gJy5ub2RlJykge1xuICAgIG9wdHMuYmluZGluZ3MgKz0gJy5ub2RlJ1xuICB9XG5cbiAgdmFyIHRyaWVzID0gW11cbiAgICAsIGkgPSAwXG4gICAgLCBsID0gb3B0cy50cnkubGVuZ3RoXG4gICAgLCBuXG4gICAgLCBiXG4gICAgLCBlcnJcblxuICBmb3IgKDsgaTxsOyBpKyspIHtcbiAgICBuID0gam9pbi5hcHBseShudWxsLCBvcHRzLnRyeVtpXS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBvcHRzW3BdIHx8IHBcbiAgICB9KSlcbiAgICB0cmllcy5wdXNoKG4pXG4gICAgdHJ5IHtcbiAgICAgIGIgPSBvcHRzLnBhdGggPyByZXF1aXJlLnJlc29sdmUobikgOiByZXF1aXJlKG4pXG4gICAgICBpZiAoIW9wdHMucGF0aCkge1xuICAgICAgICBiLnBhdGggPSBuXG4gICAgICB9XG4gICAgICByZXR1cm4gYlxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmICghL25vdCBmaW5kL2kudGVzdChlLm1lc3NhZ2UpKSB7XG4gICAgICAgIHRocm93IGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnIgPSBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBsb2NhdGUgdGhlIGJpbmRpbmdzIGZpbGUuIFRyaWVkOlxcbidcbiAgICArIHRyaWVzLm1hcChmdW5jdGlvbiAoYSkgeyByZXR1cm4gb3B0cy5hcnJvdyArIGEgfSkuam9pbignXFxuJykpXG4gIGVyci50cmllcyA9IHRyaWVzXG4gIHRocm93IGVyclxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYmluZGluZ3NcblxuXG4vKipcbiAqIEdldHMgdGhlIGZpbGVuYW1lIG9mIHRoZSBKYXZhU2NyaXB0IGZpbGUgdGhhdCBpbnZva2VzIHRoaXMgZnVuY3Rpb24uXG4gKiBVc2VkIHRvIGhlbHAgZmluZCB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgYSBtb2R1bGUuXG4gKiBPcHRpb25hbGx5IGFjY2VwdHMgYW4gZmlsZW5hbWUgYXJndW1lbnQgdG8gc2tpcCB3aGVuIHNlYXJjaGluZyBmb3IgdGhlIGludm9raW5nIGZpbGVuYW1lXG4gKi9cblxuZXhwb3J0cy5nZXRGaWxlTmFtZSA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lIChjYWxsaW5nX2ZpbGUpIHtcbiAgdmFyIG9yaWdQU1QgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZVxuICAgICwgb3JpZ1NUTCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdFxuICAgICwgZHVtbXkgPSB7fVxuICAgICwgZmlsZU5hbWVcblxuICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSAxMFxuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24gKGUsIHN0KSB7XG4gICAgZm9yICh2YXIgaT0wLCBsPXN0Lmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgIGZpbGVOYW1lID0gc3RbaV0uZ2V0RmlsZU5hbWUoKVxuICAgICAgaWYgKGZpbGVOYW1lICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGlmIChjYWxsaW5nX2ZpbGUpIHtcbiAgICAgICAgICAgIGlmIChmaWxlTmFtZSAhPT0gY2FsbGluZ19maWxlKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcnVuIHRoZSAncHJlcGFyZVN0YWNrVHJhY2UnIGZ1bmN0aW9uIGFib3ZlXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KVxuICBkdW1teS5zdGFja1xuXG4gIC8vIGNsZWFudXBcbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBvcmlnUFNUXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdTVExcblxuICByZXR1cm4gZmlsZU5hbWVcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZSwgZ2l2ZW4gYW4gYXJiaXRyYXJ5IGZpbGVuYW1lXG4gKiBzb21ld2hlcmUgaW4gdGhlIG1vZHVsZSB0cmVlLiBUaGUgXCJyb290IGRpcmVjdG9yeVwiIGlzIHRoZSBkaXJlY3RvcnlcbiAqIGNvbnRhaW5pbmcgdGhlIGBwYWNrYWdlLmpzb25gIGZpbGUuXG4gKlxuICogICBJbjogIC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlL2xpYi9pbmRleC5qc1xuICogICBPdXQ6IC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlXG4gKi9cblxuZXhwb3J0cy5nZXRSb290ID0gZnVuY3Rpb24gZ2V0Um9vdCAoZmlsZSkge1xuICB2YXIgZGlyID0gZGlybmFtZShmaWxlKVxuICAgICwgcHJldlxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChkaXIgPT09ICcuJykge1xuICAgICAgLy8gQXZvaWRzIGFuIGluZmluaXRlIGxvb3AgaW4gcmFyZSBjYXNlcywgbGlrZSB0aGUgUkVQTFxuICAgICAgZGlyID0gcHJvY2Vzcy5jd2QoKVxuICAgIH1cbiAgICBpZiAoZXhpc3RzKGpvaW4oZGlyLCAncGFja2FnZS5qc29uJykpIHx8IGV4aXN0cyhqb2luKGRpciwgJ25vZGVfbW9kdWxlcycpKSkge1xuICAgICAgLy8gRm91bmQgdGhlICdwYWNrYWdlLmpzb24nIGZpbGUgb3IgJ25vZGVfbW9kdWxlcycgZGlyOyB3ZSdyZSBkb25lXG4gICAgICByZXR1cm4gZGlyXG4gICAgfVxuICAgIGlmIChwcmV2ID09PSBkaXIpIHtcbiAgICAgIC8vIEdvdCB0byB0aGUgdG9wXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIG1vZHVsZSByb290IGdpdmVuIGZpbGU6IFwiJyArIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgKyAnXCIuIERvIHlvdSBoYXZlIGEgYHBhY2thZ2UuanNvbmAgZmlsZT8gJylcbiAgICB9XG4gICAgLy8gVHJ5IHRoZSBwYXJlbnQgZGlyIG5leHRcbiAgICBwcmV2ID0gZGlyXG4gICAgZGlyID0gam9pbihkaXIsICcuLicpXG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL2JpbmRpbmdzL2JpbmRpbmdzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInLlwiKTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH07XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IDExO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL2JpbmRpbmdzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUGFyc2UgdGhlIGBTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnNgIGhlYWRlciBpbnRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgZmllbGQgdmFsdWUgb2YgdGhlIGhlYWRlclxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcGFyc2VkIG9iamVjdFxuICogQHB1YmxpY1xuICovXG5jb25zdCBwYXJzZSA9ICh2YWx1ZSkgPT4ge1xuICB2YWx1ZSA9IHZhbHVlIHx8ICcnO1xuXG4gIGNvbnN0IGV4dGVuc2lvbnMgPSB7fTtcblxuICB2YWx1ZS5zcGxpdCgnLCcpLmZvckVhY2goKHYpID0+IHtcbiAgICBjb25zdCBwYXJhbXMgPSB2LnNwbGl0KCc7Jyk7XG4gICAgY29uc3QgdG9rZW4gPSBwYXJhbXMuc2hpZnQoKS50cmltKCk7XG5cbiAgICBpZiAoZXh0ZW5zaW9uc1t0b2tlbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXh0ZW5zaW9uc1t0b2tlbl0gPSBbXTtcbiAgICB9IGVsc2UgaWYgKCFleHRlbnNpb25zLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnNlZFBhcmFtcyA9IHt9O1xuXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IHBhcmFtLnRyaW0oKS5zcGxpdCgnPScpO1xuICAgICAgY29uc3Qga2V5ID0gcGFydHNbMF07XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0c1sxXTtcblxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdW5xdW90ZSB2YWx1ZVxuICAgICAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSA9PT0gJ1wiJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgdmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcnNlZFBhcmFtc1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyc2VkUGFyYW1zW2tleV0gPSBbdmFsdWVdO1xuICAgICAgfSBlbHNlIGlmIChwYXJzZWRQYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBwYXJzZWRQYXJhbXNba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGV4dGVuc2lvbnNbdG9rZW5dLnB1c2gocGFyc2VkUGFyYW1zKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGV4dGVuc2lvbnM7XG59O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSBhIHBhcnNlZCBgU2VjLVdlYlNvY2tldC1FeHRlbnNpb25zYCBoZWFkZXIgdG8gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBvYmplY3QgdG8gZm9ybWF0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gdmFsdWVcbiAqIEBwdWJsaWNcbiAqL1xuY29uc3QgZm9ybWF0ID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKCh0b2tlbikgPT4ge1xuICAgIHZhciBwYXJhbXNMaXN0ID0gdmFsdWVbdG9rZW5dO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwYXJhbXNMaXN0KSkgcGFyYW1zTGlzdCA9IFtwYXJhbXNMaXN0XTtcbiAgICByZXR1cm4gcGFyYW1zTGlzdC5tYXAoKHBhcmFtcykgPT4ge1xuICAgICAgcmV0dXJuIFt0b2tlbl0uY29uY2F0KE9iamVjdC5rZXlzKHBhcmFtcykubWFwKChrKSA9PiB7XG4gICAgICAgIHZhciBwID0gcGFyYW1zW2tdO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocCkpIHAgPSBbcF07XG4gICAgICAgIHJldHVybiBwLm1hcCgodikgPT4gdiA9PT0gdHJ1ZSA/IGsgOiBgJHtrfT0ke3Z9YCkuam9pbignOyAnKTtcbiAgICAgIH0pKS5qb2luKCc7ICcpO1xuICAgIH0pLmpvaW4oJywgJyk7XG4gIH0pLmpvaW4oJywgJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgZm9ybWF0LCBwYXJzZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0V4dGVuc2lvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogd3M6IGEgbm9kZS5qcyB3ZWJzb2NrZXQgY2xpZW50XG4gKiBDb3B5cmlnaHQoYykgMjAxMSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2FmZUJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJyk7XG5cbmNvbnN0IFBlck1lc3NhZ2VEZWZsYXRlID0gcmVxdWlyZSgnLi9QZXJNZXNzYWdlRGVmbGF0ZScpO1xuY29uc3QgaXNWYWxpZFVURjggPSByZXF1aXJlKCcuL1ZhbGlkYXRpb24nKTtcbmNvbnN0IGJ1ZmZlclV0aWwgPSByZXF1aXJlKCcuL0J1ZmZlclV0aWwnKTtcbmNvbnN0IEVycm9yQ29kZXMgPSByZXF1aXJlKCcuL0Vycm9yQ29kZXMnKTtcbmNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vQ29uc3RhbnRzJyk7XG5cbmNvbnN0IEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyO1xuXG5jb25zdCBHRVRfSU5GTyA9IDA7XG5jb25zdCBHRVRfUEFZTE9BRF9MRU5HVEhfMTYgPSAxO1xuY29uc3QgR0VUX1BBWUxPQURfTEVOR1RIXzY0ID0gMjtcbmNvbnN0IEdFVF9NQVNLID0gMztcbmNvbnN0IEdFVF9EQVRBID0gNDtcbmNvbnN0IElORkxBVElORyA9IDU7XG5cbi8qKlxuICogSHlCaSBSZWNlaXZlciBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuY2xhc3MgUmVjZWl2ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFJlY2VpdmVyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXh0ZW5zaW9ucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbmVnb3RpYXRlZCBleHRlbnNpb25zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYXhQYXlsb2FkIFRoZSBtYXhpbXVtIGFsbG93ZWQgbWVzc2FnZSBsZW5ndGhcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJpbmFyeVR5cGUgVGhlIHR5cGUgZm9yIGJpbmFyeSBkYXRhXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoZXh0ZW5zaW9ucywgbWF4UGF5bG9hZCwgYmluYXJ5VHlwZSkge1xuICAgIHRoaXMuX2JpbmFyeVR5cGUgPSBiaW5hcnlUeXBlIHx8IGNvbnN0YW50cy5CSU5BUllfVFlQRVNbMF07XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnMgfHwge307XG4gICAgdGhpcy5fbWF4UGF5bG9hZCA9IG1heFBheWxvYWQgfCAwO1xuXG4gICAgdGhpcy5fYnVmZmVyZWRCeXRlcyA9IDA7XG4gICAgdGhpcy5fYnVmZmVycyA9IFtdO1xuXG4gICAgdGhpcy5fY29tcHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BheWxvYWRMZW5ndGggPSAwO1xuICAgIHRoaXMuX2ZyYWdtZW50ZWQgPSAwO1xuICAgIHRoaXMuX21hc2tlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2ZpbiA9IGZhbHNlO1xuICAgIHRoaXMuX21hc2sgPSBudWxsO1xuICAgIHRoaXMuX29wY29kZSA9IDA7XG5cbiAgICB0aGlzLl90b3RhbFBheWxvYWRMZW5ndGggPSAwO1xuICAgIHRoaXMuX21lc3NhZ2VMZW5ndGggPSAwO1xuICAgIHRoaXMuX2ZyYWdtZW50cyA9IFtdO1xuXG4gICAgdGhpcy5fY2xlYW51cENhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLl9oYWRFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuX2RlYWQgPSBmYWxzZTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG5cbiAgICB0aGlzLm9ubWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbmNsb3NlID0gbnVsbDtcbiAgICB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgIHRoaXMub25waW5nID0gbnVsbDtcbiAgICB0aGlzLm9ucG9uZyA9IG51bGw7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IEdFVF9JTkZPO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN1bWVzIGJ5dGVzIGZyb20gdGhlIGF2YWlsYWJsZSBidWZmZXJlZCBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYnl0ZXMgVGhlIG51bWJlciBvZiBieXRlcyB0byBjb25zdW1lXG4gICAqIEByZXR1cm4ge0J1ZmZlcn0gQ29uc3VtZWQgYnl0ZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlYWRCdWZmZXIgKGJ5dGVzKSB7XG4gICAgdmFyIG9mZnNldCA9IDA7XG4gICAgdmFyIGRzdDtcbiAgICB2YXIgbDtcblxuICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZXMgLT0gYnl0ZXM7XG5cbiAgICBpZiAoYnl0ZXMgPT09IHRoaXMuX2J1ZmZlcnNbMF0ubGVuZ3RoKSByZXR1cm4gdGhpcy5fYnVmZmVycy5zaGlmdCgpO1xuXG4gICAgaWYgKGJ5dGVzIDwgdGhpcy5fYnVmZmVyc1swXS5sZW5ndGgpIHtcbiAgICAgIGRzdCA9IHRoaXMuX2J1ZmZlcnNbMF0uc2xpY2UoMCwgYnl0ZXMpO1xuICAgICAgdGhpcy5fYnVmZmVyc1swXSA9IHRoaXMuX2J1ZmZlcnNbMF0uc2xpY2UoYnl0ZXMpO1xuICAgICAgcmV0dXJuIGRzdDtcbiAgICB9XG5cbiAgICBkc3QgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYnl0ZXMpO1xuXG4gICAgd2hpbGUgKGJ5dGVzID4gMCkge1xuICAgICAgbCA9IHRoaXMuX2J1ZmZlcnNbMF0ubGVuZ3RoO1xuXG4gICAgICBpZiAoYnl0ZXMgPj0gbCkge1xuICAgICAgICB0aGlzLl9idWZmZXJzWzBdLmNvcHkoZHN0LCBvZmZzZXQpO1xuICAgICAgICBvZmZzZXQgKz0gbDtcbiAgICAgICAgdGhpcy5fYnVmZmVycy5zaGlmdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYnVmZmVyc1swXS5jb3B5KGRzdCwgb2Zmc2V0LCAwLCBieXRlcyk7XG4gICAgICAgIHRoaXMuX2J1ZmZlcnNbMF0gPSB0aGlzLl9idWZmZXJzWzBdLnNsaWNlKGJ5dGVzKTtcbiAgICAgIH1cblxuICAgICAgYnl0ZXMgLT0gbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZHN0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgbnVtYmVyIG9mIGJ1ZmZlcmVkIGJ5dGVzIGlzIGJpZ2dlciBvciBlcXVhbCB0aGFuIGBuYCBhbmRcbiAgICogY2FsbHMgYGNsZWFudXBgIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIG51bWJlciBvZiBieXRlcyB0byBjaGVjayBhZ2FpbnN0XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgYnVmZmVyZWRCeXRlcyA+PSBuYCwgZWxzZSBgZmFsc2VgXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYXNCdWZmZXJlZEJ5dGVzIChuKSB7XG4gICAgaWYgKHRoaXMuX2J1ZmZlcmVkQnl0ZXMgPj0gbikgcmV0dXJuIHRydWU7XG5cbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuX2RlYWQpIHRoaXMuY2xlYW51cCh0aGlzLl9jbGVhbnVwQ2FsbGJhY2spO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoZSBwYXJzZXIuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGFkZCAoZGF0YSkge1xuICAgIGlmICh0aGlzLl9kZWFkKSByZXR1cm47XG5cbiAgICB0aGlzLl9idWZmZXJlZEJ5dGVzICs9IGRhdGEubGVuZ3RoO1xuICAgIHRoaXMuX2J1ZmZlcnMucHVzaChkYXRhKTtcbiAgICB0aGlzLnN0YXJ0TG9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgcGFyc2luZyBsb29wLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnRMb29wICgpIHtcbiAgICB0aGlzLl9sb29wID0gdHJ1ZTtcblxuICAgIHdoaWxlICh0aGlzLl9sb29wKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgIGNhc2UgR0VUX0lORk86XG4gICAgICAgICAgdGhpcy5nZXRJbmZvKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgR0VUX1BBWUxPQURfTEVOR1RIXzE2OlxuICAgICAgICAgIHRoaXMuZ2V0UGF5bG9hZExlbmd0aDE2KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgR0VUX1BBWUxPQURfTEVOR1RIXzY0OlxuICAgICAgICAgIHRoaXMuZ2V0UGF5bG9hZExlbmd0aDY0KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgR0VUX01BU0s6XG4gICAgICAgICAgdGhpcy5nZXRNYXNrKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgR0VUX0RBVEE6XG4gICAgICAgICAgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IC8vIGBJTkZMQVRJTkdgXG4gICAgICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgZmlyc3QgdHdvIGJ5dGVzIG9mIGEgZnJhbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRJbmZvICgpIHtcbiAgICBpZiAoIXRoaXMuaGFzQnVmZmVyZWRCeXRlcygyKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgYnVmID0gdGhpcy5yZWFkQnVmZmVyKDIpO1xuXG4gICAgaWYgKChidWZbMF0gJiAweDMwKSAhPT0gMHgwMCkge1xuICAgICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ1JTVjIgYW5kIFJTVjMgbXVzdCBiZSBjbGVhcicpLCAxMDAyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wcmVzc2VkID0gKGJ1ZlswXSAmIDB4NDApID09PSAweDQwO1xuXG4gICAgaWYgKGNvbXByZXNzZWQgJiYgIXRoaXMuX2V4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdSU1YxIG11c3QgYmUgY2xlYXInKSwgMTAwMik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZmluID0gKGJ1ZlswXSAmIDB4ODApID09PSAweDgwO1xuICAgIHRoaXMuX29wY29kZSA9IGJ1ZlswXSAmIDB4MGY7XG4gICAgdGhpcy5fcGF5bG9hZExlbmd0aCA9IGJ1ZlsxXSAmIDB4N2Y7XG5cbiAgICBpZiAodGhpcy5fb3Bjb2RlID09PSAweDAwKSB7XG4gICAgICBpZiAoY29tcHJlc3NlZCkge1xuICAgICAgICB0aGlzLmVycm9yKG5ldyBFcnJvcignUlNWMSBtdXN0IGJlIGNsZWFyJyksIDEwMDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5fZnJhZ21lbnRlZCkge1xuICAgICAgICB0aGlzLmVycm9yKG5ldyBFcnJvcihgaW52YWxpZCBvcGNvZGU6ICR7dGhpcy5fb3Bjb2RlfWApLCAxMDAyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb3Bjb2RlID0gdGhpcy5fZnJhZ21lbnRlZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX29wY29kZSA9PT0gMHgwMSB8fCB0aGlzLl9vcGNvZGUgPT09IDB4MDIpIHtcbiAgICAgIGlmICh0aGlzLl9mcmFnbWVudGVkKSB7XG4gICAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKGBpbnZhbGlkIG9wY29kZTogJHt0aGlzLl9vcGNvZGV9YCksIDEwMDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbXByZXNzZWQgPSBjb21wcmVzc2VkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fb3Bjb2RlID4gMHgwNyAmJiB0aGlzLl9vcGNvZGUgPCAweDBiKSB7XG4gICAgICBpZiAoIXRoaXMuX2Zpbikge1xuICAgICAgICB0aGlzLmVycm9yKG5ldyBFcnJvcignRklOIG11c3QgYmUgc2V0JyksIDEwMDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChjb21wcmVzc2VkKSB7XG4gICAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdSU1YxIG11c3QgYmUgY2xlYXInKSwgMTAwMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BheWxvYWRMZW5ndGggPiAweDdkKSB7XG4gICAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdpbnZhbGlkIHBheWxvYWQgbGVuZ3RoJyksIDEwMDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKGBpbnZhbGlkIG9wY29kZTogJHt0aGlzLl9vcGNvZGV9YCksIDEwMDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZmluICYmICF0aGlzLl9mcmFnbWVudGVkKSB0aGlzLl9mcmFnbWVudGVkID0gdGhpcy5fb3Bjb2RlO1xuXG4gICAgdGhpcy5fbWFza2VkID0gKGJ1ZlsxXSAmIDB4ODApID09PSAweDgwO1xuXG4gICAgaWYgKHRoaXMuX3BheWxvYWRMZW5ndGggPT09IDEyNikgdGhpcy5fc3RhdGUgPSBHRVRfUEFZTE9BRF9MRU5HVEhfMTY7XG4gICAgZWxzZSBpZiAodGhpcy5fcGF5bG9hZExlbmd0aCA9PT0gMTI3KSB0aGlzLl9zdGF0ZSA9IEdFVF9QQVlMT0FEX0xFTkdUSF82NDtcbiAgICBlbHNlIHRoaXMuaGF2ZUxlbmd0aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgZXh0ZW5kZWQgcGF5bG9hZCBsZW5ndGggKDcrMTYpLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0UGF5bG9hZExlbmd0aDE2ICgpIHtcbiAgICBpZiAoIXRoaXMuaGFzQnVmZmVyZWRCeXRlcygyKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fcGF5bG9hZExlbmd0aCA9IHRoaXMucmVhZEJ1ZmZlcigyKS5yZWFkVUludDE2QkUoMCwgdHJ1ZSk7XG4gICAgdGhpcy5oYXZlTGVuZ3RoKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBleHRlbmRlZCBwYXlsb2FkIGxlbmd0aCAoNys2NCkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRQYXlsb2FkTGVuZ3RoNjQgKCkge1xuICAgIGlmICghdGhpcy5oYXNCdWZmZXJlZEJ5dGVzKDgpKSByZXR1cm47XG5cbiAgICBjb25zdCBidWYgPSB0aGlzLnJlYWRCdWZmZXIoOCk7XG4gICAgY29uc3QgbnVtID0gYnVmLnJlYWRVSW50MzJCRSgwLCB0cnVlKTtcblxuICAgIC8vXG4gICAgLy8gVGhlIG1heGltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHQgaXMgMl41MyAtIDEuIEFuIGVycm9yIGlzIHJldHVybmVkXG4gICAgLy8gaWYgcGF5bG9hZCBsZW5ndGggaXMgZ3JlYXRlciB0aGFuIHRoaXMgbnVtYmVyLlxuICAgIC8vXG4gICAgaWYgKG51bSA+IE1hdGgucG93KDIsIDUzIC0gMzIpIC0gMSkge1xuICAgICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ21heCBwYXlsb2FkIHNpemUgZXhjZWVkZWQnKSwgMTAwOSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcGF5bG9hZExlbmd0aCA9IChudW0gKiBNYXRoLnBvdygyLCAzMikpICsgYnVmLnJlYWRVSW50MzJCRSg0LCB0cnVlKTtcbiAgICB0aGlzLmhhdmVMZW5ndGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXlsb2FkIGxlbmd0aCBoYXMgYmVlbiByZWFkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGF2ZUxlbmd0aCAoKSB7XG4gICAgaWYgKHRoaXMuX29wY29kZSA8IDB4MDggJiYgdGhpcy5tYXhQYXlsb2FkRXhjZWVkZWQodGhpcy5fcGF5bG9hZExlbmd0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbWFza2VkKSB0aGlzLl9zdGF0ZSA9IEdFVF9NQVNLO1xuICAgIGVsc2UgdGhpcy5fc3RhdGUgPSBHRVRfREFUQTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyBtYXNrIGJ5dGVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWFzayAoKSB7XG4gICAgaWYgKCF0aGlzLmhhc0J1ZmZlcmVkQnl0ZXMoNCkpIHJldHVybjtcblxuICAgIHRoaXMuX21hc2sgPSB0aGlzLnJlYWRCdWZmZXIoNCk7XG4gICAgdGhpcy5fc3RhdGUgPSBHRVRfREFUQTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyBkYXRhIGJ5dGVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0RGF0YSAoKSB7XG4gICAgdmFyIGRhdGEgPSBjb25zdGFudHMuRU1QVFlfQlVGRkVSO1xuXG4gICAgaWYgKHRoaXMuX3BheWxvYWRMZW5ndGgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNCdWZmZXJlZEJ5dGVzKHRoaXMuX3BheWxvYWRMZW5ndGgpKSByZXR1cm47XG5cbiAgICAgIGRhdGEgPSB0aGlzLnJlYWRCdWZmZXIodGhpcy5fcGF5bG9hZExlbmd0aCk7XG4gICAgICBpZiAodGhpcy5fbWFza2VkKSBidWZmZXJVdGlsLnVubWFzayhkYXRhLCB0aGlzLl9tYXNrKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3Bjb2RlID4gMHgwNykge1xuICAgICAgdGhpcy5jb250cm9sTWVzc2FnZShkYXRhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbXByZXNzZWQpIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gSU5GTEFUSU5HO1xuICAgICAgdGhpcy5kZWNvbXByZXNzKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wdXNoRnJhZ21lbnQoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YU1lc3NhZ2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVjb21wcmVzc2VzIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIENvbXByZXNzZWQgZGF0YVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjb21wcmVzcyAoZGF0YSkge1xuICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXTtcblxuICAgIHBlck1lc3NhZ2VEZWZsYXRlLmRlY29tcHJlc3MoZGF0YSwgdGhpcy5fZmluLCAoZXJyLCBidWYpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnIsIGVyci5jbG9zZUNvZGUgPT09IDEwMDkgPyAxMDA5IDogMTAwNyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHVzaEZyYWdtZW50KGJ1ZikpIHRoaXMuZGF0YU1lc3NhZ2UoKTtcbiAgICAgIHRoaXMuc3RhcnRMb29wKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBhIGRhdGEgbWVzc2FnZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRhdGFNZXNzYWdlICgpIHtcbiAgICBpZiAodGhpcy5fZmluKSB7XG4gICAgICBjb25zdCBtZXNzYWdlTGVuZ3RoID0gdGhpcy5fbWVzc2FnZUxlbmd0aDtcbiAgICAgIGNvbnN0IGZyYWdtZW50cyA9IHRoaXMuX2ZyYWdtZW50cztcblxuICAgICAgdGhpcy5fdG90YWxQYXlsb2FkTGVuZ3RoID0gMDtcbiAgICAgIHRoaXMuX21lc3NhZ2VMZW5ndGggPSAwO1xuICAgICAgdGhpcy5fZnJhZ21lbnRlZCA9IDA7XG4gICAgICB0aGlzLl9mcmFnbWVudHMgPSBbXTtcblxuICAgICAgaWYgKHRoaXMuX29wY29kZSA9PT0gMikge1xuICAgICAgICB2YXIgZGF0YTtcblxuICAgICAgICBpZiAodGhpcy5fYmluYXJ5VHlwZSA9PT0gJ25vZGVidWZmZXInKSB7XG4gICAgICAgICAgZGF0YSA9IHRvQnVmZmVyKGZyYWdtZW50cywgbWVzc2FnZUxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYmluYXJ5VHlwZSA9PT0gJ2FycmF5YnVmZmVyJykge1xuICAgICAgICAgIGRhdGEgPSB0b0FycmF5QnVmZmVyKHRvQnVmZmVyKGZyYWdtZW50cywgbWVzc2FnZUxlbmd0aCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBmcmFnbWVudHM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9ubWVzc2FnZShkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IHRvQnVmZmVyKGZyYWdtZW50cywgbWVzc2FnZUxlbmd0aCk7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkVVRGOChidWYpKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ2ludmFsaWQgdXRmOCBzZXF1ZW5jZScpLCAxMDA3KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9ubWVzc2FnZShidWYudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhdGUgPSBHRVRfSU5GTztcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEgY29udHJvbCBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YSBEYXRhIHRvIGhhbmRsZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29udHJvbE1lc3NhZ2UgKGRhdGEpIHtcbiAgICBpZiAodGhpcy5fb3Bjb2RlID09PSAweDA4KSB7XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5vbmNsb3NlKDEwMDAsICcnKTtcbiAgICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFudXAodGhpcy5fY2xlYW51cENhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ2ludmFsaWQgcGF5bG9hZCBsZW5ndGgnKSwgMTAwMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjb2RlID0gZGF0YS5yZWFkVUludDE2QkUoMCwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKCFFcnJvckNvZGVzLmlzVmFsaWRFcnJvckNvZGUoY29kZSkpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKG5ldyBFcnJvcihgaW52YWxpZCBzdGF0dXMgY29kZTogJHtjb2RlfWApLCAxMDAyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBidWYgPSBkYXRhLnNsaWNlKDIpO1xuXG4gICAgICAgIGlmICghaXNWYWxpZFVURjgoYnVmKSkge1xuICAgICAgICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdpbnZhbGlkIHV0Zjggc2VxdWVuY2UnKSwgMTAwNyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbmNsb3NlKGNvZGUsIGJ1Zi50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFudXAodGhpcy5fY2xlYW51cENhbGxiYWNrKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcGNvZGUgPT09IDB4MDkpIHRoaXMub25waW5nKGRhdGEpO1xuICAgIGVsc2UgdGhpcy5vbnBvbmcoZGF0YSk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IEdFVF9JTkZPO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVyciBUaGUgZXJyb3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgQ2xvc2UgY29kZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZXJyb3IgKGVyciwgY29kZSkge1xuICAgIHRoaXMub25lcnJvcihlcnIsIGNvZGUpO1xuICAgIHRoaXMuX2hhZEVycm9yID0gdHJ1ZTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhbnVwKHRoaXMuX2NsZWFudXBDYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHBheWxvYWQgc2l6ZSwgZGlzY29ubmVjdHMgc29ja2V0IHdoZW4gaXQgZXhjZWVkcyBgbWF4UGF5bG9hZGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggUGF5bG9hZCBsZW5ndGhcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG1heFBheWxvYWRFeGNlZWRlZCAobGVuZ3RoKSB7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCB8fCB0aGlzLl9tYXhQYXlsb2FkIDwgMSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgZnVsbExlbmd0aCA9IHRoaXMuX3RvdGFsUGF5bG9hZExlbmd0aCArIGxlbmd0aDtcblxuICAgIGlmIChmdWxsTGVuZ3RoIDw9IHRoaXMuX21heFBheWxvYWQpIHtcbiAgICAgIHRoaXMuX3RvdGFsUGF5bG9hZExlbmd0aCA9IGZ1bGxMZW5ndGg7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5lcnJvcihuZXcgRXJyb3IoJ21heCBwYXlsb2FkIHNpemUgZXhjZWVkZWQnKSwgMTAwOSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIGZyYWdtZW50IGluIHRoZSBmcmFnbWVudHMgYXJyYXkgYWZ0ZXIgY2hlY2tpbmcgdGhhdCB0aGUgc3VtIG9mXG4gICAqIGZyYWdtZW50IGxlbmd0aHMgZG9lcyBub3QgZXhjZWVkIGBtYXhQYXlsb2FkYC5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGZyYWdtZW50IFRoZSBmcmFnbWVudCB0byBhZGRcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGBtYXhQYXlsb2FkYCBpcyBub3QgZXhjZWVkZWQsIGVsc2UgYGZhbHNlYFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHVzaEZyYWdtZW50IChmcmFnbWVudCkge1xuICAgIGlmIChmcmFnbWVudC5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgdG90YWxMZW5ndGggPSB0aGlzLl9tZXNzYWdlTGVuZ3RoICsgZnJhZ21lbnQubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMuX21heFBheWxvYWQgPCAxIHx8IHRvdGFsTGVuZ3RoIDw9IHRoaXMuX21heFBheWxvYWQpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VMZW5ndGggPSB0b3RhbExlbmd0aDtcbiAgICAgIHRoaXMuX2ZyYWdtZW50cy5wdXNoKGZyYWdtZW50KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuZXJyb3IobmV3IEVycm9yKCdtYXggcGF5bG9hZCBzaXplIGV4Y2VlZGVkJyksIDEwMDkpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyByZXNvdXJjZXMgdXNlZCBieSB0aGUgcmVjZWl2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIENhbGxiYWNrXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsZWFudXAgKGNiKSB7XG4gICAgdGhpcy5fZGVhZCA9IHRydWU7XG5cbiAgICBpZiAoIXRoaXMuX2hhZEVycm9yICYmICh0aGlzLl9sb29wIHx8IHRoaXMuX3N0YXRlID09PSBJTkZMQVRJTkcpKSB7XG4gICAgICB0aGlzLl9jbGVhbnVwQ2FsbGJhY2sgPSBjYjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZXh0ZW5zaW9ucyA9IG51bGw7XG4gICAgICB0aGlzLl9mcmFnbWVudHMgPSBudWxsO1xuICAgICAgdGhpcy5fYnVmZmVycyA9IG51bGw7XG4gICAgICB0aGlzLl9tYXNrID0gbnVsbDtcblxuICAgICAgdGhpcy5fY2xlYW51cENhbGxiYWNrID0gbnVsbDtcbiAgICAgIHRoaXMub25tZXNzYWdlID0gbnVsbDtcbiAgICAgIHRoaXMub25jbG9zZSA9IG51bGw7XG4gICAgICB0aGlzLm9uZXJyb3IgPSBudWxsO1xuICAgICAgdGhpcy5vbnBpbmcgPSBudWxsO1xuICAgICAgdGhpcy5vbnBvbmcgPSBudWxsO1xuXG4gICAgICBpZiAoY2IpIGNiKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVjZWl2ZXI7XG5cbi8qKlxuICogTWFrZXMgYSBidWZmZXIgZnJvbSBhIGxpc3Qgb2YgZnJhZ21lbnRzLlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyW119IGZyYWdtZW50cyBUaGUgbGlzdCBvZiBmcmFnbWVudHMgY29tcG9zaW5nIHRoZSBtZXNzYWdlXG4gKiBAcGFyYW0ge051bWJlcn0gbWVzc2FnZUxlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlXG4gKiBAcmV0dXJuIHtCdWZmZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiB0b0J1ZmZlciAoZnJhZ21lbnRzLCBtZXNzYWdlTGVuZ3RoKSB7XG4gIGlmIChmcmFnbWVudHMubGVuZ3RoID09PSAxKSByZXR1cm4gZnJhZ21lbnRzWzBdO1xuICBpZiAoZnJhZ21lbnRzLmxlbmd0aCA+IDEpIHJldHVybiBidWZmZXJVdGlsLmNvbmNhdChmcmFnbWVudHMsIG1lc3NhZ2VMZW5ndGgpO1xuICByZXR1cm4gY29uc3RhbnRzLkVNUFRZX0JVRkZFUjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGJ1ZmZlciB0byBhbiBgQXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyfSBUaGUgYnVmZmVyIHRvIGNvbnZlcnRcbiAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBDb252ZXJ0ZWQgYnVmZmVyXG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXlCdWZmZXIgKGJ1Zikge1xuICBpZiAoYnVmLmJ5dGVPZmZzZXQgPT09IDAgJiYgYnVmLmJ5dGVMZW5ndGggPT09IGJ1Zi5idWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgIHJldHVybiBidWYuYnVmZmVyO1xuICB9XG5cbiAgcmV0dXJuIGJ1Zi5idWZmZXIuc2xpY2UoYnVmLmJ5dGVPZmZzZXQsIGJ1Zi5ieXRlT2Zmc2V0ICsgYnVmLmJ5dGVMZW5ndGgpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL1JlY2VpdmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIHdzOiBhIG5vZGUuanMgd2Vic29ja2V0IGNsaWVudFxuICogQ29weXJpZ2h0KGMpIDIwMTEgRWluYXIgT3R0byBTdGFuZ3ZpayA8ZWluYXJvc0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1ZhbGlkRXJyb3JDb2RlOiBmdW5jdGlvbiAoY29kZSkge1xuICAgIHJldHVybiAoY29kZSA+PSAxMDAwICYmIGNvZGUgPD0gMTAxMyAmJiBjb2RlICE9PSAxMDA0ICYmIGNvZGUgIT09IDEwMDUgJiYgY29kZSAhPT0gMTAwNikgfHxcbiAgICAgIChjb2RlID49IDMwMDAgJiYgY29kZSA8PSA0OTk5KTtcbiAgfSxcbiAgMTAwMDogJ25vcm1hbCcsXG4gIDEwMDE6ICdnb2luZyBhd2F5JyxcbiAgMTAwMjogJ3Byb3RvY29sIGVycm9yJyxcbiAgMTAwMzogJ3Vuc3VwcG9ydGVkIGRhdGEnLFxuICAxMDA0OiAncmVzZXJ2ZWQnLFxuICAxMDA1OiAncmVzZXJ2ZWQgZm9yIGV4dGVuc2lvbnMnLFxuICAxMDA2OiAncmVzZXJ2ZWQgZm9yIGV4dGVuc2lvbnMnLFxuICAxMDA3OiAnaW5jb25zaXN0ZW50IG9yIGludmFsaWQgZGF0YScsXG4gIDEwMDg6ICdwb2xpY3kgdmlvbGF0aW9uJyxcbiAgMTAwOTogJ21lc3NhZ2UgdG9vIGJpZycsXG4gIDEwMTA6ICdleHRlbnNpb24gaGFuZHNoYWtlIG1pc3NpbmcnLFxuICAxMDExOiAnYW4gdW5leHBlY3RlZCBjb25kaXRpb24gcHJldmVudGVkIHRoZSByZXF1ZXN0IGZyb20gYmVpbmcgZnVsZmlsbGVkJyxcbiAgMTAxMjogJ3NlcnZpY2UgcmVzdGFydCcsXG4gIDEwMTM6ICd0cnkgYWdhaW4gbGF0ZXInXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL0Vycm9yQ29kZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogd3M6IGEgbm9kZS5qcyB3ZWJzb2NrZXQgY2xpZW50XG4gKiBDb3B5cmlnaHQoYykgMjAxMSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2FmZUJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJyk7XG5jb25zdCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuY29uc3QgUGVyTWVzc2FnZURlZmxhdGUgPSByZXF1aXJlKCcuL1Blck1lc3NhZ2VEZWZsYXRlJyk7XG5jb25zdCBidWZmZXJVdGlsID0gcmVxdWlyZSgnLi9CdWZmZXJVdGlsJyk7XG5jb25zdCBFcnJvckNvZGVzID0gcmVxdWlyZSgnLi9FcnJvckNvZGVzJyk7XG5cbmNvbnN0IEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyO1xuXG4vKipcbiAqIEh5QmkgU2VuZGVyIGltcGxlbWVudGF0aW9uLlxuICovXG5jbGFzcyBTZW5kZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFNlbmRlciBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtuZXQuU29ja2V0fSBzb2NrZXQgVGhlIGNvbm5lY3Rpb24gc29ja2V0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBleHRlbnNpb25zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBuZWdvdGlhdGVkIGV4dGVuc2lvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yIChzb2NrZXQsIGV4dGVuc2lvbnMpIHtcbiAgICB0aGlzLl9leHRlbnNpb25zID0gZXh0ZW5zaW9ucyB8fCB7fTtcbiAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG5cbiAgICB0aGlzLl9maXJzdEZyYWdtZW50ID0gdHJ1ZTtcbiAgICB0aGlzLl9jb21wcmVzcyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fYnVmZmVyZWRCeXRlcyA9IDA7XG4gICAgdGhpcy5fZGVmbGF0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcmFtZXMgYSBwaWVjZSBvZiBkYXRhIGFjY29yZGluZyB0byB0aGUgSHlCaSBXZWJTb2NrZXQgcHJvdG9jb2wuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIFRoZSBkYXRhIHRvIGZyYW1lXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm9wY29kZSBUaGUgb3Bjb2RlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5yZWFkT25seSBTcGVjaWZpZXMgd2hldGhlciBgZGF0YWAgY2FuIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5maW4gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIHNldCB0aGUgRklOIGJpdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMubWFzayBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJzdjEgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIHNldCB0aGUgUlNWMSBiaXRcbiAgICogQHJldHVybiB7QnVmZmVyW119IFRoZSBmcmFtZWQgZGF0YSBhcyBhIGxpc3Qgb2YgYEJ1ZmZlcmAgaW5zdGFuY2VzXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBmcmFtZSAoZGF0YSwgb3B0aW9ucykge1xuICAgIGNvbnN0IG1lcmdlID0gZGF0YS5sZW5ndGggPCAxMDI0IHx8IChvcHRpb25zLm1hc2sgJiYgb3B0aW9ucy5yZWFkT25seSk7XG4gICAgdmFyIG9mZnNldCA9IG9wdGlvbnMubWFzayA/IDYgOiAyO1xuICAgIHZhciBwYXlsb2FkTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPj0gNjU1MzYpIHtcbiAgICAgIG9mZnNldCArPSA4O1xuICAgICAgcGF5bG9hZExlbmd0aCA9IDEyNztcbiAgICB9IGVsc2UgaWYgKGRhdGEubGVuZ3RoID4gMTI1KSB7XG4gICAgICBvZmZzZXQgKz0gMjtcbiAgICAgIHBheWxvYWRMZW5ndGggPSAxMjY7XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKG1lcmdlID8gZGF0YS5sZW5ndGggKyBvZmZzZXQgOiBvZmZzZXQpO1xuXG4gICAgdGFyZ2V0WzBdID0gb3B0aW9ucy5maW4gPyBvcHRpb25zLm9wY29kZSB8IDB4ODAgOiBvcHRpb25zLm9wY29kZTtcbiAgICBpZiAob3B0aW9ucy5yc3YxKSB0YXJnZXRbMF0gfD0gMHg0MDtcblxuICAgIGlmIChwYXlsb2FkTGVuZ3RoID09PSAxMjYpIHtcbiAgICAgIHRhcmdldC53cml0ZVVJbnQxNkJFKGRhdGEubGVuZ3RoLCAyLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHBheWxvYWRMZW5ndGggPT09IDEyNykge1xuICAgICAgdGFyZ2V0LndyaXRlVUludDMyQkUoMCwgMiwgdHJ1ZSk7XG4gICAgICB0YXJnZXQud3JpdGVVSW50MzJCRShkYXRhLmxlbmd0aCwgNiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLm1hc2spIHtcbiAgICAgIHRhcmdldFsxXSA9IHBheWxvYWRMZW5ndGg7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgZGF0YS5jb3B5KHRhcmdldCwgb2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIFt0YXJnZXRdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW3RhcmdldCwgZGF0YV07XG4gICAgfVxuXG4gICAgY29uc3QgbWFzayA9IGNyeXB0by5yYW5kb21CeXRlcyg0KTtcblxuICAgIHRhcmdldFsxXSA9IHBheWxvYWRMZW5ndGggfCAweDgwO1xuICAgIHRhcmdldFtvZmZzZXQgLSA0XSA9IG1hc2tbMF07XG4gICAgdGFyZ2V0W29mZnNldCAtIDNdID0gbWFza1sxXTtcbiAgICB0YXJnZXRbb2Zmc2V0IC0gMl0gPSBtYXNrWzJdO1xuICAgIHRhcmdldFtvZmZzZXQgLSAxXSA9IG1hc2tbM107XG5cbiAgICBpZiAobWVyZ2UpIHtcbiAgICAgIGJ1ZmZlclV0aWwubWFzayhkYXRhLCBtYXNrLCB0YXJnZXQsIG9mZnNldCwgZGF0YS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIFt0YXJnZXRdO1xuICAgIH1cblxuICAgIGJ1ZmZlclV0aWwubWFzayhkYXRhLCBtYXNrLCBkYXRhLCAwLCBkYXRhLmxlbmd0aCk7XG4gICAgcmV0dXJuIFt0YXJnZXQsIGRhdGFdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgY2xvc2UgbWVzc2FnZSB0byB0aGUgb3RoZXIgcGVlci5cbiAgICpcbiAgICogQHBhcmFtIHsoTnVtYmVyfHVuZGVmaW5lZCl9IGNvZGUgVGhlIHN0YXR1cyBjb2RlIGNvbXBvbmVudCBvZiB0aGUgYm9keVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBUaGUgbWVzc2FnZSBjb21wb25lbnQgb2YgdGhlIGJvZHlcbiAgICogQHBhcmFtIHtCb29sZWFufSBtYXNrIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIENhbGxiYWNrXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsb3NlIChjb2RlLCBkYXRhLCBtYXNrLCBjYikge1xuICAgIGlmIChjb2RlICE9PSB1bmRlZmluZWQgJiYgKHR5cGVvZiBjb2RlICE9PSAnbnVtYmVyJyB8fCAhRXJyb3JDb2Rlcy5pc1ZhbGlkRXJyb3JDb2RlKGNvZGUpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgdmFsaWQgZXJyb3IgY29kZSBudW1iZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMiArIChkYXRhID8gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSkgOiAwKSk7XG5cbiAgICBidWYud3JpdGVVSW50MTZCRShjb2RlIHx8IDEwMDAsIDAsIHRydWUpO1xuICAgIGlmIChidWYubGVuZ3RoID4gMikgYnVmLndyaXRlKGRhdGEsIDIpO1xuXG4gICAgaWYgKHRoaXMuX2RlZmxhdGluZykge1xuICAgICAgdGhpcy5lbnF1ZXVlKFt0aGlzLmRvQ2xvc2UsIGJ1ZiwgbWFzaywgY2JdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb0Nsb3NlKGJ1ZiwgbWFzaywgY2IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGcmFtZXMgYW5kIHNlbmRzIGEgY2xvc2UgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG1hc2sgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIG1hc2sgYGRhdGFgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIENhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb0Nsb3NlIChkYXRhLCBtYXNrLCBjYikge1xuICAgIHRoaXMuc2VuZEZyYW1lKFNlbmRlci5mcmFtZShkYXRhLCB7XG4gICAgICBmaW46IHRydWUsXG4gICAgICByc3YxOiBmYWxzZSxcbiAgICAgIG9wY29kZTogMHgwOCxcbiAgICAgIG1hc2ssXG4gICAgICByZWFkT25seTogZmFsc2VcbiAgICB9KSwgY2IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgcGluZyBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG1hc2sgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIG1hc2sgYGRhdGFgXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHBpbmcgKGRhdGEsIG1hc2spIHtcbiAgICB2YXIgcmVhZE9ubHkgPSB0cnVlO1xuXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IHZpZXdUb0J1ZmZlcihkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhKTtcbiAgICAgICAgcmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVmbGF0aW5nKSB7XG4gICAgICB0aGlzLmVucXVldWUoW3RoaXMuZG9QaW5nLCBkYXRhLCBtYXNrLCByZWFkT25seV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvUGluZyhkYXRhLCBtYXNrLCByZWFkT25seSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZyYW1lcyBhbmQgc2VuZHMgYSBwaW5nIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gbWFzayBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtCb29sZWFufSByZWFkT25seSBTcGVjaWZpZXMgd2hldGhlciBgZGF0YWAgY2FuIGJlIG1vZGlmaWVkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb1BpbmcgKGRhdGEsIG1hc2ssIHJlYWRPbmx5KSB7XG4gICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGRhdGEsIHtcbiAgICAgIGZpbjogdHJ1ZSxcbiAgICAgIHJzdjE6IGZhbHNlLFxuICAgICAgb3Bjb2RlOiAweDA5LFxuICAgICAgbWFzayxcbiAgICAgIHJlYWRPbmx5XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgcG9uZyBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG1hc2sgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIG1hc2sgYGRhdGFgXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHBvbmcgKGRhdGEsIG1hc2spIHtcbiAgICB2YXIgcmVhZE9ubHkgPSB0cnVlO1xuXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHtcbiAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IHZpZXdUb0J1ZmZlcihkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShkYXRhKTtcbiAgICAgICAgcmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVmbGF0aW5nKSB7XG4gICAgICB0aGlzLmVucXVldWUoW3RoaXMuZG9Qb25nLCBkYXRhLCBtYXNrLCByZWFkT25seV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvUG9uZyhkYXRhLCBtYXNrLCByZWFkT25seSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZyYW1lcyBhbmQgc2VuZHMgYSBwb25nIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWVzc2FnZSB0byBzZW5kXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gbWFzayBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtCb29sZWFufSByZWFkT25seSBTcGVjaWZpZXMgd2hldGhlciBgZGF0YWAgY2FuIGJlIG1vZGlmaWVkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb1BvbmcgKGRhdGEsIG1hc2ssIHJlYWRPbmx5KSB7XG4gICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGRhdGEsIHtcbiAgICAgIGZpbjogdHJ1ZSxcbiAgICAgIHJzdjE6IGZhbHNlLFxuICAgICAgb3Bjb2RlOiAweDBhLFxuICAgICAgbWFzayxcbiAgICAgIHJlYWRPbmx5XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgZGF0YSBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIG9iamVjdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuY29tcHJlc3MgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIGNvbXByZXNzIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuYmluYXJ5IFNwZWNpZmllcyB3aGV0aGVyIGBkYXRhYCBpcyBiaW5hcnkgb3IgdGV4dFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuZmluIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBmcmFnbWVudCBpcyB0aGUgbGFzdCBvbmVcbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLm1hc2sgU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIG1hc2sgYGRhdGFgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIENhbGxiYWNrXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNlbmQgKGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgdmFyIG9wY29kZSA9IG9wdGlvbnMuYmluYXJ5ID8gMiA6IDE7XG4gICAgdmFyIHJzdjEgPSBvcHRpb25zLmNvbXByZXNzO1xuICAgIHZhciByZWFkT25seSA9IHRydWU7XG5cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSkge1xuICAgICAgICBkYXRhID0gdmlld1RvQnVmZmVyKGRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICAgICAgICByZWFkT25seSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXTtcblxuICAgIGlmICh0aGlzLl9maXJzdEZyYWdtZW50KSB7XG4gICAgICB0aGlzLl9maXJzdEZyYWdtZW50ID0gZmFsc2U7XG4gICAgICBpZiAocnN2MSAmJiBwZXJNZXNzYWdlRGVmbGF0ZSkge1xuICAgICAgICByc3YxID0gZGF0YS5sZW5ndGggPj0gcGVyTWVzc2FnZURlZmxhdGUuX3RocmVzaG9sZDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NvbXByZXNzID0gcnN2MTtcbiAgICB9IGVsc2Uge1xuICAgICAgcnN2MSA9IGZhbHNlO1xuICAgICAgb3Bjb2RlID0gMDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5maW4pIHRoaXMuX2ZpcnN0RnJhZ21lbnQgPSB0cnVlO1xuXG4gICAgaWYgKHBlck1lc3NhZ2VEZWZsYXRlKSB7XG4gICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICBmaW46IG9wdGlvbnMuZmluLFxuICAgICAgICByc3YxLFxuICAgICAgICBvcGNvZGUsXG4gICAgICAgIG1hc2s6IG9wdGlvbnMubWFzayxcbiAgICAgICAgcmVhZE9ubHlcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLl9kZWZsYXRpbmcpIHtcbiAgICAgICAgdGhpcy5lbnF1ZXVlKFt0aGlzLmRpc3BhdGNoLCBkYXRhLCB0aGlzLl9jb21wcmVzcywgb3B0cywgY2JdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goZGF0YSwgdGhpcy5fY29tcHJlc3MsIG9wdHMsIGNiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGRhdGEsIHtcbiAgICAgICAgZmluOiBvcHRpb25zLmZpbixcbiAgICAgICAgcnN2MTogZmFsc2UsXG4gICAgICAgIG9wY29kZSxcbiAgICAgICAgbWFzazogb3B0aW9ucy5tYXNrLFxuICAgICAgICByZWFkT25seVxuICAgICAgfSksIGNiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIGRhdGEgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNvbXByZXNzIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBjb21wcmVzcyBgZGF0YWBcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3RcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMub3Bjb2RlIFRoZSBvcGNvZGVcbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnJlYWRPbmx5IFNwZWNpZmllcyB3aGV0aGVyIGBkYXRhYCBjYW4gYmUgbW9kaWZpZWRcbiAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmZpbiBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gc2V0IHRoZSBGSU4gYml0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5tYXNrIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucnN2MSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gc2V0IHRoZSBSU1YxIGJpdFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzcGF0Y2ggKGRhdGEsIGNvbXByZXNzLCBvcHRpb25zLCBjYikge1xuICAgIGlmICghY29tcHJlc3MpIHtcbiAgICAgIHRoaXMuc2VuZEZyYW1lKFNlbmRlci5mcmFtZShkYXRhLCBvcHRpb25zKSwgY2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXTtcblxuICAgIHRoaXMuX2RlZmxhdGluZyA9IHRydWU7XG4gICAgcGVyTWVzc2FnZURlZmxhdGUuY29tcHJlc3MoZGF0YSwgb3B0aW9ucy5maW4sIChfLCBidWYpID0+IHtcbiAgICAgIG9wdGlvbnMucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2VuZEZyYW1lKFNlbmRlci5mcmFtZShidWYsIG9wdGlvbnMpLCBjYik7XG4gICAgICB0aGlzLl9kZWZsYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVxdWV1ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHF1ZXVlZCBzZW5kIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZXF1ZXVlICgpIHtcbiAgICB3aGlsZSAoIXRoaXMuX2RlZmxhdGluZyAmJiB0aGlzLl9xdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG5cbiAgICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZXMgLT0gcGFyYW1zWzFdLmxlbmd0aDtcbiAgICAgIHBhcmFtc1swXS5hcHBseSh0aGlzLCBwYXJhbXMuc2xpY2UoMSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyBhIHNlbmQgb3BlcmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgU2VuZCBvcGVyYXRpb24gcGFyYW1ldGVycy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVucXVldWUgKHBhcmFtcykge1xuICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZXMgKz0gcGFyYW1zWzFdLmxlbmd0aDtcbiAgICB0aGlzLl9xdWV1ZS5wdXNoKHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBmcmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJbXX0gbGlzdCBUaGUgZnJhbWUgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VuZEZyYW1lIChsaXN0LCBjYikge1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMikge1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMF0pO1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMV0sIGNiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMF0sIGNiKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW5kZXI7XG5cbi8qKlxuICogQ29udmVydHMgYW4gYEFycmF5QnVmZmVyYCB2aWV3IGludG8gYSBidWZmZXIuXG4gKlxuICogQHBhcmFtIHsoRGF0YVZpZXd8VHlwZWRBcnJheSl9IHZpZXcgVGhlIHZpZXcgdG8gY29udmVydFxuICogQHJldHVybiB7QnVmZmVyfSBDb252ZXJ0ZWQgdmlld1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gdmlld1RvQnVmZmVyICh2aWV3KSB7XG4gIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5mcm9tKHZpZXcuYnVmZmVyKTtcblxuICBpZiAodmlldy5ieXRlTGVuZ3RoICE9PSB2aWV3LmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSh2aWV3LmJ5dGVPZmZzZXQsIHZpZXcuYnl0ZU9mZnNldCArIHZpZXcuYnl0ZUxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gYnVmO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvd3MvbGliL1NlbmRlci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG5pbXBvcnQgV2ViU29ja2V0IGZyb20gJ3dzJztcblxuY2xhc3MgVmVydHhQcm90b1N0dWIge1xuICAvKiBwcml2YXRlXG4gICAgX2NvbnRpbnVvdXNPcGVuOiBib29sZWFuXG5cbiAgICBfcnVudGltZVByb3RvU3R1YlVSTDogc3RyaW5nXG4gICAgX2J1czogTWluaUJ1c1xuICAgIF9tc2dDYWxsYmFjazogKE1lc3NhZ2UpID0+IHZvaWRcbiAgICBfY29uZmlnOiB7IHVybCwgcnVudGltZVVSTCB9XG5cbiAgICBfc29jazogKFdlYlNvY2tldCB8IFNvY2tKUylcbiAgICBfcmVPcGVuOiBib29sZWFuXG4gICovXG5cbiAgLyoqXG4gICAqIFZlcnR4IFByb3RvU3R1YiBjcmVhdGlvblxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHJ1bnRpbWVQcm90b1N0dWJVUkwgLSBVUkwgdXNlZCBpbnRlcm5hbGx5IGZvciBtZXNzYWdlIGRlbGl2ZXJ5IHBvaW50LiBOb3QgdXNlZCBmb3IgTWVzc2FnZU5vZGUgZGVsaXZlci5cbiAgICogQHBhcmFtICB7TWluaUJ1c30gYnVzIC0gTWluaUJ1cyB1c2VkIHRvIHNlbmQvcmVjZWl2ZSBtZXNzYWdlcy4gTm9ybWFsbHkgY29ubmVjdGVkIHRvIHRoZSBNZXNzYWdlQnVzLlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyAtIE1hbmRhdG9yeSBmaWVsZHMgYXJlOiBcInVybFwiIG9mIHRoZSBNZXNzYWdlTm9kZSBhZGRyZXNzIGFuZCBcInJ1bnRpbWVVUkxcIi5cbiAgICogQHJldHVybiB7VmVydHhQcm90b1N0dWJ9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihydW50aW1lUHJvdG9TdHViVVJMLCBidXMsIGNvbmZpZykge1xuICAgIGlmICghcnVudGltZVByb3RvU3R1YlVSTCkgdGhyb3cgbmV3IEVycm9yKCdUaGUgcnVudGltZVByb3RvU3R1YlVSTCBpcyBhIG5lZWRlZCBwYXJhbWV0ZXInKTtcbiAgICBpZiAoIWJ1cykgdGhyb3cgbmV3IEVycm9yKCdUaGUgYnVzIGlzIGEgbmVlZGVkIHBhcmFtZXRlcicpO1xuICAgIGlmICghY29uZmlnKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb25maWcgaXMgYSBuZWVkZWQgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoIWNvbmZpZy51cmwpIHRocm93IG5ldyBFcnJvcignVGhlIGNvbmZpZy51cmwgaXMgYSBuZWVkZWQgcGFyYW1ldGVyJyk7XG4gICAgaWYgKCFjb25maWcucnVudGltZVVSTCkgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29uZmlnLnJ1bnRpbWVVUkwgaXMgYSBuZWVkZWQgcGFyYW1ldGVyJyk7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5faWQgPSAwO1xuICAgIHRoaXMuX2NvbnRpbnVvdXNPcGVuID0gdHJ1ZTtcblxuICAgIHRoaXMuX3J1bnRpbWVQcm90b1N0dWJVUkwgPSBydW50aW1lUHJvdG9TdHViVVJMO1xuICAgIHRoaXMuX2J1cyA9IGJ1cztcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLl9ydW50aW1lU2Vzc2lvblVSTCA9IGNvbmZpZy5ydW50aW1lVVJMO1xuICAgIHRoaXMuX3JlT3BlbiA9IGZhbHNlO1xuXG4gICAgYnVzLmFkZExpc3RlbmVyKCcqJywgKG1zZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1tWZXJ0eFByb3RvU3R1Yl0gb3V0Z29pbmcgbWVzc2FnZTogJywgbXNnKTtcbiAgICAgIF90aGlzLl9vcGVuKCgpID0+IHtcbiAgICAgICAgaWYgKF90aGlzLl9maWx0ZXIobXNnKSkge1xuICAgICAgICAgIGlmICghbXNnLmJvZHkpIHtcbiAgICAgICAgICAgIG1zZy5ib2R5ID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIG1zZy5ib2R5LnZpYSA9IHRoaXMuX3J1bnRpbWVQcm90b1N0dWJVUkw7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tWZXJ0eFByb3RvU3R1YjogUHJvdG9TdHViIC0+IE1OXScsIG1zZyk7XG4gICAgICAgICAgX3RoaXMuX3NvY2suc2VuZChKU09OLnN0cmluZ2lmeShtc2cpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5fc2VuZFN0YXR1cygnY3JlYXRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBQcm90b1N0dWJcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIE1hbmRhdG9yeSBmaWVsZHMgYXJlOiBcInVybFwiIG9mIHRoZSBNZXNzYWdlTm9kZSBhZGRyZXNzIGFuZCBcInJ1bnRpbWVVUkxcIi5cbiAgICovXG4gIGdldCBjb25maWcoKSB7IHJldHVybiB0aGlzLl9jb25maWc7IH1cblxuICBnZXQgcnVudGltZVNlc3Npb24oKSB7IHJldHVybiB0aGlzLl9ydW50aW1lU2Vzc2lvblVSTDsgfVxuXG4gIC8qKlxuICAgKiBUcnkgdG8gb3BlbiB0aGUgY29ubmVjdGlvbiB0byB0aGUgTWVzc2FnZU5vZGUuIENvbm5lY3Rpb24gaXMgYXV0byBtYW5hZ2VkLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgdGhpcyBleHBsaWNpdGx5LlxuICAgKiBIb3dldmVyLCBpZiBcImRpc2Nvbm5lY3QoKVwiIGlzIGNhbGxlZCwgaXQncyBuZWNlc3NhcnkgdG8gY2FsbCB0aGlzIHRvIGVuYWJsZSBjb25uZWN0aW9ucyBhZ2Fpbi5cbiAgICogQSBzdGF0dXMgbWVzc2FnZSBpcyBzZW50IHRvIFwicnVudGltZVByb3RvU3R1YlVSTC9zdGF0dXNcIiwgY29udGFpbmluZyB0aGUgdmFsdWUgXCJjb25uZWN0ZWRcIiBpZiBzdWNjZXNzZnVsLCBvciBcImRpc2Nvbm5lY3RlZFwiIGlmIHNvbWUgZXJyb3Igb2NjdXJzLlxuICAgKi9cbiAgY29ubmVjdCgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2NvbnRpbnVvdXNPcGVuID0gdHJ1ZTtcbiAgICBfdGhpcy5fb3BlbigoKSA9PiB7fSk7XG4gIH1cblxuICAvKipcbiAgICogSXQgd2lsbCBkaXNjb25uZWN0IGFuZCBvcmRlciB0byBzdGF5IGRpc2Nvbm5lY3RlZC4gUmVjb25uZWN0aW9uIHRyaWVzLCB3aWxsIG5vdCBiZSBhdHRlbXB0ZWQsIHVubGVzcyBcImNvbm5lY3QoKVwiIGlzIGNhbGxlZC5cbiAgICogQSBzdGF0dXMgbWVzc2FnZSBpcyBzZW50IHRvIFwicnVudGltZVByb3RvU3R1YlVSTC9zdGF0dXNcIiB3aXRoIHZhbHVlIFwiZGlzY29ubmVjdGVkXCIuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fY29udGludW91c09wZW4gPSBmYWxzZTtcbiAgICBpZiAoX3RoaXMuX3NvY2spIHtcbiAgICAgIF90aGlzLl9zZW5kQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvL3RvZG86IGFkZCBkb2N1bWVudGF0aW9uXG4gIF9zZW5kT3BlbihjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cblxuICAgIHRoaXMuX3NlbmRTdGF0dXMoJ2luLXByb2dyZXNzJyk7XG5cbiAgICBfdGhpcy5faWQrKztcbiAgICBsZXQgbXNnID0ge1xuICAgICAgaWQ6IF90aGlzLl9pZCwgdHlwZTogJ29wZW4nLCBmcm9tOiBfdGhpcy5fcnVudGltZVNlc3Npb25VUkwsIHRvOiAnbW46L3Nlc3Npb24nXG4gICAgfTtcblxuICAgIGlmIChfdGhpcy5fcmVPcGVuKSB7XG4gICAgICBtc2cudHlwZSA9ICdyZS1vcGVuJztcbiAgICB9XG5cbiAgICAvL3JlZ2lzdGVyIGFuZCB3YWl0IGZvciBvcGVuIHJlcGx5Li4uXG4gICAgbGV0IGhhc1Jlc3BvbnNlID0gZmFsc2U7XG4gICAgX3RoaXMuX3Nlc3Npb25DYWxsYmFjayA9IGZ1bmN0aW9uKHJlcGx5KSB7XG4gICAgICBpZiAocmVwbHkudHlwZSA9PT0gJ3Jlc3BvbnNlJyAmIHJlcGx5LmlkID09PSBtc2cuaWQpIHtcbiAgICAgICAgaGFzUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICBpZiAocmVwbHkuYm9keS5ydW50aW1lVG9rZW4pIHtcbiAgICAgICAgICAgIC8vc2V0dXAgcnVudGltZVNlc3Npb25cbiAgICAgICAgICAgIF90aGlzLl9yZU9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgX3RoaXMuX3J1bnRpbWVTZXNzaW9uVVJMID0gX3RoaXMuX2NvbmZpZy5ydW50aW1lVVJMICsgJy8nICsgcmVwbHkuYm9keS5ydW50aW1lVG9rZW47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMuX3NlbmRTdGF0dXMoJ2xpdmUnKTtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLl9zZW5kU3RhdHVzKCdmYWlsZWQnLCByZXBseS5ib2R5LmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLl9zb2NrLnNlbmQoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIWhhc1Jlc3BvbnNlKSB7XG4gICAgICAgIC8vbm8gcmVzcG9uc2UgYWZ0ZXIgeCBzZWNvbmRzLi4uXG4gICAgICAgIF90aGlzLl9zZW5kU3RhdHVzKCdkaXNjb25uZWN0ZWQnLCAnVGltZW91dCBmcm9tIG1uOi9zZXNzaW9uJyk7XG4gICAgICB9XG4gICAgfSwgMzAwMCk7XG4gIH1cblxuICBfc2VuZENsb3NlKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5faWQrKztcbiAgICBsZXQgbXNnID0ge1xuICAgICAgaWQ6IF90aGlzLl9pZCwgdHlwZTogJ2Nsb3NlJywgZnJvbTogX3RoaXMuX3J1bnRpbWVTZXNzaW9uVVJMLCB0bzogJ21uOi9zZXNzaW9uJ1xuICAgIH07XG5cbiAgICAvL2ludmFsaWRhdGUgcnVudGltZVNlc3Npb25cbiAgICBfdGhpcy5fcmVPcGVuID0gZmFsc2U7XG4gICAgX3RoaXMuX3J1bnRpbWVTZXNzaW9uVVJMID0gX3RoaXMuX2NvbmZpZy5fcnVudGltZVVSTDtcblxuICAgIF90aGlzLl9zb2NrLnNlbmQoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG4gIH1cblxuICBfc2VuZFN0YXR1cyh2YWx1ZSwgcmVhc29uKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGNvbnNvbGUubG9nKCdbVmVydHhQcm90b3N0dWIgc3RhdHVzIGNoYW5nZWRdIHRvICcsIHZhbHVlKTtcblxuICAgIF90aGlzLl9zdGF0ZSA9IHZhbHVlO1xuXG4gICAgbGV0IG1zZyA9IHtcbiAgICAgIHR5cGU6ICd1cGRhdGUnLFxuICAgICAgZnJvbTogX3RoaXMuX3J1bnRpbWVQcm90b1N0dWJVUkwsXG4gICAgICB0bzogX3RoaXMuX3J1bnRpbWVQcm90b1N0dWJVUkwgKyAnL3N0YXR1cycsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAocmVhc29uKSB7XG4gICAgICBtc2cuYm9keS5kZXNjID0gcmVhc29uO1xuICAgIH1cblxuICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2UobXNnKTtcbiAgfVxuXG4gIF93YWl0UmVhZHkoY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90aGlzLl9zb2NrLnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBfdGhpcy5fd2FpdFJlYWR5KGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9maWx0ZXIobXNnKSB7XG4gICAgaWYgKG1zZy5ib2R5ICYmIG1zZy5ib2R5LnZpYSA9PT0gdGhpcy5fcnVudGltZVByb3RvU3R1YlVSTCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgfVxuXG4gIF9kZWxpdmVyKG1zZykge1xuICAgIGlmICghbXNnLmJvZHkpIG1zZy5ib2R5ID0ge307XG5cbiAgICBtc2cuYm9keS52aWEgPSB0aGlzLl9ydW50aW1lUHJvdG9TdHViVVJMO1xuICAgIGNvbnNvbGUubG9nKCdbVmVydHhQcm90b1N0dWI6IE1OIC0+IFByb3RvU3R1Yl0nLCBtc2cpO1xuICAgIHRoaXMuX2J1cy5wb3N0TWVzc2FnZShtc2cpO1xuICB9XG5cbiAgLy8gYWRkIGRvY3VtZW50YXRpb25cblxuICBfb3BlbihjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuX2NvbnRpbnVvdXNPcGVuKSB7XG4gICAgICAvL1RPRE86IHNlbmQgc3RhdHVzIChzZW50IG1lc3NhZ2UgZXJyb3IgLSBkaXNjb25uZWN0ZWQpXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFfdGhpcy5fc29jaykge1xuICAgICAgaWYgKF90aGlzLl9jb25maWcudXJsLnN1YnN0cmluZygwLCAyKSA9PT0gJ3dzJykge1xuICAgICAgICBfdGhpcy5fc29jayA9IG5ldyBXZWJTb2NrZXQoX3RoaXMuX2NvbmZpZy51cmwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuX3NvY2sgPSBuZXcgU29ja0pTKF90aGlzLl9jb25maWcudXJsKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuX3NvY2sub25vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLl9zZW5kT3BlbigoKSA9PiB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5fc29jay5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCBtc2cgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbVmVydHhQcm90b1N0dWI6IE1OIC0+IFNPQ0tFVCBPTiBNRVNTQUdFXScsIG1zZyk7XG4gICAgICAgIGlmIChtc2cuZnJvbSA9PT0gJ21uOi9zZXNzaW9uJykge1xuICAgICAgICAgIGlmIChfdGhpcy5fc2Vzc2lvbkNhbGxiYWNrKSB7XG4gICAgICAgICAgICBfdGhpcy5fc2Vzc2lvbkNhbGxiYWNrKG1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChfdGhpcy5fZmlsdGVyKG1zZykpIHtcbiAgICAgICAgICAgIF90aGlzLl9kZWxpdmVyKG1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5fc29jay5vbmNsb3NlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IHJlYXNvbjtcblxuICAgICAgICAvL1NlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjQ1NSNzZWN0aW9uLTcuNFxuICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gMTAwMCkge1xuICAgICAgICAgIHJlYXNvbiA9ICdOb3JtYWwgY2xvc3VyZSwgbWVhbmluZyB0aGF0IHRoZSBwdXJwb3NlIGZvciB3aGljaCB0aGUgY29ubmVjdGlvbiB3YXMgZXN0YWJsaXNoZWQgaGFzIGJlZW4gZnVsZmlsbGVkLic7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAwMSkge1xuICAgICAgICAgIHJlYXNvbiA9ICdBbiBlbmRwb2ludCBpcyBcXCdnb2luZyBhd2F5XFwnLCBzdWNoIGFzIGEgc2VydmVyIGdvaW5nIGRvd24gb3IgYSBicm93c2VyIGhhdmluZyBuYXZpZ2F0ZWQgYXdheSBmcm9tIGEgcGFnZS4nO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMDIpIHtcbiAgICAgICAgICByZWFzb24gPSAnQW4gZW5kcG9pbnQgaXMgdGVybWluYXRpbmcgdGhlIGNvbm5lY3Rpb24gZHVlIHRvIGEgcHJvdG9jb2wgZXJyb3InO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMDMpIHtcbiAgICAgICAgICByZWFzb24gPSAnQW4gZW5kcG9pbnQgaXMgdGVybWluYXRpbmcgdGhlIGNvbm5lY3Rpb24gYmVjYXVzZSBpdCBoYXMgcmVjZWl2ZWQgYSB0eXBlIG9mIGRhdGEgaXQgY2Fubm90IGFjY2VwdCAoZS5nLiwgYW4gZW5kcG9pbnQgdGhhdCB1bmRlcnN0YW5kcyBvbmx5IHRleHQgZGF0YSBNQVkgc2VuZCB0aGlzIGlmIGl0IHJlY2VpdmVzIGEgYmluYXJ5IG1lc3NhZ2UpLic7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAwNCkge1xuICAgICAgICAgIHJlYXNvbiA9ICdSZXNlcnZlZC4gVGhlIHNwZWNpZmljIG1lYW5pbmcgbWlnaHQgYmUgZGVmaW5lZCBpbiB0aGUgZnV0dXJlLic7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAwNSkge1xuICAgICAgICAgIHJlYXNvbiA9ICdObyBzdGF0dXMgY29kZSB3YXMgYWN0dWFsbHkgcHJlc2VudC4nO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMDYpIHtcbiAgICAgICAgICByZWFzb24gPSAnVGhlIGNvbm5lY3Rpb24gd2FzIGNsb3NlZCBhYm5vcm1hbGx5LCBlLmcuLCB3aXRob3V0IHNlbmRpbmcgb3IgcmVjZWl2aW5nIGEgQ2xvc2UgY29udHJvbCBmcmFtZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAwNykge1xuICAgICAgICAgIHJlYXNvbiA9ICdBbiBlbmRwb2ludCBpcyB0ZXJtaW5hdGluZyB0aGUgY29ubmVjdGlvbiBiZWNhdXNlIGl0IGhhcyByZWNlaXZlZCBkYXRhIHdpdGhpbiBhIG1lc3NhZ2UgdGhhdCB3YXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgdHlwZSBvZiB0aGUgbWVzc2FnZSAoZS5nLiwgbm9uLVVURi04IFtodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNjI5XSBkYXRhIHdpdGhpbiBhIHRleHQgbWVzc2FnZSkuJztcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5jb2RlID09PSAxMDA4KSB7XG4gICAgICAgICAgcmVhc29uID0gJ0FuIGVuZHBvaW50IGlzIHRlcm1pbmF0aW5nIHRoZSBjb25uZWN0aW9uIGJlY2F1c2UgaXQgaGFzIHJlY2VpdmVkIGEgbWVzc2FnZSB0aGF0IFwidmlvbGF0ZXMgaXRzIHBvbGljeVwiLiBUaGlzIHJlYXNvbiBpcyBnaXZlbiBlaXRoZXIgaWYgdGhlcmUgaXMgbm8gb3RoZXIgc3V0aWJsZSByZWFzb24sIG9yIGlmIHRoZXJlIGlzIGEgbmVlZCB0byBoaWRlIHNwZWNpZmljIGRldGFpbHMgYWJvdXQgdGhlIHBvbGljeS4nO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMDkpIHtcbiAgICAgICAgICByZWFzb24gPSAnQW4gZW5kcG9pbnQgaXMgdGVybWluYXRpbmcgdGhlIGNvbm5lY3Rpb24gYmVjYXVzZSBpdCBoYXMgcmVjZWl2ZWQgYSBtZXNzYWdlIHRoYXQgaXMgdG9vIGJpZyBmb3IgaXQgdG8gcHJvY2Vzcy4nO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IDEwMTApIHtcbiAgICAgICAgICByZWFzb24gPSAnQW4gZW5kcG9pbnQgKGNsaWVudCkgaXMgdGVybWluYXRpbmcgdGhlIGNvbm5lY3Rpb24gYmVjYXVzZSBpdCBoYXMgZXhwZWN0ZWQgdGhlIHNlcnZlciB0byBuZWdvdGlhdGUgb25lIG9yIG1vcmUgZXh0ZW5zaW9uLCBidXQgdGhlIHNlcnZlciBkaWRuXFwndCByZXR1cm4gdGhlbSBpbiB0aGUgcmVzcG9uc2UgbWVzc2FnZSBvZiB0aGUgV2ViU29ja2V0IGhhbmRzaGFrZS4gPGJyIC8+IFNwZWNpZmljYWxseSwgdGhlIGV4dGVuc2lvbnMgdGhhdCBhcmUgbmVlZGVkIGFyZTogJyArIGV2ZW50LnJlYXNvbjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5jb2RlID09PSAxMDExKSB7XG4gICAgICAgICAgcmVhc29uID0gJ0Egc2VydmVyIGlzIHRlcm1pbmF0aW5nIHRoZSBjb25uZWN0aW9uIGJlY2F1c2UgaXQgZW5jb3VudGVyZWQgYW4gdW5leHBlY3RlZCBjb25kaXRpb24gdGhhdCBwcmV2ZW50ZWQgaXQgZnJvbSBmdWxmaWxsaW5nIHRoZSByZXF1ZXN0Lic7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gMTAxNSkge1xuICAgICAgICAgIHJlYXNvbiA9ICdUaGUgY29ubmVjdGlvbiB3YXMgY2xvc2VkIGR1ZSB0byBhIGZhaWx1cmUgdG8gcGVyZm9ybSBhIFRMUyBoYW5kc2hha2UgKGUuZy4sIHRoZSBzZXJ2ZXIgY2VydGlmaWNhdGUgY2FuXFwndCBiZSB2ZXJpZmllZCkuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWFzb24gPSAnVW5rbm93biByZWFzb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIF90aGlzLl9zb2NrO1xuICAgICAgICBfdGhpcy5fc2VuZFN0YXR1cygnZGlzY29ubmVjdGVkJywgcmVhc29uKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIF90aGlzLl93YWl0UmVhZHkoY2FsbGJhY2spO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhY3RpdmF0ZSh1cmwsIGJ1cywgY29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1ZlcnR4UHJvdG9TdHViJyxcbiAgICBpbnN0YW5jZTogbmV3IFZlcnR4UHJvdG9TdHViKHVybCwgYnVzLCBjb25maWcpXG4gIH07XG59XG5cbi8qKlxuKiBDYWxsYmFjayB1c2VkIHRvIHNlbmQgbWVzc2FnZXNcbiogQGNhbGxiYWNrIFBvc3RNZXNzYWdlXG4qIEBwYXJhbSB7TWVzc2FnZX0gbXNnIC0gTWVzc2FnZSB0byBzZW5kXG4qL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvVmVydHhQcm90b1N0dWJOb2RlLnBzLmpzIiwiLyohXG4gKiB3czogYSBub2RlLmpzIHdlYnNvY2tldCBjbGllbnRcbiAqIENvcHlyaWdodChjKSAyMDExIEVpbmFyIE90dG8gU3Rhbmd2aWsgPGVpbmFyb3NAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBXZWJTb2NrZXQgPSByZXF1aXJlKCcuL2xpYi9XZWJTb2NrZXQnKTtcblxuV2ViU29ja2V0LlNlcnZlciA9IHJlcXVpcmUoJy4vbGliL1dlYlNvY2tldFNlcnZlcicpO1xuV2ViU29ja2V0LlJlY2VpdmVyID0gcmVxdWlyZSgnLi9saWIvUmVjZWl2ZXInKTtcbldlYlNvY2tldC5TZW5kZXIgPSByZXF1aXJlKCcuL2xpYi9TZW5kZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWJTb2NrZXQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJodHRwc1wiXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJidWZmZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJidWZmZXJcIlxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBRdWV1ZShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBRdWV1ZSkpIHtcbiAgICByZXR1cm4gbmV3IFF1ZXVlKG9wdGlvbnMpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMuY29uY3VycmVuY3kgPSBvcHRpb25zLmNvbmN1cnJlbmN5IHx8IEluZmluaXR5O1xuICB0aGlzLnBlbmRpbmcgPSAwO1xuICB0aGlzLmpvYnMgPSBbXTtcbiAgdGhpcy5jYnMgPSBbXTtcbiAgdGhpcy5fZG9uZSA9IGRvbmUuYmluZCh0aGlzKTtcbn1cblxudmFyIGFycmF5QWRkTWV0aG9kcyA9IFtcbiAgJ3B1c2gnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnXG5dO1xuXG5hcnJheUFkZE1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgUXVldWUucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0aG9kUmVzdWx0ID0gQXJyYXkucHJvdG90eXBlW21ldGhvZF0uYXBwbHkodGhpcy5qb2JzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuX3J1bigpO1xuICAgIHJldHVybiBtZXRob2RSZXN1bHQ7XG4gIH07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1ZXVlLnByb3RvdHlwZSwgJ2xlbmd0aCcsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wZW5kaW5nICsgdGhpcy5qb2JzLmxlbmd0aDtcbiAgfVxufSk7XG5cblF1ZXVlLnByb3RvdHlwZS5fcnVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnBlbmRpbmcgPT09IHRoaXMuY29uY3VycmVuY3kpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHRoaXMuam9icy5sZW5ndGgpIHtcbiAgICB2YXIgam9iID0gdGhpcy5qb2JzLnNoaWZ0KCk7XG4gICAgdGhpcy5wZW5kaW5nKys7XG4gICAgam9iKHRoaXMuX2RvbmUpO1xuICAgIHRoaXMuX3J1bigpO1xuICB9XG5cbiAgaWYgKHRoaXMucGVuZGluZyA9PT0gMCkge1xuICAgIHdoaWxlICh0aGlzLmNicy5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBjYiA9IHRoaXMuY2JzLnBvcCgpO1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYik7XG4gICAgfVxuICB9XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUub25Eb25lID0gZnVuY3Rpb24oY2IpIHtcbiAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuY2JzLnB1c2goY2IpO1xuICAgIHRoaXMuX3J1bigpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkb25lKCkge1xuICB0aGlzLnBlbmRpbmctLTtcbiAgdGhpcy5fcnVuKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy9hc3luYy1saW1pdGVyL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiemxpYlwiXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnRyeSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnYmluZGluZ3MnKSgnYnVmZmVydXRpbCcpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFsbGJhY2snKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL2J1ZmZlcnV0aWwvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZnNcIlxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiBidWZmZXJ1dGlsOiBXZWJTb2NrZXQgYnVmZmVyIHV0aWxzXG4gKiBDb3B5cmlnaHQoYykgMjAxNSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNYXNrcyBhIGJ1ZmZlciB1c2luZyB0aGUgZ2l2ZW4gbWFzay5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gc291cmNlIFRoZSBidWZmZXIgdG8gbWFza1xuICogQHBhcmFtIHtCdWZmZXJ9IG1hc2sgVGhlIG1hc2sgdG8gdXNlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gb3V0cHV0IFRoZSBidWZmZXIgd2hlcmUgdG8gc3RvcmUgdGhlIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBUaGUgb2Zmc2V0IGF0IHdoaWNoIHRvIHN0YXJ0IHdyaXRpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIG51bWJlciBvZiBieXRlcyB0byBtYXNrLlxuICogQHB1YmxpY1xuICovXG5jb25zdCBtYXNrID0gKHNvdXJjZSwgbWFzaywgb3V0cHV0LCBvZmZzZXQsIGxlbmd0aCkgPT4ge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0W29mZnNldCArIGldID0gc291cmNlW2ldIF4gbWFza1tpICYgM107XG4gIH1cbn07XG5cbi8qKlxuICogVW5tYXNrcyBhIGJ1ZmZlciB1c2luZyB0aGUgZ2l2ZW4gbWFzay5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gdW5tYXNrXG4gKiBAcGFyYW0ge0J1ZmZlcn0gbWFzayBUaGUgbWFzayB0byB1c2VcbiAqIEBwdWJsaWNcbiAqL1xuY29uc3QgdW5tYXNrID0gKGJ1ZmZlciwgbWFzaykgPT4ge1xuICAvLyBSZXF1aXJlZCB1bnRpbCBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzkwMDYgaXMgcmVzb2x2ZWQuXG4gIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBidWZmZXJbaV0gXj0gbWFza1tpICYgM107XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBtYXNrLCB1bm1hc2sgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL2J1ZmZlcnV0aWwvZmFsbGJhY2suanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gZXZlbnQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgRXZlbnQge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBFdmVudGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBuYW1lIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IEEgcmVmZXJlbmNlIHRvIHRoZSB0YXJnZXQgdG8gd2hpY2ggdGhlIGV2ZW50IHdhcyBkaXNwYXRjaGVkXG4gICAqL1xuICBjb25zdHJ1Y3RvciAodHlwZSwgdGFyZ2V0KSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIG1lc3NhZ2UgZXZlbnQuXG4gKlxuICogQGV4dGVuZHMgRXZlbnRcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIE1lc3NhZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgTWVzc2FnZUV2ZW50YC5cbiAgICpcbiAgICogQHBhcmFtIHsoU3RyaW5nfEJ1ZmZlcnxBcnJheUJ1ZmZlcnxCdWZmZXJbXSl9IGRhdGEgVGhlIHJlY2VpdmVkIGRhdGFcbiAgICogQHBhcmFtIHtXZWJTb2NrZXR9IHRhcmdldCBBIHJlZmVyZW5jZSB0byB0aGUgdGFyZ2V0IHRvIHdoaWNoIHRoZSBldmVudCB3YXMgZGlzcGF0Y2hlZFxuICAgKi9cbiAgY29uc3RydWN0b3IgKGRhdGEsIHRhcmdldCkge1xuICAgIHN1cGVyKCdtZXNzYWdlJywgdGFyZ2V0KTtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBjbG9zZSBldmVudC5cbiAqXG4gKiBAZXh0ZW5kcyBFdmVudFxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgQ2xvc2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQ2xvc2VFdmVudGAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlIFRoZSBzdGF0dXMgY29kZSBleHBsYWluaW5nIHdoeSB0aGUgY29ubmVjdGlvbiBpcyBiZWluZyBjbG9zZWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlYXNvbiBBIGh1bWFuLXJlYWRhYmxlIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgY29ubmVjdGlvbiBpcyBjbG9zaW5nXG4gICAqIEBwYXJhbSB7V2ViU29ja2V0fSB0YXJnZXQgQSByZWZlcmVuY2UgdG8gdGhlIHRhcmdldCB0byB3aGljaCB0aGUgZXZlbnQgd2FzIGRpc3BhdGNoZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yIChjb2RlLCByZWFzb24sIHRhcmdldCkge1xuICAgIHN1cGVyKCdjbG9zZScsIHRhcmdldCk7XG5cbiAgICB0aGlzLndhc0NsZWFuID0gY29kZSA9PT0gdW5kZWZpbmVkIHx8IGNvZGUgPT09IDEwMDAgfHwgKGNvZGUgPj0gMzAwMCAmJiBjb2RlIDw9IDQ5OTkpO1xuICAgIHRoaXMucmVhc29uID0gcmVhc29uO1xuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gb3BlbiBldmVudC5cbiAqXG4gKiBAZXh0ZW5kcyBFdmVudFxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgT3BlbkV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBPcGVuRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1dlYlNvY2tldH0gdGFyZ2V0IEEgcmVmZXJlbmNlIHRvIHRoZSB0YXJnZXQgdG8gd2hpY2ggdGhlIGV2ZW50IHdhcyBkaXNwYXRjaGVkXG4gICAqL1xuICBjb25zdHJ1Y3RvciAodGFyZ2V0KSB7XG4gICAgc3VwZXIoJ29wZW4nLCB0YXJnZXQpO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBwcm92aWRlcyBtZXRob2RzIGZvciBlbXVsYXRpbmcgdGhlIGBFdmVudFRhcmdldGAgaW50ZXJmYWNlLiBJdCdzIG5vdFxuICogbWVhbnQgdG8gYmUgdXNlZCBkaXJlY3RseS5cbiAqXG4gKiBAbWl4aW5cbiAqL1xuY29uc3QgRXZlbnRUYXJnZXQgPSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgdG8gYWRkXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIgKG1ldGhvZCwgbGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICBmdW5jdGlvbiBvbk1lc3NhZ2UgKGRhdGEpIHtcbiAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgbmV3IE1lc3NhZ2VFdmVudChkYXRhLCB0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25DbG9zZSAoY29kZSwgbWVzc2FnZSkge1xuICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBuZXcgQ2xvc2VFdmVudChjb2RlLCBtZXNzYWdlLCB0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25FcnJvciAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnR5cGUgPSAnZXJyb3InO1xuICAgICAgZXZlbnQudGFyZ2V0ID0gdGhpcztcbiAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uT3BlbiAoKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIG5ldyBPcGVuRXZlbnQodGhpcykpO1xuICAgIH1cblxuICAgIGlmIChtZXRob2QgPT09ICdtZXNzYWdlJykge1xuICAgICAgb25NZXNzYWdlLl9saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgICAgdGhpcy5vbihtZXRob2QsIG9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdjbG9zZScpIHtcbiAgICAgIG9uQ2xvc2UuX2xpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICB0aGlzLm9uKG1ldGhvZCwgb25DbG9zZSk7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdlcnJvcicpIHtcbiAgICAgIG9uRXJyb3IuX2xpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICB0aGlzLm9uKG1ldGhvZCwgb25FcnJvcik7XG4gICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdvcGVuJykge1xuICAgICAgb25PcGVuLl9saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgICAgdGhpcy5vbihtZXRob2QsIG9uT3Blbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub24obWV0aG9kLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIgKG1ldGhvZCwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyhtZXRob2QpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RlbmVyc1tpXS5fbGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIobWV0aG9kLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFRhcmdldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9FdmVudFRhcmdldC5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiB3czogYSBub2RlLmpzIHdlYnNvY2tldCBjbGllbnRcbiAqIENvcHlyaWdodChjKSAyMDExIEVpbmFyIE90dG8gU3Rhbmd2aWsgPGVpbmFyb3NAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG50cnkge1xuICBjb25zdCBpc1ZhbGlkVVRGOCA9IHJlcXVpcmUoJ3V0Zi04LXZhbGlkYXRlJyk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgaXNWYWxpZFVURjggPT09ICdvYmplY3QnXG4gICAgPyBpc1ZhbGlkVVRGOC5WYWxpZGF0aW9uLmlzVmFsaWRVVEY4IC8vIHV0Zi04LXZhbGlkYXRlQDwzLjAuMFxuICAgIDogaXNWYWxpZFVURjg7XG59IGNhdGNoIChlKSAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyB7XG4gIG1vZHVsZS5leHBvcnRzID0gKCkgPT4gdHJ1ZTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3dzL2xpYi9WYWxpZGF0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnRyeSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnYmluZGluZ3MnKSgndmFsaWRhdGlvbicpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFsbGJhY2snKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2Rldi1wcm90b3N0dWJzL3NyYy9wcm90b3N0dWIvdmVydHgvbm9kZV9tb2R1bGVzL3V0Zi04LXZhbGlkYXRlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIFVURi04IHZhbGlkYXRlOiBVVEYtOCB2YWxpZGF0aW9uIGZvciBXZWJTb2NrZXRzLlxuICogQ29weXJpZ2h0KGMpIDIwMTUgRWluYXIgT3R0byBTdGFuZ3ZpayA8ZWluYXJvc0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gYnVmZmVyIGNvbnRhaW5zIG9ubHkgY29ycmVjdCBVVEYtOC5cbiAqIFBvcnRlZCBmcm9tIGh0dHBzOi8vd3d3LmNsLmNhbS5hYy51ay8lN0VtZ2syNS91Y3MvdXRmOF9jaGVjay5jIGJ5XG4gKiBNYXJrdXMgS3Vobi5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmIFRoZSBidWZmZXIgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgYnVmYCBjb250YWlucyBvbmx5IGNvcnJlY3QgVVRGLTgsIGVsc2UgYGZhbHNlYFxuICogQHB1YmxpY1xuICovXG5jb25zdCBpc1ZhbGlkVVRGOCA9IChidWYpID0+IHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgYnVmZmVyJyk7XG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgaWYgKGJ1ZltpXSA8IDB4ODApIHsgIC8vIDB4eHh4eHh4XG4gICAgICBpKys7XG4gICAgfSBlbHNlIGlmICgoYnVmW2ldICYgMHhlMCkgPT09IDB4YzApIHsgIC8vIDExMHh4eHh4IDEweHh4eHh4XG4gICAgICBpZiAoXG4gICAgICAgIGkgKyAxID09PSBsZW4gfHxcbiAgICAgICAgKGJ1ZltpICsgMV0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICAoYnVmW2ldICYgMHhmZSkgPT09IDB4YzAgIC8vIG92ZXJsb25nXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGJ1ZltpXSAmIDB4ZjApID09PSAweGUwKSB7ICAvLyAxMTEweHh4eCAxMHh4eHh4eCAxMHh4eHh4eFxuICAgICAgaWYgKFxuICAgICAgICBpICsgMiA+PSBsZW4gfHxcbiAgICAgICAgKGJ1ZltpICsgMV0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICAoYnVmW2kgKyAyXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIGJ1ZltpXSA9PT0gMHhlMCAmJiAoYnVmW2kgKyAxXSAmIDB4ZTApID09PSAweDgwIHx8ICAvLyBvdmVybG9uZ1xuICAgICAgICBidWZbaV0gPT09IDB4ZWQgJiYgKGJ1ZltpICsgMV0gJiAweGUwKSA9PT0gMHhhMCAgICAgLy8gc3Vycm9nYXRlIChVK0Q4MDAgLSBVK0RGRkYpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSArPSAzO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGJ1ZltpXSAmIDB4ZjgpID09PSAweGYwKSB7ICAvLyAxMTExMHh4eCAxMHh4eHh4eCAxMHh4eHh4eCAxMHh4eHh4eFxuICAgICAgaWYgKFxuICAgICAgICBpICsgMyA+PSBsZW4gfHxcbiAgICAgICAgKGJ1ZltpICsgMV0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICAoYnVmW2kgKyAyXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIChidWZbaSArIDNdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgYnVmW2ldID09PSAweGYwICYmIChidWZbaSArIDFdICYgMHhmMCkgPT09IDB4ODAgfHwgIC8vIG92ZXJsb25nXG4gICAgICAgIGJ1ZltpXSA9PT0gMHhmNCAmJiBidWZbaSArIDFdID4gMHg4ZiB8fCBidWZbaV0gPiAweGY0ICAvLyA+IFUrMTBGRkZGXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSArPSA0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVmFsaWRVVEY4O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vZGV2LXByb3Rvc3R1YnMvc3JjL3Byb3Rvc3R1Yi92ZXJ0eC9ub2RlX21vZHVsZXMvdXRmLTgtdmFsaWRhdGUvZmFsbGJhY2suanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogd3M6IGEgbm9kZS5qcyB3ZWJzb2NrZXQgY2xpZW50XG4gKiBDb3B5cmlnaHQoYykgMjAxMSBFaW5hciBPdHRvIFN0YW5ndmlrIDxlaW5hcm9zQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc2FmZUJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJyk7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuY29uc3QgVWx0cm9uID0gcmVxdWlyZSgndWx0cm9uJyk7XG5jb25zdCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbmNvbnN0IFBlck1lc3NhZ2VEZWZsYXRlID0gcmVxdWlyZSgnLi9QZXJNZXNzYWdlRGVmbGF0ZScpO1xuY29uc3QgRXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vRXh0ZW5zaW9ucycpO1xuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db25zdGFudHMnKTtcbmNvbnN0IFdlYlNvY2tldCA9IHJlcXVpcmUoJy4vV2ViU29ja2V0Jyk7XG5cbmNvbnN0IEJ1ZmZlciA9IHNhZmVCdWZmZXIuQnVmZmVyO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIFdlYlNvY2tldCBzZXJ2ZXIuXG4gKlxuICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKi9cbmNsYXNzIFdlYlNvY2tldFNlcnZlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgV2ViU29ja2V0U2VydmVyYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmhvc3QgVGhlIGhvc3RuYW1lIHdoZXJlIHRvIGJpbmQgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5wb3J0IFRoZSBwb3J0IHdoZXJlIHRvIGJpbmQgdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge2h0dHAuU2VydmVyfSBvcHRpb25zLnNlcnZlciBBIHByZS1jcmVhdGVkIEhUVFAvUyBzZXJ2ZXIgdG8gdXNlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMudmVyaWZ5Q2xpZW50IEFuIGhvb2sgdG8gcmVqZWN0IGNvbm5lY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuaGFuZGxlUHJvdG9jb2xzIEFuIGhvb2sgdG8gaGFuZGxlIHByb3RvY29sc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wYXRoIEFjY2VwdCBvbmx5IGNvbm5lY3Rpb25zIG1hdGNoaW5nIHRoaXMgcGF0aFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMubm9TZXJ2ZXIgRW5hYmxlIG5vIHNlcnZlciBtb2RlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5jbGllbnRUcmFja2luZyBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gdHJhY2sgY2xpZW50c1xuICAgKiBAcGFyYW0geyhCb29sZWFufE9iamVjdCl9IG9wdGlvbnMucGVyTWVzc2FnZURlZmxhdGUgRW5hYmxlL2Rpc2FibGUgcGVybWVzc2FnZS1kZWZsYXRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1heFBheWxvYWQgVGhlIG1heGltdW0gYWxsb3dlZCBtZXNzYWdlIHNpemVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBsaXN0ZW5lciBmb3IgdGhlIGBsaXN0ZW5pbmdgIGV2ZW50XG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBzdXBlcigpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgbWF4UGF5bG9hZDogMTAwICogMTAyNCAqIDEwMjQsXG4gICAgICBwZXJNZXNzYWdlRGVmbGF0ZTogZmFsc2UsXG4gICAgICBoYW5kbGVQcm90b2NvbHM6IG51bGwsXG4gICAgICBjbGllbnRUcmFja2luZzogdHJ1ZSxcbiAgICAgIHZlcmlmeUNsaWVudDogbnVsbCxcbiAgICAgIG5vU2VydmVyOiBmYWxzZSxcbiAgICAgIGJhY2tsb2c6IG51bGwsIC8vIHVzZSBkZWZhdWx0ICg1MTEgYXMgaW1wbGVtZW50ZWQgaW4gbmV0LmpzKVxuICAgICAgc2VydmVyOiBudWxsLFxuICAgICAgaG9zdDogbnVsbCxcbiAgICAgIHBhdGg6IG51bGwsXG4gICAgICBwb3J0OiBudWxsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5wb3J0ID09IG51bGwgJiYgIW9wdGlvbnMuc2VydmVyICYmICFvcHRpb25zLm5vU2VydmVyKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtaXNzaW5nIG9yIGludmFsaWQgb3B0aW9ucycpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnBvcnQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBodHRwLlNUQVRVU19DT0RFU1s0MjZdO1xuXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDI2LCB7XG4gICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLmVuZChib2R5KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc2VydmVyLmFsbG93SGFsZk9wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX3NlcnZlci5saXN0ZW4ob3B0aW9ucy5wb3J0LCBvcHRpb25zLmhvc3QsIG9wdGlvbnMuYmFja2xvZywgY2FsbGJhY2spO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuX3NlcnZlciA9IG9wdGlvbnMuc2VydmVyO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zZXJ2ZXIpIHtcbiAgICAgIHRoaXMuX3VsdHJvbiA9IG5ldyBVbHRyb24odGhpcy5fc2VydmVyKTtcbiAgICAgIHRoaXMuX3VsdHJvbi5vbignbGlzdGVuaW5nJywgKCkgPT4gdGhpcy5lbWl0KCdsaXN0ZW5pbmcnKSk7XG4gICAgICB0aGlzLl91bHRyb24ub24oJ2Vycm9yJywgKGVycikgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycikpO1xuICAgICAgdGhpcy5fdWx0cm9uLm9uKCd1cGdyYWRlJywgKHJlcSwgc29ja2V0LCBoZWFkKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlVXBncmFkZShyZXEsIHNvY2tldCwgaGVhZCwgKGNsaWVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY29ubmVjdGlvbicsIGNsaWVudCwgcmVxKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5jbGllbnRUcmFja2luZykgdGhpcy5jbGllbnRzID0gbmV3IFNldCgpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2tcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xvc2UgKGNiKSB7XG4gICAgLy9cbiAgICAvLyBUZXJtaW5hdGUgYWxsIGFzc29jaWF0ZWQgY2xpZW50cy5cbiAgICAvL1xuICAgIGlmICh0aGlzLmNsaWVudHMpIHtcbiAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIHRoaXMuY2xpZW50cykgY2xpZW50LnRlcm1pbmF0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuX3NlcnZlcjtcblxuICAgIGlmIChzZXJ2ZXIpIHtcbiAgICAgIHRoaXMuX3VsdHJvbi5kZXN0cm95KCk7XG4gICAgICB0aGlzLl91bHRyb24gPSB0aGlzLl9zZXJ2ZXIgPSBudWxsO1xuXG4gICAgICAvL1xuICAgICAgLy8gQ2xvc2UgdGhlIGh0dHAgc2VydmVyIGlmIGl0IHdhcyBpbnRlcm5hbGx5IGNyZWF0ZWQuXG4gICAgICAvL1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wb3J0ICE9IG51bGwpIHJldHVybiBzZXJ2ZXIuY2xvc2UoY2IpO1xuICAgIH1cblxuICAgIGlmIChjYikgY2IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgaWYgYSBnaXZlbiByZXF1ZXN0IHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoaXMgc2VydmVyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXEgUmVxdWVzdCBvYmplY3QgdG8gaW5zcGVjdFxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHJlcXVlc3QgaXMgdmFsaWQsIGVsc2UgYGZhbHNlYFxuICAgKiBAcHVibGljXG4gICAqL1xuICBzaG91bGRIYW5kbGUgKHJlcSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMucGF0aCAmJiB1cmwucGFyc2UocmVxLnVybCkucGF0aG5hbWUgIT09IHRoaXMub3B0aW9ucy5wYXRoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGEgSFRUUCBVcGdyYWRlIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9IHJlcSBUaGUgcmVxdWVzdCBvYmplY3RcbiAgICogQHBhcmFtIHtuZXQuU29ja2V0fSBzb2NrZXQgVGhlIG5ldHdvcmsgc29ja2V0IGJldHdlZW4gdGhlIHNlcnZlciBhbmQgY2xpZW50XG4gICAqIEBwYXJhbSB7QnVmZmVyfSBoZWFkIFRoZSBmaXJzdCBwYWNrZXQgb2YgdGhlIHVwZ3JhZGVkIHN0cmVhbVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBoYW5kbGVVcGdyYWRlIChyZXEsIHNvY2tldCwgaGVhZCwgY2IpIHtcbiAgICBzb2NrZXQub24oJ2Vycm9yJywgc29ja2V0RXJyb3IpO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9ICtyZXEuaGVhZGVyc1snc2VjLXdlYnNvY2tldC12ZXJzaW9uJ107XG5cbiAgICBpZiAoXG4gICAgICByZXEubWV0aG9kICE9PSAnR0VUJyB8fCByZXEuaGVhZGVycy51cGdyYWRlLnRvTG93ZXJDYXNlKCkgIT09ICd3ZWJzb2NrZXQnIHx8XG4gICAgICAhcmVxLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQta2V5J10gfHwgKHZlcnNpb24gIT09IDggJiYgdmVyc2lvbiAhPT0gMTMpIHx8XG4gICAgICAhdGhpcy5zaG91bGRIYW5kbGUocmVxKVxuICAgICkge1xuICAgICAgcmV0dXJuIGFib3J0Q29ubmVjdGlvbihzb2NrZXQsIDQwMCk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvY29sID0gKHJlcS5oZWFkZXJzWydzZWMtd2Vic29ja2V0LXByb3RvY29sJ10gfHwgJycpLnNwbGl0KC8sICovKTtcblxuICAgIC8vXG4gICAgLy8gT3B0aW9uYWxseSBjYWxsIGV4dGVybmFsIHByb3RvY29sIHNlbGVjdGlvbiBoYW5kbGVyLlxuICAgIC8vXG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYW5kbGVQcm90b2NvbHMpIHtcbiAgICAgIHByb3RvY29sID0gdGhpcy5vcHRpb25zLmhhbmRsZVByb3RvY29scyhwcm90b2NvbCwgcmVxKTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gZmFsc2UpIHJldHVybiBhYm9ydENvbm5lY3Rpb24oc29ja2V0LCA0MDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm90b2NvbCA9IHByb3RvY29sWzBdO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gT3B0aW9uYWxseSBjYWxsIGV4dGVybmFsIGNsaWVudCB2ZXJpZmljYXRpb24gaGFuZGxlci5cbiAgICAvL1xuICAgIGlmICh0aGlzLm9wdGlvbnMudmVyaWZ5Q2xpZW50KSB7XG4gICAgICBjb25zdCBpbmZvID0ge1xuICAgICAgICBvcmlnaW46IHJlcS5oZWFkZXJzW2Ake3ZlcnNpb24gPT09IDggPyAnc2VjLXdlYnNvY2tldC1vcmlnaW4nIDogJ29yaWdpbid9YF0sXG4gICAgICAgIHNlY3VyZTogISEocmVxLmNvbm5lY3Rpb24uYXV0aG9yaXplZCB8fCByZXEuY29ubmVjdGlvbi5lbmNyeXB0ZWQpLFxuICAgICAgICByZXFcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudmVyaWZ5Q2xpZW50Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICB0aGlzLm9wdGlvbnMudmVyaWZ5Q2xpZW50KGluZm8sICh2ZXJpZmllZCwgY29kZSwgbWVzc2FnZSkgPT4ge1xuICAgICAgICAgIGlmICghdmVyaWZpZWQpIHJldHVybiBhYm9ydENvbm5lY3Rpb24oc29ja2V0LCBjb2RlIHx8IDQwMSwgbWVzc2FnZSk7XG5cbiAgICAgICAgICB0aGlzLmNvbXBsZXRlVXBncmFkZShwcm90b2NvbCwgdmVyc2lvbiwgcmVxLCBzb2NrZXQsIGhlYWQsIGNiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMub3B0aW9ucy52ZXJpZnlDbGllbnQoaW5mbykpIHtcbiAgICAgICAgcmV0dXJuIGFib3J0Q29ubmVjdGlvbihzb2NrZXQsIDQwMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb21wbGV0ZVVwZ3JhZGUocHJvdG9jb2wsIHZlcnNpb24sIHJlcSwgc29ja2V0LCBoZWFkLCBjYik7XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZSB0aGUgY29ubmVjdGlvbiB0byBXZWJTb2NrZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbCBUaGUgY2hvc2VuIHN1YnByb3RvY29sXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2ZXJzaW9uIFRoZSBXZWJTb2NrZXQgcHJvdG9jb2wgdmVyc2lvblxuICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXEgVGhlIHJlcXVlc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7bmV0LlNvY2tldH0gc29ja2V0IFRoZSBuZXR3b3JrIHNvY2tldCBiZXR3ZWVuIHRoZSBzZXJ2ZXIgYW5kIGNsaWVudFxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gaGVhZCBUaGUgZmlyc3QgcGFja2V0IG9mIHRoZSB1cGdyYWRlZCBzdHJlYW1cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2tcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbXBsZXRlVXBncmFkZSAocHJvdG9jb2wsIHZlcnNpb24sIHJlcSwgc29ja2V0LCBoZWFkLCBjYikge1xuICAgIC8vXG4gICAgLy8gRGVzdHJveSB0aGUgc29ja2V0IGlmIHRoZSBjbGllbnQgaGFzIGFscmVhZHkgc2VudCBhIEZJTiBwYWNrZXQuXG4gICAgLy9cbiAgICBpZiAoIXNvY2tldC5yZWFkYWJsZSB8fCAhc29ja2V0LndyaXRhYmxlKSByZXR1cm4gc29ja2V0LmRlc3Ryb3koKTtcblxuICAgIGNvbnN0IGtleSA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJylcbiAgICAgIC51cGRhdGUocmVxLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQta2V5J10gKyBjb25zdGFudHMuR1VJRCwgJ2JpbmFyeScpXG4gICAgICAuZGlnZXN0KCdiYXNlNjQnKTtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSBbXG4gICAgICAnSFRUUC8xLjEgMTAxIFN3aXRjaGluZyBQcm90b2NvbHMnLFxuICAgICAgJ1VwZ3JhZGU6IHdlYnNvY2tldCcsXG4gICAgICAnQ29ubmVjdGlvbjogVXBncmFkZScsXG4gICAgICBgU2VjLVdlYlNvY2tldC1BY2NlcHQ6ICR7a2V5fWBcbiAgICBdO1xuXG4gICAgaWYgKHByb3RvY29sKSBoZWFkZXJzLnB1c2goYFNlYy1XZWJTb2NrZXQtUHJvdG9jb2w6ICR7cHJvdG9jb2x9YCk7XG5cbiAgICBjb25zdCBvZmZlciA9IEV4dGVuc2lvbnMucGFyc2UocmVxLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQtZXh0ZW5zaW9ucyddKTtcbiAgICB2YXIgZXh0ZW5zaW9ucztcblxuICAgIHRyeSB7XG4gICAgICBleHRlbnNpb25zID0gYWNjZXB0RXh0ZW5zaW9ucyh0aGlzLm9wdGlvbnMsIG9mZmVyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBhYm9ydENvbm5lY3Rpb24oc29ja2V0LCA0MDApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoZXh0ZW5zaW9ucyk7XG5cbiAgICBpZiAocHJvcHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzZXJ2ZXJFeHRlbnNpb25zID0gcHJvcHMucmVkdWNlKChvYmosIGtleSkgPT4ge1xuICAgICAgICBvYmpba2V5XSA9IFtleHRlbnNpb25zW2tleV0ucGFyYW1zXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sIHt9KTtcblxuICAgICAgaGVhZGVycy5wdXNoKGBTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnM6ICR7RXh0ZW5zaW9ucy5mb3JtYXQoc2VydmVyRXh0ZW5zaW9ucyl9YCk7XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBBbGxvdyBleHRlcm5hbCBtb2RpZmljYXRpb24vaW5zcGVjdGlvbiBvZiBoYW5kc2hha2UgaGVhZGVycy5cbiAgICAvL1xuICAgIHRoaXMuZW1pdCgnaGVhZGVycycsIGhlYWRlcnMsIHJlcSk7XG5cbiAgICBzb2NrZXQud3JpdGUoaGVhZGVycy5jb25jYXQoJycsICcnKS5qb2luKCdcXHJcXG4nKSk7XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgV2ViU29ja2V0KFtzb2NrZXQsIGhlYWRdLCBudWxsLCB7XG4gICAgICBtYXhQYXlsb2FkOiB0aGlzLm9wdGlvbnMubWF4UGF5bG9hZCxcbiAgICAgIHByb3RvY29sVmVyc2lvbjogdmVyc2lvbixcbiAgICAgIGV4dGVuc2lvbnMsXG4gICAgICBwcm90b2NvbFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY2xpZW50cykge1xuICAgICAgdGhpcy5jbGllbnRzLmFkZChjbGllbnQpO1xuICAgICAgY2xpZW50Lm9uKCdjbG9zZScsICgpID0+IHRoaXMuY2xpZW50cy5kZWxldGUoY2xpZW50KSk7XG4gICAgfVxuXG4gICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHNvY2tldEVycm9yKTtcbiAgICBjYihjbGllbnQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0U2VydmVyO1xuXG4vKipcbiAqIEhhbmRsZSBwcmVtYXR1cmUgc29ja2V0IGVycm9ycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb2NrZXRFcnJvciAoKSB7XG4gIHRoaXMuZGVzdHJveSgpO1xufVxuXG4vKipcbiAqIEFjY2VwdCBXZWJTb2NrZXQgZXh0ZW5zaW9ucy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgYFdlYlNvY2tldFNlcnZlcmAgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb2ZmZXIgVGhlIHBhcnNlZCB2YWx1ZSBvZiB0aGUgYHNlYy13ZWJzb2NrZXQtZXh0ZW5zaW9uc2AgaGVhZGVyXG4gKiBAcmV0dXJuIHtPYmplY3R9IEFjY2VwdGVkIGV4dGVuc2lvbnNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFjY2VwdEV4dGVuc2lvbnMgKG9wdGlvbnMsIG9mZmVyKSB7XG4gIGNvbnN0IHBtZCA9IG9wdGlvbnMucGVyTWVzc2FnZURlZmxhdGU7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSB7fTtcblxuICBpZiAocG1kICYmIG9mZmVyW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdKSB7XG4gICAgY29uc3QgcGVyTWVzc2FnZURlZmxhdGUgPSBuZXcgUGVyTWVzc2FnZURlZmxhdGUoXG4gICAgICBwbWQgIT09IHRydWUgPyBwbWQgOiB7fSxcbiAgICAgIHRydWUsXG4gICAgICBvcHRpb25zLm1heFBheWxvYWRcbiAgICApO1xuXG4gICAgcGVyTWVzc2FnZURlZmxhdGUuYWNjZXB0KG9mZmVyW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdKTtcbiAgICBleHRlbnNpb25zW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdID0gcGVyTWVzc2FnZURlZmxhdGU7XG4gIH1cblxuICByZXR1cm4gZXh0ZW5zaW9ucztcbn1cblxuLyoqXG4gKiBDbG9zZSB0aGUgY29ubmVjdGlvbiB3aGVuIHByZWNvbmRpdGlvbnMgYXJlIG5vdCBmdWxmaWxsZWQuXG4gKlxuICogQHBhcmFtIHtuZXQuU29ja2V0fSBzb2NrZXQgVGhlIHNvY2tldCBvZiB0aGUgdXBncmFkZSByZXF1ZXN0XG4gKiBAcGFyYW0ge051bWJlcn0gY29kZSBUaGUgSFRUUCByZXNwb25zZSBzdGF0dXMgY29kZVxuICogQHBhcmFtIHtTdHJpbmd9IFttZXNzYWdlXSBUaGUgSFRUUCByZXNwb25zZSBib2R5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhYm9ydENvbm5lY3Rpb24gKHNvY2tldCwgY29kZSwgbWVzc2FnZSkge1xuICBpZiAoc29ja2V0LndyaXRhYmxlKSB7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgaHR0cC5TVEFUVVNfQ09ERVNbY29kZV07XG4gICAgc29ja2V0LndyaXRlKFxuICAgICAgYEhUVFAvMS4xICR7Y29kZX0gJHtodHRwLlNUQVRVU19DT0RFU1tjb2RlXX1cXHJcXG5gICtcbiAgICAgICdDb25uZWN0aW9uOiBjbG9zZVxcclxcbicgK1xuICAgICAgJ0NvbnRlbnQtdHlwZTogdGV4dC9odG1sXFxyXFxuJyArXG4gICAgICBgQ29udGVudC1MZW5ndGg6ICR7QnVmZmVyLmJ5dGVMZW5ndGgobWVzc2FnZSl9XFxyXFxuYCArXG4gICAgICAnXFxyXFxuJyArXG4gICAgICBtZXNzYWdlXG4gICAgKTtcbiAgfVxuXG4gIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBzb2NrZXRFcnJvcik7XG4gIHNvY2tldC5kZXN0cm95KCk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9kZXYtcHJvdG9zdHVicy9zcmMvcHJvdG9zdHViL3ZlcnR4L25vZGVfbW9kdWxlcy93cy9saWIvV2ViU29ja2V0U2VydmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9