if(document.querySelector('#userId-login').value != "" || document.querySelector('#userId-login2').value != "") {
  localStorage.setItem('registerId', document.querySelector('#userId-login').value);
  localStorage.setItem('userId', document.querySelector('#userId-login2').value);
}
