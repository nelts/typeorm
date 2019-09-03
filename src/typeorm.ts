import * as crypto from 'crypto';
import { CustomConnectionType } from './index';
import { createConnection, Connection, EntitySchema } from 'typeorm';

type connections = Map<string, {
  options: CustomConnectionType,
  entities: (Function | string | EntitySchema<any>)[],
  connection: Connection,
}>;

export default class TypeOrm {
  private _connections: connections = new Map();

  preset(options: CustomConnectionType, entities: (Function | string | EntitySchema<any>)[]) {
    const id = md5(`${options.type}://${options.username}:${options.password}@${options.host === 'localhost' ? '127.0.0.1' : options.host}:${options.port}/${options.database}`);
    if (!this._connections.has(id)) this._connections.set(id, { options, entities: [], connection: null });
    const value = this._connections.get(id);
    for (let i = 0; i < entities.length; i++) {
      const index = value.entities.indexOf(entities[i]);
      if (index === -1) value.entities.push(entities[i]);
    }
    this._connections.set(id, value);
    return id;
  }

  get(id: string) {
    if (!this._connections.has(id)) throw new Error('cannot find the connection by id:' + id);
    const schema = this._connections.get(id);
    if (!schema || !schema.connection) throw new Error('database has not been init, please try later.');
    return schema.connection;
  }

  async init(isMaster?: boolean) {
    const keys = this._connections.keys();
    for (const key of keys) {
      const schema = this._connections.get(key);
      const conn = await createConnection({
        type: schema.options.type,
        host: schema.options.host,
        port: schema.options.port,
        username: schema.options.username,
        password: schema.options.password,
        database: schema.options.database,
        entities: schema.entities,
        synchronize: isMaster ? true : false,
        logging: true,
        logger: 'advanced-console',
        loggerLevel: 'debug',
        charset: 'utf8mb4_unicode_ci'
      });
      schema.connection = conn;
      this._connections.set(key, schema);
      if (isMaster) await conn.close();
    }
  }
}

function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str, 'utf8');
  return hash.digest('hex');
}
