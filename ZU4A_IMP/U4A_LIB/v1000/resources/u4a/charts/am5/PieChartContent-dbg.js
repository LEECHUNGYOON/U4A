sap.ui.define("u4a.charts.am5.PieChartContent", [
    "sap/ui/core/Element",
    "u4a.charts.am5.Sprite"
    
],function(Element, Sprite){
    "use strict";
    
    let _oPieChartContent = Element.extend("u4a.charts.am5.PieChartContent", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                //원의 종료 각도.
                //기본적으로 원으로 차트를 구성하지만 각도를 조절하여 반원으로 차트를 구성할 수 있다.
                endAngle : { type : "int", defaultValue: 270 },


                //내부 반경 값.
                //해당 속성을 변경하여 도넛 차트를 구성할 수 있다.
                //값이 커질수록 내부의 빈 원의 공간이 커진다.
                innerRadius : { type : "sap.ui.core.Percentage" },


                //바깥쪽 원의 크기 설정.
                radius : { type : "sap.ui.core.Percentage", defaultValue: "80%" },


                //원의 시작 각도.
                //기본적으로 원으로 차트를 구성하지만 각도를 조절하여 반원으로 차트를 구성할 수 있다.
                startAngle : { type : "int", defaultValue: -90 }

            },
    
            aggregations : {
                //PieSeries aggregation.
                pieSeries : { type : "u4a.charts.am5.PieSeries", multiple : true, singularName: "pieSeries" }
            }
            
    
        }, /* end of metadata */
    
        init : function(){

            this._oChart = {};

            this._oChart.series = undefined;
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            this._oChart.aData = [];

                
            //pie 조각 정보 얻기.
            let _aSeries = this.getPieSeries();

            if(_aSeries.length === 0){
                return;
            }
            
            for (let i = 0, l = _aSeries.length; i < l; i++) {
                
                let _oSeries = _aSeries[i];

                //pie 조각 정보를 기준으로 출력 데이터 구성.
                let _sChartData = _oSeries._getChartData();

                this._oChart.aData.push(_sChartData);

                
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
         * @function - pieSeries 생성 처리.
         *************************************************************/
        _createPieSeries : function(oChart){

            
            if(typeof oChart?._oChart?.oRoot === "undefined"){
                return;
            }

            //pieSeries의 속성정보 얻기.

            let _sChartProp = {};   

            //원의 종료 각도.
            _sChartProp.endAngle = this.getEndAngle();

            //내부 반경 값.
            _sChartProp.innerRadius = Sprite.prototype._convAm5CssSize.apply(this, [this.getInnerRadius()]);

            //바깥쪽 원의 크기 설정.
            _sChartProp.radius = Sprite.prototype._convAm5CssSize.apply(this, [this.getRadius()]);

            _sChartProp.startAngle = this.getStartAngle();

            _sChartProp.valueField = "value";

            _sChartProp.categoryField = "category";


            //am5 차트의 pieSeries 생성.
            this._oChart.oChartInstance = am5percent.PieSeries.new(oChart._oChart.oRoot, _sChartProp);

            //pie series의 투명도 설정.
            this._oChart.oChartInstance.slices.template.adapters.add("opacity", function (opacity, target) {
                return target?.dataItem?.dataContext?.slicesTemplate?.opacity;   
            });


            //라인에 tooltipText 지정.
            this._oChart.oChartInstance.set("tooltip", am5.Tooltip.new(oChart._oChart.oRoot, {
                templateField : "tooltipText"
            }));


            //pieSeries click 이벤트 등록.
            this._oChart.oChartInstance.slices.template.events.on("click", function(oEvent) {
                
                let _oUi = this._getEventUI(oEvent);

                if(typeof _oUi === "undefined"){
                    return;
                }

                _oUi._fireEvent(oEvent);

            }.bind(this));


            //pieSeries dblclick 이벤트 등록.
            this._oChart.oChartInstance.slices.template.events.on("dblclick", function(oEvent) {
                
                let _oUi = this._getEventUI(oEvent);

                if(typeof _oUi === "undefined"){
                    return;
                }

                _oUi._fireEvent(oEvent);

            }.bind(this));


            //pieSeries rightclick 이벤트 등록.
            this._oChart.oChartInstance.slices.template.events.on("rightclick", function(oEvent) {
                
                let _oUi = this._getEventUI(oEvent);

                if(typeof _oUi === "undefined"){
                    return;
                }

                _oUi._fireEvent(oEvent);

            }.bind(this));

            
            this._oChart.oChartInstance.slices.template.set("templateField", "slicesTemplate");


            this._oChart.oChartInstance.labels.template.set("templateField", "labelStyle");


            return this._oChart.oChartInstance;

        },

        
        // /*************************************************************
        //  * @function - endAngle 프로퍼티 값 설정 function 재정의.
        //  *************************************************************/
        // setEndAngle : function(propValue){

        //     let _propValue = this._setProperty("endAngle", propValue);


        //     //차트 Instance에 endAngle settings 값 반영 처리.
        //     this._setChartSettings("endAngle", _propValue);


        // },


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
         * @function - 차트 Instance에 settings 값 반영 처리.
         *************************************************************/
        _setChartSettings : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            let _val = this._convAM5Property(name, value);


            //차트의 setting값 반영 처리.
            this._oChart.oChartInstance.set(name, _val);


            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirty();


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
            this._setChartSettings("radius", _propValue);


        },


        /*************************************************************
         * @function - startAngle 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStartAngle : function(propValue){

            let _propValue = this._setProperty("startAngle", propValue);


            //차트 Instance에 startAngle settings 값 반영 처리.
            this._setChartSettings("startAngle", _propValue);


        }
        
        
    });

    return _oPieChartContent;
    
});