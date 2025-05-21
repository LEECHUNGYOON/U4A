sap.ui.define("u4a.charts.am5.Circle", [
    "u4a/charts/am5/BulletItem"
    
],function(BulletItem){
    "use strict";
    
    let _oCircle = BulletItem.extend("u4a.charts.am5.Circle", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //원의 크기.
                radius: { type : "float", defaultValue : 0 }

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
            
            BulletItem.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
            
            BulletItem.prototype.exit.apply(this, arguments);
    
    
        }, /* end of exit */


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
            
            //y축 값.
            _sParams.value = _sDataItem?.dataContext?.value;

            //x축 값.
            _sParams.category = _sDataItem.dataContext.category;

            
            _sParams.item = this;
            
            //클릭 x, y 좌표.
            _sParams.pointX = _sPoint.x;
            _sParams.pointY = _sPoint.y;
            
                        
            //이벤트 fire 처리.
            this.fireEvent(_eventType, _sParams);

        },


        /*************************************************************
         * @function - sprite에 추가할 am5 차트 Instance 생성.
         *************************************************************/
        _createSprite : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();


            _sChartProp.visible = this.getVisible();


            this._oChart.oChartInstance = am5.Circle.new(_oParent?._oChart?.oRoot, _sChartProp);


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
         * @function - radius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setRadius : function(propValue){

            let _propValue = this._setProperty("radius", propValue);

            
            //차트 Instance에 radius settings 값 반영 처리.
            this._setChartSettings("radius", _propValue);

        }


        
    });

    return _oCircle;
    
});