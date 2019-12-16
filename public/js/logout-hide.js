var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector(".logout").setAttribute("style", "top: 0 !important;");
  } else {
    document.querySelector(".logout").setAttribute("style", "top: -50px !important");
  }
  prevScrollpos = currentScrollPos;
}
