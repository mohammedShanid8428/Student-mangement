const Student=require('../models/studentModels')

exports.createStudent=async(req,res)=>{
  try{
    const newStudent=new Student(req.body)
    await newStudent.save()
    res.status(201).json({message:"Student is created",newStudent})
  }catch(err){
    console.log(err)
    res.status(500).json({message:"faield to create student",error:err.message})
  }
}