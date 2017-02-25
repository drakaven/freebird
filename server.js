const express   = require('express');
const cors      = require('cors');
const http      = require('http');
const app       = express();
app.use(cors());
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);
const uuid      = require('node-uuid');

io.origins('*:*');

server.listen(4000);
console.log('Server listening on port 4000');

let userCount = 0;
let usernames = {};
let votes = {
  songOne: [],
  songTwo: [],
  songThree: []
}

io.on('connection', (client) => {

  console.log('New Client Connected');
  userCount ++;
  console.log(userCount + ' clients connected!');
  io.emit('updateUserCount', { userCount: userCount });


  client.on('event', (data) => {
    console.log(data);
  });

  client.on('setUsername', (user) => {
    console.log('Received username from client', user);
    let id = uuid.v1();
    usernames[id] = user.name;
    console.log('New user added to usernames', usernames);
    io.emit('setUsername', { id: id, name: user.name });
  });

  client.on('setUserVote', (vote) => {
    console.log('Received vote from client', vote);
    for (let song in votes) {
      if (votes[song].indexOf(vote.id) > -1) {
        console.log('Found id');
        let index = song.indexOf(vote.id);
        votes[song].splice(index, 1);
      };
    };
    votes[vote.song].push(vote.id);
    console.log(votes);
  });

  client.on('disconnect', () => {
    console.log('Client disconnected');
    userCount --;
    console.log(userCount + ' clients connected!');
    io.emit('updateUserCount', { userCount: userCount });
  });

});