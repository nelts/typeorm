# @nelts/typeorm

基于[ts:typeorm](https://www.npmjs.com/package/typeorm)的nelts插件。

# Usage

```bash
npm i @nelts/typeorm
```

# Example

我们需要在`package.json`上写入依赖：

```json
{
  "plugin": {
    "@nelts/typeorm": {
      "enable": true,
      "runAt": [
        "master",
        "worker",
        "agent"
      ]
    }
  }
}
```

我们需要定义一些全局type或者interface类型[src/index.ts]

```ts
import { Connection } from 'typeorm';
import { 
  LocalAgentFactory as OrmLocalAgentFactory, 
  LocalMasterFactory as OrmLocalMasterFactory, 
  LocalAgentPlugin as OrmLocalAgentPlugin, 
  LocalMasterPlugin as OrmLocalMasterPlugin, 
  LocalWorkerContext as OrmLocalWorkerContext, 
  LocalWorkerFactory as OrmLocalWorkerFactory, 
  LocalWorkerPlugin as OrmLocalWorkerPlugin,
} from '@nelts/typeorm';

import Package from './modal/package';

// worker interfaces
export interface LocalWorkerContext extends OrmLocalWorkerContext {
  conn: Connection;
}
export interface LocalWorkerPlugin extends OrmLocalWorkerPlugin {
  getConnection(id: string): Connection;
}
export interface LocalWorkerFactory extends OrmLocalWorkerFactory {}

// agent interfaces
export interface LocalAgentPlugin extends OrmLocalAgentPlugin {}
export interface LocalAgentFactory extends OrmLocalAgentFactory {
  conn: Connection,
}

// master interfaces
export interface LocalMasterFactory extends OrmLocalMasterFactory {}
export interface LocalMasterPlugin extends OrmLocalMasterPlugin {}

export const Modals = [Package];
```

在master进程上，需要预设置数据库信息用来初始化数据库 [src/master.ts]

```ts
import { LocalMasterPlugin, Modals } from './index';

export default (plu: LocalMasterPlugin) => {
  plu.on('props', async configs => {
    const ormComponent = plu.getComponent<LocalMasterPlugin>('@nelts/typeorm');
    ormComponent.typeorm.preset(configs.mysql, Modals);
  });
}
```

在agent进程上，我们需要设置conn对象获取方式

```ts
import { LocalAgentPlugin, Modals, LocalAgentFactory } from './index';

export default (plu: LocalAgentPlugin) => {
  let id: string;
  plu.on('props', async configs => {
    const ormComponent = plu.getComponent<LocalAgentPlugin>('@nelts/typeorm');
    id = ormComponent.typeorm.preset(configs.mysql, Modals);
  });
  plu.on('ServerStarted', async () => {
    const app = plu.app as LocalAgentFactory;
    const ormComponent = plu.getComponent<LocalAgentPlugin>('@nelts/typeorm');
    if (!id) throw new Error('you cannot use getConnection method before recevie configs');
    app.conn = ormComponent.typeorm.get(id);
  })
}
```

在worker进程上，我们需要对Context对象进程设置 [src/worker.ts]

```ts
import { LocalWorkerPlugin, Modals, LocalWorkerContext } from './index';

export default (plu: LocalWorkerPlugin) => {
  let id: string;
  plu.on('props', async configs => {
    const ormComponent = plu.getComponent<LocalWorkerPlugin>('@nelts/typeorm');
    id = ormComponent.typeorm.preset(configs.mysql, Modals);
  });
  plu.app.on('ContextStart', async (ctx: LocalWorkerContext) => ctx.conn = plu.getConnection(id));
  plu.getConnection = (id: string) => {
    if (!id) throw new Error('you cannot use getConnection method before recevie configs');
    const ormComponent = plu.getComponent<LocalWorkerPlugin>('@nelts/typeorm');
    return ormComponent.typeorm.get(id);
  }
}
```

至此，全部设置完成。当服务启动后，首先会在master进程上初始化数据库，然后在agent和worker进程上获取到对象的conn对象。我们可以在Controller层上这样使用

```ts
import { Controller, Prefix, Get } from '@nelts/http';
import { LocalWorkerContext, LocalWorkerPlugin } from '../index';
import Package from '../modal/package';

@Prefix()
export default class IndexController extends Controller<LocalWorkerPlugin> {
  @Get()
  async Home(ctx: LocalWorkerContext) {
    const packageRepo = ctx.conn.getRepository(Package);
    ctx.body = await packageRepo.find();
  }
}
```

在agent进程上可以这样使用：

```ts
import { AgentComponent, AgentComponentImplements, Ipc, Auto } from '@nelts/agent';

@Auto
export default class IndexAgent extends AgentComponent implements AgentComponentImplements {
  @Ipc(true)
  async test() {
    const packageRepo = this.app.conn.getRepository(Package);
    return await packageRepo.find();
  }
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
