import withLocalTmpDir from 'with-local-tmp-dir'
import { endent, property } from '@dword-design/functions'
import { outputFile } from 'fs-extra'
import { Nuxt, Builder } from 'nuxt'
import atomizerModule from '@dword-design/nuxt-atomizer'
import axios from 'axios'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFile('pages/index.js', endent`
    export default {
      render: () => <div class="C(red)">Hello world</div>,
    }
  `)
  const nuxt = new Nuxt({ modules: [atomizerModule], dev: false })
  await new Builder(nuxt).build()
  try {
    await nuxt.server.listen()
    expect(nuxt.renderRoute('/') |> await |> property('html'))
      .toMatch('"/acss.css"')
    expect(axios.get('http://localhost:3000/acss.css') |> await |> property('data'))
      .toEqual('.C\\(red\\){color:red}')
  } finally {
    nuxt.close()
  }
})
