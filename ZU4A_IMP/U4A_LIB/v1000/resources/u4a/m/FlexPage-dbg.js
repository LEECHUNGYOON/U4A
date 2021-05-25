//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.FlexPage", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var FlexPage = Control.extend("u4a.m.FlexPage", {
        metadata : {
            library : "u4a.m",
            properties : {
                showHeaderContent : { type : "boolean", defaultValue : true },
                showFooterContent : { type : "boolean", defaultValue : true },
                showCircleMenu : { type : "boolean", defaultValue : false },
                headerContentHeight : { type : "sap.ui.core.CSSSize", defaultValue : '' },
                footerContentHeight : { type : "sap.ui.core.CSSSize", defaultValue : '' },
            },

            defaultAggregation : "content",

            aggregations : {
               "content" : { type : "sap.ui.core.Control", multiple : true, singularName: "content" },
               "headerContent" : { type : "sap.ui.core.Control", multiple : true, singularName: "headerContent" },
               "footerContent" : { type : "sap.ui.core.Control", multiple : true, singularName: "footerContent" },
               "circleMenu" : { type : "u4a.m.CircleMenu", multiple : false },
            }

        }, /* end of metadata */

        onBeforeRendering : function(){

            /* FlexPage Wapper */
            var oPageVBox = new sap.m.VBox({
                width: "100%",
                height: "100%"
            }).addStyleClass("u4aMFlexPageWapper"),

            /* Header의 높이 */
            sHeaderHeight = this.getHeaderContentHeight(),

            /* FlexPage의 Header 영역 */
            oHeaderVBox = new sap.m.VBox({
                height: sHeaderHeight == "" ? "" : sHeaderHeight,
                layoutData : new sap.m.FlexItemData({
                    growFactor : 0,
                    shrinkFactor : 0
                })
            }).addStyleClass("u4aMFlexPageHeader sapMTBStandard"),

            /* FlexPage의 Content 영역 */
            oContentVBox = new sap.m.VBox({
                width: "100%",
                height: "100%",
            }).addStyleClass("u4aMFlexPageContent"),

            /* Footer의 높이 */
            sFooterHeight = this.getFooterContentHeight(),

            /* FlexPage의 Footer 영역 */
            oFooterVBox = new sap.m.VBox({
                height: sFooterHeight == "" ? "" : sFooterHeight,
                layoutData : new sap.m.FlexItemData({
                    growFactor : 0,
                    shrinkFactor : 0
                })
            }).addStyleClass("u4aMFlexPageFooter sapMTBStandard");

            /* "headerContent" aggregation 에 UI들이 있을 경우에만 Header 영역을 추가한다 */
            if(this.getShowHeaderContent()){
                oPageVBox.addItem(oHeaderVBox);
            }

            oPageVBox.addItem(oContentVBox);

            /* "footerContent" aggregation 에 UI들이 있을 경우에만 Footer 영역을 추가한다 */
            if(this.getShowFooterContent()){
                oPageVBox.addItem(oFooterVBox);
            }

            /* 각 영역별 instance 저장 */
            this._oPageVBox = oPageVBox;
            this._oHeaderVBox = oHeaderVBox;
            this._oContentVBox = oContentVBox;
            this._oFooterVBox = oFooterVBox;

        }, /* end of onBeforeRendering */

        renderer : function(oRm, oFlexPage){

            oRm.openStart("div", oFlexPage);
            oRm.style("width", "100%");
            oRm.style("height", "100%");
            oRm.class("u4aMFlexPage");
            oRm.openEnd();

            oRm.renderControl(oFlexPage._oPageVBox);

            var oCircleMenu = oFlexPage.getAggregation("circleMenu");
            if(oFlexPage.getShowCircleMenu() && oCircleMenu){
                oRm.renderControl(oCircleMenu);
            }

            oRm.close("div");

        }, /* end of renderer */

        onAfterRendering : function(){

            /* header 영역 컨텐츠 렌더링 */
            if(this.getShowHeaderContent()){
                this._renderHeaderContent();
            }

            /* content 영역 컨텐츠 렌더링 */
            this._renderContent();

            /* footer 영역 컨텐츠 렌더링 */
            if(this.getShowFooterContent()){
                this._renderFooterContent();
            }

            /* FlexPage Css 구성*/
            this._setFlexPageCss();

        }, /* end of onAfterRendering */

        /**
         * headerContent Rendering
         */
        _renderHeaderContent : function(){

            var aHeaderContent = this.getHeaderContent(),
                iContentLength = aHeaderContent.length;

            if(!iContentLength){
                return;
            }

            var oRm = sap.ui.getCore().createRenderManager(),
                oHeaderDom = this._oHeaderVBox.getDomRef();

            for(var i = 0; i < iContentLength; i++){

                var oContent = aHeaderContent[i];

                oRm.renderControl(oContent);

            }

            oRm.flush(oHeaderDom);
            oRm.destroy();

        }, /* end of _renderHeaderContent */

        /**
         * content Rendering
         */
        _renderContent : function(){

            var aContent = this.getContent(),
                iContentLength = aContent.length;

            if(!iContentLength){
                return;
            }

            var oRm = sap.ui.getCore().createRenderManager(),
                oContentDom = this._oContentVBox.getDomRef();

            for(var i = 0; i < iContentLength; i++){

                var oContent = aContent[i];

                oRm.renderControl(oContent);

            }

            oRm.flush(oContentDom);
            oRm.destroy();

        }, /* end of _renderContent */

        /**
         * footerContent Rendering
         */
        _renderFooterContent : function(){

            var aFooterContent = this.getFooterContent(),
                iContentLength = aFooterContent.length;

            if(!iContentLength){
                return;
            }

            var oRm = sap.ui.getCore().createRenderManager(),
                oContentDom = this._oFooterVBox.getDomRef();

            for(var i = 0; i < iContentLength; i++){

                var oContent = aFooterContent[i];

                oRm.renderControl(oContent);

            }

            oRm.flush(oContentDom);
            oRm.destroy();

        }, /* end of _renderFooterContent */

        /**
         * FlexPage Css Create
         */
        _setFlexPageCss : function(){

            var oStyleCssDom = document.getElementById("flexPageCss");
            if(oStyleCssDom){
                return;
            }

            var oStyleCss = document.createElement("style");
                oStyleCss.id = "flexPageCss";

            var sStyle = ".u4aMFlexPageContent { overflow-y : auto; overflow-x : hidden; display: block; }";
                sStyle += ".u4aMFlexPageHeader { display: block; overflow-y : auto; overflow-x : hidden; background-color: #fff; ";
                sStyle += "box-shadow: inset 0 -0.0625rem #d9d9d9, 0 0 0.25rem 0 rgb(0 0 0 / 15%); }";
                sStyle += ".u4aMFlexPageFooter { border-top: 1px solid #d9d9d9; display: block; background-color: #fff; ";
                sStyle += "overflow-y : auto; overflow-x : hidden; ";
                sStyle += "box-shadow: inset 0 -0.0625rem #d9d9d9, 0 0 0.25rem 0 rgb(0 0 0 / 15%); }";
                sStyle += ".sapUiTheme-sap_fiori_3_dark .u4aMFlexPageHeader { box-shadow: none; background-color: #29313a; }"
                sStyle += ".sapUiTheme-sap_fiori_3_dark .u4aMFlexPageFooter { box-shadow: none; border-top: 1px solid #3a516a; background-color: #2c3d4f; }"

            oStyleCss.innerText = sStyle;

            document.body.appendChild(oStyleCss);

        }, /* end of _setFlexPageCss */

        exit : function(){
	
			if(this._oPageVBox){
				this._oPageVBox.destroy();
				this._oPageVBox = null;
				delete this._oPageVBox;
			}
			
			if(this._oHeaderVBox){
				this._oHeaderVBox.destroy();
				this._oHeaderVBox = null;
				delete this._oHeaderVBox;
			}
			
			if(this._oContentVBox){
				this._oContentVBox.destroy();
				this._oContentVBox = null;
				delete this._oContentVBox;
			}
					
			if(this._oFooterVBox){
				this._oFooterVBox.destroy();
				this._oFooterVBox = null;
				delete this._oFooterVBox;				
			}
	
        } /* end of exit */

    });

    return FlexPage;

});