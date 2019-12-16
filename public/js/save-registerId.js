window.onload = () => {
  let registerId = document.querySelector('#registerId').value
  localStorage.setItem('registerId', registerId);
  localStorage.setItem('isGuest', 'false')
}
