const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// idea service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer,
      time: moment().format('h:mm:ss a')
    }

    this.ideas.push(idea);

    return idea;
  }
}

// integrate feathers with Express
const app = express(feathers());
// parse json
app.use(express.json());
// config Socket.io realtime APIs
app.configure(socketio()) ;
// enable REST services
app.configure(express.rest());
// register services
app.use('/ideas', new IdeaService());
// connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// publish events to stream
app.publish(data => app.channel('stream'));
// set the port
const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`real time server running on port ${PORT}`));

// test
// app.service('ideas').create({
//   text: 'Cool app',
//   tech: 'Electronjs',
//   viewer: 'Amy'
// });

