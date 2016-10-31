window.onload = function() {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext("2d");
	let flow = new oflow.WebCamFlow();

	let x = 0;
	let timeout = 40;
	let timeoutCount = 0;
	let previousValue = 0;


	let imageFilenames = [
		"./assets/images/c00.png",
		"./assets/images/c01.png",
		"./assets/images/c02.png",
		"./assets/images/c03.png",
		"./assets/images/c04.png",
		"./assets/images/c05.png",
		"./assets/images/c06.png",
		"./assets/images/c07.png",
		"./assets/images/c08.png",
		"./assets/images/c09.png",
		"./assets/images/c10.png",
		"./assets/images/c11.png",
		"./assets/images/c12.png",
		"./assets/images/c13.png",
		"./assets/images/c14.png",
		"./assets/images/c15.png",
		"./assets/images/c16.png"
	];

	let images = [];
	for (let filename of imageFilenames){
		let image = new Image();
		image.src = filename;
		images.push(image);
	}


	let closedEye = new Image();
	closedEye.src = "./assets/images/cclosed.png";



	flow.onCalculated(function (direction) {
		x += direction.u;
		if (x > 8) x = 8;
		if (x < -8) x = -8;
	});

	flow.startCapture();

	function render(){
		let w = ctx.canvas.width  = window.innerWidth;
		let h = ctx.canvas.height = window.innerHeight;
		
		let value =  Math.round(x);
		if (value === previousValue){
			timeoutCount += 1;
		}else{
			timeoutCount = 0;
		}
		previousValue = value;		
		
		if (timeoutCount < timeout){
			ctx.drawImage(images[value+8], 0, 0, w, h);
		}else{
			ctx.drawImage(closedEye, 0, 0, w, h);
		}
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}
