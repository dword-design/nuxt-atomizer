import pathLib from 'node:path';

import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit';
import type { AtomizerConfig } from 'atomizer';
import { mergeConfigs } from 'atomizer/src/lib/utils';
import { vite as atomizer } from 'atomizer-plugins';
import { createJiti } from 'jiti';

const FILENAME = 'acss.css';
const resolver = createResolver(import.meta.url);

export default defineNuxtModule<AtomizerConfig>({
  meta: {
    compatibility: { nuxt: '>=3.0.0' },
    configKey: 'atomizer',
    name: 'nuxt-atomizer',
  },
  setup: async (options, nuxt) => {
    const jitiInstance = createJiti(process.cwd());

    const fileConfig = await jitiInstance
      .import<AtomizerConfig>('./atomizer.config', { default: true })
      .catch(error => {
        if (
          error.message.startsWith(`Cannot find module './atomizer.config'`)
        ) {
          return {};
        } else {
          throw error;
        }
      });

    console.log(fileConfig);
    options = mergeConfigs([fileConfig, options]);
    const cssPath = pathLib.join(nuxt.options.buildDir, FILENAME);

    if (!nuxt.options.app.head.link) {
      nuxt.options.app.head.link = [];
    }

    nuxt.options.app.head.link.push({
      href: `/${FILENAME}`,
      rel: 'stylesheet',
    });

    nuxt.options.runtimeConfig.atomizer = { cssPath };

    addServerHandler({
      handler: resolver.resolve('./server-handler.get'),
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
