const xhr = new XMLHttpRequest();

if(localStorage.getItem("isGuest") == null || localStorage.getItem('isGuest') == "false") {
  if(!localStorage.getItem("userId")) {
    console.log("No User ID Present. Retrieving register id now...")
    if(!localStorage.getItem("registerId")) {
      console.log("No Register ID Present. Entering Guest Mode...")
      localStorage.setItem("isGuest", "true")
    } else {
      console.log("Register ID Present. Retrieving user id now...")
      xhr.open("GET", `/user/registerId/${localStorage.getItem('registerId')}`)
      xhr.setRequestHeader('authid', '_ax791')
      xhr.send()
    }
  } else {
    console.log("User ID Present... Quitting XHR Now...")
  }
} else {
  console.log("User Is In Guest Mode...")
}

xhr.onload = () => {
  if(xhr.status == 200) {
    let parsedResponse = JSON.parse(xhr.responseText);
    let userId = parsedResponse._id
    localStorage.setItem('userId', userId);
  } else {
    console.log("Err: "+xhr.responseText)
  }
}
