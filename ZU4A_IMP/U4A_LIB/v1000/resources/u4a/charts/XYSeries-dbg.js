sap.ui.define("u4a.charts.am5.XYSeries", [
    "u4a/charts/am5/Series"
    
],function(Series){
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



    /*************************************************************
     * @function - 차트 bullet 생성 처리.
     *************************************************************/
    function createBullet(oUi, oBullet){
        
        if(typeof oUi === "undefined"){
            return;
        }
        
        if(typeof oBullet._createBullet === "undefined"){
            return;
        }
        
        if(typeof oUi?._oChart?.oRoot === "undefined"){
            return;
        }
        
        if(typeof oUi?._oChart?.oChartInstance === "undefined"){
            return;
        }


        //bullet 생성 처리.
        oUi._oChart.oChartInstance.bullets.push(oBullet._createBullet());
                        
        
    }



    
    let _oXYSeries = Series.extend("u4a.charts.am5.XYSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                
                //차트요소(막대, 꺾은선)을 표현하기 위한 값정보.
                value : { type : "float" },


                //from에 해당하는 값을 표현하기 위한 필드명.
                //(XYChart에서 컬럼을 통해 차트를 구현하는경우, valueField만 사용시,
                //막대가 0부터 valueField의 입력한 값까지를 표현한다.
                //openValueField를 사용하여 차트를 구성하게 될 경우 
                //10부터 valueField의 입력한 값까지를 막대로 표현할 수 있다.
                //GT_OTAB:[{F01:100, F02:10, CAT:"2025"},...] 형식의 데이터가 존재하는경우,
                //valueYField : F01, openValueField : F02 를 입력할 경우
                //10 ~ 100 구간에 막대가 표현된다.
                openValue : { type : "float"},

                
                //Candlestick, OHLC 에서 사용되는 값 표현 필드명.
                //Candlestick의 경우 highValueField에 바인딩 필드명을 입력할 경우
                //막대 중앙에 세로 선이 위 방향으로 그려진다.
                highValue : { type : "float"},


                //Candlestick, OHLC 에서 사용되는 값 표현 필드명.
                //Candlestick의 경우 lowValueField에 바인딩 필드명을 입력할 경우
                //막대 중앙에 세로 선이 아래 방향으로 그려진다.
                lowValue : { type : "float"},


                //차트 막대의 x축 시작 지점.
                //값이 작아질수록 막대를 왼쪽으로 이동하여 그린다.
                //값이 커질수록 막대를 오른쪽으로 이동하여 그린다.
                location : { type : "float", defaultValue : 0.5 },


                //bullt을 표현하는 차트 요소간의 거리 값.
                //대량의 차트 데이터를 출력 할 경우 각 컬럼마다 bullt을 표현하게 될 경우,
                //겹쳐저서 bullt이 표현되는 문제, 각 컬럼마다 bullt을 표현 하기에 느려짐 문제 등이 있다.
                //이를 해결하기위해 minBulletDistance 속성값을 설정 하게 되면,
                //차트 요소간의 거리가 minBulletDistance에 입력된 값(10인경우 10px) 만큼 떨어져
                //있어야 bullt을 그리게 된다.(컬럼과 컬럼 사이의 거리가 10px 이상일때만 bullt을 그리게됨)
                minBulletDistance : { type : "int", defaultValue : 0 },


                //차트 막대의 x축 시작 지점.
                //값이 작아질수록 막대를 왼쪽으로 이동하여 그린다.
                //값이 커질수록 막대를 오른쪽으로 이동하여 그린다.
                openLocation : { type : "float", defaultValue : 0.5 },


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
                valueShow : { type : "u4a.charts.am5.ValueShowType" }

            },
    
            aggregations : {

                // am5 차트의 막대 및 꺾은선에 표시점을 출력하는 aggregation.  
                // 차트의 막대 및 꺾은선에 삼각형, 사각형, 원, 텍스트 등을 표시하려면,  
                // bullet aggregation에 UI 요소를 추가하여 표현할 수 있다.
                bullet : { type : "u4a.charts.am5.Bullet", multiple : true, singularName: "bullet" }
            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Series.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Series.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */
        

        /*************************************************************
         * @event - 예외처리 필드명 얻기.
         *************************************************************/
        _getExcepSettingName : function(propName, oChart){

            // //컬럼의 부모 UI(chart) 정보 얻기.
            // var _oParent = this.getParent();

            //am5 차트가 구성되지 않은경우 exit.
            if(typeof oChart?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oMeta = oChart.getMetadata();

            if(typeof _oMeta === "undefined"){
                return;
            }

            //예외처리 대상 프로퍼티 정보.
            let _aExcepProp = [
                {"propName":"valueField", "yFieldName":"valueYField", "xFieldName":"valueXField"}, 
                {"propName":"openValueField", "yFieldName":"openValueYField", "xFieldName":"openValueXField"}, 
                {"propName":"highValueField", "yFieldName":"highValueYField", "xFieldName":"highValueXField"}, 
                {"propName":"lowValueField", "yFieldName":"lowValueYField", "xFieldName":"lowValueXField"}, 
                {"propName":"location", "yFieldName":"locationY", "xFieldName":"locationX"}, 
                {"propName":"openLocation", "yFieldName":"openLocationY", "xFieldName":"openLocationX"}, 
                {"propName":"valueShow", "yFieldName":"valueYShow", "xFieldName":"valueXShow"}
            ];

            //예외처리 대상 프로퍼티 정보 여부 확인.
            let _sExcepProp = _aExcepProp.find( item => item.propName === propName );

            if(typeof _sExcepProp === "undefined"){
                return;
            }
            
            //radar 차트에 추가된 UI인경우.
            if(_oMeta.getName() === "u4a.charts.am5.RadarChart"){
                
                //y축 필드명의 값을 return 처리.
                return _sExcepProp["yFieldName"];

            }


            //차트 가로/세로 출력 값에 따른 컬럼 필드명 구성.
            var _excepFieldName = oChart.getRotate() === true ? "xFieldName" : "yFieldName";


            //예외처리 대상 프로퍼티건인경우.
            return _sExcepProp[_excepFieldName];            


        },
        


        /*************************************************************
         * @function - XYSeries의 categoryField 갱신 처리.
         * CategoryAxis에서 categoryField를 변경할 경우, 
         * columnSeries, lineSeries의 category필드를 같이 변경 처리해야함.
         *************************************************************/
        _updateCategoryField : function(categoryField){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent === "undefined"){
                return;
            }

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
            switch (_oParent.getRotate()) {
                case true:
                    //차트 가로 출력건인경우.
                    this._oChart.oChartInstance.set("categoryYField", categoryField);
                    break;
            
                default:
                    //차트 세로 출력건인경우.
                    this._oChart.oChartInstance.set("categoryXField", categoryField);
                    break;
            }


            //XYSeries의 setting 값 변경 이후 화면 갱신 처리.
            this._updateSeries();


        },


        /*************************************************************
         * @function - 차트의 값 출력에 해당하는 데이터 정보 수집.
         * (value, openValue, lowValue, highValue)
         *************************************************************/
        _getChartValuesData : function(){

            let _sChartData = {};

            _sChartData.value = this.getValue();

            //차트(컬럼, 라인)의 출력 값정보가 없다면 null처리.
            if(typeof _sChartData.value === "undefined"){
                _sChartData.value = null;
            }


            _sChartData.openValue = this.getOpenValue();

            //차트(컬럼, 라인)의 from 출력 값정보가 없다면 null처리.
            if(typeof _sChartData.openValue === "undefined"){
                _sChartData.openValue = null;
            }


            _sChartData.lowValue = this.getLowValue();

            //차트(컬럼, 라인)의 low출력 값정보가 없다면 null처리.
            if(typeof _sChartData.lowValue === "undefined"){
                _sChartData.lowValue = null;
            }


            _sChartData.highValue = this.getHighValue();

            //차트(컬럼, 라인)의 high출력 값정보가 없다면 null처리.
            if(typeof _sChartData.highValue === "undefined"){
                _sChartData.highValue = null;
            }

            return _sChartData;

        },
        

        /*************************************************************
         * @function - lineSeries에 bullet 정보 추가 처리.
         *************************************************************/
        _getChartBullet : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _aBullet = this.getBullet();

            if(_aBullet.length === 0){
                return;
            }

            for (let i = 0, l = _aBullet.length; i < l; i++) {
                
                let _oBullet = _aBullet[i];

                
                //차트 bullet 생성 처리.
                createBullet(this, _oBullet);

                                
            }

        },


        /*************************************************************
         * @function - value 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setValue : function(propValue){

            this._setProperty("value", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },


        /*************************************************************
         * @function - openValue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setOpenValue : function(propValue){

            this._setProperty("openValue", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - highValue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHighValue : function(propValue){

            this._setProperty("highValue", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - lowValue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLowValue : function(propValue){

            this._setProperty("lowValue", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - location 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLocation : function(propValue){

            this._setProperty("location", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();

        },


        /*************************************************************
         * @function - minBulletDistance 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinBulletDistance : function(propValue){

            let _propValue = this._setProperty("minBulletDistance", propValue);


            //차트 Instance에 minBulletDistance settings 값 반영 처리.
            this._setChartSettings("minBulletDistance", _propValue);

        },


        /*************************************************************
         * @function - openLocation 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setOpenLocation : function(propValue){

            let _propValue = this._setProperty("openLocation", propValue);


            //예외처리 필드명 정보 얻기.
            let _fieldName = this._getExcepSettingName("openLocation");

            if(typeof _fieldName === "undefined"){
                return;
            }


            //차트 Instance에 openLocation settings 값 반영 처리.
            this._setChartSettings(_fieldName, _propValue);


            //XYSeries의 setting 값 변경 이후 화면 갱신 처리.
            this._updateSeries();

        },


        /*************************************************************
         * @function - stacked 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStacked : function(propValue){

            let _propValue = this._setProperty("stacked", propValue);


            //차트 Instance에 stacked settings 값 반영 처리.
            this._setChartSettings("stacked", _propValue);

        },


        /*************************************************************
         * @function - valueShow 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setValueShow : function(propValue){

            let _propValue = this._setProperty("valueShow", propValue);


            //예외처리 필드명 정보 얻기.
            let _fieldName = this._getExcepSettingName("valueShow");

            if(typeof _fieldName === "undefined"){
                return;
            }


            //차트 Instance에 valueShow settings 값 반영 처리.
            this._setChartSettings(_fieldName, _propValue);


            //XYSeries의 setting 값 변경 이후 화면 갱신 처리.
            this._updateSeries();

        }
    });

    return _oXYSeries;
    
});