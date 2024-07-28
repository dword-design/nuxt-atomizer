import CleanCSS from 'clean-css';
import fs from 'fs-extra';

import {
  defineEventHandler,
  setResponseHeader,
  useRuntimeConfig,
} from '#imports';

const {
  atomizer: { cssPath },
} = useRuntimeConfig();

const cleanCss = new CleanCSS();

export default defineEventHandler(async event => {
  let code = await fs.readFile(cssPath, 'utf8');
  code = cleanCss.minify(code).styles;
  setResponseHeader(event, 'Content-Type', 'text/css');
  return code;
});
