//Copyright 2017. INFOCG Inc. all rights reserved.
u4a.m.RichEditorJoditTheme = { Default : "default", Dark : "dark" };

sap.ui.define("u4a.m.RichEditorJodit", [
"sap/ui/core/Control",
'sap/ui/core/library',
], function(Control, coreLibrary){
    "use strict";
	
	// shortcut for sap.ui.core.TextDirection
	var TextDirection = coreLibrary.TextDirection;	

    var oEditor = Control.extend("u4a.m.RichEditorJodit", {
        metadata : {
            library: "u4a.m",
            properties: {
				theme : { type : "u4a.m.RichEditorJoditTheme", defaultValue : u4a.m.RichEditorJoditTheme.Default },
				width: { type : "sap.ui.core.CSSSize", defaultValue : "100%" },
				height: { type : "sap.ui.core.CSSSize", defaultValue : "100%" },
				value: { type : "string", defaultValue : null },
				editable: { type : "boolean", defaultValue : true }, /* readonly */
				enabled: { type : "boolean", defaultValue : true }, /* disable */
				allowResizeX: { type : "boolean", defaultValue : false }, /* 가로 방향 Resize 가능여부 */
				allowResizeY: { type : "boolean", defaultValue : false }, /* 세로 방향 Resize 가능여부 */
				maxLength: { type : "int", defaultValue: 0 },
				stickyToolbar: { type : "boolean", defaultValue : false },
				textDirection: { type: "sap.ui.core.TextDirection", defaultValue: TextDirection.Inherit },
            }

        }, /**** end of metadata ****/

        init : function(){

			try {
				var jodit = Jodit;

				if(typeof jodit == "undefined"){
					jQuery.u4aJSloadAsync("/zu4a_imp/tools/jodit/lib/jodit.js", function(){});
				}
			}
			catch(e){
				jQuery.u4aJSloadAsync("/zu4a_imp/tools/jodit/lib/jodit.js", function(){});
			}

        }, /**** end of init ****/

        renderer : function(oRm, oControl){

            oRm.openStart("div", oControl);
            oRm.class("u4aMRichEdtJodit");
            oRm.style("width", oControl.getWidth());
            oRm.style("height", oControl.getHeight());
            oRm.openEnd();

            oRm.openStart("textarea", oControl.getId() + "-txtarea");
            oRm.class("u4aMRichEdtJoditTxtArea");
            oRm.style("display", "none");
            oRm.openEnd();

            oRm.close("textarea");

            oRm.close("div");

        }, /**** end of renderer ****/

        onBeforeRendering : function(){

            /* css file load */
            this._loadCssTheme();

        }, /**** end of onBeforeRendering ****/

        onAfterRendering : function(){

            /* 프로퍼티 설정 */
            this._setEditorProperties();

        }, /**** end of onAfterRendering ****/

        _setEditorProperties : function(){

            var sId = this.getId() + "-txtarea",
                oEditorDom = document.getElementById(sId);

            if(!oEditorDom){ return; }

            /* Jodit Editor Instance Creation */
            var oEditor = new Jodit(oEditorDom, {
				theme : this.getTheme(),
                disablePlugins: "file,image-properties,video,about,class-span,copy-format,placeholder,fullsize,search,source,stat,print,preview,symbols,selectall",
				enter: "DIV",
				uploader: {
					insertImageAsBase64URI: false,
					imagesExtensions: [
						"jpg",
						"png",
						"jpeg",
						"gif"
					]
				},		                
				askBeforePasteFromWord: true,
                width: this.getWidth(),
                height: this.getHeight(),
                maxWidth: this.getWidth(),
                maxHeight: this.getHeight(),
                allowResizeX: this.getAllowResizeX(),
                allowResizeY: this.getAllowResizeY(),
                limitChars: this.getMaxLength() == 0 ? false : this.getMaxLength(),
                toolbarSticky: this.getStickyToolbar(),
				direction: this.getTextDirection() == "Inherit" ? TextDirection.LTR : this.getTextDirection()
            });

            this._oEditor = oEditor;

            /* Jodit Editor Events */

            this._attachEventForJodit(oEditor);

            /* apply property value */

            this.setEnabled(this.getEnabled());

            this.setEditable(this.getEditable());

        }, /**** end of _editorInitSettings ****/

        _attachEventForJodit : function(oEditor){

            var that = this;

            /* Change Event */
            oEditor.events.on('change', function(e){

              this.setProperty("value", e, true);

            }.bind(this));

            /* FullSize Event 
            oEditor.events.on("toggleFullSize", function(e){

                this.setProperty("fullSize", e, true);

            }.bind(this));
			*/
        }, /**** end of attachEventForJodit ****/

        _getEditor : function(){

            return this._oEditor;

        }, /**** end of getEditor ****/

        _loadCssTheme : function(){

            /* css file load */
            var sEditorCssDomId = "u4aRichEditorJodit_Style",
                oEditorCssDom = document.getElementById(sEditorCssDomId);

            if(oEditorCssDom){ return; }

            var ajaxOptions = {
                url: "/zu4a_imp/tools/jodit/lib/jodit.css",
                dataType: "text",
                async: false,
                mimeType : "text/css",
                success : function(cssData){

                    if(cssData == ""){
                        throw new Error('[U4AIDE] Load Fail to u4aRichEditorJodit css files');
                    }

                    cssData += ".jodit-toolbar-button button, .jodit-ui-button { display: inline-block; }";
                    cssData += ".jodit-properties_image_view > img { width: 100%; height: 100%; }";                
                    cssData += ".jodit-ui-group__copyformat { display: none; }";                    
                    cssData += ".jodit-toolbar-button_fullsize { display: none; }";                    
                    cssData += ".jodit-toolbar-button_copyformat { display: none; }";                    
                    cssData += ".jodit-toolbar-button_source { display: none; }";                    

                    $("<style id='" + sEditorCssDomId + "'></style>").appendTo("head").html(cssData);

                },
                error : function(){
                    throw new Error('[U4AIDE] Load Fail to u4aRichEditorJodit css files');
                }

            } /**** end of ajaxOptions ****/

            /* css load를 위한 ajax 호출*/
            jQuery.ajax(ajaxOptions);

        }, /**** end of _loadCssTheme ****/

        setValue : function(sValue){

            this.setProperty("value", sValue, true);

            var oEditor = this._getEditor();
            if(!oEditor){
                return;
            }

            oEditor.setEditorValue(sValue);

        }, /**** end of setValue ****/

        getValue : function(){

            var oEditor = this._getEditor();
            if(!oEditor){
                return;
            }

            var sEditorValue = oEditor.getEditorValue();

            this.setProperty("value", sEditorValue, true);

            return sEditorValue;

        }, /**** end of getValue ****/

        setEnabled : function(bIsEnabled){

            this.setProperty("enabled", bIsEnabled, true);

            var oEditor = this._getEditor();
            if(!oEditor){
                return;
            }

            oEditor.setDisabled(!bIsEnabled);

            if(bIsEnabled){
                oEditor.setReadOnly(bIsEnabled);
                oEditor.setReadOnly(!bIsEnabled);
            }

        }, /**** end of setEnabled ****/

        setEditable : function(bIsEdit){

            this.setProperty("editable", bIsEdit, true);

            var oEditor = this._getEditor();
            if(!oEditor){
                return;
            }

            oEditor.setReadOnly(bIsEdit);
            oEditor.setReadOnly(!bIsEdit);

        }, /**** end of setEditable ****/
		
		/*
        setFullSize : function(isFull){

            this.setProperty("fullSize", isFull, true);

            var oEditor = this._getEditor();
            if(!oEditor){
                return;
            }

            oEditor.toggleFullSize(isFull);

        },
		*/

        exit : function(){

			this._oEditor = null;

        } /**** end of exit ****/

    });

    return oEditor;

});