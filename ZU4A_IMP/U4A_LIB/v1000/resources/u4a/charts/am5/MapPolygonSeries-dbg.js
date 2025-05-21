sap.ui.define("u4a.charts.am5.MapPolygonSeries", [
    "u4a/charts/am5/MapSeries"
    
],function(MapSeries){
    "use strict";


    //map 차트에 출력할 맵 json 정보.
    u4a.charts.am5.GeoJSONType = {
        southKoreaHigh : "southKoreaHigh",
        southKoreaLow : "southKoreaLow",
        canadaHigh : "canadaHigh",
        canadaLow : "canadaLow",
        usaHigh : "usaHigh",
        usaLow : "usaLow",
        worldHigh : "worldHigh",
        worldLow : "worldLow",
        chinaHigh : "chinaHigh",
        chinaLow : "chinaLow"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.GeoJSONType", u4a.charts.am5.GeoJSONType);


    
    let _oMapPolygonSeries = MapSeries.extend("u4a.charts.am5.MapPolygonSeries", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //제외할 지역 정보.
                //해당 속성 정보를 통해 출력된 지도에서 지역을 제외시킬 수 있다.
                //(South Korea 맵을 출력한뒤 exclude에 KR-11을 설정하면 서울 지역이 제외되어 맵이 출력된다.
                //South Korea 맵을 출력한뒤 exclude에 ["KR-11", "KR-49"] 을 설정하면 서울, 제주 지역이 
                //제외되어 맵이 출력된다.)
                exclude : { type : "string[]", defaultValue: []},


                //map 차트에 출력할 맵 json 정보.
                //default 값인 worldLow인경우 세계 지도를 맵에 출력하게 된다.
                //southKoreaLow을 설정하게 될 경우 대한민국 맵이 출력하게 된다.
                //맵 json 유형이 Low, High 로 나뉘어 지며(southKoreaLow, southKoreaHigh)
                //Low는 저용량의 맵파일,
                //High는 고용량의 맵파일 이다.
                geoJSONType : { type : "u4a.charts.am5.GeoJSONType", defaultValue : "worldLow"},


                //포함할 지역 정보.
                //해당 속성 정보를 통해 출력된 지도에서 지역을 포함시킬 수 있다.
                //해당 속성 정보를 사용하게 되면 출력된 지도에서 해당 지역만 출력되게 된다.
                //(South Korea 맵을 출력한뒤 include에 KR-11을 설정하면 서울 지역만 화면에 출력된다.
                //South Korea 맵을 출력한뒤 include에 ["KR-11", "KR-49"] 을 설정하면
                // 서울, 제주 지역만 화면에 출력된다.)
                include : { type : "string[]", defaultValue: undefined}

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
            
            MapSeries.prototype.init.apply(this, arguments);

            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "geoJSONType",
            ];
    
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            MapSeries.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */



        /*************************************************************
         * @function - AM5 맵 데이터를 구성하기 위한 json 정보 얻기.
         *************************************************************/
        _getGeodataJSON : function(){

            return new Promise(async function(resolve){

                var _geoJSONType = this.getGeoJSONType();

                //맵 출력 json url 정보 구성
                let _url = sap.ui.require.toUrl("am5Chart") + `/geodata/json/${_geoJSONType}.json`;

                // am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/" + currentMap + ".json", chart).then(function (result) {

                try {

                    var _sRes = await am5.net.load(_url);                    
                } catch (error) {
                    //치명적 오류 처리.(throw 오류 처리.)
                    //하위 로직을 진행하지 못하도록 resolve 처리 안함.
                    return;
                    
                }


                try {
                    //검색한 맵 정보를 json parse 처리.
                    return resolve(am5.JSONParser.parse(_sRes.response));
                    
                } catch (error) {
                    //치명적 오류 처리.(throw 오류 처리.)
                    //하위 로직을 진행하지 못하도록 resolve 처리 안함.
                    return;
                }

            }.bind(this));

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
            
            //국가명.(South Korea)
            _sParams.CNTRY = _sDataItem?.dataContext?.CNTRY;

            //지역 유형.(Special City, Province)
            _sParams.TYPE = _sDataItem?.dataContext?.TYPE;

            //선택 지역 id(KR-11 : Seoul)
            _sParams.areaId = _sDataItem?.dataContext?.id;

            //선택 지역 명.(Seoul)
            _sParams.name = _sDataItem?.dataContext?.name;

            
            _sParams.item = this;
            
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
                        
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);

        },


        /*************************************************************
         * @function - AM5 MapPolygonSeries Instance 생성 처리.
         *   AM5의 MapChart에 추가되는 맵 Series 정보 생성.
         *************************************************************/
        _createMapPolygonSeries : function(oChart){

            return new Promise(async function(resolve){

                if(typeof oChart?._oChart?.oRoot === "undefined"){
                    return resolve();
                }


                //pieSeries의 속성정보 얻기.
                let _sChartProp = this._getChartProperies(this._aExcludeProp);


                //AM5 맵 데이터를 구성하기 위한 json 정보 얻기.
                _sChartProp.geoJSON = await this._getGeodataJSON();


                //am5 차트의 pieSeries 생성.
                this._oChart.oChartInstance = am5map.MapPolygonSeries.new(oChart._oChart.oRoot, _sChartProp);


                //click 이벤트 등록.
                this._oChart.oChartInstance.mapPolygons.template.events.on('click', function (oEvent) {
                    
                    this._fireEvent(oEvent);

                }.bind(this));


                //dblclick 이벤트 등록.
                this._oChart.oChartInstance.mapPolygons.template.events.on("dblclick", function(oEvent) {
                    
                    this._fireEvent(oEvent);

                }.bind(this));


                //rightclick 이벤트 등록.
                this._oChart.oChartInstance.mapPolygons.template.events.on("rightclick", function(oEvent) {
                    
                    this._fireEvent(oEvent);

                }.bind(this));


                //현재 columnSeries UI에 am5 root 정보 매핑.
                this._oChart.oRoot = oChart._oChart.oRoot;


                return resolve(this._oChart.oChartInstance);

                
            }.bind(this));

        },


        /*************************************************************
         * @function - geoJSONType 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setGeoJSONType : function(propValue){

            //입력한 프로퍼티 정보 UI에 구성 처리.
            this._setProperty("geoJSONType", propValue);


            //차트 UI 정보가 구성되지 않은경우 EXIT.
            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //AM5 맵 데이터를 구성하기 위한 json 정보 얻기.
            this._getGeodataJSON().then(function(geoJsonData){

                //map 정보 변경 처리.
                this._oChart.oChartInstance.set("geoJSON", geoJsonData);

                let _oParent = this.getParent();

                if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                    return;
                }

                //zoom 레벨 초기화 처리.
                //(맵 확대 -> map정보 변경 -> 맵을 다시 확대 처리시
                //이전 zoom 상태때문에 zoom이 정상동작 처리 되지 않기에 zoom 초기화 처리)
                _oParent._oChart.oChartInstance.set("zoomLevel", 1);

            }.bind(this));

        },


        /*************************************************************
         * @function - exclude 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setExclude : function(propValue){

            let _propValue = this._setProperty("exclude", propValue);


            //차트 Instance에 exclude settings 값 반영 처리.
            this._setChartSettings("exclude", _propValue);

        },


        /*************************************************************
         * @function - include 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInclude : function(propValue){

            let _propValue = this._setProperty("include", propValue);


            //차트 Instance에 include settings 값 반영 처리.
            this._setChartSettings("include", _propValue);

        }
        

    });

    return _oMapPolygonSeries;
    
});