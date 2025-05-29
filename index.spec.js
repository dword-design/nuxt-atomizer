import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';
import { test } from 'playwright-local-tmp-dir';

test('valid', async ({ page }) => {
  test.setTimeout(60_000);
  await fs.outputFile('pages/index.vue', dedent`
    <template>
      <div>Hello world</div>
    </template>
  `);

  let nuxt = execaCommand('nuxt dev --no-fork', { reject: false, stdio: 'inherit' });

  try {
    await nuxtDevReady();
    await page.goto(`http://localhost:3000`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
});
