const xss = require('xss')

const StressEventsService = {
  getAllEvents(db,userId){
    return db
      
      .from('stress_events AS eve')
      .select(
        'usr.full_name',
        'usr.id',
        'eve.stress_event',
        'eve.user_id',
        'eve.mood',
        'eve.work_efficiency',
        'eve.stress_cause',
        'eve.symptoms',
        'eve.coping',
        'eve.date_recorded',

        )
      .join('stress_users AS usr',
          'eve.user_id',
          'usr.id'
      )      
      .where('eve.user_id',userId)

  },
  insertEvent(db,newEvent){
    return db
      .insert(newEvent)
      .into('stress_events')
      .returning('*')
      .then(([event]) => event)
      .then(event =>{
        console.log(event.id,'test event in event service')
        return StressEventsService.getById(db,event.id)

      })
  },
  // need to test if userId is needed
  getById(db,id){
    console.log(id,'test id inside get by id')
    return db
    .from('stress_events AS eve')
    
      .select(
        'usr.full_name',
        'usr.id',
        'eve.id',        
        'eve.user_id',
        'eve.stress_event',
        'eve.mood',
        'eve.work_efficiency',
        'eve.stress_cause',
        'eve.symptoms',
        'eve.coping',
        'eve.date_recorded',

        )
      .join('stress_users AS usr',
          'eve.user_id',
          'usr.id'
      )      
       .where('eve.id',id)
    

  }

}

module.exports = StressEventsService