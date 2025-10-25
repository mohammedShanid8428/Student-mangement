import axios from 'axios'
import { config } from 'dotenv';

const commonApi=async(reqURL,reqMethod,reqHeader=null,reqBody=null)=>{
  const config={
    url:reqURL,
    method:reqMethod
  }

  if(reqHeader) config.headers=reqHeader
  if(reqBody) config.data = reqBody;


  const response=await axios(config)
  return response;
}

export default commonApi

