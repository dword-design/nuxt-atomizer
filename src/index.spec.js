import { endent, property } from '@dword-design/functions'
import axios from 'axios'
import { outputFile } from 'fs-extra'
import { Builder, Nuxt } from 'nuxt'
import postcss from 'postcss'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  css: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.js',
        endent`
      export default {
        render: h => <div class="C(red)">Hello world</div>,
      }
    `
      )
      const nuxt = new Nuxt({ dev: false, modules: [require.resolve('.')] })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"'
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data')
        ).toEqual('.C\\(red\\){color:red}')
      } finally {
        nuxt.close()
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
    `
      )
      const nuxt = new Nuxt({
        atomizer: {
          plugins: [
            {
              postcssPlugins: [
                postcss.plugin('test', () => root =>
                  root.walkDecls(decl => {
                    if (decl.prop === 'color') {
                      decl.prop = 'background'
                    }
                  })
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
        modules: [require.resolve('.')],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data')
        ).toEqual('.C\\(red\\){background:red}.Foo{font-weight:700}')
      } finally {
        nuxt.close()
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
    `
      )
      const nuxt = new Nuxt({
        atomizer: {
          custom: { foo: 'red' },
        },
        dev: false,
        modules: [require.resolve('.')],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"'
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data')
        ).toEqual('.C\\(foo\\){color:red}')
      } finally {
        nuxt.close()
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
    `
      )
      const nuxt = new Nuxt({
        dev: false,
        modules: [[require.resolve('.'), { custom: { foo: 'red' } }]],
      })
      await new Builder(nuxt).build()
      try {
        await nuxt.listen()
        expect(nuxt.renderRoute('/') |> await |> property('html')).toMatch(
          '"/acss.css"'
        )
        expect(
          axios.get('http://localhost:3000/acss.css')
            |> await
            |> property('data')
        ).toEqual('.C\\(foo\\){color:red}')
      } finally {
        nuxt.close()
      }
    }),
}
