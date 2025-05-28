import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import { spawn } from 'node:child_process'
import pathLib from 'path'

let nuxt = spawn(pathLib.join('node_modules', '.bin', 'nuxt'), ['dev'], { stdio: 'inherit' });

try {
  await nuxtDevReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  nuxt.kill('SIGINT')
  console.log('killed')
  await nuxt;
  console.log('terminated')
  //await kill(nuxt.pid);
}
