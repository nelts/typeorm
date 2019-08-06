import { LocalAgentPlugin, LocalAgentFactory } from './index';
import TypeOrm from './typeorm';

export default (plu: LocalAgentPlugin) => {
  plu.typeorm = new TypeOrm();
  plu.app.on('ServerStarted', async () =>  await plu.typeorm.init());
}