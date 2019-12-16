let userIdField = document.querySelector('#userId')
if(localStorage.getItem('isGuest') == "true") {
  document.write("<h1>Can't Post In Guest Mode!</h1>")
  setInterval(() => {
    window.location = window.location.origin + '/home'
  }, 5000)
} else {
  if(localStorage.getItem('userId')) {
    userIdField.value = localStorage.getItem('userId')
  }
}
