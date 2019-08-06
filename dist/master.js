"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("./typeorm");
exports.default = (plu) => {
    plu.typeorm = new typeorm_1.default();
    plu.app.on('ServerStarted', async () => await plu.typeorm.init(true));
};
