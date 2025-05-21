sap.ui.define("u4a.charts.am5.ChartContent", [
    "sap/ui/core/Element"
    
],function(Element){
    "use strict";
    
    let _oChartContent = Element.extend("u4a.charts.am5.ChartContent", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //위도값.
                //해당 속성은 위도(latitude), 경도(longitude)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                latitude : { type : "float" },


                //경도값.
                //해당 속성은 위도(latitudeField), 경도(longitudeField)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                longitude : { type : "float" }

            },
    
            aggregations : {

                //위도, 경도에 출력할 차트 aggregation.
                chart : { type : "u4a.charts.am5.SerialChart", multiple : false }

            }
    
        }, /* end of metadata */
    
        init : function(){


            this._chartName = "cat";
    
    
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
    
        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};


            _sChartData.geometry = {};

            _sChartData.geometry.type = "Point";
            _sChartData.geometry.coordinates = [];


            _sChartData.geometry.coordinates.push(this.getLongitude());
            _sChartData.geometry.coordinates.push(this.getLatitude());
    
            // //위도값
            // _sChartData.latitude = this.getLatitude();
            
            // //경도값.
            // _sChartData.longitude = this.getLongitude();

            return _sChartData;

        }, 
        
        
        /*************************************************************
         * @function - categoryValue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        categoryValue : function(propValue){

            this._setProperty("categoryValue", propValue);


            var _oCategory = this.getParent() || undefined;


            _oCategory._updateCategory();

            if(typeof _oCategory?._getChartData === "undefined"){
                return;
            }

        },

        
    });

    return _oChartContent;
    
});