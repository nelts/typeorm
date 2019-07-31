# @nelts/typeorm

typeorm for nelts

# Usage

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
  plu.on('props', (configs: { mysql: CustomConnectionType }) => id = (<TypeOrmWorkerPlugin>plu.getComponent('@nelts/typeorm')).preset(configs.mysql, [Package]));
  plu.on('ContextStart', (ctx: LocalContext) => {
    ctx.connection = plu.getConnection();
    if (!ctx.connection) throw ctx.error('cannot find the connection');
  });
  plu.getConnection = () => {
    if (id) return (<TypeOrmWorkerPlugin>plu.getComponent('@nelts/typeorm')).getConnection(id);
    throw new Error('cannot find the connection');
  }
  plu.on('ContextReject', async (e: Error, ctx: LocalContext) => plu.logger.error('nelts context life status [ContextReject] invoked:', e));
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
