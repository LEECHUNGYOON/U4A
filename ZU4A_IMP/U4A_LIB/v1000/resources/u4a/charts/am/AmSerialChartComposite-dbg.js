sap.ui.define("u4a.charts.am.AmSerialChartComposite", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var Sample = Control.extend("u4a.charts.am.AmSerialChartComposite", {
        metadata : {
            library : "u4a.charts.am",
            properties : {
				width : {type: "sap.ui.core.CSSSize",defaultValue:"100%"},
				height : {type: "sap.ui.core.CSSSize",defaultValue:"320px"},
				title : { type: "string", defaultValue: "" },
				visible : { type: "boolean", defaultValue: true },
				styleClass : { type: "string", defaultValue: "" },
				showLegend : { type: "boolean", defaultValue: true },
				rotate : { type: "boolean", defaultValue: false },
				startDuration : { type: "float", defaultValue: null },
				legendPosition : { type: "string", defaultValue: "bottom" },
				legendAlign : { type: "string", defaultValue: "center" },
				columnWidth : { type: "float", defaultValue: 0.8 },
				LegendFontSize : { type: "int", defaultValue: 11 },
				marginTop : { type: "int", defaultValue: 20 },
				marginLeft : { type: "int", defaultValue: null },
				marginRight : { type: "int", defaultValue: null },
				marginBottom : { type: "int", defaultValue: null },
				autoMargins : { type: "boolean", defaultValue: true },
				angle : { type: "int", defaultValue: null },
				depth3D : { type: "int", defaultValue: null },
				plotAreaBorderAlpha : { type: "float", defaultValue: 1 },
				plotAreaBorderColor : {type: "sap.ui.core.CSSColor",defaultValue:"#DADADA"},
				plotAreaFillAlphas : { type: "float", defaultValue: 0 },
				plotAreaFillColors : {type: "sap.ui.core.CSSColor",defaultValue:"#FFFFFF"},
				backgroundAlpha : { type: "float", defaultValue: 0 },
				backgroundColor : {type: "sap.ui.core.CSSColor",defaultValue:"#FFFFFF"},
				borderAlpha : { type: "float", defaultValue: 0 },
				borderColor : {type: "sap.ui.core.CSSColor",defaultValue:"#000000"}
            },

            events : {
				init : {allowPreventDefault: true},
				clickGraphItem : {allowPreventDefault: true},
				clickGraph : {allowPreventDefault: true},
				changed : {allowPreventDefault: true},
				rightClickGraphItem : {allowPreventDefault: true},
				rollOverGraph : {allowPreventDefault: true},
				rollOverGraphItem : {allowPreventDefault: true}
            }
        }, // end of metadata

        init : function(){
          try {
                var amChart = AmCharts.AmSerialChart;
                if(typeof amChart == "undefined"){
					jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/serial.js", function(){});
                }
            }
            catch(e){
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function(){});
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/serial.js", function(){});
            }
			
			this._c = new AmCharts.AmSerialChart();
			this._setChartEvent();
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


        onBeforeRendering : function(){
        }, // end of onBeforeRendering

        onAfterRendering : function(){

          this._createChart();

        }, // end of onAfterRendering


        exit : function(){

        }, // end of exit

        _createChart : function(){

            if(!this._c){this._c = new AmCharts.AmSerialChart();this._setChartEvent();}
            this._c.creditsPosition = "top-right";
            this._c.categoryAxis.gridPosition = "start";

            this._setTitle(this.getTitle());

            if(!this.getVisible()){document.getElementById(this.getId()).hidden = true;}
			
			this._setStyleClass(this.getStyleClass());

            this._setLegend(this.getShowLegend());

            this._c.rotate = this.getRotate();

            this._c.startDuration = this.getStartDuration();

            this._c.columnWidth = this.getColumnWidth();

            this._c.marginTop = this.getMarginTop();

            this._c.marginBottom = this.getMarginBottom();

            this._c.marginLeft = this.getMarginLeft();

            this._c.marginRight = this.getMarginRight();

            this._c.autoMargins = this.getAutoMargins();

            this._c.angle = this.getAngle();

            this._c.depth3D = this.getDepth3D();

            this._c.plotAreaBorderColor = this.getPlotAreaBorderColor();
            this._c.plotAreaBorderAlpha = this.getPlotAreaBorderAlpha();

            this._c.plotAreaFillAlphas = this.getPlotAreaFillAlphas();
            this._c.plotAreaFillColors = this.getPlotAreaFillColors();


            this._c.backgroundAlpha = this.getBackgroundAlpha();
            this._c.backgroundColor = this.getBackgroundColor();

            this._c.borderAlpha = this.getBorderAlpha();
            this._c.borderColor = this.getBorderColor();
			
            this._c.write(this.getId());
			this._c.validateData();
			this._c.validateNow();
            
        },
		
		_setChartEvent : function(){
			if(!this._c){return;}
			var that = this;
            
            this._c.addListener('init',function(e){
                that.fireInit(e);
            });
            
            this._c.addListener('clickGraphItem',function(e){
                that.fireClickGraphItem(e);
            });
            
            this._c.addListener('clickGraph',function(e){
                that.fireClickGraph(e);
            });
            
            this._c.addListener('changed',function(e){
                that.fireChanged(e);
            });
            
            this._c.addListener('rightClickGraphItem',function(e){
                that.fireRightClickGraphItem(e);
            });
            
            this._c.addListener('rollOverGraph',function(e){
                that.fireRollOverGraph(e);
            });
            
            this._c.addListener('rollOverGraphItem',function(e){
                that.fireRollOverGraphItem(e);
            });
			
		},

        _setLegend : function(p,g){

			if(!this._c){return;}
			this._c.removeLegend();
	
			var l = new AmCharts.AmLegend();
			
			l.enabled = p;
	
			l.align = this.getLegendAlign();
			l.position = this.getLegendPosition();
			if(l.position === ""){l.position = "bottom";}
			l.fontSize = this.getLegendFontSize();
	
			this._c.addLegend(l);
	
			if(!g){return;}
	
			this._c.validateNow();

        },
        _setChartProp : function(pr,v){
			if(!this._c){return;}
			this._c[pr] = v;
			this._c.validateNow();
        },
		
		_setStyleClass : function(p){
			if(!this.aCustomStyleClasses){
				if(typeof p === "undefined" || p === null){return;}
				this.addStyleClass(p);
				return;
			}
			
			var l = this.aCustomStyleClasses.length;
			
			for(var i=0; i <l; i++){
				this.removeStyleClass(this.aCustomStyleClasses[0]);
			}

			if(typeof p === "undefined" || p === null){return;}
			
			this.addStyleClass(p);
			
		},
		
		_setTitle : function(p,g){
			if(!this._c){return;}
			this._c.titles = [];
			if(typeof p === "undefined" || p === null || p === ""){
				if(g){this._c.validateNow();}
				return;
			}
			this._c.addTitle(p,20);
			if(g){this._c.validateNow();}
		},

        setWidth : function(p){
			this.setProperty('width',p,true);
			if(!this._c || !this._c.div || !this._c.div.style){return;}
			this._c.div.style.width = p;
			this._c.validateNow();
        },		

        setHeight : function(p){
			this.setProperty('height',p,true);
			if(!this._c || !this._c.div || !this._c.div.style){return;}
			this._c.div.style.height = p;
			this._c.validateNow();
        },
		
		setStyleClass : function(p){
			this.setProperty('styleClass',p,true);
			this._setStyleClass(p);			
        },

        setTitle : function(p){
			this.setProperty('title',p,true);
			this._setTitle(p,true);
        },

        setVisible : function(p){
			this.setProperty('visible',p,true);
			if(!this._c || !this._c.div){return;}
	
			var v = true;
			if(p){v = false;}
			this._c.div.hidden = v;
			this._c.validateNow();
        },

        setShowLegend : function(p){
			this.setProperty('showLegend',p,true);
			this._setLegend(p,true);
        },

        setRotate : function(p){
			this.setProperty('rotate',p,true);
			this._setChartProp('rotate',p);
        },

        setStartDuration : function(p){
			this.setProperty('startDuration',p,true);
			this._setChartProp('startDuration',p);
        },

        setLegendPosition : function(p){
			this.setProperty('legendPosition',p,true);
			if(!this._c || !this._c.legend){return;}
			this._c.legend.position = p;
			if(this._c.legend.position === ""){this._c.legend.position = "bottom";}
			this._c.validateNow();
        },

        setLegendAlign : function(p){
			this.setProperty('legendAlign',p,true);
			if(!this._c || !this._c.legend){return;}
			this._c.legend.align = p;
			this._c.validateNow();
        },

        setLegendFontSize : function(p){
			this.setProperty('LegendFontSize',p,true);
			if(!this._c || !this._c.legend){return;}
			this._c.legend.fontSize = p;
			this._c.validateNow();
        },
        
        setColumnWidth : function(p){
			this.setProperty('columnWidth',p,true);
			this._setChartProp('columnWidth',p);
        },

        setMarginTop : function(p){
			this.setProperty('marginTop',p,true);
			this._setChartProp('marginTop',p);
        },

        setMarginBottom : function(p){
			this.setProperty('marginBottom',p,true);
			this._setChartProp('marginBottom',p);
        },

        setMarginLeft : function(p){
			this.setProperty('marginLeft',p,true);
			this._setChartProp('marginLeft',p);
        },

        setMarginRight : function(p){
			this.setProperty('marginRight',p,true);
			this._setChartProp('marginRight',p);
        },

        setAutoMargins : function(p){
			this.setProperty('autoMargins',p,true);
			this._setChartProp('autoMargins',p);
        },

        setAngle : function(p){
			this.setProperty('angle',p,true);
			this._setChartProp('angle',p);
        },

        setDepth3D : function(p){
			this.setProperty('depth3D',p,true);
			this._setChartProp('depth3D',p);
        },

        setPlotAreaBorderColor : function(p){
			this.setProperty('plotAreaBorderColor',p,true);
			this._setChartProp('plotAreaBorderColor',p);
        },

        setPlotAreaBorderAlpha : function(p){
			this.setProperty('plotAreaBorderAlpha',p,true);
			this._setChartProp('plotAreaBorderAlpha',p);
        },

        setPlotAreaFillAlphas : function(p){
			this.setProperty('plotAreaFillAlphas',p,true);
			this._setChartProp('plotAreaFillAlphas',p);
        },

        setPlotAreaFillColorss : function(p){
			this.setProperty('plotAreaFillColors',p,true);
			this._setChartProp('plotAreaFillColors',p);
        },

        setBackgroundAlpha : function(p){
			this.setProperty('backgroundAlpha',p,true);
			this._setChartProp('backgroundAlpha',p);
        },

        setBackgroundColor : function(p){
			this.setProperty('backgroundColor',p,true);
			this._setChartProp('backgroundColor',p);
        },

        setBorderAlpha : function(p){
			this.setProperty('borderAlpha',p,true);
			this._setChartProp('borderAlpha',p);
        },

        setBorderColor : function(p){
			this.setProperty('borderColor',p,true);
			this._setChartProp('borderColor',p);
        }

    });

    return Sample;

});


