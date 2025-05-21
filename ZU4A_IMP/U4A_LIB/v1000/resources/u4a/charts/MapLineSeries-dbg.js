sap.ui.define("u4a.charts.am5.MapLineSeries", [
    "u4a/charts/am5/MapSeries"
    
],function(MapSeries){
    "use strict";



    /*************************************************************
     * @function - MapPointSeries 의 속성정보 얻기.
     *************************************************************/
    function getChartProperies(oUi, oChart){

        let _sChartProp = {};
        
        //am5 차트가 구성되지 않은경우 exit.
        if(typeof oChart?._oChart?.oChartInstance === "undefined"){
            return _sChartProp;
        }

        
        let _oMeta = oUi.getMetadata();

        if(typeof _oMeta === "undefined"){
            return _sChartProp;
        }

        let _oProperties = _oMeta.getAllProperties();

        if(typeof _oProperties === "undefined"){
            return _sChartProp;
        }

        //프로퍼티에 설정된 값을 차트 속성 정보로 수집 처리.
        for (const key in _oProperties) {
            
            let _oProp = _oProperties[key];

            //columnSeries에 바인딩 된 path 정보 얻기.
            var _path = oUi.getBindingPath(key);

            //바인딩 처리되지 않은건은 수집 생략.
            if(typeof _path !== "undefined"){

                if(oUi._aBindProperty.findIndex( item => item.propName === key) === -1){
                    continue;
                }

                _sChartProp[key] = _path;
                continue;
            }


            let _val = oUi.getProperty(key);

            //프로퍼티가 default 값과 같은건인경우 수집 생략 처리.
            if(_val === _oProp.getDefaultValue()){
                continue;
            }

            //입력값이 array인경우 빈 array인경우 수집 생략 처리.
            if(Array.isArray(_val) === true && _val.length === 0){
                continue;
            }

            //처리 대상 프로퍼티가 visible인경우.
            //프로퍼티명 : 값 형식으로 차트 속성 정보를 수집 처리.
            //(visible의 경우 sap.ui.core.Control 로 파생된 프로퍼티기에 예외로 수집)
            if(key === "visible"){
                //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
                _sChartProp[key] = oUi._convAM5Property(key, _val);
                continue;    
            }


            var _oParent = _oProp?._oParent || undefined;

            if(typeof _oParent?.getName === "undefined"){
                continue;
            }

            //프로퍼티가 sap.ui.core.Control건인경우 수집 생략.
            if(_oParent.getName() === "sap.ui.core.Control"){
                continue;
            }

            //프로퍼티명 : 값 형식으로 차트 속성 정보를 수집 처리.
            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            _sChartProp[key] = oUi._convAM5Property(key, _val);
        }

        
        return _sChartProp;


    }


    
    let _oMapLineSeries = MapSeries.extend("u4a.charts.am5.MapLineSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //포인터에 출력된 차트 요소의 크기를 확대/축소시 자동으로 크기를 조절할지 여부.
                //true로 설정할 경우 확대시 차트 요소의 크기도 같이 커지게 된다.
                //축소시 차트 요소의 크기도 같이 축소된다.
                //false로 설정할 경우 확대/축소를 하더라도 차트요소에 설정 되어있는 크기가 변하지 않는다.
                autoScale : { type : "boolean", defaultValue: false },


                //위도 바인딩 필드.
                //GT_OTAB:[{F01:37.566535, F02:126.9779692},..]와 같이 데이터를 구성했을때.
                //latitudeField에 GT_OTAB-F01 필드를 바인딩을 설정하여 포인터 출력을 위한
                //위도 값을 설정할 수 있다.
                //해당 속성은 위도(latitudeField), 경도(longitudeField)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                latitudeFrom : { type : "float" },

                //위도 바인딩 필드.
                //GT_OTAB:[{F01:37.566535, F02:126.9779692},..]와 같이 데이터를 구성했을때.
                //latitudeField에 GT_OTAB-F01 필드를 바인딩을 설정하여 포인터 출력을 위한
                //위도 값을 설정할 수 있다.
                //해당 속성은 위도(latitudeField), 경도(longitudeField)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                latitudeTo : { type : "float" },


                //경도 바인딩 필드.
                //GT_OTAB:[{F01:37.566535, F02:126.9779692},..]와 같이 데이터를 구성했을때.
                //longitudeField에 GT_OTAB-F02 필드를 바인딩을 설정하여 포인터 출력을 위한
                //경도 값을 설정할 수 있다.
                //해당 속성은 위도(latitudeField), 경도(longitudeField)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                longitudeFrom : { type : "float" },

                //경도 바인딩 필드.
                //GT_OTAB:[{F01:37.566535, F02:126.9779692},..]와 같이 데이터를 구성했을때.
                //longitudeField에 GT_OTAB-F02 필드를 바인딩을 설정하여 포인터 출력을 위한
                //경도 값을 설정할 수 있다.
                //해당 속성은 위도(latitudeField), 경도(longitudeField)를 같이 설정해야 동작한다.
                //(서울의 위도 경도값 - 위도: 37.566535, 경도:126.9779692)
                longitudeTo : { type : "float" }

            }

        }, /* end of metadata */
    
        init : function(){
            
            MapSeries.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            MapSeries.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */



        /*************************************************************
         * @function - AM5 MapPointSeries Instance 생성 처리.
         *   AM5의 MapChart에 포인터 정보를 출력하기 위한 정보 생성.
         *************************************************************/
        _createMapPointSeries : function(oChart){

            if(typeof oChart?._oChart?.oRoot === "undefined"){
                return;
            }

            //pieSeries의 속성정보 얻기.
            let _sChartProp = getChartProperies(this, oChart);


            //am5 차트의 pieSeries 생성.
            this._oChart.oChartInstance = am5map.MapPointSeries.new(oChart._oChart.oRoot, _sChartProp);


            //현재 columnSeries UI에 am5 root 정보 매핑.
            this._oChart.oRoot = oChart._oChart.oRoot;


            return this._oChart.oChartInstance;
                
        },


        getChartData : function(){

        },


        /*************************************************************
         * @function - autoScale 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setAutoScale : function(propValue){

            let _propValue = this._setProperty("autoScale", propValue);

            
            //차트 Instance에 autoScale settings 값 반영 처리.
            this._setChartSettings("autoScale", _propValue);

        }


    });

    return _oMapLineSeries;
    
});