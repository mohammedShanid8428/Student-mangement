require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./connection/dbConnection'); 

const studentRoutes = require('./routes/StudentRoutes');

const server = express();

server.use(cors());
server.use(express.json());


server.use('/api', studentRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
