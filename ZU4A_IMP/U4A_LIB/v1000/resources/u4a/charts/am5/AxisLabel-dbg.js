sap.ui.define("u4a.charts.am5.AxisLabel", [
    "u4a/charts/am5/Label"
    
],function(Label){
    "use strict";

    
    let _oAxisLabel = Label.extend("u4a.charts.am5.AxisLabel", {
        metadata : {
            library : "u4a.charts.am5",

            properties : {

                //label이 차트 내부에 출력될지 여부.
                //true로 설정시 label text가 차트 내부에 위치하게 된다.
                inside : { type : "boolean", defaultValue: false },


                //label의 위치 정보.
                //default 0.5인경우 category가 출력되는 cell 영역의 중앙에 category text가 출력된다.
                //0에 가까워질수록 x축과 y축이 만나는 지점에 category text가 출력된다.
                //1에 가까워질수록 category가 출력되는 cell 영역의 오른쪽으로 category text가 출력된다.
                //0보다 작은 값을 입력한 경우 category text가 더 왼쪽으로 이동되며
                //1보다 큰 값을 입력한 경우 category text가 더 오른쪽로 이동된다.
                //(text가 차트 출력 영역을 벗어나게됨)
                location : { type : "float" }

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


            this._oChart.oChartInstance = am5xy.AxisLabel.new(_oParent?._oChart?.oRoot, _sChartProp);


            return this._oChart.oChartInstance;


        },


        /*************************************************************
         * @function - inside 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setInside : function(propValue){

            let _propValue = this._setProperty("inside", propValue);


            //차트 Instance에 inside settings 값 반영 처리.
            this._setChartSettings("inside", _propValue);


        },


        /*************************************************************
         * @function - location 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setLocation : function(propValue){

            let _propValue = this._setProperty("location", propValue);


            //차트 Instance에 location settings 값 반영 처리.
            this._setChartSettings("location", _propValue);


        },


        /*************************************************************
         * @function - fill 프로퍼티 값 설정 function 재정의.
         *************************************************************/
        setFill : function(propValue){
            
            let _propValue = this._setProperty("fill", propValue);

            //fill에 적용된 값이 존재하지 않는경우 default theme에 적용한
            //fill 색상 코드를 매핑.
            //am5.color(""); 처리시 오류가 발생함.
            //am5.color(""); 에서 발생한 오류를 try catch 처리 하여 catch에서 return 처리시 
            //이전 색상이 남아있기에 공백의 색상 정보가 입력된 경우 default 색상 정보를 매핑.
            //(잘못된 색상 코드에 대한 처리를 하지 않음.)
            if(typeof _propValue === "undefined"){
                _propValue = sap.ui.core.theming.Parameters.get("sapTextColor");
            }


            //차트 Instance에 fill settings 값 반영 처리.
            this._setChartSettings("fill", _propValue);

        }
        
    });

    return _oAxisLabel;
    
});