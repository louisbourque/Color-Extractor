var app = app || {};
app.fileselect = document.getElementById("file-select-input");
app.error = document.getElementById("error");
app.output = document.getElementById("output");

if (window.File && window.FileList && window.FileReader) {
  // file select
  app.fileselect.addEventListener("change", FileSelectHandler, false);

  // file drop
  document.addEventListener("dragover", FileDragHover, false);
  document.addEventListener("dragleave", FileDragHover, false);
  document.addEventListener("drop", FileSelectHandler, false);
  document.getElementById("filedrag").style.display = "block";
}

// file drag hover
function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
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
    console.log(imageHTML);

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
  console.log(imageElement);
  return 'Height: '+imageElement.height+' Width: '+imageElement.width;
}
