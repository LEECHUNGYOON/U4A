sap.ui.define("u4a.charts.am5.GuideLineRange", [
    "sap/ui/core/Element"
    
],function(Element){
    "use strict";
    
    let _oGuideLineRange = Element.extend("u4a.charts.am5.GuideLineRange", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //기준선 출력 from index값.
                //y축에 기준선을 추가 하게 되는 경우, indexFrom에 차트에 출력되는 값을 설정한다.
                //예 : 출력된 차트에 y 축 값이 0 ~ 100 인경우 50 위치에 기준선을 구성하려면
                //indexFrom에 50이라는 값을 입력 한다.
                //x축에 기준선을 추가 하게 되는 경우, column의 index(seriesX의 index)에
                //해당하는 값을 설정한다.
                //예 : seriesX 를 통해 category가 test001, test002, ... test010으로 출력된경우,
                //test003 위치에 기준선을 구성하려면 indexFrom에 3이라는 값을 입력한다.
                //indexTo속성을 설정하지 않고 indexFrom 속성만 설정 하는 경우,
                //단일 라인만을 구성한다.
                //indexFrom : 10, indexTo : 100 으로 설정하는경우 기준선은 10의 위치 그려지게 된다.
                //이때 grid aggregation의 location 속성으로 indexFrom ~ indexTo 구간에서 위치할
                //position을 설정할 수 있다.
                //axisFill aggregation의 UI 속성을 통해 indexFrom ~ indexTo 구간의 배경색을 구성할 수 있다.
                //(axisFill aggregation에 UI를 추가하지 않는경우 영역에 대한 배경색 표현을 하지 않는다.)
                //label aggregation의 UI 속성을 통해 해당 기준에서 출력할 label text를 구성할 수 있다.
                //default 기준선은 indexFrom 위치에 그려지게된다.
                //(indexFrom : 100, indexTo : 10 으로 구성시 default 기준선은 100의 위치에 그려지게된다.)
                //y축의 값이 0 ~ 100 을 출력 하는 경우 indexFrom : 200, indexTo : 300 으로 입력시
                //화면에 출력하지 않는다.
                indexFrom : { type : "float" },

                
                //기준선 출력 to index값.
                //indexFrom값을 설정하지 않고, indexTo값만 구성시 차트의 y축의 최초 시작 위치부터 indexTo에
                //해당하는 위치까지를 영역으로 설정한다.
                //예 : y축의 값이 0 ~ 100을 표현하고 있는경우 indexTo : 30 으로 설정 했다면,
                //0 ~ 30 까지를 기준선 출력 영역으로 설정한다. 이때 기준선은 y축의 기준선은 0에 위치하게 된다.
                indexTo : { type : "float" }


            },
    
            aggregations : {
                
                //기준선의 text 출력 aggregation.
                label : { type : "u4a.charts.am5.AxisLabel", multiple : false },


                //기준선의 라인 속성 aggregation.                
                grid : { type : "u4a.charts.am5.Grid", multiple : false },


                //value와 endValue의 영역의 배경색 처리 aggregation.
                //indexFrom ~ indexTo 값 사이 영역의 배경색을 구성한다.
                axisFill : { type : "u4a.charts.am5.AxisFill", multiple : false }

            }
        }, /* end of metadata */

        init : function(){
            
            this._oChart = {};


            this._aExcepPropName = [
                {className: "ValueAxis", propName : "indexFrom", excepName : "value" },
                {className: "ValueAxis", propName : "indexTo", excepName : "endValue" },
                {className: "CategoryAxis", propName : "indexFrom", excepName : "category" },
                {className: "CategoryAxis", propName : "indexTo", excepName : "endCategory" }
            ];

        },
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
    
        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){
            
            let _sChartData = {};

            let _oParent = this.getParent() || undefined;
            
            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                return _sChartData;
            }

            switch (_oParent?._oChart?.oChartInstance.className) {
                case "ValueAxis":

                    _sChartData.value = this.getIndexFrom();

                    _sChartData.endValue = this.getIndexTo();
                    
                    break;

                case "CategoryAxis":

                    _sChartData.category = this.getIndexFrom();

                    _sChartData.endCategory = this.getIndexTo();
                    
                    break;
            
                default:
                    break;
            }


            return _sChartData;

        },


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _createGuideLineRange : function(){

            let _oParent = this.getParent() || undefined;
            
            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                return;
            }

            //기준선 값 구성.
            let _sChartData = this._getChartData();

            //기준선 출력 ITEM 생성.
            let _oItem = _oParent._oChart.oChartInstance.makeDataItem(_sChartData);

            //기준선 생성.
            this._oChart.oChartInstance = _oParent._oChart.oChartInstance.createAxisRange(_oItem);

            
            let _oAMLabel = this._oChart.oChartInstance.get("label") || undefined;
            
            let _oLabel = this.getLabel() || undefined;

            if(typeof _oLabel?._getChartData !== "undefined" && typeof _oAMLabel !== "undefined"){

                _oLabel._oChart.oChartInstance = _oAMLabel;

                _oAMLabel.setAll(_oLabel._getChartData());

            }


            let _oAMGrid = this._oChart.oChartInstance.get("grid") || undefined;
            
            let _oGrid = this.getGrid() || undefined;

            if(typeof _oGrid?._getChartData !== "undefined" && typeof _oAMGrid !== "undefined"){

                _oGrid._oChart.oChartInstance = _oAMGrid;

                _oAMGrid.setAll(_oGrid._getChartData());

            }



            let _oAMAxisFill= this._oChart.oChartInstance.get("axisFill") || undefined;
            
            let _oAxisFill = this.getAxisFill() || undefined;

            if(typeof _oAxisFill?._getChartData !== "undefined" && typeof _oAMAxisFill !== "undefined"){

                _oAxisFill._oChart.oChartInstance = _oAMAxisFill;

                _oAMAxisFill.setAll(_oAxisFill._getChartData());

            }


        },
        

        /*************************************************************
         * @function - 차트 Instance에 settings 값 반영 처리.
         *************************************************************/
        _setChartSettings : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }
            
            let _oParent = this.getParent() || undefined;
            
            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                return _sChartData;
            }

            //부모의 am5 라이브러리 명 얻기.
            let _className = _oParent?._oChart?.oChartInstance.className;

            //부모 차트의 예외프로퍼티에 해당하는 이름 얻기.
            let _sExcepPropName = this._aExcepPropName.find( item => item.className === _className && item.propName === name );

            if(typeof _sExcepPropName === "undefined"){
                return;
            }
            

            //am5의 chart에 settings 값 반영 처리.
            this?._oChart?.oChartInstance.set(_sExcepPropName.excepName, value);

        },


        /*************************************************************
         * @function - indexFrom 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setIndexFrom : function(propValue){

            let _propValue = this.setProperty("indexFrom", propValue, true);

            //차트 Instance에 indexFrom settings 값 반영 처리.
            this._setChartSettings("indexFrom", propValue);


        },

        /*************************************************************
         * @function - indexTo 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setIndexTo : function(propValue){

            let _propValue = this.setProperty("indexTo", propValue, true);


            //차트 Instance에 indexTo settings 값 반영 처리.
            this._setChartSettings("indexTo", _propValue);

        }

        
    });

    return _oGuideLineRange;
    
});