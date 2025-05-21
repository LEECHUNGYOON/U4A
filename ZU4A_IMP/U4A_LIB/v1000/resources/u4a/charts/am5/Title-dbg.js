sap.ui.define("u4a.charts.am5.Title", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";

    
    let _oTitle = Graphics.extend("u4a.charts.am5.Title", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //label의 기준선 위치를 조정하는 속성값.
                //값이 커질수록 기준선보다 위로 이동한다.
                //값이 작아질수록 기준선보다 아래로 이동한다.
                //(columnSeries의 막대 그래프 위에 label을 추가하여
                //막대 그래프의 끝에 label이 표시되는 상황일 경우 
                //baselineRatio 값을 1로 변경시 막대 그래프의 끝 지점에서
                //label이 상단으로 이동하여 표현된다.)
                baselineRatio : { type : "float", defaultValue: 0.19 },


                //글꼴.
                fontFamily : { type : "string", defaultValue: "" },


                //폰트 크기.
                fontSize : { type : "int", defaultValue: 16 },


                //폰트 굵기.
                fontWeight : { type : "string", defaultValue: "" },

                
                //max font 길이.
                //출력할 LABEL TEXT가 "ABCDEFGHIJ" 일경우 maxChars가 5라면
                //"ABCDE..." 으로 출력된다.
                maxChars : { type : "int", defaultValue: 0 },


                //maxChars 값에 의해 "ABCDE..." 으로 출력될 경우 마지막 줄임 text값.
                //ellipsis값을 123으로 설정할 경우 "ABCDE123" 으로 출력된다.
                ellipsis : { type : "string", defaultValue: "..." },


                //출력 text.
                text : { type : "string", defaultValue: "" }

            },
    
    
        }, /* end of metadata */
    
        init : function(){

            Graphics.prototype.init.apply(this, arguments);
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Graphics.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - am5 차트의 title Instance 생성.
         *************************************************************/
        _createTitle : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();


            _sChartProp.visible = this.getVisible();


            this._oChart.oChartInstance = am5.Label.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;


        },


        /*************************************************************
         * @function - baselineRatio 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setBaselineRatio : function(propValue){

            let _propValue = this._setProperty("baselineRatio", propValue);


            //차트 Instance에 baselineRatio settings 값 반영 처리.
            this._setChartSettings("baselineRatio", _propValue);

        },


        /*************************************************************
         * @function - fontFamily 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontFamily : function(propValue){

            let _propValue = this._setProperty("fontFamily", propValue);


            //차트 Instance에 fontFamily settings 값 반영 처리.
            this._setChartSettings("fontFamily", _propValue);

        },


        /*************************************************************
         * @function - fontSize 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontSize : function(propValue){

            let _propValue = this._setProperty("fontSize", propValue);


            //차트 Instance에 fontSize settings 값 반영 처리.
            this._setChartSettings("fontSize", _propValue);

        },


        /*************************************************************
         * @function - fontWeight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontWeight : function(propValue){

            let _propValue = this._setProperty("fontWeight", propValue);


            //차트 Instance에 fontWeight settings 값 반영 처리.
            this._setChartSettings("fontWeight", _propValue);

        },


        /*************************************************************
         * @function - maxChars 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxChars : function(propValue){

            let _propValue = this._setProperty("maxChars", propValue);


            //차트 Instance에 maxChars settings 값 반영 처리.
            this._setChartSettings("maxChars", _propValue);

        },


        /*************************************************************
         * @function - ellipsis 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setEllipsis : function(propValue){

            let _propValue = this._setProperty("ellipsis", propValue);


            //차트 Instance에 ellipsis settings 값 반영 처리.
            this._setChartSettings("ellipsis", _propValue);

        },


        /*************************************************************
         * @function - text 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setText : function(propValue){

            let _propValue = this._setProperty("text", propValue);


            //차트 Instance에 text settings 값 반영 처리.
            this._setChartSettings("text", _propValue);

        },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){
            
            let _propValue = this._setProperty("fill", propValue);

            //stroke에 적용된 값이 존재하지 않는경우 default theme에 적용한
            //stroke 색상 코드를 매핑.
            //am5.color(""); 처리시 오류가 발생함.
            //am5.color(""); 에서 발생한 오류를 try catch 처리 하여 catch에서 return 처리시 
            //이전 색상이 남아있기에 공백의 색상 정보가 입력된 경우 default 색상 정보를 매핑.
            //(잘못된 색상 코드에 대한 처리를 하지 않음.)
            if(typeof _propValue === "undefined"){
                _propValue = sap.ui.core.theming.Parameters.get("sapTextColor");
            }


            //차트 Instance에 fill settings 값 반영 처리.
            this._setChartSettings("fill", _propValue);

        }
        
    });

    return _oTitle;
    
});