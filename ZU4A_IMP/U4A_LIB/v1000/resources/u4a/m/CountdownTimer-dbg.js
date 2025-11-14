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
 *   - visibilitychange 시 워커 유지, 종료시각 그대로 재전송
 *   - 초기 렌더링 시 즉시 시간 표시로 딜레이 없는 UI 제공
 *
 * Internal   :
 *   - Worker는 Blob을 이용해 동적으로 생성됨.
 *   - u4a.m.CountdownTimer 전용 워커 스크립트를 getCountdownWorkerCode()로 생성.
 *   - 워커는 종료되지 않고 postMessage()로 새 파라미터(countDownDate)만 수신.
 *   - 종료 시 URL.revokeObjectURL()로 메모리 해제.
 *
 * Added      :
 *   - displayFormat 속성 추가 (기본값: "HH:mm:ss")
 *       · TimePicker style(short/medium/long/full) 지원
 *       · 패턴 기반 포맷("mm:ss", "ss" 등) 지원
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-11-14
 *======================================================================*/

sap.ui.define("u4a.m.CountdownTimer", [
    "sap/ui/core/Control",
    "sap/ui/core/format/DateFormat"
], function (Control, DateFormat) {
    "use strict";

    var Timer = Control.extend("u4a.m.CountdownTimer", {
        metadata: {
            library: "u4a.m",
            properties: {
                fontSize: { type: "sap.ui.core.CSSSize", defaultValue: "20px" },
                fontColor: { type: "sap.ui.core.CSSColor", defaultValue: "#000000" },
                hourCount: { type: "int", defaultValue: 0 },
                minCount: { type: "int", defaultValue: 0 },
                secCount: { type: "int", defaultValue: 0 },
                visible: { type: "boolean", defaultValue: true },

                /**
                 * @since   2025-11-14 00:19:36
                 * @version v3.5.6-16
                 * @author  soccerhs
                 * @description
                 *  # displayFormat 속성 추가
                 *  - sap.m.TimePicker의 displayFormat 속성과 유사하게 동작.
                 *  - 예) HH:mm:ss a, mm:ss, ss 등 패턴 기반 포맷 지원.
                 *  - TimePicker style(short/medium/long/full) 지원
                 */
                displayFormat: { type: "string", defaultValue: "HH:mm:ss" }
            },
            events: {
                "countdownComplete": {}
            }
        },

        // ======================================================================
        // Lifecycle
        // ======================================================================
        init: function () {
            this._oWorker = null;
            this._dEndTime = null;
            this._bWorkerStarted = false;

            this._oDateFormat = null;
            this._sLastFmt = null;

            this._bVisHandlerRegistered = false;
            this._fnVisibilityHandler = null;
        },

        exit: function () {
            this._terminateWorker();

            if (this._bVisHandlerRegistered && this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._bVisHandlerRegistered = false;
                this._fnVisibilityHandler = null;
            }
        },

        // ======================================================================
        // Renderer
        // ======================================================================
        renderer: function (oRm, oControl) {
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

            // displayFormat 적용
            oRm.writeEscaped(oControl._formatDisplay(h, m, s));
            oRm.write("</div>");
        },

        // displayFormat setter → invalidate() 막고 바로 화면만 갱신
        setDisplayFormat: function (sFmt) {
            this.setProperty("displayFormat", sFmt, true); // no invalidate

            // worker 손대지 않고 화면만 재포맷
            this._Print(
                this._formatDisplay(
                    this.getHourCount(),
                    this.getMinCount(),
                    this.getSecCount()
                )
            );

            return this;
        },


        // ======================================================================
        // onAfterRendering
        // ======================================================================    
        onAfterRendering: function () {

            var h = this.getHourCount() | 0,
                m = this.getMinCount() | 0,
                s = this.getSecCount() | 0;

            // 시간 정규화 (60진수 보정)
            if (s >= 60) {
                m += Math.floor(s / 60);
                s = s % 60;
            }
            if (m >= 60) {
                h += Math.floor(m / 60);
                m = m % 60;
            }

            // invalidate 방지
            this.setProperty("hourCount", h, true);
            this.setProperty("minCount", m, true);
            this.setProperty("secCount", s, true);

            // 현재 값 즉시 표시 (딜레이 없이)
            this._Print(this._formatDisplay(h, m, s));

            // ============================================================
            // 0,0,0 처리 (핵심)
            // ============================================================
            if (h === 0 && m === 0 && s === 0) {

                // 1) 워커 한 번도 실행 안 된 상태 → 초기 상태이거나 이미 완전히 정리된 상태
                //    ⇒ countdownComplete 발생시키지 않음
                if (!this._bWorkerStarted) {
                    this._terminateWorker(); // 혹시 남아있을 수도 있으니 안전하게 한 번 정리
                    this._dEndTime = null;
                    return;
                }

                // 2) 워커가 돌고 있는 중에 외부에서 0,0,0을 강제로 세팅한 경우
                //    ⇒ 강제 완료로 보고 countdownComplete 발생
                this._terminateWorker();
                this._Print(this._formatDisplay(0, 0, 0));
                this.fireCountdownComplete();

                this._bWorkerStarted = false;
                this._dEndTime = null;

                return;
            }

            // ============================================================
            // 0,0,0 이 아닌 경우 → 정상 카운트다운 시작/갱신
            // ============================================================
            this._startOrUpdateWorker(h, m, s);
        },

        // ======================================================================
        // Worker 생성 및 갱신
        // ======================================================================
        _startOrUpdateWorker: function (h, m, s) {
            var totalSeconds = (h * 3600) + (m * 60) + s;

            // 종료 예정 시각 저장
            this._dEndTime = new Date(Date.now() + (totalSeconds * 1000) + 1000);

            // 기존 워커가 살아있으면 countDownDate만 갱신
            if (this._oWorker instanceof Worker) {
                try {
                    this._oWorker.postMessage({ countDownDate: this._dEndTime });
                    this._bWorkerStarted = true;
                    return;
                } catch (ex) {
                    this._terminateWorker();
                }
            }

            // 새 워커 생성
            try {
                this._oWorker = this._createDynamicWorker();
            } catch (ex) {
                this._terminateWorker();
                this._dumpAndThrow("[CountdownTimer] Worker creation failed: " + ex.message);
            }

            this._oWorker.onerror = function (e) {
                this._terminateWorker();
                this._dumpAndThrow(
                    "[CountdownTimer] Worker runtime error: " +
                    e.message + " (" + e.filename + ":" + e.lineno + ")"
                );
            }.bind(this);

            this._oWorker.onmessage = function (e) {
                this._onWorkerMessage(e);
            }.bind(this);

            try {
                this._oWorker.postMessage({ countDownDate: this._dEndTime });
                this._bWorkerStarted = true;
            } catch (ex2) {
                this._terminateWorker();
                this._dumpAndThrow("[CountdownTimer] Failed to post message: " + ex2.message);
            }

            this._registerVisibilityHandler();
        },

        // ======================================================================
        // Dynamic Worker 생성
        // ======================================================================
        _createDynamicWorker: function () {
            var sWorkerCode = this.getCountdownWorkerCode();
            var oBlob = new Blob([sWorkerCode], { type: "application/javascript" });
            var sUrl = URL.createObjectURL(oBlob);
            var oWorker = new Worker(sUrl);

            // terminate 후 URL 해제
            var _origTerminate = oWorker.terminate;
            oWorker.terminate = function () {
                try { _origTerminate.call(oWorker); }
                finally { URL.revokeObjectURL(sUrl); }
            };

            return oWorker;
        },

        //======================================================================
        // Worker 스크립트 (원본 로직 유지)
        //======================================================================
        getCountdownWorkerCode: function () {
            return `
            // ================================================================
            // Copyright 2017. INFOCG Inc. all rights reserved.
            // Title : u4a.m.CountdownTimer Worker
            // Desc  : u4a.m.CountdownTimer 전용 Web Worker 스크립트
            //         메인 스레드 부하 없이 초 단위 카운트다운 계산 담당.
            // Revised on : 2025-11-01
            // ================================================================

            self.onmessage=function(e){
                var oReceiveData=e.data,
                    oSendData={},
                    countDownDate=oReceiveData.countDownDate;

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

        // ======================================================================
        // Worker Message Handler
        // ======================================================================
        _onWorkerMessage: function (e) {
            var oData = e.data;

            if (oData.isStop === true) {
                // 새 endTime이 잡혀 있는데 이전 워커가 보낸 isStop이면 무시
                if (this._dEndTime && Date.now() < this._dEndTime.getTime()) {
                    return;
                }
                this._stopTimer();
                return;
            }

            var h = parseInt(oData.hourCount, 10) || 0;
            var m = parseInt(oData.minCount, 10) || 0;
            var s = parseInt(oData.secCount, 10) || 0;

            // 내부 업데이트: invalidate 방지
            this.setProperty("hourCount", h, true);
            this.setProperty("minCount", m, true);
            this.setProperty("secCount", s, true);

            this._Print(this._formatDisplay(h, m, s));
        },

        // ======================================================================
        // VisibilityChange Event Handler
        // ======================================================================
        _registerVisibilityHandler: function () {
            if (this._bVisHandlerRegistered) {
                return;
            }

            this._fnVisibilityHandler = function () {
                if (document.hidden) {
                    return;
                }
                if (this._oWorker && this._dEndTime) {
                    try {
                        this._oWorker.postMessage({ countDownDate: this._dEndTime });
                    } catch (e) { }
                }
            }.bind(this);

            document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            this._bVisHandlerRegistered = true;
        },

        // ======================================================================
        // timer 종료
        // ======================================================================
        _stopTimer: function () {
            this.setProperty("hourCount", 0, true);
            this.setProperty("minCount", 0, true);
            this.setProperty("secCount", 0, true);

            this._terminateWorker();
            this._Print(this._formatDisplay(0, 0, 0));
            this.fireCountdownComplete();
            this._bWorkerStarted = false;
            this._dEndTime = null;
        },

        // ======================================================================
        // worker 종료
        // ======================================================================
        _terminateWorker: function () {
            if (this._oWorker instanceof Worker) {
                try { this._oWorker.terminate(); } catch (e) { }
                this._oWorker = null;
            }
        },

        // ======================================================================
        // displayFormat 기반 포맷 처리
        // ======================================================================
        _formatDisplay: function (h, m, s) {
            var fmt = this.getDisplayFormat();

            var aValidStyles = ["short", "medium", "long", "full"];
            var oFormatOptions = {};

            if (aValidStyles.indexOf(fmt) >= 0) {
                oFormatOptions.style = fmt;
            } else {
                oFormatOptions.pattern = fmt;
            }

            var sCacheKey = JSON.stringify(oFormatOptions);

            if (!this._oDateFormat || this._sLastFmt !== sCacheKey) {
                this._oDateFormat = DateFormat.getTimeInstance(oFormatOptions);
                this._sLastFmt = sCacheKey;
            }

            var oDate = new Date(1970, 0, 1, h, m, s);
            return this._oDateFormat.format(oDate);
        },

        // ======================================================================
        // 화면에 출력
        // ======================================================================
        _Print: function (sTxt) {
            var o = document.getElementById(this.getId());
            if (o) {
                o.innerHTML = sTxt;
            }
        },

        // ======================================================================
        // Error Handler
        // ======================================================================
        _dumpAndThrow: function (sErrMsg) {
            try { console.error(sErrMsg); } catch (e) { }
            if (typeof oU4AErroHandle !== "undefined" &&
                typeof oU4AErroHandle.seterroHTML === "function") {
                try { oU4AErroHandle.seterroHTML(sErrMsg); } catch (e) { }
            }
            throw new Error(sErrMsg);
        }

    });

    return Timer;
});
