require('dotenv').config()
const express=require('express')
const cors=require('cors')
require('./connection/dbConnection')



const server=express()

server.use(cors())
server.use(express.json())


const PORT=3000||process.env.PORT

server.listen(PORT,()=>{
  console.log("server is running at:",PORT)
})


