import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';

await fs.ensureDir('sub');
await fs.outputFile('sub/pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

let nuxt = execaCommand('nuxt-babel dev', { stdio: 'inherit', cwd: 'sub' });

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await fs.remove('sub')
}
