# @nelts/typeorm

typeorm for nelts

# Usage

`master` `worker` and `agent` is the same. We use `worker` for example:

```bash
npm i @nelts/typeorm
```

in **index.ts**

```ts
import { Context, WorkerPlugin } from '@nelts/nelts';
import { Connection } from 'typeorm';
export interface LocalWorkerPlugin extends WorkerPlugin {
  getConnection(): Connection;
};
export interface LocalContext extends Context<LocalWorkerPlugin> {
  connection: Connection;
};
```

in **app.ts**

```ts
import { LocalContext, LocalWorkerPlugin } from './index';
import { CustomConnectionType, LocalWorkerPlugin as TypeOrmWorkerPlugin } from '@nelts/typeorm';
import Package from './modal/package';
export default (plu: LocalWorkerPlugin) => {
  let id: string;
  plu.on('props', (configs: { mysql: CustomConnectionType }) => {
    const ormComponent = plu.getComponent('@nelts/typeorm') as TypeOrmWorkerPlugin;
    id = ormComponent.typeorm.preset(configs.mysql, [Package]);
  });
  plu.on('ContextStart', (ctx: LocalContext) => {
    ctx.connection = plu.getConnection();
    if (!ctx.connection) throw ctx.error('cannot find the connection');
  });
  plu.getConnection = () => {
    const ormComponent = plu.getComponent('@nelts/typeorm') as TypeOrmWorkerPlugin;
    if (!id) throw new Error('you cannot use getConnection method before recevie configs');
    return ormComponent.typeorm.get(id);
  }
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
