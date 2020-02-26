//Copyright 2017. INFOCG Inc. all rights reserved.

jQuery.sap.declare("u4a.charts.am.MapLocation");
jQuery.sap.require("sap.ui.core.Element");

if(typeof u4a.charts !== "object"){u4a.charts = {};}
if(typeof u4a.charts.am !== "object"){u4a.charts.am = {};}

u4a.charts.am.MapLocationName = {
	Alaska:"Alaska",
	Alabama:"Alabama",
	Arkansas:"Arkansas",
	Arizona:"Arizona",
	California:"California",
	Colorado:"Colorado",
	Connecticut:"Connecticut",
	WashingtonDC:"WashingtonDC",
	Delaware:"Delaware",
	Florida:"Florida",
	Georgia:"Georgia",
	Hawaii:"Hawaii",
	Iowa:"Iowa",
	Idaho:"Idaho",
	Illinois:"Illinois",
	Indiana:"Indiana",
	Kansas:"Kansas",
	Kentucky:"Kentucky",
	Louisiana:"Louisiana",
	Massachusetts:"Massachusetts",
	Maryland:"Maryland",
	Maine:"Maine",
	Michigan:"Michigan",
	Minnesota:"Minnesota",
	Missouri:"Missouri",
	Mississippi:"Mississippi",
	Montana:"Montana",
	NorthCarolina:"NorthCarolina",
	NorthDakota:"NorthDakota",
	Nebraska:"Nebraska",
	NewHampshire:"NewHampshire",
	NewJersey:"NewJersey",
	NewMexico:"NewMexico",
	Nevada:"Nevada",
	NewYork:"NewYork",
	Ohio:"Ohio",
	Oklahoma:"Oklahoma",
	Oregon:"Oregon",
	Pennsylvania:"Pennsylvania",
	RhodeIsland:"RhodeIsland",
	SouthCarolina:"SouthCarolina",
	SouthDakota:"SouthDakota",
	Tennessee:"Tennessee",
	Texas:"Texas",
	Utah:"Utah",
	Virginia:"Virginia",
	Vermont:"Vermont",
	Washington:"Washington",
	Wisconsin:"Wisconsin",
	WestVirginia:"WestVirginia",
	Wyoming:"Wyoming"
};


sap.ui.core.Element.extend("u4a.charts.am.MapLocation", {
    metadata : {
      library : "u4a.charts.am",
        properties : {
         "locationName" : { type : "u4a.charts.am.MapLocationName", defaultValue : null },
         "balloonText" : { type : "string", defaultValue : null },
         "locationColor" : { type : "sap.ui.core.CSSColor", defaultValue : "#dfdfdf" },
         "locationValue" : { type : "string", defaultValue : null }
       }
    }
});

