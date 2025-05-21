sap.ui.define("u4a.charts.am5.PieChart", [
    "u4a/charts/am5/PercentChart",
    "sap/base/util/uid",    
    "u4a/charts/am5/am5Loader",
    "u4a/charts/am5/am5percentLoader"
], function(PercentChart, uid){
    "use strict";


    /*************************************************************
     * @function - 라이브러리 로드처리 대기 Promise.
     *************************************************************/
    function _waitLoadLibrary(){
        
        return new Promise((resolve)=>{
            
            function _isloadLibrary(libraryName){
                
                if(typeof window["am5"] !== "undefined" && typeof window["am5percent"] !== "undefined"){
                    
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
                
                resolve();
                
            });
        
        });
        
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



    /*************************************************************
     * @function - 차트 pieSeries 생성 처리.
     *************************************************************/
    function _createPieChartContent(oChart){

        let _aContent = oChart.getPieChartContent();

        if(_aContent.length === 0){
            return;
        }

        for (let i = 0, l = _aContent.length; i < l; i++) {
            
            let _oContent = _aContent[i];

            let _oSeries = _oContent._createPieSeries(oChart);

           
            //am5 chart에 생성된 lineSeries 추가.
            oChart._oChart.oChartInstance.series.push(_oSeries);


            //line index에 해당하는 데이터를 매핑 처리.
            _oSeries.data.setAll(_oContent._oChart.aData);

            
        }

    }



    let _oPieChart = PercentChart.extend("u4a.charts.am5.PieChart", {
        metadata : {
            library : "u4a.charts.am5",

            aggregations : {

                //차트 데이터 aggregation.
                pieChartContent : { type : "u4a.charts.am5.PieChartContent", multiple : true, singularName: "pieChartContent" },
                
                //배경색 aggregation.
                background : { type : "u4a.charts.am5.Background", multiple : false, singularName: "background" },

                //범례 aggregation.
                legend : { type : "u4a.charts.am5.Legend", multiple : false, singularName: "legend" },

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
                        
            PercentChart.prototype.init.apply(this, arguments);
            
            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "visible",
                "width",
                "height"
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
            oRm.class("u4aAM5PieChart");
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
         * @function - 차트 구성 처리.
         *************************************************************/
        _drawChart : function(root){

            this._oChart.oRoot = root;


            //차트 속성정보 얻기.
            let _sChartProp = this._getChartProperies(this._aExcludeProp);


            let _oDom = this.getDomRef() || undefined;


            if(typeof _oDom === "undefined"){
                _sChartProp.width = this._convAm5CssSize(this.getWidth() || "100%");
                _sChartProp.height = this._convAm5CssSize(this.getHeight() || "100%");

                _sChartProp.visible = this.getVisible();
            }


            _sChartProp.layout = this._oChart.oRoot.verticalLayout;


            // Create chart
            this._oChart.oChartInstance = this._oChart.oRoot.container.children.push(
                am5percent.PieChart.new(this._oChart.oRoot, _sChartProp)
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


            //차트에 pieseries 정보 구성.
            _createPieChartContent(this);


            //차트 데이터 구성건 미존재시 no data 처리.
            this._setNoDataChartContent();


            //legend 정보 구성 처리.
            this._createLegend();


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
                category: "",
                value: 0
            }];


            if(this._oChart.oChartInstance.series.values.length === 0){
                this._oChart.oChartInstance.series.push(am5percent.PieSeries.new(this._oChart.oRoot, {
                    valueField: "value",
                    categoryField: "index",
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

            //pieContent 정보 얻기.
            let _aContent = this.getPieChartContent();

            if(_aContent.length === 0){
                return;
            }

            for (let i = 0, l = _aContent.length; i < l; i++) {
                
                let _oContent = _aContent[i];

                //pieContent의 하위를 탐색하며 차트 데이터 구성 처리.
                _oContent._getChartData();
                
            }

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
         * @function - legend 정보 구성 처리.
         *************************************************************/
        _createLegend : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            //legend 정보 얻기.
            let _oLegend = this.getLegend() || undefined;
    
            if(typeof _oLegend?._createLegend === "undefined"){
                return;
            }
        
            //am5 차트의 Legend 생성 처리.
            let _oAM5Legend = _oLegend._createLegend();
    
            if(typeof _oAM5Legend === "undefined"){
                return;
            }
        
            this._oChart.oChartInstance.children.push(_oAM5Legend);

            let _aSeries = this._oChart.oChartInstance.series.values;

            if(_aSeries.length === 0){
                return;
            }

            let _aValues = [];

            for (let i = 0, l = _aSeries.length; i < l; i++) {

                let _aDataItems = _aSeries[i]?.dataItems;

                if(typeof _aDataItems === "undefined"){
                    continue;
                }

                if(_aDataItems.length == 0){
                    continue;
                }
                
                _aValues = _aValues.concat(_aDataItems);                
            }
            
    
            _oAM5Legend.data.setAll(_aValues);
    
    
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
            PercentChart.prototype.setParent.apply(this, arguments);

            //부모 Instance가 존재하지 않는경우 Chart 제거 처리.
            if(oParent === null){
                this._removeChart();
            }
           

        },


        /*************************************************************
         * @function - legend UI 추가 function 재정의.
         *************************************************************/
        setLegend : function(oUi){

            this.setAggregation("legend", oUi, true);
            

            //차트 Legend 구성 처리.
            this._createLegend(this);
            
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

    return _oPieChart;

});