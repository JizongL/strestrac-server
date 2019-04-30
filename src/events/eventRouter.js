const express = require('express')
const eventRouter = express.Router()
const jsonBodyParser = express.json()
const StressEventsSerivce = require('./userEventsService')
const { requireAuth } = require('../middleware/jwt-auth')

eventRouter
  .route('/')
  .get(requireAuth)
  .get((req,res,next)=>{
    
  const knexInstance = req.app.get('db')
  StressEventsSerivce.getAllEvents(knexInstance,req.user.id)
  .then(events=>{
    res.json(events)
  })
  .catch(next)

  
})
.post(jsonBodyParser,(req,res,next)=>{

})



module.exports = eventRouter