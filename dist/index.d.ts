import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import TypeOrm from './typeorm';
import { EntitySchema, QueryRunner } from 'typeorm';
import { EventEmitter } from '@nelts/utils';
export interface IQueryRunner extends QueryRunner {
    begin?(): Promise<any>;
}
export interface LocalWorkerContext extends EventEmitter {
    mysql: IQueryRunner;
}
export interface LocalWorkerPlugin<T extends WorkerServiceFrameworker> extends WorkerPlugin<T> {
    typeorm: TypeOrm;
}
export interface LocalWorkerFactory<T extends WorkerServiceFrameworker> extends WorkerFactory<T> {
}
export interface LocalAgentPlugin extends AgentPlugin {
    typeorm: TypeOrm;
}
export interface LocalAgentFactory extends AgentFactory {
}
export interface LocalMasterFactory extends MasterFactory {
}
export interface LocalMasterPlugin extends MasterPlugin {
    typeorm: TypeOrm;
}
export declare type CustomConnectionType = {
    type: any;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};
export { TypeOrm, };
export declare function AutoBindWorkerORM<T extends LocalWorkerPlugin<U>, U extends WorkerServiceFrameworker>(plu: T, configs: any, Tables: (Function | string | EntitySchema<any>)[]): void;
