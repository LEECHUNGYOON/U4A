//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.charts.am.AngularGaugeBand", [
"sap/ui/core/Element"

], function(Element){

    "use strict";
    var AngularGaugeBand = Element.extend("u4a.charts.am.AngularGaugeBand", {
		metadata : {
			library : "u4a.charts.am",
				properties : {
				startValue : { type: "int", defaultValue: 0 },
				endValue : { type: "int", defaultValue: 0 },
				bandColor : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
				radius : { type : "sap.ui.core.CSSSize", defaultValue : "100%" },
				innerRadius : { type : "sap.ui.core.CSSSize", defaultValue : "98%" },
				gradient : {type : "boolean", defaultValue : false },
			},

			events : {
				bandClick : {}
			}

		}, // end of metadata
    
		setStartValue : function(iStartValue){
			
			this.setProperty("startValue", iStartValue, true);

				if(typeof this._gaugeBand == "undefined"){
					return;
				}
			 
			this._gaugeBand.setStartValue(iStartValue);  
		
		}, // end of setStartValue    

		setEndValue : function(iEndValue){

			this.setProperty("endValue", iEndValue, true);

			if(typeof this._gaugeBand == "undefined"){
				return;
			}

			this._gaugeBand.setEndValue(iEndValue);

		} // end of setEndValue

	});

    return AngularGaugeBand;

});
