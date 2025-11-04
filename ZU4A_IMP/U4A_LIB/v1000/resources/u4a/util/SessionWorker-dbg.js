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
 *   - Web Worker 스크립트는 외부 경로 파일이 아닌, 런타임 시 Blob 기반으로
 *     동적으로 생성됨 (URL.createObjectURL 방식).
 *   - 모바일 및 백그라운드 전환 시 실제 경과시간(Date.now) 기준으로
 *     남은 시간을 자동 계산하여 호출 타이밍을 정확히 유지함.
 *   - 브라우저가 Worker를 지원하지 않을 경우 예외 덤프 처리.
 *   - Worker 오류, 메시지 송신 실패 시 자동 종료 및 예외 덤프.
 *   - 부모 컨트롤 rerender 시에도 기존 Worker는 유지.
 *   - 종료 시 revokeObjectURL() 을 통해 Blob URL 캐시 해제.
 *
 * Author     : LEE CHUNGYOON
 * Revised on : 2025-10-31
 *======================================================================*/

sap.ui.define("u4a.util.SessionWorker", [
    "sap/ui/core/Control"
], function(Control) {
    "use strict";

    var SessionWorker = Control.extend("u4a.util.SessionWorker", {

        metadata: {
            library: "u4a.util",
            properties: {
                minute: {
                    type: "int",
                    defaultValue: 0
                },
                activeWorker: {
                    type: "boolean",
                    defaultValue: true
                },
            },
            events: {
                finished: {
                    allowPreventDefault: true
                }
            }
        },

        // 내부 상태
        _oWorker: null,
        _sDynamicWorkerUrl: null,
        _maxMinute: 120,
        _bVisHandlerRegistered: false,
        _deadlineTs: null, // ← 절대 종료시각 (ms)
        _lastCycleStartTs: null,

        /*======================== 공통 유틸 ========================*/
        _dumpAndThrow: function(msg) {
            console.error(msg);
            if (typeof oU4AErroHandle !== "undefined" &&
                typeof oU4AErroHandle.seterroHTML === "function") {
                oU4AErroHandle.seterroHTML(msg);
            }
            throw new Error(msg);
        },

        _terminateWorker: function() {
            if (this._oWorker) {
                try {
                    this._oWorker.terminate();
                } catch (e) {
                    console.warn(e);
                }
            }
            if (this._sDynamicWorkerUrl) {
                URL.revokeObjectURL(this._sDynamicWorkerUrl);
                this._sDynamicWorkerUrl = null;
            }
            this._oWorker = null;
        },

        /*======================== 렌더러 ========================*/
        renderer: function(oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("display", "none");
            oRm.writeStyles();
            oRm.write("></div>");
        },

        /*======================== 워커 스크립트 ========================*/
        _getWorkerScript: function() {
            // 단순: start(분단위, float 허용)만 지원. setInterval(1s)로 now>=targetTime시 "X".
            return `
        /***************************************************
         * u4a.util.SessionWorker 용 워커 스크립트
         ***************************************************/
        
        self.workInterval = null;
        self.keepTime = null;
        self.targetTime = null;

        self.onmessage = function(e){
          var d = e.data;
          if(d && d.cmd === "start"){
            if(self.workInterval){ clearInterval(self.workInterval); self.workInterval = null; }
            self.keepTime = d.keeptime * 60000; // 분 → ms (float 허용)
            self.targetTime = Date.now() + self.keepTime;

            self.workInterval = setInterval(function(){
              var remain = self.targetTime - Date.now();
              if(remain <= 0){
                postMessage("X");
                clearInterval(self.workInterval);
                self.workInterval = null;
              }
            }, 1000);
          }
          if(d && d.cmd === "stop"){
            if(self.workInterval){ clearInterval(self.workInterval); self.workInterval = null; }
          }
        };
      `;
        },

        _createDynamicWorker: function() {
            if (this._oWorker instanceof Worker) return;
            try {
                const blob = new Blob([this._getWorkerScript()], {
                    type: "application/javascript"
                });
                this._sDynamicWorkerUrl = URL.createObjectURL(blob);
                this._oWorker = new Worker(this._sDynamicWorkerUrl);

                this._oWorker.onerror = function(e) {
                    this._terminateWorker();
                    this._dumpAndThrow("[SessionWorker] Worker runtime error: " + e.message);
                }.bind(this);

                this._oWorker.onmessage = function(e) {
                    if (e.data === "X") {
                        this._onCycleFinishedFromWorker();
                    }
                }.bind(this);

            } catch (ex) {
                this._terminateWorker();
                this._dumpAndThrow("[SessionWorker] Failed to create dynamic worker: " + ex.message);
            }
        },

        /*======================== 코어 로직 ========================*/

        // deadline 설정 (시작점 고정)
        _armDeadlineIfNeeded: function() {
            if (this._deadlineTs == null) {
                const ms = this.getMinute() * 60000;
                this._lastCycleStartTs = Date.now();
                this._deadlineTs = this._lastCycleStartTs + ms;
            }
        },

        // 남은 시간(ms) 계산 (음수 허용)
        _getRemainMs: function() {
            if (this._deadlineTs == null) return 0;
            return this._deadlineTs - Date.now();
        },

        // 워커에 남은 시간만큼만 재시작 (remainMs>0일 때만)
        _startWorkerForRemain: function(remainMs) {
            this._createDynamicWorker();
            const keepMinFloat = remainMs / 60000; // float 허용
            try {
                this._oWorker.postMessage({
                    cmd: "start",
                    keeptime: keepMinFloat
                });
            } catch (e) {
                this._terminateWorker();
                this._dumpAndThrow("[SessionWorker] postMessage(start) failed: " + e.message);
            }
        },

        // 사이클 종료 처리: finished 이벤트 즉시 호출 + 다음 사이클 재가동
        _onCycleFinishedFromWorker: function() {
            // 1) 즉시 finished 알림
            this.fireFinished();

            // 2) 여전히 활성 상태라면 다음 사이클 재무장
            if (this.getActiveWorker() && this.getMinute() > 0) {
                const ms = this.getMinute() * 60000;
                this._lastCycleStartTs = Date.now();
                this._deadlineTs = this._lastCycleStartTs + ms;
                // 다음 사이클 시작
                const remain = this._getRemainMs();
                if (remain > 0) this._startWorkerForRemain(remain);
            } else {
                // 비활성/0분이면 종료
                this._deadlineTs = null;
                this._terminateWorker();
            }
        },

        // visible 복귀 시 절대시간 기준으로 즉시/잔여 처리
        _resumeByDeadline: function() {
            if (!this.getActiveWorker()) {
                this._terminateWorker();
                return;
            }
            if (this.getMinute() <= 0) {
                this._terminateWorker();
                return;
            }

            this._armDeadlineIfNeeded();

            const remain = this._getRemainMs();
            if (remain <= 0) {
                // 이미 만료 → 즉시 finished + 다음 사이클 재무장
                this._onCycleFinishedFromWorker();
                return;
            }
            // 아직 남았음 → 정확히 남은 시간만 재시작
            this._startWorkerForRemain(remain);
        },

        /*======================== 라이프사이클 ========================*/
        onAfterRendering: function() {
            const bActive = this.getActiveWorker();
            const iMinute = this.getMinute();

            if (!bActive) {
                this._terminateWorker();
                this._deadlineTs = null;
                return;
            }
            if (iMinute < 0) {
                this._terminateWorker();
                this._deadlineTs = null;
                this._dumpAndThrow("The 'minute' must not be negative.");
            }
            if (iMinute === 0) {
                this._terminateWorker();
                this._deadlineTs = null;
                return;
            }
            if (iMinute > this._maxMinute) {
                this._terminateWorker();
                this._deadlineTs = null;
                this._dumpAndThrow("The 'minute' cannot exceed 120.");
            }

            this._armDeadlineIfNeeded();

            // 현재 남은 시간으로 워커 가동(또는 재가동)
            const remain = this._getRemainMs();
            if (remain <= 0) {
                this._onCycleFinishedFromWorker();
            } else {
                this._startWorkerForRemain(remain);
            }

            // visibility 핸들러 1회 등록
            this._registerVisibilityHandler();
        },

        _registerVisibilityHandler: function() {
            if (this._bVisHandlerRegistered) return;
            this._bVisHandlerRegistered = true;

            document.addEventListener("visibilitychange", function() {
                if (document.visibilityState === "visible") {
                    // 복귀 시 절대시간 기준으로 즉시/잔여 처리
                    this._resumeByDeadline();
                } else {
                    // hidden일 때는 아무 것도 하지 않음 (deadline 기준이라 필요 없음)
                }
            }.bind(this));
        },

        exit: function() {
            this._deadlineTs = null;
            this._terminateWorker();
        }

    });

    return SessionWorker;
});