//Copyright 2017. INFOCG Inc. all rights reserved. 

jQuery.sap.declare("u4a.ui.Image");
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Element.extend("u4a.ui.Image", {
    metadata : {
      library : "u4a.ui",

        properties : {
          title : { type : "string", group : "Misc", defaultValue : null },
          description : { type : "string", group : "Misc", defaultValue : null },
          src : { type : "string", group : "Misc", defaultValue : null },
      }

    }
});