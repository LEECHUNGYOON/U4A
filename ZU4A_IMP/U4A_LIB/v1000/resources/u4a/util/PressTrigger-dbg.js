// Copyright 2017. INFOCG Inc. all rights reserved.

/*======================================================================
 * Title      : u4a.util.PressTrigger
 * Description: 사용자의 입력(클릭, 키보드, 터치 등) 감지를 기반으로
 *              일정 시간 동안 입력이 없을 경우 `finished` 이벤트를
 *              발생시키는 비가시성(UI 없는) 트리거 컨트롤.
 *
 * Behavior   :
 *   - `second` : 비활성(입력 없음) 감시 시간(초 단위)
 *   - `immediateRun` : true일 경우 즉시 감시 시작
 *
 * 동작 시나리오:
 *   · immediateRun=true && second>0 일 때 감시 활성화
 *   · 지정된 시간이 경과하면 `finished` 이벤트 발생
 *   · 사용자가 입력(클릭/키/터치)을 하면 타이머가 초기화되어 다시 카운트
 *   · 화면이 숨김(visibilitychange) 상태였다가 복귀 시 경과시간을 반영하여
 *     타이머 잔여 시간을 재계산 (모바일/PC 공통 지원)
 *
 * Internal   :
 *   - PC: window click, document keyup 이벤트로 사용자 입력 감시
 *   - Mobile: window touchstart 이벤트로 감시
 *   - visibilitychange 이벤트 등록으로 브라우저 탭 비활성화 시 상태 보존
 *   - 비가시성 Renderer(div display:none)
 *
 * Notes      :
 *   - second ≤ 0 → 동작 안 함
 *   - immediateRun=false → 감시 미시작
 *   - 종료 시 자동으로 immediateRun=false 로 전환
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-30
 *======================================================================*/

sap.ui.define("u4a.util.PressTrigger", [
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    var PressTrigger = Control.extend("u4a.util.PressTrigger", {
        metadata: {
            library: "u4a.util",
            properties: {
                second: { type: "int", defaultValue: 0 },
                immediateRun: { type: "boolean", defaultValue: false }
            },
            events: {
                finished: { allowPreventDefault: true }
            }
        },

        //============================================================
        // Renderer
        //============================================================
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("display", "none");
            oRm.writeStyles();
            oRm.write("></div>");
        },

        //============================================================
        // Lifecycle
        //============================================================
        onAfterRendering: function () {

            console.log("PressTrigger --- onAfterRendering");

            this._detachBrowserEvents();
            this._clearTriggerTimer();
            this._unregisterVisibilityHandler();

            // 화면 가시성 감시 등록 (모바일 포함)
            this._registerVisibilityHandler();

            // 조건 만족 시 실행
            if (this._isRunnable()) {
                this._attachBrowserEvents();
                this._startTriggerTimer();
            }
        },

        //============================================================
        // 실행 조건 검사
        //============================================================
        _isRunnable: function () {
            return this.getImmediateRun() === true && this.getSecond() > 0;
        },

        //============================================================
        // 타이머 관리
        //============================================================
        _startTriggerTimer: function () {
            this._clearTriggerTimer();

            const iSec = this.getSecond();
            if (iSec <= 0) {
                return;
            }

            this._triggerTimerStartTime = Date.now();

            this._triggerTimer = setTimeout(function () {
                this._handleInactivityTimeout();
            }.bind(this), iSec * 1000);
        },

        _clearTriggerTimer: function () {
            if (this._triggerTimer) {
                clearTimeout(this._triggerTimer);
                this._triggerTimer = null;
            }
        },

        _restartTriggerTimer: function () {
            this._clearTriggerTimer();
            if (this._isRunnable()) {
                this._startTriggerTimer();
            }
        },

        //============================================================
        // 윈도우 / 문서 이벤트
        //============================================================
        _attachBrowserEvents: function () {
            const sDeviceName = sap.ui.Device.os.name;
            const sNs = ".u4aPressTrigger_" + this.getId();
            const fnHandler = this._onUserAction.bind(this);

            this._eventNamespace = sNs;
            this._boundHandler = fnHandler;

            if (sDeviceName === "win") {
                $(window).on("click" + sNs, fnHandler);
            } else {
                $(window).on("touchstart" + sNs, fnHandler);
            }

            $(document).on("keyup" + sNs, fnHandler);
        },

        _detachBrowserEvents: function () {
            if (!this._eventNamespace) {
                return;
            }

            $(window).off(this._eventNamespace);
            $(document).off(this._eventNamespace);

            this._eventNamespace = null;
            this._boundHandler = null;
        },

        _onUserAction: function () {

            console.log("PressTrigger --- _onUserAction");

            if (this._isRunnable()) {
                this._restartTriggerTimer();
            }
        },

        //============================================================
        // 잠금/복귀 감시 로직 (모바일 포함)
        //============================================================
        _registerVisibilityHandler: function () {
            if (this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
            }

            this._fnVisibilityHandler = this._onVisibilityChange.bind(this);
            document.addEventListener("visibilitychange", this._fnVisibilityHandler);
        },

        _unregisterVisibilityHandler: function () {
            if (this._fnVisibilityHandler) {
                document.removeEventListener("visibilitychange", this._fnVisibilityHandler);
                this._fnVisibilityHandler = null;
            }
        },

        _onVisibilityChange: function () {
            if (document.hidden) {
                this._lastHiddenTime = Date.now();
                return;
            }

            if (!document.hidden && this._lastHiddenTime) {
                const diffMs = Date.now() - this._lastHiddenTime;
                this._adjustRemainingTime(diffMs);
                this._lastHiddenTime = null;
            }
        },

        _adjustRemainingTime: function (elapsedMs) {
            if (!this._triggerTimerStartTime || !this._isRunnable()) {
                return;
            }

            const remainingMs = (this.getSecond() * 1000) - (Date.now() - this._triggerTimerStartTime);
            const newRemainingMs = remainingMs - elapsedMs;

            if (newRemainingMs <= 0) {
                this._handleInactivityTimeout();
                return;
            }

            const newSeconds = Math.ceil(newRemainingMs / 1000);
            this.setProperty("second", newSeconds, true);
            this._restartTriggerTimer();
        },

        //============================================================
        // 타이머 종료 처리
        //============================================================
        _handleInactivityTimeout: function () {
            this._detachBrowserEvents();
            this._clearTriggerTimer();

            // 종료 시 immediateRun false로 전환
            this.setProperty("immediateRun", false, true);

            this.fireFinished();
        },

        //============================================================
        // Property Setter Override
        //============================================================
        setImmediateRun: function (bVal) {
            const bPrev = this.getProperty("immediateRun");
            this.setProperty("immediateRun", bVal, true);

            if (bPrev === bVal) {
                return this;
            }

            if (bVal === true && this._isRunnable()) {
                this._attachBrowserEvents();
                this._restartTriggerTimer();
            } else {
                this._detachBrowserEvents();
                this._clearTriggerTimer();
            }

            return this;
        },

        setSecond: function (iVal) {
            this.setProperty("second", iVal, true);

            if (this._isRunnable()) {
                this._restartTriggerTimer();
            }

            return this;
        },

        //============================================================
        // 종료 정리
        //============================================================
        exit: function () {
            this._detachBrowserEvents();
            this._clearTriggerTimer();
            this._unregisterVisibilityHandler();
        }
    });

    return PressTrigger;
});