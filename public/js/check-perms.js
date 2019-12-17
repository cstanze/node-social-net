let urlUserId = window.location.href.replace(window.location.origin, "").replace('/settings/', "")
if(urlUserId == localStorage.getItem('userId')) {
  console.log("Permissions Check Out... Continue.")
} else {
  console.log("Permission Insufficient... Redirecting...")
  window.location = window.location.origin + '/'
}
