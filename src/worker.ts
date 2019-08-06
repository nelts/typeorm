import { LocalWorkerPlugin, LocalWorkerFactory } from './index';
import TypeOrm from './typeorm';

export default (plu: LocalWorkerPlugin) => {
  plu.typeorm = new TypeOrm();
  plu.app.on('ServerStarted', async () =>  await plu.typeorm.init());
}
