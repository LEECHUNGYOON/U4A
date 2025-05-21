sap.ui.define("u4a.charts.am5.SerialChart", [
    "u4a/charts/am5/Chart"
],function(Chart){
    "use strict";
    
    let _oSerialChart = Chart.extend("u4a.charts.am5.SerialChart", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트의 애니메이션 처리 속도.
                //1000값을 입력할 경우 1초동안 애니메이션 처리를 한다.
                seriesAppearDuration : { type : "int", defaultValue : 0 }
            }
    
        }, /* end of metadata */
    
        init : function(){
            
            Chart.prototype.init.apply(this, arguments);
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
    
        exit : function(){
    
            Chart.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - am5 차트의 root Instance의 resize function 수행.
         * chart의 dom.style.height 값을 변경 할려 해당 function을 통해
         * 크기를 재조정 해야함.(그렇지 않을경우 오류 발생.)
         *************************************************************/
        _chartRootResize : function(){

            if(typeof this?._oChart?.oRoot === "undefined"){
                return;
            }

            this._oChart.oRoot.resize();

        },


        /*************************************************************
         * @function - UI5 테마에 따른 차트 테마 설정.
         *************************************************************/
        setChartTheme : function(oRoot){

            if(typeof oRoot === "undefined"){
                return;
            }
            
            if(oRoot.isDisposed() === true){
                return;
            }

            //UI5 테마에 따른 차트 테마 색상 정보 구성.
            let _oTheme = this.setChartThemeRule(oRoot);

            if(typeof _oTheme === "undefined"){
                return;
            }

            //차트 테마 설정.
            oRoot.setThemes([
                _oTheme
            ]);

        },


        /*************************************************************
         * @function - UI5 테마에 따른 차트 테마 색상 설정.
         *************************************************************/
        setChartThemeRule : function(oRoot){

            if(typeof window?.am5?.Theme === "undefined"){
                return;
            }

            if(typeof oRoot === "undefined"){
                return;
            }

            let _oTheme = am5.Theme.new(oRoot);

            let _oRule = _oTheme.rule("InterfaceColors");

            if(typeof _oRule === "undefined"){
                return;
            }


            //배경색.
            let _oBackgroundColor = sap.ui.core.theming.Parameters.get("sapUiGlobalBackgroundColor");

            //텍스트 색상.
            let _textColor = sap.ui.core.theming.Parameters.get("sapTextColor");

            _oRule.setAll({

                //윤곽선 색상 (#000000 검정)
                stroke: am5.Color.fromString(_oBackgroundColor),
                
                // //채우기 색상 (#2b2b2b 검정계통)
                // fill: am5.Color.fromString("#2b2b2b"),
                
                // //기본 버튼 채우기 색상 (#6794dc 하늘색계통)
                // primaryButton: am5.Color.lighten(am5.Color.fromString("#6794dc")),
                
                // //기본버튼의 마우스 갖다 댈경우 채우기 색상 (#6771dc 하늘색계통)
                // primaryButtonHover: am5.Color.lighten(am5.Color.fromString("#6771dc"), - 0.2),
                
                // //기본버튼의 마우스 누를경우 채우기 색상 (#68dc75 초록색계통)
                // primaryButtonDown: am5.Color.lighten(am5.Color.fromString("#68dc75"), -0.2),
                
                // //기본버튼의 마우스 활성화 채우기 색상 (#68dc76 초록색계통)
                // primaryButtonActive: am5.Color.lighten(am5.Color.fromString("#68dc76"), -0.2),
                
                // //기본버튼 텍스트 색상 (#ffffff 흰색)
                // primaryButtonText: am5.Color.fromString(_textColor),
                
                // //기본버튼 윤곽선 색상 (#6794dc 하늘색계통)
                // primaryButtonStroke: am5.Color.lighten(am5.Color.fromString("#6794dc"), -0.2),
                
                // //보조버튼 채우기 색상 (#3b3b3b 검정색계통)
                // secondaryButton: am5.Color.fromString("#3b3b3b"),
                
                // //보조버튼의 마우스 갖다 댈경우 채우기 색상 (#3b3b3b 검정색계통)
                // secondaryButtonHover: am5.Color.lighten(am5.Color.fromString("#3b3b3b"), 0.1),
                
                // //보조버튼의 마우스 누를경우 채우기 색상 (#3b3b3b 검정색계통)
                // secondaryButtonDown: am5.Color.lighten(am5.Color.fromString("#3b3b3b"), 0.15),
                
                // //보조버튼의 마우스 활성화 채우기 색상 (#3b3b3b 검정색계통)
                // secondaryButtonActive: am5.Color.lighten(am5.Color.fromString("#3b3b3b"), 0.2),

                // //보조버튼 텍스트 색상 (#bbbbbb 회색계통)
                // secondaryButtonText: am5.Color.fromString("#bbbbbb"),
                
                // //보조버튼 윤곽선 색상 (#3b3b3b 검정색계통)
                // secondaryButtonStroke: am5.Color.lighten(am5.Color.fromString("#3b3b3b"), - 0.2),
                
                //선 색상.(#bbbbbb 회색계통)
                grid: am5.Color.fromString(_textColor),
                
                //배경색.(#000000 검정)
                background: am5.Color.fromString(_oBackgroundColor),
                
                //대체 배경색.(#ffffff 흰색)
                alternativeBackground: am5.Color.fromString(_textColor),
                
                //텍스트 색상.(#ffffff흰색)
                text: am5.Color.fromString(_textColor),
                
                //대체 텍스트 색상.(#000000 검정)
                alternativeText: am5.Color.fromString("#000000"),
                
                //비활성 처리된 요소의 색상.(#adadad 회색계통)
                disabled: am5.Color.fromString("#adadad"),
                
                //양수값에 대한 색상.(#50b300 초초록색계통)
                positive: am5.Color.fromString("#50b300"),
                
                //음수값에 대한 색상.(#b30000 붉은색 계통)
                negative: am5.Color.fromString("#b30000")

            });


            return _oTheme;

        },


        /*************************************************************
         * @function - width 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setWidth : function(propValue){

            let _propValue = this._setProperty("width", propValue);

            let _oDom = this.getDomRef() || undefined;

            if(typeof _oDom === "undefined"){

                //chart의 대표 dom에 적용할 width 속성값이 존재하지 않는경우 default로 auto 처리.
                //(Sprite의 width property의 defaultValue가 undefined로 되어있기에 width 값이 없는경우
                //chart 대표 dom.style.width에 auto 값으로 설정함.)
                if(typeof _propValue === "undefined"){
                    _propValue = "100%";
                }   

                //차트 Instance에 maxTooltipDistance settings 값 반영 처리.
                this._setChartSettings("width", _propValue);
                return;
            }

            //chart의 대표 dom에 적용할 width 속성값이 존재하지 않는경우 default로 auto 처리.
            //(Sprite의 width property의 defaultValue가 undefined로 되어있기에 width 값이 없는경우
            //chart 대표 dom.style.width에 auto 값으로 설정함.)
            if(typeof _propValue === "undefined"){
                _propValue = "auto";
            }            

            //chart의 대표 DOM에 width STYLE 처리.
            this._setDomStyle("width", _propValue);


            //am5 차트의 root Instance의 resize function 수행.
            //chart의 dom.style.height 값을 변경 할려 해당 function을 통해
            //크기를 재조정 해야함.(그렇지 않을경우 오류 발생.)
            this._chartRootResize();


        },


        /*************************************************************
         * @function - height 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setHeight : function(propValue){

            let _propValue = this._setProperty("height", propValue);


            //chart의 대표 dom에 적용할 height 속성값이 존재하지 않는경우 default로 100% 처리.
            //(Sprite의 height property의 defaultValue가 undefined로 되어있기에 height 값이 없는경우
            //chart 대표 dom.style.height에 auto 값으로 설정함.)
            if(typeof _propValue === "undefined" || _propValue === null || _propValue === ""){
                _propValue = "100%";
            }

            let _oDom = this.getDomRef() || undefined;

            if(typeof _oDom === "undefined"){
                //차트 Instance에 maxTooltipDistance settings 값 반영 처리.
                this._setChartSettings("height", _propValue);
                return;
            }


            //chart의 대표 DOM에 height STYLE 처리.
            this._setDomStyle("height", _propValue);


            //am5 차트의 root Instance의 resize function 수행.
            //chart의 dom.style.height 값을 변경 할려 해당 function을 통해
            //크기를 재조정 해야함.(그렇지 않을경우 오류 발생.)
            this._chartRootResize();


        },


        /*************************************************************
         * @function - setVisible redefine.
         *     visible false 처리시 dom을 제거 하여 불필요한 정보를 제거하기위함.
         *     (setProperty function을 redefine 하여 화면을 다시 그리지 않게
         *      처리 하였기에 setVisible의경우는 redefine 하여 화면을 다시 그리게 처리) 
         *************************************************************/
        setVisible : function(propValue){

            Chart.prototype.setProperty.apply(this, ["visible", propValue, false]);

            let _oDom = this.getDomRef() || undefined;

            if(typeof _oDom === "undefined"){
                //차트 Instance에 maxTooltipDistance settings 값 반영 처리.
                this._setChartSettings("visible", propValue);
                return;
            }
            
            // let _oDom = this.getDomRef() || undefined;

            // ////다른 chart instance에 추가된 건인 경우.
            // if(typeof _oDom === "undefined"){

            //     let _propValue = this._setProperty("visible", propValue);

            //     //차트 Instance에 visible settings 값 반영 처리.
            //     this._setChartSettings("visible", _propValue);
            //     return;
            // }

            // Chart.prototype.setProperty.apply(this, ["visible", propValue, false]);


        },

        /*************************************************************
         * @function - seriesAppearDuration 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setSeriesAppearDuration : function(propValue){

            this._setProperty("seriesAppearDuration", propValue);
            
        }
        
    });

    return _oSerialChart;
    
});