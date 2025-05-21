sap.ui.define("u4a.charts.am5.Axis", [
    "u4a/charts/am5/Component"
    
],function(Component){
    "use strict";
    
    let _oAxis = Component.extend("u4a.charts.am5.Axis", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //Y축의 숫자를 차트 안에 표현할지 여부.
                //true : 차트 안에 숫자를 표현함.
                inside : { type : "boolean", defaultValue : false },

                
                //axis를 거꾸로 표현할지 여부.(AxisRenderer 속성정보)
                //true로 설정하면 y축의 경우 위에서 아래로 차트를 표현한다.
                //true로 설정하면 x축의 경우 오른쪽에서 왼쪽으로 차트를 표현한다.
                inversed : { type : "boolean", defaultValue : false },

                
                //X축 선의 색상. (am5.Graphics 속성정보)
                //(am5의 renderer setting에서 사용될 속성정보)
                stroke : { type : "sap.ui.core.CSSColor", defaultValue : "" },

                    
                //x축 선의 투명도. (am5.Graphics 속성정보)
                //값이 0에 가까워질수록 투명해진다.
                //값이 1에 가까워질수록 불투명해진다.
                //(am5의 renderer setting에서 사용될 속성정보)
                strokeOpacity : { type : "float", defaultValue : 0 },


                //x축 선의 점선 간격.(am5.Graphics 속성정보)
                //(am5의 renderer setting에서 사용될 속성정보)
                strokeDasharray : { type : "int", defaultValue : 0 },


                //x축 선의 점선 간격.(am5.Graphics 속성정보)
                //(am5의 renderer setting에서 사용될 속성정보)
                strokeDashoffset : { type : "int", defaultValue : 0 },


                //x축 선의 두께(Graphics 속성정보)
                //(am5의 renderer setting에서 사용될 속성정보)
                strokeWidth : { type : "int", defaultValue : 1 },

                
                //label 출력건의 최대 출력 건수 설정.
                //y축의 라벨 출력건이 10개 인경우 maxPosition 값을 0.9 입력시
                //마지막 y축의 시작 지점부터 라벨이 출력하여 9번째 라벨까지만 출력한다.
                maxPosition : { type : "float", defaultValue : 1 },


                //label 출력건의 최소 출력 건수 설정.
                //y축의 라벨 출력건이 10개 인경우 maxPosition 값을 0.1 입력시
                //마지막 y축의 시작 지점의 라벨이 생략되며, 이후 9개의 라벨을 출력한다.
                minPosition : { type : "float", defaultValue : 0 }

            },

            aggregations : {

                //y축의 기준선 정보.
                guideLineRanges : { type : "u4a.charts.am5.GuideLineRange", multiple : true, singularName: "guideLineRange" },
                
            }
    
    
        }, /* end of metadata */
    
        init : function(){
            
            Component.prototype.init.apply(this, arguments);
    
        }, /* end of init */
        
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
    
        exit : function(){
            
            Component.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */

        
        /*************************************************************
         * @function - y축의 기준선 정보 생성 처리.
         *************************************************************/
        _createGuideLineRange : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _aGuideLines = this.getGuideLineRanges();

            if(_aGuideLines.length === 0){
                return;
            }

            for (let i = 0, l = _aGuideLines.length; i < l; i++) {
                
                let _oGuideLines = _aGuideLines[i];

                //기준선 정보 생성 처리.
                _oGuideLines._createGuideLineRange(this);
                
            }

        },


        /*************************************************************
         * @function - 차트 Instance의 renderer에 settings 값 반영 처리.
         *************************************************************/
        _setChartRendererSetting : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oRenderer = this._oChart.oChartInstance.get("renderer");

            if(typeof _oRenderer === "undefined"){
                return;
            }


            //차트의 setting값 반영 처리.
            _oRenderer.set(name, this._convAM5Property(name, value));

            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirtySize();
            
            if(typeof this?._oChart?.oChartInstance?.chart.markDirtySize === "function"){
                this._oChart.oChartInstance.chart.markDirtySize();
            }

        },


        /*************************************************************
         * @function - y축 renderer의 labels에 값 반영 처리.
         *************************************************************/
        _setChartLabelsSetting : function(name, value){
            
            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oRenderer = this._oChart.oChartInstance.get("renderer");

            if(typeof _oRenderer?.labels?.template?.set === "undefined"){
                return;
            }

            _oRenderer.labels.template.set(name, this._convAM5Property(name, value));


            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirtySize();


        },


        /*************************************************************
         * @function - y축 renderer의 grid에 값 반영 처리.
         *************************************************************/
        _setChartGridSetting : function(name, value){
            
            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            let _oRenderer = this._oChart.oChartInstance.get("renderer");

            if(typeof _oRenderer?.grid?.template?.set === "undefined"){
                return;
            }

            _oRenderer.grid.template.set(name, this._convAM5Property(name, value));


            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirtySize();


        },

        
        /*************************************************************
         * @function - inside 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInside : function(propValue){

            let _propValue = this._setProperty("inside", propValue);


            //차트 Instance에 inside settings 값 반영 처리.
            this._setChartSettings("inside", _propValue);

        },


        /*************************************************************
         * @function - inversed 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInversed : function(propValue){

            let _propValue = this._setProperty("inversed", propValue);


            //차트 Instance에 inversed settings 값 반영 처리.
            this._setChartRendererSetting("inversed", _propValue);

        },


        /*************************************************************
         * @function - stroke 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStroke : function(propValue){

            let _propValue = this._setProperty("stroke", propValue);

            //stroke에 적용된 값이 존재하지 않는경우 default theme에 적용한
            //stroke 색상 코드를 매핑.
            //am5.color(""); 처리시 오류가 발생함.
            //am5.color(""); 에서 발생한 오류를 try catch 처리 하여 catch에서 return 처리시 
            //이전 색상이 남아있기에 공백의 색상 정보가 입력된 경우 default 색상 정보를 매핑.
            //(잘못된 색상 코드에 대한 처리를 하지 않음.)
            if(_propValue === ""){
                _propValue = sap.ui.core.theming.Parameters.get("sapTextColor");
            }


            //차트 Instance에 stroke settings 값 반영 처리.
            this._setChartRendererSetting("stroke", this._getAm5Color(_propValue));

        },


        /*************************************************************
         * @function - strokeOpacity 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeOpacity : function(propValue){

            let _propValue = this._setProperty("strokeOpacity", propValue);


            //차트 Instance에 strokeOpacity settings 값 반영 처리.
            this._setChartRendererSetting("strokeOpacity", _propValue);

        },


        /*************************************************************
         * @function - strokeDasharray 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeDasharray : function(propValue){

            let _propValue = this._setProperty("strokeDasharray", propValue);


            //차트 Instance에 strokeDasharray settings 값 반영 처리.
            this._setChartRendererSetting("strokeDasharray", _propValue);

        },


        /*************************************************************
         * @function - strokeDashoffset 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeDashoffset : function(propValue){

            let _propValue = this._setProperty("strokeDashoffset", propValue);


            //차트 Instance에 strokeDashoffset settings 값 반영 처리.
            this._setChartRendererSetting("strokeDashoffset", _propValue);

        },


        /*************************************************************
         * @function - strokeWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setStrokeWidth : function(propValue){

            let _propValue = this._setProperty("strokeWidth", propValue);


            //차트 Instance에 strokeWidth settings 값 반영 처리.
            this._setChartRendererSetting("strokeWidth", _propValue);

        },


        /*************************************************************
         * @function - maxPosition 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxPosition : function(propValue){

            let _propValue = this._setProperty("maxPosition", propValue);


            //차트 Instance에 maxPosition settings 값 반영 처리.
            this._setChartLabelsSetting("maxPosition", _propValue);

        },


        /*************************************************************
         * @function - minPosition 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinPosition : function(propValue){

            let _propValue = this._setProperty("minPosition", propValue);


            //차트 Instance에 minPosition settings 값 반영 처리.
            this._setChartLabelsSetting("minPosition", _propValue);

        },


        /*************************************************************
         * @function - width 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWidth : function(propValue){

            let _propValue = this._setProperty("width", propValue);

            if(typeof _propValue === "undefined" || _propValue === null || _propValue === ""){
                _propValue = "100%";
            }
                
            this._setChartSettings("width", _propValue);
            
        },
        
        
        /*************************************************************
         * @function - height 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHeight : function(propValue){

            let _propValue = this._setProperty("height", propValue);

            if(typeof _propValue === "undefined" || _propValue === null || _propValue === ""){
                _propValue = "100%";
            }
                
            this._setChartSettings("height", _propValue);
            
        },
        
    });

    return _oAxis;
    
});