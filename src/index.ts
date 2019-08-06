import WorkerFactory, { WorkerPlugin } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import Http, { Context } from '@nelts/http';
import TypeOrm from './typeorm';

// worker interfaces
export interface LocalWorkerContext extends Context {}
export interface LocalWorkerPlugin extends WorkerPlugin<Http> {
  typeorm: TypeOrm,
}
export interface LocalWorkerFactory extends WorkerFactory<Http> {}

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