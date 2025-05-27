import { endent } from '@dword-design/functions';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';

await fs.outputFile('pages/index.vue', endent`
  <template>
    <div />
  </template>
`);

const nuxt = execaCommand('nuxt dev');

try {
  await nuxtDevReady();
} finally {
  //nuxt.kill('SIGINT');
  //await nuxt;
  await kill(nuxt.pid);
  await execaCommand('nuxi cleanup');
  await fs.remove('pages/index.vue');
}
