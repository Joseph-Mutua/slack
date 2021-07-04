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
