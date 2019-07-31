"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const crypto = require("crypto");
exports.default = (plu) => {
    const connections = new Map();
    plu.preset = (options, entities = []) => {
        const id = md5(`${options.type}://${options.username}:${options.password}@${options.host === 'localhost' ? '127.0.0.1' : options.host}:${options.port}/${options.database}`);
        if (!connections.has(id))
            connections.set(id, { options, entities: [], connection: null });
        const value = connections.get(id);
        for (let i = 0; i < entities.length; i++) {
            const index = value.entities.indexOf(entities[i]);
            if (index === -1)
                value.entities.push(entities[i]);
        }
        connections.set(id, value);
        return id;
    };
    plu.getConnection = (id) => {
        if (!connections.has(id))
            throw new Error('cannot find the connection by id:' + id);
        const schema = connections.get(id);
        if (!schema || !schema.connection)
            throw new Error('database has not been init, please try later.');
        return schema.connection;
    };
    plu.on('ServerStarted', async () => {
        const keys = connections.keys();
        for (const key of keys) {
            const schema = connections.get(key);
            const conn = await typeorm_1.createConnection({
                type: schema.options.type,
                host: schema.options.host,
                port: schema.options.port,
                username: schema.options.username,
                password: schema.options.password,
                database: schema.options.database,
                entities: schema.entities,
                synchronize: true,
                logging: true,
                logger: 'advanced-console',
                loggerLevel: 'debug',
            });
            schema.connection = conn;
            connections.set(key, schema);
        }
    });
};
function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str, 'utf8');
    return hash.digest('hex');
}
