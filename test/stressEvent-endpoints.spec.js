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
      beforeEach('insert events', () =>
        helpers.seedEventsTables(
          db,
          testUsers,
          testEvents          
        )       
      )
      
      it('responds with 200 and all of the events', () => {  
        const expected = testEvents.map(event=>
       {return {...event,full_name:testUsers[0].full_name}}
<<<<<<< HEAD
     )
     


||||||| merged common ancestors
     )
     console.log(expected)


=======
     )     
>>>>>>> testing
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
<<<<<<< HEAD
          .expect(res => {
            
||||||| merged common ancestors
          .expect(res => {
            //  console.log(res.body[0],'test')
=======
          .expect(res => {            
>>>>>>> testing
            expect(res.body[0].stress_cause).to.eql(expectedEvent.stress_cause)
            expect(res.body[0].symptoms).to.eql(expectedEvent.symptoms)
          })
        })
      })
    })
<<<<<<< HEAD
  })
  describe(`GET /api/events/:event_id`, () => {
    context(`Given no event`, () => {
||||||| merged common ancestors
  })
  describe.only(`GET /api/events/:event_id`, () => {
    context.only(`Given no event`, () => {
=======

  describe(`GET /api/events/:event_id`, () => {
    context(`Given no event`, () => {
>>>>>>> testing
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
<<<<<<< HEAD
    )       
  )
  it('create an event, responding with 201 and the new review',function(){
    this.retries(3)
    const testEvent = testEvents[0]
    const testUser = testUsers[0]
    const newEvent = {
      coping: "listen to music",
      
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
||||||| merged common ancestors
    )       
  )
  it.only('create an event, responding with 201 and the new review',function(){
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
=======
      )       
    )
  
    it('create an event, responding with 201 and the new review',function(){
      this.retries(3)
      const testEvent = testEvents[0]
      const testUser = testUsers[0]
      const newEvent = {
        coping: "listen to music",    
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
>>>>>>> testing
    return supertest(app)
<<<<<<< HEAD
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
      
      const expectedDate = new Date().toLocaleString()
      
      const actualDate = new Date(res.body.date_recorded).toLocaleString()
      
      expect(expectedDate).to.eql(actualDate)
||||||| merged common ancestors
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
=======
      .post('/api/events')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(newEvent)
      .expect(201)
      .expect(res=>{            
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
        const expectedDate = new Date().toLocaleString()      
        const actualDate = new Date(res.body.date_recorded).toLocaleString()      
        expect(expectedDate).to.eql(actualDate)
      })
>>>>>>> testing
    })
<<<<<<< HEAD
  })
  it('create an envent, with title length > 80, responding with error',()=>{
    //this.retries(3)
    const testEvent = testEvents[0]
    const testUser = testUsers[0]
    const newEvent = {
      coping: "listen to music",        
      date_recorded: new Date(),
      id:testEvent.id,
      mood:4,
      stress_cause:"test",
      stress_event:"a".repeat(81),
      
      stress_score:4,
      symptoms: "headache",
      user_id:testUser.id,
      work_efficiency:5,
    }
    return supertest(app)
    .post('/api/events')
    .set('Authorization', helpers.makeAuthHeader(testUser))
    .send(newEvent)
    .expect(400,{error:'stress event title length must not exceed 80 letters'})

  })
||||||| merged common ancestors
  })
=======
  
>>>>>>> testing
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

<<<<<<< HEAD
    

    it(`responds with 400 and an error message when the '${field}' is missing`,()=>{
||||||| merged common ancestors
    it.only(`responds with 400 and an error message when the '${field}' is missing`,()=>{
=======
    it(`return error if event title is longer than 72 letters long`,()=>{
      this.retries(3)
      const testEvent = testEvents[0]
      const testUser = testUsers[0]
      const newEvent = {
        coping: "listen to music",        
        date_recorded: new Date(),
        id:testEvent.id,
        mood:4,
        stress_cause:"test",
        stress_event:"a".repeat(100),
        stress_score:4,
        symptoms: "headache",
        user_id:testUser.id,
        work_efficiency:5,
      }
      return supertest(app)
      .post('/api/events')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(newEvent)
      .expect(400,{error:'event title should be less than 72 letters long'})            
    })
      

    it(`responds with 400 and an error message when the '${field}' is missing`,()=>{
>>>>>>> testing
      delete newEvent[field]
      console.log(field)
      return supertest(app)
        .post('/api/events')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newEvent)
        .expect(400,{error:`Missing '${field}' in request body`})
      })
    })
  })

<<<<<<< HEAD
  describe(`DELETE /api/events/:event_id`,()=>{
    context(`Given there are events in the database`,()=>{
      
||||||| merged common ancestors
  describe.only(`DELETE /api/events/:event_id`,()=>{
    context(`Given there are events in the database`,()=>{
      
=======
  describe(`DELETE /api/events/:event_id`,()=>{
    context(`Given there are events in the database`,()=>{      
>>>>>>> testing
      beforeEach('insert events', () =>
      helpers.seedEventsTables(
      db,
      testUsers,
      testEvents          
    )       
  )
<<<<<<< HEAD
        it('responds with 204 and remove the event',()=>{
          const idToDelete = 1
          const filterEvents = testEvents.filter(event=>
            event.id!==idToDelete)
          
          const expectedResult = filterEvents.map(event=> ({...event,full_name:testUsers[0].full_name}))
          
            
            
          return supertest(app)  
            .delete(`/api/events/${idToDelete}`)
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(()=>{
             return supertest(app)
                .get(`/api/events/`)
                .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
                .expect(200,expectedResult)
||||||| merged common ancestors
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
=======
>>>>>>> testing

      it('responds with 204 and remove the event',()=>{
        const idToDelete = 1
        const filterEvents = testEvents.filter(event=>
          event.id!==idToDelete)
        
        const expectedResult = filterEvents.map(event=> ({...event,full_name:testUsers[0].full_name}))                            
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
<<<<<<< HEAD
  })
  describe(`PATCH /api/events`,()=>{
    context(`Given no events`,()=>{
||||||| merged common ancestors
  })
  describe.only(`PATCH /api/events`,()=>{
    context.only(`Given no events`,()=>{
=======
  
  describe(`PATCH /api/events`,()=>{
    context(`Given no events`,()=>{
>>>>>>> testing
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
<<<<<<< HEAD
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
           
||||||| merged common ancestors
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))
            //.expect(404,{error:{message:`event doesn't exist`}})
=======
            .set('Authorization',helpers.makeAuthHeader(testUsers[0]))            
        })
>>>>>>> testing
      })
<<<<<<< HEAD
    })
    context(`Given there are events`,()=>{
||||||| merged common ancestors
    })
    context.only(`Given there are events`,()=>{
=======

    context(`Given there are events`,()=>{
>>>>>>> testing
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