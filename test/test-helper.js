const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',   
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',     
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name:'test-user-4',
      full_name:'Test user 4',      
      password:'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeEventArray(users){
  return[
    {      
      
      coping: "listen to music",
      date_recorded: "2019-04-30T18:51:34.646Z",
      id:1,
      mood:4,
      stress_cause:"work related",
      stress_event:"crazy event",
      stress_score:4,
      symptoms: "headache",
      user_id:users[0].id,
      work_efficiency:5
      
      
  },
  {      
    coping: "listen to music",
    date_recorded: "2019-04-30T18:51:34.646Z",
    id:2,
    mood:4,
    stress_cause:"work related",
    stress_event:"crazy event",
    stress_score:4,
    symptoms: "headache",
    user_id:users[0].id,
    work_efficiency:5,
},
  {      
      id: 3,
      stress_event: "crazy event",
      mood: 4,
      work_efficiency: 5,
      stress_cause: "work related",
      stress_score:4,
      symptoms: "headache",
      coping: "listen to music",
      date_recorded: "2019-04-30T18:51:34.646Z",
      user_id:users[0].id
  },
  {      
    id: 4,
    stress_event: "crazy event",
    mood: 4,
    work_efficiency: 5,
    stress_cause: "work related",
    stress_score:4,
    symptoms: "headache",
    coping: "listen to music",
    date_recorded: "2019-04-30T18:51:34.646Z",
    user_id:users[0].id
    }
  ]
}

function makeEventsFixtures() {
  const testUsers = makeUsersArray()
  const testEvents = makeEventArray(testUsers)
  
  return { testUsers, testEvents }
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into('stress_users').insert(preppedUsers)
    .then(() => {
      db.raw(
        `SELECT setval('stress_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    });
}

function seedEventsTables(db, users, events) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    
    
    await seedUsers(trx,users)
    await trx.into('stress_events').insert(events)
    // update the auto sequence to match the forced id values
    await trx.raw(
            `SELECT setval('stress_events_id_seq', ?)`,
            [events[events.length - 1].id],
          )
    // only insert comments if there are some, also update the sequence counter  
  
  })
}

// function cleanTables(db) {
//   return db.raw(
//     `TRUNCATE
//       stress_events,
//       stress_users      
//       `
//   )
// }

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        stress_events,
        stress_users        
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE stress_events_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE stress_users_id_seq minvalue 0 START WITH 1`),        
        trx.raw(`SELECT setval('stress_events_id_seq', 0)`),
        trx.raw(`SELECT setval('stress_users_id_seq', 0)`),
        
      ])
    )
  )
}
function makeMaliciousEvent() {
  const maliciousEvent = {
    id: 911,
    stress_event: "crazy event",
     mood: 4,
     work_efficiency: 5,
     date_recorded: new Date(),
    stress_cause: 'Naughty naughty very naughty <script>alert("xss");</script>',
    stress_score:4,
    user_id:2,
    coping: "listen to music",
    symptoms: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  
  const expectedEvent = {
    ...maliciousEvent,       
    stress_cause: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    symptoms: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousEvent,
    expectedEvent,
  }
}
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
       subject: user.user_name,
       algorithm: 'HS256',
     })
     //console.log(token,'test token')
return `Bearer ${token}`
}

function seedMaliciousEvent(db, user, event) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('stress_events')
        .insert([event])
    )
}

module.exports ={
  seedMaliciousEvent,
  seedEventsTables,
  makeAuthHeader,
  makeUsersArray,
  makeEventsFixtures,
  makeMaliciousEvent,
  makeEventArray,
  cleanTables,
  seedUsers
}