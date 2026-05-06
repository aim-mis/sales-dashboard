module.exports = {
  apps: [
    {
      name: 'dashboard-backend',
      script: 'npm',
      args: 'start',
      cwd: 'C:\\Users\\NVG\\sales-dashboard\\backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5070
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'dashboard-frontend',
      script: 'npm',
      args: 'start',
      cwd: 'C:\\Users\\NVG\\sales-dashboard\\frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 5071,
        BROWSER: 'none'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_restarts: 10
    }
  ]
};
