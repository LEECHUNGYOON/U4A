//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define([
"sap/ui/core/Element"
], function(Element){
    "use strict";


    var _oFormHeadData = Element.extend("u4a.m.FormHeadData", {
        metadata : {
            library : "u4a.m",
            properties : {

                //form의 breakPoint가 X Large 크기일떄의 row span값 설정.
                //rowSpan을 설정하는 경우 설정된 값 만큼 아래 영역이 공백이됨.
                rowSpanXL : { type : "int", defaultValue : 0 },

                //form의 breakPoint가 Large 크기일떄의 row span값 설정.
                //rowSpan을 설정하는 경우 설정된 값 만큼 아래 영역이 공백이됨.
                rowSpanL : { type : "int", defaultValue : 0 },

                //form의 breakPoint가 Medium 크기일떄의 row span값 설정.
                //rowSpan을 설정하는 경우 설정된 값 만큼 아래 영역이 공백이됨.
                rowSpanM : { type : "int", defaultValue : 0 },

                //form의 breakPoint가 Small 크기일떄의 row span값 설정.
                //rowSpan을 설정하는 경우 설정된 값 만큼 아래 영역이 공백이됨.
                rowSpanS : { type : "int", defaultValue : 0 },

                //formHeadData의 활성 여부.
                visible : { type : "boolean", defaultValue : true }

            },

            defaultAggregation : "content",

            aggregations : {
                content : { type : "sap.ui.core.Control", multiple : true, singularName: "content" }
            }

        }, /* end of metadata */



        
        /*************************************************************
        * @function - style 적용.
        *************************************************************/
        _setStyle : function(styleName, styleValue){
            
            var _oDom = this.getDomRef();

            if(!_oDom?.style){
                return;
            }


            _oDom.style[styleName] = styleValue;

        },




        /*************************************************************
        * @function - 컬럼의 span 설정.
        *************************************************************/
        _setTemplateColumns : function(sColInfo){

            //현재 formHeadData가 비활성 처리된 경우 exit.
            if(this.getVisible() !== true){
                return;
            }

            var _oDom = this.getDomRef();

            if(!_oDom){
                return;
            }
            
            //formTopData의 갯수만큼 grid-template-columns 설정.
            _oDom.style.gridTemplateColumns = "repeat(" + sColInfo.colCount + ", 1fr)";

            //formTopData의 UI간의 간격 설정.
            _oDom.style.columnGap = "0.5rem";

            var _getterName = "getRowSpan" + sColInfo.currentBreakPoint; 

            var _rowSpan = this[_getterName]?.() || 1;

            _oDom.style.gridRow = `span ${_rowSpan}`;


            //colCount, currentBreakPoint
            var _aContent = this.getContent();

            if (_aContent.length === 0){
                return;
            } 

            // 화면 표시 중인 컨텐츠 존재 여부 확인.
            var _found = _aContent.findIndex(item => item?.getVisible?.() === true);

            //formHeadData의 content 중 화면에 표시되는 항목이 없는경우 처리 중단.
            if(_found === -1){
                return;
            }


            // 현재 breakpoint에 따른 colSpan 속성명 구성.
            // 예: getColSpanL, getColSpanM ...
            var _getterName = "getColSpan" + sColInfo.currentBreakPoint; 


            // 1) 각 아이템의 고정(span) 여부/값을 먼저 수집
            var _aItems = _aContent.map((ctrl, idx) => {
                
                let _fixed = false;
                let _span = 0;

                // 화면에 표시되지 않는 컨트롤은 무시
                //visible false건에 대한 skip flag 설정.
                if(ctrl?.getVisible?.() !== true){
                    return { ctrl, idx, fixed: _fixed, span: _span, skip: true };
                }

                //현재 UI가 Label인경우 default span 설정.
                if(ctrl.isA("sap.m.Label") === true){
                    //default 3으로 설정(sColInfo.colCount가 3보다 작은경우는 colCount 값으로 설정)
                    _span = Math.min(3, sColInfo.colCount);

                    _fixed = true;
                }

                var _oLayout = ctrl.getLayoutData?.();                
                
                // FormLayoutData가 아닌 경우 무시
                if (_oLayout?.isA?.("u4a.m.FormLayoutData") !== true) {
                    return { ctrl, idx, fixed: _fixed, span: _span };
                }


                // 해당 breakpoint에 대한 span 값 얻기
                //(현재 UI가 label 인경우 layoutData의 colSpan 값이 설정되어 있지 않다면
                //default span3값으로 설정함)
                _span = _oLayout[_getterName]?.() || _span;

                // 0보다 큰 정수인 경우 고정값으로 간주
                if(_span > 0){
                    _fixed = true;
                }

                return { ctrl, idx, fixed: _fixed, span: _span };

            });


            // 2) 고정 span 총합 계산
            const _fixedTotal = _aItems.reduce((sum, it) => sum + (it.fixed ? it.span : 0), 0);

            // 3) 남은 colCount 계산 (음수 방지)
            let _remaining = Math.max(sColInfo.colCount - _fixedTotal, 0);

            // 4) 가변(span 미지정, visible 처리건) 아이템들 집합
            const _aFlexItems = _aItems.filter( item => !item.fixed && !item.skip );

            const _flexCount = _aFlexItems.length;

            // 5) 가변 분배 규칙: (남은영역 / 가변개수) 균등 분배 (몫/나머지)
            //    예) colCount=8, content=3, 전부 미지정 -> 3,3,2
            let _base = 0, _remainder = 0;
            
            if (_flexCount > 0) {
                _base = Math.floor(_remaining / _flexCount);
                _remainder = _remaining % _flexCount;
            }

            // 6) 실제 DOM에 gridColumn span 적용
            //    - 고정값 있는 항목은 그 값으로
            //    - 나머지는 base + (앞쪽 remainder개에 +1)
            //    - DOM ref는 "inner" + i (필터링 후의 i 인덱스 유지)
            for (let i = 0; i < _aItems.length; i++) {
                
                const _sItem = _aItems[i];

                //default dom id 구성.
                var _sid = this.getId() + "-inner" + i;

                //현재 content의 layoutData 정보 얻기.
                var _oLayout = _sItem.ctrl?.getLayoutData?.();

                //u4a.m.FormLayoutData인경우 dom id 변경.
                if(_oLayout?.isA?.("u4a.m.FormLayoutData")){
                    _sid = _oLayout.getId();
                }

                const _oDom = document.getElementById(_sid);
                
                if (!_oDom){
                    continue;
                }



                // formLayoutData에 colSpan을 설정한 경우 해당 값으로 span 지정.
                if (_sItem.fixed) {
                
                    // _oDom.style.gridArea = sColInfo.rowCount + " / span " + _sItem.span;
                    _oDom.style.gridColumn = "span " + _sItem.span;

                    continue;

                }


                // 분배 순서는 가변 아이템의 "등장 순서" 기준
                const _rank = _aFlexItems.indexOf(_sItem); // 0,1,2,...

                //가변 처리(colSpan 미설정)인 경우, 나머지 값을 
                var _span = _base + (_rank > -1 && _rank < _remainder ? 1 : 0);

                // 안전장치: 0 이하가 나오지 않도록(극단 케이스 대비)
                if (!Number.isInteger(_span) || _span < 1){
                    _span = 1;
                } 

                // _oDom.style.gridArea = sColInfo.rowCount + " / span " + _span;
                _oDom.style.gridColumn = "span " + _span;


            }

        }


    });

    return _oFormHeadData;

});