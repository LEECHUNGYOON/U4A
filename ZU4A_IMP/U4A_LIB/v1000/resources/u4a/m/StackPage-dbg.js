//Copyright 2017. INFOCG Inc. all rights reserved. 

jQuery.sap.declare("u4a.m.StackPage");
jQuery.sap.require("sap.ui.core.Control"); 

sap.ui.core.Control.extend("u4a.m.StackPage", {
    metadata : {
      library : "u4.m",
        properties : {
          
      	},
      	
      	aggregations : {
			"leftPage" : { type : "sap.m.Page", multiple : false },
			"rightPage" : { type : "sap.m.Page", multiple : false }
		},

    },
	
    init : function () {
      

    }

});