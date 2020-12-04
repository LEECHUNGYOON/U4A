//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.ui.networkgraph.Graph", [
"sap/suite/ui/commons/networkgraph/Graph",
"sap/suite/ui/commons/networkgraph/GraphRenderer"

], function(Graph, GraphRenderer){
    "use strict";

    var oGraph = Graph.extend("u4a.ui.networkgraph.Graph", {
        metadata : {
            library : "u4a.ui.networkgraph",
            properties : {
                showSearchField: { type: "boolean", defaultValue: true },
                showLegend: { type: "boolean", defaultValue: true },
                showZoomToFit: { type: "boolean", defaultValue: true },
                showFullScreen: { type: "boolean", defaultValue: true },
                toolbarLeftAlign : { type: "boolean", defaultValue: false },
                scrollToElement: { type: "string", defaultValue : null },
                zoomLevel : { type: "float", defaultValue: 1 }
            },

            aggregations : {
                "toolbar" : { type : "sap.ui.core.Control", multiple : true, singularName: "toolbar" }
            }
            
        }, // end of metadata

        init : function(){

			if(Graph.prototype.init){
				Graph.prototype.init.apply(this, arguments);
			}

			// 툴바 인스턴스가 있을 경우에만 하위로직 수행
			if(!this._toolbar){
				return;
			}

			// 툴바의 버튼들을 제어하기 위해 인스턴스를 수집한다.
			var oToolbar = this._toolbar,
				aToolbarContents = oToolbar.getContent(),
				iContentLength = aToolbarContents.length;

			if(!iContentLength) {
				return;
			}

			this._toolbarSpacer = aToolbarContents[0];
			this._searchField = aToolbarContents[1];
			this._legend = aToolbarContents[2];
			this._zoomToFit = aToolbarContents[6];
			this._fullScreen = aToolbarContents[7];

        },

        renderer : function(oRm, oControl){

            GraphRenderer.render(oRm, oControl);

        }, // end of renderer

        onAfterRendering : function(){

            if(Graph.prototype.onAfterRendering){
                Graph.prototype.onAfterRendering.apply(this, arguments);
            }

            // 기본 스타일 클래스 적용
            this.addStyleClass("u4aSuiteUiCommonsNetworkGraph");

            // Toolbar의 SearchField Visible/Invisible 처리
            if(this._searchField){
                this._searchField.setVisible(this.getShowSearchField());
            }

            // Toolbar의 Legend Visible/Invisible 처리
            if(this._legend){
                this._legend.setVisible(this.getShowLegend());
            }

            // Toolbar의 ZoomToFit Visible/Invisible 처리
            if(this._zoomToFit){
                this._zoomToFit.setVisible(this.getShowZoomToFit());
            }

            // Toolbar의 FullScreen Visible/Invisible 처리
            if(this._fullScreen){
                this._fullScreen.setVisible(this.getShowFullScreen());
            }

            // Toolbar의 toolbarSpacer Visible/Invisible 처리
            if(this._toolbarSpacer){
                this._toolbarSpacer.setVisible(!this.getToolbarLeftAlign());
            }

            // Toolbar Aggregation의 Content를 붙인다.
            if(this.getAggregation("toolbar")){
                var aToolBar = this.getAggregation("toolbar"),
                    iToolLen = aToolBar.length;

                for(var i = 0; i < iToolLen; i++){
                    this._toolbar.addContent(aToolBar[i]);
                }
            }
            
            this.attachEventOnce("graphReady", function(){
                  
                // Zoom Level 제어
                this.setZoomLevel(this.getZoomLevel());
                
				// 특정 노드에 Focus 해주는 기능
                this.setScrollToElement(this.getScrollToElement());

            });


        }, // end of onAfterRendering
        
        setScrollToElement : function(sKey){
        
            this.setProperty("scrollToElement", sKey, true);
            
            this._setNodeFocus(sKey);            
        
        },
        
        setZoomLevel : function(iLevel){

            this.setProperty("zoomLevel", iLevel, true);
            
            this._setZoomLevel(iLevel);
			
        },	// end of setZoomLevel     
        
        _setNodeFocus : function(sKey){
         
			var oNode = this.getNodeByKey(sKey);
			if(!oNode){
				return;              
			}
					
			this.scrollToElement(oNode);
              
        }, // end of _setNodeFocus
        
        _setZoomLevel : function(iLevel){
            
            if(!this.$svg){
                return;
            }
            
            this.setCurrentZoomLevel(iLevel);
            this.zoom();
            
        } // end of _setZoomLevel

    });

    return oGraph;

});