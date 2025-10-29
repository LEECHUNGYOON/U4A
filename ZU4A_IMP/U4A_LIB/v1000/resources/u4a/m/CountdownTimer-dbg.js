//Copyright 2017. INFOCG Inc. all rights reserved.

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
 *   - 실행 중 속성 변경 시 즉시 워커 재시작
 *   - 모바일/PC 모두 visibilitychange(화면 잠금·탭 전환 등) 시
 *     남은 시간을 재계산하여 워커를 재개함
 *   - 초기 렌더링 시 즉시 시간 표시로 딜레이 없는 UI 제공
 *
 * Properties :
 *   · fontSize   : 표시 폰트 크기
 *   · fontColor  : 표시 폰트 색상
 *   · hourCount  : 시작 시(시)
 *   · minCount   : 시작 분
 *   · secCount   : 시작 초
 *   · visible    : 표시 여부
 *
 * Internal   :
 *   - Web Worker 경로:
 *       /zu4a_imp/publish/CommonJS/workers/CountdownTimerWorker.js
 *   - Renderer에서 초기 값 즉시 표시 후 워커로 실시간 갱신
 *   - Worker 메시지 기반으로 시·분·초 계산 및 화면 출력
 *   - visibilitychange 이벤트를 통해 백그라운드/복귀 시 상태 복원
 *   - 모델 바인딩 시 setProperty()로 값 자동 동기화
 *
 * Notes      :
 *   - hourCount는 무제한 허용
 *   - minCount/secCount는 60 단위로 자동 올림 정규화 처리
 *   - 카운트 종료 시 fireCountdownComplete() 이벤트 자동 호출
 *   - 수동 중단(_stopTimer(true)) 시에는 이벤트 발생 안 함
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-30
 *======================================================================*/

sap.ui.define("u4a.m.CountdownTimer", [
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    var CountdownTimer = Control.extend("u4a.m.CountdownTimer", {
        metadata: {
            library: "u4a.m",
            properties: {
                fontSize: { type: "sap.ui.core.CSSSize", defaultValue: "20px" },
                fontColor: { type: "sap.ui.core.CSSColor", defaultValue: "#000000" },
                hourCount: { type: "int", defaultValue: 0 },
                minCount: { type: "int", defaultValue: 0 },
                secCount: { type: "int", defaultValue: 0 },                
                visible: { type: "boolean", defaultValue: true },
            },
            events: {
                "countdownComplete": {},
            },
        },

        //=============================================================
        // Renderer
        //=============================================================
        renderer: function (oRm, oControl) {
            // console.log("renderer"); // ✅ 규칙 적용

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("font-size", oControl.getFontSize());
            oRm.addStyle("color", oControl.getFontColor());
            oRm.addStyle("font-weight", "bold");

            // ✅ 사용자 정의 클래스 반영
            oRm.writeClasses(oControl);

            if (!oControl.getVisible()) {
                oRm.addStyle("display", "none");
            }

            oRm.writeStyles();
            oRm.write(">");

            const h = oControl.getHourCount(),
                  m = oControl.getMinCount(),
                  s = oControl.getSecCount();

            const sTxt = oControl._pad2(h) + ":" + oControl._pad2(m) + ":" + oControl._pad2(s);
            oRm.writeEscaped(sTxt);
            oRm.write("</div>");
        },

        //=============================================================
        // Property Setters
        //=============================================================
        setHourCount: function (iVal) {
            this.setProperty("hourCount", iVal, true);
            this._handlePropertyChange();
            return this;
        },

        setMinCount: function (iVal) {
            this.setProperty("minCount", iVal, true);
            this._handlePropertyChange();
            return this;
        },

        setSecCount: function (iVal) {
            this.setProperty("secCount", iVal, true);
            this._handlePropertyChange();
            return this;
        },

        setVisible: function (bVal) {
            this.setProperty("visible", bVal, true);
            const oDom = this.getDomRef();
            if (oDom) {
                oDom.style.display = bVal ? "" : "none";
            }
            return this;
        },

        exit: function () {
            this._terminateWorker();

            // 🔹 visibilitychange 이벤트 해제
            if (this._bVisHandlerRegistered && this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._bVisHandlerRegistered = false;
                this._fnVisibilityHandler = null;
            }
        },

        //=============================================================
        // Core Logic
        //=============================================================
        _handlePropertyChange: function () {
            const h = this.getHourCount(),
                  m = this.getMinCount(),
                  s = this.getSecCount();

            // 워커가 돌고 있을 때 강제로 0으로 만들면 종료 이벤트 발생
            if (this._bWorkerStarted && h === 0 && m === 0 && s === 0) {
                this._stopTimer(false);
                return;
            }

            // 워커가 없고 처음부터 0이라면 표시만 (이벤트 ❌)
            if (!this._oWorker && (h === 0 && m === 0 && s === 0)) {
                this._Print("00:00:00");
                return;
            }

            // 워커가 없고 값이 존재하면 새로 시작
            if (!this._oWorker && (h > 0 || m > 0 || s > 0)) {
                this._tryStart();
                return;
            }

            // 워커 동작 중 값 변경 시 즉시 재시작
            if (this._oWorker && (h > 0 || m > 0 || s > 0)) {
                this._terminateWorker();
                this._tryStart();
            }
        },

        _tryStart: function () {
            let h = this.getHourCount(),
                m = this.getMinCount(),
                s = this.getSecCount();

            //=============================================================
            //⏱️ 정규화 로직 (hourCount 무제한, 나머지는 올림)
            //=============================================================
            if (s >= 60) {
                m += Math.floor(s / 60);
                s = s % 60;
            }

            if (m >= 60) {
                h += Math.floor(m / 60);
                m = m % 60;
            }

            // property에 반영
            this.setProperty("hourCount", h, true);
            this.setProperty("minCount", m, true);
            this.setProperty("secCount", s, true);

            //=============================================================
            // 0초일 경우 처리
            //=============================================================
            if (h === 0 && m === 0 && s === 0) {
                this._Print("00:00:00");
                this._terminateWorker();
                return;
            }

            // 기존 워커 종료
            this._terminateWorker();

            //=============================================================
            // 초기 표시
            //=============================================================
            const sInitTxt = this._pad2(h) + ":" + this._pad2(m) + ":" + this._pad2(s);
            this._Print(sInitTxt);

            //=============================================================
            // 워커 생성 및 시작
            //=============================================================
            // 🔹 워커 경로
            // let sWorkerPath = sap.ui.require.toUrl("zu4a_imp");
            //     sWorkerPath += "/publish/CommonJS/workers/CountdownTimerWorker.js";

            // 워커 경로
            let sWorkerPath = "/zu4a_imp/publish/CommonJS/workers/CountdownTimerWorker.js";


            const totalSeconds = (h * 3600) + (m * 60) + s;
            const now = new Date();
            this._dEndTime = new Date(now.getTime() + (totalSeconds + 1) * 1000);

            const oSendParam = { countDownDate: this._dEndTime };

            this._oWorker = new Worker(sWorkerPath);
            this._bWorkerStarted = true;

            this._oWorker.onmessage = function (e) {
                this._onWorkerMessage(e);
            }.bind(this);

            this._oWorker.postMessage(oSendParam);
            this._registerVisibilityHandler();
        },

        //-------------------------------------------------------------
        // visibilitychange 감지 (모바일/PC 전부 대응)
        //-------------------------------------------------------------
        _registerVisibilityHandler: function () {
            if (this._bVisHandlerRegistered) return;

            this._fnVisibilityHandler = function () {

                // 수면 중이라면 무시
                if (document.hidden) return;
                if (!this._bWorkerStarted || !this._dEndTime) return;

                const now = new Date();
                const diff = this._dEndTime - now;

                if (diff <= 0) {
                    this._stopTimer(false);
                    return;
                }

                // 남은 시간 재계산
                const totalSec = Math.floor(diff / 1000);
                const iH = Math.floor(totalSec / 3600);
                const iM = Math.floor((totalSec % 3600) / 60);
                const iS = Math.floor(totalSec % 60);

                // property 갱신 후 재시작
                this.setProperty("hourCount", iH, true);
                this.setProperty("minCount", iM, true);
                this.setProperty("secCount", iS, true);

                this._terminateWorker();
                this._tryStart();

            }.bind(this);

            document.addEventListener("visibilitychange", this._fnVisibilityHandler);
            this._bVisHandlerRegistered = true;
        },

        //-------------------------------------------------------------
        // 워커 메시지 수신
        //-------------------------------------------------------------
        _onWorkerMessage: function (e) {
            // 워커가 주는 h/m/s는 하루(mod 24) 기준이므로 무시하고
            // 절대 종료시각(_dEndTime)으로 남은 시간을 재계산한다.
            if (!this._dEndTime) {
                return;
            }

            const now = new Date();
            let diff = this._dEndTime - now;

            // 종료 처리
            if (diff <= 0) {
                this._updateCountdownValues(0, 0, 0);
                this._Print("00:00:00");
                this._stopTimer(false); // 워커가 isStop을 주더라도 여기서 깔끔히 정리
                return;
            }

            // 총 남은 초 → 시/분/초(시 무제한)로 변환
            const totalSec = Math.floor(diff / 1000);
            const iH = Math.floor(totalSec / 3600);
            const iM = Math.floor((totalSec % 3600) / 60);
            const iS = Math.floor(totalSec % 60);

            // property & 바인딩 동기화
            this._updateCountdownValues(iH, iM, iS);

            // 화면 출력 (시도 2자리 패딩만; 4자리 이상이면 그대로 표기됨)
            this._Print(this._pad2(iH) + ":" + this._pad2(iM) + ":" + this._pad2(iS));
        },


        //-------------------------------------------------------------
        // property & 모델 동기화
        //-------------------------------------------------------------
        _updateCountdownValues: function (h, m, s) {
            this.setProperty("hourCount", h, false);
            this.setProperty("minCount", m, false);
            this.setProperty("secCount", s, false);

            const oModel = this.getModel();
            if (oModel) {
                const hPath = this.getBindingPath("hourCount");
                if (hPath) oModel.setProperty(hPath, String(h));
                // if (hPath) oModel.setProperty(hPath, h);

                const mPath = this.getBindingPath("minCount");
                if (mPath) oModel.setProperty(mPath, String(m));
                // if (mPath) oModel.setProperty(mPath, m);

                const sPath = this.getBindingPath("secCount");                
                if (sPath) oModel.setProperty(sPath, String(s));
                // if (sPath) oModel.setProperty(sPath, s);
            }
        },

        //-------------------------------------------------------------
        // Stop / Cleanup
        //-------------------------------------------------------------
        _stopTimer: function (bManualStop) {
            this._terminateWorker();
            this._Print("00:00:00");

            // ✅ 워커가 실제 실행된 적이 있고 수동 중지가 아닐 때만 이벤트 발생
            if (this._bWorkerStarted && !bManualStop) {
                this.fireCountdownComplete();
            }

            this._bWorkerStarted = false;
        },

        _terminateWorker: function () {
            if (this._oWorker instanceof Worker) {
                this._oWorker.terminate();
                this._oWorker = null;
            }
        },

        //-------------------------------------------------------------
        // 화면 표시
        //-------------------------------------------------------------
        _Print: function (sTxt) {
            const oDom = this.getDomRef();
            if (!oDom) return;
            oDom.innerHTML = sTxt;
        },

        _pad2: function (n) {
            return (n < 10 ? "0" : "") + n;
        },
    });

    return CountdownTimer;
});