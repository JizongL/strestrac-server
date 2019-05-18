## StreSTrac server

### Introduction
[StreSTrac](https://stress-tracker-app.2015rpro.now.sh) is an experimental React application that allows user to document their stress events, with the goal of helping users to understand their stress pattern and thus control it. 

This server use JWT token to authenticate user login, user signup for an account through client and the server will encrypt the password with [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) to generate a JWT token and store it in the database. and when user login to their account, server will verify user's credential by using a JWT secret stored in the server envionment. 

All server endpoints have been fully tested with mocha and its [lived version]() has been deployed to heroku. 


[client github](https://github.com/JizongL/stressTrac-client)




[live version](https://blooming-mountain-74904.herokuapp.com/api)

### How it work

#### for loocal development environment

```
mkdir streSTrac && cd $_
git clone https://github.com/JizongL/strestrac-server stresStracServer
```
#### install node-modules and run test
```
npm i && npm t

```

#### Create and setup local .env 
In root directory run
```
mkdir .env
```
paste the following and update the info

```
NODE_ENV=development
PORT=8000
MIGRATION_DB_HOST=localhost
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=strestrac
JWT_SECRET='[your-geneated-uuid]'
# MIGRATION_DB_NAME=strestrac-test
MIGRATION_DB_USER=[your-db-username]
# pur your dunder-mifflin password below if you set one, otherwise leave it like so:
MIGRATION_DB_PASS=
DB_URL="postgresql://dunder-mifflin@localhost/strestrac"
TEST_DB_URL="postgresql://thingful@localhost/strestrac-test"

```

#### setup postgreSQL database and run migration

```
createdb -U user_name database_name
```

#### Run database migration 

```
npm run migrate
```
#### Start Server
```
npm run dev
```

#### Connect to client 
In client, find config.js and paste the address for `API_ENDPOINT`

```
export default {
  API_ENDPOINT: http://localhost:8000,
  TOKEN_KEY: 'strestrac-client-auth-token',
}
```

#### Additional note

For deployment to Heroku, change `process.env.DB_URL` to `process.env.DATABASE_URL` in the config.js file in root.

```
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/strestrac',
  JWT_SECRET: process.env.JWT_SECRET || '395d92cf-e93c-4945-8578-0cffa7181d9a',
}
```
 
### Technology used

### built

* [Express](https://expressjs.com/)

* [Node.js](https://nodejs.org/en/)

* [PostgreSQL](https://www.postgresql.org/)

* [Heroku](https://www.heroku.com/)




