module.exports = {
  DEVELOPMENT: {
    db: {
      dialect: 'sqlite',
      database: 'fibers-tracker',
      username: 'root',
      password: 'password',
    },
    api: {
      port: 2992,
      host: '127.0.0.1',
      appName: 'Fibers Tracker Service',
    },
    logging: true,
  },
};
