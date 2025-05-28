import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import { spawn } from 'node:child_process'

let nuxt = spawn('nuxt', ['dev'], { stdio: 'inherit' });

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await kill(nuxt.pid);
}
