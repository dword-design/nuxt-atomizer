import { expect, test } from '@playwright/test';
import delay from 'delay';
import endent from 'endent';
import { execaCommand } from 'execa';
import getPort from 'get-port';
import nuxtDevReady from 'nuxt-dev-ready';
import { ofetch } from 'ofetch';
import outputFiles from 'output-files';
import kill from 'tree-kill-promise';

const ATOMIZER_BUILD_DELAY = 1000;

test('atomizer.config.js', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'atomizer.config.js': endent`
      export default {
        custom: { foo: 'red' },
      };
    `,
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src'],
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
    cwd,
    env: { PORT: String(port) },
    reject: false,
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
    await kill(nuxt.pid!);
  }
});

test('atomizer.config.ts', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'atomizer.config.ts': endent`
      export default {
        custom: { foo: 'red' },
      };
    `,
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src'],
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
    cwd,
    env: { PORT: String(port) },
    reject: false,
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
    await kill(nuxt.pid!);
  }
});

test('css', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src'],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="elem C(red)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: String(port) },
    reject: false,
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
    await kill(nuxt.pid!);
  }
});

test('multiple files', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.js': endent`
      export default {
        modules: ['../../src'],
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

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: String(port) },
    reject: false,
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

    await page.goto(`http://localhost:${port}/other`);

    expect(
      await page
        .locator('.elem')
        .evaluate(el => globalThis.getComputedStyle(el).color),
    ).toEqual('rgb(0, 128, 0)');
  } finally {
    await kill(nuxt.pid!);
  }
});

test('module options', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.js': endent`
      export default {
        modules: [['../../src', { custom: { foo: 'red' } }]],
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
    cwd,
    env: { PORT: String(port) },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    await kill(nuxt.pid!);
  }
});

test('top-level options', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.js': endent`
      export default {
        atomizer: {
          custom: { foo: 'red' },
        },
        modules: ['../../src'],
      };
    `,
    'pages/index.vue': endent`
      <template>
        <div class="C(foo)">Hello world</div>
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev', {
    cwd,
    env: { PORT: String(port) },
    reject: false,
  });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    await kill(nuxt.pid!);
  }
});

test('variables', async ({ page }, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    'nuxt.config.js': endent`
      export default {
        atomizer: {
          custom: { foo: 'red' },
        },
        modules: [['../../src', { custom: { foo: 'red' } }]],
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
    cwd,
    env: { PORT: String(port) },
    reject: false,
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
    await kill(nuxt.pid!);
  }
});
