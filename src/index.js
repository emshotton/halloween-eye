window.onload = function() {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext("2d");

	let flow = new oflow.WebCamFlow();
	let numBins = 6;
	let movement = new Array();

	flow.onCalculated(function (direction) {
		direction.zones.sort((a,b)=>{
			return a.y - b.y;
		});
		let maxVal = direction.zones[direction.zones.length -1].y;
		let minVal = direction.zones[0].y;

		let binWidth = (maxVal - minVal) / numBins;
		movement = new Array();
		for (let zone of direction.zones){
			let index = Math.floor((zone.y) / binWidth);
			if (movement[index] === undefined){
				movement[index] = [];
			} else {
				movement[index].push(zone);
			}
		}

		for (var i = 0; i < movement.length; i++) {
			let bin = movement[i];
			let numZones = bin.length;
			let sumValue = 0;
			for (let value of bin){
				let v = Math.abs(Math.pow(value.u, 2) + Math.pow(value.v, 2));
				sumValue += v;
			}
			movement[i] = sumValue / numZones;
		}

	});

	flow.startCapture();

	function render(){
		let w = ctx.canvas.width  = window.innerWidth;
		let h = ctx.canvas.height = window.innerHeight;
		let binWidth = w / numBins;
		let max = Math.max.apply(null, movement);

		let maxBinIndex = 0;
		let maxBinValue = 0;

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000";

		for (let i = 0; i < numBins; i++) {
			let x = i*binWidth;
			ctx.moveTo(x,0);
			ctx.lineTo(x,h);
			
			if (movement[i] === max){
				maxBinIndex = i;
			}

			ctx.moveTo(x + binWidth / 2, 0);
			ctx.lineTo(x + binWidth / 2, 2 * movement[i]);
		}
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 10;
		ctx.moveTo((maxBinIndex * binWidth) + binWidth / 2, 0);
		ctx.lineTo((maxBinIndex * binWidth) + binWidth / 2, h);
		ctx.stroke();


		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}