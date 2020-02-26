// Copyright 2017. INFOCG Inc. all rights reserved.
jQuery.sap.declare("u4a.ui.Iframe");
jQuery.sap.require("sap.ui.core.Control");

u4a.ui.IframeAlign = {
		None : "none",
		Left : "left",
		Right : "right",
		Initial : "initial",
		Inherit : "inherit"
};

sap.ui.core.Control.extend("u4a.ui.Iframe", {	//EXTENSION CONTROL NAME
	metadata : {
		library : "u4a.ui", //U4A LIB PATH
		properties : {
			src : { type: "string", defaultValue: "" },
			height : { type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "100%"},
			width : { type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "100%"},
			align : { type : "u4a.ui.IframeAlign", defaultValue: u4a.ui.IframeAlign.Left },
			frameborder : { type: "int", defaultValue: 0 },
			border : { type: "int", defaultValue: 0 },
			cellspacing  : { type: "int", defaultValue: 0 }
		} // end property,

	},  //end metadata

	    
	init : function () {
	
	
	},
	  
	renderer : function(rm, oControl) {
	    rm.write("<iframe");
	    rm.writeControlData(oControl);  // ID 자동 채번
	    rm.writeAttribute("src", oControl.getSrc());
	    rm.writeAttribute("height", oControl.getHeight());
	    rm.writeAttribute("width", oControl.getWidth());
		
		// The align attribute is not supported in HTML5. Use CSS instead.
		//rm.writeAttribute("align", oControl.getFrameborder());
		rm.addStyle("float", oControl.getAlign());
		
		//The frameborder attribute is not supported in HTML5. Use CSS instead.
		//rm.writeAttribute("frameborder", oControl.getFrameborder());
		 
		if((oControl.getFrameborder() == 0) && (oControl.getBorder() == 0)){
			rm.addStyle("border", "none");
		} 
		else {	
			// frameborder 또는 border 속성 중에 값이 있는 속성의 값을 적용한다. 	
			if(oControl.getFrameborder() != 0){
				rm.addStyle("border", oControl.getFrameborder() + "px solid lightgrey" );	
			} 
			else {
				rm.addStyle("border", oControl.getBorder() + "px solid lightgrey" );	
			}
		}
	
	    rm.writeAttribute("cellspacing", oControl.getCellspacing());
		
		rm.writeStyles();
	    rm.write(">");
	    rm.write("</iframe>");
	},
	  
	onBeforeRendering : function(){



	},
	  
	onAfterRendering : function(){



	}
	  
});