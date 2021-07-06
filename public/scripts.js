const socket = io("http://localhost:8000");

//Listen for nsList, whic is a a list of all namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of Namespaces has arrived!");

  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
  });

  //Add a click listener for each namespace
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    console.log(elem);
    elem.addEventListener("click", (e) => {
      const nsEndPoint = elem.getAttribute("ns");
      console.log(`${nsEndPoint} I should go to now`);
    });
  });

  const nsSocket = io("http://localhost:8000/wiki");

  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }

      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });

    //Add a click listener for each Room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log(`Someone clicked on ${e.target.innerHTML}`);
      });
    });
  });
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "This is from the Client" });
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  //Prevent Form from automatic Submission
  e.preventDefault();
  let inputBox = document.querySelector("#user-message");
  const newMessage = inputBox.value;

  socket.emit("newMessageToServer", { text: newMessage });
  inputBox.value = "";
});

socket.on("messageToClients", (msg) => {
  document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
});
