sap.ui.define("u4a.charts.am5.BarSetting", [
    "sap/ui/core/Element",
    "u4a/charts/am5/Settings"
    
],function(Element, Settings){
    "use strict";


    //차트 요소를 y축에 표현하는 방법.
    //y축 axis의 calculateTotals값이 true일때 동작함.
    //일반적으로 컬럼, 라인은 바인딩 필드에 해당하는 값으로 표현 처리함.
    //GT_OTAB:[{F01:100, CAT:"2025"},...]의 바인딩 데이터 처리시 
    //valueYField이 F01으로 설정했다면 첫번째 막대는 100만큼으로 표현 처리한다.
    //하지만 valueYShow의 값을 설정하여 화면에 표현하는 방식을 설정할 수 있다.
    //예를들어 컬럼1, 컬럼2, 컬럼3이 누적 막대로 존재하며 
    //각각 10, 30, 50의 값으로 컬럼을 표현 하려한다.
    //valueYShow을 설정하지 않는경우, 컬럼1은 10만큼 컬럼2는 30만큼, 컬럼3은 50만큼 막대를 표현하지만,
    //각 컬럼의 valueYShow를 valueYTotalPercent로 설정하게 될 경우
    //10, 30, 50의 값을 백분률로 계산하여 컬럼을 표현한다.
    u4a.charts.am5.ValueShowType = {
        Working                   : "Working",
        Change                    : "Change",
        ChangePercent             : "ChangePercent",
        ChangeSelection           : "ChangeSelection",
        ChangeSelectionPercent    : "ChangeSelectionPercent",
        ChangePrevious            : "ChangePrevious",
        ChangePreviousPercent     : "ChangePreviousPercent",
        Total                     : "Total",
        TotalPercent              : "TotalPercent",
        Sum                       : "Sum"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ValueShowType", u4a.charts.am5.ValueShowType);

    
    let _oBarSetting = Element.extend("u4a.charts.am5.BarSetting", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //차트 요소의 이름.(am5.Series)
                //차트 요소를 식별할 수 있는 이름.
                //(name 속성에 값을 지정한뒤 legendLabelText를 설정하지 않는경우
                //범례 text는 name의 속성값으로 출력된다.)
                name : { type : "string", defaultValue : "" },


                //막대 차트를 누적 막대 차트로 설정할지 여부 필드.
                //BAR1, BAR2가 존재할 경우 하나의 누적 막대로 표현하려면
                //BAR2의 stacked를 true로 설정한다.
                //BAR1, BAR2, BAR3이 존재할 경우 하나의 누적 막대로 표현하려면
                //BAR2, BAR3의 stacked를 true로 설정한다.
                //BAR1, BAR2, BAR3이 존재할 경우 BAR1, BAR2만 누적 막대로 표현 하려면
                //BAR2의 stacked를 true로 설정한다.
                stacked : { type : "boolean", defaultValue : false },


                //차트 요소를 y축에 표현하는 방법.
                //y축 axis의 calculateTotals값이 true일때 동작함.
                //일반적으로 컬럼, 라인은 바인딩 필드에 해당하는 값으로 표현 처리함.
                //GT_OTAB:[{F01:100, CAT:"2025"},...]의 바인딩 데이터 처리시 
                //valueField이 F01으로 설정했다면 첫번째 막대는 100만큼으로 표현 처리한다.
                //하지만 valueShow의 값을 설정하여 화면에 표현하는 방식을 설정할 수 있다.
                //예를들어 컬럼1, 컬럼2, 컬럼3이 누적 막대로 존재하며 
                //각각 10, 30, 50의 값으로 컬럼을 표현 하려한다.
                //valueShow을 설정하지 않는경우, 컬럼1은 10만큼 컬럼2는 30만큼, 컬럼3은 50만큼 막대를 표현하지만,
                //각 컬럼의 valueShow를 TotalPercent로 설정하게 될 경우
                //10, 30, 50의 값을 백분률로 계산하여 컬럼을 표현한다.
                valueShow : { type : "u4a.charts.am5.ValueShowType" },


                //차트 요소의 채우기 색상.(#ffffff)(am5.Series)
                //bar Setting에서 설정한 색상은 legend의 barSetting에 해당하는 색상과 연결된다.
                fill : { type : "sap.ui.core.CSSColor", defaultValue : "" }
                
            }
    
        }, /* end of metadata */
    
        init : function(){

            this._oChart = {};
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */


        /*************************************************************
         * @function - 차트 컬럼 생성 처리.
         *************************************************************/
        _getEventUI : function(oEvent){

            var _sId = oEvent?.target?.dataItem?.dataContext?._sId;

            if(typeof _sId === "undefined"){
                return;
            }

            return sap.ui.getCore().byId(_sId);


        },


        /*************************************************************
         * @function - 막대 Series 정보 생성.
         *************************************************************/
        _createBarSetting : function(sParams){

            if(typeof sParams?.oChart?._oChart?.oRoot === "undefined"){
                return;
            }

            if(typeof sParams?.oValueAxis === "undefined"){
                return;
            }

            if(typeof sParams?.oCategoryAxis === "undefined"){
                return;
            }
            

            let _sChartProp = {};


            //columnSeries의 name 속서 정보 매핑.
            _sChartProp.name = this.getName();

            //차트를 누적으로 구성할지 정보.
            _sChartProp.stacked = this.getStacked();

            
            //차트 막대 표현 처리값 얻기.
            let _valueShow = this.getValueShow();



            //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
            switch (sParams.oChart.getRotate()) {
                case true:
                    //차트 가로 출력건인경우.
                    _sChartProp.yAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.xAxis = sParams.oValueAxis._oChart.oChartInstance;

                    //값 출력 필드명 구성.
                    _sChartProp.valueXField     = "value";

                    if(_sChartProp.stacked === false){
                        _sChartProp.openValueXField = "openValue";
                        _sChartProp.lowValueXField  = "lowValue";
                        _sChartProp.highValueXField = "highValue";
                    }

                    //category 바인딩 필드.
                    _sChartProp.categoryYField  = "index";

                    
                    //차트 막대 표현 처리값이 존재하는경우.
                    if(typeof _valueShow !== "undefined"){
                        //x축의 막대 표현 처리 설정.
                        _sChartProp.valueXShow  = "valueX" + _valueShow;

                    }

                    break;
            
                default:
                    //차트 세로 출력건인경우.
                    _sChartProp.xAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.yAxis = sParams.oValueAxis._oChart.oChartInstance;

                    //값 출력 필드명 구성.
                    _sChartProp.valueYField     = "value";

                    if(_sChartProp.stacked === false){
                        _sChartProp.openValueYField = "openValue";
                        _sChartProp.lowValueYField  = "lowValue";
                        _sChartProp.highValueYField = "highValue";
                    }
                    
                    //category 바인딩 필드.
                    _sChartProp.categoryXField  = "index";


                    //차트 막대 표현 처리값이 존재하는경우.
                    if(typeof _valueShow !== "undefined"){
                        //y축의 막대 표현 처리 설정.
                        _sChartProp.valueYShow  = "valueY" + _valueShow;

                    }

                    break;
            }


            //20250925 PES -START.
            //막대 색상을 지정했을때 legend의 해당 item의 색상과 다르게
            //표현되는 문제가 있기에 BarSetting에서 색상을 설정하여 
            //legend item의 색상을 설정할 수 있도록 로직 보완.
            var _fill = Settings.prototype._getAm5Color(this.getFill());

            if(_fill){
                _sChartProp.fill = _fill;
            }
            //20250925 PES -END.
            

            //am5 차트의 columnSeries 생성.
            var _oColumn = am5xy.ColumnSeries.new(sParams.oChart._oChart.oRoot, _sChartProp);


            this._oChart.oChartInstance = _oColumn;


            //컬럼에 tooltipText 지정.
            _oColumn.set("tooltip", am5.Tooltip.new(sParams.oChart._oChart.oRoot, {
                templateField : "tooltipText"
            }));

            _oColumn.columns.template.set("tooltipPosition", "pointer");


            //columnSeries click 이벤트 등록.
            _oColumn.columns.template.events.on("click", function(oEvent) {

                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            //columnSeries dblclick 이벤트 등록.
            _oColumn.columns.template.events.on("dblclick", function(oEvent) {
                
                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            //columnSeries rightclick 이벤트 등록.
            _oColumn.columns.template.events.on("rightclick", function(oEvent) {
                
                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            var _sStrokesProp = {};
            _sStrokesProp.templateField = "columnTemplate";

            _oColumn.columns.template.setAll(_sStrokesProp);


            //bullect 생성 갯수 얻기.
            let _cnt = this._getBulletCount();

            for (let i = 0; i < _cnt; i++) {
                
                _oColumn.bullets.push(function(root, series, dataItem){

                    if(typeof dataItem?.dataContext?._bullets === "undefined"){
                        return;
                    }
    
                    if(dataItem?.dataContext?._bullets?.length === 0){
                        return;
                    }
    
                    let _oBullet = dataItem?.dataContext?._bullets[i];
    
                    if(typeof _oBullet?._createBullet === "undefined"){
                        return;
                    }
    
                    let _oAM5Bullet = _oBullet?._createBullet(root);
    
                    return _oAM5Bullet;
    
                });
                
            }

            

            return _oColumn;

        },


        /*************************************************************
         * @function - bullet 생성 갯수 얻기.
         *************************************************************/
        _getBulletCount : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent === "undefined"){
                return;
            }

            let _oCategory = _oParent.getParent() || undefined;

            if(typeof _oCategory === "undefined"){
                return;
            }

            let _aItems = _oCategory.getCategoryItems();

            if(_aItems.length === 0){
                return;
            }


            let _pos = _oParent.indexOfAggregation("bars", this);

            let _maxCnt = 0;

            for (let i = 0, l = _aItems.length; i < l; i++) {
                
                let _oItem = _aItems[i];

                let _aChild = _oItem.getAggregation("barItems"); 

                if(_aChild.length === 0){
                    continue;
                }

                let _oChild = _aChild[_pos];

                if(typeof _oChild === "undefined"){
                    continue;
                }

                let _cnt = _oChild.getBullet().length;

                if(_cnt > _maxCnt){
                    _maxCnt = _cnt;
                }
                
            }

            return _maxCnt;

        },


        /*************************************************************
         * @function - fill 프로퍼티 값 변경.
         *************************************************************/
        setFill : function(propValue){

            this.setProperty("fill", propValue, true);

            if(!this?._oChart?.oChartInstance?.columns?.template?.set){
                return;
            }

            var _fill = Settings.prototype._getAm5Color(propValue);

            //색상이 존재하는경우.
            if(_fill){
                //막대의 색상 갱신 처리.
                this._oChart.oChartInstance.columns.template.set('fill', _fill);
                
                this._oChart.oChartInstance.markDirty();

                return;
            }

            
            //색상이 존재하지 않는경우 chart에서 color 속성 정보 얻기.
            var _oColors = this._oChart.oChartInstance?.chart?.get?.('colors');

            if(!_oColors){
                return;
            }

            //다음 색상 코드 얻기.
            var _fill = _oColors?.next();

            if(!_fill){
                return;
            }

            //해당 색상으로 매핑.
            this._oChart.oChartInstance.columns.template.set('fill', _fill);

            //차트 갱신.
            this._oChart.oChartInstance.markDirty();

        }
        
    
    });

    return _oBarSetting;
    
});