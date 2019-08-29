import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import TypeOrm from './typeorm';
import { EntitySchema, QueryRunner } from 'typeorm';
import { EventEmitter } from '@nelts/utils';

export interface IQueryRunner extends QueryRunner {
  begin?(): Promise<any>;
}

// worker interfaces
export interface LocalWorkerContext extends EventEmitter {
  mysql: IQueryRunner;
}
export interface LocalWorkerPlugin<T extends WorkerServiceFrameworker> extends WorkerPlugin<T> {
  typeorm: TypeOrm,
}
export interface LocalWorkerFactory<T extends WorkerServiceFrameworker> extends WorkerFactory<T> {}

// agent interfaces
export interface LocalAgentPlugin extends AgentPlugin {
  typeorm: TypeOrm,
}
export interface LocalAgentFactory extends AgentFactory {}

// master interfaces
export interface LocalMasterFactory extends MasterFactory {}
export interface LocalMasterPlugin extends MasterPlugin {
  typeorm: TypeOrm,
}

export type CustomConnectionType = {
  type: any,
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
}

export {
  TypeOrm,
}

export function AutoBindWorkerORM<T extends LocalWorkerPlugin<U>, U extends WorkerServiceFrameworker>(
  plu: T, 
  configs: any, 
  Tables: (Function | string | EntitySchema<any>)[]
) {
  const app = plu.app as LocalWorkerFactory<U>;
  const ormComponent = plu.getComponent<LocalWorkerPlugin<U>>('@nelts/typeorm');
  const id = ormComponent.typeorm.preset(configs.mysql, Tables);
  const conn = ormComponent.typeorm.get(id);
  app.on('ContextStop', async (ctx: LocalWorkerContext) => await ctx.mysql.release());
  app.on('ContextStart', async (ctx: LocalWorkerContext) => {
    ctx.mysql = conn.createQueryRunner();
    await ctx.mysql.connect();
    ctx.mysql.begin = async () => {
      await ctx.mysql.startTransaction();
      ctx.on('ContextResolve', async () => await ctx.mysql.commitTransaction());
      ctx.on('ContextReject', async () => await ctx.mysql.rollbackTransaction());
    }
  });
}