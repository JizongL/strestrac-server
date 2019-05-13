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
  describe(`GET /api/events/:event_id`, () => {
    context(`Given no event`, () => {
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

    context('Given there are events in the database', () => {
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

    context(`Given an XSS attack event`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousEvent,
        expectedEvent,
      } = helpers.makeMaliciousEvent(testUser)

      beforeEach('insert malicious event', () => {
        return helpers.seedMaliciousEvent(
          db,
          testUser,
          maliciousEvent,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/events/${maliciousEvent.id}`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.stress_cause).to.eql(expectedEvent.stress_cause)
            expect(res.body.symptoms).to.eql(expectedEvent.symptoms)
          })
      })
    })
  })

  describe(`POST /api/events`,()=>{
    beforeEach('insert events', () =>
    helpers.seedEventsTables(
      db,
      testUsers,
      testEvents          
    )       
  )
  it('create an event, responding with 201 and the new review',function(){
    this.retries(3)
    const testEvent = testEvents[0]
    const testUser = testUsers[0]
    const newEvent = {
      coping: "listen to music",
      //date_recorded: "2019-04-30T18:51:34.646Z",
      date_recorded: new Date(),
      id:testEvent.id,
      mood:4,
      stress_cause:"test",
      stress_event:"Test new event",
      stress_score:4,
      symptoms: "headache",
      user_id:testUser.id,
      work_efficiency:5,
    }
    return supertest(app)
    .post('/api/events')
    .set('Authorization', helpers.makeAuthHeader(testUser))
    .send(newEvent)
    .expect(201)
    .expect(res=>{
     
      // console.log(expectedDate,actualDate,'test dates')
      expect(res.body).to.have.property('id')
      expect(res.body.coping).to.eql(newEvent.coping)
      expect(res.body.stress_cause).to.eql(newEvent.stress_cause)
      expect(res.body.stress_score).to.eql(newEvent.stress_score)
      expect(res.body.symptoms).to.eql(newEvent.symptoms)
      expect(res.body.stress_event).to.eql(newEvent.stress_event)
      expect(res.body.work_efficiency).to.eql(newEvent.work_efficiency)
      expect(res.body.mood).to.eql(newEvent.mood)
      expect(res.headers.location).to.eql(`/api/events/${res.body.id}`)
      expect(res.body.user_id).to.eql(testUser.id)
      //console.log(res.body,'test post res')
      const expectedDate = new Date().toLocaleString()
      //console.log(expectedDate,'test expectedDate')
      const actualDate = new Date(res.body.date_recorded).toLocaleString()
      //console.log(res.body.date_recorded,'test actualDate')
      expect(expectedDate).to.eql(actualDate)
    })
  })
  const requiredFields = ['coping', 'mood', 'stress_event', 'work_efficiency','stress_cause','stress_score','symptoms']
  requiredFields.forEach(field=>{
    const testEvent = testEvents[0]
    const newEvent = {     
        coping: "listen to music",                
        id:testEvent.id,
        mood:4,
        stress_cause:"test",
        stress_event:"Test new event",
        stress_score:4,
        symptoms: "headache",        
        work_efficiency:5,      
    }

    it(`responds with 400 and an error message when the '${field}' is missing`,()=>{
      delete newEvent[field]
      return supertest(app)
        .post('/api/events')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newEvent)
        .expect(400,{error:`Missing '${field}' in request body`})
    })

  })
  })

  describe(`DELETE /api/events/:event_id`,()=>{
    context(`Given there are events in the database`,()=>{
      
      beforeEach('insert events', () =>
      helpers.seedEventsTables(
      db,
      testUsers,
      testEvents          
    )       
  )
        it('responds with 204 and remove the event',()=>{
          const idToDelete = 1
          const filterEvents = testEvents.filter(event=>
            event.id!==idToDelete)
          
          const expectedResult = filterEvents.map(event=> ({...event,full_name:testUsers[0].full_name}))
          
            console.log(expectedResult,'test expected')
            //console.log(testEvents,'test expected')
          return supertest(app)  
            .delete(`/api/events/${idToDelete}`)
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(()=>{
             return supertest(app)
                .get(`/api/events/`)
                .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
                .expect(200,expectedResult)

            })
        })
        

    })
  })
  describe(`PATCH /api/events`,()=>{
    context(`Given no events`,()=>{
      beforeEach('insert events', () =>
      helpers.seedUsers(
        db,
        testUsers
     
      )       
    )
      it('respond with 404',()=>{
        const eventId = 12345
        
          return supertest(app)
            .patch(`/api/events/${eventId}`)
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
            //.expect(404,{error:{message:`event doesn't exist`}})
      })
    })
    context(`Given there are events`,()=>{
      beforeEach('insert events', () =>
      helpers.seedEventsTables(
        db,
        testUsers,
        testEvents          
      )       
    )
      
  const eventId = 1
  
      it(`respond with 204 and update the event`,()=>{
        const idToUpdate = 2
        const updateEvent = {
        coping: "updated",                
        id:eventId,
        mood:4,
        stress_cause:"updated",
        stress_event:"updated",
        stress_score:4,
        symptoms: "updated",        
        work_efficiency:5,      
        }

        const expectedEvent = {
          ...testEvents[idToUpdate-1],
          updateEvent
        }
        return supertest(app)
          .patch(`/api/events/${idToUpdate}`)
          .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
          .send(updateEvent)
          .expect(204)
          .then(res=>{
            supertest(app)
              .get(`/api/events/${idToUpdate}`)
              .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedEvent)
          })
      })
    })
 

  })
})