//Copyright 2017. INFOCG Inc. all rights reserved.
sap.ui.define("u4a.charts.am.AngularGauge", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var AngularGauge = Control.extend("u4a.charts.am.AngularGauge", {
        metadata : {
            library : "u4a.charts.am",
            properties : {
				
                // 차트 설정
                width : {  type : "sap.ui.core.CSSSize", defaultValue : "100%" }, // 차트 넓이
                height : {  type : "sap.ui.core.CSSSize", defaultValue : "100%" }, // 차트 높이
                startValue : { type: "int", defaultValue: 0 },  // 차트 시작 값
                endValue : { type: "int", defaultValue: 100 },  // 차트 마지막 값
                startAngle : { type: "int", defaultValue: -90 },  // 차트 그리는 영역의 시작 위치
                endAngle : { type: "int", defaultValue: 90 },     // 차트 그리는 영역의 마지막 위치
                fontSize : { type: "int", defaultValue: 10 },   // 차트 전체 폰트 크기
                valueInterval : { type: "int", defaultValue: 10 },    // 눈금자 간격
                tickThickness : { type: "int", defaultValue: 1 },     // 눈금자 라인 두께
                outlineThickness : { type: "int", defaultValue: 2 },  // 외곽 라인 두께
                unit : { type: "string", defaultValue: null },        // 눈금자 단위값
                centerX : { type : "sap.ui.core.CSSSize", defaultValue : "0%" }, // 차트 X 위치
                centerY : { type : "sap.ui.core.CSSSize", defaultValue : "0%" }, // 차트 Y 위치

                // 상단 텍스트
                headerTitle : { type: "string", defaultValue: null },	// 차트 타이틀
                headerTitleSize : { type: "int", defaultValue: 20 },	// 차트 타이틀 크기
                headerTitleColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" }, // 차트 색상
                headerTitleBold : {type : "boolean", defaultValue : true },	// 차트 굵기

                // 중간 텍스트
                innerTitle : { type: "string", defaultValue: null },	// 차트 내의 상단 타이틀
                innerTitleSize : { type: "int", defaultValue: 20 },		// 차트 내의 상단 타이틀 크기
                innerTitleColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" }, // 타이틀 색상
                innerTitleBold : {type : "boolean", defaultValue : true }, // 차트 내의 상단 타이틀 굵기

                // 하단 텍스트
                bottomText : { type: "string", defaultValue: null },	// 하단 텍스트
                bottomTextColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" }, // 하단 텍스트색상
                bottomTextSize : { type: "int", defaultValue: 20 },		// 하단 텍스트 크기
                bottomTextBold : {type : "boolean", defaultValue : true },	// 하단 텍스트 굵기

                // 화살표
                arrowValue : { type: "float", defaultValue: 0 }, // 화살표 가리키는 위치
                arrowRadius : {  type : "sap.ui.core.CSSSize", defaultValue : "100%" }, // 화살표 길이
            },

            defaultAggregation : "gaugeBand",

            aggregations : {
              "gaugeBands" : { type : "u4a.charts.am.AngularGaugeBand", multiple : true, singularName: "gaugeBand" },
            },

			events : {
				gaugeClick : {}
			}

        }, // end of metadata

        init : function(){
            try {
                var amChart = AmCharts.AmAngularGauge;
                if(typeof amChart == "undefined"){
                  jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/gauge.js", function(){});
                }
            }
            catch(e){
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function(){});
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/gauge.js", function(){});
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

        // 화살표 위치 값 세팅
        setArrowValue : function(iArrowValue){

            this.setProperty("arrowValue", iArrowValue, true);

            if(typeof this._gaugeArrow == "undefined"){
                return;
            }

            var iStartValue = this.getStartValue(),
                iEndValue = this.getEndValue();

            // 화살표 가리키는 값이 StartValue보다 작으면 StartValue 값으로 맞춰준다.
            if(iArrowValue < iStartValue){
                console.warn("Warning! : ArrowValue가 StartValue보다 작습니다. 차트의 표현이 정확하지 않을 수 있습니다.");
                iArrowValue = iStartValue;
            }

            // 화살표 가리키는 값이 EndValue보다 크면 EndValue 값으로 맞춰준다.
            if(iArrowValue > iEndValue){
                console.warn("Warning! : ArrowValue가 EndValue보다 큽니다. 차트의 표현이 정확하지 않을 수 있습니다.");
                iArrowValue = iEndValue;
            }

            this._gaugeArrow.setValue(iArrowValue);
			
			// this._gaugeChart.validateNow();			
			
		},	// end of setArrowValue

		// 차트의 하단 텍스트 설정
		setBottomText : function(sText){

			this.setProperty("bottomText", sText, true);

			if(typeof this._gaugeAxis == "undefined"){
				return;
			}
		
			this._gaugeAxis.setBottomText(this.getBottomText());
			
			this._gaugeChart.validateNow();
			
        }, // end of setBottomText

        // 차트 내의 상단 텍스트
        setInnerTitle : function(sText){

            this.setProperty("innerTitle", sText, true);

            if(typeof this._gaugeAxis == "undefined"){
                return;
            }

            this._gaugeAxis.setTopText(sText);
			
			// this._gaugeChart.validateNow();

        }, // end of setInnerTitle

        onAfterRendering : function(){

            // 차트를 생성한다.
            this._createChart();

            // Gauge 클릭 이벤트를 설정한다.
            this._attachGaugeEvent();

        }, // end of onAfterRendering

        // Gauge Clik Event
        _attachGaugeEvent : function(){

            var that = this,
                oGaugeDom = document.getElementById(this.getId());
				
            if(oGaugeDom == null){
                return;
            }
			
            oGaugeDom.onclick = function(e){
				//var mProperties = that.mProperties;
                that.fireGaugeClick();
            }

        },

        // Chart 생성
        _createChart : function(){

            var that = this;
            var iStartValue = this.getStartValue(),
                iEndValue = this.getEndValue();

            // Gauge 마지막값이 시작값보다 큰지 확인한다.
            if(iStartValue >= iEndValue){
                //console.error("error: property 'startValue', 'endValue' startValue가 EndValue보다 같거나 클 수 없습니다.");
                return;
            }

            // 눈금선 간격
            // 0을 주면 무한루프 돌면서 브라우저가 멈춤 현상발생으로 체크로직 추가
            var iInterval = this.getValueInterval();
            if(iInterval <= 0){
               console.error("error: property 'valueInterval',  1 이상의 값만 입력할 수 있습니다.");
               iInterval = 10;
            }

            // Gauge 시작값과 마지막 값을 더한 수치와 Interval을 나누어서 0이 아니면 오류
            var startEndValue = iStartValue + iEndValue;
            if(startEndValue % iInterval != 0){
                console.error("error: startValue, EndValue의 합을 Interval값으로 나눈 값이 0이 되어야 합니다.");
                return;
            }

            // create angular gauge
            var chart = new AmCharts.AmAngularGauge(),
                axis = new AmCharts.GaugeAxis();  // create axis

            // 현재 객체에 차트를 넣는다.
            this._gaugeChart = chart;
            this._gaugeAxis = axis;

            // 차트 타이틀 설정
            chart.addTitle(
                this.getHeaderTitle(),      // text
                this.getHeaderTitleSize(),  // size
                this.getHeaderTitleColor(), // color
                1,                          // alpha
                this.getHeaderTitleBold()   // isBold?
            );
			
			// 차트의 X,Y 위치
            axis.centerX = this.getCenterX();
            axis.centerY = this.getCenterY();

            // 차트 전체 텍스트 크기
            chart.fontSize = this.getFontSize();

            // chart angle 크기
            axis.startAngle = this.getStartAngle();         // 차트 그리는 시작 위치
            axis.endAngle = this.getEndAngle();             // 차트 그리는 마지막 위치
            axis.unit = this.getUnit();                     // 차트 눈금선 단위 텍스트
            axis.axisThickness = this.getOutlineThickness();// 테두리 라인 두께
            axis.radius = "80%";                            // 차트 전체영역 크기
            axis.startValue = iStartValue;                  // Gauge 시작값
            axis.endValue = iEndValue;                      // Gauge 마지막 값
            axis.valueInterval = iInterval;                 // 눈금선 간격
            axis.topText = this.getInnerTitle();            // 내부 텍스트
            axis.topTextColor = this.getInnerTitleColor();  // 내부 텍스트 색상
            axis.topTextBold = this.getInnerTitleBold();    // 내부 텍스트 굵기 지정
            axis.topTextFontSize = this.getInnerTitleSize();// 내부 텍스트 크기
            axis.tickThickness = this.getTickThickness();   // 눈금선 두께

             // bottom text
            axis.bottomTextYOffset = -20;
            axis.setBottomText(this.getBottomText());           // 하단 텍스트
            axis.bottomTextFontSize = this.getBottomTextSize(); // 하단 텍스트 크기
            axis.bottomTextColor = this.getBottomTextColor();   // 하단 텍스트 색상
            axis.bottomTextBold = this.getBottomTextBold();     // 하단 텍스트 굵기

            // Attach Band Event
            axis.addListener("clickBand", function(e){

                // 이벤트 전파 방지
                event.stopPropagation();

                var mProperties = e.dataItem.properties;
                var aBand = that.getGaugeBands(),
                    iBandLen = aBand.length;

                for(var i = 0; i < iBandLen; i++){
                    var oBand = aBand[i];
                    var sBandId = oBand.getId();
                    if(sBandId == mProperties.id){
                        //oBand.fireBandClick(mProperties);
                        oBand.fireBandClick();
                        break;
                    }
                }
            });

             // GaugeBand Aggregation Binding
            this._setGaugeBand(axis);
            chart.addAxis(axis);

            // gauge arrow
            var oArrow = new AmCharts.GaugeArrow(),
                iArrowValue = this.getArrowValue();

            // 현재 객체에 화살표 인스턴스를 넣는다.
            this._gaugeArrow = oArrow;

            // 화살표 가리키는 값이 StartValue보다 작으면 StartValue 값으로 맞춰준다.
            if(iArrowValue < iStartValue){
                console.warn("Warning! : ArrowValue가 StartValue보다 작습니다. 차트의 표현이 정확하지 않을 수 있습니다.");
                iArrowValue = iStartValue;
            }

            // 화살표 가리키는 값이 EndValue보다 크면 EndValue 값으로 맞춰준다.
            if(iArrowValue > iEndValue){
                console.warn("Warning! : ArrowValue가 EndValue보다 큽니다. 차트의 표현이 정확하지 않을 수 있습니다.");
                iArrowValue = iEndValue;
            }

            oArrow.setValue(iArrowValue);
            oArrow.radius = this.getArrowRadius();

            chart.addArrow(oArrow);
            chart.write(this.getId());
			
			this._gaugeChart.validateNow();
			
			// css style을 적용한다.
			var _aCssClass = this.aCustomStyleClasses;
			if(_aCssClass == null){
				return;
			}

			var sCssClassNm = _aCssClass.join(" ");
			jQuery(this.getDomRef()).addClass(sCssClassNm);

        }, // end of _createChart

        // band Setting
        _setGaugeBand : function(axis){

            var aGaugeBands = [],
                aBands = this.getGaugeBands(),
                iBandLen = aBands.length;

            if(iBandLen == 0){
                return;
            }

            for(var i = 0; i < iBandLen; i++){

                var oBand = aBands[i];
                var oGaugeBand = new AmCharts.GaugeBand(),
                    iBandStValue = oBand.getStartValue(),
                    iBandEdValue = oBand.getEndValue(),
                    iGaugeStVal = this.getStartValue(),
                    iGaugeEdVal = this.getEndValue();

				// Band의 StartValue가 Gauge의 StartValue보다 작은지 확인한다.
				if(iBandStValue < iGaugeStVal){
					console.warn("Warning! : Band의 StartValue가 Gauge의 StartValue보다 작습니다. 차트의 표현이 정확하지 않을 수 있습니다.");
					iBandStValue = iGaugeStVal;
				}

				// Band의 EndValue가 Gauge의 EndValue보다 큰지 확인한다.
				if(iBandEdValue > iGaugeEdVal){
					console.warn("Warning! : Band의 EndValue가 Gauge의 EndValue보다 큽니다. 차트의 표현이 정확하지 않을 수 있습니다.");
					iBandEdValue = iGaugeEdVal;
				}
				
				// Band의 속성 정의
				oGaugeBand.properties = oBand.mProperties;
				oGaugeBand.properties.id = oBand.getId();
				oGaugeBand.startValue = iBandStValue;
				oGaugeBand.endValue = iBandEdValue;
				oGaugeBand.color = oBand.getBandColor();
				oGaugeBand.innerRadius = oBand.getInnerRadius();
				oGaugeBand.radius = oBand.getRadius();
				
				// Band의 Gradiant 설정
				if(oBand.getGradient() == true){
					oGaugeBand.gradientRatio = [0.5, 0, -0.5];
				}

                // Band 객체에 GaugeBand 객체를 넣는다.
                oBand._gaugeBand = oGaugeBand;
				
                aGaugeBands.push(oGaugeBand);
				
                oGaugeBand = null;
				
            } // end of for

            axis.bands = aGaugeBands;

        } // end of _setGaugeBand

    });

    return AngularGauge;

});



