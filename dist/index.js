"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("./typeorm");
exports.TypeOrm = typeorm_1.default;
function AutoBindWorkerORM(plu, configs, Tables) {
    const app = plu.app;
    const ormComponent = plu.getComponent('@nelts/typeorm');
    const id = ormComponent.typeorm.preset(configs.mysql, Tables);
    const conn = ormComponent.typeorm.get(id);
    app.on('ContextStop', async (ctx) => await ctx.mysql.release());
    app.on('ContextStart', async (ctx) => {
        ctx.mysql = conn.createQueryRunner();
        await ctx.mysql.connect();
        ctx.mysql.begin = async () => {
            await ctx.mysql.startTransaction();
            ctx.on('ContextResolve', async () => await ctx.mysql.commitTransaction());
            ctx.on('ContextReject', async () => await ctx.mysql.rollbackTransaction());
        };
    });
}
exports.AutoBindWorkerORM = AutoBindWorkerORM;
