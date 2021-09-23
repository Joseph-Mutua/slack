const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000, () => {
  console.log("Server running on port 8000");
});

const io = socketio(expressServer);

let namespaces = require("./data/namespaces");

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

//Loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log("NSSOCKET HANDSHAKE", nsSocket.data);

    const username = usernameGenerator(6);

    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    //A chat has conected to one of our chat group namespaces
    //Send that ns group info back

    nsSocket.emit("nsRoomLoad", namespace.rooms);

    nsSocket.on("joinRoom", async (roomToJoin) => {
      //Deal with history, once its available

      console.log("ROOMS IN THIS NSSOCKET", nsSocket.rooms);

      //ROOM TO LEAVE
      const roomToLeave = nsSocket.rooms[1];
      nsSocket.leave(roomToLeave);

      updateUsersInRoom(namespace, roomToLeave);

      nsSocket.join(roomToJoin);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      console.log("NSROOM I JOINED", nsRoom);

      nsSocket.emit("historyCatchUp", nsRoom.history);

      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: "https://via.placeholder.com/30",
      };

      console.log(fullMsg);

      //Send this message to all sockets that are in the room this socket is in
      //How can we find out what rooms this socket is in??

      console.log("SOCKET ROOMS", nsSocket.rooms);

      //The user will be in the 2nd room in the object list
      //This is coz the socket is always in its own room on connection
      //Get the Keys

      const roomTitle = [...nsSocket.rooms][1];

      console.log("ROOM TITLE", roomTitle);

      // We need to find the room object for this room

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      console.log("NSroom", nsRoom);

      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

//Send back the number of users in this room to ALL sockets

async function updateUsersInRoom(namespace, roomToJoin) {
  const clientsUpdate = await io
    .of(namespace.endpoint)
    .in(roomToJoin)
    .allSockets();
  // Send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .emit("updateMembers", clientsUpdate.size);
}

//Generate Random Username
function usernameGenerator(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
