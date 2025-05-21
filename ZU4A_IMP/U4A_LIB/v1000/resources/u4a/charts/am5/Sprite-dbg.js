sap.ui.define("u4a.charts.am5.Sprite", [
    "u4a/charts/am5/Entity"
    
],function(Entity){
    "use strict";

    //차트  CursorOverStyle 유형.
    //마우스 커서가 차트 요소에 over 됐을때 커서 모양 설정 enum 정보.
    u4a.charts.am5.CursorOverStyleType = {
        help : "help",
        wait : "wait",
        crosshair : "crosshair",
        not_allowed : "not-allowed",
        zoom_in : "zoom-in",
        grab : "grab",
        default : "default",
        pointer : "pointer",
        none : "none"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.CursorOverStyleType", u4a.charts.am5.CursorOverStyleType);

    
    //차트 요소의 위치 설정 유형.
    //absolute으로 설정할 경우 x, y 좌표값으로 차트 요소를 배치 해야한다.
    u4a.charts.am5.PositionType = {
        absolute : "absolute",
        relative : "relative"
        
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.PositionType", u4a.charts.am5.PositionType);


    //차트 요소의 툴팁 출력 방식 유형.
    //hover : 차트 요소에 마우스를 갖다 댈 경우 툴팁을 표현 처리.
    //always : 차트 요소에 항상 툴팁을 표현 처리.
    //click : 차트 요소를 클릭 할 경우  툴팁을 표현 처리.
    u4a.charts.am5.ShowTooltipOnType = {
        hover : "hover",
        always : "always",
        click : "click"
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.ShowTooltipOnType", u4a.charts.am5.ShowTooltipOnType);

    
    let _oSprite = Entity.extend("u4a.charts.am5.Sprite", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {
                //차트 요소의 width.
                width : { type : "sap.ui.core.CSSSize"},


                //차트 요소의 흐림 처리.
                //값이 0보다 커질수록 점점 흐려진다.
                //0 미만의 값은 동작하지 않는다.
                //(safari 브라우저에서 동작하지 않음.)
                blur : { type : "float", defaultValue : 0 },


                //차트 요소의 명도.
                //값이 0으로 갈수록 점점 어두워진다(검정색에 가까워짐.)
                //0 미만의 값은 동작하지 않는다.
                //값이 1일 경우 default 색상.
                //값이 1보다 커질수록 점점 밝아진다(하얀색에 가까워짐)
                //(safari 브라우저에서 동작하지 않음.)
                brightness : { type : "float", defaultValue : 1 },

                
                //X축 가운데 중심점 좌표값 설정.
                //width 1000px 인경우 center의 값은 500px임.
                //0 ----- center(500px) ----- 1000px.
                //이때 200을 입력시 x축의 center값을 300px으로 설정하고 차트를 구성함.
                //0 --- center(300px) ------- 1000px.
                //-200을 입력시 x축의 center값을 700px으로 설정하고 차트를 구성함.
                //0 ------- center(700px) --- 1000px.
                centerX : { type : "sap.ui.core.CSSSize", defaultValue : "" },


                //Y축 가운데 중심점 좌표값 설정
                //height 1000px 인경우 center의 값은 500px임.
                //0 ----- center(500px) ----- 1000px.
                //이때 200을 입력시 y축의 center값을 300px으로 설정하고 차트를 구성함.
                //0 --- center(300px) ------- 1000px.
                //-200을 입력시 y축의 center값을 700px으로 설정하고 차트를 구성함.
                //0 ------- center(700px) --- 1000px.
                centerY : { type : "sap.ui.core.CSSSize", defaultValue : "" },


                //차트 요소의 명암 대비
                //0에 가까워질수록 점점 회색으로된다.
                //0 미만의 값은 동작하지 않는다.
                //값이 1일 경우 default 색상.
                //값이 1보다 커질수록 점점 쨍한 색상이 된다.
                //(safari 브라우저에서 동작하지 않음.)
                contrast : { type : "float", defaultValue : 1 },


                //차트 요소에 마우스를 갖다 댔을 때의 마우스 커서 표현.
                cursorOverStyle : { type : "u4a.charts.am5.CursorOverStyleType", defaultValue : "default" },
                

                //차트 요소의 드래그 처리 여부.
                //(true : 드래그 처리)
                //(모든 차트 요소가 드래그 가능하지 않음.
                //xy차트의 경우 드래그가 가능하지만, 차트의 컬럼은 드래그가 불가능함)
                draggable : { type : "boolean", defaultValue : false },


                //차트 요소의 수평 이동값(픽셀 단위).
                //(100을 입력할 경우, 차트 요소가 왼쪽에서 오른쪽으로 100px만큼 떨어진 곳부터 그려짐.)
                //(-100을 입력할 경우, 차트 요소가 가장 왼쪽의 -100px만큼 떨어진 곳부터 그려짐.)
                dx : { type : "int", defaultValue : 0 },


                //차트 요소의 수직 이동값(픽셀 단위).
                //(100을 입력할 경우, 차트 요소가 위에서 아래로 100px만큼 떨어진 곳부터 그려짐.)
                //(-100을 입력할 경우, 차트 요소가 최상단의 -100px만큼 떨어진 곳부터 그려짐.)
                dy : { type : "int", defaultValue : 0 },


                //pdf, png 등 차트를 다운로드 처리할 경우, 해당 요소를 포함 처리 할지 여부.
                //(xy차트의 꺽은선, 막대가 존재할경우 막대 요소의 exportable를를 false로 설정후 다운로드시
                //막대는 제외한 이미지를 다운로드 처리함)
                exportable : { type : "boolean", defaultValue : false },


                //차트 요소 비활성 처리.
                //(visible : true 상태라도 forceHidden이 true 인경우 비활성 처리됨.)
                forceHidden : { type : "boolean", defaultValue : false },


                //상호작용 비활성 처리.
                //(파이 차트의 forceInactive를 true로 설정시
                //series(내부 조각)를 선택시 이벤트가 발생하지 않음, series조각이 펼쳐지거나 접혀지지 않음.
                //마우스를 갖다대도 툴팁이 나오지 않음.
                //즉 어떠한 상호작용도 동작하지 않음.
                //이는 자식 요소들도 같이 적용됨.)
                forceInactive : { type : "boolean", defaultValue : false },


                //차트 요소의 height.
                height : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 색상으로부터. hue에 입력된 값만큼 shift 한 색상을 출력함.
                //(값은 0 ~ 360 을 기준으로 하며, 만약 361의 값을 입력한 경우 1값과 같이 동작한다)
                //(safari 브라우저에서 동작하지 않음.)
                hue : { type : "int", defaultValue : 0 },


                //차트 요소의 색상 반전 처리.
                //0 ~ 1의 값을 허용함.
                //값이 0인경우 원래 색상으로 처리됨.
                //값이 0보다 작을경우 동작하지 않음.
                //값이 1에 가까워질수록 반전되는 색상이된다.
                //차트 요소의 색상이 흰색(#ffffff) 일경우 invert값이 1인경우 검정색(#000000)이됨.
                //1값을 초과할 경우 1값으로 동작한다.
                //(safari 브라우저에서 동작하지 않음.)
                invert : { type : "float", defaultValue : 0 },


                //차트 요소의 레이어
                //값이 높을수록 앞에서 표현된다(z-index 속성)
                layer : { type : "int", defaultValue : 0 },

                
                //차트 요소의 하단 여백.
                marginBottom: { type : "int", defaultValue : 0 },


                //차트 요소의 좌측 여백.
                marginLeft: { type : "int", defaultValue : 0 },


                //차트 요소의 우측 여백.
                marginRight: { type : "int", defaultValue : 0 },


                //차트 요소의 상단 여백.
                marginTop: { type : "int", defaultValue : 0 },


                //차트 요소의 최대 height값.
                maxHeight : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 최대 width값.
                maxWidth : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 최소 height값.
                minHeight : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 최소 width값.
                minWidth : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 투명도 설정.
                //값이 0에 가까워 질수록 투명해지며, 
                //1에 가까워질수록 불투명해진다.
                //0 미만의 값이 입력된 경우 0값으로 동작한다.
                //1값을 초과할 경우 1값으로 동작한다.
                opacity : { type : "float", defaultValue : 1 },


                //차트 요소의 배치 유형 설정.
                //absolute으로 설정할 경우 x, y 좌표값으로 차트 요소를 배치 해야한다.
                position : { type : "u4a.charts.am5.PositionType", defaultValue : "relative" },

                
                //차트 요소의 회전 값.
                //1을 입력 경우 시계 방향으로 1도 기울어진다.
                //-1을 입력력할 경우 반시계 방향으로 1도 기울어진다.
                //-1 ~ -360 , 1 ~ 360 의 값을 입력할 수 있다.
                //-361 값을 입력할 경우, -1 값과 같게 동작한다.
                //마찬가지로 361 값을 입력할 경우 1 값과 같게 동작한다.
                rotation : { type : "float", defaultValue : 0 },


                //차트 요소의 채도 값.
                //값이 0에 가까워 질수록 점점 색상이 흑백으로 표현한다.
                //0 미만인경우 동작하지 않음.
                //값이 1일 경우 default 색상으로 표현된다.
                //값이 1을 초화할 경우 점점 쨍한 색상으로 표현한다.
                //(값이 1을 초과할 경우 safari 브라우저에서 동작하지 않음.)
                saturate : { type : "float", defaultValue : 1 },


                //차트 요소의 확대 축소 값.
                //값이 0에 가까워 질수록 점점 작아진다.
                //값이 0인경우 0%로 작아져 보여지지 않게 된다.
                //차트가 표현되는 DOM의 크기는 변하지 않으며, DOM 안에서 표현되는 차트의 크기가 변경된다.
                //0 미만의 값이 입력될 경우, 0값으로 동작한다.
                //1값인경우 100%으로 차트요소를 표현한다.
                //1값을 초과할 경우 점점 확대하여 표현한다.
                scale : { type : "float", defaultValue : 1 },


                //차트 요소의 세피아 필터 적용 효과 값.
                //0 ~ 1 의 값을 허용한다.
                //default 값인 0인경우 원래 색상으로 표현한다.
                //0 미만의 값이 입력된경우 default 0값으로 동작한다.
                //값이 1에 가까워질수록 세피아 필터 효과가 점점 적용되어 표현된다.
                //값이 1을 초과할 경우, 1값으로 동작한다.
                //(safari 브라우저에서 동작하지 않음.)
                sepia : { type : "float", defaultValue : 0 },


                //차트 요소의 툴팁 출력 방식 유형.
                //hover : 차트 요소에 마우스를 갖다 댈 경우 툴팁을 표현 처리.
                //always : 차트 요소에 항상 툴팁을 표현 처리.
                //click : 차트 요소를 클릭 할 경우  툴팁을 표현 처리.
                showTooltipOn : { type : "u4a.charts.am5.ShowTooltipOnType", defaultValue : "hover" },

                
                //차트 요소의 x축 
                //차트 요소가 배치된 위치로부터 입력한 값 만큼 이동 처리한다.
                //10 을 입력한 경우 기존 위치로부터 오른쪽으로 10px 만큼 이동.
                //-10을 입력한 경우 기존 위치로부터 왼쪽으로 10px 만큼 이동한다.
                x : { type : "sap.ui.core.CSSSize" },


                //차트 요소의 y축.
                //차트 요소가 배치된 위치로부터 입력한 값 만큼 이동 처리한다.
                //10 을 입력한 경우 기존 위치로부터 아래로 10px 만큼 이동.
                //-10을 입력한 경우 기존 위치로부터 위로 10px 만큼 이동한다.
                y : { type : "sap.ui.core.CSSSize" }


            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Entity.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Entity.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 Instance에 예외처리 setting 값 반영.
         *  예외처리 대상 setting값의 경우 blur을 적용한뒤, brightness을 적용하게되면
         *  적용된 blur가 해제 되는 내용이 존재함.
         *  따라서 예외처리 대상 setting값을 제거한뒤, 해당 setting값을 모두 수집하여
         *  한번에 적용 처리하는 예외로직.
         *************************************************************/
        _setChartExcepSetting : function(){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                this._updateChartData();
                return;
            }

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return;
            }

            //예외처리 대상 프로퍼티 항목.
            let _aExcepProp = [
                "blur",
                "brightness",
                "contrast",
                "hue",
                "invert",
                "saturate",
                "sepia"
            ];


            let _sReset = {};

            let _sSettings = {};

            let _isChanged = false;


            for (let i = 0, l = _aExcepProp.length; i < l; i++) {
                
                let _excepProp = _aExcepProp[i];
                
                //metaData의 프로퍼티 정보 얻기.
                let _oProp = _oMeta.getProperty(_excepProp);

                if(typeof _oProp === "undefined"){
                    continue;
                }

                let _val = this.getProperty(_excepProp);

                if(_val !== _oProp.getDefaultValue()){
                    _isChanged = true;
                }


                //예외처리 대상 setting 항목 null 처리로 수집.
                _sReset[_excepProp] = null;

                
                //UI에 적용된 프로퍼티 정보를 차트에 적용할 settings 값 수집.
                //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
                _sSettings[_excepProp] = this._convAM5Property(_excepProp, _val);

                
            }
            

            //예외처리 대상 setting값을 초기화 처리.
            this._oChart.oChartInstance.setAll(_sReset);


            if(_isChanged === false){
                return;
            }

            //예외처리 대상 setting값을 한번에 적용 처리.
            this._oChart.oChartInstance.setAll(_sSettings);


        },


        /*************************************************************
         * @function - width 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWidth : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("width", propValue);
            
            //차트 Instance에 width settings 값 반영 처리.
            this._setChartSettings("width", this._convAm5CssSize(_propValue));

        },



        /*************************************************************
         * @function - centerX 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCenterX : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("centerX", propValue);
            
            //차트 Instance에 centerX settings 값 반영 처리.
            this._setChartSettings("centerX", _propValue);
            

        },


        /*************************************************************
         * @function - centerY 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCenterY : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("centerY", propValue);
            
            //차트 Instance에 centerY settings 값 반영 처리.
            this._setChartSettings("centerY", _propValue);

        },


        /*************************************************************
         * @function - cursorOverStyle 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setCursorOverStyle : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("cursorOverStyle", propValue);
            
            //차트 Instance에 cursorOverStyle settings 값 반영 처리.
            this._setChartSettings("cursorOverStyle", _propValue);

        },


        /*************************************************************
         * @function - draggable 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setDraggable : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("draggable", propValue);
            
            //차트 Instance에 draggable settings 값 반영 처리.
            this._setChartSettings("draggable", _propValue);

        },


        /*************************************************************
         * @function - dx 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setDx : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("dx", propValue);
            
            //차트 Instance에 dx settings 값 반영 처리.
            this._setChartSettings("dx", _propValue);

        },


        /*************************************************************
         * @function - dy 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setDy : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("dy", propValue);
            
            //차트 Instance에 dy settings 값 반영 처리.
            this._setChartSettings("dy", _propValue);

        },


        /*************************************************************
         * @function - exportable 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setExportable : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("exportable", propValue);
            
            //차트 Instance에 exportable settings 값 반영 처리.
            this._setChartSettings("exportable", _propValue);

        },


        /*************************************************************
         * @function - forceHidden 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setForceHidden : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("forceHidden", propValue);
            
            //차트 Instance에 forceHidden settings 값 반영 처리.
            this._setChartSettings("forceHidden", _propValue);

        },

        
        /*************************************************************
         * @function - forceInactive 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setForceInactive : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("forceInactive", propValue);
            
            //차트 Instance에 forceInactive settings 값 반영 처리.
            this._setChartSettings("forceInactive", _propValue);

        },

        
        /*************************************************************
         * @function - height 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHeight : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("height", propValue);
            
            //차트 Instance에 height settings 값 반영 처리.
            this._setChartSettings("height", this._convAm5CssSize(_propValue));

        },


        /*************************************************************
         * @function - layer 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLayer : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("layer", propValue);
            
            //차트 Instance에 layer settings 값 반영 처리.
            this._setChartSettings("layer", _propValue);

        },


        /*************************************************************
         * @function - marginBottom 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMarginBottom : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("marginBottom", propValue);
            
            //차트 Instance에 marginBottom settings 값 반영 처리.
            this._setChartSettings("marginBottom", _propValue);

        },


        /*************************************************************
         * @function - marginLeft 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMarginLeft : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("marginLeft", propValue);
            
            //차트 Instance에 marginLeft settings 값 반영 처리.
            this._setChartSettings("marginLeft", _propValue);

        },


        /*************************************************************
         * @function - marginRight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMarginRight : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("marginRight", propValue);
            
            //차트 Instance에 marginRight settings 값 반영 처리.
            this._setChartSettings("marginRight", _propValue);

        },


        /*************************************************************
         * @function - marginTop 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMarginTop : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("marginTop", propValue);
            
            //차트 Instance에 marginTop settings 값 반영 처리.
            this._setChartSettings("marginTop", _propValue);

        },


        /*************************************************************
         * @function - maxHeight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxHeight : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("maxHeight", propValue);
            
            //차트 Instance에 maxHeight settings 값 반영 처리.
            this._setChartSettings("maxHeight", _propValue);

        },


        /*************************************************************
         * @function - maxWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMaxWidth : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("maxWidth", propValue);
            
            //차트 Instance에 maxWidth settings 값 반영 처리.
            this._setChartSettings("maxWidth", _propValue);

        },


        /*************************************************************
         * @function - minHeight 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinHeight : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("minHeight", propValue);
            
            //차트 Instance에 minHeight settings 값 반영 처리.
            this._setChartSettings("minHeight", _propValue);

        },


        /*************************************************************
         * @function - minWidth 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setMinWidth : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("minWidth", propValue);
            
            //차트 Instance에 minWidth settings 값 반영 처리.
            this._setChartSettings("minWidth", _propValue);

        },


        /*************************************************************
         * @function - opacity 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setOpacity : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("opacity", propValue);
            
            //차트 Instance에 opacity settings 값 반영 처리.
            this._setChartSettings("opacity", _propValue);

        },


        /*************************************************************
         * @function - position 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setPosition : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("position", propValue);
            
            //차트 Instance에 position settings 값 반영 처리.
            this._setChartSettings("position", _propValue);

        },


        /*************************************************************
         * @function - rotation 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setRotation : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("rotation", propValue);
            
            //차트 Instance에 rotation settings 값 반영 처리.
            this._setChartSettings("rotation", _propValue);

        },


        /*************************************************************
         * @function - scale 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setScale : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("scale", propValue);
            
            //차트 Instance에 scale settings 값 반영 처리.
            this._setChartSettings("scale", _propValue);

        },


        /*************************************************************
         * @function - showTooltipOn 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setShowTooltipOn : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("showTooltipOn", propValue);
            
            //차트 Instance에 showTooltipOn settings 값 반영 처리.
            this._setChartSettings("showTooltipOn", _propValue);

        },


        /*************************************************************
         * @function - x 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setX : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("x", propValue);
            
            //차트 Instance에 x settings 값 반영 처리.
            this._setChartSettings("x", _propValue);

        },


        /*************************************************************
         * @function - y 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setY : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("y", propValue);
            
            //차트 Instance에 y settings 값 반영 처리.
            this._setChartSettings("y", _propValue);

        },


        /*************************************************************
         * @function - blur 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setBlur : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("blur", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - brightness 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setBrightness : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("brightness", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - contrast 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setContrast : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("contrast", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - hue 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHue : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("hue", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - invert 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInvert : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("invert", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - saturate 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setSaturate : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("saturate", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - sepia 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setSepia : function(propValue){

            //프로퍼티 값 반영 처리.
            this._setProperty("sepia", propValue);


            //차트 Instance에 예외처리 setting 값 반영.
            this._setChartExcepSetting();

        },


        /*************************************************************
         * @function - visible 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setVisible : function(propValue){

            //프로퍼티 값 반영 처리.
            let _propValue = this._setProperty("visible", propValue);
            
            //차트 Instance에 visible settings 값 반영 처리.
            this._setChartSettings("visible", _propValue);

        }
        
        
    });

    return _oSprite;
    
});
