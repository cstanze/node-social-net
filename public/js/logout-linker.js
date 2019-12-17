let logoutButton = document.querySelector(".logout")

if(!localStorage.getItem('registerId') || !localStorage.getItem('userId')) {
  logoutButton.innerText = "Sign Up/Log In"
} else {
  logoutButton.innerText = "Log Out"
}

logoutButton.onclick = () => {
  if(!localStorage.getItem('registerId') || !localStorage.getItem('userId')) {
    window.location = window.location.origin + "/signup"
  } else {
    localStorage.clear()
    window.location = window.location.origin + "/login"
  }
}
