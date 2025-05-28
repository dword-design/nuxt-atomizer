import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import { x } from 'tinyexec'

console.log('1')
let nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
}

console.log('2')
nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
}

console.log('3')
nuxt = x('nuxt', ['dev']);

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
}
