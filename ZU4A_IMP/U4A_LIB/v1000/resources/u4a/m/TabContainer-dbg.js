//Copyright 2017. INFOCG Inc. all rights reserved.

jQuery.sap.require("sap.ui.core.Control");
jQuery.sap.require("sap.m.TabContainer");
jQuery.sap.declare("u4a.m.TabContainer");

sap.m.TabContainer.extend("u4a.m.TabContainer", {
    metadata : {
		library : "u4a.m",
		properties : {
			selectedKey: { type: "string", group: "Data", defaultValue: "" },
		}
	},
	
	_OldItemKeys : [],
	_bisRemoveCalled : false,
	_iKey : null,
	
	constructor : function (vId, mSettings) {

	  var aStashedItems = [];

		// normalize the expected arguments
		if (!mSettings && typeof vId === 'object') {
		  mSettings = vId;
		}

		/* Store the items for later and remove them for the initialization of the control to avoid racing
		 * condition with the initialization of the tab strip. This is only required when the items aggregation
		 * is initialized directly with an array of TabContainer items without data binding and a template. */
		if (mSettings && Array.isArray(mSettings['items'])) {
		  aStashedItems = mSettings['items'];
		  delete mSettings['items'];
		}
		var Control = sap.ui.core.Control;
		Control.prototype.constructor.apply(this, arguments);
		var oControl = new sap.m.TabStrip(this.getId() + "--tabstrip", {
		  hasSelect: true,
		  itemSelect: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
			  oSelectedItem = this._fromTabStripItem(oItem);
			this.setSelectedItem(oSelectedItem, oEvent);
			this.setProperty("selectedKey", oSelectedItem.getKey(), true); // 20190820 로직 수정 by yoon

		  }.bind(this),
		  itemClose: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
			  oRemovedItem = this._fromTabStripItem(oItem);
	
			// prevent the tabstrip from closing the item by default
			oEvent.preventDefault();
			if (this.fireItemClose({item: oRemovedItem})) {
			  this.removeItem(oRemovedItem); // the tabstrip item will also get removed
			 
			}

		  }.bind(this)
		});

		this.setAggregation("_tabStrip", oControl, true);

		if (mSettings && mSettings['showAddNewButton']) {
		  this.setShowAddNewButton(true);
		}

		// re-introduce any existing items from the constructor settings
		aStashedItems.forEach(function (oItem) {
		  this.addItem(oItem);
		}, this);

	},// end of constructor
	
	
	renderer : function(oRm, oControl) {
		"use strict";
		sap.m.TabContainerRenderer.render(oRm, oControl);
	},
	
	removeItem : function(vItem){
		var bIsSelected;

		if (typeof vItem === "undefined" || vItem === null) {
			return null;
		}
		
		// 모델이 삭제 되었다는 flag
		this._bisRemoveCalled = true;
		
		var aItems = this.getItems();
		var iItemLen = aItems.length;
		
		// 삭제 하기전 모든 Item을 수집해 놓는다.
		if(this._OldItemKeys.length == 0){
			for(var i = 0; i < iItemLen; i++){
				var oItem = aItems[i];
				this._OldItemKeys.push(oItem.getProperty("key"));
			}
		}

		// 삭제하려는 Item의 Index 위치를 구한다.
		for(var i = 0; i < iItemLen; i++){
			var oItem = aItems[i];
			var sItemKey = oItem.getKey();
			
			if(this.getSelectedKey() == sItemKey){
				this._iKey = sItemKey;
				break;
			}
		}
		
		//Remove the corresponding TabContainerItem
		vItem = this.removeAggregation("items", vItem);
		// The selection flag of the removed item
		bIsSelected = vItem.getId() === this.getSelectedItem();
		this._getTabStrip().removeItem(this._toTabStripItem(vItem));
		
		// Perform selection switch
		//this._moveToNextItem(bIsSelected);
	
		return vItem;
	},
	
	_getItemIndex : function(aItems, sSelecedKey){
		
		var iItemLen = aItems.length;
		
		for(var i = 0; i < iItemLen; i++){
			var oItem = aItems[i];
			var sItemKey = oItem.getProperty("key");
			
			if(sItemKey == sSelecedKey){
				return i;
			}
		}	
		
		return -1;
			
	},

	onBeforeRendering : function(){
		"use strict";
		
		try {
			// 1. Item이 있는지 확인한다.
			var aItems = this.getItems();
			var iItemLen = aItems.length;
			
			if(iItemLen == 0){
				this.setAssociation("selectedItem", null);
				this.setProperty("selectedKey", "", true);
				return;
			}
			
			// 2. TabContainer의 selectedKey를 구한다.
			var sTabSelectedKey = this.getSelectedKey();
			
			if(sTabSelectedKey == ""){
				this.setProperty("selectedKey", aItems[0].getKey(), true);
				this.setSelectedItem(aItems[0]);
				return;
			}
			
			// 3. 처음 1개의 Item이 추가된 경우
			/*
			if(iItemLen == 1){
				
				// 3-1. selectedKey가 없으면 1번째 아이템을 선택한다.
				if(sTabSelectedKey == ""){
					this.setProperty("selectedKey", aItems[0].getKey(), true);
					this.setSelectedItem(aItems[0]);
					return;
				}
			}
			*/
			
			/**** 4. 삭제 이벤트를 수행하지 않은 경우 (Item 추가인 경우) ****/
			if(this._bisRemoveCalled == false){
				
				/* find()의 속도를 확인해볼것
				var oFoundItem = aItems.find(function(oItem){
					var itemKey = oItem.getKey();
					return (sTabSelectedKey == itemKey)
				});
				
				if(oFoundItem){
					if(oFoundItem.getId() != this.getSelectedItem()){
						this.setSelectedItem(oItem);
					}
				}
				
				return;
				*/
				
				for(var i = 0; i < iItemLen; i++){
					var oItem = aItems[i];
					var sItemKey = oItem.getKey();

					// 4-1. Item에 Key값이 없으면 Skip.
					if(sItemKey == ""){
						return;
					}
					
					// 4-2. SelectedKey와 Item Key가 다르면 Skip.
					if(sTabSelectedKey != sItemKey){
						continue;
					}
					
					/* 	4-3. TabContainer의 Key값과 Item의 Key값은 같지만, 
						현재 선택된 Item의 ID와 선택하려는 아이템의 ID가 다를때만 실행.
						## 예) 기존 선택된 아이템이 1였을 때,
					 	다시 1번 아이템을 선택하면 ItemSelect 이벤트가 발생되지 않게 하기 위해서,
						현재 선택된 아이템과 선택하려는 아이템이 다를때만 setSelectedItem을 수행한다.
					*/
					if(oItem.getId() != this.getSelectedItem()){
						this.setSelectedItem(oItem);
						break;
					}
						
				}// end of for
				
				return;
				
			} // end of if
			
			
			/**** 5. 삭제 이벤트를 수행한 경우 (Item 삭제인 경우) ****/
			
			// 5-1. 선택된 키가 Item에 있는지 여부 확인.
			var iCurItmIdx = this._getItemIndex(aItems, sTabSelectedKey);
			
			// 5-2. 선택된 Item이 삭제된 경우
			if(iCurItmIdx == -1){
				
				var iOldItemLen = this._OldItemKeys.length;
				
				// 5-2-1. 삭제되기 전 Item의 인덱스 위치를 구한다.
				for(var i = 0; i < iOldItemLen; i++){
					if(this._OldItemKeys[i] == this._iKey){
						break;
					}
				}
				
				/* 5-2-2.
				삭제되기 전과 후의 Item을 비교
				삭제되기 전 Item의 인덱스 부터 삭제된 후 Item과의 Key값 비교를 시작.
				*/
				for(var j = i; j < iOldItemLen; j++){
					for(var k = 0; k < iItemLen; k++){
				
						var curItem = aItems[k];
						
						if(this._OldItemKeys[j] == curItem.getProperty("key")){
							this.setSelectedItem(curItem);
							this.setProperty("selectedKey", this._OldItemKeys[j], true);
							return;
						}
					}
				}
				
				// 5-2-2에서 같은 Item이 없으면 삭제 후 Items의 가장 마지막 Item을 선택한다.
				this.setSelectedItem(aItems[iItemLen - 1]);
				this.setProperty("selectedKey", aItems[iItemLen - 1].getProperty("key"), true);
				return;
				
				
			} // end of if
			
			// 6. 선택된 Item이 존재하는 경우
			this.setProperty("selectedKey", aItems[iCurItmIdx].getProperty("key"), true);
			this.setAssociation("selectedItem", aItems[iCurItmIdx], true);
			
		}
		catch(e){
		
		}
		finally {
			
			// 전역변수 초기화
			this._bisRemoveCalled = false;
			this._OldItemKeys = [];
			this._iKey = null;
			
		}
			
	} // end of onBeforeRendering

});