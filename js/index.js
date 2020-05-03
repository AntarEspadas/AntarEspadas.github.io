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
		//document.getElementById('sidebar-outside').className="sidebar-outside-hidden";
	}
}

function showLightbox(){
		var box = document.createElement("div");
		box.id = "lightbox";
		box.addEventListener("click",hideLightbox);
		document.body.appendChild(box);
		
		var image = document.createElement("img");
		console.log(this);
		image.src = this.children[1].src;
		image.id = "lightbox-image";
		document.body.appendChild(image);
		}
	
function hideLightbox(){
		var box = document.getElementById("lightbox");
		document.body.removeChild(box);
		
		var image = document.getElementById("lightbox-image");
		document.body.removeChild(image);
}

function addResult(imageAdress, informationLabels, informationElements){
		var resultElement = document.createElement("div");
		resultElement.className = "result-element";
		resultElement.addEventListener = ("click", showLightbox, false);
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

function addResultTest(){
		var imageAdress = "images/000___1582350169.png";
		var informatoinLabels = ["Title", "Chapter", "Page"];
		var informatoinElements = ["Chika Fujiwara wants to make it swell", "91", "1"];

		addResult(imageAdress, informatoinLabels, informatoinElements)
}