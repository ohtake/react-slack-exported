import React from 'react';
import ReactDOM from 'react-dom';
import HashRouter from 'react-router-dom/HashRouter';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ChannelResolver, UserResolver } from './resolver';
import App from './App';

const channelResolver = new ChannelResolver();
const userResolver = new UserResolver();

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
        <HashRouter>
          <App channelResolver={channelResolver} userResolver={userResolver} />
        </HashRouter>
      </MuiThemeProvider>
    ), document.getElementById('app'));
  });
