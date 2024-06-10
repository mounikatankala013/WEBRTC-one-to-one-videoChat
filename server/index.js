
const {Server} = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

app.get('/health', (_,res) => {
     res.send("server is running");
})
app.use(cors);
const port =8000;
const server = http.createServer(app);

const io = new Server(server,{
     cors:{
          origin: '*',
          credentials: true,
          
     },
     allowEIO3:true
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap= new Map();
io.on("connection",(socket)=>{
     io.emit("server is running");
     console.log(`Socket connected`,socket.id);
     socket.on("room:join",(data)=>{
          const {email,room} = data;
          emailToSocketIdMap.set(email,socket.id);
          socketidToEmailMap.set(socket.id,email);
          io.to(room).emit("user:joined",{email,id:socket.id});
          socket.join(room);

          io.to(socket.id).emit("room:join",data);
     } );

     socket.on('user:call',({to,offer})=>{
          io.to(to).emit('incoming:call',{from: socket.id,offer});
     })

     socket.on("call:accepted",({to,ans})=>{
          io.to(to).emit('call:accepted',{from: socket.id,ans});
     });

     socket.on('peer:nego:needed',({to,offer})=>{
          io.to(to).emit('peer:nego:needed',{from: socket.id,offer});  
        })

     socket.on("peer:nego:done",({to,ans})=>{
          io.to(to).emit('peer:nego:done',{from: socket.id,ans});  
     });
});

server.listen(port, () => {
     console.log(`listening on *:${port}`);
 });