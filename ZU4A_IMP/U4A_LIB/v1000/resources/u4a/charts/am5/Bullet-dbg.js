sap.ui.define("u4a.charts.am5.Bullet", [
    "u4a/charts/am5/Entity"
    
],function(Entity){
    "use strict";


    //bullet이 표현될 필드 위치.
    u4a.charts.am5.BulletFieldType = {
        open : "open",
        high : "high",
        low : "low",
        value : "value"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.BulletFieldType", u4a.charts.am5.BulletFieldType);
    

    let _oBullet = Entity.extend("u4a.charts.am5.Bullet", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //bullet이 표현될 필드 위치.
                field : { type : "u4a.charts.am5.BulletFieldType", defaultValue : "value" },


                //bullet의 X축 위치
                //columnSeries에 bullet을 추가 하게 될 경우, 막대가 세로로 표현될시
                //세로 막대 영역에서 위치할 X축의 값.
                //0~1의 값을 입력 할 수 있다.
                //0을 입력한 경우 세로 막대의 가장 왼쪽에 위치하게 된다.
                //1을 입력한 경우 세로 막대의 가장 오른쪽에 위치하게 된다.
                locationX : { type : "float", defaultValue : 0.5 },


                //bullet의 Y축 위치
                //columnSeries에 bullet을 추가 하게 될 경우, 막대가 세로로 표현될시
                //세로 막대 영역에서 위치할 Y축의 값.
                //0~1의 값을 입력 할 수 있다.
                //0을 입력한 경우 세로 막대의 가장 하단에 위치하게 된다.
                //1을 입력한 경우 세로 막대의 가장 상단에 위치하게 된다.
                locationY : { type : "float", defaultValue : 0.5 }

            },
    
            aggregations : {
                //bullet에 표현할 차트 속성 정보.
                //Rectangle, Circle, Triangle, Label을 표현할 수 있다.
                bulletItem : { type : "u4a.charts.am5.BulletItem", multiple : false }
            },
    
            events : {
            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Entity.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Entity.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - bullet ui 생성 처리.
         *************************************************************/
        _createBullet : function(oRoot){

            let _sChartProp = this._getChartProperies();

            _sChartProp.visible = this.getVisible();

            this._oChart.oRoot = oRoot;

            
            let _oSprite = this.getBulletItem() || undefined;

            if(typeof _oSprite !== "undefined"){
                _sChartProp.sprite = _oSprite._createSprite();
            }

            this._oChart.oChartInstance = am5.Bullet.new(oRoot, _sChartProp);
            
            return this._oChart.oChartInstance;

        },


        /*************************************************************
         * @function - field 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setField : function(propValue){

            let _propValue = this._setProperty("field", propValue);


            //차트 Instance에 field settings 값 반영 처리.
            this._setChartSettings("field", _propValue);

        },


        /*************************************************************
         * @function - locationX 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLocationX : function(propValue){

            let _propValue = this._setProperty("locationX", propValue);


            //차트 Instance에 locationX settings 값 반영 처리.
            this._setChartSettings("locationX", _propValue);

        },


        /*************************************************************
         * @function - locationY 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLocationY : function(propValue){

            let _propValue = this._setProperty("locationY", propValue);


            //차트 Instance에 locationY settings 값 반영 처리.
            this._setChartSettings("locationY", _propValue);

        }

        
    });

    return _oBullet;
    
});
