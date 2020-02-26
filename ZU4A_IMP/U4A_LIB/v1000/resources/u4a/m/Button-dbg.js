//Copyright 2017. INFOCG Inc. all rights reserved. 

jQuery.sap.declare("u4a.m.Button");
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend("u4a.m.Button", {

    metadata : {
      library : "u4a.m",

    properties :{
      "text" : {  type : "string", defaultValue : "" },
      "width" : {  type : "sap.ui.core.CSSSize", defaultValue : "100px" },
      "height" : {  type : "sap.ui.core.CSSSize", defaultValue : "100px" },
      "textSize" : {  type : "sap.ui.core.CSSSize", defaultValue : "" },
      "backgroundColor" : { type : "sap.ui.core.CSSColor", defaultValue : "#bfbfbf"},
      "roundSize" : {  type : "sap.ui.core.CSSSize", defaultValue : "" },
      
    },


    events : {
      "press" : {},
      "hover" : {},
    }

    },  //end metadata

  onmouseover : function(oEvent){
    this.fireHover();
    
  },
  onclick : function(oEvent){
    this.firePress();
    
  },
     
  renderer: function(oRm, oBtn){

    var sText = oBtn.getText();
    var sWidth = oBtn.getWidth();
    var sHeight = oBtn.getHeight();
    var sBackColor = oBtn.getBackgroundColor();
    var sTooltip = oBtn.getTooltip();
    var sTextSize = oBtn.getTextSize();
    var sRoundSize = oBtn.getRoundSize();

    oBtn.setText(sText);
    oBtn.setWidth(sWidth);
    oBtn.setHeight(sHeight);
    
    // -- start button tag
    oRm.write("<button type=button");
    oRm.writeControlData(oBtn);

	if (sWidth != "" || sWidth.toLowerCase() === "auto") {
		oRm.addStyle("width", sWidth);
	}
    
    if (sHeight != "" || sWidth.toLowerCase() === "auto") {
		oRm.addStyle("height", sHeight);
	}
    
    if(sBackColor != ""){
		oRm.addStyle("background", sBackColor);
    } 
    
    oRm.addStyle("outline", "none");
    
    if(sRoundSize != ""){
      oRm.addStyle("border-radius", sRoundSize);
    }
    
    // add all style to button tag
    oRm.writeStyles();
  
    
    // add tooltip if available
	if (sTooltip) {
		oRm.writeAttributeEscaped("title", sTooltip);
	}
    
    oRm.write(">");
    // -- end button tag
    
    // -- start inner button tag
	oRm.write("<span");
	oRm.writeAttribute("id", oBtn.getId() + "-inner");
    
    oRm.addClass("sapMFocusable");
    oRm.addClass("sapMBtnDefault");
    oRm.addClass("sapMBtnHoverable");
    //oRm.addClass("sapMBtnInner");
    oRm.addClass("sapMBtnText");
   
    // add all classes to inner button tag
		oRm.writeClasses();
    
    if(sTextSize != ""){
        oRm.addStyle("font-size", sTextSize);
    }
    
    // add all style to inner button tag
    oRm.writeStyles();
    
	// -- close inner button tag
	oRm.write(">");
    
    // -- start content button tag
    oRm.write("<span");
		oRm.writeAttribute("id", oBtn.getId() + "-content");
    oRm.addClass("sapMBtnContent");
    
    // -- close content button tag
	oRm.write(">");
    
    oRm.write("<bdi>");
    
    oRm.writeEscaped(sText);
    
    oRm.write("</bdi>");
    
    oRm.write("</span>");
    oRm.write("</span>");
			
    oRm.write("</button>");
  },
});
