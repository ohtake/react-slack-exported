import React from 'react';
import ReactDOM from 'react-dom';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import createHashHistory from 'history/lib/createHashHistory';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { ChannelResolver, UserResolver } from './resolver.js';
import App from './App.jsx';
import ChannelSelector from './ChannelSelector.jsx';
import DateSelector from './DateSelector.jsx';
import HistoryView from './HistoryView.jsx';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let channelResolver = new ChannelResolver();
let userResolver = new UserResolver();

Promise.all([channelResolver.fetch(), userResolver.fetch()])
.then(() => {
  const theme = getMuiTheme();
  document.body.style.color = theme.palette.textColor;
  document.body.style.backgroundColor = theme.palette.canvasColor;
  document.body.style.fontFamily = theme.fontFamily;
  const elStyle = document.createElement('style');
  document.head.appendChild(elStyle);
  const stylesheet = elStyle.sheet;
  stylesheet.insertRule(`a { color: ${theme.palette.primary2Color}; }`, stylesheet.cssRules.length);
  ReactDOM.render((
    <MuiThemeProvider muiTheme={theme}>
      <Router history={useRouterHistory(createHashHistory)({ queryKey: false })}>
        <Route path="/" component={App} channelResolver={channelResolver}>
          <IndexRoute component={ChannelSelector} channelResolver={channelResolver} />
          <Route path="channel/:channelName" component={DateSelector} channelResolver={channelResolver}>
            <Route path="date/:date" component={HistoryView} userResolver={userResolver} />
          </Route>
        </Route>
      </Router>
    </MuiThemeProvider>
  ), document.getElementById('app'));
});
