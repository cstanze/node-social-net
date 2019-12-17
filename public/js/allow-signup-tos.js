let agreeTos = document.querySelector('#agreeTos')

agreeTos.onclick = () => {
  if(agreeTos.checked) {
    document.querySelector('#finishForm').disabled = false
  } else {
    document.querySelector('#finishForm').disabled = true;
  }
}
