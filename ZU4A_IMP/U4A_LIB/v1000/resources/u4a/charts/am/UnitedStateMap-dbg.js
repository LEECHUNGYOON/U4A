//Copyright 2017. INFOCG Inc. all rights reserved. 

$("#u4a_css_area").append("<link rel='stylesheet' type='text/css' href='/zu4a_imp/tools/ammap/v32114/ammap/ammap.css'>" );

if(typeof u4a.charts !== "object"){u4a.charts = {};}
if(typeof u4a.charts.am !== "object"){u4a.charts.am = {};}

sap.ui.define("u4a.charts.am.UnitedStateMap",[
"sap/ui/core/Control",

], function(Control){
	"use strict";
	
	var UnitedStateMap = Control.extend("u4a.charts.am.UnitedStateMap",{
		metadata : {
			library : "u4a.charts.am",
			properties : {
				"width" : {  type : "sap.ui.core.CSSSize", defaultValue : "100%" },
				"height" : {  type : "sap.ui.core.CSSSize", defaultValue : "100%" },
				"mapColor" : { type : "sap.ui.core.CSSColor", defaultValue : "#dfdfdf" },
				"rollOverOutlineColor" : { type : "sap.ui.core.CSSColor", defaultValue : "#000000" },
				"selectedColor" : { type : "sap.ui.core.CSSColor", defaultValue : "#ff0000" },
				"showSmallMap" : { type : "boolean", defaultValue : false }
			},

			defaultAggregation : "locations",

			aggregations : {
				"locations" : { type : "u4a.charts.am.MapLocation", multiple : true, singularName: "location" },
			},

			events : {
				"mapClick" : {},
				"goHome" : {}
			}
			
		},  //end metadata
		
		init : function () {

			try {
				var amMap = AmCharts.maps.usaLow;
			}
			catch(e){
				jQuery.ajax({
					'url': "/zu4a_imp/tools/ammap/v32114/ammap/ammap.js",
					'dataType': 'script',
					'cache': false,
					'async': false,
					'success': function(e){} || jQuery.noop,
					'error' : function(e){console.error('ammap load fail');}
				});

				jQuery.ajax({
					'url': "/zu4a_imp/tools/ammap/v32114/ammap/maps/js/usaLow.js",
					'dataType': 'script',
					'cache': false,
					'async': false,
					'success': function(e){} || jQuery.noop,
					'error' : function(e){console.error('ammap usaLow load fail');}
				});
				
			} // end of try catch

			if(typeof AmCharts.maps.usaLow === "undefined"){
				
				jQuery.ajax({
					'url': "/zu4a_imp/tools/ammap/v32114/ammap/ammap.js",
					'dataType': 'script',
					'cache': false,
					'async': false,
					'success': function(e){} || jQuery.noop,
					'error' : function(e){console.error('ammap load fail');}
				});
				
				jQuery.ajax({
					'url': "/zu4a_imp/tools/ammap/v32114/ammap/maps/js/usaLow.js",
					'dataType': 'script',
					'cache': false,
					'async': false,
					'success': function(e){} || jQuery.noop,
					'error' : function(e){console.error('ammap usaLow load fail');}
				});
			}

		}, // end of init
		
		renderer : function(rm, oControl) {
			
			rm.write("<div");
			rm.writeControlData(oControl);  // ID 자동 채번
			rm.addStyle("width", oControl.getWidth()); // Style sheet 추가
			rm.addStyle("height", oControl.getHeight());
			rm.writeStyles();
			rm.write(">");
			rm.write("</div>");
			
		}, // end of renderer

		onAfterRendering : function(oControl){
			
			var oMap = oControl.srcControl;

			function LF_MapIdConv(sLocNm){

				var oMapLoc = {
					Alaska:"US-AK",
					Alabama:"US-AL",
					Arkansas:"US-AR",
					Arizona:"US-AZ",
					California:"US-CA",
					Colorado:"US-CO",
					Connecticut:"US-CT",
					WashingtonDC:"US-DC",
					Delaware:"US-DE",
					Florida:"US-FL",
					Georgia:"US-GA",
					Hawaii:"US-HI",
					Iowa:"US-IA",
					Idaho:"US-ID",
					Illinois:"US-IL",
					Indiana:"US-IN",
					Kansas:"US-KS",
					Kentucky:"US-KY",
					Louisiana:"US-LA",
					Massachusetts:"US-MA",
					Maryland:"US-MD",
					Maine:"US-ME",
					Michigan:"US-MI",
					Minnesota:"US-MN",
					Missouri:"US-MO",
					Mississippi:"US-MS",
					Montana:"US-MT",
					NorthCarolina:"US-NC",
					NorthDakota:"US-ND",
					Nebraska:"US-NE",
					NewHampshire:"US-NH",
					NewJersey:"US-NJ",
					NewMexico:"US-NM",
					Nevada:"US-NV",
					NewYork:"US-NY",
					Ohio:"US-OH",
					Oklahoma:"US-OK",
					Oregon:"US-OR",
					Pennsylvania:"US-PA",
					RhodeIsland:"US-RI",
					SouthCarolina:"US-SC",
					SouthDakota:"US-SD",
					Tennessee:"US-TN",
					Texas:"US-TX",
					Utah:"US-UT",
					Virginia:"US-VA",
					Vermont:"US-VT",
					Washington:"US-WA",
					Wisconsin:"US-WI",
					WestVirginia:"US-WV",
					Wyoming:"US-WY"
				};

				var sLocId = oMapLoc[sLocNm];
				
				if(typeof sLocId == "undefined"){
					return false;
				}
					return sLocId;
					
			} // end of LF_MapIdConv

			function LF_MapRendering(){

				var usaDataProvider = {
					map: "usaLow",
					areas: [
					{
						id: "US-AL",
						color : oMap.getMapColor(),
					},
					{
						id: "US-AK",
						color : oMap.getMapColor(),
					},
					{
						id: "US-AZ",
						color : oMap.getMapColor(),
					},
					{
						id: "US-AR",
						color : oMap.getMapColor(),
					},
					{
						id: "US-CA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-CO",
						color : oMap.getMapColor(),
					},
					{
						id: "US-CT",
						color : oMap.getMapColor(),
					},
					{
						id: "US-DE",
						color : oMap.getMapColor(),
					},
					{
						id: "US-FL",
						color : oMap.getMapColor(),
					},
					{
						id: "US-GA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-HI",
						color : oMap.getMapColor(),
					},
					{
						id: "US-ID",
						color : oMap.getMapColor(),
					},
					{
						id: "US-IL",
						color : oMap.getMapColor(),
					},
					{
						id: "US-IN",
						color : oMap.getMapColor(),
					},
					{
						id: "US-IA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-KS",
						color : oMap.getMapColor(),
					},
					{
						id: "US-KY",
						color : oMap.getMapColor(),
					},
					{
						id: "US-LA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-ME",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MD",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MI",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MN",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MS",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MO",
						color : oMap.getMapColor(),
					},
					{
						id: "US-MT",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NE",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NV",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NH",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NJ",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NM",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NY",
						color : oMap.getMapColor(),
					},
					{
						id: "US-NC",
						color : oMap.getMapColor(),
					},
					{
						id: "US-ND",
						color : oMap.getMapColor(),
					},
					{
						id: "US-OH",
						color : oMap.getMapColor(),
					},
					{
						id: "US-OK",
						color : oMap.getMapColor(),
					},
					{
						id: "US-OR",
						color : oMap.getMapColor(),
					},
					{
						id: "US-PA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-RI",
						color : oMap.getMapColor(),
					},
					{
						id: "US-SC",
						color : oMap.getMapColor(),
					},
					{
						id: "US-SD",
						color : oMap.getMapColor(),
					},
					{
						id: "US-TN",
						color : oMap.getMapColor(),
					},
					{
						id: "US-TX",
						color : oMap.getMapColor(),
					},
					{
						id: "US-UT",
						color : oMap.getMapColor(),
					},
					{
						id: "US-VT",
						color : oMap.getMapColor(),
					},
					{
						id: "US-VA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-WA",
						color : oMap.getMapColor(),
					},
					{
						id: "US-WV",
						color : oMap.getMapColor(),
					},
					{
						id: "US-WI",
						color : oMap.getMapColor(),
					},
					{
						id: "US-WY",
						color : oMap.getMapColor(),
					}]
				};

				var aLoc = oMap.getLocations();
				var iLocLen = aLoc.length;
				var aAreas = usaDataProvider.areas;
				var iAreaLen = aAreas.length;

				for(var i = 0; i < iLocLen; i++){
					for(var j = 0; j < iAreaLen; j++){
						var oLoc = aLoc[i];
						var oArea = aAreas[j];
						var sLocId = oLoc.getLocationName();

						//Map Id Conversion
						var sResult = LF_MapIdConv(sLocId);
						if(sResult == false){
							continue;
						}

						sLocId = sResult;

						if(sLocId == oArea.id){

							var sName = oLoc.getLocationName();
							oArea.color = oLoc.getLocationColor();

							if(oLoc.getBalloonText() && oLoc.getLocationValue()){
								oArea.balloonText = oLoc.getBalloonText() + ":" + oLoc.getLocationValue();
							} else if(oLoc.getBalloonText()){
								oArea.balloonText = oLoc.getBalloonText();
							} else {
								oArea.balloonText = (oLoc.getLocationValue() ? "[[title]]" + ":" + oLoc.getLocationValue() : "[[title]]" )
							}

							break;
						}
					}
				} // end for


				var oAmChart = new AmCharts.AmMap();

				oAmChart.type = "map";
				oAmChart.fontSize = 100;
				oAmChart.areasSettings = {
					autoZoom: true,
					rollOverOutlineColor : oMap.getRollOverOutlineColor(),
					selectedColor : oMap.getSelectedColor(),
					color : oMap.getMapColor()
				};

				oAmChart.smallMap = {
					enabled : oMap.getShowSmallMap()    
				};

				oAmChart.balloon = {
					adjustBorderColor: true,
					color: "#000000",
					cornerRadius: 5,
					fillColor: "#FFFFFF",
					fontSize : "500px",
					showBullet : true
				};

				oAmChart.dataProvider = usaDataProvider;

				function handleGoHome() {
					oAmChart.dataProvider = usaDataProvider;
					oMap.fireGoHome();
					oAmChart.validateNow();
				}

				function handleMapObjectClick(oEvent) {
					if (oEvent.mapObject.id == "backButton") {
						handleGoHome();
					}
					else {
						//oMap.fireMapClick(oEvent.mapObject);
						// 2020-07-17 이벤트 발생 시 클릭한 Location 정보를 전달
						var oMapInfo = oEvent.mapObject,
							oMapBindingInfo = oMap.getBindingInfo("locations"),

							mParameter = {
								id : oMapInfo.id,
								title : oMapInfo.title
							};

						// 바인딩 정보가 있을 경우
						if(oMapBindingInfo){

							var aAggr = oMap.getAggregation("locations"),
								iAggrLen = aAggr.length;

							for(var i = 0; i < iAggrLen; i++ ){
								var oLoc = aAggr[i],
									sLocName = oLoc.getProperty("locationName");

								if(sLocName != oMapInfo.title){
									continue;
								}

								mParameter.binding = oLoc.getBindingContext();
								break;
							}

						}

						oMap.fireMapClick(mParameter);

					}
				}				

				// monitor when home icon was clicked and also go to continents map
				oAmChart.addListener("homeButtonClicked", handleGoHome);
				oAmChart.addListener("clickMapObject", handleMapObjectClick);

				// map write
				oAmChart.write(oMap.getId());				
				
				var _aCssClass = oMap.aCustomStyleClasses;
				if(_aCssClass == null){
					return;
				}
				
				var sCssClassNm = _aCssClass.join(" ");
				jQuery(oMap.getDomRef()).addClass(sCssClassNm);		

			} // End of LF_MapRendering

			LF_MapRendering();

		} // End of onAfterRendering
		
	});
	
	return UnitedStateMap;
	
});