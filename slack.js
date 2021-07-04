const express = require("express");
const app = express();
const socketio = require("socket.io");



app.use(express.static(__dirname + "/publics"));

const expressServer = app.listen(8000, () => {
  console.log("Server running on port 8000");
});

const io = socketio(expressServer);

//Wait for any socket to connect and respond
io.on("connection", (socket) => {
  socket.emit("messageFromServer", {
    data: "Welcome to the socketio Server!!  ",
  });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.on("newMessageToServer", (msg) => {
    //Emit the message to all connected Clients
    io.emit("messageToClients", { text: msg.text });
  });
});
