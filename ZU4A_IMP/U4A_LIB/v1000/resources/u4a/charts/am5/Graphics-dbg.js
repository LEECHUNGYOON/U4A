sap.ui.define("u4a.charts.am5.Graphics", [
    "u4a/charts/am5/Sprite"
    
],function(Sprite){
    "use strict";
    
    let _oGraphics = Sprite.extend("u4a.charts.am5.Graphics", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 채우기 색상.(#ffffff)
                //bullet UI를 구성하는경우, bullet의 내부 색상을 정의할 수 있다.
                fill : { type : "sap.ui.core.CSSColor" },


                //차트 요소의 채우기 색상 투명도.
                //bullet UI를 구성하는경우, bullet의 내부 색상의 투명도를 정의할 수 있다.
                //0 ~ 1의 값을 허용하며,
                //0에 가까워 질수록 투명해진다.
                //1에 가까워 질수록 불투명해진다.
                //1 이상의 값을 입력할 경우 1의 값으로 설정된다.
                fillOpacity : { type : "float", defaultValue : 0 },


                //차트 요소의 테두리 색상.(#ffffff)
                //bullet UI를 구성하는경우, bullet의 테두리 색상을 정의할 수 있다.
                stroke : { type : "sap.ui.core.CSSColor" },


                //차트 요소의 테두리 점선 표현.
                //bullet UI를 구성하는경우, bullet의 테두리를 점선으로 표현할 수 있다.
                //값이 커질수록 점선 간격이 커진다.
                strokeDasharray : { type : "int", defaultValue : 0 },

                //차트 요소의 테두리 선 투명도.
                //bullet UI를 구성하는경우, bullet의 테두리를 선의 투명도를 정의할 수 있다.
                //0 ~ 1의 값을 허용하며,
                //0에 가까워 질수록 투명해진다.
                //1에 가까워 질수록 불투명해진다.
                //1 이상의 값을 입력할 경우 1의 값으로 설정된다.
                strokeOpacity : { type : "float", defaultValue : 0 },


                //차트 요소의 테두리 선 두께.
                //bullet UI를 구성하는경우, bullet의 테두리를 선의 두께를 정의할 수 있다.
                //값이 커질수록 테두리 선의 두께가 점점 두꺼워진다.
                strokeWidth : { type : "int", defaultValue : 0 }

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


        // /*************************************************************
        //  * @function - Sprite의 _setChartSettings 펑션 재정의.
        //  *************************************************************/
        // _setChartSettings : function(name, value){

        //     if(typeof this?._oChart?.oChartInstance === "undefined"){
        //         return;
        //     }
            
            
        //     var _oParent = this.getParent() || undefined;

        //     //부모 UI 정보(bullet UI)가 존재하지 않는경우 exit.
        //     if(typeof _oParent === "undefined"){
        //         return;
        //     }

        //     var _oParent = _oParent.getParent() || undefined;

        //     //부모 UI 정보(series UI)가 존재하지 않는경우 exit.
        //     if(typeof _oParent?._oChart?.oChartInstance?.bulletsContainer?.children?.values === "undefined"){                
        //         Sprite.prototype._setChartSettings.apply(this, arguments);
        //         return;
        //     }

        //     //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
        //     let _val = this._convAM5Property(value);

        //     let _obulletsContainer = _oParent?._oChart?.oChartInstance.bulletsContainer;

        //     for (let i = 0; i < _obulletsContainer.children.values.length; i++) {
                
        //         var _oSprite = _obulletsContainer.children.values[i];

        //         // //차트의 setting값 반영 처리.
        //         _oSprite.set(name, _val);

        //         //반영된 값을 즉시 적용 처리.
        //         _oSprite.markDirty();
                
        //     }

        // },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){

            let _propValue = this._setProperty("fill", propValue);

            //차트 Instance에 fill settings 값 반영 처리.
            this._setChartSettings("fill", _propValue);

        },


        /*************************************************************
         * @function - fillOpacity 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFillOpacity : function(propValue){

            let _propValue = this._setProperty("fillOpacity", propValue);


            //차트 Instance에 fillOpacity settings 값 반영 처리.
            this._setChartSettings("fillOpacity", _propValue);

        },


        /*************************************************************
         * @function - stroke 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStroke : function(propValue){

            let _propValue = this._setProperty("stroke", propValue);

            //차트 Instance에 stroke settings 값 반영 처리.
            this._setChartSettings("stroke", _propValue);

        },


        /*************************************************************
         * @function - strokeDasharray 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeDasharray : function(propValue){

            let _propValue = this._setProperty("strokeDasharray", propValue);


            //차트 Instance에 strokeDasharray settings 값 반영 처리.
            this._setChartSettings("strokeDasharray", _propValue);

        },


        /*************************************************************
         * @function - strokeOpacity 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeOpacity : function(propValue){

            let _propValue = this._setProperty("strokeOpacity", propValue);


            //차트 Instance에 strokeOpacity settings 값 반영 처리.
            this._setChartSettings("strokeOpacity", _propValue);

        },


        /*************************************************************
         * @function - strokeWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeWidth : function(propValue){

            let _propValue = this._setProperty("strokeWidth", propValue);


            //차트 Instance에 strokeWidth settings 값 반영 처리.
            this._setChartSettings("strokeWidth", _propValue);

        }

        
    });

    return _oGraphics;
    
});