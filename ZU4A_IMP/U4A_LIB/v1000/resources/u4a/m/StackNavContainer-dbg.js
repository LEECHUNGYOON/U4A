//Copyright 2017. INFOCG Inc. all rights reserved. 

jQuery.sap.declare("u4a.m.StackNavContainer");
jQuery.sap.require("sap.ui.core.Control");

u4a.m.PositionType = { Left:"Left",Right:"Right" };
u4a.m.StackConNaviSize = { Small:"Small",Medium:"Medium",Large:"Large" };
u4a.m.DirectionType = { LTR:"LTR",RTL:"RTL" };

$("#u4a_css_area").append("<link rel='stylesheet' type='text/css' href='/zu4a_imp/u4a_lib/v1000/css/m/StackNavContainer.css'>");

sap.ui.core.Control.extend("u4a.m.StackNavContainer", {	//EXTENSION CONTROL NAME
	
    metadata : {
      library : "u4a.m", //U4A LIB PATH

		properties : {
		  naviPosition: { type: "u4a.m.PositionType", defaultValue : u4a.m.PositionType.Right },
		  naviColor : { type : "sap.ui.core.CSSColor", defaultValue : "#3f5161"},
		  naviSize : { type : "u4a.m.StackConNaviSize", defaultValue: u4a.m.StackConNaviSize.Small },
		  swipeRotate : { type : "boolean", group : "Behavior", defaultValue : true },
		  rotateDirection : { type : "u4a.m.DirectionType", defaultValue : u4a.m.DirectionType.RTL }
		},

		defaultAggregation : "pages",

		aggregations : {
		  "pages" : { type : "u4a.m.StackPage", multiple : true, singularName: "page" },
		}

    },  //end metadata


	init : function () {

	},

	renderer : function(rm, oControl) {

		this.oStackNaviCon = oControl;

		rm.write("<div");
		rm.writeControlData(oControl);  // ID 자동 채번
		rm.addClass("U4A_StackNaviCon");
		rm.writeClasses();
		rm.write(">");

		// page aggregation 그리는 영역
		for(var i in oControl.getPages()){

			var oPage = oControl.getPages()[i];
			var oLeftPage = oPage.getLeftPage();
			var oRightPage = oPage.getRightPage();

			var idx = parseInt(i) + 1;

			rm.write("<div");

			if(i == 0){
				rm.addClass("U4A_StackPage U4A_StackPage-" + idx + " U4A_StackPageActive");
			} 
			else {
				rm.addClass("U4A_StackPage U4A_StackPage-" + idx);
			}

			rm.writeClasses();
			rm.write(">");

			if(oLeftPage){
				rm.write("<div");
				rm.addClass("U4A_StackPageHalf U4A_StackPageLeft");
				rm.writeClasses();
				rm.write(">");

				rm.renderControl(oLeftPage);

				rm.write("</div>");
			}

			if(oRightPage){
				rm.write("<div");
				rm.addClass("U4A_StackPageHalf U4A_StackPageRight");
				rm.writeClasses();
				rm.write(">");
				rm.renderControl(oRightPage);
				rm.write("</div>");
			}

			rm.write("</div>");
		}
		//-------------------------

		rm.write("</div>");

		// 모바일 접속일 경우 Navigation 버튼을 없애고 화면 전환을 swipe 방식으로 만든다
		if((sap.ui.Device.os.name != sap.ui.Device.os.OS.IOS)
		  && (sap.ui.Device.os.name != sap.ui.Device.os.OS.ANDROID)){

			rm.write("<div");

			var leftSize = "1.5rem";
			var bottomSSize = "0rem";

			switch (oControl.getNaviPosition()){
				case u4a.m.PositionType.Left :
					rm.addStyle("left", leftSize);
					rm.addStyle("right", "auto");
					break;

				case u4a.m.PositionType.Right :
					rm.addStyle("left", "auto");
					break;

				default :
					rm.addStyle("bottom", bottomSSize);
					break;
			}

			rm.addClass("U4A_StackConNaviPanel");
			rm.writeClasses();
			rm.writeStyles();
			rm.write(">");

			rm.write("<div");
			rm.addClass("U4A_StackNavConScollBtn U4A_StackNavUp");

			switch(oControl.getNaviSize()){
				case u4a.m.StackConNaviSize.Small :
					rm.addClass("U4A_StackNavConSmallSize U4A_StackNavConArrowSmallSize");
					break;

				case u4a.m.StackConNaviSize.Medium :
					rm.addClass("U4A_StackNavConMediumSize U4A_StackNavConArrowMediumSize");
					break;

				case u4a.m.StackConNaviSize.Large :
					rm.addClass("U4A_StackNavConLargeSize U4A_StackNavConArrowLargeSize");
					break;

				default :
					break;
			}

			rm.writeClasses();

			if(oControl.getNaviColor()){
				rm.addStyle("border-color", oControl.getNaviColor());
				rm.writeStyles();
			}

			rm.write(">");
			rm.write("</div>");

			rm.write("<div");
			rm.addClass("U4A_StackNavConScollBtn U4A_StackNavDown");

			switch(oControl.getNaviSize()){
				case u4a.m.StackConNaviSize.Small :
					rm.addClass("U4A_StackNavConSmallSize U4A_StackNavConArrowSmallSize");
					break;

				case u4a.m.StackConNaviSize.Medium :
					rm.addClass("U4A_StackNavConMediumSize U4A_StackNavConArrowMediumSize");
					break;

				case u4a.m.StackConNaviSize.Large :
					rm.addClass("U4A_StackNavConLargeSize U4A_StackNavConArrowLargeSize");
					break;

				default :
					break;
			}

			rm.writeClasses();

			if(oControl.getNaviColor()){
				rm.addStyle("border-color", oControl.getNaviColor());
				rm.writeStyles();
			}

			rm.write(">");
			rm.write("</div>");

			rm.write("<nav>");
			rm.write("<ul>");

			// page aggregation 그리는 영역
			for(var i in oControl.getPages()){
				var oPage = oControl.getPages();
				var idx = parseInt(i) + 1;

				rm.write("<li");
				rm.writeAttribute("data-target", idx);

				if(i == 0){
					rm.addClass("U4A_StackConNaviBtn U4A_StackPageNav" + idx + " U4A_StackPageActive");
					rm.addStyle("background-color", oControl.getNaviColor());
				} 
				else {
					rm.addClass("U4A_StackConNaviBtn U4A_StackPageNav" + idx);
				}

				switch(oControl.getNaviSize()){
					case u4a.m.StackConNaviSize.Small :
						rm.addClass("U4A_StackNavConSmallSize U4A_StackNavConCircleSmallSize");
						break;

					case u4a.m.StackConNaviSize.Medium :
						rm.addClass("U4A_StackNavConMediumSize U4A_StackNavConCircleMediumSize");
						break;

					case u4a.m.StackConNaviSize.Large :
						rm.addClass("U4A_StackNavConLargeSize U4A_StackNavConCircleLargeSize");
						break;

					default :
						break;
				}

				rm.addStyle("border-color", oControl.getNaviColor());

				rm.writeStyles();
				rm.writeClasses();

				rm.write(">");
				rm.write("</li>");
			}

		  //-------------------------

		  rm.write("</ul>");
		  rm.write("</nav>");
		  rm.write("</div>");
		}

	},

	onBeforeRendering : function(){

	},

	onAfterRendering : function(oEvent){ 

		var oStackNaviCon = oEvent.srcControl;

		var oNavPanel = $(".U4A_StackConNaviPanel");

		try {
		  if(oNavPanel.length != 1){
			for(var i = oNavPanel.length; i > 1; i--){
			  oNavPanel[i-1].remove();
			}
		  }
		} catch(ex){}

		let pages = $(".U4A_StackPage").length;
		let scrolling = false;
		let curPage = 1;

		var oNavCon = $(this)[0];
		var sNavColor = oNavCon.getNaviColor();

		this.pagination = function(page, movingUp) {
	   
			scrolling = true;

			var diff = curPage - page,
				oldPage = curPage;
				curPage = page;

			$(".U4A_StackPage").removeClass("U4A_StackPageActive U4A_StackPageSmall U4A_StackPagePrev");
			$(".U4A_StackPage-" + page).addClass("U4A_StackPageActive");
			$(".U4A_StackConNaviBtn").removeClass("U4A_StackPageActive");
			$(".U4A_StackConNaviBtn").css("border-color", sNavColor);
			$(".U4A_StackConNaviBtn").css("background-color", "");
			$(".U4A_StackPageNav" + page).css("border-color", sNavColor);
			$(".U4A_StackPageNav" + page).css("background-color", sNavColor);
			$(".U4A_StackPageNav" + page).addClass("U4A_StackPageActive");

			if (page > 1) {
				$(".U4A_StackPage-" + (page - 1)).addClass("U4A_StackPagePrev");
				
				if (movingUp) {
					$(".U4A_StackPage-" + (page - 1)).hide();
					
						var hackPage = page;
						
						setTimeout(function() {
							$(".U4A_StackPage-" + (hackPage - 1)).show();
						}, 600);
				}
				
				while (--page) {
					$(".U4A_StackPage-" + page).addClass("U4A_StackPageSmall");
				}
			}

			if (diff > 1) {
				for (var j = page + 1; j < oldPage; j++) {
					$(".U4A_StackPage-" + j + " .U4A_StackPageHalf").css("transition", "transform .7s ease-out");
				}
			}

			setTimeout(function() {
				scrolling = false;
				$(".U4A_StackPage .U4A_StackPageHalf").attr("style", "");
				$(".U4A_StackPage")
			}, 700);
		};

		this.pagination.navigateUp = function() {

			try {
				if(oStackNaviCon.getSwipeRotate()){
					if(curPage == 1){
						oStackNaviCon.pagination(pages);
					}
					else {
						oStackNaviCon.pagination(curPage - 1);
					}
				}
				else {
					if (curPage > 1) {
						curPage--;
						oStackNaviCon.pagination(curPage, true);
					}
				}
			}
			catch(ex){}
		};

		this.pagination.navigateDown = function() {
		
			try {
				if(oStackNaviCon.getSwipeRotate()){
					if(curPage == pages){
						oStackNaviCon.pagination(1);
					}
					else {
						oStackNaviCon.pagination(curPage + 1);
					}
				} 
				else {
					if (curPage < pages) {
						curPage++;
						oStackNaviCon.pagination(curPage);
					}
				}
			}
			catch(ex){}
		};

		this.pagination.navigatePrev = function(){
			oStackNaviCon.pagination(1);
		};

		this.pagination.navigateEnd = function(){
			oStackNaviCon.pagination(pages);
		};

		$(".sapMPage").on("swiperight", function(event) {
			if (scrolling){
				return;
			}

			switch(oStackNaviCon.getRotateDirection()){
				case u4a.m.DirectionType.RTL :
					oStackNaviCon.pagination.navigateUp();
					break;

				case u4a.m.DirectionType.LTR :
					oStackNaviCon.pagination.navigateDown();
					break;

				default:
					break;
			}
		});

		$(".sapMPage").on("swipeleft", function(event) {
			if (scrolling){
				return;
			}
			switch(oStackNaviCon.getRotateDirection()){
				case u4a.m.DirectionType.RTL :
					oStackNaviCon.pagination.navigateDown();
					break;

				case u4a.m.DirectionType.LTR :
					oStackNaviCon.pagination.navigateUp();
					break;

				default:
					break;
			}
		});


		$(".U4A_StackNavConScollBtn").on("click",function(){
			  if (scrolling){return;}

		if ($(this).hasClass("U4A_StackNavUp")) {

		  oStackNaviCon.pagination.navigateUp();
		} else {

		  oStackNaviCon.pagination.navigateDown();
		}

		});

		$(document).on("keydown", function(e) {
		  
			if (scrolling){
				return;
			}
			
			switch(e.which){
				case 33 :   // page Up
					this.pagination.navigateUp();
					break;

				case 34 :   // page Down
					this.pagination.navigateDown();
					break;

				case 35 :     // end
					this.pagination.navigateEnd();
					break;

				case 36 :   // home
					this.pagination.navigatePrev();
					break;

				default:
					break;
			}
		}.bind(this));

		$(document).on("click", ".U4A_StackConNaviBtn:not(.U4A_StackPageActive)", function() {
			if (scrolling){
				return;
			}
			
			oStackNaviCon.pagination(+$(this).attr("data-target"));
		});
	}
});

