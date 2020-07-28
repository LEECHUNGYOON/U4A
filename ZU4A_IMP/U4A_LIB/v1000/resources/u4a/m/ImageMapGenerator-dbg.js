//Copyright 2017. INFOCG Inc. all rights reserved.

//u4a.m.ImageMarkShapeType = { Rect : "rect", Circle : "circle",  Poly : "poly" };
u4a.m.ImageMarkShapeType = { Rect : "rect", Poly : "poly" };

sap.ui.define("u4a.m.ImageMapGenerator", [
"sap/ui/core/Control",

], function(Control){
    "use strict";

    var ImageMapGenerator = Control.extend("u4a.m.ImageMapGenerator", {
        metadata : {
            library : "u4a.m",
            properties : {
                imgMapWidth : { type : "sap.ui.core.CSSSize", defaultValue : "100%"},
                imgMapHeight : { type : "sap.ui.core.CSSSize", defaultValue : "100%"},
                imgWidth : { type : "sap.ui.core.CSSSize", defaultValue : ""},
                imgHeight : { type : "sap.ui.core.CSSSize", defaultValue : ""},
                shape : { type: "u4a.m.ImageMarkShapeType", defaultValue: u4a.m.ImageMarkShapeType.Rect },
                maximumFileSize : { type : "float", defaultValue : 1 }
            },

            defaultAggregation : "contents",

            aggregations : {
                "_container" : { type : "sap.m.VBox", multiple : false, visibility : "hidden" }
            },

            events : {
                "coordDisplay" : {
                    allowPreventDefault: true
                }
            }

        }, // end of metadata

        init : function(){

            this._ImageMapInfo = {};

        },

        onBeforeRendering : function(){

            // image map 전체 영역
            var oVbox = new sap.m.VBox({
                width: "auto",
                height: "100%",
                renderType: "Bare"
            }).addStyleClass("u4aMImageMapGeneratorContainer");

            // image map toolbar 영역 생성
            this._createImageMapToolbar(oVbox);

            // image map 전체 영역을 aggregation에 저장
            this.setAggregation("_container", oVbox, true);

        }, // end of onBeforeRendering

        renderer : function(oRm, oControl){

            oRm.openStart("div", oControl);
            oRm.class("u4aMImageMapGenerator");
            oRm.style("width", oControl.getImgMapWidth());
            oRm.style("height", oControl.getImgMapHeight());
            oRm.style("display", "flex");
            oRm.style("flex-direction", "column");

            oRm.openEnd();

            // image map 전체영역을 그린다.
            var oCont = oControl.getAggregation("_container");
            if(oCont != null){
                sap.m.VBoxRenderer.render(oRm, oCont);
            }

            oRm.close("div");

        }, // end of renderer

        onAfterRendering : function(){

            // image map container 생성
            this._createImageMapContainer();

            var that = this,
                oImageMapInfo = this._ImageMapInfo,
                sMapId = oImageMapInfo.imageMapId,
                oMap = document.getElementById(sMapId);

            // image map 정보를 구성한다.
            if(!oMap.oMapInfo){

                oMap.oMapInfo = {};
                oMap.oMapInfo.fileLoaded = false;
                oMap.oMapInfo.mapntId = sMapId + "--image-mapper-point";
                oMap.oMapInfo.mapShapeId = sMapId + "--image-mapper-shape";
                oMap.oMapInfo.imageId = sMapId + "-img";
                oImageMapInfo.mapInfo = oMap.oMapInfo;

            }

            // image map generator js load
            if(typeof jQuery.u4aImgMapGenerator == "undefined"){
                jQuery.u4aJSloadAsync("/zu4a_imp/tools/imageMarkGenerator/jquery.u4a.imageMarkGenerator.js", function(){
                    jQuery.u4aJSloadAsync("/zu4a_imp/tools/imageMarkGenerator/imageMarkGeneratorBootStrap.js", function(){

                    });
                });
            }

            var sMapId = oImageMapInfo.imageMapId;

            // image map init
            $(document).trigger('ImageMapInit', {
                mapId : "#" + sMapId
            });

            // image area size setting
            this._setDefaultImageAreaSize();

            // no images
            var sImgAreaId = oMap.oMapInfo.imageId,
                oImgArea = document.getElementById(sImgAreaId);

                if(oImgArea == null){
                    return;
                }

                if(oImgArea.src == ""){
                    oImgArea.src = "/zu4a_imp/sample_img?obkey=NOIMGNOBACK";
                }

                oImgArea.onload = function(oEvent){
                    that._imageLoad(oEvent);
                };


        }, // end of onAfterRendering

        setImgMapWidth : function(sMapWidth){

            this.setProperty("imgMapWidth", sMapWidth, true);

            var oImgMap = document.getElementById(this.getId());
            if(oImgMap == null){
                return;
            }

            oImgMap.style.width = sMapWidth;

        },

        setImgMapHeight : function(sMapHeight){

            this.setProperty("imgMapHeight", sMapHeight, true);

            var oImgMap = document.getElementById(this.getId());
            if(oImgMap == null){
                return;
            }

            oImgMap.style.height = sMapHeight;

        },

        setImgWidth : function(sWidth){

            this.setProperty("imgWidth", sWidth, true);

            var oMapInfo = this._ImageMapInfo.mapInfo;

            if(oMapInfo == null){
                return;
            }

            var isFileLoad = oMapInfo.fileLoaded;

            if(!isFileLoad){
                return;
            }

            this._imageResize();

        },

        setImgHeight : function(sHeight){

            this.setProperty("imgHeight", sHeight, true);

            var oMapInfo = this._ImageMapInfo.mapInfo;

            if(oMapInfo == null){
                return;
            }

            var isFileLoad = oMapInfo.fileLoaded;

            if(!isFileLoad){
                return;
            }

            this._imageResize();

        },

        setShape : function(sType){

            this.setProperty("shape", sType, true);

            this._oCombo.setSelectedKey(sType);

            this._shapeTypeChange(sType);

        },

        setMaximumFileSize : function(sSize){
            this.setProperty("maximumFileSize", sSize, true);
        },

        _imageResize : function(){

            var oImageMapInfo = this._ImageMapInfo,
                oMapInfo = oImageMapInfo.mapInfo,
                sImgId = oMapInfo.imageId,
                sMapId = oImageMapInfo.imageMapId,

                sImageWidth = this.getImgWidth(),
                sImageHeight = this.getImgHeight();

            // 이미지 파일이 로드 되지 않았으면 리턴
            if(!oMapInfo.fileLoaded){
                return;
            }

            var oImgMap = document.getElementById(sMapId);
            if(oImgMap == null){
                return;
            }

            var oImg = document.getElementById(sImgId);
            if(oImg == null){
                return;
            }

            var sOrgImgWidth = oImg.naturalWidth + "px",
                sOrgImgHeight = oImg.naturalHeight + "px";

            if(sImageWidth == ""){
                oImgMap.style.width = sOrgImgWidth;
            }
            else {
                oImgMap.style.width = sImageWidth;
            }

            if(sImageHeight == ""){
               oImgMap.style.height = sOrgImgHeight
            }
            else {
                oImgMap.style.height = sImageHeight;
            }

        },

        _createImageMapToolbar : function(oVBox){

              if(!oVBox){
                  return;
              }

              var that = this,
                  oTool = new sap.m.Toolbar();

              // image file attach
              var oFileup = new sap.ui.unified.FileUploader({
                  buttonOnly : true,
                  buttonText : "찾아보기..",
                  fileType : ["jpg","jpeg","bmp","gif","png"],
                  maximumFileSize : this.getMaximumFileSize()
              }).addStyleClass("sapUiTinyMarginEnd");

              oFileup.oBrowse.setType(sap.m.ButtonType.Emphasized);

              // 첨부파일 이벤트 설정
              oFileup.attachEvent("typeMissmatch", function(oEvent){
                  that._typeMissmatch(oEvent);
              });

              oFileup.attachEvent("change", function(oEvent){
                  that._fileChange(oEvent);
              });

              oFileup.attachEvent("fileSizeExceed", function(oEvent){
                  that._fileSizeExceed(oEvent);
              });

            // Type Select
            var oCombo = new sap.m.ComboBox({ width : "100px", selectedKey: "rect" })
                         .addStyleClass("sapUiTinyMarginEnd");
                oCombo.addItem(new sap.ui.core.Item({ key : "rect", text : "Rect" }));
                oCombo.addItem(new sap.ui.core.Item({ key : "poly", text : "Poly" }));
                // oCombo.addItem(new sap.ui.core.Item({ key : "circle", text : "Circle" }));

                oCombo.attachEvent("selectionChange", function(oEvent){
                    that._comboSelectChange(oEvent);
                });

            this._oCombo = oCombo;

            // 현재 선택된 타입을 설정한다.
            this.setShape(oCombo.getSelectedKey());

            var oCodeBtn = new sap.m.Button({ text: "코드보기", type: sap.m.ButtonType.Ghost })
                          .addStyleClass("sapUiTinyMarginEnd"),     // Code 보기
                oClearBtn = new sap.m.Button({ text: "Clear", type: sap.m.ButtonType.Ghost })
                          .addStyleClass("sapUiTinyMarginEnd");    // clear 버튼

                oCodeBtn.attachEvent("press", function(oEvent){
                    that._coordsDisplay(oEvent);
                });

                oClearBtn.attachEvent("press", function(oEvent){
                    that._clearBtnPress(oEvent);
                });

              oTool.addContent(new sap.m.ToolbarSpacer());
              oTool.addContent(oFileup);
              oTool.addContent(oCombo);
              oTool.addContent(oCodeBtn);
              oTool.addContent(oClearBtn);

              oVBox.addItem(oTool);

              this._oTool = oTool;
              this._oFileup = oFileup;

              this._oCodeBtn = oCodeBtn;
              this._oClearBtn = oClearBtn;

        },

        _createImageMapContainer : function(){

              var oVBox = this.getAggregation("_container");
              if(!oVBox){
                  return;
              }

              var sThisId = this.getId(),
                  sVBoxId = oVBox.getId(),
                  oVboxDom = document.getElementById(sVBoxId);

              if(oVboxDom == null){
                  return;
              }

              var oWapper = document.createElement("div");
              oWapper.style.display = "flex";
              oWapper.style.flex = "1 1 auto";
              oWapper.style.minHeight = "1px";
              oWapper.classList.add("u4aMImageMapGeneratorWapper");

              oVboxDom.appendChild(oWapper);

              var oMapArea = document.createElement("div");
              oMapArea.id = sThisId + "-ImageMapArea";
              oMapArea.style.display = "flex";
              oMapArea.style.flex = "1 1 auto";
              oMapArea.style.padding = "1rem";

              oMapArea.style.boxSizing = "border-box";
              oMapArea.classList.add("u4aMImageMapArea");
              oMapArea.style.justifyContent = "center";
              oMapArea.style.alignItems = "center";
              oMapArea.style.overflow = "auto";

              oWapper.appendChild(oMapArea);

              var oMapCont = document.createElement("div");
              oMapCont.id = sThisId + "-ImageMapContent";
              oMapCont.style.boxSizing = "border-box";
              oMapCont.style.position = "relative";
              oMapCont.style.maxHeight = "100%";
              oMapCont.classList.add("u4aMImageMapContent");

              oMapArea.appendChild(oMapCont);

              var oImgMap = document.createElement("div");
              oImgMap.id = this.getId() + "-ImageMap";
              oImgMap.classList.add("u4aMImageMap");
              oImgMap.style.position = "relative";
              oImgMap.style.flex = "0 0 auto";
              oImgMap.style.overflow = "hidden";
              oImgMap.style.display = "inline-block";
              oImgMap.style.border = "2px solid rgb(221, 221, 221)";
              oImgMap.style.padding = "2px";
              oImgMap.style.borderRadius = "3px";

              oMapCont.appendChild(oImgMap);

              var oTool = this._oTool,
                  oToolDom = oTool.getDomRef();
                  oToolDom.style.flex = "0 0 auto";

              // image map 정보
              var oImageMapInfo = this._ImageMapInfo;
              oImageMapInfo.imageMapId = oImgMap.id;
              oImageMapInfo.imageMapAreaId = oMapArea.id;
              oImageMapInfo.imageMapContentId = oMapCont.id;

        },

        _typeMissmatch : function(oEvent){

            this._message("이미지파일을 선택해 주세요.");

        },

        _fileChange : function(oEvent){

            var aFiles = oEvent.getParameter("files"),
                iFileLen = aFiles.length;

            if(iFileLen == 0){
                return;
            }

            var oImageMapInfo = this._ImageMapInfo,
                sMapId = oImageMapInfo.imageMapId,

                oFile = aFiles[0],
                oFileReader = new FileReader,

                that = this;

            oFileReader.onloadend = function(oFileReader){

                 // 파일 로드 시 전체 초기화 수행
                 that._oClearBtn.firePress();

                 var e = that._btoa(oFileReader.target.result);
                 $("#" + sMapId).imageMapper("update", {
                     src: "data:" + oFile.type + ";base64," + e,
                     file: oFile.name
                 });

                 var oMapInfo = that._ImageMapInfo.mapInfo;
                     oMapInfo.fileLoaded = true;

            },
            oFile ? oFileReader.readAsArrayBuffer(oFile) :
            $("#" + sMapId).imageMapper("update", {
                src: "",
                file: ""
            });

        },

        _fileSizeExceed : function(oEvent){

            this._message("파일 크기가 초과되었습니다.");

        },

        _btoa : function(a){
            for (var b = "", c = new Uint8Array(a), d = c.byteLength, e = 0; d > e; e++)
                b += String.fromCharCode(c[e]);
            return window.btoa(b);
        },

        _clearBtnPress : function(oEvent){

             this.setShape("rect");

             this._oCombo.setSelectedKey("rect");

             var oImageMapInfo = this._ImageMapInfo,
                 sMapId = oImageMapInfo.imageMapId,
                 $Map = $("#" + sMapId);

            $Map.imageMapperRemove();

        },

        _coordsDisplay : function(oEvent){

            var oImageMapInfo = this._ImageMapInfo,
                 sMapId = oImageMapInfo.imageMapId,
                 $Map = $("#" + sMapId),
                 oCoordData = $Map.imageMapper("getData"),
                 iCoordAreaLenth = oCoordData.area[0].coords.length;

            if(iCoordAreaLenth == 0){ return; }

            var sCoords = this._getCoords(oCoordData);

            var oParam = {
                shapeType : this._oCombo.getSelectedKey(),
                coords : sCoords
            }

            this.fireCoordDisplay(oParam);

        },

        _comboSelectChange : function(oEvent){

            var sShapeType = oEvent.getSource().getSelectedKey();

            this._shapeTypeChange(sShapeType);

        },

        _shapeTypeChange : function(sShapeType){

            var oImageMapInfo = this._ImageMapInfo,
                sMapId = oImageMapInfo.imageMapId;

            if(sMapId == null){
                return;
            }

            var $Map = $("#" + sMapId),
                iMarkIdx = $Map.data("imageMapper");

            var oParam = {
                    markIdx : iMarkIdx,
                    shapeType : sShapeType
                };

            $Map.imageMapperRemove();
            $Map.imageMapperTypeChange(oParam);

            this.setProperty("shape", sShapeType, true);

        },

        _getCoords : function(oCoordInfo){

            var oArea = oCoordInfo.area[0],
                oCoords = oArea.coords,
                iCoordLength = oCoords.length,
                sShapeType = oArea.shape,
                aCoords = [];

            if(iCoordLength == 0){
                return;
            }

            jQuery.each(oCoords, function(a, b){
                aCoords.push(b.naturalX, b.naturalY);
            });

            if(sShapeType == "circle"){
                var h = Math.round(Math.sqrt(Math.pow(aCoords[2] - aCoords[0], 2) + Math.pow(aCoords[3] - aCoords[1], 2)));
                    aCoords = aCoords.slice(0, 2);
                    aCoords.push(h);
            }

            iCoordLength = aCoords.length;

            if(iCoordLength == 0){
               return;
            }

            var sCoord = "";
            for(var i = 0; i < iCoordLength; i++){

                 sCoord += aCoords[i] + ",";

            }

             return sCoord.slice(0,-1);

        },

        _message : function(sMsg){

            sap.m.MessageToast.show(sMsg, {
                 width: "30%",
                 my: "center center",
                 at: "center center",
             });

        },

        _setDefaultImageAreaSize : function(){

            var oImgCss = {
                "max-width" : "100%",
                "max-height" : "100%",
                "width" : "100%",
                "height" : "100%"
            },
            oMapSvgCss = {
                width : "100%",
                position: "absolute",
                top : "0",
                right: "0",
                bottom: "0",
                left: "0",
                height: "100%"
            },
            oMapInfo = this._ImageMapInfo.mapInfo,
            sMapClass = oMapInfo.mapCls,
            sSvgClass = oMapInfo.mapSvg,

            $map = $("." + sMapClass),
            $svg = $("." + sSvgClass);

            $map.css(oImgCss);
            $svg.css(oMapSvgCss);

        },

        _imageLoad : function(oEvent){

            var oImageMapInfo = this._ImageMapInfo,
                oMapInfo = oImageMapInfo.mapInfo;

            // 이미지가 로드 되었을 경우에만 실행
            if(!oMapInfo.fileLoaded){
                return;
            }

            var sMapAreaId = oImageMapInfo.imageMapAreaId,

                oImgArea = document.getElementById(sMapAreaId);

                oImgArea.style.justifyContent = "flex-start";
                oImgArea.style.alignItems = "";
                oImgArea.style.overflow = "auto";

            // image 사이즈 조정
            this._imageResize();

        },

        exit : function(){

          delete this._ImageMapInfo;
          delete this._oClearBtn;
          delete this._oCodeBtn;
          delete this._oCombo;
          delete this._oFileup;
          delete this._oTool;

        } // end of exit

    });

    return ImageMapGenerator;

});