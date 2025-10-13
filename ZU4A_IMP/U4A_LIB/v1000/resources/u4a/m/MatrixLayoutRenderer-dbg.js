/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
],	function() {
	"use strict";

	/**
	 * MatrixLayout renderer.
	 * @namespace
	 */
	var MatrixLayoutRenderer = {apiVersion: 2};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {u4a.m.GridLayout} 
	 */
	MatrixLayoutRenderer.render = function(oRm, oControl) {

		oRm.openStart("div", oControl);

		if(Array.isArray(oControl?.aCustomStyleClasses)){
			oRm.class(oControl.aCustomStyleClasses.join(" "));
		}

		//Matrix layout의 width 설정.
		oRm.style("width", oControl.getWidth());


		//Matrix layout의 height 설정.
		oRm.style("height", oControl.getHeight());
		
		//GridLayout div 종료.
		oRm.openEnd();

		
		//gridLayout의 내부 DOM 구성.
		//(내부에서 그려질 UI의 margin으로 인해 스크롤 발생을 처리하기 위한 목적)
		oRm.openStart("div", `${oControl.getId()}-content`);


		//내부 DOM의 u4a matrix layout flag 처리.
		oRm.attr("u4a-matrix-layout", true);


		//content 내부에서 그려질 UI의 margin으로 인해 스크롤이 발생하는 부분을
		//처리 하기 위한 내부 padding.
		oRm.style("padding", "0.5rem");

		

		//MatrixLayout 영역의 UI를 grid로 표현.
		oRm.style("display", "grid");

		// //MatrixLayout 영역의 UI를 수직 정렬 처리.
		// oRm.style("align-items", "center");


		//GridLayout의 height 간격을 균등 분배하여 child UI를 배치 하지 않는경우,
		//height 간격을 균등 분배 하지 않도록 css 처리.
		if(oControl.getStretchedVertically() !== true){
			oRm.style("grid-auto-rows", "min-content");
		}

		
		oRm.style("overflow", "auto");


		oRm.openEnd();

		//content 정보의 하위 UI를 탐색하며 그리기.
		MatrixLayoutRenderer.renderContent(oRm, oControl);


		oRm.close("div");

		oRm.close("div");

	},
	
	

	/*************************************************************
    * @function - content 정보의 하위 UI를 탐색하며 그리기.
    *************************************************************/
	MatrixLayoutRenderer.renderContent = function(oRm, oControl){
		
		var _aContent = oControl.getContent();

		if(_aContent.length === 0){
			return;
		}


		for (let i = 0, l = _aContent.length; i < l; i++) {

			var _oContent = _aContent[i];

			//default id 구성.
			var _sid = oControl.getId() + "-inner" + i;

			var _oLayout = _oContent.getLayoutData();

			if(_oLayout){
				_sid = _oLayout.getId();
			}

			oRm.openStart("div", _sid);

			//gridLayout을 통해 구성한 dom 정보 매핑.
			oRm.attr("u4a-matrix-layout-content", true);

			//div 안에서 그려질 UI의 margin 처리에 대한 여백 적용을 위해 style 처리.
			oRm.style("display", "flex");

			oRm.style("align-self", "stretch");

			// content를 구성하는 div의 style 설정.
			MatrixLayoutRenderer.setContentLayoutStyle(oRm, _oContent);


			oRm.openEnd();

			oRm.renderControl(_oContent);

			oRm.close("div");
			
		}

	},
	
	


	/*************************************************************
    * @function - content를 구성하는 div의 style 설정.
    *************************************************************/
	MatrixLayoutRenderer.setContentLayoutStyle = function(oRm, oContent){

		var _oLayout = oContent.getLayoutData() || undefined;

		if(typeof _oLayout === "undefined"){
			return;
		}

		if(!_oLayout.isA("u4a.m.MatrixLayoutData")){
			return;
		}


		var _class = _oLayout.getStyleClassName();

		if(_class){
			oRm.class(_class);
		}

		
		//cell design 속성 적용.
		var _margin = _oLayout._getCellDesignMargin();

		oRm.style("margin", _margin);


		var _height = _oLayout.getHeight();

		if(_height){
			oRm.style("height", _height);
		}


		var _hAlign = _oLayout.getHAlign();

		if(_hAlign){
			oRm.style("justify-content", _hAlign);
		}


		var _vAlign = _oLayout.getVAlign();

		if(_vAlign){
			oRm.style("align-items", _vAlign);
		}


		// var _gridCol = "1";

		// if(_oLayout.getLayoutType() === "MatrixHeadData"){

		// 	var _gridCol = "1";

		// 	var _colSpan = _oLayout.getColSpan();

		// 	_gridCol = _gridCol + ` / span ${_colSpan}`;

		// 	oRm.style("grid-column", _gridCol);

		// 	return;

		// }

		// var _colSpan = _oLayout.getColSpan();

		// if(_colSpan === 1){
		// 	return;
		// }

		// oRm.style("grid-column", `span ${_colSpan}`);


	};

	return MatrixLayoutRenderer;

}, /* bExport= */ true);