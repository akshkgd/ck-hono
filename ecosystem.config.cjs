module.exports = {
  apps: [
    {
      name: 'codekaro-api',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'codekaro-workers',
      script: './dist/workers/index.js',
      instances: 1, // Single worker process managing all 3 queue listeners cleanly
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
