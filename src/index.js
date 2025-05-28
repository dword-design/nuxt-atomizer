import pathLib from 'node:path';
import { pathToFileURL } from 'node:url';

import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit';
import utils from 'atomizer/src/lib/utils.js';
import { vite as atomizer } from 'atomizer-plugins';
import { createJiti } from 'jiti';

const FILENAME = 'acss.css';
const resolver = createResolver(import.meta.url);

export default defineNuxtModule({
  setup: async (options, nuxt) => {
    const jitiInstance = jiti(process.cwd(), {
      esmResolve: true,
      interopDefault: true,
    });

    const fileConfig = (await fs.exists('atomizer.config.js'))
      ? jitiInstance('./atomizer.config.js')
      : {};

    options = utils.mergeConfigs([fileConfig, nuxt.options.atomizer, options, { custom: { foo: 'red' } }]);
    const cssPath = pathLib.join(nuxt.options.buildDir, FILENAME);

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
  },
});
