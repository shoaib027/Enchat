const connectToMongo = require('./db')
const express = require('express')
const app = express()
const cors = require('cors')
//Socket IO
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.137.1:3000'],
    // origin: '*',
    methods: ['GET', 'POST']
  }
})

const userToSocketMap = {}
io.on("connection", (socket) => {
  socket.on('authenticate',(userID)=>{
    userToSocketMap[userID] = socket.id
  })
});

const port = 5000
connectToMongo()

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.137.1:3000']
  // origin: '*'
}));

app.use(express.json())
//Available Routes
app.use('/api/auth', require('./routes/auth')(io))
app.use('/api/chat', require('./routes/messages')(io,userToSocketMap))
app.use('/api/search', require('./routes/search'))




httpServer.listen(port, () => {
  console.log(`Enchat is listening on ${port}`)
});

module.exports = {io,userToSocketMap}