// Copyright 2017. INFOCG Inc. all rights reserved.
/**
 * @since   2025-11-20 10:53:47
 * @version v3.5.6-16
 * @author  soccerhs
 * @description
 * 
 * 기본 sap.ui.core.CustomData는 writeToDom 사용 시 DOM Attribute 이름에
 * 자동으로 'data-*' prefix를 강제 부여한다.
 *
 * 본 클래스는 해당 prefix 강제를 제거하기 위해 확장된 CustomData 구현이다.
 * writeToDom: true 로 설정하면 개발자가 지정한 key 그대로 DOM Attribute로 출력된다.
 * 
 */
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