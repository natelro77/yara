const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");

function showCompliment(text) {
  modalText.innerText = text;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}
