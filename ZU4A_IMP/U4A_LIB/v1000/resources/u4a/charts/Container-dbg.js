sap.ui.define("u4a.charts.am5.Container", [
    "u4a/charts/am5/Sprite"
    
],function(Sprite){
    "use strict";
    
    let _oContainer = Sprite.extend("u4a.charts.am5.Container", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 하단 여백.
                //10 입력시 차트 요소 하단에 10px만큼의 여백이 생김.
                paddingBottom: { type : "int", defaultValue : 0 },


                //차트 요소의 좌측 여백.
                //10 입력시 차트 요소 좌측에 10px만큼의 여백이 생김.
                paddingLeft: { type : "int", defaultValue : 0 },

                
                //차트 요소의 우측 여백.
                //10 입력시 차트 요소 우측에 10px만큼의 여백이 생김.
                paddingRight: { type : "int", defaultValue : 0 },


                //차트 요소의 상단 여백.
                //10 입력시 차트 요소 상단에 10px만큼의 여백이 생김.
                paddingTop: { type : "int", defaultValue : 0 }


            }

        }, /* end of metadata */
    
        init : function(){
            
            Sprite.prototype.init.apply(this, arguments);
    
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Sprite.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - paddingTop 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPaddingTop: function(propValue){
            
            let _propValue = this._setProperty("paddingTop", propValue);


            //차트 Instance에 paddingTop settings 값 반영 처리.
            this._setChartSettings("paddingTop", _propValue);
            
        },
        

        /*************************************************************
         * @function - paddingBottom 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPaddingBottom: function(propValue){
            
            let _propValue = this._setProperty("paddingBottom", propValue);
            

            //차트 Instance에 paddingBottom settings 값 반영 처리.
            this._setChartSettings("paddingBottom", _propValue);
            
        },
        

        /*************************************************************
         * @function - paddingLeft 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPaddingLeft: function(propValue){
            
            let _propValue = this._setProperty("paddingLeft", propValue);
            
            
            //차트 Instance에 paddingLeft settings 값 반영 처리.
            this._setChartSettings("paddingLeft", _propValue);
            
        },
        

        /*************************************************************
         * @function - paddingRight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPaddingRight: function(propValue){
            
            let _propValue = this._setProperty("paddingRight", propValue);
            
            
            //차트 Instance에 paddingRight settings 값 반영 처리.
            this._setChartSettings("paddingRight", _propValue);
            
        }
        
        
    });

    return _oContainer;
    
});