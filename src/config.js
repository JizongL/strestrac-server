module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/strestrac',
  JWT_SECRET: process.env.JWT_SECRET || '395d92cf-e93c-4945-8578-0cffa7181d9a',
}

