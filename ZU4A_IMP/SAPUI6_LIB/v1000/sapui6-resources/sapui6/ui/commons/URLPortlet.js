jQuery.sap.declare("sapui6.ui.commons.URLPortlet"),jQuery.sap.require("sap.ui.core.Control"),sap.ui.core.Control.extend("sapui6.ui.commons.URLPortlet",{metadata:{library:"sapui6.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"400px"},margin:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},marginLeft:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},marginRight:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},marginTop:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},marginBottom:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},iconHoverColor:{type:"sap.ui.core.CSSColor",group:"Misc",defaultValue:null},headerBackgroundColor:{type:"sap.ui.core.CSSColor",group:"Misc",defaultValue:null},title:{type:"string",defaultValue:""},titleColor:{type:"sap.ui.core.CSSColor",group:"Appearance",defaultValue:null},titleFontSize:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},borderRadius:{type:"sap.ui.core.CSSSize",defaultValue:"0px"},borderColor:{type:"sap.ui.core.CSSColor",group:"Appearance",defaultValue:null},visible:{type:"boolean",defaultValue:!0},collapsed:{type:"boolean",defaultValue:!0},scroll:{type:"boolean",defaultValue:!1},url:{type:"sap.ui.core.URI",defaultValue:null},expandIcon:{type:"string",group:"Misc",defaultValue:"sap-icon://slim-arrow-down"},collapseIcon:{type:"string",group:"Misc",defaultValue:"sap-icon://slim-arrow-up"}}},_collapseIconId:null,onBeforeRendering:function(){jQuery.sap.require("sap.ui.core.theming.Parameters"),this.getTitleColor()||this.setProperty("titleColor",sap.ui.core.theming.Parameters.get("sapUiBaseText"),!0),this.getTitleFontSize()||this.setProperty("titleFontSize",sap.ui.core.theming.Parameters.get("sapUiFontHeader4Size"),!0),this.getBorderColor()||this.setProperty("borderColor",sap.ui.core.theming.Parameters.get("sapUiMediumBorder"),!0),this.getHeaderBackgroundColor()||this.setProperty("headerBackgroundColor",sap.ui.core.theming.Parameters.get("sapUiBaseBG"),!0),this.getIconHoverColor()||this.setProperty("iconHoverColor",sap.ui.core.theming.Parameters.get("sapUiActive"),!0)},renderer:function(e,t){if(t.getVisible()){if(e.write("<div"),e.writeControlData(t),e.addStyle("width",t.getWidth()),t.getMargin()&&e.addStyle("margin",t.getMargin()),t.getMarginLeft()&&e.addStyle("margin-left",t.getMarginLeft()),t.getMarginRight()&&e.addStyle("margin-right",t.getMarginRight()),t.getMarginTop()&&e.addStyle("margin-top",t.getMarginTop()),t.getMarginBottom()&&e.addStyle("margin-bottom",t.getMarginBottom()),e.addStyle("border-color",t.getBorderColor()),e.writeStyles(),e.addClass("sapui6_portlet"),e.writeClasses(),e.write(">"),e.write("<div"),e.addStyle("background-color",t.getHeaderBackgroundColor()),e.addStyle("color",t.getTitleColor()),e.addStyle("border-color",t.getBorderColor()),e.writeStyles(),e.addClass("heading"),e.writeClasses(),e.write(">"),t.getCollapsed()){e.write("<span"),e.addClass("btn-right"),e.writeClasses(),e.write(">");var r=new sap.ui.core.Icon(t.getId()+"-portlet-collapse-icon",{src:t.getCollapseIcon(),press:t.collapse.bind(t)});t._collapseIconId=r.getId(),t.getIconHoverColor()&&r.setHoverColor(t.getIconHoverColor()),e.renderControl(r),e.write("</span>")}e.write(t.getTitle()),e.write("</div>"),e.write('<div id="'+t.getId()+'-portlet-content"'),e.addClass("body"),e.writeClasses(),e.addStyle("height",t.getHeight()),t.getScroll()&&e.addStyle("overflow","auto"),e.writeStyles(),e.write(">");var o=new sap.ui.core.HTML({content:'<iframe src="'+t.getUrl()+'" frameborder="0" width="'+t.getWidth()+'" height="'+t.getHeight()+'"></iframe>'});e.renderControl(o),e.write("</div>"),e.write("</div>")}}}),sapui6.ui.commons.URLPortlet.prototype.collapse=function(){var e=$("#"+this.getId()+"-portlet-content");if("block"==e.css("display")){sap.ui.getCore().byId(this._collapseIconId).setSrc(this.getExpandIcon());var t=window.setInterval(function(){if("0px"==e.css("height"))window.clearInterval(t),e.css("display","none");else{parseInt(e.css("height").replace("px",""));0>e-30?e.css("height","0px"):e.css("height",parseInt(e.css("height").replace("px",""))-30+"px")}},10)}else{sap.ui.getCore().byId(this._collapseIconId).setSrc(this.getCollapseIcon()),e.css("display","block");var r=this.getHeight(),t=window.setInterval(function(){if(e.css("height")==r)window.clearInterval(t);else{var o=parseInt(e.css("height").replace("px",""));o+30>parseInt(r.replace("px",""))?e.css("height",r):e.css("height",parseInt(e.css("height").replace("px",""))+30+"px")}},10)}};