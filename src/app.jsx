import React from 'react';
import ReactDOM from 'react-dom';
import * as RR from 'react-router';
import {ChannelResolver, UserResolver} from './resolver.js';
import * as C from './components.jsx';

/* eslint-disable no-unused-vars */
// Polyfills are not used but required
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
/* eslint-enable */

let channelResolver = new ChannelResolver();
channelResolver.fetchChannels(() => {
    channelLoaded = true;
    renderIfCompleted();
});
let userResolver = new UserResolver();
userResolver.fetchUsers(() => {
    userLoaded = true;
    renderIfCompleted();
});

let channelLoaded = false;
let userLoaded = false;
function renderIfCompleted() {
    if (channelLoaded && userLoaded) {
        ReactDOM.render((
          <RR.Router history={RR.hashHistory}>
            <RR.Route path="/" component={C.Channels} channelResolver={channelResolver}>
              <RR.Route path="channel/:channelName" component={C.DateSelector} channelResolver={channelResolver}>
                <RR.Route path="date/:date" component={C.HistoryView} userResolver={userResolver}/>
              </RR.Route>
            </RR.Route>
          </RR.Router>
        ), document.getElementById('app'));
    }
}
