sap.ui.define("u4a.charts.am5.RadarLineItem", [
    "u4a/charts/am5/XYSeries"
], function(XYSeries){
    "use strict";
    
    let _oRadarLineItem = XYSeries.extend("u4a.charts.am5.RadarLineItem", {
        metadata : {
            library : "u4a.charts.am5"
        }, /* end of metadata */

        init : function(){

            XYSeries.prototype.init.apply(this, arguments);

            this._chartName = "line";

            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "fill",
                "strokeWidth",
                "strokeDasharray"
            ];

            
            //예외처리 대상 프로퍼티정보.
            this._aExcepProp = [
                "fill",
                "stroke",
                "strokeWidth",
                "strokeDasharray"
            ];

        }, /* end of init */

        renderer : function(oRm, oControl){

        }, /* end of renderer */

        exit : function(){

            XYSeries.prototype.exit.apply(this, arguments);


        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //라인의 속성정보 얻기.
            _sChartData = this._getChartValuesData();

            _sChartData._sId = this.getId();


            //라인의 툴팁 정보 구성.
            _sChartData.tooltipText = this._getTooltipData();


            _sChartData._bullets = this.getBullet();
            

            //lineSeries의 strokes에 값을 반영할 속성정보 얻기.
            // _sChartData.strokeTemplate = this._getChartExcepProperties(this._aExcepProp);
            _sChartData.strokeTemplate = this._getChartProperies([]);


            _sChartData.strokeTemplate.visible = this.getVisible();


            return _sChartData;

        },
        
        
        /*************************************************************
         * @event - 컬럼 이벤트 fire 처리.
         *************************************************************/
        _fireEvent : function(oEvent){

            if(typeof oEvent?.target?.chart === "undefined"){
                return;
            }
            
            if(typeof oEvent?.point === "undefined"){
                return;
            }

            let _eventType = oEvent.type;
            
            let _sPoint = oEvent.point;
            
            let _oXYChart = oEvent?.target?.chart;

            let _oParent = this.__parent || undefined;

            if(typeof _oParent === "undefined"){
                return;
            }

            //차트의 data UI 정보 얻기.
            let _aData = _oParent.getRadarChartContent();

            //data UI가 존재하지 않는경우 exit.
            if(_aData.length === 0){
                return;
            }

            let _oValueAxis = this.getParent() || undefined;

            if(typeof _oValueAxis === "undefined"){
                return;
            }

            //카테고리 ui의 key에 해당하는건 찾기.
            let _oCategoryAxis = _oValueAxis.getParent();

            if(typeof _oCategoryAxis?._oChart?.oChartInstance === "undefined"){
                return;
            }

            // 클릭한 x 좌표를 값으로 변환
            let xPos = _oCategoryAxis._oChart.oChartInstance.coordinateToPosition(
                _sPoint.x - _oXYChart.plotContainer.x()
            );

            //꺾은선 차트 Instance.
            let _oLineSeries = this._oChart.oChartInstance;
            
            // 가장 가까운 데이터 아이템 찾기
            let closestItem = _oLineSeries.dataItems.reduce((closest, item, index) => {
                const itemPosition = index / (_oLineSeries.dataItems.length - 1);
                const distance = Math.abs(itemPosition - xPos);

                if (!closest || distance < closest.distance) {
                    return {item, distance};
                }
                return closest;
            }, null);

            if(typeof closestItem === "undefined"){
                return;
            }

            let _sDataItem = closestItem.item;

            //이벤트가 발생한 차트 요소의 데이터에 해당되는 index 정보 얻기.
            let _indx = this._oChart.oChartInstance.dataItems.findIndex( item => item === _sDataItem );

            if(_indx === -1){
                return;
            }

            //index에 해당하는 data UI 정보 얻기.
            let _oData = _aData[_indx];
            
            let _sParams = {};
            
            _sParams.value = undefined;

            _sParams.category = undefined;

            _sParams.valueField = this.getValueField();

            _sParams.categoryField = _oCategoryAxis.getCategoryField();


            _sParams.item = _oData; 
            
            
            //클릭 x, y 좌표.
            _sParams.point = _sPoint;
            
            
            //y축 값.
            _sParams.value = closestItem.item.dataContext[_sParams.valueField] || undefined;
            
            //x축 값.
            _sParams.category = closestItem.item.dataContext[_sParams.categoryField] || undefined;
            
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);
            
            
        },


        /*************************************************************
         * @function - visible 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setVisible : function(propValue){

            this._setProperty("visible", propValue);

            //차트 데이터 갱신 처리.
            this._updateChartData();

        }


    });

    return _oRadarLineItem;
    
    
});