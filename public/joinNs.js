function joinNs(endpoint) {
  if (nsSocket) {
    //Check to see if nsSocket is actually a socket
    nsSocket.close();

    //Remove the Event Listener before it is added again
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }

  nsSocket = io(`http://localhost:8000${endpoint}`);

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
        // console.log(`Someone clicked on ${e.target.innerText}`);
        joinRoom(e.target.innerText);
      });
    });

    //Add Room automatically... First time here
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;

    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);

    const newMsg = buildHTML(msg);

    document.querySelector("#messages").innerHTML += newMsg;
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(e) {
  //Prevent Form from automatic Submission
  e.preventDefault();
  let inputBox = document.querySelector("#user-message");
  const newMessage = inputBox.value;

  nsSocket.emit("newMessageToServer", { text: newMessage });
  inputBox.value = "";
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHtml = `<li>
              <div class="user-image">
                <img src="${msg.avatar}" width="30" height="30"/>
              </div>
              <div class="user-message">
                <div class="user-name-time">${msg.username}<span> ${convertedDate}</span></div>
                <div class="message-text">${msg.text}</div>
              </div>
            </li>`;

  return newHtml;
}
