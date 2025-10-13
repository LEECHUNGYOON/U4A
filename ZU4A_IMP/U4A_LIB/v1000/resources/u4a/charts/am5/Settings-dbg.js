sap.ui.define("u4a.charts.am5.Settings", [
    "sap/ui/core/Control"
    
],function(Control){
    "use strict";

    //색상명에 따른 색상 코드값.
    const C_COLOR_NAMES = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };
    


    let _oSettings = Control.extend("u4a.charts.am5.Settings", {
        metadata : {
            library : "u4a.charts.am5"

        }, /* end of metadata */

        init : function(){
            
            //am5 차트 수집 object.
            this._oChart = {};

            //am5 차트 라이선스키.
            // this.licenceKey = "QU01QzMyMjk1ODUxMw==";
            this.licenceKey = "QU01Qy03OTIyLTg2MzEtNDM2Mi03MjM3";

            this.mapLicenceKey = "QU01TS0zOTIxLTU3MzAtMzU0MS01MTMx";

        }, /* end of init */

        renderer : function(oRm, oControl){

        }, /* end of renderer */

        exit : function(){

            //am5의 차트 Instance 제거.
            this._disposeChartInstance();


            //am5 차트정보 수집 object 초기화.
            this._oChart = {};


        }, /* end of exit */


        /*************************************************************
         * @function - am5의 차트 Instance 제거.
         *************************************************************/
        _disposeChartInstance : function(){

            if(typeof this._oChart?.oChartInstance === "undefined"){
                return;
            }

            //차트 Instance 제거 처리.
            this._oChart.oChartInstance.dispose();

        },


        /*************************************************************
         * @function - 입력한 색상에 따른 am5의 color 정보 return.
         *************************************************************/
        _getAm5Color : function(value){

            //color 색상 입력값이 없는경우 exit.
            //am5.color("");, am5.color(null);, am5.color("");
            //처리시 오류가 발생됨.
            //undefined된 값으로 am5 차트에 값을 설정하여 default 색상 처리함.
            //am5.Label의 경우는 am5.Label.set('stroke', undefined);
            //처리시 이전 색상으로 돌아가지 않기 때문에 테마에 적용된 default 색상값으로 적용해야한다.
            //am5.ValueAxis의 경우 am5.ValueAxis.get('renderer').set('stroke', undefined);
            //처리시 색상 자체가 아에 사라지기 때문에 테마에 적용된 default 색상값으로 적용해야한다.
            if(typeof value === "undefined" || value === null || value === ""){
                return value;
            }

            //am5 차트가 로드되지 않은경우 입력값 return.
            if(typeof window?.am5?.color === "undefined"){
                return value;
            }

            //입력값이 색상명인경우.
            if(typeof C_COLOR_NAMES[value] !== "undefined"){
                return am5.color(C_COLOR_NAMES[value]);
            }

            //입력한 색상을 am5 color로 return 처리.
            return am5.color(value);


        },


        /*************************************************************
         * @function - css size 입력값 변환 처리.
         *************************************************************/
        _convAm5CssSize : function(value){

            if(typeof value === "undefined"){
                return value;
            }

            let _value = String(value).toLowerCase();

            //숫자, ., -를 제거 처리.
            //(100px 에서 100을 제거)
            let _unit = _value.replace(/[0-9.-]/g, "");

            //단위를 제거 처리.
            //(100px 에서 px를 제거)
            _value = Number(_value.replace(/[^0-9.-]/g, "")) || 0;

            const rootFontSize = parseFloat(getComputedStyle(document?.documentElement)?.fontSize) || 16;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            //입력 unit에 따른 로직 분기.
            switch (_unit) {
                case "rem": //rem입력시 
                    return _value * rootFontSize;

                case "em":
                    return _value * rootFontSize; // 기본적으로 부모 폰트 크기 적용

                case "vw":
                    return (_value * viewportWidth) / 100;

                case "vh":
                    return (_value * viewportHeight) / 100;

                case "pt":
                    return _value * 1.3333;

                case "cm":
                    return _value * 37.8;

                case "mm":
                    return _value * 3.78;

                case "in":
                    return _value * 96;

                case "px":
                    return _value;

                case "%":

                    //am5 차트가 로드되지 않은경우 입력값 return.
                    if(typeof window?.am5?.percent === "undefined"){
                        return value;
                    }

                    return am5.percent(_value);

                default:
                    return _value;
            }


        },


        /*************************************************************
         * @function - 프로퍼티 값 매핑 처리.
         *************************************************************/
        _setProperty : function(propName, propValue){
            
            //프로퍼티 입력값 점검.
            let _propValue = this.validateProperty(propName, propValue);
            
            //프로퍼티 값 세팅.
            this.setProperty(propName, _propValue, true);
            
            return _propValue;
            
        },


        /*************************************************************
         * @function - am5 차트가 허용하는 프로퍼티값 return.
         *************************************************************/
        _getAM5Property : function(propertyName){

            //프로퍼티명에 해당하는 입력값 얻기.
            let _val = this.getProperty(propertyName);


            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            return this._convAM5Property(propertyName, _val);


        },
        
        /*************************************************************
         * @function - am5 차트가 허용하는 프로퍼티값으로 변환 처리.
         *************************************************************/
        _convAM5Property : function(propertyName, value){

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return value;
            }

            let _oProp = _oMeta.getProperty(propertyName);

            if(typeof _oProp === "undefined"){
                return value;
            }

            //프로퍼티 타입에 따른 conversion 처리.
            switch (_oProp.type) {
                case "sap.ui.core.CSSColor":
                    
                    //입력한 프로퍼티의 타입이 색상에 관련된경우.
                    //am5의 색상 정보를 구성 처리.
                    return this._getAm5Color(value);

                case "sap.ui.core.CSSSize":
                case "sap.ui.core.Percentage":
                    
                    //width, height와 같이 size에 관련된 프로퍼티인경우
                    return this._convAm5CssSize(value);
            
                default:
                    return value;
            }


        },


        /*************************************************************
         * @function - 차트 Instance에 settings 값 반영 처리.
         *************************************************************/
        _setChartSettings : function(name, value){

            if(typeof this?._oChart?.oChartInstance === "undefined"){
                this._updateChartData();
                return;
            }

            //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
            let _val = this._convAM5Property(name, value);


            //차트의 setting값 반영 처리.
            this._oChart.oChartInstance.set(name, _val);


            if(typeof this._oChart.oChartInstance.markDirtySize === "function"){
                //반영된 값을 즉시 적용 처리.
                this._oChart.oChartInstance.markDirtySize();
                return;
            }

            this._oChart.oChartInstance.markDirty();


        },
        

        /*************************************************************
         * @function - 차트 데이터 갱신 처리.
         *************************************************************/
        _updateChartData : function(){
            
            let _oSeriesX = this.getParent() || undefined;

            if(typeof _oSeriesX === "undefined"){
                return;
            }

            //20250926 PES -START.
            //바인딩을 통해 그려진 UI에 대해 DATA를 갱신가 안되는 문제가 있기에 해당 로직 주석 처리.
            // if(typeof this.getBindingContext() !== "undefined"){
            //     return;
            // }
            //20250926 PES -END.

            if(typeof _oSeriesX?._oChart?.aData !== "undefined"){
                
                _oSeriesX._getChartData();

                _oSeriesX._oChart.oChartInstance.data.setAll([]);
                _oSeriesX._oChart.oChartInstance.data.setAll(_oSeriesX._oChart.aData);


                return;

            }

            var _oCategory = _oSeriesX.getParent() || undefined;

            if(typeof _oCategory?._getChartData === "undefined"){
                return;
            }

            //categoryAxis의 am5 ChartInstance가 존재하지 않는경우 exit.
            if(typeof _oCategory?._oChart?.oChartInstance === "undefined"){
                return;
            }


            //category의 하위 UI를 통해 차트 출력 데이터 수집 처리.
            _oCategory._getChartData();


            //현재 UI가 SeriesX aggregation의 몇번째인지 확인.
            //(columnSeries, lineSeries 가 몇번째에 해당하는건인지를 확인)
            let _pos = _oSeriesX.indexOfAggregation(this.sParentAggregationName, this);

            //columnSeries, lineSeries UI가 아닌경우 categoryAxis의 데이터를 갱신 처리.
            //(labels, grid 의 경우에 해당함.)
            if(_pos < 0){
                _oCategory._oChart.oChartInstance.data.setAll(_oCategory._oChart.aData);
                return;
            }


            let _oSeries = _oCategory._oChart[this._chartName][_pos];

            if(typeof _oSeries === "undefined"){
                return;
            }
            
            _oSeries.data.setAll([]);

            var _chartName = this._chartName + _pos;


            //series에 해당하는 chart 데이터 구성.
            let _aChartData = _oCategory._oChart.aData.map(function(sData, indx){

                let _sData = sData[_chartName] || {};

                _sData.index = indx;

                return _sData;

            });

            
            //radarLineSeries의 경우 차트의 시작과 끝을 연결하기 위한 데이터 매핑 처리.
            //차트의 데이터가 최소 3건이 있어야 시작과 끝을 연결 처리함.
            //(2건이 있다면 하나의 선이 구성됨)
            if(_oSeries?.className === "RadarLineSeries" && _aChartData.length >= 3){
                // _aChartData.push(JSON.parse(JSON.stringify(_aChartData[0])));
                _aChartData.push(jQuery.extend(true, _aChartData[0]));

            }

            //column index에 해당하는 데이터를 매핑 처리.
            _oSeries.data.setAll(_aChartData);


        },
        

        /*************************************************************
         * @function - 차트 요소의 속성정보 얻기.
         *************************************************************/
        _getChartProperies : function(aExcludeProp = []){

            let _sChartProp = {};

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return _sChartProp;
            }

            let _oProperties = _oMeta.getAllProperties();

            if(typeof _oProperties === "undefined"){
                return _sChartProp;
            }


            //프로퍼티에 설정된 값을 차트 속성 정보로 수집 처리.
            for (const key in _oProperties) {

                //수집 제외 대상 속성 정보에 해당하는건인경우 skip.
                if(aExcludeProp.indexOf(key) !== -1){
                    continue;
                }
                
                let _oProp = _oProperties[key];

                //프로퍼티의 입력값 얻기.
                let _val = this.getProperty(key);

                //프로퍼티가 default 값과 같은건인경우 수집 생략 처리.
                if(_val === _oProp.getDefaultValue()){
                    continue;
                }

                var _oParent = _oProp?._oParent || undefined;

                if(typeof _oParent?.getName === "undefined"){
                    continue;
                }

                //프로퍼티가 sap.ui.core.Control건인경우 수집 생략.
                if(_oParent.getName() === "sap.ui.core.Control"){
                    continue;
                }

                //프로퍼티명 : 값 형식으로 차트 속성 정보를 수집 처리.
                //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
                _sChartProp[key] = this._convAM5Property(key, _val);

            }

            return _sChartProp;

        },


        /*************************************************************
         * @function - 차트 요소의 예외처리 대상 프로파티의 속성정보 얻기.
         *************************************************************/
        _getChartExcepProperties : function(aExcepProp = []){
            
            let _sChartProp = {};

            if(aExcepProp.length === 0){
                return _sChartProp;
            }

            let _oMeta = this.getMetadata();

            if(typeof _oMeta === "undefined"){
                return _sChartProp;
            }


            for (let i = 0, l = aExcepProp.length; i < l; i++) {
                
                var _excepProp = aExcepProp[i];

                let _oProp = _oMeta.getProperty(_excepProp);

                if(typeof _oProp === "undefined"){
                    continue;
                }

                //프로퍼티의 입력값 얻기.
                var _val = this.getProperty(_excepProp);

                //프로퍼티가 default 값과 같은건인경우 수집 생략 처리.
                if(_val === _oProp.getDefaultValue()){
                    continue;
                }

                //프로퍼티명 : 값 형식으로 차트 속성 정보를 수집 처리.
                //am5 차트가 허용하는 프로퍼티값으로 변환 처리.
                _sChartProp[_excepProp] = this._convAM5Property(_excepProp, _val);
                
            }

            return _sChartProp;


        },
        

        /*************************************************************
         * @function - setProperty function 재정의.
         *************************************************************/
        setProperty : function(propName, propValue, bSuppressInvalidate = true){

            //sap.ui.core.Control의 setProperty 호출(화면을 갱신 처리 하지 않게 호출함).
            Control.prototype.setProperty.apply(this, [propName, propValue, bSuppressInvalidate]);
            
        },


        /*************************************************************
         * @function - setParent function redefine.
         *      부모 UI 변경시 부모 Instance가 없는경우(부모로부터 현재 UI가 제거된경우)
         *      차트 Instance를 제거 처리
         *************************************************************/
        setParent: function(oParent){

            //기존 setParent function 수행.
            Control.prototype.setParent.apply(this, arguments);

            //부모 Instance가 존재하지 않는경우 Chart 제거 처리.
            if(oParent === null){
                this._disposeChartInstance();
            }

        }        
        
    });

    return _oSettings;
    
});