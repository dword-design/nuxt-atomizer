import {
  addServerHandler,
  createResolver,
  isNuxt3 as isNuxt3Try,
} from '@nuxt/kit';
import utils from 'atomizer/src/lib/utils.js';
import { vite as atomizer } from 'atomizer-plugins';
import packageName from 'depcheck-package-name';
import fs from 'fs-extra';
import jiti from 'jiti';
import P from 'path';
import serveStatic from 'serve-static';

const FILENAME = 'acss.css';
const resolver = createResolver(import.meta.url);

export default async function (moduleOptions, nuxt) {
  nuxt = nuxt || this;

  const jitiInstance = jiti(process.cwd(), {
    esmResolve: true,
    interopDefault: true,
  });

  const fileConfig = (await fs.exists('atomizer.config.js'))
    ? jitiInstance('./atomizer.config.js')
    : {};

  const options = utils.mergeConfigs([
    fileConfig,
    nuxt.options.atomizer,
    moduleOptions,
  ]);

  const cssPath = P.join(nuxt.options.buildDir, FILENAME);
  let isNuxt3 = true;

  try {
    isNuxt3 = isNuxt3Try();
  } catch {
    isNuxt3 = false;
  }

  if (isNuxt3) {
    nuxt.options.app.head.link.push({
      href: `/${FILENAME}`,
      rel: 'stylesheet',
    });

    nuxt.options.runtimeConfig.atomizer = { cssPath };

    addServerHandler({
      handler: resolver.resolve('./server-handler.get.js'),
      route: `/${FILENAME}`,
    });

    if (nuxt.options.vite.plugins === undefined) {
      nuxt.options.vite.plugins = [];
    }

    nuxt.options.vite.plugins.push(
      atomizer({ config: options, outfile: cssPath }),
    );
  } else {
    nuxt.options.head.link.push({ href: `/${FILENAME}`, rel: 'stylesheet' });

    nuxt.extendBuild(config => {
      const rules = config.module.rules.filter(rule =>
        ['.js', '.vue'].some(extension => rule.test.test(extension)),
      );

      for (const rule of rules) {
        if (!rule.use) {
          rule.use = [{ loader: rule.loader, options: rule.options }];
          delete rule.loader;
          delete rule.options;
        }

        rule.use.unshift({
          loader: packageName`webpack-atomizer-loader`,
          query: {
            config: {
              configs: options,
              cssDest: P.relative(process.cwd(), cssPath),
            },
            minimize: true,
          },
        });
      }
    });

    nuxt.options.serverMiddleware.push({
      handler: serveStatic(cssPath),
      path: `/${FILENAME}`,
    });
  }
}
