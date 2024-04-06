const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db')
connectDB()
const app = express();
const cors=require("cors");
app.use(cors());





const userRoutes = require('./routes/userRoutes');


const { notFound,errorHandler } = require("./middleware/errorMiddleware");


const port = process.env.PORT || 5000;

app.use('/api/user',userRoutes)


//===================================================
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/jovita',(req,res)=>{

  res.sendFile(__dirname + '/index.html');
})
//===================================================



app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log("server running on", port);
});