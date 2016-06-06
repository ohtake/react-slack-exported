import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router';
import { ChannelResolver, UserResolver } from './resolver.js';
import * as C from './components.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import * as svgIcons from 'material-ui/svg-icons';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import * as util from './util.js';

let channelResolver = new ChannelResolver();
let userResolver = new UserResolver();
let channelLoaded = false;
let userLoaded = false;

class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };
    this.handleLeftIconButtonTouchTap = this.handleLeftIconButtonTouchTap.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }
  handleLeftIconButtonTouchTap(/* e */) {
    this.setState({ menuOpened: !this.state.menuOpened });
  }
  handleRequestChange(open /* , reason */) {
    this.setState({ menuOpened: open });
  }
  handleMenuClick() {
    window.setTimeout(() => this.setState({ menuOpened: false }), 200);
  }
  render() {
    const theme = this.context.muiTheme;
    const activeStyle = {
      display: 'block',
      borderLeft: `8px solid ${theme.palette.primary1Color}`,
    };
    return (<div>
      <AppBar
        title="Slack exported"
        onLeftIconButtonTouchTap={this.handleLeftIconButtonTouchTap}
      />
      <Drawer open={this.state.menuOpened} docked={false} onRequestChange={this.handleRequestChange} containerClassName="navigationMenu">
        <List>
          <IndexLink to="/" onClick={this.handleMenuClick} activeStyle={activeStyle}>
            <ListItem primaryText="Home" leftIcon={<svgIcons.ActionHome />} />
          </IndexLink>
          <Divider />
          <Subheader>Channels</Subheader>
          {this.props.route.channelResolver.listChannels().map(c =>
            <Link to={`/channel/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle}>
              <ListItem primaryText={c.name} />
            </Link>
          )}
        </List>
      </Drawer>
      <div style={{ padding: '8px' }}>
        {this.props.children}
      </div>
    </div>);
  }
}
App.propTypes = util.propTypesRoute;
App.contextTypes = {
  router: React.PropTypes.object,
  muiTheme: React.PropTypes.object.isRequired,
};

function renderIfCompleted() {
  if (channelLoaded && userLoaded) {
    ReactDOM.render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router history={hashHistory}>
          <Route path="/" component={App} channelResolver={channelResolver}>
            <IndexRoute component={C.ChannelSelector} channelResolver={channelResolver} />
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
