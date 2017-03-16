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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = activate;

	var _slack = __webpack_require__(1);

	var _slack2 = _interopRequireDefault(_slack);

	var _Syncher = __webpack_require__(178);

	var _IdentityFactory = __webpack_require__(179);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SlackProtoStub = function () {
	  function SlackProtoStub(runtimeProtoStubURL, bus, config) {
	    var _this2 = this;

	    _classCallCheck(this, SlackProtoStub);

	    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
	    if (!bus) throw new Error('The bus is a needed parameter');
	    if (!config) throw new Error('The config is a needed parameter');

	    console.log('[SlackProtostub] Constructor Loaded');

	    var _this = this;

	    this._subscribedList = [];
	    this._usersList = [];
	    this._groupsList = [];
	    this._channelsList = [];
	    this._imsList = [];
	    this._observer;
	    this._channelID = '';
	    this._id = 0;
	    this._continuousOpen = true;
	    this._token = '';

	    this._runtimeProtoStubURL = runtimeProtoStubURL;
	    this._bus = bus;
	    this._config = config;

	    this._runtimeSessionURL = config.runtimeURL;
	    this._reOpen = false;
	    this._slack = _slack2.default;
	    console.log('[SlackProtostub] instatiate syncher with runtimeUrl', runtimeProtoStubURL);
	    this._syncher = new _Syncher.Syncher(runtimeProtoStubURL, bus, config);

	    this._syncher.onNotification(function (event) {
	      console.log('[SlackProtostub] On Syncher Notification', event);
	    });

	    bus.addListener('*', function (msg) {
	      console.log('[SlackProtostub] new msg', msg);
	      if (msg.body.hasOwnProperty('identity') && msg.body.identity.hasOwnProperty('access_token') && msg.body.identity.access_token) {

	        var token = msg.body.identity.access_token;
	        _this2._token = token;

	        _this._open(token, function () {
	          if (_this._filter(msg)) {

	            console.log('[SlackProtostub] After Filter', msg);
	            var schemaUrl = msg.body.schema;
	            if (schemaUrl && msg.body.value.name) {

	              var schemaSplitted = schemaUrl.split('/');

	              if (schemaSplitted[schemaSplitted.length - 1] === 'Communication') {

	                _this._getSlackInformation(msg.to).then(function (userInfo) {

	                  console.log('Slack User information: ', userInfo);

	                  // username, userURL, avatar, cn, locale, idp, assertion
	                  var identity = new _IdentityFactory.MessageBodyIdentity(userInfo.name, 'slack://slack.com/' + userInfo.name + '@slack.com', userInfo.profile.image_192, userInfo.name, '', 'slack.com');

	                  _this._subscribe(schemaUrl, msg.from, identity).then(function (result) {
	                    console.log('[SlackProtostub] subscribe result', result);
	                    if (result) {

	                      _this._token = token;

	                      if (msg.body.identity.userProfile.id) {
	                        _this._id = msg.body.identity.userProfile.id;
	                      }

	                      _this._createChannel(msg, userInfo.id);
	                    }
	                  });
	                });
	              }
	            }
	          }
	        });
	      }
	    });
	  }

	  _createClass(SlackProtoStub, [{
	    key: '_getSlackInformation',
	    value: function _getSlackInformation(to) {
	      var _this = this;

	      return new Promise(function (resolve, reject) {

	        var URLUsersList = 'https://slack.com/api/users.list?token=' + _this._token;
	        var URLGroupsList = 'https://slack.com/api/groups.list?token=' + _this._token;
	        var URLChannelsList = 'https://slack.com/api/channels.list?token=' + _this._token;
	        var URLImsList = 'https://slack.com/api/im.list?token=' + _this._token;

	        var UsersListPromise = _this._sendHTTPRequest('GET', URLUsersList);
	        var GroupsListPromise = _this._sendHTTPRequest('GET', URLGroupsList);
	        var ChannelsListPromise = _this._sendHTTPRequest('GET', URLChannelsList);
	        var ImsListPromise = _this._sendHTTPRequest('GET', URLImsList);

	        Promise.all([UsersListPromise, GroupsListPromise, ChannelsListPromise, ImsListPromise]).then(function (result) {
	          _this._usersList = result[0].members;
	          _this._groupsList = result[1].groups;
	          _this._channelsList = result[2].channels;
	          _this._imsList = result[3].ims;

	          //get userID to invite
	          var toSplitted = to.split('://')[1];
	          var user = toSplitted.split('@')[0];
	          var userInfo = _this._usersList.filter(function (value) {
	            return value.name === user;
	          })[0];

	          resolve(userInfo);
	        }, function (error) {
	          console.err('[SlackProtostub] ', error);
	          reject(error);
	        });
	      });
	    }
	  }, {
	    key: '_createChannel',
	    value: function _createChannel(msg, userID) {
	      var _this = this;
	      var channelExists = _this._channelsList.filter(function (value) {
	        return value.name === msg.body.value.name;
	      })[0];

	      // if channel exist, invite user, else channel need to be created and then invite user
	      if (channelExists) {
	        console.log('[SlackProtostub] channel exist', channelExists);

	        var channelMembers = _this._channelsList.filter(function (value) {
	          return value.name === msg.body.value.name;
	        })[0].members;
	        var alreadyOnChannel = false;

	        channelMembers.forEach(function (s) {
	          if (s === userID) {
	            alreadyOnChannel = true;
	          }
	        });
	        console.log('[SlackProtostub] channel members', channelMembers, '   ->', alreadyOnChannel);

	        // if user isnt on Channel invite, else just set channelID
	        if (!alreadyOnChannel) {
	          _this._invite(userID, channelExists.id);
	        } else {
	          _this._channelID = channelExists.id;
	        }
	      } else {
	        _this._create(msg.body.value.name, userID).then(function (result) {
	          if (result) {
	            _this._invite(userID);
	          }
	        });
	      }
	    }
	  }, {
	    key: '_filter',
	    value: function _filter(msg) {
	      if (msg.body && msg.body.via === this._runtimeProtoStubURL) {
	        return false;
	      }

	      return true;
	    }
	  }, {
	    key: '_open',
	    value: function _open(token, callback) {
	      var _this = this;

	      if (!_this._session) {
	        console.log('[SlackProtostub] new Session for token:', token);
	        _this._session = _this._slack.rtm.client();

	        _this._session.listen({ token: token });

	        _this._session.message(function (message) {
	          console.log('[SlackProtostub] new message on session', message);
	          if (message.channel) {
	            if (message.channel === _this._channelID && message.user !== _this._id || !message.hasOwnProperty('bot_id') && message.user === _this._id && message.channel === _this._channelID) {

	              _this._getUserInfo(message.user).then(function (identity) {
	                _this._observer.addChild('chatmessages', { message: message.text }, identity);
	              });
	            }
	          }
	        });
	      } else {
	        console.log('[SlackProtostub] session already exist');
	      }
	      callback();
	    }

	    /*****************************************************************************************************
	    * It retrieves information from a slack user and creates a reTHINK Identity object with it
	    * @param {string} user - slack user id
	    * @return {Promise<Object>} Returns a promise with an Identity object resolved
	    *******************************************************************************************************/

	  }, {
	    key: '_getUserInfo',
	    value: function _getUserInfo(user) {
	      var _this = this;

	      return new Promise(function (resolve) {
	        _this._slack.users.info({ token: _this._token, user: user }, function (err, data) {
	          if (err) {
	            console.err('[SlackProtostub] error', err);
	          } else {

	            console.log('[SlackProtostub getUserInfo] ', data);
	            var identity = new _IdentityFactory.MessageBodyIdentity(data.user.name, 'slack://slack.com/' + data.user.name + '@slack.com', data.user.profile.image_192, data.user.name, '', 'slack.com');

	            resolve(identity);
	          }
	        });
	      });
	    }
	  }, {
	    key: '_subscribe',
	    value: function _subscribe(schema, urlDataObj, identity) {
	      var _this = this;

	      return new Promise(function (resolve) {

	        _this._subscribedList.forEach(function (obj) {
	          if (obj.urlDataObj === urlDataObj && obj.subscribed) {
	            resolve(true);
	          }
	        });

	        var subscription = { urlDataObj: urlDataObj, schema: schema, subscribed: true };

	        var objectDescURL = schema;
	        var dataObjectUrl = urlDataObj.substring(0, urlDataObj.lastIndexOf('/'));

	        console.log('[SlackProtostub] new subscription for schema:', objectDescURL, ' and dataObject:', dataObjectUrl);

	        return _this._syncher.subscribe(objectDescURL, dataObjectUrl, false, false, false, identity).then(function (observer) {
	          _this._observer = observer;
	          _this._subscribedList.push(subscription);
	          console.log('[SlackProtostub] subscribed', dataObjectUrl);
	          console.log('[SlackProtostub] Observer', observer);
	          observer.onAddChild(function (child) {
	            console.info('[SlackProtostub] Observer - Add Child: ', child);
	            _this._deliver(child);
	          });

	          observer.onChange('*', function (event) {
	            console.log('[SlackProtostub] Observer - onChange: ', event);
	          });
	          resolve(true);
	        }).catch(function (error) {
	          console.err('[SlackProtostub] Subscribe', error);
	          resolve(false);
	        });
	      });
	    }
	  }, {
	    key: '_invite',
	    value: function _invite(idUser, idChannel) {
	      var _this = this;

	      if (!idChannel) {
	        idChannel = _this._channelID;
	      }

	      var toInvite = { token: _this._token, channel: idChannel, user: idUser };

	      _this._slack.channels.invite(toInvite, function (err, data) {
	        if (err) {
	          console.err('[SlackProtostub] error', err);
	        } else {
	          _this._channelID = idChannel;
	          console.log('[SlackProtostub] user invited with sucess', data);
	        }
	      });
	    }
	  }, {
	    key: '_deliver',
	    value: function _deliver(child) {
	      var _this = this;

	      if (_this._channelID !== '' && child.value.message) {

	        if (child.hasOwnProperty('identity') && child.identity.hasOwnProperty('userProfile') && child.identity.userProfile.hasOwnProperty('username') && child.identity.userProfile.username) {

	          var text = '' + child.identity.userProfile.username + ': ' + child.value.message;
	          var message = { as_user: true, token: _this._token, channel: _this._channelID, text: text };
	          console.log('[SlackProtostub] (PostMessage slack api) token(', _this._token, ')  channel(', _this._channelID, ') text(', child.value.message, ')');

	          _this._slack.chat.postMessage(message, function (err, data) {
	            if (err) {
	              console.err('[SlackProtostub] error', err);
	            } else {
	              console.log('[SlackProtostub] PostMessage with Sucess', data);
	            }
	          });
	        }
	      }
	    }
	  }, {
	    key: '_create',
	    value: function _create(channelName) {
	      var _this = this;

	      return new Promise(function (resolve) {
	        var toCreate = { token: _this._token, name: channelName };
	        _this._slack.channels.create(toCreate, function (err, data) {
	          if (err) {
	            console.err('[SlackProtostub] ', err);
	          } else {
	            if (data.ok) {
	              console.log('[SlackProtostub] Channel Created with Sucess ', data);
	              _this._channelID = data.channel.id;
	              resolve(true);
	            }
	          }
	        });
	      });
	    }
	  }, {
	    key: '_sendHTTPRequest',
	    value: function _sendHTTPRequest(method, url) {
	      return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        if ('withCredentials' in xhr) {
	          xhr.open(method, url, true);
	        } else if (typeof XDomainRequest !== 'undefined') {
	          // Otherwise, check if XDomainRequest.
	          // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	          xhr = new XDomainRequest();
	          xhr.open(method, url);
	        } else {
	          // Otherwise, CORS is not supported by the browser.
	          xhr = null;
	        }
	        if (xhr) {
	          xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4) {
	              if (xhr.status === 200) {
	                var info = JSON.parse(xhr.responseText);
	                resolve(info);
	              } else if (xhr.status === 400) {
	                reject('There was an error processing the token');
	              } else {
	                reject('something else other than 200 was returned');
	              }
	            }
	          };
	          xhr.send();
	        } else {
	          reject('CORS not supported');
	        }
	      });
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

	  return SlackProtoStub;
	}();

	function activate(url, bus, config) {
	  return {
	    name: 'SlackProtoStub',
	    instance: new SlackProtoStub(url, bus, config)
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _api = __webpack_require__(2);

	var _api2 = _interopRequireDefault(_api);

	var _api3 = __webpack_require__(52);

	var _api4 = _interopRequireDefault(_api3);

	var _bots = __webpack_require__(159);

	var _bots2 = _interopRequireDefault(_bots);

	var _auth = __webpack_require__(53);

	var _auth2 = _interopRequireDefault(_auth);

	var _channels = __webpack_require__(160);

	var _channels2 = _interopRequireDefault(_channels);

	var _chat = __webpack_require__(161);

	var _chat2 = _interopRequireDefault(_chat);

	var _dnd = __webpack_require__(162);

	var _dnd2 = _interopRequireDefault(_dnd);

	var _emoji = __webpack_require__(79);

	var _emoji2 = _interopRequireDefault(_emoji);

	var _files = __webpack_require__(163);

	var _files2 = _interopRequireDefault(_files);

	var _groups = __webpack_require__(164);

	var _groups2 = _interopRequireDefault(_groups);

	var _im = __webpack_require__(165);

	var _im2 = _interopRequireDefault(_im);

	var _mpim = __webpack_require__(166);

	var _mpim2 = _interopRequireDefault(_mpim);

	var _oauth = __webpack_require__(167);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _reactions = __webpack_require__(168);

	var _reactions2 = _interopRequireDefault(_reactions);

	var _reminders = __webpack_require__(169);

	var _reminders2 = _interopRequireDefault(_reminders);

	var _pins = __webpack_require__(170);

	var _pins2 = _interopRequireDefault(_pins);

	var _rtm = __webpack_require__(171);

	var _rtm2 = _interopRequireDefault(_rtm);

	var _rtm3 = __webpack_require__(130);

	var _rtm4 = _interopRequireDefault(_rtm3);

	var _search = __webpack_require__(173);

	var _search2 = _interopRequireDefault(_search);

	var _stars = __webpack_require__(174);

	var _stars2 = _interopRequireDefault(_stars);

	var _team = __webpack_require__(175);

	var _team2 = _interopRequireDefault(_team);

	var _usergroups = __webpack_require__(176);

	var _usergroups2 = _interopRequireDefault(_usergroups);

	var _users = __webpack_require__(177);

	var _users2 = _interopRequireDefault(_users);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var describe = '\n  slack\n    api.client(token)\n    api.test(params, (err, data)=>)\n    auth.test(token, (err, data)=>)\n    bots.info\n    channels.archive({token, channel}, (err, data)=>)\n    channels.create({token, name}, (err, data)=>)\n    channels.history({token, channel}, (err, data)=>)\n    channels.info\n    channels.invite\n    channels.join\n    channels.kick\n    channels.leave\n    channels.list({token, exclude_archived}, (err, data)=>)\n    channels.mark\n    channels.rename\n    channels.setPurpose\n    channels.setTopic\n    channels.unarchive\n    chat.delete\n    chat.postMessage({token, text, channel}, (err, data)=>)\n    chat.update\n    emoji.list\n    files.delete\n    files.info\n    files.list\n    files.upload\n    groups.archive\n    groups.close\n    groups.create\n    groups.createChild\n    groups.history\n    groups.info\n    groups.invite\n    groups.kick\n    groups.leave\n    groups.list\n    groups.mark\n    groups.open\n    groups.rename\n    groups.setPurpose\n    groups.setTopic\n    groups.unarchive\n    im.close\n    im.history\n    im.list\n    im.mark\n    im.open\n    mpim.close\n    mpim.history\n    mpim.list\n    mpim.mark\n    mpim.open\n    oauth.access({client_id, client_secret, code}, (err, data)=>)\n    pins.add\n    pins.list\n    pins.remove\n    reactions.add\n    reactions.get\n    reactions.list\n    reactions.remove\n    reminders.add\n    reminders.complete\n    reminders.delete\n    reminders.info\n    reminders.list\n    rtm.client()\n    rtm.start({token}, (err, data)=>)\n    search.all\n    search.files\n    search.messages\n    stars.add\n    stars.list\n    stars.remove\n    team.acccessLogs\n    team.billableInfo\n    team.info(token, (err, data)=>)\n    team.integrationLogs\n    team.profile.get\n    usergroups.create\n    usergroups.disable\n    usergroups.enable\n    usergroups.list\n    usergroups.update\n    usergroups.users.list\n    usergroups.users.update\n    users.getPresence\n    users.identity\n    users.info\n    users.list(token, (err, data)=>)\n    users.setActive\n    users.setPresence\n';

	exports.default = {
	  describe: describe,
	  api: { test: _api2.default, client: _api4.default },
	  auth: { test: _auth2.default },
	  bots: _bots2.default,
	  channels: _channels2.default,
	  chat: _chat2.default,
	  dnd: _dnd2.default,
	  emoji: { list: _emoji2.default },
	  files: _files2.default,
	  groups: _groups2.default,
	  im: _im2.default,
	  mpim: _mpim2.default,
	  oauth: { access: _oauth2.default },
	  reactions: _reactions2.default,
	  reminders: _reminders2.default,
	  pins: _pins2.default,
	  rtm: { client: _rtm2.default, start: _rtm4.default },
	  search: _search2.default,
	  stars: _stars2.default,
	  team: _team2.default,
	  usergroups: _usergroups2.default,
	  users: _users2.default
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = apitest;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function apitest(params, callback) {
	  var ns = 'api.test';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = exec;

	var _tinyJsonHttp = __webpack_require__(4);

	var _tinyJsonHttp2 = _interopRequireDefault(_tinyJsonHttp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function exec(url, form, callback) {

	  // stringify any objects under keys since form is posted as application/x-www-form-urlencoded
	  Object.keys(form).forEach(function (key) {
	    if (_typeof(form[key]) === 'object') {
	      form[key] = JSON.stringify(form[key]);
	    }
	  });

	  // always post
	  _tinyJsonHttp2.default.post({
	    url: 'https://slack.com/api/' + url,
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    },
	    data: form
	  }, function _res(err, res) {
	    // var rateLimit = 'You are sending too many requests. Please relax.'
	    if (res) res = JSON.parse(res);
	    if (err) {
	      // if request failed bubble the error
	      callback(err);
	    } else if (res.error) {
	      callback(Error(res.error));
	    } else {
	      callback(null, res);
	    }
	  });
	}
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _get = __webpack_require__(5)
	var _post = __webpack_require__(49)

	module.exports = {
	  get: _get,
	  post: _post,
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var http = __webpack_require__(6)
	var https = __webpack_require__(48)
	var url = __webpack_require__(41)

	module.exports = function GET(options, callback) {

	  // require options.url or fail noisily 
	  if (!options.url) {
	    throw Error('options.url required')
	  }

	  // parse out the options from options.url
	  var opts = url.parse(options.url)
	  var method = opts.protocol === 'https:'? https.get : http.get

	  opts.rejectUnauthorized = false
	  opts.agent = false
	  opts.headers = options.headers || {}
	  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
	  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json'
	  
	  // make a request
	  method(opts, function __res(res) {
	   
	    var rawData = ''
	    var statusCode = res.statusCode
	    var contentType = res.headers['content-type']
	    var isJSON = contentType.startsWith('application/json')

	    if (statusCode !== 200) {
	      callback(Error('GET failed with: ' + statusCode))
	      res.resume()
	      return
	    }
	 
	    res.setEncoding('utf8')
	    res.on('data', function(chunk) {rawData += chunk})
	    res.on('end', function(x) {
	      try {
	        var parsedData = isJSON? JSON.parse(rawData) : rawData
	        callback(null, parsedData)
	      } 
	      catch (e) {
	        callback(e.message)
	      }
	    })
	  }).on('error', function(e) { callback(Error(e.message)) } )
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var ClientRequest = __webpack_require__(7)
	var extend = __webpack_require__(39)
	var statusCodes = __webpack_require__(40)
	var url = __webpack_require__(41)

	var http = exports

	http.request = function (opts, cb) {
		if (typeof opts === 'string')
			opts = url.parse(opts)
		else
			opts = extend(opts)

		// Normally, the page is loaded from http or https, so not specifying a protocol
		// will result in a (valid) protocol-relative url. However, this won't work if
		// the protocol is something else, like 'file:'
		var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

		var protocol = opts.protocol || defaultProtocol
		var host = opts.hostname || opts.host
		var port = opts.port
		var path = opts.path || '/'

		// Necessary for IPv6 addresses
		if (host && host.indexOf(':') !== -1)
			host = '[' + host + ']'

		// This may be a relative url. The browser should always be able to interpret it correctly.
		opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
		opts.method = (opts.method || 'GET').toUpperCase()
		opts.headers = opts.headers || {}

		// Also valid opts.auth, opts.mode

		var req = new ClientRequest(opts)
		if (cb)
			req.on('response', cb)
		return req
	}

	http.get = function get (opts, cb) {
		var req = http.request(opts, cb)
		req.end()
		return req
	}

	http.Agent = function () {}
	http.Agent.defaultMaxSockets = 4

	http.STATUS_CODES = statusCodes

	http.METHODS = [
		'CHECKOUT',
		'CONNECT',
		'COPY',
		'DELETE',
		'GET',
		'HEAD',
		'LOCK',
		'M-SEARCH',
		'MERGE',
		'MKACTIVITY',
		'MKCOL',
		'MOVE',
		'NOTIFY',
		'OPTIONS',
		'PATCH',
		'POST',
		'PROPFIND',
		'PROPPATCH',
		'PURGE',
		'PUT',
		'REPORT',
		'SEARCH',
		'SUBSCRIBE',
		'TRACE',
		'UNLOCK',
		'UNSUBSCRIBE'
	]
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var capability = __webpack_require__(13)
	var inherits = __webpack_require__(14)
	var response = __webpack_require__(15)
	var stream = __webpack_require__(16)
	var toArrayBuffer = __webpack_require__(38)

	var IncomingMessage = response.IncomingMessage
	var rStates = response.readyStates

	function decideMode (preferBinary, useFetch) {
		if (capability.fetch && useFetch) {
			return 'fetch'
		} else if (capability.mozchunkedarraybuffer) {
			return 'moz-chunked-arraybuffer'
		} else if (capability.msstream) {
			return 'ms-stream'
		} else if (capability.arraybuffer && preferBinary) {
			return 'arraybuffer'
		} else if (capability.vbArray && preferBinary) {
			return 'text:vbarray'
		} else {
			return 'text'
		}
	}

	var ClientRequest = module.exports = function (opts) {
		var self = this
		stream.Writable.call(self)

		self._opts = opts
		self._body = []
		self._headers = {}
		if (opts.auth)
			self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
		Object.keys(opts.headers).forEach(function (name) {
			self.setHeader(name, opts.headers[name])
		})

		var preferBinary
		var useFetch = true
		if (opts.mode === 'disable-fetch' || 'timeout' in opts) {
			// If the use of XHR should be preferred and includes preserving the 'content-type' header.
			// Force XHR to be used since the Fetch API does not yet support timeouts.
			useFetch = false
			preferBinary = true
		} else if (opts.mode === 'prefer-streaming') {
			// If streaming is a high priority but binary compatibility and
			// the accuracy of the 'content-type' header aren't
			preferBinary = false
		} else if (opts.mode === 'allow-wrong-content-type') {
			// If streaming is more important than preserving the 'content-type' header
			preferBinary = !capability.overrideMimeType
		} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
			// Use binary if text streaming may corrupt data or the content-type header, or for speed
			preferBinary = true
		} else {
			throw new Error('Invalid value for opts.mode')
		}
		self._mode = decideMode(preferBinary, useFetch)

		self.on('finish', function () {
			self._onFinish()
		})
	}

	inherits(ClientRequest, stream.Writable)

	ClientRequest.prototype.setHeader = function (name, value) {
		var self = this
		var lowerName = name.toLowerCase()
		// This check is not necessary, but it prevents warnings from browsers about setting unsafe
		// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
		// http-browserify did it, so I will too.
		if (unsafeHeaders.indexOf(lowerName) !== -1)
			return

		self._headers[lowerName] = {
			name: name,
			value: value
		}
	}

	ClientRequest.prototype.getHeader = function (name) {
		var self = this
		return self._headers[name.toLowerCase()].value
	}

	ClientRequest.prototype.removeHeader = function (name) {
		var self = this
		delete self._headers[name.toLowerCase()]
	}

	ClientRequest.prototype._onFinish = function () {
		var self = this

		if (self._destroyed)
			return
		var opts = self._opts

		var headersObj = self._headers
		var body = null
		if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH' || opts.method === 'MERGE') {
			if (capability.blobConstructor) {
				body = new global.Blob(self._body.map(function (buffer) {
					return toArrayBuffer(buffer)
				}), {
					type: (headersObj['content-type'] || {}).value || ''
				})
			} else {
				// get utf8 string
				body = Buffer.concat(self._body).toString()
			}
		}

		if (self._mode === 'fetch') {
			var headers = Object.keys(headersObj).map(function (name) {
				return [headersObj[name].name, headersObj[name].value]
			})

			global.fetch(self._opts.url, {
				method: self._opts.method,
				headers: headers,
				body: body || undefined,
				mode: 'cors',
				credentials: opts.withCredentials ? 'include' : 'same-origin'
			}).then(function (response) {
				self._fetchResponse = response
				self._connect()
			}, function (reason) {
				self.emit('error', reason)
			})
		} else {
			var xhr = self._xhr = new global.XMLHttpRequest()
			try {
				xhr.open(self._opts.method, self._opts.url, true)
			} catch (err) {
				process.nextTick(function () {
					self.emit('error', err)
				})
				return
			}

			// Can't set responseType on really old browsers
			if ('responseType' in xhr)
				xhr.responseType = self._mode.split(':')[0]

			if ('withCredentials' in xhr)
				xhr.withCredentials = !!opts.withCredentials

			if (self._mode === 'text' && 'overrideMimeType' in xhr)
				xhr.overrideMimeType('text/plain; charset=x-user-defined')

			if ('timeout' in opts) {
				xhr.timeout = opts.timeout
				xhr.ontimeout = function () {
					self.emit('timeout')
				}
			}

			Object.keys(headersObj).forEach(function (name) {
				xhr.setRequestHeader(headersObj[name].name, headersObj[name].value)
			})

			self._response = null
			xhr.onreadystatechange = function () {
				switch (xhr.readyState) {
					case rStates.LOADING:
					case rStates.DONE:
						self._onXHRProgress()
						break
				}
			}
			// Necessary for streaming in Firefox, since xhr.response is ONLY defined
			// in onprogress, not in onreadystatechange with xhr.readyState = 3
			if (self._mode === 'moz-chunked-arraybuffer') {
				xhr.onprogress = function () {
					self._onXHRProgress()
				}
			}

			xhr.onerror = function () {
				if (self._destroyed)
					return
				self.emit('error', new Error('XHR error'))
			}

			try {
				xhr.send(body)
			} catch (err) {
				process.nextTick(function () {
					self.emit('error', err)
				})
				return
			}
		}
	}

	/**
	 * Checks if xhr.status is readable and non-zero, indicating no error.
	 * Even though the spec says it should be available in readyState 3,
	 * accessing it throws an exception in IE8
	 */
	function statusValid (xhr) {
		try {
			var status = xhr.status
			return (status !== null && status !== 0)
		} catch (e) {
			return false
		}
	}

	ClientRequest.prototype._onXHRProgress = function () {
		var self = this

		if (!statusValid(self._xhr) || self._destroyed)
			return

		if (!self._response)
			self._connect()

		self._response._onXHRProgress()
	}

	ClientRequest.prototype._connect = function () {
		var self = this

		if (self._destroyed)
			return

		self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode)
		self._response.on('error', function(err) {
			self.emit('error', err)
		})

		self.emit('response', self._response)
	}

	ClientRequest.prototype._write = function (chunk, encoding, cb) {
		var self = this

		self._body.push(chunk)
		cb()
	}

	ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
		var self = this
		self._destroyed = true
		if (self._response)
			self._response._destroyed = true
		if (self._xhr)
			self._xhr.abort()
		// Currently, there isn't a way to truly abort a fetch.
		// If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
	}

	ClientRequest.prototype.end = function (data, encoding, cb) {
		var self = this
		if (typeof data === 'function') {
			cb = data
			data = undefined
		}

		stream.Writable.prototype.end.call(self, data, encoding, cb)
	}

	ClientRequest.prototype.flushHeaders = function () {}
	ClientRequest.prototype.setTimeout = function () {}
	ClientRequest.prototype.setNoDelay = function () {}
	ClientRequest.prototype.setSocketKeepAlive = function () {}

	// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
	var unsafeHeaders = [
		'accept-charset',
		'accept-encoding',
		'access-control-request-headers',
		'access-control-request-method',
		'connection',
		'content-length',
		'cookie',
		'cookie2',
		'date',
		'dnt',
		'expect',
		'host',
		'keep-alive',
		'origin',
		'referer',
		'te',
		'trailer',
		'transfer-encoding',
		'upgrade',
		'user-agent',
		'via'
	]

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer, (function() { return this; }()), __webpack_require__(12)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(9)
	var ieee754 = __webpack_require__(10)
	var isArray = __webpack_require__(11)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

	exports.blobConstructor = false
	try {
		new Blob([new ArrayBuffer(1)])
		exports.blobConstructor = true
	} catch (e) {}

	// The xhr request to example.com may violate some restrictive CSP configurations,
	// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
	// and assume support for certain features below.
	var xhr
	function getXHR () {
		// Cache the xhr value
		if (xhr !== undefined) return xhr

		if (global.XMLHttpRequest) {
			xhr = new global.XMLHttpRequest()
			// If XDomainRequest is available (ie only, where xhr might not work
			// cross domain), use the page location. Otherwise use example.com
			// Note: this doesn't actually make an http request.
			try {
				xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
			} catch(e) {
				xhr = null
			}
		} else {
			// Service workers don't have XHR
			xhr = null
		}
		return xhr
	}

	function checkTypeSupport (type) {
		var xhr = getXHR()
		if (!xhr) return false
		try {
			xhr.responseType = type
			return xhr.responseType === type
		} catch (e) {}
		return false
	}

	// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
	// Safari 7.1 appears to have fixed this bug.
	var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
	var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

	// If fetch is supported, then arraybuffer will be supported too. Skip calling
	// checkTypeSupport(), since that calls getXHR().
	exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

	// These next two tests unavoidably show warnings in Chrome. Since fetch will always
	// be used if it's available, just return false for these to avoid the warnings.
	exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
	exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
		checkTypeSupport('moz-chunked-arraybuffer')

	// If fetch is supported, then overrideMimeType will be supported too. Skip calling
	// getXHR().
	exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

	exports.vbArray = isFunction(global.VBArray)

	function isFunction (value) {
		return typeof value === 'function'
	}

	xhr = null // Help gc

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer, global) {var capability = __webpack_require__(13)
	var inherits = __webpack_require__(14)
	var stream = __webpack_require__(16)

	var rStates = exports.readyStates = {
		UNSENT: 0,
		OPENED: 1,
		HEADERS_RECEIVED: 2,
		LOADING: 3,
		DONE: 4
	}

	var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
		var self = this
		stream.Readable.call(self)

		self._mode = mode
		self.headers = {}
		self.rawHeaders = []
		self.trailers = {}
		self.rawTrailers = []

		// Fake the 'close' event, but only once 'end' fires
		self.on('end', function () {
			// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
			process.nextTick(function () {
				self.emit('close')
			})
		})

		if (mode === 'fetch') {
			self._fetchResponse = response

			self.url = response.url
			self.statusCode = response.status
			self.statusMessage = response.statusText
			
			response.headers.forEach(function(header, key){
				self.headers[key.toLowerCase()] = header
				self.rawHeaders.push(key, header)
			})


			// TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
			var reader = response.body.getReader()
			function read () {
				reader.read().then(function (result) {
					if (self._destroyed)
						return
					if (result.done) {
						self.push(null)
						return
					}
					self.push(new Buffer(result.value))
					read()
				}).catch(function(err) {
					self.emit('error', err)
				})
			}
			read()

		} else {
			self._xhr = xhr
			self._pos = 0

			self.url = xhr.responseURL
			self.statusCode = xhr.status
			self.statusMessage = xhr.statusText
			var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
			headers.forEach(function (header) {
				var matches = header.match(/^([^:]+):\s*(.*)/)
				if (matches) {
					var key = matches[1].toLowerCase()
					if (key === 'set-cookie') {
						if (self.headers[key] === undefined) {
							self.headers[key] = []
						}
						self.headers[key].push(matches[2])
					} else if (self.headers[key] !== undefined) {
						self.headers[key] += ', ' + matches[2]
					} else {
						self.headers[key] = matches[2]
					}
					self.rawHeaders.push(matches[1], matches[2])
				}
			})

			self._charset = 'x-user-defined'
			if (!capability.overrideMimeType) {
				var mimeType = self.rawHeaders['mime-type']
				if (mimeType) {
					var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
					if (charsetMatch) {
						self._charset = charsetMatch[1].toLowerCase()
					}
				}
				if (!self._charset)
					self._charset = 'utf-8' // best guess
			}
		}
	}

	inherits(IncomingMessage, stream.Readable)

	IncomingMessage.prototype._read = function () {}

	IncomingMessage.prototype._onXHRProgress = function () {
		var self = this

		var xhr = self._xhr

		var response = null
		switch (self._mode) {
			case 'text:vbarray': // For IE9
				if (xhr.readyState !== rStates.DONE)
					break
				try {
					// This fails in IE8
					response = new global.VBArray(xhr.responseBody).toArray()
				} catch (e) {}
				if (response !== null) {
					self.push(new Buffer(response))
					break
				}
				// Falls through in IE8	
			case 'text':
				try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
					response = xhr.responseText
				} catch (e) {
					self._mode = 'text:vbarray'
					break
				}
				if (response.length > self._pos) {
					var newData = response.substr(self._pos)
					if (self._charset === 'x-user-defined') {
						var buffer = new Buffer(newData.length)
						for (var i = 0; i < newData.length; i++)
							buffer[i] = newData.charCodeAt(i) & 0xff

						self.push(buffer)
					} else {
						self.push(newData, self._charset)
					}
					self._pos = response.length
				}
				break
			case 'arraybuffer':
				if (xhr.readyState !== rStates.DONE || !xhr.response)
					break
				response = xhr.response
				self.push(new Buffer(new Uint8Array(response)))
				break
			case 'moz-chunked-arraybuffer': // take whole
				response = xhr.response
				if (xhr.readyState !== rStates.LOADING || !response)
					break
				self.push(new Buffer(new Uint8Array(response)))
				break
			case 'ms-stream':
				response = xhr.response
				if (xhr.readyState !== rStates.LOADING)
					break
				var reader = new global.MSStreamReader()
				reader.onprogress = function () {
					if (reader.result.byteLength > self._pos) {
						self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
						self._pos = reader.result.byteLength
					}
				}
				reader.onload = function () {
					self.push(null)
				}
				// reader.onerror = ??? // TODO: this
				reader.readAsArrayBuffer(response)
				break
		}

		// The ms-stream case handles end separately in reader.onload()
		if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
			self.push(null)
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), __webpack_require__(8).Buffer, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var Stream = (function (){
	  try {
	    return __webpack_require__(17); // hack to fix a circular dependency issue when used with browserify
	  } catch(_){}
	}());
	exports = module.exports = __webpack_require__(29);
	exports.Stream = Stream || exports;
	exports.Readable = exports;
	exports.Writable = __webpack_require__(20);
	exports.Duplex = __webpack_require__(28);
	exports.Transform = __webpack_require__(35);
	exports.PassThrough = __webpack_require__(37);

	if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
	  module.exports = Stream;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(18).EventEmitter;
	var inherits = __webpack_require__(14);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(16);
	Stream.Writable = __webpack_require__(19);
	Stream.Duplex = __webpack_require__(33);
	Stream.Transform = __webpack_require__(34);
	Stream.PassThrough = __webpack_require__(36);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20)


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	'use strict';

	module.exports = Writable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Writable.WritableState = WritableState;

	/*<replacement>*/
	var util = __webpack_require__(24);
	util.inherits = __webpack_require__(14);
	/*</replacement>*/

	/*<replacement>*/
	var internalUtil = {
	  deprecate: __webpack_require__(25)
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(17);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(18).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(26).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(27);
	/*</replacement>*/

	util.inherits(Writable, Stream);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	function WritableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(28);

	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // drain event flag.
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function getBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};

	(function () {
	  try {
	    Object.defineProperty(WritableState.prototype, 'buffer', {
	      get: internalUtil.deprecate(function () {
	        return this.getBuffer();
	      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	    });
	  } catch (_) {}
	})();

	// Test _writableState for inheritance to account for Duplex streams,
	// whose prototype chain only points to Readable.
	var realHasInstance;
	if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
	  realHasInstance = Function.prototype[Symbol.hasInstance];
	  Object.defineProperty(Writable, Symbol.hasInstance, {
	    value: function (object) {
	      if (realHasInstance.call(this, object)) return true;

	      return object && object._writableState instanceof WritableState;
	    }
	  });
	} else {
	  realHasInstance = function (object) {
	    return object instanceof this;
	  };
	}

	function Writable(options) {
	  Duplex = Duplex || __webpack_require__(28);

	  // Writable ctor is applied to Duplexes, too.
	  // `realHasInstance` is necessary because using plain `instanceof`
	  // would return false, as no `_writableState` property is attached.

	  // Trying to use the custom `instanceof` for Writable here will also break the
	  // Node.js LazyTransform implementation, which has a non-trivial getter for
	  // `_writableState` that would lead to infinite recursion.
	  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
	    return new Writable(options);
	  }

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  processNextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    processNextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = bufferShim.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) processNextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	      asyncWrite(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite(stream, state, finished, cb);
	      }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('_write() is not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), __webpack_require__(21).setImmediate))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(22);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(12)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (!process.version ||
	    process.version.indexOf('v0.') === 0 ||
	    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
	  module.exports = nextTick;
	} else {
	  module.exports = process.nextTick;
	}

	function nextTick(fn, arg1, arg2, arg3) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('"callback" argument must be a function');
	  }
	  var len = arguments.length;
	  var args, i;
	  switch (len) {
	  case 0:
	  case 1:
	    return process.nextTick(fn);
	  case 2:
	    return process.nextTick(function afterTickOne() {
	      fn.call(null, arg1);
	    });
	  case 3:
	    return process.nextTick(function afterTickTwo() {
	      fn.call(null, arg1, arg2);
	    });
	  case 4:
	    return process.nextTick(function afterTickThree() {
	      fn.call(null, arg1, arg2, arg3);
	    });
	  default:
	    args = new Array(len - 1);
	    i = 0;
	    while (i < args.length) {
	      args[i++] = arguments[i];
	    }
	    return process.nextTick(function afterTick() {
	      fn.apply(null, args);
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 25 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module exports.
	 */

	module.exports = deprecate;

	/**
	 * Mark that a method should not be used.
	 * Returns a modified function which warns once by default.
	 *
	 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
	 *
	 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
	 * will throw an Error when invoked.
	 *
	 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
	 * will invoke `console.trace()` instead of `console.error()`.
	 *
	 * @param {Function} fn - the function to deprecate
	 * @param {String} msg - the string to print to the console when `fn` is invoked
	 * @returns {Function} a new "deprecated" version of `fn`
	 * @api public
	 */

	function deprecate (fn, msg) {
	  if (config('noDeprecation')) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (config('throwDeprecation')) {
	        throw new Error(msg);
	      } else if (config('traceDeprecation')) {
	        console.trace(msg);
	      } else {
	        console.warn(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	/**
	 * Checks `localStorage` for boolean values for the given `name`.
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 * @api private
	 */

	function config (name) {
	  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
	  try {
	    if (!global.localStorage) return false;
	  } catch (_) {
	    return false;
	  }
	  var val = global.localStorage[name];
	  if (null == val) return false;
	  return String(val).toLowerCase() === 'true';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(9)
	var ieee754 = __webpack_require__(10)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	var K_MAX_LENGTH = 0x7fffffff
	exports.kMaxLength = K_MAX_LENGTH

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
	 *               implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * We report that the browser does not support typed arrays if the are not subclassable
	 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	 * for __proto__ and has a buggy typed array implementation.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

	if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
	    typeof console.error === 'function') {
	  console.error(
	    'This browser lacks typed array (Uint8Array) support which is required by ' +
	    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
	  )
	}

	function typedArraySupport () {
	  // Can typed array instances can be augmented?
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42
	  } catch (e) {
	    return false
	  }
	}

	function createBuffer (length) {
	  if (length > K_MAX_LENGTH) {
	    throw new RangeError('Invalid typed array length')
	  }
	  // Return an augmented `Uint8Array` instance
	  var buf = new Uint8Array(length)
	  buf.__proto__ = Buffer.prototype
	  return buf
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(arg)
	  }
	  return from(arg, encodingOrOffset, length)
	}

	// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	if (typeof Symbol !== 'undefined' && Symbol.species &&
	    Buffer[Symbol.species] === Buffer) {
	  Object.defineProperty(Buffer, Symbol.species, {
	    value: null,
	    configurable: true,
	    enumerable: false,
	    writable: false
	  })
	}

	Buffer.poolSize = 8192 // not used by this implementation

	function from (value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (value instanceof ArrayBuffer) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(value, encodingOrOffset)
	  }

	  return fromObject(value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(value, encodingOrOffset, length)
	}

	// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
	// https://github.com/feross/buffer/pull/148
	Buffer.prototype.__proto__ = Uint8Array.prototype
	Buffer.__proto__ = Uint8Array

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(size).fill(fill, encoding)
	      : createBuffer(size).fill(fill)
	  }
	  return createBuffer(size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(size, fill, encoding)
	}

	function allocUnsafe (size) {
	  assertSize(size)
	  return createBuffer(size < 0 ? 0 : checked(size) | 0)
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(size)
	}

	function fromString (string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  var buf = createBuffer(length)

	  var actual = buf.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    buf = buf.slice(0, actual)
	  }

	  return buf
	}

	function fromArrayLike (array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  var buf = createBuffer(length)
	  for (var i = 0; i < length; i += 1) {
	    buf[i] = array[i] & 255
	  }
	  return buf
	}

	function fromArrayBuffer (array, byteOffset, length) {
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  var buf
	  if (byteOffset === undefined && length === undefined) {
	    buf = new Uint8Array(array)
	  } else if (length === undefined) {
	    buf = new Uint8Array(array, byteOffset)
	  } else {
	    buf = new Uint8Array(array, byteOffset, length)
	  }

	  // Return an augmented `Uint8Array` instance
	  buf.__proto__ = Buffer.prototype
	  return buf
	}

	function fromObject (obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    var buf = createBuffer(len)

	    if (buf.length === 0) {
	      return buf
	    }

	    obj.copy(buf, 0, 0, len)
	    return buf
	  }

	  if (obj) {
	    if (ArrayBuffer.isView(obj) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(0)
	      }
	      return fromArrayLike(obj)
	    }

	    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
	      return fromArrayLike(obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= K_MAX_LENGTH) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return b != null && b._isBuffer === true
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!Array.isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
	// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
	// reliably in a browserify context because there could be multiple different
	// copies of the 'buffer' package in use. This method works even for Buffer
	// instances that were created from another copy of the `buffer` package.
	// See: https://github.com/feross/buffer/issues/154
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset >>> 0
	    if (isFinite(length)) {
	      length = length >>> 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf = this.subarray(start, end)
	  // Return an augmented `Uint8Array` instance
	  newBuf.__proto__ = Buffer.prototype
	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  offset = offset >>> 0
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  byteLength = byteLength >>> 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  this[offset] = (value & 0xff)
	  this[offset + 1] = (value >>> 8)
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  this[offset] = (value >>> 8)
	  this[offset + 1] = (value & 0xff)
	  return offset + 2
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  this[offset + 3] = (value >>> 24)
	  this[offset + 2] = (value >>> 16)
	  this[offset + 1] = (value >>> 8)
	  this[offset] = (value & 0xff)
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  this[offset] = (value >>> 24)
	  this[offset + 1] = (value >>> 16)
	  this[offset + 2] = (value >>> 8)
	  this[offset + 3] = (value & 0xff)
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    var limit = Math.pow(2, (8 * byteLength) - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    var limit = Math.pow(2, (8 * byteLength) - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  this[offset] = (value & 0xff)
	  this[offset + 1] = (value >>> 8)
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  this[offset] = (value >>> 8)
	  this[offset + 1] = (value & 0xff)
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  this[offset] = (value & 0xff)
	  this[offset + 1] = (value >>> 8)
	  this[offset + 2] = (value >>> 16)
	  this[offset + 3] = (value >>> 24)
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  this[offset] = (value >>> 24)
	  this[offset + 1] = (value >>> 16)
	  this[offset + 2] = (value >>> 8)
	  this[offset + 3] = (value & 0xff)
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  value = +value
	  offset = offset >>> 0
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : new Buffer(val, encoding)
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var buffer = __webpack_require__(26);
	var Buffer = buffer.Buffer;
	var SlowBuffer = buffer.SlowBuffer;
	var MAX_LEN = buffer.kMaxLength || 2147483647;
	exports.alloc = function alloc(size, fill, encoding) {
	  if (typeof Buffer.alloc === 'function') {
	    return Buffer.alloc(size, fill, encoding);
	  }
	  if (typeof encoding === 'number') {
	    throw new TypeError('encoding must not be number');
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  var enc = encoding;
	  var _fill = fill;
	  if (_fill === undefined) {
	    enc = undefined;
	    _fill = 0;
	  }
	  var buf = new Buffer(size);
	  if (typeof _fill === 'string') {
	    var fillBuf = new Buffer(_fill, enc);
	    var flen = fillBuf.length;
	    var i = -1;
	    while (++i < size) {
	      buf[i] = fillBuf[i % flen];
	    }
	  } else {
	    buf.fill(_fill);
	  }
	  return buf;
	}
	exports.allocUnsafe = function allocUnsafe(size) {
	  if (typeof Buffer.allocUnsafe === 'function') {
	    return Buffer.allocUnsafe(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new Buffer(size);
	}
	exports.from = function from(value, encodingOrOffset, length) {
	  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
	    return Buffer.from(value, encodingOrOffset, length);
	  }
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number');
	  }
	  if (typeof value === 'string') {
	    return new Buffer(value, encodingOrOffset);
	  }
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    var offset = encodingOrOffset;
	    if (arguments.length === 1) {
	      return new Buffer(value);
	    }
	    if (typeof offset === 'undefined') {
	      offset = 0;
	    }
	    var len = length;
	    if (typeof len === 'undefined') {
	      len = value.byteLength - offset;
	    }
	    if (offset >= value.byteLength) {
	      throw new RangeError('\'offset\' is out of bounds');
	    }
	    if (len > value.byteLength - offset) {
	      throw new RangeError('\'length\' is out of bounds');
	    }
	    return new Buffer(value.slice(offset, offset + len));
	  }
	  if (Buffer.isBuffer(value)) {
	    var out = new Buffer(value.length);
	    value.copy(out, 0, 0, value.length);
	    return out;
	  }
	  if (value) {
	    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
	      return new Buffer(value);
	    }
	    if (value.type === 'Buffer' && Array.isArray(value.data)) {
	      return new Buffer(value.data);
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
	}
	exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
	  if (typeof Buffer.allocUnsafeSlow === 'function') {
	    return Buffer.allocUnsafeSlow(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size >= MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new SlowBuffer(size);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	'use strict';

	/*<replacement>*/

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/

	module.exports = Duplex;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(24);
	util.inherits = __webpack_require__(14);
	/*</replacement>*/

	var Readable = __webpack_require__(29);
	var Writable = __webpack_require__(20);

	util.inherits(Duplex, Readable);

	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}

	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  processNextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	module.exports = Readable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var isArray = __webpack_require__(11);
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	/*<replacement>*/
	var EE = __webpack_require__(18).EventEmitter;

	var EElistenerCount = function (emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(17);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(18).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(26).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(27);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(24);
	util.inherits = __webpack_require__(14);
	/*</replacement>*/

	/*<replacement>*/
	var debugUtil = __webpack_require__(30);
	var debug = void 0;
	if (debugUtil && debugUtil.debuglog) {
	  debug = debugUtil.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/

	var BufferList = __webpack_require__(31);
	var StringDecoder;

	util.inherits(Readable, Stream);

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
	  }
	}

	function ReadableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(28);

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(32).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  Duplex = Duplex || __webpack_require__(28);

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = bufferShim.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable(stream);
	        }
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(32).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    processNextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('_read() is not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++) {
	      dests[i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var index = indexOf(state.pipes, dest);
	  if (index === -1) return this;

	  state.pipes.splice(index, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        processNextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    processNextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = bufferShim.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    processNextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 30 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(26).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(27);
	/*</replacement>*/

	module.exports = BufferList;

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return bufferShim.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = bufferShim.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(26).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28)


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(35)


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	'use strict';

	module.exports = Transform;

	var Duplex = __webpack_require__(28);

	/*<replacement>*/
	var util = __webpack_require__(24);
	util.inherits = __webpack_require__(14);
	/*</replacement>*/

	util.inherits(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}

	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  // When the writable side finishes, then flush out anything remaining.
	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er, data) {
	      done(stream, er, data);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('_transform() is not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done(stream, er, data) {
	  if (er) return stream.emit('error', er);

	  if (data !== null && data !== undefined) stream.push(data);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(37)


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	'use strict';

	module.exports = PassThrough;

	var Transform = __webpack_require__(35);

	/*<replacement>*/
	var util = __webpack_require__(24);
	util.inherits = __webpack_require__(14);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Buffer = __webpack_require__(26).Buffer

	module.exports = function (buf) {
		// If the buffer is backed by a Uint8Array, a faster version will work
		if (buf instanceof Uint8Array) {
			// If the buffer isn't a subarray, return the underlying ArrayBuffer
			if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
				return buf.buffer
			} else if (typeof buf.buffer.slice === 'function') {
				// Otherwise we need to get a proper copy
				return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
			}
		}

		if (Buffer.isBuffer(buf)) {
			// This is the slow version that will work with any Buffer
			// implementation (even in old browsers)
			var arrayCopy = new Uint8Array(buf.length)
			var len = buf.length
			for (var i = 0; i < len; i++) {
				arrayCopy[i] = buf[i]
			}
			return arrayCopy.buffer
		} else {
			throw new Error('Argument must be a Buffer')
		}
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = extend

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = {
	  "100": "Continue",
	  "101": "Switching Protocols",
	  "102": "Processing",
	  "200": "OK",
	  "201": "Created",
	  "202": "Accepted",
	  "203": "Non-Authoritative Information",
	  "204": "No Content",
	  "205": "Reset Content",
	  "206": "Partial Content",
	  "207": "Multi-Status",
	  "208": "Already Reported",
	  "226": "IM Used",
	  "300": "Multiple Choices",
	  "301": "Moved Permanently",
	  "302": "Found",
	  "303": "See Other",
	  "304": "Not Modified",
	  "305": "Use Proxy",
	  "307": "Temporary Redirect",
	  "308": "Permanent Redirect",
	  "400": "Bad Request",
	  "401": "Unauthorized",
	  "402": "Payment Required",
	  "403": "Forbidden",
	  "404": "Not Found",
	  "405": "Method Not Allowed",
	  "406": "Not Acceptable",
	  "407": "Proxy Authentication Required",
	  "408": "Request Timeout",
	  "409": "Conflict",
	  "410": "Gone",
	  "411": "Length Required",
	  "412": "Precondition Failed",
	  "413": "Payload Too Large",
	  "414": "URI Too Long",
	  "415": "Unsupported Media Type",
	  "416": "Range Not Satisfiable",
	  "417": "Expectation Failed",
	  "418": "I'm a teapot",
	  "421": "Misdirected Request",
	  "422": "Unprocessable Entity",
	  "423": "Locked",
	  "424": "Failed Dependency",
	  "425": "Unordered Collection",
	  "426": "Upgrade Required",
	  "428": "Precondition Required",
	  "429": "Too Many Requests",
	  "431": "Request Header Fields Too Large",
	  "451": "Unavailable For Legal Reasons",
	  "500": "Internal Server Error",
	  "501": "Not Implemented",
	  "502": "Bad Gateway",
	  "503": "Service Unavailable",
	  "504": "Gateway Timeout",
	  "505": "HTTP Version Not Supported",
	  "506": "Variant Also Negotiates",
	  "507": "Insufficient Storage",
	  "508": "Loop Detected",
	  "509": "Bandwidth Limit Exceeded",
	  "510": "Not Extended",
	  "511": "Network Authentication Required"
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var punycode = __webpack_require__(42);
	var util = __webpack_require__(44);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(45);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
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
			throw RangeError(errors[type]);
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
		 * http://tools.ietf.org/html/rfc3492#section-3.4
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
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43)(module), (function() { return this; }())))

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(46);
	exports.encode = exports.stringify = __webpack_require__(47);


/***/ },
/* 46 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 47 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var http = __webpack_require__(6);

	var https = module.exports;

	for (var key in http) {
	    if (http.hasOwnProperty(key)) https[key] = http[key];
	};

	https.request = function (params, cb) {
	    if (!params) params = {};
	    params.scheme = 'https';
	    params.protocol = 'https:';
	    return http.request.call(this, params, cb);
	}


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var qs = __webpack_require__(45)
	var http = __webpack_require__(6)
	var https = __webpack_require__(48)
	var url = __webpack_require__(41)

	module.exports = function POST(options, callback) {

	  // require options.url or fail noisily 
	  if (!options.url) {
	    throw Error('options.url required')
	  }

	  // parse out the options from options.url
	  var opts = url.parse(options.url)
	  var method = opts.protocol === 'https:'? https.request : http.request
	  var defaultContentType = 'application/json; charset=utf-8'

	  opts.method = 'POST'
	  opts.rejectUnauthorized = false
	  opts.agent = false
	  opts.headers = options.headers || {}
	  opts.headers['User-Agent'] = opts.headers['User-Agent'] || 'tiny-http'
	  opts.headers['Content-Type'] = opts.headers['Content-Type'] || defaultContentType
	  // opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
	  var reqJSON = opts.headers['Content-Type'].startsWith('application/json')
	  var postData = reqJSON? JSON.stringify(options.data || {}) : qs.stringify(options.data || {})

	  // make a POST request
	  var req = method(opts, function(res) {
	   
	    var rawData = ''
	    var statusCode = res.statusCode
	    var contentType = res.headers['content-type']
	    var isJSON = contentType === 'application/json'

	    if (statusCode !== 200) {
	      callback(Error('GET failed with: ' + statusCode))
	      res.resume()
	      return
	    }
	 
	    res.setEncoding('utf8')
	    res.on('data', function(chunk) { rawData += chunk })
	    res.on('end', function(x) {
	      try {
	        var parsedData = isJSON? JSON.parse(rawData) : rawData
	        callback(null, parsedData)
	      } 
	      catch (e) {
	        callback(e.message)
	      }
	    })
	  })

	  req.on('error', function(e) { callback(Error(e.message)) })

	  req.write(postData)
	 
	  req.end()
	}


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = validate;

	var _api = __webpack_require__(51);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function validate(method, params) {
	  // get all the requried params for this method
	  var required = _api2.default[method].filter(function (param) {
	    return param.required === 'Required';
	  });
	  // collect any missing params
	  var missing = required.filter(function (param) {
	    return typeof params[param.name] === 'undefined';
	  });
	  // optimisitcally assume the best
	  var err = false;
	  // but have a plan for the worst
	  if (missing.length) {
	    var bullets = missing.map(function (param) {
	      return '- ' + param.name + ' ... ' + param.description;
	    });
	    var msg = method + ' missing params:\n' + bullets.join('\n');
	    err = Error(msg);
	  }
	  return err;
	} //
	// validate returns an error object if any required params are missing
	//
	// example usage:
	// 
	//   // token and id are required params
	//   function apiCall(params, callback) { 
	//     let err = validate('api.signature', params)
	//     if (err) {
	//       callback(err)
	//     }
	//     else {
	//       // do api call
	//     }
	//   }
	//
	module.exports = exports['default'];

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = {
		"api.test": [
			{
				"name": "error",
				"example": "my_error",
				"required": "Optional",
				"description": "Error response to return\n"
			},
			{
				"name": "foo",
				"example": "bar",
				"required": "Optional",
				"description": "example property to return\n"
			}
		],
		"auth.revoke": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Optional",
				"description": "Authentication token.\n"
			},
			{
				"name": "test",
				"example": "true",
				"required": "Optional",
				"description": "Setting this parameter to 1 triggers a testing mode where the specified token will not actually be revoked.\n"
			}
		],
		"auth.test": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: identify\n"
			}
		],
		"bots.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:read\n"
			},
			{
				"name": "bot",
				"example": "B12345678",
				"required": "Optional",
				"description": "Bot user to get info on\n"
			}
		],
		"channels.archive": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to archive\n"
			}
		],
		"channels.create": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "name",
				"example": "mychannel",
				"required": "Required",
				"description": "Name of channel to create\n"
			}
		],
		"channels.history": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:history\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to fetch history for.\n"
			},
			{
				"name": "latest",
				"example": "1234567890.123456",
				"required": "Optional, default=now",
				"description": "End of time range of messages to include in results.\n"
			},
			{
				"name": "oldest",
				"example": "1234567890.123456",
				"required": "Optional, default=0",
				"description": "Start of time range of messages to include in results.\n"
			},
			{
				"name": "inclusive",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include messages with latest or oldest timestamp in results.\n"
			},
			{
				"name": "count",
				"example": "100",
				"required": "Optional, default=100",
				"description": "Number of messages to return, between 1 and 1000.\n"
			},
			{
				"name": "unreads",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include unread_count_display in the output?\n"
			}
		],
		"channels.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:read\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to get info on\n"
			}
		],
		"channels.invite": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to invite user to.\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to invite to channel.\n"
			}
		],
		"channels.join": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "name",
				"example": "C1234567890",
				"required": "Required",
				"description": "Name of channel to join\n"
			}
		],
		"channels.kick": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to remove user from.\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to remove from channel.\n"
			}
		],
		"channels.leave": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to leave\n"
			}
		],
		"channels.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:read\n"
			},
			{
				"name": "exclude_archived",
				"example": "true",
				"required": "Optional, default=false",
				"description": "Don't return archived channels.\n"
			}
		],
		"channels.mark": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to set reading cursor in.\n"
			},
			{
				"name": "ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Timestamp of the most recently seen message.\n"
			}
		],
		"channels.rename": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to rename\n"
			},
			{
				"name": "name",
				"example": " ",
				"required": "Required",
				"description": "New name for channel.\n"
			}
		],
		"channels.replies": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:history\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to fetch thread from\n"
			},
			{
				"name": "thread_ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Unique identifier of a thread's parent message\n"
			}
		],
		"channels.setPurpose": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to set the purpose of\n"
			},
			{
				"name": "purpose",
				"example": "My Purpose",
				"required": "Required",
				"description": "The new purpose\n"
			}
		],
		"channels.setTopic": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to set the topic of\n"
			},
			{
				"name": "topic",
				"example": "My Topic",
				"required": "Required",
				"description": "The new topic\n"
			}
		],
		"channels.unarchive": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: channels:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to unarchive\n"
			}
		],
		"chat.delete": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: chat:write:bot or chat:write:user\n"
			},
			{
				"name": "ts",
				"example": "1405894322.002768",
				"required": "Required",
				"description": "Timestamp of the message to be deleted.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel containing the message to be deleted.\n"
			},
			{
				"name": "as_user",
				"example": "true",
				"required": "Optional",
				"description": "Pass true to delete the message as the authed user. Bot users in this context are considered authed users.\n"
			}
		],
		"chat.meMessage": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: chat:write:user\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to send message to. Can be a public channel, private group or IM channel. Can be an encoded ID, or a name.\n"
			},
			{
				"name": "text",
				"example": "Hello world",
				"required": "Required",
				"description": "Text of the message to send.\n"
			}
		],
		"chat.postMessage": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: chat:write:bot or chat:write:user\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name. See below for more details.\n"
			},
			{
				"name": "text",
				"example": "Hello world",
				"required": "Required",
				"description": "Text of the message to send. See below for an explanation of formatting. This field is usually required, unless you're providing only attachments instead.\n"
			},
			{
				"name": "parse",
				"example": "full",
				"required": "Optional",
				"description": "Change how messages are treated. Defaults to none. See below.\n"
			},
			{
				"name": "link_names",
				"example": "true",
				"required": "Optional",
				"description": "Find and link channel names and usernames.\n"
			},
			{
				"name": "attachments",
				"example": "[{\"pretext\": \"pre-hello\", \"text\": \"text-world\"}]",
				"required": "Optional",
				"description": "Structured message attachments.\n"
			},
			{
				"name": "unfurl_links",
				"example": "true",
				"required": "Optional",
				"description": "Pass true to enable unfurling of primarily text-based content.\n"
			},
			{
				"name": "unfurl_media",
				"example": "false",
				"required": "Optional",
				"description": "Pass false to disable unfurling of media content.\n"
			},
			{
				"name": "username",
				"example": "My Bot",
				"required": "Optional",
				"description": "Set your bot's user name. Must be used in conjunction with as_user set to false, otherwise ignored. See authorship below.\n"
			},
			{
				"name": "as_user",
				"example": "true",
				"required": "Optional",
				"description": "Pass true to post the message as the authed user, instead of as a bot. Defaults to false. See authorship below.\n"
			},
			{
				"name": "icon_url",
				"example": "http://lorempixel.com/48/48",
				"required": "Optional",
				"description": "URL to an image to use as the icon for this message. Must be used in conjunction with as_user set to false, otherwise ignored. See authorship below.\n"
			},
			{
				"name": "icon_emoji",
				"example": ":chart_with_upwards_trend:",
				"required": "Optional",
				"description": "Emoji to use as the icon for this message. Overrides icon_url. Must be used in conjunction with as_user set to false, otherwise ignored. See authorship below.\n"
			},
			{
				"name": "thread_ts",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Provide another message's ts value to make this message a reply. Avoid using a reply's ts value; use its parent instead.\n"
			},
			{
				"name": "reply_broadcast",
				"example": "true",
				"required": "Optional",
				"description": "Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to false.\n"
			}
		],
		"chat.update": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: chat:write:bot or chat:write:user\n"
			},
			{
				"name": "ts",
				"example": "1405894322.002768",
				"required": "Required",
				"description": "Timestamp of the message to be updated.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel containing the message to be updated.\n"
			},
			{
				"name": "text",
				"example": "Hello world",
				"required": "Required",
				"description": "New text for the message, using the default formatting rules.\n"
			},
			{
				"name": "attachments",
				"example": "[{\"pretext\": \"pre-hello\", \"text\": \"text-world\"}]",
				"required": "Optional",
				"description": "Structured message attachments.\n"
			},
			{
				"name": "parse",
				"example": "none",
				"required": "Optional",
				"description": "Change how messages are treated. Defaults to client, unlike chat.postMessage. See below.\n"
			},
			{
				"name": "link_names",
				"example": "true",
				"required": "Optional",
				"description": "Find and link channel names and usernames. Defaults to none. This parameter should be used in conjunction with parse. To set link_names to 1, specify a parse mode of full.\n"
			},
			{
				"name": "as_user",
				"example": "true",
				"required": "Optional",
				"description": "Pass true to update the message as the authed user. Bot users in this context are considered authed users.\n"
			}
		],
		"dnd.endDnd": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: dnd:write\n"
			}
		],
		"dnd.endSnooze": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: dnd:write\n"
			}
		],
		"dnd.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: dnd:read\n"
			},
			{
				"name": "user",
				"example": "U1234",
				"required": "Optional",
				"description": "User to fetch status for (defaults to current user)\n"
			}
		],
		"dnd.setSnooze": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: dnd:write\n"
			},
			{
				"name": "num_minutes",
				"example": "60",
				"required": "Required",
				"description": "Number of minutes, from now, to snooze until.\n"
			}
		],
		"dnd.teamInfo": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: dnd:read\n"
			},
			{
				"name": "users",
				"example": "U1234,U4567",
				"required": "Optional",
				"description": "Comma-separated list of users to fetch Do Not Disturb status for\n"
			}
		],
		"emoji.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: emoji:read\n"
			}
		],
		"files.comments.add": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234467890",
				"required": "Required",
				"description": "File to add a comment to.\n"
			},
			{
				"name": "comment",
				"example": "Everyone should take a moment to read this file.",
				"required": "Required",
				"description": "Text of the comment to add.\n"
			},
			{
				"name": "channel",
				"example": "C1234467890",
				"required": "Optional",
				"description": "Channel id (encoded) of which location to associate with the new comment.\n"
			}
		],
		"files.comments.delete": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Required",
				"description": "File to delete a comment from.\n"
			},
			{
				"name": "id",
				"example": "Fc1234567890",
				"required": "Required",
				"description": "The comment to delete.\n"
			}
		],
		"files.comments.edit": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Required",
				"description": "File containing the comment to edit.\n"
			},
			{
				"name": "id",
				"example": "Fc1234567890",
				"required": "Required",
				"description": "The comment to edit.\n"
			},
			{
				"name": "comment",
				"example": "Everyone should take a moment to read this file, seriously.",
				"required": "Required",
				"description": "Text of the comment to edit.\n"
			}
		],
		"files.delete": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Required",
				"description": "ID of file to delete.\n"
			}
		],
		"files.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:read\n"
			},
			{
				"name": "file",
				"example": "F2147483862",
				"required": "Required",
				"description": "Specify a file by providing its ID.\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"files.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:read\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "Filter files created by a single user.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Filter files appearing in a specific channel, indicated by its ID.\n"
			},
			{
				"name": "ts_from",
				"example": "123456789",
				"required": "Optional, default=0",
				"description": "Filter files created after this timestamp (inclusive).\n"
			},
			{
				"name": "ts_to",
				"example": "123456789",
				"required": "Optional, default=now",
				"description": "Filter files created before this timestamp (inclusive).\n"
			},
			{
				"name": "types",
				"example": "images",
				"required": "Optional, default=all",
				"description": "Filter files by type:\n\n\nall - All files\nspaces - Posts\nsnippets - Snippets\nimages - Image files\ngdocs - Google docs\nzips - Zip files\npdfs - PDF files\n\n\nYou can pass multiple values in the types argument, like types=spaces,snippets.The default value is all, which does not filter the list.\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"files.revokePublicURL": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Required",
				"description": "File to revoke\n"
			}
		],
		"files.sharedPublicURL": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Required",
				"description": "File to share\n"
			}
		],
		"files.upload": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: files:write:user\n"
			},
			{
				"name": "file",
				"example": "...",
				"required": "Optional",
				"description": "File contents via multipart/form-data. If omitting this parameter, you must submit content.\n"
			},
			{
				"name": "content",
				"example": "...",
				"required": "Optional",
				"description": "File contents via a POST variable. If omitting this parameter, you must provide a file.\n"
			},
			{
				"name": "filetype",
				"example": "php",
				"required": "Optional",
				"description": "A file type identifier.\n"
			},
			{
				"name": "filename",
				"example": "foo.txt",
				"required": "Required",
				"description": "Filename of file.\n"
			},
			{
				"name": "title",
				"example": "My File",
				"required": "Optional",
				"description": "Title of file.\n"
			},
			{
				"name": "initial_comment",
				"example": "Best!",
				"required": "Optional",
				"description": "Initial comment to add to file.\n"
			},
			{
				"name": "channels",
				"example": "C1234567890,C2345678901,C3456789012",
				"required": "Optional",
				"description": "Comma-separated list of channel names or IDs where the file will be shared.\n"
			}
		],
		"groups.archive": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to archive\n"
			}
		],
		"groups.close": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to close.\n"
			}
		],
		"groups.create": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "name",
				"example": " ",
				"required": "Required",
				"description": "Name of private channel to create\n"
			}
		],
		"groups.createChild": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to clone and archive.\n"
			}
		],
		"groups.history": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:history\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to fetch history for.\n"
			},
			{
				"name": "latest",
				"example": "1234567890.123456",
				"required": "Optional, default=now",
				"description": "End of time range of messages to include in results.\n"
			},
			{
				"name": "oldest",
				"example": "1234567890.123456",
				"required": "Optional, default=0",
				"description": "Start of time range of messages to include in results.\n"
			},
			{
				"name": "inclusive",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include messages with latest or oldest timestamp in results.\n"
			},
			{
				"name": "count",
				"example": "100",
				"required": "Optional, default=100",
				"description": "Number of messages to return, between 1 and 1000.\n"
			},
			{
				"name": "unreads",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include unread_count_display in the output?\n"
			}
		],
		"groups.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:read\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to get info on\n"
			}
		],
		"groups.invite": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to invite user to.\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to invite.\n"
			}
		],
		"groups.kick": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to remove user from.\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to remove from private channel.\n"
			}
		],
		"groups.leave": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to leave\n"
			}
		],
		"groups.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:read\n"
			},
			{
				"name": "exclude_archived",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Don't return archived private channels.\n"
			}
		],
		"groups.mark": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to set reading cursor in.\n"
			},
			{
				"name": "ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Timestamp of the most recently seen message.\n"
			}
		],
		"groups.open": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to open.\n"
			}
		],
		"groups.rename": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to rename\n"
			},
			{
				"name": "name",
				"example": " ",
				"required": "Required",
				"description": "New name for private channel.\n"
			}
		],
		"groups.replies": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:history\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Private channel to fetch thread from\n"
			},
			{
				"name": "thread_ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Unique identifier of a thread's parent message\n"
			}
		],
		"groups.setPurpose": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to set the purpose of\n"
			},
			{
				"name": "purpose",
				"example": "My Purpose",
				"required": "Required",
				"description": "The new purpose\n"
			}
		],
		"groups.setTopic": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to set the topic of\n"
			},
			{
				"name": "topic",
				"example": "My Topic",
				"required": "Required",
				"description": "The new topic\n"
			}
		],
		"groups.unarchive": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: groups:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Private channel to unarchive\n"
			}
		],
		"im.close": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:write\n"
			},
			{
				"name": "channel",
				"example": "D1234567890",
				"required": "Required",
				"description": "Direct message channel to close.\n"
			}
		],
		"im.history": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:history\n"
			},
			{
				"name": "channel",
				"example": "D1234567890",
				"required": "Required",
				"description": "Direct message channel to fetch history for.\n"
			},
			{
				"name": "latest",
				"example": "1234567890.123456",
				"required": "Optional, default=now",
				"description": "End of time range of messages to include in results.\n"
			},
			{
				"name": "oldest",
				"example": "1234567890.123456",
				"required": "Optional, default=0",
				"description": "Start of time range of messages to include in results.\n"
			},
			{
				"name": "inclusive",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include messages with latest or oldest timestamp in results.\n"
			},
			{
				"name": "count",
				"example": "100",
				"required": "Optional, default=100",
				"description": "Number of messages to return, between 1 and 1000.\n"
			},
			{
				"name": "unreads",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include unread_count_display in the output?\n"
			}
		],
		"im.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:read\n"
			}
		],
		"im.mark": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:write\n"
			},
			{
				"name": "channel",
				"example": "D1234567890",
				"required": "Required",
				"description": "Direct message channel to set reading cursor in.\n"
			},
			{
				"name": "ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Timestamp of the most recently seen message.\n"
			}
		],
		"im.open": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:write\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to open a direct message channel with.\n"
			},
			{
				"name": "return_im",
				"example": "true",
				"required": "Optional",
				"description": "Boolean, indicates you want the full IM channel definition in the response.\n"
			}
		],
		"im.replies": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: im:history\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Direct message channel to fetch thread from\n"
			},
			{
				"name": "thread_ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Unique identifier of a thread's parent message\n"
			}
		],
		"mpim.close": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "MPIM to close.\n"
			}
		],
		"mpim.history": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:history\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "Multiparty direct message to fetch history for.\n"
			},
			{
				"name": "latest",
				"example": "1234567890.123456",
				"required": "Optional, default=now",
				"description": "End of time range of messages to include in results.\n"
			},
			{
				"name": "oldest",
				"example": "1234567890.123456",
				"required": "Optional, default=0",
				"description": "Start of time range of messages to include in results.\n"
			},
			{
				"name": "inclusive",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include messages with latest or oldest timestamp in results.\n"
			},
			{
				"name": "count",
				"example": "100",
				"required": "Optional, default=100",
				"description": "Number of messages to return, between 1 and 1000.\n"
			},
			{
				"name": "unreads",
				"example": "true",
				"required": "Optional, default=0",
				"description": "Include unread_count_display in the output?\n"
			}
		],
		"mpim.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:read\n"
			}
		],
		"mpim.mark": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:write\n"
			},
			{
				"name": "channel",
				"example": "G1234567890",
				"required": "Required",
				"description": "multiparty direct message channel to set reading cursor in.\n"
			},
			{
				"name": "ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Timestamp of the most recently seen message.\n"
			}
		],
		"mpim.open": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:write\n"
			},
			{
				"name": "users",
				"example": "U1234567890,U2345678901,U3456789012",
				"required": "Required",
				"description": "Comma separated lists of users.  The ordering of the users is preserved whenever a MPIM group is returned.\n"
			}
		],
		"mpim.replies": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: mpim:history\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Multiparty direct message channel to fetch thread from.\n"
			},
			{
				"name": "thread_ts",
				"example": "1234567890.123456",
				"required": "Required",
				"description": "Unique identifier of a thread's parent message.\n"
			}
		],
		"oauth.access": [
			{
				"name": "client_id",
				"example": "4b39e9-752c4",
				"required": "Required",
				"description": "Issued when you created your application.\n"
			},
			{
				"name": "client_secret",
				"example": "33fea0113f5b1",
				"required": "Required",
				"description": "Issued when you created your application.\n"
			},
			{
				"name": "code",
				"example": "ccdaa72ad",
				"required": "Required",
				"description": "The code param returned via the OAuth callback.\n"
			},
			{
				"name": "redirect_uri",
				"example": "http://example.com",
				"required": "Optional",
				"description": "This must match the originally submitted URI (if one was sent).\n"
			}
		],
		"pins.add": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: pins:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to pin the item in.\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to pin.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to pin.\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to pin.\n"
			}
		],
		"pins.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: pins:read\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel to get pinned items for.\n"
			}
		],
		"pins.remove": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: pins:write\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Required",
				"description": "Channel where the item is pinned to.\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to un-pin.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to un-pin.\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to un-pin.\n"
			}
		],
		"reactions.add": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reactions:write\n"
			},
			{
				"name": "name",
				"example": "thumbsup",
				"required": "Required",
				"description": "Reaction (emoji) name.\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to add reaction to.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to add reaction to.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Channel where the message to add reaction to was posted.\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to add reaction to.\n"
			}
		],
		"reactions.get": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reactions:read\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to get reactions for.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to get reactions for.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Channel where the message to get reactions for was posted.\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to get reactions for.\n"
			},
			{
				"name": "full",
				"example": "true",
				"required": "Optional",
				"description": "If true always return the complete reaction list.\n"
			}
		],
		"reactions.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reactions:read\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "Show reactions made by this user. Defaults to the authed user.\n"
			},
			{
				"name": "full",
				"example": "true",
				"required": "Optional",
				"description": "If true always return the complete reaction list.\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"reactions.remove": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reactions:write\n"
			},
			{
				"name": "name",
				"example": "thumbsup",
				"required": "Required",
				"description": "Reaction (emoji) name.\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to remove reaction from.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to remove reaction from.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Channel where the message to remove reaction from was posted.\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to remove reaction from.\n"
			}
		],
		"reminders.add": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reminders:write\n"
			},
			{
				"name": "text",
				"example": "eat a banana",
				"required": "Required",
				"description": "The content of the reminder\n"
			},
			{
				"name": "time",
				"example": "1602288000",
				"required": "Required",
				"description": "When this reminder should happen: the Unix timestamp (up to five years from now), the number of seconds until the reminder (if within 24 hours), or a natural language description (Ex. \"in 15 minutes,\" or \"every Thursday\")\n"
			},
			{
				"name": "user",
				"example": "U18888888",
				"required": "Optional",
				"description": "The user who will receive the reminder. If no user is specified, the reminder will go to user who created it.\n"
			}
		],
		"reminders.complete": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reminders:write\n"
			},
			{
				"name": "reminder",
				"example": "Rm12345678",
				"required": "Required",
				"description": "The ID of the reminder to be marked as complete\n"
			}
		],
		"reminders.delete": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reminders:write\n"
			},
			{
				"name": "reminder",
				"example": "Rm12345678",
				"required": "Required",
				"description": "The ID of the reminder\n"
			}
		],
		"reminders.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reminders:read\n"
			},
			{
				"name": "reminder",
				"example": "Rm23456789",
				"required": "Required",
				"description": "The ID of the reminder\n"
			}
		],
		"reminders.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: reminders:read\n"
			}
		],
		"rtm.start": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: client\n"
			},
			{
				"name": "simple_latest",
				"example": "true",
				"required": "Optional",
				"description": "Return timestamp only for latest message object of each channel (improves performance).\n"
			},
			{
				"name": "no_unreads",
				"example": "true",
				"required": "Optional",
				"description": "Skip unread counts for each channel (improves performance).\n"
			},
			{
				"name": "mpim_aware",
				"example": "true",
				"required": "Optional",
				"description": "Returns MPIMs to the client in the API response.\n"
			}
		],
		"search.all": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: search:read\n"
			},
			{
				"name": "query",
				"example": "pickleface",
				"required": "Required",
				"description": "Search query. May contains booleans, etc.\n"
			},
			{
				"name": "sort",
				"example": "timestamp",
				"required": "Optional, default=score",
				"description": "Return matches sorted by either score or timestamp.\n"
			},
			{
				"name": "sort_dir",
				"example": "asc",
				"required": "Optional, default=desc",
				"description": "Change sort direction to ascending (asc) or descending (desc).\n"
			},
			{
				"name": "highlight",
				"example": "true",
				"required": "Optional",
				"description": "Pass a value of true to enable query highlight markers (see below).\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=20",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"search.files": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: search:read\n"
			},
			{
				"name": "query",
				"example": "pickleface",
				"required": "Required",
				"description": "Search query. May contain booleans, etc.\n"
			},
			{
				"name": "sort",
				"example": "timestamp",
				"required": "Optional, default=score",
				"description": "Return matches sorted by either score or timestamp.\n"
			},
			{
				"name": "sort_dir",
				"example": "asc",
				"required": "Optional, default=desc",
				"description": "Change sort direction to ascending (asc) or descending (desc).\n"
			},
			{
				"name": "highlight",
				"example": "true",
				"required": "Optional",
				"description": "Pass a value of true to enable query highlight markers (see below).\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=20",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"search.messages": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: search:read\n"
			},
			{
				"name": "query",
				"example": "pickleface",
				"required": "Required",
				"description": "Search query. May contains booleans, etc.\n"
			},
			{
				"name": "sort",
				"example": "timestamp",
				"required": "Optional, default=score",
				"description": "Return matches sorted by either score or timestamp.\n"
			},
			{
				"name": "sort_dir",
				"example": "asc",
				"required": "Optional, default=desc",
				"description": "Change sort direction to ascending (asc) or descending (desc).\n"
			},
			{
				"name": "highlight",
				"example": "true",
				"required": "Optional",
				"description": "Pass a value of true to enable query highlight markers (see below).\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=20",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"stars.add": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: stars:write\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to add star to.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to add star to.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Channel to add star to, or channel where the message to add star to was posted (used with timestamp).\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to add star to.\n"
			}
		],
		"stars.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: stars:read\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"stars.remove": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: stars:write\n"
			},
			{
				"name": "file",
				"example": "F1234567890",
				"required": "Optional",
				"description": "File to remove star from.\n"
			},
			{
				"name": "file_comment",
				"example": "Fc1234567890",
				"required": "Optional",
				"description": "File comment to remove star from.\n"
			},
			{
				"name": "channel",
				"example": "C1234567890",
				"required": "Optional",
				"description": "Channel to remove star from, or channel where the message to remove star from was posted (used with timestamp).\n"
			},
			{
				"name": "timestamp",
				"example": "1234567890.123456",
				"required": "Optional",
				"description": "Timestamp of the message to remove star from.\n"
			}
		],
		"team.accessLogs": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: admin\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			},
			{
				"name": "before",
				"example": "1457989166",
				"required": "Optional, default=now",
				"description": "End of time range of logs to include in results (inclusive).\n"
			}
		],
		"team.billableInfo": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: admin\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "A user to retrieve the billable information for. Defaults to all users.\n"
			}
		],
		"team.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: team:read\n"
			}
		],
		"team.integrationLogs": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: admin\n"
			},
			{
				"name": "service_id",
				"example": " ",
				"required": "Optional",
				"description": "Filter logs to this service. Defaults to all logs.\n"
			},
			{
				"name": "app_id",
				"example": " ",
				"required": "Optional",
				"description": "Filter logs to this Slack app. Defaults to all logs.\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "Filter logs generated by this user’s actions. Defaults to all logs.\n"
			},
			{
				"name": "change_type",
				"example": "added",
				"required": "Optional",
				"description": "Filter logs with this change type. Defaults to all logs.\n"
			},
			{
				"name": "count",
				"example": "20",
				"required": "Optional, default=100",
				"description": "Number of items to return per page.\n"
			},
			{
				"name": "page",
				"example": "2",
				"required": "Optional, default=1",
				"description": "Page number of results to return.\n"
			}
		],
		"team.profile.get": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users.profile:read\n"
			},
			{
				"name": "visibility",
				"example": "all",
				"required": "Optional",
				"description": "Filter by visibility.\n"
			}
		],
		"usergroups.create": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:write\n"
			},
			{
				"name": "name",
				"example": "My Test Team",
				"required": "Required",
				"description": "A name for the User Group. Must be unique among User Groups.\n"
			},
			{
				"name": "handle",
				"example": "marketing",
				"required": "Optional",
				"description": "A mention handle. Must be unique among channels, users and User Groups.\n"
			},
			{
				"name": "description",
				"example": " ",
				"required": "Optional",
				"description": "A short description of the User Group.\n"
			},
			{
				"name": "channels",
				"example": "C1234567890,C2345678901,C3456789012",
				"required": "Optional",
				"description": "A comma separated string of encoded channel IDs for which the User Group uses as a default.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in each User Group.\n"
			}
		],
		"usergroups.disable": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:write\n"
			},
			{
				"name": "usergroup",
				"example": "S0604QSJC",
				"required": "Required",
				"description": "The encoded ID of the User Group to disable.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in the User Group.\n"
			}
		],
		"usergroups.enable": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:write\n"
			},
			{
				"name": "usergroup",
				"example": "S0604QSJC",
				"required": "Required",
				"description": "The encoded ID of the User Group to enable.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in the User Group.\n"
			}
		],
		"usergroups.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:read\n"
			},
			{
				"name": "include_disabled",
				"example": "true",
				"required": "Optional",
				"description": "Include disabled User Groups.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in each User Group.\n"
			},
			{
				"name": "include_users",
				"example": "true",
				"required": "Optional",
				"description": "Include the list of users for each User Group.\n"
			}
		],
		"usergroups.update": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:write\n"
			},
			{
				"name": "usergroup",
				"example": "S0604QSJC",
				"required": "Required",
				"description": "The encoded ID of the User Group to update.\n"
			},
			{
				"name": "name",
				"example": "My Test Team",
				"required": "Optional",
				"description": "A name for the User Group. Must be unique among User Groups.\n"
			},
			{
				"name": "handle",
				"example": "marketing",
				"required": "Optional",
				"description": "A mention handle. Must be unique among channels, users and User Groups.\n"
			},
			{
				"name": "description",
				"example": " ",
				"required": "Optional",
				"description": "A short description of the User Group.\n"
			},
			{
				"name": "channels",
				"example": "C1234567890,C2345678901,C3456789012",
				"required": "Optional",
				"description": "A comma separated string of encoded channel IDs for which the User Group uses as a default.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in the User Group.\n"
			}
		],
		"usergroups.users.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:read\n"
			},
			{
				"name": "usergroup",
				"example": "S0604QSJC",
				"required": "Required",
				"description": "The encoded ID of the User Group to update.\n"
			},
			{
				"name": "include_disabled",
				"example": "true",
				"required": "Optional",
				"description": "Allow results that involve disabled User Groups.\n"
			}
		],
		"usergroups.users.update": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: usergroups:write\n"
			},
			{
				"name": "usergroup",
				"example": "S0604QSJC",
				"required": "Required",
				"description": "The encoded ID of the User Group to update.\n"
			},
			{
				"name": "users",
				"example": "U060R4BJ4,U060RNRCZ",
				"required": "Required",
				"description": "A comma separated string of encoded user IDs that represent the entire list of users for the User Group.\n"
			},
			{
				"name": "include_count",
				"example": "true",
				"required": "Optional",
				"description": "Include the number of users in the User Group.\n"
			}
		],
		"users.deletePhoto": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users.profile:write\n"
			}
		],
		"users.getPresence": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:read\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to get presence info on. Defaults to the authed user.\n"
			}
		],
		"users.identity": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: identity.basic\n"
			}
		],
		"users.info": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:read\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Required",
				"description": "User to get info on\n"
			}
		],
		"users.list": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:read\n"
			},
			{
				"name": "presence",
				"example": "true",
				"required": "Optional",
				"description": "Whether to include presence data in the output\n"
			}
		],
		"users.setActive": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:write\n"
			}
		],
		"users.setPhoto": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users.profile:write\n"
			},
			{
				"name": "image",
				"example": "...",
				"required": "Required",
				"description": "File contents via multipart/form-data.\n"
			},
			{
				"name": "crop_x",
				"example": "10",
				"required": "Optional",
				"description": "X coordinate of top-left corner of crop box\n"
			},
			{
				"name": "crop_y",
				"example": "15",
				"required": "Optional",
				"description": "Y coordinate of top-left corner of crop box\n"
			},
			{
				"name": "crop_w",
				"example": "100",
				"required": "Optional",
				"description": "Width/height of crop box (always square)\n"
			}
		],
		"users.setPresence": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users:write\n"
			},
			{
				"name": "presence",
				"example": "away",
				"required": "Required",
				"description": "Either auto or away\n"
			}
		],
		"users.profile.get": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users.profile:read\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "User to retrieve profile info for\n"
			},
			{
				"name": "include_labels",
				"example": "true",
				"required": "Optional, default=false",
				"description": "Include labels for each ID in custom profile fields\n"
			}
		],
		"users.profile.set": [
			{
				"name": "token",
				"example": "xxxx-xxxxxxxxx-xxxx",
				"required": "Required",
				"description": "Authentication token.\nRequires scope: users.profile:write\n"
			},
			{
				"name": "user",
				"example": "U1234567890",
				"required": "Optional",
				"description": "ID of user to change. This argument may only be specified by team admins on paid teams.\n"
			},
			{
				"name": "profile",
				"example": "{ first_name: \"John\", ... }",
				"required": "Optional",
				"description": "Collection of key:value pairs presented as a URL-encoded JSON hash.\n"
			},
			{
				"name": "name",
				"example": "first_name",
				"required": "Optional",
				"description": "Name of a single key to set. Usable only if profile is not passed.\n"
			},
			{
				"name": "value",
				"example": "John",
				"required": "Optional",
				"description": "Value to set a single key to. Usable only if profile is not passed.\n"
			}
		]
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = client;

	// generated by ./scripts/generate-stateful-client
	function client(token) {
	  var applied = {
	    auth: {
	      test: {}
	    },
	    bots: {
	      info: {}
	    },
	    channels: {
	      archive: {},
	      create: {},
	      history: {},
	      info: {},
	      invite: {},
	      join: {},
	      kick: {},
	      leave: {},
	      list: {},
	      mark: {},
	      rename: {},
	      replies: {},
	      setPurpose: {},
	      setTopic: {},
	      unarchive: {}
	    },
	    chat: {
	      delete: {},
	      meMessage: {},
	      postMessage: {},
	      update: {}
	    },
	    dnd: {
	      endDnd: {},
	      endSnooze: {},
	      info: {},
	      setSnooze: {},
	      teamInfo: {}
	    },
	    emoji: {
	      list: {}
	    },
	    files: {
	      comments: {
	        add: {},
	        delete: {},
	        edit: {}
	      },
	      delete: {},
	      info: {},
	      list: {},
	      revokePublicURL: {},
	      sharedPublicURL: {},
	      upload: {}
	    },
	    groups: {
	      archive: {},
	      close: {},
	      create: {},
	      createChild: {},
	      history: {},
	      info: {},
	      invite: {},
	      kick: {},
	      leave: {},
	      list: {},
	      mark: {},
	      open: {},
	      rename: {},
	      replies: {},
	      setPurpose: {},
	      setTopic: {},
	      unarchive: {}
	    },
	    im: {
	      close: {},
	      history: {},
	      list: {},
	      mark: {},
	      open: {},
	      replies: {}
	    },
	    mpim: {
	      close: {},
	      history: {},
	      list: {},
	      mark: {},
	      open: {},
	      replies: {}
	    },
	    pins: {
	      add: {},
	      list: {},
	      remove: {}
	    },
	    reactions: {
	      add: {},
	      get: {},
	      list: {},
	      remove: {}
	    },
	    reminders: {
	      add: {},
	      complete: {},
	      delete: {},
	      info: {},
	      list: {}
	    },
	    rtm: {
	      start: {}
	    },
	    search: {
	      all: {},
	      files: {},
	      messages: {}
	    },
	    stars: {
	      add: {},
	      list: {},
	      remove: {}
	    },
	    team: {
	      accessLogs: {},
	      billableInfo: {},
	      info: {},
	      integrationLogs: {},
	      profile: {
	        get: {}
	      }
	    },
	    usergroups: {
	      create: {},
	      disable: {},
	      enable: {},
	      list: {},
	      update: {},
	      users: {
	        list: {},
	        update: {}
	      }
	    },
	    users: {
	      deletePhoto: {},
	      getPresence: {},
	      identity: {},
	      info: {},
	      list: {},
	      profile: {
	        get: {},
	        set: {}
	      },
	      setActive: {},
	      setPhoto: {},
	      setPresence: {}
	    }
	  };

	  applied.auth.test = function (params, callback) {
	    params.token = token;
	    __webpack_require__(53).call({}, params, callback);
	  };
	  applied.bots.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(54).call({}, params, callback);
	  };
	  applied.channels.archive = function (params, callback) {
	    params.token = token;
	    __webpack_require__(55).call({}, params, callback);
	  };
	  applied.channels.create = function (params, callback) {
	    params.token = token;
	    __webpack_require__(56).call({}, params, callback);
	  };
	  applied.channels.history = function (params, callback) {
	    params.token = token;
	    __webpack_require__(57).call({}, params, callback);
	  };
	  applied.channels.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(58).call({}, params, callback);
	  };
	  applied.channels.invite = function (params, callback) {
	    params.token = token;
	    __webpack_require__(59).call({}, params, callback);
	  };
	  applied.channels.join = function (params, callback) {
	    params.token = token;
	    __webpack_require__(60).call({}, params, callback);
	  };
	  applied.channels.kick = function (params, callback) {
	    params.token = token;
	    __webpack_require__(61).call({}, params, callback);
	  };
	  applied.channels.leave = function (params, callback) {
	    params.token = token;
	    __webpack_require__(62).call({}, params, callback);
	  };
	  applied.channels.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(63).call({}, params, callback);
	  };
	  applied.channels.mark = function (params, callback) {
	    params.token = token;
	    __webpack_require__(64).call({}, params, callback);
	  };
	  applied.channels.rename = function (params, callback) {
	    params.token = token;
	    __webpack_require__(65).call({}, params, callback);
	  };
	  applied.channels.replies = function (params, callback) {
	    params.token = token;
	    __webpack_require__(66).call({}, params, callback);
	  };
	  applied.channels.setPurpose = function (params, callback) {
	    params.token = token;
	    __webpack_require__(67).call({}, params, callback);
	  };
	  applied.channels.setTopic = function (params, callback) {
	    params.token = token;
	    __webpack_require__(68).call({}, params, callback);
	  };
	  applied.channels.unarchive = function (params, callback) {
	    params.token = token;
	    __webpack_require__(69).call({}, params, callback);
	  };
	  applied.chat.delete = function (params, callback) {
	    params.token = token;
	    __webpack_require__(70).call({}, params, callback);
	  };
	  applied.chat.meMessage = function (params, callback) {
	    params.token = token;
	    __webpack_require__(71).call({}, params, callback);
	  };
	  applied.chat.postMessage = function (params, callback) {
	    params.token = token;
	    __webpack_require__(72).call({}, params, callback);
	  };
	  applied.chat.update = function (params, callback) {
	    params.token = token;
	    __webpack_require__(73).call({}, params, callback);
	  };
	  applied.dnd.endDnd = function (params, callback) {
	    params.token = token;
	    __webpack_require__(74).call({}, params, callback);
	  };
	  applied.dnd.endSnooze = function (params, callback) {
	    params.token = token;
	    __webpack_require__(75).call({}, params, callback);
	  };
	  applied.dnd.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(76).call({}, params, callback);
	  };
	  applied.dnd.setSnooze = function (params, callback) {
	    params.token = token;
	    __webpack_require__(77).call({}, params, callback);
	  };
	  applied.dnd.teamInfo = function (params, callback) {
	    params.token = token;
	    __webpack_require__(78).call({}, params, callback);
	  };
	  applied.emoji.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(79).call({}, params, callback);
	  };
	  applied.files.comments.add = function (params, callback) {
	    params.token = token;
	    __webpack_require__(80).call({}, params, callback);
	  };
	  applied.files.comments.delete = function (params, callback) {
	    params.token = token;
	    __webpack_require__(81).call({}, params, callback);
	  };
	  applied.files.comments.edit = function (params, callback) {
	    params.token = token;
	    __webpack_require__(82).call({}, params, callback);
	  };
	  applied.files.delete = function (params, callback) {
	    params.token = token;
	    __webpack_require__(83).call({}, params, callback);
	  };
	  applied.files.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(84).call({}, params, callback);
	  };
	  applied.files.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(85).call({}, params, callback);
	  };
	  applied.files.revokePublicURL = function (params, callback) {
	    params.token = token;
	    __webpack_require__(86).call({}, params, callback);
	  };
	  applied.files.sharedPublicURL = function (params, callback) {
	    params.token = token;
	    __webpack_require__(87).call({}, params, callback);
	  };
	  applied.files.upload = function (params, callback) {
	    params.token = token;
	    __webpack_require__(88).call({}, params, callback);
	  };
	  applied.groups.archive = function (params, callback) {
	    params.token = token;
	    __webpack_require__(89).call({}, params, callback);
	  };
	  applied.groups.close = function (params, callback) {
	    params.token = token;
	    __webpack_require__(90).call({}, params, callback);
	  };
	  applied.groups.create = function (params, callback) {
	    params.token = token;
	    __webpack_require__(91).call({}, params, callback);
	  };
	  applied.groups.createChild = function (params, callback) {
	    params.token = token;
	    __webpack_require__(92).call({}, params, callback);
	  };
	  applied.groups.history = function (params, callback) {
	    params.token = token;
	    __webpack_require__(93).call({}, params, callback);
	  };
	  applied.groups.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(94).call({}, params, callback);
	  };
	  applied.groups.invite = function (params, callback) {
	    params.token = token;
	    __webpack_require__(95).call({}, params, callback);
	  };
	  applied.groups.kick = function (params, callback) {
	    params.token = token;
	    __webpack_require__(96).call({}, params, callback);
	  };
	  applied.groups.leave = function (params, callback) {
	    params.token = token;
	    __webpack_require__(97).call({}, params, callback);
	  };
	  applied.groups.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(98).call({}, params, callback);
	  };
	  applied.groups.mark = function (params, callback) {
	    params.token = token;
	    __webpack_require__(99).call({}, params, callback);
	  };
	  applied.groups.open = function (params, callback) {
	    params.token = token;
	    __webpack_require__(100).call({}, params, callback);
	  };
	  applied.groups.rename = function (params, callback) {
	    params.token = token;
	    __webpack_require__(101).call({}, params, callback);
	  };
	  applied.groups.replies = function (params, callback) {
	    params.token = token;
	    __webpack_require__(102).call({}, params, callback);
	  };
	  applied.groups.setPurpose = function (params, callback) {
	    params.token = token;
	    __webpack_require__(103).call({}, params, callback);
	  };
	  applied.groups.setTopic = function (params, callback) {
	    params.token = token;
	    __webpack_require__(104).call({}, params, callback);
	  };
	  applied.groups.unarchive = function (params, callback) {
	    params.token = token;
	    __webpack_require__(105).call({}, params, callback);
	  };
	  applied.im.close = function (params, callback) {
	    params.token = token;
	    __webpack_require__(106).call({}, params, callback);
	  };
	  applied.im.history = function (params, callback) {
	    params.token = token;
	    __webpack_require__(107).call({}, params, callback);
	  };
	  applied.im.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(108).call({}, params, callback);
	  };
	  applied.im.mark = function (params, callback) {
	    params.token = token;
	    __webpack_require__(109).call({}, params, callback);
	  };
	  applied.im.open = function (params, callback) {
	    params.token = token;
	    __webpack_require__(110).call({}, params, callback);
	  };
	  applied.im.replies = function (params, callback) {
	    params.token = token;
	    __webpack_require__(111).call({}, params, callback);
	  };
	  applied.mpim.close = function (params, callback) {
	    params.token = token;
	    __webpack_require__(112).call({}, params, callback);
	  };
	  applied.mpim.history = function (params, callback) {
	    params.token = token;
	    __webpack_require__(113).call({}, params, callback);
	  };
	  applied.mpim.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(114).call({}, params, callback);
	  };
	  applied.mpim.mark = function (params, callback) {
	    params.token = token;
	    __webpack_require__(115).call({}, params, callback);
	  };
	  applied.mpim.open = function (params, callback) {
	    params.token = token;
	    __webpack_require__(116).call({}, params, callback);
	  };
	  applied.mpim.replies = function (params, callback) {
	    params.token = token;
	    __webpack_require__(117).call({}, params, callback);
	  };
	  applied.pins.add = function (params, callback) {
	    params.token = token;
	    __webpack_require__(118).call({}, params, callback);
	  };
	  applied.pins.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(119).call({}, params, callback);
	  };
	  applied.pins.remove = function (params, callback) {
	    params.token = token;
	    __webpack_require__(120).call({}, params, callback);
	  };
	  applied.reactions.add = function (params, callback) {
	    params.token = token;
	    __webpack_require__(121).call({}, params, callback);
	  };
	  applied.reactions.get = function (params, callback) {
	    params.token = token;
	    __webpack_require__(122).call({}, params, callback);
	  };
	  applied.reactions.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(123).call({}, params, callback);
	  };
	  applied.reactions.remove = function (params, callback) {
	    params.token = token;
	    __webpack_require__(124).call({}, params, callback);
	  };
	  applied.reminders.add = function (params, callback) {
	    params.token = token;
	    __webpack_require__(125).call({}, params, callback);
	  };
	  applied.reminders.complete = function (params, callback) {
	    params.token = token;
	    __webpack_require__(126).call({}, params, callback);
	  };
	  applied.reminders.delete = function (params, callback) {
	    params.token = token;
	    __webpack_require__(127).call({}, params, callback);
	  };
	  applied.reminders.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(128).call({}, params, callback);
	  };
	  applied.reminders.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(129).call({}, params, callback);
	  };
	  applied.rtm.start = function (params, callback) {
	    params.token = token;
	    __webpack_require__(130).call({}, params, callback);
	  };
	  applied.search.all = function (params, callback) {
	    params.token = token;
	    __webpack_require__(131).call({}, params, callback);
	  };
	  applied.search.files = function (params, callback) {
	    params.token = token;
	    __webpack_require__(132).call({}, params, callback);
	  };
	  applied.search.messages = function (params, callback) {
	    params.token = token;
	    __webpack_require__(133).call({}, params, callback);
	  };
	  applied.stars.add = function (params, callback) {
	    params.token = token;
	    __webpack_require__(134).call({}, params, callback);
	  };
	  applied.stars.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(135).call({}, params, callback);
	  };
	  applied.stars.remove = function (params, callback) {
	    params.token = token;
	    __webpack_require__(136).call({}, params, callback);
	  };
	  applied.team.accessLogs = function (params, callback) {
	    params.token = token;
	    __webpack_require__(137).call({}, params, callback);
	  };
	  applied.team.billableInfo = function (params, callback) {
	    params.token = token;
	    __webpack_require__(138).call({}, params, callback);
	  };
	  applied.team.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(139).call({}, params, callback);
	  };
	  applied.team.integrationLogs = function (params, callback) {
	    params.token = token;
	    __webpack_require__(140).call({}, params, callback);
	  };
	  applied.team.profile.get = function (params, callback) {
	    params.token = token;
	    __webpack_require__(141).call({}, params, callback);
	  };
	  applied.usergroups.create = function (params, callback) {
	    params.token = token;
	    __webpack_require__(142).call({}, params, callback);
	  };
	  applied.usergroups.disable = function (params, callback) {
	    params.token = token;
	    __webpack_require__(143).call({}, params, callback);
	  };
	  applied.usergroups.enable = function (params, callback) {
	    params.token = token;
	    __webpack_require__(144).call({}, params, callback);
	  };
	  applied.usergroups.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(145).call({}, params, callback);
	  };
	  applied.usergroups.update = function (params, callback) {
	    params.token = token;
	    __webpack_require__(146).call({}, params, callback);
	  };
	  applied.usergroups.users.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(147).call({}, params, callback);
	  };
	  applied.usergroups.users.update = function (params, callback) {
	    params.token = token;
	    __webpack_require__(148).call({}, params, callback);
	  };
	  applied.users.deletePhoto = function (params, callback) {
	    params.token = token;
	    __webpack_require__(149).call({}, params, callback);
	  };
	  applied.users.getPresence = function (params, callback) {
	    params.token = token;
	    __webpack_require__(150).call({}, params, callback);
	  };
	  applied.users.identity = function (params, callback) {
	    params.token = token;
	    __webpack_require__(151).call({}, params, callback);
	  };
	  applied.users.info = function (params, callback) {
	    params.token = token;
	    __webpack_require__(152).call({}, params, callback);
	  };
	  applied.users.list = function (params, callback) {
	    params.token = token;
	    __webpack_require__(153).call({}, params, callback);
	  };
	  applied.users.profile.get = function (params, callback) {
	    params.token = token;
	    __webpack_require__(154).call({}, params, callback);
	  };
	  applied.users.profile.set = function (params, callback) {
	    params.token = token;
	    __webpack_require__(155).call({}, params, callback);
	  };
	  applied.users.setActive = function (params, callback) {
	    params.token = token;
	    __webpack_require__(156).call({}, params, callback);
	  };
	  applied.users.setPhoto = function (params, callback) {
	    params.token = token;
	    __webpack_require__(157).call({}, params, callback);
	  };
	  applied.users.setPresence = function (params, callback) {
	    params.token = token;
	    __webpack_require__(158).call({}, params, callback);
	  };

	  return applied;
	}
	module.exports = exports['default'];

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = authtest;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function authtest(params, callback) {
	  var ns = 'auth.test';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = botsinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function botsinfo(params, callback) {
	  var ns = 'bots.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsarchive;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsarchive(params, callback) {
	  var ns = 'channels.archive';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelscreate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelscreate(params, callback) {
	  var ns = 'channels.create';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelshistory;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelshistory(params, callback) {
	  var ns = 'channels.history';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsinfo(params, callback) {
	  var ns = 'channels.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsinvite;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsinvite(params, callback) {
	  var ns = 'channels.invite';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsjoin;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsjoin(params, callback) {
	  var ns = 'channels.join';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelskick;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelskick(params, callback) {
	  var ns = 'channels.kick';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsleave;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsleave(params, callback) {
	  var ns = 'channels.leave';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelslist(params, callback) {
	  var ns = 'channels.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsmark;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsmark(params, callback) {
	  var ns = 'channels.mark';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsrename;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsrename(params, callback) {
	  var ns = 'channels.rename';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsreplies;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsreplies(params, callback) {
	  var ns = 'channels.replies';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelssetPurpose;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelssetPurpose(params, callback) {
	  var ns = 'channels.setPurpose';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelssetTopic;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelssetTopic(params, callback) {
	  var ns = 'channels.setTopic';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = channelsunarchive;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function channelsunarchive(params, callback) {
	  var ns = 'channels.unarchive';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chatdelete;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function chatdelete(params, callback) {
	  var ns = 'chat.delete';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chatmeMessage;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function chatmeMessage(params, callback) {
	  var ns = 'chat.meMessage';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chatpostMessage;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function chatpostMessage(params, callback) {
	  var ns = 'chat.postMessage';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chatupdate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function chatupdate(params, callback) {
	  var ns = 'chat.update';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dndendDnd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function dndendDnd(params, callback) {
	  var ns = 'dnd.endDnd';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dndendSnooze;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function dndendSnooze(params, callback) {
	  var ns = 'dnd.endSnooze';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dndinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function dndinfo(params, callback) {
	  var ns = 'dnd.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dndsetSnooze;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function dndsetSnooze(params, callback) {
	  var ns = 'dnd.setSnooze';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dndteamInfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function dndteamInfo(params, callback) {
	  var ns = 'dnd.teamInfo';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = emojilist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function emojilist(params, callback) {
	  var ns = 'emoji.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filescommentsadd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filescommentsadd(params, callback) {
	  var ns = 'files.comments.add';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filescommentsdelete;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filescommentsdelete(params, callback) {
	  var ns = 'files.comments.delete';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filescommentsedit;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filescommentsedit(params, callback) {
	  var ns = 'files.comments.edit';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filesdelete;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filesdelete(params, callback) {
	  var ns = 'files.delete';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filesinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filesinfo(params, callback) {
	  var ns = 'files.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = fileslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function fileslist(params, callback) {
	  var ns = 'files.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filesrevokePublicURL;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filesrevokePublicURL(params, callback) {
	  var ns = 'files.revokePublicURL';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filessharedPublicURL;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filessharedPublicURL(params, callback) {
	  var ns = 'files.sharedPublicURL';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filesupload;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function filesupload(params, callback) {
	  var ns = 'files.upload';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsarchive;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsarchive(params, callback) {
	  var ns = 'groups.archive';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsclose;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsclose(params, callback) {
	  var ns = 'groups.close';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupscreate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupscreate(params, callback) {
	  var ns = 'groups.create';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupscreateChild;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupscreateChild(params, callback) {
	  var ns = 'groups.createChild';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupshistory;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupshistory(params, callback) {
	  var ns = 'groups.history';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsinfo(params, callback) {
	  var ns = 'groups.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsinvite;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsinvite(params, callback) {
	  var ns = 'groups.invite';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupskick;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupskick(params, callback) {
	  var ns = 'groups.kick';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsleave;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsleave(params, callback) {
	  var ns = 'groups.leave';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupslist(params, callback) {
	  var ns = 'groups.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsmark;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsmark(params, callback) {
	  var ns = 'groups.mark';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsopen;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsopen(params, callback) {
	  var ns = 'groups.open';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsrename;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsrename(params, callback) {
	  var ns = 'groups.rename';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsreplies;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsreplies(params, callback) {
	  var ns = 'groups.replies';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupssetPurpose;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupssetPurpose(params, callback) {
	  var ns = 'groups.setPurpose';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupssetTopic;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupssetTopic(params, callback) {
	  var ns = 'groups.setTopic';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = groupsunarchive;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function groupsunarchive(params, callback) {
	  var ns = 'groups.unarchive';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imclose;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function imclose(params, callback) {
	  var ns = 'im.close';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imhistory;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function imhistory(params, callback) {
	  var ns = 'im.history';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imlist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function imlist(params, callback) {
	  var ns = 'im.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = immark;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function immark(params, callback) {
	  var ns = 'im.mark';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imopen;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function imopen(params, callback) {
	  var ns = 'im.open';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imreplies;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function imreplies(params, callback) {
	  var ns = 'im.replies';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimclose;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimclose(params, callback) {
	  var ns = 'mpim.close';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimhistory;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimhistory(params, callback) {
	  var ns = 'mpim.history';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimlist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimlist(params, callback) {
	  var ns = 'mpim.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimmark;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimmark(params, callback) {
	  var ns = 'mpim.mark';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimopen;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimopen(params, callback) {
	  var ns = 'mpim.open';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mpimreplies;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function mpimreplies(params, callback) {
	  var ns = 'mpim.replies';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = pinsadd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function pinsadd(params, callback) {
	  var ns = 'pins.add';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = pinslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function pinslist(params, callback) {
	  var ns = 'pins.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = pinsremove;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function pinsremove(params, callback) {
	  var ns = 'pins.remove';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reactionsadd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reactionsadd(params, callback) {
	  var ns = 'reactions.add';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reactionsget;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reactionsget(params, callback) {
	  var ns = 'reactions.get';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reactionslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reactionslist(params, callback) {
	  var ns = 'reactions.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reactionsremove;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reactionsremove(params, callback) {
	  var ns = 'reactions.remove';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = remindersadd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function remindersadd(params, callback) {
	  var ns = 'reminders.add';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reminderscomplete;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reminderscomplete(params, callback) {
	  var ns = 'reminders.complete';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = remindersdelete;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function remindersdelete(params, callback) {
	  var ns = 'reminders.delete';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = remindersinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function remindersinfo(params, callback) {
	  var ns = 'reminders.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reminderslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function reminderslist(params, callback) {
	  var ns = 'reminders.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = rtmstart;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function rtmstart(params, callback) {
	  var ns = 'rtm.start';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = searchall;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function searchall(params, callback) {
	  var ns = 'search.all';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = searchfiles;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function searchfiles(params, callback) {
	  var ns = 'search.files';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = searchmessages;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function searchmessages(params, callback) {
	  var ns = 'search.messages';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = starsadd;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function starsadd(params, callback) {
	  var ns = 'stars.add';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = starslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function starslist(params, callback) {
	  var ns = 'stars.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = starsremove;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function starsremove(params, callback) {
	  var ns = 'stars.remove';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = teamaccessLogs;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function teamaccessLogs(params, callback) {
	  var ns = 'team.accessLogs';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = teambillableInfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function teambillableInfo(params, callback) {
	  var ns = 'team.billableInfo';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = teaminfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function teaminfo(params, callback) {
	  var ns = 'team.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = teamintegrationLogs;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function teamintegrationLogs(params, callback) {
	  var ns = 'team.integrationLogs';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = teamprofileget;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function teamprofileget(params, callback) {
	  var ns = 'team.profile.get';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupscreate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupscreate(params, callback) {
	  var ns = 'usergroups.create';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupsdisable;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupsdisable(params, callback) {
	  var ns = 'usergroups.disable';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupsenable;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupsenable(params, callback) {
	  var ns = 'usergroups.enable';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupslist(params, callback) {
	  var ns = 'usergroups.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupsupdate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupsupdate(params, callback) {
	  var ns = 'usergroups.update';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupsuserslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupsuserslist(params, callback) {
	  var ns = 'usergroups.users.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usergroupsusersupdate;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usergroupsusersupdate(params, callback) {
	  var ns = 'usergroups.users.update';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersdeletePhoto;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersdeletePhoto(params, callback) {
	  var ns = 'users.deletePhoto';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersgetPresence;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersgetPresence(params, callback) {
	  var ns = 'users.getPresence';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersidentity;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersidentity(params, callback) {
	  var ns = 'users.identity';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersinfo;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersinfo(params, callback) {
	  var ns = 'users.info';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = userslist;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function userslist(params, callback) {
	  var ns = 'users.list';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersprofileget;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersprofileget(params, callback) {
	  var ns = 'users.profile.get';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = usersprofileset;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function usersprofileset(params, callback) {
	  var ns = 'users.profile.set';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = userssetActive;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function userssetActive(params, callback) {
	  var ns = 'users.setActive';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = userssetPhoto;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function userssetPhoto(params, callback) {
	  var ns = 'users.setPhoto';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = userssetPresence;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function userssetPresence(params, callback) {
	  var ns = 'users.setPresence';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bots = __webpack_require__(54);

	var _bots2 = _interopRequireDefault(_bots);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  info: _bots2.default
	};
	module.exports = exports['default'];

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _channels = __webpack_require__(55);

	var _channels2 = _interopRequireDefault(_channels);

	var _channels3 = __webpack_require__(56);

	var _channels4 = _interopRequireDefault(_channels3);

	var _channels5 = __webpack_require__(57);

	var _channels6 = _interopRequireDefault(_channels5);

	var _channels7 = __webpack_require__(58);

	var _channels8 = _interopRequireDefault(_channels7);

	var _channels9 = __webpack_require__(59);

	var _channels10 = _interopRequireDefault(_channels9);

	var _channels11 = __webpack_require__(60);

	var _channels12 = _interopRequireDefault(_channels11);

	var _channels13 = __webpack_require__(61);

	var _channels14 = _interopRequireDefault(_channels13);

	var _channels15 = __webpack_require__(62);

	var _channels16 = _interopRequireDefault(_channels15);

	var _channels17 = __webpack_require__(63);

	var _channels18 = _interopRequireDefault(_channels17);

	var _channels19 = __webpack_require__(64);

	var _channels20 = _interopRequireDefault(_channels19);

	var _channels21 = __webpack_require__(65);

	var _channels22 = _interopRequireDefault(_channels21);

	var _channels23 = __webpack_require__(66);

	var _channels24 = _interopRequireDefault(_channels23);

	var _channels25 = __webpack_require__(67);

	var _channels26 = _interopRequireDefault(_channels25);

	var _channels27 = __webpack_require__(68);

	var _channels28 = _interopRequireDefault(_channels27);

	var _channels29 = __webpack_require__(69);

	var _channels30 = _interopRequireDefault(_channels29);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  archive: _channels2.default,
	  create: _channels4.default,
	  history: _channels6.default,
	  info: _channels8.default,
	  invite: _channels10.default,
	  join: _channels12.default,
	  kick: _channels14.default,
	  leave: _channels16.default,
	  list: _channels18.default,
	  mark: _channels20.default,
	  rename: _channels22.default,
	  replies: _channels24.default,
	  setPurpose: _channels26.default,
	  setTopic: _channels28.default,
	  unarchive: _channels30.default
	};
	module.exports = exports['default'];

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _chat = __webpack_require__(70);

	var _chat2 = _interopRequireDefault(_chat);

	var _chat3 = __webpack_require__(72);

	var _chat4 = _interopRequireDefault(_chat3);

	var _chat5 = __webpack_require__(73);

	var _chat6 = _interopRequireDefault(_chat5);

	var _chat7 = __webpack_require__(71);

	var _chat8 = _interopRequireDefault(_chat7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  postMessage: _chat4.default, delete: _chat2.default, update: _chat6.default, meMessage: _chat8.default
	};
	module.exports = exports['default'];

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dnd = __webpack_require__(76);

	var _dnd2 = _interopRequireDefault(_dnd);

	var _dnd3 = __webpack_require__(74);

	var _dnd4 = _interopRequireDefault(_dnd3);

	var _dnd5 = __webpack_require__(75);

	var _dnd6 = _interopRequireDefault(_dnd5);

	var _dnd7 = __webpack_require__(77);

	var _dnd8 = _interopRequireDefault(_dnd7);

	var _dnd9 = __webpack_require__(78);

	var _dnd10 = _interopRequireDefault(_dnd9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  info: _dnd2.default, endDnd: _dnd4.default, endSnooze: _dnd6.default, setSnooze: _dnd8.default, teamInfo: _dnd10.default
	};
	module.exports = exports['default'];

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _files = __webpack_require__(83);

	var _files2 = _interopRequireDefault(_files);

	var _files3 = __webpack_require__(84);

	var _files4 = _interopRequireDefault(_files3);

	var _files5 = __webpack_require__(85);

	var _files6 = _interopRequireDefault(_files5);

	var _files7 = __webpack_require__(88);

	var _files8 = _interopRequireDefault(_files7);

	var _filesComments = __webpack_require__(80);

	var _filesComments2 = _interopRequireDefault(_filesComments);

	var _filesComments3 = __webpack_require__(81);

	var _filesComments4 = _interopRequireDefault(_filesComments3);

	var _filesComments5 = __webpack_require__(82);

	var _filesComments6 = _interopRequireDefault(_filesComments5);

	var _files9 = __webpack_require__(86);

	var _files10 = _interopRequireDefault(_files9);

	var _files11 = __webpack_require__(87);

	var _files12 = _interopRequireDefault(_files11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  delete: _files2.default,
	  info: _files4.default,
	  list: _files6.default,
	  upload: _files8.default,
	  comments: {
	    add: _filesComments2.default,
	    delete: _filesComments4.default,
	    edit: _filesComments6.default
	  },
	  revokePublicURL: _files10.default,
	  sharedPublicURL: _files12.default
	};
	module.exports = exports['default'];

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _groups = __webpack_require__(89);

	var _groups2 = _interopRequireDefault(_groups);

	var _groups3 = __webpack_require__(90);

	var _groups4 = _interopRequireDefault(_groups3);

	var _groups5 = __webpack_require__(91);

	var _groups6 = _interopRequireDefault(_groups5);

	var _groups7 = __webpack_require__(92);

	var _groups8 = _interopRequireDefault(_groups7);

	var _groups9 = __webpack_require__(93);

	var _groups10 = _interopRequireDefault(_groups9);

	var _groups11 = __webpack_require__(94);

	var _groups12 = _interopRequireDefault(_groups11);

	var _groups13 = __webpack_require__(95);

	var _groups14 = _interopRequireDefault(_groups13);

	var _groups15 = __webpack_require__(96);

	var _groups16 = _interopRequireDefault(_groups15);

	var _groups17 = __webpack_require__(97);

	var _groups18 = _interopRequireDefault(_groups17);

	var _groups19 = __webpack_require__(98);

	var _groups20 = _interopRequireDefault(_groups19);

	var _groups21 = __webpack_require__(99);

	var _groups22 = _interopRequireDefault(_groups21);

	var _groups23 = __webpack_require__(100);

	var _groups24 = _interopRequireDefault(_groups23);

	var _groups25 = __webpack_require__(101);

	var _groups26 = _interopRequireDefault(_groups25);

	var _groups27 = __webpack_require__(103);

	var _groups28 = _interopRequireDefault(_groups27);

	var _groups29 = __webpack_require__(104);

	var _groups30 = _interopRequireDefault(_groups29);

	var _groups31 = __webpack_require__(105);

	var _groups32 = _interopRequireDefault(_groups31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  archive: _groups2.default,
	  close: _groups4.default,
	  create: _groups6.default,
	  createChild: _groups8.default,
	  history: _groups10.default,
	  info: _groups12.default,
	  invite: _groups14.default,
	  kick: _groups16.default,
	  leave: _groups18.default,
	  list: _groups20.default,
	  mark: _groups22.default,
	  open: _groups24.default,
	  rename: _groups26.default,
	  setPurpose: _groups28.default,
	  setTopic: _groups30.default,
	  unarchive: _groups32.default
	};
	module.exports = exports['default'];

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _im = __webpack_require__(106);

	var _im2 = _interopRequireDefault(_im);

	var _im3 = __webpack_require__(107);

	var _im4 = _interopRequireDefault(_im3);

	var _im5 = __webpack_require__(108);

	var _im6 = _interopRequireDefault(_im5);

	var _im7 = __webpack_require__(109);

	var _im8 = _interopRequireDefault(_im7);

	var _im9 = __webpack_require__(110);

	var _im10 = _interopRequireDefault(_im9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  close: _im2.default, history: _im4.default, list: _im6.default, mark: _im8.default, open: _im10.default
	};
	module.exports = exports['default'];

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mpim = __webpack_require__(112);

	var _mpim2 = _interopRequireDefault(_mpim);

	var _mpim3 = __webpack_require__(113);

	var _mpim4 = _interopRequireDefault(_mpim3);

	var _mpim5 = __webpack_require__(114);

	var _mpim6 = _interopRequireDefault(_mpim5);

	var _mpim7 = __webpack_require__(115);

	var _mpim8 = _interopRequireDefault(_mpim7);

	var _mpim9 = __webpack_require__(116);

	var _mpim10 = _interopRequireDefault(_mpim9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  close: _mpim2.default,
	  history: _mpim4.default,
	  list: _mpim6.default,
	  mark: _mpim8.default,
	  open: _mpim10.default
	};
	module.exports = exports['default'];

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = oauthaccess;

	var _exec = __webpack_require__(3);

	var _exec2 = _interopRequireDefault(_exec);

	var _validate = __webpack_require__(50);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// this file was generated by ./scripts/generate-web-api
	function oauthaccess(params, callback) {
	  var ns = 'oauth.access';
	  var err = (0, _validate2.default)(ns, params);
	  if (err) {
	    callback(err);
	  } else {
	    (0, _exec2.default)(ns, params, callback);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reactions = __webpack_require__(121);

	var _reactions2 = _interopRequireDefault(_reactions);

	var _reactions3 = __webpack_require__(122);

	var _reactions4 = _interopRequireDefault(_reactions3);

	var _reactions5 = __webpack_require__(123);

	var _reactions6 = _interopRequireDefault(_reactions5);

	var _reactions7 = __webpack_require__(124);

	var _reactions8 = _interopRequireDefault(_reactions7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  add: _reactions2.default, get: _reactions4.default, list: _reactions6.default, remove: _reactions8.default
	};
	module.exports = exports['default'];

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _reminders = __webpack_require__(125);

	var _reminders2 = _interopRequireDefault(_reminders);

	var _reminders3 = __webpack_require__(126);

	var _reminders4 = _interopRequireDefault(_reminders3);

	var _reminders5 = __webpack_require__(127);

	var _reminders6 = _interopRequireDefault(_reminders5);

	var _reminders7 = __webpack_require__(128);

	var _reminders8 = _interopRequireDefault(_reminders7);

	var _reminders9 = __webpack_require__(129);

	var _reminders10 = _interopRequireDefault(_reminders9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  add: _reminders2.default, complete: _reminders4.default, delete: _reminders6.default, info: _reminders8.default, list: _reminders10.default
	};
	module.exports = exports['default'];

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _pins = __webpack_require__(118);

	var _pins2 = _interopRequireDefault(_pins);

	var _pins3 = __webpack_require__(119);

	var _pins4 = _interopRequireDefault(_pins3);

	var _pins5 = __webpack_require__(120);

	var _pins6 = _interopRequireDefault(_pins5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  add: _pins2.default, list: _pins4.default, remove: _pins6.default
	};
	module.exports = exports['default'];

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = client;

	var _rtm = __webpack_require__(130);

	var _rtm2 = _interopRequireDefault(_rtm);

	var _rtm3 = __webpack_require__(172);

	var _rtm4 = _interopRequireDefault(_rtm3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// socket factory
	function client() {

	  // build a new bot every time
	  var bot = {
	    handlers: {
	      started: []
	    }
	  };

	  // add undocumented ping event
	  _rtm4.default.push('pong');

	  // generate event handler registration methods
	  _rtm4.default.forEach(function (e) {
	    bot.handlers[e] = [];
	    bot[e] = function (handler) {
	      bot.handlers[e].push(handler);
	    };
	  });

	  bot.started = function (handler) {
	    bot.handlers['started'].push(handler);
	  };

	  // kicks up a web socket connection
	  bot.listen = function botListen(params, callback) {
	    (0, _rtm2.default)(params, function (err, data) {
	      if (err) {
	        if (callback) callback(err);else throw err;
	      } else {
	        // grab a handle on the socket
	        bot.ws = new WebSocket(data.url);
	        // delegate everything
	        bot.ws.onmessage = function message(e) {
	          var json = JSON.parse(e.data);
	          // Call all registered handlers for this event, if any
	          if (bot.handlers[json.type]) bot.handlers[json.type].forEach(function (m) {
	            return m.call({}, json);
	          });
	        };
	        // call started callbacks
	        bot.handlers['started'].forEach(function (m) {
	          return m.call({}, data);
	        });
	        if (callback) callback(null, data);
	      }
	    });
	  };

	  // closes the socket
	  bot.close = function botClose() {
	    bot.ws.close();
	  };

	  //////////
	  return bot;
	}
	module.exports = exports['default'];

/***/ },
/* 172 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// generated using ./scripts/generate-all
	var events = ['accounts_changed', 'bot_added', 'bot_changed', 'channel_archive', 'channel_created', 'channel_deleted', 'channel_history_changed', 'channel_joined', 'channel_left', 'channel_marked', 'channel_rename', 'channel_unarchive', 'commands_changed', 'dnd_updated', 'dnd_updated_user', 'email_domain_changed', 'emoji_changed', 'file_change', 'file_comment_added', 'file_comment_deleted', 'file_comment_edited', 'file_created', 'file_deleted', 'file_public', 'file_shared', 'file_unshared', 'goodbye', 'group_archive', 'group_close', 'group_history_changed', 'group_joined', 'group_left', 'group_marked', 'group_open', 'group_rename', 'group_unarchive', 'hello', 'im_close', 'im_created', 'im_history_changed', 'im_marked', 'im_open', 'manual_presence_change', 'message', 'message.channels', 'message.groups', 'message.im', 'message.mpim', 'pin_added', 'pin_removed', 'pong', 'pref_change', 'presence_change', 'reaction_added', 'reaction_removed', 'reconnect_url', 'star_added', 'star_removed', 'subteam_created', 'subteam_self_added', 'subteam_self_removed', 'subteam_updated', 'team_domain_change', 'team_join', 'team_migration_started', 'team_plan_change', 'team_pref_change', 'team_profile_change', 'team_profile_delete', 'team_profile_reorder', 'team_rename', 'url_verification', 'user_change', 'user_typing'];

	exports.default = events;
	module.exports = exports['default'];

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _search = __webpack_require__(131);

	var _search2 = _interopRequireDefault(_search);

	var _search3 = __webpack_require__(132);

	var _search4 = _interopRequireDefault(_search3);

	var _search5 = __webpack_require__(133);

	var _search6 = _interopRequireDefault(_search5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  all: _search2.default, files: _search4.default, messages: _search6.default
	};
	module.exports = exports['default'];

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stars = __webpack_require__(134);

	var _stars2 = _interopRequireDefault(_stars);

	var _stars3 = __webpack_require__(135);

	var _stars4 = _interopRequireDefault(_stars3);

	var _stars5 = __webpack_require__(136);

	var _stars6 = _interopRequireDefault(_stars5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  add: _stars2.default, list: _stars4.default, remove: _stars6.default
	};
	module.exports = exports['default'];

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _team = __webpack_require__(137);

	var _team2 = _interopRequireDefault(_team);

	var _team3 = __webpack_require__(138);

	var _team4 = _interopRequireDefault(_team3);

	var _team5 = __webpack_require__(139);

	var _team6 = _interopRequireDefault(_team5);

	var _team7 = __webpack_require__(140);

	var _team8 = _interopRequireDefault(_team7);

	var _teamProfile = __webpack_require__(141);

	var _teamProfile2 = _interopRequireDefault(_teamProfile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  accessLogs: _team2.default,
	  billableInfo: _team4.default,
	  info: _team6.default,
	  integrationLogs: _team8.default,
	  profile: {
	    get: _teamProfile2.default
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _usergroups = __webpack_require__(142);

	var _usergroups2 = _interopRequireDefault(_usergroups);

	var _usergroups3 = __webpack_require__(143);

	var _usergroups4 = _interopRequireDefault(_usergroups3);

	var _usergroups5 = __webpack_require__(144);

	var _usergroups6 = _interopRequireDefault(_usergroups5);

	var _usergroups7 = __webpack_require__(145);

	var _usergroups8 = _interopRequireDefault(_usergroups7);

	var _usergroups9 = __webpack_require__(146);

	var _usergroups10 = _interopRequireDefault(_usergroups9);

	var _usergroupsUsers = __webpack_require__(147);

	var _usergroupsUsers2 = _interopRequireDefault(_usergroupsUsers);

	var _usergroupsUsers3 = __webpack_require__(148);

	var _usergroupsUsers4 = _interopRequireDefault(_usergroupsUsers3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  create: _usergroups2.default,
	  disable: _usergroups4.default,
	  enable: _usergroups6.default,
	  list: _usergroups8.default,
	  update: _usergroups10.default,
	  users: {
	    list: _usergroupsUsers2.default,
	    update: _usergroupsUsers4.default
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _users = __webpack_require__(150);

	var _users2 = _interopRequireDefault(_users);

	var _usersProfile = __webpack_require__(154);

	var _usersProfile2 = _interopRequireDefault(_usersProfile);

	var _users3 = __webpack_require__(151);

	var _users4 = _interopRequireDefault(_users3);

	var _users5 = __webpack_require__(152);

	var _users6 = _interopRequireDefault(_users5);

	var _users7 = __webpack_require__(153);

	var _users8 = _interopRequireDefault(_users7);

	var _users9 = __webpack_require__(156);

	var _users10 = _interopRequireDefault(_users9);

	var _users11 = __webpack_require__(158);

	var _users12 = _interopRequireDefault(_users11);

	var _usersProfile3 = __webpack_require__(155);

	var _usersProfile4 = _interopRequireDefault(_usersProfile3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  getPresence: _users2.default,
	  identity: _users4.default,
	  info: _users6.default,
	  list: _users8.default,
	  profile: {
	    get: _usersProfile2.default,
	    set: _usersProfile4.default
	  },
	  setActive: _users10.default,
	  setPresence: _users12.default
	};
	module.exports = exports['default'];

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	// version: 0.5.1
	// date: Tue Mar 07 2017 16:18:13 GMT+0000 (WET)
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


	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define("Syncher", [], factory);
		else if(typeof exports === 'object')
			exports["Syncher"] = factory();
		else
			root[""] = root[""] || {}, root[""]["Syncher"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
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
	/******/ 	// identity function for calling harmony imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };
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
	/******/ 	return __webpack_require__(__webpack_require__.s = 166);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

	/***/ }),
	/* 1 */
	/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(11)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

	/***/ }),
	/* 3 */
	/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(30)('wks')
	  , uid        = __webpack_require__(23)
	  , Symbol     = __webpack_require__(1).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(5)
	  , IE8_DOM_DEFINE = __webpack_require__(25)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

	/***/ }),
	/* 6 */
	/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(4)
	  , createDesc = __webpack_require__(15);
	module.exports = __webpack_require__(2) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	/***/ }),
	/* 9 */
	/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(1)
	  , core      = __webpack_require__(0)
	  , ctx       = __webpack_require__(14)
	  , hide      = __webpack_require__(7)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	var _defineProperty = __webpack_require__(33);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	/***/ }),
	/* 11 */
	/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

	/***/ }),
	/* 12 */
	/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

	/***/ }),
	/* 13 */
	/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(56)
	  , defined = __webpack_require__(24);
	module.exports = function(it){
	  return IObject(defined(it));
	};

	/***/ }),
	/* 14 */
	/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(19);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

	/***/ }),
	/* 15 */
	/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

	/***/ }),
	/* 16 */
	/***/ (function(module, exports) {

	module.exports = {};

	/***/ }),
	/* 17 */
	/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6)
	  , document = __webpack_require__(1).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

	/***/ }),
	/* 18 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(44)
	  , enumBugKeys = __webpack_require__(29);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

	/***/ }),
	/* 19 */
	/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

	/***/ }),
	/* 20 */
	/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

	/***/ }),
	/* 21 */
	/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(6);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	/***/ }),
	/* 22 */
	/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(4).f
	  , has = __webpack_require__(12)
	  , TAG = __webpack_require__(3)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

	/***/ }),
	/* 23 */
	/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	/***/ }),
	/* 24 */
	/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

	/***/ }),
	/* 25 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(2) && !__webpack_require__(11)(function(){
	  return Object.defineProperty(__webpack_require__(17)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

	/***/ }),
	/* 26 */
	/***/ (function(module, exports) {

	module.exports = true;

	/***/ }),
	/* 27 */
	/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(30)('keys')
	  , uid    = __webpack_require__(23);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

	/***/ }),
	/* 28 */
	/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	/***/ }),
	/* 29 */
	/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	/***/ }),
	/* 30 */
	/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(1)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

	/***/ }),
	/* 31 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(79), __esModule: true };

	/***/ }),
	/* 32 */
	/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(24);
	module.exports = function(it){
	  return Object(defined(it));
	};

	/***/ }),
	/* 33 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(36), __esModule: true };

	/***/ }),
	/* 34 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(75);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(74);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(59);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

	/***/ }),
	/* 35 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	var _typeof2 = __webpack_require__(59);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

	/***/ }),
	/* 36 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(38);
	var $Object = __webpack_require__(0).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

	/***/ }),
	/* 37 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(5)
	  , dPs         = __webpack_require__(64)
	  , enumBugKeys = __webpack_require__(29)
	  , IE_PROTO    = __webpack_require__(27)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(17)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(42).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


	/***/ }),
	/* 38 */
	/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(2), 'Object', {defineProperty: __webpack_require__(4).f});

	/***/ }),
	/* 39 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var LIBRARY        = __webpack_require__(26)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(46)
	  , hide           = __webpack_require__(7)
	  , has            = __webpack_require__(12)
	  , Iterators      = __webpack_require__(16)
	  , $iterCreate    = __webpack_require__(62)
	  , setToStringTag = __webpack_require__(22)
	  , getPrototypeOf = __webpack_require__(43)
	  , ITERATOR       = __webpack_require__(3)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	/***/ }),
	/* 40 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(53), __esModule: true };

	/***/ }),
	/* 41 */
	/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

	/***/ }),
	/* 42 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1).document && document.documentElement;

	/***/ }),
	/* 43 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(12)
	  , toObject    = __webpack_require__(32)
	  , IE_PROTO    = __webpack_require__(27)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	/***/ }),
	/* 44 */
	/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(12)
	  , toIObject    = __webpack_require__(13)
	  , arrayIndexOf = __webpack_require__(61)(false)
	  , IE_PROTO     = __webpack_require__(27)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	/***/ }),
	/* 45 */
	/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(9)
	  , core    = __webpack_require__(0)
	  , fails   = __webpack_require__(11);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

	/***/ }),
	/* 46 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7);

	/***/ }),
	/* 47 */
	/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(28)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	/***/ }),
	/* 48 */
	/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(1)
	  , core           = __webpack_require__(0)
	  , LIBRARY        = __webpack_require__(26)
	  , wksExt         = __webpack_require__(49)
	  , defineProperty = __webpack_require__(4).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

	/***/ }),
	/* 49 */
	/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(3);

	/***/ }),
	/* 50 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var $at  = __webpack_require__(66)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(39)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

	/***/ }),
	/* 51 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(69);
	var global        = __webpack_require__(1)
	  , hide          = __webpack_require__(7)
	  , Iterators     = __webpack_require__(16)
	  , TO_STRING_TAG = __webpack_require__(3)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

	/***/ }),
	/* 52 */,
	/* 53 */
	/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(0)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

	/***/ }),
	/* 54 */
	/***/ (function(module, exports) {



	/***/ }),
	/* 55 */
	/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(20)
	  , TAG = __webpack_require__(3)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	/***/ }),
	/* 56 */
	/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(20);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

	/***/ }),
	/* 57 */
	/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(41)
	  , createDesc     = __webpack_require__(15)
	  , toIObject      = __webpack_require__(13)
	  , toPrimitive    = __webpack_require__(21)
	  , has            = __webpack_require__(12)
	  , IE8_DOM_DEFINE = __webpack_require__(25)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(2) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

	/***/ }),
	/* 58 */
	/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

	/***/ }),
	/* 59 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	var _iterator = __webpack_require__(77);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(76);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

	/***/ }),
	/* 60 */
	/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

	/***/ }),
	/* 61 */
	/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(13)
	  , toLength  = __webpack_require__(47)
	  , toIndex   = __webpack_require__(68);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	/***/ }),
	/* 62 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var create         = __webpack_require__(37)
	  , descriptor     = __webpack_require__(15)
	  , setToStringTag = __webpack_require__(22)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(7)(IteratorPrototype, __webpack_require__(3)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

	/***/ }),
	/* 63 */
	/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

	/***/ }),
	/* 64 */
	/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(4)
	  , anObject = __webpack_require__(5)
	  , getKeys  = __webpack_require__(18);

	module.exports = __webpack_require__(2) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	/***/ }),
	/* 65 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(44)
	  , hiddenKeys = __webpack_require__(29).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

	/***/ }),
	/* 66 */
	/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28)
	  , defined   = __webpack_require__(24);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	/***/ }),
	/* 67 */
	/***/ (function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(14)
	  , invoke             = __webpack_require__(88)
	  , html               = __webpack_require__(42)
	  , cel                = __webpack_require__(17)
	  , global             = __webpack_require__(1)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(20)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

	/***/ }),
	/* 68 */
	/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

	/***/ }),
	/* 69 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var addToUnscopables = __webpack_require__(60)
	  , step             = __webpack_require__(63)
	  , Iterators        = __webpack_require__(16)
	  , toIObject        = __webpack_require__(13);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(39)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	/***/ }),
	/* 70 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(80), __esModule: true };

	/***/ }),
	/* 71 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

	/***/ }),
	/* 72 */
	/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(23)('meta')
	  , isObject = __webpack_require__(6)
	  , has      = __webpack_require__(12)
	  , setDesc  = __webpack_require__(4).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(11)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

	/***/ }),
	/* 73 */
	/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(55)
	  , ITERATOR  = __webpack_require__(3)('iterator')
	  , Iterators = __webpack_require__(16);
	module.exports = __webpack_require__(0).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

	/***/ }),
	/* 74 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(78), __esModule: true };

	/***/ }),
	/* 75 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(81), __esModule: true };

	/***/ }),
	/* 76 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

	/***/ }),
	/* 77 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

	/***/ }),
	/* 78 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(100);
	var $Object = __webpack_require__(0).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

	/***/ }),
	/* 79 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	module.exports = __webpack_require__(0).Object.getPrototypeOf;

	/***/ }),
	/* 80 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(102);
	module.exports = __webpack_require__(0).Object.keys;

	/***/ }),
	/* 81 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(103);
	module.exports = __webpack_require__(0).Object.setPrototypeOf;

	/***/ }),
	/* 82 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(54);
	__webpack_require__(50);
	__webpack_require__(51);
	__webpack_require__(104);
	module.exports = __webpack_require__(0).Promise;

	/***/ }),
	/* 83 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(105);
	__webpack_require__(54);
	__webpack_require__(106);
	__webpack_require__(107);
	module.exports = __webpack_require__(0).Symbol;

	/***/ }),
	/* 84 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(50);
	__webpack_require__(51);
	module.exports = __webpack_require__(49).f('iterator');

	/***/ }),
	/* 85 */
	/***/ (function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	/***/ }),
	/* 86 */
	/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(18)
	  , gOPS    = __webpack_require__(58)
	  , pIE     = __webpack_require__(41);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

	/***/ }),
	/* 87 */
	/***/ (function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(14)
	  , call        = __webpack_require__(91)
	  , isArrayIter = __webpack_require__(89)
	  , anObject    = __webpack_require__(5)
	  , toLength    = __webpack_require__(47)
	  , getIterFn   = __webpack_require__(73)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

	/***/ }),
	/* 88 */
	/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

	/***/ }),
	/* 89 */
	/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(16)
	  , ITERATOR   = __webpack_require__(3)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

	/***/ }),
	/* 90 */
	/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(20);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

	/***/ }),
	/* 91 */
	/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(5);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

	/***/ }),
	/* 92 */
	/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(3)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

	/***/ }),
	/* 93 */
	/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(18)
	  , toIObject = __webpack_require__(13);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

	/***/ }),
	/* 94 */
	/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(1)
	  , macrotask = __webpack_require__(67).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(20)(process) == 'process';

	module.exports = function(){
	  var head, last, notify;

	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };

	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }

	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

	/***/ }),
	/* 95 */
	/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(13)
	  , gOPN      = __webpack_require__(65).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


	/***/ }),
	/* 96 */
	/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(7);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

	/***/ }),
	/* 97 */
	/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(6)
	  , anObject = __webpack_require__(5);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(14)(Function.call, __webpack_require__(57).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	/***/ }),
	/* 98 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var global      = __webpack_require__(1)
	  , core        = __webpack_require__(0)
	  , dP          = __webpack_require__(4)
	  , DESCRIPTORS = __webpack_require__(2)
	  , SPECIES     = __webpack_require__(3)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

	/***/ }),
	/* 99 */
	/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(5)
	  , aFunction = __webpack_require__(19)
	  , SPECIES   = __webpack_require__(3)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

	/***/ }),
	/* 100 */
	/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(37)});

	/***/ }),
	/* 101 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(32)
	  , $getPrototypeOf = __webpack_require__(43);

	__webpack_require__(45)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

	/***/ }),
	/* 102 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(32)
	  , $keys    = __webpack_require__(18);

	__webpack_require__(45)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

	/***/ }),
	/* 103 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(9);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(97).set});

	/***/ }),
	/* 104 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var LIBRARY            = __webpack_require__(26)
	  , global             = __webpack_require__(1)
	  , ctx                = __webpack_require__(14)
	  , classof            = __webpack_require__(55)
	  , $export            = __webpack_require__(9)
	  , isObject           = __webpack_require__(6)
	  , aFunction          = __webpack_require__(19)
	  , anInstance         = __webpack_require__(85)
	  , forOf              = __webpack_require__(87)
	  , speciesConstructor = __webpack_require__(99)
	  , task               = __webpack_require__(67).set
	  , microtask          = __webpack_require__(94)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(3)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(96)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(22)($Promise, PROMISE);
	__webpack_require__(98)(PROMISE);
	Wrapper = __webpack_require__(0)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(92)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

	/***/ }),
	/* 105 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(1)
	  , has            = __webpack_require__(12)
	  , DESCRIPTORS    = __webpack_require__(2)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(46)
	  , META           = __webpack_require__(72).KEY
	  , $fails         = __webpack_require__(11)
	  , shared         = __webpack_require__(30)
	  , setToStringTag = __webpack_require__(22)
	  , uid            = __webpack_require__(23)
	  , wks            = __webpack_require__(3)
	  , wksExt         = __webpack_require__(49)
	  , wksDefine      = __webpack_require__(48)
	  , keyOf          = __webpack_require__(93)
	  , enumKeys       = __webpack_require__(86)
	  , isArray        = __webpack_require__(90)
	  , anObject       = __webpack_require__(5)
	  , toIObject      = __webpack_require__(13)
	  , toPrimitive    = __webpack_require__(21)
	  , createDesc     = __webpack_require__(15)
	  , _create        = __webpack_require__(37)
	  , gOPNExt        = __webpack_require__(95)
	  , $GOPD          = __webpack_require__(57)
	  , $DP            = __webpack_require__(4)
	  , $keys          = __webpack_require__(18)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(65).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(41).f  = $propertyIsEnumerable;
	  __webpack_require__(58).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(26)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

	/***/ }),
	/* 106 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(48)('asyncIterator');

	/***/ }),
	/* 107 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(48)('observable');

	/***/ }),
	/* 108 */,
	/* 109 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stringify = __webpack_require__(40);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _keys = __webpack_require__(70);

	var _keys2 = _interopRequireDefault(_keys);

	exports.divideURL = divideURL;
	exports.divideEmail = divideEmail;
	exports.emptyObject = emptyObject;
	exports.deepClone = deepClone;
	exports.getUserURLFromEmail = getUserURLFromEmail;
	exports.getUserEmailFromURL = getUserEmailFromURL;
	exports.convertToUserURL = convertToUserURL;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	function divideEmail(email) {
	  var indexOfAt = email.indexOf('@');

	  var result = {
	    username: email.substring(0, indexOfAt),
	    domain: email.substring(indexOfAt + 1, email.length)
	  };

	  return result;
	}

	/**
	 * Check if an Object is empty
	 * @param  {Object} object Object to be checked
	 * @return {Boolean}       status of Object, empty or not (true|false);
	 */
	function emptyObject(object) {
	  return (0, _keys2.default)(object).length > 0 ? false : true;
	}

	/**
	 * Make a COPY of the original data
	 * @param  {Object}  obj - object to be cloned
	 * @return {Object}
	 */
	function deepClone(obj) {
	  //TODO: simple but inefficient JSON deep clone...
	  if (obj) return JSON.parse((0, _stringify2.default)(obj));
	}

	/**
	 * Obtains the user URL that corresponds to a given email
	 * @param  {string} userEmail The user email
	 * @return {URL.URL} userURL The user URL
	 */
	function getUserURLFromEmail(userEmail) {
	  var indexOfAt = userEmail.indexOf('@');
	  return 'user://' + userEmail.substring(indexOfAt + 1, userEmail.length) + '/' + userEmail.substring(0, indexOfAt);
	}

	/**
	 * Obtains the user email that corresponds to a given URL
	 * @param  {URL.URL} userURL The user URL
	 * @return {string} userEmail The user email
	 */
	function getUserEmailFromURL(userURL) {
	  var url = divideURL(userURL);
	  return url.identity.replace('/', '') + '@' + url.domain; // identity field has '/exampleID' instead of 'exampleID'
	}

	/**
	 * Check if the user identifier is already in the URL format, if not, convert to URL format
	 * @param  {string}   identifier  user identifier
	 * @return {string}   userURL    the user URL
	 */
	function convertToUserURL(identifier) {

	  // check if the identifier is already in the url format
	  if (identifier.substring(0, 7) === 'user://') {
	    var dividedURL = divideURL(identifier);

	    //check if the url is well formated
	    if (dividedURL.domain && dividedURL.identity) {
	      return identifier;
	    } else {
	      throw 'userURL with wrong format';
	    }

	    //if not, convert the user email to URL format
	  } else {
	    return getUserURLFromEmail(identifier);
	  }
	}

	/***/ }),
	/* 110 */,
	/* 111 */,
	/* 112 */,
	/* 113 */,
	/* 114 */,
	/* 115 */,
	/* 116 */,
	/* 117 */,
	/* 118 */
	/***/ (function(module, exports) {

	//     proxy-observe v0.0.18
	//     Copyright (c) 2015, 2016 Simon Y. Blackwell, AnyWhichWay
	//     MIT License - http://opensource.org/licenses/mit-license.php
	(function() {
		"use strict";
		// Creates and returns a Proxy wrapping a target so that all changes can be trapped and forwarded to
		// a callback. The callback takes an array of changes just like the traditional original Chrome Object.observe
		// {object:<object changed>,name:<field changed>,type:add|update|delete|reconfigure|preventExtensions|setPrototype,oldValue:<old value if update | delete>}
		// The acceptlist can be add|update|delete|reconfigure|preventExtensions|setPrototype.
		// v 0.0.10 to support pausing and restarting observation two additional constructor arguments are available to Object.observe:
		// pausable - create the Observer so it can be paused
		// pause - create observer in paused state
		// if pausable is true then an additional method deliver(ignorePrevious) is available to start delivery
		// to pause delivery set a property called pause on the function deliver to true
		// pausable is optional to reduce the chance of shadowing a property or method on any existing code called deliver
		if(!Object.observe && typeof(Proxy)==="function") {
			function Observer(target,callback,acceptlist,pausable,pause,delay) {
		    	var me = this, proxy;
		    	function deliver(ignorePrevious,delay) {
		    		deliver.delay = delay;
		    		if(!deliver.pause) {
		        		if(me.changeset.length>0) {
		        			if(!ignorePrevious) {
			    	    		var changes = me.changeset.filter(function(change) { return !acceptlist || acceptlist.indexOf(change.type)>=0; });
			        			if(changes.length>0) {
			        				callback(changes);
			        			}
		        			}
		        			me.changeset = [];
		        		}
		    		}
		    	}
		    	deliver.pause = pause;
		    	deliver.delay = delay;
			    me.get = function(target, property) {
			    	if(property==="__observer__") {
			    		return me;
			    	}
			    	if(property==="unobserve") {
			    		return function() {
			    			Object.unobserve(target);
			    			return target;
			    		};
			    	}
			    	if(property==="deliver") {
			    		return deliver;
			    	}
			    	return target[property];
			    }
		    	me.target = target;
		    	me.changeset = [];
		    	if(!me.target.__observerCallbacks__) {
		    		// __observerCallbacks__ is used as an index to get at the proxy which is the observer, so we can unobserve
		    		Object.defineProperty(target,"__observerCallbacks__",{enumerable:false,configurable:true,writable:false,value:[]});
		    		Object.defineProperty(target,"__observers__",{enumerable:false,configurable:true,writable:false,value:[]});
		    	}
		    	me.target.__observerCallbacks__.push(callback);
		    	me.target.__observers__.push(this);
		    	proxy = new Proxy(target,me);
		    	deliver(false,delay);
		    	return proxy;
		    }
			Observer.prototype.deliver = function() {
				return this.get(null,"deliver");
			}
		    Observer.prototype.set = function(target, property, value) { // , receiver
		    	var oldvalue = target[property];
		    	var type = (oldvalue===undefined ? "add" : "update");
		    	target[property] = value;
		    	if(target.__observers__.indexOf(this)>=0 && (!this.acceptlist || this.acceptlist.indexOf(type)>=0)) {
		        	var change = {object:target,name:property,type:type},
		        		start = this.changeset.length === 0,
		        		deliver = this.deliver();
		        	if(type==="update") {
		        		change.oldValue = oldvalue;
		        	}
		        	this.changeset.push(change);
		        	if(start) {
		        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
		        	}
		    	}
		    	return true;
		    };
		    Observer.prototype.deleteProperty = function(target, property) {
		    	var oldvalue = target[property];
		    	//if(typeof(oldvalue)!=="undefined") {
			    	delete target[property];
			    	if(target.__observers__.indexOf(this)>=0 && !this.acceptlist || this.acceptlist.indexOf("delete")>=0) {
			        	var change = {object:target,name:property,type:"delete",oldValue:oldvalue},
			        		start = this.changeset.length === 0,
			        		deliver = this.deliver();
			        	this.changeset.push(change);
			        	if(start) {
			        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
			        	}
			    	}
		    	//}
		    	return true;
		    };
		    Observer.prototype.defineProperty = function(target, property, descriptor) {
		    	Object.defineProperty(target, property, descriptor);
		    	if(target.__observers__.indexOf(this)>=0 && !this.acceptlist || this.acceptlist.indexOf("reconfigure")>=0) {
		        	var change = {object:target,name:property,type:"reconfigure"},
	        			start = this.changeset.length === 0,
	        			deliver = this.deliver();
		        	this.changeset.push(change);
		        	if(start) {
		        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
		        	}
		    	}
		    	return true;
		    };
		    Observer.prototype.setPrototypeOf = function(target, prototype) {
		    	var oldvalue = Object.getPrototypeOf(target);
		    	Object.setPrototypeOf(target, prototype);
		    	if(target.__observers__.indexOf(this)>=0 && !this.acceptlist || this.acceptlist.indexOf("setPrototype")>=0) {
		        	var change = {object:target,name:"__proto__",type:"setPrototype",oldValue:oldvalue},
	    				start = this.changeset.length === 0,
	    				deliver = this.deliver();
		        	this.changeset.push(change);
		        	if(start) {
		        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
		        	}
		    	}
		    	return true;
		    };
		    Observer.prototype.preventExtensions = function(target) {
		        Object.preventExtensions(target);
		    	if(target.__observers__.indexOf(this)>=0 && !this.acceptlist || this.acceptlist.indexOf("preventExtensions")>=0) {
		        	var change = {object:target,type:"preventExtensions"},
						start = this.changeset.length === 0,
						deliver = this.deliver();
		        	this.changeset.push(change);
		        	if(start) {
		        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
		        	}
		    	}
		    	return true;
		    };
		    Object.observe = function(object,callback,acceptlist,pausable,pause,delay) {
		    	return new Observer(object,callback,acceptlist,pausable,pause,delay);
		    };
		    Object.unobserve = function(object,callback) {
		    	if(object.__observerCallbacks__) {
		    		if(!callback) {
		    			object.__observerCallbacks__.splice(0,object.__observerCallbacks__.length);
		    			object.__observers__.splice(0,object.__observers__.length);
		    			return;
		    		}
		    		object.__observerCallbacks__.forEach(function(observercallback,i) {
		    			if(callback===observercallback) {
		    				object.__observerCallbacks__.splice(i,1);
		    				delete object.__observers__[i].callback;
		    				object.__observers__.splice(i,1);
		    			}
		    		});
		    	}
		    };
		    Array.observe = function(object,callback,acceptlist,pausable,pause,delay) {
		    	if(!(object instanceof Array) && !Array.isArray(object)) {
		    		throw new TypeError("First argument to Array.observer is not an Array");
		    	}
	            	acceptlist = acceptlist || ["add", "update", "delete", "splice"];
		    	var arrayproxy = new Proxy(object,{get: function(target,property) {
		    		if(property==="unobserve") {
			    		return function(callback) {
			    			if(callback) {
			    				return Object.unobserve(target,callback);
			    			}
			    			return target.unobserve();
			    		};
			    	}
		    		if(property==="splice") {
		    			return function(start,end) {
		    				if(typeof(start)!=="number" || typeof(end)!=="number") {
		    					throw new TypeError("First two arguments to Array splice are not number, number");
		    				}
		    	    		var removed = this.slice(start,start+end),
		    	    			addedCount = (arguments.length > 1 ? arguments.length-2 : 0),
		    	    			change =  {object:object,type:"splice",index:start,removed:removed,addedCount:addedCount};
		    	    		target.splice.apply(target,arguments);
		    	    		if(acceptlist.indexOf("splice")>=0) {
		    	    			var start = proxy.__observer__.changeset.length === 0,
		    	        			deliver = proxy.__observer__.deliver();
		    	    			proxy.__observer__.changeset.push(change);
		    	    			if(start) {
		    		        		deliver(false,(typeof(deliver.delay)==="number" ? deliver.delay : 10));
		    		        	}
		    	    		}
		    	    	}
		    		}
		    		if(property==="push") {
		    			 return function(item) {
		    		    	return this.splice(this.length,0,item);
		    		    }
		    		}
		    		if(property==="pop") {
		    			 return function() {
		    		    	return this.splice(this.length-1,1);
		    		    }
		    		}
		    		if(property==="unshift") {
		    			 return function(item) {
	    		    		return this.splice(0,0,item);
	    		    	}
		    		}
		    		if(property==="shift") {
		    			return function() {
		    	    		return this.splice(0,1);
		    	    	}
		    		}
		    		return target[property];
		    	}});
		    	var proxy = Object.observe(arrayproxy,function(changeset) { 
		    		var changes = changeset.filter(function(change) { return change.name!=="length" && change.name!=="add" && (!acceptlist || acceptlist.indexOf(change.type)>=0); });
		    		if(changes.length>0) {
		    			callback(changes);
		    		}
		    	},acceptlist,pausable,pause,delay);
		    	return proxy;
		    };
		    Array.unobserve = function(object,callback) {
			  return object.unobserve(callback);
		    }
		}
		Object.deepObserve = function(object,callback,parts) {

			parts = (parts ? parts : []);

			var toTypeName = function(obj) {
				return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
			}

			function reobserve(value, parts) {
				var keys = Object.keys(value);
				keys.forEach(function(key) {
					if((toTypeName(value[key]) === 'object' || toTypeName(value[key]) === 'array') && !value[key].hasOwnProperty('__observers__')) {
						var newparts = parts.slice(0);
						newparts.push(key);
						value[key] = Object.deepObserve(value[key],callback,newparts);
					}
				});
			}

			reobserve(object, parts);

			var observed = Object.observe(object,function(changeset) {
				var changes = [];
				function recurse(name,rootObject,oldObject,newObject,path) {
					if(newObject instanceof Object) {
						var newkeys = Object.keys(newObject);
						newkeys.forEach(function(key) {
							if(!oldObject || (oldObject[key]!==newObject[key])) {
								var oldvalue = (oldObject && oldObject[key]!==undefined ? oldObject[key] : undefined),
									change = (oldvalue===undefined ? "add" : "update"),
									keypath = path + "." + key;

								changes.push({name:name,object:rootObject,type:change,oldValue:oldvalue,newValue:newObject[key],keypath:keypath});
								recurse(name,rootObject,oldvalue,newObject[key],keypath);
							}
						});
					} else if(oldObject instanceof Object) {
						var oldkeys = Object.keys(oldObject);
						oldkeys.forEach(function(key) {
							var change = (newObject===null ? "update" : "delete"),
								keypath = path + "." + key;
								
							changes.push({name:name,object:rootObject,type:change,oldValue:oldObject[key],newValue:newObject,keypath:keypath});
							recurse(name,rootObject,oldObject[key],undefined,keypath);
						});
					}
				}
				changeset.forEach(function(change) {
					var keypath = (parts.length>0 ? parts.join(".") + "." : "") + change.name;

					if (change.type === "update" || change.type === "add") { 
						reobserve(change.object, parts);
					}

					changes.push({name:change.name,object:change.object,type:change.type,oldValue:change.oldValue,newValue:change.object[change.name],keypath:keypath});
					recurse(change.name,change.object,change.oldValue,change.object[change.name],keypath);
				});
				callback(changes);
			});
			return observed;
		};
	})();


	/***/ }),
	/* 119 */,
	/* 120 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(70);

	var _keys2 = _interopRequireDefault(_keys);

	var _getPrototypeOf = __webpack_require__(31);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(125);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(34);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _DataObject2 = __webpack_require__(122);

	var _DataObject3 = _interopRequireDefault(_DataObject2);

	var _DataObjectChild = __webpack_require__(123);

	var _DataObjectChild2 = _interopRequireDefault(_DataObjectChild);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	var FilterType = { ANY: 'any', START: 'start', EXACT: 'exact' };

	/**
	 * The class returned from the Syncher subscribe call.
	 * To be used as an observation point from a DataObjectReporter change.
	 */

	var DataObjectObserver = function (_DataObject) {
	  (0, _inherits3.default)(DataObjectObserver, _DataObject);

	  /* private
	  _changeListener: MsgListener
	   ----event handlers----
	  _filters: {<filter>: {type: <start, exact>, callback: <function>} }
	  */

	  /**
	   * @ignore
	   * Should not be used directly by Hyperties. It's called by the Syncher.subscribe method
	   */

	  //TODO: For Further Study
	  function DataObjectObserver(syncher, url, schema, initialStatus, initialData, childrens, initialVersion, mutual) {
	    (0, _classCallCheck3.default)(this, DataObjectObserver);

	    var _this2 = (0, _possibleConstructorReturn3.default)(this, (DataObjectObserver.__proto__ || (0, _getPrototypeOf2.default)(DataObjectObserver)).call(this, syncher, url, schema, initialStatus, initialData.data, childrens, mutual));

	    var _this = _this2;

	    _this._version = initialVersion;
	    _this._filters = {};

	    _this._syncObj.observe(function (event) {
	      _this._onFilter(event);
	    });

	    //setup childrens data from subscription
	    (0, _keys2.default)(initialData.childrens).forEach(function (childId) {
	      var childData = initialData.childrens[childId];
	      _this._childrenObjects[childId] = new _DataObjectChild2.default(_this, childId, childData);
	    });

	    _this._allocateListeners();
	    return _this2;
	  }

	  (0, _createClass3.default)(DataObjectObserver, [{
	    key: '_allocateListeners',
	    value: function _allocateListeners() {
	      (0, _get3.default)(DataObjectObserver.prototype.__proto__ || (0, _getPrototypeOf2.default)(DataObjectObserver.prototype), '_allocateListeners', this).call(this);
	      var _this = this;

	      _this._changeListener = _this._bus.addListener(_this._url + '/changes', function (msg) {
	        if (msg.type === 'update') {
	          console.log('DataObjectObserver-' + _this._url + '-RCV: ', msg);
	          _this._changeObject(_this._syncObj, msg);
	        }
	      });
	    }
	  }, {
	    key: '_releaseListeners',
	    value: function _releaseListeners() {
	      (0, _get3.default)(DataObjectObserver.prototype.__proto__ || (0, _getPrototypeOf2.default)(DataObjectObserver.prototype), '_releaseListeners', this).call(this);
	      var _this = this;

	      _this._changeListener.remove();
	    }

	    /**
	     * Release and delete object data
	     */

	  }, {
	    key: 'delete',
	    value: function _delete() {
	      var _this = this;

	      _this._releaseListeners();
	      delete _this._syncher._observers[_this._url];
	    }

	    /**
	     * Release and delete object data
	     */

	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe() {
	      var _this = this;

	      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onLocalUnSubscribe
	      var unSubscribeMsg = {
	        type: 'unsubscribe', from: _this._owner, to: _this._syncher._subURL,
	        body: { resource: _this._url }
	      };

	      _this._bus.postMessage(unSubscribeMsg, function (reply) {
	        console.log('DataObjectObserver-UNSUBSCRIBE: ', reply);
	        if (reply.body.code === 200) {
	          _this._releaseListeners();
	          delete _this._syncher._observers[_this._url];
	        }
	      });
	    }

	    /**
	     * Register the change listeners sent by the reporter
	     * @param {string} filter - Filter that identifies the field (separated dot path). Accepts * at the end for a more unrestricted filtering.
	     * @param {function(event: MsgEvent)} callback
	     */

	  }, {
	    key: 'onChange',
	    value: function onChange(filter, callback) {
	      var key = filter;
	      var filterObj = {
	        type: FilterType.EXACT,
	        callback: callback
	      };

	      var idx = filter.indexOf('*');
	      if (idx === filter.length - 1) {
	        if (idx === 0) {
	          filterObj.type = FilterType.ANY;
	        } else {
	          filterObj.type = FilterType.START;
	          key = filter.substr(0, filter.length - 1);
	        }
	      }

	      this._filters[key] = filterObj;
	    }
	  }, {
	    key: '_onFilter',
	    value: function _onFilter(event) {
	      var _this = this;

	      (0, _keys2.default)(_this._filters).forEach(function (key) {
	        var filter = _this._filters[key];
	        if (filter.type === FilterType.ANY) {
	          //match anything
	          filter.callback(event);
	        } else if (filter.type === FilterType.START) {
	          //if starts with filter...
	          if (event.field.indexOf(key) === 0) {
	            filter.callback(event);
	          }
	        } else if (filter.type === FilterType.EXACT) {
	          //exact match
	          if (event.field === key) {
	            filter.callback(event);
	          }
	        }
	      });
	    }
	  }]);
	  return DataObjectObserver;
	}(_DataObject3.default /* implements SyncStatus */);

	exports.default = DataObjectObserver;
	module.exports = exports['default'];

	/***/ }),
	/* 121 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(70);

	var _keys2 = _interopRequireDefault(_keys);

	var _getPrototypeOf = __webpack_require__(31);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(35);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(125);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(34);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _DataObject2 = __webpack_require__(122);

	var _DataObject3 = _interopRequireDefault(_DataObject2);

	var _utils = __webpack_require__(109);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * The class returned from the Syncher create call.
	 * To be used as a reporter point, changes will be submited to DataObjectObserver instances.
	 */
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

	var DataObjectReporter = function (_DataObject) {
	  (0, _inherits3.default)(DataObjectReporter, _DataObject);

	  /* private
	  _subscriptions: <hypertyUrl: { status: string } }>
	   ----event handlers----
	  _onSubscriptionHandler: (event) => void
	  _onResponseHandler: (event) => void
	  _onReadHandler: (event) => void
	  */

	  /**
	   * @ignore
	   * Should not be used directly by Hyperties. It's called by the Syncher.create method
	   */
	  function DataObjectReporter(syncher, url, schema, initialStatus, initialData, childrens) {
	    (0, _classCallCheck3.default)(this, DataObjectReporter);

	    var _this2 = (0, _possibleConstructorReturn3.default)(this, (DataObjectReporter.__proto__ || (0, _getPrototypeOf2.default)(DataObjectReporter)).call(this, syncher, url, schema, initialStatus, initialData, childrens));

	    var _this = _this2;

	    _this._subscriptions = {};

	    _this._syncObj.observe(function (event) {
	      console.log('DataObjectReporter-' + url + '-SEND: ', event);
	      _this._onChange(event);
	    });

	    _this._allocateListeners();
	    return _this2;
	  }

	  (0, _createClass3.default)(DataObjectReporter, [{
	    key: '_allocateListeners',
	    value: function _allocateListeners() {
	      (0, _get3.default)(DataObjectReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(DataObjectReporter.prototype), '_allocateListeners', this).call(this);
	      var _this = this;

	      _this._objectListener = _this._bus.addListener(_this._url, function (msg) {
	        console.log('DataObject-' + _this._url + '-RCV: ', msg);
	        switch (msg.type) {
	          case 'response':
	            _this._onResponse(msg);break;
	          case 'read':
	            _this._onRead(msg);break;
	        }
	      });
	    }
	  }, {
	    key: '_releaseListeners',
	    value: function _releaseListeners() {
	      (0, _get3.default)(DataObjectReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(DataObjectReporter.prototype), '_releaseListeners', this).call(this);
	      var _this = this;

	      _this._objectListener.remove();
	    }

	    /**
	     * Send invitations (create messages) to hyperties, observers list.
	     * @param  {HypertyURL[]} observers List of Hyperty URL's
	     */

	  }, {
	    key: 'inviteObservers',
	    value: function inviteObservers(observers) {
	      var _this = this;

	      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onCreate
	      var inviteMsg = {
	        type: 'create', from: _this._syncher._owner, to: _this._syncher._subURL,
	        body: { resume: false, resource: _this._url, schema: _this._schema, value: _this._syncObj.data, authorise: observers }
	      };

	      _this._bus.postMessage(inviteMsg);
	    }

	    /**
	     * Release and delete object data
	     */

	  }, {
	    key: 'delete',
	    value: function _delete() {
	      var _this = this;

	      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onDelete
	      var deleteMsg = {
	        type: 'delete', from: _this._owner, to: _this._syncher._subURL,
	        body: { resource: _this._url }
	      };

	      _this._bus.postMessage(deleteMsg, function (reply) {
	        console.log('DataObjectReporter-DELETE: ', reply);
	        if (reply.body.code === 200) {
	          _this._releaseListeners();
	          delete _this._syncher._reporters[_this._url];
	        }
	      });
	    }

	    /**
	     * Subscriptions requested and accepted to this reporter
	     * @type {Object<HypertyURL, SyncSubscription>}
	     */

	  }, {
	    key: 'onSubscription',


	    /**
	     * Setup the callback to process subscribe and unsubscribe notifications
	     * @param {function(event: MsgEvent)} callback function to receive events
	     */
	    value: function onSubscription(callback) {
	      this._onSubscriptionHandler = callback;
	    }

	    /**
	     * Setup the callback to process response notifications of the create's
	     * @param {function(event: MsgEvent)} callback function to receive events
	     */

	  }, {
	    key: 'onResponse',
	    value: function onResponse(callback) {
	      this._onResponseHandler = callback;
	    }

	    /**
	     * Setup the callback to process read notifications
	     * @param {function(event: MsgEvent)} callback
	     */

	  }, {
	    key: 'onRead',
	    value: function onRead(callback) {
	      this._onReadHandler = callback;
	    }

	    //FLOW-IN: message received from parent Syncher -> _onForward

	  }, {
	    key: '_onForward',
	    value: function _onForward(msg) {
	      var _this = this;

	      console.log('DataObjectReporter-RCV: ', msg);
	      switch (msg.body.type) {
	        case 'subscribe':
	          _this._onSubscribe(msg);break;
	        case 'unsubscribe':
	          _this._onUnSubscribe(msg);break;
	      }
	    }

	    //FLOW-IN: message received from this -> _onForward: emitted by a remote Syncher -> subscribe

	  }, {
	    key: '_onSubscribe',
	    value: function _onSubscribe(msg) {
	      var _this3 = this;

	      var _this = this;
	      var hypertyUrl = msg.body.from;
	      console.log('[DataObjectReporter._onSubscribe]', msg);

	      var event = {
	        type: msg.body.type,
	        url: hypertyUrl,

	        identity: msg.body.identity,

	        accept: function accept() {
	          //create new subscription
	          var sub = { url: hypertyUrl, status: 'on' };
	          _this._subscriptions[hypertyUrl] = sub;

	          //process and send childrens data
	          var childrenValues = {};
	          (0, _keys2.default)(_this._childrenObjects).forEach(function (childId) {
	            var childData = _this._childrenObjects[childId].data;
	            childrenValues[childId] = (0, _utils.deepClone)(childData);
	          });

	          var sendMsg = {
	            id: msg.id, type: 'response', from: msg.to, to: msg.from,
	            body: { code: 200, schema: _this._schema, version: _this._version, value: { data: (0, _utils.deepClone)(_this.data), childrens: childrenValues } }
	          };

	          //TODO: For Further Study
	          if (msg.body.hasOwnProperty('mutualAuthentication') && !msg.body.mutualAuthentication) {
	            sendMsg.body.mutualAuthentication = _this3._mutualAuthentication;
	            _this3._mutualAuthentication = msg.body.mutualAuthentication;
	          }

	          //send ok response message
	          _this._bus.postMessage(sendMsg);

	          return sub;
	        },

	        reject: function reject(reason) {
	          //send reject response message
	          _this._bus.postMessage({
	            id: msg.id, type: 'response', from: msg.to, to: msg.from,
	            body: { code: 403, desc: reason }
	          });
	        }
	      };

	      if (_this._onSubscriptionHandler) {
	        console.log('SUBSCRIPTION-EVENT: ', event);
	        _this._onSubscriptionHandler(event);
	      }
	    }

	    //FLOW-IN: message received from this -> _onForward: emitted by a remote DataObjectObserver -> unsubscribe

	  }, {
	    key: '_onUnSubscribe',
	    value: function _onUnSubscribe(msg) {
	      var _this = this;
	      var hypertyUrl = msg.body.from;

	      var sub = _this._subscriptions[hypertyUrl];
	      delete _this._subscriptions[hypertyUrl];

	      var event = {
	        type: msg.body.type,
	        url: hypertyUrl,
	        object: sub
	      };

	      if (_this._onSubscriptionHandler) {
	        console.log('UN-SUBSCRIPTION-EVENT: ', event);
	        _this._onSubscriptionHandler(event);
	      }
	    }

	    //FLOW-IN: message received from ReporterURL address: emited by a remote Syncher -> _onRemoteCreate -> event.ack

	  }, {
	    key: '_onResponse',
	    value: function _onResponse(msg) {
	      var _this = this;

	      var event = {
	        type: msg.type,
	        url: msg.from,
	        code: msg.body.code
	      };

	      if (_this._onResponseHandler) {
	        console.log('RESPONSE-EVENT: ', event);
	        _this._onResponseHandler(event);
	      }
	    }

	    //FLOW-IN: message received from ReporterURL address: emited by a remote Syncher -> read

	  }, {
	    key: '_onRead',
	    value: function _onRead(msg) {
	      var _this = this;

	      var event = {
	        type: msg.type,
	        url: msg.from,

	        accept: function accept() {
	          _this._bus.postMessage({
	            id: msg.id, type: 'response', from: msg.to, to: msg.from,
	            body: { code: 200, value: (0, _utils.deepClone)(_this.data) }
	          });
	        },

	        reject: function reject(reason) {
	          _this._bus.postMessage({
	            id: msg.id, type: 'response', from: msg.to, to: msg.from,
	            body: { code: 401, desc: reason }
	          });
	        }
	      };

	      if (_this._onReadHandler) {
	        console.log('READ-EVENT: ', event);
	        _this._onReadHandler(event);
	      }
	    }
	  }, {
	    key: 'subscriptions',
	    get: function get() {
	      return this._subscriptions;
	    }
	  }]);
	  return DataObjectReporter;
	}(_DataObject3.default /* implements SyncStatus */);

	exports.default = DataObjectReporter;
	module.exports = exports['default'];

	/***/ }),
	/* 122 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(71);

	var _promise2 = _interopRequireDefault(_promise);

	var _keys = __webpack_require__(70);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _ProxyObject = __webpack_require__(124);

	var _ProxyObject2 = _interopRequireDefault(_ProxyObject);

	var _DataObjectChild = __webpack_require__(123);

	var _DataObjectChild2 = _interopRequireDefault(_DataObjectChild);

	var _utils = __webpack_require__(109);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Main extension class for observers and reporters, with common properties and methods.
	 * Children management is common for observers and reporters.
	 */
	var DataObject = function () {
	  /* private
	  _version: number
	   _owner: HypertyURL
	  _url: ObjectURL
	  _schema: Schema
	  _bus: MiniBus
	  _status: on | paused
	  _syncObj: SyncData
	   _children: { id: DataObjectChild }
	  _childrenListeners: [MsgListener]
	   ----event handlers----
	  _onAddChildHandler: (event) => void
	  */

	  /**
	   * @ignore
	   * Should not be used directly by Hyperties. It's called by the Syncher create or subscribe method's
	   */
	  function DataObject(syncher, url, schema, initialStatus, initialData, childrens) {
	    var mutual = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
	    (0, _classCallCheck3.default)(this, DataObject);

	    var _this = this;

	    _this._syncher = syncher;
	    _this._url = url;
	    _this._schema = schema;
	    _this._status = initialStatus;
	    _this._syncObj = new _ProxyObject2.default(initialData);
	    _this._childrens = childrens;

	    //TODO: For Further Study
	    _this._mutualAuthentication = mutual;

	    _this._version = 0;
	    _this._childId = 0;
	    _this._childrenObjects = {};
	    _this._childrenListeners = [];

	    _this._owner = syncher._owner;
	    _this._bus = syncher._bus;
	  }

	  (0, _createClass3.default)(DataObject, [{
	    key: '_allocateListeners',
	    value: function _allocateListeners() {
	      var _this2 = this;

	      var _this = this;

	      var childBaseURL = _this._url + '/children/';
	      console.log('[Data Object - AllocateListeners] - ', _this._childrens);
	      if (_this._childrens) {
	        _this._childrens.forEach(function (child) {
	          var childURL = childBaseURL + child;
	          var listener = _this._bus.addListener(childURL, function (msg) {
	            //ignore msg sent by himself
	            if (msg.from !== _this2._owner) {
	              console.log('DataObject-Children-RCV: ', msg);
	              switch (msg.type) {
	                case 'create':
	                  _this._onChildCreate(msg);break;
	                case 'delete':
	                  console.log(msg);break;
	                default:
	                  _this._changeChildren(msg);break;
	              }
	            }
	          });

	          _this._childrenListeners.push(listener);
	        });
	      }
	    }
	  }, {
	    key: '_releaseListeners',
	    value: function _releaseListeners() {
	      var _this = this;

	      _this._childrenListeners.forEach(function (listener) {
	        listener.remove();
	      });

	      (0, _keys2.default)(_this._childrenObjects).forEach(function (key) {
	        _this._childrenObjects[key]._releaseListeners();
	      });
	    }

	    /**
	     * Object URL of reporter or observer
	     * @type {ObjectURL}
	     */

	  }, {
	    key: 'pause',


	    /**
	     * @ignore
	     */
	    value: function pause() {
	      //TODO: this feature needs more analise
	      throw 'Not implemented';
	    }

	    /**
	     * @ignore
	     */

	  }, {
	    key: 'resume',
	    value: function resume() {
	      //TODO: this feature needs more analise
	      throw 'Not implemented';
	    }

	    /**
	     * @ignore
	     */

	  }, {
	    key: 'stop',
	    value: function stop() {
	      //TODO: should remove the subscription and send message unsubscribe?
	      throw 'Not implemented';
	    }

	    /**
	     * Create and add a DataObjectChild to a children collection.
	     * @param {String} children - Children name where the child is added.
	     * @param {JSON} initialData - Initial data of the child
	     * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
	     * @return {Promise<DataObjectChild>} - Return Promise to a new DataObjectChild.
	     */

	  }, {
	    key: 'addChild',
	    value: function addChild(children, initialData, identity) {
	      var _this = this;

	      //create new child unique ID, based on hypertyURL
	      _this._childId++;
	      var msgChildId = _this._owner + '#' + _this._childId;
	      var msgChildPath = _this._url + '/children/' + children;

	      //FLOW-OUT: this message will be sent directly to a resource child address: MessageBus
	      var requestMsg = {
	        type: 'create', from: _this._owner, to: msgChildPath,
	        body: { resource: msgChildId, value: initialData }
	      };

	      if (identity) {
	        requestMsg.body.identity = identity;
	      }

	      //TODO: For Further Study
	      if (!_this._mutualAuthentication) requestMsg.body.mutualAuthentication = _this._mutualAuthentication;

	      //returns promise, in the future, the API may change to asynchronous call
	      return new _promise2.default(function (resolve) {
	        var msgId = _this._bus.postMessage(requestMsg);

	        console.log('create-reporter-child( ' + _this._owner + ' ): ', requestMsg);
	        var newChild = new _DataObjectChild2.default(_this, msgChildId, initialData, _this._owner, msgId);
	        newChild.onChange(function (event) {
	          _this._onChange(event, { path: msgChildPath, childId: msgChildId });
	        });

	        _this._childrenObjects[msgChildId] = newChild;

	        resolve(newChild);
	      });
	    }

	    /**
	     * Setup the callback to process create and delete of childrens.
	     * @param {function(event: MsgEvent)} callback
	     */

	  }, {
	    key: 'onAddChild',
	    value: function onAddChild(callback) {
	      this._onAddChildrenHandler = callback;
	    }

	    //FLOW-IN: message received from a remote DataObject -> addChild

	  }, {
	    key: '_onChildCreate',
	    value: function _onChildCreate(msg) {
	      var _this = this;
	      var msgChildId = msg.body.resource;

	      console.log('create-observer-child( ' + _this._owner + ' ): ', msg);
	      var newChild = new _DataObjectChild2.default(_this, msgChildId, msg.body.value);
	      _this._childrenObjects[msgChildId] = newChild;

	      setTimeout(function () {
	        //FLOW-OUT: will flow to DataObjectChild -> _onResponse
	        _this._bus.postMessage({
	          id: msg.id, type: 'response', from: msg.to, to: msg.from,
	          body: { code: 200, source: _this._owner }
	        });
	      });

	      var event = {
	        type: msg.type,
	        from: msg.from,
	        url: msg.to,
	        value: msg.body.value,
	        childId: msgChildId,
	        identity: msg.body.identity
	      };

	      if (_this._onAddChildrenHandler) {
	        console.log('ADD-CHILDREN-EVENT: ', event);
	        _this._onAddChildrenHandler(event);
	      }
	    }

	    //send delta messages to subscriptions

	  }, {
	    key: '_onChange',
	    value: function _onChange(event, childInfo) {
	      var _this = this;

	      _this._version++;

	      if (_this._status === 'on') {
	        //FLOW-OUT: this message will be sent directly to a resource changes address: MessageBus
	        var changeMsg = {
	          type: 'update', from: _this._url, to: _this._url + '/changes',
	          body: { version: _this._version, source: _this._owner, attribute: event.field }
	        };

	        console.log('[DataObject - _onChange] - ', event, childInfo, changeMsg);

	        if (event.oType === _ProxyObject.ObjectType.OBJECT) {
	          if (event.cType !== _ProxyObject.ChangeType.REMOVE) {
	            changeMsg.body.value = event.data;
	          }
	        } else {
	          changeMsg.body.attributeType = event.oType;
	          changeMsg.body.value = event.data;
	          if (event.cType !== _ProxyObject.ChangeType.UPDATE) {
	            changeMsg.body.operation = event.cType;
	          }
	        }

	        //childInfo must have (path, childId)
	        if (childInfo) {
	          changeMsg.to = childInfo.path;
	          changeMsg.body.resource = childInfo.childId;
	        }

	        //TODO: For Further Study
	        if (!_this._mutualAuthentication) changeMsg.body.mutualAuthentication = _this._mutualAuthentication;

	        _this._bus.postMessage(changeMsg);
	      }
	    }

	    //FLOW-IN: delta message received from a remote DataObjectReporter or DataObjectChild when changing data

	  }, {
	    key: '_changeObject',
	    value: function _changeObject(syncObj, msg) {
	      var _this = this;

	      //TODO: update version ?
	      //how to handle an incorrect version ? Example: receive a version 3 when the observer is in version 1, where is the version 2 ?
	      //will we need to confirm the reception ?
	      if (_this._version + 1 === msg.body.version) {
	        _this._version++;
	        var path = msg.body.attribute;
	        var value = (0, _utils.deepClone)(msg.body.value);
	        var findResult = syncObj.findBefore(path);

	        if (msg.body.attributeType === _ProxyObject.ObjectType.ARRAY) {
	          if (msg.body.operation === _ProxyObject.ChangeType.ADD) {
	            var arr = findResult.obj;
	            var index = findResult.last;
	            Array.prototype.splice.apply(arr, [index, 0].concat(value));
	          } else if (msg.body.operation === _ProxyObject.ChangeType.REMOVE) {
	            var _arr = findResult.obj;
	            var _index = findResult.last;
	            _arr.splice(_index, value);
	          } else {
	            findResult.obj[findResult.last] = value; // UPDATE
	          }
	        } else {
	          if (msg.body.value) {
	            findResult.obj[findResult.last] = value; // UPDATE or ADD
	          } else {
	            delete findResult.obj[findResult.last]; // REMOVE
	          }
	        }
	      } else {
	        //TODO: how to handle unsynchronized versions?
	        console.log('UNSYNCHRONIZED VERSION: (data => ' + _this._version + ', msg => ' + msg.body.version + ')');
	      }
	    }

	    //FLOW-IN: message received from a remote DataObjectChild when changing data

	  }, {
	    key: '_changeChildren',
	    value: function _changeChildren(msg) {
	      var _this = this;
	      console.log('Change children: ', _this._owner, msg);

	      var childId = msg.body.resource;
	      var children = _this._childrenObjects[childId];

	      if (children) {
	        _this._changeObject(children._syncObj, msg);
	      } else {
	        console.log('No children found for: ', childId);
	      }
	    }
	  }, {
	    key: 'url',
	    get: function get() {
	      return this._url;
	    }

	    /**
	     * Object schema URL (this field is not yet stable, and is subsject to change)
	     * @type {SchemaURL}
	     */

	  }, {
	    key: 'schema',
	    get: function get() {
	      return this._schema;
	    }

	    /**
	     * Status of the reporter or observer connection (this field is not yet stable, and is subsject to change)
	     * @type {Status} - Enum of: on | paused
	     */

	  }, {
	    key: 'status',
	    get: function get() {
	      return this._status;
	    }

	    /**
	     * Data structure to be synchronized.
	     * @type {JSON} - JSON structure that should follow the defined schema, if any.
	     */

	  }, {
	    key: 'data',
	    get: function get() {
	      return this._syncObj.data;
	    }

	    /**
	     * All created children's since the subscription, doesn't contain all children's since reporter creation.
	     * @type {Object<ChildId, DataObjectChild>}
	     */

	  }, {
	    key: 'childrens',
	    get: function get() {
	      return this._childrenObjects;
	    }
	  }]);
	  return DataObject;
	}(); /**
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

	exports.default = DataObject;
	module.exports = exports['default'];

	/***/ }),
	/* 123 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _ProxyObject = __webpack_require__(124);

	var _ProxyObject2 = _interopRequireDefault(_ProxyObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * The class returned from the DataObject addChildren call or from onAddChildren if remotely created.
	 * Children object synchronization is a a fast forward mechanism, no need for direct subscriptions, it uses the already authorized subscription from the parent DataObject.
	 */
	var DataObjectChild /* implements SyncStatus */ = function () {
	  /* private
	   ----event handlers----
	  _onResponseHandler: (event) => void
	  */

	  /**
	   * @ignore
	   * Should not be used directly by Hyperties. It's called by the DataObject.addChildren
	   */
	  function DataObjectChild(parent, childId, initialData, owner, msgId) {
	    (0, _classCallCheck3.default)(this, DataObjectChild);

	    var _this = this;

	    _this._parent = parent;
	    _this._childId = childId;
	    _this._owner = owner;
	    _this._msgId = msgId;

	    _this._syncObj = new _ProxyObject2.default(initialData);

	    _this._bus = parent._bus;
	    _this._allocateListeners();
	  }

	  (0, _createClass3.default)(DataObjectChild, [{
	    key: '_allocateListeners',
	    value: function _allocateListeners() {
	      var _this = this;

	      //this is only needed for children reporters
	      if (_this._owner) {
	        _this._listener = _this._bus.addListener(_this._owner, function (msg) {
	          if (msg.type === 'response' && msg.id === _this._msgId) {
	            console.log('DataObjectChild.onResponse:', msg);
	            _this._onResponse(msg);
	          }
	        });
	      }
	    }
	  }, {
	    key: '_releaseListeners',
	    value: function _releaseListeners() {
	      var _this = this;

	      if (_this._listener) {
	        _this._listener.remove();
	      }
	    }

	    /**
	     * Release and delete object data
	     */

	  }, {
	    key: 'delete',
	    value: function _delete() {
	      var _this = this;

	      delete _this._parent._children[_this._childId];

	      _this._releaseListeners();

	      //TODO: send delete message ?
	    }

	    /**
	     * Children ID generated on addChildren. Unique identifier
	     * @type {URL} - URL of the format <HypertyURL>#<numeric-sequence>
	     */

	  }, {
	    key: 'onChange',


	    /**
	     * Register the change listeners sent by the reporter child
	     * @param {function(event: MsgEvent)} callback
	     */
	    value: function onChange(callback) {
	      this._syncObj.observe(function (event) {
	        callback(event);
	      });
	    }

	    /**
	     * Setup the callback to process response notifications of the creates
	     * @param {function(event: MsgEvent)} callback
	     */

	  }, {
	    key: 'onResponse',
	    value: function onResponse(callback) {
	      this._onResponseHandler = callback;
	    }

	    //FLOW-IN: message received from a remote DataObject -> _onChildCreate

	  }, {
	    key: '_onResponse',
	    value: function _onResponse(msg) {
	      var _this = this;

	      var event = {
	        type: msg.type,
	        url: msg.body.source,
	        code: msg.body.code
	      };

	      if (_this._onResponseHandler) {
	        _this._onResponseHandler(event);
	      }
	    }
	  }, {
	    key: 'childId',
	    get: function get() {
	      return this._childId;
	    }

	    /**
	     * Data Structure to be synchronized.
	     * @type {JSON} - JSON structure that should follow the defined schema, if any.
	     */

	  }, {
	    key: 'data',
	    get: function get() {
	      return this._syncObj.data;
	    }
	  }]);
	  return DataObjectChild;
	}(); /**
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

	exports.default = DataObjectChild;
	module.exports = exports['default'];

	/***/ }),
	/* 124 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ObjectType = exports.ChangeType = undefined;

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(118);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var objectType = { ARRAY: '[object Array]', OBJECT: '[object Object]' };

	/**
	 * @access private
	 * Main class that maintains a JSON object, and observes changes in this object, recursively.
	 * Internal objects and arrays are also observed.
	 */

	var SyncObject = function () {
	  function SyncObject(initialData) {
	    (0, _classCallCheck3.default)(this, SyncObject);

	    var _this = this;

	    _this._observers = [];
	    _this._filters = {};

	    this._data = initialData || {};

	    this._internalObserve(this._data);
	  }

	  (0, _createClass3.default)(SyncObject, [{
	    key: 'observe',
	    value: function observe(callback) {
	      this._observers.push(callback);
	    }
	  }, {
	    key: 'find',
	    value: function find(path) {
	      var list = path.split('.');

	      return this._findWithSplit(list);
	    }
	  }, {
	    key: 'findBefore',
	    value: function findBefore(path) {
	      var result = {};
	      var list = path.split('.');
	      result.last = list.pop();
	      result.obj = this._findWithSplit(list);

	      return result;
	    }
	  }, {
	    key: '_findWithSplit',
	    value: function _findWithSplit(list) {
	      var obj = this._data;
	      list.forEach(function (value) {
	        obj = obj[value];
	      });

	      return obj;
	    }
	  }, {
	    key: '_internalObserve',
	    value: function _internalObserve(object) {
	      var _this2 = this;

	      var handler = function handler(changeset) {

	        changeset.every(function (change) {
	          _this2._onChanges(change);
	        });
	      };

	      this._data = Object.deepObserve(object, handler);
	    }
	  }, {
	    key: '_fireEvent',
	    value: function _fireEvent(event) {
	      this._observers.forEach(function (callback) {
	        callback(event);
	      });
	    }
	  }, {
	    key: '_onChanges',
	    value: function _onChanges(change) {

	      var obj = change.object;
	      var objType = void 0;

	      if (obj.constructor === Object) {
	        objType = ObjectType.OBJECT;
	      }

	      if (obj.constructor === Array) {
	        objType = ObjectType.ARRAY;
	      }

	      var fieldString = change.keypath;

	      // console.log('Field:', fieldString);
	      // console.log('type:', change.type);

	      //let oldValue = change.oldValue;
	      var newValue = obj[change.name];

	      // console.info(change.type + ' | Field: ' + fieldString + ' | New Value:', JSON.stringify(newValue), fieldString.includes('length'));

	      if (change.type === 'update' && !fieldString.includes('.length')) {
	        this._fireEvent({
	          cType: ChangeType.UPDATE,
	          oType: objType,
	          field: fieldString,
	          data: newValue
	        });
	      }

	      if (change.type === 'add') {
	        this._fireEvent({
	          cType: ChangeType.ADD,
	          oType: objType,
	          field: fieldString,
	          data: newValue
	        });
	      }

	      if (change.type === 'delete') {
	        this._fireEvent({
	          cType: ChangeType.REMOVE,
	          oType: objType,
	          field: fieldString
	        });
	      }
	    }
	  }, {
	    key: 'data',
	    get: function get() {
	      return this._data;
	    }
	  }]);
	  return SyncObject;
	}();

	var ChangeType = exports.ChangeType = { UPDATE: 'update', ADD: 'add', REMOVE: 'remove' };
	var ObjectType = exports.ObjectType = { OBJECT: 'object', ARRAY: 'array' };
	exports.default = SyncObject;

	/***/ }),
	/* 125 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(31);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(142);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

	/***/ }),
	/* 126 */,
	/* 127 */,
	/* 128 */,
	/* 129 */,
	/* 130 */,
	/* 131 */,
	/* 132 */,
	/* 133 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(71);

	var _promise2 = _interopRequireDefault(_promise);

	var _assign = __webpack_require__(140);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _DataObjectReporter = __webpack_require__(121);

	var _DataObjectReporter2 = _interopRequireDefault(_DataObjectReporter);

	var _DataObjectObserver = __webpack_require__(120);

	var _DataObjectObserver2 = _interopRequireDefault(_DataObjectObserver);

	var _DataProvisional = __webpack_require__(137);

	var _DataProvisional2 = _interopRequireDefault(_DataProvisional);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* The main class for the syncher package.
	* The Syncher is a singleton class per Hyperty/URL and it is the owner of all created Data Sync Objects according to the Reporter - Observer pattern.
	* Main functionality is to create reporters and to subscribe to existing ones.
	*/
	var Syncher = function () {
	  /* private
	  _owner: URL
	  _bus: MiniBus
	   _subURL: URL
	   _reporters: <url: DataObjectReporter>
	  _observers: <url: DataObjectObserver>
	  _provisionals: <url: DataProvisional>
	   ----event handlers----
	  _onNotificationHandler: (event) => void
	  _onResume: (event) => void
	  */

	  /**
	  * Constructor that should be used by the Hyperty owner
	  * @param {HypertyURL} owner - Hyperty URL owner. An URL allocated by the runtime that uniquely identifies the Hyperty.
	  * @param {MiniBus} bus - An instance of the MiniBus provided in the sandbox. When an object (Reporter or Observed) is created, the SyncherManager will add a listener in the MiniBus to receive/send Messages of that object.
	  * @param {JSON} config - Configuration data. The only required field for now is the runtimeURL.
	  */
	  function Syncher(owner, bus, config) {
	    (0, _classCallCheck3.default)(this, Syncher);

	    var _this = this;

	    _this._owner = owner;
	    _this._bus = bus;

	    _this._subURL = config.runtimeURL + '/sm';

	    _this._reporters = {};
	    _this._observers = {};
	    _this._provisionals = {};

	    bus.addListener(owner, function (msg) {
	      //ignore msg sent by himself
	      if (msg.from !== owner) {
	        console.info('[Syncher] Syncher-RCV: ', msg);
	        switch (msg.type) {
	          case 'forward':
	            _this._onForward(msg);break;
	          case 'create':
	            _this._onRemoteCreate(msg);break;
	          case 'delete':
	            _this._onRemoteDelete(msg);break;
	        }
	      }
	    });
	  }

	  /**
	  * The owner of the Syncher and all created reporters.
	  * @type {HypertyURL}
	  */


	  (0, _createClass3.default)(Syncher, [{
	    key: 'create',


	    /**
	    * Request a DataObjectReporter creation. The URL will be be requested by the allocation mechanism.
	    * @param  {SchemaURL} schema - Hyperty Catalogue URL address that can be used to retrieve the JSON-Schema describing the Data Object schema
	    * @param  {HypertyURL[]} observers - List of hyperties that are pre-authorized for subscription
	    * @param  {JSON} initialData - Initial data of the reporter
	    * @param  {boolean} store - (Optional) if true, object will be stored by the runtime
	    * @param  {boolean} p2p - (Optional) if true, data synchronisation stream will use p2p connection as much as possible
	    * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
	    * @return {Promise<DataObjectReporter>} Return Promise to a new Reporter. The reporter can be accepted or rejected by the PEP
	    */
	    value: function create(schema, observers, initialData) {
	      var store = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	      var p2p = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	      var identity = arguments[5];

	      var _this = this;
	      var criteria = {};

	      criteria.p2p = p2p;
	      criteria.store = store;
	      criteria.schema = schema;
	      criteria.observers = observers;
	      criteria.initialData = initialData;

	      if (identity) {
	        criteria.identity = identity;
	      }

	      console.log('[syncher - create] - create Reporter - criteria: ', criteria);

	      (0, _assign2.default)(criteria, { resume: false });

	      return _this._create(criteria);
	    }
	  }, {
	    key: 'resumeReporters',
	    value: function resumeReporters(criteria) {
	      var _this = this;
	      console.log('[syncher - create] - resume Reporter - criteria: ', criteria);

	      (0, _assign2.default)(criteria, { resume: true });

	      return _this._create(criteria);
	    }

	    /**
	    * Request a subscription to an existent reporter object.
	    * @param {SchemaURL} schema - Hyperty Catalogue URL address that can be used to retrieve the JSON-Schema describing the Data Object schema
	    * @param {ObjectURL} objURL - Address of the existent reporter object to be observed
	    * @param {Boolean} [store=false] - Save the subscription on the Syncher Manager for further resume (Default is false)
	    * @param {Boolean} [p2p=false] - Info about if should use p2p connection (Default is false)
	    * @param {Boolean} [mutual=true] - Info about if messages of this object should be encrypted (Default is true)
	    * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
	    * @return {Promise<DataObjectObserver>} Return Promise to a new observer. It's associated with the reporter.
	    */

	  }, {
	    key: 'subscribe',
	    value: function subscribe(schema, objURL) {
	      var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	      var p2p = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	      var mutual = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
	      var identity = arguments[5];

	      var _this = this;
	      var criteria = {};

	      criteria.p2p = p2p;
	      criteria.store = store;
	      criteria.schema = schema;

	      criteria.resource = objURL;
	      if (identity) {
	        criteria.identity = identity;
	      }

	      //TODO: For Further Study
	      criteria.mutual = mutual;

	      console.log('[syncher - subscribe] - subscribe criteria: ', criteria);

	      (0, _assign2.default)(criteria, { resume: false });

	      return _this._subscribe(criteria);
	    }

	    /**
	    * Request a subscription to an existent reporter object.
	    * @param {criteria} criteria - Information to discovery the observer object
	    * @return {Promise<DataObjectObserver>} Return Promise to a new observer. It's associated with the reporter.
	    */

	  }, {
	    key: 'resumeObservers',
	    value: function resumeObservers(criteria) {
	      var _this = this;
	      var _criteria = criteria || {};

	      (0, _assign2.default)(_criteria, { resume: true });

	      return _this._subscribe(_criteria);
	    }

	    /**
	    * Request a read action on the reporter object
	    * @param {ObjectURL} objURL - URL of the reporter object to be read
	    * @return {Promise<Object>} Return Promise to last available data of the reporter
	    */

	  }, {
	    key: 'read',
	    value: function read(objURL) {
	      var _this = this;

	      //FLOW-OUT: this message will be sent directly to reporter object (maybe there is no listener available, so it will be resolved with MessageBus -> resolve)
	      //will reach the remote object in DataObjectReporter -> _onRead
	      var readMsg = {
	        type: 'read', from: _this._owner, to: objURL
	      };

	      return new _promise2.default(function (resolve, reject) {
	        _this._bus.postMessage(readMsg, function (reply) {
	          console.log('read-response: ', reply);
	          if (reply.body.code === 200) {
	            resolve(reply.body.value);
	          } else {
	            reject(reply.body.desc);
	          }
	        });
	      });
	    }

	    /**
	    * Setup the callback to process create and delete events of remove Reporter objects.
	    * This is releated to the messagens sent by create to the observers Hyperty array.
	    * @param {function(event: MsgEvent)} callback
	    */

	  }, {
	    key: 'onNotification',
	    value: function onNotification(callback) {
	      this._onNotificationHandler = callback;
	    }
	  }, {
	    key: '_create',
	    value: function _create(criteria) {
	      var _this = this;

	      return new _promise2.default(function (resolve, reject) {
	        var resume = criteria.resume;
	        var initialData = criteria.initialData || {};
	        var schema = void 0;

	        //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onCreate
	        var requestMsg = {
	          type: 'create', from: _this._owner, to: _this._subURL,
	          body: { resume: resume }
	        };

	        console.log('[syncher - create]: ', criteria, requestMsg);

	        requestMsg.body.value = initialData;
	        requestMsg.body.value.reporter = _this._owner;

	        if (criteria.schema) {
	          schema = criteria.schema;
	          requestMsg.body.schema = criteria.schema;
	        }

	        if (criteria.p2p) requestMsg.body.p2p = criteria.p2p;
	        if (criteria.store) requestMsg.body.store = criteria.store;
	        if (criteria.observers) requestMsg.body.authorise = criteria.observers;
	        if (criteria.identity) requestMsg.body.identity = criteria.identity;

	        if (resume) {
	          console.log('[syncher - create] - resume message: ', requestMsg);
	        } else {
	          console.log('[syncher - create] - create message: ', requestMsg);
	        }

	        //request create to the allocation system. Can be rejected by the PolicyEngine.
	        _this._bus.postMessage(requestMsg, function (reply) {
	          console.log('[syncher - create] - create-response: ', reply);
	          if (reply.body.code === 200) {
	            //reporter creation accepted
	            var objURL = reply.body.resource;

	            if (resume) {
	              schema = reply.body.schema;
	              initialData = reply.body.value;
	            }

	            var newObj = new _DataObjectReporter2.default(_this, objURL, schema, 'on', initialData, reply.body.childrenResources);
	            _this._reporters[objURL] = newObj;

	            resolve(newObj);
	          } else {
	            //reporter creation rejected
	            reject(reply.body.desc);
	          }
	        });
	      });
	    }
	  }, {
	    key: '_subscribe',
	    value: function _subscribe(criteria) {
	      var _this = this;

	      return new _promise2.default(function (resolve, reject) {

	        //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onLocalSubscribe
	        var subscribeMsg = {
	          type: 'subscribe', from: _this._owner, to: _this._subURL,
	          body: {}
	        };

	        // Hyperty request to be an Observer
	        // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#hyperty-request-to-be-an-observer

	        // Resume Subscriptions for the same Hyperty URL
	        // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-the-same-hyperty-url

	        // Resume Subscriptions for a certain user and data schema independently of the Hyperty URL.
	        // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-a-certain-user-and-data-schema-independently-of-the-hyperty-url
	        if (criteria) {
	          if (criteria.hasOwnProperty('p2p')) subscribeMsg.body.p2p = criteria.p2p;
	          if (criteria.hasOwnProperty('store')) subscribeMsg.body.store = criteria.store;
	          if (criteria.hasOwnProperty('schema')) subscribeMsg.body.schema = criteria.schema;
	          if (criteria.hasOwnProperty('identity')) subscribeMsg.body.identity = criteria.identity;
	          if (criteria.hasOwnProperty('resource')) subscribeMsg.body.resource = criteria.resource;
	          if (criteria.hasOwnProperty('identity')) subscribeMsg.body.identity = criteria.identity;
	        }

	        subscribeMsg.body.resume = criteria.resume;

	        //TODO: For Further Study
	        var mutualAuthentication = criteria.mutual;
	        if (criteria.hasOwnProperty('mutual')) subscribeMsg.body.mutualAuthentication = mutualAuthentication;

	        console.log('[syncher] - subscribe message: ', criteria, subscribeMsg);

	        //request subscription
	        //Provisional data is applied to the DataObjectObserver after confirmation. Or discarded if there is no confirmation.
	        //for more info see the DataProvisional class documentation.
	        _this._bus.postMessage(subscribeMsg, function (reply) {
	          console.log('[syncher] - subscribe-response: ', reply);

	          var schema = reply.body.schema;
	          var objURL = reply.body.resource;

	          var newProvisional = _this._provisionals[objURL];
	          delete _this._provisionals[objURL];
	          if (newProvisional) newProvisional._releaseListeners();

	          if (reply.body.code < 200) {
	            console.log('[syncher] - new DataProvisional: ', reply.body.childrenResources, objURL);
	            newProvisional = new _DataProvisional2.default(_this._owner, objURL, _this._bus, reply.body.childrenResources);
	            _this._provisionals[objURL] = newProvisional;
	          } else if (reply.body.code === 200) {
	            console.log('[syncher] - new Data Object Observer: ', reply, _this._provisionals);

	            var initialData = reply.body.value;
	            if (!initialData.hasOwnProperty('childrens')) {
	              initialData.childrens = {};
	            }
	            if (!initialData.hasOwnProperty('data')) {
	              initialData.data = {};
	            }

	            //TODO: mutualAuthentication For Further Study
	            var newObj = new _DataObjectObserver2.default(_this, objURL, schema, 'on', initialData, newProvisional.children, reply.body.version, mutualAuthentication);
	            _this._observers[objURL] = newObj;

	            resolve(newObj);
	            newProvisional.apply(newObj);
	          } else {
	            reject(reply.body.desc);
	          }
	        });
	      });
	    }

	    //FLOW-IN: message received from a local runtime ReporterObject -> _onRemoteSubscribe

	  }, {
	    key: '_onForward',
	    value: function _onForward(msg) {
	      var _this = this;

	      var reporter = _this._reporters[msg.body.to];
	      reporter._onForward(msg);
	    }

	    //FLOW-IN: message received from a remote Syncher -> create (this is actually an invitation to subscribe)

	  }, {
	    key: '_onRemoteCreate',
	    value: function _onRemoteCreate(msg) {
	      var _this = this;

	      //remove "/subscription" from the URL
	      var resource = msg.from.slice(0, -13);

	      var event = {
	        type: msg.type,
	        from: msg.body.source,
	        url: resource,
	        schema: msg.body.schema,
	        value: msg.body.value,
	        identity: msg.body.identity,

	        ack: function ack(type) {
	          var lType = 200;
	          if (type) {
	            lType = type;
	          }

	          //send ack response message
	          _this._bus.postMessage({
	            id: msg.id, type: 'response', from: msg.to, to: msg.from,
	            body: { code: lType }
	          });
	        }
	      };

	      if (_this._onNotificationHandler) {
	        console.info('[Syncher] NOTIFICATION-EVENT: ', event);
	        _this._onNotificationHandler(event);
	      }
	    }

	    //FLOW-IN: message received from a remote DataObjectReporter -> delete

	  }, {
	    key: '_onRemoteDelete',
	    value: function _onRemoteDelete(msg) {
	      var _this = this;

	      //remove "/subscription" from the URL
	      var resource = msg.body.resource;

	      var object = _this._observers[resource];
	      if (object) {
	        var event = {
	          type: msg.type,
	          url: resource,
	          identity: msg.body.identity,

	          ack: function ack(type) {
	            var lType = 200;
	            if (type) {
	              lType = type;
	            }

	            //TODO: any other different options for the release process, like accept but nor release local?
	            if (lType === 200) {
	              object.delete();
	            }

	            //send ack response message
	            _this._bus.postMessage({
	              id: msg.id, type: 'response', from: msg.to, to: msg.from,
	              body: { code: lType, source: _this._owner }
	            });
	          }
	        };

	        if (_this._onNotificationHandler) {
	          console.log('NOTIFICATION-EVENT: ', event);
	          _this._onNotificationHandler(event);
	        }
	      } else {
	        _this._bus.postMessage({
	          id: msg.id, type: 'response', from: msg.to, to: msg.from,
	          body: { code: 404, source: _this._owner }
	        });
	      }
	    }
	  }, {
	    key: 'owner',
	    get: function get() {
	      return this._owner;
	    }

	    /**
	    * All owned reporters, the ones that were created by a create
	    * @type {Object<URL, DataObjectReporter>}
	    */

	  }, {
	    key: 'reporters',
	    get: function get() {
	      return this._reporters;
	    }

	    /**
	    * All owned observers, the ones that were created by a local subscription
	    * @type {Object<URL, DataObjectObserver>}
	    */

	  }, {
	    key: 'observers',
	    get: function get() {
	      return this._observers;
	    }
	  }]);
	  return Syncher;
	}(); /**
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

	exports.default = Syncher;
	module.exports = exports['default'];

	/***/ }),
	/* 134 */,
	/* 135 */,
	/* 136 */,
	/* 137 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(10);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	 * @access private
	 * This class is responsible for collecting delta changes in remote objects, before the response of subscription reach the observer.
	 * It's used in Syncher -> subscribe. The flow is defined as:
	 * 1. (observer) --subscribe--> (reporter)
	 * 2. (observer) <--delta updates-- (reporter)
	 * 3. (observer) <--subscribe response-- (reporter)
	 * This means that there could be delta updates transferred before the subscription confirmation.
	 * Since there is no DataObjectObserver before the ubscription confirmation, there should be some other object collecting the updates.
	 * Provisional data is applied to the DataObjectObserver after confirmation. Or discarded if there is no confirmation.
	 */
	var DataProvisional = function () {
	  /* private
	  _childrenListeners: [MsgListener]
	  _listener: MsgListener
	   _changes: []
	  */

	  function DataProvisional(owner, url, bus, children) {
	    (0, _classCallCheck3.default)(this, DataProvisional);

	    var _this = this;

	    _this._owner = owner;
	    _this._url = url;
	    _this._bus = bus;
	    _this._children = children;

	    _this._changes = [];
	    _this._allocateListeners();
	  }

	  (0, _createClass3.default)(DataProvisional, [{
	    key: '_allocateListeners',
	    value: function _allocateListeners() {
	      var _this = this;

	      _this._listener = _this._bus.addListener(_this._url, function (msg) {
	        console.log('DataProvisional-' + _this._url + '-RCV: ', msg);
	        _this._changes.push(msg);
	      });

	      /*
	      _this._childrenListeners = [];
	      if (_this._children) {
	        let childBaseURL = url + '/children/';
	        _this._children.forEach((child) => {
	          let childURL = childBaseURL + child;
	          let listener = _this._bus.addListener(childURL, (msg) => {
	            //ignore msg sent by himself
	            if (msg.from !== owner) {
	              console.log(msg);
	            }
	          });
	           _this._childrenListeners.push(listener);
	        });
	      }*/
	    }
	  }, {
	    key: '_releaseListeners',
	    value: function _releaseListeners() {
	      var _this = this;

	      _this._listener.remove();

	      /*_this._childrenListeners.forEach((listener) => {
	        listener.remove();
	      });*/
	    }
	  }, {
	    key: 'apply',
	    value: function apply(observer) {
	      var _this = this;
	      _this._changes.forEach(function (change) {
	        observer._changeObject(observer._syncObj, change);
	      });
	    }
	  }, {
	    key: 'children',
	    get: function get() {
	      return this._children;
	    }
	  }]);
	  return DataProvisional;
	}();

	exports.default = DataProvisional;
	module.exports = exports['default'];

	/***/ }),
	/* 138 */,
	/* 139 */,
	/* 140 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(147), __esModule: true };

	/***/ }),
	/* 141 */,
	/* 142 */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(149), __esModule: true };

	/***/ }),
	/* 143 */,
	/* 144 */,
	/* 145 */,
	/* 146 */,
	/* 147 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(153);
	module.exports = __webpack_require__(0).Object.assign;

	/***/ }),
	/* 148 */,
	/* 149 */
	/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(155);
	var $Object = __webpack_require__(0).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

	/***/ }),
	/* 150 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(18)
	  , gOPS     = __webpack_require__(58)
	  , pIE      = __webpack_require__(41)
	  , toObject = __webpack_require__(32)
	  , IObject  = __webpack_require__(56)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(11)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

	/***/ }),
	/* 151 */,
	/* 152 */,
	/* 153 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(9);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(150)});

	/***/ }),
	/* 154 */,
	/* 155 */
	/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(13)
	  , $getOwnPropertyDescriptor = __webpack_require__(57).f;

	__webpack_require__(45)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

	/***/ }),
	/* 156 */,
	/* 157 */,
	/* 158 */,
	/* 159 */,
	/* 160 */,
	/* 161 */,
	/* 162 */,
	/* 163 */,
	/* 164 */,
	/* 165 */,
	/* 166 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DataObjectObserver = exports.DataObjectReporter = exports.Syncher = undefined;

	var _Syncher = __webpack_require__(133);

	var _Syncher2 = _interopRequireDefault(_Syncher);

	var _DataObjectReporter = __webpack_require__(121);

	var _DataObjectReporter2 = _interopRequireDefault(_DataObjectReporter);

	var _DataObjectObserver = __webpack_require__(120);

	var _DataObjectObserver2 = _interopRequireDefault(_DataObjectObserver);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Syncher = _Syncher2.default;
	exports.DataObjectReporter = _DataObjectReporter2.default;
	exports.DataObjectObserver = _DataObjectObserver2.default;

	/***/ })
	/******/ ]);
	});
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGQyNWQ5ZWFiM2RlYzJhMzNmYWZiP2VlNGMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanM/MjFhZiIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Rhc2suanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ludm9rZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm94eS1vYnNlcnZlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zeW5jaGVyL0RhdGFPYmplY3RPYnNlcnZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3luY2hlci9EYXRhT2JqZWN0UmVwb3J0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5bmNoZXIvRGF0YU9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3luY2hlci9EYXRhT2JqZWN0Q2hpbGQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5bmNoZXIvUHJveHlPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwid2VicGFjazovLy8uL3NyYy9zeW5jaGVyL1N5bmNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N5bmNoZXIvRGF0YVByb3Zpc2lvbmFsLmpzIiwid2VicGFjazovLy8uL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N5bmNoZXIuanMiXSwibmFtZXMiOlsiZGl2aWRlVVJMIiwiZGl2aWRlRW1haWwiLCJlbXB0eU9iamVjdCIsImRlZXBDbG9uZSIsImdldFVzZXJVUkxGcm9tRW1haWwiLCJnZXRVc2VyRW1haWxGcm9tVVJMIiwiY29udmVydFRvVXNlclVSTCIsInVybCIsIkVycm9yIiwicmVjdXJzZSIsInZhbHVlIiwicmVnZXgiLCJzdWJzdCIsInBhcnRzIiwicmVwbGFjZSIsInNwbGl0IiwiaW5jbHVkZXMiLCJyZXN1bHQiLCJ0eXBlIiwiZG9tYWluIiwiaWRlbnRpdHkiLCJjb25zb2xlIiwiZXJyb3IiLCJzY2hlbWUiLCJzdWJzdHIiLCJpbmRleE9mIiwiZW1haWwiLCJpbmRleE9mQXQiLCJ1c2VybmFtZSIsInN1YnN0cmluZyIsImxlbmd0aCIsIm9iamVjdCIsIm9iaiIsIkpTT04iLCJwYXJzZSIsInVzZXJFbWFpbCIsInVzZXJVUkwiLCJpZGVudGlmaWVyIiwiZGl2aWRlZFVSTCIsIkZpbHRlclR5cGUiLCJBTlkiLCJTVEFSVCIsIkVYQUNUIiwiRGF0YU9iamVjdE9ic2VydmVyIiwic3luY2hlciIsInNjaGVtYSIsImluaXRpYWxTdGF0dXMiLCJpbml0aWFsRGF0YSIsImNoaWxkcmVucyIsImluaXRpYWxWZXJzaW9uIiwibXV0dWFsIiwiZGF0YSIsIl90aGlzIiwiX3ZlcnNpb24iLCJfZmlsdGVycyIsIl9zeW5jT2JqIiwib2JzZXJ2ZSIsImV2ZW50IiwiX29uRmlsdGVyIiwiZm9yRWFjaCIsImNoaWxkSWQiLCJjaGlsZERhdGEiLCJfY2hpbGRyZW5PYmplY3RzIiwiX2FsbG9jYXRlTGlzdGVuZXJzIiwiX2NoYW5nZUxpc3RlbmVyIiwiX2J1cyIsImFkZExpc3RlbmVyIiwiX3VybCIsIm1zZyIsImxvZyIsIl9jaGFuZ2VPYmplY3QiLCJyZW1vdmUiLCJfcmVsZWFzZUxpc3RlbmVycyIsIl9zeW5jaGVyIiwiX29ic2VydmVycyIsInVuU3Vic2NyaWJlTXNnIiwiZnJvbSIsIl9vd25lciIsInRvIiwiX3N1YlVSTCIsImJvZHkiLCJyZXNvdXJjZSIsInBvc3RNZXNzYWdlIiwicmVwbHkiLCJjb2RlIiwiZmlsdGVyIiwiY2FsbGJhY2siLCJrZXkiLCJmaWx0ZXJPYmoiLCJpZHgiLCJmaWVsZCIsIkRhdGFPYmplY3RSZXBvcnRlciIsIl9zdWJzY3JpcHRpb25zIiwiX29uQ2hhbmdlIiwiX29iamVjdExpc3RlbmVyIiwiX29uUmVzcG9uc2UiLCJfb25SZWFkIiwib2JzZXJ2ZXJzIiwiaW52aXRlTXNnIiwicmVzdW1lIiwiX3NjaGVtYSIsImF1dGhvcmlzZSIsImRlbGV0ZU1zZyIsIl9yZXBvcnRlcnMiLCJfb25TdWJzY3JpcHRpb25IYW5kbGVyIiwiX29uUmVzcG9uc2VIYW5kbGVyIiwiX29uUmVhZEhhbmRsZXIiLCJfb25TdWJzY3JpYmUiLCJfb25VblN1YnNjcmliZSIsImh5cGVydHlVcmwiLCJhY2NlcHQiLCJzdWIiLCJzdGF0dXMiLCJjaGlsZHJlblZhbHVlcyIsInNlbmRNc2ciLCJpZCIsInZlcnNpb24iLCJoYXNPd25Qcm9wZXJ0eSIsIm11dHVhbEF1dGhlbnRpY2F0aW9uIiwiX211dHVhbEF1dGhlbnRpY2F0aW9uIiwicmVqZWN0IiwicmVhc29uIiwiZGVzYyIsIkRhdGFPYmplY3QiLCJfc3RhdHVzIiwiX2NoaWxkcmVucyIsIl9jaGlsZElkIiwiX2NoaWxkcmVuTGlzdGVuZXJzIiwiY2hpbGRCYXNlVVJMIiwiY2hpbGQiLCJjaGlsZFVSTCIsImxpc3RlbmVyIiwiX29uQ2hpbGRDcmVhdGUiLCJfY2hhbmdlQ2hpbGRyZW4iLCJwdXNoIiwiY2hpbGRyZW4iLCJtc2dDaGlsZElkIiwibXNnQ2hpbGRQYXRoIiwicmVxdWVzdE1zZyIsInJlc29sdmUiLCJtc2dJZCIsIm5ld0NoaWxkIiwib25DaGFuZ2UiLCJwYXRoIiwiX29uQWRkQ2hpbGRyZW5IYW5kbGVyIiwic2V0VGltZW91dCIsInNvdXJjZSIsImNoaWxkSW5mbyIsImNoYW5nZU1zZyIsImF0dHJpYnV0ZSIsIm9UeXBlIiwiT0JKRUNUIiwiY1R5cGUiLCJSRU1PVkUiLCJhdHRyaWJ1dGVUeXBlIiwiVVBEQVRFIiwib3BlcmF0aW9uIiwic3luY09iaiIsImZpbmRSZXN1bHQiLCJmaW5kQmVmb3JlIiwiQVJSQVkiLCJBREQiLCJhcnIiLCJpbmRleCIsImxhc3QiLCJBcnJheSIsInByb3RvdHlwZSIsInNwbGljZSIsImFwcGx5IiwiY29uY2F0IiwiRGF0YU9iamVjdENoaWxkIiwicGFyZW50Iiwib3duZXIiLCJfcGFyZW50IiwiX21zZ0lkIiwiX2xpc3RlbmVyIiwiX2NoaWxkcmVuIiwib2JqZWN0VHlwZSIsIlN5bmNPYmplY3QiLCJfZGF0YSIsIl9pbnRlcm5hbE9ic2VydmUiLCJsaXN0IiwiX2ZpbmRXaXRoU3BsaXQiLCJwb3AiLCJoYW5kbGVyIiwiY2hhbmdlc2V0IiwiZXZlcnkiLCJjaGFuZ2UiLCJfb25DaGFuZ2VzIiwiT2JqZWN0IiwiZGVlcE9ic2VydmUiLCJvYmpUeXBlIiwiY29uc3RydWN0b3IiLCJPYmplY3RUeXBlIiwiZmllbGRTdHJpbmciLCJrZXlwYXRoIiwibmV3VmFsdWUiLCJuYW1lIiwiX2ZpcmVFdmVudCIsIkNoYW5nZVR5cGUiLCJTeW5jaGVyIiwiYnVzIiwiY29uZmlnIiwicnVudGltZVVSTCIsIl9wcm92aXNpb25hbHMiLCJpbmZvIiwiX29uRm9yd2FyZCIsIl9vblJlbW90ZUNyZWF0ZSIsIl9vblJlbW90ZURlbGV0ZSIsInN0b3JlIiwicDJwIiwiY3JpdGVyaWEiLCJfY3JlYXRlIiwib2JqVVJMIiwiX3N1YnNjcmliZSIsIl9jcml0ZXJpYSIsInJlYWRNc2ciLCJfb25Ob3RpZmljYXRpb25IYW5kbGVyIiwicmVwb3J0ZXIiLCJuZXdPYmoiLCJjaGlsZHJlblJlc291cmNlcyIsInN1YnNjcmliZU1zZyIsIm5ld1Byb3Zpc2lvbmFsIiwic2xpY2UiLCJhY2siLCJsVHlwZSIsImRlbGV0ZSIsIkRhdGFQcm92aXNpb25hbCIsIl9jaGFuZ2VzIiwib2JzZXJ2ZXIiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxVQUFVLEVBQUU7QUFDOUMsbUJBQW1CLHNDQUFzQztBQUN6RCxDQUFDLG9DQUFvQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxXOzs7Ozs7OztBQ2hDRDtBQUNBOztBQUVBLDBDQUEwQyxpQ0FBb0MsRTs7Ozs7OztBQ0g5RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JEOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O1FBRVEzQixPO1FBQVM3RyxrQjtRQUFvQmhELGtCIiwiZmlsZSI6IlN5bmNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIlN5bmNoZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiU3luY2hlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJcIl0gPSByb290W1wiXCJdIHx8IHt9LCByb290W1wiXCJdW1wiU3luY2hlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNjYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQyNWQ5ZWFiM2RlYzJhMzNmYWZiIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkgMTAiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3NldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9jcmVhdGVcIik7XG5cbnZhciBfY3JlYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZSk7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyAodHlwZW9mIHN1cGVyQ2xhc3MgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKHN1cGVyQ2xhc3MpKSk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSAoMCwgX2NyZWF0ZTIuZGVmYXVsdCkoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCA/ICgwLCBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanNcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7ZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZ9KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeS5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qc1xuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGZhaWxzICAgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGV4ZWMpe1xuICB2YXIgZm4gID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG4gICAgLCBleHAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanNcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanNcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJ2YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwge3ZhbHVlOiB3a3NFeHQuZihuYW1lKX0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy1kZWZpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBjb3JlICA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKVxuICAsICRKU09OID0gY29yZS5KU09OIHx8IChjb3JlLkpTT04gPSB7c3RyaW5naWZ5OiBKU09OLnN0cmluZ2lmeX0pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiAkSlNPTi5zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3VtZW50cyk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnkuanNcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzXG4vLyBtb2R1bGUgaWQgPSA1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSA0IDUiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qc1xuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzXG4vLyBtb2R1bGUgaWQgPSA1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pdGVyYXRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvclwiKTtcblxudmFyIF9pdGVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pdGVyYXRvcik7XG5cbnZhciBfc3ltYm9sID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sXCIpO1xuXG52YXIgX3N5bWJvbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW1ib2wpO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIF9pdGVyYXRvcjIuZGVmYXVsdCA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9zeW1ib2wyLmRlZmF1bHQgJiYgb2JqICE9PSBfc3ltYm9sMi5kZWZhdWx0LnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIF90eXBlb2YoX2l0ZXJhdG9yMi5kZWZhdWx0KSA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qc1xuLy8gbW9kdWxlIGlkID0gNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanNcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qc1xuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzXG4vLyBtb2R1bGUgaWQgPSA2NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLmpzXG4vLyBtb2R1bGUgaWQgPSA2NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qc1xuLy8gbW9kdWxlIGlkID0gNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Rhc2suanNcbi8vIG1vZHVsZSBpZCA9IDY3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5c1wiKSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanNcbi8vIG1vZHVsZSBpZCA9IDcwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAyIDQgNSIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA3MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSA0IDUiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanNcbi8vIG1vZHVsZSBpZCA9IDcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanNcbi8vIG1vZHVsZSBpZCA9IDczXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA3NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzXG4vLyBtb2R1bGUgaWQgPSA3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDc2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gNzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGUoUCwgRCl7XG4gIHJldHVybiAkT2JqZWN0LmNyZWF0ZShQLCBEKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanNcbi8vIG1vZHVsZSBpZCA9IDc5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Qua2V5cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSA4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMiA0IDUiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanNcbi8vIG1vZHVsZSBpZCA9IDgxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5Qcm9taXNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qc1xuLy8gbW9kdWxlIGlkID0gODJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDgzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanNcbi8vIG1vZHVsZSBpZCA9IDg1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHJlc3VsdCAgICAgPSBnZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gcElFLmZcbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSA4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpXG4gICwgQlJFQUsgICAgICAgPSB7fVxuICAsIFJFVFVSTiAgICAgID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qc1xuLy8gbW9kdWxlIGlkID0gODdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW52b2tlLmpzXG4vLyBtb2R1bGUgaWQgPSA4OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSA0IDUiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qc1xuLy8gbW9kdWxlIGlkID0gODlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSA5MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qc1xuLy8gbW9kdWxlIGlkID0gOTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSA5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSA0IDUiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qc1xuLy8gbW9kdWxlIGlkID0gOTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZShoZWFkKXtcbiAgICAgIGZuICAgPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICBpZihoZWFkKW5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmKGlzTm9kZSl7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxuICB9IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICAgIHZhciB0b2dnbGUgPSB0cnVlXG4gICAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpe1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZH07XG4gICAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmKCFoZWFkKXtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanNcbi8vIG1vZHVsZSBpZCA9IDk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BOICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qc1xuLy8gbW9kdWxlIGlkID0gOTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjLCBzYWZlKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKXtcbiAgICBpZihzYWZlICYmIHRhcmdldFtrZXldKXRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS1hbGwuanNcbi8vIG1vZHVsZSBpZCA9IDk2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qc1xuLy8gbW9kdWxlIGlkID0gOTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qc1xuLy8gbW9kdWxlIGlkID0gOThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDk5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDQgNSIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jylcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7Y3JlYXRlOiByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyl9KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsICRnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRQcm90b3R5cGVPZicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCl7XG4gICAgcmV0dXJuICRnZXRQcm90b3R5cGVPZih0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qc1xuLy8gbW9kdWxlIGlkID0gMTAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsIi8vIDE5LjEuMi4xNCBPYmplY3Qua2V5cyhPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCAka2V5cyAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgna2V5cycsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KXtcbiAgICByZXR1cm4gJGtleXModG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanNcbi8vIG1vZHVsZSBpZCA9IDEwMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMiA0IDUiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXR9KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzXG4vLyBtb2R1bGUgaWQgPSAxMDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKClcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlICAgICA9ICRQcm9taXNlLnJlc29sdmUoMSlcbiAgICAgICwgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uKGV4ZWMpeyBleGVjKGVtcHR5LCBlbXB0eSk7IH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIGRvbWFpbiAgPSByZWFjdGlvbi5kb21haW5cbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spe1xuICAgICAgICAgICAgaWYocHJvbWlzZS5faCA9PSAyKW9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGhhbmRsZXIgPT09IHRydWUpcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBhYnJ1cHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmKGFicnVwdCl0aHJvdyBhYnJ1cHQuZXJyb3I7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICBpZihwcm9taXNlLl9oID09IDEpcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gICAgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCAgID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gW11cbiAgICAgICAgLCBpbmRleCAgICAgPSAwXG4gICAgICAgICwgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIHZhciAkaW5kZXggICAgICAgID0gaW5kZXgrK1xuICAgICAgICAgICwgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgNCA1IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDEwNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnb2JzZXJ2YWJsZScpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCIvKipcbiogQ29weXJpZ2h0IDIwMTYgUFQgSW5vdmHDp8OjbyBlIFNpc3RlbWFzIFNBXG4qIENvcHlyaWdodCAyMDE2IElORVNDLUlEXG4qIENvcHlyaWdodCAyMDE2IFFVT0JJUyBORVRXT1JLUyBTTFxuKiBDb3B5cmlnaHQgMjAxNiBGUkFVTkhPRkVSLUdFU0VMTFNDSEFGVCBaVVIgRk9FUkRFUlVORyBERVIgQU5HRVdBTkRURU4gRk9SU0NIVU5HIEUuVlxuKiBDb3B5cmlnaHQgMjAxNiBPUkFOR0UgU0FcbiogQ29weXJpZ2h0IDIwMTYgRGV1dHNjaGUgVGVsZWtvbSBBR1xuKiBDb3B5cmlnaHQgMjAxNiBBcGl6ZWVcbiogQ29weXJpZ2h0IDIwMTYgVEVDSE5JU0NIRSBVTklWRVJTSVRBVCBCRVJMSU5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKiovXG4vKipcbiAqIFN1cHBvcnQgbW9kdWxlIHdpdGggc29tZSBmdW5jdGlvbnMgd2lsbCBiZSB1c2VmdWxcbiAqIEBtb2R1bGUgdXRpbHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIGRpdmlkZVVSTFxuICogQHR5cGUgT2JqZWN0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBvZiBVUkxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBvZiBVUkxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZGVudGl0eSBUaGUgaWRlbnRpdHkgb2YgVVJMXG4gKi9cblxuLyoqXG4gKiBEaXZpZGUgYW4gdXJsIGluIHR5cGUsIGRvbWFpbiBhbmQgaWRlbnRpdHlcbiAqIEBwYXJhbSAge1VSTC5VUkx9IHVybCAtIHVybCBhZGRyZXNzXG4gKiBAcmV0dXJuIHtkaXZpZGVVUkx9IHRoZSByZXN1bHQgb2YgZGl2aWRlVVJMXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXZpZGVVUkwodXJsKSB7XG5cbiAgaWYgKCF1cmwpIHRocm93IEVycm9yKCdVUkwgaXMgbmVlZGVkIHRvIHNwbGl0Jyk7XG5cblx0ZnVuY3Rpb24gcmVjdXJzZSh2YWx1ZSkge1xuXHRcdGNvbnN0IHJlZ2V4ID0gLyhbYS16QS1aLV0qKSg6XFwvXFwvKD86XFwuKT98OikoWy1hLXpBLVowLTlAOiUuX1xcK34jPV17MiwyNTZ9KShbLWEtekEtWjAtOUA6JS5fXFwrfiM9XFwvXSopL2dpO1xuICAgIGNvbnN0IHN1YnN0ID0gJyQxLCQzLCQ0Jztcblx0ICBsZXQgcGFydHMgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCBzdWJzdCkuc3BsaXQoJywnKTtcblx0XHRyZXR1cm4gcGFydHM7XG5cdH1cblxuXHRsZXQgcGFydHMgPSByZWN1cnNlKHVybCk7XG5cbiAgLy8gSWYgdGhlIHVybCBoYXMgbm8gc2NoZW1lXG4gIGlmIChwYXJ0c1swXSA9PT0gdXJsICYmICFwYXJ0c1swXS5pbmNsdWRlcygnQCcpKSB7XG5cbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgdHlwZTogXCJcIixcbiAgICAgIGRvbWFpbjogdXJsLFxuICAgICAgaWRlbnRpdHk6IFwiXCJcbiAgICB9O1xuXG4gICAgY29uc29sZS5lcnJvcignW0RpdmlkZVVSTF0gRGl2aWRlVVJMIGRvblxcJ3Qgc3VwcG9ydCB1cmwgd2l0aG91dCBzY2hlbWUuIFBsZWFzZSByZXZpZXcgeW91ciB1cmwgYWRkcmVzcycsIHVybCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cblx0Ly8gY2hlY2sgaWYgdGhlIHVybCBoYXMgdGhlIHNjaGVtZSBhbmQgaW5jbHVkZXMgYW4gQFxuXHRpZiAocGFydHNbMF0gPT09IHVybCAmJiBwYXJ0c1swXS5pbmNsdWRlcygnQCcpKSB7XG5cdFx0bGV0IHNjaGVtZSA9IHBhcnRzWzBdID09PSB1cmwgPyAnc210cCcgOiBwYXJ0c1swXTtcblx0XHRwYXJ0cyA9IHJlY3Vyc2Uoc2NoZW1lICsgJzovLycgKyBwYXJ0c1swXSk7XG5cdH1cblxuXHQvLyBpZiB0aGUgZG9tYWluIGluY2x1ZGVzIGFuIEAsIGRpdmlkZSBpdCB0byBkb21haW4gYW5kIGlkZW50aXR5IHJlc3BlY3RpdmVseVxuXHRpZiAocGFydHNbMV0uaW5jbHVkZXMoJ0AnKSkge1xuXHRcdHBhcnRzWzJdID0gcGFydHNbMF0gKyAnOi8vJyArIHBhcnRzWzFdO1xuXHRcdHBhcnRzWzFdID0gcGFydHNbMV0uc3Vic3RyKHBhcnRzWzFdLmluZGV4T2YoJ0AnKSArIDEpXG4gICAgfSBcdC8qZWxzZSBpZiAocGFydHNbMl0uaW5jbHVkZXMoJy8nKSkge1xuICAgIHBhcnRzWzJdID0gcGFydHNbMl0uc3Vic3RyKHBhcnRzWzJdLmxhc3RJbmRleE9mKCcvJykrMSk7XG4gIH0qL1xuXG4gIGxldCByZXN1bHQgPSB7XG4gICAgdHlwZTogcGFydHNbMF0sXG4gICAgZG9tYWluOiBwYXJ0c1sxXSxcbiAgICBpZGVudGl0eTogcGFydHNbMl1cbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGl2aWRlRW1haWwoZW1haWwpIHtcbiAgbGV0IGluZGV4T2ZBdCA9IGVtYWlsLmluZGV4T2YoJ0AnKTtcblxuICBsZXQgcmVzdWx0ID0ge1xuICAgIHVzZXJuYW1lOiBlbWFpbC5zdWJzdHJpbmcoMCwgaW5kZXhPZkF0KSxcbiAgICBkb21haW46IGVtYWlsLnN1YnN0cmluZyhpbmRleE9mQXQgKyAxLCBlbWFpbC5sZW5ndGgpXG4gIH07XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBPYmplY3QgaXMgZW1wdHlcbiAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0IE9iamVjdCB0byBiZSBjaGVja2VkXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICBzdGF0dXMgb2YgT2JqZWN0LCBlbXB0eSBvciBub3QgKHRydWV8ZmFsc2UpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aCA+IDAgPyBmYWxzZSA6IHRydWU7XG59XG5cbi8qKlxuICogTWFrZSBhIENPUFkgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiAtIG9iamVjdCB0byBiZSBjbG9uZWRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZShvYmopIHtcbiAgLy9UT0RPOiBzaW1wbGUgYnV0IGluZWZmaWNpZW50IEpTT04gZGVlcCBjbG9uZS4uLlxuICBpZiAob2JqKSByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuLyoqXG4gKiBPYnRhaW5zIHRoZSB1c2VyIFVSTCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEgZ2l2ZW4gZW1haWxcbiAqIEBwYXJhbSAge3N0cmluZ30gdXNlckVtYWlsIFRoZSB1c2VyIGVtYWlsXG4gKiBAcmV0dXJuIHtVUkwuVVJMfSB1c2VyVVJMIFRoZSB1c2VyIFVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlclVSTEZyb21FbWFpbCh1c2VyRW1haWwpIHtcbiAgbGV0IGluZGV4T2ZBdCA9IHVzZXJFbWFpbC5pbmRleE9mKCdAJyk7XG4gIHJldHVybiAndXNlcjovLycgKyB1c2VyRW1haWwuc3Vic3RyaW5nKGluZGV4T2ZBdCArIDEsIHVzZXJFbWFpbC5sZW5ndGgpICsgJy8nICsgdXNlckVtYWlsLnN1YnN0cmluZygwLCBpbmRleE9mQXQpO1xufVxuXG4vKipcbiAqIE9idGFpbnMgdGhlIHVzZXIgZW1haWwgdGhhdCBjb3JyZXNwb25kcyB0byBhIGdpdmVuIFVSTFxuICogQHBhcmFtICB7VVJMLlVSTH0gdXNlclVSTCBUaGUgdXNlciBVUkxcbiAqIEByZXR1cm4ge3N0cmluZ30gdXNlckVtYWlsIFRoZSB1c2VyIGVtYWlsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VyRW1haWxGcm9tVVJMKHVzZXJVUkwpIHtcbiAgbGV0IHVybCA9IGRpdmlkZVVSTCh1c2VyVVJMKTtcbiAgcmV0dXJuIHVybC5pZGVudGl0eS5yZXBsYWNlKCcvJywgJycpICsgJ0AnICsgdXJsLmRvbWFpbjsgLy8gaWRlbnRpdHkgZmllbGQgaGFzICcvZXhhbXBsZUlEJyBpbnN0ZWFkIG9mICdleGFtcGxlSUQnXG59XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdXNlciBpZGVudGlmaWVyIGlzIGFscmVhZHkgaW4gdGhlIFVSTCBmb3JtYXQsIGlmIG5vdCwgY29udmVydCB0byBVUkwgZm9ybWF0XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgaWRlbnRpZmllciAgdXNlciBpZGVudGlmaWVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgdXNlclVSTCAgICB0aGUgdXNlciBVUkxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1VzZXJVUkwoaWRlbnRpZmllcikge1xuXG4gIC8vIGNoZWNrIGlmIHRoZSBpZGVudGlmaWVyIGlzIGFscmVhZHkgaW4gdGhlIHVybCBmb3JtYXRcbiAgaWYgKGlkZW50aWZpZXIuc3Vic3RyaW5nKDAsIDcpID09PSAndXNlcjovLycpIHtcbiAgICBsZXQgZGl2aWRlZFVSTCA9IGRpdmlkZVVSTChpZGVudGlmaWVyKTtcblxuICAgIC8vY2hlY2sgaWYgdGhlIHVybCBpcyB3ZWxsIGZvcm1hdGVkXG4gICAgaWYgKGRpdmlkZWRVUkwuZG9tYWluICYmIGRpdmlkZWRVUkwuaWRlbnRpdHkpIHtcbiAgICAgIHJldHVybiBpZGVudGlmaWVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAndXNlclVSTCB3aXRoIHdyb25nIGZvcm1hdCc7XG4gICAgfVxuXG4gIC8vaWYgbm90LCBjb252ZXJ0IHRoZSB1c2VyIGVtYWlsIHRvIFVSTCBmb3JtYXRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0VXNlclVSTEZyb21FbWFpbChpZGVudGlmaWVyKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzL3V0aWxzLmpzIiwiLy8gICAgIHByb3h5LW9ic2VydmUgdjAuMC4xOFxyXG4vLyAgICAgQ29weXJpZ2h0IChjKSAyMDE1LCAyMDE2IFNpbW9uIFkuIEJsYWNrd2VsbCwgQW55V2hpY2hXYXlcclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG4oZnVuY3Rpb24oKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0Ly8gQ3JlYXRlcyBhbmQgcmV0dXJucyBhIFByb3h5IHdyYXBwaW5nIGEgdGFyZ2V0IHNvIHRoYXQgYWxsIGNoYW5nZXMgY2FuIGJlIHRyYXBwZWQgYW5kIGZvcndhcmRlZCB0b1xyXG5cdC8vIGEgY2FsbGJhY2suIFRoZSBjYWxsYmFjayB0YWtlcyBhbiBhcnJheSBvZiBjaGFuZ2VzIGp1c3QgbGlrZSB0aGUgdHJhZGl0aW9uYWwgb3JpZ2luYWwgQ2hyb21lIE9iamVjdC5vYnNlcnZlXHJcblx0Ly8ge29iamVjdDo8b2JqZWN0IGNoYW5nZWQ+LG5hbWU6PGZpZWxkIGNoYW5nZWQ+LHR5cGU6YWRkfHVwZGF0ZXxkZWxldGV8cmVjb25maWd1cmV8cHJldmVudEV4dGVuc2lvbnN8c2V0UHJvdG90eXBlLG9sZFZhbHVlOjxvbGQgdmFsdWUgaWYgdXBkYXRlIHwgZGVsZXRlPn1cclxuXHQvLyBUaGUgYWNjZXB0bGlzdCBjYW4gYmUgYWRkfHVwZGF0ZXxkZWxldGV8cmVjb25maWd1cmV8cHJldmVudEV4dGVuc2lvbnN8c2V0UHJvdG90eXBlLlxyXG5cdC8vIHYgMC4wLjEwIHRvIHN1cHBvcnQgcGF1c2luZyBhbmQgcmVzdGFydGluZyBvYnNlcnZhdGlvbiB0d28gYWRkaXRpb25hbCBjb25zdHJ1Y3RvciBhcmd1bWVudHMgYXJlIGF2YWlsYWJsZSB0byBPYmplY3Qub2JzZXJ2ZTpcclxuXHQvLyBwYXVzYWJsZSAtIGNyZWF0ZSB0aGUgT2JzZXJ2ZXIgc28gaXQgY2FuIGJlIHBhdXNlZFxyXG5cdC8vIHBhdXNlIC0gY3JlYXRlIG9ic2VydmVyIGluIHBhdXNlZCBzdGF0ZVxyXG5cdC8vIGlmIHBhdXNhYmxlIGlzIHRydWUgdGhlbiBhbiBhZGRpdGlvbmFsIG1ldGhvZCBkZWxpdmVyKGlnbm9yZVByZXZpb3VzKSBpcyBhdmFpbGFibGUgdG8gc3RhcnQgZGVsaXZlcnlcclxuXHQvLyB0byBwYXVzZSBkZWxpdmVyeSBzZXQgYSBwcm9wZXJ0eSBjYWxsZWQgcGF1c2Ugb24gdGhlIGZ1bmN0aW9uIGRlbGl2ZXIgdG8gdHJ1ZVxyXG5cdC8vIHBhdXNhYmxlIGlzIG9wdGlvbmFsIHRvIHJlZHVjZSB0aGUgY2hhbmNlIG9mIHNoYWRvd2luZyBhIHByb3BlcnR5IG9yIG1ldGhvZCBvbiBhbnkgZXhpc3RpbmcgY29kZSBjYWxsZWQgZGVsaXZlclxyXG5cdGlmKCFPYmplY3Qub2JzZXJ2ZSAmJiB0eXBlb2YoUHJveHkpPT09XCJmdW5jdGlvblwiKSB7XHJcblx0XHRmdW5jdGlvbiBPYnNlcnZlcih0YXJnZXQsY2FsbGJhY2ssYWNjZXB0bGlzdCxwYXVzYWJsZSxwYXVzZSxkZWxheSkge1xyXG5cdCAgICBcdHZhciBtZSA9IHRoaXMsIHByb3h5O1xyXG5cdCAgICBcdGZ1bmN0aW9uIGRlbGl2ZXIoaWdub3JlUHJldmlvdXMsZGVsYXkpIHtcclxuXHQgICAgXHRcdGRlbGl2ZXIuZGVsYXkgPSBkZWxheTtcclxuXHQgICAgXHRcdGlmKCFkZWxpdmVyLnBhdXNlKSB7XHJcblx0ICAgICAgICBcdFx0aWYobWUuY2hhbmdlc2V0Lmxlbmd0aD4wKSB7XHJcblx0ICAgICAgICBcdFx0XHRpZighaWdub3JlUHJldmlvdXMpIHtcclxuXHRcdCAgICBcdCAgICBcdFx0dmFyIGNoYW5nZXMgPSBtZS5jaGFuZ2VzZXQuZmlsdGVyKGZ1bmN0aW9uKGNoYW5nZSkgeyByZXR1cm4gIWFjY2VwdGxpc3QgfHwgYWNjZXB0bGlzdC5pbmRleE9mKGNoYW5nZS50eXBlKT49MDsgfSk7XHJcblx0XHQgICAgICAgIFx0XHRcdGlmKGNoYW5nZXMubGVuZ3RoPjApIHtcclxuXHRcdCAgICAgICAgXHRcdFx0XHRjYWxsYmFjayhjaGFuZ2VzKTtcclxuXHRcdCAgICAgICAgXHRcdFx0fVxyXG5cdCAgICAgICAgXHRcdFx0fVxyXG5cdCAgICAgICAgXHRcdFx0bWUuY2hhbmdlc2V0ID0gW107XHJcblx0ICAgICAgICBcdFx0fVxyXG5cdCAgICBcdFx0fVxyXG5cdCAgICBcdH1cclxuXHQgICAgXHRkZWxpdmVyLnBhdXNlID0gcGF1c2U7XHJcblx0ICAgIFx0ZGVsaXZlci5kZWxheSA9IGRlbGF5O1xyXG5cdFx0ICAgIG1lLmdldCA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHkpIHtcclxuXHRcdCAgICBcdGlmKHByb3BlcnR5PT09XCJfX29ic2VydmVyX19cIikge1xyXG5cdFx0ICAgIFx0XHRyZXR1cm4gbWU7XHJcblx0XHQgICAgXHR9XHJcblx0XHQgICAgXHRpZihwcm9wZXJ0eT09PVwidW5vYnNlcnZlXCIpIHtcclxuXHRcdCAgICBcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgIFx0XHRcdE9iamVjdC51bm9ic2VydmUodGFyZ2V0KTtcclxuXHRcdCAgICBcdFx0XHRyZXR1cm4gdGFyZ2V0O1xyXG5cdFx0ICAgIFx0XHR9O1xyXG5cdFx0ICAgIFx0fVxyXG5cdFx0ICAgIFx0aWYocHJvcGVydHk9PT1cImRlbGl2ZXJcIikge1xyXG5cdFx0ICAgIFx0XHRyZXR1cm4gZGVsaXZlcjtcclxuXHRcdCAgICBcdH1cclxuXHRcdCAgICBcdHJldHVybiB0YXJnZXRbcHJvcGVydHldO1xyXG5cdFx0ICAgIH1cclxuXHQgICAgXHRtZS50YXJnZXQgPSB0YXJnZXQ7XHJcblx0ICAgIFx0bWUuY2hhbmdlc2V0ID0gW107XHJcblx0ICAgIFx0aWYoIW1lLnRhcmdldC5fX29ic2VydmVyQ2FsbGJhY2tzX18pIHtcclxuXHQgICAgXHRcdC8vIF9fb2JzZXJ2ZXJDYWxsYmFja3NfXyBpcyB1c2VkIGFzIGFuIGluZGV4IHRvIGdldCBhdCB0aGUgcHJveHkgd2hpY2ggaXMgdGhlIG9ic2VydmVyLCBzbyB3ZSBjYW4gdW5vYnNlcnZlXHJcblx0ICAgIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LFwiX19vYnNlcnZlckNhbGxiYWNrc19fXCIse2VudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOnRydWUsd3JpdGFibGU6ZmFsc2UsdmFsdWU6W119KTtcclxuXHQgICAgXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsXCJfX29ic2VydmVyc19fXCIse2VudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOnRydWUsd3JpdGFibGU6ZmFsc2UsdmFsdWU6W119KTtcclxuXHQgICAgXHR9XHJcblx0ICAgIFx0bWUudGFyZ2V0Ll9fb2JzZXJ2ZXJDYWxsYmFja3NfXy5wdXNoKGNhbGxiYWNrKTtcclxuXHQgICAgXHRtZS50YXJnZXQuX19vYnNlcnZlcnNfXy5wdXNoKHRoaXMpO1xyXG5cdCAgICBcdHByb3h5ID0gbmV3IFByb3h5KHRhcmdldCxtZSk7XHJcblx0ICAgIFx0ZGVsaXZlcihmYWxzZSxkZWxheSk7XHJcblx0ICAgIFx0cmV0dXJuIHByb3h5O1xyXG5cdCAgICB9XHJcblx0XHRPYnNlcnZlci5wcm90b3R5cGUuZGVsaXZlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQobnVsbCxcImRlbGl2ZXJcIik7XHJcblx0XHR9XHJcblx0ICAgIE9ic2VydmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkgeyAvLyAsIHJlY2VpdmVyXHJcblx0ICAgIFx0dmFyIG9sZHZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5XTtcclxuXHQgICAgXHR2YXIgdHlwZSA9IChvbGR2YWx1ZT09PXVuZGVmaW5lZCA/IFwiYWRkXCIgOiBcInVwZGF0ZVwiKTtcclxuXHQgICAgXHR0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XHJcblx0ICAgIFx0aWYodGFyZ2V0Ll9fb2JzZXJ2ZXJzX18uaW5kZXhPZih0aGlzKT49MCAmJiAoIXRoaXMuYWNjZXB0bGlzdCB8fCB0aGlzLmFjY2VwdGxpc3QuaW5kZXhPZih0eXBlKT49MCkpIHtcclxuXHQgICAgICAgIFx0dmFyIGNoYW5nZSA9IHtvYmplY3Q6dGFyZ2V0LG5hbWU6cHJvcGVydHksdHlwZTp0eXBlfSxcclxuXHQgICAgICAgIFx0XHRzdGFydCA9IHRoaXMuY2hhbmdlc2V0Lmxlbmd0aCA9PT0gMCxcclxuXHQgICAgICAgIFx0XHRkZWxpdmVyID0gdGhpcy5kZWxpdmVyKCk7XHJcblx0ICAgICAgICBcdGlmKHR5cGU9PT1cInVwZGF0ZVwiKSB7XHJcblx0ICAgICAgICBcdFx0Y2hhbmdlLm9sZFZhbHVlID0gb2xkdmFsdWU7XHJcblx0ICAgICAgICBcdH1cclxuXHQgICAgICAgIFx0dGhpcy5jaGFuZ2VzZXQucHVzaChjaGFuZ2UpO1xyXG5cdCAgICAgICAgXHRpZihzdGFydCkge1xyXG5cdCAgICAgICAgXHRcdGRlbGl2ZXIoZmFsc2UsKHR5cGVvZihkZWxpdmVyLmRlbGF5KT09PVwibnVtYmVyXCIgPyBkZWxpdmVyLmRlbGF5IDogMTApKTtcclxuXHQgICAgICAgIFx0fVxyXG5cdCAgICBcdH1cclxuXHQgICAgXHRyZXR1cm4gdHJ1ZTtcclxuXHQgICAgfTtcclxuXHQgICAgT2JzZXJ2ZXIucHJvdG90eXBlLmRlbGV0ZVByb3BlcnR5ID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eSkge1xyXG5cdCAgICBcdHZhciBvbGR2YWx1ZSA9IHRhcmdldFtwcm9wZXJ0eV07XHJcblx0ICAgIFx0Ly9pZih0eXBlb2Yob2xkdmFsdWUpIT09XCJ1bmRlZmluZWRcIikge1xyXG5cdFx0ICAgIFx0ZGVsZXRlIHRhcmdldFtwcm9wZXJ0eV07XHJcblx0XHQgICAgXHRpZih0YXJnZXQuX19vYnNlcnZlcnNfXy5pbmRleE9mKHRoaXMpPj0wICYmICF0aGlzLmFjY2VwdGxpc3QgfHwgdGhpcy5hY2NlcHRsaXN0LmluZGV4T2YoXCJkZWxldGVcIik+PTApIHtcclxuXHRcdCAgICAgICAgXHR2YXIgY2hhbmdlID0ge29iamVjdDp0YXJnZXQsbmFtZTpwcm9wZXJ0eSx0eXBlOlwiZGVsZXRlXCIsb2xkVmFsdWU6b2xkdmFsdWV9LFxyXG5cdFx0ICAgICAgICBcdFx0c3RhcnQgPSB0aGlzLmNoYW5nZXNldC5sZW5ndGggPT09IDAsXHJcblx0XHQgICAgICAgIFx0XHRkZWxpdmVyID0gdGhpcy5kZWxpdmVyKCk7XHJcblx0XHQgICAgICAgIFx0dGhpcy5jaGFuZ2VzZXQucHVzaChjaGFuZ2UpO1xyXG5cdFx0ICAgICAgICBcdGlmKHN0YXJ0KSB7XHJcblx0XHQgICAgICAgIFx0XHRkZWxpdmVyKGZhbHNlLCh0eXBlb2YoZGVsaXZlci5kZWxheSk9PT1cIm51bWJlclwiID8gZGVsaXZlci5kZWxheSA6IDEwKSk7XHJcblx0XHQgICAgICAgIFx0fVxyXG5cdFx0ICAgIFx0fVxyXG5cdCAgICBcdC8vfVxyXG5cdCAgICBcdHJldHVybiB0cnVlO1xyXG5cdCAgICB9O1xyXG5cdCAgICBPYnNlcnZlci5wcm90b3R5cGUuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblx0ICAgIFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIGRlc2NyaXB0b3IpO1xyXG5cdCAgICBcdGlmKHRhcmdldC5fX29ic2VydmVyc19fLmluZGV4T2YodGhpcyk+PTAgJiYgIXRoaXMuYWNjZXB0bGlzdCB8fCB0aGlzLmFjY2VwdGxpc3QuaW5kZXhPZihcInJlY29uZmlndXJlXCIpPj0wKSB7XHJcblx0ICAgICAgICBcdHZhciBjaGFuZ2UgPSB7b2JqZWN0OnRhcmdldCxuYW1lOnByb3BlcnR5LHR5cGU6XCJyZWNvbmZpZ3VyZVwifSxcclxuICAgICAgICBcdFx0XHRzdGFydCA9IHRoaXMuY2hhbmdlc2V0Lmxlbmd0aCA9PT0gMCxcclxuICAgICAgICBcdFx0XHRkZWxpdmVyID0gdGhpcy5kZWxpdmVyKCk7XHJcblx0ICAgICAgICBcdHRoaXMuY2hhbmdlc2V0LnB1c2goY2hhbmdlKTtcclxuXHQgICAgICAgIFx0aWYoc3RhcnQpIHtcclxuXHQgICAgICAgIFx0XHRkZWxpdmVyKGZhbHNlLCh0eXBlb2YoZGVsaXZlci5kZWxheSk9PT1cIm51bWJlclwiID8gZGVsaXZlci5kZWxheSA6IDEwKSk7XHJcblx0ICAgICAgICBcdH1cclxuXHQgICAgXHR9XHJcblx0ICAgIFx0cmV0dXJuIHRydWU7XHJcblx0ICAgIH07XHJcblx0ICAgIE9ic2VydmVyLnByb3RvdHlwZS5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvdG90eXBlKSB7XHJcblx0ICAgIFx0dmFyIG9sZHZhbHVlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XHJcblx0ICAgIFx0T2JqZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG90eXBlKTtcclxuXHQgICAgXHRpZih0YXJnZXQuX19vYnNlcnZlcnNfXy5pbmRleE9mKHRoaXMpPj0wICYmICF0aGlzLmFjY2VwdGxpc3QgfHwgdGhpcy5hY2NlcHRsaXN0LmluZGV4T2YoXCJzZXRQcm90b3R5cGVcIik+PTApIHtcclxuXHQgICAgICAgIFx0dmFyIGNoYW5nZSA9IHtvYmplY3Q6dGFyZ2V0LG5hbWU6XCJfX3Byb3RvX19cIix0eXBlOlwic2V0UHJvdG90eXBlXCIsb2xkVmFsdWU6b2xkdmFsdWV9LFxyXG4gICAgXHRcdFx0XHRzdGFydCA9IHRoaXMuY2hhbmdlc2V0Lmxlbmd0aCA9PT0gMCxcclxuICAgIFx0XHRcdFx0ZGVsaXZlciA9IHRoaXMuZGVsaXZlcigpO1xyXG5cdCAgICAgICAgXHR0aGlzLmNoYW5nZXNldC5wdXNoKGNoYW5nZSk7XHJcblx0ICAgICAgICBcdGlmKHN0YXJ0KSB7XHJcblx0ICAgICAgICBcdFx0ZGVsaXZlcihmYWxzZSwodHlwZW9mKGRlbGl2ZXIuZGVsYXkpPT09XCJudW1iZXJcIiA/IGRlbGl2ZXIuZGVsYXkgOiAxMCkpO1xyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgIFx0fVxyXG5cdCAgICBcdHJldHVybiB0cnVlO1xyXG5cdCAgICB9O1xyXG5cdCAgICBPYnNlcnZlci5wcm90b3R5cGUucHJldmVudEV4dGVuc2lvbnMgPSBmdW5jdGlvbih0YXJnZXQpIHtcclxuXHQgICAgICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpO1xyXG5cdCAgICBcdGlmKHRhcmdldC5fX29ic2VydmVyc19fLmluZGV4T2YodGhpcyk+PTAgJiYgIXRoaXMuYWNjZXB0bGlzdCB8fCB0aGlzLmFjY2VwdGxpc3QuaW5kZXhPZihcInByZXZlbnRFeHRlbnNpb25zXCIpPj0wKSB7XHJcblx0ICAgICAgICBcdHZhciBjaGFuZ2UgPSB7b2JqZWN0OnRhcmdldCx0eXBlOlwicHJldmVudEV4dGVuc2lvbnNcIn0sXHJcblx0XHRcdFx0XHRzdGFydCA9IHRoaXMuY2hhbmdlc2V0Lmxlbmd0aCA9PT0gMCxcclxuXHRcdFx0XHRcdGRlbGl2ZXIgPSB0aGlzLmRlbGl2ZXIoKTtcclxuXHQgICAgICAgIFx0dGhpcy5jaGFuZ2VzZXQucHVzaChjaGFuZ2UpO1xyXG5cdCAgICAgICAgXHRpZihzdGFydCkge1xyXG5cdCAgICAgICAgXHRcdGRlbGl2ZXIoZmFsc2UsKHR5cGVvZihkZWxpdmVyLmRlbGF5KT09PVwibnVtYmVyXCIgPyBkZWxpdmVyLmRlbGF5IDogMTApKTtcclxuXHQgICAgICAgIFx0fVxyXG5cdCAgICBcdH1cclxuXHQgICAgXHRyZXR1cm4gdHJ1ZTtcclxuXHQgICAgfTtcclxuXHQgICAgT2JqZWN0Lm9ic2VydmUgPSBmdW5jdGlvbihvYmplY3QsY2FsbGJhY2ssYWNjZXB0bGlzdCxwYXVzYWJsZSxwYXVzZSxkZWxheSkge1xyXG5cdCAgICBcdHJldHVybiBuZXcgT2JzZXJ2ZXIob2JqZWN0LGNhbGxiYWNrLGFjY2VwdGxpc3QscGF1c2FibGUscGF1c2UsZGVsYXkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBPYmplY3QudW5vYnNlcnZlID0gZnVuY3Rpb24ob2JqZWN0LGNhbGxiYWNrKSB7XHJcblx0ICAgIFx0aWYob2JqZWN0Ll9fb2JzZXJ2ZXJDYWxsYmFja3NfXykge1xyXG5cdCAgICBcdFx0aWYoIWNhbGxiYWNrKSB7XHJcblx0ICAgIFx0XHRcdG9iamVjdC5fX29ic2VydmVyQ2FsbGJhY2tzX18uc3BsaWNlKDAsb2JqZWN0Ll9fb2JzZXJ2ZXJDYWxsYmFja3NfXy5sZW5ndGgpO1xyXG5cdCAgICBcdFx0XHRvYmplY3QuX19vYnNlcnZlcnNfXy5zcGxpY2UoMCxvYmplY3QuX19vYnNlcnZlcnNfXy5sZW5ndGgpO1xyXG5cdCAgICBcdFx0XHRyZXR1cm47XHJcblx0ICAgIFx0XHR9XHJcblx0ICAgIFx0XHRvYmplY3QuX19vYnNlcnZlckNhbGxiYWNrc19fLmZvckVhY2goZnVuY3Rpb24ob2JzZXJ2ZXJjYWxsYmFjayxpKSB7XHJcblx0ICAgIFx0XHRcdGlmKGNhbGxiYWNrPT09b2JzZXJ2ZXJjYWxsYmFjaykge1xyXG5cdCAgICBcdFx0XHRcdG9iamVjdC5fX29ic2VydmVyQ2FsbGJhY2tzX18uc3BsaWNlKGksMSk7XHJcblx0ICAgIFx0XHRcdFx0ZGVsZXRlIG9iamVjdC5fX29ic2VydmVyc19fW2ldLmNhbGxiYWNrO1xyXG5cdCAgICBcdFx0XHRcdG9iamVjdC5fX29ic2VydmVyc19fLnNwbGljZShpLDEpO1xyXG5cdCAgICBcdFx0XHR9XHJcblx0ICAgIFx0XHR9KTtcclxuXHQgICAgXHR9XHJcblx0ICAgIH07XHJcblx0ICAgIEFycmF5Lm9ic2VydmUgPSBmdW5jdGlvbihvYmplY3QsY2FsbGJhY2ssYWNjZXB0bGlzdCxwYXVzYWJsZSxwYXVzZSxkZWxheSkge1xyXG5cdCAgICBcdGlmKCEob2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpICYmICFBcnJheS5pc0FycmF5KG9iamVjdCkpIHtcclxuXHQgICAgXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCB0byBBcnJheS5vYnNlcnZlciBpcyBub3QgYW4gQXJyYXlcIik7XHJcblx0ICAgIFx0fVxyXG4gICAgICAgICAgICBcdGFjY2VwdGxpc3QgPSBhY2NlcHRsaXN0IHx8IFtcImFkZFwiLCBcInVwZGF0ZVwiLCBcImRlbGV0ZVwiLCBcInNwbGljZVwiXTtcclxuXHQgICAgXHR2YXIgYXJyYXlwcm94eSA9IG5ldyBQcm94eShvYmplY3Qse2dldDogZnVuY3Rpb24odGFyZ2V0LHByb3BlcnR5KSB7XHJcblx0ICAgIFx0XHRpZihwcm9wZXJ0eT09PVwidW5vYnNlcnZlXCIpIHtcclxuXHRcdCAgICBcdFx0cmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHQgICAgXHRcdFx0aWYoY2FsbGJhY2spIHtcclxuXHRcdCAgICBcdFx0XHRcdHJldHVybiBPYmplY3QudW5vYnNlcnZlKHRhcmdldCxjYWxsYmFjayk7XHJcblx0XHQgICAgXHRcdFx0fVxyXG5cdFx0ICAgIFx0XHRcdHJldHVybiB0YXJnZXQudW5vYnNlcnZlKCk7XHJcblx0XHQgICAgXHRcdH07XHJcblx0XHQgICAgXHR9XHJcblx0ICAgIFx0XHRpZihwcm9wZXJ0eT09PVwic3BsaWNlXCIpIHtcclxuXHQgICAgXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHN0YXJ0LGVuZCkge1xyXG5cdCAgICBcdFx0XHRcdGlmKHR5cGVvZihzdGFydCkhPT1cIm51bWJlclwiIHx8IHR5cGVvZihlbmQpIT09XCJudW1iZXJcIikge1xyXG5cdCAgICBcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkZpcnN0IHR3byBhcmd1bWVudHMgdG8gQXJyYXkgc3BsaWNlIGFyZSBub3QgbnVtYmVyLCBudW1iZXJcIik7XHJcblx0ICAgIFx0XHRcdFx0fVxyXG5cdCAgICBcdCAgICBcdFx0dmFyIHJlbW92ZWQgPSB0aGlzLnNsaWNlKHN0YXJ0LHN0YXJ0K2VuZCksXHJcblx0ICAgIFx0ICAgIFx0XHRcdGFkZGVkQ291bnQgPSAoYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHMubGVuZ3RoLTIgOiAwKSxcclxuXHQgICAgXHQgICAgXHRcdFx0Y2hhbmdlID0gIHtvYmplY3Q6b2JqZWN0LHR5cGU6XCJzcGxpY2VcIixpbmRleDpzdGFydCxyZW1vdmVkOnJlbW92ZWQsYWRkZWRDb3VudDphZGRlZENvdW50fTtcclxuXHQgICAgXHQgICAgXHRcdHRhcmdldC5zcGxpY2UuYXBwbHkodGFyZ2V0LGFyZ3VtZW50cyk7XHJcblx0ICAgIFx0ICAgIFx0XHRpZihhY2NlcHRsaXN0LmluZGV4T2YoXCJzcGxpY2VcIik+PTApIHtcclxuXHQgICAgXHQgICAgXHRcdFx0dmFyIHN0YXJ0ID0gcHJveHkuX19vYnNlcnZlcl9fLmNoYW5nZXNldC5sZW5ndGggPT09IDAsXHJcblx0ICAgIFx0ICAgICAgICBcdFx0XHRkZWxpdmVyID0gcHJveHkuX19vYnNlcnZlcl9fLmRlbGl2ZXIoKTtcclxuXHQgICAgXHQgICAgXHRcdFx0cHJveHkuX19vYnNlcnZlcl9fLmNoYW5nZXNldC5wdXNoKGNoYW5nZSk7XHJcblx0ICAgIFx0ICAgIFx0XHRcdGlmKHN0YXJ0KSB7XHJcblx0ICAgIFx0XHQgICAgICAgIFx0XHRkZWxpdmVyKGZhbHNlLCh0eXBlb2YoZGVsaXZlci5kZWxheSk9PT1cIm51bWJlclwiID8gZGVsaXZlci5kZWxheSA6IDEwKSk7XHJcblx0ICAgIFx0XHQgICAgICAgIFx0fVxyXG5cdCAgICBcdCAgICBcdFx0fVxyXG5cdCAgICBcdCAgICBcdH1cclxuXHQgICAgXHRcdH1cclxuXHQgICAgXHRcdGlmKHByb3BlcnR5PT09XCJwdXNoXCIpIHtcclxuXHQgICAgXHRcdFx0IHJldHVybiBmdW5jdGlvbihpdGVtKSB7XHJcblx0ICAgIFx0XHQgICAgXHRyZXR1cm4gdGhpcy5zcGxpY2UodGhpcy5sZW5ndGgsMCxpdGVtKTtcclxuXHQgICAgXHRcdCAgICB9XHJcblx0ICAgIFx0XHR9XHJcblx0ICAgIFx0XHRpZihwcm9wZXJ0eT09PVwicG9wXCIpIHtcclxuXHQgICAgXHRcdFx0IHJldHVybiBmdW5jdGlvbigpIHtcclxuXHQgICAgXHRcdCAgICBcdHJldHVybiB0aGlzLnNwbGljZSh0aGlzLmxlbmd0aC0xLDEpO1xyXG5cdCAgICBcdFx0ICAgIH1cclxuXHQgICAgXHRcdH1cclxuXHQgICAgXHRcdGlmKHByb3BlcnR5PT09XCJ1bnNoaWZ0XCIpIHtcclxuXHQgICAgXHRcdFx0IHJldHVybiBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICBcdFx0ICAgIFx0XHRyZXR1cm4gdGhpcy5zcGxpY2UoMCwwLGl0ZW0pO1xyXG4gICAgXHRcdCAgICBcdH1cclxuXHQgICAgXHRcdH1cclxuXHQgICAgXHRcdGlmKHByb3BlcnR5PT09XCJzaGlmdFwiKSB7XHJcblx0ICAgIFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHQgICAgXHQgICAgXHRcdHJldHVybiB0aGlzLnNwbGljZSgwLDEpO1xyXG5cdCAgICBcdCAgICBcdH1cclxuXHQgICAgXHRcdH1cclxuXHQgICAgXHRcdHJldHVybiB0YXJnZXRbcHJvcGVydHldO1xyXG5cdCAgICBcdH19KTtcclxuXHQgICAgXHR2YXIgcHJveHkgPSBPYmplY3Qub2JzZXJ2ZShhcnJheXByb3h5LGZ1bmN0aW9uKGNoYW5nZXNldCkgeyBcclxuXHQgICAgXHRcdHZhciBjaGFuZ2VzID0gY2hhbmdlc2V0LmZpbHRlcihmdW5jdGlvbihjaGFuZ2UpIHsgcmV0dXJuIGNoYW5nZS5uYW1lIT09XCJsZW5ndGhcIiAmJiBjaGFuZ2UubmFtZSE9PVwiYWRkXCIgJiYgKCFhY2NlcHRsaXN0IHx8IGFjY2VwdGxpc3QuaW5kZXhPZihjaGFuZ2UudHlwZSk+PTApOyB9KTtcclxuXHQgICAgXHRcdGlmKGNoYW5nZXMubGVuZ3RoPjApIHtcclxuXHQgICAgXHRcdFx0Y2FsbGJhY2soY2hhbmdlcyk7XHJcblx0ICAgIFx0XHR9XHJcblx0ICAgIFx0fSxhY2NlcHRsaXN0LHBhdXNhYmxlLHBhdXNlLGRlbGF5KTtcclxuXHQgICAgXHRyZXR1cm4gcHJveHk7XHJcblx0ICAgIH07XHJcblx0ICAgIEFycmF5LnVub2JzZXJ2ZSA9IGZ1bmN0aW9uKG9iamVjdCxjYWxsYmFjaykge1xyXG5cdFx0ICByZXR1cm4gb2JqZWN0LnVub2JzZXJ2ZShjYWxsYmFjayk7XHJcblx0ICAgIH1cclxuXHR9XHJcblx0T2JqZWN0LmRlZXBPYnNlcnZlID0gZnVuY3Rpb24ob2JqZWN0LGNhbGxiYWNrLHBhcnRzKSB7XHJcblxyXG5cdFx0cGFydHMgPSAocGFydHMgPyBwYXJ0cyA6IFtdKTtcclxuXHJcblx0XHR2YXIgdG9UeXBlTmFtZSA9IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0XHRyZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKG9iaikubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlb2JzZXJ2ZSh2YWx1ZSwgcGFydHMpIHtcclxuXHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XHJcblx0XHRcdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuXHRcdFx0XHRpZigodG9UeXBlTmFtZSh2YWx1ZVtrZXldKSA9PT0gJ29iamVjdCcgfHwgdG9UeXBlTmFtZSh2YWx1ZVtrZXldKSA9PT0gJ2FycmF5JykgJiYgIXZhbHVlW2tleV0uaGFzT3duUHJvcGVydHkoJ19fb2JzZXJ2ZXJzX18nKSkge1xyXG5cdFx0XHRcdFx0dmFyIG5ld3BhcnRzID0gcGFydHMuc2xpY2UoMCk7XHJcblx0XHRcdFx0XHRuZXdwYXJ0cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHR2YWx1ZVtrZXldID0gT2JqZWN0LmRlZXBPYnNlcnZlKHZhbHVlW2tleV0sY2FsbGJhY2ssbmV3cGFydHMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVvYnNlcnZlKG9iamVjdCwgcGFydHMpO1xyXG5cclxuXHRcdHZhciBvYnNlcnZlZCA9IE9iamVjdC5vYnNlcnZlKG9iamVjdCxmdW5jdGlvbihjaGFuZ2VzZXQpIHtcclxuXHRcdFx0dmFyIGNoYW5nZXMgPSBbXTtcclxuXHRcdFx0ZnVuY3Rpb24gcmVjdXJzZShuYW1lLHJvb3RPYmplY3Qsb2xkT2JqZWN0LG5ld09iamVjdCxwYXRoKSB7XHJcblx0XHRcdFx0aWYobmV3T2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3a2V5cyA9IE9iamVjdC5rZXlzKG5ld09iamVjdCk7XHJcblx0XHRcdFx0XHRuZXdrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRcdFx0XHRcdGlmKCFvbGRPYmplY3QgfHwgKG9sZE9iamVjdFtrZXldIT09bmV3T2JqZWN0W2tleV0pKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9sZHZhbHVlID0gKG9sZE9iamVjdCAmJiBvbGRPYmplY3Rba2V5XSE9PXVuZGVmaW5lZCA/IG9sZE9iamVjdFtrZXldIDogdW5kZWZpbmVkKSxcclxuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZSA9IChvbGR2YWx1ZT09PXVuZGVmaW5lZCA/IFwiYWRkXCIgOiBcInVwZGF0ZVwiKSxcclxuXHRcdFx0XHRcdFx0XHRcdGtleXBhdGggPSBwYXRoICsgXCIuXCIgKyBrZXk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNoYW5nZXMucHVzaCh7bmFtZTpuYW1lLG9iamVjdDpyb290T2JqZWN0LHR5cGU6Y2hhbmdlLG9sZFZhbHVlOm9sZHZhbHVlLG5ld1ZhbHVlOm5ld09iamVjdFtrZXldLGtleXBhdGg6a2V5cGF0aH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJlY3Vyc2UobmFtZSxyb290T2JqZWN0LG9sZHZhbHVlLG5ld09iamVjdFtrZXldLGtleXBhdGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2UgaWYob2xkT2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcblx0XHRcdFx0XHR2YXIgb2xka2V5cyA9IE9iamVjdC5rZXlzKG9sZE9iamVjdCk7XHJcblx0XHRcdFx0XHRvbGRrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRcdFx0XHRcdHZhciBjaGFuZ2UgPSAobmV3T2JqZWN0PT09bnVsbCA/IFwidXBkYXRlXCIgOiBcImRlbGV0ZVwiKSxcclxuXHRcdFx0XHRcdFx0XHRrZXlwYXRoID0gcGF0aCArIFwiLlwiICsga2V5O1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRjaGFuZ2VzLnB1c2goe25hbWU6bmFtZSxvYmplY3Q6cm9vdE9iamVjdCx0eXBlOmNoYW5nZSxvbGRWYWx1ZTpvbGRPYmplY3Rba2V5XSxuZXdWYWx1ZTpuZXdPYmplY3Qsa2V5cGF0aDprZXlwYXRofSk7XHJcblx0XHRcdFx0XHRcdHJlY3Vyc2UobmFtZSxyb290T2JqZWN0LG9sZE9iamVjdFtrZXldLHVuZGVmaW5lZCxrZXlwYXRoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjaGFuZ2VzZXQuZm9yRWFjaChmdW5jdGlvbihjaGFuZ2UpIHtcclxuXHRcdFx0XHR2YXIga2V5cGF0aCA9IChwYXJ0cy5sZW5ndGg+MCA/IHBhcnRzLmpvaW4oXCIuXCIpICsgXCIuXCIgOiBcIlwiKSArIGNoYW5nZS5uYW1lO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hhbmdlLnR5cGUgPT09IFwidXBkYXRlXCIgfHwgY2hhbmdlLnR5cGUgPT09IFwiYWRkXCIpIHsgXHJcblx0XHRcdFx0XHRyZW9ic2VydmUoY2hhbmdlLm9iamVjdCwgcGFydHMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y2hhbmdlcy5wdXNoKHtuYW1lOmNoYW5nZS5uYW1lLG9iamVjdDpjaGFuZ2Uub2JqZWN0LHR5cGU6Y2hhbmdlLnR5cGUsb2xkVmFsdWU6Y2hhbmdlLm9sZFZhbHVlLG5ld1ZhbHVlOmNoYW5nZS5vYmplY3RbY2hhbmdlLm5hbWVdLGtleXBhdGg6a2V5cGF0aH0pO1xyXG5cdFx0XHRcdHJlY3Vyc2UoY2hhbmdlLm5hbWUsY2hhbmdlLm9iamVjdCxjaGFuZ2Uub2xkVmFsdWUsY2hhbmdlLm9iamVjdFtjaGFuZ2UubmFtZV0sa2V5cGF0aCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjYWxsYmFjayhjaGFuZ2VzKTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG9ic2VydmVkO1xyXG5cdH07XHJcbn0pKCk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wcm94eS1vYnNlcnZlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDciLCIvKipcbiogQ29weXJpZ2h0IDIwMTYgUFQgSW5vdmHDp8OjbyBlIFNpc3RlbWFzIFNBXG4qIENvcHlyaWdodCAyMDE2IElORVNDLUlEXG4qIENvcHlyaWdodCAyMDE2IFFVT0JJUyBORVRXT1JLUyBTTFxuKiBDb3B5cmlnaHQgMjAxNiBGUkFVTkhPRkVSLUdFU0VMTFNDSEFGVCBaVVIgRk9FUkRFUlVORyBERVIgQU5HRVdBTkRURU4gRk9SU0NIVU5HIEUuVlxuKiBDb3B5cmlnaHQgMjAxNiBPUkFOR0UgU0FcbiogQ29weXJpZ2h0IDIwMTYgRGV1dHNjaGUgVGVsZWtvbSBBR1xuKiBDb3B5cmlnaHQgMjAxNiBBcGl6ZWVcbiogQ29weXJpZ2h0IDIwMTYgVEVDSE5JU0NIRSBVTklWRVJTSVRBVCBCRVJMSU5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKiovXG5cbmltcG9ydCBEYXRhT2JqZWN0IGZyb20gJy4vRGF0YU9iamVjdCc7XG5pbXBvcnQgRGF0YU9iamVjdENoaWxkIGZyb20gJy4vRGF0YU9iamVjdENoaWxkJztcblxubGV0IEZpbHRlclR5cGUgPSB7QU5ZOiAnYW55JywgU1RBUlQ6ICdzdGFydCcsIEVYQUNUOiAnZXhhY3QnfTtcblxuLyoqXG4gKiBUaGUgY2xhc3MgcmV0dXJuZWQgZnJvbSB0aGUgU3luY2hlciBzdWJzY3JpYmUgY2FsbC5cbiAqIFRvIGJlIHVzZWQgYXMgYW4gb2JzZXJ2YXRpb24gcG9pbnQgZnJvbSBhIERhdGFPYmplY3RSZXBvcnRlciBjaGFuZ2UuXG4gKi9cbmNsYXNzIERhdGFPYmplY3RPYnNlcnZlciBleHRlbmRzIERhdGFPYmplY3QgLyogaW1wbGVtZW50cyBTeW5jU3RhdHVzICovIHtcbiAgLyogcHJpdmF0ZVxuICBfY2hhbmdlTGlzdGVuZXI6IE1zZ0xpc3RlbmVyXG5cbiAgLS0tLWV2ZW50IGhhbmRsZXJzLS0tLVxuICBfZmlsdGVyczogezxmaWx0ZXI+OiB7dHlwZTogPHN0YXJ0LCBleGFjdD4sIGNhbGxiYWNrOiA8ZnVuY3Rpb24+fSB9XG4gICovXG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICogU2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5IGJ5IEh5cGVydGllcy4gSXQncyBjYWxsZWQgYnkgdGhlIFN5bmNoZXIuc3Vic2NyaWJlIG1ldGhvZFxuICAgKi9cblxuICAvL1RPRE86IEZvciBGdXJ0aGVyIFN0dWR5XG4gIGNvbnN0cnVjdG9yKHN5bmNoZXIsIHVybCwgc2NoZW1hLCBpbml0aWFsU3RhdHVzLCBpbml0aWFsRGF0YSwgY2hpbGRyZW5zLCBpbml0aWFsVmVyc2lvbiwgbXV0dWFsKSB7XG4gICAgc3VwZXIoc3luY2hlciwgdXJsLCBzY2hlbWEsIGluaXRpYWxTdGF0dXMsIGluaXRpYWxEYXRhLmRhdGEsIGNoaWxkcmVucywgbXV0dWFsKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3ZlcnNpb24gPSBpbml0aWFsVmVyc2lvbjtcbiAgICBfdGhpcy5fZmlsdGVycyA9IHt9O1xuXG4gICAgX3RoaXMuX3N5bmNPYmoub2JzZXJ2ZSgoZXZlbnQpID0+IHtcbiAgICAgIF90aGlzLl9vbkZpbHRlcihldmVudCk7XG4gICAgfSk7XG5cbiAgICAvL3NldHVwIGNoaWxkcmVucyBkYXRhIGZyb20gc3Vic2NyaXB0aW9uXG4gICAgT2JqZWN0LmtleXMoaW5pdGlhbERhdGEuY2hpbGRyZW5zKS5mb3JFYWNoKChjaGlsZElkKSA9PiB7XG4gICAgICBsZXQgY2hpbGREYXRhID0gaW5pdGlhbERhdGEuY2hpbGRyZW5zW2NoaWxkSWRdO1xuICAgICAgX3RoaXMuX2NoaWxkcmVuT2JqZWN0c1tjaGlsZElkXSA9IG5ldyBEYXRhT2JqZWN0Q2hpbGQoX3RoaXMsIGNoaWxkSWQsIGNoaWxkRGF0YSk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5fYWxsb2NhdGVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIF9hbGxvY2F0ZUxpc3RlbmVycygpIHtcbiAgICBzdXBlci5fYWxsb2NhdGVMaXN0ZW5lcnMoKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2NoYW5nZUxpc3RlbmVyID0gX3RoaXMuX2J1cy5hZGRMaXN0ZW5lcihfdGhpcy5fdXJsICsgJy9jaGFuZ2VzJywgKG1zZykgPT4ge1xuICAgICAgaWYgKG1zZy50eXBlID09PSAndXBkYXRlJykge1xuICAgICAgICBjb25zb2xlLmxvZygnRGF0YU9iamVjdE9ic2VydmVyLScgKyBfdGhpcy5fdXJsICsgJy1SQ1Y6ICcsIG1zZyk7XG4gICAgICAgIF90aGlzLl9jaGFuZ2VPYmplY3QoX3RoaXMuX3N5bmNPYmosIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfcmVsZWFzZUxpc3RlbmVycygpIHtcbiAgICBzdXBlci5fcmVsZWFzZUxpc3RlbmVycygpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fY2hhbmdlTGlzdGVuZXIucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZSBhbmQgZGVsZXRlIG9iamVjdCBkYXRhXG4gICAqL1xuICBkZWxldGUoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9yZWxlYXNlTGlzdGVuZXJzKCk7XG4gICAgZGVsZXRlIF90aGlzLl9zeW5jaGVyLl9vYnNlcnZlcnNbX3RoaXMuX3VybF07XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZSBhbmQgZGVsZXRlIG9iamVjdCBkYXRhXG4gICAqL1xuICB1bnN1YnNjcmliZSgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9GTE9XLU9VVDogdGhpcyBtZXNzYWdlIHdpbGwgYmUgc2VudCB0byB0aGUgcnVudGltZSBpbnN0YW5jZSBvZiBTeW5jaGVyTWFuYWdlciAtPiBfb25Mb2NhbFVuU3Vic2NyaWJlXG4gICAgbGV0IHVuU3Vic2NyaWJlTXNnID0ge1xuICAgICAgdHlwZTogJ3Vuc3Vic2NyaWJlJywgZnJvbTogX3RoaXMuX293bmVyLCB0bzogX3RoaXMuX3N5bmNoZXIuX3N1YlVSTCxcbiAgICAgIGJvZHk6IHsgcmVzb3VyY2U6IF90aGlzLl91cmwgfVxuICAgIH07XG5cbiAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHVuU3Vic2NyaWJlTXNnLCAocmVwbHkpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdEYXRhT2JqZWN0T2JzZXJ2ZXItVU5TVUJTQ1JJQkU6ICcsIHJlcGx5KTtcbiAgICAgIGlmIChyZXBseS5ib2R5LmNvZGUgPT09IDIwMCkge1xuICAgICAgICBfdGhpcy5fcmVsZWFzZUxpc3RlbmVycygpO1xuICAgICAgICBkZWxldGUgX3RoaXMuX3N5bmNoZXIuX29ic2VydmVyc1tfdGhpcy5fdXJsXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgY2hhbmdlIGxpc3RlbmVycyBzZW50IGJ5IHRoZSByZXBvcnRlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsdGVyIC0gRmlsdGVyIHRoYXQgaWRlbnRpZmllcyB0aGUgZmllbGQgKHNlcGFyYXRlZCBkb3QgcGF0aCkuIEFjY2VwdHMgKiBhdCB0aGUgZW5kIGZvciBhIG1vcmUgdW5yZXN0cmljdGVkIGZpbHRlcmluZy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihldmVudDogTXNnRXZlbnQpfSBjYWxsYmFja1xuICAgKi9cbiAgb25DaGFuZ2UoZmlsdGVyLCBjYWxsYmFjaykge1xuICAgIGxldCBrZXkgPSBmaWx0ZXI7XG4gICAgbGV0IGZpbHRlck9iaiA9IHtcbiAgICAgIHR5cGU6IEZpbHRlclR5cGUuRVhBQ1QsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9O1xuXG4gICAgbGV0IGlkeCA9IGZpbHRlci5pbmRleE9mKCcqJyk7XG4gICAgaWYgKGlkeCA9PT0gZmlsdGVyLmxlbmd0aCAtIDEpIHtcbiAgICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgICAgZmlsdGVyT2JqLnR5cGUgPSBGaWx0ZXJUeXBlLkFOWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlck9iai50eXBlID0gRmlsdGVyVHlwZS5TVEFSVDtcbiAgICAgICAga2V5ID0gZmlsdGVyLnN1YnN0cigwLCBmaWx0ZXIubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZmlsdGVyc1trZXldID0gZmlsdGVyT2JqO1xuICB9XG5cbiAgX29uRmlsdGVyKGV2ZW50KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIE9iamVjdC5rZXlzKF90aGlzLl9maWx0ZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCBmaWx0ZXIgPSBfdGhpcy5fZmlsdGVyc1trZXldO1xuICAgICAgaWYgKGZpbHRlci50eXBlID09PSBGaWx0ZXJUeXBlLkFOWSkge1xuICAgICAgICAvL21hdGNoIGFueXRoaW5nXG4gICAgICAgIGZpbHRlci5jYWxsYmFjayhldmVudCk7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci50eXBlID09PSBGaWx0ZXJUeXBlLlNUQVJUKSB7XG4gICAgICAgIC8vaWYgc3RhcnRzIHdpdGggZmlsdGVyLi4uXG4gICAgICAgIGlmIChldmVudC5maWVsZC5pbmRleE9mKGtleSkgPT09IDApIHtcbiAgICAgICAgICBmaWx0ZXIuY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci50eXBlID09PSBGaWx0ZXJUeXBlLkVYQUNUKSB7XG4gICAgICAgIC8vZXhhY3QgbWF0Y2hcbiAgICAgICAgaWYgKGV2ZW50LmZpZWxkID09PSBrZXkpIHtcbiAgICAgICAgICBmaWx0ZXIuY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YU9iamVjdE9ic2VydmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N5bmNoZXIvRGF0YU9iamVjdE9ic2VydmVyLmpzIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG5pbXBvcnQgRGF0YU9iamVjdCBmcm9tICcuL0RhdGFPYmplY3QnO1xuaW1wb3J0IHsgZGVlcENsb25lIH0gZnJvbSAnLi4vdXRpbHMvdXRpbHMuanMnO1xuXG4vKipcbiAqIFRoZSBjbGFzcyByZXR1cm5lZCBmcm9tIHRoZSBTeW5jaGVyIGNyZWF0ZSBjYWxsLlxuICogVG8gYmUgdXNlZCBhcyBhIHJlcG9ydGVyIHBvaW50LCBjaGFuZ2VzIHdpbGwgYmUgc3VibWl0ZWQgdG8gRGF0YU9iamVjdE9ic2VydmVyIGluc3RhbmNlcy5cbiAqL1xuY2xhc3MgRGF0YU9iamVjdFJlcG9ydGVyIGV4dGVuZHMgRGF0YU9iamVjdCAvKiBpbXBsZW1lbnRzIFN5bmNTdGF0dXMgKi8ge1xuICAvKiBwcml2YXRlXG4gIF9zdWJzY3JpcHRpb25zOiA8aHlwZXJ0eVVybDogeyBzdGF0dXM6IHN0cmluZyB9IH0+XG5cbiAgLS0tLWV2ZW50IGhhbmRsZXJzLS0tLVxuICBfb25TdWJzY3JpcHRpb25IYW5kbGVyOiAoZXZlbnQpID0+IHZvaWRcbiAgX29uUmVzcG9uc2VIYW5kbGVyOiAoZXZlbnQpID0+IHZvaWRcbiAgX29uUmVhZEhhbmRsZXI6IChldmVudCkgPT4gdm9pZFxuICAqL1xuXG4gIC8qKlxuICAgKiBAaWdub3JlXG4gICAqIFNob3VsZCBub3QgYmUgdXNlZCBkaXJlY3RseSBieSBIeXBlcnRpZXMuIEl0J3MgY2FsbGVkIGJ5IHRoZSBTeW5jaGVyLmNyZWF0ZSBtZXRob2RcbiAgICovXG4gIGNvbnN0cnVjdG9yKHN5bmNoZXIsIHVybCwgc2NoZW1hLCBpbml0aWFsU3RhdHVzLCBpbml0aWFsRGF0YSwgY2hpbGRyZW5zKSB7XG4gICAgc3VwZXIoc3luY2hlciwgdXJsLCBzY2hlbWEsIGluaXRpYWxTdGF0dXMsIGluaXRpYWxEYXRhLCBjaGlsZHJlbnMpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHt9O1xuXG4gICAgX3RoaXMuX3N5bmNPYmoub2JzZXJ2ZSgoZXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdEYXRhT2JqZWN0UmVwb3J0ZXItJyArIHVybCArICctU0VORDogJywgZXZlbnQpO1xuICAgICAgX3RoaXMuX29uQ2hhbmdlKGV2ZW50KTtcbiAgICB9KTtcblxuICAgIF90aGlzLl9hbGxvY2F0ZUxpc3RlbmVycygpO1xuICB9XG5cbiAgX2FsbG9jYXRlTGlzdGVuZXJzKCkge1xuICAgIHN1cGVyLl9hbGxvY2F0ZUxpc3RlbmVycygpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fb2JqZWN0TGlzdGVuZXIgPSBfdGhpcy5fYnVzLmFkZExpc3RlbmVyKF90aGlzLl91cmwsIChtc2cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdEYXRhT2JqZWN0LScgKyBfdGhpcy5fdXJsICsgJy1SQ1Y6ICcsIG1zZyk7XG4gICAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3Jlc3BvbnNlJzogX3RoaXMuX29uUmVzcG9uc2UobXNnKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlYWQnOiBfdGhpcy5fb25SZWFkKG1zZyk7IGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX3JlbGVhc2VMaXN0ZW5lcnMoKSB7XG4gICAgc3VwZXIuX3JlbGVhc2VMaXN0ZW5lcnMoKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX29iamVjdExpc3RlbmVyLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgaW52aXRhdGlvbnMgKGNyZWF0ZSBtZXNzYWdlcykgdG8gaHlwZXJ0aWVzLCBvYnNlcnZlcnMgbGlzdC5cbiAgICogQHBhcmFtICB7SHlwZXJ0eVVSTFtdfSBvYnNlcnZlcnMgTGlzdCBvZiBIeXBlcnR5IFVSTCdzXG4gICAqL1xuICBpbnZpdGVPYnNlcnZlcnMob2JzZXJ2ZXJzKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vRkxPVy1PVVQ6IHRoaXMgbWVzc2FnZSB3aWxsIGJlIHNlbnQgdG8gdGhlIHJ1bnRpbWUgaW5zdGFuY2Ugb2YgU3luY2hlck1hbmFnZXIgLT4gX29uQ3JlYXRlXG4gICAgbGV0IGludml0ZU1zZyA9IHtcbiAgICAgIHR5cGU6ICdjcmVhdGUnLCBmcm9tOiBfdGhpcy5fc3luY2hlci5fb3duZXIsIHRvOiBfdGhpcy5fc3luY2hlci5fc3ViVVJMLFxuICAgICAgYm9keTogeyByZXN1bWU6IGZhbHNlLCByZXNvdXJjZTogX3RoaXMuX3VybCwgc2NoZW1hOiBfdGhpcy5fc2NoZW1hLCB2YWx1ZTogX3RoaXMuX3N5bmNPYmouZGF0YSwgYXV0aG9yaXNlOiBvYnNlcnZlcnMgfVxuICAgIH07XG5cbiAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKGludml0ZU1zZyk7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZSBhbmQgZGVsZXRlIG9iamVjdCBkYXRhXG4gICAqL1xuICBkZWxldGUoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vRkxPVy1PVVQ6IHRoaXMgbWVzc2FnZSB3aWxsIGJlIHNlbnQgdG8gdGhlIHJ1bnRpbWUgaW5zdGFuY2Ugb2YgU3luY2hlck1hbmFnZXIgLT4gX29uRGVsZXRlXG4gICAgbGV0IGRlbGV0ZU1zZyA9IHtcbiAgICAgIHR5cGU6ICdkZWxldGUnLCBmcm9tOiBfdGhpcy5fb3duZXIsIHRvOiBfdGhpcy5fc3luY2hlci5fc3ViVVJMLFxuICAgICAgYm9keTogeyByZXNvdXJjZTogX3RoaXMuX3VybCB9XG4gICAgfTtcblxuICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2UoZGVsZXRlTXNnLCAocmVwbHkpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdEYXRhT2JqZWN0UmVwb3J0ZXItREVMRVRFOiAnLCByZXBseSk7XG4gICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgX3RoaXMuX3JlbGVhc2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgZGVsZXRlIF90aGlzLl9zeW5jaGVyLl9yZXBvcnRlcnNbX3RoaXMuX3VybF07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyByZXF1ZXN0ZWQgYW5kIGFjY2VwdGVkIHRvIHRoaXMgcmVwb3J0ZXJcbiAgICogQHR5cGUge09iamVjdDxIeXBlcnR5VVJMLCBTeW5jU3Vic2NyaXB0aW9uPn1cbiAgICovXG4gIGdldCBzdWJzY3JpcHRpb25zKCkgeyByZXR1cm4gdGhpcy5fc3Vic2NyaXB0aW9uczsgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgY2FsbGJhY2sgdG8gcHJvY2VzcyBzdWJzY3JpYmUgYW5kIHVuc3Vic2NyaWJlIG5vdGlmaWNhdGlvbnNcbiAgICogQHBhcmFtIHtmdW5jdGlvbihldmVudDogTXNnRXZlbnQpfSBjYWxsYmFjayBmdW5jdGlvbiB0byByZWNlaXZlIGV2ZW50c1xuICAgKi9cbiAgb25TdWJzY3JpcHRpb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblN1YnNjcmlwdGlvbkhhbmRsZXIgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgY2FsbGJhY2sgdG8gcHJvY2VzcyByZXNwb25zZSBub3RpZmljYXRpb25zIG9mIHRoZSBjcmVhdGUnc1xuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGV2ZW50OiBNc2dFdmVudCl9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlY2VpdmUgZXZlbnRzXG4gICAqL1xuICBvblJlc3BvbnNlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25SZXNwb25zZUhhbmRsZXIgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgY2FsbGJhY2sgdG8gcHJvY2VzcyByZWFkIG5vdGlmaWNhdGlvbnNcbiAgICogQHBhcmFtIHtmdW5jdGlvbihldmVudDogTXNnRXZlbnQpfSBjYWxsYmFja1xuICAgKi9cbiAgb25SZWFkKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25SZWFkSGFuZGxlciA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLy9GTE9XLUlOOiBtZXNzYWdlIHJlY2VpdmVkIGZyb20gcGFyZW50IFN5bmNoZXIgLT4gX29uRm9yd2FyZFxuICBfb25Gb3J3YXJkKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBjb25zb2xlLmxvZygnRGF0YU9iamVjdFJlcG9ydGVyLVJDVjogJywgbXNnKTtcbiAgICBzd2l0Y2ggKG1zZy5ib2R5LnR5cGUpIHtcbiAgICAgIGNhc2UgJ3N1YnNjcmliZSc6IF90aGlzLl9vblN1YnNjcmliZShtc2cpOyBicmVhaztcbiAgICAgIGNhc2UgJ3Vuc3Vic2NyaWJlJzogX3RoaXMuX29uVW5TdWJzY3JpYmUobXNnKTsgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy9GTE9XLUlOOiBtZXNzYWdlIHJlY2VpdmVkIGZyb20gdGhpcyAtPiBfb25Gb3J3YXJkOiBlbWl0dGVkIGJ5IGEgcmVtb3RlIFN5bmNoZXIgLT4gc3Vic2NyaWJlXG4gIF9vblN1YnNjcmliZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBoeXBlcnR5VXJsID0gbXNnLmJvZHkuZnJvbTtcbiAgICBjb25zb2xlLmxvZygnW0RhdGFPYmplY3RSZXBvcnRlci5fb25TdWJzY3JpYmVdJywgbXNnKTtcblxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IG1zZy5ib2R5LnR5cGUsXG4gICAgICB1cmw6IGh5cGVydHlVcmwsXG5cbiAgICAgIGlkZW50aXR5OiBtc2cuYm9keS5pZGVudGl0eSxcblxuICAgICAgYWNjZXB0OiAoKSA9PiB7XG4gICAgICAgIC8vY3JlYXRlIG5ldyBzdWJzY3JpcHRpb25cbiAgICAgICAgbGV0IHN1YiA9IHsgdXJsOiBoeXBlcnR5VXJsLCBzdGF0dXM6ICdvbicgfTtcbiAgICAgICAgX3RoaXMuX3N1YnNjcmlwdGlvbnNbaHlwZXJ0eVVybF0gPSBzdWI7XG5cbiAgICAgICAgLy9wcm9jZXNzIGFuZCBzZW5kIGNoaWxkcmVucyBkYXRhXG4gICAgICAgIGxldCBjaGlsZHJlblZhbHVlcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyhfdGhpcy5fY2hpbGRyZW5PYmplY3RzKS5mb3JFYWNoKChjaGlsZElkKSA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkRGF0YSA9IF90aGlzLl9jaGlsZHJlbk9iamVjdHNbY2hpbGRJZF0uZGF0YTtcbiAgICAgICAgICBjaGlsZHJlblZhbHVlc1tjaGlsZElkXSA9IGRlZXBDbG9uZShjaGlsZERhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgc2VuZE1zZyA9IHtcbiAgICAgICAgICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLCBmcm9tOiBtc2cudG8sIHRvOiBtc2cuZnJvbSxcbiAgICAgICAgICBib2R5OiB7IGNvZGU6IDIwMCwgc2NoZW1hOiBfdGhpcy5fc2NoZW1hLCB2ZXJzaW9uOiBfdGhpcy5fdmVyc2lvbiwgdmFsdWU6IHsgZGF0YTogZGVlcENsb25lKF90aGlzLmRhdGEpLCBjaGlsZHJlbnM6IGNoaWxkcmVuVmFsdWVzIH0gfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vVE9ETzogRm9yIEZ1cnRoZXIgU3R1ZHlcbiAgICAgICAgaWYgKG1zZy5ib2R5Lmhhc093blByb3BlcnR5KCdtdXR1YWxBdXRoZW50aWNhdGlvbicpICYmICFtc2cuYm9keS5tdXR1YWxBdXRoZW50aWNhdGlvbikge1xuICAgICAgICAgIHNlbmRNc2cuYm9keS5tdXR1YWxBdXRoZW50aWNhdGlvbiA9IHRoaXMuX211dHVhbEF1dGhlbnRpY2F0aW9uO1xuICAgICAgICAgIHRoaXMuX211dHVhbEF1dGhlbnRpY2F0aW9uID0gbXNnLmJvZHkubXV0dWFsQXV0aGVudGljYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICAvL3NlbmQgb2sgcmVzcG9uc2UgbWVzc2FnZVxuICAgICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHNlbmRNc2cpO1xuXG4gICAgICAgIHJldHVybiBzdWI7XG4gICAgICB9LFxuXG4gICAgICByZWplY3Q6IChyZWFzb24pID0+IHtcbiAgICAgICAgLy9zZW5kIHJlamVjdCByZXNwb25zZSBtZXNzYWdlXG4gICAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsIGZyb206IG1zZy50bywgdG86IG1zZy5mcm9tLFxuICAgICAgICAgIGJvZHk6IHsgY29kZTogNDAzLCBkZXNjOiByZWFzb24gfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKF90aGlzLl9vblN1YnNjcmlwdGlvbkhhbmRsZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTVUJTQ1JJUFRJT04tRVZFTlQ6ICcsIGV2ZW50KTtcbiAgICAgIF90aGlzLl9vblN1YnNjcmlwdGlvbkhhbmRsZXIoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vRkxPVy1JTjogbWVzc2FnZSByZWNlaXZlZCBmcm9tIHRoaXMgLT4gX29uRm9yd2FyZDogZW1pdHRlZCBieSBhIHJlbW90ZSBEYXRhT2JqZWN0T2JzZXJ2ZXIgLT4gdW5zdWJzY3JpYmVcbiAgX29uVW5TdWJzY3JpYmUobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgaHlwZXJ0eVVybCA9IG1zZy5ib2R5LmZyb207XG5cbiAgICBsZXQgc3ViID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbaHlwZXJ0eVVybF07XG4gICAgZGVsZXRlIF90aGlzLl9zdWJzY3JpcHRpb25zW2h5cGVydHlVcmxdO1xuXG4gICAgbGV0IGV2ZW50ID0ge1xuICAgICAgdHlwZTogbXNnLmJvZHkudHlwZSxcbiAgICAgIHVybDogaHlwZXJ0eVVybCxcbiAgICAgIG9iamVjdDogc3ViXG4gICAgfTtcblxuICAgIGlmIChfdGhpcy5fb25TdWJzY3JpcHRpb25IYW5kbGVyKSB7XG4gICAgICBjb25zb2xlLmxvZygnVU4tU1VCU0NSSVBUSU9OLUVWRU5UOiAnLCBldmVudCk7XG4gICAgICBfdGhpcy5fb25TdWJzY3JpcHRpb25IYW5kbGVyKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvL0ZMT1ctSU46IG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBSZXBvcnRlclVSTCBhZGRyZXNzOiBlbWl0ZWQgYnkgYSByZW1vdGUgU3luY2hlciAtPiBfb25SZW1vdGVDcmVhdGUgLT4gZXZlbnQuYWNrXG4gIF9vblJlc3BvbnNlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBtc2cudHlwZSxcbiAgICAgIHVybDogbXNnLmZyb20sXG4gICAgICBjb2RlOiBtc2cuYm9keS5jb2RlXG4gICAgfTtcblxuICAgIGlmIChfdGhpcy5fb25SZXNwb25zZUhhbmRsZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSRVNQT05TRS1FVkVOVDogJywgZXZlbnQpO1xuICAgICAgX3RoaXMuX29uUmVzcG9uc2VIYW5kbGVyKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvL0ZMT1ctSU46IG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBSZXBvcnRlclVSTCBhZGRyZXNzOiBlbWl0ZWQgYnkgYSByZW1vdGUgU3luY2hlciAtPiByZWFkXG4gIF9vblJlYWQobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IG1zZy50eXBlLFxuICAgICAgdXJsOiBtc2cuZnJvbSxcblxuICAgICAgYWNjZXB0OiAoKSA9PiB7XG4gICAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsIGZyb206IG1zZy50bywgdG86IG1zZy5mcm9tLFxuICAgICAgICAgIGJvZHk6IHsgY29kZTogMjAwLCB2YWx1ZTogZGVlcENsb25lKF90aGlzLmRhdGEpIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICByZWplY3Q6IChyZWFzb24pID0+IHtcbiAgICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogbXNnLnRvLCB0bzogbXNnLmZyb20sXG4gICAgICAgICAgYm9keTogeyBjb2RlOiA0MDEsIGRlc2M6IHJlYXNvbiB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoX3RoaXMuX29uUmVhZEhhbmRsZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSRUFELUVWRU5UOiAnLCBldmVudCk7XG4gICAgICBfdGhpcy5fb25SZWFkSGFuZGxlcihldmVudCk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YU9iamVjdFJlcG9ydGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N5bmNoZXIvRGF0YU9iamVjdFJlcG9ydGVyLmpzIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG5pbXBvcnQgU3luY09iamVjdCwge0NoYW5nZVR5cGUsIE9iamVjdFR5cGV9IGZyb20gJy4vUHJveHlPYmplY3QnO1xuaW1wb3J0IERhdGFPYmplY3RDaGlsZCBmcm9tICcuL0RhdGFPYmplY3RDaGlsZCc7XG5pbXBvcnQge2RlZXBDbG9uZX0gZnJvbSAnLi4vdXRpbHMvdXRpbHMuanMnO1xuXG4vKipcbiAqIE1haW4gZXh0ZW5zaW9uIGNsYXNzIGZvciBvYnNlcnZlcnMgYW5kIHJlcG9ydGVycywgd2l0aCBjb21tb24gcHJvcGVydGllcyBhbmQgbWV0aG9kcy5cbiAqIENoaWxkcmVuIG1hbmFnZW1lbnQgaXMgY29tbW9uIGZvciBvYnNlcnZlcnMgYW5kIHJlcG9ydGVycy5cbiAqL1xuY2xhc3MgRGF0YU9iamVjdCB7XG4gIC8qIHByaXZhdGVcbiAgX3ZlcnNpb246IG51bWJlclxuXG4gIF9vd25lcjogSHlwZXJ0eVVSTFxuICBfdXJsOiBPYmplY3RVUkxcbiAgX3NjaGVtYTogU2NoZW1hXG4gIF9idXM6IE1pbmlCdXNcbiAgX3N0YXR1czogb24gfCBwYXVzZWRcbiAgX3N5bmNPYmo6IFN5bmNEYXRhXG5cbiAgX2NoaWxkcmVuOiB7IGlkOiBEYXRhT2JqZWN0Q2hpbGQgfVxuICBfY2hpbGRyZW5MaXN0ZW5lcnM6IFtNc2dMaXN0ZW5lcl1cblxuICAtLS0tZXZlbnQgaGFuZGxlcnMtLS0tXG4gIF9vbkFkZENoaWxkSGFuZGxlcjogKGV2ZW50KSA9PiB2b2lkXG4gICovXG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICogU2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5IGJ5IEh5cGVydGllcy4gSXQncyBjYWxsZWQgYnkgdGhlIFN5bmNoZXIgY3JlYXRlIG9yIHN1YnNjcmliZSBtZXRob2Qnc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc3luY2hlciwgdXJsLCBzY2hlbWEsIGluaXRpYWxTdGF0dXMsIGluaXRpYWxEYXRhLCBjaGlsZHJlbnMsIG11dHVhbCA9IHRydWUpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3N5bmNoZXIgPSBzeW5jaGVyO1xuICAgIF90aGlzLl91cmwgPSB1cmw7XG4gICAgX3RoaXMuX3NjaGVtYSA9IHNjaGVtYTtcbiAgICBfdGhpcy5fc3RhdHVzID0gaW5pdGlhbFN0YXR1cztcbiAgICBfdGhpcy5fc3luY09iaiA9IG5ldyBTeW5jT2JqZWN0KGluaXRpYWxEYXRhKTtcbiAgICBfdGhpcy5fY2hpbGRyZW5zID0gY2hpbGRyZW5zO1xuXG4gICAgLy9UT0RPOiBGb3IgRnVydGhlciBTdHVkeVxuICAgIF90aGlzLl9tdXR1YWxBdXRoZW50aWNhdGlvbiA9IG11dHVhbDtcblxuICAgIF90aGlzLl92ZXJzaW9uID0gMDtcbiAgICBfdGhpcy5fY2hpbGRJZCA9IDA7XG4gICAgX3RoaXMuX2NoaWxkcmVuT2JqZWN0cyA9IHt9O1xuICAgIF90aGlzLl9jaGlsZHJlbkxpc3RlbmVycyA9IFtdO1xuXG4gICAgX3RoaXMuX293bmVyID0gc3luY2hlci5fb3duZXI7XG4gICAgX3RoaXMuX2J1cyA9IHN5bmNoZXIuX2J1cztcbiAgfVxuXG4gIF9hbGxvY2F0ZUxpc3RlbmVycygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGNoaWxkQmFzZVVSTCA9IF90aGlzLl91cmwgKyAnL2NoaWxkcmVuLyc7XG4gICAgY29uc29sZS5sb2coJ1tEYXRhIE9iamVjdCAtIEFsbG9jYXRlTGlzdGVuZXJzXSAtICcsIF90aGlzLl9jaGlsZHJlbnMpO1xuICAgIGlmIChfdGhpcy5fY2hpbGRyZW5zKSB7XG4gICAgICBfdGhpcy5fY2hpbGRyZW5zLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGxldCBjaGlsZFVSTCA9IGNoaWxkQmFzZVVSTCArIGNoaWxkO1xuICAgICAgICBsZXQgbGlzdGVuZXIgPSBfdGhpcy5fYnVzLmFkZExpc3RlbmVyKGNoaWxkVVJMLCAobXNnKSA9PiB7XG4gICAgICAgICAgLy9pZ25vcmUgbXNnIHNlbnQgYnkgaGltc2VsZlxuICAgICAgICAgIGlmIChtc2cuZnJvbSAhPT0gdGhpcy5fb3duZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhT2JqZWN0LUNoaWxkcmVuLVJDVjogJywgbXNnKTtcbiAgICAgICAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnY3JlYXRlJzogX3RoaXMuX29uQ2hpbGRDcmVhdGUobXNnKTsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6IGNvbnNvbGUubG9nKG1zZyk7IGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OiBfdGhpcy5fY2hhbmdlQ2hpbGRyZW4obXNnKTsgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpcy5fY2hpbGRyZW5MaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZUxpc3RlbmVycygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2NoaWxkcmVuTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lci5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIE9iamVjdC5rZXlzKF90aGlzLl9jaGlsZHJlbk9iamVjdHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgX3RoaXMuX2NoaWxkcmVuT2JqZWN0c1trZXldLl9yZWxlYXNlTGlzdGVuZXJzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IFVSTCBvZiByZXBvcnRlciBvciBvYnNlcnZlclxuICAgKiBAdHlwZSB7T2JqZWN0VVJMfVxuICAgKi9cbiAgZ2V0IHVybCgpIHsgcmV0dXJuIHRoaXMuX3VybDsgfVxuXG4gIC8qKlxuICAgKiBPYmplY3Qgc2NoZW1hIFVSTCAodGhpcyBmaWVsZCBpcyBub3QgeWV0IHN0YWJsZSwgYW5kIGlzIHN1YnNqZWN0IHRvIGNoYW5nZSlcbiAgICogQHR5cGUge1NjaGVtYVVSTH1cbiAgICovXG4gIGdldCBzY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWE7IH1cblxuICAvKipcbiAgICogU3RhdHVzIG9mIHRoZSByZXBvcnRlciBvciBvYnNlcnZlciBjb25uZWN0aW9uICh0aGlzIGZpZWxkIGlzIG5vdCB5ZXQgc3RhYmxlLCBhbmQgaXMgc3Vic2plY3QgdG8gY2hhbmdlKVxuICAgKiBAdHlwZSB7U3RhdHVzfSAtIEVudW0gb2Y6IG9uIHwgcGF1c2VkXG4gICAqL1xuICBnZXQgc3RhdHVzKCkgeyByZXR1cm4gdGhpcy5fc3RhdHVzOyB9XG5cbiAgLyoqXG4gICAqIERhdGEgc3RydWN0dXJlIHRvIGJlIHN5bmNocm9uaXplZC5cbiAgICogQHR5cGUge0pTT059IC0gSlNPTiBzdHJ1Y3R1cmUgdGhhdCBzaG91bGQgZm9sbG93IHRoZSBkZWZpbmVkIHNjaGVtYSwgaWYgYW55LlxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9zeW5jT2JqLmRhdGE7IH1cblxuICAvKipcbiAgICogQWxsIGNyZWF0ZWQgY2hpbGRyZW4ncyBzaW5jZSB0aGUgc3Vic2NyaXB0aW9uLCBkb2Vzbid0IGNvbnRhaW4gYWxsIGNoaWxkcmVuJ3Mgc2luY2UgcmVwb3J0ZXIgY3JlYXRpb24uXG4gICAqIEB0eXBlIHtPYmplY3Q8Q2hpbGRJZCwgRGF0YU9iamVjdENoaWxkPn1cbiAgICovXG4gIGdldCBjaGlsZHJlbnMoKSB7IHJldHVybiB0aGlzLl9jaGlsZHJlbk9iamVjdHM7IH1cblxuICAvKipcbiAgICogQGlnbm9yZVxuICAgKi9cbiAgcGF1c2UoKSB7XG4gICAgLy9UT0RPOiB0aGlzIGZlYXR1cmUgbmVlZHMgbW9yZSBhbmFsaXNlXG4gICAgdGhyb3cgJ05vdCBpbXBsZW1lbnRlZCc7XG4gIH1cblxuICAvKipcbiAgICogQGlnbm9yZVxuICAgKi9cbiAgcmVzdW1lKCkge1xuICAgIC8vVE9ETzogdGhpcyBmZWF0dXJlIG5lZWRzIG1vcmUgYW5hbGlzZVxuICAgIHRocm93ICdOb3QgaW1wbGVtZW50ZWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICovXG4gIHN0b3AoKSB7XG4gICAgLy9UT0RPOiBzaG91bGQgcmVtb3ZlIHRoZSBzdWJzY3JpcHRpb24gYW5kIHNlbmQgbWVzc2FnZSB1bnN1YnNjcmliZT9cbiAgICB0aHJvdyAnTm90IGltcGxlbWVudGVkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIGFkZCBhIERhdGFPYmplY3RDaGlsZCB0byBhIGNoaWxkcmVuIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGlsZHJlbiAtIENoaWxkcmVuIG5hbWUgd2hlcmUgdGhlIGNoaWxkIGlzIGFkZGVkLlxuICAgKiBAcGFyYW0ge0pTT059IGluaXRpYWxEYXRhIC0gSW5pdGlhbCBkYXRhIG9mIHRoZSBjaGlsZFxuICAgKiBAcGFyYW0gIHtNZXNzYWdlQm9keUlkZW50aXR5fSBpZGVudGl0eSAtIChvcHRpb25hbCkgaWRlbnRpdHkgZGF0YSB0byBiZSBhZGRlZCB0byBpZGVudGl0eSB0aGUgdXNlciByZXBvcnRlci4gVG8gYmUgdXNlZCBmb3IgbGVnYWN5IGlkZW50aXRpZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8RGF0YU9iamVjdENoaWxkPn0gLSBSZXR1cm4gUHJvbWlzZSB0byBhIG5ldyBEYXRhT2JqZWN0Q2hpbGQuXG4gICAqL1xuICBhZGRDaGlsZChjaGlsZHJlbiwgaW5pdGlhbERhdGEsIGlkZW50aXR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vY3JlYXRlIG5ldyBjaGlsZCB1bmlxdWUgSUQsIGJhc2VkIG9uIGh5cGVydHlVUkxcbiAgICBfdGhpcy5fY2hpbGRJZCsrO1xuICAgIGxldCBtc2dDaGlsZElkID0gX3RoaXMuX293bmVyICsgJyMnICsgX3RoaXMuX2NoaWxkSWQ7XG4gICAgbGV0IG1zZ0NoaWxkUGF0aCA9IF90aGlzLl91cmwgKyAnL2NoaWxkcmVuLycgKyBjaGlsZHJlbjtcblxuICAgIC8vRkxPVy1PVVQ6IHRoaXMgbWVzc2FnZSB3aWxsIGJlIHNlbnQgZGlyZWN0bHkgdG8gYSByZXNvdXJjZSBjaGlsZCBhZGRyZXNzOiBNZXNzYWdlQnVzXG4gICAgbGV0IHJlcXVlc3RNc2cgPSB7XG4gICAgICB0eXBlOiAnY3JlYXRlJywgZnJvbTogX3RoaXMuX293bmVyLCB0bzogbXNnQ2hpbGRQYXRoLFxuICAgICAgYm9keTogeyByZXNvdXJjZTogbXNnQ2hpbGRJZCwgdmFsdWU6IGluaXRpYWxEYXRhIH1cbiAgICB9O1xuXG4gICAgaWYgKGlkZW50aXR5KSAgICAgIHsgcmVxdWVzdE1zZy5ib2R5LmlkZW50aXR5ID0gaWRlbnRpdHk7IH1cblxuICAgIC8vVE9ETzogRm9yIEZ1cnRoZXIgU3R1ZHlcbiAgICBpZiAoIV90aGlzLl9tdXR1YWxBdXRoZW50aWNhdGlvbikgcmVxdWVzdE1zZy5ib2R5Lm11dHVhbEF1dGhlbnRpY2F0aW9uID0gX3RoaXMuX211dHVhbEF1dGhlbnRpY2F0aW9uO1xuXG4gICAgLy9yZXR1cm5zIHByb21pc2UsIGluIHRoZSBmdXR1cmUsIHRoZSBBUEkgbWF5IGNoYW5nZSB0byBhc3luY2hyb25vdXMgY2FsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgbGV0IG1zZ0lkID0gX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShyZXF1ZXN0TXNnKTtcblxuICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZS1yZXBvcnRlci1jaGlsZCggJyArIF90aGlzLl9vd25lciArICcgKTogJywgcmVxdWVzdE1zZyk7XG4gICAgICBsZXQgbmV3Q2hpbGQgPSBuZXcgRGF0YU9iamVjdENoaWxkKF90aGlzLCBtc2dDaGlsZElkLCBpbml0aWFsRGF0YSwgX3RoaXMuX293bmVyLCBtc2dJZCk7XG4gICAgICBuZXdDaGlsZC5vbkNoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgX3RoaXMuX29uQ2hhbmdlKGV2ZW50LCB7IHBhdGg6IG1zZ0NoaWxkUGF0aCwgY2hpbGRJZDogbXNnQ2hpbGRJZCB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy5fY2hpbGRyZW5PYmplY3RzW21zZ0NoaWxkSWRdID0gbmV3Q2hpbGQ7XG5cbiAgICAgIHJlc29sdmUobmV3Q2hpbGQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHVwIHRoZSBjYWxsYmFjayB0byBwcm9jZXNzIGNyZWF0ZSBhbmQgZGVsZXRlIG9mIGNoaWxkcmVucy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihldmVudDogTXNnRXZlbnQpfSBjYWxsYmFja1xuICAgKi9cbiAgb25BZGRDaGlsZChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uQWRkQ2hpbGRyZW5IYW5kbGVyID0gY2FsbGJhY2s7XG4gIH1cblxuICAvL0ZMT1ctSU46IG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBhIHJlbW90ZSBEYXRhT2JqZWN0IC0+IGFkZENoaWxkXG4gIF9vbkNoaWxkQ3JlYXRlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG1zZ0NoaWxkSWQgPSBtc2cuYm9keS5yZXNvdXJjZTtcblxuICAgIGNvbnNvbGUubG9nKCdjcmVhdGUtb2JzZXJ2ZXItY2hpbGQoICcgKyBfdGhpcy5fb3duZXIgKyAnICk6ICcsIG1zZyk7XG4gICAgbGV0IG5ld0NoaWxkID0gbmV3IERhdGFPYmplY3RDaGlsZChfdGhpcywgbXNnQ2hpbGRJZCwgbXNnLmJvZHkudmFsdWUpO1xuICAgIF90aGlzLl9jaGlsZHJlbk9iamVjdHNbbXNnQ2hpbGRJZF0gPSBuZXdDaGlsZDtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy9GTE9XLU9VVDogd2lsbCBmbG93IHRvIERhdGFPYmplY3RDaGlsZCAtPiBfb25SZXNwb25zZVxuICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsIGZyb206IG1zZy50bywgdG86IG1zZy5mcm9tLFxuICAgICAgICBib2R5OiB7IGNvZGU6IDIwMCwgc291cmNlOiBfdGhpcy5fb3duZXIgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBtc2cudHlwZSxcbiAgICAgIGZyb206IG1zZy5mcm9tLFxuICAgICAgdXJsOiBtc2cudG8sXG4gICAgICB2YWx1ZTogbXNnLmJvZHkudmFsdWUsXG4gICAgICBjaGlsZElkOiBtc2dDaGlsZElkLFxuICAgICAgaWRlbnRpdHk6IG1zZy5ib2R5LmlkZW50aXR5XG4gICAgfTtcblxuICAgIGlmIChfdGhpcy5fb25BZGRDaGlsZHJlbkhhbmRsZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBREQtQ0hJTERSRU4tRVZFTlQ6ICcsIGV2ZW50KTtcbiAgICAgIF90aGlzLl9vbkFkZENoaWxkcmVuSGFuZGxlcihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy9zZW5kIGRlbHRhIG1lc3NhZ2VzIHRvIHN1YnNjcmlwdGlvbnNcbiAgX29uQ2hhbmdlKGV2ZW50LCBjaGlsZEluZm8pIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3ZlcnNpb24rKztcblxuICAgIGlmIChfdGhpcy5fc3RhdHVzID09PSAnb24nKSB7XG4gICAgICAvL0ZMT1ctT1VUOiB0aGlzIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGRpcmVjdGx5IHRvIGEgcmVzb3VyY2UgY2hhbmdlcyBhZGRyZXNzOiBNZXNzYWdlQnVzXG4gICAgICBsZXQgY2hhbmdlTXNnID0ge1xuICAgICAgICB0eXBlOiAndXBkYXRlJywgZnJvbTogX3RoaXMuX3VybCwgdG86IF90aGlzLl91cmwgKyAnL2NoYW5nZXMnLFxuICAgICAgICBib2R5OiB7IHZlcnNpb246IF90aGlzLl92ZXJzaW9uLCBzb3VyY2U6IF90aGlzLl9vd25lciwgYXR0cmlidXRlOiBldmVudC5maWVsZCB9XG4gICAgICB9O1xuXG4gICAgICBjb25zb2xlLmxvZygnW0RhdGFPYmplY3QgLSBfb25DaGFuZ2VdIC0gJywgZXZlbnQsIGNoaWxkSW5mbywgY2hhbmdlTXNnKTtcblxuICAgICAgaWYgKGV2ZW50Lm9UeXBlID09PSBPYmplY3RUeXBlLk9CSkVDVCkge1xuICAgICAgICBpZiAoZXZlbnQuY1R5cGUgIT09IENoYW5nZVR5cGUuUkVNT1ZFKSB7XG4gICAgICAgICAgY2hhbmdlTXNnLmJvZHkudmFsdWUgPSBldmVudC5kYXRhO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFuZ2VNc2cuYm9keS5hdHRyaWJ1dGVUeXBlID0gZXZlbnQub1R5cGU7XG4gICAgICAgIGNoYW5nZU1zZy5ib2R5LnZhbHVlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgaWYgKGV2ZW50LmNUeXBlICE9PSBDaGFuZ2VUeXBlLlVQREFURSkge1xuICAgICAgICAgIGNoYW5nZU1zZy5ib2R5Lm9wZXJhdGlvbiA9IGV2ZW50LmNUeXBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vY2hpbGRJbmZvIG11c3QgaGF2ZSAocGF0aCwgY2hpbGRJZClcbiAgICAgIGlmIChjaGlsZEluZm8pIHtcbiAgICAgICAgY2hhbmdlTXNnLnRvID0gY2hpbGRJbmZvLnBhdGg7XG4gICAgICAgIGNoYW5nZU1zZy5ib2R5LnJlc291cmNlID0gY2hpbGRJbmZvLmNoaWxkSWQ7XG4gICAgICB9XG5cbiAgICAgIC8vVE9ETzogRm9yIEZ1cnRoZXIgU3R1ZHlcbiAgICAgIGlmICghX3RoaXMuX211dHVhbEF1dGhlbnRpY2F0aW9uKSBjaGFuZ2VNc2cuYm9keS5tdXR1YWxBdXRoZW50aWNhdGlvbiA9IF90aGlzLl9tdXR1YWxBdXRoZW50aWNhdGlvbjtcblxuICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShjaGFuZ2VNc2cpO1xuICAgIH1cbiAgfVxuXG4gIC8vRkxPVy1JTjogZGVsdGEgbWVzc2FnZSByZWNlaXZlZCBmcm9tIGEgcmVtb3RlIERhdGFPYmplY3RSZXBvcnRlciBvciBEYXRhT2JqZWN0Q2hpbGQgd2hlbiBjaGFuZ2luZyBkYXRhXG4gIF9jaGFuZ2VPYmplY3Qoc3luY09iaiwgbXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vVE9ETzogdXBkYXRlIHZlcnNpb24gP1xuICAgIC8vaG93IHRvIGhhbmRsZSBhbiBpbmNvcnJlY3QgdmVyc2lvbiA/IEV4YW1wbGU6IHJlY2VpdmUgYSB2ZXJzaW9uIDMgd2hlbiB0aGUgb2JzZXJ2ZXIgaXMgaW4gdmVyc2lvbiAxLCB3aGVyZSBpcyB0aGUgdmVyc2lvbiAyID9cbiAgICAvL3dpbGwgd2UgbmVlZCB0byBjb25maXJtIHRoZSByZWNlcHRpb24gP1xuICAgIGlmIChfdGhpcy5fdmVyc2lvbiArIDEgPT09IG1zZy5ib2R5LnZlcnNpb24pIHtcbiAgICAgIF90aGlzLl92ZXJzaW9uKys7XG4gICAgICBsZXQgcGF0aCA9IG1zZy5ib2R5LmF0dHJpYnV0ZTtcbiAgICAgIGxldCB2YWx1ZSA9IGRlZXBDbG9uZShtc2cuYm9keS52YWx1ZSk7XG4gICAgICBsZXQgZmluZFJlc3VsdCA9IHN5bmNPYmouZmluZEJlZm9yZShwYXRoKTtcblxuICAgICAgaWYgKG1zZy5ib2R5LmF0dHJpYnV0ZVR5cGUgPT09IE9iamVjdFR5cGUuQVJSQVkpIHtcbiAgICAgICAgaWYgKG1zZy5ib2R5Lm9wZXJhdGlvbiA9PT0gQ2hhbmdlVHlwZS5BREQpIHtcbiAgICAgICAgICBsZXQgYXJyID0gZmluZFJlc3VsdC5vYmo7XG4gICAgICAgICAgbGV0IGluZGV4ID0gZmluZFJlc3VsdC5sYXN0O1xuICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoYXJyLCBbaW5kZXgsIDBdLmNvbmNhdCh2YWx1ZSkpO1xuICAgICAgICB9IGVsc2UgaWYgKG1zZy5ib2R5Lm9wZXJhdGlvbiA9PT0gQ2hhbmdlVHlwZS5SRU1PVkUpIHtcbiAgICAgICAgICBsZXQgYXJyID0gZmluZFJlc3VsdC5vYmo7XG4gICAgICAgICAgbGV0IGluZGV4ID0gZmluZFJlc3VsdC5sYXN0O1xuICAgICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaW5kUmVzdWx0Lm9ialtmaW5kUmVzdWx0Lmxhc3RdID0gdmFsdWU7IC8vIFVQREFURVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobXNnLmJvZHkudmFsdWUpIHtcbiAgICAgICAgICBmaW5kUmVzdWx0Lm9ialtmaW5kUmVzdWx0Lmxhc3RdID0gdmFsdWU7IC8vIFVQREFURSBvciBBRERcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZmluZFJlc3VsdC5vYmpbZmluZFJlc3VsdC5sYXN0XTsgLy8gUkVNT1ZFXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy9UT0RPOiBob3cgdG8gaGFuZGxlIHVuc3luY2hyb25pemVkIHZlcnNpb25zP1xuICAgICAgY29uc29sZS5sb2coJ1VOU1lOQ0hST05JWkVEIFZFUlNJT046IChkYXRhID0+ICcgKyBfdGhpcy5fdmVyc2lvbiArICcsIG1zZyA9PiAnICsgbXNnLmJvZHkudmVyc2lvbiArICcpJyk7XG4gICAgfVxuICB9XG5cbiAgLy9GTE9XLUlOOiBtZXNzYWdlIHJlY2VpdmVkIGZyb20gYSByZW1vdGUgRGF0YU9iamVjdENoaWxkIHdoZW4gY2hhbmdpbmcgZGF0YVxuICBfY2hhbmdlQ2hpbGRyZW4obXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBjb25zb2xlLmxvZygnQ2hhbmdlIGNoaWxkcmVuOiAnLCBfdGhpcy5fb3duZXIsIG1zZyk7XG5cbiAgICBsZXQgY2hpbGRJZCA9IG1zZy5ib2R5LnJlc291cmNlO1xuICAgIGxldCBjaGlsZHJlbiA9IF90aGlzLl9jaGlsZHJlbk9iamVjdHNbY2hpbGRJZF07XG5cbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIF90aGlzLl9jaGFuZ2VPYmplY3QoY2hpbGRyZW4uX3N5bmNPYmosIG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdObyBjaGlsZHJlbiBmb3VuZCBmb3I6ICcsIGNoaWxkSWQpO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFPYmplY3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3luY2hlci9EYXRhT2JqZWN0LmpzIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG5pbXBvcnQgU3luY09iamVjdCBmcm9tICcuL1Byb3h5T2JqZWN0JztcblxuLyoqXG4gKiBUaGUgY2xhc3MgcmV0dXJuZWQgZnJvbSB0aGUgRGF0YU9iamVjdCBhZGRDaGlsZHJlbiBjYWxsIG9yIGZyb20gb25BZGRDaGlsZHJlbiBpZiByZW1vdGVseSBjcmVhdGVkLlxuICogQ2hpbGRyZW4gb2JqZWN0IHN5bmNocm9uaXphdGlvbiBpcyBhIGEgZmFzdCBmb3J3YXJkIG1lY2hhbmlzbSwgbm8gbmVlZCBmb3IgZGlyZWN0IHN1YnNjcmlwdGlvbnMsIGl0IHVzZXMgdGhlIGFscmVhZHkgYXV0aG9yaXplZCBzdWJzY3JpcHRpb24gZnJvbSB0aGUgcGFyZW50IERhdGFPYmplY3QuXG4gKi9cbmNsYXNzIERhdGFPYmplY3RDaGlsZCAvKiBpbXBsZW1lbnRzIFN5bmNTdGF0dXMgKi8ge1xuICAvKiBwcml2YXRlXG5cbiAgLS0tLWV2ZW50IGhhbmRsZXJzLS0tLVxuICBfb25SZXNwb25zZUhhbmRsZXI6IChldmVudCkgPT4gdm9pZFxuICAqL1xuXG4gIC8qKlxuICAgKiBAaWdub3JlXG4gICAqIFNob3VsZCBub3QgYmUgdXNlZCBkaXJlY3RseSBieSBIeXBlcnRpZXMuIEl0J3MgY2FsbGVkIGJ5IHRoZSBEYXRhT2JqZWN0LmFkZENoaWxkcmVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIGNoaWxkSWQsIGluaXRpYWxEYXRhLCBvd25lciwgbXNnSWQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICBfdGhpcy5fY2hpbGRJZCA9IGNoaWxkSWQ7XG4gICAgX3RoaXMuX293bmVyID0gb3duZXI7XG4gICAgX3RoaXMuX21zZ0lkID0gbXNnSWQ7XG5cbiAgICBfdGhpcy5fc3luY09iaiA9IG5ldyBTeW5jT2JqZWN0KGluaXRpYWxEYXRhKTtcblxuICAgIF90aGlzLl9idXMgPSBwYXJlbnQuX2J1cztcbiAgICBfdGhpcy5fYWxsb2NhdGVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIF9hbGxvY2F0ZUxpc3RlbmVycygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy90aGlzIGlzIG9ubHkgbmVlZGVkIGZvciBjaGlsZHJlbiByZXBvcnRlcnNcbiAgICBpZiAoX3RoaXMuX293bmVyKSB7XG4gICAgICBfdGhpcy5fbGlzdGVuZXIgPSBfdGhpcy5fYnVzLmFkZExpc3RlbmVyKF90aGlzLl9vd25lciwgKG1zZykgPT4ge1xuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdyZXNwb25zZScgJiYgbXNnLmlkID09PSBfdGhpcy5fbXNnSWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRGF0YU9iamVjdENoaWxkLm9uUmVzcG9uc2U6JywgbXNnKTtcbiAgICAgICAgICBfdGhpcy5fb25SZXNwb25zZShtc2cpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZUxpc3RlbmVycygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90aGlzLl9saXN0ZW5lcikge1xuICAgICAgX3RoaXMuX2xpc3RlbmVyLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlIGFuZCBkZWxldGUgb2JqZWN0IGRhdGFcbiAgICovXG4gIGRlbGV0ZSgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgZGVsZXRlIF90aGlzLl9wYXJlbnQuX2NoaWxkcmVuW190aGlzLl9jaGlsZElkXTtcblxuICAgIF90aGlzLl9yZWxlYXNlTGlzdGVuZXJzKCk7XG5cbiAgICAvL1RPRE86IHNlbmQgZGVsZXRlIG1lc3NhZ2UgP1xuICB9XG5cbiAgLyoqXG4gICAqIENoaWxkcmVuIElEIGdlbmVyYXRlZCBvbiBhZGRDaGlsZHJlbi4gVW5pcXVlIGlkZW50aWZpZXJcbiAgICogQHR5cGUge1VSTH0gLSBVUkwgb2YgdGhlIGZvcm1hdCA8SHlwZXJ0eVVSTD4jPG51bWVyaWMtc2VxdWVuY2U+XG4gICAqL1xuICBnZXQgY2hpbGRJZCgpIHsgcmV0dXJuIHRoaXMuX2NoaWxkSWQ7IH1cblxuICAvKipcbiAgICogRGF0YSBTdHJ1Y3R1cmUgdG8gYmUgc3luY2hyb25pemVkLlxuICAgKiBAdHlwZSB7SlNPTn0gLSBKU09OIHN0cnVjdHVyZSB0aGF0IHNob3VsZCBmb2xsb3cgdGhlIGRlZmluZWQgc2NoZW1hLCBpZiBhbnkuXG4gICAqL1xuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX3N5bmNPYmouZGF0YTsgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgY2hhbmdlIGxpc3RlbmVycyBzZW50IGJ5IHRoZSByZXBvcnRlciBjaGlsZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGV2ZW50OiBNc2dFdmVudCl9IGNhbGxiYWNrXG4gICAqL1xuICBvbkNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMuX3N5bmNPYmoub2JzZXJ2ZSgoZXZlbnQpID0+IHtcbiAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgY2FsbGJhY2sgdG8gcHJvY2VzcyByZXNwb25zZSBub3RpZmljYXRpb25zIG9mIHRoZSBjcmVhdGVzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZXZlbnQ6IE1zZ0V2ZW50KX0gY2FsbGJhY2tcbiAgICovXG4gIG9uUmVzcG9uc2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vblJlc3BvbnNlSGFuZGxlciA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLy9GTE9XLUlOOiBtZXNzYWdlIHJlY2VpdmVkIGZyb20gYSByZW1vdGUgRGF0YU9iamVjdCAtPiBfb25DaGlsZENyZWF0ZVxuICBfb25SZXNwb25zZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGV2ZW50ID0ge1xuICAgICAgdHlwZTogbXNnLnR5cGUsXG4gICAgICB1cmw6IG1zZy5ib2R5LnNvdXJjZSxcbiAgICAgIGNvZGU6IG1zZy5ib2R5LmNvZGVcbiAgICB9O1xuXG4gICAgaWYgKF90aGlzLl9vblJlc3BvbnNlSGFuZGxlcikge1xuICAgICAgX3RoaXMuX29uUmVzcG9uc2VIYW5kbGVyKGV2ZW50KTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhT2JqZWN0Q2hpbGQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3luY2hlci9EYXRhT2JqZWN0Q2hpbGQuanMiLCJpbXBvcnQgJ3Byb3h5LW9ic2VydmUnO1xuXG5jb25zdCBvYmplY3RUeXBlID0ge0FSUkFZOiAnW29iamVjdCBBcnJheV0nLCBPQkpFQ1Q6ICdbb2JqZWN0IE9iamVjdF0nIH07XG5cbi8qKlxuICogQGFjY2VzcyBwcml2YXRlXG4gKiBNYWluIGNsYXNzIHRoYXQgbWFpbnRhaW5zIGEgSlNPTiBvYmplY3QsIGFuZCBvYnNlcnZlcyBjaGFuZ2VzIGluIHRoaXMgb2JqZWN0LCByZWN1cnNpdmVseS5cbiAqIEludGVybmFsIG9iamVjdHMgYW5kIGFycmF5cyBhcmUgYWxzbyBvYnNlcnZlZC5cbiAqL1xuY2xhc3MgU3luY09iamVjdCB7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbERhdGEpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX29ic2VydmVycyA9IFtdO1xuICAgIF90aGlzLl9maWx0ZXJzID0ge307XG5cbiAgICB0aGlzLl9kYXRhID0gaW5pdGlhbERhdGEgfHwge307XG5cbiAgICB0aGlzLl9pbnRlcm5hbE9ic2VydmUodGhpcy5fZGF0YSk7XG4gIH1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZChwYXRoKSB7XG4gICAgbGV0IGxpc3QgPSBwYXRoLnNwbGl0KCcuJyk7XG5cbiAgICByZXR1cm4gdGhpcy5fZmluZFdpdGhTcGxpdChsaXN0KTtcbiAgfVxuXG4gIGZpbmRCZWZvcmUocGF0aCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBsZXQgbGlzdCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICByZXN1bHQubGFzdCA9IGxpc3QucG9wKCk7XG4gICAgcmVzdWx0Lm9iaiA9IHRoaXMuX2ZpbmRXaXRoU3BsaXQobGlzdCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgX2ZpbmRXaXRoU3BsaXQobGlzdCkge1xuICAgIGxldCBvYmogPSB0aGlzLl9kYXRhO1xuICAgIGxpc3QuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgIG9iaiA9IG9ialt2YWx1ZV07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgX2ludGVybmFsT2JzZXJ2ZShvYmplY3QpIHtcblxuICAgIGxldCBoYW5kbGVyID0gKGNoYW5nZXNldCkgPT4ge1xuXG4gICAgICBjaGFuZ2VzZXQuZXZlcnkoKGNoYW5nZSkgPT4ge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZXMoY2hhbmdlKTtcbiAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHRoaXMuX2RhdGEgPSBPYmplY3QuZGVlcE9ic2VydmUob2JqZWN0LCBoYW5kbGVyKTtcblxuICB9XG5cbiAgX2ZpcmVFdmVudChldmVudCkge1xuICAgIHRoaXMuX29ic2VydmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgX29uQ2hhbmdlcyhjaGFuZ2UpIHtcblxuICAgIGxldCBvYmogPSBjaGFuZ2Uub2JqZWN0O1xuICAgIGxldCBvYmpUeXBlO1xuXG4gICAgaWYgKG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICBvYmpUeXBlID0gT2JqZWN0VHlwZS5PQkpFQ1Q7XG4gICAgfVxuXG4gICAgaWYgKG9iai5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgIG9ialR5cGUgPSBPYmplY3RUeXBlLkFSUkFZO1xuICAgIH1cblxuICAgIGxldCBmaWVsZFN0cmluZyA9IGNoYW5nZS5rZXlwYXRoO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ0ZpZWxkOicsIGZpZWxkU3RyaW5nKTtcbiAgICAvLyBjb25zb2xlLmxvZygndHlwZTonLCBjaGFuZ2UudHlwZSk7XG5cbiAgICAvL2xldCBvbGRWYWx1ZSA9IGNoYW5nZS5vbGRWYWx1ZTtcbiAgICBsZXQgbmV3VmFsdWUgPSBvYmpbY2hhbmdlLm5hbWVdO1xuXG4gICAgLy8gY29uc29sZS5pbmZvKGNoYW5nZS50eXBlICsgJyB8IEZpZWxkOiAnICsgZmllbGRTdHJpbmcgKyAnIHwgTmV3IFZhbHVlOicsIEpTT04uc3RyaW5naWZ5KG5ld1ZhbHVlKSwgZmllbGRTdHJpbmcuaW5jbHVkZXMoJ2xlbmd0aCcpKTtcblxuICAgIGlmIChjaGFuZ2UudHlwZSA9PT0gJ3VwZGF0ZScgJiYgIWZpZWxkU3RyaW5nLmluY2x1ZGVzKCcubGVuZ3RoJykpIHtcbiAgICAgIHRoaXMuX2ZpcmVFdmVudCh7XG4gICAgICAgIGNUeXBlOiBDaGFuZ2VUeXBlLlVQREFURSxcbiAgICAgICAgb1R5cGU6IG9ialR5cGUsXG4gICAgICAgIGZpZWxkOiBmaWVsZFN0cmluZyxcbiAgICAgICAgZGF0YTogbmV3VmFsdWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2UudHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIHRoaXMuX2ZpcmVFdmVudCh7XG4gICAgICAgIGNUeXBlOiBDaGFuZ2VUeXBlLkFERCxcbiAgICAgICAgb1R5cGU6IG9ialR5cGUsXG4gICAgICAgIGZpZWxkOiBmaWVsZFN0cmluZyxcbiAgICAgICAgZGF0YTogbmV3VmFsdWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2UudHlwZSA9PT0gJ2RlbGV0ZScpIHtcbiAgICAgIHRoaXMuX2ZpcmVFdmVudCh7XG4gICAgICAgIGNUeXBlOiBDaGFuZ2VUeXBlLlJFTU9WRSxcbiAgICAgICAgb1R5cGU6IG9ialR5cGUsXG4gICAgICAgIGZpZWxkOiBmaWVsZFN0cmluZ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGxldCBDaGFuZ2VUeXBlID0ge1VQREFURTogJ3VwZGF0ZScsIEFERDogJ2FkZCcsIFJFTU9WRTogJ3JlbW92ZSd9O1xuZXhwb3J0IGxldCBPYmplY3RUeXBlID0ge09CSkVDVDogJ29iamVjdCcsIEFSUkFZOiAnYXJyYXknfTtcbmV4cG9ydCBkZWZhdWx0IFN5bmNPYmplY3Q7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3luY2hlci9Qcm94eU9iamVjdC5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldE93blByb3BlcnR5RGVzY3JpcHRvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHZhciBkZXNjID0gKDAsIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyLmRlZmF1bHQpKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcGFyZW50ID0gKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkob2JqZWN0KTtcblxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICB9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG5pbXBvcnQgRGF0YU9iamVjdFJlcG9ydGVyIGZyb20gJy4vRGF0YU9iamVjdFJlcG9ydGVyJztcbmltcG9ydCBEYXRhT2JqZWN0T2JzZXJ2ZXIgZnJvbSAnLi9EYXRhT2JqZWN0T2JzZXJ2ZXInO1xuaW1wb3J0IERhdGFQcm92aXNpb25hbCBmcm9tICcuL0RhdGFQcm92aXNpb25hbCc7XG5cbi8qKlxuKiBUaGUgbWFpbiBjbGFzcyBmb3IgdGhlIHN5bmNoZXIgcGFja2FnZS5cbiogVGhlIFN5bmNoZXIgaXMgYSBzaW5nbGV0b24gY2xhc3MgcGVyIEh5cGVydHkvVVJMIGFuZCBpdCBpcyB0aGUgb3duZXIgb2YgYWxsIGNyZWF0ZWQgRGF0YSBTeW5jIE9iamVjdHMgYWNjb3JkaW5nIHRvIHRoZSBSZXBvcnRlciAtIE9ic2VydmVyIHBhdHRlcm4uXG4qIE1haW4gZnVuY3Rpb25hbGl0eSBpcyB0byBjcmVhdGUgcmVwb3J0ZXJzIGFuZCB0byBzdWJzY3JpYmUgdG8gZXhpc3Rpbmcgb25lcy5cbiovXG5jbGFzcyBTeW5jaGVyIHtcbiAgLyogcHJpdmF0ZVxuICBfb3duZXI6IFVSTFxuICBfYnVzOiBNaW5pQnVzXG5cbiAgX3N1YlVSTDogVVJMXG5cbiAgX3JlcG9ydGVyczogPHVybDogRGF0YU9iamVjdFJlcG9ydGVyPlxuICBfb2JzZXJ2ZXJzOiA8dXJsOiBEYXRhT2JqZWN0T2JzZXJ2ZXI+XG4gIF9wcm92aXNpb25hbHM6IDx1cmw6IERhdGFQcm92aXNpb25hbD5cblxuICAtLS0tZXZlbnQgaGFuZGxlcnMtLS0tXG4gIF9vbk5vdGlmaWNhdGlvbkhhbmRsZXI6IChldmVudCkgPT4gdm9pZFxuICBfb25SZXN1bWU6IChldmVudCkgPT4gdm9pZFxuICAqL1xuXG4gIC8qKlxuICAqIENvbnN0cnVjdG9yIHRoYXQgc2hvdWxkIGJlIHVzZWQgYnkgdGhlIEh5cGVydHkgb3duZXJcbiAgKiBAcGFyYW0ge0h5cGVydHlVUkx9IG93bmVyIC0gSHlwZXJ0eSBVUkwgb3duZXIuIEFuIFVSTCBhbGxvY2F0ZWQgYnkgdGhlIHJ1bnRpbWUgdGhhdCB1bmlxdWVseSBpZGVudGlmaWVzIHRoZSBIeXBlcnR5LlxuICAqIEBwYXJhbSB7TWluaUJ1c30gYnVzIC0gQW4gaW5zdGFuY2Ugb2YgdGhlIE1pbmlCdXMgcHJvdmlkZWQgaW4gdGhlIHNhbmRib3guIFdoZW4gYW4gb2JqZWN0IChSZXBvcnRlciBvciBPYnNlcnZlZCkgaXMgY3JlYXRlZCwgdGhlIFN5bmNoZXJNYW5hZ2VyIHdpbGwgYWRkIGEgbGlzdGVuZXIgaW4gdGhlIE1pbmlCdXMgdG8gcmVjZWl2ZS9zZW5kIE1lc3NhZ2VzIG9mIHRoYXQgb2JqZWN0LlxuICAqIEBwYXJhbSB7SlNPTn0gY29uZmlnIC0gQ29uZmlndXJhdGlvbiBkYXRhLiBUaGUgb25seSByZXF1aXJlZCBmaWVsZCBmb3Igbm93IGlzIHRoZSBydW50aW1lVVJMLlxuICAqL1xuICBjb25zdHJ1Y3Rvcihvd25lciwgYnVzLCBjb25maWcpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX293bmVyID0gb3duZXI7XG4gICAgX3RoaXMuX2J1cyA9IGJ1cztcblxuICAgIF90aGlzLl9zdWJVUkwgPSBjb25maWcucnVudGltZVVSTCArICcvc20nO1xuXG4gICAgX3RoaXMuX3JlcG9ydGVycyA9IHt9O1xuICAgIF90aGlzLl9vYnNlcnZlcnMgPSB7fTtcbiAgICBfdGhpcy5fcHJvdmlzaW9uYWxzID0ge307XG5cbiAgICBidXMuYWRkTGlzdGVuZXIob3duZXIsIChtc2cpID0+IHtcbiAgICAgIC8vaWdub3JlIG1zZyBzZW50IGJ5IGhpbXNlbGZcbiAgICAgIGlmIChtc2cuZnJvbSAhPT0gb3duZXIpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbU3luY2hlcl0gU3luY2hlci1SQ1Y6ICcsIG1zZyk7XG4gICAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdmb3J3YXJkJzogX3RoaXMuX29uRm9yd2FyZChtc2cpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdjcmVhdGUnOiBfdGhpcy5fb25SZW1vdGVDcmVhdGUobXNnKTsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVsZXRlJzogX3RoaXMuX29uUmVtb3RlRGVsZXRlKG1zZyk7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBUaGUgb3duZXIgb2YgdGhlIFN5bmNoZXIgYW5kIGFsbCBjcmVhdGVkIHJlcG9ydGVycy5cbiAgKiBAdHlwZSB7SHlwZXJ0eVVSTH1cbiAgKi9cbiAgZ2V0IG93bmVyKCkgeyByZXR1cm4gdGhpcy5fb3duZXI7IH1cblxuICAvKipcbiAgKiBBbGwgb3duZWQgcmVwb3J0ZXJzLCB0aGUgb25lcyB0aGF0IHdlcmUgY3JlYXRlZCBieSBhIGNyZWF0ZVxuICAqIEB0eXBlIHtPYmplY3Q8VVJMLCBEYXRhT2JqZWN0UmVwb3J0ZXI+fVxuICAqL1xuICBnZXQgcmVwb3J0ZXJzKCkgeyByZXR1cm4gdGhpcy5fcmVwb3J0ZXJzOyB9XG5cbiAgLyoqXG4gICogQWxsIG93bmVkIG9ic2VydmVycywgdGhlIG9uZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgYnkgYSBsb2NhbCBzdWJzY3JpcHRpb25cbiAgKiBAdHlwZSB7T2JqZWN0PFVSTCwgRGF0YU9iamVjdE9ic2VydmVyPn1cbiAgKi9cbiAgZ2V0IG9ic2VydmVycygpIHsgcmV0dXJuIHRoaXMuX29ic2VydmVyczsgfVxuXG4gIC8qKlxuICAqIFJlcXVlc3QgYSBEYXRhT2JqZWN0UmVwb3J0ZXIgY3JlYXRpb24uIFRoZSBVUkwgd2lsbCBiZSBiZSByZXF1ZXN0ZWQgYnkgdGhlIGFsbG9jYXRpb24gbWVjaGFuaXNtLlxuICAqIEBwYXJhbSAge1NjaGVtYVVSTH0gc2NoZW1hIC0gSHlwZXJ0eSBDYXRhbG9ndWUgVVJMIGFkZHJlc3MgdGhhdCBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSB0aGUgSlNPTi1TY2hlbWEgZGVzY3JpYmluZyB0aGUgRGF0YSBPYmplY3Qgc2NoZW1hXG4gICogQHBhcmFtICB7SHlwZXJ0eVVSTFtdfSBvYnNlcnZlcnMgLSBMaXN0IG9mIGh5cGVydGllcyB0aGF0IGFyZSBwcmUtYXV0aG9yaXplZCBmb3Igc3Vic2NyaXB0aW9uXG4gICogQHBhcmFtICB7SlNPTn0gaW5pdGlhbERhdGEgLSBJbml0aWFsIGRhdGEgb2YgdGhlIHJlcG9ydGVyXG4gICogQHBhcmFtICB7Ym9vbGVhbn0gc3RvcmUgLSAoT3B0aW9uYWwpIGlmIHRydWUsIG9iamVjdCB3aWxsIGJlIHN0b3JlZCBieSB0aGUgcnVudGltZVxuICAqIEBwYXJhbSAge2Jvb2xlYW59IHAycCAtIChPcHRpb25hbCkgaWYgdHJ1ZSwgZGF0YSBzeW5jaHJvbmlzYXRpb24gc3RyZWFtIHdpbGwgdXNlIHAycCBjb25uZWN0aW9uIGFzIG11Y2ggYXMgcG9zc2libGVcbiAgKiBAcGFyYW0gIHtNZXNzYWdlQm9keUlkZW50aXR5fSBpZGVudGl0eSAtIChvcHRpb25hbCkgaWRlbnRpdHkgZGF0YSB0byBiZSBhZGRlZCB0byBpZGVudGl0eSB0aGUgdXNlciByZXBvcnRlci4gVG8gYmUgdXNlZCBmb3IgbGVnYWN5IGlkZW50aXRpZXMuXG4gICogQHJldHVybiB7UHJvbWlzZTxEYXRhT2JqZWN0UmVwb3J0ZXI+fSBSZXR1cm4gUHJvbWlzZSB0byBhIG5ldyBSZXBvcnRlci4gVGhlIHJlcG9ydGVyIGNhbiBiZSBhY2NlcHRlZCBvciByZWplY3RlZCBieSB0aGUgUEVQXG4gICovXG4gIGNyZWF0ZShzY2hlbWEsIG9ic2VydmVycywgaW5pdGlhbERhdGEsIHN0b3JlID0gZmFsc2UsIHAycCA9IGZhbHNlLCBpZGVudGl0eSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IGNyaXRlcmlhID0ge307XG5cbiAgICBjcml0ZXJpYS5wMnAgPSBwMnA7XG4gICAgY3JpdGVyaWEuc3RvcmUgPSBzdG9yZTtcbiAgICBjcml0ZXJpYS5zY2hlbWEgPSBzY2hlbWE7XG4gICAgY3JpdGVyaWEub2JzZXJ2ZXJzID0gb2JzZXJ2ZXJzO1xuICAgIGNyaXRlcmlhLmluaXRpYWxEYXRhID0gaW5pdGlhbERhdGE7XG5cbiAgICBpZiAoaWRlbnRpdHkpICAgICAgeyBjcml0ZXJpYS5pZGVudGl0eSA9IGlkZW50aXR5OyB9XG5cbiAgICBjb25zb2xlLmxvZygnW3N5bmNoZXIgLSBjcmVhdGVdIC0gY3JlYXRlIFJlcG9ydGVyIC0gY3JpdGVyaWE6ICcsIGNyaXRlcmlhKTtcblxuICAgIE9iamVjdC5hc3NpZ24oY3JpdGVyaWEsIHtyZXN1bWU6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gX3RoaXMuX2NyZWF0ZShjcml0ZXJpYSk7XG4gIH1cblxuICByZXN1bWVSZXBvcnRlcnMoY3JpdGVyaWEpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKCdbc3luY2hlciAtIGNyZWF0ZV0gLSByZXN1bWUgUmVwb3J0ZXIgLSBjcml0ZXJpYTogJywgY3JpdGVyaWEpO1xuXG4gICAgT2JqZWN0LmFzc2lnbihjcml0ZXJpYSwge3Jlc3VtZTogdHJ1ZX0pO1xuXG4gICAgcmV0dXJuIF90aGlzLl9jcmVhdGUoY3JpdGVyaWEpO1xuICB9XG5cbiAgLyoqXG4gICogUmVxdWVzdCBhIHN1YnNjcmlwdGlvbiB0byBhbiBleGlzdGVudCByZXBvcnRlciBvYmplY3QuXG4gICogQHBhcmFtIHtTY2hlbWFVUkx9IHNjaGVtYSAtIEh5cGVydHkgQ2F0YWxvZ3VlIFVSTCBhZGRyZXNzIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgdGhlIEpTT04tU2NoZW1hIGRlc2NyaWJpbmcgdGhlIERhdGEgT2JqZWN0IHNjaGVtYVxuICAqIEBwYXJhbSB7T2JqZWN0VVJMfSBvYmpVUkwgLSBBZGRyZXNzIG9mIHRoZSBleGlzdGVudCByZXBvcnRlciBvYmplY3QgdG8gYmUgb2JzZXJ2ZWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzdG9yZT1mYWxzZV0gLSBTYXZlIHRoZSBzdWJzY3JpcHRpb24gb24gdGhlIFN5bmNoZXIgTWFuYWdlciBmb3IgZnVydGhlciByZXN1bWUgKERlZmF1bHQgaXMgZmFsc2UpXG4gICogQHBhcmFtIHtCb29sZWFufSBbcDJwPWZhbHNlXSAtIEluZm8gYWJvdXQgaWYgc2hvdWxkIHVzZSBwMnAgY29ubmVjdGlvbiAoRGVmYXVsdCBpcyBmYWxzZSlcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFttdXR1YWw9dHJ1ZV0gLSBJbmZvIGFib3V0IGlmIG1lc3NhZ2VzIG9mIHRoaXMgb2JqZWN0IHNob3VsZCBiZSBlbmNyeXB0ZWQgKERlZmF1bHQgaXMgdHJ1ZSlcbiAgKiBAcGFyYW0gIHtNZXNzYWdlQm9keUlkZW50aXR5fSBpZGVudGl0eSAtIChvcHRpb25hbCkgaWRlbnRpdHkgZGF0YSB0byBiZSBhZGRlZCB0byBpZGVudGl0eSB0aGUgdXNlciByZXBvcnRlci4gVG8gYmUgdXNlZCBmb3IgbGVnYWN5IGlkZW50aXRpZXMuXG4gICogQHJldHVybiB7UHJvbWlzZTxEYXRhT2JqZWN0T2JzZXJ2ZXI+fSBSZXR1cm4gUHJvbWlzZSB0byBhIG5ldyBvYnNlcnZlci4gSXQncyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlcG9ydGVyLlxuICAqL1xuICBzdWJzY3JpYmUoc2NoZW1hLCBvYmpVUkwsIHN0b3JlID0gZmFsc2UsIHAycCA9IGZhbHNlLCBtdXR1YWwgPSB0cnVlLCBpZGVudGl0eSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IGNyaXRlcmlhID0ge307XG5cbiAgICBjcml0ZXJpYS5wMnAgPSBwMnA7XG4gICAgY3JpdGVyaWEuc3RvcmUgPSBzdG9yZTtcbiAgICBjcml0ZXJpYS5zY2hlbWEgPSBzY2hlbWE7XG5cbiAgICBjcml0ZXJpYS5yZXNvdXJjZSA9IG9ialVSTDtcbiAgICBpZiAoaWRlbnRpdHkpICAgICAgeyBjcml0ZXJpYS5pZGVudGl0eSA9IGlkZW50aXR5OyB9XG5cbiAgICAvL1RPRE86IEZvciBGdXJ0aGVyIFN0dWR5XG4gICAgY3JpdGVyaWEubXV0dWFsID0gbXV0dWFsO1xuXG4gICAgY29uc29sZS5sb2coJ1tzeW5jaGVyIC0gc3Vic2NyaWJlXSAtIHN1YnNjcmliZSBjcml0ZXJpYTogJywgY3JpdGVyaWEpO1xuXG4gICAgT2JqZWN0LmFzc2lnbihjcml0ZXJpYSwge3Jlc3VtZTogZmFsc2V9KTtcblxuICAgIHJldHVybiBfdGhpcy5fc3Vic2NyaWJlKGNyaXRlcmlhKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJlcXVlc3QgYSBzdWJzY3JpcHRpb24gdG8gYW4gZXhpc3RlbnQgcmVwb3J0ZXIgb2JqZWN0LlxuICAqIEBwYXJhbSB7Y3JpdGVyaWF9IGNyaXRlcmlhIC0gSW5mb3JtYXRpb24gdG8gZGlzY292ZXJ5IHRoZSBvYnNlcnZlciBvYmplY3RcbiAgKiBAcmV0dXJuIHtQcm9taXNlPERhdGFPYmplY3RPYnNlcnZlcj59IFJldHVybiBQcm9taXNlIHRvIGEgbmV3IG9ic2VydmVyLiBJdCdzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVwb3J0ZXIuXG4gICovXG4gIHJlc3VtZU9ic2VydmVycyhjcml0ZXJpYSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IF9jcml0ZXJpYSA9IGNyaXRlcmlhIHx8IHt9O1xuXG4gICAgT2JqZWN0LmFzc2lnbihfY3JpdGVyaWEsIHtyZXN1bWU6IHRydWV9KTtcblxuICAgIHJldHVybiBfdGhpcy5fc3Vic2NyaWJlKF9jcml0ZXJpYSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXF1ZXN0IGEgcmVhZCBhY3Rpb24gb24gdGhlIHJlcG9ydGVyIG9iamVjdFxuICAqIEBwYXJhbSB7T2JqZWN0VVJMfSBvYmpVUkwgLSBVUkwgb2YgdGhlIHJlcG9ydGVyIG9iamVjdCB0byBiZSByZWFkXG4gICogQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSBSZXR1cm4gUHJvbWlzZSB0byBsYXN0IGF2YWlsYWJsZSBkYXRhIG9mIHRoZSByZXBvcnRlclxuICAqL1xuICByZWFkKG9ialVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvL0ZMT1ctT1VUOiB0aGlzIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IGRpcmVjdGx5IHRvIHJlcG9ydGVyIG9iamVjdCAobWF5YmUgdGhlcmUgaXMgbm8gbGlzdGVuZXIgYXZhaWxhYmxlLCBzbyBpdCB3aWxsIGJlIHJlc29sdmVkIHdpdGggTWVzc2FnZUJ1cyAtPiByZXNvbHZlKVxuICAgIC8vd2lsbCByZWFjaCB0aGUgcmVtb3RlIG9iamVjdCBpbiBEYXRhT2JqZWN0UmVwb3J0ZXIgLT4gX29uUmVhZFxuICAgIGxldCByZWFkTXNnID0ge1xuICAgICAgdHlwZTogJ3JlYWQnLCBmcm9tOiBfdGhpcy5fb3duZXIsIHRvOiBvYmpVUkxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2UocmVhZE1zZywgKHJlcGx5KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWFkLXJlc3BvbnNlOiAnLCByZXBseSk7XG4gICAgICAgIGlmIChyZXBseS5ib2R5LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIHJlc29sdmUocmVwbHkuYm9keS52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHJlcGx5LmJvZHkuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogU2V0dXAgdGhlIGNhbGxiYWNrIHRvIHByb2Nlc3MgY3JlYXRlIGFuZCBkZWxldGUgZXZlbnRzIG9mIHJlbW92ZSBSZXBvcnRlciBvYmplY3RzLlxuICAqIFRoaXMgaXMgcmVsZWF0ZWQgdG8gdGhlIG1lc3NhZ2VucyBzZW50IGJ5IGNyZWF0ZSB0byB0aGUgb2JzZXJ2ZXJzIEh5cGVydHkgYXJyYXkuXG4gICogQHBhcmFtIHtmdW5jdGlvbihldmVudDogTXNnRXZlbnQpfSBjYWxsYmFja1xuICAqL1xuICBvbk5vdGlmaWNhdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMuX29uTm90aWZpY2F0aW9uSGFuZGxlciA9IGNhbGxiYWNrO1xuICB9XG5cbiAgX2NyZWF0ZShjcml0ZXJpYSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHJlc3VtZSA9IGNyaXRlcmlhLnJlc3VtZTtcbiAgICAgIGxldCBpbml0aWFsRGF0YSA9IGNyaXRlcmlhLmluaXRpYWxEYXRhIHx8IHt9O1xuICAgICAgbGV0IHNjaGVtYTtcblxuICAgICAgLy9GTE9XLU9VVDogdGhpcyBtZXNzYWdlIHdpbGwgYmUgc2VudCB0byB0aGUgcnVudGltZSBpbnN0YW5jZSBvZiBTeW5jaGVyTWFuYWdlciAtPiBfb25DcmVhdGVcbiAgICAgIGxldCByZXF1ZXN0TXNnID0ge1xuICAgICAgICB0eXBlOiAnY3JlYXRlJywgZnJvbTogX3RoaXMuX293bmVyLCB0bzogX3RoaXMuX3N1YlVSTCxcbiAgICAgICAgYm9keTogeyByZXN1bWU6IHJlc3VtZSB9XG4gICAgICB9O1xuXG4gICAgICBjb25zb2xlLmxvZygnW3N5bmNoZXIgLSBjcmVhdGVdOiAnLCBjcml0ZXJpYSwgcmVxdWVzdE1zZyk7XG5cbiAgICAgIHJlcXVlc3RNc2cuYm9keS52YWx1ZSA9IGluaXRpYWxEYXRhO1xuICAgICAgcmVxdWVzdE1zZy5ib2R5LnZhbHVlLnJlcG9ydGVyID0gX3RoaXMuX293bmVyO1xuXG4gICAgICBpZiAoY3JpdGVyaWEuc2NoZW1hKSB7XG4gICAgICAgIHNjaGVtYSA9IGNyaXRlcmlhLnNjaGVtYTtcbiAgICAgICAgcmVxdWVzdE1zZy5ib2R5LnNjaGVtYSA9IGNyaXRlcmlhLnNjaGVtYTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNyaXRlcmlhLnAycCkgcmVxdWVzdE1zZy5ib2R5LnAycCA9IGNyaXRlcmlhLnAycDtcbiAgICAgIGlmIChjcml0ZXJpYS5zdG9yZSkgcmVxdWVzdE1zZy5ib2R5LnN0b3JlID0gY3JpdGVyaWEuc3RvcmU7XG4gICAgICBpZiAoY3JpdGVyaWEub2JzZXJ2ZXJzKSByZXF1ZXN0TXNnLmJvZHkuYXV0aG9yaXNlID0gY3JpdGVyaWEub2JzZXJ2ZXJzO1xuICAgICAgaWYgKGNyaXRlcmlhLmlkZW50aXR5KSByZXF1ZXN0TXNnLmJvZHkuaWRlbnRpdHkgPSBjcml0ZXJpYS5pZGVudGl0eTtcblxuICAgICAgaWYgKHJlc3VtZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnW3N5bmNoZXIgLSBjcmVhdGVdIC0gcmVzdW1lIG1lc3NhZ2U6ICcsIHJlcXVlc3RNc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tzeW5jaGVyIC0gY3JlYXRlXSAtIGNyZWF0ZSBtZXNzYWdlOiAnLCByZXF1ZXN0TXNnKTtcbiAgICAgIH1cblxuICAgICAgLy9yZXF1ZXN0IGNyZWF0ZSB0byB0aGUgYWxsb2NhdGlvbiBzeXN0ZW0uIENhbiBiZSByZWplY3RlZCBieSB0aGUgUG9saWN5RW5naW5lLlxuICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShyZXF1ZXN0TXNnLCAocmVwbHkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1tzeW5jaGVyIC0gY3JlYXRlXSAtIGNyZWF0ZS1yZXNwb25zZTogJywgcmVwbHkpO1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICAvL3JlcG9ydGVyIGNyZWF0aW9uIGFjY2VwdGVkXG4gICAgICAgICAgbGV0IG9ialVSTCA9IHJlcGx5LmJvZHkucmVzb3VyY2U7XG5cbiAgICAgICAgICBpZiAocmVzdW1lKSB7XG4gICAgICAgICAgICBzY2hlbWEgPSByZXBseS5ib2R5LnNjaGVtYTtcbiAgICAgICAgICAgIGluaXRpYWxEYXRhID0gcmVwbHkuYm9keS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgbmV3T2JqID0gbmV3IERhdGFPYmplY3RSZXBvcnRlcihfdGhpcywgb2JqVVJMLCBzY2hlbWEsICdvbicsIGluaXRpYWxEYXRhLCByZXBseS5ib2R5LmNoaWxkcmVuUmVzb3VyY2VzKTtcbiAgICAgICAgICBfdGhpcy5fcmVwb3J0ZXJzW29ialVSTF0gPSBuZXdPYmo7XG5cbiAgICAgICAgICByZXNvbHZlKG5ld09iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9yZXBvcnRlciBjcmVhdGlvbiByZWplY3RlZFxuICAgICAgICAgIHJlamVjdChyZXBseS5ib2R5LmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbiAgX3N1YnNjcmliZShjcml0ZXJpYSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAvL0ZMT1ctT1VUOiB0aGlzIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IHRvIHRoZSBydW50aW1lIGluc3RhbmNlIG9mIFN5bmNoZXJNYW5hZ2VyIC0+IF9vbkxvY2FsU3Vic2NyaWJlXG4gICAgICBsZXQgc3Vic2NyaWJlTXNnID0ge1xuICAgICAgICB0eXBlOiAnc3Vic2NyaWJlJywgZnJvbTogX3RoaXMuX293bmVyLCB0bzogX3RoaXMuX3N1YlVSTCxcbiAgICAgICAgYm9keToge31cbiAgICAgIH07XG5cbiAgICAgIC8vIEh5cGVydHkgcmVxdWVzdCB0byBiZSBhbiBPYnNlcnZlclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9zcGVjcy9ibG9iL21hc3Rlci9tZXNzYWdlcy9kYXRhLXN5bmMtbWVzc2FnZXMubWQjaHlwZXJ0eS1yZXF1ZXN0LXRvLWJlLWFuLW9ic2VydmVyXG5cbiAgICAgIC8vIFJlc3VtZSBTdWJzY3JpcHRpb25zIGZvciB0aGUgc2FtZSBIeXBlcnR5IFVSTFxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9zcGVjcy9ibG9iL21hc3Rlci9tZXNzYWdlcy9kYXRhLXN5bmMtbWVzc2FnZXMubWQjcmVzdW1lLXN1YnNjcmlwdGlvbnMtZm9yLXRoZS1zYW1lLWh5cGVydHktdXJsXG5cbiAgICAgIC8vIFJlc3VtZSBTdWJzY3JpcHRpb25zIGZvciBhIGNlcnRhaW4gdXNlciBhbmQgZGF0YSBzY2hlbWEgaW5kZXBlbmRlbnRseSBvZiB0aGUgSHlwZXJ0eSBVUkwuXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L3NwZWNzL2Jsb2IvbWFzdGVyL21lc3NhZ2VzL2RhdGEtc3luYy1tZXNzYWdlcy5tZCNyZXN1bWUtc3Vic2NyaXB0aW9ucy1mb3ItYS1jZXJ0YWluLXVzZXItYW5kLWRhdGEtc2NoZW1hLWluZGVwZW5kZW50bHktb2YtdGhlLWh5cGVydHktdXJsXG4gICAgICBpZiAoY3JpdGVyaWEpIHtcbiAgICAgICAgaWYgKGNyaXRlcmlhLmhhc093blByb3BlcnR5KCdwMnAnKSkgc3Vic2NyaWJlTXNnLmJvZHkucDJwID0gY3JpdGVyaWEucDJwO1xuICAgICAgICBpZiAoY3JpdGVyaWEuaGFzT3duUHJvcGVydHkoJ3N0b3JlJykpIHN1YnNjcmliZU1zZy5ib2R5LnN0b3JlID0gY3JpdGVyaWEuc3RvcmU7XG4gICAgICAgIGlmIChjcml0ZXJpYS5oYXNPd25Qcm9wZXJ0eSgnc2NoZW1hJykpIHN1YnNjcmliZU1zZy5ib2R5LnNjaGVtYSA9IGNyaXRlcmlhLnNjaGVtYTtcbiAgICAgICAgaWYgKGNyaXRlcmlhLmhhc093blByb3BlcnR5KCdpZGVudGl0eScpKSBzdWJzY3JpYmVNc2cuYm9keS5pZGVudGl0eSA9IGNyaXRlcmlhLmlkZW50aXR5O1xuICAgICAgICBpZiAoY3JpdGVyaWEuaGFzT3duUHJvcGVydHkoJ3Jlc291cmNlJykpIHN1YnNjcmliZU1zZy5ib2R5LnJlc291cmNlID0gY3JpdGVyaWEucmVzb3VyY2U7XG4gICAgICAgIGlmIChjcml0ZXJpYS5oYXNPd25Qcm9wZXJ0eSgnaWRlbnRpdHknKSkgc3Vic2NyaWJlTXNnLmJvZHkuaWRlbnRpdHkgPSBjcml0ZXJpYS5pZGVudGl0eTtcbiAgICAgIH1cblxuICAgICAgc3Vic2NyaWJlTXNnLmJvZHkucmVzdW1lID0gY3JpdGVyaWEucmVzdW1lO1xuXG4gICAgICAvL1RPRE86IEZvciBGdXJ0aGVyIFN0dWR5XG4gICAgICBsZXQgbXV0dWFsQXV0aGVudGljYXRpb24gPSBjcml0ZXJpYS5tdXR1YWw7XG4gICAgICBpZiAoY3JpdGVyaWEuaGFzT3duUHJvcGVydHkoJ211dHVhbCcpKSBzdWJzY3JpYmVNc2cuYm9keS5tdXR1YWxBdXRoZW50aWNhdGlvbiA9IG11dHVhbEF1dGhlbnRpY2F0aW9uO1xuXG4gICAgICBjb25zb2xlLmxvZygnW3N5bmNoZXJdIC0gc3Vic2NyaWJlIG1lc3NhZ2U6ICcsIGNyaXRlcmlhLCBzdWJzY3JpYmVNc2cpO1xuXG4gICAgICAvL3JlcXVlc3Qgc3Vic2NyaXB0aW9uXG4gICAgICAvL1Byb3Zpc2lvbmFsIGRhdGEgaXMgYXBwbGllZCB0byB0aGUgRGF0YU9iamVjdE9ic2VydmVyIGFmdGVyIGNvbmZpcm1hdGlvbi4gT3IgZGlzY2FyZGVkIGlmIHRoZXJlIGlzIG5vIGNvbmZpcm1hdGlvbi5cbiAgICAgIC8vZm9yIG1vcmUgaW5mbyBzZWUgdGhlIERhdGFQcm92aXNpb25hbCBjbGFzcyBkb2N1bWVudGF0aW9uLlxuICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShzdWJzY3JpYmVNc2csIChyZXBseSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnW3N5bmNoZXJdIC0gc3Vic2NyaWJlLXJlc3BvbnNlOiAnLCByZXBseSk7XG5cbiAgICAgICAgbGV0IHNjaGVtYSA9IHJlcGx5LmJvZHkuc2NoZW1hO1xuICAgICAgICBsZXQgb2JqVVJMID0gcmVwbHkuYm9keS5yZXNvdXJjZTtcblxuICAgICAgICBsZXQgbmV3UHJvdmlzaW9uYWwgPSBfdGhpcy5fcHJvdmlzaW9uYWxzW29ialVSTF07XG4gICAgICAgIGRlbGV0ZSBfdGhpcy5fcHJvdmlzaW9uYWxzW29ialVSTF07XG4gICAgICAgIGlmIChuZXdQcm92aXNpb25hbCkgbmV3UHJvdmlzaW9uYWwuX3JlbGVhc2VMaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlIDwgMjAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tzeW5jaGVyXSAtIG5ldyBEYXRhUHJvdmlzaW9uYWw6ICcsIHJlcGx5LmJvZHkuY2hpbGRyZW5SZXNvdXJjZXMsIG9ialVSTCk7XG4gICAgICAgICAgbmV3UHJvdmlzaW9uYWwgPSBuZXcgRGF0YVByb3Zpc2lvbmFsKF90aGlzLl9vd25lciwgb2JqVVJMLCBfdGhpcy5fYnVzLCByZXBseS5ib2R5LmNoaWxkcmVuUmVzb3VyY2VzKTtcbiAgICAgICAgICBfdGhpcy5fcHJvdmlzaW9uYWxzW29ialVSTF0gPSBuZXdQcm92aXNpb25hbDtcbiAgICAgICAgfSBlbHNlIGlmIChyZXBseS5ib2R5LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbc3luY2hlcl0gLSBuZXcgRGF0YSBPYmplY3QgT2JzZXJ2ZXI6ICcsIHJlcGx5LCBfdGhpcy5fcHJvdmlzaW9uYWxzKTtcblxuICAgICAgICAgIGxldCBpbml0aWFsRGF0YSA9IHJlcGx5LmJvZHkudmFsdWU7XG4gICAgICAgICAgaWYgKCFpbml0aWFsRGF0YS5oYXNPd25Qcm9wZXJ0eSgnY2hpbGRyZW5zJykpIHsgaW5pdGlhbERhdGEuY2hpbGRyZW5zID0ge307IH1cbiAgICAgICAgICBpZiAoIWluaXRpYWxEYXRhLmhhc093blByb3BlcnR5KCdkYXRhJykpIHsgaW5pdGlhbERhdGEuZGF0YSA9IHt9OyB9XG5cbiAgICAgICAgICAvL1RPRE86IG11dHVhbEF1dGhlbnRpY2F0aW9uIEZvciBGdXJ0aGVyIFN0dWR5XG4gICAgICAgICAgbGV0IG5ld09iaiA9IG5ldyBEYXRhT2JqZWN0T2JzZXJ2ZXIoX3RoaXMsIG9ialVSTCwgc2NoZW1hLCAnb24nLCBpbml0aWFsRGF0YSwgbmV3UHJvdmlzaW9uYWwuY2hpbGRyZW4sIHJlcGx5LmJvZHkudmVyc2lvbiwgbXV0dWFsQXV0aGVudGljYXRpb24pO1xuICAgICAgICAgIF90aGlzLl9vYnNlcnZlcnNbb2JqVVJMXSA9IG5ld09iajtcblxuICAgICAgICAgIHJlc29sdmUobmV3T2JqKTtcbiAgICAgICAgICBuZXdQcm92aXNpb25hbC5hcHBseShuZXdPYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXBseS5ib2R5LmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbiAgLy9GTE9XLUlOOiBtZXNzYWdlIHJlY2VpdmVkIGZyb20gYSBsb2NhbCBydW50aW1lIFJlcG9ydGVyT2JqZWN0IC0+IF9vblJlbW90ZVN1YnNjcmliZVxuICBfb25Gb3J3YXJkKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgcmVwb3J0ZXIgPSBfdGhpcy5fcmVwb3J0ZXJzW21zZy5ib2R5LnRvXTtcbiAgICByZXBvcnRlci5fb25Gb3J3YXJkKG1zZyk7XG4gIH1cblxuICAvL0ZMT1ctSU46IG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBhIHJlbW90ZSBTeW5jaGVyIC0+IGNyZWF0ZSAodGhpcyBpcyBhY3R1YWxseSBhbiBpbnZpdGF0aW9uIHRvIHN1YnNjcmliZSlcbiAgX29uUmVtb3RlQ3JlYXRlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgIC8vcmVtb3ZlIFwiL3N1YnNjcmlwdGlvblwiIGZyb20gdGhlIFVSTFxuICAgIGxldCByZXNvdXJjZSA9IG1zZy5mcm9tLnNsaWNlKDAsIC0xMyk7XG5cbiAgICBsZXQgZXZlbnQgPSB7XG4gICAgICB0eXBlOiBtc2cudHlwZSxcbiAgICAgIGZyb206IG1zZy5ib2R5LnNvdXJjZSxcbiAgICAgIHVybDogcmVzb3VyY2UsXG4gICAgICBzY2hlbWE6IG1zZy5ib2R5LnNjaGVtYSxcbiAgICAgIHZhbHVlOiBtc2cuYm9keS52YWx1ZSxcbiAgICAgIGlkZW50aXR5OiBtc2cuYm9keS5pZGVudGl0eSxcblxuICAgICAgYWNrOiAodHlwZSkgPT4ge1xuICAgICAgICBsZXQgbFR5cGUgPSAyMDA7XG4gICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgbFR5cGUgPSB0eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAvL3NlbmQgYWNrIHJlc3BvbnNlIG1lc3NhZ2VcbiAgICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogbXNnLnRvLCB0bzogbXNnLmZyb20sXG4gICAgICAgICAgYm9keTogeyBjb2RlOiBsVHlwZSB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoX3RoaXMuX29uTm90aWZpY2F0aW9uSGFuZGxlcikge1xuICAgICAgY29uc29sZS5pbmZvKCdbU3luY2hlcl0gTk9USUZJQ0FUSU9OLUVWRU5UOiAnLCBldmVudCk7XG4gICAgICBfdGhpcy5fb25Ob3RpZmljYXRpb25IYW5kbGVyKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvL0ZMT1ctSU46IG1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSBhIHJlbW90ZSBEYXRhT2JqZWN0UmVwb3J0ZXIgLT4gZGVsZXRlXG4gIF9vblJlbW90ZURlbGV0ZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAvL3JlbW92ZSBcIi9zdWJzY3JpcHRpb25cIiBmcm9tIHRoZSBVUkxcbiAgICBsZXQgcmVzb3VyY2UgPSBtc2cuYm9keS5yZXNvdXJjZTtcblxuICAgIGxldCBvYmplY3QgPSBfdGhpcy5fb2JzZXJ2ZXJzW3Jlc291cmNlXTtcbiAgICBpZiAob2JqZWN0KSB7XG4gICAgICBsZXQgZXZlbnQgPSB7XG4gICAgICAgIHR5cGU6IG1zZy50eXBlLFxuICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICBpZGVudGl0eTogbXNnLmJvZHkuaWRlbnRpdHksXG5cbiAgICAgICAgYWNrOiAodHlwZSkgPT4ge1xuICAgICAgICAgIGxldCBsVHlwZSA9IDIwMDtcbiAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgbFR5cGUgPSB0eXBlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgLy9UT0RPOiBhbnkgb3RoZXIgZGlmZmVyZW50IG9wdGlvbnMgZm9yIHRoZSByZWxlYXNlIHByb2Nlc3MsIGxpa2UgYWNjZXB0IGJ1dCBub3IgcmVsZWFzZSBsb2NhbD9cbiAgICAgICAgICBpZiAobFR5cGUgPT09IDIwMCkge1xuICAgICAgICAgICAgb2JqZWN0LmRlbGV0ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vc2VuZCBhY2sgcmVzcG9uc2UgbWVzc2FnZVxuICAgICAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogbXNnLnRvLCB0bzogbXNnLmZyb20sXG4gICAgICAgICAgICBib2R5OiB7IGNvZGU6IGxUeXBlLCBzb3VyY2U6IF90aGlzLl9vd25lciB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChfdGhpcy5fb25Ob3RpZmljYXRpb25IYW5kbGVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdOT1RJRklDQVRJT04tRVZFTlQ6ICcsIGV2ZW50KTtcbiAgICAgICAgX3RoaXMuX29uTm90aWZpY2F0aW9uSGFuZGxlcihldmVudCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLCBmcm9tOiBtc2cudG8sIHRvOiBtc2cuZnJvbSxcbiAgICAgICAgYm9keTogeyBjb2RlOiA0MDQsIHNvdXJjZTogX3RoaXMuX293bmVyIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmNoZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3luY2hlci9TeW5jaGVyLmpzIiwiLyoqXG4qIENvcHlyaWdodCAyMDE2IFBUIElub3Zhw6fDo28gZSBTaXN0ZW1hcyBTQVxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcbiogQ29weXJpZ2h0IDIwMTYgRlJBVU5IT0ZFUi1HRVNFTExTQ0hBRlQgWlVSIEZPRVJERVJVTkcgREVSIEFOR0VXQU5EVEVOIEZPUlNDSFVORyBFLlZcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcbiogQ29weXJpZ2h0IDIwMTYgQXBpemVlXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqL1xuXG4vKipcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICogVGhpcyBjbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgY29sbGVjdGluZyBkZWx0YSBjaGFuZ2VzIGluIHJlbW90ZSBvYmplY3RzLCBiZWZvcmUgdGhlIHJlc3BvbnNlIG9mIHN1YnNjcmlwdGlvbiByZWFjaCB0aGUgb2JzZXJ2ZXIuXG4gKiBJdCdzIHVzZWQgaW4gU3luY2hlciAtPiBzdWJzY3JpYmUuIFRoZSBmbG93IGlzIGRlZmluZWQgYXM6XG4gKiAxLiAob2JzZXJ2ZXIpIC0tc3Vic2NyaWJlLS0+IChyZXBvcnRlcilcbiAqIDIuIChvYnNlcnZlcikgPC0tZGVsdGEgdXBkYXRlcy0tIChyZXBvcnRlcilcbiAqIDMuIChvYnNlcnZlcikgPC0tc3Vic2NyaWJlIHJlc3BvbnNlLS0gKHJlcG9ydGVyKVxuICogVGhpcyBtZWFucyB0aGF0IHRoZXJlIGNvdWxkIGJlIGRlbHRhIHVwZGF0ZXMgdHJhbnNmZXJyZWQgYmVmb3JlIHRoZSBzdWJzY3JpcHRpb24gY29uZmlybWF0aW9uLlxuICogU2luY2UgdGhlcmUgaXMgbm8gRGF0YU9iamVjdE9ic2VydmVyIGJlZm9yZSB0aGUgdWJzY3JpcHRpb24gY29uZmlybWF0aW9uLCB0aGVyZSBzaG91bGQgYmUgc29tZSBvdGhlciBvYmplY3QgY29sbGVjdGluZyB0aGUgdXBkYXRlcy5cbiAqIFByb3Zpc2lvbmFsIGRhdGEgaXMgYXBwbGllZCB0byB0aGUgRGF0YU9iamVjdE9ic2VydmVyIGFmdGVyIGNvbmZpcm1hdGlvbi4gT3IgZGlzY2FyZGVkIGlmIHRoZXJlIGlzIG5vIGNvbmZpcm1hdGlvbi5cbiAqL1xuY2xhc3MgRGF0YVByb3Zpc2lvbmFsIHtcbiAgLyogcHJpdmF0ZVxuICBfY2hpbGRyZW5MaXN0ZW5lcnM6IFtNc2dMaXN0ZW5lcl1cbiAgX2xpc3RlbmVyOiBNc2dMaXN0ZW5lclxuXG4gIF9jaGFuZ2VzOiBbXVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKG93bmVyLCB1cmwsIGJ1cywgY2hpbGRyZW4pIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX293bmVyID0gb3duZXI7XG4gICAgX3RoaXMuX3VybCA9IHVybDtcbiAgICBfdGhpcy5fYnVzID0gYnVzO1xuICAgIF90aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuXG4gICAgX3RoaXMuX2NoYW5nZXMgPSBbXTtcbiAgICBfdGhpcy5fYWxsb2NhdGVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIF9hbGxvY2F0ZUxpc3RlbmVycygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2xpc3RlbmVyID0gX3RoaXMuX2J1cy5hZGRMaXN0ZW5lcihfdGhpcy5fdXJsLCAobXNnKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnRGF0YVByb3Zpc2lvbmFsLScgKyBfdGhpcy5fdXJsICsgJy1SQ1Y6ICcsIG1zZyk7XG4gICAgICBfdGhpcy5fY2hhbmdlcy5wdXNoKG1zZyk7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgIF90aGlzLl9jaGlsZHJlbkxpc3RlbmVycyA9IFtdO1xuICAgIGlmIChfdGhpcy5fY2hpbGRyZW4pIHtcbiAgICAgIGxldCBjaGlsZEJhc2VVUkwgPSB1cmwgKyAnL2NoaWxkcmVuLyc7XG4gICAgICBfdGhpcy5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgbGV0IGNoaWxkVVJMID0gY2hpbGRCYXNlVVJMICsgY2hpbGQ7XG4gICAgICAgIGxldCBsaXN0ZW5lciA9IF90aGlzLl9idXMuYWRkTGlzdGVuZXIoY2hpbGRVUkwsIChtc2cpID0+IHtcbiAgICAgICAgICAvL2lnbm9yZSBtc2cgc2VudCBieSBoaW1zZWxmXG4gICAgICAgICAgaWYgKG1zZy5mcm9tICE9PSBvd25lcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF90aGlzLl9jaGlsZHJlbkxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH0pO1xuICAgIH0qL1xuICB9XG5cbiAgX3JlbGVhc2VMaXN0ZW5lcnMoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9saXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIC8qX3RoaXMuX2NoaWxkcmVuTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lci5yZW1vdmUoKTtcbiAgICB9KTsqL1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCkgeyByZXR1cm4gdGhpcy5fY2hpbGRyZW47IH1cblxuICBhcHBseShvYnNlcnZlcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMuX2NoYW5nZXMuZm9yRWFjaCgoY2hhbmdlKSA9PiB7XG4gICAgICBvYnNlcnZlci5fY2hhbmdlT2JqZWN0KG9ic2VydmVyLl9zeW5jT2JqLCBjaGFuZ2UpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFQcm92aXNpb25hbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zeW5jaGVyL0RhdGFQcm92aXNpb25hbC5qcyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduLmpzXG4vLyBtb2R1bGUgaWQgPSAxNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qc1xuLy8gbW9kdWxlIGlkID0gMTQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzXG4vLyBtb2R1bGUgaWQgPSAxNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzXG4vLyBtb2R1bGUgaWQgPSAxNTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBTeW5jaGVyIGZyb20gJy4vc3luY2hlci9TeW5jaGVyJztcbmltcG9ydCBEYXRhT2JqZWN0UmVwb3J0ZXIgZnJvbSAnLi9zeW5jaGVyL0RhdGFPYmplY3RSZXBvcnRlcic7XG5pbXBvcnQgRGF0YU9iamVjdE9ic2VydmVyIGZyb20gJy4vc3luY2hlci9EYXRhT2JqZWN0T2JzZXJ2ZXInO1xuXG5leHBvcnQge1N5bmNoZXIsIERhdGFPYmplY3RSZXBvcnRlciwgRGF0YU9iamVjdE9ic2VydmVyfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TeW5jaGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	// version: 0.5.1
	// date: Tue Mar 07 2017 16:18:13 GMT+0000 (WET)
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


	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define("IdentityFactory", [], factory);
		else if(typeof exports === 'object')
			exports["IdentityFactory"] = factory();
		else
			root[""] = root[""] || {}, root[""]["IdentityFactory"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
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
	/******/ 	// identity function for calling harmony imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };
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
	/******/ 	return __webpack_require__(__webpack_require__.s = 161);
	/******/ })
	/************************************************************************/
	/******/ ({

	/***/ 119:
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* The UserProfile according to User Identity Data Model
	*/

	var UserProfile = function UserProfile(username, userURL, avatar, cn, locale) {
	  (0, _classCallCheck3.default)(this, UserProfile);


	  if (username) {
	    this.username = username;
	  }
	  if (avatar) {
	    this.avatar = avatar;
	  }
	  if (cn) {
	    this.cn = cn;
	  }
	  if (locale) {
	    this.locale = locale;
	  }
	  if (userURL) {
	    this.userURL = userURL;
	  }
	};

	exports.default = UserProfile;
	module.exports = exports["default"];

	/***/ }),

	/***/ 128:
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(8);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _UserProfile = __webpack_require__(119);

	var _UserProfile2 = _interopRequireDefault(_UserProfile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MessageBodyIdentity = function MessageBodyIdentity(username, userURL, avatar, cn, locale, idp, assertion) {
	  (0, _classCallCheck3.default)(this, MessageBodyIdentity);


	  if (!idp) throw new Error('IDP should be a parameter');
	  if (!username) throw new Error('username should be a parameter');

	  this.idp = idp;

	  if (assertion) {
	    this.assertion = assertion;
	  }
	  this.userProfile = new _UserProfile2.default(username, userURL, avatar, cn, locale);
	}; /**
	   * The Identity info to be added to Message.Body.Identity
	   */

	exports.default = MessageBodyIdentity;
	module.exports = exports['default'];

	/***/ }),

	/***/ 161:
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UserProfile = undefined;

	var _UserProfile = __webpack_require__(119);

	var _UserProfile2 = _interopRequireDefault(_UserProfile);

	var _MessageBodyIdentity = __webpack_require__(128);

	var _MessageBodyIdentity2 = _interopRequireDefault(_MessageBodyIdentity);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.UserProfile = _UserProfile2.default;
	exports.default = _MessageBodyIdentity2.default;

	/***/ }),

	/***/ 8:
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	/***/ })

	/******/ });
	});
	//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKioqKioqKioiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGQyNWQ5ZWFiM2RlYzJhMzNmYWZiP2VlNGMqKioqKioqKioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lkZW50aXR5L1VzZXJQcm9maWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9pZGVudGl0eS9NZXNzYWdlQm9keUlkZW50aXR5LmpzIiwid2VicGFjazovLy8uL3NyYy9JZGVudGl0eUZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanM/MjFhZioqKioqKioqKiJdLCJuYW1lcyI6WyJVc2VyUHJvZmlsZSIsInVzZXJuYW1lIiwidXNlclVSTCIsImF2YXRhciIsImNuIiwibG9jYWxlIiwiTWVzc2FnZUJvZHlJZGVudGl0eSIsImlkcCIsImFzc2VydGlvbiIsIkVycm9yIiwidXNlclByb2ZpbGUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7Ozs7SUFLTUEsVyxHQUVKLHFCQUFZQyxRQUFaLEVBQXNCQyxPQUF0QixFQUErQkMsTUFBL0IsRUFBdUNDLEVBQXZDLEVBQTJDQyxNQUEzQyxFQUFtRDtBQUFBOzs7QUFFakQsTUFBSUosUUFBSixFQUFjO0FBQUUsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFBMkI7QUFDM0MsTUFBSUUsTUFBSixFQUFZO0FBQUUsU0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQXVCO0FBQ3JDLE1BQUlDLEVBQUosRUFBUTtBQUFFLFNBQUtBLEVBQUwsR0FBVUEsRUFBVjtBQUFlO0FBQ3pCLE1BQUlDLE1BQUosRUFBWTtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUF1QjtBQUNyQyxNQUFJSCxPQUFKLEVBQWE7QUFBRSxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFBeUI7QUFFekMsQzs7a0JBR1lGLFc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkZjs7Ozs7O0lBRU1NLG1CLEdBRUosNkJBQVlMLFFBQVosRUFBc0JDLE9BQXRCLEVBQStCQyxNQUEvQixFQUF1Q0MsRUFBdkMsRUFBMkNDLE1BQTNDLEVBQW1ERSxHQUFuRCxFQUF3REMsU0FBeEQsRUFBbUU7QUFBQTs7O0FBRWpFLE1BQUksQ0FBQ0QsR0FBTCxFQUFVLE1BQU0sSUFBSUUsS0FBSixDQUFVLDJCQUFWLENBQU47QUFDVixNQUFJLENBQUNSLFFBQUwsRUFBZSxNQUFNLElBQUlRLEtBQUosQ0FBVSxnQ0FBVixDQUFOOztBQUVmLE9BQUtGLEdBQUwsR0FBV0EsR0FBWDs7QUFFQSxNQUFJQyxTQUFKLEVBQW9CO0FBQUUsU0FBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFBNkI7QUFDbkQsT0FBS0UsV0FBTCxHQUFtQiwwQkFBZ0JULFFBQWhCLEVBQTBCQyxPQUExQixFQUFtQ0MsTUFBbkMsRUFBMkNDLEVBQTNDLEVBQStDQyxNQUEvQyxDQUFuQjtBQUVELEMsRUFsQkg7Ozs7a0JBdUJlQyxtQjs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCZjs7OztBQUNBOzs7Ozs7UUFFU04sVzs7Ozs7Ozs7O0FDSFQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6IklkZW50aXR5RmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiSWRlbnRpdHlGYWN0b3J5XCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIklkZW50aXR5RmFjdG9yeVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJcIl0gPSByb290W1wiXCJdIHx8IHt9LCByb290W1wiXCJdW1wiSWRlbnRpdHlGYWN0b3J5XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE2MSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDI1ZDllYWIzZGVjMmEzM2ZhZmIiLCIvKipcbiogVGhlIFVzZXJQcm9maWxlIGFjY29yZGluZyB0byBVc2VyIElkZW50aXR5IERhdGEgTW9kZWxcbiovXG5cblxuY2xhc3MgVXNlclByb2ZpbGUge1xuXG4gIGNvbnN0cnVjdG9yKHVzZXJuYW1lLCB1c2VyVVJMLCBhdmF0YXIsIGNuLCBsb2NhbGUpIHtcblxuICAgIGlmICh1c2VybmFtZSkgeyB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7IH1cbiAgICBpZiAoYXZhdGFyKSB7IHRoaXMuYXZhdGFyID0gYXZhdGFyOyB9XG4gICAgaWYgKGNuKSB7IHRoaXMuY24gPSBjbjsgfVxuICAgIGlmIChsb2NhbGUpIHsgdGhpcy5sb2NhbGUgPSBsb2NhbGU7IH1cbiAgICBpZiAodXNlclVSTCkgeyB0aGlzLnVzZXJVUkwgPSB1c2VyVVJMOyB9XG5cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUHJvZmlsZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pZGVudGl0eS9Vc2VyUHJvZmlsZS5qcyIsIi8qKlxuKiBUaGUgSWRlbnRpdHkgaW5mbyB0byBiZSBhZGRlZCB0byBNZXNzYWdlLkJvZHkuSWRlbnRpdHlcbiovXG5cbmltcG9ydCBVc2VyUHJvZmlsZSBmcm9tICcuL1VzZXJQcm9maWxlJztcblxuY2xhc3MgTWVzc2FnZUJvZHlJZGVudGl0eSB7XG5cbiAgY29uc3RydWN0b3IodXNlcm5hbWUsIHVzZXJVUkwsIGF2YXRhciwgY24sIGxvY2FsZSwgaWRwLCBhc3NlcnRpb24pIHtcblxuICAgIGlmICghaWRwKSB0aHJvdyBuZXcgRXJyb3IoJ0lEUCBzaG91bGQgYmUgYSBwYXJhbWV0ZXInKTtcbiAgICBpZiAoIXVzZXJuYW1lKSB0aHJvdyBuZXcgRXJyb3IoJ3VzZXJuYW1lIHNob3VsZCBiZSBhIHBhcmFtZXRlcicpO1xuXG4gICAgdGhpcy5pZHAgPSBpZHA7XG5cbiAgICBpZiAoYXNzZXJ0aW9uKSAgICAgIHsgdGhpcy5hc3NlcnRpb24gPSBhc3NlcnRpb247IH1cbiAgICB0aGlzLnVzZXJQcm9maWxlID0gbmV3IFVzZXJQcm9maWxlKHVzZXJuYW1lLCB1c2VyVVJMLCBhdmF0YXIsIGNuLCBsb2NhbGUpO1xuXG4gIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VCb2R5SWRlbnRpdHk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaWRlbnRpdHkvTWVzc2FnZUJvZHlJZGVudGl0eS5qcyIsImltcG9ydCBVc2VyUHJvZmlsZSBmcm9tICcuL2lkZW50aXR5L1VzZXJQcm9maWxlJztcbmltcG9ydCBNZXNzYWdlQm9keUlkZW50aXR5IGZyb20gJy4vaWRlbnRpdHkvTWVzc2FnZUJvZHlJZGVudGl0eSc7XG5cbmV4cG9ydCB7IFVzZXJQcm9maWxlIH07XG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlQm9keUlkZW50aXR5O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0lkZW50aXR5RmFjdG9yeS5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IDggOSAxMCJdLCJzb3VyY2VSb290IjoiIn0=

/***/ }
/******/ ])
});
;