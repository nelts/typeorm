import { Context, WorkerPlugin } from '@nelts/nelts';
import { Connection, EntitySchema } from 'typeorm';
export declare type CustomConnectionType = {
    type: any;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};
export interface LocalWorkerPlugin extends WorkerPlugin {
    preset(options: CustomConnectionType, entities: EntitySchema<any>[]): string;
    getConnection(id: string): Connection;
}
export interface LocalContext extends Context<LocalWorkerPlugin> {
}
