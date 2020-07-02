//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.charts.am.AmRadarCharts", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var AmRadarChart = Control.extend("u4a.charts.am.AmRadarCharts", {
        metadata : {
            library : "u4a.charts.am",
            properties : {
                width : { type : "sap.ui.core.CSSSize", defaultValue : "100%" },
                height : { type : "sap.ui.core.CSSSize", defaultValue : "500px" },
                marginBottom : { type: "int", defaultValue: 0 },
                marginLeft : { type: "int", defaultValue: 0 },
                marginRight : { type: "int", defaultValue: 0 },
                marginTop : { type: "int", defaultValue: 0 },
                startDuration : { type: "int", defaultValue: 2 },
                fontSize : { type: "int", defaultValue: 11 },
                radius : { type : "string", defaultValue : "35%" },
                startAlpha : { type: "float", defaultValue: 1 },
                backgroundAlpha : { type: "float", defaultValue: 0 },
                backgroundColor : { type : "sap.ui.core.CSSColor", defaultValue : "#ffffff" },
                borderAlpha : { type: "float", defaultValue: 0 },
                borderColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
                color : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },    // font color
                //axisTitleOffset : { type: "int", defaultValue: 20 },   // Axis 타이틀 위치
				showLegend : { type: "boolean", defaultValue: true },
				legendPosition : { type: "string", defaultValue: "bottom" },
				legendAlign : { type: "string", defaultValue: "center" },
				legendFontSize : { type: "int", defaultValue: 11 }                
            },

            events : {
                clickGraphItem : {
                    allowPreventDefault: true,
                }
            }

        }, // end of metadata

        init : function(){

            try {

                var amChart = AmCharts;
                if(typeof amChart == "undefined"){
                    jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function(){});
                }

                if(typeof AmCharts.AmRadarChart == "undefined"){
                    jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/radar.js", function(){});
                }

            }
            catch(e){
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function(){});
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/radar.js", function(){});
            }
			
			this._c = new AmCharts.AmRadarChart();
			
			this._attachChartEvent();

        },

        renderer : function(oRm, oControl){

            oRm.openStart("div", oControl);
            oRm.class("u4aAmRadarChart");
            oRm.style("width", oControl.getWidth());
            oRm.style("height", oControl.getHeight());

            oRm.openEnd();
            oRm.close("div");

        }, // end of renderer

        onAfterRendering : function(){

           // 차트를 생성한다.
           this._createChart();

           // 차트의 이벤트를 등록한다.
           //this._attachChartEvent();

           // Radar 차트의 ValueAxis 속성을 설정한다.
           //this._setValueAxis();

           // Radar 차트 finish
           this._chartUpdateData();

        }, // end of onAfterRendering

        setMarginBottom : function(iMargin){

            this.setProperty("marginBottom", iMargin, true);

            if(this._c == null) { return; }

            this._c.marginBottom = iMargin;

            this._chartUpdateData();

        },

        setMarginLeft : function(iMargin){

            this.setProperty("marginLeft", iMargin, true);

            if(this._c == null) { return; }

            this._c.marginLeft = iMargin;

            this._chartUpdateData();

        },

        setMarginRight : function(iMargin){

            this.setProperty("marginRight", iMargin, true);

            if(this._c == null) { return; }

            this._c.marginRight = iMargin;

            this._chartUpdateData();

        },

        setMarginTop : function(iMargin){

            this.setProperty("marginTop", iMargin, true);

            if(this._c == null) { return; }

            this._c.marginTop = iMargin;

            this._chartUpdateData();

        },

        setStartDuration : function(iMargin){

            this.setProperty("startDuration", iMargin, true);

            if(this._c == null) { return; }

            this._c.startDuration = iMargin;

            this._chartUpdateData();

        },

        setFontSize : function(iFontSize){

            this.setProperty("fontSize", iFontSize, true);

            if(this._c == null) { return; }

            this._c.fontSize = iFontSize;

            this._chartUpdateData();

        },

        setRadius : function(iValue){

            this.setProperty("radius", iValue, true);

            if(isNaN(iValue) && !jQuery.sap.endsWith(iValue, "%")){
                throw new Error('[U4AIDE] "Radius" 값은 숫자타입 또는 "%" 단위만 가능합니다');
            }

            if(this._c == null) { return; }

            this._c.radius = iValue;

            this._chartUpdateData();

        },

        setStartAlpha : function(iValue){

            this.setProperty("startAlpha", iValue, true);

            if(this._c == null) { return; }

            this._c.startAlpha = iValue;

            this._chartUpdateData();

        },

        setBackgroundAlpha : function(iValue){

            this.setProperty("backgroundAlpha", iValue, true);

            if(this._c == null) { return; }

            this._c.backgroundAlpha = iValue;

            this._chartUpdateData();

        },

        setBackgroundColor : function(sColor){

            this.setProperty("backgroundColor", sColor, true);

            if(this._c == null) { return; }

            this._c.backgroundColor = sColor;

            this._chartUpdateData();

        },

        setBorderAlpha : function(iValue){

            this.setProperty("borderAlpha", iValue, true);

            if(this._c == null) { return; }

            this._c.borderAlpha = iValue;

            this._chartUpdateData();

        },

        setBorderColor : function(iValue){

            this.setProperty("borderColor", iValue, true);

            if(this._c == null) { return; }

            this._c.borderColor = iValue;

            this._chartUpdateData();

        },

        setColor : function(sColor){

            this.setProperty("color", sColor, true);

            if(this._c == null) { return; }

            this._c.color = sColor;

            this._chartUpdateData();

        },
        
		/*
        setAxisTitleOffset : function(iValue){
            
            this.setProperty("axisTitleOffset", iValue, true);
            
            if(this._oValueAxes == null) { return; }

            this._oValueAxes.axisTitleOffset = iValue;

            this._chartUpdateData();
        
        },
		*/
		
		setShowLegend : function(p){
			
			this.setProperty('showLegend', p, true);
			
			this._setLegend(p, true);
			
        },
		
		setLegendPosition : function(p){
			
			this.setProperty('legendPosition', p, true);
			
			if(!this._c || !this._c.legend){ return; }
			
			this._c.legend.position = p;
			
			if(this._c.legend.position === ""){
				this._c.legend.position = "bottom";
			}
			
			this._c.validateNow();
			
        },
		
		setLegendAlign : function(p){
			
			this.setProperty('legendAlign', p, true);
			
			if(!this._c || !this._c.legend){ return; }
			
			this._c.legend.align = p;
			
			this._c.validateNow();
        },		

        _chartUpdateData : function(){
        
            if(this._c == null) { return; }
            
            this._c.validateNow();
            this._c.validateData();

        },

        _createChart : function(){

            // create Radar Chart
            if(!this._c){
				this._c = new AmCharts.AmRadarChart();
			}
			
			var oChart = this._c;
			
            // AmRadarChart setting
            oChart.marginBottom = this.getMarginBottom();
            oChart.marginLeft = this.getMarginLeft();
            oChart.marginRight = this.getMarginRight();
            oChart.marginTop = this.getMarginTop();
            oChart.startDuration = this.getStartDuration();
            oChart.fontSize = this.getFontSize();
            oChart.radius = this.getRadius();
            oChart.startAlpha = this.getStartAlpha();
            oChart.backgroundAlpha = this.getBackgroundAlpha();
            oChart.backgroundColor = this.getBackgroundColor();
            oChart.borderAlpha = this.getBorderAlpha();
            oChart.borderColor = this.getBorderColor();
            oChart.color = this.getColor();

            // 차트 요소에 css 클래스 부여하기
            oChart.addClassNames = true;
			
			// Legend 생성
			this._setLegend(this.getShowLegend());

            oChart.write(this.getId());

        },
		
		_setLegend : function(p, g){
			
			if(!this._c){ return; }
			
			this._c.removeLegend();
	
			var l = new AmCharts.AmLegend();
			
			l.enabled = p;
	
			l.align = this.getLegendAlign();
			
			l.position = this.getLegendPosition();
			
			if(l.position === ""){
				l.position = "bottom";
			}
			
			l.fontSize = this.getLegendFontSize();
	
			this._c.addLegend(l);
	
			if(!g){ return; }
	
			this._c.validateNow();			
			
		},
		
		/*
        _setValueAxis : function(){
            
            var oAmRadar = this._c,
                aValueAxis = oAmRadar.valueAxes,

                oValueAxis = {};

            if(aValueAxis.length == 0){
                oValueAxis = new AmCharts.ValueAxis();
            }
            else {
				
                oValueAxis = oAmRadar.valueAxes[0];
            }

            oValueAxis.axisTitleOffset = this.getAxisTitleOffset();
            oValueAxis.minimum = 0;
            oValueAxis.axisAlpha = 0.15;

            this._c.valueAxes[0] = oValueAxis;

            this._oValueAxes = this._c.valueAxes[0];

        },
		*/

        _attachChartEvent : function(){
			
			if(!this._c){
				return;				
			}	
			
			var that = this;
			
            this._c.addListener("clickGraphItem", function(oEvent){
				that.fireClickGraphItem(oEvent);				
			});            

        }
        
    });

    return AmRadarChart;

});