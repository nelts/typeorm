import { LocalWorkerPlugin } from './index';
import TypeOrm from './typeorm';

export default (plu: LocalWorkerPlugin<any>) => {
  plu.typeorm = new TypeOrm();
  plu.app.on('ServerStarted', async () =>  await plu.typeorm.init());
}
