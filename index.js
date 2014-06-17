var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);


var IP_TO_NAME = {
  '192.168.1.1': "Nikil",
  '192.168.1.2': "Rob",
  '192.168.1.3': "Jason"
};

/*
  For the data being passed back to the client
*/
var KEY_NAME = "name";
var KEY_IP_ADDRESS = "ip";
var KEY_STATUS = "status";
var STATUS_JUST_JOINED = 1;
var STATUS_HERE = 2;
var STATUS_JUST_LEFT = 3;

//Global constant
var previousPeople = [];

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


/*
  Format of update
  Array of people

  [{
      name: "rob",
      ip: "192.160.1.250",
      status: 1 //1 is just joined, 2 is here, 3 is just left
  }]
*/
app.post('/update', function(req, res) {

    console.log("\n\nBEGINNING OF UPDATE");

    //Get the devices
    var devices = JSON.parse(req.body.devices);
    
    //Return a response
    res.end();

    //Helpful prints
    console.log(req.body);
    console.log("number of devices: " + devices.length);
    for(var i=0; i<devices.length; i++)
        console.log(devices[i]);

    //Get the list of people who are in the house
    var people = getPeopleUpdate(devices);

    //Print
    console.log(people);

    //Send out to the sockets
    io.emit('people', people);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


/*
    Helper Functions
*/
function getPeopleUpdate(devices)
{
  //List of current people
  var currentPeople = [];

  //Map the device to a person
  for(var i=0; i<devices.length; i++)
  {
    //Device
    var device = devices[i];

    //Get the name
    var name = "";
    if(device in IP_TO_NAME) name = IP_TO_NAME[device];

    //Add the person
    var newPerson = {};
    newPerson[KEY_NAME] = name;
    newPerson[KEY_IP_ADDRESS] = device;
    newPerson[KEY_STATUS] = STATUS_HERE;
    currentPeople.push(newPerson);
  }

  //Set the status based off of the previous state

  //1. Check to see if these people were there in the state
  for(var i=0; i<currentPeople.length; i++)
  {
    if(wasNotHereLastTime(currentPeople[i]))
      currentPeople[i][KEY_STATUS] = STATUS_JUST_JOINED;
  }

  //If person was here last time but not now
  addPeopleWhoLeft(currentPeople);

  //Update previous people
  previousPeople = currentPeople;

  return currentPeople;
}

/*
  Check to see if the specified person was here in the last scan
*/
function wasNotHereLastTime(person)
{

  //If they were here last time, false
  for(var i=0; i<previousPeople.length; i++)
    if(previousPeople[i][KEY_IP_ADDRESS] == person[KEY_IP_ADDRESS] &&
      previousPeople[i][KEY_STATUS] != STATUS_JUST_LEFT)
      return false;

  //Were not here
  return true;
}


/*
  Add the people who left to the people array
*/
function addPeopleWhoLeft(currentPeople)
{
  //For each person who was here in the previous state
  for(var i=0; i<previousPeople.length; i++){
    
    //Skip the peopel who left in the previous step
    if(previousPeople[i][KEY_STATUS] == STATUS_JUST_LEFT) continue;

    //If the person is not here now, add them as just left
    if(!isHereNow(previousPeople[i], currentPeople))
    {
      //Question: is reference okay?
      var newPerson = {};
      newPerson[KEY_NAME] = previousPeople[i][KEY_NAME];
      newPerson[KEY_IP_ADDRESS] = previousPeople[i][KEY_IP_ADDRESS];
      newPerson[KEY_STATUS] = STATUS_JUST_LEFT;
      currentPeople.push(newPerson);
    }
   
  }
}

/*
  Is here now
*/
function isHereNow(person, currentPeople)
{
  for(var i=0; i<currentPeople.length; i++)
  {
    if(currentPeople[i][KEY_IP_ADDRESS] == person[KEY_IP_ADDRESS] &&
      currentPeople[i][KEY_STATUS] != STATUS_JUST_LEFT)
      return true;
  }
  return false;
}
