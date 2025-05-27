import { endent } from '@dword-design/functions';
import { test } from '@playwright/test';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import outputFiles from 'output-files';
import kill from 'tree-kill-promise';
import withLocalTmpDir from 'with-local-tmp-dir';

//let reset;
test.beforeEach(async () => /*reset = */ await withLocalTmpDir());
//test.afterEach(() => reset());

test('minimal', async () => {
  await outputFiles({
    //'nuxt.config.js': "export default { modules: ['foo'] }",
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
    //nuxt.kill('SIGINT');
    //await nuxt;
    await kill(nuxt.pid);
  }
});
