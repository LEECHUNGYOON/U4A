jQuery.sap.declare("sapui6.ui.commons.RegExpField"),sap.ui.commons.TextField.extend("sapui6.ui.commons.RegExpField",{library:"sapui6.ui.commons",metadata:{properties:{message:{type:"string",defaultValue:null},before:{type:"string",defaultValue:null},after:{type:"string",defaultValue:null}}},renderer:{},regExp:null,EMAIL:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,URL:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,IP_ADDRESS:/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,USER_ID:/^[a-z0-9_-]{3,16}$/,onAfterRendering:function(){this.getBefore()&&$(this.getInputDomRef()).before('<span style="vertical-align:sub;">'+this.getBefore()+"</span>"),this.getAfter()&&$(this.getInputDomRef()).after('<span style="vertical-align:sub;">'+this.getAfter()+"</span>"),jQuery.sap.require("sap.ui.ux3.ToolPopup");var e=new sap.ui.ux3.ToolPopup({opener:this,content:[new sap.ui.commons.TextView({text:this.getMessage()})]}),t=this;this.attachBrowserEvent("blur",function(){jQuery.sap.require("sap.ui.commons.MessageBox"),t.regExp&&""!=t.getLiveValue()?t.regExp.test(t.getLiveValue())?t.setValueState():t.getMessage()&&(this.focus(),t.setValueState(sap.ui.core.ValueState.Error),e.open(sap.ui.core.Popup.Dock.BeginBottom,sap.ui.core.Popup.Dock.BeginTop),jQuery.sap.delayedCall(2e3,t,function(){e.close()})):t.setValueState()})}}),sapui6.ui.commons.RegExpField.prototype.setRegExp=function(e){this.regExp=e};