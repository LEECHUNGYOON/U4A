sap.ui.define("u4a.charts.am5.LineSetting", [
    "sap/ui/core/Element"
    
],function(Element){
    "use strict";
    
    let _oLineSetting = Element.extend("u4a.charts.am5.LineSetting", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 이름.(am5.Series)
                //차트 요소를 식별할 수 있는 이름.
                //(name 속성에 값을 지정한뒤 legendLabelText를 설정하지 않는경우
                //범례 text는 name의 속성값으로 출력된다.)
                name : { type : "string", defaultValue : "" }

            }

        }, /* end of metadata */
    
        init : function(){

            this._oChart = {};
    
        }, /* end of init */
    
        renderer : function(oRm, oControl){
    
        }, /* end of renderer */


        /*************************************************************
         * @function - 차트 컬럼 생성 처리.
         *************************************************************/
        _getEventUI : function(oEvent){

            var _sId = oEvent?.target?.dataItem?.dataContext?._sId;

            if(typeof _sId === "undefined"){
                return;
            }

            return sap.ui.getCore().byId(_sId);


        },


        /*************************************************************
         * @function - 막대 Series 정보 생성.
         *************************************************************/
        _createLineSetting : function(sParams){
           
            if(typeof sParams?.oChart?._oChart?.oRoot === "undefined"){
                return;
            }

            if(typeof sParams?.oValueAxis === "undefined"){
                return;
            }

            if(typeof sParams?.oCategoryAxis === "undefined"){
                return;
            }


            let _sChartProp = {};

            //columnSeries의 name 속서 정보 매핑.
            _sChartProp.name = this.getName();
            

            //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
            switch (sParams.oChart.getRotate()) {
                case true:
                    //차트 가로 출력건인경우.
                    _sChartProp.yAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.xAxis = sParams.oValueAxis._oChart.oChartInstance;

                    _sChartProp.valueXField = "value";

                    _sChartProp.categoryYField = "index";

                    break;
            
                default:
                    //차트 세로 출력건인경우.
                    _sChartProp.xAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.yAxis = sParams.oValueAxis._oChart.oChartInstance;

                    _sChartProp.valueYField = "value";

                    _sChartProp.categoryXField = "index";

                    break;
            }


            //am5 차트의 LineSeries 생성.
            let _oLine = am5xy.LineSeries.new(sParams.oChart._oChart.oRoot, _sChartProp);


            this._oChart.oChartInstance = _oLine;

            //라인에 tooltipText 지정.
            _oLine.set("tooltip", am5.Tooltip.new(sParams.oChart._oChart.oRoot, {
                templateField : "tooltipText"
            }));

            _oLine.strokes.template.set("tooltipPosition", "pointer");


            var _sStrokesProp = {};
            _sStrokesProp.templateField = "strokeTemplate";


            _oLine.strokes.template.setAll(_sStrokesProp);


            //bullect 생성 갯수 얻기.
            let _cnt = this._getBulletCount();

            for (let i = 0; i < _cnt; i++) {
                
                _oLine.bullets.push(function(root, series, dataItem){

                    if(typeof dataItem?.dataContext?._bullets === "undefined"){
                        return;
                    }
    
                    if(dataItem?.dataContext?._bullets?.length === 0){
                        return;
                    }
    
                    let _oBullet = dataItem?.dataContext?._bullets[i];
    
                    if(typeof _oBullet?._createBullet === "undefined"){
                        return;
                    }
    
                    let _oAM5Bullet = _oBullet?._createBullet(root);
    
                    return _oAM5Bullet;
    
                });
                
            }

            return _oLine;


        },


        /*************************************************************
         * @function - bullet 생성 갯수 얻기.
         *************************************************************/
        _getBulletCount : function(){

            let _oParent = this.getParent() || undefined;

            if(typeof _oParent === "undefined"){
                return;
            }

            let _oCategory = _oParent.getParent() || undefined;

            if(typeof _oCategory === "undefined"){
                return;
            }

            let _aItems = _oCategory.getCategoryItems();

            if(_aItems.length === 0){
                return;
            }


            let _pos = _oParent.indexOfAggregation("lines", this);

            let _maxCnt = 0;

            for (let i = 0, l = _aItems.length; i < l; i++) {
                
                let _oItem = _aItems[i];

                let _aChild = _oItem.getAggregation("lineItems"); 

                let _oChild = _aChild[_pos];

                if(typeof _oChild === "undefined"){
                    continue;
                }

                let _cnt = _oChild.getBullet().length;

                if(_cnt > _maxCnt){
                    _maxCnt = _cnt;
                }
                
            }

            return _maxCnt;

        }


    
    });

    return _oLineSetting;
    
});