import { delay, endent } from '@dword-design/functions';
import puppeteer from '@dword-design/puppeteer';
import { execa, execaCommand } from 'execa';
import fs from 'fs-extra';
import inFolder from 'in-folder';
import nuxtDevReady from 'nuxt-dev-ready';
import { ofetch } from 'ofetch';
import outputFiles from 'output-files';
import P from 'path';
import kill from 'tree-kill-promise';
import withLocalTmpDir from 'with-local-tmp-dir';

const ATOMIZER_BUILD_DELAY = 1000;

export default {
  async afterEach() {
    await this.page.close();
    await this.browser.close();
    await this.resetWithLocalTmpDir();
  },
  async 'atomizer.config.js'() {
    await outputFiles({
      'atomizer.config.js': endent`
        module.exports = {
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);
      await this.page.goto('http://localhost:3000');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(255, 0, 0)');
    } finally {
      await kill(nuxt.pid);
    }
  },
  before: async () => {
    await fs.outputFile(
      P.join('node_modules', '.cache', 'nuxt2', 'package.json'),
      JSON.stringify({ dependencies: { nuxt: '^2' } }),
    );

    await inFolder(P.join('node_modules', '.cache', 'nuxt2'), async () => {
      await execaCommand('corepack use pnpm');
      await execaCommand('pnpm install', { stdio: 'inherit' });
    });
  },
  async beforeEach() {
    this.resetWithLocalTmpDir = await withLocalTmpDir();
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  },
  async css() {
    await outputFiles({
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);
      await this.page.goto('http://localhost:3000');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(255, 0, 0)');
    } finally {
      await kill(nuxt.pid);
    }
  },
  async 'multiple files'() {
    await outputFiles({
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);
      await this.page.goto('http://localhost:3000');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(255, 0, 0)');

      await this.page.goto('http://localhost:3000/other');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(0, 128, 0)');
    } finally {
      await kill(nuxt.pid);
    }
  },
  async nuxt2() {
    await outputFiles({
      'nuxt.config.js': endent`
        export default {
          modules: ['~/../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="elem C(red)">Hello world</div>
        </template>
      `,
    });

    await fs.symlink(
      P.join('..', 'node_modules', '.cache', 'nuxt2', 'node_modules'),
      'node_modules',
    );

    const nuxt = execa(P.join('node_modules', '.bin', 'nuxt'), ['dev']);

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);
      await this.page.goto('http://localhost:3000');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(255, 0, 0)');
    } finally {
      await kill(nuxt.pid);
    }
  },
  options: async () => {
    await outputFiles({
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);

      expect(await ofetch('http://localhost:3000/acss.css')).toMatch(
        '.C\\(foo\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  'top-level options': async () => {
    await outputFiles({
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);

      expect(await ofetch('http://localhost:3000/acss.css')).toMatch(
        '.C\\(foo\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  async variables() {
    await outputFiles({
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
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      await delay(ATOMIZER_BUILD_DELAY);
      await this.page.goto('http://localhost:3000');

      expect(
        await this.page.$eval('.elem', el => window.getComputedStyle(el).color),
      ).toEqual('rgb(255, 0, 0)');
    } finally {
      await kill(nuxt.pid);
    }
  },
};
