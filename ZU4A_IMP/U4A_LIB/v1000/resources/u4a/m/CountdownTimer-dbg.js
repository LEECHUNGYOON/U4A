//Copyright 2017. INFOCG Inc. all rights reserved. 

sap.ui.define("u4a.m.CountdownTimer",[
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var Timer = Control.extend("u4a.m.CountdownTimer", {
        metadata : {
            library : "u4a.m",
            properties : {
                fontSize : { type : "sap.ui.core.CSSSize", defaultValue : "20px" },
                fontColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
                hourCount : { type : "int", defaultValue : 0 },
                minCount : { type : "int", defaultValue : 0 },
                secCount : { type : "int", defaultValue : 0 },
                stopped : { type : "boolean", defaultValue : false },
            },
            events : {
                "countdownComplete" : {},
            }

        }, // end of metadata

        renderer : function(oRm, oControl){
            oRm.write("<div");
            oRm.writeControlData(oControl);

            oRm.addStyle("font-size", oControl.getFontSize());
            oRm.addStyle("color", oControl.getFontColor());
            oRm.addStyle("font-weight", "bold");

            oRm.writeStyles();
            oRm.write(">");
            oRm.write("</div>");

        }, // end of renderer

        setStopped : function(bStopped){
            this.setProperty("stopped", bStopped);
        },

        setSecCount : function(iSec){
            this.setProperty("secCount", iSec);
            this.rerender();
        },

        setMinCount : function(iMin){
            this.setProperty("minCount", iMin);
            this.rerender();
        },

        setHourCount : function(iHour){
            this.setProperty("hourCount", iHour);
            this.rerender();
        },

        _stopTimer : function(){

            this.setProperty("stopped", false, true);
            this.setProperty("hourCount", 0, true);
            this.setProperty("minCount", 0, true);
            this.setProperty("secCount", 0, true);
            
            if(this._oWorker instanceof Worker){
              this._oWorker.terminate();
            }
            
            this._Print("00" + ":" + "00" + ":" + "00");
            
            this.fireCountdownComplete();

        },
		
		 _Print : function(sTxt){
          
			var oTimer = document.getElementById(this.getId());
			
			if(oTimer == null){
				return;
			}
		    
			oTimer.innerHTML = sTxt;
        
        },
		
        onMessage : function(e){
            
            var oData = e.data;
            
            if(oData.isStop == true){
                this._stopTimer();
            }
            
            this._Print(oData.print);
            
        },

        onAfterRendering : function(oEvent){

             var oControl = oEvent.srcControl;
			 
            // Worker에 보낼 파라미터
            var oSendParam = {};

            var h = oControl.getHourCount(),
                m = oControl.getMinCount(),
                s = oControl.getSecCount();

            var countDownDate = new Date();
                countDownDate.setHours(countDownDate.getHours() + h);
                countDownDate.setMinutes(countDownDate.getMinutes() + m);
                countDownDate.setSeconds(countDownDate.getSeconds() + s);

            // Worker에 보낼 파라미터를 구성한다.
            oSendParam.countDownDate = countDownDate;
            //oSendParam.isStop = oControl.getStopped();

            if(oControl.getStopped()){
                oControl._stopTimer();
                return;
            }

            if(this._oWorker instanceof Worker){
				this._oWorker.terminate();
				this._oWorker = null;
            }

            this._oWorker = new Worker('/zu4a_imp/publish/CommonJS/workers/CountdownTimerWorker.js');

            this._oWorker.postMessage(oSendParam);  // 워커에 메시지를 보낸다.

            this._oWorker.onmessage = function(e){
                this.onMessage(e);
            }.bind(this);
		
		
			// style class 적용
			var _aCssClass = this.aCustomStyleClasses;
			if(_aCssClass == null){
				return;
			}
			
			var sCssClassNm = _aCssClass.join(" ");
			jQuery(this.getDomRef()).addClass(sCssClassNm);
			
        }, // end of onAfterRendering
		
		exit : function(){
			
			if(this._oWorker){
				this._oWorker.terminate();
				this._oWorker = null;				
			}			
			
		}

    });

    return Timer;

});