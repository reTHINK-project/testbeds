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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.0 by @mathias */
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
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module), __webpack_require__(10)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.18.10
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
  if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory();
  } else if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.18.10
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
  if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory();
  } else if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
      'zm':' ac co com edu gov net org sch ',
      // https://en.wikipedia.org/wiki/CentralNic#Second-level_domains
      'com': 'ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ',
      'net': 'gb jp se uk ',
      'org': 'ae',
      'de': 'com '
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = activate;

var _Discovery = __webpack_require__(4);

var _Discovery2 = _interopRequireDefault(_Discovery);

var _Syncher = __webpack_require__(5);

var _EventEmitter2 = __webpack_require__(6);

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _utils = __webpack_require__(7);

var _urijs = __webpack_require__(8);

var _urijs2 = _interopRequireDefault(_urijs);

var _availability = __webpack_require__(11);

var _availability2 = _interopRequireDefault(_availability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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

// Service Framework


// Utils


var statusHyperty = [];

/**
* Hyperty Presence;
* @author Apizee [dev@apizee.com]
* @version 0.1.0
*/

var UserStatus = function (_EventEmitter) {
  _inherits(UserStatus, _EventEmitter);

  function UserStatus(hypertyURL, bus, configuration) {
    _classCallCheck(this, UserStatus);

    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    var _this2 = _possibleConstructorReturn(this, (UserStatus.__proto__ || Object.getPrototypeOf(UserStatus)).call(this, hypertyURL, bus, configuration));

    _this2.syncher = new _Syncher.Syncher(hypertyURL, bus, configuration);

    _this2.discovery = new _Discovery2.default(hypertyURL, configuration.runtimeURL, bus);

    _this2.domain = (0, _utils.divideURL)(hypertyURL).domain;

    _this2.userStatusDescURL = 'hyperty-catalogue://catalogue.' + _this2.domain + '/.well-known/dataschema/Context';

    _this2.heartbeat = [];

    _this2.syncher.onNotification(function (event) {
      var _this = _this2;
      _this.onNotification(event);
    });
    return _this2;
  }

  _createClass(UserStatus, [{
    key: 'onNotification',
    value: function onNotification(event) {
      var _this = this;
      console.info('UserStatus Event Received: ', event);
      console.log('from hyperty', event.from);

      event.ack();

      // if (event.schema === _this.userStatusDescURL) {
      // Subscribe to user status presence
      _this.syncher.subscribe(_this.userStatusDescURL, event.url).then(function (statusObjectObserver) {
        console.info('-------- Status Observer received ---------', statusObjectObserver);
        console.log('trigger statusChange for', event.identity);
        _this.trigger('statusChange', {
          identity: event.identity,
          status: _this.getStatus(statusObjectObserver)
        });

        _this.managePresenceHeartbeat(event.identity);

        statusObjectObserver.onChange('*', function () {
          console.info('status event received:', event);
          _this.trigger('statusChange', {
            identity: event.identity,
            status: _this.getStatus(statusObjectObserver)
          });
          _this.managePresenceHeartbeat(event.identity);
        });

        console.log(event.identity.email, 'has subscribe to my status data object, send invite to listen mine');
        _this.statusObjectReporter.inviteObservers([event.from]);
      }).catch(function (reason) {
        console.error(reason);
      });
      // }
    }

    /**
     * This function is used to create a new status object syncher
     * @param  {URL.UserURL} contacts List of Users 
     * @return {Promise}
     */

  }, {
    key: 'create',
    value: function create(contacts) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        console.info('----------------------- Mapping Particpants --------------------');
        _this.mappingUser(contacts).then(function (hyperties) {
          return _this.createSyncher(hyperties, (0, _availability2.default)());
        }).then(function (statusObjectReporter) {
          _this.statusObjectReporter = statusObjectReporter;

          _this.statusObjectReporter.onSubscription(function (event) {
            console.info('-------- Status Reporter received subscription request ---------', event);
            event.accept();
            if (event.url === _this.statusObjectReporter.owner) {
              console.log('define my own presence state to available');
              _this.setStatus('available');
            }
          });

          // set interval for heartbeat
          setInterval(function () {
            _this.sendHeartbeat();
          }, 50000);
        }).catch(function (reason) {
          reject(reason);
        });
      });
    }
  }, {
    key: 'createSyncher',
    value: function createSyncher(hyperties, status) {
      var _this = this;
      console.info('------------------------ Syncher Create ----------------------', hyperties, status);
      return _this.syncher.create(_this.userStatusDescURL, hyperties, status);
    }
  }, {
    key: 'onInvitation',
    value: function onInvitation(callback) {
      var _this = this;
      _this.onInvitation = callback;
    }
  }, {
    key: 'join',
    value: function join(invitationURL) {
      var _this = this;
      var syncher = _this.syncher;
      return new Promise(function (resolve, reject) {

        console.info('------------------------ Syncher subscribe ---------------------- \n');

        syncher.subscribe(_this.userStatusDescURL, invitationURL, true, false).then(function (dataObjectObserver) {
          console.info('Data Object Observer: ', dataObjectObserver);
          resolve();
        }).catch(function (reason) {
          reject(reason);
        });
      });
    }
  }, {
    key: 'getStatus',
    value: function getStatus(statusObserver) {
      var _this = this;
      var state = false;
      if (typeof statusObserver !== 'undefined') {
        console.log('getStatus from observer:', statusObserver.data.values[0].value);
        return statusObserver.data.values[0].value;
      } else {
        console.log('getStatus from reporter:', _this.statusObjectReporter.data.values[0].value);
        return _this.statusObjectReporter.data.values[0].value;
      }
      return state;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(newStatus) {
      var _this = this;
      console.log('setStatus', newStatus, 'in reporter', _this.statusObjectReporter.data);
      _this.statusObjectReporter.data.values[0].value = newStatus;
      console.debug('this._statusObjectReporter.data :', _this.statusObjectReporter.data);
      _this.statusObjectReporter.data.time = new Date().getTime();
    }

    /**
     * Update status object date
     */

  }, {
    key: 'sendHeartbeat',
    value: function sendHeartbeat() {
      var _this = this;
      console.log('send heartbeat');
      _this.statusObjectReporter.data.time = new Date().getTime();
    }

    /**
     * Monitor user activity within heartbeat timeout period
     */

  }, {
    key: 'managePresenceHeartbeat',
    value: function managePresenceHeartbeat(identity) {
      var _this = this;
      console.log('renew heartbeat period for', identity);
      var email = identity.email;
      if (email in _this.heartbeat) {
        clearTimeout(_this.heartbeat[email]);
      }
      _this.heartbeat[email] = setTimeout(function () {
        console.log(email, 'has disconnect');
        clearTimeout(_this.heartbeat[email]);
        _this.trigger('statusChange', {
          identity: identity,
          status: 'unavailable'
        });
      }, 60000);
    }
  }, {
    key: 'getLatestHypertyPerUser',
    value: function getLatestHypertyPerUser(hypertyObj) {

      var hyperty = void 0;
      var mostRecent = void 0;
      var lastHyperty = void 0;

      new Promise(function (resolve, reject) {

        for (var i = 0; i < hypertyObj.length; i++) {

          if (hypertyObj[i].lastModified !== undefined) {
            if (mostRecent === undefined) {
              mostRecent = new Date(hypertyObj[i].lastModified);
              lastHyperty = hypertyObj[i];
            } else {
              var hypertyDate = new Date(hypertyObj[i].lastModified);
              if (mostRecent.getTime() < hypertyDate.getTime()) {
                mostRecent = hypertyDate;
                lastHyperty = hypertyObj[i];
              }
            }
          }
        }

        console.log('Last Hyperty: ', lastHyperty, mostRecent);
        resolve(lastHyperty);
      }).catch(function (reason) {
        console.error('Error Happened while geting Lateast Hyperty per user reason:', reason);
        reject();
      });
      return lastHyperty;
    }
  }, {
    key: 'mappingUser',
    value: function mappingUser(userList) {
      var _this = this;
      console.info('------------------------ mappingUser ----------------------', userList);

      return new Promise(function (resolve, reject) {
        var hyperties = [];
        var count = 0;

        if (userList.length === 0) reject(hyperties);

        var resultUsers = function resultUsers() {
          if (count === userList.length) {
            console.info('Have ' + hyperties.length + 'users found;');
            resolve(hyperties);
          }
        };

        var activeUsers = function activeUsers(user) {
          count++;
          console.debug('user , hyperties ', user, hyperties);
          hyperties.push(user.hypertyURL);
          resultUsers();
        };

        var inactiveUsers = function inactiveUsers() {
          count++;
          resultUsers();
        };

        userList.forEach(function (user) {
          console.log('user :', user);
          if (user.email.length) {
            console.info('------------------------ mappingUser ----------------------', userList);
            return _this.discovery.discoverHyperties(user.email, '', '', user.domain).then(function (activeUsers) {

              console.debug('discovered activeUsers are :', activeUsers);
              var size = Object.keys(activeUsers).length;
              for (var i = 0; i < size; i++) {
                console.debug('activeUsers[Object.keys(activeUsers)[i]]----------', activeUsers[Object.keys(activeUsers)[i]]);
                if (activeUsers[Object.keys(activeUsers)[i]].descriptor.substr(activeUsers[Object.keys(activeUsers)[i]].descriptor.lastIndexOf('/') + 1) === "UserStatus") {
                  statusHyperty.push(activeUsers[Object.keys(activeUsers)[i]]);
                }
              }
              var foundstatus = _this.getLatestHypertyPerUser(statusHyperty);
              console.debug('activeUsers:', foundstatus);
              count++;
              hyperties.push(foundstatus.hypertyID);
              console.debug('user , hyperties ', user, hyperties);
              if (count === userList.length) {
                console.info('Have ' + hyperties.length + 'users found;');
                resolve(hyperties);
              }
            }).catch(inactiveUsers);
          }
        });

        // userList.forEach((user) => {
        //   console.log(user);
        //   if (user.email.length) {
        //     console.info('------------------------ mappingUser ----------------------', userList);
        //     return _this.discovery.discoverHypertyPerUser(user.email, user.domain).then(activeUsers).catch(inactiveUsers);
        //   }
        // });
      });
    }
  }]);

  return UserStatus;
}(_EventEmitter3.default);

function activate(hypertyURL, bus, configuration) {

  return {
    name: 'UserStatus',
    instance: new UserStatus(hypertyURL, bus, configuration)
  };
}
module.exports = exports['default'];

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

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.18.10
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
  if (typeof module === 'object' && module.exports) {
    // Node
    module.exports = factory(__webpack_require__(0), __webpack_require__(1), __webpack_require__(2));
  } else if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

    if (url === null) {
      if (_urlSupplied) {
        throw new TypeError('null is not a valid argument for URI');
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.18.10';

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
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
    // balanced parens inclusion (), [], {}, <>
    parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
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
    var _parens = options.parens || URI.findUri.parens;
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
      var slice = string.slice(start, end);
      // make sure we include well balanced parens
      var parensEnd = -1;
      while (true) {
        var parensMatch = _parens.exec(slice);
        if (!parensMatch) {
          break;
        }

        var parensMatchEnd = parensMatch.index + parensMatch[0].length;
        parensEnd = Math.max(parensEnd, parensMatchEnd);
      }

      if (parensEnd > -1) {
        slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, '');
      } else {
        slice = slice.replace(_trim, '');
      }

      if (slice.length <= match[0].length) {
        // the extract only contains the starting marker of a URI,
        // e.g. "www" or "http://"
        continue;
      }

      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      if (result === undefined) {
        _start.lastIndex = end;
        continue;
      }

      result = String(result);
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

    if (typeof v !== 'string') {
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

    if (resolved._parts.protocol) {
      // Directly returns even if this._parts.hostname is empty.
      return resolved;
    } else {
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
    } else {
      if (resolved._parts.path.substring(-2) === '..') {
        resolved._parts.path += '/';
      }

      if (resolved.path().charAt(0) !== '/') {
        basedir = base.directory();
        basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
        resolved.normalizePath();
      }
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


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return Object.assign({}, {
        schema: "context",
        id: '_' + Math.random().toString(36).substr(2, 9),
        type: "presence",
        time: "0",
        values: [{
            name: "availability",
            unit: "availability",
            value: "unavailable"
        }]
    });
};

;
module.exports = exports["default"];

/***/ })
/******/ ]);
});