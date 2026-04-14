module.exports = {
  apps: [
    {
      name: "harshis-collections-api",
      cwd: "/home/harshiscollections/htdocs/harshiscollections.com/backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        JWT_SECRET: "harshis_super_secret_key_2026"
      },
      watch: false,
      autorestart: true
    }
  ]
}
