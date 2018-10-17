$(document).ready(function(){

let txt = document.getElementById('message'), 
  hiddenDiv = document.createElement('div'),
  content = null;

txt.classList.add('txtstuff');
hiddenDiv.classList.add('hiddendiv', 'common');

document.body.appendChild(hiddenDiv);

txt.addEventListener('keyup', function () { //extends text area when enter is pressed

  content = this.value;
  hiddenDiv.innerHTML = content + '\n\n';
  this.style.height = hiddenDiv.getBoundingClientRect().height + 'px';

}, false);

let limit = null

$('#competition').click( function ()  { //hides or shows additional input values, depending on competition type
  setTimeout(function(){console.log($('#competition').val());
  if($('#competition').val() == 'roundrobin') {
    limit = 4;
  } else if($('#competition').val() == 'singles'){
    limit = 32;
  }  else {
    limit = 0;
  }}, 2000);
});

let textarea = document.getElementById("message");
let spaces = textarea.getAttribute("cols");

textarea.onkeyup = function() { //limits the number of lines that can be entered in textarea
  let lines = textarea.value.split("\n");
  
  for (let i = 0; i < lines.length; i++) {

    if (lines[i].length <= spaces) continue;
      let j = 0;
      let space = spaces;   

    while (j++ <= spaces){
      if (lines[i].charAt(j) === " ") space = j;  
    }
    lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
    lines[i] = lines[i].substring(0, space);
  }

  if(lines.length > limit){
    textarea.style.color = 'red';
    setTimeout(function(){
      textarea.style.color = '';
    },500)
  }     

  textarea.value = lines.slice(0, limit).join("\n");

};
});


