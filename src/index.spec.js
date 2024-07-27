import { endent } from '@dword-design/functions';
import packageName from 'depcheck-package-name';
import { execaCommand } from 'execa';
import fs from 'fs-extra';
import nuxtDevReady from 'nuxt-dev-ready';
import { ofetch } from 'ofetch';
import outputFiles from 'output-files';
import P from 'path';
import kill from 'tree-kill-promise';
import withLocalTmpDir from 'with-local-tmp-dir';

export default {
  async afterEach() {
    await this.resetWithLocalTmpDir();
  },
  before: async () => {
    await fs.outputFile(
      P.join('node_modules', '.cache', 'nuxt2', 'package.json'),
      JSON.stringify({}),
    );

    await execaCommand('yarn add nuxt@^2', {
      cwd: P.join('node_modules', '.cache', 'nuxt2'),
      stdio: 'inherit',
    });
  },
  async beforeEach() {
    this.resetWithLocalTmpDir = await withLocalTmpDir();
  },
  css: async () => {
    await outputFiles({
      'nuxt.config.js': endent`
        export default {
          modules: ['~/../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="C(red)">Hello world</div>
        </template>
      `,
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      expect(await ofetch('http://localhost:3000')).toMatch('"/acss.css"');

      expect(await ofetch('http://localhost:3000/acss.css')).toEqual(
        '.C\\(red\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  'multiple files': async () => {
    await outputFiles({
      'nuxt.config.js': endent`
        export default {
          modules: ['~/../src/index.js'],
        };
      `,
      pages: {
        'index.vue': endent`
          <template>
            <div class="C(red)">Hello world</div>
          </template>
        `,
        'other.vue': endent`
          <template>
            <div class="C(green)">Hello world</div>
          </template>
        `,
      },
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();
      expect(await ofetch('http://localhost:3000')).toMatch('"/acss.css"');

      expect(await ofetch('http://localhost:3000/acss.css')).toEqual(
        '.C\\(green\\){color:green}.C\\(red\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  plugin: async () => {
    await outputFiles({
      'nuxt.config.js': endent`
        import postcss from '${packageName`postcss`}'

        export default {
          atomizer: {
            plugins: [
              {
                postcssPlugins: [
                  postcss.plugin(
                    'test',
                    () => root =>
                      root.walkDecls(decl => {
                        if (decl.prop === 'color') {
                          decl.prop = 'background'
                        }
                      }),
                  ),
                ],
              },
              {
                rules: [
                  {
                    matcher: 'Foo',
                    name: 'Foo',
                    noParams: true,
                    styles: {
                      'font-weight': 'bold',
                    },
                    type: 'helper',
                  },
                ],
              },
            ],
          },
          modules: ['~/../src/index.js'],
        };
      `,
      'pages/index.vue': endent`
        <template>
          <div class="C(red) Foo">Hello world</div>
        </template>
      `,
    });

    const nuxt = execaCommand('nuxt dev');

    try {
      await nuxtDevReady();

      expect(await ofetch('http://localhost:3000/acss.css')).toEqual(
        '.C\\(red\\){background:red}.Foo{font-weight:700}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  'top-level option': async () => {
    await outputFiles({
      'nuxt.config.js': endent`
        export default {
          atomizer: {
            custom: { foo: 'red' },
          },
          modules: ['~/../src/index.js'],
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
      expect(await ofetch('http://localhost:3000')).toMatch('"/acss.css"');

      expect(await ofetch('http://localhost:3000/acss.css')).toEqual(
        '.C\\(foo\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
  variables: async () => {
    await outputFiles({
      'nuxt.config.js': endent`
        export default {
          atomizer: {
            custom: { foo: 'red' },
          },
          modules: [['~/../src/index.js', { custom: { foo: 'red' } }]],
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
      expect(await ofetch('http://localhost:3000')).toMatch('"/acss.css"');

      expect(await ofetch('http://localhost:3000/acss.css')).toEqual(
        '.C\\(foo\\){color:red}',
      );
    } finally {
      await kill(nuxt.pid);
    }
  },
};
