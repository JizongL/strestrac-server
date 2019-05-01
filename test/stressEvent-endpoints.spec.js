const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helper')

describe('Events Endpoints', function() {
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

  describe(`GET /api/events/`, () => {
    
    context.only(`Given no events`, () => {
      // only users and no event, so seeding users
      beforeEach('seed users',()=>{
        helpers.seedUsers(
          db,
          testUsers
        )
      })
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/events')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are events in the database', () => {
      // console.log('test users',testUsers)
      // console.log('test articles',testArticles)
      // console.log('test comments',testComments)
      beforeEach('insert articles', () =>
        helpers.seedArticlesTables(
          db,
          testUsers,
          testArticles,
          testComments,
        )
      )
      
      it('responds with 200 and all of the articles', () => {
        const expectedArticles = testArticles.map(article =>
          helpers.makeExpectedArticle(
            testUsers,
            article,
            testComments,
          )
        )
        return supertest(app)
          .get('/api/events')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedArticles)
         
      })
    })

    context(`Given an XSS attack article`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousEvent,
        expectedEvent,
      } = helpers.makeMaliciousEvent()

      beforeEach('insert malicious article', () => {
        return db
          .into('stress_events')
          .insert(maliciousEvent)          
      })

      it('removes XSS attack content', () => {
       
           
        return supertest(app)
          .get(`/api/events`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            
            expect(res.body[0].stress_cause).to.eql(expectedArticle.title)
            expect(res.body[0].content).to.eql(expectedArticle.content)
          })
      })
    })
  })

})