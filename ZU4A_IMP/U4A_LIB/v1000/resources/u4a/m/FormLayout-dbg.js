//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Control",
"u4a/m/FormLayoutRenderer",
"sap/ui/core/ResizeHandler"

], function(Control, FormLayoutRenderer, ResizeHandler){
    "use strict";

    //break point 상수 정의.
    const CS_BREAK_POINT = {
        XL : "XL",
        L  : "L",
        M  : "M",
        S  : "S"
    };

    var _oFormLayout = Control.extend("u4a.m.FormLayout", {
        metadata : {
            library : "u4a.m",
            properties : {

                //layout을 반응형으로 설정 할지 여부 프로퍼티.
                flexibleLayout : {type : "boolean", defaultValue : true },

                //formTopData를 가로로 표현할 갯수.
                columnXL : { type : "int", defaultValue : 0 },

                //formTopData를 가로로 표현할 갯수.
                columnL : { type : "int", defaultValue : 0 },

                //formTopData를 가로로 표현할 갯수.
                columnM : { type : "int", defaultValue : 0 },
                                
                //반응형 처리시 XLarge 기준 width.
                breakpointXL : { type : "int", defaultValue : 1440 },

                //반응형 처리시 Large 기준 width.
                breakpointL : { type : "int", defaultValue : 1024 },

                //반응형 처리시 Medium 기준 width.
                breakpointM : { type : "int", defaultValue : 600 },

                //FormLayout의 가로 크기.
                width : { type : "sap.ui.core.CSSSize", defaultValue : "100%" },

                //FormLayout의 세로 크기.
                height : { type : "sap.ui.core.CSSSize" }


            },

            defaultAggregation : "formTopData",

            aggregations : {
                formTopData : { type : "u4a.m.FormTopData", multiple : true, singularName: "formTopData" }
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

        renderer : FormLayoutRenderer,



        /*************************************************************
        * @function - onAfterRendering
        *************************************************************/
        onAfterRendering: function () {

            //이전 resize Handler가 존재하는경우 등록 해제.
            if (this._resizeHandler) {
                ResizeHandler.deregister(this._resizeHandler);
                this._resizeHandler = null;
            }


            //반응형 레이아웃이 아닌경우.
            if(this.getFlexibleLayout() !== true){
                //Form template column style 설정. 
                this._setFormTemplateColumns();
                return;
            }


            //resize Handler 이벤트 등록.
            //(dom의 크기가 변경 했을때의 이벤트 등록 처리.)
            this._resizeHandler = ResizeHandler.register(this, this._setFormTemplateColumns.bind(this));


            //Form template column style 설정. 
            this._setFormTemplateColumns();


        },




        /*************************************************************
        * @function - Form template column style 설정. 
        *************************************************************/
        _setFormTemplateColumns : function(){

            var _oDom = this.getDomRef("content");

            if(!_oDom){
                return;
            }

            var _aFormTopData = this.getFormTopData();

            if(_aFormTopData.length === 0){
                return;
            }

            //현재 dom의 크기에 해당되는 breakPoint 정보 얻기.
            var _currentBreakPoint = this._getCurrentBreakPoint();

            //현재 breakPoint에 해당되는 column 정보 얻기.
            var _column = this._getColumn(_currentBreakPoint);

            //formTopData의 갯수만큼 grid-template-columns 설정.
            // _oDom.style.gridTemplateColumns = `repeat(${_column}, minmax(max-content, 1fr))`;
            _oDom.style.gridTemplateColumns = `repeat(${_column}, auto)`;

            //formTopData의 UI간의 간격 설정.
            _oDom.style.columnGap = "2rem";


            for (let i = 0, l = _aFormTopData.length; i < l; i++) {
                
                var _oFormTopData = _aFormTopData[i];

                //formTopData의 column, row 설정.
                _oFormTopData._setFormTemplateColumns(_currentBreakPoint);

                
            }

        },




        /*************************************************************
        * @function - 현재 dom의 크기에 해당되는 breakPoint 정보 얻기.
        *            (layout이 고정인경우 XL 값 return)
        *************************************************************/
        _getCurrentBreakPoint : function(){
            
            //layout Dom 정보 얻기.
            var _oDom = this.getDomRef() || undefined;

            //dom 정보가 존재하지 않는경우 default X Large 값을 column 정보로 처리.
            if(typeof _oDom === "undefined"){
                return CS_BREAK_POINT.XL;
            }


            //레이아웃이 고정 인경우 컬럼XL 값 RETURN.
            if(this.getFlexibleLayout() !== true){

                return CS_BREAK_POINT.XL;
            }


            //dom의 width 정보 발췌.
            var _width = _oDom.clientWidth;


            //Small 사이즈인경우.
            if(_width <= this.getBreakpointM()){

                return CS_BREAK_POINT.S;

            }else if(_width <= this.getBreakpointL()){                
                //Medium 사이즈인경우.

                return CS_BREAK_POINT.M;

            }else if(_width <= this.getBreakpointXL()){
                //Large 사이즈 인경우.
                return CS_BREAK_POINT.L;

            }


            //XLarge 사이즈 인경우.
            return CS_BREAK_POINT.XL;

        },




        /*************************************************************
        * @function - 현재 breakPoint에 해당되는 column 정보 얻기.
        *************************************************************/
        _getColumn : function(currentBreakPoint){

            //default formTopData의 갯수.
            var _column = this.getFormTopData().length;

            
            if(this.getFlexibleLayout() !== true){
                //layout이 고정인경우.
                //X Large일때의 컬럼 수 설정이 안되어 있다면 default formTopData의 갯수.
                return Math.max(this.getColumnXL(), 0) || _column;
            }


            switch (currentBreakPoint) {
                case CS_BREAK_POINT.XL:
                    //X Large일때의 컬럼 수 설정이 안되어 있다면 default formTopData의 갯수.
                    return Math.max(this.getColumnXL(), 0) || _column;

                case CS_BREAK_POINT.L:
                    //Large일때의 컬럼 수 설정이 안되어 있다면 default formTopData의 갯수.
                    return Math.max(this.getColumnL(), 0) || _column;

                case CS_BREAK_POINT.M:
                    //Medium일때의 컬럼 수 설정이 안되어 있다면 default formTopData의 갯수.
                    return Math.max(this.getColumnM(), 0) || _column;

                default:
                    //Small일때는 무조건 1컬럼으로 처리.
                    return 1;
            }

        }


    });

    return _oFormLayout;

});