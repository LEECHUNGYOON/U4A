/*
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Messaging"],function(t){"use strict";var e=function(t){this._oModel=t};e.prototype.getContextFromResponse=function(t){var e="/"+this._oModel.getKey(t);return this._oModel.getContext(e)};e.getEntitySetFromContext=function(t){var e,o;if(!t){throw new Error("No context")}if(t&&t.getPath){e=t.getPath().split("(")[0];o=e.substring(1)}if(o==null){return null}else{return t.getModel().getMetaModel().getODataEntitySet(o)&&t.getModel().getMetaModel().getODataEntitySet(o).name}};e.prototype.hasClientMessages=function(){var e=0;var o=t.getMessageModel().getData();if(o){e=o.length}for(var r=0;r<e;r++){var n=o[r];if(n.processor.getMetadata()._sClassName==="sap.ui.core.message.ControlMessageProcessor"){return true}}return false};e.prototype.destroy=function(){this._oModel=null};return e},true);
//# sourceMappingURL=ModelUtil.js.map