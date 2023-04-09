import { endent, property } from '@dword-design/functions'
import axios from 'axios'
import { outputFile } from 'fs-extra'
import { Builder, Nuxt } from 'nuxt'
import outputFiles from 'output-files'
import postcss from 'postcss'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from './index.js'

export default {
  css: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.js',
        endent`
          export default {
            render: h => <div class="C(red)">Hello world</div>,
          }
        `,
      )

      const nuxt = new Nuxt({
        createRequire: 'native',
        dev: false,
        modules: [self],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"',
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(red\\){color:red}')
      } finally {
        await nuxt.close()
      }
    }),
  'multiple files': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
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
      })

      const nuxt = new Nuxt({
        dev: false,
        modules: [self],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"',
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(green\\){color:green}.C\\(red\\){color:red}')
      } finally {
        await nuxt.close()
      }
    }),
  plugin: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.js',
        endent`
          export default {
            render: () => <div class="C(red) Foo">Hello world</div>,
          }
        `,
      )

      const nuxt = new Nuxt({
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
        dev: false,
        modules: [self],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(red\\){background:red}.Foo{font-weight:700}')
      } finally {
        await nuxt.close()
      }
    }),
  'top-level option': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.js',
        endent`
          export default {
            render: h => <div class="C(foo)">Hello world</div>,
          }
        `,
      )

      const nuxt = new Nuxt({
        atomizer: {
          custom: { foo: 'red' },
        },
        dev: false,
        modules: [self],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"',
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(foo\\){color:red}')
      } finally {
        await nuxt.close()
      }
    }),
  variables: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.js',
        endent`
          export default {
            render: h => <div class="C(foo)">Hello world</div>,
          }
        `,
      )

      const nuxt = new Nuxt({
        dev: false,
        modules: [[self, { custom: { foo: 'red' } }]],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"',
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(foo\\){color:red}')
      } finally {
        await nuxt.close()
      }
    }),
  'vue file': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.vue',
        endent`
          <template>
            <div class="C(red)">Hello world</div>
          </template>
        `,
      )

      const nuxt = new Nuxt({
        dev: false,
        modules: [self],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"',
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data'),
        ).toEqual('.C\\(red\\){color:red}')
      } finally {
        await nuxt.close()
      }
    }),
}
