sap.ui.define("u4a.charts.am5.BaseColumnSeries", [
    "u4a/charts/am5/XYSeries"
    
],function(XYSeries){
    "use strict";
    
    let _oBaseColumnSeries = XYSeries.extend("u4a.charts.am5.BaseColumnSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //차트 요소에서 표시점 위치를 고정 처리 할지에 대한 설정값.
                //true : 고정 처리 하지 않음. 막대 차트의 중앙에 표시점이 존재할 경우
                //       확대나 축소를 통해 막대의 길이가 변경 되더라도 현재 보여지는 막대의
                //       가운데 위치에 표시점을 위치시킴.
                //false : 고정 처리함. 확대, 축소시에도 표시점 위치가 변경되지 않음.
                adjustBulletPosition : { type : "boolean", defaultValue : true },


                //차트 요소를 서로 겹쳐서 그려질지 여부.
                //BAR1, BAR2 존재시 clustered 값이 true 인경우 BAR1의 막대가 그려지고
                //오른쪽에 BAR2의 막대가 그려지게 된다(서로 겹쳐지지 않고 각각의 영역을 유지하면서)
                //clustered를 false로 설정한 BAR의 경우 영역을 차지 하지 않고 그려지게된다.
                //BAR1, BAR2, BAR3, BAR4가 존재하는경우 BAR1에 clustered를 false로 설정시
                //BAR1은 영역을 차지 하지 않고 그려진뒤, 나머지 BAR2, BAR3, BAR4이 
                //각각 3개의 영역을 차지하면서 그려지게된다.
                //BAR1, BAR3에 clustered를 false로 설정시 BAR1, BAR3의 막대는 영역을 차지 하지 않고
                //서로 겹쳐져 그려지며, BAR2, BAR4는 왼쪽부터 오른쪽으로 영역을 차지 하면서 그려지게된다.
                clustered : { type : "boolean", defaultValue : true }

            },

            events : {
                
                //차트 요소 클릭 이벤트.
                click : {},

                //차트 요소 더블클릭 이벤트.
                dblclick : {},

                //차트 요소 마우스 우클릭 이벤트.
                rightclick : {}
            }
    
    
        }, /* end of metadata */
    
        init : function(){
            
            XYSeries.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){

            XYSeries.prototype.exit.apply(this, arguments);
    
    
        }, /* end of exit */


        /*************************************************************
         * @function - adjustBulletPosition 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setAdjustBulletPosition : function(propValue){
            
            let _propValue = this._setProperty("adjustBulletPosition", propValue);


            //차트 Instance에 adjustBulletPosition settings 값 반영 처리.
            this._setChartSettings("adjustBulletPosition", _propValue);
            
        },

        
        /*************************************************************
         * @function - clustered 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setClustered : function(propValue){
            
            let _propValue = this._setProperty("clustered", propValue);


            //차트 Instance에 clustered settings 값 반영 처리.
            this._setChartSettings("clustered", _propValue);
            
        }

        
    });

    return _oBaseColumnSeries;
    
});