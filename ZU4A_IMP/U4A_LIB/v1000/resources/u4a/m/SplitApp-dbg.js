//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.SplitApp", [
"sap/m/SplitApp",
"sap/ui/thirdparty/jquery",
"sap/ui/Device",
"sap/ui/dom/containsOrEquals"

], function(SplitApp, jQuery, Device, containsOrEquals){
    "use strict";

    /* @property
     *  - masterPageFixed
     *    #param (boolean) {
     *      true  : masterPage 고정,
     *      false : masterPage 고정해제
     *    }
     *    #설명 {
     *      sap.m.SplitApp 의 'mode' property 에서 'StretchCompressMode' 가 masterPage 를 고정 시키는 동작을 한다.
     *      sap.m.SplitApp 의 'mode' property 에서 'HideMode' 는 detailPage의 전체 넓이 100% 를 기준으로, masterPage 가 숨겨져 있다가
     *      상단에 master button 을 클릭하면 좌측에서 masterPage 가 나타나는 동작을 한다.
     *      'masterPageFixed' property 가 'true' 로 설정되면 내부적으로는 sap.m.SplitApp 의 'mode' property 를 'StretchCompressMode' 로 적용시키고,
     *      'masterPageFixed' property 가 'true' 로 설정되면 sap.m.SplitApp 의 'mode' property 를 'HideMode' 로 적용시킨다.
     *    }
     *
     *  - masterPageWidth
     *    #param (CSSSize)
     *    #설명 {
     *      masterPage 의 넓이를 조절한다.
     *      허용 가능한 width 의 단위는 '%' 또는 'px'만 가능하다.
     *    }
     *
     *  - masterPageExpand
     *    #param (boolean) {
     *      true  : masterPage 를 펼친다.
     *      false : masterPage 를 접는다.
     *    }
     *
     *  - rightPageWidth
     *    #param (CSSSize)
     *    #설명 {
     *      rightPage 의 넓이를 조절한다.
     *      허용 가능한 width 의 단위는 '%' 또는 'px'만 가능하다.
     *    }
     *
     *  - rightPageExpand
     *    #param (boolean) {
     *      true  : rightPage 를 펼친다.
     *      false : rightPage 를 접는다.
     *    }
     *
     *  - rightPageAutoHide
     *    #param (boolean) {
     *      true  : rightPage 이외의 영역을 클릭 시, rightPage가 자동으로 접히게 설정한다.
     *      false : rightPage 이외의 영역을 클릭해도 rightPage가 자동으로 접히지 않는다.
     *    }
     */

    var oSplitApp = SplitApp.extend("u4a.m.SplitApp", {
        metadata : {
            library : "u4a.m",
            properties : {
                masterPageFixed : { type : "boolean", defaultValue : false },
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

        renderer : function(oRm, oControl){

            sap.m.SplitAppRenderer.render(oRm, oControl);

            if(oControl.getRightPage()){
                oControl._rightPageRender(oRm, oControl);
            }

        }, // end of renderer

        onBeforeRendering : function(){

            this._setMasterAnimation();
            this._setRightAnimation();

        },

        onAfterRendering : function(){

            SplitApp.prototype.onAfterRendering.apply(this, arguments);

            // masterPage 고정 여부에 따라 동작 시킨다.
            this.setMasterPageFixed(this.getMasterPageFixed());

            // 마스터 버튼(메뉴펼침버튼)에 등록되어 있는 press 이벤트를 제거한 후 이벤트 핸들링을 변경한다.
            var oMasterBtn = this._oShowMasterBtn;
            if(oMasterBtn != null && oMasterBtn.mEventRegistry["press"] != null){
                oMasterBtn.detachPress(oMasterBtn.mEventRegistry["press"][0].fFunction);
                oMasterBtn.attachPress(this._attachPressMasterBtnEvent.bind(this));
            }

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

        _getComputedWidth : function(oPage, sWidth){

            if(oPage == null){
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
                if(jQuery.sap.endsWith(oPage.sId, "Master")){
                    iWidth = iWidth * -1;
                    isMaster = true;
                }

                sComputedWidth = iWidth + "px";
            }
            else {

                // % 단위 일경우
                sComputedWidth = "100%";

                // master page인 경우 width값에 마이너스로 변경하여 css animation에 적용한다.
                if(jQuery.sap.endsWith(oPage.sId, "Master")){
                    isMaster = true;
                    iWidth = parseInt(sComputedWidth);
                    iWidth = iWidth * -1;

                    sComputedWidth = iWidth + "%";
                }
            }

            return sComputedWidth;

        },

        _setMasterAnimation : function(){

            var oMaster = this._oMasterNav,
                sMasterWidth = this.getMasterPageWidth(),
                sMasterCompWidth = this._getComputedWidth(oMaster, sMasterWidth);

            // 마스터 페이지 유무 확인
            if(oMaster == null){
                return;
            }

            // 마스터 페이지 동적 CSS 생성
            var oMasterStyle = document.getElementById('u4aMSplitApp_masterStyle');
            if(oMasterStyle != null){
               $(oMasterStyle).remove();
            }

            var oMasterStyleDom = document.createElement("style");
                oMasterStyleDom.id = 'u4aMSplitApp_masterStyle';

            // Master Page CSS
            var sMasterCSS = '.u4aMSplitAppMaster {';
                sMasterCSS += 'width : ' + sMasterWidth;
                sMasterCSS += '}';

            // masterPageShow CSS
                sMasterCSS += '.u4aMSplitAppMasterShow {';
                sMasterCSS += 'transform: translate3d(0px, 0px, 0px) !important;';
                sMasterCSS += 'transition: all 300ms ease 0s !important;';
                sMasterCSS += 'box-shadow: rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px !important;';
                sMasterCSS += 'visibility: visible !important;';
                sMasterCSS += '}';

            // masterPageHide CSS
                sMasterCSS += '.u4aMSplitAppMasterHide {';
                sMasterCSS += 'transform: translate3d(' + sMasterCompWidth + ',0,0) !important;';
                sMasterCSS += '-webkit-transform: translate3d(' + sMasterCompWidth + ',0,0) !important;';
                sMasterCSS += 'transition: all 300ms !important;';
                sMasterCSS += '-webkit-transition: all 300ms !important;';
                sMasterCSS += 'box-shadow: rgba(255, 255, 255, 0) 0px 0rem 0rem 0px, rgba(255, 255, 255, 0) 0px 0px 0px 0px !important;';
                sMasterCSS += '}';

                oMasterStyleDom.innerText = sMasterCSS;
                document.head.appendChild(oMasterStyleDom);

            // 기 적용된 CSS를 삭제한다.
            oMaster.removeStyleClass('u4aMSplitAppMaster');
            oMaster.removeStyleClass('u4aMSplitAppMasterShow');
            oMaster.removeStyleClass('u4aMSplitAppMasterHide');

            oMaster.addStyleClass('u4aMSplitAppMaster');
            if(this.getMasterPageExpand()){
                oMaster.addStyleClass('u4aMSplitAppMasterShow');
            }
            else {
                oMaster.addStyleClass('u4aMSplitAppMasterHide');
            }

        },

        _setRightAnimation : function(){

            var oRight = this._oRightPage;
            var oRightPage = this.getRightPage();

            // RightPage 유무 확인
            if(oRight == null){
                return;
            }

            // RightPage 동적 CSS 생성
            var sRightPageWidth = this.getRightPageWidth(),
                sRightCompWidth = this._getComputedWidth(oRightPage, sRightPageWidth);

            var oRightStyle = document.getElementById('u4aMSplitApp_rightStyle');
                if(oRightStyle != null){
                   $(oRightStyle).remove();
                }

                var oRightStyleDom = document.createElement("style");
                    oRightStyleDom.id = 'u4aMSplitApp_rightStyle';

                // rightPage CSS
                var sRightCss = '.u4aMSplitAppRightPage {';
                    sRightCss += 'height: 100%;';
                    sRightCss += 'display: inline-block;';
                    sRightCss += 'position: absolute;';
                    sRightCss += 'z-index: 4;';
                    sRightCss += 'top: 0;';
                    sRightCss += 'box-sizing: border-box;';
                    sRightCss += 'width: ' + sRightPageWidth + ';';
                    sRightCss += 'right: 0;';
                    sRightCss += 'border-left: #ebebeb;';
                    sRightCss += 'background-color: #ffffff;';
                    sRightCss += '}';

                    // rightPageShow Css
                    sRightCss += '.u4aMSplitAppRightShow {';
                    sRightCss += 'transform: translate3d(0px, 0px, 0px) !important;';
                    sRightCss += 'transition: all 300ms ease 0s !important;';
                    sRightCss += 'box-shadow: rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px !important;';
                    sRightCss += 'visibility: visible !important;';
                    sRightCss += '}';

                    // masterPageHide CSS
                    sRightCss += '.u4aMSplitAppRightHide {';
                    sRightCss += 'transform: translate3d(' + sRightCompWidth + ',0,0) !important;';
                    sRightCss += '-webkit-transform: translate3d(' + sRightCompWidth + ',0,0) !important;';
                    sRightCss += 'transition: all 300ms !important;';
                    sRightCss += '-webkit-transition: all 300ms !important;';
                    sRightCss += 'box-shadow: rgba(255, 255, 255, 0) 0px 0rem 0rem 0px, rgba(255, 255, 255, 0) 0px 0px 0px 0px !important;';
                    sRightCss += 'visibility: hidden;';
                    sRightCss += '}';

                    oRightStyleDom.innerText = sRightCss;
                    document.head.appendChild(oRightStyleDom);

              var $RightPage = $(oRight);
                  $RightPage.removeClass('u4aMSplitAppRightPage');
                  $RightPage.removeClass('u4aMSplitAppRightShow');
                  $RightPage.removeClass('u4aMSplitAppRightHide');

              $RightPage.addClass('u4aMSplitAppRightPage');

              if(this.getRightPageExpand()){
                  $RightPage.addClass('u4aMSplitAppRightShow');
              }
              else {
                  $RightPage.addClass('u4aMSplitAppRightHide');
              }

        },



        _attachPressMasterBtnEvent : function(){

            this._bMasterPageExpand = !this._bMasterPageExpand;

            this.setMasterPageExpand(this._bMasterPageExpand);

        },

        setMasterPageFixed : function(bFixed){

            /* true  : SplitAppMode 를 'StretchCompressMode' 로 설정하여 masterPage를 Fix 한다.
             * false : SplitAppMode 를 'HideMode' 로 설정하여 masterPage를 Fix 하지 않는다.
             */
            if(bFixed){
                this.setMode(sap.m.SplitAppMode.StretchCompressMode);
            }
            else {
                this.setMode(sap.m.SplitAppMode.HideMode);
            }

            //this.setMasterPageExpand(bFixed);

            this.setProperty("masterPageFixed", bFixed, true);

        },

        setMasterPageExpand : function(bExpand){

            /* SplitAppMode가 'StretchCompressMode' 일 경우,
             * masterPageExpand 를 false로 변경해도 masterPage를 무조건 Fix해야 하기 때문에
             * 'bExpand' Parameter 를 true로 강제 변환한다.
             */

            if (this.getMode() == sap.m.SplitAppMode.StretchCompressMode){
                bExpand = true;
            }

            this.setProperty("masterPageExpand", bExpand, true);

            this._bMasterPageExpand = bExpand;

            this._setMasterAnimation();

        },

        setMasterPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("masterPageWidth", sWidth, true);

            this.setMasterPageExpand(this.getMasterPageExpand());

        },

        setRightPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            this.setProperty("rightPageWidth", sWidth, true);

            this.setRightPageExpand(this.getRightPageExpand());

        },

        setRightPageExpand : function(bExpand){

            this.setProperty("rightPageExpand", bExpand, true);

            if(this._oRightPage == null){
                return;
            }

            this._setRightAnimation();

        },

        setRightPageAutoHide : function(bIsAuto){

            this.setProperty("rightPageAutoHide", bIsAuto, true);

        },

        _rightPageRender : function(oRm, oControl){

           oRm.write("<div");
           oRm.addClass("u4aMSplitAppRightPage");
           oRm.writeAttribute("id", oControl.getId() + "-RightPage");
           oRm.writeClasses();
           oRm.write(">");

           oRm.renderControl(oControl.getRightPage());

           oRm.write("</div>");

        }, // end of _rightPageRender

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

            /* StretchCompressMode 일 경우,
             * - masterPage에 버튼이외의 UI를 클릭하면 RightPage가 자동으로 접혀진다.
             */
            if (this.getMode() == sap.m.SplitAppMode.StretchCompressMode
               && bIsMasterNav
               && (!metaData.getEvent('press'))){
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
