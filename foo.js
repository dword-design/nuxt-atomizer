import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';
import { x } from 'tinyexec'

console.log('1')
await fs.outputFile('pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

let nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
  await execaCommand('nuxi cleanup');
  await fs.remove('pages/index.vue');
}

console.log('2')
await fs.outputFile('pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
  await execaCommand('nuxi cleanup');
  await fs.remove('pages/index.vue');
}

console.log('3')
await fs.outputFile('pages/index.vue', dedent`
  <template>
    <div />
  </template>
`);

nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
  await execaCommand('nuxi cleanup');
  await fs.remove('pages/index.vue');
}
