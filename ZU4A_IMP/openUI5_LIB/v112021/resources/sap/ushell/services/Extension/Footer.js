// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Container"],function(r){"use strict";class e{#r=r.getRendererInternal();#e=null;constructor(r){this.#e=r}async getControl(){return this.#e}async destroy(){this.#r.removeFooterById(this.#e.getId())}}return e});
//# sourceMappingURL=Footer.js.map