jQuery.sap.declare("sapui6.ui.commons.UppercaseField");

sap.ui.commons.TextField.extend("sapui6.ui.commons.UppercaseField", { 
    library : "sapui6.ui.commons",

    renderer : {},

    onAfterRendering : function(){
        this.attachBrowserEvent("keyup",function(e){
			var v = this.getLiveValue();
			this.setValue(v.toUpperCase());
		});	
    }
});
