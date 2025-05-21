sap.ui.define("u4a.charts.am5.PieSeriesLabelStyle", [
    "u4a/charts/am5/Label"
    
],function(Label){
    "use strict";

    //pie Series에 출력될 label의 출력 방향 설정.
    u4a.charts.am5.PieSeriesLabelOrientation = {
        //pie를 기준으로 label text가 정방향으로 출력된다.
        //(pie의 12시에 위치한 text는 정방향 6시에 위치한 text는 역방향으로 출력)
        inward : "inward",

        //pie를 기준으로 label text가 역방향으로 출력된다.
        //(pie의 12시에 위치한 text는 역방향 6시에 위치한 text는 정방향으로 출력)
        outward : "outward",

        //text 위치한 영역에 맞추어 text 출력 방향을 자동으로 설정한다.
        //(pie의 12시에 위치한 text는 정방향 6시에 위치한 text는 정방향으로 출력)
        auto : "auto"

    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.PieSeriesLabelOrientation", u4a.charts.am5.PieSeriesLabelOrientation);


    u4a.charts.am5.PieSeriesLabelTextType = {
        regular : "regular",
        circular : "circular",
        radial : "radial",
        aligned : "aligned",
        adjusted : "adjusted",
    };

    sap.ui.base.DataType.registerEnum("u4a.charts.am5.PieSeriesLabelTextType", u4a.charts.am5.PieSeriesLabelTextType);

    
    let _oPieSeriesLabelStyle = Label.extend("u4a.charts.am5.PieSeriesLabelStyle", {
        metadata : {
            library : "u4a.charts.am5",

            properties : {

                //label이 pie 내부에 출력될지 여부.
                //true로 설정시 label text가 pie 내부에 위치하게 된다.
                //해당 속성은 pieSeries의 alignLabels 속성이 true로 설정될 경우 동작하지 않는다.
                inside : { type : "boolean", defaultValue: false },


                //글자와 글자 사이의 간격.
                //해당 속성을 1로 설정 할경우 출력 text가 "test" -> "t e s t" 와 같이
                //글자 사이에 간격을 두어 출력된다.
                kerning : { type : "int", defaultValue: 0  },

                
                //pie Series에 출력될 label의 출력 방향 설정.
                //해당 속성은 pieSeries의 alignLabels 속성이 true로 설정될 경우 동작하지 않는다.                
                //해당 속성은 orientation이 circular로 설정될 경우에만 동작한다.
                orientation : { type : "u4a.charts.am5.PieSeriesLabelOrientation", defaultValue: "auto" },
                

                //pieSeries와 label간의 간격.
                //해당 속성에 10을 입력할 경우 pieSeries와 10px만큼 간격을 구성한다.
                radius : { type : "int" },


                //text가 pieSeries에 출력되는 형식.
                //해당 속성은 pieSeries의 alignLabels 속성이 true로 설정될 경우 동작하지 않는다.
                textType : { type : "u4a.charts.am5.PieSeriesLabelTextType", defaultValue: "regular" }

            }

    
        }, /* end of metadata */
    
        init : function(){

            Label.prototype.init.apply(this, arguments);
    
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */
        
        exit : function(){
    
            Label.prototype.exit.apply(this, arguments);
    
        }, /* end of exit */


        /*************************************************************
         * @function - 차트 출력 데이터 구성.
         *************************************************************/
        _getChartData : function(){

            let _sChartData = {};

            //라벨의 속성정보 얻기.
            _sChartData = this._getChartProperies();

            _sChartData.visible = this.getVisible();

            //현재 UI의 sid 정보 매핑.
            _sChartData._sId = this.getId();
            
            return _sChartData;

        },


        /*************************************************************
         * @function - sprite에 추가할 am5 차트 Instance 생성.
         *************************************************************/
        _createSprite : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent?._oChart?.oRoot === "undefined"){
                return;
            }


            //bullet에 추가할 속성 정보 얻기.
            let _sChartProp = this._getChartProperies();

            _sChartProp.visible = this.getVisible();

            this._oChart.oChartInstance = am5.Rectangle.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;


        },


        /*************************************************************
         * @function - inside 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInside : function(propValue){

            this._setProperty("inside", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },


        /*************************************************************
         * @function - kerning 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setKerning : function(propValue){

            this._setProperty("kerning", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },


        /*************************************************************
         * @function - orientation 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setOrientation : function(propValue){

            this._setProperty("orientation", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },


        /*************************************************************
         * @function - radius 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setRadius : function(propValue){

            this._setProperty("radius", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        },


        /*************************************************************
         * @function - textType 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setTextType : function(propValue){

            this._setProperty("textType", propValue);


            //차트 데이터 갱신 처리.
            this._updateChartData();


        }
        
    });

    return _oPieSeriesLabelStyle;
    
});