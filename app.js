const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set correct views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));  // FIXED

// Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));  // FIXED

io.on("connection", function(socket) {
    io.emit("update-user-count", io.engine.clientsCount);
    socket.on("send-location",function(data){
        io.emit("recieve-location",{id:socket.id,...data});
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
        io.emit("update-user-count", io.engine.clientsCount);
    });
});

// Route to render the index.ejs file
app.get("/", function(req, res) {
    res.render("index");  
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
