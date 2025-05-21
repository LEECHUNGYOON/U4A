sap.ui.define("u4a.charts.am5.RadarChart", [
    "u4a/charts/am5/SerialChart",
    "sap/base/util/uid",
    "u4a/charts/am5/am5Loader",
    "u4a/charts/am5/am5xyLoader",
    "u4a/charts/am5/am5radarLoader"
], function(SerialChart, uid){
    "use strict";
    
    //xy 차트 마우스 휠 동작시 처리 유형.
    u4a.charts.am5.WheelType = {
        //X축으로 확대 처리.
        zoomX : "zoomX",

        //Y축으로 확대 처리.
        zoomY : "zoomY",

        //XY축으로 확대 처리.
        zoomXY : "zoomXY",

        //X축으로 이동 처리.
        //(마우스 D&D를 통해 차트를 X축으로 이동)
        panX : "panX",

        //Y축으로 이동 처리.
        //(마우스 D&D를 통해 차트를 Y축으로 이동)
        panY : "panY",

        //X, Y축으로 이동 처리.
        //(마우스 D&D를 통해 차트를 X, Y축으로 이동)
        panXY : "panXY",

        //이동 및 확대 처리를 하지 않음.
        none : "none"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.WheelType", u4a.charts.am5.WheelType);


    //인접한 차트 속성에 대한 툴팁 표현 거리 계산 기준 유형.
    u4a.charts.am5.MaxTooltipDistanceType = {
        //x, y축 둘다 판단.
        xy : "xy",

        //x축 만 판단.
        x : "x",

        //y축 만 판단.
        y : "y"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.MaxTooltipDistanceType", u4a.charts.am5.MaxTooltipDistanceType);


    //X축 스크롤바 위치.
    u4a.charts.am5.ScrollbarXPosition = {
        //X축 스크롤바가 차트 상단에 위치.
        top : "top",

        //X축 스크롤바가 차트 하단에 위치.
        bottom : "bottom"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ScrollbarXPosition", u4a.charts.am5.ScrollbarXPosition);


    //Y축 스크롤바 위치.
    u4a.charts.am5.ScrollbarYPosition = {
        //Y축 스크롤바가 차트 왼쪽에 위치.
        left : "left",

        //Y축 스크롤바가 차트 오른쪽에 위치.
        right : "right"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ScrollbarYPosition", u4a.charts.am5.ScrollbarYPosition);


    /*************************************************************
     * @function - 라이브러리 로드처리 대기 Promise.
     *************************************************************/
    function _waitLoadLibrary(){
        
        return new Promise((resolve)=>{
            
            function _isloadLibrary(libraryName){
                
                if(typeof window["am5"] !== "undefined" && 
                    typeof window["am5radar"] !== "undefined" &&
                    typeof window["am5xy"] !== "undefined" ){
                    
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
     * @function - 차트 Y축 aixs 생성 처리.
     *************************************************************/
    function _createValueAxis(oChart, oValueAxis){
        
        if(typeof oChart === "undefined"){
            return;
        }
        
        if(typeof oValueAxis?._createValueAxis === "undefined"){
            return;
        }
        
        if(typeof oChart?._oChart?.oRoot === "undefined"){
            return;
        }
        
        if(typeof oChart?._oChart?.oChartInstance === "undefined"){
            return;
        }


        oValueAxis._oChart.oRoot = oChart._oChart.oRoot;

        
        //Y축 정보 구성
        let _oValueAxis = oValueAxis._createValueAxis(oChart);

        if(typeof _oValueAxis === "undefined"){
            return;
        }
        

        if(oChart.getRotate() === true){
            //xy차트에 X 축 정보 추가 처리.
            oChart._oChart.oChartInstance.xAxes.push(_oValueAxis);

            // _oValueAxis.set("syncWithAxis", oUi._oChart.oChartInstance.xAxes.getIndex(0));

            return;
        }

        //차트에 y축 정보 추가 처리.
        oChart._oChart.oChartInstance.yAxes.push(_oValueAxis);


        // _oValueAxis.set("syncWithAxis", oUi._oChart.oChartInstance.yAxes.getIndex(0));
                
        
    }
    
    
        
    /*************************************************************
     * @function - 차트 카테고리 axis 생성 처리.
     *************************************************************/
    function _createCategoryAxis(oChart, oCategoryAxis){
        
        if(typeof oChart === "undefined"){
            return;
        }
        
        if(typeof oCategoryAxis?._createCategoryAxis === "undefined"){
            return;
        }
        
        if(typeof oChart?._oChart?.oRoot === "undefined"){
            return;
        }
        
        if(typeof oChart?._oChart?.oChartInstance === "undefined"){
            return;
        }


        //부모의 am5 root Instance를 category에 매핑.
        oCategoryAxis._oChart.oRoot = oChart?._oChart?.oRoot;


        //X축 정보 구성.
        let _oCategoryAxis = oCategoryAxis._createCategoryAxis(oChart);

        if(typeof _oCategoryAxis === "undefined"){
            return;
        }

        
        //카테고리에 차트 출력 데이터 매핑.
        _oCategoryAxis.data.setAll(oCategoryAxis._oChart.aData);


        if(oChart.getRotate() === true){
            //xy차트에 X 축 정보 추가 처리.
            oChart._oChart.oChartInstance.yAxes.push(_oCategoryAxis);
            return;
        }


        //xy차트에 X 축 정보 추가 처리.
        oChart._oChart.oChartInstance.xAxes.push(_oCategoryAxis);
                        
                        
        
    }

    
    /*************************************************************
     * @function - 차트 구성 처리.
     *************************************************************/
    function _drawChart(oUi){
        
        return new Promise(function(resolve){
            am5.ready(async function() {

                //라이선스가 등록되지 않은경우 등록 처리.
                if(am5.registry.licenses.findIndex( item => item === atob(oUi.licenceKey) ) === -1){
                    am5.addLicense(atob(oUi.licenceKey));
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
                oUi._drawChart(_oRoot);

                await oUi._oChart.oChartInstance.appear();
                
                let _height = oUi._oChart.oChartInstance.get("height");

                oUi._oChart.oChartInstance.set("height", _height);
                
                oUi._oChart.oChartInstance.markDirtySize();
                
                
                resolve();
                
            });
        
        });
        
    }


    /*************************************************************
     * @function - 차트 Y축 구성 처리.
     *************************************************************/
    function _createValueAxes(oChart, oCategoryAxis){

        let _oValueAxis = oCategoryAxis.getValueAxis() || undefined;

        if(typeof _oValueAxis === "undefined"){
            return;
        }

        //차트의 aixs 생성 처리.
        _createValueAxis(oChart, _oValueAxis);
         
    }




    /*************************************************************
     * @function - 차트 X축 구성 처리.
     *************************************************************/
    function _createCategoryAxes(oChart){
        
        //category 정보 구성.
        let _aCategoryAxis = oChart.getCategoryAxis();

        if(_aCategoryAxis.length === 0){
            return;
        }

               
        for (let i = 0, l = _aCategoryAxis.length; i < l; i++) {
            
            let _oCategoryAxis = _aCategoryAxis[i];
            

            //차트의 category 생성 처리.
            _createCategoryAxis(oChart, _oCategoryAxis);


            //차트 Y축 구성 처리.
            _createValueAxes(oChart, _oCategoryAxis);

            
            //컬럼, 라인 정보 구성 처리.
            _oCategoryAxis._createSeries(oChart);
            
        }

    }



    /*************************************************************
     * @function - AM5 Legend 생성 처리.
     *************************************************************/
    function _createLegend(oUi){

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



    let _oXYChart = SerialChart.extend("u4a.charts.am5.RadarChart", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 안에 커서를 갖다 댈때 막대나 선에 대한 툴팁 표현시 
                //서로 가까운 항목은 같이 툴팁으로 표현할지에 대한 픽셀 값.
                //(해당 프로퍼티의 값이 100 인경우 컬럼의 툴팁 표현시 100px 안에 꺾은선이 지나가면 꺾은선의 툴팁도 표현처리함)
                maxTooltipDistance : { type : "int", defaultValue: 0 },

                
                //인접한 차트 속성에 대한 툴팁 표현 거리 계산 기준 유형.
                maxTooltipDistanceBy : {type : "u4a.charts.am5.MaxTooltipDistanceType", default : "xy"},


                //차트의 데이터 출력 영역을 마우스 드래그로 좌, 우 이동 가능 여부.
                panX : { type : "boolean", defaultValue: false },


                //차트의 데이터 출력 영역을 마우스 드래그로 상, 하 이동 가능 여부.
                panY : { type : "boolean", defaultValue: false },


                //차트의 데이터 출력 영역에서 마우스 휠 동작시 확대, 축소 값.
                //(값이 작을수록 확대 축소가 조금씩 이뤄진다.)
                wheelStep : { type : "float", defaultValue: 0.25 },


                //마우스 휠을 상, 하로 동작시 액션 처리 값.
                //(일반 마우스의 휠을 동작 시킬때 차트의 액션 처리)
                //zoomX : 차트 데이터 출력 영역 가로 확대.
                //zoomY : 차트 데이터 출력 영역 세로 확대.
                //zoomXY : 차트 데이터 출력 영역 가로, 세로 확대.
                wheelY : {type : "u4a.charts.am5.WheelType", defaultValue: "none"},


                //마우스 휠을 좌, 우로 동작시 액션 처리 값.
                //(특정 마우스(로지텍 mx마스터)의 경우 좌우 휠 기능이 있다,
                //좌, 우 휠을 동작 시킬때 차트의 액션 처리)
                //zoomX : 차트 데이터 출력 영역 가로 확대.
                //zoomY : 차트 데이터 출력 영역 세로 확대.
                //zoomXY : 차트 데이터 출력 영역 가로, 세로 확대.
                wheelX : {type : "u4a.charts.am5.WheelType", defaultValue: "none"},


                //X축 스크롤바 위치.
                //top : 상단
                //bottom : 하단
                scrollbarXPosition : {type : "u4a.charts.am5.ScrollbarXPosition", defaultValue: "top"},

                
                //Y축 스크롤바 위치.
                //left : 좌측
                //right : 우측.
                scrollbarYPosition : {type : "u4a.charts.am5.ScrollbarYPosition", defaultValue: "right"},


                //radar chart의 종료 각도.
                //기본적으로 원으로 차트를 구성하지만 각도를 조절하여 반원으로 차트를 구성할 수 있다.
                endAngle : { type : "int", defaultValue: 270 },


                //radar chart의 내부 반경 값.
                //값이 커질수록 내부의 빈 원의 공간이 커진다.
                innerRadius : { type : "sap.ui.core.CSSSize" },


                //radar 차트의 원 크기.
                radius : { type : "sap.ui.core.CSSSize", defaultValue : "80%" },


                //radar chart의 시작 각도.
                //기본적으로 원으로 차트를 구성하지만 각도를 조절하여 반원으로 차트를 구성할 수 있다.
                startAngle :  { type : "int", defaultValue: -90 },


                //차트를 가로 차트로 구성할지 여부.
                //true : 차트를 가로 방향으로 구성.(category가 y축으로 이동, valueAxis가 x축으로 이동함)
                rotate : { type : "boolean", defaultValue: false}

            },

            aggregations : {

                //categoryAxis(X축) aggregation.
                categoryAxis : { type : "u4a.charts.am5.RadarCategoryAxis", multiple : true, singularName: "categoryAxis" },
                
                //배경색 aggregation.
                background : { type : "u4a.charts.am5.Background", multiple : false },

                //범례 aggregation.
                legend : { type : "u4a.charts.am5.Legend", multiple : false },

                //title 정보.
                title : { type : "u4a.charts.am5.Title", multiple : false }

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
            oRm.class("u4aAM5RadarChart");
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

            this._oChart.oRoot = root;

            
            //차트 속성정보 얻기.
            let _sChartProp = this._getChartProperies(this._aExcludeProp);


            //startAngle과 endAngle의 값이 같은경우 am5차트에서 오류가 발생됨.            
            if(this.getStartAngle() === this.getEndAngle()){
                console.error("startAngle and endAngle cannot have the same value.");

                //startAngle값이 입력됐다면 startAngle 값 제거.
                if(typeof _sChartProp.startAngle !== "undefined" && typeof _sChartProp.endAngle === "undefined"){
                    delete _sChartProp.startAngle;
                }

                //endAngle값이 입력됐다면 endAngle 값 제거.
                if(typeof _sChartProp.startAngle === "undefined" && typeof _sChartProp.endAngle !== "undefined"){
                    delete _sChartProp.endAngle;
                }

                //startAngle값과 endAngle값이 같이 입력됐다면 startAngle 값 제거.
                if(typeof _sChartProp.startAngle !== "undefined" && typeof _sChartProp.endAngle !== "undefined"){
                    delete _sChartProp.startAngle;
                }
                
            }

            
            let _oDom = this.getDomRef() || undefined;


            if(typeof _oDom === "undefined"){
                _sChartProp.width = this._convAm5CssSize(this.getWidth());
                _sChartProp.height = this._convAm5CssSize(this.getHeight());

                _sChartProp.visible = this.getVisible();
                
            }


            _sChartProp.layout = this._oChart.oRoot.verticalLayout;


            _sChartProp.cursor = am5radar.RadarCursor.new(this._oChart.oRoot, {
            });

            _sChartProp.cursor.lineX.set("visible", false);
            _sChartProp.cursor.lineY.set("visible", false);


            // Create chart
            this._oChart.oChartInstance = this._oChart.oRoot.container.children.push(
                am5radar.RadarChart.new(this._oChart.oRoot, _sChartProp)
            );


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



            //차트 데이터 구성 처리.
            this._getChartData(this);


            //차트 X축 구성 처리.
            _createCategoryAxes(this);


            //차트 데이터 구성건 미존재시 no data 처리.
            this._setNoDataChartContent();


            //차트 Legend 구성 처리.
            _createLegend(this);


            //타이틀 정보 구성 처리.
            this._setTitle();


            return this._oChart.oChartInstance;


        },


        /*************************************************************
         * @function - 차트 데이터 구성건 미존재시 no data 처리.
         *************************************************************/
        _setNoDataChartContent : function(){

            //bar, line 정보 구성건이 존재하지 않는경우.
            if(typeof this?._oChart?.oChartInstance?.series?.values?.length === "undefined"){
                //차트 출력 데이터 구성건 미존재시 no data 처리.
                this._showNoDataChart();
                return;
            }

            //bar, line 정보 구성건이 존재하지 않는경우.
            if(this?._oChart?.oChartInstance?.series?.values?.length === 0){
                //차트 출력 데이터 구성건 미존재시 no data 처리.
                this._showNoDataChart();
                return;
            }


            let _foundData = false;

            //차트에 구성된 bar, line 정보에 대해 차트 출력 데이터가 존재하는지 확인.
            for (let i = 0, l = this._oChart.oChartInstance.series.values.length; i < l; i++) {
                
                let _oSeries = this._oChart.oChartInstance.series.values[i];

                //series에 차트 출력 데이터가 구성되어 있지 않는경우 skip.
                if(typeof _oSeries?.data?.values?.length === "undefined"){
                    continue;
                }

                //series에 차트 출력 데이터가 구성되어 있지 않는경우 skip.
                if(_oSeries?.data?.values?.length === 0){
                    continue;
                }

                //series에 차트 출력 데이터가 존재하는경우 value에 값이 설정된건이 존재하는지 확인.
                if(_oSeries?.data?.values.findIndex( item => typeof item.value !== "undefined" && item.value !== null) !== -1){
                    //value에 값이 설정된건이 존재함 flag 처리.
                    _foundData = true;
                    break;
                }

            }

            //value에 값이 존재하는경우 exit.
            if(_foundData === true){
                return;
            }

            //차트 출력 데이터 구성건 미존재시 no data 처리.
            this._showNoDataChart();


        },


        /*************************************************************
         * @function - 차트 출력 데이터 구성건 미존재시 no data 처리.
         *************************************************************/
        _showNoDataChart : function(){
            
            var data = [{
                index: 0,
                value: 0,
                openValue : null
            }];

            //category가 한건도 존재하지 않는경우.
            if(this._oChart.oChartInstance.xAxes.values.length === 0){
                //category 추가 처리.
                this._oChart.oChartInstance.xAxes.push(am5xy.CategoryAxis.new(this._oChart.oRoot, {
                    categoryField: "country",
                    renderer: am5radar.AxisRendererCircular.new(this._oChart.oRoot, {})
                }));

            }

            let _oAxisX = this._oChart.oChartInstance.xAxes.values[0];

            _oAxisX.data.setAll(data);

            
            if(this._oChart.oChartInstance.yAxes.values.length === 0){

                //Y 축
                this._oChart.oChartInstance.yAxes.push(am5xy.ValueAxis.new(this._oChart.oRoot, {
                    renderer: am5radar.AxisRendererRadial.new(this._oChart.oRoot, {})
                }));

            }

            let _oAxisY = this._oChart.oChartInstance.yAxes.values[0];

            if(this._oChart.oChartInstance.series.values.length === 0){
                this._oChart.oChartInstance.series.push(am5radar.RadarColumnSeries.new(this._oChart.oRoot, {
                    xAxis: _oAxisX,
                    yAxis: _oAxisY,
                    valueYField: "value",
                    categoryXField: "index",
                }));
            }
    
            // Add series
            let _oSeries = this._oChart.oChartInstance.series.values[0];

            _oSeries.data.setAll(data);

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

            //categoryAxis(X축) 정보 얻기.
            let _aCategory = this.getCategoryAxis();

            if(_aCategory.length === 0){
                return;
            }

            for (let i = 0, l = _aCategory.length; i < l; i++) {
                
                let _oCategory = _aCategory[i];

                //category의 하위를 탐색하며 차트 데이터 구성 처리.
                _oCategory._getChartData();
                
            }            

        },


        /*************************************************************
         * @function - x축의 스크롤바 구성 처리.
         *************************************************************/
        _createScrollbarX : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oScrollbar = this.getScrollbarX() || undefined;

            if(typeof _oScrollbar?._createScrollbar === "undefined"){
                return;
            }

            let _oAM5Scrollbar = _oScrollbar._createScrollbar("horizontal");

            if(typeof _oAM5Scrollbar === "undefined"){
                return;
            }


            this._oChart.oChartInstance.set("scrollbarX", _oAM5Scrollbar);


        },


        /*************************************************************
         * @function - y축의 스크롤바 구성 처리.
         *************************************************************/
        _createScrollbarY : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oScrollbar = this.getScrollbarY() || undefined;

            if(typeof _oScrollbar?._createScrollbar === "undefined"){
                return;
            }

            let _oAM5Scrollbar = _oScrollbar._createScrollbar("vertical");

            if(typeof _oAM5Scrollbar === "undefined"){
                return;
            }


            this._oChart.oChartInstance.set("scrollbarY", _oAM5Scrollbar);


        },


        /*************************************************************
         * @function - 타이틀 정보 구성 처리.
         *************************************************************/
        _setTitle : function(){

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


            //chart에 title 정보 추가.
            this._oChart.oChartInstance.children.moveValue(_oAmTitle, 0);

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

            if(typeof this._oChart?.oRoot === "undefined"){
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
         * @function - maxTooltipDistance 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxTooltipDistance : function(propValue){

            let _propValue = this._setProperty("maxTooltipDistance", propValue);


            //차트 Instance에 maxTooltipDistance settings 값 반영 처리.
            this._setChartSettings("maxTooltipDistance", _propValue);

        },


        /*************************************************************
         * @function - maxTooltipDistanceBy 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxTooltipDistanceBy : function(propValue){

            let _propValue = this._setProperty("maxTooltipDistanceBy", propValue);


            //차트 Instance에 maxTooltipDistanceBy settings 값 반영 처리.
            this._setChartSettings("maxTooltipDistanceBy", _propValue);

        },
        
        
        /*************************************************************
         * @function - maxTooltipDistanceBy 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxTooltipDistanceBy : function(propValue){

            let _propValue = this._setProperty("maxTooltipDistanceBy", propValue);


            //차트 Instance에 maxTooltipDistanceBy settings 값 반영 처리.
            this._setChartSettings("maxTooltipDistanceBy", _propValue);

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
         * @function - wheelStep 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWheelStep : function(propValue){

            let _propValue = this._setProperty("wheelStep", propValue);

            
            //차트 Instance에 wheelStep settings 값 반영 처리.
            this._setChartSettings("wheelStep", _propValue);

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
         * @function - endAngle 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setEndAngle : function(propValue){

            let _propValue = this._setProperty("endAngle", propValue);

            if(this.getStartAngle() === _propValue){
                console.error("startAngle and endAngle cannot have the same value.");
                return;
            }


            //차트 Instance에 endAngle settings 값 반영 처리.
            this._setChartSettings("endAngle", _propValue);

        }, 


        /*************************************************************
         * @function - innerRadius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInnerRadius : function(propValue){

            let _propValue = this._setProperty("innerRadius", propValue);


            //차트 Instance에 innerRadius settings 값 반영 처리.
            this._setChartSettings("innerRadius", _propValue);

        }, 


        /*************************************************************
         * @function - radius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setRadius : function(propValue){

            let _propValue = this._setProperty("radius", propValue);


            //차트 Instance에 radius settings 값 반영 처리.
            this._setChartSettings("radius", this._convAM5Property("radius", _propValue));


        }, 


        /*************************************************************
         * @function - startAngle 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStartAngle : function(propValue){

            let _propValue = this._setProperty("startAngle", propValue);

            if(this.getEndAngle() === _propValue){
                console.error("startAngle and endAngle cannot have the same value.");
                return;
            }


            //차트 Instance에 startAngle settings 값 반영 처리.
            this._setChartSettings("startAngle", _propValue);

        }, 


        /*************************************************************
         * @function - background UI 추가 function 재정의.
         *************************************************************/
        setBackground : function(oUi){

            this.setAggregation("background", oUi, true);

            //배경색에 대한 처리.
            this._setBackGround();

        },


        /*************************************************************
         * @function - rotate 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setRotate : function(propValue){

            this._setProperty("rotate", propValue);
            
            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //chart 제거 처리.
            this._oChart.oChartInstance.dispose();


            //am5 차트 구성 처리.
            this._drawChart(this._oChart.oRoot);


        }

        
    });

    return _oXYChart;

});