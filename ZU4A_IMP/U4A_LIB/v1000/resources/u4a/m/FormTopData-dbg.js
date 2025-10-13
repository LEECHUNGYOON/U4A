//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Element"
], function(Element){
    "use strict";


    //break point 상수 정의.
    const CS_BREAK_POINT = {
        XL : "XL",
        L  : "L",
        M  : "M",
        S  : "S"
    };
    

    var _oFormTopData = Element.extend("u4a.m.FormTopData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //form layout의 ui 배치를 위한 컬럼 수.
                //(FormTopData의 영역을 colCount 수 만큼 분할하여 UI를 배치함
                //colCount를 10으로 설정하는 경우 10등분하여 UI를 배치함.)                                
                //Form 영역의 크기가 XLarge 크기 일때 Form에서 표현할 컬럼수 .
                colCountXL : { type : "int", defaultValue : 8 },

                //Form 영역의 크기가 Large 크기 일때 Form에서 표현할 컬럼수.
                colCountL : { type : "int", defaultValue : 8 },

                //Form 영역의 크기가 Medium 크기 일때 Form에서 표현할 컬럼수.
                colCountM : { type : "int", defaultValue : 8 },
                
                //Form 영역의 크기가 Small 크기 일때 Form에서 표현할 컬럼수.
                colCountS : { type : "int", defaultValue : 1 },

                //formTopData의 활성 여부.
                visible : { type : "boolean", defaultValue : true }


            },

            defaultAggregation : "formHeadData",

            aggregations : {
                formHeadData : { type : "u4a.m.FormHeadData", multiple : true, singularName: "formHeadData" }
            }

        }, /* end of metadata */


        

        /*************************************************************
        * @function - style 적용.
        *************************************************************/
        _setStyle : function(styleName, styleValue){
            
            var _oDom = this.getDomRef();

            if(!_oDom?.style){
                return;
            }


            _oDom.style[styleName] = styleValue;

        },




        /*************************************************************
        * @function - form의 dom 크기에 따른 컬럼 수 계산.
        *************************************************************/
        _getColCount : function(currentBreakPoint){

            switch(currentBreakPoint){
                case CS_BREAK_POINT.S :
                    //Small 사이즈인경우.
                    return Math.max(this.getColCountS(), 1);

                case CS_BREAK_POINT.M :
                    //Medium 사이즈인경우.
                    return Math.max(this.getColCountM(), 1);

                case CS_BREAK_POINT.L :
                    //Large 사이즈 인경우.
                    return Math.max(this.getColCountL(), 1);

                case CS_BREAK_POINT.XL :
                default :
                    //X Large 사이즈인경우.
                    return Math.max(this.getColCountXL(), 1);

            }

        },




        /*************************************************************
        * @function - formTopData의 layout template columns 설정.
        *************************************************************/
        _setFormTemplateColumns : function(currentBreakPoint){

            //현재 formTopData가 비활성 처리된 경우 exit.
            if(this.getVisible() !== true){
                return;
            }

            var _oDom = this.getDomRef();

            if(!_oDom){
                return;
            }

            //BreakPoint(DOM 크기)에 해당하는 컬럼 수 얻기.
            var _colCount = this._getColCount(currentBreakPoint);

            var _aFormHeadData = this.getFormHeadData();

            if(_aFormHeadData.length === 0){
                return;
            }


            var _sColInfo = {};

            //rowCount default setting.
            _sColInfo.rowCount = 0;

            //colCount setting.
            _sColInfo.colCount = _colCount;

            //currentBreakPoint setting.
            _sColInfo.currentBreakPoint = currentBreakPoint;

            for (let i = 0, l = _aFormHeadData.length; i < l; i++) {
                
                var _oFormHeadData = _aFormHeadData[i];

                //formHeadData의 순번에 따른 rowCount 증가.
                _sColInfo.rowCount++;

                //formHeadData의 template columns 설정.
                _oFormHeadData._setTemplateColumns(_sColInfo);
                                
            }
            

            //grid template row 설정.
            //(template columns 수행 이후 row를 계산 해야함)
            var _gridTemplateRow = this._calcGridTemplateRow(currentBreakPoint);

            if(!_gridTemplateRow){
                return;
            }

            _oDom.style.gridTemplateRows = _gridTemplateRow;
            

        },




        /*************************************************************
        * @function - grid template row 설정.
        *************************************************************/
        _calcGridTemplateRow : function(currentBreakPoint){

            var _aFormHeadData = this.getFormHeadData();

            if(_aFormHeadData.length === 0){
                return;
            }

            var _aRowTemplate = [];

            //break point에 해당하는 row span 펑션 구성.
            var _getterName = "getRowSpan" + currentBreakPoint; 
            
            for (let i = 0; i < _aFormHeadData.length; i++) {

                var _oFormHeadData = _aFormHeadData[i];

                //화면에 구성되지 않은 head인경우 skip.
                if(_oFormHeadData.getVisible?.() !== true){
                    continue;
                }

                var _oChild = _oFormHeadData.getDomRef();

                if(!_oChild){
                    continue;
                }

                //실제 구성된 dom의 크기 정보 얻기.
                var _oRect = _oChild.getBoundingClientRect();

                if(!_oRect?.height){
                    continue;
                }
                
                //row span 값 얻기.
                //(없으면 default 1번 수행)
                var _cnt = _oFormHeadData[_getterName]?.() || 1;

                var _height = _oRect.height;

                //구성된 dom의 height 수집.
                for (let j = 0; j < _cnt; j++) {
                    
                    _aRowTemplate.push(_height + "px");
                    
                }
     
            }

            return _aRowTemplate.join(" ");


        }


    });

    return _oFormTopData;

});