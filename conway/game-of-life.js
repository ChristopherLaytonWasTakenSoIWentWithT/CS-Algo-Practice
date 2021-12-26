/**
 * Wanna see if I can do it in Linear time using a single-dim array 
 */
window.Conway = (canvas, probState = 0.5, blockSize = 1) => {
    let width, height = 0;
    const canvasRef = canvas;
    const canvasCtx = canvas.getContext("2d");
    const probailityOfLiving = probState;
    let generation = 0;

    let board = [];
    
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
    }

    let logic = (alive, index) => {
        let [real_x, real_y] = getRealCoords(index, width);
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
            return logic(board[index], index);
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
        real_y = Math.floor(index / fakeWidth);
        real_x = index - (real_y * fakeWidth);
        return [real_x, real_y];
    }

    let draw = () => {
        board.forEach((alive, index) => {
            let r = 0;
            let b = 0;
            let g = 0;
            if(alive) {
                r = 255;
                g = 255;
                b = 255;
            }
            const [real_x, real_y] = getRealCoords(index, width);
            canvasCtx.fillStyle ="rgba("+r+","+g+","+b+","+(1)+")";
            canvasCtx.fillRect(real_x + (blockSize - 1),real_y + (blockSize - 1),blockSize,blockSize);
        });
    }

    let game = () => {
        tick();
        draw();
        generation++;
        requestAnimationFrame(game);
    }
    
    _init();
    game();
    console.log(board);

    return {
        reset : reset
    }
}