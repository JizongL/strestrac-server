const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helper')

describe(`Protected endpoints`,()=>{
  let db

  const {
    testUsers,
    testEvents
  } = helpers.makeEventsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert stress events', () =>
    helpers.seedEventsTables(
      db,
      testUsers,
      testEvents
    )
  )

  const protectedEndpoints = [
        {
          name: 'GET /api/events/:event_id',
          path: '/api/events/1',
          method: supertest(app).get
        }
        
  ]    
  protectedEndpoints.forEach(endpoint =>{    
    describe(endpoint.name,()=>{     
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return supertest(app)         
         .get(endpoint.path)
          .expect(401, { error: 
            `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'        
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid user`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)                  
              .set('Authorization', helpers.makeAuthHeader(invalidUser))
              .expect(401, { error: `Unauthorized request` })
          })          
        })
      })
    })
  
