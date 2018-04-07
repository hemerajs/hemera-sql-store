'use strict'

const Hp = require('hemera-plugin')
const Knex = require('knex')
const SqlStore = require('./store')
const StorePattern = require('hemera-store/pattern')

function hemeraSqlStore(hemera, opts, done) {
  const databases = new Map()
  const topic = 'sql-store'

  /**
   * Create new knex per database
   * Connection pooling is handled by knex
   *
   * @param {any} name
   * @returns
   */
  function useDb(name) {
    if (databases.has(name)) {
      return databases.get(name)
    }
    if (name) {
      opts.knex.connection.database = name
      databases.set(name, Knex(opts.knex))
      return databases.get(name)
    } else if (opts.knex.connection.database) {
      databases.set(opts.knex.connection.database, Knex(opts.knex))
      return databases.get(opts.knex.connection.database)
    }
  }

  function destroyConnectionPool() {
    hemera.log.debug('destroy connections')
    let teardowns = []
    for (const db of databases.values()) {
      teardowns.push(db.destroy())
    }
    return Promise.all(teardowns)
  }

  hemera.ext('onClose', () => destroyConnectionPool())

  // encapsulate payload validator only to this plugin
  hemera.use(require('hemera-joi')).after((err, done) => {
    /**
     * Create a new record
     */
    hemera.add(StorePattern.create(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.create(req, cb)
    })

    /**
     * Find a record by id
     */
    hemera.add(StorePattern.findById(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.findById(req, cb)
    })

    /**
     * Update a record by id
     */
    hemera.add(StorePattern.updateById(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.updateById(req, req.data, cb)
    })

    /**
     * Replace a record by id
     */
    hemera.add(StorePattern.replaceById(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.replaceById(req, req.data, cb)
    })

    /**
     * Update entities
     */
    hemera.add(StorePattern.update(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.update(req, req.data, cb)
    })

    /**
     * Update entities
     */
    hemera.add(StorePattern.replace(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.replace(req, req.data, cb)
    })

    /**
     * Remove an entity by id
     */
    hemera.add(StorePattern.removeById(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.removeById(req, cb)
    })

    /**
     * Remove by query
     */
    hemera.add(StorePattern.remove(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.remove(req, cb)
    })

    /**
     * find
     */
    hemera.add(StorePattern.find(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.find(req, req.options, cb)
    })

    /**
     * exists
     */
    hemera.add(StorePattern.exists(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.exists(req, cb)
    })

    /**
     * count
     */
    hemera.add(StorePattern.count(topic), function(req, cb) {
      let db = useDb(req.database)

      const store = new SqlStore(db)

      store.count(req, cb)
    })
    // init default db
    if (opts.knex.connection && opts.knex.connection.database) {
      useDb(opts.knex.connection.database)
    }
    done(err)
  })
  done()
}

module.exports = Hp(hemeraSqlStore, {
  hemera: '>=5.0.0',
  name: require('./package.json').name,
  options: {
    knex: {
      connection: {}
    }
  }
})
