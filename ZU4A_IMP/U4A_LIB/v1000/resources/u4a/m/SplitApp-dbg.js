//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.SplitApp", [
"sap/m/SplitApp",

], function(SplitApp){
    "use strict";

    var oSplitApp = SplitApp.extend("u4a.m.SplitApp", {
        metadata : {
            library : "u4a.m",
            properties : {
                masterPageWidth : { type : "sap.ui.core.CSSSize", defaultValue : "330px" },
                masterPageExpand : { type : "boolean", defaultValue : false },
                rightPageWidth : { type : "sap.ui.core.CSSSize", defaultValue : "330px" },
                rightPageExpand : { type : "boolean", defaultValue : false }
            },

            aggregations : {
              "rightPage" : { type : "sap.m.Page", multiple : false},
            }

        }, // end of metadata

        renderer : function(oRm, oControl){

            sap.m.SplitAppRenderer.render(oRm, oControl);
       
            // 모바일일 경우는 RightPage를 그리지 않는다.
            var isMobile = sap.ui.Device.system.phone;
            if(isMobile){
                return;
            }

            if(oControl.getRightPage()){
                oControl._rightPageRender(oRm, oControl);
            }

        }, // end of renderer

        onAfterRendering : function(){

            SplitApp.prototype.onAfterRendering.apply(this, arguments);
            
            this.setMode(sap.m.SplitAppMode.HideMode);
            
            var isMobile = sap.ui.Device.system.phone;
            if(isMobile){
                return;
            }

            /*  HideMode일 경우에만
             *  마스터 버튼(메뉴펼침버튼)에 등록되어 있는 press 이벤트를 제거한 후 이벤트 핸들링을 변경한다.
             */
            var oMasterBtn = this._oShowMasterBtn;
            if(this.getMode() == sap.m.SplitAppMode.HideMode){
                oMasterBtn.detachPress(oMasterBtn.mEventRegistry["press"][0].fFunction);
                oMasterBtn.attachPress(this._attachPressMasterBtnEvent.bind(this));
            }
            
            // Right Page를 SplitApp의 Dom 안에 옮긴다.
            var oSplitApp = this.getDomRef();

            this._oRightPage = document.getElementById(this.getId() + "-RightPage");

            if(this._oRightPage == null){
                return;
            }

            oSplitApp.appendChild(this._oRightPage);

            // Right Page를 접는다.
            this.setRightPageExpand(this.getRightPageExpand());

        }, // end of onAfterRendering

        _attachPressMasterBtnEvent : function(){

            this._bMasterPageExpand = !this._bMasterPageExpand;

            this._setMasterPageExpand(this._bMasterPageExpand);
        },

        setMasterPageExpand : function(bExpand){
            
            this.setProperty("masterPageExpand", bExpand, true);

            this._bMasterPageExpand = bExpand;

            this._setMasterPageExpand(this._bMasterPageExpand);

        },

        setMasterPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("masterPageWidth", sWidth);

        },

        _setMasterPageExpand : function(bExpand){

            var oMaster = this._oMasterNav.getDomRef();

            if(oMaster == null){
                return;
            }

            var sMasterWidth = this.getMasterPageWidth();

            this._pageWidthValidCheck(sMasterWidth);

            this._setPageWidthAndExpandAnimation(oMaster, sMasterWidth, bExpand);

        },

        setRightPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("rightPageWidth", sWidth);

        },

        setRightPageExpand : function(bExpand){

        	this.setProperty("rightPageExpand", bExpand, true);

            if(this._oRightPage == null){
                return;
            }

            var sRightWidth = this.getRightPageWidth();

            this._setPageWidthAndExpandAnimation(this._oRightPage, sRightWidth, bExpand);

        },

        _rightPageRender : function(oRm, oControl){

           var sRightWidth = oControl.getRightPageWidth();
           var iWidth = parseInt(sRightWidth) * -1;
           var sComputedWidth = iWidth + "px";

           oRm.write("<div");
           oRm.addStyle("height", "100%");
           oRm.addStyle("display", "inline-block");
           oRm.addStyle("position", "absolute");
           oRm.addStyle("z-index: 5");
           oRm.addStyle("top", "0");
           oRm.addStyle("box-sizing", "border-box");
           oRm.addStyle("width", sRightWidth);
           oRm.addStyle("float", "left");
           oRm.addStyle("right", "0");
           oRm.addStyle("border-left", "#ebebeb");
           oRm.addStyle("background-color", "#ffffff");

           oRm.writeAttribute("id", oControl.getId() + "-RightPage");
           oRm.writeStyles();
           oRm.write(">");

           oRm.renderControl(oControl.getRightPage());

           oRm.write("</div>");

        }, // end of _rightPageRender
        
        // master & Right Page width & Expand Common function
        _setPageWidthAndExpandAnimation : function(oPage, sWidth, bExpand){

            if(oPage == null || typeof bExpand != "boolean"){
                return;
            }

            this._pageWidthValidCheck(sWidth);

            var iWidth = parseInt(sWidth);
            var isMaster = false;
            
            if(jQuery.sap.endsWith(oPage.id, "Master")){
                iWidth = iWidth * -1;
                isMaster = true;
            }

            var sComputedWidth = iWidth + "px";

            $(oPage).css("width", sWidth);

            if(bExpand){

               $(oPage).css("transform", "translate3d(0,0,0)");
               $(oPage).css("transition", "all 300ms");
               $(oPage).css("-webkit-transform", "translate3d(0,0,0)");
               $(oPage).css("-webkit-transition", "all 300ms");
               $(oPage).css("visibility", "visible");
               $(oPage).css("box-shadow", "rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px");

            }
            else {
                
               if((isMaster && this.getMode() != sap.m.SplitAppMode.ShowHideMode) || jQuery.sap.endsWith(oPage.id, "RightPage")){
                  $(oPage).css("transform", "translate3d(" + sComputedWidth + ",0,0)");
                  $(oPage).css("-webkit-transform", "translate3d(" + sComputedWidth + ",0,0)");
               } 
              
               $(oPage).css("transition", "all 300ms");
               $(oPage).css("-webkit-transition", "all 300ms");
               $(oPage).css("box-shadow", "");

            }

        },
       
        _pageWidthValidCheck : function(sWidth){

            if(!jQuery.sap.endsWith(sWidth, 'px')){
                throw new Error("[U4AIDE] property Type Error 'rightPageWidth' : 'px' 단위만 입력 가능합니다.");
            }

        },

        showMaster : function(){
            
            if(this.getMode() != sap.m.SplitAppMode.HideMode){
                SplitApp.prototype.showMaster.apply(this, arguments);
                return;
            }
            
            this.setMasterPageExpand(true);
            
        },

        hideMaster : function(){
        
            if(this.getMode() != sap.m.SplitAppMode.HideMode){
                SplitApp.prototype.hideMaster.apply(this, arguments);
                return;
            }

            this.setMasterPageExpand(false);
            
        }

    });

    return oSplitApp;

});
