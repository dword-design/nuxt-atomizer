import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import { runCommand } from 'nuxi';

let nuxt = await runCommand('dev', ['--fork']);
console.log(nuxt)
const proc = nuxt.result.listener;
console.log(proc)
try {
  await nuxtDevReady();
  console.log('ready')
  await new Promise(resolve => setTimeout(resolve, 1000));
} finally {
  await proc.close();
  await proc.server.shutdown();
  console.log('closed')
}
