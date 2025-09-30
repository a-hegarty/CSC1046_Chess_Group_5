const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const square_Size = 75; 
/*setting the square size to 75 keeps the board at 8*8 squares,
standard chessboard size, on a 600*600 canvas*/

class Square_Button{

    constructor(fillColor){
        this.fillColor = fillColor;
    }

    set_Position(x, y){
        this.x = x;
        this.y = y;
    }

    set_Size(width, height){
        this.width = width;
        this.height = height;
    }

    draw(context){
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

//fucntion prints a checkerboard using the dimensions of the canvas element and square_Size const
function checkerboard() {
    //for loops make the grid for the board, drawing squares
    for (let row = 0; row < canvas.height / square_Size; row++){
        for (let collumn = 0; collumn < canvas.width / square_Size; collumn++){
            const x = collumn * square_Size;
            const y = row * square_Size;

            //if statement lets the squares be different colours
            //grey and beige chosen so black and white pieces can be clearly seen on both kinds of squares
            if((row + collumn) % 2 === 0){
                //ctx.fillStyle = "beige";
                const WhiteSquare = new Square_Button("beige");
                WhiteSquare.set_Position(x, y);
                WhiteSquare.set_Size(square_Size, square_Size);
                WhiteSquare.draw(ctx);
            } else {
                //ctx.fillStyle = "grey";
                const BlackSquare = new Square_Button("grey");
                BlackSquare.set_Position(x, y);
                BlackSquare.set_Size(square_Size, square_Size);
                BlackSquare.draw(ctx);
            }
        }
    }
}

//function gets the coordinates of the mouse cursor on the canvas element
function get_Mouse_Position(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = Math.round(event.clientX - rect.left); 
    // x is displaying a really long decimal for some reason
    // used math.round to round it to the nearest whole number
    let y = event.clientY - rect.top;

    //get rank and file of the square the cursor is on
    let rank = get_Rank(y);
    let file = get_File(x);
    document.getElementById("demo").innerText = "Rank: " + rank + " File: " + file;;
}

//function gets rank of row of board squares
function get_Rank(y_coord){
    let rank = 0;
    if (y_coord < square_Size){ 
        /* if y_coord is strictly less than square_Size, it is in the 8 rank
        if y_coord is between squaresize and 2* squaresize, it is in rank 7 and so on
        same applies for files in function get_File()*/
        rank = 8;
    } else if (square_Size <= y_coord && y_coord < 2 * square_Size){
        rank = 7;
    } else if (2 * square_Size <= y_coord && y_coord < 3 * square_Size){
        rank = 6;
    } else if (3 * square_Size <= y_coord && y_coord < 4 * square_Size){
        rank = 5;
    } else if (4 * square_Size <= y_coord && y_coord < 5 * square_Size){
        rank = 4;
    } else if (5 * square_Size <= y_coord && y_coord < 6 * square_Size){
        rank = 3;
    } else if (6 * square_Size <= y_coord && y_coord < 7 * square_Size){
        rank = 2;
    } else if (7 * square_Size <= y_coord && y_coord < 8 * square_Size){
        rank = 1;
    }
    return rank;
}

// function gets file of collumn of board squares
function get_File(x_coord){
    let file = "";
    if (x_coord < square_Size){
        file = "a";
    } else if (square_Size <= x_coord && x_coord < 2 * square_Size){
        file = "b";
    } else if (2 * square_Size <= x_coord && x_coord < 3 * square_Size){
        file = "c";
    } else if (3 * square_Size <= x_coord && x_coord < 4 * square_Size){
        file = "d";
    } else if (4 * square_Size <= x_coord && x_coord < 5 * square_Size){
        file = "e";
    } else if (5 * square_Size <= x_coord && x_coord < 6 * square_Size){
        file = "f";
    } else if (6 * square_Size <= x_coord && x_coord < 7 * square_Size){
        file = "g";
    } else if (7 * square_Size <= x_coord && x_coord < 8 * square_Size){
        file = "h";
    }
    return file;
}

//function allows plauer to forfeit a game after confirmation
function forfeit(){
   const forfeit_Button = document.getElementById("forfeit");
    
   //on click...
    forfeit_Button.addEventListener("click", function(){
        //...confirn decision...
        let confirm_forfeit = confirm("Are you sure you would like to forfeit this game?");
        if(confirm_forfeit == true){
            // if player wants to forfeit, the game ends
            alert("You have forfeited the game.");
        } else {
            //otherwise play continues as normal
            alert("You have not forfeited the game\nReturning to game");
        }
    }); 
}

canvas.addEventListener("click", function(e){
    get_Mouse_Position(canvas, e);
});

class Pieces {
    conscructor(colour, type, start_file, start_rank){
        this.colour = colour;
        this.type = type;
        this.start_file = start_file;
        this.start_rank = start_rank;
    }
}


function init(){
    checkerboard();
    forfeit();
}

init();