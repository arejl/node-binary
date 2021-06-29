const addData = () => {
  fetch("http://localhost:8123", { method: "POST" })
    .then(res => res.json())
    .then(res => {
      document.getElementsByClassName("table")[0].innerHTML += `<span>${res.model}</span><span>${res.serial}</span><span>${res.address}</span><span>${res.sectors} (${res.diskSize} GB disk size)</span>`
    }
    );
};

document.getElementsByClassName("click-button")[0].addEventListener("click", addData, false);