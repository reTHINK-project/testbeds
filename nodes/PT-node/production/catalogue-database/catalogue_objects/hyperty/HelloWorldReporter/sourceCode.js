!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("activate",[],t):"object"==typeof exports?exports.activate=t():e.activate=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}();t.default=function(e,t,r,o){return{name:"HelloWorldReporter",instance:new a(e,t,r,o)}};var n=function(e){return e&&e.__esModule?e:{default:e}}(r(1));var a=function(){function e(t,r,o,n){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),!t)throw new Error("The hypertyURL is a needed parameter");if(!r)throw new Error("The MiniBus is a needed parameter");if(!o)throw new Error("The configuration is a needed parameter");if(!n)throw new Error("The factory is a needed parameter");var a=n.divideURL(t).domain;this._domain=a,this._objectDescURL="hyperty-catalogue://catalogue."+a+"/.well-known/dataschema/HelloWorldDataSchema",this._factory=n,console.log("HelloWorldReporter configuration",o);var i=this._factory.createSyncher(t,r,o);this._syncher=i}return o(e,[{key:"hello",value:function(e){var t=this,r=t._syncher;return new Promise(function(o,a){var i=Object.assign({resources:["hello"]},{});r.create(t._objectDescURL,[e],n.default,!1,!1,"hello",{},i).then(function(e){console.info("1. Return Created Hello World Data Object Reporter",e),t.helloObjtReporter=e,t.prepareDataObjectReporter(e),o(e)}).catch(function(e){console.error(e),a(e)})})}},{key:"prepareDataObjectReporter",value:function(e){e.onSubscription(function(e){console.info("-------- Hello World Reporter received subscription request --------- \n"),e.accept()}),e.onRead(function(e){e.accept()})}},{key:"bye",value:function(e){console.log("bye:",this.helloObjtReporter),this.helloObjtReporter.data.hello=e||"bye, bye"}},{key:"onReporterResume",value:function(e){this._onReporterResume=e}}]),e}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={name:"hello",hello:"Hello buddy!!"}}]).default});