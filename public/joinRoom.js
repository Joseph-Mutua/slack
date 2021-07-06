function joinRoom(roomName) {
  //Send this root name to the Server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    //We want to update the room Memeber total ow that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span>`;
  });
}
