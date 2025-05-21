sap.ui.define("u4a.charts.am5.MarkerStyle", [
    "u4a/charts/am5/Sprite"
    
],function(Sprite){
    "use strict";
    
    let _oMarkerStyle = Sprite.extend("u4a.charts.am5.MarkerStyle", {
        metadata : {
            library : "u4a.charts.am5",

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
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //컬럼의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();
            
            return _sChartData;

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


            //부모 markersStyle의 markers 업데이트 처리 정보가 존재하는경우.
            if(typeof _oParent?._setChartMarkersSetting !== "undefined"){
                _oParent._setChartMarkersSetting(propName, propValue);
                return;
            }

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
            if(typeof _oParent?._setChartMarkersSetting !== "undefined"){
                _oParent._setChartMarkersSetting(propName, propValue);
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


            let _oRenderer = _oParent?._oChart?.oChartInstance;

            if(typeof _oRenderer?.markers?.template?.setAll === "undefined"){
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
            _oRenderer.markers.template.setAll(_sReset);


            if(_isChanged === false){
                return;
            }

            //예외처리 대상 setting값을 한번에 적용 처리.
            _oRenderer.markers.template.setAll(_sSettings);

        }
        
    });

    return _oMarkerStyle;
    
});