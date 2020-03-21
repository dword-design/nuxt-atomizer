import withLocalTmpDir from 'with-local-tmp-dir'
import { endent, property } from '@dword-design/functions'
import { outputFile } from 'fs-extra'
import { Nuxt, Builder } from 'nuxt'
import axios from 'axios'
import postcss from 'postcss'

export default {
  css: () => withLocalTmpDir(async () => {
    await outputFile('pages/index.js', endent`
      export default {
        render: h => <div class="C(red)">Hello world</div>,
      }
    `)
    const nuxt = new Nuxt({ dev: false, modules: [require.resolve('.')] })
    await new Builder(nuxt).build()
    try {
      await nuxt.listen()
      expect(nuxt.renderRoute('/') |> await |> property('html'))
        .toMatch('"/acss.css"')
      expect(axios.get('http://localhost:3000/acss.css') |> await |> property('data'))
        .toEqual('.C\\(red\\){color:red}')
    } finally {
      nuxt.close()
    }
  }),
  variables: () => withLocalTmpDir(async () => {
    await outputFile('pages/index.js', endent`
      export default {
        render: h => <div class="C(foo)">Hello world</div>,
      }
    `)
    const nuxt = new Nuxt({
      dev: false,
      modules: [
        [require.resolve('.'), { custom: { foo: 'red' } }],
      ],
    })
    await new Builder(nuxt).build()
    try {
      await nuxt.listen()
      expect(nuxt.renderRoute('/') |> await |> property('html'))
        .toMatch('"/acss.css"')
      expect(axios.get('http://localhost:3000/acss.css') |> await |> property('data'))
        .toEqual('.C\\(foo\\){color:red}')
    } finally {
      nuxt.close()
    }
  }),
  'top-level option': () => withLocalTmpDir(async () => {
    await outputFile('pages/index.js', endent`
      export default {
        render: h => <div class="C(foo)">Hello world</div>,
      }
    `)
    const nuxt = new Nuxt({
      dev: false,
      modules: [
        require.resolve('.'),
      ],
      atomizer: {
        custom: { foo: 'red' },
      },
    })
    await new Builder(nuxt).build()
    try {
      await nuxt.listen()
      expect(nuxt.renderRoute('/') |> await |> property('html'))
        .toMatch('"/acss.css"')
      expect(axios.get('http://localhost:3000/acss.css') |> await |> property('data'))
        .toEqual('.C\\(foo\\){color:red}')
    } finally {
      nuxt.close()
    }
  }),
  plugin: () => withLocalTmpDir(async () => {
    await outputFile('pages/index.js', endent`
      export default {
        render: () => <div class="C(red) Foo">Hello world</div>,
      }
    `)
    const nuxt = new Nuxt({
      dev: false,
      modules: [require.resolve('.')],
      atomizer: {
        plugins: [
          {
            postcssPlugins: [
              postcss.plugin('test', () => root => root.walkDecls(decl => {
                if (decl.prop === 'color') {
                  decl.prop = 'background'
                }
              })),
            ],
          },
          {
            rules: [
              {
                type: 'helper',
                name: 'Foo',
                matcher: 'Foo',
                noParams: true,
                styles: {
                  'font-weight': 'bold',
                },
              },
            ],
          },
        ],
      },
    })
    await new Builder(nuxt).build()
    try {
      await nuxt.listen()
      expect(axios.get('http://localhost:3000/acss.css') |> await |> property('data'))
        .toEqual('.C\\(red\\){background:red}.Foo{font-weight:700}')
    } finally {
      nuxt.close()
    }
  }),
}
