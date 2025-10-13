/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
],	function() {
	"use strict";

	/**
	 * RowLayout renderer.
	 * @namespace
	 */
	var _oRowLayoutRenderer = {apiVersion: 2};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {u4a.m.RowLayout} 
	 */
	_oRowLayoutRenderer.render = function(oRm, oControl) {

		oRm.openStart("div", oControl);

		if(Array.isArray(oControl?.aCustomStyleClasses)){
			oRm.class(oControl.aCustomStyleClasses.join(" "));
		}

		var _width = oControl.getWidth();

		if(_width){
			//RowLayout layout의 width 설정.
			oRm.style("width", oControl.getWidth());
		}
		

		var _height = oControl.getHeight();

		if(_height){
			//RowLayout layout의 height 설정.
			oRm.style("height", oControl.getHeight());
		}
		
		
		//RowLayout div 종료.
		oRm.openEnd();

		
		//RowLayout의 내부 DOM 구성.
		//(내부에서 그려질 UI의 margin으로 인해 스크롤 발생을 처리하기 위한 목적)
		oRm.openStart("div", `${oControl.getId()}-content`);


		//내부 DOM의 u4a RowLayout layout flag 처리.
		oRm.attr("u4a-row-layout", true);


		//content 내부에서 그려질 UI의 margin으로 인해 스크롤이 발생하는 부분을
		//처리 하기 위한 내부 padding.
		oRm.style("padding", "0.5rem");


		oRm.style("overflow", "auto");


		oRm.openEnd();

		//content 정보의 하위 UI를 탐색하며 그리기.
		_oRowLayoutRenderer.renderContent(oRm, oControl);


		oRm.close("div");

		oRm.close("div");

	},
	
	

	/*************************************************************
    * @function - content 정보의 하위 UI를 탐색하며 그리기.
    *************************************************************/
	_oRowLayoutRenderer.renderContent = function(oRm, oControl){
		
		var _aContent = oControl.getContent();

		if(_aContent.length === 0){
			return;
		}


		var _aRow = [];

		//RowLayoutData를 사용하는 UI를 ARRAY에 수집 처리
		//(첫번째 UI는 RowLayoutData가 없어도 수집)
		for (let index = 0; index < _aContent.length; index++) {
			
			var _oContent = _aContent[index];

			var _oLayout = _oContent.getLayoutData();

			//첫번째 UI의 경우 layoutData가 없어도 layout을 수집.
			if(index === 0){

				var _sRow = {layout: undefined, T_GROUP:[]};

				if(_oLayout?.isA?.("u4a.m.RowLayoutData") === true){
					_sRow.layout = _oLayout;
				}

				_sRow.T_GROUP.push(_oContent);
				
				_aRow.push(_sRow);

				continue;
			}


			//RowLayoutData를 사용하는 UI의 경우 새로운 ROW로 구분 처리.
			if(_oLayout?.isA?.("u4a.m.RowLayoutData") === true){
				
				var _sRow = {layout: undefined, T_GROUP:[]};

				_sRow.layout = _oLayout;

				_sRow.T_GROUP.push(_oContent);

				_aRow.push(_sRow);

				continue;
			}

			_sRow.T_GROUP.push(_oContent);
			
		}
		

		//수집한 UI를 기준으로 내부 DIV 생성.
		for (let index = 0; index < _aRow.length; index++) {
			
			var _sRow = _aRow[index];

			//default id 구성.
			var _sid = oControl.getId() + "-inner" + index;

			//RowLayoutData가 있는 경우 해당 id로 변경 처리.
			if(_sRow.layout){
				_sid = _sRow.layout.getId();
			}
			

			oRm.openStart("div", _sid);

			//content를 구성하는 div의 style 설정.
			_oRowLayoutRenderer.setContentLayoutStyle(oRm, _sRow.layout);

			oRm.openEnd();

			_sRow.T_GROUP.forEach(oContent => {
				oRm.renderControl(oContent);
			});

			oRm.close("div");

			
		}


	},
	
	


	/*************************************************************
    * @function - content를 구성하는 div의 style 설정.
    *************************************************************/
	_oRowLayoutRenderer.setContentLayoutStyle = function(oRm, oLayout){

		if(typeof oLayout === "undefined"){
			return;
		}

		if(!oLayout.isA("u4a.m.RowLayoutData")){
			return;
		}

		var _hAlign = oLayout.getHAlign();

		if(_hAlign){
			oRm.style("text-align", _hAlign);
		}


		//cell design 속성 적용.
		var _margin = oLayout._getRowDesignMargin();


		oRm.style("margin", _margin);

	};

	return _oRowLayoutRenderer;

}, /* bExport= */ true);