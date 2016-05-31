import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import { ChannelResolver, UserResolver } from './resolver.js';
import * as C from './components.jsx';

/* eslint-disable no-unused-vars */
// Polyfills are not used but required
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
/* eslint-enable */

let channelResolver = new ChannelResolver();
let userResolver = new UserResolver();
let channelLoaded = false;
let userLoaded = false;

function renderIfCompleted() {
  if (channelLoaded && userLoaded) {
    ReactDOM.render((
      <Router history={hashHistory}>
        <Route path="/" component={C.Channels} channelResolver={channelResolver}>
          <Route path="channel/:channelName" component={C.DateSelector} channelResolver={channelResolver}>
            <Route path="date/:date" component={C.HistoryView} userResolver={userResolver} />
          </Route>
        </Route>
      </Router>
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
