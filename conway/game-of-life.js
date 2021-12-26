/**
 * Wanna see if I can do it in Linear time using a single-dim array 
 */
window.Conway = (canvas, probState = 0.5, blockSize = 1) => {
    let width, height = 0;
    let generation = 0;
    let board = [];

    const canvasRef = canvas;
    const canvasCtx = canvas.getContext("2d");
    const probailityOfLiving = probState;
    
    let generateRandom = () => {
        return (Math.random() <= probailityOfLiving) ? 1 : 0;
    }

    let newBoard = () => {
        return new Array(Math.floor(width / blockSize) * Math.floor(height / blockSize)).fill(0);
    }

    let _init = () => {
        width = canvasRef.width;
        height = canvasRef.height;
        board = newBoard().map(generateRandom);
        generation = 0;
        canvasCtx.fillStyle = "black";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }

    let logic = (alive, index) => {
        let [real_x, real_y] = getRealCoords(index, width / blockSize);
        let livingNeighbors = 0;
        if(real_x - 1 >= 0) {
            //left;
            livingNeighbors += board[index - 1];
        }
        if(real_x + 1 < width) {
            //right;
            livingNeighbors += board[index + 1];
        }

        if(real_y - 1 >= 0) {
            //top;
            livingNeighbors += board[index - width];
            if(real_x - 1 >= 0) {
                //top-left
                livingNeighbors += board[(index - width) - 1];
            }
            if(real_x + 1 < width) {
                //top-right
                livingNeighbors += board[(index - width) + 1];
            }
        }

        if(real_y + 1 < height) {
            //bottom;
            livingNeighbors += board[index + width];
            if(real_x - 1 >= 0) {
                //bottom-left;
                livingNeighbors += board[(index + width) - 1];
            }
            if(real_x + 1 < width) {
                //bottom-right;
                
                livingNeighbors += board[(index + width) + 1];
            }
        }
        if(alive) {
            return  (livingNeighbors == 2 || livingNeighbors == 3) ? 1 : 0;
        }
        return livingNeighbors == 3 ? 1 : 0;
    }

    let tick = () => {
        let nB = new Array(Math.floor(width / blockSize) * Math.floor(height / blockSize)).fill(0);
        const newBoard = nB.map((_, index) => {
            let alive = logic(board[index], index)
            if(!(board[index] == alive)) {
                draw(alive, index);
            }
            return alive;
        });
        board = newBoard;
    }

    let reset = () => {
        _init();
    }

    let getRealCoords = (index, width) => {
        let real_x = 0;
        let real_y = 0;
        let fakeWidth = Math.floor(width / blockSize);
        real_y = Math.floor(index / width);
        real_x = index - (real_y * width);
        return [real_x, real_y];
    }

    let draw = (alive, index) => {
        let r = (alive) ? 255 : 0;
        let [real_x, real_y] = getRealCoords(index, width / blockSize);
        real_x = (real_x * blockSize);
        real_y = (real_y * blockSize);
        canvasCtx.fillStyle ="rgba("+r+","+r+","+r+","+(1)+")";
        canvasCtx.fillRect(real_x ,real_y ,blockSize,blockSize);
    }

    let game = () => {
        tick();
        draw();
        generation++;
        requestAnimationFrame(game);
    }
    
    _init();
    game();

    return {
        reset : reset
    }
}