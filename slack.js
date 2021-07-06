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
  //Build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  console.log(nsData);
  //Send the nsData back to the client, using SOCKET not IO,
  //as we want it to go the client

  socket.emit("nsList", nsData);
});

let namespaces = require("./data/namespaces");

//Loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    //A chat has conected to one of our chat group namespaces
    //Send thtat ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
  });
});
