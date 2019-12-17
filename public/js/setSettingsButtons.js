const xhr = new XMLHttpRequest()

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
submitSettingsData = () => {
  if(typeof document.querySelector('#photo-change').files[0] == "object") {
    console.log(document.querySelector('#photo-change').files[0].name)
    console.log(window.location.href.replace(window.location.origin, "").splice(10, 0, "photo/"))
    toBase64(document.querySelector('#photo-change').files[0]).then(baseImage => {
      xhr.open("POST", window.location.href.replace(window.location.origin, "").splice(10, 0, "photo/"))
      xhr.setRequestHeader('Content-Type', "application/json;charset=UTF-8")
      xhr.send(JSON.stringify({baseImage: baseImage.replace('data:image/jpeg;base64,', '')}))
    })
  } else {
    console.log("Need Image Before Submitting Data")
  }
}

toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
