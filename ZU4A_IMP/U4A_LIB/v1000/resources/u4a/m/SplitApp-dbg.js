//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.SplitApp", [
"sap/m/SplitApp",
"sap/ui/thirdparty/jquery",
"sap/ui/Device",
"sap/m/Button"
], function(SplitApp, jQuery, Device, Button){
    "use strict";

	/* @property
	 *  - showMasterPageNavButton
     *    #param (boolean) {
     *      true  : masterPage의 Navigation 버튼 활성화
     *      false : masterPage의 Navigation 버튼 비활성화
     *    }
	 *
	 *	- showMasterPageAnimation 
	 *	  (showMasterPageNavButton: true,
	 *	   masterPageExpand : false 일 경우만 동작함)
	 *	  #param (boolean) {
	 *		true : masterPage의 영역에 불빛이 내려가는 것 같은 애니메이션 동작 실행
	 *		false: 애니메이션 동작 중지
	 *	  }	
     *
     *  - masterPageNavButtonTop
	 *    #param (CSSSize)
	 *    #설명 {
	 *	    masterPageNavButton의 위치를 지정한다.
	 *    }
	 *
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
                showMasterPageNavButton : { type : "boolean", defaultValue : false },
                showMasterPageAnimation : { type : "boolean", defaultValue : false },
                masterPageNavButtonTop : { type : "sap.ui.core.CSSSize", defaultValue : "50px" },
                masterPageFixed : { type : "boolean", defaultValue : false },
                masterPageWidth : { type : "sap.ui.core.CSSSize", defaultValue : "330px" },
                masterPageExpand : { type : "boolean", defaultValue : false },
                rightPageWidth : { type: "sap.ui.core.CSSSize", defaultValue : "330px" },
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

        onAfterRendering : function(){

            SplitApp.prototype.onAfterRendering.apply(this, arguments);

            // Master & Right Page 관련 CSS를 생성한다.
            this._setMasterAnimation();
            this._setRightAnimation();

            // 접속 Device 가 Mobile 이면 MasterPageWidth를 100%로 한다. (Standard 사상 동일)
            if(Device.system.phone){
                this.setMasterPageWidth("100%");
            }
            else {
                // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 메소드
                // MasterPageNavButton을 그린다. 단, DeskTop 모드일 경우에만 실행.
                this._renderMasterNavButton();
            }

             // masterPage 고정 여부에 따라 동작 시킨다.
            if(this.getMasterPageFixed()){

                // mode를 'StretchCompressMode'로 주면 MasterPage가 고정된 효과를 준다.
                this.setMode(sap.m.SplitAppMode.StretchCompressMode);

                // MasterPage를 항상 펼쳐놓는다.
                this.setMasterPageExpand(true);

                // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 메소드
                //
                this.setShowMasterPageNavButton(false);

                // 상위(sap.m.SplitContaier) 의 Resize Event를 재정의 한다.
                this._handleResize();
            }
            else {
                this.setMode(sap.m.SplitAppMode.HideMode);
            }

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
			
			this.setMasterPageExpand(this.getMasterPageExpand());

        }, // end of onAfterRendering

        setShowMasterPageAnimation : function(bAnimation){

            this.setProperty("showMasterPageAnimation", bAnimation);

            this.removeStyleClass("u4aMSplitAppMasterAnimation");

            if(bAnimation){
                this.addStyleClass("u4aMSplitAppMasterAnimation");
            }

        },

        setShowMasterPageNavButton : function(bShow){

            this.setProperty("showMasterPageNavButton", bShow);

            this.removeStyleClass("u4aMSplitAppMasterNavButton");

            if(bShow){
                this.addStyleClass("u4aMSplitAppMasterNavButton");
            }

        },

        // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 메소드
        //  -- MasterNavButton Rendering
        _renderMasterNavButton : function(){

            var oAppDom = this.getDomRef();

            if(!oAppDom){
                return;
            }

            if(this._oMasterNavBtn){
                this._oMasterNavBtn.destroy();
                delete this._oMasterNavBtn;
            }

            this._oMasterNavBtn = new sap.m.Button(this.getId() + "-MasterNavBtn",{
                visible: this.getShowMasterPageNavButton(),
                press: this._pressMasterNavBtn.bind(this)
            }).addStyleClass("u4aSplitAppMasterNavBtn");

            var oRm = sap.ui.getCore().createRenderManager(),
                bIsExpand = this.getMasterPageExpand();

            // masterPageNavButton의 화살표 방향을 설정한다.
            this._masterNavBtnIconChange(bIsExpand);

            oRm.renderControl(this._oMasterNavBtn);

            oRm.flush(oAppDom, false, true);

        },

        _masterNavBtnIconChange : function(bIsExpand){

            var oBtn = this._oMasterNavBtn;
            if(oBtn == null){
                return;
            }

            var sIconUrl = "sap-icon://navigation-right-arrow";

            oBtn.removeStyleClass("u4aSplitAppMasterNavBtnShow");

            if(bIsExpand){
                sIconUrl = "sap-icon://navigation-left-arrow";
                oBtn.addStyleClass("u4aSplitAppMasterNavBtnShow");
            }

            // 버튼 아이콘 화살표 방향 변경
            oBtn.setIcon(sIconUrl);
            oBtn.rerender();

        },

        _pressMasterNavBtn : function(oEvent){

            var bIsExpand = this.getMasterPageExpand();

            this.setMasterPageExpand(!bIsExpand);

        },

        _handleResize : function(){

          // 상위 (sap.m.SplitContaier) 의 _handleResize를 먼저 수행한다.
            SplitApp.prototype._handleResize.apply(this, arguments);

            /* Standard(sap.m.SplitContainer) 의 Resize Event 에서,
             * 'StretchCompressMode' 이고 Browser 창을 줄이면
             * MasterPage 의 width를 330px 로 고정시키는 CSS를 적용함으로써 CSS 충돌 현상이 발생하여,
             * Resize Event Handle를 현재 인스턴스에서 재정의하여 이상현상을 회피하기 위한 로직.
             */
            if(this.getMode() == sap.m.SplitAppMode.StretchCompressMode
				&& this.$().hasClass("sapMSplitContainerPortrait")){

                this.$().removeClass("sapMSplitContainerPortrait");
            }

        }, // end of _handleResize

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

        _getMasterStyleDomId : function(){
            return this.getId() + "-u4aMSplitApp_masterStyle";
        },

        _getRightStyleDomId : function(){
            return this.getId() + "-u4aMSplitApp_rightStyle";
        },

        _setMasterAnimation : function(){

            var oMaster = this._oMasterNav;

            // 모바일로 접속한 경우는 MasterPageWidth를 100% 준다. (standard 기본기능)
            if(Device.system.phone || oMaster == null) {
                return;
            }

            var sAppId = this.getId(),
                sMasterWidth = this.getMasterPageWidth(),
                sMasterCompWidth = this._getComputedWidth(oMaster, sMasterWidth);

            var aMaserPages = this.getMasterPages(),
                iPageLen = aMaserPages.length;

            if(iPageLen == 0){
                return;
            }

            // MasterPage를 Visible 상태로 설정한다.
            for(var i = 0; i < iPageLen; i++){

                var oPage = aMaserPages[i],
                    bIsVisi = oPage.getVisible();

                if(bIsVisi){
                    continue;
                }

                oPage.setVisible(true);

            }

            // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 로직
            // showMasterPageNavButton: true,
            // 마스터 페이지 끝 부분이 보이게 한다.
            if(this.getShowMasterPageNavButton()){

                var oMasterNav = oMaster.getDomRef();
                if(!oMasterNav){
                    return;
                }

                /* MasterPage의 Width 값을 구하기 위해 더미 DOM을 생성하여 구한다. */
                var oSplitAppDom = oMaster.getParent().getDomRef(),
                    oMasterClone = oMasterNav.cloneNode();

                oMasterClone.style.visibility = "hidden";

                oSplitAppDom.appendChild(oMasterClone);

                $(oMasterClone).css("width", sMasterWidth);

                var sMasterWidth = $(oMasterClone).css("width");

                $(oMasterClone).remove();

                /* 2020-12-14 기 적용된 CSS를 삭제한다.
                 * 특정 Dom width의 %단위의 값을 px로 구하기 위해서
                 * 일시적으로 Dom에 %단위로 width를 준 후,
                 * jQuery.css("width") 로 px를 구할때,
                 * 기 적용된 CSS 중, Animation 효과가 적용되어 있으면
                 * 값을 잘못 구해지는 현상이 있다.
                 * 그래서, Animation 효과의 CSS를 지운 후에 구해야 정확한 %단위의 값을 px로 구할 수 있다.
                 */

                oMaster.removeStyleClass('sapMSplitContainerMaster');
                oMaster.removeStyleClass('sapMSplitContainerMasterHidden');
                oMaster.removeStyleClass('u4aMSplitAppMasterHide' + sAppId);

                $(oMasterNav).css("width", sMasterWidth);

                var sMasPgDefGap = 10;

                sMasterCompWidth = ((parseInt(sMasterWidth) * -1) + sMasPgDefGap) + "px";

                // showMasterPageNavButton == true && masterPageExpand = true 이면
                // MasterPage 내의 Page들을 Invisible 처리한다.
                if(iPageLen == 0){
                    return;
                }

                // masterPage를 접은 상태일 경우 masterPage가 안보이게 Invisible 처리한다.
                for(var i = 0; i < iPageLen; i++){

                    var oPage = aMaserPages[i];
                        oPage.setVisible(this.getMasterPageExpand());

                }

            } /* end of if(this.getShowMasterPageNavButton()) */

            // masterPageNavButton을 활성화 할 경우, 스탠다드의 메뉴접기펼치기 버튼을 비활성화한다.
            this._oShowMasterBtn.setVisible(!this.getShowMasterPageNavButton());

            // 마스터 페이지 동적 CSS 생성
            var oMasterStyle = document.getElementById(this._getMasterStyleDomId());
            if(oMasterStyle != null){
                $(oMasterStyle).remove();
            }

            var oMasterStyleDom = document.createElement("style");
                oMasterStyleDom.id = this._getMasterStyleDomId();

            // Master Page CSS
            var sMasterCSS = '.u4aMSplitAppMaster' + sAppId + '{';
                sMasterCSS += 'width : ' + sMasterWidth + ";";
                sMasterCSS += 'transition : all 300ms ease 0s !important;';
                sMasterCSS += '}';

            // masterPageShow CSS
                sMasterCSS += '.u4aMSplitAppMasterShow' + sAppId +'{';
                sMasterCSS += 'transform: translate3d(0px, 0px, 0px) !important;';
                sMasterCSS += 'box-shadow: rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px !important;';
                sMasterCSS += 'visibility: visible !important;';
                sMasterCSS += '}';

            // masterPageHide CSS
                sMasterCSS += '.sapUiTheme-sap_fiori_3_dark .u4aMSplitAppMasterHide' + sAppId + '{';
                sMasterCSS += 'background-color: #43505f;';
                sMasterCSS += '}';
                sMasterCSS += '.u4aMSplitAppMasterHide' + sAppId + '{';
                sMasterCSS += 'background-color: #CCCCCC;';
                sMasterCSS += 'transform: translate3d(' + sMasterCompWidth + ',0,0) !important;';
                sMasterCSS += '-webkit-transform: translate3d(' + sMasterCompWidth + ',0,0) !important;';
                sMasterCSS += 'transition: all 300ms ease 0s !important;';
                sMasterCSS += '-webkit-transition: all 300ms ease 0s !important;';
                sMasterCSS += 'box-shadow: rgba(255, 255, 255, 0) 0px 0rem 0rem 0px, rgba(255, 255, 255, 0) 0px 0px 0px 0px !important;';
                sMasterCSS += '}';

                // 2020-12-14 'showMasterPageNavButton' 이 활성화 상태면
                // masterPage의 오른쪽 끝 부분을 기본적으로 보여준다.
                sMasterCSS += '.u4aMSplitAppMasterNavButton .u4aMSplitAppMasterHide' + sAppId + '{';
                sMasterCSS += 'box-shadow: rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px !important;';
                sMasterCSS += 'visibility: visible;';
                sMasterCSS += '}';

                // 2020-12-27 'showMasterPageNavButton' 이 활성화 상태고,
                // 'MasterPageAnimation' 효과
                sMasterCSS += '.u4aMSplitAppMasterAnimation .u4aMSplitAppMasterHide {';
                sMasterCSS += 'background-image: linear-gradient(180deg, rgba(255,255,255,0) 46%, rgba(255,255,255,.8) 50%, rgba(255,255,255,.8) 52%, rgba(255,255,255,0) 56% );';
                sMasterCSS += 'background-size: 3000px 3000px;';
                sMasterCSS += 'animation: u4aMasterHideAnimation 3s linear infinite;'
                sMasterCSS += '}';
                sMasterCSS += '@keyframes u4aMasterHideAnimation {';
                sMasterCSS += '0% { background-position: 0px 0px; }';
                sMasterCSS += '80%, 100% { background-position: 4000px 4000px; }';
                sMasterCSS += '}';

                // masterPageNavButton Css
                // sizeCompact 적용일 경우
                sMasterCSS += '.sapUiSizeCompact .u4aSplitAppMasterNavBtn,';
                sMasterCSS += '.sapUiSizeCompact.u4aSplitAppMasterNavBtn { ';
                sMasterCSS += 'padding: 0px;';
                sMasterCSS += 'height: 1.5rem;';
                sMasterCSS += 'width: 1.5rem;';
                sMasterCSS += '}';
                sMasterCSS += '.sapUiSizeCompact .u4aSplitAppMasterNavBtn .sapMBtnInner,';
                sMasterCSS += '.sapUiSizeCompact.u4aSplitAppMasterNavBtn .sapMBtnInner { ';
                sMasterCSS += 'width: 1.5rem;';
                sMasterCSS += 'min-width: 1.5rem;';
                sMasterCSS += 'height: 1.5rem;';
                sMasterCSS += '}';
                sMasterCSS += '.u4aSplitAppMasterNavBtn { ';
                sMasterCSS += 'position: absolute;';
                sMasterCSS += 'left: 0px;';
                sMasterCSS += 'top: ' + this.getMasterPageNavButtonTop() + ';';
                sMasterCSS += 'z-index: 10;';
                sMasterCSS += 'transition: all 300ms;';
                sMasterCSS += '-webkit-transition: all 300ms;';
                sMasterCSS += '}';
                sMasterCSS += '.u4aSplitAppMasterNavBtn .sapMBtnInner { ';
                sMasterCSS += 'border-radius: 2rem;';
                sMasterCSS += '}';
                sMasterCSS += '.sapUiSizeCompact .u4aSplitAppMasterNavBtn .sapMBtnInner { ';
                sMasterCSS += 'border-radius: 1rem;';
                sMasterCSS += '}';

            // 2020-12-14 'showMasterPageNavButton' 이 활성화 상태이고,
            // MasterPageExpand시 적용할 CSS
            var iMasterBtnDefPos = -9,
                sMbDefPosPx = iMasterBtnDefPos + "px",
                iMasterBtnPos = (Math.abs(parseInt(sMasterCompWidth)) + iMasterBtnDefPos) + "px";

                sMasterCSS += '.u4aSplitAppMasterNavBtnShow { ';
                sMasterCSS += 'left: ' + iMasterBtnPos + ';';
                sMasterCSS += 'transition: all 300ms ease 0s;';
                sMasterCSS += '}';

            oMasterStyleDom.innerText = sMasterCSS;

            document.head.appendChild(oMasterStyleDom);

            // 기 적용된 CSS를 삭제한다.
            oMaster.removeStyleClass('u4aMSplitAppMaster u4aMSplitAppMaster' + sAppId);
            oMaster.removeStyleClass('u4aMSplitAppMasterShow u4aMSplitAppMasterShow' + sAppId);
            oMaster.removeStyleClass('u4aMSplitAppMasterHide u4aMSplitAppMasterHide' + sAppId);

            if(this.getMasterPageExpand()){
                oMaster.addStyleClass('u4aMSplitAppMasterShow u4aMSplitAppMasterShow' + sAppId);
            }
            else {
                oMaster.addStyleClass('u4aMSplitAppMasterHide u4aMSplitAppMasterHide' + sAppId);
            }

            oMaster.addStyleClass('u4aMSplitAppMaster u4aMSplitAppMaster' + sAppId);

            oMaster.addStyleClass('sapMSplitContainerMaster');
            oMaster.addStyleClass('sapMSplitContainerMasterHidden');

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

            var oRightStyle = document.getElementById(this._getRightStyleDomId());
            if(oRightStyle != null){
               $(oRightStyle).remove();
            }

            var oRightStyleDom = document.createElement("style");
              oRightStyleDom.id = this._getRightStyleDomId();

            var sAppId = this.getId();

            // rightPage CSS
            var sRightCss = '.u4aMSplitAppRightPage' + sAppId + '{';
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
                sRightCss += '.u4aMSplitAppRightShow' + sAppId + '{';
                sRightCss += 'transform: translate3d(0px, 0px, 0px);';
                sRightCss += 'transition: all 300ms ease 0s;';
                sRightCss += 'box-shadow: rgba(0, 0, 0, 0.15) 0px 0.625rem 1.875rem 0px, rgba(0, 0, 0, 0.15) 0px 0px 0px 1px;';
                sRightCss += 'visibility: visible;';
                sRightCss += '}';

                // rightPageHide CSS
                sRightCss += '.u4aMSplitAppRightHide' + sAppId + '{';
                sRightCss += 'transform: translate3d(' + sRightCompWidth + ',0,0);';
                sRightCss += '-webkit-transform: translate3d(' + sRightCompWidth + ',0,0);';
                sRightCss += 'transition: all 300ms;';
                sRightCss += '-webkit-transition: all 300ms;';
                sRightCss += 'box-shadow: rgba(255, 255, 255, 0) 0px 0rem 0rem 0px, rgba(255, 255, 255, 0) 0px 0px 0px 0px;';
                sRightCss += 'visibility: hidden;';
                sRightCss += '}';

            oRightStyleDom.innerText = sRightCss;
            document.head.appendChild(oRightStyleDom);

            var $RightPage = $(oRight);
                $RightPage.removeClass('u4aMSplitAppRightPage' + sAppId);
                $RightPage.removeClass('u4aMSplitAppRightShow' + sAppId);
                $RightPage.removeClass('u4aMSplitAppRightHide' + sAppId);

                $RightPage.addClass('u4aMSplitAppRightPage' + sAppId);

            if(this.getRightPageExpand()){
                $RightPage.addClass('u4aMSplitAppRightShow' + sAppId);
            }
            else {
                $RightPage.addClass('u4aMSplitAppRightHide' + sAppId);
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

            if(Device.system.phone){
                bFixed = true;
            }

            this.setProperty("masterPageFixed", bFixed);

            if(bFixed){
                this.setMode(sap.m.SplitAppMode.StretchCompressMode);
                this._handleResize();
            }
            else {
                this.setMode(sap.m.SplitAppMode.HideMode);

            }

            // this.setMasterPageExpand(bFixed);

        },

        setMasterPageExpand : function(bExpand){
            
            /* SplitAppMode가 'StretchCompressMode' 일 경우,
             * masterPageExpand 를 false로 변경해도 masterPage를 무조건 Fix해야 하기 때문에
             * 'bExpand' Parameter 를 true로 강제 변환한다.
             */

            if (Device.system.phone || this.getMode() == sap.m.SplitAppMode.StretchCompressMode){
				
				if(!bExpand){
                
                    // this.setProperty("masterPageExpand", bExpand, true);
                    // return;
                
                    bExpand = true;
                
                }
                
            }
            
            this.setProperty("masterPageExpand", bExpand, true);
         
            // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 로직추가
            // MasterPageNavButton의 화살표 아이콘 설정
            this._masterNavBtnIconChange(bExpand);

            this._bMasterPageExpand = bExpand;

            this._setMasterAnimation();

        },

        setMasterPageWidth : function(sWidth){

            this._pageWidthValidCheck(sWidth);

            if(Device.system.phone){
                sWidth = "100%";
            }

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

            var sAppId = oControl.getId();

            oRm.write("<div");
            oRm.addClass("u4aMSplitAppRightPage" + sAppId);
            oRm.writeAttribute("id", sAppId + "-RightPage");
            oRm.writeClasses();
            oRm.write(">");

            oRm.renderControl(oControl.getRightPage());

            oRm.write("</div>");

        }, // end of _rightPageRender

        _pageWidthValidCheck : function(sWidth){

            if(sWidth.toLowerCase){
                sWidth = sWidth.toLowerCase();
            }

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
                sAppId = this.getId(),

            $targetContainer = jQuery(oEvent.target).closest(".sapMSplitContainerDetail, .sapMSplitContainerMaster, .u4aMSplitAppRightPage" + sAppId),
            $targetHeader = jQuery(oEvent.target).closest(".sapMPageHeader"),
            metaData = oEvent.srcControl.getMetadata(),

            // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 로직
            // 클릭한 위치가 masterPageNavButton 인지 여부 확인
            oTarget = oEvent.srcControl,
            $targetButton = jQuery(oTarget.getDomRef()).closest(".u4aSplitAppMasterNavBtn");

            // is Master Page?
            if($targetContainer.length > 0 && $targetContainer.hasClass("sapMSplitContainerMaster")){
                bIsMasterNav = true;
            }

            // 2020-12-14 신규 추가된 'showMasterPageNavButton' Property 관련 메소드
            // 클릭한 위치가 MasterPageNavButton일 경우 MasterPage를 접지 않는다.
            if($targetButton.length > 0 && $targetButton.hasClass("u4aSplitAppMasterNavBtn")){
                bIsMasterNav = true;
            }

            // is Detail Page?
            if ($targetContainer.length > 0 && $targetContainer.hasClass("sapMSplitContainerDetail")) {
                bIsDetail = true;
            }

            // is Right Page?
            if ($targetContainer.length > 0 && $targetContainer.hasClass("u4aMSplitAppRightPage" + sAppId)) {
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

                if(!this.getMasterPageFixed()){
                    this.hideMaster();
                }

                if(this.getRightPageAutoHide()){
                    this.setRightPageExpand(false);
                }
            }

        } // end of ontap(event)

    });

    return oSplitApp;

});