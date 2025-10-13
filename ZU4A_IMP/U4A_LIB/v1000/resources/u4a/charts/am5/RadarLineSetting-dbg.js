sap.ui.define("u4a.charts.am5.RadarLineSetting", [
    "sap/ui/core/Element",
    "u4a/charts/am5/Settings"     
],function(Element, Settings){
    "use strict";
    
    let _oRadarLineSetting = Element.extend("u4a.charts.am5.RadarLineSetting", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 이름.(am5.Series)
                //차트 요소를 식별할 수 있는 이름.
                //(name 속성에 값을 지정한뒤 legendLabelText를 설정하지 않는경우
                //범례 text는 name의 속성값으로 출력된다.)
                name : { type : "string", defaultValue : "" },


                //차트 요소의 꺾은선 색상.(#ffffff)(am5.Series)
                //line Setting에서 설정한 색상은 legend의 lineSetting에 해당하는 색상과 연결된다.
                stroke : { type : "sap.ui.core.CSSColor", defaultValue : "" }

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


            //20250925 PES -START.
            //꺾은선 색상을 지정했을때 legend의 해당 item의 색상과 다르게
            //표현되는 문제가 있기에 lineSetting에서 색상을 설정하여 
            //legend item의 색상을 설정할 수 있도록 로직 보완.
            var _stroke = Settings.prototype._getAm5Color(this.getStroke());

            if(_stroke){
                _sChartProp.stroke = _stroke;

                //tooltip의 색상 변경을 위함.
                _sChartProp.fill = _stroke;
            }
            //20250925 PES -END.


            //am5 차트의 LineSeries 생성.
            let _oLine = am5radar.RadarLineSeries.new(sParams.oChart._oChart.oRoot, _sChartProp);


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

                if(_aChild.length === 0){
                    continue;
                }

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

        },


        /*************************************************************
         * @function - stroke 프로퍼티 값 변경.
         *************************************************************/
        setStroke : function(propValue){

            this.setProperty("stroke", propValue, true);

            if(!this?._oChart?.oChartInstance?.set){
                return;
            }

            var _stroke = Settings.prototype._getAm5Color(propValue);

            //색상이 존재하는경우.
            if(_stroke){
                //꺾은선의 색상 갱신 처리.
                this._oChart.oChartInstance.set("stroke", _stroke);

                //tooltip의 색상 변경을 위함.
                this._oChart.oChartInstance.set('fill', _stroke);
                
                return;
            }

            //색상이 존재하지 않는경우 chart에서 color 속성 정보 얻기.
            var _oColors = this._oChart.oChartInstance?.chart?.get?.('colors');

            if(!_oColors){
                return;
            }

            //다음 색상 코드 얻기.
            var _stroke = _oColors?.next();

            if(!_stroke){
                return;
            }

            this._oChart.oChartInstance.set("stroke", _stroke);

            //tooltip의 색상 변경을 위함.
            this._oChart.oChartInstance.set('fill', _stroke);

        }


    
    });

    return _oRadarLineSetting;
    
});