//Copyright 2017. INFOCG Inc. all rights reserved.

/*======================================================================
 * Title      : u4a.m.CurrentTimer
 * Description: 실시간 현재 시각을 초 단위로 표시하는 UI5 컨트롤.
 *              Web Worker를 통해 백그라운드에서 시간을 갱신하며,
 *              브라우저 탭 전환, 화면 잠금 등 비가시 상태에서도
 *              워커에 메시지를 전송하여 인터벌만 제어함. (수정됨)
 *
 * Behavior   :
 *   - 초 단위로 현재 시간을 실시간 표시.
 *   - Worker 내부에서 매초 현재 시간을 계산하여 UI에 반영.
 *   - 화면 비가시(hidden) 상태에서는 Worker 내부 Interval을 중단 (수정됨)
 *   - 복귀 시 즉시 현재 시각을 표시 후 Worker Interval 재시작 (수정됨)
 *
 * Properties :
 *   · width        : 컨트롤 너비
 *   · textAlign    : 텍스트 정렬 (Begin, Center, End)
 *   · fontSize     : 폰트 크기
 *   · fontColor    : 폰트 색상
 *   · support2400  : 24시간제 여부 (false일 경우 AM/PM 표기)
 *
 * Internal   :
 *   - Worker는 Blob을 이용해 동적으로 생성됨.
 *   - Worker 종료 시 URL.revokeObjectURL()로 메모리 해제.
 *   - visibilitychange 이벤트 등록으로 탭/화면 전환 대응.
 *
 * Notes      :
 *   - Worker는 onAfterRendering 시 생성되고, exit 시 종료됨.
 *   - Renderer에서도 초기 시각을 즉시 출력하여 딜레이 방지.
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-31 (Gemini가 수정)
 *======================================================================*/

sap.ui.define("u4a.m.CurrentTimer", [
    "sap/ui/core/Control",
    "sap/ui/core/library"
], function (Control, coreLibrary) {
    "use strict";

    var TextAlign = coreLibrary.TextAlign;

    var CurrentTimer = Control.extend("u4a.m.CurrentTimer", {
        metadata: {
            library: "u4a.m",
            properties: {
                width: { type: "sap.ui.core.CSSSize", defaultValue: null },
                textAlign: { type: "sap.ui.core.TextAlign", defaultValue: TextAlign.Begin },
                fontSize: { type: "sap.ui.core.CSSSize", defaultValue: "20px" },
                fontColor: { type: "sap.ui.core.CSSColor", defaultValue: "#000000" },
                support2400: { type: "boolean", defaultValue: false }
            }
        },

        //=============================================================
        // Renderer
        //=============================================================
//         renderer: function (oRm, oControl) {
//             var sWidth = oControl.getWidth(),
//                 sFontSize = oControl.getFontSize(),
//                 sFontColor = oControl.getFontColor(),
//                 sTextAlign = oControl.getTextAlign(),
//                 bSupport2400 = oControl.getSupport2400();

//             // [개선] 수정된 시간 포맷 함수 사용
//             var sInitTime = oControl._getFormattedCurrentTime(bSupport2400);

//             oRm.write("<span");
//             oRm.writeControlData(oControl);
//             oRm.writeClasses(oControl);
//             oRm.addStyle("display", "inline-block");
//             sWidth ? oRm.addStyle("width", sWidth) : oRm.addStyle("max-width", "100%");
//             oRm.addStyle("color", sFontColor);
//             oRm.addStyle("font-size", sFontSize);

//             if (sTextAlign) {
//                 var sBrowser = sap.ui.Device.browser.name;
//                 if ((sBrowser === "ie" || sBrowser === "ed") && sTextAlign === TextAlign.End) {
//                     oRm.addStyle("text-align", "right");
//                 } else {
//                     oRm.addStyle("text-align", sTextAlign);
//                 }
//             }

//             oRm.writeStyles();
//             oRm.write(">");
//             oRm.writeEscaped(sInitTime);
//             oRm.write("</span>");
//         },

        /**
         * @since   2025-12-17 16:50:56
         * @version v3.5.7-3
         * @author  soccerhs
         * @description
         * 
         * Renderer API v2 버전으로 변경
         * 
         */
        renderer: function (oRm, oControl) {
  
            var sWidth        = oControl.getWidth(),
                sFontSize     = oControl.getFontSize(),
                sFontColor    = oControl.getFontColor(),
                sTextAlign    = oControl.getTextAlign(),
                bSupport2400  = oControl.getSupport2400();

            // [개선] 수정된 시간 포맷 함수 사용
            var sInitTime = oControl._getFormattedCurrentTime(bSupport2400);

            oRm.openStart("span", oControl);

            oRm.style("display", "inline-block");
            sWidth ? oRm.style("width", sWidth) : oRm.style("max-width", "100%");
            oRm.style("color", sFontColor);
            oRm.style("font-size", sFontSize);

            if (sTextAlign) {
                var sBrowser = sap.ui.Device.browser.name;
                if ((sBrowser === "ie" || sBrowser === "ed") && sTextAlign === TextAlign.End) {
                    oRm.style("text-align", "right");
                } else {
                    oRm.style("text-align", sTextAlign);
                }
            }

            oRm.openEnd();

            oRm.text(sInitTime);

            oRm.close("span");
        },

        //=============================================================
        // Lifecycle
        //=============================================================
        onAfterRendering: function () {
            this._terminateWorker();
            this._tryStart();
            this._registerVisibilityHandler();
        },

        exit: function () {
            this._terminateWorker();
            if (this._bVisHandlerRegistered && this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._bVisHandlerRegistered = false;
                this._fnVisibilityHandler = null;
            }
        },

        //=============================================================
        // Common (CountdownTimer와 동일 패턴)
        //=============================================================
        _dumpAndThrow: function (sErrMsg) {
            console.error(sErrMsg);
            if (typeof oU4AErroHandle !== "undefined" &&
                typeof oU4AErroHandle.seterroHTML === "function") {
                oU4AErroHandle.seterroHTML(sErrMsg);
            }
            throw new Error(sErrMsg);
        },

        _tryStart: function () {
            // 초기 출력
            var bSupport2400 = this.getSupport2400();
            this._Print(this._getFormattedCurrentTime(bSupport2400));

            // 동적 워커 생성
            try {
                this._oWorker = this._createDynamicWorker();
            } catch (ex) {
                this._terminateWorker();
                this._dumpAndThrow("[CurrentTimer] Dynamic Worker creation failed: " + ex.message);
            }

            this._bWorkerStarted = true;
            this._oWorker.onerror = function (e) {
                this._terminateWorker();
                this._dumpAndThrow("[CurrentTimer] Worker runtime error: " +
                    (e && e.message ? e.message : "Unknown"));
            }.bind(this);

            try {
                // [수정] 'start' 명령과 함께 설정값 전송
                this._oWorker.postMessage({ 
                command: 'start', 
                support2400: bSupport2400 
            });
            } catch (ex2) {
                this._terminateWorker();
                this._dumpAndThrow("[CurrentTimer] Failed to post message to Worker: " + ex2.message);
            }

            this._oWorker.onmessage = function (e) {
                if (e && e.data && e.data.__error) {
                    this._terminateWorker();
                    this._dumpAndThrow("[CurrentTimer] Worker internal error: " + e.data.__error);
                    return;
                }
                this._onWorkerMessage(e);
            }.bind(this);
        },

        _createDynamicWorker: function () {
            var sWorkerCode = this.getCurrentWorkerCode();
            var oBlob = new Blob([sWorkerCode], { type: "application/javascript" });
            var sUrl = URL.createObjectURL(oBlob);
            var oWorker = new Worker(sUrl);

            var _origTerminate = oWorker.terminate;
            oWorker.terminate = function () {
                try { _origTerminate.call(oWorker); }
                finally { URL.revokeObjectURL(sUrl); }
            };

            return oWorker;
        },

        getCurrentWorkerCode: function () {
            // [수정] 'start'/'stop' 명령을 처리하도록 워커 코드 전면 수정
            return `

                /***************************************************
                 * CurrentTimer.js 용 워커 스크립트
                 ***************************************************/            
            
            // Interval ID와 설정을 저장할 변수
            var currentTimer = null;
            var support2400 = false;

                // worker 메시지 수신 listener
                self.onmessage = function(e) {
                    
                    var oData = e.data;

                    if (!oData || !oData.command) {
                        return; // 유효하지 않은 메시지
                    }

                    // --- 'stop' 명령 처리 ---
                    if (oData.command === 'stop') {
                        if (currentTimer) {
                            clearInterval(currentTimer);
                            currentTimer = null;
                        }
                        return;
                    }

                    // --- 'start' 명령 처리 ---
                    if (oData.command === 'start') {
                        // 기존 Interval이 있다면 중지
                        if (currentTimer) {
                            clearInterval(currentTimer);
                            currentTimer = null;
                        }
                        
                        // 24시간제 설정 업데이트
                        support2400 = !!oData.support2400; 

                        // 즉시 1회 실행 (주석 처리: start 시 메인스레드에서 이미 반영함)
                        // _postTime(); 

                        // 1초 간격으로 Interval 시작
                        currentTimer = setInterval(_postTime, 1000);
                    }
                };

            // 시간을 계산하고 postMessage로 전송하는 함수
            function _postTime() {
                try {
                    var currentDate = new Date();
                    var iHour       = currentDate.getHours();
                    var currentMinute  = addZeros(currentDate.getMinutes(), 2);
                    var currentSeconds = addZeros(currentDate.getSeconds(), 2);
                    
                    var amPm = '';
                    var currentHours;

                    if (!support2400) {
                        amPm = iHour >= 12 ? 'PM' : 'AM'; // AM/PM 결정
                        
                        iHour = iHour % 12;
                        if (iHour === 0) { 
                            iHour = 12; // 0시는 12시로
                        }
                        currentHours = addZeros(iHour, 2);
                    } else {
                        currentHours = addZeros(iHour, 2);
                    }
                    
                    var sDateTime = currentHours + ":" + currentMinute + ":" + currentSeconds + " " + amPm;
                    postMessage(sDateTime.trim()); // amPm이 없을 경우 공백 제거

                } catch(ex) {
                    postMessage({ __error: ex && ex.message ? ex.message : "Worker internal error" });
                    
                    // 오류 발생 시 Interval 중지
                    if (currentTimer) {
                        clearInterval(currentTimer);
                        currentTimer = null;
                    }
                }
            }

                function addZeros(n, width) {
                    n = n + '';
                    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
                }
            `;
        },

        _terminateWorker: function () {
            if (this._oWorker instanceof Worker) {
                try { this._oWorker.terminate(); }
                catch (e) { console.warn("[CurrentTimer] Worker terminate failed:", e); }
                this._oWorker = null;
            }
        },

        _registerVisibilityHandler: function () {
            if (this._bVisHandlerRegistered) return;

            // [수정] Worker를 terminate하지 않고 'stop'/'start' 메시지 전송
            this._fnVisibilityHandler = function () {
                // Worker가 (어떤 이유로) 없는 경우,
                // 화면이 보일 때 _tryStart를 호출하여 재시작.
                if (!this._oWorker) {
                    if (!document.hidden) {
                        this._tryStart();
                    }
                    return;
                }

                if (document.hidden) {
                    // [수정] 화면이 숨겨짐: Worker 내부의 Interval 중지 (리소스 절약)
                    try {
                        this._oWorker.postMessage({ command: 'stop' });
                    } catch (e) {
                        console.warn("[CurrentTimer] Failed to post 'stop' to worker:", e);
                    }
                    return;
                }

                // [수정] visible 복귀: 
                // 1. 메인 스레드에서 즉시 UI 동기화
                this._Print(this._getFormattedCurrentTime(this.getSupport2400()));
                
                // 2. Worker에게 'start' 메시지를 보내 Interval 재시작
                try {
                    this._oWorker.postMessage({
                        command: 'start',
                        support2400: this.getSupport2400()
                    });
                } catch (e) {
                    // postMessage 실패 시 (Worker가 비정상 종료 등)
                    // Worker를 완전히 재시작
                    console.warn("[CurrentTimer] Failed to post 'start' to worker, restarting:", e);
                    this._terminateWorker(); // 기존 워커 정리
                    this._tryStart();       // 새 워커 시작
                }
            }.bind(this);

            document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            this._bVisHandlerRegistered = true;
        },

        _onWorkerMessage: function (e) {
            var oTimer = document.getElementById(this.getId());
            if (oTimer) {
                oTimer.innerHTML = e.data;
            }
        },

        _Print: function (sTxt) {
            var oDom = this.getDomRef();
            if (!oDom) return;
            oDom.innerHTML = sTxt;
        },

        _getFormattedCurrentTime: function (bSupport2400) {
            // [개선] Worker와 AM/PM 로직 일치 (자정 12 AM 처리)
            var oDate  = new Date();
            var hour   = oDate.getHours();
            var minute = oDate.getMinutes();
            var second = oDate.getSeconds();

            var amPm = "";
            if (!bSupport2400) {
                amPm = hour >= 12 ? "PM" : "AM"; // AM/PM 결정
                
                hour = hour % 12; // 12시, 24시(0시) 대응
                if (hour === 0) { 
                    hour = 12; // 0시는 12시로
                }
            }

            var sHour = this._pad2(hour);
            var sMin  = this._pad2(minute);
            var sSec  = this._pad2(second);

            return bSupport2400
                ? (sHour + ":" + sMin + ":" + sSec)
                : (sHour + ":" + sMin + ":" + sSec + " " + amPm);
        },

        _pad2: function (n) {
            return (n < 10 ? "0" : "") + n;
        }
    });

    return CurrentTimer;
});