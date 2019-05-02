const xss = require('xss')

const StressEventsService = {
  getAllEvents(db,userId){
    return db
      
      .from('stress_events AS eve')
      .select(
        'eve.user_id',
        'usr.full_name',
        'usr.id',
        'eve.stress_event',
        'eve.id',
        'eve.mood',
        'eve.work_efficiency',
        'eve.stress_cause',
        'eve.stress_score',
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
      .then(row=>{
        return row[0]
      })
      // .then(([event]) => event)
      // .then(event =>{
      //   console.log(event.id,'test event in event service')
      //   return StressEventsService.getById(db,event.id)

      // })
  },
  // need to test if userId is needed
  getById(db,id){
    //console.log(id,'test id inside get by id')
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
        'eve.stress_score',
        'eve.symptoms',
        'eve.coping',
        'eve.date_recorded',

        )
      .join('stress_users AS usr',
          'eve.user_id',
          'usr.id'
      )      
       .where('eve.id',id)
       .first()
    

  },
  updateEvent(db,id,eventToUpdate){
    return db('stress_events')
    .where({id})
    .update(eventToUpdate)
  },
  deleteEvent(db,id){
    return db
      .from('stress_events')
      .where({id}).delete()
  }
  ,
  serializeEvent(event) {
    return {
      full_name: xss(event.id),
      id: event.id,
      user_id: event.user_id,
      stress_event: xss(event.stress_event),
      mood: event.mood,
      work_efficiency:xss(event.work_efficiency),
      stress_cause:xss(event.stress_cause),
      symptoms:xss(event.symptoms),
      coping:xss(event.coping),
      date_recorded:event.date_recorded
    }
  }

}

module.exports = StressEventsService