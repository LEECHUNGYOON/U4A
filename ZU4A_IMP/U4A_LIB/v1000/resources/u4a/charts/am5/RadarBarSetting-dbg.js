sap.ui.define("u4a.charts.am5.RadarBarSetting", [
    "sap/ui/core/Element"
    
],function(Element){
    "use strict";
    
    let _oRadarBarSetting = Element.extend("u4a.charts.am5.RadarBarSetting", {
        metadata : {
            library : "u4a.charts.am5",
            properties : {

                //차트 요소의 이름.(am5.Series)
                //차트 요소를 식별할 수 있는 이름.
                //(name 속성에 값을 지정한뒤 legendLabelText를 설정하지 않는경우
                //범례 text는 name의 속성값으로 출력된다.)
                name : { type : "string", defaultValue : "" },


                //차트를 누적으로 구성할지 정보.
                //true로 설정할 경우 이전 막대에 현재 막대를 누적으로 구성한다.
                stacked : { type : "boolean", defaultValue : false }

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
        _createBarSetting : function(sParams){

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

            //차트를 누적으로 구성할지 정보.
            _sChartProp.stacked = this.getStacked();
            

            //차트 가로/세로 출력여부에 따른 컬럼 속성 정보 구성.
            switch (sParams.oChart.getRotate()) {
                case true:
                    //차트 가로 출력건인경우.
                    _sChartProp.yAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.xAxis = sParams.oValueAxis._oChart.oChartInstance;

                    //값 출력 필드명 구성.
                    _sChartProp.valueXField     = "value";

                    if(_sChartProp.stacked === false){
                        _sChartProp.openValueXField = "openValue";
                        _sChartProp.lowValueXField  = "lowValue";
                        _sChartProp.highValueXField = "highValue";
                    }
                    
                    _sChartProp.categoryYField  = "index";

                    break;
            
                default:
                    //차트 세로 출력건인경우.
                    _sChartProp.xAxis = sParams.oCategoryAxis._oChart.oChartInstance;
                    
                    _sChartProp.yAxis = sParams.oValueAxis._oChart.oChartInstance;

                    //값 출력 필드명 구성.
                    _sChartProp.valueYField     = "value";

                    if(_sChartProp.stacked === false){
                        _sChartProp.openValueYField = "openValue";
                        _sChartProp.lowValueYField  = "lowValue";
                        _sChartProp.highValueYField = "highValue";
                    }
                    _sChartProp.categoryXField  = "index";

                    break;
            }


            //am5 차트의 columnSeries 생성.
            var _oColumn = am5radar.RadarColumnSeries.new(sParams.oChart._oChart.oRoot, _sChartProp);


            this._oChart.oChartInstance = _oColumn;


            //컬럼에 tooltipText 지정.
            _oColumn.set("tooltip", am5.Tooltip.new(sParams.oChart._oChart.oRoot, {
                templateField : "tooltipText"
            }));

            _oColumn.columns.template.set("tooltipPosition", "pointer");


            //columnSeries click 이벤트 등록.
            _oColumn.columns.template.events.on("click", function(oEvent) {

                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            //columnSeries dblclick 이벤트 등록.
            _oColumn.columns.template.events.on("dblclick", function(oEvent) {
                
                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            //columnSeries rightclick 이벤트 등록.
            _oColumn.columns.template.events.on("rightclick", function(oEvent) {
                
                let _oColumn = this._getEventUI(oEvent);

                if(typeof _oColumn === "undefined"){
                    return;
                }

                _oColumn._fireEvent(oEvent);

            }.bind(this));


            var _sStrokesProp = {};
            _sStrokesProp.templateField = "columnTemplate";

            _oColumn.columns.template.setAll(_sStrokesProp);


            //bullect 생성 갯수 얻기.
            let _cnt = this._getBulletCount();

            for (let i = 0; i < _cnt; i++) {
                
                _oColumn.bullets.push(function(root, series, dataItem){

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

            return _oColumn;

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


            let _pos = _oParent.indexOfAggregation("bars", this);

            let _maxCnt = 0;

            for (let i = 0, l = _aItems.length; i < l; i++) {
                
                let _oItem = _aItems[i];

                let _aChild = _oItem.getAggregation("barItems"); 

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

        }
    
    });

    return _oRadarBarSetting;
    
});