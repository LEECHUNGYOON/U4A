sap.ui.define("u4a.charts.am5.RadarCategoryAxis", [
    "u4a/charts/am5/Axis"
    
    ], function(Axis){
        "use strict";

        
        let _oRadarCategoryAxis = Axis.extend("u4a.charts.am5.RadarCategoryAxis", {
            metadata : {
                library : "u4a.charts.am5",
                properties : {
                    
                    
                    //y축 차트를 상단에 그릴지 여부(AxisRendererX 속성정보)
                    //true : X축을 상단에 표현한다.
                    opposite : { type : "boolean", defaultValue : false },

                    //axis의 값을 표현하는 간격.(AxisRenderer 속성정보)
                    //y축의 axis의 값을 표현할때 기본적으로는 자동으로 표현하지만,
                    //특정 간격마다 값을 표현 하고자 할때 사용된다.
                    //minGridDistance의 값을 100으로 설정할 경우 100px마다 axis의 값을 표현함.
                    minGridDistance : { type : "int", defaultValue : 120 },

                    
                    //radar 차트의 원 크기.
                    radius : { type : "sap.ui.core.CSSSize", defaultValue : "100%" },


                    //radarChart 전용 속성 정보.
                    //radar chart의 내부 반경 값.
                    //값이 커질수록 내부의 빈 원의 공간이 커진다.
                    innerRadius : { type : "sap.ui.core.CSSSize" }

                },
    
                aggregations : {
                        
                    //valueAxis(Y축) aggregation.
                    valueAxis : { type : "u4a.charts.am5.RadarValueAxis", multiple : false },


                    //차트에 출력할 bar, line에 대한 setting 정보 aggregation.
                    //seriesSetting aggregation의 하위 aggregation인 bar, line aggregation에 UI를 추가 후,
                    //categoryItems aggregation에 barItem, lineItem UI를 추가하여 차트를 구성한다.
                    seriesSetting : { type : "u4a.charts.am5.RadarSeriesSetting", multiple : false },


                    //차트의 막대, 꺾은선 출력을 위한 container Aggregation.
                    categoryItems : { type : "u4a.charts.am5.RadarCategoryItem", multiple : true, singularName: "categoryItem" },


                    //x축의 title 정보.
                    title : { type : "u4a.charts.am5.Title", multiple : false }

                }

            }, /* end of metadata */
    
            init : function(){
     
                Axis.prototype.init.apply(this, arguments);

                this._oChart.column = [];

                this._oChart.line = [];


                //수집 제외대상 프로퍼티정보.
                this._aExcludeProp = [
                    "inversed",
                    "stroke",
                    "strokeOpacity",
                    "strokeDasharray",
                    "strokeDashoffset",
                    "strokeWidth",
                    "opposite",
                    "minGridDistance"
                ];


                //예외처리 수집대상 프로퍼티정보.
                this._aExcepProp = [
                    "inversed",
                    "stroke",
                    "strokeOpacity",
                    "strokeDasharray",
                    "strokeDashoffset",
                    "strokeWidth",
                    "opposite",
                    "minGridDistance"
                ];

    
            }, /* end of init */
    
            renderer : function(oRm, oControl){
    
            }, /* end of renderer */
        
            exit : function(){
                    
                Axis.prototype.exit.apply(this, arguments);
    
            }, /* end of exit */


            /*************************************************************
             * @function - 차트 출력 데이터 구성.
             *************************************************************/
            _getChartData : function(){

                //내꺼 카테고리 정보 구성.

                this._oChart.aData = [];

                
                //차트의 막대, 꺾은선 출력을 위한 container UI 얻기.
                let _aCategoryItem = this.getCategoryItems();

                if(_aCategoryItem.length === 0){
                    return;
                }

                for (let i = 0, l = _aCategoryItem.length; i < l; i++) {
                    
                    let _oCategoryItem = _aCategoryItem[i];

                    //container 내부에 존재하는 columnSeries, lineSeries 출력 데이터 구성.
                    let _sChartData = _oCategoryItem._getChartData();

                    //카테고리를 표현하기 위한 필드 정보 구성.
                    _sChartData.index = i;

                    this._oChart.aData.push(_sChartData);

                    
                }

            },


            /*************************************************************
             * @function - 컬럼 라인 정보 구성 처리.
             *************************************************************/
            _createSeries : function(oChart){

                this._oChart.column = [];
                this._oChart.line = [];

                let _oParent = this.getParent() || undefined;

                if(typeof _oParent === "undefined"){
                    return;
                }

                let _oSeriesSetting = this.getSeriesSetting() || undefined;

                if(typeof _oSeriesSetting === "undefined"){
                    return;
                }

                let _oValueAxis = this.getValueAxis() || undefined;

                if(typeof _oValueAxis === "undefined"){
                    return;
                }

                let _sParams = {};

                _sParams.oChart = oChart;

                _sParams.oCategoryAxis = this;
                
                _sParams.oValueAxis = _oValueAxis;

                
                let _aBars = _oSeriesSetting.getBars();
                                
                for (let i = 0, l = _aBars.length; i < l; i++) {

                    let _oBars = _aBars[i];

                    //am5 columnSeries 생성 처리.
                    let _oColumn = _oBars._createBarSetting(_sParams);

                    if(typeof _oColumn === "undefined"){
                        continue;
                    }

                    //categoryAxis에 생성된 컬럼 추가.
                    this._oChart.column.push(_oColumn);

                    //am5 chart에 생성된 columnSeries 추가.
                    oChart._oChart.oChartInstance.series.push(_oColumn);

                    var _colId = `column${i}`;

                    //column index에 해당하는 데이터를 매핑 처리.
                    _oColumn.data.setAll(this._oChart.aData.map(function(sData, indx){

                        let _sData = sData[_colId] || {};

                        _sData.index = indx;

                        return _sData;

                    }));


                    _oColumn.appear(_oParent.getSeriesAppearDuration());
                    
                }


                let _aLines = _oSeriesSetting.getLines();

                for (let i = 0, l = _aLines.length; i < l; i++) {

                    let _oLines = _aLines[i];

                    //am5 lineSeries 생성 처리.
                    let _oLine = _oLines._createLineSetting(_sParams);

                    if(typeof _oLine === "undefined"){
                        continue;
                    }

                    //categoryAxis에 생성된 라인 추가.
                    this._oChart.line.push(_oLine);

                    //am5 chart에 생성된 lineSeries 추가.
                    oChart._oChart.oChartInstance.series.push(_oLine);

                    var _lineId = `line${i}`;

                    let _aChartData = this._oChart.aData.map(function(sData, indx){

                        let _sData = sData[_lineId] || {};

                        _sData.index = indx;

                        return _sData;

                    });


                    //차트의 시작과 끝을 연결하기 위한 데이터 매핑 처리.
                    //차트의 데이터가 최소 3건이 있어야 시작과 끝을 연결 처리함.
                    //(2건이 있다면 하나의 선이 구성됨)
                    if(_aChartData.length >= 3){
                        // _aChartData.push(JSON.parse(JSON.stringify(_aChartData[0])));
                        _aChartData.push(jQuery.extend(true, _aChartData[0]));
                    }                    
                    

                    //line index에 해당하는 데이터를 매핑 처리.
                    _oLine.data.setAll(_aChartData);

                    _oLine.appear(_oParent.getSeriesAppearDuration());
                    
                }

            },


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
             * @function - 차트 컬럼 생성 처리.
             *************************************************************/
            _createColumn : function (oChart){
                
                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return;
                }
                

                let _oValueAxis = this.getValueAxis() || undefined;

                if(typeof _oValueAxis === "undefined"){
                    return;
                }


                let _sChartProp = {};

                //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
                switch (oChart.getRotate()) {
                    case true:
                        //차트 가로 출력건인경우.
                        _sChartProp.yAxis = this._oChart.oChartInstance;
                        
                        _sChartProp.xAxis = _oValueAxis._oChart.oChartInstance;

                        _sChartProp.valueXField = "value";
                        _sChartProp.openValueXField = "openValue";
                        _sChartProp.lowValueXField = "lowValue";
                        _sChartProp.highValueXField = "highValue";

                        _sChartProp.categoryYField = "index";

                        break;
                
                    default:
                        //차트 세로 출력건인경우.
                        _sChartProp.xAxis = this._oChart.oChartInstance;
                        
                        _sChartProp.yAxis = _oValueAxis._oChart.oChartInstance;

                        _sChartProp.valueYField = "value";
                        _sChartProp.openValueYField = "openValue";
                        _sChartProp.lowValueYField = "lowValue";
                        _sChartProp.highValueYField = "highValue";

                        _sChartProp.categoryXField = "index";

                        break;
                }


                //am5 차트의 columnSeries 생성.
                var _oColumn = am5radar.RadarColumnSeries.new(oChart._oChart.oRoot, _sChartProp);


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


                //컬럼에 tooltipText 지정.
                _oColumn.set("tooltip", am5.Tooltip.new(oChart._oChart.oRoot, {
                    templateField : "tooltipText"
                }));

                _oColumn.columns.template.set("tooltipPosition", "pointer");


                var _sStrokesProp = {};
                _sStrokesProp.templateField = "columnTemplate";

                _oColumn.columns.template.setAll(_sStrokesProp);


                return _oColumn;
                
            },


            /*************************************************************
             * @function - 차트 라인 생성 처리.
             *************************************************************/
            _createLine : function (oChart){

                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return;
                }
                

                let _oValueAxis = this.getValueAxis() || undefined;

                if(typeof _oValueAxis === "undefined"){
                    return;
                }


                let _sChartProp = {};
                

                //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
                switch (oChart.getRotate()) {
                    case true:
                        //차트 가로 출력건인경우.
                        _sChartProp.yAxis = this._oChart.oChartInstance;
                        
                        _sChartProp.xAxis = _oValueAxis._oChart.oChartInstance;

                        _sChartProp.valueXField = "value";
                        _sChartProp.openValueXField = "openValue";
                        _sChartProp.lowValueXField = "lowValue";
                        _sChartProp.highValueXField = "highValue";                        

                        _sChartProp.categoryYField = "index";

                        break;
                
                    default:
                        //차트 세로 출력건인경우.
                        _sChartProp.xAxis = this._oChart.oChartInstance;
                        
                        _sChartProp.yAxis = _oValueAxis._oChart.oChartInstance;

                        _sChartProp.valueYField = "value";                        
                        _sChartProp.openValueYField = "openValue";
                        _sChartProp.lowValueYField = "lowValue";
                        _sChartProp.highValueYField = "highValue";

                        _sChartProp.categoryXField = "index";

                        break;
                }


                //am5 차트의 LineSeries 생성.
                let _oLine = am5radar.RadarLineSeries.new(oChart._oChart.oRoot, _sChartProp);

                //라인에 tooltipText 지정.
                _oLine.set("tooltip", am5.Tooltip.new(oChart._oChart.oRoot, {
                    templateField : "tooltipText"
                }));

                

                _oLine.strokes.template.set("tooltipPosition", "pointer");


                var _sStrokesProp = {};
                _sStrokesProp.templateField = "strokeTemplate";


                _oLine.strokes.template.setAll(_sStrokesProp);


                return _oLine;
                
            },


            /*************************************************************
             * @function - CategoryAxis의 setting 값 변경 이후 화면 갱신 처리.
             *  categoryField와 같은 setting은 값을 반영하더라도 화면이 
             *  갱신되지 않는 문제가 있기에 차트 데이터를 다시 반영처리 하는 예외로직.
             *************************************************************/
            _updateCategory: function(){

                if(typeof this?._oChart?.oChartInstance === "undefined"){
                    return;
                }

                this._getChartData();

                this._oChart.oChartInstance.data.setAll([]);

                this._oChart.oChartInstance.data.setAll(this._oChart.aData);

            },



            /*************************************************************
             * @function - 차트 카테고리 axis 생성 처리.
             *************************************************************/
            _createCategoryAxis : function(oChart){

                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return;
                }

                
                //axis의 속성 정보 얻기.
                let _sChartProp = this._getChartProperies(this._aExcludeProp);


                _sChartProp.categoryField = "index";

                
                //x축 Renderer정보 구성.
                _sChartProp.renderer = this._createAxisRenderer(oChart);
                

                this._oChart.oChartInstance = am5xy.CategoryAxis.new(oChart._oChart.oRoot, _sChartProp);

                this._oChart.oChartInstance.get("renderer").labels.template.setAll({
                    text: "{categoryText}", // 원래 카테고리 값만 표시
                    templateField : "labelStyle"
                });

                this._oChart.oChartInstance.get("renderer").grid.template.setAll({
                    templateField : "grid"
                });


                //타이틀 정보 생성 처리.
                this._setTitle(oChart);


                //y축의 기준선 정보 생성 처리.
                this._createGuideLineRange();


                return this._oChart.oChartInstance;
                
                
            },


            /*************************************************************
             * @function - AXIS의 Renderer 정보 생성.
             *************************************************************/
            _createAxisRenderer : function(oChart){

                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return;
                }
    
                let _oMeta = oChart.getMetadata();
    
                if(typeof _oMeta === "undefined"){
                    return;
                }
    
    
                //AXIS의 Renderer에 설정할 속성정보 얻기.
                let _sChartProp = this._getChartProperies();
                
    
    
                //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
                switch (oChart.getRotate()) {
                    case true:
                        //차트 세로 출력건인경우.
                        
                        //Y축 정보 구성.
                        var _oRenderer = am5radar.AxisRendererRadial.new(oChart._oChart.oRoot, _sChartProp);
                        break;
                
                    default:
                        //차트 가로 출력건인경우.
    
                        //X축 정보 구성.
                        var _oRenderer = am5radar.AxisRendererCircular.new(oChart._oChart.oRoot, _sChartProp);
                        break;
                }
    
                return _oRenderer;
    
    
            },


            /*************************************************************
             * @function - 타이틀 정보 생성 처리.
             *************************************************************/
            _setTitle : function(oChart){

                if(typeof oChart === "undefined"){
                    return;
                }
                
                //title UI 정보 얻기.
                let _oTitle = this.getTitle() || undefined;

                if(typeof _oTitle?._createTitle === "undefined"){
                    return;
                }

                //am5의 title instance 생성 처리.
                let _oAmTitle = _oTitle?._createTitle();

                if(typeof _oAmTitle === "undefined"){
                    return;
                }


                //차트의 가로/세로 모드에 따른 UI 추가 처리.
                switch (oChart.getRotate()) {
                    case true:
                        //가로 모드인경우.
                        this._oChart.oChartInstance.children.moveValue(_oAmTitle, 0);
                        
                        break;
                
                    default:
                        //세로 모드인 경우.
                        this._oChart.oChartInstance.children.push(_oAmTitle);
                        break;
                }

            },

            
            /*************************************************************
             * @function - categoryField 프로퍼티 값 설정 function 재정의.
             *************************************************************/
            setCategoryField : function(propValue){

                let _propValue = this._setProperty("categoryField", propValue);


                //차트 Instance에 categoryField settings 값 반영 처리.
                this._setChartSettings("categoryField", _propValue);

                
                //CategoryAxis의 setting 값 변경 이후 화면 갱신 처리.
                this._updateCategory();


                //CategoryAxis의 categoryField 값 변경 이후 series의 categoryField 값 갱신 처리.
                this._updateSeriesCategoryField(_propValue);


            },


            /*************************************************************
             * @function - opposite 프로퍼티 값 설정 function 재정의.
             *************************************************************/
            setOpposite : function(propValue){

                let _propValue = this._setProperty("opposite", propValue);


                //차트 Instance에 opposite settings 값 반영 처리.
                this._setChartSettings("opposite", _propValue);

            },


            /*************************************************************
             * @function - minGridDistance 프로퍼티 값 설정 function 재정의.
             *************************************************************/
            setMinGridDistance : function(propValue){

                let _propValue = this._setProperty("minGridDistance", propValue);


                //차트 Instance에 minGridDistance settings 값 반영 처리.
                this._setChartRendererSetting("minGridDistance", _propValue);

            },


            /*************************************************************
             * @function - radius 프로퍼티 값 설정 function 재정의.
             *************************************************************/
            setRadius : function(propValue){

                let _propValue = this._setProperty("radius", propValue);


                //차트 Instance에 radius settings 값 반영 처리.
                this._setChartRendererSetting("radius", this._convAM5Property("radius", _propValue));

            },


            /*************************************************************
             * @function - innerRadius 프로퍼티 값 설정 function 재정의.
             *************************************************************/
            setInnerRadius : function(propValue){

                let _propValue = this._setProperty("innerRadius", propValue);


                //차트 Instance에 innerRadius settings 값 반영 처리.
                this._setChartRendererSetting("innerRadius", this._convAM5Property("innerRadius", _propValue));

            }

            
        });
    
        return _oRadarCategoryAxis;
        
        
    });
    