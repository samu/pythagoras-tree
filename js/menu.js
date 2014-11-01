// code taken from
// http://www.webtutorialsource.com/tutorial/show-hide-toggle-sliding-menu-css-javascript/

function toggle(id) {
  var el = document.getElementById(id);
  var img = document.getElementById("arrow");
  var box = el.getAttribute("class");
  if(box == "hide"){
    el.setAttribute("class", "show");
    delay(img, "style/arrowright.png", 400);
  }
  else{
    el.setAttribute("class", "hide");
    delay(img, "style/arrowleft.png", 400);
  }
}

function delay(elem, src, delayTime){
  window.setTimeout(function() {elem.setAttribute("src", src);}, delayTime);
}
