function joinRoom(roomName) {
  //Send this root name to the Server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    //We want to update the room Memeber total ow that we have joined
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
  nsSocket.on("UpdateMembers", (numMembers) => {
    //We want to update the room Memeber total ow that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`;

    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });
}
