jQuery.sap.declare("sapui6.ui.commons.NumberField"),sap.ui.commons.TextField.extend("sapui6.ui.commons.NumberField",{library:"sapui6.ui.commons",renderer:{},onAfterRendering:function(){this.attachBrowserEvent("keydown",function(e){var n=window.event?event.keyCode:e.which,t=window.event?event.ctrlKey:e.ctrlKey,r=window.event?event.shiftKey:e.shiftKey;if(r)window.event?event.preventDefault?event.preventDefault():event.returnValue=!1:e.preventDefault();else{if(n>=48&&57>=n||n>=96&&105>=n||9==n||8==n||13==n||37==n||39==n||46==n||109==n||189==n)return!0;if(t&&86==n)return!0;if(t&&67==n)return!0;window.event?event.preventDefault?event.preventDefault():event.returnValue=!1:e.preventDefault()}})}});