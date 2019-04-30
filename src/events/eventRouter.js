const express = require('express')
const eventRouter = express.Router()
const jsonBodyParser = express.json()
const StressEventsService = require('./userEventsService')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

eventRouter
  .route('/')
  .get(requireAuth)
  .get((req,res,next)=>{    
  const knexInstance = req.app.get('db')
  StressEventsService.getAllEvents(knexInstance,req.user.id)
  .then(events=>{
    res.json(events)
  })
  .catch(next)

  
})
.post(requireAuth,jsonBodyParser,(req,res,next)=>{
  const {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping} = req.body
  const newEvent = {stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping}
  newEvent.user_id = req.user.id
  console.log(newEvent,'test new event')
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
    console.log(event.id,'test event inside event router')
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${event.id}`))   
      .json(event) 
  })
  .catch(next)
})



module.exports = eventRouter