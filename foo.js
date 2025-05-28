import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';
import { x } from 'tinyexec'

await fs.outputFile('pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

const nuxt = x('nuxt', ['dev'], {
  throwOnError: true,
  nodeOptions: {
    stdio: 'inherit',
    env: {
      ...process.env,
      _PORT: '3000',
      PORT: '3000',
      HOST: '127.0.0.1',
      NODE_ENV: 'development',
    },
  },
});

try {
  await nuxtDevReady();
  console.log('ready')
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('waited')
} finally {
  console.log('killing')
  await kill(nuxt.pid);
  console.log('killed')
  console.log('waited after kill')
  await execaCommand('nuxi cleanup');
  await fs.remove('pages/index.vue');
}
