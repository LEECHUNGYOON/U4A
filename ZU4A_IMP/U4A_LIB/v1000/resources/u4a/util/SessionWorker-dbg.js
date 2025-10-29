// Copyright 2017. INFOCG Inc. all rights reserved.

/*======================================================================
 * Title      : u4a.util.SessionWorker
 * Description: 일정 주기마다 백그라운드 Web Worker를 통해 서버를 호출하여
 *              세션 타임아웃을 방지하는 UI5 컨트롤.
 *
 * Behavior   :
 *   - minute 속성에 따라 세션 유지 주기를 분 단위로 설정함.
 *   - activeWorker=false 시 즉시 워커 종료.
 *   - minute 값에 따라 동작/비동작/오류 발생 조건이 달라짐.
 *       · minute < 0      → 덤프 발생
 *       · minute = 0      → 워커 미생성 (비동작)
 *       · 1 ≤ minute ≤120 → 정상 동작
 *       · minute > 120    → 덤프 발생
 *   - Worker 내부에서 설정된 주기가 경과하면 `finished` 이벤트 발생.
 *
 * Internal   :
 *   - Web Worker 스크립트 경로 : /zu4a_imp/publish/CommonJS/workers/SessionWorker.js
 *   - 브라우저가 Worker를 지원하지 않을 경우 예외 덤프 처리.
 *   - Worker 오류, 메시지 송신 실패 시 자동 종료 및 예외 덤프.
 *   - 부모 컨트롤 rerender 시에도 기존 Worker는 유지.
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-30
 *======================================================================*/


sap.ui.define("u4a.util.SessionWorker", [
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    var SessionWorker = Control.extend("u4a.util.SessionWorker", {

        metadata: {
            library: "u4a.util",
            properties: {
                /**
                 * @property {int} minute
                 * 세션 유지 주기(분 단위)
                 *  - < 0     → 덤프 발생
                 *  - = 0     → 동작 안 함 (워커 미생성)
                 *  - 1~120   → 정상 동작
                 *  - > 120   → 덤프 발생
                 */
                minute: { type: "int", defaultValue: 0 },

                /**
                 * @property {boolean} activeWorker
                 * true일 경우 워커를 활성화함.
                 */
                activeWorker: { type: "boolean", defaultValue: true },
            },
            events: {
                /**
                 * @event finished
                 * 설정된 minute 경과 후 호출됨.
                 */
                finished: { allowPreventDefault: true }
            }
        },

        /*======================================================================
         * 내부 변수
         *======================================================================*/
        _oWorker: null,      // Worker 인스턴스
        _maxMinute: 120,     // 허용 최대값 (120까지 OK, 초과시 오류)

        /*======================================================================
         * 초기화
         *======================================================================*/
        init: function () {
            if (!window.Worker) {
                this._dumpAndThrow("[SessionWorker] This browser does not support Web Worker.");
            }
        },

        /*======================================================================
         * Renderer
         *======================================================================*/
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("display", "none");
            oRm.writeStyles();
            oRm.write("></div>");
        },

        /*======================================================================
         * 공통: 덤프 + throw
         *======================================================================*/
        _dumpAndThrow: function (sErrMsg) {
            console.error(sErrMsg);

            if (typeof oU4AErroHandle !== "undefined" &&
                typeof oU4AErroHandle.seterroHTML === "function") {
                oU4AErroHandle.seterroHTML(sErrMsg);
            }

            throw new Error(sErrMsg);
        },

        /*======================================================================
         * 공통: Worker 종료
         *======================================================================*/
        _terminateWorker: function () {
            if (!this._oWorker) {
                return;
            }

            try {
                this._oWorker.terminate();
            } catch (e) {
                console.warn("[SessionWorker] Worker terminate failed:", e);
            }

            this._oWorker = null;
            console.info("[SessionWorker] Worker terminated.");
        },

        /*======================================================================
         * Worker 생성 (검증은 onAfterRendering에서 완료됨)
         *======================================================================*/
        createWorker: function () {
            var iKeepTime = this.getMinute();

            try {
                this._oWorker = new Worker('/zu4a_imp/publish/CommonJS/workers/SessionWorker.js');
            } catch (ex) {
                this._terminateWorker();
                this._dumpAndThrow("[SessionWorker] Worker creation failed: " + ex.message);
            }

            this._oWorker.onerror = function (e) {
                this._terminateWorker();
                this._dumpAndThrow("[SessionWorker] Worker runtime error: " + e.message +
                    " (" + e.filename + ":" + e.lineno + ")");
            }.bind(this);

            try {
                this._oWorker.postMessage({ keeptime: iKeepTime });
            } catch (ex2) {
                this._terminateWorker();
                this._dumpAndThrow("[SessionWorker] Failed to post message to Worker: " + ex2.message);
            }

            this._oWorker.onmessage = function (e) {
                if (e.data === "X") {
                    this.fireFinished();
                }
            }.bind(this);

            console.info("[SessionWorker] Worker started (" + iKeepTime + " min)");
        },

        /*======================================================================
         * 렌더링 이후 처리 (속성 검증 + 워커 생성/종료 제어)
         *======================================================================*/
        onAfterRendering: function () {

            var bActive = this.getActiveWorker();
            var iMinute = this.getMinute();

            // activeWorker=false → 기존 워커 종료
            if (!bActive) {
                this._terminateWorker();
                return;
            }

            // minute < 0 → 덤프 + 워커 종료
            if (iMinute < 0) {
                this._terminateWorker();
                this._dumpAndThrow("The 'minute' property of the 'SessionWorker' must not be negative.");
            }

            // minute === 0 → 동작 안 함 (워커 미생성, 단순 종료)
            if (iMinute === 0) {
                this._terminateWorker();
                console.info("[SessionWorker] minute = 0 → Worker not started.");
                return;
            }

            // minute > 120 → 덤프 + 워커 종료
            if (iMinute > this._maxMinute) {
                this._terminateWorker();
                this._dumpAndThrow("The 'minute' property of the 'SessionWorker' cannot exceed 120 minutes.");
            }

            // 이미 워커가 존재한다면 유지 (부모 rerender에도 유지)
            if (this._oWorker instanceof Worker) {
                return;
            }

            // 모든 조건 통과 시 워커 생성
            this.createWorker();
        },

        /*======================================================================
         * 종료 처리
         *======================================================================*/
        exit: function () {
            this._terminateWorker();
        }

    });

    return SessionWorker;

});