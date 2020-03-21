import serveStatic from 'serve-static'
import getPackageName from 'get-package-name'
import P from 'path'
import { flatMap, compact } from '@dword-design/functions'

export default function (options) {

  options = { ...this.options.atomizer, ...options }
  const { plugins = [] } = options
  const cssDest = P.join(this.options.buildDir, 'acss.css')

  this.extendBuild(config => {
    config.module.rules
      .find(({ test }) => test.test('.js'))
      .use
      .unshift({
        loader: getPackageName(require.resolve('webpack-atomizer-loader')),
        query: {
          postcssPlugins: plugins |> flatMap('postcssPlugins') |> compact,
          minimize: true,
          config: {
            configs: options,
            cssDest: P.relative(process.cwd(), cssDest),
            options: {
              rules: plugins |> flatMap('rules') |> compact,
            },
          },
        },
      })
  })
  
  /*const { configs } = require(options.configPath)
  if (this.options.dev) {
    this.options.serverMiddleware.push(
      {
        path: '/register-acss-browser-config.js',
        handler: (req, res) => res.end(`window.acssConfig = ${stringifyObject(configs, { indent: '  ' })};`),
      },
      {
        path: '/acss-browser',
        handler: serveStatic(require.resolve('acss-browser/acss-browser.min.js')),
      },
    )
    this.options.head.script.push(
      { src: '/register-acss-browser-config.js' },
      { src: '/acss-browser' },
    )
  }*/
  this.options.serverMiddleware.push({
    path: '/acss.css',
    handler: serveStatic(cssDest),
  })
  this.options.head.link.push({ rel: 'stylesheet', href: '/acss.css' })
}