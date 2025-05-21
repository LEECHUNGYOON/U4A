sap.ui.define("u4a.charts.am5.RadarCategoryItem", [
    "sap/ui/core/Element",
    "u4a.charts.am5.Sprite"
    
],function(Element, Sprite){
    "use strict";
    
    let _oRadarCategoryItem = Element.extend("u4a.charts.am5.RadarCategoryItem", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //카테고리에 출력할 값 정보.
                categoryText : { type : "string", defaultValue : "" }

            },
    
            aggregations : {

                //막대(컬럼) aggregation.
                barItems : { type : "u4a.charts.am5.RadarBarItem", multiple : true, singularName: "barItem" },

                //꺾은선(라인) aggregation.
                lineItems : { type : "u4a.charts.am5.RadarLineItem", multiple : true, singularName: "lineItem" },

                //y축 숫자 label 세팅.
                labelStyle : { type : "u4a.charts.am5.LabelStyle", multiple : false },

                //y축의 가로 배경선 세팅.
                grid : { type : "u4a.charts.am5.Grid", multiple : false }

            }
    
        }, /* end of metadata */
    
        init : function(){


            this._chartName = "cat";
    
    
        }, /* end of init */
    
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
    
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};
    
            //현재 Series Container에 입력한 카테고리 출력 값 매핑.
            _sChartData.categoryText = this.getCategoryText();


            let _oLabelStyle = this.getLabelStyle() || undefined;


            if(typeof _oLabelStyle !== "undefined"){
                //category의 label 세팅 정보 매핑.
                _sChartData.labelStyle = _oLabelStyle._getChartProperies();
            }


            let _oGrid = this.getGrid() || undefined;


            if(typeof _oGrid !== "undefined"){
                //category의 label 세팅 정보 매핑.
                _sChartData.grid = _oGrid._getChartProperies();
            }

            
            //구성된 컬럼을 기준으로 차트 데이터 구성 처리.
            let _aBarItem = this.getBarItems();

            for (let i = 0, l = _aBarItem.length; i < l; i++) {
                
                let _oBarItem = _aBarItem[i];

                let _chartName = `${_oBarItem._chartName}${i}`;

                _sChartData[_chartName] = _oBarItem._getChartData();

                _sChartData[_chartName].category = _sChartData.categoryText;

                
            }


            let _aLineItem = this.getLineItems();


            //구성된 라인을 기준으로 차트 데이터 구성 처리.
            for (let i = 0, l = _aLineItem.length; i < l; i++) {
                
                let _oLineItem = _aLineItem[i];

                let _chartName = `${_oLineItem._chartName}${i}`;

                _sChartData[_chartName] = _oLineItem._getChartData();

                _sChartData[_chartName].category = _sChartData.categoryText;

                
            }

            return _sChartData;

        },


        /*************************************************************
         * @function - 프로퍼티 값 매핑 처리.
         *************************************************************/
        _setProperty : function(propName, propValue){
            
            //프로퍼티 입력값 점검.
            let _propValue = this.validateProperty(propName, propValue);
            
            //프로퍼티 값 세팅.
            this.setProperty(propName, _propValue, true);
            
            return _propValue;
            
        },


        /*************************************************************
         * @function - 차트 요소의 속성정보 얻기.
         *************************************************************/
        _getChartProperies : function(aExcludeProp = []){

            let _sChartProp = {};

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return _sChartProp;
            }

            let _oProperties = _oMeta.getAllProperties();

            if(typeof _oProperties === "undefined"){
                return _sChartProp;
            }


            //프로퍼티에 설정된 값을 차트 속성 정보로 수집 처리.
            for (const key in _oProperties) {

                //수집 제외 대상 속성 정보에 해당하는건인경우 skip.
                if(aExcludeProp.indexOf(key) !== -1){
                    continue;
                }
                
                let _oProp = _oProperties[key];

                //프로퍼티의 입력값 얻기.
                let _val = this.getProperty(key);

                //프로퍼티가 default 값과 같은건인경우 수집 생략 처리.
                if(_val === _oProp.getDefaultValue()){
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
                _sChartProp[key] = this._convAM5Property(key, _val);

            }

            return _sChartProp;

        },


        /*************************************************************
         * @function - am5 차트가 허용하는 프로퍼티값으로 변환 처리.
         *************************************************************/
        _convAM5Property : function(propertyName, value){

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return value;
            }

            let _oProp = _oMeta.getProperty(propertyName);

            if(typeof _oProp === "undefined"){
                return value;
            }

            //프로퍼티 타입에 따른 conversion 처리.
            switch (_oProp.type) {
                case "sap.ui.core.CSSColor":
                    
                    //입력한 프로퍼티의 타입이 색상에 관련된경우.
                    //am5의 색상 정보를 구성 처리.
                    return Sprite.prototype._getAm5Color(value);

                case "sap.ui.core.CSSSize":
                case "sap.ui.core.Percentage":
                    
                    //width, height와 같이 size에 관련된 프로퍼티인경우
                    return Sprite.prototype._convAm5CssSize(value);
            
                default:
                    return value;
            }

        },
        

        /*************************************************************
         * @function - am5 columnSeries 생성.
         *************************************************************/
        _createColumnSeries : function(oChart){

            let _aColumnSeries = this.getColumnSeries();

            if(_aColumnSeries.length === 0){
                return;
            }

            for (let i = 0, l = _aColumnSeries.length; i < l; i++) {
                
                let _oColumnSeries = _aColumnSeries[i];

                _oColumnSeries._createColumn(oChart);
                
            }

        },


        /*************************************************************
         * @function - categoryAxis를 통해 차트 데이터 갱신 처리.
         *************************************************************/
        _updateCategory : function(){
            
            //category exit의 부모 정보 
            var _oCategory = this.getParent() || undefined;
            
            if(typeof _oCategory?._getChartData === "undefined"){
                return;
            }

            //차트 데이터 갱신 처리.
            _oCategory._updateCategory();

        },


        /*************************************************************
         * @function - categoryValue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCategoryText : function(propValue){

            this._setProperty("categoryText", propValue);


            //categoryAxis를 통해 차트 데이터 갱신 처리.
            this._updateCategory();


        }

        
    });

    return _oRadarCategoryItem;
    
});