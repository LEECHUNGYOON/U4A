//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.BadgeButton", [
"sap/ui/core/Control",
"sap/ui/core/Icon",

], function(Control, Icon){
    "use strict";

    var BadgeButton = Icon.extend("u4a.m.BadgeButton", {
        metadata : {
            library : "u4a.m",
            properties : {
                badgeCount : { type: "int", defaultValue: null },
                badgeColor : { type : "sap.ui.core.CSSColor", defaultValue : "#d04343" },
                badgeFontSize : { type : "sap.ui.core.CSSSize", defaultValue : "10px" },
                badgeFontColor :  { type : "sap.ui.core.CSSColor", defaultValue : "#ffffff" },
            },

        }, // end of metadata

        renderer : function(oRm, oControl){

            sap.ui.core.IconRenderer.render(oRm, oControl);

        }, // end of renderer

        onAfterRendering : function(){

            // 버튼 기본 스타일
            this._setDefaultStyle();

            var iCount = this.getBadgeCount();

            // 뱃지 숫자가 없으면 뱃지를 그리지 않는다
            if(iCount == 0){
                return;
            }

            var iBadgeFontSize = this.getBadgeFontSize();
				iBadgeFontSize = iBadgeFontSize.toLowerCase();
				
			// 뱃지의 Font Size 단위는 px만 가능하다.			
            if(!jQuery.sap.endsWith(iBadgeFontSize, 'px')){
                throw new Error('[U4AIDE] property type error : (\"badgeFontSize\") --- \"px\" 단위만 입력하세요');
            }            

            // 아이콘의 Dom ID
            var sBadgeIconId = this.getId();

            var oBtn = document.getElementById(sBadgeIconId);
            if(oBtn == null){
                return;
            }

            // 아이콘의 뱃지 영역을 생성한다.
            var oBadge = document.createElement("span");
                oBadge.id = sBadgeIconId + "--badgeIcon";

                // 뱃지 아이콘의 숫자가 1000이 넘으면 숫자를 축약해서 보여준다.
                if(iCount >= 1000){
                    oBadge.innerHTML = '999+';
                }
                else {
                    oBadge.innerHTML = iCount;
                }
                
                var iCircleSize = (parseInt(iBadgeFontSize) + 5 ) + 'px';				
				var sBadgeColor = this.getBadgeColor(),
					sBadgeFontColor = this.getBadgeFontColor();
				
                // badge style
                oBadge.style.position = 'absolute';
                oBadge.style.boxSizing = 'border-box';
                oBadge.style.top = '0.125rem';
                oBadge.style.right = '-0.2rem';
                oBadge.style.padding = "0px 0.3125rem";
                oBadge.style.borderRadius = iCircleSize;
                oBadge.style.height = iCircleSize;
                oBadge.style.lineHeight = iCircleSize;
                oBadge.style.fontSize = iBadgeFontSize;
                oBadge.style.fontFamily = '"72","72full",Arial,Helvetica,sans-serif';
                oBadge.style.backgroundColor = sBadgeColor;
                oBadge.style.borderColor = sBadgeColor;
                oBadge.style.color = sBadgeFontColor;
                oBadge.style.textOverflow = 'ellipsis';
                oBadge.style.overflow = 'hidden';

                oBtn.appendChild(oBadge);

        }, // end of onAfterRendering

        setSize : function(sSize){
      
          if(sSize == null || sSize == ""){
            Icon.prototype.setSize.call(this, "30px")
            return;
          }
          
           Icon.prototype.setSize.apply(this, arguments);
           
        },

        _setDefaultStyle : function(){
			
			/*@ 2020-09-22 v1772 BugFix
             *  - v1772 버전에서 뱃지의 위치가 오동작 하는 현상 수정함.
             */
            var oBtnDom = this.getDomRef();
                oBtnDom.style.position = "relative";
			 
            // icon default Size
            var iconsize = this.getSize();
            if(iconsize == ""){
                this.setSize("30px");
            }

            // badge Default style
            var oBtn = document.getElementById(this.getId());
                oBtn.style.padding = '7px';
                oBtn.style.borderRadius = '0.2rem';
                oBtn.style.outline = 'none';
        }

    });

    return BadgeButton;

});