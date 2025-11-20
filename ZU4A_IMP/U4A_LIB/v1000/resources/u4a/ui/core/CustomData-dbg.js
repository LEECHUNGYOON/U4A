// Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.ui.core.CustomData", [
    "sap/ui/core/CustomData"
], function (CustomData) {
    "use strict";

    const oCustomData = CustomData.extend("u4a.ui.core.CustomData", {

        metadata: {
            library: "u4a.ui.core",
        },

        /**
         * CustomData로 UI Dom에 속성 넣기         
         */
        _checkWriteToDom: function(){            
            
            if (!this.getWriteToDom()) {
                return null;
            }

            var key = this.getKey();
		    var value = this.getValue();

            // value가 function일 경우는 허용 안함.
            if(typeof value === "function"){
                return null;
            }

            // value가 Object 타입일 경우 stringify 처리
            if(typeof value === "object"){
                value = JSON.stringify(value);
            }

            return { key: key, value: value };

        }

    });

    return oCustomData;

});