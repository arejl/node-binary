const addData = () => {
  fetch("http://localhost:8123", { method: "POST" })
    .then(res => res.json())
    .then(res => {
      document.getElementsByClassName("model")[0].innerHTML += `<br/> ${res.model}`;
      document.getElementsByClassName("serial")[0].innerHTML += `<br/> ${res.serial}`;
      document.getElementsByClassName("support")[0].innerHTML += `<br/> ${res.address}`;
      document.getElementsByClassName("sectors")[0].innerHTML += `<br/> ${res.sectors} (${res.diskSize} GB disk size)`;
    }
    );
};

document.getElementsByClassName("click-button")[0].addEventListener("click", addData, false);