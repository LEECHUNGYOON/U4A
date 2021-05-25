// Copyright 2017. INFOCG Inc. all rights reserved.
jQuery.sap.declare("u4a.ui.Iframe");
jQuery.sap.require("sap.ui.core.Control");

u4a.ui.IframeAlign = {
    None: "none",
    Left: "left",
    Right: "right",
    Initial: "initial",
    Inherit: "inherit"
};

sap.ui.core.Control.extend("u4a.ui.Iframe", { //EXTENSION CONTROL NAME
    metadata: {
        library: "u4a.ui", //U4A LIB PATH
        properties: {
            src: {
                type: "string",
                defaultValue: ""
            },
            height: {
                type: "sap.ui.core.CSSSize",
                group: "Appearance",
                defaultValue: "100%"
            },
            width: {
                type: "sap.ui.core.CSSSize",
                group: "Appearance",
                defaultValue: "100%"
            },
            align: {
                type: "u4a.ui.IframeAlign",
                defaultValue: u4a.ui.IframeAlign.Left
            },
            frameborder: {
                type: "int",
                defaultValue: 0
            },
            border: {
                type: "int",
                defaultValue: 0
            },
            cellspacing: {
                type: "int",
                defaultValue: 0
            },
            style: {
                type: "string",
                defaultValue: ""
            },
        } // end property,

    }, //end metadata


    init: function() {
        this._iframe = document.createElement("iframe");
    },

    renderer: function(rm, oControl) {
        rm.openStart("div",oControl);
        rm.style("width",oControl.getWidth());
        rm.style("height",oControl.getHeight());
        rm.openEnd();
        rm.close("div");

        if(!oControl._iframe){return;}
        
        oControl._iframe.style.width = oControl.getWidth();
        oControl._iframe.style.height = oControl.getHeight();

        var l_border = 0;

        if(oControl.getFrameborder()){
            l_border = oControl.getFrameborder();
        }else if(oControl.getBorder()){
            l_border = oControl.getBorder();        
        }

        oControl._setBorder(l_border);
        oControl._iframe.align = oControl.getAlign();
        oControl._iframe.cellspacing = oControl.getCellspacing();
        oControl.addStyleClass(oControl.getStyle());
    },

    onBeforeRendering: function() {

    },

    onAfterRendering: function() {
       var l_dom = this.getDomRef();
       if(!l_dom){return;}
       l_dom.appendChild(this._iframe);

    },
    _setBorder: function(p) {
        this._iframe.style.border = p + "px solid lightgrey";

    },
    setSrc: function(p) {
        this.setProperty('src', p, true);
        if (!this._iframe) {
            return;
        }
        var l_val = p;
        if(typeof p === "undefined" || p === null){
            l_val = "";
        }
        this._iframe.src = l_val;
    },
    setHeight: function(p) {
        this.setProperty('height', p, true);
        if (!this._iframe) {
            return;
        }
        this._iframe.style.height = p;
        var l_dom = this.getDomRef();
        if(!l_dom){return;}
        l_dom.style.height = p;
    },
    setWidth: function(p) {
        this.setProperty('width', p, true);
        if (!this._iframe) {
            return;
        }
        this._iframe.width = p;
    },
    setAlign: function(p) {
        this.setProperty('align', p, true);
        if (!this._iframe) {
            return;
        }
        this._iframe.align = p;
    },
    setFrameborder: function(p) {
        this.setProperty('frameborder', p, true);
        if (!this._iframe) {
            return;
        }
        this._setBorder(p);
    },
    setBorder: function(p) {
        this.setProperty('border', p, true);
        if (!this._iframe) {
            return;
        }
        this._setBorder(p);
    },
    setCellspacing: function(p) {
        this.setProperty('border', p, true);
    }

});