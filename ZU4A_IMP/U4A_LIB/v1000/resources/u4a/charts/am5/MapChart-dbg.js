sap.ui.define("u4a.charts.am5.MapChart", [
    "u4a/charts/am5/SerialChart",
    "sap/base/util/uid",
    "u4a/charts/am5/am5Loader",
    "u4a/charts/am5/am5mapLoader"
], function(SerialChart, uid){
    "use strict";


    //맵 차트의 D&D로 이동시 X축에 대한 효과 처리.
    u4a.charts.am5.MapChartPanXType = {
        //움직이지 않음.
        none : "none",

        //맵 회전 처리됨.
        //(지구본 형태, 지도 형태 둘다 회전됨)
        rotateX : "rotateX",

        //좌, 우 이동 처리.
        translateX : "translateX"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.MapChartPanXType", u4a.charts.am5.MapChartPanXType);


    u4a.charts.am5.MapChartPanYType = {
        none : "none",

        rotateY : "rotateY",

        translateY : "translateY"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.MapChartPanYType", u4a.charts.am5.MapChartPanYType);


    
    u4a.charts.am5.MapChartWheelType = {
        none : "none",
        zoom : "zoom",
        rotateX : "rotateX",
        rotateY : "rotateY"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.MapChartWheelType", u4a.charts.am5.MapChartWheelType);


    //맵차트를 출력하는 형태.
    u4a.charts.am5.ProjectionType = {
        geoEqualEarth : "geoEqualEarth",
        geoEquirectangular : "geoEquirectangular",
        geoMercator : "geoMercator",
        geoNaturalEarth1 : "geoNaturalEarth1",
        geoOrthographic : "geoOrthographic"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ProjectionType", u4a.charts.am5.ProjectionType);


    /*************************************************************
     * @function - 라이브러리 로드처리 대기 Promise.
     *************************************************************/
    function _waitLoadLibrary(){
        
        return new Promise((resolve)=>{
            
            function _isloadLibrary(libraryName){
                
                if(typeof window["am5"] !== "undefined" && 
                    typeof window["am5map"] !== "undefined"){
                    
                    return resolve();
                }
                
                setTimeout(function() {
                    _isloadLibrary(libraryName);
                }, 100);
            
            }
            
            _isloadLibrary();
        
        });
        
    }

    
    /*************************************************************
     * @function - 차트 구성 처리.
     *************************************************************/
    function _drawChart(oUi){
        
        return new Promise(function(resolve){
            am5.ready(async function() {

                //라이선스가 등록되지 않은경우 등록 처리.
                if(am5.registry.licenses.findIndex( item => item === atob(oUi.mapLicenceKey) ) === -1){
                    am5.addLicense(atob(oUi.mapLicenceKey));
                }
                
                let _oDom = oUi.getDomRef() || undefined;
                
                if(typeof _oDom === "undefined"){
                    console.error("차트 dom 없음!!!");
                    return resolve();
                }

                if(am5.registry.rootElements.findIndex( item => item?.dom === _oDom) !== -1){
                    return resolve();
                }

                
                let _oRoot = am5.Root.new(_oDom);


                //UI5 테마에 따른 차트 테마 색상 정보 구성.
                oUi.setChartTheme(_oRoot);


                //am5 차트 구성 처리.
                await oUi._drawChart(_oRoot);


                await oUi._oChart.oChartInstance.appear();

                resolve();
                
            });
        
        });
        
    }


    /*************************************************************
     * @function - AM5 MapPolygonSeries Instance 생성 처리.
     * AM5의 MapChart에 추가되는 맵 Series 정보 생성.
     *************************************************************/
    function createMapPolygonSeries(oUi){

        return new Promise(async function(resolve){

            //legend 정보 얻기.
            let _oMapPolygon = oUi.getMapPolygonSeries() || undefined;

            if(typeof _oMapPolygon?._createMapPolygonSeries === "undefined"){
                return resolve();
            }

            //AM5 MapPolygonSeries Instance 생성 처리.
            let _oAM5MapPolygon = await _oMapPolygon._createMapPolygonSeries(oUi);


            oUi._oChart.oChartInstance.series.push(_oAM5MapPolygon);


            _oAM5MapPolygon.data.setAll([]);

            return resolve();

        });

    }



    /*************************************************************
     * @function - AM5 MapPointSeries 생성 처리.
     *************************************************************/
    function createMapPointSeries(oUi){
    }


    /*************************************************************
     * @function - AM5 Legend 생성 처리.
     *************************************************************/
    function createLegend(oUi){

        //legend 정보 얻기.
        let _oLegend = oUi.getLegend() || undefined;

        if(typeof _oLegend?._createLegend === "undefined"){
            return;
        }


        //am5 차트의 Legend 생성 처리.
        let _oAM5Legend = _oLegend._createLegend();

        if(typeof _oAM5Legend === "undefined"){
            return;
        }


        oUi._oChart.oChartInstance.children.push(_oAM5Legend);
        

        _oAM5Legend.data.setAll(oUi._oChart.oChartInstance.series.values);


    }




    /*************************************************************
     * @function - onAfterRendering 에서 차트 구성 처리.
     *************************************************************/
    function onAfterRenderingDrawChart(oUi){

        return new Promise(async function(resolve){


            //차트 라이브러리 로드 대기 처리.
            await _waitLoadLibrary();


            //차트 그리기.
            await _drawChart(oUi);
            
            
            //차트가 화면에 출력된 이후의 이벤트 호출 처리.
            oUi.fireAfterRenderingFinish();

            resolve();

        });

    }



    let _oMapChart = SerialChart.extend("u4a.charts.am5.MapChart", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트를 확대/축소 할때의 애니메이션 시간.
                //1000 입력시 1초동안 확대 축소 처리.
                animationDuration : { type : "int", defaultValue: 0 },


                //맵차트를 출력하는 형태.
                //geoEqualEarth
                //geoEquirectangular
                //geoMercator
                //geoNaturalEarth1
                //geoOrthographic
                projection : { type : "u4a.charts.am5.ProjectionType", defaultValue: "geoMercator" },

                
                //홈으로 이동처리할 경도 값.
                //MAP 차트의 goHome 메소드 수행시 homeGeoPointLongitude, homeGeoPointLatitude 
                //속성값에 설정된 경도, 위도 위치로 이동 처리한다.
                homeGeoPointLongitude : { type : "float", defaultValue: 0 },

                //홈으로 이동처리할 위도 값.
                //MAP 차트의 goHome 메소드 수행시 homeGeoPointLongitude, homeGeoPointLatitude 
                //속성값에 설정된 경도, 위도 위치로 이동 처리한다.
                homeGeoPointLatitude : { type : "float", defaultValue: 0 },

                //홈으로 이동 처리할 시 확대 처리 값.
                //MAP 차트의 goHome 메소드 수행시  homeGeoPointLongitude, homeGeoPointLatitude 
                //속성값에 설정된 경도, 위도로 이동 하며 확대할 값.
                homeZoomLevel : { type : "float", defaultValue: 0 },


                //맵을 드래그 했을때 현재 보여지는 화면에서 차트를 얼마나 영역 밖으로 보낼 수 있는지 값.
                // 0.2를 입력할 경우 출력된 차트의 20%가 화면 밖으로 나갈 수 있다.
                maxPanOut : { type : "float", defaultValue: 0 },


                //MAP 차트를 확대 할 수 있는 최대 크기.
                //마우스 휠을 통해 확대 할 경우 확대할 비율값.
                //1.5를 입력 한 경우 출력된 맵의 최대 확대 크기는 1.5배.
                maxZoomLevel : { type : "float", defaultValue: 0 },


                //MAP 차트를 축소 할 수 있는 최소 크기.
                //마우스 휠을 통해 축소 할 경우 축소할 비율값.
                //0.5를 입력 한 경우 출력된 맵의 최소 축소 크기는 0.5배.
                minZoomLevel : { type : "float", defaultValue: 0 },


                //차트의 데이터 출력 영역을 마우스 드래그로 좌, 우 이동 가능 여부.
                panX : { type : "u4a.charts.am5.MapChartPanXType", defaultValue: "translateX" },


                //차트의 데이터 출력 영역을 마우스 드래그로 상, 하 이동 가능 여부.
                panY : { type : "u4a.charts.am5.MapChartPanYType", defaultValue: "translateY" },


                //마우스 휠을 상, 하로 동작시 액션 처리 값.
                //(일반 마우스의 휠을 동작 시킬때 차트의 액션 처리)
                //zoomX : 차트 데이터 출력 영역 가로 확대.
                //zoomY : 차트 데이터 출력 영역 세로 확대.
                //zoomXY : 차트 데이터 출력 영역 가로, 세로 확대.
                wheelY : {type : "u4a.charts.am5.MapChartWheelType", defaultValue: "zoom"},


                //마우스 휠을 좌, 우로 동작시 액션 처리 값.
                //(특정 마우스(로지텍 mx마스터)의 경우 좌우 휠 기능이 있다,
                //좌, 우 휠을 동작 시킬때 차트의 액션 처리)
                //zoomX : 차트 데이터 출력 영역 가로 확대.
                //zoomY : 차트 데이터 출력 영역 세로 확대.
                //zoomXY : 차트 데이터 출력 영역 가로, 세로 확대.
                wheelX : {type : "u4a.charts.am5.MapChartWheelType", defaultValue: "zoom"}


            },

            aggregations : {

                //맵을 표현하기 위한 정보.
                mapPolygonSeries : { type : "u4a.charts.am5.MapPolygonSeries", multiple : false, singularName: "mapPolygonSeries" },


                //맵에 라인을 표현하기 위한 정보.
                mapLineSeries : { type : "u4a.charts.am5.MapLineSeries", multiple : true, singularName: "mapLineSeries" },


                //맵에 원, 삼각형, 사각형 등을 표현하기 위한 정보.
                mapPointSeries : { type : "u4a.charts.am5.MapPointSeries", multiple : true, singularName: "mapPointSeries" },


                //삼각형, 사각형 등을 올리는 aggregation.
                marker : { type : "u4a.charts.am5.Marker", multiple : true, singularName: "marker" },


                //차트를 표현하기 위한 aggregation.
                chartContents : { type : "u4a.charts.am5.ChartContent", multiple : true, singularName: "chartContent" },


                //배경색 aggregation.
                background : { type : "u4a.charts.am5.Background", multiple : false, singularName: "background" },


                //범례 aggregation.
                legend : { type : "u4a.charts.am5.Legend", multiple : false, singularName: "legend" }


            },

            events : {
                afterRenderingFinish:{
                    visibility : "restricted",
                    deprecated : true

                },

                
                //차트 요소 클릭 이벤트.
                click : {},

                //차트 요소 더블클릭 이벤트.
                dblclick : {},

                //차트 요소 마우스 우클릭 이벤트.
                rightclick : {}
            }

        }, /* end of metadata */
        
        
        init : function(){

            SerialChart.prototype.init.apply(this, arguments);


            this._oChart.aChartContentData = [];

            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "visible",
                "width",
                "height",
                "rotate"
            ];

            
            //테마 변경 이벤트
            sap.ui.getCore().attachThemeChanged(function(){

                //UI5 테마에 따른 차트 테마 색상 정보 구성.
                this.setChartTheme(this._oChart.oRoot);

            }.bind(this));
            

        }, /* end of init */
        
        onBeforeRendering : function(oEvent){

            //am5 차트 제거 처리.
            this._removeChart();

        }, /* end of onBeforeRendering */


        renderer : function(oRm, oControl){
            
            oRm.openStart("div", oControl);
            oRm.class("u4aAM5MapChart");
            oRm.style("width", oControl.getWidth() || "auto");
            oRm.style("height", oControl.getHeight() || "100%");
            oRm.openEnd();
            oRm.close("div");

        }, /* end of renderer */

        
        onAfterRendering : function(oEvent){

            //U4A 비동기 처리 수집 ARRAY가 존재하지 않는경우.
            //(am5 차트, richtextEditor과 같이 onAfterRendering 이후에
            //UI 내부에서 사용하고 있는 다른 라이브러리를 통해 화면이 그려지는것을
            //기다리기 위해 promise를 수집하는 array).
            if(typeof window?.oU4A?.taskPromiseStack === "undefined"){

                //차트 구성 처리 후 exit.
                onAfterRenderingDrawChart(oEvent.srcControl);

                return;

            }


            //비동기로 chart를 구성한뒤 Promise.all에서 현재 UI의 비동기 처리 완료됨을
            //판단하기 위한 랜덤키 생성.
            let _ukey = uid();
            
            let _oProm = new Promise(async function(resolve){
                
                //onAfterRendering 에서 차트 구성 처리.
                await onAfterRenderingDrawChart(oEvent.srcControl);


                //구성한 랜덤키를 return 처리.
                resolve(_ukey);

            });
            
            _oProm.uKey = _ukey;
            
            
            oU4A.taskPromiseStack.push(_oProm);
            

        }, /* end of onAfterRendering */


        exit : function(){

            //am5 차트 제거 처리.
            this._removeChart();

            
        }, /* end of exit */


        /*************************************************************
         * @function - am5 차트 구성 처리.
         *************************************************************/
        _drawChart : function(root){

            return new Promise(async function(resolve){
            
                this._oChart.oRoot = root;

                
                //차트 속성정보 얻기.
                let _sChartProp = this._getChartProperies(this._aExcludeProp);


                _sChartProp.layout = this._oChart.oRoot.verticalLayout;


                var _projection =  this.getProjection();

                if(typeof _projection === "undefined"){
                    _projection = "geoMercator";
                }

                _sChartProp.projection = am5map[_projection]();


                // Create chart
                this._oChart.oChartInstance = this._oChart.oRoot.container.children.push(
                    am5map.MapChart.new(this._oChart.oRoot, _sChartProp)
                );
                
                //oChartInstance.goHome() 수행시 이동시 경도, 위도값 설정.
                this._homeGeoPoint();


                //배경색에 대한 처리.
                this._setBackGround();


                this._oChart.oChartInstance.events.on("click", function(oEvent) {
                    
                    //이벤트 발생시 UI5 컬럼 클릭 이벤트 FIRE 처리.
                    this._fireEvent(oEvent);

                }.bind(this));


                this._oChart.oChartInstance.events.on("dblclick", function(oEvent) {
                    
                    //이벤트 발생시 UI5 컬럼 더블클릭 이벤트 FIRE 처리.
                    this._fireEvent(oEvent);

                }.bind(this));


                this._oChart.oChartInstance.events.on("rightclick", function(oEvent) {

                    //이벤트 발생시 UI5 컬럼 우클릭 이벤트 FIRE 처리.
                    this._fireEvent(oEvent);

                }.bind(this));
                

                
                //AM5 MapPolygonSeries Instance 생성 처리.
                //AM5의 MapChart에 추가되는 맵 Series 정보 생성.
                await createMapPolygonSeries(this);


                //차트 데이터 구성 처리.
                this._getChartData();
                //(point, line)


                //point, line 생성 처리.

                //map에 표현할 차트 정보 구성 처리.
                await this._createChartContent();



                resolve();

                
            }.bind(this));


        },


        /*************************************************************
         * @event - 이벤트 fire 처리.
         *************************************************************/
        _fireEvent : function(oEvent){
                        
            if(typeof oEvent?.point === "undefined"){
                return;
            }

            if(typeof oEvent?.type === "undefined"){
                return;
            }

            let _eventType = oEvent.type;
            
            let _sPoint = oEvent.point;

            let _sParams = {};
                        
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
                        
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);

        },


        /*************************************************************
         * @function - am5 차트 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            //chart content에 출력할 데이터 구성 처리.
            this._getChartContentData();


        },


        /*************************************************************
         * @function - chart content에 출력할 데이터 구성 처리.
         *************************************************************/
        _getChartContentData : function(){
            
            this._oChart.aChartContentData = [];

            let _aChartContent = this.getChartContents();

            if(_aChartContent.length === 0){
                return;
            }

            for (let i = 0, l = _aChartContent.length; i < l; i++) {
                
                let _oChartContent = _aChartContent[i];

                this._oChart.aChartContentData.push(_oChartContent._getChartData());
                
            }

        },


        /*************************************************************
         * @function - chart content에 출력할 차트 생성 처리.
         *************************************************************/
        _createChartContent : async function(){

            //맵에 표현할 차트 content 정보가 존재하지 않는다면 exit.
            let _aChartContent = this.getChartContents();

            if(_aChartContent.length === 0){
                return;
            }

            //차트를 출력하기 위한 pointer 정보 생성 처리.
            this._oChart.oChartContent = am5map.MapPointSeries.new(this._oChart.oRoot, {
            });

            //map 차트에 pointer 추가.
            this._oChart.oChartInstance.series.push(this._oChart.oChartContent);


            //pointer에 데이터 매핑.
            this._oChart.oChartContent.data.setAll(this._oChart.aChartContentData);


            
            var _aContent = [];
            for (let i = 0, l = _aChartContent.length; i < l; i++) {
                
                let _oChartContent = _aChartContent[i];

                let _oChart = _oChartContent.getChart();

                if(typeof _oChart?._drawChart === "undefined"){
                    continue;
                }

                _aContent.push(await _oChart._drawChart(this._oChart.oRoot));

            }

            if(_aContent.length === 0){
                return;
            }

            var _cnt = 0;

            this._oChart.oChartContent.bullets.push(function(root){

                let _oChart = _aContent[_cnt];

                if(typeof _oChart === "undefined"){
                    return;
                }

                _cnt++;

                return am5.Bullet.new(this._oChart.oRoot, {
                    sprite: _oChart
                });



            }.bind(this));

        },


        /*************************************************************
         * @function - 차트 배경색 처리.
         *************************************************************/
        _setBackGround : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            //배경색 처리 해제.
            this._oChart.oChartInstance.set("background");


            //배경색 처리를 위한 UI 정보 얻기.
            let _oBackground = this.getBackground() || undefined;


            //배경색 처리 UI가 존재하지 않는경우 exit.
            if(typeof _oBackground?._createSprite === "undefined"){                
                return;
            }

            
            //am5의 background Instance 생성 처리.
            let _oSprite = _oBackground._createSprite();

            //생성된 UI 정보가 존재하지 않는경우 exit.
            if(typeof _oSprite === "undefined"){
                return;
            }

            //am5 차트의 배경색 처리.
            this._oChart.oChartInstance.set("background", _oSprite);


        },
        
        
        /*************************************************************
         * @function - am5 차트 제거 처리.
         *************************************************************/
        _removeChart : function(){

            if(typeof this?._oChart?.oRoot === "undefined"){
                return;
            }
    
            //차트 제거 처리.
            this._oChart.oRoot.dispose();
            

            //am5 차트정보 수집 object 초기화.
            this._oChart = {};            

        },

        
        /*************************************************************
         * @function - DOM style 설정.
         *************************************************************/
        _setDomStyle : function(styleName, propValue){
            
            let _oDom = this.getDomRef() || undefined;
            
            if(typeof _oDom === "undefined"){
                return;
            }
            
            _oDom.style[styleName] = propValue;
            
        },


        /*************************************************************
         * @function - oChartInstance.goHome() 수행시 이동시 경도, 위도값 설정.
         *************************************************************/
        _homeGeoPoint : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //홈으로 이동처리할 경도 값.
            var _longitude = this.getHomeGeoPointLongitude();


            //홈으로 이동처리할 위도 값.
            var _latitude = this.getHomeGeoPointLatitude();

            
            //oChartInstance.goHome() 수행시 이동할 경도, 위도값 매핑.
            this._oChart.oChartInstance.set('homeGeoPoint', {longitude:_longitude, latitude:_latitude});
            
        },


        /*************************************************************
         * @function - setParent function redefine.
         *      부모 UI 변경시 부모 Instance가 없는경우(부모로부터 현재 UI가 제거된경우)
         *      차트 Instance를 제거 처리
         *************************************************************/
        setParent: function(oParent){

            //기존 setParent function 수행.
            SerialChart.prototype.setParent.apply(this, arguments);

            //부모 Instance가 존재하지 않는경우 Chart 제거 처리.
            if(oParent === null){
                this._removeChart();
            }
           

        },


        /*************************************************************
         * @function - width 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWidth : function(propValue){

            let _propValue = this._setProperty("width", propValue);


            //chart의 대표 DOM에 width STYLE 처리.
            this._setDomStyle("width", _propValue);


            //am5 차트의 root Instance의 resize function 수행.
            //chart의 dom.style.height 값을 변경 할려 해당 function을 통해
            //크기를 재조정 해야함.(그렇지 않을경우 오류 발생.)
            this._chartRootResize();


        },


        /*************************************************************
         * @function - height 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHeight : function(propValue){

            let _propValue = this._setProperty("height", propValue);


            //chart의 대표 DOM에 height STYLE 처리.
            this._setDomStyle("height", _propValue);


            //am5 차트의 root Instance의 resize function 수행.
            //chart의 dom.style.height 값을 변경 할려 해당 function을 통해
            //크기를 재조정 해야함.(그렇지 않을경우 오류 발생.)
            this._chartRootResize();


        },
        

        /*************************************************************
         * @function - animationDuration 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setAnimationDuration : function(propValue){

            let _propValue = this._setProperty("animationDuration", propValue);


            //차트 Instance에 animationDuration settings 값 반영 처리.
            this._setChartSettings("animationDuration", _propValue);

        },


        /*************************************************************
         * @function - projection 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setProjection : function(propValue){

            let _propValue = this._setProperty("projection", propValue);


            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            //oChartInstance.goHome() 수행시 이동할 경도, 위도값 매핑.
            this._oChart.oChartInstance.set('projection', am5map[_propValue]());

        },


        /*************************************************************
         * @function - homeGeoPointLongitude 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHomeGeoPointLongitude : function(propValue){

            this._setProperty("homeGeoPointLongitude", propValue);


            //oChartInstance.goHome() 수행시 이동시 경도, 위도값 설정.
            this._homeGeoPoint();

        },


        /*************************************************************
         * @function - homeGeoPointLatitude 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHomeGeoPointLatitude : function(propValue){

            this._setProperty("homeGeoPointLatitude", propValue);


            //oChartInstance.goHome() 수행시 이동시 경도, 위도값 설정.
            this._homeGeoPoint();

        },


        /*************************************************************
         * @function - homeZoomLevel 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHomeZoomLevel : function(propValue){

            let _propValue = this._setProperty("homeZoomLevel", propValue);


            //차트 Instance에 homeZoomLevel settings 값 반영 처리.
            this._setChartSettings("homeZoomLevel", _propValue);

        },


        /*************************************************************
         * @function - maxPanOut 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxPanOut : function(propValue){

            let _propValue = this._setProperty("maxPanOut", propValue);


            //차트 Instance에 maxPanOut settings 값 반영 처리.
            this._setChartSettings("maxPanOut", _propValue);

        },


        /*************************************************************
         * @function - maxZoomLevel 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxZoomLevel : function(propValue){

            let _propValue = this._setProperty("maxZoomLevel", propValue);


            //차트 Instance에 maxZoomLevel settings 값 반영 처리.
            this._setChartSettings("maxZoomLevel", _propValue);

        },


        /*************************************************************
         * @function - minZoomLevel 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinZoomLevel : function(propValue){

            let _propValue = this._setProperty("minZoomLevel", propValue);


            //차트 Instance에 minZoomLevel settings 값 반영 처리.
            this._setChartSettings("minZoomLevel", _propValue);

        },


        /*************************************************************
         * @function - panX 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPanX : function(propValue){

            let _propValue = this._setProperty("panX", propValue);


            //차트 Instance에 panX settings 값 반영 처리.
            this._setChartSettings("panX", _propValue);

        },


        /*************************************************************
         * @function - panY 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPanY : function(propValue){

            let _propValue = this._setProperty("panY", propValue);


            //차트 Instance에 panY settings 값 반영 처리.
            this._setChartSettings("panY", _propValue);

        },


        /*************************************************************
         * @function - wheelY 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWheelY : function(propValue){

            let _propValue = this._setProperty("wheelY", propValue);


            //차트 Instance에 wheelY settings 값 반영 처리.
            this._setChartSettings("wheelY", _propValue);

        },


        /*************************************************************
         * @function - wheelX 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWheelX : function(propValue){

            let _propValue = this._setProperty("wheelX", propValue);


            //차트 Instance에 wheelX settings 값 반영 처리.
            this._setChartSettings("wheelX", _propValue);

        },

        
        /*************************************************************
         * @function - legend UI 추가 function 재정의.
         *************************************************************/
        setLegend : function(oUi){

            this.setAggregation("legend", oUi, true);
            

            //차트 Legend 구성 처리.
            createLegend(this);
            
        },


        /*************************************************************
         * @function - background UI 추가 function 재정의.
         *************************************************************/
        setBackground : function(oUi){

            this.setAggregation("background", oUi, true);

            //배경색에 대한 처리.
            this._setBackGround();

        }
        
        
    });

    return _oMapChart;

});