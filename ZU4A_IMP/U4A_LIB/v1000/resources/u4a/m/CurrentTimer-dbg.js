//Copyright 2017. INFOCG Inc. all rights reserved.

/*======================================================================
 * Title      : u4a.m.CurrentTimer
 * Description: 실시간 현재 시각을 초 단위로 표시하는 UI5 컨트롤.
 *              Web Worker를 통해 백그라운드에서 시간을 갱신하며,
 *              브라우저 탭 전환, 화면 잠금 등 비가시 상태에서도
 *              자동으로 워커를 재시작하여 정확한 시각을 유지함.
 *
 * Behavior   :
 *   - 초 단위로 현재 시간을 실시간 표시.
 *   - Worker 내부에서 매초 현재 시간을 계산하여 UI에 반영.
 *   - 화면 비가시(hidden) 상태에서는 Worker를 중단하여 리소스 절약.
 *   - 복귀 시 즉시 현재 시각을 표시 후 Worker 재시작.
 *
 * Properties :
 *   · width        : 컨트롤 너비
 *   · textAlign    : 텍스트 정렬 (Begin, Center, End)
 *   · fontSize     : 폰트 크기
 *   · fontColor    : 폰트 색상
 *   · support2400  : 24시간제 여부 (false일 경우 AM/PM 표기)
 *
 * Internal   :
 *   - Web Worker 경로:
 *       /zu4a_imp/publish/CommonJS/workers/CurrentTimerWorker.js
 *   - Worker 미지원 브라우저는 기본 렌더링된 시각만 표시.
 *   - visibilitychange 이벤트 등록으로 탭/화면 전환 대응.
 *
 * Notes      :
 *   - Worker는 onAfterRendering 시 생성되고, exit 시 종료됨.
 *   - Renderer에서도 초기 시각을 즉시 출력하여 딜레이 방지.
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-30
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

        //==================================================
        // RENDERER
        //==================================================
        renderer: function (oRm, oControl) {

            var sWidth = oControl.getWidth(),
                sFontSize = oControl.getFontSize(),
                sFontColor = oControl.getFontColor(),
                sTextAlign = oControl.getTextAlign(),
                bSupport2400 = oControl.getSupport2400();

            var sInitTime = oControl._getFormattedCurrentTime(bSupport2400);

            oRm.write("<span");
            oRm.writeControlData(oControl);
            oRm.addStyle("display", "inline-block");
            sWidth ? oRm.addStyle("width", sWidth) : oRm.addStyle("max-width", "100%");
            oRm.addStyle("color", sFontColor);
            oRm.addStyle("font-size", sFontSize);

            // IE/Edge 구버전 text-align
            if (sTextAlign) {
                var sBrowser = sap.ui.Device.browser.name;
                if ((sBrowser === "ie" || sBrowser === "ed") && sTextAlign === TextAlign.End) {
                    oRm.addStyle("text-align", "right");
                } else {
                    oRm.addStyle("text-align", sTextAlign);
                }
            }

            oRm.writeClasses();
            oRm.writeStyles();
            oRm.write(">");
            oRm.writeEscaped(sInitTime);
            oRm.write("</span>");
        },

        //==================================================
        // LIFECYCLE
        //==================================================
        onAfterRendering: function () {            

            var bSupport2400 = this.getSupport2400();

            // 기존 워커 종료 후 새 워커 시작
            this._terminateWorker();
            this._initWorker(bSupport2400);

            // 🔹 visibility 이벤트 등록 (탭 전환, 화면 잠금 복귀 대응)
            document.addEventListener("visibilitychange", this._onVisibilityChangeBound = this._onVisibilityChange.bind(this));
        },

        exit: function () {     
            this._terminateWorker();
            document.removeEventListener("visibilitychange", this._onVisibilityChangeBound);
        },

        //==================================================
        // INTERNAL UTILITIES
        //==================================================

        /**
         * Worker 초기화 및 메시지 바인딩
         */
        _initWorker: function (bSupport2400) {
            
            // 🔹 워커 경로
            // let sWorkerPath = sap.ui.require.toUrl("zu4a_imp");
            //     sWorkerPath += "/publish/CommonJS/workers/CurrentTimerWorker.js";

            // 워커 경로
            let sWorkerPath = "/zu4a_imp/publish/CommonJS/workers/CurrentTimerWorker.js";

            // 워커 실행
            this._oWorker = new Worker(sWorkerPath);
   
            var oParam = { support2400: bSupport2400 };
            this._oWorker.postMessage(oParam);

            this._oWorker.onmessage = function (e) {
                this.onMessage(e);
            }.bind(this);
        },

        /**
         * Worker 종료 (공통)
         */
        _terminateWorker: function () {
            if (this._oWorker instanceof Worker) {
                this._oWorker.terminate();
                this._oWorker = null;
            }
        },

        /**
         * 현재 시간 포맷팅 (support2400 반영)
         */
        _getFormattedCurrentTime: function (bSupport2400) {
            var oDate = new Date();
            var hour = oDate.getHours();
            var minute = oDate.getMinutes();
            var second = oDate.getSeconds();

            var amPm = "";
            if (!bSupport2400) {
                amPm = "AM";
                if (hour >= 12) {
                    amPm = "PM";
                    if (hour > 12) {
                        hour -= 12;
                    }
                }
            }

            var sHour = this._pad(hour, 2);
            var sMin = this._pad(minute, 2);
            var sSec = this._pad(second, 2);

            return bSupport2400
                ? `${sHour}:${sMin}:${sSec}`
                : `${sHour}:${sMin}:${sSec} ${amPm}`;
        },

        _pad: function (n, width) {
            n = String(n);
            return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
        },

        /**
         * Worker Message 수신 시 DOM 업데이트
         */
        onMessage: function (e) {
            var oTimer = document.getElementById(this.getId());
            if (oTimer) {
                oTimer.innerHTML = e.data;
            }
        },

        /**
         * 브라우저 visibility 변화 감지
         * - hidden: 워커 중단
         * - visible: 즉시 현재 시간 표시 후 워커 재시작
         */
        _onVisibilityChange: function () {
            var bSupport2400 = this.getSupport2400();
            var oTimer = document.getElementById(this.getId());

            if (document.visibilityState === "visible") {
                // 즉시 현재 시각 반영
                if (oTimer) {
                    oTimer.innerHTML = this._getFormattedCurrentTime(bSupport2400);
                }
                // 워커 재시작
                this._terminateWorker();
                this._initWorker(bSupport2400);
            } else {
                // 백그라운드 전환 시 워커 중단
                this._terminateWorker();
            }
        }

    });

    return CurrentTimer;
});