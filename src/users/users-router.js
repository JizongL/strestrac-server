const express = require('express')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')
const UsersService = require('./users-service')

// create new user
usersRouter
  .post('/',jsonBodyParser,(req,res,next)=>{
    const {password,user_name,full_name} = req.body
    for (const field of ['full_name', 'user_name', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    // validate password match standards        
    const passwordError = UsersService.validatePassword(password)
    if(passwordError){
      return res.status(400).json({ error: passwordError })
    }  
    // verify password exists
    UsersService.hasUserWithUserName(
      req.app.get('db')
      ,user_name
    )
    // if user exists, prompt 
    .then(hasUserWithUserName=>{
      if(hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` })          
    return UsersService.hashPassword(password)
      .then(hashPassword=>{
        const newUser = {
          user_name,
           password:hashPassword,
           full_name,           
           date_created: 'now()',
        }
      
      
    return UsersService.insertUser(
       req.app.get('db'),
       newUser
     )
       .then(user => {
         res
           .status(201)
           .location(path.posix.join(req.originalUrl, `/${user.id}`))
           .json(UsersService.serializeUser(user))
       })
    })
  })
    .catch(next)  
})
    
module.exports = usersRouter