const express = require('express')
const app = express()
const port = 3000

const path = require('path');
const http = require('http').Server(app)

const io = require('socket.io')(http);
var users = 0;
var roomnumber = 1;
var roomFull = 0;

// io socket ka code idhr hai on mtlb jaise hi connection establish hoye taise hi on click hoga

// custom namespace by default hota hai '/' ye hume agr custom banana ho
var cnsp = io.of('/custom');
// ye khale '/custom' endpoint pe hi chlega
cnsp.on('connection',(socket)=>{
  console.log("connection hogya at custom endpoint");
  socket.send("csutom name space ka example hai re")
})

// for namespace default '/'
io.on('connection',(socket)=>{
  console.log("connection hogya");
  // kuch data send krna using message event aur send function
  socket.send("hahahahahhaa")

  // custom event lene ka client se
  socket.on('narc',(data)=>{
    console.log(data)
  })
  users++;
  // iski help se sb users ko same message jaege agr koi pehle se exist krta hai toh uske liye use socket.broadcast.emitaur same sb
  // io.sockets.emit('broadcast',{message:users+'user conected'})
  
  // yera wo example
  socket.emit('customevent',{message:'ohoo naya aadmi hai re tu aagya'})
  socket.broadcast.emit('customevent',{message:users+'ek naya koi aaya hai idhr'})

  // room in socket.io
  socket.join("room"+roomnumber);
  io.sockets.in('room'+roomnumber).emit("connectedRoom","You are coonected to room number " + roomnumber);

  // aesa toh hai nhi ke rooms mai space kitna bhi hojaye uske liye we use limit on groups here it is roomFUll
  roomFull++;
  if(roomFull>=2){
    roomFull = 0;
    roomnumber++; //mtlb ke hum naye room mai shift hogye
  }

  // agr user disconnet hota toh
  socket.on('disconnect',()=>{
    console.log("connection hat gya ");
    users--;
    socket.broadcast.emit('customevent',{message:users+'ek naya koi aaya hai idhr'})
  })
})

// connection on index or / path
app.get('/', (req, res) => {
  const options= {
    root:path.join(__dirname)
  }
  res.sendFile('index.html',options)
})


http.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})