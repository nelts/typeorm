import { CustomConnectionType } from './index';
import { Connection, EntitySchema } from 'typeorm';
export default class TypeOrm {
    private _connections;
    preset(options: CustomConnectionType, entities: (Function | string | EntitySchema<any>)[]): string;
    get(id: string): Connection;
    init(isMaster?: boolean): Promise<void>;
}
