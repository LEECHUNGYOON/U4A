/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){function e(e,r){if(!(e instanceof r)){throw new TypeError("Cannot call a class as a function")}}function r(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||false;t.configurable=true;if("value"in t)t.writable=true;Object.defineProperty(e,t.key,t)}}function n(e,n,t){if(n)r(e.prototype,n);if(t)r(e,t);Object.defineProperty(e,"prototype",{writable:false});return e}
/*!
   * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
   */var t=function(){function r(n){e(this,r);this.provider=n;this.sina=n.sina}n(r,[{key:"getActiveResult",value:function e(r){for(var n=0;n<r.length;++n){var t=r[n];if(t.IsCurrentQuery){return t}}return null}},{key:"parse",value:function e(r){var n,t;var i={success:false,description:""};var u=(r===null||r===void 0?void 0:(n=r.headers)===null||n===void 0?void 0:n["Chatgptresponse"])||(r===null||r===void 0?void 0:(t=r.headers)===null||t===void 0?void 0:t["chatgptresponse"]);if(u){i.success=true;try{i.description=JSON.stringify(JSON.parse(u),null,4)}catch(e){i.description=u}u}return i}}]);return r}();var i={__esModule:true};i.EshGptParser=t;return i})})();
//# sourceMappingURL=EshGptParser.js.map