sap.ui.define("u4a.charts.am.AmPieChart", [
    "sap/ui/core/Control",

], function(Control) {
    "use strict";

    var chart = Control.extend("u4a.charts.am.AmPieChart", {
        metadata: {
            library: "u4a.charts.am",
            properties: {
                width: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100%"
                },
                height: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "320px"
                },
                title: {
                    type: "string",
                    defaultValue: ""
                },
                visible: {
                    type: "boolean",
                    defaultValue: true
                },
                styleClass: {
                    type: "string",
                    defaultValue: ""
                },
                showLegend: {
                    type: "boolean",
                    defaultValue: true
                },
                innerRadius: {
                    type: "int",
                    defaultValue: null
                },
                labelRadius: {
                    type: "int",
                    defaultValue: null
                },
                outlineAlpha: {
                    type: "float",
                    defaultValue: null
                },
                outlineColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: null
                },
                outlineThickness: {
                    type: "int",
                    defaultValue: null
                },
                startDuration: {
                    type: "float",
                    defaultValue: null
                },
                legendPosition: {
                    type: "string",
                    defaultValue: "bottom"
                },
                legendAlign: {
                    type: "string",
                    defaultValue: "center"
                },
                LegendFontSize: {
                    type: "int",
                    defaultValue: 11
                },
                fontSize: {
                    type: "int",
                    defaultValue: 11
                },
                radius: {
                    type: "string",
                    defaultValue: null
                },
                marginTop: {
                    type: "int",
                    defaultValue: 10
                },
                marginLeft: {
                    type: "int",
                    defaultValue: null
                },
                marginRight: {
                    type: "int",
                    defaultValue: null
                },
                marginBottom: {
                    type: "int",
                    defaultValue: 10
                },
                autoMargins: {
                    type: "boolean",
                    defaultValue: true
                },
                showRadiusText: {
                    type: "boolean",
                    defaultValue: true
                },
                angle: {
                    type: "int",
                    defaultValue: null
                },
                depth3D: {
                    type: "int",
                    defaultValue: null
                },
                backgroundAlpha: {
                    type: "float",
                    defaultValue: 0
                },
                backgroundColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "#FFFFFF"
                },
                borderAlpha: {
                    type: "float",
                    defaultValue: 0
                },
                borderColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "#000000"
                },
                textColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "#000000"
                },
                legendTextColor: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "#000000"
                },
                showLegendValueText: {
                    type: "boolean",
                    defaultValue: true
                },
                legendMarkerSize: {
                    type: "int",
                    defaultValue: 16
                },
                legendValueWidth: {
                    type: "int",
                    defaultValue: 50
                },
                legendVerticalGap: {
                    type: "int",
                    defaultValue: 10
                },
                legendHorizontalGap: {
                    type: "int",
                    defaultValue: 0
                }
            },

            events: {
                init: {
                    allowPreventDefault: true
                },
                clickSlice: {
                    allowPreventDefault: true
                },
                pullInSlice: {
                    allowPreventDefault: true
                },
                pullOutSlice: {
                    allowPreventDefault: true
                },
                rollOverSlice: {
                    allowPreventDefault: true
                },
            }
        }, // end of metadata

        init: function() {
            try {
                var amChart = AmCharts.AmPieChart;
                if (typeof amChart == "undefined") {
                    jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js", function() {});
                }

            } catch (e) {
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js", function() {});
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js", function() {});
            }
            this._c = new AmCharts.AmPieChart();
            this._setChartEvent();
        },

        renderer: function(oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.write(">");
            oRm.write("</div>");

        }, // end of renderer


        onBeforeRendering: function() {}, // end of onBeforeRendering

        onAfterRendering: function() {

            this._createChart();

        }, // end of onAfterRendering


        exit: function() {

        }, // end of exit

        _setChart: function() {
            this._c.creditsPosition = "top-right";
            this._setTitle(this.getTitle());

            if (!this.getVisible()) {
                document.getElementById(this.getId()).hidden = true;
            }

            this._setStyleClass(this.getStyleClass());

            this._setLegend(this.getShowLegend());

            this._c.innerRadius = this.getInnerRadius();

            if (typeof this._c.innerRadius === "undefined" || this._c.innerRadius === null || this._c.innerRadius === "") {
                this._c.innerRadius = 0;
            }

            this._c.labelRadius = this.getLabelRadius();
            this._c.outlineAlpha = this.getOutlineAlpha();
            this._c.outlineColor = this.getOutlineColor();
            this._c.outlineThickness = this.getOutlineThickness();
            this._c.fontSize = this.getFontSize();


            this._c.marginTop = this.getMarginTop();

            this._c.marginBottom = this.getMarginBottom();

            this._c.marginLeft = this.getMarginLeft();

            this._c.marginRight = this.getMarginRight();

            this._c.autoMargins = this.getAutoMargins();

            this._c.labelText = "[[title]]: [[percents]]%";
            if (this.getShowRadiusText() === false) {
                this._c.labelText = "";
            }

            this._c.radius = this.getRadius();

            this._c.angle = this.getAngle();

            this._c.depth3D = this.getDepth3D();

            this._c.backgroundAlpha = this.getBackgroundAlpha();
            this._c.backgroundColor = this.getBackgroundColor();

            this._c.borderAlpha = this.getBorderAlpha();
            this._c.borderColor = this.getBorderColor();

            this._c.color = this.getTextColor();

            this._c.validateData();
            this._c.validateNow();

        },

        _createChart: function() {

            if (this._c.events.init.length === 2) {
                this._c.write(this.getId());
		this._c.validateData();
	        this._c.validateNow();
                return;
            }

            this._c.addListener('init', function() {
                this._setChart();
            }.bind(this));

            this._c.write(this.getId());

        },

        _setChartEvent: function() {
            if (!this._c) {
                return;
            }
            var that = this;

            this._c.addListener('init',function(e){
                that.fireInit(e);
            });

            this._c.addListener('clickSlice', function(e) {
                that.fireClickSlice(e);
            });

            this._c.addListener('pullInSlice', function(e) {
                that.firePullInSlice(e);
            });

            this._c.addListener('pullOutSlice', function(e) {
                that.firePullOutSlice(e);
            });

            this._c.addListener('rightClickGraphItem', function(e) {
                that.fireRightClickGraphItem(e);
            });

            this._c.addListener('rollOverSlice', function(e) {
                that.fireRollOverSlice(e);
            });

        },

        _setLegend: function(p, g) {

            if (!this._c) {
                return;
            }
            this._c.removeLegend();

            var l = new AmCharts.AmLegend();

            l.enabled = p;

            l.align = this.getLegendAlign();
            l.position = this.getLegendPosition();
            if (l.position === "") {
                l.position = "bottom";
            }
            l.fontSize = this.getLegendFontSize();
            l.color = this.getLegendTextColor();
            l.valueText = "";
            if (this.getShowLegendValueText() === true) {
                l.valueText = "[[value]]";
            }
            l.valueWidth = this.getLegendValueWidth();
            l.verticalGap = this.getLegendVerticalGap();
            l.horizontalGap = this.getLegendHorizontalGap();
            l.markerSize = this.getLegendMarkerSize();

            this._c.addLegend(l);

            if (!g) {
                return;
            }

            this._c.validateData();
            this._c.validateNow();

        },
        _setChartProp: function(pr, v) {
            if (!this._c) {
                return;
            }
            this._c[pr] = v;
            this._c.validateNow();
        },

        _setStyleClass: function(p) {
            if (!this.aCustomStyleClasses) {
                if (typeof p === "undefined" || p === null) {
                    return;
                }
                this.addStyleClass(p);
                return;
            }

            var l = this.aCustomStyleClasses.length;

            for (var i = 0; i < l; i++) {
                this.removeStyleClass(this.aCustomStyleClasses[0]);
            }

            if (typeof p === "undefined" || p === null) {
                return;
            }

            this.addStyleClass(p);

        },

        _setTitle: function(p, g) {
            if (!this._c) {
                return;
            }
            this._c.titles = [];
            if (typeof p === "undefined" || p === null || p === "") {
                if (g) {
                    this._c.validateNow();
                }
                return;
            }
            this._c.addTitle(p, 20);
            if (g) {
                this._c.validateNow();
            }
        },

        setWidth: function(p) {
            this.setProperty('width', p, true);
            if (!this._c || !this._c.div || !this._c.div.style) {
                return;
            }
            this._c.div.style.width = p;
            this._c.validateNow();
        },

        setHeight: function(p) {
            this.setProperty('height', p, true);
            if (!this._c || !this._c.div || !this._c.div.style) {
                return;
            }
            this._c.div.style.height = p;
            this._c.validateNow();
        },

        setStyleClass: function(p) {
            this.setProperty('styleClass', p, true);
            this._setStyleClass(p);

        },

        setTitle: function(p) {
            this.setProperty('title', p, true);
            this._setTitle(p, true);
        },

        setVisible: function(p) {
            this.setProperty('visible', p, true);
            if (!this._c || !this._c.div) {
                return;
            }

            var v = true;
            if (p) {
                v = false;
            }
            this._c.div.hidden = v;
            this._c.validateNow();
        },

        setShowLegend: function(p) {
            this.setProperty('showLegend', p, true);
            this._setLegend(p, true);
        },

        setInnerRadius: function(p) {
            this.setProperty('innerRadius', p, true);
            if (!this._c) {
                return;
            }
            this._c.innerRadius = p;

            if (typeof p === "undefined" || p === null || p === "") {
                this._c.innerRadius = 0;
            }

            this._c.validateNow();

        },
        setLabelRadius: function(p) {
            this.setProperty('labelRadius', p, true);
            this._setChartProp('labelRadius', p);
        },
        setOutlineAlpha: function(p) {
            this.setProperty('outlineAlpha', p, true);
            this._setChartProp('outlineAlpha', p);
        },
        setOutlineColor: function(p) {
            this.setProperty('outlineColor', p, true);
            this._setChartProp('outlineColor', p);
        },
        setOutlineThickness: function(p) {
            this.setProperty('outlineThickness', p, true);
            this._setChartProp('outlineThickness', p);
        },

        setStartDuration: function(p) {
            this.setProperty('startDuration', p, true);
            this._setChartProp('startDuration', p);
        },

        setLegendPosition: function(p) {
            this.setProperty('legendPosition', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.position = p;
            if (this._c.legend.position === "") {
                this._c.legend.position = "bottom";
            }
            this._c.validateNow();
        },

        setLegendAlign: function(p) {
            this.setProperty('legendAlign', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.align = p;
            this._c.validateNow();
        },

        setLegendFontSize: function(p) {
            this.setProperty('LegendFontSize', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.fontSize = p;
            this._c.validateNow();
        },

        setFontSize: function(p) {
            this.setProperty('fontSize', p, true);
            this._setChartProp('fontSize', p);
        },

        setRadius: function(p) {
            this.setProperty('radius', p, true);
            this._setChartProp('radius', p);
        },

        setMarginTop: function(p) {
            this.setProperty('marginTop', p, true);
            this._setChartProp('marginTop', p);
        },

        setMarginBottom: function(p) {
            this.setProperty('marginBottom', p, true);
            this._setChartProp('marginBottom', p);
        },

        setMarginLeft: function(p) {
            this.setProperty('marginLeft', p, true);
            this._setChartProp('marginLeft', p);
        },

        setMarginRight: function(p) {
            this.setProperty('marginRight', p, true);
            this._setChartProp('marginRight', p);
        },

        setAutoMargins: function(p) {
            this.setProperty('autoMargins', p, true);
            this._setChartProp('autoMargins', p);
        },

        setShowRadiusText: function(p) {
            this.setProperty('showRadiusText', p, true);
            if (!this._c) {
                return;
            }
            var p2 = "[[title]]: [[percents]]%";
            if (p === false) {
                p2 = "";
            }
            this._c.labelText = p2;
            this._c.validateNow();
        },

        setAngle: function(p) {
            this.setProperty('angle', p, true);
            this._setChartProp('angle', p);
        },

        setDepth3D: function(p) {
            this.setProperty('depth3D', p, true);
            this._setChartProp('depth3D', p);
        },

        setBackgroundAlpha: function(p) {
            this.setProperty('backgroundAlpha', p, true);
            this._setChartProp('backgroundAlpha', p);
        },

        setBackgroundColor: function(p) {
            this.setProperty('backgroundColor', p, true);
            this._setChartProp('backgroundColor', p);
        },

        setBorderAlpha: function(p) {
            this.setProperty('borderAlpha', p, true);
            this._setChartProp('borderAlpha', p);
        },

        setBorderColor: function(p) {
            this.setProperty('borderColor', p, true);
            this._setChartProp('borderColor', p);
        },
        setTextColor: function(p) {
            this.setProperty('textColor', p, true);
            this._setChartProp('color', p);
        },
        setLegendTextColor: function(p) {
            this.setProperty('legendTextColor', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.color = p;
            this._c.validateNow();
        },
        setShowLegendValueText: function(p) {
            this.setProperty('showLegendValueText', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.valueText = "";
            if (p === true) {
                this._c.legend.valueText = "[[value]]";
            }
            this._c.validateNow();
        },
        setLegendMarkerSize: function(p) {
            this.setProperty('legendMarkerSize', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.markerSize = p;
            this._c.validateNow();
        },

        setLegendValueWidth: function(p) {
            this.setProperty('legendValueWidth', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.valueWidth = p;
            this._c.validateNow();
        },

        setLegendVerticalGap: function(p) {
            this.setProperty('legendVerticalGap', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.verticalGap = p;
            this._c.validateNow();
        },

        setLegendHorizontalGap: function(p) {
            this.setProperty('legendHorizontalGap', p, true);
            if (!this._c || !this._c.legend) {
                return;
            }
            this._c.legend.horizontalGap = p;
            this._c.validateNow();
        }

    });

    return chart;

});