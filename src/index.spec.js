import { endent } from '@dword-design/functions';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import outputFiles from 'output-files';
import { test } from 'playwright-local-tmp-dir';

test('minimal', async () => {
  await outputFiles({
    'pages/index.vue': endent`
      <template>
        <div />
      </template>
    `,
  });

  const nuxt = execaCommand('nuxt dev');

  try {
    await nuxtDevReady();
  } finally {
    nuxt.kill('SIGINT');
    await nuxt;
  }
});
