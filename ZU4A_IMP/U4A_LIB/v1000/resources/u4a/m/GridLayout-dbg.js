//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Control",
"u4a/m/GridLayoutRenderer",
"sap/ui/core/ResizeHandler"

], function(Control, GridLayoutRenderer, ResizeHandler){
    "use strict";

    const CS_BREAK_POINT = {
        XL : "XL",
        L  : "L",
        M  : "M",
        S  : "S"
    };

    var _oGridLayout = Control.extend("u4a.m.GridLayout", {
        metadata : {
            library : "u4a.m",
            properties : {

                //cell 의 안쪽여백
                cellPadding : { type : "int", defaultValue : 0 },

                //cell끼리의 간격
                cellSpacing : { type : "int", defaultValue : 0 },

                //grid 영역의 크기가 Small 크기 일때 grid에서 표현할 컬럼수.
                colCountS : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Medium 크기 일때 grid에서 표현할 컬럼수.
                colCountM : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Large 크기 일때 grid에서 표현할 컬럼수.
                colCountL : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 XLarge 크기 일때 grid에서 표현할 컬럼수 .
                colCountXL : { type : "int", defaultValue : 1 },
                
                //GridLayout이 부모 영역의 width만큼 커질지 여부
                stretchedHorizontally : { type : "boolean", defaultValue : false },
                
                //GridLayout이 부모 영역의 height만큼 커질지 여부
                stretchedVertically : { type : "boolean", defaultValue : false },

                //layout을 반응형으로 설정 할지 여부 프로퍼티.
                flexibleLayout : {type : "boolean", defaultValue : true},
                
                //반응형 처리시 XLagre 기준 width.
                breakpointXL : { type : "int", defaultValue : 1440 },

                //반응형 처리시 Lagre 기준 width.
                breakpointL : { type : "int", defaultValue : 1024 },

                //반응형 처리시 Medium 기준 width.
                breakpointM : { type : "int", defaultValue : 600 },

                //gridLayout의 가로 크기.
                width : { type : "sap.ui.core.CSSSize", defaultValue : "100%"},

                //gridLayout의 세로 크기.
                height : { type : "sap.ui.core.CSSSize" }


            },

            defaultAggregation : "content",

            aggregations : {
                content : { type : "sap.ui.core.Control", multiple : true, singularName: "content" }
            }


        }, /* end of metadata */    

        init : function(){
            
            this._resizeHandler = null;

        },

        exit : function(){

            //이전 resize Handler가 존재하는경우 등록 해제.
            if (this._resizeHandler) {
                ResizeHandler.deregister(this._resizeHandler);
                this._resizeHandler = null;
            }

        },

        renderer : GridLayoutRenderer,



        /*************************************************************
        * @function - onAfterRendering
        *************************************************************/
        onAfterRendering: function () {

            //이전 resize Handler가 존재하는경우 등록 해제.
            if (this._resizeHandler) {
                ResizeHandler.deregister(this._resizeHandler);
            }


            //resize Handler 이벤트 등록.
            //(dom의 크기가 변경 했을때의 이벤트 등록 처리.)
            this._resizeHandler = ResizeHandler.register(this, this._setGridTemplateColumns.bind(this));


            //grid template column style 설정. 
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
            var _sColInfo = this._calcColumnInfo();


            //grid의 row, column position 매핑.
            var _aContentMap = this._calculateGridPositions(_sColInfo);


            //위에서 얻은 grid 포지션 매핑 정보를 갖고 layout에 지정할 style 구성.
            var _gridTempCol = this._getGridTemplateColumns(_sColInfo, _aContentMap);


            //grid template column style 설정.
            _oDom.style.gridTemplateColumns = _gridTempCol;


            //위에서 얻은 grid를 통해 colSpan, rowSpan 구성 처리
            //(화면이 구성된 이후에 컬럼의 current breakPoint를 결정 하기에
            //이 시점에 XLarge, Large, Medium, Small에 해당하는 colSpan, rowSpan을 처리 해야함)
            this._setContentSpan(_sColInfo, _aContentMap);
            


        },




        /*************************************************************
        * @function - grid template column style 얻기. 
        *************************************************************/
        _getGridTemplateColumns: function(sColInfo, aContentMap){

            //default gridTemplateColumns style 구성.
            var _style = `repeat(${sColInfo.colCount}, minmax(min-content, max-content))`;

            
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
            for (let i = 0; i < sColInfo.colCount; i++) {
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
        * @function - 레이아웃 컬럼 수 계산.
        *************************************************************/
        _calcColumnInfo : function(){

            var _sColInfo = {};

            //default X Large 컬럼 size.
            _sColInfo.colCount = Math.max(this.getColCountXL(), 1); 
            
            _sColInfo.currentBreakPoint = CS_BREAK_POINT.XL;
            
            //layout Dom 정보 얻기.
            var _oDom = this.getDomRef() || undefined;

            //dom 정보가 존재하지 않는경우 default X Large 값을 column 정보로 처리.
            if(typeof _oDom === "undefined"){
                return _sColInfo;
            }


            //레이아웃이 고정 인경우 컬럼XL 값 RETURN.
            if(this.getFlexibleLayout() !== true){

                return _sColInfo;
            }


            //dom의 width 정보 발췌.
            var _width = _oDom.clientWidth;


            //Small 사이즈인경우.
            if(_width <= this.getBreakpointM()){

                //small 사이즈의 컬럼 count 값 구성.
                _sColInfo.colCount = Math.max(this.getColCountS(), 1);

                _sColInfo.currentBreakPoint = CS_BREAK_POINT.S;

                return _sColInfo;

            }else if(_width <= this.getBreakpointL()){                
                //Medium 사이즈인경우.

                //Medium 사이즈의 컬럼 count 값 구성.
                _sColInfo.colCount = Math.max(this.getColCountM(), 1);

                _sColInfo.currentBreakPoint = CS_BREAK_POINT.M;

                return _sColInfo;

            }else if(_width <= this.getBreakpointXL()){
                //Large 사이즈 인경우.

                //Large 사이즈의 컬럼 count 값 구성.
                _sColInfo.colCount = Math.max(this.getColCountL(), 1);

                _sColInfo.currentBreakPoint = CS_BREAK_POINT.L;

                return _sColInfo;

            }


            //XLarge 사이즈 인경우.
            // return this.getColCountXL();
            return _sColInfo;

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
        _calculateGridPositions : function(colInfo) {

            const _aContentMap = [];

            if(!colInfo.currentBreakPoint){
                return _aContentMap;
            }
            
            var _sPosInfo = {};

            //grid상에서 row, col에 해당하는 정보 map.
            _sPosInfo.gridMap = [];

            //그려질 컬럼 count.
            _sPosInfo.colCount = colInfo.colCount;

            var _aContent = this.getContent();

            if(_aContent.length === 0){
                return _aContentMap;
            }


            for (const ui of _aContent) {

				// // 1. colSpan 추출
				const _oLayoutData = ui.getLayoutData?.();

                //컬럼 병합 처리 펑션명 구성.(getColSpan + S)
                var _colFunc = `getColSpan${colInfo.currentBreakPoint}`;

                //ROW 병합 처리 펑션명 구성.(getRowSpan + S)
                var _rowlFunc = `getRowSpan${colInfo.currentBreakPoint}`;

                //layoutData의 컬럼 병합 값 얻기.
                _sPosInfo.colSpan = _oLayoutData?.[_colFunc]?.() || 1;

                _sPosInfo.colSpan = Math.max(_sPosInfo.colSpan, 1);

                //layoutData의 row 병합 값 얻기.
                _sPosInfo.rowSpan = _oLayoutData?.[_rowlFunc]?.() || 1;

                _sPosInfo.rowSpan = Math.max(_sPosInfo.rowSpan, 1);

                // const colSpan = Math.min(_colSpan, colInfo.colCount);
                _sPosInfo.colSpan = Math.min(_sPosInfo.colSpan, colInfo.colCount);
                
                
                let placed = false;

                //현재 UI가 column, row의 위치를 찾을떄까지 반복.
                for (let rowIndx = 0; !placed; rowIndx++) {

                    _sPosInfo.rowIndx = rowIndx;

                    // row가 존재하지 않으면 추가
                    this._ensureRowExists(_sPosInfo);

                    for (let colIndx = 0, colLen = colInfo.colCount - _sPosInfo.colSpan; colIndx <= colLen; colIndx++) {
                        

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
        * @function - layout의 content UI에 대해 colSpan, rowSpan 처리.
        *************************************************************/
        _setContentSpan : function(sColInfo, aContentMap){

            if(aContentMap.length === 0){
                return;
            }

            if(!sColInfo.currentBreakPoint){
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

                //컬럼 병합 처리 펑션명 구성.(getColSpan + S)
                var _colFunc = `getColSpan${sColInfo.currentBreakPoint}`;

                //ROW 병합 처리 펑션명 구성.(getRowSpan + S)
                var _rowlFunc = `getRowSpan${sColInfo.currentBreakPoint}`;

                //layoutData의 컬럼 병합 값 얻기.
                var _colSpan = _oLayout?.[_colFunc]?.() || 1;

                //layoutData의 row 병합 값 얻기.
                var _rowSpan = _oLayout?.[_rowlFunc]?.() || 1;

                _colSpan = `span ${_colSpan}`;

                //이전 column style과 다를 경우 값 매핑.
                //(같은 값을 다시 매핑처리 하지 않음)
                if(_oDom.style.gridColumn !== _colSpan){
                    _oDom.style.gridColumn = _colSpan;
                }


                _rowSpan = `span ${_rowSpan}`;

                //이전 row style과 다를 경우 값 매핑.
                //(같은 값을 다시 매핑처리 하지 않음)
                if(_oDom.style.gridRow !== _rowSpan){
                    _oDom.style.gridRow = _rowSpan;
                }                
                
            }

        }

    });

    return _oGridLayout;

});