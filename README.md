

## Introduction 

This is the backend server for the proeject StreSTrac, see details from client [here](https://github.com/JizongL/stressTrac-client/tree/master), live client [here](https://stress-tracker-app.2015rpro.now.sh/)


## Getting started

```
$ mkdir project
$ git clone https://github.com/JizongL/strestrac-server.git strestrac_server
$ npm install
```
### .env setup
.env hide all the secret in local environment, the format is as followed, fill in your info. For JWT_SECRET, you can generate a new random uuid from [here](https://www.uuidgenerator.net/)

```
NODE_ENV=development
PORT=8000
MIGRATION_DB_HOST=localhost
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=strestrac
JWT_SECRET=[uuid]
# MIGRATION_DB_NAME=strestrac-test
MIGRATION_DB_USER=[db_user_name]
# pur your dunder-mifflin password below if you set one, otherwise leave it like so:
MIGRATION_DB_PASS=
DB_URL=[link_to_local_db]
TEST_DB_URL=[link_to_local_test_db]
```

### Migration
```
npm run migrate

```

### Launch server
launch development mode 

```
npm run dev
```

