sap.ui.define("u4a.charts.am5.RadarBarItem", [
    "u4a/charts/am5/BaseColumnSeries"
], function(BaseColumnSeries){
    "use strict";
    
    let _oRadarBarItem = BaseColumnSeries.extend("u4a.charts.am5.RadarBarItem", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //테두리 round 처리 값.(am5.PointedRectangle)
                //값이 커질수록 모서리가 더욱 둥글게 변한다.
                cornerRadius : { type : "int", defaultValue : 0 }
            }

        }, /* end of metadata */

        init : function(){

            BaseColumnSeries.prototype.init.apply(this, arguments);


            this._chartName = "column";

            
            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "value",
            ];


            //예외처리 수집 대상 프로퍼티정보.
            this._aExcepProp = [
                "value",
            ];

        }, /* end of init */

        renderer : function(oRm, oControl){

        }, /* end of renderer */

        exit : function(){

            BaseColumnSeries.prototype.exit.apply(this, arguments);


        }, /* end of exit */



        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //컬럼의 속성정보 얻기.
            _sChartData = this._getChartValuesData();

            _sChartData._sId = this.getId();


            //컬럼의 툴팁 정보 구성.
            _sChartData.tooltipText = this._getTooltipData();


            _sChartData._bullets = this.getBullet();


            //columnSeries의 columns에 값을 반영할 속성정보 얻기.
            // _sChartData.columnTemplate = this._getChartExcepProperties(this._aExcepProp);
            _sChartData.columnTemplate = this._getChartProperies(this._aExcludeProp);

            _sChartData.columnTemplate.visible = this.getVisible();


            return _sChartData;

        },

        
        /*************************************************************
         * @event - 이벤트 fire 처리.
         *************************************************************/
        _fireEvent : function(oEvent){
            
            if(typeof oEvent?.target?.dataItem?.component === "undefined"){
                return;
            }
            
            if(typeof oEvent?.target?.dataItem?.dataContext === "undefined"){
                return;
            }
            
            if(typeof oEvent?.point === "undefined"){
                return;
            }

            let _eventType = oEvent.type;
            
            let _sDataItem = oEvent.target.dataItem;

            let _sPoint = oEvent.point;

            let _sParams = {};
            
            //y축 값.
            _sParams.value = _sDataItem?.dataContext?.value;

            //x축 값.
            _sParams.category = _sDataItem.dataContext.category;

            
            _sParams.item = this;
            
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
                        
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);

        },


        /*************************************************************
         * @function - 차트 Instance의 columns settings 값 반영 처리.
         *************************************************************/
        _setChartColumnsSetting : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //차트의 setting값 반영 처리.
            this._oChart.oChartInstance.columns.template.set(name, value);


            //반영된 값을 즉시 적용 처리.
            // this._oChart.oChartInstance.markDirty();
            this._oChart.oChartInstance.markDirtySize();

        },


        /*************************************************************
         * @function - cornerRadius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCornerRadius : function(propValue){

            this._setProperty("cornerRadius", propValue);


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

    return _oRadarBarItem;
    
    
});