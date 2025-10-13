//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Control",
"u4a/m/MatrixLayoutRenderer"

], function(Control, MatrixLayoutRenderer){
    "use strict";

    var _oMatrixLayout = Control.extend("u4a.m.MatrixLayout", {
        metadata : {
            library : "u4a.m",
            properties : {

                //MatrixLayout이 부모 영역의 width만큼 커질지 여부(width=100%)
                stretchedHorizontally : { type : "boolean", defaultValue : false },
                
                //MatrixLayout이 부모 영역의 height만큼 커질지 여부
                stretchedVertically : { type : "boolean", defaultValue : false },

                
                //MatrixLayout의 가로 크기.
                width : { type : "sap.ui.core.CSSSize", defaultValue : "100%"},

                //MatrixLayout의 세로 크기.
                height : { type : "sap.ui.core.CSSSize" }


            },

            defaultAggregation : "content",

            aggregations : {
                content : { type : "sap.ui.core.Control", multiple : true, singularName: "content" }
            },


        }, /* end of metadata */

        renderer : MatrixLayoutRenderer,




        /*************************************************************
        * @function - onAfterRendering
        *************************************************************/
        onAfterRendering: function () {

            this._setGridTemplateColumns();

        },




        /*************************************************************
        * @function - grid template column style 설정. 
        *************************************************************/
        _setGridTemplateColumns : function(){

            var _oDom = this.getDomRef("content");

            if(!_oDom){
                return;
            }

            //컬럼 수 계산 처리.
            var _colCount = this._getColCount();


            var _aContentMap = this._calculateGridPositions(_colCount);

            //위에서 얻은 grid 포지션 매핑 정보를 갖고 layout에 지정할 style 구성.
            var _gridTempCol = this._getGridTemplateColumns(_colCount, _aContentMap);

            //grid template column style 설정.
            _oDom.style.gridTemplateColumns = _gridTempCol;


            //위에서 얻은 grid를 통해 colSpan, rowSpan 구성 처리
            //(화면이 구성된 이후에 컬럼의 current breakPoint를 결정 하기에
            //이 시점에 XLarge, Large, Medium, Small에 해당하는 colSpan, rowSpan을 처리 해야함)
            this._setContentSpan(_colCount, _aContentMap);

        },




        /*************************************************************
        * @function - layout의 content UI에 대해 colSpan, rowSpan 처리.
        *************************************************************/
        _setContentSpan : function(colCount, aContentMap){

            if(aContentMap.length === 0){
                return;
            }

            for (let i = 0, l = aContentMap.length; i < l; i++) {
                
                var _sContentMap = aContentMap[i];

                var _oLayout = _sContentMap?.oUi?.getLayoutData?.();

                if(!_oLayout){
                    continue;
                }

                var _oDom = _oLayout.getDomRef();

                if(!_oDom){
                    continue;
                }

                var _layoutType = _oLayout?.getLayoutType();

                //layoutData의 컬럼 병합 값 얻기.
                var _colSpan = _oLayout?.getColSpan?.() || 1;

                _colSpan = `span ${_colSpan}`;

                if(_layoutType === "MatrixHeadData"){
                    _colSpan = `1 / ${_colSpan}`;
                }

                //이전 column style과 다를 경우 값 매핑.
                //(같은 값을 다시 매핑처리 하지 않음)
                if(_oDom.style.gridColumn !== _colSpan){
                    _oDom.style.gridColumn = _colSpan;
                }

               
            }

        },




        /*************************************************************
        * @function - grid template column style 얻기. 
        *************************************************************/
        _getGridTemplateColumns: function(colCount, aContentMap){

            //default gridTemplateColumns style 구성.
            var _style = `repeat(${colCount}, minmax(min-content, max-content))`;

            
            var _oDom = this.getDomRef();

            if(!_oDom){
                return _style;
            }

            //default UI간의 가로 크기.
            var _defaultSize = "minmax(min-content, max-content)";

            //UI를 수평으로 고르게 영역을 분배하여 표현 하는경우.
            if(this.getStretchedHorizontally() === true){
                _defaultSize = "auto";
            }

            
			const _aColWeights = [];

            //구성할 컬럼 수 만큼 매핑 max값 구성 array 생성.
            for (let i = 0; i < colCount; i++) {
                _aColWeights.push({size: _defaultSize, calcSize: 0});
                
            }


            //현재 dom의 width크기.
            const _contentWidth = _oDom.clientWidth;
            
            //em, rem 계산을 위한 default 상수값.
            const _rootFontSize = parseFloat(getComputedStyle(document?.documentElement)?.fontSize) || 16;

            //viewport width 계산을 위한 default 상수값.
            const _viewportWidth = window.innerWidth;
            
            //viewport height 계산을 위한 default 상수값.
            const _viewportHeight = window.innerHeight;

            for (let i = 0, l = aContentMap.length; i < l; i++) {
                
                var _sContentMap = aContentMap[i];
                
                //ui에 구성된 layoutData 얻기.
				const _oLayoutData = _sContentMap.oUi?.getLayoutData?.();

                if(!_oLayoutData){
                    continue;
                }

                //layoutData에 구성한 width 값 얻기.
				var _sWidth = _oLayoutData?.getWidth?.();

                if(!_sWidth){
                    continue;
                }

                _sWidth = String(_sWidth).toLowerCase();

                if(_sWidth === "auto" || _sWidth === "inherit"){
                    continue;
                }

                var _sCalc = _aColWeights[_sContentMap.colPos];
                
                //숫자, ., -를 제거 처리.
                //(100px 에서 100을 제거)
                let _unit = _sWidth.replace(/[0-9.-]/g, "");

                //단위를 제거 처리.
                //(100px 에서 px를 제거)
                var _value = Number(_sWidth.replace(/[^0-9.-]/g, "")) || 0;


                //입력 unit에 따른 로직 분기.
                switch (_unit) {
                    case "rem": //rem입력시 
                        _value = _value * _rootFontSize;
                        break;

                    case "em":
                        _value = _value * _rootFontSize; // 기본적으로 부모 폰트 크기 적용
                        break;

                    case "vw":
                        _value = (_value * _viewportWidth) / 100;
                        break;

                    case "vh":
                        _value = (_value * _viewportHeight) / 100;
                        break;

                    case "pt":
                        _value = _value * 1.3333;
                        break;

                    case "cm":
                        _value = _value * 37.8;
                        break;

                    case "mm":
                        _value = _value * 3.78;
                        break;

                    case "in":
                        _value = _value * 96;
                        break;

                    case "px":
                        _value = _value;
                        break;

                    case "%":
                        //% 인경우 현재 출력할 grid의 width에서 해당 %값 만큼을 계산.
                        _value = _contentWidth * (_value / 100);
                        break;

                    default:

                }


                //수집한 size 보다 현재 size가 큰경우 컬럼의 size 갱신 처리.
                if(_value > _sCalc.calcSize ){
                    _sCalc.size = _sWidth;
                    _sCalc.calcSize = _value;
                    
                }

                
            }
            
            var _aColDefs = [];

            //각 컬럼별 최대 크기값을 기준으로 css 정보 구성.
            //(컬럼에 해당하는 cell에 설정된 width중 가장 큰것을 발췌)
            for (let i = 0, l = _aColWeights.length; i < l; i++) {
                
                var _sColWeights = _aColWeights[i];

                var _size = _sColWeights.size;

                //해당 컬럼이 default size 인경우 해당 값 수집.
                if(_size === _defaultSize){
                    _aColDefs.push(_size);
                    continue;    
                }

                //최소 크기는 content의 UI크기, 최대 크기는 layoutData에 설정한 크기.
                _size = `minmax(min-content, ${_sColWeights.size})`;

                _aColDefs.push(_size);
                
            }

            if(_aColDefs.length > 0){
                _style = _aColDefs.join(" ");
            }


            return _style;

        },




        /*************************************************************
        * @function - row가 존재하지 않으면 추가 처리.
        *************************************************************/
        _ensureRowExists : function(sPosInfo) {
            while (sPosInfo.gridMap.length <= sPosInfo.rowIndx) {
                sPosInfo.gridMap.push(new Array(sPosInfo.colCount).fill(false));
            }
        },




        /*************************************************************
        * @function - rowSpan x colSpan 블럭이 비어있는지 확인
        *************************************************************/
        _isBlockFree : function(sPosInfo) {
            
            for (let rowCnt = 0; rowCnt < sPosInfo.rowSpan; rowCnt++) {

                var _sPosInfo = {...sPosInfo};

                _sPosInfo.rowIndx += rowCnt;

                // row가 존재하지 않으면 추가
                this._ensureRowExists(_sPosInfo);

                for (let colCnt = 0; colCnt < sPosInfo.colSpan; colCnt++) {

                    if (sPosInfo.gridMap[_sPosInfo.rowIndx][sPosInfo.colIndx + colCnt]) {
                        return false;
                    }

                }
            }
            return true;
        },




        /*************************************************************
        * @function - 블럭을 차지한 상태로 표시
        *************************************************************/
        _occupyBlock : function(sPosInfo) {
            
            for (let rowCnt = 0; rowCnt < sPosInfo.rowSpan; rowCnt++) {

                var _sPosInfo = {...sPosInfo};

                _sPosInfo.rowIndx += rowCnt;

                this._ensureRowExists(_sPosInfo);

                for (let colCnt = 0; colCnt < sPosInfo.colSpan; colCnt++) {

                    sPosInfo.gridMap[_sPosInfo.rowIndx][sPosInfo.colIndx + colCnt] = true;
                }

            }
        },




        /*************************************************************
        * @function - content의 column, row 병합에 따른 실제 position 정보 매핑.
        *************************************************************/
        _calculateGridPositions : function(colCount) {

            const _aContentMap = [];

            var _sPosInfo = {};

            //grid상에서 row, col에 해당하는 정보 map.
            _sPosInfo.gridMap = [];

            //그려질 컬럼 count.
            _sPosInfo.colCount = colCount;

            var _aContent = this.getContent();

            if(_aContent.length === 0){
                return _aContentMap;
            }


            for (const ui of _aContent) {

				// // 1. colSpan 추출
				const _oLayoutData = ui.getLayoutData?.();


                //layoutData의 컬럼 병합 값 얻기.
                _sPosInfo.colSpan = _oLayoutData?.getColSpan?.() || 1;

                _sPosInfo.colSpan = Math.max(_sPosInfo.colSpan, 1);

                //layoutData의 row 병합 값 얻기.
                _sPosInfo.rowSpan = _oLayoutData?.getRowSpan?.() || 1;

                _sPosInfo.rowSpan = Math.max(_sPosInfo.rowSpan, 1);

                // const colSpan = Math.min(_colSpan, colInfo.colCount);
                _sPosInfo.colSpan = Math.min(_sPosInfo.colSpan, colCount);
                
                
                let placed = false;

                //현재 UI가 column, row의 위치를 찾을떄까지 반복.
                for (let rowIndx = 0; !placed; rowIndx++) {

                    _sPosInfo.rowIndx = rowIndx;

                    // row가 존재하지 않으면 추가
                    this._ensureRowExists(_sPosInfo);

                    for (let colIndx = 0, colLen = colCount - _sPosInfo.colSpan; colIndx <= colLen; colIndx++) {
                        

                        _sPosInfo.colIndx = colIndx;

                        // rowSpan x colSpan 블럭이 비어있는지 확인
                        if (!this._isBlockFree(_sPosInfo)) {
                            //비어져 있지 않는경우 skip.
                            continue;
                        }

                        //비워져 있는 블럭 채우기.
                        this._occupyBlock(_sPosInfo);

                        _aContentMap.push({
                            oUi     : ui,
                            rowPos  : rowIndx,
                            colPos  : colIndx,
                            colSpan : _sPosInfo.colSpan,
                            rowSpan : _sPosInfo.rowSpan,
                        });

                        placed = true;

                        break;
                    }
                }
            }

            return _aContentMap;
        },




        /*************************************************************
        * @function - column count 값 구성.
        *************************************************************/
        _getColCount : function(){

            var _maxColCnt = 1;
            var _aContent = this.getContent();

            if (_aContent.length === 0) {
                return _maxColCnt;
            }

            var _colCnt = 0;

            for (let i = 0; i < _aContent.length; i++) {

                var _oContent = _aContent[i];
                var _oLayout = _oContent.getLayoutData?.();

                // layoutData가 유효하지 않으면 기본 1컬럼으로 간주하고 다음으로
                if (!_oLayout?.isA || !_oLayout.isA("u4a.m.MatrixLayoutData")) {
                    _colCnt += 1;
                    _maxColCnt = Math.max(_maxColCnt, _colCnt);
                    continue;
                }

                // 행의 시작을 의미하는 MatrixHeadData인 경우 컬럼 카운터 초기화
                if (_oLayout.getLayoutType() === "MatrixHeadData") {
                    _colCnt = 0;
                }

                // colSpan이 설정되어 있다면 해당 span 수만큼 더하고, 아니면 기본 1
                var iColSpan = parseInt(_oLayout.getColSpan(), 10);
                iColSpan = isNaN(iColSpan) || iColSpan < 1 ? 1 : iColSpan;

                _colCnt += iColSpan;

                // 최대 컬럼 수 갱신
                _maxColCnt = Math.max(_maxColCnt, _colCnt);
            }

            return _maxColCnt;

        }


    });

    return _oMatrixLayout;

});