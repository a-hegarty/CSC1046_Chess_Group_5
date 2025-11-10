const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/chess', express.static(path.join(__dirname, '../MyChess')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

const games = {}; 

wss.on('connection', (ws) => {
  let currentGameId = null;

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    if (msg.type === 'join') {
      const { gameId } = msg;
      currentGameId = gameId;

      if (!games[gameId]) games[gameId] = { players: new Set() };
      games[gameId].players.add(ws);

      console.log(`Client joined game ${gameId}`);
      return;
    }

    if (msg.type === 'move' && currentGameId && games[currentGameId]) {
      console.log(`Move received for game ${currentGameId}: ${msg.move}`);

      for (const player of games[currentGameId].players) {
        if (player !== ws && player.readyState === WebSocket.OPEN) {
          player.send(JSON.stringify({
            type: 'move',
            move: msg.move
          }));
        }
      }
    }
  });

  ws.on('close', () => {
    if (currentGameId && games[currentGameId]) {
      games[currentGameId].players.delete(ws);
      if (games[currentGameId].players.size === 0)
        delete games[currentGameId];
    }
  });
});

app.post('/create-game', (req, res) => {
  const gameId = uuidv4();
  res.json({ gameId });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);



