const xhr = new XMLHttpRequest()

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
submitSettingsData = () => {
  if(typeof document.querySelector('#photo-change').files[0] == "object") {
    console.log(document.querySelector('#photo-change').files[0].name)
    console.log(window.location.href.replace(window.location.origin, "").splice(10, 0, "photo/"))
    xhr.open("POST", window.location.href.replace(window.location.origin, "").splice(10, 0, "photo/"))
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
  } else {
    console.log("Need Image Before Submitting Data")
  }
}
