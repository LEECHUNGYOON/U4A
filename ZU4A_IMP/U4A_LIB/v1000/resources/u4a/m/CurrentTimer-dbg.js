//Copyright 2017. INFOCG Inc. all rights reserved. 

sap.ui.define("u4a.m.CurrentTimer",[
"sap/ui/core/Control",
"sap/ui/core/library",

], function(Control, coreLibrary){
    "use strict";

    var TextAlign = coreLibrary.TextAlign;

    var CurrentTimer = Control.extend("u4a.m.CurrentTimer", {
        metadata : {
            library : "u4a.m",
            properties : {
                width : { type : "sap.ui.core.CSSSize", defaultValue : null },
                textAlign : { type: "sap.ui.core.TextAlign", defaultValue: TextAlign.Begin },
                fontSize : { type : "sap.ui.core.CSSSize", defaultValue : "20px" },
                fontColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
                support2400 : {type: "boolean", defaultValue: false}
            }

        }, // end of metadata

        renderer : function(oRm, oControl){
            
			var sWidth = oControl.getWidth(),
                sFontSize = oControl.getFontSize(),
                sFontColor = oControl.getFontColor(),
                sTextAlign = oControl.getTextAlign();

            oRm.write("<span");
            oRm.writeControlData(oControl);
			oRm.addStyle("display", "inline-block");
            sWidth ? oRm.addStyle("width", sWidth) : oRm.addStyle("max-width", "100%");

            oRm.addStyle("color", sFontColor);
            oRm.addStyle("font-size", sFontSize);


            /***************************************************************** 
            	2020-07-28 by soccerhs 
            	- TextAlign Property의 'End' 값이 IE 에서 인식 안되는 문제 개선
            ******************************************************************/
            /*
            if(sTextAlign){
                sTextAlign = oControl.getTextAlign(sTextAlign);
                if(sTextAlign){
                    oRm.addStyle("text-align", sTextAlign);
                }
            }
            */
            if(sTextAlign){
            	var sBrowser = sap.ui.Device.browser.name;
               
                if(sBrowser == "ie" && sTextAlign == TextAlign.End){
                	oRm.addStyle("text-align", "right");
                } 
                else {
                	oRm.addStyle("text-align", sTextAlign); 
                }
            }
			
			oRm.writeClasses();
            oRm.writeStyles();
            oRm.write(">");

            oRm.write("</span>");

        }, // end of renderer

        onAfterRendering : function(oEvent){
			
			var oControl = oEvent.srcControl;
			
			var oParam = {};
            var bSupport2400 = oControl.getSupport2400();

            oParam.support2400 = bSupport2400;
			
			if(this._oWorker instanceof Worker){
				this._oWorker.terminate();
            }
			
            this._oWorker = new Worker('/zu4a_imp/publish/CommonJS/workers/CurrentTimerWorker.js');

            this._oWorker.postMessage(oParam);  // 워커에 메시지를 보낸다.

            this._oWorker.onmessage = function(e){
                this.onMessage(e);
            }.bind(this);

        }, // end of onAfterRendering
		
		// Worker Message
		onMessage : function(e){
			var oTimer = document.getElementById(this.getId());
				if(oTimer == null){
					return;
				}
				oTimer.innerHTML = e.data;
		},
		
		exit : function(){
			        
			this._oWorker.terminate();
			this._oWorker = null;
		}

    });

    return CurrentTimer;

});