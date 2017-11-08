!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("activate",[],t):"object"==typeof exports?exports.activate=t():e.activate=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t,n){return{name:"VertxProtoStub",instance:new r(e,t,n)}}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;t.length>n;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();t.default=i;var r=function(){function e(t,n,i){var s=this;if(o(this,e),!t)throw Error("The runtimeProtoStubURL is a needed parameter");if(!n)throw Error("The bus is a needed parameter");if(!i)throw Error("The config is a needed parameter");if(!i.url)throw Error("The config.url is a needed parameter");if(!i.runtimeURL)throw Error("The config.runtimeURL is a needed parameter");var r=this;this._id=0,this._continuousOpen=!0,this._runtimeProtoStubURL=t,this._bus=n,this._config=i,this._runtimeSessionURL=i.runtimeURL,this._reOpen=!1,n.addListener("*",function(e){console.log("[VertxProtoStub] outgoing message: ",e),r._open(function(){r._filter(e)&&(e.body||(e.body={}),e.body.via=s._runtimeProtoStubURL,console.log("[VertxProtoStub: ProtoStub -> MN]",e),r._sock.send(JSON.stringify(e)))})}),r._sendStatus("created")}return s(e,[{key:"connect",value:function(){var e=this;e._continuousOpen=!0,e._open(function(){})}},{key:"disconnect",value:function(){var e=this;e._continuousOpen=!1,e._sock&&e._sendClose()}},{key:"_sendOpen",value:function(e){var t=this;this._sendStatus("in-progress"),t._id++;var n={id:t._id,type:"open",from:t._runtimeSessionURL,to:"mn:/session"};t._reOpen&&(n.type="re-open");var o=!1;t._sessionCallback=function(i){"response"===i.type&i.id===n.id&&(o=!0,200===i.body.code?(i.body.runtimeToken&&(t._reOpen=!0,t._runtimeSessionURL=t._config.runtimeURL+"/"+i.body.runtimeToken),t._sendStatus("live"),e()):t._sendStatus("failed",i.body.desc))},t._sock.send(JSON.stringify(n)),setTimeout(function(){o||t._sendStatus("disconnected","Timeout from mn:/session")},3e3)}},{key:"_sendClose",value:function(){var e=this;e._id++;var t={id:e._id,type:"close",from:e._runtimeSessionURL,to:"mn:/session"};e._reOpen=!1,e._runtimeSessionURL=e._config._runtimeURL,e._sock.send(JSON.stringify(t))}},{key:"_sendStatus",value:function(e,t){var n=this;console.log("[VertxProtostub status changed] to ",e),n._state=e;var o={type:"update",from:n._runtimeProtoStubURL,to:n._runtimeProtoStubURL+"/status",body:{value:e}};t&&(o.body.desc=t),n._bus.postMessage(o)}},{key:"_waitReady",value:function(e){var t=this;1===t._sock.readyState?e():setTimeout(function(){t._waitReady(e)})}},{key:"_filter",value:function(e){return!e.body||e.body.via!==this._runtimeProtoStubURL}},{key:"_deliver",value:function(e){e.body||(e.body={}),e.body.via=this._runtimeProtoStubURL,console.log("[VertxProtoStub: MN -> ProtoStub]",e),this._bus.postMessage(e)}},{key:"_open",value:function(e){var t=this;this._continuousOpen&&(t._sock?t._waitReady(e):(t._sock="ws"===t._config.url.substring(0,2)?new WebSocket(t._config.url):new SockJS(t._config.url),t._sock.onopen=function(){t._sendOpen(function(){e()})},t._sock.onmessage=function(e){var n=JSON.parse(e.data);console.log("[VertxProtoStub: MN -> SOCKET ON MESSAGE]",n),"mn:/session"===n.from?t._sessionCallback&&t._sessionCallback(n):t._filter(n)&&t._deliver(n)},t._sock.onclose=function(e){var n=void 0;n=1e3===e.code?"Normal closure, meaning that the purpose for which the connection was established has been fulfilled.":1001===e.code?"An endpoint is 'going away', such as a server going down or a browser having navigated away from a page.":1002===e.code?"An endpoint is terminating the connection due to a protocol error":1003===e.code?"An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).":1004===e.code?"Reserved. The specific meaning might be defined in the future.":1005===e.code?"No status code was actually present.":1006===e.code?"The connection was closed abnormally, e.g., without sending or receiving a Close control frame":1007===e.code?"An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).":1008===e.code?'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.':1009===e.code?"An endpoint is terminating the connection because it has received a message that is too big for it to process.":1010===e.code?"An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: "+e.reason:1011===e.code?"A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.":1015===e.code?"The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).":"Unknown reason",delete t._sock,t._sendStatus("disconnected",n)}))}},{key:"config",get:function(){return this._config}},{key:"runtimeSession",get:function(){return this._runtimeSessionURL}}]),e}()}]).default});