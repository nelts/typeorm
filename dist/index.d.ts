import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import TypeOrm from './typeorm';
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
