import dedent from 'dedent';
import { execa } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';
import { test } from 'playwright-local-tmp-dir';

test('valid', async () => {
  await fs.outputFile('pages/index.vue', dedent`
    <template>
      <div />
    </template>
  `);

  let nuxt = execa('../execa-wrapper.js', { reject: false, stdio: 'inherit' });

  try {
    await nuxtDevReady();
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
});
