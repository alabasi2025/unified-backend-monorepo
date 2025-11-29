module.exports = {
  apps: [{
    name: 'semop-backend',
    script: './dist/apps/api-gateway/main.js',
    cwd: '/root/SEMOP/unified-backend-monorepo',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://semop_user:semop_password@localhost:5432/semop_db?schema=public'
    }
  }]
};
