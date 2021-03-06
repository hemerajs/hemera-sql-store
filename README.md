# Hemera-sql-store package

[![Build Status](https://travis-ci.org/hemerajs/hemera-sql-store.svg?branch=master)](https://travis-ci.org/hemerajs/hemera-sql-store)
[![npm](https://img.shields.io/npm/v/hemera-sql-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-sql-store)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

Generic SQL client for Hemera. If you need a different driver you can install it with `npm install --save <driver>`.
For more informations see [Knex](http://knexjs.org/).

## Install

```
npm i hemera-sql-store mysql --save
```

## Start Mariadb with Docker

```
docker-compose up
```

## Running the tests

```
npm run test
```

## Example

```js
const hemera = new Hemera(nats)
hemera.use(require('hemera-joi'))
hemera.use(require('hemera-sql-store'), {
  knex: {
    dialect: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: '',
      password: '',
      database: 'test'
    }
  }
})
```

## API

See [Store](https://github.com/hemerajs/hemera/tree/master/packages/hemera-store) Interface.
