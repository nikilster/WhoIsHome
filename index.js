var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

//app.use(express.urlencoded());
//app.use(express.multipart());
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/test', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
    console.log('a user connected');
});

app.post('/update', function(req, res) {
        console.log(req.body[0]);
        
    // ...
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

