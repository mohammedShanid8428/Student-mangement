import axios from "axios";


const commonApi = async (reqURL, reqMethod, reqHeader = null, reqBody = null) => {
  const config = {
    url: reqURL,
    method: reqMethod,
  };


  if (reqBody) config.data = reqBody;


  const token = localStorage.getItem("token");
  config.headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...reqHeader,
  };

  const response = await axios(config);
  return response;
};

export default commonApi;
