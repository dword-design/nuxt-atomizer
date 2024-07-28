import CleanCSS from 'clean-css';
import fs from 'fs-extra';

import { defineEventHandler, useRuntimeConfig } from '#imports';

const {
  atomizer: { cssPath },
} = useRuntimeConfig();

const cleanCss = new CleanCSS();

export default defineEventHandler(async () => {
  let code = await fs.readFile(cssPath, 'utf8');
  code = cleanCss.minify(code).styles;
  return code;
});
