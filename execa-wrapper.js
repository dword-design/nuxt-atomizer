#!/usr/bin/env node

import { execaCommand } from 'execa';

await execaCommand('nuxt dev --no-fork', { reject: false, stdio: 'inherit' });
