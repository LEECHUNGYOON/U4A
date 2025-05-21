sap.ui.define("u4a.charts.am5.LabelStyle", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";
    
    let _oLabelStyle = Graphics.extend("u4a.charts.am5.LabelStyle", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //label의 위치 정보.
                //default 0.5인경우 category가 출력되는 cell 영역의 중앙에 category text가 출력된다.
                //0에 가까워질수록 x축과 y축이 만나는 지점에 category text가 출력된다.
                //1에 가까워질수록 category가 출력되는 cell 영역의 오른쪽으로 category text가 출력된다.
                //0보다 작은 값을 입력한 경우 category text가 더 왼쪽으로 이동되며
                //1보다 큰 값을 입력한 경우 category text가 더 오른쪽로 이동된다.
                //(text가 차트 출력 영역을 벗어나게됨)
                location : { type : "float", defaultValue : 0.5 },

                
                //label의 기준선 위치를 조정하는 속성값.
                //값이 커질수록 기준선보다 위로 이동한다.
                //값이 작아질수록 기준선보다 아래로 이동한다.
                //(columnSeries의 막대 그래프 위에 label을 추가하여
                //막대 그래프의 끝에 label이 표시되는 상황일 경우 
                //baselineRatio 값을 1로 변경시 막대 그래프의 끝 지점에서
                //label이 상단으로 이동하여 표현된다.)
                baselineRatio : { type : "float", defaultValue: 0.19 },


                //글꼴.
                fontFamily : { type : "string", defaultValue: "" },


                //폰트 크기.
                fontSize : { type : "int", defaultValue: 16 },


                //폰트 굵기.
                //normal, bold, lighter, bolder, 100 ~ 900의 값을 입력할 수 있다.
                fontWeight : { type : "string", defaultValue: "" },

                
                //label이 그래프 안에 표현 할지 여부.
                //true로 설정할 경우 그래프 안에 label이 표현된다.
                inside : { type : "boolean", defaultValue: false }
            
            }
    
    
        }, /* end of metadata */
    
        init : function(){
            
            Graphics.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        
        exit : function(){
    
            Graphics.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //컬럼의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            _sChartData.visible = this.getVisible();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();
            
            return _sChartData;

        },


        /*************************************************************
         * @function - sprite에 추가할 am5 차트 Instance 생성.
         *************************************************************/
        _createSprite : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //차트 요소에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();

            _sChartProp.visible = this.getVisible();


            this._oChart.oChartInstance = am5xy.AxisLabel.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;

        },


        /*************************************************************
         * @function - 차트 Instance에 settings 값 반영 처리.
         *************************************************************/
        _setChartSettings : function(propName, propValue){
                        
            let _oParent = this.getParent();

            //현재 labelStyle의 부모 chartInstance가 존재하지 않는경우.
            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                this._updateChartData();
                return;
            }


            //부모 labelStyle의 label 업데이트 처리 정보가 존재하는경우.
            if(typeof _oParent?._setChartLabelsSetting !== "undefined"){
                _oParent._setChartLabelsSetting(propName, propValue);
                return;
            }

        },


        /*************************************************************
         * @function - 차트 Instance에 예외처리 setting 값 반영.
         *  예외처리 대상 setting값의 경우 blur을 적용한뒤, brightness을 적용하게되면
         *  적용된 blur가 해제 되는 내용이 존재함.
         *  따라서 예외처리 대상 setting값을 제거한뒤, 해당 setting값을 모두 수집하여
         *  한번에 적용 처리하는 예외로직.
         *************************************************************/
        _setChartExcepSetting : function(){

            let _oParent = this.getParent();

            //현재 labelStyle의 부모 chartInstance가 존재하지 않는경우.
            if(typeof _oParent?._oChart?.oChartInstance === "undefined"){
                this._updateChartData();
                return;
            }


            let _oRenderer = _oParent?._oChart?.oChartInstance.get("renderer");

            if(typeof _oRenderer?.labels?.template?.setAll === "undefined"){
                return;
            }

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return;
            }

            //예외처리 대상 프로퍼티 항목.
            let _aExcepProp = [
                "blur",
                "brightness",
                "contrast",
                "hue",
                "invert",
                "saturate",
                "sepia"
            ];


            let _sReset = {};

            let _sSettings = {};

            let _isChanged = false;


            for (let i = 0, l = _aExcepProp.length; i < l; i++) {
                
                let _excepProp = _aExcepProp[i];
                
                //metaData의 프로퍼티 정보 얻기.
                let _oProp = _oMeta.getProperty(_excepProp);

                if(typeof _oProp === "undefined"){
                    continue;
                }

                let _val = this.getProperty(_excepProp);

                if(_val !== _oProp.getDefaultValue()){
                    _isChanged = true;
                }


                //예외처리 대상 setting 항목 null 처리로 수집.
                _sReset[_excepProp] = null;

                
                //UI에 적용된 프로퍼티 정보를 차트에 적용할 settings 값 수집.
                //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
                _sSettings[_excepProp] = this._convAM5Property(_excepProp, _val);

                
            }
            

            //예외처리 대상 setting값을 초기화 처리.
            _oRenderer.labels.template.setAll(_sReset);


            if(_isChanged === false){
                return;
            }

            //예외처리 대상 setting값을 한번에 적용 처리.
            _oRenderer.labels.template.setAll(_sSettings);

        },


        /*************************************************************
         * @function - location 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLocation : function(propValue){

            let _propValue = this._setProperty("location", propValue);


            //차트 Instance에 location settings 값 반영 처리.
            this._setChartSettings("location", _propValue);


        },


        /*************************************************************
         * @function - baselineRatio 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setBaselineRatio : function(propValue){

            let _propValue = this._setProperty("baselineRatio", propValue);


            //차트 Instance에 baselineRatio settings 값 반영 처리.
            this._setChartSettings("baselineRatio", _propValue);

        },


        /*************************************************************
         * @function - fontFamily 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontFamily : function(propValue){

            let _propValue = this._setProperty("fontFamily", propValue);


            //차트 Instance에 fontFamily settings 값 반영 처리.
            this._setChartSettings("fontFamily", _propValue);

        },


        /*************************************************************
         * @function - fontSize 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontSize : function(propValue){

            let _propValue = this._setProperty("fontSize", propValue);


            //차트 Instance에 fontSize settings 값 반영 처리.
            this._setChartSettings("fontSize", _propValue);


        }, 


        /*************************************************************
         * @function - fontWeight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFontWeight : function(propValue){

            let _propValue = this._setProperty("fontWeight", propValue);


            //차트 Instance에 fontWeight settings 값 반영 처리.
            this._setChartSettings("fontWeight", _propValue);

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
         * @function - visible 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setVisible : function(propValue){

            let _propValue = this._setProperty("visible", propValue);


            //차트 Instance에 visible settings 값 반영 처리.
            this._setChartSettings("visible", _propValue);

        },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){
            
            let _propValue = this._setProperty("fill", propValue);

            //fill에 적용된 값이 존재하지 않는경우 default theme에 적용한
            //fill 색상 코드를 매핑.
            //am5.color(""); 처리시 오류가 발생함.
            //am5.color(""); 에서 발생한 오류를 try catch 처리 하여 catch에서 return 처리시 
            //이전 색상이 남아있기에 공백의 색상 정보가 입력된 경우 default 색상 정보를 매핑.
            //(잘못된 색상 코드에 대한 처리를 하지 않음.)
            if(typeof _propValue === "undefined"){
                _propValue = sap.ui.core.theming.Parameters.get("sapTextColor");
            }


            //차트 Instance에 fill settings 값 반영 처리.
            this._setChartSettings("fill", _propValue);

        }
        
    });

    return _oLabelStyle;
    
});