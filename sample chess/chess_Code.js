const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const square_Size = 75; 
//setting the square size to 75 keeps the board at 8*8 squares,
//standard chessboard size

//fucntion prints a checkerboard using the dimensions of the canvas element and square_Size const
function checkerboard() {
    //for loops make the grid for the board, drawing squares
    for (let row = 0; row < canvas.height / square_Size; row++){
        for (let collumn = 0; collumn < canvas.width / square_Size; collumn++){
            const x = collumn * square_Size;
            const y = row * square_Size;

            //if statement lets the squares be different colours
            //beige and brown chosen so black and white pieces can be clearly seen on both kinds of squares
            if((row + collumn) % 2 === 0){
                ctx.fillStyle = "beige";
            } else {
                ctx.fillStyle = "brown";
            }

            ctx.fillRect(x, y, square_Size, square_Size);
        }
    }
}

checkerboard();