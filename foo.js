import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';

await fs.outputFile('pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

const nuxt = execaCommand('nuxt dev', {
  stdio: 'inherit',
});

try {
  await nuxtDevReady();
  console.log('ready')
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('waited')
} finally {
  console.log('killing')
  await nuxt.kill();
  console.log('killed')
  console.log('waited after kill')
  //await execaCommand('nuxi cleanup');
  //await fs.remove('pages/index.vue');
}
