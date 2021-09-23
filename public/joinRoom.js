function joinRoom(roomName) {
  //Send this root name to the Server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    //We want to update the room Member total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`;
  });

  nsSocket.on("historyCatchUp", (history) => {
    // console.log(history);
    const messagesUL = document.querySelector("#messages");
    messagesUL.inerHTML = "";
    history.forEach((msg) => {
      const newMSG = buildHTML(msg);
      const currentMessages = messagesUL.innerHTML;
      messagesUL.innerHTML = currentMessages + newMSG;
    });
    messagesUL.scrollTo(0, messagesUL.scrollHeight);
  });

  nsSocket.on("updateMembers", (numMembers) => {
    //We want to update the room Member total ow that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`;

    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

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
}
