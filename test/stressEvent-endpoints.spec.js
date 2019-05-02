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
    
    context(`Given no events`, () => {
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
      beforeEach('insert events', () =>
        helpers.seedEventsTables(
          db,
          testUsers,
          testEvents          
        )
       

      )
      
      it('responds with 200 and all of the events', () => {
  // only 1 user is needed.       
        const expected = testEvents.map(event=>
	
       {return {...event,full_name:testUsers[0].full_name}}
     )
     console.log(expected)


        return supertest(app)
          .get('/api/events')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expected)
          
      })
    })

    context(`Given an XSS attack event`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousEvent,
        expectedEvent,
      } = helpers.makeMaliciousEvent()

      beforeEach('insert malicious event', () => {       
        helpers.seedMaliciousEvent(db, testUser, maliciousEvent)         
      })

      it('removes XSS attack content', () => {
       
           
        return supertest(app)
          .get(`/api/events`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            //  console.log(res.body[0],'test')
            expect(res.body[0].stress_cause).to.eql(expectedEvent.stress_cause)
            expect(res.body[0].symptoms).to.eql(expectedEvent.symptoms)
          })
      })
    })
  })
  describe.only(`GET /api/events/:event_id`, () => {
    context.only(`Given no event`, () => {
      beforeEach(() =>
      helpers.seedUsers(db, testUsers))
      it(`responds with 404`, () => {
        const eventId = 123456
        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: {message:"event doesn't exist"} })
      })
    })

    context.only('Given there are events in the database', () => {
      beforeEach('insert events', () =>
        helpers.seedEventsTables(
          db,
          testUsers,
          testEvents          
        )       
      )

      it('responds with 200 and the specified event', () => {
        const eventId = 1
        const expected = {...testEvents[eventId-1],full_name:testUsers[0].full_name}

        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expected)
      })
    })

    context(`Given an XSS attack thing`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousThing,
        expectedThing,
      } = helpers.makeMaliciousEvent(testUser)

      beforeEach('insert malicious thing', () => {
        return helpers.seedMaliciousThing(
          db,
          testUser,
          maliciousThing,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/things/${maliciousThing.id}`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedThing.title)
            expect(res.body.content).to.eql(expectedThing.content)
          })
      })
    })
  })
})