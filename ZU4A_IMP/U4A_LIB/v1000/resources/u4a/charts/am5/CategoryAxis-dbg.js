sap.ui.define("u4a.charts.am5.CategoryAxis", [
    "u4a/charts/am5/Axis"
    
    ], function(Axis){
        "use strict";

        
        let _oCategoryAxis = Axis.extend("u4a.charts.am5.CategoryAxis", {
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
                    minGridDistance : { type : "int", defaultValue : 120 }


                },
    
                aggregations : {

                    //valueAxis(Y축) aggregation.
                    valueAxis : { type : "u4a.charts.am5.ValueAxis", multiple : false },

                    
                    //차트에 출력할 bar, line에 대한 setting 정보 aggregation.
                    //seriesSetting aggregation의 하위 aggregation인 bar, line aggregation에 UI를 추가 후,
                    //categoryItems aggregation에 barItem, lineItem UI를 추가하여 차트를 구성한다.
                    seriesSetting : { type : "u4a.charts.am5.SeriesSetting", multiple : false },


                    //차트의 막대, 꺾은선 출력을 위한 container Aggregation.
                    categoryItems : { type : "u4a.charts.am5.CategoryItem", multiple : true, singularName: "categoryItem" },

                    
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

                    //line index에 해당하는 데이터를 매핑 처리.
                    _oLine.data.setAll(this._oChart.aData.map(function(sData, indx){

                        let _sData = sData[_lineId] || {};

                        _sData.index = indx;

                        return _sData;

                    }));

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
             * @function - 차트 카테고리 axis 생성 처리.
             *************************************************************/
            _createCategoryAxis : function(oChart){

                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return;
                }
                
                //axis의 속성 정보 얻기.
                let _sChartProp = this._getChartProperies(this._aExcludeProp);

                //visible 속성정보 얻기.
                _sChartProp.visible = this.getVisible();


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
                        var _oRenderer = am5xy.AxisRendererY.new(oChart._oChart.oRoot, _sChartProp);
                        break;
                
                    default:
                        //차트 가로 출력건인경우.

                        //X축 정보 구성.
                        var _oRenderer = am5xy.AxisRendererX.new(oChart._oChart.oRoot, _sChartProp);
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

            }

            
        });
    
        return _oCategoryAxis;
        
        
    });
    