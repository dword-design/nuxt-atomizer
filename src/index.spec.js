import net from 'node:net';

import { delay, endent } from '@dword-design/functions';
import { expect, test } from '@playwright/test';
import { execaCommand } from 'execa';
import getPort from 'get-port';
import nuxtDevReady from 'nuxt-dev-ready';
import { ofetch } from 'ofetch';
import outputFiles from 'output-files';
import pWaitFor from 'p-wait-for';

const ATOMIZER_BUILD_DELAY = 1000;

const isPortFree = port =>
  new Promise(resolve => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port);
  });

test('atomizer.config.js', async ({ page }, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'atomizer.config.js': endent`
      export default {
        custom: { foo: 'red' },
      };
    `,
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src/index.js'],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="elem C(foo)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd: dir,
    env: { PORT: port },
    stdio: 'inherit',
  });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);
    await page.goto(`http://localhost:${port}`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(255, 0, 0)');
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});

test('css', async ({ page }, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src/index.js'],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="elem C(red)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();
  const nuxt = execaCommand('nuxt dev', { cwd: dir, env: { PORT: port } });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);
    await page.goto(`http://localhost:${port}`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(255, 0, 0)');
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});

test('multiple files', async ({ page }, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src/index.js'],
      };
    `,
    pages: {
      'index.vue': endent`
        <template>
          <div class="elem C(red)">Hello world</div>
        </template>
      `,
      'other.vue': endent`
        <template>
          <div class="elem C(green)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();
  const nuxt = execaCommand('nuxt dev', { cwd: dir, env: { PORT: port } });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);
    await page.goto(`http://localhost:${port}`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(255, 0, 0)');

    await page.goto(`http://localhost:${port}/other`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(0, 128, 0)');
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});

test('module options', async ({}, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'nuxt.config.js': endent`
      export default {
        modules: [['../../src/index.js', { custom: { foo: 'red' } }]],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="elem C(foo)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();
  const nuxt = execaCommand('nuxt dev', { cwd: dir, env: { PORT: port } });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});

test('top-level options', async ({}, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'nuxt.config.js': endent`
      export default {
        atomizer: {
          custom: { foo: 'red' },
        },
        modules: ['../../src/index.js'],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="C(foo)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();
  const nuxt = execaCommand('nuxt dev', { cwd: dir, env: { PORT: port } });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});

test('variables', async ({ page }, testInfo) => {
  const dir = testInfo.outputPath('');

  await outputFiles(dir, {
    'nuxt.config.js': endent`
      export default {
        atomizer: {
          custom: { foo: 'red' },
        },
        modules: [['../../src/index.js', { custom: { foo: 'red' } }]],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="elem C(foo)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();
  const nuxt = execaCommand('nuxt dev', { cwd: dir, env: { PORT: port } });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);
    await page.goto(`http://localhost:${port}`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(255, 0, 0)');
  } finally {
    nuxt.kill('SIGINT');
    await pWaitFor(() => isPortFree(port));
  }
});
