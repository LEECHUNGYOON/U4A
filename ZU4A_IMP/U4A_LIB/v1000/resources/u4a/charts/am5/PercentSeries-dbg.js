sap.ui.define("u4a.charts.am5.PercentSeries", [
    "u4a/charts/am5/Series"
    
],function(Series){
    "use strict";
    
    let _oPercentSeries = Series.extend("u4a.charts.am5.PercentSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //라벨 출력 위치를 정렬하여 출력할지 여부.
                //true로 설정할 경우, pie chart를 기준으로 좌우를 기준으로
                //text를 수직 정렬 하여 출력한다.
                //false로 설정할 경우 차트의 pie 조각 위치에 text를 출력한다.
                alignLabels : { type : "boolean", defaultValue: true },

                //값을 표현하기 위한 필드명.
                //GT_OTAB:[{F01:123, F02:"2025"},...]
                //형식의 차트 데이터 출력 정보가 존재할경우 F01 필드의 값을
                //표현 하고자 하는 경우 valueField 속성에 F01을 입력한다.
                value : { type : "float" },


                //값을 표현하기 위한 필드명.
                //GT_OTAB:[{F01:123, F02:"2025", "F03":"#FF0000"},...]
                //형식의 차트 데이터 출력 정보가 존재할경우 F02 필드의 값을
                //X축에 표현 하고자 하는 경우 categoryField 속성에 F02을 입력한다.
                categoryText : { type : "string", defaultValue: "" }

            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Series.prototype.init.apply(this, arguments);
            
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Series.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */

        
        /*************************************************************
         * @function - alignLabels 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setAlignLabels : function(propValue){

            let _propValue = this._setProperty("alignLabels", propValue);


            //차트 Instance에 alignLabels settings 값 반영 처리.
            this._setChartSettings("alignLabels", _propValue);


        },


        /*************************************************************
         * @function - value 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setValue : function(propValue){

            this._setProperty("value", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },

        /*************************************************************
         * @function - categoryText 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCategoryText : function(propValue){

            this._setProperty("categoryText", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        }

        
    });

    return _oPercentSeries;
    
});