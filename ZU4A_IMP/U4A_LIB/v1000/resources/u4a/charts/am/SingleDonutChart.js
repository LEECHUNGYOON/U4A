﻿sap.ui.define("u4a.charts.am.SingleDonutChart",["sap/ui/core/Control"],(function(t){"use strict";return t.extend("u4a.charts.am.SingleDonutChart",{metadata:{library:"u4a.charts.am",properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:"50%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"50%"},sliceValue:{type:"float",defaultValue:0},sliceColor:{type:"sap.ui.core.CSSColor",defaultValue:"#FF0F00"},innerRadius:{type:"int",defaultValue:0},innerText:{type:"string",defaultValue:null},fontColor:{type:"sap.ui.core.CSSColor",defaultValue:"#000000"},fontSize:{type:"int",defaultValue:30},fontX:{type:"int",defaultValue:50},fontY:{type:"int",defaultValue:45}},events:{clickSlice:{allowPreventDefault:!0},clickChart:{allowPreventDefault:!0}}},init:function(){void 0===window.AmCharts&&jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js",(function(){})),void 0===window.AmCharts.AmPieChart&&jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js",(function(){}))},renderer:function(t,e){t.write("<div"),t.writeControlData(e),t.addStyle("width",e.getWidth()),t.addStyle("height",e.getHeight()),t.writeStyles(),t.write(">"),t.write("</div>")},onAfterRendering:function(){this._createChart(),this._attachChartEvent()},_attachChartEvent:function(){var t=this,e=document.getElementById(this.getId());null!=e&&(e.onclick=function(e){t._sliceClick&&"X"==t._sliceClick?t._sliceClick=null:t.fireClickChart()})},_createChart:function(){var t=this,e=this._checkSliceValue(),a=e.fromValue,i=e.toValue,l=[{value:a,color:this.getSliceColor()},{value:i,color:"#EEEEEE"}],r=new AmCharts.AmPieChart;t.PieChart=r,r.dataProvider=l,r.valueField="value",r.colorField="color",r.labelText="",r.balloonText="",r.radius="43%",r.pullOutRadius="0%",r.startDuration=0,r.innerRadius=t.getInnerRadius()+"%",t._addChartLabel(),t._attachClickEvent(),r.write(t.getId());var n=t.aCustomStyleClasses;if(null!=n){var u=n.join(" ");jQuery(this.getDomRef()).addClass(u)}},_attachClickEvent:function(){var t=this;this.PieChart.addListener("clickSlice",(function(e){t._sliceClick="X",t.fireClickSlice()}))},_addChartLabel:function(){var t=this.getFontSize(),e=this.getFontColor(),a=this.getInnerText(),i=this.getFontX()+"%",l=this.getFontY()+"%";this.PieChart.addLabel(i,l,a,"middle",t,e,void 0,!1,!0)},_checkSliceValue:function(){var t={fromValue:0,toValue:100},e=this.getSliceValue();return e<=0?t:e>=100?(t.fromValue=100,t.toValue=0,t):(t.fromValue=e,t.toValue=100-e,t)}})}));