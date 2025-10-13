//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/LayoutData",
"sap/base/util/uid"
], function(LayoutData, Uid){
    "use strict";

    //수평 정렬 enum.
    u4a.m.HAlign = {
        Center : "Center",
        End : "End",
        Initial : "Initial",
        Left : "Left",
        Right : "Right"
    };


    sap.ui.base.DataType.registerEnum("u4a.m.HAlign", u4a.m.HAlign);
    

    var _oGridLayoutData = LayoutData.extend("u4a.m.GridLayoutData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //grid 영역의 크기가 Small 크기 일때의 컬럼 병합값.
                colSpanS : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Medium 크기 일때의 컬럼 병합값.
                colSpanM : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Large 크기 일때의 컬럼 병합값.
                colSpanL : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 XLarge 크기 일때의 컬럼 병합값.
                colSpanXL : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Small 크기 일때의 row 병합값.
                rowSpanS : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Medium 크기 일때의 row 병합값.
                rowSpanM : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 Large 크기 일때의 row 병합값.
                rowSpanL : { type : "int", defaultValue : 1 },

                //grid 영역의 크기가 XLarge 크기 일때의 row 병합값.
                rowSpanXL : { type : "int", defaultValue : 1 },

                //height
                height : { type : "sap.ui.core.CSSSize" },

                //hAlign
                hAlign : { type : "u4a.m.HAlign", defaultValue : "Initial" },

                //paddingBottom
                paddingBottom : { type : "sap.ui.core.CSSSize" },

                //paddingLeft
                paddingLeft : { type : "sap.ui.core.CSSSize" },

                //paddingRight
                paddingRight : { type : "sap.ui.core.CSSSize" },

                //paddingTop
                paddingTop : { type : "sap.ui.core.CSSSize" },

                //styleClassName
                styleClassName : { type : "string" },

                //vAlign
                vAlign : { type : "sap.m.FlexAlignItems", defaultValue: "Inherit" },

                //width
                width : { type : "sap.ui.core.CSSSize" }

            }

        }, /* end of metadata */

        
        

        /*************************************************************
        * @function - 부모 변경 처리.
        *************************************************************/
        setParent : function(oParent){

            LayoutData.prototype.setParent.call(this, oParent);

            if(!oParent){

                //현재 layoutData의 Dom정보를 얻음.
                var _oDom = this.getDomRef();

                //dom이 존재하지 않는경우 exit.
                if(!_oDom){
                    return;
                }

                //현재 layoutData의 dom ID를 변경 처리.
                //(layoutData는 DOM을 구성하지 않지만 예외적으로
                //u4a.m.GridLayout의 u4a.m.LayoutData는 DOM을 생성함
                //(sap.m.FlexItemData와 같은 개념으로 생성 처리함)
                //따라서 부모가 변경되는 상황에서 부모가 존재하지 않는경우(부모로 부터 떨어지기만 하는 상황)
                //일때는 현재 LayoutData의 dom id를 변경하여 this.getDomRef()를 통해
                //dom 객체를 얻지 못하게 처리 하기 위함)
                
                //이전 dom의 id 변경 처리.
                _oDom.id = Uid();

                return;
            }


            //부모의 dom 정보 얻기.
            var _oDom = oParent.getDomRef();
            

            if(!_oDom?.parentElement?.getAttribute){
                return;
            }

            //gridLayout을 통해 구성한 dom 이 아닌경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-grid-layout-content") !== "true"){
                return;
            }

            //부모 dom의 id를 현재 UI의 id로 변경 처리.
            _oDom.parentElement.id = this.getId();


        },




        /*************************************************************
        * @function - style 적용.
        *************************************************************/
        _setStyle : function(styleName, styleValue){
            
            var _oDom = this.getDomRef();

            if(!_oDom){
                return;
            }


            _oDom.style[styleName] = styleValue;

        },




        /*************************************************************
        * @function - u4a.m.GridLayoyt의 컬럼 재계산 처리.
        *************************************************************/
        _setGridLayoutTemplateColumns : function(){
            
            var _oDom = this.getDomRef();

            if(!_oDom?.parentElement?.getAttribute){
                return;
            }

            //부모 dom이 u4a.m.GridLayout으로 구성되지 않은 경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-grid-layout") !== "true"){
                return;
            }

            var _oParentDom = _oDom.parentElement?.parentElement;

            if(!_oParentDom?.id){
                return;
            }


            var _oParent = sap.ui.getCore().byId(_oParentDom.id);

            if(!_oParent?.isA){
                return;
            }

            if(_oParent.isA("u4a.m.GridLayout") !== true){
                return;
            }

            //grid template column style 설정. 
            _oParent._setGridTemplateColumns();

        },




        /*************************************************************
        * @function - X Large일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanXL : function(sValue){

            this.setProperty("colSpanXL", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Large일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanL : function(sValue){

            this.setProperty("colSpanL", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Medium일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanM : function(sValue){

            this.setProperty("colSpanM", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Small일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanS : function(sValue){

            this.setProperty("colSpanS", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - X Large일때의 row span 구성.
        *************************************************************/
        setRowSpanXL : function(sValue){

            this.setProperty("rowSpanXL", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Large일때의 row span 구성.
        *************************************************************/
        setRowSpanL : function(sValue){

            this.setProperty("rowSpanL", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },



        /*************************************************************
        * @function - Medium일때의 row span 구성.
        *************************************************************/
        setRowSpanM : function(sValue){

            this.setProperty("rowSpanM", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Small일때의 row span 구성.
        *************************************************************/
        setRowSpanS : function(sValue){

            this.setProperty("rowSpanS", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },



        
        /*************************************************************
        * @function - width 변경 처리.
        *************************************************************/
        setWidth : function(sValue){

            this.setProperty("width", sValue, true);

            //u4a.m.GridLayoyt의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();            

        },



        
        /*************************************************************
        * @function - height 변경 처리.
        *************************************************************/
        setHeight : function(sValue){

            this.setProperty("height", sValue, true);

            //dom의 height 변경 처리.
            this._setStyle("height", sValue);

        },


        
        
        /*************************************************************
        * @function - hAlign 변경 처리.
        *************************************************************/
        setHAlign : function(sValue){
            
            this.setProperty("hAlign", sValue, true);

            //dom의 height 변경 처리.
            this._setStyle("justifyContent", sValue);

        },



                
        /*************************************************************
        * @function - paddingBottom 변경 처리.
        *************************************************************/
        setPaddingBottom : function(sValue){

            this.setProperty("paddingBottom", sValue, true);

            //dom의 paddingBottom 변경 처리.
            this._setStyle("paddingBottom", sValue);

        },



        
        /*************************************************************
        * @function - paddingLeft 변경 처리.
        *************************************************************/
        setPaddingLeft : function(sValue){

            this.setProperty("paddingLeft", sValue, true);

            //dom의 paddingLeft 변경 처리.
            this._setStyle("paddingLeft", sValue);

        },



        
        /*************************************************************
        * @function - paddingRight 변경 처리.
        *************************************************************/
        setPaddingRight : function(sValue){

            this.setProperty("paddingRight", sValue, true);

            //dom의 paddingRight 변경 처리.
            this._setStyle("paddingRight", sValue);

        },


        

        /*************************************************************
        * @function - paddingTop 변경 처리.
        *************************************************************/
        setPaddingTop : function(sValue){

            this.setProperty("paddingTop", sValue, true);

            //dom의 paddingTop 변경 처리.
            this._setStyle("paddingTop", sValue);

        },



        
        /*************************************************************
        * @function - styleClassName 변경 처리.
        *************************************************************/
        setStyleClassName : function(sValue){

            var _styleClass = this.getProperty("styleClassName");

            var _oDom = this.getDomRef();

            if(_oDom && _styleClass){
                _oDom.classList.remove(_styleClass);
            }

            this.setProperty("styleClassName", sValue, true);

            if(_oDom){
                _oDom.classList.add(sValue);
            }

        },



        
        /*************************************************************
        * @function - vAlign 변경 처리.
        *************************************************************/
        setVAlign : function(sValue){

            this.setProperty("vAlign", sValue, true);

            if(!sValue){
                sValue = "Inherit";
            }

            //dom의 vAlign 변경 처리.
            this._setStyle("alignItems", sValue);

        },

    });

    return _oGridLayoutData;

});