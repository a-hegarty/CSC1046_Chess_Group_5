//importing required libraries
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

//enables cors so frontend can talk to backend
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());

//for post requests
app.use(express.json());

app.use(express.static(path.join(__dirname, '../MyChess')));
//using files from the /public folder
app.use(express.static(path.join(__dirname, '../public')));

//serving the chess client from /MyChess when at /chess
app.use('/chess', express.static(path.join(__dirname, '../MyChess')));

//creates http server
const server = http.createServer(app);

//wss = web socket server , creates web socket server using the http server
const wss = new WebSocket.Server({ server });

//using port 3000
const PORT = 3000;


//there can be multiple games happening at once
const games = {}; 

//this is a helper function for the randomizing pieces on the board
function generateRandomBoard() {
    const pieces = [];
    const files = ["a","b","c","d","e","f","g","h"];

    //helper function
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function placePieces(color, ranks) {
        let availablePositions = [];
        for (let r of ranks) {
            for (let f of files) availablePositions.push({ file: f, rank: r });
        }

        const pieceTypes = ["king", "queen", "rook", "bishop", "knight", "pawn"];
        const counts = { king: 1, queen: 1, rook: 2, bishop: 2, knight: 2, pawn: 8 };
        let allPieces = [];

        for (const type of pieceTypes) {
            for (let i = 0; i < counts[type]; i++) allPieces.push(type);
        }

        allPieces = shuffle(allPieces);

        allPieces.forEach(type => {
            const posIndex = Math.floor(Math.random() * availablePositions.length);
            const pos = availablePositions.splice(posIndex, 1)[0];
            pieces.push({
                colour: color,
                type: type,
                start_file: pos.file,
                start_rank: pos.rank
            });
        });
    }

    //placing on white side
    placePieces("white", [1, 2]);
    
    //placing on black side
    placePieces("black", [7, 8]);

    return pieces;
}


//when client connects to websocket server
wss.on('connection', (ws) => {
  let currentGameId = null;

  //when websocket recieves a message from a client
  ws.on('message', (data) => {
    let msg;
    //parse the json
    try { msg = JSON.parse(data); } catch { return; }

    //if its a join msg
    if (msg.type === 'join') {
        const { gameId } = msg;
        currentGameId = gameId;

        // create game entry
        if (!games[gameId]) {
        games[gameId] = {
            players: new Set(),
            //this is needed so both players see the same board - issues with two randomized boards
            board: generateRandomBoard() 
        };
      }

        const players = games[gameId].players;

        // add client to the game
        players.add(ws);

        // assign color
        const color = players.size === 1 ? 'white' : 'black';
        ws.send(JSON.stringify({ type: 'colorAssignment', color }));

        //sending the same board
        ws.send(JSON.stringify({ type: 'boardSetup', pieces: games[gameId].board }));

        console.log(`Client joined game ${gameId} as ${color}`);
        return;
    }
  });

  //when client disconnects
  ws.on('close', () => {
    if (currentGameId && games[currentGameId]) {
      //remove client from player list
      games[currentGameId].players.delete(ws);
      
      //if theres no players delete the game
      if (games[currentGameId].players.size === 0)
        delete games[currentGameId];
    }
  });
});

//endpoint for creating game
app.post('/create-game', (req, res) => {
  const gameId = uuidv4();
  res.json({ gameId });
});

//starting the http + websocket server
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);



