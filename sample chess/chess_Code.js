const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const square_Size = 50; 
//setting the square size to 50 locks keeps the board at 8*8 squares,
//standard chessboard size

//fucntion prints a checkerboard proportional to the dimensions of the canvas element
function checkerboard() {
    for (let row = 0; row < canvas.height / square_Size; row++){
        for (let collumn = 0; collumn < canvas.width / square_Size; collumn++){
            const x = collumn * square_Size;
            const y = row * square_Size;

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