
(function() {
	"use strict";

	var FIELD_W = 300, FIELD_H = 600;
	var COLS = 10, ROWS = 20;
	var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
	var canvas = document.getElementById("field");
	var ctx = canvas.getContext("2d");//おまじない
	var canvas2 = document.getElementById("next_field");
	var ctx2 = canvas2.getContext("2d");
	var current_x=3, current_y=-2;
	var field = [];
	var tmp;
	var isRunning = false;
	var timer_id;
	var speed = 1000;
	var scoreLabel = document.getElementById("score");
	scoreLabel.innerHTML = 0;
	var score = 0;

	var current_mino;
	var second_mino;
	var COLORS = ["silver", "gold", "limegreen", "firebrick", "royalblue", "orangered", "darkviolet"];

	var MINOS = [
		[[0,0,0,0],
		 [0,0,0,0],
		 [1,1,1,1],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [0,2,2,0],
		 [0,2,2,0],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [3,3,0,0],
		 [0,3,3,0],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [0,4,4,0],
		 [4,4,0,0],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [5,0,0,0],
		 [5,5,5,0],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [0,0,6,0],
		 [6,6,6,0],
		 [0,0,0,0]]
		 ,
		[[0,0,0,0],
		 [0,7,0,0],
		 [7,7,7,0],
		 [0,0,0,0]]
	];

	function init() {
		score = 0;
		scoreLabel.innerHTML = 0;
		speed = 1000;
		current_x = 3;
		current_y=-2;
		for(var x=0; x<COLS; x++) {
			for(var y=0; y<ROWS; y++) {
				field[x][y] = 0;
			}
		}
		ctx.fillStyle = "#2B96DC";
		ctx.clearRect(0, 0, FIELD_W, FIELD_H);
		ctx2.fillStyle = "#FFC300";
		ctx2.clearRect(0, 0, 180, 180);
	}

	for(var x=0; x<COLS; x++) {
		field[x] = [];
		for(var y=0; y<ROWS; y++) {
			field[x][y] = 0;
		}
	}

	current_mino = newMino();
	second_mino = newMino();
	//render();

	window.addEventListener("keydown",function(e){
		switch (e.keyCode) {
			case 37: // ←
				if(canMove(-1, 0)) {
					current_x -= 1;
					render();
				}
				break;
			case 38: //↑
				tmp = rotate(current_mino);
				if(canMove(0, 0, tmp)) {
					current_mino = tmp;
					render();
				}
				break;
			case 39: // →
				if(canMove(1, 0)) {
					current_x +=1;
					render();
				}
				break;
			case 40: // ↓
				if(canMove(0, 2)){
					current_y +=2;
					render();
			    }
				break;
			case 32:
				if(!isRunning) {
					isRunning = true;
					updateTimer(speed);
				}
				break;
			case 27:
				init();
				console.log("esc");
				clearTimeout(timer_id);
				isRunning = false;
				break;
		}
	});

	function updateTimer(spd) {
		timer_id = setInterval(function(){
			if(canMove(0,1)) {
				current_y++;
			} else {
				fix();
				clearRows();
				current_mino = second_mino;
				second_mino = newMino();
				current_x = 3;
				current_y = -2;
			}
			if(check_over()) {
				clearTimeout(timer_id);
			} else {
				render();
			}
		}, spd);
	}

	function rotate(mino) {
		var rotated = [];
		for(var x = 0; x<4; x++){
			rotated[x]=[];
			for(var y=0; y<4; y++){
				rotated[x][y] = mino[-y+3][x];
			}
		}
		return rotated;
	}

	function newMino() {
		var index = Math.floor(Math.random()*MINOS.length);
		return MINOS[index];
	}

	function draw_block(x,y,block) {
		if(block){
			ctx.fillStyle = COLORS[block-1];
			ctx.fillRect(x*BLOCK_W, y*BLOCK_H, BLOCK_W-1, BLOCK_H-1);
			ctx.strokeRect(x*BLOCK_W, y*BLOCK_H, BLOCK_W-1, BLOCK_H-1);
		}
	}

	ctx2.strokeStyle = "black";
	function draw_secondMino() {
		ctx2.clearRect(0, 0, FIELD_W, FIELD_H);
		for(var x=0; x<4;x++) {
			for(var y=0; y<4; y++) {
				if(second_mino[x][y]) {
					if(second_mino[x][y] == 1) {
						ctx2.fillStyle = COLORS[second_mino[x][y]-1];
						ctx2.fillRect(x*BLOCK_W, (y+1)*BLOCK_W, BLOCK_W-1, BLOCK_H-1);
						ctx2.strokeRect(x*BLOCK_W, (y+1)*BLOCK_W, BLOCK_W-1, BLOCK_H-1);
					} else {
						ctx2.fillStyle = COLORS[second_mino[x][y]-1];
						ctx2.fillRect((x+1)*BLOCK_W, (y+1)*BLOCK_W, BLOCK_W-1, BLOCK_H-1);
						ctx2.strokeRect((x+1)*BLOCK_W, (y+1)*BLOCK_W, BLOCK_W-1, BLOCK_H-1);
					}
				}
			}
		}
	}

	function fix() {
		for(var x=0; x<4; x++) {
			for(var y=0; y<4; y++) {
				if(current_mino[x][y]){
					field[x+current_x][y+current_y] = current_mino[x][y];
				}
			}
		}
	}

	function render() {
		if(isRunning) {
			ctx.clearRect(0, 0, FIELD_W, FIELD_H);
			ctx.strokeStyle = "black";
			for(var i=0; i< 4; i++) {
				 for(var j=0; j<4; j++) {
				 	draw_block(i+current_x, j+current_y, current_mino[i][j]);
				 }
			}
			for(var x=0; x<COLS; x++) {
				for(var y=0; y<ROWS; y++) {
					draw_block(x,y,field[x][y]);
				}
			}
			draw_secondMino();
			scoreLabel.innerHTML = score;
		}
	}

	function canMove(s, t, move_mino) {
		var move_x = s;
		var move_y = t;
		var next_x = current_x + move_x; 	
		var next_y = current_y + move_y;
		var next_mino = move_mino || current_mino;
		for(var x=0; x<4; x++){
			for(var y=0; y<4; y++){
				if(next_mino[x][y] != 0) {
					if(next_y + y >= ROWS
						|| next_x + x >= COLS
						|| next_x + x < 0 
						||field[x+next_x][y+next_y]) {
						return false;
					}
				}
			}
		}
	 	return true;
	}

	var hukusuudan=false;
	function clearRows() {
		for(var y=ROWS-1; y>=0; y--) {
			var fill = true;
			if(hukusuudan){
				y++;
				hukusuudan=false;
			}
			for(var x=0; x<COLS; x++){
				if(field[x][y] == 0){
					fill = false;
					break;
				}
			}
			if(fill) {
				score+=10;
				if(speed > 100) {
					if(score%40 == 0) {
						speed -= 100;
						clearTimeout(timer_id);
						updateTimer(speed);
					}
				}
				hukusuudan=true;
				for(var t=y-1;t>=0;t--){
					for(var x=0; x<COLS; x++) {
						field[x][t+1] = field[x][t];
					}
				}
			}
		}
	}

	function check_over() {
		for(var x=0; x<COLS; x++) {
			if(field[x][0] != 0) {
				return true;
			}
		}
	}
})();