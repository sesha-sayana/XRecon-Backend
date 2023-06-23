module.exports = {
  apps: [
    {
      name: "Xrecon",
      script: "./bin/www",
      // args: '',
      // exec_mode: "cluster",
      // instances:6,
      // autorestart: true,
      // watch: true,
      // max_memory_restart: '1G',
      env: {
        PORT: 4000,
        NODE_ENV: "dev",
      },
      env_test: {
        PORT: 4000,
        NODE_ENV: "test",
      },
      env_production: {
        PORT: 4000,
        NODE_ENV: "prod",
      },
    },
  ],
};
