import React, { Component } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@material-ui/core';
import Api from './api';

import './App.css';

function addEvent({ state: { events } }, event) {
  return [
    event,
    ...events.slice(0, 19),
  ];
}

class App extends Component {
  state = {
    events: [],
    peers: [],
  };

  onNewConnection(id) {
    const { peers } = this.state;
    let newPeers = [...peers];
    if (!newPeers.includes(id)) {
      newPeers.push(id);
    }
    this.setState({
      peers: newPeers,
      events: addEvent(this, `New connect with id ${id}`),
    });
  }

  onConnectionList(ids) {
    this.setState({
      events: addEvent(this, `Current connections: ${ids.join(',')}`),
    });
  }

  onBroadcast(id, message) {
    this.setState({
      events: addEvent(this, `Received broadcast from ${id}: ${message}`),
    });
  }

  onMessage(id, message) {
    this.setState({
      events: addEvent(this, `Received message from ${id}: ${message}`),
    });
  }

  onDisconnect(id) {
    const { peers } = this.state;
    let newPeers = peers.filter(pid => id !== pid);
    this.setState({
      peers: newPeers,
      events: addEvent(this, `Lost connection with id ${id}`),
    });
  }

  componentDidMount() {
    this.api = new Api();
    this.api.subscribe(this);
  }

  sendBroadcast() {
    const { message } = this.state;
    this.api.sendBroadcast(message);
    this.setState({
      events: addEvent(this, `You sent a broadcast: ${message}`)
    })
  }

  render() {
    const { events } = this.state;
    return (
      <div className="App">
        <div>
          <TextField
            placeholder="Broadcast a message"
            onChange={(e) => this.setState({ message: e.target.value })}
          />
          <Button
            color="primary"
            onClick={() => this.sendBroadcast()}
          >
            Send
          </Button>
        </div>
        <List dense>
          {events.map(event => (
            <ListItem>
              <ListItemText>{event}</ListItemText>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
