const xss = require('xss')

const StressEventsSerivce = {
  getAllEvents(db,userId){
    return db
      .select('*')
      .from('stress_events AS eve')
      .join('stress_users AS usr',
          'eve.id',
          'usr.id'
      )      
      .where('eve.user_id',userId)

  }
}

module.exports = StressEventsSerivce