sap.ui.define("u4a.charts.am5.PieSeries", [
    "u4a/charts/am5/PercentSeries"
    
],function(PercentSeries){
    "use strict";
    
    let _oPieSeries = PercentSeries.extend("u4a.charts.am5.PieSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //Series 선택 처리 속성.
                //true로 설정시 pie 조각을 선택한 효과 상태가 된다.
                active : { type : "boolean", defaultValue: false },

                
                //테두리 round 처리 값.(am5.Slice)
                //값이 커질수록 모서리가 더욱 둥글게 변한다.
                cornerRadius : { type : "int", defaultValue: 0 },

            },

            aggregations : {

                //series에 해당하는 label의 속성 제어 aggregation.
                labelStyle : { type : "u4a.charts.am5.PieSeriesLabelStyle", multiple : false }
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

            PercentSeries.prototype.init.apply(this, arguments);


            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "value",
                "category",
            ];


            //예외처리 수집 대상 프로퍼티정보.
            this._aExcepProp = [
                "value",
                "category",
            ];

            
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            PercentSeries.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //pieSeries의 속성정보 얻기.
            _sChartData = this._getChartExcepProperties(this._aExcepProp);

            _sChartData._sId = this.getId();

            _sChartData.category = this.getCategoryText();


            //label 속성 처리 UI 얻기.
            let _oLabelStyle = this.getLabelStyle() || undefined;

            if(typeof _oLabelStyle !== "undefined"){
                //category의 label 세팅 정보 매핑.
                _sChartData.labelStyle = _oLabelStyle._getChartData();
            }


            //컬럼의 툴팁 정보 구성.
            _sChartData.tooltipText = this._getTooltipData();


            //pieSeries의 slice에 값을 반영할 속성정보 얻기.
            _sChartData.slicesTemplate = this._getChartProperies(this._aExcludeProp);

            return _sChartData;

        },


        /*************************************************************
         * @event - 컬럼 이벤트 fire 처리.
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
            _sParams.category = _sDataItem.dataContext?.category;

            
            _sParams.item = this;
            
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);
            
            
        },
        

        /*************************************************************
         * @function - active 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setActive : function(propValue){

            this._setProperty("active", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - cornerRadius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCornerRadius : function(propValue){

            this._setProperty("cornerRadius", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        }

    });

    return _oPieSeries;
    
});