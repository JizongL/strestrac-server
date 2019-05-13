const express = require('express')
const eventRouter = express.Router()
const jsonBodyParser = express.json()
const StressEventsService = require('./userEventsService')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

<<<<<<< HEAD
// event routes with no id specified
// GET and POST events 
||||||| merged common ancestors
// remember the events.map() here, I was trying to 
// res.json(StressEventsService.serializeEvent(events)) before, it didn't
// work, because events are an array of objects. 
=======
>>>>>>> testing
eventRouter
  .route('/')
  .get(requireAuth)
  .get((req,res,next)=>{    
    const knexInstance = req.app.get('db')
    StressEventsService.getAllEvents(knexInstance,req.user.id)
  .then(events=>{
    res.json(events.map(StressEventsService.serializeEvent))
  })
<<<<<<< HEAD
  .catch(next)  
})

  .post(requireAuth,jsonBodyParser,(req,res,next)=>{
    const {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping} = req.body
    const newEvent = {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping}
    newEvent.user_id = req.user.id
  

// verify all fields have value
  for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
  stressEvent_input_error = StressEventsService.validateStressEventInput(stress_event)
  
  // validate stress event title does not exceed a certain length  
  if(stressEvent_input_error)
      res.status(400).json({ error: stressEvent_input_error })

      // insert into event database                
    StressEventsService.insertEvent(
    req.app.get('db'),
    newEvent
  )
  .then(event=>{
||||||| merged common ancestors
  .catch(next)

  
})
.post(requireAuth,jsonBodyParser,(req,res,next)=>{
  const {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping} = req.body
  const newEvent = {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping}
  newEvent.user_id = req.user.id
  //console.log(newEvent,'test new event')
  for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
        StressEventsService.insertEvent(
    req.app.get('db'),
    newEvent
  )
  .then(event=>{
    //console.log(event.id,'test event inside event router')
=======
  .catch(next)
})

  .post(requireAuth,jsonBodyParser,(req,res,next)=>{
    const {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping} = req.body
    const newEvent = {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping}
    newEvent.user_id = req.user.id  
    for (const [key, value] of Object.entries(newEvent))
        if (value == null)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          })
        eventValidateError = StressEventsService.validateEventTitle(stress_event)
          if(eventValidateError){
            return res.status(400).json({ error: eventValidateError })
          }   
          StressEventsService.insertEvent(
      req.app.get('db'),
      newEvent
    )
  .then(event=>{    
>>>>>>> testing
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${event.id}`))   
      .json(event) 
  })
  .catch(next)
})

// DELETE and PATCH event given an id
eventRouter
  .route('/:event_id')
  // .all take care everything before delete and patch
  .all(requireAuth)
  .all((req,res,next)=>{
    StressEventsService.getById(
      req.app.get('db'),
      req.params.event_id
    )
    .then(event=>{      
      if(!event){
        return res.status(404).json(
          {error:{message:`event doesn't exist`}}
        )
<<<<<<< HEAD
      }
      
||||||| merged common ancestors

      }
      
=======
      }      
>>>>>>> testing
      res.event = event
      next()
      return event
    })
    .catch(next)
  })

  .get(requireAuth)
  .get((req,res,next)=>{
    res.json(StressEventsService.serializeEvent(res.event))
  })
  
  .delete(requireAuth,(req,res,next)=>{
    StressEventsService.deleteEvent(
      req.app.get('db'),
      req.params.event_id
    )
    .then(numRowsAffected=>{
      res.status(204).end()
    })
    .catch(next)
  })
  
  .patch(requireAuth,jsonBodyParser,(req,res,next)=>{
    const {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping,date_recorded} = req.body
    const eventToUpdate = {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping,date_recorded}
    StressEventsService.updateEvent(
      req.app.get('db'),
      req.params.event_id,
      eventToUpdate
    )
    .then(numRowsAffected=>{
      res.status(204).end()
    })
    .catch(next)
  })

module.exports = eventRouter