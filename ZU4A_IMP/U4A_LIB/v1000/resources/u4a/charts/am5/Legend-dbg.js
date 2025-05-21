sap.ui.define("u4a.charts.am5.Legend", [
    "u4a/charts/am5/Series"
    
],function(Series){
    "use strict";

   
    let _oLegend = Series.extend("u4a.charts.am5.Legend", {
        metadata : {
            library : "u4a.charts.am5",

            aggregations : {

                //legend label 세팅.
                labelStyle : { type : "u4a.charts.am5.LabelStyle", multiple : false },
                
                //legend marker 세팅.
                markerStyle : { type : "u4a.charts.am5.MarkerStyle", multiple : false }

            },
    
        }, /* end of metadata */
    
        init : function(){
            
            Series.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
            
            Series.prototype.exit.apply(this, arguments);
        
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 Legend 생성 처리.
         *************************************************************/
        _createLegend : function (){
            
            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }
                        
                        
            //Legend의 속성정보 얻기.
            let _sChartProp = this._getChartProperies();

            _sChartProp.visible = this.getVisible();

            //am5의 Legend 생성 처리.
            this._oChart.oChartInstance = am5.Legend.new(_oParent._oChart.oRoot, _sChartProp);

                        
            let _oLabelStyle = this.getLabelStyle() || undefined;

            //label style 처리 UI 정보가 존재하는경우
            if(typeof _oLabelStyle !== "undefined"){

                //해당 UI의 속성값으로 legend label style 처리.
                this._oChart.oChartInstance.labels.template.setAll(_oLabelStyle._getChartData());

                this._oChart.oChartInstance.valueLabels.template.setAll(_oLabelStyle._getChartData());

            }


            let _oMarkerStyle = this.getMarkerStyle() || undefined;

            //marker style 처리 UI 정보가 존재하는경우
            if(typeof _oMarkerStyle !== "undefined"){
                //해당 UI의 속성값으로 marker style 처리.
                this._oChart.oChartInstance.markers.template.setAll(_oMarkerStyle._getChartData());

            }


            return this._oChart.oChartInstance;
            
        },


        /*************************************************************
         * @function - legend의 labels에 값 반영 처리.
         *************************************************************/
        _setChartLabelsSetting : function(name, value){
            
            if(typeof this?._oChart?.oChartInstance === "undefined"){
                return;
            }

            if(typeof this._oChart?.oChartInstance?.labels?.template?.set === "undefined"){
                return;
            }

            if(typeof this._oChart?.oChartInstance?.valueLabels?.template?.set === "undefined"){
                return;
            }


            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            let _val = this._convAM5Property(name, value);


            this._oChart.oChartInstance.labels.template.set(name, _val);

            this._oChart.oChartInstance.valueLabels.template.set(name, _val);


            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirtySize();


        },


        /*************************************************************
         * @function - legend의 markers에 값 반영 처리.
         *************************************************************/
        _setChartMarkersSetting : function(name, value){
            
            if(typeof this._oChart?.oChartInstance?.markers?.template?.set === "undefined"){
                return;
            }


            //legend markerStyle의 width의 값이 없는경우(default 값으로 설정된경우)
            //markers의 width 속성 정보 제거.
            //(legend의 markers의 경우 이전 크기로 되돌릴때 set('width', undefined)
            //가 적용되지 않기에 이전에 적용한 width 속성을 제거 해야 이전값으로 돌아간다)
            if(name === "width" && value === undefined){
                this._oChart.oChartInstance.markers.template.remove(name);
                return;
            }

            //legend markerStyle의 height의 값이 없는경우(default 값으로 설정된경우)
            //markers의 height 속성 정보 제거.
            //(legend의 markers의 경우 이전 크기로 되돌릴때 set('height', undefined)
            //가 적용되지 않기에 이전에 적용한 height 속성을 제거 해야 이전값으로 돌아간다)
            if(name === "height" && value === undefined){
                this._oChart.oChartInstance.markers.template.remove(name);
                return;
            }

            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            let _val = this._convAM5Property(name, value);


            this._oChart.oChartInstance.markers.template.set(name, _val);

            //반영된 값을 즉시 적용 처리.
            this._oChart.oChartInstance.markDirtySize();

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oChartInstance?.markDirtySize === "undefined"){
                return;
            }

            _oParent._oChart.oChartInstance.markDirtySize();

        }
        
    });

    return _oLegend;
    
});