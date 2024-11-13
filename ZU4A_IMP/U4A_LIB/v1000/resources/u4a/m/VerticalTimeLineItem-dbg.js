//Copyright 2017. INFOCG Inc. all rights reserved.
u4a.m.PositionType = { Left : "Left", Right : "Right" };

sap.ui.base.DataType.registerEnum("u4a.m.PositionType", u4a.m.PositionType);

sap.ui.define("u4a.m.VerticalTimeLineItem", [
'sap/ui/core/Control',
'sap/ui/core/IconPool'

], function(Control, IconPool){
  "use strict";

	var VerticalTimeLineItem = Control.extend("u4a.m.VerticalTimeLineItem", {

		metadata : {
			library : "u4a.m",

			properties : {
			  expandable: {type: "boolean", defaultValue: false},
			  expanded: {type: "boolean", defaultValue: false},
			  itemPosition : { type: "u4a.m.PositionType", defaultValue: u4a.m.PositionType.Left },
			  itemCenterBarYear: { type: "string", defaultValue: "" },
			  itemCenterBarMonth : { type: "string", defaultValue: "" },
			  itemHeaderIcon : {type : "sap.ui.core.URI", defaultValue : null},
			  itemHeaderDate : { type: "string", defaultValue: "" },
			  itemHeaderTime : { type: "string", defaultValue: "" },
			  itemHeaderTitle : { type: "string", defaultValue: "" }
			},

			defaultAggregation : "contents",

			aggregations : {
			  "contents" : { type : "sap.ui.core.Control", multiple : true, singularName: "content" },
			  "footer" : {type: "sap.m.IBar", multiple: false}
			},

			events : {
			  "itemPress" : {allowPreventDefault : true}
			}

		}, // end of metadata

		_styleClassName : "",
		_oIcon : null,

		renderer : function(oRm, oControl) {
			
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("U4A_VTLine_child U4A_VTLine_elem");

			// 타임라인 위치에 따른 Css적용.
			var sItemPosition = oControl.getItemPosition();
			if(sItemPosition == u4a.m.PositionType.Left){
			  oRm.addClass("U4A_VTLine_elem--left");
			}
			else{
			  oRm.addClass("U4A_VTLine_elem--right");
			}
			oRm.writeClasses();
			oRm.write(">");

			// 타임라인 바 영역의 텍스트
			oControl.renderBarText(oRm, oControl);

			oRm.write("<div");
			
			if(oControl._styleClassName != ""){
			  oRm.addClass(oControl._styleClassName);
			}
			oRm.addClass("U4A_VTLine_event U4A_VTLine_child");

			// 글로벌 변수 초기화
			oControl._clearGlobalVariables();

			oRm.writeClasses();
			oRm.write(">");

			// 타임라인 아이템의 컨텐츠 영역
			oControl.renderContent(oRm, oControl);

			// 타임라인 아이템의 footer 영역
			oControl.renderItemFooter(oRm, oControl);

			oRm.write("</div>"); // end of U4A_VTLine_event

			oRm.write("</div>"); // end of U4A_VTLine_elem

		}, // end of render

		renderBarText : function(oRm, oControl){
		
			// 타임라인 바 영역의 텍스트
			oRm.write("<div");
			oRm.addClass("U4A_VTLine_date");
			oRm.writeClasses();
			oRm.write(">");

			// 타임라인 바 영역의 Year
			oRm.write("<span");
			oRm.addClass("U4A_VTLine_date-day");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getItemCenterBarYear());
			oRm.write("</span>");

			// 타임라인 바 영역의 Month
			oRm.write("<span");
			oRm.addClass("U4A_VTLine_date-month");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(oControl.getItemCenterBarMonth());
			oRm.write("</span>");
			oRm.write("</div>"); // end of U4A_VTLine_date

		}, // end of renderBarText

		renderContent : function(oRm, oControl){
		
			// Item 상단의 header 영역
			oControl.renderItemHeader(oRm, oControl);

			oRm.write("<div");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-descr");

			oRm.writeClasses();
			oRm.write(">");

			// Item의 Content 영역
			oControl.renderItemContent(oRm, oControl.getContents());

			oRm.write("</div>");
			
		}, // end of renderContent

		renderItemHeader : function(oRm, oControl){

			oRm.write("<div");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-date-time");
			oRm.writeClasses();
			oRm.write(">");

			// 날짜 영역
			oRm.write("<div");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-date");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<span>");
			oRm.writeEscaped(oControl.getItemHeaderDate());
			oRm.write("</span>");
			oRm.write("</div>"); // end of U4A_VTLine_event-date

			// 시간 영역
			oRm.write("<div");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-time");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<span>");
			oRm.writeEscaped(oControl.getItemHeaderTime());
			oRm.write("</span>");
			oRm.write("</div>"); // end of U4A_VTLine_event-time

			oRm.write("</div>"); // end of U4A_VTLine_event-date-time

			// 타이틀 영역
			oRm.write("<h4");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-title");
			oRm.writeClasses();
			oRm.write(">");


			if(oControl.getExpandable()){
			  // 접었다 펼쳤다 기능
			  oControl._isExpanded(oRm, oControl);

			}

			if(oControl.getItemHeaderIcon()!= ""){
				// 아이콘영역
				oRm.writeIcon(oControl.getItemHeaderIcon());
			}
			oRm.writeEscaped(oControl.getItemHeaderTitle());
			oRm.write("</h4>"); // end of U4A_VTLine_event-title

		}, // end of renderItemHeader

		_isExpanded : function(oRm, oControl){

			var oIcon = new sap.ui.core.Icon();

			oControl._oIcon = oIcon;

			oRm.renderControl(oIcon);

		}, // end of _isExpanded

		renderItemContent : function(oRm, aContent){
			
			aContent.forEach(oRm.renderControl, oRm);
			
		}, // end of renderItemContent

		renderItemFooter : function(oRm, oControl){
		
			var oBarControl = oControl.getFooter();

			oRm.write("<div");
			oRm.addClass("U4A_VTLine_child U4A_VTLine_event-actions");
			oRm.writeClasses();
			oRm.write(">");

			oRm.renderControl(oBarControl);

			oRm.write("</div>");
			
		}, // end of renderItemFooter

		addStyleClass : function(sClass){
			this._styleClassName = sClass;
		},

		onclick : function(e){			

			// if(e.target.offsetParent.classList.contains("U4A_VTLine_child")
			//   && e.target.classList.contains("U4A_VTLine_child")){
			// 	//return;
			// }
			// else {
			//   return;
			// }

			// this.fireItemPress();

			let oTarget = e.target,
            oItem = $(oTarget).closest(".U4A_VTLine_event"),
            oIcon = $(oTarget).closest(".sapUiIcon");
			
			// 클릭한 영역이 Item의 바깥 영역일 경우는 press 이벤트를 발생시키지 않는다.
            if (!oItem.length) {
                return;
            }
			
            if (oIcon.length) {
                return;
            }

            this.fireItemPress();
			
		},

		onExit : function(e){
			this._clearGlobalVariables();
		},

		_clearGlobalVariables : function(){

			if(this._styleClassName != ""){
				this._styleClassName = "";
			}

			// if(this._oIcon != null){
			// 	this._oIcon = null;
			// }

			if (this._oIcon) {
                this._oIcon.destroy();
                delete this._oIcon;
            }

		},

		// Item 접었다 펼쳤다 기능
		_ItemExpandCollapse : function(bExpanded){
			var sCollapsedIconURI = IconPool.getIconURI("navigation-right-arrow"),
				sExpandedIconURI = IconPool.getIconURI("navigation-down-arrow");

			if(bExpanded){
				this.$ItemContent.slideDown(500);
				this.$ItemFooter.slideDown(500);
				this._oIcon.setSrc(sExpandedIconURI);
			}
			else {
				this.$ItemContent.slideUp(500);
				this.$ItemFooter.slideUp(500);
				this._oIcon.setSrc(sCollapsedIconURI);
			}

			this._oIcon.rerender();

		},

		onAfterRendering : function(oEvent){

			var oControl = oEvent.srcControl,
				bExpandable = oControl.getExpandable(),
				bExpanded = oControl.getExpanded();

				if(bExpandable){

					var $Item = $(this.getDomRef());

					this.$ItemContent = $Item.find(".U4A_VTLine_event-descr"),
					this.$ItemFooter = $Item.find(".U4A_VTLine_event-actions");

					// Item 접었다 펼쳤다 기능
					oControl._ItemExpandCollapse(bExpanded);
					
					// 아이콘 PRESS 이벤트
					oControl._oIcon.attachEvent("press", function(e){

						var bExpanded = this.getExpanded();

						// Item 접었다 펼쳤다 기능
						this._ItemExpandCollapse(!bExpanded);

						this.setProperty("expanded", !bExpanded, true);

					}.bind(this));

				}// end of if


			  // CSS 그리기 로컬 펑션
			function LF_CSS_Render(){

				var oVTLineDate = document.querySelectorAll('.U4A_VTLine_date'),
                	oVTLineElem = document.querySelectorAll('.U4A_VTLine_elem'),
                	oVTLineBar = document.querySelector('.U4A_VTLine_bar');

                if (oVTLineDate.length === 0) {
                    return;
                }
                
                if (oVTLineElem.length === 0) {
                    return;
                }
                
                if (!oVTLineBar) {
                    return;
                }              

				// var DOM = {
				// 	timelineDate: document.querySelectorAll('.U4A_VTLine_date'),
				// 	timelineElem: document.querySelectorAll('.U4A_VTLine_elem'),
				// 	timelineBar: document.querySelector('.U4A_VTLine_bar')
				// };

				var DOM = {
                    timelineDate: oVTLineDate,
                    timelineElem: oVTLineElem,
                    timelineBar: oVTLineBar
                };

				var __getDir = function(timelineElem){
					if (timelineElem.classList.contains('U4A_VTLine_elem--left')) {
						return 'left';
					}
					else if (timelineElem.classList.contains('U4A_VTLine_elem--right')) {
						return 'right';
					}
				};

				var setDirEvent = function() {
					$.each(DOM.timelineElem, function(i, elem){
						var direction = __getDir(elem);

						var timelineEvent = elem.querySelector('.U4A_VTLine_event');

						timelineEvent.classList.add('U4A_VTLine_event--' + direction);
					});
				};

				var __getBGImage = function() {

					var compStyle = getComputedStyle(DOM.timelineBar);

					return compStyle.backgroundImage;

				};

				var __getBGSize_height = function() {

					var timebarHeight = DOM.timelineBar.offsetHeight;

					return timebarHeight;

				};

				var __getBGPos_y = function(dateElem){

					var timelinebarBox = DOM.timelineBar.getBoundingClientRect();

					var dateBox = dateElem.getBoundingClientRect();

					var pos_y = dateBox.top - timelinebarBox.top;

					return pos_y;

				};

				var setDateBG = function() {

					var bgImg = __getBGImage();

					var bgHeight = __getBGSize_height();

					$.each(DOM.timelineDate, function(i, elem){

						//setting bgImage
						elem.style.backgroundImage = bgImg;

						//setting bgSize
						elem.style.backgroundSize = '100% ' + bgHeight + 'px';

						//setting bgPosition
						var dateOffset = __getBGPos_y(elem);

						elem.style.backgroundPosition = '0 -' + dateOffset + 'px';

					});

				};

				//setting direction class to the timeline event block
				setDirEvent();

				//set date background styles
				setDateBG();
				
			} // end of LF_CSS_Render


			var cssrender = setTimeout(function(){
				LF_CSS_Render();
				clearTimeout(cssrender);
			},10);

		} // end of onAfterRendering

	});

  return VerticalTimeLineItem;

});