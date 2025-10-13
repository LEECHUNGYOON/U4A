//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/LayoutData",
"sap/base/util/uid"
], function(LayoutData, Uid){
    "use strict";

    //cell의 테두리쪽 여백에 관련된 속성.
    u4a.m.LayoutCellDesign = {
        LrNoPad : "LrNoPad",        //좌우 여백 없음.
        LrPad : "LrPad",            //좌우 여백 있음.
        LPad : "LPad",              //왼쪽 여백 있음.
        Padless : "Padless",        //모든 여백 제거.
        RPad : "RPad"               //오른쪽 여백 있음.
    };

    sap.ui.base.DataType.registerEnum("u4a.m.LayoutCellDesign", u4a.m.LayoutCellDesign);

    //수평 정렬 enum.
    u4a.m.HAlign = {
        Center : "Center",
        End : "End",
        Initial : "Initial",
        Left : "Left",
        Right : "Right"
    };

    sap.ui.base.DataType.registerEnum("u4a.m.HAlign", u4a.m.HAlign);


    var _oRowLayoutData = LayoutData.extend("u4a.m.RowLayoutData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //cell의 테두리쪽 여백에 관련된 속성.
                rowDesign : { type : "u4a.m.LayoutCellDesign", defaultValue : "RPad" },

                //hAlign
                hAlign : { type : "u4a.m.HAlign", defaultValue : "Initial" }

            }

        }, /* end of metadata */



        
        /*************************************************************
        * @function - setParent function redifine
        *************************************************************/
        setParent : function(oParent){
            
            LayoutData.prototype.setParent.call(this, oParent);

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


            //부모 dom이 u4a.m.RowLayout으로 구성되지 않은 경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-row-layout") !== "true"){
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

            if(_oParent.isA("u4a.m.RowLayout") !== true){
                return;
            }

            //grid template column style 설정. 
            _oParent._setGridTemplateColumns();

                        
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
        * @function - rowDesign 변경 처리.
        *************************************************************/
        setRowDesign : function(sValue){

            this.setProperty("rowDesign", sValue, true);

            var _oDom = this.getDomRef();

            if(!_oDom){
                return;
            }


            //rowDesign에 따른 margin값 구성.
            var _margin = this._getRowDesignMargin();

            this._setStyle("margin", _margin);

        },




        /*************************************************************
        * @function - rowDesign에 따른 margin값 구성.
        *************************************************************/
        _getRowDesignMargin : function(){

            var _rowDesign = this.getRowDesign();

            var _margin = "0px 0px 0px 0px";

            switch (_rowDesign) {
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

    return _oRowLayoutData;

});