let xhr = new XMLHttpRequest();
let urlUserId = window.location.href.replace(window.location.origin, "").replace('/profile/id/', "")
console.log(urlUserId)
xhr.open("GET", `/user/id/${urlUserId}`)
xhr.setRequestHeader("authid", "_ax791");
xhr.send()
xhr.onload = () => {
  if(xhr.status == 200) {
    let userObject = JSON.parse(xhr.responseText);
    document.querySelector('.inner-banner').src = userObject.userBanner
  } else {
    console.log("Err: "+xhr.responseText);
  }
}
