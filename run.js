import dedent from 'dedent';
import { execaCommand } from 'execa';
import nuxtDevReady from 'nuxt-dev-ready';
import kill from 'tree-kill-promise';
import fs from 'fs-extra';

export default async () => {
  await fs.outputFile('pages/index.vue', dedent`
    <template>
      <div />
    </template>
  `);

  const nuxt = execaCommand('nuxt dev', {
    stdio: 'inherit',
    // Windows-spezifische Optionen
    windowsHide: true,
    shell: process.platform === 'win32'
  });

  try {
    await nuxtDevReady();
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    try {
      // Sanfterer Kill-Prozess für Windows
      if (process.platform === 'win32') {
        process.kill(nuxt.pid, 'SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await kill(nuxt.pid);
    } catch (err) {
      // Ignoriere Fehler beim Beenden
    }
    await execaCommand('nuxi cleanup');
    await fs.remove('pages/index.vue');
  }
};
