if(document.querySelector('#userId-login').value == "" || document.querySelector('#userId-login2').value == "" || localStorage.getItem('userId') != "") {
  console.log("Passed")
  if(!(window.location == window.location.origin+'/')) {
    window.location = window.location.origin + '/'
  }
}
