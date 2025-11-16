//Integrating Web Sockets
const params = new URLSearchParams(window.location.search);
const gameId = params.get("gameId");

//error checking back to main menu if there is no game id found
if (!gameId) {
  alert("No game ID found! Returning to menu.");
  window.location.href = "/";
}

// connecting to server
const socket = new WebSocket("ws://localhost:3000");

//opening socket to join game using game id
socket.onopen = () => {
  console.log("Connected to WebSocket server for game:", gameId);
  socket.send(JSON.stringify({ type: "join", gameId }));
};

//closing socket when disconnected
socket.onclose = () => {
  console.log("Disconnected from WebSocket");
};

//socket handling errors by throwing console.error
socket.onerror = (err) => {
  console.error("WebSocket error:", err);
};


//Chess Code Below 

//this code is assigning a user a side / colour
//this is the default
let playerColor = "white"; 
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // server sends assigned color
    if (data.type === "colorAssignment") {
        playerColor = data.color;
        document.getElementById("playerColor").innerText =
            `You are playing as:  ${playerColor.charAt(0).toUpperCase() + playerColor.slice(1)}`;

        //with correct side facing the player
        drawBoardAndPieces();
    }
};


//setting the canvan & context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const square_Size = 75; 
/*setting the square size to 75 keeps the board at 8*8 squares,
standard chessboard size, on a 600*600 px canvas*/


// adding helper functions - this was looked up 

// helper: file letter -> 0..7
function fileToIndex(file) {
  return ["a","b","c","d","e","f","g","h"].indexOf(file);
}
// helper rank number -> 0..7 (rank 8 => 0, rank 1 => 7)
function rankToIndex(rank) {
  return 8 - Number(rank);
}
// convert file+rank to canvas x,y
function coordToXY(file, rank) {
  const x = fileToIndex(file) * square_Size;
  const y = rankToIndex(rank) * square_Size;
  return { x, y };
}


//class for each piece
class Pieces {
    //constructor for a black king would appear as 
    // new Piece(black, King, d, 1);
    constructor(colour, type, start_file, start_rank){
        this.colour = colour;
        this.type = type;
        this.start_file = start_file;
        this.start_rank = start_rank;
        this.is_Captured = false;
        this.img = null; 
    }
}

//class defines each square on the board
class Square_Button{

    constructor(fillColor){
        this.fillColor = fillColor;
    }

    set_Position(x, y){
        this.x = x;
        this.y = y;
    }

    //uses the gets the rank and file of each square
    //this will be unique ot each square
    set_ID(rank, file){
        this.rank = rank;
        this.file = file;
    }

    set_Size(width, height){
        this.width = width;
        this.height = height;
    }

    //default to false
    is_Occupied(bool){
        this.is_Occupied = false;
    }

    //draws the square in the canvas element
    draw(context){
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

//fucntion prints a checkerboard using the dimensions of the canvas element and square_Size const
function checkerboard() {
    //for loops make the grid for the board, drawing squares
    for (let row = 0; row < canvas.height / square_Size; row++){
        for (let column = 0; column < canvas.width / square_Size; column++){
            const x = column * square_Size;
            const y = row * square_Size;

            //if statement lets the squares be different colours
            //grey and beige chosen so black and white pieces can be clearly seen on both kinds of squares
            if((row + column) % 2 === 0){
                //ctx.fillStyle = "beige";
                const WhiteSquare = new Square_Button("beige");
                WhiteSquare.set_Position(x, y);
                WhiteSquare.set_ID(get_Rank(x), get_File(y));
                WhiteSquare.set_Size(square_Size, square_Size);
                WhiteSquare.draw(ctx);
            } else {
                //ctx.fillStyle = "grey";
                const BlackSquare = new Square_Button("brown");
                BlackSquare.set_Position(x, y);
                BlackSquare.set_ID(get_Rank(x), get_File(y));
                BlackSquare.set_Size(square_Size, square_Size);
                BlackSquare.draw(ctx);
            }
        }
    }
}


//actually drawing the piece on the board
function draw_Piece(piece) {
    if (!piece.img || piece.is_Captured) return;

    let fileIndex = "abcdefgh".indexOf(piece.start_file);
    let rankIndex = 8 - piece.start_rank;

    //flip the board
    if (playerColor === "black") {
        fileIndex = 7 - fileIndex;
        rankIndex = 7 - rankIndex;
    }

    const x = fileIndex * square_Size;
    const y = rankIndex * square_Size;

    ctx.drawImage(piece.img, x + 8, y + 8, square_Size - 16, square_Size - 16);
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

// function gets file of column of board squares
function get_File(x_coord){
    //function works the same as get_Rank(), but with chars instead of ints
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

//function adds a piece to a square on the board
//might use this later?
function add_Piece(){

}

//storing the images
const pieceImages = { white: {}, black: {} };
const pieces = [];


// loads image of the specific piece from their folder
function loadPieceImage(colour, type) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = `/chess/pieces/${colour}/${type}.png`;
    });
}

//abstracting out of start game
function drawBoardAndPieces() {
    checkerboard();
    for (const p of pieces) {
        draw_Piece(p);
    }
}


//function will start a game with every piece but the kings randomised
async function start_Game() {

    //load each one once and call the function
    const types = ["pawn", "rook", "knight", "bishop", "queen", "king"];
    for (const colour of ["white", "black"]) {
        for (const type of types) {
            pieceImages[colour][type] = await loadPieceImage(colour, type);
        }
    }

    //starting
    pieces.length = 0; 

    //the pawns at the front
    for (let i = 0; i < 8; i++) {
        const file = "abcdefgh"[i];
        pieces.push(new Pieces("white", "pawn", file, 2));
        pieces.push(new Pieces("black", "pawn", file, 7));
    }

    //whitee
    pieces.push(new Pieces("white", "rook", "a", 1));
    pieces.push(new Pieces("white", "knight", "b", 1));
    pieces.push(new Pieces("white", "bishop", "c", 1));
    pieces.push(new Pieces("white", "queen", "d", 1));
    pieces.push(new Pieces("white", "king", "e", 1));
    pieces.push(new Pieces("white", "bishop", "f", 1));
    pieces.push(new Pieces("white", "knight", "g", 1));
    pieces.push(new Pieces("white", "rook", "h", 1));

    //black
    pieces.push(new Pieces("black", "rook", "a", 8));
    pieces.push(new Pieces("black", "knight", "b", 8));
    pieces.push(new Pieces("black", "bishop", "c", 8));
    pieces.push(new Pieces("black", "queen", "d", 8));
    pieces.push(new Pieces("black", "king", "e", 8));
    pieces.push(new Pieces("black", "bishop", "f", 8));
    pieces.push(new Pieces("black", "knight", "g", 8));
    pieces.push(new Pieces("black", "rook", "h", 8));

    // attach images to each piece
    for (const p of pieces) {
        p.img = pieceImages[p.colour][p.type];
    }

    // draw board and the pieces
    drawBoardAndPieces();
}


//function allows player to forfeit a game at any point
function forfeit(){
   const forfeit_Button = document.getElementById("forfeit");
    
   //on click...
    forfeit_Button.addEventListener("click", function(){
        //...confirm decision...
        let confirm_forfeit = confirm("Are you sure you would like to forfeit this game?");
        if(confirm_forfeit == true){
            // if player wants to forfeit, the game ends and a new game starts
            alert("You have forfeited the game.");
            start_Game();
        } else {
            //otherwise play continues as normal
            alert("You have not forfeited the game\nReturning to game");
        }
    }); 
}


async function init(){
    checkerboard();
    //have to wait for the inages
    await start_Game(); 
    forfeit();
}

init();