//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/LayoutData",
"sap/base/util/uid"
], function(LayoutData, Uid){
    "use strict";


    var _oFormLayoutData = LayoutData.extend("u4a.m.FormLayoutData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //form layout의 ui 배치시 ui가 차지할 영역 수.
                //(colCount가 10으로 설정, colSpan이 5로 설정된 경우 해당 UI는 10등분한 영역의 절반을 차지함)
                colSpanXL : { type : "int", defaultValue : 0 },

                //form layout의 ui 배치시 ui가 차지할 영역 수.
                //(colCount가 10으로 설정, colSpan이 5로 설정된 경우 해당 UI는 10등분한 영역의 절반을 차지함)
                colSpanL : { type : "int", defaultValue : 0 },

                //form layout의 ui 배치시 ui가 차지할 영역 수.
                //(colCount가 10으로 설정, colSpan이 5로 설정된 경우 해당 UI는 10등분한 영역의 절반을 차지함)
                colSpanM : { type : "int", defaultValue : 0},

                //form layout의 ui 배치시 ui가 차지할 영역 수.
                //(colCount가 10으로 설정, colSpan이 5로 설정된 경우 해당 UI는 10등분한 영역의 절반을 차지함)
                colSpanS : { type : "int", defaultValue : 0 },

                //hAlign 
                hAlign : { type : "sap.m.FlexAlignItems", defaultValue : "Initial" },

                //vAlign
                vAlign : { type : "sap.m.FlexAlignItems", defaultValue: "Inherit" }


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

            //formLayout을 통해 구성한 dom 이 아닌경우 exit.
            if(_oDom.parentElement.getAttribute("u4a-form-layout-content") !== "true"){
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

            if(!_oDom?.style){
                return;
            }


            _oDom.style[styleName] = styleValue;

        },



        /*************************************************************
        * @function - u4a.m.FormLayout의 컬럼 재계산 처리.
        *************************************************************/
        _setGridLayoutTemplateColumns : function(){

            var _oDom = this.getDomRef();

            //현재 layoutData의 dom이 존재하지 않는경우 exit.
            if(!_oDom?.style){
                return;
            }

            //dom에서 u4a.m.FormLayout 의 sid 정보 발췌.
            var _formId = _oDom.getAttribute("data-u4a-form-id");

            if(!_formId){
                return;
            }

            //발췌한 sid 정보를 기준으로 form UI 얻기.
            var _oForm = sap.ui.getCore().byId(_formId);

            if(!_oForm?._setFormTemplateColumns){
                return;
            }

            //Form template column style 설정. 
            _oForm._setFormTemplateColumns();


        },


        

        /*************************************************************
        * @function - X Large일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanXL : function(sValue){

            this.setProperty("colSpanXL", sValue, true);

            //u4a.m.FormLayout의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Large일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanL : function(sValue){

            this.setProperty("colSpanL", sValue, true);

            //u4a.m.FormLayout의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Medium일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanM : function(sValue){

            this.setProperty("colSpanM", sValue, true);

            //u4a.m.FormLayout의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },




        /*************************************************************
        * @function - Small일때의 컬럼 span 구성.
        *************************************************************/
        setColSpanS : function(sValue){

            this.setProperty("colSpanS", sValue, true);

            //u4a.m.FormLayout의 컬럼 재계산 처리.
            this._setGridLayoutTemplateColumns();

        },



        
        /*************************************************************
        * @function - hAlign 변경 처리.
        *************************************************************/
        setHAlign : function(sValue){
            
            this.setProperty("hAlign", sValue, true);

            //dom의 height 변경 처리.
            // this._setStyle("justifyContent", sValue);
            this._setStyle("alignItems", sValue);

        },




        /*************************************************************
        * @function - vAlign 변경 처리.
        *************************************************************/
        setVAlign : function(sValue){
            
            this.setProperty("vAlign", sValue, true);

            //dom의 수직 정렬 처리.
            // this._setStyle("alignItems", sValue);
            this._setStyle("justifyContent", sValue);

        }


    });

    return _oFormLayoutData;

});