import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { ChannelResolver, UserResolver } from './resolver.js';
import * as C from './components.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let channelResolver = new ChannelResolver();
let userResolver = new UserResolver();
let channelLoaded = false;
let userLoaded = false;

function renderIfCompleted() {
  if (channelLoaded && userLoaded) {
    ReactDOM.render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router history={hashHistory}>
          <Route path="/" component={C.ChannelSelector} channelResolver={channelResolver}>
            <Route path="channel/:channelName" component={C.DateSelector} channelResolver={channelResolver}>
              <Route path="date/:date" component={C.HistoryView} userResolver={userResolver} />
            </Route>
          </Route>
        </Router>
      </MuiThemeProvider>
    ), document.getElementById('app'));
  }
}

channelResolver.fetch(() => {
  channelLoaded = true;
  renderIfCompleted();
});
userResolver.fetch(() => {
  userLoaded = true;
  renderIfCompleted();
});
