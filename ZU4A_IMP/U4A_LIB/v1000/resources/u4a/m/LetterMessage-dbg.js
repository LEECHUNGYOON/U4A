//Copyright 2017. INFOCG Inc. all rights reserved.
sap.ui.define("u4a.m.LetterMessage",[
'jquery.sap.global',
'sap/ui/core/library',
'sap/ui/base/DataType'
], function(jQuery, coreLibrary, DataType){
    "use strict";

    // shortcut for sap.ui.core.Dock
    var Dock = coreLibrary.Dock;

    // float type
    var oFloatType = DataType.getType("float");

    // shortcut for sap.ui.core.CSSSize
    var CSSSize = coreLibrary.CSSSize;

    var LetterMessage = {};

    // Default Options
    LetterMessage._mSettings = {
        onClick: null,              // click Event
        animationDuration : 250,   	// Letter FadeIn Time
        position : "center center", // Letter Position
        expand : false,             // Letter Expand
        scale : 1                   // Letter Scale
    };

    LetterMessage._isShow = false;

    LetterMessage._validateSettings = function(mSettings){

        LetterMessage._isFiniteInteger(mSettings.animationDuration);

        LetterMessage._validateDockPosition(mSettings.position);

        LetterMessage._validateOnClick(mSettings.onClick);

        LetterMessage._validateBoolean(mSettings.expand);

        LetterMessage._isFiniteFloat(mSettings.scale);

    };

    LetterMessage._isFiniteInteger = function(iNumber){
        if (typeof iNumber !== "number" || !isFinite(iNumber) || !(Math.floor(iNumber) === iNumber) || iNumber <= 0) {
            throw new Error('[U4AIDE] "iNumber" should be a Integer on ' + LetterMessage + "._isFiniteInteger");
        }
    };

    LetterMessage._validateDockPosition = function(sDock){
        if (!Dock.isValid(sDock)) {
            throw new Error('[U4AIDE] "' + sDock + '"' + ' is not of type ' + '"sap.ui.core.Popup.Dock" on ' + LetterMessage + "._validateDockPosition");
        }
    };

    LetterMessage._validateOnClick = function(fn){
        if (typeof fn !== "function" && fn !== null) {
            throw new Error('[U4AIDE] "onClick" should be a function or null on ' + LetterMessage + "._validateOnClick");
        }
    };

    LetterMessage._validateBoolean = function(b){
        if (typeof b !== "boolean") {
          throw new Error('[U4AIDE] "expand" should be a boolean on ' + LetterMessage + "._validateBoolean");
        }
    };

    LetterMessage._isFiniteFloat = function(iFloat){
        var oFloatType = DataType.getType("float");
        var iParse = oFloatType.parseValue(iFloat);
        if(isNaN(iParse) || !oFloatType.isValid(iParse) || iParse <= 0){
            throw new Error('[U4AIDE] "scale" should be a float on ' + LetterMessage + "._isFiniteFloat");
        }
    };

    LetterMessage.show = function(mOptions){

        if(LetterMessage._isShow){
            return;
        }
        
        // Letter Style이 로드 되었는지 확인한다.
        var sLetterDivId = 'u4aMLetter_style',
         oLetterDiv = document.getElementById(sLetterDivId);
            
        if(oLetterDiv != null){
            LetterMessage._render(mOptions);
            return;
        }

        var sCssUrl = '/zu4a_imp/u4a_lib/v1000/css/m/LetterMessage.css';

        jQuery.ajax({
            url: sCssUrl,
            dataType: "text",
            mimeType : "text/css",
            success: function(cssData){

            	if(cssData == ""){
                    throw new Error('[U4AIDE] Load Fail to LetterMessage css files');
                }

                $("<style id='" + sLetterDivId + "'></style>").appendTo("head").html(cssData);
                LetterMessage._render(mOptions);
            },
            error : function(e){
                throw new Error('[U4AIDE] Load Fail to LetterMessage css files');
            }
        });

    }; // (function) end of show

    LetterMessage._render = function(mOptions){

         var oMsgDomRef,
             mSettings;

        // default option을 복사한다.
        mSettings = jQuery.extend({}, LetterMessage._mSettings);

        // default option과 전달받은 option 정보를 취합한다.
        // merge mOptions into mSettings
        jQuery.extend(mSettings, mOptions);

         // option 정보에 대한 입력값 체크를 한다.
        this._validateSettings(mSettings);

        oMsgDomRef = this._getLetterMsgDomRef();

        // 레터메시지 DOM이 없으면 동적으로 생성한다.
        if(oMsgDomRef == null){
            oMsgDomRef = createHTMLMarkup(mSettings);
        }

        this.mSettings = mSettings;

        // 레터 메시지 DOM에 click 이벤트를 연결한다.
        oMsgDomRef.onclick = function(){

            LetterMessage.hide(mSettings.onClick);

        }

        LetterMessage._isShow = true;

        // Expand option이 true이면 편지가 펼침 상태로 화면에 보여준다.
        LetterMessage._isExpand(mSettings.expand);

        $(oMsgDomRef).fadeIn(mSettings.animationDuration);

    };

    LetterMessage._isExpand = function(isExpand){

        if(!isExpand){
            return;
        }

        var oAnimate_CSS = {
            "-webkit-transform" : "translateY(50px)",
            "transform" : "translateY(50px)",
            "-moz-transform" : "translateY(50px)",
            "-ms-transform" : "translateY(50px)"
        };

        var $Lett_Animated = $(".u4aMLetterMsgAnimated"),
            $Letter = $(".u4aMLetter"),
            $Letter_shadow = $(".u4aMLetterShadow"),
            $Letter_Top_Fold = $(".u4aMLetterTopFold");

            $Lett_Animated.css(oAnimate_CSS);
            $Letter.css("height", "180px");

            $Letter_shadow.css("width", "200px");
            $Letter_shadow.css("left", "0px");

        var oFoldCss = {
            "transition" : "transform .4s, z-index .2s",
            "transform": "rotateX(180deg)",
            "-ms-transition": "transform .4s, z-index .2s",
            "-webkit-transition": "transform .4s, z-index .2s",
            "-ms-transform": "rotateX(180deg)",
            "-webkit-transform": "rotateX(180deg)",
            "-moz-transition": "transform .4s, z-index .2s",
            "-moz-transform": "rotateX(180deg)",
            "z-index": "0"
        }

        $Letter_Top_Fold.css(oFoldCss);

    }; // (function) end of _isExpand

    LetterMessage.hide = function(fnClick){

        var oMsgDom = this._getLetterMsgDomRef();

        // Letter Dom이 없으면 리턴
        if(oMsgDom == null){
            return;
        }

        var iDuration = this.mSettings.animationDuration;

        // Letter를 숨긴다.
        $(oMsgDom).fadeOut(iDuration, function(){
            if(oMsgDom == null){
                return;
            }

            $(oMsgDom).remove();

            if(LetterMessage._isShow){
                LetterMessage._isShow = false;

                if(fnClick){
                    fnClick();
                }
            }
        });

    }; // (function) end of hide

    LetterMessage._getLetterMsgDomRef = function(){
        return document.getElementById("__LetterArea");
    }; // (function) end of _getLetterMsgDomRef

    function createHTMLMarkup(mSettings){

        var oLetter = LetterMessage._getLetterMsgDomRef();
        if(oLetter != null){
            return oLetter;
        }

        var oMsgArea = document.createElement("div");
            oMsgArea.id = "__LetterArea";
            oMsgArea.className = "u4aMLetterMsgArea";
            oMsgArea.style.zIndex = '10000';

        var oMsgDomRoot = document.createElement("div");
            oMsgDomRoot.id = "__Letter";
            oMsgDomRoot.className = "u4aMLetterMsg";
            oMsgDomRoot.style.display = "none";
            oMsgDomRoot.style.width = "200px";
            oMsgDomRoot.style.height = "200px";

            // 레터 메시지의 위치를 설정한다.
            LetterMessage._setPosition(oMsgDomRoot, mSettings);

        var oMsgDomLv1 = document.createElement("div");
            oMsgDomLv1.className = "u4aMLetterMsgAnimated";

            oMsgDomRoot.appendChild(oMsgDomLv1);

        var oMsgDomLv1_1 = document.createElement("div");
            oMsgDomLv1_1.className = "u4aMLetterShadow";

            oMsgDomRoot.appendChild(oMsgDomLv1_1);

        var oMsgDomLv2_1 = document.createElement("div");
            oMsgDomLv2_1.className = "u4aMLetterMsgBackFold";

        var oMsgDomLv2_2 = document.createElement("div");
            oMsgDomLv2_2.className = "u4aMLetter";

        var oMsgDomLv2_3 = document.createElement("div");
            oMsgDomLv2_3.className = "u4aMLetterTopFold";

        var oMsgDomLv2_4 = document.createElement("div");
            oMsgDomLv2_4.className = "u4aMLetterBody";

        var oMsgDomLv2_5 = document.createElement("div");
            oMsgDomLv2_5.className = "u4aMLetterLeftFold";

            oMsgDomLv1.appendChild(oMsgDomLv2_1);
            oMsgDomLv1.appendChild(oMsgDomLv2_2);
            oMsgDomLv1.appendChild(oMsgDomLv2_3);
            oMsgDomLv1.appendChild(oMsgDomLv2_4);
            oMsgDomLv1.appendChild(oMsgDomLv2_5);

        var oMsgDomLv3_1 = document.createElement("div");
            oMsgDomLv3_1.className = "u4aMLetterBorder";

        var oMsgDomLv3_2 = document.createElement("div");
            oMsgDomLv3_2.className = "u4aMLetterTitle";

        var oMsgDomLv3_3 = document.createElement("div");
            oMsgDomLv3_3.className = "u4aMLetterContext";

        var oMsgDomLv3_4 = document.createElement("div");
            oMsgDomLv3_4.className = "u4aMLetterStamp";

        var oMsgDomLv4 = document.createElement("div");
            oMsgDomLv4.className = "u4aMLetterStampInner";

            oMsgDomLv3_4.appendChild(oMsgDomLv4);

            oMsgDomLv2_2.appendChild(oMsgDomLv3_1);
            oMsgDomLv2_2.appendChild(oMsgDomLv3_2);
            oMsgDomLv2_2.appendChild(oMsgDomLv3_3);
            oMsgDomLv2_2.appendChild(oMsgDomLv3_4);

            oMsgArea.appendChild(oMsgDomRoot);

            document.body.appendChild(oMsgArea);

            return oMsgDomRoot;

    }; // (function) end of createHTMLMarkup

    LetterMessage._setPosition = function(oMsgDom, mSetting){
    	var oPos = mSetting.position,
          	aPos = oPos.split(" "),
          	xPos = aPos[0],
          	yPos = aPos[1],

			sScale = mSetting.scale,
			iDomWidth = parseInt(oMsgDom.style.width),
			iHalfWidth_P = iDomWidth / 2,
			iHalfWidth_M = iHalfWidth_P * -1;

      	oMsgDom.setAttribute('u4a-data-position', xPos + '-' + yPos);

		var xScale,
  			yScale;

		switch(xPos){

			case "begin" :
			case "left" :
				xScale = sScale * iHalfWidth_P;
				break;

			case "center" :
			  	oMsgDom.style.left = "50%";
			  	xScale = sScale * iHalfWidth_M;
			  	break;

			case "right":
			case "end" :
			  	oMsgDom.style.left = "auto";
			  	oMsgDom.style.right = (sScale * iHalfWidth_P) + "px";
			  	xScale = iDomWidth - ((sScale * iHalfWidth_P) * 2);
			  	break;

		}

		switch(yPos){
		  	case "top":
	      		oMsgDom.style.top = "100px";
		      	yScale = iHalfWidth_M;
		      	break;

		  	case "center" :
		    	oMsgDom.style.top = "50%";
		    	yScale = sScale * iHalfWidth_M;
		    	break;

		  	case "bottom" :
		  		oMsgDom.style.bottom = ((((iHalfWidth_P + 40) * sScale) + iHalfWidth_P) - iDomWidth) + "px";
		  		yScale = ((iHalfWidth_M * -1) - (sScale * iHalfWidth_P));

			  	if(xPos == "center"){
			      	oMsgDom.style.transform = "translate(-50%)";
			  	}

		    	break;
		}

      	oMsgDom.style.transform = "matrix(" + sScale + ", 0, 0," + sScale + ", " + xScale + ", " + yScale + ")";
      	oMsgDom.style.webkitTransform = "matrix(" + sScale + ", 0, 0," + sScale + ", " + xScale + ", " + yScale + ")";
      	oMsgDom.style.transformOrigin = "0 0";
    };

    LetterMessage.toString = function() {
        return "u4a.m.LetterMessage";
    };

    return LetterMessage;

}, true);