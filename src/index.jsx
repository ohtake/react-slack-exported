import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import green from '@material-ui/core/colors/green';

import { ChannelResolver, UserResolver } from './resolver';
import App from './App';

const channelResolver = new ChannelResolver();
const userResolver = new UserResolver();

Promise.all([channelResolver.fetch(), userResolver.fetch()])
  .then(() => {
    const theme = createMuiTheme({
      palette: {
        primary: green,
      },
    });
    document.body.style.color = theme.palette.text.primary;
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.fontFamily = theme.typography.fontFamily;
    const elStyle = document.createElement('style');
    document.head.appendChild(elStyle);
    const stylesheet = elStyle.sheet;
    stylesheet.insertRule(`a { color: ${theme.palette.primary.main}; }`, stylesheet.cssRules.length);
    ReactDOM.render(
      <MuiThemeProvider theme={theme}>
        <HashRouter>
          <App channelResolver={channelResolver} userResolver={userResolver} />
        </HashRouter>
      </MuiThemeProvider>,
      document.getElementById('app'),
    );
  });
