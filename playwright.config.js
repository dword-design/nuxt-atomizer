import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 1,
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}',
});
