//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/LayoutData",
"sap/base/util/uid"
], function(LayoutData, Uid){
    "use strict";

    //Matrix layout 유형.
    u4a.m.MatrixLayoutType = {
        MatrixData : "MatrixData",  //기존 matrixData 정보
        MatrixHeadData : "MatrixHeadData"   //matrix layout의 개행 처리용
    };  

    sap.ui.base.DataType.registerEnum("u4a.m.MatrixLayoutType", u4a.m.MatrixLayoutType);


    //수평 정렬 enum.
    u4a.m.HAlign = {
        Center : "Center",
        End : "End",
        Initial : "Initial",
        Left : "Left",
        Right : "Right"
    };

    sap.ui.base.DataType.registerEnum("u4a.m.HAlign", u4a.m.HAlign);


    //cell의 테두리쪽 여백에 관련된 속성.
    u4a.m.LayoutCellDesign = {
        LrNoPad : "LrNoPad",        //좌우 여백 없음.
        LrPad : "LrPad",            //좌우 여백 있음.
        LPad : "LPad",              //왼쪽 여백 있음.
        Padless : "Padless",        //모든 여백 제거.
        RPad : "RPad"               //오른쪽 여백 있음.
    };

    sap.ui.base.DataType.registerEnum("u4a.m.LayoutCellDesign", u4a.m.LayoutCellDesign);


    var _oMatrixLayoutData = LayoutData.extend("u4a.m.MatrixLayoutData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //Matrix layout 유형.
                layoutType : { type : "u4a.m.MatrixLayoutType", defaultValue : "MatrixData" },

                //cell의 테두리쪽 여백에 관련된 속성.
                cellDesign : { type : "u4a.m.LayoutCellDesign", defaultValue : "RPad" },

                //컬럼 병합처리.
                colSpan : { type : "int", defaultValue : 1 },

                //height
                height : { type : "sap.ui.core.CSSSize" },

                //hAlign
                hAlign : { type : "u4a.m.HAlign", defaultValue : "Initial" },

                //styleClassName
                styleClassName : { type : "string" },

                //vAlign
                vAlign : { type : "sap.m.FlexAlignItems", defaultValue: "Inherit" },

                //width
                width : { type : "sap.ui.core.CSSSize" }

            }

        }, /* end of metadata */


        /*************************************************************
        * @function - setParent function redifine
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
                //u4a.m.MatrixLayout의 u4a.m.LayoutData는 DOM을 생성함
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

            //matrixLayout을 통해 구성한 dom 이 아닌경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-matrix-layout-content") !== "true"){
                return;
            }

            //부모 dom의 id를 현재 UI의 id로 변경 처리.
            _oDom.parentElement.id = this.getId();


        },




        /*************************************************************
        * @function - layout type 설정.
        *************************************************************/
        setLayoutType : function(sValue){

            this.setProperty("layoutType", sValue, true);

            
            //layout type 설정에 따른 style 처리.
            this._setLayoutType(sValue);

        },



        
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
        * @function - layout type 설정에 따른 style 처리.
        *************************************************************/
        _setLayoutType: function(layoutType){
            
            var _oDom = this.getDomRef();

            if(!_oDom?.style){
                return;
            }


            //부모 dom이 u4a.m.MatrixLayout으로 구성되지 않은 경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-matrix-layout") !== "true"){
                return;
            }

            var _oParentDom = _oDom.parentElement?.parentElement;

            if(!_oParentDom?.id){
                return;
            }
            
            //부모 dom에 해당하는 UI 정보 얻기.
            var _oParent = sap.ui.getCore().byId(_oParentDom.id);

            if(!_oParent?.isA){
                return;
            }

            if(_oParent.isA("u4a.m.MatrixLayout") !== true){
                return;
            }

            //grid template column style 설정. 
            _oParent._setGridTemplateColumns();

                        
        },



        
        /*************************************************************
        * @function - 컬럼 병합처리.
        *************************************************************/
        setColSpan : function(sValue){

            this.setProperty("colSpan", sValue, true);

            //col span 값 얻기(default 1)
            var _col = Math.max(sValue, 1) || 1;
            
            //dom style의 컬럼 병합 처리.
            this._setStyle("gridColumn", `span ${_col}`);

        },


        

        /*************************************************************
        * @function - width 변경 처리.
        *************************************************************/
        setWidth : function(sValue){

            this.setProperty("width", sValue, true);

            //dom의 width 변경 처리.
            this._setStyle("width", sValue);

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




        /*************************************************************
        * @function - cellDesign 변경 처리.
        *************************************************************/
        setCellDesign : function(sValue){

            this.setProperty("cellDesign", sValue, true);

            var _oDom = this.getDomRef();

            if(!_oDom){
                return;
            }

            var _margin = this._getCellDesignMargin();

            this._setStyle("margin", _margin);

        },




        /*************************************************************
        * @function - cellDesign에 따른 margin값 구성.
        *************************************************************/
        _getCellDesignMargin : function(){

            var _cellDesign = this.getCellDesign();

            var _margin = "0px 0px 0px 0px";

            switch (_cellDesign) {
                case u4a.m.LayoutCellDesign.RPad:
                    _margin = "2px 4px 2px 0px";                    
                    break;

                case u4a.m.LayoutCellDesign.LrNoPad:
                    _margin = "2px 0px 2px 0px";
                    break;

                case u4a.m.LayoutCellDesign.LPad:
                    _margin = "2px 0px 2px 4px";                    
                    break;

                case u4a.m.LayoutCellDesign.LrPad:
                    _margin = "2px 4px 2px 4px";  
                    
                    break;
            
                default:
                    break;
            }

            return _margin;


        }


    });

    return _oMatrixLayoutData;

});