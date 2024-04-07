const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db')
connectDB()
const app = express();
const cors=require("cors");
app.use(cors());




app.use(express.json())

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


const { notFound,errorHandler } = require("./middleware/errorMiddleware");


const port = process.env.PORT || 5000;


app.use('/api/user',userRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//===================================================
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/jovita',(req,res)=>{

  res.sendFile(__dirname + '/index.html');
})
//===================================================



app.use(notFound)
app.use(errorHandler)

const server = app.listen(port, () => {
  console.log("server running on", port);
});

const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000"
  }
})

io.on("connection",(socket)=>{
  console.log("connected to socket.io")

  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    socket.emit('connected')
  })

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("User joined room: " + room)
    console.log(socket.rooms)
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on('new message',(newMessageReceived)=>{
    var chat = newMessageReceived.chat;

    if(!chat.users) return console.log("chat.users not defined")

    chat.users.forEach((user)=>{
      if(user._id == newMessageReceived.sender._id) return;

      socket.in(chat._id).emit("message received",newMessageReceived)
    })
  })

  socket.on("changeRoom",(userData)=>{
    socket.rooms.forEach(room => {
      if (room !== socket.id && room !== userData._id) {
        socket.leave(room);
        console.log("LEFT",room)

      }
    });
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    if(userData._id in socket.rooms){
      socket.leave(userData._id);
    }
    
  });

})
