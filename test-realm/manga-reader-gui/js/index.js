var hideLightboxDone = true;

function toggleSidebar(){
	if(document.getElementById('sidebar').className=="sidebar-hidden"){
		var box = document.createElement("div");
		box.id = "sidebar-outside";
		box.addEventListener("click",toggleSidebar)
		document.body.appendChild(box);

		document.getElementById('sidebar').className="sidebar";	}
	else{
		var box = document.getElementById("sidebar-outside");
		document.body.removeChild(box)
		
		document.getElementById('sidebar').className="sidebar-hidden";
	}
}

function showLightbox(){
		var box = document.createElement("div");
		box.id = "lightbox";
		box.addEventListener("click",hideLightbox);
		document.body.appendChild(box);
		
		var image = document.createElement("img");
		image.src = this.children[1].src;
		image.id = "lightbox-image";
		document.body.appendChild(image);
		}
	
function hideLightbox(){
		if(!hideLightboxDone){
			return;
		}
		hideLightboxDone = false;
		var box = document.getElementById("lightbox");
		box.style.opacity = "0";
		box.animate([
			// keyframes
			{ opacity: '0.75' }, 
			{ opacity: '0' }
		  ], { 
			// timing options
			duration: 250
		  });
		setTimeout(() => { document.body.removeChild(box); }, 250);
		
		var image = document.getElementById("lightbox-image");
		image.style.opacity = "0";
		image.animate([
			// keyframes
			{ opacity: '1' }, 
			{ opacity: '0' }
		  ], { 
			// timing options
			duration: 250
		  });
		setTimeout(() => { document.body.removeChild(image); }, 250);
		setTimeout(() => { hideLightboxDone = true; }, 251);
}

function addResult(imageAdress, informationLabels, informationElements){
		var resultElement = document.createElement("div");
		resultElement.className = "result-element";
		resultElement.addEventListener("click", showLightbox, false);
		document.getElementById("results").appendChild(resultElement);

		var resultInfo = document.createElement("div");
		resultInfo.className = "result-info";
		resultElement.appendChild(resultInfo);

		for (let index = 0, info; index < informationLabels.length; index++) {
			info = document.createElement("p");
			info.textContent = informationLabels[index] + ": " + informationElements[index];
			resultInfo.appendChild(info);
		}

		var image = document.createElement("img");
		image.className = "result-image";
		image.src = imageAdress;
		resultElement.appendChild(image);
		
		
		}

function clearResults(){
		var results = document.getElementsByClassName("result-element");
		var loops = results.length;
		for (let index = 0; index < loops; index++) {
			document.getElementById("results").removeChild(results[0]);
		}
}

function searchBarKeyDown(event) {
	if(event.keyCode === 13){
		clearResults()
		batchAddResultTest(7, 250);
	}
}

function addResultTest(){
		var imageAdress = "images/000___1582350169.png";
		var informatoinLabels = ["Title", "Chapter", "Page"];
		var informatoinElements = ["Chika Fujiwara wants to make it swell", "91", "1"];

		addResult(imageAdress, informatoinLabels, informatoinElements)
}


function batchAddResultTest(amount, delay){
	for (let index = 0; index < amount; index++) {
		setTimeout(() => { addResultTest(); }, delay*index);
	}
}