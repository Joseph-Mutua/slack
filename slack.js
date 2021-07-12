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
  // console.log(nsData);
  //Send the nsData back to the client, using SOCKET not IO,
  //as we want it to go the client

  socket.emit("nsList", nsData);
});

let namespaces = require("./data/namespaces");

//Loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

    //A chat has conected to one of our chat group namespaces
    //Send thtat ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallback) => {
      //Deal with history, once its available

      nsSocket.join(roomToJoin);

      //Get no of members in the room
      // const clients = await io.of("/wiki").in(roomToJoin).allSockets();

      // // console.log(clients.size);

      // numberOfUsersCallback(clients.size);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      console.log("NSROOM I JOINED", nsRoom);

      nsSocket.emit("historyCatchUp", nsRoom.history);

      //Send back the number of users in this room to ALL sockets

      const clientsUpdate = await io.of("/wiki").in(roomToJoin).allSockets();
      console.log("THE NEW NUMBER OF CLIENTS IS", clientsUpdate.size);

      io.of("/wiki").in(roomToJoin).emit("UpdateMembers", clientsUpdate.size);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "Joseph Mutua",
        avatar:
          "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Avatar-Teaser-Poster.jpg/220px-Avatar-Teaser-Poster.jpg",
      };

      console.log(fullMsg);

      //Send this message to all sockets that are in the room this socket is in
      //How can we find out what rooms this socket is in??

      console.log("SOCKET ROOMS", nsSocket.rooms);

      //The user will be in the 2nd room in the object list
      //This is coz the socket is alwatys in its own room on connection
      //Get the Keys

      const roomTitle = Object.keys(nsSocket.rooms);

      console.log("ROOM TITLE", roomTitle);

      //We need to find the room object for this room
      const nsRoom = namespaces[0].rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      console.log("NSroom", nsRoom);

      nsRoom.addMessage(fullMsg);

      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});
