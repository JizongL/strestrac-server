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
      user_name: 'test-user-4',
      full_name: 'Test user 4',      
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeEventArray(users){
  return[
    {      
      id: 1,
      stress_event: "crazy event",
      mood: 4,
      work_efficiency: 5,
      stress_cause: "work related",
      symptoms: "headache",
      coping: "listen to music",
      date_recorded: "2019-04-30T18:51:34.646Z",
      user_id:users[0].id
  },
  {      
    id: 2,
    stress_event: "crazy event",
    mood: 4,
    work_efficiency: 5,
    stress_cause: "work related",
    symptoms: "headache",
    coping: "listen to music",
    date_recorded: "2019-04-30T18:51:34.646Z",
    user_id:users[1].id
},
  {      
      id: 3,
      stress_event: "crazy event",
      mood: 4,
      work_efficiency: 5,
      stress_cause: "work related",
      symptoms: "headache",
      coping: "listen to music",
      date_recorded: "2019-04-30T18:51:34.646Z",
      user_id:users[2].id
  },
  {      
    id: 4,
    stress_event: "crazy event",
    mood: 4,
    work_efficiency: 5,
    stress_cause: "work related",
    symptoms: "headache",
    coping: "listen to music",
    date_recorded: "2019-04-30T18:51:34.646Z",
    user_id:users[3].id
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

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      stress_events,
      stress_users      
      `
  )
}

module.exports ={
  makeUsersArray,
  makeEventsFixtures,
  makeEventArray,
  cleanTables,
  seedUsers
}