import { delay, endent } from '@dword-design/functions';
import { expect } from '@playwright/test';
import { execaCommand } from 'execa';
import getPort from 'get-port';
import nuxtDevReady from 'nuxt-dev-ready';
import { ofetch } from 'ofetch';
import outputFiles from 'output-files';
import { test } from '@playwright/test';
import kill from 'tree-kill-promise';

const ATOMIZER_BUILD_DELAY = 1000;

test('minimal', async () => {
  test.setTimeout(60_000);
  const dir = testInfo.outputPath('');

  await outputFiles({
    [pathLib.join(dir, 'pages', 'index.vue')]: endent`
      <template>
        <div>Hello world</div>
      </template>
    `,
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
  });

  try {
    await nuxtDevReady(port);
    await delay(1000);
    await page.goto(`http://localhost:${port}`);
  } finally {
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
});

test('atomizer.config.js', async ({ page }) => {
  test.setTimeout(60_000);
  const dir = testInfo.outputPath('');

  await outputFiles({
    [dir]: {
      'atomizer.config.js': endent`
        export default {
          custom: { foo: 'red' },
        };
      `,
      'nuxt.config.js': endent`
        export default {
          modules: ['../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="elem C(foo)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
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
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
});

test('css', async ({ page }) => {
  test.setTimeout(60_000);
  const dir = testInfo.outputPath('');

  await outputFiles({
    [dir]: {
      'nuxt.config.js': endent`
        export default {
          modules: ['../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="elem C(red)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
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
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
});

test('multiple files', async ({ page }) => {
  test.setTimeout(60_000);
  const dir = testInfo.outputPath('');

  await outputFiles({
    [dir]: {
      'nuxt.config.js': endent`
        export default {
          modules: ['../src/index.js'],
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
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
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
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
});

test('module options', async () => {
  const dir = testInfo.outputPath('');
  await outputFiles({
    [dir]: {
      'nuxt.config.js': endent`
        export default {
          modules: [['../src/index.js', { custom: { foo: 'red' } }]],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="elem C(foo)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
  });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    await kill(nuxt.pid);
  }
});

test('top-level options', async () => {
  const dir = testInfo.outputPath('');
  await outputFiles({
    [dir]: {
      'nuxt.config.js': endent`
        export default {
          atomizer: {
            custom: { foo: 'red' },
          },
          modules: ['../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="C(foo)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
  });

  try {
    await nuxtDevReady(port);
    await delay(ATOMIZER_BUILD_DELAY);

    expect(await ofetch(`http://localhost:${port}/acss.css`)).toMatch(
      String.raw`.C\(foo\){color:red}`,
    );
  } finally {
    await kill(nuxt.pid);
  }
});

test('variables', async ({ page }) => {
  test.setTimeout(60_000);
  const dir = testInfo.outputPath('');

  await outputFiles({
    [dir]: {
      'nuxt.config.js': endent`
        export default {
          atomizer: {
            custom: { foo: 'red' },
          },
          modules: [['../src/index.js', { custom: { foo: 'red' } }]],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="elem C(foo)">Hello world</div>
        </template>
      `,
    },
  });

  const port = await getPort();

  const nuxt = execaCommand('nuxt dev --no-fork', {
    env: { PORT: port },
    reject: false,
    cwd: dir,
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
    await kill(nuxt.pid);
    await new Promise(resolve => setTimeout(resolve, 10_000));
  }
});
