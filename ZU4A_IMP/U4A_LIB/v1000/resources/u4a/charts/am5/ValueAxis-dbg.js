sap.ui.define("u4a.charts.am5.ValueAxis", [
    "u4a/charts/am5/Axis"
    
], function(Axis){
    "use strict";


    //UNIT 출력시 UNIT의 위치.
    u4a.charts.am5.ValueAxisUnitPosition = {
        left : "left",
        right : "right",
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ValueAxisUnitPosition", u4a.charts.am5.ValueAxisUnitPosition);

    
    let _oValueAxis = Axis.extend("u4a.charts.am5.ValueAxis", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 확대시 y축을 확대처리 할지 여부.
                //true : 차트가 확대 가능할 경우 y축의 계열도 같이 확대 처리가됨.
                //false : 차트가 확대 가능할 경우 확대 하더라도 y의 계열을 고정 처리함.
                autoZoom : { type : "boolean", defaultValue : true },


                //y축의 값이 백분율과 같이 컬럼의 값이 계산되어 표현될때 calculateTotals를 true로 설정함.
                //예를들어 누적 막대 차트를 구성하는 경우 누적 막대를 비율로 표현하고자 할때
                //막대에 해당하는 각 컬럼의 valueYShow 속성을 TotalPercent로 설정한뒤,
                //y축의 axis의 calculateTotals를 true로 설정한다.
                calculateTotals : { type : "boolean", defaultValue : false },


                //y축 max값의 비율.
                //차트 데이터로 표현되는 y축의 max값이 1000인경우, extraMax를 0.1로 설정시
                //max값을 1100 으로 표현한다.
                extraMax : { type : "float", defaultValue : 0 },


                //y축 min값의 비율.
                //차트 데이터로 표현되는 y축의 min값이 0인경우, extraMin을 0.1로 설정시
                //min값을 -100 으로 표현한다.
                extraMin : { type : "float", defaultValue : 0 },


                //y측 max값.
                //일반적으로 y축의 max값은 차트 데이터의 출력값중 가장 높은 값을 자동으로 계산하여
                //출력하지만 max값을 고정 처리 하고자 하는 경우 해당 속성값을 설정한다.
                //차트 출력 데이터의 가장 높은 값이 2000 이더라도 max값을 1000으로 설정시
                //max값만큼 차트가 출력된다.
                //max 속성값에 extraMax속성값이 계산되어 화면에 출력된다.
                max : { type : "float" },


                //y축 값의 최대 소숫점 표현값.
                //차트 데이터의 출력되는 값이 소숫점으로 구성된 경우
                //max 소숫점 자릿수를 해당 속성값으로 설정할 수 있다.                
                maxPrecision : { type : "int" },


                //y축 min값
                //일반적으로 y축의 min값은 차트 데이터의 출력값중 가장 낮은 값을 자동으로 계산하여
                //출력하지만 min값을 고정 처리 하고자 하는 경우 해당 속성값을 설정한다.
                //차트 출력 데이터의 가장 낮은 0 이더라도 min값을 100으로 설정시
                //min값만큼 차트가 출력된다.
                //min 속성값에 extraMin속성값이 계산되어 화면에 출력된다.
                min : { type : "float" },


                //y축 차트의 숫자 유형.
                //(USD, KRW, % 등.)
                numberFormat : { type : "string", defaultValue : "" },

                
                //y축 차트를 오른쪽에 그릴지 여부(AxisRendererY 속성정보)
                opposite : { type : "boolean", defaultValue : false },

                
                //axis의 값을 표현하는 간격.(AxisRenderer 속성정보)
                //y축의 axis의 값을 표현할때 기본적으로는 자동으로 표현하지만,
                //특정 간격마다 값을 표현 하고자 할때 사용된다.
                //minGridDistance의 값을 100으로 설정할 경우 100px마다 axis의 값을 표현함.
                minGridDistance : { type : "int", defaultValue : 0 },


                //axis의 값과 값 사이에 그리드 선을 표현 할지 여부(AxisRenderer 속성정보)
                //y축의 axis값과 값 사이에 그리드선을 표현 할지 여부값.
                //true 로 설정시 y축의 값과 값 사이에 그리드 선을 표현한다.
                minorGridEnabled : { type : "boolean", defaultValue : false },

                
                //axis의 값과 값 사이에 그리드 선에 해당하는 값을 표현 할지 여부(AxisRenderer 속성정보)
                //y축의 axis값과 값 사이에 그리드선에 해당하는 값을 표현 할지 여부값.
                //true 로 설정시 y축의 값과 값 사이에 그리드에 해당하는 값을 표현한다.
                //minorGridEnabled를 false로 설정하고 minorLabelsEnabled를 true로 설정할 경우
                //그리드선과 그리드 선에 해당하는 값을 표현한다.
                minorLabelsEnabled : { type : "boolean", defaultValue : false },


                //UNIT 출력시 UNIT의 위치.
                unitPosition : { type : "u4a.charts.am5.ValueAxisUnitPosition", defaultValue : "right" }

            },

            aggregations : {
                
                //y축 숫자 label 세팅.
                labelStyle : { type : "u4a.charts.am5.LabelStyle", multiple : false },


                //y축의 가로 배경선 세팅.
                grid : { type : "u4a.charts.am5.Grid", multiple : false },


                //y축의 title 정보.
                title : { type : "u4a.charts.am5.Title", multiple : false }

            }

        }, /* end of metadata */

        init : function(){
            
            Axis.prototype.init.apply(this, arguments);


            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "inversed",
                "stroke",
                "strokeOpacity",
                "strokeDasharray",
                "strokeDashoffset",
                "strokeWidth",
                "opposite",
                "minGridDistance",
                "minorGridEnabled",
                "minorLabelsEnabled",
                "numberFormat",
                "unitPosition"
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
                "minGridDistance",
                "minorGridEnabled",
                "minorLabelsEnabled"
            ];

        }, /* end of init */


        renderer : function(oRm, oControl){

        }, /* end of renderer */

        exit : function(){

            Axis.prototype.exit.apply(this, arguments);

        }, /* end of exit */



        /*************************************************************
         * @function - 차트 Y축 aixs 생성 처리.
         *************************************************************/
        _createValueAxis : function(oChart){
            
            if(typeof oChart?._oChart?.oRoot === "undefined"){
                return;
            }

            
            //axis의 속성 정보 얻기.
            let _sChartProp = this._getChartProperies(this._aExcludeProp);

            //visible 속성정보 얻기.
            _sChartProp.visible = this.getVisible();


            //axis에 출력할 numberFormat 구성.
            _sChartProp.numberFormat = this._getNumberFormat();


            //x축 Renderer정보 구성.
            _sChartProp.renderer = this._createAxisRenderer(oChart);


            //label aggregation 정보 얻기.
            let _oLabelStyle = this.getLabelStyle() || undefined;


            //label aggregation이 존재하는경우 label의 property값을 통해 am5의 label 속성을 정의.
            if(typeof _oLabelStyle !== "undefined"){
                _sChartProp.renderer.labels.template.setAll(_oLabelStyle._getChartData());
            }


            //grid aggregation 정보 얻기.
            let _oGrid = this.getGrid() || undefined;


            //grid aggregation이 존재하는경우 grid의 property값을 통해 am5의 grid 속성을 정의.
            if(typeof _oGrid !== "undefined"){
                _sChartProp.renderer.grid.template.setAll(_oGrid._getChartData());
            }


            this._oChart.oChartInstance = am5xy.ValueAxis.new(oChart._oChart.oRoot, _sChartProp);


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
            let _sChartProp = this._getChartExcepProperties(this._aExcepProp);
    
            
    
            //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
            switch (oChart.getRotate()) {
                case true:
                    //차트 세로 출력건인경우.
                    
                    //Y축 정보 구성.
                    var _oRenderer = am5xy.AxisRendererX.new(oChart._oChart.oRoot, _sChartProp);
                    break;
            
                default:
                    //차트 가로 출력건인경우.
    
                    //X축 정보 구성.
                    var _oRenderer = am5xy.AxisRendererY.new(oChart._oChart.oRoot, _sChartProp);
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

            if(typeof this?._oChart?.oChartInstance === "undefined"){
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
                    this._oChart.oChartInstance.children.push(_oAmTitle);
                    break;
            
                default:
                    //세로 모드인 경우.
                    this._oChart.oChartInstance.children.moveValue(_oAmTitle, 0);
                    break;
            }

        },


        /*************************************************************
         * @function - axis에 출력할 numberFormat 구성.
         *************************************************************/
        _getNumberFormat : function(){

            //numberFormat 속성값얻기.
            let _numberFormat = this.getNumberFormat();

            if(_numberFormat === ""){
                return _numberFormat;
            }

            _numberFormat = _numberFormat.replace(/'/g, "''");

            let _position = this.getUnitPosition();

            switch (_position) {
                case u4a.charts.am5.ValueAxisUnitPosition.right:
                    
                    return `#,###.#####'${_numberFormat}'`;

                case u4a.charts.am5.ValueAxisUnitPosition.left:
                    return `'${_numberFormat}'#,###.#####`;

                default:
                    return `#,###.#####'${_numberFormat}'`;
            }

        },


        /*************************************************************
         * @function - autoZoom 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setAutoZoom : function(propValue){

            let _propValue = this._setProperty("autoZoom", propValue);


            //차트 Instance에 autoZoom settings 값 반영 처리.
            this._setChartSettings("autoZoom", _propValue);

        },


        /*************************************************************
         * @function - calculateTotals 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCalculateTotals : function(propValue){

            let _propValue = this._setProperty("calculateTotals", propValue);


            //차트 Instance에 calculateTotals settings 값 반영 처리.
            this._setChartSettings("calculateTotals", _propValue);

        },


        /*************************************************************
         * @function - extraMax 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setExtraMax : function(propValue){

            let _propValue = this._setProperty("extraMax", propValue);


            //차트 Instance에 extraMax settings 값 반영 처리.
            this._setChartSettings("extraMax", _propValue);

        },


        /*************************************************************
         * @function - extraMin 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setExtraMin : function(propValue){

            let _propValue = this._setProperty("extraMin", propValue);


            //차트 Instance에 extraMin settings 값 반영 처리.
            this._setChartSettings("extraMin", _propValue);

        },


        /*************************************************************
         * @function - max 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMax : function(propValue){

            let _propValue = this._setProperty("max", propValue);


            //차트 Instance에 max settings 값 반영 처리.
            this._setChartSettings("max", _propValue);

        },


        /*************************************************************
         * @function - maxPrecision 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxPrecision : function(propValue){

            let _propValue = this._setProperty("maxPrecision", propValue);


            //차트 Instance에 maxPrecision settings 값 반영 처리.
            this._setChartSettings("maxPrecision", _propValue);

        },


        /*************************************************************
         * @function - min 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMin : function(propValue){

            let _propValue = this._setProperty("min", propValue);


            //차트 Instance에 min settings 값 반영 처리.
            this._setChartSettings("min", _propValue);

        },


        /*************************************************************
         * @function - numberFormat 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setNumberFormat : function(propValue){

            this._setProperty("numberFormat", propValue);


            //차트 Instance에 numberFormat settings 값 반영 처리.
            this._setChartSettings("numberFormat", this._getNumberFormat());


        },


        /*************************************************************
         * @function - opposite 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setOpposite : function(propValue){

            let _propValue = this._setProperty("opposite", propValue);


            //차트 Instance에 opposite settings 값 반영 처리.
            this._setChartRendererSetting("opposite", _propValue);

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
         * @function - minorGridEnabled 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinorGridEnabled : function(propValue){

            let _propValue = this._setProperty("minorGridEnabled", propValue);


            //차트 Instance에 minorGridEnabled settings 값 반영 처리.
            this._setChartRendererSetting("minorGridEnabled", _propValue);

        },


        /*************************************************************
         * @function - minorLabelsEnabled 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinorLabelsEnabled : function(propValue){

            let _propValue = this._setProperty("minorLabelsEnabled", propValue);


            //차트 Instance에 minorLabelsEnabled settings 값 반영 처리.
            this._setChartRendererSetting("minorLabelsEnabled", _propValue);

        },


        /*************************************************************
         * @function - unitPosition 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setUnitPosition : function(propValue){

            this._setProperty("unitPosition", propValue);


            //차트 Instance에 unitPosition settings 값 반영 처리.
            this._setChartSettings("numberFormat", this._getNumberFormat());

        }


    });

    return _oValueAxis;
    
    
});    