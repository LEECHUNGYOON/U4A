sap.ui.define("u4a.charts.am5.Grid", [
    "u4a/charts/am5/Graphics"
    
],function(Graphics){
    "use strict";
    
    let _oGrid = Graphics.extend("u4a.charts.am5.Grid", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                
                //grid가 위치할 position 정보.
                //해당 속성은 CategoryAxis에서만 동작한다.
                //0 ~ 1의 값을 입력할 수 있다.
                //값이 0에 가까워 질수록 세로 배경선이 왼쪽으로 이동한다.
                //값이 1에 가까워 질수록 세로 배경선이 오른쪽으로 이동한다.
                //0보다 작은 값을 입력한 경우 세로 배경선이 더 왼쪽으로 이동되며
                //1보다 큰 값을 입력한 경우 세로 배경선이 더 오른쪽로 이동된다.
                //(세로 배경선이 차트 출력 영역을 벗어나게됨)
                location : { type : "float" }

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


            this._oChart.oChartInstance = am5xy.Grid.new(_oParent?._oChart?.oRoot, _sChartProp);


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
            if(typeof _oParent?._setChartGridSetting !== "undefined"){
                _oParent._setChartGridSetting(propName, propValue);
                return;
            }

            Graphics.prototype._setChartSettings.apply(this, [propName, propValue]);

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

            if(typeof _oRenderer?.grid?.template?.setAll === "undefined"){
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
            _oRenderer.grid.template.setAll(_sReset);


            if(_isChanged === false){
                return;
            }

            //예외처리 대상 setting값을 한번에 적용 처리.
            _oRenderer.grid.template.setAll(_sSettings);


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
         * @function - visible 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setVisible : function(propValue){

            let _propValue = this._setProperty("visible", propValue);


            //차트 Instance에 visible settings 값 반영 처리.
            this._setChartSettings("visible", _propValue);

        }
        
    });

    return _oGrid;
    
});