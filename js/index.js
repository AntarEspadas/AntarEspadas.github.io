function toggleSidebar(){
	if(document.getElementById('sidebar').className=="sidebar-hidden"){
		var box = document.createElement("div");		box.id = "sidebar-outside";
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

function showLightbox(resultBox){
	docment.getElementById('lightbox').className="lightbox"
	}