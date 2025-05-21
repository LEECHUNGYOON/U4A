sap.ui.define("u4a.charts.am5.LineItem", [
    "u4a/charts/am5/XYSeries"
], function(XYSeries){
    "use strict";

    
    let _oLineItem = XYSeries.extend("u4a.charts.am5.LineItem", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                //값이 연속되지 않을경우, 꺾은선을 이어서 표현할지 여부.(am5xy.LineSeries)
                //차트 데이터가 아래와 같이 구성되어 있을경우.
                //GT_OTAB:[
                // {F01:"10", CAT:"2025"}, 
                // {F01:"20", CAT:"2026"},
                // {F01:"", CAT:"2027"},
                // {F01:"40", CAT:"2028"},
                // {F01:"50", CAT:"2029"}]
                //true : 2026과 2028 사이의 값이 존재하지 않지만 2025~2029의 선을 이어서 표현.
                //false: 2025와 2026끼리 선이 연결되며, 2028과 2029의 선을 연결.
                connect : { type : "boolean", defaultValue : true },


                //선을 단순화 해서 표현하는 수치값.(am5xy.LineSeries)
                //값이 커질수록 꺾은선을 단순화 해서 표현한다.
                minDistance : { type : "int", defaultValue : 0 }
            }

        }, /* end of metadata */

        init : function(){

            XYSeries.prototype.init.apply(this, arguments);

            this._chartName = "line";


            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "value",
                "openValue",
                "highValue",
                "lowValue"
            ];

            
            // //예외처리 대상 프로퍼티정보.
            this._aExcepProp = [
                "value",
                "openValue",
                "highValue",
                "lowValue"
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
            _sChartData.strokeTemplate = this._getChartProperies(this._aExcludeProp);


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
            
            let _sPoint = oEvent.point;
            
            let _oXYChart = oEvent?.target?.chart;

            let _oParent = this.__parent || undefined;

            if(typeof _oParent === "undefined"){
                return;
            }

            //차트의 data UI 정보 얻기.
            let _aData = _oParent.getXYChartContent();

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
         * @function - 차트 Instance의 strokes settings 값 반영 처리.
         *************************************************************/
        _setChartStrokesSetting : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //차트의 setting값 반영 처리.
            this._oChart.oChartInstance.strokes.template.set(name, value);


            //반영된 값을 즉시 적용 처리.
            // this._oChart.oChartInstance.markDirty();
            this._oChart.oChartInstance.markDirtySize();

        },



        /*************************************************************
         * @function - connect 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setConnect : function(propValue){

            this._setProperty("connect", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - minDistance 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinDistance : function(propValue){

            this._setProperty("minDistance", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

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

    return _oLineItem;
    
    
});