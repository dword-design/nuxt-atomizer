import { compact, flatMap } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import P from 'path'
import serveStatic from 'serve-static'

export default function (moduleOptions) {
  const options = { plugins: [], ...this.options.atomizer, ...moduleOptions }

  const cssDest = P.join(this.options.buildDir, 'acss.css')
  this.extendBuild(config => {
    const rules = config.module.rules.filter(rule =>
      ['.js', '.vue'].some(extension => rule.test.test(extension))
    )
    for (const rule of rules) {
      if (!rule.use) {
        rule.use = [{ loader: rule.loader, options: rule.options }]
        delete rule.loader
        delete rule.options
      }
      rule.use.unshift({
        loader: packageName`webpack-atomizer-loader`,
        query: {
          config: {
            configs: options,
            cssDest: P.relative(process.cwd(), cssDest),
            options: {
              rules: options.plugins |> flatMap('rules') |> compact,
            },
          },
          minimize: true,
          postcssPlugins:
            options.plugins |> flatMap('postcssPlugins') |> compact,
        },
      })
    }
  })
  /* const { configs } = require(options.configPath)
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
  } */
  this.options.serverMiddleware.push({
    handler: serveStatic(cssDest),
    path: '/acss.css',
  })
  this.options.head.link.push({ href: '/acss.css', rel: 'stylesheet' })
}
