const mongoose=require('mongoose')

mongoose.connect(process.env.MONG_URL).then((res)=>{
  console.log("server connect to mongoDB")
}).catch((err)=>{
  console.log(err)
})



