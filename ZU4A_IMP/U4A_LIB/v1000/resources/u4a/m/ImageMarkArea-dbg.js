//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.ImageMarkArea", [
"sap/m/Image"

], function(Image){
    "use strict";

    var ImageMarkArea = Image.extend("u4a.m.ImageMarkArea", {
		metadata : {
				library : "u4a.m",

				defaultAggregation : "marks",

				aggregations : {
				   "marks" : { type : "u4a.m.ImageMark", multiple : true, singularName: "mark" },
				}

		}, // end of metadata

		init : function () {

			var maphilight = $.fn.maphilight;

			if(typeof maphilight === "undefined" ){
				jQuery.ajax({
					'url': "/zu4a_imp/publish/CommonJS/jquery.u4a.maphilights.js",
					'dataType': 'script',
					'cache': false,
					'async': false,
					'success': function(e){ console.log("maphilight load"); return;} || jQuery.noop,
					'error' : function(e){
						console.error('maphilight load fail');
					}
				});
			}

        }, // end init

        renderer : function(oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.write(">");

            sap.m.ImageRenderer.render(oRm, oControl);

            var oArea = oControl,
                sUseMap = oArea.getUseMap(),
                aMarks = oArea.getMarks();

            oArea.setDensityAware(false);

            if(sUseMap){
				var iMarksLength = aMarks.length;
				if(iMarksLength != 0){

					oRm.write("<map");

					var sUseMapName = sUseMap;

					// UseMap 이름 앞에 '#' 존재 여부에 따라 이름 재설정
					if(sUseMapName.slice(0,1) == "#"){
						sUseMapName = sUseMapName.slice(1);
					}

					oRm.writeAttribute("name", sUseMapName);
					oRm.writeAttribute("id", sUseMapName);
					oRm.write(">");

					var aMarks = oArea.getMarks(),
					  iMarkLen = aMarks.length;

					// Mark Area를 그린다.
					for(var i = 0; i < iMarkLen; i++){
					  oArea._renderMarks(oRm, aMarks[i]);
					}

					oRm.write("</map>");
				}
            }

            oRm.write("</div>");

        },// end of renderer

        _renderMarks : function(oRm, oMark){

             //- Area start
            oRm.write("<area");
            oRm.writeElementData(oMark);
            oRm.writeAttribute("shape", oMark.getShape());
            oRm.writeAttribute("coords", oMark.getCoords());

            var sMarkTooltip = oMark.getTooltip();
            var sMarkText = oMark.getText();

            var sTitle = sMarkTooltip;
            if(sMarkText != ""){

				if(sTitle == null){
					sTitle = "";
				}

				sTitle = sTitle + " : " + sMarkText;

            }

            oRm.writeAttribute("data-text", oMark.getText());
            oRm.writeAttribute("title", (sTitle == null ? "" : sTitle));

            //- Area Highlight Attribute
            var sStrokeColor = oMark.getStrokeColor();
				sStrokeColor = (sStrokeColor.slice(0,1) == "#" ? sStrokeColor.slice(1) : sStrokeColor);

            var sFillColor = oMark.getFillColor();
				sFillColor = (sFillColor.slice(0,1) == "#" ? sFillColor.slice(1) : sFillColor);

            var bFill = oMark.getFill();
            var fFillOpacity = oMark.getFillOpacity();
            var bAlwaysOn = oMark.getAlwaysOn();
            var bStroke = oMark.getStroke();
            var fStrokeOpacity = oMark.getStrokeOpacity();
            var iStrokeWidth = oMark.getStrokeWidth();
            var bShadow = oMark.getShadow();
            var iShadowX = oMark.getShadowX();
            var iShadowY = oMark.getShadowY();
            var iShadowRadius = oMark.getShadowRadius();
            var sShadowColor = oMark.getShadowColor();
				sShadowColor = (sShadowColor.slice(0,1) == "#" ? sShadowColor.slice(1) : sShadowColor);
            var fShadowOpacity = oMark.getShadowOpacity();

            var sHighlight = '{"strokeColor":"' + sStrokeColor + '",' +
							'"alwaysOn":' + bAlwaysOn + ',' +
							'"fill":' + bFill + ',' +
							'"fillColor":"' + sFillColor + '",' +
							'"fillOpacity":' + fFillOpacity + ',' +
							'"stroke":' + bStroke + ',' +
							'"strokeOpacity":' + fStrokeOpacity + ',' +
							'"strokeWidth":' + iStrokeWidth + ',' +
							'"shadow":' + bShadow + ',' +
							'"shadowX":' + iShadowX + ',' +
							'"shadowY":' + iShadowY + ',' +
							'"shadowRadius":' + iShadowRadius + ',' +
							'"shadowColor":"' + sShadowColor + '",' +
							'"shadowOpacity":' + fShadowOpacity +
							'}';

            oRm.writeAttributeEscaped("data-maphilight", sHighlight);
            oRm.write(">");
            oRm.write("</area>");

        },

        setSrc : function(sSrc){

            if (sSrc === this.getSrc()) {
              return this;
            }

            this.setProperty("src", sSrc);

            return this;

        }, // end of setSrc

        onAfterRendering : function(oEvent){

            var oImgMarkArea = oEvent.srcControl;

             // Image 태그에 Unique ID 부여하기
            this._setImageMarkId(oImgMarkArea);

            // 이미지 동적 효과 적용
            this._applyImageDymanicEffect();

            // 이미지 Resize
            this._ImageMarkAreaResize();
			
			// ImageMark를 감싼 DIV에 이벤트를 설정한다.
			this._attachMarkImageEvent();

            // Image Mark에 클릭 이벤트를 설정한다.
            this._attachMarkEvent();

			$(window).resize(function(){
				this._ImageMarkAreaResize();
			}.bind(this));

        }, // end of onAfterRendering
		
		_attachMarkImageEvent : function(){
			
			var oImgMark = this,
				oImageMarkDom = document.getElementById(this.getId());
			
			if(oImageMarkDom == null){
				return;
			}
			
			oImageMarkDom.onclick = function(){
				oImgMark.firePress(oImgMark.mProperties);
			}		
			
		},
        
        _attachMarkEvent : function(){

			var aMarks = this.getMarks(),
				iMark_len = aMarks.length;

			if(iMark_len != 0){

				for(var i = 0; i < iMark_len; i++){

					var oMark = aMarks[i];

					var markObj = document.getElementById(oMark.getId());

					if(markObj == null){ return; }

                    markObj.onclick = function(){
						
						var _mark = sap.ui.getCore().byId(this.id);
							_mark.fireSelectMark();
						
                    }; // end of onclick

				} // end for

			} // end if

		}, // end of _attachMarkEvent

		_setImageMarkId : function(oMarkArea){

            var oImgArea = $('#' + oMarkArea.getId());
            var oImg = oImgArea[0].childNodes[0];
                oImg.setAttribute("id", oMarkArea.getId() + "--ImageMark");
                oImg.setAttribute("data-sap-ui", oMarkArea.getId() + "--ImageMark");

                this._domId = oImg.id;

        }, // end of _setImageMarkId

        _applyImageDymanicEffect : function(){

            var oImg = document.getElementById(this._domId),
                sBrowserName = sap.ui.Device.browser.name,
                oImgWidth = this.getWidth(),
                oImgHeight = this.getHeight();

             // width가 없을 경우에만 수행
            if(oImgWidth == ""){

                // IE 브라우저일 때만 width 속성 적용이 다르다.
                if(sBrowserName == "ie"){
                    var oPar = this.getParent();

                    // 이미지의 Parent가 FlexBox 일 경우 예외로직..
                    if(oPar instanceof sap.m.FlexBox){
                        this.setWidth("100%");
                    }
                    else {
                        oImg.style.maxWidth = "100%";
                    }
                }
                else {
                    oImg.style.maxWidth = "100%";
                }
            }

             // width가 없을 경우에만 수행
            if(oImgHeight == ""){

                // IE 브라우저일 때만 width 속성 적용이 다르다.
                if(sBrowserName == "ie"){
                    var oPar = this.getParent();

                    // 이미지의 Parent가 FlexBox 일 경우 예외로직..
                    if(oPar instanceof sap.m.FlexBox){
                        this.setHeight("100%");
                    }
                    else {
                        oImg.style.maxHeight = "100%";
                    }
                }
                else {
                    oImg.style.maxHeight = "100%";
                }
            }

        }, // end of _applyImageDymanicEffect

        _ImageMarkAreaResize : function(){

            // 이미지가 로드 되면 실행
            var oImgDom = document.getElementById(this._domId);

            $(oImgDom).on('load', function(){
                this._ImageMarkAreaLoadComplete();
            }.bind(this)).attr("src", $(oImgDom).attr("src"));

        }, // end of _ImageMarkAreaResize

        _ImageMarkAreaLoadComplete : function(){

            var oImgDom = document.getElementById(this._domId),
                $Img = $(oImgDom);

            // 이미지 사이즈를 구한다.
            var oImgSize = this._getImageMarkAreaSize();

            if(oImgSize == false){
                return;
            }

            $Img.rwdImageMaps($Img, oImgSize.width, oImgSize.height);

		}, // end of _ImageMarkAreaLoadComplete

        _getImageMarkAreaSize : function(){

			// 이미지가 없으면 리턴.
			if(this.getSrc() == ""){
				return false;
			}

			var sWidth = this.getWidth(),     // 이미지 width 프로퍼티 값
				sHeight = this.getHeight(),   // 이미지 height 프로퍼티 값
				bIsWidthPer = false,          // 이미지 width 퍼센트값 여부,
				bIsHeightPer = false,         // 이미지 height 퍼센트값 여부,
				oDumImgSize = this._getDummyImageSize();   // body에 붙여서 측정한 이미지 사이즈값

			var oImgSize = {};
				oImgSize.width = oDumImgSize.width;
				oImgSize.height = oDumImgSize.height;

			return oImgSize;

		}, // end of _getImageMarkAreaSize

		_getDummyImageSize : function(){

			var oBodyDom = $(".sapUiBody")[0],
		
			oImgDom = document.getElementById(this._domId),
			oImgDomClone = oImgDom.cloneNode();

			oImgDomClone.style.visibility = "hidden";
			oImgDomClone.style.width = this.getWidth();
			oImgDomClone.style.height = this.getHeight();

			oBodyDom.appendChild(oImgDomClone);

			var oImgWidth = $(oImgDomClone).css('width'),
				oImgHeight = $(oImgDomClone).css('height');
			
			var oImgMarkDom = document.getElementById(this.getId());
			
				// 이미지 자신의 style에 width, height를 부여한다.
				oImgMarkDom.style.width = oImgDom.style.width = oImgWidth;
				oImgMarkDom.style.height = oImgDom.style.height = oImgHeight;

				$(oImgDomClone).remove();

			return { width : oImgWidth, height : oImgHeight };

		} // end of _getDummyImageSize

    });

    return ImageMarkArea;

});

