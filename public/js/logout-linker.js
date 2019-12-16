let newPostButton = document.querySelector(".logout")
newPostButton.onclick = () => {
  localStorage.clear()
  window.location = window.location.origin + "/"
}
