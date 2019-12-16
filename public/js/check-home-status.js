if(document.querySelector('#userId-login').value == "" || document.querySelector('#userId-login2').value == "" || localStorage.getItem('userId') != "") {
  console.log("Passed")
  if(!(window.location == window.location.origin+'/home')) {
    window.location = window.location.origin + '/home'
  }
}
