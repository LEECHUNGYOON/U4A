//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.charts.am.SingleDonutChart", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var DonutChart = Control.extend("u4a.charts.am.SingleDonutChart", {
        metadata : {
            library : "u4a.charts.am",
            properties : {
                width : { type : "sap.ui.core.CSSSize", defaultValue : "50%" },
                height : { type : "sap.ui.core.CSSSize", defaultValue : "50%" },
                sliceValue : { type: "float", defaultValue: 0 },
                sliceColor : { type : "sap.ui.core.CSSColor", defaultValue : "#FF0F00" },
                innerRadius : { type: "int", defaultValue: 0 },
                innerText : {type : "string", defaultValue : null},
                fontColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
                fontSize : { type: "int", defaultValue: 30 },
                fontX : { type: "int", defaultValue: 50 },
                fontY : { type: "int", defaultValue: 45 }
            },

            events : {
                clickSlice : {
                    allowPreventDefault: true,
                },
				clickChart : {
					allowPreventDefault: true,
				}
            }
        }, // end of metadata

        init : function(){

            try {
                var amChart = AmCharts.AmPieChart;
				if(typeof amChart == "undefined"){
					jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js", function(){});
				}
            }
            catch(e){
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function(){});
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js", function(){});
            }

        },

        renderer : function(oRm, oControl){
			
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.write(">");
            
			oRm.write("</div>");

        }, // end of renderer

        onAfterRendering : function(){

            // 차트를 생성한다.
            this._createChart();
			
			// 차트 클릭 이벤트를 설정한다.
			this._attachChartEvent();

        }, // end of onAfterRendering
		
		_attachChartEvent : function(){
			
			var that = this,
				oChartDom = document.getElementById(this.getId());
				
			if(oChartDom == null){
				return;				
			}
			
			oChartDom.onclick = function(e){
				
				// slice가 눌렸으면 부모 이벤트 skip
				if(that._sliceClick && that._sliceClick == 'X'){
					that._sliceClick = null;
					return;
				}
				
				//var mProperties = that.mProperties;
                that.fireClickChart();
			}		
			
		},

        _createChart : function(){

			var that = this,
			oSliceValues = this._checkSliceValue(),

			iSliceValueFrom = oSliceValues.fromValue,
			iSliceValueTo = oSliceValues.toValue,
			sSliceColor = this.getSliceColor(),

			chartDataProvider = [
                {
                    "value": iSliceValueFrom,      //프로퍼티 "value"
                    "color": sSliceColor //프로퍼티 "color"
                },
                {
                    "value": iSliceValueTo,
                    "color":"#EEEEEE"
                }
            ];

			//AmCharts.ready(function(){

				var Chart = new AmCharts.AmPieChart();

				that.PieChart = Chart;

				Chart.dataProvider = chartDataProvider;
				Chart.valueField    = "value";         //고정
				Chart.colorField    = "color";         //고정
				Chart.labelText     = "";              //고정
				Chart.balloonText   = "";              //고정
				Chart.radius        = "43%"            //고정
				Chart.pullOutRadius = "0%";            //고정
				Chart.startDuration = 0;
				Chart.innerRadius = that.getInnerRadius() + "%";

				// 차트의 라벨을 생성한다.
				that._addChartLabel();

				// 차트의 클릭 이벤트를 등록한다.
				that._attachClickEvent();
				
				 // WRITE
				Chart.write(that.getId());
				
				var _aCssClass = that.aCustomStyleClasses;
				if(_aCssClass == null){
					return;
				}
				
				var sCssClassNm = _aCssClass.join(" ");
				jQuery(this.getDomRef()).addClass(sCssClassNm);
				
				
				/*
				// style class
				var oChartDom = document.getElementById(that.getId());

				var _aCssClass = that.aCustomStyleClasses;
				if(_aCssClass == null || oChartDom == null){
					return;
				}

				var _aClassLength = _aCssClass.length;
				for(var i = 0; i < _aClassLength; i++){
					oChartDom.classList.add(_aCssClass[i]);
				}
				*/

        }, // end of _createChart

        _attachClickEvent : function(){

            var that = this;

            this.PieChart.addListener("clickSlice",function(e){
                
				// slice가 클릭 되었다는 flag
                that._sliceClick = 'X';
				
				//var mProperties = e.dataItem;    
                that.fireClickSlice();
				
            });

        }, // end of _attachClickEvent

        _addChartLabel : function(){

            var iFontSize = this.getFontSize(),
                sFontColor = this.getFontColor(),
                sInnerText = this.getInnerText(),
                iFontX = this.getFontX() + "%",
                iFontY = this.getFontY() + "%";

            this.PieChart.addLabel(iFontX, iFontY, sInnerText, "middle", iFontSize, sFontColor, undefined, false, true);

        }, // end of _addChartLabel

        _checkSliceValue : function(){

            var oReturnValue = { fromValue : 0, toValue : 100 };

            var sSliceValue = this.getSliceValue();
            if(sSliceValue <= 0){
                return oReturnValue;
            }

            if(sSliceValue >= 100){
                oReturnValue.fromValue = 100;
                oReturnValue.toValue = 0;

                return oReturnValue;
            }

            oReturnValue.fromValue = sSliceValue;
            oReturnValue.toValue = 100 - sSliceValue;

            return oReturnValue;

        } // end of _checkSliceValue

    });

    return DonutChart;

});

