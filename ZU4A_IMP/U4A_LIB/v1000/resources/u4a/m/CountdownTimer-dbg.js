// Copyright 2017. INFOCG Inc. all rights reserved.

/*======================================================================
 * Title      : u4a.m.CountdownTimer
 * Description: 지정된 시·분·초(hour/min/sec)부터 카운트다운을 수행하는
 *              UI5 기반 타이머 컨트롤.
 *              Web Worker를 이용해 메인 스레드 부하 없이 초 단위로
 *              잔여 시간을 계산·표시하며,
 *              모든 브라우저 및 모바일 환경에서 안정적으로 동작한다.
 *
 * Behavior   :
 *   - 속성값 (hourCount, minCount, secCount)을 기준으로 카운트다운 시작
 *   - 남은 시간이 0이 되면 "countdownComplete" 이벤트 발생
 *   - 실행 중 속성 변경 시 워커는 유지되고, 변경된 시간값을 전달받아 재계산
 *   - visibilitychange 시 워커 유지, 종료시각 그대로 재전송 (보정 없음)
 *   - 초기 렌더링 시 즉시 시간 표시로 딜레이 없는 UI 제공
 *
 * Internal   :
 *   - Worker는 Blob을 이용해 동적으로 생성됨.
 *   - u4a.m.CountdownTimer 전용 워커 스크립트를 getCountdownWorkerCode()로 생성.
 *   - 워커는 종료되지 않고 postMessage()로 새 파라미터(countDownDate)만 수신.
 *   - Worker 종료 시 URL.revokeObjectURL()로 메모리 해제.
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-11-01
 *======================================================================*/

sap.ui.define("u4a.m.CountdownTimer", [
    "sap/ui/core/Control",
], function(Control) {
    "use strict";

    var Timer = Control.extend("u4a.m.CountdownTimer", {
        metadata: {
            library: "u4a.m",
            properties: {
                fontSize: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "20px"
                },
                fontColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "#000000"
                },
                hourCount: {
                    type: "int",
                    defaultValue: 0
                },
                minCount: {
                    type: "int",
                    defaultValue: 0
                },
                secCount: {
                    type: "int",
                    defaultValue: 0
                },
                visible: {
                    type: "boolean",
                    defaultValue: true
                }
            },
            events: {
                "countdownComplete": {},
            }
        },

        //======================================================================
        // Renderer
        //======================================================================
        renderer: function(oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("font-size", oControl.getFontSize());
            oRm.addStyle("color", oControl.getFontColor());
            oRm.addStyle("font-weight", "bold");
            if (!oControl.getVisible()) {
                oRm.addStyle("display", "none");
            }
            oRm.writeStyles();
            oRm.write(">");

            var h = oControl.getHourCount(),
                m = oControl.getMinCount(),
                s = oControl.getSecCount();
            oRm.writeEscaped(oControl._pad2(h) + ":" + oControl._pad2(m) + ":" + oControl._pad2(s));
            oRm.write("</div>");
        },

        //======================================================================
        // onAfterRendering
        //======================================================================
        onAfterRendering: function() {

            console.log("u4a.m.CountdownTimer ---> onAfterRendering!!");

            var h = this.getHourCount() | 0,
                m = this.getMinCount() | 0,
                s = this.getSecCount() | 0;

            if (s >= 60) {
                m += Math.floor(s / 60);
                s = s % 60;
            }
            if (m >= 60) {
                h += Math.floor(m / 60);
                m = m % 60;
            }

            this.setProperty("hourCount", h, true);
            this.setProperty("minCount", m, true);
            this.setProperty("secCount", s, true);

            this._Print(this._pad2(h) + ":" + this._pad2(m) + ":" + this._pad2(s));

            if (h === 0 && m === 0 && s === 0) {
                if (this._bWorkerStarted) {
                    this._stopTimer();
                } else {
                    this._terminateWorker();
                    this._Print("00:00:00");
                }
                return;
            }

            this._startOrUpdateWorker(h, m, s);
        },

        //======================================================================
        // Worker 유지형 구조
        //======================================================================
        _startOrUpdateWorker: function(h, m, s) {
            var totalSeconds = (h * 3600) + (m * 60) + s;
            this._dEndTime = new Date(Date.now() + (totalSeconds * 1000) + 1000);

            if (this._oWorker instanceof Worker) {
                try {
                    this._oWorker.postMessage({
                        countDownDate: this._dEndTime
                    });
                    this._bWorkerStarted = true;
                    return;
                } catch (ex) {
                    this._terminateWorker();
                }
            }

            try {
                this._oWorker = this._createDynamicWorker();
            } catch (ex) {
                this._terminateWorker();
                this._dumpAndThrow("[CountdownTimer] Worker creation failed: " + ex.message);
            }

            this._oWorker.onerror = function(e) {
                this._terminateWorker();
                this._dumpAndThrow("[CountdownTimer] Worker runtime error: " +
                    e.message + " (" + e.filename + ":" + e.lineno + ")");
            }.bind(this);

            this._oWorker.onmessage = function(e) {
                this._onWorkerMessage(e);
            }.bind(this);

            try {
                this._oWorker.postMessage({
                    countDownDate: this._dEndTime
                });
                this._bWorkerStarted = true;
            } catch (ex2) {
                this._terminateWorker();
                this._dumpAndThrow("[CountdownTimer] Failed to post message: " + ex2.message);
            }

            this._registerVisibilityHandler();
        },

        //======================================================================
        // Dynamic Worker 생성
        //======================================================================
        _createDynamicWorker: function() {
            var sWorkerCode = this.getCountdownWorkerCode();
            var oBlob = new Blob([sWorkerCode], {
                type: "application/javascript"
            });
            var sUrl = URL.createObjectURL(oBlob);
            var oWorker = new Worker(sUrl);
            var _origTerminate = oWorker.terminate;
            oWorker.terminate = function() {
                try {
                    _origTerminate.call(oWorker);
                } finally {
                    URL.revokeObjectURL(sUrl);
                }
            };
            return oWorker;
        },

        //======================================================================
        // Worker 스크립트 (전용 주석 포함)
        //======================================================================
        getCountdownWorkerCode: function() {
            return `
        // ================================================================
        // Copyright 2017. INFOCG Inc. all rights reserved.
        // Title : u4a.m.CountdownTimer Worker
        // Desc  : u4a.m.CountdownTimer 전용 Web Worker 스크립트
        //         메인 스레드 부하 없이 초 단위 카운트다운 계산 담당.
        // Revised on : 2025-11-01
        // ================================================================

        self.onmessage = function(e) {
          var oReceiveData = e.data,
              oSendData = {},
              countDownDate = oReceiveData.countDownDate;

          if(this.timerInterval){
            clearInterval(this.timerInterval);
            this.timerInterval=null;
          }

          this.timerInterval=setInterval(function(){
            try{
              var now=new Date().getTime();
              var distance=countDownDate-now;

              var hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
              var minutes=Math.floor((distance%(1000*60*60))/(1000*60));
              var seconds=Math.floor((distance%(1000*60))/1000);

              hours=(hours<0?0:hours);
              minutes=(minutes<0?0:minutes);
              seconds=(seconds<0?0:seconds);

              oSendData.hourCount=fn_addZeros(hours,2);
              oSendData.minCount=fn_addZeros(minutes,2);
              oSendData.secCount=fn_addZeros(seconds,2);
              oSendData.print=oSendData.hourCount+":"+oSendData.minCount+":"+oSendData.secCount;

              postMessage(oSendData);

              if(distance<0){
                clearInterval(this.timerInterval);
                this.timerInterval=null;
                oSendData.isStop=true;
                postMessage(oSendData);
              }
            }catch(e){}
          }.bind(this),1000);
        };

        function fn_addZeros(n,width){
          n=n+'';
          return n.length>=width?n:new Array(width-n.length+1).join('0')+n;
        }
      `;
        },

        //======================================================================
        // 워커 메시지
        //======================================================================
        _onWorkerMessage: function(e) {
            var oData = e.data;
            if (oData.isStop === true) {
                if (this._dEndTime && Date.now() < this._dEndTime.getTime()) {
                    return;
                }
                this._stopTimer();
                return;
            }
            var h = parseInt(oData.hourCount, 10) || 0;
            var m = parseInt(oData.minCount, 10) || 0;
            var s = parseInt(oData.secCount, 10) || 0;
            this.setProperty("hourCount", h, true);
            this.setProperty("minCount", m, true);
            this.setProperty("secCount", s, true);
            this._Print(oData.print);
        },

        //======================================================================
        // Visibility 재개 처리
        //======================================================================
        _registerVisibilityHandler: function() {
            if (this._bVisHandlerRegistered) return;
            this._fnVisibilityHandler = function() {
                if (document.hidden) return;
                if (this._oWorker && this._dEndTime) {
                    try {
                        this._oWorker.postMessage({
                            countDownDate: this._dEndTime
                        });
                    } catch (e) {}
                }
            }.bind(this);
            document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            this._bVisHandlerRegistered = true;
        },

        //======================================================================
        // 타이머 정지 및 완료 이벤트
        //======================================================================
        _stopTimer: function() {
            this.setProperty("hourCount", 0, true);
            this.setProperty("minCount", 0, true);
            this.setProperty("secCount", 0, true);
            this._terminateWorker();
            this._Print("00:00:00");
            this.fireCountdownComplete();
            this._bWorkerStarted = false;
        },

        _terminateWorker: function() {
            if (this._oWorker instanceof Worker) {
                try {
                    this._oWorker.terminate();
                } catch (e) {}
                this._oWorker = null;
            }
        },

        _Print: function(sTxt) {
            var oTimer = document.getElementById(this.getId());
            if (!oTimer) return;
            oTimer.innerHTML = sTxt;
        },
        _pad2: function(n) {
            return (n < 10 ? "0" : "") + n;
        },

        exit: function() {
            this._terminateWorker();
            if (this._bVisHandlerRegistered && this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._bVisHandlerRegistered = false;
                this._fnVisibilityHandler = null;
            }
        },

        _dumpAndThrow: function(sErrMsg) {
            try {
                console.error(sErrMsg);
            } catch (e) {}
            if (typeof oU4AErroHandle !== "undefined" &&
                typeof oU4AErroHandle.seterroHTML === "function") {
                try {
                    oU4AErroHandle.seterroHTML(sErrMsg);
                } catch (e) {}
            }
            throw new Error(sErrMsg);
        }

    });

    return Timer;
});