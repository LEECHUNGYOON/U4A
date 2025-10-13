/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
],	function() {
	"use strict";

	/**
	 * FormLayout renderer.
	 * @namespace
	 */
	var FormLayoutRenderer = {apiVersion: 2};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {u4a.m.FormLayout} 
	 */
	FormLayoutRenderer.render = function(oRm, oControl) {

		//FormLayout div 시작.
		oRm.openStart("div", oControl);


		//FormLayout에 styleClass가 설정된경우 반영.
		if(Array.isArray(oControl?.aCustomStyleClasses)){
			oRm.class(oControl.aCustomStyleClasses.join(" "));
		}


		//Form layout의 width 설정.
		oRm.style("width", oControl.getWidth());


		//Form layout의 height 설정.
		oRm.style("height", oControl.getHeight());

		
		//FormLayout div 종료.
		oRm.openEnd();

		//FormLayout의 내부 DOM 구성.
		//(내부에서 그려질 UI의 margin으로 인해 스크롤 발생을 처리하기 위한 목적)
		oRm.openStart("div", `${oControl.getId()}-content`);


		//내부 DOM의 u4a Form layout flag 처리.
		oRm.attr("u4a-Form-layout", true);


		//content 내부에서 그려질 UI의 margin으로 인해 스크롤이 발생하는 부분을
		//처리 하기 위한 내부 padding.
		oRm.style("padding", "0.5rem");

		
		//FormLayout 영역의 UI를 Form로 표현.
		oRm.style("display", "grid");


		// //FormLayout 영역의 UI를 수직 정렬 처리.
		// oRm.style("align-items", "center");
		
		// //FormLayout의 height 간격을 균등 분배하여 child UI를 배치 하지 않는경우,
		// //height 간격을 균등 분배 하지 않도록 css 처리.
		// if(oControl.getStretchedVertically() !== true){
		// 	oRm.style("grid-auto-rows", "min-content");
		// }

		

		//가로 세로 스크롤 처리.
		oRm.style("overflow", "auto");


		oRm.openEnd();


		//content 정보의 하위 UI를 탐색하며 그리기.
		FormLayoutRenderer.renderTopData(oRm, oControl);

		oRm.close("div");

		oRm.close("div");

	},




	/*************************************************************
    * @function - formTopData 렌더링.
    *************************************************************/
	FormLayoutRenderer.renderTopData = function(oRm, oControl){

		var _aFormTopData = oControl.getFormTopData();

		if(_aFormTopData.length === 0){	
			return;
		}

		for (let i = 0, l = _aFormTopData.length; i < l; i++) {

			var _oFormTopData = _aFormTopData[i];

			//formTopData가 비활성 처리 된경우 하위 로직 skip.
			if(_oFormTopData.getVisible() !== true){
				continue;
			}

			//FormTopData div 시작.
			oRm.openStart("div", _oFormTopData.getId());

			//내부 DOM의 u4a Form layout flag 처리.
			oRm.attr("data-u4a-form-layout", true);
			
			//FormLayout 영역의 UI를 grid로 표현.
			oRm.style("display", "grid");

			// //가로 세로 스크롤 처리.
			// oRm.style("overflow", "auto");

			//cell끼리의 간격 설정.
			oRm.style("column-gap", "0.5rem");

			//2개의 컬럼(formTopData)가 존재하는경우
			//첫번쨰 컬럼에 2개의 row(formHeadData)를 설정
			//두번째 컬럼에 1개의 row(formHeadData)를 설정시
			//browser의 width가 줄어들어 row안에 표현되는
			//UI들이 하나의 컬럼으로 표현 될때
			//두번째 컬럼의 row(formHeadData)에 공백이 표현되어
			//그려지는것을 방지 하기 위해 align-items 속성 추가.
			oRm.style("align-items", "start");


			oRm.openEnd();

			//formHeadData 렌더링.
			FormLayoutRenderer.renderFormHeadData(oRm, _oFormTopData, oControl);


			oRm.close("div");

			
		}

	},



	/*************************************************************
    * @function - formHeadData 렌더링.
    *************************************************************/
	FormLayoutRenderer.renderFormHeadData = function(oRm, oControl, oForm){

		var _aHeadData = oControl.getFormHeadData();

		if(_aHeadData.length === 0){
			return;
		}

		for (let i = 0, l = _aHeadData.length; i < l; i++) {
			
			var _oHeadData = _aHeadData[i];

			//formHeadData가 비활성 처리 된경우 하위 로직 skip.
			if(_oHeadData.getVisible() !== true){
				continue;
			}

			//FormTopData div 시작.
			oRm.openStart("div", _oHeadData.getId());

			//내부 DOM의 u4a Form layout flag 처리.
			oRm.attr("u4a-Form-Head-layout", true);
			
			//FormLayout 영역의 UI를 grid로 표현.
			oRm.style("display", "grid");

			// //가로 세로 스크롤 처리.
			// oRm.style("overflow", "auto");

			//cell끼리의 간격 설정.
			oRm.style("column-gap", "0.5rem");

			oRm.openEnd();

			//formHeadContent 렌더링.
			FormLayoutRenderer.renderFormHeaderContent(oRm, _oHeadData, oForm);

			oRm.close("div");

			
		}

	},


	
	
	/*************************************************************
    * @function - formHeadContent 렌더링.
    *************************************************************/
	FormLayoutRenderer.renderFormHeaderContent = function(oRm, oControl, oForm){

		var _aContent = oControl.getContent();

		if(_aContent.length === 0){
			return;
		}

		var _formId = oForm.getId();

		for (let i = 0, l = _aContent.length; i < l; i++) {

			var _oContent = _aContent[i];

			if(_oContent?.getVisible?.() !== true){
				continue;
			}

			//default id 구성.
			var _sid = oControl.getId() + "-inner" + i;

			var _oLayout = _oContent.getLayoutData();

			//ui의 layoutData가 존재하는경우 해당 layoutData의 sid로 구성.
			if(_oLayout){
				_sid = _oLayout.getId();
			}

			oRm.openStart("div", _sid);

			//FormLayout을 통해 구성한 dom 정보 매핑.
			oRm.attr("u4a-form-layout-content", true);

			oRm.attr("data-u4a-form-id", _formId);

			//div 안에서 그려질 UI의 margin 처리에 대한 여백 적용을 위해 style 처리.
			oRm.style("display", "flex");

			//formLayout을 통해 그려질 UI가 컬럼의 영역 안에서 꽉 차게 그려지기 위한 css 처리.
			//(button과 같은 UI를 formLayout에 그리게 되면 widht를 설정하지 않을 경우
			//영역에 꽉 차게 그려지지 않는문제를 해결하기 위한 css 처리)
			oRm.style("flex-direction", "column");

			// content를 구성하는 div의 style 설정.
			FormLayoutRenderer.setContentLayoutStyle(oRm, _oContent);

			oRm.openEnd();

			oRm.renderControl(_oContent);

			oRm.close("div");

			
		}



	},




	/*************************************************************
    * @function - content를 구성하는 div의 style 설정.
    *************************************************************/
	FormLayoutRenderer.setContentLayoutStyle = function(oRm, oContent){

		var _oLayout = oContent.getLayoutData() || undefined;

		if(typeof _oLayout === "undefined"){
			return;
		}

		if(!_oLayout.isA("u4a.m.FormLayoutData")){
			return;
		}
		
		
		var _hAlign = _oLayout.getHAlign();

		if(_hAlign){
			// oRm.style("justify-content", _hAlign);
			oRm.style("align-items", _hAlign);
		}
		

		var _vAlign = _oLayout.getVAlign();

		if(_vAlign){
			// oRm.style("align-items", _vAlign);
			oRm.style("justify-content", _vAlign);
		}

	};

	return FormLayoutRenderer;

}, /* bExport= */ true);