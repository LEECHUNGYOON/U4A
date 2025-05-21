sap.ui.define("u4a.charts.am5.ClockHand", [
    "u4a/charts/am5/Container"
    
],function(Container){
    "use strict";
    
    let _oClockHand = Container.extend("u4a.charts.am5.ClockHand", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //바늘이 가르키는 값.
                //바늘이 가르키는 값이 y축의 값에 해당되지 않는경우 바늘을 표현하지 않는다.
                value: { type : "float" },


                //바늘의 하단 두께
                //Radar의 중심원 부분의 바늘 두께를 설정할 수 있다.
                //값이 커질수록 중심원 부분의 바늘 두께가 커진다.
                bottomWidth : { type : "int", defaultValue : 10 },


                //바늘의 내부 중심원 크기.
                //innerRadius에 설정된 값이 커질수록 중심원로 부터 바늘이 점점 멀어진다.
                innerRadius : { type : "sap.ui.core.CSSSize" },


                //바늘의 가운데 원 크기.
                //pinRadius의 값이 커질수록 중심 원에 표현된 원의 크기가 커진다.
                pinRadius : { type : "sap.ui.core.CSSSize" },


                //바늘의 끝부분에 해당하는 원의 크기.
                //radius의 값이 작아질수록 y축으로부터 점점 멀어진다.
                radius : { type : "sap.ui.core.CSSSize", defaultValue: "90%" },


                //바늘의 상단 두께
                //Radar의 바깥쪽 부분의 바늘 두께를 설정할 수 있다.
                //값이 커질수록 바깥쪽 부분의 바늘 두께가 커진다.
                topWidth : { type : "int", defaultValue : 10 }


            },


            aggregations : {

                //바늘쪽 색상, 투명도 설정.
                hand : { type : "u4a.charts.am5.Hand", multiple : false },


                //가운데 원의 색상, 투명도 설정.
                pin : { type : "u4a.charts.am5.Pin", multiple : false }


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
            
            Container.prototype.init.apply(this, arguments);


            //수집 제외대상 프로퍼티정보.
            this._aExcludeProp = [
                "value"
            ];
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
            
            Container.prototype.exit.apply(this, arguments);
    
    
        }, /* end of exit */
        

        /*************************************************************
         * @event - 이벤트 fire 처리.
         *************************************************************/
        _fireEvent : function(oEvent){
            
            if(typeof oEvent?.target?.dataItem === "undefined"){
                return;
            }
                        
            if(typeof oEvent?.point === "undefined"){
                return;
            }

            let _eventType = oEvent.type;
            
            let _sDataItem = oEvent.target.dataItem;

            let _sPoint = oEvent.point;

            let _sParams = {};
            
            //바늘이 가르키는 값.
            _sParams.value = _sDataItem.get("value");
            
            _sParams.item = this;
            
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
                        
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);

        },


        /*************************************************************
         * @function - Gauge의 바늘 표현을 위한 am5 Instance 생성 처리.
         *************************************************************/
        _createClockHand : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }

            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oValueAxis = _oParent?._oChart?.oChartInstance;

            //값을 표현할 dataItem 생성.
            this._oChart.oAxisDataItem = _oValueAxis.makeDataItem({
                value : this.getValue()
            });


            //Gauge의 바늘 표현 정보 얻기.
            let _sChartProp = this._getChartProperies(this._aExcludeProp);
            
            _sChartProp.visible = this.getVisible();

            
            this._oChart.oChartInstance = am5radar.ClockHand.new(_oParent._oChart.oRoot, _sChartProp);

            
            //바늘의 세부 속성 정의를 위한 UI 정보 얻기.
            let _oHand = this.getHand() || undefined;

            //바늘의 세부 속성 정의를 위한 UI가 존재하는경우.
            if(typeof _oHand !== "undefined"){
                //UI에 정의된 속성정보를 am5차트에 설정 처리.
                this._oChart.oChartInstance.hand.setAll(_oHand._getChartData());

                _oHand._oChart.oChartInstance = this._oChart.oChartInstance.hand;

            }


            //바늘의 가운데 점 세부 속성 정의를 위한 UI 정보 얻기.
            let _oPin = this.getPin() || undefined;

            //바늘의 가운데 점 세부 속성 정의를 위한 UI가 존재하는경우.
            if(typeof _oPin !== "undefined"){
                //UI에 정의된 속성정보를 am5차트에 설정 처리.
                this._oChart.oChartInstance.pin.setAll(_oPin._getChartData());


                _oPin._oChart.oChartInstance = this._oChart.oChartInstance.pin;
            }


            this._oChart.oAxisDataItem.set("bullet", am5xy.AxisBullet.new(_oParent._oChart.oRoot, {
                sprite: this._oChart.oChartInstance
            }));

            _oParent._oChart.oChartInstance.createAxisRange(this._oChart.oAxisDataItem);


            //click 이벤트 등록.
            this._oChart.oChartInstance.events.on("click", function(oEvent) {

                this._fireEvent(oEvent);

            }.bind(this));


            //dblclick 이벤트 등록.
            this._oChart.oChartInstance.events.on("dblclick", function(oEvent) {
                
                this._fireEvent(oEvent);

            }.bind(this));


            //rightclick 이벤트 등록.
            this._oChart.oChartInstance.events.on("rightclick", function(oEvent) {
                
                this._fireEvent(oEvent);

            }.bind(this));

            return this._oChart.oChartInstance;


        },


        /*************************************************************
         * @function - value 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setValue : function(propValue){
            
            let _propValue = this._setProperty("value", propValue);

            if(typeof this?._oChart?.oAxisDataItem === "undefined"){
                return;
            }

            this._oChart.oAxisDataItem.set("value", _propValue);

        },

        
        /*************************************************************
         * @function - bottomWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setBottomWidth : function(propValue){

            let _propValue = this._setProperty("bottomWidth", propValue);

            
            //차트 Instance에 bottomWidth settings 값 반영 처리.
            this._setChartSettings("bottomWidth", _propValue);

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
         * @function - pinRadius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPinRadius : function(propValue){

            let _propValue = this._setProperty("pinRadius", propValue);

            
            //차트 Instance에 pinRadius settings 값 반영 처리.
            this._setChartSettings("pinRadius", _propValue);

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
         * @function - topWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setTopWidth : function(propValue){

            let _propValue = this._setProperty("topWidth", propValue);

            
            //차트 Instance에 topWidth settings 값 반영 처리.
            this._setChartSettings("topWidth", _propValue);

        }


        
    });

    return _oClockHand;
    
});