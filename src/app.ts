import { createConnection, Connection, EntitySchema } from 'typeorm';
import { LocalWorkerPlugin, CustomConnectionType } from './index';
import * as crypto from 'crypto';

export default (plu: LocalWorkerPlugin) => {
  const connections: Map<string, {
    options: CustomConnectionType,
    entities: (Function | string | EntitySchema<any>)[],
    connection: Connection,
  }> = new Map();
  // plu.on('props', async configs => plu.logger.debug('nelts props received:', configs));
  // plu.on('ServerStarted', async () => plu.logger.debug('nelts life [ServerStarted] invoked.'));
  // plu.on('ServerStopping', async () => plu.logger.debug('nelts life [ServerStopping] invoked.'));
  // plu.on('ServerStopped', async () => plu.logger.debug('nelts life [ServerStopped] invoked.'));
  // plu.on('ContextStart', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextStart] invoked.'));
  // plu.on('ContextStaticValidator', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextStaticValidator] invoked.'));
  // plu.on('ContextStaticFilter', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextStaticFilter] invoked.'));
  // plu.on('ContextDynamicLoader', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextDynamicLoader] invoked.'));
  // plu.on('ContextDynamicValidator', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextDynamicValidator] invoked.'));
  // plu.on('ContextDynamicFilter', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextDynamicFilter] invoked.'));
  // plu.on('ContextGuard', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextGuard] invoked.'));
  // plu.on('ContextMiddleware', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextMiddleware] invoked.'));
  // plu.on('ContextRuntime', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextRuntime] invoked.'));
  // plu.on('ContextResponse', async (ctx: LocalContext) => plu.logger.debug('nelts context life [ContextResponse] invoked.'));
  // plu.on('ContextResolve', async (ctx: LocalContext) => plu.logger.debug('nelts context life status [ContextResolve] invoked.'));
  // plu.on('ContextReject', async (e: Error, ctx: LocalContext) => plu.logger.debug('nelts context life status [ContextReject] invoked.'));
  plu.preset = (options, entities = []) => {
    const id = md5(`${options.type}://${options.username}:${options.password}@${options.host === 'localhost' ? '127.0.0.1' : options.host}:${options.port}/${options.database}`);
    if (!connections.has(id)) connections.set(id, { options, entities: [], connection: null });
    const value = connections.get(id);
    for (let i = 0; i < entities.length; i++) {
      const index = value.entities.indexOf(entities[i]);
      if (index === -1) value.entities.push(entities[i]);
    }
    connections.set(id, value);
    return id;
  }

  plu.getConnection = (id: string) => {
    if (!connections.has(id)) throw new Error('cannot find the connection by id:' + id);
    const schema = connections.get(id);
    if (!schema || !schema.connection) throw new Error('database has not been init, please try later.');
    return schema.connection;
  }

  plu.on('ServerStarted', async () => {
    const keys = connections.keys();
    for (const key of keys) {
      const schema = connections.get(key);
      const conn = await createConnection({
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
}

function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str, 'utf8');
  return hash.digest('hex');
}