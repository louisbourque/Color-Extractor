var app = app || {};
app.fileselect = document.getElementById("file-select-input");
app.error = document.getElementById("error");
app.output = document.getElementById("output");
app.dropTarget = document.getElementById("filedrag");

if (window.File && window.FileList && window.FileReader) {
  // file select
  app.fileselect.addEventListener("change", FileSelectHandler, false);

  // file drop
  document.addEventListener("dragover", FileDragHover, false);
  document.addEventListener("dragleave", FileDragHover, false);
  document.addEventListener("drop", FileSelectHandler, false);
  document.getElementById("filedrag").style.display = "block";

  live('button.copy-button', 'click', function(e){ copyTextToClipboard(e.target.getAttribute('data-hex')); });
}

// file drag hover
function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	app.dropTarget.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e) {

	// cancel event and hover styling
	FileDragHover(e);

  //clear current results
  app.error.innerHTML = "";
  app.output.innerHTML = "";

	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files;

	// process all File objects
	for (var i = 0, f; f = files[i]; i++) {
		if(f.type.substring(0,5) != "image"){
      app.error.innerHTML += "Unsupported file type: "+f.name+"<br>";
    }else{
      loadImage(f);
    }
	}
}

function loadImage(image){
  var fr = new FileReader();
  fr.onload = function(e){
    var imageHTML = getImageHTML(e.target.result);

    app.output.appendChild(imageHTML);
    var img = imageHTML.getElementsByTagName('img')[0];
    var details = imageHTML.getElementsByClassName('image-details')[0];

    // Must wait for image to load in DOM, not just load from FileReader
    addEvent(img, 'load', function(){
      details.innerHTML = getImageDetails(img);
      //scroll to results selection
      document.documentElement.scrollTop = document.body.scrollTop = offset(app.output).top;
    });
  };
  fr.readAsDataURL(image);
}

function getImageHTML(imageDataURI){
  var newDiv = document.createElement("div");
  newDiv.className = 'image-div';
  newDiv.innerHTML = '<img src="'+imageDataURI+'"><div class="image-details"></div>';
  return newDiv;
}

function getImageDetails(imageElement){
  var colors = getPalette(imageElement);
  var hex = colorArrayToHex(colors[0]);
  var innerHTML = '<div class="color-block-container primary"><div class="color-block-inner"><p>Primary: </p><div class="color-block primary '+(getBrightness(colors[0]) < 90 ? 'dark' : '')+'" style="background-color:'+hex+';">'+hex+'</div><button title="Copy to clipboard" class="copy-button" data-hex="'+hex+'"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg></button></div></div>';

  for(var i = 1;i<colors.length;i++){
    hex = colorArrayToHex(colors[i]);
    innerHTML+= '<div class="color-block-container"><div class="color-block-inner"><div class="color-block '+(getBrightness(colors[i]) < 90 ? 'dark' : '')+'" style="background-color:'+hex+';">'+hex+'</div><button title="Copy to clipboard" class="copy-button" data-hex="'+hex+'"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg></button></div></div>';
  }
  return innerHTML;
}

function colorArrayToHex(array){
  var hex = array[0] < 16 ? '0'+array[0].toString(16) : array[0].toString(16);
  hex += array[1] < 16 ? '0'+array[1].toString(16) : array[1].toString(16);
  hex += array[2] < 16 ? '0'+array[2].toString(16) : array[2].toString(16);
  return '#'+hex;
}

function getBrightness(color){
  return (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
}
