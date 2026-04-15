module.exports = {
  apps: [
    {
      name: "harshis-collections-api",
      cwd: "/home/harshiscollections/htdocs/harshiscollections.com/backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      watch: false,
      autorestart: true
    }
  ]
}
