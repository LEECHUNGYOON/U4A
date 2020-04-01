//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.SplitApp", [
"sap/m/SplitApp",
"sap/ui/thirdparty/jquery",
"sap/ui/Device",
"sap/ui/dom/containsOrEquals"

], function(SplitApp, jQuery, Device, containsOrEquals){
    "use strict";

    var oSplitApp = SplitApp.extend("u4a.m.SplitApp", {
        metadata : {
            library : "u4a.m",
            properties : {
                masterPageWidth : { type : "sap.ui.core.CSSSize", defaultValue : "330px" },
                masterPageExpand : { type : "boolean", defaultValue : false },
                rightPageWidth : { type : "sap.ui.core.CSSSize", defaultValue : "330px" },
                rightPageExpand : { type : "boolean", defaultValue : false },
                rightPageAutoHide : { type : "boolean", defaultValue : true }
            },

            aggregations : {
              "rightPage" : { type : "sap.m.Page", multiple : false },
            }

        }, // end of metadata

        init : function(){
        
            SplitApp.prototype.init.apply(this, arguments);
              
            // u4a.m.SplitApp는 HideMode만 지원함.
            this.setMode(sap.m.SplitAppMode.HideMode);
            
        },

        renderer : function(oRm, oControl){

            sap.m.SplitAppRenderer.render(oRm, oControl);
       
            if(oControl.getRightPage()){
                oControl._rightPageRender(oRm, oControl);
            }

        }, // end of renderer

        onAfterRendering : function(){

            SplitApp.prototype.onAfterRendering.apply(this, arguments);

            // 마스터 버튼(메뉴펼침버튼)에 등록되어 있는 press 이벤트를 제거한 후 이벤트 핸들링을 변경한다.
            var oMasterBtn = this._oShowMasterBtn;
            if(oMasterBtn != null){
                oMasterBtn.detachPress(oMasterBtn.mEventRegistry["press"][0].fFunction);
                oMasterBtn.attachPress(this._attachPressMasterBtnEvent.bind(this));
            } 

            // 마스터 페이지의 Expand 여부에 따라 동작시킨다.
            this.setMasterPageExpand(this.getMasterPageExpand());

            this._oRightPage = document.getElementById(this.getId() + "-RightPage");
            
            if(this._oRightPage != null){
                 
                 /* RightPage를 구성할 때, 접속 Device 별로 DOM의 위치가 다르다.
                  * - Desktop && Tablet
                  *   : SplitApp DOM 안에 구성한다.
                  *
                  * - Mobile
                  *   : Mobile 모드이면 NavContainer가 생성되며, 
                  *     NavContainer DOM 안에 RightPage를 삽입한다.
                  */

                 // Right Page를 SplitApp의 Dom 안에 옮긴다.
                var oSplitAppDOM = this.getDomRef();
                
                if(Device.system.phone){
                 
                    var oNaviCon = this.getAggregation("_navMaster"),
                        oNaviConDOM = oNaviCon.getDomRef();
                        
                        this._oRightPage.style.visibility = "hidden";
                        oNaviConDOM.appendChild(this._oRightPage);
                    
                }
                else {
                    oSplitAppDOM.appendChild(this._oRightPage);
                }
            
                // rightPageExpand 여부에 따라 우측 페이지를 접거나 펼친다.
                this.setRightPageExpand(this.getRightPageExpand());    
                
            }

        }, // end of onAfterRendering

        _attachPressMasterBtnEvent : function(){

            this._bMasterPageExpand = !this._bMasterPageExpand;

            this.setMasterPageExpand(this._bMasterPageExpand);

        },

        setMasterPageExpand : function(bExpand){
            
            this.setProperty("masterPageExpand", bExpand, true);

            this._bMasterPageExpand = bExpand;

            this._setMasterPageExpand(this._bMasterPageExpand);

        },

        setMasterPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("masterPageWidth", sWidth);

            this.setMasterPageExpand(this.getMasterPageExpand());

        },

        _setMasterPageExpand : function(bExpand){

            var oMaster = this._oMasterNav.getDomRef();

            if(oMaster == null){
                return;
            }

            var sMasterWidth = this.getMasterPageWidth();

            this._setPageWidthAndExpandAnimation(oMaster, sMasterWidth, bExpand);

        },

        setRightPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("rightPageWidth", sWidth);

            this.setRightPageExpand(this.getRightPageExpand());

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
           oRm.addClass("u4aMSplitAppRightPage");
           oRm.addStyle("height", "100%");
           oRm.addStyle("display", "inline-block");
           oRm.addStyle("position", "absolute");
           oRm.addStyle("z-index", "4");
           oRm.addStyle("top", "0");
           oRm.addStyle("box-sizing", "border-box");
           oRm.addStyle("width", sRightWidth);
           oRm.addStyle("float", "left");
           oRm.addStyle("right", "0");
           oRm.addStyle("border-left", "#ebebeb");
           oRm.addStyle("background-color", "#ffffff");

           oRm.writeAttribute("id", oControl.getId() + "-RightPage");
           oRm.writeStyles();
           oRm.writeClasses();
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

            var iWidth,
                sComputedWidth,
                isMaster = false;

            // px단위 일경우
            if(jQuery.sap.endsWith(sWidth, "px")){

                iWidth = parseInt(sWidth);
                
                // master page인 경우 width값에 마이너스로 변경하여 css animation에 적용한다.
                if(jQuery.sap.endsWith(oPage.id, "Master")){
                    iWidth = iWidth * -1;
                    isMaster = true;
                }

                sComputedWidth = iWidth + "px";
            }
            else {

            // % 단위 일경우    
                sComputedWidth = "100%";
                
                // master page인 경우 width값에 마이너스로 변경하여 css animation에 적용한다.
                if(jQuery.sap.endsWith(oPage.id, "Master") && bExpand == false){
                    isMaster = true;
                    iWidth = parseInt(sComputedWidth);
                    iWidth = iWidth * -1;

                    sComputedWidth = iWidth + "%";
                }

            }

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

               $(oPage).css("transform", "translate3d(" + sComputedWidth + ",0,0)");
               $(oPage).css("-webkit-transform", "translate3d(" + sComputedWidth + ",0,0)");
               $(oPage).css("transition", "all 300ms");
               $(oPage).css("-webkit-transition", "all 300ms");
               $(oPage).css("box-shadow", "rgba(255, 255, 255, 0) 0px 0rem 0rem 0px, rgba(255, 255, 255, 0) 0px 0px 0px 0px");

            }

        },
       
        _pageWidthValidCheck : function(sWidth){

            if(!jQuery.sap.endsWith(sWidth, 'px') && !jQuery.sap.endsWith(sWidth, '%')){
                throw new Error("[U4AIDE] property Type Error 'rightPageWidth' : 'px' 또는 % 단위만 입력 가능합니다.");
            }

        },

        showMaster : function(){
            
            SplitApp.prototype.showMaster.apply(this, arguments);
            
            this.setMasterPageExpand(true);
            
        },

        hideMaster : function(){
        
            SplitApp.prototype.hideMaster.apply(this, arguments);

            this.setMasterPageExpand(false);
            
        },

        ontap : function(oEvent){
        
            if (Device.system.phone) {
                return;
            }

            var bIsCollapse = true,  // 접을지 말지 여부
                bIsMasterNav = false,   // 마스터 여부
                bIsDetail = false,      // 디테일 위치 여부
                bIsRightPage = false,   // RightPage 여부

            $targetContainer = jQuery(oEvent.target).closest(".sapMSplitContainerDetail, .sapMSplitContainerMaster, .u4aMSplitAppRightPage"),
            $targetHeader = jQuery(oEvent.target).closest(".sapMPageHeader"),
            metaData = oEvent.srcControl.getMetadata();

            // is Master Page?
            if($targetContainer.length > 0 && $targetContainer.hasClass("sapMSplitContainerMaster")){
                bIsMasterNav = true;
            }

            // is Detail Page?
            if ($targetContainer.length > 0 && $targetContainer.hasClass("sapMSplitContainerDetail")) {
                bIsDetail = true;
            }

            // is Right Page?
            if ($targetContainer.length > 0 && $targetContainer.hasClass("u4aMSplitAppRightPage")) {
                bIsRightPage = true;
            }

            // Detail에 위치 하면서 페이지 헤더 인 경우
            var bIsHeader = false;
            if(bIsDetail && ($targetHeader.length > 0 && $targetHeader.hasClass("sapMPageHeader"))){
                bIsHeader = true;
                bIsCollapse = false;
            }
           
            // 헤더에 위치 하면서 버튼이 아닌 경우
            if(bIsHeader && metaData._sClassName != "sap.m.Button"){
                bIsCollapse = true;
            }
            
            // 헤더에 있으면서 부모가 버튼인 경우
            if( bIsHeader && (metaData == sap.ui.core.Icon.getMetadata() && oEvent.srcControl.getParent() instanceof sap.m.Button)){
                bIsCollapse = false;
            }

            // 마스터 또는 Right 페이지 일 경우
            if(bIsMasterNav || bIsRightPage){
                bIsCollapse = false;
            }
            
            // 헤더에 위치 하는 아이콘 이지만 부모가 버튼이 아닌경우 (아이콘 단독 UI 일 경우)
            if((bIsHeader && metaData == sap.ui.core.Icon.getMetadata()) && oEvent.srcControl.getParent() instanceof sap.m.Button == false){
                bIsCollapse = true;
            }

            if(bIsCollapse) {
                this.hideMaster();

                if(this.getRightPageAutoHide()){
                    this.setRightPageExpand(false);
                }
            }      

        } // end of ontap(event)

    });

    return oSplitApp;

});