const username = prompt("What is your Username?");

const socket = io("http://localhost:8000", {
  query: {
    username,
  },
});

let nsSocket = "";

//Listen for nsList, which is a a list of all namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of Namespaces has arrived!");

  let namespacesDiv = document.querySelector(".namespaces");

  namespacesDiv.innerHTML = "";

  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
  });

  //Add a click listener for each namespace
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    // console.log(elem);
    elem.addEventListener("click", (e) => {
      const nsEndPoint = elem.getAttribute("ns");
      // console.log(`${nsEndPoint} I should go to now`);

      joinNs(nsEndPoint);
    });
  });
});
