# @nelts/typeorm

typeorm for nelts

# Usage

```bash
npm i @nelts/typeorm
```

in **app.ts**

```ts
import { LocalPlugin, LocalContext } from './index';
import Photo from './modal/photo.ts';
export default (plu: LocalPlugin) => {
  let id: string;
  // ...
  plu.on('props', configs => {
    id = plu.getComponent('@nelts/typeorm').preset({
      type, host, port, username, password, database
    }, [Photo]);
  });

  plu.on('ServerStarted', () => {
    if (!id) throw new Error('cannot resolve connection');
  })

  plu.on('ContextStart', (ctx: LocalContext) => ctx.connection = plu.getComponent('@nelts/typeorm').getConnection(id));
  // ...
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
