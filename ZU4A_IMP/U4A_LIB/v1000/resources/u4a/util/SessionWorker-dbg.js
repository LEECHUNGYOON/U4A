//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.util.SessionWorker",[
"sap/ui/core/Control"

], function(Control){
    "use strict";

    var SessionWorker = Control.extend("u4a.util.SessionWorker", {
        metadata : {
            library : "u4a.util",
            properties : {
               minute : { type: "int", defaultValue: 0 },   // max value: 120
               activeWorker : { type : "boolean", defaultValue : true },
            },
            events : {
                finished : {
                    allowPreventDefault: true,
                }
            }

        }, // end of metadata

        _oWorker  : null,   // Worker instance
        _maxMinute: 120,    // Max Minute(minute 속성의 최대 허용값)

        init : function(){

            // 브라우저가 Worker를 지원하는지 여부 확인
            if(!window.Worker) {
                console.log("Does not support this browser.");
                return;
            }

        }, // end of init

        renderer : function(oRm, oWorker){
			
            oRm.write("<div");
            oRm.writeControlData(oWorker);
            oRm.writeAttribute("visibility", "hidden");
			oRm.addStyle("display", 'none');
			oRm.writeStyles();
            oRm.write(">");
            oRm.write("</div>");
			
        },

        setActiveWorker : function(bActive){
			
            var oMsgParam = {};

            if(!bActive){
                if(this._oWorker != null){

                    oMsgParam.isActive = false;

                    this._oWorker.postMessage(oMsgParam); // Worker Interval을 중지한다.
                    this._oWorker.terminate();
                    this._oWorker = null;
                }

                return;
            }

            this.createWorker();

        },

        createWorker : function(){
			
            var oMsgParam = {};
            var iKeepTime = this.getMinute();
			
			if(this._oWorker instanceof Worker){
				this._oWorker.terminate();
				this._oWorker = null;
            }
			
			if(iKeepTime == 0){
				return;
			}

            this._oWorker = new Worker('/zu4a_imp/publish/CommonJS/workers/SessionWorker.js');

            oMsgParam.keeptime = iKeepTime;

            this._oWorker.postMessage(oMsgParam);  // 워커에 메시지를 보낸다.

            this._oWorker.onmessage = function(e){
                this.onMessage(e);
            }.bind(this);

        },

        onMessage : function(e){

            var receiveData = e.data;

            if(receiveData != "X"){
                return;
            }
			
			this.fireFinished();
			
        }, // end of onMessage
		
		onAfterRendering : function(){            
         
            /**
             * 2024-11-21 yoon ---------- Start
             * minute 속성에 2시간(120분) 이상 입력 시, 덤프를 발생시킨다
             */
            if(this.getMinute() > this._maxMinute){

                let _sErrMsg = "The 'minute' property of the 'SessionWorker' cannot exceed a maximum value of 120 minutes.";

				// U4A 덤프 오류를 발생시킨다.!!
				if(oU4AErroHandle && typeof oU4AErroHandle.seterroHTML === "function"){
					oU4AErroHandle.seterroHTML(_sErrMsg);
				}
				
				console.error(_sErrMsg);

				throw new Error(_sErrMsg);

            }
            /**
             * 2024-11-21 yoon ---------- End
             * minute 속성에 2시간(120분) 이상 입력 시, 덤프를 발생시킨다
             */


            // 워커를 생성한다.
			this.createWorker();
			
		},
		
		exit : function(){
			
			if(this._oWorker){
				this._oWorker.terminate();
				this._oWorker = null;
			}
			
		}

    });

    return SessionWorker;

});