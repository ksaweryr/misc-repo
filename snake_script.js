const init_game = () => {
	window.score_display = document.getElementById("snake_score");
	window.canva = document.getElementById("snake_field");
	window.ctx = canva.getContext("2d");

	window.WIDTH = canva.getBoundingClientRect().width;
	window.HEIGHT = canva.getBoundingClientRect().height;
	window.score = 0;

	window.player = new Snake(WIDTH/20, HEIGHT/20);
	deploy_food();

	// keyboard event listener //
	document.addEventListener('keydown', (e) => {
		player.movement_queue.unshift(e.code);
	});

	score_display.innerHTML = score;
}

const deploy_food = () => {
	let x = Math.floor(Math.random() * (WIDTH/10 - 1) + 1);
	let y = Math.floor(Math.random() * (HEIGHT/10 - 1) + 1);
	window.food = [x, y];
}

const draw_food = () => {
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(food[0]*10, food[1]*10, 10, 10);
}

const draw_background = () => {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

const main_loop = () => {
	draw_background();
	player.update();
	draw_food();
}

const run_snake = () => {
	console.log('JSnake v1.0 by Ksaweryr. Contact author for more info.');
	init_game();
	window.setInterval(main_loop, 50);
}

// class representing segment of a snake //
function SnakeSegment(x=0, y=0) {
	this.x = x;
	this.y = y;
}

// WARNING!!! ctx.fillStyle is NOT altered by this function!
SnakeSegment.prototype.draw = function() {
	ctx.fillRect(this.x*10, this.y*10, 10, 10);
};

SnakeSegment.prototype.get_pos = function() {
	return [this.x, this.y];
};

SnakeSegment.prototype.set_pos = function(pos) {
	this.x = pos[0];
	this.y = pos[1];
};

// class representing snake //
function Snake(x, y) {
	this.dx = 0;
	this.dy = 0;

	this.body = [new SnakeSegment(x, y)];
	for(let i = 0; i < 2; i++)
		this.grow();
	this.movement_queue = [];
}

Snake.prototype.change_dir = function(key_code) {
	switch(key_code) {
		case "KeyW":
			if(this.dy == 0) {
				this.dx = 0;
				this.dy = -1;
				break;
			}
			return false;
		case "KeyS":
			if(this.dy == 0) {
				this.dx = 0;
				this.dy = 1;
				break;
			}
			return false;
		case "KeyA":
			if(this.dx == 0) {
				this.dy = 0;
				this.dx = -1;
				break;
			}
			return false;
		case "KeyD":
			if(this.dx == 0) {
				this.dy = 0;
				this.dx = 1;
				break;
			}
			return false;
		default:
			return false;
	}
	return true;
};

Snake.prototype.grow = function() {
	this.body.push(new SnakeSegment(-1, -1));
};

Snake.prototype.update = function() {

	if(this.movement_queue.length > 0) {
		do {
			var r = this.change_dir(this.movement_queue.pop());
		} while(!r && this.movement_queue.length > 0); // to skip non important moves
	}

	let new_head_pos = this.body[0].get_pos();
	new_head_pos[0] += this.dx;
	new_head_pos[1] += this.dy;

	if(new_head_pos[0] > (WIDTH-1)/10) {
		new_head_pos[0] = 0;
	}
	else if(new_head_pos[0] < 0) {
		new_head_pos[0] = (WIDTH)/10;
	}

	if(new_head_pos[1] > (HEIGHT-1)/10) {
		new_head_pos[1] = 0;
	}
	else if(new_head_pos[1] < 0) {
		new_head_pos[1] = (HEIGHT)/10;
	}

	if(new_head_pos.equals(food)) {
		this.grow();
		deploy_food();
		score++;
		score_display.innerHTML = score;
	}

	ctx.fillStyle = "#00ff77";
	for(let i = this.body.length-1; i > 0; i--) {
		this.body[i].set_pos(this.body[i-1].get_pos());
		if(this.body[i].get_pos().equals(new_head_pos) && (this.dx != 0 || this.dy != 0)) {
			init_game();
		}
		this.body[i].draw();
	}

	this.body[0].set_pos(new_head_pos);
	this.body[0].draw();
};


// Stolen shamelessly from Stack Overflow :p
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

Array.prototype.equals = function (array) {
    if (!array)
        return false;

    
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}
