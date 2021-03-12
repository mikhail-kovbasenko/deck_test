import React, {useEffect, useRef} from 'react';
import sun from './sun.jpg';
import moon from './moon.png';

export default function Canvas({draw}) {
	const canvasRef = useRef(null);

	function drawPoint(ctx, x, y) {
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawImage(ctx, x, y, src, time) {
		const img = new Image();
		img.src = src;
		img.width = '10';
		img.height = '10';
		img.onload = function() {
			ctx.drawImage(img, x, y, 40, 40);	
			ctx.fillText(time, x, y + 5);
		}
		
	}
	useEffect(() => {
		const cnvs = canvasRef.current;
		
		const ctx = cnvs.getContext('2d');
		ctx.canvas.width = 300;
		ctx.canvas.height = 200;
		ctx.arc(150,125,100,0, Math.PI,true);
		ctx.stroke();
		drawPoint(ctx, draw.x_rise, draw.y_rise);
		drawImage(ctx, draw.x_rise - 30, draw.y_rise, moon, draw.time_set);
		drawPoint(ctx, draw.x_set, draw.y_set);
		drawImage(ctx, draw.x_set + 4, draw.y_set, sun, draw.time_rise);

		ctx.fillText('00:00', 20, 125);
		ctx.fillText('23:59', 255, 125);
	})

	return (
		<canvas className="canvas" ref={canvasRef}>

		</canvas>
	)
}