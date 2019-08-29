"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("./typeorm");
exports.TypeOrm = typeorm_1.default;
function AutoBindWorkerORM(name, plu, configs, Tables) {
    const app = plu.app;
    const ormComponent = plu.getComponent('@nelts/typeorm');
    const id = ormComponent.typeorm.preset(configs, Tables);
    const conn = ormComponent.typeorm.get(id);
    app.on('ContextStop', async (ctx) => ctx[name] && await ctx[name].release());
    app.on('ContextStart', async (ctx) => {
        ctx[name] = conn.createQueryRunner();
        await ctx[name].connect();
        ctx[name].begin = async () => {
            await ctx[name].startTransaction();
            ctx.on('ContextResolve', async () => await ctx[name].commitTransaction());
            ctx.on('ContextReject', async () => await ctx[name].rollbackTransaction());
        };
    });
}
exports.AutoBindWorkerORM = AutoBindWorkerORM;
