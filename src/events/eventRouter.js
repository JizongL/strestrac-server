const express = require('express')
const knexInstance = require('knex')
const eventRouter = express.Router()
const jsonBodyParser = express.json()
const StressEventsSerivce = require('./userEventsService')

eventRouter
  .route('/')
  .get((req,res,next)=>{
  const knexInstance = req.app.get('db')
  StressEventsSerivce.getAllEvents(knexInstance,2)
  .then(events=>{
    res.json(events)
  })
  .catch(next)

  
})



module.exports = eventRouter