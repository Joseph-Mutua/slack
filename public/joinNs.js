function joinNs(endpoint) {
  const nsSocket = io(`http://localhost:8000/${endpoint}`);
  

  nsSocket.on("nsRoomLoad", (nsRooms) => {
    console.log(nsRooms);
    //Get the rooms in that Namespace
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
        console.log(`Someone clicked on ${e.target.innerText}`);
      });
    });
  });

  nsSocket.on("messageToClients", (msg) => {
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
  });

  document.querySelector(".message-form").addEventListener("submit", (e) => {
    //Prevent Form from automatic Submission
    e.preventDefault();
    let inputBox = document.querySelector("#user-message");
    const newMessage = inputBox.value;

    socket.emit("newMessageToServer", { text: newMessage });
    inputBox.value = "";
  });
}
