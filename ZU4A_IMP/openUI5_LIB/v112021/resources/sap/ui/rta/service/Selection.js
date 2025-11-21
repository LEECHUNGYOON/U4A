/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";return function(e,t){var n=e._oDesignTime.getSelectionManager();function r(e){return e.map(function(e){return e.getElement().getId()})}n.attachEvent("change",function(e){t("change",r(e.getParameter("selection")))});return{events:["change"],exports:{get(){return r(n.get())},set:n.set.bind(n),add:n.add.bind(n),remove:n.remove.bind(n),reset:n.reset.bind(n)}}}});
//# sourceMappingURL=Selection.js.map