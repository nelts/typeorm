import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import TypeOrm from './typeorm';
import { EntitySchema, QueryRunner } from 'typeorm';

export interface IQueryRunner extends QueryRunner {
  begin?(): Promise<any>;
}

// worker interfaces
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
  name: string,
  plu: T, 
  configs: any, 
  Tables: (Function | string | EntitySchema<any>)[]
) {
  const app = plu.app as LocalWorkerFactory<U>;
  const ormComponent = plu.getComponent<LocalWorkerPlugin<U>>('@nelts/typeorm');
  const id = ormComponent.typeorm.preset(configs, Tables);
  const conn = ormComponent.typeorm.get(id);
  app.on('ContextStop', async (ctx: any) => ctx[name] && await ctx[name].release());
  app.on('ContextStart', async (ctx: any) => {
    ctx[name] = conn.createQueryRunner();
    await ctx[name].connect();
    ctx[name].begin = async () => {
      await ctx[name].startTransaction();
      ctx.on('ContextResolve', async () => await ctx[name].commitTransaction());
      ctx.on('ContextReject', async () => await ctx[name].rollbackTransaction());
    }
  });
}