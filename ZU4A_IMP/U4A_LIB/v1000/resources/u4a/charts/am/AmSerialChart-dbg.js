//Copyright 2017. INFOCG Inc. all rights reserved. 

sap.ui.define("u4a.charts.am.AmSerialChart", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var Sample = Control.extend("u4a.charts.am.AmSerialChart", {
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
				legendPosition : { type: "string", defaultValue: "bottom" },
				legendAlign : { type: "string", defaultValue: "center" },
				columnWidth : { type: "float", defaultValue: 0.8 },
				fontSize : { type: "int", defaultValue: 11 },
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
			
            if(!this._c){this._c = new AmCharts.AmSerialChart();}
            this._c.creditsPosition = "top-right";
            this._c.categoryAxis.gridPosition = "start";

            this._setTitle(this.getTitle());

            if(!this.getVisible()){document.getElementById(this.getId()).hidden = true;}
			
			this._setStyleClass(this.getStyleClass());

            this._setLegend(this.getShowLegend());

            this._c.rotate = this.getRotate();

            this._c.columnWidth = this.getColumnWidth();

			this._c.fontSize = this.getFontSize();
            
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
                that.fireRollOverGraph();
            });
            
            this._c.addListener('rollOverGraphItem',function(e){
                that.fireRollOverGraphItem(e);
            });


            this._c.write(this.getId());
            
            /*this._c.div.style.width = this.getWidth();
            this._c.div.style.height = this.getHeight();*/

        },

        _setLegend : function(p,g){

			if(!this._c){return;}
			this._c.removeLegend();
	
			var l = new AmCharts.AmLegend();
			
			l.enabled = p;
	
			l.align = this.getLegendAlign();
			l.position = this.getLegendPosition();
			if(l.position === ""){l.position = "bottom";}
	
			this._c.addLegend(l);
	
			if(!g){return;}
	
			this._c.validateNow();

        },
        _setChartProp : function(pr,v){
			if(!this._c){return;}
			this._c[pr] = v;
			this._c.validateNow();
			this._c.validateData();
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
        },

        setHeight : function(p){
			this.setProperty('height',p,true);
			if(!this._c || !this._c.div || !this._c.div.style){return;}
			this._c.div.style.height = p;
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

        setFontSize : function(p){
			this.setProperty('fontSize',p,true);
			if(!this._c || !this._c.legend){return;}
			this._c.legend.fontSize = p;
			this._setChartProp('fontSize',p);
        },
        
        setColumnWidth : function(p){
			this.setProperty('columnWidth',p,true);
			this._setChartProp('columnWidth',p);
        }

    });

    return Sample;

});