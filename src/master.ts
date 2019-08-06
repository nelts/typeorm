import { LocalMasterPlugin, LocalMasterFactory } from './index';
import TypeOrm from './typeorm';

export default (plu: LocalMasterPlugin) => {
  plu.typeorm = new TypeOrm();
  plu.app.on('ServerStarted', async () =>  await plu.typeorm.init(true));
}