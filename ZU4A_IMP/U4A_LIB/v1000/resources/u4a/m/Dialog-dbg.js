//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.Dialog", [
"sap/ui/core/Control",
"sap/m/Dialog",
"sap/m/DialogRenderer"

], function(Control, mDialog, DialogRenderer){
    "use strict";

    var Dialog = mDialog.extend("u4a.m.Dialog", {
        metadata : {
            library : "u4a.m",
            properties : {
                fullSizePopup : { type : "boolean", defaultValue : false },
                enableOffset : { type : "boolean", defaultValue : false },
                rememberPosition : { type : "boolean", defaultValue : false },
                offsetX : { type: "int", defaultValue: null },
                offsetY : { type: "int", defaultValue: null },
                
                showHeader: { type: "boolean", group: "Appearance", defaultValue: true, deprecated: true },
                stretch: { type: "boolean", group: "Appearance", defaultValue: false, deprecated: true },
                escapeHandler : { type: "any", group: "Behavior", defaultValue: null, deprecated: true },
                closeOnNavigation: { type: "boolean", group: "Behavior", defaultValue: true, deprecated: true },
            },

            aggregations: {
                customHeader: { type: "sap.m.IBar", multiple: false, deprecated: true },
            },

            events : {
                dialogClose : {
                    allowPreventDefault: true,
                }
            }
            
        }, // end of metadata

        init : function(){

            mDialog.prototype.init.apply(this, arguments);

            this.addStyleClass("u4aMDialog");

            var sCssAreaName = "u4aMDialogCssArea",
                oDialogStyleArea = document.getElementById(sCssAreaName);

            // Dialog Css 내용
            if(!oDialogStyleArea){
                var sCssData = ".u4aMDialogOffsetOpen {";
                    sCssData += "transform: scale(1) !important;";
                    sCssData += "-webkit-transform: scale(1) translateZ(0px) !important;";
                    sCssData += "}";
                    sCssData += ".u4aMDialogStretchFull {";
                    sCssData += "transform: none !important;";
                    sCssData += "-webkit-transform: scale(1) translateZ(0px) !important; ";
                    sCssData += "top: 0%!important;";
                    sCssData += "bottom: 0%!important;";
                    sCssData += "left: 0%!important;";
                    sCssData += "right: 0%!important;";
                    sCssData += "max-height: none!important;";
                    sCssData += "max-width: none!important;";
                    sCssData += "height: auto!important;";
                    sCssData += "width: auto!important;";
                    sCssData += "min-width: 0!important;";
                    sCssData += "min-height: 0!important;";
                    sCssData += "}";
                    sCssData += ".u4aMDialogStretchFullContent .sapMDialogSection {";
                    sCssData += "height: 100% !important;";
                    sCssData += "}";
                    sCssData += ".u4aMDialog {";
                    //sCssData += "max-width: 100%;";
                    //sCssData += "max-height: 100% !important;";
                    sCssData += "}";
					sCssData += ".u4aMDialog .sapMDialogScroll {";
					sCssData += "height: 100%;";
					sCssData += "}";


                $("<style id='" + sCssAreaName + "'></style>").appendTo("head").html(sCssData);
            }

        },

        onBeforeRendering : function(){

            mDialog.prototype.onBeforeRendering.apply(this, arguments);

            // Dialog Header Setting
            this._setHeaderSetting();

        },

        renderer : function(oRm, oControl){

            DialogRenderer.render(oRm, oControl);

        }, // end of renderer

        onAfterRendering : function(){

           mDialog.prototype.onAfterRendering.apply(this, arguments);

           // dialog 기본 세팅
           this._dialogDefaultSetting();

           this.setFullSizePopup(this.getFullSizePopup());

           this._setEnableOffset();

        }, // end of onAfterRendering

        setTitle : function(sText){

            this.setProperty("title", sText);

            if(!this._title){
                return;
            }

            this._title.setText(sText);

        },

        setIcon : function(sIconSrc){

            this.setProperty("icon", sIconSrc);

            if(!this._icon || sIconSrc == ""){
                return;
            }

            this._icon.setSrc(sIconSrc);

        },

        setTitleAlignment: function(sAlign){

            this.setProperty("titleAlignment", sAlign);

            if(!this._toolbar){
                return;
            }

			var oToolBar = this._toolbar,
				oContent = oToolBar.getContent()[0];

            switch(sAlign){
                case sap.m.TitleAlignment.Auto:
                case sap.m.TitleAlignment.Start:

                    if (!(oContent instanceof sap.m.ToolbarSpacer)){
                        return;
                    }

                    oToolBar.removeContent(oContent);

                    break;

                case sap.m.TitleAlignment.Center:

                    if (oContent instanceof sap.m.ToolbarSpacer){
                        return;
                    }

                    oToolBar.insertContent(new sap.m.ToolbarSpacer(), 0);
                    break;

                default:
                    break;
            }

        },

        setFullSizePopup : function(bIsFull){

            this.setProperty("fullSizePopup", bIsFull, true);

            // Dialog Header ToolBar 영역의 팝업창 크기 버튼 Visible/Invisible 처리
            this._setToolbarBtnVisible(bIsFull);

            var $dialog = this.$();
            if(!$dialog.length){
                return;
            }

            // Dialog가 전체창 일 경우.
            if(bIsFull){
                this._setDialogFullSize();
                return;
            }

            this._setDialogBeforeSize();

        },  

        open : function(){

            mDialog.prototype.open.apply(this, arguments);

            var $dialog = this.$(),

             // dialog Content 영역
                sDlgConId = this.getId() + "-cont",
                oDlgCon = document.getElementById(sDlgConId);

            // Dialog Position 정보를 구한다.
            var windowWidth = window.innerWidth,
                windowHeight = window.innerHeight,
                initial = {
					width: $dialog.width(),
					height: $dialog.height(),
					position : {
						x: $dialog.offset().left,
						y: $dialog.offset().top
					}
                },
                oManuallySetPosition = {
                    x: initial.position.x,
                    y: initial.position.y
                };

            //set the new position of the dialog on mouse down when the transform is disabled by the class
            $dialog.css({
                left: Math.min(Math.max(0, oManuallySetPosition.x), windowWidth - initial.width),
                top: Math.min(Math.max(0, oManuallySetPosition.y), windowHeight - initial.height),
                width: initial.width,
                height: initial.height,
                transform: ""
            });

			$dialog.addClass("sapMDialogTouched");
			$dialog.addClass('sapDialogDisableTransition');

			if(this.getRememberPosition()){
				// Dialog 이전 위치값이 있을 경우 적용
				this._setDialogBeforeSize();
			}

			this._oManuallySetSize = this._oBeforePosition;

			// Dialog를 화면에 배치할때 offset을 사용한다면 하위 로직 수행
			this._setEnableOffset();			

		},
		
		// 팝업 위치 저장
        _registerPopUpPosition : function(){

			var $dialog = this.$(),

			// dialog Content 영역
			sDlgConId = this.getId() + "-cont",
			oDlgCon = document.getElementById(sDlgConId);

			if(!oDlgCon){
				return;
			}

			// Open 한 후의 Dialog 위치 정보 저장
			this._oBeforePosition = {
				left: $dialog.css("left"),
				top: $dialog.css("top"),
				width: $dialog.css("width"),
				height: $dialog.css("height"),
				contentHeight : $(oDlgCon).css("height"),
			}

        },

		setOffsetX : function(sOffsetX){

			this.setProperty("offsetX", sOffsetX, true);

			this._setEnableOffset();

		},

		setOffsetY : function(sOffsetY){

			this.setProperty("offsetY", sOffsetY, true);

			this._setEnableOffset();

		},

		setEnableOffset : function(bIsEnable){

			//this.setProperty("enableOffset", bIsEnable, bIsEnable);
			this.setProperty("enableOffset", bIsEnable);

			this._bDisableRepositioning = bIsEnable;
			
			if(!bIsEnable){
				return;
			}

			this._setEnableOffset();

		},

		setRememberPosition : function(bRemenber){

			//this.setProperty("rememberPosition", bRemenber, true);
			this.setProperty("rememberPosition", bRemenber);
			
			if(this._oBeforePos_tmp){
				this._oBeforePosition = this._oBeforePos_tmp;	
				delete this._oBeforePos_tmp;
			}

			if(!bRemenber){
				this._oBeforePos_tmp = this._oBeforePosition;
				delete this._oBeforePosition;
			}

		},

		_setEnableOffset : function(){

			if(!this.$().length){
				return;
			}

			if(!this.getEnableOffset()){
				return;
			}
			
			if(this.getRememberPosition()){
				return;				
			}
			
			//this._setDimensions();
			
			var $dialog = this.$(),
			sOffsetX = this.getOffsetX() + "px",
			sOffsetY = this.getOffsetY() + "px",
			sDialogWidth = $dialog.css("width"),
			sDialogHeight = $dialog.css("height");

			$dialog.addClass("u4aMDialogOffsetOpen");
			$dialog.addClass("sapDialogDisableTransition");
			$dialog.addClass("sapMDialogTouched");

			$dialog.css('top', sOffsetY);
			$dialog.css('left', sOffsetX);

			if(this._oBeforePosition && this.getRememberPosition()){
				$dialog.css('top', this._oBeforePosition.top);
				$dialog.css('left', this._oBeforePosition.left);
				return;
			}
	
		},

		close : function(){
			mDialog.prototype.close.apply(this, arguments);
			this.fireDialogClose();
		},

        _dialogDefaultSetting : function(){

			this.oPopup.setModal(false);
            this.oPopup.setShadow(false);

            this.setTitle(this.getTitle());
            this.setIcon(this.getIcon());
            this.setTitleAlignment(this.getTitleAlignment());

        },

        _setHeaderSetting : function(){

            var that = this,
                oTool = new sap.m.Toolbar().addStyleClass("sapMBarTitleStart"),
                oSpacer = new sap.m.ToolbarSpacer(),
                oTitle = new sap.m.Title(),
                oIcon = new sap.ui.core.Icon().addStyleClass("sapMDialogIcon"),
                oBtn1 = new sap.m.Button({ icon: "sap-icon://exit-full-screen" }),   // 이전크기 버튼
                oBtn2 = new sap.m.Button({ icon: "sap-icon://full-screen" }),   // 최대화 버튼
                oBtn3 = new sap.m.Button({ icon: "sap-icon://decline" });   // 닫기 버튼

                oTool.addContent(oIcon);
                oTool.addContent(oTitle);
                oTool.addContent(oSpacer);
                oTool.addContent(oBtn1);
                oTool.addContent(oBtn2);
                oTool.addContent(oBtn3);

            this._toolbar = oTool;
            this._minSizeBtn = oBtn1;
            this._fullSizeBtn = oBtn2;
            this._closeBtn = oBtn3;
            this._title = oTitle;
            this._icon = oIcon;

            // Dialog Header ToolBar 영역의 팝업창 크기 버튼 Visible/Invisible 처리
            this._setToolbarBtnVisible(this.getFullSizePopup());

            this.setCustomHeader(oTool);

            /***** Button Event *****/

            oBtn1.attachEvent("press", this._dialogSizeBtnPressEvent.bind(this, false));
            oBtn2.attachEvent("press", this._dialogSizeBtnPressEvent.bind(this, true));
            oBtn3.attachEvent("press", function(oEvent){

                // 팝업의 이전 위치 정보를 지운다
                delete that._oBeforePosition;

                // 팝업의 위치 정보를 유지 할 경우
                if(that.getRememberPosition()){
                    that._registerPopUpPosition();

                    if(that.getFullSizePopup()){

                        delete that._oBeforeFullSizeOffset;
                        that._oBeforeFullSizeOffset = that._oBeforePosition;

                    }
                }
                else {
					delete that._oBeforePos_tmp;
                    that.setProperty("fullSizePopup", false, true);
                }

                that.close();

            });

        },
		
		 // Dialog 이전크기로 복원
        _setDialogBeforeSize : function(){

            var $dialog = this.$();

                $dialog.css('transform', '');
                $dialog.css('-webkit-transform', '');
				
				$dialog.addClass("sapMDialogTouched");                
                $dialog.addClass('sapDialogDisableTransition');

            if(!this.getFullSizePopup()){
                $dialog.removeClass("u4aMDialogStretchFullContent");
                $dialog.removeClass("u4aMDialogStretchFull");
            }

            // Dialog Content 영역의 높이를 구한다.
            var sDlgConId = this.getId() + "-cont",
                oDlgCon = document.getElementById(sDlgConId);

            if(!this._oBeforePosition){

                //this._setEnableOffset();	
				if (!this.getStretch() && !this._oManuallySetSize && !this._bDisableRepositioning) {
					$dialog.css(this._calcCenter());
					$dialog.css({
						width : $dialog.css("width"),
						height : $dialog.css("height"),
					});
					
					//$(oDlgCon).css("height", "");
				}								
				
                return;
            }

            $dialog.css("left", this._oBeforePosition.left);
            $dialog.css("top", this._oBeforePosition.top);			
			$dialog.css("width", this._oBeforePosition.width);
            $dialog.css("height", this._oBeforePosition.height);			
            //$(oDlgCon).css("height", this._oBeforePosition.contentHeight);
			
			if(this.getRememberPosition() && this.getContentWidth() !== ""){
				$dialog.css("width", this.getContentWidth());			
			}
			if(this.getRememberPosition() && this.getContentHeight() !== ""){
				$dialog.css("height", this.getContentHeight());			
			}
			
        },

        // Dialog 전체화면
        _setDialogFullSize : function(){

            // Dialog의 이전 위치를 저장한다.
            var $dialog = this.$(),

            // Dialog Content 영역의 높이를 구한다.
                sDlgConId = this.getId() + "-cont",
                oDlgCon = document.getElementById(sDlgConId);
				
			$dialog.addClass("sapMDialogTouched");                
			$dialog.addClass('sapDialogDisableTransition');	

            $dialog.addClass("u4aMDialogStretchFull");
            $dialog.addClass("u4aMDialogStretchFullContent");
			
            delete this._oBeforePosition;

        },

        // Dialog 크기 변경 버튼 visible or invisible 처리
        _setToolbarBtnVisible : function(bIsFull){

			if(!this._minSizeBtn){
				return;
			}

			this._minSizeBtn.setVisible(bIsFull);
			this._fullSizeBtn.setVisible(!bIsFull);

        },

        _calcCenter : function(){        
            return this._calcCenterDialog();
        },

        _calcCenterDialog : function(){
			
            var windowWidth = window.innerWidth,
                windowHeight = window.innerHeight,
                $this = this.$(),
                dialogWidth = $this.outerWidth(),
                dialogHeight  = $this.outerHeight();

			return {
				left: Math.round((windowWidth - dialogWidth) / 2),
				top: Math.round((windowHeight - dialogHeight) / 2)
			};
			
        }, // end of _calcCenterDialog

        _dialogSizeBtnPressEvent : function(bFullSize){

            this._setToolbarBtnVisible(bFullSize);

            this.setFullSizePopup(bFullSize);

        },

        _onResize : function(){

            mDialog.prototype._onResize.apply(this, arguments);
			
            if(!this.getFullSizePopup()){

                var $dialog = this.$(),
					$dialogContent = this.$('cont');
                    $dialogContent.css("height", "");
					
				if (!this.getStretch() && !this._oManuallySetSize && !this._bDisableRepositioning) {
					$dialog.css(this._calcCenter());
				}	

            }
			
        },

        onmouseup : function(oEvent){

            var isToolbar = $(oEvent.target).hasClass("sapMIBar");
            if(!isToolbar){
                return;
            }

            if(!sap.ui.Device.browser.msie){
                return;
            }

            this.oPopup._updateBlindLayer();

        },

        onmousedown : function(oEvent){

            if(this.getFullSizePopup()){
                return;
            }

            mDialog.prototype.onmousedown.apply(this, arguments);
			
			var isToolbar = $(oEvent.target).hasClass("sapMIBar");
            if(!isToolbar){
                return;
            }

            var oHeader = this.getCustomHeader(),
                oHeaderDomRef = oHeader.getDomRef();

                oHeaderDomRef.setAttribute("tabindex", 0);
                oHeaderDomRef.focus();

            if(!sap.ui.Device.browser.msie){
                return;
            }

            this.oPopup._updateBlindLayer();

        },
		
		// dialog header DoubleClick Event
        ondblclick : function(oEvent){

            if(this.getFullSizePopup()){
                return;
            }

			var isToolbar = $(oEvent.target).hasClass("sapMIBar");
            if(!isToolbar){
                return;
            }

            var $dialog = this.$(),
                oBefore = this._oBeforePosition || {};

            oBefore.width = $dialog.css('width');
            oBefore.height = $dialog.css('height');

            mDialog.prototype.ondblclick.apply(this, arguments);

            this.$().removeClass('u4aMDialogOffsetOpen');

            $dialog.css("width", oBefore.width);
            $dialog.css("height", oBefore.height);
			
			this._oManuallySetSize = {
					width: oBefore.width,
					height: oBefore.height
			};

            $dialog.addClass("sapMDialogTouched");
            $dialog.addClass('sapDialogDisableTransition');

            var oCalcu = this._calcCenterDialog();

            $dialog.css("left", oCalcu.left);
            $dialog.css("top", oCalcu.top);

        },

		setContentWidth : function(sWidth){
			
			this.setProperty("contentWidth", sWidth);
			
			delete this._oManuallySetSize;
			
			
		},
		
		setContentHeight : function(sHeight){
			
			this.setProperty("contentHeight", sHeight);
			
			delete this._oManuallySetSize;
			
		}

    });

    return Dialog;

});