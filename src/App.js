import React, { Component } from 'react';
import './App.css';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import VideoEmbed from './VideoEmbed.js';
import HostVoteList from './HostVoteList.js';
import Splash from './splash.js';
import Loading from './loading.js';


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playList: { songOne : 'Pib8eYDSFEI', songTwo: 'lgSLz5FeXUg', songThree: 'sOOebk_dKFo' },
      votes: { songOne : [], songTwo: [], songThree: [] },
      view: 'splash',
      upNext: [],
    };

    this.renderView = () => {
      switch(this.state.view) {
        case 'splash':
          return <Splash switcher={this.switcher}/>
        case 'loading':
          return <Loading switcher={this.switcher}/>
        case 'main':
        return (
        <div>
          <VideoEmbed playList={this.state.playList} votes={this.state.votes} />
          <HostVoteList votes={this.state.votes} upNext={this.state.upNext}/>
        </div>
      )
      }
    }
  };

  switcher = (newView) => {
    this.setState({view: newView})
    console.log(this.state.searchResults)
  }


  componentDidMount() {
    console.log('componentDidMount <App />');
    console.log('Opening socket connection');
    // connect to websocket server and listen for messages
    this.ws = io.connect('ws://localhost:4000');

    this.ws.on('updateUserCount', (data) => {
      console.log('Received a message from the server!', data);
      this.setState({ userCount: data.userCount });
    });
    this.ws.on('votes', (data) => {
      console.log('votes', data);
      this.setState({ votes: data.votes});
    });
    this.ws.on('updateUpNext', (upNext) => {
      console.log('updateUpNext', upNext);
      this.setState({ upNext: upNext.data});
      console.log(this.state.upNext);
    });
    this.ws.on('updatePlaylist', (playlist) => {
      console.log('updateplaylist', playlist.data);
    });
  };

  componentWillUnmount() {
    console.log('Closing socket connection');
    this.ws.close();
  };

  getUpNext = () => {
    this.ws.emit('getUpNext');
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          { this.renderView() }
          {this.state.userCount} user(s) in room
        </div>
      </MuiThemeProvider>
    )
  };
};

export default App;
